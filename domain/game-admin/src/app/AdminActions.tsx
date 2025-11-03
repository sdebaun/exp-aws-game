"use client";

import { useState } from "react";
import { AsyncButton } from "../components/AsyncButton";

interface AdminActionsProps {
  generateBatchAction: (batchSize: number) => Promise<{ requested: number; successful: number; failed: number }>;
  purgeAllAction: () => Promise<{ purgedCount: number }>;
}

export function AdminActions({ generateBatchAction, purgeAllAction }: AdminActionsProps) {
  const [batchSize, setBatchSize] = useState(1);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={10}
          value={batchSize}
          onChange={(e) => setBatchSize(Number.parseInt(e.target.value) || 1)}
          className="w-16 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm"
        />
        <AsyncButton
          action={() => generateBatchAction(batchSize)}
          variant="success"
          loadingContent="Generating..."
          onSuccess={(result) => {
            const { requested, successful, failed } = result as { requested: number; successful: number; failed: number };
            alert(`Generation complete!\nRequested: ${requested}\nSuccessful: ${successful}\nFailed: ${failed}`);
            window.location.reload(); // Refresh to show new characters
          }}
        >
          Generate
        </AsyncButton>
      </div>
      <AsyncButton
        action={purgeAllAction}
        variant="danger"
        confirm={{
          type: "double",
          first: "⚠️ WARNING: This will DELETE ALL CHARACTERS. Are you absolutely sure?",
          second: "🔥 This action is IRREVERSIBLE. All characters will be DESTROYED. Continue?",
        }}
        className="py-2 px-6 shadow-lg hover:scale-105 active:scale-95 transition-all"
        onSuccess={(result) => {
          const { purgedCount } = result as { purgedCount: number };
          alert(`Purge complete. ${purgedCount || 0} characters eliminated.`);
        }}
        loadingContent={
          <span className="flex items-center gap-2">
            <span className="animate-spin">💀</span>
            PURGING...
          </span>
        }
      >
        <span className="flex items-center gap-2">☠️ PURGE ALL</span>
      </AsyncButton>
      <a href="/auth/logout" className="text-red-500 hover:text-red-400 transition text-sm">
        Logout
      </a>
    </div>
  );
}