import React from 'react';
import { BiomeType } from '../types';

interface MapTileProps {
    char: string;
    x: number;
    y: number;
    themeColor: string;
    biome?: BiomeType;
    zoneName?: string;  // For culturally-specific floor patterns
}

// Simple hash function - computed once per tile
const hash = (x: number, y: number): number => {
    const h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
    return h - Math.floor(h);
};

// Get culturally-appropriate wall style based on zone name
const getCulturalWallStyle = (zoneName: string): string | null => {
    const nameLower = zoneName.toLowerCase();

    // Japanese locations
    if (nameLower.includes('japan') || nameLower.includes('nippon')) {
        return 'JAPANESE';
    }
    // Chinese locations
    if (nameLower.includes('china') || nameLower.includes('chinese') || nameLower.includes('celestial')) {
        return 'CHINESE';
    }
    // Persian/Middle Eastern
    if (nameLower.includes('persia') || nameLower.includes('iran') || nameLower.includes('ottoman')) {
        return 'PERSIAN';
    }
    // Egyptian
    if (nameLower.includes('egypt') || nameLower.includes('cairo') || nameLower.includes('pharaoh')) {
        return 'EGYPTIAN';
    }
    // Moorish/Islamic
    if (nameLower.includes('tunis') || nameLower.includes('morocco') || nameLower.includes('algeria') ||
        nameLower.includes('arab') || nameLower.includes('mosque')) {
        return 'MOORISH';
    }
    // Italian
    if (nameLower.includes('italy') || nameLower.includes('italian') || nameLower.includes('roma') ||
        nameLower.includes('florence') || nameLower.includes('venice')) {
        return 'ITALIAN';
    }

    return null; // Use biome default
};

// Get pattern ID for floor tiles based on biome and optionally zone name
// Note: Cultural patterns are now used ONLY for carpet tiles, not base floors
// This keeps exposition floors neutral and plain
const getFloorPattern = (biome: BiomeType, zoneName?: string): string => {
    // All biomes now use plain, neutral floors by default
    // Cultural patterns are reserved for carpet accent tiles
    switch (biome) {
        case 'SALON': return 'url(#pattern-salon)';  // Plain polished concrete
        case 'STREET': return 'url(#pattern-street)';
        case 'GARDEN': return 'url(#pattern-grass)';
        case 'GRAND_HALL': return 'url(#pattern-grandhall)';  // Industrial iron plate
        case 'TOWER_LEVEL': return 'url(#pattern-towerlevel)';
        case 'TOWER_BASE': return 'url(#pattern-towerbase)';
        case 'TOWER_PLATFORM': return 'url(#pattern-towerplatform)';
        case 'TOWER_FIRST_FLOOR': return 'url(#pattern-towerfirstfloor)';
        case 'ESPLANADE': return 'url(#pattern-esplanade)';
        case 'CONCERT_HALL': return 'url(#pattern-salon)';  // Plain floor for concert halls too
        case 'SOUK': return 'url(#pattern-souk)';  // Sandy/dusty for outdoor souks
        case 'GALERIE': return 'url(#pattern-galerie)';
        case 'BRIDGE': return 'url(#pattern-bridge)';
        case 'GATE': return 'url(#pattern-gate)';
        case 'VILLAGE': return 'url(#pattern-street)';
        case 'TROCADERO': return 'url(#pattern-esplanade)';
        case 'WATERFALL': return 'url(#pattern-grass)';
        default: return 'url(#pattern-street)';
    }
};

// Get culturally-appropriate carpet pattern based on zone name
// This is used for carpet tiles ('r') only, not base floors
const getCarpetPattern = (zoneName: string): string => {
    const nameLower = zoneName.toLowerCase();

    if (nameLower.includes('japan') || nameLower.includes('nippon')) {
        return 'url(#pattern-tatami)';
    }
    if (nameLower.includes('persia') || nameLower.includes('iran')) {
        return 'url(#pattern-persian)';
    }
    if (nameLower.includes('china') || nameLower.includes('chinese')) {
        return 'url(#pattern-chinese)';
    }
    if (nameLower.includes('tunis') || nameLower.includes('morocco') || nameLower.includes('algeria') ||
        nameLower.includes('ottoman') || nameLower.includes('arab')) {
        return 'url(#pattern-moorish)';
    }
    if (nameLower.includes('egypt')) {
        return 'url(#pattern-egyptian)';
    }
    if (nameLower.includes('italy') || nameLower.includes('italian')) {
        return 'url(#pattern-marble)';
    }
    if (nameLower.includes('france') || nameLower.includes('french')) {
        return 'url(#pattern-parquet)';
    }
    // Default ornate carpet for European pavilions
    return 'url(#pattern-persian)';
};

// Tiles that are OBJECTS placed on top of terrain (need transparent background)
const OBJECT_TILES = new Set([
    'T', 'L', 'b', 'F', 'f', 'n', 'p', 's', 'K', 'C', 'u', 'c', 'l', 'O',
    'H', 'w', 'q', 'B', 'r', 'D', 'A', 'R', 'e',
    // New tiles
    't', 'M', 'd', 'X', 'z', 'k', 'Z', 'G', 'Y',
    // Gate entrance tiles (J=arch, I=turnstile, N=ticket booth, Q=guard post, y=flagpole)
    'J', 'I', 'N', 'Q', 'y',
    // Chair orientations (1=N, 2=S, 3=E, 4=W)
    '1', '2', '3', '4',
    // Cushion
    'a',
    // Village & special biome tiles
    'h', 'U', '!', '@', '%',  // Thatch hut, fire pit, drum, totem, palm
    // Trocadéro tiles
    '|', '^', '(', ')',  // Waterfall, cascade rock, moorish arch, minaret
    // Beaux-Arts fountain components
    '«', '»', '≥', '≤', '╔', '╗', '╚', '╝', '≈', '⌂', '♦'  // Basin edges, corners, water, spout, statue
]);

// Tiles that ARE terrain (render as full tile, no overlay needed)
const TERRAIN_TILES = new Set([
    '.', ':', 'g', 'v', '#', '~', 'P', 'V', 'S', 'E', '[', ']', '+',
    // Floor variants
    ',', '`', 'o',
    // Directional walls (SNES-style depth)
    '▲', '▼', '►', '◄', '┐', '┌', '┘', '└',
    // Shadow
    '░',
    // Water pool (Trocadéro reflecting pool)
    'W'
]);

// Pre-computed OBJECT graphics (rendered over terrain)
const OBJECT_GRAPHICS: Record<string, JSX.Element> = {
    // Tree
    'T': (
        <g>
            <ellipse cx="14" cy="22" rx="6" ry="2" fill="#000" opacity="0.2"/>
            <rect x="10" y="16" width="4" height="8" fill="#5D4037"/>
            <ellipse cx="12" cy="12" rx="10" ry="8" fill="#2E7D32"/>
            <ellipse cx="8" cy="10" rx="6" ry="5" fill="#388E3C"/>
            <ellipse cx="16" cy="10" rx="6" ry="5" fill="#388E3C"/>
            <ellipse cx="12" cy="8" rx="7" ry="5" fill="#43A047"/>
            <circle cx="8" cy="8" r="2" fill="#66BB6A" opacity="0.6"/>
        </g>
    ),
    // Lamp
    'L': (
        <g>
            <rect x="10" y="12" width="4" height="12" fill="#37474F"/>
            <rect x="9" y="20" width="6" height="4" fill="#455A64"/>
            <path d="M6 8 L8 12 L16 12 L18 8 Z" fill="#37474F"/>
            <rect x="7" y="4" width="10" height="5" fill="#263238"/>
            <rect x="8" y="5" width="3" height="3" fill="#FFEB3B" opacity="0.8"/>
            <rect x="13" y="5" width="3" height="3" fill="#FFEB3B" opacity="0.8"/>
            <path d="M10 4 L12 1 L14 4 Z" fill="#37474F"/>
            <circle cx="12" cy="7" r="8" fill="url(#lampGlow)" opacity="0.6"/>
        </g>
    ),
    // Bench
    'b': (
        <g>
            <ellipse cx="12" cy="20" rx="8" ry="2" fill="#000" opacity="0.15"/>
            <path d="M4 12 L6 20 M20 12 L18 20" stroke="#37474F" strokeWidth="2" fill="none"/>
            <rect x="2" y="10" width="20" height="3" fill="#5D4037" rx="1"/>
            <rect x="3" y="4" width="18" height="6" fill="#6D4C41" rx="1"/>
        </g>
    ),
    // Fountain Center - Elaborate 1889 style
    'F': (
        <g>
            {/* Shadow */}
            <ellipse cx="14" cy="21" rx="9" ry="3" fill="#000" opacity="0.2"/>
            {/* Base pool - ornate stone */}
            <ellipse cx="12" cy="18" rx="10" ry="4" fill="#78909C"/>
            <ellipse cx="12" cy="17" rx="9" ry="3.5" fill="#90A4AE"/>
            {/* Water in pool */}
            <ellipse cx="12" cy="17" rx="8" ry="3" fill="#42A5F5" opacity="0.7"/>
            {/* Ripples in water */}
            <ellipse cx="12" cy="17" rx="6" ry="2.2" fill="none" stroke="#90CAF9" strokeWidth="0.5" opacity="0.6"/>
            <ellipse cx="12" cy="17" rx="4" ry="1.5" fill="none" stroke="#BBDEFB" strokeWidth="0.3" opacity="0.5"/>
            {/* Central pedestal - tiered */}
            <ellipse cx="12" cy="14" rx="4" ry="1.5" fill="#607D8B"/>
            <rect x="9" y="10" width="6" height="4" fill="#78909C"/>
            <ellipse cx="12" cy="10" rx="3.5" ry="1.3" fill="#90A4AE"/>
            {/* Upper bowl */}
            <ellipse cx="12" cy="8" rx="3" ry="1.2" fill="#607D8B"/>
            <ellipse cx="12" cy="7.5" rx="2.5" ry="1" fill="#42A5F5" opacity="0.6"/>
            {/* Central spout */}
            <rect x="11" y="4" width="2" height="4" fill="#B0BEC5"/>
            {/* Water jets - animated feel */}
            <path d="M12 4 Q10 0 12 -2 Q14 0 12 4" fill="#90CAF9" opacity="0.7"/>
            <path d="M9 8 Q7 6 8 4" stroke="#90CAF9" strokeWidth="1" fill="none" opacity="0.5"/>
            <path d="M15 8 Q17 6 16 4" stroke="#90CAF9" strokeWidth="1" fill="none" opacity="0.5"/>
            {/* Spray droplets */}
            <circle cx="12" cy="-1" r="0.8" fill="#BBDEFB" opacity="0.8"/>
            <circle cx="10" cy="2" r="0.5" fill="#BBDEFB" opacity="0.6"/>
            <circle cx="14" cy="1" r="0.5" fill="#BBDEFB" opacity="0.6"/>
            {/* Decorative elements on base */}
            <circle cx="6" cy="17" r="1" fill="#B0BEC5" opacity="0.5"/>
            <circle cx="18" cy="17" r="1" fill="#B0BEC5" opacity="0.5"/>
        </g>
    ),
    // Fountain Edge - Water with stone rim
    'f': (
        <g>
            {/* Outer stone rim */}
            <ellipse cx="12" cy="12" rx="12" ry="6" fill="#78909C"/>
            <ellipse cx="12" cy="11" rx="11" ry="5.5" fill="#90A4AE"/>
            {/* Water surface */}
            <ellipse cx="12" cy="11" rx="10" ry="5" fill="#1565C0" opacity="0.6"/>
            <ellipse cx="12" cy="10.5" rx="9" ry="4.5" fill="#42A5F5" opacity="0.5"/>
            {/* Ripples */}
            <ellipse cx="12" cy="10" rx="7" ry="3.5" fill="none" stroke="#64B5F6" strokeWidth="0.5" opacity="0.4"/>
            <ellipse cx="12" cy="10" rx="4" ry="2" fill="none" stroke="#90CAF9" strokeWidth="0.3" opacity="0.3"/>
            {/* Light reflections */}
            <ellipse cx="8" cy="9" rx="2" ry="1" fill="#FFFFFF" opacity="0.2"/>
            <ellipse cx="15" cy="11" rx="1.5" ry="0.8" fill="#FFFFFF" opacity="0.15"/>
        </g>
    ),
    // Hedge
    'H': (
        <g>
            <rect x="2" y="4" width="20" height="16" fill="#15803D"/>
            <g opacity="0.4">
                <circle cx="6" cy="8" r="3" fill="#22C55E"/>
                <circle cx="12" cy="6" r="3" fill="#16A34A"/>
                <circle cx="18" cy="8" r="3" fill="#22C55E"/>
                <circle cx="8" cy="14" r="3" fill="#16A34A"/>
                <circle cx="16" cy="14" r="3" fill="#22C55E"/>
            </g>
            <rect x="2" y="3" width="20" height="2" fill="#166534"/>
        </g>
    ),
    // Kiosk
    'K': (
        <g>
            <ellipse cx="14" cy="22" rx="8" ry="2" fill="#000" opacity="0.2"/>
            <rect x="4" y="20" width="16" height="4" fill="#14532D"/>
            <rect x="5" y="6" width="14" height="14" fill="#166534"/>
            <rect x="4" y="4" width="16" height="3" fill="#14532D"/>
            <rect x="6" y="8" width="5" height="7" fill="#FFFDE7"/>
            <rect x="13" y="8" width="5" height="7" fill="#FEF9C3"/>
            <ellipse cx="12" cy="4" rx="8" ry="3" fill="#14532D"/>
            <circle cx="12" cy="1" r="1.5" fill="#FFD700"/>
        </g>
    ),
    // Carriage
    'C': (
        <g>
            <ellipse cx="12" cy="20" rx="10" ry="2" fill="#000" opacity="0.2"/>
            <circle cx="5" cy="18" r="4" fill="none" stroke="#5D4037" strokeWidth="2"/>
            <circle cx="19" cy="18" r="4" fill="none" stroke="#5D4037" strokeWidth="2"/>
            <rect x="4" y="8" width="16" height="10" rx="2" fill="#8B0000"/>
            <rect x="7" y="10" width="10" height="5" rx="1" fill="#1A237E" opacity="0.7"/>
            <path d="M3 8 Q12 4 21 8" fill="#4A0000"/>
            <rect x="1" y="8" width="2" height="3" fill="#FFD700"/>
        </g>
    ),
    // Statue
    'u': (
        <g>
            <rect x="6" y="16" width="12" height="8" fill="#A8A29E"/>
            <rect x="4" y="14" width="16" height="3" fill="#78716C"/>
            <ellipse cx="12" cy="10" rx="5" ry="6" fill="#E7E5E4"/>
            <circle cx="12" cy="6" r="4" fill="#E7E5E4"/>
        </g>
    ),
    // Column
    'c': (
        <g>
            <rect x="6" y="20" width="12" height="4" fill="#A8A29E"/>
            <rect x="7" y="4" width="10" height="16" fill="#D6D3D1"/>
            <line x1="9" y1="4" x2="9" y2="20" stroke="#A8A29E" strokeWidth="0.5"/>
            <line x1="12" y1="4" x2="12" y2="20" stroke="#A8A29E" strokeWidth="0.5"/>
            <line x1="15" y1="4" x2="15" y2="20" stroke="#A8A29E" strokeWidth="0.5"/>
            <rect x="5" y="2" width="14" height="3" fill="#A8A29E"/>
        </g>
    ),
    // Lantern (hanging)
    'l': (
        <g>
            <line x1="12" y1="0" x2="12" y2="6" stroke="#CA8A04" strokeWidth="1"/>
            <rect x="6" y="6" width="12" height="14" fill="none" stroke="#A16207" strokeWidth="2"/>
            <rect x="7" y="7" width="10" height="12" fill="#FDE68A"/>
            <circle cx="12" cy="13" r="4" fill="#FEF3C7"/>
            <path d="M6 6 L12 3 L18 6" fill="#CA8A04"/>
        </g>
    ),
    // Telescope
    'O': (
        <g>
            <path d="M6 22 L12 14 L18 22" stroke="#334155" strokeWidth="2" fill="none"/>
            <line x1="12" y1="22" x2="12" y2="14" stroke="#334155" strokeWidth="2"/>
            <ellipse cx="12" cy="8" rx="8" ry="4" fill="#92400E"/>
            <ellipse cx="18" cy="8" rx="3" ry="3" fill="#475569"/>
            <circle cx="18" cy="8" r="2" fill="#BAE6FD"/>
            <circle cx="5" cy="8" r="2" fill="#1E293B"/>
        </g>
    ),
    // Banner
    'B': (
        <g>
            <rect x="10" y="0" width="4" height="3" fill="#CA8A04"/>
            <path d="M4 3 L4 20 Q12 24 20 20 L20 3 Z" fill="#581C87"/>
            <circle cx="12" cy="12" r="4" fill="#EAB308"/>
            <path d="M12 8 L14 12 L12 16 L10 12 Z" fill="#3B0764"/>
        </g>
    ),
    // Carpet
    'r': (
        <g>
            <rect width="24" height="24" fill="#991B1B"/>
            <rect x="2" y="2" width="20" height="20" fill="none" stroke="#EAB308" strokeWidth="1"/>
            <rect x="4" y="4" width="16" height="16" fill="none" stroke="#CA8A04" strokeWidth="0.5"/>
            <circle cx="12" cy="12" r="4" fill="none" stroke="#EAB308" strokeWidth="1"/>
            <circle cx="12" cy="12" r="2" fill="#FBBF24"/>
        </g>
    ),
    // Display case
    'D': (
        <g>
            <rect x="2" y="4" width="20" height="16" fill="#E0F2FE" opacity="0.5"/>
            <rect x="2" y="4" width="20" height="16" fill="none" stroke="#CA8A04" strokeWidth="2"/>
            <circle cx="12" cy="10" r="3" fill="#92400E"/>
            <rect x="4" y="16" width="16" height="3" fill="#7F1D1D"/>
            <line x1="4" y1="6" x2="8" y2="10" stroke="white" strokeWidth="1" opacity="0.6"/>
        </g>
    ),
    // Tower Base lattice
    'A': (
        <g>
            <path d="M2 24 L12 2 L22 24" fill="none" stroke="#37474F" strokeWidth="3"/>
            <path d="M5 24 L12 8 L19 24" fill="none" stroke="#455A64" strokeWidth="2"/>
            <path d="M6 18 L18 18 M8 12 L16 12" stroke="#37474F" strokeWidth="1.5" fill="none"/>
            <circle cx="12" cy="8" r="1" fill="#546E7A"/>
        </g>
    ),
    // Railing
    'R': (
        <g>
            <rect x="2" y="4" width="3" height="16" fill="#334155"/>
            <rect x="19" y="4" width="3" height="16" fill="#334155"/>
            <rect x="0" y="6" width="24" height="2" fill="#475569"/>
            <rect x="0" y="12" width="24" height="2" fill="#475569"/>
            <rect x="0" y="18" width="24" height="2" fill="#475569"/>
            <circle cx="3.5" cy="4" r="2" fill="#64748B"/>
            <circle cx="20.5" cy="4" r="2" fill="#64748B"/>
        </g>
    ),
    // Elevator
    'e': (
        <g>
            <rect x="2" y="2" width="20" height="20" fill="#FEF3C7"/>
            <rect x="2" y="2" width="20" height="20" fill="none" stroke="#CA8A04" strokeWidth="2"/>
            <path d="M4 4 L20 20 M20 4 L4 20" stroke="#EAB308" strokeWidth="1"/>
            <path d="M12 2 V22 M2 12 H22" stroke="#EAB308" strokeWidth="1"/>
            <circle cx="12" cy="12" r="3" fill="#FBBF24"/>
            <text x="12" y="14" textAnchor="middle" fontSize="6" fill="#78350F">↑</text>
        </g>
    ),
    // Potted plant
    'q': (
        <g>
            <rect x="8" y="18" width="8" height="6" fill="#78350F"/>
            <rect x="6" y="16" width="12" height="3" fill="#92400E"/>
            <ellipse cx="12" cy="10" rx="8" ry="8" fill="#15803D"/>
            <ellipse cx="8" cy="8" rx="4" ry="5" fill="#22C55E"/>
            <ellipse cx="16" cy="8" rx="4" ry="5" fill="#22C55E"/>
            <ellipse cx="12" cy="6" rx="5" ry="4" fill="#16A34A"/>
        </g>
    ),
    // === NEW TILES ===
    // Table (café table)
    't': (
        <g>
            <ellipse cx="12" cy="20" rx="6" ry="2" fill="#000" opacity="0.15"/>
            <rect x="10" y="12" width="4" height="10" fill="#5D4037"/>
            <ellipse cx="12" cy="10" rx="8" ry="4" fill="#8D6E63"/>
            <ellipse cx="12" cy="9" rx="7" ry="3" fill="#A1887F"/>
            <circle cx="8" cy="9" r="1.5" fill="#FFFDE7" opacity="0.8"/>
            <circle cx="15" cy="9" r="1" fill="#6D4C41"/>
        </g>
    ),
    // Machinery (large industrial exhibit)
    'M': (
        <g>
            <rect x="2" y="4" width="20" height="16" fill="#37474F"/>
            <rect x="4" y="6" width="16" height="12" fill="#455A64"/>
            <circle cx="8" cy="12" r="4" fill="#263238" stroke="#546E7A" strokeWidth="1"/>
            <circle cx="8" cy="12" r="2" fill="#78909C"/>
            <circle cx="16" cy="12" r="3" fill="#263238" stroke="#546E7A" strokeWidth="1"/>
            <circle cx="16" cy="12" r="1.5" fill="#78909C"/>
            <rect x="11" y="8" width="2" height="8" fill="#546E7A"/>
            <rect x="3" y="18" width="4" height="2" fill="#B71C1C"/>
            <rect x="17" y="18" width="4" height="2" fill="#1B5E20"/>
            <rect x="2" y="2" width="20" height="3" fill="#263238"/>
            <path d="M6 3 L8 3 M10 3 L12 3 M14 3 L16 3" stroke="#4CAF50" strokeWidth="1"/>
        </g>
    ),
    // Donkey
    'd': (
        <g>
            <ellipse cx="14" cy="20" rx="6" ry="2" fill="#000" opacity="0.15"/>
            <ellipse cx="12" cy="14" rx="8" ry="5" fill="#8D7B68"/>
            <ellipse cx="6" cy="12" rx="3" ry="4" fill="#9E8B77"/>
            <circle cx="5" cy="10" r="3" fill="#8D7B68"/>
            <ellipse cx="3" cy="7" rx="1.5" ry="3" fill="#8D7B68"/>
            <ellipse cx="7" cy="7" rx="1.5" ry="3" fill="#8D7B68"/>
            <circle cx="4" cy="9" r="0.8" fill="#1A1A1A"/>
            <ellipse cx="5" cy="12" rx="1" ry="0.5" fill="#4A4A4A"/>
            <rect x="7" y="16" width="2" height="6" fill="#6D5D4D"/>
            <rect x="14" y="16" width="2" height="6" fill="#6D5D4D"/>
            <path d="M18 14 Q22 12 20 16" stroke="#6D5D4D" strokeWidth="1.5" fill="none"/>
        </g>
    ),
    // Stage
    'X': (
        <g>
            <rect x="0" y="0" width="24" height="24" fill="#4A3728"/>
            <rect x="1" y="1" width="22" height="22" fill="#5D4037"/>
            <g opacity="0.3">
                <line x1="0" y1="6" x2="24" y2="6" stroke="#3E2723" strokeWidth="1"/>
                <line x1="0" y1="12" x2="24" y2="12" stroke="#3E2723" strokeWidth="1"/>
                <line x1="0" y1="18" x2="24" y2="18" stroke="#3E2723" strokeWidth="1"/>
            </g>
            <rect x="0" y="22" width="24" height="2" fill="#3E2723"/>
        </g>
    ),
    // Seat (theater/concert seat)
    'z': (
        <g>
            <rect x="6" y="8" width="12" height="12" fill="#7B1FA2"/>
            <rect x="7" y="9" width="10" height="6" fill="#9C27B0"/>
            <rect x="5" y="6" width="14" height="3" fill="#6A1B9A"/>
            <rect x="6" y="18" width="4" height="4" fill="#4A148C"/>
            <rect x="14" y="18" width="4" height="4" fill="#4A148C"/>
        </g>
    ),
    // Market stall
    'k': (
        <g>
            <rect x="2" y="8" width="20" height="14" fill="#8D6E63"/>
            <rect x="3" y="10" width="18" height="10" fill="#A1887F"/>
            <rect x="0" y="4" width="24" height="5" fill="#D84315"/>
            <path d="M0 4 L6 0 L18 0 L24 4" fill="#BF360C"/>
            <rect x="5" y="12" width="4" height="3" fill="#FFEB3B"/>
            <rect x="10" y="11" width="4" height="4" fill="#4CAF50"/>
            <rect x="15" y="12" width="4" height="3" fill="#F44336"/>
            <circle cx="7" cy="18" r="2" fill="#795548"/>
            <circle cx="17" cy="18" r="2" fill="#795548"/>
        </g>
    ),
    // Brazier
    'Z': (
        <g>
            <ellipse cx="12" cy="18" rx="6" ry="3" fill="#424242"/>
            <ellipse cx="12" cy="16" rx="5" ry="2.5" fill="#616161"/>
            <ellipse cx="12" cy="14" rx="4" ry="2" fill="#FF5722"/>
            <ellipse cx="12" cy="13" rx="3" ry="1.5" fill="#FF9800"/>
            <ellipse cx="12" cy="12" rx="2" ry="1" fill="#FFEB3B"/>
            <path d="M10 10 Q9 6 11 4 M12 10 Q12 5 12 2 M14 10 Q15 6 13 4"
                  stroke="#FF5722" strokeWidth="1" fill="none" opacity="0.7"/>
            <circle cx="12" cy="3" r="1" fill="#FFEB3B" opacity="0.5"/>
        </g>
    ),
    // Window (viewing aperture)
    'W': (
        <g>
            <rect x="2" y="2" width="20" height="20" fill="#1E3A5F"/>
            <rect x="4" y="4" width="16" height="16" fill="#87CEEB"/>
            <path d="M4 4 L20 20 M20 4 L4 20" stroke="#455A64" strokeWidth="1"/>
            <path d="M12 4 V20 M4 12 H20" stroke="#455A64" strokeWidth="1"/>
            <rect x="2" y="2" width="20" height="20" fill="none" stroke="#37474F" strokeWidth="2"/>
            <ellipse cx="8" cy="8" rx="2" ry="1" fill="white" opacity="0.5"/>
        </g>
    ),
    // Glass floor
    'G': (
        <g>
            <rect x="0" y="0" width="24" height="24" fill="#E3F2FD" opacity="0.6"/>
            <rect x="2" y="2" width="20" height="20" fill="#BBDEFB" opacity="0.4"/>
            <path d="M0 0 L24 24 M24 0 L0 24" stroke="#90CAF9" strokeWidth="0.5" opacity="0.5"/>
            <path d="M0 12 H24 M12 0 V24" stroke="#64B5F6" strokeWidth="1" opacity="0.4"/>
            <g opacity="0.3">
                <rect x={3} y={16} width="1" height={4} fill="#4a5568"/>
                <rect x={10} y={18} width="1.5" height={3} fill="#5a6578"/>
                <rect x={18} y={15} width="1" height={5} fill="#4a5568"/>
            </g>
        </g>
    ),
    // Brick wall (low balustrade) - renamed from W to Y
    'Y': (
        <g>
            <rect x="0" y="4" width="24" height="16" fill="#8D6E63"/>
            <g stroke="#6D4C41" strokeWidth="0.5" fill="none">
                <line x1="0" y1="8" x2="24" y2="8"/>
                <line x1="0" y1="12" x2="24" y2="12"/>
                <line x1="0" y1="16" x2="24" y2="16"/>
                <line x1="6" y1="4" x2="6" y2="8"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="18" y1="4" x2="18" y2="8"/>
                <line x1="6" y1="12" x2="6" y2="16"/>
                <line x1="18" y1="12" x2="18" y2="16"/>
                <line x1="12" y1="16" x2="12" y2="20"/>
            </g>
            <rect x="0" y="2" width="24" height="3" fill="#A1887F"/>
        </g>
    ),
    // === GATE ENTRANCE TILES ===
    // Gate Arch - Monumental wrought iron pillar (Eiffel-style)
    'J': (
        <g>
            {/* Main arch structure - ornate wrought iron */}
            <rect x="8" y="0" width="8" height="24" fill="#2D3748"/>
            <rect x="10" y="2" width="4" height="20" fill="#1A202C"/>
            {/* Decorative ironwork scrolls */}
            <path d="M8 4 Q4 8 8 12 M16 4 Q20 8 16 12" stroke="#4A5568" strokeWidth="1.5" fill="none"/>
            <path d="M8 14 Q4 18 8 22 M16 14 Q20 18 16 22" stroke="#4A5568" strokeWidth="1.5" fill="none"/>
            {/* Rivets */}
            <circle cx="9" cy="3" r="1" fill="#64748B"/>
            <circle cx="15" cy="3" r="1" fill="#64748B"/>
            <circle cx="9" cy="21" r="1" fill="#64748B"/>
            <circle cx="15" cy="21" r="1" fill="#64748B"/>
            {/* Center decorative element */}
            <circle cx="12" cy="12" r="2" fill="#FFD700"/>
            {/* Iron lattice pattern */}
            <path d="M10 6 L14 10 M14 6 L10 10" stroke="#475569" strokeWidth="0.5"/>
            <path d="M10 14 L14 18 M14 14 L10 18" stroke="#475569" strokeWidth="0.5"/>
        </g>
    ),
    // Turnstile - Victorian-era entrance turnstile
    'I': (
        <g>
            {/* Base platform */}
            <rect x="4" y="18" width="16" height="6" fill="#374151"/>
            {/* Central post */}
            <rect x="10" y="6" width="4" height="14" fill="#1F2937"/>
            {/* Turnstile arms (rotating bars) */}
            <rect x="2" y="10" width="8" height="2" fill="#4B5563" rx="1"/>
            <rect x="14" y="10" width="8" height="2" fill="#4B5563" rx="1"/>
            <rect x="11" y="4" width="2" height="8" fill="#4B5563" rx="1"/>
            {/* Center hub */}
            <circle cx="12" cy="11" r="3" fill="#374151"/>
            <circle cx="12" cy="11" r="1.5" fill="#6B7280"/>
            {/* Entry indicator */}
            <path d="M6 6 L10 10 L6 14" stroke="#22C55E" strokeWidth="1.5" fill="none"/>
        </g>
    ),
    // Ticket Booth - Small ornate booth with attendant window
    'N': (
        <g>
            {/* Booth structure */}
            <rect x="2" y="8" width="20" height="16" fill="#166534"/>
            <rect x="4" y="10" width="16" height="12" fill="#15803D"/>
            {/* Roof */}
            <path d="M0 8 L12 2 L24 8 Z" fill="#14532D"/>
            <rect x="0" y="7" width="24" height="2" fill="#166534"/>
            {/* Window (ticket window) */}
            <rect x="6" y="12" width="12" height="6" fill="#FEF3C7"/>
            <rect x="6" y="12" width="12" height="6" fill="none" stroke="#B45309" strokeWidth="1"/>
            {/* Counter shelf */}
            <rect x="5" y="17" width="14" height="2" fill="#92400E"/>
            {/* "BILLETS" sign */}
            <rect x="7" y="5" width="10" height="3" fill="#FEF3C7"/>
            <text x="12" y="7.5" textAnchor="middle" fontSize="2.5" fill="#78350F" fontWeight="bold">BILLETS</text>
            {/* Decorative finial */}
            <circle cx="12" cy="1" r="1.5" fill="#FFD700"/>
        </g>
    ),
    // Guard Post - Police/guard station
    'Q': (
        <g>
            {/* Post structure */}
            <rect x="4" y="6" width="16" height="18" fill="#1E40AF"/>
            <rect x="6" y="8" width="12" height="14" fill="#2563EB"/>
            {/* Roof */}
            <rect x="2" y="4" width="20" height="3" fill="#1E3A8A"/>
            <rect x="0" y="3" width="24" height="2" fill="#1E40AF"/>
            {/* Window */}
            <rect x="8" y="10" width="8" height="5" fill="#BFDBFE"/>
            <path d="M12 10 V15 M8 12.5 H16" stroke="#1E3A8A" strokeWidth="0.5"/>
            {/* Door */}
            <rect x="9" y="16" width="6" height="8" fill="#1E3A8A"/>
            <circle cx="14" cy="20" r="0.8" fill="#FFD700"/>
            {/* "POLICE" sign */}
            <rect x="5" y="5" width="14" height="2" fill="#FEF3C7"/>
            <text x="12" y="6.5" textAnchor="middle" fontSize="2" fill="#1E40AF" fontWeight="bold">SERGENT</text>
            {/* Lantern on top */}
            <rect x="10" y="0" width="4" height="4" fill="#FEF3C7"/>
            <rect x="10" y="0" width="4" height="4" fill="none" stroke="#B45309" strokeWidth="0.5"/>
        </g>
    ),
    // Flagpole - Tall pole with French tricolore
    'y': (
        <g>
            {/* Pole */}
            <rect x="11" y="0" width="2" height="22" fill="#78716C"/>
            {/* Base */}
            <rect x="8" y="20" width="8" height="4" fill="#57534E"/>
            <rect x="6" y="22" width="12" height="2" fill="#44403C"/>
            {/* Flag (French tricolore) */}
            <rect x="13" y="2" width="4" height="8" fill="#002395"/>
            <rect x="17" y="2" width="4" height="8" fill="#FFFFFF"/>
            <rect x="21" y="2" width="4" height="8" fill="#ED2939"/>
            {/* Flag wave effect */}
            <path d="M13 2 Q15 4 13 6 Q15 8 13 10" stroke="#001F7D" strokeWidth="0.3" fill="none"/>
            <path d="M25 2 Q23 4 25 6 Q23 8 25 10" stroke="#C41E3A" strokeWidth="0.3" fill="none"/>
            {/* Finial (golden ball) */}
            <circle cx="12" cy="1" r="2" fill="#FFD700"/>
            <circle cx="12" cy="1" r="1" fill="#FEF3C7"/>
        </g>
    ),
    // === CHAIR ORIENTATIONS ===
    // Chair facing North (toward top of screen)
    '1': (
        <g>
            <ellipse cx="12" cy="20" rx="5" ry="2" fill="#000" opacity="0.15"/>
            {/* Chair legs */}
            <rect x="6" y="14" width="2" height="8" fill="#5D4037"/>
            <rect x="16" y="14" width="2" height="8" fill="#5D4037"/>
            {/* Seat */}
            <rect x="5" y="12" width="14" height="4" fill="#8D6E63" rx="1"/>
            {/* Back (facing away - we see the back of chair) */}
            <rect x="5" y="4" width="14" height="9" fill="#6D4C41" rx="1"/>
            <rect x="6" y="5" width="12" height="7" fill="#8D6E63" rx="1"/>
        </g>
    ),
    // Chair facing South (toward bottom of screen)
    '2': (
        <g>
            <ellipse cx="12" cy="20" rx="5" ry="2" fill="#000" opacity="0.15"/>
            {/* Chair legs */}
            <rect x="6" y="14" width="2" height="8" fill="#5D4037"/>
            <rect x="16" y="14" width="2" height="8" fill="#5D4037"/>
            {/* Seat */}
            <rect x="5" y="12" width="14" height="4" fill="#8D6E63" rx="1"/>
            {/* Back (facing toward viewer - we see cushioned front) */}
            <rect x="5" y="4" width="14" height="9" fill="#7B1FA2" rx="1"/>
            <ellipse cx="12" cy="8" rx="5" ry="3" fill="#9C27B0"/>
        </g>
    ),
    // Chair facing East (toward right)
    '3': (
        <g>
            <ellipse cx="12" cy="20" rx="5" ry="2" fill="#000" opacity="0.15"/>
            {/* Chair legs */}
            <rect x="6" y="14" width="2" height="8" fill="#5D4037"/>
            <rect x="16" y="14" width="2" height="8" fill="#5D4037"/>
            {/* Seat */}
            <rect x="5" y="12" width="14" height="4" fill="#8D6E63" rx="1"/>
            {/* Back (on left side, facing right) */}
            <rect x="2" y="4" width="8" height="12" fill="#6D4C41" rx="1"/>
            <rect x="3" y="5" width="6" height="10" fill="#8D6E63" rx="1"/>
        </g>
    ),
    // Chair facing West (toward left)
    '4': (
        <g>
            <ellipse cx="12" cy="20" rx="5" ry="2" fill="#000" opacity="0.15"/>
            {/* Chair legs */}
            <rect x="6" y="14" width="2" height="8" fill="#5D4037"/>
            <rect x="16" y="14" width="2" height="8" fill="#5D4037"/>
            {/* Seat */}
            <rect x="5" y="12" width="14" height="4" fill="#8D6E63" rx="1"/>
            {/* Back (on right side, facing left) */}
            <rect x="14" y="4" width="8" height="12" fill="#6D4C41" rx="1"/>
            <rect x="15" y="5" width="6" height="10" fill="#8D6E63" rx="1"/>
        </g>
    ),
    // === CUSHION (for oriental seating) ===
    'a': (
        <g>
            <ellipse cx="12" cy="14" rx="8" ry="5" fill="#B91C1C"/>
            <ellipse cx="12" cy="12" rx="7" ry="4" fill="#DC2626"/>
            <ellipse cx="12" cy="11" rx="5" ry="3" fill="#EF4444"/>
            {/* Tassel detail */}
            <circle cx="12" cy="11" r="2" fill="#FCD34D"/>
            <path d="M10 11 L8 14 M14 11 L16 14" stroke="#FCD34D" strokeWidth="1"/>
        </g>
    ),

    // ============================================
    // VILLAGE & SPECIAL BIOME TILES
    // ============================================

    // Thatched Hut (h)
    'h': (
        <g>
            {/* Shadow */}
            <ellipse cx="14" cy="22" rx="8" ry="2" fill="#000" opacity="0.2"/>
            {/* Hut base - mud/adobe walls */}
            <rect x="4" y="12" width="16" height="10" fill="#8B7355"/>
            <rect x="4" y="12" width="16" height="2" fill="#6B5344"/>
            {/* Thatched roof */}
            <path d="M2 12 L12 2 L22 12 Z" fill="#C4A574"/>
            <path d="M4 12 L12 4 L20 12 Z" fill="#D4B584"/>
            {/* Roof texture lines */}
            <line x1="6" y1="11" x2="12" y2="5" stroke="#A08464" strokeWidth="0.5"/>
            <line x1="10" y1="11" x2="12" y2="9" stroke="#A08464" strokeWidth="0.5"/>
            <line x1="14" y1="11" x2="12" y2="9" stroke="#A08464" strokeWidth="0.5"/>
            <line x1="18" y1="11" x2="12" y2="5" stroke="#A08464" strokeWidth="0.5"/>
            {/* Door opening */}
            <rect x="9" y="16" width="6" height="6" fill="#3D2817"/>
        </g>
    ),

    // Fire Pit (U)
    'U': (
        <g>
            {/* Stone ring */}
            <ellipse cx="12" cy="16" rx="8" ry="4" fill="#6B7280"/>
            <ellipse cx="12" cy="15" rx="6" ry="3" fill="#4B5563"/>
            {/* Glowing coals */}
            <ellipse cx="12" cy="15" rx="5" ry="2.5" fill="#F97316"/>
            <ellipse cx="12" cy="14.5" rx="4" ry="2" fill="#FB923C"/>
            <ellipse cx="12" cy="14" rx="3" ry="1.5" fill="#FBBF24"/>
            {/* Animated flames */}
            <g className="animate-pulse">
                <path d="M10 14 Q9 10 11 8 Q12 11 13 8 Q15 10 14 14" fill="#EF4444" opacity="0.9"/>
                <path d="M11 13 Q10 11 12 9 Q14 11 13 13" fill="#F59E0B" opacity="0.8"/>
            </g>
            {/* Smoke wisps */}
            <ellipse cx="10" cy="6" rx="2" ry="1" fill="#9CA3AF" opacity="0.4"/>
            <ellipse cx="14" cy="4" rx="1.5" ry="0.8" fill="#9CA3AF" opacity="0.3"/>
        </g>
    ),

    // Drum (!)
    '!': (
        <g>
            {/* Shadow */}
            <ellipse cx="13" cy="21" rx="5" ry="1.5" fill="#000" opacity="0.15"/>
            {/* Drum body */}
            <ellipse cx="12" cy="18" rx="6" ry="3" fill="#5D3A1A"/>
            <rect x="6" y="8" width="12" height="10" fill="#7C4A24"/>
            <ellipse cx="12" cy="8" rx="6" ry="3" fill="#8B5A2B"/>
            {/* Drum skin */}
            <ellipse cx="12" cy="8" rx="5" ry="2.5" fill="#F5DEB3"/>
            {/* Rope bindings */}
            <path d="M6 10 L6 16 M18 10 L18 16" stroke="#4A3728" strokeWidth="1"/>
            <path d="M8 9 L8 17 M16 9 L16 17" stroke="#4A3728" strokeWidth="0.5"/>
        </g>
    ),

    // Totem/Carved Sculpture (@)
    '@': (
        <g>
            {/* Shadow */}
            <ellipse cx="14" cy="22" rx="4" ry="1.5" fill="#000" opacity="0.2"/>
            {/* Totem pole */}
            <rect x="9" y="4" width="6" height="18" fill="#5D3A1A"/>
            {/* Carved face - top */}
            <circle cx="12" cy="7" r="3" fill="#7C4A24"/>
            <circle cx="11" cy="6.5" r="0.8" fill="#1F1F1F"/>
            <circle cx="13" cy="6.5" r="0.8" fill="#1F1F1F"/>
            <path d="M10 8 Q12 9.5 14 8" stroke="#1F1F1F" strokeWidth="0.8" fill="none"/>
            {/* Middle carving */}
            <rect x="10" y="12" width="4" height="4" fill="#6B4423"/>
            <path d="M10 14 L14 14" stroke="#4A3728" strokeWidth="0.5"/>
            {/* Base carving */}
            <rect x="8" y="18" width="8" height="4" fill="#4A3728"/>
        </g>
    ),

    // Palm Tree (%)
    '%': (
        <g>
            {/* Shadow */}
            <ellipse cx="14" cy="22" rx="7" ry="2" fill="#000" opacity="0.2"/>
            {/* Trunk - curved */}
            <path d="M12 22 Q10 16 11 10 Q12 6 12 4" stroke="#8B7355" strokeWidth="3" fill="none"/>
            <path d="M12 22 Q10 16 11 10 Q12 6 12 4" stroke="#A08464" strokeWidth="2" fill="none"/>
            {/* Palm fronds */}
            <path d="M12 4 Q6 1 2 4" stroke="#228B22" strokeWidth="2" fill="none"/>
            <path d="M12 4 Q18 1 22 4" stroke="#228B22" strokeWidth="2" fill="none"/>
            <path d="M12 4 Q4 5 0 10" stroke="#228B22" strokeWidth="2" fill="none"/>
            <path d="M12 4 Q20 5 24 10" stroke="#228B22" strokeWidth="2" fill="none"/>
            <path d="M12 4 Q8 8 4 12" stroke="#2D8B2D" strokeWidth="1.5" fill="none"/>
            <path d="M12 4 Q16 8 20 12" stroke="#2D8B2D" strokeWidth="1.5" fill="none"/>
            {/* Coconuts */}
            <circle cx="11" cy="6" r="1.5" fill="#8B4513"/>
            <circle cx="13" cy="5.5" r="1.2" fill="#8B4513"/>
        </g>
    ),

    // Animated Waterfall (|)
    '|': (
        <g>
            {/* Waterfall stream - animated */}
            <defs>
                <linearGradient id="waterfall-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#BFDBFE"/>
                    <stop offset="50%" stopColor="#60A5FA"/>
                    <stop offset="100%" stopColor="#3B82F6"/>
                </linearGradient>
            </defs>
            <rect x="4" y="0" width="16" height="24" fill="url(#waterfall-grad)"/>
            {/* Water texture - vertical lines */}
            <g className="animate-pulse" opacity="0.6">
                <line x1="6" y1="0" x2="6" y2="24" stroke="#FFFFFF" strokeWidth="1"/>
                <line x1="10" y1="2" x2="10" y2="24" stroke="#FFFFFF" strokeWidth="1.5"/>
                <line x1="14" y1="1" x2="14" y2="24" stroke="#FFFFFF" strokeWidth="1"/>
                <line x1="18" y1="0" x2="18" y2="24" stroke="#FFFFFF" strokeWidth="1"/>
            </g>
            {/* Foam/spray at top and bottom */}
            <ellipse cx="12" cy="2" rx="8" ry="2" fill="#FFFFFF" opacity="0.5"/>
            <ellipse cx="12" cy="22" rx="10" ry="3" fill="#FFFFFF" opacity="0.4"/>
            {/* Mist particles */}
            <circle cx="3" cy="8" r="1" fill="#FFFFFF" opacity="0.3"/>
            <circle cx="21" cy="12" r="1.5" fill="#FFFFFF" opacity="0.3"/>
            <circle cx="2" cy="18" r="1" fill="#FFFFFF" opacity="0.2"/>
        </g>
    ),

    // Cascade Rock (^)
    '^': (
        <g>
            {/* Large boulder */}
            <path d="M2 20 L6 8 L12 4 L18 8 L22 20 Z" fill="#6B7280"/>
            <path d="M4 18 L8 10 L12 6 L16 10 L20 18 Z" fill="#9CA3AF"/>
            {/* Rock texture */}
            <path d="M8 14 L10 12 L14 14 L12 16 Z" fill="#4B5563" opacity="0.5"/>
            <line x1="6" y1="16" x2="10" y2="14" stroke="#4B5563" strokeWidth="0.5"/>
            <line x1="14" y1="12" x2="18" y2="16" stroke="#4B5563" strokeWidth="0.5"/>
            {/* Moss patches */}
            <ellipse cx="6" cy="18" rx="2" ry="1" fill="#4ADE80" opacity="0.4"/>
            <ellipse cx="16" cy="16" rx="1.5" ry="0.8" fill="#4ADE80" opacity="0.3"/>
        </g>
    ),

    // Moorish Arch (()
    '(': (
        <g>
            {/* Arch structure */}
            <rect x="0" y="0" width="6" height="24" fill="#D4A574"/>
            <rect x="18" y="0" width="6" height="24" fill="#D4A574"/>
            {/* Horseshoe arch */}
            <path d="M6 24 L6 10 Q6 2 12 2 Q18 2 18 10 L18 24" fill="none" stroke="#B8860B" strokeWidth="2"/>
            <path d="M6 24 L6 12 Q6 4 12 4 Q18 4 18 12 L18 24" fill="#1A1A2E" opacity="0.3"/>
            {/* Decorative elements */}
            <circle cx="12" cy="8" r="2" fill="#FFD700" opacity="0.6"/>
            <rect x="10" y="16" width="4" height="8" fill="#B8860B" opacity="0.4"/>
            {/* Column details */}
            <line x1="3" y1="0" x2="3" y2="24" stroke="#B8860B" strokeWidth="0.5"/>
            <line x1="21" y1="0" x2="21" y2="24" stroke="#B8860B" strokeWidth="0.5"/>
        </g>
    ),

    // Minaret/Tower ())
    ')': (
        <g>
            {/* Shadow */}
            <ellipse cx="14" cy="22" rx="4" ry="1.5" fill="#000" opacity="0.2"/>
            {/* Tower base */}
            <rect x="8" y="16" width="8" height="6" fill="#D4A574"/>
            {/* Tower body */}
            <rect x="9" y="6" width="6" height="10" fill="#E4B584"/>
            {/* Dome */}
            <path d="M9 6 Q9 2 12 1 Q15 2 15 6 Z" fill="#FFD700"/>
            {/* Finial */}
            <line x1="12" y1="1" x2="12" y2="-1" stroke="#FFD700" strokeWidth="1"/>
            <circle cx="12" cy="-2" r="1" fill="#FFD700"/>
            {/* Windows */}
            <rect x="10.5" y="8" width="3" height="4" rx="1.5" fill="#1A1A2E" opacity="0.5"/>
            <rect x="10.5" y="14" width="3" height="2" fill="#1A1A2E" opacity="0.4"/>
            {/* Decorative band */}
            <rect x="9" y="12" width="6" height="1" fill="#B8860B"/>
        </g>
    ),

    // ============================================
    // BEAUX-ARTS FOUNTAIN COMPONENTS
    // Elaborate multi-tile fountain parts
    // ============================================

    // Basin North Edge («)
    '«': (
        <g>
            {/* Stone basin rim - north edge */}
            <rect x="0" y="8" width="24" height="12" fill="#87CEEB" opacity="0.6"/>
            <rect x="0" y="4" width="24" height="6" fill="#B8B8B8"/>
            <rect x="0" y="2" width="24" height="3" fill="#D4D4D4"/>
            {/* Decorative molding */}
            <rect x="0" y="1" width="24" height="2" fill="#E8E8E8"/>
            <path d="M0 3 Q6 5 12 3 T24 3" stroke="#A0A0A0" fill="none" strokeWidth="0.5"/>
            {/* Water edge ripple */}
            <path d="M2 12 Q6 10 12 12 T22 12" stroke="#4FC3F7" fill="none" strokeWidth="1" opacity="0.8">
                <animate attributeName="d"
                    values="M2 12 Q6 10 12 12 T22 12;M2 12 Q6 14 12 12 T22 12;M2 12 Q6 10 12 12 T22 12"
                    dur="2s" repeatCount="indefinite"/>
            </path>
        </g>
    ),

    // Basin South Edge (»)
    '»': (
        <g>
            {/* Water surface at top */}
            <rect x="0" y="0" width="24" height="10" fill="#87CEEB" opacity="0.6"/>
            {/* Stone basin rim - south edge */}
            <rect x="0" y="10" width="24" height="6" fill="#D4D4D4"/>
            <rect x="0" y="16" width="24" height="4" fill="#B8B8B8"/>
            <rect x="0" y="20" width="24" height="4" fill="#A0A0A0"/>
            {/* Shadow underneath */}
            <rect x="2" y="22" width="20" height="2" fill="#000" opacity="0.15"/>
            {/* Decorative scroll */}
            <ellipse cx="6" cy="14" rx="3" ry="2" fill="none" stroke="#909090" strokeWidth="0.5"/>
            <ellipse cx="18" cy="14" rx="3" ry="2" fill="none" stroke="#909090" strokeWidth="0.5"/>
        </g>
    ),

    // Basin East Edge (≥)
    '≥': (
        <g>
            {/* Water surface */}
            <rect x="0" y="0" width="14" height="24" fill="#87CEEB" opacity="0.6"/>
            {/* Stone basin rim - east edge */}
            <rect x="14" y="0" width="6" height="24" fill="#D4D4D4"/>
            <rect x="20" y="0" width="4" height="24" fill="#B8B8B8"/>
            {/* Side shadow */}
            <rect x="22" y="2" width="2" height="20" fill="#000" opacity="0.1"/>
            {/* Ripple animation */}
            <path d="M4 6 Q7 8 4 12 T4 18" stroke="#4FC3F7" fill="none" strokeWidth="0.8" opacity="0.6">
                <animate attributeName="d"
                    values="M4 6 Q7 8 4 12 T4 18;M4 6 Q1 8 4 12 T4 18;M4 6 Q7 8 4 12 T4 18"
                    dur="2.5s" repeatCount="indefinite"/>
            </path>
        </g>
    ),

    // Basin West Edge (≤)
    '≤': (
        <g>
            {/* Stone basin rim - west edge */}
            <rect x="0" y="0" width="4" height="24" fill="#B8B8B8"/>
            <rect x="4" y="0" width="6" height="24" fill="#D4D4D4"/>
            {/* Water surface */}
            <rect x="10" y="0" width="14" height="24" fill="#87CEEB" opacity="0.6"/>
            {/* Side shadow */}
            <rect x="0" y="2" width="2" height="20" fill="#000" opacity="0.1"/>
            {/* Ripple animation */}
            <path d="M18 6 Q15 8 18 12 T18 18" stroke="#4FC3F7" fill="none" strokeWidth="0.8" opacity="0.6">
                <animate attributeName="d"
                    values="M18 6 Q15 8 18 12 T18 18;M18 6 Q21 8 18 12 T18 18;M18 6 Q15 8 18 12 T18 18"
                    dur="2.3s" repeatCount="indefinite"/>
            </path>
        </g>
    ),

    // Basin Corner NW (╔)
    '╔': (
        <g>
            {/* Corner stone */}
            <rect x="0" y="0" width="24" height="24" fill="#B8B8B8"/>
            <rect x="10" y="10" width="14" height="14" fill="#87CEEB" opacity="0.6"/>
            {/* Decorative corner piece */}
            <path d="M0 0 L10 0 L10 10 L0 10 Z" fill="#D4D4D4"/>
            <circle cx="5" cy="5" r="3" fill="#E8E8E8"/>
            <circle cx="5" cy="5" r="1.5" fill="#D4D4D4"/>
            {/* Molding */}
            <path d="M10 0 L10 10 L24 10" stroke="#A0A0A0" fill="none" strokeWidth="1"/>
        </g>
    ),

    // Basin Corner NE (╗)
    '╗': (
        <g>
            {/* Corner stone */}
            <rect x="0" y="0" width="24" height="24" fill="#B8B8B8"/>
            <rect x="0" y="10" width="14" height="14" fill="#87CEEB" opacity="0.6"/>
            {/* Decorative corner piece */}
            <path d="M14 0 L24 0 L24 10 L14 10 Z" fill="#D4D4D4"/>
            <circle cx="19" cy="5" r="3" fill="#E8E8E8"/>
            <circle cx="19" cy="5" r="1.5" fill="#D4D4D4"/>
            {/* Molding */}
            <path d="M0 10 L14 10 L14 0" stroke="#A0A0A0" fill="none" strokeWidth="1"/>
        </g>
    ),

    // Basin Corner SW (╚)
    '╚': (
        <g>
            {/* Water at top */}
            <rect x="10" y="0" width="14" height="14" fill="#87CEEB" opacity="0.6"/>
            {/* Corner stone */}
            <rect x="0" y="0" width="10" height="24" fill="#B8B8B8"/>
            <rect x="0" y="14" width="24" height="10" fill="#B8B8B8"/>
            {/* Decorative corner */}
            <path d="M0 14 L10 14 L10 24 L0 24 Z" fill="#D4D4D4"/>
            <circle cx="5" cy="19" r="3" fill="#E8E8E8"/>
            <circle cx="5" cy="19" r="1.5" fill="#D4D4D4"/>
            {/* Shadow */}
            <rect x="2" y="22" width="20" height="2" fill="#000" opacity="0.12"/>
        </g>
    ),

    // Basin Corner SE (╝)
    '╝': (
        <g>
            {/* Water at top */}
            <rect x="0" y="0" width="14" height="14" fill="#87CEEB" opacity="0.6"/>
            {/* Corner stone */}
            <rect x="14" y="0" width="10" height="24" fill="#B8B8B8"/>
            <rect x="0" y="14" width="24" height="10" fill="#B8B8B8"/>
            {/* Decorative corner */}
            <path d="M14 14 L24 14 L24 24 L14 24 Z" fill="#D4D4D4"/>
            <circle cx="19" cy="19" r="3" fill="#E8E8E8"/>
            <circle cx="19" cy="19" r="1.5" fill="#D4D4D4"/>
            {/* Shadow */}
            <rect x="2" y="22" width="20" height="2" fill="#000" opacity="0.12"/>
        </g>
    ),

    // Fountain Water Surface (≈)
    '≈': (
        <g>
            {/* Base water */}
            <rect x="0" y="0" width="24" height="24" fill="#87CEEB" opacity="0.7"/>
            {/* Animated ripples */}
            <circle cx="12" cy="12" r="4" fill="none" stroke="#4FC3F7" strokeWidth="0.8" opacity="0.6">
                <animate attributeName="r" values="4;10;4" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="12" cy="12" r="7" fill="none" stroke="#81D4FA" strokeWidth="0.5" opacity="0.4">
                <animate attributeName="r" values="7;12;7" dur="3s" repeatCount="indefinite" begin="0.5s"/>
                <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" begin="0.5s"/>
            </circle>
            {/* Light reflections */}
            <ellipse cx="8" cy="8" rx="3" ry="1.5" fill="#fff" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.5;0.3" dur="2s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="16" cy="16" rx="2" ry="1" fill="#fff" opacity="0.2"/>
        </g>
    ),

    // Fountain Spout/Jet (⌂)
    '⌂': (
        <g>
            {/* Water base */}
            <rect x="0" y="0" width="24" height="24" fill="#87CEEB" opacity="0.6"/>
            {/* Central jet structure */}
            <ellipse cx="12" cy="20" rx="6" ry="3" fill="#D4D4D4"/>
            <rect x="9" y="12" width="6" height="8" fill="#C0C0C0"/>
            {/* Water jet */}
            <path d="M12 12 Q10 6 12 2 Q14 6 12 12" fill="#4FC3F7" opacity="0.8">
                <animate attributeName="d"
                    values="M12 12 Q10 6 12 2 Q14 6 12 12;M12 12 Q10 4 12 0 Q14 4 12 12;M12 12 Q10 6 12 2 Q14 6 12 12"
                    dur="1s" repeatCount="indefinite"/>
            </path>
            {/* Water droplets */}
            <circle cx="9" cy="8" r="1" fill="#81D4FA" opacity="0.7">
                <animate attributeName="cy" values="8;16;8" dur="0.8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.7;0;0.7" dur="0.8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="15" cy="6" r="0.8" fill="#81D4FA" opacity="0.6">
                <animate attributeName="cy" values="6;14;6" dur="0.7s" repeatCount="indefinite" begin="0.3s"/>
                <animate attributeName="opacity" values="0.6;0;0.6" dur="0.7s" repeatCount="indefinite" begin="0.3s"/>
            </circle>
            {/* Spray mist */}
            <circle cx="12" cy="4" r="4" fill="#B3E5FC" opacity="0.3">
                <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>
            </circle>
        </g>
    ),

    // Fountain Statue/Sculpture (♦)
    '♦': (
        <g>
            {/* Water base */}
            <rect x="0" y="0" width="24" height="24" fill="#87CEEB" opacity="0.5"/>
            {/* Pedestal */}
            <rect x="6" y="16" width="12" height="6" fill="#D4D4D4"/>
            <rect x="8" y="14" width="8" height="3" fill="#C0C0C0"/>
            {/* Classical figure silhouette */}
            <ellipse cx="12" cy="12" rx="4" ry="6" fill="#B8860B"/>
            <circle cx="12" cy="6" r="3" fill="#B8860B"/>
            {/* Figure details - arms */}
            <path d="M8 10 Q4 8 6 6" stroke="#B8860B" strokeWidth="2" fill="none"/>
            <path d="M16 10 Q20 8 18 6" stroke="#B8860B" strokeWidth="2" fill="none"/>
            {/* Highlight */}
            <ellipse cx="11" cy="7" rx="1" ry="1.5" fill="#DAA520" opacity="0.5"/>
            {/* Water dripping from figure */}
            <circle cx="7" cy="14" r="0.5" fill="#4FC3F7">
                <animate attributeName="cy" values="14;20;14" dur="1s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.8;0;0.8" dur="1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="17" cy="13" r="0.5" fill="#4FC3F7">
                <animate attributeName="cy" values="13;19;13" dur="1.2s" repeatCount="indefinite" begin="0.4s"/>
            </circle>
        </g>
    ),
};

// Pre-computed TERRAIN graphics (full tiles, no overlay)
const TERRAIN_GRAPHICS: Record<string, (biome: BiomeType, seed: number) => JSX.Element> = {
    // Water (animated Seine for bridge biome)
    '~': (biome) => (
        <g>
            {biome === 'BRIDGE' ? (
                // Animated water pattern for the Seine
                <rect width="24" height="24" fill="url(#pattern-water)"/>
            ) : (
                // Standard static water for other biomes
                <>
                    <rect width="24" height="24" fill="#1565C0" opacity="0.8"/>
                    <path d="M0 8 Q6 4 12 8 T24 8" stroke="#42A5F5" fill="none" strokeWidth="2" opacity="0.6"/>
                    <path d="M0 14 Q6 10 12 14 T24 14" stroke="#64B5F6" fill="none" strokeWidth="1.5" opacity="0.5"/>
                    <path d="M0 20 Q6 16 12 20 T24 20" stroke="#90CAF9" fill="none" strokeWidth="1" opacity="0.4"/>
                </>
            )}
        </g>
    ),
    // Pylon
    'P': () => (
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
    'V': (_, seed) => (
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
    'S': () => (
        <g>
            <rect width="24" height="24" fill="#92400E"/>
            <rect x="2" y="2" width="20" height="20" fill="none" stroke="#B45309" strokeWidth="1"/>
            <path d="M6 6 L18 6 M6 12 L18 12 M6 18 L18 18" stroke="#78350F" strokeWidth="1"/>
            <rect x="0" y="0" width="24" height="2" fill="#EAB308"/>
            <rect x="0" y="22" width="24" height="2" fill="#EAB308"/>
        </g>
    ),
    // Gala Entrance
    'G': () => (
        <g>
            <path d="M0 24 L0 8 Q0 0 12 0 Q24 0 24 8 L24 24" fill="#D7CCC8"/>
            <path d="M2 24 L2 10 Q2 2 12 2 Q22 2 22 10 L22 24" fill="#8B0000"/>
            <path d="M9 0 L12 4 L15 0" fill="#FFD700"/>
            <rect x="3" y="10" width="8" height="14" fill="#6B0000"/>
            <rect x="13" y="10" width="8" height="14" fill="#6B0000"/>
            <line x1="12" y1="6" x2="12" y2="24" stroke="#FFD700" strokeWidth="1.5"/>
            <circle cx="10" cy="17" r="1.5" fill="#FFD700"/>
            <circle cx="14" cy="17" r="1.5" fill="#FFD700"/>
        </g>
    ),
    // Exhibition borders
    '[': () => (
        <g>
            <rect x="0" y="0" width="6" height="24" fill="#4A5568"/>
            <rect x="1" y="2" width="4" height="20" fill="#5A6578"/>
            <rect x="0" y="0" width="8" height="3" fill="#6A7588"/>
            <rect x="0" y="21" width="8" height="3" fill="#6A7588"/>
        </g>
    ),
    ']': () => (
        <g>
            <rect x="18" y="0" width="6" height="24" fill="#4A5568"/>
            <rect x="19" y="2" width="4" height="20" fill="#5A6578"/>
            <rect x="16" y="0" width="8" height="3" fill="#6A7588"/>
            <rect x="16" y="21" width="8" height="3" fill="#6A7588"/>
        </g>
    ),
    // Entrance marker
    'E': () => (
        <g>
            <path d="M4 24 L4 8 Q4 2 12 2 Q20 2 20 8 L20 24" fill="none" stroke="#FFD700" strokeWidth="2"/>
            <path d="M6 24 L6 10 Q6 4 12 4 Q18 4 18 10 L18 24" fill="#1A202C" opacity="0.5"/>
            <circle cx="12" cy="3" r="2" fill="#FFD700"/>
            <path d="M8 16 L12 12 L16 16 M12 12 L12 22" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
        </g>
    ),
    // Door
    '+': () => (
        <g>
            <rect x="3" y="0" width="18" height="24" fill="#5D4037"/>
            <rect x="5" y="2" width="14" height="20" fill="#8D6E63"/>
            <rect x="7" y="4" width="10" height="6" fill="#6D4C41" stroke="#5D4037" strokeWidth="0.5"/>
            <rect x="7" y="12" width="10" height="8" fill="#6D4C41" stroke="#5D4037" strokeWidth="0.5"/>
            <circle cx="15" cy="13" r="1.5" fill="#FFD54F"/>
        </g>
    ),
    // Water Pool (Trocadéro reflecting pool)
    'W': (_, seed) => (
        <g>
            {/* Pool water */}
            <rect width="24" height="24" fill="#0C4A6E"/>
            {/* Reflective surface */}
            <rect width="24" height="24" fill="#0EA5E9" opacity="0.4"/>
            {/* Ripple effect */}
            <ellipse cx="12" cy="12" rx="10" ry="8" fill="none" stroke="#38BDF8" strokeWidth="0.5" opacity="0.6"/>
            <ellipse cx="12" cy="12" rx="6" ry="5" fill="none" stroke="#7DD3FC" strokeWidth="0.5" opacity="0.4"/>
            {/* Light reflections */}
            <ellipse cx={8 + seed * 8} cy={8 + seed * 4} rx="3" ry="1.5" fill="#FFFFFF" opacity="0.2"/>
            <ellipse cx={14 - seed * 4} cy={16 - seed * 2} rx="2" ry="1" fill="#FFFFFF" opacity="0.15"/>
            {/* Stone edge hint */}
            <rect x="0" y="0" width="24" height="1" fill="#6B7280" opacity="0.3"/>
            <rect x="0" y="23" width="24" height="1" fill="#6B7280" opacity="0.3"/>
        </g>
    ),
};

// Wall tiles by biome
const WALL_TILES: Record<string, JSX.Element> = {
    'GRAND_HALL': (
        <g>
            <rect width="24" height="24" fill="#2D3748"/>
            <rect x="0" y="0" width="4" height="24" fill="#1A202C"/>
            <rect x="20" y="0" width="4" height="24" fill="#1A202C"/>
            <rect x="0" y="10" width="24" height="4" fill="#1A202C"/>
            <circle cx="2" cy="4" r="1.5" fill="#4A5568"/>
            <circle cx="2" cy="20" r="1.5" fill="#4A5568"/>
            <circle cx="22" cy="4" r="1.5" fill="#4A5568"/>
            <circle cx="22" cy="20" r="1.5" fill="#4A5568"/>
        </g>
    ),
    'TOWER_LEVEL': (
        <g>
            <rect width="24" height="24" fill="#2D3748"/>
            <rect x="0" y="0" width="4" height="24" fill="#1A202C"/>
            <rect x="20" y="0" width="4" height="24" fill="#1A202C"/>
            <rect x="0" y="10" width="24" height="4" fill="#1A202C"/>
            <circle cx="2" cy="4" r="1.5" fill="#4A5568"/>
            <circle cx="2" cy="20" r="1.5" fill="#4A5568"/>
            <circle cx="22" cy="4" r="1.5" fill="#4A5568"/>
            <circle cx="22" cy="20" r="1.5" fill="#4A5568"/>
        </g>
    ),
    'TOWER_BASE': (
        <g>
            <rect width="24" height="24" fill="#2D3748"/>
            <rect x="0" y="0" width="4" height="24" fill="#1A202C"/>
            <rect x="20" y="0" width="4" height="24" fill="#1A202C"/>
            <rect x="0" y="10" width="24" height="4" fill="#1A202C"/>
            <circle cx="2" cy="4" r="1.5" fill="#4A5568"/>
            <circle cx="2" cy="20" r="1.5" fill="#4A5568"/>
            <circle cx="22" cy="4" r="1.5" fill="#4A5568"/>
            <circle cx="22" cy="20" r="1.5" fill="#4A5568"/>
        </g>
    ),
    'SALON': (
        <g>
            <rect x="0" y="0" width="24" height="14" fill="#8B4513"/>
            <g opacity="0.3">
                <circle cx="6" cy="4" r="2" fill="#654321"/>
                <circle cx="18" cy="4" r="2" fill="#654321"/>
                <circle cx="12" cy="10" r="2" fill="#654321"/>
            </g>
            <rect x="0" y="13" width="24" height="2" fill="#5D4037"/>
            <rect x="0" y="15" width="24" height="9" fill="#6D4C41"/>
            <rect x="2" y="17" width="8" height="5" fill="#5D4037"/>
            <rect x="14" y="17" width="8" height="5" fill="#5D4037"/>
            <rect x="0" y="22" width="24" height="2" fill="#3E2723"/>
        </g>
    ),
    'STREET': (
        <g>
            <rect width="24" height="24" fill="#D7CCC8"/>
            <g stroke="#BCAAA4" strokeWidth="0.5" fill="none">
                <rect x="1" y="1" width="10" height="6"/>
                <rect x="13" y="1" width="10" height="6"/>
                <rect x="1" y="9" width="22" height="6"/>
                <rect x="1" y="17" width="10" height="6"/>
                <rect x="13" y="17" width="10" height="6"/>
            </g>
            <rect x="0" y="22" width="24" height="2" fill="#8D6E63" opacity="0.5"/>
        </g>
    ),
    'GARDEN': (
        <g>
            <rect x="0" y="8" width="24" height="16" fill="#9E9E9E"/>
            <g opacity="0.4">
                <rect x="1" y="10" width="7" height="5" fill="#757575" rx="1"/>
                <rect x="10" y="9" width="6" height="6" fill="#BDBDBD" rx="1"/>
                <rect x="18" y="10" width="5" height="5" fill="#757575" rx="1"/>
            </g>
            <rect x="0" y="6" width="24" height="3" fill="#BDBDBD"/>
            <rect x="0" y="0" width="24" height="6" fill="#1B2838" opacity="0.8"/>
        </g>
    ),
    'ESPLANADE': (
        <g>
            <rect x="0" y="8" width="24" height="16" fill="#9E9E9E"/>
            <g opacity="0.4">
                <rect x="1" y="10" width="7" height="5" fill="#757575" rx="1"/>
                <rect x="10" y="9" width="6" height="6" fill="#BDBDBD" rx="1"/>
                <rect x="18" y="10" width="5" height="5" fill="#757575" rx="1"/>
            </g>
            <rect x="0" y="6" width="24" height="3" fill="#BDBDBD"/>
            <rect x="0" y="0" width="24" height="6" fill="#1B2838" opacity="0.8"/>
        </g>
    ),
    'GATE': (
        <g>
            {/* Ornate stone wall with iron detailing */}
            <rect width="24" height="24" fill="#D7CCC8"/>
            <g stroke="#BCAAA4" strokeWidth="0.5" fill="none">
                <rect x="1" y="1" width="10" height="6"/>
                <rect x="13" y="1" width="10" height="6"/>
                <rect x="1" y="9" width="22" height="6"/>
                <rect x="1" y="17" width="10" height="6"/>
                <rect x="13" y="17" width="10" height="6"/>
            </g>
            {/* Iron railing on top */}
            <rect x="0" y="0" width="24" height="3" fill="#374151"/>
            <circle cx="4" cy="1.5" r="1" fill="#4B5563"/>
            <circle cx="12" cy="1.5" r="1" fill="#4B5563"/>
            <circle cx="20" cy="1.5" r="1" fill="#4B5563"/>
        </g>
    ),
    'DEFAULT': (
        <g>
            <rect width="24" height="24" fill="#1A1A2E"/>
            <rect x="0" y="2" width="24" height="22" fill="#2D2D44"/>
            <g opacity="0.2">
                <line x1="0" y1="8" x2="24" y2="8" stroke="#404060" strokeWidth="1"/>
                <line x1="0" y1="16" x2="24" y2="16" stroke="#404060" strokeWidth="1"/>
            </g>
            <line x1="0" y1="2" x2="24" y2="2" stroke="#4A4A6A" strokeWidth="1"/>
        </g>
    ),
    // === CULTURAL WALL VARIANTS ===
    // Japanese Shoji screens
    'JAPANESE': (
        <g>
            <rect width="24" height="24" fill="#F5F5DC"/>
            {/* Wood frame */}
            <rect x="0" y="0" width="2" height="24" fill="#8B5A2B"/>
            <rect x="22" y="0" width="2" height="24" fill="#8B5A2B"/>
            <rect x="0" y="0" width="24" height="2" fill="#8B5A2B"/>
            <rect x="0" y="22" width="24" height="2" fill="#8B5A2B"/>
            {/* Shoji grid */}
            <line x1="8" y1="2" x2="8" y2="22" stroke="#8B5A2B" strokeWidth="0.5"/>
            <line x1="16" y1="2" x2="16" y2="22" stroke="#8B5A2B" strokeWidth="0.5"/>
            <line x1="2" y1="8" x2="22" y2="8" stroke="#8B5A2B" strokeWidth="0.5"/>
            <line x1="2" y1="15" x2="22" y2="15" stroke="#8B5A2B" strokeWidth="0.5"/>
            {/* Rice paper translucency */}
            <rect x="2" y="2" width="20" height="20" fill="#FFFEF0" opacity="0.5"/>
        </g>
    ),
    // Chinese lacquered panels
    'CHINESE': (
        <g>
            <rect width="24" height="24" fill="#8B0000"/>
            {/* Gold border frame */}
            <rect x="0" y="0" width="24" height="2" fill="#FFD700"/>
            <rect x="0" y="22" width="24" height="2" fill="#FFD700"/>
            <rect x="0" y="0" width="2" height="24" fill="#FFD700"/>
            <rect x="22" y="0" width="2" height="24" fill="#FFD700"/>
            {/* Dragon motif pattern */}
            <path d="M6 8 Q10 4 14 8 Q18 12 14 16 Q10 20 6 16 Q4 12 6 8"
                  fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.6"/>
            {/* Cloud accents */}
            <circle cx="18" cy="6" r="2" fill="#FFD700" opacity="0.3"/>
            <circle cx="6" cy="18" r="2" fill="#FFD700" opacity="0.3"/>
        </g>
    ),
    // Persian/Middle Eastern tilework
    'PERSIAN': (
        <g>
            <rect width="24" height="24" fill="#1E3A5F"/>
            {/* Geometric tile pattern */}
            <polygon points="12,2 22,12 12,22 2,12" fill="none" stroke="#DAA520" strokeWidth="1"/>
            <circle cx="12" cy="12" r="4" fill="#8B0000"/>
            <circle cx="12" cy="12" r="2" fill="#DAA520"/>
            {/* Corner tiles */}
            <rect x="0" y="0" width="4" height="4" fill="#DAA520" opacity="0.5"/>
            <rect x="20" y="0" width="4" height="4" fill="#DAA520" opacity="0.5"/>
            <rect x="0" y="20" width="4" height="4" fill="#DAA520" opacity="0.5"/>
            <rect x="20" y="20" width="4" height="4" fill="#DAA520" opacity="0.5"/>
        </g>
    ),
    // Egyptian hieroglyph walls
    'EGYPTIAN': (
        <g>
            <rect width="24" height="24" fill="#C4A77D"/>
            {/* Stone blocks */}
            <rect x="1" y="1" width="10" height="10" fill="#D4B896" stroke="#A08860" strokeWidth="0.5"/>
            <rect x="13" y="1" width="10" height="10" fill="#CAAE7E" stroke="#A08860" strokeWidth="0.5"/>
            <rect x="1" y="13" width="10" height="10" fill="#CAAE7E" stroke="#A08860" strokeWidth="0.5"/>
            <rect x="13" y="13" width="10" height="10" fill="#D4B896" stroke="#A08860" strokeWidth="0.5"/>
            {/* Hieroglyph symbols */}
            <circle cx="6" cy="6" r="2" fill="none" stroke="#6B4423" strokeWidth="0.5"/>
            <path d="M16 4 L20 8 L16 8 Z" fill="none" stroke="#6B4423" strokeWidth="0.5"/>
            <line x1="4" y1="16" x2="8" y2="20" stroke="#6B4423" strokeWidth="0.5"/>
            <rect x="16" y="16" width="4" height="4" fill="none" stroke="#6B4423" strokeWidth="0.5"/>
        </g>
    ),
    // Moorish arched tilework
    'MOORISH': (
        <g>
            <rect width="24" height="24" fill="#FFFFFF"/>
            {/* Blue geometric pattern */}
            <polygon points="12,0 24,12 12,24 0,12" fill="#1E3A5F"/>
            <polygon points="12,4 20,12 12,20 4,12" fill="#FFFFFF"/>
            <polygon points="12,8 16,12 12,16 8,12" fill="#1E3A5F"/>
            {/* Gold accents */}
            <circle cx="12" cy="12" r="2" fill="#DAA520"/>
            <circle cx="12" cy="0" r="1" fill="#DAA520"/>
            <circle cx="0" cy="12" r="1" fill="#DAA520"/>
            <circle cx="24" cy="12" r="1" fill="#DAA520"/>
            <circle cx="12" cy="24" r="1" fill="#DAA520"/>
        </g>
    ),
    // Italian marble/fresco
    'ITALIAN': (
        <g>
            <rect width="24" height="24" fill="#F5F5F5"/>
            {/* Marble veining */}
            <path d="M0 8 Q8 4 16 10 Q20 14 24 12" stroke="#E0E0E0" strokeWidth="2" fill="none"/>
            <path d="M0 18 Q6 14 12 18 Q18 22 24 16" stroke="#BDBDBD" strokeWidth="1" fill="none"/>
            {/* Classical column detail at top */}
            <rect x="0" y="0" width="24" height="4" fill="#D4AF37"/>
            <rect x="0" y="3" width="24" height="1" fill="#B8860B"/>
            {/* Fresco panel suggestion */}
            <rect x="4" y="8" width="16" height="12" fill="none" stroke="#D4AF37" strokeWidth="0.5"/>
        </g>
    ),
};

const MapTile: React.FC<MapTileProps> = ({ char, x, y, biome = 'STREET', zoneName }) => {
    if (char === ' ') return null;

    const seed = hash(x, y);
    const floorPattern = getFloorPattern(biome, zoneName);

    // OBJECT TILES: Render terrain underneath, then object on top
    if (OBJECT_TILES.has(char)) {
        const objectGraphic = OBJECT_GRAPHICS[char];

        // Special handling for seed-varying objects
        let objectContent: JSX.Element | null = objectGraphic || null;

        // Handle seed-varying objects and zone-specific objects
        if (char === 'B') { // Banner - check for national flag colors first
            const nameLower = (zoneName || '').toLowerCase();
            let colors = { stripe1: '#581C87', stripe2: '#EAB308', stripe3: '#581C87', emblem: '#FFD700' }; // Default purple/gold

            // National flag colors based on zone name
            if (nameLower.includes('belgium') || nameLower.includes('belgian')) {
                colors = { stripe1: '#000000', stripe2: '#FFD700', stripe3: '#FF0000', emblem: '#FFD700' };
            } else if (nameLower.includes('france') || nameLower.includes('french')) {
                colors = { stripe1: '#002654', stripe2: '#FFFFFF', stripe3: '#CE1126', emblem: '#FFD700' };
            } else if (nameLower.includes('germany') || nameLower.includes('german')) {
                colors = { stripe1: '#000000', stripe2: '#DD0000', stripe3: '#FFCC00', emblem: '#000000' };
            } else if (nameLower.includes('italy') || nameLower.includes('italian')) {
                colors = { stripe1: '#009246', stripe2: '#FFFFFF', stripe3: '#CE2B37', emblem: '#FFD700' };
            } else if (nameLower.includes('spain') || nameLower.includes('spanish')) {
                colors = { stripe1: '#AA151B', stripe2: '#F1BF00', stripe3: '#AA151B', emblem: '#F1BF00' };
            } else if (nameLower.includes('russia') || nameLower.includes('russian')) {
                colors = { stripe1: '#FFFFFF', stripe2: '#0039A6', stripe3: '#D52B1E', emblem: '#FFD700' };
            } else if (nameLower.includes('japan') || nameLower.includes('nippon')) {
                colors = { stripe1: '#FFFFFF', stripe2: '#BC002D', stripe3: '#FFFFFF', emblem: '#BC002D' };
            } else if (nameLower.includes('china') || nameLower.includes('chinese')) {
                colors = { stripe1: '#DE2910', stripe2: '#FFDE00', stripe3: '#DE2910', emblem: '#FFDE00' };
            } else if (nameLower.includes('britain') || nameLower.includes('british') || nameLower.includes('england')) {
                colors = { stripe1: '#012169', stripe2: '#FFFFFF', stripe3: '#C8102E', emblem: '#FFFFFF' };
            } else if (nameLower.includes('america') || nameLower.includes('usa') || nameLower.includes('united states')) {
                colors = { stripe1: '#B22234', stripe2: '#FFFFFF', stripe3: '#3C3B6E', emblem: '#FFFFFF' };
            } else if (nameLower.includes('netherlands') || nameLower.includes('dutch')) {
                colors = { stripe1: '#AE1C28', stripe2: '#FFFFFF', stripe3: '#21468B', emblem: '#FF6600' };
            } else if (nameLower.includes('sweden') || nameLower.includes('swedish')) {
                colors = { stripe1: '#006AA7', stripe2: '#FECC00', stripe3: '#006AA7', emblem: '#FECC00' };
            } else if (nameLower.includes('norway') || nameLower.includes('norwegian')) {
                colors = { stripe1: '#BA0C2F', stripe2: '#FFFFFF', stripe3: '#00205B', emblem: '#FFFFFF' };
            } else if (nameLower.includes('mexico') || nameLower.includes('mexican')) {
                colors = { stripe1: '#006341', stripe2: '#FFFFFF', stripe3: '#CE1126', emblem: '#8B4513' };
            } else if (nameLower.includes('brazil') || nameLower.includes('brazilian')) {
                colors = { stripe1: '#009739', stripe2: '#FEDD00', stripe3: '#009739', emblem: '#002776' };
            } else if (nameLower.includes('argentina') || nameLower.includes('argentine')) {
                colors = { stripe1: '#74ACDF', stripe2: '#FFFFFF', stripe3: '#74ACDF', emblem: '#F6B40E' };
            } else if (nameLower.includes('egypt') || nameLower.includes('egyptian')) {
                colors = { stripe1: '#CE1126', stripe2: '#FFFFFF', stripe3: '#000000', emblem: '#C09300' };
            } else if (nameLower.includes('persia') || nameLower.includes('persian') || nameLower.includes('iran')) {
                colors = { stripe1: '#239F40', stripe2: '#FFFFFF', stripe3: '#DA0000', emblem: '#DA0000' };
            } else if (nameLower.includes('ottoman') || nameLower.includes('turkey') || nameLower.includes('turkish')) {
                colors = { stripe1: '#E30A17', stripe2: '#FFFFFF', stripe3: '#E30A17', emblem: '#FFFFFF' };
            } else if (nameLower.includes('greece') || nameLower.includes('greek')) {
                colors = { stripe1: '#0D5EAF', stripe2: '#FFFFFF', stripe3: '#0D5EAF', emblem: '#FFFFFF' };
            } else if (nameLower.includes('switzerland') || nameLower.includes('swiss')) {
                colors = { stripe1: '#FF0000', stripe2: '#FFFFFF', stripe3: '#FF0000', emblem: '#FFFFFF' };
            } else if (nameLower.includes('austria') || nameLower.includes('austrian')) {
                colors = { stripe1: '#ED2939', stripe2: '#FFFFFF', stripe3: '#ED2939', emblem: '#FFD700' };
            } else if (nameLower.includes('senegal') || nameLower.includes('africa')) {
                colors = { stripe1: '#00853F', stripe2: '#FDEF42', stripe3: '#E31B23', emblem: '#00853F' };
            } else if (nameLower.includes('algeria') || nameLower.includes('algerian')) {
                colors = { stripe1: '#006233', stripe2: '#FFFFFF', stripe3: '#D21034', emblem: '#D21034' };
            } else if (nameLower.includes('tunis') || nameLower.includes('tunisia')) {
                colors = { stripe1: '#E70013', stripe2: '#FFFFFF', stripe3: '#E70013', emblem: '#E70013' };
            } else if (nameLower.includes('morocco') || nameLower.includes('moroccan')) {
                colors = { stripe1: '#C1272D', stripe2: '#006233', stripe3: '#C1272D', emblem: '#006233' };
            } else if (nameLower.includes('portugal') || nameLower.includes('portuguese')) {
                colors = { stripe1: '#006600', stripe2: '#FF0000', stripe3: '#006600', emblem: '#FFCC00' };
            } else if (nameLower.includes('india') || nameLower.includes('indian') || nameLower.includes('hindustan')) {
                colors = { stripe1: '#FF9933', stripe2: '#FFFFFF', stripe3: '#138808', emblem: '#000080' };
            } else if (nameLower.includes('siam') || nameLower.includes('thailand') || nameLower.includes('thai')) {
                colors = { stripe1: '#A51931', stripe2: '#FFFFFF', stripe3: '#2D2A4A', emblem: '#FFFFFF' };
            } else if (nameLower.includes('annam') || nameLower.includes('vietnam') || nameLower.includes('indochina')) {
                colors = { stripe1: '#DA251D', stripe2: '#FFFF00', stripe3: '#DA251D', emblem: '#FFFF00' };
            } else if (nameLower.includes('cambodia') || nameLower.includes('cambodian') || nameLower.includes('khmer')) {
                colors = { stripe1: '#032EA1', stripe2: '#E00025', stripe3: '#032EA1', emblem: '#FFFFFF' };
            }

            objectContent = (
                <g>
                    {/* Pole */}
                    <rect x="10" y="0" width="4" height="3" fill="#CA8A04"/>
                    {/* Banner with horizontal stripes */}
                    <path d="M4 3 L4 20 Q12 24 20 20 L20 3 Z" fill={colors.stripe2}/>
                    <rect x="4" y="3" width="16" height="5" fill={colors.stripe1}/>
                    <rect x="4" y="15" width="16" height="6" fill={colors.stripe3} clipPath="url(#bannerClip)"/>
                    {/* Emblem/decoration */}
                    <circle cx="12" cy="12" r="3" fill={colors.emblem} opacity="0.8"/>
                </g>
            );
        } else if (char === 'n') { // Newspaper
            objectContent = (
                <g transform={`rotate(${seed * 30 - 15} 12 12)`}>
                    <rect x="6" y="8" width="12" height="9" fill="#FFFDE7" stroke="#9E9E9E" strokeWidth="0.5"/>
                    <rect x="7" y="9" width="10" height="1.5" fill="#212121"/>
                    <line x1="7" y1="12" x2="17" y2="12" stroke="#757575" strokeWidth="0.5"/>
                    <line x1="7" y1="14" x2="17" y2="14" stroke="#757575" strokeWidth="0.5"/>
                </g>
            );
        } else if (char === 'p') { // Puddle
            objectContent = (
                <g>
                    <ellipse cx="12" cy="12" rx={8 + seed * 3} ry={5 + seed * 2} fill="#4A90A4" opacity="0.6"/>
                    <ellipse cx="10" cy="10" rx={4 + seed * 2} ry={2 + seed} fill="#87CEEB" opacity="0.4"/>
                </g>
            );
        } else if (char === 's') { // Steam vent
            objectContent = (
                <g>
                    <rect x="4" y="4" width="16" height="16" fill="#37474F" rx="2"/>
                    <g stroke="#263238" strokeWidth="1.5">
                        <line x1="6" y1="4" x2="6" y2="20"/>
                        <line x1="10" y1="4" x2="10" y2="20"/>
                        <line x1="14" y1="4" x2="14" y2="20"/>
                        <line x1="18" y1="4" x2="18" y2="20"/>
                    </g>
                    <g opacity="0.6">
                        <ellipse cx={8 + seed * 4} cy={6 - seed * 2} rx="3" ry="2" fill="#E0E0E0"/>
                        <ellipse cx={14 + seed * 2} cy={4 - seed * 3} rx="4" ry="2.5" fill="#F5F5F5"/>
                    </g>
                </g>
            );
        } else if (char === 'w') { // Flowerbed - randomized Victorian garden flowers
            // Use position-based seed for variety
            const flowerSeed = (x * 7 + y * 13) % 100 / 100;
            const flowerType = Math.floor(flowerSeed * 5); // 5 different flower arrangements

            // Color palettes for different flower types
            const palettes = [
                { primary: '#F472B6', secondary: '#EC4899', accent: '#FBBF24', leaf: '#15803D' }, // Pink roses
                { primary: '#A855F7', secondary: '#9333EA', accent: '#FDE047', leaf: '#166534' }, // Purple iris
                { primary: '#FB7185', secondary: '#F43F5E', accent: '#FEF08A', leaf: '#16A34A' }, // Red carnations
                { primary: '#60A5FA', secondary: '#3B82F6', accent: '#FCD34D', leaf: '#15803D' }, // Blue hydrangeas
                { primary: '#FBBF24', secondary: '#F59E0B', accent: '#FEF3C7', leaf: '#166534' }, // Yellow marigolds
            ];
            const palette = palettes[flowerType];

            objectContent = (
                <g>
                    {/* Rich garden soil base */}
                    <rect width="24" height="24" fill="#4A2C17"/>
                    <rect x="1" y="1" width="22" height="22" fill="#5D3A1A"/>
                    {/* Soil texture */}
                    <circle cx="4" cy="4" r="1" fill="#3D2412" opacity="0.5"/>
                    <circle cx="12" cy="20" r="1.5" fill="#3D2412" opacity="0.4"/>
                    <circle cx="20" cy="8" r="1" fill="#3D2412" opacity="0.5"/>

                    {/* Foliage base layer */}
                    <ellipse cx="6" cy="18" rx="4" ry="3" fill={palette.leaf} opacity="0.9"/>
                    <ellipse cx="18" cy="16" rx="5" ry="4" fill={palette.leaf} opacity="0.85"/>
                    <ellipse cx="12" cy="20" rx="4" ry="2.5" fill={palette.leaf} opacity="0.8"/>

                    {/* Leaves */}
                    <ellipse cx="3" cy="12" rx="2" ry="5" fill={palette.leaf} transform="rotate(-25 3 12)"/>
                    <ellipse cx="21" cy="10" rx="2" ry="4" fill={palette.leaf} transform="rotate(20 21 10)"/>
                    <ellipse cx="8" cy="14" rx="1.5" ry="4" fill={palette.leaf} transform="rotate(-10 8 14)" opacity="0.9"/>
                    <ellipse cx="16" cy="12" rx="1.5" ry="4" fill={palette.leaf} transform="rotate(15 16 12)" opacity="0.9"/>

                    {/* Main flowers - multi-petal design */}
                    {/* Flower 1 - large bloom */}
                    <g transform="translate(6, 7)">
                        <circle cx="0" cy="-2.5" r="2" fill={palette.primary}/>
                        <circle cx="2.5" cy="0" r="2" fill={palette.primary}/>
                        <circle cx="0" cy="2.5" r="2" fill={palette.secondary}/>
                        <circle cx="-2.5" cy="0" r="2" fill={palette.primary}/>
                        <circle cx="1.8" cy="-1.8" r="1.8" fill={palette.secondary}/>
                        <circle cx="1.8" cy="1.8" r="1.8" fill={palette.primary}/>
                        <circle cx="-1.8" cy="1.8" r="1.8" fill={palette.secondary}/>
                        <circle cx="-1.8" cy="-1.8" r="1.8" fill={palette.primary}/>
                        <circle cx="0" cy="0" r="1.5" fill={palette.accent}/>
                    </g>

                    {/* Flower 2 - medium bloom */}
                    <g transform="translate(17, 5)">
                        <circle cx="0" cy="-2" r="1.6" fill={palette.secondary}/>
                        <circle cx="2" cy="0" r="1.6" fill={palette.primary}/>
                        <circle cx="0" cy="2" r="1.6" fill={palette.secondary}/>
                        <circle cx="-2" cy="0" r="1.6" fill={palette.primary}/>
                        <circle cx="0" cy="0" r="1.2" fill={palette.accent}/>
                    </g>

                    {/* Flower 3 - small accent bloom */}
                    <g transform="translate(11, 11)">
                        <circle cx="0" cy="-1.5" r="1.2" fill={palette.primary}/>
                        <circle cx="1.5" cy="0" r="1.2" fill={palette.secondary}/>
                        <circle cx="0" cy="1.5" r="1.2" fill={palette.primary}/>
                        <circle cx="-1.5" cy="0" r="1.2" fill={palette.secondary}/>
                        <circle cx="0" cy="0" r="0.9" fill={palette.accent}/>
                    </g>

                    {/* Small buds and accents based on position */}
                    {flowerSeed > 0.3 && <circle cx="20" cy="14" r="1.3" fill={palette.primary}/>}
                    {flowerSeed > 0.5 && <circle cx="4" cy="16" r="1.1" fill={palette.secondary}/>}
                    {flowerSeed > 0.7 && <circle cx="14" cy="18" r="1.2" fill={palette.primary}/>}

                    {/* Decorative border edge */}
                    <rect x="0" y="22" width="24" height="2" fill="#6B4226"/>
                </g>
            );
        } else if (char === 'r') { // Carpet - uses culturally appropriate pattern
            const carpetPattern = zoneName ? getCarpetPattern(zoneName) : 'url(#pattern-persian)';
            objectContent = (
                <g>
                    {/* Carpet using cultural pattern */}
                    <rect width="24" height="24" fill={carpetPattern}/>
                    {/* Subtle edge/fringe */}
                    <rect x="0" y="0" width="24" height="1" fill="#8B4513" opacity="0.3"/>
                    <rect x="0" y="23" width="24" height="1" fill="#8B4513" opacity="0.3"/>
                    <rect x="0" y="0" width="1" height="24" fill="#8B4513" opacity="0.3"/>
                    <rect x="23" y="0" width="1" height="24" fill="#8B4513" opacity="0.3"/>
                </g>
            );
        }

        if (!objectContent) return null;

        // Objects that should NOT have additional shadow (already have built-in or are flat)
        const noShadowObjects = new Set(['n', 'p', 'w', 'r', 'f', 'a']); // newspaper, puddle, flowerbed, carpet, fountain edge, cushion
        const needsShadow = !noShadowObjects.has(char);

        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible">
                    {/* Base terrain layer */}
                    <rect width="24" height="24" fill={floorPattern}/>
                    {/* Consistent shadow layer (light from NW, shadow to SE) */}
                    {needsShadow && (
                        <g opacity="0.15">
                            <ellipse cx="14" cy="21" rx="7" ry="2" fill="#000"/>
                        </g>
                    )}
                    {/* Object layer on top */}
                    {objectContent}
                </svg>
            </div>
        );
    }

    // TERRAIN TILES: Render as complete tiles

    // Floor tile variation helpers - use seed for deterministic randomness
    const tileVariant = Math.floor(seed * 3); // 0, 1, or 2
    const tileRotation = Math.floor(seed * 4) * 90; // 0, 90, 180, or 270
    const tileShade = 0.95 + (seed * 0.1); // 0.95 to 1.05 brightness variation
    const hasScuff = seed > 0.8; // 20% chance of scuff mark
    const hasCrack = seed > 0.92; // 8% chance of crack
    const scuffX = Math.floor(seed * 18) + 3;
    const scuffY = Math.floor((seed * 1.5) % 1 * 18) + 3;

    // Floor
    if (char === '.') {
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    {/* Base pattern */}
                    <rect width="24" height="24" fill={floorPattern}/>
                    {/* Rotation variation - offset the pattern */}
                    <g style={{ transform: `rotate(${tileRotation}deg)`, transformOrigin: '12px 12px' }}>
                        {/* Subtle shade variation overlay */}
                        <rect width="24" height="24" fill={tileShade < 1 ? '#000' : '#fff'} opacity={Math.abs(1 - tileShade) * 0.15}/>
                    </g>
                    {/* Optional scuff mark */}
                    {hasScuff && (
                        <ellipse cx={scuffX} cy={scuffY} rx="3" ry="1.5" fill="#000" opacity="0.08" transform={`rotate(${seed * 180}, ${scuffX}, ${scuffY})`}/>
                    )}
                    {/* Optional hairline crack */}
                    {hasCrack && (
                        <path d={`M${scuffX} ${scuffY} l${3 - seed * 6} ${4 - seed * 2} l${seed * 2} ${2}`} stroke="#000" strokeWidth="0.3" opacity="0.12" fill="none"/>
                    )}
                    {/* Subtle edge darkening for depth */}
                    {tileVariant === 0 && <rect x="0" y="22" width="24" height="2" fill="#000" opacity="0.05"/>}
                    {tileVariant === 1 && <rect x="22" y="0" width="2" height="24" fill="#000" opacity="0.05"/>}
                </svg>
            </div>
        );
    }

    // Path/sidewalk
    if (char === ':') {
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    <rect width="24" height="24" fill={biome === 'STREET' ? 'url(#pattern-sidewalk)' : floorPattern}/>
                    {/* Path wear variation */}
                    <rect width="24" height="24" fill={tileShade < 1 ? '#000' : '#fff'} opacity={Math.abs(1 - tileShade) * 0.1}/>
                    {hasScuff && (
                        <ellipse cx={scuffX} cy={scuffY} rx="2" ry="1" fill="#5D4037" opacity="0.15"/>
                    )}
                </svg>
            </div>
        );
    }

    // Grass
    if (char === 'g') {
        // Different grass blade positions based on seed
        const bladeOffsetX = seed * 6;
        const bladeOffsetY = (seed * 1.3) % 1 * 6;
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    <rect width="24" height="24" fill="url(#pattern-grass)"/>
                    {/* Extra grass blades for variation */}
                    {tileVariant === 0 && (
                        <g opacity="0.6">
                            <line x1={4 + bladeOffsetX} y1="20" x2={3 + bladeOffsetX} y2="16" stroke="#4A7C4A" strokeWidth="1"/>
                            <line x1={18 + bladeOffsetY} y1="22" x2={17 + bladeOffsetY} y2="17" stroke="#3D6B3D" strokeWidth="1"/>
                        </g>
                    )}
                    {tileVariant === 1 && (
                        <g opacity="0.5">
                            <circle cx={10 + bladeOffsetX} cy={10 + bladeOffsetY} r="1" fill="#5A8C5A"/>
                            <circle cx={16 + bladeOffsetY} cy={18 + bladeOffsetX} r="0.8" fill="#6B9C6B"/>
                        </g>
                    )}
                    {/* Subtle shadow variation */}
                    <rect width="24" height="24" fill="#000" opacity={seed * 0.08}/>
                </svg>
            </div>
        );
    }

    // Gravel
    if (char === 'v') {
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    <rect width="24" height="24" fill="url(#pattern-gravel)"/>
                    {/* Random pebble highlights */}
                    <circle cx={6 + seed * 12} cy={8 + seed * 8} r="1.5" fill="#D0C0B0" opacity="0.4"/>
                    <circle cx={16 - seed * 8} cy={16 + seed * 4} r="1" fill="#E0D0C0" opacity="0.3"/>
                    {tileVariant === 2 && (
                        <circle cx={12} cy={12} r="2" fill="#C0B0A0" opacity="0.25"/>
                    )}
                </svg>
            </div>
        );
    }

    // Worn floor (high traffic)
    if (char === ',') {
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    <rect width="24" height="24" fill="url(#pattern-worn)"/>
                </svg>
            </div>
        );
    }

    // Polished floor (near features)
    if (char === '`') {
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    <rect width="24" height="24" fill="url(#pattern-polished)"/>
                </svg>
            </div>
        );
    }

    // Wood plank floor
    if (char === 'o') {
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    <rect width="24" height="24" fill="url(#pattern-woodplank)"/>
                </svg>
            </div>
        );
    }

    // Wall
    if (char === '#') {
        // Check for culturally-specific wall style first
        let wallKey = biome as string;
        if (zoneName) {
            const culturalWall = getCulturalWallStyle(zoneName);
            if (culturalWall) {
                wallKey = culturalWall;
            }
        }
        const wallContent = WALL_TILES[wallKey] || WALL_TILES['DEFAULT'];
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    {wallContent}
                </svg>
            </div>
        );
    }

    // North wall (back wall - decorative face visible from below)
    if (char === '▲') {
        // Check for culturally-specific wall style first
        let wallKey = biome as string;
        if (zoneName) {
            const culturalWall = getCulturalWallStyle(zoneName);
            if (culturalWall) {
                wallKey = culturalWall;
            }
        }
        const baseColor = wallKey === 'JAPANESE' ? '#F5F5DC' :
                          wallKey === 'CHINESE' ? '#8B0000' :
                          wallKey === 'PERSIAN' ? '#1E3A5F' :
                          wallKey === 'EGYPTIAN' ? '#D2691E' :
                          wallKey === 'MOORISH' ? '#0B4F6C' :
                          wallKey === 'ITALIAN' ? '#E8E8E8' :
                          '#4A5568';
        const highlightColor = wallKey === 'JAPANESE' ? '#8B5A2B' :
                               wallKey === 'CHINESE' ? '#FFD700' :
                               wallKey === 'PERSIAN' ? '#DAA520' :
                               wallKey === 'EGYPTIAN' ? '#FFD700' :
                               wallKey === 'MOORISH' ? '#FFD700' :
                               wallKey === 'ITALIAN' ? '#D4AF37' :
                               '#718096';
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    {/* Main decorative wall face */}
                    <rect width="24" height="20" fill={baseColor}/>
                    {/* Top highlight edge */}
                    <rect x="0" y="0" width="24" height="2" fill={highlightColor} opacity="0.8"/>
                    {/* Decorative molding/trim */}
                    <rect x="0" y="18" width="24" height="2" fill={highlightColor} opacity="0.6"/>
                    {/* Dark bottom cap (creates depth) */}
                    <rect x="0" y="20" width="24" height="4" fill="#1A1A2E"/>
                    {/* Subtle pattern lines */}
                    <line x1="0" y1="10" x2="24" y2="10" stroke={highlightColor} strokeWidth="0.5" opacity="0.3"/>
                </svg>
            </div>
        );
    }

    // South wall (front/bottom wall - dark cap seen from above)
    if (char === '▼') {
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    {/* Dark front face - you're looking down at the top of a wall */}
                    <rect width="24" height="24" fill="#1A1A2E"/>
                    {/* Subtle top edge highlight */}
                    <rect x="0" y="0" width="24" height="2" fill="#2D3748"/>
                    {/* Edge detail */}
                    <rect x="0" y="2" width="24" height="1" fill="#0D0D1A"/>
                </svg>
            </div>
        );
    }

    // East wall (right side wall - shows wall thickness)
    if (char === '►') {
        // Check for culturally-specific wall style
        let wallKey = biome as string;
        if (zoneName) {
            const culturalWall = getCulturalWallStyle(zoneName);
            if (culturalWall) {
                wallKey = culturalWall;
            }
        }
        const sideColor = wallKey === 'JAPANESE' ? '#6B4423' :
                          wallKey === 'CHINESE' ? '#5C0000' :
                          wallKey === 'PERSIAN' ? '#162C45' :
                          wallKey === 'EGYPTIAN' ? '#A0522D' :
                          wallKey === 'MOORISH' ? '#083B52' :
                          wallKey === 'ITALIAN' ? '#C0C0C0' :
                          '#2D3748';
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    {/* Wall thickness - darker shade of main wall */}
                    <rect width="24" height="24" fill={sideColor}/>
                    {/* Left highlight (where light hits) */}
                    <rect x="0" y="0" width="2" height="24" fill="#4A5568" opacity="0.3"/>
                    {/* Right shadow (depth) */}
                    <rect x="22" y="0" width="2" height="24" fill="#0D0D1A" opacity="0.5"/>
                    {/* Mortar lines for texture */}
                    <line x1="0" y1="8" x2="24" y2="8" stroke="#1A1A2E" strokeWidth="0.5" opacity="0.4"/>
                    <line x1="0" y1="16" x2="24" y2="16" stroke="#1A1A2E" strokeWidth="0.5" opacity="0.4"/>
                </svg>
            </div>
        );
    }

    // West wall (left side wall - shows wall thickness)
    if (char === '◄') {
        // Check for culturally-specific wall style
        let wallKey = biome as string;
        if (zoneName) {
            const culturalWall = getCulturalWallStyle(zoneName);
            if (culturalWall) {
                wallKey = culturalWall;
            }
        }
        const sideColor = wallKey === 'JAPANESE' ? '#6B4423' :
                          wallKey === 'CHINESE' ? '#5C0000' :
                          wallKey === 'PERSIAN' ? '#162C45' :
                          wallKey === 'EGYPTIAN' ? '#A0522D' :
                          wallKey === 'MOORISH' ? '#083B52' :
                          wallKey === 'ITALIAN' ? '#C0C0C0' :
                          '#2D3748';
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    {/* Wall thickness - darker shade of main wall */}
                    <rect width="24" height="24" fill={sideColor}/>
                    {/* Left shadow (depth) */}
                    <rect x="0" y="0" width="2" height="24" fill="#0D0D1A" opacity="0.5"/>
                    {/* Right highlight (where light hits) */}
                    <rect x="22" y="0" width="2" height="24" fill="#4A5568" opacity="0.3"/>
                    {/* Mortar lines for texture */}
                    <line x1="0" y1="8" x2="24" y2="8" stroke="#1A1A2E" strokeWidth="0.5" opacity="0.4"/>
                    <line x1="0" y1="16" x2="24" y2="16" stroke="#1A1A2E" strokeWidth="0.5" opacity="0.4"/>
                </svg>
            </div>
        );
    }

    // Northwest corner (┌)
    if (char === '┌') {
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    {/* Corner piece - combination of north and west wall */}
                    <rect width="24" height="24" fill="#2D3748"/>
                    {/* Top decorative edge (north wall) */}
                    <rect x="0" y="0" width="24" height="2" fill="#4A5568"/>
                    {/* Left edge highlight */}
                    <rect x="0" y="0" width="2" height="24" fill="#1A1A2E"/>
                    {/* Inner corner shadow */}
                    <rect x="2" y="2" width="4" height="4" fill="#1A1A2E" opacity="0.5"/>
                </svg>
            </div>
        );
    }

    // Northeast corner (┐)
    if (char === '┐') {
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    {/* Corner piece - combination of north and east wall */}
                    <rect width="24" height="24" fill="#2D3748"/>
                    {/* Top decorative edge (north wall) */}
                    <rect x="0" y="0" width="24" height="2" fill="#4A5568"/>
                    {/* Right edge shadow */}
                    <rect x="22" y="0" width="2" height="24" fill="#1A1A2E"/>
                    {/* Inner corner shadow */}
                    <rect x="18" y="2" width="4" height="4" fill="#1A1A2E" opacity="0.5"/>
                </svg>
            </div>
        );
    }

    // Southwest corner (└)
    if (char === '└') {
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    {/* Corner piece - combination of south and west wall */}
                    <rect width="24" height="24" fill="#1A1A2E"/>
                    {/* Left edge */}
                    <rect x="0" y="0" width="2" height="24" fill="#0D0D1A"/>
                    {/* Bottom dark edge */}
                    <rect x="0" y="22" width="24" height="2" fill="#0D0D1A"/>
                </svg>
            </div>
        );
    }

    // Southeast corner (┘)
    if (char === '┘') {
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    {/* Corner piece - combination of south and east wall */}
                    <rect width="24" height="24" fill="#1A1A2E"/>
                    {/* Right edge */}
                    <rect x="22" y="0" width="2" height="24" fill="#0D0D1A"/>
                    {/* Bottom dark edge */}
                    <rect x="0" y="22" width="24" height="2" fill="#0D0D1A"/>
                </svg>
            </div>
        );
    }

    // Shadow tile (floor with shadow overlay)
    if (char === '░') {
        const floorPattern = getFloorPattern(biome, zoneName);
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    {/* Base floor */}
                    <rect width="24" height="24" fill={floorPattern}/>
                    {/* Shadow gradient from north */}
                    <defs>
                        <linearGradient id={`shadow-grad-${x}-${y}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#000000" stopOpacity="0.4"/>
                            <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
                        </linearGradient>
                    </defs>
                    <rect width="24" height="24" fill={`url(#shadow-grad-${x}-${y})`}/>
                </svg>
            </div>
        );
    }

    // Other terrain tiles with custom graphics
    const terrainRenderer = TERRAIN_GRAPHICS[char];
    if (terrainRenderer) {
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible">
                    {terrainRenderer(biome, seed)}
                </svg>
            </div>
        );
    }

    return null;
};

// Memoize with custom comparison
export default React.memo(MapTile, (prev, next) =>
    prev.char === next.char &&
    prev.x === next.x &&
    prev.y === next.y &&
    prev.biome === next.biome &&
    prev.zoneName === next.zoneName
);
