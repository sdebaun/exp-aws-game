import { TopBar } from "../TopBar";
import { getUserInfo } from "../getUserInfo";
import { RoleNav } from "../components/RoleNav";

// TODO: Replace with real data
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

export default async function ReadPage() {
  const { user, account } = await getUserInfo();

  return (
    <div className="min-h-screen bg-slate-950">
      {user && <TopBar {...{user, account}}/>}
      <RoleNav 
        currentPath="/read"
        showHeroContent={true}
        heroTagline="Browse completed epics. Start reading free. Unlock chapters."
        heroDescription="Explore finished stories created by real players. Every legend began with heroes like you. Read first chapters free, then use Ink to unlock the full adventure."
        heroImage="/landing-read-the-legends.png"
      />
      
      <div className="max-w-7xl mx-auto p-8">
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
                          <p className="text-xs text-slate-500 mt-1">{story.genre} • An epic in {story.totalScenes} chapters</p>
                        </div>
                        <span className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold border border-blue-600/30">
                          ✨ LEGENDARY
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-400 mb-3">
                        {story.description}
                      </p>
                      
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-4 mb-3 border border-blue-800/30">
                        <p className="text-sm font-semibold text-blue-400 mb-2">Chapter One: {story.firstSceneTitle}</p>
                        <p className="text-sm text-slate-300 italic mb-3">&quot;{story.firstScenePreview}&quot;</p>
                        <button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-1 px-4 rounded-full transition-all duration-200 text-xs">
                          🆓 Start Reading Free
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-blue-400 font-semibold">📖 {story.spectatorCount} readers</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">Played by {story.playerCount} legendary heroes</span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <p className="text-xs text-slate-400 mb-3">Love the story? Continue reading:</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Next chapter</span>
                          <span className="text-blue-400 font-semibold">{story.nextSceneInk} Ink</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Full legend</span>
                          <span className="text-purple-400 font-semibold">{story.totalInk} Ink</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-800">
                        <p className="text-xs text-slate-500">💡 Earn Ink by playing or guiding</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
      </div>
    </div>
  );
}