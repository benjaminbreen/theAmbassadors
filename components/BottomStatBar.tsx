import React from 'react';
import { useGame } from '../context/GameContext';
import { HealthStatus } from '../types';
import { LucideBackpack, LucideEye, LucideStar, LucideHeart, LucideSparkles, LucideBrain } from 'lucide-react';

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
            <div className="h-8 bg-gradient-to-r from-ink-900 via-ink-800 to-ink-900 text-paper-200 font-mono flex items-center px-3 justify-between rounded-b shadow-lg border-t-2 border-gold-600 shrink-0">
                {/* Inventory Button */}
                <button
                    onClick={onInventoryClick}
                    className="flex items-center gap-1.5 px-3 py-1 bg-gold-600 hover:bg-gold-500 text-ink-900 rounded font-display font-bold text-xs transition-all hover:scale-105 shadow-md"
                >
                    <LucideBackpack size={14} />
                    <span className="hidden sm:inline tracking-wide">INVENTORY</span>
                </button>

                {/* Central Stats - Reputation & Inspiration only */}
                <div className="flex items-center gap-6">
                    {/* Reputation */}
                    <div className="flex items-center gap-2" title="Reputation - Your social standing">
                        <div className="flex items-center gap-1 bg-ink-800/50 px-3 py-0 rounded-full border border-gold-600/30">
                            <LucideStar size={16} className="text-gold-400" />
                            <span className="uppercase text-[10px] text-gold-400/80 font-display tracking-wider">Reputation</span>
                            <span className={`font-bold text-lg ml-1 ${
                                stats.reputation >= 100 ? 'text-gold-300' :
                                stats.reputation >= 75 ? 'text-gold-400' :
                                stats.reputation >= 50 ? 'text-paper-100' :
                                stats.reputation >= 25 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                                {stats.reputation}
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-5 bg-gold-600/30"></div>

                    {/* Inspiration */}
                    <div className="flex items-center gap-2" title="Inspiration - Your creative insight">
                        <div className="flex items-center gap-1 bg-ink-800/50 px-3 py-0 rounded-full border border-purple-500/30">
                            <LucideSparkles size={16} className="text-purple-400" />
                            <span className="uppercase text-[10px] text-purple-400/80 font-display tracking-wider">Inspiration</span>
                            <span className="font-bold text-lg ml-1 text-purple-300">{stats.inspiration}</span>
                        </div>
                    </div>
                </div>

                {/* Interact hint */}
                <div className="flex items-center gap-2">
                    <kbd className="px-2 py-0.5 bg-paper-100 text-ink-900 rounded text-[10px] font-bold shadow-sm border border-paper-300">SPACE</kbd>
                    <span className="text-[10px] text-paper-400 font-display tracking-wide hidden sm:inline">INTERACT</span>
                </div>
            </div>
        );
    }

    // Full desktop version (not currently used but kept for potential future use)
    return (
        <div className="flex items-center justify-between gap-4 px-4 py-2 bg-ink-900/95 border-t-2 border-gold-600 backdrop-blur-sm">
            <button
                onClick={onInventoryClick}
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
