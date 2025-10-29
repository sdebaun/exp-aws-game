import { getUserInfo } from "@/app/getUserInfo";
import Link from "next/link";

interface ChroniclePageProps {
  params: Promise<{ expeditionId: string }>;
}

export default async function ChroniclePage({ params }: ChroniclePageProps) {
  const { user, account } = await getUserInfo();
  const { expeditionId } = await params;

  // Mock data - will eventually come from database
  const expedition = {
    id: expeditionId,
    title: "The Last Dawn",
    description:
      "An epic tale of sacrifice and redemption in a world where magic itself is dying...",
    totalScenes: 25,
    playerCount: 6,
    unlockPrice: 10,
  };

  const hasEnoughInk = user && account && (account.ink ?? 0) >= expedition.unlockPrice;
  const isUnlocked = false; // TODO: Check if user has unlocked this chronicle

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/dash" className="hover:text-cyan-400 transition">
              ← Back to Discovery
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {expedition.title}
          </h1>
          <p className="text-slate-400">{expedition.description}</p>
        </div>

        {/* Chronicle Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-slate-500 text-sm mb-1">Total Scenes</div>
            <div className="text-white text-2xl font-bold">
              {expedition.totalScenes}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-slate-500 text-sm mb-1">Players</div>
            <div className="text-white text-2xl font-bold">
              {expedition.playerCount}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-slate-500 text-sm mb-1">Status</div>
            <div className="text-blue-400 text-2xl font-bold">Complete</div>
          </div>
        </div>

        {/* Unlock Status */}
        {!user ? (
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-3">
              Sign In to Unlock
            </h2>
            <p className="text-slate-400 mb-4">
              This completed chronicle costs {expedition.unlockPrice} Ink to
              unlock.
            </p>
            <Link
              href={`/api/auth/login?returnTo=/dash/chronicle/${expeditionId}`}
              className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        ) : isUnlocked ? (
          <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 mb-6">
            <p className="text-green-200 font-semibold">
              Chronicle Unlocked! Enjoy the full story below.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  Unlock Full Chronicle
                </h2>
                <p className="text-slate-400 text-sm">
                  Your Ink Balance: {account?.ink ?? 0} 💧
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white mb-1">
                  {expedition.unlockPrice} Ink
                </div>
                <div className="text-sm text-slate-500">to unlock</div>
              </div>
            </div>

            {hasEnoughInk ? (
              <button
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
                disabled
              >
                Unlock Chronicle (Coming Soon)
              </button>
            ) : (
              <div className="text-center">
                <p className="text-yellow-400 mb-3">
                  Not enough Ink. You need {expedition.unlockPrice - (account?.ink ?? 0)} more.
                </p>
                <button
                  className="bg-slate-700 text-slate-400 font-bold py-3 px-6 rounded-lg cursor-not-allowed"
                  disabled
                >
                  Insufficient Ink
                </button>
              </div>
            )}
          </div>
        )}

        {/* Preview Content */}
        <div className="mt-8 bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Preview: Scene 1
          </h2>
          <div className="text-slate-300 space-y-4">
            <p>
              The first scene is always free to read. This would contain the
              AI-generated narrative prose for the opening of the chronicle.
            </p>
            <p className="text-slate-500 italic">
              [Full narrative content coming soon...]
            </p>
          </div>

          {!isUnlocked && (
            <div className="mt-6 pt-6 border-t border-slate-700 text-center">
              <p className="text-slate-400 mb-2">
                🔒 Unlock to read {expedition.totalScenes - 1} more scenes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
