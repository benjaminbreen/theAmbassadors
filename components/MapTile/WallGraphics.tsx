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

export const WALL_TILES: Record<string, JSX.Element> = {
    // Default - now uses Haussmann style (will be overridden by generator for streets)
    'DEFAULT': (
        <g>
            <rect width="24" height="24" fill="#E8DCC8"/>
            <line x1="0" y1="6" x2="24" y2="6" stroke="#C4B8A4" strokeWidth="0.3" opacity="0.5"/>
            <line x1="0" y1="12" x2="24" y2="12" stroke="#C4B8A4" strokeWidth="0.3" opacity="0.5"/>
            <line x1="0" y1="18" x2="24" y2="18" stroke="#C4B8A4" strokeWidth="0.3" opacity="0.5"/>
            <rect x="6" y="3" width="12" height="16" fill="#4A5568"/>
            <rect x="7" y="4" width="10" height="14" fill="#1A202C" opacity="0.6"/>
            <line x1="12" y1="3" x2="12" y2="19" stroke="#F5EDE0" strokeWidth="0.8"/>
            <line x1="6" y1="11" x2="18" y2="11" stroke="#F5EDE0" strokeWidth="0.8"/>
            <rect x="5" y="19" width="14" height="1.5" fill="#C4B8A4"/>
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
        'EGYPTIAN': { base: '#D2691E', highlight: '#FFD700', side: '#A0522D' },
        'MOORISH': { base: '#0B4F6C', highlight: '#FFD700', side: '#083B52' },
        'ITALIAN': { base: '#E8E8E8', highlight: '#D4AF37', side: '#C0C0C0' },
        'STREET': { base: '#E8DCC8', highlight: '#F5EDE0', side: '#D8CCBA' },
        'DEFAULT': { base: '#4A5568', highlight: '#718096', side: '#2D3748' },
    };
    return colors[wallKey] || colors['DEFAULT'];
};
