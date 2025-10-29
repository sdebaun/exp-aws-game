import { getUserInfo } from "@/app/getUserInfo";
import Link from "next/link";

interface DiscoverDetailPageProps {
  params: Promise<{ expeditionId: string }>;
}

export default async function DiscoverDetailPage({
  params,
}: DiscoverDetailPageProps) {
  const { user, account } = await getUserInfo();
  const { expeditionId } = await params;

  // Mock data - will eventually come from database
  const expedition = {
    id: expeditionId,
    title: "The Siege of Astralgate",
    description:
      "Four heroes defend a mystical portal from an endless demon horde. Time is running out...",
    longDescription:
      "In the war-torn realm of Astralgate, a mystical portal serves as the last bastion between our world and the demon hordes beyond. Four brave souls have answered the call to defend it, but the darkness presses closer with each passing hour. Will courage and cunning be enough to hold the line?",
    scene: 0, // Not started yet
    totalScenes: 20,
    status: "recruiting" as const,
    playerCount: 2,
    maxPlayers: 4,
    spectatorCount: 127,
    charactersNeeded: ["Warrior", "Mage"], // Conceptual, not implemented
  };

  const canJoin = user && account; // Could add more checks: has characters, has Ink, etc.

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dash/discover"
          className="text-cyan-400 hover:text-cyan-300 text-sm"
        >
          ← Back to Discover
        </Link>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <span className="text-green-500">•</span>
          <span>
            RECRUITING • {expedition.playerCount}/{expedition.maxPlayers}{" "}
            Players
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
            <div className="text-slate-500 text-sm mb-1">Players</div>
            <div className="text-white text-2xl font-bold">
              {expedition.playerCount}/{expedition.maxPlayers}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-slate-500 text-sm mb-1">Spectators</div>
            <div className="text-white text-2xl font-bold">
              {expedition.spectatorCount}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-slate-500 text-sm mb-1">Expected Scenes</div>
            <div className="text-white text-2xl font-bold">
              {expedition.totalScenes}
            </div>
          </div>
        </div>

        {/* Join CTA */}
        {!user ? (
          <div className="bg-cyan-900/30 border border-cyan-700/50 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-3">
              Ready to Join the Adventure?
            </h2>
            <p className="text-slate-300 mb-4">
              Sign in to add your character to this expedition.
            </p>
            <Link
              href={`/api/auth/login?returnTo=/dash/discover/${expeditionId}`}
              className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Sign In to Join
            </Link>
          </div>
        ) : canJoin ? (
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Join This Expedition
            </h2>
            <p className="text-slate-300 mb-4">
              Select a character from your roster to join this adventure.
            </p>
            <button
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
              disabled
            >
              Choose Character (Coming Soon)
            </button>
          </div>
        ) : (
          <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-3">
              Almost There!
            </h2>
            <p className="text-slate-300 mb-4">
              Create a character first before joining expeditions.
            </p>
            <Link
              href="/character/new"
              className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Create Your First Character
            </Link>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-8 bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-3">
            What to Expect
          </h3>
          <ul className="text-slate-300 space-y-2">
            <li>• Multi-day collaborative storytelling experience</li>
            <li>
              • Real-time chat with other players to coordinate actions (OOC)
            </li>
            <li>• Declare character actions that shape the narrative</li>
            <li>
              • Watch as AI transforms your actions into polished story scenes
            </li>
            <li>
              • React to challenges voted on by spectators watching the
              expedition
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
