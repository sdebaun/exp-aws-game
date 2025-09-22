import { TopBar } from "./TopBar";
import { getUserInfo } from "./getUserInfo";
import { HomeUser } from "./HomeUser";

export async function HomeAnon() {
  // TODO: Fetch actual stories from database
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
      startsIn: '2 hours',
      requiredCommitment: '5-7 days'
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
      startsIn: '6 hours',
      requiredCommitment: '4-6 days'
    }
  ];

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

  const readableStories = [
    {
      id: '5',
      title: 'The Last Dawn',
      description: 'In a world where magic is dying, six unlikely allies must find the source before darkness consumes all.',
      playerCount: 6,
      spectatorCount: 412,
      totalActs: 3,
      totalScenes: 25,
      genre: 'Dark Fantasy',
      characters: [
        { name: 'Malachar the Cursed', player: 'DarkMage' },
        { name: 'Sister Faith', player: 'HolyPaladin' },
        { name: 'Whisper', player: 'ShadowThief' },
        { name: 'Grond', player: 'BarbarianKing' },
        { name: 'Lyra Starweaver', player: 'LastBard' },
        { name: 'The Nameless One', player: 'MysteryPlayer' }
      ],
      firstSceneTitle: 'When Magic Dies',
      firstScenePreview: 'The last spell fizzled and died in Malachar\'s hands. After a thousand years, the magic was finally leaving the world...',
      completedDaysAgo: 2,
      totalInk: 50,
      firstSceneInk: 0,
      nextSceneInk: 5
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">
          Where Your Actions Become Legends
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
          Join collaborative storytelling adventures where AI transforms player interactions 
          into epic narratives. Play as a hero or watch stories unfold in real-time.
        </p>
      </section>

      {/* Three Story Categories */}
      <div className="space-y-12">
        {/* Join Stories Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>⚔️</span> Join - New Stories Seeking Heroes
            </h2>
            <p className="text-sm text-slate-400 mt-1">Stories early in the process - become a hero in these adventures</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {joinableStories.map(story => (
              <a key={story.id} href={`/story/${story.id}`} className="block">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-purple-700/50 transition-all cursor-pointer group h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">{story.genre} • Act {story.currentAct}, Scene {story.currentScene}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-4">
                    {story.description}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="mb-3">
                      <p className="text-xs text-slate-500 mb-2">Current Heroes:</p>
                      <div className="flex flex-wrap gap-1">
                        {story.characters.map((char, i) => (
                          <span key={i} className="text-xs bg-slate-900 px-2 py-1 rounded">
                            {char.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${(story.playerSlots.filled / story.playerSlots.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">
                          {story.playerSlots.filled}/{story.playerSlots.total}
                        </span>
                      </div>
                      <button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm">
                        Join →
                      </button>
                    </div>
                  </div>
                </div>
              </a>
            ))}
            
            {/* Start New Story Tile */}
            <a href="/story/new" className="block">
              <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border-2 border-dashed border-purple-700/50 rounded-xl p-6 hover:border-purple-600 transition-all cursor-pointer group h-full flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">✨</div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors mb-2">
                  Start Your Own Story
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  Create a new adventure and recruit heroes
                </p>
                <button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 text-sm">
                  Create Story →
                </button>
              </div>
            </a>
          </div>
        </section>

        {/* Influence Stories Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>🎭</span> Influence - Ongoing Adventures
            </h2>
            <p className="text-sm text-slate-400 mt-1">Too late to join, but you can still shape the story</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {influencableStories.map(story => (
              <a key={story.id} href={`/story/${story.id}`} className="block">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-700/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">{story.genre} • Act {story.currentAct}, Scene {story.currentScene}/{story.totalScenes}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-green-500 text-xs">• LIVE</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-3">
                    {story.description}
                  </p>
                  
                  <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-cyan-400 font-semibold mb-1">Latest Scene: {story.latestSceneTitle}</p>
                    <p className="text-xs text-slate-400 italic">"{story.latestScenePreview}"</p>
                  </div>
                  
                  <div className="text-xs text-slate-500">
                    <div className="flex items-center gap-4 mb-2">
                      <span>👥 {story.playerCount} heroes</span>
                      <span>👁️ {story.spectatorCount} watching</span>
                    </div>
                    <details>
                      <summary className="cursor-pointer hover:text-slate-400">View Characters</summary>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {story.characters.map((char, i) => (
                          <span key={i} className="text-xs bg-slate-900 px-2 py-1 rounded">
                            {char.name} ({char.player})
                          </span>
                        ))}
                      </div>
                    </details>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Read Stories Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>📖</span> Read - Completed Legends
            </h2>
            <p className="text-sm text-slate-400 mt-1">Finished stories ready to be discovered</p>
          </div>
          
          <div className="space-y-4">
            {readableStories.map(story => (
              <a key={story.id} href={`/story/${story.id}`} className="block">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-blue-700/50 transition-all cursor-pointer group">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                            {story.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">{story.genre} • {story.totalActs} Acts, {story.totalScenes} Scenes</p>
                        </div>
                        <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs">
                          COMPLETE
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-400 mb-3">
                        {story.description}
                      </p>
                      
                      <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
                        <p className="text-xs text-blue-400 font-semibold mb-1">First Scene: {story.firstSceneTitle}</p>
                        <p className="text-xs text-slate-400 italic">"{story.firstScenePreview}"</p>
                        <p className="text-xs text-green-400 mt-2">✨ First scene is FREE</p>
                      </div>
                      
                      <div className="text-xs text-slate-500">
                        <span>👥 {story.playerCount} heroes</span>
                        <span className="mx-2">•</span>
                        <span>👁️ {story.spectatorCount} readers</span>
                        <span className="mx-2">•</span>
                        <span>Completed {story.completedDaysAgo} days ago</span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                      <p className="text-sm font-semibold text-white mb-2">Unlock Options</p>
                      <div className="space-y-2">
                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm">
                          Next Scene<br/>
                          <span className="text-xs opacity-80">{story.nextSceneInk} Ink</span>
                        </button>
                        <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm">
                          Full Story<br/>
                          <span className="text-xs opacity-80">{story.totalInk} Ink</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 mt-3">Read first scene free!</p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* How It Works */}
      <section className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="text-3xl mb-4">🎭</div>
            <h3 className="text-lg font-bold text-white mb-2">Create Characters</h3>
            <p className="text-sm text-slate-400">
              Design unique heroes with AI-generated portraits and rich backstories
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-white mb-2">Play Together</h3>
            <p className="text-sm text-slate-400">
              Make choices and interact with other players in multi-day story runs
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="text-3xl mb-4">📖</div>
            <h3 className="text-lg font-bold text-white mb-2">Become Legends</h3>
            <p className="text-sm text-slate-400">
              Watch as AI transforms your actions into professionally written narratives
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default async function Home() {
  const { user, account, demense } = await getUserInfo();

  // No longer auto-redirect - let user choose when to claim a demense

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar {...{user, account, demense}}/>
      <div className="max-w-7xl mx-auto">
        {user ? <HomeUser {...{user, account, demense}}/> : <HomeAnon/> }
      </div>
    </div>
  )
}
