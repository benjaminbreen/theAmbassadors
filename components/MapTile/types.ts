import { BiomeType } from '../../types';

export interface MapTileProps {
    char: string;
    x: number;
    y: number;
    themeColor: string;
    biome?: BiomeType;
    zoneName?: string;
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
    | 'DEFAULT';
