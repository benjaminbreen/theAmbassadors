import React from 'react';

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
                    <ellipse cx="14" cy="22" rx="9" ry="2.5" fill="#000" opacity="0.25"/>
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
                    <ellipse cx="12" cy="22" rx="8" ry="2" fill="#000" opacity="0.2"/>
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
                    <ellipse cx="12" cy="22" rx="7" ry="2" fill="#000" opacity="0.2"/>
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
                    <ellipse cx="12" cy="22" rx="5" ry="1.5" fill="#000" opacity="0.2"/>
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
                    <ellipse cx="13" cy="22" rx="8" ry="2.5" fill="#000" opacity="0.25"/>
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
// HEDGE GENERATION - French formal garden style
// ===========================================

export const generateHedge = (x: number, y: number): JSX.Element => {
    const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    const variant = Math.floor((hash - Math.floor(hash)) * 3);

    // Subtle variation in hedge color
    const darkGreen = variant === 0 ? '#166534' : variant === 1 ? '#14532D' : '#15803D';
    const midGreen = variant === 0 ? '#15803D' : variant === 1 ? '#166534' : '#1B5E20';
    const lightGreen = variant === 0 ? '#22C55E' : variant === 1 ? '#16A34A' : '#4ADE80';

    return (
        <g>
            {/* Ground shadow */}
            <ellipse cx="12" cy="22" rx="11" ry="2.5" fill="#000" opacity="0.18"/>

            {/* Main hedge body - tightly clipped box shape */}
            <rect x="1" y="4" width="22" height="17" rx="1" fill={darkGreen}/>
            <rect x="2" y="3" width="20" height="17" rx="1" fill={midGreen}/>

            {/* Top surface - flat trimmed */}
            <rect x="1" y="2" width="22" height="4" fill="#22863a"/>
            <rect x="2" y="1" width="20" height="3" fill="#2ea043"/>

            {/* Foliage texture - small clustered leaves */}
            <g opacity="0.8">
                {/* Top row - recently trimmed */}
                <circle cx="4" cy="4" r="2.2" fill={lightGreen}/>
                <circle cx="8" cy="3" r="2" fill="#16A34A"/>
                <circle cx="12" cy="2" r="2.3" fill={lightGreen}/>
                <circle cx="16" cy="3" r="2" fill="#16A34A"/>
                <circle cx="20" cy="4" r="2.2" fill={lightGreen}/>

                {/* Middle layer - denser */}
                <circle cx="3" cy="9" r="2.8" fill="#15803D"/>
                <circle cx="7" cy="8" r="3" fill={darkGreen}/>
                <circle cx="12" cy="9" r="3.2" fill="#166534"/>
                <circle cx="17" cy="8" r="3" fill={darkGreen}/>
                <circle cx="21" cy="9" r="2.8" fill="#15803D"/>

                {/* Lower layer - in shadow */}
                <circle cx="4" cy="15" r="2.5" fill="#14532D"/>
                <circle cx="9" cy="16" r="2.8" fill="#166534"/>
                <circle cx="15" cy="16" r="2.8" fill="#14532D"/>
                <circle cx="20" cy="15" r="2.5" fill="#166534"/>
            </g>

            {/* Highlight on top edge */}
            <rect x="3" y="1" width="18" height="1" fill="#4ADE80" opacity="0.35"/>

            {/* Shadow at base */}
            <rect x="2" y="19" width="20" height="2" fill="#0F4A20" opacity="0.5"/>

            {/* Subtle vertical trimming lines */}
            <line x1="6" y1="3" x2="6" y2="18" stroke="#0F4A20" strokeWidth="0.3" opacity="0.2"/>
            <line x1="12" y1="2" x2="12" y2="18" stroke="#0F4A20" strokeWidth="0.3" opacity="0.2"/>
            <line x1="18" y1="3" x2="18" y2="18" stroke="#0F4A20" strokeWidth="0.3" opacity="0.2"/>
        </g>
    );
};

// ===========================================
// LAMP - Improved single ornate gas lamp
// ===========================================

export const generateLamp = (x: number, y: number): JSX.Element => {
    // Single improved lamp design - ornate Parisian style
    return (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="22" rx="6" ry="1.8" fill="#000" opacity="0.22"/>

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

            {/* Lamp glow effect */}
            <circle cx="12" cy="-9" r="14" fill="url(#lampGlow)" opacity="0.45"/>

            {/* Flame flicker */}
            <ellipse cx="12" cy="-9" rx="2" ry="2.5" fill="#FFF59D" opacity="0.9">
                <animate attributeName="ry" values="2.5;3;2.5" dur="0.4s" repeatCount="indefinite"/>
            </ellipse>
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

    if (isDown) {
        // Sconce pointing down from top wall
        return (
            <g>
                {/* Radial glow effect - large and warm */}
                <ellipse cx="12" cy="16" rx="16" ry="12" fill="#FFEB3B" opacity="0.15"/>
                <ellipse cx="12" cy="16" rx="12" ry="9" fill="#FFF59D" opacity="0.2"/>
                <ellipse cx="12" cy="16" rx="8" ry="6" fill="#FFF8E1" opacity="0.25"/>

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

                {/* Inner flame glow */}
                <ellipse cx="12" cy="15" rx="3" ry="3" fill="#FFEB3B" opacity="0.6"/>

                {/* Animated flame */}
                <ellipse cx="12" cy="15" rx="1.8" ry="2.5" fill={flameOuter} opacity="0.9">
                    <animate attributeName="ry" values="2.5;3;2.5" dur="0.3s" repeatCount="indefinite"/>
                </ellipse>
                <ellipse cx="12" cy="15" rx="1" ry="1.8" fill={flameCore}>
                    <animate attributeName="ry" values="1.8;2.2;1.8" dur="0.25s" repeatCount="indefinite"/>
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
            {/* Radial glow effect - warm and noticeable */}
            <ellipse cx="17" cy="12" rx="14" ry="10" fill="#FFEB3B" opacity="0.12"/>
            <ellipse cx="17" cy="12" rx="10" ry="8" fill="#FFF59D" opacity="0.18"/>
            <ellipse cx="17" cy="12" rx="6" ry="5" fill="#FFF8E1" opacity="0.25"/>

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

            {/* Inner glow */}
            <ellipse cx="15" cy="13" rx="3" ry="3" fill="#FFEB3B" opacity="0.5"/>

            {/* Animated flame */}
            <ellipse cx="15" cy="13" rx="1.8" ry="2.2" fill={flameOuter} opacity="0.9">
                <animate attributeName="ry" values="2.2;2.8;2.2" dur="0.3s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="15" cy="13" rx="1" ry="1.5" fill={flameCore}>
                <animate attributeName="ry" values="1.5;2;1.5" dur="0.25s" repeatCount="indefinite"/>
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
    // Palm tree
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
    // Waterfall
    WATERFALL: (
        <g>
            <rect x="8" y="0" width="8" height="24" fill="#4FC3F7" opacity="0.8"/>
            <path d="M8 0 Q10 4 8 8 Q10 12 8 16 Q10 20 8 24" stroke="#81D4FA" strokeWidth="2" fill="none">
                <animate attributeName="d" values="M8 0 Q10 4 8 8 Q10 12 8 16 Q10 20 8 24;M8 0 Q6 4 8 8 Q6 12 8 16 Q6 20 8 24;M8 0 Q10 4 8 8 Q10 12 8 16 Q10 20 8 24" dur="1s" repeatCount="indefinite"/>
            </path>
            <path d="M16 0 Q14 4 16 8 Q14 12 16 16 Q14 20 16 24" stroke="#81D4FA" strokeWidth="2" fill="none">
                <animate attributeName="d" values="M16 0 Q14 4 16 8 Q14 12 16 16 Q14 20 16 24;M16 0 Q18 4 16 8 Q18 12 16 16 Q18 20 16 24;M16 0 Q14 4 16 8 Q14 12 16 16 Q14 20 16 24" dur="1s" repeatCount="indefinite"/>
            </path>
            <circle cx="10" cy="20" r="1" fill="#fff" opacity="0.5">
                <animate attributeName="cy" values="20;24;20" dur="0.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="14" cy="18" r="0.8" fill="#fff" opacity="0.4">
                <animate attributeName="cy" values="18;24;18" dur="0.6s" repeatCount="indefinite"/>
            </circle>
        </g>
    ),
    // Cascade rock
    CASCADE_ROCK: (
        <g>
            <ellipse cx="12" cy="18" rx="10" ry="6" fill="#6B7280"/>
            <ellipse cx="12" cy="16" rx="8" ry="5" fill="#78716C"/>
            <ellipse cx="10" cy="14" rx="4" ry="3" fill="#9CA3AF"/>
            <ellipse cx="16" cy="16" rx="3" ry="2" fill="#9CA3AF"/>
            <path d="M6 12 Q12 8 18 12" stroke="#4FC3F7" strokeWidth="1" fill="none" opacity="0.5"/>
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
