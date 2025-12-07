import React from 'react';
import { SHADOW_OFFSET_X } from './utils';

// Pre-computed OBJECT graphics (rendered over terrain)
// These are tiles that sit ON TOP of terrain and need transparent backgrounds

// Flower color palettes for variety - 1889 Paris garden varieties
const FLOWER_PALETTES = [
    { primary: '#F472B6', secondary: '#EC4899', accent: '#FBBF24', name: 'rose', style: 'layered' },
    { primary: '#DC2626', secondary: '#B91C1C', accent: '#FCD34D', name: 'red-rose', style: 'layered' },
    { primary: '#A855F7', secondary: '#7C3AED', accent: '#FDE047', name: 'iris', style: 'star' },
    { primary: '#3B82F6', secondary: '#1D4ED8', accent: '#FEF3C7', name: 'bluebell', style: 'bell' },
    { primary: '#FBBF24', secondary: '#D97706', accent: '#FEF3C7', name: 'marigold', style: 'pom' },
    { primary: '#F97316', secondary: '#C2410C', accent: '#FEF9C3', name: 'poppy', style: 'cup' },
    { primary: '#FFFFFF', secondary: '#E5E7EB', accent: '#FBBF24', name: 'daisy', style: 'ray' },
    { primary: '#F43F5E', secondary: '#BE123C', accent: '#FCD34D', name: 'tulip', style: 'cup' },
];

// Generate a single flower based on style
const renderFlower = (x: number, y: number, palette: typeof FLOWER_PALETTES[0], size: number): JSX.Element => {
    const { primary, secondary, accent, style } = palette;
    const s = size;

    if (style === 'layered') {
        // Rose-like layered petals
        return (
            <g transform={`translate(${x}, ${y})`}>
                <circle cx="0" cy={-s*0.8} r={s*0.65} fill={secondary}/>
                <circle cx={s*0.8} cy="0" r={s*0.65} fill={primary}/>
                <circle cx="0" cy={s*0.8} r={s*0.65} fill={secondary}/>
                <circle cx={-s*0.8} cy="0" r={s*0.65} fill={primary}/>
                <circle cx={s*0.55} cy={-s*0.55} r={s*0.55} fill={primary}/>
                <circle cx={s*0.55} cy={s*0.55} r={s*0.55} fill={secondary}/>
                <circle cx={-s*0.55} cy={s*0.55} r={s*0.55} fill={primary}/>
                <circle cx={-s*0.55} cy={-s*0.55} r={s*0.55} fill={secondary}/>
                <circle cx="0" cy="0" r={s*0.45} fill={accent}/>
                <circle cx="0" cy="0" r={s*0.2} fill="#5D4037"/>
            </g>
        );
    } else if (style === 'star') {
        // Iris/lily star shape
        return (
            <g transform={`translate(${x}, ${y})`}>
                <ellipse cx="0" cy={-s*0.7} rx={s*0.35} ry={s*0.7} fill={primary}/>
                <ellipse cx={s*0.6} cy={s*0.35} rx={s*0.35} ry={s*0.7} fill={secondary} transform={`rotate(120 ${s*0.6} ${s*0.35})`}/>
                <ellipse cx={-s*0.6} cy={s*0.35} rx={s*0.35} ry={s*0.7} fill={primary} transform={`rotate(-120 ${-s*0.6} ${s*0.35})`}/>
                <circle cx="0" cy="0" r={s*0.35} fill={accent}/>
            </g>
        );
    } else if (style === 'bell') {
        // Bell-shaped flower (bluebell)
        return (
            <g transform={`translate(${x}, ${y})`}>
                <ellipse cx="0" cy={s*0.2} rx={s*0.5} ry={s*0.7} fill={primary}/>
                <ellipse cx="0" cy={s*0.4} rx={s*0.45} ry={s*0.5} fill={secondary}/>
                <ellipse cx="0" cy={s*0.5} rx={s*0.3} ry={s*0.25} fill={accent} opacity="0.6"/>
                <line x1="0" y1={-s*0.5} x2="0" y2="0" stroke="#228B22" strokeWidth="1"/>
            </g>
        );
    } else if (style === 'pom') {
        // Marigold pom-pom
        return (
            <g transform={`translate(${x}, ${y})`}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <circle key={i} cx={Math.cos(angle * Math.PI/180) * s*0.5} cy={Math.sin(angle * Math.PI/180) * s*0.5} r={s*0.4} fill={i % 2 === 0 ? primary : secondary}/>
                ))}
                <circle cx="0" cy="0" r={s*0.5} fill={primary}/>
                <circle cx="0" cy="0" r={s*0.3} fill={secondary}/>
            </g>
        );
    } else if (style === 'cup') {
        // Tulip/poppy cup shape
        return (
            <g transform={`translate(${x}, ${y})`}>
                <ellipse cx="0" cy="0" rx={s*0.6} ry={s*0.8} fill={primary}/>
                <ellipse cx={-s*0.25} cy={-s*0.1} rx={s*0.3} ry={s*0.6} fill={secondary} opacity="0.7"/>
                <ellipse cx={s*0.25} cy={-s*0.1} rx={s*0.3} ry={s*0.6} fill={secondary} opacity="0.7"/>
                <ellipse cx="0" cy={s*0.3} rx={s*0.35} ry={s*0.2} fill={accent} opacity="0.5"/>
            </g>
        );
    } else {
        // Daisy ray pattern
        return (
            <g transform={`translate(${x}, ${y})`}>
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                    <ellipse key={i} cx={Math.cos(angle * Math.PI/180) * s*0.55} cy={Math.sin(angle * Math.PI/180) * s*0.55} rx={s*0.25} ry={s*0.5} fill={i % 2 === 0 ? primary : secondary} transform={`rotate(${angle} ${Math.cos(angle * Math.PI/180) * s*0.55} ${Math.sin(angle * Math.PI/180) * s*0.55})`}/>
                ))}
                <circle cx="0" cy="0" r={s*0.4} fill={accent}/>
            </g>
        );
    }
};

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
    const gradId = `flowerbed-${x}-${y}`;

    // Pick flower colors - use harmonious palette
    const flowerColors = [
        { primary: '#E91E63', secondary: '#F48FB1', center: '#FFD54F' }, // Pink roses
        { primary: '#D32F2F', secondary: '#EF5350', center: '#FFF176' }, // Red roses
        { primary: '#7B1FA2', secondary: '#BA68C8', center: '#FFD54F' }, // Purple
    ];
    const f1 = flowerColors[Math.floor(seed1 * 3)];
    const f2 = flowerColors[Math.floor(seed2 * 3)];

    // Render a realistic rose
    const renderRose = (cx: number, cy: number, size: number, colors: typeof f1) => (
        <g key={`rose-${cx}-${cy}`}>
            {/* Shadow */}
            <ellipse cx={cx + 0.5} cy={cy + 0.5} rx={size * 1.2} ry={size} fill="#000" opacity="0.15"/>
            {/* Outer petals */}
            <ellipse cx={cx} cy={cy - size * 0.6} rx={size * 0.5} ry={size * 0.65} fill={colors.primary}/>
            <ellipse cx={cx + size * 0.55} cy={cy - size * 0.2} rx={size * 0.5} ry={size * 0.65} fill={colors.secondary} transform={`rotate(72 ${cx + size * 0.55} ${cy - size * 0.2})`}/>
            <ellipse cx={cx + size * 0.35} cy={cy + size * 0.5} rx={size * 0.5} ry={size * 0.65} fill={colors.primary} transform={`rotate(144 ${cx + size * 0.35} ${cy + size * 0.5})`}/>
            <ellipse cx={cx - size * 0.35} cy={cy + size * 0.5} rx={size * 0.5} ry={size * 0.65} fill={colors.secondary} transform={`rotate(-144 ${cx - size * 0.35} ${cy + size * 0.5})`}/>
            <ellipse cx={cx - size * 0.55} cy={cy - size * 0.2} rx={size * 0.5} ry={size * 0.65} fill={colors.primary} transform={`rotate(-72 ${cx - size * 0.55} ${cy - size * 0.2})`}/>
            {/* Inner petals */}
            <ellipse cx={cx} cy={cy - size * 0.35} rx={size * 0.3} ry={size * 0.4} fill={colors.secondary}/>
            <ellipse cx={cx + size * 0.32} cy={cy + size * 0.1} rx={size * 0.3} ry={size * 0.4} fill={colors.primary} transform={`rotate(72 ${cx + size * 0.32} ${cy + size * 0.1})`}/>
            <ellipse cx={cx - size * 0.32} cy={cy + size * 0.1} rx={size * 0.3} ry={size * 0.4} fill={colors.secondary} transform={`rotate(-72 ${cx - size * 0.32} ${cy + size * 0.1})`}/>
            {/* Center */}
            <circle cx={cx} cy={cy} r={size * 0.25} fill={colors.center}/>
            <ellipse cx={cx - size * 0.08} cy={cy - size * 0.08} rx={size * 0.1} ry={size * 0.06} fill="#FFF" opacity="0.5"/>
        </g>
    );

    return (
        <g>
            <defs>
                <linearGradient id={`${gradId}-soil`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4A3020"/>
                    <stop offset="100%" stopColor="#2C1810"/>
                </linearGradient>
            </defs>

            {/* Rich garden soil base */}
            <rect width="24" height="24" fill={`url(#${gradId}-soil)`}/>

            {/* Soil texture */}
            <ellipse cx={5 + seed1 * 4} cy={18 + seed2 * 3} rx="2" ry="0.8" fill="#3D2517" opacity="0.5"/>
            <ellipse cx={16 + seed3 * 3} cy={20 + seed1 * 2} rx="2.5" ry="0.7" fill="#3D2517" opacity="0.4"/>

            {/* Dense foliage base - back layer */}
            <g opacity="0.7">
                <ellipse cx="4" cy="18" rx="4" ry="3" fill="#0F5132"/>
                <ellipse cx="20" cy="17" rx="4" ry="3" fill="#0F5132"/>
                <ellipse cx="12" cy="19" rx="5" ry="2.5" fill="#0F5132"/>
            </g>

            {/* Mid-layer foliage */}
            <ellipse cx="6" cy="16" rx="4" ry="3" fill="#166534"/>
            <ellipse cx="18" cy="15" rx="4" ry="3" fill="#166534"/>
            <ellipse cx="12" cy="17" rx="4" ry="2.5" fill="#166534"/>

            {/* Front foliage with individual leaves */}
            <ellipse cx="3" cy="14" rx="2" ry="4" fill="#22C55E" transform="rotate(-15 3 14)"/>
            <ellipse cx="7" cy="13" rx="1.8" ry="3.5" fill="#16A34A" transform="rotate(-5 7 13)"/>
            <ellipse cx="11" cy="14" rx="1.5" ry="3" fill="#22C55E" transform="rotate(5 11 14)"/>
            <ellipse cx="15" cy="12" rx="1.8" ry="3.5" fill="#16A34A" transform="rotate(10 15 12)"/>
            <ellipse cx="19" cy="13" rx="2" ry="4" fill="#22C55E" transform="rotate(20 19 13)"/>
            <ellipse cx="22" cy="15" rx="1.5" ry="3" fill="#16A34A" transform="rotate(25 22 15)"/>

            {/* Stems */}
            <path d="M6 8 Q5 11 5 15" stroke="#15803D" strokeWidth="1.2" fill="none"/>
            <path d="M12 6 Q12 9 11 14" stroke="#15803D" strokeWidth="1.2" fill="none"/>
            <path d="M18 7 Q19 10 19 14" stroke="#15803D" strokeWidth="1.2" fill="none"/>

            {/* Main roses - larger, more prominent */}
            {renderRose(6, 6, 3.2, f1)}
            {renderRose(12, 4, 3.5, f2)}
            {renderRose(18, 5, 3, f1)}

            {/* Secondary smaller roses */}
            {renderRose(3 + seed1 * 2, 10, 2, f2)}
            {renderRose(21 - seed2 * 2, 10, 2.2, f1)}

            {/* Small buds */}
            <circle cx={9 + seed3} cy={9} r="1.5" fill={f1.primary}/>
            <circle cx={9 + seed3} cy={9} r="0.8" fill={f1.secondary}/>
            <circle cx={15 + seed4} cy={8} r="1.3" fill={f2.primary}/>
            <circle cx={15 + seed4} cy={8} r="0.7" fill={f2.secondary}/>

            {/* Front leaf accents */}
            <ellipse cx="2" cy="20" rx="1.5" ry="2.5" fill="#4ADE80" transform="rotate(-30 2 20)" opacity="0.8"/>
            <ellipse cx="22" cy="19" rx="1.5" ry="2.5" fill="#4ADE80" transform="rotate(30 22 19)" opacity="0.8"/>

            {/* Decorative stone border */}
            <rect x="0" y="22" width="24" height="2" fill="#6B5344"/>
            <ellipse cx="3" cy="23" rx="2.5" ry="0.9" fill="#8B7355" opacity="0.7"/>
            <ellipse cx="9" cy="23.1" rx="2.3" ry="0.8" fill="#7A6B5A" opacity="0.6"/>
            <ellipse cx="15" cy="23" rx="2.5" ry="0.9" fill="#8B7355" opacity="0.7"/>
            <ellipse cx="21" cy="23.1" rx="2.3" ry="0.8" fill="#7A6B5A" opacity="0.6"/>
        </g>
    );
};

// Generate randomized potted fern based on x,y position
export const generatePlant = (x: number, y: number): JSX.Element => {
    const hash = (a: number, b: number) => {
        const h = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453123;
        return h - Math.floor(h);
    };

    const seed = hash(x, y);
    const seed2 = hash(x + 50, y);
    const seed3 = hash(x, y + 50);
    const gradId = `plant-${x}-${y}`;

    // Randomize frond angles slightly
    const centerOffset = (seed3 - 0.5) * 3; // -1.5 to 1.5

    // Fiddlehead curls - some plants have them, some don't
    const hasFiddleheadLeft = seed > 0.4;
    const hasFiddleheadRight = seed2 > 0.5;
    const hasFiddleheadCenter = seed3 > 0.6;

    // Slight color variation
    const greenShift = Math.floor(seed * 20);
    const darkGreen = `rgb(13, ${79 + greenShift}, 40)`;
    const midGreen = `rgb(21, ${128 + greenShift}, 61)`;
    const lightGreen = `rgb(34, ${197 + Math.min(greenShift, 20)}, 94)`;

    // Pot color variation
    const potVariant = Math.floor(seed * 3);
    const potColors = [
        { base: '#8B4513', mid: '#A0522D', light: '#CD853F', shadow: '#5D2E0A' },
        { base: '#6B4423', mid: '#8B5A2B', light: '#BC8F5F', shadow: '#4A2D12' },
        { base: '#7A4A2A', mid: '#9A6040', light: '#C08060', shadow: '#553318' },
    ];
    const p = potColors[potVariant];

    return (
        <g>
            {/* Gradient definitions */}
            <defs>
                <linearGradient id={`${gradId}-pot`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={p.light} />
                    <stop offset="50%" stopColor={p.mid} />
                    <stop offset="100%" stopColor={p.shadow} />
                </linearGradient>
            </defs>

            {/* Ground shadow - layered for realism */}
            <ellipse cx="14" cy="22.5" rx="6" ry="1.8" fill="#000" opacity="0.15"/>
            <ellipse cx="13" cy="22" rx="4.5" ry="1.3" fill="#000" opacity="0.1"/>

            {/* Pot base/foot - rounded bottom for perspective */}
            <ellipse cx="12" cy="22" rx="5.5" ry="1.2" fill={p.shadow}/>
            <ellipse cx="12" cy="21.5" rx="5" ry="1" fill={p.base}/>

            {/* Pot body with elegant taper */}
            <path d="M6.5 21 Q6 18.5 7 16.5 L17 16.5 Q18 18.5 17.5 21 Z" fill={`url(#${gradId}-pot)`}/>

            {/* Decorative rim with rolled edge */}
            <ellipse cx="12" cy="16.5" rx="5.5" ry="1.4" fill={p.base}/>
            <ellipse cx="12" cy="16.2" rx="5" ry="1.1" fill={p.light}/>
            <ellipse cx="12" cy="16" rx="4.5" ry="0.9" fill={p.mid}/>

            {/* Visible soil */}
            <ellipse cx="12" cy="15.8" rx="4" ry="0.7" fill="#3D2517"/>
            <ellipse cx="12" cy="15.6" rx="3.5" ry="0.5" fill="#4A3020"/>

            {/* Back fronds - darker, with slight variation */}
            <path d={`M10 14 Q${2 - seed * 2} 8 ${-1 - seed} ${3 + seed2}`} stroke={darkGreen} strokeWidth="1.2" fill="none"/>
            <path d={`M14 14 Q${22 + seed2 * 2} 8 ${25 + seed} ${3 + seed}`} stroke={darkGreen} strokeWidth="1.2" fill="none"/>

            {/* Main sweeping fronds */}
            <path d={`M11 14 Q${4 - seed} 7 ${seed * 2} ${2 + seed2}`} stroke={midGreen} strokeWidth="1.4" fill="none"/>
            <path d={`M13 14 Q${20 + seed} 7 ${24 - seed * 2} ${2 + seed}`} stroke={midGreen} strokeWidth="1.4" fill="none"/>

            {/* Fiddlehead curls on main fronds */}
            {hasFiddleheadLeft && (
                <path d={`M${seed * 2} ${2 + seed2} Q${-1} ${1} ${1} ${-1} Q${2} ${0} ${seed * 2 + 1} ${2}`}
                      stroke={midGreen} strokeWidth="1.2" fill="none"/>
            )}
            {hasFiddleheadRight && (
                <path d={`M${24 - seed * 2} ${2 + seed} Q${25} ${1} ${23} ${-1} Q${22} ${0} ${23 - seed * 2} ${2}`}
                      stroke={midGreen} strokeWidth="1.2" fill="none"/>
            )}

            {/* Center upright fronds with variation */}
            <path d={`M12 14 Q${11 + centerOffset} 7 ${10 + centerOffset} 0`} stroke="#16A34A" strokeWidth="1.2" fill="none"/>
            <path d={`M12 14 Q${13 - centerOffset} 7 ${14 - centerOffset} 0`} stroke="#16A34A" strokeWidth="1.2" fill="none"/>
            <path d="M12 14 Q12 6 12 -1" stroke="#166534" strokeWidth="1" fill="none"/>

            {/* Center fiddlehead */}
            {hasFiddleheadCenter && (
                <path d={`M12 -1 Q${11} ${-3} ${13} ${-4} Q${14} ${-2} ${12} ${-1}`}
                      stroke="#166534" strokeWidth="0.9" fill="none"/>
            )}

            {/* Inner fronds */}
            <path d={`M11 14 Q${7 - seed} 9 ${5 - seed2} ${3 + seed}`} stroke={lightGreen} strokeWidth="1" fill="none"/>
            <path d={`M13 14 Q${17 + seed} 9 ${19 + seed2} ${3 + seed}`} stroke={lightGreen} strokeWidth="1" fill="none"/>

            {/* Accent drooping fronds */}
            <path d={`M10 14 Q${5 - seed2} 12 ${2 - seed} ${10 + seed * 2}`} stroke="#4ADE80" strokeWidth="0.8" fill="none"/>
            <path d={`M14 14 Q${19 + seed2} 12 ${22 + seed} ${10 + seed * 2}`} stroke="#4ADE80" strokeWidth="0.8" fill="none"/>
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
    TREE: (
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
    LAMP: (
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
    // Bench - Ornate 1889 Parisian cast iron park bench (single tile)
    BENCH: (
        <g>
            {/* Ground shadow */}
            <ellipse cx="12" cy="22" rx="10" ry="2.5" fill="#000" opacity="0.2"/>

            {/* Cast iron legs with ornate Art Nouveau scrollwork */}
            {/* Left leg assembly */}
            <path d="M3 11 C1 14 1 17 3 20 C4 21 5 21 6 20" stroke="#2D3436" strokeWidth="2" fill="none"/>
            <path d="M3 13 C0 15 0 18 2 20" stroke="#4A5568" strokeWidth="1" fill="none"/>
            <circle cx="2" cy="12" r="1.5" fill="#2D3436"/>
            <circle cx="2" cy="12" r="0.8" fill="#4A5568"/>
            {/* Decorative scroll on left leg */}
            <path d="M2 15 Q0 16 1 17 Q2 18 2 16" stroke="#4A5568" strokeWidth="0.6" fill="none"/>
            <ellipse cx="4" cy="21" rx="2.5" ry="0.8" fill="#2D3436"/>

            {/* Right leg assembly */}
            <path d="M21 11 C23 14 23 17 21 20 C20 21 19 21 18 20" stroke="#2D3436" strokeWidth="2" fill="none"/>
            <path d="M21 13 C24 15 24 18 22 20" stroke="#4A5568" strokeWidth="1" fill="none"/>
            <circle cx="22" cy="12" r="1.5" fill="#2D3436"/>
            <circle cx="22" cy="12" r="0.8" fill="#4A5568"/>
            {/* Decorative scroll on right leg */}
            <path d="M22 15 Q24 16 23 17 Q22 18 22 16" stroke="#4A5568" strokeWidth="0.6" fill="none"/>
            <ellipse cx="20" cy="21" rx="2.5" ry="0.8" fill="#2D3436"/>

            {/* Cross brace between legs */}
            <path d="M5 17 L19 17" stroke="#37474F" strokeWidth="1.2"/>
            <circle cx="12" cy="17" r="1" fill="#37474F"/>

            {/* Wooden seat - multiple slats with gaps */}
            <rect x="1" y="9" width="22" height="1.2" fill="#5D4037" rx="0.3"/>
            <rect x="1" y="10.5" width="22" height="1.2" fill="#6D4C41" rx="0.3"/>
            <rect x="1" y="12" width="22" height="1.2" fill="#5D4037" rx="0.3"/>
            {/* Wood grain highlights */}
            <line x1="3" y1="9.6" x2="8" y2="9.6" stroke="#7D5C47" strokeWidth="0.3" opacity="0.6"/>
            <line x1="14" y1="11.1" x2="20" y2="11.1" stroke="#7D5C47" strokeWidth="0.3" opacity="0.6"/>
            <line x1="5" y1="12.6" x2="12" y2="12.6" stroke="#7D5C47" strokeWidth="0.3" opacity="0.6"/>

            {/* Backrest frame - cast iron with decorative top */}
            <rect x="2" y="3" width="20" height="1.5" fill="#2D3436" rx="0.5"/>
            {/* Decorative finials on backrest */}
            <ellipse cx="4" cy="2.5" rx="1" ry="1.2" fill="#37474F"/>
            <ellipse cx="20" cy="2.5" rx="1" ry="1.2" fill="#37474F"/>
            <circle cx="4" cy="1.8" r="0.5" fill="#4A5568"/>
            <circle cx="20" cy="1.8" r="0.5" fill="#4A5568"/>

            {/* Backrest wooden slats */}
            <rect x="3" y="4.5" width="18" height="1" fill="#6D4C41" rx="0.2"/>
            <rect x="3" y="6" width="18" height="1" fill="#5D4037" rx="0.2"/>
            <rect x="3" y="7.5" width="18" height="1" fill="#6D4C41" rx="0.2"/>
            {/* Wood grain on backrest */}
            <line x1="5" y1="5" x2="10" y2="5" stroke="#8D6E63" strokeWidth="0.2" opacity="0.5"/>
            <line x1="12" y1="6.5" x2="18" y2="6.5" stroke="#8D6E63" strokeWidth="0.2" opacity="0.5"/>

            {/* Cast iron armrests with scrollwork */}
            <path d="M1 4 L1 9 Q0 10 1 11 L3 11" stroke="#2D3436" strokeWidth="1.5" fill="none"/>
            <path d="M23 4 L23 9 Q24 10 23 11 L21 11" stroke="#2D3436" strokeWidth="1.5" fill="none"/>
            {/* Armrest top pads */}
            <ellipse cx="1.5" cy="4" rx="1.5" ry="0.8" fill="#37474F"/>
            <ellipse cx="22.5" cy="4" rx="1.5" ry="0.8" fill="#37474F"/>

            {/* Highlight reflections on iron */}
            <line x1="3" y1="14" x2="3" y2="16" stroke="#6B7280" strokeWidth="0.4" opacity="0.4"/>
            <line x1="21" y1="14" x2="21" y2="16" stroke="#6B7280" strokeWidth="0.4" opacity="0.4"/>
        </g>
    ),
    // Wide Bench (≡) - 2 TILES WIDE: Ornate Parisian park bench
    WIDE_BENCH: (
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
    FOUNTAIN_CENTER: (
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
    FOUNTAIN_EDGE: (
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
    HEDGE: (
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
    // Carriage - 2-tile wide elegant Victorian fiacre (Parisian cab)
    // Uses overflow:visible like kiosk - coordinates extend from ~0 to ~48 (24 units right of tile)
    CARRIAGE: (
        <g>
            {/* Ground shadow spanning 2 tiles */}
            <ellipse cx="24" cy="23" rx="22" ry="3" fill="#000" opacity="0.2"/>

            {/* === REAR LARGE WHEEL (right side) === */}
            <g transform="translate(40, 14)">
                {/* Wheel rim and tire */}
                <circle cx="0" cy="0" r="8" fill="#1A1A1A"/>
                <circle cx="0" cy="0" r="7" fill="none" stroke="#3D2B1F" strokeWidth="1.5"/>
                <circle cx="0" cy="0" r="6" fill="#2D2016"/>
                {/* Decorative outer ring */}
                <circle cx="0" cy="0" r="5.5" fill="none" stroke="#4A3728" strokeWidth="0.5"/>
                {/* Hub */}
                <circle cx="0" cy="0" r="2" fill="#5D4037"/>
                <circle cx="0" cy="0" r="1.4" fill="#8B4513"/>
                <circle cx="0" cy="0" r="0.8" fill="#B8860B"/>
                {/* Spokes - 8 elegant spokes */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <line key={i} x1="0" y1="0" x2={Math.cos(angle * Math.PI / 180) * 5.5} y2={Math.sin(angle * Math.PI / 180) * 5.5} stroke="#5D4037" strokeWidth="0.7"/>
                ))}
            </g>

            {/* === FRONT SMALLER WHEEL === */}
            <g transform="translate(6, 16)">
                <circle cx="0" cy="0" r="6" fill="#1A1A1A"/>
                <circle cx="0" cy="0" r="5" fill="none" stroke="#3D2B1F" strokeWidth="1.2"/>
                <circle cx="0" cy="0" r="4.5" fill="#2D2016"/>
                <circle cx="0" cy="0" r="4" fill="none" stroke="#4A3728" strokeWidth="0.4"/>
                <circle cx="0" cy="0" r="1.6" fill="#5D4037"/>
                <circle cx="0" cy="0" r="1" fill="#8B4513"/>
                <circle cx="0" cy="0" r="0.5" fill="#B8860B"/>
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <line key={i} x1="0" y1="0" x2={Math.cos(angle * Math.PI / 180) * 4} y2={Math.sin(angle * Math.PI / 180) * 4} stroke="#5D4037" strokeWidth="0.5"/>
                ))}
            </g>

            {/* === CARRIAGE UNDERCARRIAGE === */}
            {/* Main axle beam */}
            <rect x="4" y="12" width="38" height="2" fill="#3D2B1F" rx="0.5"/>
            {/* Spring suspension - elegant leaf springs */}
            <path d="M8 10 Q14 14 20 10" stroke="#2D2016" strokeWidth="1.2" fill="none"/>
            <path d="M28 10 Q34 14 40 10" stroke="#2D2016" strokeWidth="1.2" fill="none"/>
            {/* Perch (connecting beam) */}
            <rect x="12" y="10" width="22" height="1.2" fill="#4A3728"/>

            {/* === CARRIAGE BODY === */}
            {/* Main body - deep burgundy lacquered wood */}
            <rect x="10" y="-1" width="26" height="12" rx="2" fill="#4A0E0E"/>
            <rect x="11" y="0" width="24" height="10" rx="1.5" fill="#6B1A1A"/>
            {/* Body panel highlights */}
            <rect x="12" y="1" width="22" height="0.5" fill="#8B2A2A" opacity="0.6"/>

            {/* Gold trim and molding */}
            <rect x="10" y="-2" width="26" height="1" fill="#B8860B"/>
            <rect x="10" y="10" width="26" height="0.8" fill="#B8860B"/>
            <rect x="9" y="-1" width="1" height="12" fill="#D4AF37"/>
            <rect x="36" y="-1" width="1" height="12" fill="#D4AF37"/>

            {/* Decorative gold corner flourishes */}
            <path d="M10 0 Q8 0 8 2 L9 2 Q9 1 10 1" fill="#D4AF37"/>
            <path d="M36 0 Q38 0 38 2 L37 2 Q37 1 36 1" fill="#D4AF37"/>
            <path d="M10 9 Q8 9 8 7 L9 7 Q9 8 10 8" fill="#D4AF37"/>
            <path d="M36 9 Q38 9 38 7 L37 7 Q37 8 36 8" fill="#D4AF37"/>

            {/* === WINDOWS === */}
            {/* Main window with elegant frame */}
            <rect x="14" y="1" width="18" height="7" rx="1" fill="#1A2A3A"/>
            <rect x="15" y="2" width="16" height="5" rx="0.5" fill="#2A3A4A"/>
            {/* Window glass reflection */}
            <path d="M16 3 L19 3 L16 6 Z" fill="#4A5A6A" opacity="0.4"/>
            {/* Gold window frame */}
            <rect x="14" y="1" width="18" height="0.6" fill="#D4AF37"/>
            <rect x="14" y="7.4" width="18" height="0.6" fill="#D4AF37"/>
            <rect x="14" y="1" width="0.6" height="7" fill="#D4AF37"/>
            <rect x="31.4" y="1" width="0.6" height="7" fill="#D4AF37"/>
            {/* Window divider */}
            <rect x="22.7" y="1" width="0.6" height="7" fill="#B8860B"/>

            {/* Curtain glimpse inside */}
            <path d="M17 3 Q19 4.5 21 3" stroke="#6B1A1A" strokeWidth="0.5" fill="none" opacity="0.7"/>
            <path d="M25 3 Q27 4.5 29 3" stroke="#6B1A1A" strokeWidth="0.5" fill="none" opacity="0.7"/>

            {/* === ROOF === */}
            <path d="M8 -1 Q24 -6 40 -1" fill="#3D1A1A"/>
            <path d="M9 -1 Q24 -4 39 -1" fill="#4A0E0E"/>
            {/* Roof edge trim */}
            <path d="M8 -1 Q24 -6 40 -1" stroke="#B8860B" strokeWidth="0.6" fill="none"/>

            {/* === DRIVER'S BOX === */}
            <rect x="0" y="1" width="10" height="7" fill="#3D2B1F"/>
            <rect x="1" y="2" width="8" height="5" fill="#5D4037"/>
            {/* Seat cushion */}
            <rect x="2" y="3" width="6" height="3" rx="0.8" fill="#1A1A40"/>
            <rect x="2.5" y="3.5" width="5" height="2" rx="0.4" fill="#2A2A50"/>
            {/* Footrest */}
            <rect x="0" y="8" width="8" height="1.5" fill="#3D2B1F"/>

            {/* === LAMPS === */}
            {/* Left lamp */}
            <g transform="translate(8, -1)">
                <rect x="-0.8" y="0" width="1.6" height="3" fill="#B8860B"/>
                <rect x="-1.5" y="-2.5" width="3" height="2.5" fill="#2D2016"/>
                <rect x="-1" y="-2" width="2" height="1.5" fill="#FFD700"/>
                <ellipse cx="0" cy="-1.2" rx="0.7" ry="0.5" fill="#FFF8DC"/>
            </g>
            {/* Right lamp */}
            <g transform="translate(38, -1)">
                <rect x="-0.8" y="0" width="1.6" height="3" fill="#B8860B"/>
                <rect x="-1.5" y="-2.5" width="3" height="2.5" fill="#2D2016"/>
                <rect x="-1" y="-2" width="2" height="1.5" fill="#FFD700"/>
                <ellipse cx="0" cy="-1.2" rx="0.7" ry="0.5" fill="#FFF8DC"/>
            </g>

            {/* === DOOR AND STEP === */}
            {/* Door handle */}
            <ellipse cx="32" cy="5" rx="0.8" ry="0.5" fill="#D4AF37"/>
            {/* Step */}
            <rect x="30" y="11" width="5" height="1.2" fill="#2D2016"/>
            <rect x="31" y="10.2" width="3" height="0.8" fill="#B8860B"/>
            {/* Step bracket */}
            <path d="M30 11 L28 13 L35 13 L33 11" fill="#3D2B1F"/>

            {/* === SHAFTS (for horse attachment) === */}
            <rect x="-4" y="8" width="8" height="1.2" fill="#5D4037"/>
            <rect x="-4" y="11" width="8" height="1.2" fill="#5D4037"/>
            {/* Shaft tips */}
            <ellipse cx="-4" cy="8.6" rx="0.8" ry="1.2" fill="#3D2B1F"/>
            <ellipse cx="-4" cy="11.6" rx="0.8" ry="1.2" fill="#3D2B1F"/>

            {/* === DECORATIVE DETAILS === */}
            {/* Coat of arms / crest on door */}
            <ellipse cx="23" cy="5" rx="2.5" ry="2" fill="#B8860B" opacity="0.3"/>
            <ellipse cx="23" cy="5" rx="1.5" ry="1.2" fill="#D4AF37" opacity="0.4"/>

            {/* Highlight reflections on lacquer */}
            <line x1="12" y1="2" x2="12" y2="7" stroke="#8B3A3A" strokeWidth="0.25" opacity="0.5"/>
            <line x1="34" y1="2" x2="34" y2="7" stroke="#8B3A3A" strokeWidth="0.25" opacity="0.5"/>
        </g>
    ),
    // Grand Victorian Carriage (2x2 fiacre with horse)
    // A proper Parisian carriage from the 1889 era
    CARRIAGE_GRAND: (
        <g>
            {/* Ground shadow - spans 2 tiles */}
            <ellipse cx="24" cy="22" rx="22" ry="4" fill="#000" opacity="0.2"/>

            {/* === HORSE (left side) === */}
            {/* Horse body */}
            <ellipse cx="6" cy="12" rx="8" ry="6" fill="#4A3728"/>
            <ellipse cx="6" cy="11" rx="7" ry="5" fill="#5D4037"/>
            {/* Horse neck */}
            <path d="M-2 8 Q-4 2 0 -2 Q4 -4 6 4 Q4 8 -2 8" fill="#5D4037"/>
            <path d="M-1 7 Q-3 3 0 0 Q3 -2 5 4" fill="#6D5147" opacity="0.7"/>
            {/* Horse head */}
            <ellipse cx="-2" cy="-4" rx="4" ry="3" fill="#5D4037"/>
            <ellipse cx="-4" cy="-5" rx="2" ry="1.5" fill="#6D5147"/>
            {/* Horse eye */}
            <circle cx="-3" cy="-5" r="0.8" fill="#1A1A1A"/>
            {/* Horse ears */}
            <path d="M-1 -7 L0 -10 L1 -7" fill="#5D4037"/>
            <path d="M-3 -7 L-4 -10 L-2 -7" fill="#5D4037"/>
            {/* Horse mane */}
            <path d="M0 -2 Q2 -6 0 -8 Q-2 -6 0 -2" fill="#2D2016"/>
            {/* Harness */}
            <path d="M-2 -2 L6 4" stroke="#8B4513" strokeWidth="1.5"/>
            <path d="M4 6 L16 8" stroke="#8B4513" strokeWidth="2"/>
            <circle cx="4" cy="6" r="1.5" fill="#B8860B"/>
            {/* Horse legs */}
            <rect x="-2" y="14" width="2" height="8" fill="#3D2B1F"/>
            <rect x="2" y="14" width="2" height="8" fill="#4A3728"/>
            <rect x="8" y="14" width="2" height="8" fill="#3D2B1F"/>
            <rect x="12" y="14" width="2" height="8" fill="#4A3728"/>
            {/* Hooves */}
            <rect x="-2" y="20" width="2" height="2" fill="#1A1A1A"/>
            <rect x="2" y="20" width="2" height="2" fill="#1A1A1A"/>
            <rect x="8" y="20" width="2" height="2" fill="#1A1A1A"/>
            <rect x="12" y="20" width="2" height="2" fill="#1A1A1A"/>
            {/* Horse tail */}
            <path d="M14 10 Q18 12 16 18 Q14 16 14 10" fill="#2D2016"/>

            {/* === CARRIAGE (right side) === */}
            {/* Large rear wheel */}
            <circle cx="38" cy="16" r="7" fill="#2D2016" stroke="#5D4037" strokeWidth="2"/>
            <circle cx="38" cy="16" r="5" fill="none" stroke="#8B4513" strokeWidth="1"/>
            <circle cx="38" cy="16" r="2" fill="#5D4037"/>
            {/* Wheel spokes */}
            <line x1="38" y1="9" x2="38" y2="23" stroke="#5D4037" strokeWidth="1"/>
            <line x1="31" y1="16" x2="45" y2="16" stroke="#5D4037" strokeWidth="1"/>
            <line x1="33" y1="11" x2="43" y2="21" stroke="#5D4037" strokeWidth="0.8"/>
            <line x1="33" y1="21" x2="43" y2="11" stroke="#5D4037" strokeWidth="0.8"/>

            {/* Small front wheel */}
            <circle cx="20" cy="18" r="5" fill="#2D2016" stroke="#5D4037" strokeWidth="1.5"/>
            <circle cx="20" cy="18" r="3" fill="none" stroke="#8B4513" strokeWidth="0.8"/>
            <circle cx="20" cy="18" r="1.5" fill="#5D4037"/>

            {/* Carriage body - elegant Victorian design */}
            <rect x="22" y="4" width="22" height="12" rx="2" fill="#1A1A40"/>
            <rect x="23" y="5" width="20" height="10" rx="1" fill="#0D0D2B"/>
            {/* Gold trim */}
            <rect x="22" y="3" width="22" height="1.5" fill="#B8860B"/>
            <rect x="22" y="15" width="22" height="1" fill="#B8860B"/>
            {/* Window */}
            <rect x="26" y="6" width="14" height="7" rx="1" fill="#2A3A5A"/>
            <rect x="27" y="7" width="12" height="5" fill="#4A5A7A" opacity="0.6"/>
            {/* Window frame (gold) */}
            <rect x="26" y="6" width="14" height="1" fill="#D4AF37"/>
            <rect x="26" y="12" width="14" height="1" fill="#D4AF37"/>
            <rect x="26" y="6" width="1" height="7" fill="#D4AF37"/>
            <rect x="39" y="6" width="1" height="7" fill="#D4AF37"/>
            {/* Curtain glimpse */}
            <path d="M28 8 Q30 10 32 8 Q34 10 36 8" stroke="#8B0000" strokeWidth="0.5" fill="none"/>

            {/* Carriage roof */}
            <path d="M21 4 Q33 -2 45 4" fill="#0D0D2B"/>
            <path d="M22 4 Q33 0 44 4" fill="#1A1A40"/>
            {/* Luggage rack on top */}
            <rect x="28" y="-2" width="10" height="3" fill="#5D4037"/>
            <rect x="29" y="-1" width="8" height="2" fill="#8B4513"/>

            {/* Driver's seat */}
            <rect x="18" y="2" width="6" height="5" fill="#5D4037"/>
            <rect x="19" y="3" width="4" height="3" fill="#8B4513"/>
            {/* Lamp bracket */}
            <rect x="44" y="4" width="2" height="4" fill="#B8860B"/>
            <circle cx="45" cy="2" r="2" fill="#FFD700"/>
            <circle cx="45" cy="2" r="1.2" fill="#FFF8DC"/>

            {/* Connecting shaft to horse */}
            <rect x="14" y="10" width="10" height="2" fill="#5D4037"/>
            <rect x="14" y="11" width="10" height="1" fill="#8B4513"/>

            {/* Step */}
            <rect x="30" y="16" width="4" height="2" fill="#2D2016"/>
            <rect x="31" y="15" width="2" height="1" fill="#B8860B"/>
        </g>
    ),
    // Column
    COLUMN: (
        <g>
            {/* Ground shadow */}
            <ellipse cx="12" cy="22" rx="8" ry="2.5" fill="#000" opacity="0.18"/>

            {/* BASE - Stacked torus moldings with perspective */}
            {/* Bottom plinth */}
            <ellipse cx="12" cy="22" rx="9" ry="3" fill="#A8A29E"/>
            <rect x="3" y="19" width="18" height="3" fill="#B8B5B1"/>
            <ellipse cx="12" cy="19" rx="9" ry="3" fill="#C4C1BD"/>

            {/* Torus molding */}
            <ellipse cx="12" cy="18" rx="8" ry="2.5" fill="#A8A29E"/>
            <ellipse cx="12" cy="17.5" rx="8" ry="2.5" fill="#D6D3D1"/>
            <ellipse cx="12" cy="17" rx="7.5" ry="2.2" fill="#E7E5E4"/>

            {/* Scotia (concave) transition */}
            <ellipse cx="12" cy="16" rx="6.5" ry="2" fill="#C4C1BD"/>
            <ellipse cx="12" cy="15.5" rx="6" ry="1.8" fill="#D6D3D1"/>

            {/* SHAFT - Fluted cylinder */}
            <rect x="6" y="-14" width="12" height="30" fill="#D6D3D1"/>
            {/* Fluting (vertical grooves) */}
            <path d="M7 -14 Q7.5 0 7 16" stroke="#A8A29E" strokeWidth="0.8" fill="none"/>
            <path d="M9 -14 Q9.5 0 9 16" stroke="#B8B5B1" strokeWidth="0.5" fill="none"/>
            <path d="M11 -14 Q11.5 0 11 16" stroke="#A8A29E" strokeWidth="0.8" fill="none"/>
            <path d="M13 -14 Q12.5 0 13 16" stroke="#A8A29E" strokeWidth="0.8" fill="none"/>
            <path d="M15 -14 Q14.5 0 15 16" stroke="#B8B5B1" strokeWidth="0.5" fill="none"/>
            <path d="M17 -14 Q16.5 0 17 16" stroke="#A8A29E" strokeWidth="0.8" fill="none"/>
            {/* Shaft highlight */}
            <rect x="10" y="-14" width="2" height="30" fill="#E7E5E4" opacity="0.4"/>

            {/* CAPITAL - Ionic style with volutes */}
            {/* Necking (shaft top) */}
            <ellipse cx="12" cy="-14" rx="6" ry="1.8" fill="#C4C1BD"/>
            <ellipse cx="12" cy="-14.5" rx="6" ry="1.8" fill="#D6D3D1"/>

            {/* Echinus (egg-and-dart molding) */}
            <ellipse cx="12" cy="-16" rx="7" ry="2" fill="#D6D3D1"/>
            <ellipse cx="12" cy="-16.5" rx="7" ry="2" fill="#E7E5E4"/>
            {/* Egg pattern */}
            <ellipse cx="8" cy="-16" rx="1.2" ry="1.5" fill="#F5F5F4" opacity="0.6"/>
            <ellipse cx="12" cy="-16" rx="1.2" ry="1.5" fill="#F5F5F4" opacity="0.6"/>
            <ellipse cx="16" cy="-16" rx="1.2" ry="1.5" fill="#F5F5F4" opacity="0.6"/>

            {/* Volutes (scrolls) */}
            <ellipse cx="5" cy="-19" rx="3" ry="2" fill="#D6D3D1"/>
            <ellipse cx="5" cy="-19" rx="2.2" ry="1.5" fill="#E7E5E4"/>
            <circle cx="5" cy="-19" r="1" fill="#C4C1BD"/>
            <ellipse cx="19" cy="-19" rx="3" ry="2" fill="#D6D3D1"/>
            <ellipse cx="19" cy="-19" rx="2.2" ry="1.5" fill="#E7E5E4"/>
            <circle cx="19" cy="-19" r="1" fill="#C4C1BD"/>

            {/* Abacus (top slab) */}
            <rect x="2" y="-23" width="20" height="3" fill="#D6D3D1"/>
            <ellipse cx="12" cy="-23" rx="10" ry="2.5" fill="#E7E5E4"/>
            <ellipse cx="12" cy="-24" rx="10" ry="2.5" fill="#F5F5F4"/>
            {/* Top surface highlight */}
            <ellipse cx="12" cy="-24.5" rx="9" ry="2" fill="#FAFAF9"/>
        </g>
    ),
    // Hanging Lantern - Ornate 1889 gas lantern with soft diffuse glow
    LANTERN: (
        <g>
            {/* Glow effect - large soft ambient light */}
            <defs>
                <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFF8E1" stopOpacity="0.6">
                        <animate attributeName="stop-opacity" values="0.6;0.75;0.55;0.65;0.6" dur="1.5s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="20%" stopColor="#FFECB3" stopOpacity="0.4"/>
                    <stop offset="40%" stopColor="#FFE082" stopOpacity="0.22"/>
                    <stop offset="60%" stopColor="#FFCC80" stopOpacity="0.1"/>
                    <stop offset="80%" stopColor="#FFB74D" stopOpacity="0.04"/>
                    <stop offset="100%" stopColor="#FF9800" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="lanternInner" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFDE7" stopOpacity="0.95"/>
                    <stop offset="35%" stopColor="#FFF9C4" stopOpacity="0.6"/>
                    <stop offset="70%" stopColor="#FFF176" stopOpacity="0.25"/>
                    <stop offset="100%" stopColor="#FFEE58" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="lanternFlame" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFDE7"/>
                    <stop offset="40%" stopColor="#FFF59D"/>
                    <stop offset="100%" stopColor="#FFB300"/>
                </radialGradient>
            </defs>

            {/* LARGE SOFT GLOW - extends well beyond tile */}
            <ellipse cx="12" cy="14" rx="52" ry="44" fill="url(#lanternGlow)"/>
            <ellipse cx="12" cy="14" rx="32" ry="28" fill="url(#lanternGlow)"/>

            {/* Inner bright glow around lantern body */}
            <ellipse cx="12" cy="14" rx="14" ry="12" fill="url(#lanternInner)"/>

            {/* Ceiling mount and chain */}
            <circle cx="12" cy="-2" r="2" fill="#78716C"/>
            <line x1="12" y1="0" x2="12" y2="4" stroke="#78716C" strokeWidth="1.5"/>
            <circle cx="12" cy="2" r="0.8" fill="#57534E"/>
            <line x1="12" y1="3" x2="12" y2="6" stroke="#78716C" strokeWidth="1"/>

            {/* Ornate top cap with finial */}
            <path d="M6 6 Q9 4 12 3 Q15 4 18 6" fill="#92400E" stroke="#78350F" strokeWidth="0.5"/>
            <circle cx="12" cy="3" r="1" fill="#B45309"/>

            {/* Lantern frame - ornate brass/bronze */}
            <rect x="5" y="6" width="14" height="16" fill="none" stroke="#92400E" strokeWidth="2" rx="1"/>

            {/* Glass panels with warm glow */}
            <rect x="6" y="7" width="12" height="14" fill="#FEF3C7" opacity="0.9"/>

            {/* Inner flame effect */}
            <ellipse cx="12" cy="14" rx="3" ry="4" fill="url(#lanternFlame)">
                <animate attributeName="ry" values="4;4.5;3.8;4" dur="0.8s" repeatCount="indefinite"/>
                <animate attributeName="rx" values="3;2.8;3.2;3" dur="0.6s" repeatCount="indefinite"/>
            </ellipse>

            {/* Flame core */}
            <ellipse cx="12" cy="14" rx="1.5" ry="2.5" fill="#FFF7ED">
                <animate attributeName="ry" values="2.5;2.8;2.3;2.5" dur="0.5s" repeatCount="indefinite"/>
            </ellipse>

            {/* Decorative corner brackets */}
            <path d="M5 6 L5 8 M19 6 L19 8" stroke="#78350F" strokeWidth="1.5"/>
            <path d="M5 22 L5 20 M19 22 L19 20" stroke="#78350F" strokeWidth="1.5"/>

            {/* Horizontal divider bars (glass panes) */}
            <line x1="6" y1="11" x2="18" y2="11" stroke="#92400E" strokeWidth="0.7" opacity="0.6"/>
            <line x1="6" y1="17" x2="18" y2="17" stroke="#92400E" strokeWidth="0.7" opacity="0.6"/>

            {/* Bottom cap */}
            <path d="M6 22 Q9 23 12 24 Q15 23 18 22" fill="#92400E" stroke="#78350F" strokeWidth="0.5"/>
            <circle cx="12" cy="24" r="1" fill="#78350F"/>

            {/* Ambient dust motes floating in light */}
            <circle cx="6" cy="20" r="0.5" fill="#FFF8E1" opacity="0.35">
                <animate attributeName="cy" values="20;12;20" dur="4.5s" repeatCount="indefinite"/>
                <animate attributeName="cx" values="6;8;6" dur="5.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.35;0.5;0.25;0.4;0.35" dur="3.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="18" cy="24" r="0.4" fill="#FFECB3" opacity="0.3">
                <animate attributeName="cy" values="24;16;24" dur="5s" repeatCount="indefinite"/>
                <animate attributeName="cx" values="18;15;18" dur="4s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0.45;0.2;0.35;0.3" dur="4.5s" repeatCount="indefinite"/>
            </circle>
        </g>
    ),
    // Telescope
    TELESCOPE: (
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
    BANNER: (
        <g>
            <rect x="10" y="0" width="4" height="3" fill="#CA8A04"/>
            <path d="M4 3 L4 20 Q12 24 20 20 L20 3 Z" fill="#581C87"/>
            <circle cx="12" cy="12" r="4" fill="#EAB308"/>
            <path d="M12 8 L14 12 L12 16 L10 12 Z" fill="#3B0764"/>
        </g>
    ),
    // Carpet (default - will be overridden by zone-specific)
    CARPET: (
        <g>
            <rect width="24" height="24" fill="#991B1B"/>
            <rect x="2" y="2" width="20" height="20" fill="none" stroke="#EAB308" strokeWidth="1"/>
            <rect x="4" y="4" width="16" height="16" fill="none" stroke="#CA8A04" strokeWidth="0.5"/>
            <circle cx="12" cy="12" r="4" fill="none" stroke="#EAB308" strokeWidth="1"/>
            <circle cx="12" cy="12" r="2" fill="#FBBF24"/>
        </g>
    ),
    // Tower Base lattice
    TOWER_BASE: (
        <g>
            <path d="M2 24 L12 2 L22 24" fill="none" stroke="#37474F" strokeWidth="3"/>
            <path d="M5 24 L12 8 L19 24" fill="none" stroke="#455A64" strokeWidth="2"/>
            <path d="M6 18 L18 18 M8 12 L16 12" stroke="#37474F" strokeWidth="1.5" fill="none"/>
            <circle cx="12" cy="8" r="1" fill="#546E7A"/>
        </g>
    ),
    // Railing - Ornate Parisian cast-iron balustrade (Art Nouveau influenced)
    RAILING: (
        <g>
            {/* Main vertical posts - fluted with decorative caps */}
            <rect x="1" y="6" width="4" height="16" fill="#2D3748"/>
            <rect x="2" y="6" width="2" height="16" fill="#4A5568"/>
            <rect x="19" y="6" width="4" height="16" fill="#2D3748"/>
            <rect x="20" y="6" width="2" height="16" fill="#4A5568"/>
            {/* Decorative post caps - pineapple finials */}
            <ellipse cx="3" cy="5" rx="2.5" ry="1.5" fill="#4A5568"/>
            <ellipse cx="3" cy="4" rx="2" ry="2" fill="#5A6578"/>
            <path d="M2 3 Q3 1 4 3" fill="#64748B"/>
            <circle cx="3" cy="2" r="1" fill="#718096"/>
            <ellipse cx="21" cy="5" rx="2.5" ry="1.5" fill="#4A5568"/>
            <ellipse cx="21" cy="4" rx="2" ry="2" fill="#5A6578"/>
            <path d="M20 3 Q21 1 22 3" fill="#64748B"/>
            <circle cx="21" cy="2" r="1" fill="#718096"/>
            {/* Top rail with decorative molding */}
            <rect x="0" y="6" width="24" height="2.5" fill="#3D4852"/>
            <rect x="0" y="6" width="24" height="1" fill="#5A6578"/>
            {/* Ornate scrollwork balusters */}
            <path d="M6 8 Q4 11 6 14 Q8 11 6 8" stroke="#4A5568" strokeWidth="1.2" fill="none"/>
            <path d="M6 14 Q4 17 6 20" stroke="#4A5568" strokeWidth="1.2" fill="none"/>
            <path d="M10 8 Q8 11 10 14 Q12 11 10 8" stroke="#4A5568" strokeWidth="1.2" fill="none"/>
            <path d="M10 14 Q8 17 10 20" stroke="#4A5568" strokeWidth="1.2" fill="none"/>
            <path d="M14 8 Q12 11 14 14 Q16 11 14 8" stroke="#4A5568" strokeWidth="1.2" fill="none"/>
            <path d="M14 14 Q12 17 14 20" stroke="#4A5568" strokeWidth="1.2" fill="none"/>
            <path d="M18 8 Q16 11 18 14 Q20 11 18 8" stroke="#4A5568" strokeWidth="1.2" fill="none"/>
            <path d="M18 14 Q16 17 18 20" stroke="#4A5568" strokeWidth="1.2" fill="none"/>
            {/* Decorative rosettes at intersections */}
            <circle cx="6" cy="14" r="1" fill="#5A6578"/>
            <circle cx="10" cy="14" r="1" fill="#5A6578"/>
            <circle cx="14" cy="14" r="1" fill="#5A6578"/>
            <circle cx="18" cy="14" r="1" fill="#5A6578"/>
            {/* Bottom rail */}
            <rect x="0" y="20" width="24" height="2" fill="#3D4852"/>
            <rect x="0" y="21" width="24" height="1" fill="#2D3748"/>
            {/* Base mounting */}
            <rect x="0" y="22" width="6" height="2" fill="#1A202C"/>
            <rect x="18" y="22" width="6" height="2" fill="#1A202C"/>
        </g>
    ),
    // Elevator - Ornate 1889 Otis hydraulic cage elevator
    ELEVATOR: (
        <g>
            {/* Elevator shaft background - dark interior */}
            <rect x="0" y="0" width="24" height="24" fill="#1A1A1A"/>
            {/* Ornate brass cage frame */}
            <rect x="1" y="1" width="22" height="22" fill="none" stroke="#B8860B" strokeWidth="2"/>
            <rect x="2" y="2" width="20" height="20" fill="none" stroke="#DAA520" strokeWidth="1"/>
            {/* Decorative corner rosettes */}
            <circle cx="3" cy="3" r="2" fill="#B8860B"/>
            <circle cx="3" cy="3" r="1" fill="#FFD700"/>
            <circle cx="21" cy="3" r="2" fill="#B8860B"/>
            <circle cx="21" cy="3" r="1" fill="#FFD700"/>
            <circle cx="3" cy="21" r="2" fill="#B8860B"/>
            <circle cx="3" cy="21" r="1" fill="#FFD700"/>
            <circle cx="21" cy="21" r="2" fill="#B8860B"/>
            <circle cx="21" cy="21" r="1" fill="#FFD700"/>
            {/* Ornate diamond lattice grille */}
            <path d="M6 2 L12 8 L18 2 M6 22 L12 16 L18 22" stroke="#C9A227" strokeWidth="0.8" fill="none"/>
            <path d="M2 6 L8 12 L2 18 M22 6 L16 12 L22 18" stroke="#C9A227" strokeWidth="0.8" fill="none"/>
            <path d="M6 8 L12 14 L18 8 M6 16 L12 10 L18 16" stroke="#8B7500" strokeWidth="0.5" fill="none"/>
            {/* Central decorative medallion with floor indicator */}
            <circle cx="12" cy="12" r="4" fill="#2D2A26"/>
            <circle cx="12" cy="12" r="3.5" fill="none" stroke="#DAA520" strokeWidth="0.8"/>
            <circle cx="12" cy="12" r="2.5" fill="#B8860B"/>
            {/* Arrow indicator */}
            <path d="M12 9 L14 12 L12 10.5 L10 12 Z" fill="#FFD700"/>
            <rect x="11" y="11" width="2" height="3" fill="#FFD700"/>
            {/* Brass handrail hint */}
            <rect x="4" y="11" width="4" height="1" fill="#DAA520" rx="0.5"/>
            <rect x="16" y="11" width="4" height="1" fill="#DAA520" rx="0.5"/>
            {/* Floor threshold */}
            <rect x="0" y="22" width="24" height="2" fill="#8B7355"/>
            <rect x="2" y="22" width="20" height="1" fill="#A08060"/>
        </g>
    ),
    // Potted plant - placeholder, use generatePlant() for randomized version
    PLANT: null as unknown as JSX.Element,
    // Table (café)
    TABLE: (
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
    NEWSPAPER: (
        <g>
            <rect x="4" y="8" width="16" height="12" fill="#FEF3C7" transform="rotate(-5 12 14)"/>
            <rect x="5" y="9" width="14" height="2" fill="#1A1A1A" transform="rotate(-5 12 14)"/>
            <line x1="5" y1="13" x2="19" y2="12" stroke="#6B7280" strokeWidth="0.5"/>
            <line x1="5" y1="15" x2="19" y2="14" stroke="#6B7280" strokeWidth="0.5"/>
            <line x1="5" y1="17" x2="12" y2="16.5" stroke="#6B7280" strokeWidth="0.5"/>
        </g>
    ),
    // Puddle - Rain puddle with animated ripples and sky reflection
    PUDDLE: (
        <g>
            {/* Main puddle body - irregular shape */}
            <ellipse cx="12" cy="13" rx="11" ry="7" fill="#2C4A6E" opacity="0.5"/>
            <ellipse cx="11" cy="12" rx="10" ry="6" fill="#3B6B8C" opacity="0.45"/>
            <ellipse cx="12" cy="11" rx="9" ry="5.5" fill="#4A8AB0" opacity="0.4"/>
            {/* Sky/cloud reflection */}
            <ellipse cx="8" cy="10" rx="4" ry="2.5" fill="#87CEEB" opacity="0.25"/>
            <ellipse cx="15" cy="11" rx="3" ry="1.8" fill="#B0D4E8" opacity="0.2"/>
            {/* Animated ripple rings */}
            <ellipse cx="7" cy="11" rx="2" ry="1.2" fill="none" stroke="#6BA3C7" strokeWidth="0.4" opacity="0.5">
                <animate attributeName="rx" values="0.5;3;0.5" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="ry" values="0.3;1.8;0.3" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="15" cy="13" rx="1.5" ry="0.9" fill="none" stroke="#6BA3C7" strokeWidth="0.3" opacity="0.4">
                <animate attributeName="rx" values="0.3;2.5;0.3" dur="2.5s" repeatCount="indefinite" begin="0.8s"/>
                <animate attributeName="ry" values="0.2;1.5;0.2" dur="2.5s" repeatCount="indefinite" begin="0.8s"/>
                <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite" begin="0.8s"/>
            </ellipse>
            {/* Bright highlight spots */}
            <ellipse cx="6" cy="9" rx="1.5" ry="0.8" fill="#FFFFFF" opacity="0.35"/>
            <circle cx="16" cy="10" r="0.8" fill="#FFFFFF" opacity="0.25"/>
            {/* Puddle edge - wet ground */}
            <ellipse cx="12" cy="14" rx="11" ry="7" fill="none" stroke="#1A3A5C" strokeWidth="0.5" opacity="0.3"/>
        </g>
    ),
    // Small bush
    STEAM: (
        <g>
            <ellipse cx="12" cy="18" rx="8" ry="2" fill="#000" opacity="0.1"/>
            <ellipse cx="12" cy="14" rx="8" ry="6" fill="#15803D"/>
            <ellipse cx="8" cy="12" rx="5" ry="4" fill="#22C55E"/>
            <ellipse cx="16" cy="12" rx="5" ry="4" fill="#22C55E"/>
            <ellipse cx="12" cy="10" rx="4" ry="3" fill="#16A34A"/>
        </g>
    ),
    // Flowerbed - Victorian garden with roses, tulips, and marigolds
    FLOWERBED: (
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
    CUSHION: (
        <g>
            <ellipse cx="12" cy="14" rx="8" ry="5" fill="#B91C1C"/>
            <ellipse cx="12" cy="12" rx="7" ry="4" fill="#DC2626"/>
            <ellipse cx="12" cy="11" rx="5" ry="3" fill="#EF4444"/>
            <circle cx="12" cy="11" r="2" fill="#FCD34D"/>
            <path d="M10 11 L8 14 M14 11 L16 14" stroke="#FCD34D" strokeWidth="1"/>
        </g>
    ),
    // Stage floor
    STAGE: (
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
    // Theater/Concert seat - Plush velvet opera chair with gilt wood
    SEAT: (
        <g>
            {/* Ground shadow */}
            <ellipse cx="12" cy="22" rx="7" ry="1.5" fill="#000" opacity="0.15"/>
            {/* Ornate wooden legs - cabriole style */}
            <path d="M6 18 Q4 20 5 22" stroke="#5D3A1A" strokeWidth="2" fill="none"/>
            <path d="M18 18 Q20 20 19 22" stroke="#5D3A1A" strokeWidth="2" fill="none"/>
            <circle cx="5" cy="22" r="1" fill="#8B6914"/>
            <circle cx="19" cy="22" r="1" fill="#8B6914"/>
            {/* Seat frame - gilded wood */}
            <rect x="4" y="14" width="16" height="5" fill="#6B4423"/>
            <rect x="5" y="15" width="14" height="3" fill="#8B6914"/>
            {/* Plush velvet seat cushion */}
            <ellipse cx="12" cy="13" rx="7" ry="4" fill="#6A1B9A"/>
            <ellipse cx="12" cy="12" rx="6.5" ry="3.5" fill="#7B1FA2"/>
            <ellipse cx="12" cy="11.5" rx="5.5" ry="3" fill="#9C27B0"/>
            {/* Cushion tufting buttons */}
            <circle cx="9" cy="12" r="0.6" fill="#4A148C"/>
            <circle cx="12" cy="11" r="0.6" fill="#4A148C"/>
            <circle cx="15" cy="12" r="0.6" fill="#4A148C"/>
            {/* High curved backrest */}
            <path d="M5 14 Q3 8 5 4 Q12 1 19 4 Q21 8 19 14" fill="#6A1B9A"/>
            <path d="M6 13 Q4 8 6 5 Q12 2 18 5 Q20 8 18 13" fill="#7B1FA2"/>
            <path d="M7 12 Q5.5 8 7 6 Q12 3 17 6 Q18.5 8 17 12" fill="#9C27B0"/>
            {/* Backrest velvet pleating */}
            <path d="M9 6 L9 11" stroke="#6A1B9A" strokeWidth="0.5"/>
            <path d="M12 5 L12 10" stroke="#6A1B9A" strokeWidth="0.5"/>
            <path d="M15 6 L15 11" stroke="#6A1B9A" strokeWidth="0.5"/>
            {/* Gilt wood armrests */}
            <path d="M4 8 Q2 10 3 14" stroke="#B8860B" strokeWidth="2" fill="none"/>
            <path d="M20 8 Q22 10 21 14" stroke="#B8860B" strokeWidth="2" fill="none"/>
            <ellipse cx="3" cy="14" rx="1.5" ry="1" fill="#DAA520"/>
            <ellipse cx="21" cy="14" rx="1.5" ry="1" fill="#DAA520"/>
            {/* Decorative gilt carved crest at top */}
            <ellipse cx="12" cy="3" rx="3" ry="1.5" fill="#B8860B"/>
            <ellipse cx="12" cy="3" rx="2" ry="1" fill="#DAA520"/>
        </g>
    ),
    // Glass floor
    GLASS_FLOOR: (
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
    BRICK_WALL: (
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
    MARKET_STALL: (
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
    // Brazier - ornate iron fire bowl with glowing coals and wide fire glow
    BRAZIER: (
        <g>
            {/* Gradient definitions for fire glow */}
            <defs>
                {/* Large ambient fire glow - warm orange/red, soft edges */}
                <radialGradient id="brazierGlowOuter" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFCC66" stopOpacity="0.5">
                        <animate attributeName="stop-opacity" values="0.5;0.65;0.45;0.55;0.5" dur="1.6s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="20%" stopColor="#FF9933" stopOpacity="0.35" />
                    <stop offset="40%" stopColor="#FF6600" stopOpacity="0.2" />
                    <stop offset="60%" stopColor="#CC3300" stopOpacity="0.1" />
                    <stop offset="80%" stopColor="#991100" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#660000" stopOpacity="0" />
                </radialGradient>
                {/* Inner intense fire glow */}
                <radialGradient id="brazierGlowInner" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFEE99" stopOpacity="0.8">
                        <animate attributeName="stop-opacity" values="0.8;0.95;0.7;0.85;0.8" dur="1.2s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="30%" stopColor="#FFAA44" stopOpacity="0.5" />
                    <stop offset="60%" stopColor="#FF6622" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#CC2200" stopOpacity="0" />
                </radialGradient>
                {/* Coal glow gradient */}
                <radialGradient id="coalGlowBrazier" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFEE66"/>
                    <stop offset="30%" stopColor="#FF8800"/>
                    <stop offset="70%" stopColor="#CC3300"/>
                    <stop offset="100%" stopColor="#661100"/>
                </radialGradient>
            </defs>

            {/* LARGE DIFFUSE FIRE GLOW - wide ranging like lamp */}
            <ellipse cx="12" cy="6" rx="56" ry="42" fill="url(#brazierGlowOuter)" />

            {/* Secondary glow layer for more intensity */}
            <ellipse cx="12" cy="10" rx="36" ry="28" fill="url(#brazierGlowOuter)" />

            {/* Inner bright glow near fire */}
            <ellipse cx="12" cy="12" rx="20" ry="14" fill="url(#brazierGlowInner)" />

            {/* Shadow */}
            <ellipse cx="12" cy="22" rx="7" ry="2" fill="#000" opacity="0.25"/>

            {/* Iron tripod legs */}
            <path d="M4 23 L7 16 L7 14" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M20 23 L17 16 L17 14" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M12 24 L12 18" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round"/>

            {/* Decorative claw feet */}
            <ellipse cx="4" cy="23" rx="1.5" ry="0.8" fill="#1a1a1a"/>
            <ellipse cx="20" cy="23" rx="1.5" ry="0.8" fill="#1a1a1a"/>
            <ellipse cx="12" cy="24" rx="1.5" ry="0.8" fill="#1a1a1a"/>

            {/* Iron bowl - outer rim with highlight */}
            <ellipse cx="12" cy="14" rx="9" ry="4" fill="#3D3D3D"/>
            <ellipse cx="12" cy="14" rx="9" ry="4" fill="none" stroke="#555" strokeWidth="0.8"/>
            <path d="M4 13.5 Q12 11 20 13.5" stroke="#666" strokeWidth="0.6" fill="none" opacity="0.7"/>

            {/* Bowl interior shadow */}
            <ellipse cx="12" cy="14" rx="7.5" ry="3.2" fill="#1a1a1a"/>

            {/* Glowing coals bed */}
            <ellipse cx="12" cy="13.5" rx="6.5" ry="2.8" fill="#330000"/>

            {/* Individual glowing coals with animation */}
            <ellipse cx="9" cy="13" rx="2" ry="1.2" fill="url(#coalGlowBrazier)">
                <animate attributeName="opacity" values="0.9;1;0.7;0.95;0.9" dur="1.8s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="13" cy="12.5" rx="2.5" ry="1.4" fill="url(#coalGlowBrazier)">
                <animate attributeName="opacity" values="1;0.8;0.95;0.75;1" dur="2.1s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="16" cy="13.5" rx="1.8" ry="1" fill="url(#coalGlowBrazier)">
                <animate attributeName="opacity" values="0.85;0.95;0.8;1;0.85" dur="1.5s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="11" cy="14.5" rx="2" ry="1" fill="url(#coalGlowBrazier)">
                <animate attributeName="opacity" values="0.75;0.9;1;0.85;0.75" dur="2.4s" repeatCount="indefinite"/>
            </ellipse>

            {/* Bright ember spots - white hot cores */}
            <circle cx="10" cy="12.5" r="0.9" fill="#FFEE99">
                <animate attributeName="opacity" values="1;0.6;0.9;0.5;1" dur="0.8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="14" cy="12.8" r="0.7" fill="#FFDD77">
                <animate attributeName="opacity" values="0.7;1;0.6;0.9;0.7" dur="1.1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="12" cy="13.5" r="0.5" fill="#FFFFFF">
                <animate attributeName="opacity" values="0.6;0.9;0.5;0.8;0.6" dur="0.6s" repeatCount="indefinite"/>
            </circle>
            <circle cx="15" cy="13.2" r="0.6" fill="#FFCC55">
                <animate attributeName="opacity" values="0.8;0.5;1;0.6;0.8" dur="0.9s" repeatCount="indefinite"/>
            </circle>

            {/* Dancing flames - organic flickering shapes */}
            <path d="M10 11 Q8 6 10 2 Q11 5 10 8" fill="#FF8833" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.9;0.5;0.8;0.7" dur="0.4s" repeatCount="indefinite"/>
                <animate attributeName="d" values="M10 11 Q8 6 10 2 Q11 5 10 8;M10 11 Q9 5 11 1 Q12 6 10 9;M10 11 Q8 6 10 2 Q11 5 10 8" dur="0.6s" repeatCount="indefinite"/>
            </path>
            <path d="M12 10 Q12 4 11 0 Q13 3 12 7" fill="#FFAA44" opacity="0.85">
                <animate attributeName="opacity" values="0.85;0.6;0.95;0.7;0.85" dur="0.35s" repeatCount="indefinite"/>
                <animate attributeName="d" values="M12 10 Q12 4 11 0 Q13 3 12 7;M12 10 Q13 3 12 -1 Q14 4 12 8;M12 10 Q12 4 11 0 Q13 3 12 7" dur="0.5s" repeatCount="indefinite"/>
            </path>
            <path d="M14 11 Q16 5 14 1 Q13 6 14 9" fill="#FF7722" opacity="0.65">
                <animate attributeName="opacity" values="0.65;0.85;0.5;0.75;0.65" dur="0.45s" repeatCount="indefinite"/>
                <animate attributeName="d" values="M14 11 Q16 5 14 1 Q13 6 14 9;M14 11 Q15 4 13 0 Q12 5 14 8;M14 11 Q16 5 14 1 Q13 6 14 9" dur="0.55s" repeatCount="indefinite"/>
            </path>

            {/* Flame tips - bright yellow/white */}
            <path d="M11 8 Q10 4 11 1" stroke="#FFDD66" strokeWidth="1.5" fill="none" strokeLinecap="round">
                <animate attributeName="opacity" values="0.9;0.5;0.8;0.6;0.9" dur="0.3s" repeatCount="indefinite"/>
            </path>
            <path d="M13 7 Q13 3 12 0" stroke="#FFEE88" strokeWidth="1.2" fill="none" strokeLinecap="round">
                <animate attributeName="opacity" values="0.8;0.95;0.6;0.85;0.8" dur="0.25s" repeatCount="indefinite"/>
            </path>

            {/* Decorative iron rim with studs */}
            <ellipse cx="12" cy="14" rx="8.5" ry="3.6" fill="none" stroke="#4a4a4a" strokeWidth="0.5"/>
            <circle cx="5" cy="14" r="0.6" fill="#555"/>
            <circle cx="19" cy="14" r="0.6" fill="#555"/>
            <circle cx="12" cy="11" r="0.6" fill="#555"/>
        </g>
    ),
    // Gate Arch
    GATE_ARCH: (
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
    TURNSTILE: (
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
    TICKET_BOOTH: (
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
    GUARD_POST: (
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
    FLAGPOLE: (
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
    DONKEY: (
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
    DOOR_N: (
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
    DOOR_S: (
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
    DOOR_E: (
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
    DOOR_W: (
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
    METAL_DOOR_N: (
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
    METAL_DOOR_S: (
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
    METAL_DOOR_E: (
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
    METAL_DOOR_W: (
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
    GLASS_DOOR_N: (
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
    GLASS_DOOR_S: (
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

// ===========================================
// TALL DOOR GENERATORS (wall above door)
// Single-tile doors that render wall section above them
// ===========================================

// Generate wall section colors based on cultural style
const getDoorWallColors = (wallStyle: string) => {
    const colors: Record<string, { wall: string; trim: string; highlight: string }> = {
        'SALON': { wall: '#4A5568', trim: '#B8860B', highlight: '#5A6578' },
        'TROCADERO': { wall: '#3D4654', trim: '#B8860B', highlight: '#4D5664' },
        'GRAND_HALL': { wall: '#37474F', trim: '#90A4AE', highlight: '#47575F' },
        'GALERIE': { wall: '#37474F', trim: '#78909C', highlight: '#47575F' },
        'JAPANESE': { wall: '#E8DCC4', trim: '#8B5A2B', highlight: '#F8ECD4' },
        'CHINESE': { wall: '#8B0000', trim: '#FFD700', highlight: '#9B1010' },
        'PERSIAN': { wall: '#1E3A5F', trim: '#DAA520', highlight: '#2E4A6F' },
        'EGYPTIAN': { wall: '#D4B896', trim: '#DAA520', highlight: '#E4C8A6' },
        'MOORISH': { wall: '#0B4F6C', trim: '#FFD700', highlight: '#1B5F7C' },
        'SOUK': { wall: '#D4B896', trim: '#8B7355', highlight: '#E4C8A6' },
        'DEFAULT': { wall: '#D4C8B4', trim: '#B8AC98', highlight: '#E4D8C4' },
    };
    return colors[wallStyle] || colors['DEFAULT'];
};

// Door with wall above - North facing
export const generateTallDoorN = (x: number, y: number, wallStyle: string): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const variant = Math.floor((hash - Math.floor(hash)) * 3);
    const wallColors = getDoorWallColors(wallStyle);

    const woodColors = [
        { frame: '#3D2314', panel: '#5D3A1A', trim: '#B8860B' },
        { frame: '#2D1810', panel: '#4A2C17', trim: '#DAA520' },
        { frame: '#4A3728', panel: '#6B4423', trim: '#C5A028' },
    ];
    const wood = woodColors[variant];

    return (
        <g>
            {/* UPPER WALL SECTION (extends into tile above) */}
            <rect x="0" y="-24" width="24" height="24" fill={wallColors.wall}/>
            {/* Crown molding */}
            <rect x="0" y="-24" width="24" height="2" fill={wallColors.trim}/>
            {/* Wall texture */}
            <rect x="0" y="-22" width="24" height="20" fill={wallColors.highlight} opacity="0.2"/>
            {/* Decorative panel above door */}
            <rect x="4" y="-18" width="16" height="12" fill={wallColors.wall} stroke={wallColors.trim} strokeWidth="0.5" opacity="0.8"/>

            {/* DOOR SECTION (the actual tile) */}
            {/* Door frame */}
            <rect x="2" y="0" width="20" height="24" fill={wood.frame}/>
            {/* Door panel */}
            <rect x="4" y="2" width="16" height="20" fill={wood.panel}/>
            {/* Upper panel */}
            <rect x="6" y="4" width="12" height="6" fill={wood.frame}/>
            {/* Lower panel */}
            <rect x="6" y="12" width="12" height="8" fill={wood.frame}/>
            {/* Handle */}
            <circle cx="16" cy="12" r="1.5" fill={wood.trim}/>
            {/* Frame trim */}
            <rect x="2" y="0" width="20" height="2" fill={wood.trim}/>
            <rect x="2" y="0" width="2" height="24" fill={wood.frame} opacity="0.8"/>
            <rect x="20" y="0" width="2" height="24" fill={wood.frame} opacity="0.8"/>
            {/* Threshold */}
            <rect x="0" y="22" width="24" height="2" fill="#1A1510" opacity="0.5"/>

            {/* Wall sides of door */}
            <rect x="0" y="0" width="2" height="24" fill={wallColors.wall}/>
            <rect x="22" y="0" width="2" height="24" fill={wallColors.wall}/>
        </g>
    );
};

// Door with wall above - South facing
export const generateTallDoorS = (x: number, y: number, wallStyle: string): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const variant = Math.floor((hash - Math.floor(hash)) * 3);
    const wallColors = getDoorWallColors(wallStyle);

    const woodColors = [
        { frame: '#3D2314', panel: '#5D3A1A', trim: '#B8860B' },
        { frame: '#2D1810', panel: '#4A2C17', trim: '#DAA520' },
        { frame: '#4A3728', panel: '#6B4423', trim: '#C5A028' },
    ];
    const wood = woodColors[variant];

    return (
        <g>
            {/* UPPER WALL SECTION */}
            <rect x="0" y="-24" width="24" height="24" fill={wallColors.wall}/>
            <rect x="0" y="-24" width="24" height="2" fill={wallColors.trim}/>
            <rect x="0" y="-22" width="24" height="20" fill={wallColors.highlight} opacity="0.2"/>
            <rect x="4" y="-18" width="16" height="12" fill={wallColors.wall} stroke={wallColors.trim} strokeWidth="0.5" opacity="0.8"/>

            {/* DOOR SECTION */}
            <rect x="2" y="0" width="20" height="24" fill={wood.frame}/>
            <rect x="4" y="2" width="16" height="20" fill={wood.panel}/>
            <rect x="6" y="4" width="12" height="8" fill={wood.frame}/>
            <rect x="6" y="14" width="12" height="6" fill={wood.frame}/>
            <circle cx="8" cy="12" r="1.5" fill={wood.trim}/>
            <rect x="2" y="22" width="20" height="2" fill={wood.trim}/>
            <rect x="2" y="0" width="2" height="24" fill={wood.frame} opacity="0.8"/>
            <rect x="20" y="0" width="2" height="24" fill={wood.frame} opacity="0.8"/>

            {/* Wall sides */}
            <rect x="0" y="0" width="2" height="24" fill={wallColors.wall}/>
            <rect x="22" y="0" width="2" height="24" fill={wallColors.wall}/>
        </g>
    );
};

// Door with wall above - East facing (wall extends upward)
export const generateTallDoorE = (x: number, y: number, wallStyle: string): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const variant = Math.floor((hash - Math.floor(hash)) * 3);
    const wallColors = getDoorWallColors(wallStyle);

    const woodColors = [
        { frame: '#3D2314', panel: '#5D3A1A', trim: '#B8860B' },
        { frame: '#2D1810', panel: '#4A2C17', trim: '#DAA520' },
        { frame: '#4A3728', panel: '#6B4423', trim: '#C5A028' },
    ];
    const wood = woodColors[variant];

    return (
        <g>
            {/* UPPER WALL SECTION */}
            <rect x="0" y="-24" width="24" height="24" fill={wallColors.wall}/>
            <rect x="0" y="-24" width="24" height="2" fill={wallColors.trim}/>
            <rect x="0" y="-22" width="24" height="20" fill={wallColors.highlight} opacity="0.2"/>

            {/* DOOR SECTION */}
            <rect x="0" y="0" width="24" height="24" fill={wood.frame}/>
            <rect x="2" y="2" width="20" height="20" fill={wood.panel}/>
            <rect x="4" y="4" width="8" height="16" fill={wood.frame}/>
            <rect x="14" y="4" width="6" height="16" fill={wood.frame}/>
            <circle cx="12" cy="6" r="1.5" fill={wood.trim}/>
            <rect x="22" y="0" width="2" height="24" fill={wood.trim}/>
            <rect x="0" y="2" width="24" height="2" fill={wood.frame} opacity="0.8"/>
            <rect x="0" y="20" width="24" height="2" fill={wood.frame} opacity="0.8"/>
        </g>
    );
};

// Door with wall above - West facing
export const generateTallDoorW = (x: number, y: number, wallStyle: string): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const variant = Math.floor((hash - Math.floor(hash)) * 3);
    const wallColors = getDoorWallColors(wallStyle);

    const woodColors = [
        { frame: '#3D2314', panel: '#5D3A1A', trim: '#B8860B' },
        { frame: '#2D1810', panel: '#4A2C17', trim: '#DAA520' },
        { frame: '#4A3728', panel: '#6B4423', trim: '#C5A028' },
    ];
    const wood = woodColors[variant];

    return (
        <g>
            {/* UPPER WALL SECTION */}
            <rect x="0" y="-24" width="24" height="24" fill={wallColors.wall}/>
            <rect x="0" y="-24" width="24" height="2" fill={wallColors.trim}/>
            <rect x="0" y="-22" width="24" height="20" fill={wallColors.highlight} opacity="0.2"/>

            {/* DOOR SECTION */}
            <rect x="0" y="0" width="24" height="24" fill={wood.frame}/>
            <rect x="2" y="2" width="20" height="20" fill={wood.panel}/>
            <rect x="4" y="4" width="6" height="16" fill={wood.frame}/>
            <rect x="12" y="4" width="8" height="16" fill={wood.frame}/>
            <circle cx="12" cy="18" r="1.5" fill={wood.trim}/>
            <rect x="0" y="0" width="2" height="24" fill={wood.trim}/>
            <rect x="0" y="2" width="24" height="2" fill={wood.frame} opacity="0.8"/>
            <rect x="0" y="20" width="24" height="2" fill={wood.frame} opacity="0.8"/>
        </g>
    );
};

// ===========================================
// TWO-TILE GRAND DOORWAY GENERATORS
// N/S doors extend horizontally (2 tiles wide)
// E/W doors extend vertically (2 tiles tall)
// ===========================================

// Grand double door facing North - 2 tiles wide, ornate Victorian style
export const generateGrandDoorN = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const variant = Math.floor((hash - Math.floor(hash)) * 3);

    // Wood tones based on variant
    const woodColors = [
        { frame: '#3D2314', panel: '#5D3A1A', trim: '#B8860B' },
        { frame: '#2D1810', panel: '#4A2C17', trim: '#DAA520' },
        { frame: '#4A3728', panel: '#6B4423', trim: '#C5A028' },
    ];
    const wood = woodColors[variant];

    return (
        <g>
            {/* Grand doorframe - extends 2 tiles wide */}
            <rect x="0" y="0" width="48" height="24" fill={wood.frame}/>

            {/* Ornate arch at top */}
            <path d="M2 4 Q24 -8 46 4" fill={wood.frame} stroke={wood.trim} strokeWidth="1"/>
            <path d="M4 6 Q24 -4 44 6" fill={wood.panel}/>

            {/* Left door panel */}
            <rect x="3" y="4" width="20" height="20" fill={wood.panel}/>
            <rect x="5" y="6" width="16" height="7" fill={wood.frame}/>
            <rect x="5" y="15" width="16" height="7" fill={wood.frame}/>

            {/* Right door panel */}
            <rect x="25" y="4" width="20" height="20" fill={wood.panel}/>
            <rect x="27" y="6" width="16" height="7" fill={wood.frame}/>
            <rect x="27" y="15" width="16" height="7" fill={wood.frame}/>

            {/* Center divider with decorative molding */}
            <rect x="22" y="2" width="4" height="22" fill={wood.frame}/>
            <rect x="23" y="4" width="2" height="18" fill={wood.trim} opacity="0.6"/>

            {/* Door handles - brass knobs */}
            <circle cx="20" cy="14" r="1.5" fill={wood.trim}/>
            <circle cx="20" cy="14" r="0.8" fill="#000" opacity="0.3"/>
            <circle cx="28" cy="14" r="1.5" fill={wood.trim}/>
            <circle cx="28" cy="14" r="0.8" fill="#000" opacity="0.3"/>

            {/* Decorative hinges */}
            <rect x="4" y="8" width="2" height="3" fill={wood.trim} opacity="0.8"/>
            <rect x="4" y="18" width="2" height="3" fill={wood.trim} opacity="0.8"/>
            <rect x="42" y="8" width="2" height="3" fill={wood.trim} opacity="0.8"/>
            <rect x="42" y="18" width="2" height="3" fill={wood.trim} opacity="0.8"/>

            {/* Frame edges */}
            <rect x="0" y="0" width="48" height="2" fill={wood.trim}/>
            <rect x="0" y="0" width="2" height="24" fill={wood.frame}/>
            <rect x="46" y="0" width="2" height="24" fill={wood.frame}/>

            {/* Threshold shadow */}
            <rect x="0" y="22" width="48" height="2" fill="#1A1510" opacity="0.5"/>
        </g>
    );
};

// Grand double door facing South - 2 tiles wide
export const generateGrandDoorS = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const variant = Math.floor((hash - Math.floor(hash)) * 3);

    const woodColors = [
        { frame: '#3D2314', panel: '#5D3A1A', trim: '#B8860B' },
        { frame: '#2D1810', panel: '#4A2C17', trim: '#DAA520' },
        { frame: '#4A3728', panel: '#6B4423', trim: '#C5A028' },
    ];
    const wood = woodColors[variant];

    return (
        <g>
            {/* Grand doorframe */}
            <rect x="0" y="0" width="48" height="24" fill={wood.frame}/>

            {/* Left door panel */}
            <rect x="3" y="0" width="20" height="20" fill={wood.panel}/>
            <rect x="5" y="2" width="16" height="7" fill={wood.frame}/>
            <rect x="5" y="11" width="16" height="7" fill={wood.frame}/>

            {/* Right door panel */}
            <rect x="25" y="0" width="20" height="20" fill={wood.panel}/>
            <rect x="27" y="2" width="16" height="7" fill={wood.frame}/>
            <rect x="27" y="11" width="16" height="7" fill={wood.frame}/>

            {/* Center divider */}
            <rect x="22" y="0" width="4" height="22" fill={wood.frame}/>
            <rect x="23" y="2" width="2" height="18" fill={wood.trim} opacity="0.6"/>

            {/* Door handles */}
            <circle cx="20" cy="10" r="1.5" fill={wood.trim}/>
            <circle cx="28" cy="10" r="1.5" fill={wood.trim}/>

            {/* Hinges */}
            <rect x="4" y="4" width="2" height="3" fill={wood.trim} opacity="0.8"/>
            <rect x="4" y="14" width="2" height="3" fill={wood.trim} opacity="0.8"/>
            <rect x="42" y="4" width="2" height="3" fill={wood.trim} opacity="0.8"/>
            <rect x="42" y="14" width="2" height="3" fill={wood.trim} opacity="0.8"/>

            {/* Frame edges */}
            <rect x="0" y="22" width="48" height="2" fill={wood.trim}/>
            <rect x="0" y="0" width="2" height="24" fill={wood.frame}/>
            <rect x="46" y="0" width="2" height="24" fill={wood.frame}/>

            {/* Floor visible below */}
            <rect x="2" y="20" width="44" height="2" fill="#4A4A4A" opacity="0.3"/>
        </g>
    );
};

// Grand archway door facing East - 2 tiles tall, extends DOWN from anchor
export const generateGrandDoorE = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const variant = Math.floor((hash - Math.floor(hash)) * 3);

    const woodColors = [
        { frame: '#3D2314', panel: '#5D3A1A', trim: '#B8860B' },
        { frame: '#2D1810', panel: '#4A2C17', trim: '#DAA520' },
        { frame: '#4A3728', panel: '#6B4423', trim: '#C5A028' },
    ];
    const wood = woodColors[variant];

    return (
        <g>
            {/* Dark interior visible through doorway */}
            <rect x="2" y="2" width="20" height="44" fill="#0A0806"/>

            {/* Tall doorframe - 2 tiles tall (y=0 to y=48) */}
            <rect x="0" y="0" width="24" height="48" fill={wood.frame} opacity="0"/>

            {/* Left frame pillar */}
            <rect x="0" y="0" width="4" height="48" fill={wood.frame}/>
            <rect x="0" y="0" width="2" height="48" fill={wood.trim} opacity="0.5"/>

            {/* Right frame pillar - side facing into room */}
            <rect x="20" y="0" width="4" height="48" fill={wood.frame}/>
            <rect x="22" y="0" width="2" height="48" fill="#000" opacity="0.3"/>

            {/* Ornate arch at top */}
            <path d="M4 0 L4 4 Q12 -4 20 4 L20 0 Z" fill={wood.panel}/>
            <path d="M4 4 Q12 -4 20 4" fill="none" stroke={wood.trim} strokeWidth="1.5"/>

            {/* Inner arch decoration */}
            <path d="M6 6 Q12 0 18 6" fill="none" stroke={wood.trim} strokeWidth="0.8" opacity="0.6"/>

            {/* Door panel - slightly ajar look with dark interior showing */}
            <rect x="4" y="8" width="16" height="38" fill={wood.panel}/>

            {/* Upper decorative panels */}
            <rect x="6" y="10" width="12" height="8" fill={wood.frame}/>
            <rect x="7" y="11" width="10" height="6" fill="#1A1510" opacity="0.4"/>

            {/* Middle panel */}
            <rect x="6" y="20" width="12" height="8" fill={wood.frame}/>
            <rect x="7" y="21" width="10" height="6" fill="#1A1510" opacity="0.4"/>

            {/* Lower panel */}
            <rect x="6" y="30" width="12" height="14" fill={wood.frame}/>
            <rect x="7" y="31" width="10" height="12" fill="#1A1510" opacity="0.4"/>

            {/* Door handle - on right side for east-facing */}
            <circle cx="16" cy="28" r="2" fill={wood.trim}/>
            <circle cx="16" cy="28" r="1" fill="#DAA520"/>

            {/* Decorative keyhole plate */}
            <ellipse cx="16" cy="32" rx="0.8" ry="1.2" fill={wood.trim}/>

            {/* Threshold */}
            <rect x="0" y="46" width="24" height="2" fill="#1A1510"/>
        </g>
    );
};

// Grand archway door facing West - 2 tiles tall, extends DOWN from anchor
export const generateGrandDoorW = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const variant = Math.floor((hash - Math.floor(hash)) * 3);

    const woodColors = [
        { frame: '#3D2314', panel: '#5D3A1A', trim: '#B8860B' },
        { frame: '#2D1810', panel: '#4A2C17', trim: '#DAA520' },
        { frame: '#4A3728', panel: '#6B4423', trim: '#C5A028' },
    ];
    const wood = woodColors[variant];

    return (
        <g>
            {/* Dark interior visible through doorway */}
            <rect x="2" y="2" width="20" height="44" fill="#0A0806"/>

            {/* Tall doorframe - 2 tiles tall (y=0 to y=48) */}
            <rect x="0" y="0" width="24" height="48" fill={wood.frame} opacity="0"/>

            {/* Left frame pillar - side facing into room */}
            <rect x="0" y="0" width="4" height="48" fill={wood.frame}/>
            <rect x="0" y="0" width="2" height="48" fill="#000" opacity="0.3"/>

            {/* Right frame pillar */}
            <rect x="20" y="0" width="4" height="48" fill={wood.frame}/>
            <rect x="22" y="0" width="2" height="48" fill={wood.trim} opacity="0.5"/>

            {/* Ornate arch at top */}
            <path d="M4 0 L4 4 Q12 -4 20 4 L20 0 Z" fill={wood.panel}/>
            <path d="M4 4 Q12 -4 20 4" fill="none" stroke={wood.trim} strokeWidth="1.5"/>

            {/* Inner arch decoration */}
            <path d="M6 6 Q12 0 18 6" fill="none" stroke={wood.trim} strokeWidth="0.8" opacity="0.6"/>

            {/* Door panel - slightly ajar look with dark interior showing */}
            <rect x="4" y="8" width="16" height="38" fill={wood.panel}/>

            {/* Upper decorative panels */}
            <rect x="6" y="10" width="12" height="8" fill={wood.frame}/>
            <rect x="7" y="11" width="10" height="6" fill="#1A1510" opacity="0.4"/>

            {/* Middle panel */}
            <rect x="6" y="20" width="12" height="8" fill={wood.frame}/>
            <rect x="7" y="21" width="10" height="6" fill="#1A1510" opacity="0.4"/>

            {/* Lower panel */}
            <rect x="6" y="30" width="12" height="14" fill={wood.frame}/>
            <rect x="7" y="31" width="10" height="12" fill="#1A1510" opacity="0.4"/>

            {/* Door handle - on left side for west-facing */}
            <circle cx="8" cy="28" r="2" fill={wood.trim}/>
            <circle cx="8" cy="28" r="1" fill="#DAA520"/>

            {/* Decorative keyhole plate */}
            <ellipse cx="8" cy="32" rx="0.8" ry="1.2" fill={wood.trim}/>

            {/* Threshold */}
            <rect x="0" y="46" width="24" height="2" fill="#1A1510"/>
        </g>
    );
};

// Chair orientations - Elegant Parisian cafe chairs (bentwood Thonet style)
// Chair facing profile - can face either East or West
// Returns JSX with back on the specified side
const generateProfileChair = (facingEast: boolean): JSX.Element => {
    if (facingEast) {
        // Back on LEFT side (chair faces east)
        return (
            <g>
                {/* Shadow */}
                <ellipse cx="12" cy="21" rx="6" ry="1.5" fill="#000" opacity="0.12"/>
                {/* Far legs */}
                <path d="M7 22 Q6 18 7 14" stroke="#4A3728" strokeWidth="1" fill="none"/>
                <path d="M17 22 Q18 18 17 14" stroke="#4A3728" strokeWidth="1" fill="none"/>
                {/* Near legs */}
                <path d="M9 22 Q8 18 9 14" stroke="#5D4037" strokeWidth="1.5" fill="none"/>
                <path d="M19 22 Q20 18 19 14" stroke="#5D4037" strokeWidth="1.5" fill="none"/>
                {/* Seat (profile view - oval) */}
                <ellipse cx="12" cy="14" rx="7" ry="2.5" fill="#D4B896"/>
                <ellipse cx="12" cy="13.5" rx="6.5" ry="2" fill="#E8D4B8"/>
                {/* Back on LEFT side */}
                <rect x="4" y="5" width="2" height="10" fill="#5D4037" rx="1"/>
                <rect x="5" y="6" width="1" height="8" fill="#6D4C41"/>
                {/* Curved top rail */}
                <path d="M4 5 Q6 3 8 5" fill="none" stroke="#5D4037" strokeWidth="1.5"/>
            </g>
        );
    } else {
        // Back on RIGHT side (chair faces west)
        return (
            <g>
                {/* Shadow */}
                <ellipse cx="12" cy="21" rx="6" ry="1.5" fill="#000" opacity="0.12"/>
                {/* Far legs */}
                <path d="M7 22 Q6 18 7 14" stroke="#4A3728" strokeWidth="1" fill="none"/>
                <path d="M17 22 Q18 18 17 14" stroke="#4A3728" strokeWidth="1" fill="none"/>
                {/* Near legs */}
                <path d="M5 22 Q4 18 5 14" stroke="#5D4037" strokeWidth="1.5" fill="none"/>
                <path d="M15 22 Q14 18 15 14" stroke="#5D4037" strokeWidth="1.5" fill="none"/>
                {/* Seat (profile view - oval) */}
                <ellipse cx="12" cy="14" rx="7" ry="2.5" fill="#D4B896"/>
                <ellipse cx="12" cy="13.5" rx="6.5" ry="2" fill="#E8D4B8"/>
                {/* Back on RIGHT side */}
                <rect x="18" y="5" width="2" height="10" fill="#5D4037" rx="1"/>
                <rect x="18" y="6" width="1" height="8" fill="#6D4C41"/>
                {/* Curved top rail */}
                <path d="M16 5 Q18 3 20 5" fill="none" stroke="#5D4037" strokeWidth="1.5"/>
            </g>
        );
    }
};

// Generate a profile chair with random facing direction based on position
export const generateChairProfile = (x: number, y: number): JSX.Element => {
    // Simple hash for deterministic randomness based on position
    const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
    const seed = hash - Math.floor(hash);
    // 50% chance of facing either direction
    const facingEast = seed > 0.5;
    return generateProfileChair(facingEast);
};

export const CHAIR_GRAPHICS: Record<string, JSX.Element> = {
    // Chair facing North (back toward viewer)
    CHAIR_N: (
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
    CHAIR_S: (
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
    // CHAIR_E and CHAIR_W are now dynamically generated - these are placeholders
    // that get replaced by generateChairProfile in the rendering code
    CHAIR_E: generateProfileChair(true),
    CHAIR_W: generateProfileChair(false),
};
