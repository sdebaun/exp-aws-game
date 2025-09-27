import { getAuth0Client } from "../../../../../../integrations/auth0";
import { redirect } from "next/navigation";
import { CharacterSelection } from './CharacterSelection';
import { generateCharacters } from './actions';

export default async function NewCharacterPage() {
  const auth0 = await getAuth0Client();
  const session = await auth0.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  try {
    // Generate initial characters (free - no Ink cost)
    const characters = await generateCharacters(true);
    
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto p-8">
          <h1 className="text-4xl font-bold mb-2">Create Your Character</h1>
          <p className="text-slate-400 mb-8">Select one of these generated characters, or roll for new options.</p>
          
          <CharacterSelection characters={characters} />
        </div>
      </div>
    );
  } catch (error) {
    // Fallback to mock characters if generation fails
    const mockCharacters = [
      {
        name: "Kaelen Shadowstep",
        class: "Rogue",
        background: "Former circus acrobat turned master thief",
        trait: "Never backs down from a dare, no matter how foolish",
        imageUrl: null,
      },
      {
        name: "Mira the Untamed", 
        class: "Ranger",
        background: "Raised by wolves in the northern wastes",
        trait: "Speaks more honestly with animals than people",
        imageUrl: null,
      },
      {
        name: "Brother Aldric",
        class: "Cleric", 
        background: "Disgraced noble seeking redemption",
        trait: "Believes every problem can be solved with enough wine and prayer",
        imageUrl: null,
      }
    ];
    
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto p-8">
          <h1 className="text-4xl font-bold mb-2">Create Your Character</h1>
          <p className="text-slate-400 mb-4">Select one of these generated characters, or roll for new options.</p>
          <p className="text-red-400 text-sm mb-8">⚠️ Character generation unavailable - showing demo characters</p>
          
          <CharacterSelection characters={mockCharacters} />
        </div>
      </div>
    );
  }
}