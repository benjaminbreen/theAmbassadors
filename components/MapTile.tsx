
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

    // --- BIOME FLOOR TEXTURES (Evocative, sense of place) ---
    if (char === '.' || char === ':' || char === '+' || char === 'b' || char === 'n' || char === 'L' || char === 'G') {
        if (biome === 'SALON') {
            // Elegant parquet flooring with warm wood tones
            bgPattern = (
                <g>
                    <rect x="0" y="0" width="24" height="24" fill="#8B7355"/>
                    <g opacity="0.3">
                        {/* Herringbone pattern */}
                        <path d="M0 0 L6 6 L0 12 M6 6 L12 0 L18 6 L12 12 L6 6 M12 12 L18 6 L24 12 M12 12 L18 18 L12 24 M18 18 L24 12 L24 24"
                              stroke="#5D4E37" strokeWidth="1" fill="none"/>
                        <path d="M0 12 L6 18 L0 24 M6 18 L12 12 M6 18 L12 24" stroke="#5D4E37" strokeWidth="1" fill="none"/>
                    </g>
                    {/* Wood grain highlight */}
                    <line x1={2 + seed * 4} y1="0" x2={2 + seed * 4} y2="24" stroke="#A08060" strokeWidth="0.3" opacity="0.4"/>
                </g>
            );
        } else if (biome === 'STREET') {
            // Parisian cobblestones with variation
            bgPattern = (
                <g>
                    <rect x="0" y="0" width="24" height="24" fill="#706050"/>
                    <g opacity="0.5">
                        {/* Irregular cobbles */}
                        <rect x="1" y="1" width="5" height="4" rx="1" fill="#605040"/>
                        <rect x="7" y="0" width="6" height="5" rx="1" fill="#585048"/>
                        <rect x="14" y="1" width="5" height="4" rx="1" fill="#686058"/>
                        <rect x="20" y="0" width="4" height="5" rx="1" fill="#605040"/>
                        <rect x="0" y="6" width="4" height="5" rx="1" fill="#585048"/>
                        <rect x="5" y="5" width="6" height="6" rx="1" fill="#686058"/>
                        <rect x="12" y="6" width="5" height="5" rx="1" fill="#605040"/>
                        <rect x="18" y="5" width="6" height="6" rx="1" fill="#585048"/>
                        <rect x="1" y="12" width="5" height="5" rx="1" fill="#686058"/>
                        <rect x="7" y="11" width="6" height="6" rx="1" fill="#605040"/>
                        <rect x="14" y="12" width="5" height="5" rx="1" fill="#585048"/>
                        <rect x="20" y="11" width="4" height="6" rx="1" fill="#686058"/>
                        <rect x="0" y="18" width="4" height="6" rx="1" fill="#605040"/>
                        <rect x="5" y="17" width="6" height="7" rx="1" fill="#585048"/>
                        <rect x="12" y="18" width="5" height="6" rx="1" fill="#686058"/>
                        <rect x="18" y="17" width="6" height="7" rx="1" fill="#605040"/>
                    </g>
                    {/* Wet highlight */}
                    {seed > 0.7 && <circle cx={12 + seed * 6} cy={12 + seed * 6} r="3" fill="#9090A0" opacity="0.15"/>}
                </g>
            );
        } else if (biome === 'GARDEN') {
            // Already handled by grass tiles, but paths should be gravel
            bgPattern = (
                <g>
                    <rect x="0" y="0" width="24" height="24" fill="#90A060"/>
                    <g opacity="0.4">
                        <path d={`M${3 + seed * 3} 22 Q${4 + seed * 2} ${14 + seed * 4} ${5 + seed} 22`} stroke="#507030" strokeWidth="1" fill="none"/>
                        <path d={`M${9 + seed * 3} 24 Q${10 + seed * 2} ${16 + seed * 4} ${11 + seed} 24`} stroke="#608040" strokeWidth="1" fill="none"/>
                        <path d={`M${15 + seed * 3} 22 Q${16 + seed * 2} ${15 + seed * 3} ${17 + seed} 22`} stroke="#507030" strokeWidth="1" fill="none"/>
                        <path d={`M${20 + seed * 2} 24 Q${21 + seed} ${17 + seed * 3} ${22} 24`} stroke="#608040" strokeWidth="1" fill="none"/>
                    </g>
                </g>
            );
        } else if (biome === 'GRAND_HALL') {
            // Industrial iron floor plates with rivets - like Gallery of Machines
            bgPattern = (
                <g>
                    {/* Dark iron base */}
                    <rect x="0" y="0" width="24" height="24" fill="#4A5568"/>
                    {/* Diamond plate texture */}
                    <g opacity="0.4">
                        <path d="M6 0 L12 6 L6 12 L0 6 Z" fill="#5A6578" stroke="#3A4558" strokeWidth="0.5"/>
                        <path d="M18 0 L24 6 L18 12 L12 6 Z" fill="#5A6578" stroke="#3A4558" strokeWidth="0.5"/>
                        <path d="M6 12 L12 18 L6 24 L0 18 Z" fill="#5A6578" stroke="#3A4558" strokeWidth="0.5"/>
                        <path d="M18 12 L24 18 L18 24 L12 18 Z" fill="#5A6578" stroke="#3A4558" strokeWidth="0.5"/>
                        <path d="M12 6 L18 12 L12 18 L6 12 Z" fill="#4A5568" stroke="#3A4558" strokeWidth="0.5"/>
                    </g>
                    {/* Rivets */}
                    <circle cx="3" cy="3" r="1.5" fill="#3A4558"/>
                    <circle cx="21" cy="3" r="1.5" fill="#3A4558"/>
                    <circle cx="3" cy="21" r="1.5" fill="#3A4558"/>
                    <circle cx="21" cy="21" r="1.5" fill="#3A4558"/>
                    <circle cx="12" cy="12" r="1" fill="#3A4558"/>
                    {/* Metallic highlight */}
                    <line x1="0" y1={seed * 8} x2="24" y2={seed * 8 + 2} stroke="#6A7588" strokeWidth="0.5" opacity="0.3"/>
                </g>
            );
        } else if (biome === 'TOWER_LEVEL') {
            // Heavy iron grating
            bgPattern = (
                <g>
                    <rect x="0" y="0" width="24" height="24" fill="#3D4852"/>
                    <g opacity="0.5">
                        <path d="M0 6 H24 M0 12 H24 M0 18 H24" stroke="#2D3842" strokeWidth="2"/>
                        <path d="M6 0 V24 M12 0 V24 M18 0 V24" stroke="#2D3842" strokeWidth="2"/>
                    </g>
                    {/* Corner bolts */}
                    <circle cx="6" cy="6" r="1.5" fill="#5D6872"/>
                    <circle cx="18" cy="6" r="1.5" fill="#5D6872"/>
                    <circle cx="6" cy="18" r="1.5" fill="#5D6872"/>
                    <circle cx="18" cy="18" r="1.5" fill="#5D6872"/>
                </g>
            );
        } else if (biome === 'TOWER_BASE') {
            // Massive iron lattice at tower base with visible structure
            bgPattern = (
                <g>
                    <rect x="0" y="0" width="24" height="24" fill="#3A4550"/>
                    {/* Heavy diagonal bracing */}
                    <g opacity="0.6">
                        <path d="M0 0 L24 24" stroke="#2A3540" strokeWidth="3"/>
                        <path d="M24 0 L0 24" stroke="#2A3540" strokeWidth="3"/>
                    </g>
                    {/* Central hub */}
                    <circle cx="12" cy="12" r="4" fill="#2A3540"/>
                    <circle cx="12" cy="12" r="2.5" fill="#4A5560"/>
                    {/* Corner rivets */}
                    <circle cx="2" cy="2" r="1.5" fill="#5A6570"/>
                    <circle cx="22" cy="2" r="1.5" fill="#5A6570"/>
                    <circle cx="2" cy="22" r="1.5" fill="#5A6570"/>
                    <circle cx="22" cy="22" r="1.5" fill="#5A6570"/>
                </g>
            );
        } else if (biome === 'TOWER_PLATFORM') {
            // Open iron grating with glimpses of Paris below
            bgPattern = (
                <g>
                    {/* Sky/city glimpse below */}
                    <rect x="0" y="0" width="24" height="24" fill="#87CEEB" opacity="0.3"/>
                    {/* Iron grate structure */}
                    <g>
                        <rect x="0" y="0" width="24" height="24" fill="#4A5568" opacity="0.7"/>
                        {/* Open gaps showing through */}
                        <rect x="2" y="2" width="8" height="8" fill="#87CEEB" opacity="0.4"/>
                        <rect x="14" y="2" width="8" height="8" fill="#87CEEB" opacity="0.4"/>
                        <rect x="2" y="14" width="8" height="8" fill="#87CEEB" opacity="0.4"/>
                        <rect x="14" y="14" width="8" height="8" fill="#87CEEB" opacity="0.4"/>
                        {/* Grate bars */}
                        <path d="M0 12 H24 M12 0 V24" stroke="#3A4558" strokeWidth="3"/>
                        <path d="M0 0 H24 M0 24 H24 M0 0 V24 M24 0 V24" stroke="#3A4558" strokeWidth="2"/>
                    </g>
                    {/* Bolts */}
                    <circle cx="12" cy="0" r="1.5" fill="#5A6578"/>
                    <circle cx="12" cy="24" r="1.5" fill="#5A6578"/>
                    <circle cx="0" cy="12" r="1.5" fill="#5A6578"/>
                    <circle cx="24" cy="12" r="1.5" fill="#5A6578"/>
                </g>
            );
        } else if (biome === 'ESPLANADE') {
            // Fine gravel with subtle variation
            bgPattern = (
                <g>
                    <rect x="0" y="0" width="24" height="24" fill="#C4B090"/>
                    <g opacity="0.3">
                        <circle cx={3 + seed * 3} cy={4 + seed * 2} r="1" fill="#A09070"/>
                        <circle cx={10 + seed * 4} cy={7 + seed * 3} r="0.8" fill="#B0A080"/>
                        <circle cx={18 + seed * 3} cy={3 + seed * 2} r="1.2" fill="#A09070"/>
                        <circle cx={5 + seed * 2} cy={13 + seed * 3} r="0.9" fill="#B0A080"/>
                        <circle cx={14 + seed * 4} cy={15 + seed * 2} r="1.1" fill="#A09070"/>
                        <circle cx={20 + seed * 2} cy={18 + seed * 3} r="0.8" fill="#B0A080"/>
                        <circle cx={8 + seed * 3} cy={20 + seed * 2} r="1" fill="#A09070"/>
                        <circle cx={16 + seed * 2} cy={22 + seed} r="0.9" fill="#B0A080"/>
                    </g>
                </g>
            );
        }
    }

    switch (char) {
        case '#': // WALL - SNES RPG style with biome-specific detailing
            if (biome === 'GRAND_HALL' || biome === 'TOWER_LEVEL' || biome === 'TOWER_BASE') {
                // Industrial riveted iron walls
                content = (
                    <g>
                        {/* Base iron plate */}
                        <rect x="0" y="0" width="24" height="24" fill="#2D3748"/>
                        {/* Vertical beams */}
                        <rect x="0" y="0" width="4" height="24" fill="#1A202C"/>
                        <rect x="20" y="0" width="4" height="24" fill="#1A202C"/>
                        {/* Horizontal beam across middle */}
                        <rect x="0" y="10" width="24" height="4" fill="#1A202C"/>
                        {/* Rivets */}
                        <circle cx="2" cy="4" r="1.5" fill="#4A5568"/>
                        <circle cx="2" cy="20" r="1.5" fill="#4A5568"/>
                        <circle cx="22" cy="4" r="1.5" fill="#4A5568"/>
                        <circle cx="22" cy="20" r="1.5" fill="#4A5568"/>
                        <circle cx="6" cy="12" r="1" fill="#4A5568"/>
                        <circle cx="18" cy="12" r="1" fill="#4A5568"/>
                        {/* Highlight edge */}
                        <line x1="4" y1="0" x2="4" y2="24" stroke="#4A5568" strokeWidth="1"/>
                        <line x1="0" y1="10" x2="24" y2="10" stroke="#4A5568" strokeWidth="1"/>
                    </g>
                );
            } else if (biome === 'SALON') {
                // Elegant wood-paneled interior walls with wainscoting
                content = (
                    <g>
                        {/* Upper wall - wallpaper section */}
                        <rect x="0" y="0" width="24" height="14" fill="#8B4513"/>
                        {/* Wallpaper pattern */}
                        <g opacity="0.3">
                            <circle cx="6" cy="4" r="2" fill="#654321"/>
                            <circle cx="18" cy="4" r="2" fill="#654321"/>
                            <circle cx="12" cy="10" r="2" fill="#654321"/>
                        </g>
                        {/* Chair rail molding */}
                        <rect x="0" y="13" width="24" height="2" fill="#5D4037"/>
                        <line x1="0" y1="13" x2="24" y2="13" stroke="#8D6E63" strokeWidth="0.5"/>
                        {/* Lower wainscoting */}
                        <rect x="0" y="15" width="24" height="9" fill="#6D4C41"/>
                        {/* Panel details */}
                        <rect x="2" y="17" width="8" height="5" fill="#5D4037" stroke="#4E342E" strokeWidth="0.5"/>
                        <rect x="14" y="17" width="8" height="5" fill="#5D4037" stroke="#4E342E" strokeWidth="0.5"/>
                        {/* Baseboard */}
                        <rect x="0" y="22" width="24" height="2" fill="#3E2723"/>
                    </g>
                );
            } else if (biome === 'STREET') {
                // Parisian building facade with windows
                content = (
                    <g>
                        {/* Stone facade base */}
                        <rect x="0" y="0" width="24" height="24" fill="#D7CCC8"/>
                        {/* Stone block pattern */}
                        <g stroke="#BCAAA4" strokeWidth="0.5" fill="none">
                            <rect x="1" y="1" width="10" height="6"/>
                            <rect x="13" y="1" width="10" height="6"/>
                            <rect x="1" y="9" width="22" height="6"/>
                            <rect x="1" y="17" width="10" height="6"/>
                            <rect x="13" y="17" width="10" height="6"/>
                        </g>
                        {/* Window */}
                        {seed > 0.3 && (
                            <g>
                                <rect x="6" y="3" width="12" height="10" fill="#1A237E" opacity="0.8"/>
                                <rect x="6" y="3" width="12" height="10" fill="none" stroke="#5D4037" strokeWidth="1.5"/>
                                <line x1="12" y1="3" x2="12" y2="13" stroke="#5D4037" strokeWidth="1"/>
                                <line x1="6" y1="8" x2="18" y2="8" stroke="#5D4037" strokeWidth="1"/>
                                {/* Window shine */}
                                <line x1="7" y1="4" x2="10" y2="7" stroke="#4FC3F7" strokeWidth="0.5" opacity="0.5"/>
                            </g>
                        )}
                        {/* Shadow at bottom */}
                        <rect x="0" y="22" width="24" height="2" fill="#8D6E63" opacity="0.5"/>
                    </g>
                );
            } else if (biome === 'GARDEN' || biome === 'ESPLANADE') {
                // Low stone garden wall or hedge backing
                content = (
                    <g>
                        {/* Stone wall base */}
                        <rect x="0" y="8" width="24" height="16" fill="#9E9E9E"/>
                        {/* Stone texture */}
                        <g opacity="0.4">
                            <rect x="1" y="10" width="7" height="5" fill="#757575" rx="1"/>
                            <rect x="10" y="9" width="6" height="6" fill="#BDBDBD" rx="1"/>
                            <rect x="18" y="10" width="5" height="5" fill="#757575" rx="1"/>
                            <rect x="2" y="17" width="8" height="5" fill="#BDBDBD" rx="1"/>
                            <rect x="12" y="16" width="10" height="6" fill="#757575" rx="1"/>
                        </g>
                        {/* Cap stone */}
                        <rect x="0" y="6" width="24" height="3" fill="#BDBDBD"/>
                        <line x1="0" y1="6" x2="24" y2="6" stroke="#E0E0E0" strokeWidth="1"/>
                        {/* Grass/sky above */}
                        <rect x="0" y="0" width="24" height="6" fill="#1B2838" opacity="0.8"/>
                    </g>
                );
            } else {
                // Default interior wall with depth
                content = (
                    <g>
                        {/* Back shadow for depth */}
                        <rect x="0" y="0" width="24" height="24" fill="#1A1A2E"/>
                        {/* Main wall surface */}
                        <rect x="0" y="2" width="24" height="22" fill="#2D2D44"/>
                        {/* Subtle texture */}
                        <g opacity="0.2">
                            <line x1="0" y1="8" x2="24" y2="8" stroke="#404060" strokeWidth="1"/>
                            <line x1="0" y1="16" x2="24" y2="16" stroke="#404060" strokeWidth="1"/>
                        </g>
                        {/* Top edge highlight */}
                        <line x1="0" y1="2" x2="24" y2="2" stroke="#4A4A6A" strokeWidth="1"/>
                    </g>
                );
            }
            break;

        case '.': // FLOOR
            content = bgPattern;
            break;

        case ':': // PATH (Sidewalk) - now more detailed
            if (biome === 'STREET') {
                content = (
                    <g>
                        <rect x="0" y="0" width="24" height="24" fill="#A1887F"/>
                        {/* Paving stones */}
                        <g stroke="#8D6E63" strokeWidth="0.5" fill="none">
                            <rect x="1" y="1" width="10" height="10"/>
                            <rect x="13" y="1" width="10" height="10"/>
                            <rect x="1" y="13" width="10" height="10"/>
                            <rect x="13" y="13" width="10" height="10"/>
                        </g>
                    </g>
                );
            } else {
                content = bgPattern || (
                    <rect x="0" y="0" width="24" height="24" fill="#E8E0D8" opacity="0.5"/>
                );
            }
            break;

        case 'T': // TREE - more detailed SNES style
            content = (
                <g>
                    {/* Shadow on ground */}
                    <ellipse cx="14" cy="22" rx="6" ry="2" fill="#000" opacity="0.2"/>
                    {/* Trunk with bark texture */}
                    <rect x="10" y="16" width="4" height="8" fill="#5D4037"/>
                    <line x1="11" y1="16" x2="11" y2="24" stroke="#4E342E" strokeWidth="0.5"/>
                    <line x1="13" y1="16" x2="13" y2="24" stroke="#6D4C41" strokeWidth="0.5"/>
                    {/* Main foliage - layered for depth */}
                    <ellipse cx="12" cy="12" rx="10" ry="8" fill="#2E7D32"/>
                    <ellipse cx="8" cy="10" rx="6" ry="5" fill="#388E3C"/>
                    <ellipse cx="16" cy="10" rx="6" ry="5" fill="#388E3C"/>
                    <ellipse cx="12" cy="8" rx="7" ry="5" fill="#43A047"/>
                    {/* Highlight spots */}
                    <circle cx="8" cy="8" r="2" fill="#66BB6A" opacity="0.6"/>
                    <circle cx="14" cy="6" r="1.5" fill="#81C784" opacity="0.5"/>
                </g>
            );
            break;

        case '~': // WATER - animated waves
             content = (
                <g>
                    <rect x="0" y="0" width="24" height="24" fill="#1565C0" opacity="0.6"/>
                    <path d="M0 8 Q6 4 12 8 T24 8" stroke="#42A5F5" fill="none" strokeWidth="2" opacity="0.6"/>
                    <path d="M0 14 Q6 10 12 14 T24 14" stroke="#64B5F6" fill="none" strokeWidth="1.5" opacity="0.5"/>
                    <path d="M0 20 Q6 16 12 20 T24 20" stroke="#90CAF9" fill="none" strokeWidth="1" opacity="0.4"/>
                    {/* Sparkle */}
                    {seed > 0.7 && <circle cx={8 + seed * 8} cy={6 + seed * 4} r="1" fill="#FFF" opacity="0.6"/>}
                </g>
             );
             break;

        case '+': // DOOR - more detailed archway
             content = (
                 <g>
                    {bgPattern}
                    {/* Door frame */}
                    <rect x="3" y="0" width="18" height="24" fill="#5D4037"/>
                    {/* Actual door */}
                    <rect x="5" y="2" width="14" height="20" fill="#8D6E63"/>
                    {/* Panel details */}
                    <rect x="7" y="4" width="10" height="6" fill="#6D4C41" stroke="#5D4037" strokeWidth="0.5"/>
                    <rect x="7" y="12" width="10" height="8" fill="#6D4C41" stroke="#5D4037" strokeWidth="0.5"/>
                    {/* Handle */}
                    <circle cx="15" cy="13" r="1.5" fill="#FFD54F"/>
                    {/* Light from other side */}
                    <rect x="5" y="22" width="14" height="2" fill="#FFF59D" opacity="0.3"/>
                 </g>
             );
             break;

        case 'L': // LAMP - more ornate gas lamp
             content = (
                 <g>
                     {bgPattern}
                     {/* Post */}
                     <rect x="10" y="12" width="4" height="12" fill="#37474F"/>
                     <rect x="9" y="20" width="6" height="4" fill="#455A64"/>
                     {/* Lamp housing */}
                     <path d="M6 8 L8 12 L16 12 L18 8 Z" fill="#37474F"/>
                     <rect x="7" y="4" width="10" height="5" fill="#263238"/>
                     {/* Glass panels */}
                     <rect x="8" y="5" width="3" height="3" fill="#FFEB3B" opacity="0.8"/>
                     <rect x="13" y="5" width="3" height="3" fill="#FFEB3B" opacity="0.8"/>
                     {/* Top finial */}
                     <path d="M10 4 L12 1 L14 4 Z" fill="#37474F"/>
                     {/* Glow Effect */}
                     <circle cx="12" cy="7" r="8" fill="url(#lampGlow)" opacity="0.6"/>
                 </g>
             );
             break;

        case 'A': // TOWER BASE - Eiffel Tower iconic lattice
             content = (
                 <g>
                     {/* Lattice structure */}
                     <path d="M2 24 L12 2 L22 24" fill="none" stroke="#37474F" strokeWidth="3"/>
                     <path d="M5 24 L12 8 L19 24" fill="none" stroke="#455A64" strokeWidth="2"/>
                     {/* Cross bracing */}
                     <path d="M6 18 L18 18 M8 12 L16 12" stroke="#37474F" strokeWidth="1.5"/>
                     {/* Rivets */}
                     <circle cx="12" cy="8" r="1" fill="#546E7A"/>
                     <circle cx="9" cy="15" r="0.8" fill="#546E7A"/>
                     <circle cx="15" cy="15" r="0.8" fill="#546E7A"/>
                 </g>
             );
             break;

        case 'F': // FOUNTAIN CENTER - ornate with water spray
             content = (
                 <g>
                    {/* Basin */}
                    <ellipse cx="12" cy="16" rx="10" ry="4" fill="#607D8B"/>
                    <ellipse cx="12" cy="14" rx="8" ry="3" fill="#78909C"/>
                    {/* Water */}
                    <ellipse cx="12" cy="15" rx="7" ry="2.5" fill="#42A5F5" opacity="0.7"/>
                    {/* Central pedestal */}
                    <rect x="10" y="10" width="4" height="6" fill="#78909C"/>
                    {/* Water jet */}
                    <path d="M12 10 Q10 4 12 2 Q14 4 12 10" fill="#90CAF9" opacity="0.6"/>
                    {/* Spray droplets */}
                    <circle cx="9" cy="6" r="0.8" fill="#E3F2FD" opacity="0.7"/>
                    <circle cx="15" cy="5" r="0.6" fill="#E3F2FD" opacity="0.7"/>
                    <circle cx="12" cy="3" r="1" fill="#BBDEFB" opacity="0.8"/>
                 </g>
             );
             break;

        case 'f': // FOUNTAIN EDGE - stone rim
             content = (
                 <g>
                     <ellipse cx="12" cy="12" rx="12" ry="6" fill="#607D8B"/>
                     <ellipse cx="12" cy="10" rx="10" ry="5" fill="#42A5F5" opacity="0.5"/>
                     {/* Ripples */}
                     <ellipse cx="12" cy="10" rx="6" ry="3" fill="none" stroke="#90CAF9" strokeWidth="0.5" opacity="0.5"/>
                 </g>
             );
             break;

        case 'b': // BENCH - ornate park bench
             content = (
                 <g>
                     {bgPattern}
                     {/* Shadow */}
                     <ellipse cx="12" cy="20" rx="8" ry="2" fill="#000" opacity="0.15"/>
                     {/* Legs */}
                     <path d="M4 12 L6 20 M20 12 L18 20" stroke="#37474F" strokeWidth="2"/>
                     {/* Seat */}
                     <rect x="2" y="10" width="20" height="3" fill="#5D4037" rx="1"/>
                     {/* Back rest */}
                     <rect x="3" y="4" width="18" height="6" fill="#6D4C41" rx="1"/>
                     {/* Slats */}
                     <g stroke="#4E342E" strokeWidth="0.5">
                         <line x1="6" y1="4" x2="6" y2="10"/>
                         <line x1="12" y1="4" x2="12" y2="10"/>
                         <line x1="18" y1="4" x2="18" y2="10"/>
                     </g>
                     {/* Armrests */}
                     <rect x="2" y="6" width="2" height="5" fill="#5D4037" rx="0.5"/>
                     <rect x="20" y="6" width="2" height="5" fill="#5D4037" rx="0.5"/>
                 </g>
             );
             break;

        case 'n': // NEWSPAPER
             content = (
                 <g transform={`rotate(${seed * 30 - 15} 12 12)`}>
                     {bgPattern}
                     <rect x="6" y="8" width="12" height="9" fill="#FFFDE7" stroke="#9E9E9E" strokeWidth="0.5"/>
                     {/* Headlines */}
                     <rect x="7" y="9" width="10" height="1.5" fill="#212121"/>
                     <line x1="7" y1="12" x2="17" y2="12" stroke="#757575" strokeWidth="0.5"/>
                     <line x1="7" y1="14" x2="17" y2="14" stroke="#757575" strokeWidth="0.5"/>
                     <line x1="7" y1="15.5" x2="13" y2="15.5" stroke="#757575" strokeWidth="0.5"/>
                 </g>
             );
             break;

        case 'p': // PUDDLE - reflective with sky mirror
             content = (
                 <g>
                     {bgPattern}
                     {/* Puddle shape */}
                     <ellipse cx="12" cy="12" rx={8 + seed * 3} ry={5 + seed * 2} fill="#4A90A4" opacity="0.6"/>
                     {/* Sky reflection */}
                     <ellipse cx="10" cy="10" rx={4 + seed * 2} ry={2 + seed} fill="#87CEEB" opacity="0.4"/>
                     {/* Ripples */}
                     <ellipse cx="12" cy="12" rx={6 + seed * 2} ry={3 + seed} fill="none" stroke="#90CAF9" strokeWidth="0.5" opacity="0.5"/>
                     <ellipse cx="12" cy="12" rx={3 + seed} ry={1.5 + seed * 0.5} fill="none" stroke="#B3E5FC" strokeWidth="0.3" opacity="0.4"/>
                     {/* Sparkle */}
                     {seed > 0.5 && <circle cx={8 + seed * 4} cy={9 + seed * 2} r="1" fill="#FFF" opacity="0.7"/>}
                 </g>
             );
             break;

        case 's': // STEAM VENT - industrial grating with steam
             content = (
                 <g>
                     {bgPattern}
                     {/* Metal grate */}
                     <rect x="4" y="4" width="16" height="16" fill="#37474F" rx="2"/>
                     <g stroke="#263238" strokeWidth="1.5">
                         <line x1="6" y1="4" x2="6" y2="20"/>
                         <line x1="10" y1="4" x2="10" y2="20"/>
                         <line x1="14" y1="4" x2="14" y2="20"/>
                         <line x1="18" y1="4" x2="18" y2="20"/>
                     </g>
                     {/* Steam wisps */}
                     <g opacity="0.6">
                         <ellipse cx={8 + seed * 4} cy={6 - seed * 2} rx="3" ry="2" fill="#E0E0E0"/>
                         <ellipse cx={14 + seed * 2} cy={4 - seed * 3} rx="4" ry="2.5" fill="#F5F5F5"/>
                         <ellipse cx={10 - seed * 2} cy={2 - seed * 2} rx="2.5" ry="1.5" fill="#FAFAFA"/>
                     </g>
                     {/* Glow from below */}
                     <rect x="6" y="8" width="12" height="8" fill="#FF6B6B" opacity="0.15"/>
                 </g>
             );
             break;

        case 'K': // KIOSK - Morris column style Parisian kiosk
             content = (
                 <g>
                     {bgPattern}
                     {/* Shadow */}
                     <ellipse cx="14" cy="22" rx="8" ry="2" fill="#000" opacity="0.2"/>
                     {/* Base */}
                     <rect x="4" y="20" width="16" height="4" fill="#1B5E20"/>
                     {/* Column body */}
                     <rect x="5" y="6" width="14" height="14" fill="#2E7D32"/>
                     {/* Decorative molding */}
                     <rect x="4" y="4" width="16" height="3" fill="#1B5E20"/>
                     <rect x="4" y="18" width="16" height="2" fill="#1B5E20"/>
                     {/* Posters/advertisements */}
                     <rect x="6" y="8" width="5" height="7" fill="#FFFDE7"/>
                     <rect x="13" y="8" width="5" height="7" fill="#FFF9C4"/>
                     {/* Poster text lines */}
                     <line x1="7" y1="10" x2="10" y2="10" stroke="#333" strokeWidth="0.5"/>
                     <line x1="7" y1="12" x2="10" y2="12" stroke="#666" strokeWidth="0.3"/>
                     <line x1="14" y1="10" x2="17" y2="10" stroke="#333" strokeWidth="0.5"/>
                     {/* Domed top */}
                     <ellipse cx="12" cy="4" rx="8" ry="3" fill="#1B5E20"/>
                     <ellipse cx="12" cy="3" rx="6" ry="2" fill="#2E7D32"/>
                     {/* Finial */}
                     <circle cx="12" cy="1" r="1.5" fill="#FFD700"/>
                 </g>
             );
             break;

        case 'C': // CARRIAGE - ornate horse-drawn fiacre
             content = (
                 <g>
                     {bgPattern}
                     {/* Shadow */}
                     <ellipse cx="12" cy="20" rx="10" ry="2" fill="#000" opacity="0.2"/>
                     {/* Wheels */}
                     <circle cx="5" cy="18" r="4" fill="none" stroke="#5D4037" strokeWidth="2"/>
                     <circle cx="5" cy="18" r="1" fill="#5D4037"/>
                     <circle cx="19" cy="18" r="4" fill="none" stroke="#5D4037" strokeWidth="2"/>
                     <circle cx="19" cy="18" r="1" fill="#5D4037"/>
                     {/* Spokes */}
                     <g stroke="#5D4037" strokeWidth="0.5">
                         <line x1="5" y1="14" x2="5" y2="22"/>
                         <line x1="1" y1="18" x2="9" y2="18"/>
                         <line x1="19" y1="14" x2="19" y2="22"/>
                         <line x1="15" y1="18" x2="23" y2="18"/>
                     </g>
                     {/* Carriage body */}
                     <rect x="4" y="8" width="16" height="10" rx="2" fill="#8B0000"/>
                     {/* Window */}
                     <rect x="7" y="10" width="10" height="5" rx="1" fill="#1A237E" opacity="0.7"/>
                     <line x1="12" y1="10" x2="12" y2="15" stroke="#5D4037" strokeWidth="0.5"/>
                     {/* Door details */}
                     <rect x="6" y="9" width="12" height="8" fill="none" stroke="#FFD700" strokeWidth="0.5" rx="1"/>
                     {/* Roof */}
                     <path d="M3 8 Q12 4 21 8" fill="#4A0000"/>
                     {/* Lantern */}
                     <rect x="1" y="8" width="2" height="3" fill="#FFD700"/>
                 </g>
             );
             break;

        case 'G': // GALA ENTRANCE - grand ornate doorway
             content = (
                 <g>
                     {bgPattern}
                     {/* Stone archway surround */}
                     <path d="M0 24 L0 8 Q0 0 12 0 Q24 0 24 8 L24 24" fill="#D7CCC8"/>
                     <path d="M2 24 L2 10 Q2 2 12 2 Q22 2 22 10 L22 24" fill="#8B0000"/>
                     {/* Ornate arch keystone */}
                     <path d="M9 0 L12 4 L15 0" fill="#FFD700"/>
                     {/* Door panels */}
                     <rect x="3" y="10" width="8" height="14" fill="#6B0000"/>
                     <rect x="13" y="10" width="8" height="14" fill="#6B0000"/>
                     {/* Panel insets */}
                     <rect x="4" y="11" width="6" height="5" fill="#5C0000" rx="0.5"/>
                     <rect x="4" y="18" width="6" height="5" fill="#5C0000" rx="0.5"/>
                     <rect x="14" y="11" width="6" height="5" fill="#5C0000" rx="0.5"/>
                     <rect x="14" y="18" width="6" height="5" fill="#5C0000" rx="0.5"/>
                     {/* Gold trim */}
                     <line x1="12" y1="6" x2="12" y2="24" stroke="#FFD700" strokeWidth="1.5"/>
                     <path d="M2 10 Q2 2 12 2 Q22 2 22 10" fill="none" stroke="#FFD700" strokeWidth="1"/>
                     {/* Door handles */}
                     <circle cx="10" cy="17" r="1.5" fill="#FFD700"/>
                     <circle cx="14" cy="17" r="1.5" fill="#FFD700"/>
                     {/* Decorative lion heads */}
                     <circle cx="10" cy="17" r="0.5" fill="#B8860B"/>
                     <circle cx="14" cy="17" r="0.5" fill="#B8860B"/>
                 </g>
             );
             break;

        case '[': // EXHIBITION BORDER LEFT
             content = (
                 <g>
                     {bgPattern}
                     {/* Decorative column/border */}
                     <rect x="0" y="0" width="6" height="24" fill="#4A5568"/>
                     <rect x="1" y="2" width="4" height="20" fill="#5A6578"/>
                     {/* Fluting */}
                     <line x1="2" y1="2" x2="2" y2="22" stroke="#4A5568" strokeWidth="0.5"/>
                     <line x1="4" y1="2" x2="4" y2="22" stroke="#6A7588" strokeWidth="0.5"/>
                     {/* Capital */}
                     <rect x="0" y="0" width="8" height="3" fill="#6A7588"/>
                     <rect x="0" y="21" width="8" height="3" fill="#6A7588"/>
                 </g>
             );
             break;

        case ']': // EXHIBITION BORDER RIGHT
             content = (
                 <g>
                     {bgPattern}
                     {/* Decorative column/border */}
                     <rect x="18" y="0" width="6" height="24" fill="#4A5568"/>
                     <rect x="19" y="2" width="4" height="20" fill="#5A6578"/>
                     {/* Fluting */}
                     <line x1="20" y1="2" x2="20" y2="22" stroke="#4A5568" strokeWidth="0.5"/>
                     <line x1="22" y1="2" x2="22" y2="22" stroke="#6A7588" strokeWidth="0.5"/>
                     {/* Capital */}
                     <rect x="16" y="0" width="8" height="3" fill="#6A7588"/>
                     <rect x="16" y="21" width="8" height="3" fill="#6A7588"/>
                 </g>
             );
             break;

        case 'E': // ENTRANCE/EXIT marker
             content = (
                 <g>
                     {bgPattern}
                     {/* Decorative archway */}
                     <path d="M4 24 L4 8 Q4 2 12 2 Q20 2 20 8 L20 24" fill="none" stroke="#FFD700" strokeWidth="2"/>
                     {/* Inner arch */}
                     <path d="M6 24 L6 10 Q6 4 12 4 Q18 4 18 10 L18 24" fill="#1A202C" opacity="0.5"/>
                     {/* Keystone accent */}
                     <circle cx="12" cy="3" r="2" fill="#FFD700"/>
                     {/* Arrow indicator */}
                     <path d="M8 16 L12 12 L16 16 M12 12 L12 22" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
                 </g>
             );
             break;

        case 'P': // PYLON (Tower leg - massive iron structure)
            content = (
                <g>
                    {/* Solid iron base */}
                    <rect x="0" y="0" width="24" height="24" fill="currentColor" className="text-slate-800"/>
                    {/* Rivet pattern */}
                    <circle cx="4" cy="4" r="1.5" fill="currentColor" className="text-slate-500"/>
                    <circle cx="20" cy="4" r="1.5" fill="currentColor" className="text-slate-500"/>
                    <circle cx="4" cy="20" r="1.5" fill="currentColor" className="text-slate-500"/>
                    <circle cx="20" cy="20" r="1.5" fill="currentColor" className="text-slate-500"/>
                    <circle cx="12" cy="12" r="2" fill="currentColor" className="text-slate-500"/>
                    {/* Cross-bracing */}
                    <path d="M2 2 L22 22 M22 2 L2 22" stroke="currentColor" strokeWidth="2" className="text-slate-600"/>
                </g>
            );
            break;

        case 'V': // VOID (Terrifying drop - Paris spread below)
            content = (
                <g>
                    {/* Gradient sky fading to hazy city below */}
                    <defs>
                        <linearGradient id={`voidGrad-${x}-${y}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.9"/>
                            <stop offset="40%" stopColor="#B0C4DE" stopOpacity="0.7"/>
                            <stop offset="100%" stopColor="#D3D3D3" stopOpacity="0.5"/>
                        </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="24" height="24" fill={`url(#voidGrad-${x}-${y})`}/>

                    {/* Wispy clouds at viewer level */}
                    <ellipse cx={4 + seed * 16} cy={3 + seed * 2} rx="5" ry="1.5" fill="white" opacity="0.7"/>
                    {seed > 0.5 && <ellipse cx={12 + seed * 8} cy={5} rx="4" ry="1" fill="white" opacity="0.5"/>}

                    {/* Paris cityscape far below - tiny buildings */}
                    <g opacity="0.25">
                        {/* Varied building heights based on position */}
                        <rect x={1 + (seed * 2)} y={18 - seed * 2} width="1.5" height={6 + seed * 2} fill="#4a5568"/>
                        <rect x={4 + (seed * 3)} y={20 - seed} width="2" height={4 + seed} fill="#5a6578"/>
                        <rect x={8} y={19 - seed * 1.5} width="1" height={5 + seed * 1.5} fill="#4a5568"/>
                        <rect x={10 + seed * 2} y={21 - seed * 0.5} width="2.5" height={3 + seed * 0.5} fill="#6a7588"/>
                        <rect x={14} y={18 - seed * 2} width="1.5" height={6 + seed * 2} fill="#4a5568"/>
                        <rect x={17 + seed} y={20} width="2" height="4" fill="#5a6578"/>
                        <rect x={20} y={19 - seed} width="1.5" height={5 + seed} fill="#4a5568"/>
                        <rect x={22} y={21} width="2" height="3" fill="#6a7588"/>

                        {/* Iconic dome (Invalides?) */}
                        {seed > 0.6 && (
                            <g>
                                <rect x="11" y="17" width="3" height="4" fill="#5a6578"/>
                                <ellipse cx="12.5" cy="17" rx="2" ry="1" fill="#6a7588"/>
                            </g>
                        )}
                    </g>

                    {/* The Seine - a glinting ribbon */}
                    <path d={`M0 ${22 + seed} Q12 ${21 + seed * 2} 24 ${22 - seed}`} stroke="#6B8E9F" strokeWidth="1" fill="none" opacity="0.3"/>

                    {/* Distant birds wheeling below */}
                    {seed > 0.7 && (
                        <g opacity="0.4">
                            <path d="M8 12 L9 11 L10 12" stroke="#333" fill="none" strokeWidth="0.3"/>
                            <path d="M16 14 L17 13 L18 14" stroke="#333" fill="none" strokeWidth="0.3"/>
                        </g>
                    )}

                    {/* Danger indicator - subtle red glow at edges */}
                    <rect x="0" y="0" width="24" height="24" fill="url(#dangerGlow)" opacity="0.15"/>
                </g>
            );
            break;

        case 'R': // RAILING (Iron safety barrier)
            content = (
                <g>
                    {bgPattern}
                    {/* Railing posts */}
                    <rect x="2" y="4" width="3" height="16" fill="currentColor" className="text-slate-700"/>
                    <rect x="19" y="4" width="3" height="16" fill="currentColor" className="text-slate-700"/>
                    {/* Horizontal bars */}
                    <rect x="0" y="6" width="24" height="2" fill="currentColor" className="text-slate-600"/>
                    <rect x="0" y="12" width="24" height="2" fill="currentColor" className="text-slate-600"/>
                    <rect x="0" y="18" width="24" height="2" fill="currentColor" className="text-slate-600"/>
                    {/* Decorative finials */}
                    <circle cx="3.5" cy="4" r="2" fill="currentColor" className="text-slate-500"/>
                    <circle cx="20.5" cy="4" r="2" fill="currentColor" className="text-slate-500"/>
                </g>
            );
            break;

        case 'e': // ELEVATOR (Ornate 1889 cage)
            content = (
                <g>
                    {/* Elevator cage background */}
                    <rect x="2" y="2" width="20" height="20" fill="currentColor" className="text-amber-100"/>
                    {/* Ornate frame */}
                    <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-600"/>
                    {/* Cross-hatch gate pattern */}
                    <path d="M4 4 L20 20 M20 4 L4 20" stroke="currentColor" strokeWidth="1" className="text-gold-500"/>
                    <path d="M12 2 V22 M2 12 H22" stroke="currentColor" strokeWidth="1" className="text-gold-500"/>
                    {/* Central medallion */}
                    <circle cx="12" cy="12" r="3" fill="currentColor" className="text-gold-400"/>
                    <text x="12" y="14" textAnchor="middle" fontSize="6" fill="currentColor" className="text-amber-900">↑</text>
                </g>
            );
            break;

        case 'O': // TELESCOPE (Observation scope)
            content = (
                <g>
                    {bgPattern}
                    {/* Tripod base */}
                    <path d="M6 22 L12 14 L18 22" stroke="currentColor" strokeWidth="2" fill="none" className="text-slate-700"/>
                    <line x1="12" y1="22" x2="12" y2="14" stroke="currentColor" strokeWidth="2" className="text-slate-700"/>
                    {/* Telescope tube */}
                    <ellipse cx="12" cy="8" rx="8" ry="4" fill="currentColor" className="text-amber-800"/>
                    <ellipse cx="18" cy="8" rx="3" ry="3" fill="currentColor" className="text-slate-600"/>
                    <circle cx="18" cy="8" r="2" fill="currentColor" className="text-sky-200"/>
                    {/* Viewing eyepiece */}
                    <circle cx="5" cy="8" r="2" fill="currentColor" className="text-slate-800"/>
                </g>
            );
            break;

        case 'S': // STALL_WALL (Low exhibition partition)
            content = (
                <g>
                    {/* Ornate wooden partition */}
                    <rect x="0" y="0" width="24" height="24" fill="currentColor" className="text-amber-800"/>
                    {/* Decorative carved pattern */}
                    <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1" className="text-amber-600"/>
                    <path d="M6 6 L18 6 M6 12 L18 12 M6 18 L18 18" stroke="currentColor" strokeWidth="1" className="text-amber-900"/>
                    {/* Gold trim */}
                    <rect x="0" y="0" width="24" height="2" fill="currentColor" className="text-gold-500"/>
                    <rect x="0" y="22" width="24" height="2" fill="currentColor" className="text-gold-500"/>
                </g>
            );
            break;

        case 'D': // DISPLAY (Exhibition case with artifact)
            content = (
                <g>
                    {/* Glass display case */}
                    <rect x="2" y="4" width="20" height="16" fill="currentColor" className="text-sky-100/50"/>
                    <rect x="2" y="4" width="20" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-600"/>
                    {/* Artifact inside - varies by seed */}
                    {seed < 0.33 ? (
                        // Vase
                        <path d="M12 8 L10 16 L14 16 L12 8" fill="currentColor" className="text-blue-600"/>
                    ) : seed < 0.66 ? (
                        // Statue/figurine
                        <circle cx="12" cy="10" r="3" fill="currentColor" className="text-amber-700"/>
                    ) : (
                        // Gem/jewel
                        <polygon points="12,7 16,12 12,17 8,12" fill="currentColor" className="text-emerald-500"/>
                    )}
                    {/* Velvet base */}
                    <rect x="4" y="16" width="16" height="3" fill="currentColor" className="text-red-900"/>
                    {/* Glass shine */}
                    <line x1="4" y1="6" x2="8" y2="10" stroke="white" strokeWidth="1" opacity="0.6"/>
                </g>
            );
            break;

        case 'c': // COLUMN (Decorative pillar)
            content = (
                <g>
                    {bgPattern}
                    {/* Column base */}
                    <rect x="6" y="20" width="12" height="4" fill="currentColor" className="text-stone-400"/>
                    {/* Column shaft with fluting */}
                    <rect x="7" y="4" width="10" height="16" fill="currentColor" className="text-stone-300"/>
                    <line x1="9" y1="4" x2="9" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-stone-400"/>
                    <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-stone-400"/>
                    <line x1="15" y1="4" x2="15" y2="20" stroke="currentColor" strokeWidth="0.5" className="text-stone-400"/>
                    {/* Capital */}
                    <rect x="5" y="2" width="14" height="3" fill="currentColor" className="text-stone-400"/>
                    <path d="M5 2 Q12 -2 19 2" fill="currentColor" className="text-stone-300"/>
                </g>
            );
            break;

        case 'r': // CARPET (Ornate rug)
            content = (
                <g>
                    {/* Rich carpet base */}
                    <rect x="0" y="0" width="24" height="24" fill="currentColor" className="text-red-800"/>
                    {/* Persian-style pattern */}
                    <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold-500"/>
                    <rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold-400"/>
                    {/* Central medallion */}
                    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold-500"/>
                    <circle cx="12" cy="12" r="2" fill="currentColor" className="text-gold-400"/>
                    {/* Corner flourishes */}
                    <path d="M4 4 L8 8 M20 4 L16 8 M4 20 L8 16 M20 20 L16 16" stroke="currentColor" strokeWidth="0.5" className="text-gold-400"/>
                </g>
            );
            break;

        case 'B': // BANNER (Hanging tapestry)
            content = (
                <g>
                    {/* Banner pole */}
                    <rect x="10" y="0" width="4" height="3" fill="currentColor" className="text-gold-600"/>
                    {/* Hanging fabric */}
                    <path d="M4 3 L4 20 Q12 24 20 20 L20 3 Z" fill="currentColor" className="text-purple-800"/>
                    {/* Decorative emblem */}
                    <circle cx="12" cy="12" r="4" fill="currentColor" className="text-gold-500"/>
                    <path d="M12 8 L14 12 L12 16 L10 12 Z" fill="currentColor" className="text-purple-900"/>
                    {/* Fringe at bottom */}
                    <path d="M4 20 L5 22 L6 20 L7 22 L8 20 L9 22 L10 20 L11 22 L12 20 L13 22 L14 20 L15 22 L16 20 L17 22 L18 20 L19 22 L20 20" stroke="currentColor" fill="none" strokeWidth="1" className="text-gold-400"/>
                </g>
            );
            break;

        case 'u': // STATUE (Sculpture on pedestal)
            content = (
                <g>
                    {bgPattern}
                    {/* Pedestal */}
                    <rect x="6" y="16" width="12" height="8" fill="currentColor" className="text-stone-400"/>
                    <rect x="4" y="14" width="16" height="3" fill="currentColor" className="text-stone-500"/>
                    {/* Statue figure - classical bust */}
                    <ellipse cx="12" cy="10" rx="5" ry="6" fill="currentColor" className="text-stone-200"/>
                    <circle cx="12" cy="6" r="4" fill="currentColor" className="text-stone-200"/>
                    {/* Shadow detail */}
                    <ellipse cx="14" cy="10" rx="2" ry="3" fill="currentColor" className="text-stone-300" opacity="0.5"/>
                </g>
            );
            break;

        case 'l': // LANTERN (Hanging light)
            content = (
                <g>
                    {bgPattern}
                    {/* Chain */}
                    <line x1="12" y1="0" x2="12" y2="6" stroke="currentColor" strokeWidth="1" className="text-gold-600"/>
                    {/* Lantern frame */}
                    <rect x="6" y="6" width="12" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-700"/>
                    {/* Glass panels */}
                    <rect x="7" y="7" width="10" height="12" fill="currentColor" className="text-amber-200"/>
                    {/* Light glow */}
                    <circle cx="12" cy="13" r="6" fill="currentColor" className="text-amber-300/50"/>
                    <circle cx="12" cy="13" r="3" fill="currentColor" className="text-amber-100"/>
                    {/* Decorative top and bottom */}
                    <path d="M6 6 L12 3 L18 6" fill="currentColor" className="text-gold-600"/>
                    <rect x="8" y="20" width="8" height="2" fill="currentColor" className="text-gold-700"/>
                </g>
            );
            break;

        case 'g': // GRASS (Manicured lawn)
            content = (
                <g>
                    {/* Green grass base */}
                    <rect x="0" y="0" width="24" height="24" fill="currentColor" className="text-green-500"/>
                    {/* Grass blade texture */}
                    <g opacity="0.3">
                        <path d={`M${3 + seed * 4} 24 Q${4 + seed * 3} ${16 + seed * 4} ${5 + seed * 2} 24`} stroke="currentColor" fill="none" strokeWidth="0.5" className="text-green-700"/>
                        <path d={`M${10 + seed * 3} 24 Q${11 + seed * 2} ${14 + seed * 5} ${12 + seed * 2} 24`} stroke="currentColor" fill="none" strokeWidth="0.5" className="text-green-700"/>
                        <path d={`M${17 + seed * 3} 24 Q${18 + seed * 2} ${17 + seed * 3} ${19 + seed} 24`} stroke="currentColor" fill="none" strokeWidth="0.5" className="text-green-700"/>
                        <path d={`M${6 + seed * 2} 24 Q${7 + seed} ${18 + seed * 3} ${8} 24`} stroke="currentColor" fill="none" strokeWidth="0.5" className="text-green-600"/>
                        <path d={`M${14 + seed * 2} 24 Q${15 + seed} ${15 + seed * 4} ${16} 24`} stroke="currentColor" fill="none" strokeWidth="0.5" className="text-green-600"/>
                    </g>
                    {/* Light dappling */}
                    {seed > 0.6 && <circle cx={8 + seed * 10} cy={8 + seed * 8} r="3" fill="currentColor" className="text-green-400/30"/>}
                </g>
            );
            break;

        case 'W': // BRICK_WALL (Low brick balustrade)
            content = (
                <g>
                    {/* Brick wall pattern */}
                    <rect x="0" y="0" width="24" height="24" fill="currentColor" className="text-red-800"/>
                    {/* Brick rows */}
                    <g stroke="currentColor" strokeWidth="0.5" className="text-red-900">
                        <line x1="0" y1="6" x2="24" y2="6"/>
                        <line x1="0" y1="12" x2="24" y2="12"/>
                        <line x1="0" y1="18" x2="24" y2="18"/>
                        {/* Vertical mortar - offset pattern */}
                        <line x1="6" y1="0" x2="6" y2="6"/>
                        <line x1="18" y1="0" x2="18" y2="6"/>
                        <line x1="0" y1="6" x2="0" y2="12"/>
                        <line x1="12" y1="6" x2="12" y2="12"/>
                        <line x1="6" y1="12" x2="6" y2="18"/>
                        <line x1="18" y1="12" x2="18" y2="18"/>
                        <line x1="0" y1="18" x2="0" y2="24"/>
                        <line x1="12" y1="18" x2="12" y2="24"/>
                    </g>
                    {/* Top cap */}
                    <rect x="0" y="0" width="24" height="3" fill="currentColor" className="text-stone-400"/>
                </g>
            );
            break;

        case 'v': // GRAVEL (Gravel path)
            content = (
                <g>
                    {/* Sandy gravel base */}
                    <rect x="0" y="0" width="24" height="24" fill="currentColor" className="text-amber-200"/>
                    {/* Gravel pebbles */}
                    <g opacity="0.5">
                        <circle cx={3 + seed * 4} cy={5 + seed * 3} r="1.5" fill="currentColor" className="text-stone-400"/>
                        <circle cx={12 + seed * 5} cy={8 + seed * 4} r="1.2" fill="currentColor" className="text-stone-500"/>
                        <circle cx={20 - seed * 3} cy={4 + seed * 2} r="1" fill="currentColor" className="text-stone-400"/>
                        <circle cx={6 + seed * 2} cy={16 + seed * 3} r="1.3" fill="currentColor" className="text-stone-500"/>
                        <circle cx={15 + seed * 4} cy={18 - seed * 2} r="1.1" fill="currentColor" className="text-stone-400"/>
                        <circle cx={8 + seed * 6} cy={12 + seed * 2} r="0.9" fill="currentColor" className="text-stone-500"/>
                        <circle cx={18 - seed * 2} cy={14 + seed * 3} r="1.4" fill="currentColor" className="text-stone-400"/>
                        <circle cx={4 + seed * 3} cy={21 - seed * 2} r="1" fill="currentColor" className="text-stone-500"/>
                    </g>
                </g>
            );
            break;

        case 'H': // HEDGE (Trimmed hedge)
            content = (
                <g>
                    {/* Hedge body */}
                    <rect x="2" y="4" width="20" height="16" fill="currentColor" className="text-green-700"/>
                    {/* Leaf texture */}
                    <g opacity="0.4">
                        <circle cx="6" cy="8" r="3" fill="currentColor" className="text-green-500"/>
                        <circle cx="12" cy="6" r="3" fill="currentColor" className="text-green-600"/>
                        <circle cx="18" cy="8" r="3" fill="currentColor" className="text-green-500"/>
                        <circle cx="8" cy="14" r="3" fill="currentColor" className="text-green-600"/>
                        <circle cx="16" cy="14" r="3" fill="currentColor" className="text-green-500"/>
                        <circle cx="12" cy="18" r="3" fill="currentColor" className="text-green-600"/>
                    </g>
                    {/* Trimmed flat top */}
                    <rect x="2" y="3" width="20" height="2" fill="currentColor" className="text-green-800"/>
                    {/* Shadow */}
                    <rect x="2" y="18" width="20" height="2" fill="currentColor" className="text-green-900/30"/>
                </g>
            );
            break;

        case 'w': // FLOWERBED (Colorful flowers)
            content = (
                <g>
                    {/* Soil base */}
                    <rect x="0" y="0" width="24" height="24" fill="currentColor" className="text-amber-900"/>
                    {/* Flowers with varied colors based on seed */}
                    <g>
                        {/* Flower 1 */}
                        <circle cx="6" cy="8" r="3" fill={seed < 0.33 ? '#F472B6' : seed < 0.66 ? '#FBBF24' : '#A78BFA'}/>
                        <circle cx="6" cy="8" r="1" fill="#FBBF24"/>
                        {/* Flower 2 */}
                        <circle cx="16" cy="6" r="2.5" fill={seed < 0.5 ? '#FB7185' : '#60A5FA'}/>
                        <circle cx="16" cy="6" r="0.8" fill="#FDE047"/>
                        {/* Flower 3 */}
                        <circle cx="10" cy="16" r="2.8" fill={seed < 0.4 ? '#C084FC' : '#4ADE80'}/>
                        <circle cx="10" cy="16" r="0.9" fill="#FBBF24"/>
                        {/* Flower 4 */}
                        <circle cx="18" cy="18" r="2" fill={seed < 0.6 ? '#FB923C' : '#F472B6'}/>
                        <circle cx="18" cy="18" r="0.6" fill="#FDE047"/>
                        {/* Leaves */}
                        <ellipse cx="4" cy="14" rx="2" ry="4" fill="currentColor" className="text-green-600" transform="rotate(-20 4 14)"/>
                        <ellipse cx="20" cy="12" rx="2" ry="3" fill="currentColor" className="text-green-600" transform="rotate(15 20 12)"/>
                    </g>
                </g>
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
