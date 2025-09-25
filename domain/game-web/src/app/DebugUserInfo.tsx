import { User } from "@auth0/nextjs-auth0/types";
import { AccountEntity } from "../db/entities";
import { EntityItem } from "electrodb";

export function DebugUserInfo({ user, account }: { 
  user: User | null;
  account: EntityItem<typeof AccountEntity> | null;
}) {
  return (
    <div className="mt-16 p-4 bg-slate-900 rounded-lg">
      <h3 className="text-sm font-mono text-slate-500 mb-2">Debug Info:</h3>
      <pre className="text-xs text-slate-600 overflow-x-auto">
{JSON.stringify({ user, account }, null, 2)}
      </pre>
    </div>
  );
}