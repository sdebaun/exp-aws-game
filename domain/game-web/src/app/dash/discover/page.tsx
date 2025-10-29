import Link from "next/link";
import { getUserInfo } from "@/app/getUserInfo";

export default async function DiscoverPage() {
  const { user, account } = await getUserInfo();

  // Mock data - will eventually come from database
  const completedExpeditions = [
    {
      id: "exp-3",
      title: "The Last Dawn",
      description:
        "An epic tale of sacrifice and redemption in a world where magic itself is dying...",
      totalScenes: 25,
      status: "complete" as const,
      playerCount: 6,
      readerCount: 412,
      unlockPrice: 10,
    },
    {
      id: "exp-6",
      title: "Echoes of the Fallen Star",
      description:
        "A meteor's impact awakens ancient evils and grants mortals terrible power...",
      totalScenes: 18,
      status: "complete" as const,
      playerCount: 4,
      readerCount: 289,
      unlockPrice: 10,
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Discover Stories
        </h1>
        <p className="text-slate-400">
          Completed adventures ready to unlock and read
        </p>
      </div>

      {/* Quick Info for Anonymous */}
      {!user && (
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-2">
            Read Epic Stories
          </h2>
          <p className="text-slate-300 mb-4">
            Sign in to unlock completed expeditions and read the full narratives
            crafted from player actions.
          </p>
          <Link
            href="/api/auth/login?returnTo=/dash/discover"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Sign In to Unlock
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
                Ink Balance: {account.ink ?? 0} 💧 • Stories cost 10 Ink to
                unlock
              </p>
            </div>
            {(account.ink ?? 0) < 10 && (
              <div className="text-sm text-yellow-400">
                Need more Ink to unlock
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expeditions Grid */}
      {completedExpeditions.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedExpeditions.map((exp) => (
            <Link
              key={exp.id}
              href={`/dash/discover/${exp.id}`}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <span className="text-blue-500">•</span>
                <span>COMPLETE • {exp.totalScenes} scenes</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition">
                {exp.title}
              </h3>
              <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                {exp.description}
              </p>
              <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-700">
                <span className="text-slate-500">
                  {exp.playerCount} players • {exp.readerCount} readers
                </span>
                <span className="text-slate-400 group-hover:text-blue-400 transition">
                  {exp.unlockPrice} Ink
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-white mb-2">
            No Stories Yet
          </h2>
          <p className="text-slate-400">
            Be patient! Expeditions will complete and appear here.
          </p>
        </div>
      )}
    </div>
  );
}