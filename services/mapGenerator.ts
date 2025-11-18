
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
    KIOSK: 'K'
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

// 2. Salon (Rooms + Corridors)
const generateSalon = (grid: string[][]) => {
    // Fill with wall
    // Use a simple recursive division for rooms
    const split = (x:number, y:number, w:number, h:number) => {
        if (w < 6 || h < 6) {
            // Make room
            for(let ry=y+1; ry<y+h-1; ry++) {
                for(let rx=x+1; rx<x+w-1; rx++) {
                    grid[ry][rx] = TILES.FLOOR;
                }
            }
            // Add art/benches
            if (w > 4 && h > 4) {
                grid[y+Math.floor(h/2)][x+Math.floor(w/2)] = TILES.BENCH;
            }
            return;
        }
        
        if (w > h) { // Split vert
            const sx = Math.floor(w/2);
            split(x, y, sx, h);
            split(x+sx, y, w-sx, h);
            // Door
            grid[y+Math.floor(h/2)][x+sx] = TILES.DOOR;
        } else {
            const sy = Math.floor(h/2);
            split(x, y, w, sy);
            split(x, y+sy, w, h-sy);
            // Door
            grid[y+sy][x+Math.floor(w/2)] = TILES.DOOR;
        }
    };
    split(0, 0, WIDTH, HEIGHT);
    
    // Ensure outer walls
    for(let x=0; x<WIDTH; x++) { grid[0][x]=TILES.WALL; grid[HEIGHT-1][x]=TILES.WALL; }
    for(let y=0; y<HEIGHT; y++) { grid[y][0]=TILES.WALL; grid[y][WIDTH-1]=TILES.WALL; }
};

// 3. Garden (Drunkard's Walk + Cellular)
const generateGarden = (grid: string[][]) => {
    // Fill with trees initially
    for(let y=0; y<HEIGHT; y++) grid[y].fill(TILES.TREE);
    
    // Dig paths using Drunkard's Walk to ensure connectivity
    let x = Math.floor(WIDTH/2);
    let y = Math.floor(HEIGHT/2);
    const maxSteps = 150;
    
    for(let i=0; i<maxSteps; i++) {
        grid[y][x] = TILES.FLOOR;
        // Widen path
        if (x+1 < WIDTH) grid[y][x+1] = TILES.FLOOR;
        if (y+1 < HEIGHT) grid[y+1][x] = TILES.FLOOR;

        const dir = Math.floor(Math.random() * 4);
        if (dir===0 && y>1) y--;
        else if (dir===1 && y<HEIGHT-2) y++;
        else if (dir===2 && x>1) x--;
        else if (dir===3 && x<WIDTH-2) x++;
    }
    
    // Force edges clear for exits
    const midX = Math.floor(WIDTH/2);
    const midY = Math.floor(HEIGHT/2);
    for(let i=0; i<HEIGHT; i++) grid[i][midX] = TILES.FLOOR;
    for(let i=0; i<WIDTH; i++) grid[midY][i] = TILES.FLOOR;

    // Decorate
    for(let py=1; py<HEIGHT-1; py++) {
        for(let px=1; px<WIDTH-1; px++) {
            if (grid[py][px] === TILES.FLOOR) {
                if (Math.random() < 0.05) grid[py][px] = TILES.PUDDLE;
                else if (Math.random() < 0.02) grid[py][px] = TILES.BENCH;
            }
        }
    }
    
    // Place Grand Fountain?
    if (Math.random() < 0.3) {
        const f = [
            [TILES.LANDMARK_FOUNTAIN_EDGE, TILES.LANDMARK_FOUNTAIN_EDGE, TILES.LANDMARK_FOUNTAIN_EDGE],
            [TILES.LANDMARK_FOUNTAIN_EDGE, TILES.LANDMARK_FOUNTAIN_CENTER, TILES.LANDMARK_FOUNTAIN_EDGE],
            [TILES.LANDMARK_FOUNTAIN_EDGE, TILES.LANDMARK_FOUNTAIN_EDGE, TILES.LANDMARK_FOUNTAIN_EDGE]
        ];
        // Try 5 times to place
        for(let k=0; k<5; k++) {
            const rx = Math.floor(Math.random() * (WIDTH-4)) + 1;
            const ry = Math.floor(Math.random() * (HEIGHT-4)) + 1;
            if (placeStructure(grid, rx, ry, f)) break;
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
        const noise = Math.sin(gx * 0.5) + Math.cos(gy * 0.5);
        if (noise > 0.5) biome = 'GARDEN';
        else if (noise < -0.5) biome = 'SALON';
        else if (noise > 0.2) biome = 'GRAND_HALL';
        else biome = 'STREET';
        
        const exhibits = ['Machinery', 'Textiles', 'Agriculture', 'Fine Arts', 'Colonies', 'Hygiene', 'Electricity'];
        const nations = ['Bolivia', 'Siam', 'Russia', 'Norway', 'Italy', 'Japan'];
        if (biome === 'SALON') name = `Pavilion of ${nations[Math.abs(gx + gy) % nations.length]}`;
        else if (biome === 'GRAND_HALL') name = `Hall of ${exhibits[Math.abs(gx) % exhibits.length]}`;
        else if (biome === 'GARDEN') name = `Jardins de ${nations[Math.abs(gy) % nations.length]}`;
    }

    if (biome === 'GRAND_HALL') generateGrandHall(grid);
    else if (biome === 'SALON') generateSalon(grid);
    else if (biome === 'GARDEN') generateGarden(grid);
    else if (biome === 'STREET') generateStreet(grid);
    else if (biome === 'TOWER_LEVEL') {
        for(let y=1; y<HEIGHT-1; y++) {
            for(let x=1; x<WIDTH-1; x++) {
                grid[y][x] = TILES.EMPTY;
                if ((x+y)%2===0) grid[y][x] = TILES.FLOOR;
            }
        }
        grid[Math.floor(HEIGHT/2)][Math.floor(WIDTH/2)] = TILES.LANDMARK_TOWER;
    }

    // Exits
    const exits = [];
    const midX = Math.floor(WIDTH / 2);
    const midY = Math.floor(HEIGHT / 2);
    
    if (biome !== 'TOWER_LEVEL') {
        grid[0][midX] = TILES.DOOR;
        exits.push({ x: midX, y: 0, targetZoneId: null, direction: 'N' as const });
        
        grid[HEIGHT-1][midX] = TILES.DOOR;
        exits.push({ x: midX, y: HEIGHT-1, targetZoneId: null, direction: 'S' as const });
        
        grid[midY][WIDTH-1] = TILES.DOOR;
        exits.push({ x: WIDTH-1, y: midY, targetZoneId: null, direction: 'E' as const });
        
        grid[midY][0] = TILES.DOOR;
        exits.push({ x: 0, y: midY, targetZoneId: null, direction: 'W' as const });
    } else {
        grid[midY+2][midX] = 'E'; 
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
        'TOWER_LEVEL': 'text-blue-800'
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
