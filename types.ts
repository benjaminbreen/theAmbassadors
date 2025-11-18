
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
  MALAISE = 'Malaise'
}

export type Mood = 'NEUTRAL' | 'ANGRY' | 'SAD' | 'SURPRISED' | 'SWEATING';

export interface AudioState {
    muted: boolean;
    volume: number;
}

// --- VISUALS & PORTRAITS ---
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
export type BiomeType = 'GRAND_HALL' | 'GARDEN' | 'STREET' | 'SALON' | 'TOWER_LEVEL';

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
  
  // State
  location: { x: number; y: number; zoneId: string; direction: 'N'|'S'|'E'|'W' };
  history: string[]; // What they've done today
  
  // Visuals
  colors: {
      hair: string;
      skin: string;
      primary: string; // Clothes
      secondary: string; // Pants/Hat
  };
  portrait: PortraitConfig;
  avatarChar: string; // Fallback
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
  type: 'BOOK' | 'CURIOSITY' | 'CONSUMABLE';
  content?: string; // For books
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
    sender: 'PLAYER' | 'NPC';
    text: string;
    timestamp: number;
    isAction?: boolean; // e.g. "You offer the apple."
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
  cost: number; // Composure cost?
}

export interface CombatState {
  opponent: NPC | null;
  playerHp: number; // Composure
  opponentHp: number;
  log: string[];
  turn: 'PLAYER' | 'OPPONENT';
  deck: CombatCard[];
  hand: CombatCard[];
  discard: CombatCard[];
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

export interface PlayerState {
  x: number;
  y: number;
  currentZoneId: string;
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  inventory: Item[];
  stats: {
    hp: number;
    maxHp: number;
    wit: number;
    decorum: number;
    observation: number;
    malaise: number;
    reputation: number;
    money: number;
    level: number;
    xp: number;
  };
  projects: LiteraryProject[];
  clothing: {
      head: string;
      body: string;
      acc: string;
  };
  direction: 'N' | 'S' | 'E' | 'W';
}
