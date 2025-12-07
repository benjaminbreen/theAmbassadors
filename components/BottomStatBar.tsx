import React from 'react';
import { useGame } from '../context/GameContext';
import { HealthStatus } from '../types';
import { LucideBackpack, LucideEye, LucideStar, LucideHeart, LucideSparkles, LucideBrain } from 'lucide-react';
import { playSound } from '../services/audioService';

// Brass button CSS styles
const brassButtonStyles = `
  .brass-inventory-btn {
    padding: 4px 12px;
    border-radius: 4px;
    border: 1px solid #654321;
    outline: 1px solid #B8960B;
    outline-offset: -2px;
    background:
      repeating-radial-gradient(
        circle at center,
        transparent 0px,
        transparent 1px,
        rgba(139,105,20,0.03) 1px,
        rgba(139,105,20,0.03) 2px
      ),
      linear-gradient(145deg, #D4A84B 0%, #C9963C 20%, #B8860B 45%, #A67C00 70%, #8B6508 100%);
    box-shadow:
      0 3px 6px rgba(0,0,0,0.4),
      0 1px 2px rgba(0,0,0,0.3),
      inset 0 2px 3px rgba(255,223,128,0.5),
      inset 0 -2px 3px rgba(101,67,33,0.4);
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    font-weight: bold;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #2D1F0D;
  }
  .brass-inventory-btn::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 15%;
    right: 15%;
    height: 40%;
    background: linear-gradient(
      180deg,
      rgba(255,245,200,0.6) 0%,
      rgba(255,235,180,0.2) 40%,
      rgba(255,235,180,0) 100%
    );
    border-radius: 3px 3px 40% 40%;
    pointer-events: none;
    transition: all 0.2s ease;
  }
  .brass-inventory-btn:hover {
    background:
      repeating-radial-gradient(
        circle at center,
        transparent 0px,
        transparent 1px,
        rgba(139,105,20,0.02) 1px,
        rgba(139,105,20,0.02) 2px
      ),
      linear-gradient(145deg, #E8C86C 0%, #DDB85C 20%, #D4A84B 45%, #C9963C 70%, #B8860B 100%);
    box-shadow:
      0 4px 8px rgba(0,0,0,0.45),
      0 2px 3px rgba(0,0,0,0.3),
      inset 0 2px 4px rgba(255,235,180,0.6),
      inset 0 -2px 3px rgba(101,67,33,0.3),
      0 0 10px rgba(212,168,75,0.25);
  }
  .brass-inventory-btn:hover::before {
    left: 20%;
    right: 10%;
    background: linear-gradient(
      170deg,
      rgba(255,250,220,0.7) 0%,
      rgba(255,240,190,0.3) 40%,
      rgba(255,235,180,0) 100%
    );
  }
  .brass-inventory-btn:active {
    background:
      repeating-radial-gradient(
        circle at center,
        transparent 0px,
        transparent 1px,
        rgba(80,60,20,0.05) 1px,
        rgba(80,60,20,0.05) 2px
      ),
      linear-gradient(145deg, #9A7209 0%, #8B6508 20%, #7A5A07 45%, #6B4E06 70%, #5C4305 100%);
    box-shadow:
      0 1px 2px rgba(0,0,0,0.4),
      inset 0 2px 5px rgba(40,30,10,0.6),
      inset 0 -1px 2px rgba(255,223,128,0.1);
    transform: translateY(1px);
    transition: all 0.08s ease-out;
  }
  .brass-inventory-btn:active::before {
    opacity: 0.2;
  }
  @keyframes brass-btn-spring {
    0% { transform: translateY(1px) scale(0.98); }
    50% { transform: translateY(-0.5px) scale(1.01); }
    100% { transform: translateY(0) scale(1); }
  }
  .brass-inventory-btn:not(:active) {
    animation: brass-btn-spring 0.25s ease-out;
  }
  .brass-inventory-btn .engraved-text {
    text-shadow:
      0 1px 0 rgba(255,220,150,0.5),
      0 -1px 1px rgba(60,40,10,0.3);
  }
`;

// Helper functions to get status text and colors
const getHealthStatus = (health: number): { status: HealthStatus; color: string } => {
    if (health >= 80) return { status: 'FINE', color: 'text-green-400' };
    if (health >= 60) return { status: 'TIRED', color: 'text-yellow-400' };
    if (health >= 40) return { status: 'UNWELL', color: 'text-orange-400' };
    if (health >= 20) return { status: 'INJURED', color: 'text-red-400' };
    return { status: 'CRITICAL', color: 'text-red-600 animate-pulse' };
};

interface BottomStatBarProps {
    onInventoryClick: () => void;
    inline?: boolean;
}

const BottomStatBar: React.FC<BottomStatBarProps> = ({ onInventoryClick, inline = false }) => {
    const { state } = useGame();
    const { stats, inventory } = state.player;

    const healthInfo = getHealthStatus(stats.health);

    // Inline version - compact single row for map panel
    if (inline) {
        return (
            <div className="h-10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-paper-200 flex items-center px-4 justify-between shadow-lg border-t border-gold-500/40 shrink-0 relative">
                <style>{brassButtonStyles}</style>
                {/* Decorative top border accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent"></div>

                {/* Inventory Button - Brass Style */}
                <button
                    onClick={() => { playSound('UI_CLICK'); onInventoryClick(); }}
                    className="brass-inventory-btn font-display"
                >
                    <LucideBackpack size={13} style={{ filter: 'drop-shadow(0 1px 0 rgba(255,220,150,0.4))' }} />
                    <span className="hidden sm:inline engraved-text">Inventory</span>
                </button>

                {/* Central Stats - Reputation & Inspiration with elegant dividers */}
                <div className="flex items-center gap-2">
                    {/* Left decorative flourish */}
                    <svg width="24" height="12" viewBox="0 0 24 12" className="text-gold-500/40 hidden md:block">
                        <path d="M24 6 L16 6 C14 6 12 4 10 6 L0 6" stroke="currentColor" fill="none" strokeWidth="1"/>
                        <circle cx="10" cy="6" r="1.5" fill="currentColor"/>
                    </svg>

                    {/* Reputation */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-ink-900/40 border border-gold-600/20" title="Reputation - Your social standing">
                        <LucideStar size={14} className="text-gold-400" />
                        <div className="flex flex-col items-center">
                            <span className="uppercase text-[9px] text-gold-400/70 font-display tracking-[0.15em] leading-none">Reputation</span>
                            <span className={`font-display font-bold text-base leading-tight ${
                                stats.reputation >= 100 ? 'text-gold-300' :
                                stats.reputation >= 75 ? 'text-gold-400' :
                                stats.reputation >= 50 ? 'text-paper-100' :
                                stats.reputation >= 25 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                                {stats.reputation}
                            </span>
                        </div>
                    </div>

                    {/* Elegant center divider */}
                    <div className="flex flex-col items-center px-2">
                        <div className="w-px h-2 bg-gradient-to-b from-transparent to-gold-500/40"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-500/30 border border-gold-400/40"></div>
                        <div className="w-px h-2 bg-gradient-to-t from-transparent to-gold-500/40"></div>
                    </div>

                    {/* Inspiration */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-ink-900/40 border border-purple-500/20" title="Inspiration - Your creative insight">
                        <LucideSparkles size={14} className="text-purple-400" />
                        <div className="flex flex-col items-center">
                            <span className="uppercase text-[9px] text-purple-400/70 font-display tracking-[0.15em] leading-none">Inspiration</span>
                            <span className="font-display font-bold text-base leading-tight text-purple-300">{stats.inspiration}</span>
                        </div>
                    </div>

                    {/* Right decorative flourish */}
                    <svg width="24" height="12" viewBox="0 0 24 12" className="text-gold-500/40 hidden md:block" style={{ transform: 'scaleX(-1)' }}>
                        <path d="M24 6 L16 6 C14 6 12 4 10 6 L0 6" stroke="currentColor" fill="none" strokeWidth="1"/>
                        <circle cx="10" cy="6" r="1.5" fill="currentColor"/>
                    </svg>
                </div>

                {/* Interact hint */}
                <div className="flex items-center gap-2">
                    <kbd className="px-2.5 py-1 bg-gradient-to-b from-paper-100 to-paper-200 text-ink-800 rounded text-[10px] font-bold shadow border border-paper-300/80 font-mono">SPACE</kbd>
                    <span className="text-[10px] text-paper-400/80 font-display tracking-[0.1em] uppercase hidden sm:inline">Interact</span>
                </div>
            </div>
        );
    }

    // Full desktop version (not currently used but kept for potential future use)
    return (
        <div className="flex items-center justify-between gap-4 px-4 py-2 bg-ink-900/95 border-t-2 border-gold-600 backdrop-blur-sm">
            <button
                onClick={() => { playSound('UI_CLICK'); onInventoryClick(); }}
                className="flex items-center gap-2 px-4 py-2 bg-gold-600 hover:bg-gold-500 text-ink-900 rounded font-display font-bold text-sm transition-colors shadow-lg"
            >
                <LucideBackpack size={16} />
                INVENTORY
                <span className="text-xs opacity-100 ml-1">({inventory.length})</span>
            </button>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-ink-800 rounded border border-ink-700">
                    <LucideEye size={14} className="text-blue-400" />
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-paper-500">Erudition</span>
                        <span className="text-sm font-mono font-bold text-blue-300">{stats.observation}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 bg-ink-800 rounded border border-ink-700">
                    <LucideStar size={14} className="text-gold-400" />
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-paper-500">Reputation</span>
                        <span className="text-sm font-mono font-bold text-paper-200">{stats.reputation}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 bg-ink-800 rounded border border-ink-700">
                    <LucideSparkles size={14} className="text-purple-400" />
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-paper-500">Inspiration</span>
                        <span className="text-sm font-mono font-bold text-purple-300">{stats.inspiration}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 bg-ink-800 rounded border border-ink-700">
                    <LucideHeart size={14} className={healthInfo.color} />
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-paper-500">Health</span>
                        <span className={`text-sm font-mono font-bold ${healthInfo.color}`}>{healthInfo.status}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase text-paper-500">Malaise</span>
                <div className="w-20 h-3 bg-ink-800 rounded-full overflow-hidden border border-ink-700">
                    <div
                        className={`h-full transition-all duration-500 ${
                            stats.malaise <= 40 ? 'bg-green-600' :
                            stats.malaise <= 60 ? 'bg-yellow-600' :
                            stats.malaise <= 80 ? 'bg-orange-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${stats.malaise}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default BottomStatBar;
