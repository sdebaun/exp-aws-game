import { auth0 } from "../../../../../../integrations/auth0";
import { redirect } from "next/navigation";
import { CharacterSelection } from './CharacterSelection';

export default async function NewCharacterPage() {
  const session = await auth0.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  // TODO: Generate characters with ChatGPT
  const mockCharacters = [
    {
      name: "Kaelen Shadowstep",
      class: "Rogue",
      background: "Former circus acrobat turned master thief",
      trait: "Never backs down from a dare, no matter how foolish",
    },
    {
      name: "Mira the Untamed", 
      class: "Ranger",
      background: "Raised by wolves in the northern wastes",
      trait: "Speaks more honestly with animals than people",
    },
    {
      name: "Brother Aldric",
      class: "Cleric", 
      background: "Disgraced noble seeking redemption",
      trait: "Believes every problem can be solved with enough wine and prayer",
    }
  ];
  
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">Create Your Character</h1>
        <p className="text-slate-400 mb-8">Select one of these generated characters, or roll for new options.</p>
        
        <CharacterSelection characters={mockCharacters} />
      </div>
    </div>
  );
}