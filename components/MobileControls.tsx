
import React, { useRef } from 'react';
import { useGame } from '../context/GameContext';
import { GameState } from '../types';
import { LucideArrowUp, LucideArrowDown, LucideArrowLeft, LucideArrowRight, LucideHand, LucideEye } from 'lucide-react';
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

  if (state.gameState !== GameState.EXPLORING) return null;

  const { interaction } = state;

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
      // All door characters that trigger zone changes
      const doorChars = ['+', '⋀', '⋁', '⋗', '⋖', '⊓', '⊔', '⊐', '⊏'];
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
      className="fixed bottom-12 left-0 right-0 z-30 flex justify-between items-end px-3 md:hidden animate-fade-slide-up"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* D-Pad - smaller and less opaque, positioned in bottom-left */}
      <div className="bg-ink-900/60 backdrop-blur-sm rounded-lg p-1.5 border border-gold-600/70 shadow-lg transition-all duration-200 hover:shadow-xl hover:border-gold-500/90">
        <div className="grid grid-cols-3 gap-0.5">
          <div></div>
          <button
            onTouchStart={(e) => { e.preventDefault(); handleMove(0, -1); }}
            onClick={() => handleMove(0, -1)}
            className="w-9 h-9 bg-paper-200/80 dark:bg-gray-700/80 rounded flex items-center justify-center text-ink-900 dark:text-paper-100 active:bg-gold-500 active:scale-90 transition-all duration-100 select-none touch-none"
            aria-label="Move Up"
          >
            <LucideArrowUp size={18} />
          </button>
          <div></div>

          <button
            onTouchStart={(e) => { e.preventDefault(); handleMove(-1, 0); }}
            onClick={() => handleMove(-1, 0)}
            className="w-9 h-9 bg-paper-200/80 dark:bg-gray-700/80 rounded flex items-center justify-center text-ink-900 dark:text-paper-100 active:bg-gold-500 active:scale-90 transition-all duration-100 select-none touch-none"
            aria-label="Move Left"
          >
            <LucideArrowLeft size={18} />
          </button>
          <div className="w-9 h-9"></div>
          <button
            onTouchStart={(e) => { e.preventDefault(); handleMove(1, 0); }}
            onClick={() => handleMove(1, 0)}
            className="w-9 h-9 bg-paper-200/80 dark:bg-gray-700/80 rounded flex items-center justify-center text-ink-900 dark:text-paper-100 active:bg-gold-500 active:scale-90 transition-all duration-100 select-none touch-none"
            aria-label="Move Right"
          >
            <LucideArrowRight size={18} />
          </button>

          <div></div>
          <button
            onTouchStart={(e) => { e.preventDefault(); handleMove(0, 1); }}
            onClick={() => handleMove(0, 1)}
            className="w-9 h-9 bg-paper-200/80 dark:bg-gray-700/80 rounded flex items-center justify-center text-ink-900 dark:text-paper-100 active:bg-gold-500 active:scale-90 transition-all duration-100 select-none touch-none"
            aria-label="Move Down"
          >
            <LucideArrowDown size={18} />
          </button>
          <div></div>
        </div>
      </div>

      {/* Action Buttons - positioned in bottom-right */}
      <div className="flex flex-col gap-1.5">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            vibrate(15); // Haptic on interact
            // Simulate space key for interact
            const event = new KeyboardEvent('keydown', { key: ' ' });
            window.dispatchEvent(event);
          }}
          onClick={() => {
            vibrate(15);
            const event = new KeyboardEvent('keydown', { key: ' ' });
            window.dispatchEvent(event);
          }}
          className="w-11 h-11 bg-gold-600/90 hover:bg-gold-700 active:bg-gold-800 active:scale-90 rounded-full flex items-center justify-center text-white shadow-lg border border-gold-400/70 transition-all duration-100 select-none"
          aria-label="Interact"
        >
          <LucideHand size={22} />
        </button>

        {/* Ponder Button with Progress Indicator */}
        <div className="relative">
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              vibrate(10); // Haptic on ponder start
              ponderTouchRef.current = true;
              // Simulate 't' key for observe/ponder
              const event = new KeyboardEvent('keydown', { key: 't' });
              window.dispatchEvent(event);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              if (ponderTouchRef.current) {
                vibrate(20); // Haptic on ponder release
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
            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg border transition-colors select-none ${
              interaction.active
                ? 'bg-gold-600/90 border-gold-400/70 text-white'
                : 'bg-ink-900/60 hover:bg-ink-800/70 active:bg-ink-700/80 border-gold-600/70 text-gold-400'
            }`}
            aria-label="Observe (Hold)"
          >
            <LucideEye size={22} />
          </button>

          {/* Progress Ring for Mobile */}
          {interaction.active && (
            <svg className="absolute inset-0 w-11 h-11 -rotate-90 pointer-events-none" viewBox="0 0 44 44">
              {/* Background circle */}
              <circle
                cx="22"
                cy="22"
                r="19"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="3"
              />
              {/* Gold zone indicator */}
              <circle
                cx="22"
                cy="22"
                r="19"
                fill="none"
                stroke="rgba(212,175,55,0.4)"
                strokeWidth="3"
                strokeDasharray={`${(GAME_CONSTANTS.GOLD_ZONE_MAX - GAME_CONSTANTS.GOLD_ZONE_MIN) / 100 * 119.4} 119.4`}
                strokeDashoffset={`${-GAME_CONSTANTS.GOLD_ZONE_MIN / 100 * 119.4}`}
              />
              {/* Progress indicator */}
              <circle
                cx="22"
                cy="22"
                r="19"
                fill="none"
                stroke={
                  interaction.progress > 90 ? '#ef4444' :
                  interaction.progress > GAME_CONSTANTS.GOLD_ZONE_MIN ? '#d4af37' : '#3b82f6'
                }
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="119.4"
                strokeDashoffset={119.4 - (interaction.progress / 100 * 119.4)}
                style={{ transition: 'stroke-dashoffset 0.075s linear' }}
              />
            </svg>
          )}
        </div>
      </div>

      {/* Mobile Interaction Hint */}
      {interaction.active && (
        <div
          className="fixed left-1/2 -translate-x-1/2 bg-ink-900/80 text-gold-400 px-3 py-1.5 rounded-lg text-xs font-display animate-fade-in z-40 whitespace-nowrap"
          style={{ bottom: 'calc(6rem + env(safe-area-inset-bottom, 0px))' }}
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
