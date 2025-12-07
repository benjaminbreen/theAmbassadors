
// --- GAME STATES & CORE ---
export enum GameState {
  INTRO,
  EXPLORING,
  DIALOGUE,
  COMBAT,
  READING,
  ELEVATOR,
  EVENT_CHOICE,
  ASSESSMENT,
  GAME_OVER,
  MINIGAME_TELEGRAPH,
  MINIGAME_CURATOR,
  MINIGAME_FLANEUR,
  GALLERY_VIEW
}

export enum StatType {
  WIT = 'Wit',
  DECORUM = 'Decorum',
  OBSERVATION = 'Observation',
  MALAISE = 'Malaise',
  HEALTH = 'Health',
  COMPOSURE = 'Composure',
  REPUTATION = 'Reputation',
  INSPIRATION = 'Inspiration'
}

// Health status thresholds
export type HealthStatus = 'FINE' | 'TIRED' | 'UNWELL' | 'INJURED' | 'CRITICAL';
export type ComposureStatus = 'COLLECTED' | 'STEADY' | 'RATTLED' | 'FLUSTERED' | 'OVERWHELMED';

export type Mood = 'NEUTRAL' | 'ANGRY' | 'SAD' | 'SURPRISED' | 'SWEATING' | 'PANICKED' | 'WORRIED' | 'SPEAKING';

export interface AudioState {
    muted: boolean;
    volume: number;
}

// --- VISUALS & PORTRAITS ---
export type PortraitArchetype =
  // Original archetypes
  | 'mobster_m' | 'mobster_f' | 'flapper' | 'cop' | 'worker' | 'gentleman' | 'sailor' | 'pharmacist'
  | 'henry_james' | 'william_james' | 'artist' | 'aristocrat' | 'engineer' | 'bohemian'
  | 'journalist' | 'diplomat' | 'lady_elegant' | 'lady_bohemian' | 'young_man' | 'professor'
  // African/diaspora characters
  | 'african_diplomat' | 'haitian_scholar' | 'senegalese_trader' | 'caribbean_sailor'
  // Asian characters
  | 'japanese_delegate' | 'chinese_merchant' | 'indian_prince' | 'persian_merchant'
  // Middle Eastern/North African
  | 'ottoman_official' | 'egyptian_scholar'
  // Elderly characters
  | 'elderly_matron' | 'elderly_gentleman' | 'retired_general'
  // Young characters
  | 'debutante' | 'student'
  // More female archetypes
  | 'african_lady' | 'asian_lady' | 'indian_lady' | 'creole_lady'
  // Working class diversity
  | 'dock_worker' | 'chef' | 'nurse'
  // Religious
  | 'nun' | 'priest';
export type PortraitEmotion = 'neutral' | 'happy' | 'angry' | 'suspicious' | 'afraid' | 'dead' | 'injured' | 'panicked' | 'worried' | 'speaking';
export interface PortraitLayer {
    id: string;
    z: number;
    data: string[];
    color: string;
    offset: {x: number, y: number};
}

export interface PortraitConfig {
    hairStyle: 'GENTLEMAN' | 'WILD' | 'BALD';
    hairColor: string;
    skinColor: string;
    clothesColor: string;
    facialHair?: 'MOUSTACHE' | 'BEARD' | 'NONE';
    accessory?: 'MONOCLE' | 'NONE';
}

export interface RenderedCell {
    char: string;
    color: string;
    bgColor?: string;
    bold?: boolean;
    anim?: string;
}

// --- WORLD & ENTITIES ---
export type BiomeType = 'GRAND_HALL' | 'GARDEN' | 'STREET' | 'SALON' | 'TOWER_LEVEL' | 'TOWER_BASE' | 'TOWER_PLATFORM' | 'TOWER_FIRST_FLOOR' | 'ESPLANADE' | 'CONCERT_HALL' | 'SOUK' | 'GALERIE' | 'BRIDGE' | 'GATE' | 'VILLAGE' | 'TROCADERO' | 'WATERFALL' | 'AQUARIUM' | 'CAFE' | 'CONGRESS' | 'ROTUNDA' | 'PANORAMA' | 'FOUNTAIN';

export interface Zone {
  id: string;
  coordinates: { x: number, y: number }; // Global grid position
  name: string;
  description: string;
  narratorDescription?: string; // Cached LLM description
  observedImage?: string; // Cached generated image of the scene
  biome: BiomeType;
  width: number;
  height: number;
  mapData: string[]; // Array of strings representing rows
  themeColor: string;
  exits: { x: number; y: number; targetZoneId: string | null; direction: 'N'|'S'|'E'|'W' }[];
  visited: boolean;
}

export interface NPC {
  id: string;
  // Bio
  name: string;
  profession: string;
  description: string;
  goal: string; // Current desire: "Find a drink", "See the tower"
  dialogueStyle: string;
  historicalNote?: string;

  // Demographics
  age: number;
  gender: 'male' | 'female' | 'non-binary';

  // Combat Stats
  combatStats: {
    wit: number; // 1-20, affects insult damage
    observation: number; // 1-20, affects observation damage
    composure: number; // 1-20, affects defense
  };

  // State
  location: { x: number; y: number; zoneId: string; direction: 'N'|'S'|'E'|'W' };
  history: string[]; // What they've done today

  // Movement behavior
  behavior: 'wandering' | 'stationary' | 'seated' | 'exiting' | 'exhibit_viewer' | 'passerby'; // How this NPC moves
  exitDirection?: 'N' | 'S' | 'E' | 'W'; // For exiting NPCs, which edge they're heading toward
  // For exhibit_viewer behavior - pathfinding to points of interest
  targetTile?: { x: number; y: number }; // Current destination
  lingerUntil?: number; // Timestamp when they'll move to next exhibit
  visitedExhibits?: string[]; // Track which exhibits this NPC has already seen (x_y format)
  lastMoveTime?: number; // Timestamp of last movement (for animation and periodic movement)

  // Visuals
  colors: {
      hair: string;
      skin: string;
      primary: string; // Clothes
      secondary: string; // Pants/Hat
  };
  portrait: PortraitConfig;
  portraitArchetype?: PortraitArchetype; // New SVG portrait archetype
  avatarChar: string; // Fallback

  // Appearance system (links portrait and sprite visuals)
  appearance?: {
    skinTone: 'fair' | 'pale' | 'tan' | 'olive' | 'golden' | 'warm_brown' | 'dark' | 'deep';
    hairColor: 'black' | 'dark_brown' | 'brown' | 'light_brown' | 'auburn' | 'red' | 'blonde' | 'gray' | 'white' | 'bald';
    eyeColor: string;
    facialHair: 'none' | 'mustache' | 'goatee' | 'full_beard' | 'mutton_chops' | 'imperial' | 'stubble';
    clothingStyle: string;
    hat: string;
    skinHex?: string;
    hairHex?: string;
    primaryClothingHex?: string;
    secondaryClothingHex?: string;
  };

  // Historical figure tracking
  isHistoricalFigure?: boolean;
  historicalFigureId?: string;

  // Biography data
  birthplace?: {
    city: string;
    region?: string;
    country: string;
    descriptor?: string;
  };
  currentResidence?: {
    city: string;
    region?: string;
    country: string;
    descriptor?: string;
  };
  nationality?: string;

  // Relationship to Henry James (the player character)
  relationshipToHenry?: {
    type: 'family' | 'close_friend' | 'acquaintance' | 'professional' | 'admirer' | 'rival' | 'stranger';
    description: string;
    knowsHenryAs?: string;
    sharedHistory?: string;
  };
}

export interface CrowdAgent {
  id: string;
  x: number;
  y: number;
  zoneId: string;
  char: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'BOOK' | 'CURIOSITY' | 'CONSUMABLE' | 'DOCUMENT' | 'TOOL' | 'PERSONAL' | 'ART';
  content?: string; // For books
  rarity?: 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY';
  historicalNote?: string; // Educational context
  category?: string; // Grouping for UI
  acquiredAt?: number; // Timestamp for highlighting new items
  // Consumable-specific fields
  consumable?: ConsumableEffect;
  price?: number; // In francs
  emoji?: string;
}

// Effect that occurs when consuming an item
export interface ConsumableEffect {
  immediate: StatEffect[];      // Applied immediately
  delayed?: {                   // Applied after duration
    effects: StatEffect[];
    delayMinutes: number;
  };
  duration?: number;            // How long effects last (minutes)
  stackPenalty?: {              // What happens if consumed again while active
    threshold: number;          // After this many, penalty kicks in
    effects: StatEffect[];
  };
}

export interface StatEffect {
  stat: 'wit' | 'observation' | 'decorum' | 'composure' | 'malaise' | 'reputation' | 'health';
  delta: number;
}

// Active effect on the player
export interface ActiveEffect {
  id: string;
  sourceItemId: string;
  sourceName: string;
  effects: StatEffect[];
  appliedAt: number;            // Timestamp when applied
  expiresAt?: number;           // Timestamp when it expires
  delayedEffects?: {
    effects: StatEffect[];
    triggersAt: number;
  };
  stackCount: number;           // How many times this effect has been stacked
}

// --- QUEST SYSTEM ---
export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'COLLECT' | 'TALK' | 'EXPLORE' | 'SCRUTINIZE' | 'COMBAT';
  target: number; // How many needed
  progress: number; // Current progress
  reward?: string; // Description of reward
  completed: boolean;
}

// --- INTERACTION SYSTEM (PHASE 2) ---
export type InteractionType = 'NONE' | 'PONDER' | 'EAVESDROP' | 'SCRUTINIZE' | 'TALK' | 'ENTER' | 'USE_DEVICE';

export interface InteractionState {
  active: boolean;
  type: InteractionType;
  progress: number; // 0 to 100
  targetId?: string;
  resultText?: string;
  isResolving?: boolean; 
}

// --- DIALOGUE (NEW) ---
export interface ChatMessage {
    sender: 'PLAYER' | 'NPC' | 'SYSTEM';
    text: string;
    timestamp: number;
    isAction?: boolean; // e.g. "You offer the apple."
    combatPrompt?: boolean; // If true, show combat confirmation buttons
    combatReason?: string; // Reason for NPC offense
}

export interface DialogueState {
    npc: NPC;
    history: ChatMessage[];
    isTyping: boolean;
}

// --- COMBAT & CARDS (PHASE 4) ---
export type CardType = 'INSULT' | 'DEFENSE' | 'OBSERVATION';

export interface CombatCard {
  id: string;
  name: string;
  description: string;
  type: CardType;
  damage: number;
  cost: number; // Composure cost to play
  composureRequired?: number; // Minimum composure needed to use this card
}

// Exchange result for the new combat system
export interface CombatExchange {
  npcBarb: string;
  npcCardType: CardType;
  playerResponse?: string;
  playerCardType?: CardType;
  winner?: 'PLAYER' | 'NPC';
  quality?: 'excellent' | 'good' | 'weak' | 'backfire';
}

export interface CombatState {
  opponent: NPC | null;
  // Legacy HP system (kept for backwards compatibility during transition)
  playerHp: number;
  opponentHp: number;
  log: string[];
  turn: 'PLAYER' | 'OPPONENT';
  deck: CombatCard[];
  hand: CombatCard[];
  discard: CombatCard[];
  // New exchange-based system
  playerWins: number;       // Exchanges won by player (first to 2 wins)
  npcWins: number;          // Exchanges won by NPC
  currentExchange: number;  // 1, 2, or 3
  exchanges: CombatExchange[];
  phase: 'NPC_SPEAKS' | 'PLAYER_RESPONDS' | 'RESOLUTION' | 'COMPLETE';
  useLLM: boolean;          // Whether to use LLM or fallback
  knowsJames: boolean;      // Whether the NPC recognizes Henry James as a writer
}

// --- DATA & LOGS ---
export interface LogEntry {
  id: string;
  timestamp: number;
  text: string;
  type: 'NARRATIVE' | 'DIALOGUE' | 'COMBAT' | 'SYSTEM' | 'HISTORICAL_FACT' | 'VISION';
  speaker?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface GalleryImage {
  id: string;
  base64: string;
  prompt: string;
  location: string;
  timestamp: number;
}

// Record of an NPC that Henry James has conversed with
export interface MetNPC {
  id: string;
  name: string;
  profession: string;
  nationality: string;
  description: string;
  metAt: {
    zoneName: string;
    timestamp: number;
  };
  conversationHighlights?: string[]; // Key things discussed
}

export interface FactCheckResult {
  originalEvent: string;
  veracityScore: number; // 0-100
  correction: string;
  sources: { title: string; uri: string }[];
}

export interface NarratorMessage {
    id: string;
    sender: 'PLAYER' | 'DM';
    text: string;
}

export interface FlaneurLevel {
    map: string[];
    start: {x: number, y: number};
    exit: {x: number, y: number};
    enemies: {x: number, y: number, dir: 'N'|'S'|'E'|'W', type: 'BORE'}[];
}

export interface LiteraryProject {
    title: string;
    type: 'NOVEL' | 'PLAY' | 'SHORT_STORY' | 'ESSAY';
    progress: number; // 0-100
    description: string;
}

export interface MinigameState {
    active: boolean;
    score: number;
    timeLeft: number;
    difficulty: number;
    
    // Telegraph Specific
    telegraph: {
        message: string;       // "SEND MONEY"
        targetMorse: string;   // "-... ." (Full sequence for current letter/word)
        currentInput: string;  // ".." (What user typed so far for current letter)
        currentIndex: number;  // Index in message string
        history: { char: string, status: 'PENDING' | 'CORRECT' | 'WRONG' }[];
    } | null;

    // Curator specific
    curator: {
        currentItem: { name: string; description: string; tags: string[] } | null;
        queue: { name: string; description: string; tags: string[] }[];
        streak: number;
        feedback: string | null;
    } | null;

    // Flaneur specific (Stealth)
    flaneur: {
        levelIndex: number;
        playerX: number;
        playerY: number;
        enemies: {x: number, y: number, dir: 'N'|'S'|'E'|'W', id: number}[];
        grid: string[]; // Current map state
        status: 'PLAYING' | 'CAUGHT' | 'ESCAPED';
    } | null;
}

// Narration entries for end-game assessment
export interface NarrationEntry {
  id: string;
  text: string;
  timestamp: number;
  zoneId: string;
}

export interface PlayerState {
  x: number;
  y: number;
  currentZoneId: string;
  hp: number; // Legacy - now maps to health
  maxHp: number; // Legacy - now maps to maxHealth
  xp: number;
  level: number;
  inventory: Item[];
  // Sitting state
  isSitting: boolean;
  sittingOn?: string; // Name of the object being sat on (e.g., "cushion", "bench")
  stats: {
    // === CORE METERS ===
    health: number;        // 0-100, physical wellbeing, death at 0
    maxHealth: number;     // Usually 100
    composure: number;     // 0-100, "mana" for combat cards
    maxComposure: number;  // Usually 100
    malaise: number;       // 0-100, fatigue/overwhelm, game over at 100

    // === SCORE METERS ===
    reputation: number;    // Can go negative, social standing
    inspiration: number;   // 0+, literary insight, no cap

    // === SKILL STATS ===
    wit: number;           // 1-20, affects insult damage
    decorum: number;       // 1-20, affects social interactions
    observation: number;   // 1-20, affects scrutinize quality

    // === RESOURCES ===
    money: number;         // Francs

    // === LEGACY (keeping for compatibility) ===
    hp: number;
    maxHp: number;
    level: number;
    xp: number;
  };
  narrationHistory: NarrationEntry[]; // Player's narration inputs for end-game assessment
  projects: LiteraryProject[];
  clothing: {
      head: string;
      body: string;
      acc: string;
  };
  // Tracks which clothing items are currently equipped
  equippedClothing: {
      hat: boolean;
      coat: boolean;
      vest: boolean;
      trousers: boolean;
      watch: boolean;
      cane: boolean;
      pinceNez: boolean;
  };
  direction: 'N' | 'S' | 'E' | 'W';
  // Combat cards - player starts with 5 random, unlocks more through gameplay
  unlockedCards: string[]; // Card IDs that have been unlocked
  // Active consumable effects
  activeEffects: ActiveEffect[];
  // Brazier burning effect
  isOnFire: boolean;
  fireStartedAt?: number; // Timestamp when fire started
}

// --- EVENT SYSTEM ---
export type EventTriggerType =
  | 'RANDOM_ZONE'      // Can trigger randomly when entering/exploring a zone
  | 'SPECIFIC_ZONE'    // Only triggers in specific zones
  | 'OBJECT_EXAMINE'   // Triggers when examining specific object
  | 'NPC_PROXIMITY'    // Triggers near certain NPC types
  | 'TIME_BASED'       // Triggers after certain game time
  | 'STAT_THRESHOLD'   // Triggers when stat crosses threshold
  | 'IMMEDIATE';       // Triggers immediately when dispatched (breakage events, etc.)

// Event categories for color-coding the modal header
export type EventCategory =
  | 'introspective'    // Self-reflection, memory, psychological - purple/violet
  | 'social'           // Encounters with others, dialogue - gold/amber
  | 'physical'         // Health, fatigue, body - rose/red
  | 'intellectual'     // Philosophy, debate, ideas - blue/teal
  | 'aesthetic'        // Art, beauty, sensory - green/sage
  | 'mysterious';      // Strange occurrences, uncanny - deep purple

export interface EventChoice {
  id: string;
  text: string;                    // The choice text shown to player
  requiredStat?: {                 // Optional stat requirement
    stat: StatType;
    minValue: number;
  };
  outcomes: EventOutcome[];        // Possible outcomes (can have weighted random)
}

export interface EventOutcome {
  weight?: number;                 // For weighted random selection (default 1)
  description: string;             // Narrative text describing what happens
  statChanges?: {
    stat: StatType;
    change: number;                // Positive or negative
  }[];
  itemGain?: string;               // Item ID to gain
  itemLose?: string;               // Item ID to lose
  unlockEvent?: string;            // Event ID that becomes available
  triggerCombat?: string;          // NPC ID to trigger combat with
  addNarration?: string;           // Add to narration history for assessment
}

export interface GameEvent {
  id: string;
  title: string;                   // Brief title shown at top of event
  description: string;             // Narrative setup text
  category?: EventCategory;        // Optional category for color-coding modal header
  triggerType: EventTriggerType;
  triggerConditions: {
    zoneIds?: string[];            // Specific zones (if SPECIFIC_ZONE or for filtering RANDOM_ZONE)
    biomes?: BiomeType[];          // Biomes where this can occur
    objectId?: string;             // Object ID (if OBJECT_EXAMINE)
    npcProfession?: string;        // NPC profession type (if NPC_PROXIMITY)
    statType?: StatType;           // Stat to check (if STAT_THRESHOLD)
    statThreshold?: number;        // Threshold value
    minMalaise?: number;           // Minimum malaise to trigger
    maxMalaise?: number;           // Maximum malaise to trigger
    requiredItems?: string[];      // Items player must have
    excludeItems?: string[];       // Items that prevent this event
    probability?: number;          // 0-1, chance to trigger when conditions met
    cooldownMinutes?: number;      // Real-time cooldown between triggers
  };
  choices: EventChoice[];
  imagePrompt?: string;            // Optional prompt for generating event image
  image?: string;                  // Optional image filename (e.g., 'the-stammering-american.png') in public/events/
  historicalNote?: string;         // Historical context shown after event
  repeatable: boolean;             // Can this event trigger multiple times?
  priority?: number;               // Higher priority events checked first
}

export interface DiscoveredPhrase {
  phraseId: string;
  text: string;
  theme: string;
  references?: string[];
  discoveredAt: {
    zoneName: string;
    timestamp: number;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  };
}

export interface EventState {
  currentEvent: GameEvent | null;
  eventHistory: {
    eventId: string;
    choiceId: string;
    timestamp: number;
    outcomeDescription: string;
    zoneName?: string;
  }[];
  triggeredEvents: Set<string>;    // Non-repeatable events that have fired
  eventCooldowns: Map<string, number>; // Event ID -> last trigger timestamp
  discoveredPhrases: DiscoveredPhrase[]; // Jamesian phrases that have come to HJ
  dismissedEvents: Set<string>;    // Events dismissed with X/ESC - won't reappear
}
