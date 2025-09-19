import { User } from "@auth0/nextjs-auth0/types";
import { AccountEntity, DemenseEntity } from "../db/entities";
import { EntityItem } from "electrodb";
import Image from "next/image";

export function CurrentUser({ user, account, demense }: { 
  user: User;
  account: EntityItem<typeof AccountEntity>;
  demense: EntityItem<typeof DemenseEntity> | null;
}) {
  const displayName = demense ? demense.name : user.name;
  const hasCustomAvatar = demense?.imageUrl;
  
  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <div className="text-sm font-medium">{displayName}</div>
        <div className="flex items-center justify-end gap-1 mt-0.5">
          <span className="text-xs text-slate-400">Ink</span>
          <span className="text-xs font-bold text-cyan-400">{account.ink}</span>
        </div>
      </div>
      <div className="relative w-10 h-10 flex-shrink-0">
        {hasCustomAvatar ? (
          <img
            src={demense.imageUrl}
            alt={demense.name}
            className="w-full h-full rounded-full ring-2 ring-cyan-600 object-cover"
          />
        ) : (
          <Image
            src={user.picture || '/default-avatar.png'}
            alt={user.name || 'User'}
            fill
            className="rounded-full ring-2 ring-slate-700 object-cover"
          />
        )}
      </div>
    </div>
  );
}