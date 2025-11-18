
import React, { useEffect, useState } from 'react';
import { NPC } from '../types';

interface NpcSpriteProps {
    npc: NPC;
    className?: string;
}

const NpcSprite: React.FC<NpcSpriteProps> = ({ npc, className }) => {
    const [frame, setFrame] = useState(0);
    const dir = npc.location.direction;
    
    // Animation loop
    useEffect(() => {
        const interval = setInterval(() => setFrame(f => f + 1), 250);
        return () => clearInterval(interval);
    }, []);

    const legOffset = Math.sin(frame) * 3;
    
    return (
        <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
            <svg viewBox="0 0 24 24" className="w-8 h-8 overflow-visible drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth="1.5">
                {/* Legs */}
                <line x1="10" y1="16" x2="10" y2={20 + legOffset} stroke={npc.colors.secondary} strokeWidth="2" />
                <line x1="14" y1="16" x2="14" y2={20 - legOffset} stroke={npc.colors.secondary} strokeWidth="2" />
                
                {/* Body */}
                <path 
                    d="M8 8 Q12 6 16 8 V 16 H 8 Z" 
                    fill={npc.colors.primary} 
                    stroke="none"
                />
                
                {/* Head */}
                <circle cx="12" cy="6" r="3.5" fill={npc.colors.skin} />
                
                {/* Hair/Hat */}
                {npc.portrait.hairStyle !== 'BALD' && (
                    <path d="M8 5 Q12 2 16 5" stroke={npc.colors.secondary} strokeWidth="3" fill="none" />
                )}

                {/* Face Direction Hints */}
                {dir === 'E' && <circle cx="13" cy="5.5" r="0.5" fill="black" />}
                {dir === 'W' && <circle cx="11" cy="5.5" r="0.5" fill="black" />}
                {dir === 'S' && (
                    <>
                        <circle cx="11" cy="5.5" r="0.5" fill="black" />
                        <circle cx="13" cy="5.5" r="0.5" fill="black" />
                    </>
                )}

            </svg>
        </div>
    );
};

export default NpcSprite;
