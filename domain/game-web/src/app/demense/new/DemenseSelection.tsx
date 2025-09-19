'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { selectDemense } from './actions';

type Demense = {
  name: string;
  description: string;
  defensePower: number;
  productionRate: number;
  specialBonus: string;
  imageUrl?: string | null;
}

function DemenseCard({ demense, onSelect }: { demense: Demense, onSelect: () => void }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-600 transition-all duration-200 cursor-pointer group"
         onClick={onSelect}>
      <div className="aspect-video w-full bg-slate-900 rounded-lg mb-4 overflow-hidden">
        {demense.imageUrl ? (
          <img src={demense.imageUrl} alt={demense.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-6xl">
            🏰
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
        {demense.name}
      </h3>
      
      <p className="text-slate-300 text-sm mb-4">
        {demense.description}
      </p>
      
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="bg-slate-900 rounded px-3 py-2">
          <p className="text-slate-500 text-xs">Defense</p>
          <p className="text-white font-bold">{demense.defensePower}</p>
        </div>
        <div className="bg-slate-900 rounded px-3 py-2">
          <p className="text-slate-500 text-xs">Production</p>
          <p className="text-white font-bold">{demense.productionRate}</p>
        </div>
        <div className="bg-slate-900 rounded px-3 py-2">
          <p className="text-slate-500 text-xs">Bonus</p>
          <p className="text-cyan-400 font-semibold text-xs">{demense.specialBonus}</p>
        </div>
      </div>
    </div>
  );
}

export function DemenseSelection({ demenses }: { demenses: Demense[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const handleSelect = async (demense: Demense) => {
    setIsLoading(true);
    setError(null);
    try {
      await selectDemense(demense);
      router.push('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to select demense');
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {demenses.map((demense, index) => (
          <DemenseCard 
            key={index} 
            demense={demense} 
            onSelect={() => handleSelect(demense)}
          />
        ))}
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
          {error}
        </div>
      )}
      
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-lg">
            <p className="text-white text-lg">⏳ Establishing your demense...</p>
          </div>
        </div>
      )}
    </>
  );
}