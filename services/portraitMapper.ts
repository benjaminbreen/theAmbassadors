import { PortraitConfig, PortraitArchetype, Mood, PortraitEmotion } from '../types';
import { AppearanceProfile, SkinTone } from '../data/historicalFigures';

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
  if (speaking) return 'speaking';

  switch (mood) {
    case 'ANGRY': return 'angry';
    case 'SAD': return 'suspicious';
    case 'SURPRISED': return 'afraid';
    case 'SWEATING': return 'afraid';
    case 'PANICKED': return 'panicked';
    case 'WORRIED': return 'worried';
    case 'SPEAKING': return 'speaking';
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
      // Religious sisters
      if (prof.includes('nun') || prof.includes('sister') || prof.includes('religious')) return 'nun';
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

    // Clergy
    if (prof.includes('priest') || prof.includes('père') || prof.includes('father') || prof.includes('abbé') || prof.includes('clergy') || prof.includes('monsignor')) return 'priest';
    // Specific profession matches
    if (prof.includes('police') || prof.includes('officer') || prof.includes('guard') || prof.includes('gendarme')) return 'cop';
    if (prof.includes('military') || prof.includes('soldier') || prof.includes('colonel') || prof.includes('captain') || prof.includes('general')) return 'retired_general';
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

/**
 * Generate portrait archetype based on appearance profile
 * Takes demographics into account for historically accurate variety
 */
export const generateAppearanceBasedArchetype = (
  gender: 'male' | 'female' | 'non-binary',
  profession?: string,
  age?: number,
  appearance?: AppearanceProfile
): PortraitArchetype => {
  // If no appearance, fall back to random generation
  if (!appearance) {
    return generateRandomArchetype(gender, profession, age);
  }

  const skinTone = appearance.skinTone;
  const prof = profession?.toLowerCase() || '';

  // Female archetypes based on appearance
  if (gender === 'female') {
    // Religious sisters - check first before other profession matches
    if (prof.includes('nun') || prof.includes('sister') || prof.includes('religious')) return 'nun';

    // Specific profession/cultural matches
    if (skinTone === 'golden') {
      if (prof.includes('geisha') || prof.includes('dancer')) return 'geisha';
      return Math.random() > 0.5 ? 'japanese_lady' : 'debutante';
    }
    if (skinTone === 'olive' || skinTone === 'tan') {
      if (prof.includes('dancer') || prof.includes('performer')) return 'spanish_dancer';
      if (appearance.clothingStyle === 'exotic_female') return 'harem_woman';
      return Math.random() > 0.5 ? 'lady_bohemian' : 'lady_elegant';
    }
    if (skinTone === 'warm_brown' || skinTone === 'dark' || skinTone === 'deep') {
      if (prof.includes('servant') || prof.includes('maid')) return 'african_servant';
      return Math.random() > 0.5 ? 'lady_elegant' : 'flapper';
    }

    // Age-based selection for lighter skin tones
    if (age && age > 55) return 'elderly_matron';
    if (age && age < 25) {
      if (prof.includes('dancer') || prof.includes('actress')) return 'flapper';
      return Math.random() > 0.5 ? 'debutante' : 'lady_bohemian';
    }

    // Default female archetypes
    if (prof.includes('artist') || prof.includes('bohemian')) return 'lady_bohemian';
    if (prof.includes('aristocrat') || prof.includes('noble')) return 'lady_elegant';
    return Math.random() > 0.5 ? 'lady_elegant' : 'flapper';
  }

  // Male archetypes based on appearance
  // Specific cultural/ethnic archetypes
  if (skinTone === 'golden') {
    if (prof.includes('delegate') || prof.includes('official') || prof.includes('prince')) return 'japanese_delegate';
    if (prof.includes('merchant') || prof.includes('trader')) return 'chinese_merchant';
    return Math.random() > 0.5 ? 'japanese_delegate' : 'young_man';
  }

  if (skinTone === 'olive' || skinTone === 'tan') {
    if (appearance.hat === 'fez' || prof.includes('ottoman') || prof.includes('turkish')) return 'ottoman_official';
    if (prof.includes('merchant')) return 'levantine_merchant';
    if (prof.includes('diplomat') || prof.includes('official')) return 'diplomat';
    // Mediterranean types can use standard European archetypes
  }

  if (skinTone === 'warm_brown' || skinTone === 'dark' || skinTone === 'deep') {
    if (prof.includes('servant') || prof.includes('porter')) return 'african_servant';
    if (prof.includes('military') || prof.includes('soldier')) return 'colonial_soldier';
    if (prof.includes('diplomat') || prof.includes('statesman')) return 'diplomat';
    if (age && age > 60) return 'elderly_gentleman';
    // Educated/professional African or Caribbean visitors
    return Math.random() > 0.5 ? 'gentleman' : 'young_man';
  }

  // Age-based selection for European types
  if (age && age > 65) {
    const elderlyOptions: PortraitArchetype[] = ['elderly_gentleman', 'retired_general', 'professor'];
    return elderlyOptions[Math.floor(Math.random() * elderlyOptions.length)];
  }

  // Profession-based selection
  // Clergy
  if (prof.includes('priest') || prof.includes('père') || prof.includes('father') || prof.includes('abbé') || prof.includes('clergy')) return 'priest';
  if (prof.includes('artist') || prof.includes('painter') || prof.includes('sculptor')) return 'artist';
  if (prof.includes('bohemian') || prof.includes('poet') || prof.includes('composer')) return 'bohemian';
  if (prof.includes('engineer') || prof.includes('inventor')) return 'engineer';
  if (prof.includes('military') || prof.includes('officer') || prof.includes('general') || prof.includes('colonel') || prof.includes('captain')) {
    return age && age > 50 ? 'retired_general' : 'cop';
  }
  if (prof.includes('professor') || prof.includes('scientist') || prof.includes('academic')) return 'professor';
  if (prof.includes('journalist') || prof.includes('writer') || prof.includes('critic')) return 'journalist';
  if (prof.includes('diplomat') || prof.includes('ambassador')) return 'diplomat';
  if (prof.includes('aristocrat') || prof.includes('count') || prof.includes('baron')) return 'aristocrat';
  if (prof.includes('worker') || prof.includes('laborer')) return 'worker';
  if (prof.includes('sailor') || prof.includes('navy')) return 'sailor';
  if (prof.includes('police') || prof.includes('gendarme')) return 'cop';

  // Default based on age
  if (age && age < 30) {
    const youngOptions: PortraitArchetype[] = ['young_man', 'bohemian', 'journalist'];
    return youngOptions[Math.floor(Math.random() * youngOptions.length)];
  }

  // Default gentleman
  return Math.random() > 0.5 ? 'gentleman' : 'aristocrat';
};
