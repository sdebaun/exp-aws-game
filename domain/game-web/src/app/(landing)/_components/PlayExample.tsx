import { CharacterPortrait } from "./CharacterPortrait";
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
    color: "text-slate-300"
  },
  {
    playerId: "p2",
    playerName: "MageSupreme",
    characterId: "char-2",
    characterName: "Zephyra",
    message: "I'm almost out of mana. Maybe 2 spells left",
    color: "text-slate-300"
  },
  {
    playerId: "p3",
    playerName: "SneakyBoi",
    characterId: "char-3",
    characterName: "Whisper",
    message: "I'm behind him. poison daggers ready",
    color: "text-slate-300"
  },
  {
    playerId: "p1",
    playerName: "KnightErrant",
    characterId: "char-1",
    characterName: "Sir Aldric",
    message: "should I try to rally everyone or just yolo the portal?",
    color: "text-slate-300"
  }
];

export function PlayExample() {
  return (
    <div className="mb-16">
      <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 text-sm">
        <div className="space-y-3">
          {mockMessages.map((msg, i) => (
            <div key={i} className="flex gap-3 items-start">
              <CharacterPortrait
                characterId={msg.characterId}
                name={msg.characterName}
                size={40}
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
            <CharacterPortrait
              characterId="char-3"
              name="Whisper"
              size={40}
              className="rounded-full border-2 border-slate-700"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-slate-300 font-bold">Whisper</span>
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
            color="text-slate-300"
          />

          <div className="flex gap-3 items-start">
            <CharacterPortrait
              characterId="char-1"
              name="Sir Aldric"
              size={40}
              className="rounded-full border-2 border-slate-700"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-slate-300 font-bold">Sir Aldric</span>
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
            color="text-slate-300"
          />

          <div className="bg-slate-800/50 p-2 rounded border-l-4 border-blue-700">
            <span className="text-blue-300 font-bold">FATE:</span>
            <span className="text-slate-300 ml-2">The demon general offers a dark bargain</span>
          </div>

          <div className="flex gap-3 items-start">
            <CharacterPortrait
              characterId="char-2"
              name="Zephyra"
              size={40}
              className="rounded-full border-2 border-slate-700"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-slate-300 font-bold">Zephyra</span>
                <span className="text-slate-500 text-xs">played by MageSupreme</span>
              </div>
              <p className="text-slate-300">wait what</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <CharacterPortrait
              characterId="char-2"
              name="Zephyra"
              size={40}
              className="rounded-full border-2 border-slate-700"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-slate-300 font-bold">Zephyra</span>
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
            color="text-slate-300"
          />

          <div className="bg-slate-800/50 p-2 rounded border-l-4 border-amber-700">
            <span className="text-amber-300 font-bold">RESOLUTION:</span>
            <span className="text-slate-300 ml-2">VICTORY! The demon general is repelled. Sir Aldric gains title: Demon Slayer</span>
          </div>

          <div className="flex gap-3 items-start">
            <CharacterPortrait
              characterId="char-1"
              name="Sir Aldric"
              size={40}
              className="rounded-full border-2 border-slate-700"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-slate-300 font-bold">Sir Aldric</span>
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
            color="text-slate-300"
          />

          <div className="flex gap-3 items-start">
            <CharacterPortrait
              characterId="char-1"
              name="Sir Aldric"
              size={40}
              className="rounded-full border-2 border-slate-700"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-slate-300 font-bold">Sir Aldric</span>
                <span className="text-slate-500 text-xs">played by KnightErrant</span>
              </div>
              <p className="text-slate-300">OH SHIT THAT WAS THE WRONG BUTTON</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <CharacterPortrait
              characterId="char-3"
              name="Whisper"
              size={40}
              className="rounded-full border-2 border-slate-700"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-slate-300 font-bold">Whisper</span>
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
