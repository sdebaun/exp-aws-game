import { GuideFeaturedCarousel } from "./_components/GuideFeaturedCarousel";
import { StoryCard } from "../_components/StoryCard";

export default async function GuidePage() {

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
      excerpt:
        "Captain Reave eyed the enchanted cannons with the expression of someone who'd made a series of questionable hiring decisions. 'When I said we needed firepower,' she muttered, watching one cannon argue philosophy with the mast, 'I meant the metaphorical kind.'",
      attribution: "Captain Reave, Scene 5",
      image: "https://picsum.photos/seed/live-salt/800/600",
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
      excerpt:
        "The rose addressed the intruders in perfectly clipped diction and what Thorne was fairly certain were threats. He'd spent fifteen years as a royal guard. None of his training covered negotiating with topiary that had developed strong opinions about trespassing.",
      attribution: "Thorne, Scene 9",
      image: "https://picsum.photos/seed/live-garden/800/600",
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
      excerpt:
        "Lyra checked her journal. According to yesterday's entry, she was an accountant named Marcus. Marcus's entry claimed he'd been a soldier called Orin. Orin's notes insisted reality was stable and everyone was overreacting. Orin, Lyra decided, was an optimist.",
      attribution: "Lyra (probably), Scene 3",
      image: "https://picsum.photos/seed/live-echo/800/600",
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
      {/* Featured Live Carousel */}
      <div className="mb-12">
        <GuideFeaturedCarousel
          stories={featuredLiveStories}
          autoPlayInterval={14000}
        />
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
            <StoryCard
              key={exp.id}
              id={exp.id}
              title={exp.title}
              excerpt={exp.excerpt}
              attribution={exp.attribution}
              image={exp.image}
              href={`/dash/guide/${exp.id}`}
              footer={{
                left: `${exp.playerCount} players • ${exp.spectatorCount} watching`,
              }}
            />
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
