
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import {
  LucideMenu, LucideX, LucideUser, LucideBackpack, LucideMap, LucideHeart, LucideHelpCircle,
  LucideBookOpen, LucideImage, LucidePenTool, LucideVolume2, LucideVolumeX
} from 'lucide-react';
import { HealthStatus } from '../types';

// Local helper to get health status
const getHealthStatus = (hp: number, maxHp: number): HealthStatus => {
  const pct = (hp / maxHp) * 100;
  if (pct >= 80) return 'FINE';
  if (pct >= 60) return 'TIRED';
  if (pct >= 40) return 'UNWELL';
  if (pct >= 20) return 'INJURED';
  return 'CRITICAL';
};

// Format time as "3:45 PM"
const formatTime = (hour: number, minute: number): string => {
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, '0');
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h}:${m} ${ampm}`;
};

interface MobileHeaderProps {
  onShowAbout: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onShowAbout }) => {
  const { state, dispatch } = useGame();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const healthStatus = getHealthStatus(state.player.hp, state.player.maxHp);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside as any);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside as any);
    };
  }, [showMenu]);

  // Health bar color based on status
  const getHealthColor = () => {
    switch (healthStatus) {
      case 'CRITICAL': return 'bg-red-600';
      case 'INJURED': return 'bg-orange-500';
      case 'UNWELL': return 'bg-yellow-500';
      case 'TIRED': return 'bg-yellow-400';
      default: return 'bg-green-500';
    }
  };

  return (
    <div
      ref={menuRef}
      className="md:hidden sticky top-0 z-20 bg-ink-900 border-b-2 border-gold-600 shadow-lg"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="flex items-center justify-between px-3 py-2">
        {/* Left: Zone name and stats */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-gold-500 text-sm font-bold truncate">
              {state.zones[state.player.currentZoneId].name}
            </h1>
            <span className="text-[10px] text-ink-500 font-mono shrink-0">
              {formatTime(state.gameTime?.hour ?? 12, state.gameTime?.minute ?? 0)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {/* Mini health bar */}
            <div className="flex items-center gap-1">
              <div className="w-16 h-1.5 bg-ink-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getHealthColor()} transition-all duration-300`}
                  style={{ width: `${(state.player.hp / state.player.maxHp) * 100}%` }}
                />
              </div>
              <span className="text-[9px] text-ink-400">{state.player.hp}</span>
            </div>
            {/* Mini composure bar */}
            <div className="flex items-center gap-1">
              <div className="w-12 h-1.5 bg-ink-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${(state.player.composure / state.player.maxComposure) * 100}%` }}
                />
              </div>
              <span className="text-[9px] text-ink-400">{state.player.composure}</span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-1">
          {/* Sound toggle */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_MUTE' })}
            className="p-1.5 text-ink-400 hover:text-gold-400 transition-colors"
            aria-label={state.audio.muted ? "Unmute" : "Mute"}
          >
            {state.audio.muted ? <LucideVolumeX size={18} /> : <LucideVolume2 size={18} />}
          </button>

          {/* Menu button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gold-500 hover:text-gold-400 transition-colors"
            aria-label="Menu"
          >
            {showMenu ? <LucideX size={24} /> : <LucideMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      {showMenu && (
        <div className="bg-paper-100 dark:bg-gray-800 border-t border-gold-600 shadow-xl max-h-[70vh] overflow-y-auto">
          <div className="p-2 space-y-1">
            {/* Character section */}
            <div className="text-[10px] uppercase tracking-wider text-ink-400 dark:text-gray-500 px-3 pt-2 pb-1 font-mono">Character</div>

            <button
              onClick={() => {
                dispatch({ type: 'OPEN_PLAYER_MODAL' });
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-ink-900 dark:text-paper-100 hover:bg-gold-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <LucideUser size={18} />
              <div className="flex-1">
                <span className="font-display text-sm">Profile & Stats</span>
                <div className="text-[10px] text-ink-500">Level {state.player.level} • {healthStatus}</div>
              </div>
            </button>

            <button
              onClick={() => {
                dispatch({ type: 'OPEN_PLAYER_MODAL' });
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-ink-900 dark:text-paper-100 hover:bg-gold-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <LucideBackpack size={18} />
              <div className="flex-1">
                <span className="font-display text-sm">Inventory</span>
                <div className="text-[10px] text-ink-500">{state.player.inventory.length}/20 items</div>
              </div>
            </button>

            {/* Creative section */}
            <div className="text-[10px] uppercase tracking-wider text-ink-400 dark:text-gray-500 px-3 pt-3 pb-1 font-mono border-t border-ink-200 dark:border-gray-700 mt-2">Creative</div>

            <button
              onClick={() => {
                dispatch({ type: 'OPEN_JOURNAL' });
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-ink-900 dark:text-paper-100 hover:bg-gold-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <LucideBookOpen size={18} />
              <div className="flex-1">
                <span className="font-display text-sm">Journal</span>
                <div className="text-[10px] text-ink-500">Notes & encounters</div>
              </div>
            </button>

            <button
              onClick={() => {
                dispatch({ type: 'OPEN_SKETCHBOOK' });
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-ink-900 dark:text-paper-100 hover:bg-gold-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <LucideImage size={18} />
              <div className="flex-1">
                <span className="font-display text-sm">Sketchbook</span>
                <div className="text-[10px] text-ink-500">{state.sketchbook?.length || 0} impressions</div>
              </div>
            </button>

            <button
              onClick={() => {
                dispatch({ type: 'OPEN_MUSING_MODE' });
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-ink-900 dark:text-paper-100 hover:bg-gold-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <LucidePenTool size={18} />
              <div className="flex-1">
                <span className="font-display text-sm">Write</span>
                <div className="text-[10px] text-ink-500">Compose your thoughts</div>
              </div>
            </button>

            {/* Navigation section */}
            <div className="text-[10px] uppercase tracking-wider text-ink-400 dark:text-gray-500 px-3 pt-3 pb-1 font-mono border-t border-ink-200 dark:border-gray-700 mt-2">Navigation</div>

            <button
              onClick={() => {
                dispatch({ type: 'OPEN_GALLERY' });
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-ink-900 dark:text-paper-100 hover:bg-gold-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <LucideMap size={18} />
              <div className="flex-1">
                <span className="font-display text-sm">World Map</span>
                <div className="text-[10px] text-ink-500">Explore the Exposition</div>
              </div>
            </button>

            {/* System section */}
            <div className="text-[10px] uppercase tracking-wider text-ink-400 dark:text-gray-500 px-3 pt-3 pb-1 font-mono border-t border-ink-200 dark:border-gray-700 mt-2">System</div>

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
              <span className="font-display text-sm">About & Help</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileHeader;
