
import { Zone, BiomeType } from '../types';
import { HISTORICAL_LAYOUT } from '../constants';

// Map Configs
const WIDTH = 24;
const HEIGHT = 14;

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
    VOID: 'V',        // Empty sky/danger zone
    RAILING: 'R',     // Iron safety railing
    ELEVATOR: 'e',    // Elevator entrance
    TELESCOPE: 'O',   // Observation telescope
    // Exhibition tiles
    STALL_WALL: 'S',  // Exhibition stall wall (low partition)
    DISPLAY: 'D',     // Display case/artifact
    COLUMN: 'c',      // Decorative column
    CARPET: 'r',      // Ornate carpet/rug
    BANNER: 'B',      // Hanging banner/tapestry
    STATUE: 'u',      // Statue or sculpture
    PLANT: 'q',       // Potted palm or fern (changed from 'p' to avoid collision with PUDDLE)
    LANTERN: 'l',     // Hanging lantern
    // Esplanade tiles
    GRASS: 'g',       // Manicured lawn
    BRICK_WALL: 'W',  // Low brick wall/balustrade
    GRAVEL: 'v',      // Gravel path
    HEDGE: 'H',       // Trimmed hedge
    FLOWERBED: 'w'    // Flowerbed
};

// Helper: Create empty grid
const createGrid = (w: number, h: number, fill: string) => {
    const grid = [];
    for (let y = 0; y < h; y++) {
        grid.push(new Array(w).fill(fill));
    }
    return grid;
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

// 1. Grand Hall (BSP + Aisles)
const generateGrandHall = (grid: string[][]) => {
    // Create main hall floor
    for(let y=1; y<HEIGHT-1; y++) {
        for(let x=1; x<WIDTH-1; x++) {
            grid[y][x] = TILES.FLOOR;
        }
    }

    // Create Aisles of Exhibits
    const aisleWidth = 4;
    for(let x=2; x<WIDTH-2; x+=aisleWidth+1) {
        for(let y=2; y<HEIGHT-2; y+=3) {
             if (Math.random() > 0.2) {
                 // Place Exhibit Cluster
                 grid[y][x] = TILES.EXHIBIT;
                 grid[y][x+1] = TILES.EXHIBIT;
                 
                 if (Math.random() > 0.5) {
                     // Steam Vent nearby
                     grid[y+1][x+2] = TILES.STEAM;
                 }
             }
        }
    }
    
    // Central Path
    const midY = Math.floor(HEIGHT/2);
    for(let x=1; x<WIDTH-1; x++) {
        grid[midY][x] = TILES.FLOOR;
        grid[midY+1][x] = TILES.FLOOR;
    }

    // Lamps on pillars
    for(let x=2; x<WIDTH-2; x+=5) {
        grid[1][x] = TILES.LAMP;
        grid[HEIGHT-2][x] = TILES.LAMP;
    }
};

// 2. Salon / Exhibition Pavilion (Open hall with stalls along sides)
const generateSalon = (grid: string[][]) => {
    // Fill entire floor with ornate tiles
    for(let y=0; y<HEIGHT; y++) {
        for(let x=0; x<WIDTH; x++) {
            // Create a beautiful floor pattern - alternating tiles
            if ((x + y) % 2 === 0) {
                grid[y][x] = TILES.FLOOR;
            } else {
                grid[y][x] = TILES.PATH; // Decorative alternating
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

    // Central ornate carpet runner
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);
    for(let x = 4; x < WIDTH - 4; x++) {
        grid[midY - 1][x] = TILES.CARPET;
        grid[midY][x] = TILES.CARPET;
        grid[midY + 1][x] = TILES.CARPET;
    }

    // Central fountain (3x3)
    grid[midY - 1][midX - 1] = TILES.LANDMARK_FOUNTAIN_EDGE;
    grid[midY - 1][midX] = TILES.LANDMARK_FOUNTAIN_EDGE;
    grid[midY - 1][midX + 1] = TILES.LANDMARK_FOUNTAIN_EDGE;
    grid[midY][midX - 1] = TILES.LANDMARK_FOUNTAIN_EDGE;
    grid[midY][midX] = TILES.LANDMARK_FOUNTAIN_CENTER;
    grid[midY][midX + 1] = TILES.LANDMARK_FOUNTAIN_EDGE;
    grid[midY + 1][midX - 1] = TILES.LANDMARK_FOUNTAIN_EDGE;
    grid[midY + 1][midX] = TILES.LANDMARK_FOUNTAIN_EDGE;
    grid[midY + 1][midX + 1] = TILES.LANDMARK_FOUNTAIN_EDGE;

    // Decorative columns along the sides
    for(let x = 4; x < WIDTH - 4; x += 5) {
        grid[2][x] = TILES.COLUMN;
        grid[HEIGHT - 3][x] = TILES.COLUMN;
    }

    // Exhibition stalls along the top wall (with doorways)
    const stallPositions = [3, 9, 15, 20];
    for(const startX of stallPositions) {
        if (startX + 3 >= WIDTH - 1) continue;

        // Stall back wall (connects to main wall)
        // Left partition
        grid[2][startX] = TILES.STALL_WALL;
        grid[3][startX] = TILES.STALL_WALL;

        // Right partition
        grid[2][startX + 3] = TILES.STALL_WALL;
        grid[3][startX + 3] = TILES.STALL_WALL;

        // Display inside stall
        grid[1][startX + 1] = TILES.DISPLAY;
        grid[1][startX + 2] = TILES.DISPLAY;

        // Doorway is open (floor tile) between partitions
        grid[2][startX + 1] = TILES.FLOOR;
        grid[2][startX + 2] = TILES.FLOOR;
    }

    // Exhibition stalls along the bottom wall
    for(const startX of stallPositions) {
        if (startX + 3 >= WIDTH - 1) continue;

        // Left partition
        grid[HEIGHT - 3][startX] = TILES.STALL_WALL;
        grid[HEIGHT - 4][startX] = TILES.STALL_WALL;

        // Right partition
        grid[HEIGHT - 3][startX + 3] = TILES.STALL_WALL;
        grid[HEIGHT - 4][startX + 3] = TILES.STALL_WALL;

        // Display inside stall
        grid[HEIGHT - 2][startX + 1] = TILES.DISPLAY;
        grid[HEIGHT - 2][startX + 2] = TILES.DISPLAY;

        // Doorway open
        grid[HEIGHT - 3][startX + 1] = TILES.FLOOR;
        grid[HEIGHT - 3][startX + 2] = TILES.FLOOR;
    }

    // Side alcoves with statues and plants
    // Left side
    grid[4][1] = TILES.STATUE;
    grid[4][2] = TILES.PLANT;
    grid[HEIGHT - 5][1] = TILES.PLANT;
    grid[HEIGHT - 5][2] = TILES.STATUE;

    // Right side
    grid[4][WIDTH - 2] = TILES.STATUE;
    grid[4][WIDTH - 3] = TILES.PLANT;
    grid[HEIGHT - 5][WIDTH - 2] = TILES.PLANT;
    grid[HEIGHT - 5][WIDTH - 3] = TILES.STATUE;

    // Hanging lanterns for atmosphere
    grid[3][6] = TILES.LANTERN;
    grid[3][WIDTH - 7] = TILES.LANTERN;
    grid[HEIGHT - 4][6] = TILES.LANTERN;
    grid[HEIGHT - 4][WIDTH - 7] = TILES.LANTERN;

    // Benches near the fountain for visitors
    grid[midY - 3][midX - 2] = TILES.BENCH;
    grid[midY - 3][midX + 2] = TILES.BENCH;
    grid[midY + 3][midX - 2] = TILES.BENCH;
    grid[midY + 3][midX + 2] = TILES.BENCH;

    // Occasional banner/tapestry
    if (Math.random() > 0.5) {
        grid[1][7] = TILES.BANNER;
    }
    if (Math.random() > 0.5) {
        grid[1][WIDTH - 8] = TILES.BANNER;
    }
};

// 3. Garden (Drunkard's Walk + Cellular) - Uses grass tiles
const generateGarden = (grid: string[][]) => {
    // Fill with grass initially (not trees everywhere)
    for(let y=0; y<HEIGHT; y++) {
        for(let x=0; x<WIDTH; x++) {
            grid[y][x] = TILES.GRASS;
        }
    }

    // Scatter trees around the edges and in clusters
    for(let y=0; y<HEIGHT; y++) {
        for(let x=0; x<WIDTH; x++) {
            // Trees along edges
            if (y <= 1 || y >= HEIGHT-2 || x <= 1 || x >= WIDTH-2) {
                if (Math.random() < 0.4) grid[y][x] = TILES.TREE;
            }
            // Random tree clusters in interior
            else if (Math.random() < 0.08) {
                grid[y][x] = TILES.TREE;
            }
        }
    }

    // Create gravel paths using Drunkard's Walk
    let x = Math.floor(WIDTH/2);
    let y = Math.floor(HEIGHT/2);
    const maxSteps = 120;

    for(let i=0; i<maxSteps; i++) {
        if (grid[y][x] !== TILES.TREE) {
            grid[y][x] = TILES.GRAVEL;
        }
        // Widen path slightly
        if (x+1 < WIDTH && grid[y][x+1] !== TILES.TREE) grid[y][x+1] = TILES.GRAVEL;

        const dir = Math.floor(Math.random() * 4);
        if (dir===0 && y>1) y--;
        else if (dir===1 && y<HEIGHT-2) y++;
        else if (dir===2 && x>1) x--;
        else if (dir===3 && x<WIDTH-2) x++;
    }

    // Force main paths clear for exits
    const midX = Math.floor(WIDTH/2);
    const midY = Math.floor(HEIGHT/2);
    for(let i=0; i<HEIGHT; i++) {
        if (grid[i][midX] === TILES.TREE) grid[i][midX] = TILES.GRASS;
        grid[i][midX] = TILES.GRAVEL;
    }
    for(let i=0; i<WIDTH; i++) {
        if (grid[midY][i] === TILES.TREE) grid[midY][i] = TILES.GRASS;
        grid[midY][i] = TILES.GRAVEL;
    }

    // Add flowerbeds along paths
    for(let py=2; py<HEIGHT-2; py++) {
        for(let px=2; px<WIDTH-2; px++) {
            if (grid[py][px] === TILES.GRASS) {
                // Check if adjacent to gravel path
                const nearPath = grid[py-1]?.[px] === TILES.GRAVEL ||
                                 grid[py+1]?.[px] === TILES.GRAVEL ||
                                 grid[py]?.[px-1] === TILES.GRAVEL ||
                                 grid[py]?.[px+1] === TILES.GRAVEL;
                if (nearPath && Math.random() < 0.1) {
                    grid[py][px] = TILES.FLOWERBED;
                }
            }
        }
    }

    // Decorate with benches and lamps along paths
    for(let py=2; py<HEIGHT-2; py++) {
        for(let px=2; px<WIDTH-2; px++) {
            if (grid[py][px] === TILES.GRAVEL) {
                if (Math.random() < 0.02) grid[py][px] = TILES.BENCH;
                else if (Math.random() < 0.015) grid[py][px] = TILES.LAMP;
            }
        }
    }

    // Place Grand Fountain in center
    if (Math.random() < 0.4) {
        const f = [
            [TILES.LANDMARK_FOUNTAIN_EDGE, TILES.LANDMARK_FOUNTAIN_EDGE, TILES.LANDMARK_FOUNTAIN_EDGE],
            [TILES.LANDMARK_FOUNTAIN_EDGE, TILES.LANDMARK_FOUNTAIN_CENTER, TILES.LANDMARK_FOUNTAIN_EDGE],
            [TILES.LANDMARK_FOUNTAIN_EDGE, TILES.LANDMARK_FOUNTAIN_EDGE, TILES.LANDMARK_FOUNTAIN_EDGE]
        ];
        // Place near center
        const fx = midX - 1;
        const fy = midY - 1;
        for(let dy=0; dy<3; dy++) {
            for(let dx=0; dx<3; dx++) {
                grid[fy+dy][fx+dx] = f[dy][dx];
            }
        }
    }
};

// 4. Street (Linear with Sidewalks)
const generateStreet = (grid: string[][]) => {
    // Pave everything with path (cobbles)
    for(let y=0; y<HEIGHT; y++) grid[y].fill(TILES.FLOOR); // Using floor but will render as cobble

    // Sidewalks (Top and Bottom)
    for(let x=0; x<WIDTH; x++) {
        grid[1][x] = TILES.PATH; // Sidewalk
        grid[2][x] = TILES.PATH;
        grid[HEIGHT-2][x] = TILES.PATH;
        grid[HEIGHT-3][x] = TILES.PATH;
        
        // Buildings at very top/bottom
        grid[0][x] = TILES.WALL;
        grid[HEIGHT-1][x] = TILES.WALL;
    }

    // Lamps and Kiosks
    for(let x=4; x<WIDTH-1; x+=6) {
        grid[2][x] = TILES.LAMP;
        grid[HEIGHT-3][x] = TILES.LAMP;
        
        if (Math.random() > 0.5) {
             grid[2][x+1] = TILES.BENCH;
        }
        if (Math.random() > 0.7) {
             grid[HEIGHT-3][x+2] = TILES.NEWSPAPER;
        }
    }
    
    // Kiosk
    if (Math.random() > 0.5) {
        placeStructure(grid, 10, 1, [[TILES.KIOSK, TILES.KIOSK]]);
    }
    
    // Carriages in middle
    if (Math.random() > 0.3) {
        const cy = Math.floor(HEIGHT/2);
        grid[cy][5] = TILES.CARRIAGE;
        grid[cy][6] = TILES.CARRIAGE;
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

// 7. Esplanade (Open grass area with brick walls and gravel paths)
const generateEsplanade = (grid: string[][]) => {
    // Fill with grass
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            grid[y][x] = TILES.GRASS;
        }
    }

    // Low brick walls around perimeter (not completely enclosing - with gaps)
    for (let x = 0; x < WIDTH; x++) {
        if (x < 10 || x > 14) {
            grid[0][x] = TILES.BRICK_WALL;
            grid[HEIGHT - 1][x] = TILES.BRICK_WALL;
        }
    }
    for (let y = 0; y < HEIGHT; y++) {
        if (y < 5 || y > 8) {
            grid[y][0] = TILES.BRICK_WALL;
            grid[y][WIDTH - 1] = TILES.BRICK_WALL;
        }
    }

    // Main gravel path running east-west through center
    const midY = Math.floor(HEIGHT / 2);
    for (let x = 0; x < WIDTH; x++) {
        grid[midY - 1][x] = TILES.GRAVEL;
        grid[midY][x] = TILES.GRAVEL;
    }

    // Secondary path running north-south
    const midX = Math.floor(WIDTH / 2);
    for (let y = 0; y < HEIGHT; y++) {
        grid[y][midX - 1] = TILES.GRAVEL;
        grid[y][midX] = TILES.GRAVEL;
    }

    // Central plaza area (larger gravel square)
    for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -3; dx <= 2; dx++) {
            const nx = midX + dx;
            const ny = midY + dy;
            if (ny >= 0 && ny < HEIGHT && nx >= 0 && nx < WIDTH) {
                grid[ny][nx] = TILES.GRAVEL;
            }
        }
    }

    // Statue in center of plaza
    grid[midY][midX] = TILES.STATUE;

    // Flowerbeds along the paths
    const flowerPositions = [
        { x: midX - 4, y: midY - 2 },
        { x: midX + 3, y: midY - 2 },
        { x: midX - 4, y: midY + 2 },
        { x: midX + 3, y: midY + 2 },
    ];
    for (const pos of flowerPositions) {
        if (pos.y >= 0 && pos.y < HEIGHT && pos.x >= 0 && pos.x < WIDTH) {
            grid[pos.y][pos.x] = TILES.FLOWERBED;
        }
    }

    // Hedges creating garden rooms
    // Left garden room
    for (let y = 2; y < 5; y++) {
        grid[y][5] = TILES.HEDGE;
    }
    grid[2][3] = TILES.HEDGE;
    grid[2][4] = TILES.HEDGE;

    // Right garden room
    for (let y = 2; y < 5; y++) {
        grid[y][WIDTH - 6] = TILES.HEDGE;
    }
    grid[2][WIDTH - 4] = TILES.HEDGE;
    grid[2][WIDTH - 5] = TILES.HEDGE;

    // Bottom hedges
    for (let y = HEIGHT - 5; y < HEIGHT - 2; y++) {
        grid[y][5] = TILES.HEDGE;
        grid[y][WIDTH - 6] = TILES.HEDGE;
    }

    // Trees in corners and along edges
    const treePositions = [
        { x: 2, y: 2 }, { x: WIDTH - 3, y: 2 },
        { x: 2, y: HEIGHT - 3 }, { x: WIDTH - 3, y: HEIGHT - 3 },
        { x: 8, y: 2 }, { x: WIDTH - 9, y: 2 },
        { x: 8, y: HEIGHT - 3 }, { x: WIDTH - 9, y: HEIGHT - 3 },
    ];
    for (const pos of treePositions) {
        if (grid[pos.y][pos.x] === TILES.GRASS) {
            grid[pos.y][pos.x] = TILES.TREE;
        }
    }

    // Benches along paths
    grid[midY - 2][midX - 4] = TILES.BENCH;
    grid[midY - 2][midX + 3] = TILES.BENCH;
    grid[midY + 2][midX - 4] = TILES.BENCH;
    grid[midY + 2][midX + 3] = TILES.BENCH;

    // Lamps along the main path
    grid[midY - 1][4] = TILES.LAMP;
    grid[midY - 1][WIDTH - 5] = TILES.LAMP;
    grid[3][midX - 1] = TILES.LAMP;
    grid[HEIGHT - 4][midX - 1] = TILES.LAMP;
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

    if (biome === 'GRAND_HALL') generateGrandHall(grid);
    else if (biome === 'SALON') generateSalon(grid);
    else if (biome === 'GARDEN') generateGarden(grid);
    else if (biome === 'STREET') generateStreet(grid);
    else if (biome === 'ESPLANADE') generateEsplanade(grid);
    else if (biome === 'TOWER_BASE') generateTowerBase(grid);
    else if (biome === 'TOWER_PLATFORM') generateTowerPlatform(grid);
    else if (biome === 'TOWER_LEVEL') {
        // Legacy support - now using TOWER_BASE
        generateTowerBase(grid);
    }

    // Exits
    const exits = [];
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);

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
        grid[0][midX] = TILES.DOOR;
        exits.push({ x: midX, y: 0, targetZoneId: null, direction: 'N' as const });

        grid[HEIGHT-1][midX] = TILES.DOOR;
        exits.push({ x: midX, y: HEIGHT-1, targetZoneId: null, direction: 'S' as const });

        grid[midY][WIDTH-1] = TILES.DOOR;
        exits.push({ x: WIDTH-1, y: midY, targetZoneId: null, direction: 'E' as const });

        grid[midY][0] = TILES.DOOR;
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
        'ESPLANADE': 'text-emerald-700'
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
