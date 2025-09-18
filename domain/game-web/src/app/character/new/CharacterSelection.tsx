'use client';

import { useState } from 'react';
import Link from 'next/link';

type Character = {
  name: string;
  class: string;
  background: string;
  trait: string;
  imageUrl?: string;
}

function CharacterCard({ character, onSelect }: { character: Character, onSelect: () => void }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-600 transition-all duration-200 cursor-pointer group"
         onClick={onSelect}>
      <div className="aspect-square w-full bg-slate-900 rounded-lg mb-4 overflow-hidden">
        {character.imageUrl ? (
          <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-6xl">
            ⚔️
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
        {character.name}
      </h3>
      
      <p className="text-cyan-400 font-semibold mb-2">{character.class}</p>
      
      <p className="text-slate-300 text-sm mb-2">
        <span className="text-slate-500">Background:</span> {character.background}
      </p>
      
      <p className="text-slate-300 text-sm italic">
        &ldquo;{character.trait}&rdquo;
      </p>
    </div>
  );
}

export function CharacterSelection({ characters }: { characters: Character[] }) {
  const [currentCharacters, setCurrentCharacters] = useState(characters);
  
  const handleReroll = () => {
    // TODO: Fetch new characters from API
    console.log('Rerolling characters...');
  };
  
  const handleSelect = (character: Character) => {
    // TODO: Handle character selection
    console.log('Selected:', character.name);
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {currentCharacters.map((character, index) => (
          <CharacterCard 
            key={index} 
            character={character} 
            onSelect={() => handleSelect(character)}
          />
        ))}
      </div>
      
      <div className="flex gap-4 justify-center">
        <button 
          onClick={handleReroll}
          className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg">
          🎲 Roll New Characters
        </button>
        
        <Link href="/" className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200">
          Cancel
        </Link>
      </div>
    </>
  );
}