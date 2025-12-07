import { BiomeType } from '../../types';

// Neighbor tiles for transition effects (N, S, E, W)
export interface TileNeighbors {
    n?: string;  // North neighbor tile char
    s?: string;  // South neighbor tile char
    e?: string;  // East neighbor tile char
    w?: string;  // West neighbor tile char
}

export interface MapTileProps {
    char: string;
    x: number;
    y: number;
    themeColor: string;
    biome?: BiomeType;
    zoneName?: string;
    // Flag state: 'raised' (default), 'lowered', or a number 0-1 for animation progress
    flagState?: 'raised' | 'lowered' | number;
    // Whether to render animations (for performance - only animate tiles near player)
    animate?: boolean;
    // Adjacent tile chars for transition effects
    neighbors?: TileNeighbors;
}

export interface TileRenderContext {
    x: number;
    y: number;
    seed: number;
    biome: BiomeType;
    zoneName?: string;
    floorPattern: string;
}

// Material palette for statues and display cases
export interface MaterialPalette {
    primary: string;
    secondary: string;
    highlight: string;
    shadow: string;
}

// Cultural styles for walls and decorations
export type CulturalStyle =
    | 'JAPANESE'
    | 'CHINESE'
    | 'PERSIAN'
    | 'EGYPTIAN'
    | 'MOORISH'
    | 'ITALIAN'
    | 'SOUK'
    | 'HIEROGLYPH'
    | 'MESOAMERICAN'
    | 'PORTUGUESE'
    | 'SPANISH'
    | 'RUSSIAN'
    | 'INDIAN'
    | 'GREEK'
    | 'SOUTH_AMERICAN'
    | 'AFRICAN'
    | 'SOUTHEAST_ASIAN'
    | 'BEAUX_ARTS'
    | 'TROCADERO'
    | 'GALERIE'
    | 'DEFAULT';
