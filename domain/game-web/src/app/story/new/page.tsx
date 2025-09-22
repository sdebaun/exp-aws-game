import { redirect } from 'next/navigation';
import { TopBar } from '@/app/TopBar';
import { getUserInfo } from '@/app/getUserInfo';

export default async function NewStoryPage() {
  const { user, account, demense } = await getUserInfo();

  if (!user) {
    redirect('/auth/login?returnTo=/story/new');
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar {...{user, account, demense}}/>
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-white mb-2">Start a New Story</h1>
        <p className="text-lg text-slate-400 mb-8">Create your own adventure and gather heroes for an epic journey</p>

        <div className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border border-purple-700/50 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-white mb-4">Coming Soon!</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            The ability to create your own stories is under construction. Soon you'll be able to:
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto mb-8">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-cyan-400 mb-2">📝 Design Your Quest</h3>
              <p className="text-sm text-slate-400">Choose genre, setting, and initial plot hooks</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-400 mb-2">⚔️ Set Parameters</h3>
              <p className="text-sm text-slate-400">Define player count, story length, and pacing</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-green-400 mb-2">🎭 Recruit Heroes</h3>
              <p className="text-sm text-slate-400">Open your story for others to join</p>
            </div>
          </div>
          <a 
            href="/"
            className="inline-block bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200"
          >
            ← Back to Stories
          </a>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Want to be notified when story creation launches?
          </p>
          <p className="text-sm text-cyan-400 mt-2">
            Check back soon or follow us for updates!
          </p>
        </div>
      </div>
    </div>
  );
}