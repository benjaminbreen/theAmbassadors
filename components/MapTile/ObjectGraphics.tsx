import React from 'react';

// Pre-computed OBJECT graphics (rendered over terrain)
// These are tiles that sit ON TOP of terrain and need transparent backgrounds

// Flower color palettes for variety
const FLOWER_PALETTES = [
    { primary: '#F472B6', secondary: '#EC4899', accent: '#FBBF24', name: 'rose' },        // Pink rose
    { primary: '#DC2626', secondary: '#B91C1C', accent: '#FCD34D', name: 'red-rose' },    // Red rose
    { primary: '#A855F7', secondary: '#9333EA', accent: '#FDE047', name: 'iris' },        // Purple iris
    { primary: '#3B82F6', secondary: '#2563EB', accent: '#FEF3C7', name: 'bluebell' },    // Bluebell
    { primary: '#FBBF24', secondary: '#F59E0B', accent: '#FEF3C7', name: 'marigold' },    // Yellow marigold
    { primary: '#F97316', secondary: '#EA580C', accent: '#FEF9C3', name: 'poppy' },       // Orange poppy
    { primary: '#FFFFFF', secondary: '#F3F4F6', accent: '#FBBF24', name: 'daisy' },       // White daisy
    { primary: '#F43F5E', secondary: '#E11D48', accent: '#FCD34D', name: 'tulip' },       // Red tulip
];

// Generate randomized flowerbed based on x,y position
export const generateFlowerbed = (x: number, y: number): JSX.Element => {
    // Simple hash for deterministic randomness based on position
    const hash = (a: number, b: number) => {
        const h = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453123;
        return h - Math.floor(h);
    };

    const seed1 = hash(x, y);
    const seed2 = hash(x + 100, y);
    const seed3 = hash(x, y + 100);
    const seed4 = hash(x + 50, y + 50);

    // Pick 3 different flower types for variety
    const flower1 = FLOWER_PALETTES[Math.floor(seed1 * FLOWER_PALETTES.length)];
    const flower2 = FLOWER_PALETTES[Math.floor(seed2 * FLOWER_PALETTES.length)];
    const flower3 = FLOWER_PALETTES[Math.floor(seed3 * FLOWER_PALETTES.length)];

    // Randomize flower positions slightly
    const f1x = 5 + (seed1 * 3);
    const f1y = 6 + (seed2 * 3);
    const f2x = 16 + (seed3 * 3 - 1.5);
    const f2y = 4 + (seed4 * 3);
    const f3x = 10 + (seed2 * 4 - 2);
    const f3y = 11 + (seed1 * 3);

    // Vary foliage density
    const hasExtraFoliage = seed4 > 0.5;

    return (
        <g>
            {/* Rich garden soil base */}
            <rect width="24" height="24" fill="#4A2C17"/>
            <rect x="1" y="1" width="22" height="22" fill="#5D3A1A"/>
            {/* Soil texture */}
            <circle cx={4 + seed1 * 4} cy={4 + seed2 * 4} r="1" fill="#3D2412" opacity="0.5"/>
            <circle cx={12 + seed3 * 4} cy={18 + seed1 * 4} r="1.5" fill="#3D2412" opacity="0.4"/>
            <circle cx={18 + seed2 * 4} cy={8 + seed4 * 4} r="1" fill="#3D2412" opacity="0.5"/>

            {/* Foliage base layer */}
            <ellipse cx="6" cy="18" rx="4" ry="3" fill="#15803D" opacity="0.9"/>
            <ellipse cx="18" cy="16" rx="5" ry="4" fill="#166534" opacity="0.85"/>
            <ellipse cx="12" cy="20" rx="4" ry="2.5" fill="#15803D" opacity="0.8"/>
            {hasExtraFoliage && <ellipse cx="10" cy="15" rx="3" ry="2.5" fill="#16A34A" opacity="0.7"/>}

            {/* Leaves */}
            <ellipse cx="3" cy="12" rx="2" ry="5" fill="#15803D" transform={`rotate(${-25 + seed1 * 10} 3 12)`}/>
            <ellipse cx="21" cy="10" rx="2" ry="4" fill="#166534" transform={`rotate(${20 - seed2 * 10} 21 10)`}/>
            <ellipse cx="8" cy="14" rx="1.5" ry="4" fill="#16A34A" transform={`rotate(${-10 + seed3 * 5} 8 14)`} opacity="0.9"/>
            <ellipse cx="16" cy="12" rx="1.5" ry="4" fill="#15803D" transform={`rotate(${15 - seed4 * 5} 16 12)`} opacity="0.9"/>

            {/* Main flower 1 (large) */}
            <g transform={`translate(${f1x}, ${f1y})`}>
                <circle cx="0" cy="-2.5" r="2" fill={flower1.primary}/>
                <circle cx="2.5" cy="0" r="2" fill={flower1.primary}/>
                <circle cx="0" cy="2.5" r="2" fill={flower1.secondary}/>
                <circle cx="-2.5" cy="0" r="2" fill={flower1.primary}/>
                <circle cx="1.8" cy="-1.8" r="1.8" fill={flower1.secondary}/>
                <circle cx="1.8" cy="1.8" r="1.8" fill={flower1.primary}/>
                <circle cx="-1.8" cy="1.8" r="1.8" fill={flower1.secondary}/>
                <circle cx="-1.8" cy="-1.8" r="1.8" fill={flower1.primary}/>
                <circle cx="0" cy="0" r="1.5" fill={flower1.accent}/>
            </g>

            {/* Main flower 2 (medium) */}
            <g transform={`translate(${f2x}, ${f2y})`}>
                <circle cx="0" cy="-2" r="1.6" fill={flower2.primary}/>
                <circle cx="2" cy="0" r="1.6" fill={flower2.secondary}/>
                <circle cx="0" cy="2" r="1.6" fill={flower2.primary}/>
                <circle cx="-2" cy="0" r="1.6" fill={flower2.secondary}/>
                <circle cx="0" cy="0" r="1.2" fill={flower2.accent}/>
            </g>

            {/* Main flower 3 (small accent) */}
            <g transform={`translate(${f3x}, ${f3y})`}>
                <circle cx="0" cy="-1.5" r="1.2" fill={flower3.primary}/>
                <circle cx="1.5" cy="0" r="1.2" fill={flower3.secondary}/>
                <circle cx="0" cy="1.5" r="1.2" fill={flower3.primary}/>
                <circle cx="-1.5" cy="0" r="1.2" fill={flower3.secondary}/>
                <circle cx="0" cy="0" r="0.9" fill={flower3.accent}/>
            </g>

            {/* Small accent buds - randomized colors */}
            <circle cx={19 + seed1 * 2} cy={13 + seed2 * 2} r="1.3" fill={flower1.primary}/>
            <circle cx={3 + seed3 * 2} cy={15 + seed4 * 2} r="1.1" fill={flower2.primary}/>
            <circle cx={13 + seed2 * 2} cy={17 + seed3 * 2} r="1.2" fill={flower3.primary}/>

            {/* Decorative stone border */}
            <rect x="0" y="22" width="24" height="2" fill="#6B4226"/>
            <g opacity="0.4">
                <circle cx="4" cy="23" r="1.5" fill="#8B7355"/>
                <circle cx="12" cy="23" r="1.5" fill="#7A6450"/>
                <circle cx="20" cy="23" r="1.5" fill="#8B7355"/>
            </g>
        </g>
    );
};

// National flag color palettes for pavilion banners
const FLAG_COLORS: Record<string, { colors: string[], emblem?: string }> = {
    // European Nations
    france: { colors: ['#002654', '#FFFFFF', '#CE1126'], emblem: 'fleur' },
    germany: { colors: ['#000000', '#DD0000', '#FFCC00'] },
    britain: { colors: ['#012169', '#FFFFFF', '#C8102E'], emblem: 'cross' },
    england: { colors: ['#FFFFFF', '#CE1126', '#FFFFFF'], emblem: 'cross' },
    italy: { colors: ['#009246', '#FFFFFF', '#CE2B37'] },
    spain: { colors: ['#AA151B', '#F1BF00', '#AA151B'] },
    austria: { colors: ['#ED2939', '#FFFFFF', '#ED2939'] },
    belgium: { colors: ['#000000', '#FAE042', '#ED2939'] },
    netherlands: { colors: ['#AE1C28', '#FFFFFF', '#21468B'] },
    russia: { colors: ['#FFFFFF', '#0039A6', '#D52B1E'] },
    sweden: { colors: ['#006AA7', '#FECC00', '#006AA7'], emblem: 'cross' },
    norway: { colors: ['#EF2B2D', '#FFFFFF', '#002868'] },
    denmark: { colors: ['#C8102E', '#FFFFFF', '#C8102E'], emblem: 'cross' },
    switzerland: { colors: ['#FF0000', '#FFFFFF', '#FF0000'], emblem: 'cross' },
    portugal: { colors: ['#006600', '#FF0000', '#006600'] },
    greece: { colors: ['#0D5EAF', '#FFFFFF', '#0D5EAF'] },
    // Asian Nations
    japan: { colors: ['#FFFFFF', '#BC002D', '#FFFFFF'], emblem: 'sun' },
    china: { colors: ['#DE2910', '#FFDE00', '#DE2910'], emblem: 'dragon' },
    siam: { colors: ['#A51931', '#FFFFFF', '#2D2A4A'] },
    persia: { colors: ['#239F40', '#FFFFFF', '#DA0000'] },
    india: { colors: ['#FF9933', '#FFFFFF', '#138808'] },
    // Middle East & Africa
    egypt: { colors: ['#CE1126', '#FFFFFF', '#000000'] },
    ottoman: { colors: ['#E30A17', '#FFFFFF', '#E30A17'], emblem: 'crescent' },
    morocco: { colors: ['#C1272D', '#006233', '#C1272D'] },
    tunis: { colors: ['#E70013', '#FFFFFF', '#E70013'], emblem: 'crescent' },
    algeria: { colors: ['#006633', '#FFFFFF', '#D21034'] },
    // Americas
    america: { colors: ['#B22234', '#FFFFFF', '#3C3B6E'] },
    usa: { colors: ['#B22234', '#FFFFFF', '#3C3B6E'] },
    mexico: { colors: ['#006847', '#FFFFFF', '#CE1126'] },
    brazil: { colors: ['#009739', '#FEDD00', '#002776'] },
    argentina: { colors: ['#74ACDF', '#FFFFFF', '#74ACDF'] },
    // Default for exposition
    exposition: { colors: ['#1E3A5F', '#C9A227', '#1E3A5F'], emblem: 'eiffel' },
};

// Generate banner with national flag colors based on zone name
export const generateBanner = (zoneName: string): JSX.Element => {
    const nameLower = zoneName.toLowerCase();

    // Find matching country
    let flagData = FLAG_COLORS.exposition; // Default
    for (const [country, data] of Object.entries(FLAG_COLORS)) {
        if (nameLower.includes(country)) {
            flagData = data;
            break;
        }
    }

    const [color1, color2, color3] = flagData.colors;
    const hasThreeStripes = flagData.colors.length >= 3;

    return (
        <g>
            {/* Brass pole top */}
            <circle cx="12" cy="1" r="2" fill="#DAA520"/>
            <circle cx="12" cy="1" r="1.2" fill="#FFD700"/>
            {/* Pole */}
            <rect x="11" y="1" width="2" height="4" fill="#B8860B"/>

            {/* Banner fabric with wave effect */}
            <path d="M4 5 L4 21 Q8 23 12 21 Q16 19 20 21 L20 5 Z" fill={color2}>
                <animate attributeName="d"
                    values="M4 5 L4 21 Q8 23 12 21 Q16 19 20 21 L20 5 Z;M4 5 L4 21 Q8 19 12 21 Q16 23 20 21 L20 5 Z;M4 5 L4 21 Q8 23 12 21 Q16 19 20 21 L20 5 Z"
                    dur="4s" repeatCount="indefinite"/>
            </path>

            {/* Tricolor stripes */}
            {hasThreeStripes ? (
                <>
                    <path d="M4 5 L4 21 Q6 22 8 21 L8 5 Z" fill={color1}/>
                    <path d="M16 5 L16 21 Q18 20 20 21 L20 5 Z" fill={color3}/>
                </>
            ) : (
                <>
                    <rect x="4" y="5" width="16" height="8" fill={color1}/>
                    <rect x="4" y="13" width="16" height="8" fill={color2}/>
                </>
            )}

            {/* Emblems based on country */}
            {flagData.emblem === 'sun' && (
                <circle cx="12" cy="13" r="3" fill="#BC002D"/>
            )}
            {flagData.emblem === 'crescent' && (
                <>
                    <circle cx="11" cy="12" r="3" fill="#FFFFFF"/>
                    <circle cx="12" cy="12" r="2.5" fill={color1}/>
                    <polygon points="14,11 16,13 14,15 15,13" fill="#FFFFFF"/>
                </>
            )}
            {flagData.emblem === 'cross' && (
                <>
                    <rect x="10" y="6" width="4" height="14" fill={color2}/>
                    <rect x="5" y="11" width="14" height="4" fill={color2}/>
                </>
            )}
            {flagData.emblem === 'fleur' && (
                <g transform="translate(12, 13) scale(0.4)">
                    <path d="M0 -8 C-2 -4 -2 0 0 4 C2 0 2 -4 0 -8" fill="#FFD700"/>
                    <path d="M-6 -2 C-4 0 -2 2 0 4 C-2 2 -4 4 -6 2" fill="#FFD700"/>
                    <path d="M6 -2 C4 0 2 2 0 4 C2 2 4 4 6 2" fill="#FFD700"/>
                </g>
            )}
            {flagData.emblem === 'eiffel' && (
                <g transform="translate(12, 13)">
                    <path d="M0 -5 L-3 5 L-1 5 L0 2 L1 5 L3 5 Z" fill="#C9A227"/>
                    <rect x="-2" y="-2" width="4" height="1" fill="#C9A227"/>
                    <rect x="-1.5" y="1" width="3" height="1" fill="#C9A227"/>
                </g>
            )}

            {/* Decorative gold fringe at bottom */}
            <path d="M4 20 Q6 22 8 20 Q10 22 12 20 Q14 22 16 20 Q18 22 20 20"
                stroke="#DAA520" fill="none" strokeWidth="1"/>

            {/* Subtle shadow/depth */}
            <path d="M4 5 L4 21" stroke="#000" strokeWidth="0.5" opacity="0.2"/>
        </g>
    );
};

export const OBJECT_GRAPHICS: Record<string, JSX.Element> = {
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
    '≡': (
        <g>
            {/* Shadow - spans 2 tiles */}
            <ellipse cx="24" cy="21" rx="20" ry="3" fill="#000" opacity="0.15"/>
            {/* Ornate cast iron legs - 3 supports for 2-tile bench */}
            <path d="M4 12 C2 16 4 20 6 22" stroke="#37474F" strokeWidth="2.5" fill="none"/>
            <path d="M4 14 C0 16 2 20 4 22" stroke="#4A5568" strokeWidth="1.5" fill="none"/>
            <ellipse cx="5" cy="22" rx="3" ry="1" fill="#37474F"/>
            <path d="M24 12 C22 16 24 20 24 22" stroke="#37474F" strokeWidth="2.5" fill="none"/>
            <path d="M24 14 C28 16 26 20 24 22" stroke="#4A5568" strokeWidth="1.5" fill="none"/>
            <ellipse cx="24" cy="22" rx="3" ry="1" fill="#37474F"/>
            <path d="M44 12 C46 16 44 20 42 22" stroke="#37474F" strokeWidth="2.5" fill="none"/>
            <path d="M44 14 C48 16 46 20 44 22" stroke="#4A5568" strokeWidth="1.5" fill="none"/>
            <ellipse cx="43" cy="22" rx="3" ry="1" fill="#37474F"/>
            {/* Seat - wooden slats across 2 tiles */}
            <rect x="0" y="10" width="48" height="4" fill="#5D4037" rx="1"/>
            <rect x="1" y="10.5" width="46" height="0.8" fill="#6D4C41"/>
            <rect x="1" y="12" width="46" height="0.8" fill="#6D4C41"/>
            {/* Backrest */}
            <rect x="0" y="4" width="48" height="7" fill="#6D4C41" rx="2"/>
            <rect x="2" y="5" width="44" height="1.5" fill="#8D6E63"/>
            <rect x="2" y="7.5" width="44" height="1.5" fill="#8D6E63"/>
            {/* Armrests */}
            <rect x="-1" y="6" width="4" height="6" fill="#37474F" rx="1"/>
            <rect x="45" y="6" width="4" height="6" fill="#37474F" rx="1"/>
            {/* Decorative scrolls */}
            <circle cx="0" cy="8" r="2" fill="none" stroke="#4A5568" strokeWidth="0.8"/>
            <circle cx="48" cy="8" r="2" fill="none" stroke="#4A5568" strokeWidth="0.8"/>
        </g>
    ),
    // Fountain Center
    'F': (
        <g>
            <ellipse cx="14" cy="21" rx="9" ry="3" fill="#000" opacity="0.2"/>
            <ellipse cx="12" cy="18" rx="10" ry="4" fill="#78909C"/>
            <ellipse cx="12" cy="17" rx="9" ry="3.5" fill="#90A4AE"/>
            <ellipse cx="12" cy="17" rx="8" ry="3" fill="#42A5F5" opacity="0.7"/>
            <ellipse cx="12" cy="17" rx="6" ry="2.2" fill="none" stroke="#90CAF9" strokeWidth="0.5" opacity="0.6"/>
            <ellipse cx="12" cy="17" rx="4" ry="1.5" fill="none" stroke="#BBDEFB" strokeWidth="0.3" opacity="0.5"/>
            <ellipse cx="12" cy="14" rx="4" ry="1.5" fill="#607D8B"/>
            <rect x="9" y="10" width="6" height="4" fill="#78909C"/>
            <ellipse cx="12" cy="10" rx="3.5" ry="1.3" fill="#90A4AE"/>
            <ellipse cx="12" cy="8" rx="3" ry="1.2" fill="#607D8B"/>
            <ellipse cx="12" cy="7.5" rx="2.5" ry="1" fill="#42A5F5" opacity="0.6"/>
            <rect x="11" y="4" width="2" height="4" fill="#B0BEC5"/>
            <path d="M12 4 Q10 0 12 -2 Q14 0 12 4" fill="#90CAF9" opacity="0.7"/>
            <path d="M9 8 Q7 6 8 4" stroke="#90CAF9" strokeWidth="1" fill="none" opacity="0.5"/>
            <path d="M15 8 Q17 6 16 4" stroke="#90CAF9" strokeWidth="1" fill="none" opacity="0.5"/>
            <circle cx="12" cy="-1" r="0.8" fill="#BBDEFB" opacity="0.8"/>
            <circle cx="10" cy="2" r="0.5" fill="#BBDEFB" opacity="0.6"/>
            <circle cx="14" cy="1" r="0.5" fill="#BBDEFB" opacity="0.6"/>
            <circle cx="6" cy="17" r="1" fill="#B0BEC5" opacity="0.5"/>
            <circle cx="18" cy="17" r="1" fill="#B0BEC5" opacity="0.5"/>
        </g>
    ),
    // Fountain Edge
    'f': (
        <g>
            <ellipse cx="12" cy="12" rx="12" ry="6" fill="#78909C"/>
            <ellipse cx="12" cy="11" rx="11" ry="5.5" fill="#90A4AE"/>
            <ellipse cx="12" cy="11" rx="10" ry="5" fill="#1565C0" opacity="0.6"/>
            <ellipse cx="12" cy="10.5" rx="9" ry="4.5" fill="#42A5F5" opacity="0.5"/>
            <ellipse cx="12" cy="10" rx="7" ry="3.5" fill="none" stroke="#64B5F6" strokeWidth="0.5" opacity="0.4"/>
            <ellipse cx="12" cy="10" rx="4" ry="2" fill="none" stroke="#90CAF9" strokeWidth="0.3" opacity="0.3"/>
            <ellipse cx="8" cy="9" rx="2" ry="1" fill="#FFFFFF" opacity="0.2"/>
            <ellipse cx="15" cy="11" rx="1.5" ry="0.8" fill="#FFFFFF" opacity="0.15"/>
        </g>
    ),
    // Hedge - Formal French garden topiary style
    'H': (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="21" rx="10" ry="2" fill="#000" opacity="0.15"/>
            {/* Main hedge body - sculpted rectangular form */}
            <rect x="1" y="6" width="22" height="14" fill="#166534"/>
            <rect x="2" y="5" width="20" height="14" fill="#15803D"/>
            {/* Flat trimmed top surface */}
            <rect x="1" y="4" width="22" height="3" fill="#22863a"/>
            <rect x="2" y="3" width="20" height="2" fill="#2ea043"/>
            {/* Foliage texture - clustered leaves */}
            <g opacity="0.7">
                {/* Top layer of clipped leaves */}
                <circle cx="4" cy="6" r="2.5" fill="#22C55E"/>
                <circle cx="8" cy="5" r="2.2" fill="#16A34A"/>
                <circle cx="12" cy="4" r="2.5" fill="#22C55E"/>
                <circle cx="16" cy="5" r="2.2" fill="#16A34A"/>
                <circle cx="20" cy="6" r="2.5" fill="#22C55E"/>
                {/* Middle layer */}
                <circle cx="6" cy="10" r="3" fill="#15803D"/>
                <circle cx="12" cy="9" r="3.5" fill="#166534"/>
                <circle cx="18" cy="10" r="3" fill="#15803D"/>
                {/* Bottom layer */}
                <circle cx="4" cy="15" r="2.5" fill="#14532D"/>
                <circle cx="10" cy="16" r="2.8" fill="#166534"/>
                <circle cx="16" cy="15" r="2.8" fill="#14532D"/>
                <circle cx="20" cy="16" r="2.5" fill="#166534"/>
            </g>
            {/* Light highlight on top */}
            <ellipse cx="12" cy="4" rx="8" ry="1.5" fill="#4ADE80" opacity="0.3"/>
            {/* Subtle shadow at bottom */}
            <rect x="2" y="18" width="20" height="2" fill="#0F4A20" opacity="0.4"/>
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
    // Column
    'c': (
        <g>
            <ellipse cx="13" cy="22" rx="8" ry="2" fill="#000" opacity="0.15"/>
            <rect x="0" y="20" width="24" height="4" fill="#C4C1BD"/>
            <rect x="2" y="18" width="20" height="2" fill="#D6D3D1"/>
            <rect x="4" y="16" width="16" height="2" fill="#E7E5E4"/>
            <ellipse cx="12" cy="17" rx="8" ry="1" fill="#E7E5E4"/>
            <rect x="6" y="-16" width="12" height="34" fill="#D6D3D1"/>
            <line x1="8" y1="-16" x2="8" y2="18" stroke="#A8A29E" strokeWidth="0.5"/>
            <line x1="10" y1="-16" x2="10" y2="18" stroke="#B8B5B1" strokeWidth="0.3"/>
            <line x1="12" y1="-16" x2="12" y2="18" stroke="#A8A29E" strokeWidth="0.5"/>
            <line x1="14" y1="-16" x2="14" y2="18" stroke="#B8B5B1" strokeWidth="0.3"/>
            <line x1="16" y1="-16" x2="16" y2="18" stroke="#A8A29E" strokeWidth="0.5"/>
            <rect x="4" y="-18" width="16" height="4" fill="#D6D3D1"/>
            <rect x="2" y="-22" width="20" height="4" fill="#E7E5E4"/>
            <rect x="0" y="-26" width="24" height="4" fill="#F5F5F4"/>
            <path d="M4 -18 Q8 -24 12 -18 Q16 -24 20 -18" fill="#D6D3D1" stroke="#A8A29E" strokeWidth="0.5"/>
            <ellipse cx="4" cy="-23" rx="2" ry="1.5" fill="none" stroke="#A8A29E" strokeWidth="1"/>
            <ellipse cx="20" cy="-23" rx="2" ry="1.5" fill="none" stroke="#A8A29E" strokeWidth="1"/>
        </g>
    ),
    // Lantern
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
    // Carpet (default - will be overridden by zone-specific)
    'r': (
        <g>
            <rect width="24" height="24" fill="#991B1B"/>
            <rect x="2" y="2" width="20" height="20" fill="none" stroke="#EAB308" strokeWidth="1"/>
            <rect x="4" y="4" width="16" height="16" fill="none" stroke="#CA8A04" strokeWidth="0.5"/>
            <circle cx="12" cy="12" r="4" fill="none" stroke="#EAB308" strokeWidth="1"/>
            <circle cx="12" cy="12" r="2" fill="#FBBF24"/>
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
    // Table (café)
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
    // Newspaper
    'n': (
        <g>
            <rect x="4" y="8" width="16" height="12" fill="#FEF3C7" transform="rotate(-5 12 14)"/>
            <rect x="5" y="9" width="14" height="2" fill="#1A1A1A" transform="rotate(-5 12 14)"/>
            <line x1="5" y1="13" x2="19" y2="12" stroke="#6B7280" strokeWidth="0.5"/>
            <line x1="5" y1="15" x2="19" y2="14" stroke="#6B7280" strokeWidth="0.5"/>
            <line x1="5" y1="17" x2="12" y2="16.5" stroke="#6B7280" strokeWidth="0.5"/>
        </g>
    ),
    // Puddle
    'p': (
        <g>
            <ellipse cx="12" cy="12" rx="10" ry="6" fill="#1E40AF" opacity="0.4"/>
            <ellipse cx="12" cy="11" rx="8" ry="5" fill="#3B82F6" opacity="0.3"/>
            <ellipse cx="10" cy="10" rx="3" ry="2" fill="#FFFFFF" opacity="0.2"/>
        </g>
    ),
    // Small bush
    's': (
        <g>
            <ellipse cx="12" cy="18" rx="8" ry="2" fill="#000" opacity="0.1"/>
            <ellipse cx="12" cy="14" rx="8" ry="6" fill="#15803D"/>
            <ellipse cx="8" cy="12" rx="5" ry="4" fill="#22C55E"/>
            <ellipse cx="16" cy="12" rx="5" ry="4" fill="#22C55E"/>
            <ellipse cx="12" cy="10" rx="4" ry="3" fill="#16A34A"/>
        </g>
    ),
    // Flowerbed - Victorian garden with roses, tulips, and marigolds
    'w': (
        <g>
            {/* Rich garden soil base */}
            <rect width="24" height="24" fill="#4A2C17"/>
            <rect x="1" y="1" width="22" height="22" fill="#5D3A1A"/>
            {/* Soil texture */}
            <circle cx="4" cy="4" r="1" fill="#3D2412" opacity="0.5"/>
            <circle cx="12" cy="20" r="1.5" fill="#3D2412" opacity="0.4"/>
            <circle cx="20" cy="8" r="1" fill="#3D2412" opacity="0.5"/>

            {/* Foliage base layer */}
            <ellipse cx="6" cy="18" rx="4" ry="3" fill="#15803D" opacity="0.9"/>
            <ellipse cx="18" cy="16" rx="5" ry="4" fill="#166534" opacity="0.85"/>
            <ellipse cx="12" cy="20" rx="4" ry="2.5" fill="#15803D" opacity="0.8"/>

            {/* Leaves */}
            <ellipse cx="3" cy="12" rx="2" ry="5" fill="#15803D" transform="rotate(-25 3 12)"/>
            <ellipse cx="21" cy="10" rx="2" ry="4" fill="#166534" transform="rotate(20 21 10)"/>
            <ellipse cx="8" cy="14" rx="1.5" ry="4" fill="#16A34A" transform="rotate(-10 8 14)" opacity="0.9"/>
            <ellipse cx="16" cy="12" rx="1.5" ry="4" fill="#15803D" transform="rotate(15 16 12)" opacity="0.9"/>

            {/* Main flower 1 - Pink rose (large) */}
            <g transform="translate(6, 7)">
                <circle cx="0" cy="-2.5" r="2" fill="#F472B6"/>
                <circle cx="2.5" cy="0" r="2" fill="#F472B6"/>
                <circle cx="0" cy="2.5" r="2" fill="#EC4899"/>
                <circle cx="-2.5" cy="0" r="2" fill="#F472B6"/>
                <circle cx="1.8" cy="-1.8" r="1.8" fill="#EC4899"/>
                <circle cx="1.8" cy="1.8" r="1.8" fill="#F472B6"/>
                <circle cx="-1.8" cy="1.8" r="1.8" fill="#EC4899"/>
                <circle cx="-1.8" cy="-1.8" r="1.8" fill="#F472B6"/>
                <circle cx="0" cy="0" r="1.5" fill="#FBBF24"/>
            </g>

            {/* Main flower 2 - Purple iris (medium) */}
            <g transform="translate(17, 5)">
                <circle cx="0" cy="-2" r="1.6" fill="#9333EA"/>
                <circle cx="2" cy="0" r="1.6" fill="#A855F7"/>
                <circle cx="0" cy="2" r="1.6" fill="#9333EA"/>
                <circle cx="-2" cy="0" r="1.6" fill="#A855F7"/>
                <circle cx="0" cy="0" r="1.2" fill="#FDE047"/>
            </g>

            {/* Main flower 3 - Yellow marigold (small accent) */}
            <g transform="translate(11, 12)">
                <circle cx="0" cy="-1.5" r="1.2" fill="#FBBF24"/>
                <circle cx="1.5" cy="0" r="1.2" fill="#F59E0B"/>
                <circle cx="0" cy="1.5" r="1.2" fill="#FBBF24"/>
                <circle cx="-1.5" cy="0" r="1.2" fill="#F59E0B"/>
                <circle cx="0" cy="0" r="0.9" fill="#FEF3C7"/>
            </g>

            {/* Small accent buds */}
            <circle cx="20" cy="14" r="1.3" fill="#FB7185"/>
            <circle cx="4" cy="16" r="1.1" fill="#A855F7"/>
            <circle cx="14" cy="18" r="1.2" fill="#F472B6"/>

            {/* Decorative stone border */}
            <rect x="0" y="22" width="24" height="2" fill="#6B4226"/>
            <g opacity="0.4">
                <circle cx="4" cy="23" r="1.5" fill="#8B7355"/>
                <circle cx="12" cy="23" r="1.5" fill="#7A6450"/>
                <circle cx="20" cy="23" r="1.5" fill="#8B7355"/>
            </g>
        </g>
    ),
    // Cushion
    'a': (
        <g>
            <ellipse cx="12" cy="14" rx="8" ry="5" fill="#B91C1C"/>
            <ellipse cx="12" cy="12" rx="7" ry="4" fill="#DC2626"/>
            <ellipse cx="12" cy="11" rx="5" ry="3" fill="#EF4444"/>
            <circle cx="12" cy="11" r="2" fill="#FCD34D"/>
            <path d="M10 11 L8 14 M14 11 L16 14" stroke="#FCD34D" strokeWidth="1"/>
        </g>
    ),
    // Stage floor
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
    // Theater/Concert seat
    'z': (
        <g>
            <rect x="6" y="8" width="12" height="12" fill="#7B1FA2"/>
            <rect x="7" y="9" width="10" height="6" fill="#9C27B0"/>
            <rect x="5" y="6" width="14" height="3" fill="#6A1B9A"/>
            <rect x="6" y="18" width="4" height="4" fill="#4A148C"/>
            <rect x="14" y="18" width="4" height="4" fill="#4A148C"/>
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
                <rect x="3" y="16" width="1" height="4" fill="#4a5568"/>
                <rect x="10" y="18" width="1.5" height="3" fill="#5a6578"/>
                <rect x="18" y="15" width="1" height="5" fill="#4a5568"/>
            </g>
        </g>
    ),
    // Brick wall/balustrade
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
    // Gate Arch
    'J': (
        <g>
            <rect x="8" y="0" width="8" height="24" fill="#2D3748"/>
            <rect x="10" y="2" width="4" height="20" fill="#1A202C"/>
            <path d="M8 4 Q4 8 8 12 M16 4 Q20 8 16 12" stroke="#4A5568" strokeWidth="1.5" fill="none"/>
            <path d="M8 14 Q4 18 8 22 M16 14 Q20 18 16 22" stroke="#4A5568" strokeWidth="1.5" fill="none"/>
            <circle cx="9" cy="3" r="1" fill="#64748B"/>
            <circle cx="15" cy="3" r="1" fill="#64748B"/>
            <circle cx="9" cy="21" r="1" fill="#64748B"/>
            <circle cx="15" cy="21" r="1" fill="#64748B"/>
            <circle cx="12" cy="12" r="2" fill="#FFD700"/>
            <path d="M10 6 L14 10 M14 6 L10 10" stroke="#475569" strokeWidth="0.5"/>
            <path d="M10 14 L14 18 M14 14 L10 18" stroke="#475569" strokeWidth="0.5"/>
        </g>
    ),
    // Turnstile
    'I': (
        <g>
            <rect x="4" y="18" width="16" height="6" fill="#374151"/>
            <rect x="10" y="6" width="4" height="14" fill="#1F2937"/>
            <rect x="2" y="10" width="8" height="2" fill="#4B5563" rx="1"/>
            <rect x="14" y="10" width="8" height="2" fill="#4B5563" rx="1"/>
            <rect x="11" y="4" width="2" height="8" fill="#4B5563" rx="1"/>
            <circle cx="12" cy="11" r="3" fill="#374151"/>
            <circle cx="12" cy="11" r="1.5" fill="#6B7280"/>
            <path d="M6 6 L10 10 L6 14" stroke="#22C55E" strokeWidth="1.5" fill="none"/>
        </g>
    ),
    // Ticket Booth - Ornate 1889 style with "BILLETS" signage
    'N': (
        <g>
            {/* Ground shadow */}
            <ellipse cx="24" cy="23" rx="22" ry="4" fill="#000" opacity="0.2"/>

            {/* Base platform with decorative molding */}
            <rect x="-2" y="20" width="52" height="4" fill="#14532D"/>
            <rect x="0" y="18" width="48" height="4" fill="#166534"/>
            <rect x="1" y="17" width="46" height="2" fill="#1B5E20"/>

            {/* Main booth body */}
            <rect x="0" y="4" width="48" height="15" fill="#166534"/>
            <rect x="1" y="5" width="46" height="13" fill="#15803D"/>

            {/* Left decorative panel */}
            <rect x="3" y="7" width="10" height="9" fill="#14532D"/>
            <rect x="4" y="8" width="8" height="7" fill="#0F4020"/>
            {/* Decorative diamond pattern */}
            <path d="M8 9 L10 11.5 L8 14 L6 11.5 Z" fill="#166534" stroke="#DAA520" strokeWidth="0.3"/>

            {/* Right decorative panel */}
            <rect x="15" y="7" width="10" height="9" fill="#14532D"/>
            <rect x="16" y="8" width="8" height="7" fill="#0F4020"/>
            <path d="M20 9 L22 11.5 L20 14 L18 11.5 Z" fill="#166534" stroke="#DAA520" strokeWidth="0.3"/>

            {/* Service window with brass frame */}
            <rect x="27" y="6" width="18" height="12" fill="#FEF3C7"/>
            <rect x="28" y="7" width="16" height="10" fill="#FFFDE7"/>
            {/* Window bars/grille */}
            <line x1="32" y1="7" x2="32" y2="17" stroke="#B8860B" strokeWidth="0.5"/>
            <line x1="36" y1="7" x2="36" y2="17" stroke="#B8860B" strokeWidth="0.5"/>
            <line x1="40" y1="7" x2="40" y2="17" stroke="#B8860B" strokeWidth="0.5"/>
            <rect x="27" y="6" width="18" height="12" fill="none" stroke="#B8860B" strokeWidth="1.5"/>

            {/* Counter ledge */}
            <rect x="26" y="16" width="20" height="3" fill="#5D3A1A"/>
            <rect x="27" y="17" width="18" height="1" fill="#B8860B"/>

            {/* Upper structure */}
            <rect x="0" y="-20" width="48" height="26" fill="#166534"/>
            <rect x="1" y="-19" width="46" height="24" fill="#15803D"/>

            {/* Ornate mansard roof */}
            <path d="M-6 -20 L24 -40 L54 -20" fill="#14532D"/>
            <path d="M-2 -20 L24 -36 L50 -20" fill="#166534"/>
            <path d="M2 -20 L24 -32 L46 -20" fill="#1B5E20"/>

            {/* Roof finial */}
            <rect x="22" y="-44" width="4" height="6" fill="#B8860B"/>
            <circle cx="24" cy="-45" r="4" fill="#DAA520"/>
            <circle cx="24" cy="-45" r="2.5" fill="#FFD700"/>
            <circle cx="24" cy="-45" r="1" fill="#FEF3C7"/>

            {/* Decorative roof edge ornaments */}
            <circle cx="-2" cy="-20" r="2" fill="#DAA520"/>
            <circle cx="50" cy="-20" r="2" fill="#DAA520"/>

            {/* Upper arched window */}
            <rect x="10" y="-16" width="28" height="10" fill="#FEF3C7"/>
            <path d="M10 -16 Q24 -24 38 -16" fill="#FFFDE7"/>
            <rect x="10" y="-16" width="28" height="10" fill="none" stroke="#B8860B" strokeWidth="1"/>
            <path d="M10 -16 Q24 -24 38 -16" fill="none" stroke="#B8860B" strokeWidth="1"/>
            {/* Window muntins */}
            <line x1="24" y1="-20" x2="24" y2="-6" stroke="#5D3A1A" strokeWidth="0.5"/>
            <line x1="17" y1="-18" x2="17" y2="-6" stroke="#5D3A1A" strokeWidth="0.3"/>
            <line x1="31" y1="-18" x2="31" y2="-6" stroke="#5D3A1A" strokeWidth="0.3"/>

            {/* BILLETS sign board */}
            <rect x="6" y="-4" width="36" height="7" fill="#8B0000"/>
            <rect x="7" y="-3" width="34" height="5" fill="#6B0000"/>
            <rect x="6" y="-4" width="36" height="7" fill="none" stroke="#DAA520" strokeWidth="0.8"/>
            {/* Sign text */}
            <text x="24" y="0.5" textAnchor="middle" fontSize="5" fill="#FFD700" fontFamily="serif" fontWeight="bold">
                BILLETS
            </text>

            {/* Decorative columns */}
            <rect x="-1" y="-20" width="4" height="38" fill="#0F4020"/>
            <rect x="0" y="-18" width="2" height="34" fill="#166534"/>
            <rect x="45" y="-20" width="4" height="38" fill="#0F4020"/>
            <rect x="46" y="-18" width="2" height="34" fill="#166534"/>

            {/* Brass column capitals and bases */}
            <rect x="-1" y="-21" width="4" height="2" fill="#B8860B"/>
            <rect x="45" y="-21" width="4" height="2" fill="#B8860B"/>
            <rect x="-1" y="16" width="4" height="2" fill="#B8860B"/>
            <rect x="45" y="16" width="4" height="2" fill="#B8860B"/>

            {/* Gas lamps on sides */}
            <g>
                <rect x="-5" y="-10" width="2" height="10" fill="#37474F"/>
                <rect x="-6" y="-14" width="4" height="5" fill="#263238"/>
                <rect x="-5.5" y="-13" width="3" height="3" fill="#FFEB3B" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.7;0.9" dur="2s" repeatCount="indefinite"/>
                </rect>
            </g>
            <g>
                <rect x="51" y="-10" width="2" height="10" fill="#37474F"/>
                <rect x="50" y="-14" width="4" height="5" fill="#263238"/>
                <rect x="50.5" y="-13" width="3" height="3" fill="#FFEB3B" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.7;0.9" dur="2.2s" repeatCount="indefinite"/>
                </rect>
            </g>
        </g>
    ),
    // Guard Post
    'Q': (
        <g>
            <ellipse cx="24" cy="22" rx="20" ry="3" fill="#000" opacity="0.2"/>
            <rect x="0" y="8" width="48" height="16" fill="#1E40AF"/>
            <rect x="2" y="10" width="44" height="12" fill="#2563EB"/>
            <rect x="8" y="12" width="8" height="12" fill="#1E3A8A"/>
            <rect x="9" y="13" width="6" height="10" fill="#172554"/>
            <circle cx="14" cy="19" r="1" fill="#FFD700"/>
            <rect x="18" y="12" width="8" height="6" fill="#BFDBFE"/>
            <path d="M22 12 V18 M18 15 H26" stroke="#1E3A8A" strokeWidth="0.5"/>
            <rect x="0" y="-16" width="48" height="26" fill="#1E40AF"/>
            <rect x="2" y="-14" width="44" height="22" fill="#2563EB"/>
            <rect x="-2" y="-20" width="52" height="5" fill="#1E3A8A"/>
            <rect x="-4" y="-22" width="56" height="3" fill="#172554"/>
            <rect x="8" y="-16" width="32" height="4" fill="#FEF3C7"/>
            <rect x="20" y="-28" width="8" height="8" fill="#FEF9C3"/>
            <rect x="21" y="-27" width="6" height="6" fill="#FFEB3B" opacity="0.8"/>
            <path d="M22 -28 L24 -34 L26 -28" fill="#1E3A8A"/>
            <circle cx="24" cy="-35" r="2" fill="#FFD700"/>
            <rect x="42" y="-30" width="2" height="16" fill="#78716C"/>
            <rect x="44" y="-28" width="3" height="6" fill="#002395"/>
            <rect x="47" y="-28" width="3" height="6" fill="#FFFFFF"/>
            <rect x="50" y="-28" width="3" height="6" fill="#ED2939"/>
        </g>
    ),
    // Flagpole
    'y': (
        <g>
            <ellipse cx="12" cy="22" rx="6" ry="2" fill="#000" opacity="0.15"/>
            <rect x="4" y="18" width="16" height="6" fill="#57534E"/>
            <rect x="6" y="16" width="12" height="3" fill="#6B7280"/>
            <rect x="2" y="22" width="20" height="2" fill="#44403C"/>
            <rect x="5" y="19" width="14" height="1" fill="#78716C"/>
            <rect x="10" y="0" width="4" height="18" fill="#78716C"/>
            <rect x="11" y="0" width="2" height="18" fill="#9CA3AF"/>
            <rect x="10" y="-24" width="4" height="26" fill="#78716C"/>
            <rect x="11" y="-24" width="2" height="26" fill="#9CA3AF"/>
            <rect x="10" y="-48" width="4" height="26" fill="#78716C"/>
            <rect x="11" y="-48" width="2" height="26" fill="#9CA3AF"/>
            <rect x="9" y="14" width="6" height="2" fill="#FFD700"/>
            <rect x="9" y="-10" width="6" height="2" fill="#FFD700"/>
            <rect x="9" y="-34" width="6" height="2" fill="#FFD700"/>
            <rect x="12" y="-46" width="20" height="1.5" fill="#57534E"/>
            <path d="M14 -46 L14 -28 Q18 -30 22 -28 L22 -46" fill="#002395"/>
            <path d="M22 -46 L22 -28 Q26 -30 30 -28 L30 -46" fill="#FFFFFF"/>
            <path d="M30 -46 L30 -28 Q34 -30 38 -28 L38 -46" fill="#ED2939"/>
            <path d="M14 -40 Q18 -42 22 -40 Q26 -42 30 -40 Q34 -42 38 -40" stroke="#00000020" strokeWidth="0.5" fill="none"/>
            <path d="M12 -56 L8 -48 L12 -50 L16 -48 Z" fill="#FFD700"/>
            <circle cx="12" cy="-48" r="3" fill="#FFD700"/>
            <circle cx="12" cy="-48" r="1.5" fill="#FEF3C7"/>
            <path d="M10 -48 L12 -58 L14 -48" fill="#FFD700"/>
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
};

// Directional door variants - Wood and Metal styles
export const DOOR_GRAPHICS: Record<string, JSX.Element> = {
    // Wood Door North (facing north, hinges visible)
    'DN': (
        <g>
            <rect x="0" y="0" width="24" height="24" fill="#5D4037"/>
            <rect x="2" y="2" width="20" height="20" fill="#6D4C41"/>
            <rect x="4" y="4" width="16" height="8" fill="#5D4037"/>
            <rect x="4" y="14" width="16" height="6" fill="#5D4037"/>
            <circle cx="18" cy="12" r="1.5" fill="#B8860B"/>
            <rect x="2" y="0" width="2" height="24" fill="#4A3728"/>
            <rect x="20" y="0" width="2" height="24" fill="#4A3728"/>
            <rect x="0" y="0" width="24" height="2" fill="#3E2723"/>
        </g>
    ),
    // Wood Door South (facing south)
    'DS': (
        <g>
            <rect x="0" y="0" width="24" height="24" fill="#5D4037"/>
            <rect x="2" y="2" width="20" height="20" fill="#6D4C41"/>
            <rect x="4" y="4" width="16" height="6" fill="#5D4037"/>
            <rect x="4" y="12" width="16" height="8" fill="#5D4037"/>
            <circle cx="6" cy="12" r="1.5" fill="#B8860B"/>
            <rect x="2" y="0" width="2" height="24" fill="#4A3728"/>
            <rect x="20" y="0" width="2" height="24" fill="#4A3728"/>
            <rect x="0" y="22" width="24" height="2" fill="#3E2723"/>
        </g>
    ),
    // Wood Door East (facing east)
    'DE': (
        <g>
            <rect x="0" y="0" width="24" height="24" fill="#5D4037"/>
            <rect x="2" y="2" width="20" height="20" fill="#6D4C41"/>
            <rect x="4" y="4" width="8" height="16" fill="#5D4037"/>
            <rect x="14" y="4" width="6" height="16" fill="#5D4037"/>
            <circle cx="12" cy="6" r="1.5" fill="#B8860B"/>
            <rect x="0" y="2" width="24" height="2" fill="#4A3728"/>
            <rect x="0" y="20" width="24" height="2" fill="#4A3728"/>
            <rect x="22" y="0" width="2" height="24" fill="#3E2723"/>
        </g>
    ),
    // Wood Door West (facing west)
    'DW': (
        <g>
            <rect x="0" y="0" width="24" height="24" fill="#5D4037"/>
            <rect x="2" y="2" width="20" height="20" fill="#6D4C41"/>
            <rect x="4" y="4" width="6" height="16" fill="#5D4037"/>
            <rect x="12" y="4" width="8" height="16" fill="#5D4037"/>
            <circle cx="12" cy="18" r="1.5" fill="#B8860B"/>
            <rect x="0" y="2" width="24" height="2" fill="#4A3728"/>
            <rect x="0" y="20" width="24" height="2" fill="#4A3728"/>
            <rect x="0" y="0" width="2" height="24" fill="#3E2723"/>
        </g>
    ),
    // Metal Door North (industrial/exhibition style)
    'MN': (
        <g>
            <rect x="0" y="0" width="24" height="24" fill="#37474F"/>
            <rect x="2" y="2" width="20" height="20" fill="#455A64"/>
            <rect x="4" y="4" width="16" height="6" fill="#546E7A"/>
            <rect x="4" y="14" width="16" height="6" fill="#546E7A"/>
            <circle cx="18" cy="12" r="1.5" fill="#90A4AE"/>
            <circle cx="18" cy="12" r="0.8" fill="#607D8B"/>
            <circle cx="3" cy="4" r="0.8" fill="#607D8B"/>
            <circle cx="21" cy="4" r="0.8" fill="#607D8B"/>
            <circle cx="3" cy="20" r="0.8" fill="#607D8B"/>
            <circle cx="21" cy="20" r="0.8" fill="#607D8B"/>
            <rect x="0" y="0" width="24" height="2" fill="#263238"/>
        </g>
    ),
    // Metal Door South
    'MS': (
        <g>
            <rect x="0" y="0" width="24" height="24" fill="#37474F"/>
            <rect x="2" y="2" width="20" height="20" fill="#455A64"/>
            <rect x="4" y="4" width="16" height="6" fill="#546E7A"/>
            <rect x="4" y="14" width="16" height="6" fill="#546E7A"/>
            <circle cx="6" cy="12" r="1.5" fill="#90A4AE"/>
            <circle cx="6" cy="12" r="0.8" fill="#607D8B"/>
            <circle cx="3" cy="4" r="0.8" fill="#607D8B"/>
            <circle cx="21" cy="4" r="0.8" fill="#607D8B"/>
            <circle cx="3" cy="20" r="0.8" fill="#607D8B"/>
            <circle cx="21" cy="20" r="0.8" fill="#607D8B"/>
            <rect x="0" y="22" width="24" height="2" fill="#263238"/>
        </g>
    ),
    // Metal Door East
    'ME': (
        <g>
            <rect x="0" y="0" width="24" height="24" fill="#37474F"/>
            <rect x="2" y="2" width="20" height="20" fill="#455A64"/>
            <rect x="4" y="4" width="6" height="16" fill="#546E7A"/>
            <rect x="14" y="4" width="6" height="16" fill="#546E7A"/>
            <circle cx="12" cy="6" r="1.5" fill="#90A4AE"/>
            <circle cx="12" cy="6" r="0.8" fill="#607D8B"/>
            <circle cx="4" cy="3" r="0.8" fill="#607D8B"/>
            <circle cx="4" cy="21" r="0.8" fill="#607D8B"/>
            <circle cx="20" cy="3" r="0.8" fill="#607D8B"/>
            <circle cx="20" cy="21" r="0.8" fill="#607D8B"/>
            <rect x="22" y="0" width="2" height="24" fill="#263238"/>
        </g>
    ),
    // Metal Door West
    'MW': (
        <g>
            <rect x="0" y="0" width="24" height="24" fill="#37474F"/>
            <rect x="2" y="2" width="20" height="20" fill="#455A64"/>
            <rect x="4" y="4" width="6" height="16" fill="#546E7A"/>
            <rect x="14" y="4" width="6" height="16" fill="#546E7A"/>
            <circle cx="12" cy="18" r="1.5" fill="#90A4AE"/>
            <circle cx="12" cy="18" r="0.8" fill="#607D8B"/>
            <circle cx="4" cy="3" r="0.8" fill="#607D8B"/>
            <circle cx="4" cy="21" r="0.8" fill="#607D8B"/>
            <circle cx="20" cy="3" r="0.8" fill="#607D8B"/>
            <circle cx="20" cy="21" r="0.8" fill="#607D8B"/>
            <rect x="0" y="0" width="2" height="24" fill="#263238"/>
        </g>
    ),
    // Glass/Exhibition Door North - Ornate with glass panels
    'GN': (
        <g>
            <rect x="0" y="0" width="24" height="24" fill="#5D4037"/>
            <rect x="2" y="2" width="20" height="20" fill="#8D6E63"/>
            <rect x="4" y="4" width="16" height="7" fill="#B3E5FC" opacity="0.6"/>
            <rect x="4" y="13" width="16" height="7" fill="#B3E5FC" opacity="0.6"/>
            <line x1="12" y1="4" x2="12" y2="11" stroke="#5D4037" strokeWidth="1"/>
            <line x1="12" y1="13" x2="12" y2="20" stroke="#5D4037" strokeWidth="1"/>
            <circle cx="18" cy="12" r="1.5" fill="#B8860B"/>
            <path d="M2 0 L22 0 L24 2 L24 22 L22 24 L2 24 L0 22 L0 2 Z" fill="none" stroke="#B8860B" strokeWidth="1"/>
        </g>
    ),
    // Glass/Exhibition Door South
    'GS': (
        <g>
            <rect x="0" y="0" width="24" height="24" fill="#5D4037"/>
            <rect x="2" y="2" width="20" height="20" fill="#8D6E63"/>
            <rect x="4" y="4" width="16" height="7" fill="#B3E5FC" opacity="0.6"/>
            <rect x="4" y="13" width="16" height="7" fill="#B3E5FC" opacity="0.6"/>
            <line x1="12" y1="4" x2="12" y2="11" stroke="#5D4037" strokeWidth="1"/>
            <line x1="12" y1="13" x2="12" y2="20" stroke="#5D4037" strokeWidth="1"/>
            <circle cx="6" cy="12" r="1.5" fill="#B8860B"/>
            <path d="M2 0 L22 0 L24 2 L24 22 L22 24 L2 24 L0 22 L0 2 Z" fill="none" stroke="#B8860B" strokeWidth="1"/>
        </g>
    ),
};

// Chair orientations - Elegant Parisian cafe chairs (bentwood Thonet style)
export const CHAIR_GRAPHICS: Record<string, JSX.Element> = {
    // Chair facing North (back toward viewer)
    '1': (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="21" rx="6" ry="1.5" fill="#000" opacity="0.12"/>
            {/* Chair legs - curved bentwood */}
            <path d="M6 22 Q5 18 6 14" stroke="#5D4037" strokeWidth="1.5" fill="none"/>
            <path d="M18 22 Q19 18 18 14" stroke="#5D4037" strokeWidth="1.5" fill="none"/>
            {/* Front legs */}
            <path d="M8 22 Q7 18 8 14" stroke="#4A3728" strokeWidth="1" fill="none"/>
            <path d="M16 22 Q17 18 16 14" stroke="#4A3728" strokeWidth="1" fill="none"/>
            {/* Woven cane seat */}
            <ellipse cx="12" cy="14" rx="6" ry="3" fill="#D4B896"/>
            <ellipse cx="12" cy="13.5" rx="5.5" ry="2.5" fill="#E8D4B8"/>
            {/* Cane pattern */}
            <path d="M7 13 L17 14 M8 12 L16 15" stroke="#C4A476" strokeWidth="0.3" opacity="0.6"/>
            {/* Curved bentwood back (we see back) */}
            <path d="M6 14 Q6 6 12 4 Q18 6 18 14" fill="none" stroke="#5D4037" strokeWidth="2"/>
            <path d="M7 13 Q7 7 12 5 Q17 7 17 13" fill="none" stroke="#6D4C41" strokeWidth="1.5"/>
            {/* Decorative spindles on back */}
            <line x1="9" y1="12" x2="9" y2="7" stroke="#5D4037" strokeWidth="0.8"/>
            <line x1="12" y1="11" x2="12" y2="5" stroke="#5D4037" strokeWidth="0.8"/>
            <line x1="15" y1="12" x2="15" y2="7" stroke="#5D4037" strokeWidth="0.8"/>
        </g>
    ),
    // Chair facing South (front toward viewer)
    '2': (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="21" rx="6" ry="1.5" fill="#000" opacity="0.12"/>
            {/* Back legs (further away) */}
            <path d="M6 22 Q5 18 6 14" stroke="#4A3728" strokeWidth="1" fill="none"/>
            <path d="M18 22 Q19 18 18 14" stroke="#4A3728" strokeWidth="1" fill="none"/>
            {/* Front legs (closer) */}
            <path d="M8 22 Q7 18 8 14" stroke="#5D4037" strokeWidth="1.5" fill="none"/>
            <path d="M16 22 Q17 18 16 14" stroke="#5D4037" strokeWidth="1.5" fill="none"/>
            {/* Curved bentwood back (we see front - with optional cushion) */}
            <path d="M6 14 Q6 6 12 4 Q18 6 18 14" fill="none" stroke="#5D4037" strokeWidth="2"/>
            {/* Seat cushion (optional velvet) */}
            <ellipse cx="12" cy="14" rx="6" ry="3" fill="#7B1FA2"/>
            <ellipse cx="12" cy="13" rx="5" ry="2.5" fill="#9C27B0"/>
            {/* Cushion highlight */}
            <ellipse cx="10" cy="12" rx="2" ry="1" fill="#AB47BC" opacity="0.6"/>
            {/* Front seat edge */}
            <path d="M6 15 Q12 18 18 15" stroke="#5D4037" strokeWidth="1"/>
        </g>
    ),
    // Chair facing East (profile, back on left)
    '3': (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="21" rx="6" ry="1.5" fill="#000" opacity="0.12"/>
            {/* Far legs */}
            <path d="M7 22 Q6 18 7 14" stroke="#4A3728" strokeWidth="1" fill="none"/>
            <path d="M17 22 Q18 18 17 14" stroke="#4A3728" strokeWidth="1" fill="none"/>
            {/* Near legs */}
            <path d="M9 22 Q8 18 9 14" stroke="#5D4037" strokeWidth="1.5" fill="none"/>
            <path d="M19 22 Q20 18 19 14" stroke="#5D4037" strokeWidth="1.5" fill="none"/>
            {/* Seat (profile view - appears narrower) */}
            <ellipse cx="12" cy="14" rx="7" ry="2.5" fill="#D4B896"/>
            <ellipse cx="12" cy="13.5" rx="6.5" ry="2" fill="#E8D4B8"/>
            {/* Back on LEFT side (east-facing means back is west) */}
            <rect x="4" y="5" width="2" height="10" fill="#5D4037" rx="1"/>
            <rect x="5" y="6" width="1" height="8" fill="#6D4C41"/>
            {/* Curved top rail */}
            <path d="M4 5 Q6 3 8 5" fill="none" stroke="#5D4037" strokeWidth="1.5"/>
        </g>
    ),
    // Chair facing West (profile, back on right)
    '4': (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="21" rx="6" ry="1.5" fill="#000" opacity="0.12"/>
            {/* Far legs */}
            <path d="M7 22 Q6 18 7 14" stroke="#4A3728" strokeWidth="1" fill="none"/>
            <path d="M17 22 Q18 18 17 14" stroke="#4A3728" strokeWidth="1" fill="none"/>
            {/* Near legs */}
            <path d="M5 22 Q4 18 5 14" stroke="#5D4037" strokeWidth="1.5" fill="none"/>
            <path d="M15 22 Q14 18 15 14" stroke="#5D4037" strokeWidth="1.5" fill="none"/>
            {/* Seat (profile view - appears narrower) */}
            <ellipse cx="12" cy="14" rx="7" ry="2.5" fill="#D4B896"/>
            <ellipse cx="12" cy="13.5" rx="6.5" ry="2" fill="#E8D4B8"/>
            {/* Back on RIGHT side (west-facing means back is east) */}
            <rect x="18" y="5" width="2" height="10" fill="#5D4037" rx="1"/>
            <rect x="18" y="6" width="1" height="8" fill="#6D4C41"/>
            {/* Curved top rail */}
            <path d="M16 5 Q18 3 20 5" fill="none" stroke="#5D4037" strokeWidth="1.5"/>
        </g>
    ),
};
