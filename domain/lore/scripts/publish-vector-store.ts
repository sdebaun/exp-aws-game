import OpenAI from "openai";
import { glob } from "glob";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), "../../.env.local") });

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY not found in environment variables");
  console.error("   Make sure you have a .env.local file in the project root");
  process.exit(1);
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VECTOR_STORE_NAME = "game-lore";

async function publishLoreToVectorStore() {
  console.log("🚀 Starting lore vector store update...");

  try {
    // Step 1: Find all markdown files in the content directory
    const contentDir = path.join(__dirname, "../content");
    const files = await glob("**/*.md", { cwd: contentDir });

    if (files.length === 0) {
      console.log("⚠️  No markdown files found in content directory");
      return;
    }

    console.log(`📄 Found ${files.length} markdown files`);

    // Step 2: Upload all files first using the Files API
    const uploadedFileIds = [];

    for (const file of files) {
      const filePath = path.join(contentDir, file);
      const content = await fs.readFile(filePath);
      const fileName = path.basename(file);

      console.log(`📤 Uploading ${fileName}...`);

      // Upload file to OpenAI
      const uploadedFile = await client.files.create({
        file: new File([content], fileName, { type: "text/plain" }),
        purpose: "assistants",
      });

      console.log(`✅ Uploaded ${fileName} with ID: ${uploadedFile.id}`);
      uploadedFileIds.push(uploadedFile.id);
    }

    // Step 3: Check if vector store exists
    const stores = await client.vectorStores.list();
    const existingStore = stores.data.find((store) =>
      store.name === VECTOR_STORE_NAME
    );

    let vectorStore;

    if (existingStore) {
      console.log(`♻️  Found existing vector store: ${existingStore.id}`);

      // Delete all existing files from the vector store
      const existingFiles = await client.vectorStores.files.list(
        existingStore.id,
      );
      console.log(
        `🗑️  Found ${existingFiles.data.length} existing files to remove`,
      );

      for (const file of existingFiles.data) {
        await client.vectorStores.files.delete(file.id, {
          vector_store_id: existingStore.id,
        });
        // Also delete the file itself to clean up
        try {
          await client.files.delete(file.id);
        } catch (e) {
          // File might already be deleted
        }
      }

      // Add new files to existing store using batch
      if (uploadedFileIds.length > 0) {
        console.log("🔗 Adding new files to vector store...");
        const batch = await client.vectorStores.fileBatches.create(
          existingStore.id,
          {
            file_ids: uploadedFileIds,
          },
        );

        vectorStore = existingStore;

        // Wait for batch to complete
        await waitForBatchCompletion(existingStore.id, batch.id);
      }
    } else {
      // Create new vector store with files
      console.log("✨ Creating new vector store with files...");
      vectorStore = await client.vectorStores.create({
        name: VECTOR_STORE_NAME,
        file_ids: uploadedFileIds,
      });

      // Wait for vector store to be ready
      await waitForVectorStoreReady(vectorStore.id);
    }

    console.log("✅ Vector store updated successfully!");
    console.log(`📊 Store ID: ${vectorStore?.id}`);

    // Save vector store ID for use in the application
    const configPath = path.join(__dirname, "../vector-store-config.json");
    await fs.writeFile(
      configPath,
      JSON.stringify(
        {
          vectorStoreId: vectorStore?.id,
          name: VECTOR_STORE_NAME,
          updatedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
    );
    console.log(`💾 Saved vector store config to ${configPath}`);
  } catch (error) {
    console.error("❌ Error publishing lore:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    process.exit(1);
  }
}

async function waitForBatchCompletion(vectorStoreId: string, batchId: string) {
  console.log("⏳ Waiting for batch processing to complete...");

  while (true) {
    const batch = await client.vectorStores.fileBatches.retrieve(
      batchId,
      { vector_store_id: vectorStoreId },
    );

    console.log(
      `⏳ Batch status: ${batch.status} (${batch.file_counts.completed}/${batch.file_counts.total} files)`,
    );

    if (batch.status === "completed") {
      console.log(
        `✅ Batch completed: ${batch.file_counts.completed} files processed`,
      );
      break;
    } else if (batch.status === "failed") {
      throw new Error(
        `Batch processing failed: ${batch.file_counts.failed} files failed`,
      );
    } else if (batch.status === "cancelled") {
      throw new Error("Batch processing was cancelled");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

async function waitForVectorStoreReady(vectorStoreId: string) {
  console.log("⏳ Waiting for vector store to be ready...");

  while (true) {
    const store = await client.vectorStores.retrieve(vectorStoreId);

    console.log(
      `⏳ Vector store status: ${store.status} (${store.file_counts.completed}/${store.file_counts.total} files)`,
    );

    if (store.status === "completed") {
      console.log(
        `✅ Vector store ready: ${store.file_counts.completed} files processed`,
      );
      break;
    } else if (store.status === "expired") {
      throw new Error("Vector store expired before completion");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

// Run the script
publishLoreToVectorStore();
