import React, { useState, useEffect, useCallback } from 'react';
import { LucideStar, LucideSparkles, LucideHeart, LucideBrain, LucideAlertTriangle, LucideEye, LucideCoins, LucideShield } from 'lucide-react';

export interface StatChange {
    id: string;
    stat: string;
    delta: number;
    timestamp: number;
}

interface FloatingStatIndicatorProps {
    changes: StatChange[];
    onRemove: (id: string) => void;
}

// Get icon and color for each stat type
const getStatStyle = (stat: string, delta: number) => {
    const isPositive = delta > 0;

    switch (stat.toLowerCase()) {
        case 'reputation':
            return {
                icon: <LucideStar size={12} />,
                color: isPositive ? 'text-gold-400' : 'text-gold-600',
                bgColor: isPositive ? 'bg-gold-900/80' : 'bg-gold-950/80',
                borderColor: isPositive ? 'border-gold-500/60' : 'border-gold-700/60'
            };
        case 'inspiration':
            return {
                icon: <LucideSparkles size={12} />,
                color: isPositive ? 'text-purple-300' : 'text-purple-500',
                bgColor: isPositive ? 'bg-purple-900/80' : 'bg-purple-950/80',
                borderColor: isPositive ? 'border-purple-500/60' : 'border-purple-700/60'
            };
        case 'composure':
        case 'health':
            return {
                icon: <LucideHeart size={12} />,
                color: isPositive ? 'text-emerald-400' : 'text-red-400',
                bgColor: isPositive ? 'bg-emerald-900/80' : 'bg-red-900/80',
                borderColor: isPositive ? 'border-emerald-500/60' : 'border-red-500/60'
            };
        case 'malaise':
            // Malaise is reversed - lower is better
            return {
                icon: <LucideAlertTriangle size={12} />,
                color: isPositive ? 'text-orange-400' : 'text-green-400',
                bgColor: isPositive ? 'bg-orange-900/80' : 'bg-green-900/80',
                borderColor: isPositive ? 'border-orange-500/60' : 'border-green-500/60'
            };
        case 'wit':
        case 'decorum':
        case 'observation':
            return {
                icon: <LucideBrain size={12} />,
                color: isPositive ? 'text-cyan-400' : 'text-cyan-600',
                bgColor: isPositive ? 'bg-cyan-900/80' : 'bg-cyan-950/80',
                borderColor: isPositive ? 'border-cyan-500/60' : 'border-cyan-700/60'
            };
        case 'money':
            return {
                icon: <LucideCoins size={12} />,
                color: isPositive ? 'text-yellow-400' : 'text-yellow-600',
                bgColor: isPositive ? 'bg-yellow-900/80' : 'bg-yellow-950/80',
                borderColor: isPositive ? 'border-yellow-500/60' : 'border-yellow-700/60'
            };
        default:
            return {
                icon: <LucideShield size={12} />,
                color: isPositive ? 'text-paper-200' : 'text-paper-400',
                bgColor: 'bg-ink-800/80',
                borderColor: 'border-ink-600/60'
            };
    }
};

const FloatingStatIndicator: React.FC<FloatingStatIndicatorProps> = ({ changes, onRemove }) => {
    return (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[200] flex flex-col-reverse items-center gap-1 pointer-events-none">
            {changes.map((change, index) => {
                const style = getStatStyle(change.stat, change.delta);
                const isPositive = change.delta > 0;

                return (
                    <div
                        key={change.id}
                        className={`stat-change-float flex items-center gap-1.5 px-3 py-1.5 rounded-full
                            ${style.bgColor} ${style.borderColor} border backdrop-blur-sm shadow-lg`}
                        style={{
                            animationDelay: `${index * 50}ms`
                        }}
                        onAnimationEnd={() => onRemove(change.id)}
                    >
                        <span className={style.color}>{style.icon}</span>
                        <span className={`font-display font-bold text-sm ${style.color}`}>
                            {isPositive ? '+' : ''}{change.delta}
                        </span>
                        <span className={`text-xs uppercase tracking-wider ${style.color} opacity-80`}>
                            {change.stat}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

// Hook for managing stat changes
export const useStatChanges = () => {
    const [changes, setChanges] = useState<StatChange[]>([]);

    const addChange = useCallback((stat: string, delta: number) => {
        if (delta === 0) return;

        const newChange: StatChange = {
            id: `${stat}-${Date.now()}-${Math.random()}`,
            stat,
            delta,
            timestamp: Date.now()
        };

        setChanges(prev => [...prev, newChange]);
    }, []);

    const removeChange = useCallback((id: string) => {
        setChanges(prev => prev.filter(c => c.id !== id));
    }, []);

    return { changes, addChange, removeChange };
};

export default FloatingStatIndicator;
