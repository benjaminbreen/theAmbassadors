
import { ASCII_PARTS } from '../constants';
import { Mood, PortraitConfig, RenderedCell } from '../types';

const WIDTH = 28;
const HEIGHT = 18;

export const createEmptyGrid = (): RenderedCell[][] => {
    const grid: RenderedCell[][] = [];
    for(let y=0; y<HEIGHT; y++) {
        const row = [];
        for(let x=0; x<WIDTH; x++) {
            row.push({ char: ' ', color: 'text-transparent' });
        }
        grid.push(row);
    }
    return grid;
};

export const compositePortrait = (
    config: PortraitConfig, 
    mood: Mood, 
    speaking: boolean, 
    frame: number
): RenderedCell[][] => {
    const grid = createEmptyGrid();

    // Helper to merge layer
    const mergeLayer = (lines: string[], color: string, offsetY: number = 0, offsetX: number = 0) => {
        lines.forEach((line, y) => {
            line.split('').forEach((char, x) => {
                const gy = y + offsetY;
                const gx = x + offsetX;
                if (gy >= 0 && gy < HEIGHT && gx >= 0 && gx < WIDTH && char !== ' ') {
                    grid[gy][gx] = { char, color };
                }
            });
        });
    };

    // 1. Base Face
    mergeLayer(ASCII_PARTS.BASE, config.skinColor);

    // 2. Hair (Top)
    const hair = ASCII_PARTS.HAIR[config.hairStyle] || ASCII_PARTS.HAIR.BALD;
    mergeLayer(hair, config.hairColor, 0, 0);

    // 3. Facial Hair
    if (config.facialHair && config.facialHair !== 'NONE') {
        const beard = ASCII_PARTS.FACIAL_HAIR[config.facialHair];
        mergeLayer([beard], config.hairColor, 13, 4); // Approx mouth/chin level
    }

    // 4. Eyes (Animated)
    let eyeStr = ASCII_PARTS.EYES.NEUTRAL;
    // Reduced blink rate to look more natural
    if (frame % 20 === 0 && Math.random() > 0.5) eyeStr = ASCII_PARTS.EYES.CLOSED; 
    else {
        switch(mood) {
            case 'ANGRY': eyeStr = ASCII_PARTS.EYES.ANGRY; break;
            case 'SAD': eyeStr = ASCII_PARTS.EYES.SAD; break;
            case 'SURPRISED': eyeStr = ASCII_PARTS.EYES.SURPRISED; break;
            case 'SWEATING': eyeStr = ASCII_PARTS.EYES.WIDE; break;
        }
    }
    mergeLayer([eyeStr], config.skinColor, 7, 4);

    // 5. Mouth (Animated)
    let mouthStr = ASCII_PARTS.MOUTHS.NEUTRAL;
    if (speaking) {
        mouthStr = frame % 2 === 0 ? ASCII_PARTS.MOUTHS.TALK_OPEN : ASCII_PARTS.MOUTHS.TALK_CLOSED;
    } else {
        switch(mood) {
            case 'ANGRY': mouthStr = ASCII_PARTS.MOUTHS.FROWN; break;
            case 'SAD': mouthStr = ASCII_PARTS.MOUTHS.FROWN; break;
            case 'SURPRISED': mouthStr = ASCII_PARTS.MOUTHS.TALK_OPEN; break;
        }
    }
    mergeLayer([mouthStr], config.skinColor, 11, 4);

    // 6. Accessories
    if (config.accessory === 'MONOCLE') {
        const acc = ASCII_PARTS.ACCESSORIES.MONOCLE;
        if (acc) {
            grid[acc.y][acc.x] = { char: acc.char, color: 'text-gold-400', bold: true };
        }
    }

    // 7. Sweat Drops
    if (mood === 'SWEATING') {
        if (frame % 3 === 0) grid[4][6] = { char: "'", color: 'text-blue-300', anim: 'animate-ping' };
        if (frame % 3 === 1) grid[4][20] = { char: "'", color: 'text-blue-300', anim: 'animate-ping' };
    }

    return grid;
};
