
import React, { useEffect, useState } from 'react';

interface PlayerSpriteProps {
    direction: 'N' | 'S' | 'E' | 'W';
    className?: string;
}

const PlayerSprite: React.FC<PlayerSpriteProps> = ({ direction, className }) => {
    const [isWalking, setIsWalking] = useState(false);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        setIsWalking(true);
        const timer = setTimeout(() => setIsWalking(false), 200);
        return () => clearTimeout(timer);
    }, [direction, Date.now()]); // Trigger on direction or re-render/move

    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 150);
        return () => clearInterval(interval);
    }, []);

    // Simple walk cycle bob
    const bounce = isWalking ? Math.sin(tick * 2) * 2 : 0;
    const legOffset = isWalking ? Math.sin(tick * 2) * 3 : 0;

    return (
        <div className={`relative w-full h-full flex items-center justify-center ${className}`} style={{ transform: `translateY(${bounce}px)` }}>
            <svg viewBox="0 0 24 24" className="w-8 h-8 overflow-visible drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="1.5">
                {/* Body/Coat */}
                <path 
                    d="M8 10 C8 7 16 7 16 10 V 18 H 8 Z" 
                    className="fill-ink-900 stroke-ink-900 dark:fill-gray-800 dark:stroke-gray-600" 
                />
                
                {/* Legs - Animated */}
                <line x1="10" y1="18" x2="10" y2={22 + legOffset} className="stroke-ink-900 dark:stroke-gray-400 stroke-[2]" />
                <line x1="14" y1="18" x2="14" y2={22 - legOffset} className="stroke-ink-900 dark:stroke-gray-400 stroke-[2]" />

                {/* Head */}
                <circle cx="12" cy="7" r="3.5" className="fill-paper-200 stroke-ink-900 dark:stroke-gray-400" />

                {/* Face Details based on Direction */}
                {direction === 'S' && (
                    <>
                        <circle cx="11" cy="6" r="0.5" className="fill-ink-900" />
                        <circle cx="13" cy="6" r="0.5" className="fill-ink-900" />
                        {/* Monocle */}
                        <circle cx="13" cy="6" r="1" className="stroke-gold-500 fill-none stroke-1" />
                        {/* Beard */}
                        <path d="M10 8 Q12 10 14 8" className="stroke-ink-900 fill-none" />
                        {/* Bowtie */}
                        <path d="M11 10 L13 10 L12 11 Z" className="fill-red-800" />
                    </>
                )}
                {direction === 'N' && (
                    <>
                        {/* Just back of head/hat */}
                    </>
                )}
                {direction === 'E' && (
                    <>
                        {/* Profile Eye */}
                        <circle cx="13" cy="6" r="0.5" className="fill-ink-900" />
                        <path d="M13 8 L14 8" className="stroke-ink-900" />
                        {/* Walking Stick */}
                        <line x1="16" y1="12" x2="18" y2="22" className="stroke-gold-600 stroke-1" />
                    </>
                )}
                {direction === 'W' && (
                    <>
                        {/* Profile Eye */}
                        <circle cx="11" cy="6" r="0.5" className="fill-ink-900" />
                        <path d="M11 8 L10 8" className="stroke-ink-900" />
                        {/* Walking Stick */}
                        <line x1="8" y1="12" x2="6" y2="22" className="stroke-gold-600 stroke-1" />
                    </>
                )}

                {/* Top Hat (Always visible but perspective changes slightly) */}
                <rect x="9" y="1" width="6" height="4" className="fill-ink-900 stroke-ink-900 dark:fill-gray-800 dark:stroke-gray-600" />
                <line x1="7" y1="5" x2="17" y2="5" className="stroke-ink-900 stroke-[2] dark:stroke-gray-600" />
                <line x1="9" y1="4" x2="15" y2="4" className="stroke-gold-500 stroke-1" />

            </svg>
        </div>
    );
};

export default PlayerSprite;
