
import { Zone, NPC, CombatCard, FlaneurLevel, BiomeType, LiteraryProject } from './types';

export const INITIAL_PLAYER_STATS = {
  // === CORE METERS ===
  health: 100,
  maxHealth: 100,
  composure: 100,
  maxComposure: 100,
  malaise: 0,

  // === SCORE METERS ===
  reputation: 50,    // Start neutral, not celebrated
  inspiration: 0,    // Accumulates throughout game

  // === SKILL STATS (Henry James is observant and well-mannered, but sensitive) ===
  wit: 14,           // HJ was known for wit
  decorum: 16,       // HJ was extremely well-mannered
  observation: 18,   // HJ was a master observer

  // === RESOURCES ===
  money: 50,         // Francs

  // === LEGACY (for backward compatibility) ===
  hp: 100,
  maxHp: 100,
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
// The exposition spread across the Champ de Mars, Trocadéro, and Esplanade des Invalides
export const HISTORICAL_LAYOUT: Record<string, { name: string, biome: BiomeType, desc: string }> = {
    // ═══════════════════════════════════════════════════════════════════════════
    // THE EIFFEL TOWER (Central Axis, y: 0 and negative)
    // ═══════════════════════════════════════════════════════════════════════════
    "0,0": { name: "Base of the Eiffel Tower", biome: "TOWER_BASE", desc: "The iron colossus rises above you. Four massive pylons frame the mechanical elevator at the center." },
    "0,-4": { name: "Eiffel Tower First Floor", biome: "TOWER_FIRST_FLOOR", desc: "57 meters above Paris. The Flemish Restaurant serves champagne; Le Figaro prints its evening edition. The glass floor reveals the dizzying drop." },
    "0,-5": { name: "Eiffel Tower Second Platform", biome: "TOWER_PLATFORM", desc: "115 meters up. A precarious iron platform over the void. One misstep could be fatal. The wind howls through the lattice." },

    // ═══════════════════════════════════════════════════════════════════════════
    // PONT D'IÉNA & TROCADÉRO (North of Tower, y: -1 to -3)
    // The Seine flows between Tower and Trocadéro
    // ═══════════════════════════════════════════════════════════════════════════
    "0,-1": { name: "Pont d'Iéna", biome: "BRIDGE", desc: "The bridge spanning the Seine, choked with carriages and pedestrians moving between worlds. The dark water flows beneath." },
    "-1,-1": { name: "Trocadéro Concert Hall", biome: "CONCERT_HALL", desc: "The Moorish-style hall seats 5,000. Tonight: Rimsky-Korsakov conducts Russian music. The acoustics are legendary." },
    "1,-1": { name: "Jardin du Trocadéro (East)", biome: "GARDEN", desc: "Gravel paths wind between flowerbeds. Nannies push perambulators." },

    // Palais du Trocadéro complex
    "0,-2": { name: "Palais du Trocadéro", biome: "TROCADERO", desc: "The Moorish palace crowns the hill, its twin towers flanking the great rotunda. Below, fountains cascade toward the Seine." },
    "-1,-2": { name: "Musée d'Ethnographie", biome: "SALON", desc: "Artifacts from distant peoples arranged in scholarly order. Masks stare from every wall." },
    "1,-2": { name: "Aquarium du Trocadéro", biome: "AQUARIUM", desc: "Dark halls illuminated by glass tanks. Exotic fish from the colonies swim in eerie silence beneath the palace." },
    "-2,-2": { name: "Trocadéro West Wing", biome: "SALON", desc: "Galleries of ancient sculpture. Roman busts gaze across centuries at visitors in modern dress." },
    "2,-2": { name: "Panorama of Jerusalem", biome: "PANORAMA", desc: "A vast circular painting surrounds you completely. You stand in the center of the Holy City as pilgrims stream toward the Temple Mount, the illusion so complete that visitors forget they are in Paris." },

    // Trocadéro Gardens and Cascade
    "0,-3": { name: "Trocadéro Gardens", biome: "GARDEN", desc: "Formal gardens descending toward the Seine. The tower looms opposite, impossibly tall." },
    "-1,-3": { name: "Trocadéro Cascade", biome: "WATERFALL", desc: "Water tumbles down artificial rocks in a grand cascade. The mist is cool on your face, rainbows catching the light." },
    "1,-3": { name: "Cascade Gardens (East)", biome: "GARDEN", desc: "Manicured lawns beside the great waterfall. Visitors pose for photographers against the backdrop of falling water." },
    "-2,-3": { name: "Panorama of the Siege of Paris", biome: "PANORAMA", desc: "The terrible winter of 1870 surrounds you—Prussian cannons, starving citizens, balloon escapes over frozen rooftops. Some visitors weep at the memories." },

    // ═══════════════════════════════════════════════════════════════════════════
    // CHAMP DE MARS (South of Tower, y: 1-2)
    // The vast exhibition grounds between Tower and Galerie des Machines
    // ═══════════════════════════════════════════════════════════════════════════
    "0,1": { name: "Grand Bassin & Fountains", biome: "FOUNTAIN", desc: "Immense reflecting pools stretch toward the Galerie des Machines. Bronze sculptures of nymphs and sea-creatures rise from the spray. At night, electric lights transform the waters into liquid fire." },
    "-1,1": { name: "History of Habitation", biome: "STREET", desc: "Dwellings from prehistoric caves to Persian palaces, reconstructed in plaster and paint. Charles Garnier's walk through the ages of human shelter." },
    "1,1": { name: "Sculpture Garden", biome: "GARDEN", desc: "Marble figures in heroic poses dot the lawns. Rodin's controversial work draws crowds—some scandalized, others transfixed." },

    // Palais des Beaux-Arts & Arts Libéraux (flanking the Champ de Mars)
    "-1,0": { name: "Palais des Arts Libéraux", biome: "SALON", desc: "Maps, instruments, and the triumph of rational thought. A temple to measurement and education." },
    "1,0": { name: "Palais des Beaux-Arts", biome: "SALON", desc: "Galleries of painting and sculpture. Bouguereau's nymphs compete with Monet's haystacks for attention." },

    // Central Dome and entrance to industrial halls
    "0,2": { name: "Central Dome", biome: "GRAND_HALL", desc: "The ornate glass dome marking the entrance to the Palais des Industries. Light streams through the iron lattice." },
    "-1,2": { name: "Pavilion of Venezuela", biome: "SALON", desc: "Cacao, coffee, and orchids from the tropics. The humidity feels authentic." },
    "1,2": { name: "Machinery Annex (West)", biome: "GALERIE", desc: "American reapers and French looms. The racket is tremendous. Steam billows from a dozen engines." },

    // ═══════════════════════════════════════════════════════════════════════════
    // GALERIE DES MACHINES (y: 3-4)
    // The 420-meter iron hall - largest structure ever built
    // ═══════════════════════════════════════════════════════════════════════════
    "0,3": { name: "Galerie des Machines (Central)", biome: "GALERIE", desc: "The largest vaulted hall in the world. Steam engines thunder; dynamos hum with electric fire. The traveling crane glides overhead on rails." },
    "-1,3": { name: "Creusot Steel Works", biome: "GALERIE", desc: "A 100-ton steam hammer dominates the hall. The ground trembles with each blow. Molten metal glows orange." },
    "1,3": { name: "Edison's Electrical Exhibit", biome: "GALERIE", desc: "Incandescent bulbs by the thousand. The wizard himself is said to visit. A phonograph plays ghostly music." },
    "-2,3": { name: "Brasserie Universelle", biome: "CAFE", desc: "Beer from Bavaria, wine from Bordeaux. Workers and engineers refresh themselves amid the din." },
    "2,3": { name: "Café des Arts", biome: "CAFE", desc: "Plush chairs and small tables. Absinthe is poured with ritual precision while intellectuals debate." },

    "0,4": { name: "Galerie des Machines (East Hall)", biome: "GALERIE", desc: "Massive Corliss engines and German locomotives. The air tastes of oil and progress." },
    "-1,4": { name: "Printing & Typography Hall", biome: "GALERIE", desc: "Rotary presses thunder, typesetting machines clatter. The future of communication takes shape in lead and ink." },
    "1,4": { name: "Telephone & Telegraph Pavilion", biome: "GALERIE", desc: "Visitors speak to strangers across the hall. Wires crisscross overhead like a spider's web." },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCIENTIFIC CONGRESS HALLS (y: 5)
    // International congresses were a major feature of the 1889 Exposition
    // ═══════════════════════════════════════════════════════════════════════════
    "0,5": { name: "International Congress Hall", biome: "CONGRESS", desc: "Delegates from thirty nations gather to discuss the future of science. The air is thick with tobacco smoke and ideas." },
    "-1,5": { name: "Psychology Congress", biome: "CONGRESS", desc: "William James presides over discussions of experimental psychology. Charts of the nervous system line the walls. Instruments measure reaction times." },
    "1,5": { name: "Hygiene Congress", biome: "CONGRESS", desc: "Physicians debate sanitation and disease prevention. Models of ideal hospitals and sewers fill the displays." },

    // ═══════════════════════════════════════════════════════════════════════════
    // RUE DU CAIRE & COLONIAL EXHIBITS (East Side, x: 2-3)
    // ═══════════════════════════════════════════════════════════════════════════
    "2,0": { name: "Rue du Caire", biome: "SOUK", desc: "Baron Delort de Gléon's winding reconstruction of old Cairo—the second most popular attraction after the Tower. A 30-meter minaret rises above mashrabiya balconies. Donkey boys offer rides; belly dancers perform; merchants hawk brass from cramped stalls." },
    "2,1": { name: "Egyptian Pavilion", biome: "SALON", desc: "Hieroglyphics and mummies. The Khedive's gifts displayed under gaslight. A sphinx guards the entrance." },
    "2,2": { name: "Porte Rapp", biome: "GATE", desc: "A major entrance gate bustling with carriages, ticket sellers, and pickpockets. The wrought iron arches tower overhead." },
    "2,-1": { name: "Algerian Village", biome: "VILLAGE", desc: "A mock kasbah complete with Berber craftsmen. The smell of mint tea and tagine drifts through the narrow lanes." },

    "3,0": { name: "Tunisian Souk", biome: "SOUK", desc: "Narrow passages hung with carpets. Brass merchants hammer, spice sellers call out. The scent of incense hangs heavy." },
    "3,1": { name: "Javanese Kampong", biome: "VILLAGE", desc: "Bamboo huts and the hypnotic shimmer of gamelan music. Dancers perform the traditional legong at noon and six. A young French composer lingers near the bronze instruments, transfixed by sounds that will haunt his work for decades." },
    "3,2": { name: "Buffalo Bill's Wild West", biome: "GARDEN", desc: "Beyond the official exposition boundaries at Neuilly, the American showman has pitched his spectacular camp. Cowboys, sharpshooters, and Lakota performers enact the mythology of the frontier twice daily. Rosa Bonheur sketches the horses; all Paris is entranced." },
    "3,-1": { name: "Spice Merchant's Alley", biome: "SOUK", desc: "Pyramids of saffron, cumin, and cinnamon fill the stalls. The air burns with pepper and coriander." },
    "3,-2": { name: "Ottoman Kiosk", biome: "SALON", desc: "Turkish coffee served on brass trays. Merchants display silks from Constantinople and Damascus." },

    "4,-1": { name: "Coppersmith's Lane", biome: "SOUK", desc: "The clanging of hammers on brass fills the air. Artisans shape coffeepots, trays, and intricate lamps before your eyes." },

    // ═══════════════════════════════════════════════════════════════════════════
    // FOREIGN PAVILIONS (West Side, x: -2 to -3)
    // National exhibits along the Esplanade des Invalides
    // ═══════════════════════════════════════════════════════════════════════════
    "-2,0": { name: "Mexican Pavilion", biome: "SALON", desc: "Aztec artifacts and silver filigree. Pulque is served to the adventurous. Obsidian masks gleam darkly." },
    "-2,1": { name: "Esplanade des Invalides", biome: "ESPLANADE", desc: "A wide promenade flanked by pavilions, leading toward the gilded dome of the military hospital." },
    "-2,2": { name: "Pavilion of Argentina", biome: "SALON", desc: "Beef, leather, and the promise of the pampas. Gauchos pose for photographs in silver-studded gear." },
    "-2,-1": { name: "Ministry of War Exhibit", biome: "GRAND_HALL", desc: "Cannons and rifles displayed with pride. The next war will be fought with these weapons." },

    "-3,0": { name: "Japanese Pavilion", biome: "SALON", desc: "Delicate screens and lacquerwork. The fragrance of incense mingles with green tea. A garden of raked sand." },
    "-3,1": { name: "Chinese Pavilion", biome: "SALON", desc: "Porcelain and silk from the Celestial Empire. A mandarin in traditional dress explains the tea ceremony." },
    "-3,2": { name: "Senegalese Village", biome: "VILLAGE", desc: "Thatched huts and exhibited peoples. The ethics are questionable, the crowds enormous." },
    "-3,-1": { name: "Colonial Troops Pavilion", biome: "SALON", desc: "Uniforms and weapons from France's African campaigns. Medals gleam in glass cases." },
    "-3,-2": { name: "Hôtel des Invalides", biome: "ROTUNDA", desc: "Napoleon's tomb lies within the golden dome. The Emperor's red porphyry sarcophagus rests in the circular crypt below." },

    // ═══════════════════════════════════════════════════════════════════════════
    // ADDITIONAL ENTRANCES & PERIMETER (x: ±4)
    // Gates and boundary areas
    // ═══════════════════════════════════════════════════════════════════════════
    "4,0": { name: "Porte de la Bourdonnais", biome: "GATE", desc: "The eastern gate admits a constant stream of visitors. Ticket booths and gendarmes control the flow." },
    "4,1": { name: "Avenue de la Bourdonnais", biome: "STREET", desc: "A busy thoroughfare just outside the exposition. Cafés and hotels cater to weary visitors." },
    "-4,0": { name: "Porte de Suffren", biome: "GATE", desc: "The western entrance near the Invalides. Military officers in dress uniform pass through in groups." },
    "-4,1": { name: "Avenue de Suffren", biome: "STREET", desc: "Omnibuses discharge passengers bound for the fair. Street vendors sell guidebooks and souvenirs." },

    // ═══════════════════════════════════════════════════════════════════════════
    // SOUTH EXTENSION (y: 6) - Edge of the exposition
    // ═══════════════════════════════════════════════════════════════════════════
    "0,6": { name: "École Militaire Esplanade", biome: "ESPLANADE", desc: "The grand military academy stands at the southern terminus. Cadets drill on the parade ground." },
    "-1,6": { name: "Avenue de la Motte-Picquet", biome: "STREET", desc: "The edge of the exposition grounds. Beyond lies ordinary Paris, going about its ordinary business." },
    "1,6": { name: "Gardens of the École Militaire", biome: "GARDEN", desc: "Formal gardens before the stern façade of the military school. The fair feels distant here." }
};

// Valid starting coordinates for procedural generation
export const START_LOCATIONS = [
    { x: 0, y: -2 }, // Trocadero
    { x: 0, y: -1 }, // Pont d'Iéna
    { x: 2, y: 2 },  // Porte Rapp
    { x: -2, y: 1 }  // Invalides
];

// Legacy export for backwards compatibility
export const INTRO_DIALOGUE = {
    speaker: "William James",
    lines: [
        "So, we find ourselves at the foot of this... monstrosity.",
        "I intend to see the Psychology exhibit. I hear they have excellent charts of the nervous system.",
        "You, I suspect, will want to wander. Observe the 'human comedy.'",
        "Do try not to look so pained by the machinery. It is the future, after all.",
        "I shall meet you at the Hotel later. Bon courage, Henry."
    ]
};

// ==========================================
// OPENING SCENARIOS - Randomly selected at game start
// ==========================================

export type OpeningScenarioType = 'dialogue' | 'internal' | 'montage';

// Portrait archetypes that can be used in opening scenarios
export type OpeningPortraitArchetype =
    | 'william_james' | 'artist' | 'lady_elegant' | 'gentleman' | 'aristocrat'
    | 'journalist' | 'diplomat' | 'professor' | 'bohemian' | 'elderly_gentleman';

export interface OpeningScenario {
    id: string;
    type: OpeningScenarioType;
    title: string;
    // For dialogue type
    speaker?: string;
    speakerArchetype?: OpeningPortraitArchetype;
    historicalFigureId?: string; // If set, loads portrait from /portraits/historical/{id}.jpg
    lines?: string[];
    // For internal/montage type
    passages?: {
        text: string;
        style?: 'normal' | 'italic' | 'fragment' | 'memory' | 'pageBreak';
    }[];
    // Final button text
    exitButtonText: string;
    // Intro text shown on title screen
    titleScreenText: string;
}

export const OPENING_SCENARIOS: OpeningScenario[] = [
    // 1. WILLIAM JAMES - The original
    {
        id: 'william_james',
        type: 'dialogue',
        title: 'A Brotherly Farewell',
        speaker: 'William James',
        speakerArchetype: 'william_james',
        historicalFigureId: 'william_james',
        lines: [
            "So, Henry, we find ourselves at the foot of this... monstrosity.",
            "I intend to see the Psychology exhibit. I hear they have excellent charts of the nervous system.",
            "You, I suspect, will want to wander. Observe the 'human comedy', as you call it.",
            "Do try not to look so pained by the machinery. It is the future, after all.",
            "I shall meet you at the Hotel later. Bon courage."
        ],
        exitButtonText: 'ENTER THE FAIR',
        titleScreenText: `Paris, 1889. The Universal Exposition.

You are Henry James. You are 46 years old.

Your brother William has dragged you here—he for a psychology congress, you for reasons you cannot quite articulate. The city is a labyrinth of steel, stone, and ambition.

Explore the infinite procession.`
    },

   

    // 3. CONSTANCE FENIMORE WOOLSON - Intimate tension
    {
        id: 'woolson',
        type: 'dialogue',
        title: 'The Fellow Novelist',
        speaker: 'Constance Fenimore Woolson',
        speakerArchetype: 'lady_elegant',
        historicalFigureId: 'constance_fenimore_woolson',
        lines: [
            "Harry. I thought I might find you here, standing apart from the crowd as always.",
            "I've just come from Florence. The villa felt empty. I needed to see something new.",
            "You observe everyone so carefully, Harry. The way they move, the things they leave unsaid. It's what makes your work extraordinary.",
            "But I wonder sometimes—do you ever let yourself be observed in return? Or is the watching always one way?",
            "I shall be at the Italian pavilion if you wish to find me. But I suspect you won't. You never do seek me out. I always find you."
        ],
        exitButtonText: 'WATCH HER GO',
        titleScreenText: `Paris, 1889. The Universal Exposition.

You are Henry James. You are 46 years old.

At a bench overlooking the Trocadero, you have encountered Constance Fenimore Woolson—your closest confidante, your "she-novelist," the woman your sister calls your "flirtation." She has arrived from Florence unexpectedly.

Explore the infinite procession.`
    },

   

    // 5. THE HUNDRED FACES - Sensory montage (with page break)
    {
        id: 'hundred_faces',
        type: 'montage',
        title: 'The Hundred Faces',
        passages: [
            // PAGE ONE - the overwhelm
            { text: 'THE CROWD.', style: 'normal' },
            { text: 'It hits you like a wave—the noise, the heat, the sheer crushing density of humanity pressing toward the Tower.', style: 'normal' },
            { text: '"—the price of copper in—"', style: 'fragment' },
            { text: '"—she refused, of course, but the Count—"', style: 'fragment' },
            { text: '"—close to dying, the doctor said—"', style: 'fragment' },
            { text: 'You cannot move. The crowd flows around you like water around a stone.', style: 'italic' },
            // PAGE BREAK
            { text: '', style: 'pageBreak' },
            // PAGE TWO - the stillness
            { text: 'A child bumps your leg, vanishes. A woman\'s perfume—jasmine, like someone you once knew.', style: 'normal' },
            { text: 'This is what you came for. This is what you dread.', style: 'italic' },
            { text: 'And then, suddenly: silence.', style: 'normal' },
            { text: 'From this moment, everything begins.', style: 'italic' }
        ],
        exitButtonText: 'BEGIN OBSERVATION',
        titleScreenText: `Paris, 1889. The Universal Exposition.

You are Henry James. You are 46 years old.

You have entered the Fair and been immediately swallowed by the crowd—thousands upon thousands of faces, each one a story, each one a life you will never know. For a moment, you cannot move. Then: a pocket of stillness. A breath.

Explore the infinite procession.`
    }
];

// Helper to get a random opening scenario
export const getRandomOpeningScenario = (): OpeningScenario => {
    const index = Math.floor(Math.random() * OPENING_SCENARIOS.length);
    return OPENING_SCENARIOS[index];
};

// --- NPC GENERATION CONSTANTS ---
export const NPC_NAMES_MALE = ['Pierre', 'Jean', 'Louis', 'Charles', 'Henri', 'Jules', 'Emile', 'François', 'Gustave', 'Arthur'];
export const NPC_NAMES_FEMALE = ['Marie', 'Jeanne', 'Marguerite', 'Germaine', 'Louise', 'Suzanne', 'Marcelle', 'Yvonne', 'Madeleine', 'Alice'];
export const NPC_SURNAMES = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'];
// Historically accurate professions for 1889 Paris Exposition
// Weighted by likelihood of attendance
export const NPC_PROFESSIONS = [
    // Literary & Arts (well-represented at expositions)
    'Journalist', 'Artist', 'Critic', 'Poet', 'Novelist', 'Dramatist', 'Composer', 'Musician',

    // Professional classes
    'Engineer', 'Architect', 'Physician', 'Lawyer', 'Professor', 'Scientist', 'Photographer',

    // Upper classes
    'Aristocrat', 'Diplomat', 'Banker', 'Industrialist', 'Merchant',

    // Military (prominent at the 1889 centennial)
    'Military Officer', 'Naval Officer',

    // Working & service classes
    'Worker', 'Artisan', 'Servant', 'Governess', 'Seamstress',

    // Exhibition-specific
    'Tour Guide', 'Inventor', 'Exhibition Commissioner', 'Colonial Administrator',

    // Social types
    'Flâneur', 'Student', 'Courtesan', 'Actress', 'Dancer', 'Opera Singer',

    // Religious
    'Priest', 'Missionary',

    // Political (controversial for the centennial)
    'Anarchist', 'Socialist Organizer', 'Republican Deputy',

    // Exotic visitors (many came for the exposition)
    'Foreign Dignitary', 'Explorer', 'Collector'
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
    behavior: 'stationary' as const,
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
    BODY: ["Black Frock Coat", "Navy Morning Coat", "Heavy Tweed Jacket"],
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
