import { redirect } from "next/navigation";
import Link from "next/link";
import { DemenseSelection } from './DemenseSelection';
import { getUserInfo } from "../../getUserInfo";
import { TopBar } from "../../TopBar";
import { DebugUserInfo } from "../../DebugUserInfo";

export default async function NewDemensePage() {
  const { user, account } = await getUserInfo();
  
  if (!user) {
    redirect('/auth/login');
  }
  
  // Placeholder demenses (empty slots)
  const placeholderDemenses = [
    {
      name: "Unknown Stronghold",
      description: "A mysterious location waiting to be discovered...",
      aspects: [],
      imageUrl: null,
    },
    {
      name: "Unknown Stronghold",
      description: "A mysterious location waiting to be discovered...",
      aspects: [],
      imageUrl: null,
    },
    {
      name: "Unknown Stronghold",
      description: "A mysterious location waiting to be discovered...",
      aspects: [],
      imageUrl: null,
    }
  ];
  
  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar {...{user, account}}/>
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Link 
              href="/"
              className="text-3xl text-slate-500 hover:text-slate-300 transition-colors"
            >
              ‹
            </Link>
            <h1 className="text-4xl font-bold text-white">Choose Your Demense</h1>
          </div>
          <p className="text-slate-400 ml-12">Your demense is your stronghold - a base of operations in the game world.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Current Demense */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 text-slate-300">Current Demense</h2>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              {false ? ( // TODO: restore when demense functionality is back
                <>
                  {demense.imageUrl ? (
                    <img 
                      src={demense.imageUrl} 
                      alt={demense.name} 
                      className="w-full aspect-video object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="w-full aspect-video bg-slate-900 rounded-lg flex items-center justify-center text-4xl text-slate-600 mb-4">
                      🏰
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-cyan-400 mb-2">{demense.name}</h3>
                  <p className="text-sm text-slate-300 mb-3">{demense.description}</p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-400">ASPECTS</p>
                    <p className="text-cyan-400 text-sm">{demense.specialBonus}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full aspect-video bg-slate-900 rounded-lg flex items-center justify-center text-4xl text-slate-600 mb-4">
                    🏕️
                  </div>
                  <h3 className="text-lg font-bold text-slate-400 mb-2">The Wanderer's Camp</h3>
                  <p className="text-sm text-slate-500 mb-3">A humble temporary shelter. Time to establish a proper stronghold!</p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-600">ASPECTS</p>
                    <p className="text-slate-500 text-sm">None - just empty wilderness</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Available Demenses */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4 text-slate-300">Available Demenses</h2>
            <DemenseSelection demenses={placeholderDemenses} isPlaceholder={true} />
          </div>
        </div>
        
        <DebugUserInfo {...{user, account}} />
      </div>
    </div>
  );
}