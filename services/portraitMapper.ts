import { PortraitConfig, PortraitArchetype, Mood, PortraitEmotion } from '../types';

/**
 * Maps old PortraitConfig to new PortraitArchetype
 * Used for backwards compatibility with existing NPCs
 */
export const configToArchetype = (config: PortraitConfig, gender: 'male' | 'female' | 'non-binary' = 'male'): PortraitArchetype => {
  // If has monocle and beard, likely gentleman or pharmacist
  if (config.accessory === 'MONOCLE') {
    if (config.hairStyle === 'BALD') {
      return 'pharmacist';
    }
    return 'gentleman';
  }

  // Female characters
  if (gender === 'female') {
    if (config.hairStyle === 'WILD') {
      return 'flapper';
    }
    return 'mobster_f';
  }

  // Check for facial hair patterns
  if (config.facialHair === 'MOUSTACHE' && !config.accessory) {
    return 'cop'; // Cops typically have mustaches
  }

  if (config.facialHair === 'BEARD') {
    return 'gentleman';
  }

  // Wild hair style often means working class
  if (config.hairStyle === 'WILD') {
    return 'worker';
  }

  // Bald with mustache
  if (config.hairStyle === 'BALD') {
    return 'pharmacist';
  }

  // Default fallbacks
  if (gender === 'female') {
    return 'flapper';
  }

  return 'gentleman';
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
 */
export const generateRandomArchetype = (
  gender: 'male' | 'female' | 'non-binary',
  profession?: string,
  age?: number
): PortraitArchetype => {
  // Female archetypes
  if (gender === 'female') {
    return Math.random() > 0.5 ? 'flapper' : 'mobster_f';
  }

  // Male archetypes - weighted by profession and age
  const archetypes: PortraitArchetype[] = ['gentleman', 'mobster_m', 'worker', 'sailor', 'pharmacist', 'cop'];

  // Weight by profession
  if (profession) {
    const prof = profession.toLowerCase();
    if (prof.includes('police') || prof.includes('officer') || prof.includes('cop')) return 'cop';
    if (prof.includes('work') || prof.includes('labor')) return 'worker';
    if (prof.includes('sail') || prof.includes('navy')) return 'sailor';
    if (prof.includes('doctor') || prof.includes('pharmac') || prof.includes('chemist')) return 'pharmacist';
    if (prof.includes('gang') || prof.includes('mob')) return 'mobster_m';
    if (prof.includes('gentleman') || prof.includes('aristocrat')) return 'gentleman';
  }

  // Weight by age
  if (age && age > 60) {
    return Math.random() > 0.5 ? 'pharmacist' : 'gentleman';
  }

  // Random selection
  return archetypes[Math.floor(Math.random() * archetypes.length)];
};
