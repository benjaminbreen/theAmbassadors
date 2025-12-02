import React from 'react';

// Cultural wall tile graphics

// ===========================================
// HAUSSMANN FACADE GENERATOR
// Parisian building facades with consistent massing but varied details
// ===========================================

export const generateHaussmannFacade = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const variant = Math.floor((hash - Math.floor(hash)) * 5);
    const hasBalcony = (hash * 7) % 1 > 0.5;
    const windowStyle = Math.floor((hash * 13) % 3);

    // Consistent Haussmann color palette - cream/beige limestone
    const stoneColors = ['#E8DCC8', '#DDD0BC', '#E5D9C3', '#D8CCBA', '#E2D6C4'];
    const stoneBase = stoneColors[variant];
    const stoneDark = '#C4B8A4';
    const stoneLight = '#F5EDE0';
    const ironBlack = '#2C2C2C';
    const windowBlue = '#4A5568';

    return (
        <g>
            {/* Base stone facade */}
            <rect width="24" height="24" fill={stoneBase}/>

            {/* Horizontal coursing lines - ashlar masonry effect */}
            <line x1="0" y1="6" x2="24" y2="6" stroke={stoneDark} strokeWidth="0.3" opacity="0.4"/>
            <line x1="0" y1="12" x2="24" y2="12" stroke={stoneDark} strokeWidth="0.3" opacity="0.4"/>
            <line x1="0" y1="18" x2="24" y2="18" stroke={stoneDark} strokeWidth="0.3" opacity="0.4"/>

            {/* Vertical joint lines (staggered) */}
            <line x1="8" y1="0" x2="8" y2="6" stroke={stoneDark} strokeWidth="0.2" opacity="0.3"/>
            <line x1="16" y1="0" x2="16" y2="6" stroke={stoneDark} strokeWidth="0.2" opacity="0.3"/>
            <line x1="4" y1="6" x2="4" y2="12" stroke={stoneDark} strokeWidth="0.2" opacity="0.3"/>
            <line x1="12" y1="6" x2="12" y2="12" stroke={stoneDark} strokeWidth="0.2" opacity="0.3"/>
            <line x1="20" y1="6" x2="20" y2="12" stroke={stoneDark} strokeWidth="0.2" opacity="0.3"/>
            <line x1="8" y1="12" x2="8" y2="18" stroke={stoneDark} strokeWidth="0.2" opacity="0.3"/>
            <line x1="16" y1="12" x2="16" y2="18" stroke={stoneDark} strokeWidth="0.2" opacity="0.3"/>

            {/* Window - tall French style */}
            <rect x="6" y="3" width="12" height="16" fill={windowBlue}/>
            <rect x="7" y="4" width="10" height="14" fill="#1A202C" opacity="0.6"/>

            {/* Window frame - cream painted wood */}
            <rect x="6" y="3" width="12" height="16" fill="none" stroke={stoneLight} strokeWidth="1"/>

            {/* Window muntins - cross pattern */}
            <line x1="12" y1="3" x2="12" y2="19" stroke={stoneLight} strokeWidth="0.8"/>
            <line x1="6" y1="11" x2="18" y2="11" stroke={stoneLight} strokeWidth="0.8"/>

            {/* Window style variations */}
            {windowStyle === 0 && (
                <>
                    {/* Arched top */}
                    <path d="M6 5 Q12 1 18 5" fill={stoneBase} stroke={stoneDark} strokeWidth="0.3"/>
                    <path d="M7 5 Q12 2 17 5" fill={windowBlue}/>
                </>
            )}
            {windowStyle === 1 && (
                <>
                    {/* Pediment/cornice above */}
                    <rect x="4" y="1" width="16" height="2" fill={stoneDark}/>
                    <path d="M5 1 L12 -1 L19 1" fill={stoneLight} stroke={stoneDark} strokeWidth="0.3"/>
                </>
            )}

            {/* Decorative lintel above window */}
            <rect x="5" y="2" width="14" height="1.5" fill={stoneDark} opacity="0.6"/>

            {/* Window sill */}
            <rect x="5" y="19" width="14" height="1.5" fill={stoneDark}/>
            <rect x="5" y="19" width="14" height="0.5" fill={stoneLight}/>

            {/* Iron balcony railing (on some tiles) */}
            {hasBalcony && (
                <g>
                    {/* Balcony floor/support */}
                    <rect x="4" y="20" width="16" height="1" fill={stoneDark}/>
                    {/* Iron railing */}
                    <rect x="4" y="21" width="0.5" height="3" fill={ironBlack}/>
                    <rect x="19.5" y="21" width="0.5" height="3" fill={ironBlack}/>
                    <line x1="4" y1="22" x2="20" y2="22" stroke={ironBlack} strokeWidth="0.8"/>
                    {/* Decorative ironwork */}
                    <circle cx="8" cy="22.5" r="0.8" fill="none" stroke={ironBlack} strokeWidth="0.4"/>
                    <circle cx="12" cy="22.5" r="0.8" fill="none" stroke={ironBlack} strokeWidth="0.4"/>
                    <circle cx="16" cy="22.5" r="0.8" fill="none" stroke={ironBlack} strokeWidth="0.4"/>
                </g>
            )}

            {/* Light reflection on window */}
            <rect x="8" y="5" width="3" height="4" fill="#87CEEB" opacity="0.15"/>

            {/* Shadow beneath window sill */}
            <rect x="6" y="20" width="12" height="1" fill="#000" opacity="0.1"/>
        </g>
    );
};

// Simpler solid facade for massing (no window - represents wall between buildings)
export const generateSolidFacade = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const variant = Math.floor((hash - Math.floor(hash)) * 5);

    const stoneColors = ['#E8DCC8', '#DDD0BC', '#E5D9C3', '#D8CCBA', '#E2D6C4'];
    const stoneBase = stoneColors[variant];
    const stoneDark = '#C4B8A4';

    return (
        <g>
            {/* Base stone facade */}
            <rect width="24" height="24" fill={stoneBase}/>

            {/* Horizontal coursing */}
            <line x1="0" y1="4" x2="24" y2="4" stroke={stoneDark} strokeWidth="0.3" opacity="0.5"/>
            <line x1="0" y1="8" x2="24" y2="8" stroke={stoneDark} strokeWidth="0.3" opacity="0.5"/>
            <line x1="0" y1="12" x2="24" y2="12" stroke={stoneDark} strokeWidth="0.3" opacity="0.5"/>
            <line x1="0" y1="16" x2="24" y2="16" stroke={stoneDark} strokeWidth="0.3" opacity="0.5"/>
            <line x1="0" y1="20" x2="24" y2="20" stroke={stoneDark} strokeWidth="0.3" opacity="0.5"/>

            {/* Vertical joints (staggered ashlar pattern) */}
            <line x1="6" y1="0" x2="6" y2="4" stroke={stoneDark} strokeWidth="0.2" opacity="0.4"/>
            <line x1="12" y1="0" x2="12" y2="4" stroke={stoneDark} strokeWidth="0.2" opacity="0.4"/>
            <line x1="18" y1="0" x2="18" y2="4" stroke={stoneDark} strokeWidth="0.2" opacity="0.4"/>
            <line x1="3" y1="4" x2="3" y2="8" stroke={stoneDark} strokeWidth="0.2" opacity="0.4"/>
            <line x1="9" y1="4" x2="9" y2="8" stroke={stoneDark} strokeWidth="0.2" opacity="0.4"/>
            <line x1="15" y1="4" x2="15" y2="8" stroke={stoneDark} strokeWidth="0.2" opacity="0.4"/>
            <line x1="21" y1="4" x2="21" y2="8" stroke={stoneDark} strokeWidth="0.2" opacity="0.4"/>
            <line x1="6" y1="8" x2="6" y2="12" stroke={stoneDark} strokeWidth="0.2" opacity="0.4"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke={stoneDark} strokeWidth="0.2" opacity="0.4"/>
            <line x1="18" y1="8" x2="18" y2="12" stroke={stoneDark} strokeWidth="0.2" opacity="0.4"/>
            <line x1="3" y1="12" x2="3" y2="16" stroke={stoneDark} strokeWidth="0.2" opacity="0.4"/>
            <line x1="9" y1="12" x2="9" y2="16" stroke={stoneDark} strokeWidth="0.2" opacity="0.4"/>
            <line x1="15" y1="12" x2="15" y2="16" stroke={stoneDark} strokeWidth="0.2" opacity="0.4"/>
            <line x1="21" y1="12" x2="21" y2="16" stroke={stoneDark} strokeWidth="0.2" opacity="0.4"/>
            <line x1="6" y1="16" x2="6" y2="20" stroke={stoneDark} strokeWidth="0.2" opacity="0.4"/>
            <line x1="12" y1="16" x2="12" y2="20" stroke={stoneDark} strokeWidth="0.2" opacity="0.4"/>
            <line x1="18" y1="16" x2="18" y2="20" stroke={stoneDark} strokeWidth="0.2" opacity="0.4"/>

            {/* Subtle weathering/shadows */}
            <rect x="0" y="22" width="24" height="2" fill="#000" opacity="0.08"/>
        </g>
    );
};

// ===========================================
// WALL CATEGORY HELPERS
// ===========================================

// Biomes that should use building-style walls (with windows, wainscoting)
const BUILDING_BIOMES = new Set(['STREET', 'SALON', 'GRAND_HALL', 'GALERIE', 'CONCERT_HALL', 'TROCADERO']);

// Biomes that should use garden-style walls (stone, hedges, no windows)
const GARDEN_BIOMES = new Set(['GARDEN', 'WATERFALL', 'ESPLANADE', 'BRIDGE', 'GATE']);

// Check if a biome is an outdoor/garden type
export const isGardenBiome = (biome: string): boolean => GARDEN_BIOMES.has(biome);

// Check if a biome is a building/interior type
export const isBuildingBiome = (biome: string): boolean => BUILDING_BIOMES.has(biome);

export const WALL_TILES: Record<string, JSX.Element> = {
    // Default - simple stone/plaster wall WITHOUT windows (neutral fallback)
    'DEFAULT': (
        <g>
            {/* Simple plastered wall - no window */}
            <rect width="24" height="24" fill="#D4C8B4"/>
            {/* Subtle texture */}
            <rect width="24" height="24" fill="#C8BCA8" opacity="0.3"/>
            {/* Stone coursing lines */}
            <line x1="0" y1="6" x2="24" y2="6" stroke="#B8AC98" strokeWidth="0.4" opacity="0.5"/>
            <line x1="0" y1="12" x2="24" y2="12" stroke="#B8AC98" strokeWidth="0.4" opacity="0.5"/>
            <line x1="0" y1="18" x2="24" y2="18" stroke="#B8AC98" strokeWidth="0.4" opacity="0.5"/>
            {/* Vertical joints */}
            <line x1="8" y1="0" x2="8" y2="6" stroke="#B8AC98" strokeWidth="0.2" opacity="0.4"/>
            <line x1="16" y1="0" x2="16" y2="6" stroke="#B8AC98" strokeWidth="0.2" opacity="0.4"/>
            <line x1="4" y1="6" x2="4" y2="12" stroke="#B8AC98" strokeWidth="0.2" opacity="0.4"/>
            <line x1="12" y1="6" x2="12" y2="12" stroke="#B8AC98" strokeWidth="0.2" opacity="0.4"/>
            <line x1="20" y1="6" x2="20" y2="12" stroke="#B8AC98" strokeWidth="0.2" opacity="0.4"/>
        </g>
    ),

    // ===========================================
    // GARDEN/OUTDOOR WALLS
    // ===========================================

    // Garden stone wall - rough cut stone, mossy
    'GARDEN': (
        <g>
            {/* Base stone color */}
            <rect width="24" height="24" fill="#8B8878"/>
            {/* Individual stones */}
            <rect x="0" y="0" width="11" height="7" fill="#9A9888" stroke="#6B6858" strokeWidth="0.5"/>
            <rect x="12" y="0" width="12" height="8" fill="#8A8A78" stroke="#6B6858" strokeWidth="0.5"/>
            <rect x="0" y="8" width="8" height="8" fill="#929282" stroke="#6B6858" strokeWidth="0.5"/>
            <rect x="9" y="8" width="15" height="7" fill="#888878" stroke="#6B6858" strokeWidth="0.5"/>
            <rect x="0" y="16" width="14" height="8" fill="#8E8E7E" stroke="#6B6858" strokeWidth="0.5"/>
            <rect x="15" y="15" width="9" height="9" fill="#949484" stroke="#6B6858" strokeWidth="0.5"/>
            {/* Moss patches */}
            <ellipse cx="5" cy="4" rx="2" ry="1" fill="#5D6B4A" opacity="0.4"/>
            <ellipse cx="20" cy="12" rx="1.5" ry="1" fill="#4D5B3A" opacity="0.3"/>
            <ellipse cx="8" cy="20" rx="2" ry="1.5" fill="#5D6B4A" opacity="0.35"/>
            {/* Weathering */}
            <rect x="0" y="22" width="24" height="2" fill="#6B6858" opacity="0.3"/>
        </g>
    ),

    // Waterfall area - wet stone wall
    'WATERFALL': (
        <g>
            {/* Wet dark stone */}
            <rect width="24" height="24" fill="#5A5A5A"/>
            {/* Stone blocks */}
            <rect x="0" y="0" width="12" height="8" fill="#686868" stroke="#4A4A4A" strokeWidth="0.5"/>
            <rect x="12" y="0" width="12" height="6" fill="#606060" stroke="#4A4A4A" strokeWidth="0.5"/>
            <rect x="0" y="8" width="8" height="10" fill="#5E5E5E" stroke="#4A4A4A" strokeWidth="0.5"/>
            <rect x="8" y="6" width="16" height="9" fill="#646464" stroke="#4A4A4A" strokeWidth="0.5"/>
            <rect x="0" y="18" width="14" height="6" fill="#626262" stroke="#4A4A4A" strokeWidth="0.5"/>
            <rect x="14" y="15" width="10" height="9" fill="#585858" stroke="#4A4A4A" strokeWidth="0.5"/>
            {/* Wet sheen */}
            <rect x="2" y="3" width="6" height="2" fill="#7A9AB0" opacity="0.2"/>
            <rect x="14" y="10" width="4" height="1.5" fill="#7A9AB0" opacity="0.15"/>
            <rect x="4" y="19" width="5" height="1.5" fill="#7A9AB0" opacity="0.2"/>
            {/* Water drip marks */}
            <line x1="6" y1="0" x2="6" y2="8" stroke="#7A9AB0" strokeWidth="0.3" opacity="0.3"/>
            <line x1="18" y1="6" x2="18" y2="15" stroke="#7A9AB0" strokeWidth="0.3" opacity="0.25"/>
        </g>
    ),

    // Esplanade - formal stone balustrade base
    'ESPLANADE': (
        <g>
            {/* Formal cut limestone */}
            <rect width="24" height="24" fill="#D8D0C0"/>
            {/* Ashlar masonry pattern */}
            <rect x="0" y="0" width="24" height="8" fill="#E0D8C8" stroke="#C0B8A8" strokeWidth="0.3"/>
            <rect x="0" y="8" width="24" height="8" fill="#D4CCC0" stroke="#C0B8A8" strokeWidth="0.3"/>
            <rect x="0" y="16" width="24" height="8" fill="#DCD4C4" stroke="#C0B8A8" strokeWidth="0.3"/>
            {/* Decorative cornice at top */}
            <rect x="0" y="0" width="24" height="2" fill="#C8C0B0"/>
            <rect x="0" y="2" width="24" height="1" fill="#E8E0D0"/>
            {/* Base molding */}
            <rect x="0" y="21" width="24" height="3" fill="#C8C0B0"/>
            <rect x="0" y="21" width="24" height="1" fill="#E8E0D0"/>
        </g>
    ),

    // Iron fence (for parks/gardens)
    'FENCE': (
        <g>
            {/* Stone base */}
            <rect x="0" y="18" width="24" height="6" fill="#8B8878"/>
            <rect x="0" y="18" width="24" height="1" fill="#9A9888"/>
            {/* Iron railings */}
            <rect x="2" y="2" width="1.5" height="16" fill="#2C2C2C"/>
            <rect x="7" y="2" width="1.5" height="16" fill="#2C2C2C"/>
            <rect x="12" y="2" width="1.5" height="16" fill="#2C2C2C"/>
            <rect x="17" y="2" width="1.5" height="16" fill="#2C2C2C"/>
            <rect x="22" y="2" width="1.5" height="16" fill="#2C2C2C"/>
            {/* Top rail */}
            <rect x="0" y="1" width="24" height="2" fill="#3A3A3A"/>
            {/* Decorative finials */}
            <circle cx="2.75" cy="1" r="1.5" fill="#2C2C2C"/>
            <circle cx="7.75" cy="1" r="1.5" fill="#2C2C2C"/>
            <circle cx="12.75" cy="1" r="1.5" fill="#2C2C2C"/>
            <circle cx="17.75" cy="1" r="1.5" fill="#2C2C2C"/>
            <circle cx="22.75" cy="1" r="1.5" fill="#2C2C2C"/>
            {/* Bottom rail */}
            <rect x="0" y="16" width="24" height="2" fill="#3A3A3A"/>
        </g>
    ),

    // Hedge wall (dense vegetation boundary)
    'HEDGE': (
        <g>
            {/* Dense foliage base */}
            <rect width="24" height="24" fill="#3D5A3D"/>
            {/* Leaf texture - layered circles */}
            <circle cx="4" cy="4" r="4" fill="#4A6B4A"/>
            <circle cx="12" cy="3" r="5" fill="#3F5F3F"/>
            <circle cx="20" cy="5" r="4" fill="#4A6B4A"/>
            <circle cx="2" cy="12" r="4" fill="#456B45"/>
            <circle cx="10" cy="10" r="5" fill="#3D5D3D"/>
            <circle cx="18" cy="12" r="4" fill="#4A6B4A"/>
            <circle cx="22" cy="14" r="3" fill="#3F5F3F"/>
            <circle cx="6" cy="18" r="5" fill="#456B45"/>
            <circle cx="14" cy="20" r="4" fill="#3D5D3D"/>
            <circle cx="22" cy="20" r="4" fill="#4A6B4A"/>
            {/* Highlights */}
            <circle cx="8" cy="6" r="2" fill="#5A7B5A" opacity="0.5"/>
            <circle cx="16" cy="14" r="2" fill="#5A7B5A" opacity="0.5"/>
            {/* Shadow at base */}
            <rect x="0" y="22" width="24" height="2" fill="#2D4A2D" opacity="0.5"/>
        </g>
    ),
    // Japanese shoji-style wall
    'JAPANESE': (
        <g>
            <rect width="24" height="24" fill="#F5F5DC"/>
            <rect x="0" y="0" width="24" height="24" fill="#E8DCC4"/>
            <rect x="1" y="1" width="10" height="10" fill="none" stroke="#8B5A2B" strokeWidth="1.5"/>
            <rect x="13" y="1" width="10" height="10" fill="none" stroke="#8B5A2B" strokeWidth="1.5"/>
            <rect x="1" y="13" width="10" height="10" fill="none" stroke="#8B5A2B" strokeWidth="1.5"/>
            <rect x="13" y="13" width="10" height="10" fill="none" stroke="#8B5A2B" strokeWidth="1.5"/>
            <line x1="6" y1="1" x2="6" y2="11" stroke="#8B5A2B" strokeWidth="0.5"/>
            <line x1="18" y1="1" x2="18" y2="11" stroke="#8B5A2B" strokeWidth="0.5"/>
            <line x1="6" y1="13" x2="6" y2="23" stroke="#8B5A2B" strokeWidth="0.5"/>
            <line x1="18" y1="13" x2="18" y2="23" stroke="#8B5A2B" strokeWidth="0.5"/>
            <line x1="1" y1="6" x2="11" y2="6" stroke="#8B5A2B" strokeWidth="0.5"/>
            <line x1="13" y1="6" x2="23" y2="6" stroke="#8B5A2B" strokeWidth="0.5"/>
            <line x1="1" y1="18" x2="11" y2="18" stroke="#8B5A2B" strokeWidth="0.5"/>
            <line x1="13" y1="18" x2="23" y2="18" stroke="#8B5A2B" strokeWidth="0.5"/>
            <rect x="2" y="2" width="8" height="8" fill="#FFF8E7" opacity="0.6"/>
            <rect x="14" y="2" width="8" height="8" fill="#FFF8E7" opacity="0.6"/>
            <rect x="2" y="14" width="8" height="8" fill="#FFF8E7" opacity="0.6"/>
            <rect x="14" y="14" width="8" height="8" fill="#FFF8E7" opacity="0.6"/>
        </g>
    ),
    // Chinese lacquered wall with gold trim
    'CHINESE': (
        <g>
            <rect width="24" height="24" fill="#8B0000"/>
            <rect x="0" y="0" width="24" height="3" fill="#FFD700" opacity="0.8"/>
            <rect x="0" y="21" width="24" height="3" fill="#FFD700" opacity="0.8"/>
            <rect x="0" y="0" width="3" height="24" fill="#FFD700" opacity="0.6"/>
            <rect x="21" y="0" width="3" height="24" fill="#FFD700" opacity="0.6"/>
            <circle cx="12" cy="12" r="6" fill="none" stroke="#FFD700" strokeWidth="1"/>
            <path d="M12 6 L14 10 L18 10 L15 13 L16 18 L12 15 L8 18 L9 13 L6 10 L10 10 Z" fill="#FFD700" opacity="0.7"/>
            <circle cx="6" cy="6" r="2" fill="#FFD700" opacity="0.5"/>
            <circle cx="18" cy="6" r="2" fill="#FFD700" opacity="0.5"/>
            <circle cx="6" cy="18" r="2" fill="#FFD700" opacity="0.5"/>
            <circle cx="18" cy="18" r="2" fill="#FFD700" opacity="0.5"/>
        </g>
    ),
    // Persian tile wall with geometric patterns
    'PERSIAN': (
        <g>
            <rect width="24" height="24" fill="#1E3A5F"/>
            <rect x="0" y="0" width="12" height="12" fill="#1A365D"/>
            <rect x="12" y="12" width="12" height="12" fill="#1A365D"/>
            <path d="M0 0 L12 12 M12 0 L0 12" stroke="#DAA520" strokeWidth="1"/>
            <path d="M12 12 L24 24 M24 12 L12 24" stroke="#DAA520" strokeWidth="1"/>
            <path d="M0 12 L12 24 M12 12 L0 24" stroke="#4FD1C5" strokeWidth="0.5"/>
            <path d="M12 0 L24 12 M24 0 L12 12" stroke="#4FD1C5" strokeWidth="0.5"/>
            <circle cx="6" cy="6" r="3" fill="none" stroke="#DAA520" strokeWidth="0.5"/>
            <circle cx="18" cy="6" r="3" fill="none" stroke="#DAA520" strokeWidth="0.5"/>
            <circle cx="6" cy="18" r="3" fill="none" stroke="#DAA520" strokeWidth="0.5"/>
            <circle cx="18" cy="18" r="3" fill="none" stroke="#DAA520" strokeWidth="0.5"/>
            <circle cx="12" cy="12" r="4" fill="#1E3A5F" stroke="#DAA520" strokeWidth="1"/>
        </g>
    ),
    // Egyptian hieroglyphic wall
    'EGYPTIAN': (
        <g>
            <rect width="24" height="24" fill="#D2691E"/>
            <rect x="0" y="0" width="24" height="24" fill="#C4A574" opacity="0.8"/>
            <rect x="2" y="2" width="8" height="8" fill="#B8956A"/>
            <rect x="14" y="2" width="8" height="8" fill="#B8956A"/>
            <rect x="2" y="14" width="8" height="8" fill="#B8956A"/>
            <rect x="14" y="14" width="8" height="8" fill="#B8956A"/>
            <path d="M6 4 L6 8 M4 6 L8 6" stroke="#8B7355" strokeWidth="1"/>
            <circle cx="18" cy="6" r="2" fill="none" stroke="#8B7355" strokeWidth="1"/>
            <path d="M4 16 L8 18 L4 20" stroke="#8B7355" strokeWidth="1" fill="none"/>
            <path d="M16 14 L18 18 L20 14" stroke="#8B7355" strokeWidth="1" fill="none"/>
            <rect x="10" y="10" width="4" height="4" fill="#FFD700" opacity="0.6"/>
            <line x1="0" y1="12" x2="24" y2="12" stroke="#8B7355" strokeWidth="0.5"/>
            <line x1="12" y1="0" x2="12" y2="24" stroke="#8B7355" strokeWidth="0.5"/>
        </g>
    ),
    // Moorish zellige tile wall
    'MOORISH': (
        <g>
            <rect width="24" height="24" fill="#0B4F6C"/>
            <rect x="0" y="0" width="8" height="8" fill="#0B4F6C"/>
            <rect x="8" y="8" width="8" height="8" fill="#0B4F6C"/>
            <rect x="16" y="0" width="8" height="8" fill="#0B4F6C"/>
            <rect x="0" y="16" width="8" height="8" fill="#0B4F6C"/>
            <rect x="16" y="16" width="8" height="8" fill="#0B4F6C"/>
            <path d="M4 0 L8 4 L4 8 L0 4 Z" fill="#FFD700" opacity="0.8"/>
            <path d="M12 8 L16 12 L12 16 L8 12 Z" fill="#FFD700" opacity="0.8"/>
            <path d="M20 0 L24 4 L20 8 L16 4 Z" fill="#FFD700" opacity="0.8"/>
            <path d="M4 16 L8 20 L4 24 L0 20 Z" fill="#FFD700" opacity="0.8"/>
            <path d="M20 16 L24 20 L20 24 L16 20 Z" fill="#FFD700" opacity="0.8"/>
            <circle cx="4" cy="4" r="2" fill="#FFF" opacity="0.3"/>
            <circle cx="12" cy="12" r="2" fill="#FFF" opacity="0.3"/>
            <circle cx="20" cy="4" r="2" fill="#FFF" opacity="0.3"/>
            <circle cx="4" cy="20" r="2" fill="#FFF" opacity="0.3"/>
            <circle cx="20" cy="20" r="2" fill="#FFF" opacity="0.3"/>
        </g>
    ),
    // Italian marble wall
    'ITALIAN': (
        <g>
            <rect width="24" height="24" fill="#E8E8E8"/>
            <rect x="1" y="1" width="10" height="10" fill="#F5F5F5"/>
            <rect x="13" y="1" width="10" height="10" fill="#FAFAFA"/>
            <rect x="1" y="13" width="10" height="10" fill="#FAFAFA"/>
            <rect x="13" y="13" width="10" height="10" fill="#F5F5F5"/>
            <path d="M2 3 Q6 5 4 8" stroke="#D4D4D4" strokeWidth="0.5" fill="none"/>
            <path d="M15 2 Q18 6 16 9" stroke="#D4D4D4" strokeWidth="0.5" fill="none"/>
            <path d="M3 15 Q7 18 5 21" stroke="#D4D4D4" strokeWidth="0.5" fill="none"/>
            <path d="M16 14 Q19 17 17 20" stroke="#D4D4D4" strokeWidth="0.5" fill="none"/>
            <line x1="0" y1="12" x2="24" y2="12" stroke="#D4AF37" strokeWidth="1.5"/>
            <line x1="12" y1="0" x2="12" y2="24" stroke="#D4AF37" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="2" fill="#D4AF37"/>
        </g>
    ),
    // Salon wall (elegant interior)
    'SALON': (
        <g>
            <rect width="24" height="24" fill="#4A5568"/>
            <rect x="0" y="0" width="24" height="4" fill="#B8860B" opacity="0.5"/>
            <rect x="0" y="20" width="24" height="4" fill="#5D4037"/>
            <rect x="2" y="5" width="20" height="14" fill="#6B4C41"/>
            <rect x="4" y="7" width="16" height="10" fill="#5D4037"/>
            <rect x="3" y="6" width="18" height="1" fill="#B8860B" opacity="0.4"/>
            <rect x="3" y="16" width="18" height="1" fill="#B8860B" opacity="0.4"/>
        </g>
    ),
    // Grand hall wall (industrial exposition style)
    'GRAND_HALL': (
        <g>
            <rect width="24" height="24" fill="#37474F"/>
            <rect x="0" y="0" width="24" height="24" fill="url(#steelGrad)" opacity="0.5"/>
            <rect x="2" y="2" width="2" height="20" fill="#455A64"/>
            <rect x="20" y="2" width="2" height="20" fill="#455A64"/>
            <rect x="10" y="2" width="4" height="20" fill="#546E7A"/>
            <line x1="0" y1="6" x2="24" y2="6" stroke="#64748B" strokeWidth="1"/>
            <line x1="0" y1="12" x2="24" y2="12" stroke="#64748B" strokeWidth="1"/>
            <line x1="0" y1="18" x2="24" y2="18" stroke="#64748B" strokeWidth="1"/>
            <circle cx="3" cy="3" r="1" fill="#64748B"/>
            <circle cx="21" cy="3" r="1" fill="#64748B"/>
            <circle cx="3" cy="21" r="1" fill="#64748B"/>
            <circle cx="21" cy="21" r="1" fill="#64748B"/>
        </g>
    ),
    // SOUK - Middle Eastern sandy stucco walls for Rue du Caire
    'SOUK': (
        <g>
            {/* Base sandy stucco */}
            <rect width="24" height="24" fill="#D4B896"/>
            <rect width="24" height="24" fill="#C9A882" opacity="0.5"/>

            {/* Stucco texture - irregular patches */}
            <ellipse cx="5" cy="8" rx="3" ry="2" fill="#CAAA7E" opacity="0.4"/>
            <ellipse cx="18" cy="5" rx="4" ry="2" fill="#D8C4A0" opacity="0.3"/>
            <ellipse cx="10" cy="18" rx="5" ry="3" fill="#C4A078" opacity="0.3"/>
            <ellipse cx="20" cy="20" rx="3" ry="2" fill="#D0B890" opacity="0.4"/>

            {/* Dark arched window/doorway - Mashrabiya style */}
            <path d="M6 8 Q12 2 18 8 L18 22 L6 22 Z" fill="#1A1510"/>
            <path d="M7 9 Q12 4 17 9 L17 21 L7 21 Z" fill="#0D0A08"/>

            {/* Wooden lattice/Mashrabiya screen inside */}
            <line x1="9" y1="10" x2="9" y2="20" stroke="#4A3828" strokeWidth="0.8"/>
            <line x1="12" y1="8" x2="12" y2="20" stroke="#4A3828" strokeWidth="0.8"/>
            <line x1="15" y1="10" x2="15" y2="20" stroke="#4A3828" strokeWidth="0.8"/>
            <line x1="7" y1="12" x2="17" y2="12" stroke="#4A3828" strokeWidth="0.6"/>
            <line x1="7" y1="16" x2="17" y2="16" stroke="#4A3828" strokeWidth="0.6"/>

            {/* Arch keystone */}
            <path d="M11 4 L12 2 L13 4" fill="#B8956A" stroke="#8B7355" strokeWidth="0.5"/>

            {/* Weathering at base */}
            <rect x="0" y="20" width="24" height="4" fill="#A08060" opacity="0.4"/>
            <rect x="0" y="22" width="24" height="2" fill="#806040" opacity="0.3"/>

            {/* Cracks and aging */}
            <path d="M2 5 L3 10 L2 12" stroke="#8B7355" strokeWidth="0.3" fill="none" opacity="0.5"/>
            <path d="M21 15 L20 18 L22 20" stroke="#8B7355" strokeWidth="0.3" fill="none" opacity="0.5"/>
        </g>
    ),
    // HIEROGLYPH - Egyptian accent wall with carved hieroglyphics
    'HIEROGLYPH': (
        <g>
            {/* Sandstone base */}
            <rect width="24" height="24" fill="#D4B896"/>
            <rect width="24" height="24" fill="#E8D4B8" opacity="0.6"/>

            {/* Carved border frame */}
            <rect x="1" y="1" width="22" height="22" fill="none" stroke="#B8956A" strokeWidth="2"/>
            <rect x="2" y="2" width="20" height="20" fill="none" stroke="#C4A574" strokeWidth="1"/>

            {/* Hieroglyphic cartouche */}
            <ellipse cx="12" cy="12" rx="7" ry="9" fill="#C9A882"/>
            <ellipse cx="12" cy="12" rx="6" ry="8" fill="#D4B896" stroke="#8B7355" strokeWidth="0.5"/>

            {/* Hieroglyphic symbols inside cartouche */}
            {/* Eye of Horus */}
            <ellipse cx="12" cy="6" rx="3" ry="1.5" fill="none" stroke="#5D4E37" strokeWidth="0.8"/>
            <circle cx="12" cy="6" r="0.8" fill="#5D4E37"/>
            <path d="M9 7 Q10 9 9 10" stroke="#5D4E37" strokeWidth="0.6" fill="none"/>
            <path d="M15 7 L16 8" stroke="#5D4E37" strokeWidth="0.6"/>

            {/* Ankh symbol */}
            <ellipse cx="12" cy="11" rx="1.5" ry="2" fill="none" stroke="#5D4E37" strokeWidth="0.8"/>
            <line x1="12" y1="13" x2="12" y2="17" stroke="#5D4E37" strokeWidth="0.8"/>
            <line x1="10" y1="14.5" x2="14" y2="14.5" stroke="#5D4E37" strokeWidth="0.8"/>

            {/* Bird (Horus falcon) */}
            <path d="M10 19 Q12 17 14 19 L13 20 L11 20 Z" fill="#5D4E37"/>
            <circle cx="13" cy="18.5" r="0.5" fill="#5D4E37"/>

            {/* Corner decorations - lotus flowers */}
            <path d="M3 3 Q5 5 3 7" stroke="#DAA520" strokeWidth="0.8" fill="none"/>
            <path d="M21 3 Q19 5 21 7" stroke="#DAA520" strokeWidth="0.8" fill="none"/>
            <path d="M3 21 Q5 19 3 17" stroke="#DAA520" strokeWidth="0.8" fill="none"/>
            <path d="M21 21 Q19 19 21 17" stroke="#DAA520" strokeWidth="0.8" fill="none"/>

            {/* Gold accents */}
            <circle cx="12" cy="3" r="1" fill="#DAA520"/>
            <circle cx="12" cy="21" r="1" fill="#DAA520"/>
        </g>
    ),
    // MESOAMERICAN - Aztec/Mayan style for Mexico pavilion
    'MESOAMERICAN': (
        <g>
            {/* Dark stone base */}
            <rect width="24" height="24" fill="#4A4A4A"/>
            <rect width="24" height="24" fill="#3D3D3D" opacity="0.7"/>

            {/* Stepped pyramid pattern border */}
            <path d="M0 0 L4 0 L4 4 L8 4 L8 8 L4 8 L4 4 L0 4 Z" fill="#5D5D5D"/>
            <path d="M24 0 L20 0 L20 4 L16 4 L16 8 L20 8 L20 4 L24 4 Z" fill="#5D5D5D"/>
            <path d="M0 24 L4 24 L4 20 L8 20 L8 16 L4 16 L4 20 L0 20 Z" fill="#5D5D5D"/>
            <path d="M24 24 L20 24 L20 20 L16 20 L16 16 L20 16 L20 20 L24 20 Z" fill="#5D5D5D"/>

            {/* Central deity face / sun stone */}
            <circle cx="12" cy="12" r="6" fill="#6B6B6B" stroke="#8B8B8B" strokeWidth="1"/>
            <circle cx="12" cy="12" r="4" fill="#5A5A5A"/>

            {/* Face features */}
            <rect x="10" y="10" width="1.5" height="2" fill="#2D2D2D"/>
            <rect x="12.5" y="10" width="1.5" height="2" fill="#2D2D2D"/>
            <rect x="10.5" y="13" width="3" height="1" fill="#2D2D2D"/>

            {/* Radiating lines (sun rays) */}
            <line x1="12" y1="5" x2="12" y2="2" stroke="#8B7355" strokeWidth="1"/>
            <line x1="12" y1="19" x2="12" y2="22" stroke="#8B7355" strokeWidth="1"/>
            <line x1="5" y1="12" x2="2" y2="12" stroke="#8B7355" strokeWidth="1"/>
            <line x1="19" y1="12" x2="22" y2="12" stroke="#8B7355" strokeWidth="1"/>
            <line x1="7" y1="7" x2="5" y2="5" stroke="#8B7355" strokeWidth="0.8"/>
            <line x1="17" y1="7" x2="19" y2="5" stroke="#8B7355" strokeWidth="0.8"/>
            <line x1="7" y1="17" x2="5" y2="19" stroke="#8B7355" strokeWidth="0.8"/>
            <line x1="17" y1="17" x2="19" y2="19" stroke="#8B7355" strokeWidth="0.8"/>

            {/* Jade/turquoise inlay accents */}
            <circle cx="6" cy="6" r="1.5" fill="#40E0D0" opacity="0.8"/>
            <circle cx="18" cy="6" r="1.5" fill="#40E0D0" opacity="0.8"/>
            <circle cx="6" cy="18" r="1.5" fill="#40E0D0" opacity="0.8"/>
            <circle cx="18" cy="18" r="1.5" fill="#40E0D0" opacity="0.8"/>
        </g>
    ),
};

// Directional Haussmann facade generators for street biome
export const generateHaussmannTop = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const variant = Math.floor((hash - Math.floor(hash)) * 5);
    const stoneColors = ['#E8DCC8', '#DDD0BC', '#E5D9C3', '#D8CCBA', '#E2D6C4'];
    const stoneBase = stoneColors[variant];
    const stoneDark = '#C4B8A4';
    const stoneLight = '#F5EDE0';
    const hasBalcony = (hash * 7) % 1 > 0.4;
    const ironBlack = '#2C2C2C';

    return (
        <g>
            {/* Base facade with roofline at bottom */}
            <rect width="24" height="20" fill={stoneBase}/>

            {/* Ashlar coursing */}
            <line x1="0" y1="5" x2="24" y2="5" stroke={stoneDark} strokeWidth="0.3" opacity="0.4"/>
            <line x1="0" y1="10" x2="24" y2="10" stroke={stoneDark} strokeWidth="0.3" opacity="0.4"/>
            <line x1="0" y1="15" x2="24" y2="15" stroke={stoneDark} strokeWidth="0.3" opacity="0.4"/>

            {/* Cornice at top */}
            <rect x="0" y="0" width="24" height="2" fill={stoneLight}/>
            <rect x="0" y="2" width="24" height="1" fill={stoneDark} opacity="0.5"/>

            {/* Top floor window (smaller dormer) */}
            <rect x="8" y="4" width="8" height="10" fill="#4A5568"/>
            <rect x="9" y="5" width="6" height="8" fill="#1A202C" opacity="0.6"/>
            <line x1="12" y1="4" x2="12" y2="14" stroke={stoneLight} strokeWidth="0.6"/>
            <rect x="7" y="3" width="10" height="1.5" fill={stoneDark}/>
            <rect x="7" y="14" width="10" height="1" fill={stoneDark}/>

            {/* Ground shadow / street level */}
            <rect x="0" y="20" width="24" height="4" fill="#1A1A2E"/>
            <rect x="0" y="18" width="24" height="2" fill={stoneDark} opacity="0.6"/>

            {/* Balcony rail at bottom of visible wall */}
            {hasBalcony && (
                <g>
                    <rect x="2" y="17" width="20" height="0.8" fill={ironBlack}/>
                    <rect x="2" y="15" width="0.4" height="3" fill={ironBlack}/>
                    <rect x="21.6" y="15" width="0.4" height="3" fill={ironBlack}/>
                    <circle cx="8" cy="16" r="0.6" fill="none" stroke={ironBlack} strokeWidth="0.3"/>
                    <circle cx="12" cy="16" r="0.6" fill="none" stroke={ironBlack} strokeWidth="0.3"/>
                    <circle cx="16" cy="16" r="0.6" fill="none" stroke={ironBlack} strokeWidth="0.3"/>
                </g>
            )}
        </g>
    );
};

export const generateHaussmannSide = (x: number, y: number, direction: 'left' | 'right'): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const variant = Math.floor((hash - Math.floor(hash)) * 5);
    const stoneColors = ['#D8CCBA', '#CEC2AE', '#D5C9B3', '#C8BCAA', '#D2C6B4']; // Slightly darker for side
    const stoneBase = stoneColors[variant];
    const stoneDark = '#B4A896';
    const stoneLight = '#E5D9C3';

    const isLeft = direction === 'left';

    return (
        <g>
            {/* Base side facade - in shadow, darker */}
            <rect width="24" height="24" fill={stoneBase}/>

            {/* Horizontal coursing */}
            <line x1="0" y1="4" x2="24" y2="4" stroke={stoneDark} strokeWidth="0.3" opacity="0.5"/>
            <line x1="0" y1="8" x2="24" y2="8" stroke={stoneDark} strokeWidth="0.3" opacity="0.5"/>
            <line x1="0" y1="12" x2="24" y2="12" stroke={stoneDark} strokeWidth="0.3" opacity="0.5"/>
            <line x1="0" y1="16" x2="24" y2="16" stroke={stoneDark} strokeWidth="0.3" opacity="0.5"/>
            <line x1="0" y1="20" x2="24" y2="20" stroke={stoneDark} strokeWidth="0.3" opacity="0.5"/>

            {/* Vertical joints */}
            <line x1="6" y1="0" x2="6" y2="24" stroke={stoneDark} strokeWidth="0.2" opacity="0.3"/>
            <line x1="12" y1="0" x2="12" y2="24" stroke={stoneDark} strokeWidth="0.2" opacity="0.3"/>
            <line x1="18" y1="0" x2="18" y2="24" stroke={stoneDark} strokeWidth="0.2" opacity="0.3"/>

            {/* Edge shadow/highlight based on direction */}
            {isLeft ? (
                <>
                    <rect x="0" y="0" width="2" height="24" fill="#0D0D1A" opacity="0.4"/>
                    <rect x="22" y="0" width="2" height="24" fill={stoneLight} opacity="0.3"/>
                </>
            ) : (
                <>
                    <rect x="0" y="0" width="2" height="24" fill={stoneLight} opacity="0.3"/>
                    <rect x="22" y="0" width="2" height="24" fill="#0D0D1A" opacity="0.4"/>
                </>
            )}

            {/* Subtle shadow gradient at bottom */}
            <rect x="0" y="22" width="24" height="2" fill="#000" opacity="0.1"/>
        </g>
    );
};

// Directional wall renderers for SNES-style depth
export const getDirectionalWallColors = (wallKey: string) => {
    const colors: Record<string, { base: string; highlight: string; side: string }> = {
        'JAPANESE': { base: '#F5F5DC', highlight: '#8B5A2B', side: '#6B4423' },
        'CHINESE': { base: '#8B0000', highlight: '#FFD700', side: '#5C0000' },
        'PERSIAN': { base: '#1E3A5F', highlight: '#DAA520', side: '#162C45' },
        'EGYPTIAN': { base: '#D4B896', highlight: '#DAA520', side: '#B8956A' },
        'MOORISH': { base: '#0B4F6C', highlight: '#FFD700', side: '#083B52' },
        'ITALIAN': { base: '#E8E8E8', highlight: '#D4AF37', side: '#C0C0C0' },
        'STREET': { base: '#E8DCC8', highlight: '#F5EDE0', side: '#D8CCBA' },
        'SOUK': { base: '#D4B896', highlight: '#E8D4B8', side: '#B8956A' },
        'HIEROGLYPH': { base: '#D4B896', highlight: '#DAA520', side: '#C4A574' },
        'MESOAMERICAN': { base: '#4A4A4A', highlight: '#40E0D0', side: '#3D3D3D' },
        // New cultural styles
        'PORTUGUESE': { base: '#1E4D7B', highlight: '#D4AF37', side: '#153A5C' },
        'SPANISH': { base: '#C4572D', highlight: '#E8C4A0', side: '#A64B2A' },
        'RUSSIAN': { base: '#1B5E20', highlight: '#FFD700', side: '#0D4A12' },
        'INDIAN': { base: '#B71C1C', highlight: '#FFD700', side: '#8B0000' },
        'GREEK': { base: '#E8E8E8', highlight: '#1565C0', side: '#C0C0C0' },
        'SOUTH_AMERICAN': { base: '#4A5F4A', highlight: '#FFD700', side: '#2D4A2D' },
        'AFRICAN': { base: '#8B4513', highlight: '#DAA520', side: '#6B3A10' },
        'SOUTHEAST_ASIAN': { base: '#5D4037', highlight: '#CD853F', side: '#3E2723' },
        'BEAUX_ARTS': { base: '#E8DCC8', highlight: '#B8860B', side: '#C4B8A4' },
        'TROCADERO': { base: '#3D4654', highlight: '#B8860B', side: '#2D3748' },
        'GALERIE': { base: '#37474F', highlight: '#78909C', side: '#263238' },
        'SALON': { base: '#4A5568', highlight: '#B8860B', side: '#3D4250' },
        'GRAND_HALL': { base: '#37474F', highlight: '#90A4AE', side: '#263238' },
        // Garden/outdoor biome colors
        'GARDEN': { base: '#8B8878', highlight: '#9A9888', side: '#6B6858' },
        'WATERFALL': { base: '#5A5A5A', highlight: '#6A6A6A', side: '#4A4A4A' },
        'ESPLANADE': { base: '#D8D0C0', highlight: '#E8E0D0', side: '#C8C0B0' },
        'HEDGE': { base: '#3D5A3D', highlight: '#4A6B4A', side: '#2D4A2D' },
        'FENCE': { base: '#8B8878', highlight: '#9A9888', side: '#6B6858' },
        'DEFAULT': { base: '#D4C8B4', highlight: '#E4D8C4', side: '#C4B8A4' },
    };
    return colors[wallKey] || colors['DEFAULT'];
};

// ===========================================
// TWO-TILE TALL BACK WALL GENERATOR
// Creates a dollhouse effect by rendering walls that extend upward
// For interiors: wainscoting and decorative panels
// For gardens: stone walls or hedges
// ===========================================
export const generateTallBackWall = (x: number, y: number, wallStyle: string): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const variant = Math.floor((hash - Math.floor(hash)) * 4);

    // Check if this is a garden/outdoor biome
    const isGarden = GARDEN_BIOMES.has(wallStyle);

    if (isGarden) {
        return generateTallGardenWall(x, y, wallStyle, variant);
    }

    // Interior wall colors by style - culturally appropriate colors
    const wallColors: Record<string, { upper: string; lower: string; trim: string; wainscot: string }> = {
        'SALON': { upper: '#4A5568', lower: '#5D4037', trim: '#B8860B', wainscot: '#6B4C41' },
        'JAPANESE': { upper: '#E8DCC4', lower: '#D4C4A8', trim: '#8B5A2B', wainscot: '#C4B494' },
        'CHINESE': { upper: '#8B0000', lower: '#6B0000', trim: '#FFD700', wainscot: '#5C0000' },
        'PERSIAN': { upper: '#1E3A5F', lower: '#162C45', trim: '#DAA520', wainscot: '#0F1F32' },
        'EGYPTIAN': { upper: '#D4B896', lower: '#C4A574', trim: '#DAA520', wainscot: '#B8956A' },
        'MOORISH': { upper: '#0B4F6C', lower: '#083B52', trim: '#FFD700', wainscot: '#052838' },
        'ITALIAN': { upper: '#F5F5F5', lower: '#E8E8E8', trim: '#D4AF37', wainscot: '#D4D4D4' },
        'SOUK': { upper: '#D4B896', lower: '#C9A882', trim: '#8B7355', wainscot: '#B8956A' },
        'HIEROGLYPH': { upper: '#E8D4B8', lower: '#D4B896', trim: '#DAA520', wainscot: '#C4A574' },
        'MESOAMERICAN': { upper: '#4A4A4A', lower: '#3D3D3D', trim: '#40E0D0', wainscot: '#2D2D2D' },
        'TROCADERO': { upper: '#3D4654', lower: '#4A5568', trim: '#B8860B', wainscot: '#2D3748' },
        'GRAND_HALL': { upper: '#37474F', lower: '#455A64', trim: '#90A4AE', wainscot: '#263238' },
        'GALERIE': { upper: '#37474F', lower: '#455A64', trim: '#78909C', wainscot: '#263238' },
        // New cultural styles
        'PORTUGUESE': { upper: '#1E4D7B', lower: '#F5F5F0', trim: '#D4AF37', wainscot: '#2B5A8C' }, // Blue azulejo tiles
        'SPANISH': { upper: '#C4572D', lower: '#E8C4A0', trim: '#8B4513', wainscot: '#A64B2A' }, // Terracotta and ochre
        'RUSSIAN': { upper: '#1B5E20', lower: '#2E7D32', trim: '#FFD700', wainscot: '#0D4A12' }, // Rich green and gold
        'INDIAN': { upper: '#B71C1C', lower: '#C62828', trim: '#FFD700', wainscot: '#8B0000' }, // Deep red and gold
        'GREEK': { upper: '#E8E8E8', lower: '#F5F5F5', trim: '#1565C0', wainscot: '#DCDCDC' }, // White marble, blue trim
        'SOUTH_AMERICAN': { upper: '#4A5F4A', lower: '#3D5A3D', trim: '#FFD700', wainscot: '#2D4A2D' }, // Forest green and gold
        'AFRICAN': { upper: '#8B4513', lower: '#A0522D', trim: '#DAA520', wainscot: '#6B3A10' }, // Warm earth tones
        'SOUTHEAST_ASIAN': { upper: '#5D4037', lower: '#4E342E', trim: '#CD853F', wainscot: '#3E2723' }, // Dark wood tones
        'BEAUX_ARTS': { upper: '#E8DCC8', lower: '#D4C8B4', trim: '#B8860B', wainscot: '#C4B8A4' }, // Elegant cream and gold
        'DEFAULT': { upper: '#D4C8B4', lower: '#C4B8A4', trim: '#B8AC98', wainscot: '#A89C88' },
    };

    const colors = wallColors[wallStyle] || wallColors['DEFAULT'];

    // Culture-specific decorations generator
    const getCulturalDecoration = () => {
        switch (wallStyle) {
            case 'EGYPTIAN':
            case 'HIEROGLYPH':
                // Hieroglyphics on upper wall
                return (
                    <>
                        {/* Cartouche with hieroglyphics */}
                        <rect x="5" y="-19" width="14" height="9" fill="#D4B896" stroke="#DAA520" strokeWidth="0.5" rx="1"/>
                        {/* Hieroglyphic symbols */}
                        <path d="M7 -17 L8 -14 L9 -17 M8 -15 L8 -12" stroke="#2F4F4F" strokeWidth="0.5" fill="none"/>
                        <circle cx="12" cy="-15" r="2" fill="none" stroke="#2F4F4F" strokeWidth="0.5"/>
                        <path d="M12 -15 L12 -12" stroke="#2F4F4F" strokeWidth="0.5"/>
                        <path d="M15 -17 Q17 -15 15 -13 L17 -12" stroke="#2F4F4F" strokeWidth="0.5" fill="none"/>
                        {/* Eye of Horus motif */}
                        <ellipse cx="12" cy="4" rx="4" ry="2" fill="none" stroke="#DAA520" strokeWidth="0.8"/>
                        <circle cx="12" cy="4" r="1" fill="#DAA520"/>
                    </>
                );
            case 'CHINESE':
                // Red lacquer with gold dragon motifs
                return (
                    <>
                        {/* Gold frame panel */}
                        <rect x="4" y="-20" width="16" height="12" fill="#5C0000" stroke="#FFD700" strokeWidth="1"/>
                        {/* Stylized dragon/cloud pattern */}
                        <path d="M7 -16 Q12 -18 17 -16 Q14 -14 17 -12" stroke="#FFD700" strokeWidth="0.8" fill="none"/>
                        <circle cx="8" cy="-15" r="1.5" fill="#FFD700"/>
                        {/* Chinese lattice on lower */}
                        <path d="M4 2 L8 6 M4 6 L8 2" stroke="#FFD700" strokeWidth="0.4"/>
                        <path d="M16 2 L20 6 M16 6 L20 2" stroke="#FFD700" strokeWidth="0.4"/>
                    </>
                );
            case 'JAPANESE':
                // Shoji screen / bamboo motif
                return (
                    <>
                        {/* Bamboo panel frame */}
                        <rect x="5" y="-19" width="14" height="10" fill="#E8DCC4" stroke="#8B5A2B" strokeWidth="0.5"/>
                        {/* Bamboo stalks */}
                        <line x1="8" y1="-18" x2="8" y2="-10" stroke="#6B8E23" strokeWidth="1"/>
                        <line x1="12" y1="-18" x2="12" y2="-10" stroke="#556B2F" strokeWidth="1"/>
                        <line x1="16" y1="-18" x2="16" y2="-10" stroke="#6B8E23" strokeWidth="1"/>
                        {/* Bamboo joints */}
                        <line x1="7" y1="-14" x2="9" y2="-14" stroke="#556B2F" strokeWidth="0.5"/>
                        <line x1="11" y1="-16" x2="13" y2="-16" stroke="#556B2F" strokeWidth="0.5"/>
                    </>
                );
            case 'PORTUGUESE':
                // Blue and white azulejo tiles
                return (
                    <>
                        {/* Tile grid upper */}
                        <rect x="4" y="-19" width="6" height="6" fill="#F5F5F0" stroke="#1E4D7B" strokeWidth="0.3"/>
                        <rect x="10" y="-19" width="6" height="6" fill="#1E4D7B" stroke="#F5F5F0" strokeWidth="0.3"/>
                        <rect x="4" y="-13" width="6" height="6" fill="#1E4D7B" stroke="#F5F5F0" strokeWidth="0.3"/>
                        <rect x="10" y="-13" width="6" height="6" fill="#F5F5F0" stroke="#1E4D7B" strokeWidth="0.3"/>
                        {/* Decorative motifs */}
                        <circle cx="7" cy="-16" r="1.5" fill="#1E4D7B"/>
                        <circle cx="13" cy="-16" r="1.5" fill="#F5F5F0"/>
                    </>
                );
            case 'MOORISH':
                // Geometric zellige tiles
                return (
                    <>
                        {/* Star pattern */}
                        <polygon points="12,-18 14,-15 17,-15 15,-13 16,-10 12,-12 8,-10 9,-13 7,-15 10,-15" fill="#FFD700" stroke="#052838" strokeWidth="0.3"/>
                        {/* Smaller geometric accents */}
                        <rect x="5" y="-12" width="3" height="3" fill="#FFD700" transform="rotate(45 6.5 -10.5)"/>
                        <rect x="16" y="-12" width="3" height="3" fill="#FFD700" transform="rotate(45 17.5 -10.5)"/>
                    </>
                );
            case 'RUSSIAN':
                // Onion dome / orthodox motifs
                return (
                    <>
                        {/* Gold icon frame */}
                        <rect x="6" y="-19" width="12" height="10" fill="#0D4A12" stroke="#FFD700" strokeWidth="1"/>
                        {/* Onion dome shape */}
                        <path d="M12 -17 Q9 -16 9 -13 Q9 -11 12 -11 Q15 -11 15 -13 Q15 -16 12 -17" fill="#FFD700"/>
                        <rect x="11" y="-11" width="2" height="2" fill="#FFD700"/>
                    </>
                );
            case 'INDIAN':
                // Mughal arch / lotus motifs
                return (
                    <>
                        {/* Decorative arch */}
                        <path d="M6 -10 L6 -16 Q12 -20 18 -16 L18 -10" fill="none" stroke="#FFD700" strokeWidth="1"/>
                        {/* Lotus flower */}
                        <ellipse cx="12" cy="-14" rx="2" ry="1" fill="#FFD700"/>
                        <path d="M10 -14 Q12 -18 14 -14" fill="#FFD700"/>
                        <path d="M9 -14 Q12 -17 15 -14" fill="none" stroke="#FFD700" strokeWidth="0.5"/>
                    </>
                );
            case 'MESOAMERICAN':
                // Aztec/Maya stepped pyramid motif
                return (
                    <>
                        {/* Stepped pattern */}
                        <rect x="9" y="-18" width="6" height="2" fill="#40E0D0"/>
                        <rect x="8" y="-16" width="8" height="2" fill="#40E0D0"/>
                        <rect x="7" y="-14" width="10" height="2" fill="#40E0D0"/>
                        <rect x="6" y="-12" width="12" height="2" fill="#40E0D0"/>
                        {/* Central sun symbol */}
                        <circle cx="12" cy="-14" r="2" fill="#3D3D3D"/>
                        <circle cx="12" cy="-14" r="1" fill="#40E0D0"/>
                    </>
                );
            case 'GREEK':
                // Meander/Greek key pattern
                return (
                    <>
                        {/* Column capital silhouette */}
                        <rect x="8" y="-18" width="8" height="8" fill="#DCDCDC" stroke="#1565C0" strokeWidth="0.5"/>
                        {/* Greek key border */}
                        <path d="M4 -9 L6 -9 L6 -7 L4 -7 L4 -9 M6 -9 L8 -9 L8 -11 L10 -11" stroke="#1565C0" strokeWidth="0.5" fill="none"/>
                        <path d="M14 -9 L16 -9 L16 -11 L18 -11 L18 -9 L20 -9" stroke="#1565C0" strokeWidth="0.5" fill="none"/>
                    </>
                );
            default:
                // Generic Victorian panels
                return variant === 0 ? (
                    <>
                        <rect x="3" y="-20" width="7" height="10" fill={colors.lower} opacity="0.3"/>
                        <rect x="14" y="-20" width="7" height="10" fill={colors.lower} opacity="0.3"/>
                    </>
                ) : variant === 1 ? (
                    <ellipse cx="12" cy="-14" rx="5" ry="6" fill={colors.lower} opacity="0.2"/>
                ) : null;
        }
    };

    return (
        <g>
            {/* UPPER PORTION - extends above the tile (negative Y) */}
            <rect x="0" y="-24" width="24" height="24" fill={colors.upper}/>

            {/* Crown molding at very top */}
            <rect x="0" y="-24" width="24" height="2" fill={colors.trim}/>
            <rect x="0" y="-22" width="24" height="1" fill={colors.upper} opacity="0.8"/>

            {/* Picture rail / upper trim */}
            <rect x="0" y="-8" width="24" height="1.5" fill={colors.trim} opacity="0.7"/>

            {/* Culture-specific upper wall decorations */}
            {getCulturalDecoration()}

            {/* LOWER PORTION - the actual tile */}
            <rect x="0" y="0" width="24" height="24" fill={colors.lower}/>

            {/* Chair rail / wainscoting divider */}
            <rect x="0" y="8" width="24" height="2" fill={colors.trim}/>

            {/* Wainscoting panels below chair rail */}
            <rect x="0" y="10" width="24" height="14" fill={colors.wainscot}/>

            {/* Wainscoting panel details */}
            <rect x="2" y="12" width="8" height="10" fill={colors.lower} opacity="0.3"/>
            <rect x="2" y="12" width="8" height="10" fill="none" stroke={colors.trim} strokeWidth="0.5" opacity="0.5"/>
            <rect x="14" y="12" width="8" height="10" fill={colors.lower} opacity="0.3"/>
            <rect x="14" y="12" width="8" height="10" fill="none" stroke={colors.trim} strokeWidth="0.5" opacity="0.5"/>

            {/* Baseboard */}
            <rect x="0" y="22" width="24" height="2" fill={colors.wainscot}/>
            <rect x="0" y="22" width="24" height="0.5" fill={colors.trim} opacity="0.4"/>

            {/* Subtle shadow at floor */}
            <rect x="0" y="23" width="24" height="1" fill="#000" opacity="0.15"/>
        </g>
    );
};

// Garden/outdoor tall wall - no wainscoting, just stone or hedge
const generateTallGardenWall = (x: number, y: number, wallStyle: string, variant: number): JSX.Element => {
    if (wallStyle === 'WATERFALL') {
        // Wet stone wall extending upward
        return (
            <g>
                {/* Upper stone section */}
                <rect x="0" y="-24" width="24" height="24" fill="#5A5A5A"/>
                <rect x="0" y="-24" width="12" height="10" fill="#686868" stroke="#4A4A4A" strokeWidth="0.5"/>
                <rect x="12" y="-24" width="12" height="8" fill="#606060" stroke="#4A4A4A" strokeWidth="0.5"/>
                <rect x="0" y="-14" width="10" height="8" fill="#5E5E5E" stroke="#4A4A4A" strokeWidth="0.5"/>
                <rect x="10" y="-16" width="14" height="10" fill="#646464" stroke="#4A4A4A" strokeWidth="0.5"/>
                <rect x="0" y="-6" width="14" height="6" fill="#626262" stroke="#4A4A4A" strokeWidth="0.5"/>
                <rect x="14" y="-6" width="10" height="6" fill="#585858" stroke="#4A4A4A" strokeWidth="0.5"/>
                {/* Water drips on upper */}
                <line x1="8" y1="-24" x2="8" y2="-14" stroke="#7A9AB0" strokeWidth="0.4" opacity="0.3"/>
                <line x1="18" y1="-20" x2="18" y2="-8" stroke="#7A9AB0" strokeWidth="0.3" opacity="0.25"/>

                {/* Lower stone section */}
                <rect x="0" y="0" width="24" height="24" fill="#5A5A5A"/>
                <rect x="0" y="0" width="12" height="8" fill="#686868" stroke="#4A4A4A" strokeWidth="0.5"/>
                <rect x="12" y="0" width="12" height="6" fill="#606060" stroke="#4A4A4A" strokeWidth="0.5"/>
                <rect x="0" y="8" width="8" height="10" fill="#5E5E5E" stroke="#4A4A4A" strokeWidth="0.5"/>
                <rect x="8" y="6" width="16" height="9" fill="#646464" stroke="#4A4A4A" strokeWidth="0.5"/>
                <rect x="0" y="18" width="14" height="6" fill="#626262" stroke="#4A4A4A" strokeWidth="0.5"/>
                <rect x="14" y="15" width="10" height="9" fill="#585858" stroke="#4A4A4A" strokeWidth="0.5"/>
                {/* Wet sheen */}
                <rect x="2" y="3" width="6" height="2" fill="#7A9AB0" opacity="0.2"/>
                <rect x="14" y="10" width="4" height="1.5" fill="#7A9AB0" opacity="0.15"/>
                {/* Water drip marks */}
                <line x1="6" y1="0" x2="6" y2="8" stroke="#7A9AB0" strokeWidth="0.3" opacity="0.3"/>
            </g>
        );
    }

    if (wallStyle === 'ESPLANADE') {
        // Formal balustrade wall
        return (
            <g>
                {/* Upper formal stone */}
                <rect x="0" y="-24" width="24" height="24" fill="#D8D0C0"/>
                <rect x="0" y="-24" width="24" height="8" fill="#E0D8C8" stroke="#C0B8A8" strokeWidth="0.3"/>
                <rect x="0" y="-16" width="24" height="8" fill="#D4CCC0" stroke="#C0B8A8" strokeWidth="0.3"/>
                <rect x="0" y="-8" width="24" height="8" fill="#DCD4C4" stroke="#C0B8A8" strokeWidth="0.3"/>
                {/* Upper cornice */}
                <rect x="0" y="-24" width="24" height="2" fill="#C8C0B0"/>
                <rect x="0" y="-22" width="24" height="1" fill="#E8E0D0"/>

                {/* Lower formal stone */}
                <rect x="0" y="0" width="24" height="24" fill="#D8D0C0"/>
                <rect x="0" y="0" width="24" height="8" fill="#E0D8C8" stroke="#C0B8A8" strokeWidth="0.3"/>
                <rect x="0" y="8" width="24" height="8" fill="#D4CCC0" stroke="#C0B8A8" strokeWidth="0.3"/>
                <rect x="0" y="16" width="24" height="8" fill="#DCD4C4" stroke="#C0B8A8" strokeWidth="0.3"/>
                {/* Base molding */}
                <rect x="0" y="21" width="24" height="3" fill="#C8C0B0"/>
                <rect x="0" y="21" width="24" height="1" fill="#E8E0D0"/>
            </g>
        );
    }

    // Default garden stone wall
    return (
        <g>
            {/* Upper stone section */}
            <rect x="0" y="-24" width="24" height="24" fill="#8B8878"/>
            <rect x="0" y="-24" width="11" height="9" fill="#9A9888" stroke="#6B6858" strokeWidth="0.5"/>
            <rect x="12" y="-24" width="12" height="10" fill="#8A8A78" stroke="#6B6858" strokeWidth="0.5"/>
            <rect x="0" y="-15" width="9" height="8" fill="#929282" stroke="#6B6858" strokeWidth="0.5"/>
            <rect x="10" y="-14" width="14" height="7" fill="#888878" stroke="#6B6858" strokeWidth="0.5"/>
            <rect x="0" y="-7" width="13" height="7" fill="#8E8E7E" stroke="#6B6858" strokeWidth="0.5"/>
            <rect x="14" y="-7" width="10" height="7" fill="#949484" stroke="#6B6858" strokeWidth="0.5"/>
            {/* Moss on upper */}
            <ellipse cx="6" cy="-18" rx="2" ry="1" fill="#5D6B4A" opacity="0.4"/>
            <ellipse cx="18" cy="-10" rx="1.5" ry="1" fill="#4D5B3A" opacity="0.3"/>

            {/* Lower stone section */}
            <rect x="0" y="0" width="24" height="24" fill="#8B8878"/>
            <rect x="0" y="0" width="11" height="7" fill="#9A9888" stroke="#6B6858" strokeWidth="0.5"/>
            <rect x="12" y="0" width="12" height="8" fill="#8A8A78" stroke="#6B6858" strokeWidth="0.5"/>
            <rect x="0" y="8" width="8" height="8" fill="#929282" stroke="#6B6858" strokeWidth="0.5"/>
            <rect x="9" y="8" width="15" height="7" fill="#888878" stroke="#6B6858" strokeWidth="0.5"/>
            <rect x="0" y="16" width="14" height="8" fill="#8E8E7E" stroke="#6B6858" strokeWidth="0.5"/>
            <rect x="15" y="15" width="9" height="9" fill="#949484" stroke="#6B6858" strokeWidth="0.5"/>
            {/* Moss patches */}
            <ellipse cx="5" cy="4" rx="2" ry="1" fill="#5D6B4A" opacity="0.4"/>
            <ellipse cx="20" cy="12" rx="1.5" ry="1" fill="#4D5B3A" opacity="0.3"/>
            <ellipse cx="8" cy="20" rx="2" ry="1.5" fill="#5D6B4A" opacity="0.35"/>
            {/* Base shadow */}
            <rect x="0" y="22" width="24" height="2" fill="#6B6858" opacity="0.3"/>
        </g>
    );
};

// ===========================================
// TALL CORNER GENERATORS
// For corners where side walls meet back walls
// These extend upward to match the tall back wall
// ===========================================

// Get corner wall colors based on style
const getCornerColors = (wallStyle: string) => {
    const colors: Record<string, { upper: string; lower: string; trim: string; side: string }> = {
        'SALON': { upper: '#4A5568', lower: '#5D4037', trim: '#B8860B', side: '#3D4250' },
        'JAPANESE': { upper: '#E8DCC4', lower: '#D4C4A8', trim: '#8B5A2B', side: '#D8CCB4' },
        'CHINESE': { upper: '#8B0000', lower: '#6B0000', trim: '#FFD700', side: '#5C0000' },
        'PERSIAN': { upper: '#1E3A5F', lower: '#162C45', trim: '#DAA520', side: '#0F1F32' },
        'EGYPTIAN': { upper: '#D4B896', lower: '#C4A574', trim: '#DAA520', side: '#B8956A' },
        'MOORISH': { upper: '#0B4F6C', lower: '#083B52', trim: '#FFD700', side: '#052838' },
        'ITALIAN': { upper: '#F5F5F5', lower: '#E8E8E8', trim: '#D4AF37', side: '#D4D4D4' },
        'SOUK': { upper: '#D4B896', lower: '#C9A882', trim: '#8B7355', side: '#B8956A' },
        'HIEROGLYPH': { upper: '#E8D4B8', lower: '#D4B896', trim: '#DAA520', side: '#C4A574' },
        'MESOAMERICAN': { upper: '#4A4A4A', lower: '#3D3D3D', trim: '#40E0D0', side: '#2D2D2D' },
        'TROCADERO': { upper: '#3D4654', lower: '#4A5568', trim: '#B8860B', side: '#2D3748' },
        'GRAND_HALL': { upper: '#37474F', lower: '#455A64', trim: '#90A4AE', side: '#263238' },
        'GALERIE': { upper: '#37474F', lower: '#455A64', trim: '#78909C', side: '#263238' },
        // New cultural styles
        'PORTUGUESE': { upper: '#1E4D7B', lower: '#F5F5F0', trim: '#D4AF37', side: '#153A5C' },
        'SPANISH': { upper: '#C4572D', lower: '#E8C4A0', trim: '#8B4513', side: '#A64B2A' },
        'RUSSIAN': { upper: '#1B5E20', lower: '#2E7D32', trim: '#FFD700', side: '#0D4A12' },
        'INDIAN': { upper: '#B71C1C', lower: '#C62828', trim: '#FFD700', side: '#8B0000' },
        'GREEK': { upper: '#E8E8E8', lower: '#F5F5F5', trim: '#1565C0', side: '#C0C0C0' },
        'SOUTH_AMERICAN': { upper: '#4A5F4A', lower: '#3D5A3D', trim: '#FFD700', side: '#2D4A2D' },
        'AFRICAN': { upper: '#8B4513', lower: '#A0522D', trim: '#DAA520', side: '#6B3A10' },
        'SOUTHEAST_ASIAN': { upper: '#5D4037', lower: '#4E342E', trim: '#CD853F', side: '#3E2723' },
        'BEAUX_ARTS': { upper: '#E8DCC8', lower: '#D4C8B4', trim: '#B8860B', side: '#C4B8A4' },
        // Garden styles
        'GARDEN': { upper: '#8B8878', lower: '#7A7A68', trim: '#9A9888', side: '#6B6858' },
        'WATERFALL': { upper: '#5A5A5A', lower: '#4A4A4A', trim: '#6A6A6A', side: '#3A3A3A' },
        'ESPLANADE': { upper: '#D8D0C0', lower: '#C8C0B0', trim: '#E8E0D0', side: '#B8B0A0' },
        'DEFAULT': { upper: '#D4C8B4', lower: '#C4B8A4', trim: '#B8AC98', side: '#A89C88' },
    };
    return colors[wallStyle] || colors['DEFAULT'];
};

// Top-left corner where left wall meets back wall (┌)
export const generateTallCornerNW = (x: number, y: number, wallStyle: string): JSX.Element => {
    const colors = getCornerColors(wallStyle);
    const isGarden = GARDEN_BIOMES.has(wallStyle);

    if (isGarden) {
        // Stone corner for garden
        return (
            <g>
                {/* Upper section - continues back wall stone */}
                <rect x="0" y="-24" width="24" height="24" fill={colors.upper}/>
                {/* Stone blocks upper */}
                <rect x="0" y="-24" width="11" height="10" fill={colors.lower} stroke="#6B6858" strokeWidth="0.5"/>
                <rect x="12" y="-24" width="12" height="8" fill={colors.upper} stroke="#6B6858" strokeWidth="0.5"/>
                <rect x="0" y="-14" width="8" height="8" fill={colors.upper} stroke="#6B6858" strokeWidth="0.5"/>
                <rect x="8" y="-16" width="16" height="10" fill={colors.lower} stroke="#6B6858" strokeWidth="0.5"/>
                {/* Cap stone at top */}
                <rect x="0" y="-24" width="24" height="2" fill={colors.trim}/>

                {/* Lower section */}
                <rect x="0" y="0" width="24" height="24" fill={colors.upper}/>
                <rect x="0" y="0" width="12" height="10" fill={colors.lower} stroke="#6B6858" strokeWidth="0.5"/>
                <rect x="12" y="0" width="12" height="8" fill={colors.upper} stroke="#6B6858" strokeWidth="0.5"/>
                <rect x="0" y="10" width="10" height="8" fill={colors.upper} stroke="#6B6858" strokeWidth="0.5"/>
                <rect x="10" y="8" width="14" height="10" fill={colors.lower} stroke="#6B6858" strokeWidth="0.5"/>
                <rect x="0" y="18" width="14" height="6" fill={colors.lower} stroke="#6B6858" strokeWidth="0.5"/>
                <rect x="14" y="18" width="10" height="6" fill={colors.upper} stroke="#6B6858" strokeWidth="0.5"/>

                {/* Left edge shadow (from side wall) */}
                <rect x="0" y="-24" width="2" height="48" fill="#0D0D1A" opacity="0.3"/>
            </g>
        );
    }

    // Interior corner with wainscoting
    return (
        <g>
            {/* UPPER PORTION */}
            <rect x="0" y="-24" width="24" height="24" fill={colors.upper}/>
            {/* Crown molding */}
            <rect x="0" y="-24" width="24" height="2" fill={colors.trim}/>
            <rect x="0" y="-22" width="24" height="1" fill={colors.upper} opacity="0.8"/>
            {/* Picture rail */}
            <rect x="0" y="-8" width="24" height="1.5" fill={colors.trim} opacity="0.7"/>
            {/* Corner shadow from side wall */}
            <rect x="0" y="-24" width="3" height="24" fill={colors.side}/>
            <rect x="0" y="-24" width="1" height="24" fill="#0D0D1A" opacity="0.4"/>

            {/* LOWER PORTION */}
            <rect x="0" y="0" width="24" height="24" fill={colors.lower}/>
            {/* Chair rail */}
            <rect x="0" y="8" width="24" height="2" fill={colors.trim}/>
            {/* Wainscoting */}
            <rect x="0" y="10" width="24" height="14" fill={colors.side}/>
            <rect x="5" y="12" width="7" height="10" fill={colors.lower} opacity="0.3"/>
            <rect x="5" y="12" width="7" height="10" fill="none" stroke={colors.trim} strokeWidth="0.5" opacity="0.5"/>
            <rect x="14" y="12" width="8" height="10" fill={colors.lower} opacity="0.3"/>
            <rect x="14" y="12" width="8" height="10" fill="none" stroke={colors.trim} strokeWidth="0.5" opacity="0.5"/>
            {/* Baseboard */}
            <rect x="0" y="22" width="24" height="2" fill={colors.side}/>
            <rect x="0" y="22" width="24" height="0.5" fill={colors.trim} opacity="0.4"/>
            {/* Corner edge from side wall */}
            <rect x="0" y="0" width="3" height="24" fill={colors.side}/>
            <rect x="0" y="0" width="1" height="24" fill="#0D0D1A" opacity="0.4"/>
            {/* Floor shadow */}
            <rect x="0" y="23" width="24" height="1" fill="#000" opacity="0.15"/>
        </g>
    );
};

// Top-right corner where right wall meets back wall (┐)
export const generateTallCornerNE = (x: number, y: number, wallStyle: string): JSX.Element => {
    const colors = getCornerColors(wallStyle);
    const isGarden = GARDEN_BIOMES.has(wallStyle);

    if (isGarden) {
        return (
            <g>
                {/* Upper section */}
                <rect x="0" y="-24" width="24" height="24" fill={colors.upper}/>
                <rect x="0" y="-24" width="12" height="8" fill={colors.lower} stroke="#6B6858" strokeWidth="0.5"/>
                <rect x="12" y="-24" width="12" height="10" fill={colors.upper} stroke="#6B6858" strokeWidth="0.5"/>
                <rect x="0" y="-16" width="16" height="10" fill={colors.upper} stroke="#6B6858" strokeWidth="0.5"/>
                <rect x="16" y="-14" width="8" height="8" fill={colors.lower} stroke="#6B6858" strokeWidth="0.5"/>
                <rect x="0" y="-24" width="24" height="2" fill={colors.trim}/>

                {/* Lower section */}
                <rect x="0" y="0" width="24" height="24" fill={colors.upper}/>
                <rect x="0" y="0" width="12" height="8" fill={colors.upper} stroke="#6B6858" strokeWidth="0.5"/>
                <rect x="12" y="0" width="12" height="10" fill={colors.lower} stroke="#6B6858" strokeWidth="0.5"/>
                <rect x="0" y="8" width="14" height="10" fill={colors.lower} stroke="#6B6858" strokeWidth="0.5"/>
                <rect x="14" y="10" width="10" height="8" fill={colors.upper} stroke="#6B6858" strokeWidth="0.5"/>
                <rect x="0" y="18" width="10" height="6" fill={colors.upper} stroke="#6B6858" strokeWidth="0.5"/>
                <rect x="10" y="18" width="14" height="6" fill={colors.lower} stroke="#6B6858" strokeWidth="0.5"/>

                {/* Right edge shadow */}
                <rect x="22" y="-24" width="2" height="48" fill="#0D0D1A" opacity="0.3"/>
            </g>
        );
    }

    return (
        <g>
            {/* UPPER PORTION */}
            <rect x="0" y="-24" width="24" height="24" fill={colors.upper}/>
            <rect x="0" y="-24" width="24" height="2" fill={colors.trim}/>
            <rect x="0" y="-22" width="24" height="1" fill={colors.upper} opacity="0.8"/>
            <rect x="0" y="-8" width="24" height="1.5" fill={colors.trim} opacity="0.7"/>
            {/* Corner shadow from side wall */}
            <rect x="21" y="-24" width="3" height="24" fill={colors.side}/>
            <rect x="23" y="-24" width="1" height="24" fill="#0D0D1A" opacity="0.4"/>

            {/* LOWER PORTION */}
            <rect x="0" y="0" width="24" height="24" fill={colors.lower}/>
            <rect x="0" y="8" width="24" height="2" fill={colors.trim}/>
            <rect x="0" y="10" width="24" height="14" fill={colors.side}/>
            <rect x="2" y="12" width="8" height="10" fill={colors.lower} opacity="0.3"/>
            <rect x="2" y="12" width="8" height="10" fill="none" stroke={colors.trim} strokeWidth="0.5" opacity="0.5"/>
            <rect x="12" y="12" width="7" height="10" fill={colors.lower} opacity="0.3"/>
            <rect x="12" y="12" width="7" height="10" fill="none" stroke={colors.trim} strokeWidth="0.5" opacity="0.5"/>
            <rect x="0" y="22" width="24" height="2" fill={colors.side}/>
            <rect x="0" y="22" width="24" height="0.5" fill={colors.trim} opacity="0.4"/>
            {/* Right edge */}
            <rect x="21" y="0" width="3" height="24" fill={colors.side}/>
            <rect x="23" y="0" width="1" height="24" fill="#0D0D1A" opacity="0.4"/>
            <rect x="0" y="23" width="24" height="1" fill="#000" opacity="0.15"/>
        </g>
    );
};
