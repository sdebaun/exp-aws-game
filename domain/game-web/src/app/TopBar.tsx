import { User } from "@auth0/nextjs-auth0/types";
import { AccountEntity, DemenseEntity } from "../db/entities";
import { EntityItem } from "electrodb";
import { CurrentUser } from "./CurrentUser";


export async function TopBar({ user, account, demense }: { 
  user: User | null; 
  account: EntityItem<typeof AccountEntity> | null;
  demense: EntityItem<typeof DemenseEntity> | null;
}) {
  return (
    <nav className='bg-slate-900 text-white px-6 py-4 shadow-xl border-b border-slate-800'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
        <h1 className='text-xl font-bold tracking-wide'>
          Experimental AWS Game
        </h1>
        <div className='flex items-center gap-4'>
          {user && account ? (
            <CurrentUser {...{user, account, demense}} />
          ) : !user ? (
            <a href="/auth/login" className='inline-block px-4 py-2 text-sm font-medium bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-all duration-200 hover:shadow-lg'>Login</a>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
