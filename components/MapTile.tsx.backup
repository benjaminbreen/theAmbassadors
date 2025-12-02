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

    // Concert halls and theaters get Victorian runner carpet (burgundy/gold)
    if (nameLower.includes('concert') || nameLower.includes('theater') || nameLower.includes('theatre') ||
        nameLower.includes('trocadéro') || nameLower.includes('trocadero') || nameLower.includes('opera')) {
        return 'url(#pattern-victorian)';
    }
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
    if (nameLower.includes('france') || nameLower.includes('french') || nameLower.includes('grand')) {
        return 'url(#pattern-parquet)';
    }
    // Default ornate carpet for European pavilions
    return 'url(#pattern-victorian)';
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
    '«', '»', '≥', '≤', '╔', '╗', '╚', '╝', '≈', '⌂', '♦',  // Basin edges, corners, water, spout, statue
    // Industrial Machine Tiles (animated)
    'Ð', 'Þ', 'Ł', 'Ŧ', 'Ħ', 'Ø', 'ŧ', 'đ', 'ð',  // Dynamo, Press, Arc lamp, Loom, Hydraulic, Phonograph, Telegraph, Auto engine, Centrifuge
    // TWO-TILE TALL OBJECTS (top parts)
    '¶', '§', '†', '‡', '∫', '∂',  // Tree top, Lamp top, Minaret top, Pillar top, Palm top, Statue top
    // TWO-TILE TALL OBJECTS (bottom parts)
    '¤', '¥', '£', '©', '®', '™',   // Tree base, Lamp base, Minaret base, Pillar base, Palm base, Statue base
    // STATUE VARIANTS - Cultural and size variations
    'Ü', 'ü', 'Ö', 'ö', 'Ä', 'ä', 'ß', 'æ', 'œ', 'Œ', 'Æ', 'µ',
    // MULTI-TILE STRUCTURES (2x2, 3x2, etc.)
    // Guard Post 2x2: ┬┬ (top row), QQ (bottom row - Q is main tile)
    '┬',  // Guard post top-left/top-right
    // Ticket Booth 3x2: ┼┼┼ (top row), NNN (bottom row)
    '┼',  // Ticket booth top tiles
    // Kiosk 2x2: ┴┴ (top row), KK (bottom row)
    '┴',  // Kiosk top tiles
    // Flagpole 3 tiles tall: ╦ (top), ╫ (middle), y (bottom)
    '╦', '╫',  // Flagpole top and middle
    // Wide bench (2 tiles): ≡ renders full 2-tile bench
    '≡',
    // Aquarium tank (Ŋ) - 2 tiles wide, animated fish
    'Ŋ'
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
    // Tree - TALL: extends above tile bounds
    'T': (
        <g>
            {/* Shadow */}
            <ellipse cx="14" cy="22" rx="8" ry="2.5" fill="#000" opacity="0.25"/>
            {/* Trunk */}
            <rect x="9" y="10" width="6" height="14" fill="#5D4037"/>
            <rect x="10" y="10" width="4" height="14" fill="#6D4C41"/>
            {/* Root flare */}
            <path d="M9 22 Q5 24 3 24 M15 22 Q19 24 21 24" stroke="#5D4037" strokeWidth="2" fill="none"/>
            {/* Main canopy - extends ABOVE tile (negative y values) */}
            <ellipse cx="12" cy="4" rx="11" ry="10" fill="#2E7D32"/>
            <ellipse cx="8" cy="0" rx="7" ry="7" fill="#388E3C"/>
            <ellipse cx="16" cy="0" rx="7" ry="7" fill="#388E3C"/>
            <ellipse cx="12" cy="-4" rx="9" ry="7" fill="#43A047"/>
            <ellipse cx="6" cy="-2" rx="4" ry="4" fill="#4CAF50"/>
            <ellipse cx="18" cy="-2" rx="4" ry="4" fill="#4CAF50"/>
            <ellipse cx="12" cy="-8" rx="6" ry="5" fill="#66BB6A"/>
            {/* Light spots */}
            <circle cx="8" cy="-6" r="2" fill="#81C784" opacity="0.7"/>
            <circle cx="15" cy="-4" r="1.5" fill="#A5D6A7" opacity="0.5"/>
        </g>
    ),
    // Lamp - TALL: extends above tile bounds
    'L': (
        <g>
            {/* Shadow */}
            <ellipse cx="13" cy="22" rx="5" ry="1.5" fill="#000" opacity="0.2"/>
            {/* Base pedestal */}
            <rect x="6" y="20" width="12" height="4" fill="#1A202C"/>
            <rect x="8" y="18" width="8" height="3" fill="#263238"/>
            {/* Lamp post - extends up through tile */}
            <rect x="10" y="-8" width="4" height="28" fill="#37474F"/>
            <rect x="11" y="-8" width="2" height="28" fill="#455A64"/>
            {/* Decorative rings */}
            <rect x="9" y="4" width="6" height="2" fill="#546E7A"/>
            <rect x="9" y="12" width="6" height="2" fill="#546E7A"/>
            {/* Lamp housing - above tile */}
            <rect x="6" y="-12" width="12" height="8" fill="#263238"/>
            <rect x="7" y="-11" width="10" height="6" fill="#FFEB3B" opacity="0.9"/>
            {/* Glass panes */}
            <line x1="12" y1="-11" x2="12" y2="-5" stroke="#263238" strokeWidth="0.5"/>
            <line x1="7" y1="-8" x2="17" y2="-8" stroke="#263238" strokeWidth="0.5"/>
            {/* Top finial */}
            <path d="M10 -12 L12 -18 L14 -12 Z" fill="#37474F"/>
            <circle cx="12" cy="-19" r="1.5" fill="#455A64"/>
            {/* Decorative brackets */}
            <path d="M6 -10 Q2 -6 4 -2" stroke="#37474F" strokeWidth="1" fill="none"/>
            <path d="M18 -10 Q22 -6 20 -2" stroke="#37474F" strokeWidth="1" fill="none"/>
            {/* Lamp glow - large radius */}
            <circle cx="12" cy="-8" r="12" fill="url(#lampGlow)" opacity="0.5"/>
            {/* Flame flicker */}
            <ellipse cx="12" cy="-8" rx="2" ry="3" fill="#FFF59D" opacity="0.8">
                <animate attributeName="ry" values="3;3.5;3" dur="0.3s" repeatCount="indefinite"/>
            </ellipse>
        </g>
    ),
    // Bench - Standard single tile
    'b': (
        <g>
            <ellipse cx="12" cy="20" rx="8" ry="2" fill="#000" opacity="0.15"/>
            <path d="M4 12 L6 20 M20 12 L18 20" stroke="#37474F" strokeWidth="2" fill="none"/>
            <rect x="2" y="10" width="20" height="3" fill="#5D4037" rx="1"/>
            <rect x="3" y="4" width="18" height="6" fill="#6D4C41" rx="1"/>
        </g>
    ),
    // Wide Bench (≡) - 2 TILES WIDE: Ornate Parisian park bench
    // Extends right into adjacent tile (+24px)
    '≡': (
        <g>
            {/* Shadow - spans 2 tiles */}
            <ellipse cx="24" cy="21" rx="20" ry="3" fill="#000" opacity="0.15"/>

            {/* Ornate cast iron legs - 3 supports for 2-tile bench */}
            {/* Left leg */}
            <path d="M4 12 C2 16 4 20 6 22" stroke="#37474F" strokeWidth="2.5" fill="none"/>
            <path d="M4 14 C0 16 2 20 4 22" stroke="#4A5568" strokeWidth="1.5" fill="none"/>
            <ellipse cx="5" cy="22" rx="3" ry="1" fill="#37474F"/>

            {/* Center leg */}
            <path d="M24 12 C22 16 24 20 24 22" stroke="#37474F" strokeWidth="2.5" fill="none"/>
            <path d="M24 14 C28 16 26 20 24 22" stroke="#4A5568" strokeWidth="1.5" fill="none"/>
            <ellipse cx="24" cy="22" rx="3" ry="1" fill="#37474F"/>

            {/* Right leg */}
            <path d="M44 12 C46 16 44 20 42 22" stroke="#37474F" strokeWidth="2.5" fill="none"/>
            <path d="M44 14 C48 16 46 20 44 22" stroke="#4A5568" strokeWidth="1.5" fill="none"/>
            <ellipse cx="43" cy="22" rx="3" ry="1" fill="#37474F"/>

            {/* Seat - wooden slats across 2 tiles */}
            <rect x="0" y="10" width="48" height="4" fill="#5D4037" rx="1"/>
            {/* Wood grain slats */}
            <rect x="1" y="10.5" width="46" height="0.8" fill="#6D4C41"/>
            <rect x="1" y="12" width="46" height="0.8" fill="#6D4C41"/>

            {/* Backrest - curved wooden slats */}
            <rect x="0" y="4" width="48" height="7" fill="#6D4C41" rx="2"/>
            {/* Decorative slats */}
            <rect x="2" y="5" width="44" height="1.5" fill="#8D6E63"/>
            <rect x="2" y="7.5" width="44" height="1.5" fill="#8D6E63"/>

            {/* Armrests */}
            <rect x="-1" y="6" width="4" height="6" fill="#37474F" rx="1"/>
            <rect x="45" y="6" width="4" height="6" fill="#37474F" rx="1"/>

            {/* Decorative ironwork scrolls on ends */}
            <circle cx="0" cy="8" r="2" fill="none" stroke="#4A5568" strokeWidth="0.8"/>
            <circle cx="48" cy="8" r="2" fill="none" stroke="#4A5568" strokeWidth="0.8"/>
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
    // Kiosk (K) - 2x2 STRUCTURE: Ornate newsstand/refreshment kiosk
    // Extends right (+24px) and up (-24px)
    'K': (
        <g>
            {/* Shadow - spans 2x2 */}
            <ellipse cx="24" cy="23" rx="20" ry="4" fill="#000" opacity="0.15"/>

            {/* === MAIN STRUCTURE - 2 tiles wide === */}
            {/* Base platform */}
            <rect x="0" y="18" width="48" height="6" fill="#14532D" rx="1"/>

            {/* Main kiosk body */}
            <rect x="2" y="2" width="44" height="18" fill="#166534"/>
            <rect x="2" y="2" width="44" height="2" fill="#14532D"/>

            {/* === EXTENDS ABOVE (into top tile row) === */}
            {/* Upper structure */}
            <rect x="2" y="-12" width="44" height="16" fill="#166534"/>

            {/* Decorative roof - pagoda style with overhang */}
            <path d="M-2 -14 L24 -22 L50 -14" fill="#14532D" stroke="#0F4020" strokeWidth="1"/>
            <path d="M0 -14 L24 -20 L48 -14" fill="#1B5E20"/>

            {/* Roof finial */}
            <circle cx="24" cy="-22" r="3" fill="#FFD700"/>
            <circle cx="24" cy="-22" r="1.5" fill="#FEF3C7"/>

            {/* Decorative cornice */}
            <rect x="0" y="-14" width="48" height="2" fill="#0F4020"/>

            {/* Display windows - left side */}
            <rect x="4" y="-10" width="10" height="8" fill="#FFFDE7"/>
            <rect x="4" y="-10" width="10" height="8" fill="none" stroke="#0F4020" strokeWidth="0.5"/>
            <line x1="9" y1="-10" x2="9" y2="-2" stroke="#0F4020" strokeWidth="0.3"/>

            {/* Display windows - center */}
            <rect x="18" y="-10" width="12" height="8" fill="#FEF9C3"/>
            <rect x="18" y="-10" width="12" height="8" fill="none" stroke="#0F4020" strokeWidth="0.5"/>
            <line x1="24" y1="-10" x2="24" y2="-2" stroke="#0F4020" strokeWidth="0.3"/>

            {/* Display windows - right side */}
            <rect x="34" y="-10" width="10" height="8" fill="#FFFDE7"/>
            <rect x="34" y="-10" width="10" height="8" fill="none" stroke="#0F4020" strokeWidth="0.5"/>
            <line x1="39" y1="-10" x2="39" y2="-2" stroke="#0F4020" strokeWidth="0.3"/>

            {/* Lower display/counter area */}
            <rect x="4" y="4" width="18" height="10" fill="#FFFDE7"/>
            <rect x="4" y="4" width="18" height="10" fill="none" stroke="#0F4020" strokeWidth="0.5"/>

            {/* Service counter - right side */}
            <rect x="26" y="4" width="18" height="10" fill="#8B4513"/>
            <rect x="26" y="4" width="18" height="2" fill="#A0522D"/>

            {/* Goods on display */}
            <rect x="6" y="6" width="3" height="4" fill="#E57373"/>
            <rect x="10" y="7" width="3" height="3" fill="#64B5F6"/>
            <rect x="14" y="6" width="4" height="4" fill="#FFB74D"/>

            {/* Decorative columns at corners */}
            <rect x="0" y="-12" width="3" height="30" fill="#0F4020"/>
            <rect x="45" y="-12" width="3" height="30" fill="#0F4020"/>

            {/* "KIOSQUE" sign */}
            <rect x="12" y="-1" width="24" height="4" fill="#8B0000"/>
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
    // Statue (u) - TALL: Classical Western statue extending above tile
    // This is the default Western/European style - see biome-specific variants below
    'u': (
        <g>
            {/* Shadow */}
            <ellipse cx="13" cy="22" rx="7" ry="2" fill="#000" opacity="0.2"/>
            {/* Large stone pedestal */}
            <rect x="2" y="18" width="20" height="6" fill="#78716C"/>
            <rect x="4" y="14" width="16" height="5" fill="#A8A29E"/>
            <rect x="3" y="13" width="18" height="2" fill="#B8B5B1"/>
            {/* Inscription plate */}
            <rect x="6" y="20" width="12" height="3" fill="#8B8178"/>
            {/* Classical figure - torso extends above tile */}
            <ellipse cx="12" cy="6" rx="5" ry="8" fill="#E7E5E4"/>
            <ellipse cx="12" cy="4" rx="4.5" ry="7" fill="#D6D3D1"/>
            {/* Head - above tile */}
            <circle cx="12" cy="-6" r="4" fill="#E7E5E4"/>
            <circle cx="12" cy="-7" r="3.5" fill="#D6D3D1"/>
            {/* Neck */}
            <rect x="10" y="-2" width="4" height="4" fill="#E7E5E4"/>
            {/* Arms - outstretched */}
            <path d="M7 4 Q2 0 4 -6" stroke="#E7E5E4" strokeWidth="3" fill="none"/>
            <path d="M17 4 Q22 0 20 -6" stroke="#E7E5E4" strokeWidth="3" fill="none"/>
            {/* Hands */}
            <circle cx="4" cy="-6" r="1.5" fill="#D6D3D1"/>
            <circle cx="20" cy="-6" r="1.5" fill="#D6D3D1"/>
            {/* Draping/robe */}
            <path d="M7 10 Q12 8 17 10 L16 14 Q12 12 8 14 Z" fill="#C4C1BD"/>
            {/* Facial features (subtle) */}
            <ellipse cx="11" cy="-8" rx="0.5" ry="0.3" fill="#A8A29E"/>
            <ellipse cx="13" cy="-8" rx="0.5" ry="0.3" fill="#A8A29E"/>
            {/* Hair/crown */}
            <path d="M8 -10 Q12 -14 16 -10" fill="#C4C1BD"/>
        </g>
    ),

    // ============================================
    // STATUE CULTURAL VARIANTS
    // ============================================

    // ASIAN STATUE (Ü) - Buddha/deity, TALL (extends 1.5 tiles up)
    'Ü': (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="22" rx="8" ry="2" fill="#000" opacity="0.2"/>
            {/* Lotus throne base */}
            <ellipse cx="12" cy="20" rx="10" ry="4" fill="#B8860B"/>
            <ellipse cx="12" cy="18" rx="9" ry="3" fill="#DAA520"/>
            {/* Lotus petals */}
            <path d="M2 18 Q6 14 12 18 Q18 14 22 18" fill="#FFD700" stroke="#B8860B" strokeWidth="0.5"/>
            {/* Seated figure body */}
            <ellipse cx="12" cy="10" rx="8" ry="8" fill="#B8860B"/>
            <ellipse cx="12" cy="8" rx="7" ry="7" fill="#DAA520"/>
            {/* Robes */}
            <path d="M5 14 Q12 10 19 14" fill="#CD7F32"/>
            {/* Hands in meditation mudra */}
            <ellipse cx="12" cy="12" rx="4" ry="2" fill="#DAA520"/>
            {/* Head - above tile */}
            <circle cx="12" cy="-4" r="5" fill="#DAA520"/>
            {/* Serene face */}
            <path d="M10 -5 Q12 -4 14 -5" stroke="#8B7355" strokeWidth="0.5" fill="none"/>
            <ellipse cx="10" cy="-6" rx="0.8" ry="0.3" fill="#8B7355"/>
            <ellipse cx="14" cy="-6" rx="0.8" ry="0.3" fill="#8B7355"/>
            {/* Ushnisha (crown protrusion) */}
            <ellipse cx="12" cy="-10" rx="2" ry="3" fill="#DAA520"/>
            {/* Halo/aureole */}
            <circle cx="12" cy="-4" r="8" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.5"/>
            {/* Elongated earlobes */}
            <ellipse cx="7" cy="-2" rx="1" ry="2" fill="#DAA520"/>
            <ellipse cx="17" cy="-2" rx="1" ry="2" fill="#DAA520"/>
        </g>
    ),

    // ASIAN SMALL FIGURE (ü) - Small Buddha/Kannon, 1 tile
    'ü': (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="22" rx="5" ry="1.5" fill="#000" opacity="0.15"/>
            {/* Small pedestal */}
            <rect x="6" y="18" width="12" height="6" fill="#8B7355"/>
            <ellipse cx="12" cy="18" rx="6" ry="2" fill="#A08464"/>
            {/* Small seated figure */}
            <ellipse cx="12" cy="12" rx="5" ry="6" fill="#DAA520"/>
            {/* Head */}
            <circle cx="12" cy="6" r="3" fill="#DAA520"/>
            {/* Simple face */}
            <path d="M11 7 Q12 7.5 13 7" stroke="#8B7355" strokeWidth="0.3" fill="none"/>
            {/* Ushnisha */}
            <ellipse cx="12" cy="3" rx="1" ry="1.5" fill="#B8860B"/>
            {/* Hands */}
            <ellipse cx="12" cy="14" rx="2" ry="1" fill="#B8860B"/>
        </g>
    ),

    // EGYPTIAN STATUE (Ö) - Pharaoh/deity, TALL
    'Ö': (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="22" rx="6" ry="2" fill="#000" opacity="0.2"/>
            {/* Rectangular base */}
            <rect x="4" y="18" width="16" height="6" fill="#C4A574"/>
            <rect x="5" y="17" width="14" height="2" fill="#D4B584"/>
            {/* Hieroglyphic decoration on base */}
            <rect x="6" y="19" width="3" height="3" fill="#8B7355"/>
            <rect x="10" y="19" width="4" height="3" fill="#8B7355"/>
            <rect x="15" y="19" width="3" height="3" fill="#8B7355"/>
            {/* Rigid standing figure */}
            <rect x="8" y="4" width="8" height="14" fill="#D4B584"/>
            {/* Arms at sides (Egyptian pose) */}
            <rect x="5" y="6" width="3" height="10" fill="#D4B584"/>
            <rect x="16" y="6" width="3" height="10" fill="#D4B584"/>
            {/* Nemes headdress - extends above tile */}
            <path d="M6 -2 L12 -12 L18 -2 Z" fill="#1E3A8A"/>
            <path d="M7 -1 L12 -10 L17 -1 Z" fill="#3B82F6"/>
            {/* Gold stripes on nemes */}
            <line x1="9" y1="-6" x2="9" y2="-1" stroke="#FFD700" strokeWidth="0.5"/>
            <line x1="12" y1="-10" x2="12" y2="-1" stroke="#FFD700" strokeWidth="0.5"/>
            <line x1="15" y1="-6" x2="15" y2="-1" stroke="#FFD700" strokeWidth="0.5"/>
            {/* Face */}
            <rect x="9" y="-2" width="6" height="6" fill="#D4B584"/>
            {/* Eyes (kohl-lined) */}
            <ellipse cx="10" cy="0" rx="1" ry="0.5" fill="#1A202C"/>
            <ellipse cx="14" cy="0" rx="1" ry="0.5" fill="#1A202C"/>
            {/* Uraeus (cobra) on forehead */}
            <path d="M12 -4 Q11 -6 12 -8 Q13 -6 12 -4" fill="#FFD700"/>
            {/* Crook and flail crossed on chest */}
            <path d="M10 8 L8 2" stroke="#FFD700" strokeWidth="1"/>
            <path d="M14 8 L16 2" stroke="#FFD700" strokeWidth="1"/>
        </g>
    ),

    // EGYPTIAN BUST (ö) - Pharaoh bust/canopic jar, 1 tile
    'ö': (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="22" rx="5" ry="1.5" fill="#000" opacity="0.15"/>
            {/* Display stand */}
            <rect x="6" y="18" width="12" height="6" fill="#4A3728"/>
            <rect x="5" y="17" width="14" height="2" fill="#5D4037"/>
            {/* Bust/head on stand */}
            <ellipse cx="12" cy="14" rx="5" ry="3" fill="#D4B584"/>
            {/* Nemes headdress */}
            <path d="M6 10 L12 4 L18 10 Z" fill="#1E3A8A"/>
            <line x1="9" y1="8" x2="9" y2="10" stroke="#FFD700" strokeWidth="0.3"/>
            <line x1="12" y1="4" x2="12" y2="10" stroke="#FFD700" strokeWidth="0.3"/>
            <line x1="15" y1="8" x2="15" y2="10" stroke="#FFD700" strokeWidth="0.3"/>
            {/* Face */}
            <rect x="9" y="8" width="6" height="6" fill="#D4B584"/>
            {/* Eyes */}
            <ellipse cx="10" cy="10" rx="0.8" ry="0.4" fill="#1A202C"/>
            <ellipse cx="14" cy="10" rx="0.8" ry="0.4" fill="#1A202C"/>
            {/* Uraeus */}
            <circle cx="12" cy="6" r="1" fill="#FFD700"/>
        </g>
    ),

    // AFRICAN CARVED FIGURE (Ä) - Ancestor/deity, TALL
    'Ä': (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="22" rx="5" ry="2" fill="#000" opacity="0.2"/>
            {/* Wooden base */}
            <ellipse cx="12" cy="20" rx="6" ry="3" fill="#3D2817"/>
            {/* Elongated carved body */}
            <rect x="9" y="6" width="6" height="14" fill="#5D3A1A"/>
            <rect x="10" y="6" width="4" height="14" fill="#6B4423"/>
            {/* Carved patterns on torso */}
            <line x1="10" y1="10" x2="14" y2="10" stroke="#3D2817" strokeWidth="0.5"/>
            <line x1="10" y1="14" x2="14" y2="14" stroke="#3D2817" strokeWidth="0.5"/>
            {/* Arms - stylized */}
            <rect x="6" y="8" width="3" height="6" fill="#5D3A1A"/>
            <rect x="15" y="8" width="3" height="6" fill="#5D3A1A"/>
            {/* Distinctive carved head - above tile */}
            <ellipse cx="12" cy="-2" rx="4" ry="6" fill="#5D3A1A"/>
            <ellipse cx="12" cy="-3" rx="3.5" ry="5" fill="#6B4423"/>
            {/* Large eyes */}
            <ellipse cx="10" cy="-4" rx="1.5" ry="2" fill="#F5DEB3"/>
            <ellipse cx="14" cy="-4" rx="1.5" ry="2" fill="#F5DEB3"/>
            <circle cx="10" cy="-4" r="0.8" fill="#1A202C"/>
            <circle cx="14" cy="-4" r="0.8" fill="#1A202C"/>
            {/* Elaborate headdress/crown */}
            <path d="M8 -8 L12 -16 L16 -8" fill="#5D3A1A"/>
            <circle cx="12" cy="-12" r="2" fill="#CD7F32"/>
            {/* Scarification marks */}
            <line x1="9" y1="0" x2="9" y2="2" stroke="#3D2817" strokeWidth="0.5"/>
            <line x1="15" y1="0" x2="15" y2="2" stroke="#3D2817" strokeWidth="0.5"/>
        </g>
    ),

    // AFRICAN MASK/SMALL CARVING (ä) - 1 tile
    'ä': (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="22" rx="4" ry="1" fill="#000" opacity="0.15"/>
            {/* Display stand */}
            <rect x="8" y="16" width="8" height="8" fill="#3D2817"/>
            <rect x="10" y="14" width="4" height="3" fill="#4A3728"/>
            {/* Mask face */}
            <ellipse cx="12" cy="8" rx="5" ry="7" fill="#5D3A1A"/>
            <ellipse cx="12" cy="7" rx="4" ry="6" fill="#6B4423"/>
            {/* Eyes - cowrie shell style */}
            <ellipse cx="9" cy="6" rx="2" ry="1.5" fill="#F5DEB3"/>
            <ellipse cx="15" cy="6" rx="2" ry="1.5" fill="#F5DEB3"/>
            <ellipse cx="9" cy="6" rx="1" ry="0.8" fill="#1A202C"/>
            <ellipse cx="15" cy="6" rx="1" ry="0.8" fill="#1A202C"/>
            {/* Nose */}
            <path d="M12 4 L12 10 M10 10 L14 10" stroke="#3D2817" strokeWidth="1" fill="none"/>
            {/* Mouth */}
            <ellipse cx="12" cy="12" rx="2" ry="1" fill="#8B0000"/>
            {/* Scarification/decorative lines */}
            <line x1="6" y1="6" x2="7" y2="8" stroke="#3D2817" strokeWidth="0.5"/>
            <line x1="18" y1="6" x2="17" y2="8" stroke="#3D2817" strokeWidth="0.5"/>
        </g>
    ),

    // MESOAMERICAN STATUE (ß) - Aztec/Maya, TALL
    'ß': (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="22" rx="7" ry="2" fill="#000" opacity="0.2"/>
            {/* Stepped pyramid base */}
            <rect x="2" y="18" width="20" height="6" fill="#6B7280"/>
            <rect x="4" y="16" width="16" height="3" fill="#78716C"/>
            <rect x="6" y="14" width="12" height="3" fill="#9CA3AF"/>
            {/* Carved figure */}
            <rect x="8" y="4" width="8" height="10" fill="#6B7280"/>
            {/* Elaborate headdress - extends above tile */}
            <path d="M4 4 L12 -12 L20 4 Z" fill="#16A34A"/>
            <path d="M6 2 L12 -8 L18 2 Z" fill="#22C55E"/>
            {/* Feathers */}
            <path d="M8 0 Q6 -4 4 -8" stroke="#16A34A" strokeWidth="2" fill="none"/>
            <path d="M16 0 Q18 -4 20 -8" stroke="#16A34A" strokeWidth="2" fill="none"/>
            <path d="M10 -2 Q8 -8 6 -14" stroke="#22C55E" strokeWidth="1.5" fill="none"/>
            <path d="M14 -2 Q16 -8 18 -14" stroke="#22C55E" strokeWidth="1.5" fill="none"/>
            {/* Face with jade mask */}
            <rect x="9" y="0" width="6" height="5" fill="#4ADE80"/>
            {/* Jade inlay eyes */}
            <circle cx="10.5" cy="2" r="1" fill="#166534"/>
            <circle cx="13.5" cy="2" r="1" fill="#166534"/>
            {/* Jaguar mouth */}
            <rect x="10" y="4" width="4" height="2" fill="#DC2626"/>
            {/* Gold/obsidian ornaments */}
            <circle cx="6" cy="6" r="1.5" fill="#FFD700"/>
            <circle cx="18" cy="6" r="1.5" fill="#FFD700"/>
            {/* Serpent motifs */}
            <path d="M8 10 Q6 12 8 14 M16 10 Q18 12 16 14" stroke="#059669" strokeWidth="1" fill="none"/>
        </g>
    ),

    // CLASSICAL BUST (æ) - Greek/Roman style, 1 tile
    'æ': (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="22" rx="5" ry="1.5" fill="#000" opacity="0.15"/>
            {/* Pedestal */}
            <rect x="6" y="16" width="12" height="8" fill="#78716C"/>
            <rect x="5" y="14" width="14" height="3" fill="#A8A29E"/>
            <rect x="4" y="13" width="16" height="2" fill="#D6D3D1"/>
            {/* Bust (head and shoulders) */}
            <path d="M6 13 Q6 8 12 6 Q18 8 18 13 Z" fill="#E7E5E4"/>
            {/* Head */}
            <circle cx="12" cy="4" r="4" fill="#E7E5E4"/>
            <circle cx="12" cy="3.5" r="3.5" fill="#D6D3D1"/>
            {/* Classical features */}
            <ellipse cx="10.5" cy="3" rx="0.5" ry="0.3" fill="#A8A29E"/>
            <ellipse cx="13.5" cy="3" rx="0.5" ry="0.3" fill="#A8A29E"/>
            <path d="M12 2 L12 5" stroke="#A8A29E" strokeWidth="0.5"/>
            <path d="M10 6 Q12 7 14 6" stroke="#A8A29E" strokeWidth="0.5" fill="none"/>
            {/* Curled hair */}
            <path d="M8 2 Q7 0 8 -1 Q10 0 12 -1 Q14 0 16 -1 Q17 0 16 2" fill="#C4C1BD"/>
        </g>
    ),

    // BRONZE ALLEGORICAL FIGURE (œ) - Republic/Liberty/Industry, 2 tiles tall
    'œ': (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="22" rx="8" ry="2.5" fill="#000" opacity="0.2"/>
            {/* Large ornate pedestal */}
            <rect x="2" y="16" width="20" height="8" fill="#4A5568"/>
            <rect x="0" y="14" width="24" height="3" fill="#64748B"/>
            {/* Bronze figure - patinated green-brown */}
            <ellipse cx="12" cy="6" rx="6" ry="10" fill="#6B5344"/>
            <ellipse cx="12" cy="4" rx="5" ry="8" fill="#7A6A4A"/>
            {/* Head above tile */}
            <circle cx="12" cy="-8" r="4" fill="#6B5344"/>
            <circle cx="12" cy="-9" r="3.5" fill="#7A6A4A"/>
            {/* Crown/laurel wreath */}
            <ellipse cx="12" cy="-12" rx="4" ry="2" fill="#166534"/>
            <path d="M8 -12 Q10 -14 12 -12 Q14 -14 16 -12" fill="#22C55E"/>
            {/* Raised arm with torch/symbol */}
            <path d="M17 2 Q22 -4 20 -12" stroke="#6B5344" strokeWidth="3" fill="none"/>
            <ellipse cx="20" cy="-14" rx="2" ry="3" fill="#F59E0B"/>
            {/* Other arm holding tablet/sword */}
            <path d="M7 4 Q2 2 4 8" stroke="#6B5344" strokeWidth="3" fill="none"/>
            <rect x="2" y="6" width="4" height="6" fill="#4A5568"/>
            {/* Flowing robes */}
            <path d="M6 10 Q12 8 18 10 L16 16 Q12 14 8 16 Z" fill="#5D4A3A"/>
            {/* Patina highlights */}
            <ellipse cx="10" cy="2" rx="2" ry="3" fill="#7D8B6A" opacity="0.3"/>
        </g>
    ),

    // MONUMENTAL STATUE (Œ) - Very tall, 3 tiles
    'Œ': (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="22" rx="10" ry="3" fill="#000" opacity="0.25"/>
            {/* Massive pedestal */}
            <rect x="0" y="14" width="24" height="10" fill="#4A5568"/>
            <rect x="2" y="12" width="20" height="3" fill="#64748B"/>
            <rect x="4" y="10" width="16" height="3" fill="#78716C"/>
            {/* Lower body/robes */}
            <ellipse cx="12" cy="4" rx="7" ry="8" fill="#6B5344"/>
            <path d="M5 8 Q12 4 19 8 L18 14 Q12 12 6 14 Z" fill="#5D4A3A"/>
            {/* Torso - extends above tile */}
            <ellipse cx="12" cy="-8" rx="6" ry="10" fill="#7A6A4A"/>
            {/* Arms */}
            <path d="M6 -6 Q0 -12 2 -20" stroke="#6B5344" strokeWidth="4" fill="none"/>
            <path d="M18 -6 Q24 -12 22 -20" stroke="#6B5344" strokeWidth="4" fill="none"/>
            {/* Hands */}
            <circle cx="2" cy="-20" r="2" fill="#7A6A4A"/>
            <circle cx="22" cy="-20" r="2" fill="#7A6A4A"/>
            {/* Head - well above tile */}
            <circle cx="12" cy="-24" r="5" fill="#6B5344"/>
            <circle cx="12" cy="-25" r="4.5" fill="#7A6A4A"/>
            {/* Crown/helmet */}
            <path d="M7 -28 L12 -36 L17 -28" fill="#4A5568"/>
            <circle cx="12" cy="-32" r="2" fill="#FFD700"/>
            {/* Facial features */}
            <ellipse cx="10" cy="-26" rx="0.8" ry="0.4" fill="#5D4A3A"/>
            <ellipse cx="14" cy="-26" rx="0.8" ry="0.4" fill="#5D4A3A"/>
            <path d="M10 -23 Q12 -22 14 -23" stroke="#5D4A3A" strokeWidth="0.5" fill="none"/>
        </g>
    ),

    // EQUESTRIAN STATUE (Æ) - Horse and rider, 2 tiles tall
    'Æ': (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="22" rx="10" ry="3" fill="#000" opacity="0.2"/>
            {/* Large pedestal */}
            <rect x="0" y="16" width="24" height="8" fill="#4A5568"/>
            <rect x="2" y="14" width="20" height="3" fill="#64748B"/>
            {/* Horse body */}
            <ellipse cx="12" cy="8" rx="9" ry="6" fill="#6B5344"/>
            {/* Horse legs */}
            <rect x="4" y="10" width="2" height="6" fill="#5D4A3A"/>
            <rect x="8" y="12" width="2" height="4" fill="#5D4A3A"/>
            <rect x="14" y="12" width="2" height="4" fill="#5D4A3A"/>
            <rect x="18" y="10" width="2" height="6" fill="#5D4A3A"/>
            {/* Horse neck - extends above tile */}
            <path d="M18 4 Q20 -4 18 -10" stroke="#6B5344" strokeWidth="6" fill="none"/>
            {/* Horse head */}
            <ellipse cx="17" cy="-12" rx="3" ry="4" fill="#6B5344"/>
            <ellipse cx="15" cy="-14" rx="2" ry="2" fill="#7A6A4A"/>
            {/* Horse eye */}
            <circle cx="16" cy="-13" r="0.8" fill="#1A202C"/>
            {/* Mane */}
            <path d="M18 -8 Q20 -6 18 -4 Q16 -6 18 -8" fill="#5D4A3A"/>
            {/* Rider torso */}
            <ellipse cx="12" cy="-2" rx="4" ry="6" fill="#4A5568"/>
            {/* Rider head */}
            <circle cx="12" cy="-10" r="3" fill="#7A6A4A"/>
            {/* Rider helmet/hat */}
            <path d="M9 -12 L12 -16 L15 -12" fill="#4A5568"/>
            {/* Rider arm with sword raised */}
            <path d="M14 -4 Q18 -8 16 -14" stroke="#7A6A4A" strokeWidth="2" fill="none"/>
            <rect x="15" y="-20" width="1" height="8" fill="#94A3B8"/>
        </g>
    ),

    // SMALL DECORATIVE FIGURINE (µ) - Tabletop size, 1 tile
    'µ': (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="22" rx="4" ry="1" fill="#000" opacity="0.1"/>
            {/* Small display plinth */}
            <rect x="8" y="18" width="8" height="6" fill="#4A3728"/>
            <rect x="7" y="16" width="10" height="3" fill="#5D4037"/>
            {/* Tiny figure - porcelain/ivory style */}
            <ellipse cx="12" cy="12" rx="3" ry="5" fill="#F5F5DC"/>
            {/* Head */}
            <circle cx="12" cy="6" r="2.5" fill="#F5F5DC"/>
            {/* Simple features */}
            <circle cx="11" cy="5.5" r="0.4" fill="#1A202C"/>
            <circle cx="13" cy="5.5" r="0.4" fill="#1A202C"/>
            <path d="M11 7 Q12 7.5 13 7" stroke="#D4A574" strokeWidth="0.3" fill="none"/>
            {/* Delicate pose - arm */}
            <path d="M14 10 Q16 8 15 6" stroke="#F5F5DC" strokeWidth="1.5" fill="none"/>
            {/* Base of figurine */}
            <ellipse cx="12" cy="16" rx="3" ry="1" fill="#E7E5E4"/>
        </g>
    ),

    // Column - TALL: extends above tile bounds
    'c': (
        <g>
            {/* Shadow */}
            <ellipse cx="13" cy="22" rx="8" ry="2" fill="#000" opacity="0.15"/>
            {/* Base (Attic style) */}
            <rect x="0" y="20" width="24" height="4" fill="#C4C1BD"/>
            <rect x="2" y="18" width="20" height="2" fill="#D6D3D1"/>
            <rect x="4" y="16" width="16" height="2" fill="#E7E5E4"/>
            <ellipse cx="12" cy="17" rx="8" ry="1" fill="#E7E5E4"/>
            {/* Column shaft - extends through tile and above */}
            <rect x="6" y="-16" width="12" height="34" fill="#D6D3D1"/>
            {/* Fluting (vertical grooves) */}
            <line x1="8" y1="-16" x2="8" y2="18" stroke="#A8A29E" strokeWidth="0.5"/>
            <line x1="10" y1="-16" x2="10" y2="18" stroke="#B8B5B1" strokeWidth="0.3"/>
            <line x1="12" y1="-16" x2="12" y2="18" stroke="#A8A29E" strokeWidth="0.5"/>
            <line x1="14" y1="-16" x2="14" y2="18" stroke="#B8B5B1" strokeWidth="0.3"/>
            <line x1="16" y1="-16" x2="16" y2="18" stroke="#A8A29E" strokeWidth="0.5"/>
            {/* Capital (Corinthian style) - above tile */}
            <rect x="4" y="-18" width="16" height="4" fill="#D6D3D1"/>
            <rect x="2" y="-22" width="20" height="4" fill="#E7E5E4"/>
            <rect x="0" y="-26" width="24" height="4" fill="#F5F5F4"/>
            {/* Acanthus leaves */}
            <path d="M4 -18 Q8 -24 12 -18 Q16 -24 20 -18" fill="#D6D3D1" stroke="#A8A29E" strokeWidth="0.5"/>
            {/* Volutes */}
            <ellipse cx="4" cy="-23" rx="2" ry="1.5" fill="none" stroke="#A8A29E" strokeWidth="1"/>
            <ellipse cx="20" cy="-23" rx="2" ry="1.5" fill="none" stroke="#A8A29E" strokeWidth="1"/>
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
    // Display Case (D) - 2 TILES WIDE: Ornate Victorian museum display case
    // Extends right into adjacent tile (+24px)
    // Zone-specific variants are applied in the rendering logic
    'D': (
        <g>
            {/* Shadow - spans 2 tiles */}
            <ellipse cx="24" cy="22" rx="22" ry="3" fill="#000" opacity="0.15"/>

            {/* === BASE CABINET - ornate wooden base === */}
            <rect x="0" y="16" width="48" height="8" fill="#5D3A1A"/>
            <rect x="1" y="17" width="46" height="6" fill="#8B5A2B"/>
            {/* Carved leg details */}
            <rect x="2" y="20" width="4" height="4" fill="#4A2511"/>
            <rect x="42" y="20" width="4" height="4" fill="#4A2511"/>
            <rect x="22" y="20" width="4" height="4" fill="#4A2511"/>
            {/* Decorative molding */}
            <rect x="0" y="15" width="48" height="2" fill="#6B4423"/>
            <path d="M0 15 Q12 13 24 15 Q36 13 48 15" stroke="#8B6914" strokeWidth="0.5" fill="none"/>

            {/* === GLASS DISPLAY SECTION === */}
            {/* Main glass cabinet body */}
            <rect x="1" y="0" width="46" height="16" fill="#1A1A1A"/>
            <rect x="2" y="1" width="44" height="14" fill="#E0F4FF" opacity="0.85"/>

            {/* Brass/gilded frame */}
            <rect x="0" y="-1" width="48" height="2" fill="#B8860B"/>
            <rect x="0" y="14" width="48" height="2" fill="#B8860B"/>
            <rect x="0" y="0" width="2" height="16" fill="#DAA520"/>
            <rect x="46" y="0" width="2" height="16" fill="#8B7500"/>
            <rect x="23" y="0" width="2" height="16" fill="#B8860B"/>

            {/* Glass reflections */}
            <path d="M4 2 L8 6 L6 8 L2 4 Z" fill="#FFFFFF" opacity="0.3"/>
            <path d="M28 3 L32 7 L30 9 L26 5 Z" fill="#FFFFFF" opacity="0.25"/>

            {/* === DISPLAY CONTENTS (default - Victorian curios) === */}
            {/* Velvet display lining */}
            <rect x="3" y="10" width="42" height="4" fill="#4A1A2C"/>

            {/* Default exhibit items - will be overridden by zone-specific content */}
            {/* Left item - vase/urn */}
            <ellipse cx="10" cy="8" rx="4" ry="6" fill="#B87333"/>
            <ellipse cx="10" cy="4" rx="3" ry="2" fill="#CD853F"/>
            <ellipse cx="10" cy="8" rx="3" ry="4" fill="#D4A574"/>

            {/* Center item - ornate box/artifact */}
            <rect x="19" y="5" width="10" height="7" fill="#FFD700"/>
            <rect x="20" y="6" width="8" height="5" fill="#DAA520"/>
            <circle cx="24" cy="8" r="2" fill="#FFFFFF" opacity="0.3"/>

            {/* Right item - figurine/statue */}
            <ellipse cx="38" cy="10" rx="3" ry="1" fill="#2F2F2F"/>
            <path d="M36 10 L38 3 L40 10" fill="#E8E8E8"/>
            <circle cx="38" cy="2" r="2" fill="#E8E8E8"/>

            {/* Brass label plate */}
            <rect x="18" y="18" width="12" height="3" fill="#B8860B"/>
            <rect x="19" y="19" width="10" height="1" fill="#8B6914"/>

            {/* Decorative corner ornaments */}
            <circle cx="2" cy="0" r="2" fill="#DAA520"/>
            <circle cx="46" cy="0" r="2" fill="#B8860B"/>
            <circle cx="2" cy="14" r="2" fill="#B8860B"/>
            <circle cx="46" cy="14" r="2" fill="#8B7500"/>
        </g>
    ),

    // Aquarium Tank (Ŋ) - 2 TILES WIDE: Animated aquarium for Trocadéro
    // Extends right into adjacent tile (+24px), features animated fish
    'Ŋ': (
        <g>
            {/* Shadow */}
            <ellipse cx="24" cy="23" rx="22" ry="3" fill="#000" opacity="0.2"/>

            {/* === ORNATE IRON BASE === */}
            <rect x="0" y="18" width="48" height="6" fill="#2F4F4F"/>
            <path d="M2 18 C8 16 16 16 24 18 C32 16 40 16 46 18" stroke="#4A6B6B" strokeWidth="1" fill="none"/>
            {/* Decorative iron legs */}
            <path d="M4 18 Q2 22 4 24" stroke="#1F3F3F" strokeWidth="3" fill="none"/>
            <path d="M44 18 Q46 22 44 24" stroke="#1F3F3F" strokeWidth="3" fill="none"/>

            {/* === GLASS TANK === */}
            <rect x="1" y="0" width="46" height="19" fill="#0A2F3F"/>
            <rect x="2" y="1" width="44" height="17" fill="#1A5F7F" opacity="0.9"/>

            {/* Water gradient */}
            <rect x="2" y="1" width="44" height="5" fill="#2A7F9F" opacity="0.4"/>
            <rect x="2" y="14" width="44" height="4" fill="#0A3F5F" opacity="0.3"/>

            {/* Brass frame */}
            <rect x="0" y="-1" width="48" height="2" fill="#B8860B"/>
            <rect x="0" y="17" width="48" height="2" fill="#8B6914"/>
            <rect x="0" y="0" width="2" height="18" fill="#DAA520"/>
            <rect x="46" y="0" width="2" height="18" fill="#8B7500"/>

            {/* === UNDERWATER SCENE === */}
            {/* Sandy bottom */}
            <rect x="2" y="14" width="44" height="3" fill="#C2B280" opacity="0.6"/>
            <ellipse cx="10" cy="15" rx="6" ry="1" fill="#D4C090" opacity="0.5"/>
            <ellipse cx="38" cy="16" rx="5" ry="1" fill="#B8A070" opacity="0.5"/>

            {/* Aquatic plants */}
            <path d="M8 17 Q6 12 8 8 Q10 12 8 17" stroke="#228B22" strokeWidth="2" fill="none"/>
            <path d="M10 17 Q8 10 11 5" stroke="#2E8B57" strokeWidth="1.5" fill="none"/>
            <path d="M40 17 Q42 11 40 6 Q38 11 40 17" stroke="#228B22" strokeWidth="2" fill="none"/>
            <path d="M38 17 Q40 13 37 8" stroke="#2E8B57" strokeWidth="1.5" fill="none"/>

            {/* Coral/rock formation */}
            <ellipse cx="24" cy="15" rx="6" ry="3" fill="#8B4513"/>
            <ellipse cx="22" cy="14" rx="3" ry="2" fill="#A0522D"/>
            <ellipse cx="26" cy="14" rx="2" ry="1.5" fill="#CD853F"/>

            {/* === ANIMATED FISH === */}
            {/* Fish 1 - orange goldfish swimming right */}
            <g>
                <ellipse cx="15" cy="6" rx="4" ry="2.5" fill="#FF6B35">
                    <animate attributeName="cx" values="15;32;15" dur="8s" repeatCount="indefinite"/>
                </ellipse>
                <path d="M11 6 L8 4 L8 8 Z" fill="#FF8C5A">
                    <animate attributeName="d" values="M11 6 L8 4 L8 8 Z;M28 6 L25 4 L25 8 Z;M11 6 L8 4 L8 8 Z" dur="8s" repeatCount="indefinite"/>
                </path>
                <circle cx="17" cy="5.5" r="0.8" fill="#000">
                    <animate attributeName="cx" values="17;34;17" dur="8s" repeatCount="indefinite"/>
                </circle>
            </g>

            {/* Fish 2 - blue fish swimming left */}
            <g>
                <ellipse cx="35" cy="10" rx="3" ry="2" fill="#4169E1">
                    <animate attributeName="cx" values="35;12;35" dur="6s" repeatCount="indefinite"/>
                </ellipse>
                <path d="M38 10 L41 8 L41 12 Z" fill="#6495ED">
                    <animate attributeName="d" values="M38 10 L41 8 L41 12 Z;M15 10 L18 8 L18 12 Z;M38 10 L41 8 L41 12 Z" dur="6s" repeatCount="indefinite"/>
                </path>
                <circle cx="33" cy="9.5" r="0.6" fill="#000">
                    <animate attributeName="cx" values="33;10;33" dur="6s" repeatCount="indefinite"/>
                </circle>
            </g>

            {/* Fish 3 - small silver fish, faster */}
            <g>
                <ellipse cx="20" cy="4" rx="2" ry="1" fill="#C0C0C0">
                    <animate attributeName="cx" values="20;38;20" dur="4s" repeatCount="indefinite"/>
                    <animate attributeName="cy" values="4;6;4" dur="4s" repeatCount="indefinite"/>
                </ellipse>
                <path d="M18 4 L16 3 L16 5 Z" fill="#A9A9A9">
                    <animate attributeName="d" values="M18 4 L16 3 L16 5 Z;M36 6 L34 5 L34 7 Z;M18 4 L16 3 L16 5 Z" dur="4s" repeatCount="indefinite"/>
                </path>
            </g>

            {/* Bubbles - animated */}
            <circle cx="12" cy="12" r="1" fill="#FFFFFF" opacity="0.4">
                <animate attributeName="cy" values="12;2;12" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="30" cy="14" r="0.8" fill="#FFFFFF" opacity="0.3">
                <animate attributeName="cy" values="14;3;14" dur="4s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0;0.3" dur="4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="42" cy="10" r="1.2" fill="#FFFFFF" opacity="0.35">
                <animate attributeName="cy" values="10;1;10" dur="5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.35;0;0.35" dur="5s" repeatCount="indefinite"/>
            </circle>

            {/* Water surface ripples */}
            <path d="M2 2 Q8 1 14 2 Q20 3 26 2 Q32 1 38 2 Q44 3 46 2" stroke="#7FDBFF" strokeWidth="0.5" fill="none" opacity="0.5">
                <animate attributeName="d" values="M2 2 Q8 1 14 2 Q20 3 26 2 Q32 1 38 2 Q44 3 46 2;M2 2 Q8 3 14 2 Q20 1 26 2 Q32 3 38 2 Q44 1 46 2;M2 2 Q8 1 14 2 Q20 3 26 2 Q32 1 38 2 Q44 3 46 2" dur="2s" repeatCount="indefinite"/>
            </path>

            {/* Label plate */}
            <rect x="16" y="20" width="16" height="3" fill="#B8860B"/>
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
    // ============================================
    // ANIMATED MACHINE TILES - 1889 World's Fair
    // ============================================

    // Steam Engine (M) - Corliss-type with animated pistons and steam
    'M': (
        <g>
            {/* Base platform */}
            <rect x="0" y="20" width="24" height="4" fill="#2D3748"/>
            {/* Main boiler body */}
            <ellipse cx="12" cy="14" rx="10" ry="6" fill="url(#steelGrad)"/>
            <ellipse cx="12" cy="14" rx="9" ry="5" fill="#4A5568"/>
            {/* Furnace glow */}
            <ellipse cx="6" cy="16" rx="3" ry="2" fill="url(#furnaceGlow)"/>
            {/* Flywheel with animation */}
            <circle cx="18" cy="10" r="6" fill="#1A202C" stroke="#4A5568" strokeWidth="1"/>
            <circle cx="18" cy="10" r="4" fill="#2D3748"/>
            <circle cx="18" cy="10" r="1" fill="#718096"/>
            <line x1="18" y1="4" x2="18" y2="16" stroke="#4A5568" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" from="0 18 10" to="360 18 10" dur="2s" repeatCount="indefinite"/>
            </line>
            <line x1="12" y1="10" x2="24" y2="10" stroke="#4A5568" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" from="0 18 10" to="360 18 10" dur="2s" repeatCount="indefinite"/>
            </line>
            {/* Piston rod */}
            <rect x="2" y="8" width="8" height="3" fill="url(#brassGrad)">
                <animate attributeName="x" values="2;4;2" dur="1s" repeatCount="indefinite"/>
            </rect>
            {/* Steam vents */}
            <ellipse cx="4" cy="4" rx="3" ry="2" fill="url(#steamGlow)" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="cy" values="4;1;4" dur="1.5s" repeatCount="indefinite"/>
            </ellipse>
            {/* Pressure gauge */}
            <circle cx="12" cy="8" r="2" fill="url(#gaugeGlass)" stroke="#B8860B" strokeWidth="0.5"/>
            <line x1="12" y1="8" x2="13" y2="7" stroke="#B22222" strokeWidth="0.5">
                <animateTransform attributeName="transform" type="rotate" from="0 12 8" to="45 12 8" dur="3s" repeatCount="indefinite" direction="alternate"/>
            </line>
        </g>
    ),

    // Dynamo/Generator (Ð) - Edison-style with copper coils and sparks
    'Ð': (
        <g>
            {/* Base */}
            <rect x="2" y="18" width="20" height="6" fill="#1A202C"/>
            {/* Main housing */}
            <rect x="4" y="8" width="16" height="12" fill="url(#steelGrad)" rx="2"/>
            {/* Copper armature - animated rotation */}
            <circle cx="12" cy="14" r="5" fill="#B87333" stroke="#8B4513" strokeWidth="1"/>
            <ellipse cx="12" cy="14" rx="4" ry="2" fill="#CD7F32">
                <animateTransform attributeName="transform" type="rotate" from="0 12 14" to="360 12 14" dur="0.5s" repeatCount="indefinite"/>
            </ellipse>
            {/* Coil windings */}
            <path d="M8 12 Q12 8 16 12 Q12 16 8 12" fill="none" stroke="#B87333" strokeWidth="1.5">
                <animateTransform attributeName="transform" type="rotate" from="0 12 14" to="360 12 14" dur="0.5s" repeatCount="indefinite"/>
            </path>
            {/* Copper glow effect */}
            <circle cx="12" cy="14" r="6" fill="url(#copperGlow)" opacity="0.5"/>
            {/* Commutator brushes */}
            <rect x="2" y="12" width="3" height="4" fill="#2D3748"/>
            <rect x="19" y="12" width="3" height="4" fill="#2D3748"/>
            {/* Electric sparks */}
            <circle cx="4" cy="14" r="1" fill="#00BFFF" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="0.2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="20" cy="14" r="1" fill="#00BFFF" opacity="0.8">
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="0.2s" repeatCount="indefinite"/>
            </circle>
            {/* Output terminals */}
            <circle cx="6" cy="6" r="1.5" fill="#FFD700"/>
            <circle cx="18" cy="6" r="1.5" fill="#FFD700"/>
            {/* Voltage indicator */}
            <rect x="10" y="4" width="4" height="2" fill="#1A1A1A"/>
            <rect x="11" y="4.5" width="2" height="1" fill="#00FF00">
                <animate attributeName="width" values="0.5;2;0.5" dur="1s" repeatCount="indefinite"/>
            </rect>
        </g>
    ),

    // Printing Press (Þ) - Rotary press with animated cylinders
    'Þ': (
        <g>
            {/* Frame */}
            <rect x="2" y="2" width="20" height="20" fill="#2D3748"/>
            <rect x="4" y="4" width="16" height="16" fill="#4A5568"/>
            {/* Paper feed - animated */}
            <rect x="0" y="10" width="6" height="4" fill="#FFF8DC">
                <animate attributeName="x" values="0;-2;0" dur="0.5s" repeatCount="indefinite"/>
            </rect>
            <rect x="18" y="10" width="6" height="4" fill="#F5F5DC">
                <animate attributeName="x" values="18;20;18" dur="0.5s" repeatCount="indefinite"/>
            </rect>
            {/* Ink rollers */}
            <ellipse cx="8" cy="8" rx="3" ry="2" fill="#1A1A1A">
                <animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="1s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="16" cy="8" rx="3" ry="2" fill="#1A1A1A">
                <animateTransform attributeName="transform" type="rotate" from="0 16 8" to="-360 16 8" dur="1s" repeatCount="indefinite"/>
            </ellipse>
            {/* Main cylinder */}
            <ellipse cx="12" cy="14" rx="6" ry="4" fill="#708090"/>
            <ellipse cx="12" cy="14" rx="5" ry="3" fill="#4A5568">
                <animateTransform attributeName="transform" type="rotate" from="0 12 14" to="360 12 14" dur="0.8s" repeatCount="indefinite"/>
            </ellipse>
            {/* Type plate texture */}
            <line x1="8" y1="13" x2="16" y2="13" stroke="#2D3748" strokeWidth="0.5"/>
            <line x1="8" y1="15" x2="16" y2="15" stroke="#2D3748" strokeWidth="0.5"/>
            {/* Crank handle */}
            <circle cx="20" cy="14" r="2" fill="#B8860B"/>
            <line x1="20" y1="12" x2="20" y2="16" stroke="#8B4513" strokeWidth="1"/>
        </g>
    ),

    // Arc Lamp (Ł) - Electric arc lamp with flickering light
    'Ł': (
        <g>
            {/* Lamp housing */}
            <rect x="8" y="0" width="8" height="4" fill="#2D3748"/>
            {/* Glass globe */}
            <ellipse cx="12" cy="10" rx="6" ry="8" fill="#E0F7FA" opacity="0.3"/>
            <ellipse cx="12" cy="10" rx="5" ry="7" fill="#B2EBF2" opacity="0.2"/>
            {/* Carbon electrodes */}
            <rect x="10" y="4" width="1.5" height="8" fill="#1A1A1A"/>
            <rect x="12.5" y="4" width="1.5" height="8" fill="#1A1A1A"/>
            {/* Electric arc - animated */}
            <ellipse cx="12" cy="10" rx="2" ry="3" fill="url(#electricGlow)">
                <animate attributeName="rx" values="2;3;2" dur="0.1s" repeatCount="indefinite"/>
                <animate attributeName="ry" values="3;4;3" dur="0.15s" repeatCount="indefinite"/>
            </ellipse>
            <circle cx="12" cy="10" r="1" fill="#FFFFFF">
                <animate attributeName="opacity" values="1;0.7;1" dur="0.05s" repeatCount="indefinite"/>
            </circle>
            {/* Light rays */}
            <g opacity="0.4">
                <line x1="12" y1="10" x2="2" y2="20" stroke="#00BFFF" strokeWidth="0.5">
                    <animate attributeName="opacity" values="0.4;0.1;0.4" dur="0.2s" repeatCount="indefinite"/>
                </line>
                <line x1="12" y1="10" x2="22" y2="20" stroke="#00BFFF" strokeWidth="0.5">
                    <animate attributeName="opacity" values="0.1;0.4;0.1" dur="0.2s" repeatCount="indefinite"/>
                </line>
            </g>
            {/* Reflector */}
            <path d="M6 6 Q12 2 18 6" fill="none" stroke="#B8860B" strokeWidth="1"/>
            {/* Support post */}
            <rect x="10" y="16" width="4" height="8" fill="#4A5568"/>
        </g>
    ),

    // Loom/Textile Machine (Ŧ) - Jacquard loom with shuttle
    'Ŧ': (
        <g>
            {/* Frame */}
            <rect x="2" y="4" width="20" height="18" fill="#8B4513"/>
            <rect x="4" y="6" width="16" height="14" fill="#A0522D"/>
            {/* Warp threads */}
            <g stroke="#F5DEB3" strokeWidth="0.3">
                <line x1="6" y1="6" x2="6" y2="20"/>
                <line x1="9" y1="6" x2="9" y2="20"/>
                <line x1="12" y1="6" x2="12" y2="20"/>
                <line x1="15" y1="6" x2="15" y2="20"/>
                <line x1="18" y1="6" x2="18" y2="20"/>
            </g>
            {/* Shuttle - animated */}
            <rect x="4" y="12" width="4" height="2" fill="#DEB887" rx="1">
                <animate attributeName="x" values="4;16;4" dur="1s" repeatCount="indefinite"/>
            </rect>
            {/* Heddles */}
            <rect x="4" y="8" width="16" height="1" fill="#6B4423">
                <animate attributeName="y" values="8;9;8" dur="0.5s" repeatCount="indefinite"/>
            </rect>
            <rect x="4" y="16" width="16" height="1" fill="#6B4423">
                <animate attributeName="y" values="16;15;16" dur="0.5s" repeatCount="indefinite"/>
            </rect>
            {/* Punch card mechanism (Jacquard) */}
            <rect x="8" y="2" width="8" height="4" fill="#F5F5DC"/>
            <g fill="#1A1A1A">
                <circle cx="10" cy="3" r="0.5"/>
                <circle cx="12" cy="4" r="0.5"/>
                <circle cx="14" cy="3" r="0.5"/>
            </g>
            {/* Cloth beam */}
            <ellipse cx="12" cy="22" rx="8" ry="2" fill="#DEB887"/>
        </g>
    ),

    // Hydraulic Press (Ħ) - With pressure gauge and animated piston
    'Ħ': (
        <g>
            {/* Main frame */}
            <rect x="4" y="2" width="16" height="20" fill="#2D3748"/>
            <rect x="6" y="4" width="12" height="16" fill="#4A5568"/>
            {/* Hydraulic cylinder */}
            <rect x="8" y="6" width="8" height="10" fill="#1A202C"/>
            {/* Piston - animated */}
            <rect x="9" y="8" width="6" height="4" fill="url(#steelGrad)">
                <animate attributeName="y" values="8;12;8" dur="2s" repeatCount="indefinite"/>
            </rect>
            {/* Pressure plate */}
            <rect x="7" y="16" width="10" height="2" fill="#708090"/>
            {/* Pressure gauge */}
            <circle cx="18" cy="6" r="3" fill="url(#gaugeGlass)" stroke="#B8860B" strokeWidth="1"/>
            <line x1="18" y1="6" x2="19" y2="4" stroke="#B22222" strokeWidth="1">
                <animate attributeName="transform" values="rotate(0 18 6);rotate(90 18 6);rotate(0 18 6)" dur="2s" repeatCount="indefinite"/>
            </line>
            {/* Hydraulic lines */}
            <path d="M4 12 L2 12 L2 20 L6 20" stroke="#B8860B" strokeWidth="1" fill="none"/>
            {/* Oil reservoir */}
            <rect x="0" y="18" width="4" height="4" fill="#2D3748"/>
            <rect x="1" y="19" width="2" height="2" fill="url(#oilSheen)"/>
            {/* Control valve */}
            <circle cx="4" cy="14" r="1.5" fill="#B22222"/>
        </g>
    ),

    // Phonograph (Ø) - Edison's talking machine with horn
    'Ø': (
        <g>
            {/* Base cabinet */}
            <rect x="4" y="14" width="16" height="10" fill="#8B4513"/>
            <rect x="5" y="15" width="14" height="8" fill="#A0522D"/>
            {/* Turntable */}
            <ellipse cx="12" cy="14" rx="6" ry="2" fill="#1A1A1A"/>
            <ellipse cx="12" cy="13" rx="5" ry="1.5" fill="#2D3748">
                <animateTransform attributeName="transform" type="rotate" from="0 12 13" to="360 12 13" dur="3s" repeatCount="indefinite"/>
            </ellipse>
            {/* Wax cylinder */}
            <ellipse cx="12" cy="12" rx="3" ry="1" fill="#F0E68C"/>
            {/* Tone arm */}
            <line x1="16" y1="10" x2="12" y2="12" stroke="#B8860B" strokeWidth="1"/>
            <circle cx="16" cy="10" r="1" fill="#B8860B"/>
            {/* Horn */}
            <path d="M12 10 Q8 6 4 2 L8 2 Q10 6 12 8 Q14 6 16 2 L20 2 Q16 6 12 10" fill="#B8860B"/>
            <ellipse cx="12" cy="2" rx="6" ry="1" fill="#D4AF37"/>
            {/* Sound waves - animated */}
            <g opacity="0.3">
                <ellipse cx="12" cy="0" rx="4" ry="1" fill="none" stroke="#D4AF37" strokeWidth="0.5">
                    <animate attributeName="ry" values="1;3;1" dur="1s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.3;0;0.3" dur="1s" repeatCount="indefinite"/>
                </ellipse>
            </g>
            {/* Decorative details */}
            <circle cx="8" cy="18" r="1" fill="#B8860B"/>
            <circle cx="16" cy="18" r="1" fill="#B8860B"/>
        </g>
    ),

    // Telegraph Machine (ŧ) - Morse key with sounder
    'ŧ': (
        <g>
            {/* Base */}
            <rect x="4" y="16" width="16" height="8" fill="#5D4037"/>
            <rect x="5" y="17" width="14" height="6" fill="#6D4C41"/>
            {/* Morse key */}
            <rect x="6" y="14" width="8" height="3" fill="#B8860B"/>
            <rect x="8" y="12" width="4" height="3" fill="#D4AF37">
                <animate attributeName="y" values="12;13;12" dur="0.3s" repeatCount="indefinite"/>
            </rect>
            {/* Sounder/receiver */}
            <rect x="16" y="12" width="4" height="6" fill="#2D3748"/>
            <rect x="17" y="10" width="2" height="4" fill="#B8860B">
                <animate attributeName="height" values="4;2;4" dur="0.3s" repeatCount="indefinite"/>
            </rect>
            {/* Wire connections */}
            <path d="M14 14 L16 14" stroke="#B8860B" strokeWidth="0.5"/>
            <path d="M10 18 Q12 22 20 20" stroke="#1A1A1A" strokeWidth="0.5" fill="none"/>
            {/* Paper tape */}
            <rect x="2" y="18" width="4" height="1" fill="#F5F5DC"/>
            <rect x="0" y="18" width="3" height="1" fill="#FFFAF0">
                <animate attributeName="x" values="0;-2;0" dur="1s" repeatCount="indefinite"/>
            </rect>
            {/* Electrical spark indicator */}
            <circle cx="10" cy="11" r="1" fill="#FFD700" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0;0.6" dur="0.3s" repeatCount="indefinite"/>
            </circle>
        </g>
    ),

    // Automobile Engine (đ) - Early Benz-type with exposed cylinders
    'đ': (
        <g>
            {/* Engine block */}
            <rect x="4" y="10" width="16" height="10" fill="#2D3748"/>
            {/* Cylinder */}
            <rect x="6" y="4" width="6" height="8" fill="#4A5568"/>
            <rect x="7" y="6" width="4" height="4" fill="#1A202C"/>
            {/* Piston - animated */}
            <rect x="8" y="7" width="2" height="3" fill="#708090">
                <animate attributeName="y" values="7;9;7" dur="0.4s" repeatCount="indefinite"/>
            </rect>
            {/* Flywheel */}
            <circle cx="18" cy="14" r="5" fill="#1A202C" stroke="#4A5568" strokeWidth="1"/>
            <line x1="13" y1="14" x2="23" y2="14" stroke="#4A5568" strokeWidth="0.5">
                <animateTransform attributeName="transform" type="rotate" from="0 18 14" to="360 18 14" dur="0.6s" repeatCount="indefinite"/>
            </line>
            {/* Belt to flywheel */}
            <path d="M12 8 Q15 6 18 9" stroke="#3E2723" strokeWidth="1" fill="none"/>
            {/* Exhaust - animated smoke */}
            <circle cx="4" cy="4" r="2" fill="#808080" opacity="0.5">
                <animate attributeName="cy" values="4;0;4" dur="0.8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.5;0;0.5" dur="0.8s" repeatCount="indefinite"/>
            </circle>
            {/* Carburetor */}
            <rect x="12" y="6" width="4" height="4" fill="#B8860B"/>
            {/* Spark plug */}
            <rect x="8" y="2" width="2" height="3" fill="#F5F5DC"/>
            <circle cx="9" cy="1" r="1" fill="#FFD700">
                <animate attributeName="opacity" values="1;0;1" dur="0.2s" repeatCount="indefinite"/>
            </circle>
        </g>
    ),

    // Centrifuge (ð) - Scientific apparatus with spinning bowl
    'ð': (
        <g>
            {/* Base stand */}
            <rect x="6" y="18" width="12" height="6" fill="#2D3748"/>
            <rect x="4" y="22" width="16" height="2" fill="#1A202C"/>
            {/* Central column */}
            <rect x="10" y="8" width="4" height="12" fill="#4A5568"/>
            {/* Spinning bowl */}
            <ellipse cx="12" cy="8" rx="8" ry="3" fill="#708090">
                <animateTransform attributeName="transform" type="rotate" from="0 12 8" to="360 12 8" dur="0.3s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="12" cy="7" rx="7" ry="2.5" fill="#B0C4DE">
                <animateTransform attributeName="transform" type="rotate" from="0 12 7" to="360 12 7" dur="0.3s" repeatCount="indefinite"/>
            </ellipse>
            {/* Sample tubes */}
            <rect x="6" y="6" width="2" height="3" fill="#87CEEB" rx="1">
                <animateTransform attributeName="transform" type="rotate" from="0 12 8" to="360 12 8" dur="0.3s" repeatCount="indefinite"/>
            </rect>
            <rect x="16" y="6" width="2" height="3" fill="#87CEEB" rx="1">
                <animateTransform attributeName="transform" type="rotate" from="0 12 8" to="360 12 8" dur="0.3s" repeatCount="indefinite"/>
            </rect>
            {/* Speed blur effect */}
            <ellipse cx="12" cy="8" rx="9" ry="3.5" fill="none" stroke="#B0C4DE" strokeWidth="0.5" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="0.1s" repeatCount="indefinite"/>
            </ellipse>
            {/* Control dial */}
            <circle cx="8" cy="20" r="2" fill="#1A202C"/>
            <line x1="8" y1="20" x2="8" y2="18" stroke="#FFD700" strokeWidth="1"/>
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
    // Ticket Booth - Ornate booth (2x2 structure, this is bottom-left)
    // Layout: ┼┼ (top row)
    //         NN (bottom row, N = bottom-left with counter)
    'N': (
        <g>
            {/* Shadow - extends right */}
            <ellipse cx="24" cy="22" rx="18" ry="3" fill="#000" opacity="0.2"/>
            {/* Main booth structure - extends right and up */}
            <rect x="0" y="6" width="48" height="18" fill="#166534"/>
            <rect x="2" y="8" width="44" height="14" fill="#15803D"/>
            {/* Decorative wood paneling */}
            <rect x="4" y="10" width="8" height="10" fill="#14532D"/>
            <rect x="14" y="10" width="8" height="10" fill="#14532D"/>
            {/* Ticket window with attendant area */}
            <rect x="24" y="10" width="18" height="10" fill="#FEF3C7"/>
            <rect x="25" y="11" width="16" height="8" fill="#FFFDE7"/>
            <rect x="24" y="10" width="18" height="10" fill="none" stroke="#B45309" strokeWidth="1"/>
            {/* Counter shelf */}
            <rect x="22" y="18" width="22" height="3" fill="#92400E"/>
            <rect x="24" y="17" width="18" height="2" fill="#78350F"/>
            {/* Structure extends above */}
            <rect x="0" y="-18" width="48" height="26" fill="#166534"/>
            <rect x="2" y="-16" width="44" height="22" fill="#15803D"/>
            {/* Ornate pitched roof */}
            <path d="M-4 -18 L24 -38 L52 -18 Z" fill="#14532D"/>
            <path d="M0 -18 L24 -34 L48 -18 Z" fill="#166534"/>
            {/* Roof ridge detail */}
            <line x1="24" y1="-38" x2="24" y2="-34" stroke="#FFD700" strokeWidth="2"/>
            {/* BILLETS sign (large) */}
            <rect x="8" y="-14" width="32" height="6" fill="#FEF3C7"/>
            <text x="24" y="-10" textAnchor="middle" fontSize="5" fill="#78350F" fontWeight="bold">BILLETS</text>
            {/* Price board */}
            <rect x="10" y="-6" width="28" height="4" fill="#1A202C"/>
            <text x="24" y="-3.5" textAnchor="middle" fontSize="2.5" fill="#FEF3C7">ENTRÉE: 1 FRANC</text>
            {/* Decorative finials */}
            <circle cx="24" cy="-39" r="2.5" fill="#FFD700"/>
            <circle cx="0" cy="-18" r="1.5" fill="#FFD700"/>
            <circle cx="48" cy="-18" r="1.5" fill="#FFD700"/>
            {/* Ornate ironwork at roof edge */}
            <path d="M4 -18 Q8 -22 12 -18 Q16 -22 20 -18" stroke="#166534" strokeWidth="1" fill="none"/>
            <path d="M28 -18 Q32 -22 36 -18 Q40 -22 44 -18" stroke="#166534" strokeWidth="1" fill="none"/>
        </g>
    ),
    // Guard Post - Police/guard station (2x2 structure, bottom-left tile)
    // Layout: ┬┬ (top row)
    //         QQ (bottom row, Q = bottom-left main entry)
    'Q': (
        <g>
            {/* Shadow - extends right */}
            <ellipse cx="24" cy="22" rx="20" ry="3" fill="#000" opacity="0.2"/>
            {/* Main structure base - extends right into adjacent tile */}
            <rect x="0" y="8" width="48" height="16" fill="#1E40AF"/>
            <rect x="2" y="10" width="44" height="12" fill="#2563EB"/>
            {/* Door (in this tile) */}
            <rect x="8" y="12" width="8" height="12" fill="#1E3A8A"/>
            <rect x="9" y="13" width="6" height="10" fill="#172554"/>
            <circle cx="14" cy="19" r="1" fill="#FFD700"/>
            {/* Window in this tile */}
            <rect x="18" y="12" width="8" height="6" fill="#BFDBFE"/>
            <path d="M22 12 V18 M18 15 H26" stroke="#1E3A8A" strokeWidth="0.5"/>
            {/* Structure extends above (into top tile row) */}
            <rect x="0" y="-16" width="48" height="26" fill="#1E40AF"/>
            <rect x="2" y="-14" width="44" height="22" fill="#2563EB"/>
            {/* Roof with overhang */}
            <rect x="-2" y="-20" width="52" height="5" fill="#1E3A8A"/>
            <rect x="-4" y="-22" width="56" height="3" fill="#172554"/>
            {/* SERGENT DE VILLE sign */}
            <rect x="8" y="-16" width="32" height="4" fill="#FEF3C7"/>
            <text x="24" y="-13" textAnchor="middle" fontSize="3" fill="#1E40AF" fontWeight="bold">SERGENT DE VILLE</text>
            {/* Lantern on roof */}
            <rect x="20" y="-28" width="8" height="8" fill="#FEF9C3"/>
            <rect x="21" y="-27" width="6" height="6" fill="#FFEB3B" opacity="0.8"/>
            <rect x="20" y="-28" width="8" height="8" fill="none" stroke="#B45309" strokeWidth="1"/>
            {/* Roof finial */}
            <path d="M22 -28 L24 -34 L26 -28" fill="#1E3A8A"/>
            <circle cx="24" cy="-35" r="2" fill="#FFD700"/>
            {/* French flag */}
            <rect x="42" y="-30" width="2" height="16" fill="#78716C"/>
            <rect x="44" y="-28" width="3" height="6" fill="#002395"/>
            <rect x="47" y="-28" width="3" height="6" fill="#FFFFFF"/>
            <rect x="50" y="-28" width="3" height="6" fill="#ED2939"/>
        </g>
    ),
    // Flagpole (y) - 3 TILES TALL: Majestic French flagpole
    // Extends upward 2 full tiles (-48px total above this tile)
    'y': (
        <g>
            {/* Shadow at base */}
            <ellipse cx="12" cy="22" rx="6" ry="2" fill="#000" opacity="0.15"/>

            {/* Ornate stone base */}
            <rect x="4" y="18" width="16" height="6" fill="#57534E"/>
            <rect x="6" y="16" width="12" height="3" fill="#6B7280"/>
            <rect x="2" y="22" width="20" height="2" fill="#44403C"/>
            {/* Base decorative molding */}
            <rect x="5" y="19" width="14" height="1" fill="#78716C"/>

            {/* === MAIN POLE - extends through 3 tiles === */}
            {/* Bottom section (in this tile) */}
            <rect x="10" y="0" width="4" height="18" fill="#78716C"/>
            <rect x="11" y="0" width="2" height="18" fill="#9CA3AF"/>

            {/* Middle section (tile above, y: 0 to -24) */}
            <rect x="10" y="-24" width="4" height="26" fill="#78716C"/>
            <rect x="11" y="-24" width="2" height="26" fill="#9CA3AF"/>

            {/* Top section (two tiles above, y: -24 to -48) */}
            <rect x="10" y="-48" width="4" height="26" fill="#78716C"/>
            <rect x="11" y="-48" width="2" height="26" fill="#9CA3AF"/>

            {/* Decorative bands on pole */}
            <rect x="9" y="14" width="6" height="2" fill="#FFD700"/>
            <rect x="9" y="-10" width="6" height="2" fill="#FFD700"/>
            <rect x="9" y="-34" width="6" height="2" fill="#FFD700"/>

            {/* === FLAG - Large French tricolore at top === */}
            {/* Flag pole arm */}
            <rect x="12" y="-46" width="20" height="1.5" fill="#57534E"/>

            {/* Large flowing flag */}
            <path d="M14 -46 L14 -28 Q18 -30 22 -28 L22 -46" fill="#002395"/>
            <path d="M22 -46 L22 -28 Q26 -30 30 -28 L30 -46" fill="#FFFFFF"/>
            <path d="M30 -46 L30 -28 Q34 -30 38 -28 L38 -46" fill="#ED2939"/>

            {/* Flag wave animation lines */}
            <path d="M14 -40 Q18 -42 22 -40 Q26 -42 30 -40 Q34 -42 38 -40" stroke="#00000020" strokeWidth="0.5" fill="none"/>
            <path d="M14 -34 Q18 -32 22 -34 Q26 -32 30 -34 Q34 -32 38 -34" stroke="#00000020" strokeWidth="0.5" fill="none"/>

            {/* Finial - ornate golden spear point */}
            <path d="M12 -56 L8 -48 L12 -50 L16 -48 Z" fill="#FFD700"/>
            <circle cx="12" cy="-48" r="3" fill="#FFD700"/>
            <circle cx="12" cy="-48" r="1.5" fill="#FEF3C7"/>
            <path d="M10 -48 L12 -58 L14 -48" fill="#FFD700"/>
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

    // Palm Tree (%) - TALL: extends above tile bounds
    '%': (
        <g>
            {/* Shadow */}
            <ellipse cx="14" cy="22" rx="8" ry="2.5" fill="#000" opacity="0.2"/>
            {/* Trunk - curved and textured, extends through tile */}
            <path d="M10 24 Q8 12 10 0 Q11 -8 12 -12" stroke="#8B7355" strokeWidth="5" fill="none"/>
            <path d="M14 24 Q16 12 14 0 Q13 -8 12 -12" stroke="#8B7355" strokeWidth="5" fill="none"/>
            <path d="M10 24 Q8 12 10 0 Q11 -8 12 -12" stroke="#A08464" strokeWidth="3" fill="none"/>
            <path d="M14 24 Q16 12 14 0 Q13 -8 12 -12" stroke="#A08464" strokeWidth="3" fill="none"/>
            {/* Bark rings */}
            <ellipse cx="12" cy="4" rx="3" ry="1" fill="none" stroke="#6B5344" strokeWidth="0.5"/>
            <ellipse cx="12" cy="8" rx="3.2" ry="1" fill="none" stroke="#6B5344" strokeWidth="0.5"/>
            <ellipse cx="12" cy="12" rx="3.5" ry="1" fill="none" stroke="#6B5344" strokeWidth="0.5"/>
            <ellipse cx="12" cy="16" rx="3.2" ry="1" fill="none" stroke="#6B5344" strokeWidth="0.5"/>
            <ellipse cx="12" cy="20" rx="3" ry="1" fill="none" stroke="#6B5344" strokeWidth="0.5"/>
            {/* Palm fronds - radiating above tile */}
            <path d="M12 -12 Q2 -20 -4 -28" stroke="#228B22" strokeWidth="3" fill="none"/>
            <path d="M12 -12 Q22 -20 28 -28" stroke="#228B22" strokeWidth="3" fill="none"/>
            <path d="M12 -12 Q0 -16 -6 -20" stroke="#2E7D32" strokeWidth="2.5" fill="none"/>
            <path d="M12 -12 Q24 -16 30 -20" stroke="#2E7D32" strokeWidth="2.5" fill="none"/>
            <path d="M12 -12 Q4 -22 -2 -32" stroke="#388E3C" strokeWidth="2" fill="none"/>
            <path d="M12 -12 Q20 -22 26 -32" stroke="#388E3C" strokeWidth="2" fill="none"/>
            <path d="M12 -12 Q10 -26 8 -36" stroke="#43A047" strokeWidth="2" fill="none"/>
            <path d="M12 -12 Q14 -26 16 -36" stroke="#43A047" strokeWidth="2" fill="none"/>
            {/* Central fronds going straight up */}
            <path d="M12 -12 Q11 -28 10 -40" stroke="#4CAF50" strokeWidth="1.5" fill="none"/>
            <path d="M12 -12 Q13 -28 14 -40" stroke="#4CAF50" strokeWidth="1.5" fill="none"/>
            {/* Coconuts at crown */}
            <circle cx="10" cy="-10" r="2" fill="#8B4513"/>
            <circle cx="14" cy="-11" r="1.8" fill="#8B4513"/>
            <circle cx="12" cy="-9" r="1.5" fill="#795548"/>
        </g>
    ),

    // Animated Waterfall (|)
    '|': (
        <g>
            {/* Waterfall stream - animated */}
            <rect x="2" y="0" width="20" height="24" fill="url(#waterfallGrad)"/>
            {/* Animated water streams */}
            <g opacity="0.7">
                <line x1="6" y1="0" x2="6" y2="24" stroke="#FFFFFF" strokeWidth="1.5">
                    <animate attributeName="y1" values="0;-4;0" dur="0.5s" repeatCount="indefinite"/>
                </line>
                <line x1="10" y1="0" x2="10" y2="24" stroke="#FFFFFF" strokeWidth="2">
                    <animate attributeName="y1" values="0;-6;0" dur="0.4s" repeatCount="indefinite"/>
                </line>
                <line x1="14" y1="0" x2="14" y2="24" stroke="#E0F7FA" strokeWidth="1.5">
                    <animate attributeName="y1" values="0;-5;0" dur="0.45s" repeatCount="indefinite"/>
                </line>
                <line x1="18" y1="0" x2="18" y2="24" stroke="#FFFFFF" strokeWidth="1">
                    <animate attributeName="y1" values="0;-4;0" dur="0.55s" repeatCount="indefinite"/>
                </line>
            </g>
            {/* Foam at top - source */}
            <ellipse cx="12" cy="2" rx="8" ry="3" fill="url(#waterfallFoam)">
                <animate attributeName="ry" values="3;4;3" dur="0.8s" repeatCount="indefinite"/>
            </ellipse>
            {/* Foam at bottom - splash pool */}
            <ellipse cx="12" cy="22" rx="10" ry="4" fill="url(#waterfallFoam)" opacity="0.8">
                <animate attributeName="ry" values="4;5;4" dur="0.6s" repeatCount="indefinite"/>
            </ellipse>
            {/* Animated spray particles */}
            <circle cx="3" cy="8" r="1.5" fill="#FFFFFF" opacity="0.5">
                <animate attributeName="cy" values="8;4;8" dur="1s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="21" cy="12" r="1.2" fill="#FFFFFF" opacity="0.4">
                <animate attributeName="cy" values="12;8;12" dur="1.2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="0" cy="18" r="1" fill="#FFFFFF" opacity="0.3">
                <animate attributeName="cy" values="18;14;18" dur="0.9s" repeatCount="indefinite"/>
            </circle>
            <circle cx="24" cy="6" r="0.8" fill="#FFFFFF" opacity="0.3">
                <animate attributeName="cy" values="6;2;6" dur="1.1s" repeatCount="indefinite"/>
            </circle>
            {/* Mist effect */}
            <ellipse cx="2" cy="20" rx="3" ry="2" fill="#FFFFFF" opacity="0.2">
                <animate attributeName="rx" values="3;5;3" dur="2s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="22" cy="20" rx="3" ry="2" fill="#FFFFFF" opacity="0.2">
                <animate attributeName="rx" values="3;5;3" dur="2.2s" repeatCount="indefinite"/>
            </ellipse>
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

    // Minaret/Tower ()) - TALL: extends above tile bounds
    ')': (
        <g>
            {/* Shadow */}
            <ellipse cx="14" cy="22" rx="6" ry="2" fill="#000" opacity="0.2"/>
            {/* Base */}
            <rect x="4" y="18" width="16" height="6" fill="#C4A574"/>
            <rect x="2" y="22" width="20" height="2" fill="#B4956A"/>
            {/* Tower body - extends through tile */}
            <rect x="6" y="-10" width="12" height="30" fill="#E4B584"/>
            <rect x="7" y="-10" width="10" height="30" fill="#D4A574"/>
            {/* Decorative bands */}
            <rect x="6" y="4" width="12" height="1" fill="#B8860B"/>
            <rect x="6" y="10" width="12" height="1" fill="#B8860B"/>
            <rect x="6" y="16" width="12" height="1" fill="#B8860B"/>
            {/* Windows */}
            <rect x="10" y="2" width="4" height="6" rx="2" fill="#1A1A2E" opacity="0.5"/>
            <rect x="10" y="12" width="4" height="4" fill="#1A1A2E" opacity="0.4"/>
            {/* Decorative arch */}
            <path d="M8 20 Q12 16 16 20" fill="none" stroke="#8B7355" strokeWidth="1"/>
            {/* Golden dome - above tile */}
            <path d="M6 -10 Q6 -20 12 -26 Q18 -20 18 -10 Z" fill="#FFD700"/>
            <path d="M8 -12 Q8 -18 12 -24 Q16 -18 16 -12 Z" fill="#FFC107"/>
            {/* Spire */}
            <line x1="12" y1="-26" x2="12" y2="-34" stroke="#FFD700" strokeWidth="2"/>
            <circle cx="12" cy="-36" r="2" fill="#FFD700"/>
            {/* Crescent moon finial */}
            <path d="M10 -38 Q12 -42 14 -38 Q13 -37 10 -38" fill="#FFD700"/>
            {/* Decorative band at dome base */}
            <rect x="6" y="-12" width="12" height="2" fill="#B8860B"/>
            {/* Window in dome */}
            <ellipse cx="12" cy="-16" rx="2" ry="3" fill="#1A1A2E" opacity="0.6"/>
            {/* Muqarnas detail */}
            <path d="M6 -10 Q8 -12 10 -10 Q12 -12 14 -10 Q16 -12 18 -10" fill="#D4A574"/>
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

    // ============================================
    // TWO-TILE TALL OBJECTS
    // Place TOP tile above, BOTTOM tile below in map
    // ============================================

    // TALL TREE - Top portion (¶) - Shows canopy
    '¶': (
        <g>
            {/* Main canopy - extends above tile */}
            <ellipse cx="12" cy="16" rx="11" ry="10" fill="#2E7D32"/>
            <ellipse cx="8" cy="12" rx="7" ry="7" fill="#388E3C"/>
            <ellipse cx="16" cy="12" rx="7" ry="7" fill="#388E3C"/>
            <ellipse cx="12" cy="8" rx="9" ry="7" fill="#43A047"/>
            <ellipse cx="6" cy="10" rx="4" ry="4" fill="#4CAF50"/>
            <ellipse cx="18" cy="10" rx="4" ry="4" fill="#4CAF50"/>
            <ellipse cx="12" cy="4" rx="6" ry="5" fill="#66BB6A"/>
            {/* Light spots */}
            <circle cx="8" cy="6" r="2" fill="#81C784" opacity="0.7"/>
            <circle cx="15" cy="8" r="1.5" fill="#A5D6A7" opacity="0.5"/>
            {/* Birds/details */}
            <path d="M4 2 Q6 0 8 2" stroke="#1B5E20" fill="none" strokeWidth="0.5"/>
        </g>
    ),

    // TALL TREE - Bottom portion (¤) - Shows trunk
    '¤': (
        <g>
            {/* Shadow */}
            <ellipse cx="14" cy="22" rx="8" ry="2" fill="#000" opacity="0.25"/>
            {/* Main trunk */}
            <rect x="9" y="0" width="6" height="22" fill="#5D4037"/>
            <rect x="10" y="0" width="4" height="22" fill="#6D4C41"/>
            {/* Bark texture */}
            <line x1="10" y1="4" x2="10" y2="8" stroke="#4E342E" strokeWidth="0.5"/>
            <line x1="14" y1="10" x2="14" y2="16" stroke="#4E342E" strokeWidth="0.5"/>
            <line x1="11" y1="14" x2="11" y2="20" stroke="#4E342E" strokeWidth="0.5"/>
            {/* Root base */}
            <path d="M9 20 Q6 22 4 22 M15 20 Q18 22 20 22" stroke="#5D4037" strokeWidth="2" fill="none"/>
            {/* Canopy bottom edge peeking into this tile */}
            <ellipse cx="12" cy="-2" rx="10" ry="6" fill="#2E7D32"/>
        </g>
    ),

    // TALL GAS LAMP - Top portion (§) - Shows lamp head and glow
    '§': (
        <g>
            {/* Lamp glow effect */}
            <circle cx="12" cy="14" r="10" fill="url(#lampGlow)" opacity="0.5"/>
            {/* Lamp housing - ornate Victorian */}
            <rect x="8" y="10" width="8" height="10" fill="#263238"/>
            <rect x="9" y="11" width="6" height="8" fill="#FFEB3B" opacity="0.9"/>
            {/* Glass panes */}
            <line x1="12" y1="11" x2="12" y2="19" stroke="#263238" strokeWidth="0.5"/>
            <line x1="9" y1="15" x2="15" y2="15" stroke="#263238" strokeWidth="0.5"/>
            {/* Top finial */}
            <path d="M10 10 L12 4 L14 10 Z" fill="#37474F"/>
            <circle cx="12" cy="3" r="1.5" fill="#455A64"/>
            {/* Decorative brackets */}
            <path d="M8 12 Q4 14 6 18" stroke="#37474F" strokeWidth="1" fill="none"/>
            <path d="M16 12 Q20 14 18 18" stroke="#37474F" strokeWidth="1" fill="none"/>
            {/* Flame flicker effect */}
            <ellipse cx="12" cy="15" rx="2" ry="3" fill="#FFF59D" opacity="0.8">
                <animate attributeName="ry" values="3;3.5;3" dur="0.3s" repeatCount="indefinite"/>
            </ellipse>
        </g>
    ),

    // TALL GAS LAMP - Bottom portion (¥) - Shows post
    '¥': (
        <g>
            {/* Shadow */}
            <ellipse cx="13" cy="22" rx="5" ry="1.5" fill="#000" opacity="0.2"/>
            {/* Lamp post - ornate Victorian cast iron */}
            <rect x="10" y="0" width="4" height="18" fill="#37474F"/>
            <rect x="11" y="0" width="2" height="18" fill="#455A64"/>
            {/* Decorative rings */}
            <rect x="9" y="4" width="6" height="2" fill="#546E7A"/>
            <rect x="9" y="12" width="6" height="2" fill="#546E7A"/>
            {/* Base pedestal */}
            <rect x="8" y="18" width="8" height="4" fill="#263238"/>
            <rect x="6" y="21" width="12" height="3" fill="#1A202C"/>
            {/* Decorative detail */}
            <circle cx="12" cy="8" r="1" fill="#607D8B"/>
        </g>
    ),

    // TALL MINARET - Top portion (†) - Shows dome and spire
    '†': (
        <g>
            {/* Golden dome */}
            <path d="M6 20 Q6 10 12 4 Q18 10 18 20 Z" fill="#FFD700"/>
            <path d="M8 18 Q8 12 12 6 Q16 12 16 18 Z" fill="#FFC107"/>
            {/* Spire */}
            <line x1="12" y1="4" x2="12" y2="-2" stroke="#FFD700" strokeWidth="2"/>
            <circle cx="12" cy="-4" r="2" fill="#FFD700"/>
            {/* Crescent moon finial */}
            <path d="M10 -6 Q12 -8 14 -6 Q13 -5 10 -6" fill="#FFD700"/>
            {/* Decorative band */}
            <rect x="6" y="18" width="12" height="2" fill="#B8860B"/>
            {/* Window openings */}
            <ellipse cx="12" cy="14" rx="2" ry="3" fill="#1A1A2E" opacity="0.6"/>
            {/* Muqarnas detail */}
            <path d="M6 20 Q8 18 10 20 Q12 18 14 20 Q16 18 18 20" fill="#D4A574"/>
        </g>
    ),

    // TALL MINARET - Bottom portion (£) - Shows tower body
    '£': (
        <g>
            {/* Shadow */}
            <ellipse cx="14" cy="22" rx="6" ry="2" fill="#000" opacity="0.2"/>
            {/* Tower body */}
            <rect x="6" y="0" width="12" height="20" fill="#E4B584"/>
            <rect x="7" y="0" width="10" height="20" fill="#D4A574"/>
            {/* Decorative bands */}
            <rect x="6" y="4" width="12" height="1" fill="#B8860B"/>
            <rect x="6" y="10" width="12" height="1" fill="#B8860B"/>
            <rect x="6" y="16" width="12" height="1" fill="#B8860B"/>
            {/* Windows */}
            <rect x="10" y="2" width="4" height="6" rx="2" fill="#1A1A2E" opacity="0.5"/>
            <rect x="10" y="12" width="4" height="4" fill="#1A1A2E" opacity="0.4"/>
            {/* Base */}
            <rect x="4" y="18" width="16" height="6" fill="#C4A574"/>
            <rect x="2" y="22" width="20" height="2" fill="#B4956A"/>
            {/* Decorative arch */}
            <path d="M8 20 Q12 16 16 20" fill="none" stroke="#8B7355" strokeWidth="1"/>
        </g>
    ),

    // TALL PILLAR/COLUMN - Top portion (‡) - Shows capital
    '‡': (
        <g>
            {/* Corinthian capital - elaborate */}
            <rect x="4" y="14" width="16" height="6" fill="#D6D3D1"/>
            <rect x="2" y="12" width="20" height="3" fill="#E7E5E4"/>
            {/* Abacus (top plate) */}
            <rect x="0" y="8" width="24" height="4" fill="#F5F5F4"/>
            <rect x="1" y="9" width="22" height="2" fill="#E7E5E4"/>
            {/* Acanthus leaves */}
            <path d="M4 14 Q8 8 12 14 Q16 8 20 14" fill="#D6D3D1" stroke="#A8A29E" strokeWidth="0.5"/>
            <path d="M6 16 Q8 12 10 16 M14 16 Q16 12 18 16" stroke="#A8A29E" strokeWidth="0.5" fill="none"/>
            {/* Volutes */}
            <ellipse cx="4" cy="11" rx="2" ry="1.5" fill="none" stroke="#A8A29E" strokeWidth="1"/>
            <ellipse cx="20" cy="11" rx="2" ry="1.5" fill="none" stroke="#A8A29E" strokeWidth="1"/>
            {/* Column shaft top */}
            <rect x="6" y="18" width="12" height="6" fill="#D6D3D1"/>
            {/* Fluting */}
            <line x1="8" y1="18" x2="8" y2="24" stroke="#A8A29E" strokeWidth="0.5"/>
            <line x1="12" y1="18" x2="12" y2="24" stroke="#A8A29E" strokeWidth="0.5"/>
            <line x1="16" y1="18" x2="16" y2="24" stroke="#A8A29E" strokeWidth="0.5"/>
        </g>
    ),

    // TALL PILLAR/COLUMN - Bottom portion (©) - Shows shaft and base
    '©': (
        <g>
            {/* Shadow */}
            <ellipse cx="13" cy="22" rx="8" ry="2" fill="#000" opacity="0.15"/>
            {/* Column shaft */}
            <rect x="6" y="0" width="12" height="16" fill="#D6D3D1"/>
            {/* Fluting (vertical grooves) */}
            <line x1="8" y1="0" x2="8" y2="16" stroke="#A8A29E" strokeWidth="0.5"/>
            <line x1="10" y1="0" x2="10" y2="16" stroke="#B8B5B1" strokeWidth="0.3"/>
            <line x1="12" y1="0" x2="12" y2="16" stroke="#A8A29E" strokeWidth="0.5"/>
            <line x1="14" y1="0" x2="14" y2="16" stroke="#B8B5B1" strokeWidth="0.3"/>
            <line x1="16" y1="0" x2="16" y2="16" stroke="#A8A29E" strokeWidth="0.5"/>
            {/* Base (Attic base style) */}
            <rect x="4" y="16" width="16" height="2" fill="#E7E5E4"/>
            <rect x="2" y="18" width="20" height="2" fill="#D6D3D1"/>
            <rect x="0" y="20" width="24" height="4" fill="#C4C1BD"/>
            {/* Torus molding */}
            <ellipse cx="12" cy="17" rx="8" ry="1" fill="#E7E5E4"/>
        </g>
    ),

    // TALL PALM - Top portion (∫) - Shows fronds
    '∫': (
        <g>
            {/* Palm fronds - radiating */}
            <path d="M12 20 Q2 12 0 4" stroke="#228B22" strokeWidth="3" fill="none"/>
            <path d="M12 20 Q22 12 24 4" stroke="#228B22" strokeWidth="3" fill="none"/>
            <path d="M12 20 Q4 14 -2 10" stroke="#2E7D32" strokeWidth="2.5" fill="none"/>
            <path d="M12 20 Q20 14 26 10" stroke="#2E7D32" strokeWidth="2.5" fill="none"/>
            <path d="M12 20 Q6 10 2 2" stroke="#388E3C" strokeWidth="2" fill="none"/>
            <path d="M12 20 Q18 10 22 2" stroke="#388E3C" strokeWidth="2" fill="none"/>
            <path d="M12 20 Q10 8 8 0" stroke="#43A047" strokeWidth="2" fill="none"/>
            <path d="M12 20 Q14 8 16 0" stroke="#43A047" strokeWidth="2" fill="none"/>
            {/* Central fronds going up */}
            <path d="M12 20 Q11 6 10 -4" stroke="#4CAF50" strokeWidth="1.5" fill="none"/>
            <path d="M12 20 Q13 6 14 -4" stroke="#4CAF50" strokeWidth="1.5" fill="none"/>
            {/* Coconuts at crown */}
            <circle cx="10" cy="18" r="2" fill="#8B4513"/>
            <circle cx="14" cy="19" r="1.8" fill="#8B4513"/>
            <circle cx="12" cy="17" r="1.5" fill="#795548"/>
        </g>
    ),

    // TALL PALM - Bottom portion (®) - Shows trunk
    '®': (
        <g>
            {/* Shadow */}
            <ellipse cx="14" cy="22" rx="6" ry="2" fill="#000" opacity="0.2"/>
            {/* Trunk - curved and textured */}
            <path d="M10 0 Q8 12 10 24" stroke="#8B7355" strokeWidth="5" fill="none"/>
            <path d="M14 0 Q16 12 14 24" stroke="#8B7355" strokeWidth="5" fill="none"/>
            <path d="M10 0 Q8 12 10 24" stroke="#A08464" strokeWidth="3" fill="none"/>
            <path d="M14 0 Q16 12 14 24" stroke="#A08464" strokeWidth="3" fill="none"/>
            {/* Bark rings */}
            <ellipse cx="12" cy="4" rx="3" ry="1" fill="none" stroke="#6B5344" strokeWidth="0.5"/>
            <ellipse cx="12" cy="8" rx="3.2" ry="1" fill="none" stroke="#6B5344" strokeWidth="0.5"/>
            <ellipse cx="12" cy="12" rx="3.5" ry="1" fill="none" stroke="#6B5344" strokeWidth="0.5"/>
            <ellipse cx="12" cy="16" rx="3.2" ry="1" fill="none" stroke="#6B5344" strokeWidth="0.5"/>
            <ellipse cx="12" cy="20" rx="3" ry="1" fill="none" stroke="#6B5344" strokeWidth="0.5"/>
            {/* Crown base peeking in */}
            <ellipse cx="12" cy="-2" rx="4" ry="2" fill="#5D4037"/>
        </g>
    ),

    // TALL STATUE - Top portion (∂) - Shows figure upper body
    '∂': (
        <g>
            {/* Classical bronze figure - upper body */}
            <ellipse cx="12" cy="18" rx="6" ry="8" fill="#8B7355"/>
            {/* Head */}
            <circle cx="12" cy="6" r="5" fill="#8B7355"/>
            <circle cx="12" cy="5" r="4.5" fill="#9C8566"/>
            {/* Facial features */}
            <ellipse cx="10" cy="4" rx="0.8" ry="0.5" fill="#6B5344"/>
            <ellipse cx="14" cy="4" rx="0.8" ry="0.5" fill="#6B5344"/>
            <path d="M10 7 Q12 8 14 7" stroke="#6B5344" strokeWidth="0.5" fill="none"/>
            {/* Hair/helmet */}
            <path d="M7 3 Q12 -2 17 3" fill="#6B5344"/>
            {/* Arms - outstretched pose */}
            <path d="M6 14 Q0 10 2 4" stroke="#8B7355" strokeWidth="3" fill="none"/>
            <path d="M18 14 Q24 10 22 4" stroke="#8B7355" strokeWidth="3" fill="none"/>
            {/* Hands */}
            <circle cx="2" cy="4" r="1.5" fill="#9C8566"/>
            <circle cx="22" cy="4" r="1.5" fill="#9C8566"/>
            {/* Draping/robe */}
            <path d="M8 20 Q12 16 16 20" fill="#7A6A4A" stroke="#6B5A3A" strokeWidth="0.5"/>
            {/* Highlight */}
            <ellipse cx="10" cy="12" rx="2" ry="3" fill="#A0906A" opacity="0.4"/>
        </g>
    ),

    // TALL STATUE - Bottom portion (™) - Shows pedestal and lower body
    '™': (
        <g>
            {/* Shadow */}
            <ellipse cx="13" cy="22" rx="8" ry="2" fill="#000" opacity="0.2"/>
            {/* Large stone pedestal */}
            <rect x="4" y="12" width="16" height="10" fill="#A8A29E"/>
            <rect x="2" y="20" width="20" height="4" fill="#78716C"/>
            {/* Pedestal inscription plate */}
            <rect x="6" y="14" width="12" height="4" fill="#8B8178"/>
            {/* Lower body/robe draping onto pedestal */}
            <ellipse cx="12" cy="4" rx="5" ry="6" fill="#8B7355"/>
            <path d="M7 8 Q12 12 17 8" fill="#7A6A4A"/>
            {/* Feet */}
            <ellipse cx="9" cy="10" rx="2" ry="1" fill="#9C8566"/>
            <ellipse cx="15" cy="10" rx="2" ry="1" fill="#9C8566"/>
            {/* Pedestal molding */}
            <rect x="3" y="12" width="18" height="1" fill="#B8B5B1"/>
            <rect x="1" y="19" width="22" height="1" fill="#8B8685"/>
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
        } else if (char === 'D') { // Display Case - procedurally generated based on culture
            const nameLower = (zoneName || '').toLowerCase();

            // Use multiple seed-derived values for variety
            const seed2 = (seed * 7.3) % 1;
            const seed3 = (seed * 13.7) % 1;
            const seed4 = (seed * 23.1) % 1;
            const displayVariant = Math.floor(seed * 12); // 12 object variations
            const colorVariant = Math.floor(seed2 * 5);
            const styleVariant = Math.floor(seed3 * 4);

            // Determine if this is a 1-tile or 2-tile wide case (50/50)
            const isWideCase = seed4 > 0.5;

            // Determine culture type
            let cultureType = 'european'; // default
            if (nameLower.includes('china') || nameLower.includes('chinese')) {
                cultureType = 'chinese';
            } else if (nameLower.includes('japan') || nameLower.includes('nippon')) {
                cultureType = 'japanese';
            } else if (nameLower.includes('egypt') || nameLower.includes('egyptian')) {
                cultureType = 'egyptian';
            } else if (nameLower.includes('mexico') || nameLower.includes('aztec') || nameLower.includes('mayan') || nameLower.includes('peru')) {
                cultureType = 'mesoamerican';
            } else if (nameLower.includes('africa') || nameLower.includes('senegal') || nameLower.includes('congo') || nameLower.includes('village')) {
                cultureType = 'african';
            } else if (nameLower.includes('persia') || nameLower.includes('ottoman') || nameLower.includes('arab') || nameLower.includes('morocco') || nameLower.includes('cairo')) {
                cultureType = 'persian';
            } else if (nameLower.includes('india') || nameLower.includes('ceylon') || nameLower.includes('siam')) {
                cultureType = 'indian';
            } else if (nameLower.includes('machine') || nameLower.includes('galerie') || nameLower.includes('industrial')) {
                cultureType = 'industrial';
            } else if (nameLower.includes('france') || nameLower.includes('french') || nameLower.includes('paris')) {
                cultureType = 'french';
            }

            // Velvet lining color based on culture
            const velvetColors: Record<string, string> = {
                chinese: '#8B0000', // Deep red
                japanese: '#4A0E4E', // Deep purple
                egyptian: '#1A1A2E', // Deep blue-black
                mesoamerican: '#0D4D0D', // Forest green
                african: '#4A2C2A', // Brown
                persian: '#1E3A5F', // Persian blue
                indian: '#6B2D5B', // Magenta
                industrial: '#2F2F2F', // Charcoal
                french: '#4A1A2C', // Burgundy
                european: '#4A1A2C', // Burgundy
            };
            const velvetColor = velvetColors[cultureType] || '#4A1A2C';

            // Generate culture-specific objects
            let leftObject: JSX.Element;
            let centerObject: JSX.Element;
            let rightObject: JSX.Element;

            if (cultureType === 'chinese') {
                // Chinese: Porcelain vases, lacquerware, jade
                const vaseVariants = [
                    // Blue and white porcelain vase
                    <g key="vase1">
                        <ellipse cx="10" cy="8" rx="4" ry="6" fill="#F5F5F5"/>
                        <ellipse cx="10" cy="4" rx="2.5" ry="1.5" fill="#E8E8E8"/>
                        <ellipse cx="10" cy="8" rx="3.5" ry="5" fill="#FFFFFF"/>
                        <path d="M7 5 Q10 7 13 5" stroke="#1E40AF" strokeWidth="0.8" fill="none"/>
                        <path d="M7 8 Q10 10 13 8" stroke="#1E40AF" strokeWidth="0.8" fill="none"/>
                        <circle cx="10" cy="6" r="1.5" fill="none" stroke="#1E40AF" strokeWidth="0.5"/>
                        <path d="M8 10 L8 12 M12 10 L12 12" stroke="#1E40AF" strokeWidth="0.5"/>
                    </g>,
                    // Red lacquer box
                    <g key="vase2">
                        <rect x="5" y="6" width="10" height="8" fill="#8B0000" rx="1"/>
                        <rect x="6" y="7" width="8" height="6" fill="#B22222"/>
                        <ellipse cx="10" cy="10" rx="2" ry="1.5" fill="#FFD700" opacity="0.6"/>
                        <rect x="5" y="5" width="10" height="2" fill="#6B0000"/>
                    </g>,
                ];
                const centerVariants = [
                    // Jade bi disc
                    <g key="center1">
                        <circle cx="24" cy="8" r="5" fill="#50C878"/>
                        <circle cx="24" cy="8" r="4" fill="#3CB371"/>
                        <circle cx="24" cy="8" r="2" fill={velvetColor}/>
                        <circle cx="24" cy="8" r="4.5" fill="none" stroke="#228B22" strokeWidth="0.5"/>
                    </g>,
                    // Cloisonné vase
                    <g key="center2">
                        <ellipse cx="24" cy="9" rx="4" ry="5" fill="#1E40AF"/>
                        <ellipse cx="24" cy="5" rx="2" ry="1.5" fill="#1A237E"/>
                        <path d="M20 7 Q24 5 28 7" stroke="#FFD700" strokeWidth="0.5" fill="none"/>
                        <path d="M20 10 Q24 8 28 10" stroke="#FFD700" strokeWidth="0.5" fill="none"/>
                        <circle cx="22" cy="8" r="1" fill="#FF6B6B"/>
                        <circle cx="26" cy="8" r="1" fill="#FF6B6B"/>
                    </g>,
                ];
                const rightVariants = [
                    // Porcelain figurine
                    <g key="right1">
                        <ellipse cx="38" cy="12" rx="3" ry="1" fill="#2F2F2F" opacity="0.3"/>
                        <ellipse cx="38" cy="10" rx="2" ry="4" fill="#F5F5F5"/>
                        <circle cx="38" cy="5" r="2" fill="#FFE4C4"/>
                        <path d="M36 8 L34 10 M40 8 L42 10" stroke="#F5F5F5" strokeWidth="1.5"/>
                        <ellipse cx="38" cy="7" rx="2.5" ry="1" fill="#4169E1"/>
                    </g>,
                    // Tea bowl
                    <g key="right2">
                        <ellipse cx="38" cy="11" rx="4" ry="2" fill="#8FBC8F"/>
                        <ellipse cx="38" cy="10" rx="3.5" ry="1.5" fill="#98D98E"/>
                        <ellipse cx="38" cy="9" rx="3" ry="1" fill="#2F4F2F" opacity="0.3"/>
                    </g>,
                ];
                leftObject = vaseVariants[displayVariant % vaseVariants.length];
                centerObject = centerVariants[displayVariant % centerVariants.length];
                rightObject = rightVariants[displayVariant % rightVariants.length];

            } else if (cultureType === 'japanese') {
                // Japanese: Lacquerware, ceramics, netsuke
                leftObject = (
                    <g>
                        {/* Satsuma vase */}
                        <ellipse cx="10" cy="9" rx="4" ry="5" fill="#F5DEB3"/>
                        <ellipse cx="10" cy="5" rx="2" ry="1.5" fill="#DEB887"/>
                        <path d="M7 7 Q10 5 13 7" stroke="#8B4513" strokeWidth="0.5" fill="none"/>
                        <circle cx="8" cy="9" r="1.5" fill="#FFB6C1"/>
                        <circle cx="12" cy="8" r="1" fill="#FFB6C1"/>
                        <path d="M9 11 Q10 12 11 11" stroke="#228B22" strokeWidth="0.5" fill="none"/>
                    </g>
                );
                centerObject = (
                    <g>
                        {/* Lacquer writing box (suzuribako) */}
                        <rect x="18" y="6" width="12" height="8" fill="#1A1A1A" rx="1"/>
                        <rect x="19" y="7" width="10" height="6" fill="#2F2F2F"/>
                        <path d="M20 9 Q24 7 28 9" stroke="#FFD700" strokeWidth="0.8" fill="none"/>
                        <circle cx="24" cy="11" r="1.5" fill="#FFD700" opacity="0.5"/>
                        <path d="M21 10 L23 12 M25 10 L27 12" stroke="#FFD700" strokeWidth="0.3"/>
                    </g>
                );
                rightObject = (
                    <g>
                        {/* Netsuke carving */}
                        <ellipse cx="38" cy="11" rx="3" ry="2" fill="#F5DEB3"/>
                        <ellipse cx="38" cy="10" rx="2.5" ry="2.5" fill="#FAEBD7"/>
                        <circle cx="37" cy="9" r="0.5" fill="#1A1A1A"/>
                        <circle cx="39" cy="9" r="0.5" fill="#1A1A1A"/>
                        <path d="M37 11 Q38 12 39 11" stroke="#8B4513" strokeWidth="0.3" fill="none"/>
                    </g>
                );

            } else if (cultureType === 'egyptian') {
                // Egyptian: Canopic jars, scarabs, mummy artifacts
                leftObject = (
                    <g>
                        {/* Canopic jar */}
                        <ellipse cx="10" cy="10" rx="3" ry="4" fill="#DAA520"/>
                        <ellipse cx="10" cy="6" rx="2.5" ry="2" fill="#B8860B"/>
                        <ellipse cx="10" cy="4" rx="2" ry="2" fill="#CD853F"/>
                        <circle cx="9" cy="3" r="0.5" fill="#1A1A1A"/>
                        <circle cx="11" cy="3" r="0.5" fill="#1A1A1A"/>
                        <path d="M9 5 L11 5" stroke="#8B4513" strokeWidth="0.5"/>
                    </g>
                );
                centerObject = (
                    <g>
                        {/* Scarab beetle */}
                        <ellipse cx="24" cy="9" rx="4" ry="3" fill="#0D5F5F"/>
                        <ellipse cx="24" cy="8" rx="3" ry="2" fill="#1A8080"/>
                        <circle cx="24" cy="6" r="2" fill="#0D5F5F"/>
                        <path d="M20 10 L22 12 M28 10 L26 12" stroke="#0D5F5F" strokeWidth="1"/>
                        <path d="M22 9 L26 9" stroke="#FFD700" strokeWidth="0.5"/>
                    </g>
                );
                rightObject = (
                    <g>
                        {/* Ushabti figurine */}
                        <rect x="35" y="4" width="6" height="10" fill="#DAA520" rx="1"/>
                        <rect x="36" y="5" width="4" height="8" fill="#F0C060"/>
                        <circle cx="38" cy="3" r="2" fill="#DAA520"/>
                        <rect x="36" cy="2" width="4" height="2" fill="#8B4513"/>
                        <line x1="36" y1="7" x2="40" y2="7" stroke="#8B4513" strokeWidth="0.3"/>
                        <line x1="36" y1="9" x2="40" y2="9" stroke="#8B4513" strokeWidth="0.3"/>
                    </g>
                );

            } else if (cultureType === 'mesoamerican') {
                // Mesoamerican: Gold ornaments, obsidian, jade masks
                leftObject = (
                    <g>
                        {/* Obsidian knife */}
                        <path d="M6 12 L10 4 L14 12 Z" fill="#1A1A1A"/>
                        <path d="M7 11 L10 5 L13 11 Z" fill="#2F2F2F"/>
                        <rect x="8" y="11" width="4" height="3" fill="#8B4513"/>
                        <line x1="10" y1="5" x2="10" y2="11" stroke="#4A4A4A" strokeWidth="0.3"/>
                    </g>
                );
                centerObject = (
                    <g>
                        {/* Gold pectoral */}
                        <circle cx="24" cy="8" r="5" fill="#FFD700"/>
                        <circle cx="24" cy="8" r="4" fill="#DAA520"/>
                        <circle cx="24" cy="8" r="2" fill="#B8860B"/>
                        <path d="M20 6 L24 4 L28 6" stroke="#FFD700" strokeWidth="1" fill="none"/>
                        <circle cx="22" cy="9" r="1" fill="#50C878"/>
                        <circle cx="26" cy="9" r="1" fill="#50C878"/>
                    </g>
                );
                rightObject = (
                    <g>
                        {/* Jade mask fragment */}
                        <ellipse cx="38" cy="8" rx="4" ry="5" fill="#3CB371"/>
                        <ellipse cx="38" cy="7" rx="3" ry="4" fill="#50C878"/>
                        <ellipse cx="36" cy="6" rx="1" ry="1.5" fill="#1A1A1A" opacity="0.5"/>
                        <ellipse cx="40" cy="6" rx="1" ry="1.5" fill="#1A1A1A" opacity="0.5"/>
                        <ellipse cx="38" cy="10" rx="2" ry="1" fill="#228B22"/>
                    </g>
                );

            } else if (cultureType === 'african') {
                // African: Carved figures, masks, ivory
                leftObject = (
                    <g>
                        {/* Carved wooden figure */}
                        <ellipse cx="10" cy="11" rx="2" ry="1" fill="#2F2F2F" opacity="0.3"/>
                        <ellipse cx="10" cy="9" rx="2" ry="4" fill="#4A3728"/>
                        <ellipse cx="10" cy="4" rx="1.5" ry="2.5" fill="#5D4E37"/>
                        <circle cx="9" cy="3" r="0.5" fill="#1A1A1A"/>
                        <circle cx="11" cy="3" r="0.5" fill="#1A1A1A"/>
                        <line x1="8" y1="8" x2="8" y2="10" stroke="#3D2B1F" strokeWidth="0.5"/>
                        <line x1="12" y1="8" x2="12" y2="10" stroke="#3D2B1F" strokeWidth="0.5"/>
                    </g>
                );
                centerObject = (
                    <g>
                        {/* Ceremonial mask */}
                        <ellipse cx="24" cy="8" rx="5" ry="6" fill="#4A3728"/>
                        <ellipse cx="24" cy="7" rx="4" ry="5" fill="#5D4E37"/>
                        <ellipse cx="22" cy="5" rx="1.5" ry="1" fill="#F5F5F5"/>
                        <ellipse cx="26" cy="5" rx="1.5" ry="1" fill="#F5F5F5"/>
                        <circle cx="22" cy="5" r="0.5" fill="#1A1A1A"/>
                        <circle cx="26" cy="5" r="0.5" fill="#1A1A1A"/>
                        <rect x="22" y="8" width="4" height="3" fill="#8B0000"/>
                        <path d="M20 2 L24 0 L28 2" stroke="#CD853F" strokeWidth="1" fill="none"/>
                    </g>
                );
                rightObject = (
                    <g>
                        {/* Ivory tusk carving */}
                        <path d="M35 12 Q38 4 41 12" fill="#FFFFF0"/>
                        <path d="M36 11 Q38 5 40 11" fill="#FAF0E6"/>
                        <line x1="37" y1="7" x2="39" y2="7" stroke="#D2B48C" strokeWidth="0.3"/>
                        <line x1="37" y1="9" x2="39" y2="9" stroke="#D2B48C" strokeWidth="0.3"/>
                    </g>
                );

            } else if (cultureType === 'persian') {
                // Persian: Carpets, metalwork, miniatures
                leftObject = (
                    <g>
                        {/* Silver-inlaid ewer */}
                        <ellipse cx="10" cy="10" rx="3" ry="4" fill="#C0C0C0"/>
                        <ellipse cx="10" cy="7" rx="2" ry="1.5" fill="#D3D3D3"/>
                        <path d="M13 8 Q16 6 14 4" stroke="#C0C0C0" strokeWidth="1.5" fill="none"/>
                        <path d="M7 6 Q4 4 6 2" stroke="#C0C0C0" strokeWidth="1" fill="none"/>
                        <path d="M8 9 Q10 7 12 9" stroke="#1E3A5F" strokeWidth="0.5" fill="none"/>
                        <path d="M8 11 Q10 9 12 11" stroke="#1E3A5F" strokeWidth="0.5" fill="none"/>
                    </g>
                );
                centerObject = (
                    <g>
                        {/* Illuminated manuscript page */}
                        <rect x="18" y="4" width="12" height="10" fill="#F5DEB3"/>
                        <rect x="19" y="5" width="10" height="8" fill="#FAEBD7"/>
                        <rect x="20" y="6" width="3" height="3" fill="#1E3A5F" opacity="0.5"/>
                        <rect x="20" y="6" width="3" height="3" fill="none" stroke="#FFD700" strokeWidth="0.5"/>
                        <line x1="24" y1="7" x2="28" y2="7" stroke="#1A1A1A" strokeWidth="0.3"/>
                        <line x1="24" y1="8" x2="27" y2="8" stroke="#1A1A1A" strokeWidth="0.3"/>
                        <line x1="20" y1="10" x2="28" y2="10" stroke="#1A1A1A" strokeWidth="0.3"/>
                        <line x1="20" y1="11" x2="26" y2="11" stroke="#1A1A1A" strokeWidth="0.3"/>
                    </g>
                );
                rightObject = (
                    <g>
                        {/* Rose water bottle */}
                        <ellipse cx="38" cy="10" rx="3" ry="4" fill="#E6E6FA"/>
                        <ellipse cx="38" cy="6" rx="1" ry="2" fill="#D8BFD8"/>
                        <ellipse cx="38" cy="4" rx="1.5" ry="1" fill="#B8860B"/>
                        <ellipse cx="38" cy="9" rx="2" ry="2.5" fill="#DDA0DD" opacity="0.5"/>
                    </g>
                );

            } else if (cultureType === 'indian') {
                // Indian: Bronze deities, textiles, ivory
                leftObject = (
                    <g>
                        {/* Bronze Shiva Nataraja (simplified) */}
                        <circle cx="10" cy="7" r="5" fill="none" stroke="#B87333" strokeWidth="1"/>
                        <ellipse cx="10" cy="8" rx="2" ry="3" fill="#CD7F32"/>
                        <circle cx="10" cy="5" r="1.5" fill="#B87333"/>
                        <path d="M8 7 L5 5 M12 7 L15 5" stroke="#B87333" strokeWidth="1"/>
                        <path d="M8 10 L6 12 M12 10 L14 12" stroke="#B87333" strokeWidth="1"/>
                    </g>
                );
                centerObject = (
                    <g>
                        {/* Silk textile fragment */}
                        <rect x="18" y="5" width="12" height="9" fill="#FF1493"/>
                        <rect x="19" y="6" width="10" height="7" fill="#FF69B4"/>
                        <path d="M20 8 L28 8 M20 10 L28 10" stroke="#FFD700" strokeWidth="0.8"/>
                        <circle cx="21" cy="9" r="0.8" fill="#FFD700"/>
                        <circle cx="24" cy="9" r="0.8" fill="#FFD700"/>
                        <circle cx="27" cy="9" r="0.8" fill="#FFD700"/>
                    </g>
                );
                rightObject = (
                    <g>
                        {/* Carved ivory box */}
                        <rect x="34" y="7" width="8" height="6" fill="#FFFFF0"/>
                        <rect x="35" y="8" width="6" height="4" fill="#FAF0E6"/>
                        <ellipse cx="38" cy="10" rx="2" ry="1" fill="none" stroke="#D2B48C" strokeWidth="0.5"/>
                        <circle cx="38" cy="7" r="1" fill="#FFD700"/>
                    </g>
                );

            } else if (cultureType === 'industrial') {
                // Industrial: Machinery parts, scientific instruments
                leftObject = (
                    <g>
                        {/* Gear mechanism */}
                        <circle cx="10" cy="8" r="5" fill="#4A5568"/>
                        <circle cx="10" cy="8" r="3" fill="#2D3748"/>
                        <circle cx="10" cy="8" r="1" fill="#1A202C"/>
                        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                            <rect key={i} x="9" y="2" width="2" height="3" fill="#4A5568"
                                  transform={`rotate(${angle} 10 8)`}/>
                        ))}
                    </g>
                );
                centerObject = (
                    <g>
                        {/* Voltmeter/gauge */}
                        <rect x="18" y="4" width="12" height="10" fill="#2D3748" rx="1"/>
                        <rect x="19" y="5" width="10" height="8" fill="#1A202C"/>
                        <circle cx="24" cy="9" r="3" fill="#F7FAFC"/>
                        <path d="M24 9 L24 6" stroke="#E53E3E" strokeWidth="1"/>
                        <circle cx="24" cy="9" r="0.5" fill="#1A202C"/>
                    </g>
                );
                rightObject = (
                    <g>
                        {/* Light bulb */}
                        <ellipse cx="38" cy="7" rx="3" ry="4" fill="#FEFCE8"/>
                        <ellipse cx="38" cy="7" rx="2" ry="3" fill="#FEF9C3" opacity="0.5"/>
                        <rect x="36" y="10" width="4" height="3" fill="#B8860B"/>
                        <path d="M37 6 Q38 4 39 6" stroke="#D97706" strokeWidth="0.5" fill="none"/>
                    </g>
                );

            } else if (cultureType === 'french') {
                // French: Sèvres porcelain, jewelry, decorative arts
                leftObject = (
                    <g>
                        {/* Sèvres vase */}
                        <ellipse cx="10" cy="9" rx="4" ry="5" fill="#1E40AF"/>
                        <ellipse cx="10" cy="5" rx="2.5" ry="1.5" fill="#1E3A8A"/>
                        <ellipse cx="10" cy="9" rx="3" ry="4" fill="#2563EB"/>
                        <path d="M7 7 Q10 5 13 7" stroke="#FFD700" strokeWidth="0.8" fill="none"/>
                        <ellipse cx="10" cy="9" rx="2" ry="2" fill="#FFB6C1" opacity="0.5"/>
                    </g>
                );
                centerObject = (
                    <g>
                        {/* Ormolu clock */}
                        <rect x="19" y="4" width="10" height="10" fill="#FFD700" rx="1"/>
                        <rect x="20" y="5" width="8" height="8" fill="#DAA520"/>
                        <circle cx="24" cy="9" r="3" fill="#FFFFF0"/>
                        <circle cx="24" cy="9" r="2.5" fill="none" stroke="#1A1A1A" strokeWidth="0.3"/>
                        <line x1="24" y1="9" x2="24" y2="7" stroke="#1A1A1A" strokeWidth="0.5"/>
                        <line x1="24" y1="9" x2="26" y2="9" stroke="#1A1A1A" strokeWidth="0.3"/>
                        <path d="M19 3 Q24 1 29 3" fill="#FFD700"/>
                    </g>
                );
                rightObject = (
                    <g>
                        {/* Jewelry box with pearls */}
                        <rect x="34" y="7" width="8" height="5" fill="#8B0000" rx="1"/>
                        <rect x="35" y="8" width="6" height="3" fill="#A52A2A"/>
                        <circle cx="36" cy="9" r="1" fill="#FAF0E6"/>
                        <circle cx="38" cy="9" r="1.2" fill="#FFFAF0"/>
                        <circle cx="40" cy="9" r="1" fill="#FAF0E6"/>
                    </g>
                );

            } else { // Default European
                leftObject = (
                    <g>
                        <ellipse cx="10" cy="8" rx="4" ry="6" fill="#B87333"/>
                        <ellipse cx="10" cy="4" rx="3" ry="2" fill="#CD853F"/>
                        <ellipse cx="10" cy="8" rx="3" ry="4" fill="#D4A574"/>
                    </g>
                );
                centerObject = (
                    <g>
                        <rect x="19" y="5" width="10" height="7" fill="#FFD700"/>
                        <rect x="20" y="6" width="8" height="5" fill="#DAA520"/>
                        <circle cx="24" cy="8" r="2" fill="#FFFFFF" opacity="0.3"/>
                    </g>
                );
                rightObject = (
                    <g>
                        <ellipse cx="38" cy="10" rx="3" ry="1" fill="#2F2F2F"/>
                        <path d="M36 10 L38 3 L40 10" fill="#E8E8E8"/>
                        <circle cx="38" cy="2" r="2" fill="#E8E8E8"/>
                    </g>
                );
            }

            // Randomized cabinet wood colors
            const woodColors = [
                { base: '#5D3A1A', mid: '#8B5A2B', dark: '#4A2511', trim: '#6B4423' },
                { base: '#4A3728', mid: '#6B5344', dark: '#3D2B1F', trim: '#5D4E37' },
                { base: '#2F1810', mid: '#4A2C1A', dark: '#1A0F0A', trim: '#3D261C' },
                { base: '#654321', mid: '#8B6914', dark: '#4A3510', trim: '#7B5B28' },
                { base: '#3C2415', mid: '#5D3A1A', dark: '#2A1A0F', trim: '#4A2C1A' },
            ];
            const wood = woodColors[colorVariant];

            // Randomized brass/frame colors
            const frameColors = [
                { bright: '#DAA520', mid: '#B8860B', dark: '#8B7500' },
                { bright: '#C0C0C0', mid: '#A9A9A9', dark: '#808080' }, // Silver
                { bright: '#B87333', mid: '#A0522D', dark: '#8B4513' }, // Copper
                { bright: '#FFD700', mid: '#DAA520', dark: '#B8860B' }, // Gold
            ];
            const frame = frameColors[styleVariant];

            // Randomized glass tint
            const glassTints = ['#E0F4FF', '#F0F8FF', '#E8F0E8', '#FFF8E7', '#F5F0FF'];
            const glassTint = glassTints[Math.floor(seed2 * glassTints.length)];

            // Reflection position variation
            const reflectX = 2 + Math.floor(seed * 6);
            const reflectY = 1 + Math.floor(seed2 * 4);

            if (isWideCase) {
                // 2-TILE WIDE DISPLAY CASE
                objectContent = (
                    <g>
                        {/* Shadow - spans 2 tiles */}
                        <ellipse cx="24" cy="22" rx="22" ry="3" fill="#000" opacity="0.15"/>

                        {/* === BASE CABINET - ornate wooden base === */}
                        <rect x="0" y="16" width="48" height="8" fill={wood.base}/>
                        <rect x="1" y="17" width="46" height="6" fill={wood.mid}/>
                        <rect x="2" y="20" width="4" height="4" fill={wood.dark}/>
                        <rect x="42" y="20" width="4" height="4" fill={wood.dark}/>
                        <rect x="22" y="20" width="4" height="4" fill={wood.dark}/>
                        <rect x="0" y="15" width="48" height="2" fill={wood.trim}/>
                        <path d="M0 15 Q12 13 24 15 Q36 13 48 15" stroke={frame.mid} strokeWidth="0.5" fill="none"/>

                        {/* === GLASS DISPLAY SECTION === */}
                        <rect x="1" y="0" width="46" height="16" fill="#1A1A1A"/>
                        <rect x="2" y="1" width="44" height="14" fill={glassTint} opacity="0.85"/>

                        {/* Brass/gilded frame */}
                        <rect x="0" y="-1" width="48" height="2" fill={frame.mid}/>
                        <rect x="0" y="14" width="48" height="2" fill={frame.mid}/>
                        <rect x="0" y="0" width="2" height="16" fill={frame.bright}/>
                        <rect x="46" y="0" width="2" height="16" fill={frame.dark}/>
                        <rect x="23" y="0" width="2" height="16" fill={frame.mid}/>

                        {/* Glass reflections - varied position */}
                        <path d={`M${reflectX} ${reflectY} L${reflectX+4} ${reflectY+4} L${reflectX+2} ${reflectY+6} L${reflectX-2} ${reflectY+2} Z`} fill="#FFFFFF" opacity="0.3"/>
                        <path d={`M${26+reflectX} ${reflectY+1} L${30+reflectX} ${reflectY+5} L${28+reflectX} ${reflectY+7} L${24+reflectX} ${reflectY+3} Z`} fill="#FFFFFF" opacity="0.25"/>

                        {/* Cultural velvet lining */}
                        <rect x="3" y="10" width="42" height="4" fill={velvetColor}/>

                        {/* Procedurally generated objects based on culture */}
                        {leftObject}
                        {centerObject}
                        {rightObject}

                        {/* Brass label plate */}
                        <rect x="18" y="18" width="12" height="3" fill={frame.mid}/>
                        <rect x="19" y="19" width="10" height="1" fill={frame.dark}/>

                        {/* Decorative corner ornaments */}
                        <circle cx="2" cy="0" r="2" fill={frame.bright}/>
                        <circle cx="46" cy="0" r="2" fill={frame.mid}/>
                        <circle cx="2" cy="14" r="2" fill={frame.mid}/>
                        <circle cx="46" cy="14" r="2" fill={frame.dark}/>
                    </g>
                );
            } else {
                // 1-TILE NARROW DISPLAY CASE (pedestal style)
                // Use centerObject only, scaled to fit single tile
                objectContent = (
                    <g>
                        {/* Shadow */}
                        <ellipse cx="12" cy="22" rx="10" ry="2" fill="#000" opacity="0.15"/>

                        {/* === PEDESTAL BASE === */}
                        <rect x="2" y="18" width="20" height="6" fill={wood.base}/>
                        <rect x="3" y="19" width="18" height="4" fill={wood.mid}/>
                        <rect x="4" y="21" width="3" height="3" fill={wood.dark}/>
                        <rect x="17" y="21" width="3" height="3" fill={wood.dark}/>
                        <rect x="2" y="17" width="20" height="2" fill={wood.trim}/>

                        {/* === GLASS DOME/CASE === */}
                        <ellipse cx="12" cy="10" rx="9" ry="8" fill="#1A1A1A"/>
                        <ellipse cx="12" cy="10" rx="8" ry="7" fill={glassTint} opacity="0.85"/>

                        {/* Frame ring */}
                        <ellipse cx="12" cy="17" rx="9" ry="2" fill={frame.mid}/>
                        <ellipse cx="12" cy="17" rx="8" ry="1.5" fill={frame.dark}/>

                        {/* Glass reflection */}
                        <ellipse cx={8 + reflectX * 0.3} cy={6 + reflectY * 0.3} rx="2" ry="3" fill="#FFFFFF" opacity="0.25" transform={`rotate(-20 ${8 + reflectX * 0.3} ${6 + reflectY * 0.3})`}/>

                        {/* Velvet base inside */}
                        <ellipse cx="12" cy="14" rx="6" ry="2" fill={velvetColor}/>

                        {/* Single centered object - scaled down version */}
                        <g transform="translate(-12, 0) scale(0.5)">
                            {centerObject}
                        </g>

                        {/* Brass label plate */}
                        <rect x="6" y="20" width="12" height="2" fill={frame.mid}/>
                        <rect x="7" y="20.5" width="10" height="1" fill={frame.dark}/>

                        {/* Top ornament */}
                        <circle cx="12" cy="2" r="1.5" fill={frame.bright}/>
                    </g>
                );
            }
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
        } else if (char === 'u') { // Statue - varies by zone, material, and content
            const nameLower = (zoneName || '').toLowerCase();
            // Use seed for deterministic variety within same zone
            const statueVariant = Math.floor(seed * 8); // 8 different statue styles

            // Determine material based on zone
            let material = { primary: '#E7E5E4', secondary: '#D6D3D1', highlight: '#F5F5F4', shadow: '#A8A29E' }; // Default: white marble
            let statueType = 'classical'; // classical, asian, egyptian, african, mechanical, equestrian, allegorical, bust

            // Zone-based material and style selection
            if (nameLower.includes('japan') || nameLower.includes('nippon')) {
                material = { primary: '#B87333', secondary: '#8B5A2B', highlight: '#CD853F', shadow: '#5D3A1A' }; // Bronze
                statueType = 'asian';
            } else if (nameLower.includes('china') || nameLower.includes('chinese')) {
                material = { primary: '#50C878', secondary: '#3CB371', highlight: '#90EE90', shadow: '#228B22' }; // Jade
                statueType = 'asian';
            } else if (nameLower.includes('egypt') || nameLower.includes('egyptian')) {
                material = { primary: '#2F2F2F', secondary: '#1A1A1A', highlight: '#4A4A4A', shadow: '#0A0A0A' }; // Black basalt
                statueType = 'egyptian';
            } else if (nameLower.includes('africa') || nameLower.includes('village') || nameLower.includes('senegal') || nameLower.includes('congo')) {
                material = { primary: '#4A3728', secondary: '#3D2B1F', highlight: '#5D4E37', shadow: '#2A1F14' }; // Dark wood
                statueType = 'african';
            } else if (nameLower.includes('mexico') || nameLower.includes('aztec') || nameLower.includes('mayan')) {
                material = { primary: '#2C2C2C', secondary: '#1A1A1A', highlight: '#3D3D3D', shadow: '#0D0D0D' }; // Obsidian
                statueType = 'mesoamerican';
            } else if (nameLower.includes('galerie') || nameLower.includes('machine') || nameLower.includes('industrial')) {
                material = { primary: '#71797E', secondary: '#555F61', highlight: '#9CA3AF', shadow: '#3D4447' }; // Iron/steel
                statueType = 'mechanical';
            } else if (nameLower.includes('argentina') || nameLower.includes('gaucho') || nameLower.includes('equestrian')) {
                material = { primary: '#B87333', secondary: '#8B5A2B', highlight: '#CD853F', shadow: '#5D3A1A' }; // Bronze
                statueType = 'equestrian';
            } else if (nameLower.includes('persia') || nameLower.includes('persian') || nameLower.includes('ottoman')) {
                material = { primary: '#B8860B', secondary: '#8B6914', highlight: '#DAA520', shadow: '#6B4E0A' }; // Gilded bronze
                statueType = 'persian';
            } else if (statueVariant < 2) {
                material = { primary: '#B87333', secondary: '#8B5A2B', highlight: '#CD853F', shadow: '#5D3A1A' }; // Bronze
            } else if (statueVariant < 3) {
                material = { primary: '#2F2F2F', secondary: '#1A1A1A', highlight: '#4A4A4A', shadow: '#0A0A0A' }; // Dark stone
            } else if (statueVariant < 4) {
                material = { primary: '#F5F5DC', secondary: '#E8E4C9', highlight: '#FFFEF0', shadow: '#C4BEA0' }; // Ivory/cream marble
            }

            // Vary statue type based on seed for non-cultural zones
            if (statueType === 'classical') {
                const types = ['classical', 'allegorical', 'bust', 'equestrian'];
                statueType = types[statueVariant % types.length];
            }

            // Generate statue based on type
            if (statueType === 'asian') {
                objectContent = (
                    <g>
                        {/* Shadow */}
                        <ellipse cx="12" cy="22" rx="7" ry="2" fill="#000" opacity="0.2"/>
                        {/* Lotus pedestal */}
                        <ellipse cx="12" cy="20" rx="8" ry="3" fill={material.shadow}/>
                        <ellipse cx="12" cy="19" rx="7" ry="2.5" fill={material.secondary}/>
                        {/* Lotus petal details */}
                        <path d="M5 19 Q6 17 7 19" stroke={material.highlight} strokeWidth="0.5" fill="none"/>
                        <path d="M9 18 Q10 16 11 18" stroke={material.highlight} strokeWidth="0.5" fill="none"/>
                        <path d="M13 18 Q14 16 15 18" stroke={material.highlight} strokeWidth="0.5" fill="none"/>
                        <path d="M17 19 Q18 17 19 19" stroke={material.highlight} strokeWidth="0.5" fill="none"/>
                        {/* Buddha/deity seated figure */}
                        <ellipse cx="12" cy="10" rx="6" ry="8" fill={material.primary}/>
                        <ellipse cx="12" cy="8" rx="5" ry="6" fill={material.secondary}/>
                        {/* Head - above tile */}
                        <circle cx="12" cy="-2" r="4" fill={material.primary}/>
                        <circle cx="12" cy="-3" r="3.5" fill={material.secondary}/>
                        {/* Ushnisha (wisdom bump) */}
                        <ellipse cx="12" cy="-7" rx="2" ry="2.5" fill={material.primary}/>
                        {/* Serene face */}
                        <path d="M10 -3 Q12 -1 14 -3" stroke={material.shadow} strokeWidth="0.5" fill="none"/>
                        <ellipse cx="10" cy="-4" rx="0.8" ry="0.3" fill={material.shadow}/>
                        <ellipse cx="14" cy="-4" rx="0.8" ry="0.3" fill={material.shadow}/>
                        {/* Mudra hands */}
                        <circle cx="8" cy="8" r="2" fill={material.highlight}/>
                        <circle cx="16" cy="8" r="2" fill={material.highlight}/>
                        {/* Robe folds */}
                        <path d="M6 14 Q12 12 18 14" stroke={material.shadow} strokeWidth="0.8" fill="none"/>
                        <path d="M7 16 Q12 14 17 16" stroke={material.shadow} strokeWidth="0.6" fill="none"/>
                    </g>
                );
            } else if (statueType === 'egyptian') {
                objectContent = (
                    <g>
                        {/* Shadow */}
                        <ellipse cx="12" cy="22" rx="7" ry="2" fill="#000" opacity="0.2"/>
                        {/* Rectangular base */}
                        <rect x="3" y="18" width="18" height="6" fill={material.shadow}/>
                        <rect x="4" y="17" width="16" height="2" fill={material.secondary}/>
                        {/* Hieroglyph decorations on base */}
                        <rect x="5" y="20" width="2" height="3" fill="#C09300" opacity="0.6"/>
                        <circle cx="9" cy="21" r="1" fill="#C09300" opacity="0.6"/>
                        <rect x="12" y="20" width="3" height="2" fill="#C09300" opacity="0.6"/>
                        <path d="M17 20 L19 22 L17 22 Z" fill="#C09300" opacity="0.6"/>
                        {/* Pharaoh/deity figure - rigid pose */}
                        <rect x="7" y="4" width="10" height="14" fill={material.primary}/>
                        <rect x="8" y="5" width="8" height="12" fill={material.secondary}/>
                        {/* Head with nemes headdress - extends above */}
                        <rect x="6" y="-10" width="12" height="14" fill={material.primary}/>
                        <rect x="7" y="-9" width="10" height="12" fill={material.secondary}/>
                        {/* Nemes stripes */}
                        <line x1="7" y1="-8" x2="17" y2="-8" stroke="#C09300" strokeWidth="0.5"/>
                        <line x1="7" y1="-5" x2="17" y2="-5" stroke="#C09300" strokeWidth="0.5"/>
                        <line x1="7" y1="-2" x2="17" y2="-2" stroke="#C09300" strokeWidth="0.5"/>
                        {/* Face */}
                        <ellipse cx="12" cy="-4" rx="3" ry="4" fill={material.highlight}/>
                        <ellipse cx="10.5" cy="-5" rx="0.8" ry="0.4" fill="#1A1A1A"/>
                        <ellipse cx="13.5" cy="-5" rx="0.8" ry="0.4" fill="#1A1A1A"/>
                        {/* Crossed arms with crook and flail */}
                        <path d="M8 6 L10 10 L8 14" stroke={material.highlight} strokeWidth="2" fill="none"/>
                        <path d="M16 6 L14 10 L16 14" stroke={material.highlight} strokeWidth="2" fill="none"/>
                        {/* Crook */}
                        <path d="M7 4 Q5 2 7 0" stroke="#C09300" strokeWidth="1.5" fill="none"/>
                        {/* Flail */}
                        <line x1="17" y1="4" x2="19" y2="2" stroke="#C09300" strokeWidth="1"/>
                        <line x1="19" y1="2" x2="19" y2="0" stroke="#C09300" strokeWidth="1"/>
                    </g>
                );
            } else if (statueType === 'african') {
                objectContent = (
                    <g>
                        {/* Shadow */}
                        <ellipse cx="12" cy="22" rx="6" ry="2" fill="#000" opacity="0.2"/>
                        {/* Carved wooden base */}
                        <ellipse cx="12" cy="20" rx="6" ry="3" fill={material.shadow}/>
                        <ellipse cx="12" cy="19" rx="5" ry="2" fill={material.secondary}/>
                        {/* Geometric carving on base */}
                        <path d="M7 19 L9 17 L11 19" stroke={material.highlight} strokeWidth="0.5" fill="none"/>
                        <path d="M13 19 L15 17 L17 19" stroke={material.highlight} strokeWidth="0.5" fill="none"/>
                        {/* Elongated carved figure */}
                        <ellipse cx="12" cy="10" rx="4" ry="9" fill={material.primary}/>
                        <ellipse cx="12" cy="9" rx="3" ry="7" fill={material.secondary}/>
                        {/* Elongated head - characteristic style */}
                        <ellipse cx="12" cy="-4" rx="3" ry="6" fill={material.primary}/>
                        <ellipse cx="12" cy="-5" rx="2.5" ry="5" fill={material.secondary}/>
                        {/* Stylized facial features */}
                        <ellipse cx="10" cy="-5" rx="0.8" ry="1.2" fill={material.shadow}/>
                        <ellipse cx="14" cy="-5" rx="0.8" ry="1.2" fill={material.shadow}/>
                        <rect x="11" y="-3" width="2" height="3" fill={material.shadow}/>
                        <ellipse cx="12" cy="0" rx="2" ry="0.8" fill={material.shadow}/>
                        {/* Scarification/decoration patterns */}
                        <line x1="9" y1="6" x2="9" y2="12" stroke={material.highlight} strokeWidth="0.5"/>
                        <line x1="15" y1="6" x2="15" y2="12" stroke={material.highlight} strokeWidth="0.5"/>
                        <circle cx="12" cy="8" r="1.5" fill="none" stroke={material.highlight} strokeWidth="0.5"/>
                        {/* Headdress/crown */}
                        <path d="M9 -10 L12 -14 L15 -10" fill={material.primary}/>
                    </g>
                );
            } else if (statueType === 'mesoamerican') {
                objectContent = (
                    <g>
                        {/* Shadow */}
                        <ellipse cx="12" cy="22" rx="7" ry="2" fill="#000" opacity="0.2"/>
                        {/* Stepped pyramid base */}
                        <rect x="2" y="20" width="20" height="4" fill={material.shadow}/>
                        <rect x="4" y="17" width="16" height="4" fill={material.primary}/>
                        <rect x="6" y="14" width="12" height="4" fill={material.secondary}/>
                        {/* Aztec/Mayan deity figure */}
                        <rect x="7" y="4" width="10" height="11" fill={material.primary}/>
                        <rect x="8" y="5" width="8" height="9" fill={material.secondary}/>
                        {/* Elaborate headdress - extends above */}
                        <path d="M4 -2 L12 -12 L20 -2" fill={material.primary}/>
                        <path d="M6 -1 L12 -10 L18 -1" fill={material.secondary}/>
                        {/* Feather details */}
                        <path d="M8 -6 L6 -10" stroke="#228B22" strokeWidth="1"/>
                        <path d="M10 -8 L9 -12" stroke="#FF4500" strokeWidth="1"/>
                        <path d="M14 -8 L15 -12" stroke="#FF4500" strokeWidth="1"/>
                        <path d="M16 -6 L18 -10" stroke="#228B22" strokeWidth="1"/>
                        {/* Square head */}
                        <rect x="8" y="-2" width="8" height="6" fill={material.primary}/>
                        {/* Fierce face */}
                        <rect x="9" cy="0" width="2" height="2" fill="#FFFFFF"/>
                        <rect x="13" cy="0" width="2" height="2" fill="#FFFFFF"/>
                        <rect x="10" y="2" width="4" height="2" fill={material.shadow}/>
                        {/* Jade/gold decorations */}
                        <circle cx="12" cy="7" r="2" fill="#50C878"/>
                        <rect x="5" y="8" width="2" height="4" fill="#FFD700"/>
                        <rect x="17" y="8" width="2" height="4" fill="#FFD700"/>
                    </g>
                );
            } else if (statueType === 'equestrian') {
                objectContent = (
                    <g>
                        {/* Shadow - larger for horse */}
                        <ellipse cx="12" cy="22" rx="10" ry="3" fill="#000" opacity="0.2"/>
                        {/* Rectangular plinth */}
                        <rect x="1" y="18" width="22" height="6" fill={material.shadow}/>
                        <rect x="2" y="17" width="20" height="2" fill={material.secondary}/>
                        {/* Horse body */}
                        <ellipse cx="12" cy="12" rx="9" ry="5" fill={material.primary}/>
                        <ellipse cx="12" cy="11" rx="8" ry="4" fill={material.secondary}/>
                        {/* Horse legs */}
                        <rect x="4" y="14" width="2" height="5" fill={material.primary}/>
                        <rect x="8" y="14" width="2" height="5" fill={material.shadow}/>
                        <rect x="14" y="14" width="2" height="5" fill={material.shadow}/>
                        <rect x="18" y="14" width="2" height="5" fill={material.primary}/>
                        {/* Horse neck and head */}
                        <path d="M18 10 Q22 6 20 2" stroke={material.primary} strokeWidth="4" fill="none"/>
                        <ellipse cx="21" cy="1" rx="3" ry="2" fill={material.secondary}/>
                        {/* Rider - extends above */}
                        <ellipse cx="12" cy="4" rx="3" ry="5" fill={material.primary}/>
                        {/* Rider head */}
                        <circle cx="12" cy="-4" r="3" fill={material.secondary}/>
                        {/* Hat/helmet */}
                        <ellipse cx="12" cy="-6" rx="4" ry="2" fill={material.primary}/>
                        {/* Sword/saber */}
                        <line x1="16" y1="2" x2="20" y2="-2" stroke={material.highlight} strokeWidth="1"/>
                    </g>
                );
            } else if (statueType === 'bust') {
                objectContent = (
                    <g>
                        {/* Shadow */}
                        <ellipse cx="12" cy="22" rx="6" ry="2" fill="#000" opacity="0.2"/>
                        {/* Ornate socle/pedestal */}
                        <rect x="4" y="16" width="16" height="8" fill={material.shadow}/>
                        <rect x="5" y="14" width="14" height="3" fill={material.primary}/>
                        <rect x="6" y="12" width="12" height="3" fill={material.secondary}/>
                        {/* Decorative molding */}
                        <path d="M5 14 Q12 12 19 14" stroke={material.highlight} strokeWidth="0.5" fill="none"/>
                        {/* Bust - shoulders */}
                        <ellipse cx="12" cy="8" rx="6" ry="4" fill={material.primary}/>
                        <path d="M6 10 L6 6 Q12 4 18 6 L18 10" fill={material.secondary}/>
                        {/* Neck */}
                        <rect x="10" y="2" width="4" height="5" fill={material.primary}/>
                        {/* Head */}
                        <ellipse cx="12" cy="-2" rx="5" ry="6" fill={material.primary}/>
                        <ellipse cx="12" cy="-3" rx="4.5" ry="5" fill={material.secondary}/>
                        {/* Hair */}
                        <path d="M7 -6 Q12 -10 17 -6" fill={material.shadow}/>
                        {/* Face */}
                        <ellipse cx="10" cy="-3" rx="0.6" ry="0.3" fill={material.shadow}/>
                        <ellipse cx="14" cy="-3" rx="0.6" ry="0.3" fill={material.shadow}/>
                        <ellipse cx="12" cy="-1" rx="1" ry="0.5" fill={material.shadow}/>
                        <path d="M10 0 Q12 2 14 0" stroke={material.shadow} strokeWidth="0.5" fill="none"/>
                    </g>
                );
            } else if (statueType === 'allegorical') {
                objectContent = (
                    <g>
                        {/* Shadow */}
                        <ellipse cx="12" cy="22" rx="8" ry="2" fill="#000" opacity="0.2"/>
                        {/* Classical pedestal */}
                        <rect x="3" y="18" width="18" height="6" fill={material.shadow}/>
                        <rect x="4" y="16" width="16" height="3" fill={material.primary}/>
                        <rect x="5" y="14" width="14" height="3" fill={material.secondary}/>
                        {/* Female allegorical figure - flowing robes */}
                        <path d="M8 14 Q6 8 8 4 Q12 2 16 4 Q18 8 16 14 Z" fill={material.primary}/>
                        <path d="M9 13 Q7 8 9 5 Q12 3 15 5 Q17 8 15 13 Z" fill={material.secondary}/>
                        {/* Draped fabric detail */}
                        <path d="M7 10 Q9 8 11 10" stroke={material.shadow} strokeWidth="0.5" fill="none"/>
                        <path d="M13 10 Q15 8 17 10" stroke={material.shadow} strokeWidth="0.5" fill="none"/>
                        {/* Head with classical hairstyle */}
                        <ellipse cx="12" cy="-2" rx="4" ry="5" fill={material.primary}/>
                        <ellipse cx="12" cy="-3" rx="3.5" ry="4" fill={material.secondary}/>
                        {/* Crown/laurel wreath */}
                        <ellipse cx="12" cy="-7" rx="4" ry="1.5" fill="#228B22" opacity="0.7"/>
                        {/* Elegant face */}
                        <ellipse cx="10.5" cy="-3" rx="0.5" ry="0.3" fill={material.shadow}/>
                        <ellipse cx="13.5" cy="-3" rx="0.5" ry="0.3" fill={material.shadow}/>
                        <path d="M10 -1 Q12 1 14 -1" stroke={material.shadow} strokeWidth="0.4" fill="none"/>
                        {/* Upraised arm with torch/palm */}
                        <path d="M16 4 Q20 -2 18 -8" stroke={material.primary} strokeWidth="2" fill="none"/>
                        <ellipse cx="18" cy="-10" rx="2" ry="3" fill="#FFD700"/>
                        {/* Lowered arm with book/tablet */}
                        <rect x="4" y="6" width="4" height="6" fill={material.shadow}/>
                    </g>
                );
            } else if (statueType === 'persian') {
                objectContent = (
                    <g>
                        {/* Shadow */}
                        <ellipse cx="12" cy="22" rx="7" ry="2" fill="#000" opacity="0.2"/>
                        {/* Ornate Persian base */}
                        <rect x="3" y="18" width="18" height="6" fill={material.shadow}/>
                        <rect x="4" y="16" width="16" height="3" fill={material.primary}/>
                        {/* Arabesque patterns on base */}
                        <path d="M6 19 Q8 17 10 19 Q12 17 14 19 Q16 17 18 19" stroke={material.highlight} strokeWidth="0.5" fill="none"/>
                        {/* Lion figure */}
                        <ellipse cx="12" cy="10" rx="7" ry="5" fill={material.primary}/>
                        <ellipse cx="12" cy="9" rx="6" ry="4" fill={material.secondary}/>
                        {/* Mane */}
                        <ellipse cx="12" cy="4" rx="5" ry="4" fill={material.primary}/>
                        {/* Lion head */}
                        <circle cx="12" cy="0" r="4" fill={material.secondary}/>
                        <circle cx="12" cy="-1" r="3" fill={material.highlight}/>
                        {/* Face */}
                        <circle cx="10" cy="-1" r="0.8" fill={material.shadow}/>
                        <circle cx="14" cy="-1" r="0.8" fill={material.shadow}/>
                        <ellipse cx="12" cy="1" rx="1.5" ry="1" fill={material.shadow}/>
                        {/* Legs */}
                        <rect x="5" y="12" width="3" height="6" fill={material.primary}/>
                        <rect x="16" y="12" width="3" height="6" fill={material.primary}/>
                        {/* Tail */}
                        <path d="M18 10 Q22 8 20 4" stroke={material.primary} strokeWidth="2" fill="none"/>
                    </g>
                );
            } else { // Default classical
                objectContent = (
                    <g>
                        {/* Shadow */}
                        <ellipse cx="13" cy="22" rx="7" ry="2" fill="#000" opacity="0.2"/>
                        {/* Large stone pedestal */}
                        <rect x="2" y="18" width="20" height="6" fill={material.shadow}/>
                        <rect x="4" y="14" width="16" height="5" fill={material.primary}/>
                        <rect x="3" y="13" width="18" height="2" fill={material.secondary}/>
                        {/* Inscription plate */}
                        <rect x="6" y="20" width="12" height="3" fill={material.shadow}/>
                        {/* Classical figure - torso extends above tile */}
                        <ellipse cx="12" cy="6" rx="5" ry="8" fill={material.primary}/>
                        <ellipse cx="12" cy="4" rx="4.5" ry="7" fill={material.secondary}/>
                        {/* Head - above tile */}
                        <circle cx="12" cy="-6" r="4" fill={material.primary}/>
                        <circle cx="12" cy="-7" r="3.5" fill={material.secondary}/>
                        {/* Neck */}
                        <rect x="10" y="-2" width="4" height="4" fill={material.primary}/>
                        {/* Arms - outstretched */}
                        <path d="M7 4 Q2 0 4 -6" stroke={material.primary} strokeWidth="3" fill="none"/>
                        <path d="M17 4 Q22 0 20 -6" stroke={material.primary} strokeWidth="3" fill="none"/>
                        {/* Hands */}
                        <circle cx="4" cy="-6" r="1.5" fill={material.secondary}/>
                        <circle cx="20" cy="-6" r="1.5" fill={material.secondary}/>
                        {/* Draping/robe */}
                        <path d="M7 10 Q12 8 17 10 L16 14 Q12 12 8 14 Z" fill={material.highlight}/>
                        {/* Facial features (subtle) */}
                        <ellipse cx="11" cy="-8" rx="0.5" ry="0.3" fill={material.shadow}/>
                        <ellipse cx="13" cy="-8" rx="0.5" ry="0.3" fill={material.shadow}/>
                        {/* Hair/crown */}
                        <path d="M8 -10 Q12 -14 16 -10" fill={material.highlight}/>
                    </g>
                );
            }
        }

        if (!objectContent) return null;

        // Objects that should NOT have additional shadow (already have built-in or are flat)
        const noShadowObjects = new Set(['n', 'p', 'w', 'r', 'f', 'a', 'u', 'D', 'Ŋ']); // newspaper, puddle, flowerbed, carpet, fountain edge, cushion, statues, display cases, aquarium
        const needsShadow = !noShadowObjects.has(char);

        // Multi-tile structures that extend beyond their tile bounds
        const multiTileStructures = new Set(['K', 'N', 'Q', '≡', 'D', 'Ŋ']); // Kiosk, Ticket booth, Guard post, Wide bench, Display case, Aquarium
        const isMultiTile = multiTileStructures.has(char);

        return (
            <div className={`absolute pointer-events-none ${isMultiTile ? 'overflow-visible' : 'inset-0'}`}
                 style={isMultiTile ? { top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' } : undefined}>
                <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible" style={isMultiTile ? { overflow: 'visible' } : undefined}>
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
