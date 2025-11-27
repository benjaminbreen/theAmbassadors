import { PortraitConfig, PortraitArchetype, Mood, PortraitEmotion } from '../types';

/**
 * Maps old PortraitConfig to new PortraitArchetype
 * Used for backwards compatibility with existing NPCs
 */
export const configToArchetype = (config: PortraitConfig, gender: 'male' | 'female' | 'non-binary' = 'male'): PortraitArchetype => {
  // If has monocle and beard, likely gentleman or pharmacist
  if (config.accessory === 'MONOCLE') {
    if (config.hairStyle === 'BALD') {
      return 'professor';
    }
    return 'gentleman';
  }

  // Female characters
  if (gender === 'female') {
    if (config.hairStyle === 'WILD') {
      return 'lady_bohemian';
    }
    return Math.random() > 0.5 ? 'lady_elegant' : 'flapper';
  }

  // Check for facial hair patterns
  if (config.facialHair === 'MOUSTACHE' && !config.accessory) {
    return Math.random() > 0.5 ? 'aristocrat' : 'diplomat';
  }

  if (config.facialHair === 'BEARD') {
    return Math.random() > 0.5 ? 'artist' : 'bohemian';
  }

  // Wild hair style often means artistic type
  if (config.hairStyle === 'WILD') {
    return Math.random() > 0.5 ? 'artist' : 'bohemian';
  }

  // Bald with mustache
  if (config.hairStyle === 'BALD') {
    return Math.random() > 0.5 ? 'professor' : 'pharmacist';
  }

  // Default fallbacks with variety
  if (gender === 'female') {
    const femaleOptions: PortraitArchetype[] = ['flapper', 'lady_elegant', 'lady_bohemian', 'mobster_f'];
    return femaleOptions[Math.floor(Math.random() * femaleOptions.length)];
  }

  const maleOptions: PortraitArchetype[] = ['gentleman', 'young_man', 'journalist', 'artist'];
  return maleOptions[Math.floor(Math.random() * maleOptions.length)];
};

/**
 * Maps old Mood to new PortraitEmotion
 */
export const moodToEmotion = (mood: Mood, speaking: boolean = false): PortraitEmotion => {
  if (speaking) return 'happy'; // Speaking characters look happy/engaged

  switch (mood) {
    case 'ANGRY': return 'angry';
    case 'SAD': return 'suspicious'; // Map sad to suspicious for more variety
    case 'SURPRISED': return 'afraid';
    case 'SWEATING': return 'afraid'; // Anxiety maps to afraid
    case 'NEUTRAL':
    default:
      return 'neutral';
  }
};

/**
 * Generates a random archetype based on NPC attributes
 * Much more variety than before!
 */
export const generateRandomArchetype = (
  gender: 'male' | 'female' | 'non-binary',
  profession?: string,
  age?: number
): PortraitArchetype => {
  // Female archetypes - more variety
  if (gender === 'female') {
    const femaleArchetypes: PortraitArchetype[] = ['flapper', 'lady_elegant', 'lady_bohemian', 'mobster_f'];

    if (profession) {
      const prof = profession.toLowerCase();
      if (prof.includes('artist') || prof.includes('bohemian') || prof.includes('poet')) return 'lady_bohemian';
      if (prof.includes('aristocrat') || prof.includes('noble') || prof.includes('countess')) return 'lady_elegant';
      if (prof.includes('dancer') || prof.includes('actress') || prof.includes('singer')) return 'flapper';
    }

    // Age-based selection
    if (age && age > 50) return 'lady_elegant';
    if (age && age < 30) return Math.random() > 0.5 ? 'flapper' : 'lady_bohemian';

    return femaleArchetypes[Math.floor(Math.random() * femaleArchetypes.length)];
  }

  // Male archetypes - much more variety
  const maleArchetypes: PortraitArchetype[] = [
    'gentleman', 'artist', 'aristocrat', 'engineer', 'bohemian',
    'journalist', 'diplomat', 'young_man', 'professor', 'worker', 'sailor'
  ];

  // Weight by profession
  if (profession) {
    const prof = profession.toLowerCase();

    // Specific profession matches
    if (prof.includes('police') || prof.includes('officer') || prof.includes('guard')) return 'cop';
    if (prof.includes('work') || prof.includes('labor') || prof.includes('mechanic')) return 'worker';
    if (prof.includes('sail') || prof.includes('navy') || prof.includes('marine')) return 'sailor';
    if (prof.includes('doctor') || prof.includes('pharmac') || prof.includes('chemist')) return 'pharmacist';
    if (prof.includes('professor') || prof.includes('academic') || prof.includes('scholar')) return 'professor';
    if (prof.includes('journal') || prof.includes('writer') || prof.includes('reporter')) return 'journalist';
    if (prof.includes('artist') || prof.includes('painter') || prof.includes('sculptor')) return 'artist';
    if (prof.includes('poet') || prof.includes('bohemian') || prof.includes('musician')) return 'bohemian';
    if (prof.includes('engineer') || prof.includes('inventor') || prof.includes('architect')) return 'engineer';
    if (prof.includes('diplomat') || prof.includes('ambassador') || prof.includes('consul')) return 'diplomat';
    if (prof.includes('aristocrat') || prof.includes('noble') || prof.includes('count') || prof.includes('baron')) return 'aristocrat';
    if (prof.includes('flâneur') || prof.includes('flaneur') || prof.includes('dandy')) return 'gentleman';
    if (prof.includes('critic') || prof.includes('connoisseur')) return Math.random() > 0.5 ? 'gentleman' : 'professor';
  }

  // Weight by age
  if (age) {
    if (age < 30) {
      const youngOptions: PortraitArchetype[] = ['young_man', 'artist', 'bohemian', 'journalist'];
      return youngOptions[Math.floor(Math.random() * youngOptions.length)];
    }
    if (age > 60) {
      const olderOptions: PortraitArchetype[] = ['professor', 'aristocrat', 'diplomat', 'gentleman'];
      return olderOptions[Math.floor(Math.random() * olderOptions.length)];
    }
    if (age > 45) {
      const middleOptions: PortraitArchetype[] = ['gentleman', 'diplomat', 'professor', 'aristocrat', 'engineer'];
      return middleOptions[Math.floor(Math.random() * middleOptions.length)];
    }
  }

  // Random selection from all options
  return maleArchetypes[Math.floor(Math.random() * maleArchetypes.length)];
};
