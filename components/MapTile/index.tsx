import React, { ReactElement, ReactNode } from 'react';
import { BiomeType } from '../../types';
import { MapTileProps } from './types';

// ===========================================
// ANIMATION STRIPPING UTILITY
// Recursively removes <animate> and <animateTransform> elements for performance
// ===========================================
const stripAnimations = (element: ReactNode): ReactNode => {
    if (!React.isValidElement(element)) {
        return element;
    }

    const el = element as ReactElement;

    // Skip animate elements entirely
    if (el.type === 'animate' || el.type === 'animateTransform' || el.type === 'animateMotion') {
        return null;
    }

    // If element has children, recursively process them
    if (el.props.children) {
        const children = React.Children.map(el.props.children, (child) => stripAnimations(child));
        // Filter out null children (removed animations)
        const filteredChildren = children?.filter(c => c !== null);
        return React.cloneElement(el, { ...el.props }, filteredChildren);
    }

    return el;
};

// Wrapper to conditionally strip animations
const maybeStripAnimations = (element: ReactNode, animate: boolean): ReactNode => {
    if (animate) return element;
    return stripAnimations(element);
};
import {
    hash,
    getFloorPattern,
    getCarpetPattern,
    getCulturalWallStyle,
    getCulturalContext,
    getStatueType,
    getStatueMaterial,
    MATERIAL_PALETTES,
} from './utils';
import { OBJECT_GRAPHICS, CHAIR_GRAPHICS, DOOR_GRAPHICS, generateFlowerbed, generateBanner, generateGrandDoorN, generateGrandDoorS, generateGrandDoorE, generateGrandDoorW, generateTallDoorN, generateTallDoorS, generateTallDoorE, generateTallDoorW, generateChairProfile } from './ObjectGraphics';
import { TERRAIN_GRAPHICS, TERRAIN_TILES } from './TerrainGraphics';
import { MACHINE_GRAPHICS } from './MachineGraphics';
import { STATUE_GRAPHICS } from './StatueGraphics';
import { WALL_TILES, getDirectionalWallColors, generateHaussmannFacade, generateSolidFacade, generateSoukFacade, generateHaussmannTop, generateHaussmannSide, generateTallBackWall, isGardenBiome, isBuildingBiome, generateTallCornerNW, generateTallCornerNE } from './WallGraphics';
import {
    KIOSK_GRAPHIC,
    generateKiosk,
    generateTree,
    generateHedge,
    generateLamp,
    generateWallSconce,
    generateCushion,
    generateMarketStall,
    generateDonkey,
    generateWater,
    DISPLAY_CASE_GRAPHIC,
    generateAquariumTank,
    TALL_TREE_TOP,
    TALL_TREE_BOTTOM,
    TALL_LAMP_TOP,
    TALL_LAMP_BOTTOM,
    VILLAGE_GRAPHICS,
    TROCADERO_GRAPHICS,
    FOUNTAIN_GRAPHICS,
    ROTUNDA_GRAPHICS,
    generateGrandHutNW,
    generateGrandHutNE,
    generateGrandHutSW,
    generateGrandHutSE,
} from './SpecialGraphics';
import {
    resolveTile,
    isObjectTile,
    hasGenerator,
    getGeneratorName,
    isMultiTile,
    getTileId,
    TILE_REGISTRY,
    TileDefinition,
} from './TileRegistry';

// ===========================================
// GENERATOR FUNCTIONS MAP
// Maps generator names from registry to actual functions
// Standard generators take (x, y) for position-based variation
// ===========================================
const GENERATORS: Record<string, (x: number, y: number, ctx?: any) => JSX.Element> = {
    generateTree,
    generateHedge,
    generateLamp,
    generateCushion,
    generateFlowerbed,
    generateKiosk,
    generateMarketStall,
    generateDonkey,
    generateGrandHutNW,
    generateGrandHutNE,
    generateGrandHutSW,
    generateGrandHutSE,
    generateWater,
};

// Generator functions that need special arguments (not just x, y)
// These use graphicsKey from registry or zoneName from context
const SPECIAL_GENERATORS: Record<string, (arg: any) => JSX.Element> = {
    generateWallSconce: (direction: 'left' | 'right' | 'down') => generateWallSconce(direction),
    generateBanner: (zoneName: string) => generateBanner(zoneName),
};

// Helper to get generator output using registry metadata
function getGeneratorOutput(char: string, x: number, y: number, zoneName?: string): JSX.Element | null {
    const tile = resolveTile(char);
    if (!tile?.generator) return null;

    const generatorName = tile.generator;

    // Check standard generators first
    if (GENERATORS[generatorName]) {
        return GENERATORS[generatorName](x, y);
    }

    // Check special generators that need different arguments
    if (generatorName === 'generateWallSconce' && tile.graphicsKey) {
        return SPECIAL_GENERATORS.generateWallSconce(tile.graphicsKey);
    }

    if (generatorName === 'generateBanner' && zoneName) {
        return SPECIAL_GENERATORS.generateBanner(zoneName);
    }

    return null;
}

// ===========================================
// OBJECT TILES SET
// Now fully derived from registry
// ===========================================
const OBJECT_TILES = new Set(
    Object.values(TILE_REGISTRY)
        .filter(t => isObjectTile(t.char))
        .map(t => t.char)
);

const MapTile: React.FC<MapTileProps> = ({
    char,
    x,
    y,
    biome = 'SALON',
    zoneName = '',
    flagState,
    animate = true,
}) => {
    const seed = hash(x, y);
    const floorPattern = getFloorPattern(biome, zoneName);

    // OBJECT TILES: Render with terrain background
    if (OBJECT_TILES.has(char)) {
        let objectContent: JSX.Element | null = null;

        // Try registry-based generator first (most tiles with generators)
        const generatorOutput = getGeneratorOutput(char, x, y, zoneName);
        if (generatorOutput) {
            objectContent = generatorOutput;
        }
        // Special handling for carpets - use zone-specific pattern (not in generator system)
        else if (getTileId(char) === 'CARPET') {
            const carpetPattern = zoneName ? getCarpetPattern(zoneName) : 'url(#pattern-victorian)';
            objectContent = (
                <g>
                    <rect width="24" height="24" fill={carpetPattern}/>
                    {/* Subtle edge shading for depth */}
                    <rect x="0" y="0" width="24" height="1" fill="#000" opacity="0.08"/>
                    <rect x="0" y="23" width="24" height="1" fill="#000" opacity="0.12"/>
                    <rect x="0" y="0" width="1" height="24" fill="#000" opacity="0.06"/>
                    <rect x="23" y="0" width="1" height="24" fill="#000" opacity="0.1"/>
                </g>
            );
        }
        // Check static object graphics using semantic ID lookup
        else {
            const tileId = getTileId(char);

            // SPECIAL: Flagpole with dynamic flag position
            if (tileId === 'FLAGPOLE' && flagState !== undefined) {
                // Calculate flag Y position based on state
                // 'raised' = -46, 'lowered' = 10 (near base), number = interpolated
                const flagY = flagState === 'raised' ? -46
                    : flagState === 'lowered' ? 10
                    : -46 + (flagState * 56); // Animate from -46 to 10

                objectContent = (
                    <g>
                        {/* Shadow */}
                        <ellipse cx="12" cy="22" rx="6" ry="2" fill="#000" opacity="0.15"/>
                        {/* Base */}
                        <rect x="4" y="18" width="16" height="6" fill="#57534E"/>
                        <rect x="6" y="16" width="12" height="3" fill="#6B7280"/>
                        <rect x="2" y="22" width="20" height="2" fill="#44403C"/>
                        <rect x="5" y="19" width="14" height="1" fill="#78716C"/>
                        {/* Pole sections */}
                        <rect x="10" y="0" width="4" height="18" fill="#78716C"/>
                        <rect x="11" y="0" width="2" height="18" fill="#9CA3AF"/>
                        <rect x="10" y="-24" width="4" height="26" fill="#78716C"/>
                        <rect x="11" y="-24" width="2" height="26" fill="#9CA3AF"/>
                        <rect x="10" y="-48" width="4" height="26" fill="#78716C"/>
                        <rect x="11" y="-48" width="2" height="26" fill="#9CA3AF"/>
                        {/* Gold rings */}
                        <rect x="9" y="14" width="6" height="2" fill="#FFD700"/>
                        <rect x="9" y="-10" width="6" height="2" fill="#FFD700"/>
                        <rect x="9" y="-34" width="6" height="2" fill="#FFD700"/>
                        {/* Flag holder bar - stays at top */}
                        <rect x="12" y="-46" width="20" height="1.5" fill="#57534E"/>
                        {/* French flag - position based on flagState */}
                        <g style={{ transform: `translateY(${flagY + 46}px)` }}>
                            <path d="M14 -46 L14 -28 Q18 -30 22 -28 L22 -46" fill="#002395"/>
                            <path d="M22 -46 L22 -28 Q26 -30 30 -28 L30 -46" fill="#FFFFFF"/>
                            <path d="M30 -46 L30 -28 Q34 -30 38 -28 L38 -46" fill="#ED2939"/>
                            <path d="M14 -40 Q18 -42 22 -40 Q26 -42 30 -40 Q34 -42 38 -40" stroke="#00000020" strokeWidth="0.5" fill="none"/>
                        </g>
                        {/* Finial at top */}
                        <path d="M12 -56 L8 -48 L12 -50 L16 -48 Z" fill="#FFD700"/>
                        <circle cx="12" cy="-48" r="3" fill="#FFD700"/>
                        <circle cx="12" cy="-48" r="1.5" fill="#FEF3C7"/>
                        <path d="M10 -48 L12 -58 L14 -48" fill="#FFD700"/>
                    </g>
                );
            }
            else if (tileId && OBJECT_GRAPHICS[tileId]) {
                objectContent = OBJECT_GRAPHICS[tileId];
            }
            // Chair orientations
            else if (tileId === 'CHAIR_E' || tileId === 'CHAIR_W') {
                // E/W chairs use position-based random facing direction
                objectContent = generateChairProfile(x, y);
            }
            else if (tileId && CHAIR_GRAPHICS[tileId]) {
                objectContent = CHAIR_GRAPHICS[tileId];
            }
            // Grand two-tile doors (N/S extend horizontally, E/W extend vertically)
            else if (tileId === 'GRAND_DOOR_N') {
                // Get wall style for the wall above the door
                let wallStyle = biome as string;
                if (zoneName) {
                    const cultural = getCulturalWallStyle(zoneName);
                    if (cultural) wallStyle = cultural;
                }
                // Get wall colors for the doorway surround
                const doorWallColors = getDirectionalWallColors(wallStyle);
                return (
                    <div className="absolute pointer-events-none overflow-visible" style={{ top: '-100%', left: 0, width: '200%', height: '200%', overflow: 'visible' }}>
                        <svg viewBox="0 -24 48 48" className="w-full h-full overflow-visible" style={{ overflow: 'visible' }}>
                            {/* Wall above door - simple colored backdrop with cultural color */}
                            <rect x="0" y="-24" width="48" height="24" fill={doorWallColors.base}/>
                            {/* Decorative molding at top */}
                            <rect x="0" y="-24" width="48" height="2" fill={doorWallColors.highlight} opacity="0.8"/>
                            {/* Trim line */}
                            <rect x="0" y="-2" width="48" height="2" fill={doorWallColors.highlight} opacity="0.6"/>
                            {/* Floor pattern underneath door area */}
                            <rect x="0" y="0" width="48" height="24" fill={floorPattern}/>
                            {/* Grand door graphics */}
                            {generateGrandDoorN(x, y)}
                        </svg>
                    </div>
                );
            }
            else if (tileId === 'GRAND_DOOR_S') {
                return (
                    <div className="absolute pointer-events-none overflow-visible" style={{ top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}>
                        <svg viewBox="0 0 48 24" className="overflow-visible" style={{ width: '200%', height: '100%', overflow: 'visible' }}>
                            <rect width="48" height="24" fill={floorPattern}/>
                            {generateGrandDoorS(x, y)}
                        </svg>
                    </div>
                );
            }
            else if (tileId === 'GRAND_DOOR_E') {
                // East door: 2 tiles tall, extends DOWN from anchor tile
                return (
                    <div className="absolute pointer-events-none overflow-visible" style={{ top: 0, left: 0, width: '100%', height: '200%', overflow: 'visible' }}>
                        <svg viewBox="0 0 24 48" className="overflow-visible w-full h-full" style={{ overflow: 'visible' }}>
                            {generateGrandDoorE(x, y)}
                        </svg>
                    </div>
                );
            }
            else if (tileId === 'GRAND_DOOR_W') {
                // West door: 2 tiles tall, extends DOWN from anchor tile
                return (
                    <div className="absolute pointer-events-none overflow-visible" style={{ top: 0, left: 0, width: '100%', height: '200%', overflow: 'visible' }}>
                        <svg viewBox="0 0 24 48" className="overflow-visible w-full h-full" style={{ overflow: 'visible' }}>
                            {generateGrandDoorW(x, y)}
                        </svg>
                    </div>
                );
            }
            // Door graphics - use tall doors that include wall above them
            else if (tileId === 'DOOR_N') {
                // Get wall style from zone
                let wallStyle = biome as string;
                if (zoneName) {
                    const cultural = getCulturalWallStyle(zoneName);
                    if (cultural) wallStyle = cultural;
                }
                return (
                    <div className="absolute pointer-events-none overflow-visible" style={{ top: '-100%', left: 0, width: '100%', height: '200%', overflow: 'visible' }}>
                        <svg viewBox="0 -24 24 48" className="w-full h-full overflow-visible" style={{ overflow: 'visible' }}>
                            <rect x="0" y="0" width="24" height="24" fill={floorPattern}/>
                            {generateTallDoorN(x, y, wallStyle)}
                        </svg>
                    </div>
                );
            }
            else if (tileId === 'DOOR_S') {
                let wallStyle = biome as string;
                if (zoneName) {
                    const cultural = getCulturalWallStyle(zoneName);
                    if (cultural) wallStyle = cultural;
                }
                return (
                    <div className="absolute pointer-events-none overflow-visible" style={{ top: '-100%', left: 0, width: '100%', height: '200%', overflow: 'visible' }}>
                        <svg viewBox="0 -24 24 48" className="w-full h-full overflow-visible" style={{ overflow: 'visible' }}>
                            <rect x="0" y="0" width="24" height="24" fill={floorPattern}/>
                            {generateTallDoorS(x, y, wallStyle)}
                        </svg>
                    </div>
                );
            }
            else if (tileId === 'DOOR_E') {
                let wallStyle = biome as string;
                if (zoneName) {
                    const cultural = getCulturalWallStyle(zoneName);
                    if (cultural) wallStyle = cultural;
                }
                return (
                    <div className="absolute pointer-events-none overflow-visible" style={{ top: '-100%', left: 0, width: '100%', height: '200%', overflow: 'visible' }}>
                        <svg viewBox="0 -24 24 48" className="w-full h-full overflow-visible" style={{ overflow: 'visible' }}>
                            <rect x="0" y="0" width="24" height="24" fill={floorPattern}/>
                            {generateTallDoorE(x, y, wallStyle)}
                        </svg>
                    </div>
                );
            }
            else if (tileId === 'DOOR_W') {
                let wallStyle = biome as string;
                if (zoneName) {
                    const cultural = getCulturalWallStyle(zoneName);
                    if (cultural) wallStyle = cultural;
                }
                return (
                    <div className="absolute pointer-events-none overflow-visible" style={{ top: '-100%', left: 0, width: '100%', height: '200%', overflow: 'visible' }}>
                        <svg viewBox="0 -24 24 48" className="w-full h-full overflow-visible" style={{ overflow: 'visible' }}>
                            <rect x="0" y="0" width="24" height="24" fill={floorPattern}/>
                            {generateTallDoorW(x, y, wallStyle)}
                        </svg>
                    </div>
                );
            }
            // Fallback for any other door types that might exist
            else if (tileId && DOOR_GRAPHICS[tileId]) {
                objectContent = DOOR_GRAPHICS[tileId];
            }
            // Machine graphics - strip animations if far from player
            else if (tileId && MACHINE_GRAPHICS[tileId]) {
                objectContent = maybeStripAnimations(MACHINE_GRAPHICS[tileId], animate) as JSX.Element;
            }
            // Statue graphics
            else if (tileId && STATUE_GRAPHICS[tileId]) {
                objectContent = STATUE_GRAPHICS[tileId];
            }
            // Village graphics - strip animations if far from player
            else if (tileId && VILLAGE_GRAPHICS[tileId]) {
                objectContent = maybeStripAnimations(VILLAGE_GRAPHICS[tileId], animate) as JSX.Element;
            }
            // Trocadéro graphics - strip animations if far from player
            else if (tileId && TROCADERO_GRAPHICS[tileId]) {
                objectContent = maybeStripAnimations(TROCADERO_GRAPHICS[tileId], animate) as JSX.Element;
            }
            // Rotunda / Napoleon's Tomb graphics
            else if (tileId && ROTUNDA_GRAPHICS[tileId]) {
                objectContent = ROTUNDA_GRAPHICS[tileId];
            }
            // Fountain graphics - strip animations if far from player (fountains have lots of water animations)
            else if (tileId && FOUNTAIN_GRAPHICS[tileId]) {
                objectContent = maybeStripAnimations(FOUNTAIN_GRAPHICS[tileId], animate) as JSX.Element;
            }
            // Multi-tile structures
            else if (tileId === 'KIOSK') {
                objectContent = generateKiosk(x, y);
            }
            else if (tileId === 'AQUARIUM') {
                objectContent = maybeStripAnimations(generateAquariumTank(x, y), animate) as JSX.Element;
            }
            // Two-tile tall objects
            else if (tileId === 'TALL_TREE_TOP') {
                objectContent = TALL_TREE_TOP;
            }
            else if (tileId === 'TALL_TREE_BOTTOM') {
                objectContent = TALL_TREE_BOTTOM;
            }
            else if (tileId === 'TALL_LAMP_TOP') {
                objectContent = TALL_LAMP_TOP;
            }
            else if (tileId === 'TALL_LAMP_BOTTOM') {
                objectContent = TALL_LAMP_BOTTOM;
            }
            // Display case with cultural variants - Victorian museum style
            else if (tileId === 'DISPLAY') {
            const culture = zoneName ? getCulturalContext(zoneName) : 'french';
            const isWideCase = seed > 0.5;
            const colorVariant = Math.floor(seed * 4);
            const styleVariant = Math.floor((seed * 2.7) % 1 * 3);

            // Rich wood color variations for Victorian cabinets
            const woodColors = ['#3D2314', '#4A2C17', '#2D1810', '#5C3D2E'];
            const woodHighlights = ['#6B4423', '#7A4B2A', '#5D3A1A', '#8B5A3C'];
            const brassColors = ['#B8860B', '#D4AF37', '#C5A028', '#AA8C2C'];
            const velvetColors = ['#4A1A2C', '#1A2A4A', '#2A4A1A', '#3D1A1A'];

            const baseWood = woodColors[colorVariant];
            const woodHighlight = woodHighlights[colorVariant];
            const brassColor = brassColors[(colorVariant + styleVariant) % 4];
            const velvetColor = velvetColors[styleVariant];

            if (isWideCase) {
                // 2-tile wide Victorian cabinet - ornate with carved details
                objectContent = (
                    <g>
                        {/* Shadow */}
                        <ellipse cx="24" cy="23" rx="23" ry="2.5" fill="#000" opacity="0.25"/>

                        {/* Cabinet base with carved feet */}
                        <rect x="-1" y="18" width="50" height="6" fill={baseWood}/>
                        <rect x="0" y="19" width="48" height="4" fill={woodHighlight}/>
                        {/* Carved ball feet */}
                        <ellipse cx="4" cy="22" rx="3" ry="2" fill={baseWood}/>
                        <ellipse cx="4" cy="21.5" rx="2.5" ry="1.5" fill={woodHighlight}/>
                        <ellipse cx="24" cy="22" rx="3" ry="2" fill={baseWood}/>
                        <ellipse cx="24" cy="21.5" rx="2.5" ry="1.5" fill={woodHighlight}/>
                        <ellipse cx="44" cy="22" rx="3" ry="2" fill={baseWood}/>
                        <ellipse cx="44" cy="21.5" rx="2.5" ry="1.5" fill={woodHighlight}/>

                        {/* Cabinet body */}
                        <rect x="0" y="2" width="48" height="16" fill={baseWood}/>
                        <rect x="1" y="3" width="46" height="14" fill={woodHighlight}/>

                        {/* Decorative molding top */}
                        <rect x="-1" y="0" width="50" height="3" fill={baseWood}/>
                        <rect x="0" y="1" width="48" height="1.5" fill={brassColor}/>
                        {/* Brass finials */}
                        <circle cx="2" cy="0" r="2" fill={brassColor}/>
                        <circle cx="24" cy="0" r="2" fill={brassColor}/>
                        <circle cx="46" cy="0" r="2" fill={brassColor}/>

                        {/* Glass panels with brass frames */}
                        <rect x="3" y="4" width="19" height="12" fill="#0A0A12"/>
                        <rect x="4" y="5" width="17" height="10" fill="#D8E8F0" opacity="0.85"/>
                        <rect x="26" y="4" width="19" height="12" fill="#0A0A12"/>
                        <rect x="27" y="5" width="17" height="10" fill="#D8E8F0" opacity="0.85"/>

                        {/* Brass frame details */}
                        <rect x="2" y="3" width="21" height="1" fill={brassColor}/>
                        <rect x="2" y="16" width="21" height="1" fill={brassColor}/>
                        <rect x="2" y="3" width="1" height="14" fill={brassColor}/>
                        <rect x="22" y="3" width="1" height="14" fill={brassColor}/>
                        <rect x="25" y="3" width="21" height="1" fill={brassColor}/>
                        <rect x="25" y="16" width="21" height="1" fill={brassColor}/>
                        <rect x="25" y="3" width="1" height="14" fill={brassColor}/>
                        <rect x="45" y="3" width="1" height="14" fill={brassColor}/>

                        {/* Center divider with brass keyhole */}
                        <rect x="23" y="2" width="2" height="16" fill={baseWood}/>
                        <ellipse cx="24" cy="14" rx="1" ry="1.5" fill={brassColor}/>
                        <rect x="23.5" y="14" width="1" height="2" fill={brassColor}/>

                        {/* Velvet display bases inside */}
                        <rect x="5" y="12" width="15" height="2" fill={velvetColor}/>
                        <rect x="28" y="12" width="15" height="2" fill={velvetColor}/>

                        {/* Glass reflections */}
                        <path d="M5 6 L9 10 L7 12 L3 8 Z" fill="#FFFFFF" opacity="0.2"/>
                        <path d="M28 6 L32 10 L30 12 L26 8 Z" fill="#FFFFFF" opacity="0.2"/>

                        {/* Cultural artifacts inside */}
                        {culture === 'japanese' && (
                            <>
                                <ellipse cx="12" cy="9" rx="3" ry="5" fill="#F5F5F0"/>
                                <path d="M11 5 Q9 7 11 9 Q13 7 11 5" fill="#1E4D8C"/>
                                <path d="M13 6 Q11 8 13 10 Q15 8 13 6" fill="#8B2323"/>
                                <rect x="32" y="7" width="6" height="5" fill="#8B0000"/>
                                <rect x="33" y="8" width="4" height="3" fill="#FFD700" opacity="0.6"/>
                            </>
                        )}
                        {culture === 'chinese' && (
                            <>
                                <ellipse cx="12" cy="9" rx="4" ry="4" fill="#C41E3A"/>
                                <circle cx="12" cy="9" r="2" fill="#FFD700"/>
                                <rect x="31" y="6" width="7" height="6" fill="#228B22" rx="1"/>
                                <path d="M34 7 L35 11 M32 9 L38 9" stroke="#FFD700" strokeWidth="0.5"/>
                            </>
                        )}
                        {culture === 'egyptian' && (
                            <>
                                <path d="M9 12 L12 4 L15 12 Z" fill="#D4B896"/>
                                <path d="M10 12 L12 6 L14 12 Z" fill="#E8D4B8"/>
                                <rect x="32" y="6" width="5" height="6" fill="#1E3A5F"/>
                                <circle cx="34.5" cy="7.5" r="1.5" fill="#FFD700"/>
                            </>
                        )}
                        {(culture === 'french' || culture === 'art') && (
                            <>
                                <ellipse cx="12" cy="8" rx="3" ry="5" fill="#CD7F32"/>
                                <ellipse cx="12" cy="7" rx="2.5" ry="4" fill="#D4944A"/>
                                <circle cx="35" cy="10" r="3" fill="#F5F5F0"/>
                                <circle cx="35" cy="6" r="2" fill="#2F2F2F"/>
                            </>
                        )}

                        {/* Brass plate label */}
                        <rect x="18" y="19" width="12" height="2" fill={brassColor}/>
                        <rect x="19" y="19.5" width="10" height="1" fill="#000" opacity="0.2"/>
                    </g>
                );
            } else {
                // 1-tile glass dome on pedestal - Victorian cloche style
                objectContent = (
                    <g>
                        {/* Shadow */}
                        <ellipse cx="12" cy="22" rx="9" ry="2" fill="#000" opacity="0.2"/>

                        {/* Ornate wooden pedestal */}
                        <rect x="3" y="18" width="18" height="6" fill={baseWood}/>
                        <rect x="4" y="19" width="16" height="4" fill={woodHighlight}/>
                        {/* Carved detail on pedestal */}
                        <rect x="2" y="17" width="20" height="2" fill={baseWood}/>
                        <rect x="3" y="17.5" width="18" height="1" fill={brassColor}/>
                        {/* Pedestal feet */}
                        <ellipse cx="5" cy="22" rx="2" ry="1.5" fill={baseWood}/>
                        <ellipse cx="19" cy="22" rx="2" ry="1.5" fill={baseWood}/>

                        {/* Velvet base inside dome */}
                        <ellipse cx="12" cy="15" rx="6" ry="2" fill={velvetColor}/>
                        <ellipse cx="12" cy="14.5" rx="5.5" ry="1.5" fill={velvetColor} opacity="0.8"/>

                        {/* Glass dome - bell jar style */}
                        <ellipse cx="12" cy="8" rx="7" ry="8" fill="#E8F4F8" opacity="0.3"/>
                        <ellipse cx="12" cy="8" rx="6.5" ry="7.5" fill="none" stroke="#B8C4C8" strokeWidth="0.5"/>
                        <path d="M5 8 Q5 1 12 0 Q19 1 19 8" fill="none" stroke="#D0D8DC" strokeWidth="1"/>

                        {/* Brass dome top finial */}
                        <circle cx="12" cy="0" r="1.5" fill={brassColor}/>
                        <ellipse cx="12" cy="1" rx="1" ry="0.5" fill={brassColor}/>

                        {/* Glass reflection highlight */}
                        <path d="M7 4 Q9 2 10 6 Q8 8 6 6 Z" fill="#FFFFFF" opacity="0.35"/>

                        {/* Brass rim at base of dome */}
                        <ellipse cx="12" cy="15" rx="7" ry="2" fill="none" stroke={brassColor} strokeWidth="1"/>

                        {/* Cultural item inside dome */}
                        {culture === 'japanese' && (
                            <>
                                <ellipse cx="12" cy="10" rx="2.5" ry="4" fill="#F8F8F5"/>
                                <path d="M11 7 Q10 9 11 11 Q12 9 11 7" fill="#2E5090"/>
                                <path d="M13 8 Q12 10 13 12" stroke="#8B2323" strokeWidth="0.5" fill="none"/>
                            </>
                        )}
                        {culture === 'chinese' && (
                            <>
                                <ellipse cx="12" cy="10" rx="3" ry="3.5" fill="#B22222"/>
                                <circle cx="12" cy="9" r="1.5" fill="#FFD700"/>
                                <path d="M10 11 L14 11" stroke="#FFD700" strokeWidth="0.5"/>
                            </>
                        )}
                        {culture === 'egyptian' && (
                            <>
                                <path d="M10 13 L12 5 L14 13 Z" fill="#D4B896"/>
                                <path d="M10.5 13 L12 7 L13.5 13 Z" fill="#E8D4B8"/>
                                <circle cx="12" cy="6" r="1" fill="#FFD700"/>
                            </>
                        )}
                        {(culture === 'french' || culture === 'art') && (
                            <>
                                <ellipse cx="12" cy="9" rx="2" ry="4" fill="#CD7F32"/>
                                <ellipse cx="12" cy="8.5" rx="1.5" ry="3.5" fill="#D4944A"/>
                                <ellipse cx="12" cy="7" rx="1" ry="1.5" fill="#E8B87C"/>
                            </>
                        )}

                        {/* Small brass label plate */}
                        <rect x="8" y="20" width="8" height="1.5" fill={brassColor}/>
                    </g>
                );
            }
        }
        // Dynamic statue rendering based on zone
            else if (tileId === 'STATUE') {
            const statueType = zoneName ? getStatueType(zoneName) : 'classical';
            const material = getStatueMaterial(seed);

            // Use cultural variants for specific statue types
            if (statueType === 'asian' && STATUE_GRAPHICS['STATUE_ASIAN_TALL']) {
                objectContent = STATUE_GRAPHICS['STATUE_ASIAN_TALL'];
            } else if (statueType === 'egyptian' && STATUE_GRAPHICS['STATUE_EGYPTIAN_TALL']) {
                objectContent = STATUE_GRAPHICS['STATUE_EGYPTIAN_TALL'];
            } else if (statueType === 'african' && STATUE_GRAPHICS['STATUE_AFRICAN_TALL']) {
                objectContent = STATUE_GRAPHICS['STATUE_AFRICAN_TALL'];
            } else {
                // Default classical with material variation
                objectContent = (
                    <g>
                        <ellipse cx="13" cy="22" rx="7" ry="2" fill="#000" opacity="0.2"/>
                        <rect x="2" y="18" width="20" height="6" fill={material.shadow}/>
                        <rect x="4" y="14" width="16" height="5" fill={material.primary}/>
                        <rect x="3" y="13" width="18" height="2" fill={material.secondary}/>
                        <rect x="6" y="20" width="12" height="3" fill={material.shadow}/>
                        <ellipse cx="12" cy="6" rx="5" ry="8" fill={material.primary}/>
                        <ellipse cx="12" cy="4" rx="4.5" ry="7" fill={material.secondary}/>
                        <circle cx="12" cy="-6" r="4" fill={material.primary}/>
                        <circle cx="12" cy="-7" r="3.5" fill={material.secondary}/>
                        <rect x="10" y="-2" width="4" height="4" fill={material.primary}/>
                        <path d="M7 4 Q2 0 4 -6" stroke={material.primary} strokeWidth="3" fill="none"/>
                        <path d="M17 4 Q22 0 20 -6" stroke={material.primary} strokeWidth="3" fill="none"/>
                        <circle cx="4" cy="-6" r="1.5" fill={material.secondary}/>
                        <circle cx="20" cy="-6" r="1.5" fill={material.secondary}/>
                        <path d="M7 10 Q12 8 17 10 L16 14 Q12 12 8 14 Z" fill={material.highlight}/>
                        <ellipse cx="11" cy="-8" rx="0.5" ry="0.3" fill={material.shadow}/>
                        <ellipse cx="13" cy="-8" rx="0.5" ry="0.3" fill={material.shadow}/>
                        <path d="M8 -10 Q12 -14 16 -10" fill={material.highlight}/>
                    </g>
                );
            }
        }
        } // Close the else block for semantic ID lookups

        if (!objectContent) return null;

        // Objects that should NOT have additional shadow (includes 2x2 Corliss tiles which have their own floor)
        // Also includes all 2x2 pylon tiles (⌜⌝⌞⌟⎡⎤⎣⎦⎧⎫⎩⎭⟦⟧⟨⟩)
        const noShadowObjects = new Set(['n', 'p', 'w', 'r', 'f', 'a', 'u', 'D', 'Ŋ', '╔', '╗', '╚', '╝', '⌜', '⌝', '⌞', '⌟', '⎡', '⎤', '⎣', '⎦', '⎧', '⎫', '⎩', '⎭', '⟦', '⟧', '⟨', '⟩']);
        const needsShadow = !noShadowObjects.has(char);

        // Multi-tile structures that extend beyond their tile bounds
        // Includes kiosk (K), aquariums, displays, 2x2 Corliss engine (╔╗╚╝), flagpole (y), columns (c), carriages (©)
        // Also includes all 2x2 pylon tiles for Eiffel Tower (⌜⌝⌞⌟⎡⎤⎣⎦⎧⎫⎩⎭⟦⟧⟨⟩)
        const multiTileStructures = new Set(['K', 'N', 'Q', '≡', 'D', 'Ŋ', '⊓', '⊔', '⊐', '⊏', '╔', '╗', '╚', '╝', 'y', 'c', '©', '⌜', '⌝', '⌞', '⌟', '⎡', '⎤', '⎣', '⎦', '⎧', '⎫', '⎩', '⎭', '⟦', '⟧', '⟨', '⟩']);
        const isMultiTileObj = multiTileStructures.has(char);

        return (
            <div className={`absolute pointer-events-none ${isMultiTileObj ? 'overflow-visible' : 'inset-0'}`}
                 style={isMultiTileObj ? { top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' } : undefined}>
                <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible" style={isMultiTileObj ? { overflow: 'visible' } : undefined}>
                    <rect width="24" height="24" fill={floorPattern}/>
                    {needsShadow && (
                        <g opacity="0.15">
                            <ellipse cx="14" cy="21" rx="7" ry="2" fill="#000"/>
                        </g>
                    )}
                    {objectContent}
                </svg>
            </div>
        );
    }

    // TERRAIN TILES: Render as complete tiles

    // Floor tile variation helpers
    const tileVariant = Math.floor(seed * 3);
    const tileRotation = Math.floor(seed * 4) * 90;
    const tileShade = 0.95 + (seed * 0.1);
    const hasScuff = seed > 0.8;
    const hasCrack = seed > 0.92;
    const scuffX = Math.floor(seed * 18) + 3;
    const scuffY = Math.floor((seed * 1.5) % 1 * 18) + 3;

    // Floor - with procedural marble veining
    if (char === '.') {
        // Generate unique vein pattern using seed
        // Each seed generates different control points for bezier curves
        const seed2 = (seed * 2.7182818) % 1; // Second seed for variety
        const seed3 = (seed * 3.1415926) % 1; // Third seed

        // Vein start/end points - subtle diagonal flow
        const veinStartX = seed * 8;
        const veinStartY = seed2 * 6;
        const veinEndX = 16 + seed3 * 8;
        const veinEndY = 18 + seed * 6;

        // Control points for bezier curve
        const cp1x = 4 + seed2 * 16;
        const cp1y = 6 + seed3 * 8;
        const cp2x = 8 + seed * 12;
        const cp2y = 14 + seed2 * 6;

        // Secondary vein (thinner, branches off)
        const hasSecondVein = seed > 0.3;
        const vein2StartX = cp1x;
        const vein2StartY = cp1y;
        const vein2EndX = seed3 * 10 + 14;
        const vein2EndY = seed2 * 8;

        // Vein color - subtle gray with slight variation
        const veinOpacity = 0.06 + seed * 0.04; // 0.06-0.10
        const veinWidth = 0.3 + seed2 * 0.4; // 0.3-0.7

        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    <rect width="24" height="24" fill={floorPattern}/>
                    {/* Marble veining - main vein */}
                    <path
                        d={`M${veinStartX} ${veinStartY} C${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${veinEndX} ${veinEndY}`}
                        stroke="#4A5568"
                        strokeWidth={veinWidth}
                        opacity={veinOpacity}
                        fill="none"
                    />
                    {/* Secondary vein - branches off main */}
                    {hasSecondVein && (
                        <path
                            d={`M${vein2StartX} ${vein2StartY} Q${vein2StartX + 4} ${(vein2StartY + vein2EndY) / 2}, ${vein2EndX} ${vein2EndY}`}
                            stroke="#718096"
                            strokeWidth={veinWidth * 0.6}
                            opacity={veinOpacity * 0.7}
                            fill="none"
                        />
                    )}
                    {/* Subtle tile shade variation */}
                    <g style={{ transform: `rotate(${tileRotation}deg)`, transformOrigin: '12px 12px' }}>
                        <rect width="24" height="24" fill={tileShade < 1 ? '#000' : '#fff'} opacity={Math.abs(1 - tileShade) * 0.08}/>
                    </g>
                    {/* Occasional scuff marks */}
                    {hasScuff && (
                        <ellipse cx={scuffX} cy={scuffY} rx="2" ry="1" fill="#000" opacity="0.05" transform={`rotate(${seed * 180}, ${scuffX}, ${scuffY})`}/>
                    )}
                    {/* Tile edge lines - subtle grout */}
                    {tileVariant === 0 && <rect x="0" y="23" width="24" height="1" fill="#000" opacity="0.04"/>}
                    {tileVariant === 1 && <rect x="23" y="0" width="1" height="24" fill="#000" opacity="0.04"/>}
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
        const bladeOffsetX = seed * 6;
        const bladeOffsetY = (seed * 1.3) % 1 * 6;
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    <rect width="24" height="24" fill="url(#pattern-grass)"/>
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
                    <circle cx={6 + seed * 12} cy={8 + seed * 8} r="1.5" fill="#D0C0B0" opacity="0.4"/>
                    <circle cx={16 - seed * 8} cy={16 + seed * 4} r="1" fill="#E0D0C0" opacity="0.3"/>
                    {tileVariant === 2 && (
                        <circle cx={12} cy={12} r="2" fill="#C0B0A0" opacity="0.25"/>
                    )}
                </svg>
            </div>
        );
    }

    // Wall
    if (char === '#') {
        // Use Haussmann-style facades for street biome walls
        if (biome === 'STREET') {
            return (
                <div className="absolute inset-0 pointer-events-none">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                        {generateHaussmannFacade(x, y)}
                    </svg>
                </div>
            );
        }

        // Use Souk-style facades for SOUK biome (Rue du Caire) - 50/50 window chance
        if (biome === 'SOUK') {
            return (
                <div className="absolute inset-0 pointer-events-none">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                        {generateSoukFacade(x, y)}
                    </svg>
                </div>
            );
        }

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

    // Directional walls
    if (char === '▲' || char === '▼' || char === '►' || char === '◄') {
        // Use Haussmann-style side walls for street biome (side walls only, not back wall)
        // Back wall (▲) now uses the tall wall system below for consistency
        if (biome === 'STREET') {
            if (char === '►') {
                return (
                    <div className="absolute inset-0 pointer-events-none">
                        <svg viewBox="0 0 24 24" className="w-full h-full">
                            {generateHaussmannSide(x, y, 'right')}
                        </svg>
                    </div>
                );
            }
            if (char === '◄') {
                return (
                    <div className="absolute inset-0 pointer-events-none">
                        <svg viewBox="0 0 24 24" className="w-full h-full">
                            {generateHaussmannSide(x, y, 'left')}
                        </svg>
                    </div>
                );
            }
            // ▼ stays dark (ground/shadow) for all biomes
            if (char === '▼') {
                return (
                    <div className="absolute inset-0 pointer-events-none">
                        <svg viewBox="0 0 24 24" className="w-full h-full">
                            <rect width="24" height="24" fill="#1A1A2E"/>
                            <rect x="0" y="0" width="24" height="2" fill="#2D3748"/>
                            <rect x="0" y="2" width="24" height="1" fill="#0D0D1A"/>
                        </svg>
                    </div>
                );
            }
            // ▲ (back wall) falls through to the tall wall system below
        }

        let wallKey = biome as string;
        if (zoneName) {
            const culturalWall = getCulturalWallStyle(zoneName);
            if (culturalWall) {
                wallKey = culturalWall;
            }
        }
        const colors = getDirectionalWallColors(wallKey);

        if (char === '▲') {
            // Use tall back wall with dollhouse effect for interior AND garden spaces
            // Gardens get stone walls/hedges, interiors get wainscoting
            const isGarden = isGardenBiome(biome as string);
            const isBuilding = isBuildingBiome(biome as string);
            const shouldUseTallWall = isBuilding || isGarden || wallKey !== biome;

            if (shouldUseTallWall) {
                // IMPORTANT: Garden biomes ALWAYS use biome directly to get garden walls
                // Only use cultural wallKey for interior biomes
                const styleToUse = isGarden ? biome as string : wallKey;
                return (
                    <div className="absolute pointer-events-none overflow-visible" style={{ top: '-100%', left: 0, width: '100%', height: '200%', overflow: 'visible' }}>
                        <svg viewBox="0 -24 24 48" className="w-full h-full overflow-visible" style={{ overflow: 'visible' }}>
                            {generateTallBackWall(x, y, styleToUse)}
                        </svg>
                    </div>
                );
            }

            return (
                <div className="absolute inset-0 pointer-events-none">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                        <rect width="24" height="20" fill={colors.base}/>
                        <rect x="0" y="0" width="24" height="2" fill={colors.highlight} opacity="0.8"/>
                        <rect x="0" y="18" width="24" height="2" fill={colors.highlight} opacity="0.6"/>
                        <rect x="0" y="20" width="24" height="4" fill="#1A1A2E"/>
                        <line x1="0" y1="10" x2="24" y2="10" stroke={colors.highlight} strokeWidth="0.5" opacity="0.3"/>
                    </svg>
                </div>
            );
        }

        if (char === '▼') {
            return (
                <div className="absolute inset-0 pointer-events-none">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                        <rect width="24" height="24" fill="#1A1A2E"/>
                        <rect x="0" y="0" width="24" height="2" fill="#2D3748"/>
                        <rect x="0" y="2" width="24" height="1" fill="#0D0D1A"/>
                    </svg>
                </div>
            );
        }

        if (char === '►') {
            return (
                <div className="absolute inset-0 pointer-events-none">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                        <rect width="24" height="24" fill={colors.side}/>
                        <rect x="0" y="0" width="2" height="24" fill="#4A5568" opacity="0.3"/>
                        <rect x="22" y="0" width="2" height="24" fill="#0D0D1A" opacity="0.5"/>
                        <line x1="0" y1="8" x2="24" y2="8" stroke="#1A1A2E" strokeWidth="0.5" opacity="0.4"/>
                        <line x1="0" y1="16" x2="24" y2="16" stroke="#1A1A2E" strokeWidth="0.5" opacity="0.4"/>
                    </svg>
                </div>
            );
        }

        if (char === '◄') {
            return (
                <div className="absolute inset-0 pointer-events-none">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                        <rect width="24" height="24" fill={colors.side}/>
                        <rect x="0" y="0" width="2" height="24" fill="#0D0D1A" opacity="0.5"/>
                        <rect x="22" y="0" width="2" height="24" fill="#4A5568" opacity="0.3"/>
                        <line x1="0" y1="8" x2="24" y2="8" stroke="#1A1A2E" strokeWidth="0.5" opacity="0.4"/>
                        <line x1="0" y1="16" x2="24" y2="16" stroke="#1A1A2E" strokeWidth="0.5" opacity="0.4"/>
                    </svg>
                </div>
            );
        }
    }

    // Corner walls - top corners (┌, ┐) extend upward to match tall back walls
    if (char === '┌' || char === '┐' || char === '└' || char === '┘') {
        // Determine wall style for corners
        let wallKey = biome as string;
        if (zoneName) {
            const culturalWall = getCulturalWallStyle(zoneName);
            if (culturalWall) {
                wallKey = culturalWall;
            }
        }
        // Use biome directly for garden styles
        const styleToUse = isGardenBiome(biome as string) ? biome as string : wallKey;
        const shouldUseTallCorner = isBuildingBiome(biome as string) ||
                                    isGardenBiome(biome as string) ||
                                    wallKey !== biome;

        if (char === '┌') {
            if (shouldUseTallCorner) {
                return (
                    <div className="absolute pointer-events-none overflow-visible" style={{ top: '-100%', left: 0, width: '100%', height: '200%', overflow: 'visible' }}>
                        <svg viewBox="0 -24 24 48" className="w-full h-full overflow-visible" style={{ overflow: 'visible' }}>
                            {generateTallCornerNW(x, y, styleToUse)}
                        </svg>
                    </div>
                );
            }
            return (
                <div className="absolute inset-0 pointer-events-none">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                        <rect width="24" height="24" fill="#2D3748"/>
                        <rect x="0" y="0" width="24" height="2" fill="#4A5568"/>
                        <rect x="0" y="0" width="2" height="24" fill="#1A1A2E"/>
                        <rect x="2" y="2" width="4" height="4" fill="#1A1A2E" opacity="0.5"/>
                    </svg>
                </div>
            );
        }
        if (char === '┐') {
            if (shouldUseTallCorner) {
                return (
                    <div className="absolute pointer-events-none overflow-visible" style={{ top: '-100%', left: 0, width: '100%', height: '200%', overflow: 'visible' }}>
                        <svg viewBox="0 -24 24 48" className="w-full h-full overflow-visible" style={{ overflow: 'visible' }}>
                            {generateTallCornerNE(x, y, styleToUse)}
                        </svg>
                    </div>
                );
            }
            return (
                <div className="absolute inset-0 pointer-events-none">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                        <rect width="24" height="24" fill="#2D3748"/>
                        <rect x="0" y="0" width="24" height="2" fill="#4A5568"/>
                        <rect x="22" y="0" width="2" height="24" fill="#1A1A2E"/>
                        <rect x="18" y="2" width="4" height="4" fill="#1A1A2E" opacity="0.5"/>
                    </svg>
                </div>
            );
        }
        // Bottom corners (└, ┘) stay simple - they represent floor-level shadow/depth
        if (char === '└') {
            return (
                <div className="absolute inset-0 pointer-events-none">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                        <rect width="24" height="24" fill="#1A1A2E"/>
                        <rect x="0" y="0" width="2" height="24" fill="#0D0D1A"/>
                        <rect x="0" y="22" width="24" height="2" fill="#0D0D1A"/>
                    </svg>
                </div>
            );
        }
        if (char === '┘') {
            return (
                <div className="absolute inset-0 pointer-events-none">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                        <rect width="24" height="24" fill="#1A1A2E"/>
                        <rect x="22" y="0" width="2" height="24" fill="#0D0D1A"/>
                        <rect x="0" y="22" width="24" height="2" fill="#0D0D1A"/>
                    </svg>
                </div>
            );
        }
    }

    // Back wall with sconce overlay - renders tall back wall + sconce on top
    if (char === '⌃') {
        let wallKey = biome as string;
        if (zoneName) {
            const culturalWall = getCulturalWallStyle(zoneName);
            if (culturalWall) {
                wallKey = culturalWall;
            }
        }
        const styleToUse = isGardenBiome(biome as string) ? biome as string : wallKey;

        return (
            <div className="absolute pointer-events-none overflow-visible" style={{ top: '-100%', left: 0, width: '100%', height: '200%', overflow: 'visible' }}>
                <svg viewBox="0 -24 24 48" className="w-full h-full overflow-visible" style={{ overflow: 'visible' }}>
                    {/* Tall back wall as background */}
                    {generateTallBackWall(x, y, styleToUse)}
                    {/* Sconce overlay positioned on upper wall area */}
                    <g transform="translate(0, -12)">
                        {generateWallSconce('down')}
                    </g>
                </svg>
            </div>
        );
    }

    // Shadow tile
    if (char === '░') {
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    <rect width="24" height="24" fill={floorPattern}/>
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

    // Check for terrain tiles that use generators (like water)
    const terrainTileId = getTileId(char);
    const tileDefinition = terrainTileId ? resolveTile(char) : null;

    // If terrain tile has a generator, use it for position-based variation
    if (tileDefinition?.generator && GENERATORS[tileDefinition.generator]) {
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible">
                    {GENERATORS[tileDefinition.generator](x, y)}
                </svg>
            </div>
        );
    }

    // Other terrain tiles with static graphics (lookup by semantic ID)
    const terrainRenderer = terrainTileId ? TERRAIN_GRAPHICS[terrainTileId] : null;
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
    prev.zoneName === next.zoneName &&
    prev.animate === next.animate
);
