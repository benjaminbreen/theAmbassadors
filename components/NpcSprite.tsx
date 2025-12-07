
import React, { useEffect, useState, useMemo } from 'react';
import { NPC } from '../types';

interface NpcSpriteProps {
    npc: NPC;
    className?: string;
    direction?: 'N' | 'S' | 'E' | 'W'; // Optional override for facing direction
    isMoving?: boolean; // Whether NPC is currently walking (controls leg animation)
}

// 1889 Paris Exposition - Historically accurate clothing types
type ClothingStyle =
    | 'MORNING_SUIT'      // Formal daywear for gentlemen
    | 'FROCK_COAT'        // Semi-formal men's coat
    | 'SACK_SUIT'         // Business attire
    | 'WORKING_CLASS'     // Simple jacket and trousers
    | 'MILITARY_UNIFORM'  // Generic military
    | 'FRENCH_MILITARY'   // French army uniform (dark blue)
    | 'BRITISH_MILITARY'  // British army uniform (red coat)
    | 'GERMAN_MILITARY'   // Prussian/German uniform (dark green/gray)
    | 'PRIEST_CASSOCK'    // Catholic priest black cassock
    | 'NUN_HABIT'         // Religious sister habit
    | 'BUSTLE_DRESS'      // Women's fashionable dress with bustle
    | 'WALKING_DRESS'     // Women's practical day dress
    | 'SERVANT_DRESS'     // Simple women's working attire
    | 'EXOTIC'            // Colonial/foreign traditional dress
    | 'BOHEMIAN';         // Artistic/unconventional

type HatStyle =
    | 'TOP_HAT'
    | 'BOWLER'
    | 'FLAT_CAP'
    | 'KEPI'              // French military cap
    | 'PICKELHAUBE'       // German spiked helmet
    | 'PITH_HELMET'       // British colonial helmet
    | 'BIRETTA'           // Catholic priest cap
    | 'CORNETTE'          // Nun's headdress
    | 'BONNET'            // Women's bonnet
    | 'WIDE_BRIM'         // Women's fashionable hat
    | 'FEZ'               // Ottoman/North African
    | 'BERET'             // Artist's beret
    | 'NONE';

type FacialHairStyle = 'NONE' | 'PENCIL_MUSTACHE' | 'MUSTACHE' | 'HANDLEBAR' | 'FULL_BEARD' | 'GOATEE' | 'MUTTON_CHOPS' | 'IMPERIAL' | 'STUBBLE';

// Women's hair styles for 1889 - more variety!
type WomensHairStyle =
    | 'UPDO'              // Classic Gibson Girl-style updo
    | 'LONG_CURLS'        // Long curled hair down shoulders
    | 'CHIGNON'           // Low bun at nape
    | 'POMPADOUR'         // High volume on top
    | 'BRAIDED'           // Braided and pinned
    | 'LOOSE_WAVES';      // Bohemian loose waves

// Map appearance profile clothing to sprite clothing
const mapAppearanceToSpriteClothing = (clothingStyle?: string): ClothingStyle => {
    if (!clothingStyle) return 'SACK_SUIT';
    switch (clothingStyle) {
        case 'formal_suit': return 'SACK_SUIT';
        case 'morning_coat': return 'MORNING_SUIT';
        case 'military': return 'MILITARY_UNIFORM';
        case 'french_military': return 'FRENCH_MILITARY';
        case 'british_military': return 'BRITISH_MILITARY';
        case 'german_military': return 'GERMAN_MILITARY';
        case 'priest_cassock': return 'PRIEST_CASSOCK';
        case 'nun_habit': return 'NUN_HABIT';
        case 'working_class': return 'WORKING_CLASS';
        case 'bohemian': return 'BOHEMIAN';
        case 'exotic_male': return 'EXOTIC';
        case 'bustle_dress': return 'BUSTLE_DRESS';
        case 'walking_dress': return 'WALKING_DRESS';
        case 'servant_dress': return 'SERVANT_DRESS';
        case 'exotic_female': return 'EXOTIC';
        default: return 'SACK_SUIT';
    }
};

const mapAppearanceToSpriteHat = (hat?: string): HatStyle => {
    if (!hat) return 'BOWLER';
    switch (hat) {
        case 'top_hat': return 'TOP_HAT';
        case 'bowler': return 'BOWLER';
        case 'flat_cap': return 'FLAT_CAP';
        case 'kepi': return 'KEPI';
        case 'pickelhaube': return 'PICKELHAUBE';
        case 'pith_helmet': return 'PITH_HELMET';
        case 'biretta': return 'BIRETTA';
        case 'cornette': return 'CORNETTE';
        case 'bonnet': return 'BONNET';
        case 'wide_brim': return 'WIDE_BRIM';
        case 'fez': return 'FEZ';
        case 'turban': return 'FEZ'; // Use fez as fallback
        case 'beret': return 'BERET';
        case 'none': return 'NONE';
        default: return 'BOWLER';
    }
};

const mapAppearanceToSpriteFacialHair = (facialHair?: string): FacialHairStyle => {
    if (!facialHair || facialHair === 'none') return 'NONE';
    switch (facialHair) {
        case 'mustache': return 'PENCIL_MUSTACHE'; // Portrait mustache is thin/refined
        case 'handlebar': return 'HANDLEBAR';
        case 'full_beard': return 'FULL_BEARD';
        case 'goatee': return 'GOATEE';
        case 'stubble': return 'STUBBLE';
        case 'mutton_chops': return 'MUTTON_CHOPS';
        case 'imperial': return 'IMPERIAL';
        case 'henry_goatee': return 'GOATEE';
        default: return 'NONE';
    }
};

// Determine women's hair style based on NPC
const determineWomensHairStyle = (npc: NPC): WomensHairStyle => {
    const hash = npc.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const prof = npc.profession.toLowerCase();

    // Profession-based hair preferences
    if (prof.includes('actress') || prof.includes('dancer') || prof.includes('courtesan')) {
        const styles: WomensHairStyle[] = ['LONG_CURLS', 'LOOSE_WAVES', 'POMPADOUR'];
        return styles[hash % styles.length];
    }
    if (prof.includes('servant') || prof.includes('maid') || prof.includes('governess')) {
        const styles: WomensHairStyle[] = ['CHIGNON', 'BRAIDED', 'UPDO'];
        return styles[hash % styles.length];
    }
    if (prof.includes('artist') || prof.includes('bohemian')) {
        const styles: WomensHairStyle[] = ['LOOSE_WAVES', 'LONG_CURLS', 'POMPADOUR'];
        return styles[hash % styles.length];
    }

    // Default - distribute evenly with slight bias toward long hair
    const allStyles: WomensHairStyle[] = ['UPDO', 'LONG_CURLS', 'CHIGNON', 'POMPADOUR', 'BRAIDED', 'LOOSE_WAVES', 'LONG_CURLS', 'LOOSE_WAVES'];
    return allStyles[hash % allStyles.length];
};

// Procedurally determine clothing based on NPC properties
const determineClothing = (npc: NPC): { style: ClothingStyle; hat: HatStyle; facialHair: FacialHairStyle; womensHair: WomensHairStyle } => {
    const womensHair = determineWomensHairStyle(npc);

    // If NPC has appearance profile, use it directly for consistency
    if (npc.appearance) {
        return {
            style: mapAppearanceToSpriteClothing(npc.appearance.clothingStyle),
            hat: mapAppearanceToSpriteHat(npc.appearance.hat),
            facialHair: mapAppearanceToSpriteFacialHair(npc.appearance.facialHair),
            womensHair
        };
    }

    const prof = npc.profession.toLowerCase();
    const gender = npc.gender;

    // Determine clothing style based on profession
    let style: ClothingStyle = 'SACK_SUIT';
    let hat: HatStyle = 'BOWLER';
    let facialHair: FacialHairStyle = 'MUSTACHE';

    if (gender === 'female') {
        facialHair = 'NONE';

        // Nuns - religious sisters (be careful with 'sister' to avoid false positives)
        if (prof.includes('nun') || prof.includes('soeur') || prof.includes('religious sister') ||
            (prof.includes('sister') && (prof.includes('charity') || prof.includes('mercy') || prof.includes('order')))) {
            style = 'NUN_HABIT';
            hat = 'CORNETTE';
        } else if (prof.includes('servant') || prof.includes('maid') || prof.includes('worker')) {
            style = 'SERVANT_DRESS';
            hat = 'BONNET';
        } else if (prof.includes('artist') || prof.includes('bohemian') || prof.includes('actress')) {
            style = 'BOHEMIAN';
            hat = 'WIDE_BRIM';
        } else {
            style = 'BUSTLE_DRESS';
            hat = Math.random() > 0.5 ? 'WIDE_BRIM' : 'BONNET';
        }
    } else {
        // Male clothing
        // Priests - Catholic clergy
        if (prof.includes('priest') || prof.includes('père') || prof.includes('abbé') || prof.includes('clergy') || prof.includes('monsignor') || (prof.includes('father') && !prof.includes('grandfather'))) {
            style = 'PRIEST_CASSOCK';
            hat = 'BIRETTA';
        // French military - dark blue uniforms
        } else if (prof.includes('french') && (prof.includes('military') || prof.includes('soldier') || prof.includes('officer'))) {
            style = 'FRENCH_MILITARY';
            hat = 'KEPI';
            facialHair = Math.random() > 0.3 ? 'MUSTACHE' : 'IMPERIAL';
        // British military - red coats
        } else if (prof.includes('british') && (prof.includes('military') || prof.includes('soldier') || prof.includes('officer'))) {
            style = 'BRITISH_MILITARY';
            hat = 'PITH_HELMET';
            facialHair = Math.random() > 0.2 ? 'MUSTACHE' : 'MUTTON_CHOPS';
        // German/Prussian military - spiked helmets
        } else if ((prof.includes('german') || prof.includes('prussian')) && (prof.includes('military') || prof.includes('soldier') || prof.includes('officer'))) {
            style = 'GERMAN_MILITARY';
            hat = 'PICKELHAUBE';
            facialHair = Math.random() > 0.3 ? 'MUSTACHE' : 'IMPERIAL';
        // Gendarme - French police (use French military style)
        } else if (prof.includes('gendarme') || prof.includes('police')) {
            style = 'FRENCH_MILITARY';
            hat = 'KEPI';
            facialHair = Math.random() > 0.3 ? 'MUSTACHE' : 'NONE';
        // Generic military (default to French since we're in Paris)
        } else if (prof.includes('military') || prof.includes('soldier') || prof.includes('officer') || prof.includes('guard')) {
            style = 'FRENCH_MILITARY';
            hat = 'KEPI';
            facialHair = Math.random() > 0.3 ? 'MUSTACHE' : 'IMPERIAL';
        } else if (prof.includes('worker') || prof.includes('laborer') || prof.includes('mechanic') || prof.includes('porter')) {
            style = 'WORKING_CLASS';
            hat = 'FLAT_CAP';
            facialHair = Math.random() > 0.5 ? 'MUSTACHE' : 'NONE';
        } else if (prof.includes('artist') || prof.includes('painter') || prof.includes('poet') || prof.includes('bohemian')) {
            style = 'BOHEMIAN';
            hat = 'BERET';
            facialHair = Math.random() > 0.4 ? 'GOATEE' : 'MUSTACHE';
        } else if (prof.includes('diplomat') || prof.includes('ambassador') || prof.includes('aristocrat') || prof.includes('count')) {
            style = 'MORNING_SUIT';
            hat = 'TOP_HAT';
            facialHair = Math.random() > 0.3 ? 'MUTTON_CHOPS' : 'MUSTACHE';
        } else if (prof.includes('merchant') || prof.includes('egyptian') || prof.includes('turkish') || prof.includes('arab')) {
            style = 'EXOTIC';
            hat = 'FEZ';
            facialHair = 'FULL_BEARD';
        } else if (prof.includes('professor') || prof.includes('scientist') || prof.includes('doctor')) {
            style = 'FROCK_COAT';
            hat = 'TOP_HAT';
            facialHair = Math.random() > 0.5 ? 'FULL_BEARD' : 'MUTTON_CHOPS';
        } else {
            // Default gentleman
            style = 'SACK_SUIT';
            hat = Math.random() > 0.5 ? 'BOWLER' : 'TOP_HAT';
            facialHair = Math.random() > 0.3 ? 'MUSTACHE' : 'NONE';
        }
    }

    return { style, hat, facialHair, womensHair };
};

// Generate deterministic random based on NPC id for consistency
const seededRandom = (seed: string, index: number = 0): number => {
    let hash = 0;
    const str = seed + index.toString();
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash % 100) / 100;
};

const NpcSprite: React.FC<NpcSpriteProps> = ({ npc, className, direction, isMoving = false }) => {
    const [frame, setFrame] = useState(0);
    const [breathFrame, setBreathFrame] = useState(0);
    const dir = direction || npc.location.direction; // Use override if provided

    useEffect(() => {
        // Walking animation - fast when moving
        if (isMoving) {
            const interval = setInterval(() => setFrame(f => f + 1), 150);
            return () => clearInterval(interval);
        }
    }, [isMoving]);

    useEffect(() => {
        // Breathing/idle animation - slow, always runs
        // Using 900ms interval for better performance (was 400ms)
        const breathInterval = setInterval(() => setBreathFrame(f => f + 1), 900);
        return () => clearInterval(breathInterval);
    }, []);

    // Memoize clothing determination for consistency
    const clothing = useMemo(() => determineClothing(npc), [npc.id, npc.profession, npc.gender, npc.appearance]);

    // Use seeded random for consistent appearance
    const colorVariation = useMemo(() => seededRandom(npc.id, 1), [npc.id]);

    // Walking animation - only apply when moving
    const legOffset = isMoving ? Math.sin(frame * 0.5) * 4 : 0;
    const armSwing = isMoving ? Math.sin(frame * 0.5) * 6 : 0;
    const bounce = isMoving ? Math.abs(Math.sin(frame * 0.5)) * 1 : 0;

    // Breathing/idle animation - subtle movement when stationary
    const breathScale = isMoving ? 0 : Math.sin(breathFrame * 0.3) * 0.5; // Subtle chest rise
    const idleSway = isMoving ? 0 : Math.sin(breathFrame * 0.15) * 1.5; // Very subtle side sway
    const headTilt = isMoving ? 0 : Math.sin(breathFrame * 0.1) * 0.8; // Occasional slight head movement

    // Enhanced color palette based on NPC colors with variation
    // Using same SKIN_COLORS structure as Portrait.tsx for consistency
    const colors = useMemo(() => {
        const primary = npc.colors.primary;
        const secondary = npc.colors.secondary;
        const skin = npc.colors.skin;
        const hair = npc.colors.hair;

        // Portrait-matching skin colors by skin tone
        // These match Portrait.tsx SKIN_COLORS exactly
        const SKIN_COLORS: Record<string, { shadow: string; highlight: string; blush: string }> = {
            '#fff5ee': { shadow: '#e8d0c0', highlight: '#ffffff', blush: '#ffb0b0' }, // fair
            '#fcece3': { shadow: '#e0c0a8', highlight: '#fff9f5', blush: '#f0a0a0' }, // pale
            '#e6b996': { shadow: '#bd8e6c', highlight: '#f5d5bc', blush: '#d69076' }, // tan
            '#dccba0': { shadow: '#ae9b72', highlight: '#efe6ce', blush: '#c4aa82' }, // olive
            '#d4a574': { shadow: '#b08050', highlight: '#e8c090', blush: '#c89070' }, // golden
            '#a67c52': { shadow: '#7d5a3a', highlight: '#c49a70', blush: '#9a6a45' }, // warm_brown
            '#8d5524': { shadow: '#5e3615', highlight: '#af7441', blush: '#a36330' }, // dark
            '#5c3d2e': { shadow: '#3d281e', highlight: '#7a5040', blush: '#6a4535' }, // deep
        };

        // Get portrait-matching colors or fallback to calculated
        const skinColors = SKIN_COLORS[skin.toLowerCase()];

        // Darken/lighten functions (fallback)
        const adjustColor = (hex: string, amount: number): string => {
            const num = parseInt(hex.replace('#', ''), 16);
            const r = Math.min(255, Math.max(0, (num >> 16) + amount));
            const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
            const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
            return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
        };

        // Create blush color (add red warmth) - fallback if not in lookup
        const createBlush = (hex: string): string => {
            const num = parseInt(hex.replace('#', ''), 16);
            const r = Math.min(255, (num >> 16) + 30);
            const g = Math.max(0, ((num >> 8) & 0x00FF) - 20);
            const b = Math.max(0, (num & 0x0000FF) - 20);
            return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
        };

        return {
            skin,
            skinShadow: skinColors?.shadow || adjustColor(skin, -30),
            skinHighlight: skinColors?.highlight || adjustColor(skin, 20),
            skinBlush: skinColors?.blush || createBlush(skin),
            hair,
            hairHighlight: adjustColor(hair, 20),
            primary,
            primaryDark: adjustColor(primary, -40),
            primaryLight: adjustColor(primary, 30),
            secondary,
            secondaryDark: adjustColor(secondary, -30),
            white: '#f5f5f0',
            gold: '#d4af37',
            brass: '#b5a642',
        };
    }, [npc.colors]);

    // Render based on direction
    const renderSprite = () => {
        const isFemale = npc.gender === 'female';
        const { style, hat, facialHair, womensHair } = clothing;

        // Helper to get sleeve color based on uniform type
        const getSleeveColor = (): string => {
            switch (style) {
                case 'PRIEST_CASSOCK': return '#1a1a1a';
                case 'NUN_HABIT': return '#1a1a1a';
                case 'FRENCH_MILITARY': return '#1a3a5c';
                case 'BRITISH_MILITARY': return '#c41e3a';
                case 'GERMAN_MILITARY': return '#2a3d2a';
                default: return colors.primary;
            }
        };
        const sleeveColor = getSleeveColor();

        // Helper to get body/torso color based on uniform type - for consistent uniform rendering
        const getBodyColor = (): { main: string; dark: string; light: string } => {
            switch (style) {
                case 'PRIEST_CASSOCK':
                    return { main: '#1a1a1a', dark: '#0a0a0a', light: '#2a2a2a' };
                case 'NUN_HABIT':
                    return { main: '#1a1a1a', dark: '#0a0a0a', light: '#2a2a2a' };
                case 'FRENCH_MILITARY':
                    return { main: '#1a3a5c', dark: '#0f2540', light: '#2a4a6c' };
                case 'BRITISH_MILITARY':
                    return { main: '#c41e3a', dark: '#a01530', light: '#d42e4a' };
                case 'GERMAN_MILITARY':
                    return { main: '#2a3d2a', dark: '#1a2d1a', light: '#3a4d3a' };
                case 'MILITARY_UNIFORM':
                    return { main: '#1a3a5c', dark: '#0f2540', light: '#2a4a6c' }; // Default to French style
                default:
                    return { main: colors.primary, dark: colors.primaryDark, light: colors.primaryLight };
            }
        };
        const bodyColor = getBodyColor();

        // Helper to get consistent hat colors that match portrait system
        const getHatColors = (): { main: string; dark: string; band?: string } => {
            switch (hat) {
                case 'TOP_HAT':
                    return { main: '#1a1a1a', dark: '#0a0a0a' }; // Black silk
                case 'BOWLER':
                    return { main: '#2a2a2a', dark: '#1a1a1a' }; // Dark charcoal
                case 'KEPI':
                    return { main: '#1e3a5f', dark: '#0f2540', band: colors.gold }; // Navy blue military
                case 'FLAT_CAP':
                    return { main: '#4a3a2a', dark: '#3a2a1a' }; // Brown tweed
                case 'BONNET':
                    return { main: colors.secondary, dark: colors.secondaryDark }; // Match dress
                case 'WIDE_BRIM':
                    return { main: '#5a4a3a', dark: '#4a3a2a' }; // Brown/tan
                case 'BERET':
                    return { main: '#2a2a3a', dark: '#1a1a2a' }; // Dark blue/black
                case 'PICKELHAUBE':
                    return { main: '#2a3d2a', dark: '#1a2d1a' }; // German green
                case 'PITH_HELMET':
                    return { main: '#e8dcc8', dark: '#c4a77d' }; // Khaki
                default:
                    return { main: colors.secondary, dark: colors.secondaryDark };
            }
        };
        const hatColors = getHatColors();

        // Helper to render women's hair - BACK LAYER (behind head)
        const renderWomensHairBack = () => {
            if (!isFemale) return null;

            switch (womensHair) {
                case 'LONG_CURLS':
                    // Long curly hair - shoulder blade length (y=6 to y=16), joined in middle
                    return (
                        <g>
                            {/* Main hair mass - joined at top, flowing down */}
                            <path d="M12 6 Q10 8 10 10 Q9 13 10 16 L13 15 Q14 12 14 9" fill={colors.hair} />
                            <path d="M20 6 Q22 8 22 10 Q23 13 22 16 L19 15 Q18 12 18 9" fill={colors.hair} />
                            {/* Center back portion connecting the sides */}
                            <path d="M14 8 Q16 10 18 8 L18 14 Q16 16 14 14 Z" fill={colors.hair} />
                            {/* Curl highlights */}
                            <path d="M11 9 Q10 12 11 15" stroke={colors.hairHighlight} strokeWidth="0.8" fill="none" />
                            <path d="M21 9 Q22 12 21 15" stroke={colors.hairHighlight} strokeWidth="0.8" fill="none" />
                        </g>
                    );
                case 'LOOSE_WAVES':
                    // Wavy hair - shoulder blade length (y=6 to y=15), joined in middle
                    return (
                        <g>
                            {/* Main hair mass - connected, not separate ponytails */}
                            <path d="M12 6 Q10 8 11 11 Q10 13 11 15 L14 14 Q13 11 14 8" fill={colors.hair} />
                            <path d="M20 6 Q22 8 21 11 Q22 13 21 15 L18 14 Q19 11 18 8" fill={colors.hair} />
                            {/* Center back portion */}
                            <path d="M14 7 Q16 9 18 7 L18 13 Q16 15 14 13 Z" fill={colors.hair} />
                        </g>
                    );
                case 'CHIGNON':
                    // Low bun at nape - render the bun behind neck
                    return (
                        <ellipse cx="16" cy="10" rx="3" ry="2.5" fill={colors.hair} />
                    );
                default:
                    return null;
            }
        };

        // Helper to render women's hair - FRONT LAYER (on top of head, but NOT covering face)
        // Uses hair gradient for more realistic look
        const renderWomensHairFront = () => {
            if (!isFemale) return null;
            // Note: hair gradient is defined in defs as `hair-${npc.id}`

            switch (womensHair) {
                case 'UPDO':
                    // Classic Gibson Girl updo - hair piled on top, NOT covering forehead
                    return (
                        <g>
                            <ellipse cx="16" cy="2" rx="4" ry="2.5" fill={colors.hair} />
                            <ellipse cx="15" cy="1.5" rx="2" ry="1.5" fill={colors.hairHighlight} opacity="0.3" />
                            <path d="M12 4 Q16 3 20 4" fill={colors.hair} />
                            {/* Hair texture */}
                            <path d="M14 2 Q15 1 16 2" stroke={colors.hairHighlight} strokeWidth="0.3" fill="none" opacity="0.5" />
                            <path d="M16 1.5 Q17 1 18 1.8" stroke={colors.hairHighlight} strokeWidth="0.3" fill="none" opacity="0.5" />
                        </g>
                    );
                case 'LONG_CURLS':
                    // Front portion - just the top of head, NOT the forehead
                    return (
                        <g>
                            <path d="M12 4 Q16 2 20 4 L20 5 Q16 4 12 5 Z" fill={colors.hair} />
                            {/* Side curls framing face - in front of ears but NOT on face */}
                            <path d="M11 5 Q10 7 11 9" stroke={colors.hair} strokeWidth="1.8" fill="none" />
                            <path d="M21 5 Q22 7 21 9" stroke={colors.hair} strokeWidth="1.8" fill="none" />
                            {/* Curl highlights */}
                            <path d="M10.5 6 Q10 7 10.8 8" stroke={colors.hairHighlight} strokeWidth="0.4" fill="none" opacity="0.5" />
                            <path d="M21.5 6 Q22 7 21.2 8" stroke={colors.hairHighlight} strokeWidth="0.4" fill="none" opacity="0.5" />
                            {/* Top highlight */}
                            <path d="M14 3 Q16 2.5 18 3" stroke={colors.hairHighlight} strokeWidth="0.3" fill="none" opacity="0.5" />
                        </g>
                    );
                case 'CHIGNON':
                    // Hair swept back - just top portion
                    return (
                        <g>
                            <path d="M12 4 Q16 2 20 4 Q20 5 16 5 Q12 5 12 4" fill={colors.hair} />
                            <path d="M14 3 Q16 2.5 18 3" stroke={colors.hairHighlight} strokeWidth="0.3" fill="none" opacity="0.5" />
                        </g>
                    );
                case 'POMPADOUR':
                    // High volume on top - fashionable 1889 style
                    return (
                        <g>
                            <ellipse cx="16" cy="1.5" rx="4.5" ry="3" fill={colors.hair} />
                            <path d="M12 4 Q16 3 20 4" fill={colors.hair} />
                            <ellipse cx="15" cy="1" rx="2.5" ry="1.8" fill={colors.hairHighlight} opacity="0.25" />
                            {/* Hair wave texture */}
                            <path d="M13 1 Q14 0 15 1" stroke={colors.hairHighlight} strokeWidth="0.3" fill="none" opacity="0.4" />
                            <path d="M15 0.5 Q16.5 0 18 0.8" stroke={colors.hairHighlight} strokeWidth="0.3" fill="none" opacity="0.4" />
                        </g>
                    );
                case 'BRAIDED':
                    // Braided hair pinned up
                    return (
                        <g>
                            <path d="M12 4 Q16 2 20 4 L19 5 Q16 4 13 5 Z" fill={colors.hair} />
                            <ellipse cx="16" cy="2" rx="3" ry="1.5" fill={colors.hair} />
                            {/* Braid details - more visible */}
                            <path d="M14 1.5 L15 2.5 L16 1.5 L17 2.5 L18 1.5" stroke={colors.hairHighlight} strokeWidth="0.5" fill="none" opacity="0.6" />
                            <path d="M14.5 2 L15.5 3 L16.5 2 L17.5 3" stroke={colors.hair} strokeWidth="0.3" fill="none" />
                        </g>
                    );
                case 'LOOSE_WAVES':
                    // Top portion with waves
                    return (
                        <g>
                            <path d="M11 4 Q13 2 16 2 Q19 2 21 4 Q20 5 16 5 Q12 5 11 4" fill={colors.hair} />
                            {/* Framing waves */}
                            <path d="M11 5 Q10 6 11 8" stroke={colors.hair} strokeWidth="1.5" fill="none" />
                            <path d="M21 5 Q22 6 21 8" stroke={colors.hair} strokeWidth="1.5" fill="none" />
                            {/* Highlights */}
                            <path d="M13 3 Q15 2 17 3" stroke={colors.hairHighlight} strokeWidth="0.3" fill="none" opacity="0.5" />
                            <path d="M10.5 6 Q10 7 10.8 8" stroke={colors.hairHighlight} strokeWidth="0.3" fill="none" opacity="0.4" />
                        </g>
                    );
                default:
                    return (
                        <g>
                            <path d="M11.5 4 Q16 2 20.5 4 Q20 5 19 5 L13 5 Q12 5 11.5 4" fill={colors.hair} />
                            <path d="M14 3 Q16 2.5 18 3" stroke={colors.hairHighlight} strokeWidth="0.3" fill="none" opacity="0.5" />
                        </g>
                    );
            }
        };

        // South-facing (front view)
        if (dir === 'S') {
            return (
                <svg viewBox="0 0 32 40" className="w-10 h-12 overflow-visible">
                    <defs>
                        <linearGradient id={`coat-${npc.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={colors.primaryLight} />
                            <stop offset="50%" stopColor={colors.primary} />
                            <stop offset="100%" stopColor={colors.primaryLight} />
                        </linearGradient>
                        <linearGradient id={`dress-${npc.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={colors.primaryLight} />
                            <stop offset="30%" stopColor={colors.primary} />
                            <stop offset="70%" stopColor={colors.primary} />
                            <stop offset="100%" stopColor={colors.primaryDark} />
                        </linearGradient>
                        {/* Face shading gradient - light from upper left */}
                        <radialGradient id={`face-${npc.id}`} cx="35%" cy="30%" r="70%">
                            <stop offset="0%" stopColor={colors.skinHighlight} />
                            <stop offset="60%" stopColor={colors.skin} />
                            <stop offset="100%" stopColor={colors.skinShadow} />
                        </radialGradient>
                        {/* Hair highlight */}
                        <linearGradient id={`hair-${npc.id}`} x1="20%" y1="0%" x2="80%" y2="100%">
                            <stop offset="0%" stopColor={colors.hairHighlight} />
                            <stop offset="50%" stopColor={colors.hair} />
                            <stop offset="100%" stopColor={colors.hair} />
                        </linearGradient>
                    </defs>

                    {/* Shadow */}
                    <ellipse cx="16" cy="38" rx="7" ry="2" fill="rgba(0,0,0,0.15)" />

                    {/* === BACK HAIR LAYER (behind body) === */}
                    {renderWomensHairBack()}

                    {/* Legs/Skirt */}
                    {isFemale && (style === 'BUSTLE_DRESS' || style === 'WALKING_DRESS' || style === 'SERVANT_DRESS') ? (
                        // Victorian dress with bustle silhouette
                        <g>
                            {/* Main skirt - proper bell/A-line shape */}
                            <path d={`M11 24 Q8 28 7 36 L25 36 Q24 28 21 24 Z`}
                                  fill={`url(#dress-${npc.id})`} />
                            {/* Bustle effect - prominent Victorian feature */}
                            <ellipse cx="19" cy="25" rx="2.5" ry="2" fill={colors.primaryDark} />
                            {/* Skirt folds - natural draping */}
                            <path d="M11 25 Q9 30 8 35" stroke={colors.primaryDark} strokeWidth="0.4" fill="none" opacity="0.7" />
                            <path d="M14 24 Q13 29 12 35" stroke={colors.primaryDark} strokeWidth="0.3" fill="none" opacity="0.5" />
                            <path d="M18 24 Q19 29 20 35" stroke={colors.primaryDark} strokeWidth="0.3" fill="none" opacity="0.5" />
                            <path d="M21 25 Q23 30 24 35" stroke={colors.primaryDark} strokeWidth="0.4" fill="none" opacity="0.7" />
                            {/* Hem with slight ruffle */}
                            <path d="M7 35.5 Q12 36.5 16 35.5 Q20 36.5 25 35.5" stroke={colors.primaryDark} strokeWidth="0.6" fill="none" />
                            {/* Victorian ladies' boots peeking out - pointed toe */}
                            <path d="M10 36 Q10.5 37.5 12 37.5 Q13.5 37.5 14 36" fill="#1a0a05" />
                            <path d="M11 36.8 Q12 36.5 13 36.8" stroke="#3a2515" strokeWidth="0.2" fill="none" />
                            <path d="M18 36 Q18.5 37.5 20 37.5 Q21.5 37.5 22 36" fill="#1a0a05" />
                            <path d="M19 36.8 Q20 36.5 21 36.8" stroke="#3a2515" strokeWidth="0.2" fill="none" />
                        </g>
                    ) : style === 'NUN_HABIT' ? (
                        // Nun's long habit/skirt
                        <g>
                            <path d={`M10 24 Q8 30 8 36 L24 36 Q24 30 22 24 Z`} fill="#1a1a1a" />
                            {/* Habit folds */}
                            <path d="M12 25 Q11 30 10 35" stroke="#0a0a0a" strokeWidth="0.5" fill="none" />
                            <path d="M16 24 Q16 30 16 35" stroke="#0a0a0a" strokeWidth="0.5" fill="none" />
                            <path d="M20 25 Q21 30 22 35" stroke="#0a0a0a" strokeWidth="0.5" fill="none" />
                        </g>
                    ) : (
                        // Trousers and shoes - Victorian gentleman style
                        <>
                            {/* Left trouser leg - tapers from thigh to ankle */}
                            <path d={`M10 26 Q9.5 28 9.5 31 L${10 - legOffset * 0.3} 34 L${10.5 - legOffset * 0.3} 35.5 L${13.5 - legOffset * 0.3} 35.5 L${14 - legOffset * 0.3} 34 Q14.5 31 14.5 28 L15 26 Z`}
                                  fill={style === 'PRIEST_CASSOCK' ? '#1a1a1a' : colors.secondary} />
                            {/* Right trouser leg */}
                            <path d={`M17 26 Q17.5 28 17.5 31 L${18 + legOffset * 0.3} 34 L${18.5 + legOffset * 0.3} 35.5 L${21.5 + legOffset * 0.3} 35.5 L${22 + legOffset * 0.3} 34 Q22.5 31 22.5 28 L22 26 Z`}
                                  fill={style === 'PRIEST_CASSOCK' ? '#1a1a1a' : colors.secondary} />
                            {/* Left shoe - Victorian lace-up boot */}
                            <path d={`M${9.5 - legOffset * 0.3} 35 L${9 - legOffset * 0.3} 36 Q${8.5 - legOffset * 0.3} 37.5 ${10 - legOffset * 0.3} 38 L${14 - legOffset * 0.3} 38 Q${15 - legOffset * 0.3} 37.5 ${14.5 - legOffset * 0.3} 36 L${14 - legOffset * 0.3} 35 Z`}
                                  fill="#1a0a05" />
                            {/* Left shoe highlight */}
                            <path d={`M${10 - legOffset * 0.3} 36.5 Q${12 - legOffset * 0.3} 36 ${14 - legOffset * 0.3} 36.5`}
                                  stroke="#3a2515" strokeWidth="0.4" fill="none" />
                            {/* Right shoe - Victorian lace-up boot */}
                            <path d={`M${17.5 + legOffset * 0.3} 35 L${17 + legOffset * 0.3} 36 Q${16.5 + legOffset * 0.3} 37.5 ${18 + legOffset * 0.3} 38 L${22 + legOffset * 0.3} 38 Q${23 + legOffset * 0.3} 37.5 ${22.5 + legOffset * 0.3} 36 L${22 + legOffset * 0.3} 35 Z`}
                                  fill="#1a0a05" />
                            {/* Right shoe highlight */}
                            <path d={`M${18 + legOffset * 0.3} 36.5 Q${20 + legOffset * 0.3} 36 ${22 + legOffset * 0.3} 36.5`}
                                  stroke="#3a2515" strokeWidth="0.4" fill="none" />
                        </>
                    )}

                    {/* Body/Clothing */}
                    {style === 'PRIEST_CASSOCK' ? (
                        // Catholic priest cassock - long black robe with buttons
                        <>
                            <path d="M9 10 Q9 9 16 9 Q23 9 23 10 L23 26 L9 26 Z" fill="#1a1a1a" />
                            {/* Row of buttons down center */}
                            <circle cx="16" cy="12" r="0.5" fill="#2a2a2a" />
                            <circle cx="16" cy="15" r="0.5" fill="#2a2a2a" />
                            <circle cx="16" cy="18" r="0.5" fill="#2a2a2a" />
                            <circle cx="16" cy="21" r="0.5" fill="#2a2a2a" />
                            <circle cx="16" cy="24" r="0.5" fill="#2a2a2a" />
                            {/* White Roman collar */}
                            <rect x="14" y="9.5" width="4" height="1.5" fill={colors.white} />
                            <path d="M14 10 Q16 9 18 10" stroke="#e8e8e8" strokeWidth="0.3" fill="none" />
                        </>
                    ) : style === 'NUN_HABIT' ? (
                        // Nun's habit - black with white guimpe
                        <>
                            <path d="M10 10 Q10 9 16 9 Q22 9 22 10 L22 24 L10 24 Z" fill="#1a1a1a" />
                            {/* White guimpe (chest piece) */}
                            <path d="M12 10 Q16 8 20 10 L19 16 Q16 15 13 16 Z" fill={colors.white} />
                            {/* Crucifix on chest */}
                            <line x1="16" y1="13" x2="16" y2="16" stroke="#8b7355" strokeWidth="0.8" />
                            <line x1="14.8" y1="14" x2="17.2" y2="14" stroke="#8b7355" strokeWidth="0.8" />
                        </>
                    ) : style === 'FRENCH_MILITARY' ? (
                        // French army dark blue tunic
                        <>
                            <path d="M9 12 Q9 10 16 10 Q23 10 23 12 L23 26 L9 26 Z" fill="#1a3a5c" />
                            {/* Double row of brass buttons */}
                            <circle cx="13" cy="14" r="0.6" fill={colors.brass} />
                            <circle cx="19" cy="14" r="0.6" fill={colors.brass} />
                            <circle cx="13" cy="17" r="0.6" fill={colors.brass} />
                            <circle cx="19" cy="17" r="0.6" fill={colors.brass} />
                            <circle cx="13" cy="20" r="0.6" fill={colors.brass} />
                            <circle cx="19" cy="20" r="0.6" fill={colors.brass} />
                            {/* Red trim on collar */}
                            <path d="M12 10 Q16 9 20 10" stroke="#c41e3a" strokeWidth="1" fill="none" />
                            {/* Gold epaulettes */}
                            <rect x="8" y="11" width="3" height="2" fill={colors.gold} rx="1" />
                            <rect x="21" y="11" width="3" height="2" fill={colors.gold} rx="1" />
                        </>
                    ) : style === 'BRITISH_MILITARY' ? (
                        // British red coat
                        <>
                            <path d="M9 12 Q9 10 16 10 Q23 10 23 12 L23 26 L9 26 Z" fill="#c41e3a" />
                            {/* White cross-belt */}
                            <path d="M10 12 L22 24" stroke={colors.white} strokeWidth="1.5" fill="none" />
                            <path d="M22 12 L10 24" stroke={colors.white} strokeWidth="1.5" fill="none" />
                            {/* Brass buttons */}
                            <circle cx="16" cy="14" r="0.6" fill={colors.brass} />
                            <circle cx="16" cy="17" r="0.6" fill={colors.brass} />
                            <circle cx="16" cy="20" r="0.6" fill={colors.brass} />
                            {/* Blue facings on collar */}
                            <path d="M12 10 Q16 9 20 10" stroke="#1a3a5c" strokeWidth="1" fill="none" />
                            {/* Gold epaulettes */}
                            <rect x="8" y="11" width="3" height="2" fill={colors.gold} rx="1" />
                            <rect x="21" y="11" width="3" height="2" fill={colors.gold} rx="1" />
                        </>
                    ) : style === 'GERMAN_MILITARY' ? (
                        // Prussian/German dark uniform
                        <>
                            <path d="M9 12 Q9 10 16 10 Q23 10 23 12 L23 26 L9 26 Z" fill="#2a3d2a" />
                            {/* Single row of buttons */}
                            <circle cx="16" cy="13" r="0.6" fill="#c0c0c0" />
                            <circle cx="16" cy="16" r="0.6" fill="#c0c0c0" />
                            <circle cx="16" cy="19" r="0.6" fill="#c0c0c0" />
                            <circle cx="16" cy="22" r="0.6" fill="#c0c0c0" />
                            {/* Red piping */}
                            <path d="M12 10 Q16 9 20 10" stroke="#c41e3a" strokeWidth="0.6" fill="none" />
                            <line x1="9" y1="12" x2="9" y2="26" stroke="#c41e3a" strokeWidth="0.4" />
                            <line x1="23" y1="12" x2="23" y2="26" stroke="#c41e3a" strokeWidth="0.4" />
                            {/* Silver epaulettes */}
                            <rect x="8" y="11" width="3" height="2" fill="#c0c0c0" rx="1" />
                            <rect x="21" y="11" width="3" height="2" fill="#c0c0c0" rx="1" />
                        </>
                    ) : style === 'MILITARY_UNIFORM' ? (
                        // Generic military tunic with buttons (fallback) - uses bodyColor for consistency
                        <>
                            <path d="M9 12 Q9 10 16 10 Q23 10 23 12 L23 26 L9 26 Z"
                                  fill={bodyColor.main} />
                            {/* Brass buttons */}
                            <circle cx="14" cy="15" r="0.8" fill={colors.brass} />
                            <circle cx="18" cy="15" r="0.8" fill={colors.brass} />
                            <circle cx="14" cy="19" r="0.8" fill={colors.brass} />
                            <circle cx="18" cy="19" r="0.8" fill={colors.brass} />
                            {/* Epaulettes */}
                            <rect x="8" y="11" width="3" height="2" fill={colors.gold} rx="1" />
                            <rect x="21" y="11" width="3" height="2" fill={colors.gold} rx="1" />
                        </>
                    ) : isFemale ? (
                        // Women's bodice - more fitted and feminine
                        <>
                            {/* Fitted bodice with wasp waist */}
                            <path d="M11 12 Q11 10 16 9 Q21 10 21 12 L20 18 Q16 17 12 18 L11 12 Z"
                                  fill={bodyColor.main} />
                            {/* Waist cinch */}
                            <path d="M12 18 Q16 16 20 18 L21 24 Q16 25 11 24 Z"
                                  fill={bodyColor.main} />
                            {/* High collar with lace - skip for nuns who have wimple */}
                            {style !== 'NUN_HABIT' && (
                                <>
                                    <path d="M13 10 Q16 8.5 19 10" fill="none" stroke={colors.white} strokeWidth="1.5" />
                                    <path d="M14 9.5 Q16 8 18 9.5" fill="none" stroke={colors.white} strokeWidth="0.5" />
                                </>
                            )}
                            {/* Decorative buttons or brooch - skip for nuns */}
                            {style !== 'NUN_HABIT' && (
                                <>
                                    <circle cx="16" cy="12" r="0.7" fill={colors.gold} />
                                    <circle cx="16" cy="15" r="0.5" fill={colors.gold} />
                                </>
                            )}
                            {/* Shoulder puffs (leg-of-mutton sleeves were fashionable) */}
                            <ellipse cx="10" cy="12" rx="2" ry="1.5" fill={bodyColor.main} />
                            <ellipse cx="22" cy="12" rx="2" ry="1.5" fill={bodyColor.main} />
                        </>
                    ) : (
                        // Men's jacket/coat
                        <>
                            <path d="M9 12 Q9 10 16 10 Q23 10 23 12 L23 26 L9 26 Z"
                                  fill={`url(#coat-${npc.id})`} />
                            {/* Lapels */}
                            <path d="M12 10 L14 16 L12 16 Z" fill={bodyColor.light} />
                            <path d="M20 10 L18 16 L20 16 Z" fill={bodyColor.light} />
                            {/* Vest/Waistcoat showing */}
                            <path d="M14 12 L14 24 L18 24 L18 12 Q16 11 14 12" fill={colors.secondary} />
                            {/* Buttons */}
                            <circle cx="16" cy="15" r="0.5" fill={colors.gold} />
                            <circle cx="16" cy="18" r="0.5" fill={colors.gold} />
                            <circle cx="16" cy="21" r="0.5" fill={colors.gold} />
                        </>
                    )}

                    {/* Arms - color matches uniform */}
                    <g transform={`rotate(${armSwing} 11 14)`}>
                        <path d="M9 12 L5 22 L7 22 L11 14" fill={sleeveColor} />
                        <ellipse cx="6" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>
                    <g transform={`rotate(${-armSwing} 21 14)`}>
                        <path d="M23 12 L27 22 L25 22 L21 14" fill={sleeveColor} />
                        <ellipse cx="26" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>

                    {/* Neck */}
                    <rect x="14" y="8" width="4" height="3" fill={colors.skin} />

                    {/* Collar/Tie - not shown for priests (have Roman collar) or nuns */}
                    {!isFemale && style !== 'PRIEST_CASSOCK' && (
                        <>
                            <path d="M13 10 L16 12 L19 10" fill="none" stroke={colors.white} strokeWidth="1.5" />
                            <polygon points="15,11 17,11 16,14" fill="#722f37" />
                        </>
                    )}

                    {/* Ears (behind head) */}
                    <ellipse cx="12.5" cy="6" rx="0.8" ry="1.2" fill={colors.skin} />
                    <ellipse cx="12.5" cy="6" rx="0.4" ry="0.6" fill={colors.skinShadow} />
                    <ellipse cx="19.5" cy="6" rx="0.8" ry="1.2" fill={colors.skin} />
                    <ellipse cx="19.5" cy="6" rx="0.4" ry="0.6" fill={colors.skinShadow} />

                    {/* Head - elongated oval to match portrait proportions */}
                    <ellipse cx="16" cy="6" rx="3.5" ry="5" fill={`url(#face-${npc.id})`} />

                    {/* Cheek blush - using portrait-matching blush color */}
                    <ellipse cx="14" cy="7.2" rx="1.3" ry="0.9" fill={colors.skinBlush} opacity="0.4" />
                    <ellipse cx="18" cy="7.2" rx="1.3" ry="0.9" fill={colors.skinBlush} opacity="0.4" />

                    {/* Chin shadow - adjusted for longer face */}
                    <ellipse cx="16" cy="10.2" rx="1.8" ry="0.6" fill={colors.skinShadow} opacity="0.25" />

                    {/* Eyes - larger, more detailed */}
                    {/* Eye whites */}
                    <ellipse cx="14.5" cy="5.2" rx="1.1" ry="0.85" fill="white" />
                    <ellipse cx="17.5" cy="5.2" rx="1.1" ry="0.85" fill="white" />
                    {/* Upper eyelid line - defines eye shape and suggests lashes */}
                    <path d="M13.4 4.5 Q14.5 4.2 15.6 4.5" stroke={colors.skinShadow} strokeWidth="0.4" fill="none" />
                    <path d="M16.4 4.5 Q17.5 4.2 18.6 4.5" stroke={colors.skinShadow} strokeWidth="0.4" fill="none" />
                    {/* Eyelash hints - small strokes at outer corners */}
                    <path d="M15.4 4.6 L15.7 4.3" stroke={colors.hair} strokeWidth="0.2" opacity="0.6" />
                    <path d="M16.6 4.6 L16.3 4.3" stroke={colors.hair} strokeWidth="0.2" opacity="0.6" />
                    {/* Iris */}
                    <circle cx="14.5" cy="5.3" r="0.6" fill="#5a4030" />
                    <circle cx="17.5" cy="5.3" r="0.6" fill="#5a4030" />
                    {/* Pupil */}
                    <circle cx="14.5" cy="5.3" r="0.3" fill="#1a1008" />
                    <circle cx="17.5" cy="5.3" r="0.3" fill="#1a1008" />
                    {/* Eye highlight */}
                    <circle cx="14.2" cy="5.1" r="0.2" fill="white" opacity="0.9" />
                    <circle cx="17.2" cy="5.1" r="0.2" fill="white" opacity="0.9" />

                    {/* Eyebrows */}
                    <path d="M13.3 3.9 Q14.3 3.6 15.5 3.8" stroke={colors.hair} strokeWidth="0.5" fill="none" strokeLinecap="round" />
                    <path d="M16.5 3.8 Q17.7 3.6 18.7 3.9" stroke={colors.hair} strokeWidth="0.5" fill="none" strokeLinecap="round" />

                    {/* Nose - adjusted for longer face */}
                    <path d="M16 5 L16 7.2" stroke={colors.skinShadow} strokeWidth="0.3" fill="none" />
                    <path d="M15.3 7.4 Q16 7.8 16.7 7.4" stroke={colors.skinShadow} strokeWidth="0.25" fill="none" />

                    {/* Mouth - adjusted for longer face */}
                    <path d="M14.5 8.4 Q16 8.6 17.5 8.4" stroke="#a07060" strokeWidth="0.4" fill="none" />
                    <path d="M14.7 8.5 Q16 9 17.3 8.5" fill="#b08070" opacity="0.5" />

                    {/* === FRONT HAIR LAYER (on top of head, NOT covering face) === */}
                    {isFemale ? (
                        renderWomensHairFront()
                    ) : (
                        // Men's hair - with highlight gradient and texture
                        <>
                            <path d="M11.5 3.8 Q16 1.5 20.5 3.8 Q20 5 19 5 L13 5 Q12 5 11.5 3.8" fill={`url(#hair-${npc.id})`} />
                            {/* Hair texture strands */}
                            <path d="M13 3 Q14 2.5 15 3" stroke={colors.hairHighlight} strokeWidth="0.3" fill="none" opacity="0.6" />
                            <path d="M16 2.5 Q17 2 18 2.8" stroke={colors.hairHighlight} strokeWidth="0.3" fill="none" opacity="0.6" />
                            {/* Sideburns */}
                            <path d="M11 4.5 Q10.8 6.5 11.5 7.5" stroke={colors.hair} strokeWidth="1.2" fill="none" />
                            <path d="M21 4.5 Q21.2 6.5 20.5 7.5" stroke={colors.hair} strokeWidth="1.2" fill="none" />
                        </>
                    )}

                    {/* Facial hair (men only) - adjusted for longer face */}
                    {!isFemale && facialHair !== 'NONE' && (
                        <>
                            {/* Pencil mustache - thin, refined French style (Proust-like) */}
                            {facialHair === 'PENCIL_MUSTACHE' && (
                                <path d="M14 7.8 Q16 8.2 18 7.8" stroke={colors.hair} strokeWidth="0.6" fill="none" />
                            )}
                            {/* Regular mustache - modest Victorian style */}
                            {facialHair === 'MUSTACHE' && (
                                <path d="M13.8 7.7 Q16 8.5 18.2 7.7 L18 8.1 Q16 8.7 14 8.1 Z" fill={colors.hair} />
                            )}
                            {/* Handlebar - big curly mustache */}
                            {facialHair === 'HANDLEBAR' && (
                                <>
                                    <path d="M13.5 7.6 Q16 8.6 18.5 7.6 L18.5 8.2 Q16 9 13.5 8.2 Z" fill={colors.hair} />
                                    <path d="M13.5 7.8 Q12.5 7.5 12 8 Q11.8 8.6 12.3 8.8" fill={colors.hair} />
                                    <path d="M18.5 7.8 Q19.5 7.5 20 8 Q20.2 8.6 19.7 8.8" fill={colors.hair} />
                                </>
                            )}
                            {/* Stubble - light shadow */}
                            {facialHair === 'STUBBLE' && (
                                <ellipse cx="16" cy="9" rx="3" ry="2" fill={colors.hair} opacity="0.15" />
                            )}
                            {facialHair === 'FULL_BEARD' && (
                                <>
                                    {/* Mustache part */}
                                    <path d="M13.8 7.7 Q16 8.5 18.2 7.7 L18 8.1 Q16 8.7 14 8.1 Z" fill={colors.hair} />
                                    {/* Full beard covering chin */}
                                    <path d="M13.2 8 Q13 9.5 14 10.5 Q16 11.5 18 10.5 Q19 9.5 18.8 8" fill={colors.hair} />
                                </>
                            )}
                            {facialHair === 'GOATEE' && (
                                <>
                                    {/* Small mustache */}
                                    <path d="M14.2 7.8 Q16 8.3 17.8 7.8" stroke={colors.hair} strokeWidth="0.5" fill="none" />
                                    {/* Goatee - pointed chin beard */}
                                    <path d="M15 8.6 Q16 10.5 17 8.6" fill={colors.hair} />
                                </>
                            )}
                            {facialHair === 'MUTTON_CHOPS' && (
                                <>
                                    {/* Victorian sideburns - thick and bushy */}
                                    <path d="M12 5.5 Q11 7 11.5 9 Q12 9.5 12.8 8.5" fill={colors.hair} />
                                    <path d="M20 5.5 Q21 7 20.5 9 Q20 9.5 19.2 8.5" fill={colors.hair} />
                                </>
                            )}
                            {facialHair === 'IMPERIAL' && (
                                <>
                                    {/* Imperial - waxed upturned mustache with small pointed beard */}
                                    <path d="M14 7.7 Q16 8.3 18 7.7" fill={colors.hair} />
                                    <path d="M14 7.8 Q13 7.5 12.5 7.2" stroke={colors.hair} strokeWidth="0.5" />
                                    <path d="M18 7.8 Q19 7.5 19.5 7.2" stroke={colors.hair} strokeWidth="0.5" />
                                    <path d="M15.2 8.6 Q16 9.8 16.8 8.6" fill={colors.hair} />
                                </>
                            )}
                        </>
                    )}

                    {/* Hat - using consistent hatColors */}
                    {hat === 'TOP_HAT' && (
                        <>
                            <ellipse cx="16" cy="2.5" rx="5" ry="1.2" fill={hatColors.main} />
                            <path d="M12 2.5 Q12 -1 16 -1 Q20 -1 20 2.5" fill={hatColors.main} />
                            <rect x="12" y="1.5" width="8" height="0.8" fill={hatColors.dark} />
                        </>
                    )}
                    {hat === 'BOWLER' && (
                        <>
                            <ellipse cx="16" cy="2.5" rx="5.5" ry="1.3" fill={hatColors.main} />
                            <path d="M12 2.5 Q12 0.5 16 0.5 Q20 0.5 20 2.5" fill={hatColors.main} />
                        </>
                    )}
                    {hat === 'FLAT_CAP' && (
                        <>
                            <path d="M11 3 L21 3 Q20 1 16 1 Q12 1 11 3" fill={hatColors.main} />
                            <path d="M10 3 L13 4 L11 3" fill={hatColors.dark} />
                        </>
                    )}
                    {hat === 'KEPI' && (
                        <>
                            <rect x="12" y="1" width="8" height="3" fill={hatColors.main} rx="1" />
                            <ellipse cx="16" cy="1" rx="4" ry="0.8" fill={hatColors.dark} />
                            <rect x="14" y="0.5" width="4" height="0.5" fill={colors.gold} />
                        </>
                    )}
                    {hat === 'BONNET' && (
                        <>
                            {/* Bonnet sits on top of head, not covering eyes */}
                            <path d="M11 2 Q16 -2 21 2 Q21 4 20 4 L12 4 Q11 4 11 2" fill={hatColors.main} />
                            {/* Bonnet ribbon/tie */}
                            <path d="M19 3 Q21 2 22 4" stroke={hatColors.main} strokeWidth="1.5" fill="none" />
                        </>
                    )}
                    {hat === 'WIDE_BRIM' && (
                        <>
                            <ellipse cx="16" cy="2" rx="7" ry="1.5" fill={hatColors.main} />
                            <ellipse cx="16" cy="1" rx="4" ry="2" fill={hatColors.main} />
                            <circle cx="19" cy="0" r="1" fill={colors.gold} />
                        </>
                    )}
                    {hat === 'FEZ' && (
                        <>
                            <path d="M13 3 L13 0 Q16 -1 19 0 L19 3" fill="#8b0000" />
                            <ellipse cx="16" cy="3" rx="4" ry="1" fill="#8b0000" />
                            <path d="M16 -1 L17 1" stroke="#d4af37" strokeWidth="0.5" />
                        </>
                    )}
                    {hat === 'BERET' && (
                        <ellipse cx="16" cy="2" rx="5" ry="2" fill={hatColors.main} />
                    )}
                    {hat === 'BIRETTA' && (
                        // Catholic priest biretta - black square cap with tuft
                        <>
                            <rect x="12" y="1" width="8" height="3" fill="#1a1a1a" />
                            {/* Ridges/edges of biretta */}
                            <path d="M12 1 L16 0 L20 1" stroke="#1a1a1a" strokeWidth="1" fill="none" />
                            <path d="M12 1 L12 -1 L16 0" fill="#1a1a1a" />
                            <path d="M20 1 L20 -1 L16 0" fill="#1a1a1a" />
                            {/* Small tuft/pom on top */}
                            <circle cx="16" cy="-0.5" r="0.8" fill="#1a1a1a" />
                        </>
                    )}
                    {hat === 'CORNETTE' && (
                        // Nun's traditional headdress - white wimple and black veil
                        <>
                            {/* White wimple covering hair and framing face */}
                            <path d="M10 3 Q10 0 16 0 Q22 0 22 3 L22 8 Q16 9 10 8 Z" fill={colors.white} />
                            {/* Black veil over top */}
                            <path d="M10 2 Q10 -2 16 -2 Q22 -2 22 2 Q22 3 16 3 Q10 3 10 2" fill="#1a1a1a" />
                            {/* Wings of cornette extending outward */}
                            <path d="M10 2 Q8 0 9 -2" stroke="#1a1a1a" strokeWidth="2" fill="none" />
                            <path d="M22 2 Q24 0 23 -2" stroke="#1a1a1a" strokeWidth="2" fill="none" />
                        </>
                    )}
                    {hat === 'PICKELHAUBE' && (
                        // German spiked helmet
                        <>
                            {/* Main helmet dome */}
                            <ellipse cx="16" cy="2" rx="5" ry="2.5" fill="#2a3d2a" />
                            <path d="M11 2 Q11 -1 16 -1 Q21 -1 21 2" fill="#2a3d2a" />
                            {/* Spike on top */}
                            <path d="M16 -1 L16 -4" stroke="#c0c0c0" strokeWidth="1" />
                            <circle cx="16" cy="-4" r="0.8" fill="#c0c0c0" />
                            {/* Front badge/plate */}
                            <ellipse cx="16" cy="1.5" rx="2" ry="1.5" fill={colors.brass} />
                            {/* Chin strap hint */}
                            <path d="M11 3 Q10 5 11 6" stroke={colors.brass} strokeWidth="0.5" fill="none" />
                        </>
                    )}
                    {hat === 'PITH_HELMET' && (
                        // British colonial pith helmet
                        <>
                            {/* Wide brim */}
                            <ellipse cx="16" cy="2.5" rx="6" ry="1.5" fill="#e8dcc8" />
                            {/* Dome */}
                            <path d="M11 2.5 Q11 -1 16 -1 Q21 -1 21 2.5" fill="#e8dcc8" />
                            {/* Puggaree band */}
                            <rect x="11.5" y="1" width="9" height="1" fill="#c4a77d" />
                            {/* Top button */}
                            <circle cx="16" cy="-0.5" r="0.6" fill={colors.brass} />
                        </>
                    )}

                    {/* Hair visible under hat - renders AFTER hat for sideburns/temple hair */}
                    {hat !== 'NONE' && hat !== 'CORNETTE' && !isFemale && (
                        <>
                            {/* Left temple hair peeking under hat */}
                            <path d="M10.5 4 Q10.2 5.5 11 6.5" stroke={colors.hair} strokeWidth="1" fill="none" />
                            {/* Right temple hair peeking under hat */}
                            <path d="M21.5 4 Q21.8 5.5 21 6.5" stroke={colors.hair} strokeWidth="1" fill="none" />
                        </>
                    )}
                    {/* Women's hair visible under hat - small wisps at temples */}
                    {hat !== 'NONE' && hat !== 'CORNETTE' && isFemale && (
                        <>
                            {/* Soft wisps at temples */}
                            <path d="M10.5 4.5 Q10 6 10.5 7" stroke={colors.hair} strokeWidth="0.8" fill="none" />
                            <path d="M21.5 4.5 Q22 6 21.5 7" stroke={colors.hair} strokeWidth="0.8" fill="none" />
                        </>
                    )}
                </svg>
            );
        }

        // Helper to render women's hair from back
        const renderWomensHairBackView = () => {
            if (!isFemale) return null;

            switch (womensHair) {
                case 'LONG_CURLS':
                    // Shoulder blade length (y=3 to y=15), unified mass not two ponytails
                    return (
                        <g>
                            <path d="M11 3 Q16 0 21 3 Q22 6 21 10 Q20 14 19 16 L16 15 Q17 12 17 8" fill={colors.hair} />
                            <path d="M11 3 Q10 6 11 10 Q12 14 13 16 L16 15 Q15 12 15 8" fill={colors.hair} />
                            {/* Center back hair connecting sides */}
                            <path d="M15 6 Q16 8 17 6 L17 14 L15 14 Z" fill={colors.hair} />
                            <path d="M14 5 Q16 3 18 5 Q18 10 17 14" fill={colors.hairHighlight} opacity="0.3" />
                        </g>
                    );
                case 'LOOSE_WAVES':
                    // Shoulder blade length (y=3 to y=15), unified mass
                    return (
                        <g>
                            <path d="M11 3 Q16 0 21 3 Q22 7 20 12 Q19 14 18 16 L16 15 Q17 12 17 8" fill={colors.hair} />
                            <path d="M11 3 Q10 7 12 12 Q13 14 14 16 L16 15 Q15 12 15 8" fill={colors.hair} />
                            {/* Center back */}
                            <path d="M15 6 Q16 8 17 6 L17 13 L15 13 Z" fill={colors.hair} />
                        </g>
                    );
                case 'CHIGNON':
                    return (
                        <g>
                            <path d="M11 3 Q16 0 21 3 Q21 6 20 7 L12 7 Q11 6 11 3" fill={colors.hair} />
                            <ellipse cx="16" cy="9" rx="3.5" ry="3" fill={colors.hair} />
                        </g>
                    );
                case 'BRAIDED':
                    return (
                        <g>
                            <path d="M11 3 Q16 0 21 3 Q21 6 20 7 L12 7 Q11 6 11 3" fill={colors.hair} />
                            <path d="M14 7 L15 10 L17 10 L18 7" fill={colors.hair} />
                            <ellipse cx="16" cy="11" rx="2" ry="2" fill={colors.hair} />
                        </g>
                    );
                case 'POMPADOUR':
                    return (
                        <g>
                            <ellipse cx="16" cy="2" rx="5" ry="3" fill={colors.hair} />
                            <path d="M11 4 Q16 3 21 4 Q21 7 20 8 L12 8 Q11 7 11 4" fill={colors.hair} />
                        </g>
                    );
                default: // UPDO
                    return (
                        <g>
                            <ellipse cx="16" cy="2" rx="4" ry="2.5" fill={colors.hair} />
                            <path d="M11 4 Q16 2 21 4 Q21 7 20 8 L12 8 Q11 7 11 4" fill={colors.hair} />
                        </g>
                    );
            }
        };

        // North-facing (back view)
        if (dir === 'N') {
            return (
                <svg viewBox="0 0 32 40" className="w-10 h-12 overflow-visible">
                    <defs>
                        <linearGradient id={`dress-back-${npc.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={colors.primaryLight} />
                            <stop offset="50%" stopColor={colors.primary} />
                            <stop offset="100%" stopColor={colors.primaryDark} />
                        </linearGradient>
                    </defs>

                    {/* Shadow */}
                    <ellipse cx="16" cy="38" rx="7" ry="2" fill="rgba(0,0,0,0.15)" />

                    {/* Legs/Skirt */}
                    {isFemale && (style === 'BUSTLE_DRESS' || style === 'WALKING_DRESS' || style === 'SERVANT_DRESS') ? (
                        <g>
                            {/* Main skirt with bustle visible from back */}
                            <path d={`M10 24 Q6 30 7 36 L25 36 Q26 30 22 24 Z`}
                                  fill={`url(#dress-back-${npc.id})`} />
                            {/* Prominent bustle */}
                            <ellipse cx="16" cy="25" rx="4" ry="2.5" fill={bodyColor.main} />
                            <ellipse cx="16" cy="26" rx="3" ry="2" fill={bodyColor.dark} />
                            {/* Skirt folds */}
                            <path d="M10 26 Q9 30 8 35" stroke={bodyColor.dark} strokeWidth="0.5" fill="none" />
                            <path d="M14 26 Q13 30 12 35" stroke={bodyColor.dark} strokeWidth="0.5" fill="none" />
                            <path d="M18 26 Q19 30 20 35" stroke={bodyColor.dark} strokeWidth="0.5" fill="none" />
                            <path d="M22 26 Q23 30 24 35" stroke={bodyColor.dark} strokeWidth="0.5" fill="none" />
                        </g>
                    ) : (
                        // Trousers and shoes from back view
                        <>
                            {/* Left trouser leg - tapers from thigh to ankle */}
                            <path d={`M10 26 Q9.5 28 9.5 31 L${10 + legOffset * 0.3} 34 L${10.5 + legOffset * 0.3} 35.5 L${13.5 + legOffset * 0.3} 35.5 L${14 + legOffset * 0.3} 34 Q14.5 31 14.5 28 L15 26 Z`}
                                  fill={colors.secondary} />
                            {/* Right trouser leg */}
                            <path d={`M17 26 Q17.5 28 17.5 31 L${18 - legOffset * 0.3} 34 L${18.5 - legOffset * 0.3} 35.5 L${21.5 - legOffset * 0.3} 35.5 L${22 - legOffset * 0.3} 34 Q22.5 31 22.5 28 L22 26 Z`}
                                  fill={colors.secondary} />
                            {/* Left shoe from back - heel visible */}
                            <path d={`M${9.5 + legOffset * 0.3} 35 Q${9 + legOffset * 0.3} 36 ${9.5 + legOffset * 0.3} 37.5 L${14 + legOffset * 0.3} 37.5 Q${14.5 + legOffset * 0.3} 36 ${14 + legOffset * 0.3} 35 Z`}
                                  fill="#1a0a05" />
                            {/* Left heel */}
                            <rect x={10.5 + legOffset * 0.3} y="37.5" width="2.5" height="1" fill="#0a0500" />
                            {/* Right shoe from back */}
                            <path d={`M${17.5 - legOffset * 0.3} 35 Q${17 - legOffset * 0.3} 36 ${17.5 - legOffset * 0.3} 37.5 L${22 - legOffset * 0.3} 37.5 Q${22.5 - legOffset * 0.3} 36 ${22 - legOffset * 0.3} 35 Z`}
                                  fill="#1a0a05" />
                            {/* Right heel */}
                            <rect x={18.5 - legOffset * 0.3} y="37.5" width="2.5" height="1" fill="#0a0500" />
                        </>
                    )}

                    {/* Body from back */}
                    {isFemale ? (
                        <g>
                            <path d="M11 12 Q11 10 16 10 Q21 10 21 12 L20 18 Q16 17 12 18 L11 12 Z"
                                  fill={bodyColor.main} />
                            <path d="M12 18 Q16 16 20 18 L21 24 Q16 25 11 24 Z"
                                  fill={bodyColor.main} />
                        </g>
                    ) : (
                        <>
                            <path d="M9 12 Q9 10 16 10 Q23 10 23 12 L23 26 L9 26 Z" fill={bodyColor.main} />
                            <line x1="16" y1="10" x2="16" y2="26" stroke={bodyColor.dark} strokeWidth="0.5" />
                        </>
                    )}

                    {/* Arms - color matches uniform */}
                    <g transform={`rotate(${-armSwing} 11 14)`}>
                        <path d="M9 12 L5 22 L7 22 L11 14" fill={sleeveColor} />
                        <ellipse cx="6" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>
                    <g transform={`rotate(${armSwing} 21 14)`}>
                        <path d="M23 12 L27 22 L25 22 L21 14" fill={sleeveColor} />
                        <ellipse cx="26" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>

                    {/* Collar - not shown for priests/nuns (seen from back) */}
                    {style !== 'PRIEST_CASSOCK' && style !== 'NUN_HABIT' && (
                        <path d="M13 10 Q16 9 19 10" fill={colors.white} />
                    )}

                    {/* Neck */}
                    <rect x="14" y="8" width="4" height="2" fill={colors.skin} />

                    {/* Head from back - NARROWER to match portrait */}
                    <ellipse cx="16" cy="6" rx="3.5" ry="4" fill={colors.skin} />

                    {/* Hair from back - use style-specific rendering */}
                    {isFemale ? (
                        renderWomensHairBackView()
                    ) : (
                        <path d="M12.5 3 Q16 1 19.5 3 Q20 6 19 7 L13 7 Q12 6 12.5 3" fill={colors.hair} />
                    )}

                    {/* Ears */}
                    <ellipse cx="12.5" cy="6" rx="0.7" ry="1" fill={colors.skin} />
                    <ellipse cx="19.5" cy="6" rx="0.7" ry="1" fill={colors.skin} />

                    {/* Hat - using consistent hatColors */}
                    {hat === 'TOP_HAT' && (
                        <>
                            <ellipse cx="16" cy="2.5" rx="5" ry="1.2" fill={hatColors.main} />
                            <path d="M12 2.5 Q12 -1 16 -1 Q20 -1 20 2.5" fill={hatColors.main} />
                        </>
                    )}
                    {hat === 'BOWLER' && (
                        <>
                            <ellipse cx="16" cy="2.5" rx="5.5" ry="1.3" fill={hatColors.main} />
                            <path d="M12 2.5 Q12 0.5 16 0.5 Q20 0.5 20 2.5" fill={hatColors.main} />
                        </>
                    )}
                    {hat === 'FLAT_CAP' && (
                        <path d="M11 3 L21 3 Q20 1 16 1 Q12 1 11 3" fill={hatColors.main} />
                    )}
                    {hat === 'KEPI' && (
                        <>
                            <rect x="12" y="1" width="8" height="3" fill={hatColors.main} rx="1" />
                            <ellipse cx="16" cy="1" rx="4" ry="0.8" fill={hatColors.dark} />
                        </>
                    )}
                    {hat === 'BONNET' && (
                        <path d="M11 1 Q16 -2 21 1 Q21 3 20 3 L12 3 Q11 3 11 1" fill={hatColors.main} />
                    )}
                    {hat === 'WIDE_BRIM' && (
                        <>
                            <ellipse cx="16" cy="2" rx="7" ry="1.5" fill={hatColors.main} />
                            <ellipse cx="16" cy="1" rx="4" ry="2" fill={hatColors.main} />
                        </>
                    )}
                    {hat === 'FEZ' && (
                        <>
                            <path d="M13 3 L13 0 Q16 -1 19 0 L19 3" fill="#8b0000" />
                            <ellipse cx="16" cy="3" rx="4" ry="1" fill="#8b0000" />
                        </>
                    )}
                    {hat === 'BERET' && (
                        <ellipse cx="16" cy="2" rx="5" ry="2" fill={hatColors.main} />
                    )}
                    {hat === 'BIRETTA' && (
                        <>
                            <rect x="12" y="1" width="8" height="3" fill="#1a1a1a" />
                            <path d="M12 1 L16 0 L20 1" stroke="#1a1a1a" strokeWidth="1" fill="none" />
                            <circle cx="16" cy="-0.5" r="0.8" fill="#1a1a1a" />
                        </>
                    )}
                    {hat === 'CORNETTE' && (
                        <>
                            <path d="M10 3 Q10 0 16 0 Q22 0 22 3 L22 8 Q16 9 10 8 Z" fill={colors.white} />
                            <path d="M10 2 Q10 -2 16 -2 Q22 -2 22 2 Q22 3 16 3 Q10 3 10 2" fill="#1a1a1a" />
                        </>
                    )}
                    {hat === 'PICKELHAUBE' && (
                        <>
                            <ellipse cx="16" cy="2" rx="5" ry="2.5" fill="#2a3d2a" />
                            <path d="M11 2 Q11 -1 16 -1 Q21 -1 21 2" fill="#2a3d2a" />
                            <path d="M16 -1 L16 -4" stroke="#c0c0c0" strokeWidth="1" />
                            <circle cx="16" cy="-4" r="0.8" fill="#c0c0c0" />
                        </>
                    )}
                    {hat === 'PITH_HELMET' && (
                        <>
                            <ellipse cx="16" cy="2.5" rx="6" ry="1.5" fill="#e8dcc8" />
                            <path d="M11 2.5 Q11 -1 16 -1 Q21 -1 21 2.5" fill="#e8dcc8" />
                            <rect x="11.5" y="1" width="9" height="1" fill="#c4a77d" />
                        </>
                    )}

                    {/* Hair visible under hat from back - nape of neck area */}
                    {hat !== 'NONE' && hat !== 'CORNETTE' && (
                        <>
                            {/* Hair at nape/back of neck visible under hat */}
                            <path d="M12 7 Q16 8 20 7" stroke={colors.hair} strokeWidth="0.8" fill="none" />
                        </>
                    )}
                </svg>
            );
        }

        // Helper for women's hair profile (East-facing)
        const renderWomensHairProfileE = () => {
            if (!isFemale) return null;

            // Back hair layer (behind body) - shoulder blade length (y=5 to y=15)
            const backHair = (womensHair === 'LONG_CURLS' || womensHair === 'LOOSE_WAVES') ? (
                <path d="M12 5 Q10 8 11 12 Q12 14 13 16" fill={colors.hair} />
            ) : null;

            // Front hair (on head)
            let frontHair;
            switch (womensHair) {
                case 'LONG_CURLS':
                    frontHair = (
                        <g>
                            <path d="M12 2 Q15 0 18 2 Q18 5 17 6 L13 6 Q12 5 12 2" fill={colors.hair} />
                            <path d="M17 5 Q18 7 17 9" stroke={colors.hair} strokeWidth="1" fill="none" />
                        </g>
                    );
                    break;
                case 'LOOSE_WAVES':
                    frontHair = (
                        <g>
                            <path d="M12 2 Q15 0 18 2 Q18 5 17 6 L13 6 Q12 5 12 2" fill={colors.hair} />
                            <path d="M12 5 Q11 7 12 9" stroke={colors.hair} strokeWidth="1.5" fill="none" />
                        </g>
                    );
                    break;
                case 'POMPADOUR':
                    frontHair = (
                        <g>
                            <ellipse cx="15" cy="1" rx="4" ry="2.5" fill={colors.hair} />
                            <path d="M12 3 Q15 2 18 3 Q18 5 17 6 L13 6 Q12 5 12 3" fill={colors.hair} />
                        </g>
                    );
                    break;
                case 'CHIGNON':
                    frontHair = (
                        <g>
                            <path d="M12 3 Q15 1 18 3 Q18 5 17 6 L13 6 Q12 5 12 3" fill={colors.hair} />
                            <ellipse cx="13" cy="8" rx="2" ry="2" fill={colors.hair} />
                        </g>
                    );
                    break;
                default:
                    frontHair = <path d="M12 2 Q15 0 18 2 Q18 5 17 6 L13 6 Q12 5 12 2" fill={colors.hair} />;
            }

            return { backHair, frontHair };
        };

        // East-facing (right profile)
        if (dir === 'E') {
            const hairLayers = renderWomensHairProfileE();

            return (
                <svg viewBox="0 0 32 40" className="w-10 h-12 overflow-visible">
                    {/* Shadow */}
                    <ellipse cx="16" cy="38" rx="7" ry="2" fill="rgba(0,0,0,0.15)" />

                    {/* Back hair for long styles */}
                    {isFemale && hairLayers?.backHair}

                    {/* Legs / Dress skirt */}
                    {isFemale && (style === 'BUSTLE_DRESS' || style === 'WALKING_DRESS' || style === 'SERVANT_DRESS') ? (
                        <g>
                            {/* Profile dress with bell/conical shape - smooth taper from waist to hem */}
                            {/* Main skirt: starts narrow at waist (12-20), flares out to wide hem (6-26) */}
                            <path d="M12 18 Q10 22 8 28 Q6 33 6 36 L26 36 Q26 33 24 28 Q22 22 20 18 Z" fill={bodyColor.main} />
                            {/* Bustle showing in profile - protrudes at back */}
                            <ellipse cx="9" cy="22" rx="2.5" ry="3" fill={bodyColor.dark} />
                            {/* Dress folds showing the bell shape */}
                            <path d="M11 20 Q9 26 7 35" stroke={bodyColor.dark} strokeWidth="0.5" fill="none" />
                            <path d="M14 19 Q12 27 10 35" stroke={bodyColor.dark} strokeWidth="0.4" fill="none" opacity="0.7" />
                            <path d="M18 19 Q20 27 22 35" stroke={bodyColor.dark} strokeWidth="0.4" fill="none" opacity="0.7" />
                            <path d="M21 20 Q23 26 25 35" stroke={bodyColor.dark} strokeWidth="0.5" fill="none" />
                            {/* Hem detail */}
                            <path d="M6 35.5 Q16 34 26 35.5" stroke={bodyColor.dark} strokeWidth="0.5" fill="none" />
                        </g>
                    ) : (
                        // Profile trousers and shoes - East facing
                        <>
                            {/* Back leg - partially hidden, darker */}
                            <path d={`M12 26 Q11.5 28 11.5 31 L${11 - legOffset * 0.4} 34 L${11 - legOffset * 0.4} 35.5 L${14 - legOffset * 0.4} 35.5 L${14 - legOffset * 0.4} 34 Q14.5 31 15 28 L15 26 Z`}
                                  fill={colors.secondaryDark} />
                            {/* Front leg - more visible */}
                            <path d={`M15 26 Q15.5 28 15.5 31 L${16 + legOffset * 0.4} 34 L${16 + legOffset * 0.4} 35.5 L${20 + legOffset * 0.4} 35.5 L${20 + legOffset * 0.4} 34 Q20.5 31 20.5 28 L20 26 Z`}
                                  fill={colors.secondary} />
                            {/* Back shoe - Victorian boot profile, partially hidden */}
                            <path d={`M${10 - legOffset * 0.4} 35 L${9 - legOffset * 0.4} 36.5 Q${8.5 - legOffset * 0.4} 37.5 ${10 - legOffset * 0.4} 38 L${14.5 - legOffset * 0.4} 38 L${14.5 - legOffset * 0.4} 35 Z`}
                                  fill="#0a0500" />
                            {/* Front shoe - full boot profile with toe pointing right */}
                            <path d={`M${15.5 + legOffset * 0.4} 35 L${15 + legOffset * 0.4} 36.5 Q${15 + legOffset * 0.4} 37.5 ${16 + legOffset * 0.4} 38 L${22 + legOffset * 0.4} 38 Q${23 + legOffset * 0.4} 37 ${22.5 + legOffset * 0.4} 36 L${20.5 + legOffset * 0.4} 35 Z`}
                                  fill="#1a0a05" />
                            {/* Front shoe highlight */}
                            <path d={`M${17 + legOffset * 0.4} 36.5 L${21 + legOffset * 0.4} 36.5`}
                                  stroke="#3a2515" strokeWidth="0.3" fill="none" />
                        </>
                    )}

                    {/* Back arm - color matches uniform */}
                    <g transform={`rotate(${-armSwing * 0.7} 12 14)`}>
                        <path d="M10 12 L6 22" stroke={sleeveColor} strokeWidth="3" fill="none" />
                        <ellipse cx="6" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>

                    {/* Body - profile (bodice/jacket) */}
                    {isFemale ? (
                        <g>
                            {/* Fitted bodice - narrow waist connects to skirt */}
                            <path d="M10 10 Q8 12 10 15 L10 18 L22 18 L22 15 Q22 12 20 10 Z" fill={bodyColor.main} />
                            {/* Waist cinch visible in profile */}
                            <path d="M10 17 Q16 15 22 17" stroke={bodyColor.dark} strokeWidth="0.5" fill="none" />
                            {/* Slight bust curve in profile */}
                            <path d="M21 12 Q23 14 22 16" stroke={bodyColor.dark} strokeWidth="0.3" fill="none" />
                        </g>
                    ) : (
                        <g>
                            {/* Jacket body - proper tailored shape */}
                            <path d="M10 10 Q9 12 9 16 L9 26 L21 26 L21 16 Q21 12 20 10 Z" fill={bodyColor.main} />
                            {/* Jacket lapel visible in profile */}
                            <path d="M20 10 L21 12 L20 14" fill={bodyColor.dark} />
                            {/* Jacket front edge */}
                            <path d="M20 14 L20 26" stroke={bodyColor.dark} strokeWidth="0.4" />
                            {/* Pocket detail */}
                            <path d="M19 20 L19 22" stroke={bodyColor.dark} strokeWidth="0.3" opacity="0.6" />
                            {/* Back pleat/vent suggestion */}
                            <path d="M10 22 L10 26" stroke={bodyColor.dark} strokeWidth="0.3" opacity="0.5" />
                            {/* Vest peek at front */}
                            <path d="M19.5 12 L19.5 18" stroke={colors.secondary} strokeWidth="1" />
                        </g>
                    )}

                    {/* Front arm - color matches uniform */}
                    <g transform={`rotate(${armSwing * 0.7} 18 14)`}>
                        <path d="M18 12 L24 22" stroke={sleeveColor} strokeWidth="3" fill="none" />
                        <ellipse cx="24" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>

                    {/* Collar - not shown for priests (have Roman collar on body) */}
                    {style !== 'PRIEST_CASSOCK' && style !== 'NUN_HABIT' && (
                        <rect x="14" y="9" width="4" height="2" fill={colors.white} />
                    )}

                    {/* Neck */}
                    <rect x="15" y="7" width="3" height="4" fill={colors.skin} />

                    {/* Ear (behind head) */}
                    <ellipse cx="12.5" cy="5.5" rx="1" ry="1.4" fill={colors.skinShadow} />
                    <ellipse cx="12.8" cy="5.5" rx="0.6" ry="1" fill={colors.skin} />

                    {/* Head - profile - path-based for better shape */}
                    {/* More portrait-like: forehead curves to brow, then cheek/jaw */}
                    <path
                        d="M13 2 C15 0 18 0 19 2 L19.5 4 Q20 5 19.5 6.5 C19 8 17 9.5 15 9 C13 8.5 12.5 7 12.5 5 C12.5 3 13 2 13 2 Z"
                        fill={colors.skin}
                    />
                    {/* Face shading - subtle shadow on back of head */}
                    <path d="M13 3 C13 5 13 7 14 8.5" stroke={colors.skinShadow} strokeWidth="0.4" fill="none" opacity="0.5" />

                    {/* Cheek blush - portrait style */}
                    <ellipse cx="17" cy="6" rx="1.5" ry="1" fill={colors.skinBlush} opacity="0.35" />

                    {/* Profile features - refined nose with nostril */}
                    <path d="M19.5 4.5 Q20.5 4.8 20.8 5.2 Q20.5 5.8 19.5 6" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="0.25" />
                    <circle cx="20" cy="5.8" r="0.2" fill={colors.skinShadow} opacity="0.4" />

                    {/* Eye - larger, more detailed */}
                    <ellipse cx="17.8" cy="4.2" rx="1" ry="0.7" fill="white" />
                    <ellipse cx="18" cy="4.2" rx="0.5" ry="0.45" fill="#3d2314" />
                    <circle cx="18.2" cy="4" r="0.15" fill="white" opacity="0.9" />
                    {/* Upper eyelid line */}
                    <path d="M16.8 3.6 Q17.8 3.4 18.8 3.7" stroke={colors.skinShadow} strokeWidth="0.2" fill="none" />

                    {/* Eyebrow - thicker, more defined */}
                    <path d="M16.5 3.2 Q17.8 2.8 18.8 3.1" stroke={colors.hair} strokeWidth="0.5" fill="none" />

                    {/* Lips - subtle */}
                    <path d="M19 7 Q19.3 7.2 19 7.4" stroke={colors.skinShadow} strokeWidth="0.3" fill="none" opacity="0.6" />

                    {/* Facial hair profile - adjusted for new head shape */}
                    {!isFemale && facialHair !== 'NONE' && (
                        <>
                            {/* Pencil mustache - thin line in profile */}
                            {facialHair === 'PENCIL_MUSTACHE' && (
                                <path d="M18 5.9 L20.5 6" stroke={colors.hair} strokeWidth="0.5" fill="none" />
                            )}
                            {/* Regular mustache in profile */}
                            {facialHair === 'MUSTACHE' && (
                                <path d="M17.5 5.8 Q19 5.7 20 6.1 L19.8 6.4 Q18.5 6.5 17.5 6.2 Z" fill={colors.hair} />
                            )}
                            {/* Handlebar - big curly mustache in profile */}
                            {facialHair === 'HANDLEBAR' && (
                                <>
                                    <path d="M17 5.8 Q19 5.6 20 6 L20 6.5 Q19 6.8 17 6.4 Z" fill={colors.hair} />
                                    <path d="M20 6 Q21 5.8 21.3 6.3 Q21.2 6.8 20.5 6.8 L20 6.5 Z" fill={colors.hair} />
                                </>
                            )}
                            {/* Stubble in profile */}
                            {facialHair === 'STUBBLE' && (
                                <ellipse cx="17" cy="7" rx="2" ry="1.5" fill={colors.hair} opacity="0.12" />
                            )}
                            {facialHair === 'FULL_BEARD' && (
                                <>
                                    <path d="M17.5 5.8 Q19 5.7 20 6.1 L19.8 6.4 Q18.5 6.5 17.5 6.2 Z" fill={colors.hair} />
                                    <path d="M17.5 6.5 Q19 7.5 18.5 8.5 Q17 9.2 15 8" fill={colors.hair} />
                                </>
                            )}
                            {facialHair === 'GOATEE' && (
                                <>
                                    <path d="M18 5.9 L20 6.1" stroke={colors.hair} strokeWidth="0.4" fill="none" />
                                    <path d="M17.5 7 Q18.5 8.2 17 8.5" fill={colors.hair} />
                                </>
                            )}
                            {facialHair === 'MUTTON_CHOPS' && (
                                <path d="M13 4 Q12.5 6 13 7.5" fill={colors.hair} />
                            )}
                            {facialHair === 'IMPERIAL' && (
                                <>
                                    <path d="M18 5.9 Q20 5.8 20.8 5.5" stroke={colors.hair} strokeWidth="0.5" fill="none" />
                                    <path d="M17.5 7 Q18.2 8 17 8.3" fill={colors.hair} />
                                </>
                            )}
                        </>
                    )}

                    {/* Hair profile - front layer - adjusted for new head shape */}
                    {isFemale ? (
                        hairLayers?.frontHair
                    ) : (
                        <path d="M13 1.5 Q15 0 18.5 1 Q19 2.5 18 3.5 L14 4 Q13 3 13 1.5" fill={colors.hair} />
                    )}

                    {/* Hat profile - using consistent hatColors */}
                    {hat === 'TOP_HAT' && (
                        <>
                            <ellipse cx="15" cy="1" rx="4.5" ry="1" fill={hatColors.main} />
                            <path d="M11 1 Q11 -2 15 -2 Q19 -2 19 1" fill={hatColors.main} />
                        </>
                    )}
                    {hat === 'BOWLER' && (
                        <>
                            <ellipse cx="15" cy="1" rx="5" ry="1.2" fill={hatColors.main} />
                            <path d="M11 1 Q11 -0.5 15 -0.5 Q19 -0.5 19 1" fill={hatColors.main} />
                        </>
                    )}
                    {hat === 'FLAT_CAP' && (
                        <>
                            <path d="M11 2 L19 2 Q18 0 15 0 Q12 0 11 2" fill={hatColors.main} />
                            <path d="M19 2 L22 3 L19 2.5" fill={hatColors.dark} />
                        </>
                    )}
                    {hat === 'KEPI' && (
                        <>
                            <rect x="12" y="0" width="7" height="2.5" fill={hatColors.main} rx="1" />
                            <path d="M19 1.5 L21 2 L19 2" fill={hatColors.dark} />
                        </>
                    )}
                    {hat === 'BONNET' && (
                        <path d="M11 0 Q15 -3 19 0 Q19 2 18 2 L12 2 Q11 2 11 0" fill={hatColors.main} />
                    )}
                    {hat === 'WIDE_BRIM' && (
                        <>
                            <ellipse cx="15" cy="1" rx="6" ry="1.2" fill={hatColors.main} />
                            <ellipse cx="15" cy="0" rx="3.5" ry="1.8" fill={hatColors.main} />
                        </>
                    )}
                    {hat === 'FEZ' && (
                        <>
                            <path d="M13 2 L13 -1 Q15 -2 17 -1 L17 2" fill="#8b0000" />
                            <ellipse cx="15" cy="2" rx="3" ry="0.8" fill="#8b0000" />
                        </>
                    )}
                    {hat === 'BERET' && (
                        <ellipse cx="15" cy="1" rx="4.5" ry="1.8" fill={hatColors.main} />
                    )}
                    {hat === 'BIRETTA' && (
                        <>
                            <rect x="11" y="0" width="7" height="2.5" fill="#1a1a1a" />
                            <path d="M15 -0.5 L15 -2" stroke="#1a1a1a" strokeWidth="1" />
                            <circle cx="15" cy="-1.5" r="0.6" fill="#1a1a1a" />
                        </>
                    )}
                    {hat === 'CORNETTE' && (
                        <>
                            <path d="M10 2 Q10 -1 15 -1 Q20 -1 20 2 L20 6 Q15 7 10 6 Z" fill={colors.white} />
                            <path d="M10 1 Q10 -3 15 -3 Q20 -3 20 1" fill="#1a1a1a" />
                            <path d="M20 1 Q22 -1 21 -3" stroke="#1a1a1a" strokeWidth="2" fill="none" />
                        </>
                    )}
                    {hat === 'PICKELHAUBE' && (
                        <>
                            <ellipse cx="15" cy="1" rx="4.5" ry="2" fill="#2a3d2a" />
                            <path d="M11 1 Q11 -2 15 -2 Q19 -2 19 1" fill="#2a3d2a" />
                            <path d="M15 -2 L15 -5" stroke="#c0c0c0" strokeWidth="1" />
                            <circle cx="15" cy="-5" r="0.6" fill="#c0c0c0" />
                            <ellipse cx="15" cy="0.5" rx="1.5" ry="1" fill={colors.brass} />
                        </>
                    )}
                    {hat === 'PITH_HELMET' && (
                        <>
                            <ellipse cx="15" cy="1.5" rx="5.5" ry="1.2" fill="#e8dcc8" />
                            <path d="M10 1.5 Q10 -2 15 -2 Q20 -2 20 1.5" fill="#e8dcc8" />
                            <rect x="10.5" y="0" width="9" height="1" fill="#c4a77d" />
                        </>
                    )}

                    {/* Hair visible under hat from profile (East) */}
                    {hat !== 'NONE' && hat !== 'CORNETTE' && (
                        <>
                            {/* Hair at back of head visible under hat */}
                            <path d="M12 5 Q11 6 12 7" stroke={colors.hair} strokeWidth="0.8" fill="none" />
                        </>
                    )}
                </svg>
            );
        }

        // Helper for women's hair profile (West-facing - mirrored)
        const renderWomensHairProfileW = () => {
            if (!isFemale) return null;

            // Back hair layer (behind body) - mirrored, shoulder blade length (y=5 to y=15)
            const backHair = (womensHair === 'LONG_CURLS' || womensHair === 'LOOSE_WAVES') ? (
                <path d="M20 5 Q22 8 21 12 Q20 14 19 16" fill={colors.hair} />
            ) : null;

            // Front hair (on head) - mirrored
            let frontHair;
            switch (womensHair) {
                case 'LONG_CURLS':
                    frontHair = (
                        <g>
                            <path d="M20 2 Q17 0 14 2 Q14 5 15 6 L19 6 Q20 5 20 2" fill={colors.hair} />
                            <path d="M15 5 Q14 7 15 9" stroke={colors.hair} strokeWidth="1" fill="none" />
                        </g>
                    );
                    break;
                case 'LOOSE_WAVES':
                    frontHair = (
                        <g>
                            <path d="M20 2 Q17 0 14 2 Q14 5 15 6 L19 6 Q20 5 20 2" fill={colors.hair} />
                            <path d="M20 5 Q21 7 20 9" stroke={colors.hair} strokeWidth="1.5" fill="none" />
                        </g>
                    );
                    break;
                case 'POMPADOUR':
                    frontHair = (
                        <g>
                            <ellipse cx="17" cy="1" rx="4" ry="2.5" fill={colors.hair} />
                            <path d="M20 3 Q17 2 14 3 Q14 5 15 6 L19 6 Q20 5 20 3" fill={colors.hair} />
                        </g>
                    );
                    break;
                case 'CHIGNON':
                    frontHair = (
                        <g>
                            <path d="M20 3 Q17 1 14 3 Q14 5 15 6 L19 6 Q20 5 20 3" fill={colors.hair} />
                            <ellipse cx="19" cy="8" rx="2" ry="2" fill={colors.hair} />
                        </g>
                    );
                    break;
                default:
                    frontHair = <path d="M20 2 Q17 0 14 2 Q14 5 15 6 L19 6 Q20 5 20 2" fill={colors.hair} />;
            }

            return { backHair, frontHair };
        };

        // West-facing (left profile)
        const hairLayersW = renderWomensHairProfileW();

        return (
            <svg viewBox="0 0 32 40" className="w-10 h-12 overflow-visible">
                {/* Shadow */}
                <ellipse cx="16" cy="38" rx="7" ry="2" fill="rgba(0,0,0,0.15)" />

                {/* Back hair for long styles */}
                {isFemale && hairLayersW?.backHair}

                {/* Legs / Dress skirt */}
                {isFemale && (style === 'BUSTLE_DRESS' || style === 'WALKING_DRESS' || style === 'SERVANT_DRESS') ? (
                    <g>
                        {/* Profile dress with bell/conical shape - mirrored, smooth taper from waist to hem */}
                        {/* Main skirt: starts narrow at waist (12-20), flares out to wide hem (6-26) */}
                        <path d="M20 18 Q22 22 24 28 Q26 33 26 36 L6 36 Q6 33 8 28 Q10 22 12 18 Z" fill={bodyColor.main} />
                        {/* Bustle showing in profile - protrudes at back (mirrored to right side) */}
                        <ellipse cx="23" cy="22" rx="2.5" ry="3" fill={bodyColor.dark} />
                        {/* Dress folds showing the bell shape */}
                        <path d="M21 20 Q23 26 25 35" stroke={bodyColor.dark} strokeWidth="0.5" fill="none" />
                        <path d="M18 19 Q20 27 22 35" stroke={bodyColor.dark} strokeWidth="0.4" fill="none" opacity="0.7" />
                        <path d="M14 19 Q12 27 10 35" stroke={bodyColor.dark} strokeWidth="0.4" fill="none" opacity="0.7" />
                        <path d="M11 20 Q9 26 7 35" stroke={bodyColor.dark} strokeWidth="0.5" fill="none" />
                        {/* Hem detail */}
                        <path d="M6 35.5 Q16 34 26 35.5" stroke={bodyColor.dark} strokeWidth="0.5" fill="none" />
                    </g>
                ) : (
                    // Profile trousers and shoes - West facing (mirrored from East)
                    <>
                        {/* Back leg - partially hidden, darker */}
                        <path d={`M20 26 Q20.5 28 20.5 31 L${21 + legOffset * 0.4} 34 L${21 + legOffset * 0.4} 35.5 L${18 + legOffset * 0.4} 35.5 L${18 + legOffset * 0.4} 34 Q17.5 31 17 28 L17 26 Z`}
                              fill={colors.secondaryDark} />
                        {/* Front leg - more visible */}
                        <path d={`M17 26 Q16.5 28 16.5 31 L${16 - legOffset * 0.4} 34 L${16 - legOffset * 0.4} 35.5 L${12 - legOffset * 0.4} 35.5 L${12 - legOffset * 0.4} 34 Q11.5 31 11.5 28 L12 26 Z`}
                              fill={colors.secondary} />
                        {/* Back shoe - Victorian boot profile, partially hidden */}
                        <path d={`M${22 + legOffset * 0.4} 35 L${23 + legOffset * 0.4} 36.5 Q${23.5 + legOffset * 0.4} 37.5 ${22 + legOffset * 0.4} 38 L${17.5 + legOffset * 0.4} 38 L${17.5 + legOffset * 0.4} 35 Z`}
                              fill="#0a0500" />
                        {/* Front shoe - full boot profile with toe pointing left */}
                        <path d={`M${16.5 - legOffset * 0.4} 35 L${17 - legOffset * 0.4} 36.5 Q${17 - legOffset * 0.4} 37.5 ${16 - legOffset * 0.4} 38 L${10 - legOffset * 0.4} 38 Q${9 - legOffset * 0.4} 37 ${9.5 - legOffset * 0.4} 36 L${11.5 - legOffset * 0.4} 35 Z`}
                              fill="#1a0a05" />
                        {/* Front shoe highlight */}
                        <path d={`M${11 - legOffset * 0.4} 36.5 L${15 - legOffset * 0.4} 36.5`}
                              stroke="#3a2515" strokeWidth="0.3" fill="none" />
                    </>
                )}

                {/* Back arm - color matches uniform */}
                <g transform={`rotate(${armSwing * 0.7} 20 14)`}>
                    <path d="M22 12 L26 22" stroke={sleeveColor} strokeWidth="3" fill="none" />
                    <ellipse cx="26" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                </g>

                {/* Body (bodice/jacket) */}
                {isFemale ? (
                    <g>
                        {/* Fitted bodice - narrow waist connects to skirt */}
                        <path d="M22 10 Q24 12 22 15 L22 18 L10 18 L10 15 Q10 12 12 10 Z" fill={bodyColor.main} />
                        {/* Waist cinch visible in profile */}
                        <path d="M10 17 Q16 15 22 17" stroke={bodyColor.dark} strokeWidth="0.5" fill="none" />
                        {/* Slight bust curve in profile */}
                        <path d="M11 12 Q9 14 10 16" stroke={bodyColor.dark} strokeWidth="0.3" fill="none" />
                    </g>
                ) : (
                    <g>
                        {/* Jacket body - proper tailored shape (mirrored) */}
                        <path d="M22 10 Q23 12 23 16 L23 26 L11 26 L11 16 Q11 12 12 10 Z" fill={bodyColor.main} />
                        {/* Jacket lapel visible in profile */}
                        <path d="M12 10 L11 12 L12 14" fill={bodyColor.dark} />
                        {/* Jacket front edge */}
                        <path d="M12 14 L12 26" stroke={bodyColor.dark} strokeWidth="0.4" />
                        {/* Pocket detail */}
                        <path d="M13 20 L13 22" stroke={bodyColor.dark} strokeWidth="0.3" opacity="0.6" />
                        {/* Back pleat/vent suggestion */}
                        <path d="M22 22 L22 26" stroke={bodyColor.dark} strokeWidth="0.3" opacity="0.5" />
                        {/* Vest peek at front */}
                        <path d="M12.5 12 L12.5 18" stroke={colors.secondary} strokeWidth="1" />
                    </g>
                )}

                {/* Front arm - color matches uniform */}
                <g transform={`rotate(${-armSwing * 0.7} 14 14)`}>
                    <path d="M14 12 L8 22" stroke={sleeveColor} strokeWidth="3" fill="none" />
                    <ellipse cx="8" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                </g>

                {/* Collar - not shown for priests (have Roman collar on body) */}
                {style !== 'PRIEST_CASSOCK' && style !== 'NUN_HABIT' && (
                    <rect x="14" y="9" width="4" height="2" fill={colors.white} />
                )}

                {/* Neck */}
                <rect x="14" y="7" width="3" height="4" fill={colors.skin} />

                {/* Ear (behind head) */}
                <ellipse cx="19.5" cy="5.5" rx="1" ry="1.4" fill={colors.skinShadow} />
                <ellipse cx="19.2" cy="5.5" rx="0.6" ry="1" fill={colors.skin} />

                {/* Head - left profile - path-based for better shape (mirrored) */}
                <path
                    d="M19 2 C17 0 14 0 13 2 L12.5 4 Q12 5 12.5 6.5 C13 8 15 9.5 17 9 C19 8.5 19.5 7 19.5 5 C19.5 3 19 2 19 2 Z"
                    fill={colors.skin}
                />
                {/* Face shading - subtle shadow on back of head */}
                <path d="M19 3 C19 5 19 7 18 8.5" stroke={colors.skinShadow} strokeWidth="0.4" fill="none" opacity="0.5" />

                {/* Cheek blush - portrait style */}
                <ellipse cx="15" cy="6" rx="1.5" ry="1" fill={colors.skinBlush} opacity="0.35" />

                {/* Profile features - refined nose with nostril (mirrored) */}
                <path d="M12.5 4.5 Q11.5 4.8 11.2 5.2 Q11.5 5.8 12.5 6" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="0.25" />
                <circle cx="12" cy="5.8" r="0.2" fill={colors.skinShadow} opacity="0.4" />

                {/* Eye - larger, more detailed */}
                <ellipse cx="14.2" cy="4.2" rx="1" ry="0.7" fill="white" />
                <ellipse cx="14" cy="4.2" rx="0.5" ry="0.45" fill="#3d2314" />
                <circle cx="13.8" cy="4" r="0.15" fill="white" opacity="0.9" />
                {/* Upper eyelid line */}
                <path d="M15.2 3.6 Q14.2 3.4 13.2 3.7" stroke={colors.skinShadow} strokeWidth="0.2" fill="none" />

                {/* Eyebrow - thicker, more defined */}
                <path d="M15.5 3.2 Q14.2 2.8 13.2 3.1" stroke={colors.hair} strokeWidth="0.5" fill="none" />

                {/* Lips - subtle */}
                <path d="M13 7 Q12.7 7.2 13 7.4" stroke={colors.skinShadow} strokeWidth="0.3" fill="none" opacity="0.6" />

                {/* Facial hair profile - adjusted for new head shape (mirrored) */}
                {!isFemale && facialHair !== 'NONE' && (
                    <>
                        {/* Pencil mustache - thin line in profile (mirrored) */}
                        {facialHair === 'PENCIL_MUSTACHE' && (
                            <path d="M14 5.9 L11.5 6" stroke={colors.hair} strokeWidth="0.5" fill="none" />
                        )}
                        {/* Regular mustache in profile (mirrored) */}
                        {facialHair === 'MUSTACHE' && (
                            <path d="M14.5 5.8 Q13 5.7 12 6.1 L12.2 6.4 Q13.5 6.5 14.5 6.2 Z" fill={colors.hair} />
                        )}
                        {/* Handlebar - big curly mustache in profile (mirrored) */}
                        {facialHair === 'HANDLEBAR' && (
                            <>
                                <path d="M15 5.8 Q13 5.6 12 6 L12 6.5 Q13 6.8 15 6.4 Z" fill={colors.hair} />
                                <path d="M12 6 Q11 5.8 10.7 6.3 Q10.8 6.8 11.5 6.8 L12 6.5 Z" fill={colors.hair} />
                            </>
                        )}
                        {/* Stubble in profile (mirrored) */}
                        {facialHair === 'STUBBLE' && (
                            <ellipse cx="15" cy="7" rx="2" ry="1.5" fill={colors.hair} opacity="0.12" />
                        )}
                        {facialHair === 'FULL_BEARD' && (
                            <>
                                <path d="M14.5 5.8 Q13 5.7 12 6.1 L12.2 6.4 Q13.5 6.5 14.5 6.2 Z" fill={colors.hair} />
                                <path d="M14.5 6.5 Q13 7.5 13.5 8.5 Q15 9.2 17 8" fill={colors.hair} />
                            </>
                        )}
                        {facialHair === 'GOATEE' && (
                            <>
                                <path d="M14 5.9 L12 6.1" stroke={colors.hair} strokeWidth="0.4" fill="none" />
                                <path d="M14.5 7 Q13.5 8.2 15 8.5" fill={colors.hair} />
                            </>
                        )}
                        {facialHair === 'MUTTON_CHOPS' && (
                            <path d="M19 4 Q19.5 6 19 7.5" fill={colors.hair} />
                        )}
                        {facialHair === 'IMPERIAL' && (
                            <>
                                <path d="M14 5.9 Q12 5.8 11.2 5.5" stroke={colors.hair} strokeWidth="0.5" fill="none" />
                                <path d="M14.5 7 Q13.8 8 15 8.3" fill={colors.hair} />
                            </>
                        )}
                    </>
                )}

                {/* Hair - front layer - adjusted for new head shape (mirrored) */}
                {isFemale ? (
                    hairLayersW?.frontHair
                ) : (
                    <path d="M19 1.5 Q17 0 13.5 1 Q13 2.5 14 3.5 L18 4 Q19 3 19 1.5" fill={colors.hair} />
                )}

                {/* Hat - mirrored - using consistent hatColors */}
                {hat === 'TOP_HAT' && (
                    <>
                        <ellipse cx="17" cy="1" rx="4.5" ry="1" fill={hatColors.main} />
                        <path d="M21 1 Q21 -2 17 -2 Q13 -2 13 1" fill={hatColors.main} />
                    </>
                )}
                {hat === 'BOWLER' && (
                    <>
                        <ellipse cx="17" cy="1" rx="5" ry="1.2" fill={hatColors.main} />
                        <path d="M21 1 Q21 -0.5 17 -0.5 Q13 -0.5 13 1" fill={hatColors.main} />
                    </>
                )}
                {hat === 'FLAT_CAP' && (
                    <>
                        <path d="M21 2 L13 2 Q14 0 17 0 Q20 0 21 2" fill={hatColors.main} />
                        <path d="M13 2 L10 3 L13 2.5" fill={hatColors.dark} />
                    </>
                )}
                {hat === 'KEPI' && (
                    <>
                        <rect x="13" y="0" width="7" height="2.5" fill={hatColors.main} rx="1" />
                        <path d="M13 1.5 L11 2 L13 2" fill={hatColors.dark} />
                    </>
                )}
                {hat === 'BONNET' && (
                    <path d="M21 0 Q17 -3 13 0 Q13 2 14 2 L20 2 Q21 2 21 0" fill={hatColors.main} />
                )}
                {hat === 'WIDE_BRIM' && (
                    <>
                        <ellipse cx="17" cy="1" rx="6" ry="1.2" fill={hatColors.main} />
                        <ellipse cx="17" cy="0" rx="3.5" ry="1.8" fill={hatColors.main} />
                    </>
                )}
                {hat === 'FEZ' && (
                    <>
                        <path d="M19 2 L19 -1 Q17 -2 15 -1 L15 2" fill="#8b0000" />
                        <ellipse cx="17" cy="2" rx="3" ry="0.8" fill="#8b0000" />
                    </>
                )}
                {hat === 'BERET' && (
                    <ellipse cx="17" cy="1" rx="4.5" ry="1.8" fill={hatColors.main} />
                )}
                {hat === 'BIRETTA' && (
                    <>
                        <rect x="14" y="0" width="7" height="2.5" fill="#1a1a1a" />
                        <path d="M17 -0.5 L17 -2" stroke="#1a1a1a" strokeWidth="1" />
                        <circle cx="17" cy="-1.5" r="0.6" fill="#1a1a1a" />
                    </>
                )}
                {hat === 'CORNETTE' && (
                    <>
                        <path d="M12 2 Q12 -1 17 -1 Q22 -1 22 2 L22 6 Q17 7 12 6 Z" fill={colors.white} />
                        <path d="M12 1 Q12 -3 17 -3 Q22 -3 22 1" fill="#1a1a1a" />
                        <path d="M12 1 Q10 -1 11 -3" stroke="#1a1a1a" strokeWidth="2" fill="none" />
                    </>
                )}
                {hat === 'PICKELHAUBE' && (
                    <>
                        <ellipse cx="17" cy="1" rx="4.5" ry="2" fill="#2a3d2a" />
                        <path d="M13 1 Q13 -2 17 -2 Q21 -2 21 1" fill="#2a3d2a" />
                        <path d="M17 -2 L17 -5" stroke="#c0c0c0" strokeWidth="1" />
                        <circle cx="17" cy="-5" r="0.6" fill="#c0c0c0" />
                        <ellipse cx="17" cy="0.5" rx="1.5" ry="1" fill={colors.brass} />
                    </>
                )}
                {hat === 'PITH_HELMET' && (
                    <>
                        <ellipse cx="17" cy="1.5" rx="5.5" ry="1.2" fill="#e8dcc8" />
                        <path d="M12 1.5 Q12 -2 17 -2 Q22 -2 22 1.5" fill="#e8dcc8" />
                        <rect x="12.5" y="0" width="9" height="1" fill="#c4a77d" />
                    </>
                )}

                {/* Hair visible under hat from profile (West - mirrored) */}
                {hat !== 'NONE' && hat !== 'CORNETTE' && (
                    <>
                        {/* Hair at back of head visible under hat */}
                        <path d="M20 5 Q21 6 20 7" stroke={colors.hair} strokeWidth="0.8" fill="none" />
                    </>
                )}
            </svg>
        );
    };

    return (
        <div className={`relative w-full h-full flex items-center justify-center ${className}`}
             style={{
                 transform: `translateY(${-bounce}px) translateX(${idleSway}px) rotate(${headTilt}deg)`,
                 transition: isMoving ? 'none' : 'transform 0.4s ease-in-out',
                 willChange: 'transform',
             }}>
            {renderSprite()}
        </div>
    );
};

// Memoize to prevent parent re-renders from causing NPC re-renders
// Internal animations (breathing, walking) use setInterval/useState which still work
export default React.memo(NpcSprite, (prev, next) => {
    return (
        prev.npc.id === next.npc.id &&
        prev.npc.location.x === next.npc.location.x &&
        prev.npc.location.y === next.npc.location.y &&
        prev.npc.location.direction === next.npc.location.direction &&
        prev.direction === next.direction &&
        prev.isMoving === next.isMoving &&
        prev.className === next.className
    );
});
