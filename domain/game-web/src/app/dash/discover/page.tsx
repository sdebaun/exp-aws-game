import Link from "next/link";
import { getUserInfo } from "@/app/getUserInfo";
import { FeaturedCarousel } from "./_components/FeaturedCarousel";

export default async function DiscoverPage() {
  const { user, account } = await getUserInfo();

  // Mock featured stories - big hero carousel
  const featuredStories = [
    {
      id: "exp-1",
      title: "The Siege of Astralgate",
      tagline: "When the portal opens, everyone's allegiances get tested.",
      excerpt:
        "The portal shimmered like a bad decision rendered in three dimensions. Captain Vex stared at it with the sort of expression usually reserved for discovering that someone had replaced your coffee with existential dread.",
      attribution: "Captain Vex, Scene 8",
      totalScenes: 24,
      playerCount: 6,
      readerCount: 892,
      unlockPrice: 10,
      images: {
        hero: "https://picsum.photos/seed/astralgate/1200/600",
        thumbnails: [
          "https://picsum.photos/seed/astral1/400/300",
          "https://picsum.photos/seed/astral2/400/300",
          "https://picsum.photos/seed/astral3/400/300",
        ],
      },
    },
    {
      id: "exp-2",
      title: "The Vault of Forgotten Names",
      tagline: "Some secrets were buried for a reason.",
      excerpt:
        "The ledger was written in ink that smelled of old debts and poor choices. Kessa squinted at it. 'According to this, someone owes three chickens, a minor favor, and what appears to be their left kidney to something called the Merchant of Sorrows.'",
      attribution: "Kessa the Finder, Scene 15",
      totalScenes: 31,
      playerCount: 5,
      readerCount: 1204,
      unlockPrice: 10,
      images: {
        hero: "https://picsum.photos/seed/vault/1200/600",
        thumbnails: [
          "https://picsum.photos/seed/vault1/400/300",
          "https://picsum.photos/seed/vault2/400/300",
          "https://picsum.photos/seed/vault3/400/300",
        ],
      },
    },
    {
      id: "exp-3",
      title: "The Last Dawn",
      tagline: "Magic is dying. They still need to save the world with it.",
      excerpt:
        "Toreth watched the spell fizzle like champagne left out overnight. 'Well,' she said, with the kind of forced cheerfulness that preceded either a breakthrough or a breakdown, 'at least we've confirmed that the world can't be saved with aggressive finger-waggling.'",
      attribution: "Toreth the Diminished, Scene 19",
      totalScenes: 25,
      playerCount: 6,
      readerCount: 678,
      unlockPrice: 10,
      images: {
        hero: "https://picsum.photos/seed/lastdawn/1200/600",
        thumbnails: [
          "https://picsum.photos/seed/dawn1/400/300",
          "https://picsum.photos/seed/dawn2/400/300",
          "https://picsum.photos/seed/dawn3/400/300",
        ],
      },
    },
    {
      id: "exp-4",
      title: "Blood & Brass",
      tagline: "Revolution runs on more than ideals.",
      excerpt:
        "The gears in Rust's chest clicked in what might have been thoughtful consideration or possibly just desperate need for oil. 'The problem with revolutions,' he observed, 'is that someone always forgets to budget for replacement parts.'",
      attribution: "Rust, the Clockwork Revolutionary, Scene 11",
      totalScenes: 19,
      playerCount: 4,
      readerCount: 523,
      unlockPrice: 10,
      images: {
        hero: "https://picsum.photos/seed/bloodbrass/1200/600",
        thumbnails: [
          "https://picsum.photos/seed/brass1/400/300",
          "https://picsum.photos/seed/brass2/400/300",
          "https://picsum.photos/seed/brass3/400/300",
        ],
      },
    },
    {
      id: "exp-5",
      title: "The Cartographer's Gambit",
      tagline: "Every map is a lie. Some lies are useful.",
      excerpt:
        "Marlowe erased the mountain range with three quick strokes. Reality hiccupped, rearranged itself, and pretended it had been that way all along. 'The trick,' she muttered, 'is convincing the universe you're just fixing a typo.'",
      attribution: "Marlowe the Unmapper, Scene 22",
      totalScenes: 28,
      playerCount: 5,
      readerCount: 941,
      unlockPrice: 10,
      images: {
        hero: "https://picsum.photos/seed/cartographer/1200/600",
        thumbnails: [
          "https://picsum.photos/seed/map1/400/300",
          "https://picsum.photos/seed/map2/400/300",
          "https://picsum.photos/seed/map3/400/300",
        ],
      },
    },
    {
      id: "exp-6",
      title: "Echoes of the Fallen Star",
      tagline: "The meteor didn't kill them. The gifts did.",
      excerpt:
        "The star-touched power coursed through Wick's veins like bad news traveling at the speed of regret. Last week, he'd been a baker. Yesterday, he'd accidentally made tomorrow's bread. Time, it seemed, did not appreciate puns.",
      attribution: "Wick the Unfortunate, Scene 7",
      totalScenes: 18,
      playerCount: 4,
      readerCount: 612,
      unlockPrice: 10,
      images: {
        hero: "https://picsum.photos/seed/fallenstar/1200/600",
        thumbnails: [
          "https://picsum.photos/seed/star1/400/300",
          "https://picsum.photos/seed/star2/400/300",
          "https://picsum.photos/seed/star3/400/300",
        ],
      },
    },
  ];

  // Mock data - will eventually come from database
  const completedExpeditions = [
    {
      id: "exp-7",
      title: "The Hollow Crown",
      description:
        "The king is dead. The throne is empty. And something wearing his face sits in the council chambers...",
      totalScenes: 22,
      status: "complete" as const,
      playerCount: 5,
      readerCount: 387,
      unlockPrice: 10,
    },
    {
      id: "exp-8",
      title: "Salt & Sorcery",
      description:
        "Pirate crews don't usually hire wizards. There's a reason for that. Several reasons, actually, most involving fire...",
      totalScenes: 16,
      status: "complete" as const,
      playerCount: 4,
      readerCount: 294,
      unlockPrice: 10,
    },
    {
      id: "exp-9",
      title: "The Garden of Iron Roses",
      description:
        "In a city where plants are weapons and flowers can kill, the royal botanist goes missing. Her garden, however, continues to grow...",
      totalScenes: 20,
      status: "complete" as const,
      playerCount: 4,
      readerCount: 451,
      unlockPrice: 10,
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Authenticated User Status */}
      {user && account && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-sans text-sm font-semibold text-white">
                Your Ink Balance
              </h2>
              <p className="font-sans text-xl text-slate-300 mt-1 font-bold">
                {account.ink ?? 0} 💧
              </p>
            </div>
            {(account.ink ?? 0) < 10 && (
              <div className="font-sans text-sm text-yellow-400">
                Need more Ink to unlock stories
              </div>
            )}
          </div>
        </div>
      )}

      {/* Featured Carousel */}
      <div className="mb-12">
        <FeaturedCarousel stories={featuredStories} />
      </div>

      {/* More Stories Section */}
      <div className="mb-6">
        <h2 className="font-serif text-3xl font-bold text-white mb-2">
          More Completed Stories
        </h2>
        <p className="font-sans text-slate-400">
          Recent adventures ready to unlock and read
        </p>
      </div>

      {/* Expeditions Grid */}
      {completedExpeditions.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedExpeditions.map((exp) => (
            <Link
              key={exp.id}
              href={`/dash/discover/${exp.id}`}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-amber-700/50 hover:bg-slate-800 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 font-sans text-xs text-slate-500 mb-3 uppercase tracking-wide">
                <span className="text-amber-600">•</span>
                <span>Complete • {exp.totalScenes} scenes</span>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-white mb-3 group-hover:text-amber-400 transition">
                {exp.title}
              </h3>
              <p className="font-sans text-sm text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                {exp.description}
              </p>
              <div className="flex items-center justify-between font-sans text-sm pt-4 border-t border-slate-700/50">
                <span className="text-slate-500">
                  {exp.playerCount} players • {exp.readerCount} readers
                </span>
                <span className="text-slate-400 group-hover:text-amber-400 transition font-medium">
                  {exp.unlockPrice} Ink 💧
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="font-serif text-2xl font-semibold text-white mb-2">
            No Stories Yet
          </h2>
          <p className="font-sans text-slate-400">
            Be patient! Expeditions will complete and appear here.
          </p>
        </div>
      )}
    </div>
  );
}