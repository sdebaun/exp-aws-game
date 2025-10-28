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
  const activeSection = guideInView && !createInView ? 'guide'
    : createInView ? 'create'
    : 'discover';

  // Section metadata with design spec copy and colors
  const sections = {
    discover: {
      title: 'See the River',
      quote: 'Every story starts as a ripple. Watch how far it goes.',
      cta: {
        text: 'Discover the Sagas',
        href: '/discover',
      },
      gradientFrom: '#0a0f12', // ink black
      gradientTo: '#27323a',   // blue-grey
      textColor: 'text-slate-400',
      activeColor: 'text-blue-400',
    },
    guide: {
      title: 'Bend the Current',
      quote: 'Your vote changes the tide. Choose what the River remembers.',
      cta: {
        text: 'Guide the Stories',
        href: '/guide',
      },
      gradientFrom: '#27323a', // blue-grey
      gradientTo: '#9a4d2e',   // rust red
      textColor: 'text-amber-400',
      activeColor: 'text-amber-500',
    },
    create: {
      title: 'Start Your Story',
      quote: 'Make your mark. Build something worth remembering.',
      cta: {
        text: 'Create Your Story',
        href: '/create',
      },
      gradientFrom: '#9a4d2e',   // rust red
      gradientTo: '#d6a85b',     // aged gold
      textColor: 'text-amber-300',
      activeColor: 'text-amber-400',
    }
  };

  const active = sections[activeSection];

  return (
    <div className="min-h-screen">
      {/* Fixed Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f12]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* Product name - largest, Cormorant Garamond */}
          <div className="text-center mb-4">
            <h1 className="font-serif font-bold text-4xl text-slate-200" style={{ letterSpacing: '0.15em' }}>
              River of Souls
            </h1>
          </div>

          {/* Section links - Space Grotesk */}
          <div className="flex justify-center gap-6 text-sm font-sans font-semibold uppercase tracking-wide">
            <a
              href="#discover"
              className={`transition-all duration-300 ${
                activeSection === 'discover'
                  ? sections.discover.activeColor
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Discover
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="#guide"
              className={`transition-all duration-300 ${
                activeSection === 'guide'
                  ? sections.guide.activeColor
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Guide
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="#create"
              className={`transition-all duration-300 ${
                activeSection === 'create'
                  ? sections.create.activeColor
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create
            </a>
          </div>
        </div>
      </nav>

      {/* DISCOVER Section */}
      <section
        ref={discoverRef}
        id="discover"
        className="min-h-screen pt-48 pb-32"
        style={{
          background: `linear-gradient(to bottom, ${sections.discover.gradientFrom}, ${sections.discover.gradientTo})`
        }}
      >
        <div className="max-w-4xl mx-auto px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="font-serif font-semibold text-5xl text-slate-200 uppercase tracking-wide mb-6">
              {sections.discover.title}
            </h2>
            <p className="font-serif italic text-2xl mb-8" style={{ color: '#d6a85b' }}>
              {sections.discover.quote}
            </p>
            <p className="font-sans text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-6">
              Stories here aren&apos;t written—they&apos;re <em className="not-italic text-slate-300 font-medium">witnessed</em>.
              Players make choices. You watch consequences unfold, chapter by chapter, until the story ends—or the characters do.
            </p>
            {/* <p className="font-sans text-slate-500 text-base leading-relaxed max-w-2xl mx-auto">
              You&apos;re not reading a book—you&apos;re watching someone else&apos;s bet play out.
              Sometimes they win. Sometimes the River wins.
            </p> */}
          </div>

          {/* Sample Narrative */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-blue-700/30 overflow-hidden">
            <div className="p-8 relative">
              <div className="prose prose-invert max-w-none">
                <h4 className="font-sans text-lg font-bold text-white mb-3">
                  Chapter 12: The Demon&apos;s Bargain (Or: How to Lose Friends and Alienate Planes of Existence)
                </h4>

                <p className="font-sans text-slate-300 leading-relaxed mb-4">
                  The demon general appeared with all the subtlety of a brick through a stained-glass window, which is to say,
                  none at all. Its voice had that particular quality that suggested it had gargled with gravel and molten lead
                  for breakfast.
                </p>

                <p className="font-sans text-slate-300 leading-relaxed mb-4">
                  &ldquo;Your realm falls, mortal champions,&rdquo; it announced, in the tones of someone reading from
                  a script they&apos;d clearly used before. &ldquo;But I offer you a choice—serve me, and live to see another dawn.&rdquo;
                </p>

                <p className="font-sans text-slate-300 leading-relaxed mb-4">
                  It was the sort of offer that came with invisible fine print, probably written in something unpleasant.
                </p>

                <p className="font-sans text-slate-300 leading-relaxed mb-4">
                  Sir Aldric, whose armor now looked like it had been through a particularly enthusiastic recycling process,
                  squared his shoulders. Knights, as a rule, didn&apos;t do nuance. They did Honor, with a capital H that you
                  could practically hear clanging.
                </p>

                <p className="font-sans text-slate-300 leading-relaxed mb-4">
                  &ldquo;My honor is NOT for sale, demon!&rdquo; he declared, in what he probably thought was his inside voice.
                </p>

                <p className="font-sans text-slate-300 leading-relaxed mb-4">
                  The effect was somewhat spoiled by the fact that he&apos;d accidentally triggered his Rally Cry ability,
                  which meant everyone within earshot suddenly felt inexplicably patriotic and slightly deaf.
                </p>
              </div>

              {/* Fade overlay to suggest more content */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent pointer-events-none"></div>
            </div>

            <div className="px-8 pb-8 pt-6 border-t border-slate-700">
              <p className="font-sans text-xs text-slate-500">Scene 12 of 24 • The Siege of Astralgate</p>
            </div>
          </div>
        </div>
      </section>

      {/* GUIDE Section */}
      <section
        ref={guideRef}
        id="guide"
        className="min-h-screen pt-48 pb-32"
        style={{
          background: `linear-gradient(to bottom, ${sections.guide.gradientFrom}, ${sections.guide.gradientTo})`
        }}
      >
        <div className="max-w-4xl mx-auto px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="font-serif font-semibold text-5xl text-slate-200 uppercase tracking-wide mb-6">
              {sections.guide.title}
            </h2>
            <p className="font-serif italic text-2xl mb-8 text-amber-200">
              {sections.guide.quote}
            </p>
            <p className="font-sans text-slate-200 text-lg leading-relaxed max-w-2xl mx-auto mb-6">
              Watching isn&apos;t enough anymore, is it? Every scene, you vote on what breaks next.
              Your Ink. Their chaos.
            </p>
            {/* <p className="font-sans text-slate-300 text-base leading-relaxed max-w-2xl mx-auto">
              Will the demon offer a bargain? Will reinforcements arrive from the wrong realm?
              You don&apos;t write the story—but you get to break it.
              Everyone remembers who bent the current.
            </p> */}
          </div>

          {/* Voting UI */}
          <div className="bg-slate-900 rounded-lg p-6 border border-amber-800/50 mb-12">
            <p className="font-sans text-xs text-amber-500 mb-3 uppercase tracking-wide">Fates Voting on Next Challenge:</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded hover:bg-slate-700 cursor-pointer">
                <span className="font-sans text-sm text-white">The demon general offers a dark bargain</span>
                <div className="flex items-center gap-2">
                  <div className="font-sans text-xs text-slate-400">42 votes</div>
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{width: '35%'}}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-900/20 rounded border border-amber-700/50">
                <span className="font-sans text-sm text-white">Reinforcements arrive... but from which realm?</span>
                <div className="flex items-center gap-2">
                  <div className="font-sans text-xs text-amber-400 font-semibold">67 votes</div>
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{width: '56%'}}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800 rounded hover:bg-slate-700 cursor-pointer">
                <span className="font-sans text-sm text-white">The portal begins to destabilize</span>
                <div className="flex items-center gap-2">
                  <div className="font-sans text-xs text-slate-400">11 votes</div>
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{width: '9%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            <p className="font-sans text-xs text-slate-500 mt-3">120 Ink contributed by 47 Fates</p>
          </div>

          {/* MVP Voting */}
          <div className="bg-slate-900 rounded-lg p-6 border border-amber-800/50">
            <p className="font-sans text-xs text-amber-500 mb-3 uppercase tracking-wide">Fates Voting on MVP of Chapter 12:</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded hover:bg-slate-700 cursor-pointer">
                <div className="flex items-center gap-3">
                  <CharacterPortrait
                    characterId="char-1"
                    name="Sir Aldric"
                    size={48}
                    className="rounded-full border-2 border-slate-600"
                  />
                  <span className="font-sans text-sm text-white">Sir Aldric</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-sans text-xs text-slate-400">28 votes</div>
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{width: '31%'}}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-900/20 rounded border border-amber-700/50">
                <div className="flex items-center gap-3">
                  <CharacterPortrait
                    characterId="char-3"
                    name="Whisper"
                    size={48}
                    className="rounded-full border-2 border-amber-600"
                  />
                  <span className="font-sans text-sm text-white">Whisper</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-sans text-xs text-amber-400 font-semibold">51 votes</div>
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{width: '57%'}}></div>
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
                  <span className="font-sans text-sm text-white">Zephyra</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-sans text-xs text-slate-400">11 votes</div>
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{width: '12%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            <p className="font-sans text-xs text-slate-500 mt-3">90 Ink contributed by 35 Fates</p>
          </div>
        </div>
      </section>

      {/* CREATE Section */}
      <section
        ref={createRef}
        id="create"
        className="min-h-screen pt-48 pb-32"
        style={{
          background: `linear-gradient(to bottom, ${sections.create.gradientFrom}, ${sections.create.gradientTo})`
        }}
      >
        <div className="max-w-4xl mx-auto px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="font-serif font-semibold text-5xl text-slate-200 uppercase tracking-wide mb-6">
              {sections.create.title}
            </h2>
            <p className="font-serif italic text-2xl mb-8 text-slate-200">
              {sections.create.quote}
            </p>
            <p className="font-sans text-slate-200 text-lg leading-relaxed max-w-2xl mx-auto mb-6">
              Ready to risk it? Build a roster of AI-generated characters—each one broken, brilliant, and yours.
              Enter the River with other players&apos; creations. The story won&apos;t wait.
            </p>
            {/* <p className="font-sans text-slate-300 text-base leading-relaxed max-w-2xl mx-auto">
              This isn&apos;t a game you <em className="not-italic text-white font-semibold">win</em>. It&apos;s a game you <em className="not-italic text-white font-semibold">survive</em>,
              or go down swinging. Either way, you were here.
            </p> */}
          </div>

          {/* Chat Log Example */}
          <PlayExample />
        </div>
      </section>

      {/* Footer tagline */}
      <div className="pb-32 text-center" style={{ background: sections.create.gradientTo }}>
        <p className="font-serif italic text-slate-500 text-lg">
          Worn hands. Old myths. New code.
        </p>
        <p className="font-serif italic text-slate-600 text-base mt-2">
          We&apos;re all just trying to make sense of the chaos.
        </p>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0f12]/95 backdrop-blur-md border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-8 py-5">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="text-center"
          >
            <a
              href={active.cta.href}
              className="inline-block bg-gradient-to-r from-amber-800/90 to-amber-700/90 hover:from-amber-700/90 hover:to-amber-600/90 text-white font-serif font-bold py-4 px-10 rounded-lg transition-all duration-300 text-lg uppercase tracking-wider"
            >
              {active.cta.text} →
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
