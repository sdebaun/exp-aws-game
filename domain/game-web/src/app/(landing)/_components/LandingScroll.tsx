'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { PlayExample } from './PlayExample';
import { CharacterPortrait } from './CharacterPortrait';

export function LandingScroll() {
  // Track which sections are in view
  const discoverRef = useRef(null);
  const guideRef = useRef(null);
  const createRef = useRef(null);

  const discoverInView = useInView(discoverRef, { amount: 0.3 });
  const guideInView = useInView(guideRef, { amount: 0.3 });
  const createInView = useInView(createRef, { amount: 0.3 });

  // Determine active section - prioritize by scroll position (top to bottom)
  // When scrolling down, switch to the next section as soon as it appears
  const activeSection = guideInView && !createInView ? 'guide'
    : createInView ? 'create'
    : 'discover';

  // Section metadata
  const sections = {
    discover: {
      tagline: 'Read the stories of every game played on the River of Souls.',
      color: 'text-blue-400',
      cta: {
        text: 'Read the Sagas',
        href: '/stories',
        gradient: 'from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400'
      }
    },
    guide: {
      tagline: 'Choose the challenges that players face and highlight the most impactful characters.',
      color: 'text-cyan-400',
      cta: {
        text: 'Guide the Stories',
        href: '/stories',
        gradient: 'from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400'
      }
    },
    create: {
      tagline: 'Start your own adventures that will be immortalized in the sagas of the river.',
      color: 'text-purple-400',
      cta: {
        text: 'Forge Your Quest',
        href: '/dash',
        gradient: 'from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400'
      }
    }
  };

  const active = sections[activeSection];

  return (
    <div className="min-h-screen">
      {/* Fixed Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-8 py-6">
          {/* Section links - second largest */}
          <div className="flex justify-center gap-8 mb-3">
            <a
              href="#discover"
              className={`text-xl font-semibold transition-all duration-300 ${
                activeSection === 'discover'
                  ? 'text-blue-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              DISCOVER
            </a>
            <span className="text-slate-700 text-xl">|</span>
            <a
              href="#guide"
              className={`text-xl font-semibold transition-all duration-300 ${
                activeSection === 'guide'
                  ? 'text-cyan-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              GUIDE
            </a>
            <span className="text-slate-700 text-xl">|</span>
            <a
              href="#create"
              className={`text-xl font-semibold transition-all duration-300 ${
                activeSection === 'create'
                  ? 'text-purple-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              CREATE
            </a>
          </div>

          {/* Static title - largest */}
          <div className="text-center mb-2">
            <h1 className="text-3xl font-semibold text-slate-300">
              the River of Souls
            </h1>
          </div>

          {/* Animated tagline - third largest */}
          <div className="text-center">
            <motion.p
              key={activeSection}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`text-base italic ${active.color}`}
            >
              {active.tagline}
            </motion.p>
          </div>
        </div>
      </nav>

      {/* Section 1: DISCOVER */}
      <section ref={discoverRef} id="discover" className="min-h-screen pt-48 pb-16 bg-[rgb(15,23,42)]">
        <div className="max-w-4xl mx-auto px-8">

          {/* Sample Narrative */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-blue-700/30 mb-12 overflow-hidden">
            <div className="p-8 relative">
              <div className="prose prose-invert max-w-none">
                <h4 className="text-lg font-bold text-white mb-3">
                  Chapter 12: The Demon&apos;s Bargain (Or: How to Lose Friends and Alienate Planes of Existence)
                </h4>

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
              </div>

              {/* Fade overlay to suggest more content */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent pointer-events-none"></div>
            </div>

            <div className="px-8 pb-8 pt-6 border-t border-slate-700">
              <p className="text-xs text-slate-500 mb-2">Scene 12 of 24 • The Siege of Astralgate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: GUIDE */}
      <section ref={guideRef} id="guide" className="min-h-screen pt-48 pb-16 bg-[rgb(8,51,68)]">
        <div className="max-w-4xl mx-auto px-8">
          {/* Voting UI */}
          <div className="bg-slate-900 rounded-lg p-6 border border-cyan-800 mb-12">
            <p className="text-xs text-cyan-500 mb-3 uppercase tracking-wide">Fates Voting on Next Challenge:</p>

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

          {/* MVP Voting */}
          <div className="bg-slate-900 rounded-lg p-6 border border-cyan-800">
            <p className="text-xs text-cyan-500 mb-3 uppercase tracking-wide">Fates Voting on MVP of Chapter 12:</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded hover:bg-slate-700 cursor-pointer">
                <div className="flex items-center gap-3">
                  <CharacterPortrait
                    characterId="char-1"
                    name="Sir Aldric"
                    size={48}
                    className="rounded-full border-2 border-slate-600"
                  />
                  <span className="text-sm text-white">Sir Aldric</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-slate-400">28 votes</div>
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full" style={{width: '31%'}}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-cyan-900/20 rounded border border-cyan-700/50">
                <div className="flex items-center gap-3">
                  <CharacterPortrait
                    characterId="char-3"
                    name="Whisper"
                    size={48}
                    className="rounded-full border-2 border-cyan-600"
                  />
                  <span className="text-sm text-white">Whisper</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-cyan-400 font-semibold">51 votes</div>
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full" style={{width: '57%'}}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800 rounded hover:bg-slate-700 cursor-pointer">
                <div className="flex items-center gap-3">
                  <CharacterPortrait
                    characterId="char-2"
                    name="Zephyra"
                    size={48}
                    className="rounded-full border-2 border-slate-600"
                  />
                  <span className="text-sm text-white">Zephyra</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-slate-400">11 votes</div>
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full" style={{width: '12%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3">90 Ink contributed by 35 Fates</p>
          </div>
        </div>
      </section>

      {/* Section 3: CREATE */}
      <section ref={createRef} id="create" className="min-h-screen pt-48 pb-16 bg-[rgb(46,16,101)]">
        <div className="max-w-4xl mx-auto px-8">
          {/* Chat Log */}
          <div className="mb-12">
            <PlayExample />
          </div>
        </div>
      </section>

      {/* Footer tagline */}
      <div className="pb-32 text-center bg-[rgb(46,16,101)]">
        <p className="text-slate-500 italic">
          Every story is unique. Every choice matters. Every legend was lived.
        </p>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <a
              href={active.cta.href}
              className={`inline-block bg-gradient-to-r ${active.cta.gradient} text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 text-lg`}
            >
              {active.cta.text} →
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
