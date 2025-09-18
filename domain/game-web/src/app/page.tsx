import Image from "next/image";
import Link from "next/link";
import { auth0 } from "../../../../integrations/auth0";
import { User } from "@auth0/nextjs-auth0/types";

export async function TopBar({user}: {user: User | null}) {
  return (
    <nav className='bg-slate-900 text-white px-6 py-4 shadow-xl border-b border-slate-800'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
        <h1 className='text-xl font-bold tracking-wide'>
          Experimental AWS Game
        </h1>
        <div className='flex items-center gap-4'>
          { user ? (
            <>
              <div className='flex items-center gap-2'>
                <Image 
                  src={user.picture || '/default-avatar.png'} 
                  alt={user.name || 'User'} 
                  width={32}
                  height={32}
                  className='rounded-full ring-2 ring-slate-700' 
                />
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
  )
}

export async function HomeUser({user}: {user: User}) {
  // TODO: Fetch user's characters and stories from database
  const userCharacters = []; // Mock empty for now
  const userStories = [];
  
  return (<div className="p-8 max-w-7xl mx-auto">
    {/* Characters Section */}
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">My Characters</h2>
        <Link 
          href="/character/new" 
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg text-sm"
        >
          + Create Character
        </Link>
      </div>
      
      {userCharacters.length === 0 ? (
        <div className="bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">🎭</div>
          <p className="text-slate-400 mb-4">You don&apos;t have any characters yet!</p>
          <p className="text-slate-500 text-sm mb-6">Characters are your avatars in the game world. Create your first character to begin.</p>
          <Link 
            href="/character/new" 
            className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg"
          >
            Create Your First Character
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Character cards will go here */}
        </div>
      )}
    </section>
    
    {/* Stories Section */}
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">My Stories</h2>
        <div className="flex gap-4">
          <button 
            disabled={userCharacters.length === 0}
            className={`font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm ${
              userCharacters.length === 0 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-cyan-600 hover:bg-cyan-500 text-white hover:shadow-lg'
            }`}
          >
            + Create Story
          </button>
          <button 
            disabled={userCharacters.length === 0}
            className={`font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm ${
              userCharacters.length === 0 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            Join Story
          </button>
        </div>
      </div>
      
      {userStories.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
          <p className="text-slate-400">
            {userCharacters.length === 0 
              ? "Create a character first to start playing stories!" 
              : "No active stories. Create a new story or join an existing one!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Story cards will go here */}
        </div>
      )}
    </section>
  </div>)
}

export async function HomeAnon() {
  return (<div className="p-8">
    <h1 className="text-3xl font-bold text-white">Stories Page</h1>
  </div>)
}

export default async function Home() {
  const session = await auth0.getSession();
  const user = session ? session.user : null

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar user={user}/>
      <div className="max-w-7xl mx-auto">
        {user ? <HomeUser {...{user}}/> : <HomeAnon/> }
      </div>
    </div>
  )
}
