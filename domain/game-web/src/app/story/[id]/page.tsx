import { notFound } from 'next/navigation';
import { TopBar } from '@/app/TopBar';
import { getUserInfo } from '@/app/getUserInfo';
import { z } from 'zod';

const StoryStatusSchema = z.enum(['joinable', 'influencable', 'readable']);

const CharacterSchema = z.object({
  name: z.string(),
  player: z.string()
});

const StorySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  genre: z.string(),
  status: StoryStatusSchema,
  currentAct: z.number(),
  currentScene: z.number(),
  totalActs: z.number().optional(),
  totalScenes: z.number().optional(),
  characters: z.array(CharacterSchema),
  playerSlots: z.object({
    filled: z.number(),
    total: z.number()
  }).optional(),
  spectatorCount: z.number().optional(),
  latestSceneTitle: z.string().optional(),
  latestScenePreview: z.string().optional(),
  firstSceneTitle: z.string().optional(),
  firstScenePreview: z.string().optional(),
  firstSceneContent: z.string().optional(),
  nextSceneInk: z.number().optional(),
  totalInk: z.number().optional(),
  startsIn: z.string().optional(),
  requiredCommitment: z.string().optional()
});

type Story = z.infer<typeof StorySchema>;

async function getStory(id: string): Promise<Story | null> {
  // TODO: Fetch from database
  const mockStories: Story[] = [
    {
      id: '1',
      title: 'Echoes of Tomorrow',
      description: 'Time travelers accidentally create a paradox. Now they must fix history before they cease to exist.',
      genre: 'Sci-Fi Thriller',
      status: 'joinable',
      currentAct: 1,
      currentScene: 1,
      playerSlots: { filled: 2, total: 4 },
      characters: [
        { name: 'Dr. Chronos', player: 'Alex_Runner' },
        { name: 'Agent Paradox', player: 'TimeKeeper42' }
      ],
      startsIn: '2 hours',
      requiredCommitment: '5-7 days'
    },
    {
      id: '3',
      title: 'The Siege of Astralgate',
      description: 'Four heroes defend a mystical portal from an endless demon horde. The fate of two realms hangs in the balance.',
      genre: 'Epic Fantasy',
      status: 'influencable',
      currentAct: 2,
      currentScene: 12,
      totalScenes: 20,
      spectatorCount: 127,
      characters: [
        { name: 'Sir Galahad', player: 'KnightErrant' },
        { name: 'Zara the Wise', player: 'MageSupreme' },
        { name: 'Throk Ironbeard', player: 'DwarfLord' },
        { name: 'Silent Arrow', player: 'ElvenRanger' }
      ],
      latestSceneTitle: 'The Demon General Arrives',
      latestScenePreview: 'The ground shakes as a massive figure emerges from the portal. Its eyes burn with unholy fire as it surveys the battlefield, pointing a massive obsidian blade at the weary defenders...',
    },
    {
      id: '5',
      title: 'The Last Dawn',
      description: 'In a world where magic is dying, six unlikely allies must find the source before darkness consumes all.',
      genre: 'Dark Fantasy',
      status: 'readable',
      currentAct: 3,
      currentScene: 25,
      totalActs: 3,
      totalScenes: 25,
      spectatorCount: 412,
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
      firstSceneContent: `The last spell fizzled and died in Malachar's hands. After a thousand years, the magic was finally leaving the world.

He stood atop the Tower of Eternity, watching the ethereal lights fade from the sky one by one. Each extinguished star represented another font of power going dark forever. The wind whipped his tattered robes as he clenched his fists, feeling the last dregs of arcane energy slip through his fingers like sand.

"Master Malachar!" A voice called from the spiral stairs. Sister Faith emerged onto the tower roof, her normally pristine armor dulled and scarred. "The Council has gathered. They're waiting for your report."

Malachar turned, his hollow eyes meeting hers. "There is nothing to report. It's over, Faith. The magic is dying, and we are powerless to stop it."

"There must be something—"

"There is nothing!" He slammed his staff against the stone, but no sparks flew, no power answered his call. Just the dull thud of wood on stone. "For weeks I have searched every tome, consulted every oracle, attempted every ritual. The source of magic itself is poisoned, corrupted by something beyond our understanding."

Faith approached slowly, her hand moving instinctively to where her holy symbol once blazed with divine light. Now it was just cold metal. "Then what do we do?"

"We find the source," a new voice rasped from the shadows. Whisper materialized from seemingly nowhere, though Malachar knew it was skill, not sorcery, that allowed the thief to move unseen. "Every poison has an origin. Every curse, a caster."

"Impossible," Malachar said. "The source of all magic lies beyond the Veil of Worlds. No mortal has ever—"

"No mortal with magic," Whisper interrupted. "But perhaps, without it, we might succeed where wizards have failed."

The implications hung heavy in the air. A quest beyond the Veil, without magic to protect them. It was madness. It was suicide.

It was their only hope.`,
      nextSceneInk: 5,
      totalInk: 50
    }
  ];

  return mockStories.find(s => s.id === id) || null;
}

function JoinableStoryDetail({ story }: { story: Story }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-purple-400 mb-4">Story Overview</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-400 mb-4">{story.description}</p>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-500">Current Progress:</span> <span className="text-white">Act {story.currentAct}, Scene {story.currentScene}</span></p>
              <p><span className="text-slate-500">Time Until Start:</span> <span className="text-cyan-400">{story.startsIn}</span></p>
              <p><span className="text-slate-500">Commitment Required:</span> <span className="text-white">{story.requiredCommitment}</span></p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Player Slots</h3>
            <div className="mb-4">
              <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full"
                  style={{ width: `${(story.playerSlots!.filled / story.playerSlots!.total) * 100}%` }}
                />
              </div>
              <p className="text-sm text-slate-400">{story.playerSlots!.filled} of {story.playerSlots!.total} heroes have joined</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-purple-400 mb-4">Current Heroes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {story.characters.map((char, i) => (
            <div key={i} className="bg-slate-900 rounded-lg p-4">
              <p className="font-semibold text-white">{char.name}</p>
              <p className="text-sm text-slate-500">Played by {char.player}</p>
            </div>
          ))}
          {[...Array(story.playerSlots!.total - story.playerSlots!.filled)].map((_, i) => (
            <div key={`empty-${i}`} className="bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-lg p-4 text-center">
              <p className="text-slate-500">Waiting for hero...</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <a
          href={`/story/${story.id}/join`}
          className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 text-lg"
        >
          Join This Story →
        </a>
        <p className="text-sm text-slate-500 mt-2">You&apos;ll need to log in and select a character</p>
      </div>
    </div>
  );
}

function InfluencableStoryDetail({ story }: { story: Story }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">Story Progress</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-400 mb-4">{story.description}</p>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-500">Current Progress:</span> <span className="text-white">Act {story.currentAct}, Scene {story.currentScene} of {story.totalScenes}</span></p>
              <p><span className="text-slate-500">Spectators:</span> <span className="text-cyan-400">{story.spectatorCount} watching</span></p>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-green-500 h-2 rounded-full"
                  style={{ width: `${(story.currentScene / story.totalScenes!) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Story progress</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Active Heroes</h3>
            <div className="space-y-2">
              {story.characters.map((char, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-green-500 text-xs">●</span>
                  <span className="text-sm text-white">{char.name}</span>
                  <span className="text-xs text-slate-500">({char.player})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">Latest Scene</h2>
        <div className="bg-slate-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">{story.latestSceneTitle}</h3>
          <p className="text-slate-300 leading-relaxed mb-4">{story.latestScenePreview}</p>
          <div className="flex items-center gap-4">
            <button className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200">
              🗳️ Vote on Next Action
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200">
              💎 Send Ink to Players
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">Login required to influence the story</p>
        </div>
      </div>

      <div className="text-center">
        <a
          href={`/story/${story.id}/influence`}
          className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25 text-lg"
        >
          Login to Influence Story →
        </a>
      </div>
    </div>
  );
}

function ReadableStoryDetail({ story }: { story: Story }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-blue-400 mb-4">Completed Story</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-400 mb-4">{story.description}</p>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-500">Total Length:</span> <span className="text-white">{story.totalActs} Acts, {story.totalScenes} Scenes</span></p>
              <p><span className="text-slate-500">Readers:</span> <span className="text-blue-400">{story.spectatorCount} have read this story</span></p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">The Heroes</h3>
            <div className="grid grid-cols-2 gap-2">
              {story.characters.map((char, i) => (
                <div key={i} className="text-sm">
                  <span className="text-white">{char.name}</span>
                  <span className="text-xs text-slate-500 ml-1">({char.player})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-blue-400">Scene 1: {story.firstSceneTitle}</h2>
            <p className="text-sm text-green-400 mt-1">✨ This scene is FREE!</p>
          </div>
          <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs">FREE</span>
        </div>
        <div className="prose prose-invert max-w-none">
          <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {story.firstSceneContent}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/50 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Continue Reading?</h3>
        <p className="text-slate-300 mb-6">Unlock the rest of this epic tale</p>
        <div className="flex gap-4 justify-center">
          <a
            href={`/story/${story.id}/unlock-next`}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Unlock Next Scene<br/>
            <span className="text-sm opacity-80">{story.nextSceneInk} Ink</span>
          </a>
          <a
            href={`/story/${story.id}/unlock-all`}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
          >
            Unlock Entire Story<br/>
            <span className="text-sm opacity-80">{story.totalInk} Ink</span>
          </a>
        </div>
        <p className="text-sm text-slate-500 mt-4">Login required to unlock scenes</p>
      </div>
    </div>
  );
}

export default async function StoryPage({ params }: { params: { id: string } }) {
  const { user, account } = await getUserInfo();
  const story = await getStory(params.id);

  if (!story) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar {...{user, account}}/>
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{story.title}</h1>
              <p className="text-lg text-slate-400">{story.genre}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                story.status === 'joinable' ? 'bg-purple-600/20 text-purple-400' :
                story.status === 'influencable' ? 'bg-cyan-600/20 text-cyan-400' :
                'bg-blue-600/20 text-blue-400'
              }`}>
                {story.status === 'joinable' ? '🎮 JOINABLE' :
                 story.status === 'influencable' ? '🎭 IN PROGRESS' :
                 '📖 COMPLETE'}
              </span>
            </div>
          </div>
        </div>

        {story.status === 'joinable' && <JoinableStoryDetail story={story} />}
        {story.status === 'influencable' && <InfluencableStoryDetail story={story} />}
        {story.status === 'readable' && <ReadableStoryDetail story={story} />}
      </div>
    </div>
  );
}