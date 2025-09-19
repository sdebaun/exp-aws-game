import { auth0 } from "../../../../../../integrations/auth0";
import { redirect } from "next/navigation";
import { DemenseSelection } from './DemenseSelection';
import { generateDemenses } from './actions';

export default async function NewDemensePage() {
  const session = await auth0.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  try {
    // Generate initial demenses (free - no Ink cost)
    const demenses = await generateDemenses();
    
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto p-8">
          <h1 className="text-4xl font-bold mb-2">Choose Your Demense</h1>
          <p className="text-slate-400 mb-8">Your demense is your stronghold - a base of operations in the game world. Choose wisely!</p>
          
          <DemenseSelection demenses={demenses} />
        </div>
      </div>
    );
  } catch (error) {
    // Fallback to mock demenses if generation fails
    const mockDemenses = [
      {
        name: "Shadowfell Keep",
        description: "An ancient fortress carved from obsidian, perpetually shrouded in mist",
        defensePower: 8,
        productionRate: 3,
        specialBonus: "Shadow resistance",
        imageUrl: null,
      },
      {
        name: "Crystalhaven Spire", 
        description: "A towering crystalline citadel that channels raw magical energy",
        defensePower: 5,
        productionRate: 7,
        specialBonus: "Mana generation",
        imageUrl: null,
      },
      {
        name: "Ironforge Bastion",
        description: "A mighty dwarven stronghold built into the heart of a mountain",
        defensePower: 10,
        productionRate: 5,
        specialBonus: "Siege weaponry",
        imageUrl: null,
      }
    ];
    
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto p-8">
          <h1 className="text-4xl font-bold mb-2">Choose Your Demense</h1>
          <p className="text-slate-400 mb-4">Your demense is your stronghold - a base of operations in the game world. Choose wisely!</p>
          <p className="text-red-400 text-sm mb-8">⚠️ Demense generation unavailable - showing demo options</p>
          
          <DemenseSelection demenses={mockDemenses} />
        </div>
      </div>
    );
  }
}