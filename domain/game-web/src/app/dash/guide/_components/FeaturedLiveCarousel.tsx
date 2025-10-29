'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type FeaturedLiveStory = {
  id: string;
  title: string;
  tagline: string;
  excerpt: string; // Actual prose from the live story (1-3 sentences)
  attribution: string; // Character or narrator attribution
  scene: number;
  totalScenes: number;
  playerCount: number;
  spectatorCount: number;
  activeVotes: number; // Current votes on challenges
  votePrice: number;
  images: {
    hero: string;
    thumbnails: string[];
  };
};

type Props = {
  stories: FeaturedLiveStory[];
  autoPlayInterval?: number;
};

export function FeaturedLiveCarousel({ stories, autoPlayInterval = 14000 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle
  useEffect(() => {
    if (isPaused || stories.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPaused, stories.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), autoPlayInterval);
  };

  const current = stories[currentIndex];

  if (!current) return null;

  return (
    <div
      className="relative rounded-xl overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="relative flex gap-2 h-[500px]"
        >
          {/* Main hero image - takes up most space, slightly muted for focus on text */}
          <div className="flex-1 relative overflow-hidden">
            <img
              src={current.images.hero}
              alt={current.title}
              className="w-full h-full object-cover opacity-60"
            />
            {/* Stronger gradient overlay to emphasize the quote */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-12">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {/* Live badge with pulse */}
                <div className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-wide text-amber-400 mb-3">
                  <motion.span
                    className="text-red-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ●
                  </motion.span>
                  <span>Live Now • Scene {current.scene} of {current.totalScenes}</span>
                </div>

                {/* Title - fixed height with line clamp */}
                <h2 className="font-serif text-5xl font-bold text-white mb-6 line-clamp-2">
                  {current.title}
                </h2>

                {/* Story excerpt - styled as quotation */}
                <blockquote className="mb-4 max-w-3xl">
                  <p className="font-serif text-2xl leading-relaxed text-slate-100 line-clamp-3">
                    &ldquo;{current.excerpt}&rdquo;
                  </p>
                  <footer className="mt-3 font-sans text-sm text-amber-400 tracking-wide">
                    — {current.attribution}
                  </footer>
                </blockquote>

                {/* Meta info + CTA on same line */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 font-sans text-sm">
                    <span className="text-slate-500">{current.playerCount} players</span>
                    <span className="text-slate-700">•</span>
                    <span className="text-slate-400">{current.spectatorCount} watching</span>
                    <span className="text-slate-700">•</span>
                    <span className="text-amber-400 font-semibold">{current.activeVotes} votes</span>
                  </div>

                  <Link
                    href={`/dash/guide/${current.id}`}
                    className="inline-flex items-center gap-2 bg-amber-700/90 hover:bg-amber-600/90 text-white font-sans font-semibold px-8 py-3 rounded-lg transition-all"
                  >
                    Watch Now
                    <span className="text-slate-300">→</span>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Thumbnail grid on the right - Steam style */}
          <div className="flex flex-col gap-2 w-64">
            {current.images.thumbnails.map((thumb, idx) => (
              <div key={idx} className="flex-1 relative overflow-hidden rounded-lg">
                <img
                  src={thumb}
                  alt={`${current.title} scene ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots - with dark backdrop for contrast */}
      <div className="absolute bottom-6 right-6 flex gap-2 bg-slate-950/80 backdrop-blur-sm px-3 py-2 rounded-full">
        {stories.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-amber-400 w-8'
                : 'bg-slate-600 hover:bg-slate-500'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}