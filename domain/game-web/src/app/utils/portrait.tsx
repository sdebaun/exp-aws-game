import Image from "next/image";

/**
 * Generates a consistent placeholder portrait URL for a character
 * Uses Lorem Picsum with seed to ensure same image for same character
 */
export function getCharacterPortraitUrl(
  characterId: string, 
  size: number = 400
): string {
  return `https://picsum.photos/seed/${characterId}/${size}/${size}`;
}

interface CharacterPortraitProps {
  characterId: string;
  name: string;
  size?: number;
  className?: string;
}

/**
 * Character portrait component with Lorem Picsum placeholder
 */
export function CharacterPortrait({ 
  characterId, 
  name, 
  size = 400, 
  className 
}: CharacterPortraitProps) {
  return (
    <Image
      src={getCharacterPortraitUrl(characterId, size)}
      alt={`Portrait of ${name}`}
      width={size}
      height={size}
      className={className}
    />
  );
}