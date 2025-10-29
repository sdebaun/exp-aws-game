import Link from "next/link";
import { getUserInfo } from "@/app/getUserInfo";
import { FeaturedLiveCarousel } from "./_components/FeaturedLiveCarousel";

export default async function GuidePage() {
  const { user, account } = await getUserInfo();

  // Mock featured live stories - big hero carousel
  const featuredLiveStories = [
    {
      id: "exp-1",
      title: "The Siege of Astralgate",
      tagline: "The portal's open. The votes are flying. Honor's getting expensive.",
      excerpt:
        "The portal vomited something that looked like reinforcements if you squinted and had a very optimistic definition of the word. General Vex watched them shamble through and thought, not for the first time today, that democracy was overrated.",
      attribution: "Current scene, ongoing",
      scene: 12,
      totalScenes: 24,
      playerCount: 6,
      spectatorCount: 342,
      activeVotes: 87,
      votePrice: 5,
      images: {
        hero: "https://picsum.photos/seed/live-astral/1200/600",
        thumbnails: [
          "https://picsum.photos/seed/live-astral1/400/300",
          "https://picsum.photos/seed/live-astral2/400/300",
          "https://picsum.photos/seed/live-astral3/400/300",
        ],
      },
    },
    {
      id: "exp-2",
      title: "Merchants of the Void",
      tagline: "Trade negotiations. Ancient artifacts. What could go wrong?",
      excerpt:
        "The artifact pulsed with what Fenris hoped was just enthusiasm and not imminent catastrophic failure. 'So,' he said, trying to sound like a professional merchant and not someone whose life choices were rapidly catching up with him, 'shall we start the bidding at please-don't-explode?'",
      attribution: "Fenris, negotiating badly",
      scene: 8,
      totalScenes: 15,
      playerCount: 3,
      spectatorCount: 189,
      activeVotes: 52,
      votePrice: 5,
      images: {
        hero: "https://picsum.photos/seed/live-merchants/1200/600",
        thumbnails: [
          "https://picsum.photos/seed/live-void1/400/300",
          "https://picsum.photos/seed/live-void2/400/300",
          "https://picsum.photos/seed/live-void3/400/300",
        ],
      },
    },
    {
      id: "exp-3",
      title: "The Hollow Crown",
      tagline: "The king's face. Wrong everything else.",
      excerpt:
        "The thing wearing the king smiled with teeth that belonged in the right mouth but were arranged in ways that made Seraph's hindbrain scream. It had taken three days and seventeen vanished witnesses for everyone to stop pretending this was normal.",
      attribution: "Seraph, finally acknowledging the obvious",
      scene: 7,
      totalScenes: 22,
      playerCount: 5,
      spectatorCount: 278,
      activeVotes: 94,
      votePrice: 5,
      images: {
        hero: "https://picsum.photos/seed/live-crown/1200/600",
        thumbnails: [
          "https://picsum.photos/seed/live-crown1/400/300",
          "https://picsum.photos/seed/live-crown2/400/300",
          "https://picsum.photos/seed/live-crown3/400/300",
        ],
      },
    },
    {
      id: "exp-4",
      title: "Blood & Brass",
      tagline: "Revolution. Clockwork hearts. Complicated loyalties.",
      excerpt:
        "The power grid flickered. Rust's chest gears hitched. Around the barricade, seventeen workers clutched their chests as their clockwork implants stuttered. 'Well,' Rust wheezed, 'this complicates the rhetoric about workers' solidarity.'",
      attribution: "Rust, experiencing democracy",
      scene: 11,
      totalScenes: 19,
      playerCount: 4,
      spectatorCount: 412,
      activeVotes: 128,
      votePrice: 5,
      images: {
        hero: "https://picsum.photos/seed/live-bloodbrass/1200/600",
        thumbnails: [
          "https://picsum.photos/seed/live-brass1/400/300",
          "https://picsum.photos/seed/live-brass2/400/300",
          "https://picsum.photos/seed/live-brass3/400/300",
        ],
      },
    },
    {
      id: "exp-5",
      title: "The Crimson Pact",
      tagline: "Blood magic. War. The choice between power and conscience.",
      excerpt:
        "The figure stepped from the shadows offering exactly what they needed and nothing they wanted. Kael stared at the offered contract, written in something that definitely wasn't ink. 'How desperate,' she asked nobody in particular, 'is too desperate?'",
      attribution: "Kael, asking the wrong questions",
      scene: 4,
      totalScenes: 12,
      playerCount: 4,
      spectatorCount: 256,
      activeVotes: 71,
      votePrice: 5,
      images: {
        hero: "https://picsum.photos/seed/live-crimson/1200/600",
        thumbnails: [
          "https://picsum.photos/seed/live-pact1/400/300",
          "https://picsum.photos/seed/live-pact2/400/300",
          "https://picsum.photos/seed/live-pact3/400/300",
        ],
      },
    },
    {
      id: "exp-6",
      title: "The Cartographer's Gambit",
      tagline: "She edits maps. Reality edits itself. Three empires want her dead.",
      excerpt:
        "Marlowe erased the street she was standing on. For a brief, vertiginous moment, she hung in the theoretical space between what was and what she'd just rewritten. Then reality caught up, deposited her two blocks west, and pretended nothing had happened.",
      attribution: "Marlowe, improvising",
      scene: 15,
      totalScenes: 28,
      playerCount: 5,
      spectatorCount: 301,
      activeVotes: 83,
      votePrice: 5,
      images: {
        hero: "https://picsum.photos/seed/live-cartographer/1200/600",
        thumbnails: [
          "https://picsum.photos/seed/live-map1/400/300",
          "https://picsum.photos/seed/live-map2/400/300",
          "https://picsum.photos/seed/live-map3/400/300",
        ],
      },
    },
  ];

  // Mock data - more live expeditions
  const liveExpeditions = [
    {
      id: "exp-7",
      title: "Salt & Sorcery",
      description:
        "Pirate wizards. Enchanted cannons. A sea serpent that's definitely judging everyone's life choices.",
      scene: 5,
      totalScenes: 16,
      status: "live" as const,
      playerCount: 4,
      spectatorCount: 145,
      votePrice: 5,
    },
    {
      id: "exp-8",
      title: "The Garden of Iron Roses",
      description:
        "The royal botanist vanished. Her garden didn't. Now the roses have teeth and opinions.",
      scene: 9,
      totalScenes: 20,
      status: "live" as const,
      playerCount: 4,
      spectatorCount: 198,
      votePrice: 5,
    },
    {
      id: "exp-9",
      title: "Echoes of the Fallen Star",
      description:
        "Meteor impact. Terrible powers. Every use rewrites history. Nobody's sure who they were yesterday.",
      scene: 3,
      totalScenes: 18,
      status: "live" as const,
      playerCount: 4,
      spectatorCount: 223,
      votePrice: 5,
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
            {(account.ink ?? 0) < 5 && (
              <div className="font-sans text-sm text-yellow-400">
                Need more Ink to vote
              </div>
            )}
          </div>
        </div>
      )}

      {/* Featured Live Carousel */}
      <div className="mb-12">
        <FeaturedLiveCarousel stories={featuredLiveStories} />
      </div>

      {/* More Live Stories Section */}
      <div className="mb-6">
        <h2 className="font-serif text-3xl font-bold text-white mb-2">
          More Live Stories
        </h2>
        <p className="font-sans text-slate-400">
          Other adventures happening right now
        </p>
      </div>

      {/* Expeditions Grid */}
      {liveExpeditions.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveExpeditions.map((exp) => (
            <Link
              key={exp.id}
              href={`/dash/guide/${exp.id}`}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-amber-700/50 hover:bg-slate-800 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 font-sans text-xs text-slate-500 mb-3 uppercase tracking-wide">
                <span className="text-red-500">•</span>
                <span>
                  Live • Scene {exp.scene} of {exp.totalScenes}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-white mb-3 group-hover:text-amber-400 transition">
                {exp.title}
              </h3>
              <p className="font-sans text-sm text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                {exp.description}
              </p>
              <div className="flex items-center justify-between font-sans text-sm pt-4 border-t border-slate-700/50">
                <span className="text-slate-500">
                  {exp.playerCount} players • {exp.spectatorCount} watching
                </span>
                <span className="text-slate-400 group-hover:text-amber-400 transition font-medium">
                  Watch →
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">👀</div>
          <h2 className="font-serif text-2xl font-semibold text-white mb-2">
            No Live Expeditions
          </h2>
          <p className="font-sans text-slate-400">
            Check back soon as new adventures begin!
          </p>
        </div>
      )}
    </div>
  );
}
