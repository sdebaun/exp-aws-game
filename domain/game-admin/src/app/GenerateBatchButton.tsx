"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GenerateBatchButton({ generateBatch }: { generateBatch: () => Promise<void> }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    console.log("[GenerateBatchButton] Button clicked!");
    try {
      setIsGenerating(true);
      console.log("[GenerateBatchButton] Calling generateBatch server action...");
      const result = await generateBatch();
      console.log("[GenerateBatchButton] Server action result:", result);
      console.log("[GenerateBatchButton] Refreshing page...");
      router.refresh(); // Refresh the page to show new characters
    } catch (error) {
      console.error("[GenerateBatchButton] Failed to generate batch:", error);
      alert("Failed to generate batch. Check console for details.");
    } finally {
      setIsGenerating(false);
      console.log("[GenerateBatchButton] Generation complete");
    }
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isGenerating}
      className={`font-bold py-2 px-4 rounded ${
        isGenerating 
          ? "bg-gray-600 cursor-not-allowed" 
          : "bg-green-600 hover:bg-green-700"
      } text-white`}
    >
      {isGenerating ? "Generating..." : "Generate Batch"}
    </button>
  );
}