
import { Zone, BiomeType } from '../types';
import { HISTORICAL_LAYOUT } from '../constants';

// Seeded random number generator (mulberry32)
// Creates a deterministic random sequence from a seed
const createSeededRandom = (seed: number) => {
    let state = seed;
    return () => {
        state = (state + 0x6D2B79F5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

// Create a hash from grid coordinates for consistent seeding
const coordsToSeed = (gx: number, gy: number): number => {
    return Math.abs((gx * 374761393 + gy * 668265263) ^ 0x85ebca6b);
};

// Map Configs
const WIDTH = 20;
const HEIGHT = 18;

const TILES = {
    WALL: '#',
    FLOOR: '.',
    EMPTY: ' ',
    TREE: 'T',
    WATER: '~',
    PATH: ':',
    DOOR: '+',
    LANDMARK_TOWER: 'A',
    LANDMARK_FOUNTAIN_CENTER: 'F',
    LANDMARK_FOUNTAIN_EDGE: 'f',
    EXHIBIT: 'E',
    CARRIAGE: 'C',
    LAMP: 'L',
    BENCH: 'b',
    NEWSPAPER: 'n',
    PUDDLE: 'p',
    STEAM: 's',
    KIOSK: 'K',
    // Tower-specific tiles
    PYLON: 'P',       // Massive iron tower leg
    VOID: 'V',        // Empty sky/danger zone (FATAL!)
    RAILING: 'R',     // Iron safety railing
    ELEVATOR: 'e',    // Elevator entrance
    TELESCOPE: 'O',   // Observation telescope
    WINDOW: 'W',      // Viewing window/aperture
    GLASS_FLOOR: 'G', // Glass floor section (see-through to below)
    // Exhibition tiles
    STALL_WALL: 'S',  // Exhibition stall wall (low partition)
    DISPLAY: 'D',     // Display case/artifact
    COLUMN: 'c',      // Decorative column
    CARPET: 'r',      // Ornate carpet/rug
    BANNER: 'B',      // Hanging banner/tapestry
    STATUE: 'u',      // Statue or sculpture
    PLANT: 'q',       // Potted palm or fern
    LANTERN: 'l',     // Hanging lantern
    // New tiles
    TABLE: 't',       // Café table
    MACHINERY: 'M',   // Large machinery/engine exhibit
    DONKEY: 'd',      // Donkey (for Rue du Caire)
    STAGE: 'X',       // Performance stage
    SEAT: 'z',        // Theater/concert seat
    MARKET_STALL: 'k', // Market stall (souk)
    BRAZIER: 'Z',     // Brazier/fire pit
    // Esplanade tiles
    GRASS: 'g',       // Manicured lawn
    BRICK_WALL: 'Y',  // Low brick wall/balustrade (changed from W)
    GRAVEL: 'v',      // Gravel path
    HEDGE: 'H',       // Trimmed hedge
    FLOWERBED: 'w',   // Flowerbed
    // Gate/entrance tiles (using simple ASCII for compatibility)
    GATE_ARCH: 'J',   // Monumental gate arch (iron pillar)
    TURNSTILE: 'I',   // Ticket turnstile
    TICKET_BOOTH: 'N', // Ticket booth
    GUARD_POST: 'Q',  // Guard/police post
    FLAGPOLE: 'y',    // Flagpole with banner
    // Chair orientations (for realistic furniture clustering)
    CHAIR_N: '1',     // Chair facing north (toward top)
    CHAIR_S: '2',     // Chair facing south (toward bottom)
    CHAIR_E: '3',     // Chair facing east (right)
    CHAIR_W: '4',     // Chair facing west (left)
    // Floor variants for cultural theming
    FLOOR_WORN: ',',      // Worn/high traffic floor
    FLOOR_POLISHED: '`',  // Polished floor near features
    FLOOR_WOOD: 'o',      // Wood plank flooring
    // Cushion for oriental seating
    CUSHION: 'a',         // Floor cushion (Middle Eastern/Asian)
    // Village & special biome tiles
    THATCH_HUT: 'h',      // Thatched hut structure
    FIRE_PIT: 'U',        // Central fire pit
    DRUM: '!',            // Ceremonial drum
    TOTEM: '@',           // Carved totem/sculpture
    PALM: '%',            // Palm tree (different from regular tree)
    // Waterfall & Trocadéro tiles
    WATERFALL: '|',       // Animated waterfall
    WATER_POOL: 'W',      // Reflecting pool (changed from brick wall)
    CASCADE_ROCK: '^',    // Decorative rocks
    MOORISH_ARCH: '(',    // Moorish arch entrance
    MINARET: ')',         // Decorative minaret/tower
    // Beaux-Arts fountain components (multi-tile)
    FOUNTAIN_BASIN_N: '«',    // North edge of basin
    FOUNTAIN_BASIN_S: '»',    // South edge of basin
    FOUNTAIN_BASIN_E: '≥',    // East edge of basin
    FOUNTAIN_BASIN_W: '≤',    // West edge of basin
    FOUNTAIN_BASIN_NW: '╔',   // Basin corner NW
    FOUNTAIN_BASIN_NE: '╗',   // Basin corner NE
    FOUNTAIN_BASIN_SW: '╚',   // Basin corner SW
    FOUNTAIN_BASIN_SE: '╝',   // Basin corner SE
    FOUNTAIN_WATER: '≈',      // Fountain water surface
    FOUNTAIN_SPOUT: '⌂',      // Central water spout/jet
    FOUNTAIN_STATUE: '♦',     // Fountain sculpture/figure
    // Directional walls (SNES RPG style depth)
    WALL_N: '▲',          // North wall (back wall - decorative face)
    WALL_S: '▼',          // South wall (front/bottom - dark cap)
    WALL_E: '►',          // East wall (right side - shows thickness)
    WALL_W: '◄',          // West wall (left side - shows thickness)
    WALL_NE: '┐',         // Corner: northeast
    WALL_NW: '┌',         // Corner: northwest
    WALL_SE: '┘',         // Corner: southeast
    WALL_SW: '└',         // Corner: southwest
    // Shadow tile (cast by walls)
    SHADOW: '░',          // Shadow on floor
};

// ============================================
// FURNITURE CLUSTER SYSTEM
// ============================================

interface FurnitureCluster {
    name: string;
    patterns: string[][][];  // Multiple variations
    minSpacing: number;      // Min tiles between clusters
}

// Café table with chairs - multiple variations
const CAFE_CLUSTER: FurnitureCluster = {
    name: 'cafe_seating',
    patterns: [
        // Variation 1: 4 chairs around table (formal)
        [
            [' ', '1', ' '],
            ['4', 't', '3'],
            [' ', '2', ' '],
        ],
        // Variation 2: 2 chairs opposite (intimate)
        [
            ['1'],
            ['t'],
            ['2'],
        ],
        // Variation 3: 3 chairs (casual)
        [
            [' ', '1', ' '],
            ['4', 't', ' '],
            [' ', '2', ' '],
        ],
        // Variation 4: 2 chairs side by side
        [
            ['1', '1'],
            ['t', ' '],
        ],
    ],
    minSpacing: 3,
};

// Museum viewing area - displays with benches facing them
const MUSEUM_VIEWING_CLUSTER: FurnitureCluster = {
    name: 'museum_viewing',
    patterns: [
        // Displays against wall with bench
        [
            ['D', 'D', 'D'],
            ['.', '.', '.'],
            [' ', 'b', ' '],
        ],
        // Single display with flanking plants
        [
            ['q', 'D', 'q'],
            ['.', '.', '.'],
            [' ', 'b', ' '],
        ],
    ],
    minSpacing: 4,
};

// Oriental seating - cushions around brazier
const ORIENTAL_CLUSTER: FurnitureCluster = {
    name: 'oriental_seating',
    patterns: [
        // Cushions around brazier
        [
            ['a', 'a', 'a'],
            ['a', 'Z', 'a'],
            ['a', 'a', 'a'],
        ],
        // Smaller arrangement
        [
            ['a', ' ', 'a'],
            [' ', 'Z', ' '],
            ['a', ' ', 'a'],
        ],
        // Cushions on carpet
        [
            ['r', 'r', 'r'],
            ['r', 'a', 'r'],
            ['a', ' ', 'a'],
        ],
    ],
    minSpacing: 4,
};

// Conversation nook - chairs facing each other
const CONVERSATION_CLUSTER: FurnitureCluster = {
    name: 'conversation_nook',
    patterns: [
        // Two chairs with table
        [
            ['q', ' ', ' '],
            ['3', 't', '4'],
            ['q', ' ', ' '],
        ],
        // Four chairs around table
        [
            [' ', '1', ' '],
            ['3', 't', '4'],
            [' ', '2', ' '],
        ],
    ],
    minSpacing: 4,
};

// Statue with viewing benches
const STATUE_VIEWING_CLUSTER: FurnitureCluster = {
    name: 'statue_viewing',
    patterns: [
        [
            [' ', 'b', ' '],
            ['.', 'u', '.'],
            [' ', 'b', ' '],
        ],
        [
            ['b', ' ', 'b'],
            [' ', 'u', ' '],
            ['.', '.', '.'],
        ],
    ],
    minSpacing: 5,
};

// ============================================
// BEAUX-ARTS FOUNTAIN CLUSTERS
// Elaborate multi-tile fountains for grand spaces
// ============================================

// Grand Beaux-Arts fountain (5x5) - central jet with sculptural basin
const GRAND_FOUNTAIN_CLUSTER: FurnitureCluster = {
    name: 'grand_fountain',
    patterns: [
        // Main variation: Central spout with decorative basin
        [
            [' ', '╔', '«', '«', '╗', ' '],
            ['╔', '≈', '≈', '≈', '≈', '╗'],
            ['≤', '≈', '⌂', '⌂', '≈', '≥'],
            ['≤', '≈', '≈', '≈', '≈', '≥'],
            ['╚', '≈', '≈', '≈', '≈', '╝'],
            [' ', '╚', '»', '»', '╝', ' '],
        ],
        // Variation 2: With central statue
        [
            [' ', '╔', '«', '«', '╗', ' '],
            ['╔', '≈', '≈', '≈', '≈', '╗'],
            ['≤', '≈', '♦', '♦', '≈', '≥'],
            ['≤', '≈', '≈', '≈', '≈', '≥'],
            ['╚', '≈', '≈', '≈', '≈', '╝'],
            [' ', '╚', '»', '»', '╝', ' '],
        ],
    ],
    minSpacing: 8,
};

// Medium Beaux-Arts fountain (4x4) - elegant courtyard style
const MEDIUM_FOUNTAIN_CLUSTER: FurnitureCluster = {
    name: 'medium_fountain',
    patterns: [
        // Octagonal basin with jet
        [
            [' ', '╔', '«', '╗', ' '],
            ['╔', '≈', '≈', '≈', '╗'],
            ['≤', '≈', '⌂', '≈', '≥'],
            ['╚', '≈', '≈', '≈', '╝'],
            [' ', '╚', '»', '╝', ' '],
        ],
        // With statue figure
        [
            [' ', '╔', '«', '╗', ' '],
            ['╔', '≈', '♦', '≈', '╗'],
            ['≤', '≈', '≈', '≈', '≥'],
            ['╚', '≈', '≈', '≈', '╝'],
            [' ', '╚', '»', '╝', ' '],
        ],
    ],
    minSpacing: 6,
};

// Small decorative fountain (3x3) - intimate garden style
const SMALL_FOUNTAIN_CLUSTER: FurnitureCluster = {
    name: 'small_fountain',
    patterns: [
        // Simple circular basin
        [
            ['╔', '«', '╗'],
            ['≤', '⌂', '≥'],
            ['╚', '»', '╝'],
        ],
        // Tiered effect
        [
            ['╔', '«', '╗'],
            ['≤', '♦', '≥'],
            ['╚', '»', '╝'],
        ],
    ],
    minSpacing: 4,
};

// Wall fountain (2x3) - attaches to walls
const WALL_FOUNTAIN_CLUSTER: FurnitureCluster = {
    name: 'wall_fountain',
    patterns: [
        // Single spout against wall
        [
            ['♦', '♦'],
            ['≤', '≥'],
            ['╚', '╝'],
        ],
    ],
    minSpacing: 5,
};

// Helper: Place a grand fountain at specific location (for key areas)
const placeGrandFountain = (
    grid: string[][],
    centerX: number,
    centerY: number,
    style: 'jet' | 'statue' = 'jet'
): boolean => {
    // 6x6 grand fountain centered at position
    const startX = centerX - 3;
    const startY = centerY - 3;

    // Check bounds
    if (startY < 1 || startX < 1 || startY + 6 >= grid.length - 1 || startX + 6 >= grid[0].length - 1) {
        return false;
    }

    const pattern = style === 'statue' ? GRAND_FOUNTAIN_CLUSTER.patterns[1] : GRAND_FOUNTAIN_CLUSTER.patterns[0];

    for (let dy = 0; dy < 6; dy++) {
        for (let dx = 0; dx < 6; dx++) {
            const char = pattern[dy][dx];
            if (char !== ' ') {
                grid[startY + dy][startX + dx] = char;
            }
        }
    }

    return true;
};

// Helper: Place a medium fountain at specific location
const placeMediumFountain = (
    grid: string[][],
    centerX: number,
    centerY: number,
    style: 'jet' | 'statue' = 'jet'
): boolean => {
    // 5x5 medium fountain centered at position
    const startX = centerX - 2;
    const startY = centerY - 2;

    // Check bounds
    if (startY < 1 || startX < 1 || startY + 5 >= grid.length - 1 || startX + 5 >= grid[0].length - 1) {
        return false;
    }

    const pattern = style === 'statue' ? MEDIUM_FOUNTAIN_CLUSTER.patterns[1] : MEDIUM_FOUNTAIN_CLUSTER.patterns[0];

    for (let dy = 0; dy < 5; dy++) {
        for (let dx = 0; dx < 5; dx++) {
            const char = pattern[dy][dx];
            if (char !== ' ') {
                grid[startY + dy][startX + dx] = char;
            }
        }
    }

    return true;
};

// Helper: Place a small fountain at specific location
const placeSmallFountain = (
    grid: string[][],
    centerX: number,
    centerY: number,
    style: 'jet' | 'statue' = 'jet'
): boolean => {
    // 3x3 small fountain centered at position
    const startX = centerX - 1;
    const startY = centerY - 1;

    // Check bounds
    if (startY < 1 || startX < 1 || startY + 3 >= grid.length - 1 || startX + 3 >= grid[0].length - 1) {
        return false;
    }

    const pattern = style === 'statue' ? SMALL_FOUNTAIN_CLUSTER.patterns[1] : SMALL_FOUNTAIN_CLUSTER.patterns[0];

    for (let dy = 0; dy < 3; dy++) {
        for (let dx = 0; dx < 3; dx++) {
            const char = pattern[dy][dx];
            grid[startY + dy][startX + dx] = char;
        }
    }

    return true;
};

// Helper: Place a furniture cluster with collision detection
const placeFurnitureCluster = (
    grid: string[][],
    cluster: FurnitureCluster,
    x: number,
    y: number,
    rand: () => number
): boolean => {
    // Pick random variation
    const variation = Math.floor(rand() * cluster.patterns.length);
    const pattern = cluster.patterns[variation];

    const h = pattern.length;
    const w = pattern[0].length;

    // Check bounds
    if (y < 1 || x < 1 || y + h >= grid.length - 1 || x + w >= grid[0].length - 1) {
        return false;
    }

    // Check for collisions - only place on floor/path tiles
    for (let dy = 0; dy < h; dy++) {
        for (let dx = 0; dx < w; dx++) {
            const char = pattern[dy][dx];
            if (char !== ' ' && char !== '.') {
                const existing = grid[y + dy][x + dx];
                if (existing !== TILES.FLOOR && existing !== TILES.PATH &&
                    existing !== TILES.CARPET && existing !== TILES.GRAVEL) {
                    return false;
                }
            }
        }
    }

    // Place the cluster
    for (let dy = 0; dy < h; dy++) {
        for (let dx = 0; dx < w; dx++) {
            const char = pattern[dy][dx];
            if (char !== ' ') {
                grid[y + dy][x + dx] = char;
            }
        }
    }

    return true;
};

// Helper: Apply soft symmetry - mirror with imperfection
const applySoftSymmetry = (
    grid: string[][],
    rand: () => number,
    objectTiles: Set<string>
): void => {
    const midX = Math.floor(grid[0].length / 2);

    for (let y = 1; y < grid.length - 1; y++) {
        for (let x = 1; x < midX - 1; x++) {
            const tile = grid[y][x];
            if (objectTiles.has(tile)) {
                const mirrorX = grid[0].length - 1 - x;
                const mirrorTile = grid[y][mirrorX];

                // Only mirror if target is empty floor
                if (mirrorTile === TILES.FLOOR || mirrorTile === TILES.PATH) {
                    const chance = rand();
                    if (chance < 0.65) {
                        // 65%: Mirror exactly
                        grid[y][mirrorX] = tile;
                    } else if (chance < 0.85) {
                        // 20%: Offset by 1 tile
                        const offsetY = y + (rand() > 0.5 ? 1 : -1);
                        if (offsetY > 0 && offsetY < grid.length - 1) {
                            if (grid[offsetY][mirrorX] === TILES.FLOOR) {
                                grid[offsetY][mirrorX] = tile;
                            }
                        }
                    }
                    // 15%: Skip (asymmetric)
                }
            }
        }
    }
};

// Helper: Create empty grid
const createGrid = (w: number, h: number, fill: string) => {
    const grid = [];
    for (let y = 0; y < h; y++) {
        grid.push(new Array(w).fill(fill));
    }
    return grid;
};

// Define walkable tiles (moved up for use by helper functions)
const WALKABLE_TILES = new Set([
    TILES.FLOOR, TILES.PATH, TILES.DOOR, TILES.CARPET, TILES.GRAVEL,
    TILES.GRASS, TILES.GLASS_FLOOR, TILES.STAGE, TILES.ELEVATOR,
    TILES.FLOOR_WORN, TILES.FLOOR_POLISHED, TILES.FLOOR_WOOD, TILES.CUSHION,
    TILES.SHADOW  // Shadow is walkable
]);

// Helper: Check if tile is floor-like (walkable, not a wall)
const isFloorLike = (char: string): boolean => {
    return WALKABLE_TILES.has(char);
};

// Helper: Check if tile is wall-like
const isWallLike = (char: string): boolean => {
    return char === TILES.WALL || char === TILES.WALL_N || char === TILES.WALL_S ||
           char === TILES.WALL_E || char === TILES.WALL_W || char === TILES.WALL_NE ||
           char === TILES.WALL_NW || char === TILES.WALL_SE || char === TILES.WALL_SW;
};

// Helper: Place directional walls with proper SNES-style depth
// This creates the illusion of 3D by using different wall tiles for each direction
const placeDirectionalWalls = (grid: string[][], addShadows: boolean = true) => {
    const h = grid.length;
    const w = grid[0].length;

    // First pass: identify wall positions and their directions
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (grid[y][x] === TILES.WALL) {
                // Check neighbors to determine wall type
                const hasFloorN = y > 0 && isFloorLike(grid[y-1][x]);
                const hasFloorS = y < h-1 && isFloorLike(grid[y+1][x]);
                const hasFloorE = x < w-1 && isFloorLike(grid[y][x+1]);
                const hasFloorW = x > 0 && isFloorLike(grid[y][x-1]);
                const hasWallN = y > 0 && isWallLike(grid[y-1][x]);
                const hasWallS = y < h-1 && isWallLike(grid[y+1][x]);
                const hasWallE = x < w-1 && isWallLike(grid[y][x+1]);
                const hasWallW = x > 0 && isWallLike(grid[y][x-1]);

                // Corner detection
                if (hasFloorS && hasFloorE && hasWallN && hasWallW) {
                    grid[y][x] = TILES.WALL_NW;
                } else if (hasFloorS && hasFloorW && hasWallN && hasWallE) {
                    grid[y][x] = TILES.WALL_NE;
                } else if (hasFloorN && hasFloorE && hasWallS && hasWallW) {
                    grid[y][x] = TILES.WALL_SW;
                } else if (hasFloorN && hasFloorW && hasWallS && hasWallE) {
                    grid[y][x] = TILES.WALL_SE;
                }
                // Edge walls
                else if (hasFloorS && !hasFloorN) {
                    grid[y][x] = TILES.WALL_N; // Back wall (facing south into room)
                } else if (hasFloorN && !hasFloorS) {
                    grid[y][x] = TILES.WALL_S; // Front wall (bottom edge)
                } else if (hasFloorE && !hasFloorW) {
                    grid[y][x] = TILES.WALL_W; // Left wall
                } else if (hasFloorW && !hasFloorE) {
                    grid[y][x] = TILES.WALL_E; // Right wall
                }
                // Keep as generic wall if surrounded by walls or unclear
            }
        }
    }

    // Second pass: add shadow tiles below north walls
    if (addShadows) {
        for (let y = 0; y < h - 1; y++) {
            for (let x = 0; x < w; x++) {
                const tile = grid[y][x];
                if (tile === TILES.WALL_N || tile === TILES.WALL_NW || tile === TILES.WALL_NE) {
                    const below = grid[y+1][x];
                    if (isFloorLike(below) && below !== TILES.SHADOW) {
                        // Don't overwrite important tiles, just floor-like ones
                        if (below === TILES.FLOOR || below === TILES.PATH) {
                            grid[y+1][x] = TILES.SHADOW;
                        }
                    }
                }
            }
        }
    }
};

// Check if a tile is walkable
const isWalkable = (char: string): boolean => {
    return WALKABLE_TILES.has(char);
};

// Find a valid spawn point near the target coordinates
// Searches in expanding circles until a walkable tile is found
export const findValidSpawnPoint = (
    mapData: string[],
    targetX: number,
    targetY: number,
    width: number,
    height: number
): { x: number; y: number } => {
    // First check if target is valid
    if (targetY >= 0 && targetY < mapData.length &&
        targetX >= 0 && targetX < width &&
        isWalkable(mapData[targetY]?.[targetX])) {
        return { x: targetX, y: targetY };
    }

    // Search in expanding squares
    for (let radius = 1; radius < Math.max(width, height); radius++) {
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                // Only check perimeter of current square
                if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;

                const nx = targetX + dx;
                const ny = targetY + dy;

                if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                    const tile = mapData[ny]?.[nx];
                    if (tile && isWalkable(tile)) {
                        return { x: nx, y: ny };
                    }
                }
            }
        }
    }

    // Fallback: find ANY walkable tile (shouldn't happen but safety first)
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            if (isWalkable(mapData[y]?.[x])) {
                return { x, y };
            }
        }
    }

    // Ultimate fallback - center of map
    return { x: Math.floor(width / 2), y: Math.floor(height / 2) };
};

// Clear tiles around a position to ensure accessibility
const clearAroundDoor = (grid: string[][], x: number, y: number, direction: 'N' | 'S' | 'E' | 'W') => {
    // Clear 3 tiles perpendicular to the door and 2 tiles deep into the map
    if (direction === 'N' || direction === 'S') {
        // Door is on top or bottom - clear horizontally and down/up
        const dy = direction === 'N' ? 1 : -1;
        for (let depth = 1; depth <= 2; depth++) {
            const ny = y + (dy * depth);
            if (ny > 0 && ny < grid.length - 1) {
                for (let dx = -1; dx <= 1; dx++) {
                    const nx = x + dx;
                    if (nx > 0 && nx < grid[0].length - 1) {
                        if (!isWalkable(grid[ny][nx]) && grid[ny][nx] !== TILES.DOOR) {
                            grid[ny][nx] = TILES.FLOOR;
                        }
                    }
                }
            }
        }
    } else {
        // Door is on left or right - clear vertically and left/right
        const dx = direction === 'W' ? 1 : -1;
        for (let depth = 1; depth <= 2; depth++) {
            const nx = x + (dx * depth);
            if (nx > 0 && nx < grid[0].length - 1) {
                for (let dy = -1; dy <= 1; dy++) {
                    const ny = y + dy;
                    if (ny > 0 && ny < grid.length - 1) {
                        if (!isWalkable(grid[ny][nx]) && grid[ny][nx] !== TILES.DOOR) {
                            grid[ny][nx] = TILES.FLOOR;
                        }
                    }
                }
            }
        }
    }
};

// Helper: Place a multi-tile structure
const placeStructure = (grid: string[][], x: number, y: number, structure: string[][]) => {
    const h = structure.length;
    const w = structure[0].length;
    
    // Check bounds and collisions
    if (y < 0 || x < 0 || y + h > grid.length || x + w > grid[0].length) return false;
    
    for(let dy=0; dy<h; dy++) {
        for(let dx=0; dx<w; dx++) {
            if (grid[y+dy][x+dx] !== TILES.FLOOR && grid[y+dy][x+dx] !== TILES.PATH && grid[y+dy][x+dx] !== TILES.EMPTY) {
                // Allow overwriting floor/path/empty only
                // If structure has empty char, we ignore it (transparent)
                if (structure[dy][dx] !== ' ') return false; 
            }
        }
    }

    // Place
    for(let dy=0; dy<h; dy++) {
        for(let dx=0; dx<w; dx++) {
            const char = structure[dy][dx];
            if (char !== ' ') grid[y+dy][x+dx] = char;
        }
    }
    return true;
};

// --- BIOME ALGORITHMS ---

// 1. Grand Hall (Palais des Industries Diverses style)
// Based on the grand exhibition halls of the 1889 Exposition
const generateGrandHall = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Main hall floor with decorative pattern
    for(let y=0; y<HEIGHT; y++) {
        for(let x=0; x<WIDTH; x++) {
            grid[y][x] = TILES.FLOOR;
        }
    }

    // Ornate walls
    for(let x=0; x<WIDTH; x++) {
        grid[0][x] = TILES.WALL;
        grid[HEIGHT-1][x] = TILES.WALL;
    }
    for(let y=0; y<HEIGHT; y++) {
        grid[y][0] = TILES.WALL;
        grid[y][WIDTH-1] = TILES.WALL;
    }

    // Grand central nave (carpet runner)
    for(let x=1; x<WIDTH-1; x++) {
        grid[midY-1][x] = TILES.CARPET;
        grid[midY][x] = TILES.CARPET;
        grid[midY+1][x] = TILES.CARPET;
    }

    // Cross aisle
    for(let y=1; y<HEIGHT-1; y++) {
        grid[y][midX-1] = TILES.CARPET;
        grid[y][midX] = TILES.CARPET;
    }

    // Monumental columns supporting glass roof
    const columnPositions = [4, 10, 14, 20];
    for(const cx of columnPositions) {
        if (cx < WIDTH - 1) {
            grid[2][cx] = TILES.COLUMN;
            grid[HEIGHT-3][cx] = TILES.COLUMN;
        }
    }

    // Exhibition alcoves along the sides (north)
    // Display cases are 2-tiles wide, so space them 4+ tiles apart to avoid overlap
    for(let x=3; x<WIDTH-6; x+=6) {
        if (x !== midX-1 && x !== midX && x + 3 < WIDTH - 2) {
            // Single display case (2 tiles wide) - don't stack adjacent
            grid[2][x] = TILES.DISPLAY;
            // Decorative plant or statue 2 tiles away for visual balance
            if (rand() > 0.5) {
                grid[3][x+3] = TILES.PLANT;
            } else {
                grid[3][x+3] = TILES.STATUE;
            }
        }
    }

    // Exhibition alcoves (south) - offset from north to create visual interest
    for(let x=5; x<WIDTH-6; x+=6) {
        if (x !== midX-1 && x !== midX && x + 3 < WIDTH - 2) {
            grid[HEIGHT-3][x] = TILES.DISPLAY;
            if (rand() > 0.5) {
                grid[HEIGHT-4][x+3] = TILES.PLANT;
            }
        }
    }

    // Central rotunda area (grand focal point)
    for(let dy=-1; dy<=1; dy++) {
        for(let dx=-1; dx<=1; dx++) {
            grid[midY+dy][midX+dx] = TILES.CARPET;
        }
    }

    // Central statue or Beaux-Arts fountain
    if (rand() > 0.5) {
        grid[midY][midX] = TILES.STATUE;
    } else {
        // Place small Beaux-Arts fountain (3x3)
        placeSmallFountain(grid, midX, midY, 'jet');
    }

    // Observation benches around center
    grid[midY-3][midX-2] = TILES.BENCH;
    grid[midY-3][midX+2] = TILES.BENCH;
    grid[midY+3][midX-2] = TILES.BENCH;
    grid[midY+3][midX+2] = TILES.BENCH;

    // Grand gas chandeliers (represented as lamps)
    for(let x=3; x<WIDTH-2; x+=4) {
        grid[1][x] = TILES.LAMP;
        grid[HEIGHT-2][x] = TILES.LAMP;
    }
    // Hanging lanterns in side alcoves
    grid[3][7] = TILES.LANTERN;
    grid[3][WIDTH-8] = TILES.LANTERN;
    grid[HEIGHT-4][7] = TILES.LANTERN;
    grid[HEIGHT-4][WIDTH-8] = TILES.LANTERN;

    // Banners/tapestries on walls (national pride)
    if (rand() > 0.4) {
        grid[1][6] = TILES.BANNER;
        grid[1][WIDTH-7] = TILES.BANNER;
    }

    // Occasional newspaper on bench
    if (rand() > 0.6) {
        grid[midY-2][midX-3] = TILES.NEWSPAPER;
    }

    // Museum viewing clusters in side alcoves
    if (rand() > 0.5) {
        placeFurnitureCluster(grid, MUSEUM_VIEWING_CLUSTER, 4, 4, rand);
    }
    if (rand() > 0.5) {
        placeFurnitureCluster(grid, MUSEUM_VIEWING_CLUSTER, WIDTH - 7, 4, rand);
    }

    // Conversation nook in corner
    if (rand() > 0.6) {
        placeFurnitureCluster(grid, CONVERSATION_CLUSTER, 4, HEIGHT - 6, rand);
    }
};

// Cultural themes for national pavilions - each has distinct character
interface CulturalTheme {
    region: 'european' | 'asian' | 'middle_eastern' | 'african' | 'american' | 'oceanic';
    hasWater: boolean;       // Fountain or pool
    hasBraziers: boolean;    // Fire/warmth elements
    carpetStyle: 'runner' | 'scattered' | 'central' | 'none';
    columnStyle: 'classical' | 'minimal' | 'ornate' | 'none';
    plantDensity: 'sparse' | 'moderate' | 'lush';
    lightingStyle: 'bright' | 'atmospheric' | 'dramatic';
}

const CULTURAL_THEMES: Record<string, CulturalTheme> = {
    // East Asian
    'japan': { region: 'asian', hasWater: true, hasBraziers: false, carpetStyle: 'none', columnStyle: 'minimal', plantDensity: 'moderate', lightingStyle: 'atmospheric' },
    'china': { region: 'asian', hasWater: false, hasBraziers: true, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'dramatic' },
    'siam': { region: 'asian', hasWater: true, hasBraziers: false, carpetStyle: 'none', columnStyle: 'ornate', plantDensity: 'lush', lightingStyle: 'atmospheric' },
    'java': { region: 'oceanic', hasWater: true, hasBraziers: false, carpetStyle: 'scattered', columnStyle: 'minimal', plantDensity: 'lush', lightingStyle: 'atmospheric' },

    // Middle East / North Africa
    'persia': { region: 'middle_eastern', hasWater: true, hasBraziers: false, carpetStyle: 'scattered', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'atmospheric' },
    'egypt': { region: 'middle_eastern', hasWater: false, hasBraziers: true, carpetStyle: 'runner', columnStyle: 'ornate', plantDensity: 'sparse', lightingStyle: 'dramatic' },
    'tunisia': { region: 'middle_eastern', hasWater: true, hasBraziers: true, carpetStyle: 'scattered', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'atmospheric' },
    'algeria': { region: 'middle_eastern', hasWater: true, hasBraziers: false, carpetStyle: 'scattered', columnStyle: 'minimal', plantDensity: 'sparse', lightingStyle: 'atmospheric' },

    // Europe
    'netherlands': { region: 'european', hasWater: false, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'moderate', lightingStyle: 'bright' },
    'russia': { region: 'european', hasWater: false, hasBraziers: true, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'sparse', lightingStyle: 'dramatic' },
    'greece': { region: 'european', hasWater: false, hasBraziers: false, carpetStyle: 'none', columnStyle: 'classical', plantDensity: 'sparse', lightingStyle: 'bright' },
    'italy': { region: 'european', hasWater: true, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'moderate', lightingStyle: 'bright' },
    'norway': { region: 'european', hasWater: false, hasBraziers: true, carpetStyle: 'runner', columnStyle: 'minimal', plantDensity: 'sparse', lightingStyle: 'atmospheric' },
    'sweden': { region: 'european', hasWater: false, hasBraziers: true, carpetStyle: 'runner', columnStyle: 'minimal', plantDensity: 'sparse', lightingStyle: 'atmospheric' },

    // Americas
    'mexico': { region: 'american', hasWater: false, hasBraziers: true, carpetStyle: 'scattered', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'dramatic' },
    'argentina': { region: 'american', hasWater: false, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'sparse', lightingStyle: 'bright' },
    'venezuela': { region: 'american', hasWater: false, hasBraziers: false, carpetStyle: 'none', columnStyle: 'minimal', plantDensity: 'lush', lightingStyle: 'atmospheric' },
    'bolivia': { region: 'american', hasWater: false, hasBraziers: true, carpetStyle: 'scattered', columnStyle: 'ornate', plantDensity: 'sparse', lightingStyle: 'dramatic' },

    // African
    'senegal': { region: 'african', hasWater: false, hasBraziers: true, carpetStyle: 'scattered', columnStyle: 'none', plantDensity: 'moderate', lightingStyle: 'atmospheric' },

    // Default European style
    'default': { region: 'european', hasWater: false, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'moderate', lightingStyle: 'bright' },
};

// Detect cultural theme from zone name
const detectCulturalTheme = (zoneName: string): CulturalTheme => {
    const nameLower = zoneName.toLowerCase();

    for (const [key, theme] of Object.entries(CULTURAL_THEMES)) {
        if (nameLower.includes(key)) {
            return theme;
        }
    }

    // Check for region keywords
    if (nameLower.includes('asian') || nameLower.includes('orient')) return CULTURAL_THEMES['japan'];
    if (nameLower.includes('arab') || nameLower.includes('ottoman') || nameLower.includes('islamic')) return CULTURAL_THEMES['persia'];
    if (nameLower.includes('african') || nameLower.includes('colonial troops')) return CULTURAL_THEMES['senegal'];
    if (nameLower.includes('tropic') || nameLower.includes('cacao') || nameLower.includes('coffee')) return CULTURAL_THEMES['venezuela'];
    if (nameLower.includes('beaux-arts') || nameLower.includes('sculpture') || nameLower.includes('arts lib')) return CULTURAL_THEMES['greece'];
    if (nameLower.includes('panorama') || nameLower.includes('jerusalem')) return CULTURAL_THEMES['persia'];
    if (nameLower.includes('aquarium') || nameLower.includes('ethnograph') || nameLower.includes('invalides')) return CULTURAL_THEMES['default'];

    return CULTURAL_THEMES['default'];
};

// 2. Salon / National Pavilion (Culturally distinct based on nation)
// Each nation's pavilion had unique character - this feels like entering a foreign world
const generateSalon = (grid: string[][], seed: number = 0, zoneName: string = '') => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);
    const theme = detectCulturalTheme(zoneName);

    // Base floor - style varies by region
    for(let y=0; y<HEIGHT; y++) {
        for(let x=0; x<WIDTH; x++) {
            if (theme.region === 'asian' && (x + y) % 5 === 0) {
                grid[y][x] = TILES.PATH; // Tatami-like pattern
            } else if (theme.region === 'middle_eastern' && (x * y) % 7 === 0) {
                grid[y][x] = TILES.PATH; // Geometric tiles
            } else {
                grid[y][x] = TILES.FLOOR;
            }
        }
    }

    // Outer walls
    for(let x=0; x<WIDTH; x++) {
        grid[0][x] = TILES.WALL;
        grid[HEIGHT-1][x] = TILES.WALL;
    }
    for(let y=0; y<HEIGHT; y++) {
        grid[y][0] = TILES.WALL;
        grid[y][WIDTH-1] = TILES.WALL;
    }

    // CARPET PLACEMENT based on cultural style
    if (theme.carpetStyle === 'runner') {
        // European style - formal runner
        for(let x = 4; x < WIDTH - 4; x++) {
            grid[midY][x] = TILES.CARPET;
        }
    } else if (theme.carpetStyle === 'central') {
        // Large central carpet (Russian/Chinese)
        for(let dy = -2; dy <= 2; dy++) {
            for(let dx = -3; dx <= 3; dx++) {
                if (midY + dy > 0 && midY + dy < HEIGHT - 1 && midX + dx > 0 && midX + dx < WIDTH - 1) {
                    grid[midY + dy][midX + dx] = TILES.CARPET;
                }
            }
        }
    } else if (theme.carpetStyle === 'scattered') {
        // Persian/Middle Eastern - scattered prayer rugs and carpets
        const carpetPositions = [
            { x: 5, y: 3 }, { x: 8, y: 6 }, { x: midX + 2, y: 4 },
            { x: 6, y: HEIGHT - 4 }, { x: WIDTH - 6, y: midY }
        ];
        for (const pos of carpetPositions) {
            if (rand() > 0.3) {
                grid[pos.y][pos.x] = TILES.CARPET;
                if (pos.x + 1 < WIDTH - 1) grid[pos.y][pos.x + 1] = TILES.CARPET;
            }
        }
    }
    // 'none' - Asian minimalism, no carpets

    // WATER FEATURE (fountain or reflecting pool)
    if (theme.hasWater) {
        if (theme.region === 'asian') {
            // Small zen-style pool off to the side
            grid[midY - 1][4] = TILES.WATER;
            grid[midY][4] = TILES.WATER;
            grid[midY + 1][4] = TILES.WATER;
        } else if (theme.region === 'middle_eastern') {
            // Central courtyard Beaux-Arts fountain (small, elegant)
            placeSmallFountain(grid, midX, midY, 'statue');
        } else {
            // European - elegant small fountain
            placeSmallFountain(grid, midX, midY, 'jet');
        }
    }

    // BRAZIERS (fire elements for warmth/atmosphere)
    if (theme.hasBraziers) {
        grid[3][4] = TILES.BRAZIER;
        grid[3][WIDTH - 5] = TILES.BRAZIER;
        if (rand() > 0.5) {
            grid[HEIGHT - 4][midX] = TILES.BRAZIER;
        }
    }

    // COLUMNS based on cultural style
    if (theme.columnStyle === 'classical') {
        // Greco-Roman columns in regular pattern
        grid[2][5] = TILES.COLUMN;
        grid[2][WIDTH - 6] = TILES.COLUMN;
        grid[HEIGHT - 3][5] = TILES.COLUMN;
        grid[HEIGHT - 3][WIDTH - 6] = TILES.COLUMN;
    } else if (theme.columnStyle === 'ornate') {
        // More columns, irregular placement (Islamic/Asian/Pre-Columbian)
        grid[3][4] = theme.hasBraziers ? TILES.FLOOR : TILES.COLUMN;
        grid[3][8] = TILES.COLUMN;
        grid[3][WIDTH - 5] = theme.hasBraziers ? TILES.FLOOR : TILES.COLUMN;
        grid[HEIGHT - 4][6] = TILES.COLUMN;
        grid[HEIGHT - 4][WIDTH - 7] = TILES.COLUMN;
        grid[midY][WIDTH - 3] = TILES.COLUMN;
    } else if (theme.columnStyle === 'minimal') {
        // Just two columns for Asian minimalism
        grid[midY][3] = TILES.COLUMN;
        grid[midY][WIDTH - 4] = TILES.COLUMN;
    }
    // 'none' - no columns

    // PLANTS based on density
    const plantPositions = [
        { x: 2, y: 2 }, { x: WIDTH - 3, y: 2 },
        { x: 2, y: HEIGHT - 3 }, { x: WIDTH - 3, y: HEIGHT - 3 },
        { x: 7, y: midY - 2 }, { x: WIDTH - 8, y: midY + 2 },
        { x: midX - 3, y: 3 }, { x: midX + 3, y: HEIGHT - 4 }
    ];
    const plantCount = theme.plantDensity === 'lush' ? 7 : theme.plantDensity === 'moderate' ? 4 : 2;
    for (let i = 0; i < plantCount && i < plantPositions.length; i++) {
        const pos = plantPositions[i];
        if (grid[pos.y][pos.x] === TILES.FLOOR) {
            grid[pos.y][pos.x] = TILES.PLANT;
        }
    }

    // LIGHTING based on style
    if (theme.lightingStyle === 'bright') {
        // Multiple lamps, well-lit European style
        grid[2][midX] = TILES.LAMP;
        grid[HEIGHT - 3][midX] = TILES.LAMP;
        grid[midY][4] = TILES.LAMP;
        grid[midY][WIDTH - 5] = TILES.LAMP;
    } else if (theme.lightingStyle === 'atmospheric') {
        // Lanterns for softer, moodier lighting
        grid[3][6] = TILES.LANTERN;
        grid[HEIGHT - 4][WIDTH - 7] = TILES.LANTERN;
        if (rand() > 0.5) grid[midY][midX + 4] = TILES.LANTERN;
    } else if (theme.lightingStyle === 'dramatic') {
        // Few lights, dramatic shadows
        grid[2][midX] = TILES.LANTERN;
        grid[midY][2] = TILES.LANTERN;
    }

    // DISPLAYS - main showcase (content varies by culture)
    // Display cases are 2-tiles wide, so never place them on adjacent rows
    // Left wing showcase - just one display case, not stacked vertically
    grid[midY][2] = TILES.DISPLAY;

    // Right side alcoves with regional artifacts - spaced 5 rows apart
    for(let alcove = 0; alcove < 2; alcove++) {
        const ay = 3 + alcove * 5;
        if (ay + 1 < HEIGHT - 3) {
            grid[ay + 1][WIDTH - 3] = TILES.DISPLAY;
        }
    }

    // Scattered displays - fewer, well-spaced positions
    const displayChance = theme.region === 'european' ? 0.35 : 0.2;
    const displayPositions = [
        { x: 7, y: 4 }, { x: midX + 4, y: HEIGHT - 5 }
    ];
    for(const pos of displayPositions) {
        if (rand() > (1 - displayChance) && grid[pos.y][pos.x] === TILES.FLOOR) {
            grid[pos.y][pos.x] = TILES.DISPLAY;
        }
    }

    // STATUE - culturally appropriate focal point
    // Different placement and quantity by region
    if (theme.region === 'european') {
        // Classical statue in prominent position
        grid[3][midX] = TILES.STATUE;
    } else if (theme.region === 'asian') {
        // Buddha or deity, often paired
        grid[2][midX - 1] = TILES.STATUE;
        grid[2][midX + 1] = TILES.STATUE;
    } else if (theme.region === 'middle_eastern') {
        // No figurative statues (Islamic tradition), use columns/displays instead
        grid[2][midX] = TILES.COLUMN;
    } else if (theme.region === 'american') {
        // Pre-Columbian idol or gaucho figure
        grid[midY - 2][midX + 3] = TILES.STATUE;
    } else if (theme.region === 'african') {
        // Tribal figures, often multiple
        grid[3][midX - 2] = TILES.STATUE;
        grid[3][midX + 2] = TILES.STATUE;
    }

    // BANNERS/MURALS on back wall (regional decorations)
    if (theme.region === 'asian' || theme.region === 'middle_eastern') {
        // Screens or calligraphy - partial wall decoration
        for(let x = 6; x < 10; x++) {
            grid[1][x] = TILES.BANNER;
        }
        for(let x = WIDTH - 10; x < WIDTH - 6; x++) {
            grid[1][x] = TILES.BANNER;
        }
    } else {
        // European - full tapestry or painting wall
        for(let x = 5; x < WIDTH - 5; x++) {
            if (rand() > 0.3) grid[1][x] = TILES.BANNER;
        }
    }

    // FURNITURE CLUSTERS - culturally appropriate seating arrangements
    if (theme.region === 'middle_eastern') {
        // Oriental seating around braziers
        placeFurnitureCluster(grid, ORIENTAL_CLUSTER, 5, midY - 1, rand);
        if (rand() > 0.5) {
            placeFurnitureCluster(grid, ORIENTAL_CLUSTER, WIDTH - 8, midY - 1, rand);
        }
    } else if (theme.region === 'european' || theme.region === 'american') {
        // Conversation nooks with chairs and tables
        placeFurnitureCluster(grid, CONVERSATION_CLUSTER, 5, midY - 1, rand);
        // Museum viewing area near displays
        if (rand() > 0.4) {
            placeFurnitureCluster(grid, MUSEUM_VIEWING_CLUSTER, midX + 2, 3, rand);
        }
    } else if (theme.region === 'asian') {
        // Minimal seating - just benches for contemplation
        grid[midY - 1][midX + 4] = TILES.BENCH;
        grid[midY + 1][midX + 4] = TILES.BENCH;
    } else {
        // Default - benches for visitors
        grid[midY - 1][midX] = TILES.BENCH;
        grid[midY + 1][midX] = TILES.BENCH;
    }

    // Statue with viewing benches (for European galleries)
    if (theme.region === 'european' && rand() > 0.6) {
        placeFurnitureCluster(grid, STATUE_VIEWING_CLUSTER, WIDTH - 8, 4, rand);
    }

    // Newspaper left by visitor
    if (rand() > 0.6) {
        grid[midY + 2][midX + 3] = TILES.NEWSPAPER;
    }
};

// 3. Garden (French Formal Garden - Jardin à la française)
const generateGarden = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH/2);
    const midY = Math.floor(HEIGHT/2);

    // Fill with manicured lawn
    for(let y=0; y<HEIGHT; y++) {
        for(let x=0; x<WIDTH; x++) {
            grid[y][x] = TILES.GRASS;
        }
    }

    // Main axial gravel paths (formal French garden style)
    // Central north-south axis
    for(let y=0; y<HEIGHT; y++) {
        grid[y][midX-1] = TILES.GRAVEL;
        grid[y][midX] = TILES.GRAVEL;
    }
    // Central east-west axis
    for(let x=0; x<WIDTH; x++) {
        grid[midY-1][x] = TILES.GRAVEL;
        grid[midY][x] = TILES.GRAVEL;
    }

    // Diagonal paths from corners to center (optional based on seed)
    if (rand() > 0.5) {
        // NW to center
        for(let i=0; i<Math.min(midX, midY); i++) {
            if (grid[i][i] === TILES.GRASS) grid[i][i] = TILES.GRAVEL;
        }
        // NE to center
        for(let i=0; i<Math.min(midX, midY); i++) {
            if (grid[i][WIDTH-1-i] === TILES.GRASS) grid[i][WIDTH-1-i] = TILES.GRAVEL;
        }
    }

    // Circular plaza around center (formal garden parterre)
    for(let dy=-2; dy<=2; dy++) {
        for(let dx=-2; dx<=2; dx++) {
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist <= 2.5) {
                grid[midY+dy][midX+dx] = TILES.GRAVEL;
            }
        }
    }

    // Central Beaux-Arts fountain (medium 5x5 fountain)
    placeMediumFountain(grid, midX, midY, 'statue');

    // Formal hedge borders around quadrants
    // NW quadrant hedge
    for(let x=3; x<midX-3; x++) {
        grid[2][x] = TILES.HEDGE;
        grid[midY-3][x] = TILES.HEDGE;
    }
    for(let y=2; y<midY-3; y++) {
        grid[y][3] = TILES.HEDGE;
        grid[y][midX-3] = TILES.HEDGE;
    }

    // NE quadrant hedge
    for(let x=midX+3; x<WIDTH-3; x++) {
        grid[2][x] = TILES.HEDGE;
        grid[midY-3][x] = TILES.HEDGE;
    }
    for(let y=2; y<midY-3; y++) {
        grid[y][midX+3] = TILES.HEDGE;
        grid[y][WIDTH-4] = TILES.HEDGE;
    }

    // Flowerbeds inside hedge-bordered areas (formal parterres)
    const parterrePositions = [
        { x: 5, y: 4 }, { x: 8, y: 4 },
        { x: midX+5, y: 4 }, { x: midX+8, y: 4 },
        { x: 5, y: midY+3 }, { x: 8, y: midY+3 },
        { x: midX+5, y: midY+3 }, { x: midX+8, y: midY+3 },
    ];
    for(const pos of parterrePositions) {
        if (pos.x < WIDTH-2 && pos.y < HEIGHT-2 && grid[pos.y][pos.x] === TILES.GRASS) {
            grid[pos.y][pos.x] = TILES.FLOWERBED;
            if (pos.x+1 < WIDTH-2) grid[pos.y][pos.x+1] = TILES.FLOWERBED;
        }
    }

    // Chestnut trees along perimeter
    const treePerimeterX = [2, 7, 12, 17, 21];
    for(const tx of treePerimeterX) {
        if (tx < WIDTH) {
            grid[1][tx] = TILES.TREE;
            grid[HEIGHT-2][tx] = TILES.TREE;
        }
    }
    const treePerimeterY = [3, 6, 9];
    for(const ty of treePerimeterY) {
        if (ty < HEIGHT) {
            grid[ty][1] = TILES.TREE;
            grid[ty][WIDTH-2] = TILES.TREE;
        }
    }

    // Benches at strategic viewing points
    grid[midY-3][midX-4] = TILES.BENCH;
    grid[midY-3][midX+4] = TILES.BENCH;
    grid[midY+3][midX-4] = TILES.BENCH;
    grid[midY+3][midX+4] = TILES.BENCH;

    // Gas lamps along main paths
    grid[3][midX-1] = TILES.LAMP;
    grid[HEIGHT-4][midX] = TILES.LAMP;
    grid[midY-1][4] = TILES.LAMP;
    grid[midY][WIDTH-5] = TILES.LAMP;

    // Statues at path intersections (if space)
    if (rand() > 0.5) {
        grid[4][midX-4] = TILES.STATUE;
    }
    if (rand() > 0.5) {
        grid[4][midX+4] = TILES.STATUE;
    }

    // Potted palms for exotic flair (1889 colonial exhibition influence)
    if (rand() > 0.4) {
        grid[3][6] = TILES.PLANT;
        grid[3][WIDTH-7] = TILES.PLANT;
    }
};

// 4. Street (Authentic 1889 Parisian Boulevard)
// Now generates two variants: North-South running or East-West running streets
// IMPORTANT: Always has connecting alleys from ALL four edges to ensure accessibility
const generateStreet = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Determine street orientation: N-S (vertical) or E-W (horizontal)
    const isVertical = rand() > 0.5;

    // Determine if this is an avenue (with trees) or a regular street
    const isAvenue = rand() > 0.6;

    // Fill with empty space (represents buildings/walls on sides)
    for(let y=0; y<HEIGHT; y++) {
        for(let x=0; x<WIDTH; x++) {
            grid[y][x] = TILES.WALL;
        }
    }

    if (isVertical) {
        // North-South street: narrow corridor running top to bottom
        const streetWidth = isAvenue ? 10 : 6;
        const startX = midX - Math.floor(streetWidth / 2);
        const endX = startX + streetWidth;

        // Main cobblestone road in the center
        for(let y=0; y<HEIGHT; y++) {
            for(let x=startX; x<endX; x++) {
                grid[y][x] = TILES.FLOOR;
            }
        }

        // CONNECTING ALLEYS from East and West edges to main street
        // West alley (from x=0 to startX)
        for(let x=0; x<startX; x++) {
            grid[midY][x] = TILES.FLOOR;
            grid[midY - 1][x] = TILES.FLOOR;
        }
        // East alley (from endX to WIDTH-1)
        for(let x=endX; x<WIDTH; x++) {
            grid[midY][x] = TILES.FLOOR;
            grid[midY - 1][x] = TILES.FLOOR;
        }

        // Sidewalks on each side (paved path)
        for(let y=0; y<HEIGHT; y++) {
            if (startX > 0 && grid[y][startX] === TILES.FLOOR) grid[y][startX] = TILES.PATH;
            if (endX - 1 < WIDTH && grid[y][endX - 1] === TILES.FLOOR) grid[y][endX - 1] = TILES.PATH;
        }

        // Gas lamps along sidewalks (avoid alley intersection)
        for(let y=2; y<HEIGHT-2; y+=4) {
            if (y !== midY && y !== midY - 1) {
                if (startX > 0) grid[y][startX] = TILES.LAMP;
                if (endX - 1 < WIDTH) grid[y][endX - 1] = TILES.LAMP;
            }
        }

        // Avenue variant: rows of chestnut trees
        if (isAvenue) {
            for(let y=2; y<HEIGHT-2; y+=3) {
                if (y !== midY && y !== midY - 1 && y !== midY + 1) {
                    if (rand() > 0.3) grid[y][startX + 1] = TILES.TREE;
                    if (rand() > 0.3) grid[y][endX - 2] = TILES.TREE;
                }
            }
        }

        // Benches along sidewalks
        if (rand() > 0.4) {
            const benchY = 4 + Math.floor(rand() * 3);
            if (benchY !== midY && benchY !== midY - 1) grid[benchY][startX] = TILES.BENCH;
        }
        if (rand() > 0.4) {
            const benchY = HEIGHT - 6 + Math.floor(rand() * 3);
            if (benchY !== midY && benchY !== midY - 1) grid[benchY][endX - 1] = TILES.BENCH;
        }

        // Kiosk on one side (not blocking alley)
        if (rand() > 0.5) {
            const kioskY = 3 + Math.floor(rand() * 3);
            if (kioskY !== midY && kioskY !== midY - 1) grid[kioskY][startX + 1] = TILES.KIOSK;
        }

        // Horse-drawn carriage in the road (not blocking alley)
        if (rand() > 0.4) {
            const carriageY = 3 + Math.floor(rand() * 4);
            if (carriageY !== midY && carriageY !== midY - 1) {
                grid[carriageY][midX] = TILES.CARRIAGE;
                grid[carriageY + 1][midX] = TILES.CARRIAGE;
            }
        }

        // Doors/exits at ALL four edges
        grid[0][midX] = TILES.DOOR;
        grid[0][midX - 1] = TILES.DOOR;
        grid[HEIGHT-1][midX] = TILES.DOOR;
        grid[HEIGHT-1][midX - 1] = TILES.DOOR;
        grid[midY][0] = TILES.DOOR;
        grid[midY - 1][0] = TILES.DOOR;
        grid[midY][WIDTH-1] = TILES.DOOR;
        grid[midY - 1][WIDTH-1] = TILES.DOOR;

    } else {
        // East-West street: narrow corridor running left to right
        const streetWidth = isAvenue ? 10 : 6;
        const startY = midY - Math.floor(streetWidth / 2);
        const endY = startY + streetWidth;

        // Main cobblestone road in the center
        for(let y=startY; y<endY; y++) {
            for(let x=0; x<WIDTH; x++) {
                grid[y][x] = TILES.FLOOR;
            }
        }

        // CONNECTING ALLEYS from North and South edges to main street
        // North alley (from y=0 to startY)
        for(let y=0; y<startY; y++) {
            grid[y][midX] = TILES.FLOOR;
            grid[y][midX - 1] = TILES.FLOOR;
        }
        // South alley (from endY to HEIGHT-1)
        for(let y=endY; y<HEIGHT; y++) {
            grid[y][midX] = TILES.FLOOR;
            grid[y][midX - 1] = TILES.FLOOR;
        }

        // Sidewalks on top and bottom (paved path)
        for(let x=0; x<WIDTH; x++) {
            if (startY > 0 && grid[startY][x] === TILES.FLOOR) grid[startY][x] = TILES.PATH;
            if (endY - 1 < HEIGHT && grid[endY - 1][x] === TILES.FLOOR) grid[endY - 1][x] = TILES.PATH;
        }

        // Gas lamps along sidewalks (avoid alley intersection)
        for(let x=2; x<WIDTH-2; x+=4) {
            if (x !== midX && x !== midX - 1) {
                if (startY > 0) grid[startY][x] = TILES.LAMP;
                if (endY - 1 < HEIGHT) grid[endY - 1][x] = TILES.LAMP;
            }
        }

        // Avenue variant: rows of chestnut trees
        if (isAvenue) {
            for(let x=2; x<WIDTH-2; x+=3) {
                if (x !== midX && x !== midX - 1 && x !== midX + 1) {
                    if (rand() > 0.3) grid[startY + 1][x] = TILES.TREE;
                    if (rand() > 0.3) grid[endY - 2][x] = TILES.TREE;
                }
            }
        }

        // Benches along sidewalks
        if (rand() > 0.4) {
            const benchX = 4 + Math.floor(rand() * 3);
            if (benchX !== midX && benchX !== midX - 1) grid[startY][benchX] = TILES.BENCH;
        }
        if (rand() > 0.4) {
            const benchX = WIDTH - 6 + Math.floor(rand() * 3);
            if (benchX !== midX && benchX !== midX - 1) grid[endY - 1][benchX] = TILES.BENCH;
        }

        // Kiosk on one side (not blocking alley)
        if (rand() > 0.5) {
            const kioskX = 3 + Math.floor(rand() * 3);
            if (kioskX !== midX && kioskX !== midX - 1) grid[startY + 1][kioskX] = TILES.KIOSK;
        }

        // Horse-drawn carriage in the road (not blocking alley)
        if (rand() > 0.4) {
            const carriageX = 3 + Math.floor(rand() * 5);
            if (carriageX !== midX && carriageX !== midX - 1) {
                grid[midY][carriageX] = TILES.CARRIAGE;
                grid[midY][carriageX + 1] = TILES.CARRIAGE;
            }
        }

        // Doors/exits at ALL four edges
        grid[midY][0] = TILES.DOOR;
        grid[midY - 1][0] = TILES.DOOR;
        grid[midY][WIDTH-1] = TILES.DOOR;
        grid[midY - 1][WIDTH-1] = TILES.DOOR;
        grid[0][midX] = TILES.DOOR;
        grid[0][midX - 1] = TILES.DOOR;
        grid[HEIGHT-1][midX] = TILES.DOOR;
        grid[HEIGHT-1][midX - 1] = TILES.DOOR;
    }

    // Scattered newspapers on ground
    for(let i = 0; i < 2; i++) {
        const nx = 2 + Math.floor(rand() * (WIDTH - 4));
        const ny = 2 + Math.floor(rand() * (HEIGHT - 4));
        if (grid[ny][nx] === TILES.FLOOR) {
            grid[ny][nx] = TILES.NEWSPAPER;
        }
    }

    // Occasional puddles (rainy Paris atmosphere)
    if (rand() > 0.5) {
        for(let y=0; y<HEIGHT; y++) {
            for(let x=0; x<WIDTH; x++) {
                if (grid[y][x] === TILES.FLOOR && rand() > 0.97) {
                    grid[y][x] = TILES.PUDDLE;
                }
            }
        }
    }

    // Steam from nearby machinery/vents (industrial age)
    if (rand() > 0.6) {
        for(let y=0; y<HEIGHT; y++) {
            for(let x=0; x<WIDTH; x++) {
                if (grid[y][x] === TILES.FLOOR && rand() > 0.98) {
                    grid[y][x] = TILES.STEAM;
                }
            }
        }
    }

    // Small café cluster on sidewalk (not blocking alleys)
    if (rand() > 0.6) {
        const cafeX = isVertical ? (midX + 2) : (4 + Math.floor(rand() * 4));
        const cafeY = isVertical ? (4 + Math.floor(rand() * 3)) : (midY + 2);
        if (grid[cafeY][cafeX] === TILES.PATH || grid[cafeY][cafeX] === TILES.FLOOR) {
            placeFurnitureCluster(grid, CAFE_CLUSTER, cafeX, cafeY, rand);
        }
    }
};

// 5. Tower Base (Ground level beneath the Eiffel Tower)
const generateTowerBase = (grid: string[][]) => {
    // Fill with iron lattice floor pattern
    for(let y=0; y<HEIGHT; y++) {
        for(let x=0; x<WIDTH; x++) {
            // Create crosshatch pattern for iron floor
            if ((x + y) % 3 === 0) {
                grid[y][x] = TILES.PATH; // Decorative lattice
            } else {
                grid[y][x] = TILES.FLOOR;
            }
        }
    }

    // Place four massive tower pylons at corners (3x3 each)
    const pylonPositions = [
        { x: 2, y: 2 },      // NW
        { x: WIDTH - 5, y: 2 },   // NE
        { x: 2, y: HEIGHT - 5 },  // SW
        { x: WIDTH - 5, y: HEIGHT - 5 } // SE
    ];

    for (const pos of pylonPositions) {
        for (let dy = 0; dy < 3; dy++) {
            for (let dx = 0; dx < 3; dx++) {
                grid[pos.y + dy][pos.x + dx] = TILES.PYLON;
            }
        }
    }

    // Central elevator entrance (2x2)
    const centerX = Math.floor(WIDTH / 2) - 1;
    const centerY = Math.floor(HEIGHT / 2) - 1;
    grid[centerY][centerX] = TILES.ELEVATOR;
    grid[centerY][centerX + 1] = TILES.ELEVATOR;
    grid[centerY + 1][centerX] = TILES.ELEVATOR;
    grid[centerY + 1][centerX + 1] = TILES.ELEVATOR;

    // Add decorative iron girders connecting pylons (visual only)
    const midY = Math.floor(HEIGHT / 2);
    const midX = Math.floor(WIDTH / 2);

    // Horizontal girders
    for (let x = 5; x < centerX - 1; x++) {
        grid[2][x] = ':';
        grid[HEIGHT - 3][x] = ':';
    }
    for (let x = centerX + 3; x < WIDTH - 5; x++) {
        grid[2][x] = ':';
        grid[HEIGHT - 3][x] = ':';
    }

    // Lamps near pylons
    grid[1][6] = TILES.LAMP;
    grid[1][WIDTH - 7] = TILES.LAMP;
    grid[HEIGHT - 2][6] = TILES.LAMP;
    grid[HEIGHT - 2][WIDTH - 7] = TILES.LAMP;
};

// 6. Tower Platform (Elevated observation deck - small, dangerous, no railings!)
const generateTowerPlatform = (grid: string[][]) => {
    // Fill entire grid with void (terrifying sky/drop)
    for(let y=0; y<HEIGHT; y++) {
        for(let x=0; x<WIDTH; x++) {
            grid[y][x] = TILES.VOID;
        }
    }

    // Create a small, irregular cross-shaped platform in the center
    // NO RAILINGS - just iron grating over the void
    const centerX = Math.floor(WIDTH / 2);
    const centerY = Math.floor(HEIGHT / 2);

    // Central core (4x4) - safe area with elevator
    for (let dy = -2; dy <= 1; dy++) {
        for (let dx = -2; dx <= 1; dx++) {
            const nx = centerX + dx;
            const ny = centerY + dy;
            if (ny >= 0 && ny < HEIGHT && nx >= 0 && nx < WIDTH) {
                // Iron grating pattern
                if ((nx + ny) % 2 === 0) {
                    grid[ny][nx] = TILES.PATH;
                } else {
                    grid[ny][nx] = TILES.FLOOR;
                }
            }
        }
    }

    // North arm (narrow walkway) - 2 tiles wide, extends north
    for (let dy = -5; dy < -2; dy++) {
        for (let dx = -1; dx <= 0; dx++) {
            const nx = centerX + dx;
            const ny = centerY + dy;
            if (ny >= 0 && ny < HEIGHT && nx >= 0 && nx < WIDTH) {
                grid[ny][nx] = (nx + ny) % 2 === 0 ? TILES.PATH : TILES.FLOOR;
            }
        }
    }

    // South arm (narrow walkway)
    for (let dy = 2; dy <= 4; dy++) {
        for (let dx = -1; dx <= 0; dx++) {
            const nx = centerX + dx;
            const ny = centerY + dy;
            if (ny >= 0 && ny < HEIGHT && nx >= 0 && nx < WIDTH) {
                grid[ny][nx] = (nx + ny) % 2 === 0 ? TILES.PATH : TILES.FLOOR;
            }
        }
    }

    // East arm (narrow walkway)
    for (let dx = 2; dx <= 6; dx++) {
        for (let dy = -1; dy <= 0; dy++) {
            const nx = centerX + dx;
            const ny = centerY + dy;
            if (ny >= 0 && ny < HEIGHT && nx >= 0 && nx < WIDTH) {
                grid[ny][nx] = (nx + ny) % 2 === 0 ? TILES.PATH : TILES.FLOOR;
            }
        }
    }

    // West arm (narrow walkway)
    for (let dx = -7; dx < -2; dx++) {
        for (let dy = -1; dy <= 0; dy++) {
            const nx = centerX + dx;
            const ny = centerY + dy;
            if (ny >= 0 && ny < HEIGHT && nx >= 0 && nx < WIDTH) {
                grid[ny][nx] = (nx + ny) % 2 === 0 ? TILES.PATH : TILES.FLOOR;
            }
        }
    }

    // Small viewing platforms at the end of each arm (just 2x2)
    // North viewing point
    grid[centerY - 5][centerX - 1] = TILES.FLOOR;
    grid[centerY - 5][centerX] = TILES.FLOOR;

    // East viewing point - telescope here
    grid[centerY - 1][centerX + 6] = TILES.FLOOR;
    grid[centerY][centerX + 6] = TILES.TELESCOPE;

    // West viewing point - bench here
    grid[centerY - 1][centerX - 7] = TILES.BENCH;
    grid[centerY][centerX - 7] = TILES.FLOOR;

    // Place elevator in the center core (to go back down)
    grid[centerY][centerX - 1] = TILES.ELEVATOR;

    // Place a single small lamp post for atmosphere (but it won't save you from falling)
    grid[centerY - 1][centerX] = TILES.LAMP;
};

// 7. Esplanade (Grand open plaza - vast, paved, ceremonial)
// Think Place de la Concorde or the great public squares - NOT a garden
const generateEsplanade = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // VAST paved plaza - mostly gravel/packed earth (not grass!)
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.GRAVEL;
        }
    }

    // Low stone balustrade around perimeter (open, not walled)
    for (let x = 0; x < WIDTH; x++) {
        // Gaps for entries at cardinal points
        if (x < midX - 3 || x > midX + 3) {
            grid[0][x] = TILES.RAILING;
            grid[HEIGHT - 1][x] = TILES.RAILING;
        }
    }
    for (let y = 0; y < HEIGHT; y++) {
        if (y < midY - 2 || y > midY + 2) {
            grid[y][0] = TILES.RAILING;
            grid[y][WIDTH - 1] = TILES.RAILING;
        }
    }

    // GRAND CENTRAL MONUMENT (large, imposing - not a fountain)
    // Could be an obelisk, equestrian statue, or victory column
    grid[midY - 1][midX - 1] = TILES.COLUMN;
    grid[midY - 1][midX] = TILES.COLUMN;
    grid[midY - 1][midX + 1] = TILES.COLUMN;
    grid[midY][midX - 1] = TILES.COLUMN;
    grid[midY][midX] = TILES.STATUE; // Central figure
    grid[midY][midX + 1] = TILES.COLUMN;
    grid[midY + 1][midX - 1] = TILES.COLUMN;
    grid[midY + 1][midX] = TILES.COLUMN;
    grid[midY + 1][midX + 1] = TILES.COLUMN;

    // Decorative pavement pattern radiating from center
    // Cobblestone paths emanating outward
    for (let x = 3; x < WIDTH - 3; x++) {
        grid[midY][x] = TILES.PATH; // Main east-west axis
    }
    for (let y = 2; y < HEIGHT - 2; y++) {
        grid[y][midX] = TILES.PATH; // Main north-south axis
    }

    // Four symmetrical lamp standards (grand public lighting)
    grid[midY - 3][midX - 4] = TILES.LAMP;
    grid[midY - 3][midX + 4] = TILES.LAMP;
    grid[midY + 3][midX - 4] = TILES.LAMP;
    grid[midY + 3][midX + 4] = TILES.LAMP;

    // Corner pedestals with urns/small statues
    grid[2][3] = TILES.STATUE;
    grid[2][WIDTH - 4] = TILES.STATUE;
    grid[HEIGHT - 3][3] = TILES.STATUE;
    grid[HEIGHT - 3][WIDTH - 4] = TILES.STATUE;

    // Rows of benches for promenaders (facing the monument)
    for (let i = 0; i < 3; i++) {
        const bx = 6 + i * 3;
        if (bx < midX - 3) {
            grid[midY - 2][bx] = TILES.BENCH;
            grid[midY + 2][bx] = TILES.BENCH;
        }
    }
    for (let i = 0; i < 3; i++) {
        const bx = WIDTH - 7 - i * 3;
        if (bx > midX + 3) {
            grid[midY - 2][bx] = TILES.BENCH;
            grid[midY + 2][bx] = TILES.BENCH;
        }
    }

    // Kiosk / newspaper stand (public square amenity)
    if (rand() > 0.4) {
        grid[3][6] = TILES.KIOSK;
    }

    // Flagpoles / banners at corners (national pride)
    grid[1][5] = TILES.BANNER;
    grid[1][WIDTH - 6] = TILES.BANNER;

    // Scattered carriages waiting (public square was for transport)
    if (rand() > 0.3) {
        grid[HEIGHT - 3][7] = TILES.CARRIAGE;
        grid[HEIGHT - 3][8] = TILES.CARRIAGE;
    }
    if (rand() > 0.5) {
        grid[3][WIDTH - 8] = TILES.CARRIAGE;
    }

    // NO trees in the main plaza - this is paved, urban space
    // Only a few potted plants near benches
    if (rand() > 0.5) {
        grid[midY - 2][5] = TILES.PLANT;
        grid[midY + 2][WIDTH - 6] = TILES.PLANT;
    }

    // Newspapers scattered (busy public space)
    if (rand() > 0.5) {
        grid[midY + 1][midX + 5] = TILES.NEWSPAPER;
    }
};

// 8. Tower First Floor (Restaurant level - 57m up)
// Historically: Le Figaro newspaper office, Anglo-American Bar, Flemish Restaurant
const generateTowerFirstFloor = (grid: string[][]) => {
    // Fill with elegant iron lattice floor
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            // Iron grating pattern with glass sections
            if ((x + y) % 4 === 0) {
                grid[y][x] = TILES.GLASS_FLOOR; // Glass floor - see Paris below!
            } else if ((x + y) % 2 === 0) {
                grid[y][x] = TILES.PATH;
            } else {
                grid[y][x] = TILES.FLOOR;
            }
        }
    }

    // Outer iron framework (walls)
    for (let x = 0; x < WIDTH; x++) {
        grid[0][x] = TILES.RAILING;
        grid[HEIGHT - 1][x] = TILES.RAILING;
    }
    for (let y = 0; y < HEIGHT; y++) {
        grid[y][0] = TILES.RAILING;
        grid[y][WIDTH - 1] = TILES.RAILING;
    }

    // Viewing windows along the edges (gaps in railing for views)
    const windowPositions = [5, 10, 14, 19];
    for (const wx of windowPositions) {
        if (wx < WIDTH) {
            grid[0][wx] = TILES.WINDOW;
            grid[HEIGHT - 1][wx] = TILES.WINDOW;
        }
    }
    grid[4][0] = TILES.WINDOW;
    grid[9][0] = TILES.WINDOW;
    grid[4][WIDTH - 1] = TILES.WINDOW;
    grid[9][WIDTH - 1] = TILES.WINDOW;

    // Central elevator shaft (2x2)
    const centerX = Math.floor(WIDTH / 2) - 1;
    const centerY = Math.floor(HEIGHT / 2) - 1;
    grid[centerY][centerX] = TILES.ELEVATOR;
    grid[centerY][centerX + 1] = TILES.ELEVATOR;
    grid[centerY + 1][centerX] = TILES.ELEVATOR;
    grid[centerY + 1][centerX + 1] = TILES.ELEVATOR;

    // Restaurant area (left side) - Flemish Restaurant
    for (let y = 2; y < 6; y++) {
        for (let x = 2; x < 8; x++) {
            grid[y][x] = TILES.FLOOR;
        }
    }
    // Tables
    grid[2][3] = TILES.TABLE;
    grid[2][6] = TILES.TABLE;
    grid[4][3] = TILES.TABLE;
    grid[4][6] = TILES.TABLE;
    // Chairs/benches around tables
    grid[3][3] = TILES.BENCH;
    grid[3][6] = TILES.BENCH;

    // Anglo-American Bar (right side)
    for (let y = 2; y < 6; y++) {
        for (let x = WIDTH - 8; x < WIDTH - 2; x++) {
            grid[y][x] = TILES.FLOOR;
        }
    }
    // Bar counter
    grid[2][WIDTH - 7] = TILES.DISPLAY;
    grid[2][WIDTH - 6] = TILES.DISPLAY;
    grid[2][WIDTH - 5] = TILES.DISPLAY;
    grid[2][WIDTH - 4] = TILES.DISPLAY;
    // Bar stools
    grid[3][WIDTH - 7] = TILES.BENCH;
    grid[3][WIDTH - 5] = TILES.BENCH;

    // Le Figaro newspaper office (bottom area)
    for (let y = HEIGHT - 5; y < HEIGHT - 2; y++) {
        for (let x = 3; x < 10; x++) {
            grid[y][x] = TILES.FLOOR;
        }
    }
    // Desk with newspapers
    grid[HEIGHT - 4][5] = TILES.TABLE;
    grid[HEIGHT - 4][6] = TILES.TABLE;
    grid[HEIGHT - 4][7] = TILES.NEWSPAPER;
    grid[HEIGHT - 3][4] = TILES.BENCH;

    // Gift shop (bottom right)
    grid[HEIGHT - 4][WIDTH - 6] = TILES.KIOSK;
    grid[HEIGHT - 4][WIDTH - 5] = TILES.KIOSK;
    grid[HEIGHT - 3][WIDTH - 6] = TILES.DISPLAY;
    grid[HEIGHT - 3][WIDTH - 5] = TILES.DISPLAY;

    // Decorative plants in corners
    grid[1][1] = TILES.PLANT;
    grid[1][WIDTH - 2] = TILES.PLANT;
    grid[HEIGHT - 2][1] = TILES.PLANT;
    grid[HEIGHT - 2][WIDTH - 2] = TILES.PLANT;

    // Gas lamps for atmosphere
    grid[3][9] = TILES.LAMP;
    grid[3][WIDTH - 10] = TILES.LAMP;
    grid[HEIGHT - 4][11] = TILES.LAMP;

    // Telescope at one viewing window
    grid[1][10] = TILES.TELESCOPE;
};

// 9. Redesigned Tower Platform (Level 2) - SMALLER and MORE DANGEROUS
// This is 115m up - the second platform. Precarious iron grating over the void.
const generateTowerLevel2 = (grid: string[][]) => {
    // Fill EVERYTHING with fatal void
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.VOID;
        }
    }

    const centerX = Math.floor(WIDTH / 2);
    const centerY = Math.floor(HEIGHT / 2);

    // Very small central platform (3x3) - the only safe zone
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const nx = centerX + dx;
            const ny = centerY + dy;
            if (ny >= 0 && ny < HEIGHT && nx >= 0 && nx < WIDTH) {
                grid[ny][nx] = (nx + ny) % 2 === 0 ? TILES.PATH : TILES.FLOOR;
            }
        }
    }

    // Single narrow walkway north (1 tile wide!)
    for (let dy = -4; dy < -1; dy++) {
        const ny = centerY + dy;
        if (ny >= 0) {
            grid[ny][centerX] = TILES.PATH;
        }
    }

    // Single narrow walkway south
    for (let dy = 2; dy <= 4; dy++) {
        const ny = centerY + dy;
        if (ny < HEIGHT) {
            grid[ny][centerX] = TILES.PATH;
        }
    }

    // Single narrow walkway east (shorter)
    for (let dx = 2; dx <= 4; dx++) {
        const nx = centerX + dx;
        if (nx < WIDTH) {
            grid[centerY][nx] = TILES.PATH;
        }
    }

    // Single narrow walkway west (shorter)
    for (let dx = -4; dx <= -2; dx++) {
        const nx = centerX + dx;
        if (nx >= 0) {
            grid[centerY][nx] = TILES.PATH;
        }
    }

    // Tiny viewing spots at end of north and south arms (2x1)
    if (centerY - 4 >= 0) {
        grid[centerY - 4][centerX - 1] = TILES.FLOOR;
        grid[centerY - 4][centerX] = TILES.FLOOR;
        grid[centerY - 4][centerX + 1] = TILES.FLOOR;
    }
    if (centerY + 4 < HEIGHT) {
        grid[centerY + 4][centerX - 1] = TILES.FLOOR;
        grid[centerY + 4][centerX] = TILES.FLOOR;
        grid[centerY + 4][centerX + 1] = TILES.FLOOR;
    }

    // Elevator in center (only way down!)
    grid[centerY][centerX] = TILES.ELEVATOR;

    // One telescope at north viewing point
    if (centerY - 4 >= 0) {
        grid[centerY - 4][centerX + 1] = TILES.TELESCOPE;
    }

    // One bench at south (sit and contemplate mortality)
    if (centerY + 4 < HEIGHT) {
        grid[centerY + 4][centerX - 1] = TILES.BENCH;
    }

    // NO RAILINGS - just the void surrounding everything
    // Walking off the path = death
};

// 10. Concert Hall (Trocadéro) - Moorish-style interior
const generateConcertHall = (grid: string[][]) => {
    const midX = Math.floor(WIDTH / 2);

    // Clean polished floor throughout (no random carpet scatter)
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.FLOOR;
        }
    }

    // Walls
    for (let x = 0; x < WIDTH; x++) {
        grid[0][x] = TILES.WALL;
        grid[HEIGHT - 1][x] = TILES.WALL;
    }
    for (let y = 0; y < HEIGHT; y++) {
        grid[y][0] = TILES.WALL;
        grid[y][WIDTH - 1] = TILES.WALL;
    }

    // Stage at the north end (3 rows deep)
    for (let y = 1; y < 4; y++) {
        for (let x = 4; x < WIDTH - 4; x++) {
            grid[y][x] = TILES.STAGE;
        }
    }
    // Stage front edge (polished wood apron)
    for (let x = 4; x < WIDTH - 4; x++) {
        grid[4][x] = TILES.PATH;
    }

    // Tiered seating (rows of seats) - leave center aisle clear
    for (let row = 0; row < 5; row++) {
        const y = 6 + row * 2;
        if (y < HEIGHT - 2) {
            for (let x = 3; x < WIDTH - 3; x++) {
                // Leave 2-tile wide center aisle
                if (x !== midX && x !== midX - 1) {
                    grid[y][x] = TILES.SEAT;
                }
            }
        }
    }

    // SINGLE ELEGANT CENTER AISLE CARPET RUNNER
    // Runs from entrance (south) to stage (north)
    // 2 tiles wide for grandeur
    for (let y = 5; y < HEIGHT - 1; y++) {
        grid[y][midX - 1] = TILES.CARPET;
        grid[y][midX] = TILES.CARPET;
    }

    // Side aisles (plain floor, no carpet)
    for (let y = 5; y < HEIGHT - 1; y++) {
        grid[y][2] = TILES.FLOOR;
        grid[y][WIDTH - 3] = TILES.FLOOR;
    }

    // Ornate columns along sides (symmetrical)
    grid[5][1] = TILES.COLUMN;
    grid[9][1] = TILES.COLUMN;
    grid[13][1] = TILES.COLUMN;
    grid[5][WIDTH - 2] = TILES.COLUMN;
    grid[9][WIDTH - 2] = TILES.COLUMN;
    grid[13][WIDTH - 2] = TILES.COLUMN;

    // Grand chandelier (represented as lanterns) - symmetrical placement
    grid[7][midX] = TILES.LANTERN;
    grid[11][midX] = TILES.LANTERN;

    // Banners/tapestries on walls (symmetrical)
    grid[2][2] = TILES.BANNER;
    grid[2][WIDTH - 3] = TILES.BANNER;
    grid[7][1] = TILES.BANNER;
    grid[7][WIDTH - 2] = TILES.BANNER;

    // Entrance doors at south
    grid[HEIGHT - 1][midX - 1] = TILES.DOOR;
    grid[HEIGHT - 1][midX] = TILES.DOOR;
};

// 11. Souk (Rue du Caire, Tunisian Souk) - Winding narrow streets
// Uses seeded random for consistent generation across sessions
const generateSouk = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Start with walls everywhere
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.WALL;
        }
    }

    // FIRST: Carve guaranteed paths from door positions to center
    // This ensures the player can always navigate

    // Path from North door (y=0, x=midX) to center
    for (let y = 1; y <= midY; y++) {
        grid[y][midX] = TILES.FLOOR;
        grid[y][midX + 1] = TILES.FLOOR;
    }

    // Path from South door (y=HEIGHT-1, x=midX) to center
    for (let y = midY; y < HEIGHT - 1; y++) {
        grid[y][midX] = TILES.FLOOR;
        grid[y][midX + 1] = TILES.FLOOR;
    }

    // Path from West door (x=0, y=midY) to center
    for (let x = 1; x <= midX; x++) {
        grid[midY][x] = TILES.FLOOR;
        grid[midY - 1][x] = TILES.FLOOR;
    }

    // Path from East door (x=WIDTH-1, y=midY) to center
    for (let x = midX; x < WIDTH - 1; x++) {
        grid[midY][x] = TILES.FLOOR;
        grid[midY - 1][x] = TILES.FLOOR;
    }

    // NOW add winding secondary passages for atmosphere
    // Secondary winding alley from NW area
    let alleyX = 4;
    for (let y = 2; y < midY - 1; y++) {
        if (rand() < 0.35 && alleyX < midX - 3) {
            alleyX += 1;
        }
        grid[y][alleyX] = TILES.FLOOR;
        // Connect to main passage occasionally
        if (y === midY - 2) {
            for (let cx = alleyX; cx <= midX; cx++) {
                grid[y][cx] = TILES.FLOOR;
            }
        }
    }

    // Secondary passage from SE area
    let alleyX2 = WIDTH - 5;
    for (let y = HEIGHT - 3; y > midY + 1; y--) {
        if (rand() < 0.35 && alleyX2 > midX + 3) {
            alleyX2 -= 1;
        }
        grid[y][alleyX2] = TILES.FLOOR;
        // Connect to main passage occasionally
        if (y === midY + 2) {
            for (let cx = midX + 1; cx <= alleyX2; cx++) {
                grid[y][cx] = TILES.FLOOR;
            }
        }
    }

    // Central plaza (3x4) - guaranteed open space
    for (let dy = -1; dy <= 2; dy++) {
        for (let dx = -1; dx <= 2; dx++) {
            const py = midY + dy;
            const px = midX + dx;
            if (py > 0 && py < HEIGHT - 1 && px > 0 && px < WIDTH - 1) {
                grid[py][px] = TILES.FLOOR;
            }
        }
    }

    // Market stalls along walls (where there's floor adjacent to wall)
    // But NOT blocking main passages
    for (let y = 2; y < HEIGHT - 2; y++) {
        for (let x = 2; x < WIDTH - 2; x++) {
            // Skip the main crossroads
            if (Math.abs(x - midX) <= 1 || Math.abs(y - midY) <= 1) continue;

            if (grid[y][x] === TILES.FLOOR) {
                // Check if next to a wall
                const nearWall = grid[y-1]?.[x] === TILES.WALL ||
                                 grid[y+1]?.[x] === TILES.WALL;
                if (nearWall && rand() < 0.12) {
                    grid[y][x] = TILES.MARKET_STALL;
                }
            }
        }
    }

    // Hanging lanterns in passages (but not blocking movement)
    for (let y = 2; y < HEIGHT - 2; y += 4) {
        for (let x = 3; x < WIDTH - 3; x += 6) {
            if (grid[y][x] === TILES.FLOOR) {
                // Don't place on main crossroads
                if (Math.abs(x - midX) > 2 && Math.abs(y - midY) > 2) {
                    grid[y][x] = TILES.LANTERN;
                }
            }
        }
    }

    // Carpets displayed on ground
    for (let i = 0; i < 3; i++) {
        const rx = 4 + Math.floor(rand() * (WIDTH - 8));
        const ry = 3 + Math.floor(rand() * (HEIGHT - 6));
        if (grid[ry][rx] === TILES.FLOOR && Math.abs(rx - midX) > 2) {
            grid[ry][rx] = TILES.CARPET;
        }
    }

    // A donkey in the plaza!
    grid[midY + 1][midX + 1] = TILES.DONKEY;

    // Brazier in center for atmosphere
    grid[midY - 1][midX - 1] = TILES.BRAZIER;

    // Benches for tired shoppers - placed carefully
    if (grid[midY + 1][midX - 1] === TILES.FLOOR) {
        grid[midY + 1][midX - 1] = TILES.BENCH;
    }
};

// 12. Pont d'Iéna (The Bridge spanning the Seine)
// Real bridge: 155m long, 35m wide, 5 stone arches
// Connects Champ de Mars to Trocadéro - the main artery of the Exposition
const generateBridge = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midY = Math.floor(HEIGHT / 2);
    const midX = Math.floor(WIDTH / 2);

    // Fill entire area with flowing water (the Seine)
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.WATER;
        }
    }

    // The bridge deck - stone pavement running north-south
    // Bridge is about 6 tiles wide (central roadway + sidewalks)
    const bridgeLeft = midX - 3;
    const bridgeRight = midX + 3;

    for (let y = 0; y < HEIGHT; y++) {
        for (let x = bridgeLeft; x <= bridgeRight; x++) {
            // Main roadway in center
            if (x >= midX - 1 && x <= midX + 1) {
                grid[y][x] = TILES.FLOOR; // Cobblestone road
            } else {
                // Sidewalks on either side
                grid[y][x] = TILES.PATH; // Pedestrian walkway
            }
        }
    }

    // Stone balustrades (railings) along the edges
    for (let y = 0; y < HEIGHT; y++) {
        grid[y][bridgeLeft - 1] = TILES.RAILING;
        grid[y][bridgeRight + 1] = TILES.RAILING;
    }

    // Decorative lamp posts along the bridge (Parisian style)
    for (let y = 2; y < HEIGHT - 2; y += 3) {
        grid[y][bridgeLeft] = TILES.LAMP;
        grid[y][bridgeRight] = TILES.LAMP;
    }

    // Stone pier supports visible in the water (the 5 arches)
    // These are decorative - showing where the arches meet the water
    const pierPositions = [2, 5, 8, 11];
    for (const py of pierPositions) {
        if (py < HEIGHT) {
            // West pier
            grid[py][bridgeLeft - 3] = TILES.COLUMN;
            grid[py][bridgeLeft - 2] = TILES.COLUMN;
            // East pier
            grid[py][bridgeRight + 2] = TILES.COLUMN;
            grid[py][bridgeRight + 3] = TILES.COLUMN;
        }
    }

    // Carriages crossing the bridge
    if (rand() > 0.3) {
        const carriageY = 3 + Math.floor(rand() * 4);
        grid[carriageY][midX - 1] = TILES.CARRIAGE;
        grid[carriageY][midX] = TILES.CARRIAGE;
    }
    if (rand() > 0.5) {
        const carriageY = HEIGHT - 5 + Math.floor(rand() * 2);
        grid[carriageY][midX] = TILES.CARRIAGE;
    }

    // Benches at viewing points (people watching boats/tower)
    grid[3][bridgeLeft + 1] = TILES.BENCH;
    grid[3][bridgeRight - 1] = TILES.BENCH;
    grid[HEIGHT - 4][bridgeLeft + 1] = TILES.BENCH;
    grid[HEIGHT - 4][bridgeRight - 1] = TILES.BENCH;

    // A newspaper vendor's kiosk on the bridge
    if (rand() > 0.4) {
        grid[midY - 1][bridgeLeft + 1] = TILES.KIOSK;
    }

    // Scattered newspapers (the day's Le Figaro)
    if (rand() > 0.5) {
        grid[midY + 2][midX + 1] = TILES.NEWSPAPER;
    }

    // Potted plants at the decorative lamp bases
    if (rand() > 0.6) {
        grid[5][bridgeLeft] = TILES.PLANT;
        grid[5][bridgeRight] = TILES.PLANT;
    }

    // The north and south ends connect to land - create entrance areas
    // North entrance (toward Trocadéro)
    for (let x = bridgeLeft - 1; x <= bridgeRight + 1; x++) {
        grid[0][x] = TILES.PATH;
    }

    // South entrance (toward Eiffel Tower/Champ de Mars)
    for (let x = bridgeLeft - 1; x <= bridgeRight + 1; x++) {
        grid[HEIGHT - 1][x] = TILES.PATH;
    }
};

// 13. Gate Biome - Monumental entrance gates to the Exposition
// The 1889 Exposition had over 20 entrance gates. Porte Rapp was a major entrance
// featuring wrought iron arches, ticket booths (1 franc weekdays, 50 centimes Sundays),
// turnstiles, and guide kiosks selling programs for 50 centimes.
// NOTE: Multi-tile structures (kiosks, ticket booths, guard posts) are now 2x2,
// so we need generous spacing for a clean, symmetrical layout.
const generateGate = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);

    // Fill with gravel - outdoor entrance plaza
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.GRAVEL;
        }
    }

    // ========================================
    // MONUMENTAL IRON ARCH ENTRANCE (top)
    // ========================================

    // North wall with grand opening
    for (let x = 0; x < WIDTH; x++) {
        grid[0][x] = TILES.WALL;
    }
    // Create WIDE central opening (6 tiles wide)
    for (let x = midX - 3; x <= midX + 2; x++) {
        grid[0][x] = TILES.PATH;
    }

    // Grand iron arch pillars framing the main entrance
    grid[0][midX - 4] = TILES.GATE_ARCH;
    grid[1][midX - 4] = TILES.GATE_ARCH;
    grid[0][midX + 3] = TILES.GATE_ARCH;
    grid[1][midX + 3] = TILES.GATE_ARCH;

    // ========================================
    // FLAGPOLES (flanking the entrance, 3 tiles tall)
    // ========================================
    grid[3][midX - 6] = TILES.FLAGPOLE;
    grid[3][midX + 5] = TILES.FLAGPOLE;

    // ========================================
    // TICKET BOOTHS (2x2, positioned at sides with space)
    // One on each side, well spaced from other structures
    // ========================================
    grid[3][1] = TILES.TICKET_BOOTH;  // Left ticket booth (bottom-left of 2x2)
    grid[3][WIDTH - 3] = TILES.TICKET_BOOTH;  // Right ticket booth

    // ========================================
    // TURNSTILES (row across entrance area, spaced)
    // ========================================
    grid[5][midX - 2] = TILES.TURNSTILE;
    grid[5][midX + 1] = TILES.TURNSTILE;

    // ========================================
    // CENTRAL PROMENADE PATH
    // Wide cobblestone path leading into the exposition
    // ========================================
    for (let y = 2; y < HEIGHT - 1; y++) {
        grid[y][midX - 2] = TILES.PATH;
        grid[y][midX - 1] = TILES.PATH;
        grid[y][midX] = TILES.PATH;
        grid[y][midX + 1] = TILES.PATH;
    }

    // ========================================
    // DECORATIVE COLUMNS (flanking the path)
    // ========================================
    grid[6][midX - 4] = TILES.COLUMN;
    grid[6][midX + 3] = TILES.COLUMN;
    grid[10][midX - 4] = TILES.COLUMN;
    grid[10][midX + 3] = TILES.COLUMN;

    // ========================================
    // LAMP POSTS (along the promenade)
    // ========================================
    grid[8][midX - 3] = TILES.LAMP;
    grid[8][midX + 2] = TILES.LAMP;
    grid[13][midX - 3] = TILES.LAMP;
    grid[13][midX + 2] = TILES.LAMP;

    // ========================================
    // KIOSKS (2x2, in the open plaza areas)
    // Programs and guides for 50 centimes
    // ========================================
    grid[8][1] = TILES.KIOSK;  // Left kiosk
    grid[8][WIDTH - 3] = TILES.KIOSK;  // Right kiosk

    // ========================================
    // BENCHES (waiting areas, simple single-tile)
    // ========================================
    grid[12][2] = TILES.BENCH;
    grid[12][WIDTH - 3] = TILES.BENCH;
    grid[15][3] = TILES.BENCH;
    grid[15][WIDTH - 4] = TILES.BENCH;

    // ========================================
    // POTTED PALMS (decorative touches)
    // ========================================
    grid[6][1] = TILES.PLANT;
    grid[6][WIDTH - 2] = TILES.PLANT;

    // ========================================
    // SOUTHERN EXIT (into the exposition grounds)
    // ========================================
    for (let x = midX - 2; x <= midX + 1; x++) {
        grid[HEIGHT - 1][x] = TILES.DOOR;
    }

    // ========================================
    // SCATTERED NEWSPAPER (atmospheric detail)
    // ========================================
    if (rand() > 0.6) {
        grid[14][5] = TILES.NEWSPAPER;
    }
};

// 14. Enhanced Galerie des Machines (the largest building ever constructed)
// 420m long x 115m wide - the architectural wonder of the 1889 Exposition
const generateGalerieDesMachines = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midY = Math.floor(HEIGHT / 2);
    const midX = Math.floor(WIDTH / 2);

    // Iron plate floor
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.FLOOR;
        }
    }

    // Massive iron framework walls (the revolutionary hinged arches)
    for (let x = 0; x < WIDTH; x++) {
        grid[0][x] = TILES.WALL;
        grid[HEIGHT - 1][x] = TILES.WALL;
    }

    // Monumental iron columns supporting the 43m high roof
    // These are the famous "hinged three-pinned arches"
    for (let x = 3; x < WIDTH - 2; x += 6) {
        grid[1][x] = TILES.COLUMN;
        grid[HEIGHT - 2][x] = TILES.COLUMN;
    }

    // Central traveling crane track (pont roulant Édoux)
    // The revolutionary moving platform for visitors
    for (let x = 1; x < WIDTH - 1; x++) {
        grid[midY][x] = TILES.PATH;
    }

    // Main exhibition aisles (visitors can walk between machines)
    for (let x = 1; x < WIDTH - 1; x++) {
        grid[2][x] = TILES.FLOOR;
        grid[HEIGHT - 3][x] = TILES.FLOOR;
    }

    // NORTH SIDE - French Industrial Machinery
    // Large steam engines and generators
    for (let x = 4; x < WIDTH - 4; x += 7) {
        if (x + 3 < WIDTH - 3) {
            // Large machine (3x2)
            grid[3][x] = TILES.MACHINERY;
            grid[3][x + 1] = TILES.MACHINERY;
            grid[3][x + 2] = TILES.MACHINERY;
            grid[4][x] = TILES.MACHINERY;
            grid[4][x + 1] = TILES.MACHINERY;
            grid[4][x + 2] = TILES.MACHINERY;
            // Steam exhaust
            if (rand() > 0.3) {
                grid[2][x + 1] = TILES.STEAM;
            }
            // Safety railing
            grid[5][x] = TILES.RAILING;
            grid[5][x + 2] = TILES.RAILING;
        }
    }

    // SOUTH SIDE - International Machinery (more varied)
    for (let x = 4; x < WIDTH - 4; x += 6) {
        if (x + 2 < WIDTH - 3) {
            const machineType = rand();
            if (machineType > 0.6) {
                // Large engine
                grid[HEIGHT - 5][x] = TILES.MACHINERY;
                grid[HEIGHT - 5][x + 1] = TILES.MACHINERY;
                grid[HEIGHT - 4][x] = TILES.MACHINERY;
                grid[HEIGHT - 4][x + 1] = TILES.MACHINERY;
                if (rand() > 0.4) grid[HEIGHT - 6][x] = TILES.STEAM;
            } else if (machineType > 0.3) {
                // Display case with smaller machine/invention (single display, 2 tiles wide)
                grid[HEIGHT - 5][x] = TILES.DISPLAY;
                grid[HEIGHT - 4][x + 1] = TILES.BENCH; // Viewing bench offset
            } else {
                // Edison's electrical exhibits
                grid[HEIGHT - 5][x] = TILES.EXHIBIT;
                grid[HEIGHT - 4][x] = TILES.LAMP; // Electric demonstration
            }
        }
    }

    // Special Exhibits in the Center Area
    // Edison's Phonograph demonstration (major attraction)
    // Single display case (2 tiles wide) with viewing benches nearby
    grid[midY - 2][5] = TILES.DISPLAY;
    grid[midY - 1][5] = TILES.BENCH;
    grid[midY - 1][7] = TILES.BENCH;

    // Otis Elevator demonstration (revolutionary!)
    grid[midY - 2][WIDTH - 7] = TILES.ELEVATOR;
    grid[midY - 2][WIDTH - 6] = TILES.ELEVATOR;
    grid[midY - 1][WIDTH - 7] = TILES.RAILING;

    // Glass floor sections (view machinery below)
    grid[midY - 1][midX - 2] = TILES.GLASS_FLOOR;
    grid[midY - 1][midX - 1] = TILES.GLASS_FLOOR;
    grid[midY + 1][midX + 1] = TILES.GLASS_FLOOR;
    grid[midY + 1][midX + 2] = TILES.GLASS_FLOOR;

    // Observation platforms with benches
    grid[midY + 2][3] = TILES.BENCH;
    grid[midY + 2][WIDTH - 4] = TILES.BENCH;
    grid[midY - 2][midX] = TILES.BENCH;

    // Electric arc lighting (Edison vs Swan competition)
    for (let x = 2; x < WIDTH - 1; x += 3) {
        grid[1][x] = TILES.LAMP;
    }
    for (let x = 3; x < WIDTH - 1; x += 4) {
        grid[HEIGHT - 2][x] = TILES.LAMP;
    }

    // Potted palms for atmosphere (very 1889)
    grid[2][2] = TILES.PLANT;
    grid[2][WIDTH - 3] = TILES.PLANT;
    grid[HEIGHT - 3][2] = TILES.PLANT;
    grid[HEIGHT - 3][WIDTH - 3] = TILES.PLANT;

    // Newspaper discarded by visitor
    if (rand() > 0.5) {
        grid[midY + 1][8] = TILES.NEWSPAPER;
    }
};

// ============================================
// 13. Senegalese Village - Traditional African village setting
// ============================================
const generateVillage = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Fill with sandy earth floor
    for (let y = 1; y < HEIGHT - 1; y++) {
        for (let x = 1; x < WIDTH - 1; x++) {
            grid[y][x] = TILES.GRAVEL; // Sandy ground
        }
    }

    // Create irregular village wall (not straight)
    for (let x = 0; x < WIDTH; x++) {
        grid[0][x] = TILES.WALL;
        grid[HEIGHT - 1][x] = TILES.WALL;
    }
    for (let y = 0; y < HEIGHT; y++) {
        grid[y][0] = TILES.WALL;
        grid[y][WIDTH - 1] = TILES.WALL;
    }

    // Place thatched huts in a semi-circular pattern
    const hutPositions = [
        { x: 4, y: 2 },
        { x: 10, y: 2 },
        { x: 18, y: 2 },
        { x: 3, y: 6 },
        { x: 19, y: 6 },
    ];

    hutPositions.forEach(pos => {
        if (pos.x < WIDTH - 2 && pos.y < HEIGHT - 2) {
            grid[pos.y][pos.x] = TILES.THATCH_HUT;
            grid[pos.y][pos.x + 1] = TILES.THATCH_HUT;
            grid[pos.y + 1][pos.x] = TILES.FLOOR;  // Entrance
            grid[pos.y + 1][pos.x + 1] = TILES.FLOOR;
        }
    });

    // Central fire pit
    grid[midY][midX] = TILES.FIRE_PIT;
    grid[midY][midX - 1] = TILES.FLOOR;
    grid[midY][midX + 1] = TILES.FLOOR;
    grid[midY - 1][midX] = TILES.FLOOR;
    grid[midY + 1][midX] = TILES.FLOOR;

    // Ceremonial drums
    grid[midY + 2][midX - 3] = TILES.DRUM;
    grid[midY + 2][midX + 3] = TILES.DRUM;

    // Carved totems/sculptures
    grid[2][midX] = TILES.TOTEM;
    grid[HEIGHT - 3][3] = TILES.TOTEM;
    grid[HEIGHT - 3][WIDTH - 4] = TILES.TOTEM;

    // Palm trees around edges
    grid[2][1] = TILES.PALM;
    grid[2][WIDTH - 2] = TILES.PALM;
    grid[HEIGHT - 3][1] = TILES.PALM;
    grid[HEIGHT - 3][WIDTH - 2] = TILES.PALM;

    // Scattered plants and items
    for (let i = 0; i < 4; i++) {
        const px = Math.floor(rand() * (WIDTH - 4)) + 2;
        const py = Math.floor(rand() * (HEIGHT - 4)) + 2;
        if (grid[py][px] === TILES.GRAVEL) {
            grid[py][px] = rand() > 0.5 ? TILES.PLANT : TILES.CUSHION;
        }
    }

    // Benches for visitors/observers
    grid[midY - 2][WIDTH - 3] = TILES.BENCH;
    grid[midY + 2][WIDTH - 3] = TILES.BENCH;
};

// ============================================
// 14. Trocadéro Palace - Moorish architecture with gardens
// ============================================
const generateTrocadero = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Fill with ornate floor
    for (let y = 1; y < HEIGHT - 1; y++) {
        for (let x = 1; x < WIDTH - 1; x++) {
            grid[y][x] = TILES.FLOOR_POLISHED;
        }
    }

    // Outer walls
    for (let x = 0; x < WIDTH; x++) {
        grid[0][x] = TILES.WALL;
        grid[HEIGHT - 1][x] = TILES.WALL;
    }
    for (let y = 0; y < HEIGHT; y++) {
        grid[y][0] = TILES.WALL;
        grid[y][WIDTH - 1] = TILES.WALL;
    }

    // Moorish arched colonnade at top
    for (let x = 4; x < WIDTH - 4; x += 3) {
        grid[1][x] = TILES.MOORISH_ARCH;
        grid[2][x] = TILES.COLUMN;
    }

    // Decorative minarets at corners
    grid[1][2] = TILES.MINARET;
    grid[1][WIDTH - 3] = TILES.MINARET;

    // Grand Beaux-Arts fountain as centerpiece (the Trocadéro was famous for its fountain)
    placeGrandFountain(grid, midX, midY, 'statue');

    // Gravel paths around the grand fountain
    for (let x = midX - 5; x <= midX + 5; x++) {
        if (grid[midY - 4][x] !== TILES.WALL) grid[midY - 4][x] = TILES.GRAVEL;
        if (grid[midY + 4][x] !== TILES.WALL) grid[midY + 4][x] = TILES.GRAVEL;
    }
    for (let y = midY - 4; y <= midY + 4; y++) {
        if (grid[y][midX - 5] !== TILES.WALL) grid[y][midX - 5] = TILES.GRAVEL;
        if (grid[y][midX + 5] !== TILES.WALL) grid[y][midX + 5] = TILES.GRAVEL;
    }

    // Hedges flanking paths
    grid[midY - 3][midX - 4] = TILES.HEDGE;
    grid[midY - 3][midX + 4] = TILES.HEDGE;
    grid[midY + 3][midX - 4] = TILES.HEDGE;
    grid[midY + 3][midX + 4] = TILES.HEDGE;

    // Flowerbeds
    grid[midY - 3][midX - 2] = TILES.FLOWERBED;
    grid[midY - 3][midX + 2] = TILES.FLOWERBED;
    grid[midY + 3][midX - 2] = TILES.FLOWERBED;
    grid[midY + 3][midX + 2] = TILES.FLOWERBED;

    // Benches for viewing
    grid[HEIGHT - 3][midX - 3] = TILES.BENCH;
    grid[HEIGHT - 3][midX + 3] = TILES.BENCH;

    // Lamps
    grid[3][4] = TILES.LAMP;
    grid[3][WIDTH - 5] = TILES.LAMP;

    // Statues
    grid[HEIGHT - 3][3] = TILES.STATUE;
    grid[HEIGHT - 3][WIDTH - 4] = TILES.STATUE;

    // Potted palms
    grid[4][2] = TILES.PLANT;
    grid[4][WIDTH - 3] = TILES.PLANT;
};

// ============================================
// 15. Waterfall/Cascade - Trocadéro waterfall
// ============================================
const generateWaterfall = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Fill with grassy garden floor
    for (let y = 1; y < HEIGHT - 1; y++) {
        for (let x = 1; x < WIDTH - 1; x++) {
            grid[y][x] = TILES.GRASS;
        }
    }

    // Walls
    for (let x = 0; x < WIDTH; x++) {
        grid[0][x] = TILES.WALL;
        grid[HEIGHT - 1][x] = TILES.WALL;
    }
    for (let y = 0; y < HEIGHT; y++) {
        grid[y][0] = TILES.WALL;
        grid[y][WIDTH - 1] = TILES.WALL;
    }

    // Rocky cascade at the top
    for (let x = midX - 4; x <= midX + 4; x++) {
        grid[1][x] = TILES.CASCADE_ROCK;
        if (x !== midX - 1 && x !== midX && x !== midX + 1) {
            grid[2][x] = TILES.CASCADE_ROCK;
        }
    }

    // Animated waterfall columns
    grid[2][midX - 1] = TILES.WATERFALL;
    grid[2][midX] = TILES.WATERFALL;
    grid[2][midX + 1] = TILES.WATERFALL;
    grid[3][midX - 1] = TILES.WATERFALL;
    grid[3][midX] = TILES.WATERFALL;
    grid[3][midX + 1] = TILES.WATERFALL;
    grid[4][midX] = TILES.WATERFALL;

    // Pool at bottom of waterfall
    for (let y = 5; y <= 7; y++) {
        for (let x = midX - 3; x <= midX + 3; x++) {
            grid[y][x] = TILES.WATER;
        }
    }
    // Fountain spray in pool
    grid[6][midX] = TILES.LANDMARK_FOUNTAIN_CENTER;

    // Rocks flanking the cascade
    grid[3][midX - 4] = TILES.CASCADE_ROCK;
    grid[3][midX + 4] = TILES.CASCADE_ROCK;
    grid[4][midX - 3] = TILES.CASCADE_ROCK;
    grid[4][midX + 3] = TILES.CASCADE_ROCK;

    // Gravel viewing paths
    for (let x = 2; x < WIDTH - 2; x++) {
        grid[HEIGHT - 3][x] = TILES.GRAVEL;
    }
    for (let y = 3; y < HEIGHT - 3; y++) {
        grid[y][2] = TILES.GRAVEL;
        grid[y][WIDTH - 3] = TILES.GRAVEL;
    }

    // Benches for viewing the cascade
    grid[HEIGHT - 4][midX - 4] = TILES.BENCH;
    grid[HEIGHT - 4][midX + 4] = TILES.BENCH;

    // Trees and plants
    grid[8][3] = TILES.TREE;
    grid[8][WIDTH - 4] = TILES.TREE;
    grid[4][1] = TILES.PLANT;
    grid[4][WIDTH - 2] = TILES.PLANT;

    // Lamps along viewing path
    grid[HEIGHT - 3][4] = TILES.LAMP;
    grid[HEIGHT - 3][WIDTH - 5] = TILES.LAMP;

    // Mist effect near waterfall (use steam)
    if (rand() > 0.3) {
        grid[5][midX - 2] = TILES.STEAM;
        grid[5][midX + 2] = TILES.STEAM;
    }
};

export const generateZone = (id: string, gx: number, gy: number): Zone => {
    const grid = createGrid(WIDTH, HEIGHT, TILES.WALL);
    
    const key = `${gx},${gy}`;
    const historicalData = HISTORICAL_LAYOUT[key];
    
    let biome: BiomeType = 'STREET';
    let name = `Paris Street (${gx}, ${gy})`;
    let desc = "A bustling street in the 7th arrondissement.";

    if (historicalData) {
        biome = historicalData.biome;
        name = historicalData.name;
        desc = historicalData.desc;
    } else {
        // Procedurally generate zones outside the historical core
        const noise = Math.sin(gx * 0.5) + Math.cos(gy * 0.5);
        const noise2 = Math.cos(gx * 0.3) * Math.sin(gy * 0.7); // Secondary noise for variety

        if (noise > 0.5) biome = 'GARDEN';
        else if (noise < -0.5) biome = 'SALON';
        else if (noise > 0.2) biome = 'GRAND_HALL';
        else if (noise2 > 0.3) biome = 'ESPLANADE'; // New esplanade biome
        else biome = 'STREET';

        // More authentic 1889 exhibit categories and nations
        const exhibits = [
            'Machinery', 'Textiles', 'Agriculture', 'Fine Arts', 'Mines and Metallurgy',
            'Hygiene', 'Electricity', 'Civil Engineering', 'Military Arts', 'Typography',
            'Ceramics', 'Furniture', 'Clocks and Jewelry', 'Food Products', 'Chemical Industries'
        ];
        const nations = [
            'Bolivia', 'Siam', 'Russia', 'Norway', 'Italy', 'Japan', 'Sweden',
            'Belgium', 'Switzerland', 'Greece', 'Romania', 'Persia', 'Monaco',
            'Denmark', 'Serbia', 'Portugal', 'The Netherlands', 'Luxembourg'
        ];
        const parisStreets = [
            'Rue de la Bourdonnais', 'Avenue de Suffren', 'Quai d\'Orsay',
            'Rue Fabert', 'Avenue de la Motte-Picquet', 'Rue Saint-Dominique',
            'Boulevard de la Tour-Maubourg', 'Avenue Rapp', 'Rue de Grenelle'
        ];
        const gardenNames = [
            'Jardin des Serres', 'Promenade des Fontaines', 'Allée des Palmiers',
            'Bosquet Oriental', 'Parterre Fleuri', 'Square des Nations'
        ];
        const esplanadeNames = [
            'Esplanade des Invalides', 'Place du Trocadéro', 'Esplanade du Champ de Mars',
            'Parvis des Nations', 'Place de la Concorde', 'Square Rapp'
        ];

        const hash = Math.abs(gx * 17 + gy * 31);

        if (biome === 'SALON') {
            name = `Pavilion of ${nations[hash % nations.length]}`;
            desc = `A national exhibit showcasing the culture and industry of ${nations[hash % nations.length]}.`;
        } else if (biome === 'GRAND_HALL') {
            const exhibit = exhibits[hash % exhibits.length];
            name = `Hall of ${exhibit}`;
            desc = `Displays celebrating human achievement in ${exhibit.toLowerCase()}. The crowds press close.`;
        } else if (biome === 'GARDEN') {
            name = gardenNames[hash % gardenNames.length];
            desc = "Manicured hedges and gravel paths offer respite from the exhibition halls.";
        } else if (biome === 'ESPLANADE') {
            name = esplanadeNames[hash % esplanadeNames.length];
            desc = "A grand open space with manicured lawns and gravel promenades, where visitors stroll beneath the chestnut trees.";
        } else {
            name = parisStreets[hash % parisStreets.length];
            desc = "A busy thoroughfare on the exposition grounds. Visitors stream past in both directions.";
        }
    }

    // Generate consistent seed from coordinates for reproducible maps
    const zoneSeed = coordsToSeed(gx, gy);

    if (biome === 'GRAND_HALL') generateGrandHall(grid, zoneSeed);
    else if (biome === 'SALON') generateSalon(grid, zoneSeed, name);
    else if (biome === 'GARDEN') generateGarden(grid, zoneSeed);
    else if (biome === 'STREET') generateStreet(grid, zoneSeed);
    else if (biome === 'ESPLANADE') generateEsplanade(grid, zoneSeed);
    else if (biome === 'TOWER_BASE') generateTowerBase(grid);
    else if (biome === 'TOWER_PLATFORM') generateTowerLevel2(grid);
    else if (biome === 'TOWER_FIRST_FLOOR') generateTowerFirstFloor(grid);
    else if (biome === 'CONCERT_HALL') generateConcertHall(grid);
    else if (biome === 'SOUK') generateSouk(grid, zoneSeed);
    else if (biome === 'GALERIE') generateGalerieDesMachines(grid, zoneSeed);
    else if (biome === 'BRIDGE') generateBridge(grid, zoneSeed);
    else if (biome === 'GATE') generateGate(grid, zoneSeed);
    else if (biome === 'VILLAGE') generateVillage(grid, zoneSeed);
    else if (biome === 'TROCADERO') generateTrocadero(grid, zoneSeed);
    else if (biome === 'WATERFALL') generateWaterfall(grid, zoneSeed);
    else if (biome === 'TOWER_LEVEL') {
        // Legacy support - now using TOWER_BASE
        generateTowerBase(grid);
    }

    // Apply directional walls for SNES-style depth effect
    // This converts generic WALL tiles to directional variants (N/S/E/W)
    // and adds shadow strips beneath north walls
    placeDirectionalWalls(grid, true);

    // Exits
    const exits = [];
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Outdoor biomes use path/gravel exits instead of doors (seamless outdoor transitions)
    const outdoorBiomes: BiomeType[] = ['ESPLANADE', 'GARDEN', 'STREET', 'BRIDGE', 'GATE', 'VILLAGE', 'TROCADERO', 'WATERFALL'];
    const isOutdoor = outdoorBiomes.includes(biome);
    // Choose appropriate exit tile based on biome
    const exitTile = isOutdoor ? (biome === 'GARDEN' ? TILES.GRAVEL : TILES.PATH) : TILES.DOOR;

    if (biome === 'TOWER_PLATFORM') {
        // No standard exits - only the elevator to descend (handled via interaction)
    } else if (biome === 'TOWER_BASE') {
        // Tower base has exits on all 4 sides
        grid[0][midX] = TILES.DOOR;
        exits.push({ x: midX, y: 0, targetZoneId: null, direction: 'N' as const });

        grid[HEIGHT-1][midX] = TILES.DOOR;
        exits.push({ x: midX, y: HEIGHT-1, targetZoneId: null, direction: 'S' as const });

        grid[midY][WIDTH-1] = TILES.DOOR;
        exits.push({ x: WIDTH-1, y: midY, targetZoneId: null, direction: 'E' as const });

        grid[midY][0] = TILES.DOOR;
        exits.push({ x: 0, y: midY, targetZoneId: null, direction: 'W' as const });
    } else if (biome !== 'TOWER_LEVEL') {
        // Place exits (doors for indoor, paths for outdoor)
        grid[0][midX] = exitTile;
        if (isOutdoor) {
            // For outdoor, also clear adjacent tiles for wider passage
            grid[0][midX - 1] = exitTile;
            grid[0][midX + 1] = exitTile;
        } else {
            clearAroundDoor(grid, midX, 0, 'N');
        }
        exits.push({ x: midX, y: 0, targetZoneId: null, direction: 'N' as const });

        grid[HEIGHT-1][midX] = exitTile;
        if (isOutdoor) {
            grid[HEIGHT-1][midX - 1] = exitTile;
            grid[HEIGHT-1][midX + 1] = exitTile;
        } else {
            clearAroundDoor(grid, midX, HEIGHT-1, 'S');
        }
        exits.push({ x: midX, y: HEIGHT-1, targetZoneId: null, direction: 'S' as const });

        grid[midY][WIDTH-1] = exitTile;
        if (isOutdoor) {
            grid[midY - 1][WIDTH-1] = exitTile;
            grid[midY + 1][WIDTH-1] = exitTile;
        } else {
            clearAroundDoor(grid, WIDTH-1, midY, 'E');
        }
        exits.push({ x: WIDTH-1, y: midY, targetZoneId: null, direction: 'E' as const });

        grid[midY][0] = exitTile;
        if (isOutdoor) {
            grid[midY - 1][0] = exitTile;
            grid[midY + 1][0] = exitTile;
        } else {
            clearAroundDoor(grid, 0, midY, 'W');
        }
        exits.push({ x: 0, y: midY, targetZoneId: null, direction: 'W' as const });
    } else {
        // Legacy TOWER_LEVEL - same as TOWER_BASE
        grid[0][midX] = TILES.DOOR;
        exits.push({ x: midX, y: 0, targetZoneId: null, direction: 'N' as const });

        grid[HEIGHT-1][midX] = TILES.DOOR;
        exits.push({ x: midX, y: HEIGHT-1, targetZoneId: null, direction: 'S' as const });

        grid[midY][WIDTH-1] = TILES.DOOR;
        exits.push({ x: WIDTH-1, y: midY, targetZoneId: null, direction: 'E' as const });

        grid[midY][0] = TILES.DOOR;
        exits.push({ x: 0, y: midY, targetZoneId: null, direction: 'W' as const });
    }

    // Minigame Triggers (Legacy Support + New)
    if (biome === 'GRAND_HALL' && Math.random() < 0.3) {
         // Simple scan for space
         for(let y=2; y<HEIGHT-2; y++) {
             if(grid[y][2] === TILES.FLOOR) {
                 grid[y][2] = '['; grid[y][3] = 'L'; grid[y][4] = 'O'; grid[y][5] = 'O'; grid[y][6] = 'M'; grid[y][7] = ']';
                 break;
             }
         }
    }
    
    if (biome === 'STREET' && Math.random() < 0.2) {
         grid[midY][midX+2] = 'C';
    }

    const mapData = grid.map(row => row.join(''));

    const biomeColors: Record<BiomeType, string> = {
        'GRAND_HALL': 'text-slate-600',
        'GARDEN': 'text-green-700',
        'STREET': 'text-amber-900',
        'SALON': 'text-red-900',
        'TOWER_LEVEL': 'text-blue-800',
        'TOWER_BASE': 'text-slate-700',
        'TOWER_PLATFORM': 'text-sky-600',
        'TOWER_FIRST_FLOOR': 'text-amber-600',
        'ESPLANADE': 'text-emerald-700',
        'CONCERT_HALL': 'text-purple-800',
        'SOUK': 'text-orange-700',
        'GALERIE': 'text-zinc-600',
        'BRIDGE': 'text-blue-700'
    };

    return {
        id,
        coordinates: { x: gx, y: gy },
        name,
        description: desc,
        biome,
        width: WIDTH,
        height: HEIGHT,
        mapData,
        themeColor: biomeColors[biome],
        exits,
        visited: false
    };
};
