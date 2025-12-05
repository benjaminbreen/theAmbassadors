import React from 'react';
import { useGame } from '../context/GameContext';
import { LucideTimer, LucideAlertTriangle, LucideSparkles } from 'lucide-react';

const ActiveEffectsDisplay: React.FC = () => {
    const { state } = useGame();
    const { activeEffects } = state.player;

    if (activeEffects.length === 0) {
        return null;
    }

    const now = Date.now();

    // Format remaining time
    const formatTime = (expiresAt: number | undefined) => {
        if (!expiresAt) return 'Permanent';
        const remaining = Math.max(0, expiresAt - now);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        }
        return `${seconds}s`;
    };

    // Get effect color based on type
    const getEffectColor = (sourceName: string) => {
        const name = sourceName.toLowerCase();
        if (name.includes('absinthe')) return 'border-green-500 bg-green-900/20';
        if (name.includes('champagne')) return 'border-gold-500 bg-gold-900/20';
        if (name.includes('cognac') || name.includes('bordeaux')) return 'border-red-500 bg-red-900/20';
        if (name.includes('coffee') || name.includes('café')) return 'border-amber-500 bg-amber-900/20';
        if (name.includes('tea') || name.includes('thé')) return 'border-emerald-500 bg-emerald-900/20';
        if (name.includes('chocolat')) return 'border-orange-500 bg-orange-900/20';
        if (name.includes('laudanum')) return 'border-purple-500 bg-purple-900/20';
        if (name.includes('smelling')) return 'border-cyan-500 bg-cyan-900/20';
        return 'border-paper-500 bg-paper-900/20';
    };

    // Get emoji for effect
    const getEffectEmoji = (sourceName: string) => {
        const name = sourceName.toLowerCase();
        if (name.includes('absinthe')) return '🧪';
        if (name.includes('champagne')) return '🥂';
        if (name.includes('cognac')) return '🥃';
        if (name.includes('bordeaux')) return '🍷';
        if (name.includes('coffee') || name.includes('café')) return '☕';
        if (name.includes('tea') || name.includes('thé')) return '🍵';
        if (name.includes('chocolat')) return '🍫';
        if (name.includes('laudanum')) return '💊';
        if (name.includes('smelling')) return '💨';
        if (name.includes('croissant')) return '🥐';
        if (name.includes('oyster')) return '🦪';
        if (name.includes('pâté')) return '🍖';
        if (name.includes('cheese') || name.includes('fromage')) return '🧀';
        if (name.includes('macaron')) return '🍬';
        return '✨';
    };

    return (
        <div className="space-y-2">
            <h3 className="font-display text-ink-900 dark:text-paper-100 border-b-2 border-gold-600 mb-2 text-sm font-bold pb-1 flex items-center gap-2">
                <LucideSparkles size={14} className="text-gold-500" />
                Active Effects
            </h3>
            <div className="space-y-1.5">
                {activeEffects.map(effect => {
                    const hasDelayed = effect.delayedEffects && effect.delayedEffects.triggersAt > now;
                    const delayedTriggersIn = hasDelayed
                        ? formatTime(effect.delayedEffects!.triggersAt)
                        : null;

                    return (
                        <div
                            key={effect.id}
                            className={`rounded border p-2 ${getEffectColor(effect.sourceName)}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{getEffectEmoji(effect.sourceName)}</span>
                                    <div>
                                        <div className="font-bold text-xs text-paper-100">
                                            {effect.sourceName}
                                            {effect.stackCount > 1 && (
                                                <span className="ml-1 px-1 bg-yellow-500 text-ink-900 rounded text-[10px]">
                                                    x{effect.stackCount}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[10px] text-paper-300 flex items-center gap-1">
                                            <LucideTimer size={10} />
                                            {formatTime(effect.expiresAt)}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {effect.effects.map((e, i) => (
                                        <div
                                            key={i}
                                            className={`text-[10px] ${e.delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}
                                        >
                                            {e.stat} {e.delta > 0 ? '+' : ''}{e.delta}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {hasDelayed && (
                                <div className="mt-1 pt-1 border-t border-paper-500/30 text-[10px] text-yellow-400 flex items-center gap-1">
                                    <LucideAlertTriangle size={10} />
                                    Delayed effects in {delayedTriggersIn}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActiveEffectsDisplay;
