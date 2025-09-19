import { User } from "@auth0/nextjs-auth0/types";
import Image from "next/image";


export async function TopBar({ user }: { user: User | null; }) {
  return (
    <nav className='bg-slate-900 text-white px-6 py-4 shadow-xl border-b border-slate-800'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
        <h1 className='text-xl font-bold tracking-wide'>
          Experimental AWS Game
        </h1>
        <div className='flex items-center gap-4'>
          {user ? (
            <>
              <div className='flex items-center gap-2'>
                <Image
                  src={user.picture || '/default-avatar.png'}
                  alt={user.name || 'User'}
                  width={32}
                  height={32}
                  className='rounded-full ring-2 ring-slate-700' />
                <span className='text-sm font-medium'>{user.name}</span>
              </div>
              <a href="/auth/logout" className='inline-block px-4 py-2 text-sm font-medium bg-slate-700 hover:bg-slate-600 rounded-lg transition-all duration-200 hover:shadow-lg'>Logout</a>
            </>
          ) : (
            <a href="/auth/login" className='inline-block px-4 py-2 text-sm font-medium bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-all duration-200 hover:shadow-lg'>Login</a>
          )}
        </div>
      </div>
    </nav>
  );
}
