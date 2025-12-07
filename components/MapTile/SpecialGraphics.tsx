import React from 'react';
import { SHADOW_OFFSET_X } from './utils';

// Multi-tile structures and special objects

// Kiosk label types for variety
const KIOSK_LABELS = ['LIVRES', 'JOURNAUX', 'CARTES', 'SOUVENIRS', 'GUIDES', 'PHOTOS'];

// ===========================================
// TREE GENERATION - Multiple styles for variety
// ===========================================

// Tree style types
type TreeStyle = 'oak' | 'chestnut' | 'elm' | 'poplar' | 'plane';

// Generate tree with position-based variety
export const generateTree = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const styleIndex = Math.floor((hash - Math.floor(hash)) * 5);
    const styles: TreeStyle[] = ['oak', 'chestnut', 'elm', 'poplar', 'plane'];
    const style = styles[styleIndex];

    // Slight color variations
    const hueShift = ((hash * 100) % 20) - 10;
    const baseGreen = 45 + hueShift; // HSL hue around green

    switch (style) {
        case 'oak':
            // Broad, rounded oak with thick trunk
            return (
                <g>
                    <ellipse cx={14 + SHADOW_OFFSET_X} cy="22" rx="9" ry="2.5" fill="#000" opacity="0.25"/>
                    {/* Thick gnarled trunk */}
                    <path d="M8 10 L7 22 L17 22 L16 10 Q12 8 8 10" fill="#5D4037"/>
                    <path d="M9 12 L8 22 L16 22 L15 12" fill="#6D4C41"/>
                    {/* Root flare */}
                    <path d="M7 21 Q3 23 2 24 M17 21 Q21 23 22 24" stroke="#5D4037" strokeWidth="2.5" fill="none"/>
                    {/* Broad spreading canopy */}
                    <ellipse cx="12" cy="2" rx="13" ry="9" fill="#2E7D32"/>
                    <ellipse cx="6" cy="0" rx="8" ry="7" fill="#388E3C"/>
                    <ellipse cx="18" cy="0" rx="8" ry="7" fill="#388E3C"/>
                    <ellipse cx="12" cy="-4" rx="10" ry="6" fill="#43A047"/>
                    <ellipse cx="4" cy="-1" rx="5" ry="5" fill="#4CAF50"/>
                    <ellipse cx="20" cy="-1" rx="5" ry="5" fill="#4CAF50"/>
                    <ellipse cx="12" cy="-7" rx="7" ry="5" fill="#66BB6A"/>
                    {/* Light dappling */}
                    <circle cx="7" cy="-5" r="2.5" fill="#81C784" opacity="0.6"/>
                    <circle cx="16" cy="-3" r="2" fill="#A5D6A7" opacity="0.5"/>
                    <circle cx="12" cy="-8" r="1.5" fill="#C8E6C9" opacity="0.4"/>
                </g>
            );
        case 'chestnut':
            // Chestnut with dense, drooping foliage
            return (
                <g>
                    <ellipse cx={12 + SHADOW_OFFSET_X} cy="22" rx="8" ry="2" fill="#000" opacity="0.2"/>
                    {/* Straight sturdy trunk */}
                    <rect x="9" y="8" width="6" height="14" fill="#4E342E"/>
                    <rect x="10" y="8" width="4" height="14" fill="#5D4037"/>
                    <path d="M9 20 Q5 23 3 23 M15 20 Q19 23 21 23" stroke="#4E342E" strokeWidth="2" fill="none"/>
                    {/* Dense rounded canopy */}
                    <ellipse cx="12" cy="2" rx="11" ry="10" fill="#1B5E20"/>
                    <ellipse cx="8" cy="-2" rx="7" ry="6" fill="#2E7D32"/>
                    <ellipse cx="16" cy="-2" rx="7" ry="6" fill="#2E7D32"/>
                    <ellipse cx="12" cy="-5" rx="8" ry="6" fill="#388E3C"/>
                    <ellipse cx="12" cy="-8" rx="5" ry="4" fill="#43A047"/>
                    {/* Chestnut flower spikes in season */}
                    <ellipse cx="6" cy="0" rx="1" ry="2" fill="#FFFDE7" opacity="0.7"/>
                    <ellipse cx="18" cy="-1" rx="1" ry="2" fill="#FFFDE7" opacity="0.6"/>
                    {/* Light spots */}
                    <circle cx="10" cy="-6" r="2" fill="#4CAF50" opacity="0.5"/>
                </g>
            );
        case 'elm':
            // Vase-shaped elm with fine branching
            return (
                <g>
                    <ellipse cx={12 + SHADOW_OFFSET_X} cy="22" rx="7" ry="2" fill="#000" opacity="0.2"/>
                    {/* Trunk that splits */}
                    <path d="M10 22 L9 12 Q8 8 6 4" stroke="#5D4037" strokeWidth="3" fill="none"/>
                    <path d="M14 22 L15 12 Q16 8 18 4" stroke="#5D4037" strokeWidth="3" fill="none"/>
                    <rect x="10" y="14" width="4" height="8" fill="#6D4C41"/>
                    {/* Vase-shaped canopy */}
                    <ellipse cx="5" cy="-2" rx="6" ry="8" fill="#2E7D32"/>
                    <ellipse cx="19" cy="-2" rx="6" ry="8" fill="#2E7D32"/>
                    <ellipse cx="12" cy="-6" rx="10" ry="6" fill="#388E3C"/>
                    <ellipse cx="8" cy="-8" rx="5" ry="4" fill="#43A047"/>
                    <ellipse cx="16" cy="-8" rx="5" ry="4" fill="#43A047"/>
                    <ellipse cx="12" cy="-10" rx="6" ry="4" fill="#4CAF50"/>
                    {/* Fine texture */}
                    <circle cx="5" cy="-4" r="1.5" fill="#66BB6A" opacity="0.6"/>
                    <circle cx="19" cy="-4" r="1.5" fill="#66BB6A" opacity="0.6"/>
                </g>
            );
        case 'poplar':
            // Tall columnar poplar (Lombardy style)
            return (
                <g>
                    <ellipse cx={12 + SHADOW_OFFSET_X} cy="22" rx="5" ry="1.5" fill="#000" opacity="0.2"/>
                    {/* Straight slender trunk */}
                    <rect x="10" y="6" width="4" height="16" fill="#5D4037"/>
                    <rect x="11" y="6" width="2" height="16" fill="#6D4C41"/>
                    <path d="M10 20 Q8 22 6 23 M14 20 Q16 22 18 23" stroke="#5D4037" strokeWidth="1.5" fill="none"/>
                    {/* Tall columnar canopy */}
                    <ellipse cx="12" cy="0" rx="6" ry="12" fill="#2E7D32"/>
                    <ellipse cx="12" cy="-4" rx="5" ry="10" fill="#388E3C"/>
                    <ellipse cx="12" cy="-8" rx="4" ry="8" fill="#43A047"/>
                    <ellipse cx="12" cy="-12" rx="3" ry="5" fill="#4CAF50"/>
                    <ellipse cx="12" cy="-15" rx="2" ry="3" fill="#66BB6A"/>
                    {/* Light streaks */}
                    <ellipse cx="14" cy="-6" rx="1" ry="4" fill="#81C784" opacity="0.5"/>
                </g>
            );
        case 'plane':
        default:
            // London plane tree with mottled bark
            return (
                <g>
                    <ellipse cx={13 + SHADOW_OFFSET_X} cy="22" rx="8" ry="2.5" fill="#000" opacity="0.25"/>
                    {/* Mottled bark trunk */}
                    <rect x="9" y="8" width="6" height="14" fill="#6D4C41"/>
                    <rect x="10" y="10" width="2" height="4" fill="#A1887F"/>
                    <rect x="12" y="16" width="2" height="3" fill="#8D6E63"/>
                    <rect x="9" y="12" width="2" height="2" fill="#BCAAA4"/>
                    <path d="M9 21 Q5 23 3 24 M15 21 Q19 23 21 24" stroke="#6D4C41" strokeWidth="2" fill="none"/>
                    {/* Broad irregular canopy */}
                    <ellipse cx="12" cy="2" rx="12" ry="9" fill="#33691E"/>
                    <ellipse cx="6" cy="-1" rx="7" ry="6" fill="#558B2F"/>
                    <ellipse cx="18" cy="-1" rx="7" ry="6" fill="#558B2F"/>
                    <ellipse cx="12" cy="-5" rx="9" ry="6" fill="#689F38"/>
                    <ellipse cx="4" cy="-3" rx="4" ry="4" fill="#7CB342"/>
                    <ellipse cx="20" cy="-3" rx="4" ry="4" fill="#7CB342"/>
                    <ellipse cx="12" cy="-8" rx="6" ry="4" fill="#8BC34A"/>
                    {/* Light patches */}
                    <circle cx="8" cy="-6" r="2" fill="#9CCC65" opacity="0.6"/>
                    <circle cx="15" cy="-4" r="1.5" fill="#AED581" opacity="0.5"/>
                </g>
            );
    }
};

// ===========================================
// HEDGE GENERATION - French formal garden style (boxwood topiary)
// ===========================================

export const generateHedge = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const variant = Math.floor((hash - Math.floor(hash)) * 3);
    const seed = hash - Math.floor(hash);

    // French formal garden boxwood colors - tight, dense foliage
    const baseGreen = variant === 0 ? '#1D4D2B' : variant === 1 ? '#1A4226' : '#225A35';
    const midGreen = variant === 0 ? '#2D6B3F' : variant === 1 ? '#256332' : '#2F7542';
    const highlightGreen = variant === 0 ? '#4A9D5F' : variant === 1 ? '#3D8B4E' : '#5AAF6D';
    const shadowGreen = '#0D2817';

    return (
        <g>
            {/* Ground shadow - crisp rectangular shadow for formal hedge */}
            <rect x={3 + SHADOW_OFFSET_X} y="20" width="18" height="4" rx="1" fill="#000" opacity="0.2"/>

            {/* Main hedge body - precisely clipped rectangular form */}
            <rect x="2" y="3" width="20" height="18" rx="0.5" fill={baseGreen}/>

            {/* Inner depth - slightly lighter */}
            <rect x="3" y="4" width="18" height="16" rx="0.5" fill={midGreen}/>

            {/* Top surface - perfectly flat trimmed plane with perspective */}
            <path d="M2 3 L4 1 L20 1 L22 3 Z" fill={highlightGreen}/>
            <rect x="2" y="3" width="20" height="2" fill={midGreen}/>

            {/* Dense boxwood leaf texture - small tight clusters */}
            <g opacity="0.9">
                {/* Top highlight row */}
                <circle cx="5" cy="4" r="1.5" fill={highlightGreen}/>
                <circle cx="9" cy="3.5" r="1.4" fill={highlightGreen}/>
                <circle cx="12" cy="3" r="1.6" fill={highlightGreen}/>
                <circle cx="15" cy="3.5" r="1.4" fill={highlightGreen}/>
                <circle cx="19" cy="4" r="1.5" fill={highlightGreen}/>

                {/* Upper face - sunlit */}
                <circle cx="4" cy="7" r="1.8" fill={midGreen}/>
                <circle cx="7" cy="6" r="1.6" fill={midGreen}/>
                <circle cx="10" cy="7" r="1.7" fill={midGreen}/>
                <circle cx="14" cy="6" r="1.6" fill={midGreen}/>
                <circle cx="17" cy="7" r="1.7" fill={midGreen}/>
                <circle cx="20" cy="6.5" r="1.6" fill={midGreen}/>

                {/* Middle band */}
                <circle cx="3" cy="10" r="1.9" fill={baseGreen}/>
                <circle cx="6" cy="11" r="1.7" fill={baseGreen}/>
                <circle cx="9" cy="10" r="1.8" fill={baseGreen}/>
                <circle cx="12" cy="11" r="1.9" fill={baseGreen}/>
                <circle cx="15" cy="10" r="1.8" fill={baseGreen}/>
                <circle cx="18" cy="11" r="1.7" fill={baseGreen}/>
                <circle cx="21" cy="10" r="1.8" fill={baseGreen}/>

                {/* Lower band - in shadow */}
                <circle cx="4" cy="14" r="1.6" fill={shadowGreen} opacity="0.7"/>
                <circle cx="8" cy="15" r="1.7" fill={shadowGreen} opacity="0.65"/>
                <circle cx="12" cy="14" r="1.8" fill={shadowGreen} opacity="0.7"/>
                <circle cx="16" cy="15" r="1.7" fill={shadowGreen} opacity="0.65"/>
                <circle cx="20" cy="14" r="1.6" fill={shadowGreen} opacity="0.7"/>

                {/* Base row - darkest */}
                <circle cx="5" cy="18" r="1.5" fill={shadowGreen} opacity="0.8"/>
                <circle cx="10" cy="19" r="1.6" fill={shadowGreen} opacity="0.75"/>
                <circle cx="14" cy="18" r="1.5" fill={shadowGreen} opacity="0.8"/>
                <circle cx="19" cy="19" r="1.6" fill={shadowGreen} opacity="0.75"/>
            </g>

            {/* Fine leaf detail texture overlay */}
            <g opacity="0.4">
                {[...Array(8)].map((_, i) => (
                    <circle
                        key={i}
                        cx={3 + ((i * 2.7 + seed * 3) % 18)}
                        cy={5 + ((i * 3.1 + seed * 5) % 14)}
                        r="0.8"
                        fill={i % 2 === 0 ? highlightGreen : shadowGreen}
                    />
                ))}
            </g>

            {/* Top edge highlight - crisp trimmed line */}
            <line x1="4" y1="1.5" x2="20" y2="1.5" stroke={highlightGreen} strokeWidth="1" opacity="0.6"/>

            {/* Side edge definition */}
            <rect x="2" y="3" width="1" height="18" fill={shadowGreen} opacity="0.4"/>
            <rect x="21" y="3" width="1" height="18" fill={shadowGreen} opacity="0.25"/>

            {/* Base shadow on ground */}
            <rect x="2" y="20" width="20" height="1" fill={shadowGreen} opacity="0.6"/>
        </g>
    );
};

// ===========================================
// ROSE BUSH - Formal French garden standard rose
// Designed for symmetrical placement in jardins à la française
// ===========================================

export const generateRoseBush = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const seed = hash - Math.floor(hash);
    const variant = Math.floor(seed * 4);

    // Rose color variations - classic French garden roses
    const roseColors = [
        { outer: '#E11D48', inner: '#F43F5E', center: '#FCD34D' },  // Classic red
        { outer: '#DB2777', inner: '#EC4899', center: '#FDE047' },  // Pink
        { outer: '#F5F5F5', inner: '#FFFFFF', center: '#FBBF24' },  // White (Iceberg)
        { outer: '#FCD34D', inner: '#FDE68A', center: '#92400E' },  // Yellow (Peace)
    ];
    const rose = roseColors[variant];

    // Seeded positions for roses
    const rose1x = 6 + (seed * 2);
    const rose2x = 18 - (seed * 2);
    const rose3x = 12;

    return (
        <g>
            {/* Ground shadow - circular for bush shape */}
            <ellipse cx={12 + SHADOW_OFFSET_X} cy="21" rx="9" ry="3" fill="#000" opacity="0.2"/>

            {/* Base foliage mound - dense dark green */}
            <ellipse cx="12" cy="16" rx="10" ry="7" fill="#14532D"/>
            <ellipse cx="12" cy="14" rx="9" ry="6" fill="#166534"/>
            <ellipse cx="12" cy="12" rx="8" ry="5" fill="#15803D"/>

            {/* Thorny stems visible through foliage */}
            <line x1={rose1x} y1="8" x2={rose1x - 1} y2="16" stroke="#3D5A3D" strokeWidth="1.5"/>
            <line x1={rose2x} y1="7" x2={rose2x + 1} y2="15" stroke="#3D5A3D" strokeWidth="1.5"/>
            <line x1={rose3x} y1="5" x2={rose3x} y2="14" stroke="#3D5A3D" strokeWidth="1.8"/>

            {/* Rose leaves - compound pinnate */}
            <g fill="#16A34A">
                <ellipse cx="5" cy="14" rx="2" ry="3.5" transform="rotate(-30 5 14)"/>
                <ellipse cx="19" cy="14" rx="2" ry="3.5" transform="rotate(30 19 14)"/>
                <ellipse cx="8" cy="11" rx="1.5" ry="3" transform="rotate(-15 8 11)"/>
                <ellipse cx="16" cy="11" rx="1.5" ry="3" transform="rotate(15 16 11)"/>
                <ellipse cx="10" cy="9" rx="1.2" ry="2.5" transform="rotate(-10 10 9)"/>
                <ellipse cx="14" cy="9" rx="1.2" ry="2.5" transform="rotate(10 14 9)"/>
            </g>

            {/* Deeper foliage texture */}
            <g opacity="0.7">
                <circle cx="4" cy="17" r="2" fill="#14532D"/>
                <circle cx="8" cy="18" r="2.2" fill="#166534"/>
                <circle cx="12" cy="17" r="2" fill="#14532D"/>
                <circle cx="16" cy="18" r="2.2" fill="#166534"/>
                <circle cx="20" cy="17" r="2" fill="#14532D"/>
            </g>

            {/* Main center rose - largest, on top */}
            <g transform={`translate(${rose3x}, 5)`}>
                {/* Outer petals - layered spiral */}
                <circle cx="-2.5" cy="0" r="2.2" fill={rose.outer}/>
                <circle cx="2.5" cy="0" r="2.2" fill={rose.outer}/>
                <circle cx="0" cy="-2.5" r="2.2" fill={rose.outer}/>
                <circle cx="0" cy="2.5" r="2.2" fill={rose.outer}/>
                <circle cx="-1.8" cy="-1.8" r="2" fill={rose.inner}/>
                <circle cx="1.8" cy="-1.8" r="2" fill={rose.inner}/>
                <circle cx="1.8" cy="1.8" r="2" fill={rose.inner}/>
                <circle cx="-1.8" cy="1.8" r="2" fill={rose.inner}/>
                {/* Inner spiral */}
                <circle cx="-1" cy="0" r="1.5" fill={rose.inner}/>
                <circle cx="1" cy="0" r="1.5" fill={rose.inner}/>
                <circle cx="0" cy="-1" r="1.5" fill={rose.inner}/>
                <circle cx="0" cy="1" r="1.5" fill={rose.inner}/>
                {/* Center */}
                <circle cx="0" cy="0" r="1.2" fill={rose.center}/>
            </g>

            {/* Left rose - slightly smaller */}
            <g transform={`translate(${rose1x}, 8)`}>
                <circle cx="-2" cy="0" r="1.8" fill={rose.outer}/>
                <circle cx="2" cy="0" r="1.8" fill={rose.outer}/>
                <circle cx="0" cy="-2" r="1.8" fill={rose.outer}/>
                <circle cx="0" cy="2" r="1.8" fill={rose.outer}/>
                <circle cx="-1.4" cy="-1.4" r="1.6" fill={rose.inner}/>
                <circle cx="1.4" cy="-1.4" r="1.6" fill={rose.inner}/>
                <circle cx="1.4" cy="1.4" r="1.6" fill={rose.inner}/>
                <circle cx="-1.4" cy="1.4" r="1.6" fill={rose.inner}/>
                <circle cx="0" cy="0" r="1" fill={rose.center}/>
            </g>

            {/* Right rose - slightly smaller */}
            <g transform={`translate(${rose2x}, 7)`}>
                <circle cx="-2" cy="0" r="1.8" fill={rose.outer}/>
                <circle cx="2" cy="0" r="1.8" fill={rose.outer}/>
                <circle cx="0" cy="-2" r="1.8" fill={rose.outer}/>
                <circle cx="0" cy="2" r="1.8" fill={rose.outer}/>
                <circle cx="-1.4" cy="-1.4" r="1.6" fill={rose.inner}/>
                <circle cx="1.4" cy="-1.4" r="1.6" fill={rose.inner}/>
                <circle cx="1.4" cy="1.4" r="1.6" fill={rose.inner}/>
                <circle cx="-1.4" cy="1.4" r="1.6" fill={rose.inner}/>
                <circle cx="0" cy="0" r="1" fill={rose.center}/>
            </g>

            {/* Rose buds (unopened) */}
            <g fill={rose.outer}>
                <ellipse cx={4 + seed * 2} cy={11 + seed} rx="1" ry="1.5"/>
                <ellipse cx={20 - seed * 2} cy={10 + seed} rx="1" ry="1.5"/>
            </g>

            {/* Highlight on top rose */}
            <circle cx={rose3x + 0.5} cy="4" r="0.8" fill="#FFF" opacity="0.3"/>
        </g>
    );
};

// ===========================================
// FRENCH FORMAL GARDEN ELEMENTS
// Jardin à la française - geometric topiary and ornamental features
// ===========================================

// TOPIARY CONE - Classic French garden conical shape with sophisticated detail
export const generateTopiaryCone = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const seed = hash - Math.floor(hash);
    const variant = Math.floor(seed * 4);
    const gradId = `topiaryCone-${x}-${y}`;

    // Rich boxwood green variations with more nuanced palette
    const colors = [
        { deep: '#0D3B1C', dark: '#14532D', mid: '#1E6B3A', light: '#2D8A4E', highlight: '#4ADE80', accent: '#7EE8A8' },
        { deep: '#0F3D20', dark: '#1A4226', mid: '#1D5A32', light: '#2D8A4E', highlight: '#4CB070', accent: '#6FCF97' },
        { deep: '#0A3518', dark: '#0F4A20', mid: '#15803D', light: '#22C55E', highlight: '#86EFAC', accent: '#A7F3D0' },
        { deep: '#103822', dark: '#16532D', mid: '#1C6B38', light: '#2F9055', highlight: '#52D17E', accent: '#84E8A5' },
    ];
    const c = colors[variant];

    // Pot variations - terracotta, aged, or verdigris
    const potVariant = Math.floor(seed * 10) % 3;
    const potColors = [
        { base: '#8B4513', mid: '#A0522D', light: '#CD853F', rim: '#D2691E', shadow: '#5D2E0A' },
        { base: '#6B4423', mid: '#8B5A2B', light: '#BC8F5F', rim: '#C4A05A', shadow: '#4A2D12' },
        { base: '#4A5D4A', mid: '#5B6E5B', light: '#7A8D7A', rim: '#8FA08F', shadow: '#3A4A3A' },
    ];
    const p = potColors[potVariant];

    return (
        <g>
            {/* Gradient definitions for sophisticated shading */}
            <defs>
                <radialGradient id={`${gradId}-foliage`} cx="35%" cy="25%">
                    <stop offset="0%" stopColor={c.highlight} />
                    <stop offset="35%" stopColor={c.light} />
                    <stop offset="65%" stopColor={c.mid} />
                    <stop offset="100%" stopColor={c.dark} />
                </radialGradient>
                <linearGradient id={`${gradId}-pot`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={p.light} />
                    <stop offset="50%" stopColor={p.mid} />
                    <stop offset="100%" stopColor={p.shadow} />
                </linearGradient>
                <linearGradient id={`${gradId}-cone`} x1="30%" y1="0%" x2="70%" y2="100%">
                    <stop offset="0%" stopColor={c.accent} />
                    <stop offset="25%" stopColor={c.highlight} />
                    <stop offset="55%" stopColor={c.mid} />
                    <stop offset="100%" stopColor={c.deep} />
                </linearGradient>
            </defs>

            {/* Ground shadow - layered for realism */}
            <ellipse cx={12 + SHADOW_OFFSET_X} cy="22.5" rx="5.5" ry="1.8" fill="#000" opacity="0.12"/>
            <ellipse cx={12 + SHADOW_OFFSET_X * 0.6} cy="22" rx="4" ry="1.3" fill="#000" opacity="0.08"/>

            {/* Ornate terracotta pot - classical French style */}
            {/* Pot base/foot with molding */}
            <ellipse cx="12" cy="22" rx="3.5" ry="0.9" fill={p.shadow}/>
            <rect x="9.5" y="21" width="5" height="1" fill={p.base}/>
            <ellipse cx="12" cy="21" rx="2.8" ry="0.7" fill={p.mid}/>

            {/* Pot body with elegant taper */}
            <path d="M7.5 20.5 Q7 18.5 8 17 L16 17 Q17 18.5 16.5 20.5 Z" fill={`url(#${gradId}-pot)`}/>

            {/* Decorative rim with rolled edge */}
            <ellipse cx="12" cy="17" rx="4.8" ry="1.2" fill={p.base}/>
            <ellipse cx="12" cy="16.8" rx="4.5" ry="1" fill={p.light}/>
            <ellipse cx="12" cy="16.5" rx="4" ry="0.8" fill={p.mid}/>

            {/* Pot decorative band with rosettes */}
            <rect x="8" y="18.5" width="8" height="0.6" fill={p.rim} opacity="0.5"/>
            <g opacity="0.35">
                <circle cx="9.5" cy="18.8" r="0.35" fill={p.light}/>
                <circle cx="12" cy="18.8" r="0.35" fill={p.light}/>
                <circle cx="14.5" cy="18.8" r="0.35" fill={p.light}/>
            </g>

            {/* Visible soil at top of pot */}
            <ellipse cx="12" cy="16.3" rx="3.2" ry="0.6" fill="#3D2517"/>
            <ellipse cx="12" cy="16.1" rx="2.8" ry="0.4" fill="#4A3020"/>

            {/* Main cone silhouette - smooth geometric base */}
            <path d="M12 2 L17.5 15.5 Q17.5 16.2 12 16.2 Q6.5 16.2 6.5 15.5 Z" fill={`url(#${gradId}-cone)`}/>

            {/* Layered foliage texture creating 3D depth */}
            {/* Deep shadow base layer */}
            <ellipse cx="12" cy="15.2" rx="5.5" ry="1.8" fill={c.deep}/>
            <ellipse cx="12.3" cy="14" rx="5" ry="1.6" fill={c.dark}/>
            <ellipse cx="11.8" cy="12.5" rx="4.5" ry="1.4" fill={c.dark}/>

            {/* Middle foliage layer */}
            <ellipse cx="12" cy="11" rx="4" ry="1.3" fill={c.mid}/>
            <ellipse cx="11.7" cy="9.5" rx="3.4" ry="1.1" fill={c.mid}/>
            <ellipse cx="12.2" cy="8" rx="2.8" ry="0.95" fill={c.light}/>

            {/* Upper highlight layer */}
            <ellipse cx="12" cy="6.5" rx="2.2" ry="0.75" fill={c.light}/>
            <ellipse cx="11.9" cy="5.2" rx="1.6" ry="0.55" fill={c.highlight}/>
            <ellipse cx="12" cy="4" rx="1.1" ry="0.4" fill={c.highlight}/>

            {/* Pointed tip finial */}
            <ellipse cx="12" cy="3" rx="0.7" ry="0.3" fill={c.accent}/>
            <ellipse cx="12" cy="2.4" rx="0.4" ry="0.2" fill={c.accent}/>

            {/* Dense leaf cluster texture - randomized positions */}
            <g opacity="0.65">
                <circle cx="8.5" cy="13.5" r="0.7" fill={c.dark}/>
                <circle cx="15.5" cy="14" r="0.65" fill={c.deep}/>
                <circle cx="9.5" cy="11" r="0.6" fill={c.mid}/>
                <circle cx="14.5" cy="11.5" r="0.55" fill={c.dark}/>
                <circle cx="10" cy="8.5" r="0.5" fill={c.light}/>
                <circle cx="14" cy="9" r="0.5" fill={c.mid}/>
                <circle cx="11" cy="6" r="0.4" fill={c.highlight}/>
                <circle cx="13" cy="6.5" r="0.4" fill={c.light}/>
                <circle cx="11.5" cy="4.5" r="0.3" fill={c.accent}/>
            </g>

            {/* Right side shadow for 3D effect */}
            <g opacity="0.25">
                <ellipse cx="14.5" cy="12.5" rx="1.2" ry="2.5" fill={c.deep}/>
                <ellipse cx="14" cy="8.5" rx="0.9" ry="1.8" fill={c.dark}/>
                <ellipse cx="13.2" cy="5.5" rx="0.5" ry="1" fill={c.mid}/>
            </g>

            {/* Left side highlight - sunlight catching */}
            <g opacity="0.35">
                <ellipse cx="9.5" cy="12" rx="1" ry="2.2" fill={c.highlight}/>
                <ellipse cx="10" cy="8" rx="0.7" ry="1.6" fill={c.accent}/>
                <ellipse cx="10.5" cy="5" rx="0.4" ry="0.9" fill={c.accent}/>
            </g>

            {/* Fine contour highlights along edges */}
            <g opacity="0.2">
                <path d="M8 14 Q10 9 11 5 Q11.5 3 12 2" fill="none" stroke={c.accent} strokeWidth="0.4"/>
            </g>

            {/* Pot surface highlight */}
            <ellipse cx="10" cy="18.5" rx="0.8" ry="1.2" fill="#FFF" opacity="0.1"/>
        </g>
    );
};

// TOPIARY BALL - Perfect sphere on elegant stem with sophisticated rendering
export const generateTopiaryBall = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const seed = hash - Math.floor(hash);
    const variant = Math.floor(seed * 4);
    const gradId = `topiaryBall-${x}-${y}`;

    // Extended color palette for rich foliage rendering
    const colors = [
        { deep: '#0D3B1C', dark: '#14532D', mid: '#1E6B3A', light: '#2D8A4E', highlight: '#4ADE80', accent: '#7EE8A8', glow: '#B8F5C8' },
        { deep: '#0F3D20', dark: '#1A4226', mid: '#1D5A32', light: '#2D8A4E', highlight: '#4CB070', accent: '#6FCF97', glow: '#A8E8B8' },
        { deep: '#0A3518', dark: '#0F4A20', mid: '#15803D', light: '#22C55E', highlight: '#86EFAC', accent: '#A7F3D0', glow: '#C8FAD8' },
        { deep: '#103822', dark: '#16532D', mid: '#1C6B38', light: '#2F9055', highlight: '#52D17E', accent: '#84E8A5', glow: '#B0F0C0' },
    ];
    const c = colors[variant];

    // Pot style variations
    const potVariant = Math.floor(seed * 10) % 3;
    const potColors = [
        { base: '#8B4513', mid: '#A0522D', light: '#CD853F', rim: '#D2691E', shadow: '#5D2E0A' },
        { base: '#6B4423', mid: '#8B5A2B', light: '#BC8F5F', rim: '#C4A05A', shadow: '#4A2D12' },
        { base: '#505560', mid: '#686D78', light: '#888D98', rim: '#989DA8', shadow: '#3A3D45' },
    ];
    const p = potColors[potVariant];

    // Trunk colors
    const trunk = { dark: '#3D2817', mid: '#5D4037', light: '#6D4C41', highlight: '#8D6C51' };

    return (
        <g>
            {/* Gradient definitions */}
            <defs>
                <radialGradient id={`${gradId}-sphere`} cx="35%" cy="30%">
                    <stop offset="0%" stopColor={c.glow} />
                    <stop offset="20%" stopColor={c.highlight} />
                    <stop offset="45%" stopColor={c.light} />
                    <stop offset="70%" stopColor={c.mid} />
                    <stop offset="100%" stopColor={c.deep} />
                </radialGradient>
                <linearGradient id={`${gradId}-pot`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={p.light} />
                    <stop offset="50%" stopColor={p.mid} />
                    <stop offset="100%" stopColor={p.shadow} />
                </linearGradient>
                <linearGradient id={`${gradId}-trunk`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={trunk.dark} />
                    <stop offset="35%" stopColor={trunk.mid} />
                    <stop offset="65%" stopColor={trunk.light} />
                    <stop offset="100%" stopColor={trunk.dark} />
                </linearGradient>
            </defs>

            {/* Layered ground shadow */}
            <ellipse cx={12 + SHADOW_OFFSET_X} cy="22.5" rx="5" ry="1.6" fill="#000" opacity="0.12"/>
            <ellipse cx={12 + SHADOW_OFFSET_X * 0.5} cy="22" rx="3.5" ry="1.2" fill="#000" opacity="0.08"/>

            {/* Elegant terracotta pot */}
            {/* Pot foot */}
            <ellipse cx="12" cy="22" rx="3.2" ry="0.8" fill={p.shadow}/>
            <rect x="10" y="21.2" width="4" height="0.8" fill={p.base}/>
            <ellipse cx="12" cy="21.2" rx="2.5" ry="0.6" fill={p.mid}/>

            {/* Pot body */}
            <path d="M8.5 21 Q8 19.5 8.5 18.2 L15.5 18.2 Q16 19.5 15.5 21 Z" fill={`url(#${gradId}-pot)`}/>

            {/* Pot rim */}
            <ellipse cx="12" cy="18.2" rx="4" ry="1" fill={p.base}/>
            <ellipse cx="12" cy="18" rx="3.8" ry="0.85" fill={p.light}/>
            <ellipse cx="12" cy="17.8" rx="3.4" ry="0.7" fill={p.mid}/>

            {/* Decorative pot details */}
            <rect x="9" y="19.2" width="6" height="0.5" fill={p.rim} opacity="0.4"/>

            {/* Visible soil */}
            <ellipse cx="12" cy="17.6" rx="2.8" ry="0.5" fill="#3D2517"/>
            <ellipse cx="12" cy="17.4" rx="2.4" ry="0.35" fill="#4A3020"/>

            {/* Elegant trunk/stem with bark texture */}
            <rect x="10.8" y="11.5" width="2.4" height="6" fill={`url(#${gradId}-trunk)`}/>
            {/* Bark texture lines */}
            <g opacity="0.3">
                <line x1="11.2" y1="12" x2="11.2" y2="17" stroke={trunk.dark} strokeWidth="0.3"/>
                <line x1="12" y1="11.5" x2="12" y2="17.5" stroke={trunk.dark} strokeWidth="0.2"/>
                <line x1="12.8" y1="12" x2="12.8" y2="17" stroke={trunk.dark} strokeWidth="0.3"/>
            </g>
            {/* Trunk highlight */}
            <rect x="11.8" y="11.5" width="0.6" height="6" fill={trunk.highlight} opacity="0.25"/>

            {/* Main sphere with radial gradient */}
            <circle cx="12" cy="7" r="6.2" fill={c.deep}/>
            <circle cx="12" cy="6.8" r="6" fill={`url(#${gradId}-sphere)`}/>

            {/* Spherical shading layers for 3D effect */}
            {/* Light zone (upper left) */}
            <ellipse cx="9.5" cy="4.5" rx="3.5" ry="3" fill={c.light} opacity="0.6"/>
            <ellipse cx="9" cy="4" rx="2.2" ry="2" fill={c.highlight} opacity="0.5"/>
            <ellipse cx="8.8" cy="3.8" rx="1.2" ry="1.1" fill={c.accent} opacity="0.4"/>

            {/* Shadow zone (lower right) */}
            <ellipse cx="14.5" cy="9" rx="2.5" ry="2.2" fill={c.deep} opacity="0.4"/>

            {/* Dense leaf cluster texture around the sphere */}
            <g opacity="0.6">
                {/* Upper clusters */}
                <circle cx="9" cy="3" r="0.9" fill={c.highlight}/>
                <circle cx="12" cy="1.8" r="0.8" fill={c.accent}/>
                <circle cx="15" cy="3" r="0.85" fill={c.light}/>
                {/* Middle band */}
                <circle cx="6.5" cy="6" r="0.95" fill={c.mid}/>
                <circle cx="7.5" cy="8" r="0.9" fill={c.dark}/>
                <circle cx="17" cy="6.5" r="0.9" fill={c.dark}/>
                <circle cx="16.5" cy="8.5" r="0.85" fill={c.deep}/>
                {/* Lower clusters */}
                <circle cx="9" cy="10.5" r="0.85" fill={c.dark}/>
                <circle cx="12" cy="12" r="0.75" fill={c.deep}/>
                <circle cx="15" cy="10.5" r="0.8" fill={c.deep}/>
            </g>

            {/* Additional fine texture details */}
            <g opacity="0.5">
                <circle cx="10.5" cy="5" r="0.5" fill={c.highlight}/>
                <circle cx="13.5" cy="4" r="0.5" fill={c.light}/>
                <circle cx="8" cy="7" r="0.55" fill={c.mid}/>
                <circle cx="16" cy="7.5" r="0.5" fill={c.dark}/>
                <circle cx="10" cy="9" r="0.5" fill={c.mid}/>
                <circle cx="14" cy="8.5" r="0.5" fill={c.dark}/>
            </g>

            {/* Specular highlight - light catching on wet leaves */}
            <circle cx="9" cy="4" r="1.3" fill="#FFF" opacity="0.12"/>
            <circle cx="9.5" cy="4.5" r="0.6" fill="#FFF" opacity="0.18"/>

            {/* Rim light on sphere edge */}
            <g opacity="0.15">
                <path d="M6.5 8 Q6 6 7 4 Q8 2 10 1.5" fill="none" stroke={c.accent} strokeWidth="0.6"/>
            </g>

            {/* Pot highlight */}
            <ellipse cx="10" cy="19.5" rx="0.7" ry="1" fill="#FFF" opacity="0.08"/>
        </g>
    );
};

// TOPIARY SPIRAL - Elaborate baroque corkscrew shape with sophisticated rendering
export const generateTopiarySpiral = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const seed = hash - Math.floor(hash);
    const variant = Math.floor(seed * 4);
    const gradId = `topiarySpiral-${x}-${y}`;

    // Extended color palette
    const colors = [
        { deep: '#0D3B1C', dark: '#14532D', mid: '#1E6B3A', light: '#2D8A4E', highlight: '#4ADE80', accent: '#7EE8A8', glow: '#B8F5C8' },
        { deep: '#0F3D20', dark: '#1A4226', mid: '#1D5A32', light: '#2D8A4E', highlight: '#4CB070', accent: '#6FCF97', glow: '#A8E8B8' },
        { deep: '#0A3518', dark: '#0F4A20', mid: '#15803D', light: '#22C55E', highlight: '#86EFAC', accent: '#A7F3D0', glow: '#C8FAD8' },
        { deep: '#103822', dark: '#16532D', mid: '#1C6B38', light: '#2F9055', highlight: '#52D17E', accent: '#84E8A5', glow: '#B0F0C0' },
    ];
    const c = colors[variant];

    // Stone planter colors (more ornate for spiral)
    const stone = {
        deep: '#4B5563', dark: '#6B7280', mid: '#9CA3AF', light: '#D1D5DB',
        highlight: '#E5E7EB', accent: '#F3F4F6'
    };

    // Trunk colors
    const trunk = { dark: '#3D2817', mid: '#5D4037', light: '#6D4C41' };

    return (
        <g>
            {/* Gradient definitions */}
            <defs>
                <linearGradient id={`${gradId}-stone`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={stone.light} />
                    <stop offset="40%" stopColor={stone.mid} />
                    <stop offset="100%" stopColor={stone.deep} />
                </linearGradient>
                <linearGradient id={`${gradId}-trunk`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={trunk.dark} />
                    <stop offset="40%" stopColor={trunk.mid} />
                    <stop offset="70%" stopColor={trunk.light} />
                    <stop offset="100%" stopColor={trunk.dark} />
                </linearGradient>
                <radialGradient id={`${gradId}-finial`} cx="35%" cy="30%">
                    <stop offset="0%" stopColor={c.glow} />
                    <stop offset="40%" stopColor={c.highlight} />
                    <stop offset="100%" stopColor={c.mid} />
                </radialGradient>
            </defs>

            {/* Layered ground shadow */}
            <ellipse cx={12 + SHADOW_OFFSET_X} cy="22.5" rx="5.5" ry="1.7" fill="#000" opacity="0.12"/>
            <ellipse cx={12 + SHADOW_OFFSET_X * 0.5} cy="22" rx="4" ry="1.2" fill="#000" opacity="0.08"/>

            {/* Ornate stone planter - Renaissance style */}
            {/* Planter base/foot with molding */}
            <ellipse cx="12" cy="22.2" rx="4.5" ry="1" fill={stone.deep}/>
            <rect x="8.5" y="21.2" width="7" height="1" fill={stone.dark}/>
            <ellipse cx="12" cy="21.2" rx="3.5" ry="0.8" fill={stone.mid}/>

            {/* Planter body with classical profile */}
            <path d="M7.2 21 Q6.8 19 7.5 17.2 L16.5 17.2 Q17.2 19 16.8 21 Z" fill={`url(#${gradId}-stone)`}/>

            {/* Decorative rim with egg-and-dart motif suggestion */}
            <ellipse cx="12" cy="17.2" rx="5.2" ry="1.3" fill={stone.dark}/>
            <ellipse cx="12" cy="17" rx="5" ry="1.1" fill={stone.light}/>
            <ellipse cx="12" cy="16.8" rx="4.6" ry="0.9" fill={stone.mid}/>

            {/* Planter decorative band with medallions */}
            <rect x="7.5" y="18.8" width="9" height="0.7" fill={stone.dark} opacity="0.5"/>
            <g opacity="0.45">
                <circle cx="8.5" cy="19.1" r="0.5" fill={stone.light}/>
                <circle cx="10.5" cy="19.1" r="0.5" fill={stone.light}/>
                <circle cx="12" cy="19.1" r="0.55" fill={stone.highlight}/>
                <circle cx="13.5" cy="19.1" r="0.5" fill={stone.light}/>
                <circle cx="15.5" cy="19.1" r="0.5" fill={stone.light}/>
            </g>

            {/* Visible soil */}
            <ellipse cx="12" cy="16.5" rx="3.8" ry="0.65" fill="#3D2517"/>
            <ellipse cx="12" cy="16.3" rx="3.3" ry="0.45" fill="#4A3020"/>

            {/* Central trunk visible through spiral gaps */}
            <rect x="10.8" y="3.5" width="2.4" height="13" fill={`url(#${gradId}-trunk)`}/>
            {/* Bark texture */}
            <g opacity="0.25">
                <line x1="11.3" y1="4" x2="11.3" y2="16" stroke={trunk.dark} strokeWidth="0.25"/>
                <line x1="12" y1="3.5" x2="12" y2="16.5" stroke={trunk.dark} strokeWidth="0.2"/>
                <line x1="12.7" y1="4" x2="12.7" y2="16" stroke={trunk.dark} strokeWidth="0.25"/>
            </g>

            {/* Spiral foliage bands - baroque corkscrew from bottom to top */}
            {/* Band 1 (bottom) - largest, deepest shadow */}
            <ellipse cx="12" cy="15.5" rx="5" ry="2.2" fill={c.deep}/>
            <ellipse cx="10.5" cy="15" rx="4.5" ry="2" fill={c.dark}/>
            <ellipse cx="10" cy="14.5" rx="4" ry="1.7" fill={c.mid}/>
            {/* Band 1 texture */}
            <g opacity="0.5">
                <circle cx="7" cy="14.5" r="0.7" fill={c.dark}/>
                <circle cx="14" cy="15" r="0.65" fill={c.deep}/>
                <circle cx="9" cy="13.8" r="0.55" fill={c.mid}/>
            </g>

            {/* Band 2 - offset right */}
            <ellipse cx="12" cy="12.5" rx="4.5" ry="2" fill={c.deep}/>
            <ellipse cx="13.5" cy="12" rx="4" ry="1.8" fill={c.dark}/>
            <ellipse cx="14" cy="11.5" rx="3.5" ry="1.5" fill={c.mid}/>
            {/* Band 2 texture */}
            <g opacity="0.5">
                <circle cx="16" cy="11.5" r="0.6" fill={c.dark}/>
                <circle cx="11" cy="12" r="0.55" fill={c.mid}/>
                <circle cx="14.5" cy="10.8" r="0.5" fill={c.light}/>
            </g>

            {/* Band 3 - offset left */}
            <ellipse cx="12" cy="9.5" rx="4" ry="1.8" fill={c.dark}/>
            <ellipse cx="10.5" cy="9" rx="3.5" ry="1.6" fill={c.mid}/>
            <ellipse cx="10" cy="8.5" rx="3" ry="1.3" fill={c.light}/>
            {/* Band 3 texture */}
            <g opacity="0.5">
                <circle cx="7.5" cy="8.5" r="0.55" fill={c.mid}/>
                <circle cx="12.5" cy="9" r="0.5" fill={c.mid}/>
                <circle cx="9" cy="8" r="0.45" fill={c.light}/>
            </g>

            {/* Band 4 - offset right */}
            <ellipse cx="12" cy="6.8" rx="3.5" ry="1.5" fill={c.mid}/>
            <ellipse cx="13.5" cy="6.3" rx="3" ry="1.3" fill={c.light}/>
            <ellipse cx="14" cy="5.8" rx="2.5" ry="1.1" fill={c.light}/>
            {/* Band 4 texture */}
            <g opacity="0.5">
                <circle cx="15.5" cy="5.8" r="0.5" fill={c.light}/>
                <circle cx="12" cy="6.3" r="0.45" fill={c.highlight}/>
            </g>

            {/* Band 5 (top) - smallest, brightest */}
            <ellipse cx="12" cy="4.2" rx="2.8" ry="1.2" fill={c.light}/>
            <ellipse cx="11" cy="3.7" rx="2.3" ry="1" fill={c.highlight}/>
            <ellipse cx="10.5" cy="3.3" rx="1.8" ry="0.8" fill={c.highlight}/>
            {/* Band 5 texture */}
            <g opacity="0.5">
                <circle cx="9" cy="3.3" r="0.4" fill={c.accent}/>
                <circle cx="12" cy="3.8" r="0.35" fill={c.highlight}/>
            </g>

            {/* Top finial ball - ornate sphere */}
            <circle cx="12" cy="1.8" r="1.8" fill={c.mid}/>
            <circle cx="12" cy="1.6" r="1.6" fill={`url(#${gradId}-finial)`}/>
            <ellipse cx="11" cy="1.2" rx="0.7" ry="0.6" fill={c.accent} opacity="0.6"/>
            <circle cx="10.8" cy="1" r="0.35" fill="#FFF" opacity="0.2"/>

            {/* Spiral gap shadows - where trunk shows through */}
            <g opacity="0.35">
                <path d="M10.5 13.2 Q12 13.5 13.5 13" stroke={c.deep} strokeWidth="0.6" fill="none"/>
                <path d="M13.5 10.2 Q12 10.5 10.5 10" stroke={c.deep} strokeWidth="0.5" fill="none"/>
                <path d="M10.5 7.2 Q12 7.5 13.5 7" stroke={c.dark} strokeWidth="0.5" fill="none"/>
                <path d="M13 4.8 Q12 5 11 4.7" stroke={c.mid} strokeWidth="0.4" fill="none"/>
            </g>

            {/* Left side highlights - light catching the spiral */}
            <g opacity="0.35">
                <ellipse cx="8.5" cy="14" rx="0.8" ry="1.5" fill={c.highlight}/>
                <ellipse cx="8" cy="8.5" rx="0.6" ry="1.2" fill={c.accent}/>
                <ellipse cx="9.5" cy="3.5" rx="0.5" ry="0.8" fill={c.accent}/>
            </g>

            {/* Right side deep shadows */}
            <g opacity="0.25">
                <ellipse cx="15.5" cy="11.5" rx="0.7" ry="1.3" fill={c.deep}/>
                <ellipse cx="15" cy="6" rx="0.6" ry="1" fill={c.dark}/>
            </g>

            {/* Fine edge contours */}
            <g opacity="0.15">
                <path d="M7 15 Q8 12 8.5 9 Q9 6 10 4" fill="none" stroke={c.accent} strokeWidth="0.4"/>
            </g>

            {/* Stone planter highlight */}
            <ellipse cx="9.5" cy="19" rx="0.8" ry="1.2" fill="#FFF" opacity="0.08"/>
        </g>
    );
};

// PARTERRE - Sophisticated geometric French garden embroidery pattern
export const generateParterre = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const seed = hash - Math.floor(hash);
    const pattern = Math.floor(seed * 2); // Only 2 patterns for better consistency
    const gradId = `parterre-${x}-${y}`;

    // Consistent pink/magenta flower palette (classic French garden roses)
    const f = {
        primary: '#C2185B',    // Deep rose
        secondary: '#E91E63',  // Bright pink
        tertiary: '#F48FB1',   // Light pink
        center: '#FFD54F',     // Golden yellow
        accent: '#FCE4EC',     // Pale pink
        shadow: '#880E4F'      // Dark rose shadow
    };

    // Extended boxwood palette
    const boxwood = {
        deep: '#0D3B1C', dark: '#14532D', mid: '#1E6B3A',
        light: '#22863A', highlight: '#2DA44E', accent: '#3FB950'
    };

    // Gravel colors for French garden paths
    const gravel = {
        base: '#C9BAA0', mid: '#D8CCBA', light: '#E8DED0',
        shadow: '#B0A090', accent: '#F0E8DD'
    };

    // Soil color
    const soil = { dark: '#2C1810', mid: '#3D2517', light: '#4A3020' };

    // Helper to render a realistic rose-like flower with layered petals
    const renderFlower = (cx: number, cy: number, size: number) => (
        <g key={`flower-${cx}-${cy}`}>
            {/* Outer shadow */}
            <ellipse cx={cx + 0.3} cy={cy + 0.4} rx={size * 1.1} ry={size * 0.9} fill={f.shadow} opacity="0.3"/>
            {/* Outer petals - 5 large petals */}
            <ellipse cx={cx} cy={cy - size * 0.7} rx={size * 0.55} ry={size * 0.7} fill={f.primary}/>
            <ellipse cx={cx + size * 0.65} cy={cy - size * 0.2} rx={size * 0.55} ry={size * 0.7} fill={f.secondary} transform={`rotate(72 ${cx + size * 0.65} ${cy - size * 0.2})`}/>
            <ellipse cx={cx + size * 0.4} cy={cy + size * 0.55} rx={size * 0.55} ry={size * 0.7} fill={f.primary} transform={`rotate(144 ${cx + size * 0.4} ${cy + size * 0.55})`}/>
            <ellipse cx={cx - size * 0.4} cy={cy + size * 0.55} rx={size * 0.55} ry={size * 0.7} fill={f.secondary} transform={`rotate(-144 ${cx - size * 0.4} ${cy + size * 0.55})`}/>
            <ellipse cx={cx - size * 0.65} cy={cy - size * 0.2} rx={size * 0.55} ry={size * 0.7} fill={f.primary} transform={`rotate(-72 ${cx - size * 0.65} ${cy - size * 0.2})`}/>
            {/* Inner petals - smaller, lighter */}
            <ellipse cx={cx} cy={cy - size * 0.4} rx={size * 0.35} ry={size * 0.45} fill={f.tertiary}/>
            <ellipse cx={cx + size * 0.38} cy={cy + size * 0.12} rx={size * 0.35} ry={size * 0.45} fill={f.tertiary} transform={`rotate(72 ${cx + size * 0.38} ${cy + size * 0.12})`}/>
            <ellipse cx={cx - size * 0.38} cy={cy + size * 0.12} rx={size * 0.35} ry={size * 0.45} fill={f.tertiary} transform={`rotate(-72 ${cx - size * 0.38} ${cy + size * 0.12})`}/>
            {/* Center */}
            <circle cx={cx} cy={cy} r={size * 0.35} fill={f.center}/>
            <circle cx={cx} cy={cy} r={size * 0.2} fill="#FFC107"/>
            {/* Highlight */}
            <ellipse cx={cx - size * 0.12} cy={cy - size * 0.12} rx={size * 0.12} ry={size * 0.08} fill="#FFF" opacity="0.5"/>
        </g>
    );

    // Helper for boxwood border with 3D effect
    const renderBoxwoodBorder = (d: string, width: number) => (
        <g>
            <path d={d} fill="none" stroke={boxwood.deep} strokeWidth={width + 0.8}/>
            <path d={d} fill="none" stroke={boxwood.dark} strokeWidth={width}/>
            <path d={d} fill="none" stroke={boxwood.mid} strokeWidth={width * 0.7}/>
            <path d={d} fill="none" stroke={boxwood.light} strokeWidth={width * 0.4}/>
        </g>
    );

    return (
        <g>
            {/* Gradient definitions */}
            <defs>
                <radialGradient id={`${gradId}-gravel`} cx="50%" cy="50%">
                    <stop offset="0%" stopColor={gravel.light}/>
                    <stop offset="70%" stopColor={gravel.mid}/>
                    <stop offset="100%" stopColor={gravel.base}/>
                </radialGradient>
                <linearGradient id={`${gradId}-soil`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={soil.light}/>
                    <stop offset="50%" stopColor={soil.mid}/>
                    <stop offset="100%" stopColor={soil.dark}/>
                </linearGradient>
            </defs>

            {/* Base crushed Fontainebleau limestone */}
            <rect width="24" height="24" fill={`url(#${gradId}-gravel)`}/>

            {/* Fine gravel texture */}
            <g opacity="0.35">
                {[...Array(8)].map((_, i) => {
                    const gx = ((i * 7 + seed * 20) % 22) + 1;
                    const gy = ((i * 11 + seed * 15) % 22) + 1;
                    const gr = 0.3 + (i % 3) * 0.15;
                    return <circle key={i} cx={gx} cy={gy} r={gr} fill={i % 2 === 0 ? gravel.shadow : gravel.accent}/>;
                })}
            </g>

            {pattern === 0 && (
                // Pattern 0: Classic diamond parterre with central flower bed
                <g>
                    {/* Outer diamond frame */}
                    {renderBoxwoodBorder("M12,2 L22,12 L12,22 L2,12 Z", 2.2)}

                    {/* Inner diamond soil bed */}
                    <polygon points="12,5 19,12 12,19 5,12" fill={`url(#${gradId}-soil)`}/>

                    {/* Central large flower */}
                    {renderFlower(12, 12, 2.8)}

                    {/* Corner boxwood balls */}
                    <g>
                        {[[4, 4], [20, 4], [4, 20], [20, 20]].map(([cx, cy], i) => (
                            <g key={i}>
                                <circle cx={cx} cy={cy} r="2.2" fill={boxwood.deep}/>
                                <circle cx={cx} cy={cy} r="2" fill={boxwood.dark}/>
                                <circle cx={cx - 0.5} cy={cy - 0.5} r="1.2" fill={boxwood.light} opacity="0.6"/>
                            </g>
                        ))}
                    </g>
                </g>
            )}

            {pattern === 1 && (
                // Pattern 1: Classic French cross parterre with corner flowers
                <g>
                    {/* Cross-shaped boxwood hedge with depth */}
                    <rect x="10" y="1" width="4" height="22" fill={boxwood.deep}/>
                    <rect x="1" y="10" width="22" height="4" fill={boxwood.deep}/>
                    <rect x="10.3" y="1.3" width="3.4" height="21.4" fill={boxwood.dark}/>
                    <rect x="1.3" y="10.3" width="21.4" height="3.4" fill={boxwood.dark}/>
                    <rect x="10.8" y="1.8" width="2.4" height="20.4" fill={boxwood.mid}/>
                    <rect x="1.8" y="10.8" width="20.4" height="2.4" fill={boxwood.mid}/>
                    {/* Highlight strips */}
                    <rect x="11.2" y="2.2" width="1.2" height="19.6" fill={boxwood.light} opacity="0.4"/>
                    <rect x="2.2" y="11.2" width="19.6" height="1.2" fill={boxwood.light} opacity="0.4"/>

                    {/* Corner flower beds with soil */}
                    {[[2.5, 2.5], [15.5, 2.5], [2.5, 15.5], [15.5, 15.5]].map(([bx, by], i) => (
                        <g key={i}>
                            <rect x={bx} y={by} width="6" height="6" rx="0.5" fill={`url(#${gradId}-soil)`}/>
                        </g>
                    ))}

                    {/* Flowers in corner beds - larger */}
                    {renderFlower(5.5, 5.5, 2.2)}
                    {renderFlower(18.5, 5.5, 2.2)}
                    {renderFlower(5.5, 18.5, 2.2)}
                    {renderFlower(18.5, 18.5, 2.2)}
                </g>
            )}

            {/* Subtle stone border edging */}
            <rect x="0" y="0" width="24" height="24" fill="none" stroke={gravel.shadow} strokeWidth="0.5" opacity="0.5"/>
        </g>
    );
};

// GARDEN URN - Ornate classical stone planter with sophisticated rendering
export const generateGardenUrn = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const seed = hash - Math.floor(hash);
    const gradId = `gardenUrn-${x}-${y}`;
    const hasFlowers = seed > 0.25;
    const flowerVariant = Math.floor(seed * 4);

    // Flower color palettes
    const flowerPalettes = [
        { primary: '#DB2777', secondary: '#EC4899', tertiary: '#F472B6', center: '#FCD34D' },
        { primary: '#B91C1C', secondary: '#DC2626', tertiary: '#EF4444', center: '#FDE047' },
        { primary: '#7C3AED', secondary: '#8B5CF6', tertiary: '#A78BFA', center: '#FBBF24' },
        { primary: '#C2410C', secondary: '#EA580C', tertiary: '#FB923C', center: '#FEF3C7' },
    ];
    const f = flowerPalettes[flowerVariant];

    // Stone material - aged patina variations
    const stoneVariant = Math.floor(seed * 10) % 3;
    const stonePalettes = [
        { deep: '#4B5563', dark: '#6B7280', mid: '#9CA3AF', light: '#D1D5DB', highlight: '#E5E7EB', accent: '#F3F4F6' },
        { deep: '#57534E', dark: '#78716C', mid: '#A8A29E', light: '#D6D3D1', highlight: '#E7E5E4', accent: '#F5F5F4' },
        { deep: '#525D52', dark: '#6B7B6B', mid: '#8FA08F', light: '#B8C8B8', highlight: '#D0DDD0', accent: '#E8F0E8' },
    ];
    const s = stonePalettes[stoneVariant];

    // Foliage colors
    const foliage = {
        deep: '#0A3518', dark: '#14532D', mid: '#166534', light: '#22C55E', highlight: '#4ADE80'
    };

    return (
        <g>
            {/* Gradient definitions */}
            <defs>
                <linearGradient id={`${gradId}-stone`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={s.light}/>
                    <stop offset="40%" stopColor={s.mid}/>
                    <stop offset="100%" stopColor={s.deep}/>
                </linearGradient>
                <radialGradient id={`${gradId}-body`} cx="35%" cy="30%">
                    <stop offset="0%" stopColor={s.highlight}/>
                    <stop offset="50%" stopColor={s.mid}/>
                    <stop offset="100%" stopColor={s.dark}/>
                </radialGradient>
                <linearGradient id={`${gradId}-foliage`} x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor={foliage.highlight}/>
                    <stop offset="40%" stopColor={foliage.light}/>
                    <stop offset="100%" stopColor={foliage.dark}/>
                </linearGradient>
            </defs>

            {/* Layered ground shadow */}
            <ellipse cx={12 + SHADOW_OFFSET_X} cy="22.5" rx="6" ry="1.8" fill="#000" opacity="0.12"/>
            <ellipse cx={12 + SHADOW_OFFSET_X * 0.5} cy="22" rx="4.5" ry="1.3" fill="#000" opacity="0.08"/>

            {/* Ornate stone pedestal base - classical molding */}
            <ellipse cx="12" cy="22.5" rx="5" ry="1.2" fill={s.deep}/>
            <rect x="8" y="21" width="8" height="1.5" fill={s.dark}/>
            <ellipse cx="12" cy="21" rx="4" ry="1" fill={s.mid}/>
            {/* Pedestal neck with scotia molding */}
            <rect x="9.5" y="19.5" width="5" height="1.5" fill={s.mid}/>
            <ellipse cx="12" cy="19.5" rx="3" ry="0.7" fill={s.light}/>

            {/* Urn body - classical amphora shape */}
            {/* Lower bowl with elegant curve */}
            <ellipse cx="12" cy="18.5" rx="5.5" ry="2" fill={s.deep}/>
            <path d="M6.5 18 Q6.5 15 8.5 12.5 L15.5 12.5 Q17.5 15 17.5 18" fill={`url(#${gradId}-body)`}/>

            {/* Decorative gadrooning (vertical ribs) */}
            <g opacity="0.35">
                <path d="M8 17.5 Q8 15 9 13" stroke={s.dark} strokeWidth="0.6" fill="none"/>
                <path d="M10 18 Q10 15 10.5 12.5" stroke={s.dark} strokeWidth="0.6" fill="none"/>
                <path d="M14 18 Q14 15 13.5 12.5" stroke={s.dark} strokeWidth="0.6" fill="none"/>
                <path d="M16 17.5 Q16 15 15 13" stroke={s.dark} strokeWidth="0.6" fill="none"/>
            </g>

            {/* Decorative band with egg-and-dart motif */}
            <rect x="7.5" y="14.5" width="9" height="0.8" fill={s.highlight}/>
            <g opacity="0.5">
                <ellipse cx="9" cy="14.9" rx="0.5" ry="0.3" fill={s.accent}/>
                <ellipse cx="12" cy="14.9" rx="0.5" ry="0.3" fill={s.accent}/>
                <ellipse cx="15" cy="14.9" rx="0.5" ry="0.3" fill={s.accent}/>
            </g>

            {/* Fluting below band */}
            <g opacity="0.4">
                <rect x="8" y="15.5" width="1.2" height="2.5" rx="0.3" fill={s.dark}/>
                <rect x="10.4" y="15.5" width="1.2" height="2.5" rx="0.3" fill={s.dark}/>
                <rect x="12.4" y="15.5" width="1.2" height="2.5" rx="0.3" fill={s.dark}/>
                <rect x="14.8" y="15.5" width="1.2" height="2.5" rx="0.3" fill={s.dark}/>
            </g>

            {/* Neck with torus molding */}
            <rect x="9.5" y="10.5" width="5" height="2.5" fill={`url(#${gradId}-stone)`}/>
            <ellipse cx="12" cy="12.5" rx="3.5" ry="0.8" fill={s.mid}/>
            <ellipse cx="12" cy="12.3" rx="3.2" ry="0.6" fill={s.light}/>

            {/* Upper rim/lip - ornate rolled edge */}
            <ellipse cx="12" cy="10.5" rx="5.2" ry="1.8" fill={s.dark}/>
            <ellipse cx="12" cy="10.3" rx="5" ry="1.6" fill={s.mid}/>
            <ellipse cx="12" cy="10" rx="4.6" ry="1.4" fill={s.light}/>
            <ellipse cx="12" cy="9.8" rx="4.2" ry="1.2" fill={s.highlight}/>

            {/* Decorative handles - volute style */}
            <g>
                {/* Left handle */}
                <path d="M6.5 12 Q4.5 12 4.5 14 Q4.5 16 6.5 16" fill="none" stroke={s.dark} strokeWidth="1.8"/>
                <path d="M6.5 12.2 Q5 12.2 5 14 Q5 15.8 6.5 15.8" fill="none" stroke={s.mid} strokeWidth="1"/>
                <circle cx="4.8" cy="12.2" r="0.8" fill={s.mid}/>
                <circle cx="4.8" cy="15.8" r="0.8" fill={s.mid}/>
                {/* Right handle */}
                <path d="M17.5 12 Q19.5 12 19.5 14 Q19.5 16 17.5 16" fill="none" stroke={s.dark} strokeWidth="1.8"/>
                <path d="M17.5 12.2 Q19 12.2 19 14 Q19 15.8 17.5 15.8" fill="none" stroke={s.mid} strokeWidth="1"/>
                <circle cx="19.2" cy="12.2" r="0.8" fill={s.mid}/>
                <circle cx="19.2" cy="15.8" r="0.8" fill={s.mid}/>
            </g>

            {/* Interior soil visible */}
            <ellipse cx="12" cy="9.5" rx="3.5" ry="1" fill="#3D2517"/>
            <ellipse cx="12" cy="9.3" rx="3" ry="0.7" fill="#4A3020"/>

            {hasFlowers && (
                // Elaborate trailing flowers and cascading foliage
                <g>
                    {/* Dense foliage base mound */}
                    <ellipse cx="12" cy="7.5" rx="4.5" ry="2.8" fill={foliage.dark}/>
                    <ellipse cx="12" cy="7" rx="4" ry="2.5" fill={`url(#${gradId}-foliage)`}/>

                    {/* Individual leaf clusters */}
                    <ellipse cx="9" cy="6.5" rx="2" ry="1.8" fill={foliage.mid}/>
                    <ellipse cx="15" cy="6.5" rx="2" ry="1.8" fill={foliage.mid}/>
                    <ellipse cx="12" cy="5.5" rx="2.2" ry="1.5" fill={foliage.light}/>

                    {/* Trailing/cascading leaves */}
                    <ellipse cx="6.5" cy="9.5" rx="1.8" ry="2.8" fill={foliage.mid} transform="rotate(-25 6.5 9.5)"/>
                    <ellipse cx="6.8" cy="9.2" rx="1.3" ry="2.2" fill={foliage.light} transform="rotate(-25 6.8 9.2)"/>
                    <ellipse cx="17.5" cy="9.5" rx="1.8" ry="2.8" fill={foliage.mid} transform="rotate(25 17.5 9.5)"/>
                    <ellipse cx="17.2" cy="9.2" rx="1.3" ry="2.2" fill={foliage.light} transform="rotate(25 17.2 9.2)"/>

                    {/* Small accent leaves */}
                    <ellipse cx="8" cy="7" rx="1" ry="1.5" fill={foliage.highlight} opacity="0.7"/>
                    <ellipse cx="16" cy="7" rx="1" ry="1.5" fill={foliage.highlight} opacity="0.7"/>

                    {/* Main flower cluster - 5-petal flowers */}
                    {/* Central large flower */}
                    <g>
                        <circle cx="12" cy="3.5" r="1.3" fill={f.primary}/>
                        <circle cx="11" cy="4.2" r="1.1" fill={f.secondary}/>
                        <circle cx="13" cy="4.2" r="1.1" fill={f.secondary}/>
                        <circle cx="11.5" cy="2.8" r="1" fill={f.tertiary}/>
                        <circle cx="12.5" cy="2.8" r="1" fill={f.tertiary}/>
                        <circle cx="12" cy="3.8" r="0.6" fill={f.center}/>
                        <circle cx="11.8" cy="3.6" r="0.2" fill="#FFF" opacity="0.5"/>
                    </g>

                    {/* Left flower */}
                    <g>
                        <circle cx="9" cy="4.5" r="1.1" fill={f.primary}/>
                        <circle cx="8.3" cy="5" r="0.9" fill={f.secondary}/>
                        <circle cx="9.7" cy="5" r="0.9" fill={f.secondary}/>
                        <circle cx="9" cy="4.8" r="0.5" fill={f.center}/>
                    </g>

                    {/* Right flower */}
                    <g>
                        <circle cx="15" cy="4.8" r="1.1" fill={f.primary}/>
                        <circle cx="14.3" cy="5.3" r="0.9" fill={f.secondary}/>
                        <circle cx="15.7" cy="5.3" r="0.9" fill={f.secondary}/>
                        <circle cx="15" cy="5.1" r="0.5" fill={f.center}/>
                    </g>

                    {/* Smaller accent flowers */}
                    <circle cx="7.5" cy="6.5" r="0.9" fill={f.tertiary}/>
                    <circle cx="7.5" cy="6.5" r="0.35" fill={f.center}/>
                    <circle cx="16.5" cy="6" r="0.9" fill={f.tertiary}/>
                    <circle cx="16.5" cy="6" r="0.35" fill={f.center}/>

                    {/* Buds */}
                    <ellipse cx="10.5" cy="2.5" rx="0.5" ry="0.7" fill={f.primary}/>
                    <ellipse cx="13.5" cy="2.2" rx="0.5" ry="0.7" fill={f.primary}/>
                </g>
            )}

            {/* Stone surface highlights and weathering */}
            <g opacity="0.12">
                <ellipse cx="9.5" cy="14" rx="1" ry="3" fill="#FFF"/>
                <ellipse cx="10" cy="11" rx="0.8" ry="1.5" fill="#FFF"/>
            </g>

            {/* Subtle weathering/patina marks */}
            <g opacity="0.08">
                <circle cx="14" cy="16" r="0.8" fill={s.deep}/>
                <circle cx="10" cy="17.5" r="0.6" fill={s.deep}/>
            </g>
        </g>
    );
};

// ===========================================
// LAMP - Improved single ornate gas lamp with soft diffuse glow
// ===========================================

export const generateLamp = (x: number, y: number): JSX.Element => {
    // Unique gradient IDs based on position to avoid conflicts
    const gradId = `lampGlow-${x}-${y}`;
    const innerGradId = `lampInner-${x}-${y}`;

    return (
        <g>
            {/* SVG Gradient Definitions for soft warm light falloff */}
            <defs>
                {/* Large ambient glow - very soft edges, warm and bright */}
                <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFF8E1" stopOpacity="0.65">
                        <animate attributeName="stop-opacity" values="0.65;0.75;0.6;0.7;0.65" dur="1.4s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="12%" stopColor="#FFECB3" stopOpacity="0.45" />
                    <stop offset="28%" stopColor="#FFE082" stopOpacity="0.28" />
                    <stop offset="48%" stopColor="#FFCC80" stopOpacity="0.14" />
                    <stop offset="70%" stopColor="#FFB74D" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#FF9800" stopOpacity="0" />
                </radialGradient>
                {/* Inner bright glow */}
                <radialGradient id={innerGradId} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFDE7" stopOpacity="1" />
                    <stop offset="25%" stopColor="#FFF9C4" stopOpacity="0.75" />
                    <stop offset="55%" stopColor="#FFF176" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FFEE58" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* LARGE DIFFUSE GLOW - soft radial gradient, warm and bright */}
            {/* Shifted upward (cy=-18) so glow doesn't get clipped at tile bottom */}
            <ellipse cx="12" cy="-18" rx="64" ry="48" fill={`url(#${gradId})`} />

            {/* Secondary glow layer for more intensity near center */}
            <ellipse cx="12" cy="-14" rx="40" ry="30" fill={`url(#${gradId})`} />

            {/* Tertiary glow for extra warmth */}
            <ellipse cx="12" cy="-9" rx="22" ry="16" fill={`url(#${gradId})`} />

            {/* Shadow */}
            <ellipse cx={12 + SHADOW_OFFSET_X} cy="22" rx="6" ry="1.8" fill="#000" opacity="0.22"/>

            {/* Ornate cast iron base - fluted pedestal */}
            <rect x="5" y="19" width="14" height="5" fill="#1A202C"/>
            <ellipse cx="12" cy="19" rx="7" ry="1.5" fill="#263238"/>
            <ellipse cx="12" cy="20" rx="6" ry="1.2" fill="#37474F"/>
            <rect x="7" y="16" width="10" height="4" fill="#263238"/>
            <ellipse cx="12" cy="16" rx="5" ry="1" fill="#37474F"/>

            {/* Main post - fluted column style */}
            <rect x="9" y="-10" width="6" height="28" fill="#37474F"/>
            <rect x="10" y="-10" width="4" height="28" fill="#455A64"/>
            <rect x="11" y="-10" width="2" height="28" fill="#546E7A"/>

            {/* Decorative rings/collars */}
            <ellipse cx="12" cy="2" rx="4" ry="1" fill="#546E7A"/>
            <ellipse cx="12" cy="10" rx="4" ry="1" fill="#546E7A"/>

            {/* Lamp housing - glass and iron cage */}
            <rect x="5" y="-14" width="14" height="10" fill="#263238"/>
            <rect x="6" y="-13" width="12" height="8" fill="#1A202C"/>

            {/* Glass panels - warm glow */}
            <rect x="7" y="-12" width="10" height="6" fill="#FEF3C7" opacity="0.95"/>
            <rect x="8" y="-11" width="8" height="4" fill="#FFEB3B" opacity="0.85"/>

            {/* Glass muntins - cross pattern */}
            <line x1="12" y1="-12" x2="12" y2="-6" stroke="#37474F" strokeWidth="0.6"/>
            <line x1="7" y1="-9" x2="17" y2="-9" stroke="#37474F" strokeWidth="0.6"/>

            {/* Top crown with finial */}
            <path d="M5 -14 L12 -18 L19 -14" fill="#37474F"/>
            <rect x="10" y="-20" width="4" height="3" fill="#455A64"/>
            <circle cx="12" cy="-21" r="2" fill="#37474F"/>
            <circle cx="12" cy="-21" r="1" fill="#546E7A"/>

            {/* Decorative scrollwork brackets */}
            <path d="M5 -12 Q1 -8 3 -2" stroke="#37474F" strokeWidth="1.2" fill="none"/>
            <path d="M19 -12 Q23 -8 21 -2" stroke="#37474F" strokeWidth="1.2" fill="none"/>
            <circle cx="3" cy="-2" r="1" fill="#455A64"/>
            <circle cx="21" cy="-2" r="1" fill="#455A64"/>

            {/* Inner bright glow around lantern - soft gradient */}
            <ellipse cx="12" cy="-9" rx="12" ry="10" fill={`url(#${innerGradId})`} />

            {/* Flame flicker with glow */}
            <ellipse cx="12" cy="-9" rx="4" ry="4.5" fill="#FFECB3" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.85;0.65;0.8;0.7" dur="0.8s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="12" cy="-9" rx="2.5" ry="3" fill="#FFF59D" opacity="0.9">
                <animate attributeName="ry" values="3;3.5;3" dur="0.5s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="12" cy="-9" rx="1.2" ry="1.8" fill="#FFFDE7">
                <animate attributeName="ry" values="1.8;2.3;1.8" dur="0.4s" repeatCount="indefinite"/>
            </ellipse>

            {/* Ambient dust motes floating in light beam */}
            <circle cx="8" cy="2" r="0.6" fill="#FFF8E1" opacity="0.4">
                <animate attributeName="cy" values="2;-4;2" dur="4s" repeatCount="indefinite"/>
                <animate attributeName="cx" values="8;10;8" dur="5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.4;0.6;0.3;0.5;0.4" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="16" cy="6" r="0.5" fill="#FFECB3" opacity="0.35">
                <animate attributeName="cy" values="6;0;6" dur="5.5s" repeatCount="indefinite"/>
                <animate attributeName="cx" values="16;14;16" dur="4.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.35;0.5;0.25;0.4;0.35" dur="4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="12" cy="10" r="0.4" fill="#FFE082" opacity="0.3">
                <animate attributeName="cy" values="10;4;10" dur="6s" repeatCount="indefinite"/>
                <animate attributeName="cx" values="12;15;12" dur="7s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0.45;0.2;0.35;0.3" dur="5s" repeatCount="indefinite"/>
            </circle>
        </g>
    );
};

// ===========================================
// WALL SCONCE - Beaux-Arts gas lamp mounted on wall
// Ornate 1889 Paris Exposition style
// ===========================================

export const generateWallSconce = (direction: 'left' | 'right' | 'down'): JSX.Element => {
    // Wall-mounted gas lamp sconce - Beaux-Arts style
    // 'left' = mounted on LEFT/WEST wall, lamp extends RIGHT/EAST into room
    // 'right' = mounted on RIGHT/EAST wall, lamp extends LEFT/WEST into room
    const isLeft = direction === 'left';
    const isRight = direction === 'right';
    const isDown = direction === 'down';

    // Ornate brass/bronze colors for Beaux-Arts style
    const brassBase = '#8B6914';
    const brassMid = '#C9A227';
    const brassHighlight = '#E8C547';
    const brassAccent = '#FFD700';
    const glassWarm = '#FEF9E7';
    const flameCore = '#FFF8DC';
    const flameOuter = '#FFE082';

    // Unique gradient ID for this sconce
    const gradId = `sconceGlow-${direction}`;
    const innerGradId = `sconceInner-${direction}`;

    if (isDown) {
        // Sconce pointing down from top wall
        return (
            <g>
                {/* Gradient definitions for soft warm light */}
                <defs>
                    <radialGradient id={`${gradId}-down`} cx="50%" cy="30%" r="55%">
                        <stop offset="0%" stopColor="#FFF8E1" stopOpacity="0.7">
                            <animate attributeName="stop-opacity" values="0.7;0.8;0.65;0.75;0.7" dur="1.2s" repeatCount="indefinite"/>
                        </stop>
                        <stop offset="15%" stopColor="#FFECB3" stopOpacity="0.5" />
                        <stop offset="35%" stopColor="#FFE082" stopOpacity="0.28" />
                        <stop offset="55%" stopColor="#FFCC80" stopOpacity="0.14" />
                        <stop offset="75%" stopColor="#FFB74D" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#FF9800" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id={`${innerGradId}-down`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFFDE7" stopOpacity="1" />
                        <stop offset="30%" stopColor="#FFF9C4" stopOpacity="0.7" />
                        <stop offset="60%" stopColor="#FFF176" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#FFEE58" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* SOFT DIFFUSE GLOW - radial gradient, no hard edges, warmer & brighter */}
                <ellipse cx="12" cy="18" rx="56" ry="50" fill={`url(#${gradId}-down)`} />
                <ellipse cx="12" cy="16" rx="36" ry="30" fill={`url(#${gradId}-down)`} />
                <ellipse cx="12" cy="15" rx="20" ry="16" fill={`url(#${gradId}-down)`} />

                {/* Ornate wall plate - rosette design */}
                <ellipse cx="12" cy="2" rx="5" ry="2.5" fill={brassBase}/>
                <ellipse cx="12" cy="2" rx="4" ry="2" fill={brassMid}/>
                <ellipse cx="12" cy="1.5" rx="2.5" ry="1.2" fill={brassHighlight}/>

                {/* Decorative arm extending down */}
                <rect x="10.5" y="3" width="3" height="5" fill={brassMid}/>
                <rect x="11" y="3" width="2" height="5" fill={brassHighlight}/>

                {/* Ornate scrollwork brackets */}
                <path d="M9 4 C6 5 5 8 7 10" stroke={brassBase} strokeWidth="1.5" fill="none"/>
                <path d="M15 4 C18 5 19 8 17 10" stroke={brassBase} strokeWidth="1.5" fill="none"/>
                <circle cx="7" cy="10" r="1.2" fill={brassAccent}/>
                <circle cx="17" cy="10" r="1.2" fill={brassAccent}/>

                {/* Lantern crown */}
                <path d="M7 10 L12 8 L17 10" fill={brassMid}/>
                <path d="M8 10 L12 8.5 L16 10" fill={brassHighlight}/>

                {/* Glass lantern body - beveled */}
                <rect x="7" y="10" width="10" height="10" fill={brassBase}/>
                <rect x="8" y="11" width="8" height="8" fill={glassWarm}/>
                <rect x="9" y="12" width="6" height="6" fill="#FFFDE7" opacity="0.95"/>

                {/* Glass bevels / facets */}
                <line x1="12" y1="11" x2="12" y2="19" stroke={brassMid} strokeWidth="0.5"/>
                <line x1="8" y1="15" x2="16" y2="15" stroke={brassMid} strokeWidth="0.5"/>

                {/* Ornate bottom finial */}
                <path d="M7 20 L12 23 L17 20" fill={brassMid}/>
                <circle cx="12" cy="23" r="1.5" fill={brassAccent}/>
                <circle cx="12" cy="23" r="0.7" fill={brassHighlight}/>

                {/* Inner flame glow - soft gradient */}
                <ellipse cx="12" cy="15" rx="8" ry="7" fill={`url(#${innerGradId}-down)`} />

                {/* Animated flame */}
                <ellipse cx="12" cy="15" rx="3" ry="3.5" fill="#FFECB3" opacity="0.75">
                    <animate attributeName="opacity" values="0.75;0.9;0.7;0.85;0.75" dur="0.7s" repeatCount="indefinite"/>
                </ellipse>
                <ellipse cx="12" cy="15" rx="1.8" ry="2.5" fill={flameOuter} opacity="0.9">
                    <animate attributeName="ry" values="2.5;3;2.5" dur="0.35s" repeatCount="indefinite"/>
                </ellipse>
                <ellipse cx="12" cy="15" rx="1" ry="1.8" fill={flameCore}>
                    <animate attributeName="ry" values="1.8;2.2;1.8" dur="0.28s" repeatCount="indefinite"/>
                </ellipse>
            </g>
        );
    }

    // For left/right sconces:
    // 'left' direction means mounted on west wall, light extends eastward (to the right)
    // 'right' direction means mounted on east wall, light extends westward (to the left)
    // We draw the base version extending RIGHT, then flip for 'right' direction

    const baseSconce = (
        <g>
            {/* Gradient definitions for soft warm light */}
            <defs>
                <radialGradient id={`${gradId}-side`} cx="60%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#FFF8E1" stopOpacity="0.7">
                        <animate attributeName="stop-opacity" values="0.7;0.8;0.65;0.75;0.7" dur="1.3s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="15%" stopColor="#FFECB3" stopOpacity="0.5" />
                    <stop offset="35%" stopColor="#FFE082" stopOpacity="0.28" />
                    <stop offset="55%" stopColor="#FFCC80" stopOpacity="0.14" />
                    <stop offset="75%" stopColor="#FFB74D" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#FF9800" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`${innerGradId}-side`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFDE7" stopOpacity="1" />
                    <stop offset="30%" stopColor="#FFF9C4" stopOpacity="0.7" />
                    <stop offset="60%" stopColor="#FFF176" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#FFEE58" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* SOFT DIFFUSE GLOW - radial gradient, no hard edges, warmer & brighter */}
            <ellipse cx="17" cy="12" rx="56" ry="46" fill={`url(#${gradId}-side)`} />
            <ellipse cx="17" cy="12" rx="36" ry="28" fill={`url(#${gradId}-side)`} />
            <ellipse cx="17" cy="12" rx="18" ry="14" fill={`url(#${gradId}-side)`} />

            {/* Ornate wall plate - rosette */}
            <ellipse cx="2" cy="12" rx="2.5" ry="5" fill={brassBase}/>
            <ellipse cx="2" cy="12" rx="2" ry="4" fill={brassMid}/>
            <ellipse cx="1.5" cy="12" rx="1.2" ry="2.5" fill={brassHighlight}/>

            {/* Decorative curved arm */}
            <path d="M3 12 C6 12 8 11 10 11" stroke={brassMid} strokeWidth="2.5" fill="none"/>
            <path d="M3 12 C6 12 8 11.5 10 11.5" stroke={brassHighlight} strokeWidth="1.5" fill="none"/>

            {/* Ornate scrollwork */}
            <path d="M4 9 C7 6 10 7 11 9" stroke={brassBase} strokeWidth="1.2" fill="none"/>
            <path d="M4 15 C7 18 10 17 11 15" stroke={brassBase} strokeWidth="1.2" fill="none"/>
            <circle cx="4" cy="9" r="1" fill={brassAccent}/>
            <circle cx="4" cy="15" r="1" fill={brassAccent}/>

            {/* Lantern crown / top */}
            <path d="M10 8 L15 5 L20 8" fill={brassMid}/>
            <path d="M11 8 L15 6 L19 8" fill={brassHighlight}/>
            <circle cx="15" cy="5" r="1.2" fill={brassAccent}/>

            {/* Glass lantern body */}
            <rect x="10" y="8" width="10" height="10" fill={brassBase}/>
            <rect x="11" y="9" width="8" height="8" fill={glassWarm}/>
            <rect x="12" y="10" width="6" height="6" fill="#FFFDE7" opacity="0.95"/>

            {/* Glass bevels */}
            <line x1="15" y1="9" x2="15" y2="17" stroke={brassMid} strokeWidth="0.5"/>
            <line x1="11" y1="13" x2="19" y2="13" stroke={brassMid} strokeWidth="0.5"/>

            {/* Bottom finial */}
            <path d="M10 18 L15 21 L20 18" fill={brassMid}/>
            <circle cx="15" cy="20" r="1.2" fill={brassAccent}/>

            {/* Inner glow - soft gradient */}
            <ellipse cx="15" cy="13" rx="8" ry="7" fill={`url(#${innerGradId}-side)`} />

            {/* Animated flame */}
            <ellipse cx="15" cy="13" rx="3" ry="3.2" fill="#FFECB3" opacity="0.75">
                <animate attributeName="opacity" values="0.75;0.9;0.7;0.85;0.75" dur="0.7s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="15" cy="13" rx="1.8" ry="2.2" fill={flameOuter} opacity="0.9">
                <animate attributeName="ry" values="2.2;2.8;2.2" dur="0.35s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="15" cy="13" rx="1" ry="1.5" fill={flameCore}>
                <animate attributeName="ry" values="1.5;2;1.5" dur="0.28s" repeatCount="indefinite"/>
            </ellipse>
        </g>
    );

    // If 'right' (mounted on east wall), flip horizontally so lamp points left/west
    if (isRight) {
        return (
            <g transform="translate(24, 0) scale(-1, 1)">
                {baseSconce}
            </g>
        );
    }

    // 'left' (mounted on west wall) - lamp points right/east (default orientation)
    return baseSconce;
};

// Generate kiosk with randomized label based on position
export const generateKiosk = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const labelIndex = Math.floor((hash - Math.floor(hash)) * KIOSK_LABELS.length);
    const label = KIOSK_LABELS[labelIndex];

    return (
        <g>
            {/* Shadow - spans 2x2 */}
            <ellipse cx="24" cy="23" rx="22" ry="4" fill="#000" opacity="0.2"/>

            {/* Ornate base platform with molding */}
            <rect x="-2" y="20" width="52" height="4" fill="#0F4020"/>
            <rect x="0" y="18" width="48" height="4" fill="#166534"/>
            <rect x="1" y="17" width="46" height="2" fill="#1B5E20"/>

            {/* Main kiosk body - Morris-style green with gilt details */}
            <rect x="2" y="0" width="44" height="18" fill="#166534"/>
            <rect x="3" y="1" width="42" height="16" fill="#1B5E20"/>

            {/* Upper structure with decorative panels */}
            <rect x="2" y="-16" width="44" height="18" fill="#166534"/>
            <rect x="3" y="-15" width="42" height="16" fill="#15803D"/>

            {/* Ornate mansard roof */}
            <path d="M-4 -16 L24 -28 L52 -16" fill="#0F4020"/>
            <path d="M0 -16 L24 -26 L48 -16" fill="#166534"/>
            <path d="M4 -16 L24 -24 L44 -16" fill="#1B5E20"/>

            {/* Roof finial with ornate detail */}
            <rect x="22" y="-32" width="4" height="6" fill="#B8860B"/>
            <circle cx="24" cy="-33" r="3.5" fill="#DAA520"/>
            <circle cx="24" cy="-33" r="2" fill="#FFD700"/>
            <circle cx="24" cy="-33" r="0.8" fill="#FEF3C7"/>

            {/* Decorative cornice with dentil molding */}
            <rect x="0" y="-17" width="48" height="2" fill="#0F4020"/>
            <g fill="#DAA520">
                {[4, 10, 16, 22, 28, 34, 40].map((cx, i) => (
                    <rect key={i} x={cx} y="-16" width="2" height="1" />
                ))}
            </g>

            {/* Arched display windows with gilt frames */}
            <g>
                <rect x="5" y="-12" width="11" height="9" fill="#FFFDE7"/>
                <path d="M5 -12 Q10.5 -16 16 -12" fill="#FFFDE7"/>
                <rect x="5" y="-12" width="11" height="9" fill="none" stroke="#B8860B" strokeWidth="1"/>
                <path d="M5 -12 Q10.5 -16 16 -12" fill="none" stroke="#B8860B" strokeWidth="1"/>
            </g>
            <g>
                <rect x="19" y="-12" width="10" height="9" fill="#FEF9C3"/>
                <path d="M19 -12 Q24 -16 29 -12" fill="#FEF9C3"/>
                <rect x="19" y="-12" width="10" height="9" fill="none" stroke="#B8860B" strokeWidth="1"/>
                <path d="M19 -12 Q24 -16 29 -12" fill="none" stroke="#B8860B" strokeWidth="1"/>
            </g>
            <g>
                <rect x="32" y="-12" width="11" height="9" fill="#FFFDE7"/>
                <path d="M32 -12 Q37.5 -16 43 -12" fill="#FFFDE7"/>
                <rect x="32" y="-12" width="11" height="9" fill="none" stroke="#B8860B" strokeWidth="1"/>
                <path d="M32 -12 Q37.5 -16 43 -12" fill="none" stroke="#B8860B" strokeWidth="1"/>
            </g>

            {/* Lower display counter */}
            <rect x="4" y="3" width="18" height="12" fill="#FFFDE7"/>
            <rect x="4" y="3" width="18" height="12" fill="none" stroke="#B8860B" strokeWidth="0.8"/>

            {/* Service window with brass frame */}
            <rect x="26" y="3" width="18" height="12" fill="#5D3A1A"/>
            <rect x="27" y="4" width="16" height="10" fill="#8B5A2B"/>
            <rect x="28" y="5" width="14" height="8" fill="#2D1810" opacity="0.6"/>
            <rect x="26" y="3" width="18" height="12" fill="none" stroke="#B8860B" strokeWidth="1"/>
            {/* Counter ledge */}
            <rect x="25" y="13" width="20" height="3" fill="#5D3A1A"/>
            <rect x="26" y="14" width="18" height="1" fill="#B8860B"/>

            {/* Goods on display - books, postcards, newspapers */}
            <rect x="6" y="6" width="3" height="5" fill="#8B0000"/>
            <rect x="6.5" y="6.5" width="2" height="0.5" fill="#DAA520"/>
            <rect x="10" y="7" width="2" height="4" fill="#1E3A5F"/>
            <rect x="10.5" y="7.5" width="1" height="0.3" fill="#C0C0C0"/>
            <rect x="13" y="6" width="3" height="5" fill="#4A1C4A"/>
            <rect x="13.5" y="6.5" width="2" height="0.5" fill="#DAA520"/>
            <rect x="17" y="8" width="3" height="3" fill="#FEF3C7"/>
            <rect x="17.5" y="8.5" width="2" height="2" fill="#E5E5E5"/>

            {/* Ornate columns */}
            <rect x="0" y="-16" width="4" height="34" fill="#0F4020"/>
            <rect x="1" y="-14" width="2" height="30" fill="#166534"/>
            <rect x="44" y="-16" width="4" height="34" fill="#0F4020"/>
            <rect x="45" y="-14" width="2" height="30" fill="#166534"/>

            {/* Brass column capitals */}
            <rect x="0" y="-17" width="4" height="2" fill="#B8860B"/>
            <rect x="44" y="-17" width="4" height="2" fill="#B8860B"/>
            <rect x="0" y="16" width="4" height="2" fill="#B8860B"/>
            <rect x="44" y="16" width="4" height="2" fill="#B8860B"/>

            {/* Main sign board */}
            <rect x="8" y="-1" width="32" height="5" fill="#8B0000"/>
            <rect x="9" y="0" width="30" height="3" fill="#6B0000"/>
            {/* Sign text */}
            <text x="24" y="2.5" textAnchor="middle" fontSize="3.5" fill="#FFD700" fontFamily="serif" fontWeight="bold">
                {label}
            </text>

            {/* Gas lamp on side */}
            <rect x="-3" y="-8" width="2" height="8" fill="#37474F"/>
            <rect x="-4" y="-12" width="4" height="5" fill="#263238"/>
            <rect x="-3.5" y="-11" width="3" height="3" fill="#FEF3C7" opacity="0.9"/>
        </g>
    );
};

// Static version for backwards compatibility
export const KIOSK_GRAPHIC = (
    <g>
        {/* Shadow - spans 2x2 */}
        <ellipse cx="24" cy="23" rx="22" ry="4" fill="#000" opacity="0.2"/>

        {/* Ornate base platform with molding */}
        <rect x="-2" y="20" width="52" height="4" fill="#0F4020"/>
        <rect x="0" y="18" width="48" height="4" fill="#166534"/>
        <rect x="1" y="17" width="46" height="2" fill="#1B5E20"/>

        {/* Main kiosk body */}
        <rect x="2" y="0" width="44" height="18" fill="#166534"/>
        <rect x="3" y="1" width="42" height="16" fill="#1B5E20"/>

        {/* Upper structure */}
        <rect x="2" y="-16" width="44" height="18" fill="#166534"/>
        <rect x="3" y="-15" width="42" height="16" fill="#15803D"/>

        {/* Ornate mansard roof */}
        <path d="M-4 -16 L24 -28 L52 -16" fill="#0F4020"/>
        <path d="M0 -16 L24 -26 L48 -16" fill="#166534"/>
        <path d="M4 -16 L24 -24 L44 -16" fill="#1B5E20"/>

        {/* Roof finial */}
        <rect x="22" y="-32" width="4" height="6" fill="#B8860B"/>
        <circle cx="24" cy="-33" r="3.5" fill="#DAA520"/>
        <circle cx="24" cy="-33" r="2" fill="#FFD700"/>

        {/* Cornice */}
        <rect x="0" y="-17" width="48" height="2" fill="#0F4020"/>

        {/* Arched windows */}
        <rect x="5" y="-12" width="11" height="9" fill="#FFFDE7"/>
        <path d="M5 -12 Q10.5 -16 16 -12" fill="#FFFDE7" stroke="#B8860B" strokeWidth="1"/>
        <rect x="19" y="-12" width="10" height="9" fill="#FEF9C3"/>
        <rect x="32" y="-12" width="11" height="9" fill="#FFFDE7"/>

        {/* Lower display */}
        <rect x="4" y="3" width="18" height="12" fill="#FFFDE7" stroke="#B8860B" strokeWidth="0.8"/>
        <rect x="26" y="3" width="18" height="12" fill="#5D3A1A"/>

        {/* Columns */}
        <rect x="0" y="-16" width="4" height="34" fill="#0F4020"/>
        <rect x="44" y="-16" width="4" height="34" fill="#0F4020"/>

        {/* Sign */}
        <rect x="8" y="-1" width="32" height="5" fill="#8B0000"/>
        <text x="24" y="2.5" textAnchor="middle" fontSize="3.5" fill="#FFD700" fontFamily="serif" fontWeight="bold">
            LIVRES
        </text>
    </g>
);

export const DISPLAY_CASE_GRAPHIC = (
    <g>
        {/* Shadow - spans 2 tiles */}
        <ellipse cx="24" cy="22" rx="22" ry="3" fill="#000" opacity="0.15"/>
        {/* Base cabinet */}
        <rect x="0" y="16" width="48" height="8" fill="#5D3A1A"/>
        <rect x="1" y="17" width="46" height="6" fill="#8B5A2B"/>
        {/* Legs */}
        <rect x="2" y="20" width="4" height="4" fill="#4A2511"/>
        <rect x="42" y="20" width="4" height="4" fill="#4A2511"/>
        <rect x="22" y="20" width="4" height="4" fill="#4A2511"/>
        {/* Decorative molding */}
        <rect x="0" y="15" width="48" height="2" fill="#6B4423"/>
        {/* Glass display section */}
        <rect x="1" y="0" width="46" height="16" fill="#1A1A1A"/>
        <rect x="2" y="1" width="44" height="14" fill="#E0F4FF" opacity="0.85"/>
        {/* Brass frame */}
        <rect x="0" y="-1" width="48" height="2" fill="#B8860B"/>
        <rect x="0" y="14" width="48" height="2" fill="#B8860B"/>
        <rect x="0" y="0" width="2" height="16" fill="#DAA520"/>
        <rect x="46" y="0" width="2" height="16" fill="#8B7500"/>
        <rect x="23" y="0" width="2" height="16" fill="#B8860B"/>
        {/* Glass reflections */}
        <path d="M4 2 L8 6 L6 8 L2 4 Z" fill="#FFFFFF" opacity="0.3"/>
        <path d="M28 3 L32 7 L30 9 L26 5 Z" fill="#FFFFFF" opacity="0.25"/>
        {/* Velvet display lining */}
        <rect x="3" y="10" width="42" height="4" fill="#4A1A2C"/>
        {/* Default exhibit items */}
        <ellipse cx="10" cy="8" rx="4" ry="6" fill="#B87333"/>
        <ellipse cx="10" cy="4" rx="3" ry="2" fill="#CD853F"/>
        <rect x="19" y="5" width="10" height="7" fill="#FFD700"/>
        <rect x="20" y="6" width="8" height="5" fill="#DAA520"/>
        <ellipse cx="38" cy="10" rx="3" ry="1" fill="#2F2F2F"/>
        <path d="M36 10 L38 3 L40 10" fill="#E8E8E8"/>
        <circle cx="38" cy="2" r="2" fill="#E8E8E8"/>
        {/* Label plate */}
        <rect x="18" y="18" width="12" height="3" fill="#B8860B"/>
        {/* Corner ornaments */}
        <circle cx="2" cy="0" r="2" fill="#DAA520"/>
        <circle cx="46" cy="0" r="2" fill="#B8860B"/>
    </g>
);

// Procedurally generate unique fish based on position
export const generateAquariumTank = (x: number, y: number): JSX.Element => {
    // Create deterministic randomness from position
    const hash1 = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const hash2 = Math.abs(Math.sin(x * 78.233 + y * 12.9898) * 43758.5453123);
    const hash3 = Math.abs(Math.sin((x + y) * 45.164) * 43758.5453123);
    const hash4 = Math.abs(Math.sin((x * y + 1) * 23.456) * 43758.5453123);

    // Fish colors - tropical varieties
    const fishColors = [
        '#FF6B35', // Orange clownfish
        '#4169E1', // Royal blue tang
        '#FFD700', // Golden
        '#FF69B4', // Pink
        '#00CED1', // Turquoise
        '#9370DB', // Purple
        '#FF4500', // Red-orange
        '#32CD32', // Lime green
        '#FF1493', // Deep pink
        '#00BFFF', // Sky blue
    ];

    // Select fish based on position hash
    const fish1Color = fishColors[Math.floor((hash1 % 1) * fishColors.length)];
    const fish2Color = fishColors[Math.floor((hash2 % 1) * fishColors.length)];
    const fish3Color = fishColors[Math.floor((hash3 % 1) * fishColors.length)];

    // Vary animation durations for natural feel
    const fish1Dur = 5 + (hash1 % 1) * 6; // 5-11s
    const fish2Dur = 4 + (hash2 % 1) * 5; // 4-9s
    const fish3Dur = 6 + (hash3 % 1) * 4; // 6-10s
    const bubbleDur = 2 + (hash4 % 1) * 3; // 2-5s

    // Fish sizes
    const fish1Size = 3 + (hash1 % 1) * 2;
    const fish2Size = 2.5 + (hash2 % 1) * 1.5;
    const fish3Size = 2 + (hash3 % 1) * 1.5;

    // Starting positions
    const fish1StartY = 5 + Math.floor((hash1 % 1) * 6);
    const fish2StartY = 7 + Math.floor((hash2 % 1) * 5);
    const fish3StartY = 4 + Math.floor((hash3 % 1) * 7);

    // Plant variations
    const plantColor1 = `hsl(${120 + (hash1 % 1) * 30}, 60%, ${30 + (hash2 % 1) * 15}%)`;
    const plantColor2 = `hsl(${100 + (hash2 % 1) * 40}, 50%, ${25 + (hash3 % 1) * 20}%)`;

    // Coral/decoration color
    const coralColor = `hsl(${(hash3 % 1) * 60 + 10}, ${40 + (hash1 % 1) * 30}%, ${35 + (hash2 % 1) * 20}%)`;

    return (
        <g>
            {/* Shadow */}
            <ellipse cx="24" cy="23" rx="22" ry="3" fill="#000" opacity="0.25"/>

            {/* Ornate iron base with scrollwork */}
            <rect x="0" y="18" width="48" height="6" fill="#1F3333"/>
            <path d="M4 18 Q8 15 12 18 Q16 15 20 18 Q24 15 28 18 Q32 15 36 18 Q40 15 44 18"
                  stroke="#3A5555" strokeWidth="1.5" fill="none"/>
            <path d="M2 21 Q4 19 6 21" stroke="#4A6666" strokeWidth="1" fill="none"/>
            <path d="M42 21 Q44 19 46 21" stroke="#4A6666" strokeWidth="1" fill="none"/>

            {/* Glass tank with depth */}
            <rect x="1" y="-1" width="46" height="20" fill="#051828"/>
            <rect x="2" y="0" width="44" height="18" fill="#0A3550" opacity="0.95"/>

            {/* Water gradient layers for depth */}
            <rect x="2" y="0" width="44" height="4" fill="#1A6080" opacity="0.5"/>
            <rect x="2" y="4" width="44" height="6" fill="#155570" opacity="0.3"/>
            <rect x="2" y="13" width="44" height="5" fill="#082838" opacity="0.4"/>

            {/* Caustic light patterns (subtle) */}
            <ellipse cx="15" cy="3" rx="8" ry="2" fill="#2A8FAF" opacity="0.15">
                <animate attributeName="cx" values="15;30;15" dur="12s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="35" cy="4" rx="6" ry="1.5" fill="#2A8FAF" opacity="0.1">
                <animate attributeName="cx" values="35;15;35" dur="10s" repeatCount="indefinite"/>
            </ellipse>

            {/* Ornate brass frame */}
            <rect x="0" y="-2" width="48" height="3" fill="#B8860B"/>
            <rect x="0" y="-2" width="48" height="1" fill="#DAA520"/>
            <rect x="0" y="17" width="48" height="2" fill="#8B6914"/>
            <rect x="0" y="-1" width="2" height="19" fill="#C9A227"/>
            <rect x="46" y="-1" width="2" height="19" fill="#8B7500"/>

            {/* Corner ornaments */}
            <circle cx="1" cy="-1" r="1.5" fill="#DAA520"/>
            <circle cx="47" cy="-1" r="1.5" fill="#B8860B"/>

            {/* Sandy bottom with texture */}
            <rect x="2" y="14" width="44" height="4" fill="#C2B280" opacity="0.7"/>
            <ellipse cx="12" cy="16" rx="4" ry="1" fill="#A89B6A" opacity="0.5"/>
            <ellipse cx="36" cy="15.5" rx="5" ry="1.2" fill="#B8A87A" opacity="0.4"/>

            {/* Aquatic plants - procedural colors */}
            <path d={`M8 18 Q5 13 8 7 Q11 13 8 18`} stroke={plantColor1} strokeWidth="2.5" fill="none"/>
            <path d={`M11 18 Q9 14 12 10 Q14 14 11 18`} stroke={plantColor2} strokeWidth="1.5" fill="none"/>
            <path d={`M38 18 Q41 12 38 5 Q35 12 38 18`} stroke={plantColor1} strokeWidth="2.5" fill="none"/>
            <path d={`M35 18 Q37 14 34 9 Q31 14 35 18`} stroke={plantColor2} strokeWidth="1.5" fill="none"/>

            {/* Coral/rocks */}
            <ellipse cx="24" cy="16" rx="7" ry="2.5" fill={coralColor}/>
            <ellipse cx="21" cy="15" rx="3" ry="1.5" fill={coralColor} opacity="0.8"/>
            <ellipse cx="27" cy="15.5" rx="2.5" ry="1.2" fill={coralColor} opacity="0.7"/>

            {/* Small shells/pebbles */}
            <ellipse cx="16" cy="16.5" rx="1.5" ry="0.8" fill="#DDD8C4"/>
            <ellipse cx="32" cy="16.8" rx="1" ry="0.6" fill="#E8E0D0"/>

            {/* === ANIMATED FISH === */}

            {/* Fish 1 - main fish swimming right to left */}
            <g>
                <ellipse rx={fish1Size} ry={fish1Size * 0.6} fill={fish1Color}>
                    <animate attributeName="cx" values={`38;10;38`} dur={`${fish1Dur}s`} repeatCount="indefinite"/>
                    <animate attributeName="cy" values={`${fish1StartY};${fish1StartY + 2};${fish1StartY}`} dur={`${fish1Dur}s`} repeatCount="indefinite"/>
                </ellipse>
                {/* Tail */}
                <polygon fill={fish1Color} opacity="0.9">
                    <animate attributeName="points"
                             values={`42,${fish1StartY} 45,${fish1StartY-2} 45,${fish1StartY+2};14,${fish1StartY+2} 11,${fish1StartY} 11,${fish1StartY+4};42,${fish1StartY} 45,${fish1StartY-2} 45,${fish1StartY+2}`}
                             dur={`${fish1Dur}s`} repeatCount="indefinite"/>
                </polygon>
                {/* Eye */}
                <circle r="0.8" fill="#FFF">
                    <animate attributeName="cx" values="36;8;36" dur={`${fish1Dur}s`} repeatCount="indefinite"/>
                    <animate attributeName="cy" values={`${fish1StartY - 0.5};${fish1StartY + 1.5};${fish1StartY - 0.5}`} dur={`${fish1Dur}s`} repeatCount="indefinite"/>
                </circle>
            </g>

            {/* Fish 2 - smaller fish going opposite direction */}
            <g>
                <ellipse rx={fish2Size} ry={fish2Size * 0.55} fill={fish2Color}>
                    <animate attributeName="cx" values={`8;40;8`} dur={`${fish2Dur}s`} repeatCount="indefinite"/>
                    <animate attributeName="cy" values={`${fish2StartY};${fish2StartY - 1};${fish2StartY}`} dur={`${fish2Dur}s`} repeatCount="indefinite"/>
                </ellipse>
                <polygon fill={fish2Color} opacity="0.85">
                    <animate attributeName="points"
                             values={`5,${fish2StartY} 2,${fish2StartY-1.5} 2,${fish2StartY+1.5};37,${fish2StartY-1} 40,${fish2StartY-2.5} 40,${fish2StartY+0.5};5,${fish2StartY} 2,${fish2StartY-1.5} 2,${fish2StartY+1.5}`}
                             dur={`${fish2Dur}s`} repeatCount="indefinite"/>
                </polygon>
            </g>

            {/* Fish 3 - tiny fish darting around */}
            <g>
                <ellipse rx={fish3Size} ry={fish3Size * 0.5} fill={fish3Color}>
                    <animate attributeName="cx" values="25;15;35;25" dur={`${fish3Dur}s`} repeatCount="indefinite"/>
                    <animate attributeName="cy" values={`${fish3StartY};${fish3StartY + 3};${fish3StartY + 1};${fish3StartY}`} dur={`${fish3Dur}s`} repeatCount="indefinite"/>
                </ellipse>
            </g>

            {/* Bubbles - multiple with staggered timing */}
            <circle cx="10" cy="13" r="1" fill="#FFFFFF" opacity="0.4">
                <animate attributeName="cy" values="13;1;13" dur={`${bubbleDur}s`} repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.4;0;0.4" dur={`${bubbleDur}s`} repeatCount="indefinite"/>
            </circle>
            <circle cx="24" cy="14" r="0.7" fill="#FFFFFF" opacity="0.3">
                <animate attributeName="cy" values="14;2;14" dur={`${bubbleDur + 1}s`} repeatCount="indefinite" begin="0.5s"/>
                <animate attributeName="opacity" values="0.3;0;0.3" dur={`${bubbleDur + 1}s`} repeatCount="indefinite" begin="0.5s"/>
            </circle>
            <circle cx="38" cy="12" r="0.8" fill="#FFFFFF" opacity="0.35">
                <animate attributeName="cy" values="12;0;12" dur={`${bubbleDur + 0.5}s`} repeatCount="indefinite" begin="1s"/>
                <animate attributeName="opacity" values="0.35;0;0.35" dur={`${bubbleDur + 0.5}s`} repeatCount="indefinite" begin="1s"/>
            </circle>

            {/* Brass label plate */}
            <rect x="14" y="20" width="20" height="3" fill="#B8860B"/>
            <rect x="15" y="20.5" width="18" height="2" fill="#DAA520" opacity="0.5"/>
        </g>
    );
};

// Legacy static version for fallback
export const AQUARIUM_GRAPHIC = generateAquariumTank(0, 0);

// Two-tile tall objects
export const TALL_TREE_TOP = (
    <g>
        <ellipse cx="12" cy="16" rx="11" ry="10" fill="#2E7D32"/>
        <ellipse cx="8" cy="12" rx="7" ry="7" fill="#388E3C"/>
        <ellipse cx="16" cy="12" rx="7" ry="7" fill="#388E3C"/>
        <ellipse cx="12" cy="8" rx="9" ry="7" fill="#43A047"/>
        <ellipse cx="6" cy="10" rx="4" ry="4" fill="#4CAF50"/>
        <ellipse cx="18" cy="10" rx="4" ry="4" fill="#4CAF50"/>
        <ellipse cx="12" cy="4" rx="6" ry="5" fill="#66BB6A"/>
        <circle cx="8" cy="6" r="2" fill="#81C784" opacity="0.7"/>
        <circle cx="15" cy="8" r="1.5" fill="#A5D6A7" opacity="0.5"/>
    </g>
);

export const TALL_TREE_BOTTOM = (
    <g>
        <ellipse cx="14" cy="22" rx="8" ry="2" fill="#000" opacity="0.25"/>
        <rect x="9" y="0" width="6" height="22" fill="#5D4037"/>
        <rect x="10" y="0" width="4" height="22" fill="#6D4C41"/>
        <line x1="10" y1="4" x2="10" y2="8" stroke="#4E342E" strokeWidth="0.5"/>
        <line x1="14" y1="10" x2="14" y2="16" stroke="#4E342E" strokeWidth="0.5"/>
        <path d="M9 20 Q6 22 4 22 M15 20 Q18 22 20 22" stroke="#5D4037" strokeWidth="2" fill="none"/>
        <ellipse cx="12" cy="-2" rx="10" ry="6" fill="#2E7D32"/>
    </g>
);

export const TALL_LAMP_TOP = (
    <g>
        <circle cx="12" cy="14" r="10" fill="url(#lampGlow)" opacity="0.5"/>
        <rect x="8" y="10" width="8" height="10" fill="#263238"/>
        <rect x="9" y="11" width="6" height="8" fill="#FFEB3B" opacity="0.9"/>
        <line x1="12" y1="11" x2="12" y2="19" stroke="#263238" strokeWidth="0.5"/>
        <line x1="9" y1="15" x2="15" y2="15" stroke="#263238" strokeWidth="0.5"/>
        <path d="M10 10 L12 4 L14 10 Z" fill="#37474F"/>
        <circle cx="12" cy="3" r="1.5" fill="#455A64"/>
        <path d="M8 12 Q4 14 6 18" stroke="#37474F" strokeWidth="1" fill="none"/>
        <path d="M16 12 Q20 14 18 18" stroke="#37474F" strokeWidth="1" fill="none"/>
        <ellipse cx="12" cy="15" rx="2" ry="3" fill="#FFF59D" opacity="0.8">
            <animate attributeName="ry" values="3;3.5;3" dur="0.3s" repeatCount="indefinite"/>
        </ellipse>
    </g>
);

export const TALL_LAMP_BOTTOM = (
    <g>
        <ellipse cx="13" cy="22" rx="5" ry="1.5" fill="#000" opacity="0.2"/>
        <rect x="10" y="0" width="4" height="18" fill="#37474F"/>
        <rect x="11" y="0" width="2" height="18" fill="#455A64"/>
        <rect x="9" y="4" width="6" height="2" fill="#546E7A"/>
        <rect x="9" y="12" width="6" height="2" fill="#546E7A"/>
        <rect x="8" y="18" width="8" height="4" fill="#263238"/>
        <rect x="6" y="21" width="12" height="3" fill="#1A202C"/>
        <circle cx="12" cy="8" r="1" fill="#607D8B"/>
    </g>
);

// Fountain components
export const FOUNTAIN_BASIN_EDGE = {
    left: (
        <g>
            <rect x="12" y="4" width="12" height="16" fill="#D4D4D4"/>
            <rect x="12" y="4" width="12" height="2" fill="#E8E8E8"/>
            <rect x="12" y="6" width="12" height="12" fill="#87CEEB" opacity="0.7"/>
        </g>
    ),
    right: (
        <g>
            <rect x="0" y="4" width="12" height="16" fill="#D4D4D4"/>
            <rect x="0" y="4" width="12" height="2" fill="#E8E8E8"/>
            <rect x="0" y="6" width="12" height="12" fill="#87CEEB" opacity="0.7"/>
        </g>
    ),
    top: (
        <g>
            <rect x="4" y="12" width="16" height="12" fill="#D4D4D4"/>
            <rect x="4" y="12" width="16" height="2" fill="#E8E8E8"/>
            <rect x="6" y="14" width="12" height="10" fill="#87CEEB" opacity="0.7"/>
        </g>
    ),
    bottom: (
        <g>
            <rect x="4" y="0" width="16" height="12" fill="#D4D4D4"/>
            <rect x="4" y="10" width="16" height="2" fill="#C0C0C0"/>
            <rect x="6" y="0" width="12" height="10" fill="#87CEEB" opacity="0.7"/>
        </g>
    ),
};

// Village and special biome tiles
export const VILLAGE_GRAPHICS: Record<string, JSX.Element> = {
    // Thatch hut
    THATCH_HUT: (
        <g>
            <ellipse cx="12" cy="22" rx="10" ry="2" fill="#000" opacity="0.15"/>
            <ellipse cx="12" cy="18" rx="10" ry="5" fill="#8B7355"/>
            <rect x="4" y="14" width="16" height="8" fill="#A08464"/>
            <path d="M0 10 L12 0 L24 10 Z" fill="#DAA520"/>
            <path d="M2 10 L12 2 L22 10 Z" fill="#C19A6B"/>
            <rect x="9" y="16" width="6" height="6" fill="#4A3728"/>
        </g>
    ),
    // Fire pit
    FIRE_PIT: (
        <g>
            <ellipse cx="12" cy="16" rx="8" ry="4" fill="#4A4A4A"/>
            <ellipse cx="12" cy="15" rx="6" ry="3" fill="#2D2D2D"/>
            <ellipse cx="12" cy="14" rx="4" ry="2" fill="#FF6B35"/>
            <ellipse cx="12" cy="12" rx="2" ry="3" fill="#FF8C5A">
                <animate attributeName="ry" values="3;4;3" dur="0.5s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="12" cy="10" rx="1" ry="2" fill="#FFD700">
                <animate attributeName="ry" values="2;3;2" dur="0.3s" repeatCount="indefinite"/>
            </ellipse>
        </g>
    ),
    // Drum
    DRUM: (
        <g>
            <ellipse cx="12" cy="20" rx="6" ry="2" fill="#000" opacity="0.15"/>
            <rect x="6" y="8" width="12" height="12" fill="#8B4513"/>
            <ellipse cx="12" cy="8" rx="6" ry="2" fill="#D4A574"/>
            <ellipse cx="12" cy="20" rx="6" ry="2" fill="#8B4513"/>
            <line x1="6" y1="8" x2="6" y2="20" stroke="#5D3A1A" strokeWidth="1"/>
            <line x1="18" y1="8" x2="18" y2="20" stroke="#5D3A1A" strokeWidth="1"/>
        </g>
    ),
    // Totem
    TOTEM: (
        <g>
            <ellipse cx="12" cy="22" rx="4" ry="1" fill="#000" opacity="0.15"/>
            <rect x="8" y="0" width="8" height="22" fill="#8B4513"/>
            <rect x="9" y="0" width="6" height="22" fill="#A0522D"/>
            <circle cx="12" cy="4" r="3" fill="#CD853F"/>
            <ellipse cx="10" cy="3" rx="1" ry="0.5" fill="#000"/>
            <ellipse cx="14" cy="3" rx="1" ry="0.5" fill="#000"/>
            <path d="M10 6 Q12 7 14 6" stroke="#000" strokeWidth="0.5" fill="none"/>
            <rect x="6" y="8" width="12" height="4" fill="#CD853F"/>
            <rect x="6" y="14" width="12" height="4" fill="#CD853F"/>
        </g>
    ),
    // Palm tree - single tile (legacy, kept for compatibility)
    PALM: (
        <g>
            <ellipse cx="14" cy="22" rx="6" ry="2" fill="#000" opacity="0.2"/>
            <path d="M12 22 Q10 12 12 4" stroke="#8B7355" strokeWidth="4" fill="none"/>
            <path d="M12 6 Q2 8 0 12" stroke="#228B22" strokeWidth="2" fill="none"/>
            <path d="M12 6 Q22 8 24 12" stroke="#228B22" strokeWidth="2" fill="none"/>
            <path d="M12 6 Q6 4 2 6" stroke="#2E8B57" strokeWidth="2" fill="none"/>
            <path d="M12 6 Q18 4 22 6" stroke="#2E8B57" strokeWidth="2" fill="none"/>
            <path d="M12 6 Q10 0 8 -2" stroke="#32CD32" strokeWidth="1.5" fill="none"/>
            <path d="M12 6 Q14 0 16 -2" stroke="#32CD32" strokeWidth="1.5" fill="none"/>
        </g>
    ),

};

// ==========================================
// Two-tile Palm Tree - realistic Canary Island Date Palm
// Top tile: Crown of fronds
// Bottom tile: Trunk with textured bark
// ==========================================

export const PALM_TOP = (
    <g>
        {/* Back fronds (darker, behind trunk) */}
        <g opacity="0.6">
            {/* Far left back frond */}
            <path d="M12 22 Q-4 16 -8 8" stroke="#0D4F28" strokeWidth="2" fill="none"/>
            <path d="M-2 12 C-4 11 -5 12 -4 13" fill="#166534"/>
            <path d="M0 14 C-2 13 -3 14 -2 15" fill="#166534"/>
            <path d="M2 16 C0 15 -1 16 0 17" fill="#166534"/>
            {/* Far right back frond */}
            <path d="M12 22 Q28 16 32 8" stroke="#0D4F28" strokeWidth="2" fill="none"/>
            <path d="M26 12 C28 11 29 12 28 13" fill="#166534"/>
            <path d="M24 14 C26 13 27 14 26 15" fill="#166534"/>
            <path d="M22 16 C24 15 25 16 24 17" fill="#166534"/>
        </g>

        {/* Main left frond - sweeping arc with pinnate leaves */}
        <g>
            <path d="M12 20 Q2 14 -4 6" stroke="#15803D" strokeWidth="2.5" fill="none"/>
            {/* Pinnate leaflets - left side */}
            <path d="M0 10 C-3 8 -4 9 -3 11 C-1 10 0 10 0 10" fill="#22C55E"/>
            <path d="M2 12 C-1 10 -2 11 -1 13 C1 12 2 12 2 12" fill="#22C55E"/>
            <path d="M4 14 C1 12 0 13 1 15 C3 14 4 14 4 14" fill="#22C55E"/>
            <path d="M6 16 C3 14 2 15 3 17 C5 16 6 16 6 16" fill="#22C55E"/>
            <path d="M8 18 C5 16 4 17 5 19 C7 18 8 18 8 18" fill="#22C55E"/>
            {/* Pinnate leaflets - right side of frond */}
            <path d="M1 9 C2 7 3 8 2 10 C1 9 1 9 1 9" fill="#16A34A"/>
            <path d="M3 11 C4 9 5 10 4 12 C3 11 3 11 3 11" fill="#16A34A"/>
            <path d="M5 13 C6 11 7 12 6 14 C5 13 5 13 5 13" fill="#16A34A"/>
            <path d="M7 15 C8 13 9 14 8 16 C7 15 7 15 7 15" fill="#16A34A"/>
        </g>

        {/* Main right frond - sweeping arc */}
        <g>
            <path d="M12 20 Q22 14 28 6" stroke="#15803D" strokeWidth="2.5" fill="none"/>
            {/* Pinnate leaflets - right side */}
            <path d="M24 10 C27 8 28 9 27 11 C25 10 24 10 24 10" fill="#22C55E"/>
            <path d="M22 12 C25 10 26 11 25 13 C23 12 22 12 22 12" fill="#22C55E"/>
            <path d="M20 14 C23 12 24 13 23 15 C21 14 20 14 20 14" fill="#22C55E"/>
            <path d="M18 16 C21 14 22 15 21 17 C19 16 18 16 18 16" fill="#22C55E"/>
            <path d="M16 18 C19 16 20 17 19 19 C17 18 16 18 16 18" fill="#22C55E"/>
            {/* Pinnate leaflets - left side of frond */}
            <path d="M23 9 C22 7 21 8 22 10 C23 9 23 9 23 9" fill="#16A34A"/>
            <path d="M21 11 C20 9 19 10 20 12 C21 11 21 11 21 11" fill="#16A34A"/>
            <path d="M19 13 C18 11 17 12 18 14 C19 13 19 13 19 13" fill="#16A34A"/>
            <path d="M17 15 C16 13 15 14 16 16 C17 15 17 15 17 15" fill="#16A34A"/>
        </g>

        {/* Upper left frond */}
        <g>
            <path d="M12 18 Q4 10 0 2" stroke="#16A34A" strokeWidth="2" fill="none"/>
            <path d="M2 6 C0 5 -1 6 0 7 C1 6.5 2 6 2 6" fill="#22C55E"/>
            <path d="M4 8 C2 7 1 8 2 9 C3 8.5 4 8 4 8" fill="#22C55E"/>
            <path d="M6 10 C4 9 3 10 4 11 C5 10.5 6 10 6 10" fill="#22C55E"/>
            <path d="M8 12 C6 11 5 12 6 13 C7 12.5 8 12 8 12" fill="#22C55E"/>
            <path d="M3 5 C4 3 5 4 4 6 C3.5 5 3 5 3 5" fill="#4ADE80"/>
            <path d="M5 7 C6 5 7 6 6 8 C5.5 7 5 7 5 7" fill="#4ADE80"/>
            <path d="M7 9 C8 7 9 8 8 10 C7.5 9 7 9 7 9" fill="#4ADE80"/>
        </g>

        {/* Upper right frond */}
        <g>
            <path d="M12 18 Q20 10 24 2" stroke="#16A34A" strokeWidth="2" fill="none"/>
            <path d="M22 6 C24 5 25 6 24 7 C23 6.5 22 6 22 6" fill="#22C55E"/>
            <path d="M20 8 C22 7 23 8 22 9 C21 8.5 20 8 20 8" fill="#22C55E"/>
            <path d="M18 10 C20 9 21 10 20 11 C19 10.5 18 10 18 10" fill="#22C55E"/>
            <path d="M16 12 C18 11 19 12 18 13 C17 12.5 16 12 16 12" fill="#22C55E"/>
            <path d="M21 5 C20 3 19 4 20 6 C20.5 5 21 5 21 5" fill="#4ADE80"/>
            <path d="M19 7 C18 5 17 6 18 8 C18.5 7 19 7 19 7" fill="#4ADE80"/>
            <path d="M17 9 C16 7 15 8 16 10 C16.5 9 17 9 17 9" fill="#4ADE80"/>
        </g>

        {/* Center upright fronds */}
        <g>
            <path d="M12 16 Q10 6 8 -2" stroke="#166534" strokeWidth="1.8" fill="none"/>
            <path d="M9 2 C8 1 7 2 8 3 C8.5 2.5 9 2 9 2" fill="#22C55E"/>
            <path d="M9.5 5 C8.5 4 7.5 5 8.5 6 C9 5.5 9.5 5 9.5 5" fill="#22C55E"/>
            <path d="M10 8 C9 7 8 8 9 9 C9.5 8.5 10 8 10 8" fill="#22C55E"/>
            <path d="M9 1 C10 -1 11 0 10 2 C9.5 1.5 9 1 9 1" fill="#4ADE80"/>
            <path d="M9.5 4 C10.5 2 11.5 3 10.5 5 C10 4.5 9.5 4 9.5 4" fill="#4ADE80"/>
        </g>
        <g>
            <path d="M12 16 Q14 6 16 -2" stroke="#166534" strokeWidth="1.8" fill="none"/>
            <path d="M15 2 C16 1 17 2 16 3 C15.5 2.5 15 2 15 2" fill="#22C55E"/>
            <path d="M14.5 5 C15.5 4 16.5 5 15.5 6 C15 5.5 14.5 5 14.5 5" fill="#22C55E"/>
            <path d="M14 8 C15 7 16 8 15 9 C14.5 8.5 14 8 14 8" fill="#22C55E"/>
            <path d="M15 1 C14 -1 13 0 14 2 C14.5 1.5 15 1 15 1" fill="#4ADE80"/>
            <path d="M14.5 4 C13.5 2 12.5 3 13.5 5 C14 4.5 14.5 4 14.5 4" fill="#4ADE80"/>
        </g>
        <g>
            <path d="M12 16 Q12 6 12 -4" stroke="#15803D" strokeWidth="2" fill="none"/>
            <path d="M12 0 C11 -1 10 0 11 1 C11.5 0.5 12 0 12 0" fill="#22C55E"/>
            <path d="M12 3 C11 2 10 3 11 4 C11.5 3.5 12 3 12 3" fill="#22C55E"/>
            <path d="M12 6 C11 5 10 6 11 7 C11.5 6.5 12 6 12 6" fill="#22C55E"/>
            <path d="M12 0 C13 -1 14 0 13 1 C12.5 0.5 12 0 12 0" fill="#4ADE80"/>
            <path d="M12 3 C13 2 14 3 13 4 C12.5 3.5 12 3 12 3" fill="#4ADE80"/>
            <path d="M12 6 C13 5 14 6 13 7 C12.5 6.5 12 6 12 6" fill="#4ADE80"/>
        </g>

        {/* Crown base - where fronds emerge */}
        <ellipse cx="12" cy="20" rx="4" ry="3" fill="#5D4037"/>
        <ellipse cx="12" cy="19.5" rx="3.5" ry="2.5" fill="#6D4C41"/>
        <ellipse cx="12" cy="19" rx="3" ry="2" fill="#8B7355"/>
    </g>
);

export const PALM_BOTTOM = (
    <g>
        {/* Shadow */}
        <ellipse cx="14" cy="23" rx="8" ry="2" fill="#000" opacity="0.25"/>

        {/* Trunk with textured bark - curved for realism */}
        <defs>
            <linearGradient id="palmTrunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5D4037"/>
                <stop offset="30%" stopColor="#8B7355"/>
                <stop offset="50%" stopColor="#A08060"/>
                <stop offset="70%" stopColor="#8B7355"/>
                <stop offset="100%" stopColor="#5D4037"/>
            </linearGradient>
        </defs>

        {/* Main trunk body */}
        <path d="M8 0 Q7 12 8 23 L16 23 Q17 12 16 0 Z" fill="url(#palmTrunkGradient)"/>

        {/* Trunk texture - horizontal bark rings (characteristic of palms) */}
        <g stroke="#6D4C41" fill="none">
            <path d="M8 3 Q12 4 16 3" strokeWidth="1.5"/>
            <path d="M7.5 6 Q12 7.5 16.5 6" strokeWidth="1.8"/>
            <path d="M7.3 9 Q12 11 16.7 9" strokeWidth="2"/>
            <path d="M7.2 12 Q12 14 16.8 12" strokeWidth="2.2"/>
            <path d="M7.3 15 Q12 17 16.7 15" strokeWidth="2"/>
            <path d="M7.5 18 Q12 19.5 16.5 18" strokeWidth="1.8"/>
            <path d="M8 21 Q12 22 16 21" strokeWidth="1.5"/>
        </g>

        {/* Bark texture - darker lines below each ring */}
        <g stroke="#4E342E" strokeWidth="0.5" opacity="0.6">
            <path d="M8 4 Q12 5 16 4"/>
            <path d="M7.5 7 Q12 8.5 16.5 7"/>
            <path d="M7.3 10 Q12 12 16.7 10"/>
            <path d="M7.2 13 Q12 15 16.8 13"/>
            <path d="M7.3 16 Q12 18 16.7 16"/>
            <path d="M7.5 19 Q12 20.5 16.5 19"/>
        </g>

        {/* Highlight on left side of trunk */}
        <path d="M9 2 Q8.5 12 9 22" stroke="#A08060" strokeWidth="1" opacity="0.4" fill="none"/>

        {/* Old frond bases (stubs) on upper trunk */}
        <g fill="#6D4C41">
            <path d="M7 1 Q6 0 7 -1 Q8 0 7 1"/>
            <path d="M17 1 Q18 0 17 -1 Q16 0 17 1"/>
            <path d="M6.5 4 Q5.5 3 6.5 2 Q7.5 3 6.5 4"/>
            <path d="M17.5 4 Q18.5 3 17.5 2 Q16.5 3 17.5 4"/>
        </g>

        {/* Trunk base flare */}
        <path d="M7 22 Q6 23 7 24 L17 24 Q18 23 17 22" fill="#5D4037"/>

        {/* Ground debris/mulch at base */}
        <ellipse cx="5" cy="23" rx="2" ry="0.8" fill="#4A3020" opacity="0.5"/>
        <ellipse cx="19" cy="23.2" rx="1.8" ry="0.7" fill="#4A3020" opacity="0.4"/>

        {/* Crown connection point (overlaps with top tile) */}
        <ellipse cx="12" cy="-1" rx="4" ry="2" fill="#5D4037"/>
        <ellipse cx="12" cy="-1.5" rx="3.5" ry="1.5" fill="#6D4C41"/>
    </g>
);

// ==========================================
// Generator functions for Grand Senegalese Hut (2x2)
// Procedurally generated with position-based randomization
// ==========================================

export const generateGrandHutNW = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(x * 17 + y * 31);

    return (
        <g>
            {/* Ground shadow - elliptical for round hut */}
            <ellipse cx="24" cy="46" rx="24" ry="8" fill="#000" opacity="0.2"/>

            {/* Circular mud wall base - curved perspective */}
            <ellipse cx="24" cy="38" rx="22" ry="12" fill="#A0785A"/>
            <ellipse cx="24" cy="36" rx="20" ry="11" fill="#B8956E"/>
            <ellipse cx="24" cy="34" rx="18" ry="10" fill="#C9A67A"/>

            {/* Wall decorative band */}
            <ellipse cx="24" cy="32" rx="19" ry="10" fill="none" stroke="#8B6914" strokeWidth="2" strokeDasharray="3,2"/>

            {/* Conical thatched roof - full solid cone */}
            <path d="M-2 28 Q24 -12 50 28 L24 28 Z" fill="#B8956B"/>
            <path d="M2 28 Q24 -8 46 28 L24 28 Z" fill="#C4A35A"/>
            <path d="M6 28 Q24 -4 42 28 L24 28 Z" fill="#D4B36A"/>

            {/* Thatch texture - radial lines from peak */}
            <line x1="24" y1="-2" x2="4" y2="26" stroke="#9A8040" strokeWidth="0.7" opacity="0.5"/>
            <line x1="24" y1="-2" x2="12" y2="26" stroke="#9A8040" strokeWidth="0.7" opacity="0.5"/>
            <line x1="24" y1="-2" x2="20" y2="26" stroke="#9A8040" strokeWidth="0.7" opacity="0.4"/>

            {/* Horizontal thatch bands */}
            <path d="M8 20 Q24 16 40 20" fill="none" stroke="#A08040" strokeWidth="1" opacity="0.4"/>
            <path d="M4 24 Q24 20 44 24" fill="none" stroke="#A08040" strokeWidth="1" opacity="0.4"/>

            {/* Roof peak ornament - clay pot finial */}
            <ellipse cx="24" cy="-4" rx="4" ry="3" fill="#6B4423"/>
            <ellipse cx="24" cy="-5" rx="3" ry="2" fill="#8B5A2B"/>
            <circle cx="24" cy="-6" r="1.5" fill="#5D3A1A"/>
        </g>
    );
};

export const generateGrandHutNE = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(x * 17 + y * 31);
    const hasGourd = hash % 3 !== 0;
    const hasShield = hash % 4 === 0;

    return (
        <g>
            {/* Right portion of circular wall */}
            <ellipse cx="0" cy="38" rx="22" ry="12" fill="#A0785A"/>
            <ellipse cx="0" cy="36" rx="20" ry="11" fill="#B8956E"/>
            <ellipse cx="0" cy="34" rx="18" ry="10" fill="#C9A67A"/>

            {/* Wall decorative band continuation */}
            <ellipse cx="0" cy="32" rx="19" ry="10" fill="none" stroke="#8B6914" strokeWidth="2" strokeDasharray="3,2"/>

            {/* Right side of conical roof - SOLID FILL */}
            <path d="M-26 28 Q0 -12 26 28 L0 28 Z" fill="#B8956B"/>
            <path d="M-22 28 Q0 -8 22 28 L0 28 Z" fill="#C4A35A"/>
            <path d="M-18 28 Q0 -4 18 28 L0 28 Z" fill="#D4B36A"/>

            {/* Thatch texture - right side */}
            <line x1="0" y1="-2" x2="20" y2="26" stroke="#9A8040" strokeWidth="0.7" opacity="0.5"/>
            <line x1="0" y1="-2" x2="12" y2="26" stroke="#9A8040" strokeWidth="0.7" opacity="0.5"/>
            <line x1="0" y1="-2" x2="4" y2="26" stroke="#9A8040" strokeWidth="0.7" opacity="0.4"/>

            {/* Horizontal thatch bands */}
            <path d="M-16 20 Q0 16 16 20" fill="none" stroke="#A08040" strokeWidth="1" opacity="0.4"/>
            <path d="M-20 24 Q0 20 20 24" fill="none" stroke="#A08040" strokeWidth="1" opacity="0.4"/>

            {/* Optional hanging gourd */}
            {hasGourd && (
                <g>
                    <line x1="14" y1="26" x2="14" y2="22" stroke="#5D3A1A" strokeWidth="1"/>
                    <ellipse cx="14" cy="29" rx="2.5" ry="3.5" fill="#B8860B"/>
                    <ellipse cx="14" cy="28" rx="2" ry="2" fill="#D4A84B"/>
                </g>
            )}

            {/* Optional decorative shield */}
            {hasShield && (
                <g>
                    <ellipse cx="18" cy="34" rx="3" ry="4" fill="#8B4513"/>
                    <ellipse cx="18" cy="34" rx="2" ry="3" fill="#A0522D"/>
                    <line x1="18" y1="31" x2="18" y2="37" stroke="#5D3A1A" strokeWidth="0.5"/>
                </g>
            )}
        </g>
    );
};

export const generateGrandHutSW = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(x * 17 + y * 31);
    const hasPot = hash % 2 === 0;
    const hasMat = hash % 3 !== 2;
    const matColor = ['#C4A35A', '#B89A4A', '#D4B06A'][hash % 3];

    return (
        <g>
            {/* Lower left portion of circular wall */}
            <path d="M24 0 L24 14 Q10 16 4 10 L4 0 Z" fill="#B8956E"/>
            <path d="M22 0 L22 12 Q12 14 6 8 L6 0 Z" fill="#C9A67A"/>

            {/* Wall pattern band */}
            <path d="M6 4 Q14 6 22 4" fill="none" stroke="#8B6914" strokeWidth="1.5" strokeDasharray="2,2"/>

            {/* Ground items - procedural */}
            {hasPot && (
                <g>
                    <ellipse cx="8" cy="20" rx="4" ry="2.5" fill="#6B4423"/>
                    <ellipse cx="8" cy="18" rx="3.5" ry="3" fill="#8B5A2B"/>
                    <ellipse cx="8" cy="16" rx="2.5" ry="1.5" fill="#5D3A1A"/>
                </g>
            )}

            {hasMat && (
                <g>
                    <ellipse cx="16" cy="18" rx="6" ry="4" fill={matColor}/>
                    <ellipse cx="16" cy="18" rx="4" ry="2.5" fill="none" stroke="#8B7040" strokeWidth="0.5"/>
                    <ellipse cx="16" cy="18" rx="2" ry="1.2" fill="none" stroke="#8B7040" strokeWidth="0.5"/>
                </g>
            )}

            {/* Wooden post base */}
            <rect x="1" y="0" width="3" height="14" fill="#5D3A1A"/>
            <rect x="2" y="0" width="2" height="14" fill="#6B4423"/>
        </g>
    );
};

export const generateGrandHutSE = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(x * 17 + y * 31);
    const hasStool = hash % 2 === 0;
    const hasMortar = hash % 3 !== 0;
    const hasBasket = hash % 4 === 1;

    return (
        <g>
            {/* Lower right wall with doorway */}
            <path d="M0 0 L0 14 Q4 16 8 14 L8 0 Z" fill="#B8956E"/>
            <path d="M2 0 L2 12 Q5 14 8 12 L8 0 Z" fill="#C9A67A"/>

            <path d="M16 0 L16 14 Q20 16 24 10 L24 0 Z" fill="#B8956E"/>
            <path d="M16 0 L16 12 Q19 14 22 8 L22 0 Z" fill="#C9A67A"/>

            {/* Doorway - dark interior with arch */}
            <path d="M8 0 L8 12 Q12 14 16 12 L16 0 Z" fill="#1A0F0A"/>
            <path d="M9 0 L9 11 Q12 13 15 11 L15 0 Z" fill="#0D0705"/>

            {/* Beaded/cloth door hanging */}
            <line x1="10" y1="0" x2="10" y2="10" stroke="#D4AF37" strokeWidth="0.7" strokeDasharray="1.5,2"/>
            <line x1="12" y1="0" x2="12" y2="11" stroke="#CD853F" strokeWidth="0.7" strokeDasharray="1.5,2"/>
            <line x1="14" y1="0" x2="14" y2="10" stroke="#D4AF37" strokeWidth="0.7" strokeDasharray="1.5,2"/>

            {/* Threshold */}
            <ellipse cx="12" cy="13" rx="5" ry="1.5" fill="#6B5A4A"/>

            {/* Optional stool */}
            {hasStool && (
                <g>
                    <ellipse cx="20" cy="20" rx="3" ry="1.5" fill="#6B4423"/>
                    <rect x="18" y="17" width="4" height="3" fill="#5D3A1A"/>
                    <ellipse cx="20" cy="17" rx="2.5" ry="1" fill="#7B5433"/>
                </g>
            )}

            {/* Optional mortar and pestle */}
            {hasMortar && (
                <g>
                    <ellipse cx="4" cy="20" rx="3" ry="2" fill="#5D3A1A"/>
                    <ellipse cx="4" cy="19" rx="2" ry="1.2" fill="#4A3020"/>
                    <rect x="3" y="14" width="1.5" height="5" fill="#6B4423" transform="rotate(-10 4 17)"/>
                </g>
            )}

            {/* Optional basket */}
            {hasBasket && (
                <g>
                    <ellipse cx="20" cy="10" rx="2.5" ry="3" fill="#C4A35A"/>
                    <ellipse cx="20" cy="8" rx="2" ry="1" fill="#B8956E"/>
                    <path d="M18 9 Q20 11 22 9" fill="none" stroke="#8B7040" strokeWidth="0.5"/>
                </g>
            )}
        </g>
    );
};

// Beaux-Arts Fountain Components - Enhanced with realistic water effects
export const FOUNTAIN_GRAPHICS: Record<string, JSX.Element> = {
    // Basin North Edge («) - Ornate stone rim with water lapping
    FOUNTAIN_BASIN_N: (
        <g>
            {/* Deep water with gradient effect */}
            <rect x="0" y="8" width="24" height="16" fill="#2E8B9A"/>
            <rect x="0" y="8" width="24" height="12" fill="#3BA7B8" opacity="0.8"/>
            <rect x="0" y="8" width="24" height="6" fill="#5DC1D0" opacity="0.5"/>
            {/* Ornate stone rim with molding */}
            <rect x="0" y="3" width="24" height="7" fill="#A89F91"/>
            <rect x="0" y="1" width="24" height="3" fill="#C4B9A9"/>
            <rect x="0" y="0" width="24" height="2" fill="#D8CFC1"/>
            {/* Decorative dentil molding */}
            {[0, 4, 8, 12, 16, 20].map((x, i) => (
                <rect key={i} x={x + 1} y="4" width="2" height="2" fill="#B8AD9D"/>
            ))}
            {/* Water line highlight */}
            <path d="M0 8 L24 8" stroke="#7DD3E1" strokeWidth="1" opacity="0.6"/>
            {/* Animated gentle waves lapping at edge */}
            <path d="M0 10 Q4 9 8 10 Q12 11 16 10 Q20 9 24 10" stroke="#7DD3E1" fill="none" strokeWidth="1.5" opacity="0.7">
                <animate attributeName="d"
                    values="M0 10 Q4 9 8 10 Q12 11 16 10 Q20 9 24 10;M0 10 Q4 11 8 10 Q12 9 16 10 Q20 11 24 10;M0 10 Q4 9 8 10 Q12 11 16 10 Q20 9 24 10"
                    dur="2.5s" repeatCount="indefinite"/>
            </path>
            {/* Surface shimmer */}
            <ellipse cx="6" cy="14" rx="3" ry="1" fill="#fff" opacity="0.25">
                <animate attributeName="opacity" values="0.25;0.4;0.25" dur="3s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="18" cy="16" rx="2" ry="0.8" fill="#fff" opacity="0.2">
                <animate attributeName="opacity" values="0.2;0.35;0.2" dur="2.5s" repeatCount="indefinite" begin="1s"/>
            </ellipse>
        </g>
    ),
    // Basin South Edge (») - South rim with shadow and reflection
    FOUNTAIN_BASIN_S: (
        <g>
            {/* Deep water */}
            <rect x="0" y="0" width="24" height="12" fill="#2E8B9A"/>
            <rect x="0" y="0" width="24" height="8" fill="#3BA7B8" opacity="0.8"/>
            <rect x="0" y="0" width="24" height="4" fill="#5DC1D0" opacity="0.5"/>
            {/* Ornate stone rim */}
            <rect x="0" y="10" width="24" height="4" fill="#C4B9A9"/>
            <rect x="0" y="14" width="24" height="4" fill="#B8AD9D"/>
            <rect x="0" y="18" width="24" height="4" fill="#A89F91"/>
            <rect x="0" y="22" width="24" height="2" fill="#8B8178"/>
            {/* Decorative medallions on front */}
            <ellipse cx="6" cy="16" rx="2.5" ry="2" fill="#C4B9A9" stroke="#A89F91" strokeWidth="0.5"/>
            <ellipse cx="18" cy="16" rx="2.5" ry="2" fill="#C4B9A9" stroke="#A89F91" strokeWidth="0.5"/>
            <circle cx="6" cy="16" r="1" fill="#D8CFC1"/>
            <circle cx="18" cy="16" r="1" fill="#D8CFC1"/>
            {/* Ground shadow */}
            <rect x="1" y="22" width="22" height="2" fill="#000" opacity="0.2"/>
            {/* Water reflection on rim */}
            <path d="M2 11 Q6 10.5 10 11" stroke="#7DD3E1" fill="none" strokeWidth="0.5" opacity="0.4"/>
            <path d="M14 11 Q18 10.5 22 11" stroke="#7DD3E1" fill="none" strokeWidth="0.5" opacity="0.4"/>
        </g>
    ),
    // Basin East Edge (≥) - Side view with water depth
    FOUNTAIN_BASIN_E: (
        <g>
            {/* Deep water with visible depth */}
            <rect x="0" y="0" width="14" height="24" fill="#2E8B9A"/>
            <rect x="0" y="0" width="12" height="24" fill="#3BA7B8" opacity="0.7"/>
            <rect x="0" y="0" width="8" height="24" fill="#4DBDCC" opacity="0.5"/>
            {/* Ornate stone rim */}
            <rect x="14" y="0" width="4" fill="#C4B9A9" height="24"/>
            <rect x="18" y="0" width="4" height="24" fill="#B8AD9D"/>
            <rect x="22" y="0" width="2" height="24" fill="#A89F91"/>
            {/* Vertical decorative groove */}
            <rect x="16" y="2" width="1" height="20" fill="#A89F91"/>
            <rect x="19" y="2" width="0.5" height="20" fill="#D8CFC1" opacity="0.5"/>
            {/* Animated vertical ripples */}
            <path d="M6 2 Q8 6 6 10 Q4 14 6 18 Q8 22 6 24" stroke="#7DD3E1" fill="none" strokeWidth="1" opacity="0.5">
                <animate attributeName="d"
                    values="M6 2 Q8 6 6 10 Q4 14 6 18 Q8 22 6 24;M6 2 Q4 6 6 10 Q8 14 6 18 Q4 22 6 24;M6 2 Q8 6 6 10 Q4 14 6 18 Q8 22 6 24"
                    dur="3s" repeatCount="indefinite"/>
            </path>
            {/* Surface highlights */}
            <ellipse cx="4" cy="8" rx="2" ry="1.5" fill="#fff" opacity="0.2">
                <animate attributeName="cx" values="4;6;4" dur="4s" repeatCount="indefinite"/>
            </ellipse>
        </g>
    ),
    // Basin West Edge (≤) - West side rim
    FOUNTAIN_BASIN_W: (
        <g>
            {/* Ornate stone rim */}
            <rect x="0" y="0" width="2" height="24" fill="#A89F91"/>
            <rect x="2" y="0" width="4" height="24" fill="#B8AD9D"/>
            <rect x="6" y="0" width="4" height="24" fill="#C4B9A9"/>
            {/* Vertical decorative groove */}
            <rect x="4" y="2" width="0.5" height="20" fill="#D8CFC1" opacity="0.5"/>
            <rect x="7" y="2" width="1" height="20" fill="#A89F91"/>
            {/* Deep water with visible depth */}
            <rect x="10" y="0" width="14" height="24" fill="#2E8B9A"/>
            <rect x="12" y="0" width="12" height="24" fill="#3BA7B8" opacity="0.7"/>
            <rect x="16" y="0" width="8" height="24" fill="#4DBDCC" opacity="0.5"/>
            {/* Animated vertical ripples */}
            <path d="M18 2 Q16 6 18 10 Q20 14 18 18 Q16 22 18 24" stroke="#7DD3E1" fill="none" strokeWidth="1" opacity="0.5">
                <animate attributeName="d"
                    values="M18 2 Q16 6 18 10 Q20 14 18 18 Q16 22 18 24;M18 2 Q20 6 18 10 Q16 14 18 18 Q20 22 18 24;M18 2 Q16 6 18 10 Q20 14 18 18 Q16 22 18 24"
                    dur="2.8s" repeatCount="indefinite"/>
            </path>
            {/* Surface highlights */}
            <ellipse cx="20" cy="16" rx="2" ry="1.5" fill="#fff" opacity="0.2">
                <animate attributeName="cx" values="20;18;20" dur="3.5s" repeatCount="indefinite"/>
            </ellipse>
        </g>
    ),
    // Basin Corner NW (╔) - Corner with decorative finial
    FOUNTAIN_BASIN_NW: (
        <g>
            {/* Stone corner base */}
            <rect x="0" y="0" width="12" height="12" fill="#B8AD9D"/>
            <rect x="0" y="0" width="10" height="10" fill="#C4B9A9"/>
            {/* Water area */}
            <rect x="10" y="10" width="14" height="14" fill="#2E8B9A"/>
            <rect x="10" y="10" width="14" height="14" fill="#3BA7B8" opacity="0.7"/>
            {/* Corner edge stones */}
            <rect x="10" y="0" width="14" height="10" fill="#B8AD9D"/>
            <rect x="0" y="10" width="10" height="14" fill="#B8AD9D"/>
            {/* Decorative corner finial/urn */}
            <ellipse cx="5" cy="8" rx="3" ry="2" fill="#D8CFC1"/>
            <rect x="3" y="3" width="4" height="5" fill="#C4B9A9"/>
            <ellipse cx="5" cy="3" rx="2.5" ry="1.5" fill="#D8CFC1"/>
            <circle cx="5" cy="2" r="1" fill="#E8E0D4"/>
            {/* Inner edge line */}
            <path d="M10 0 L10 10 L24 10" stroke="#A89F91" fill="none" strokeWidth="1.5"/>
            {/* Water touching corner */}
            <path d="M12 12 Q14 14 12 16" stroke="#7DD3E1" fill="none" strokeWidth="0.8" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite"/>
            </path>
        </g>
    ),
    // Basin Corner NE (╗) - Northeast corner
    FOUNTAIN_BASIN_NE: (
        <g>
            {/* Stone corner base */}
            <rect x="12" y="0" width="12" height="12" fill="#B8AD9D"/>
            <rect x="14" y="0" width="10" height="10" fill="#C4B9A9"/>
            {/* Water area */}
            <rect x="0" y="10" width="14" height="14" fill="#2E8B9A"/>
            <rect x="0" y="10" width="14" height="14" fill="#3BA7B8" opacity="0.7"/>
            {/* Corner edge stones */}
            <rect x="0" y="0" width="14" height="10" fill="#B8AD9D"/>
            <rect x="14" y="10" width="10" height="14" fill="#B8AD9D"/>
            {/* Decorative corner finial/urn */}
            <ellipse cx="19" cy="8" rx="3" ry="2" fill="#D8CFC1"/>
            <rect x="17" y="3" width="4" height="5" fill="#C4B9A9"/>
            <ellipse cx="19" cy="3" rx="2.5" ry="1.5" fill="#D8CFC1"/>
            <circle cx="19" cy="2" r="1" fill="#E8E0D4"/>
            {/* Inner edge line */}
            <path d="M0 10 L14 10 L14 0" stroke="#A89F91" fill="none" strokeWidth="1.5"/>
            {/* Water touching corner */}
            <path d="M12 12 Q10 14 12 16" stroke="#7DD3E1" fill="none" strokeWidth="0.8" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2.2s" repeatCount="indefinite"/>
            </path>
        </g>
    ),
    // Basin Corner SW (╚) - Southwest corner with shadow
    FOUNTAIN_BASIN_SW: (
        <g>
            {/* Water area */}
            <rect x="10" y="0" width="14" height="14" fill="#2E8B9A"/>
            <rect x="10" y="0" width="14" height="14" fill="#3BA7B8" opacity="0.7"/>
            {/* Stone corners */}
            <rect x="0" y="0" width="10" height="24" fill="#B8AD9D"/>
            <rect x="0" y="14" width="24" height="10" fill="#B8AD9D"/>
            <rect x="0" y="14" width="10" height="10" fill="#C4B9A9"/>
            {/* Decorative corner finial */}
            <ellipse cx="5" cy="17" rx="3" ry="2" fill="#D8CFC1"/>
            <rect x="3" y="18" width="4" height="4" fill="#C4B9A9"/>
            <ellipse cx="5" cy="22" rx="2.5" ry="1.5" fill="#A89F91"/>
            {/* Ground shadow */}
            <rect x="1" y="22" width="22" height="2" fill="#000" opacity="0.15"/>
            {/* Inner edge */}
            <path d="M10 0 L10 14 L24 14" stroke="#A89F91" fill="none" strokeWidth="1.5"/>
        </g>
    ),
    // Basin Corner SE (╝) - Southeast corner with shadow
    FOUNTAIN_BASIN_SE: (
        <g>
            {/* Water area */}
            <rect x="0" y="0" width="14" height="14" fill="#2E8B9A"/>
            <rect x="0" y="0" width="14" height="14" fill="#3BA7B8" opacity="0.7"/>
            {/* Stone corners */}
            <rect x="14" y="0" width="10" height="24" fill="#B8AD9D"/>
            <rect x="0" y="14" width="24" height="10" fill="#B8AD9D"/>
            <rect x="14" y="14" width="10" height="10" fill="#C4B9A9"/>
            {/* Decorative corner finial */}
            <ellipse cx="19" cy="17" rx="3" ry="2" fill="#D8CFC1"/>
            <rect x="17" y="18" width="4" height="4" fill="#C4B9A9"/>
            <ellipse cx="19" cy="22" rx="2.5" ry="1.5" fill="#A89F91"/>
            {/* Ground shadow */}
            <rect x="1" y="22" width="22" height="2" fill="#000" opacity="0.15"/>
            {/* Inner edge */}
            <path d="M0 14 L14 14 L14 0" stroke="#A89F91" fill="none" strokeWidth="1.5"/>
        </g>
    ),
    // Fountain Water Surface (≈) - Animated rippling water with realistic reflections
    FOUNTAIN_WATER: (
        <g>
            {/* Deep blue-green water base */}
            <rect x="0" y="0" width="24" height="24" fill="#2E8B9A"/>
            {/* Lighter water layer */}
            <rect x="0" y="0" width="24" height="24" fill="#3BA7B8" opacity="0.6"/>
            {/* Surface light layer */}
            <rect x="0" y="0" width="24" height="24" fill="#5DC1D0" opacity="0.3"/>

            {/* Concentric ripple rings - first set */}
            <circle cx="12" cy="12" r="3" fill="none" stroke="#7DD3E1" strokeWidth="1" opacity="0.7">
                <animate attributeName="r" values="3;11;3" dur="4s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.7;0;0.7" dur="4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="12" cy="12" r="6" fill="none" stroke="#8AE1EF" strokeWidth="0.8" opacity="0.5">
                <animate attributeName="r" values="6;12;6" dur="4s" repeatCount="indefinite" begin="1s"/>
                <animate attributeName="opacity" values="0.5;0;0.5" dur="4s" repeatCount="indefinite" begin="1s"/>
            </circle>
            <circle cx="12" cy="12" r="9" fill="none" stroke="#A5EBF5" strokeWidth="0.5" opacity="0.3">
                <animate attributeName="r" values="9;13;9" dur="4s" repeatCount="indefinite" begin="2s"/>
                <animate attributeName="opacity" values="0.3;0;0.3" dur="4s" repeatCount="indefinite" begin="2s"/>
            </circle>

            {/* Gentle surface waves */}
            <path d="M0 8 Q6 6 12 8 Q18 10 24 8" stroke="#7DD3E1" fill="none" strokeWidth="0.8" opacity="0.4">
                <animate attributeName="d"
                    values="M0 8 Q6 6 12 8 Q18 10 24 8;M0 8 Q6 10 12 8 Q18 6 24 8;M0 8 Q6 6 12 8 Q18 10 24 8"
                    dur="3s" repeatCount="indefinite"/>
            </path>
            <path d="M0 16 Q6 18 12 16 Q18 14 24 16" stroke="#7DD3E1" fill="none" strokeWidth="0.8" opacity="0.4">
                <animate attributeName="d"
                    values="M0 16 Q6 18 12 16 Q18 14 24 16;M0 16 Q6 14 12 16 Q18 18 24 16;M0 16 Q6 18 12 16 Q18 14 24 16"
                    dur="2.7s" repeatCount="indefinite"/>
            </path>

            {/* Sparkle/sunlight reflections */}
            <ellipse cx="6" cy="6" rx="2.5" ry="1" fill="#fff" opacity="0.35">
                <animate attributeName="opacity" values="0.35;0.55;0.35" dur="2.5s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="18" cy="10" rx="2" ry="0.8" fill="#fff" opacity="0.25">
                <animate attributeName="opacity" values="0.25;0.45;0.25" dur="3s" repeatCount="indefinite" begin="0.5s"/>
            </ellipse>
            <ellipse cx="8" cy="18" rx="1.5" ry="0.6" fill="#fff" opacity="0.2">
                <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2.8s" repeatCount="indefinite" begin="1s"/>
            </ellipse>
            <ellipse cx="16" cy="20" rx="2" ry="0.8" fill="#fff" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.5;0.3" dur="3.2s" repeatCount="indefinite" begin="1.5s"/>
            </ellipse>
        </g>
    ),
    // Fountain Spout/Jet (⌂) - Dramatic water jet with spray and mist
    FOUNTAIN_SPOUT: (
        <g>
            {/* Water base */}
            <rect x="0" y="0" width="24" height="24" fill="#2E8B9A"/>
            <rect x="0" y="0" width="24" height="24" fill="#3BA7B8" opacity="0.6"/>

            {/* Central pedestal/nozzle base */}
            <ellipse cx="12" cy="20" rx="5" ry="2.5" fill="#A89F91"/>
            <ellipse cx="12" cy="19" rx="4" ry="2" fill="#B8AD9D"/>
            <rect x="9" y="14" width="6" height="6" fill="#B8AD9D"/>
            <ellipse cx="12" cy="14" rx="3" ry="1.5" fill="#C4B9A9"/>
            <circle cx="12" cy="14" r="1.5" fill="#D8CFC1"/>

            {/* Main water jet - central column */}
            <path d="M12 14 Q11 8 12 1 Q13 8 12 14" fill="#7DD3E1" opacity="0.9">
                <animate attributeName="d"
                    values="M12 14 Q11 8 12 1 Q13 8 12 14;M12 14 Q11 6 12 0 Q13 6 12 14;M12 14 Q11 8 12 1 Q13 8 12 14"
                    dur="0.8s" repeatCount="indefinite"/>
            </path>
            {/* Jet highlight */}
            <path d="M12 14 Q11.5 9 12 3" stroke="#B3E5FC" fill="none" strokeWidth="1.5" opacity="0.7">
                <animate attributeName="d"
                    values="M12 14 Q11.5 9 12 3;M12 14 Q11.5 7 12 1;M12 14 Q11.5 9 12 3"
                    dur="0.8s" repeatCount="indefinite"/>
            </path>

            {/* Spray mist at top */}
            <ellipse cx="12" cy="2" rx="5" ry="2" fill="#B3E5FC" opacity="0.4">
                <animate attributeName="rx" values="5;7;5" dur="1s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.4;0.2;0.4" dur="1s" repeatCount="indefinite"/>
            </ellipse>

            {/* Falling water droplets - left side */}
            <circle cx="7" cy="4" r="0.8" fill="#7DD3E1" opacity="0.8">
                <animate attributeName="cy" values="4;18;4" dur="1.2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="8" cy="6" r="0.6" fill="#7DD3E1" opacity="0.7">
                <animate attributeName="cy" values="6;20;6" dur="1s" repeatCount="indefinite" begin="0.2s"/>
                <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1s" repeatCount="indefinite" begin="0.2s"/>
            </circle>
            <circle cx="6" cy="8" r="0.5" fill="#81D4FA" opacity="0.6">
                <animate attributeName="cy" values="8;22;8" dur="1.1s" repeatCount="indefinite" begin="0.4s"/>
            </circle>

            {/* Falling water droplets - right side */}
            <circle cx="17" cy="5" r="0.8" fill="#7DD3E1" opacity="0.8">
                <animate attributeName="cy" values="5;19;5" dur="1.1s" repeatCount="indefinite" begin="0.1s"/>
                <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.1s" repeatCount="indefinite" begin="0.1s"/>
            </circle>
            <circle cx="16" cy="7" r="0.6" fill="#7DD3E1" opacity="0.7">
                <animate attributeName="cy" values="7;21;7" dur="0.9s" repeatCount="indefinite" begin="0.3s"/>
            </circle>
            <circle cx="18" cy="9" r="0.5" fill="#81D4FA" opacity="0.6">
                <animate attributeName="cy" values="9;23;9" dur="1.15s" repeatCount="indefinite" begin="0.5s"/>
            </circle>

            {/* Splash ripples around base */}
            <ellipse cx="12" cy="20" rx="6" ry="1" fill="none" stroke="#7DD3E1" strokeWidth="0.5" opacity="0.5">
                <animate attributeName="rx" values="6;10;6" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite"/>
            </ellipse>
        </g>
    ),
    // Water Jet (↑) - Vertical water spout for Grand Bassin
    FOUNTAIN_JET: (
        <g>
            {/* Water base/pool */}
            <rect x="0" y="0" width="24" height="24" fill="#2E8B9A"/>
            <rect x="0" y="0" width="24" height="24" fill="#3BA7B8" opacity="0.6"/>
            {/* Stone jet base */}
            <ellipse cx="12" cy="20" rx="4" ry="2" fill="#A89F91"/>
            <ellipse cx="12" cy="19" rx="3" ry="1.5" fill="#B8AD9D"/>
            <rect x="10" y="16" width="4" height="4" fill="#B8AD9D"/>
            <circle cx="12" cy="16" r="2" fill="#C4B9A9"/>
            {/* Main vertical jet */}
            <path d="M12 16 Q11 8 12 -8 Q13 8 12 16" fill="#7DD3E1" opacity="0.85">
                <animate attributeName="d"
                    values="M12 16 Q11 8 12 -8 Q13 8 12 16;M12 16 Q11 6 12 -10 Q13 6 12 16;M12 16 Q11 8 12 -8 Q13 8 12 16"
                    dur="0.7s" repeatCount="indefinite"/>
            </path>
            {/* Jet highlight/center */}
            <path d="M12 16 Q11.5 10 12 0" stroke="#B3E5FC" fill="none" strokeWidth="2" opacity="0.6">
                <animate attributeName="d"
                    values="M12 16 Q11.5 10 12 0;M12 16 Q11.5 8 12 -4;M12 16 Q11.5 10 12 0"
                    dur="0.7s" repeatCount="indefinite"/>
            </path>
            {/* Spray mist at peak */}
            <ellipse cx="12" cy="-6" rx="4" ry="2" fill="#B3E5FC" opacity="0.35">
                <animate attributeName="rx" values="4;6;4" dur="0.9s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.35;0.2;0.35" dur="0.9s" repeatCount="indefinite"/>
            </ellipse>
            {/* Falling droplets */}
            <circle cx="8" cy="6" r="0.7" fill="#7DD3E1" opacity="0.7">
                <animate attributeName="cy" values="6;18;6" dur="1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="16" cy="8" r="0.6" fill="#7DD3E1" opacity="0.6">
                <animate attributeName="cy" values="8;20;8" dur="0.9s" repeatCount="indefinite" begin="0.3s"/>
            </circle>
            {/* Splash ripples */}
            <ellipse cx="12" cy="21" rx="5" ry="1" fill="none" stroke="#7DD3E1" strokeWidth="0.5" opacity="0.5">
                <animate attributeName="rx" values="5;9;5" dur="1.3s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.5;0;0.5" dur="1.3s" repeatCount="indefinite"/>
            </ellipse>
        </g>
    ),
    // Bronze Nymph sculpture (♀) - Classical female figure for fountain
    STATUE_NYMPH: (
        <g>
            {/* Water base */}
            <rect x="0" y="0" width="24" height="24" fill="#2E8B9A"/>
            <rect x="0" y="0" width="24" height="24" fill="#3BA7B8" opacity="0.5"/>
            {/* Stone pedestal */}
            <ellipse cx="12" cy="21" rx="5" ry="2" fill="#A89F91"/>
            <rect x="8" y="17" width="8" height="4" fill="#B8AD9D"/>
            <ellipse cx="12" cy="17" rx="4" ry="1.5" fill="#C4B9A9"/>
            {/* Bronze figure - graceful female form */}
            <ellipse cx="12" cy="12" rx="3" ry="5" fill="#8B6914"/>
            <ellipse cx="12" cy="11" rx="2.5" ry="4" fill="#A67C00"/>
            {/* Head */}
            <circle cx="12" cy="5" r="2.5" fill="#8B6914"/>
            <circle cx="12" cy="4.5" r="2" fill="#A67C00"/>
            {/* Hair flowing back */}
            <path d="M10 4 Q8 2 9 0 Q11 1 12 0 Q13 1 15 0 Q16 2 14 4" fill="#7A5C00"/>
            {/* Graceful raised arms */}
            <path d="M9 10 Q6 8 4 5" stroke="#8B6914" strokeWidth="1.5" fill="none"/>
            <path d="M15 10 Q18 8 20 5" stroke="#8B6914" strokeWidth="1.5" fill="none"/>
            {/* Hands holding shell */}
            <ellipse cx="12" cy="2" rx="4" ry="2" fill="#C4B9A9"/>
            <path d="M8 2 Q10 0 12 2 Q14 0 16 2" fill="#D8CFC1"/>
            {/* Water pouring from shell */}
            <path d="M10 4 Q9 8 10 14" stroke="#7DD3E1" fill="none" strokeWidth="0.8" opacity="0.7">
                <animate attributeName="d" values="M10 4 Q9 8 10 14;M10 4 Q11 8 10 14;M10 4 Q9 8 10 14" dur="0.6s" repeatCount="indefinite"/>
            </path>
            <path d="M14 4 Q15 8 14 14" stroke="#7DD3E1" fill="none" strokeWidth="0.8" opacity="0.7">
                <animate attributeName="d" values="M14 4 Q15 8 14 14;M14 4 Q13 8 14 14;M14 4 Q15 8 14 14" dur="0.65s" repeatCount="indefinite"/>
            </path>
            {/* Bronze highlights */}
            <ellipse cx="11" cy="10" rx="0.8" ry="1.5" fill="#DAA520" opacity="0.4"/>
            {/* Surface sparkle */}
            <ellipse cx="5" cy="20" rx="1.5" ry="0.5" fill="#fff" opacity="0.25">
                <animate attributeName="opacity" values="0.25;0.4;0.25" dur="2s" repeatCount="indefinite"/>
            </ellipse>
        </g>
    ),
    // Bronze Seahorse sculpture (♆) - Mythical hippocampus
    STATUE_SEAHORSE: (
        <g>
            {/* Water base */}
            <rect x="0" y="0" width="24" height="24" fill="#2E8B9A"/>
            <rect x="0" y="0" width="24" height="24" fill="#3BA7B8" opacity="0.5"/>
            {/* Stone pedestal */}
            <ellipse cx="12" cy="21" rx="5" ry="2" fill="#A89F91"/>
            <rect x="8" y="17" width="8" height="4" fill="#B8AD9D"/>
            <ellipse cx="12" cy="17" rx="4" ry="1.5" fill="#C4B9A9"/>
            {/* Bronze seahorse body - curled tail */}
            <path d="M12 17 Q8 14 9 10 Q10 6 14 4 Q18 6 17 10 Q16 12 14 13 Q12 14 10 16"
                  fill="#8B6914" stroke="#7A5C00" strokeWidth="0.5"/>
            {/* Inner body highlight */}
            <path d="M11 15 Q9 12 10 9 Q11 6 14 5" fill="#A67C00" opacity="0.8"/>
            {/* Head with snout */}
            <ellipse cx="15" cy="4" rx="2.5" ry="2" fill="#8B6914"/>
            <path d="M17 4 L20 3 L20 4 L17 5" fill="#A67C00"/>
            {/* Eye */}
            <circle cx="14.5" cy="3.5" r="0.5" fill="#4A3000"/>
            {/* Dorsal fin */}
            <path d="M10 8 Q8 6 9 4 Q10 5 11 5 Q12 6 11 8" fill="#7A5C00"/>
            {/* Curled tail at base */}
            <path d="M10 16 Q7 18 8 20 Q10 19 11 17" fill="#8B6914"/>
            {/* Water spray from mouth */}
            <path d="M20 3.5 Q22 2 24 2" stroke="#7DD3E1" fill="none" strokeWidth="1" opacity="0.7">
                <animate attributeName="d"
                    values="M20 3.5 Q22 2 24 2;M20 3.5 Q22 1 24 0;M20 3.5 Q22 2 24 2"
                    dur="0.8s" repeatCount="indefinite"/>
            </path>
            {/* Bronze highlights */}
            <ellipse cx="13" cy="8" rx="0.8" ry="1.2" fill="#DAA520" opacity="0.4"/>
            {/* Surface sparkle */}
            <ellipse cx="6" cy="19" rx="1.5" ry="0.5" fill="#fff" opacity="0.2">
                <animate attributeName="opacity" values="0.2;0.35;0.2" dur="2.2s" repeatCount="indefinite"/>
            </ellipse>
        </g>
    ),
    // Allegorical Figure sculpture (♁) - Classical representation of virtue/concept
    STATUE_ALLEGORY: (
        <g>
            {/* Water base */}
            <rect x="0" y="0" width="24" height="24" fill="#2E8B9A"/>
            <rect x="0" y="0" width="24" height="24" fill="#3BA7B8" opacity="0.5"/>
            {/* Larger stone pedestal */}
            <ellipse cx="12" cy="22" rx="6" ry="2.5" fill="#A89F91"/>
            <rect x="6" y="16" width="12" height="6" fill="#B8AD9D"/>
            <ellipse cx="12" cy="16" rx="6" ry="2" fill="#C4B9A9"/>
            <rect x="8" y="12" width="8" height="5" fill="#C4B9A9"/>
            <ellipse cx="12" cy="12" rx="4" ry="1.5" fill="#D8CFC1"/>
            {/* Bronze figure - standing classical form */}
            <ellipse cx="12" cy="6" rx="3.5" ry="6" fill="#8B6914"/>
            <ellipse cx="12" cy="5" rx="3" ry="5" fill="#A67C00"/>
            {/* Head */}
            <circle cx="12" cy="-2" r="2.5" fill="#8B6914"/>
            <circle cx="12" cy="-2.5" r="2" fill="#A67C00"/>
            {/* Crown/wreath on head */}
            <path d="M9 -4 Q10 -6 12 -5 Q14 -6 15 -4" fill="#7A5C00"/>
            <circle cx="12" cy="-5" r="0.8" fill="#DAA520"/>
            {/* Arm holding torch/scepter */}
            <path d="M15 4 Q18 2 20 -4" stroke="#8B6914" strokeWidth="1.8" fill="none"/>
            <rect x="19" y="-10" width="2" height="8" fill="#5D4037"/>
            {/* Flame on torch */}
            <ellipse cx="20" cy="-12" rx="2" ry="3" fill="#F59E0B"/>
            <ellipse cx="20" cy="-13" rx="1.5" ry="2.5" fill="#FBBF24"/>
            <ellipse cx="20" cy="-14" rx="1" ry="1.5" fill="#FDE68A">
                <animate attributeName="ry" values="1.5;2;1.5" dur="0.5s" repeatCount="indefinite"/>
            </ellipse>
            {/* Other arm holding scroll/tablet */}
            <path d="M9 4 Q6 3 4 2" stroke="#8B6914" strokeWidth="1.8" fill="none"/>
            <rect x="2" y="0" width="4" height="5" fill="#E8E0D4"/>
            <line x1="3" y1="1" x2="5" y2="1" stroke="#4A3000" strokeWidth="0.3"/>
            <line x1="3" y1="2.5" x2="5" y2="2.5" stroke="#4A3000" strokeWidth="0.3"/>
            <line x1="3" y1="4" x2="5" y2="4" stroke="#4A3000" strokeWidth="0.3"/>
            {/* Draped robe detail */}
            <path d="M9 6 Q12 8 15 6" stroke="#7A5C00" strokeWidth="0.5" fill="none"/>
            <path d="M9 9 Q12 11 15 9" stroke="#7A5C00" strokeWidth="0.5" fill="none"/>
            {/* Bronze highlights */}
            <ellipse cx="11" cy="4" rx="1" ry="2" fill="#DAA520" opacity="0.35"/>
            {/* Surface sparkle */}
            <ellipse cx="18" cy="20" rx="1.5" ry="0.5" fill="#fff" opacity="0.2">
                <animate attributeName="opacity" values="0.2;0.35;0.2" dur="2.5s" repeatCount="indefinite"/>
            </ellipse>
        </g>
    ),
    // Fountain Statue/Sculpture (♦) - Classical bronze figure with water features
    FOUNTAIN_STATUE: (
        <g>
            {/* Water base */}
            <rect x="0" y="0" width="24" height="24" fill="#2E8B9A"/>
            <rect x="0" y="0" width="24" height="24" fill="#3BA7B8" opacity="0.5"/>

            {/* Stone pedestal rising from water */}
            <ellipse cx="12" cy="20" rx="6" ry="2.5" fill="#A89F91"/>
            <rect x="7" y="16" width="10" height="4" fill="#B8AD9D"/>
            <ellipse cx="12" cy="16" rx="5" ry="2" fill="#C4B9A9"/>
            <rect x="8" y="13" width="8" height="4" fill="#C4B9A9"/>
            <ellipse cx="12" cy="13" rx="4" ry="1.5" fill="#D8CFC1"/>

            {/* Bronze classical figure - triton/nymph */}
            <ellipse cx="12" cy="10" rx="3" ry="4" fill="#8B6914"/>
            <circle cx="12" cy="5" r="2.5" fill="#8B6914"/>
            {/* Arms holding vessel */}
            <path d="M9 9 Q5 7 6 4" stroke="#8B6914" strokeWidth="1.8" fill="none"/>
            <path d="M15 9 Q19 7 18 4" stroke="#8B6914" strokeWidth="1.8" fill="none"/>
            {/* Vessel/urn pouring water */}
            <ellipse cx="6" cy="4" rx="1.5" ry="2" fill="#A67C00"/>
            <ellipse cx="18" cy="4" rx="1.5" ry="2" fill="#A67C00"/>
            {/* Bronze highlights */}
            <ellipse cx="11" cy="6" rx="0.8" ry="1.2" fill="#DAA520" opacity="0.4"/>
            <ellipse cx="11" cy="9" rx="1" ry="2" fill="#DAA520" opacity="0.3"/>

            {/* Water pouring from vessels - left */}
            <path d="M5 6 Q4 10 5 16" stroke="#7DD3E1" fill="none" strokeWidth="1" opacity="0.8">
                <animate attributeName="d"
                    values="M5 6 Q4 10 5 16;M5 6 Q6 10 5 16;M5 6 Q4 10 5 16"
                    dur="0.6s" repeatCount="indefinite"/>
            </path>
            {/* Water pouring from vessels - right */}
            <path d="M19 6 Q20 10 19 16" stroke="#7DD3E1" fill="none" strokeWidth="1" opacity="0.8">
                <animate attributeName="d"
                    values="M19 6 Q20 10 19 16;M19 6 Q18 10 19 16;M19 6 Q20 10 19 16"
                    dur="0.65s" repeatCount="indefinite"/>
            </path>

            {/* Droplets from pouring water */}
            <circle cx="4" cy="12" r="0.6" fill="#7DD3E1" opacity="0.7">
                <animate attributeName="cy" values="12;20;12" dur="0.9s" repeatCount="indefinite"/>
            </circle>
            <circle cx="20" cy="11" r="0.6" fill="#7DD3E1" opacity="0.7">
                <animate attributeName="cy" values="11;19;11" dur="0.85s" repeatCount="indefinite" begin="0.2s"/>
            </circle>

            {/* Splash ripples */}
            <ellipse cx="5" cy="18" rx="2" ry="0.5" fill="none" stroke="#7DD3E1" strokeWidth="0.4" opacity="0.5">
                <animate attributeName="rx" values="2;4;2" dur="1.2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.5;0;0.5" dur="1.2s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="19" cy="18" rx="2" ry="0.5" fill="none" stroke="#7DD3E1" strokeWidth="0.4" opacity="0.5">
                <animate attributeName="rx" values="2;4;2" dur="1.1s" repeatCount="indefinite" begin="0.3s"/>
                <animate attributeName="opacity" values="0.5;0;0.5" dur="1.1s" repeatCount="indefinite" begin="0.3s"/>
            </ellipse>

            {/* Surface sparkles */}
            <ellipse cx="3" cy="21" rx="1.5" ry="0.5" fill="#fff" opacity="0.25">
                <animate attributeName="opacity" values="0.25;0.4;0.25" dur="2s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="21" cy="22" rx="1.5" ry="0.5" fill="#fff" opacity="0.2">
                <animate attributeName="opacity" values="0.2;0.35;0.2" dur="2.3s" repeatCount="indefinite" begin="0.5s"/>
            </ellipse>
        </g>
    ),
};

// Trocadéro special tiles
export const TROCADERO_GRAPHICS: Record<string, JSX.Element> = {
    // Waterfall - dramatic cascading water with mist and foam
    WATERFALL: (
        <g>
            {/* Dark rocky backdrop */}
            <rect x="0" y="0" width="24" height="24" fill="#3D3A36"/>

            {/* Main water column - turbulent cascade */}
            <rect x="6" y="0" width="12" height="24" fill="#2E8B9A" opacity="0.9"/>
            <rect x="7" y="0" width="10" height="24" fill="#3BA7B8" opacity="0.8"/>
            <rect x="9" y="0" width="6" height="24" fill="#5DC1D0" opacity="0.6"/>

            {/* Animated water streams - left */}
            <path d="M7 0 Q9 6 7 12 Q9 18 7 24" stroke="#7DD3E1" strokeWidth="2.5" fill="none" opacity="0.8">
                <animate attributeName="d"
                    values="M7 0 Q9 6 7 12 Q9 18 7 24;M7 0 Q5 6 7 12 Q5 18 7 24;M7 0 Q9 6 7 12 Q9 18 7 24"
                    dur="0.7s" repeatCount="indefinite"/>
            </path>

            {/* Animated water streams - center */}
            <path d="M12 0 Q14 5 12 10 Q10 15 12 20 Q14 22 12 24" stroke="#B3E5FC" strokeWidth="3" fill="none" opacity="0.7">
                <animate attributeName="d"
                    values="M12 0 Q14 5 12 10 Q10 15 12 20 Q14 22 12 24;M12 0 Q10 5 12 10 Q14 15 12 20 Q10 22 12 24;M12 0 Q14 5 12 10 Q10 15 12 20 Q14 22 12 24"
                    dur="0.5s" repeatCount="indefinite"/>
            </path>

            {/* Animated water streams - right */}
            <path d="M17 0 Q15 6 17 12 Q15 18 17 24" stroke="#7DD3E1" strokeWidth="2.5" fill="none" opacity="0.8">
                <animate attributeName="d"
                    values="M17 0 Q15 6 17 12 Q15 18 17 24;M17 0 Q19 6 17 12 Q19 18 17 24;M17 0 Q15 6 17 12 Q15 18 17 24"
                    dur="0.65s" repeatCount="indefinite"/>
            </path>

            {/* Foam and spray particles */}
            <circle cx="8" cy="4" r="1.2" fill="#fff" opacity="0.6">
                <animate attributeName="cy" values="4;24;4" dur="0.8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="0.8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="12" cy="8" r="1" fill="#fff" opacity="0.7">
                <animate attributeName="cy" values="8;24;8" dur="0.6s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="0.6s" repeatCount="indefinite"/>
            </circle>
            <circle cx="16" cy="2" r="0.9" fill="#fff" opacity="0.5">
                <animate attributeName="cy" values="2;24;2" dur="0.75s" repeatCount="indefinite"/>
            </circle>
            <circle cx="10" cy="14" r="0.8" fill="#E0F7FA" opacity="0.6">
                <animate attributeName="cy" values="14;24;14" dur="0.55s" repeatCount="indefinite"/>
            </circle>
            <circle cx="14" cy="18" r="1.1" fill="#fff" opacity="0.5">
                <animate attributeName="cy" values="18;24;18" dur="0.45s" repeatCount="indefinite"/>
            </circle>

            {/* Mist effect at edges */}
            <ellipse cx="4" cy="12" rx="3" ry="8" fill="#B3E5FC" opacity="0.2">
                <animate attributeName="opacity" values="0.2;0.35;0.2" dur="2s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="20" cy="12" rx="3" ry="8" fill="#B3E5FC" opacity="0.2">
                <animate attributeName="opacity" values="0.2;0.35;0.2" dur="2.3s" repeatCount="indefinite" begin="0.5s"/>
            </ellipse>

            {/* Wet rock edges visible through water */}
            <rect x="0" y="0" width="5" height="24" fill="#4A4744" opacity="0.4"/>
            <rect x="19" y="0" width="5" height="24" fill="#4A4744" opacity="0.4"/>
        </g>
    ),
    // Cascade rock - rugged natural stone formation with moss and wet surfaces
    CASCADE_ROCK: (
        <g>
            {/* Shadow beneath rocks */}
            <ellipse cx="12" cy="22" rx="11" ry="3" fill="#000" opacity="0.25"/>

            {/* Large base boulder */}
            <ellipse cx="12" cy="18" rx="11" ry="6" fill="#5C5852"/>
            <ellipse cx="12" cy="16" rx="10" ry="5.5" fill="#6B6660"/>

            {/* Rocky texture - layered stones */}
            <ellipse cx="8" cy="14" rx="5" ry="4" fill="#78726C"/>
            <ellipse cx="16" cy="15" rx="5" ry="3.5" fill="#6E6862"/>
            <ellipse cx="12" cy="12" rx="4" ry="3" fill="#847E78"/>

            {/* Smaller accent rocks on top */}
            <ellipse cx="6" cy="12" rx="3" ry="2.5" fill="#8A8480"/>
            <ellipse cx="18" cy="13" rx="3" ry="2" fill="#7A7470"/>
            <ellipse cx="12" cy="10" rx="3.5" ry="2.5" fill="#908A84"/>

            {/* Rock crevices and shadows */}
            <path d="M4 16 Q8 14 10 16" stroke="#4A4644" strokeWidth="0.8" fill="none" opacity="0.6"/>
            <path d="M14 15 Q16 13 20 15" stroke="#4A4644" strokeWidth="0.8" fill="none" opacity="0.6"/>
            <path d="M9 12 Q12 10 15 12" stroke="#4A4644" strokeWidth="0.6" fill="none" opacity="0.5"/>

            {/* Moss patches - green growth on wet rocks */}
            <ellipse cx="5" cy="14" rx="2" ry="1.5" fill="#4A5D4A" opacity="0.6"/>
            <ellipse cx="19" cy="16" rx="1.5" ry="1" fill="#3D5040" opacity="0.5"/>
            <ellipse cx="10" cy="11" rx="1.5" ry="1" fill="#4A5D4A" opacity="0.5"/>

            {/* Wet sheen from water spray */}
            <ellipse cx="8" cy="13" rx="2" ry="1" fill="#7DD3E1" opacity="0.2"/>
            <ellipse cx="15" cy="14" rx="2.5" ry="1" fill="#7DD3E1" opacity="0.15"/>
            <ellipse cx="12" cy="11" rx="1.5" ry="0.8" fill="#B3E5FC" opacity="0.2"/>

            {/* Water trickling over rocks */}
            <path d="M10 8 Q9 12 10 16" stroke="#7DD3E1" strokeWidth="0.8" fill="none" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.3;0.5" dur="1.5s" repeatCount="indefinite"/>
            </path>
            <path d="M14 9 Q15 13 14 17" stroke="#7DD3E1" strokeWidth="0.6" fill="none" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.2;0.4" dur="1.8s" repeatCount="indefinite" begin="0.3s"/>
            </path>

            {/* Highlight on wet stone */}
            <ellipse cx="7" cy="12" rx="1" ry="0.5" fill="#fff" opacity="0.15"/>
            <ellipse cx="14" cy="11" rx="1.2" ry="0.5" fill="#fff" opacity="0.12"/>
        </g>
    ),
    // Moorish arch
    MOORISH_ARCH: (
        <g>
            <rect x="2" y="12" width="4" height="12" fill="#E4B584"/>
            <rect x="18" y="12" width="4" height="12" fill="#E4B584"/>
            <path d="M2 12 Q12 0 22 12" fill="#D4A574"/>
            <path d="M4 12 Q12 2 20 12" fill="#1A1A2E" opacity="0.6"/>
            <rect x="2" y="10" width="20" height="2" fill="#B8860B"/>
        </g>
    ),
    // Minaret
    MINARET: (
        <g>
            <ellipse cx="12" cy="22" rx="5" ry="2" fill="#000" opacity="0.15"/>
            <rect x="8" y="8" width="8" height="14" fill="#E4B584"/>
            <rect x="9" y="8" width="6" height="14" fill="#D4A574"/>
            <path d="M8 8 Q12 0 16 8" fill="#FFD700"/>
            <circle cx="12" cy="2" r="1.5" fill="#FFD700"/>
            <rect x="10" y="12" width="4" height="4" fill="#1A1A2E" opacity="0.4"/>
        </g>
    ),
};

// ===========================================
// FLOOR CUSHION GENERATOR - Multiple styles and colors
// ===========================================

type CushionStyle = 'round' | 'square' | 'bolster' | 'moroccan' | 'tufted';

// Rich color palettes for cushions - oriental/exposition style
const CUSHION_PALETTES = [
    { base: '#B91C1C', mid: '#DC2626', light: '#EF4444', accent: '#FCD34D' }, // Red with gold
    { base: '#1E3A8A', mid: '#2563EB', light: '#3B82F6', accent: '#FBBF24' }, // Royal blue with gold
    { base: '#7C2D12', mid: '#B45309', light: '#D97706', accent: '#FDE68A' }, // Burnt orange
    { base: '#4C1D95', mid: '#7C3AED', light: '#8B5CF6', accent: '#C4B5FD' }, // Purple
    { base: '#065F46', mid: '#059669', light: '#10B981', accent: '#FCD34D' }, // Emerald with gold
    { base: '#831843', mid: '#BE185D', light: '#DB2777', accent: '#F9A8D4' }, // Magenta/rose
    { base: '#713F12', mid: '#A16207', light: '#CA8A04', accent: '#FEF08A' }, // Amber/golden
];

export const generateCushion = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const styleIndex = Math.floor((hash - Math.floor(hash)) * 5);
    const colorIndex = Math.floor(((hash * 7) - Math.floor(hash * 7)) * CUSHION_PALETTES.length);
    const styles: CushionStyle[] = ['round', 'square', 'bolster', 'moroccan', 'tufted'];
    const style = styles[styleIndex];
    const palette = CUSHION_PALETTES[colorIndex];

    // Slight rotation for natural look
    const rotation = ((hash * 100) % 30) - 15;

    switch (style) {
        case 'round':
            // Classic round floor cushion with center button
            return (
                <g transform={`rotate(${rotation}, 12, 14)`}>
                    {/* Shadow */}
                    <ellipse cx="12" cy="18" rx="9" ry="3" fill="#000" opacity="0.2"/>
                    {/* Base cushion */}
                    <ellipse cx="12" cy="14" rx="9" ry="6" fill={palette.base}/>
                    {/* Top surface */}
                    <ellipse cx="12" cy="12" rx="8" ry="5" fill={palette.mid}/>
                    {/* Puffy center */}
                    <ellipse cx="12" cy="11" rx="6" ry="4" fill={palette.light}/>
                    {/* Center button/tassel */}
                    <circle cx="12" cy="11" r="2.5" fill={palette.accent}/>
                    <circle cx="12" cy="11" r="1.2" fill={palette.base}/>
                    {/* Decorative stitching */}
                    <path d={`M6 12 Q9 9 12 12 Q15 9 18 12`} stroke={palette.accent} strokeWidth="0.5" fill="none" opacity="0.6"/>
                </g>
            );

        case 'square':
            // Square floor cushion with corner tassels
            return (
                <g transform={`rotate(${rotation}, 12, 14)`}>
                    {/* Shadow */}
                    <rect x="4" y="16" width="16" height="4" rx="1" fill="#000" opacity="0.15"/>
                    {/* Base */}
                    <rect x="4" y="8" width="16" height="10" rx="2" fill={palette.base}/>
                    {/* Top surface - slightly smaller for 3D effect */}
                    <rect x="5" y="7" width="14" height="9" rx="1.5" fill={palette.mid}/>
                    {/* Puffy center */}
                    <rect x="6" y="8" width="12" height="7" rx="2" fill={palette.light}/>
                    {/* Cross stitching pattern */}
                    <line x1="6" y1="11" x2="18" y2="11" stroke={palette.accent} strokeWidth="0.8"/>
                    <line x1="12" y1="8" x2="12" y2="15" stroke={palette.accent} strokeWidth="0.8"/>
                    {/* Corner tassels */}
                    <circle cx="5" cy="8" r="1.5" fill={palette.accent}/>
                    <circle cx="19" cy="8" r="1.5" fill={palette.accent}/>
                    <circle cx="5" cy="16" r="1.5" fill={palette.accent}/>
                    <circle cx="19" cy="16" r="1.5" fill={palette.accent}/>
                </g>
            );

        case 'bolster':
            // Cylindrical bolster cushion
            return (
                <g transform={`rotate(${rotation * 0.5}, 12, 14)`}>
                    {/* Shadow */}
                    <ellipse cx="12" cy="18" rx="10" ry="2.5" fill="#000" opacity="0.15"/>
                    {/* Main cylinder body */}
                    <rect x="3" y="10" width="18" height="8" fill={palette.mid}/>
                    {/* Top curve */}
                    <ellipse cx="12" cy="10" rx="9" ry="3" fill={palette.light}/>
                    {/* End caps */}
                    <ellipse cx="3" cy="14" rx="2" ry="4" fill={palette.base}/>
                    <ellipse cx="21" cy="14" rx="2" ry="4" fill={palette.base}/>
                    {/* End cap highlights */}
                    <ellipse cx="3" cy="13" rx="1.5" ry="3" fill={palette.mid}/>
                    <ellipse cx="21" cy="13" rx="1.5" ry="3" fill={palette.mid}/>
                    {/* Decorative band */}
                    <rect x="10" y="9" width="4" height="9" fill={palette.accent} opacity="0.7"/>
                    <line x1="12" y1="9" x2="12" y2="18" stroke={palette.base} strokeWidth="0.5"/>
                </g>
            );

        case 'moroccan':
            // Moroccan pouf style - round with geometric pattern
            return (
                <g transform={`rotate(${rotation * 0.3}, 12, 14)`}>
                    {/* Shadow */}
                    <ellipse cx="12" cy="19" rx="8" ry="2.5" fill="#000" opacity="0.2"/>
                    {/* Base - taller than round cushion */}
                    <ellipse cx="12" cy="16" rx="8" ry="5" fill={palette.base}/>
                    <rect x="4" y="10" width="16" height="6" fill={palette.base}/>
                    {/* Middle band */}
                    <ellipse cx="12" cy="13" rx="8" ry="4" fill={palette.mid}/>
                    {/* Top */}
                    <ellipse cx="12" cy="10" rx="7" ry="4" fill={palette.light}/>
                    {/* Geometric pattern - triangles */}
                    <path d="M6 13 L8 10 L10 13 L8 16 Z" fill={palette.accent} opacity="0.8"/>
                    <path d="M10 13 L12 10 L14 13 L12 16 Z" fill={palette.accent} opacity="0.8"/>
                    <path d="M14 13 L16 10 L18 13 L16 16 Z" fill={palette.accent} opacity="0.8"/>
                    {/* Top center ornament */}
                    <circle cx="12" cy="10" r="2" fill={palette.accent}/>
                    <circle cx="12" cy="10" r="1" fill={palette.base}/>
                </g>
            );

        case 'tufted':
        default:
            // Tufted cushion with multiple buttons
            return (
                <g transform={`rotate(${rotation}, 12, 14)`}>
                    {/* Shadow */}
                    <ellipse cx="12" cy="18" rx="9" ry="3" fill="#000" opacity="0.18"/>
                    {/* Base cushion */}
                    <ellipse cx="12" cy="14" rx="9" ry="6" fill={palette.base}/>
                    {/* Top surface with tufted sections */}
                    <ellipse cx="12" cy="12" rx="8" ry="5" fill={palette.mid}/>
                    {/* Puffy sections between tufts */}
                    <ellipse cx="8" cy="10" rx="3" ry="2.5" fill={palette.light}/>
                    <ellipse cx="16" cy="10" rx="3" ry="2.5" fill={palette.light}/>
                    <ellipse cx="12" cy="13" rx="3" ry="2.5" fill={palette.light}/>
                    {/* Tuft buttons */}
                    <circle cx="8" cy="10" r="1.2" fill={palette.accent}/>
                    <circle cx="16" cy="10" r="1.2" fill={palette.accent}/>
                    <circle cx="12" cy="13" r="1.2" fill={palette.accent}/>
                    {/* Gathering lines from tufts */}
                    <path d="M8 10 Q6 12 8 14" stroke={palette.base} strokeWidth="0.4" fill="none" opacity="0.5"/>
                    <path d="M16 10 Q18 12 16 14" stroke={palette.base} strokeWidth="0.4" fill="none" opacity="0.5"/>
                    <path d="M12 13 Q10 15 12 17" stroke={palette.base} strokeWidth="0.4" fill="none" opacity="0.5"/>
                </g>
            );
    }
};

// ===========================================
// SOUK MARKET STALL GENERATOR
// Varied Middle Eastern bazaar stalls with different wares
// ===========================================
export const generateMarketStall = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const variant = Math.floor((hash - Math.floor(hash)) * 6);
    const awningHue = Math.floor((hash * 17) % 4);

    // Awning colors - rich Middle Eastern palette
    const awningColors = [
        { main: '#C41E3A', stripe: '#8B0000' },  // Crimson
        { main: '#E65100', stripe: '#BF360C' },  // Orange
        { main: '#1565C0', stripe: '#0D47A1' },  // Blue
        { main: '#2E7D32', stripe: '#1B5E20' },  // Green
    ];
    const awning = awningColors[awningHue];

    // Wares displayed vary by variant
    const renderWares = () => {
        switch (variant) {
            case 0: // Spice stall - pyramids of colorful spices
                return (
                    <g>
                        {/* Spice pyramids */}
                        <path d="M4 16 L7 11 L10 16 Z" fill="#D4A017"/>
                        <path d="M9 16 L12 10 L15 16 Z" fill="#8B0000"/>
                        <path d="M14 16 L17 12 L20 16 Z" fill="#CD853F"/>
                        {/* Small bowls */}
                        <ellipse cx="6" cy="18" rx="3" ry="1.5" fill="#8B4513"/>
                        <ellipse cx="6" cy="17.5" rx="2.5" ry="1" fill="#FFD700"/>
                        <ellipse cx="17" cy="18" rx="3" ry="1.5" fill="#8B4513"/>
                        <ellipse cx="17" cy="17.5" rx="2.5" ry="1" fill="#228B22"/>
                    </g>
                );
            case 1: // Brass & copper wares
                return (
                    <g>
                        {/* Hanging pots */}
                        <ellipse cx="7" cy="10" rx="3" ry="2" fill="#B87333"/>
                        <ellipse cx="7" cy="9" rx="2.5" ry="1" fill="#CD853F"/>
                        <ellipse cx="17" cy="11" rx="3.5" ry="2.5" fill="#B8860B"/>
                        <ellipse cx="17" cy="10" rx="3" ry="1.5" fill="#DAA520"/>
                        {/* Displayed items */}
                        <rect x="5" y="15" width="4" height="5" rx="1" fill="#B87333"/>
                        <ellipse cx="7" cy="15" rx="2.5" ry="1" fill="#CD7F32"/>
                        <circle cx="15" cy="17" r="3" fill="#B8860B"/>
                        <circle cx="15" cy="17" r="2" fill="#DAA520"/>
                    </g>
                );
            case 2: // Textiles & carpets
                return (
                    <g>
                        {/* Rolled carpets */}
                        <rect x="4" y="12" width="16" height="4" rx="2" fill="#8B0000"/>
                        <rect x="4" y="12" width="16" height="1" rx="0.5" fill="#CD5C5C"/>
                        <rect x="5" y="16" width="14" height="3" rx="1.5" fill="#191970"/>
                        <rect x="5" y="16" width="14" height="0.8" fill="#4169E1"/>
                        {/* Hanging fabric */}
                        <rect x="3" y="6" width="5" height="8" fill="#DC143C"/>
                        <rect x="16" y="7" width="5" height="7" fill="#4B0082"/>
                        <path d="M3 6 L5 4 L7 6" fill="#B22222"/>
                    </g>
                );
            case 3: // Pottery & ceramics
                return (
                    <g>
                        {/* Large amphora */}
                        <ellipse cx="8" cy="18" rx="3" ry="2" fill="#8B4513"/>
                        <path d="M5 18 Q5 10 8 8 Q11 10 11 18" fill="#A0522D"/>
                        <ellipse cx="8" cy="8" rx="2" ry="1" fill="#8B4513"/>
                        {/* Decorated vases */}
                        <path d="M15 20 Q14 14 16 12 Q18 14 17 20" fill="#4682B4"/>
                        <ellipse cx="16" cy="12" rx="1.5" ry="0.8" fill="#5F9EA0"/>
                        <line x1="14.5" y1="15" x2="17.5" y2="15" stroke="#FFD700" strokeWidth="0.5"/>
                        <line x1="14.5" y1="17" x2="17.5" y2="17" stroke="#FFD700" strokeWidth="0.5"/>
                        {/* Small bowls */}
                        <circle cx="19" cy="19" r="2" fill="#6B8E23"/>
                    </g>
                );
            case 4: // Jewelry & silver
                return (
                    <g>
                        {/* Display cloth */}
                        <rect x="4" y="13" width="16" height="7" fill="#1C1C1C"/>
                        {/* Necklaces */}
                        <path d="M6 14 Q9 18 12 14" stroke="#FFD700" strokeWidth="0.8" fill="none"/>
                        <circle cx="9" cy="16" r="1" fill="#FFD700"/>
                        <path d="M12 15 Q15 19 18 15" stroke="#C0C0C0" strokeWidth="0.8" fill="none"/>
                        {/* Rings and gems */}
                        <circle cx="6" cy="18" r="1.5" fill="#C0C0C0"/>
                        <circle cx="6" cy="18" r="0.7" fill="#00CED1"/>
                        <circle cx="10" cy="18" r="1.2" fill="#FFD700"/>
                        <circle cx="10" cy="18" r="0.5" fill="#DC143C"/>
                        <circle cx="14" cy="18" r="1.3" fill="#C0C0C0"/>
                        <circle cx="18" cy="17" r="1.5" fill="#FFD700"/>
                    </g>
                );
            case 5: // Leather goods
            default:
                return (
                    <g>
                        {/* Hanging bags */}
                        <rect x="4" y="8" width="5" height="6" rx="1" fill="#8B4513"/>
                        <rect x="4" y="8" width="5" height="1.5" fill="#A0522D"/>
                        <rect x="15" y="9" width="6" height="7" rx="1" fill="#6B4423"/>
                        <line x1="15" y1="11" x2="21" y2="11" stroke="#8B4513" strokeWidth="0.5"/>
                        {/* Slippers */}
                        <ellipse cx="8" cy="18" rx="3" ry="2" fill="#DC143C"/>
                        <ellipse cx="8" cy="17" rx="2" ry="1" fill="#B22222"/>
                        <ellipse cx="16" cy="18" rx="3" ry="2" fill="#DAA520"/>
                        <ellipse cx="16" cy="17" rx="2" ry="1" fill="#B8860B"/>
                    </g>
                );
        }
    };

    return (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="22" rx="10" ry="2" fill="#000" opacity="0.2"/>

            {/* Stall frame - wooden posts */}
            <rect x="2" y="4" width="2" height="18" fill="#5D4037"/>
            <rect x="20" y="4" width="2" height="18" fill="#5D4037"/>

            {/* Counter/display surface */}
            <rect x="1" y="10" width="22" height="12" fill="#6D4C41"/>
            <rect x="2" y="11" width="20" height="10" fill="#8D6E63"/>

            {/* Striped awning with scalloped edge */}
            <path d="M0 4 L4 0 L20 0 L24 4 L24 8 L0 8 Z" fill={awning.main}/>
            <rect x="0" y="4" width="4" height="4" fill={awning.stripe}/>
            <rect x="8" y="4" width="4" height="4" fill={awning.stripe}/>
            <rect x="16" y="4" width="4" height="4" fill={awning.stripe}/>
            {/* Scalloped edge */}
            <path d="M0 8 Q2 10 4 8 Q6 10 8 8 Q10 10 12 8 Q14 10 16 8 Q18 10 20 8 Q22 10 24 8"
                  fill="none" stroke={awning.main} strokeWidth="2"/>
            <path d="M0 9 Q2 11 4 9 Q6 11 8 9 Q10 11 12 9 Q14 11 16 9 Q18 11 20 9 Q22 11 24 9"
                  fill="none" stroke={awning.stripe} strokeWidth="1"/>

            {/* Wares specific to this stall type */}
            {renderWares()}

            {/* Decorative tassels on awning corners */}
            <line x1="1" y1="8" x2="1" y2="11" stroke="#DAA520" strokeWidth="0.8"/>
            <circle cx="1" cy="11" r="0.8" fill="#FFD700"/>
            <line x1="23" y1="8" x2="23" y2="11" stroke="#DAA520" strokeWidth="0.8"/>
            <circle cx="23" cy="11" r="0.8" fill="#FFD700"/>
        </g>
    );
};

// ===========================================
// DONKEY GENERATOR
// A patient Middle Eastern donkey with varied decorations
// ===========================================
export const generateDonkey = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const variant = Math.floor((hash - Math.floor(hash)) * 4);
    const hasSaddlebags = (hash * 7) % 1 > 0.3;
    const hasBlanket = (hash * 11) % 1 > 0.4;
    const facingLeft = (hash * 13) % 1 > 0.5;

    // Coat color variations
    const coatColors = [
        { main: '#8B7355', light: '#A08B6F', dark: '#6B5344' },  // Brown
        { main: '#696969', light: '#808080', dark: '#4F4F4F' },  // Gray
        { main: '#8B8378', light: '#9C9488', dark: '#6B6358' },  // Taupe
        { main: '#7B6B5A', light: '#8C7C6B', dark: '#5B4B3A' },  // Tan
    ];
    const coat = coatColors[variant];

    const blanketColors = ['#8B0000', '#00008B', '#2F4F4F', '#4B0082'];
    const blanketColor = blanketColors[Math.floor((hash * 19) % 4)];

    const transform = facingLeft ? '' : 'translate(24, 0) scale(-1, 1)';

    return (
        <g transform={transform}>
            {/* Ground shadow */}
            <ellipse cx="12" cy="22" rx="9" ry="2" fill="#000" opacity="0.2"/>

            {/* Back legs */}
            <rect x="15" y="15" width="2.5" height="7" fill={coat.dark}/>
            <ellipse cx="16.25" cy="22" rx="1.5" ry="0.8" fill="#4A4A4A"/>

            {/* Body - barrel shaped */}
            <ellipse cx="12" cy="12" rx="8" ry="6" fill={coat.main}/>
            <ellipse cx="12" cy="11" rx="7" ry="5" fill={coat.light}/>

            {/* Belly highlight */}
            <ellipse cx="12" cy="14" rx="5" ry="2" fill={coat.light} opacity="0.5"/>

            {/* Decorative blanket */}
            {hasBlanket && (
                <g>
                    <rect x="6" y="8" width="10" height="7" fill={blanketColor}/>
                    <rect x="6" y="8" width="10" height="1.5" fill="#DAA520"/>
                    <rect x="6" y="13.5" width="10" height="1.5" fill="#DAA520"/>
                    {/* Tassels */}
                    <line x1="6" y1="15" x2="6" y2="17" stroke="#DAA520" strokeWidth="0.5"/>
                    <line x1="16" y1="15" x2="16" y2="17" stroke="#DAA520" strokeWidth="0.5"/>
                </g>
            )}

            {/* Saddlebags */}
            {hasSaddlebags && (
                <g>
                    <rect x="3" y="9" width="4" height="5" rx="1" fill="#6B4423"/>
                    <rect x="3" y="9" width="4" height="1.2" fill="#8B5A2B"/>
                    <rect x="17" y="9" width="4" height="5" rx="1" fill="#6B4423"/>
                    <rect x="17" y="9" width="4" height="1.2" fill="#8B5A2B"/>
                </g>
            )}

            {/* Front legs */}
            <rect x="6" y="15" width="2.5" height="7" fill={coat.main}/>
            <ellipse cx="7.25" cy="22" rx="1.5" ry="0.8" fill="#4A4A4A"/>

            {/* Neck */}
            <path d="M4 10 Q2 6 4 2 L8 2 Q6 6 6 10" fill={coat.main}/>

            {/* Head */}
            <ellipse cx="5" cy="2" rx="4" ry="3" fill={coat.light}/>

            {/* Muzzle */}
            <ellipse cx="2" cy="3" rx="2.5" ry="2" fill={coat.light}/>
            <ellipse cx="1.5" cy="3.5" rx="1" ry="0.8" fill="#4A4A4A"/>
            <circle cx="1" cy="3" r="0.4" fill="#2A2A2A"/>
            <circle cx="2" cy="3" r="0.4" fill="#2A2A2A"/>

            {/* Eye */}
            <ellipse cx="5" cy="1" rx="1.2" ry="1" fill="#1A1A1A"/>
            <circle cx="5.3" cy="0.8" r="0.3" fill="#FFF"/>

            {/* Ears - tall and expressive */}
            <ellipse cx="3" cy="-2" rx="1.2" ry="3" fill={coat.main}/>
            <ellipse cx="3" cy="-2" rx="0.7" ry="2.3" fill="#F5DEB3" opacity="0.5"/>
            <ellipse cx="7" cy="-2" rx="1.2" ry="3" fill={coat.main}/>
            <ellipse cx="7" cy="-2" rx="0.7" ry="2.3" fill="#F5DEB3" opacity="0.5"/>

            {/* Mane */}
            <path d="M4 2 Q5 0 6 2 Q7 0 8 2" stroke={coat.dark} strokeWidth="1.5" fill="none"/>

            {/* Tail */}
            <path d="M20 11 Q23 13 21 17" stroke={coat.dark} strokeWidth="2" fill="none"/>
            <path d="M21 16 Q22 18 20 19" stroke={coat.dark} strokeWidth="1.5" fill="none"/>

            {/* Halter/bridle */}
            <path d="M1 2 L3 0 L6 0 L8 2" stroke="#8B4513" strokeWidth="0.6" fill="none"/>
            <path d="M3 0 L3 4" stroke="#8B4513" strokeWidth="0.6" fill="none"/>
            <circle cx="3" cy="1.5" r="0.5" fill="#B8860B"/>
        </g>
    );
};

// ===========================================
// NAPOLEON'S TOMB - 3x2 multi-tile structure
// The tomb is a massive red porphyry sarcophagus
// in a circular crypt viewed from above
// ===========================================

// Color palette for Napoleon's Tomb
const TOMB_COLORS = {
    porphyry: '#6B1B1B',          // Deep red porphyry stone
    porphyryLight: '#8B2B2B',     // Lighter porphyry
    porphyryDark: '#4B0B0B',      // Dark porphyry shadow
    gold: '#D4AF37',              // Gold trim
    goldLight: '#FFD700',         // Bright gold highlight
    goldDark: '#B8860B',          // Dark gold
    marble: '#F0EDE6',            // White marble surround
    marbleDark: '#D0CCC4',        // Marble shadow
    greenMarble: '#2D4A3E',       // Green porphyry base
    greenMarbleLight: '#3D5A4E',  // Light green marble
    bronze: '#8B7355',            // Bronze details
    bronzeLight: '#A08060',       // Bronze highlight
};

// Napoleon's Tomb - Northwest tile (top-left corner of sarcophagus)
export const NAPOLEON_TOMB_NW = (
    <g>
        {/* Marble floor base */}
        <rect width="24" height="24" fill={TOMB_COLORS.marble}/>
        {/* Circular crypt edge - outer ring */}
        <path d="M24 0 Q24 24 0 24" fill={TOMB_COLORS.marbleDark}/>
        <path d="M22 0 Q22 22 0 22" fill={TOMB_COLORS.marble}/>
        {/* Gold railing/balustrade */}
        <path d="M20 0 Q20 20 0 20" stroke={TOMB_COLORS.gold} strokeWidth="2" fill="none"/>
        {/* Sarcophagus corner - red porphyry */}
        <rect x="8" y="8" width="16" height="16" fill={TOMB_COLORS.porphyry}/>
        <rect x="10" y="10" width="14" height="14" fill={TOMB_COLORS.porphyryLight}/>
        {/* Gold corner ornament */}
        <rect x="8" y="8" width="16" height="2" fill={TOMB_COLORS.gold}/>
        <rect x="8" y="8" width="2" height="16" fill={TOMB_COLORS.gold}/>
        {/* Corner rosette */}
        <circle cx="10" cy="10" r="3" fill={TOMB_COLORS.goldDark}/>
        <circle cx="10" cy="10" r="2" fill={TOMB_COLORS.gold}/>
        <circle cx="10" cy="10" r="1" fill={TOMB_COLORS.goldLight}/>
    </g>
);

// Napoleon's Tomb - North tile (top-center, main lid)
export const NAPOLEON_TOMB_N = (
    <g>
        {/* Marble floor base */}
        <rect width="24" height="24" fill={TOMB_COLORS.marble}/>
        {/* Gold railing continuing */}
        <rect x="0" y="0" width="24" height="2" fill={TOMB_COLORS.gold}/>
        {/* Sarcophagus top - curved lid */}
        <rect x="0" y="8" width="24" height="16" fill={TOMB_COLORS.porphyry}/>
        {/* Lid curve highlight */}
        <ellipse cx="12" cy="12" rx="10" ry="4" fill={TOMB_COLORS.porphyryLight}/>
        <ellipse cx="12" cy="10" rx="8" ry="3" fill={TOMB_COLORS.porphyry}/>
        {/* Gold trim band across top */}
        <rect x="0" y="8" width="24" height="2" fill={TOMB_COLORS.gold}/>
        {/* Central cross on lid */}
        <rect x="10" y="10" width="4" height="12" fill={TOMB_COLORS.gold}/>
        <rect x="4" y="14" width="16" height="3" fill={TOMB_COLORS.gold}/>
        {/* Cross detail */}
        <rect x="11" y="11" width="2" height="10" fill={TOMB_COLORS.goldLight}/>
        <rect x="5" y="15" width="14" height="1" fill={TOMB_COLORS.goldLight}/>
        {/* "N" initial at top */}
        <text x="12" y="7" textAnchor="middle" fontSize="4" fill={TOMB_COLORS.goldLight} fontWeight="bold">N</text>
    </g>
);

// Napoleon's Tomb - Northeast tile (top-right corner)
export const NAPOLEON_TOMB_NE = (
    <g>
        {/* Marble floor base */}
        <rect width="24" height="24" fill={TOMB_COLORS.marble}/>
        {/* Circular crypt edge - outer ring */}
        <path d="M0 0 Q0 24 24 24" fill={TOMB_COLORS.marbleDark}/>
        <path d="M2 0 Q2 22 24 22" fill={TOMB_COLORS.marble}/>
        {/* Gold railing */}
        <path d="M4 0 Q4 20 24 20" stroke={TOMB_COLORS.gold} strokeWidth="2" fill="none"/>
        {/* Sarcophagus corner */}
        <rect x="0" y="8" width="16" height="16" fill={TOMB_COLORS.porphyry}/>
        <rect x="0" y="10" width="14" height="14" fill={TOMB_COLORS.porphyryLight}/>
        {/* Gold corner ornament */}
        <rect x="0" y="8" width="16" height="2" fill={TOMB_COLORS.gold}/>
        <rect x="14" y="8" width="2" height="16" fill={TOMB_COLORS.gold}/>
        {/* Corner rosette */}
        <circle cx="14" cy="10" r="3" fill={TOMB_COLORS.goldDark}/>
        <circle cx="14" cy="10" r="2" fill={TOMB_COLORS.gold}/>
        <circle cx="14" cy="10" r="1" fill={TOMB_COLORS.goldLight}/>
    </g>
);

// Napoleon's Tomb - Southwest tile (bottom-left, base)
export const NAPOLEON_TOMB_SW = (
    <g>
        {/* Marble floor base */}
        <rect width="24" height="24" fill={TOMB_COLORS.marble}/>
        {/* Circular crypt edge continuing down */}
        <path d="M0 0 L0 24" stroke={TOMB_COLORS.marbleDark} strokeWidth="4"/>
        {/* Gold railing */}
        <rect x="0" y="20" width="2" height="4" fill={TOMB_COLORS.gold}/>
        {/* Green porphyry base */}
        <rect x="8" y="0" width="16" height="20" fill={TOMB_COLORS.greenMarble}/>
        <rect x="10" y="0" width="14" height="18" fill={TOMB_COLORS.greenMarbleLight}/>
        {/* Red sarcophagus body above */}
        <rect x="8" y="0" width="16" height="8" fill={TOMB_COLORS.porphyry}/>
        {/* Gold band at base */}
        <rect x="8" y="18" width="16" height="2" fill={TOMB_COLORS.gold}/>
        {/* Laurel wreath detail */}
        <ellipse cx="16" cy="12" rx="4" ry="3" fill="none" stroke={TOMB_COLORS.bronze} strokeWidth="1.5"/>
        <path d="M13 12 Q16 9 19 12" stroke={TOMB_COLORS.bronzeLight} strokeWidth="0.8" fill="none"/>
    </g>
);

// Napoleon's Tomb - South tile (bottom-center, inscription)
export const NAPOLEON_TOMB_S = (
    <g>
        {/* Marble floor base */}
        <rect width="24" height="24" fill={TOMB_COLORS.marble}/>
        {/* Green porphyry base */}
        <rect x="0" y="0" width="24" height="20" fill={TOMB_COLORS.greenMarble}/>
        <rect x="0" y="0" width="24" height="18" fill={TOMB_COLORS.greenMarbleLight}/>
        {/* Red sarcophagus body */}
        <rect x="0" y="0" width="24" height="8" fill={TOMB_COLORS.porphyry}/>
        {/* Gold band */}
        <rect x="0" y="18" width="24" height="2" fill={TOMB_COLORS.gold}/>
        {/* Inscription panel */}
        <rect x="4" y="8" width="16" height="8" fill={TOMB_COLORS.bronze}/>
        <rect x="5" y="9" width="14" height="6" fill={TOMB_COLORS.bronzeLight}/>
        {/* Inscription text */}
        <text x="12" y="12" textAnchor="middle" fontSize="2.5" fill="#2C1810" fontWeight="bold">NAPOLÉON</text>
        <text x="12" y="14.5" textAnchor="middle" fontSize="1.8" fill="#3C2820">1769 - 1821</text>
        {/* Gold railing bottom */}
        <rect x="0" y="22" width="24" height="2" fill={TOMB_COLORS.gold}/>
    </g>
);

// Napoleon's Tomb - Southeast tile (bottom-right corner)
export const NAPOLEON_TOMB_SE = (
    <g>
        {/* Marble floor base */}
        <rect width="24" height="24" fill={TOMB_COLORS.marble}/>
        {/* Circular crypt edge */}
        <path d="M24 0 L24 24" stroke={TOMB_COLORS.marbleDark} strokeWidth="4"/>
        {/* Gold railing */}
        <rect x="22" y="20" width="2" height="4" fill={TOMB_COLORS.gold}/>
        {/* Green porphyry base */}
        <rect x="0" y="0" width="16" height="20" fill={TOMB_COLORS.greenMarble}/>
        <rect x="0" y="0" width="14" height="18" fill={TOMB_COLORS.greenMarbleLight}/>
        {/* Red sarcophagus body */}
        <rect x="0" y="0" width="16" height="8" fill={TOMB_COLORS.porphyry}/>
        {/* Gold band */}
        <rect x="0" y="18" width="16" height="2" fill={TOMB_COLORS.gold}/>
        {/* Imperial eagle detail */}
        <path d="M8 10 L6 14 L8 13 L10 14 L8 10" fill={TOMB_COLORS.bronze}/>
        <circle cx="8" cy="10" r="1" fill={TOMB_COLORS.bronzeLight}/>
        <path d="M5 12 L8 11 M11 12 L8 11" stroke={TOMB_COLORS.bronze} strokeWidth="1"/>
    </g>
);

// Rotunda railing - ornate brass balustrade
export const ROTUNDA_RAILING = (
    <g>
        {/* Base marble */}
        <rect width="24" height="24" fill="#F0EDE6"/>
        {/* Railing base */}
        <rect x="2" y="18" width="20" height="6" fill="#D4AF37"/>
        <rect x="3" y="19" width="18" height="4" fill="#B8860B"/>
        {/* Balusters */}
        <rect x="4" y="8" width="2" height="12" fill="#D4AF37"/>
        <rect x="10" y="8" width="2" height="12" fill="#D4AF37"/>
        <rect x="16" y="8" width="2" height="12" fill="#D4AF37"/>
        {/* Baluster details */}
        <ellipse cx="5" cy="14" rx="1.5" ry="2" fill="#FFD700"/>
        <ellipse cx="11" cy="14" rx="1.5" ry="2" fill="#FFD700"/>
        <ellipse cx="17" cy="14" rx="1.5" ry="2" fill="#FFD700"/>
        {/* Top rail */}
        <rect x="0" y="6" width="24" height="3" fill="#D4AF37"/>
        <rect x="1" y="7" width="22" height="1.5" fill="#FFD700"/>
    </g>
);

// Rotunda graphics export
export const ROTUNDA_GRAPHICS: Record<string, JSX.Element> = {
    NAPOLEON_TOMB_NW,
    NAPOLEON_TOMB_N,
    NAPOLEON_TOMB_NE,
    NAPOLEON_TOMB_SW,
    NAPOLEON_TOMB_S,
    NAPOLEON_TOMB_SE,
    ROTUNDA_RAILING,
};

// ===========================================
// WATER GENERATION - Simple, performant Seine river water
// Single slow color pulse per tile, staggered by position for wave effect
// ===========================================

// Inject minimal water CSS once
let waterStylesInjected = false;
const injectWaterStyles = () => {
    if (waterStylesInjected || typeof document === 'undefined') return;
    waterStylesInjected = true;

    const style = document.createElement('style');
    style.id = 'water-animation-styles';
    style.textContent = `
        @keyframes waterPulse {
            0%, 100% { opacity: 0.12; }
            50% { opacity: 0.32; }
        }
    `;
    document.head.appendChild(style);
};

injectWaterStyles();

// Simple water with position-based color variation and one gentle animation
export const generateWater = (x: number, y: number): JSX.Element => {
    // Simple hash for variation
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453);
    const v = hash - Math.floor(hash);

    // Stagger animation by position - creates diagonal wave pattern
    const animDelay = ((x + y) % 8) * 0.75;

    // Seine blue-gray-green palette
    const hue = 200 + v * 12 - 6;
    const sat = 42 + v * 16;
    const light = 36 + v * 12;
    const baseColor = `hsl(${hue}, ${sat}%, ${light}%)`;
    const highlightColor = `hsl(${hue + 8}, ${sat + 8}%, ${light + 18}%)`;

    return (
        <g>
            {/* Base water */}
            <rect width="24" height="24" fill={baseColor}/>

            {/* Static ripple texture */}
            <path
                d={`M0 ${7 + v * 3} Q12 ${5 + v * 2} 24 ${8 + v * 2}`}
                fill="none"
                stroke={highlightColor}
                strokeWidth="0.7"
                opacity="0.35"
            />
            <path
                d={`M0 ${15 + v * 3} Q12 ${17 + v * 2} 24 ${14 + v * 2}`}
                fill="none"
                stroke={highlightColor}
                strokeWidth="0.5"
                opacity="0.25"
            />

            {/* Single animated highlight layer - staggered creates wave effect */}
            <rect
                width="24"
                height="24"
                fill={highlightColor}
                style={{
                    animation: 'waterPulse 5s ease-in-out infinite',
                    animationDelay: `${animDelay}s`
                }}
            />

            {/* Rare static sparkle */}
            {v > 0.75 && (
                <circle
                    cx={5 + v * 14}
                    cy={4 + v * 16}
                    r="0.7"
                    fill="#FFF"
                    opacity={0.25 + v * 0.15}
                />
            )}
        </g>
    );
};
