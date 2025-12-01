
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { GAME_CONSTANTS, LANDMARKS } from '../constants';
import { generatePondering, generateScrutiny, generateImpressionistImage, generateTelegram } from '../services/geminiService';
import { generateLocalScrutiny, hasLocalTemplate } from '../data/scrutinyTemplates';
import { GameState, BiomeType } from '../types';
import PlayerSprite from './PlayerSprite';
import NpcSprite from './NpcSprite';
import MapTile from './MapTile';
import MapDefs from './MapDefs';
import { LucideZoomIn, LucideZoomOut, LucideCrosshair, LucideX, LucideFeather, LucideEye, LucideTowerControl } from 'lucide-react';
import { getLocationExhibits } from '../data/historicalExhibits';

// Get detailed terrain description based on tile character AND location
const getTerrainDescription = (char: string, x: number, y: number, zoneName: string): { name: string; type: string; description: string } => {
  // Use coordinates to generate deterministic "random" selection
  const hash = Math.abs(x * 17 + y * 31);

  // Get location-specific exhibit data
  const exhibits = getLocationExhibits(zoneName);

  switch (char) {
    case '#': return { name: 'Stone Wall', type: 'STRUCTURE', description: 'A solid wall of dressed limestone.' };
    case '.': return { name: 'Floor', type: 'TERRAIN', description: 'Polished floor tiles.' };
    case ':': return { name: 'Path', type: 'TERRAIN', description: 'A well-worn path.' };
    case '+': return { name: 'Doorway', type: 'EXIT', description: 'A passage to another area.' };
    case 'T': return { name: 'Chestnut Tree', type: 'FLORA', description: 'A mature chestnut, its leaves rustling in the breeze.' };
    case '~': return { name: 'Water', type: 'TERRAIN', description: 'Clear water reflecting the sky.' };
    case 'F': return { name: 'Fountain', type: 'LANDMARK', description: 'An ornate fountain with cascading water.' };
    case 'f': return { name: 'Fountain Edge', type: 'LANDMARK', description: 'The marble rim of the fountain.' };
    case 'A': return { name: 'Eiffel Tower', type: 'LANDMARK', description: 'The immense iron tower dominates the skyline.' };
    case 'P': return { name: 'Tower Pylon', type: 'STRUCTURE', description: 'A massive iron leg of the Eiffel Tower.' };
    case 'E': return { name: 'Exhibition', type: 'EXHIBIT', description: 'A display of industrial marvels.' };
    case 'C': return { name: 'Carriage', type: 'VEHICLE', description: 'A horse-drawn carriage awaits passengers.' };
    case 'L': return { name: 'Gas Lamp', type: 'FIXTURE', description: 'A cast-iron lamp post with flickering flame.' };
    case 'b': return { name: 'Iron Bench', type: 'FURNITURE', description: 'A decorative park bench for weary visitors.' };
    case 'n': return { name: 'Newspaper', type: 'ITEM', description: 'A discarded copy of Le Figaro.' };
    case 's': return { name: 'Steam Vent', type: 'FIXTURE', description: 'Wisps of steam rise from the machinery below.' };
    case 'K': return { name: 'Kiosk', type: 'STRUCTURE', description: 'A small vendor selling refreshments.' };
    case 'V': return { name: 'Open Air', type: 'DANGER', description: 'Nothing but sky and a fatal drop to Paris below.' };
    case 'R': return { name: 'Iron Railing', type: 'STRUCTURE', description: 'Decorative ironwork railing.' };
    case 'e': return { name: 'Elevator', type: 'TRANSPORT', description: 'The hydraulic elevator to ascend or descend the tower.' };
    case 'O': return { name: 'Telescope', type: 'FIXTURE', description: 'A coin-operated telescope for observing Paris.' };
    case 'S': return { name: 'Stall Partition', type: 'STRUCTURE', description: 'A wooden partition dividing exhibition stalls.' };
    // Display cases - use location-specific content
    case 'D': {
      const displayName = exhibits.displays[hash % exhibits.displays.length];
      return { name: displayName, type: 'EXHIBIT', description: `A glass case displaying: ${displayName}.` };
    }
    case 'c': return { name: 'Marble Column', type: 'STRUCTURE', description: 'A fluted column supporting the gallery roof.' };
    case 'r': return { name: 'Persian Carpet', type: 'DECOR', description: 'An intricately woven carpet from the Orient.' };
    case 'B': return { name: 'Banner', type: 'DECOR', description: 'A decorative banner bearing national colors.' };
    // Statues - use location-specific content
    case 'u': {
      const statueName = exhibits.statues[hash % exhibits.statues.length];
      return { name: statueName, type: 'ARTWORK', description: `${statueName}. Visitors pause to admire the craftsmanship.` };
    }
    case 'l': return { name: 'Hanging Lantern', type: 'FIXTURE', description: 'An ornate lantern casting warm light.' };
    case 'q': return { name: 'Potted Palm', type: 'FLORA', description: 'An exotic palm in a decorative planter.' };
    case 'g': return { name: 'Lawn', type: 'TERRAIN', description: 'Manicured grass, soft underfoot.' };
    case 'W': return { name: 'Brick Wall', type: 'STRUCTURE', description: 'A low brick balustrade.' };
    case 'v': return { name: 'Gravel Path', type: 'TERRAIN', description: 'Crushed gravel crunches beneath your feet.' };
    case 'H': return { name: 'Trimmed Hedge', type: 'FLORA', description: 'A neatly clipped boxwood hedge.' };
    case 'w': return { name: 'Flowerbed', type: 'FLORA', description: 'Colorful blooms in neat rows.' };
    // Machinery - location specific
    case 'M': {
      const machineName = exhibits.displays.find(d => d.toLowerCase().includes('engine') || d.toLowerCase().includes('machine') || d.toLowerCase().includes('dynamo')) || 'Industrial Machinery';
      return { name: machineName, type: 'MACHINERY', description: `${machineName}. The machine hums with latent power.` };
    }
    // Gate tiles
    case 'J': return { name: 'Iron Gate Pillar', type: 'STRUCTURE', description: 'A monumental wrought iron pillar in the Eiffel style.' };
    case 'I': return { name: 'Turnstile', type: 'FIXTURE', description: 'A rotating entrance barrier. Insert your ticket.' };
    case 'N': return { name: 'Ticket Booth', type: 'STRUCTURE', description: 'BILLETS: 1 franc weekdays, 50 centimes Sundays.' };
    case 'Q': return { name: 'Guard Post', type: 'STRUCTURE', description: 'A Sergent de Ville maintains order here.' };
    case 'y': return { name: 'Flagpole', type: 'FIXTURE', description: 'The French tricolore flutters proudly overhead.' };
    // Floor variants
    case '`': return { name: 'Polished Floor', type: 'TERRAIN', description: 'Gleaming marble tiles, meticulously polished.' };
    case ',': return { name: 'Worn Floor', type: 'TERRAIN', description: 'Well-trodden floor tiles, worn smooth by countless visitors.' };
    case 'o': return { name: 'Wooden Floor', type: 'TERRAIN', description: 'Honey-colored oak planks, warm underfoot.' };
    // Chairs
    case '1': return { name: 'Chair', type: 'FURNITURE', description: 'A bentwood café chair facing north.' };
    case '2': return { name: 'Chair', type: 'FURNITURE', description: 'A bentwood café chair facing south.' };
    case '3': return { name: 'Chair', type: 'FURNITURE', description: 'A bentwood café chair facing east.' };
    case '4': return { name: 'Chair', type: 'FURNITURE', description: 'A bentwood café chair facing west.' };
    // Tables and furniture
    case 't': return { name: 'Café Table', type: 'FURNITURE', description: 'A small round table with a marble top.' };
    case 'a': return { name: 'Floor Cushion', type: 'FURNITURE', description: 'An embroidered silk cushion for seated guests.' };
    case 'Z': return { name: 'Brazier', type: 'FIXTURE', description: 'A bronze brazier with glowing coals.' };
    case 'z': return { name: 'Theater Seat', type: 'FURNITURE', description: 'A velvet-upholstered seat for performances.' };
    case 'X': return { name: 'Stage', type: 'STRUCTURE', description: 'A raised wooden platform for performances.' };
    case 'k': return { name: 'Market Stall', type: 'STRUCTURE', description: 'A merchant\'s stall laden with exotic wares.' };
    case 'd': return { name: 'Donkey', type: 'CREATURE', description: 'A patient donkey, part of the Rue du Caire attraction.' };
    case 'G': return { name: 'Glass Floor', type: 'TERRAIN', description: 'Reinforced glass revealing the dizzying drop below.' };
    // Village and special biome tiles
    case 'h': return { name: 'Thatched Hut', type: 'STRUCTURE', description: 'A traditional dwelling with woven palm roof.' };
    case 'U': return { name: 'Fire Pit', type: 'FIXTURE', description: 'A central hearth with smoldering embers.' };
    case '!': return { name: 'Ceremonial Drum', type: 'ARTIFACT', description: 'A large drum carved from a single log.' };
    case '@': return { name: 'Carved Totem', type: 'ARTWORK', description: 'An intricately carved wooden sculpture.' };
    case '%': return { name: 'Palm Tree', type: 'FLORA', description: 'A tropical palm with fanning fronds.' };
    // Trocadéro and waterfall tiles
    case '|': return { name: 'Waterfall', type: 'LANDMARK', description: 'Cascading water thunders down the rocks.' };
    case '^': return { name: 'Cascade Rocks', type: 'TERRAIN', description: 'Moss-covered boulders arranged artfully.' };
    case '(': return { name: 'Moorish Arch', type: 'STRUCTURE', description: 'An ornate horseshoe arch in the Islamic style.' };
    case ')': return { name: 'Minaret', type: 'STRUCTURE', description: 'A slender tower topped with a gilded dome.' };
    // Beaux-Arts fountain components
    case '«': return { name: 'Fountain Basin', type: 'LANDMARK', description: 'The carved stone rim of an ornate fountain.' };
    case '»': return { name: 'Fountain Basin', type: 'LANDMARK', description: 'The carved stone rim of an ornate fountain.' };
    case '≥': return { name: 'Fountain Basin', type: 'LANDMARK', description: 'The carved stone rim of an ornate fountain.' };
    case '≤': return { name: 'Fountain Basin', type: 'LANDMARK', description: 'The carved stone rim of an ornate fountain.' };
    case '╔': return { name: 'Fountain Corner', type: 'LANDMARK', description: 'A decorative corner of the fountain basin.' };
    case '╗': return { name: 'Fountain Corner', type: 'LANDMARK', description: 'A decorative corner of the fountain basin.' };
    case '╚': return { name: 'Fountain Corner', type: 'LANDMARK', description: 'A decorative corner of the fountain basin.' };
    case '╝': return { name: 'Fountain Corner', type: 'LANDMARK', description: 'A decorative corner of the fountain basin.' };
    case '≈': return { name: 'Fountain Water', type: 'LANDMARK', description: 'Crystal clear water ripples in the basin.' };
    case '⌂': return { name: 'Water Jet', type: 'LANDMARK', description: 'A powerful jet of water shoots skyward.' };
    case '♦': return { name: 'Fountain Statue', type: 'ARTWORK', description: 'A bronze figure adorns the fountain center.' };
    // Directional walls
    case '▲': return { name: 'North Wall', type: 'STRUCTURE', description: 'A solid stone wall.' };
    case '▼': return { name: 'South Wall', type: 'STRUCTURE', description: 'A solid stone wall.' };
    case '►': return { name: 'East Wall', type: 'STRUCTURE', description: 'A solid stone wall.' };
    case '◄': return { name: 'West Wall', type: 'STRUCTURE', description: 'A solid stone wall.' };
    case '┐': return { name: 'Wall Corner', type: 'STRUCTURE', description: 'A corner where two walls meet.' };
    case '┌': return { name: 'Wall Corner', type: 'STRUCTURE', description: 'A corner where two walls meet.' };
    case '┘': return { name: 'Wall Corner', type: 'STRUCTURE', description: 'A corner where two walls meet.' };
    case '└': return { name: 'Wall Corner', type: 'STRUCTURE', description: 'A corner where two walls meet.' };
    case '░': return { name: 'Shadow', type: 'TERRAIN', description: 'A shadow cast by nearby structures.' };
    default: return { name: 'Ground', type: 'TERRAIN', description: `Walking surface in ${zoneName}.` };
  }
};

const OverworldMap: React.FC = () => {
  const { state, dispatch } = useGame();
  const { player, npcs, interaction, zones, highlightedEntityId } = state;
  const zone = zones[player.currentZoneId];
  const [nearbyLabel, setNearbyLabel] = useState<string | null>(null);
  const [hoverTerrain, setHoverTerrain] = useState<{ name: string; type: string; description: string } | null>(null);

  // Memoized filters for performance - avoid recalculating on every render
  const zoneNpcs = useMemo(() =>
    npcs.filter(n => n.location.zoneId === zone.id),
    [npcs, zone.id]
  );

  const zoneItems = useMemo(() =>
    state.worldItems.filter(item => item.location.zoneId === zone.id),
    [state.worldItems, zone.id]
  );

  // Set initial zoom based on screen size - mobile starts more zoomed out, desktop more zoomed in
  const getInitialZoom = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 0.65 : 1.3;
    }
    return 1.3;
  };
  const [zoom, setZoom] = useState(getInitialZoom());

  // Drag state for map panning
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });  // Accumulated offset
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });    // Mouse position at drag start
  const [dragStartOffset, setDragStartOffset] = useState({ x: 0, y: 0 }); // Offset at drag start
  const dragContainerRef = useRef<HTMLDivElement>(null);

  // Reset drag offset when zone changes to ensure map is centered
  useEffect(() => {
    setDragOffset({ x: 0, y: 0 });
  }, [zone.id]);

  // Interaction Helper - Scans 3x3 grid around player
  const getInteractionTarget = (px: number, py: number) => {
      // 1. Check for items at exact position (highest priority)
      const itemHere = state.worldItems?.find(item =>
          item.location?.x === px &&
          item.location?.y === py &&
          item.location?.zoneId === player.currentZoneId
      );
      if (itemHere) return { type: 'PICKUP_ITEM', target: itemHere };

      // 2. Check NPC (High Priority)
      const npc = npcs.find(n => Math.abs(n.location.x - px) <= 1.5 && Math.abs(n.location.y - py) <= 1.5 && n.location.zoneId === player.currentZoneId);
      if (npc) return { type: 'EAVESDROP', target: npc };

      // 3. Check Neighbors for Landmarks
      for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
              const tx = px + dx;
              const ty = py + dy;
              const char = zone.mapData[ty]?.[tx];

              if (char === 'A') return { type: 'SCRUTINIZE', target: { name: "Eiffel Tower Pylon", id: 'TOWER' } };

              // Exits - only doors on the actual edges
              if (char === '+') {
                  const isEdge = ty === 0 || ty === zone.height - 1 || tx === 0 || tx === zone.width - 1;
                  if (isEdge) {
                      return { type: 'ENTER', target: { name: "Next Area", id: 'EXIT' } };
                  }
              }

              // Legacy/String checks
              const row = zone.mapData[ty];
              if (row && row.substring(tx, tx + 6) === '[LOOM]') return { type: 'USE_DEVICE', target: { name: "Textile Exhibit", id: 'LOOM' } };

              // Char checks
              if (char === 'C') return { type: 'USE_DEVICE', target: { name: "Telegraph Cable", id: 'CABLE' } };
              if (char === 'E') return { type: 'USE_DEVICE', target: { name: "Exhibit", id: 'EXHIBIT' } };
              if (char === 'e') return { type: 'USE_DEVICE', target: { name: "Elevator", id: 'ELEVATOR' } };
              if (char === 'G') return { type: 'USE_DEVICE', target: { name: "Gala Entrance", id: 'GALA' } };
              if (char === 'O') return { type: 'SCRUTINIZE', target: { name: "Observation Telescope", id: 'TELESCOPE' } };
              if (char === 'P') return { type: 'SCRUTINIZE', target: { name: "Tower Pylon", id: 'PYLON' } };
              if (char === 'L') return { type: 'SCRUTINIZE', target: { name: "Gas Lamp", id: 'LAMP' } };
              if (char === 'T') return { type: 'SCRUTINIZE', target: { name: "Chestnut Tree", id: 'TREE' } };
              if (char === 'n') return { type: 'SCRUTINIZE', target: { name: "Discarded Newspaper", id: 'PAPER' } };
              if (char === 'b') return { type: 'SCRUTINIZE', target: { name: "Bench", id: 'BENCH' } }; // Changed from PONDER to keep keys separate
              if (char === 'F') return { type: 'SCRUTINIZE', target: { name: "The Luminous Fountain", id: 'FOUNTAIN' } };
          }
      }

      // 4. Default - Nothing specific found
      return { type: 'NONE', target: null };
  };

  // Track timeout IDs for cleanup
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // Use refs to track interaction state for event handlers (avoids stale closure issues)
  const interactionRef = useRef(interaction);
  useEffect(() => {
    interactionRef.current = interaction;
  }, [interaction]);

  // State for insight modal
  const [insightModal, setInsightModal] = useState<{ text: string; type: string } | null>(null);

  // Keyboard movement & Interaction - SPACEBAR is sole interaction key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.gameState !== GameState.EXPLORING) return;
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

      // Use ref to get current interaction state (avoids stale closure)
      const currentInteraction = interactionRef.current;

      // SPACE BAR - Universal interaction key
      if (e.key === ' ') {
          e.preventDefault(); // Prevent scrolling

          // If already in an interaction, don't start a new one
          if (currentInteraction.active || currentInteraction.isResolving) return;

          const targetData = getInteractionTarget(player.x, player.y);

          // INSTANT ACTIONS - These happen immediately on press

          // 1. Pick up items (on same tile)
          if (targetData.type === 'PICKUP_ITEM') {
              const item = targetData.target as any;
              dispatch({ type: 'PICKUP_ITEM', payload: item.id });
              dispatch({ type: 'ADD_LOG', payload: {
                  id: Date.now().toString(),
                  type: 'SYSTEM',
                  text: `Picked up: ${item.name}`,
                  timestamp: Date.now()
              }});
              // Grant small inspiration for finding items
              dispatch({ type: 'GAIN_INSPIRATION', payload: { amount: 2, source: `Found ${item.name}` } });
              return;
          }

          // 2. Talk to NPCs (adjacent)
          if (targetData.type === 'EAVESDROP') {
              const npc = targetData.target as NPC;
              dispatch({ type: 'START_DIALOGUE', payload: npc });
              return;
          }

          // 3. Enter doors/passages
          if (targetData.type === 'ENTER') {
               const midX = zone.width / 2;
               const midY = zone.height / 2;
               let dir: 'N'|'S'|'E'|'W' = 'N';
               if (player.y < midY) dir = 'N';
               else if (player.y > midY) dir = 'S';
               else if (player.x > midX) dir = 'E';
               else dir = 'W';

               dispatch({ type: 'CHANGE_ZONE', payload: { targetId: null, direction: dir } });
               return;
          }

          // HOLD ACTIONS - These require holding spacebar until gold zone

          // 4. Scrutinize objects (furniture, landmarks, displays)
          if (targetData.type === 'SCRUTINIZE') {
              dispatch({ type: 'INTERACTION_START', payload: 'SCRUTINIZE' });
              return;
          }

          // 5. Use devices (telegraph, loom, etc)
          if (targetData.type === 'USE_DEVICE') {
              dispatch({ type: 'INTERACTION_START', payload: 'USE_DEVICE' });
              return;
          }

          // 6. Default: Observe surroundings (replaces PONDER)
          // This is a quick look around - no hold required for basic observation
          const tileChar = zone.mapData[player.y]?.[player.x] || '?';
          const tileDesc = tileChar === '.' ? 'cobblestone pavement' :
                           tileChar === ':' ? 'gravel path' :
                           tileChar === ' ' ? 'open ground' :
                           tileChar === 'p' ? 'paved plaza' :
                           tileChar === 's' ? 'stone walkway' :
                           tileChar === 'f' ? 'flagstone' :
                           tileChar === 'g' ? 'grass' :
                           tileChar === 'v' ? 'vegetation' :
                           `terrain`;

          dispatch({ type: 'ADD_LOG', payload: {
              id: Date.now().toString(),
              type: 'NARRATIVE',
              text: `You pause in ${zone.name}, taking in the ${tileDesc} beneath your feet.`,
              timestamp: Date.now()
          }});

          // Small inspiration gain for observing
          if (Math.random() < 0.3) {
              dispatch({ type: 'GAIN_INSPIRATION', payload: { amount: 1, source: 'A moment of quiet observation' } });
          }
          return;
      }

      // Movement
      let newX = player.x;
      let newY = player.y;

      if (e.key === 'w' || e.key === 'ArrowUp') newY--;
      if (e.key === 's' || e.key === 'ArrowDown') newY++;
      if (e.key === 'a' || e.key === 'ArrowLeft') newX--;
      if (e.key === 'd' || e.key === 'ArrowRight') newX++;

      // Check Bounds (but allow edge tiles for exits)
      if (newY < 0 || newY >= zone.height || newX < 0 || newX >= zone.width) {
          dispatch({ type: 'TRIGGER_SHAKE' });
          return;
      }

      const char = zone.mapData[newY][newX];

      // Define open-air biomes where you can exit on any unblocked border tile
      const openAirBiomes = ['STREET', 'GARDEN', 'ESPLANADE', 'BRIDGE', 'GATE', 'SOUK', 'VILLAGE', 'TROCADERO', 'WATERFALL'];
      const isOpenAir = openAirBiomes.includes(zone.biome);

      // Check if at edge
      const isNorthEdge = newY === 0;
      const isSouthEdge = newY === zone.height - 1;
      const isEastEdge = newX === zone.width - 1;
      const isWestEdge = newX === 0;
      const isOnEdge = isNorthEdge || isSouthEdge || isEastEdge || isWestEdge;

      // For open-air biomes: allow exit on ANY walkable edge tile (not just doors)
      // For interior biomes: require door tiles for exits
      if (isOnEdge) {
          const walkableTiles = [' ', '.', ':', '+', 'g', 'v', 'r', 'C', '`', ',', 'o'];
          const isWalkableEdge = walkableTiles.includes(char);

          if (char === '+' || (isOpenAir && isWalkableEdge)) {
              let dir: 'N'|'S'|'E'|'W' = 'N';

              if (isNorthEdge) dir = 'N';
              else if (isSouthEdge) dir = 'S';
              else if (isEastEdge) dir = 'E';
              else if (isWestEdge) dir = 'W';

              dispatch({ type: 'CHANGE_ZONE', payload: { targetId: null, direction: dir } });
              return;
          }
      }
      // Check for void tile (V) - danger zone on tower platform
      if (char === 'V') {
          if (zone.biome === 'TOWER_PLATFORM') {
              if (!state.edgeWarningShown) {
                  // First attempt - show warning
                  dispatch({ type: 'TRIGGER_SHAKE' });
                  dispatch({ type: 'SHOW_EDGE_WARNING' });
                  dispatch({ type: 'ADD_LOG', payload: {
                      id: Date.now().toString(),
                      type: 'NARRATIVE',
                      text: 'The edge looms perilously. The wind tugs at your coat. One more step would be fatal.',
                      timestamp: Date.now()
                  }});
                  return;
              } else {
                  // Second attempt - death by falling
                  dispatch({ type: 'PLAYER_FALL' });
                  return;
              }
          }
          // Outside tower platform, void is just impassable
          dispatch({ type: 'TRIGGER_SHAKE' });
          return;
      }

      // Impassable objects: Railing (R), Pylon (P), Stall walls (S), Columns (c), Display cases (D),
      // Statues (u), Brick walls (Y), Hedges (H), Machinery (M), Market stalls (k), Stage (X)
      if (['R', 'P', 'S', 'c', 'D', 'u', 'Y', 'H', 'M', 'k', 'X'].includes(char)) {
          dispatch({ type: 'TRIGGER_SHAKE' });
          return;
      }

      // Walkable chars - floor tiles, decorative objects you can walk past/through
      // Includes: floor variants (space, dot, colon, backtick, comma, o), path, doors, carriages,
      // exhibits, glass floor, telescope, bench, newspaper, puddle, steam, fountain edge, elevator,
      // carpet, banner, lantern, grass, gravel, flowerbed, plants, tables, donkey, seats, brazier,
      // windows, cushions, water pools, fire pits, drums
      if ([' ', '.', ':', '`', ',', 'o', '+', 'C', 'E', 'G', '[', ']', 'O', 'b', 'n', 'p', 's', 'f', 'e', 'r', 'B', 'l', 'g', 'v', 'w', 'q', 't', 'd', 'z', 'Z', 'W', 'a', 'U', '!'].includes(char)) {

          // Handle elevator tile - Tower has 3 levels: Base (ground) -> First Floor (57m) -> Platform (115m)
          if (char === 'e') {
              if (zone.biome === 'TOWER_BASE') {
                  // Ground level - can only go up to First Floor
                  dispatch({ type: 'SHOW_ELEVATOR_MODAL', payload: { direction: 'up', fromLevel: 'base' } });
                  return;
              } else if (zone.biome === 'TOWER_FIRST_FLOOR') {
                  // First Floor - can go up to Platform or down to Base
                  dispatch({ type: 'SHOW_ELEVATOR_MODAL', payload: { direction: 'both', fromLevel: 'first' } });
                  return;
              } else if (zone.biome === 'TOWER_PLATFORM') {
                  // Top Platform - can only go down to First Floor
                  dispatch({ type: 'SHOW_ELEVATOR_MODAL', payload: { direction: 'down', fromLevel: 'platform' } });
                  return;
              }
          }

          // Legacy elevator handling
          if (char === 'E' && zone.biome === 'TOWER_LEVEL') {
              dispatch({ type: 'TRIGGER_ELEVATOR' });
              return;
          }

          const npcHere = npcs.find(n => n.location.x === newX && n.location.y === newY && n.location.zoneId === player.currentZoneId);
          if (npcHere) {
              dispatch({ type: 'START_DIALOGUE', payload: npcHere });
              return;
          }

          dispatch({ type: 'MOVE_PLAYER', payload: { x: newX, y: newY } });
          if (currentInteraction.resultText) dispatch({ type: 'INTERACTION_RESET' });
      }
    };

    const handleKeyUp = async (e: KeyboardEvent) => {
        if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

        // Use ref to get current interaction state (avoids stale closure)
        const currentInteraction = interactionRef.current;

        if (!currentInteraction.active) return;

        // Only spacebar releases interactions now
        if (e.key !== ' ') return;

        const p = currentInteraction.progress;
        let text = "";

        if (p > GAME_CONSTANTS.GOLD_ZONE_MIN && p < GAME_CONSTANTS.GOLD_ZONE_MAX) {
             const targetData = getInteractionTarget(player.x, player.y);

             if (currentInteraction.type === 'USE_DEVICE') {
                 const t = targetData.target as any;
                 if (t?.id === 'CABLE') {
                    const msg = await generateTelegram();
                    dispatch({ type: 'INTERACTION_RESOLVE', payload: "Connecting..." });
                    const timeout = setTimeout(() => {
                        dispatch({ type: 'START_MINIGAME', payload: { type: GameState.MINIGAME_TELEGRAPH, message: msg } });
                    }, 500);
                    timeoutRefs.current.push(timeout);
                 } else if (t?.id === 'LOOM') {
                     dispatch({ type: 'INTERACTION_RESOLVE', payload: "Inspecting Exhibits..." });
                     const timeout = setTimeout(() => {
                        dispatch({ type: 'START_MINIGAME', payload: { type: GameState.MINIGAME_CURATOR } });
                     }, 500);
                     timeoutRefs.current.push(timeout);
                 } else if (t?.id === 'GALA') {
                     dispatch({ type: 'INTERACTION_RESOLVE', payload: "Entering the gala..." });
                     const timeout = setTimeout(() => {
                        dispatch({ type: 'START_MINIGAME', payload: { type: GameState.MINIGAME_FLANEUR } });
                     }, 500);
                     timeoutRefs.current.push(timeout);
                 }
                 return;
             } else if (currentInteraction.type === 'SCRUTINIZE') {
                 const target = targetData.target as any;
                 const objectId = target?.id || '';
                 const objectName = target?.name || 'the object';
                 const biome = zone?.biome as BiomeType | undefined;
                 const malaise = state.player.stats.malaise || 0;

                 // Use local templates for common objects, LLM for special/unknown ones
                 if (hasLocalTemplate(objectId)) {
                     text = generateLocalScrutiny(objectId, objectName, biome, malaise);
                 } else {
                     // Fall back to LLM for unknown objects
                     text = await generateScrutiny(objectName);
                 }

                 dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'NARRATIVE', text: `Scrutiny: "${text}"`, timestamp: Date.now() } });
                 setInsightModal({ text, type: `Scrutiny: ${objectName}` });

                 // Grant inspiration for successful scrutiny
                 dispatch({ type: 'GAIN_INSPIRATION', payload: { amount: 5, source: `Examined ${objectName}` } });

                 if (target && LANDMARKS[target.id]) {
                     const land = LANDMARKS[target.id];
                     dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'VISION', text: `A vision of ${land.name} forms in your mind...`, timestamp: Date.now() } });
                     const imgUrl = await generateImpressionistImage(land.prompt);
                     if (imgUrl) {
                         dispatch({ type: 'ADD_GALLERY_IMAGE', payload: { id: Date.now().toString(), base64: imgUrl, prompt: land.name, location: zone.name, timestamp: Date.now() } });
                         // Extra inspiration for capturing an image
                         dispatch({ type: 'GAIN_INSPIRATION', payload: { amount: 10, source: `Captured vision of ${land.name}` } });
                     }
                 }
             }
        } else {
             text = "You fail to focus.";
             dispatch({ type: 'TRIGGER_SHAKE' });
        }

        dispatch({ type: 'INTERACTION_RESOLVE', payload: text });
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        // Clear all pending timeouts
        timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
        timeoutRefs.current = [];
    };
  // Note: We use refs for interaction state to avoid stale closures, so we don't need interaction in deps
  }, [player.x, player.y, player.currentZoneId, state.gameState, state.edgeWarningShown]);

  // Update label based on proximity
  useEffect(() => {
      const target = getInteractionTarget(player.x, player.y);
      if (target.type === 'PICKUP_ITEM') {
          setNearbyLabel(`Press SPACE to pick up ${(target.target as any).name}`);
      } else if (target.type === 'EAVESDROP') {
          setNearbyLabel(`Press SPACE to talk to ${(target.target as any).name} | Hold 'T' to eavesdrop`);
      } else if (target.type === 'SCRUTINIZE') {
          setNearbyLabel(`Press SPACE to observe | Hold 'T' to scrutinize ${(target.target as any).name}`);
      } else if (target.type === 'USE_DEVICE') {
          setNearbyLabel(`Press SPACE to observe | Hold 'T' to use ${(target.target as any).name}`);
      } else if (target.type === 'ENTER') {
          setNearbyLabel(`Press SPACE to Enter ${(target.target as any).name}`);
      } else {
          setNearbyLabel("Press SPACE to observe | Hold 'T' to Ponder");
      }
  }, [player.x, player.y]);

  const getEntityAt = (x: number, y: number) => {
      const npc = npcs.find(n => n.location.x === x && n.location.y === y && n.location.zoneId === zone.id);
      return npc;
  };

  // Drag handlers for map panning
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start drag with left mouse button
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragStartOffset({ x: dragOffset.x, y: dragOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    // Add delta to the starting offset to accumulate panning
    setDragOffset({
      x: dragStartOffset.x + deltaX,
      y: dragStartOffset.y + deltaY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setDragStartOffset({ x: dragOffset.x, y: dragOffset.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;
    setDragOffset({
      x: dragStartOffset.x + deltaX,
      y: dragStartOffset.y + deltaY
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Global mouseup listener to handle drag ending outside container
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(false);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchend', handleGlobalMouseUp);
      return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp);
        window.removeEventListener('touchend', handleGlobalMouseUp);
      };
    }
  }, [isDragging]);

  // CAMERA LOGIC
  const targetEntity = highlightedEntityId
      ? npcs.find(n => n.id === highlightedEntityId)
      : null;

  const cameraTargetX = targetEntity ? targetEntity.location.x : player.x;
  const cameraTargetY = targetEntity ? targetEntity.location.y : player.y;

  // Apply drag offset to camera transform (convert px to rem, accounting for zoom)
  const dragOffsetRem = {
    x: dragOffset.x / (16 * zoom),
    y: dragOffset.y / (16 * zoom)
  };

  // Get container dimensions for proper centering
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Use ResizeObserver for more reliable size tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      setContainerSize({
        width: container.clientWidth,
        height: container.clientHeight
      });
    };

    // Initial size
    updateSize();

    // Use ResizeObserver for responsive updates
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  // Calculate camera position to center on player, with edge clamping
  const hasContainerSize = containerSize.width > 0 && containerSize.height > 0;
  const playerPixelX = cameraTargetX * 32; // 2rem = 32px
  const playerPixelY = cameraTargetY * 32;

  // Map dimensions in pixels
  const mapPixelWidth = zone.width * 32;
  const mapPixelHeight = zone.height * 32;

  // Viewport dimensions (accounting for zoom)
  const viewportWidth = hasContainerSize ? containerSize.width / zoom : 800;
  const viewportHeight = hasContainerSize ? containerSize.height / zoom : 600;

  // Maximum empty space allowed at edges (1-2 tiles = 32-64px)
  const maxEdgePadding = 48; // ~1.5 tiles of empty space allowed

  // Calculate ideal offset to center on player
  let offsetX = (viewportWidth / 2) - playerPixelX - 16;
  let offsetY = (viewportHeight / 2) - playerPixelY - 16;

  // Clamp offsets to prevent showing too much empty space
  // Don't let the map's left edge go further right than maxEdgePadding from viewport left
  const maxOffsetX = maxEdgePadding;
  // Don't let the map's right edge go further left than (viewportWidth - maxEdgePadding)
  const minOffsetX = viewportWidth - mapPixelWidth - maxEdgePadding;

  const maxOffsetY = maxEdgePadding;
  const minOffsetY = viewportHeight - mapPixelHeight - maxEdgePadding;

  // Apply clamping (only if map is larger than viewport, otherwise center it)
  if (mapPixelWidth > viewportWidth) {
    offsetX = Math.max(minOffsetX, Math.min(maxOffsetX, offsetX));
  } else {
    // Map smaller than viewport - center it
    offsetX = (viewportWidth - mapPixelWidth) / 2;
  }

  if (mapPixelHeight > viewportHeight) {
    offsetY = Math.max(minOffsetY, Math.min(maxOffsetY, offsetY));
  } else {
    // Map smaller than viewport - center it
    offsetY = (viewportHeight - mapPixelHeight) / 2;
  }

  const cameraTransform = hasContainerSize
    ? {
        transform: `scale(${zoom}) translate(${offsetX + dragOffsetRem.x * 16}px, ${offsetY + dragOffsetRem.y * 16}px)`,
        transformOrigin: '0 0',
        cursor: isDragging ? 'grabbing' : 'grab'
      }
    : {
        // Fallback: use CSS calc with 50vw/50vh while measuring
        transform: `scale(${zoom}) translate(calc(50vw / ${zoom} - ${playerPixelX + 16}px), calc(40vh / ${zoom} - ${playerPixelY + 16}px))`,
        transformOrigin: '0 0',
        cursor: isDragging ? 'grabbing' : 'grab'
      };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center relative bg-paper-200/20 rounded overflow-hidden">
      
      {/* Terrain Info Panel - Bottom Left */}
      {hoverTerrain && (
        <div className="absolute bottom-14 left-4 z-30 bg-ink-900/95 border-l-4 border-gold-500 px-4 py-3 rounded-r shadow-xl max-w-xs animate-fade-in pointer-events-none">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display text-sm text-gold-400 font-bold uppercase tracking-wide">{hoverTerrain.name}</span>
          </div>
          <span className="text-[10px] font-mono text-gold-600/80 uppercase tracking-wider">{hoverTerrain.type}</span>
          <p className="text-xs text-paper-200/80 font-serif mt-1 leading-relaxed">{hoverTerrain.description}</p>
        </div>
      )}

      {/* CAMERA CONTROLS - Left side */}
      <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="p-1 bg-paper-100 border border-gold-500 rounded shadow hover:bg-gold-200" title="Zoom in"><LucideZoomIn size={16} className="text-ink-900"/></button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="p-1 bg-paper-100 border border-gold-500 rounded shadow hover:bg-gold-200" title="Zoom out"><LucideZoomOut size={16} className="text-ink-900"/></button>
          <button onClick={() => { setDragOffset({ x: 0, y: 0 }); dispatch({ type: 'HIGHLIGHT_ENTITY', payload: null }); }} className="p-1 bg-paper-100 border border-gold-500 rounded shadow hover:bg-gold-200" title="Re-center on player"><LucideCrosshair size={16} className={dragOffset.x !== 0 || dragOffset.y !== 0 ? "text-red-500" : "text-ink-900"}/></button>
      </div>

      {/* NAVIGATION BUTTON - Upper right */}
      <div className="absolute top-2 right-2 z-20">
          <button
            onClick={() => dispatch({ type: 'TELEPORT_TO_COORDS', payload: { x: 0, y: 0 } })}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-600 hover:bg-gold-500 text-ink-900 rounded font-display text-xs font-bold shadow-lg transition-colors border border-gold-700"
            title="Teleport to the Eiffel Tower"
          >
            <LucideTowerControl size={14} />
            <span>Eiffel Tower</span>
          </button>
      </div>
      
      {/* Shared SVG Definitions for all map tiles */}
      <svg className="absolute w-0 h-0">
          <MapDefs />
      </svg>

      {/* MOVABLE MAP CONTAINER - drag to pan */}
      <div
        ref={dragContainerRef}
        className="absolute inset-0 overflow-visible"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none', touchAction: 'none' }}
      >
          <div className="absolute top-0 left-0 transition-transform ease-out origin-top-left" style={{ ...cameraTransform, transitionDuration: isDragging ? '0ms' : '500ms' }}>
            <div className="relative" style={{ width: `${zone.width * 2}rem`, height: `${zone.height * 2}rem` }}>
                {zone.mapData.map((row, y) => (
                    <div key={y} className="flex h-8">
                        {row.split('').map((char, x) => {
                            // Calculate fog of war based on distance from player
                            const dx = Math.abs(x - player.x);
                            const dy = Math.abs(y - player.y);
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            const maxVisibility = 8; // Tiles fully visible within this range
                            const fogStart = 5; // Fog starts appearing at this distance
                            const fogOpacity = distance <= fogStart ? 0 :
                                Math.min(0.7, (distance - fogStart) / (maxVisibility - fogStart) * 0.7);

                            return (
                                <div
                                    key={`${x}-${y}`}
                                    className="w-8 h-8 relative"
                                    onMouseEnter={() => {
                                        const entity = getEntityAt(x, y);
                                        if (entity) {
                                            setHoverTerrain({ name: entity.name, type: 'NPC', description: entity.profession || 'A visitor to the Fair.' });
                                        } else {
                                            setHoverTerrain(getTerrainDescription(char, x, y, zone.name));
                                        }
                                    }}
                                    onMouseLeave={() => setHoverTerrain(null)}
                                >
                                    <MapTile char={char} x={x} y={y} themeColor={zone.themeColor} biome={zone.biome} zoneName={zone.name} />
                                    {/* Fog of war overlay */}
                                    {fogOpacity > 0 && (
                                        <div
                                            className="absolute inset-0 pointer-events-none bg-ink-900/80"
                                            style={{ opacity: fogOpacity }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}

                {/* World Items Layer - Smaller icons with hover info */}
                {zoneItems.map(item => (
                    <div
                        key={item.id}
                        className="absolute w-8 h-8 z-4 flex items-center justify-center cursor-pointer"
                        style={{ left: `${item.location.x * 2}rem`, top: `${item.location.y * 2}rem` }}
                        onMouseEnter={() => setHoverTerrain({
                            name: item.name,
                            type: item.type,
                            description: item.description || 'A collectible item.'
                        })}
                        onMouseLeave={() => setHoverTerrain(null)}
                    >
                        <div className="text-sm drop-shadow-md">
                            {item.type === 'BOOK' ? '📖' :
                             item.type === 'DOCUMENT' ? '📜' :
                             item.type === 'TOOL' ? '🔧' :
                             item.type === 'PERSONAL' ? '👔' :
                             item.type === 'ART' ? '🎨' :
                             item.type === 'CONSUMABLE' ? '🍷' :
                             item.type === 'CURIOSITY' ? '🔮' :
                             '✨'}
                        </div>
                    </div>
                ))}

                {/* Entity Layer */}
                {zoneNpcs.map(npc => {
                    // Calculate distance from player for proximity indicator
                    const dx = Math.abs(npc.location.x - player.x);
                    const dy = Math.abs(npc.location.y - player.y);
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const isNearby = distance <= 2.5;
                    const isAdjacent = distance <= 1.5;

                    return (
                        <div
                            key={npc.id}
                            className={`absolute w-8 h-8 transition-all duration-1000 ease-linear ${highlightedEntityId === npc.id ? 'animate-bounce z-30' : 'z-5'}`}
                            style={{ left: `${npc.location.x * 2}rem`, top: `${npc.location.y * 2}rem` }}
                        >
                            {/* Proximity glow ring */}
                            {isNearby && !highlightedEntityId && (
                                <div className={`absolute inset-[-4px] rounded-full ${
                                    isAdjacent
                                        ? 'bg-gold-400/40 animate-pulse ring-2 ring-gold-500/60'
                                        : 'bg-gold-300/20 ring-1 ring-gold-400/30'
                                }`} />
                            )}
                            <NpcSprite npc={npc} />
                            {highlightedEntityId === npc.id && <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-red-500 font-bold text-[10px]">▼</div>}
                            {/* "Talk" indicator when adjacent */}
                            {isAdjacent && !highlightedEntityId && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-ink-900/90 text-gold-400 text-[8px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap animate-bounce">
                                    SPACE
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Player Layer */}
                <div
                    className="absolute w-8 h-8 transition-all duration-200 ease-out z-10"
                    style={{ left: `${player.x * 2}rem`, top: `${player.y * 2}rem` }}
                >
                    <PlayerSprite direction={player.direction} />
                </div>
            </div>
          </div>
      </div>

      {/* Vignette Overlay - creates SNES-style darkened edges */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background: `radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(15,15,25,0.4) 70%, rgba(10,10,18,0.7) 100%)`
      }} />

      {/* Art Nouveau Frame - decorative border around the map */}
      <div className="absolute inset-0 pointer-events-none z-11">
        {/* Top border with floral motifs */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-ink-900 via-ink-800 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-4 flex items-center justify-center">
          <svg viewBox="0 0 192 16" className="w-full h-full" preserveAspectRatio="none">
            {/* Central medallion */}
            <circle cx="96" cy="8" r="6" fill="none" stroke="#B8860B" strokeWidth="1"/>
            <circle cx="96" cy="8" r="4" fill="#1A1A2E"/>
            {/* Flowing curves left */}
            <path d="M90 8 Q70 4, 50 8 Q30 12, 10 8" fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.7"/>
            <path d="M90 8 Q70 12, 50 8 Q30 4, 10 8" fill="none" stroke="#B8860B" strokeWidth="0.5" opacity="0.5"/>
            {/* Flowing curves right */}
            <path d="M102 8 Q122 4, 142 8 Q162 12, 182 8" fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.7"/>
            <path d="M102 8 Q122 12, 142 8 Q162 4, 182 8" fill="none" stroke="#B8860B" strokeWidth="0.5" opacity="0.5"/>
            {/* Small decorative dots */}
            <circle cx="50" cy="8" r="2" fill="#B8860B" opacity="0.6"/>
            <circle cx="142" cy="8" r="2" fill="#B8860B" opacity="0.6"/>
          </svg>
        </div>

        {/* Bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-ink-900 via-ink-800 to-transparent" />

        {/* Left border with vertical flourish */}
        <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-ink-900 via-ink-800 to-transparent" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-32">
          <svg viewBox="0 0 12 128" className="w-full h-full" preserveAspectRatio="none">
            <path d="M6 0 Q2 32, 6 64 Q10 96, 6 128" fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.6"/>
            <circle cx="6" cy="64" r="3" fill="none" stroke="#B8860B" strokeWidth="0.5"/>
          </svg>
        </div>

        {/* Right border with vertical flourish */}
        <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-l from-ink-900 via-ink-800 to-transparent" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-32">
          <svg viewBox="0 0 12 128" className="w-full h-full" preserveAspectRatio="none">
            <path d="M6 0 Q10 32, 6 64 Q2 96, 6 128" fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.6"/>
            <circle cx="6" cy="64" r="3" fill="none" stroke="#B8860B" strokeWidth="0.5"/>
          </svg>
        </div>

        {/* Corner ornaments */}
        {/* Top-left corner */}
        <svg viewBox="0 0 24 24" className="absolute top-0 left-0 w-6 h-6">
          <path d="M0 12 Q0 0, 12 0" fill="none" stroke="#B8860B" strokeWidth="2"/>
          <circle cx="8" cy="8" r="2" fill="#B8860B" opacity="0.5"/>
        </svg>
        {/* Top-right corner */}
        <svg viewBox="0 0 24 24" className="absolute top-0 right-0 w-6 h-6">
          <path d="M24 12 Q24 0, 12 0" fill="none" stroke="#B8860B" strokeWidth="2"/>
          <circle cx="16" cy="8" r="2" fill="#B8860B" opacity="0.5"/>
        </svg>
        {/* Bottom-left corner */}
        <svg viewBox="0 0 24 24" className="absolute bottom-0 left-0 w-6 h-6">
          <path d="M0 12 Q0 24, 12 24" fill="none" stroke="#B8860B" strokeWidth="2"/>
          <circle cx="8" cy="16" r="2" fill="#B8860B" opacity="0.5"/>
        </svg>
        {/* Bottom-right corner */}
        <svg viewBox="0 0 24 24" className="absolute bottom-0 right-0 w-6 h-6">
          <path d="M24 12 Q24 24, 12 24" fill="none" stroke="#B8860B" strokeWidth="2"/>
          <circle cx="16" cy="16" r="2" fill="#B8860B" opacity="0.5"/>
        </svg>
      </div>

      {/* Interaction UI - Positioned within game container, not inside transformed map */}
      {interaction.active && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-72 bg-paper-100 border-2 border-gold-600 rounded-lg p-4 shadow-2xl z-[60] flex flex-col items-center gap-2 animate-fade-in">
          <span className="text-base font-display uppercase font-bold tracking-wider text-ink-900">
            {interaction.type === 'PONDER' ? '🧠 Pondering...' : interaction.type}
          </span>
          <p className="text-sm text-ink-600 text-center">Hold T, release in the gold zone!</p>
          <div className="w-full h-6 bg-gray-300 rounded-full overflow-hidden relative border-2 border-ink-400">
            {/* Gold zone indicator (60-90%) */}
            <div className="absolute left-[60%] w-[30%] h-full bg-gold-400/60 z-0 border-x-2 border-gold-600"></div>
            {/* Progress bar */}
            <div
              className={`h-full transition-all duration-75 ease-linear relative z-10 ${
                interaction.progress > 90 ? 'bg-red-500' :
                interaction.progress > 60 ? 'bg-green-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${interaction.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between w-full text-xs font-mono text-ink-500">
            <span>0%</span>
            <span className="text-gold-600 font-bold">GOLD ZONE</span>
            <span>100%</span>
          </div>
        </div>
      )}
      {interaction.resultText && !interaction.active && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-ink-900 text-gold-400 text-base px-6 py-3 rounded-lg shadow-2xl z-[60] animate-fade-in max-w-md text-center">
          {interaction.resultText}
        </div>
      )}


      {/* Insight Modal */}
      {insightModal && (
        <div className="fixed inset-0 bg-ink-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setInsightModal(null)}>
          <div
            className="bg-paper-100 dark:bg-gray-900 border-2 border-gold-600 rounded-lg shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gold-600/20 border-b border-gold-600/30 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-600/30 flex items-center justify-center">
                  {insightModal.type === 'Reflection' ? (
                    <LucideFeather className="text-gold-700" size={20} />
                  ) : (
                    <LucideEye className="text-gold-700" size={20} />
                  )}
                </div>
                <div>
                  <h3 className="font-display text-xl text-ink-900 dark:text-paper-100">{insightModal.type}</h3>
                  <p className="text-sm text-ink-500 dark:text-gray-400 font-serif italic">{zone.name}</p>
                </div>
              </div>
              <button
                onClick={() => setInsightModal(null)}
                className="p-2 hover:bg-ink-900/10 rounded-full transition-colors"
              >
                <LucideX size={20} className="text-ink-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="relative">
                <span className="absolute -top-2 -left-2 text-6xl text-gold-400/30 font-serif">"</span>
                <p className="font-serif text-lg text-ink-800 dark:text-paper-100 leading-relaxed pl-6 pr-4 italic">
                  {insightModal.text}
                </p>
                <span className="absolute -bottom-4 right-0 text-6xl text-gold-400/30 font-serif">"</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gold-600/20 flex justify-end">
              <button
                onClick={() => setInsightModal(null)}
                className="px-6 py-2 bg-gold-600 hover:bg-gold-700 text-white rounded font-display text-sm transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverworldMap;
