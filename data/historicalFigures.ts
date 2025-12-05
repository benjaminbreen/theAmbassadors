/**
 * Historical Figures Present at the 1889 Paris Exposition
 *
 * Demographics of the Exposition:
 * - ~32 million visitors total
 * - ~90% French and Western European
 * - ~5% Other European (Eastern, Russian)
 * - ~3% American (mostly white, some African American visitors)
 * - ~2% Colonial subjects and international delegates
 */

import { BiomeType, PortraitArchetype } from '../types';

// Appearance types that feed into both Portrait and NpcSprite
export type SkinTone = 'fair' | 'pale' | 'tan' | 'olive' | 'golden' | 'warm_brown' | 'dark' | 'deep';
export type HairColorType = 'black' | 'dark_brown' | 'brown' | 'light_brown' | 'auburn' | 'red' | 'blonde' | 'gray' | 'white' | 'bald';
export type FacialHairType = 'none' | 'mustache' | 'goatee' | 'full_beard' | 'mutton_chops' | 'imperial' | 'stubble';
export type ClothingStyleType = 'formal_suit' | 'morning_coat' | 'military' | 'working_class' | 'bohemian' | 'exotic_male' | 'bustle_dress' | 'walking_dress' | 'servant_dress' | 'exotic_female';
export type HatStyleType = 'top_hat' | 'bowler' | 'flat_cap' | 'kepi' | 'bonnet' | 'wide_brim' | 'fez' | 'turban' | 'beret' | 'none';

export interface AppearanceProfile {
  skinTone: SkinTone;
  hairColor: HairColorType;
  eyeColor: string;  // hex color
  facialHair: FacialHairType;
  clothingStyle: ClothingStyleType;
  hat: HatStyleType;
  // These hex colors are derived from the above but can be overridden
  skinHex?: string;
  hairHex?: string;
  primaryClothingHex?: string;
  secondaryClothingHex?: string;
}

export interface HistoricalFigure {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  profession: string;
  nationality: string;
  age: number; // in 1889
  gender: 'male' | 'female';

  appearance: AppearanceProfile;
  portraitArchetype: PortraitArchetype;

  // Spawn configuration
  spawnWeight: number;  // base rarity 1-100 (higher = more common)
  preferredBiomes: BiomeType[];
  biomeMultiplier: number;  // multiplier when in preferred biome
  maxInstances: number;  // max simultaneous spawns (usually 1)

  // Rich content
  description: string;
  historicalNote: string;
  dialogueStyle: string;
  knownFor: string[];

  // Combat stats (for dialogue battles)
  combatStats: {
    wit: number;
    observation: number;
    composure: number;
  };
}

// Skin tone hex values
export const SKIN_TONE_HEX: Record<SkinTone, string> = {
  fair: '#fff5ee',
  pale: '#fce3c2',
  tan: '#e0ac69',
  olive: '#d4a574',
  golden: '#c68642',
  warm_brown: '#a67c52',
  dark: '#8d5524',
  deep: '#5c3d2e'
};

// Hair color hex values
export const HAIR_COLOR_HEX: Record<HairColorType, string> = {
  black: '#0a0a0a',
  dark_brown: '#2c1a0b',
  brown: '#4e342e',
  light_brown: '#6d4c3d',
  auburn: '#8b4513',
  red: '#d84315',
  blonde: '#e8c07c',
  gray: '#808080',
  white: '#d0d0d0',
  bald: '#fce3c2' // matches skin
};

// Historical figures data
export const HISTORICAL_FIGURES: HistoricalFigure[] = [
  // ============ FRENCH FIGURES ============
  {
    id: 'gustave_eiffel',
    name: 'Gustave Eiffel',
    firstName: 'Gustave',
    lastName: 'Eiffel',
    profession: 'Engineer',
    nationality: 'French',
    age: 57,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'gray',
      eyeColor: '#5a6a7a',
      facialHair: 'mustache',
      clothingStyle: 'morning_coat',
      hat: 'top_hat'
    },
    portraitArchetype: 'engineer',
    spawnWeight: 40,
    preferredBiomes: ['TOWER_BASE', 'TOWER_LEVEL', 'GRAND_HALL'],
    biomeMultiplier: 5,
    maxInstances: 1,
    description: 'The famous engineer, surveying his magnificent creation with quiet pride.',
    historicalNote: 'Alexandre Gustave Eiffel designed the iconic tower as the entrance arch for the 1889 Exposition. He maintained a private apartment at the top.',
    dialogueStyle: 'Speaks with technical precision but evident passion for engineering. Modest about his achievements.',
    knownFor: ['Eiffel Tower', 'Statue of Liberty framework', 'Railway bridges'],
    combatStats: { wit: 16, observation: 18, composure: 15 }
  },
  {
    id: 'emile_zola',
    name: 'Émile Zola',
    firstName: 'Émile',
    lastName: 'Zola',
    profession: 'Writer',
    nationality: 'French',
    age: 49,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'dark_brown',
      eyeColor: '#3a3a2a',
      facialHair: 'full_beard',
      clothingStyle: 'formal_suit',
      hat: 'none'
    },
    portraitArchetype: 'journalist',
    spawnWeight: 25,
    preferredBiomes: ['SALON', 'CAFE', 'GARDEN'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'The celebrated novelist, observing the crowds with a writer\'s keen eye.',
    historicalNote: 'Leader of the Naturalist movement, Zola was at the height of his fame in 1889, having recently completed his Rougon-Macquart cycle.',
    dialogueStyle: 'Direct, observational, sometimes provocative. Interested in social conditions.',
    knownFor: ['Germinal', 'Nana', 'L\'Assommoir', 'Naturalism'],
    combatStats: { wit: 18, observation: 19, composure: 14 }
  },
  {
    id: 'sarah_bernhardt',
    name: 'Sarah Bernhardt',
    firstName: 'Sarah',
    lastName: 'Bernhardt',
    profession: 'Actress',
    nationality: 'French',
    age: 44,
    gender: 'female',
    appearance: {
      skinTone: 'pale',
      hairColor: 'auburn',
      eyeColor: '#5a4a3a',
      facialHair: 'none',
      clothingStyle: 'bustle_dress',
      hat: 'wide_brim'
    },
    portraitArchetype: 'lady_elegant',
    spawnWeight: 30,
    preferredBiomes: ['SALON', 'GRAND_HALL', 'TROCADERO'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'The Divine Sarah, commanding attention even when standing still.',
    historicalNote: 'The most famous actress of her era, known for her dramatic presence and unconventional lifestyle.',
    dialogueStyle: 'Theatrical, magnetic, with dramatic pauses. Speaks as if always on stage.',
    knownFor: ['Theater', 'Sculpture', 'Eccentric lifestyle'],
    combatStats: { wit: 17, observation: 15, composure: 18 }
  },
  {
    id: 'claude_debussy',
    name: 'Claude Debussy',
    firstName: 'Claude',
    lastName: 'Debussy',
    profession: 'Composer',
    nationality: 'French',
    age: 26,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'dark_brown',
      eyeColor: '#4a4a4a',
      facialHair: 'goatee',
      clothingStyle: 'bohemian',
      hat: 'none'
    },
    portraitArchetype: 'bohemian',
    spawnWeight: 20,
    preferredBiomes: ['VILLAGE', 'SALON', 'GARDEN'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'A young composer with a dreamy expression, listening intently to exotic sounds.',
    historicalNote: 'The Javanese gamelan performances at the Exposition profoundly influenced Debussy\'s later compositions.',
    dialogueStyle: 'Dreamy, aesthetic, speaks of sounds and sensations. Dislikes Wagner.',
    knownFor: ['Clair de Lune', 'Prélude à l\'après-midi d\'un faune', 'Impressionist music'],
    combatStats: { wit: 15, observation: 17, composure: 12 }
  },
  {
    id: 'paul_gauguin',
    name: 'Paul Gauguin',
    firstName: 'Paul',
    lastName: 'Gauguin',
    profession: 'Painter',
    nationality: 'French',
    age: 41,
    gender: 'male',
    appearance: {
      skinTone: 'tan',
      hairColor: 'dark_brown',
      eyeColor: '#4a5a4a',
      facialHair: 'mustache',
      clothingStyle: 'bohemian',
      hat: 'beret'
    },
    portraitArchetype: 'artist',
    spawnWeight: 22,
    preferredBiomes: ['VILLAGE', 'GARDEN', 'CAFE'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'A restless painter with sun-weathered features, studying the colonial exhibits intently.',
    historicalNote: 'Gauguin visited the Exposition\'s colonial village, which influenced his decision to travel to Tahiti two years later.',
    dialogueStyle: 'Restless, searching, critical of bourgeois society. Dreams of escape.',
    knownFor: ['Post-Impressionism', 'Tahiti paintings', 'Primitivism'],
    combatStats: { wit: 14, observation: 18, composure: 11 }
  },
  {
    id: 'guy_de_maupassant',
    name: 'Guy de Maupassant',
    firstName: 'Guy',
    lastName: 'de Maupassant',
    profession: 'Writer',
    nationality: 'French',
    age: 39,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'brown',
      eyeColor: '#5a5a4a',
      facialHair: 'mustache',
      clothingStyle: 'formal_suit',
      hat: 'bowler'
    },
    portraitArchetype: 'gentleman',
    spawnWeight: 18,
    preferredBiomes: ['TOWER_BASE', 'CAFE', 'SALON'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'A distinguished writer with a slightly haunted look about him.',
    historicalNote: 'Maupassant famously despised the Eiffel Tower, dining in its restaurant because it was the only place in Paris where he couldn\'t see it.',
    dialogueStyle: 'Cynical, witty, with dark undertones. Master of the short story.',
    knownFor: ['Bel-Ami', 'Short stories', 'Naturalism'],
    combatStats: { wit: 18, observation: 17, composure: 13 }
  },
  {
    id: 'louis_pasteur',
    name: 'Louis Pasteur',
    firstName: 'Louis',
    lastName: 'Pasteur',
    profession: 'Scientist',
    nationality: 'French',
    age: 66,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'white',
      eyeColor: '#5a6a5a',
      facialHair: 'full_beard',
      clothingStyle: 'formal_suit',
      hat: 'none'
    },
    portraitArchetype: 'professor',
    spawnWeight: 15,
    preferredBiomes: ['GRAND_HALL', 'GALERIE'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'The venerable scientist, moving slowly but with undiminished intellectual fire.',
    historicalNote: 'Though partially paralyzed from a stroke, Pasteur attended the Exposition where germ theory exhibits celebrated his discoveries.',
    dialogueStyle: 'Methodical, passionate about science, speaks with authority despite frailty.',
    knownFor: ['Germ theory', 'Pasteurization', 'Rabies vaccine'],
    combatStats: { wit: 19, observation: 18, composure: 16 }
  },
  {
    id: 'camille_claudel',
    name: 'Camille Claudel',
    firstName: 'Camille',
    lastName: 'Claudel',
    profession: 'Sculptor',
    nationality: 'French',
    age: 24,
    gender: 'female',
    appearance: {
      skinTone: 'pale',
      hairColor: 'auburn',
      eyeColor: '#5a7a5a',
      facialHair: 'none',
      clothingStyle: 'walking_dress',
      hat: 'none'
    },
    portraitArchetype: 'lady_bohemian',
    spawnWeight: 18,
    preferredBiomes: ['GALERIE', 'GARDEN', 'SALON'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'A intense young sculptor with clay-stained hands and a fierce gaze.',
    historicalNote: 'Student and lover of Rodin, Claudel was developing her own artistic voice in 1889.',
    dialogueStyle: 'Passionate, intense, speaks of art with almost religious fervor.',
    knownFor: ['Sculpture', 'The Waltz', 'Rodin\'s muse'],
    combatStats: { wit: 15, observation: 17, composure: 12 }
  },
  {
    id: 'rosa_bonheur',
    name: 'Rosa Bonheur',
    firstName: 'Rosa',
    lastName: 'Bonheur',
    profession: 'Painter',
    nationality: 'French',
    age: 67,
    gender: 'female',
    appearance: {
      skinTone: 'fair',
      hairColor: 'gray',
      eyeColor: '#5a6a5a',
      facialHair: 'none',
      clothingStyle: 'walking_dress',
      hat: 'none'
    },
    portraitArchetype: 'elderly_matron',
    spawnWeight: 22,
    preferredBiomes: ['GARDEN', 'ESPLANADE', 'GALERIE'],
    biomeMultiplier: 5,
    maxInstances: 1,
    description: 'The celebrated animal painter, dressed practically with paint-stained cuffs, sketching the Wild West horses.',
    historicalNote: 'Rosa Bonheur spent many days at Buffalo Bill\'s camp in 1889, sketching the horses and performers. She painted her famous portrait of Cody on horseback that summer. The first woman to receive the Legion of Honor, she lived openly with her companion Anna Klumpke.',
    dialogueStyle: 'Direct, unpretentious, speaks passionately of animals and art. Disdains social conventions.',
    knownFor: ['The Horse Fair', 'Animal painting', 'Buffalo Bill portrait', 'Legion of Honor'],
    combatStats: { wit: 16, observation: 19, composure: 17 }
  },
  {
    id: 'alphonse_daudet',
    name: 'Alphonse Daudet',
    firstName: 'Alphonse',
    lastName: 'Daudet',
    profession: 'Writer',
    nationality: 'French',
    age: 49,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'dark_brown',
      eyeColor: '#5a5a4a',
      facialHair: 'full_beard',
      clothingStyle: 'formal_suit',
      hat: 'none'
    },
    portraitArchetype: 'gentleman',
    spawnWeight: 18,
    preferredBiomes: ['SALON', 'CAFE', 'GARDEN'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'The Provençal novelist, warm and animated despite the pain from his illness.',
    historicalNote: 'Daudet was suffering from syphilis-related nerve damage but remained socially active. His salon attracted literary Paris. He published "Les salons ridicules" satirizing Parisian society in 1889. Henry James had met him in 1884.',
    dialogueStyle: 'Warm, witty, speaks with Southern French charm. Tells stories within stories.',
    knownFor: ['Lettres de mon moulin', 'Tartarin de Tarascon', 'Literary salons'],
    combatStats: { wit: 17, observation: 16, composure: 13 }
  },
  {
    id: 'paul_bourget',
    name: 'Paul Bourget',
    firstName: 'Paul',
    lastName: 'Bourget',
    profession: 'Writer & Critic',
    nationality: 'French',
    age: 37,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'dark_brown',
      eyeColor: '#5a5a5a',
      facialHair: 'mustache',
      clothingStyle: 'morning_coat',
      hat: 'top_hat'
    },
    portraitArchetype: 'gentleman',
    spawnWeight: 20,
    preferredBiomes: ['SALON', 'CAFE', 'GALERIE'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'An elegant psychological novelist, observing the crowd with analytical intensity.',
    historicalNote: 'Bourget was a close friend of Henry James since 1884, dedicating "Cruelle Énigme" to him. His controversial novel "Le Disciple" appeared in 1889, attacking materialism and determinism. James admired his critical essays but found his fiction wanting.',
    dialogueStyle: 'Intellectual, probing, speaks of psychology and moral philosophy. Increasingly conservative.',
    knownFor: ['Le Disciple', 'Psychological novels', 'Literary criticism', 'Henry James friendship'],
    combatStats: { wit: 18, observation: 17, composure: 15 }
  },

  // ============ AMERICAN FIGURES ============
  {
    id: 'thomas_edison',
    name: 'Thomas Edison',
    firstName: 'Thomas',
    lastName: 'Edison',
    profession: 'Inventor',
    nationality: 'American',
    age: 42,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'gray',
      eyeColor: '#5a5a5a',
      facialHair: 'none',
      clothingStyle: 'formal_suit',
      hat: 'bowler'
    },
    portraitArchetype: 'engineer',
    spawnWeight: 35,
    preferredBiomes: ['GRAND_HALL', 'GALERIE'],
    biomeMultiplier: 5,
    maxInstances: 1,
    description: 'The Wizard of Menlo Park, demonstrating his phonograph to amazed crowds.',
    historicalNote: 'Edison\'s exhibit featuring the phonograph was one of the most popular at the Exposition. He met Eiffel in his tower apartment.',
    dialogueStyle: 'Practical, businesslike, slightly deaf. Speaks loudly and directly.',
    knownFor: ['Phonograph', 'Light bulb', 'Motion pictures'],
    combatStats: { wit: 17, observation: 16, composure: 15 }
  },
  {
    id: 'buffalo_bill',
    name: 'Buffalo Bill Cody',
    firstName: 'William',
    lastName: 'Cody',
    profession: 'Showman',
    nationality: 'American',
    age: 43,
    gender: 'male',
    appearance: {
      skinTone: 'tan',
      hairColor: 'brown',
      eyeColor: '#5a4a3a',
      facialHair: 'goatee',
      clothingStyle: 'exotic_male',
      hat: 'wide_brim'
    },
    portraitArchetype: 'gentleman',
    spawnWeight: 30,
    preferredBiomes: ['GARDEN', 'ESPLANADE', 'STREET'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'The legendary showman in his distinctive frontier attire, larger than life.',
    historicalNote: 'Buffalo Bill\'s Wild West show performed near the Exposition grounds, drawing enormous crowds.',
    dialogueStyle: 'Boisterous, theatrical, full of frontier tales. Natural entertainer.',
    knownFor: ['Wild West Show', 'Frontier scout', 'Showmanship'],
    combatStats: { wit: 14, observation: 16, composure: 17 }
  },
  {
    id: 'annie_oakley',
    name: 'Annie Oakley',
    firstName: 'Annie',
    lastName: 'Oakley',
    profession: 'Sharpshooter',
    nationality: 'American',
    age: 29,
    gender: 'female',
    appearance: {
      skinTone: 'fair',
      hairColor: 'brown',
      eyeColor: '#5a5a4a',
      facialHair: 'none',
      clothingStyle: 'walking_dress',
      hat: 'wide_brim'
    },
    portraitArchetype: 'lady_elegant',
    spawnWeight: 25,
    preferredBiomes: ['GARDEN', 'ESPLANADE', 'STREET'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'The petite sharpshooter with steady hands and a disarming smile.',
    historicalNote: 'Star of Buffalo Bill\'s show, Oakley could shoot a cigarette from her husband\'s lips at 30 paces.',
    dialogueStyle: 'Modest, polite, with quiet confidence. Surprisingly soft-spoken.',
    knownFor: ['Marksmanship', 'Wild West Show', 'Women\'s empowerment'],
    combatStats: { wit: 13, observation: 20, composure: 18 }
  },
 
  {
    id: 'james_whistler',
    name: 'James McNeill Whistler',
    firstName: 'James',
    lastName: 'Whistler',
    profession: 'Painter',
    nationality: 'American',
    age: 55,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'gray',
      eyeColor: '#4a5a4a',
      facialHair: 'mustache',
      clothingStyle: 'formal_suit',
      hat: 'top_hat'
    },
    portraitArchetype: 'artist',
    spawnWeight: 20,
    preferredBiomes: ['GALERIE', 'SALON', 'CAFE'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'The expatriate painter with a monocle and a reputation for sharp wit.',
    historicalNote: 'Living in London and Paris, Whistler was known for his Nocturnes and his famous libel suit against Ruskin.',
    dialogueStyle: 'Acerbic, witty, dandified. Famous for devastating put-downs.',
    knownFor: ['Whistler\'s Mother', 'Nocturnes', 'Art for art\'s sake'],
    combatStats: { wit: 19, observation: 16, composure: 14 }
  },
  {
    id: 'john_singer_sargent',
    name: 'John Singer Sargent',
    firstName: 'John',
    lastName: 'Sargent',
    profession: 'Painter',
    nationality: 'American',
    age: 33,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'dark_brown',
      eyeColor: '#5a5a5a',
      facialHair: 'full_beard',
      clothingStyle: 'formal_suit',
      hat: 'bowler'
    },
    portraitArchetype: 'artist',
    spawnWeight: 25,
    preferredBiomes: ['GALERIE', 'SALON', 'GARDEN'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'The preeminent portrait painter of the age, with keen observant eyes and an easy cosmopolitan manner.',
    historicalNote: 'Sargent exhibited in the American section and was awarded the Legion of Honor at the 1889 Exposition. He was working with Monet to purchase Manet\'s "Olympia" for France. A close friend of Henry James, who called him "the only painter of the time I would trust to paint my own portrait."',
    dialogueStyle: 'Charming, observant, speaks thoughtfully of light and character. Equally at home in English, French, and Italian.',
    knownFor: ['Portrait of Madame X', 'Society portraits', 'Impressionist landscapes', 'Legion of Honor 1889'],
    combatStats: { wit: 16, observation: 19, composure: 16 }
  },
  {
    id: 'constance_fenimore_woolson',
    name: 'Constance Fenimore Woolson',
    firstName: 'Constance',
    lastName: 'Woolson',
    profession: 'Novelist',
    nationality: 'American',
    age: 49,
    gender: 'female',
    appearance: {
      skinTone: 'fair',
      hairColor: 'dark_brown',
      eyeColor: '#5a6a5a',
      facialHair: 'none',
      clothingStyle: 'walking_dress',
      hat: 'none'
    },
    portraitArchetype: 'lady_elegant',
    spawnWeight: 20,
    preferredBiomes: ['GARDEN', 'SALON', 'GALERIE', 'TROCADERO'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'A handsome American woman of middle years, with an air of quiet intensity and a slight melancholy in her gray eyes.',
    historicalNote: 'Constance Fenimore Woolson was Henry James\'s closest female friend and fellow novelist. They called each other "Harry" and "Fenimore" and spent years living in adjacent apartments in Florence and Venice. Alice James called her Henry\'s "she-novelist." She left Villa Brichieri in July 1889 and could plausibly have passed through Paris. She died under mysterious circumstances in Venice in 1894.',
    dialogueStyle: 'Intelligent, perceptive, with an undercurrent of longing. Speaks of literature and loneliness with equal candor.',
    knownFor: ['Anne', 'East Angels', 'Jupiter Lights (1889)', 'Friendship with Henry James'],
    combatStats: { wit: 17, observation: 18, composure: 14 }
  },

  // ============ BRITISH FIGURES ============
  {
    id: 'oscar_wilde',
    name: 'Oscar Wilde',
    firstName: 'Oscar',
    lastName: 'Wilde',
    profession: 'Writer',
    nationality: 'Irish',
    age: 34,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'dark_brown',
      eyeColor: '#5a6a5a',
      facialHair: 'none',
      clothingStyle: 'formal_suit',
      hat: 'none'
    },
    portraitArchetype: 'gentleman',
    spawnWeight: 28,
    preferredBiomes: ['SALON', 'CAFE', 'GARDEN'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'The flamboyant aesthete, holding court with brilliant conversation.',
    historicalNote: 'Wilde visited Paris frequently, absorbing French culture that would influence his later works.',
    dialogueStyle: 'Brilliantly epigrammatic, paradoxical, theatrical. Every sentence quotable.',
    knownFor: ['The Picture of Dorian Gray', 'Wit', 'Aestheticism'],
    combatStats: { wit: 20, observation: 16, composure: 13 }
  },
  {
    id: 'arthur_conan_doyle',
    name: 'Arthur Conan Doyle',
    firstName: 'Arthur',
    lastName: 'Conan Doyle',
    profession: 'Writer',
    nationality: 'British',
    age: 30,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'brown',
      eyeColor: '#5a5a5a',
      facialHair: 'mustache',
      clothingStyle: 'formal_suit',
      hat: 'bowler'
    },
    portraitArchetype: 'gentleman',
    spawnWeight: 22,
    preferredBiomes: ['GRAND_HALL', 'GALERIE', 'CAFE'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'A young doctor-turned-writer with an observant, analytical gaze.',
    historicalNote: 'In 1889, Doyle had just published A Study in Scarlet introducing Sherlock Holmes.',
    dialogueStyle: 'Logical, curious, interested in the scientific exhibits. Athletic bearing.',
    knownFor: ['Sherlock Holmes', 'Medicine', 'Spiritualism'],
    combatStats: { wit: 17, observation: 18, composure: 15 }
  },

  // ============ OTHER EUROPEAN FIGURES ============
  {
    id: 'nikola_tesla',
    name: 'Nikola Tesla',
    firstName: 'Nikola',
    lastName: 'Tesla',
    profession: 'Inventor',
    nationality: 'Serbian-American',
    age: 33,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'black',
      eyeColor: '#4a5a6a',
      facialHair: 'mustache',
      clothingStyle: 'formal_suit',
      hat: 'bowler'
    },
    portraitArchetype: 'engineer',
    spawnWeight: 25,
    preferredBiomes: ['GRAND_HALL', 'GALERIE'],
    biomeMultiplier: 5,
    maxInstances: 1,
    description: 'The brilliant inventor with intense eyes, studying electrical displays.',
    historicalNote: 'Tesla visited the Exposition to study European electrical technology while developing his AC system.',
    dialogueStyle: 'Visionary, intense, speaks of electricity with almost mystical reverence.',
    knownFor: ['AC electricity', 'Tesla coil', 'Wireless transmission'],
    combatStats: { wit: 18, observation: 17, composure: 12 }
  },
  {
    id: 'theo_van_gogh',
    name: 'Theo van Gogh',
    firstName: 'Theo',
    lastName: 'van Gogh',
    profession: 'Art Dealer',
    nationality: 'Dutch',
    age: 32,
    gender: 'male',
    appearance: {
      skinTone: 'fair',
      hairColor: 'light_brown',
      eyeColor: '#5a6a5a',
      facialHair: 'mustache',
      clothingStyle: 'formal_suit',
      hat: 'bowler'
    },
    portraitArchetype: 'gentleman',
    spawnWeight: 15,
    preferredBiomes: ['GALERIE', 'CAFE', 'SALON'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'A thoughtful art dealer with a worried expression, speaking of his brother in Provence.',
    historicalNote: 'Theo managed the Boussod & Valadon gallery in Montmartre. His brother Vincent was in the Saint-Rémy asylum, painting furiously. Theo would die just months after Vincent in 1891.',
    dialogueStyle: 'Gentle, melancholic, speaks with devotion about his brother\'s genius and concern for his health.',
    knownFor: ['Supporting Vincent van Gogh', 'Championing Impressionism', 'Art dealing'],
    combatStats: { wit: 15, observation: 17, composure: 14 }
  },
  {
    id: 'edvard_grieg',
    name: 'Edvard Grieg',
    firstName: 'Edvard',
    lastName: 'Grieg',
    profession: 'Composer',
    nationality: 'Norwegian',
    age: 46,
    gender: 'male',
    appearance: {
      skinTone: 'fair',
      hairColor: 'gray',
      eyeColor: '#5a6a7a',
      facialHair: 'mustache',
      clothingStyle: 'formal_suit',
      hat: 'none'
    },
    portraitArchetype: 'gentleman',
    spawnWeight: 15,
    preferredBiomes: ['SALON', 'TROCADERO', 'CONCERT_HALL'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'The Norwegian composer, small in stature but commanding in presence.',
    historicalNote: 'Grieg visited Paris and was celebrated for his nationalist compositions.',
    dialogueStyle: 'Gentle, lyrical, speaks of Norwegian landscapes and folk music.',
    knownFor: ['Peer Gynt', 'Piano Concerto', 'Norwegian nationalism'],
    combatStats: { wit: 15, observation: 16, composure: 14 }
  },
  {
    id: 'anton_chekhov',
    name: 'Anton Chekhov',
    firstName: 'Anton',
    lastName: 'Chekhov',
    profession: 'Writer',
    nationality: 'Russian',
    age: 29,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'brown',
      eyeColor: '#5a5a5a',
      facialHair: 'goatee',
      clothingStyle: 'formal_suit',
      hat: 'none'
    },
    portraitArchetype: 'journalist',
    spawnWeight: 18,
    preferredBiomes: ['CAFE', 'GARDEN', 'SALON'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'A young Russian doctor and writer, observing humanity with gentle irony.',
    historicalNote: 'Chekhov traveled to Western Europe in 1889, shortly before writing his major plays.',
    dialogueStyle: 'Ironic, compassionate, observational. Medical precision in his observations.',
    knownFor: ['The Cherry Orchard', 'Short stories', 'Modern drama'],
    combatStats: { wit: 17, observation: 19, composure: 15 }
  },

  // ============ ASIAN AND COLONIAL FIGURES ============
  {
    id: 'prince_akihito_komatsu',
    name: 'Prince Komatsu Akihito',
    firstName: 'Akihito',
    lastName: 'Komatsu',
    profession: 'Imperial Prince',
    nationality: 'Japanese',
    age: 43,
    gender: 'male',
    appearance: {
      skinTone: 'golden',
      hairColor: 'black',
      eyeColor: '#2a2a1a',
      facialHair: 'mustache',
      clothingStyle: 'military',
      hat: 'kepi'
    },
    portraitArchetype: 'japanese_delegate',
    spawnWeight: 12,
    preferredBiomes: ['GRAND_HALL', 'VILLAGE', 'SALON'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'A Japanese prince in Western military dress, representing the Meiji modernization.',
    historicalNote: 'Japan sent an impressive delegation to showcase their rapid modernization since 1868.',
    dialogueStyle: 'Formal, dignified, speaks carefully in French. Represents Japanese modernity.',
    knownFor: ['Meiji reform', 'Military modernization', 'Diplomacy'],
    combatStats: { wit: 16, observation: 17, composure: 18 }
  },
  {
    id: 'jose_rizal',
    name: 'José Rizal',
    firstName: 'José',
    lastName: 'Rizal',
    profession: 'Writer & Physician',
    nationality: 'Filipino',
    age: 28,
    gender: 'male',
    appearance: {
      skinTone: 'golden',
      hairColor: 'black',
      eyeColor: '#3a3a2a',
      facialHair: 'none',
      clothingStyle: 'formal_suit',
      hat: 'bowler'
    },
    portraitArchetype: 'young_man',
    spawnWeight: 10,
    preferredBiomes: ['SALON', 'CAFE', 'GALERIE'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'A young Filipino intellectual, discussing colonial injustice with fellow reformers.',
    historicalNote: 'Rizal visited Paris in 1889 while in European exile, continuing his anti-colonial writings.',
    dialogueStyle: 'Eloquent, polyglot, passionate about Philippine independence.',
    knownFor: ['Noli Me Tangere', 'Philippine independence', 'Polyglot scholar'],
    combatStats: { wit: 18, observation: 16, composure: 15 }
  },

  // ============ MIDDLE EASTERN/AFRICAN FIGURES ============
  {
    id: 'ahmed_urabi',
    name: 'Ahmed Urabi',
    firstName: 'Ahmed',
    lastName: 'Urabi',
    profession: 'Egyptian Nationalist',
    nationality: 'Egyptian',
    age: 48,
    gender: 'male',
    appearance: {
      skinTone: 'tan',
      hairColor: 'black',
      eyeColor: '#3a2a1a',
      facialHair: 'full_beard',
      clothingStyle: 'exotic_male',
      hat: 'fez'
    },
    portraitArchetype: 'ottoman_official',
    spawnWeight: 8,
    preferredBiomes: ['VILLAGE', 'SALON', 'CAFE'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'The exiled Egyptian leader, discussing anti-colonial politics.',
    historicalNote: 'After the failed Urabi Revolt, he was exiled to Ceylon but his ideas spread through Egyptian expatriates.',
    dialogueStyle: 'Passionate about Egyptian independence, speaks of British injustice.',
    knownFor: ['Urabi Revolt', 'Egyptian nationalism', 'Anti-colonialism'],
    combatStats: { wit: 15, observation: 14, composure: 16 }
  },

  // ============ SCIENTISTS AND ENGINEERS ============
  {
    id: 'alexandre_dumas_fils',
    name: 'Alexandre Dumas fils',
    firstName: 'Alexandre',
    lastName: 'Dumas',
    profession: 'Playwright',
    nationality: 'French',
    age: 64,
    gender: 'male',
    appearance: {
      skinTone: 'tan',
      hairColor: 'gray',
      eyeColor: '#4a4a3a',
      facialHair: 'mustache',
      clothingStyle: 'formal_suit',
      hat: 'top_hat'
    },
    portraitArchetype: 'elderly_gentleman',
    spawnWeight: 15,
    preferredBiomes: ['SALON', 'TROCADERO', 'CAFE'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'The celebrated playwright, son of the famous novelist.',
    historicalNote: 'His father was of Afro-Caribbean descent; Dumas fils wrote La Dame aux Camélias.',
    dialogueStyle: 'Theatrical, moralistic, speaks of society and its hypocrisies.',
    knownFor: ['La Dame aux Camélias', 'Social drama', 'Literary dynasty'],
    combatStats: { wit: 17, observation: 15, composure: 16 }
  },
  {
    id: 'henri_toulouse_lautrec',
    name: 'Henri de Toulouse-Lautrec',
    firstName: 'Henri',
    lastName: 'de Toulouse-Lautrec',
    profession: 'Painter',
    nationality: 'French',
    age: 24,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'dark_brown',
      eyeColor: '#5a5a4a',
      facialHair: 'goatee',
      clothingStyle: 'bohemian',
      hat: 'bowler'
    },
    portraitArchetype: 'artist',
    spawnWeight: 20,
    preferredBiomes: ['CAFE', 'SALON', 'STREET'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'A diminutive painter with aristocratic bearing, sketching the nightlife.',
    historicalNote: 'In 1889, Toulouse-Lautrec was beginning his iconic depictions of Montmartre nightlife.',
    dialogueStyle: 'Sardonic, observant, speaks candidly despite his noble background.',
    knownFor: ['Moulin Rouge posters', 'Montmartre scenes', 'Post-Impressionism'],
    combatStats: { wit: 16, observation: 19, composure: 13 }
  },
  {
    id: 'pierre_auguste_renoir',
    name: 'Pierre-Auguste Renoir',
    firstName: 'Pierre-Auguste',
    lastName: 'Renoir',
    profession: 'Painter',
    nationality: 'French',
    age: 48,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'gray',
      eyeColor: '#5a6a5a',
      facialHair: 'full_beard',
      clothingStyle: 'bohemian',
      hat: 'beret'
    },
    portraitArchetype: 'artist',
    spawnWeight: 18,
    preferredBiomes: ['GARDEN', 'GALERIE', 'CAFE'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'The Impressionist master, hands slightly stiff but eyes full of light.',
    historicalNote: 'Renoir was developing rheumatoid arthritis but continued painting prolifically.',
    dialogueStyle: 'Warm, sensual, speaks of light and beauty. Dislikes theory.',
    knownFor: ['Impressionism', 'Dance at Le Moulin de la Galette', 'Figure painting'],
    combatStats: { wit: 14, observation: 18, composure: 15 }
  },
  {
    id: 'auguste_rodin',
    name: 'Auguste Rodin',
    firstName: 'Auguste',
    lastName: 'Rodin',
    profession: 'Sculptor',
    nationality: 'French',
    age: 48,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'gray',
      eyeColor: '#5a5a5a',
      facialHair: 'full_beard',
      clothingStyle: 'bohemian',
      hat: 'none'
    },
    portraitArchetype: 'artist',
    spawnWeight: 22,
    preferredBiomes: ['GALERIE', 'GARDEN', 'SALON'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'The great sculptor, hands powerful and expressive even in repose.',
    historicalNote: 'Rodin\'s work was controversial; The Burghers of Calais had been unveiled just four years prior.',
    dialogueStyle: 'Physical, speaks of form and movement. Intense about his work.',
    knownFor: ['The Thinker', 'The Kiss', 'Modern sculpture'],
    combatStats: { wit: 15, observation: 18, composure: 14 }
  },

  // ============ POLITICAL FIGURES ============
  {
    id: 'sadi_carnot',
    name: 'Sadi Carnot',
    firstName: 'Sadi',
    lastName: 'Carnot',
    profession: 'President of France',
    nationality: 'French',
    age: 51,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'gray',
      eyeColor: '#5a5a5a',
      facialHair: 'full_beard',
      clothingStyle: 'morning_coat',
      hat: 'top_hat'
    },
    portraitArchetype: 'diplomat',
    spawnWeight: 8,
    preferredBiomes: ['GRAND_HALL', 'TROCADERO', 'TOWER_BASE'],
    biomeMultiplier: 5,
    maxInstances: 1,
    description: 'The President of the Republic, surrounded by officials and dignitaries.',
    historicalNote: 'Carnot officially opened the Exposition and inaugurated the Eiffel Tower.',
    dialogueStyle: 'Formal, republican, speaks of French progress and unity.',
    knownFor: ['Third Republic', 'Exposition Universelle', 'Assassination (1894)'],
    combatStats: { wit: 15, observation: 14, composure: 17 }
  },
  {
    id: 'prince_of_wales',
    name: 'Albert Edward, Prince of Wales',
    firstName: 'Albert Edward',
    lastName: 'Saxe-Coburg',
    profession: 'Heir to British Throne',
    nationality: 'British',
    age: 47,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'gray',
      eyeColor: '#5a6a6a',
      facialHair: 'full_beard',
      clothingStyle: 'morning_coat',
      hat: 'top_hat'
    },
    portraitArchetype: 'aristocrat',
    spawnWeight: 10,
    preferredBiomes: ['GRAND_HALL', 'SALON', 'TOWER_BASE'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'The portly Prince of Wales, enjoying the Parisian pleasures as always.',
    historicalNote: 'The future Edward VII was a frequent Paris visitor, known for his love of French culture.',
    dialogueStyle: 'Jovial, sociable, speaks French fluently. Loves pleasure.',
    knownFor: ['Francophile', 'Future King Edward VII', 'Edwardian era'],
    combatStats: { wit: 14, observation: 13, composure: 16 }
  },

  // ============ PERFORMERS AND ENTERTAINERS ============
  {
    id: 'la_goulue',
    name: 'La Goulue',
    firstName: 'Louise',
    lastName: 'Weber',
    profession: 'Dancer',
    nationality: 'French',
    age: 23,
    gender: 'female',
    appearance: {
      skinTone: 'fair',
      hairColor: 'red',
      eyeColor: '#5a7a5a',
      facialHair: 'none',
      clothingStyle: 'bustle_dress',
      hat: 'none'
    },
    portraitArchetype: 'flapper',
    spawnWeight: 20,
    preferredBiomes: ['CAFE', 'STREET', 'SALON'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'The famous can-can dancer, bold and unapologetic.',
    historicalNote: 'La Goulue was the star of the Moulin Rouge, which opened in October 1889.',
    dialogueStyle: 'Brash, provocative, speaks with working-class Parisian slang.',
    knownFor: ['Can-can dancing', 'Moulin Rouge', 'Toulouse-Lautrec\'s muse'],
    combatStats: { wit: 13, observation: 14, composure: 12 }
  },
  {
    id: 'yvette_guilbert',
    name: 'Yvette Guilbert',
    firstName: 'Yvette',
    lastName: 'Guilbert',
    profession: 'Singer',
    nationality: 'French',
    age: 22,
    gender: 'female',
    appearance: {
      skinTone: 'pale',
      hairColor: 'red',
      eyeColor: '#5a6a5a',
      facialHair: 'none',
      clothingStyle: 'bustle_dress',
      hat: 'none'
    },
    portraitArchetype: 'flapper',
    spawnWeight: 18,
    preferredBiomes: ['CAFE', 'SALON', 'CONCERT_HALL'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'A young café-concert singer with distinctive black gloves.',
    historicalNote: 'Guilbert would become the most famous diseuse of the Belle Époque.',
    dialogueStyle: 'Witty, theatrical, speaks in clever rhymes and double-entendres.',
    knownFor: ['Café-concert', 'Black gloves', 'Toulouse-Lautrec portraits'],
    combatStats: { wit: 17, observation: 15, composure: 14 }
  },

  // ============ ADDITIONAL INTERNATIONAL FIGURES ============
  {
    id: 'pedro_ii',
    name: 'Pedro II of Brazil',
    firstName: 'Pedro',
    lastName: 'de Alcântara',
    profession: 'Former Emperor',
    nationality: 'Brazilian',
    age: 63,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'white',
      eyeColor: '#5a6a5a',
      facialHair: 'full_beard',
      clothingStyle: 'formal_suit',
      hat: 'top_hat'
    },
    portraitArchetype: 'elderly_gentleman',
    spawnWeight: 10,
    preferredBiomes: ['GRAND_HALL', 'SALON', 'GARDEN'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'The exiled Emperor of Brazil, now a private citizen and scholar.',
    historicalNote: 'Pedro II was deposed in 1889 and lived in exile in Paris until his death in 1891.',
    dialogueStyle: 'Scholarly, melancholic, speaks of science and lost empire.',
    knownFor: ['Brazilian Empire', 'Abolition of slavery', 'Scholarly pursuits'],
    combatStats: { wit: 17, observation: 16, composure: 18 }
  },
  {
    id: 'red_shirt',
    name: 'Chief Red Shirt',
    firstName: 'Ógle Lúta',
    lastName: 'Red Shirt',
    profession: 'Oglala Lakota Leader',
    nationality: 'Oglala Lakota',
    age: 42,
    gender: 'male',
    appearance: {
      skinTone: 'warm_brown',
      hairColor: 'black',
      eyeColor: '#3a2a1a',
      facialHair: 'none',
      clothingStyle: 'exotic_male',
      hat: 'none'
    },
    portraitArchetype: 'retired_general',
    spawnWeight: 12,
    preferredBiomes: ['GARDEN', 'ESPLANADE'],
    biomeMultiplier: 5,
    maxInstances: 1,
    description: 'An Oglala Lakota chief in traditional dress, observing the crowds with quiet dignity.',
    historicalNote: 'Chief Red Shirt was one of the Lakota leaders who traveled with Buffalo Bill\'s Wild West to Paris in 1889. He was photographed with Rosa Bonheur at the camp.',
    dialogueStyle: 'Speaks through an interpreter with gravity and occasional dry humor. Observes European customs with bemused interest.',
    knownFor: ['Buffalo Bill\'s Wild West', 'Oglala Lakota leadership', 'Paris 1889 tour'],
    combatStats: { wit: 15, observation: 18, composure: 18 }
  },
  {
    id: 'cleo_de_merode',
    name: 'Cléo de Mérode',
    firstName: 'Cléo',
    lastName: 'de Mérode',
    profession: 'Dancer',
    nationality: 'Belgian-French',
    age: 14,
    gender: 'female',
    appearance: {
      skinTone: 'fair',
      hairColor: 'dark_brown',
      eyeColor: '#5a5a4a',
      facialHair: 'none',
      clothingStyle: 'walking_dress',
      hat: 'bonnet'
    },
    portraitArchetype: 'debutante',
    spawnWeight: 12,
    preferredBiomes: ['SALON', 'GARDEN', 'TROCADERO'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'A young ballet dancer with distinctive coiled hairstyle.',
    historicalNote: 'At 14, Cléo was already dancing at the Paris Opera; she would become the most photographed woman of the era.',
    dialogueStyle: 'Shy, graceful, speaks softly about dance.',
    knownFor: ['Ballet', 'Beauty', 'Belle Époque icon'],
    combatStats: { wit: 12, observation: 15, composure: 16 }
  },
  {
    id: 'erik_satie',
    name: 'Erik Satie',
    firstName: 'Erik',
    lastName: 'Satie',
    profession: 'Composer',
    nationality: 'French',
    age: 23,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'brown',
      eyeColor: '#5a5a5a',
      facialHair: 'goatee',
      clothingStyle: 'bohemian',
      hat: 'bowler'
    },
    portraitArchetype: 'bohemian',
    spawnWeight: 15,
    preferredBiomes: ['CAFE', 'SALON', 'VILLAGE'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'An eccentric young composer, muttering about furniture music.',
    historicalNote: 'In 1889, Satie was playing piano at the Chat Noir cabaret, developing his unique style.',
    dialogueStyle: 'Absurdist, deadpan, speaks in non-sequiturs and musical metaphors.',
    knownFor: ['Gymnopédies', 'Avant-garde', 'Musical humor'],
    combatStats: { wit: 18, observation: 14, composure: 11 }
  },
  {
    id: 'stephane_mallarme',
    name: 'Stéphane Mallarmé',
    firstName: 'Stéphane',
    lastName: 'Mallarmé',
    profession: 'Poet',
    nationality: 'French',
    age: 47,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'gray',
      eyeColor: '#5a5a5a',
      facialHair: 'goatee',
      clothingStyle: 'formal_suit',
      hat: 'none'
    },
    portraitArchetype: 'professor',
    spawnWeight: 12,
    preferredBiomes: ['SALON', 'CAFE'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'The Symbolist master, speaking in riddles and pure poetry.',
    historicalNote: 'Mallarmé hosted famous Tuesday salons; he was the spiritual leader of Symbolism.',
    dialogueStyle: 'Elliptical, musical, speaks as if composing poetry in real-time.',
    knownFor: ['Symbolism', 'L\'Après-midi d\'un faune', 'Mardis'],
    combatStats: { wit: 19, observation: 16, composure: 15 }
  },
  {
    id: 'joris_karl_huysmans',
    name: 'Joris-Karl Huysmans',
    firstName: 'Joris-Karl',
    lastName: 'Huysmans',
    profession: 'Writer',
    nationality: 'French',
    age: 41,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'dark_brown',
      eyeColor: '#4a4a4a',
      facialHair: 'mustache',
      clothingStyle: 'formal_suit',
      hat: 'bowler'
    },
    portraitArchetype: 'gentleman',
    spawnWeight: 14,
    preferredBiomes: ['SALON', 'CAFE', 'GALERIE'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'The Decadent novelist, exuding world-weary sophistication.',
    historicalNote: 'Author of À rebours, the bible of Decadence. Converting to Catholicism around this time.',
    dialogueStyle: 'Precious, jaded, speaks of aesthetics and spiritual searching.',
    knownFor: ['À rebours', 'Decadent movement', 'Catholic conversion'],
    combatStats: { wit: 17, observation: 18, composure: 13 }
  },
  {
    id: 'octave_mirbeau',
    name: 'Octave Mirbeau',
    firstName: 'Octave',
    lastName: 'Mirbeau',
    profession: 'Writer & Critic',
    nationality: 'French',
    age: 41,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'dark_brown',
      eyeColor: '#5a5a4a',
      facialHair: 'full_beard',
      clothingStyle: 'formal_suit',
      hat: 'none'
    },
    portraitArchetype: 'journalist',
    spawnWeight: 12,
    preferredBiomes: ['CAFE', 'GALERIE', 'GARDEN'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'The anarchist critic, railing against bourgeois hypocrisy.',
    historicalNote: 'Champion of Van Gogh and Monet, Mirbeau was a fierce social critic.',
    dialogueStyle: 'Passionate, inflammatory, speaks against injustice.',
    knownFor: ['Art criticism', 'Anarchism', 'Le Jardin des supplices'],
    combatStats: { wit: 16, observation: 17, composure: 11 }
  },
  {
    id: 'odilon_redon',
    name: 'Odilon Redon',
    firstName: 'Odilon',
    lastName: 'Redon',
    profession: 'Painter',
    nationality: 'French',
    age: 49,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'gray',
      eyeColor: '#5a6a6a',
      facialHair: 'full_beard',
      clothingStyle: 'bohemian',
      hat: 'none'
    },
    portraitArchetype: 'artist',
    spawnWeight: 14,
    preferredBiomes: ['GALERIE', 'GARDEN', 'SALON'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'The Symbolist painter, seeing dreams in the daylight world.',
    historicalNote: 'Redon was creating his mysterious charcoal works and pastels.',
    dialogueStyle: 'Dreamy, mystical, speaks of the unseen and the imagined.',
    knownFor: ['Symbolism', 'Noirs', 'Visionary art'],
    combatStats: { wit: 15, observation: 19, composure: 14 }
  },
  {
    id: 'felix_feneon',
    name: 'Félix Fénéon',
    firstName: 'Félix',
    lastName: 'Fénéon',
    profession: 'Art Critic',
    nationality: 'French',
    age: 28,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'dark_brown',
      eyeColor: '#4a5a5a',
      facialHair: 'goatee',
      clothingStyle: 'formal_suit',
      hat: 'top_hat'
    },
    portraitArchetype: 'gentleman',
    spawnWeight: 10,
    preferredBiomes: ['GALERIE', 'CAFE', 'SALON'],
    biomeMultiplier: 4,
    maxInstances: 1,
    description: 'The dandified anarchist critic with an enigmatic smile.',
    historicalNote: 'Champion of Neo-Impressionism, later suspected of anarchist bombing.',
    dialogueStyle: 'Cryptic, elegant, speaks in perfectly crafted sentences.',
    knownFor: ['Neo-Impressionism', 'Anarchism', 'Nouvelles en trois lignes'],
    combatStats: { wit: 18, observation: 17, composure: 16 }
  },
  {
    id: 'berthe_morisot',
    name: 'Berthe Morisot',
    firstName: 'Berthe',
    lastName: 'Morisot',
    profession: 'Painter',
    nationality: 'French',
    age: 48,
    gender: 'female',
    appearance: {
      skinTone: 'pale',
      hairColor: 'gray',
      eyeColor: '#5a6a5a',
      facialHair: 'none',
      clothingStyle: 'bustle_dress',
      hat: 'wide_brim'
    },
    portraitArchetype: 'elderly_matron',
    spawnWeight: 15,
    preferredBiomes: ['GALERIE', 'GARDEN', 'SALON'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'The distinguished Impressionist, observing light and color.',
    historicalNote: 'Sister-in-law of Manet, Morisot was a central figure in Impressionism.',
    dialogueStyle: 'Refined, perceptive, speaks thoughtfully of art and life.',
    knownFor: ['Impressionism', 'Female perspective', 'Manet family'],
    combatStats: { wit: 16, observation: 18, composure: 17 }
  },
  {
    id: 'mary_cassatt',
    name: 'Mary Cassatt',
    firstName: 'Mary',
    lastName: 'Cassatt',
    profession: 'Painter',
    nationality: 'American',
    age: 44,
    gender: 'female',
    appearance: {
      skinTone: 'pale',
      hairColor: 'auburn',
      eyeColor: '#5a5a5a',
      facialHair: 'none',
      clothingStyle: 'bustle_dress',
      hat: 'wide_brim'
    },
    portraitArchetype: 'lady_elegant',
    spawnWeight: 16,
    preferredBiomes: ['GALERIE', 'SALON', 'GARDEN'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'The American Impressionist, studying the Japanese prints exhibit.',
    historicalNote: 'The Japanese art at the Exposition deeply influenced Cassatt\'s later work.',
    dialogueStyle: 'Direct, American frankness mixed with Parisian sophistication.',
    knownFor: ['Impressionism', 'Mother and child paintings', 'Japanese influence'],
    combatStats: { wit: 15, observation: 18, composure: 16 }
  },
  {
    id: 'liane_de_pougy',
    name: 'Liane de Pougy',
    firstName: 'Anne-Marie',
    lastName: 'Chassaigne',
    profession: 'Courtesan & Dancer',
    nationality: 'French',
    age: 20,
    gender: 'female',
    appearance: {
      skinTone: 'fair',
      hairColor: 'blonde',
      eyeColor: '#5a7a7a',
      facialHair: 'none',
      clothingStyle: 'bustle_dress',
      hat: 'wide_brim'
    },
    portraitArchetype: 'flapper',
    spawnWeight: 15,
    preferredBiomes: ['SALON', 'CAFE', 'GARDEN'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'A beautiful young woman on the cusp of notorious fame.',
    historicalNote: 'In 1889, she was just beginning her career as one of the great courtesans.',
    dialogueStyle: 'Charming, calculating, speaks with practiced allure.',
    knownFor: ['Les Grandes Horizontales', 'Belle Époque courtesan', 'Later became a nun'],
    combatStats: { wit: 16, observation: 17, composure: 15 }
  },
  {
    id: 'jean_jaures',
    name: 'Jean Jaurès',
    firstName: 'Jean',
    lastName: 'Jaurès',
    profession: 'Politician',
    nationality: 'French',
    age: 29,
    gender: 'male',
    appearance: {
      skinTone: 'tan',
      hairColor: 'dark_brown',
      eyeColor: '#5a5a4a',
      facialHair: 'full_beard',
      clothingStyle: 'formal_suit',
      hat: 'none'
    },
    portraitArchetype: 'journalist',
    spawnWeight: 12,
    preferredBiomes: ['CAFE', 'SALON', 'ESPLANADE'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'A passionate young socialist, arguing for workers\' rights.',
    historicalNote: 'In 1889, Jaurès was a rising socialist; he would become a major leader before his assassination in 1914.',
    dialogueStyle: 'Oratorical, passionate, speaks of justice and solidarity.',
    knownFor: ['Socialism', 'Pacifism', 'L\'Humanité founder'],
    combatStats: { wit: 17, observation: 15, composure: 14 }
  },
  {
    id: 'carolina_otero',
    name: 'La Belle Otero',
    firstName: 'Carolina',
    lastName: 'Otero',
    profession: 'Dancer & Courtesan',
    nationality: 'Spanish',
    age: 21,
    gender: 'female',
    appearance: {
      skinTone: 'olive',
      hairColor: 'black',
      eyeColor: '#3a3a2a',
      facialHair: 'none',
      clothingStyle: 'bustle_dress',
      hat: 'none'
    },
    portraitArchetype: 'lady_bohemian',
    spawnWeight: 18,
    preferredBiomes: ['CAFE', 'SALON', 'CONCERT_HALL'],
    biomeMultiplier: 3,
    maxInstances: 1,
    description: 'A Spanish dancer of extraordinary beauty, commanding every room.',
    historicalNote: 'La Belle Otero was beginning her legendary career as dancer and courtesan.',
    dialogueStyle: 'Fiery, seductive, speaks with Spanish passion.',
    knownFor: ['Dance', 'Famous lovers', 'Jewels'],
    combatStats: { wit: 15, observation: 16, composure: 14 }
  },
  {
    id: 'william_james',
    name: 'William James',
    firstName: 'William',
    lastName: 'James',
    profession: 'Philosopher & Psychologist',
    nationality: 'American',
    age: 47,
    gender: 'male',
    appearance: {
      skinTone: 'pale',
      hairColor: 'gray',
      eyeColor: '#5a6a5a',
      facialHair: 'full_beard',
      clothingStyle: 'formal_suit',
      hat: 'none'
    },
    portraitArchetype: 'professor',
    spawnWeight: 25,
    preferredBiomes: ['CONGRESS', 'SALON', 'CAFE'],
    biomeMultiplier: 5,
    maxInstances: 1,
    description: 'A distinguished American philosopher with kind, searching eyes and an air of perpetual curiosity.',
    historicalNote: 'William James attended the First International Congress of Psychology in Paris in August 1889, presenting on the nature of consciousness. He is Henry James\'s older brother, and the two maintained a complex but affectionate relationship throughout their lives.',
    dialogueStyle: 'Warm, intellectually playful, speaks with American directness but European sophistication. Fascinated by the varieties of human experience.',
    knownFor: ['Pragmatism', 'The Principles of Psychology', 'Varieties of Religious Experience', 'Stream of consciousness'],
    combatStats: { wit: 18, observation: 19, composure: 16 }
  }
];

// Helper function to get appearance hex colors from profile
export function getAppearanceColors(appearance: AppearanceProfile): {
  skinHex: string;
  hairHex: string;
  primaryClothingHex: string;
  secondaryClothingHex: string;
} {
  const skinHex = appearance.skinHex || SKIN_TONE_HEX[appearance.skinTone];
  const hairHex = appearance.hairHex || HAIR_COLOR_HEX[appearance.hairColor];

  // Default clothing colors based on style
  const clothingDefaults: Record<ClothingStyleType, { primary: string; secondary: string }> = {
    formal_suit: { primary: '#1a1a2e', secondary: '#2d2d2d' },
    morning_coat: { primary: '#1a1a2e', secondary: '#8b7355' },
    military: { primary: '#1e3a5a', secondary: '#d4af37' },
    working_class: { primary: '#4a3428', secondary: '#3e2723' },
    bohemian: { primary: '#4a148c', secondary: '#3e2723' },
    exotic_male: { primary: '#5a3a6a', secondary: '#d4af37' },
    bustle_dress: { primary: '#3a2a4a', secondary: '#d4af37' },
    walking_dress: { primary: '#5d4037', secondary: '#3e2723' },
    servant_dress: { primary: '#424242', secondary: '#616161' },
    exotic_female: { primary: '#8a2a6a', secondary: '#d4af37' }
  };

  const defaults = clothingDefaults[appearance.clothingStyle] || clothingDefaults.formal_suit;

  return {
    skinHex,
    hairHex,
    primaryClothingHex: appearance.primaryClothingHex || defaults.primary,
    secondaryClothingHex: appearance.secondaryClothingHex || defaults.secondary
  };
}

// Weighted random picker for historical figures based on biome
export function getHistoricalFigureSpawnChance(figure: HistoricalFigure, biome: BiomeType): number {
  const baseChance = figure.spawnWeight;
  const multiplier = figure.preferredBiomes.includes(biome) ? figure.biomeMultiplier : 1;
  return baseChance * multiplier;
}
