import { DiscoverFeaturedCarousel } from "./_components/DiscoverFeaturedCarousel";
import { StoryCard } from "../_components/StoryCard";

export default async function DiscoverPage() {

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
      excerpt:
        "The king's face smiled at us from across the table. Perfectly. Too perfectly. 'Your Majesty,' I said carefully, 'when did you learn to blink in unison with the candles?'",
      attribution: "Lord Ashford, Scene 18",
      image: "https://picsum.photos/seed/hollowcrown/800/600",
      totalScenes: 22,
      status: "complete" as const,
      playerCount: 5,
      readerCount: 387,
      unlockPrice: 10,
    },
    {
      id: "exp-8",
      title: "Salt & Sorcery",
      excerpt:
        "The ship was on fire. Again. Captain Reave glared at me with the kind of disappointment usually reserved for discovering your parrot's been embezzling. 'I specifically said no fireballs below deck.'",
      attribution: "Pyra the Mostly-Sorry, Scene 9",
      image: "https://picsum.photos/seed/saltsorcery/800/600",
      totalScenes: 16,
      status: "complete" as const,
      playerCount: 4,
      readerCount: 294,
      unlockPrice: 10,
    },
    {
      id: "exp-9",
      title: "The Garden of Iron Roses",
      excerpt:
        "The rose bush had grown teeth. Not metaphorical teeth—actual, gleaming incisors arranged in what could only be described as a smile. 'I think,' whispered Moss, 'the botanist knew exactly what she was doing.'",
      attribution: "Moss the Gardener's Apprentice, Scene 14",
      image: "https://picsum.photos/seed/ironroses/800/600",
      totalScenes: 20,
      status: "complete" as const,
      playerCount: 4,
      readerCount: 451,
      unlockPrice: 10,
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Featured Carousel */}
      <div className="mb-12">
        <DiscoverFeaturedCarousel stories={featuredStories} />
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
            <StoryCard
              key={exp.id}
              id={exp.id}
              title={exp.title}
              excerpt={exp.excerpt}
              attribution={exp.attribution}
              image={exp.image}
              href={`/dash/discover/${exp.id}`}
              footer={{
                left: `${exp.playerCount} players • ${exp.readerCount} readers`,
                right: `${exp.unlockPrice} Ink`,
              }}
            />
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