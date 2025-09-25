// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../sst-env.d.ts" />

import { auth0 } from "@integrations/auth0";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { Resource } from "sst";
import type { EntityItem } from "electrodb";
import { CharacterEntity } from "../../../content/character/entity";
import { GenerateBatchButton } from "./GenerateBatchButton";
import { CharacterPanel } from "./CharacterPanel";
import { PurgeButton } from "./PurgeButton";

type Character = EntityItem<typeof CharacterEntity>;

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

async function generateBatch() {
  "use server";
  
  console.log("[generateBatch] Starting batch generation...");
  console.log("[generateBatch] Function name:", Resource.CharacterBatchGenerator.name);
  
  const lambda = new LambdaClient({});
  const response = await lambda.send(new InvokeCommand({
    FunctionName: Resource.CharacterBatchGenerator.name,
  }));
  
  console.log("[generateBatch] Lambda response:", response.$metadata.httpStatusCode);
  
  if (!response.Payload) {
    console.error("[generateBatch] No payload in response");
    throw new Error("Failed to generate batch");
  }
  
  const result = JSON.parse(new TextDecoder().decode(response.Payload));
  console.log("[generateBatch] Batch generation result:", result);
  
  return result;
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
          <div className="flex items-center gap-4">
            <GenerateBatchButton generateBatch={generateBatch} />
            <PurgeButton purgeAll={purgeAll} />
            <a href="/auth/logout" className="text-red-500 hover:text-red-400 transition text-sm">
              Logout
            </a>
          </div>
        </div>
      </div>

      {/* Character Panel */}
      <CharacterPanel characters={characters} deleteCharacter={deleteCharacter} />

      <pre>
        {JSON.stringify(session.user, null, 2)}
      </pre>
    </div>
  );
}