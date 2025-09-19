'use client';

import { User } from "@auth0/nextjs-auth0/types";
import { AccountEntity, DemenseEntity } from "../db/entities";
import { EntityItem } from "electrodb";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { addInk } from "./actions";

export function CurrentUser({ user, account, demense }: { 
  user: User;
  account: EntityItem<typeof AccountEntity>;
  demense: EntityItem<typeof DemenseEntity> | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const displayName = demense ? demense.name : user.name;
  const hasCustomAvatar = demense?.imageUrl;
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-slate-800 rounded-lg px-2 py-1.5 transition-colors"
      >
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
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-1 z-50">
          <div className="px-4 py-2 border-b border-slate-700">
            <div className="text-sm font-medium text-white">{user.name}</div>
            <div className="text-xs text-slate-400">{user.email}</div>
          </div>
          
          <form action={addInk}>
            <button
              type="submit"
              className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              💰 Add 1000 Ink
            </button>
          </form>
          
          <a
            href="/auth/logout"
            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            🚪 Logout
          </a>
        </div>
      )}
    </div>
  );
}