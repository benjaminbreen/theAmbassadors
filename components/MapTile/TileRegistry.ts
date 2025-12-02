/**
 * TileRegistry.ts
 *
 * Central registry for all map tile definitions.
 * Provides semantic IDs, metadata, and character mappings for the tile system.
 *
 * This replaces the scattered character checks with a unified, self-documenting system.
 */

import { BiomeType } from '../../types';

// ===========================================
// TYPE DEFINITIONS
// ===========================================

export type TileCategory =
    | 'terrain'    // Floor, water, paths, grass
    | 'wall'       // Walls and directional walls
    | 'object'     // General objects
    | 'furniture'  // Benches, chairs, tables, cushions
    | 'flora'      // Trees, hedges, plants, flowers
    | 'lighting'   // Lamps, sconces, lanterns
    | 'machine'    // Machinery exhibits
    | 'statue'     // Statues and sculptures
    | 'door'       // Doors and entrances
    | 'fountain'   // Fountain components
    | 'village'    // Village biome specific
    | 'tower'      // Eiffel Tower specific
    | 'special';   // Multi-tile, unique structures

export interface TileDefinition {
    id: string;                    // Semantic ID: 'CUSHION', 'TREE', 'WALL'
    char: string;                  // Legacy character: 'a', 'T', '#'
    category: TileCategory;
    name: string;                  // Human readable: "Floor Cushion"
    walkable: boolean;
    transparent: boolean;          // For fog of war / line of sight
    multiTile?: boolean;           // Extends beyond 24x24 viewBox
    tallObject?: boolean;          // Extends above tile (negative Y in SVG)
    generator?: string;            // Name of generator function if dynamically rendered
    graphicsKey?: string;          // Key in graphics object if different from char
    culturalVariants?: boolean;    // Renders differently by zone
    biomeSpecific?: BiomeType[];   // Only appears in these biomes
}

// ===========================================
// TILE REGISTRY - All tile definitions
// ===========================================

export const TILE_REGISTRY: Record<string, TileDefinition> = {
    // ==================
    // TERRAIN
    // ==================
    FLOOR: {
        id: 'FLOOR', char: '.', category: 'terrain', name: 'Floor',
        walkable: true, transparent: true
    },
    FLOOR_WORN: {
        id: 'FLOOR_WORN', char: ',', category: 'terrain', name: 'Worn Floor',
        walkable: true, transparent: true
    },
    FLOOR_POLISHED: {
        id: 'FLOOR_POLISHED', char: '`', category: 'terrain', name: 'Polished Floor',
        walkable: true, transparent: true
    },
    FLOOR_WOOD: {
        id: 'FLOOR_WOOD', char: 'o', category: 'terrain', name: 'Wood Floor',
        walkable: true, transparent: true
    },
    PATH: {
        id: 'PATH', char: ':', category: 'terrain', name: 'Path',
        walkable: true, transparent: true
    },
    GRASS: {
        id: 'GRASS', char: 'g', category: 'terrain', name: 'Grass',
        walkable: true, transparent: true
    },
    GRAVEL: {
        id: 'GRAVEL', char: 'v', category: 'terrain', name: 'Gravel Path',
        walkable: true, transparent: true
    },
    WATER: {
        id: 'WATER', char: '~', category: 'terrain', name: 'Water',
        walkable: false, transparent: true
    },
    WATER_POOL: {
        id: 'WATER_POOL', char: 'W', category: 'terrain', name: 'Water Pool',
        walkable: false, transparent: true
    },
    EMPTY: {
        id: 'EMPTY', char: ' ', category: 'terrain', name: 'Empty',
        walkable: true, transparent: true
    },
    SHADOW: {
        id: 'SHADOW', char: '░', category: 'terrain', name: 'Shadow',
        walkable: true, transparent: true
    },

    // ==================
    // WALLS
    // ==================
    WALL: {
        id: 'WALL', char: '#', category: 'wall', name: 'Wall',
        walkable: false, transparent: false, culturalVariants: true
    },
    WALL_N: {
        id: 'WALL_N', char: '▲', category: 'wall', name: 'North Wall',
        walkable: false, transparent: false, culturalVariants: true
    },
    WALL_S: {
        id: 'WALL_S', char: '▼', category: 'wall', name: 'South Wall',
        walkable: false, transparent: false
    },
    WALL_E: {
        id: 'WALL_E', char: '►', category: 'wall', name: 'East Wall',
        walkable: false, transparent: false, culturalVariants: true
    },
    WALL_W: {
        id: 'WALL_W', char: '◄', category: 'wall', name: 'West Wall',
        walkable: false, transparent: false, culturalVariants: true
    },
    WALL_NE: {
        id: 'WALL_NE', char: '┐', category: 'wall', name: 'NE Corner',
        walkable: false, transparent: false
    },
    WALL_NW: {
        id: 'WALL_NW', char: '┌', category: 'wall', name: 'NW Corner',
        walkable: false, transparent: false
    },
    WALL_SE: {
        id: 'WALL_SE', char: '┘', category: 'wall', name: 'SE Corner',
        walkable: false, transparent: false
    },
    WALL_SW: {
        id: 'WALL_SW', char: '└', category: 'wall', name: 'SW Corner',
        walkable: false, transparent: false
    },
    STALL_WALL: {
        id: 'STALL_WALL', char: 'S', category: 'wall', name: 'Stall Wall',
        walkable: false, transparent: false
    },
    BRICK_WALL: {
        id: 'BRICK_WALL', char: 'Y', category: 'wall', name: 'Brick Wall',
        walkable: false, transparent: false
    },

    // ==================
    // DOORS
    // ==================
    DOOR: {
        id: 'DOOR', char: '+', category: 'door', name: 'Door',
        walkable: true, transparent: false
    },
    EXHIBIT_DOOR: {
        id: 'EXHIBIT_DOOR', char: 'E', category: 'door', name: 'Exhibition Entry',
        walkable: true, transparent: false
    },
    DOOR_AJAR: {
        id: 'DOOR_AJAR', char: '[', category: 'door', name: 'Ajar Door',
        walkable: true, transparent: true
    },
    DOOR_OPEN: {
        id: 'DOOR_OPEN', char: ']', category: 'door', name: 'Open Door',
        walkable: true, transparent: true
    },
    // Directional doors
    DOOR_N: { id: 'DOOR_N', char: 'DN', category: 'door', name: 'Door (North)', walkable: false, transparent: false, graphicsKey: 'DN' },
    DOOR_S: { id: 'DOOR_S', char: 'DS', category: 'door', name: 'Door (South)', walkable: false, transparent: false, graphicsKey: 'DS' },
    DOOR_E: { id: 'DOOR_E', char: 'DE', category: 'door', name: 'Door (East)', walkable: false, transparent: false, graphicsKey: 'DE' },
    DOOR_W: { id: 'DOOR_W', char: 'DW', category: 'door', name: 'Door (West)', walkable: false, transparent: false, graphicsKey: 'DW' },
    METAL_DOOR_N: { id: 'METAL_DOOR_N', char: 'MN', category: 'door', name: 'Metal Door (North)', walkable: false, transparent: false, graphicsKey: 'MN' },
    METAL_DOOR_S: { id: 'METAL_DOOR_S', char: 'MS', category: 'door', name: 'Metal Door (South)', walkable: false, transparent: false, graphicsKey: 'MS' },
    METAL_DOOR_E: { id: 'METAL_DOOR_E', char: 'ME', category: 'door', name: 'Metal Door (East)', walkable: false, transparent: false, graphicsKey: 'ME' },
    METAL_DOOR_W: { id: 'METAL_DOOR_W', char: 'MW', category: 'door', name: 'Metal Door (West)', walkable: false, transparent: false, graphicsKey: 'MW' },
    GLASS_DOOR_N: { id: 'GLASS_DOOR_N', char: 'GN', category: 'door', name: 'Glass Door (North)', walkable: false, transparent: true, graphicsKey: 'GN' },
    GLASS_DOOR_S: { id: 'GLASS_DOOR_S', char: 'GS', category: 'door', name: 'Glass Door (South)', walkable: false, transparent: true, graphicsKey: 'GS' },

    // ==================
    // FLORA
    // ==================
    TREE: {
        id: 'TREE', char: 'T', category: 'flora', name: 'Tree',
        walkable: false, transparent: false, tallObject: true, generator: 'generateTree'
    },
    HEDGE: {
        id: 'HEDGE', char: 'H', category: 'flora', name: 'Hedge',
        walkable: true, transparent: false, generator: 'generateHedge'
    },
    PLANT: {
        id: 'PLANT', char: 'q', category: 'flora', name: 'Potted Plant',
        walkable: true, transparent: true
    },
    FLOWERBED: {
        id: 'FLOWERBED', char: 'w', category: 'flora', name: 'Flowerbed',
        walkable: true, transparent: true, generator: 'generateFlowerbed'
    },
    PALM: {
        id: 'PALM', char: '%', category: 'flora', name: 'Palm Tree',
        walkable: false, transparent: false, tallObject: true
    },

    // ==================
    // FURNITURE
    // ==================
    BENCH: {
        id: 'BENCH', char: 'b', category: 'furniture', name: 'Bench',
        walkable: true, transparent: true
    },
    WIDE_BENCH: {
        id: 'WIDE_BENCH', char: '≡', category: 'furniture', name: 'Wide Bench',
        walkable: true, transparent: true, multiTile: true
    },
    TABLE: {
        id: 'TABLE', char: 't', category: 'furniture', name: 'Café Table',
        walkable: true, transparent: true
    },
    CUSHION: {
        id: 'CUSHION', char: 'a', category: 'furniture', name: 'Floor Cushion',
        walkable: true, transparent: true, generator: 'generateCushion'
    },
    CARPET: {
        id: 'CARPET', char: 'r', category: 'furniture', name: 'Carpet',
        walkable: true, transparent: true
    },
    // Chairs with direction
    CHAIR_N: { id: 'CHAIR_N', char: '1', category: 'furniture', name: 'Chair (North)', walkable: false, transparent: true },
    CHAIR_S: { id: 'CHAIR_S', char: '2', category: 'furniture', name: 'Chair (South)', walkable: false, transparent: true },
    CHAIR_E: { id: 'CHAIR_E', char: '3', category: 'furniture', name: 'Chair (East)', walkable: false, transparent: true },
    CHAIR_W: { id: 'CHAIR_W', char: '4', category: 'furniture', name: 'Chair (West)', walkable: false, transparent: true },
    SEAT: {
        id: 'SEAT', char: 'z', category: 'furniture', name: 'Theater Seat',
        walkable: true, transparent: true
    },

    // ==================
    // LIGHTING
    // ==================
    LAMP: {
        id: 'LAMP', char: 'L', category: 'lighting', name: 'Gas Lamp',
        walkable: false, transparent: false, tallObject: true, generator: 'generateLamp'
    },
    LANTERN: {
        id: 'LANTERN', char: 'l', category: 'lighting', name: 'Hanging Lantern',
        walkable: true, transparent: true
    },
    SCONCE_LEFT: {
        id: 'SCONCE_LEFT', char: '‹', category: 'lighting', name: 'Wall Sconce (Left)',
        walkable: false, transparent: true, generator: 'generateWallSconce', graphicsKey: 'left'
    },
    SCONCE_RIGHT: {
        id: 'SCONCE_RIGHT', char: '›', category: 'lighting', name: 'Wall Sconce (Right)',
        walkable: false, transparent: true, generator: 'generateWallSconce', graphicsKey: 'right'
    },
    SCONCE_DOWN: {
        id: 'SCONCE_DOWN', char: '¬', category: 'lighting', name: 'Wall Sconce (Down)',
        walkable: false, transparent: true, generator: 'generateWallSconce', graphicsKey: 'down'
    },
    BRAZIER: {
        id: 'BRAZIER', char: 'Z', category: 'lighting', name: 'Brazier',
        walkable: true, transparent: true
    },

    // ==================
    // STATUES
    // ==================
    STATUE: {
        id: 'STATUE', char: 'u', category: 'statue', name: 'Statue',
        walkable: false, transparent: false, culturalVariants: true
    },
    STATUE_ASIAN_TALL: {
        id: 'STATUE_ASIAN_TALL', char: 'Ü', category: 'statue', name: 'Asian Statue (Tall)',
        walkable: false, transparent: false, tallObject: true
    },
    STATUE_ASIAN_SMALL: {
        id: 'STATUE_ASIAN_SMALL', char: 'ü', category: 'statue', name: 'Asian Figure',
        walkable: false, transparent: false
    },
    STATUE_EGYPTIAN_TALL: {
        id: 'STATUE_EGYPTIAN_TALL', char: 'Ö', category: 'statue', name: 'Egyptian Statue (Tall)',
        walkable: false, transparent: false, tallObject: true
    },
    STATUE_EGYPTIAN_BUST: {
        id: 'STATUE_EGYPTIAN_BUST', char: 'ö', category: 'statue', name: 'Egyptian Bust',
        walkable: false, transparent: false
    },
    STATUE_AFRICAN_TALL: {
        id: 'STATUE_AFRICAN_TALL', char: 'Ä', category: 'statue', name: 'African Statue (Tall)',
        walkable: false, transparent: false, tallObject: true
    },
    STATUE_AFRICAN_MASK: {
        id: 'STATUE_AFRICAN_MASK', char: 'ä', category: 'statue', name: 'African Mask',
        walkable: false, transparent: false
    },
    STATUE_MESOAMERICAN: {
        id: 'STATUE_MESOAMERICAN', char: 'ß', category: 'statue', name: 'Mesoamerican Statue',
        walkable: false, transparent: false, tallObject: true
    },
    STATUE_BUST: {
        id: 'STATUE_BUST', char: 'æ', category: 'statue', name: 'Classical Bust',
        walkable: false, transparent: false
    },
    STATUE_ALLEGORICAL: {
        id: 'STATUE_ALLEGORICAL', char: 'œ', category: 'statue', name: 'Allegorical Statue',
        walkable: false, transparent: false, multiTile: true
    },
    STATUE_MONUMENTAL: {
        id: 'STATUE_MONUMENTAL', char: 'Œ', category: 'statue', name: 'Monumental Statue',
        walkable: false, transparent: false, multiTile: true
    },

    // ==================
    // OBJECTS / EXHIBITS
    // ==================
    DISPLAY: {
        id: 'DISPLAY', char: 'D', category: 'object', name: 'Display Case',
        walkable: false, transparent: false, multiTile: true, culturalVariants: true
    },
    COLUMN: {
        id: 'COLUMN', char: 'c', category: 'object', name: 'Column',
        walkable: false, transparent: false, tallObject: true
    },
    BANNER: {
        id: 'BANNER', char: 'B', category: 'object', name: 'Banner',
        walkable: true, transparent: true, generator: 'generateBanner'
    },
    KIOSK: {
        id: 'KIOSK', char: 'K', category: 'object', name: 'Kiosk',
        walkable: false, transparent: false, multiTile: true, generator: 'generateKiosk'
    },
    NEWSPAPER: {
        id: 'NEWSPAPER', char: 'n', category: 'object', name: 'Newspaper',
        walkable: true, transparent: true
    },
    PUDDLE: {
        id: 'PUDDLE', char: 'p', category: 'object', name: 'Puddle',
        walkable: true, transparent: true
    },
    STEAM: {
        id: 'STEAM', char: 's', category: 'object', name: 'Steam Vent',
        walkable: true, transparent: true
    },
    RAILING: {
        id: 'RAILING', char: 'R', category: 'object', name: 'Railing',
        walkable: false, transparent: true
    },
    MACHINERY: {
        id: 'MACHINERY', char: 'M', category: 'machine', name: 'Machinery',
        walkable: false, transparent: false
    },
    STAGE: {
        id: 'STAGE', char: 'X', category: 'object', name: 'Stage',
        walkable: true, transparent: true
    },
    MARKET_STALL: {
        id: 'MARKET_STALL', char: 'k', category: 'object', name: 'Market Stall',
        walkable: false, transparent: false
    },
    CARRIAGE: {
        id: 'CARRIAGE', char: 'C', category: 'object', name: 'Carriage',
        walkable: false, transparent: false
    },
    DONKEY: {
        id: 'DONKEY', char: 'd', category: 'object', name: 'Donkey',
        walkable: true, transparent: true
    },

    // ==================
    // TOWER SPECIFIC
    // ==================
    TOWER_BASE: {
        id: 'TOWER_BASE', char: 'A', category: 'tower', name: 'Tower Base',
        walkable: false, transparent: false
    },
    PYLON: {
        id: 'PYLON', char: 'P', category: 'tower', name: 'Tower Pylon',
        walkable: false, transparent: false
    },
    VOID: {
        id: 'VOID', char: 'V', category: 'tower', name: 'Void (Danger!)',
        walkable: false, transparent: true
    },
    ELEVATOR: {
        id: 'ELEVATOR', char: 'e', category: 'tower', name: 'Elevator',
        walkable: true, transparent: false
    },
    TELESCOPE: {
        id: 'TELESCOPE', char: 'O', category: 'tower', name: 'Telescope',
        walkable: false, transparent: false
    },
    GLASS_FLOOR: {
        id: 'GLASS_FLOOR', char: 'G', category: 'tower', name: 'Glass Floor',
        walkable: true, transparent: true
    },

    // ==================
    // FOUNTAIN
    // ==================
    FOUNTAIN_CENTER: {
        id: 'FOUNTAIN_CENTER', char: 'F', category: 'fountain', name: 'Fountain Center',
        walkable: false, transparent: false
    },
    FOUNTAIN_EDGE: {
        id: 'FOUNTAIN_EDGE', char: 'f', category: 'fountain', name: 'Fountain Edge',
        walkable: true, transparent: true
    },
    FOUNTAIN_BASIN_N: {
        id: 'FOUNTAIN_BASIN_N', char: '«', category: 'fountain', name: 'Basin (North)',
        walkable: false, transparent: false
    },
    FOUNTAIN_BASIN_S: {
        id: 'FOUNTAIN_BASIN_S', char: '»', category: 'fountain', name: 'Basin (South)',
        walkable: false, transparent: false
    },
    FOUNTAIN_BASIN_E: {
        id: 'FOUNTAIN_BASIN_E', char: '≥', category: 'fountain', name: 'Basin (East)',
        walkable: false, transparent: false
    },
    FOUNTAIN_BASIN_W: {
        id: 'FOUNTAIN_BASIN_W', char: '≤', category: 'fountain', name: 'Basin (West)',
        walkable: false, transparent: false
    },
    FOUNTAIN_BASIN_NW: {
        id: 'FOUNTAIN_BASIN_NW', char: '╔', category: 'fountain', name: 'Basin Corner (NW)',
        walkable: false, transparent: false
    },
    FOUNTAIN_BASIN_NE: {
        id: 'FOUNTAIN_BASIN_NE', char: '╗', category: 'fountain', name: 'Basin Corner (NE)',
        walkable: false, transparent: false
    },
    FOUNTAIN_BASIN_SW: {
        id: 'FOUNTAIN_BASIN_SW', char: '╚', category: 'fountain', name: 'Basin Corner (SW)',
        walkable: false, transparent: false
    },
    FOUNTAIN_BASIN_SE: {
        id: 'FOUNTAIN_BASIN_SE', char: '╝', category: 'fountain', name: 'Basin Corner (SE)',
        walkable: false, transparent: false
    },
    FOUNTAIN_WATER: {
        id: 'FOUNTAIN_WATER', char: '≈', category: 'fountain', name: 'Fountain Water',
        walkable: false, transparent: true
    },
    FOUNTAIN_SPOUT: {
        id: 'FOUNTAIN_SPOUT', char: '⌂', category: 'fountain', name: 'Fountain Spout',
        walkable: false, transparent: false
    },
    FOUNTAIN_STATUE: {
        id: 'FOUNTAIN_STATUE', char: '♦', category: 'fountain', name: 'Fountain Sculpture',
        walkable: false, transparent: false
    },

    // ==================
    // VILLAGE / SPECIAL BIOMES
    // ==================
    THATCH_HUT: {
        id: 'THATCH_HUT', char: 'h', category: 'village', name: 'Thatched Hut',
        walkable: false, transparent: false
    },
    FIRE_PIT: {
        id: 'FIRE_PIT', char: 'U', category: 'village', name: 'Fire Pit',
        walkable: true, transparent: true
    },
    DRUM: {
        id: 'DRUM', char: '!', category: 'village', name: 'Ceremonial Drum',
        walkable: true, transparent: true
    },
    TOTEM: {
        id: 'TOTEM', char: '@', category: 'village', name: 'Totem',
        walkable: false, transparent: false, tallObject: true
    },
    WATERFALL: {
        id: 'WATERFALL', char: '|', category: 'village', name: 'Waterfall',
        walkable: false, transparent: true
    },
    CASCADE_ROCK: {
        id: 'CASCADE_ROCK', char: '^', category: 'village', name: 'Cascade Rocks',
        walkable: false, transparent: false
    },
    MOORISH_ARCH: {
        id: 'MOORISH_ARCH', char: '(', category: 'village', name: 'Moorish Arch',
        walkable: true, transparent: false
    },
    MINARET: {
        id: 'MINARET', char: ')', category: 'village', name: 'Minaret',
        walkable: false, transparent: false, tallObject: true
    },

    // ==================
    // SPECIAL / ENTRANCE
    // ==================
    GATE_ARCH: {
        id: 'GATE_ARCH', char: 'J', category: 'special', name: 'Gate Arch',
        walkable: false, transparent: false, tallObject: true
    },
    TURNSTILE: {
        id: 'TURNSTILE', char: 'I', category: 'special', name: 'Turnstile',
        walkable: true, transparent: true
    },
    TICKET_BOOTH: {
        id: 'TICKET_BOOTH', char: 'N', category: 'special', name: 'Ticket Booth',
        walkable: false, transparent: false, multiTile: true
    },
    GUARD_POST: {
        id: 'GUARD_POST', char: 'Q', category: 'special', name: 'Guard Post',
        walkable: false, transparent: false, multiTile: true
    },
    FLAGPOLE: {
        id: 'FLAGPOLE', char: 'y', category: 'special', name: 'Flagpole',
        walkable: false, transparent: false, tallObject: true
    },
};

// ===========================================
// REVERSE LOOKUP: Character -> Definition
// ===========================================

export const CHAR_TO_TILE: Record<string, TileDefinition> = {};

// Build reverse lookup on module load
Object.values(TILE_REGISTRY).forEach(def => {
    CHAR_TO_TILE[def.char] = def;
});

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Resolve a character to its tile definition
 */
export function resolveTile(char: string): TileDefinition | null {
    return CHAR_TO_TILE[char] || null;
}

/**
 * Check if a tile character is walkable
 */
export function isWalkable(char: string): boolean {
    const tile = CHAR_TO_TILE[char];
    return tile?.walkable ?? false;
}

/**
 * Check if a tile is an object (rendered on top of terrain)
 */
export function isObjectTile(char: string): boolean {
    const tile = CHAR_TO_TILE[char];
    if (!tile) return false;
    return ['object', 'furniture', 'flora', 'lighting', 'statue', 'fountain', 'village', 'tower', 'special'].includes(tile.category);
}

/**
 * Check if a tile is terrain (full-tile background)
 */
export function isTerrainTile(char: string): boolean {
    const tile = CHAR_TO_TILE[char];
    return tile?.category === 'terrain';
}

/**
 * Check if a tile is a wall
 */
export function isWallTile(char: string): boolean {
    const tile = CHAR_TO_TILE[char];
    return tile?.category === 'wall';
}

/**
 * Check if a tile uses a generator function
 */
export function hasGenerator(char: string): boolean {
    const tile = CHAR_TO_TILE[char];
    return !!tile?.generator;
}

/**
 * Get the generator name for a tile
 */
export function getGeneratorName(char: string): string | null {
    const tile = CHAR_TO_TILE[char];
    return tile?.generator || null;
}

/**
 * Check if tile extends above its bounds (tall object)
 */
export function isTallObject(char: string): boolean {
    const tile = CHAR_TO_TILE[char];
    return tile?.tallObject ?? false;
}

/**
 * Check if tile is multi-tile (extends beyond 24x24)
 */
export function isMultiTile(char: string): boolean {
    const tile = CHAR_TO_TILE[char];
    return tile?.multiTile ?? false;
}

/**
 * Get all tiles in a category
 */
export function getTilesByCategory(category: TileCategory): TileDefinition[] {
    return Object.values(TILE_REGISTRY).filter(t => t.category === category);
}

/**
 * Get the semantic ID for a character
 */
export function getTileId(char: string): string | null {
    const tile = CHAR_TO_TILE[char];
    return tile?.id || null;
}

// ===========================================
// LEGACY COMPATIBILITY
// ===========================================

/**
 * Generate TILES constant matching mapGenerator format
 * This allows mapGenerator to keep working unchanged
 */
export const TILES_FROM_REGISTRY = Object.fromEntries(
    Object.entries(TILE_REGISTRY).map(([id, def]) => [id, def.char])
) as Record<string, string>;
