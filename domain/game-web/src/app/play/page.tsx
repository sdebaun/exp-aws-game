import { TopBar } from "../TopBar";
import { getUserInfo } from "../getUserInfo";
import { RoleNav } from "../components/RoleNav";
import Link from "next/link";

// TODO: Replace with real data
const joinableStories = [
  {
    id: '1',
    title: 'Echoes of Tomorrow',
    description: 'Time travelers accidentally create a paradox. Now they must fix history before they cease to exist.',
    playerSlots: { filled: 2, total: 4 },
    genre: 'Sci-Fi Thriller',
    currentAct: 1,
    currentScene: 1,
    characters: [
      { name: 'Dr. Chronos', player: 'Alex_Runner' },
      { name: 'Agent Paradox', player: 'TimeKeeper42' }
    ],
    startsIn: 'Tonight at midnight',
    requiredCommitment: '5-7 day epic'
  },
  {
    id: '2',
    title: 'The Crimson Court',
    description: 'Political intrigue and deadly secrets in the vampire nobility. Your choices will determine who rules the night.',
    playerSlots: { filled: 3, total: 5 },
    genre: 'Gothic Horror',
    currentAct: 1,
    currentScene: 2,
    characters: [
      { name: 'Lord Draven', player: 'NightWalker' },
      { name: 'Lady Seraphina', player: 'BloodMoon' },
      { name: 'The Hunter', player: 'VanHelsing99' }
    ],
    startsIn: 'Dawn approaches',
    requiredCommitment: '4-6 day saga'
  }
];

export default async function PlayPage() {
  const { user, account } = await getUserInfo();

  return (
    <div className="min-h-screen bg-slate-950">
      {user && <TopBar {...{user, account}}/>}
      <RoleNav 
        currentPath="/play"
        showHeroContent={true}
        heroTagline="Choose your quest. Join heroes. Begin your legend."
        heroDescription="Pick from active stories seeking heroes or forge your own epic. Each quest runs 5-7 days with other players. Your decisions shape the narrative in real-time."
        heroImage="/landing-play-a-hero.png"
      />
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {joinableStories.map(story => (
              <a key={story.id} href={`/story/${story.id}`} className="block">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-purple-700/50 transition-all cursor-pointer group h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">{story.genre}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-4">
                    {story.description}
                  </p>
                  
                  <div className="mt-auto">
                    {/* Time to Start */}
                    <div className="bg-purple-900/20 rounded-lg px-3 py-1 mb-3 inline-block">
                      <p className="text-xs text-purple-400 font-semibold">🌙 {story.startsIn}</p>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex -space-x-2 mb-2">
                        {story.characters.slice(0, 3).map((char, i) => (
                          <div key={i} className="w-8 h-8 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full border-2 border-slate-800 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{char.name[0]}</span>
                          </div>
                        ))}
                        {story.characters.length > 3 && (
                          <div className="w-8 h-8 bg-slate-700 rounded-full border-2 border-slate-800 flex items-center justify-center">
                            <span className="text-xs text-slate-400">+{story.characters.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{story.playerSlots.filled} heroes answered the call</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                              style={{ width: `${(story.playerSlots.filled / story.playerSlots.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-purple-400 font-semibold">
                            {story.playerSlots.total - story.playerSlots.filled === 1 ? 'Final spot!' : `${story.playerSlots.total - story.playerSlots.filled} spots left`}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{story.requiredCommitment}</p>
                      </div>
                      <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm shadow-lg shadow-purple-600/30">
                        Play Hero →
                      </button>
                    </div>
                  </div>
                </div>
              </a>
            ))}
            
            {/* Start New Story Tile */}
            <Link href="/story/new" className="block">
              <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border-2 border-dashed border-purple-700/50 rounded-xl p-6 hover:border-purple-600 transition-all cursor-pointer group h-full flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎯</div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors mb-2">
                  Forge a New Legend
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  Create your own epic and summon heroes to your quest
                </p>
                <button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 text-sm">
                  Summon Heroes →
                </button>
              </div>
            </Link>
          </div>
      </div>
    </div>
  );
}