"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PurgeButton({ purgeAll }: { purgeAll: () => Promise<any> }) {
  const [isPurging, setIsPurging] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    // Double confirmation - reasonable paranoia
    const confirm1 = window.confirm("⚠️ WARNING: This will DELETE ALL CHARACTERS. Are you absolutely sure?");
    if (!confirm1) return;
    
    const confirm2 = window.confirm("🔥 This action is IRREVERSIBLE. All characters will be DESTROYED. Continue?");
    if (!confirm2) return;

    console.log("[PurgeButton] PURGE INITIATED BY USER");
    try {
      setIsPurging(true);
      const result = await purgeAll();
      console.log("[PurgeButton] Purge result:", result);
      alert(`Purge complete. ${result.purgedCount || 0} characters eliminated.`);
      router.refresh();
    } catch (error) {
      console.error("[PurgeButton] Purge failed:", error);
      alert("Purge failed. Check console for details.");
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isPurging}
      className={`font-bold py-2 px-6 rounded transition-all ${
        isPurging 
          ? "bg-gray-600 cursor-not-allowed animate-pulse" 
          : "bg-red-700 hover:bg-red-800 hover:scale-105 active:scale-95"
      } text-white shadow-lg`}
    >
      {isPurging ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">💀</span>
          PURGING...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          ☠️ PURGE ALL
        </span>
      )}
    </button>
  );
}