
import React from 'react';
import { useGame } from '../context/GameContext';
import { GameState } from '../types';
import { LucideArrowUp, LucideArrowDown, LucideArrowLeft, LucideArrowRight, LucideHand, LucideEye } from 'lucide-react';

const MobileControls: React.FC = () => {
  const { state, dispatch } = useGame();

  if (state.gameState !== GameState.EXPLORING) return null;

  const handleMove = (dx: number, dy: number) => {
    const zone = state.zones[state.player.currentZoneId];
    const newX = state.player.x + dx;
    const newY = state.player.y + dy;

    // Check bounds
    if (newY < 0 || newY >= zone.height || newX < 0 || newX >= zone.width) {
      dispatch({ type: 'TRIGGER_SHAKE' });
      return;
    }

    const char = zone.mapData[newY][newX];

    // Handle zone transitions
    if (char === '+') {
      const isNorthEdge = newY === 0;
      const isSouthEdge = newY === zone.height - 1;
      const isEastEdge = newX === zone.width - 1;
      const isWestEdge = newX === 0;

      if (isNorthEdge || isSouthEdge || isEastEdge || isWestEdge) {
        let dir: 'N'|'S'|'E'|'W' = 'N';
        if (isNorthEdge) dir = 'N';
        else if (isSouthEdge) dir = 'S';
        else if (isEastEdge) dir = 'E';
        else if (isWestEdge) dir = 'W';

        dispatch({ type: 'CHANGE_ZONE', payload: { targetId: null, direction: dir } });
        return;
      }
    }

    // Walkable check
    if ([' ', '.', ':', '+', 'C', 'E', 'G', '[', ']', 'O', 'b', 'n', 'p', 's', 'f'].includes(char)) {
      if (char === 'E' && zone.biome === 'TOWER_LEVEL') {
        dispatch({ type: 'TRIGGER_ELEVATOR' });
        return;
      }

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
    <div className="fixed bottom-4 left-0 right-0 z-30 flex justify-center gap-4 px-4 md:hidden">
      {/* D-Pad */}
      <div className="bg-ink-900/90 backdrop-blur-sm rounded-lg p-2 border-2 border-gold-600 shadow-2xl">
        <div className="grid grid-cols-3 gap-1">
          <div></div>
          <button
            onTouchStart={(e) => { e.preventDefault(); handleMove(0, -1); }}
            className="w-12 h-12 bg-paper-200 dark:bg-gray-700 rounded flex items-center justify-center text-ink-900 dark:text-paper-100 active:bg-gold-500 transition-colors"
            aria-label="Move Up"
          >
            <LucideArrowUp size={24} />
          </button>
          <div></div>

          <button
            onTouchStart={(e) => { e.preventDefault(); handleMove(-1, 0); }}
            className="w-12 h-12 bg-paper-200 dark:bg-gray-700 rounded flex items-center justify-center text-ink-900 dark:text-paper-100 active:bg-gold-500 transition-colors"
            aria-label="Move Left"
          >
            <LucideArrowLeft size={24} />
          </button>
          <div className="w-12 h-12"></div>
          <button
            onTouchStart={(e) => { e.preventDefault(); handleMove(1, 0); }}
            className="w-12 h-12 bg-paper-200 dark:bg-gray-700 rounded flex items-center justify-center text-ink-900 dark:text-paper-100 active:bg-gold-500 transition-colors"
            aria-label="Move Right"
          >
            <LucideArrowRight size={24} />
          </button>

          <div></div>
          <button
            onTouchStart={(e) => { e.preventDefault(); handleMove(0, 1); }}
            className="w-12 h-12 bg-paper-200 dark:bg-gray-700 rounded flex items-center justify-center text-ink-900 dark:text-paper-100 active:bg-gold-500 transition-colors"
            aria-label="Move Down"
          >
            <LucideArrowDown size={24} />
          </button>
          <div></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            // Simulate space key for interact
            const event = new KeyboardEvent('keydown', { key: ' ' });
            window.dispatchEvent(event);
          }}
          className="w-14 h-14 bg-gold-600 hover:bg-gold-700 active:bg-gold-800 rounded-full flex items-center justify-center text-white shadow-2xl border-2 border-gold-400 transition-colors"
          aria-label="Interact"
        >
          <LucideHand size={28} />
        </button>

        <button
          onTouchStart={(e) => {
            e.preventDefault();
            // Simulate 't' key for observe/ponder
            const event = new KeyboardEvent('keydown', { key: 't' });
            window.dispatchEvent(event);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            const event = new KeyboardEvent('keyup', { key: 't' });
            window.dispatchEvent(event);
          }}
          className="w-14 h-14 bg-ink-900 hover:bg-ink-800 active:bg-ink-700 rounded-full flex items-center justify-center text-gold-400 shadow-2xl border-2 border-gold-600 transition-colors"
          aria-label="Observe (Hold)"
        >
          <LucideEye size={28} />
        </button>
      </div>
    </div>
  );
};

export default MobileControls;
