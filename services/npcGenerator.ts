
import { NPC, PortraitConfig } from '../types';
import { NPC_NAMES_MALE, NPC_NAMES_FEMALE, NPC_SURNAMES, NPC_PROFESSIONS, NPC_GOALS } from '../constants';

// Helper: Random Item from Array
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper: Random Color
const randomColor = (palette: string[]) => pick(palette);

const SKIN_TONES = ['#fce3c2', '#f5d0a9', '#e0ac69', '#8d5524', '#c68642'];
const HAIR_COLORS = ['#2c1a0b', '#4e342e', '#a1887f', '#e8a87c', '#fafafa', '#d84315'];
const CLOTHES_COLORS = ['#1a237e', '#004d40', '#b71c1c', '#4a148c', '#3e2723', '#263238', '#880e4f'];
const HAT_COLORS = ['#000000', '#3e2723', '#5d4037', '#424242'];

export const generateNPC = (zoneId: string, x: number, y: number): NPC => {
    const genderRoll = Math.random();
    const gender: 'male' | 'female' | 'non-binary' =
        genderRoll > 0.95 ? 'non-binary' :
        genderRoll > 0.5 ? 'female' : 'male';

    const isFemale = gender === 'female';
    const firstName = isFemale ? pick(NPC_NAMES_FEMALE) : pick(NPC_NAMES_MALE);
    const surname = pick(NPC_SURNAMES);
    const profession = pick(NPC_PROFESSIONS);
    const goal = pick(NPC_GOALS);

    // Generate age (18-80, weighted toward middle ages)
    const age = Math.floor(18 + Math.random() * 30 + Math.random() * 32);

    // Generate combat stats (1-20) - influenced by age and profession
    const baseWit = Math.floor(5 + Math.random() * 10);
    const baseObs = Math.floor(5 + Math.random() * 10);
    const baseComp = Math.floor(5 + Math.random() * 10);

    // Age modifiers: older = wiser but slower
    const ageModifier = age > 60 ? 3 : age > 40 ? 1 : age < 25 ? -1 : 0;

    const combatStats = {
        wit: Math.min(20, Math.max(1, baseWit + ageModifier)),
        observation: Math.min(20, Math.max(1, baseObs + ageModifier)),
        composure: Math.min(20, Math.max(1, baseComp + ageModifier))
    };

    const colors = {
        skin: pick(SKIN_TONES),
        hair: pick(HAIR_COLORS),
        primary: pick(CLOTHES_COLORS),
        secondary: pick(HAT_COLORS)
    };

    const portrait: PortraitConfig = {
        hairStyle: Math.random() > 0.7 ? 'WILD' : 'GENTLEMAN',
        hairColor: 'text-gray-800', // Simplified for ASCII portrait fallback
        skinColor: 'text-amber-100',
        clothesColor: 'text-gray-600',
        facialHair: (gender === 'male' && Math.random() > 0.4) ? (Math.random() > 0.5 ? 'BEARD' : 'MOUSTACHE') : 'NONE',
        accessory: Math.random() > 0.8 ? 'MONOCLE' : 'NONE'
    };

    const genderLabel = gender === 'non-binary' ? 'person' : gender === 'female' ? 'woman' : 'man';
    const ageDescriptor = age < 25 ? 'young' : age < 40 ? '' : age < 60 ? 'middle-aged' : 'elderly';
    const fullDescriptor = `${ageDescriptor} ${genderLabel}`.trim();

    return {
        id: `npc_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,
        name: `${firstName} ${surname}`,
        profession,
        description: `A ${profession.toLowerCase()} looking for something.`,
        goal,
        dialogueStyle: `Speaks like a ${profession.toLowerCase()}.`,
        historicalNote: `A ${fullDescriptor}, age ${age}. Wit: ${combatStats.wit}, Obs: ${combatStats.observation}, Composure: ${combatStats.composure}`,
        age,
        gender,
        combatStats,
        location: {
            x,
            y,
            zoneId,
            direction: pick(['N', 'S', 'E', 'W'])
        },
        history: ["Arrived at the fair", "Walked around"],
        colors,
        portrait,
        avatarChar: firstName[0]
    };
};
