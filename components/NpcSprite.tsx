
import React, { useEffect, useState, useMemo } from 'react';
import { NPC } from '../types';

interface NpcSpriteProps {
    npc: NPC;
    className?: string;
}

// 1889 Paris Exposition - Historically accurate clothing types
type ClothingStyle =
    | 'MORNING_SUIT'      // Formal daywear for gentlemen
    | 'FROCK_COAT'        // Semi-formal men's coat
    | 'SACK_SUIT'         // Business attire
    | 'WORKING_CLASS'     // Simple jacket and trousers
    | 'MILITARY_UNIFORM'  // French or foreign military
    | 'BUSTLE_DRESS'      // Women's fashionable dress with bustle
    | 'WALKING_DRESS'     // Women's practical day dress
    | 'SERVANT_DRESS'     // Simple women's working attire
    | 'EXOTIC'            // Colonial/foreign traditional dress
    | 'BOHEMIAN';         // Artistic/unconventional

type HatStyle =
    | 'TOP_HAT'
    | 'BOWLER'
    | 'FLAT_CAP'
    | 'KEPI'              // Military cap
    | 'BONNET'            // Women's bonnet
    | 'WIDE_BRIM'         // Women's fashionable hat
    | 'FEZ'               // Ottoman/North African
    | 'BERET'             // Artist's beret
    | 'NONE';

type FacialHairStyle = 'NONE' | 'MUSTACHE' | 'FULL_BEARD' | 'GOATEE' | 'MUTTON_CHOPS' | 'IMPERIAL';

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
        case 'mustache': return 'MUSTACHE';
        case 'full_beard': return 'FULL_BEARD';
        case 'goatee': return 'GOATEE';
        case 'mutton_chops': return 'MUTTON_CHOPS';
        case 'imperial': return 'IMPERIAL';
        case 'stubble': return 'NONE';
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

        if (prof.includes('servant') || prof.includes('maid') || prof.includes('worker')) {
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
        if (prof.includes('military') || prof.includes('soldier') || prof.includes('officer') || prof.includes('guard')) {
            style = 'MILITARY_UNIFORM';
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

const NpcSprite: React.FC<NpcSpriteProps> = ({ npc, className }) => {
    const [frame, setFrame] = useState(0);
    const dir = npc.location.direction;

    useEffect(() => {
        const interval = setInterval(() => setFrame(f => f + 1), 150);
        return () => clearInterval(interval);
    }, []);

    // Memoize clothing determination for consistency
    const clothing = useMemo(() => determineClothing(npc), [npc.id, npc.profession, npc.gender]);

    // Use seeded random for consistent appearance
    const colorVariation = useMemo(() => seededRandom(npc.id, 1), [npc.id]);

    // Animation
    const legOffset = Math.sin(frame * 0.5) * 4;
    const armSwing = Math.sin(frame * 0.5) * 6;
    const bounce = Math.abs(Math.sin(frame * 0.5)) * 1;

    // Enhanced color palette based on NPC colors with variation
    const colors = useMemo(() => {
        const primary = npc.colors.primary;
        const secondary = npc.colors.secondary;
        const skin = npc.colors.skin;
        const hair = npc.colors.hair;

        // Darken/lighten functions
        const adjustColor = (hex: string, amount: number): string => {
            const num = parseInt(hex.replace('#', ''), 16);
            const r = Math.min(255, Math.max(0, (num >> 16) + amount));
            const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
            const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
            return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
        };

        return {
            skin,
            skinShadow: adjustColor(skin, -30),
            skinHighlight: adjustColor(skin, 20),
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
        const renderWomensHairFront = () => {
            if (!isFemale) return null;

            switch (womensHair) {
                case 'UPDO':
                    // Classic Gibson Girl updo - hair piled on top, NOT covering forehead
                    return (
                        <g>
                            <ellipse cx="16" cy="2" rx="4" ry="2.5" fill={colors.hair} />
                            <path d="M12 4 Q16 3 20 4" fill={colors.hair} />
                        </g>
                    );
                case 'LONG_CURLS':
                    // Front portion - just the top of head, NOT the forehead
                    return (
                        <g>
                            <path d="M12 4 Q16 2 20 4 L20 5 Q16 4 12 5 Z" fill={colors.hair} />
                            {/* Side curls framing face - in front of ears but NOT on face */}
                            <path d="M11 5 Q10 7 11 9" stroke={colors.hair} strokeWidth="1.5" fill="none" />
                            <path d="M21 5 Q22 7 21 9" stroke={colors.hair} strokeWidth="1.5" fill="none" />
                        </g>
                    );
                case 'CHIGNON':
                    // Hair swept back - just top portion
                    return (
                        <path d="M12 4 Q16 2 20 4 Q20 5 16 5 Q12 5 12 4" fill={colors.hair} />
                    );
                case 'POMPADOUR':
                    // High volume on top - fashionable 1889 style
                    return (
                        <g>
                            <ellipse cx="16" cy="1.5" rx="4.5" ry="3" fill={colors.hair} />
                            <path d="M12 4 Q16 3 20 4" fill={colors.hair} />
                            <ellipse cx="16" cy="2" rx="3" ry="2" fill={colors.hairHighlight} opacity="0.3" />
                        </g>
                    );
                case 'BRAIDED':
                    // Braided hair pinned up
                    return (
                        <g>
                            <path d="M12 4 Q16 2 20 4 L19 5 Q16 4 13 5 Z" fill={colors.hair} />
                            <ellipse cx="16" cy="2" rx="3" ry="1.5" fill={colors.hair} />
                            {/* Braid details */}
                            <path d="M14 2 L15 3 L16 2 L17 3 L18 2" stroke={colors.hairHighlight} strokeWidth="0.5" fill="none" />
                        </g>
                    );
                case 'LOOSE_WAVES':
                    // Top portion with waves
                    return (
                        <g>
                            <path d="M11 4 Q13 2 16 2 Q19 2 21 4 Q20 5 16 5 Q12 5 11 4" fill={colors.hair} />
                            {/* Framing waves */}
                            <path d="M11 5 Q10 6 11 8" stroke={colors.hair} strokeWidth="1.2" fill="none" />
                            <path d="M21 5 Q22 6 21 8" stroke={colors.hair} strokeWidth="1.2" fill="none" />
                        </g>
                    );
                default:
                    return <path d="M11.5 4 Q16 2 20.5 4 Q20 5 19 5 L13 5 Q12 5 11.5 4" fill={colors.hair} />;
            }
        };

        // South-facing (front view)
        if (dir === 'S') {
            return (
                <svg viewBox="0 0 32 40" className="w-10 h-12 overflow-visible drop-shadow-md">
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
                    </defs>

                    {/* Shadow */}
                    <ellipse cx="16" cy="38" rx="7" ry="2" fill="rgba(0,0,0,0.15)" />

                    {/* === BACK HAIR LAYER (behind body) === */}
                    {renderWomensHairBack()}

                    {/* Legs/Skirt */}
                    {isFemale && (style === 'BUSTLE_DRESS' || style === 'WALKING_DRESS' || style === 'SERVANT_DRESS') ? (
                        // Much more elaborate dress with bustle silhouette
                        <g>
                            {/* Main skirt - bell shape */}
                            <path d={`M10 24 Q6 30 7 36 L25 36 Q26 30 22 24 Z`}
                                  fill={`url(#dress-${npc.id})`} />
                            {/* Bustle effect at back */}
                            <ellipse cx="20" cy="26" rx="3" ry="2" fill={colors.primaryDark} />
                            {/* Skirt draping/folds */}
                            <path d="M10 26 Q9 30 8 35" stroke={colors.primaryDark} strokeWidth="0.5" fill="none" />
                            <path d="M13 25 Q12 30 11 35" stroke={colors.primaryDark} strokeWidth="0.5" fill="none" />
                            <path d="M19 25 Q20 30 21 35" stroke={colors.primaryDark} strokeWidth="0.5" fill="none" />
                            <path d="M22 26 Q23 30 24 35" stroke={colors.primaryDark} strokeWidth="0.5" fill="none" />
                            {/* Hem decoration */}
                            <path d="M7 35 Q16 37 25 35" stroke={colors.secondary} strokeWidth="0.8" fill="none" />
                            {/* Petticoat peeking */}
                            <path d="M8 35.5 L24 35.5" stroke={colors.white} strokeWidth="0.5" fill="none" />
                        </g>
                    ) : (
                        // Trousers
                        <>
                            <path d={`M12 26 L${11 - legOffset * 0.3} 35`}
                                  stroke={colors.secondary} strokeWidth="3" fill="none" />
                            <path d={`M20 26 L${21 + legOffset * 0.3} 35`}
                                  stroke={colors.secondary} strokeWidth="3" fill="none" />
                            {/* Shoes */}
                            <ellipse cx={11 - legOffset * 0.3} cy="35.5" rx="2" ry="1" fill={colors.secondaryDark} />
                            <ellipse cx={21 + legOffset * 0.3} cy="35.5" rx="2" ry="1" fill={colors.secondaryDark} />
                        </>
                    )}

                    {/* Body/Clothing */}
                    {style === 'MILITARY_UNIFORM' ? (
                        // Military tunic with buttons
                        <>
                            <path d="M9 12 Q9 10 16 10 Q23 10 23 12 L23 26 L9 26 Z"
                                  fill={colors.primary} />
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
                                  fill={colors.primary} />
                            {/* Waist cinch */}
                            <path d="M12 18 Q16 16 20 18 L21 24 Q16 25 11 24 Z"
                                  fill={colors.primary} />
                            {/* High collar with lace */}
                            <path d="M13 10 Q16 8.5 19 10" fill="none" stroke={colors.white} strokeWidth="1.5" />
                            <path d="M14 9.5 Q16 8 18 9.5" fill="none" stroke={colors.white} strokeWidth="0.5" />
                            {/* Decorative buttons or brooch */}
                            <circle cx="16" cy="12" r="0.7" fill={colors.gold} />
                            <circle cx="16" cy="15" r="0.5" fill={colors.gold} />
                            {/* Shoulder puffs (leg-of-mutton sleeves were fashionable) */}
                            <ellipse cx="10" cy="12" rx="2" ry="1.5" fill={colors.primary} />
                            <ellipse cx="22" cy="12" rx="2" ry="1.5" fill={colors.primary} />
                        </>
                    ) : (
                        // Men's jacket/coat
                        <>
                            <path d="M9 12 Q9 10 16 10 Q23 10 23 12 L23 26 L9 26 Z"
                                  fill={`url(#coat-${npc.id})`} />
                            {/* Lapels */}
                            <path d="M12 10 L14 16 L12 16 Z" fill={colors.primaryLight} />
                            <path d="M20 10 L18 16 L20 16 Z" fill={colors.primaryLight} />
                            {/* Vest/Waistcoat showing */}
                            <path d="M14 12 L14 24 L18 24 L18 12 Q16 11 14 12" fill={colors.secondary} />
                            {/* Buttons */}
                            <circle cx="16" cy="15" r="0.5" fill={colors.gold} />
                            <circle cx="16" cy="18" r="0.5" fill={colors.gold} />
                            <circle cx="16" cy="21" r="0.5" fill={colors.gold} />
                        </>
                    )}

                    {/* Arms */}
                    <g transform={`rotate(${armSwing} 11 14)`}>
                        <path d="M9 12 L5 22 L7 22 L11 14" fill={colors.primary} />
                        <ellipse cx="6" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>
                    <g transform={`rotate(${-armSwing} 21 14)`}>
                        <path d="M23 12 L27 22 L25 22 L21 14" fill={colors.primary} />
                        <ellipse cx="26" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>

                    {/* Neck */}
                    <rect x="14" y="8" width="4" height="3" fill={colors.skin} />

                    {/* Collar/Tie */}
                    {!isFemale && (
                        <>
                            <path d="M13 10 L16 12 L19 10" fill="none" stroke={colors.white} strokeWidth="1.5" />
                            <polygon points="15,11 17,11 16,14" fill="#722f37" />
                        </>
                    )}

                    {/* Ears (behind head) */}
                    <ellipse cx="11.5" cy="6" rx="0.7" ry="1" fill={colors.skin} />
                    <ellipse cx="20.5" cy="6" rx="0.7" ry="1" fill={colors.skin} />

                    {/* Head */}
                    <ellipse cx="16" cy="6" rx="4.5" ry="4" fill={colors.skin} />

                    {/* Eyes */}
                    <ellipse cx="14" cy="5.5" rx="1" ry="0.7" fill="white" />
                    <ellipse cx="18" cy="5.5" rx="1" ry="0.7" fill="white" />
                    <circle cx="14" cy="5.5" r="0.4" fill="#3d2314" />
                    <circle cx="18" cy="5.5" r="0.4" fill="#3d2314" />

                    {/* Eyebrows */}
                    <path d="M13 4.5 L15 4.3" stroke={colors.hair} strokeWidth="0.4" />
                    <path d="M17 4.3 L19 4.5" stroke={colors.hair} strokeWidth="0.4" />

                    {/* Nose */}
                    <path d="M16 5.5 L16 7" stroke={colors.skinShadow} strokeWidth="0.3" />

                    {/* Mouth */}
                    <path d="M14.5 8 Q16 8.5 17.5 8" stroke={colors.skinShadow} strokeWidth="0.3" fill="none" />

                    {/* === FRONT HAIR LAYER (on top of head, NOT covering face) === */}
                    {isFemale ? (
                        renderWomensHairFront()
                    ) : (
                        // Men's hair - short sides
                        <>
                            <path d="M11.5 4 Q16 2 20.5 4 Q20 5 19 5 L13 5 Q12 5 11.5 4" fill={colors.hair} />
                            <path d="M11 5 Q11 7 12 8" stroke={colors.hair} strokeWidth="1" fill="none" />
                            <path d="M21 5 Q21 7 20 8" stroke={colors.hair} strokeWidth="1" fill="none" />
                        </>
                    )}

                    {/* Facial hair (men only) */}
                    {!isFemale && facialHair !== 'NONE' && (
                        <>
                            {(facialHair === 'MUSTACHE' || facialHair === 'FULL_BEARD' || facialHair === 'IMPERIAL') && (
                                <path d="M13.5 7 Q16 8 18.5 7" fill={colors.hair} />
                            )}
                            {facialHair === 'FULL_BEARD' && (
                                <path d="M13 7.5 Q16 11 19 7.5" fill={colors.hair} />
                            )}
                            {facialHair === 'GOATEE' && (
                                <path d="M14.5 8 Q16 10 17.5 8" fill={colors.hair} />
                            )}
                            {facialHair === 'MUTTON_CHOPS' && (
                                <>
                                    <path d="M11.5 5 Q11 7 12 8" fill={colors.hair} />
                                    <path d="M20.5 5 Q21 7 20 8" fill={colors.hair} />
                                </>
                            )}
                            {facialHair === 'IMPERIAL' && (
                                <path d="M14 8 Q16 9.5 18 8" fill={colors.hair} />
                            )}
                        </>
                    )}

                    {/* Hat */}
                    {hat === 'TOP_HAT' && (
                        <>
                            <ellipse cx="16" cy="2.5" rx="5" ry="1.2" fill={colors.secondary} />
                            <path d="M12 2.5 Q12 -1 16 -1 Q20 -1 20 2.5" fill={colors.secondary} />
                            <rect x="12" y="1.5" width="8" height="0.8" fill={colors.secondaryDark} />
                        </>
                    )}
                    {hat === 'BOWLER' && (
                        <>
                            <ellipse cx="16" cy="2.5" rx="5.5" ry="1.3" fill={colors.secondary} />
                            <path d="M12 2.5 Q12 0.5 16 0.5 Q20 0.5 20 2.5" fill={colors.secondary} />
                        </>
                    )}
                    {hat === 'FLAT_CAP' && (
                        <>
                            <path d="M11 3 L21 3 Q20 1 16 1 Q12 1 11 3" fill={colors.secondary} />
                            <path d="M10 3 L13 4 L11 3" fill={colors.secondaryDark} />
                        </>
                    )}
                    {hat === 'KEPI' && (
                        <>
                            <rect x="12" y="1" width="8" height="3" fill={colors.primary} rx="1" />
                            <ellipse cx="16" cy="1" rx="4" ry="0.8" fill={colors.primaryDark} />
                            <rect x="14" y="0.5" width="4" height="0.5" fill={colors.gold} />
                        </>
                    )}
                    {hat === 'BONNET' && (
                        <>
                            {/* Bonnet sits on top of head, not covering eyes */}
                            <path d="M11 2 Q16 -2 21 2 Q21 4 20 4 L12 4 Q11 4 11 2" fill={colors.secondary} />
                            {/* Bonnet ribbon/tie */}
                            <path d="M19 3 Q21 2 22 4" stroke={colors.secondary} strokeWidth="1.5" fill="none" />
                        </>
                    )}
                    {hat === 'WIDE_BRIM' && (
                        <>
                            <ellipse cx="16" cy="2" rx="7" ry="1.5" fill={colors.secondary} />
                            <ellipse cx="16" cy="1" rx="4" ry="2" fill={colors.secondary} />
                            <circle cx="19" cy="0" r="1" fill={colors.primaryLight} />
                        </>
                    )}
                    {hat === 'FEZ' && (
                        <>
                            <path d="M13 3 L13 0 Q16 -1 19 0 L19 3" fill="#8b0000" />
                            <ellipse cx="16" cy="3" rx="4" ry="1" fill="#8b0000" />
                            <path d="M16 -1 L17 1" stroke={colors.secondary} strokeWidth="0.5" />
                        </>
                    )}
                    {hat === 'BERET' && (
                        <ellipse cx="16" cy="2" rx="5" ry="2" fill={colors.secondary} />
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
                <svg viewBox="0 0 32 40" className="w-10 h-12 overflow-visible drop-shadow-md">
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
                            <ellipse cx="16" cy="25" rx="4" ry="2.5" fill={colors.primary} />
                            <ellipse cx="16" cy="26" rx="3" ry="2" fill={colors.primaryDark} />
                            {/* Skirt folds */}
                            <path d="M10 26 Q9 30 8 35" stroke={colors.primaryDark} strokeWidth="0.5" fill="none" />
                            <path d="M14 26 Q13 30 12 35" stroke={colors.primaryDark} strokeWidth="0.5" fill="none" />
                            <path d="M18 26 Q19 30 20 35" stroke={colors.primaryDark} strokeWidth="0.5" fill="none" />
                            <path d="M22 26 Q23 30 24 35" stroke={colors.primaryDark} strokeWidth="0.5" fill="none" />
                        </g>
                    ) : (
                        <>
                            <path d={`M12 26 L${11 + legOffset * 0.3} 35`}
                                  stroke={colors.secondary} strokeWidth="3" fill="none" />
                            <path d={`M20 26 L${21 - legOffset * 0.3} 35`}
                                  stroke={colors.secondary} strokeWidth="3" fill="none" />
                            <ellipse cx={11 + legOffset * 0.3} cy="35.5" rx="2" ry="1" fill={colors.secondaryDark} />
                            <ellipse cx={21 - legOffset * 0.3} cy="35.5" rx="2" ry="1" fill={colors.secondaryDark} />
                        </>
                    )}

                    {/* Body from back */}
                    {isFemale ? (
                        <g>
                            <path d="M11 12 Q11 10 16 10 Q21 10 21 12 L20 18 Q16 17 12 18 L11 12 Z"
                                  fill={colors.primary} />
                            <path d="M12 18 Q16 16 20 18 L21 24 Q16 25 11 24 Z"
                                  fill={colors.primary} />
                        </g>
                    ) : (
                        <>
                            <path d="M9 12 Q9 10 16 10 Q23 10 23 12 L23 26 L9 26 Z" fill={colors.primary} />
                            <line x1="16" y1="10" x2="16" y2="26" stroke={colors.primaryDark} strokeWidth="0.5" />
                        </>
                    )}

                    {/* Arms */}
                    <g transform={`rotate(${-armSwing} 11 14)`}>
                        <path d="M9 12 L5 22 L7 22 L11 14" fill={colors.primary} />
                        <ellipse cx="6" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>
                    <g transform={`rotate(${armSwing} 21 14)`}>
                        <path d="M23 12 L27 22 L25 22 L21 14" fill={colors.primary} />
                        <ellipse cx="26" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>

                    {/* Collar */}
                    <path d="M13 10 Q16 9 19 10" fill={colors.white} />

                    {/* Neck */}
                    <rect x="14" y="8" width="4" height="2" fill={colors.skin} />

                    {/* Head from back */}
                    <ellipse cx="16" cy="6" rx="4.5" ry="4" fill={colors.skin} />

                    {/* Hair from back - use style-specific rendering */}
                    {isFemale ? (
                        renderWomensHairBackView()
                    ) : (
                        <path d="M11.5 3 Q16 1 20.5 3 Q21 6 20 7 L12 7 Q11 6 11.5 3" fill={colors.hair} />
                    )}

                    {/* Ears */}
                    <ellipse cx="11.5" cy="6" rx="0.7" ry="1" fill={colors.skin} />
                    <ellipse cx="20.5" cy="6" rx="0.7" ry="1" fill={colors.skin} />

                    {/* Hat (same as front, slightly adjusted) */}
                    {hat === 'TOP_HAT' && (
                        <>
                            <ellipse cx="16" cy="2.5" rx="5" ry="1.2" fill={colors.secondary} />
                            <path d="M12 2.5 Q12 -1 16 -1 Q20 -1 20 2.5" fill={colors.secondary} />
                        </>
                    )}
                    {hat === 'BOWLER' && (
                        <>
                            <ellipse cx="16" cy="2.5" rx="5.5" ry="1.3" fill={colors.secondary} />
                            <path d="M12 2.5 Q12 0.5 16 0.5 Q20 0.5 20 2.5" fill={colors.secondary} />
                        </>
                    )}
                    {hat === 'FLAT_CAP' && (
                        <path d="M11 3 L21 3 Q20 1 16 1 Q12 1 11 3" fill={colors.secondary} />
                    )}
                    {hat === 'KEPI' && (
                        <>
                            <rect x="12" y="1" width="8" height="3" fill={colors.primary} rx="1" />
                            <ellipse cx="16" cy="1" rx="4" ry="0.8" fill={colors.primaryDark} />
                        </>
                    )}
                    {hat === 'BONNET' && (
                        <path d="M11 1 Q16 -2 21 1 Q21 3 20 3 L12 3 Q11 3 11 1" fill={colors.secondary} />
                    )}
                    {hat === 'WIDE_BRIM' && (
                        <>
                            <ellipse cx="16" cy="2" rx="7" ry="1.5" fill={colors.secondary} />
                            <ellipse cx="16" cy="1" rx="4" ry="2" fill={colors.secondary} />
                        </>
                    )}
                    {hat === 'FEZ' && (
                        <>
                            <path d="M13 3 L13 0 Q16 -1 19 0 L19 3" fill="#8b0000" />
                            <ellipse cx="16" cy="3" rx="4" ry="1" fill="#8b0000" />
                        </>
                    )}
                    {hat === 'BERET' && (
                        <ellipse cx="16" cy="2" rx="5" ry="2" fill={colors.secondary} />
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
                <svg viewBox="0 0 32 40" className="w-10 h-12 overflow-visible drop-shadow-md">
                    {/* Shadow */}
                    <ellipse cx="16" cy="38" rx="7" ry="2" fill="rgba(0,0,0,0.15)" />

                    {/* Back hair for long styles */}
                    {isFemale && hairLayers?.backHair}

                    {/* Legs / Dress skirt */}
                    {isFemale && (style === 'BUSTLE_DRESS' || style === 'WALKING_DRESS' || style === 'SERVANT_DRESS') ? (
                        <g>
                            {/* Profile dress with bell/conical shape - smooth taper from waist to hem */}
                            {/* Main skirt: starts narrow at waist (12-20), flares out to wide hem (6-26) */}
                            <path d="M12 18 Q10 22 8 28 Q6 33 6 36 L26 36 Q26 33 24 28 Q22 22 20 18 Z" fill={colors.primary} />
                            {/* Bustle showing in profile - protrudes at back */}
                            <ellipse cx="9" cy="22" rx="2.5" ry="3" fill={colors.primaryDark} />
                            {/* Dress folds showing the bell shape */}
                            <path d="M11 20 Q9 26 7 35" stroke={colors.primaryDark} strokeWidth="0.5" fill="none" />
                            <path d="M14 19 Q12 27 10 35" stroke={colors.primaryDark} strokeWidth="0.4" fill="none" opacity="0.7" />
                            <path d="M18 19 Q20 27 22 35" stroke={colors.primaryDark} strokeWidth="0.4" fill="none" opacity="0.7" />
                            <path d="M21 20 Q23 26 25 35" stroke={colors.primaryDark} strokeWidth="0.5" fill="none" />
                            {/* Hem detail */}
                            <path d="M6 35.5 Q16 34 26 35.5" stroke={colors.primaryDark} strokeWidth="0.5" fill="none" />
                        </g>
                    ) : (
                        <>
                            <path d={`M14 26 L${13 - legOffset * 0.4} 35`}
                                  stroke={colors.secondary} strokeWidth="3" fill="none" />
                            <path d={`M18 26 L${19 + legOffset * 0.4} 35`}
                                  stroke={colors.secondary} strokeWidth="3" fill="none" />
                            <ellipse cx={13 - legOffset * 0.4} cy="35.5" rx="2.5" ry="1" fill={colors.secondaryDark} />
                            <ellipse cx={19 + legOffset * 0.4} cy="35.5" rx="2.5" ry="1" fill={colors.secondaryDark} />
                        </>
                    )}

                    {/* Back arm */}
                    <g transform={`rotate(${-armSwing * 0.7} 12 14)`}>
                        <path d="M10 12 L6 22" stroke={colors.primary} strokeWidth="3" fill="none" />
                        <ellipse cx="6" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>

                    {/* Body - profile (bodice) */}
                    {isFemale ? (
                        <g>
                            {/* Fitted bodice - narrow waist connects to skirt */}
                            <path d="M10 10 Q8 12 10 15 L10 18 L22 18 L22 15 Q22 12 20 10 Z" fill={colors.primary} />
                            {/* Waist cinch visible in profile */}
                            <path d="M10 17 Q16 15 22 17" stroke={colors.primaryDark} strokeWidth="0.5" fill="none" />
                            {/* Slight bust curve in profile */}
                            <path d="M21 12 Q23 14 22 16" stroke={colors.primaryDark} strokeWidth="0.3" fill="none" />
                        </g>
                    ) : (
                        <path d="M10 10 Q8 12 8 16 L8 26 L20 26 L20 16 Q20 12 18 10 Z" fill={colors.primary} />
                    )}

                    {/* Front arm */}
                    <g transform={`rotate(${armSwing * 0.7} 18 14)`}>
                        <path d="M18 12 L24 22" stroke={colors.primary} strokeWidth="3" fill="none" />
                        <ellipse cx="24" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>

                    {/* Collar */}
                    <rect x="14" y="9" width="4" height="2" fill={colors.white} />

                    {/* Neck */}
                    <rect x="15" y="7" width="3" height="4" fill={colors.skin} />

                    {/* Ear (behind head) */}
                    <ellipse cx="13" cy="5" rx="0.8" ry="1.2" fill={colors.skin} />

                    {/* Head - profile */}
                    <ellipse cx="16" cy="5" rx="4" ry="4" fill={colors.skin} />

                    {/* Profile features */}
                    <path d="M20 4 L22 5 L20 6" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="0.3" />
                    <ellipse cx="18" cy="4" rx="0.8" ry="0.6" fill="white" />
                    <circle cx="18.2" cy="4" r="0.3" fill="#3d2314" />
                    <path d="M17 3.3 L19 3" stroke={colors.hair} strokeWidth="0.4" />

                    {/* Facial hair profile */}
                    {!isFemale && facialHair !== 'NONE' && (
                        <>
                            {(facialHair === 'MUSTACHE' || facialHair === 'FULL_BEARD') && (
                                <path d="M19 5.5 Q21 6 20 6.5" fill={colors.hair} />
                            )}
                            {facialHair === 'FULL_BEARD' && (
                                <path d="M18 6 Q20 7 19 8 Q17 9 15 7" fill={colors.hair} />
                            )}
                            {facialHair === 'GOATEE' && (
                                <path d="M18 6 Q19 7.5 17 7" fill={colors.hair} />
                            )}
                        </>
                    )}

                    {/* Hair profile - front layer */}
                    {isFemale ? (
                        hairLayers?.frontHair
                    ) : (
                        <path d="M12 2 Q16 0 18 2 Q18 4 17 5 L13 5 Q12 4 12 2" fill={colors.hair} />
                    )}

                    {/* Hat profile */}
                    {hat === 'TOP_HAT' && (
                        <>
                            <ellipse cx="15" cy="1" rx="4.5" ry="1" fill={colors.secondary} />
                            <path d="M11 1 Q11 -2 15 -2 Q19 -2 19 1" fill={colors.secondary} />
                        </>
                    )}
                    {hat === 'BOWLER' && (
                        <>
                            <ellipse cx="15" cy="1" rx="5" ry="1.2" fill={colors.secondary} />
                            <path d="M11 1 Q11 -0.5 15 -0.5 Q19 -0.5 19 1" fill={colors.secondary} />
                        </>
                    )}
                    {hat === 'FLAT_CAP' && (
                        <>
                            <path d="M11 2 L19 2 Q18 0 15 0 Q12 0 11 2" fill={colors.secondary} />
                            <path d="M19 2 L22 3 L19 2.5" fill={colors.secondaryDark} />
                        </>
                    )}
                    {hat === 'KEPI' && (
                        <>
                            <rect x="12" y="0" width="7" height="2.5" fill={colors.primary} rx="1" />
                            <path d="M19 1.5 L21 2 L19 2" fill={colors.primaryDark} />
                        </>
                    )}
                    {hat === 'BONNET' && (
                        <path d="M11 0 Q15 -3 19 0 Q19 2 18 2 L12 2 Q11 2 11 0" fill={colors.secondary} />
                    )}
                    {hat === 'WIDE_BRIM' && (
                        <>
                            <ellipse cx="15" cy="1" rx="6" ry="1.2" fill={colors.secondary} />
                            <ellipse cx="15" cy="0" rx="3.5" ry="1.8" fill={colors.secondary} />
                        </>
                    )}
                    {hat === 'FEZ' && (
                        <>
                            <path d="M13 2 L13 -1 Q15 -2 17 -1 L17 2" fill="#8b0000" />
                            <ellipse cx="15" cy="2" rx="3" ry="0.8" fill="#8b0000" />
                        </>
                    )}
                    {hat === 'BERET' && (
                        <ellipse cx="15" cy="1" rx="4.5" ry="1.8" fill={colors.secondary} />
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
            <svg viewBox="0 0 32 40" className="w-10 h-12 overflow-visible drop-shadow-md">
                {/* Shadow */}
                <ellipse cx="16" cy="38" rx="7" ry="2" fill="rgba(0,0,0,0.15)" />

                {/* Back hair for long styles */}
                {isFemale && hairLayersW?.backHair}

                {/* Legs / Dress skirt */}
                {isFemale && (style === 'BUSTLE_DRESS' || style === 'WALKING_DRESS' || style === 'SERVANT_DRESS') ? (
                    <g>
                        {/* Profile dress with bell/conical shape - mirrored, smooth taper from waist to hem */}
                        {/* Main skirt: starts narrow at waist (12-20), flares out to wide hem (6-26) */}
                        <path d="M20 18 Q22 22 24 28 Q26 33 26 36 L6 36 Q6 33 8 28 Q10 22 12 18 Z" fill={colors.primary} />
                        {/* Bustle showing in profile - protrudes at back (mirrored to right side) */}
                        <ellipse cx="23" cy="22" rx="2.5" ry="3" fill={colors.primaryDark} />
                        {/* Dress folds showing the bell shape */}
                        <path d="M21 20 Q23 26 25 35" stroke={colors.primaryDark} strokeWidth="0.5" fill="none" />
                        <path d="M18 19 Q20 27 22 35" stroke={colors.primaryDark} strokeWidth="0.4" fill="none" opacity="0.7" />
                        <path d="M14 19 Q12 27 10 35" stroke={colors.primaryDark} strokeWidth="0.4" fill="none" opacity="0.7" />
                        <path d="M11 20 Q9 26 7 35" stroke={colors.primaryDark} strokeWidth="0.5" fill="none" />
                        {/* Hem detail */}
                        <path d="M6 35.5 Q16 34 26 35.5" stroke={colors.primaryDark} strokeWidth="0.5" fill="none" />
                    </g>
                ) : (
                    <>
                        <path d={`M18 26 L${19 + legOffset * 0.4} 35`}
                              stroke={colors.secondary} strokeWidth="3" fill="none" />
                        <path d={`M14 26 L${13 - legOffset * 0.4} 35`}
                              stroke={colors.secondary} strokeWidth="3" fill="none" />
                        <ellipse cx={19 + legOffset * 0.4} cy="35.5" rx="2.5" ry="1" fill={colors.secondaryDark} />
                        <ellipse cx={13 - legOffset * 0.4} cy="35.5" rx="2.5" ry="1" fill={colors.secondaryDark} />
                    </>
                )}

                {/* Back arm */}
                <g transform={`rotate(${armSwing * 0.7} 20 14)`}>
                    <path d="M22 12 L26 22" stroke={colors.primary} strokeWidth="3" fill="none" />
                    <ellipse cx="26" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                </g>

                {/* Body (bodice) */}
                {isFemale ? (
                    <g>
                        {/* Fitted bodice - narrow waist connects to skirt */}
                        <path d="M22 10 Q24 12 22 15 L22 18 L10 18 L10 15 Q10 12 12 10 Z" fill={colors.primary} />
                        {/* Waist cinch visible in profile */}
                        <path d="M10 17 Q16 15 22 17" stroke={colors.primaryDark} strokeWidth="0.5" fill="none" />
                        {/* Slight bust curve in profile */}
                        <path d="M11 12 Q9 14 10 16" stroke={colors.primaryDark} strokeWidth="0.3" fill="none" />
                    </g>
                ) : (
                    <path d="M22 10 Q24 12 24 16 L24 26 L12 26 L12 16 Q12 12 14 10 Z" fill={colors.primary} />
                )}

                {/* Front arm */}
                <g transform={`rotate(${-armSwing * 0.7} 14 14)`}>
                    <path d="M14 12 L8 22" stroke={colors.primary} strokeWidth="3" fill="none" />
                    <ellipse cx="8" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                </g>

                {/* Collar */}
                <rect x="14" y="9" width="4" height="2" fill={colors.white} />

                {/* Neck */}
                <rect x="14" y="7" width="3" height="4" fill={colors.skin} />

                {/* Ear (behind head) */}
                <ellipse cx="19" cy="5" rx="0.8" ry="1.2" fill={colors.skin} />

                {/* Head - left profile */}
                <ellipse cx="16" cy="5" rx="4" ry="4" fill={colors.skin} />

                {/* Profile features - mirrored */}
                <path d="M12 4 L10 5 L12 6" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="0.3" />
                <ellipse cx="14" cy="4" rx="0.8" ry="0.6" fill="white" />
                <circle cx="13.8" cy="4" r="0.3" fill="#3d2314" />
                <path d="M15 3.3 L13 3" stroke={colors.hair} strokeWidth="0.4" />

                {/* Facial hair profile - mirrored */}
                {!isFemale && facialHair !== 'NONE' && (
                    <>
                        {(facialHair === 'MUSTACHE' || facialHair === 'FULL_BEARD') && (
                            <path d="M13 5.5 Q11 6 12 6.5" fill={colors.hair} />
                        )}
                        {facialHair === 'FULL_BEARD' && (
                            <path d="M14 6 Q12 7 13 8 Q15 9 17 7" fill={colors.hair} />
                        )}
                        {facialHair === 'GOATEE' && (
                            <path d="M14 6 Q13 7.5 15 7" fill={colors.hair} />
                        )}
                    </>
                )}

                {/* Hair - front layer */}
                {isFemale ? (
                    hairLayersW?.frontHair
                ) : (
                    <path d="M20 2 Q16 0 14 2 Q14 4 15 5 L19 5 Q20 4 20 2" fill={colors.hair} />
                )}

                {/* Hat - mirrored */}
                {hat === 'TOP_HAT' && (
                    <>
                        <ellipse cx="17" cy="1" rx="4.5" ry="1" fill={colors.secondary} />
                        <path d="M21 1 Q21 -2 17 -2 Q13 -2 13 1" fill={colors.secondary} />
                    </>
                )}
                {hat === 'BOWLER' && (
                    <>
                        <ellipse cx="17" cy="1" rx="5" ry="1.2" fill={colors.secondary} />
                        <path d="M21 1 Q21 -0.5 17 -0.5 Q13 -0.5 13 1" fill={colors.secondary} />
                    </>
                )}
                {hat === 'FLAT_CAP' && (
                    <>
                        <path d="M21 2 L13 2 Q14 0 17 0 Q20 0 21 2" fill={colors.secondary} />
                        <path d="M13 2 L10 3 L13 2.5" fill={colors.secondaryDark} />
                    </>
                )}
                {hat === 'KEPI' && (
                    <>
                        <rect x="13" y="0" width="7" height="2.5" fill={colors.primary} rx="1" />
                        <path d="M13 1.5 L11 2 L13 2" fill={colors.primaryDark} />
                    </>
                )}
                {hat === 'BONNET' && (
                    <path d="M21 0 Q17 -3 13 0 Q13 2 14 2 L20 2 Q21 2 21 0" fill={colors.secondary} />
                )}
                {hat === 'WIDE_BRIM' && (
                    <>
                        <ellipse cx="17" cy="1" rx="6" ry="1.2" fill={colors.secondary} />
                        <ellipse cx="17" cy="0" rx="3.5" ry="1.8" fill={colors.secondary} />
                    </>
                )}
                {hat === 'FEZ' && (
                    <>
                        <path d="M19 2 L19 -1 Q17 -2 15 -1 L15 2" fill="#8b0000" />
                        <ellipse cx="17" cy="2" rx="3" ry="0.8" fill="#8b0000" />
                    </>
                )}
                {hat === 'BERET' && (
                    <ellipse cx="17" cy="1" rx="4.5" ry="1.8" fill={colors.secondary} />
                )}
            </svg>
        );
    };

    return (
        <div className={`relative w-full h-full flex items-center justify-center ${className}`}
             style={{ transform: `translateY(${-bounce}px)` }}>
            {renderSprite()}
        </div>
    );
};

// Memoize to prevent re-renders when NPC hasn't moved or changed
export default React.memo(NpcSprite, (prev, next) => {
    return (
        prev.npc.id === next.npc.id &&
        prev.npc.location.x === next.npc.location.x &&
        prev.npc.location.y === next.npc.location.y &&
        prev.npc.name === next.npc.name &&
        prev.className === next.className
    );
});
