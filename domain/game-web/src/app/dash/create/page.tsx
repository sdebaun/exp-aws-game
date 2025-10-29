import Link from "next/link";
import { getUserInfo } from "@/app/getUserInfo";

export default async function CreatePage() {
  const { user, account } = await getUserInfo();

  // Mock data - will eventually come from database
  const recruitingExpeditions = [
    {
      id: "exp-1",
      title: "The Siege of Astralgate",
      description:
        "Four heroes defend a mystical portal from an endless demon horde. Time is running out...",
      scene: 0,
      totalScenes: 20,
      status: "recruiting" as const,
      playerCount: 2,
      maxPlayers: 4,
      spectatorCount: 127,
    },
    {
      id: "exp-4",
      title: "Shadows Over Grimwatch",
      description:
        "A coastal town plagued by mysterious disappearances needs investigators brave enough to face the truth...",
      scene: 0,
      totalScenes: 16,
      status: "recruiting" as const,
      playerCount: 1,
      maxPlayers: 3,
      spectatorCount: 54,
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-white mb-2">
          Create Your Story
        </h1>
        <p className="font-sans text-slate-400">
          Join expeditions or start your own adventure
        </p>
      </div>

      {/* Authenticated User Status */}
      {user && account && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-sans text-lg font-semibold text-white">Your Status</h2>
              <p className="font-sans text-sm text-slate-400 mt-1">
                Ink Balance: {account.ink ?? 0} 💧
              </p>
            </div>
            <Link
              href="/character/new"
              className="font-sans bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              + Create Character
            </Link>
          </div>
        </div>
      )}

      {/* Expeditions Grid */}
      {recruitingExpeditions.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recruitingExpeditions.map((exp) => (
            <Link
              key={exp.id}
              href={`/dash/create/${exp.id}`}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-700/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 font-sans text-xs text-slate-500 mb-3 uppercase tracking-wide">
                <span className="text-green-500">•</span>
                <span>
                  Recruiting • {exp.playerCount}/{exp.maxPlayers} Players
                </span>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition">
                {exp.title}
              </h3>
              <p className="font-sans text-sm text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                {exp.description}
              </p>
              <div className="flex items-center justify-between font-sans text-sm pt-4 border-t border-slate-700">
                <span className="text-slate-500">
                  {exp.spectatorCount} watching
                </span>
                <span className="text-cyan-400 group-hover:text-cyan-300 transition font-medium">
                  Join Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">🎭</div>
          <h2 className="font-serif text-2xl font-semibold text-white mb-2">
            No Expeditions Recruiting
          </h2>
          <p className="font-sans text-slate-400">
            Check back soon, or start your own expedition!
          </p>
        </div>
      )}
    </div>
  );
}
