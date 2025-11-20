
import { Zone, NPC, CombatCard, FlaneurLevel, BiomeType, LiteraryProject } from './types';

export const INITIAL_PLAYER_STATS = {
  hp: 100, // Composure
  maxHp: 100,
  wit: 10,
  decorum: 10,
  observation: 10,
  malaise: 0,
  reputation: 100,
  money: 50, // Francs
  level: 1,
  xp: 0,
};

export const GAME_CONSTANTS = {
    INTERACTION_RANGE: 1.5,
    TICK_RATE: 500, // ms for game loop ticks
    CROWD_TICK_RATE: 1500, // Faster for smoother NPC movement
    CHARGE_RATE: 2.5, // Percent per tick
    GOLD_ZONE_MIN: 60,
    GOLD_ZONE_MAX: 90,
};

export const BIOMES: BiomeType[] = ['GRAND_HALL', 'GARDEN', 'STREET', 'SALON'];

// --- HISTORICAL GEOGRAPHY OF 1889 EXPO ---
export const HISTORICAL_LAYOUT: Record<string, { name: string, biome: BiomeType, desc: string }> = {
    "0,0": { name: "The Eiffel Tower", biome: "TOWER_LEVEL", desc: "The iron giant rises above the city. The air is thin and metallic." },
    "0,1": { name: "Champ de Mars", biome: "GARDEN", desc: "The vast green expanse stretching out from the tower, filled with the noise of the crowd." },
    "0,2": { name: "Central Dome", biome: "GRAND_HALL", desc: "The ornate entrance to the main exhibition halls." },
    "0,3": { name: "Galerie des Machines", biome: "GRAND_HALL", desc: "The largest vaulted building in the world. A cathedral of steam and steel." },
    "0,-1": { name: "Pont d'Iéna", biome: "STREET", desc: "The bridge crossing the Seine, connecting the Trocadéro to the Tower." },
    "0,-2": { name: "Palais du Trocadéro", biome: "GARDEN", desc: "The grand palace on the hill, overlooking the exposition." },
    "1,0": { name: "Palais des Beaux-Arts", biome: "SALON", desc: "Halls filled with the finest paintings and sculptures of the era." },
    "-1,0": { name: "Palais des Arts Libéraux", biome: "SALON", desc: "Exhibits of instruments, maps, and the intellectual progress of man." },
    "1,1": { name: "Rue de Caire", biome: "STREET", desc: "A chaotic reconstruction of a Cairo street, complete with donkeys and merchants." },
    "-1,1": { name: "History of Habitation", biome: "STREET", desc: "A series of houses depicting the evolution of human shelter." },
    // Added specific entrance zones for random starts
    "2,2": { name: "Porte Rapp", biome: "STREET", desc: "A major entrance gate bustling with carriages and ticket sellers." },
    "-2,1": { name: "Esplanade des Invalides", biome: "GARDEN", desc: "A wide, open approach flanked by colonial exhibits." }
};

// Valid starting coordinates for procedural generation
export const START_LOCATIONS = [
    { x: 0, y: -2 }, // Trocadero
    { x: 0, y: -1 }, // Pont d'Iéna
    { x: 2, y: 2 },  // Porte Rapp
    { x: -2, y: 1 }  // Invalides
];

export const INTRO_DIALOGUE = {
    speaker: "William James",
    lines: [
        "So, Henry, we find ourselves at the foot of this... monstrosity.",
        "I intend to see the Psychology exhibit. I hear they have excellent charts on the nervous system.",
        "You, I suspect, will want to wander. Observe the 'human comedy', as you call it.",
        "Do try not to look so pained by the machinery. It is the future, after all.",
        "I shall meet you at the Hotel later. Bon courage."
    ]
};

// --- NPC GENERATION CONSTANTS ---
export const NPC_NAMES_MALE = ['Pierre', 'Jean', 'Louis', 'Charles', 'Henri', 'Jules', 'Emile', 'François', 'Gustave', 'Arthur'];
export const NPC_NAMES_FEMALE = ['Marie', 'Jeanne', 'Marguerite', 'Germaine', 'Louise', 'Suzanne', 'Marcelle', 'Yvonne', 'Madeleine', 'Alice'];
export const NPC_SURNAMES = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'];
export const NPC_PROFESSIONS = [
    'Flâneur', 'Journalist', 'Engineer', 'Artist', 'Aristocrat', 'Worker', 'Tour Guide', 'Inventor', 'Critic', 'Poet'
];
export const NPC_GOALS = [
    'Find the nearest water closet', 
    'Debate the merits of steel construction', 
    'Locate a missing glove', 
    'Avoid a creditor', 
    'Sketch the crowd', 
    'Find a good cup of coffee', 
    'Complain about the noise',
    'Admire the fountain'
];

// --- ASCII ART ASSETS (HIGH RES 28x18) ---
// Cleaned up for better readability. Using simple shapes instead of noise.
export const ASCII_PARTS = {
    BASE: [
        "                            ",
        "                            ",
        "         .--------.         ",
        "       .'          '.       ",
        "      /              \\      ",
        "     |                |     ",
        "     |                |     ",
        "     |                |     ",
        "     |                |     ",
        "     |   .        .   |     ",
        "     |  / \\      / \\  |     ",
        "      \\ \\_/      \\_/ /      ",
        "       \\            /       ",
        "        \\          /        ",
        "         |        |         ",
        "       __|________|__       ",
        "     .'              '.     ",
        "    /                  \\    "
    ],
    EYES: {
        NEUTRAL:   "       (o)      (o)     ",
        ANGRY:     "       /`\\      /`\\     ",
        SAD:       "       ( .      . )     ",
        SURPRISED: "       (O)      (O)     ",
        CLOSED:    "       (-)      (-)     ",
        WIDE:      "       (@)      (@)     "
    },
    MOUTHS: {
        NEUTRAL:     "         --------       ",
        TALK_OPEN:   "         --O--O--       ",
        TALK_CLOSED: "         --------       ",
        SMILE:       "         \\______/       ",
        FROWN:       "         /------\\       ",
        SMUG:        "         ~~----~~       "
    },
    HAIR: {
        BALD: [
            "                            ",
            "                            ",
            "         ..........         ",
            "       .            .       "
        ],
        GENTLEMAN: [
            "         __________         ",
            "       /` . . . . .`\\       ",
            "      |. . . . . . . |      ",
            "      | . .      . . |      "
        ],
        WILD: [
            "        /\\\\/\\/\\/\\\\/\\        ",
            "       |/\\/\\/\\/\\/\\/\\|       ",
            "      |/\\/\\      /\\/\\|      ",
            "      |/\\          /\\|      "
        ]
    },
    FACIAL_HAIR: {
        MOUSTACHE: "         {;;;;;;}       ",
        BEARD:     "         ########       ",
        NONE:      "                        "
    },
    ACCESSORIES: {
        MONOCLE: { char: 'O', x: 18, y: 7 },
        NONE: null
    }
};

export const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', ' ': '/'
};

export const CURATOR_ITEMS = [
    { name: "Steam-Powered Hairbrush", description: "Loud, dangerous, and unnecessary.", tags: ['VULGAR', 'MECHANICAL', 'LOUD'] },
    { name: "Hand-Bound Vellum Folio", description: "Smells of ancient oak and silence.", tags: ['SUBLIME', 'TRADITIONAL', 'QUIET'] },
    { name: "Electric Corset", description: "Guaranteed to shock the wearer into posture.", tags: ['VULGAR', 'MECHANICAL'] },
    { name: "Oil Painting of a Pear", description: "Subtle light, no movement.", tags: ['SUBLIME', 'ART'] },
    { name: "Penny Dreadful", description: "Cheap paper, lurid content.", tags: ['VULGAR', 'CHEAP'] },
    { name: "Venetian Glass Vase", description: "Fragile and utterly useless.", tags: ['SUBLIME', 'FRAGILE'] },
    { name: "Automaton Clown", description: "It laughs mechanically.", tags: ['VULGAR', 'CREEPY', 'LOUD'] },
    { name: "Silk Cravat", description: "Understated elegance.", tags: ['SUBLIME', 'FASHION'] }
];

export const FLANEUR_LEVELS: FlaneurLevel[] = [
    {
        map: [
            "##########",
            "#S.......#",
            "####.###.#",
            "#........#",
            "#.###.##.#",
            "#........#",
            "#.####.###",
            "#.......E#",
            "##########"
        ],
        start: {x: 1, y: 1},
        exit: {x: 8, y: 7},
        enemies: [{x: 5, y: 3, dir: 'S', type: 'BORE'}]
    },
    {
        map: [
            "#############",
            "#S..........#",
            "#.###.###.#.#",
            "#.#...#...#.#",
            "#.#.###.###.#",
            "#...........#",
            "#####.#######",
            "#..........E#",
            "#############"
        ],
        start: {x: 1, y: 1},
        exit: {x: 11, y: 7},
        enemies: [
            {x: 3, y: 3, dir: 'E', type: 'BORE'},
            {x: 9, y: 5, dir: 'W', type: 'BORE'}
        ]
    },
    {
        map: [
            "###############",
            "#S......#.....#",
            "###.###.#.###.#",
            "#...#.....#...#",
            "#.###.###.###.#",
            "#.....#.#.....#",
            "###.#.#.#.#.###",
            "#...#.....#..E#",
            "###############"
        ],
        start: {x: 1, y: 1},
        exit: {x: 13, y: 7},
        enemies: [
            {x: 7, y: 1, dir: 'S', type: 'BORE'},
            {x: 3, y: 5, dir: 'N', type: 'BORE'},
            {x: 11, y: 3, dir: 'W', type: 'BORE'}
        ]
    }
];

export const CARDS: Record<string, CombatCard> = {
    'snide': { 
        id: 'snide', 
        name: 'Snide Remark', 
        type: 'INSULT', 
        description: 'A comment on their hygiene or breeding.', 
        damage: 10, 
        cost: 0 
    },
    'obscure': { 
        id: 'obscure', 
        name: 'Obscure Reference', 
        type: 'OBSERVATION', 
        description: 'A reference to a minor Greek deity.', 
        damage: 15, 
        cost: 0 
    },
    'feigned': { 
        id: 'feigned', 
        name: 'Feigned Boredom', 
        type: 'DEFENSE', 
        description: 'You check your pocket watch ostentatiously.', 
        damage: 5, 
        cost: 0 
    },
    'backhanded': { 
        id: 'backhanded', 
        name: 'Backhanded Compliment', 
        type: 'INSULT', 
        description: 'Praising their effort, if not the result.', 
        damage: 12, 
        cost: 0 
    },
    'latin': { 
        id: 'latin', 
        name: 'Latin Quip', 
        type: 'OBSERVATION', 
        description: 'Quidquid latine dictum sit, altum videtur.', 
        damage: 18, 
        cost: 0 
    },
    'gaze': {
        id: 'gaze',
        name: 'The Withering Gaze',
        type: 'INSULT', 
        description: 'Silence speaks volumes.', 
        damage: 20, 
        cost: 0
    },
    'structure': {
        id: 'structure',
        name: 'Sentence Structure',
        type: 'OBSERVATION',
        description: 'Critique their grammar in real-time.',
        damage: 14,
        cost: 0
    }
};

export const STARTING_DECK = ['snide', 'snide', 'obscure', 'feigned', 'feigned', 'backhanded', 'latin'];

export const LANDMARKS: Record<string, { name: string, prompt: string }> = {
  'FOUNTAIN': {
    name: "The Coutan Fountain",
    prompt: "Impressionist oil painting of a grand illuminated fountain at the 1889 Paris Exposition, water glowing with electric light, crowds of Victorian figures in silhouette, hazy atmosphere, loose brushstrokes in the style of Monet."
  },
  'DYNAMO': {
    name: "The Edison Dynamos",
    prompt: "Impressionist oil painting of massive steam engines and electrical dynamos in a glass iron hall, industrial sublime, steam and brass, 1889 Paris Gallery of Machines, style of Caillebotte."
  },
  'TOWER': {
    name: "The Iron Lattice",
    prompt: "Impressionist painting looking up at the Eiffel Tower from the base, geometric ironwork against a cloudy sky, 1889, dizzying perspective, style of Seurat."
  }
};

export const INTRO_TEXT = `
Paris, 1889. The Universal Exposition.

You are Henry James. You are 46 years old. 

The city is a labyrinth of steel, stone, and ambition. 
The map before you is not fixed; the Fair changes with the crowds, the noise, and the light.

Explore the infinite procession.
`;

// Initial "Hero" NPC
export const INITIAL_NPCS: NPC[] = [
  {
    id: 'wilde',
    name: 'Oscar Wilde',
    profession: 'Aesthete',
    description: 'The aesthete himself, looking impeccably dressed and bored.',
    goal: 'Shock the bourgeoisie',
    historicalNote: 'Irish poet and playwright. Known for his biting wit.',
    age: 35,
    gender: 'male' as const,
    combatStats: {
      wit: 20,
      observation: 18,
      composure: 16
    },
    location: { x: 5, y: 5, zoneId: 'start', direction: 'S' },
    avatarChar: 'W',
    history: ['Drank champagne', 'Insulted a critic', 'Bought a carnation'],
    colors: {
        hair: '#372311',
        skin: '#fce3c2',
        primary: '#4a1d66', // Purple coat
        secondary: '#e8b1cd'
    },
    dialogueStyle: 'Paradoxical, flowery, cynical, obsessed with beauty.',
    portrait: {
        hairStyle: 'WILD',
        hairColor: 'text-amber-900',
        skinColor: 'text-orange-100',
        clothesColor: 'text-purple-900',
        facialHair: 'NONE',
        accessory: 'MONOCLE'
    },
    portraitArchetype: 'gentleman' as const
  }
];

// --- PROCEDURAL PLAYER GENERATION DATA ---
export const HENRY_PROJECTS: LiteraryProject[] = [
    { title: "The Tragic Muse", type: "NOVEL", progress: 45, description: "A massive novel about the conflict between art and the world. It is proving difficult." },
    { title: "The Solution", type: "SHORT_STORY", progress: 80, description: "A tale of a diplomat in Rome. Nearly complete." },
    { title: "The Pupil", type: "SHORT_STORY", progress: 10, description: "An idea about a tutor and a precocious boy. Still in notes." },
    { title: "A London Life", type: "SHORT_STORY", progress: 95, description: "A study of American morals crashing against English society." },
    { title: "Untitled Play", type: "PLAY", progress: 5, description: "An attempt to conquer the stage. The very thought causes anxiety." }
];

export const CLOTHING_DESCRIPTIONS = {
    HEAD: ["Silk Top Hat (Parisian)", "Soft Felt Homburg", "Traveler's Cap (Tweed)"],
    BODY: ["Black Frock Coat", "Charcoal Morning Coat", "Heavy Tweed Jacket"],
    ACC: ["Gold-rimmed Monocle", "Walking Stick (Ivory Handle)", "Leather Gloves (Doe-skin)"]
};

export const STARTING_INVENTORY_POOLS = {
    DOCUMENTS: [
        { name: "Letter from William", description: "Your brother writes about 'Stream of Consciousness'. It gives you a headache.", type: 'CURIOSITY' },
        { name: "Letter from Alice", description: "News from home. She is unwell, as usual.", type: 'CURIOSITY' },
        { name: "Notebook (Blue)", description: "Filled with observations about the 'vulgarity' of the tower.", type: 'BOOK' },
        { name: "Exposition Guide", description: "A map of the grounds, already crumbling.", type: 'BOOK' }
    ],
    TOOLS: [
        { name: "Opera Glasses", description: "For observing people from a safe distance.", type: 'CURIOSITY' },
        { name: "Fountain Pen", description: "Ink stains on the barrel. Reliable.", type: 'CURIOSITY' },
        { name: "Pocket Watch", description: "Gold. Runs slightly fast.", type: 'CURIOSITY' }
    ],
    MISC: [
        { name: "Dried Rose", description: "Kept in a pocket. Sentimental.", type: 'CURIOSITY' },
        { name: "Lozenge Tin", description: "For the throat.", type: 'CONSUMABLE' },
        { name: "Ticket Stub", description: "Entry to the Panorama.", type: 'CURIOSITY' }
    ]
};
