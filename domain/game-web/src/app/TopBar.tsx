import { User } from "@auth0/nextjs-auth0/types";
import { AccountEntity } from "../db/entities";
import { EntityItem } from "electrodb";
import { CurrentUser } from "./CurrentUser";
import Link from "next/link";


export async function TopBar({ user, account }: { 
  user: User | null; 
  account: EntityItem<typeof AccountEntity> | null;
}) {
  return (
    <nav className='bg-slate-900 text-white px-6 py-4 shadow-xl border-b border-slate-800'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
        <Link href="/" className='text-xl font-bold tracking-wide hover:text-cyan-400 transition-colors'>
          River of Souls
        </Link>
        <div className='flex items-center gap-4'>
          {user && account ? (
            <CurrentUser {...{user, account}} />
          ) : !user ? (
            <a href="/auth/login" className='inline-block px-4 py-2 text-sm font-medium bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-all duration-200 hover:shadow-lg'>Login</a>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
