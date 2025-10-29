'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

type FeaturedLiveStory = {
  id: string;
  title: string;
  tagline: string;
  excerpt: string;
  attribution: string;
  scene: number;
  totalScenes: number;
  playerCount: number;
  spectatorCount: number;
  activeVotes: number;
  votePrice: number;
  images: {
    hero: string;
    thumbnails: string[];
  };
};

type Props = {
  story: FeaturedLiveStory;
};

/**
 * Card content for live stories in the Guide carousel.
 * Shows: pulsing live badge, current scene, active votes, "Watch Now" CTA.
 */
export function LiveCard({ story }: Props) {
  return (
    <>
      {/* Hero image with gradient overlay */}
      <img
        src={story.images.hero}
        alt={story.title}
        className="w-full h-full object-cover opacity-60"
      />
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
            <span>Live Now • Scene {story.scene} of {story.totalScenes}</span>
          </div>

          {/* Title */}
          <h2 className="font-serif text-5xl font-bold text-white mb-6 line-clamp-2">
            {story.title}
          </h2>

          {/* Story excerpt - styled as quotation */}
          <blockquote className="mb-4 max-w-3xl">
            <p className="font-serif text-2xl leading-relaxed text-slate-100 line-clamp-3">
              &ldquo;{story.excerpt}&rdquo;
            </p>
            <footer className="mt-3 font-sans text-sm text-amber-400 tracking-wide">
              — {story.attribution}
            </footer>
          </blockquote>

          {/* Meta info + CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 font-sans text-sm">
              <span className="text-slate-500">{story.playerCount} players</span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-400">{story.spectatorCount} watching</span>
              <span className="text-slate-700">•</span>
              <span className="text-amber-400 font-semibold">{story.activeVotes} votes</span>
            </div>

            <Link
              href={`/dash/guide/${story.id}`}
              className="inline-flex items-center gap-2 bg-amber-700/90 hover:bg-amber-600/90 text-white font-sans font-semibold px-8 py-3 rounded-lg transition-all"
            >
              Watch Now
              <span className="text-slate-300">→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}

/**
 * Thumbnail grid for live stories.
 * Simple hover scale effect on each thumbnail.
 */
export function LiveThumbnails({ story }: Props) {
  return (
    <>
      {story.images.thumbnails.map((thumb, idx) => (
        <div key={idx} className="flex-1 relative overflow-hidden rounded-lg">
          <img
            src={thumb}
            alt={`${story.title} scene ${idx + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </>
  );
}