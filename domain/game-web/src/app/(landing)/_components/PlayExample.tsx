import Image from "next/image";
import { getCharacterPortraitUrl } from "./CharacterPortrait";
import { ActionStorylog } from "./ActionStorylog";

interface ChatMessage {
  playerId: string;
  playerName: string;
  characterId: string;
  characterName: string;
  message: string;
  color: string;
}

const mockMessages: ChatMessage[] = [
  {
    playerId: "p1",
    playerName: "KnightErrant",
    characterId: "char-1",
    characterName: "Sir Aldric",
    message: "guys the demon general just showed up, we're fucked",
    color: "text-purple-400"
  },
  {
    playerId: "p2",
    playerName: "MageSupreme",
    characterId: "char-2",
    characterName: "Zephyra",
    message: "I'm almost out of mana. Maybe 2 spells left",
    color: "text-cyan-400"
  },
  {
    playerId: "p3",
    playerName: "SneakyBoi",
    characterId: "char-3",
    characterName: "Whisper",
    message: "I'm behind him. poison daggers ready",
    color: "text-green-400"
  },
  {
    playerId: "p1",
    playerName: "KnightErrant",
    characterId: "char-1",
    characterName: "Sir Aldric",
    message: "should I try to rally everyone or just yolo the portal?",
    color: "text-purple-400"
  }
];

export function PlayExample() {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
        <h3 className="text-xl font-bold text-purple-400">Players decide what to say and do</h3>
      </div>

      <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 text-sm">
        <div className="space-y-3">
          {mockMessages.map((msg, i) => (
            <div key={i} className="flex gap-3 items-start">
              <Image
                src={getCharacterPortraitUrl(msg.characterId, 40)}
                alt={msg.characterName}
                width={40}
                height={40}
                className="rounded-full border-2 border-slate-700"
              />
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className={`${msg.color} font-bold`}>{msg.characterName}</span>
                  <span className="text-slate-500 text-xs">played by {msg.playerName}</span>
                </div>
                <p className="text-slate-300">{msg.message}</p>
              </div>
            </div>
          ))}

          <div className="flex gap-3 items-start">
            <Image
              src={getCharacterPortraitUrl("char-3", 40)}
              alt="Whisper"
              width={40}
              height={40}
              className="rounded-full border-2 border-slate-700"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-green-400 font-bold">Whisper</span>
                <span className="text-slate-500 text-xs">played by SneakyBoi</span>
              </div>
              <p className="text-slate-300">time to put my assassin training to use</p>
            </div>
          </div>

          <ActionStorylog
            playerId="p3"
            playerName="SneakyBoi"
            characterId="char-3"
            characterName="Whisper"
            aspectName="Assassination"
            advantage={5}
            complication={1}
            color="text-green-400"
          />

          <div className="flex gap-3 items-start">
            <Image
              src={getCharacterPortraitUrl("char-1", 40)}
              alt="Sir Aldric"
              width={40}
              height={40}
              className="rounded-full border-2 border-slate-700"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-purple-400 font-bold">Sir Aldric</span>
                <span className="text-slate-500 text-xs">played by KnightErrant</span>
              </div>
              <p className="text-slate-300">FOR THE REALM! STAND WITH ME!</p>
            </div>
          </div>

          <ActionStorylog
            playerId="p1"
            playerName="KnightErrant"
            characterId="char-1"
            characterName="Sir Aldric"
            aspectName="Rally Cry"
            advantage={2}
            complication={0}
            color="text-purple-400"
          />

          <div className="bg-cyan-900/20 p-2 rounded border-l-4 border-cyan-600">
            <span className="text-cyan-300 font-bold">FATE:</span>
            <span className="text-cyan-300 ml-2">The demon general offers a dark bargain</span>
          </div>

          <div className="flex gap-3 items-start">
            <Image
              src={getCharacterPortraitUrl("char-2", 40)}
              alt="Zephyra"
              width={40}
              height={40}
              className="rounded-full border-2 border-slate-700"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-cyan-400 font-bold">Zephyra</span>
                <span className="text-slate-500 text-xs">played by MageSupreme</span>
              </div>
              <p className="text-slate-300">wait what</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <Image
              src={getCharacterPortraitUrl("char-2", 40)}
              alt="Zephyra"
              width={40}
              height={40}
              className="rounded-full border-2 border-slate-700"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-cyan-400 font-bold">Zephyra</span>
                <span className="text-slate-500 text-xs">played by MageSupreme</span>
              </div>
              <p className="text-slate-300">channeling everything into a barrier!</p>
            </div>
          </div>

          <ActionStorylog
            playerId="p2"
            playerName="MageSupreme"
            characterId="char-2"
            characterName="Zephyra"
            aspectName="Shield Wall"
            advantage={3}
            complication={2}
            color="text-cyan-400"
          />

          <div className="bg-green-900/20 p-2 rounded border-l-4 border-green-600">
            <span className="text-green-300 font-bold">RESOLUTION:</span>
            <span className="text-green-300 ml-2">VICTORY! The demon general is repelled. Sir Aldric gains title: Demon Slayer</span>
          </div>

          <div className="flex gap-3 items-start">
            <Image
              src={getCharacterPortraitUrl("char-1", 40)}
              alt="Sir Aldric"
              width={40}
              height={40}
              className="rounded-full border-2 border-slate-700"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-purple-400 font-bold">Sir Aldric</span>
                <span className="text-slate-500 text-xs">played by KnightErrant</span>
              </div>
              <p className="text-slate-300">my honor is NOT for sale, demon!</p>
            </div>
          </div>

          <ActionStorylog
            playerId="p1"
            playerName="KnightErrant"
            characterId="char-1"
            characterName="Sir Aldric"
            aspectName="I Shall Never Bargain"
            advantage={6}
            complication={3}
            color="text-purple-400"
          />

          <div className="flex gap-3 items-start">
            <Image
              src={getCharacterPortraitUrl("char-1", 40)}
              alt="Sir Aldric"
              width={40}
              height={40}
              className="rounded-full border-2 border-slate-700"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-purple-400 font-bold">Sir Aldric</span>
                <span className="text-slate-500 text-xs">played by KnightErrant</span>
              </div>
              <p className="text-slate-300">OH SHIT THAT WAS THE WRONG BUTTON</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <Image
              src={getCharacterPortraitUrl("char-3", 40)}
              alt="Whisper"
              width={40}
              height={40}
              className="rounded-full border-2 border-slate-700"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-green-400 font-bold">Whisper</span>
                <span className="text-slate-500 text-xs">played by SneakyBoi</span>
              </div>
              <p className="text-slate-300">lmao classic knight move</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
