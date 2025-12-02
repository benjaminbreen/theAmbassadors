import React from 'react';
import { BiomeType } from '../../types';
import { MapTileProps } from './types';
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
import { OBJECT_GRAPHICS, CHAIR_GRAPHICS, DOOR_GRAPHICS, generateFlowerbed, generateBanner } from './ObjectGraphics';
import { TERRAIN_GRAPHICS, TERRAIN_TILES } from './TerrainGraphics';
import { MACHINE_GRAPHICS } from './MachineGraphics';
import { STATUE_GRAPHICS } from './StatueGraphics';
import { WALL_TILES, getDirectionalWallColors, generateHaussmannFacade, generateSolidFacade, generateHaussmannTop, generateHaussmannSide } from './WallGraphics';
import {
    KIOSK_GRAPHIC,
    generateKiosk,
    generateTree,
    generateHedge,
    generateLamp,
    generateWallSconce,
    generateCushion,
    DISPLAY_CASE_GRAPHIC,
    AQUARIUM_GRAPHIC,
    TALL_TREE_TOP,
    TALL_TREE_BOTTOM,
    TALL_LAMP_TOP,
    TALL_LAMP_BOTTOM,
    VILLAGE_GRAPHICS,
    TROCADERO_GRAPHICS,
    FOUNTAIN_GRAPHICS,
} from './SpecialGraphics';
import {
    resolveTile,
    isObjectTile,
    hasGenerator,
    getGeneratorName,
    isMultiTile,
    TILE_REGISTRY,
    TileDefinition,
} from './TileRegistry';

// ===========================================
// GENERATOR FUNCTIONS MAP
// Maps generator names from registry to actual functions
// ===========================================
const GENERATORS: Record<string, (x: number, y: number, ctx?: any) => JSX.Element> = {
    generateTree,
    generateHedge,
    generateLamp,
    generateCushion,
    generateFlowerbed,
    generateKiosk,
};

// Generator functions that need special arguments (not just x, y)
const SPECIAL_GENERATORS: Record<string, (arg: any) => JSX.Element> = {
    generateWallSconce: (direction: 'left' | 'right' | 'down') => generateWallSconce(direction),
    generateBanner: (zoneName: string) => generateBanner(zoneName),
};

// ===========================================
// OBJECT TILES SET (legacy, kept for compatibility)
// Now derived from registry for maintainability
// ===========================================
const OBJECT_TILES = new Set([
    // Get all object-category tiles from registry
    ...Object.values(TILE_REGISTRY)
        .filter(t => isObjectTile(t.char))
        .map(t => t.char),
    // Plus any legacy chars not yet in registry
    'Ð', 'Þ', 'Ł', 'Ŧ', 'Ħ', 'Ø', 'ŧ', 'đ', 'ð',
    '¶', '§', '†', '‡', '∫', '∂',
    '¤', '¥', '£', '©', '®', '™',
    'Æ', 'µ',
    '┬', '┼', '┴', '╦', '╫', 'Ŋ'
]);

const MapTile: React.FC<MapTileProps> = ({
    char,
    x,
    y,
    biome = 'SALON',
    zoneName = '',
}) => {
    const seed = hash(x, y);
    const floorPattern = getFloorPattern(biome, zoneName);

    // OBJECT TILES: Render with terrain background
    if (OBJECT_TILES.has(char)) {
        let objectContent: JSX.Element | null = null;

        // Special handling for flowerbeds - use position-based randomized generator
        if (char === 'w') {
            objectContent = generateFlowerbed(x, y);
        }
        // Special handling for banners - use zone-based national flag colors
        else if (char === 'B') {
            objectContent = generateBanner(zoneName);
        }
        // Special handling for carpets - use zone-specific pattern
        else if (char === 'r') {
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
        // Generated trees with variety
        else if (char === 'T') {
            objectContent = generateTree(x, y);
        }
        // Generated hedges with variety
        else if (char === 'H') {
            objectContent = generateHedge(x, y);
        }
        // Generated lamps with variety
        else if (char === 'L') {
            objectContent = generateLamp(x, y);
        }
        // Wall sconces - gas lamps mounted on walls
        else if (char === '‹') {
            objectContent = generateWallSconce('left');
        }
        else if (char === '›') {
            objectContent = generateWallSconce('right');
        }
        else if (char === '¬') {
            objectContent = generateWallSconce('down');
        }
        // Cushion - use generator for variety
        else if (char === 'a') {
            objectContent = generateCushion(x, y);
        }
        // Check static object graphics first
        else if (OBJECT_GRAPHICS[char]) {
            objectContent = OBJECT_GRAPHICS[char];
        }
        // Chair orientations
        else if (CHAIR_GRAPHICS[char]) {
            objectContent = CHAIR_GRAPHICS[char];
        }
        // Door graphics (directional wood/metal/glass doors)
        else if (DOOR_GRAPHICS[char]) {
            objectContent = DOOR_GRAPHICS[char];
        }
        // Machine graphics
        else if (MACHINE_GRAPHICS[char]) {
            objectContent = MACHINE_GRAPHICS[char];
        }
        // Statue graphics
        else if (STATUE_GRAPHICS[char]) {
            objectContent = STATUE_GRAPHICS[char];
        }
        // Village graphics
        else if (VILLAGE_GRAPHICS[char]) {
            objectContent = VILLAGE_GRAPHICS[char];
        }
        // Trocadéro graphics
        else if (TROCADERO_GRAPHICS[char]) {
            objectContent = TROCADERO_GRAPHICS[char];
        }
        // Fountain graphics (basin edges, water surface, spouts, etc.)
        else if (FOUNTAIN_GRAPHICS[char]) {
            objectContent = FOUNTAIN_GRAPHICS[char];
        }
        // Multi-tile structures
        else if (char === 'K') {
            objectContent = generateKiosk(x, y);
        }
        else if (char === 'Ŋ') {
            objectContent = AQUARIUM_GRAPHIC;
        }
        // Two-tile tall objects
        else if (char === '¶') {
            objectContent = TALL_TREE_TOP;
        }
        else if (char === '¤') {
            objectContent = TALL_TREE_BOTTOM;
        }
        else if (char === '§') {
            objectContent = TALL_LAMP_TOP;
        }
        else if (char === '¥') {
            objectContent = TALL_LAMP_BOTTOM;
        }
        // Display case with cultural variants
        else if (char === 'D') {
            const culture = zoneName ? getCulturalContext(zoneName) : 'french';
            const isWideCase = seed > 0.5;
            const colorVariant = Math.floor(seed * 4);
            const styleVariant = Math.floor((seed * 2.7) % 1 * 3);

            // Wood color variations
            const woodColors = ['#5D3A1A', '#6B4423', '#4A2C17', '#7A4B2A'];
            const frameColors = ['#B8860B', '#DAA520', '#CD853F', '#8B7500'];
            const glassTints = ['#E0F4FF', '#F0F8FF', '#E8F4F8', '#F5FFFA'];

            const baseWood = woodColors[colorVariant];
            const frameColor = frameColors[(colorVariant + styleVariant) % 4];
            const glassTint = glassTints[styleVariant];

            if (isWideCase) {
                // 2-tile wide cabinet style
                objectContent = (
                    <g>
                        <ellipse cx="24" cy="22" rx="22" ry="3" fill="#000" opacity="0.15"/>
                        <rect x="0" y="16" width="48" height="8" fill={baseWood}/>
                        <rect x="1" y="17" width="46" height="6" fill={woodColors[(colorVariant + 1) % 4]}/>
                        <rect x="2" y="20" width="4" height="4" fill={woodColors[(colorVariant + 2) % 4]}/>
                        <rect x="42" y="20" width="4" height="4" fill={woodColors[(colorVariant + 2) % 4]}/>
                        <rect x="22" y="20" width="4" height="4" fill={woodColors[(colorVariant + 2) % 4]}/>
                        <rect x="0" y="15" width="48" height="2" fill={woodColors[(colorVariant + 1) % 4]}/>
                        <rect x="1" y="0" width="46" height="16" fill="#1A1A1A"/>
                        <rect x="2" y="1" width="44" height="14" fill={glassTint} opacity="0.85"/>
                        <rect x="0" y="-1" width="48" height="2" fill={frameColor}/>
                        <rect x="0" y="14" width="48" height="2" fill={frameColor}/>
                        <rect x="0" y="0" width="2" height="16" fill={frameColors[(colorVariant + 1) % 4]}/>
                        <rect x="46" y="0" width="2" height="16" fill={frameColors[(colorVariant + 2) % 4]}/>
                        <rect x="23" y="0" width="2" height="16" fill={frameColor}/>
                        <path d="M4 2 L8 6 L6 8 L2 4 Z" fill="#FFFFFF" opacity="0.3"/>
                        <rect x="3" y="10" width="42" height="4" fill="#4A1A2C"/>
                        {/* Cultural content based on zone */}
                        {culture === 'japanese' && (
                            <>
                                <ellipse cx="10" cy="8" rx="3" ry="5" fill="#E8E8E8"/>
                                <path d="M10 4 Q8 6 10 8 Q12 6 10 4" fill="#1E3A8A"/>
                                <rect x="20" y="6" width="8" height="6" fill="#8B0000"/>
                                <ellipse cx="38" cy="8" rx="4" ry="4" fill="#FFD700"/>
                            </>
                        )}
                        {culture === 'chinese' && (
                            <>
                                <ellipse cx="10" cy="8" rx="4" ry="5" fill="#8B0000"/>
                                <path d="M10 4 L10 12" stroke="#FFD700" strokeWidth="0.5"/>
                                <rect x="20" y="4" width="8" height="8" fill="#228B22" rx="1"/>
                                <circle cx="38" cy="8" r="4" fill="#FFD700"/>
                            </>
                        )}
                        {culture === 'egyptian' && (
                            <>
                                <path d="M8 10 L10 4 L12 10 Z" fill="#D4B584"/>
                                <rect x="20" y="5" width="8" height="7" fill="#1E3A8A"/>
                                <path d="M36 10 L38 2 L40 10 Z" fill="#FFD700"/>
                            </>
                        )}
                        {(culture === 'french' || culture === 'art') && (
                            <>
                                <ellipse cx="10" cy="8" rx="4" ry="6" fill="#B87333"/>
                                <rect x="19" y="5" width="10" height="7" fill="#FFD700"/>
                                <ellipse cx="38" cy="10" rx="3" ry="1" fill="#2F2F2F"/>
                                <circle cx="38" cy="4" r="3" fill="#E8E8E8"/>
                            </>
                        )}
                        <rect x="18" y="18" width="12" height="3" fill={frameColor}/>
                        <circle cx="2" cy="0" r="2" fill={frameColors[(colorVariant + 1) % 4]}/>
                        <circle cx="46" cy="0" r="2" fill={frameColor}/>
                    </g>
                );
            } else {
                // 1-tile pedestal dome style
                objectContent = (
                    <g>
                        <ellipse cx="12" cy="22" rx="8" ry="2" fill="#000" opacity="0.15"/>
                        <rect x="4" y="16" width="16" height="8" fill={baseWood}/>
                        <rect x="5" y="17" width="14" height="6" fill={woodColors[(colorVariant + 1) % 4]}/>
                        <rect x="3" y="15" width="18" height="2" fill={woodColors[(colorVariant + 1) % 4]}/>
                        <ellipse cx="12" cy="10" rx="8" ry="6" fill={glassTint} opacity="0.7"/>
                        <ellipse cx="12" cy="10" rx="7" ry="5" fill="none" stroke={frameColor} strokeWidth="1"/>
                        <path d="M8 4 Q10 2 12 4" fill="#FFFFFF" opacity="0.3"/>
                        <ellipse cx="12" cy="14" rx="5" ry="2" fill="#4A1A2C"/>
                        {/* Small cultural item inside */}
                        {culture === 'japanese' && <ellipse cx="12" cy="10" rx="3" ry="4" fill="#E8E8E8"/>}
                        {culture === 'chinese' && <circle cx="12" cy="10" r="3" fill="#8B0000"/>}
                        {culture === 'egyptian' && <path d="M10 12 L12 6 L14 12 Z" fill="#D4B584"/>}
                        {(culture === 'french' || culture === 'art') && <ellipse cx="12" cy="10" rx="2" ry="3" fill="#B87333"/>}
                        <rect x="8" y="18" width="8" height="2" fill={frameColor}/>
                    </g>
                );
            }
        }
        // Dynamic statue rendering based on zone
        else if (char === 'u') {
            const statueType = zoneName ? getStatueType(zoneName) : 'classical';
            const material = getStatueMaterial(seed);

            // Use cultural variants for specific statue types
            if (statueType === 'asian' && STATUE_GRAPHICS['Ü']) {
                objectContent = STATUE_GRAPHICS['Ü'];
            } else if (statueType === 'egyptian' && STATUE_GRAPHICS['Ö']) {
                objectContent = STATUE_GRAPHICS['Ö'];
            } else if (statueType === 'african' && STATUE_GRAPHICS['Ä']) {
                objectContent = STATUE_GRAPHICS['Ä'];
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

        if (!objectContent) return null;

        // Objects that should NOT have additional shadow
        const noShadowObjects = new Set(['n', 'p', 'w', 'r', 'f', 'a', 'u', 'D', 'Ŋ']);
        const needsShadow = !noShadowObjects.has(char);

        // Multi-tile structures that extend beyond their tile bounds
        const multiTileStructures = new Set(['K', 'N', 'Q', '≡', 'D', 'Ŋ']);
        const isMultiTile = multiTileStructures.has(char);

        return (
            <div className={`absolute pointer-events-none ${isMultiTile ? 'overflow-visible' : 'inset-0'}`}
                 style={isMultiTile ? { top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' } : undefined}>
                <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible" style={isMultiTile ? { overflow: 'visible' } : undefined}>
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

    // Floor
    if (char === '.') {
        return (
            <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    <rect width="24" height="24" fill={floorPattern}/>
                    <g style={{ transform: `rotate(${tileRotation}deg)`, transformOrigin: '12px 12px' }}>
                        <rect width="24" height="24" fill={tileShade < 1 ? '#000' : '#fff'} opacity={Math.abs(1 - tileShade) * 0.15}/>
                    </g>
                    {hasScuff && (
                        <ellipse cx={scuffX} cy={scuffY} rx="3" ry="1.5" fill="#000" opacity="0.08" transform={`rotate(${seed * 180}, ${scuffX}, ${scuffY})`}/>
                    )}
                    {hasCrack && (
                        <path d={`M${scuffX} ${scuffY} l${3 - seed * 6} ${4 - seed * 2} l${seed * 2} ${2}`} stroke="#000" strokeWidth="0.3" opacity="0.12" fill="none"/>
                    )}
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
        // Use Haussmann-style directional walls for street biome
        if (biome === 'STREET') {
            if (char === '▲') {
                return (
                    <div className="absolute inset-0 pointer-events-none">
                        <svg viewBox="0 0 24 24" className="w-full h-full">
                            {generateHaussmannTop(x, y)}
                        </svg>
                    </div>
                );
            }
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

    // Corner walls
    if (char === '┌' || char === '┐' || char === '└' || char === '┘') {
        if (char === '┌') {
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
