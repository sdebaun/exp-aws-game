'use client';

import { FeaturedCarousel } from '../../_components/FeaturedCarousel';
import { LiveCard, LiveThumbnails } from './LiveCard';

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
  stories: FeaturedLiveStory[];
  autoPlayInterval?: number;
};

/**
 * Guide carousel with live card rendering wired up.
 *
 * Why this exists:
 * - Server components can't pass functions across the client boundary
 * - This client component wires up the generic carousel with Live cards
 * - Server pages just pass data (stories array), which serializes fine
 */
export function GuideFeaturedCarousel({ stories, autoPlayInterval }: Props) {
  return (
    <FeaturedCarousel
      items={stories}
      getItemId={(story) => story.id}
      renderCard={(story) => <LiveCard story={story} />}
      renderThumbnails={(story) => <LiveThumbnails story={story} />}
      autoPlayInterval={autoPlayInterval}
    />
  );
}