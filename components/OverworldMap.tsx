
import React, { useEffect, useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { GAME_CONSTANTS, LANDMARKS } from '../constants';
import { generatePondering, generateScrutiny, generateImpressionistImage, generateTelegram } from '../services/geminiService';
import { GameState } from '../types';
import PlayerSprite from './PlayerSprite';
import NpcSprite from './NpcSprite';
import MapTile from './MapTile';
import { LucideZoomIn, LucideZoomOut, LucideCrosshair } from 'lucide-react';

const OverworldMap: React.FC = () => {
  const { state, dispatch } = useGame();
  const { player, npcs, interaction, zones, highlightedEntityId } = state;
  const zone = zones[player.currentZoneId];
  const [nearbyLabel, setNearbyLabel] = useState<string | null>(null);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  // Interaction Helper - Scans 3x3 grid around player
  const getInteractionTarget = (px: number, py: number) => {
      // 1. Check NPC (High Priority)
      const npc = npcs.find(n => Math.abs(n.location.x - px) <= 1.5 && Math.abs(n.location.y - py) <= 1.5 && n.location.zoneId === player.currentZoneId);
      if (npc) return { type: 'EAVESDROP', target: npc };
      
      // 2. Check Neighbors for Landmarks
      for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
              const tx = px + dx;
              const ty = py + dy;
              const char = zone.mapData[ty]?.[tx];
              
              if (char === 'A') return { type: 'SCRUTINIZE', target: { name: "Eiffel Tower Pylon", id: 'TOWER' } };
              
              // Exits
              if (char === '+') return { type: 'ENTER', target: { name: "Next Area", id: 'EXIT' } };

              // Legacy/String checks
              const row = zone.mapData[ty];
              if (row && row.substring(tx, tx + 6) === '[LOOM]') return { type: 'USE_DEVICE', target: { name: "Textile Exhibit", id: 'LOOM' } };
              
              // Char checks
              if (char === 'C') return { type: 'USE_DEVICE', target: { name: "Telegraph Cable", id: 'CABLE' } };
              if (char === 'E') return { type: 'USE_DEVICE', target: { name: "Exhibit", id: 'EXHIBIT' } };
              if (char === 'L') return { type: 'SCRUTINIZE', target: { name: "Gas Lamp", id: 'LAMP' } };
              if (char === 'T') return { type: 'SCRUTINIZE', target: { name: "Chestnut Tree", id: 'TREE' } };
              if (char === 'n') return { type: 'SCRUTINIZE', target: { name: "Discarded Newspaper", id: 'PAPER' } };
              if (char === 'b') return { type: 'SCRUTINIZE', target: { name: "Bench", id: 'BENCH' } }; // Changed from PONDER to keep keys separate
              if (char === 'F') return { type: 'SCRUTINIZE', target: { name: "The Luminous Fountain", id: 'FOUNTAIN' } };
          }
      }
      
      // 3. Default - Nothing specific found
      return { type: 'NONE', target: null };
  };

  // Track timeout IDs for cleanup
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // Keyboard movement & Interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.gameState !== GameState.EXPLORING) return;
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

      // Pondering (Thought) triggered by 'T'
      if (e.key.toLowerCase() === 't') {
          if (!interaction.active) {
              dispatch({ type: 'INTERACTION_START', payload: 'PONDER' });
          }
          return;
      }

      // World Interaction triggered by Space
      if (e.key === ' ') {
          e.preventDefault(); // Prevent scrolling
          if (!interaction.active && !interaction.isResolving) {
              const targetData = getInteractionTarget(player.x, player.y);
              
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

              if (targetData.type !== 'NONE') {
                  dispatch({ type: 'INTERACTION_START', payload: targetData.type as any });
              } else {
                  // Feedback for empty interaction
                  dispatch({ type: 'TRIGGER_SHAKE' });
                  setNearbyLabel("Nothing to interact with here. Press 'T' to Ponder.");
              }
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
      if (char === '+') {
          const midX = zone.width / 2;
          const midY = zone.height / 2;
          let dir: 'N'|'S'|'E'|'W' = 'N';

          if (newY === 0) dir = 'N';
          else if (newY === zone.height - 1) dir = 'S';
          else if (newX === zone.width - 1) dir = 'E';
          else if (newX === 0) dir = 'W';

          dispatch({ type: 'CHANGE_ZONE', payload: { targetId: null, direction: dir } });
          return;
      }
      // Walkable chars ('+' already handled above)
      if ([' ', '.', ':', 'C', 'E', '[', ']', 'O', 'b', 'n', 'p', 's', 'f'].includes(char)) {
          
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
        
        if (!interaction.active) return;

        // Strict separation: T resolves PONDER, Space resolves others.
        const isT = e.key.toLowerCase() === 't';
        const isSpace = e.key === ' ';

        if (interaction.type === 'PONDER' && !isT) return;
        if (interaction.type !== 'PONDER' && !isSpace) return;

        const p = interaction.progress;
        let text = "";
        
        if (p > GAME_CONSTANTS.GOLD_ZONE_MIN && p < GAME_CONSTANTS.GOLD_ZONE_MAX) {
             const targetData = getInteractionTarget(player.x, player.y);
             
             if (interaction.type === 'PONDER') {
                 text = await generatePondering(zone.name);
                 dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'NARRATIVE', text: `Reflecting: "${text}"`, timestamp: Date.now() } });
             } else if (interaction.type === 'USE_DEVICE') {
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
                 } else if (t.id === 'DINNER') {
                     dispatch({ type: 'INTERACTION_RESOLVE', payload: "Entering the Gala..." });
                     const timeout = setTimeout(() => {
                        dispatch({ type: 'START_MINIGAME', payload: { type: GameState.MINIGAME_FLANEUR } });
                     }, 500);
                     timeoutRefs.current.push(timeout);
                 }
                 return;
             } else if (interaction.type === 'SCRUTINIZE') {
                 const target = targetData.target as any;
                 text = await generateScrutiny(target?.name || "the object");
                 dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'NARRATIVE', text: `Scrutiny: "${text}"`, timestamp: Date.now() } });
                 
                 if (target && LANDMARKS[target.id]) {
                     const land = LANDMARKS[target.id];
                     dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'VISION', text: `A vision of ${land.name} forms in your mind...`, timestamp: Date.now() } });
                     const imgUrl = await generateImpressionistImage(land.prompt);
                     if (imgUrl) {
                         dispatch({ type: 'ADD_GALLERY_IMAGE', payload: { id: Date.now().toString(), base64: imgUrl, prompt: land.name, location: zone.name, timestamp: Date.now() } });
                     }
                 }
             } else if (interaction.type === 'EAVESDROP') {
                 const target = targetData.target as any;
                 text = `You overhear ${target.name} muttering about their missing glove.`;
                 dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'NARRATIVE', text, timestamp: Date.now() } });
             }
        } else {
             text = interaction.type === 'PONDER' ? "You lose your train of thought." : "You fail to focus.";
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
  }, [player.x, player.y, player.currentZoneId, state.gameState, interaction.active, interaction.type, interaction.progress]);

  // Update label based on proximity
  useEffect(() => {
      const target = getInteractionTarget(player.x, player.y);
      if (target.type === 'EAVESDROP') setNearbyLabel(`Hold SPACE to Eavesdrop on ${(target.target as any).name}`);
      else if (target.type === 'SCRUTINIZE') setNearbyLabel(`Hold SPACE to Scrutinize ${(target.target as any).name}`);
      else if (target.type === 'USE_DEVICE') setNearbyLabel(`Hold SPACE to Use ${(target.target as any).name}`);
      else if (target.type === 'ENTER') setNearbyLabel(`Press SPACE to Enter ${(target.target as any).name}`);
      else setNearbyLabel("Hold 'T' to Ponder");
  }, [player.x, player.y]);

  const getEntityAt = (x: number, y: number) => {
      const npc = npcs.find(n => n.location.x === x && n.location.y === y && n.location.zoneId === zone.id);
      return npc;
  };

  // CAMERA LOGIC
  const targetEntity = highlightedEntityId 
      ? npcs.find(n => n.id === highlightedEntityId) 
      : null;
  
  const cameraTargetX = targetEntity ? targetEntity.location.x : player.x;
  const cameraTargetY = targetEntity ? targetEntity.location.y : player.y;
  
  const cameraTransform = {
      transform: `scale(${zoom}) translate(calc(50% - ${cameraTargetX * 2}rem - 1rem), calc(50% - ${cameraTargetY * 2}rem - 1rem))`
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative bg-paper-200/20 rounded overflow-hidden">
      
      {/* HEADER / HUD */}
      <div className="absolute top-2 right-2 text-xs font-mono text-ink-400 opacity-80 z-20 flex flex-col items-end pointer-events-none max-w-xs text-right">
        <span className="font-bold bg-paper-100/80 px-1 rounded">{zone.name.toUpperCase()}</span>
        <span className="text-[0.7rem] bg-paper-100/80 px-1 rounded mt-1 leading-tight">{zone.description}</span>
      </div>

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
          </defs>
      </svg>

      {/* MOVABLE MAP CONTAINER */}
      <div className="absolute inset-0 overflow-visible">
          <div className="absolute top-0 left-0 transition-transform duration-500 ease-out origin-top-left" style={cameraTransform}>
            <div className="relative" style={{ width: `${zone.width * 2}rem`, height: `${zone.height * 2}rem` }}>
                {zone.mapData.map((row, y) => (
                    <div key={y} className="flex h-8">
                        {row.split('').map((char, x) => (
                            <div 
                                key={`${x}-${y}`} 
                                className="w-8 h-8 relative"
                                onMouseEnter={() => setHoverLabel(char === '#' ? "Wall" : getEntityAt(x, y)?.name || "Terrain")}
                                onMouseLeave={() => setHoverLabel(null)}
                            >
                                <MapTile char={char} x={x} y={y} themeColor={zone.themeColor} biome={zone.biome} />
                            </div>
                        ))}
                    </div>
                ))}

                {/* Entity Layer */}
                {npcs.filter(n => n.location.zoneId === zone.id).map(npc => (
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
      <div className="h-8 w-full flex justify-between items-center text-xs font-serif text-ink-400 px-4 absolute bottom-0 left-0 bg-paper-100/90 backdrop-blur border-t border-gold-500/30 z-30">
        <span className="italic text-center flex-1">{interaction.active ? "Release in the Gold Zone..." : nearbyLabel}</span>
        {hoverLabel && (
            <span className="absolute bottom-10 right-4 bg-ink-900 text-paper-100 px-2 py-1 rounded shadow-lg font-mono text-[10px] uppercase tracking-wider border border-gold-500 animate-fade-in z-40">
                {hoverLabel}
            </span>
        )}
      </div>
    </div>
  );
};

export default OverworldMap;
