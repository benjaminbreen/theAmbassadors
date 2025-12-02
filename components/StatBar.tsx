
import React, { useState, useEffect, useRef } from 'react';

interface StatBarProps {
    label: string;
    value: number;
    max: number;
    color: string;
    icon?: React.ReactNode;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, max, color, icon }) => {
    const percent = Math.min(100, Math.max(0, (value / max) * 100));
    const prevValue = useRef(value);
    const [isAnimating, setIsAnimating] = useState(false);
    const [changeType, setChangeType] = useState<'increase' | 'decrease' | null>(null);
    const [showDelta, setShowDelta] = useState<number | null>(null);

    useEffect(() => {
        if (prevValue.current !== value) {
            const delta = value - prevValue.current;
            setChangeType(delta > 0 ? 'increase' : 'decrease');
            setShowDelta(delta);
            setIsAnimating(true);

            const timer = setTimeout(() => {
                setIsAnimating(false);
                setShowDelta(null);
            }, 1000);

            prevValue.current = value;
            return () => clearTimeout(timer);
        }
    }, [value]);

    return (
        <div className={`mb-2 relative transition-all duration-300 ${isAnimating ? 'scale-[1.02]' : ''}`}>
            <div className="flex justify-between text-[15px] uppercase font-bold tracking-widest text-ink-400 mb-1">
                <span className="flex items-center gap-1">{icon} {label}</span>
                <span className={`transition-colors duration-300 ${
                    isAnimating && changeType === 'increase' ? 'text-green-500' :
                    isAnimating && changeType === 'decrease' ? 'text-red-500' : ''
                }`}>
                    {value}/{max}
                    {/* Delta indicator */}
                    {showDelta !== null && (
                        <span className={`ml-1 text-xs animate-[fadeSlide_1s_ease-out_forwards] ${
                            showDelta > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                            {showDelta > 0 ? '+' : ''}{showDelta}
                        </span>
                    )}
                </span>
            </div>
            <div className={`h-3 w-full bg-ink-900/20 rounded-sm overflow-hidden shadow-inner relative border border-ink-900/10 ${
                isAnimating ? (changeType === 'increase' ? 'ring-2 ring-green-400/50' : 'ring-2 ring-red-400/50') : ''
            }`}>
                {/* Background Stripe Pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #000 5px, #000 10px)'
                }}></div>

                {/* Fill */}
                <div
                    className={`h-full transition-all duration-500 ease-out relative ${color} ${
                        isAnimating && changeType === 'decrease' ? 'animate-pulse' : ''
                    }`}
                    style={{ width: `${percent}%` }}
                >
                    <div className="absolute inset-0 bg-white/20"></div>
                    {/* Shine effect on increase */}
                    {isAnimating && changeType === 'increase' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shine_0.5s_ease-out]"></div>
                    )}
                </div>
            </div>
            {/* Animations defined in tailwind.config.js */}
        </div>
    );
};

export default StatBar;
