import { CombatCard, BiomeType } from '../types';

// Unlock condition types
export type CardUnlockCondition =
  | { type: 'starter' } // Available from start (randomly selected)
  | { type: 'biome'; biome: BiomeType } // First visit to biome
  | { type: 'npc_profession'; profession: string } // Talk to NPC with this profession
  | { type: 'item'; itemNameContains: string } // Pick up item containing this string
  | { type: 'event'; eventId: string } // Complete specific event
  | { type: 'stat'; stat: 'wit' | 'observation' | 'decorum' | 'reputation'; threshold: number }; // Reach stat threshold

export interface CombatCardDefinition extends CombatCard {
  unlockCondition: CardUnlockCondition;
  unlockDescription: string; // Shown in toast when unlocked
}

// All combat cards with their unlock conditions
export const COMBAT_CARDS: CombatCardDefinition[] = [
  // === STARTER CARDS (5 randomly selected at game start) ===

  // DEFENSE cards - low cost, help maintain composure
  {
    id: 'silence',
    name: 'Eloquent Silence',
    type: 'DEFENSE',
    description: 'Sometimes the most devastating response is none at all.',
    damage: 6,
    cost: 5,
    composureRequired: 10,
    unlockCondition: { type: 'starter' },
    unlockDescription: 'A fundamental tool of social warfare.'
  },
  {
    id: 'boredom',
    name: 'Theatrical Ennui',
    type: 'DEFENSE',
    description: 'Examine your pocket watch with pointed disinterest.',
    damage: 5,
    cost: 5,
    composureRequired: 10,
    unlockCondition: { type: 'starter' },
    unlockDescription: 'The art of performative indifference.'
  },
  {
    id: 'sympathy',
    name: 'Feigned Sympathy',
    type: 'DEFENSE',
    description: '"How difficult it must be for you..."',
    damage: 8,
    cost: 8,
    composureRequired: 15,
    unlockCondition: { type: 'starter' },
    unlockDescription: 'Condescension dressed as compassion.'
  },

  // OBSERVATION cards - moderate cost, solid damage
  {
    id: 'provincial',
    name: 'Provincial Observation',
    type: 'OBSERVATION',
    description: 'Note their unfamiliarity with continental customs.',
    damage: 12,
    cost: 12,
    composureRequired: 25,
    unlockCondition: { type: 'starter' },
    unlockDescription: 'The tourist is always obvious.'
  },
  {
    id: 'aesthetic',
    name: 'Aesthetic Critique',
    type: 'OBSERVATION',
    description: 'Comment on their questionable taste in art or dress.',
    damage: 14,
    cost: 15,
    composureRequired: 30,
    unlockCondition: { type: 'starter' },
    unlockDescription: 'Beauty, or its absence, speaks volumes.'
  },

  // === UNLOCKABLE CARDS ===

  // Unlocked by visiting biomes
  {
    id: 'nuance',
    name: 'Appeal to Nuance',
    type: 'DEFENSE',
    description: 'Suggest their view lacks necessary complexity.',
    damage: 7,
    cost: 10,
    composureRequired: 20,
    unlockCondition: { type: 'biome', biome: 'SALON' },
    unlockDescription: 'The salons teach that nothing is simple.'
  },
  {
    id: 'american',
    name: 'The American Question',
    type: 'OBSERVATION',
    description: 'Turn their assumptions about Americans against them.',
    damage: 15,
    cost: 18,
    composureRequired: 35,
    unlockCondition: { type: 'biome', biome: 'GRAND_HALL' },
    unlockDescription: 'In the grand halls, nationality becomes a weapon.'
  },
  {
    id: 'mechanical',
    name: 'Mechanical Metaphor',
    type: 'OBSERVATION',
    description: 'Compare their thinking to the predictable motion of gears.',
    damage: 13,
    cost: 14,
    composureRequired: 28,
    unlockCondition: { type: 'biome', biome: 'GALERIE' },
    unlockDescription: 'The Galerie des Machines inspires industrial wit.'
  },
  {
    id: 'elevation',
    name: 'Elevated Perspective',
    type: 'DEFENSE',
    description: 'Suggest you simply see further than they do.',
    damage: 9,
    cost: 10,
    composureRequired: 18,
    unlockCondition: { type: 'biome', biome: 'TOWER_BASE' },
    unlockDescription: 'The Tower offers more than a view.'
  },
  {
    id: 'exotic',
    name: 'Exotic Reference',
    type: 'OBSERVATION',
    description: 'Casually reference customs they could not possibly know.',
    damage: 11,
    cost: 13,
    composureRequired: 26,
    unlockCondition: { type: 'biome', biome: 'VILLAGE' },
    unlockDescription: 'The colonial villages expand one\'s arsenal.'
  },
  {
    id: 'garden',
    name: 'Botanical Aside',
    type: 'DEFENSE',
    description: 'Draw a withering comparison to some unfortunate plant.',
    damage: 6,
    cost: 6,
    composureRequired: 12,
    unlockCondition: { type: 'biome', biome: 'GARDEN' },
    unlockDescription: 'Gardens teach the art of cultivated disdain.'
  },

  // Unlocked by talking to specific NPC professions
  {
    id: 'allusion',
    name: 'Literary Allusion',
    type: 'INSULT',
    description: 'Reference an obscure work they clearly have not read.',
    damage: 16,
    cost: 20,
    composureRequired: 40,
    unlockCondition: { type: 'npc_profession', profession: 'Writer' },
    unlockDescription: 'A fellow writer reminds you of literature\'s power.'
  },
  {
    id: 'class',
    name: 'Class Consciousness',
    type: 'INSULT',
    description: 'A subtle reminder of social standing.',
    damage: 18,
    cost: 22,
    composureRequired: 50,
    unlockCondition: { type: 'npc_profession', profession: 'Aristocrat' },
    unlockDescription: 'The aristocracy teaches the weight of breeding.'
  },
  {
    id: 'diplomatic',
    name: 'Diplomatic Immunity',
    type: 'DEFENSE',
    description: 'Retreat behind a wall of excessive politeness.',
    damage: 10,
    cost: 12,
    composureRequired: 22,
    unlockCondition: { type: 'npc_profession', profession: 'Diplomat' },
    unlockDescription: 'Diplomats demonstrate how courtesy can wound.'
  },
  {
    id: 'scientific',
    name: 'Scientific Detachment',
    type: 'OBSERVATION',
    description: 'Observe them as one might a curious specimen.',
    damage: 12,
    cost: 14,
    composureRequired: 27,
    unlockCondition: { type: 'npc_profession', profession: 'Scientist' },
    unlockDescription: 'Science offers a cold lens for human folly.'
  },
  {
    id: 'artistic',
    name: 'Artistic Dismissal',
    type: 'INSULT',
    description: '"I find your perspective... derivative."',
    damage: 15,
    cost: 18,
    composureRequired: 38,
    unlockCondition: { type: 'npc_profession', profession: 'Artist' },
    unlockDescription: 'Artists know how to cut to the quick.'
  },
  {
    id: 'mercantile',
    name: 'Mercantile Calculation',
    type: 'OBSERVATION',
    description: 'Assess their worth in coldly commercial terms.',
    damage: 11,
    cost: 12,
    composureRequired: 24,
    unlockCondition: { type: 'npc_profession', profession: 'Merchant' },
    unlockDescription: 'Commerce reduces all things to value.'
  },

  // Unlocked by picking up specific items
  {
    id: 'gaze',
    name: 'The Withering Gaze',
    type: 'INSULT',
    description: 'A look that speaks volumes of disappointment.',
    damage: 20,
    cost: 25,
    composureRequired: 60,
    unlockCondition: { type: 'item', itemNameContains: 'opera glass' },
    unlockDescription: 'Opera glasses sharpen one\'s withering looks.'
  },
  {
    id: 'historical',
    name: 'Historical Correction',
    type: 'OBSERVATION',
    description: 'Point out their embarrassing historical ignorance.',
    damage: 13,
    cost: 15,
    composureRequired: 30,
    unlockCondition: { type: 'item', itemNameContains: 'guide' },
    unlockDescription: 'A guidebook arms you with inconvenient facts.'
  },
  {
    id: 'written',
    name: 'The Written Word',
    type: 'INSULT',
    description: '"I shall remember this conversation... for my work."',
    damage: 14,
    cost: 16,
    composureRequired: 35,
    unlockCondition: { type: 'item', itemNameContains: 'notebook' },
    unlockDescription: 'A notebook implies the threat of posterity.'
  },

  // Unlocked by reaching stat thresholds
  {
    id: 'rapier',
    name: 'Rapier Wit',
    type: 'INSULT',
    description: 'A perfectly timed, devastatingly precise observation.',
    damage: 17,
    cost: 20,
    composureRequired: 45,
    unlockCondition: { type: 'stat', stat: 'wit', threshold: 15 },
    unlockDescription: 'Your wit has reached a dangerous edge.'
  },
  {
    id: 'penetrating',
    name: 'Penetrating Analysis',
    type: 'OBSERVATION',
    description: 'See through their pretenses to uncomfortable truths.',
    damage: 16,
    cost: 18,
    composureRequired: 40,
    unlockCondition: { type: 'stat', stat: 'observation', threshold: 15 },
    unlockDescription: 'Your powers of observation have sharpened.'
  },
  {
    id: 'impeccable',
    name: 'Impeccable Form',
    type: 'DEFENSE',
    description: 'Your perfect manners make their rudeness conspicuous.',
    damage: 8,
    cost: 8,
    composureRequired: 16,
    unlockCondition: { type: 'stat', stat: 'decorum', threshold: 15 },
    unlockDescription: 'Your decorum has become a shield.'
  },
  {
    id: 'famous',
    name: 'The Weight of Fame',
    type: 'INSULT',
    description: '"Do you know who I am?" (But said with class.)',
    damage: 19,
    cost: 24,
    composureRequired: 55,
    unlockCondition: { type: 'stat', stat: 'reputation', threshold: 80 },
    unlockDescription: 'Your reputation now precedes you.'
  },
];

// Get all starter cards
export const getStarterCards = (): CombatCardDefinition[] => {
  return COMBAT_CARDS.filter(card => card.unlockCondition.type === 'starter');
};

// Get random starter cards for new game
export const getRandomStarterCardIds = (count: number = 5): string[] => {
  const starterCards = getStarterCards();
  const shuffled = [...starterCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(c => c.id);
};

// Get card by ID
export const getCardById = (id: string): CombatCardDefinition | undefined => {
  return COMBAT_CARDS.find(card => card.id === id);
};

// Get unlocked cards as CombatCard objects
export const getUnlockedCards = (unlockedIds: string[]): CombatCard[] => {
  return COMBAT_CARDS.filter(card => unlockedIds.includes(card.id));
};

// Check if a card should be unlocked based on condition
export const checkCardUnlock = (
  card: CombatCardDefinition,
  context: {
    visitedBiomes?: BiomeType[];
    talkedToProfessions?: string[];
    inventory?: { name: string }[];
    stats?: { wit: number; observation: number; decorum: number; reputation: number };
  }
): boolean => {
  const condition = card.unlockCondition;

  switch (condition.type) {
    case 'starter':
      return false; // Starters are assigned at game start, not unlocked
    case 'biome':
      return context.visitedBiomes?.includes(condition.biome) ?? false;
    case 'npc_profession':
      return context.talkedToProfessions?.some(p =>
        p.toLowerCase().includes(condition.profession.toLowerCase())
      ) ?? false;
    case 'item':
      return context.inventory?.some(item =>
        item.name.toLowerCase().includes(condition.itemNameContains.toLowerCase())
      ) ?? false;
    case 'stat':
      if (!context.stats) return false;
      return context.stats[condition.stat] >= condition.threshold;
    default:
      return false;
  }
};
