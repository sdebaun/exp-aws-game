import Link from "next/link";
import { User } from "@auth0/nextjs-auth0/types";
import { AccountEntity } from "../db/entities";
import { EntityItem } from "electrodb";
// import { destroyDemense } from "./actions"; // TODO: restore when demense is back

export async function HomeUser({user, account}: {user: User, account: EntityItem<typeof AccountEntity>}) {
  // TODO: Fetch user's characters and stories from database
  const userCharacters = []; // Mock empty for now
  const userStories = [];
  const hasInk = (account.ink ?? 0) > 0;
  const isNewUser = userCharacters.length === 0; // TODO: also check demense when restored
  
  return (<div className="p-8 max-w-7xl mx-auto">
    {/* Welcome Banner for New Users */}
    {isNewUser && (
      <section className="mb-12">
        <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-700/50 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-4">Welcome to the Game!</h1>
          <p className="text-lg text-slate-300 mb-6">
            A unique multiplayer experience where your actions and conversations with other players 
            are transformed into AI-generated narratives. Choose your path:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Player Path */}
            <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⚔️</span>
                <h3 className="text-xl font-bold text-cyan-400">Become a Player</h3>
              </div>
              <ul className="text-slate-300 space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 mt-1">•</span>
                  <span>Create unique characters with AI-generated portraits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 mt-1">•</span>
                  <span>Join multi-day story runs with other players</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 mt-1">•</span>
                  <span>Watch your actions become epic narratives</span>
                </li>
              </ul>
              <Link 
                href="/demense/new" 
                className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Start Your Journey →
              </Link>
            </div>
            
            {/* Spectator Path */}
            <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📖</span>
                <h3 className="text-xl font-bold text-purple-400">Be a Spectator</h3>
              </div>
              <ul className="text-slate-300 space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Read AI-generated stories from active games</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Vote on challenges and story directions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Support your favorite players with Ink</span>
                </li>
              </ul>
              <Link 
                href="/stories" 
                className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Browse Stories →
              </Link>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
            <p className="text-sm text-slate-400">
              <span className="text-cyan-400 font-semibold">Your Ink Balance: {account.ink ?? 0} 💧</span>
              {' • '}
              {hasInk ? (
                "Use Ink to create content, vote in stories, or unlock completed scenes"
              ) : (
                "Get started with free Ink or subscribe for daily income"
              )}
            </p>
          </div>
        </div>
      </section>
    )}
    {/* Quick Actions for Returning Users */}
    {!isNewUser && (
      <section className="mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
              <p className="text-sm text-slate-400 mt-1">Jump back into the game or explore stories</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/stories" 
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              >
                📖 Browse Stories
              </Link>
              {userCharacters.length > 0 && (
                <Link 
                  href="/stories/join" 
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                >
                  ⚔️ Join Story
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    )}
    
    {/* Demense Section */}
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">My Demense</h2>
        {false && ( // TODO: restore demense check when available
          <div className="flex gap-2">
            <Link 
              href="/demense/new" 
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
            >
              ⚔️ Replace Demense
            </Link>
            {/* TODO: Restore when demense functionality is back
            <form action={destroyDemense}>
              <button 
                type="submit"
                className="bg-red-900 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                💀 Destroy Demense
              </button>
            </form> */}
          </div>
        )}
      </div>
      
      {false ? ( // TODO: restore demense check
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              {demense.imageUrl ? (
                <img 
                  src={demense.imageUrl} 
                  alt={demense.name} 
                  className="w-full aspect-video object-cover rounded-lg"
                />
              ) : (
                <div className="w-full aspect-video bg-slate-900 rounded-lg flex items-center justify-center text-6xl text-slate-600">
                  🏰
                </div>
              )}
            </div>
            
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold text-cyan-400 mb-2">{demense.name}</h3>
              <p className="text-slate-300 mb-4">{demense.description}</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900 rounded-lg p-3">
                  <p className="text-slate-500 text-sm">Defense Power</p>
                  <p className="text-2xl font-bold text-white">{demense.defensePower}/10</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-3">
                  <p className="text-slate-500 text-sm">Production Rate</p>
                  <p className="text-2xl font-bold text-white">{demense.productionRate}/10</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-3">
                  <p className="text-slate-500 text-sm">Special Bonus</p>
                  <p className="text-sm font-semibold text-cyan-400">{demense.specialBonus}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">🏰</div>
          <h3 className="text-xl font-bold text-slate-400 mb-2">No Demense Established</h3>
          <p className="text-slate-500 mb-6">You haven&apos;t claimed a stronghold yet. Establish your demense to begin your journey!</p>
          <Link 
            href="/demense/new" 
            className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg"
          >
            🏰 Claim Your Demense
          </Link>
        </div>
      )}
    </section>
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
    
    {/* Featured Stories Section - Always visible */}
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Featured Stories</h2>
          <p className="text-sm text-slate-400 mt-1">Ongoing narratives you can read and influence</p>
        </div>
        <Link 
          href="/stories" 
          className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm"
        >
          View All Stories →
        </Link>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {/* Mock Featured Story Cards */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-700/50 transition-all cursor-pointer">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <span className="text-green-500">•</span>
            <span>LIVE • Scene 12 of 20</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">The Siege of Astralgate</h3>
          <p className="text-sm text-slate-400 mb-4">
            Four heroes defend a mystical portal from an endless demon horde. Time is running out...
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">4 players • 127 spectators</span>
            <span className="text-cyan-400">Free to watch</span>
          </div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-purple-700/50 transition-all cursor-pointer">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <span className="text-yellow-500">•</span>
            <span>VOTING • Scene 8 of 15</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Merchants of the Void</h3>
          <p className="text-sm text-slate-400 mb-4">
            A trade negotiation turns deadly when ancient artifacts reveal their true power...
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">3 players • 89 spectators</span>
            <span className="text-purple-400">5 Ink to vote</span>
          </div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all cursor-pointer">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <span className="text-blue-500">•</span>
            <span>COMPLETE • 25 scenes</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">The Last Dawn</h3>
          <p className="text-sm text-slate-400 mb-4">
            An epic tale of sacrifice and redemption in a world where magic itself is dying...
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">6 players • 412 readers</span>
            <span className="text-slate-400">10 Ink to unlock</span>
          </div>
        </div>
      </div>
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