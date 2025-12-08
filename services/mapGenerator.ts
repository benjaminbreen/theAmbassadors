
import { Zone, BiomeType } from '../types';
import { HISTORICAL_LAYOUT } from '../constants';
import { TILES_FROM_REGISTRY } from '../components/MapTile/TileRegistry';
import { ZONE_NARRATIVES } from '../data/zoneNarratives';

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

// TILES constant - now imported from centralized registry
// All tile definitions are maintained in components/MapTile/TileRegistry.ts
// This ensures consistency across the codebase
const TILES = TILES_FROM_REGISTRY;

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
// FRENCH FORMAL GARDEN CLUSTERS
// Jardin à la française - symmetric geometric patterns
// ============================================

// Parterre with topiary corners - symmetrical garden bed
const PARTERRE_CLUSTER: FurnitureCluster = {
    name: 'parterre_garden',
    patterns: [
        // Classic diamond parterre with cone topiaries at corners
        [
            ['▴', 'v', '✿', 'v', '▴'],
            ['v', '✿', '✿', '✿', 'v'],
            ['✿', '✿', 'U', '✿', '✿'],
            ['v', '✿', '✿', '✿', 'v'],
            ['▴', 'v', '✿', 'v', '▴'],
        ],
        // Rose garden with ball topiaries
        [
            ['●', 'v', 'R', 'v', '●'],
            ['v', 'R', 'v', 'R', 'v'],
            ['R', 'v', 'U', 'v', 'R'],
            ['v', 'R', 'v', 'R', 'v'],
            ['●', 'v', 'R', 'v', '●'],
        ],
        // Flower parterre with spiral topiary centerpiece
        [
            ['w', 'w', 'v', 'w', 'w'],
            ['w', '✿', '✿', '✿', 'w'],
            ['v', '✿', '◎', '✿', 'v'],
            ['w', '✿', '✿', '✿', 'w'],
            ['w', 'w', 'v', 'w', 'w'],
        ],
    ],
    minSpacing: 6,
};

// Topiary row with bench - formal garden seating
const TOPIARY_ROW_CLUSTER: FurnitureCluster = {
    name: 'topiary_row',
    patterns: [
        // Row of cone topiaries with bench
        [
            ['▴', 'v', '▴', 'v', '▴'],
            ['v', 'v', 'v', 'v', 'v'],
            ['v', 'b', 'v', 'b', 'v'],
        ],
        // Alternating balls and cones
        [
            ['●', 'v', '▴', 'v', '●'],
            ['v', '⊡', '⊡', '⊡', 'v'],
        ],
        // Spiral topiaries flanking path
        [
            ['◎', '⊡', '⊡', '⊡', '◎'],
            ['v', '⊡', 'U', '⊡', 'v'],
            ['◎', '⊡', '⊡', '⊡', '◎'],
        ],
    ],
    minSpacing: 5,
};

// Garden urn cluster - decorative focal points
const GARDEN_URN_CLUSTER: FurnitureCluster = {
    name: 'garden_urn',
    patterns: [
        // Pair of urns flanking path
        [
            ['U', '⊡', '⊡', '⊡', 'U'],
        ],
        // Urn on ornate path with parterre surround
        [
            ['✿', 'v', '✿'],
            ['v', 'U', 'v'],
            ['✿', 'v', '✿'],
        ],
        // Urn with rose bush accents
        [
            ['R', 'v', 'R'],
            ['v', 'U', 'v'],
            ['v', 'b', 'v'],
        ],
    ],
    minSpacing: 4,
};

// Grand allée - formal tree-lined path
const ALLEE_CLUSTER: FurnitureCluster = {
    name: 'grand_allee',
    patterns: [
        // Double row of trees with gravel
        [
            ['T', 'v', '⊡', '⊡', '⊡', 'v', 'T'],
            ['v', 'v', '⊡', '⊡', '⊡', 'v', 'v'],
            ['T', 'v', '⊡', '⊡', '⊡', 'v', 'T'],
        ],
        // Trees with benches
        [
            ['T', 'v', 'b', 'v', 'T'],
            ['v', '⊡', '⊡', '⊡', 'v'],
            ['T', 'v', 'b', 'v', 'T'],
        ],
    ],
    minSpacing: 6,
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

// 2x2 Compact fountain - aligns perfectly with 2-tile doors
const COMPACT_FOUNTAIN_CLUSTER: FurnitureCluster = {
    name: 'compact_fountain',
    patterns: [
        // Simple 2x2 basin with jet
        [
            ['╔', '╗'],
            ['╚', '╝'],
        ],
    ],
    minSpacing: 3,
};

// 4x4 Even fountain - aligns perfectly with 2-tile doors (4 = 2*2)
const EVEN_FOUNTAIN_CLUSTER: FurnitureCluster = {
    name: 'even_fountain',
    patterns: [
        // Square basin with central jet
        [
            ['╔', '«', '«', '╗'],
            ['≤', '≈', '≈', '≥'],
            ['≤', '≈', '≈', '≥'],
            ['╚', '»', '»', '╝'],
        ],
        // With central statue
        [
            ['╔', '«', '«', '╗'],
            ['≤', '≈', '♦', '≥'],
            ['≤', '≈', '≈', '≥'],
            ['╚', '»', '»', '╝'],
        ],
    ],
    minSpacing: 5,
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
    // 6x6 grand fountain - for even-width objects, center between tiles
    // To center visually, we place so the middle falls between centerX-1 and centerX
    // This means startX should be centerX - 3, and the fountain spans centerX-3 to centerX+2
    // For true visual centering on centerX, use centerX - 2 so it spans centerX-2 to centerX+3
    // But actually, to match the grid center, we want equal tiles on each side of midX
    // With 6 tiles: positions 0,1,2,3,4,5 relative to start
    // If start = centerX - 3: tiles at centerX-3, centerX-2, centerX-1, centerX, centerX+1, centerX+2
    // That's 3 tiles left of center (at -3,-2,-1) and 3 tiles at/right (0,+1,+2) - ASYMMETRIC!
    // Fix: start = centerX - 2 gives tiles at -2,-1,0,+1,+2,+3 which is also asymmetric
    // The issue is 6 can't center on 1 tile. We need to offset by half.
    // Best solution: keep startX = centerX - 3 but understand visual center is between cols 2&3
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

// Helper: Place a 2x2 compact fountain - perfect alignment with 2-tile doors
// Position is top-left corner of the 2x2 area
const placeCompactFountain = (
    grid: string[][],
    topLeftX: number,
    topLeftY: number
): boolean => {
    // Check bounds
    if (topLeftY < 1 || topLeftX < 1 || topLeftY + 2 >= grid.length - 1 || topLeftX + 2 >= grid[0].length - 1) {
        return false;
    }

    const pattern = COMPACT_FOUNTAIN_CLUSTER.patterns[0];
    for (let dy = 0; dy < 2; dy++) {
        for (let dx = 0; dx < 2; dx++) {
            grid[topLeftY + dy][topLeftX + dx] = pattern[dy][dx];
        }
    }
    return true;
};

// Helper: Place a 4x4 even fountain - perfect alignment with 2-tile doors
// Position is top-left corner of the 4x4 area
const placeEvenFountain = (
    grid: string[][],
    topLeftX: number,
    topLeftY: number,
    style: 'jet' | 'statue' = 'jet'
): boolean => {
    // Check bounds
    if (topLeftY < 1 || topLeftX < 1 || topLeftY + 4 >= grid.length - 1 || topLeftX + 4 >= grid[0].length - 1) {
        return false;
    }

    const pattern = style === 'statue' ? EVEN_FOUNTAIN_CLUSTER.patterns[1] : EVEN_FOUNTAIN_CLUSTER.patterns[0];
    for (let dy = 0; dy < 4; dy++) {
        for (let dx = 0; dx < 4; dx++) {
            grid[topLeftY + dy][topLeftX + dx] = pattern[dy][dx];
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
    TILES.SHADOW,  // Shadow is walkable
    TILES.ROAD_PAVER,  // Street cobblestones are walkable
    // Directional doors are walkable
    TILES.DOOR_NORTH, TILES.DOOR_SOUTH, TILES.DOOR_EAST, TILES.DOOR_WEST,
    // Grand doors are walkable (including secondary tiles)
    TILES.GRAND_DOOR_NORTH, TILES.GRAND_DOOR_SOUTH, TILES.GRAND_DOOR_EAST, TILES.GRAND_DOOR_WEST,
    TILES.GRAND_DOOR_NORTH_2, TILES.GRAND_DOOR_SOUTH_2, TILES.GRAND_DOOR_EAST_2, TILES.GRAND_DOOR_WEST_2
]);

// Helper: Check if tile is floor-like (walkable, not a wall)
const isFloorLike = (char: string): boolean => {
    return WALKABLE_TILES.has(char);
};

// Helper: Check if tile is wall-like
const isWallLike = (char: string): boolean => {
    return char === TILES.WALL || char === TILES.WALL_N || char === TILES.WALL_S ||
           char === TILES.WALL_E || char === TILES.WALL_W || char === TILES.WALL_NE ||
           char === TILES.WALL_NW || char === TILES.WALL_SE || char === TILES.WALL_SW ||
           char === TILES.BACK_WALL_SCONCE;
};

// Helper: Place directional walls with proper SNES-style depth
// This creates the illusion of 3D by using different wall tiles for each direction
const placeDirectionalWalls = (grid: string[][], addShadows: boolean = true, rand?: () => number) => {
    const h = grid.length;
    const w = grid[0].length;

    // Track north wall positions for sconce placement
    const northWallPositions: { x: number; y: number }[] = [];

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
                    northWallPositions.push({ x, y });
                } else if (hasFloorN && !hasFloorS) {
                    grid[y][x] = TILES.WALL_S; // Front wall (bottom edge)
                } else if (hasFloorE && !hasFloorW) {
                    grid[y][x] = TILES.WALL_W; // Left wall
                } else if (hasFloorW && !hasFloorE) {
                    grid[y][x] = TILES.WALL_E; // Right wall
                }
                // Keep as generic wall if surrounded by walls or unclear
            }
            // Also collect existing WALL_N tiles (some generators pre-place directional walls)
            else if (grid[y][x] === TILES.WALL_N) {
                northWallPositions.push({ x, y });
            }
        }
    }

    // Place wall sconces at regular intervals on north walls (back walls)
    // Sconces are placed every 4-6 tiles, not on corners, not adjacent to doors
    if (rand && northWallPositions.length > 0) {
        const sconceInterval = 4 + Math.floor(rand() * 3); // 4-6 tiles apart
        let lastSconceX = -sconceInterval; // Track last sconce position

        for (const pos of northWallPositions) {
            const { x, y } = pos;

            // Skip if too close to last sconce
            if (x - lastSconceX < sconceInterval) continue;

            // Skip if adjacent to a corner or door
            const leftTile = x > 0 ? grid[y][x-1] : '';
            const rightTile = x < w-1 ? grid[y][x+1] : '';
            const isNearCornerOrDoor =
                leftTile === TILES.WALL_NW || leftTile === TILES.WALL_NE ||
                rightTile === TILES.WALL_NW || rightTile === TILES.WALL_NE ||
                leftTile === TILES.DOOR || rightTile === TILES.DOOR ||
                leftTile.startsWith('D') || rightTile.startsWith('D'); // Door tiles

            if (isNearCornerOrDoor) continue;

            // Place sconce with some randomness (70% chance if interval met)
            if (rand() > 0.3) {
                grid[y][x] = TILES.BACK_WALL_SCONCE;
                lastSconceX = x;
            }
        }
    }

    // Second pass: add shadow tiles below north walls
    if (addShadows) {
        for (let y = 0; y < h - 1; y++) {
            for (let x = 0; x < w; x++) {
                const tile = grid[y][x];
                if (tile === TILES.WALL_N || tile === TILES.WALL_NW || tile === TILES.WALL_NE || tile === TILES.BACK_WALL_SCONCE) {
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

    // === SYMMETRICAL CARPET LAYOUT ===
    // Grand central nave (carpet runner)
    for(let x=1; x<WIDTH-1; x++) {
        grid[midY][x] = TILES.CARPET;
    }

    // Cross aisle (narrower, just center)
    for(let y=3; y<HEIGHT-3; y++) {
        grid[y][midX] = TILES.CARPET;
    }

    // === EVENLY SPACED COLUMNS ===
    const columnSpacing = 5;
    for(let x=4; x<WIDTH-3; x+=columnSpacing) {
        grid[2][x] = TILES.COLUMN;
        grid[HEIGHT-3][x] = TILES.COLUMN;
    }

    // === NORTH EXHIBITION ROW - Organized Display Cases ===
    // Evenly spaced display cases with consistent gaps
    const displaySpacing = 5;
    for(let x=3; x<WIDTH-4; x+=displaySpacing) {
        if (x !== midX - 1 && x !== midX && x < WIDTH - 3) {
            grid[3][x] = TILES.DISPLAY;
        }
    }

    // === SOUTH EXHIBITION ROW - Mirroring North ===
    for(let x=3; x<WIDTH-4; x+=displaySpacing) {
        if (x !== midX - 1 && x !== midX && x < WIDTH - 3) {
            grid[HEIGHT-4][x] = TILES.DISPLAY;
        }
    }

    // === DECORATIVE ELEMENTS (symmetrical) ===
    // Plants flanking central aisle at north/south
    grid[3][midX - 3] = TILES.PLANT;
    grid[3][midX + 3] = TILES.PLANT;
    grid[HEIGHT-4][midX - 3] = TILES.PLANT;
    grid[HEIGHT-4][midX + 3] = TILES.PLANT;

    // Statues at quarter points
    grid[4][4] = TILES.STATUE;
    grid[4][WIDTH - 5] = TILES.STATUE;
    grid[HEIGHT-5][4] = TILES.STATUE;
    grid[HEIGHT-5][WIDTH - 5] = TILES.STATUE;

    // === CENTRAL ROTUNDA ===
    // Carpet around center
    for(let dy=-2; dy<=2; dy++) {
        for(let dx=-2; dx<=2; dx++) {
            if (Math.abs(dy) + Math.abs(dx) <= 3) {
                const cy = midY + dy;
                const cx = midX + dx;
                if (cy > 0 && cy < HEIGHT-1 && cx > 0 && cx < WIDTH-1) {
                    grid[cy][cx] = TILES.CARPET;
                }
            }
        }
    }

    // Central statue or Beaux-Arts fountain - aligned with 2-tile doors
    if (rand() > 0.5) {
        // Place statue in center (single tile is fine)
        grid[midY][midX] = TILES.STATUE;
    } else {
        // Place 4x4 Beaux-Arts fountain aligned with doors
        placeEvenFountain(grid, midX - 2, midY - 2, 'jet');
    }

    // === SYMMETRICAL WIDE VIEWING BENCHES (2 tiles each) ===
    grid[midY-3][midX-4] = TILES.WIDE_BENCH;
    grid[midY-3][midX+2] = TILES.WIDE_BENCH;
    grid[midY+3][midX-4] = TILES.WIDE_BENCH;
    grid[midY+3][midX+2] = TILES.WIDE_BENCH;

    // === SYMMETRICAL LIGHTING ===
    for(let x=3; x<WIDTH-2; x+=4) {
        grid[1][x] = TILES.LAMP;
        grid[HEIGHT-2][x] = TILES.LAMP;
    }

    // Hanging lanterns (symmetrical)
    grid[5][6] = TILES.LANTERN;
    grid[5][WIDTH-7] = TILES.LANTERN;
    grid[HEIGHT-6][6] = TILES.LANTERN;
    grid[HEIGHT-6][WIDTH-7] = TILES.LANTERN;

    // Banners on walls (symmetrical)
    if (rand() > 0.3) {
        grid[1][5] = TILES.BANNER;
        grid[1][WIDTH-6] = TILES.BANNER;
    }

    // Occasional newspaper
    if (rand() > 0.6) {
        grid[midY-2][midX-4] = TILES.NEWSPAPER;
    }

    // Museum viewing clusters in corners (symmetrical placement)
    if (rand() > 0.4) {
        placeFurnitureCluster(grid, MUSEUM_VIEWING_CLUSTER, 5, 5, rand);
        placeFurnitureCluster(grid, MUSEUM_VIEWING_CLUSTER, WIDTH - 8, 5, rand);
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
    // East Asian (include demonym forms)
    'japan': { region: 'asian', hasWater: true, hasBraziers: false, carpetStyle: 'none', columnStyle: 'minimal', plantDensity: 'moderate', lightingStyle: 'atmospheric' },
    'japanese': { region: 'asian', hasWater: true, hasBraziers: false, carpetStyle: 'none', columnStyle: 'minimal', plantDensity: 'moderate', lightingStyle: 'atmospheric' },
    'china': { region: 'asian', hasWater: false, hasBraziers: true, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'dramatic' },
    'chinese': { region: 'asian', hasWater: false, hasBraziers: true, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'dramatic' },
    'siam': { region: 'asian', hasWater: true, hasBraziers: false, carpetStyle: 'none', columnStyle: 'ornate', plantDensity: 'lush', lightingStyle: 'atmospheric' },
    'siamese': { region: 'asian', hasWater: true, hasBraziers: false, carpetStyle: 'none', columnStyle: 'ornate', plantDensity: 'lush', lightingStyle: 'atmospheric' },
    'java': { region: 'oceanic', hasWater: true, hasBraziers: false, carpetStyle: 'central', columnStyle: 'minimal', plantDensity: 'lush', lightingStyle: 'atmospheric' },
    'javanese': { region: 'oceanic', hasWater: true, hasBraziers: false, carpetStyle: 'central', columnStyle: 'minimal', plantDensity: 'lush', lightingStyle: 'atmospheric' },
    'indochina': { region: 'asian', hasWater: true, hasBraziers: false, carpetStyle: 'none', columnStyle: 'ornate', plantDensity: 'lush', lightingStyle: 'atmospheric' },
    'annam': { region: 'asian', hasWater: true, hasBraziers: false, carpetStyle: 'none', columnStyle: 'ornate', plantDensity: 'lush', lightingStyle: 'atmospheric' },
    'tonkin': { region: 'asian', hasWater: true, hasBraziers: false, carpetStyle: 'none', columnStyle: 'ornate', plantDensity: 'lush', lightingStyle: 'atmospheric' },
    'cochinchina': { region: 'asian', hasWater: true, hasBraziers: false, carpetStyle: 'none', columnStyle: 'ornate', plantDensity: 'lush', lightingStyle: 'atmospheric' },

    // Middle East / North Africa
    'persia': { region: 'middle_eastern', hasWater: true, hasBraziers: false, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'atmospheric' },
    'persian': { region: 'middle_eastern', hasWater: true, hasBraziers: false, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'atmospheric' },
    'egypt': { region: 'middle_eastern', hasWater: false, hasBraziers: true, carpetStyle: 'runner', columnStyle: 'ornate', plantDensity: 'sparse', lightingStyle: 'dramatic' },
    'egyptian': { region: 'middle_eastern', hasWater: false, hasBraziers: true, carpetStyle: 'runner', columnStyle: 'ornate', plantDensity: 'sparse', lightingStyle: 'dramatic' },
    'tunisia': { region: 'middle_eastern', hasWater: true, hasBraziers: true, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'atmospheric' },
    'tunisian': { region: 'middle_eastern', hasWater: true, hasBraziers: true, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'atmospheric' },
    'algeria': { region: 'middle_eastern', hasWater: true, hasBraziers: false, carpetStyle: 'central', columnStyle: 'minimal', plantDensity: 'sparse', lightingStyle: 'atmospheric' },
    'algerian': { region: 'middle_eastern', hasWater: true, hasBraziers: false, carpetStyle: 'central', columnStyle: 'minimal', plantDensity: 'sparse', lightingStyle: 'atmospheric' },
    'morocco': { region: 'middle_eastern', hasWater: true, hasBraziers: true, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'atmospheric' },
    'moroccan': { region: 'middle_eastern', hasWater: true, hasBraziers: true, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'atmospheric' },
    'ottoman': { region: 'middle_eastern', hasWater: true, hasBraziers: true, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'dramatic' },
    'turkish': { region: 'middle_eastern', hasWater: true, hasBraziers: true, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'dramatic' },

    // Europe
    'netherlands': { region: 'european', hasWater: false, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'moderate', lightingStyle: 'bright' },
    'dutch': { region: 'european', hasWater: false, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'moderate', lightingStyle: 'bright' },
    'russia': { region: 'european', hasWater: false, hasBraziers: true, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'sparse', lightingStyle: 'dramatic' },
    'russian': { region: 'european', hasWater: false, hasBraziers: true, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'sparse', lightingStyle: 'dramatic' },
    'greece': { region: 'european', hasWater: false, hasBraziers: false, carpetStyle: 'none', columnStyle: 'classical', plantDensity: 'sparse', lightingStyle: 'bright' },
    'greek': { region: 'european', hasWater: false, hasBraziers: false, carpetStyle: 'none', columnStyle: 'classical', plantDensity: 'sparse', lightingStyle: 'bright' },
    'italy': { region: 'european', hasWater: true, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'moderate', lightingStyle: 'bright' },
    'italian': { region: 'european', hasWater: true, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'moderate', lightingStyle: 'bright' },
    'norway': { region: 'european', hasWater: false, hasBraziers: true, carpetStyle: 'runner', columnStyle: 'minimal', plantDensity: 'sparse', lightingStyle: 'atmospheric' },
    'norwegian': { region: 'european', hasWater: false, hasBraziers: true, carpetStyle: 'runner', columnStyle: 'minimal', plantDensity: 'sparse', lightingStyle: 'atmospheric' },
    'sweden': { region: 'european', hasWater: false, hasBraziers: true, carpetStyle: 'runner', columnStyle: 'minimal', plantDensity: 'sparse', lightingStyle: 'atmospheric' },
    'swedish': { region: 'european', hasWater: false, hasBraziers: true, carpetStyle: 'runner', columnStyle: 'minimal', plantDensity: 'sparse', lightingStyle: 'atmospheric' },
    'france': { region: 'european', hasWater: false, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'moderate', lightingStyle: 'bright' },
    'french': { region: 'european', hasWater: false, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'moderate', lightingStyle: 'bright' },
    'britain': { region: 'european', hasWater: false, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'moderate', lightingStyle: 'bright' },
    'british': { region: 'european', hasWater: false, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'moderate', lightingStyle: 'bright' },
    'english': { region: 'european', hasWater: false, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'moderate', lightingStyle: 'bright' },
    'german': { region: 'european', hasWater: false, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'moderate', lightingStyle: 'bright' },
    'austria': { region: 'european', hasWater: false, hasBraziers: false, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'bright' },
    'austrian': { region: 'european', hasWater: false, hasBraziers: false, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'bright' },
    'spain': { region: 'european', hasWater: true, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'dramatic' },
    'spanish': { region: 'european', hasWater: true, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'dramatic' },
    'belgium': { region: 'european', hasWater: false, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'moderate', lightingStyle: 'bright' },
    'belgian': { region: 'european', hasWater: false, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'moderate', lightingStyle: 'bright' },

    // Americas
    'mexico': { region: 'american', hasWater: false, hasBraziers: true, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'dramatic' },
    'mexican': { region: 'american', hasWater: false, hasBraziers: true, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'moderate', lightingStyle: 'dramatic' },
    'argentina': { region: 'american', hasWater: false, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'sparse', lightingStyle: 'bright' },
    'argentine': { region: 'american', hasWater: false, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'sparse', lightingStyle: 'bright' },
    'venezuela': { region: 'american', hasWater: false, hasBraziers: false, carpetStyle: 'none', columnStyle: 'minimal', plantDensity: 'lush', lightingStyle: 'atmospheric' },
    'venezuelan': { region: 'american', hasWater: false, hasBraziers: false, carpetStyle: 'none', columnStyle: 'minimal', plantDensity: 'lush', lightingStyle: 'atmospheric' },
    'bolivia': { region: 'american', hasWater: false, hasBraziers: true, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'sparse', lightingStyle: 'dramatic' },
    'bolivian': { region: 'american', hasWater: false, hasBraziers: true, carpetStyle: 'central', columnStyle: 'ornate', plantDensity: 'sparse', lightingStyle: 'dramatic' },
    'brazil': { region: 'american', hasWater: false, hasBraziers: false, carpetStyle: 'none', columnStyle: 'classical', plantDensity: 'lush', lightingStyle: 'bright' },
    'brazilian': { region: 'american', hasWater: false, hasBraziers: false, carpetStyle: 'none', columnStyle: 'classical', plantDensity: 'lush', lightingStyle: 'bright' },
    'american': { region: 'american', hasWater: false, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'moderate', lightingStyle: 'bright' },
    'united states': { region: 'american', hasWater: false, hasBraziers: false, carpetStyle: 'runner', columnStyle: 'classical', plantDensity: 'moderate', lightingStyle: 'bright' },

    // African
    'senegal': { region: 'african', hasWater: false, hasBraziers: true, carpetStyle: 'central', columnStyle: 'none', plantDensity: 'moderate', lightingStyle: 'atmospheric' },
    'senegalese': { region: 'african', hasWater: false, hasBraziers: true, carpetStyle: 'central', columnStyle: 'none', plantDensity: 'moderate', lightingStyle: 'atmospheric' },
    'congo': { region: 'african', hasWater: false, hasBraziers: true, carpetStyle: 'central', columnStyle: 'none', plantDensity: 'lush', lightingStyle: 'atmospheric' },
    'african': { region: 'african', hasWater: false, hasBraziers: true, carpetStyle: 'central', columnStyle: 'none', plantDensity: 'moderate', lightingStyle: 'atmospheric' },

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

// 2. Salon / National Pavilion - SCULPTURE GALLERY
// Organized displays of sculpture and art with culturally-appropriate arrangements
const generateSalon = (grid: string[][], seed: number = 0, zoneName: string = '') => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);
    const theme = detectCulturalTheme(zoneName);
    const nameLower = zoneName.toLowerCase();

    // Determine if this is specifically a sculpture pavilion
    const isSculpturePavilion = nameLower.includes('sculpture') || nameLower.includes('statue') || nameLower.includes('art');

    // Base floor
    for(let y = 0; y < HEIGHT; y++) {
        for(let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.FLOOR;
        }
    }

    // Outer walls with directional graphics
    for(let x = 0; x < WIDTH; x++) {
        grid[0][x] = x === 0 ? TILES.WALL_NW : (x === WIDTH - 1 ? TILES.WALL_NE : TILES.WALL_N);
        grid[HEIGHT - 1][x] = x === 0 ? TILES.WALL_SW : (x === WIDTH - 1 ? TILES.WALL_SE : TILES.WALL_S);
    }
    for(let y = 1; y < HEIGHT - 1; y++) {
        grid[y][0] = TILES.WALL_W;
        grid[y][WIDTH - 1] = TILES.WALL_E;
    }

    // Get appropriate statue types based on culture
    const getStatueTypes = () => {
        if (theme.region === 'asian') {
            return {
                tall: TILES.STATUE_ASIAN_TALL,
                medium: TILES.STATUE,
                small: TILES.STATUE_ASIAN_SMALL,
                bust: TILES.STATUE_BUST
            };
        } else if (theme.region === 'middle_eastern') {
            // Islamic tradition - geometric/architectural instead of figurative
            return {
                tall: TILES.COLUMN,
                medium: TILES.DISPLAY,
                small: TILES.LANTERN,
                bust: TILES.DISPLAY
            };
        } else if (nameLower.includes('egypt')) {
            return {
                tall: TILES.STATUE_EGYPTIAN_TALL,
                medium: TILES.STATUE,
                small: TILES.STATUE_EGYPTIAN_BUST,
                bust: TILES.STATUE_EGYPTIAN_BUST
            };
        } else if (theme.region === 'african') {
            return {
                tall: TILES.STATUE_AFRICAN_TALL,
                medium: TILES.STATUE,
                small: TILES.STATUE_AFRICAN_MASK,
                bust: TILES.STATUE_AFRICAN_MASK
            };
        } else if (nameLower.includes('mexico') || nameLower.includes('aztec') || nameLower.includes('maya')) {
            return {
                tall: TILES.STATUE_MESOAMERICAN,
                medium: TILES.STATUE,
                small: TILES.STATUE_BUST,
                bust: TILES.STATUE_BUST
            };
        } else {
            // European/default - classical marble
            return {
                tall: TILES.STATUE_ALLEGORICAL,
                medium: TILES.STATUE,
                small: TILES.STATUE_BUST,
                bust: TILES.STATUE_BUST,
                monumental: TILES.STATUE_MONUMENTAL
            };
        }
    };

    const statueTypes = getStatueTypes();

    // ============================================
    // EUROPEAN/SCULPTURE PAVILION - 3 SYMMETRICAL ARCHETYPES
    // Central focus: Statue, Fountain, or Conversation Area
    // ============================================
    if (isSculpturePavilion || theme.region === 'european') {
        // Select archetype (0-2) based on seed for reproducible variety
        const archetype = Math.floor(rand() * 3);

        // === CARPET LAYOUT (symmetrical) ===
        // Either central square OR runner between doors
        const useCentralCarpet = theme.carpetStyle === 'central' || rand() > 0.5;

        if (useCentralCarpet) {
            // Central square carpet
            for(let dy = -2; dy <= 2; dy++) {
                for(let dx = -3; dx <= 3; dx++) {
                    if (midY + dy > 1 && midY + dy < HEIGHT - 2 && midX + dx > 1 && midX + dx < WIDTH - 2) {
                        grid[midY + dy][midX + dx] = TILES.CARPET;
                    }
                }
            }
        } else {
            // Runner from north door to south - 2 tiles wide to match grand doors
            for(let y = 2; y < HEIGHT - 2; y++) {
                grid[y][midX] = TILES.CARPET;
                grid[y][midX - 1] = TILES.CARPET;
            }
            // Cross runner from side doors - 2 tiles tall to match E/W grand doors
            // Centered on midY-1 and midY (where the doors are)
            for(let x = 2; x < WIDTH - 2; x++) {
                grid[midY - 1][x] = TILES.CARPET;
                grid[midY][x] = TILES.CARPET;
            }
        }

        if (archetype === 0) {
            // ========================================
            // ARCHETYPE 0: GRAND CENTRAL STATUE
            // Monumental sculpture with symmetrical viewing arrangement
            // ========================================

            // Central sculpture
            grid[midY][midX] = statueTypes.monumental || statueTypes.tall;

            // Symmetrical columns framing the center
            grid[3][5] = TILES.COLUMN;
            grid[3][WIDTH - 6] = TILES.COLUMN;
            grid[HEIGHT - 4][5] = TILES.COLUMN;
            grid[HEIGHT - 4][WIDTH - 6] = TILES.COLUMN;

            // Symmetrical busts in alcoves
            grid[3][3] = statueTypes.bust;
            grid[3][WIDTH - 4] = statueTypes.bust;
            grid[HEIGHT - 4][3] = statueTypes.bust;
            grid[HEIGHT - 4][WIDTH - 4] = statueTypes.bust;

            // Display cases along walls - symmetrical
            grid[midY][2] = TILES.DISPLAY;
            grid[midY][WIDTH - 3] = TILES.DISPLAY;
            grid[2][midX - 4] = TILES.DISPLAY;
            grid[2][midX + 4] = TILES.DISPLAY;

            // Viewing benches facing center - symmetrical
            grid[midY - 2][midX - 5] = TILES.BENCH;
            grid[midY - 2][midX + 5] = TILES.BENCH;
            grid[midY + 2][midX - 5] = TILES.BENCH;
            grid[midY + 2][midX + 5] = TILES.BENCH;

            // Conversation nook - table with chairs (bottom corners)
            // Moved up one row to avoid south door clearance zone
            grid[HEIGHT - 5][4] = TILES.TABLE;
            grid[HEIGHT - 6][4] = TILES.CHAIR_N;
            grid[HEIGHT - 5][3] = TILES.CHAIR_W;
            grid[HEIGHT - 5][5] = TILES.CHAIR_E;

            grid[HEIGHT - 5][WIDTH - 5] = TILES.TABLE;
            grid[HEIGHT - 6][WIDTH - 5] = TILES.CHAIR_N;
            grid[HEIGHT - 5][WIDTH - 6] = TILES.CHAIR_W;
            grid[HEIGHT - 5][WIDTH - 4] = TILES.CHAIR_E;

            // Plants at corners - use elegant potted topiaries for formal pavilion feel
            // Positioned safely away from door clearing zones
            grid[3][2] = TILES.TOPIARY_CONE;
            grid[3][WIDTH - 3] = TILES.TOPIARY_CONE;
            grid[HEIGHT - 4][2] = TILES.TOPIARY_CONE;
            grid[HEIGHT - 4][WIDTH - 3] = TILES.TOPIARY_CONE;

            // Ball topiaries flanking central statue
            grid[midY][midX - 3] = TILES.TOPIARY_BALL;
            grid[midY][midX + 3] = TILES.TOPIARY_BALL;

        } else if (archetype === 1) {
            // ========================================
            // ARCHETYPE 1: CENTRAL FOUNTAIN
            // Water feature with surrounding sculpture and seating
            // Uses 4x4 fountain perfectly aligned with 2-tile doors
            // ========================================

            // Central 4x4 fountain - aligned with doors (top-left at midX-2, midY-2)
            placeEvenFountain(grid, midX - 2, midY - 2, 'statue');

            // Symmetrical tall statues flanking fountain
            grid[midY][4] = statueTypes.tall;
            grid[midY][WIDTH - 5] = statueTypes.tall;

            // Symmetrical busts along back wall
            grid[2][midX - 4] = statueTypes.bust;
            grid[2][midX] = statueTypes.bust;
            grid[2][midX + 4] = statueTypes.bust;

            // Display cases along side walls - symmetrical
            grid[4][2] = TILES.DISPLAY;
            grid[HEIGHT - 5][2] = TILES.DISPLAY;
            grid[4][WIDTH - 3] = TILES.DISPLAY;
            grid[HEIGHT - 5][WIDTH - 3] = TILES.DISPLAY;

            // Columns at regular intervals
            grid[midY - 2][6] = TILES.COLUMN;
            grid[midY - 2][WIDTH - 7] = TILES.COLUMN;
            grid[midY + 2][6] = TILES.COLUMN;
            grid[midY + 2][WIDTH - 7] = TILES.COLUMN;

            // Conversation nooks - symmetrical in bottom corners
            // Moved up one row to avoid south door clearance zone
            grid[HEIGHT - 5][4] = TILES.TABLE;
            grid[HEIGHT - 6][4] = TILES.CHAIR_N;
            grid[HEIGHT - 4][4] = TILES.CHAIR_S;
            grid[HEIGHT - 5][3] = TILES.CHAIR_W;

            grid[HEIGHT - 5][WIDTH - 5] = TILES.TABLE;
            grid[HEIGHT - 6][WIDTH - 5] = TILES.CHAIR_N;
            grid[HEIGHT - 4][WIDTH - 5] = TILES.CHAIR_S;
            grid[HEIGHT - 5][WIDTH - 4] = TILES.CHAIR_E;

            // Viewing benches
            grid[midY + 3][midX - 3] = TILES.BENCH;
            grid[midY + 3][midX + 3] = TILES.BENCH;

            // Elegant potted topiaries at corners - safely away from door zones
            grid[3][2] = TILES.TOPIARY_BALL;
            grid[3][WIDTH - 3] = TILES.TOPIARY_BALL;

            // Cone topiaries flanking the tall statues
            grid[midY - 2][5] = TILES.TOPIARY_CONE;
            grid[midY - 2][WIDTH - 6] = TILES.TOPIARY_CONE;

        } else {
            // ========================================
            // ARCHETYPE 2: CONVERSATION SALON
            // Corner conversation areas with central sculpture
            // ========================================

            // Central sculpture (not tables - those go in corners)
            grid[midY][midX] = statueTypes.monumental || statueTypes.tall;

            // Conversation clusters in corners - OUTSIDE the carpet runner
            // Top-left corner (table with chairs facing inward toward table)
            grid[4][5] = TILES.TABLE;
            grid[3][5] = TILES.CHAIR_N;      // Chair north of table, facing south
            grid[5][5] = TILES.CHAIR_S;      // Chair south of table, facing north
            grid[4][4] = TILES.CHAIR_W;      // Chair west of table, facing east (toward table)
            grid[4][6] = TILES.CHAIR_E;      // Chair east of table, facing west (toward table)

            // Top-right corner
            grid[4][WIDTH - 6] = TILES.TABLE;
            grid[3][WIDTH - 6] = TILES.CHAIR_N;
            grid[5][WIDTH - 6] = TILES.CHAIR_S;
            grid[4][WIDTH - 7] = TILES.CHAIR_W;
            grid[4][WIDTH - 5] = TILES.CHAIR_E;

            // Bottom-left corner - moved up to avoid south door clearance
            grid[HEIGHT - 6][5] = TILES.TABLE;
            grid[HEIGHT - 7][5] = TILES.CHAIR_N;
            grid[HEIGHT - 5][5] = TILES.CHAIR_S;
            grid[HEIGHT - 6][4] = TILES.CHAIR_W;
            grid[HEIGHT - 6][6] = TILES.CHAIR_E;

            // Bottom-right corner - moved up to avoid south door clearance
            grid[HEIGHT - 6][WIDTH - 6] = TILES.TABLE;
            grid[HEIGHT - 7][WIDTH - 6] = TILES.CHAIR_N;
            grid[HEIGHT - 5][WIDTH - 6] = TILES.CHAIR_S;
            grid[HEIGHT - 6][WIDTH - 7] = TILES.CHAIR_W;
            grid[HEIGHT - 6][WIDTH - 5] = TILES.CHAIR_E;

            // Display cases along back wall - symmetrical
            grid[3][midX - 4] = TILES.DISPLAY;
            grid[3][midX + 4] = TILES.DISPLAY;

            // Display cases along bottom - moved up to avoid south door clearance
            grid[HEIGHT - 4][midX - 4] = TILES.DISPLAY;
            grid[HEIGHT - 4][midX + 4] = TILES.DISPLAY;

            // Columns framing the center
            grid[midY - 2][midX - 4] = TILES.COLUMN;
            grid[midY - 2][midX + 4] = TILES.COLUMN;
            grid[midY + 2][midX - 4] = TILES.COLUMN;
            grid[midY + 2][midX + 4] = TILES.COLUMN;

            // Topiaries at corners - mix of cone and ball for variety
            // Safely away from door clearing zones
            grid[3][2] = TILES.TOPIARY_BALL;
            grid[3][WIDTH - 3] = TILES.TOPIARY_BALL;
            grid[HEIGHT - 4][2] = TILES.TOPIARY_CONE;
            grid[HEIGHT - 4][WIDTH - 3] = TILES.TOPIARY_CONE;

            // Additional ball topiaries flanking the central sculpture
            grid[midY - 3][midX] = TILES.TOPIARY_BALL;
            grid[midY + 3][midX] = TILES.TOPIARY_BALL;
        }

        // Wall sconces for all European archetypes - symmetrical
        grid[4][1] = TILES.SCONCE_RIGHT;
        grid[HEIGHT - 5][1] = TILES.SCONCE_RIGHT;
        grid[4][WIDTH - 2] = TILES.SCONCE_LEFT;
        grid[HEIGHT - 5][WIDTH - 2] = TILES.SCONCE_LEFT;
        grid[1][midX - 4] = TILES.SCONCE_DOWN;
        grid[1][midX + 4] = TILES.SCONCE_DOWN;

    }
    // ============================================
    // ASIAN PAVILION - Zen-like symmetrical arrangement
    // ============================================
    else if (theme.region === 'asian') {
        // Central carpet area (symmetrical)
        for(let dy = -2; dy <= 2; dy++) {
            for(let dx = -3; dx <= 3; dx++) {
                if (midY + dy > 1 && midY + dy < HEIGHT - 2 && midX + dx > 1 && midX + dx < WIDTH - 2) {
                    grid[midY + dy][midX + dx] = TILES.CARPET;
                }
            }
        }

        // PAIRED STATUES - symmetrical arrangement along back wall
        grid[2][midX - 4] = statueTypes.tall;
        grid[2][midX] = statueTypes.tall;
        grid[2][midX + 4] = statueTypes.tall;

        // Symmetrical smaller figures along sides
        grid[midY][3] = statueTypes.small;
        grid[midY][WIDTH - 4] = statueTypes.small;

        // Symmetrical water features (if theme has water)
        if (theme.hasWater) {
            grid[midY - 1][5] = TILES.WATER;
            grid[midY][5] = TILES.WATER;
            grid[midY + 1][5] = TILES.WATER;
            grid[midY - 1][WIDTH - 6] = TILES.WATER;
            grid[midY][WIDTH - 6] = TILES.WATER;
            grid[midY + 1][WIDTH - 6] = TILES.WATER;
        }

        // Symmetrical display cases
        grid[4][2] = TILES.DISPLAY;
        grid[4][WIDTH - 3] = TILES.DISPLAY;
        grid[HEIGHT - 5][2] = TILES.DISPLAY;
        grid[HEIGHT - 5][WIDTH - 3] = TILES.DISPLAY;

        // Symmetrical seating - cushions around center
        grid[midY + 2][midX - 2] = TILES.CUSHION;
        grid[midY + 2][midX] = TILES.CUSHION;
        grid[midY + 2][midX + 2] = TILES.CUSHION;

        // Central brazier (for Chinese theme)
        if (theme.hasBraziers) {
            grid[midY][midX] = TILES.BRAZIER;
        }

        // Wall sconces for soft lighting - symmetrical
        grid[midY][1] = TILES.SCONCE_RIGHT;
        grid[midY][WIDTH - 2] = TILES.SCONCE_LEFT;
        grid[1][midX - 4] = TILES.SCONCE_DOWN;
        grid[1][midX + 4] = TILES.SCONCE_DOWN;

        // Symmetrical screens/banners on back wall
        for(let x = 5; x < 9; x++) grid[1][x] = TILES.BANNER;
        for(let x = WIDTH - 9; x < WIDTH - 5; x++) grid[1][x] = TILES.BANNER;

        // Plants - symmetrical corners
        grid[2][2] = TILES.PLANT;
        grid[2][WIDTH - 3] = TILES.PLANT;
        grid[HEIGHT - 3][2] = TILES.PLANT;
        grid[HEIGHT - 3][WIDTH - 3] = TILES.PLANT;

        // Columns - symmetrical
        grid[4][6] = TILES.COLUMN;
        grid[4][WIDTH - 7] = TILES.COLUMN;
        grid[HEIGHT - 5][6] = TILES.COLUMN;
        grid[HEIGHT - 5][WIDTH - 7] = TILES.COLUMN;
    }
    // ============================================
    // MIDDLE EASTERN - Geometric/Symmetrical courtyard
    // ============================================
    else if (theme.region === 'middle_eastern') {
        // Central carpet square (symmetrical)
        for(let dy = -2; dy <= 2; dy++) {
            for(let dx = -3; dx <= 3; dx++) {
                if (midY + dy > 1 && midY + dy < HEIGHT - 2 && midX + dx > 1 && midX + dx < WIDTH - 2) {
                    grid[midY + dy][midX + dx] = TILES.CARPET;
                }
            }
        }

        // Central fountain (courtyard style) - 4x4 aligned with doors
        placeEvenFountain(grid, midX - 2, midY - 2, 'jet');

        // Symmetrical columns in geometric pattern
        grid[3][5] = TILES.COLUMN;
        grid[3][WIDTH - 6] = TILES.COLUMN;
        grid[HEIGHT - 4][5] = TILES.COLUMN;
        grid[HEIGHT - 4][WIDTH - 6] = TILES.COLUMN;

        // Symmetrical braziers
        grid[3][midX - 4] = TILES.BRAZIER;
        grid[3][midX + 4] = TILES.BRAZIER;
        grid[HEIGHT - 4][midX - 4] = TILES.BRAZIER;
        grid[HEIGHT - 4][midX + 4] = TILES.BRAZIER;

        // Symmetrical display cases
        grid[4][2] = TILES.DISPLAY;
        grid[4][WIDTH - 3] = TILES.DISPLAY;
        grid[HEIGHT - 5][2] = TILES.DISPLAY;
        grid[HEIGHT - 5][WIDTH - 3] = TILES.DISPLAY;

        // Symmetrical wall sconces
        grid[5][1] = TILES.SCONCE_RIGHT;
        grid[HEIGHT - 5][1] = TILES.SCONCE_RIGHT;
        grid[5][WIDTH - 2] = TILES.SCONCE_LEFT;
        grid[HEIGHT - 5][WIDTH - 2] = TILES.SCONCE_LEFT;

        // Symmetrical oriental seating clusters
        placeFurnitureCluster(grid, ORIENTAL_CLUSTER, 5, midY + 2, rand);
        placeFurnitureCluster(grid, ORIENTAL_CLUSTER, WIDTH - 8, midY + 2, rand);

        // Calligraphy/screens on walls - symmetrical
        for(let x = 5; x < 9; x++) grid[1][x] = TILES.BANNER;
        for(let x = WIDTH - 9; x < WIDTH - 5; x++) grid[1][x] = TILES.BANNER;

        // Plants - symmetrical at all corners
        grid[2][2] = TILES.PLANT;
        grid[2][WIDTH - 3] = TILES.PLANT;
        grid[HEIGHT - 3][2] = TILES.PLANT;
        grid[HEIGHT - 3][WIDTH - 3] = TILES.PLANT;
    }
    // ============================================
    // AFRICAN PAVILION - Tribal art gallery (symmetrical)
    // ============================================
    else if (theme.region === 'african') {
        // Central carpet square (symmetrical)
        for(let dy = -2; dy <= 2; dy++) {
            for(let dx = -3; dx <= 3; dx++) {
                if (midY + dy > 1 && midY + dy < HEIGHT - 2 && midX + dx > 1 && midX + dx < WIDTH - 2) {
                    grid[midY + dy][midX + dx] = TILES.CARPET;
                }
            }
        }

        // TALL TRIBAL FIGURES - prominent back row
        grid[2][midX - 4] = statueTypes.tall;
        grid[2][midX] = statueTypes.tall;
        grid[2][midX + 4] = statueTypes.tall;

        // MASKS on display pedestals - mid row
        grid[5][4] = statueTypes.small;
        grid[5][8] = statueTypes.small;
        grid[5][WIDTH - 5] = statueTypes.small;
        grid[5][WIDTH - 9] = statueTypes.small;

        // Display cases with artifacts
        grid[3][2] = TILES.DISPLAY;
        grid[3][WIDTH - 3] = TILES.DISPLAY;
        grid[HEIGHT - 4][midX - 3] = TILES.DISPLAY;
        grid[HEIGHT - 4][midX + 3] = TILES.DISPLAY;

        // Central fire pit/brazier (ceremonial)
        grid[midY + 1][midX] = TILES.BRAZIER;

        // Drums for atmosphere
        grid[midY][4] = '!';  // DRUM
        grid[midY][WIDTH - 5] = '!';

        // Viewing benches
        grid[midY + 3][midX - 2] = TILES.BENCH;
        grid[midY + 3][midX + 2] = TILES.BENCH;

        // Wall sconces for dramatic lighting
        grid[4][1] = TILES.SCONCE_RIGHT;
        grid[midY][1] = TILES.SCONCE_RIGHT;
        grid[4][WIDTH - 2] = TILES.SCONCE_LEFT;
        grid[midY][WIDTH - 2] = TILES.SCONCE_LEFT;

        // Palms/plants
        grid[2][2] = TILES.PLANT;
        grid[2][WIDTH - 3] = TILES.PLANT;
        grid[HEIGHT - 3][2] = TILES.PLANT;
        grid[HEIGHT - 3][WIDTH - 3] = TILES.PLANT;

        // Banners/textiles on walls - symmetrical
        for(let x = 5; x < 9; x++) grid[1][x] = TILES.BANNER;
        for(let x = WIDTH - 9; x < WIDTH - 5; x++) grid[1][x] = TILES.BANNER;
    }
    // ============================================
    // AMERICAN PAVILION - Mix of classical and indigenous (symmetrical)
    // ============================================
    else if (theme.region === 'american') {
        // Central carpet square (symmetrical)
        for(let dy = -2; dy <= 2; dy++) {
            for(let dx = -3; dx <= 3; dx++) {
                if (midY + dy > 1 && midY + dy < HEIGHT - 2 && midX + dx > 1 && midX + dx < WIDTH - 2) {
                    grid[midY + dy][midX + dx] = TILES.CARPET;
                }
            }
        }

        // Determine if Mesoamerican focus
        const isMesoamerican = nameLower.includes('mexico') || nameLower.includes('aztec');

        if (isMesoamerican) {
            // Pre-Columbian sculptures - symmetrical
            grid[2][midX] = TILES.STATUE_MESOAMERICAN;
            grid[4][midX - 4] = statueTypes.medium;
            grid[4][midX + 4] = statueTypes.medium;
        } else {
            // Classical American (allegorical figures) - symmetrical
            grid[2][midX] = TILES.STATUE_ALLEGORICAL;
            grid[4][midX - 5] = statueTypes.medium;
            grid[4][midX + 5] = statueTypes.medium;
        }

        // Busts of notable figures - symmetrical
        grid[HEIGHT - 4][midX - 5] = TILES.STATUE_BUST;
        grid[HEIGHT - 4][midX - 2] = TILES.STATUE_BUST;
        grid[HEIGHT - 4][midX + 2] = TILES.STATUE_BUST;
        grid[HEIGHT - 4][midX + 5] = TILES.STATUE_BUST;

        // Display cases - symmetrical
        grid[3][2] = TILES.DISPLAY;
        grid[3][WIDTH - 3] = TILES.DISPLAY;
        grid[midY][2] = TILES.DISPLAY;
        grid[midY][WIDTH - 3] = TILES.DISPLAY;

        // Columns - symmetrical
        grid[3][5] = TILES.COLUMN;
        grid[3][WIDTH - 6] = TILES.COLUMN;
        grid[HEIGHT - 4][5] = TILES.COLUMN;
        grid[HEIGHT - 4][WIDTH - 6] = TILES.COLUMN;

        // Viewing benches - symmetrical
        grid[midY + 2][midX - 4] = TILES.BENCH;
        grid[midY + 2][midX + 4] = TILES.BENCH;

        // Wall sconces for gallery lighting - symmetrical
        grid[4][1] = TILES.SCONCE_RIGHT;
        grid[HEIGHT - 5][1] = TILES.SCONCE_RIGHT;
        grid[4][WIDTH - 2] = TILES.SCONCE_LEFT;
        grid[HEIGHT - 5][WIDTH - 2] = TILES.SCONCE_LEFT;

        // Plants - symmetrical at all corners
        grid[2][2] = TILES.PLANT;
        grid[2][WIDTH - 3] = TILES.PLANT;
        grid[HEIGHT - 3][2] = TILES.PLANT;
        grid[HEIGHT - 3][WIDTH - 3] = TILES.PLANT;

        // Banners/flags - symmetrical
        for(let x = 5; x < 9; x++) grid[1][x] = TILES.BANNER;
        for(let x = WIDTH - 9; x < WIDTH - 5; x++) grid[1][x] = TILES.BANNER;
    }
    // ============================================
    // DEFAULT PAVILION - Generic exhibition layout (symmetrical)
    // ============================================
    else {
        // Central carpet square (symmetrical)
        for(let dy = -2; dy <= 2; dy++) {
            for(let dx = -3; dx <= 3; dx++) {
                if (midY + dy > 1 && midY + dy < HEIGHT - 2 && midX + dx > 1 && midX + dx < WIDTH - 2) {
                    grid[midY + dy][midX + dx] = TILES.CARPET;
                }
            }
        }

        // Central statue
        grid[midY][midX] = statueTypes.medium;

        // Back row sculptures - symmetrical
        grid[2][midX - 5] = statueTypes.medium;
        grid[2][midX] = statueTypes.tall;
        grid[2][midX + 5] = statueTypes.medium;

        // Side displays - symmetrical
        grid[4][2] = TILES.DISPLAY;
        grid[HEIGHT - 5][2] = TILES.DISPLAY;
        grid[4][WIDTH - 3] = TILES.DISPLAY;
        grid[HEIGHT - 5][WIDTH - 3] = TILES.DISPLAY;

        // Busts lower row - symmetrical
        grid[HEIGHT - 4][midX - 5] = statueTypes.bust;
        grid[HEIGHT - 4][midX + 5] = statueTypes.bust;

        // Columns - symmetrical at all corners
        grid[3][5] = TILES.COLUMN;
        grid[3][WIDTH - 6] = TILES.COLUMN;
        grid[HEIGHT - 4][5] = TILES.COLUMN;
        grid[HEIGHT - 4][WIDTH - 6] = TILES.COLUMN;

        // Conversation nook - table with chairs
        grid[HEIGHT - 4][4] = TILES.TABLE;
        grid[HEIGHT - 5][4] = TILES.CHAIR_N;
        grid[HEIGHT - 4][3] = TILES.CHAIR_W;
        grid[HEIGHT - 4][5] = TILES.CHAIR_E;

        grid[HEIGHT - 4][WIDTH - 5] = TILES.TABLE;
        grid[HEIGHT - 5][WIDTH - 5] = TILES.CHAIR_N;
        grid[HEIGHT - 4][WIDTH - 6] = TILES.CHAIR_W;
        grid[HEIGHT - 4][WIDTH - 4] = TILES.CHAIR_E;

        // Benches - symmetrical
        grid[midY + 2][midX - 4] = TILES.BENCH;
        grid[midY + 2][midX + 4] = TILES.BENCH;

        // Wall sconces - symmetrical
        grid[4][1] = TILES.SCONCE_RIGHT;
        grid[HEIGHT - 5][1] = TILES.SCONCE_RIGHT;
        grid[4][WIDTH - 2] = TILES.SCONCE_LEFT;
        grid[HEIGHT - 5][WIDTH - 2] = TILES.SCONCE_LEFT;
        grid[1][midX - 4] = TILES.SCONCE_DOWN;
        grid[1][midX + 4] = TILES.SCONCE_DOWN;

        // Plants - symmetrical at all corners
        grid[2][2] = TILES.PLANT;
        grid[2][WIDTH - 3] = TILES.PLANT;
        grid[HEIGHT - 3][2] = TILES.PLANT;
        grid[HEIGHT - 3][WIDTH - 3] = TILES.PLANT;

        // Banners - symmetrical
        for(let x = 5; x < 9; x++) grid[1][x] = TILES.BANNER;
        for(let x = WIDTH - 9; x < WIDTH - 5; x++) grid[1][x] = TILES.BANNER;
    }

    // Newspaper left by visitor (common to all)
    if (rand() > 0.65) {
        const nx = midX + Math.floor(rand() * 4) - 2;
        const ny = midY + 2 + Math.floor(rand() * 2);
        if (ny < HEIGHT - 2 && grid[ny][nx] === TILES.FLOOR) {
            grid[ny][nx] = TILES.NEWSPAPER;
        }
    }
};

// 3. Garden (French Formal Garden - Jardin à la française)
// TRUE VERSAILLES-STYLE with strict bilateral symmetry
// 6 ARCHETYPES: All feature perfect + shaped paths with nothing blocking them
const generateGarden = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Select archetype (0-5) based on seed - includes new formal parterre archetype
    const archetype = Math.floor(rand() * 6);

    // =====================================================
    // PHASE 1: BASE LAWN - Manicured grass everywhere
    // =====================================================
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.GRASS;
        }
    }

    // =====================================================
    // PHASE 2: PERFECT + SHAPED PATHS (common to all)
    // 3 tiles wide, completely unobstructed
    // =====================================================

    // North-south avenue (3 tiles wide)
    for (let y = 0; y < HEIGHT; y++) {
        grid[y][midX - 1] = TILES.GRAVEL;
        grid[y][midX] = TILES.GRAVEL;
        grid[y][midX + 1] = TILES.GRAVEL;
    }

    // East-west avenue (3 tiles wide)
    for (let x = 0; x < WIDTH; x++) {
        grid[midY - 1][x] = TILES.GRAVEL;
        grid[midY][x] = TILES.GRAVEL;
        grid[midY + 1][x] = TILES.GRAVEL;
    }

    // =====================================================
    // PHASE 3: ARCHETYPE-SPECIFIC FEATURES
    // =====================================================

    if (archetype === 0) {
        // ========================================
        // ARCHETYPE 0: FOUR FOUNTAINS
        // Corner fountains with surrounding hedges
        // NOTHING in center - path stays clear
        // ========================================

        // Four corner fountains with hedges around them
        // NW fountain at (4, 4)
        placeSmallFountain(grid, 4, 4, 'fountain');
        // Hedge rectangle around NW fountain
        for (let x = 2; x <= 6; x++) { grid[2][x] = TILES.HEDGE; grid[6][x] = TILES.HEDGE; }
        for (let y = 2; y <= 6; y++) { grid[y][2] = TILES.HEDGE; grid[y][6] = TILES.HEDGE; }

        // NE fountain at (WIDTH-5, 4) - perfectly mirrored
        placeSmallFountain(grid, WIDTH - 5, 4, 'fountain');
        for (let x = WIDTH - 7; x <= WIDTH - 3; x++) { grid[2][x] = TILES.HEDGE; grid[6][x] = TILES.HEDGE; }
        for (let y = 2; y <= 6; y++) { grid[y][WIDTH - 7] = TILES.HEDGE; grid[y][WIDTH - 3] = TILES.HEDGE; }

        // SW fountain at (4, HEIGHT-5)
        placeSmallFountain(grid, 4, HEIGHT - 5, 'fountain');
        for (let x = 2; x <= 6; x++) { grid[HEIGHT - 7][x] = TILES.HEDGE; grid[HEIGHT - 3][x] = TILES.HEDGE; }
        for (let y = HEIGHT - 7; y <= HEIGHT - 3; y++) { grid[y][2] = TILES.HEDGE; grid[y][6] = TILES.HEDGE; }

        // SE fountain at (WIDTH-5, HEIGHT-5)
        placeSmallFountain(grid, WIDTH - 5, HEIGHT - 5, 'fountain');
        for (let x = WIDTH - 7; x <= WIDTH - 3; x++) { grid[HEIGHT - 7][x] = TILES.HEDGE; grid[HEIGHT - 3][x] = TILES.HEDGE; }
        for (let y = HEIGHT - 7; y <= HEIGHT - 3; y++) { grid[y][WIDTH - 7] = TILES.HEDGE; grid[y][WIDTH - 3] = TILES.HEDGE; }

        // Wide benches at path edges (outside fountain areas) - 2 tiles each
        grid[midY - 2][2] = TILES.WIDE_BENCH;
        grid[midY - 2][WIDTH - 4] = TILES.WIDE_BENCH;
        grid[midY + 2][2] = TILES.WIDE_BENCH;
        grid[midY + 2][WIDTH - 4] = TILES.WIDE_BENCH;

        // Cone topiaries at hedge corners (symmetrical accents)
        grid[2][2] = TILES.TOPIARY_CONE;
        grid[2][WIDTH - 3] = TILES.TOPIARY_CONE;
        grid[HEIGHT - 3][2] = TILES.TOPIARY_CONE;
        grid[HEIGHT - 3][WIDTH - 3] = TILES.TOPIARY_CONE;

        // Ball topiaries flanking the central path
        grid[midY][7] = TILES.TOPIARY_BALL;
        grid[midY][WIDTH - 8] = TILES.TOPIARY_BALL;

    } else if (archetype === 1) {
        // ========================================
        // ARCHETYPE 1: FLOWERBEDS & LAMPS
        // Four corner fountains + flower squares around lamps
        // NOTHING in center - path stays clear
        // ========================================

        // Four corner fountains (smaller areas)
        placeSmallFountain(grid, 3, 3, 'fountain');
        placeSmallFountain(grid, WIDTH - 4, 3, 'fountain');
        placeSmallFountain(grid, 3, HEIGHT - 4, 'fountain');
        placeSmallFountain(grid, WIDTH - 4, HEIGHT - 4, 'fountain');

        // Gas lamps in each quadrant with flower squares around them
        // NW quadrant lamp at (5, 5) with 2x2 flowers around it
        grid[5][5] = TILES.LAMP;
        grid[4][4] = TILES.FLOWERBED; grid[4][5] = TILES.FLOWERBED; grid[4][6] = TILES.FLOWERBED;
        grid[5][4] = TILES.FLOWERBED;                               grid[5][6] = TILES.FLOWERBED;
        grid[6][4] = TILES.FLOWERBED; grid[6][5] = TILES.FLOWERBED; grid[6][6] = TILES.FLOWERBED;

        // NE quadrant lamp - perfectly mirrored
        grid[5][WIDTH - 6] = TILES.LAMP;
        grid[4][WIDTH - 7] = TILES.FLOWERBED; grid[4][WIDTH - 6] = TILES.FLOWERBED; grid[4][WIDTH - 5] = TILES.FLOWERBED;
        grid[5][WIDTH - 7] = TILES.FLOWERBED;                                       grid[5][WIDTH - 5] = TILES.FLOWERBED;
        grid[6][WIDTH - 7] = TILES.FLOWERBED; grid[6][WIDTH - 6] = TILES.FLOWERBED; grid[6][WIDTH - 5] = TILES.FLOWERBED;

        // SW quadrant lamp
        grid[HEIGHT - 6][5] = TILES.LAMP;
        grid[HEIGHT - 7][4] = TILES.FLOWERBED; grid[HEIGHT - 7][5] = TILES.FLOWERBED; grid[HEIGHT - 7][6] = TILES.FLOWERBED;
        grid[HEIGHT - 6][4] = TILES.FLOWERBED;                                         grid[HEIGHT - 6][6] = TILES.FLOWERBED;
        grid[HEIGHT - 5][4] = TILES.FLOWERBED; grid[HEIGHT - 5][5] = TILES.FLOWERBED; grid[HEIGHT - 5][6] = TILES.FLOWERBED;

        // SE quadrant lamp
        grid[HEIGHT - 6][WIDTH - 6] = TILES.LAMP;
        grid[HEIGHT - 7][WIDTH - 7] = TILES.FLOWERBED; grid[HEIGHT - 7][WIDTH - 6] = TILES.FLOWERBED; grid[HEIGHT - 7][WIDTH - 5] = TILES.FLOWERBED;
        grid[HEIGHT - 6][WIDTH - 7] = TILES.FLOWERBED;                                                 grid[HEIGHT - 6][WIDTH - 5] = TILES.FLOWERBED;
        grid[HEIGHT - 5][WIDTH - 7] = TILES.FLOWERBED; grid[HEIGHT - 5][WIDTH - 6] = TILES.FLOWERBED; grid[HEIGHT - 5][WIDTH - 5] = TILES.FLOWERBED;

        // Low hedges at the edges of each quadrant
        for (let y = 2; y < midY - 2; y++) {
            grid[y][1] = TILES.HEDGE;
            grid[y][WIDTH - 2] = TILES.HEDGE;
        }
        for (let y = midY + 2; y < HEIGHT - 2; y++) {
            grid[y][1] = TILES.HEDGE;
            grid[y][WIDTH - 2] = TILES.HEDGE;
        }

        // Ball topiaries flanking each lamp cluster (symmetrical pairs)
        grid[4][3] = TILES.TOPIARY_BALL;
        grid[4][7] = TILES.TOPIARY_BALL;
        grid[4][WIDTH - 4] = TILES.TOPIARY_BALL;
        grid[4][WIDTH - 8] = TILES.TOPIARY_BALL;
        grid[HEIGHT - 5][3] = TILES.TOPIARY_BALL;
        grid[HEIGHT - 5][7] = TILES.TOPIARY_BALL;
        grid[HEIGHT - 5][WIDTH - 4] = TILES.TOPIARY_BALL;
        grid[HEIGHT - 5][WIDTH - 8] = TILES.TOPIARY_BALL;

    } else if (archetype === 2) {
        // ========================================
        // ARCHETYPE 2: TREE ROWS & CENTRAL FOUNTAIN
        // Symmetrical rows of trees with flowers
        // Central fountain with path wrapping around
        // ========================================

        // Central fountain with circular path around it
        placeMediumFountain(grid, midX, midY, 'statue');

        // Symmetrical tree rows in each quadrant
        // NW quadrant - vertical row of trees with flowers
        for (let y = 2; y < midY - 2; y += 2) {
            grid[y][3] = TILES.TREE;
            grid[y][4] = TILES.FLOWERBED;
        }
        // NE quadrant - mirrored
        for (let y = 2; y < midY - 2; y += 2) {
            grid[y][WIDTH - 4] = TILES.TREE;
            grid[y][WIDTH - 5] = TILES.FLOWERBED;
        }
        // SW quadrant
        for (let y = midY + 2; y < HEIGHT - 2; y += 2) {
            grid[y][3] = TILES.TREE;
            grid[y][4] = TILES.FLOWERBED;
        }
        // SE quadrant
        for (let y = midY + 2; y < HEIGHT - 2; y += 2) {
            grid[y][WIDTH - 4] = TILES.TREE;
            grid[y][WIDTH - 5] = TILES.FLOWERBED;
        }

        // Horizontal tree rows too (inner rows)
        for (let x = 5; x < midX - 2; x += 3) {
            grid[2][x] = TILES.TREE;
            grid[HEIGHT - 3][x] = TILES.TREE;
        }
        for (let x = midX + 3; x < WIDTH - 4; x += 3) {
            grid[2][x] = TILES.TREE;
            grid[HEIGHT - 3][x] = TILES.TREE;
        }

        // Corner benches for contemplation
        grid[3][5] = TILES.BENCH;
        grid[3][WIDTH - 6] = TILES.BENCH;
        grid[HEIGHT - 4][5] = TILES.BENCH;
        grid[HEIGHT - 4][WIDTH - 6] = TILES.BENCH;

        // Gas lamps along the paths
        grid[2][midX - 3] = TILES.LAMP;
        grid[2][midX + 3] = TILES.LAMP;
        grid[HEIGHT - 3][midX - 3] = TILES.LAMP;
        grid[HEIGHT - 3][midX + 3] = TILES.LAMP;

        // Cone topiaries at tree row endpoints (symmetrical pairs)
        grid[2][3] = TILES.TOPIARY_CONE;
        grid[2][WIDTH - 4] = TILES.TOPIARY_CONE;
        grid[HEIGHT - 3][3] = TILES.TOPIARY_CONE;
        grid[HEIGHT - 3][WIDTH - 4] = TILES.TOPIARY_CONE;

        // Ball topiaries flanking the central fountain
        grid[midY - 3][midX - 3] = TILES.TOPIARY_BALL;
        grid[midY - 3][midX + 3] = TILES.TOPIARY_BALL;
        grid[midY + 3][midX - 3] = TILES.TOPIARY_BALL;
        grid[midY + 3][midX + 3] = TILES.TOPIARY_BALL;

    } else if (archetype === 3) {
        // ========================================
        // ARCHETYPE 3: SCULPTURE GARDEN
        // Classical statues on pedestals with benches
        // for contemplation. More open, museum-like.
        // ========================================

        // Four symmetrical statue positions in quadrants
        // NW statue with surrounding gravel pad
        grid[4][4] = TILES.STATUE;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx !== 0 || dy !== 0) grid[4 + dy][4 + dx] = TILES.GRAVEL;
            }
        }

        // NE statue - mirrored
        grid[4][WIDTH - 5] = TILES.STATUE;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx !== 0 || dy !== 0) grid[4 + dy][WIDTH - 5 + dx] = TILES.GRAVEL;
            }
        }

        // SW statue
        grid[HEIGHT - 5][4] = TILES.STATUE;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx !== 0 || dy !== 0) grid[HEIGHT - 5 + dy][4 + dx] = TILES.GRAVEL;
            }
        }

        // SE statue
        grid[HEIGHT - 5][WIDTH - 5] = TILES.STATUE;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx !== 0 || dy !== 0) grid[HEIGHT - 5 + dy][WIDTH - 5 + dx] = TILES.GRAVEL;
            }
        }

        // Wide contemplation benches facing each statue (2 tiles each)
        grid[4][2] = TILES.WIDE_BENCH;      // Facing NW statue
        grid[4][WIDTH - 4] = TILES.WIDE_BENCH; // Facing NE statue
        grid[HEIGHT - 5][2] = TILES.WIDE_BENCH;
        grid[HEIGHT - 5][WIDTH - 4] = TILES.WIDE_BENCH;

        // Low hedges creating garden "rooms"
        for (let x = 2; x < midX - 2; x++) {
            grid[midY - 3][x] = TILES.HEDGE;
            grid[midY + 3][x] = TILES.HEDGE;
        }
        for (let x = midX + 2; x < WIDTH - 2; x++) {
            grid[midY - 3][x] = TILES.HEDGE;
            grid[midY + 3][x] = TILES.HEDGE;
        }

        // Central ornamental urn
        grid[midY][midX] = TILES.GARDEN_URN;

        // Lamps at path intersections
        grid[midY - 2][midX - 3] = TILES.LAMP;
        grid[midY - 2][midX + 3] = TILES.LAMP;
        grid[midY + 2][midX - 3] = TILES.LAMP;
        grid[midY + 2][midX + 3] = TILES.LAMP;

        // Ball topiaries near each statue (symmetrical accents)
        grid[4][6] = TILES.TOPIARY_BALL;
        grid[4][WIDTH - 7] = TILES.TOPIARY_BALL;
        grid[HEIGHT - 5][6] = TILES.TOPIARY_BALL;
        grid[HEIGHT - 5][WIDTH - 7] = TILES.TOPIARY_BALL;

        // Cone topiaries at garden room corners
        grid[midY - 3][2] = TILES.TOPIARY_CONE;
        grid[midY - 3][WIDTH - 3] = TILES.TOPIARY_CONE;
        grid[midY + 3][2] = TILES.TOPIARY_CONE;
        grid[midY + 3][WIDTH - 3] = TILES.TOPIARY_CONE;

    } else if (archetype === 4) {
        // ========================================
        // ARCHETYPE 4: PAVILION GARDEN
        // Central kiosk/bandstand with radiating
        // flower beds and curved hedge borders
        // ========================================

        // Central kiosk (Morris column style)
        grid[midY][midX] = TILES.KIOSK;

        // Radiating flowerbeds from center (diagonal pattern)
        grid[midY - 2][midX - 2] = TILES.FLOWERBED;
        grid[midY - 2][midX + 2] = TILES.FLOWERBED;
        grid[midY + 2][midX - 2] = TILES.FLOWERBED;
        grid[midY + 2][midX + 2] = TILES.FLOWERBED;

        // Additional flowerbeds along main axes
        grid[midY - 3][midX] = TILES.FLOWERBED;
        grid[midY + 3][midX] = TILES.FLOWERBED;
        grid[midY][midX - 4] = TILES.FLOWERBED;
        grid[midY][midX + 4] = TILES.FLOWERBED;

        // Curved hedge borders in each quadrant corner
        // NW corner arc
        grid[2][3] = TILES.HEDGE; grid[2][4] = TILES.HEDGE; grid[2][5] = TILES.HEDGE;
        grid[3][2] = TILES.HEDGE; grid[4][2] = TILES.HEDGE; grid[5][2] = TILES.HEDGE;

        // NE corner arc
        grid[2][WIDTH - 4] = TILES.HEDGE; grid[2][WIDTH - 5] = TILES.HEDGE; grid[2][WIDTH - 6] = TILES.HEDGE;
        grid[3][WIDTH - 3] = TILES.HEDGE; grid[4][WIDTH - 3] = TILES.HEDGE; grid[5][WIDTH - 3] = TILES.HEDGE;

        // SW corner arc
        grid[HEIGHT - 3][3] = TILES.HEDGE; grid[HEIGHT - 3][4] = TILES.HEDGE; grid[HEIGHT - 3][5] = TILES.HEDGE;
        grid[HEIGHT - 4][2] = TILES.HEDGE; grid[HEIGHT - 5][2] = TILES.HEDGE; grid[HEIGHT - 6][2] = TILES.HEDGE;

        // SE corner arc
        grid[HEIGHT - 3][WIDTH - 4] = TILES.HEDGE; grid[HEIGHT - 3][WIDTH - 5] = TILES.HEDGE; grid[HEIGHT - 3][WIDTH - 6] = TILES.HEDGE;
        grid[HEIGHT - 4][WIDTH - 3] = TILES.HEDGE; grid[HEIGHT - 5][WIDTH - 3] = TILES.HEDGE; grid[HEIGHT - 6][WIDTH - 3] = TILES.HEDGE;

        // Benches around the central pavilion
        grid[midY - 3][midX - 3] = TILES.BENCH;
        grid[midY - 3][midX + 3] = TILES.BENCH;
        grid[midY + 3][midX - 3] = TILES.BENCH;
        grid[midY + 3][midX + 3] = TILES.BENCH;

        // Palm trees at the four cardinal points (exotic 1889 touch)
        grid[3][midX] = TILES.PALM;
        grid[HEIGHT - 4][midX] = TILES.PALM;
        grid[midY][3] = TILES.PALM;
        grid[midY][WIDTH - 4] = TILES.PALM;

        // Gas lamps flanking the kiosk
        grid[midY][midX - 2] = TILES.LAMP;
        grid[midY][midX + 2] = TILES.LAMP;

        // Cone topiaries at corner hedge ends (symmetrical accents)
        grid[2][2] = TILES.TOPIARY_CONE;
        grid[2][WIDTH - 3] = TILES.TOPIARY_CONE;
        grid[HEIGHT - 3][2] = TILES.TOPIARY_CONE;
        grid[HEIGHT - 3][WIDTH - 3] = TILES.TOPIARY_CONE;

        // Ball topiaries flanking the kiosk approach paths
        grid[midY - 4][midX] = TILES.TOPIARY_BALL;
        grid[midY + 4][midX] = TILES.TOPIARY_BALL;
        grid[midY][midX - 5] = TILES.TOPIARY_BALL;
        grid[midY][midX + 5] = TILES.TOPIARY_BALL;

    } else {
        // ========================================
        // ARCHETYPE 5: FORMAL PARTERRE GARDEN
        // Classic Versailles-style with topiaries,
        // parterres, and ornamental paths
        // ========================================

        // Ornate path border around central parterre area
        // Creating a refined crushed limestone border
        for (let x = 3; x < WIDTH - 3; x++) {
            grid[2][x] = TILES.ORNATE_PATH;
            grid[HEIGHT - 3][x] = TILES.ORNATE_PATH;
        }
        for (let y = 3; y < HEIGHT - 3; y++) {
            grid[y][3] = TILES.ORNATE_PATH;
            grid[y][WIDTH - 4] = TILES.ORNATE_PATH;
        }

        // Corner cone topiaries (perfectly symmetrical)
        grid[2][2] = TILES.TOPIARY_CONE;
        grid[2][WIDTH - 3] = TILES.TOPIARY_CONE;
        grid[HEIGHT - 3][2] = TILES.TOPIARY_CONE;
        grid[HEIGHT - 3][WIDTH - 3] = TILES.TOPIARY_CONE;

        // Parterre beds in each quadrant
        // NW parterre
        for (let y = 4; y < midY - 2; y++) {
            for (let x = 5; x < midX - 2; x++) {
                grid[y][x] = TILES.PARTERRE;
            }
        }
        // NE parterre
        for (let y = 4; y < midY - 2; y++) {
            for (let x = midX + 2; x < WIDTH - 5; x++) {
                grid[y][x] = TILES.PARTERRE;
            }
        }
        // SW parterre
        for (let y = midY + 2; y < HEIGHT - 4; y++) {
            for (let x = 5; x < midX - 2; x++) {
                grid[y][x] = TILES.PARTERRE;
            }
        }
        // SE parterre
        for (let y = midY + 2; y < HEIGHT - 4; y++) {
            for (let x = midX + 2; x < WIDTH - 5; x++) {
                grid[y][x] = TILES.PARTERRE;
            }
        }

        // Central ornamental urn on gravel intersection
        grid[midY][midX] = TILES.GARDEN_URN;

        // Ball topiaries at parterre corners
        grid[4][5] = TILES.TOPIARY_BALL;
        grid[4][midX - 3] = TILES.TOPIARY_BALL;
        grid[4][midX + 2] = TILES.TOPIARY_BALL;
        grid[4][WIDTH - 6] = TILES.TOPIARY_BALL;

        grid[HEIGHT - 5][5] = TILES.TOPIARY_BALL;
        grid[HEIGHT - 5][midX - 3] = TILES.TOPIARY_BALL;
        grid[HEIGHT - 5][midX + 2] = TILES.TOPIARY_BALL;
        grid[HEIGHT - 5][WIDTH - 6] = TILES.TOPIARY_BALL;

        // Rose bushes along the main paths (symmetrical)
        grid[midY - 2][midX - 4] = TILES.ROSE_BUSH;
        grid[midY - 2][midX + 4] = TILES.ROSE_BUSH;
        grid[midY + 2][midX - 4] = TILES.ROSE_BUSH;
        grid[midY + 2][midX + 4] = TILES.ROSE_BUSH;

        // Spiral topiary centerpieces in each quadrant
        grid[6][7] = TILES.TOPIARY_SPIRAL;
        grid[6][WIDTH - 8] = TILES.TOPIARY_SPIRAL;
        grid[HEIGHT - 7][7] = TILES.TOPIARY_SPIRAL;
        grid[HEIGHT - 7][WIDTH - 8] = TILES.TOPIARY_SPIRAL;

        // Ornamental benches for viewing the parterres
        grid[midY][5] = TILES.BENCH;
        grid[midY][WIDTH - 6] = TILES.BENCH;

        // Gas lamps at the four corners of the central intersection
        grid[midY - 2][midX - 2] = TILES.LAMP;
        grid[midY - 2][midX + 2] = TILES.LAMP;
        grid[midY + 2][midX - 2] = TILES.LAMP;
        grid[midY + 2][midX + 2] = TILES.LAMP;
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

        // Central road pavers (4 columns in the middle for wagon/horse traffic)
        const paverStartX = midX - 2;
        const paverEndX = midX + 2;
        for(let y=0; y<HEIGHT; y++) {
            for(let x=paverStartX; x<paverEndX; x++) {
                if (x >= startX && x < endX) {
                    grid[y][x] = TILES.ROAD_PAVER;
                }
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

        // Central road pavers (4 rows in the middle for wagon/horse traffic)
        const paverStartY = midY - 2;
        const paverEndY = midY + 2;
        for(let y=paverStartY; y<paverEndY; y++) {
            for(let x=0; x<WIDTH; x++) {
                if (y >= startY && y < endY) {
                    grid[y][x] = TILES.ROAD_PAVER;
                }
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

    // === SIDEWALK CAFÉ CULTURE (very common in 1889 Paris) ===
    // Always place at least one café cluster, often two
    if (isVertical) {
        // Café on east side of vertical street
        const cafeX = midX + 2;
        const cafeY = 4;
        if (grid[cafeY][cafeX] === TILES.PATH || grid[cafeY][cafeX] === TILES.FLOOR) {
            placeFurnitureCluster(grid, CAFE_CLUSTER, cafeX, cafeY, rand);
        }
        // Second café on opposite side (50% chance)
        if (rand() > 0.5) {
            const cafeX2 = midX - 3;
            const cafeY2 = HEIGHT - 5;
            if (cafeX2 > 1 && grid[cafeY2][cafeX2] === TILES.FLOOR) {
                placeFurnitureCluster(grid, CAFE_CLUSTER, cafeX2, cafeY2, rand);
            }
        }
    } else {
        // Café on south side of horizontal street
        const cafeX = 5;
        const cafeY = midY + 2;
        if (grid[cafeY][cafeX] === TILES.PATH || grid[cafeY][cafeX] === TILES.FLOOR) {
            placeFurnitureCluster(grid, CAFE_CLUSTER, cafeX, cafeY, rand);
        }
        // Second café on opposite side (50% chance)
        if (rand() > 0.5) {
            const cafeX2 = WIDTH - 7;
            const cafeY2 = midY - 3;
            if (cafeY2 > 1 && grid[cafeY2][cafeX2] === TILES.FLOOR) {
                placeFurnitureCluster(grid, CAFE_CLUSTER, cafeX2, cafeY2, rand);
            }
        }
    }
};

// 5. Tower Base (Ground level beneath the Eiffel Tower)
// Features four 2x2 perspective pylons near corners, open on all sides
const generateTowerBase = (grid: string[][]) => {
    // Fill with iron lattice floor pattern - all walkable
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

    // Place four massive 2x2 tower pylons - moved inward from edges to keep borders open
    // NW pylon (top-left area)
    grid[2][2] = TILES.PYLON_NW_NW;
    grid[2][3] = TILES.PYLON_NW_NE;
    grid[3][2] = TILES.PYLON_NW_SW;
    grid[3][3] = TILES.PYLON_NW_SE;

    // NE pylon (top-right area)
    grid[2][WIDTH - 4] = TILES.PYLON_NE_NW;
    grid[2][WIDTH - 3] = TILES.PYLON_NE_NE;
    grid[3][WIDTH - 4] = TILES.PYLON_NE_SW;
    grid[3][WIDTH - 3] = TILES.PYLON_NE_SE;

    // SW pylon (bottom-left area)
    grid[HEIGHT - 4][2] = TILES.PYLON_SW_NW;
    grid[HEIGHT - 4][3] = TILES.PYLON_SW_NE;
    grid[HEIGHT - 3][2] = TILES.PYLON_SW_SW;
    grid[HEIGHT - 3][3] = TILES.PYLON_SW_SE;

    // SE pylon (bottom-right area)
    grid[HEIGHT - 4][WIDTH - 4] = TILES.PYLON_SE_NW;
    grid[HEIGHT - 4][WIDTH - 3] = TILES.PYLON_SE_NE;
    grid[HEIGHT - 3][WIDTH - 4] = TILES.PYLON_SE_SW;
    grid[HEIGHT - 3][WIDTH - 3] = TILES.PYLON_SE_SE;

    // Central elevator entrance (2x2) - with "ASCENSEUR" sign
    const centerX = Math.floor(WIDTH / 2) - 1;
    const centerY = Math.floor(HEIGHT / 2) - 1;
    // Top row has the sign graphics
    grid[centerY][centerX] = TILES.ELEVATOR_ASCENSEUR;
    grid[centerY][centerX + 1] = TILES.ELEVATOR_ASCENSEUR;
    // Bottom row is regular elevator
    grid[centerY + 1][centerX] = TILES.ELEVATOR;
    grid[centerY + 1][centerX + 1] = TILES.ELEVATOR;

    // Add decorative iron girders connecting pylons (visual only, walkable)
    // Horizontal girders - moved inward
    for (let x = 5; x < centerX - 1; x++) {
        grid[2][x] = ':';
        grid[HEIGHT - 3][x] = ':';
    }
    for (let x = centerX + 3; x < WIDTH - 5; x++) {
        grid[2][x] = ':';
        grid[HEIGHT - 3][x] = ':';
    }

    // Vertical girders - moved inward
    for (let y = 5; y < centerY - 1; y++) {
        grid[y][2] = ':';
        grid[y][WIDTH - 3] = ':';
    }
    for (let y = centerY + 3; y < HEIGHT - 5; y++) {
        grid[y][2] = ':';
        grid[y][WIDTH - 3] = ':';
    }

    // Lamps near center (creating dramatic lighting)
    grid[centerY - 2][centerX] = TILES.LAMP;
    grid[centerY - 2][centerX + 1] = TILES.LAMP;
    grid[centerY + 3][centerX] = TILES.LAMP;
    grid[centerY + 3][centerX + 1] = TILES.LAMP;
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

    // === OUTDOOR CAFÉ TERRACES (common in French public squares) ===
    // NW corner café terrace
    grid[3][4] = TILES.TABLE;
    grid[2][4] = TILES.CHAIR_N;
    grid[4][4] = TILES.CHAIR_S;
    grid[3][3] = TILES.CHAIR_W;

    // SE corner café terrace
    grid[HEIGHT - 4][WIDTH - 5] = TILES.TABLE;
    grid[HEIGHT - 5][WIDTH - 5] = TILES.CHAIR_N;
    grid[HEIGHT - 3][WIDTH - 5] = TILES.CHAIR_S;
    grid[HEIGHT - 4][WIDTH - 4] = TILES.CHAIR_E;

    // Scattered carriages waiting (public square was for transport)
    if (rand() > 0.3 && 8 < WIDTH) {
        grid[HEIGHT - 3][7] = TILES.CARRIAGE;
    }
    if (rand() > 0.5 && WIDTH - 7 < WIDTH) {
        grid[3][WIDTH - 8] = TILES.CARRIAGE;
    }

    // NO trees in the main plaza - this is paved, urban space
    // Only a few potted plants near café tables
    grid[2][3] = TILES.PLANT;
    grid[HEIGHT - 3][WIDTH - 4] = TILES.PLANT;

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
    // Tables with proper café seating
    // Table 1
    grid[3][3] = TILES.TABLE;
    grid[2][3] = TILES.CHAIR_N;
    grid[4][3] = TILES.CHAIR_S;
    grid[3][2] = TILES.CHAIR_W;
    // Table 2
    grid[3][6] = TILES.TABLE;
    grid[2][6] = TILES.CHAIR_N;
    grid[4][6] = TILES.CHAIR_S;
    grid[3][7] = TILES.CHAIR_E;

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

// 11b. Spice Merchant's Alley - Long narrow passage with spice stalls
const generateSpiceAlley = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Fill with walls
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.WALL;
        }
    }

    // Create a winding main passage
    let currentX = midX;
    for (let y = 1; y < HEIGHT - 1; y++) {
        // Wander left and right
        if (rand() < 0.3 && currentX > 3) currentX--;
        if (rand() < 0.3 && currentX < WIDTH - 4) currentX++;

        // Carve passage (3 tiles wide)
        for (let dx = -1; dx <= 1; dx++) {
            if (currentX + dx > 0 && currentX + dx < WIDTH - 1) {
                grid[y][currentX + dx] = TILES.FLOOR;
            }
        }
    }

    // Horizontal cross-passage
    for (let x = 2; x < WIDTH - 2; x++) {
        grid[midY][x] = TILES.FLOOR;
        if (midY + 1 < HEIGHT - 1) grid[midY + 1][x] = TILES.FLOOR;
    }

    // Add many market stalls along the walls
    for (let y = 2; y < HEIGHT - 2; y++) {
        for (let x = 2; x < WIDTH - 2; x++) {
            if (grid[y][x] === TILES.FLOOR) {
                const nearWall = grid[y-1]?.[x] === TILES.WALL || grid[y+1]?.[x] === TILES.WALL ||
                                 grid[y]?.[x-1] === TILES.WALL || grid[y]?.[x+1] === TILES.WALL;
                if (nearWall && rand() < 0.2) {
                    grid[y][x] = TILES.MARKET_STALL;
                }
            }
        }
    }

    // Scatter cushions for seating
    for (let i = 0; i < 5; i++) {
        const rx = 3 + Math.floor(rand() * (WIDTH - 6));
        const ry = 3 + Math.floor(rand() * (HEIGHT - 6));
        if (grid[ry][rx] === TILES.FLOOR) {
            grid[ry][rx] = TILES.CUSHION;
        }
    }

    // Lanterns for atmosphere
    for (let y = 3; y < HEIGHT - 3; y += 3) {
        for (let x = 3; x < WIDTH - 3; x += 4) {
            if (grid[y][x] === TILES.FLOOR && rand() < 0.4) {
                grid[y][x] = TILES.LANTERN;
            }
        }
    }

    // Carpets displayed
    for (let i = 0; i < 4; i++) {
        const rx = 3 + Math.floor(rand() * (WIDTH - 6));
        const ry = 3 + Math.floor(rand() * (HEIGHT - 6));
        if (grid[ry][rx] === TILES.FLOOR) {
            grid[ry][rx] = TILES.CARPET;
        }
    }

    // A brazier in the center
    if (grid[midY][midX] === TILES.FLOOR) {
        grid[midY][midX] = TILES.BRAZIER;
    }

    // Doors
    grid[0][midX] = TILES.DOOR;
    grid[HEIGHT - 1][midX] = TILES.DOOR;
    grid[midY][0] = TILES.DOOR;
    grid[midY][WIDTH - 1] = TILES.DOOR;
};

// 11c. Coppersmith's Lane - Open workshop area with columns
const generateCoppersmithLane = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Fill with floor - more open workshop feel
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.FLOOR;
        }
    }

    // Perimeter walls
    for (let x = 0; x < WIDTH; x++) {
        grid[0][x] = TILES.WALL;
        grid[HEIGHT - 1][x] = TILES.WALL;
    }
    for (let y = 0; y < HEIGHT; y++) {
        grid[y][0] = TILES.WALL;
        grid[y][WIDTH - 1] = TILES.WALL;
    }

    // Columns creating an arcade effect
    for (let y = 3; y < HEIGHT - 3; y += 4) {
        grid[y][3] = TILES.COLUMN;
        grid[y][WIDTH - 4] = TILES.COLUMN;
    }

    // Workshop stalls along the sides
    for (let y = 2; y < HEIGHT - 2; y++) {
        if (rand() < 0.35) {
            grid[y][2] = TILES.MARKET_STALL;
        }
        if (rand() < 0.35) {
            grid[y][WIDTH - 3] = TILES.MARKET_STALL;
        }
    }

    // Braziers (for the metalworking)
    grid[4][midX - 2] = TILES.BRAZIER;
    grid[4][midX + 2] = TILES.BRAZIER;
    grid[HEIGHT - 5][midX] = TILES.BRAZIER;

    // Scattered carpets and cushions for customers
    for (let i = 0; i < 3; i++) {
        const rx = 5 + Math.floor(rand() * (WIDTH - 10));
        const ry = 5 + Math.floor(rand() * (HEIGHT - 10));
        if (grid[ry][rx] === TILES.FLOOR) {
            grid[ry][rx] = rand() < 0.5 ? TILES.CARPET : TILES.CUSHION;
        }
    }

    // Lanterns
    grid[2][midX] = TILES.LANTERN;
    grid[HEIGHT - 3][midX - 2] = TILES.LANTERN;
    grid[HEIGHT - 3][midX + 2] = TILES.LANTERN;

    // A donkey waiting outside a workshop
    grid[midY][midX + 3] = TILES.DONKEY;

    // Bench for waiting customers
    grid[midY + 2][midX - 1] = TILES.BENCH;
    grid[midY + 2][midX + 1] = TILES.BENCH;

    // Doors
    grid[0][midX] = TILES.DOOR;
    grid[HEIGHT - 1][midX] = TILES.DOOR;
    grid[midY][0] = TILES.DOOR;
    grid[midY][WIDTH - 1] = TILES.DOOR;
};

// 11d. Tunisian Souk - Variation with stage and performance area
const generateTunisianSouk = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Fill with walls
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.WALL;
        }
    }

    // Create an L-shaped open area
    // Vertical arm
    for (let y = 1; y < HEIGHT - 1; y++) {
        for (let x = 2; x < midX + 2; x++) {
            grid[y][x] = TILES.FLOOR;
        }
    }
    // Horizontal arm
    for (let y = midY - 2; y < HEIGHT - 1; y++) {
        for (let x = midX - 2; x < WIDTH - 2; x++) {
            grid[y][x] = TILES.FLOOR;
        }
    }

    // Performance stage in the corner
    grid[HEIGHT - 4][WIDTH - 5] = TILES.STAGE;
    grid[HEIGHT - 4][WIDTH - 4] = TILES.STAGE;
    grid[HEIGHT - 3][WIDTH - 5] = TILES.STAGE;
    grid[HEIGHT - 3][WIDTH - 4] = TILES.STAGE;

    // Cushions for audience
    for (let y = HEIGHT - 6; y < HEIGHT - 2; y++) {
        for (let x = WIDTH - 8; x < WIDTH - 6; x++) {
            if (grid[y][x] === TILES.FLOOR && rand() < 0.6) {
                grid[y][x] = TILES.CUSHION;
            }
        }
    }

    // Market stalls along the walls
    for (let y = 2; y < midY - 1; y++) {
        if (rand() < 0.3 && grid[y][3] === TILES.FLOOR) {
            grid[y][3] = TILES.MARKET_STALL;
        }
    }
    for (let x = 4; x < midX; x++) {
        if (rand() < 0.25 && grid[2][x] === TILES.FLOOR) {
            grid[2][x] = TILES.MARKET_STALL;
        }
    }

    // Lanterns
    grid[3][5] = TILES.LANTERN;
    grid[midY][midX + 3] = TILES.LANTERN;
    grid[HEIGHT - 5][WIDTH - 7] = TILES.LANTERN;

    // Carpets
    grid[midY + 1][4] = TILES.CARPET;
    grid[midY + 2][midX + 1] = TILES.CARPET;

    // Central brazier
    grid[midY][5] = TILES.BRAZIER;

    // Potted palms
    grid[2][midX - 2] = TILES.PLANT;
    grid[HEIGHT - 3][midX + 4] = TILES.PLANT;

    // A donkey
    grid[midY - 1][midX] = TILES.DONKEY;

    // Doors
    grid[0][midX - 2] = TILES.DOOR;
    grid[HEIGHT - 1][midX + 2] = TILES.DOOR;
    grid[midY][0] = TILES.DOOR;
    grid[midY + 1][WIDTH - 1] = TILES.DOOR;
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
    // Bridge is about 8 tiles wide (outer pavers + sidewalks + central roadway)
    const bridgeLeft = midX - 4;
    const bridgeRight = midX + 4;

    for (let y = 0; y < HEIGHT; y++) {
        for (let x = bridgeLeft; x <= bridgeRight; x++) {
            // Dark stone pavers on outer edges (decorative border)
            if (x === bridgeLeft || x === bridgeRight) {
                grid[y][x] = TILES.ROAD_PAVER;
            }
            // Main roadway in center (3 tiles wide)
            else if (x >= midX - 1 && x <= midX + 1) {
                grid[y][x] = TILES.FLOOR; // Cobblestone road
            }
            // Lighter sidewalks between outer pavers and roadway
            else {
                grid[y][x] = TILES.PATH; // Pedestrian walkway
            }
        }
    }

    // Stone balustrades (railings) along the outer edges
    for (let y = 0; y < HEIGHT; y++) {
        grid[y][bridgeLeft - 1] = TILES.RAILING;
        grid[y][bridgeRight + 1] = TILES.RAILING;
    }

    // Decorative lamp posts along the bridge (on the dark paver strips)
    for (let y = 2; y < HEIGHT - 2; y += 3) {
        grid[y][bridgeLeft + 1] = TILES.LAMP;
        grid[y][bridgeRight - 1] = TILES.LAMP;
    }

    // Stone pier supports visible in the water (the 5 arches)
    // These are decorative - showing where the arches meet the water
    const pierPositions = [2, 5, 8, 11];
    for (const py of pierPositions) {
        if (py < HEIGHT) {
            // West pier
            grid[py][bridgeLeft - 2] = TILES.COLUMN;
            grid[py][bridgeLeft - 3] = TILES.COLUMN;
            // East pier
            grid[py][bridgeRight + 2] = TILES.COLUMN;
            grid[py][bridgeRight + 3] = TILES.COLUMN;
        }
    }

    // Carriage crossing the bridge (on center road)
    if (rand() > 0.3 && midX < WIDTH) {
        const carriageY = 3 + Math.floor(rand() * 4);
        grid[carriageY][midX - 1] = TILES.CARRIAGE;
    }

    // Benches at viewing points (on sidewalks, people watching boats/tower)
    grid[3][bridgeLeft + 2] = TILES.BENCH;
    grid[3][bridgeRight - 2] = TILES.BENCH;
    grid[HEIGHT - 4][bridgeLeft + 2] = TILES.BENCH;
    grid[HEIGHT - 4][bridgeRight - 2] = TILES.BENCH;

    // A newspaper vendor's kiosk on the bridge sidewalk
    if (rand() > 0.4) {
        grid[midY - 1][bridgeLeft + 2] = TILES.KIOSK;
    }

    // Scattered newspapers (the day's Le Figaro)
    if (rand() > 0.5) {
        grid[midY + 2][midX + 1] = TILES.NEWSPAPER;
    }

    // Potted plants near the lamp posts
    if (rand() > 0.6) {
        grid[5][bridgeLeft + 1] = TILES.PLANT;
        grid[5][bridgeRight - 1] = TILES.PLANT;
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
// REDESIGNED: Strictly symmetrical French formal entrance plaza
const generateGate = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Define promenade bounds FIRST (used throughout)
    const promenadeLeft = midX - 3;
    const promenadeRight = midX + 2;

    // =====================================================
    // PHASE 1: BASE FLOORING
    // Outer areas = polished stone pavers (FLOOR)
    // Central promenade = cobblestones (ROAD_PAVER)
    // =====================================================

    // Fill entire area with polished stone pavement
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.FLOOR;
        }
    }

    // Central promenade - wide cobblestone avenue (6 tiles wide)
    // Goes ALL the way from row 0 to HEIGHT-1 for seamless entrance/exit
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = promenadeLeft; x <= promenadeRight; x++) {
            grid[y][x] = TILES.ROAD_PAVER;
        }
    }

    // =====================================================
    // PHASE 2: MONUMENTAL ENTRANCE (North)
    // Walls on sides only, entrance is OPEN cobblestone
    // =====================================================

    // North back wall (row 0) - ONLY on the sides, not in entrance
    for (let x = 0; x < promenadeLeft; x++) {
        grid[0][x] = TILES.WALL;
    }
    for (let x = promenadeRight + 1; x < WIDTH; x++) {
        grid[0][x] = TILES.WALL;
    }
    // Row 0 in entrance area is already ROAD_PAVER from above

    // Grand iron arch pillars framing the entrance (2 tiles tall)
    // Place OUTSIDE the promenade bounds
    grid[0][promenadeLeft - 1] = TILES.GATE_ARCH;
    grid[1][promenadeLeft - 1] = TILES.GATE_ARCH;
    grid[0][promenadeRight + 1] = TILES.GATE_ARCH;
    grid[1][promenadeRight + 1] = TILES.GATE_ARCH;

    // =====================================================
    // PHASE 3: STRICTLY SYMMETRICAL LAYOUT
    // All elements placed OUTSIDE the promenade to avoid path irregularities
    // =====================================================

    // --- FLAGPOLES (flanking entrance, row 5 to be well clear of walls) ---
    grid[5][promenadeLeft - 2] = TILES.FLAGPOLE;
    grid[5][promenadeRight + 2] = TILES.FLAGPOLE;

    // --- TICKET BOOTHS (2x2, symmetrically placed) ---
    grid[3][2] = TILES.TICKET_BOOTH;
    grid[3][WIDTH - 4] = TILES.TICKET_BOOTH;

    // --- TURNSTILES (guarding the promenade entrance - OUTSIDE promenade) ---
    grid[4][promenadeLeft - 1] = TILES.TURNSTILE;
    grid[4][promenadeRight + 1] = TILES.TURNSTILE;

    // --- KIOSKS (2x2, programs and guides) ---
    grid[7][2] = TILES.KIOSK;
    grid[7][WIDTH - 4] = TILES.KIOSK;

    // --- POTTED PALMS (tropical exotic flair - symmetrical rows) ---
    // Along sides (NOT on promenade)
    grid[3][5] = TILES.PLANT;
    grid[3][WIDTH - 6] = TILES.PLANT;
    grid[8][5] = TILES.PLANT;
    grid[8][WIDTH - 6] = TILES.PLANT;
    grid[12][5] = TILES.PLANT;
    grid[12][WIDTH - 6] = TILES.PLANT;
    grid[16][5] = TILES.PLANT;
    grid[16][WIDTH - 6] = TILES.PLANT;

    // --- DECORATIVE COLUMNS (flanking the promenade - OUTSIDE it) ---
    grid[6][promenadeLeft - 1] = TILES.COLUMN;
    grid[6][promenadeRight + 1] = TILES.COLUMN;
    grid[10][promenadeLeft - 1] = TILES.COLUMN;
    grid[10][promenadeRight + 1] = TILES.COLUMN;
    grid[14][promenadeLeft - 1] = TILES.COLUMN;
    grid[14][promenadeRight + 1] = TILES.COLUMN;

    // --- LAMP POSTS (elegant gas lamps - OUTSIDE promenade) ---
    grid[8][promenadeLeft - 1] = TILES.LAMP;
    grid[8][promenadeRight + 1] = TILES.LAMP;
    grid[12][promenadeLeft - 1] = TILES.LAMP;
    grid[12][promenadeRight + 1] = TILES.LAMP;
    grid[16][promenadeLeft - 1] = TILES.LAMP;
    grid[16][promenadeRight + 1] = TILES.LAMP;

    // --- WIDE BENCHES (waiting and resting areas) - 2 tiles each ---
    grid[6][2] = TILES.WIDE_BENCH;
    grid[6][WIDTH - 4] = TILES.WIDE_BENCH;
    grid[11][2] = TILES.WIDE_BENCH;
    grid[11][WIDTH - 4] = TILES.WIDE_BENCH;
    grid[15][2] = TILES.WIDE_BENCH;
    grid[15][WIDTH - 4] = TILES.WIDE_BENCH;

    // --- STATUES (decorative sculpture at mid-plaza) ---
    grid[midY][4] = TILES.STATUE_BUST;
    grid[midY][WIDTH - 5] = TILES.STATUE_BUST;

    // =====================================================
    // PHASE 4: CARRIAGE PARKING AREAS (lower corners)
    // Random chance of grand Victorian carriages
    // =====================================================
    if (rand() > 0.3) {
        // Left carriage (facing right)
        grid[HEIGHT - 4][1] = TILES.CARRIAGE_GRAND;
    }
    if (rand() > 0.3 && WIDTH - 2 < WIDTH) {
        // Right carriage
        grid[HEIGHT - 4][WIDTH - 3] = TILES.CARRIAGE;
    }

    // =====================================================
    // PHASE 5: ATMOSPHERIC DETAILS
    // =====================================================
    if (rand() > 0.6) {
        grid[13][4] = TILES.NEWSPAPER;
    }
};

// 14. Enhanced Galerie des Machines (the largest building ever constructed)
// 420m long x 115m wide - the architectural wonder of the 1889 Exposition
// 3 ARCHETYPES: Central 2x2 engine, symmetrical rows, mixed exhibition
const generateGalerieDesMachines = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midY = Math.floor(HEIGHT / 2);
    const midX = Math.floor(WIDTH / 2);

    // Select archetype (0-2) based on seed
    const archetype = Math.floor(rand() * 3);

    // =====================================================
    // PHASE 1: BASE - Iron plate floor
    // =====================================================
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

    // =====================================================
    // PHASE 2: COMMON ELEMENTS (all archetypes)
    // =====================================================

    // Central aisle running east-west
    for (let x = 1; x < WIDTH - 1; x++) {
        grid[midY][x] = TILES.PATH;
    }

    // Perpendicular aisle running north-south
    for (let y = 2; y < HEIGHT - 2; y++) {
        grid[y][midX] = TILES.PATH;
    }

    // Monumental iron columns at regular intervals
    for (let x = 4; x < WIDTH - 3; x += 6) {
        grid[1][x] = TILES.COLUMN;
        grid[HEIGHT - 2][x] = TILES.COLUMN;
    }

    // Electric arc lamps (symmetrical)
    grid[2][4] = TILES.LAMP;
    grid[2][WIDTH - 5] = TILES.LAMP;
    grid[HEIGHT - 3][4] = TILES.LAMP;
    grid[HEIGHT - 3][WIDTH - 5] = TILES.LAMP;

    // =====================================================
    // PHASE 3: ARCHETYPE-SPECIFIC LAYOUTS
    // =====================================================

    if (archetype === 0) {
        // ========================================
        // ARCHETYPE 0: GRAND CENTERPIECE
        // Central 2x2 Corliss engine with corner seating areas
        // ========================================

        // Place the massive 2x2 Grand Corliss engine at center
        grid[midY - 1][midX - 1] = TILES.CORLISS_GRAND_NW;
        grid[midY - 1][midX] = TILES.CORLISS_GRAND_NE;
        grid[midY][midX - 1] = TILES.CORLISS_GRAND_SW;
        grid[midY][midX] = TILES.CORLISS_GRAND_SE;

        // Safety railing around the engine
        for (let dx = -2; dx <= 1; dx++) {
            grid[midY - 2][midX + dx] = TILES.RAILING;
            grid[midY + 1][midX + dx] = TILES.RAILING;
        }
        grid[midY - 1][midX - 2] = TILES.RAILING;
        grid[midY][midX - 2] = TILES.RAILING;
        grid[midY - 1][midX + 1] = TILES.RAILING;
        grid[midY][midX + 1] = TILES.RAILING;

        // Corner seating/viewing areas (symmetrical)
        // NW corner
        grid[3][3] = TILES.TABLE;
        grid[2][3] = TILES.CHAIR_N;
        grid[4][3] = TILES.CHAIR_S;
        grid[3][2] = TILES.CHAIR_W;
        grid[3][4] = TILES.CHAIR_E;
        grid[4][5] = TILES.DISPLAY;

        // NE corner (mirrored)
        grid[3][WIDTH - 4] = TILES.TABLE;
        grid[2][WIDTH - 4] = TILES.CHAIR_N;
        grid[4][WIDTH - 4] = TILES.CHAIR_S;
        grid[3][WIDTH - 5] = TILES.CHAIR_W;
        grid[3][WIDTH - 3] = TILES.CHAIR_E;
        grid[4][WIDTH - 6] = TILES.DISPLAY;

        // SW corner (mirrored)
        grid[HEIGHT - 4][3] = TILES.TABLE;
        grid[HEIGHT - 5][3] = TILES.CHAIR_N;
        grid[HEIGHT - 3][3] = TILES.CHAIR_S;
        grid[HEIGHT - 4][2] = TILES.CHAIR_W;
        grid[HEIGHT - 4][4] = TILES.CHAIR_E;
        grid[HEIGHT - 5][5] = TILES.DISPLAY;

        // SE corner (mirrored)
        grid[HEIGHT - 4][WIDTH - 4] = TILES.TABLE;
        grid[HEIGHT - 5][WIDTH - 4] = TILES.CHAIR_N;
        grid[HEIGHT - 3][WIDTH - 4] = TILES.CHAIR_S;
        grid[HEIGHT - 4][WIDTH - 5] = TILES.CHAIR_W;
        grid[HEIGHT - 4][WIDTH - 3] = TILES.CHAIR_E;
        grid[HEIGHT - 5][WIDTH - 6] = TILES.DISPLAY;

        // Smaller machines flanking the main aisles
        grid[midY - 3][5] = TILES.MACHINERY;
        grid[midY - 3][WIDTH - 6] = TILES.MACHINERY;
        grid[midY + 2][5] = TILES.DYNAMO;
        grid[midY + 2][WIDTH - 6] = TILES.DYNAMO;

        // Benches for observation
        grid[midY - 3][midX - 4] = TILES.BENCH;
        grid[midY - 3][midX + 4] = TILES.BENCH;
        grid[midY + 2][midX - 4] = TILES.BENCH;
        grid[midY + 2][midX + 4] = TILES.BENCH;

    } else if (archetype === 1) {
        // ========================================
        // ARCHETYPE 1: SYMMETRICAL MACHINE ROWS
        // Organized rows of 1-tile machines on both sides
        // ========================================

        // North row of machines (variety of types)
        const northMachines = [TILES.MACHINERY, TILES.DYNAMO, TILES.PRINTING_PRESS, TILES.LOOM];
        for (let i = 0; i < 4; i++) {
            const x = 3 + i * 4;
            if (x < midX - 2) {
                grid[3][x] = northMachines[i % northMachines.length];
                grid[4][x] = TILES.RAILING;
                // Mirror on east side
                grid[3][WIDTH - x - 1] = northMachines[i % northMachines.length];
                grid[4][WIDTH - x - 1] = TILES.RAILING;
            }
        }

        // South row of machines
        const southMachines = [TILES.HYDRAULIC_PRESS, TILES.CENTRIFUGE, TILES.MACHINERY, TILES.DYNAMO];
        for (let i = 0; i < 4; i++) {
            const x = 3 + i * 4;
            if (x < midX - 2) {
                grid[HEIGHT - 4][x] = southMachines[i % southMachines.length];
                grid[HEIGHT - 5][x] = TILES.RAILING;
                // Mirror on east side
                grid[HEIGHT - 4][WIDTH - x - 1] = southMachines[i % southMachines.length];
                grid[HEIGHT - 5][WIDTH - x - 1] = TILES.RAILING;
            }
        }

        // Central feature: 1-tile Corliss
        grid[midY][midX] = TILES.CORLISS;
        grid[midY - 1][midX] = TILES.RAILING;
        grid[midY + 1][midX] = TILES.RAILING;

        // Benches between machine rows (symmetrical)
        grid[5][6] = TILES.BENCH;
        grid[5][WIDTH - 7] = TILES.BENCH;
        grid[HEIGHT - 6][6] = TILES.BENCH;
        grid[HEIGHT - 6][WIDTH - 7] = TILES.BENCH;

        // Display cases along center aisle
        grid[midY - 2][4] = TILES.DISPLAY;
        grid[midY - 2][WIDTH - 5] = TILES.DISPLAY;
        grid[midY + 1][4] = TILES.DISPLAY;
        grid[midY + 1][WIDTH - 5] = TILES.DISPLAY;

        // Information plaques
        grid[midY][3] = TILES.EXHIBIT;
        grid[midY][WIDTH - 4] = TILES.EXHIBIT;

    } else {
        // ========================================
        // ARCHETYPE 2: MIXED EXHIBITION
        // Combination of machines, displays, and seating
        // ========================================

        // Central 2x2 Corliss
        grid[midY - 1][midX - 1] = TILES.CORLISS_GRAND_NW;
        grid[midY - 1][midX] = TILES.CORLISS_GRAND_NE;
        grid[midY][midX - 1] = TILES.CORLISS_GRAND_SW;
        grid[midY][midX] = TILES.CORLISS_GRAND_SE;

        // North wing: Electrical exhibits
        grid[3][4] = TILES.DYNAMO;
        grid[3][5] = TILES.ARC_LAMP;
        grid[4][4] = TILES.RAILING;
        grid[3][WIDTH - 5] = TILES.DYNAMO;
        grid[3][WIDTH - 6] = TILES.ARC_LAMP;
        grid[4][WIDTH - 5] = TILES.RAILING;

        // South wing: Textile machinery
        grid[HEIGHT - 4][4] = TILES.LOOM;
        grid[HEIGHT - 4][6] = TILES.PRINTING_PRESS;
        grid[HEIGHT - 5][4] = TILES.RAILING;
        grid[HEIGHT - 4][WIDTH - 5] = TILES.LOOM;
        grid[HEIGHT - 4][WIDTH - 7] = TILES.PRINTING_PRESS;
        grid[HEIGHT - 5][WIDTH - 5] = TILES.RAILING;

        // Mid-level steam engines
        grid[midY - 3][6] = TILES.MACHINERY;
        grid[midY - 3][WIDTH - 7] = TILES.MACHINERY;
        grid[midY + 2][6] = TILES.HYDRAULIC_PRESS;
        grid[midY + 2][WIDTH - 7] = TILES.HYDRAULIC_PRESS;

        // Edison exhibit area (phonograph, telegraph)
        grid[midY - 2][3] = TILES.PHONOGRAPH;
        grid[midY - 1][3] = TILES.TELEGRAPH;
        grid[midY - 2][WIDTH - 4] = TILES.PHONOGRAPH;
        grid[midY - 1][WIDTH - 4] = TILES.TELEGRAPH;

        // Display cases
        grid[5][midX - 3] = TILES.DISPLAY;
        grid[5][midX + 3] = TILES.DISPLAY;
        grid[HEIGHT - 6][midX - 3] = TILES.DISPLAY;
        grid[HEIGHT - 6][midX + 3] = TILES.DISPLAY;

        // Seating areas
        grid[midY - 3][midX - 4] = TILES.BENCH;
        grid[midY - 3][midX + 4] = TILES.BENCH;
        grid[midY + 2][midX - 4] = TILES.BENCH;
        grid[midY + 2][midX + 4] = TILES.BENCH;

        // Corner tables with chairs
        grid[3][2] = TILES.TABLE;
        grid[2][2] = TILES.CHAIR_N;
        grid[3][WIDTH - 3] = TILES.TABLE;
        grid[2][WIDTH - 3] = TILES.CHAIR_N;
    }

    // =====================================================
    // PHASE 4: FINISHING TOUCHES (all archetypes)
    // =====================================================

    // Decorative plants in corners
    grid[2][1] = TILES.PLANT;
    grid[2][WIDTH - 2] = TILES.PLANT;
    grid[HEIGHT - 3][1] = TILES.PLANT;
    grid[HEIGHT - 3][WIDTH - 2] = TILES.PLANT;
};

// ============================================
// 13. Senegalese Village - Traditional African village setting (OUTDOOR)
// ============================================
const generateVillage = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Fill with packed earth/paving - outdoor village ground
    // Use FLOOR (the cobblestone/paving look) for the entire area
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.FLOOR; // Packed earth/paving throughout
        }
    }

    // Wooden fence perimeter instead of walls (outdoor feel)
    // Use hedges/plants to suggest village boundary without enclosing it
    for (let x = 0; x < WIDTH; x++) {
        if (x !== midX - 1 && x !== midX && x !== midX + 1) {
            grid[0][x] = TILES.HEDGE;
            grid[HEIGHT - 1][x] = TILES.HEDGE;
        }
    }
    for (let y = 1; y < HEIGHT - 1; y++) {
        grid[y][0] = TILES.HEDGE;
        grid[y][WIDTH - 1] = TILES.HEDGE;
    }

    // Helper function to place a 2x2 grand hut
    const placeGrandHut = (x: number, y: number) => {
        if (x >= 1 && x + 1 < WIDTH - 1 && y >= 1 && y + 1 < HEIGHT - 1) {
            grid[y][x] = TILES.GRAND_HUT_NW;
            grid[y][x + 1] = TILES.GRAND_HUT_NE;
            grid[y + 1][x] = TILES.GRAND_HUT_SW;
            grid[y + 1][x + 1] = TILES.GRAND_HUT_SE;
        }
    };

    // Place grand huts (2x2) - the main dwellings in a compound arrangement
    // Chief's large hut offset from center to not block north entrance
    placeGrandHut(midX - 5, 2);
    placeGrandHut(midX + 3, 2);

    // Family compound huts arranged around the central space (away from entrances)
    placeGrandHut(2, 4);
    placeGrandHut(WIDTH - 4, 4);

    // Additional huts forming the compound
    placeGrandHut(2, 8);
    placeGrandHut(WIDTH - 4, 8);

    // Place small huts (1 tile) for variety - storage/granaries
    grid[6][midX - 4] = TILES.THATCH_HUT;
    grid[6][midX + 4] = TILES.THATCH_HUT;

    // Central fire pit - heart of the village (slightly south of center)
    grid[midY + 1][midX] = TILES.FIRE_PIT;

    // Ceremonial drums around fire pit area
    grid[midY + 2][midX - 2] = TILES.DRUM;
    grid[midY + 2][midX + 2] = TILES.DRUM;
    grid[midY - 1][midX - 3] = TILES.DRUM;
    grid[midY - 1][midX + 3] = TILES.DRUM;

    // Carved totems flanking entrance paths (not blocking them)
    grid[HEIGHT - 3][midX - 3] = TILES.TOTEM;
    grid[HEIGHT - 3][midX + 3] = TILES.TOTEM;
    grid[2][3] = TILES.TOTEM;
    grid[2][WIDTH - 4] = TILES.TOTEM;

    // Palm trees providing shade - scattered organically (avoiding entrances and huts)
    const palmPositions = [
        { x: midX - 2, y: 2 },  // Near north entrance but not blocking
        { x: midX + 2, y: 2 },
        { x: 1, y: midY },
        { x: WIDTH - 2, y: midY },
        { x: midX - 2, y: HEIGHT - 2 }, // Near south entrance but not blocking
        { x: midX + 2, y: HEIGHT - 2 },
        { x: 6, y: 6 },
        { x: WIDTH - 7, y: 6 },
    ];
    palmPositions.forEach(pos => {
        if (grid[pos.y][pos.x] === TILES.FLOOR) {
            grid[pos.y][pos.x] = TILES.PALM;
        }
    });

    // Scattered plants and items for atmosphere - more sparse
    for (let i = 0; i < 8; i++) {
        const px = Math.floor(rand() * (WIDTH - 6)) + 3;
        const py = Math.floor(rand() * (HEIGHT - 6)) + 3;
        if (grid[py][px] === TILES.FLOOR) {
            const r = rand();
            if (r < 0.5) {
                grid[py][px] = TILES.PLANT;
            }
            // Less clutter - leave most as open ground
        }
    }

    // Benches for European visitors/observers on the periphery
    grid[midY - 2][WIDTH - 2] = TILES.BENCH;
    grid[midY + 2][WIDTH - 2] = TILES.BENCH;
};

// ============================================
// 14. Trocadéro Palace - Moorish architecture interior
// ============================================
const generateTrocadero = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Fill with ornate floor - this is the indoor palace
    for (let y = 1; y < HEIGHT - 1; y++) {
        for (let x = 1; x < WIDTH - 1; x++) {
            grid[y][x] = TILES.FLOOR_POLISHED;
        }
    }

    // Outer walls - use directional walls for proper tall wall rendering
    for (let x = 0; x < WIDTH; x++) {
        if (x === 0) {
            grid[0][x] = TILES.WALL_NW;
        } else if (x === WIDTH - 1) {
            grid[0][x] = TILES.WALL_NE;
        } else {
            grid[0][x] = TILES.WALL_N;
        }
    }
    for (let x = 0; x < WIDTH; x++) {
        if (x === 0) {
            grid[HEIGHT - 1][x] = TILES.WALL_SW;
        } else if (x === WIDTH - 1) {
            grid[HEIGHT - 1][x] = TILES.WALL_SE;
        } else {
            grid[HEIGHT - 1][x] = TILES.WALL_S;
        }
    }
    for (let y = 1; y < HEIGHT - 1; y++) {
        grid[y][0] = TILES.WALL_W;
        grid[y][WIDTH - 1] = TILES.WALL_E;
    }

    // Moorish arched colonnade at top - symmetrically placed
    // Place arches from center outward for perfect symmetry
    const archPositions = [midX - 6, midX - 3, midX, midX + 3, midX + 6];
    for (const x of archPositions) {
        if (x > 2 && x < WIDTH - 3) {
            grid[1][x] = TILES.MOORISH_ARCH;
            grid[2][x] = TILES.COLUMN;
        }
    }

    // Decorative minarets at corners - symmetrical
    grid[1][2] = TILES.MINARET;
    grid[1][WIDTH - 3] = TILES.MINARET;

    // Grand Beaux-Arts fountain as centerpiece (the Trocadéro was famous for its fountain)
    // The 6x6 fountain is placed starting at (midX-3, midY-3) spanning to (midX+2, midY+2)
    // Visual center is between columns midX-1 and midX (i.e., at midX - 0.5)
    // For perfect symmetry, all decorations should be placed relative to fountain bounds
    placeGrandFountain(grid, midX, midY, 'statue');

    // Fountain spans: X from (midX-3) to (midX+2), Y from (midY-3) to (midY+2)
    // That's columns: midX-3, midX-2, midX-1, midX, midX+1, midX+2
    const fountainLeft = midX - 3;
    const fountainRight = midX + 2;
    const fountainTop = midY - 3;
    const fountainBottom = midY + 2;

    // Gravel paths around the grand fountain - symmetrical relative to fountain edges
    for (let x = fountainLeft - 2; x <= fountainRight + 2; x++) {
        if (grid[fountainTop - 1][x] !== TILES.WALL) grid[fountainTop - 1][x] = TILES.GRAVEL;
        if (grid[fountainBottom + 1][x] !== TILES.WALL) grid[fountainBottom + 1][x] = TILES.GRAVEL;
    }
    for (let y = fountainTop - 1; y <= fountainBottom + 1; y++) {
        if (grid[y][fountainLeft - 2] !== TILES.WALL) grid[y][fountainLeft - 2] = TILES.GRAVEL;
        if (grid[y][fountainRight + 2] !== TILES.WALL) grid[y][fountainRight + 2] = TILES.GRAVEL;
    }

    // Cone topiaries at corners of gravel path - symmetrical to fountain
    grid[fountainTop - 1][fountainLeft - 1] = TILES.TOPIARY_CONE;
    grid[fountainTop - 1][fountainRight + 1] = TILES.TOPIARY_CONE;
    grid[fountainBottom + 1][fountainLeft - 1] = TILES.TOPIARY_CONE;
    grid[fountainBottom + 1][fountainRight + 1] = TILES.TOPIARY_CONE;

    // Parterres at outer corners - symmetrical to fountain edges
    grid[fountainTop - 1][fountainLeft + 1] = TILES.PARTERRE;
    grid[fountainTop - 1][fountainRight - 1] = TILES.PARTERRE;
    grid[fountainBottom + 1][fountainLeft + 1] = TILES.PARTERRE;
    grid[fountainBottom + 1][fountainRight - 1] = TILES.PARTERRE;

    // Garden urns at entry points - symmetrical to fountain
    grid[HEIGHT - 4][fountainLeft - 3] = TILES.GARDEN_URN;
    grid[HEIGHT - 4][fountainRight + 3] = TILES.GARDEN_URN;

    // Ball topiaries along the sides - these stay at wall edges (already symmetric)
    grid[midY][2] = TILES.TOPIARY_BALL;
    grid[midY][WIDTH - 3] = TILES.TOPIARY_BALL;

    // Wide benches for viewing - symmetrical to fountain (2 tiles each)
    grid[HEIGHT - 3][fountainLeft - 1] = TILES.WIDE_BENCH;
    grid[HEIGHT - 3][fountainRight] = TILES.WIDE_BENCH;

    // === CAFÉ TERRACES (Trocadéro was a popular promenade spot) ===
    // Left terrace - at position 4 from left edge
    grid[HEIGHT - 4][4] = TILES.TABLE;
    grid[HEIGHT - 5][4] = TILES.CHAIR_N;
    grid[HEIGHT - 3][4] = TILES.CHAIR_S;
    grid[HEIGHT - 4][3] = TILES.CHAIR_W;

    // Right terrace - mirror at position 4 from right edge (WIDTH - 5)
    grid[HEIGHT - 4][WIDTH - 5] = TILES.TABLE;
    grid[HEIGHT - 5][WIDTH - 5] = TILES.CHAIR_N;
    grid[HEIGHT - 3][WIDTH - 5] = TILES.CHAIR_S;
    grid[HEIGHT - 4][WIDTH - 4] = TILES.CHAIR_E;

    // Lamps - symmetrical at 4 from each edge
    grid[3][4] = TILES.LAMP;
    grid[3][WIDTH - 5] = TILES.LAMP;

    // Classical statues - symmetrical placement (6 from left = WIDTH - 7 from right)
    grid[4][6] = TILES.STATUE;
    grid[4][WIDTH - 7] = TILES.STATUE;

    // Bronze allegorical figures flanking the main fountain area
    // These represent Art and Industry, common 1889 Exposition themes
    // Placed symmetrically relative to fountain edges
    grid[midY][fountainLeft - 3] = TILES.STATUE_ALLEGORY;
    grid[midY][fountainRight + 3] = TILES.STATUE_ALLEGORY;

    // Potted palms near café - symmetrical (2 from left = WIDTH - 3 from right)
    grid[HEIGHT - 5][2] = TILES.PLANT;
    grid[HEIGHT - 5][WIDTH - 3] = TILES.PLANT;

    // Additional symmetry: decorative elements in alcoves
    // Left alcove
    grid[midY - 1][2] = TILES.STATUE;
    grid[midY + 1][2] = TILES.PLANT;
    // Right alcove - mirror
    grid[midY - 1][WIDTH - 3] = TILES.STATUE;
    grid[midY + 1][WIDTH - 3] = TILES.PLANT;
};

// ============================================
// 15. Waterfall/Cascade - Trocadéro waterfall
// The famous cascade at the Palais du Trocadéro, descending toward the Seine
// ============================================
const generateWaterfall = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);

    // === BASE TERRAIN ===
    // Fill with manicured lawn - this is a formal garden setting
    for (let y = 1; y < HEIGHT - 1; y++) {
        for (let x = 1; x < WIDTH - 1; x++) {
            grid[y][x] = TILES.GRASS;
        }
    }

    // Outer walls - use directional walls for proper rendering
    for (let x = 0; x < WIDTH; x++) {
        if (x === 0) grid[0][x] = TILES.WALL_NW;
        else if (x === WIDTH - 1) grid[0][x] = TILES.WALL_NE;
        else grid[0][x] = TILES.WALL_N;
    }
    for (let x = 0; x < WIDTH; x++) {
        if (x === 0) grid[HEIGHT - 1][x] = TILES.WALL_SW;
        else if (x === WIDTH - 1) grid[HEIGHT - 1][x] = TILES.WALL_SE;
        else grid[HEIGHT - 1][x] = TILES.WALL_S;
    }
    for (let y = 1; y < HEIGHT - 1; y++) {
        grid[y][0] = TILES.WALL_W;
        grid[y][WIDTH - 1] = TILES.WALL_E;
    }

    // === THE CASCADE - Dramatic rock formation at top ===
    // Wide rocky outcrop forming the cascade source
    for (let x = midX - 5; x <= midX + 5; x++) {
        grid[1][x] = TILES.CASCADE_ROCK;
    }
    // Second tier of rocks - narrower, with gap for water
    for (let x = midX - 4; x <= midX + 4; x++) {
        if (x < midX - 1 || x > midX + 1) {
            grid[2][x] = TILES.CASCADE_ROCK;
        }
    }

    // === WATERFALL - Three-column cascade ===
    // Main falls
    grid[2][midX - 1] = TILES.WATERFALL;
    grid[2][midX] = TILES.WATERFALL;
    grid[2][midX + 1] = TILES.WATERFALL;
    grid[3][midX - 1] = TILES.WATERFALL;
    grid[3][midX] = TILES.WATERFALL;
    grid[3][midX + 1] = TILES.WATERFALL;
    grid[4][midX] = TILES.WATERFALL;

    // Flanking rocks frame the cascade dramatically
    grid[3][midX - 3] = TILES.CASCADE_ROCK;
    grid[3][midX + 3] = TILES.CASCADE_ROCK;
    grid[4][midX - 2] = TILES.CASCADE_ROCK;
    grid[4][midX + 2] = TILES.CASCADE_ROCK;

    // === REFLECTING POOL - Catches the cascade ===
    // Larger pool with ornamental shape
    for (let y = 5; y <= 8; y++) {
        for (let x = midX - 4; x <= midX + 4; x++) {
            const isCorner = (y === 5 || y === 8) && (x === midX - 4 || x === midX + 4);
            if (!isCorner) {
                grid[y][x] = TILES.WATER;
            }
        }
    }
    // Fountain spray rising from center of pool
    grid[6][midX] = TILES.FOUNTAIN_JET;
    grid[7][midX] = TILES.LANDMARK_FOUNTAIN_CENTER;

    // === BRONZE SCULPTURES - Symmetrical classical arrangement ===
    // Seahorses at the cascade edges - water guardians
    grid[5][midX - 5] = TILES.STATUE_SEAHORSE;
    grid[5][midX + 5] = TILES.STATUE_SEAHORSE;

    // Nymphs along the pool sides - water spirits
    grid[7][midX - 6] = TILES.STATUE_NYMPH;
    grid[7][midX + 6] = TILES.STATUE_NYMPH;

    // === FORMAL GARDEN ELEMENTS ===
    // Gravel promenade paths - cross-axis design
    // Main viewing path across the bottom
    for (let x = 2; x < WIDTH - 2; x++) {
        grid[HEIGHT - 3][x] = TILES.GRAVEL;
    }
    // Side paths leading to cascade
    for (let y = 4; y < HEIGHT - 3; y++) {
        grid[y][3] = TILES.GRAVEL;
        grid[y][WIDTH - 4] = TILES.GRAVEL;
    }

    // Hedges lining the paths - formal French style
    grid[9][4] = TILES.HEDGE;
    grid[9][WIDTH - 5] = TILES.HEDGE;
    grid[10][4] = TILES.HEDGE;
    grid[10][WIDTH - 5] = TILES.HEDGE;

    // Flowerbeds near the pool
    grid[9][midX - 3] = TILES.FLOWERBED;
    grid[9][midX + 3] = TILES.FLOWERBED;

    // === SEATING AND AMENITIES ===
    // Benches for viewing the cascade - prime spots
    grid[HEIGHT - 4][midX - 3] = TILES.BENCH;
    grid[HEIGHT - 4][midX + 3] = TILES.BENCH;
    grid[10][midX] = TILES.BENCH;

    // === TREES AND PLANTING ===
    // Formal tree placement - symmetrical
    grid[9][2] = TILES.TREE;
    grid[9][WIDTH - 3] = TILES.TREE;
    grid[HEIGHT - 4][2] = TILES.TREE;
    grid[HEIGHT - 4][WIDTH - 3] = TILES.TREE;

    // Ornamental plants near walls
    grid[3][1] = TILES.PLANT;
    grid[3][WIDTH - 2] = TILES.PLANT;
    grid[HEIGHT - 2][2] = TILES.PLANT;
    grid[HEIGHT - 2][WIDTH - 3] = TILES.PLANT;

    // === LIGHTING ===
    // Gas lamps along the promenade
    grid[HEIGHT - 3][5] = TILES.LAMP;
    grid[HEIGHT - 3][WIDTH - 6] = TILES.LAMP;
    grid[HEIGHT - 3][midX] = TILES.LAMP;

    // === ATMOSPHERIC EFFECTS ===
    // Mist rising from the cascade (occasional)
    if (rand() > 0.3) {
        grid[5][midX - 2] = TILES.STEAM;
        grid[5][midX + 2] = TILES.STEAM;
    }
};

// ============================================
// 16. Aquarium du Trocadéro - Underwater wonder
// ============================================
const generateAquarium = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Brown paver/cobblestone floor throughout (underwater grotto atmosphere)
    for (let y = 1; y < HEIGHT - 1; y++) {
        for (let x = 1; x < WIDTH - 1; x++) {
            grid[y][x] = TILES.ROAD_PAVER;
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

    // === MAIN AQUARIUM TANKS along walls ===
    // Large tanks on the back (north) wall - symmetrical
    grid[1][4] = TILES.AQUARIUM;
    grid[1][5] = TILES.AQUARIUM;
    grid[1][6] = TILES.AQUARIUM;
    grid[1][WIDTH - 7] = TILES.AQUARIUM;
    grid[1][WIDTH - 6] = TILES.AQUARIUM;
    grid[1][WIDTH - 5] = TILES.AQUARIUM;

    // Central grand tank on north wall
    grid[1][midX - 2] = TILES.AQUARIUM;
    grid[1][midX - 1] = TILES.AQUARIUM;
    grid[1][midX] = TILES.AQUARIUM;
    grid[1][midX + 1] = TILES.AQUARIUM;
    grid[1][midX + 2] = TILES.AQUARIUM;

    // Side wall tanks - symmetrical
    grid[3][1] = TILES.AQUARIUM;
    grid[4][1] = TILES.AQUARIUM;
    grid[5][1] = TILES.AQUARIUM;
    grid[midY][1] = TILES.AQUARIUM;
    grid[midY + 1][1] = TILES.AQUARIUM;

    grid[3][WIDTH - 2] = TILES.AQUARIUM;
    grid[4][WIDTH - 2] = TILES.AQUARIUM;
    grid[5][WIDTH - 2] = TILES.AQUARIUM;
    grid[midY][WIDTH - 2] = TILES.AQUARIUM;
    grid[midY + 1][WIDTH - 2] = TILES.AQUARIUM;

    // === CENTRAL FEATURE: Grand circular tank ===
    // Floor pattern around central tank
    for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist <= 2.5 && midY + dy > 1 && midY + dy < HEIGHT - 2) {
                grid[midY + dy][midX + dx] = TILES.GLASS_FLOOR;
            }
        }
    }
    // Central display tank
    grid[midY][midX] = TILES.AQUARIUM;
    grid[midY - 1][midX] = TILES.AQUARIUM;
    grid[midY + 1][midX] = TILES.AQUARIUM;
    grid[midY][midX - 1] = TILES.AQUARIUM;
    grid[midY][midX + 1] = TILES.AQUARIUM;

    // === VIEWING BENCHES facing tanks ===
    // Benches facing back wall tanks
    grid[3][5] = TILES.BENCH;
    grid[3][WIDTH - 6] = TILES.BENCH;
    grid[3][midX] = TILES.BENCH;

    // Benches around central tank
    grid[midY - 3][midX - 3] = TILES.BENCH;
    grid[midY - 3][midX + 3] = TILES.BENCH;
    grid[midY + 3][midX - 3] = TILES.BENCH;
    grid[midY + 3][midX + 3] = TILES.BENCH;

    // === ATMOSPHERIC LIGHTING ===
    // Dim gas lamps (underwater grotto feel)
    grid[2][3] = TILES.LAMP;
    grid[2][WIDTH - 4] = TILES.LAMP;
    grid[midY][3] = TILES.LAMP;
    grid[midY][WIDTH - 4] = TILES.LAMP;
    grid[HEIGHT - 3][midX - 4] = TILES.LAMP;
    grid[HEIGHT - 3][midX + 4] = TILES.LAMP;

    // === DECORATIVE COLUMNS (Moorish style from Trocadéro) ===
    grid[4][7] = TILES.COLUMN;
    grid[4][WIDTH - 8] = TILES.COLUMN;
    grid[HEIGHT - 5][7] = TILES.COLUMN;
    grid[HEIGHT - 5][WIDTH - 8] = TILES.COLUMN;

    // === POTTED PALMS (tropical atmosphere) ===
    grid[2][2] = TILES.PLANT;
    grid[2][WIDTH - 3] = TILES.PLANT;
    grid[HEIGHT - 3][2] = TILES.PLANT;
    grid[HEIGHT - 3][WIDTH - 3] = TILES.PLANT;

    // === SPECIMEN DISPLAYS (shells, coral, scientific instruments) ===
    grid[HEIGHT - 4][4] = TILES.DISPLAY;
    grid[HEIGHT - 4][WIDTH - 5] = TILES.DISPLAY;

    // Scattered newspapers (visitors reading about fish)
    if (rand() > 0.5) {
        grid[4][midX + 2] = TILES.NEWSPAPER;
    }
};

// ============================================
// 17. CAFE - Parisian café/brasserie interior
// ============================================
const generateCafe = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Base floor - warm parquet pattern throughout interior
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            // Alternating parquet pattern for interior only
            if (y > 1 && y < HEIGHT - 1 && x > 0 && x < WIDTH - 1) {
                grid[y][x] = ((x + y) % 2 === 0) ? TILES.FLOOR_POLISHED : TILES.FLOOR;
            } else {
                grid[y][x] = TILES.FLOOR;
            }
        }
    }

    // Outer walls with proper directional types (matching SALON pattern)
    for (let x = 0; x < WIDTH; x++) {
        grid[0][x] = x === 0 ? TILES.WALL_NW : (x === WIDTH - 1 ? TILES.WALL_NE : TILES.WALL_N);
        grid[HEIGHT - 1][x] = x === 0 ? TILES.WALL_SW : (x === WIDTH - 1 ? TILES.WALL_SE : TILES.WALL_S);
    }
    for (let y = 1; y < HEIGHT - 1; y++) {
        grid[y][0] = TILES.WALL_W;
        grid[y][WIDTH - 1] = TILES.WALL_E;
    }

    // === CENTRAL BAR/COUNTER ===
    // Single kiosk (bar counter) at the back center
    grid[2][midX] = TILES.KIOSK;

    // === CARPET RUNNER from entrance to bar ===
    for (let y = 3; y < HEIGHT - 2; y++) {
        grid[y][midX] = TILES.CARPET;
    }

    // === SEATING AREAS - Cleaner layout with tables along walls ===

    // Left side seating (west)
    // Table 1 - north side
    grid[4][4] = TILES.TABLE;
    grid[4][3] = TILES.CHAIR_W;
    grid[4][5] = TILES.CHAIR_E;

    // Table 2 - south side
    grid[HEIGHT - 4][4] = TILES.TABLE;
    grid[HEIGHT - 4][3] = TILES.CHAIR_W;
    grid[HEIGHT - 4][5] = TILES.CHAIR_E;

    // Right side seating (east)
    // Table 3 - north side
    grid[4][WIDTH - 5] = TILES.TABLE;
    grid[4][WIDTH - 6] = TILES.CHAIR_W;
    grid[4][WIDTH - 4] = TILES.CHAIR_E;

    // Table 4 - south side
    grid[HEIGHT - 4][WIDTH - 5] = TILES.TABLE;
    grid[HEIGHT - 4][WIDTH - 6] = TILES.CHAIR_W;
    grid[HEIGHT - 4][WIDTH - 4] = TILES.CHAIR_E;

    // === DECORATIVE ELEMENTS ===
    // Symmetrical lanterns
    grid[3][midX - 4] = TILES.LANTERN;
    grid[3][midX + 4] = TILES.LANTERN;

    // Potted plants flanking bar
    grid[2][midX - 3] = TILES.PLANT;
    grid[2][midX + 3] = TILES.PLANT;

    // Coat rack near entrance (one only)
    grid[HEIGHT - 3][midX + 2] = TILES.COAT_RACK;

    // Mirrors on back wall - symmetrical
    grid[1][midX - 4] = TILES.MIRROR;
    grid[1][midX + 4] = TILES.MIRROR;

    // Newspaper on a table (random)
    if (rand() > 0.4) {
        grid[5][4] = TILES.NEWSPAPER;
    }

    // NOTE: Do NOT place doors here - let the standard exit handler do it
    // The standard handler runs after this function and properly places
    // directional doors and registers exits correctly
};

// ============================================
// 18. CONGRESS - International Psychology Congress hall
// William James's experimental psychology congress, 1889
// ============================================
const generateCongress = (grid: string[][], seed: number = 0) => {
    const rand = createSeededRandom(seed);
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Polished academic floor
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

    // === LECTURE PODIUM at north end ===
    // Raised platform area with lectern
    grid[2][midX - 2] = TILES.CARPET;
    grid[2][midX - 1] = TILES.CARPET;
    grid[2][midX] = TILES.CARPET;
    grid[2][midX + 1] = TILES.CARPET;
    grid[2][midX + 2] = TILES.CARPET;
    grid[3][midX - 2] = TILES.CARPET;
    grid[3][midX - 1] = TILES.CARPET;
    grid[3][midX] = TILES.CARPET;
    grid[3][midX + 1] = TILES.CARPET;
    grid[3][midX + 2] = TILES.CARPET;

    // Lectern/podium at center
    grid[2][midX] = TILES.DISPLAY;

    // === AUDIENCE SEATING - rows of chairs ===
    // Row 1 (closest to podium)
    for (let x = 3; x < WIDTH - 3; x++) {
        if (x !== midX) {
            grid[5][x] = TILES.CHAIR_N;
        }
    }
    // Row 2
    for (let x = 3; x < WIDTH - 3; x++) {
        if (x !== midX) {
            grid[7][x] = TILES.CHAIR_N;
        }
    }
    // Row 3
    for (let x = 3; x < WIDTH - 3; x++) {
        if (x !== midX) {
            grid[9][x] = TILES.CHAIR_N;
        }
    }

    // Central aisle (carpet runner)
    for (let y = 4; y < HEIGHT - 2; y++) {
        grid[y][midX] = TILES.CARPET;
    }

    // === SCIENTIFIC APPARATUS along walls ===
    // Display cases with psychological instruments
    grid[4][2] = TILES.DISPLAY;  // Chronoscope
    grid[6][2] = TILES.DISPLAY;  // Tachistoscope
    grid[8][2] = TILES.DISPLAY;  // Kymograph

    grid[4][WIDTH - 3] = TILES.DISPLAY;  // Galvanometer
    grid[6][WIDTH - 3] = TILES.DISPLAY;  // Plethysmograph
    grid[8][WIDTH - 3] = TILES.DISPLAY;  // Color mixer

    // === CHARTS AND DIAGRAMS on walls ===
    // Sconces for lighting the charts
    grid[1][4] = TILES.SCONCE_DOWN;
    grid[1][WIDTH - 5] = TILES.SCONCE_DOWN;
    grid[1][midX - 4] = TILES.SCONCE_DOWN;
    grid[1][midX + 4] = TILES.SCONCE_DOWN;

    // === COLUMNS framing the hall ===
    grid[4][4] = TILES.COLUMN;
    grid[4][WIDTH - 5] = TILES.COLUMN;
    grid[HEIGHT - 4][4] = TILES.COLUMN;
    grid[HEIGHT - 4][WIDTH - 5] = TILES.COLUMN;

    // === BACK OF HALL ===
    // Registration table
    grid[HEIGHT - 3][midX - 2] = TILES.TABLE;
    grid[HEIGHT - 3][midX + 2] = TILES.TABLE;

    // Coat racks for attendees
    grid[HEIGHT - 3][3] = TILES.COAT_RACK;
    grid[HEIGHT - 3][WIDTH - 4] = TILES.COAT_RACK;

    // Potted plants for academic ambiance
    grid[2][2] = TILES.PLANT;
    grid[2][WIDTH - 3] = TILES.PLANT;

    // Scattered papers and journals
    if (rand() > 0.3) {
        grid[5][midX + 2] = TILES.NEWSPAPER;
    }
    if (rand() > 0.3) {
        grid[7][midX - 2] = TILES.NEWSPAPER;
    }

    // Blackboard near podium (using mirror tile as stand-in)
    grid[1][midX] = TILES.MIRROR;
};

// ===========================================
// ROTUNDA - Circular domed hall for Napoleon's Tomb
// Hôtel des Invalides inspired design
// ===========================================
const generateRotunda = (grid: string[][], seed: number = 0) => {
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Fill with polished marble floor
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.FLOOR_POLISHED;
        }
    }

    // Create circular room by placing walls outside a circle
    const radius = Math.min(midX, midY) - 1; // Circle radius
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const dx = x - midX;
            const dy = y - midY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Outside the circle = walls
            if (distance > radius) {
                grid[y][x] = TILES.WALL;
            }
            // Just inside edge = decorative element or column positions
            else if (distance > radius - 1.5 && distance <= radius) {
                // Leave as floor - this is the gallery ring
            }
        }
    }

    // Ring of columns around the center
    const columnRadius = radius - 2;
    const numColumns = 12;
    for (let i = 0; i < numColumns; i++) {
        const angle = (i / numColumns) * Math.PI * 2;
        const cx = Math.round(midX + Math.cos(angle) * columnRadius);
        const cy = Math.round(midY + Math.sin(angle) * columnRadius);

        // Only place if it's not at a cardinal direction (leave space for doors)
        const isCardinal = i === 0 || i === 3 || i === 6 || i === 9;
        if (!isCardinal && cx > 0 && cx < WIDTH - 1 && cy > 0 && cy < HEIGHT - 1) {
            grid[cy][cx] = TILES.COLUMN;
        }
    }

    // Napoleon's Tomb 3x2 in the center
    // Placed so it's centered: top-left corner at (midX-1, midY-1)
    const tombX = midX - 1;
    const tombY = midY - 1;

    // Top row: NW, N, NE
    grid[tombY][tombX] = TILES.NAPOLEON_TOMB_NW;
    grid[tombY][tombX + 1] = TILES.NAPOLEON_TOMB_N;
    grid[tombY][tombX + 2] = TILES.NAPOLEON_TOMB_NE;

    // Bottom row: SW, S, SE
    grid[tombY + 1][tombX] = TILES.NAPOLEON_TOMB_SW;
    grid[tombY + 1][tombX + 1] = TILES.NAPOLEON_TOMB_S;
    grid[tombY + 1][tombX + 2] = TILES.NAPOLEON_TOMB_SE;

    // Gold railing around the tomb pit (one tile out from tomb)
    // North side
    grid[tombY - 1][tombX] = TILES.ROTUNDA_RAILING;
    grid[tombY - 1][tombX + 1] = TILES.ROTUNDA_RAILING;
    grid[tombY - 1][tombX + 2] = TILES.ROTUNDA_RAILING;
    // South side
    grid[tombY + 2][tombX] = TILES.ROTUNDA_RAILING;
    grid[tombY + 2][tombX + 1] = TILES.ROTUNDA_RAILING;
    grid[tombY + 2][tombX + 2] = TILES.ROTUNDA_RAILING;
    // West side
    grid[tombY][tombX - 1] = TILES.ROTUNDA_RAILING;
    grid[tombY + 1][tombX - 1] = TILES.ROTUNDA_RAILING;
    // East side
    grid[tombY][tombX + 3] = TILES.ROTUNDA_RAILING;
    grid[tombY + 1][tombX + 3] = TILES.ROTUNDA_RAILING;

    // Gas lamps between columns for atmosphere
    const lampRadius = columnRadius + 0.5;
    for (let i = 0; i < 8; i++) {
        // Offset by half a column position
        const angle = ((i + 0.5) / 8) * Math.PI * 2;
        const lx = Math.round(midX + Math.cos(angle) * (lampRadius + 1));
        const ly = Math.round(midY + Math.sin(angle) * (lampRadius + 1));

        if (lx > 1 && lx < WIDTH - 2 && ly > 1 && ly < HEIGHT - 2) {
            if (grid[ly][lx] === TILES.FLOOR_POLISHED) {
                grid[ly][lx] = TILES.LAMP;
            }
        }
    }

    // Decorative potted plants in corners (where circle meets rectangular edges)
    grid[1][1] = TILES.PLANT;
    grid[1][WIDTH - 2] = TILES.PLANT;
    grid[HEIGHT - 2][1] = TILES.PLANT;
    grid[HEIGHT - 2][WIDTH - 2] = TILES.PLANT;
};

// ===========================================
// PANORAMA - Circular immersive painting rooms
// Popular 19th century entertainment - 360° paintings
// Simple design: wood floor, circular painting wall, central viewing platform
// ===========================================
const generatePanorama = (grid: string[][], seed: number = 0) => {
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // === STEP 1: Fill entire room with wood flooring (walkable) ===
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.FLOOR_WOOD;
        }
    }

    // === STEP 2: Create the panorama painting as a single circular ring ===
    // The painting is one tile wide, forming the outer edge of the circular room
    const paintingRadius = Math.min(midX, midY) - 1;
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const dx = x - midX;
            const dy = y - midY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Painting ring: between paintingRadius and paintingRadius + 1
            if (distance >= paintingRadius && distance < paintingRadius + 1.5) {
                grid[y][x] = TILES.WALL_PAINTING;
            }
            // Outer wall beyond the painting
            else if (distance >= paintingRadius + 1.5) {
                grid[y][x] = TILES.WALL;
            }
        }
    }

    // === STEP 3: Raised central viewing platform ===
    // Slightly elevated area with polished floor for best viewing
    const platformRadius = 3;
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const dx = x - midX;
            const dy = y - midY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= platformRadius) {
                grid[y][x] = TILES.FLOOR_POLISHED;
            }
        }
    }

    // === STEP 4: Benches on the platform facing the painting ===
    // Cardinal directions only - simple and functional
    grid[midY][midX - 2] = TILES.BENCH;
    grid[midY][midX + 2] = TILES.BENCH;
    grid[midY - 2][midX] = TILES.BENCH;
    grid[midY + 2][midX] = TILES.BENCH;

    // === STEP 5: Dim gas lamps at cardinal points ===
    // Placed between platform and painting for atmosphere
    const lampDist = Math.floor((platformRadius + paintingRadius) / 2);
    grid[midY][midX - lampDist] = TILES.LAMP;
    grid[midY][midX + lampDist] = TILES.LAMP;
    grid[midY - lampDist][midX] = TILES.LAMP;
    grid[midY + lampDist][midX] = TILES.LAMP;

    // === STEP 6: Entry/exit door at bottom ===
    grid[HEIGHT - 2][midX] = TILES.DOOR;
};

// ===========================================
// FOUNTAIN - Grand basins with sculptures
// The spectacular illuminated fountains of the Exposition
// ===========================================
const generateFountain = (grid: string[][], seed: number = 0) => {
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Gravel paths throughout
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.GRAVEL;
        }
    }

    // Main reflecting pool - rectangular with rounded ends
    const poolWidth = 10;
    const poolHeight = 6;
    const poolStartX = midX - Math.floor(poolWidth / 2);
    const poolStartY = midY - Math.floor(poolHeight / 2);

    for (let y = poolStartY; y < poolStartY + poolHeight; y++) {
        for (let x = poolStartX; x < poolStartX + poolWidth; x++) {
            if (y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH) {
                grid[y][x] = TILES.WATER;
            }
        }
    }

    // Decorative basin edges
    for (let x = poolStartX; x < poolStartX + poolWidth; x++) {
        if (poolStartY - 1 >= 0) grid[poolStartY - 1][x] = TILES.FOUNTAIN_EDGE;
        if (poolStartY + poolHeight < HEIGHT) grid[poolStartY + poolHeight][x] = TILES.FOUNTAIN_EDGE;
    }
    for (let y = poolStartY; y < poolStartY + poolHeight; y++) {
        if (poolStartX - 1 >= 0) grid[y][poolStartX - 1] = TILES.FOUNTAIN_EDGE;
        if (poolStartX + poolWidth < WIDTH) grid[y][poolStartX + poolWidth] = TILES.FOUNTAIN_EDGE;
    }

    // Central fountain with water jets
    grid[midY][midX] = TILES.FOUNTAIN_JET;
    grid[midY - 1][midX] = TILES.FOUNTAIN_JET;
    grid[midY + 1][midX] = TILES.FOUNTAIN_JET;

    // Bronze sculptures in the pool - nymphs, sea creatures, allegories
    const sculpturePositions = [
        { x: midX - 3, y: midY, type: TILES.STATUE_NYMPH },
        { x: midX + 3, y: midY, type: TILES.STATUE_NYMPH },
        { x: midX - 2, y: midY - 2, type: TILES.STATUE_SEAHORSE },
        { x: midX + 2, y: midY - 2, type: TILES.STATUE_SEAHORSE },
        { x: midX, y: midY + 2, type: TILES.STATUE_ALLEGORY },
    ];

    for (const statue of sculpturePositions) {
        if (statue.x > 0 && statue.x < WIDTH - 1 && statue.y > 0 && statue.y < HEIGHT - 1) {
            grid[statue.y][statue.x] = statue.type;
        }
    }

    // Benches along the promenade for viewing
    grid[poolStartY - 3][midX - 4] = TILES.BENCH;
    grid[poolStartY - 3][midX + 4] = TILES.BENCH;
    grid[poolStartY + poolHeight + 2][midX - 4] = TILES.BENCH;
    grid[poolStartY + poolHeight + 2][midX + 4] = TILES.BENCH;

    // Ornate lamp posts
    grid[1][2] = TILES.LAMP;
    grid[1][WIDTH - 3] = TILES.LAMP;
    grid[HEIGHT - 2][2] = TILES.LAMP;
    grid[HEIGHT - 2][WIDTH - 3] = TILES.LAMP;
    grid[midY][1] = TILES.LAMP;
    grid[midY][WIDTH - 2] = TILES.LAMP;

    // Decorative hedges framing the space
    for (let x = 3; x < WIDTH - 3; x += 4) {
        if (grid[1][x] === TILES.GRAVEL) grid[1][x] = TILES.HEDGE;
        if (grid[HEIGHT - 2][x] === TILES.GRAVEL) grid[HEIGHT - 2][x] = TILES.HEDGE;
    }

    // Flower beds at corners
    grid[2][3] = TILES.FLOWERBED;
    grid[2][WIDTH - 4] = TILES.FLOWERBED;
    grid[HEIGHT - 3][3] = TILES.FLOWERBED;
    grid[HEIGHT - 3][WIDTH - 4] = TILES.FLOWERBED;
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
    else if (biome === 'SOUK') {
        // Different souk layouts based on zone name
        if (name.toLowerCase().includes('spice')) {
            generateSpiceAlley(grid, zoneSeed);
        } else if (name.toLowerCase().includes('copper')) {
            generateCoppersmithLane(grid, zoneSeed);
        } else if (name.toLowerCase().includes('tunis')) {
            generateTunisianSouk(grid, zoneSeed);
        } else {
            generateSouk(grid, zoneSeed);  // Default Rue du Caire
        }
    }
    else if (biome === 'GALERIE') generateGalerieDesMachines(grid, zoneSeed);
    else if (biome === 'BRIDGE') generateBridge(grid, zoneSeed);
    else if (biome === 'GATE') generateGate(grid, zoneSeed);
    else if (biome === 'VILLAGE') generateVillage(grid, zoneSeed);
    else if (biome === 'TROCADERO') generateTrocadero(grid, zoneSeed);
    else if (biome === 'WATERFALL') generateWaterfall(grid, zoneSeed);
    else if (biome === 'AQUARIUM') generateAquarium(grid, zoneSeed);
    else if (biome === 'CAFE') generateCafe(grid, zoneSeed);
    else if (biome === 'CONGRESS') generateCongress(grid, zoneSeed);
    else if (biome === 'ROTUNDA') generateRotunda(grid, zoneSeed);
    else if (biome === 'PANORAMA') generatePanorama(grid, zoneSeed);
    else if (biome === 'FOUNTAIN') generateFountain(grid, zoneSeed);
    else if (biome === 'TOWER_LEVEL') {
        // Legacy support - now using TOWER_BASE
        generateTowerBase(grid);
    }

    // Apply directional walls for SNES-style depth effect
    // This converts generic WALL tiles to directional variants (N/S/E/W)
    // and adds shadow strips beneath north walls
    // Also places wall sconces at regular intervals on back walls
    const wallRand = createSeededRandom(zoneSeed + 12345); // Different seed for wall placement
    placeDirectionalWalls(grid, true, wallRand);

    // Exits
    const exits = [];
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

    // Outdoor biomes use path/gravel exits instead of doors (seamless outdoor transitions)
    const outdoorBiomes: BiomeType[] = ['ESPLANADE', 'GARDEN', 'STREET', 'BRIDGE', 'GATE', 'VILLAGE', 'WATERFALL', 'FOUNTAIN'];
    const isOutdoor = outdoorBiomes.includes(biome);

    // Grand biomes get grand two-tile doors on north/south walls
    const grandBiomes: BiomeType[] = ['GRAND_HALL', 'SALON', 'CONCERT_HALL', 'GALERIE', 'TROCADERO', 'ROTUNDA', 'PANORAMA'];
    const useGrandDoors = grandBiomes.includes(biome);

    // Helper to get directional door tile based on wall direction
    const getDoorTile = (direction: 'N' | 'S' | 'E' | 'W', isGrand: boolean = false) => {
        if (isGrand) {
            switch (direction) {
                case 'N': return TILES.GRAND_DOOR_NORTH;
                case 'S': return TILES.GRAND_DOOR_SOUTH;
                case 'E': return TILES.GRAND_DOOR_EAST;
                case 'W': return TILES.GRAND_DOOR_WEST;
            }
        }
        switch (direction) {
            case 'N': return TILES.DOOR_NORTH;
            case 'S': return TILES.DOOR_SOUTH;
            case 'E': return TILES.DOOR_EAST;
            case 'W': return TILES.DOOR_WEST;
        }
    };

    // Choose appropriate exit tile based on biome
    // GATE biome uses ROAD_PAVER for the central promenade (already placed by generator)
    const exitTile = isOutdoor ? (biome === 'GARDEN' ? TILES.GRAVEL : (biome === 'GATE' ? TILES.ROAD_PAVER : TILES.PATH)) : TILES.DOOR;

    if (biome === 'TOWER_PLATFORM') {
        // No standard exits - only the elevator to descend (handled via interaction)
    } else if (biome === 'TOWER_BASE') {
        // Tower base is completely open on all sides - no walls, no doors
        // Make entire border walkable with path tiles
        for (let x = 1; x < WIDTH - 1; x++) {
            grid[0][x] = TILES.PATH;
            grid[HEIGHT-1][x] = TILES.PATH;
        }
        for (let y = 1; y < HEIGHT - 1; y++) {
            grid[y][0] = TILES.PATH;
            grid[y][WIDTH-1] = TILES.PATH;
        }
        // Corner tiles
        grid[0][0] = TILES.PATH;
        grid[0][WIDTH-1] = TILES.PATH;
        grid[HEIGHT-1][0] = TILES.PATH;
        grid[HEIGHT-1][WIDTH-1] = TILES.PATH;

        // Exits at center of each side
        exits.push({ x: midX, y: 0, targetZoneId: null, direction: 'N' as const });
        exits.push({ x: midX, y: HEIGHT-1, targetZoneId: null, direction: 'S' as const });
        exits.push({ x: WIDTH-1, y: midY, targetZoneId: null, direction: 'E' as const });
        exits.push({ x: 0, y: midY, targetZoneId: null, direction: 'W' as const });
    } else if (biome !== 'TOWER_LEVEL') {
        // Place exits (doors for indoor, paths for outdoor)
        // North exit
        if (isOutdoor) {
            grid[0][midX] = exitTile;
            grid[0][midX - 1] = exitTile;
            grid[0][midX + 1] = exitTile;
            exits.push({ x: midX, y: 0, targetZoneId: null, direction: 'N' as const });
        } else if (useGrandDoors) {
            // Grand doors are 2 tiles wide - place primary door on left, secondary on right
            // The door graphic extends into the right tile visually
            grid[0][midX - 1] = getDoorTile('N', true);
            grid[0][midX] = TILES.GRAND_DOOR_NORTH_2; // Right tile is secondary door (walkable, triggers exit)
            clearAroundDoor(grid, midX - 1, 0, 'N');
            clearAroundDoor(grid, midX, 0, 'N');
            // Register exits for both tiles (both are walkable)
            exits.push({ x: midX - 1, y: 0, targetZoneId: null, direction: 'N' as const });
            exits.push({ x: midX, y: 0, targetZoneId: null, direction: 'N' as const });
        } else {
            grid[0][midX] = getDoorTile('N');
            clearAroundDoor(grid, midX, 0, 'N');
            exits.push({ x: midX, y: 0, targetZoneId: null, direction: 'N' as const });
        }

        // South exit
        if (isOutdoor) {
            grid[HEIGHT-1][midX] = exitTile;
            grid[HEIGHT-1][midX - 1] = exitTile;
            grid[HEIGHT-1][midX + 1] = exitTile;
            exits.push({ x: midX, y: HEIGHT-1, targetZoneId: null, direction: 'S' as const });
        } else if (useGrandDoors) {
            // Grand doors are 2 tiles wide - place primary door on left, secondary on right
            grid[HEIGHT-1][midX - 1] = getDoorTile('S', true);
            grid[HEIGHT-1][midX] = TILES.GRAND_DOOR_SOUTH_2; // Right tile is secondary door (walkable, triggers exit)
            clearAroundDoor(grid, midX - 1, HEIGHT-1, 'S');
            clearAroundDoor(grid, midX, HEIGHT-1, 'S');
            // Register exits for both tiles (both are walkable)
            exits.push({ x: midX - 1, y: HEIGHT-1, targetZoneId: null, direction: 'S' as const });
            exits.push({ x: midX, y: HEIGHT-1, targetZoneId: null, direction: 'S' as const });
        } else {
            grid[HEIGHT-1][midX] = getDoorTile('S');
            clearAroundDoor(grid, midX, HEIGHT-1, 'S');
            exits.push({ x: midX, y: HEIGHT-1, targetZoneId: null, direction: 'S' as const });
        }

        // East exit - grand biomes get grand doors (2 tiles tall, extends DOWN)
        // Door is placed at midY-1 so it covers midY-1 and midY (centered on the map)
        if (isOutdoor) {
            grid[midY][WIDTH-1] = exitTile;
            grid[midY - 1][WIDTH-1] = exitTile;
            grid[midY + 1][WIDTH-1] = exitTile;
        } else if (useGrandDoors) {
            // Grand E/W doors are 2 tiles tall - placed at midY-1, extends to midY
            const doorTopY = midY - 1;
            grid[doorTopY][WIDTH-1] = getDoorTile('E', true); // Top tile with door graphic
            grid[doorTopY + 1][WIDTH-1] = TILES.GRAND_DOOR_EAST_2; // Bottom tile is secondary door (walkable, triggers exit)
            clearAroundDoor(grid, WIDTH-1, doorTopY, 'E');
            clearAroundDoor(grid, WIDTH-1, doorTopY + 1, 'E');
            // Add exits for both tiles
            exits.push({ x: WIDTH-1, y: doorTopY, targetZoneId: null, direction: 'E' as const });
            exits.push({ x: WIDTH-1, y: doorTopY + 1, targetZoneId: null, direction: 'E' as const });
        } else {
            grid[midY][WIDTH-1] = getDoorTile('E');
            clearAroundDoor(grid, WIDTH-1, midY, 'E');
            exits.push({ x: WIDTH-1, y: midY, targetZoneId: null, direction: 'E' as const });
        }

        // West exit - grand biomes get grand doors (2 tiles tall, extends DOWN)
        // Door is placed at midY-1 so it covers midY-1 and midY (centered on the map)
        if (isOutdoor) {
            grid[midY][0] = exitTile;
            grid[midY - 1][0] = exitTile;
            grid[midY + 1][0] = exitTile;
        } else if (useGrandDoors) {
            // Grand E/W doors are 2 tiles tall - placed at midY-1, extends to midY
            const doorTopY = midY - 1;
            grid[doorTopY][0] = getDoorTile('W', true); // Top tile with door graphic
            grid[doorTopY + 1][0] = TILES.GRAND_DOOR_WEST_2; // Bottom tile is secondary door (walkable, triggers exit)
            clearAroundDoor(grid, 0, doorTopY, 'W');
            clearAroundDoor(grid, 0, doorTopY + 1, 'W');
            // Add exits for both tiles
            exits.push({ x: 0, y: doorTopY, targetZoneId: null, direction: 'W' as const });
            exits.push({ x: 0, y: doorTopY + 1, targetZoneId: null, direction: 'W' as const });
        } else {
            grid[midY][0] = getDoorTile('W');
            clearAroundDoor(grid, 0, midY, 'W');
            exits.push({ x: 0, y: midY, targetZoneId: null, direction: 'W' as const });
        }
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
    
    if (biome === 'STREET' && Math.random() < 0.2 && midX + 2 < WIDTH) {
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

    // Check for pre-written narrator description (for fixed historical zones)
    const narratorDescription = ZONE_NARRATIVES[key];

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
        visited: false,
        // Include pre-written narrative if available (skips LLM call)
        ...(narratorDescription && { narratorDescription })
    };
};
