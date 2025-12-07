
import React, { useRef, useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { GameState } from '../types';
import { LucideArrowUp, LucideArrowDown, LucideArrowLeft, LucideArrowRight, LucideHand, LucideEye, LucideSword } from 'lucide-react';
import { GAME_CONSTANTS } from '../constants';
import { isWalkable } from './MapTile/TileRegistry';

// Haptic feedback helper for mobile
const vibrate = (pattern: number | number[] = 10) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

const MobileControls: React.FC = () => {
  const { state, dispatch } = useGame();
  const ponderTouchRef = useRef<boolean>(false);
  const caneChargeRef = useRef<boolean>(false);
  const caneChargeStartRef = useRef<number>(0);
  const [caneChargeProgress, setCaneChargeProgress] = useState(0);

  // Cane charge animation
  useEffect(() => {
    if (!caneChargeRef.current) {
      setCaneChargeProgress(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - caneChargeStartRef.current;
      const progress = Math.min(100, (elapsed / 1500) * 100); // 1.5s for full charge
      setCaneChargeProgress(progress);
    }, 50);

    return () => clearInterval(interval);
  }, [caneChargeRef.current]);

  if (state.gameState !== GameState.EXPLORING) return null;

  const { interaction } = state;

  const handleCaneSwing = (isFullPower: boolean) => {
    vibrate(isFullPower ? [30, 50, 30] : 20);
    // Dispatch shift keydown for cane swing
    const event = new KeyboardEvent('keydown', { key: 'Shift', shiftKey: true });
    window.dispatchEvent(event);
  };

  const handleMove = (dx: number, dy: number) => {
    vibrate(5); // Light haptic on any movement attempt

    const zone = state.zones[state.player.currentZoneId];
    const newX = state.player.x + dx;
    const newY = state.player.y + dy;

    // Check bounds
    if (newY < 0 || newY >= zone.height || newX < 0 || newX >= zone.width) {
      vibrate([10, 50, 10]); // Stronger haptic for collision
      dispatch({ type: 'TRIGGER_SHAKE' });
      return;
    }

    const char = zone.mapData[newY][newX];

    // Define open-air biomes where you can exit on any unblocked border tile
    const openAirBiomes = ['STREET', 'GARDEN', 'ESPLANADE', 'BRIDGE', 'GATE', 'SOUK', 'VILLAGE', 'TROCADERO', 'WATERFALL', 'TOWER_BASE'];
    const isOpenAir = openAirBiomes.includes(zone.biome);

    // Check if at edge
    const isNorthEdge = newY === 0;
    const isSouthEdge = newY === zone.height - 1;
    const isEastEdge = newX === zone.width - 1;
    const isWestEdge = newX === 0;
    const isOnEdge = isNorthEdge || isSouthEdge || isEastEdge || isWestEdge;

    // Zone transition handling
    if (isOnEdge) {
      const walkableTiles = [' ', '.', ':', '+', 'g', 'v', 'r', 'C', '`', ',', 'o', '═'];
      const isWalkableEdge = walkableTiles.includes(char);
      // All door characters that trigger zone changes (including grand door secondary tiles)
      const doorChars = ['+', '⋀', '⋁', '⋗', '⋖', '⊓', '⊔', '⊐', '⊏', '⊤', '⊥', '⊢', '⊣'];
      const isDoor = doorChars.includes(char);

      if (isDoor || (isOpenAir && isWalkableEdge)) {
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
          dispatch({ type: 'PLAYER_FALL' });
          return;
        }
      }
      dispatch({ type: 'TRIGGER_SHAKE' });
      return;
    }

    // Collision handling
    const collisionTiles = ['R', 'P', 'S', 'c', 'D', 'u', 'Y', 'M', 'k', 'X'];
    if (collisionTiles.includes(char)) {
      vibrate([15, 30, 15]); // Collision haptic
      dispatch({ type: 'TRIGGER_SHAKE' });
      // 15% chance to lose HP on collision
      if (Math.random() < 0.15) {
        dispatch({ type: 'ADJUST_HEALTH', payload: -1 });
        dispatch({ type: 'ADD_LOG', payload: {
          id: Date.now().toString(),
          type: 'NARRATIVE',
          text: 'You stumble awkwardly, bruising yourself on the obstacle.',
          timestamp: Date.now()
        }});
      }
      return;
    }

    // Hedges are walkable (with effects handled elsewhere)
    if (char === 'H') {
      const npcHere = state.npcs.find(n => n.location.x === newX && n.location.y === newY && n.location.zoneId === state.player.currentZoneId);
      if (npcHere) {
        dispatch({ type: 'START_DIALOGUE', payload: npcHere });
        return;
      }
      dispatch({ type: 'MOVE_PLAYER', payload: { x: newX, y: newY } });
      return;
    }

    // Full walkable tile list matching OverworldMap
    const walkableChars = [' ', '.', ':', '`', ',', 'o', '+', 'C', 'E', 'G', '[', ']', 'O', 'b', 'n', 'p', 's', 'f', 'e', 'r', 'B', 'l', 'g', 'v', 'w', 'q', 't', 'd', 'z', 'Z', 'W', 'a', 'U', '!', '░', '═', '1', '2', '3', '4'];

    if (walkableChars.includes(char) || isWalkable(char)) {
      // Handle elevator tile
      if (char === 'e') {
        if (zone.biome === 'TOWER_BASE') {
          dispatch({ type: 'SHOW_ELEVATOR_MODAL', payload: { direction: 'up', fromLevel: 'base' } });
          return;
        } else if (zone.biome === 'TOWER_FIRST_FLOOR') {
          dispatch({ type: 'SHOW_ELEVATOR_MODAL', payload: { direction: 'both', fromLevel: 'first' } });
          return;
        } else if (zone.biome === 'TOWER_PLATFORM') {
          dispatch({ type: 'SHOW_ELEVATOR_MODAL', payload: { direction: 'down', fromLevel: 'platform' } });
          return;
        }
      }

      // Legacy elevator
      if (char === 'E' && zone.biome === 'TOWER_LEVEL') {
        dispatch({ type: 'TRIGGER_ELEVATOR' });
        return;
      }

      // Check for NPC
      const npcHere = state.npcs.find(n => n.location.x === newX && n.location.y === newY && n.location.zoneId === state.player.currentZoneId);
      if (npcHere) {
        dispatch({ type: 'START_DIALOGUE', payload: npcHere });
        return;
      }

      dispatch({ type: 'MOVE_PLAYER', payload: { x: newX, y: newY } });
    } else {
      dispatch({ type: 'TRIGGER_SHAKE' });
    }
  };

  return (
    <div
      className="fixed bottom-4 left-0 right-0 z-30 flex justify-between items-end px-3 md:hidden pointer-events-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* D-Pad - glass morphism style, more transparent */}
      <div className="pointer-events-auto bg-black/30 backdrop-blur-md rounded-xl p-1 border border-white/20 shadow-lg">
        <div className="grid grid-cols-3 gap-0.5">
          <div></div>
          <button
            onTouchStart={(e) => { e.preventDefault(); handleMove(0, -1); }}
            onClick={() => handleMove(0, -1)}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 active:bg-gold-500/60 rounded-lg flex items-center justify-center text-white/90 active:scale-95 transition-all duration-75 select-none touch-none"
            aria-label="Move Up"
          >
            <LucideArrowUp size={20} strokeWidth={2.5} />
          </button>
          <div></div>

          <button
            onTouchStart={(e) => { e.preventDefault(); handleMove(-1, 0); }}
            onClick={() => handleMove(-1, 0)}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 active:bg-gold-500/60 rounded-lg flex items-center justify-center text-white/90 active:scale-95 transition-all duration-75 select-none touch-none"
            aria-label="Move Left"
          >
            <LucideArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="w-10 h-10"></div>
          <button
            onTouchStart={(e) => { e.preventDefault(); handleMove(1, 0); }}
            onClick={() => handleMove(1, 0)}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 active:bg-gold-500/60 rounded-lg flex items-center justify-center text-white/90 active:scale-95 transition-all duration-75 select-none touch-none"
            aria-label="Move Right"
          >
            <LucideArrowRight size={20} strokeWidth={2.5} />
          </button>

          <div></div>
          <button
            onTouchStart={(e) => { e.preventDefault(); handleMove(0, 1); }}
            onClick={() => handleMove(0, 1)}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 active:bg-gold-500/60 rounded-lg flex items-center justify-center text-white/90 active:scale-95 transition-all duration-75 select-none touch-none"
            aria-label="Move Down"
          >
            <LucideArrowDown size={20} strokeWidth={2.5} />
          </button>
          <div></div>
        </div>
      </div>

      {/* Action Buttons - glass morphism style */}
      <div className="pointer-events-auto flex flex-col gap-2">
        {/* Cane Swing Button */}
        <div className="relative">
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              vibrate(10);
              caneChargeRef.current = true;
              caneChargeStartRef.current = Date.now();
              setCaneChargeProgress(0);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              if (caneChargeRef.current) {
                const isFullPower = caneChargeProgress >= 100;
                caneChargeRef.current = false;
                handleCaneSwing(isFullPower);
                setCaneChargeProgress(0);
              }
            }}
            onTouchCancel={(e) => {
              e.preventDefault();
              caneChargeRef.current = false;
              setCaneChargeProgress(0);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border backdrop-blur-md transition-all duration-75 select-none ${
              caneChargeProgress >= 100
                ? 'bg-red-500/70 border-red-300/50 text-white animate-pulse'
                : caneChargeProgress > 0
                ? 'bg-orange-500/70 border-orange-300/50 text-white'
                : 'bg-black/30 hover:bg-black/40 active:bg-orange-500/60 border-white/20 text-white/90'
            }`}
            aria-label="Swing Cane"
          >
            <LucideSword size={18} strokeWidth={2} className={caneChargeProgress > 0 ? 'animate-bounce' : ''} />
          </button>
          {/* Charge Ring */}
          {caneChargeProgress > 0 && (
            <svg className="absolute inset-0 w-10 h-10 -rotate-90 pointer-events-none" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="17"
                fill="none"
                stroke={caneChargeProgress >= 100 ? '#ef4444' : '#f97316'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="107"
                strokeDashoffset={107 - (caneChargeProgress / 100 * 107)}
                style={{ transition: 'stroke-dashoffset 0.05s linear' }}
              />
            </svg>
          )}
        </div>

        {/* Interact Button */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            vibrate(15);
            const event = new KeyboardEvent('keydown', { key: ' ' });
            window.dispatchEvent(event);
          }}
          onClick={() => {
            vibrate(15);
            const event = new KeyboardEvent('keydown', { key: ' ' });
            window.dispatchEvent(event);
          }}
          className="w-12 h-12 bg-gold-500/70 backdrop-blur-md hover:bg-gold-500/80 active:bg-gold-600/90 active:scale-95 rounded-full flex items-center justify-center text-white shadow-lg border border-gold-300/50 transition-all duration-75 select-none"
          aria-label="Interact"
        >
          <LucideHand size={24} strokeWidth={2} />
        </button>

        {/* Observe Button with Progress Indicator */}
        <div className="relative">
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              vibrate(10);
              ponderTouchRef.current = true;
              const event = new KeyboardEvent('keydown', { key: 't' });
              window.dispatchEvent(event);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              if (ponderTouchRef.current) {
                vibrate(20);
                ponderTouchRef.current = false;
                const event = new KeyboardEvent('keyup', { key: 't' });
                window.dispatchEvent(event);
              }
            }}
            onTouchCancel={(e) => {
              e.preventDefault();
              if (ponderTouchRef.current) {
                ponderTouchRef.current = false;
                const event = new KeyboardEvent('keyup', { key: 't' });
                window.dispatchEvent(event);
              }
            }}
            onMouseDown={() => {
              vibrate(10);
              ponderTouchRef.current = true;
              const event = new KeyboardEvent('keydown', { key: 't' });
              window.dispatchEvent(event);
            }}
            onMouseUp={() => {
              if (ponderTouchRef.current) {
                vibrate(20);
                ponderTouchRef.current = false;
                const event = new KeyboardEvent('keyup', { key: 't' });
                window.dispatchEvent(event);
              }
            }}
            onMouseLeave={() => {
              if (ponderTouchRef.current) {
                ponderTouchRef.current = false;
                const event = new KeyboardEvent('keyup', { key: 't' });
                window.dispatchEvent(event);
              }
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border backdrop-blur-md transition-all duration-75 select-none ${
              interaction.active
                ? 'bg-blue-500/70 border-blue-300/50 text-white'
                : 'bg-black/30 hover:bg-black/40 active:bg-blue-500/60 border-white/20 text-white/90'
            }`}
            aria-label="Observe (Hold)"
          >
            <LucideEye size={24} strokeWidth={2} />
          </button>

          {/* Progress Ring */}
          {interaction.active && (
            <svg className="absolute inset-0 w-12 h-12 -rotate-90 pointer-events-none" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="21"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="3"
              />
              <circle
                cx="24"
                cy="24"
                r="21"
                fill="none"
                stroke="rgba(212,175,55,0.5)"
                strokeWidth="3"
                strokeDasharray={`${(GAME_CONSTANTS.GOLD_ZONE_MAX - GAME_CONSTANTS.GOLD_ZONE_MIN) / 100 * 132} 132`}
                strokeDashoffset={`${-GAME_CONSTANTS.GOLD_ZONE_MIN / 100 * 132}`}
              />
              <circle
                cx="24"
                cy="24"
                r="21"
                fill="none"
                stroke={
                  interaction.progress > 90 ? '#ef4444' :
                  interaction.progress > GAME_CONSTANTS.GOLD_ZONE_MIN ? '#d4af37' : '#3b82f6'
                }
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="132"
                strokeDashoffset={132 - (interaction.progress / 100 * 132)}
                style={{ transition: 'stroke-dashoffset 0.075s linear' }}
              />
            </svg>
          )}
        </div>
      </div>

      {/* Floating Interaction Hint */}
      {interaction.active && (
        <div
          className="pointer-events-none fixed left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-display z-40 whitespace-nowrap border border-white/20"
          style={{ bottom: 'calc(7rem + env(safe-area-inset-bottom, 0px))' }}
        >
          {interaction.progress > GAME_CONSTANTS.GOLD_ZONE_MIN && interaction.progress < GAME_CONSTANTS.GOLD_ZONE_MAX
            ? '✨ Release now!'
            : 'Hold until gold zone...'}
        </div>
      )}
    </div>
  );
};

export default MobileControls;
