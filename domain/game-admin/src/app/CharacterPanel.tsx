"use client";

import { useState } from "react";
import type { EntityItem } from "electrodb";
import { CharacterEntity } from "../../../content/character/entity";
import { AsyncButton } from "../components/AsyncButton";
import ReactMarkdown from "react-markdown";

type Character = EntityItem<typeof CharacterEntity>;

interface CharacterPanelProps {
  characters: Character[];
  deleteCharacterAction: (characterId: string) => Promise<void>;
}

export function CharacterPanel({ characters, deleteCharacterAction }: CharacterPanelProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  return (
    <div className="flex h-[calc(100vh-12rem)]">
      {/* Left Panel - Character List */}
      <div className="w-96 border-r border-slate-700 overflow-y-auto">
        <div className="p-4 space-y-3">
          {characters.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              No characters in the pool. Click &quot;Generate Batch&quot; to create some!
            </div>
          ) : (
            characters.map((char) => (
              <div
                key={char.characterId}
                onClick={() => setSelectedCharacter(char)}
                className={`p-4 rounded-lg cursor-pointer transition-all hover:bg-slate-700/50 ${
                  selectedCharacter?.characterId === char.characterId 
                    ? 'bg-slate-700 border border-slate-600' 
                    : 'bg-slate-800 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  {char.portraitUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={char.portraitUrl} 
                      alt={`${char.name} portrait`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-gray-500 text-xs">
                      No Img
                    </div>
                  )}
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{char.name}</h3>
                    <p className="text-xs text-gray-400 truncate">
                      {char.origin.type === "historical" ? "📜" : "📚"} {char.origin.place}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{char.origin.era}</p>
                    <span className={`text-xs px-2 py-1 rounded inline-block mt-1 ${
                      char.recruitmentState === 'available' ? 'bg-green-900 text-green-200' :
                      char.recruitmentState === 'recruitable' ? 'bg-yellow-900 text-yellow-200' :
                      'bg-blue-900 text-blue-200'
                    }`}>
                      {char.recruitmentState}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Character Details */}
      <div className="flex-1 overflow-y-auto">
        {selectedCharacter ? (
          <div className="p-8">
            <div className="max-w-3xl">
              {/* Header with portrait and name */}
              <div className="flex items-start gap-6 mb-8">
                {selectedCharacter.portraitUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={selectedCharacter.portraitUrl} 
                    alt={`${selectedCharacter.name} portrait`}
                    className="w-32 h-32 rounded-lg object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-slate-700 rounded-lg flex items-center justify-center text-gray-500">
                    No Portrait
                  </div>
                )}
                
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{selectedCharacter.name}</h2>
                  <p className="text-lg text-gray-300 mb-1">
                    {selectedCharacter.origin.type === "historical" ? "Historical" : "Fictional"} • {selectedCharacter.origin.place}
                  </p>
                  <p className="text-sm text-gray-400 mb-3">
                    {selectedCharacter.origin.era} • {selectedCharacter.origin.culture}
                    {selectedCharacter.origin.canon && ` • ${selectedCharacter.origin.canon}`}
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded ${
                      selectedCharacter.recruitmentState === 'available' ? 'bg-green-900 text-green-200' :
                      selectedCharacter.recruitmentState === 'recruitable' ? 'bg-yellow-900 text-yellow-200' :
                      'bg-blue-900 text-blue-200'
                    }`}>
                      {selectedCharacter.recruitmentState}
                    </span>
                    <AsyncButton
                      action={() => deleteCharacterAction(selectedCharacter.characterId)}
                      variant="danger"
                      confirm={{
                        type: "single",
                        message: `Are you sure you want to delete ${selectedCharacter.name}?`,
                      }}
                      className="px-3 py-1 text-xs"
                      loadingContent="Deleting..."
                    >
                      Delete
                    </AsyncButton>
                  </div>
                  <p className="text-xs text-gray-500">ID: {selectedCharacter.characterId}</p>
                </div>
              </div>

              {/* Primary Aspect */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-gray-300">Primary Aspect</h3>
                <p className="text-xl text-cyan-400 font-semibold italic">&ldquo;{selectedCharacter.primary_aspect}&rdquo;</p>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-gray-300">Description</h3>
                <div className="text-gray-400 leading-relaxed prose prose-invert max-w-none">
                  <ReactMarkdown>{selectedCharacter.background}</ReactMarkdown>
                </div>
              </div>

              {/* Appearance and Manner */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-gray-300">Appearance & Manner</h3>
                <p className="text-gray-400 leading-relaxed">{selectedCharacter.appearance_and_manner}</p>
              </div>

              {/* Aspects */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-gray-300">Aspects</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCharacter.aspects?.map((aspect, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-700 rounded-full text-sm"
                    >
                      {aspect}
                    </span>
                  ))}
                </div>
              </div>

              {/* Motivations */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-gray-300">Motivations</h3>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  {selectedCharacter.motivations?.map((motivation, index) => (
                    <li key={index}>{motivation}</li>
                  ))}
                </ul>
              </div>

              {/* Fears */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-gray-300">Fears</h3>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  {selectedCharacter.fears?.map((fear, index) => (
                    <li key={index}>{fear}</li>
                  ))}
                </ul>
              </div>

              {/* Metadata */}
              <div className="text-sm text-gray-500 space-y-1">
                {selectedCharacter.playerId && (
                  <p>Player: {selectedCharacter.playerId}</p>
                )}
                {selectedCharacter.createdAt && (
                  <p>Created: {new Date(selectedCharacter.createdAt).toLocaleString()}</p>
                )}
                {selectedCharacter.reservedAt && (
                  <p>Reserved: {new Date(selectedCharacter.reservedAt).toLocaleString()}</p>
                )}
                {selectedCharacter.rosteredAt && (
                  <p>Rostered: {new Date(selectedCharacter.rosteredAt).toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a character to view details
          </div>
        )}
      </div>
    </div>
  );
}