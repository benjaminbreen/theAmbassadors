
import React from 'react';
import { BiomeType } from '../types';

interface MapTileProps {
    char: string;
    x: number;
    y: number;
    themeColor: string;
    biome?: BiomeType; // New prop for texture context
}

// Simple hash function to produce deterministic random numbers based on coordinates
const hash = (x: number, y: number) => {
    let h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
    return h - Math.floor(h);
};

const MapTile: React.FC<MapTileProps> = ({ char, x, y, themeColor, biome = 'STREET' }) => {
    const seed = hash(x, y);
    
    // Empty space
    if (char === ' ') return null;

    const rotation = seed * 360;
    const scale = 0.8 + (seed * 0.4);

    let content = null;
    let bgPattern = null;

    // --- BIOME FLOOR TEXTURES ---
    if (char === '.' || char === ':' || char === '+' || char === 'b' || char === 'n' || char === 'L') {
        if (biome === 'SALON') {
            // Herringbone Parquet
            bgPattern = (
                 <g opacity="0.1">
                     <path d="M0 0 L24 24 M24 0 L0 24" stroke="currentColor" strokeWidth="1" className="text-amber-900"/>
                 </g>
            );
        } else if (biome === 'STREET') {
            // Cobblestones (Voronoi-ish)
            bgPattern = (
                <g opacity="0.15">
                    <rect x="2" y="2" width="8" height="8" rx="2" fill="currentColor" className="text-gray-900"/>
                    <rect x="12" y="4" width="10" height="6" rx="2" fill="currentColor" className="text-gray-900"/>
                    <rect x="4" y="14" width="14" height="8" rx="2" fill="currentColor" className="text-gray-900"/>
                </g>
            );
        } else if (biome === 'GARDEN') {
            // Grass Tufts
            bgPattern = (
                <g opacity="0.2">
                     <path d="M4 20 Q6 10 8 20 M12 22 Q14 12 16 22" stroke="currentColor" fill="none" className="text-green-900"/>
                </g>
            );
        } else if (biome === 'GRAND_HALL') {
            // Tiled Grid
            bgPattern = (
                 <rect x="0" y="0" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ink-900 opacity-20"/>
            );
        } else if (biome === 'TOWER_LEVEL') {
             // Iron Grate
             bgPattern = (
                 <path d="M0 12 H24 M12 0 V24" stroke="currentColor" strokeWidth="1" className="text-ink-900 opacity-30"/>
             );
        }
    }

    switch (char) {
        case '#': // WALL
            content = (
                <rect x="0" y="0" width="24" height="24" fill="currentColor" className="text-ink-900 dark:text-gray-600 opacity-80" />
            );
            break;
        
        case '.': // FLOOR
            content = bgPattern;
            break;

        case ':': // PATH (Sidewalk)
            content = (
                <rect x="0" y="0" width="24" height="24" fill="currentColor" className="text-ink-900/10" />
            );
            break;

        case 'T': // TREE (Organic)
            content = (
                <g transform={`translate(12, 20) rotate(${seed * 20 - 10}) scale(${scale}) translate(-12, -20)`}>
                    {/* Trunk */}
                    <path d="M12 24 L12 16" stroke="currentColor" strokeWidth="2" className="text-amber-900"/>
                    {/* Leaves */}
                    <circle cx="12" cy="14" r="8" className="text-green-800 fill-current opacity-80" />
                    <circle cx="15" cy="10" r="6" className="text-green-700 fill-current opacity-80" />
                    <circle cx="9" cy="10" r="6" className="text-green-600 fill-current opacity-80" />
                </g>
            );
            break;

        case '~': // WATER
             content = (
                <path d="M 2 12 Q 7 6 12 12 T 22 12" stroke="currentColor" fill="none" strokeWidth="2" className="text-blue-400 animate-pulse" />
             );
             break;

        case '+': // DOOR
             content = (
                 <g>
                    {bgPattern}
                    <rect x="4" y="2" width="16" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-500" />
                    <path d="M12 2 L12 22" stroke="currentColor" strokeDasharray="2 2" className="text-gold-500/50" />
                 </g>
             );
             break;

        case 'L': // LAMP (Dynamic Light)
             content = (
                 <g>
                     {bgPattern}
                     <line x1="12" y1="14" x2="12" y2="24" stroke="currentColor" strokeWidth="2" className="text-ink-900" />
                     {/* Glow Effect */}
                     <circle cx="12" cy="10" r="8" fill="url(#lampGlow)" className="animate-pulse" />
                     <circle cx="12" cy="10" r="2" fill="#fff" />
                 </g>
             );
             break;
        
        case 'A': // TOWER BASE
             content = (
                 <path d="M4 24 L12 4 L20 24 H4" fill="none" stroke="currentColor" strokeWidth="3" className="text-ink-900" />
             );
             break;
             
        case 'F': // FOUNTAIN CENTER
             content = (
                 <g>
                    <circle cx="12" cy="12" r="10" fill="currentColor" className="text-blue-900/30" />
                    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
                    <path d="M12 12 L12 4" stroke="currentColor" className="text-blue-300 animate-ping" />
                 </g>
             );
             break;

        case 'f': // FOUNTAIN EDGE
             content = (
                 <rect x="0" y="0" width="24" height="24" fill="currentColor" className="text-blue-900/20" />
             );
             break;
             
        case 'b': // BENCH
             content = (
                 <g>
                     {bgPattern}
                     <rect x="4" y="8" width="16" height="8" fill="currentColor" rx="1" className="text-amber-800" />
                     <line x1="4" y1="12" x2="20" y2="12" stroke="black" strokeOpacity="0.2" />
                 </g>
             );
             break;

        case 'n': // NEWSPAPER
             content = (
                 <g transform={`rotate(${seed * 360} 12 12)`}>
                     {bgPattern}
                     <rect x="8" y="8" width="8" height="6" fill="white" stroke="gray" strokeWidth="0.5" />
                     <line x1="9" y1="10" x2="15" y2="10" stroke="black" strokeWidth="0.5" />
                     <line x1="9" y1="12" x2="13" y2="12" stroke="black" strokeWidth="0.5" />
                 </g>
             );
             break;

        case 'p': // PUDDLE
             content = (
                 <g>
                     {bgPattern}
                     <path d={`M6 12 Q12 ${6 + seed*4} 18 12 Q12 ${18 - seed*4} 6 12`} fill="currentColor" className="text-blue-800/40" />
                 </g>
             );
             break;

        case 's': // STEAM VENT
             content = (
                 <g>
                     {bgPattern}
                     <circle cx="12" cy="12" r="4" fill="gray" opacity="0.5" />
                     <circle cx="12" cy="12" r="8" fill="white" className="animate-ping opacity-20" />
                 </g>
             );
             break;
             
        case 'K': // KIOSK
             content = (
                 <rect x="2" y="2" width="20" height="20" fill="currentColor" className="text-green-900" stroke="gold" strokeWidth="1"/>
             );
             break;

        case 'C': // CARRIAGE/CABLE
             content = (
                 <rect x="4" y="6" width="16" height="12" rx="2" fill="currentColor" className="text-red-900" />
             );
             break;
             
        case '[': 
        case ']':
        case 'E':
             content = (
                 <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold-600" />
             );
             break;

        default:
            return null;
    }

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible">
                {content}
            </svg>
        </div>
    );
};

export default MapTile;
