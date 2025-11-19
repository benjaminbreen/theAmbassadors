
import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { GameState, NPC, LogEntry, JournalEntry, Item, CombatState, Zone, MinigameState, AudioState, InteractionState, InteractionType, GalleryImage, CrowdAgent, CombatCard, NarratorMessage, BiomeType, PlayerState, LiteraryProject, DialogueState, ChatMessage, Quest } from '../types';
import { INITIAL_PLAYER_STATS, INITIAL_NPCS, GAME_CONSTANTS, STARTING_DECK, CARDS, MORSE_CODE, CURATOR_ITEMS, FLANEUR_LEVELS, BIOMES, HENRY_PROJECTS, STARTING_INVENTORY_POOLS, CLOTHING_DESCRIPTIONS, START_LOCATIONS } from '../constants';
import { generateAssessment, generateTelegram, askNarrator, generateCuratorItem, generateZoneInfo, generateLocationNarrative, generateNpcEncounter, generateDialogue } from '../services/geminiService';
import { playSound, initAudio, startAmbience, stopAmbience } from '../services/audioService';
import { generateZone } from '../services/mapGenerator';
import { generateNPC } from '../services/npcGenerator';
import { generateMinigameReward } from '../services/itemGenerator';
import { getRandomItems } from '../data/historicalItems';

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
}

type Action =
  | { type: 'MOVE_PLAYER'; payload: { x: number; y: number } }
  | { type: 'CHANGE_ZONE'; payload: { targetId: string | null; direction: 'N'|'S'|'E'|'W' } }
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
  | { type: 'TRIGGER_ELEVATOR' }
  | { type: 'ELEVATOR_ARRIVE' }
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
  | { type: 'UPDATE_QUEST_PROGRESS'; payload: { questId: string, increment: number } };

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
    x: Math.floor(startZone.width / 2),
    y: Math.floor(startZone.height / 2),
    currentZoneId: startZoneId,
    hp: 100,
    maxHp: 100,
    xp: 0,
    level: 1,
    inventory: initialInventory,
    stats: INITIAL_PLAYER_STATS,
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
  quests: INITIAL_QUESTS
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
        let spawnX = 2, spawnY = 2;
        if (action.payload.direction === 'N') { spawnX = Math.floor(nextZone.width/2); spawnY = nextZone.height - 2; }
        if (action.payload.direction === 'S') { spawnX = Math.floor(nextZone.width/2); spawnY = 1; }
        if (action.payload.direction === 'E') { spawnX = 1; spawnY = Math.floor(nextZone.height/2); }
        if (action.payload.direction === 'W') { spawnX = nextZone.width - 2; spawnY = Math.floor(nextZone.height/2); }

        return {
            ...state,
            zones: zonesUpdate,
            zoneGrid: gridUpdate,
            player: { ...state.player, currentZoneId: targetId, x: spawnX, y: spawnY },
            log: [...state.log, { id: Date.now().toString(), type: 'NARRATIVE', text: `You enter ${nextZone.name}...`, timestamp: Date.now() }],
            highlightedEntityId: null
        };
    
    case 'POPULATE_ZONE':
        const zId = action.payload;
        const z = state.zones[zId];
        const existingPop = state.npcs.filter(n => n.location.zoneId === zId);
        if (existingPop.length > 0) return state;

        const newNpcs: NPC[] = [];
        const count = Math.floor(Math.random() * 4) + 3;
        for(let i=0; i<count; i++) {
            let px=1, py=1;
            let valid = false;
            let attempts = 0;
            while(!valid && attempts < 20) {
                px = Math.floor(Math.random() * z.width);
                py = Math.floor(Math.random() * z.height);
                if (z.mapData[py]?.[px] === '.' || z.mapData[py]?.[px] === ':') valid = true;
                attempts++;
            }
            if(valid) {
                newNpcs.push(generateNPC(zId, px, py));
            }
        }

        // Spawn world items (2-5 per zone)
        const newWorldItems: Array<Item & { location: { x: number; y: number; zoneId: string } }> = [];
        const itemCount = Math.floor(Math.random() * 4) + 2;
        for(let i=0; i<itemCount; i++) {
            let px=1, py=1;
            let valid = false;
            let attempts = 0;
            while(!valid && attempts < 20) {
                px = Math.floor(Math.random() * z.width);
                py = Math.floor(Math.random() * z.height);
                const char = z.mapData[py]?.[px];
                // Place on walkable terrain, not where NPCs are
                if ((char === '.' || char === ':') && !newNpcs.find(n => n.location.x === px && n.location.y === py)) {
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

        return {
            ...state,
            gameState: GameState.DIALOGUE,
            dialogue: {
                npc: action.payload,
                history: [],
                isTyping: true
            },
            quests: talkQuests
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
                inventory: [...state.player.inventory, action.payload]
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
                inventory: [...state.player.inventory, itemToPickup]
            },
            quests: updatedQuests
        };

    case 'LEAVE_DIALOGUE':
        return { ...state, gameState: GameState.EXPLORING, dialogue: null };

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
    case 'TRIGGER_ELEVATOR':
        if(!state.audio.muted) playSound('ELEVATOR');
        return { ...state, gameState: GameState.ELEVATOR };
    case 'ELEVATOR_ARRIVE':
        const towerId = 'tower_top_' + Date.now();
        const towerZone = generateZone(towerId, 999, 999); 
        towerZone.biome = 'TOWER_LEVEL';
        towerZone.name = "The Summit";
        towerZone.description = "The highest point in Paris.";
        return { 
            ...state, 
            zones: { ...state.zones, [towerId]: towerZone },
            gameState: GameState.EXPLORING, 
            player: { ...state.player, currentZoneId: towerId, x: 5, y: 5 } 
        };
    case 'SET_ASSESSMENT':
        return { ...state, gameState: GameState.ASSESSMENT, assessment: action.payload };
    case 'TOGGLE_MUTE':
        if (state.audio.muted) startAmbience(); else stopAmbience();
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
        // Reward item based on minigame type (50% chance of historical item, 50% AI-generated)
        const minigameType = state.gameState === GameState.MINIGAME_TELEGRAPH ? 'TELEGRAPH' :
                             state.gameState === GameState.MINIGAME_CURATOR ? 'CURATOR' :
                             state.gameState === GameState.MINIGAME_FLANEUR ? 'FLANEUR' : '';

        if (minigameType && Math.random() > 0.5) {
            // Historical item
            const items = getRandomItems(1);
            if (items.length > 0) {
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('add-item', { detail: items[0] }));
                }, 500);
            }
        } else if (minigameType) {
            // AI-generated item
            generateMinigameReward(minigameType).then(item => {
                if (item) {
                    window.dispatchEvent(new CustomEvent('add-item', { detail: item }));
                }
            });
        }

        return { ...state, gameState: GameState.EXPLORING, minigame: null };
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
        const newNpcList = state.npcs.map(agent => {
            if (agent.location.zoneId !== state.player.currentZoneId) return agent;
            if (Math.random() < 0.3) return agent; 
            let nx = agent.location.x, ny = agent.location.y, nd = agent.location.direction;
            const move = Math.random();
            if (move < 0.25) { nx++; nd = 'E'; } else if (move < 0.5) { nx--; nd = 'W'; } else if (move < 0.75) { ny++; nd = 'S'; } else { ny--; nd = 'N'; }
            if (nx < 0 || nx >= currentZone.width || ny < 0 || ny >= currentZone.height) return agent;
            const tileChar = currentZone.mapData[ny]?.[nx];
            if (![' ', '.', ':'].includes(tileChar)) return agent;
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

  // Dialogue Generation Loop
  useEffect(() => {
    if (state.gameState === GameState.DIALOGUE && state.dialogue && state.dialogue.history.length === 0) {
        const npc = state.dialogue.npc;
        const context = state.zones[state.player.currentZoneId].name;
        generateDialogue(npc, "", [], context).then(text => {
             dispatch({ type: 'ADD_DIALOGUE_MSG', payload: { sender: 'NPC', text, timestamp: Date.now() } });
        });
    } else if (state.gameState === GameState.DIALOGUE && state.dialogue && state.dialogue.history.length > 0) {
        const lastMsg = state.dialogue.history[state.dialogue.history.length - 1];
        if (lastMsg.sender === 'PLAYER') {
            const npc = state.dialogue.npc;
            const context = state.zones[state.player.currentZoneId].name;
            const history = state.dialogue.history.map(m => `${m.sender}: ${m.text}`);
            generateDialogue(npc, lastMsg.text, history, context).then(text => {
                dispatch({ type: 'ADD_DIALOGUE_MSG', payload: { sender: 'NPC', text, timestamp: Date.now() } });
            });
        }
    }
  }, [state.gameState, state.dialogue?.history.length]);

  // NPC Proximity Narrative Trigger (Throttled & Gated)
  useEffect(() => {
      if (state.gameState === GameState.EXPLORING) {
          if (isGenerating.current) return;
          // Global throttle check
          if (Date.now() - state.lastGlobalNarratorTrigger < 20000) return;

          let triggered = false;
          state.npcs.forEach(npc => {
             if (triggered) return;
             if (npc.location.zoneId === state.player.currentZoneId) {
                 const dist = Math.sqrt(Math.pow(npc.location.x - state.player.x, 2) + Math.pow(npc.location.y - state.player.y, 2));
                 if (dist <= 1.5) {
                     const lastTrigger = state.npcCooldowns[npc.id] || 0;
                     // 60s cooldown per specific NPC
                     if (Date.now() > lastTrigger + 60000) {
                         triggered = true;
                         isGenerating.current = true;
                         dispatch({ type: 'TRIGGER_GLOBAL_COOLDOWN' });
                         generateNpcEncounter(npc).then(text => {
                             isGenerating.current = false;
                             dispatch({ type: 'TRIGGER_NPC_NARRATIVE', payload: { id: npc.id, text } });
                         });
                     }
                 }
             } 
          });
      }
  }, [state.player.x, state.player.y, state.npcs, state.lastGlobalNarratorTrigger]);

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

  // Zone Narrative Trigger (Throttled)
  useEffect(() => {
      const currentZone = state.zones[state.player.currentZoneId];
      dispatch({ type: 'POPULATE_ZONE', payload: state.player.currentZoneId });
      
      if (!currentZone.narratorDescription) {
           if (!isGenerating.current && (Date.now() - state.lastGlobalNarratorTrigger > 20000)) {
                isGenerating.current = true;
                dispatch({ type: 'TRIGGER_GLOBAL_COOLDOWN' });
                generateLocationNarrative(currentZone.name, currentZone.biome, currentZone.description).then(text => {
                    isGenerating.current = false;
                    dispatch({ type: 'UPDATE_ZONE_NARRATIVE', payload: { id: currentZone.id, text } });
                });
           }
      } else {
           const lastMsg = state.narratorLog[state.narratorLog.length - 1];
           if (!lastMsg || lastMsg.text !== currentZone.narratorDescription) {
                dispatch({ type: 'ADD_NARRATOR_MSG', payload: { id: Date.now().toString(), sender: 'DM', text: currentZone.narratorDescription } });
           }
      }
  }, [state.player.currentZoneId]);

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
