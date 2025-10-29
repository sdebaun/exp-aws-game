import { getUserInfo } from "@/app/getUserInfo";
import Link from "next/link";

interface GuideDetailPageProps {
  params: Promise<{ expeditionId: string }>;
}

export default async function GuideDetailPage({
  params,
}: GuideDetailPageProps) {
  const { user, account } = await getUserInfo();
  const { expeditionId } = await params;

  // Mock data - will eventually come from database
  const expedition = {
    id: expeditionId,
    title: "Merchants of the Void",
    description:
      "A trade negotiation turns deadly when ancient artifacts reveal their true power...",
    longDescription:
      "What began as a simple trade negotiation in the void-touched markets of Krell has spiraled into something far more dangerous. Ancient artifacts, thought to be mere trinkets, have awakened with terrible purpose. Three merchants must navigate treachery, power, and their own greed to survive the night.",
    scene: 8,
    totalScenes: 15,
    status: "live" as const,
    playerCount: 3,
    spectatorCount: 89,
    votePrice: 5,
  };

  // Spectating is public, but voting requires auth and Ink
  const canVote = user && account && (account.ink ?? 0) >= expedition.votePrice;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dash/guide"
          className="text-purple-400 hover:text-purple-300 text-sm"
        >
          ← Back to Guide
        </Link>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <span className="text-yellow-500">•</span>
          <span>
            LIVE • Scene {expedition.scene} of {expedition.totalScenes}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">
          {expedition.title}
        </h1>
        <p className="text-lg text-slate-300 mb-6">
          {expedition.longDescription}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-slate-500 text-sm mb-1">Current Scene</div>
            <div className="text-white text-2xl font-bold">
              {expedition.scene}/{expedition.totalScenes}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-slate-500 text-sm mb-1">Players</div>
            <div className="text-white text-2xl font-bold">
              {expedition.playerCount}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-slate-500 text-sm mb-1">Spectators</div>
            <div className="text-white text-2xl font-bold">
              {expedition.spectatorCount}
            </div>
          </div>
        </div>

        {/* Voting Status */}
        {!user ? (
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-6 mb-6 text-center">
            <h2 className="text-xl font-bold text-white mb-3">
              Influence This Story
            </h2>
            <p className="text-purple-200 mb-4">
              Sign in to vote on challenges and shape the narrative!
            </p>
            <Link
              href={`/api/auth/login?returnTo=/dash/guide/${expeditionId}`}
              className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Sign In to Vote
            </Link>
          </div>
        ) : !canVote ? (
          <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 mb-6">
            <p className="text-yellow-200">
              You need at least <strong>{expedition.votePrice} Ink</strong> to
              vote. Current balance: {account?.ink ?? 0} 💧
            </p>
          </div>
        ) : (
          <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 mb-6">
            <p className="text-green-200">
              You can vote! Balance: {account.ink} 💧 ({expedition.votePrice}{" "}
              Ink per vote)
            </p>
          </div>
        )}

        {/* Live Content Area */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-purple-400 mb-4">
            Current Scene: The Awakening
          </h2>
          <p className="text-slate-300 mb-4">
            This is where the live expedition content would stream. Anonymous
            users can watch for free, authenticated users can vote on
            challenges.
          </p>
          <div className="text-slate-400 italic">
            [Real-time scene events, player actions, and narrative generation
            coming soon...]
          </div>
        </div>

        {/* What Spectators Can Do */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-3">As a Spectator</h3>
          <ul className="text-slate-300 space-y-2">
            <li>• Watch the expedition unfold in real-time (free)</li>
            <li>
              • View AI-generated narrative as scenes complete (free for live
              scenes)
            </li>
            <li>
              • Vote on challenges to throw at players ({expedition.votePrice}{" "}
              Ink per vote)
            </li>
            <li>• See current player positions and declared actions</li>
            <li>• Track your influence contributions to the story</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
