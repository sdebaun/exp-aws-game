'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

type FeaturedStory = {
  id: string;
  title: string;
  tagline: string;
  excerpt: string;
  attribution: string;
  totalScenes: number;
  playerCount: number;
  readerCount: number;
  unlockPrice: number;
  images: {
    hero: string;
    thumbnails: string[];
  };
};

type Props = {
  story: FeaturedStory;
};

/**
 * Card content for completed stories in the Discover carousel.
 * Shows: excerpt quote, unlock price, reader count, "View Story" CTA.
 */
export function DiscoverCard({ story }: Props) {
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
          {/* Featured badge */}
          <div className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-wide text-amber-400 mb-3">
            <span className="text-amber-500">★</span>
            <span>Featured Story</span>
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
            <div className="flex items-center gap-6 font-sans text-sm text-slate-500">
              <span>{story.totalScenes} scenes</span>
              <span>•</span>
              <span>{story.playerCount} players</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">{story.unlockPrice} Ink</span>
            </div>

            <Link
              href={`/dash/discover/${story.id}`}
              className="inline-flex items-center gap-2 border-2 border-slate-600 hover:border-amber-500 hover:bg-slate-800/50 text-white font-sans font-semibold px-8 py-3 rounded-lg transition-all"
            >
              View Story
              <span className="text-slate-400">→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}

/**
 * Thumbnail grid for completed stories.
 * Simple hover scale effect on each thumbnail.
 */
export function DiscoverThumbnails({ story }: Props) {
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