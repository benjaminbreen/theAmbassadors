import React from 'react';
import { BiomeType } from '../../types';

// Pre-computed TERRAIN graphics (full tiles, no overlay)
export const TERRAIN_GRAPHICS: Record<string, (biome: BiomeType, seed: number) => JSX.Element> = {
    // Polished marble floor (Trocadéro, grand halls)
    FLOOR_POLISHED: (_, seed) => (
        <g>
            {/* Base white/cream marble */}
            <rect width="24" height="24" fill="#F5F5F0"/>
            {/* Marble veining */}
            <path d={`M${2 + seed * 4} 0 Q${8 + seed * 3} ${6 + seed * 4} ${4 + seed * 6} 12 Q${10 - seed * 2} ${18 + seed * 2} ${6 + seed * 8} 24`}
                stroke="#E0DCD4" strokeWidth="0.8" fill="none" opacity="0.6"/>
            <path d={`M${18 - seed * 4} 0 Q${14 + seed * 2} ${8 - seed * 3} ${20 - seed * 5} 14 Q${16 + seed * 3} 20 ${22 - seed * 6} 24`}
                stroke="#D8D4CC" strokeWidth="0.5" fill="none" opacity="0.5"/>
            <path d={`M0 ${8 + seed * 6} Q${6 + seed * 4} ${10 + seed * 2} 12 ${12 - seed * 3} Q${18 - seed * 2} ${14 + seed * 4} 24 ${10 + seed * 8}`}
                stroke="#E8E4DC" strokeWidth="0.6" fill="none" opacity="0.4"/>
            {/* Subtle gray veins */}
            <path d={`M${10 + seed * 4} 0 L${12 - seed * 2} ${8 + seed * 3} L${14 + seed * 3} 16 L${11 - seed * 2} 24`}
                stroke="#C4C0B8" strokeWidth="0.3" fill="none" opacity="0.35"/>
            {/* Polished shine reflection */}
            <ellipse cx={8 + seed * 8} cy={6 + seed * 4} rx="4" ry="2" fill="#FFFFFF" opacity="0.25"/>
            <ellipse cx={16 - seed * 6} cy={16 + seed * 3} rx="3" ry="1.5" fill="#FFFFFF" opacity="0.15"/>
            {/* Tile edge/grout lines */}
            <rect x="0" y="23" width="24" height="1" fill="#D0CCC4" opacity="0.4"/>
            <rect x="23" y="0" width="1" height="24" fill="#D0CCC4" opacity="0.3"/>
        </g>
    ),
    // Worn floor (aged, scuffed)
    FLOOR_WORN: (_, seed) => (
        <g>
            {/* Base worn stone/wood */}
            <rect width="24" height="24" fill="#A89888"/>
            <rect width="24" height="24" fill="#9E8E7E" opacity={0.5 + seed * 0.3}/>
            {/* Wear patterns */}
            <ellipse cx={6 + seed * 4} cy={8 + seed * 4} rx="5" ry="3" fill="#8E7E6E" opacity="0.4"/>
            <ellipse cx={16 - seed * 3} cy={16 + seed * 2} rx="4" ry="2.5" fill="#7E6E5E" opacity="0.35"/>
            {/* Scuffs and marks */}
            <path d={`M${4 + seed * 6} ${10 + seed * 4} l${3 - seed * 2} ${2 + seed}`}
                stroke="#6E5E4E" strokeWidth="0.5" fill="none" opacity="0.3"/>
            <circle cx={18 - seed * 8} cy={6 + seed * 6} r="1.5" fill="#7E6E5E" opacity="0.25"/>
            {/* Grout/edge */}
            <rect x="0" y="22" width="24" height="2" fill="#786858" opacity="0.3"/>
            <rect x="22" y="0" width="2" height="24" fill="#786858" opacity="0.25"/>
        </g>
    ),
    // Wood floor (parquet)
    FLOOR_WOOD: (_, seed) => (
        <g>
            {/* Base wood color */}
            <rect width="24" height="24" fill="#8B6914"/>
            {/* Parquet pattern - herringbone */}
            <rect x="0" y="0" width="12" height="6" fill="#9A7B2C"/>
            <rect x="12" y="0" width="12" height="6" fill="#7A5B14"/>
            <rect x="0" y="6" width="12" height="6" fill="#7A5B14"/>
            <rect x="12" y="6" width="12" height="6" fill="#9A7B2C"/>
            <rect x="0" y="12" width="12" height="6" fill="#9A7B2C"/>
            <rect x="12" y="12" width="12" height="6" fill="#7A5B14"/>
            <rect x="0" y="18" width="12" height="6" fill="#7A5B14"/>
            <rect x="12" y="18" width="12" height="6" fill="#9A7B2C"/>
            {/* Wood grain lines */}
            <g stroke="#6A4B04" strokeWidth="0.3" opacity="0.4">
                <line x1="2" y1="0" x2="2" y2="6"/>
                <line x1="6" y1="0" x2="6" y2="6"/>
                <line x1="10" y1="0" x2="10" y2="6"/>
                <line x1="14" y1="6" x2="14" y2="12"/>
                <line x1="18" y1="6" x2="18" y2="12"/>
                <line x1="22" y1="6" x2="22" y2="12"/>
                <line x1="2" y1="12" x2="2" y2="18"/>
                <line x1="6" y1="12" x2="6" y2="18"/>
                <line x1="14" y1="18" x2="14" y2="24"/>
                <line x1="18" y1="18" x2="18" y2="24"/>
            </g>
            {/* Polished sheen */}
            <rect width="24" height="24" fill="#FFD700" opacity={0.05 + seed * 0.05}/>
            {/* Subtle wear */}
            {seed > 0.7 && <ellipse cx={12} cy={12} rx="4" ry="2" fill="#5A3B00" opacity="0.1"/>}
        </g>
    ),
    // Heavy-duty road pavers for wagon/horse traffic
    ROAD_PAVER: (_, seed) => (
        <g>
            {/* Base dark stone color */}
            <rect width="24" height="24" fill="#3D3A36"/>
            {/* Large rectangular paving stones in a grid pattern */}
            {/* Row 1 */}
            <rect x="0.5" y="0.5" width="11" height="5" fill="#4A4642" stroke="#2A2826" strokeWidth="0.5"/>
            <rect x="12.5" y="0.5" width="11" height="5" fill="#524E4A" stroke="#2A2826" strokeWidth="0.5"/>
            {/* Row 2 - offset for interlocking pattern */}
            <rect x="-5" y="6.5" width="11" height="5" fill="#524E4A" stroke="#2A2826" strokeWidth="0.5"/>
            <rect x="6.5" y="6.5" width="11" height="5" fill="#4A4642" stroke="#2A2826" strokeWidth="0.5"/>
            <rect x="18.5" y="6.5" width="11" height="5" fill="#565250" stroke="#2A2826" strokeWidth="0.5"/>
            {/* Row 3 */}
            <rect x="0.5" y="12.5" width="11" height="5" fill="#565250" stroke="#2A2826" strokeWidth="0.5"/>
            <rect x="12.5" y="12.5" width="11" height="5" fill="#4A4642" stroke="#2A2826" strokeWidth="0.5"/>
            {/* Row 4 - offset */}
            <rect x="-5" y="18.5" width="11" height="5" fill="#4A4642" stroke="#2A2826" strokeWidth="0.5"/>
            <rect x="6.5" y="18.5" width="11" height="5" fill="#565250" stroke="#2A2826" strokeWidth="0.5"/>
            <rect x="18.5" y="18.5" width="11" height="5" fill="#524E4A" stroke="#2A2826" strokeWidth="0.5"/>
            {/* Wear marks from wagon wheels - two parallel ruts */}
            <rect x="5" y="0" width="2" height="24" fill="#3A3632" opacity="0.4"/>
            <rect x="17" y="0" width="2" height="24" fill="#3A3632" opacity="0.4"/>
            {/* Subtle dirt accumulation in cracks */}
            <line x1="0" y1="6" x2="24" y2="6" stroke="#2D2A26" strokeWidth="0.8" opacity="0.5"/>
            <line x1="0" y1="12" x2="24" y2="12" stroke="#2D2A26" strokeWidth="0.8" opacity="0.5"/>
            <line x1="0" y1="18" x2="24" y2="18" stroke="#2D2A26" strokeWidth="0.8" opacity="0.5"/>
            {/* Random wear variation */}
            {seed > 0.5 && <circle cx={8 + seed * 8} cy={10 + seed * 4} r="1.5" fill="#363330" opacity="0.3"/>}
        </g>
    ),
    // Water - realistic Seine river appearance for all biomes
    WATER: () => (
        <g>
            <rect width="24" height="24" fill="url(#pattern-water)"/>
        </g>
    ),
    // Pylon
    PYLON: () => (
        <g>
            <rect width="24" height="24" fill="#1E293B"/>
            <circle cx="4" cy="4" r="1.5" fill="#64748B"/>
            <circle cx="20" cy="4" r="1.5" fill="#64748B"/>
            <circle cx="4" cy="20" r="1.5" fill="#64748B"/>
            <circle cx="20" cy="20" r="1.5" fill="#64748B"/>
            <circle cx="12" cy="12" r="2" fill="#64748B"/>
            <path d="M2 2 L22 22 M22 2 L2 22" stroke="#475569" strokeWidth="2"/>
        </g>
    ),
    // Void
    VOID: (_, seed) => (
        <g>
            <rect width="24" height="24" fill="url(#voidGrad)"/>
            <ellipse cx={4 + seed * 16} cy={3 + seed * 2} rx="5" ry="1.5" fill="white" opacity="0.7"/>
            <g opacity="0.25">
                <rect x={1 + seed * 2} y={18 - seed * 2} width="1.5" height={6 + seed * 2} fill="#4a5568"/>
                <rect x={4 + seed * 3} y={20 - seed} width="2" height={4 + seed} fill="#5a6578"/>
                <rect x={14} y={18 - seed * 2} width="1.5" height={6 + seed * 2} fill="#4a5568"/>
                <rect x={20} y={19 - seed} width="1.5" height={5 + seed} fill="#4a5568"/>
            </g>
            <rect width="24" height="24" fill="url(#dangerGlow)" opacity="0.15"/>
        </g>
    ),
    // Stall Wall
    STALL_WALL: () => (
        <g>
            <rect width="24" height="24" fill="#92400E"/>
            <rect x="2" y="2" width="20" height="20" fill="none" stroke="#B45309" strokeWidth="1"/>
            <path d="M6 6 L18 6 M6 12 L18 12 M6 18 L18 18" stroke="#78350F" strokeWidth="1"/>
            <rect x="0" y="0" width="24" height="2" fill="#EAB308"/>
            <rect x="0" y="22" width="24" height="2" fill="#EAB308"/>
        </g>
    ),
    // Entry door
    EXHIBIT_DOOR: () => (
        <g>
            <rect width="24" height="24" fill="#4A3728"/>
            <rect x="4" y="2" width="16" height="22" fill="#6D4C41"/>
            <rect x="5" y="3" width="14" height="20" fill="#8D6E63"/>
            <rect x="6" y="4" width="12" height="8" fill="#5D4037"/>
            <rect x="6" y="14" width="12" height="8" fill="#5D4037"/>
            <circle cx="16" cy="14" r="1.5" fill="#B8860B"/>
            <rect x="11" y="0" width="2" height="4" fill="#FFD700"/>
        </g>
    ),
    // Ajar door
    DOOR_AJAR: () => (
        <g>
            <rect width="24" height="24" fill="#4A3728"/>
            <path d="M4 2 L16 6 L16 22 L4 22 Z" fill="#6D4C41"/>
            <path d="M5 3 L15 7 L15 21 L5 21 Z" fill="#A1887F"/>
            <rect x="16" y="2" width="4" height="20" fill="#1A1A1A" opacity="0.3"/>
            <ellipse cx="7" cy="14" rx="1" ry="1.5" fill="#B8860B"/>
        </g>
    ),
    // Open door
    DOOR_OPEN: () => (
        <g>
            <rect width="24" height="24" fill="#1A1A1A" opacity="0.6"/>
            <rect x="0" y="2" width="6" height="20" fill="#6D4C41"/>
            <rect x="1" y="3" width="4" height="18" fill="#A1887F"/>
            <rect x="18" y="2" width="6" height="20" fill="#6D4C41"/>
            <rect x="19" y="3" width="4" height="18" fill="#A1887F"/>
            <rect x="6" y="0" width="12" height="24" fill="url(#doorwayGlow)" opacity="0.3"/>
        </g>
    ),
    // Door - Ornate 1889 Exposition entrance door
    DOOR: () => (
        <g>
            {/* Door frame - dark wood/metal */}
            <rect width="24" height="24" fill="#2D2A26"/>
            <rect x="1" y="0" width="22" height="24" fill="#3D3835"/>
            {/* Main door panels - rich mahogany */}
            <rect x="2" y="1" width="20" height="22" fill="#5D3A1A"/>
            <rect x="3" y="2" width="18" height="20" fill="#6B4423"/>
            {/* Upper panel with arched glass */}
            <rect x="4" y="3" width="16" height="8" fill="#4A3520"/>
            <path d="M5 10 L5 5 Q12 2 19 5 L19 10 Z" fill="#87CEEB" opacity="0.8"/>
            <path d="M5 10 L5 5 Q12 2 19 5 L19 10 Z" fill="none" stroke="#8B7355" strokeWidth="0.8"/>
            {/* Glass muntins */}
            <line x1="12" y1="3" x2="12" y2="10" stroke="#5D4037" strokeWidth="0.5"/>
            <line x1="8" y1="4" x2="8" y2="10" stroke="#5D4037" strokeWidth="0.3"/>
            <line x1="16" y1="4" x2="16" y2="10" stroke="#5D4037" strokeWidth="0.3"/>
            {/* Lower panels */}
            <rect x="4" y="12" width="7" height="9" fill="#4A3520"/>
            <rect x="5" y="13" width="5" height="7" fill="#5D3A1A"/>
            <rect x="13" y="12" width="7" height="9" fill="#4A3520"/>
            <rect x="14" y="13" width="5" height="7" fill="#5D3A1A"/>
            {/* Decorative brass hardware */}
            <circle cx="18" cy="14" r="1.2" fill="#B8860B"/>
            <circle cx="18" cy="14" r="0.6" fill="#DAA520"/>
            {/* Brass door handle */}
            <ellipse cx="18" cy="16" rx="0.8" ry="1.5" fill="#B8860B"/>
            {/* Threshold */}
            <rect x="0" y="22" width="24" height="2" fill="#8B7355"/>
            {/* Light reflection on glass */}
            <ellipse cx="9" cy="6" rx="2" ry="1.5" fill="#fff" opacity="0.25"/>
        </g>
    ),
    // Water pool (Trocadéro)
    WATER_POOL: () => (
        <g>
            <rect width="24" height="24" fill="#1565C0"/>
            <rect x="1" y="1" width="22" height="22" fill="#2196F3" opacity="0.8"/>
            <ellipse cx="12" cy="12" rx="8" ry="4" fill="none" stroke="#64B5F6" strokeWidth="0.5" opacity="0.5">
                <animate attributeName="rx" values="8;10;8" dur="3s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="8" cy="8" rx="3" ry="1.5" fill="#fff" opacity="0.2"/>
        </g>
    ),
};

// Tiles that ARE terrain (render as full tile, no overlay needed)
export const TERRAIN_TILES = new Set([
    '.', ':', 'g', 'v', '#', '~', 'P', 'V', 'S', 'E', '[', ']', '+',
    ',', '`', 'o',
    '▲', '▼', '►', '◄', '┐', '┌', '┘', '└',
    '░',
    'W'
]);
