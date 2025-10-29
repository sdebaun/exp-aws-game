'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, ReactNode } from 'react';

type Props<T> = {
  items: T[];
  autoPlayInterval?: number;
  renderCard: (item: T) => ReactNode;
  renderThumbnails: (item: T) => ReactNode;
  getItemId: (item: T) => string;
};

/**
 * Generic carousel shell for featured content.
 *
 * Why this exists:
 * - Discover and Guide pages had near-identical carousel implementations
 * - Only the card content differs (completed vs live stories)
 * - This extracts the carousel mechanics (auto-play, navigation, animation)
 * - Pages provide render functions to inject their specific card content
 *
 * Usage:
 * <FeaturedCarousel
 *   items={stories}
 *   getItemId={s => s.id}
 *   renderCard={story => <YourCardContent story={story} />}
 *   renderThumbnails={story => <YourThumbnails story={story} />}
 * />
 */
export function FeaturedCarousel<T>({
  items,
  autoPlayInterval = 12000,
  renderCard,
  renderThumbnails,
  getItemId,
}: Props<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle through items
  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPaused, items.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    // Resume auto-play after manual navigation
    setTimeout(() => setIsPaused(false), autoPlayInterval);
  };

  const current = items[currentIndex];

  if (!current) return null;

  return (
    <div
      className="relative rounded-xl overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={getItemId(current)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="relative flex gap-2 h-[500px]"
        >
          {/* Main hero area - card content injected here */}
          <div className="flex-1 relative overflow-hidden">
            {renderCard(current)}
          </div>

          {/* Thumbnail grid on the right */}
          <div className="flex flex-col gap-2 w-64">
            {renderThumbnails(current)}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="absolute bottom-6 right-6 flex gap-2 bg-slate-950/80 backdrop-blur-sm px-3 py-2 rounded-full">
        {items.map((item, index) => (
          <button
            key={getItemId(item)}
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