import { TopBar } from "./TopBar";
import { getUserInfo } from "./getUserInfo";
import { HomeUser } from "./HomeUser";

export async function HomeAnon() {
  // TODO: Fetch actual popular and new stories from database
  const popularStories = [
    {
      id: '1',
      title: 'The Siege of Astralgate',
      description: 'Four heroes defend a mystical portal from an endless demon horde. The fate of two realms hangs in the balance.',
      playerCount: 4,
      spectatorCount: 127,
      currentScene: 12,
      totalScenes: 20,
      status: 'live',
      genre: 'Epic Fantasy',
      startedDaysAgo: 3
    },
    {
      id: '2',
      title: 'Merchants of the Void',
      description: 'Trade negotiations turn deadly when ancient artifacts reveal their true power. Trust no one.',
      playerCount: 3,
      spectatorCount: 89,
      currentScene: 8,
      totalScenes: 15,
      status: 'voting',
      genre: 'Space Opera',
      startedDaysAgo: 2
    },
    {
      id: '3',
      title: 'The Last Dawn',
      description: 'In a world where magic is dying, six unlikely allies must find the source before darkness consumes all.',
      playerCount: 6,
      spectatorCount: 412,
      currentScene: 25,
      totalScenes: 25,
      status: 'complete',
      genre: 'Dark Fantasy',
      startedDaysAgo: 10
    }
  ];

  const newStories = [
    {
      id: '4',
      title: 'Echoes of Tomorrow',
      description: 'Time travelers accidentally create a paradox. Now they must fix history before they cease to exist.',
      playerSlots: { filled: 2, total: 4 },
      genre: 'Sci-Fi Thriller',
      startsIn: '2 hours',
      requiredCommitment: '5-7 days'
    },
    {
      id: '5',
      title: 'The Crimson Court',
      description: 'Political intrigue and deadly secrets in the vampire nobility. Your choices will determine who rules the night.',
      playerSlots: { filled: 3, total: 5 },
      genre: 'Gothic Horror',
      startsIn: '6 hours',
      requiredCommitment: '4-6 days'
    },
    {
      id: '6',
      title: 'Pirates of the Astral Sea',
      description: 'Sail between worlds, plunder cosmic treasures, and face eldritch horrors in this swashbuckling adventure.',
      playerSlots: { filled: 1, total: 6 },
      genre: 'Fantasy Adventure',
      startsIn: '12 hours',
      requiredCommitment: '7-10 days'
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
        <div className="flex gap-4 justify-center">
          <a 
            href="/api/auth/login?returnTo=/signup"
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            Start Playing Free
          </a>
          <a 
            href="#popular-stories"
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200"
          >
            Browse Stories
          </a>
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Popular Stories Column */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>🔥</span> Popular Stories to Watch
            </h2>
            <p className="text-sm text-slate-400 mt-1">Jump into ongoing adventures as a spectator</p>
          </div>
          
          <div className="space-y-4" id="popular-stories">
            {popularStories.map(story => (
              <div key={story.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-700/50 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className={
                        story.status === 'live' ? 'text-green-500' : 
                        story.status === 'voting' ? 'text-yellow-500' : 
                        'text-blue-500'
                      }>•</span>
                      <span className="uppercase">{story.status}</span>
                      {story.status !== 'complete' && (
                        <span>• Scene {story.currentScene} of {story.totalScenes}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{story.genre}</p>
                  </div>
                  {story.status === 'complete' && (
                    <span className="bg-slate-900 px-2 py-1 rounded text-xs text-slate-400">
                      10 Ink
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-slate-400 mb-3">
                  {story.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-slate-500">
                    <span>👥 {story.playerCount} players</span>
                    <span>👁️ {story.spectatorCount} watching</span>
                  </div>
                  <span className="text-xs text-slate-600">
                    Started {story.startedDaysAgo} days ago
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <a 
              href="/api/auth/login?returnTo=/stories"
              className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm"
            >
              View All Stories →
            </a>
          </div>
        </section>

        {/* New Stories Column */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>⚔️</span> New Stories Seeking Heroes
            </h2>
            <p className="text-sm text-slate-400 mt-1">Join an adventure before it begins</p>
          </div>
          
          <div className="space-y-4">
            {newStories.map(story => (
              <div key={story.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-purple-700/50 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{story.genre}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-cyan-400">Starts in</p>
                    <p className="text-sm text-white">{story.startsIn}</p>
                  </div>
                </div>
                
                <p className="text-sm text-slate-400 mb-4">
                  {story.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${(story.playerSlots.filled / story.playerSlots.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">
                        {story.playerSlots.filled}/{story.playerSlots.total} players
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {story.requiredCommitment} commitment
                    </p>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm">
                    Join →
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-white mb-2">Ready to Create Your Legend?</h3>
            <p className="text-sm text-slate-400 mb-4">
              Create characters, join stories, and watch your adventures transform into epic tales.
            </p>
            <a 
              href="/api/auth/login?returnTo=/signup"
              className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              Sign Up Free
            </a>
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
