"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({ 
  characterId, 
  characterName,
  deleteCharacter 
}: { 
  characterId: string;
  characterName: string;
  deleteCharacter: (characterId: string) => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete ${characterName}?`);
    if (!confirmed) return;
    
    console.log(`[DeleteButton] Deleting character ${characterId}...`);
    try {
      setIsDeleting(true);
      const result = await deleteCharacter(characterId);
      console.log("[DeleteButton] Delete result:", result);
      router.refresh();
    } catch (error) {
      console.error("[DeleteButton] Failed to delete character:", error);
      alert("Failed to delete character. Check console for details.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isDeleting}
      className={`px-3 py-1 text-xs rounded transition-opacity ${
        isDeleting 
          ? "bg-gray-600 cursor-not-allowed" 
          : "bg-red-600 hover:bg-red-700"
      } text-white`}
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}