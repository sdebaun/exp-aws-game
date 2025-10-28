import Image from "next/image";

/**
 * Generates a consistent placeholder portrait URL for a character
 * Uses DiceBear API with "avataaars" style for character portraits
 * The seed ensures same character always gets same portrait
 */
export function getCharacterPortraitUrl(
  characterId: string,
  size: number = 400
): string {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${characterId}&size=${size}`;
}

interface CharacterPortraitProps {
  characterId: string;
  name: string;
  size?: number;
  className?: string;
}

/**
 * Character portrait component with DiceBear avatars
 * unoptimized=true because Next.js Image optimization doesn't handle external SVGs well
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
      unoptimized
    />
  );
}