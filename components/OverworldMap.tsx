
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { GAME_CONSTANTS, LANDMARKS } from '../constants';
import { generatePondering, generateScrutiny, generateImpressionistImage, generateTelegram } from '../services/geminiService';
import { GameState } from '../types';
import PlayerSprite from './PlayerSprite';
import NpcSprite from './NpcSprite';
import MapTile from './MapTile';
import { LucideZoomIn, LucideZoomOut, LucideCrosshair, LucideX, LucideFeather, LucideEye, LucideTowerControl } from 'lucide-react';

// Historical figure names for procedural statue generation
const STATUE_FIGURES = [
  'Maréchal Vauban', 'Voltaire', 'Jean-Jacques Rousseau', 'Denis Diderot',
  'Baron Haussmann', 'Gustave Eiffel', 'Victor Hugo', 'Honoré de Balzac',
  'Napoleon Bonaparte', 'Louis XIV', 'Cardinal Richelieu', 'Molière',
  'Jean de La Fontaine', 'René Descartes', 'Blaise Pascal', 'Marquis de Lafayette'
];

// Get detailed terrain description based on tile character
const getTerrainDescription = (char: string, x: number, y: number, zoneName: string): { name: string; type: string; description: string } => {
  // Use coordinates to generate deterministic "random" names
  const hash = Math.abs(x * 17 + y * 31);

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
    case 'D': return { name: 'Display Case', type: 'EXHIBIT', description: 'A glass case containing precious artifacts.' };
    case 'c': return { name: 'Marble Column', type: 'STRUCTURE', description: 'A fluted column supporting the gallery roof.' };
    case 'r': return { name: 'Persian Carpet', type: 'DECOR', description: 'An intricately woven carpet from the Orient.' };
    case 'B': return { name: 'Banner', type: 'DECOR', description: 'A decorative banner bearing national colors.' };
    case 'u': return { name: `Statue of ${STATUE_FIGURES[hash % STATUE_FIGURES.length]}`, type: 'ARTWORK', description: `A bronze statue honoring ${STATUE_FIGURES[hash % STATUE_FIGURES.length]}.` };
    case 'l': return { name: 'Hanging Lantern', type: 'FIXTURE', description: 'An ornate lantern casting warm light.' };
    case 'q': return { name: 'Potted Palm', type: 'FLORA', description: 'An exotic palm in a decorative planter.' };
    case 'g': return { name: 'Lawn', type: 'TERRAIN', description: 'Manicured grass, soft underfoot.' };
    case 'W': return { name: 'Brick Wall', type: 'STRUCTURE', description: 'A low brick balustrade.' };
    case 'v': return { name: 'Gravel Path', type: 'TERRAIN', description: 'Crushed gravel crunches beneath your feet.' };
    case 'H': return { name: 'Trimmed Hedge', type: 'FLORA', description: 'A neatly clipped boxwood hedge.' };
    case 'w': return { name: 'Flowerbed', type: 'FLORA', description: 'Colorful blooms in neat rows.' };
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

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
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

  // Keyboard movement & Interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.gameState !== GameState.EXPLORING) return;
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

      // Pondering/Contextual Interaction triggered by 'T'
      if (e.key.toLowerCase() === 't') {
          if (!interaction.active) {
              const targetData = getInteractionTarget(player.x, player.y);

              // Use contextual interaction if available, otherwise default to PONDER
              if (targetData.type === 'SCRUTINIZE' || targetData.type === 'USE_DEVICE' || targetData.type === 'EAVESDROP') {
                  dispatch({ type: 'INTERACTION_START', payload: targetData.type as any });
              } else {
                  dispatch({ type: 'INTERACTION_START', payload: 'PONDER' });
              }
          }
          return;
      }

      // World Interaction triggered by Space
      if (e.key === ' ') {
          e.preventDefault(); // Prevent scrolling
          if (!interaction.active && !interaction.isResolving) {
              const targetData = getInteractionTarget(player.x, player.y);

              // Instant pickup for items
              if (targetData.type === 'PICKUP_ITEM') {
                  const item = targetData.target as any;
                  dispatch({ type: 'PICKUP_ITEM', payload: item.id });
                  dispatch({ type: 'ADD_LOG', payload: {
                      id: Date.now().toString(),
                      type: 'SYSTEM',
                      text: `Picked up: ${item.name}`,
                      timestamp: Date.now()
                  }});
                  return;
              }

              // Instant Talk to NPC
              if (targetData.type === 'EAVESDROP') {
                  const npc = targetData.target as NPC;
                  dispatch({ type: 'START_DIALOGUE', payload: npc });
                  return;
              }

              // Instant Enter for doors
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

              // Default: Log current location (no LLM call)
              // Space bar does NOT trigger scrutinize, use_device, or any other hold-to-interact actions
              const tileChar = zone.mapData[player.y]?.[player.x] || '?';
              const tileDesc = tileChar === '.' ? 'cobblestone pavement' :
                               tileChar === ':' ? 'gravel path' :
                               tileChar === ' ' ? 'open ground' :
                               tileChar === 'p' ? 'paved plaza' :
                               tileChar === 's' ? 'stone walkway' :
                               tileChar === 'f' ? 'flagstone' :
                               `terrain (${tileChar})`;

              dispatch({ type: 'ADD_LOG', payload: {
                  id: Date.now().toString(),
                  type: 'NARRATIVE',
                  text: `You are in ${zone.name}, standing on ${tileDesc}.`,
                  timestamp: Date.now()
              }});
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

      // Check if moving onto an exit - trigger zone change immediately
      // Only treat doors on the actual map edges as exits (not internal doors)
      if (char === '+') {
          const isNorthEdge = newY === 0;
          const isSouthEdge = newY === zone.height - 1;
          const isEastEdge = newX === zone.width - 1;
          const isWestEdge = newX === 0;

          // If door is on an edge, it's an exit
          if (isNorthEdge || isSouthEdge || isEastEdge || isWestEdge) {
              let dir: 'N'|'S'|'E'|'W' = 'N';

              if (isNorthEdge) dir = 'N';
              else if (isSouthEdge) dir = 'S';
              else if (isEastEdge) dir = 'E';
              else if (isWestEdge) dir = 'W';

              dispatch({ type: 'CHANGE_ZONE', payload: { targetId: null, direction: dir } });
              return;
          }
          // Otherwise, it's an internal door - fall through to walkable check
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

      // Railing (R), Pylon (P), Stall walls (S), Columns (c), Display cases (D), Statues (u), Brick walls (W), Hedges (H) are impassable
      if (['R', 'P', 'S', 'c', 'D', 'u', 'W', 'H'].includes(char)) {
          dispatch({ type: 'TRIGGER_SHAKE' });
          return;
      }

      // Walkable chars - including esplanade tiles (grass 'g', gravel 'v', flowerbed 'w')
      if ([' ', '.', ':', '+', 'C', 'E', 'G', '[', ']', 'O', 'b', 'n', 'p', 's', 'f', 'e', 'r', 'B', 'l', 'g', 'v', 'w', 'q'].includes(char)) {

          // Handle elevator tile
          if (char === 'e') {
              if (zone.biome === 'TOWER_BASE') {
                  dispatch({ type: 'SHOW_ELEVATOR_MODAL', payload: { direction: 'up' } });
                  return;
              } else if (zone.biome === 'TOWER_PLATFORM') {
                  dispatch({ type: 'SHOW_ELEVATOR_MODAL', payload: { direction: 'down' } });
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
          if (interaction.resultText) dispatch({ type: 'INTERACTION_RESET' });
      }
    };

    const handleKeyUp = async (e: KeyboardEvent) => {
        if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

        // Use ref to get current interaction state (avoids stale closure)
        const currentInteraction = interactionRef.current;

        if (!currentInteraction.active) return;

        // Strict separation: T resolves PONDER, Space resolves others.
        const isT = e.key.toLowerCase() === 't';
        const isSpace = e.key === ' ';

        if (currentInteraction.type === 'PONDER' && !isT) return;
        if (currentInteraction.type !== 'PONDER' && !isSpace) return;

        const p = currentInteraction.progress;
        let text = "";
        let insightType = currentInteraction.type;

        if (p > GAME_CONSTANTS.GOLD_ZONE_MIN && p < GAME_CONSTANTS.GOLD_ZONE_MAX) {
             const targetData = getInteractionTarget(player.x, player.y);

             if (currentInteraction.type === 'PONDER') {
                 text = await generatePondering(zone.name);
                 dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'NARRATIVE', text: `Reflecting: "${text}"`, timestamp: Date.now() } });
                 setInsightModal({ text, type: 'Reflection' });
             } else if (currentInteraction.type === 'USE_DEVICE') {
                 const t = targetData.target as any;
                 if (t.id === 'CABLE') {
                    const msg = await generateTelegram();
                    dispatch({ type: 'INTERACTION_RESOLVE', payload: "Connecting..." });
                    const timeout = setTimeout(() => {
                        dispatch({ type: 'START_MINIGAME', payload: { type: GameState.MINIGAME_TELEGRAPH, message: msg } });
                    }, 500);
                    timeoutRefs.current.push(timeout);
                 } else if (t.id === 'LOOM') {
                     dispatch({ type: 'INTERACTION_RESOLVE', payload: "Inspecting Exhibits..." });
                     const timeout = setTimeout(() => {
                        dispatch({ type: 'START_MINIGAME', payload: { type: GameState.MINIGAME_CURATOR } });
                     }, 500);
                     timeoutRefs.current.push(timeout);
                 } else if (t.id === 'GALA') {
                     dispatch({ type: 'INTERACTION_RESOLVE', payload: "Entering the gala..." });
                     const timeout = setTimeout(() => {
                        dispatch({ type: 'START_MINIGAME', payload: { type: GameState.MINIGAME_FLANEUR } });
                     }, 500);
                     timeoutRefs.current.push(timeout);
                 }
                 return;
             } else if (currentInteraction.type === 'SCRUTINIZE') {
                 const target = targetData.target as any;
                 text = await generateScrutiny(target?.name || "the object");
                 dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'NARRATIVE', text: `Scrutiny: "${text}"`, timestamp: Date.now() } });
                 setInsightModal({ text, type: `Scrutiny: ${target?.name || 'the object'}` });

                 if (target && LANDMARKS[target.id]) {
                     const land = LANDMARKS[target.id];
                     dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'VISION', text: `A vision of ${land.name} forms in your mind...`, timestamp: Date.now() } });
                     const imgUrl = await generateImpressionistImage(land.prompt);
                     if (imgUrl) {
                         dispatch({ type: 'ADD_GALLERY_IMAGE', payload: { id: Date.now().toString(), base64: imgUrl, prompt: land.name, location: zone.name, timestamp: Date.now() } });
                     }
                 }
             } else if (currentInteraction.type === 'EAVESDROP') {
                 const target = targetData.target as any;
                 text = `You overhear ${target.name} muttering about their missing glove.`;
                 dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'NARRATIVE', text, timestamp: Date.now() } });
                 setInsightModal({ text, type: 'Overheard' });
             }
        } else {
             text = currentInteraction.type === 'PONDER' ? "You lose your train of thought." : "You fail to focus.";
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
  }, [player.x, player.y, player.currentZoneId, state.gameState, interaction.active, interaction.type, interaction.progress, state.edgeWarningShown]);

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

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart({ x: 0, y: 0 });
    setDragOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(false);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
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

  const cameraTransform = {
      transform: `scale(${zoom}) translate(calc(50% - ${cameraTargetX * 2}rem - 1rem + ${dragOffsetRem.x}rem), calc(50% - ${cameraTargetY * 2}rem - 1rem + ${dragOffsetRem.y}rem))`,
      cursor: isDragging ? 'grabbing' : 'grab'
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative bg-paper-200/20 rounded overflow-hidden">
      
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

      {/* CAMERA CONTROLS */}
      <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="p-1 bg-paper-100 border border-gold-500 rounded shadow hover:bg-gold-200"><LucideZoomIn size={16} className="text-ink-900"/></button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="p-1 bg-paper-100 border border-gold-500 rounded shadow hover:bg-gold-200"><LucideZoomOut size={16} className="text-ink-900"/></button>
          <button onClick={() => dispatch({ type: 'HIGHLIGHT_ENTITY', payload: null })} className="p-1 bg-paper-100 border border-gold-500 rounded shadow hover:bg-gold-200"><LucideCrosshair size={16} className={highlightedEntityId ? "text-gray-400" : "text-red-500"}/></button>
      </div>
      
      {/* Lighting Definitions */}
      <svg className="absolute w-0 h-0">
          <defs>
              <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="gold" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="orange" stopOpacity="0" />
              </radialGradient>
              {/* Danger glow for void tiles */}
              <radialGradient id="dangerGlow" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="transparent" stopOpacity="0" />
                  <stop offset="70%" stopColor="#DC2626" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity="0.3" />
              </radialGradient>
          </defs>
      </svg>

      {/* MOVABLE MAP CONTAINER */}
      <div
        ref={dragContainerRef}
        className="absolute inset-0 overflow-visible"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none' }}
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
                                    <MapTile char={char} x={x} y={y} themeColor={zone.themeColor} biome={zone.biome} />
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

                {/* World Items Layer */}
                {zoneItems.map(item => (
                    <div
                        key={item.id}
                        className="absolute w-8 h-8 z-4 animate-pulse"
                        style={{ left: `${item.location.x * 2}rem`, top: `${item.location.y * 2}rem` }}
                    >
                        <div className="w-full h-full flex items-center justify-center text-2xl animate-bounce">
                            {item.type === 'BOOK' ? '📖' :
                             item.type === 'DOCUMENT' ? '📜' :
                             item.type === 'TOOL' ? '🔧' :
                             item.type === 'PERSONAL' ? '👔' :
                             item.type === 'ART' ? '🎨' :
                             item.type === 'CONSUMABLE' ? '🍷' :
                             '✨'}
                        </div>
                    </div>
                ))}

                {/* Entity Layer */}
                {zoneNpcs.map(npc => (
                    <div 
                        key={npc.id}
                        className={`absolute w-8 h-8 transition-all duration-1000 ease-linear ${highlightedEntityId === npc.id ? 'animate-bounce z-30' : 'z-5'}`}
                        style={{ left: `${npc.location.x * 2}rem`, top: `${npc.location.y * 2}rem` }}
                    >
                        <NpcSprite npc={npc} />
                        {highlightedEntityId === npc.id && <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-red-500 font-bold text-[10px]">▼</div>}
                    </div>
                ))}

                {/* Player Layer */}
                <div 
                    className="absolute w-8 h-8 transition-all duration-200 ease-out z-10"
                    style={{ left: `${player.x * 2}rem`, top: `${player.y * 2}rem` }}
                >
                    <PlayerSprite direction={player.direction} />
                    
                    {/* Interaction UI */}
                    {interaction.active && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-24 bg-paper-100 border border-ink-900 rounded p-1 shadow-xl z-50 flex flex-col items-center gap-1 animate-fade-in scale-[0.5] origin-bottom">
                        <span className="text-[0.6rem] font-mono uppercase font-bold tracking-wider">{interaction.type}</span>
                        <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden relative">
                            <div className="absolute left-[60%] w-[30%] h-full bg-gold-400/30 z-0"></div>
                            <div 
                                className={`h-full transition-all duration-75 ease-linear relative z-10 ${interaction.progress > 90 ? 'bg-red-500' : interaction.progress > 60 ? 'bg-gold-500' : 'bg-blue-500'}`} 
                                style={{ width: `${interaction.progress}%` }}
                            ></div>
                        </div>
                    </div>
                    )}
                    {interaction.resultText && !interaction.active && (
                    <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-ink-900 text-gold-500 text-xs px-2 py-1 rounded shadow-lg animate-[fade-in_0.5s_ease-out] z-50 scale-50 origin-bottom">
                        {interaction.resultText}
                    </div>
                    )}
                </div>
            </div>
          </div>
      </div>
      
      {/* Footer Info */}
      <div className="h-10 w-full flex justify-between items-center text-xs font-serif text-ink-400 px-4 absolute bottom-0 left-0 bg-paper-100/90 backdrop-blur border-t border-gold-500/30 z-30 gap-2">
        <span className="italic flex-1 truncate">{interaction.active ? "Release in the Gold Zone..." : nearbyLabel}</span>
        <button
          onClick={() => dispatch({ type: 'TELEPORT_TO_COORDS', payload: { x: 0, y: 0 } })}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-600 hover:bg-gold-500 text-ink-900 rounded font-display text-xs font-bold shadow transition-colors shrink-0"
          title="Teleport to the Eiffel Tower"
        >
          <LucideTowerControl size={14} />
          <span className="hidden sm:inline">Eiffel Tower</span>
        </button>
      </div>

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
