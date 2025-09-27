import { TopBar } from "./TopBar";
import { getUserInfo } from "./getUserInfo";
import { HomeUser } from "./HomeUser";

import { RoleNav } from "./components/RoleNav";
import { PlayExample } from "./components/PlayExample";

export async function HomeAnon() {

  return (
    <div>
      <RoleNav 
        currentPath="/"
        showHeroContent={true}
      />

      <div className="px-8 pt-8 pb-16 max-w-6xl mx-auto">
        {/* The Magic Transformation */}
        <section className="mt-16">
          
          {/* Step 1: Players Decide */}
          <PlayExample />

          {/* Step 2: Guides Decide */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-cyan-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
              <h3 className="text-xl font-bold text-cyan-400">Guides decide what they face</h3>
            </div>
            
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
              <p className="text-xs text-slate-500 mb-3">FATES VOTING ON NEXT CHALLENGE:</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800 rounded hover:bg-slate-700 cursor-pointer">
                  <span className="text-sm text-white">The demon general offers a dark bargain</span>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-slate-400">42 votes</div>
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{width: '35%'}}></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-cyan-900/20 rounded border border-cyan-700/50">
                  <span className="text-sm text-white">Reinforcements arrive... but from which realm?</span>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-cyan-400 font-semibold">67 votes</div>
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{width: '56%'}}></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800 rounded hover:bg-slate-700 cursor-pointer">
                  <span className="text-sm text-white">The portal begins to destabilize</span>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-slate-400">11 votes</div>
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{width: '9%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-slate-500 mt-3">120 Ink contributed by 47 Fates</p>
            </div>
          </div>

          {/* Step 3: AI Transforms */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
              <h3 className="text-xl font-bold text-blue-400">Anyone can read the saga</h3>
            </div>
            
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-8 border border-blue-700/30">
              <div className="prose prose-invert max-w-none">
                <h4 className="text-lg font-bold text-white mb-3">Chapter 12: The Demon&apos;s Bargain (Or: How to Lose Friends and Alienate Planes of Existence)</h4>
                
                <p className="text-slate-300 leading-relaxed mb-4">
                  The demon general appeared with all the subtlety of a brick through a stained-glass window, which is to say, 
                  none at all. Its voice had that particular quality that suggested it had gargled with gravel and molten lead 
                  for breakfast. &ldquo;Your realm falls, mortal champions,&rdquo; it announced, in the tones of someone reading from 
                  a script they&apos;d clearly used before. &ldquo;But I offer you a choice—serve me, and live to see another dawn.&rdquo;
                </p>
                
                <p className="text-slate-300 leading-relaxed mb-4">
                  It was the sort of offer that came with invisible fine print, probably written in something unpleasant.
                </p>
                
                <p className="text-slate-300 leading-relaxed mb-4">
                  Sir Aldric, whose armor now looked like it had been through a particularly enthusiastic recycling process, 
                  squared his shoulders. Knights, as a rule, didn&apos;t do nuance. They did Honor, with a capital H that you 
                  could practically hear clanging. &ldquo;My honor is NOT for sale, demon!&rdquo; he declared, in what he probably 
                  thought was his inside voice.
                </p>
                
                <p className="text-slate-300 leading-relaxed mb-4">
                  The effect was somewhat spoiled by the fact that he&apos;d accidentally triggered his Rally Cry ability, 
                  which meant everyone within earshot suddenly felt inexplicably patriotic and slightly deaf.
                </p>
                
                <p className="text-slate-300 leading-relaxed mb-4 italic">
                  While Sir Aldric was busy being loudly honorable, Whisper was doing what assassins did best: being somewhere 
                  else entirely. Specifically, behind the demon general, holding two daggers that glistened with the sort of 
                  poison that came with a warranty disclaimer. &ldquo;Time to put my assassin training to use,&rdquo; they thought, 
                  which was a bit like a fish thinking &ldquo;time to try swimming.&rdquo;
                </p>
                
                <p className="text-slate-300 leading-relaxed mb-4">
                  Meanwhile, Zephyra the mage was having what could charitably be called a resource management crisis. 
                  &ldquo;I&apos;m almost out of mana. Maybe two spells left,&rdquo; she muttered, which in mage terms was rather 
                  like saying &ldquo;I&apos;ve got two bullets left and there&apos;s a dragon.&rdquo; But when the demon made its 
                  offer, her response was eloquent in its brevity: &ldquo;Wait, what?&rdquo;
                </p>
                
                <p className="text-slate-300 leading-relaxed mb-4">
                  Still, she channeled everything she had left into a Shield Wall, because that&apos;s what you did when 
                  demons started making career proposals. The barrier shimmered into existence with the desperate energy 
                  of a thesis defense deadline.
                </p>
                
                <p className="text-slate-300 leading-relaxed">
                  What followed was what historians would later describe as &ldquo;a right mess,&rdquo; assuming any survived. 
                  The demon general, who had been expecting either cowering submission or a nice, orderly duel, instead got 
                  Whisper&apos;s poisoned daggers in several uncomfortable places while simultaneously being charged by a knight 
                  who was glowing like a holy nightlight. The demon&apos;s roar of outrage had a distinct note of &ldquo;this 
                  wasn&apos;t in the prophecy&rdquo; about it.
                </p>
                
                <p className="text-slate-300 leading-relaxed mb-4">
                  Against all odds, laws of narrative causality, and common sense, victory seemed possible. The demon general 
                  was definitely having what could be called a bad day at the office. But then came the Choice, because there&apos;s 
                  always a Choice in these things, usually capitalized and usually involving moral quandaries.
                </p>
                
                <p className="text-slate-300 leading-relaxed">
                  Sir Aldric, faced with a selection of dramatic options, naturally picked the one marked &ldquo;I Shall Never 
                  Bargain&rdquo; with all the confidence of someone who definitely meant to do that. The fact that he immediately 
                  yelled &ldquo;OH SHIT THAT WAS THE WRONG BUTTON&rdquo; rather undermined the heroic moment, while Whisper&apos;s 
                  contribution of &ldquo;lmao classic knight move&rdquo; didn&apos;t help matters.
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Scene 12 of 24 • The Siege of Astralgate</p>
                  <a href="/read" className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                    Read Full Story →
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <p className="text-slate-400 mb-6">
              Every story is unique. Every choice matters. Every legend was lived.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="/play" className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200">
                Play a Hero
              </a>
              <a href="/guide" className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200">
                Guide the Fates
              </a>
              <a href="/read" className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 border border-slate-600">
                Read Legends
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default async function Home() {
  const { user, account } = await getUserInfo();

  // No longer auto-redirect - let user choose when to claim a demense

  return (
    <div className="min-h-screen bg-slate-950">
      {user ? (
        <>
          <TopBar {...{user, account}}/>
          <HomeUser {...{user, account}}/>
        </>
      ) : (
        <HomeAnon/>
      )}
    </div>
  )
}
