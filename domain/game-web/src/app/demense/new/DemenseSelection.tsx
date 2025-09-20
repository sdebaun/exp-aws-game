'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { selectDemense, exploreDemenses } from './actions';

type Demense = {
  name: string;
  description: string;
  aspects: string[];
  imageUrl?: string | null;
}

function DemenseCard({ demense, onSelect, isPlaceholder, isSelected }: { 
  demense: Demense, 
  onSelect: () => void, 
  isPlaceholder: boolean,
  isSelected: boolean 
}) {
  return (
    <div className={`border rounded-xl p-6 transition-all duration-200 ${
      isPlaceholder 
        ? 'bg-slate-900 border-slate-800' 
        : isSelected
        ? 'bg-slate-800 border-cyan-600 ring-2 ring-cyan-600 cursor-pointer'
        : 'bg-slate-800 border-slate-700 hover:border-cyan-600 cursor-pointer group'
    }`}
         onClick={!isPlaceholder ? onSelect : undefined}>
      <div className="aspect-video w-full bg-slate-950 rounded-lg mb-4 overflow-hidden">
        {isPlaceholder ? (
          <div className="w-full h-full flex items-center justify-center text-slate-700 text-6xl">
            ❓
          </div>
        ) : demense.imageUrl ? (
          <img src={demense.imageUrl} alt={demense.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-6xl">
            🏰
          </div>
        )}
      </div>
      
      <h3 className={`text-xl font-bold mb-2 ${
        isPlaceholder ? 'text-slate-700' : 'text-white group-hover:text-cyan-400 transition-colors'
      }`}>
        {demense.name}
      </h3>
      
      <p className={`text-sm mb-4 ${
        isPlaceholder ? 'text-slate-700' : 'text-slate-300'
      }`}>
        {demense.description}
      </p>
      
      <div className="space-y-2">
        <p className={`text-xs font-semibold ${isPlaceholder ? 'text-slate-700' : 'text-slate-400'}`}>
          {isPlaceholder ? 'ASPECTS' : 'ASPECTS'}
        </p>
        <div className="flex flex-wrap gap-2">
          {isPlaceholder ? (
            <>  
              <span className="px-3 py-1 bg-slate-950 rounded-full text-xs text-slate-700">???</span>
              <span className="px-3 py-1 bg-slate-950 rounded-full text-xs text-slate-700">???</span>
              <span className="px-3 py-1 bg-slate-950 rounded-full text-xs text-slate-700">???</span>
            </>
          ) : (
            demense.aspects.map((aspect, idx) => (
              <span key={idx} className="px-3 py-1 bg-slate-900 rounded-full text-xs text-cyan-400 border border-slate-700">
                {aspect}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function DemenseSelection({ demenses, isPlaceholder }: { demenses: Demense[], isPlaceholder?: boolean }) {
  const [currentDemenses, setCurrentDemenses] = useState(demenses);
  const [hasExplored, setHasExplored] = useState(!isPlaceholder);
  const [selectedDemense, setSelectedDemense] = useState<Demense | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const handleCardClick = (demense: Demense) => {
    setSelectedDemense(demense);
  };
  
  const handleInhabit = async () => {
    if (!selectedDemense) return;
    
    setIsSelecting(true);
    setError(null);
    try {
      await selectDemense(selectedDemense);
      router.push('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to select demense');
      setIsSelecting(false);
    }
  };
  
  const handleExplore = async () => {
    setIsExploring(true);
    setError(null);
    try {
      const newDemenses = await exploreDemenses();
      setCurrentDemenses(newDemenses);
      setHasExplored(true);
      setSelectedDemense(null); // Clear selection when rerolling
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to explore demenses');
    } finally {
      setIsExploring(false);
    }
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {currentDemenses.map((demense, index) => (
          <DemenseCard 
            key={index} 
            demense={demense} 
            onSelect={() => handleCardClick(demense)}
            isPlaceholder={!hasExplored}
            isSelected={selectedDemense?.name === demense.name}
          />
        ))}
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
          {error}
        </div>
      )}
      
      {isSelecting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-lg">
            <p className="text-white text-lg">⏳ Establishing your demense...</p>
          </div>
        </div>
      )}
      
      {isExploring && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-lg">
            <p className="text-white text-lg">🔍 Exploring potential strongholds...</p>
          </div>
        </div>
      )}
      
      {!hasExplored ? (
        <div className="flex gap-4 justify-center">
          <button 
            onClick={handleExplore}
            disabled={isExploring || isSelecting}
            className={`font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${
              isExploring || isSelecting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-cyan-600 hover:bg-cyan-500 text-white hover:shadow-lg'
            }`}>
            {isExploring ? '🔍 Exploring...' : '🔍 Explore Three Opportunities (10 Ink)'}
          </button>
        </div>
      ) : (
        <div className="flex gap-4 justify-center">
          <button 
            onClick={handleExplore}
            disabled={isExploring || isSelecting}
            className={`font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${
              isExploring || isSelecting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-slate-700 hover:bg-slate-600 text-white hover:shadow-lg'
            }`}>
            {isExploring ? '🎲 Rerolling...' : '🎲 Reroll Options (10 Ink)'}
          </button>
          
          <button 
            onClick={handleInhabit}
            disabled={!selectedDemense || isExploring || isSelecting}
            className={`font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${
              !selectedDemense || isExploring || isSelecting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-cyan-600 hover:bg-cyan-500 text-white hover:shadow-lg'
            }`}>
            {isSelecting ? '⏳ Establishing...' : '🏰 Inhabit Demense'}
          </button>
        </div>
      )}
    </>
  );
}