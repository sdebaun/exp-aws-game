'use client';

import { FeaturedCarousel } from '../../_components/FeaturedCarousel';
import { DiscoverCard, DiscoverThumbnails } from './DiscoverCard';

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
  stories: FeaturedStory[];
  autoPlayInterval?: number;
};

/**
 * Discover carousel with card rendering wired up.
 *
 * Why this exists:
 * - Server components can't pass functions across the client boundary
 * - This client component wires up the generic carousel with Discover cards
 * - Server pages just pass data (stories array), which serializes fine
 */
export function DiscoverFeaturedCarousel({ stories, autoPlayInterval }: Props) {
  return (
    <FeaturedCarousel
      items={stories}
      getItemId={(story) => story.id}
      renderCard={(story) => <DiscoverCard story={story} />}
      renderThumbnails={(story) => <DiscoverThumbnails story={story} />}
      autoPlayInterval={autoPlayInterval}
    />
  );
}