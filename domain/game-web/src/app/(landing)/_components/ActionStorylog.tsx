import Image from "next/image";
import { getCharacterPortraitUrl, CharacterPortrait } from "./CharacterPortrait";

interface ActionStorylogProps {
  playerId: string;
  playerName: string;
  characterId: string;
  characterName: string;
  aspectName: string;
  aspectId?: string;
  advantage: number;
  complication: number;
  color: string;
}

export function ActionStorylog({
  playerName,
  characterId,
  characterName,
  aspectName,
  aspectId,
  advantage,
  complication,
  color
}: ActionStorylogProps) {
  return (
    <div className="flex gap-3 items-start bg-purple-900/20 p-3 rounded-lg border-l-4 border-purple-600">
      <CharacterPortrait
        characterId={characterId}
        name={characterName}
        size={40}
        className="rounded-full border-2 border-purple-700"
      />
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className={`${color} font-bold`}>{characterName}</span>
          <span className="text-slate-500 text-xs">played by {playerName}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Image
            src={getCharacterPortraitUrl(aspectId || `${characterId}-${aspectName}`, 20)}
            alt={aspectName}
            width={20}
            height={20}
            className="rounded-full border border-purple-700"
            unoptimized
          />
          <p className="text-purple-300">[{aspectName}]</p>
        </div>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-1">
            <span className="text-green-400 text-lg">✊</span>
            <span className="text-green-400 font-bold text-lg">{advantage}</span>
          </div>
          {complication > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-orange-400 text-lg">⚠️</span>
              <span className="text-orange-400 font-bold text-lg">{complication}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
