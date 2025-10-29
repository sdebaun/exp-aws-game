import Link from "next/link";
import { getUserInfo } from "@/app/getUserInfo";

export default async function GuidePage() {
  const { user, account } = await getUserInfo();

  // Mock data - will eventually come from database
  const liveExpeditions = [
    {
      id: "exp-2",
      title: "Merchants of the Void",
      description:
        "A trade negotiation turns deadly when ancient artifacts reveal their true power...",
      scene: 8,
      totalScenes: 15,
      status: "live" as const,
      playerCount: 3,
      spectatorCount: 89,
      votePrice: 5,
    },
    {
      id: "exp-5",
      title: "The Crimson Pact",
      description:
        "Blood magic practitioners must decide between power and conscience as war looms...",
      scene: 4,
      totalScenes: 12,
      status: "live" as const,
      playerCount: 4,
      spectatorCount: 156,
      votePrice: 5,
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Guide Expeditions
        </h1>
        <p className="text-slate-400">
          Watch live adventures and influence the story
        </p>
      </div>

      {/* Quick Info for Anonymous */}
      {!user && (
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-2">
            Become a Guide
          </h2>
          <p className="text-slate-300 mb-4">
            Sign in to vote on challenges and shape the narrative of live
            expeditions.
          </p>
          <Link
            href="/api/auth/login?returnTo=/dash/guide"
            className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Sign In to Vote
          </Link>
        </div>
      )}

      {/* Authenticated User Quick Actions */}
      {user && account && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Your Status</h2>
              <p className="text-sm text-slate-400 mt-1">
                Ink Balance: {account.ink ?? 0} 💧 • Votes cost 5 Ink each
              </p>
            </div>
            {(account.ink ?? 0) < 5 && (
              <div className="text-sm text-yellow-400">
                Need more Ink to vote
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expeditions Grid */}
      {liveExpeditions.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveExpeditions.map((exp) => (
            <Link
              key={exp.id}
              href={`/dash/guide/${exp.id}`}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-purple-700/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <span className="text-yellow-500">•</span>
                <span>
                  LIVE • Scene {exp.scene} of {exp.totalScenes}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition">
                {exp.title}
              </h3>
              <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                {exp.description}
              </p>
              <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-700">
                <span className="text-slate-500">
                  {exp.playerCount} players • {exp.spectatorCount} spectators
                </span>
                <span className="text-purple-400 group-hover:text-purple-300 transition">
                  Watch →
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">👀</div>
          <h2 className="text-xl font-bold text-white mb-2">
            No Live Expeditions
          </h2>
          <p className="text-slate-400">
            Check back soon as new adventures begin!
          </p>
        </div>
      )}
    </div>
  );
}
