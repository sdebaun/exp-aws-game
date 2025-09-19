import Link from "next/link";
import { User } from "@auth0/nextjs-auth0/types";
import { AccountEntity, DemenseEntity } from "../db/entities";
import { EntityItem } from "electrodb";
import { destroyDemense } from "./actions";

export async function HomeUser({user, account, demense}: {user: User, account: EntityItem<typeof AccountEntity>, demense: EntityItem<typeof DemenseEntity> | null}) {
  // TODO: Fetch user's characters and stories from database
  const userCharacters = []; // Mock empty for now
  const userStories = [];
  
  return (<div className="p-8 max-w-7xl mx-auto">
    {/* Demense Section */}
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">My Demense</h2>
        {demense && (
          <div className="flex gap-2">
            <Link 
              href="/demense/new" 
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
            >
              ⚔️ Replace Demense
            </Link>
            <form action={destroyDemense}>
              <button 
                type="submit"
                className="bg-red-900 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                💀 Destroy Demense
              </button>
            </form>
          </div>
        )}
      </div>
      
      {demense ? (
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