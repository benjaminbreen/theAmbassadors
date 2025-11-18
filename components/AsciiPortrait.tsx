
import React, { useEffect, useState } from 'react';
import { Mood, PortraitConfig } from '../types';
import { compositePortrait } from '../services/portraitService';

interface AsciiPortraitProps {
    config?: PortraitConfig; // If null, use Henry James default
    mood: Mood;
    speaking: boolean;
    className?: string;
}

const HENRY_JAMES_CONFIG: PortraitConfig = {
    hairStyle: 'GENTLEMAN',
    hairColor: 'text-zinc-400 dark:text-zinc-500',
    skinColor: 'text-amber-600/90 dark:text-amber-200',
    clothesColor: 'text-slate-500 dark:text-slate-500',
    facialHair: 'BEARD',
    accessory: 'MONOCLE'
};

const AsciiPortrait: React.FC<AsciiPortraitProps> = ({ config, mood, speaking, className }) => {
    const [frame, setFrame] = useState(0);
    const [particles, setParticles] = useState<{x:number, y:number, char:string, speed:number}[]>([]);
    
    const activeConfig = config || HENRY_JAMES_CONFIG;

    // Animation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setFrame(f => f + 1);
        }, 150); 
        return () => clearInterval(interval);
    }, []);

    // Particle Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setParticles(prev => {
                const next = prev.map(p => ({...p, y: p.y - p.speed}));
                // Remove off screen
                const filtered = next.filter(p => p.y > -10);
                // Add new
                if (filtered.length < 3 && Math.random() > 0.9) {
                    filtered.push({
                        x: Math.random() * 100,
                        y: 100,
                        char: Math.random() > 0.5 ? '.' : 'o',
                        speed: Math.random() * 1 + 0.2
                    });
                }
                return filtered;
            });
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const grid = compositePortrait(activeConfig, mood, speaking, frame);

    return (
        <div className={`relative inline-block ${className} rounded-sm overflow-hidden border-4 border-double border-ink-900 shadow-xl bg-ink-950`}>
            
            {/* Solid Background */}
            <div className="absolute inset-0 bg-ink-950 z-0"></div>

            {/* Particle Layer */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 z-10">
                {particles.map((p, i) => (
                    <div 
                        key={i} 
                        className="absolute text-gold-500 text-[6px]" 
                        style={{ left: `${p.x}%`, top: `${p.y}%`, transition: 'top 0.1s linear' }}
                    >
                        {p.char}
                    </div>
                ))}
            </div>

            {/* Grid Layer - Using Grid for perfect alignment */}
            <div className="font-mono leading-none select-none relative z-20 p-2" 
                 style={{ 
                     display: 'grid', 
                     gridTemplateColumns: `repeat(28, 1ch)`,
                     fontSize: '10px', // Explicit size
                     letterSpacing: '0px'
                 }}>
                {grid.map((row, y) => (
                    row.map((cell, x) => (
                        <span 
                            key={`${x}-${y}`} 
                            className={`
                                h-[12px] flex items-center justify-center
                                ${cell.color} 
                                ${cell.bold ? 'font-bold' : ''} 
                                ${cell.anim || ''}
                                transition-colors duration-200
                            `}
                        >
                            {cell.char}
                        </span>
                    ))
                ))}
            </div>
            
            {/* Lighting Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/60 pointer-events-none z-30"></div>
            <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] pointer-events-none z-40"></div>
        </div>
    );
};

export default AsciiPortrait;
