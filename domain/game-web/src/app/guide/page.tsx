import { TopBar } from "../TopBar";
import { getUserInfo } from "../getUserInfo";
import { RoleNav } from "../components/RoleNav";

// TODO: Replace with real data
const influencableStories = [
  {
    id: '3',
    title: 'The Siege of Astralgate',
    description: 'Four heroes defend a mystical portal from an endless demon horde. The fate of two realms hangs in the balance.',
    playerCount: 4,
    spectatorCount: 127,
    currentAct: 2,
    currentScene: 12,
    totalScenes: 20,
    genre: 'Epic Fantasy',
    characters: [
      { name: 'Sir Galahad', player: 'KnightErrant' },
      { name: 'Zara the Wise', player: 'MageSupreme' },
      { name: 'Throk Ironbeard', player: 'DwarfLord' },
      { name: 'Silent Arrow', player: 'ElvenRanger' }
    ],
    latestSceneTitle: 'The Demon General Arrives',
    latestScenePreview: 'The ground shakes as a massive figure emerges from the portal...',
    startedDaysAgo: 3
  },
  {
    id: '4',
    title: 'Merchants of the Void',
    description: 'Trade negotiations turn deadly when ancient artifacts reveal their true power. Trust no one.',
    playerCount: 3,
    spectatorCount: 89,
    currentAct: 2,
    currentScene: 8,
    totalScenes: 15,
    genre: 'Space Opera',
    characters: [
      { name: 'Captain Vex', player: 'SpaceTrader' },
      { name: 'Dr. Artifact', player: 'XenoArcheologist' },
      { name: 'The Broker', player: 'DealMaker' }
    ],
    latestSceneTitle: 'The Betrayal',
    latestScenePreview: 'The artifact begins to glow as the Broker reaches for his weapon...',
    startedDaysAgo: 2
  }
];

export default async function GuidePage() {
  const { user, account } = await getUserInfo();

  return (
    <div className="min-h-screen bg-slate-950">
      {user && <TopBar {...{user, account}}/>}
      <RoleNav 
        currentPath="/guide"
        showHeroContent={true}
        heroTagline="Watch live quests. Vote on choices. Shape destinies."
        heroDescription="Join active stories as a Fate. Influence critical decisions, unlock plot twists, and guide heroes through challenges. Your wisdom shapes their journey."
        heroImage="/landing-guide-the-fates.png"
      />
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid md:grid-cols-2 gap-4">
            {influencableStories.map(story => (
              <a key={story.id} href={`/story/${story.id}`} className="block">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-700/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">{story.genre} • Chapter {story.currentScene}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-500 text-xs font-semibold">LIVE</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-3">
                    {story.description}
                  </p>
                  
                  <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-lg p-3 mb-4 border border-cyan-800/30">
                    <p className="text-xs text-cyan-400 font-semibold mb-1">NOW: {story.latestSceneTitle}</p>
                    <p className="text-sm text-slate-300">&quot;{story.latestScenePreview}&quot;</p>
                    <div className="flex gap-2 mt-3">
                      <button className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 text-xs px-3 py-1 rounded-full transition-all">
                        Vote on Choice
                      </button>
                      <button className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-xs px-3 py-1 rounded-full transition-all">
                        Suggest Twist
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="text-cyan-400 font-semibold">🔥 {story.spectatorCount} Fates watching</span>
                      <span>•</span>
                      <span>{story.playerCount} heroes questing</span>
                    </div>
                    <button className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm shadow-lg shadow-cyan-600/30">
                      Guide Heroes →
                    </button>
                  </div>
                </div>
              </a>
            ))}
          </div>
      </div>
    </div>
  );
}