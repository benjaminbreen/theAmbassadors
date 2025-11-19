
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { LucideMenu, LucideX, LucideUser, LucideBackpack, LucideMap, LucideHeart, LucideHelpCircle } from 'lucide-react';

interface MobileHeaderProps {
  onShowAbout: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onShowAbout }) => {
  const { state, dispatch } = useGame();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="md:hidden sticky top-0 z-20 bg-ink-900 border-b-2 border-gold-600 shadow-lg">
      <div className="flex items-center justify-between px-3 py-2">
        {/* Left: Zone name */}
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-gold-500 text-sm font-bold truncate">
            {state.zones[state.player.currentZoneId].name}
          </h1>
          <div className="flex gap-2 text-[10px] text-ink-400">
            <span>HP: {state.player.hp}/{state.player.maxHp}</span>
            <span>•</span>
            <span>LVL: {state.player.level}</span>
          </div>
        </div>

        {/* Right: Menu button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-gold-500 hover:text-gold-400 transition-colors"
          aria-label="Menu"
        >
          {showMenu ? <LucideX size={24} /> : <LucideMenu size={24} />}
        </button>
      </div>

      {/* Dropdown menu */}
      {showMenu && (
        <div className="bg-paper-100 dark:bg-gray-800 border-t border-gold-600 shadow-xl">
          <div className="p-2 space-y-1">
            <button
              onClick={() => {
                dispatch({ type: 'OPEN_PLAYER_MODAL' });
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-ink-900 dark:text-paper-100 hover:bg-gold-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <LucideUser size={18} />
              <span className="font-display text-sm">Character</span>
            </button>

            <button
              onClick={() => {
                dispatch({ type: 'OPEN_PLAYER_MODAL' });
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-ink-900 dark:text-paper-100 hover:bg-gold-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <LucideBackpack size={18} />
              <span className="font-display text-sm">Inventory ({state.player.inventory.length})</span>
            </button>

            <button
              onClick={() => {
                dispatch({ type: 'OPEN_GALLERY' });
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-ink-900 dark:text-paper-100 hover:bg-gold-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <LucideMap size={18} />
              <span className="font-display text-sm">Gallery</span>
            </button>

            <div className="border-t border-ink-200 dark:border-gray-700 my-2"></div>

            <a
              href="https://resobscura.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowMenu(false)}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gold-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <LucideHeart size={18} />
              <span className="font-display text-sm font-bold">Support Project</span>
            </a>

            <button
              onClick={() => {
                onShowAbout();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-ink-900 dark:text-paper-100 hover:bg-gold-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <LucideHelpCircle size={18} />
              <span className="font-display text-sm">About</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileHeader;
