
import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { GameState, NPC, LogEntry, JournalEntry, Item, CombatState, Zone, MinigameState, AudioState, InteractionState, InteractionType, GalleryImage, CrowdAgent, CombatCard, NarratorMessage, BiomeType, PlayerState, LiteraryProject, DialogueState, ChatMessage, Quest, GameEvent, EventState, StatType, DiscoveredPhrase, MetNPC } from '../types';
import { INITIAL_PLAYER_STATS, INITIAL_NPCS, GAME_CONSTANTS, STARTING_DECK, CARDS, MORSE_CODE, CURATOR_ITEMS, FLANEUR_LEVELS, BIOMES, HENRY_PROJECTS, STARTING_INVENTORY_POOLS, CLOTHING_DESCRIPTIONS, START_LOCATIONS } from '../constants';
import { generateAssessment, generateTelegram, askNarrator, generateCuratorItem, generateZoneInfo, generateLocationNarrative, generateNpcEncounter, generateDialogue } from '../services/geminiService';
import { playSound, initAudio, startZoneMusic, stopZoneMusic } from '../services/audioService';
import { generateZone, findValidSpawnPoint } from '../services/mapGenerator';
import { generateNPC } from '../services/npcGenerator';
import { generateMinigameReward } from '../services/itemGenerator';
import { getRandomItems } from '../data/historicalItems';
import { ALL_EVENTS, PHRASE_EVENTS, getBreakageEvent } from '../data/events';
import { getUndiscoveredPhrase, JAMESIAN_PHRASES } from '../data/jamesianPhrases';

interface State {
  gameState: GameState;
  player: PlayerState;
  zones: Record<string, Zone>; // Dynamic World Graph: ID -> Zone
  zoneGrid: Record<string, string>; // "x,y" -> ZoneID for spatial persistence
  npcs: NPC[];
  crowd: CrowdAgent[];
  worldItems: Array<Item & { location: { x: number; y: number; zoneId: string } }>;
  log: LogEntry[];
  journal: JournalEntry[];
  gallery: GalleryImage[];
  combat: CombatState | null;
  dialogue: DialogueState | null;
  factCheckQueue: string | null;
  showFactCheck: boolean;
  showPlayerModal: boolean;
  minigame: MinigameState | null;
  interaction: InteractionState;
  audio: AudioState;
  settings: {
    darkMode: boolean;
    textSpeed: number;
  };
  assessment: any | null;
  shake: boolean;
  narratorLog: NarratorMessage[];
  npcCooldowns: Record<string, number>; // NPC ID -> Timestamp
  lastGlobalNarratorTrigger: number;
  introDialogueOpen: boolean;
  highlightedEntityId: string | null;
  quests: Quest[];
  apiUsage: {
    sessionCalls: number;
    sessionStart: number;
  };
  showSupportModal: boolean;
  // Elevator modal state
  showElevatorModal: boolean;
  elevatorDirection: 'up' | 'down' | 'both';
  elevatorFromLevel: 'base' | 'first' | 'platform';
  // Game over state
  gameOverCause: 'fall' | 'combat' | 'malaise' | null;
  edgeWarningShown: boolean;
  // Zone transition state
  zoneTransition: { active: boolean; zoneName: string; zoneDesc: string } | null;
  // Event system state
  eventState: {
    currentEvent: GameEvent | null;
    eventHistory: {
      eventId: string;
      choiceId: string;
      timestamp: number;
      outcomeDescription: string;
      zoneName?: string;
    }[];
    triggeredEvents: string[];  // Non-repeatable events that have fired
    eventCooldowns: Record<string, number>; // Event ID -> last trigger timestamp
    discoveredPhrases: DiscoveredPhrase[]; // Jamesian phrases that have come to HJ
  };
  // Journal modal state
  showJournal: boolean;
  // Sketchbook state
  showSketchbook: boolean;
  metNpcs: MetNPC[]; // NPCs Henry James has conversed with
  // Game time - the exposition date is May 6, 1889 opening day
  gameTime: {
    day: number;      // Day of month (6-31 for May, then June etc.)
    month: number;    // 5 = May, 6 = June, etc.
    year: number;     // 1889
    hour: number;     // 0-23
    minute: number;   // 0-59
  };
}

type Action =
  | { type: 'MOVE_PLAYER'; payload: { x: number; y: number } }
  | { type: 'CHANGE_ZONE'; payload: { targetId: string | null; direction: 'N'|'S'|'E'|'W' } }
  | { type: 'TELEPORT_TO_COORDS'; payload: { x: number; y: number } }
  | { type: 'UPDATE_ZONE_NARRATIVE'; payload: { id: string, text: string } }
  | { type: 'ADD_LOG'; payload: LogEntry }
  | { type: 'START_DIALOGUE'; payload: NPC }
  | { type: 'ADD_DIALOGUE_MSG'; payload: ChatMessage }
  | { type: 'SEND_CHAT_MESSAGE'; payload: string }
  | { type: 'OFFER_ITEM'; payload: Item }
  | { type: 'LEAVE_DIALOGUE' }
  | { type: 'SWITCH_TO_COMBAT' }
  | { type: 'START_COMBAT'; payload: NPC }
  | { type: 'PLAYER_PLAY_CARD'; payload: CombatCard }
  | { type: 'COMBAT_TURN_END' }
  | { type: 'UPDATE_COMBAT'; payload: Partial<CombatState> }
  | { type: 'END_COMBAT' }
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'REMOVE_ITEM'; payload: string } // by id
  | { type: 'PICKUP_ITEM'; payload: string } // world item id
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_FACT_CHECK'; payload: string }
  | { type: 'CLOSE_FACT_CHECK' }
  | { type: 'OPEN_PLAYER_MODAL' }
  | { type: 'CLOSE_PLAYER_MODAL' }
  | { type: 'START_GAME' }
  | { type: 'CLOSE_INTRO' }
  | { type: 'SET_ASSESSMENT'; payload: any }
  | { type: 'SHOW_ELEVATOR_MODAL'; payload: { direction: 'up' | 'down' | 'both'; fromLevel?: 'base' | 'first' | 'platform' } }
  | { type: 'HIDE_ELEVATOR_MODAL' }
  | { type: 'START_ELEVATOR_RIDE' }
  | { type: 'ELEVATOR_ARRIVE' }
  | { type: 'TRIGGER_ELEVATOR' }
  | { type: 'PLAYER_FALL' }
  | { type: 'SHOW_EDGE_WARNING' }
  | { type: 'RESET_GAME' }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'START_MINIGAME'; payload: { type: GameState, message?: string } }
  | { type: 'UPDATE_MINIGAME'; payload: Partial<MinigameState> }
  | { type: 'TELEGRAPH_INPUT'; payload: '.' | '-' }
  | { type: 'CURATOR_INPUT'; payload: 'LEFT' | 'RIGHT' }
  | { type: 'ADD_CURATOR_ITEM'; payload: {name: string, description: string, tags: string[]} }
  | { type: 'FLANEUR_MOVE'; payload: { x: number; y: number } }
  | { type: 'END_MINIGAME' }
  | { type: 'TRIGGER_SHAKE' }
  | { type: 'CLEAR_SHAKE' }
  | { type: 'INTERACTION_START'; payload: InteractionType }
  | { type: 'INTERACTION_TICK' }
  | { type: 'INTERACTION_RESOLVE'; payload: string }
  | { type: 'INTERACTION_RESET' }
  | { type: 'CROWD_TICK' }
  | { type: 'ADD_GALLERY_IMAGE'; payload: GalleryImage }
  | { type: 'OPEN_GALLERY' }
  | { type: 'CLOSE_GALLERY' }
  | { type: 'ADD_NARRATOR_MSG'; payload: NarratorMessage }
  | { type: 'POPULATE_ZONE'; payload: string }
  | { type: 'TRIGGER_GLOBAL_COOLDOWN' }
  | { type: 'TRIGGER_NPC_NARRATIVE'; payload: { id: string, text: string } }
  | { type: 'HIGHLIGHT_ENTITY'; payload: string | null }
  | { type: 'CACHE_OBSERVATION'; payload: { zoneId: string, image: string } }
  | { type: 'UPDATE_QUEST_PROGRESS'; payload: { questId: string, increment: number } }
  | { type: 'SAVE_GAME' }
  | { type: 'LOAD_GAME'; payload: Partial<State> }
  | { type: 'INCREMENT_API_USAGE' }
  | { type: 'CLOSE_SUPPORT_MODAL' }
  | { type: 'START_ZONE_TRANSITION'; payload: { zoneName: string; zoneDesc: string } }
  | { type: 'END_ZONE_TRANSITION' }
  | { type: 'ADJUST_STAT'; payload: { stat: keyof State['player']['stats']; delta: number } }
  | { type: 'USE_ITEM_FOR_RELIEF'; payload: string }
  | { type: 'MALAISE_TICK' }
  | { type: 'GAIN_INSPIRATION'; payload: { amount: number; source: string } }
  | { type: 'ADJUST_COMPOSURE'; payload: number }
  | { type: 'ADJUST_HEALTH'; payload: number }
  | { type: 'ADD_NARRATION'; payload: string }
  | { type: 'STAT_TICK' } // Called periodically for passive stat changes
  // Event system actions
  | { type: 'TRIGGER_EVENT'; payload: GameEvent }
  | { type: 'CLOSE_EVENT' }
  | { type: 'DISMISS_EVENT'; payload: { eventId: string } } // Event dismissed without choosing - won't reappear
  | { type: 'RECORD_EVENT'; payload: { eventId: string; choiceId: string; outcomeDescription: string; zoneName?: string } }
  | { type: 'CHECK_RANDOM_EVENT' } // Check if a random event should trigger
  | { type: 'TRIGGER_BREAKAGE_EVENT'; payload: { objectType: 'statue' | 'display' } } // Trigger breakage moral dilemma
  | { type: 'DISCOVER_PHRASE'; payload: DiscoveredPhrase }
  | { type: 'CHECK_PHRASE_EVENT' } // Check if a phrase should come to HJ
  | { type: 'OPEN_JOURNAL' }
  | { type: 'CLOSE_JOURNAL' }
  | { type: 'OPEN_SKETCHBOOK' }
  | { type: 'CLOSE_SKETCHBOOK' }
  | { type: 'RECORD_MET_NPC'; payload: MetNPC }
  | { type: 'ADVANCE_TIME'; payload: number }; // Advance time by N minutes

// Helper: Pick Random
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const shuffle = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

// Generate Initial State Procedurally
const startLoc = pick(START_LOCATIONS);
const startZoneId = `zone_${startLoc.x}_${startLoc.y}`;
const startZone = generateZone(startZoneId, startLoc.x, startLoc.y);
const gridInit: Record<string, string> = {};
gridInit[`${startLoc.x},${startLoc.y}`] = startZoneId;

// Find valid spawn point (not in fountains, water, etc.)
const initialSpawn = findValidSpawnPoint(
    startZone.mapData,
    Math.floor(startZone.width / 2),
    Math.floor(startZone.height / 2),
    startZone.width,
    startZone.height
);

const initialInventory: Item[] = getRandomItems(3);

// Randomize 2-3 projects
const initialProjects = shuffle(HENRY_PROJECTS).slice(0, Math.floor(Math.random() * 2) + 2);

// Initial Quests
const INITIAL_QUESTS: Quest[] = [
    {
        id: 'gather-impressions',
        title: 'Gather Material for The Ambassadors',
        description: 'Collect 10 items of cultural significance from the Exhibition',
        type: 'COLLECT',
        target: 10,
        progress: 0,
        reward: '+20 Wit',
        completed: false
    },
    {
        id: 'interview-professions',
        title: 'Study the Modern World',
        description: 'Converse with 5 people of different professions',
        type: 'TALK',
        target: 5,
        progress: 0,
        reward: 'Unlock new dialogue options',
        completed: false
    },
    {
        id: 'scrutinize-landmarks',
        title: 'Catalogue the Vulgar and Sublime',
        description: 'Successfully scrutinize 3 major landmarks',
        type: 'SCRUTINIZE',
        target: 3,
        progress: 0,
        reward: 'Gallery showcase unlocked',
        completed: false
    }
];

const initialState: State = {
  gameState: GameState.INTRO,
  player: {
    x: initialSpawn.x,
    y: initialSpawn.y,
    currentZoneId: startZoneId,
    hp: 100,
    maxHp: 100,
    xp: 0,
    level: 1,
    inventory: initialInventory,
    stats: INITIAL_PLAYER_STATS,
    narrationHistory: [], // Track player's narrative inputs for end-game assessment
    direction: 'S',
    projects: initialProjects,
    clothing: {
        head: pick(CLOTHING_DESCRIPTIONS.HEAD),
        body: pick(CLOTHING_DESCRIPTIONS.BODY),
        acc: pick(CLOTHING_DESCRIPTIONS.ACC)
    }
  },
  zones: { [startZoneId]: startZone },
  zoneGrid: gridInit,
  npcs: INITIAL_NPCS,
  crowd: [],
  worldItems: [],
  log: [],
  journal: [],
  gallery: [],
  combat: null,
  dialogue: null,
  factCheckQueue: null,
  showFactCheck: false,
  showPlayerModal: false,
  minigame: null,
  interaction: { active: false, type: 'NONE', progress: 0 },
  audio: { muted: false, volume: 0.5 },
  settings: {
    darkMode: false,
    textSpeed: 50,
  },
  assessment: null,
  shake: false,
  narratorLog: [],
  npcCooldowns: {},
  lastGlobalNarratorTrigger: 0,
  introDialogueOpen: true,
  highlightedEntityId: null,
  quests: INITIAL_QUESTS,
  apiUsage: {
    sessionCalls: 0,
    sessionStart: Date.now()
  },
  showSupportModal: false,
  showElevatorModal: false,
  elevatorDirection: 'up',
  elevatorFromLevel: 'base',
  gameOverCause: null,
  edgeWarningShown: false,
  zoneTransition: null,
  eventState: {
    currentEvent: null,
    eventHistory: [],
    triggeredEvents: [],
    eventCooldowns: {},
    discoveredPhrases: [],
    dismissedEvents: []
  },
  showJournal: false,
  showSketchbook: false,
  metNpcs: [],
  // Game starts on August 5, 1889 - opening of the Congress of Physiological Psychology
  // William James was a guest of honor at this congress, held as an adjunct to the World's Fair
  gameTime: {
    day: 5,
    month: 8,
    year: 1889,
    hour: 10,
    minute: 0
  }
};

const GameContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

const gameReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'START_GAME':
      if(!state.audio.muted) initAudio();
      return { ...state, gameState: GameState.EXPLORING };
    
    case 'CLOSE_INTRO':
      return { ...state, introDialogueOpen: false };

    case 'MOVE_PLAYER':
      if(!state.audio.muted) playSound('FOOTSTEP');
      let newDir = state.player.direction;
      if (action.payload.x > state.player.x) newDir = 'E';
      else if (action.payload.x < state.player.x) newDir = 'W';
      else if (action.payload.y > state.player.y) newDir = 'S';
      else if (action.payload.y < state.player.y) newDir = 'N';

      return {
        ...state,
        player: { 
            ...state.player, 
            x: action.payload.x, 
            y: action.payload.y,
            direction: newDir
        },
        highlightedEntityId: null // Clear highlight on move
      };
    
    case 'TELEPORT_TO_COORDS':
        // Direct teleport to specific grid coordinates
        const teleportKey = `${action.payload.x},${action.payload.y}`;
        let teleportZoneId = state.zoneGrid[teleportKey];

        const teleportZonesUpdate = { ...state.zones };
        const teleportGridUpdate = { ...state.zoneGrid };

        if (!teleportZoneId) {
            teleportZoneId = `zone_${action.payload.x}_${action.payload.y}`;
            const newTeleportZone = generateZone(teleportZoneId, action.payload.x, action.payload.y);
            teleportZonesUpdate[teleportZoneId] = newTeleportZone;
            teleportGridUpdate[teleportKey] = teleportZoneId;
        }

        const teleportZone = teleportZonesUpdate[teleportZoneId];
        const teleportSpawnX = Math.floor(teleportZone.width / 2);
        const teleportSpawnY = Math.floor(teleportZone.height / 2);

        return {
            ...state,
            zones: teleportZonesUpdate,
            zoneGrid: teleportGridUpdate,
            player: { ...state.player, currentZoneId: teleportZoneId, x: teleportSpawnX, y: teleportSpawnY },
            log: [...state.log, { id: Date.now().toString(), type: 'NARRATIVE', text: `You arrive at ${teleportZone.name}...`, timestamp: Date.now() }],
            highlightedEntityId: null
        };

    case 'CHANGE_ZONE':
        // Determine new coordinates
        const currentZ = state.zones[state.player.currentZoneId];
        let newGX = currentZ.coordinates.x;
        let newGY = currentZ.coordinates.y;

        if (action.payload.direction === 'N') newGY -= 1;
        if (action.payload.direction === 'S') newGY += 1;
        if (action.payload.direction === 'E') newGX += 1;
        if (action.payload.direction === 'W') newGX -= 1;

        const gridKey = `${newGX},${newGY}`;
        let targetId = state.zoneGrid[gridKey];

        const zonesUpdate = { ...state.zones };
        const gridUpdate = { ...state.zoneGrid };

        if (!targetId) {
            targetId = `zone_${newGX}_${newGY}`;
            const newZone = generateZone(targetId, newGX, newGY);
            zonesUpdate[targetId] = newZone;
            gridUpdate[gridKey] = targetId;
        }

        const nextZone = zonesUpdate[targetId];
        // Calculate intended spawn position based on entry direction
        let targetX = 2, targetY = 2;
        if (action.payload.direction === 'N') { targetX = Math.floor(nextZone.width/2); targetY = nextZone.height - 2; }
        if (action.payload.direction === 'S') { targetX = Math.floor(nextZone.width/2); targetY = 1; }
        if (action.payload.direction === 'E') { targetX = 1; targetY = Math.floor(nextZone.height/2); }
        if (action.payload.direction === 'W') { targetX = nextZone.width - 2; targetY = Math.floor(nextZone.height/2); }

        // Find a valid walkable spawn point near the target
        const validSpawn = findValidSpawnPoint(nextZone.mapData, targetX, targetY, nextZone.width, nextZone.height);
        const spawnX = validSpawn.x;
        const spawnY = validSpawn.y;

        // Advance time by 5 minutes when changing zones
        const newTime = { ...state.gameTime };
        newTime.minute += 5;
        if (newTime.minute >= 60) {
            newTime.minute -= 60;
            newTime.hour++;
            if (newTime.hour >= 24) {
                newTime.hour = 0;
                newTime.day++;
            }
        }

        return {
            ...state,
            zones: zonesUpdate,
            zoneGrid: gridUpdate,
            player: { ...state.player, currentZoneId: targetId, x: spawnX, y: spawnY },
            log: [...state.log, { id: Date.now().toString(), type: 'NARRATIVE', text: `You enter ${nextZone.name}...`, timestamp: Date.now() }],
            highlightedEntityId: null,
            zoneTransition: {
                active: true,
                zoneName: nextZone.name,
                zoneDesc: nextZone.description || 'A new area of the exposition awaits...'
            },
            gameTime: newTime
        };
    
    case 'POPULATE_ZONE':
        const zId = action.payload;
        const z = state.zones[zId];
        const existingPop = state.npcs.filter(n => n.location.zoneId === zId);
        if (existingPop.length > 0) return state;

        const newNpcs: NPC[] = [];
        const count = Math.floor(Math.random() * 4) + 3;
        // Valid NPC spawn tiles - walkable terrain excluding fountains, water, and obstacles
        const npcSpawnTiles = new Set(['.', ':', 'g', 'v', '`', ',', 'o', ' ']);
        // Tiles NPCs should never spawn on (fountains, water, furniture, etc.)
        const npcBlockedTiles = new Set([
            'F', 'f', '~', 'W', '≈', '⌂', '♦', '«', '»', '≥', '≤', '╔', '╗', '╚', '╝', // Fountains and water
            'T', 'H', 'q', '%', '@', 'h', // Trees, hedges, plants, huts
            '#', 'P', 'c', 'u', 'M', 'D', 'S', 'R', 'Y', 'k', 'X', // Walls, columns, machinery
            'V', '|', '^' // Void, waterfalls, rocks
        ]);

        for(let i=0; i<count; i++) {
            let px=1, py=1;
            let valid = false;
            let attempts = 0;
            while(!valid && attempts < 30) {
                px = Math.floor(Math.random() * (z.width - 2)) + 1; // Avoid edges
                py = Math.floor(Math.random() * (z.height - 2)) + 1;
                const char = z.mapData[py]?.[px];
                // Valid if on spawn tile and not blocked
                if (char && npcSpawnTiles.has(char) && !npcBlockedTiles.has(char)) {
                    // Also check NPC doesn't overlap existing NPC
                    if (!newNpcs.find(n => n.location.x === px && n.location.y === py)) {
                        valid = true;
                    }
                }
                attempts++;
            }
            if(valid) {
                newNpcs.push(generateNPC(zId, px, py));
            }
        }

        // Spawn world items (2-5 per zone)
        const newWorldItems: Array<Item & { location: { x: number; y: number; zoneId: string } }> = [];
        const itemCount = Math.floor(Math.random() * 4) + 2;
        // Valid item spawn tiles
        const itemSpawnTiles = new Set(['.', ':', 'g', 'v', '`', ',', 'o', ' ', 'r', 'b']);
        for(let i=0; i<itemCount; i++) {
            let px=1, py=1;
            let valid = false;
            let attempts = 0;
            while(!valid && attempts < 30) {
                px = Math.floor(Math.random() * (z.width - 2)) + 1;
                py = Math.floor(Math.random() * (z.height - 2)) + 1;
                const char = z.mapData[py]?.[px];
                // Place on walkable terrain, not where NPCs are, not in fountains
                if (char && itemSpawnTiles.has(char) && !npcBlockedTiles.has(char) && !newNpcs.find(n => n.location.x === px && n.location.y === py)) {
                    valid = true;
                }
                attempts++;
            }
            if(valid) {
                const items = getRandomItems(1);
                if (items.length > 0) {
                    newWorldItems.push({
                        ...items[0],
                        location: { x: px, y: py, zoneId: zId }
                    });
                }
            }
        }

        return { ...state, npcs: [...state.npcs, ...newNpcs], worldItems: [...state.worldItems, ...newWorldItems] };

    case 'UPDATE_ZONE_NARRATIVE':
        return {
            ...state,
            zones: {
                ...state.zones,
                [action.payload.id]: {
                    ...state.zones[action.payload.id],
                    narratorDescription: action.payload.text,
                    visited: true
                }
            },
            narratorLog: [...state.narratorLog, { id: Date.now().toString(), sender: 'DM', text: action.payload.text }],
            lastGlobalNarratorTrigger: Date.now()
        };

    case 'ADD_LOG':
      if(!state.audio.muted) playSound('TYPEWRITER');
      return { ...state, log: [...state.log, action.payload] };

    case 'START_DIALOGUE':
        // Update TALK quest progress (track unique professions talked to)
        const talkQuests = state.quests.map(q => {
            if (q.type === 'TALK' && !q.completed) {
                // Simple increment for now - could track unique professions
                const newProgress = Math.min(q.progress + 1, q.target);
                return { ...q, progress: newProgress, completed: newProgress >= q.target };
            }
            return q;
        });

        // Record this NPC as met (if not already)
        const dialogueNpc = action.payload;
        const dialogueZone = state.zones[state.player.currentZoneId];
        const alreadyMet = state.metNpcs.some(n => n.id === dialogueNpc.id);
        const newMetNpc: MetNPC | null = alreadyMet ? null : {
            id: dialogueNpc.id,
            name: dialogueNpc.name,
            profession: dialogueNpc.profession,
            nationality: dialogueNpc.nationality || 'Unknown',
            description: dialogueNpc.description,
            metAt: {
                zoneName: dialogueZone?.name || 'Unknown',
                timestamp: Date.now()
            }
        };

        return {
            ...state,
            gameState: GameState.DIALOGUE,
            dialogue: {
                npc: action.payload,
                history: [],
                isTyping: true
            },
            quests: talkQuests,
            metNpcs: newMetNpc ? [...state.metNpcs, newMetNpc] : state.metNpcs
        };
    
    case 'ADD_DIALOGUE_MSG':
        if (!state.dialogue) return state;
        if (!state.audio.muted && action.payload.sender === 'NPC') playSound('TYPEWRITER');
        return {
            ...state,
            dialogue: {
                ...state.dialogue,
                history: [...state.dialogue.history, action.payload],
                isTyping: false
            }
        };

    case 'SEND_CHAT_MESSAGE':
        if (!state.dialogue) return state;
        if (!state.audio.muted) playSound('BLIP');
        return {
            ...state,
            dialogue: {
                ...state.dialogue,
                history: [...state.dialogue.history, { sender: 'PLAYER', text: action.payload, timestamp: Date.now() }],
                isTyping: true
            }
        };

    case 'OFFER_ITEM':
        if (!state.dialogue) return state;
        const item = action.payload;
        const newInv = state.player.inventory.filter(i => i.id !== item.id);
        const offerText = `I offer you my ${item.name}: ${item.description}`;

        return {
            ...state,
            player: { ...state.player, inventory: newInv },
            dialogue: {
                ...state.dialogue,
                history: [...state.dialogue.history,
                    { sender: 'PLAYER', text: `You offer the ${item.name}.`, timestamp: Date.now(), isAction: true },
                    { sender: 'PLAYER', text: offerText, timestamp: Date.now() }
                ],
                isTyping: true
            }
        };

    case 'ADD_ITEM':
        if (!state.audio.muted) playSound('BLIP');
        return {
            ...state,
            player: {
                ...state.player,
                inventory: [...state.player.inventory, { ...action.payload, acquiredAt: Date.now() }]
            }
        };

    case 'REMOVE_ITEM':
        return {
            ...state,
            player: {
                ...state.player,
                inventory: state.player.inventory.filter(i => i.id !== action.payload)
            }
        };

    case 'PICKUP_ITEM':
        const itemToPickup = state.worldItems.find(item => item.id === action.payload);
        if (!itemToPickup) return state;

        if (!state.audio.muted) playSound('BLIP');

        // Update quest progress for COLLECT type quests
        const updatedQuests = state.quests.map(q => {
            if (q.type === 'COLLECT' && !q.completed) {
                const newProgress = Math.min(q.progress + 1, q.target);
                return { ...q, progress: newProgress, completed: newProgress >= q.target };
            }
            return q;
        });

        return {
            ...state,
            worldItems: state.worldItems.filter(item => item.id !== action.payload),
            player: {
                ...state.player,
                inventory: [...state.player.inventory, { ...itemToPickup, acquiredAt: Date.now() }]
            },
            quests: updatedQuests
        };

    case 'LEAVE_DIALOGUE': {
        // Conversations take 10-20 minutes depending on length
        const conversationLength = state.dialogue?.history.length || 0;
        const timeSpent = Math.min(20, 10 + conversationLength * 2);
        const dialogueTime = { ...state.gameTime };
        dialogueTime.minute += timeSpent;
        while (dialogueTime.minute >= 60) {
            dialogueTime.minute -= 60;
            dialogueTime.hour++;
            if (dialogueTime.hour >= 24) {
                dialogueTime.hour = 0;
                dialogueTime.day++;
            }
        }
        return { ...state, gameState: GameState.EXPLORING, dialogue: null, gameTime: dialogueTime };
    }

    case 'SWITCH_TO_COMBAT':
        if (!state.dialogue) return state;
        const opponent = state.dialogue.npc;
        const fullDeck = STARTING_DECK.map(id => CARDS[id]).filter(c => c);
        const shuffledDeck = shuffle(fullDeck);
        const initialHand = shuffledDeck.slice(0, 3);
        const remainingDeck = shuffledDeck.slice(3);

        return {
            ...state,
            gameState: GameState.COMBAT,
            dialogue: null,
            combat: {
                opponent,
                playerHp: state.player.hp,
                opponentHp: 100,
                log: [`You engage ${opponent.name} in a battle of wits!`],
                turn: 'PLAYER',
                deck: remainingDeck,
                hand: initialHand,
                discard: []
            }
        };

    case 'START_COMBAT':
      const deck = STARTING_DECK.map(id => CARDS[id]).filter(c => c);
      const sDeck = shuffle(deck);
      return { 
        ...state, 
        gameState: GameState.COMBAT,
        combat: {
          opponent: action.payload,
          playerHp: state.player.hp,
          opponentHp: 100,
          log: [`You engage ${action.payload.name} in a battle of wits!`],
          turn: 'PLAYER',
          deck: sDeck.slice(3),
          hand: sDeck.slice(0, 3),
          discard: []
        }
      };
      
    case 'PLAYER_PLAY_CARD':
        if (!state.combat) return state;
        const card = action.payload;
        const idx = state.combat.hand.findIndex(c => c.id === card.id);
        const safeHand = [...state.combat.hand];
        if (idx > -1) safeHand.splice(idx, 1);

        return {
            ...state,
            combat: {
                ...state.combat,
                hand: safeHand,
                discard: [...state.combat.discard, card],
                turn: 'OPPONENT' 
            }
        };
        
    case 'COMBAT_TURN_END':
        if (!state.combat) return state;
        let currentDeck = [...state.combat.deck];
        let currentDiscard = [...state.combat.discard];
        
        if (currentDeck.length === 0 && currentDiscard.length > 0) {
            currentDeck = shuffle(currentDiscard);
            currentDiscard = [];
        }
        
        let drawnCard: CombatCard | undefined = undefined;
        if (currentDeck.length > 0) {
            drawnCard = currentDeck.pop();
        }
        
        return {
            ...state,
            combat: {
                ...state.combat,
                turn: 'PLAYER',
                deck: currentDeck,
                discard: currentDiscard,
                hand: drawnCard ? [...state.combat.hand, drawnCard] : state.combat.hand
            }
        };

    case 'UPDATE_COMBAT':
      if (!state.combat) return state;
      return { ...state, combat: { ...state.combat, ...action.payload } };
    case 'END_COMBAT':
      return { ...state, gameState: GameState.EXPLORING, combat: null };
      
    case 'TOGGLE_THEME':
      return { ...state, settings: { ...state.settings, darkMode: !state.settings.darkMode } };
    case 'SET_FACT_CHECK':
      return { ...state, factCheckQueue: action.payload, showFactCheck: true };
    case 'CLOSE_FACT_CHECK':
        return { ...state, showFactCheck: false };
    case 'OPEN_PLAYER_MODAL':
        return { ...state, showPlayerModal: true };
    case 'CLOSE_PLAYER_MODAL':
        return { ...state, showPlayerModal: false };
    case 'SHOW_ELEVATOR_MODAL':
        return {
            ...state,
            showElevatorModal: true,
            elevatorDirection: action.payload.direction,
            elevatorFromLevel: action.payload.fromLevel || 'base',
            gameState: GameState.ELEVATOR
        };

    case 'HIDE_ELEVATOR_MODAL':
        return {
            ...state,
            showElevatorModal: false,
            gameState: GameState.EXPLORING
        };

    case 'START_ELEVATOR_RIDE':
        if(!state.audio.muted) playSound('ELEVATOR');
        return { ...state, gameState: GameState.ELEVATOR };

    case 'TRIGGER_ELEVATOR':
        // Legacy support - now shows modal instead
        return {
            ...state,
            showElevatorModal: true,
            elevatorDirection: 'up',
            gameState: GameState.ELEVATOR
        };

    case 'ELEVATOR_ARRIVE':
        // Tower coordinates: Base (0,0), First Floor (0,-4), Platform (0,-5)
        // Using the HISTORICAL_LAYOUT coordinates
        const getOrCreateTowerZone = (coordKey: string, gx: number, gy: number) => {
            let zoneId = state.zoneGrid[coordKey];
            if (zoneId && state.zones[zoneId]) {
                return { zoneId, zone: state.zones[zoneId], newZones: state.zones, newGrid: state.zoneGrid };
            }
            // Generate new zone
            zoneId = `tower_zone_${gx}_${gy}_${Date.now()}`;
            const zone = generateZone(zoneId, gx, gy);
            return {
                zoneId,
                zone,
                newZones: { ...state.zones, [zoneId]: zone },
                newGrid: { ...state.zoneGrid, [coordKey]: zoneId }
            };
        };

        let targetCoords: { key: string; gx: number; gy: number };

        // Determine destination based on fromLevel and direction
        if (state.elevatorFromLevel === 'base') {
            // From base, go up to first floor (0,-4)
            targetCoords = { key: '0,-4', gx: 0, gy: -4 };
        } else if (state.elevatorFromLevel === 'first') {
            // From first floor, can go up or down based on actual chosen direction
            if (state.elevatorDirection === 'up') {
                // Go up to platform (0,-5)
                targetCoords = { key: '0,-5', gx: 0, gy: -5 };
            } else {
                // Go down to base (0,0)
                targetCoords = { key: '0,0', gx: 0, gy: 0 };
            }
        } else {
            // From platform, go down to first floor (0,-4)
            targetCoords = { key: '0,-4', gx: 0, gy: -4 };
        }

        const { zoneId: destZoneId, newZones, newGrid } = getOrCreateTowerZone(
            targetCoords.key, targetCoords.gx, targetCoords.gy
        );

        return {
            ...state,
            zones: newZones,
            zoneGrid: newGrid,
            gameState: GameState.EXPLORING,
            showElevatorModal: false,
            edgeWarningShown: false,
            player: { ...state.player, currentZoneId: destZoneId, x: 12, y: 7 }
        };

    case 'SHOW_EDGE_WARNING':
        return { ...state, edgeWarningShown: true };

    case 'PLAYER_FALL':
        if(!state.audio.muted) playSound('ERROR');
        return {
            ...state,
            gameState: GameState.GAME_OVER,
            gameOverCause: 'fall'
        };

    case 'RESET_GAME':
        // Return to intro state - full reset
        const resetStartLoc = pick(START_LOCATIONS);
        const resetStartZoneId = `zone_${resetStartLoc.x}_${resetStartLoc.y}`;
        const resetStartZone = generateZone(resetStartZoneId, resetStartLoc.x, resetStartLoc.y);
        const resetGridInit: Record<string, string> = {};
        resetGridInit[`${resetStartLoc.x},${resetStartLoc.y}`] = resetStartZoneId;

        // Find valid spawn point for reset
        const resetSpawn = findValidSpawnPoint(
            resetStartZone.mapData,
            Math.floor(resetStartZone.width / 2),
            Math.floor(resetStartZone.height / 2),
            resetStartZone.width,
            resetStartZone.height
        );

        return {
            ...initialState,
            zones: { [resetStartZoneId]: resetStartZone },
            zoneGrid: resetGridInit,
            player: {
                ...initialState.player,
                x: resetSpawn.x,
                y: resetSpawn.y,
                currentZoneId: resetStartZoneId,
                inventory: getRandomItems(3),
                narrationHistory: []
            }
        };
    case 'SET_ASSESSMENT':
        return { ...state, gameState: GameState.ASSESSMENT, assessment: action.payload };
    case 'TOGGLE_MUTE':
        return { ...state, audio: { ...state.audio, muted: !state.audio.muted }};
    
    case 'HIGHLIGHT_ENTITY':
        return { ...state, highlightedEntityId: action.payload };
    
    case 'CACHE_OBSERVATION':
        return {
            ...state,
            zones: {
                ...state.zones,
                [action.payload.zoneId]: {
                    ...state.zones[action.payload.zoneId],
                    observedImage: action.payload.image
                }
            }
        };

    case 'UPDATE_QUEST_PROGRESS':
        return {
            ...state,
            quests: state.quests.map(q => {
                if (q.id === action.payload.questId) {
                    const newProgress = Math.min(q.progress + action.payload.increment, q.target);
                    const nowCompleted = newProgress >= q.target;
                    return { ...q, progress: newProgress, completed: nowCompleted };
                }
                return q;
            })
        };

    case 'SAVE_GAME':
        try {
            localStorage.setItem('ambassadors-1889-save', JSON.stringify(state));
        } catch (e) {
            // Silent fail for save errors
        }
        return state;

    case 'LOAD_GAME':
        return { ...state, ...action.payload };

    case 'INCREMENT_API_USAGE':
        const newCount = state.apiUsage.sessionCalls + 1;
        // At 100 calls, show support modal
        if (newCount === 100) {
            return {
                ...state,
                apiUsage: { ...state.apiUsage, sessionCalls: newCount },
                showSupportModal: true
            };
        }
        return {
            ...state,
            apiUsage: { ...state.apiUsage, sessionCalls: newCount }
        };

    case 'CLOSE_SUPPORT_MODAL':
        return { ...state, showSupportModal: false };

    case 'START_ZONE_TRANSITION':
        return {
            ...state,
            zoneTransition: {
                active: true,
                zoneName: action.payload.zoneName,
                zoneDesc: action.payload.zoneDesc
            }
        };

    case 'END_ZONE_TRANSITION':
        return { ...state, zoneTransition: null };

    case 'START_MINIGAME':
        if (action.payload.type === GameState.MINIGAME_TELEGRAPH) {
            const message = action.payload.message || "PARIS";
            const history = message.split('').map(c => ({ char: c, status: 'PENDING' }));
            return {
                ...state,
                gameState: GameState.MINIGAME_TELEGRAPH,
                minigame: {
                    active: true, score: 0, timeLeft: 60, difficulty: 1,
                    telegraph: { message, currentIndex: 0, currentInput: '', targetMorse: MORSE_CODE[message[0]] || '', history: history as any },
                    curator: null, flaneur: null
                }
            };
        } else if (action.payload.type === GameState.MINIGAME_CURATOR) {
            const initialItems = shuffle([...CURATOR_ITEMS]);
            return {
                ...state,
                gameState: GameState.MINIGAME_CURATOR,
                minigame: {
                    active: true, score: 0, timeLeft: 30, difficulty: 1,
                    telegraph: null, flaneur: null,
                    curator: { queue: initialItems, currentItem: initialItems.pop() || null, streak: 0, feedback: null }
                }
            }
        } else if (action.payload.type === GameState.MINIGAME_FLANEUR) {
            const lvl = FLANEUR_LEVELS[0];
            return {
                ...state,
                gameState: GameState.MINIGAME_FLANEUR,
                minigame: {
                    active: true, score: 0, timeLeft: 0, difficulty: 1, telegraph: null, curator: null,
                    flaneur: { levelIndex: 0, playerX: lvl.start.x, playerY: lvl.start.y, enemies: lvl.enemies.map((e, i) => ({...e, id: i})), grid: lvl.map, status: 'PLAYING' }
                }
            }
        }
        return state;
        
    case 'TELEGRAPH_INPUT':
    case 'CURATOR_INPUT':
    case 'ADD_CURATOR_ITEM':
    case 'FLANEUR_MOVE':
    case 'UPDATE_MINIGAME':
        return minigameReducer(state, action);

    case 'END_MINIGAME':
        // Store minigame type for reward generation in useEffect
        const endingMinigameType = state.gameState === GameState.MINIGAME_TELEGRAPH ? 'TELEGRAPH' :
                             state.gameState === GameState.MINIGAME_CURATOR ? 'CURATOR' :
                             state.gameState === GameState.MINIGAME_FLANEUR ? 'FLANEUR' : '';

        // Dispatch custom event for reward generation (handled in useEffect)
        if (endingMinigameType) {
            window.dispatchEvent(new CustomEvent('minigame-ended', { detail: { type: endingMinigameType } }));
        }

        // Completing minigames reduces malaise (focused activity is calming)
        const malaiseReduction = endingMinigameType === 'FLANEUR' ? 8 : 5;
        const newMalaiseAfterMinigame = Math.max(0, state.player.stats.malaise - malaiseReduction);

        return {
            ...state,
            gameState: GameState.EXPLORING,
            minigame: null,
            player: {
                ...state.player,
                stats: { ...state.player.stats, malaise: newMalaiseAfterMinigame }
            }
        };
    case 'TRIGGER_SHAKE':
        if(!state.audio.muted) playSound('ERROR');
        return { ...state, shake: true };
    case 'CLEAR_SHAKE':
        return { ...state, shake: false };
        
    case 'INTERACTION_START':
        return { ...state, interaction: { active: true, type: action.payload, progress: 0 } };
    case 'INTERACTION_TICK':
        if (!state.interaction.active) return state;
        return { ...state, interaction: { ...state.interaction, progress: Math.min(100, state.interaction.progress + GAME_CONSTANTS.CHARGE_RATE) } };
    case 'INTERACTION_RESOLVE':
        if(!state.audio.muted) playSound('SUCCESS');
        return { ...state, interaction: { ...state.interaction, active: false, progress: 0, resultText: action.payload } };
    case 'INTERACTION_RESET':
        return { ...state, interaction: { active: false, type: 'NONE', progress: 0, resultText: undefined } };
        
    case 'CROWD_TICK':
        const currentZone = state.zones[state.player.currentZoneId];
        if (!currentZone) return state;
        // Tiles NPCs can walk on
        const npcWalkableTiles = new Set([' ', '.', ':', 'g', 'v', '`', ',', 'o']);
        // Tiles NPCs must never enter (fountains, water, obstacles)
        const npcForbiddenTiles = new Set([
            'F', 'f', '~', 'W', '≈', '⌂', '♦', '«', '»', '≥', '≤', '╔', '╗', '╚', '╝', // Fountains and water
            'T', 'H', 'q', '%', '@', 'h', '#', 'P', 'c', 'u', 'M', 'D', 'S', 'R', 'Y', 'k', 'X', 'V', '|', '^'
        ]);
        const newNpcList = state.npcs.map(agent => {
            if (agent.location.zoneId !== state.player.currentZoneId) return agent;
            if (Math.random() < 0.3) return agent;
            let nx = agent.location.x, ny = agent.location.y, nd = agent.location.direction;
            const move = Math.random();
            if (move < 0.25) { nx++; nd = 'E'; } else if (move < 0.5) { nx--; nd = 'W'; } else if (move < 0.75) { ny++; nd = 'S'; } else { ny--; nd = 'N'; }
            if (nx < 0 || nx >= currentZone.width || ny < 0 || ny >= currentZone.height) return agent;
            const tileChar = currentZone.mapData[ny]?.[nx];
            // Only allow movement to walkable tiles that aren't forbidden
            if (!npcWalkableTiles.has(tileChar) || npcForbiddenTiles.has(tileChar)) return agent;
            if (nx === state.player.x && ny === state.player.y) return agent;
            return { ...agent, location: { ...agent.location, x: nx, y: ny, direction: nd } };
        });
        return { ...state, npcs: newNpcList };
        
    case 'ADD_GALLERY_IMAGE':
        // Update SCRUTINIZE quest progress when adding gallery images
        const scrutinizeQuests = state.quests.map(q => {
            if (q.type === 'SCRUTINIZE' && !q.completed) {
                const newProgress = Math.min(q.progress + 1, q.target);
                return { ...q, progress: newProgress, completed: newProgress >= q.target };
            }
            return q;
        });
        return { ...state, gallery: [action.payload, ...state.gallery], quests: scrutinizeQuests };
    case 'OPEN_GALLERY':
        return { ...state, gameState: GameState.GALLERY_VIEW };
    case 'CLOSE_GALLERY':
        return { ...state, gameState: GameState.EXPLORING };
    case 'ADD_NARRATOR_MSG':
        return { ...state, narratorLog: [...state.narratorLog, action.payload] };
    case 'TRIGGER_GLOBAL_COOLDOWN':
        return { ...state, lastGlobalNarratorTrigger: Date.now() };
    case 'TRIGGER_NPC_NARRATIVE':
        const npcId = action.payload.id;
        const newCooldowns = { ...state.npcCooldowns, [npcId]: Date.now() + 60000 };
        return {
            ...state,
            npcCooldowns: newCooldowns,
            narratorLog: [...state.narratorLog, { id: Date.now().toString(), sender: 'DM', text: action.payload.text }],
            lastGlobalNarratorTrigger: Date.now()
        };

    case 'ADJUST_STAT':
        const { stat, delta } = action.payload;
        const currentValue = state.player.stats[stat] as number;
        let newValue = currentValue + delta;

        // Clamp values based on stat type
        if (stat === 'malaise' || stat === 'reputation') {
            newValue = Math.max(0, Math.min(100, newValue));
        } else if (stat === 'hp') {
            newValue = Math.max(0, Math.min(state.player.stats.maxHp, newValue));
        } else if (stat === 'money') {
            newValue = Math.max(0, newValue);
        } else {
            // For wit, decorum, observation - minimum 1
            newValue = Math.max(1, newValue);
        }

        // Check for malaise game over
        if (stat === 'malaise' && newValue >= 100) {
            if (!state.audio.muted) playSound('ERROR');
            return {
                ...state,
                player: {
                    ...state.player,
                    stats: { ...state.player.stats, [stat]: 100 }
                },
                gameState: GameState.GAME_OVER,
                gameOverCause: 'malaise'
            };
        }

        return {
            ...state,
            player: {
                ...state.player,
                stats: { ...state.player.stats, [stat]: newValue }
            }
        };

    case 'MALAISE_TICK':
        // Passive malaise system based on environment
        const currentZoneForMalaise = state.zones[state.player.currentZoneId];
        if (!currentZoneForMalaise) return state;

        // Count NPCs in current zone
        const npcsInZone = state.npcs.filter(n => n.location.zoneId === state.player.currentZoneId).length;

        // Determine malaise change based on environment
        let malaiseChange = 0;

        // Crowded areas increase malaise
        if (npcsInZone >= 6) {
            malaiseChange += 2; // Very crowded
        } else if (npcsInZone >= 4) {
            malaiseChange += 1; // Moderately crowded
        }

        // Certain biomes affect malaise
        const stressfulBiomes = ['SOUK', 'GRAND_HALL', 'STREET'];
        const peacefulBiomes = ['GARDEN', 'SALON'];

        if (stressfulBiomes.includes(currentZoneForMalaise.biome)) {
            malaiseChange += 1;
        } else if (peacefulBiomes.includes(currentZoneForMalaise.biome)) {
            malaiseChange -= 2; // Gardens and salons are restorative
        }

        // Tower platforms are anxiety-inducing
        if (currentZoneForMalaise.biome === 'TOWER_PLATFORM') {
            malaiseChange += 3;
        }

        // Apply change with bounds
        const newMalaise = Math.max(0, Math.min(100, state.player.stats.malaise + malaiseChange));

        // Check for game over
        if (newMalaise >= 100) {
            if (!state.audio.muted) playSound('ERROR');
            return {
                ...state,
                player: {
                    ...state.player,
                    stats: { ...state.player.stats, malaise: 100 }
                },
                gameState: GameState.GAME_OVER,
                gameOverCause: 'malaise'
            };
        }

        return {
            ...state,
            player: {
                ...state.player,
                stats: { ...state.player.stats, malaise: newMalaise }
            }
        };

    case 'USE_ITEM_FOR_RELIEF':
        // Find and use an item that provides malaise relief
        const reliefItem = state.player.inventory.find(i => i.id === action.payload);
        if (!reliefItem) return state;

        // Determine relief amount based on item type/category
        let reliefAmount = 0;
        const itemNameLower = reliefItem.name.toLowerCase();
        const itemDescLower = reliefItem.description.toLowerCase();

        // Check for calming items
        if (itemNameLower.includes('wine') || itemNameLower.includes('champagne') || itemNameLower.includes('cognac')) {
            reliefAmount = 15;
        } else if (itemNameLower.includes('tobacco') || itemNameLower.includes('cigar') || itemNameLower.includes('cigarette')) {
            reliefAmount = 10;
        } else if (itemNameLower.includes('book') || itemDescLower.includes('novel') || itemDescLower.includes('poetry')) {
            reliefAmount = 12;
        } else if (reliefItem.type === 'ART' || reliefItem.type === 'CURIOSITY') {
            reliefAmount = 8;
        } else if (itemDescLower.includes('calm') || itemDescLower.includes('sooth') || itemDescLower.includes('relax')) {
            reliefAmount = 10;
        }

        if (reliefAmount === 0) return state; // Item provides no relief

        if (!state.audio.muted) playSound('SUCCESS');

        return {
            ...state,
            player: {
                ...state.player,
                inventory: state.player.inventory.filter(i => i.id !== action.payload),
                stats: {
                    ...state.player.stats,
                    malaise: Math.max(0, state.player.stats.malaise - reliefAmount)
                }
            },
            log: [...state.log, {
                id: Date.now().toString(),
                type: 'SYSTEM',
                text: `You find solace in the ${reliefItem.name}. (-${reliefAmount} Malaise)`,
                timestamp: Date.now()
            }]
        };

    case 'GAIN_INSPIRATION':
        // Add inspiration and log the source
        const inspAmount = action.payload.amount;
        const inspSource = action.payload.source;
        if (!state.audio.muted) playSound('BLIP');
        return {
            ...state,
            player: {
                ...state.player,
                stats: {
                    ...state.player.stats,
                    inspiration: state.player.stats.inspiration + inspAmount
                }
            },
            log: [...state.log, {
                id: Date.now().toString(),
                type: 'NARRATIVE',
                text: `A moment of insight: ${inspSource} (+${inspAmount} Inspiration)`,
                timestamp: Date.now()
            }]
        };

    case 'ADJUST_COMPOSURE':
        const newComposure = Math.max(0, Math.min(state.player.stats.maxComposure, state.player.stats.composure + action.payload));
        return {
            ...state,
            player: {
                ...state.player,
                stats: { ...state.player.stats, composure: newComposure }
            }
        };

    case 'ADJUST_HEALTH':
        const newHealth = Math.max(0, Math.min(state.player.stats.maxHealth, state.player.stats.health + action.payload));

        // Check for death
        if (newHealth <= 0) {
            return {
                ...state,
                player: {
                    ...state.player,
                    stats: { ...state.player.stats, health: 0 }
                },
                gameState: GameState.GAME_OVER,
                gameOverCause: 'fall' // Physical harm leads to game over
            };
        }

        return {
            ...state,
            player: {
                ...state.player,
                stats: { ...state.player.stats, health: newHealth }
            }
        };

    case 'ADD_NARRATION':
        // Track player's narration input for end-game literary assessment
        const newNarration = {
            id: `narration-${Date.now()}`,
            text: action.payload,
            timestamp: Date.now(),
            zoneId: state.player.currentZoneId
        };
        return {
            ...state,
            player: {
                ...state.player,
                narrationHistory: [...state.player.narrationHistory, newNarration]
            }
        };

    case 'STAT_TICK':
        // Passive stat changes based on environment
        const currentZoneForStats = state.zones[state.player.currentZoneId];
        if (!currentZoneForStats) return state;

        let composureRegen = 0;
        let healthRegen = 0;

        // Composure regenerates slowly in quiet places
        const npcsNearby = state.npcs.filter(n => n.location.zoneId === state.player.currentZoneId).length;
        if (npcsNearby <= 2) {
            composureRegen = 2; // Quiet area
        } else if (npcsNearby <= 4) {
            composureRegen = 1; // Moderate
        }
        // No regen in very crowded areas

        // High malaise drains composure
        if (state.player.stats.malaise > 60) {
            composureRegen -= 2;
        } else if (state.player.stats.malaise > 40) {
            composureRegen -= 1;
        }

        // Gardens regenerate health slightly
        if (currentZoneForStats.biome === 'GARDEN' || currentZoneForStats.biome === 'TROCADERO') {
            healthRegen = 1;
        }

        const tickedComposure = Math.max(0, Math.min(
            state.player.stats.maxComposure,
            state.player.stats.composure + composureRegen
        ));
        const tickedHealth = Math.max(0, Math.min(
            state.player.stats.maxHealth,
            state.player.stats.health + healthRegen
        ));

        return {
            ...state,
            player: {
                ...state.player,
                stats: {
                    ...state.player.stats,
                    composure: tickedComposure,
                    health: tickedHealth
                }
            }
        };

    // === EVENT SYSTEM ===
    case 'TRIGGER_EVENT':
        if (!state.audio.muted) playSound('BLIP');
        return {
            ...state,
            gameState: GameState.EVENT_CHOICE,
            eventState: {
                ...state.eventState,
                currentEvent: action.payload
            }
        };

    case 'TRIGGER_BREAKAGE_EVENT':
        // Get the appropriate breakage event based on what was broken
        const breakageEvent = getBreakageEvent(action.payload.objectType);
        if (!state.audio.muted) playSound('BLIP');
        return {
            ...state,
            gameState: GameState.EVENT_CHOICE,
            eventState: {
                ...state.eventState,
                currentEvent: breakageEvent
            }
        };

    case 'CLOSE_EVENT':
        return {
            ...state,
            gameState: GameState.EXPLORING,
            eventState: {
                ...state.eventState,
                currentEvent: null
            }
        };

    case 'DISMISS_EVENT':
        // Mark event as dismissed so it won't appear again
        return {
            ...state,
            gameState: GameState.EXPLORING,
            eventState: {
                ...state.eventState,
                currentEvent: null,
                dismissedEvents: [...state.eventState.dismissedEvents, action.payload.eventId]
            }
        };

    case 'RECORD_EVENT':
        const { eventId, choiceId, outcomeDescription, zoneName: recordZoneName } = action.payload;
        const recordedEvent = state.eventState.currentEvent;
        const newTriggeredEvents = recordedEvent && !recordedEvent.repeatable
            ? [...state.eventState.triggeredEvents, eventId]
            : state.eventState.triggeredEvents;

        return {
            ...state,
            eventState: {
                ...state.eventState,
                eventHistory: [
                    ...state.eventState.eventHistory,
                    { eventId, choiceId, timestamp: Date.now(), outcomeDescription, zoneName: recordZoneName }
                ],
                triggeredEvents: newTriggeredEvents,
                eventCooldowns: {
                    ...state.eventState.eventCooldowns,
                    [eventId]: Date.now()
                }
            }
        };

    case 'CHECK_RANDOM_EVENT':
        // Don't trigger events during other states or if event already active
        if (state.gameState !== GameState.EXPLORING || state.eventState.currentEvent) {
            return state;
        }

        const currentZoneForEvent = state.zones[state.player.currentZoneId];
        if (!currentZoneForEvent) return state;

        // Filter eligible events
        const eligibleEvents = ALL_EVENTS.filter(event => {
            // Skip events that have been dismissed (user closed with X/ESC)
            if (state.eventState.dismissedEvents.includes(event.id)) {
                return false;
            }

            // Skip non-repeatable events that have already triggered
            if (!event.repeatable && state.eventState.triggeredEvents.includes(event.id)) {
                return false;
            }

            // Check cooldown (convert minutes to milliseconds)
            if (event.triggerConditions.cooldownMinutes) {
                const lastTrigger = state.eventState.eventCooldowns[event.id] || 0;
                const cooldownMs = event.triggerConditions.cooldownMinutes * 60 * 1000;
                if (Date.now() - lastTrigger < cooldownMs) {
                    return false;
                }
            }

            // Only random zone events can trigger from this action
            if (event.triggerType !== 'RANDOM_ZONE' && event.triggerType !== 'STAT_THRESHOLD') {
                return false;
            }

            // Check biome match
            if (event.triggerConditions.biomes &&
                !event.triggerConditions.biomes.includes(currentZoneForEvent.biome)) {
                return false;
            }

            // Check malaise thresholds
            if (event.triggerConditions.minMalaise !== undefined &&
                state.player.stats.malaise < event.triggerConditions.minMalaise) {
                return false;
            }
            if (event.triggerConditions.maxMalaise !== undefined &&
                state.player.stats.malaise > event.triggerConditions.maxMalaise) {
                return false;
            }

            // Check stat threshold for STAT_THRESHOLD events
            if (event.triggerType === 'STAT_THRESHOLD' && event.triggerConditions.statType) {
                const statToCheck = event.triggerConditions.statType;
                const threshold = event.triggerConditions.statThreshold || 0;
                let currentStatValue = 0;

                switch (statToCheck) {
                    case StatType.MALAISE:
                        currentStatValue = state.player.stats.malaise;
                        break;
                    case StatType.HEALTH:
                        currentStatValue = state.player.stats.health;
                        break;
                    case StatType.COMPOSURE:
                        currentStatValue = state.player.stats.composure;
                        break;
                    case StatType.INSPIRATION:
                        currentStatValue = state.player.stats.inspiration;
                        break;
                    case StatType.REPUTATION:
                        currentStatValue = state.player.stats.reputation;
                        break;
                    default:
                        return false;
                }

                if (currentStatValue < threshold) {
                    return false;
                }
            }

            // Check required items
            if (event.triggerConditions.requiredItems) {
                const playerItemIds = state.player.inventory.map(i => i.id);
                for (const reqItem of event.triggerConditions.requiredItems) {
                    if (!playerItemIds.includes(reqItem)) {
                        return false;
                    }
                }
            }

            // Check excluded items
            if (event.triggerConditions.excludeItems) {
                const playerItemIds = state.player.inventory.map(i => i.id);
                for (const exItem of event.triggerConditions.excludeItems) {
                    if (playerItemIds.includes(exItem)) {
                        return false;
                    }
                }
            }

            return true;
        });

        if (eligibleEvents.length === 0) return state;

        // Sort by priority (higher first)
        eligibleEvents.sort((a, b) => (b.priority || 0) - (a.priority || 0));

        // Try each event in priority order
        for (const event of eligibleEvents) {
            const probability = event.triggerConditions.probability || 0.1;
            if (Math.random() < probability) {
                if (!state.audio.muted) playSound('BLIP');
                return {
                    ...state,
                    gameState: GameState.EVENT_CHOICE,
                    eventState: {
                        ...state.eventState,
                        currentEvent: event
                    }
                };
            }
        }

        return state;

    case 'DISCOVER_PHRASE':
        if (!state.audio.muted) playSound('BLIP');
        return {
            ...state,
            eventState: {
                ...state.eventState,
                discoveredPhrases: [...state.eventState.discoveredPhrases, action.payload]
            },
            log: [...state.log, {
                id: Date.now().toString(),
                type: 'NARRATIVE',
                text: `A thought crystallizes unbidden...`,
                timestamp: Date.now()
            }]
        };

    case 'CHECK_PHRASE_EVENT':
        // Don't trigger if already in event or not exploring
        if (state.gameState !== GameState.EXPLORING || state.eventState.currentEvent) {
            return state;
        }

        // Only trigger occasionally (10% chance when called)
        if (Math.random() > 0.10) {
            return state;
        }

        // Get an undiscovered phrase
        const discoveredIds = state.eventState.discoveredPhrases.map(p => p.phraseId);
        const newPhrase = getUndiscoveredPhrase(discoveredIds);

        if (!newPhrase) return state; // All phrases discovered

        // Determine time of day based on some state (simplified - could use real game time)
        const hour = new Date().getHours();
        const timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' =
            hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night';

        const currentZoneForPhrase = state.zones[state.player.currentZoneId];

        if (!state.audio.muted) playSound('BLIP');

        // Create the discovered phrase entry
        const discovered: DiscoveredPhrase = {
            phraseId: newPhrase.id,
            text: newPhrase.text,
            theme: newPhrase.theme,
            references: newPhrase.references,
            discoveredAt: {
                zoneName: currentZoneForPhrase?.name || 'Unknown',
                timestamp: Date.now(),
                timeOfDay
            }
        };

        return {
            ...state,
            eventState: {
                ...state.eventState,
                discoveredPhrases: [...state.eventState.discoveredPhrases, discovered]
            },
            log: [...state.log, {
                id: Date.now().toString(),
                type: 'NARRATIVE',
                text: `A thought crystallizes unbidden...`,
                timestamp: Date.now()
            }],
            narratorLog: [...state.narratorLog, {
                id: Date.now().toString(),
                sender: 'DM',
                text: `*A phrase comes to you unbidden:* "${newPhrase.text.substring(0, 80)}..."`
            }]
        };

    case 'OPEN_JOURNAL':
        return { ...state, showJournal: true };

    case 'CLOSE_JOURNAL':
        return { ...state, showJournal: false };

    case 'OPEN_SKETCHBOOK':
        return { ...state, showSketchbook: true };

    case 'CLOSE_SKETCHBOOK':
        return { ...state, showSketchbook: false };

    case 'RECORD_MET_NPC':
        // Don't add duplicate NPCs
        if (state.metNpcs.some(n => n.id === action.payload.id)) {
            return state;
        }
        return {
            ...state,
            metNpcs: [...state.metNpcs, action.payload]
        };

    case 'ADVANCE_TIME': {
        const minutes = action.payload;
        let { day, month, year, hour, minute } = state.gameTime;

        minute += minutes;

        // Handle minute overflow
        while (minute >= 60) {
            minute -= 60;
            hour++;
        }

        // Handle hour overflow (new day)
        while (hour >= 24) {
            hour -= 24;
            day++;
        }

        // Handle day overflow (new month) - simplified, assuming 30-day months for May-October
        const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        while (day > daysInMonth[month]) {
            day -= daysInMonth[month];
            month++;
            if (month > 12) {
                month = 1;
                year++;
            }
        }

        return {
            ...state,
            gameTime: { day, month, year, hour, minute }
        };
    }

    default:
      return state;
  }
};

const minigameReducer = (state: State, action: any): State => {
    if (!state.minigame) return state;
    // ... (Minigame Reducer remains same as previous content, included implicitly by keeping structure)
    // For brevity, I'm ensuring the logic matches the passed context logic.
    switch (action.type) {
        case 'TELEGRAPH_INPUT':
            if (!state.minigame.telegraph) return state;
            if (!state.audio.muted) playSound(action.payload === '.' ? 'DOT' : 'DASH');
            const { telegraph } = state.minigame;
            const newInput = telegraph.currentInput + action.payload;
            if (!telegraph.targetMorse.startsWith(newInput)) {
                if (!state.audio.muted) playSound('ERROR');
                return { ...state, shake: true, minigame: { ...state.minigame, telegraph: { ...telegraph, currentInput: '' } } };
            }
            if (newInput === telegraph.targetMorse) {
                const newIndex = telegraph.currentIndex + 1;
                const newHistory = [...telegraph.history];
                newHistory[telegraph.currentIndex].status = 'CORRECT';
                if (newIndex >= telegraph.message.length) {
                    if (!state.audio.muted) playSound('TELEGRAPH_SEND');
                    return { ...state, gameState: GameState.EXPLORING, minigame: null, player: { ...state.player, stats: { ...state.player.stats, money: state.player.stats.money + 10 } }, log: [...state.log, { id: Date.now().toString(), type: 'SYSTEM', text: `Telegraph sent! You earned 10 Francs.`, timestamp: Date.now() }] };
                }
                return { ...state, minigame: { ...state.minigame, score: state.minigame.score + 10, telegraph: { ...telegraph, currentIndex: newIndex, currentInput: '', targetMorse: MORSE_CODE[telegraph.message[newIndex]] || '', history: newHistory } } };
            }
            return { ...state, minigame: { ...state.minigame, telegraph: { ...telegraph, currentInput: newInput } } };
            
        case 'CURATOR_INPUT':
             if (!state.minigame.curator || !state.minigame.curator.currentItem) return state;
             const item = state.minigame.curator.currentItem;
             const choice = action.payload;
             const isVulgar = item.tags.includes('VULGAR');
             const isSublime = item.tags.includes('SUBLIME');
             let correct = false;
             if (choice === 'LEFT' && isVulgar) correct = true;
             if (choice === 'RIGHT' && isSublime) correct = true;
             if (correct) {
                if (!state.audio.muted) playSound('BLIP');
                const newQueue = [...state.minigame.curator.queue];
                const nextItem = newQueue.pop() || null;
                if (!nextItem) {
                     if (!state.audio.muted) playSound('SUCCESS');
                     return { ...state, gameState: GameState.EXPLORING, minigame: null, log: [...state.log, { id: Date.now().toString(), type: 'SYSTEM', text: `Curatorial duties complete. Your taste is impeccable.`, timestamp: Date.now() }] };
                }
                return { ...state, minigame: { ...state.minigame, score: state.minigame.score + 10, curator: { ...state.minigame.curator, currentItem: nextItem, queue: newQueue, streak: state.minigame.curator.streak + 1, feedback: "CORRECT" } } }
             } else {
                if (!state.audio.muted) playSound('ERROR');
                return { ...state, shake: true, minigame: { ...state.minigame, curator: { ...state.minigame.curator, streak: 0, feedback: "GAUCHE!" } } }
             }

        case 'ADD_CURATOR_ITEM':
            if (!state.minigame.curator) return state;
            return { ...state, minigame: { ...state.minigame, curator: { ...state.minigame.curator, queue: [action.payload, ...state.minigame.curator.queue] } } };

        case 'FLANEUR_MOVE':
            if (!state.minigame.flaneur || state.minigame.flaneur.status !== 'PLAYING') return state;
            const { flaneur } = state.minigame;
            const newFX = flaneur.playerX + action.payload.x;
            const newFY = flaneur.playerY + action.payload.y;
            if (flaneur.grid[newFY]?.[newFX] === '#') { if (!state.audio.muted) playSound('ERROR'); return state; }
            if (!state.audio.muted) playSound('STEP_SNEAK');
            const currentLvl = FLANEUR_LEVELS[flaneur.levelIndex];
            if (newFX === currentLvl.exit.x && newFY === currentLvl.exit.y) {
                if (!state.audio.muted) playSound('SUCCESS');
                const nextLvlIdx = flaneur.levelIndex + 1;
                if (nextLvlIdx >= FLANEUR_LEVELS.length) return { ...state, gameState: GameState.EXPLORING, minigame: null, log: [...state.log, { id: Date.now().toString(), type: 'SYSTEM', text: `You escaped the gala unnoticed.`, timestamp: Date.now() }] };
                const nextLvl = FLANEUR_LEVELS[nextLvlIdx];
                return { ...state, minigame: { ...state.minigame, flaneur: { levelIndex: nextLvlIdx, playerX: nextLvl.start.x, playerY: nextLvl.start.y, enemies: nextLvl.enemies.map((e, i) => ({...e, id: i})), grid: nextLvl.map, status: 'PLAYING' } } }
            }
            const newFlaneurState = { ...flaneur, playerX: newFX, playerY: newFY };
            const newEnemies = newFlaneurState.enemies.map(e => {
                const dirs: ('N'|'E'|'S'|'W')[] = ['N', 'E', 'S', 'W'];
                const idx = dirs.indexOf(e.dir);
                const act = Math.random();
                if (act > 0.5) return { ...e, dir: dirs[(idx + 1) % 4] };
                let ex = e.x, ey = e.y;
                if (e.dir === 'N') ey--; if (e.dir === 'S') ey++; if (e.dir === 'E') ex++; if (e.dir === 'W') ex--;
                if (flaneur.grid[ey]?.[ex] === '#') return e; 
                return { ...e, x: ex, y: ey };
            });
            let caught = false;
            for (const e of newEnemies) {
                for (let d = 0; d <= 3; d++) {
                    let tx = e.x, ty = e.y;
                    if (e.dir === 'N') ty -= d; if (e.dir === 'S') ty += d; if (e.dir === 'E') tx += d; if (e.dir === 'W') tx -= d;
                    if (flaneur.grid[ty]?.[tx] === '#') break;
                    if (tx === newFX && ty === newFY) { caught = true; break; }
                }
                if (caught) break;
            }
            if (caught) { if (!state.audio.muted) playSound('ALERT'); return { ...state, shake: true, minigame: { ...state.minigame, flaneur: { ...newFlaneurState, enemies: newEnemies, status: 'CAUGHT' } } } }
            return { ...state, minigame: { ...state.minigame, flaneur: { ...newFlaneurState, enemies: newEnemies } } };

        case 'UPDATE_MINIGAME':
             return { ...state, minigame: { ...state.minigame, ...action.payload }};

        default: return state;
    }
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  // Ref to track async generation status to prevent race conditions
  const isGenerating = useRef<boolean>(false);
  // Ref to track dialogue generation to prevent race conditions
  const isDialogueGenerating = useRef<boolean>(false);
  // Ref to track minigame reward timeout for cleanup
  const minigameRewardTimeout = useRef<NodeJS.Timeout | null>(null);

  // Shake Reset
  useEffect(() => {
      if (state.shake) {
          const timer = setTimeout(() => {
              dispatch({ type: 'CLEAR_SHAKE' });
          }, 500);
          return () => clearTimeout(timer);
      }
  }, [state.shake]);

  // Crowd Loop
  useEffect(() => {
      if (state.gameState === GameState.EXPLORING) {
          const interval = setInterval(() => {
              dispatch({ type: 'CROWD_TICK' });
          }, GAME_CONSTANTS.CROWD_TICK_RATE);
          return () => clearInterval(interval);
      }
  }, [state.gameState]);

  // Malaise Tick - passive malaise changes based on environment
  useEffect(() => {
      if (state.gameState === GameState.EXPLORING) {
          const interval = setInterval(() => {
              dispatch({ type: 'MALAISE_TICK' });
          }, 8000); // Every 8 seconds
          return () => clearInterval(interval);
      }
  }, [state.gameState]);

  // Random Event Check - periodically check for random events while exploring
  useEffect(() => {
      if (state.gameState === GameState.EXPLORING) {
          const interval = setInterval(() => {
              dispatch({ type: 'CHECK_RANDOM_EVENT' });
          }, 15000); // Check every 15 seconds
          return () => clearInterval(interval);
      }
  }, [state.gameState]);

  // Phrase Discovery Check - periodically check if a Jamesian phrase comes to HJ
  useEffect(() => {
      if (state.gameState === GameState.EXPLORING) {
          const interval = setInterval(() => {
              dispatch({ type: 'CHECK_PHRASE_EVENT' });
          }, 25000); // Check every 25 seconds
          return () => clearInterval(interval);
      }
  }, [state.gameState]);

  // Custom event listener for adding items asynchronously
  useEffect(() => {
    const handleAddItem = (e: CustomEvent) => {
      const item = e.detail as Item;
      dispatch({ type: 'ADD_ITEM', payload: item });
      dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'SYSTEM', text: `Acquired: ${item.name}`, timestamp: Date.now() } });
    };

    window.addEventListener('add-item' as any, handleAddItem as any);
    return () => window.removeEventListener('add-item' as any, handleAddItem as any);
  }, [dispatch]);

  // Handle minigame rewards with proper cleanup
  useEffect(() => {
    const handleMinigameEnded = (e: CustomEvent) => {
      const { type: minigameType } = e.detail;

      // Clear any existing timeout
      if (minigameRewardTimeout.current) {
        clearTimeout(minigameRewardTimeout.current);
      }

      // 50% chance of historical item, 50% AI-generated
      if (Math.random() > 0.5) {
        // Historical item with delay
        const items = getRandomItems(1);
        if (items.length > 0) {
          minigameRewardTimeout.current = setTimeout(() => {
            window.dispatchEvent(new CustomEvent('add-item', { detail: items[0] }));
            minigameRewardTimeout.current = null;
          }, 500);
        }
      } else {
        // AI-generated item
        generateMinigameReward(minigameType).then(item => {
          if (item) {
            window.dispatchEvent(new CustomEvent('add-item', { detail: item }));
          }
        });
      }
    };

    window.addEventListener('minigame-ended' as any, handleMinigameEnded as any);
    return () => {
      window.removeEventListener('minigame-ended' as any, handleMinigameEnded as any);
      // Cleanup timeout on unmount
      if (minigameRewardTimeout.current) {
        clearTimeout(minigameRewardTimeout.current);
      }
    };
  }, []);

  // Custom event listener for API call tracking
  useEffect(() => {
    const handleApiCall = () => {
      dispatch({ type: 'INCREMENT_API_USAGE' });
    };

    window.addEventListener('api-call-made', handleApiCall);
    return () => window.removeEventListener('api-call-made', handleApiCall);
  }, [dispatch]);

  // Dialogue Generation Loop - with race condition prevention
  useEffect(() => {
    // Prevent concurrent dialogue generation
    if (isDialogueGenerating.current) return;

    if (state.gameState === GameState.DIALOGUE && state.dialogue && state.dialogue.history.length === 0) {
        isDialogueGenerating.current = true;
        const npc = state.dialogue.npc;
        const context = state.zones[state.player.currentZoneId].name;
        generateDialogue(npc, "", [], context).then(text => {
             isDialogueGenerating.current = false;
             dispatch({ type: 'ADD_DIALOGUE_MSG', payload: { sender: 'NPC', text, timestamp: Date.now() } });
        }).catch(() => {
             isDialogueGenerating.current = false;
        });
    } else if (state.gameState === GameState.DIALOGUE && state.dialogue && state.dialogue.history.length > 0) {
        const lastMsg = state.dialogue.history[state.dialogue.history.length - 1];
        if (lastMsg.sender === 'PLAYER') {
            isDialogueGenerating.current = true;
            const npc = state.dialogue.npc;
            const context = state.zones[state.player.currentZoneId].name;
            const history = state.dialogue.history.map(m => `${m.sender}: ${m.text}`);
            generateDialogue(npc, lastMsg.text, history, context).then(text => {
                isDialogueGenerating.current = false;
                dispatch({ type: 'ADD_DIALOGUE_MSG', payload: { sender: 'NPC', text, timestamp: Date.now() } });
            }).catch(() => {
                isDialogueGenerating.current = false;
            });
        }
    }
  }, [state.gameState, state.dialogue?.history.length]);

  // Reset dialogue generating flag when leaving dialogue
  useEffect(() => {
    if (state.gameState !== GameState.DIALOGUE) {
      isDialogueGenerating.current = false;
    }
  }, [state.gameState]);

  // NPC Proximity Narrative Trigger (Static text, no LLM calls)
  const npcProximityPhrases = [
      (name: string) => `*${name} draws nearby.*`,
      (name: string) => `*${name} brushes past you.*`,
      (name: string) => `*You notice ${name} in your vicinity.*`,
      (name: string) => `*${name} passes close by.*`,
      (name: string) => `*The presence of ${name} catches your attention.*`,
      (name: string) => `*${name} lingers nearby.*`,
      (name: string) => `*You find yourself near ${name}.*`,
      (name: string) => `*${name} moves into view.*`,
  ];

  useEffect(() => {
      if (state.gameState === GameState.EXPLORING) {
          let triggered = false;
          state.npcs.forEach(npc => {
             if (triggered) return;
             if (npc.location.zoneId === state.player.currentZoneId) {
                 const dist = Math.sqrt(Math.pow(npc.location.x - state.player.x, 2) + Math.pow(npc.location.y - state.player.y, 2));
                 if (dist <= 1.5) {
                     const lastTrigger = state.npcCooldowns[npc.id] || 0;
                     // 30s cooldown per specific NPC for proximity messages
                     if (Date.now() > lastTrigger + 30000) {
                         triggered = true;
                         // Pick a random phrase
                         const phrase = npcProximityPhrases[Math.floor(Math.random() * npcProximityPhrases.length)];
                         const text = phrase(npc.name);
                         dispatch({ type: 'TRIGGER_NPC_NARRATIVE', payload: { id: npc.id, text } });
                     }
                 }
             }
          });
      }
  }, [state.player.x, state.player.y, state.npcs]);

  // Interaction Charge Loop
  useEffect(() => {
      if (state.interaction.active) {
          const interval = setInterval(() => {
              dispatch({ type: 'INTERACTION_TICK' });
          }, 50);
          return () => clearInterval(interval);
      }
  }, [state.interaction.active]);
  
  // Curator Refill
  useEffect(() => {
      if (state.gameState === GameState.MINIGAME_CURATOR && state.minigame?.curator && state.minigame.curator.queue.length < 3) {
          generateCuratorItem().then(item => {
              dispatch({ type: 'ADD_CURATOR_ITEM', payload: item });
          });
      }
  }, [state.gameState, state.minigame?.curator?.queue.length]);

  // Zone Narrative Trigger (Throttled to once per minute)
  // Track the last zone we populated/narrated to avoid duplicate triggers
  const lastNarratedZone = useRef<string | null>(null);

  useEffect(() => {
      const currentZone = state.zones[state.player.currentZoneId];
      dispatch({ type: 'POPULATE_ZONE', payload: state.player.currentZoneId });

      // Start zone-appropriate music/ambience
      if (currentZone && !state.audio.muted) {
          startZoneMusic(currentZone.name);
      }

      // Only trigger narrator updates if enough time has passed (60 seconds)
      const timeSinceLastUpdate = Date.now() - state.lastGlobalNarratorTrigger;
      const NARRATOR_COOLDOWN = 60000; // 1 minute

      // Skip if we just narrated this zone or if cooldown hasn't passed
      if (lastNarratedZone.current === state.player.currentZoneId) {
          return; // Already narrated this zone in current visit
      }

      if (timeSinceLastUpdate < NARRATOR_COOLDOWN) {
          return; // Skip this update - too soon since last narrator message
      }

      if (!currentZone.narratorDescription) {
           if (!isGenerating.current) {
                isGenerating.current = true;
                dispatch({ type: 'TRIGGER_GLOBAL_COOLDOWN' });
                lastNarratedZone.current = state.player.currentZoneId;
                generateLocationNarrative(currentZone.name, currentZone.biome, currentZone.description).then(text => {
                    isGenerating.current = false;
                    dispatch({ type: 'UPDATE_ZONE_NARRATIVE', payload: { id: currentZone.id, text } });
                });
           }
      } else {
           // Only add message if zone has changed (not just re-entering same zone)
           const lastMsg = state.narratorLog[state.narratorLog.length - 1];
           if (!lastMsg || lastMsg.text !== currentZone.narratorDescription) {
                lastNarratedZone.current = state.player.currentZoneId;
                dispatch({ type: 'TRIGGER_GLOBAL_COOLDOWN' });
                dispatch({ type: 'ADD_NARRATOR_MSG', payload: { id: Date.now().toString(), sender: 'DM', text: currentZone.narratorDescription } });
           }
      }
  }, [state.player.currentZoneId]);

  // Handle zone music based on game state (resume after combat/dialogue)
  useEffect(() => {
      const currentZone = state.zones[state.player.currentZoneId];
      if (state.gameState === GameState.EXPLORING && !state.audio.muted && currentZone) {
          // Resume zone music when returning to exploration
          startZoneMusic(currentZone.name);
      } else if (state.gameState === GameState.COMBAT) {
          // Battle music is handled by CombatView, but ensure zone music stops
          stopZoneMusic();
      } else if (state.audio.muted) {
          // Stop zone music when muted
          stopZoneMusic();
      }
  }, [state.gameState, state.audio.muted]);

  // DISABLED: Auto-save on zone change
  // useEffect(() => {
  //     if (state.gameState === GameState.EXPLORING && state.player.currentZoneId) {
  //         const saveTimer = setTimeout(() => {
  //             dispatch({ type: 'SAVE_GAME' });
  //         }, 1000); // Debounce saves by 1 second
  //         return () => clearTimeout(saveTimer);
  //     }
  // }, [state.player.currentZoneId]);

  // DISABLED: Load saved game on mount - Now starts fresh each time
  // Clear any existing saves to ensure clean start
  useEffect(() => {
      localStorage.removeItem('ambassadors-1889-save');
  }, []); // Run once on mount

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
