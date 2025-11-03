// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../sst-env.d.ts" />

import { getAuth0Client } from "@integrations/auth0";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { Resource } from "sst";
import type { Character } from "../../../content/schemas";
import { AdminActions } from "./AdminActions";
import { CharacterPanel } from "./CharacterPanel";

async function getCharacters(): Promise<{ characters: Character[], count: number }> {
  "use server";
  
  console.log("[getCharacters] Starting to fetch characters...");
  
  const lambda = new LambdaClient({});
  const response = await lambda.send(new InvokeCommand({
    FunctionName: Resource.ListCharacters.name,
  }));
  
  console.log("[getCharacters] Lambda response received:", response.$metadata.httpStatusCode);
  
  if (!response.Payload) {
    console.log("[getCharacters] No payload in response");
    return { characters: [], count: 0 };
  }
  
  const result = JSON.parse(new TextDecoder().decode(response.Payload));
  console.log("[getCharacters] Lambda result:", result);
  
  const body = JSON.parse(result.body);
  console.log("[getCharacters] Returning", body.count, "characters");
  
  return body;
}

async function generateBatch(batchSize: number) {
  "use server";

  console.log(`[generateBatch] Invoking CharacterGenerator ${batchSize} times in parallel...`);

  const lambda = new LambdaClient({});

  // Invoke the single-character generator N times in parallel
  // Using RequestResponse to wait for all completions before returning
  const promises = Array(batchSize).fill(0).map((_, i) => {
    console.log(`[generateBatch] Triggering invocation ${i + 1}/${batchSize}`);
    return lambda.send(new InvokeCommand({
      FunctionName: Resource.CharacterGenerator.name,
      InvocationType: "RequestResponse", // Block and wait for completion
    }));
  });

  const results = await Promise.all(promises);

  // Parse results to count successes/failures
  let successful = 0;
  let failed = 0;

  for (const result of results) {
    if (result.Payload) {
      const payload = JSON.parse(new TextDecoder().decode(result.Payload));
      if (payload.statusCode === 200) {
        successful++;
      } else {
        failed++;
      }
    } else {
      failed++;
    }
  }

  console.log(`[generateBatch] Completed: ${successful} successful, ${failed} failed`);

  return { requested: batchSize, successful, failed };
}

async function deleteCharacter(characterId: string) {
  "use server";
  
  console.log("[deleteCharacter] Deleting character:", characterId);
  
  const lambda = new LambdaClient({});
  const response = await lambda.send(new InvokeCommand({
    FunctionName: Resource.DeleteCharacter.name,
    Payload: JSON.stringify({ characterId }),
  }));
  
  console.log("[deleteCharacter] Lambda response:", response.$metadata.httpStatusCode);
  
  if (!response.Payload) {
    console.error("[deleteCharacter] No payload in response");
    throw new Error("Failed to delete character");
  }
  
  const result = JSON.parse(new TextDecoder().decode(response.Payload));
  console.log("[deleteCharacter] Delete result:", result);
  
  return result;
}

async function purgeAll() {
  "use server";
  
  console.log("[purgeAll] NUCLEAR OPTION ACTIVATED");
  
  const lambda = new LambdaClient({});
  const response = await lambda.send(new InvokeCommand({
    FunctionName: Resource.PurgeAllCharacters.name,
  }));
  
  console.log("[purgeAll] Lambda response:", response.$metadata.httpStatusCode);
  
  if (!response.Payload) {
    console.error("[purgeAll] No payload in response");
    throw new Error("Failed to purge");
  }
  
  const payloadString = new TextDecoder().decode(response.Payload);
  console.log("[purgeAll] Raw payload:", payloadString);
  
  const lambdaResponse = JSON.parse(payloadString);
  const result = JSON.parse(lambdaResponse.body);
  
  console.log("[purgeAll] Purge result:", result);
  
  return result;
}

export default async function AdminHome() {
  const auth0 = await getAuth0Client();
  const session = await auth0.getSession();

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-950">
        <h1 className="text-4xl font-bold mb-8 text-white">Game Admin Panel</h1>
        <p className="text-gray-400 mb-4">Please log in to access admin features</p>
        <a href="/auth/login" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition">
          Login
        </a>
      </div>
    );
  }

  // Fetch characters from content domain
  const { characters } = await getCharacters();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Game Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome, {session.user.name || session.user.email}</p>
          </div>
          <AdminActions generateBatchAction={generateBatch} purgeAllAction={purgeAll} />
        </div>
      </div>

      {/* Character Panel */}
      <CharacterPanel characters={characters} deleteCharacterAction={deleteCharacter} />

      <pre>
        {JSON.stringify(session.user, null, 2)}
      </pre>
    </div>
  );
}