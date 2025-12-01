
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

// Procedurally determine clothing based on NPC properties
const determineClothing = (npc: NPC): { style: ClothingStyle; hat: HatStyle; facialHair: FacialHairStyle } => {
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

    return { style, hat, facialHair };
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
        const { style, hat, facialHair } = clothing;

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
                    </defs>

                    {/* Shadow */}
                    <ellipse cx="16" cy="38" rx="7" ry="2" fill="rgba(0,0,0,0.15)" />

                    {/* Legs/Skirt */}
                    {isFemale && (style === 'BUSTLE_DRESS' || style === 'WALKING_DRESS' || style === 'SERVANT_DRESS') ? (
                        // Dress/Skirt
                        <path d={`M10 24 Q8 32 10 36 L22 36 Q24 32 22 24 Z`}
                              fill={colors.primary} />
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
                        // Women's bodice
                        <>
                            <path d="M10 12 Q10 10 16 9 Q22 10 22 12 L22 24 Q16 25 10 24 Z"
                                  fill={`url(#coat-${npc.id})`} />
                            {/* High collar or lace */}
                            <path d="M12 10 Q16 8 20 10" fill="none" stroke={colors.white} strokeWidth="1" />
                            {/* Buttons or decoration */}
                            <circle cx="16" cy="14" r="0.5" fill={colors.gold} />
                            <circle cx="16" cy="17" r="0.5" fill={colors.gold} />
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

                    {/* Head */}
                    <ellipse cx="16" cy="6" rx="4.5" ry="4" fill={colors.skin} />

                    {/* Hair */}
                    {isFemale ? (
                        // Women's hair - updo style typical of 1889
                        <path d="M11.5 4 Q16 1 20.5 4 Q21 6 20 7 L12 7 Q11 6 11.5 4" fill={colors.hair} />
                    ) : (
                        // Men's hair - short sides
                        <>
                            <path d="M11.5 4 Q16 2 20.5 4 Q20 5 19 5 L13 5 Q12 5 11.5 4" fill={colors.hair} />
                            <path d="M11 5 Q11 7 12 8" stroke={colors.hair} strokeWidth="1" fill="none" />
                            <path d="M21 5 Q21 7 20 8" stroke={colors.hair} strokeWidth="1" fill="none" />
                        </>
                    )}

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

                    {/* Ears */}
                    <ellipse cx="11.5" cy="6" rx="0.7" ry="1" fill={colors.skin} />
                    <ellipse cx="20.5" cy="6" rx="0.7" ry="1" fill={colors.skin} />

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
                            <path d="M11 4 Q16 0 21 4 Q21 6 20 6 L12 6 Q11 6 11 4" fill={colors.secondary} />
                            <path d="M19 5 Q21 4 22 6" stroke={colors.secondary} strokeWidth="2" fill="none" />
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

        // North-facing (back view)
        if (dir === 'N') {
            return (
                <svg viewBox="0 0 32 40" className="w-10 h-12 overflow-visible drop-shadow-md">
                    {/* Shadow */}
                    <ellipse cx="16" cy="38" rx="7" ry="2" fill="rgba(0,0,0,0.15)" />

                    {/* Legs/Skirt */}
                    {isFemale && (style === 'BUSTLE_DRESS' || style === 'WALKING_DRESS') ? (
                        <path d="M10 24 Q8 32 10 36 L22 36 Q24 32 22 24 Z" fill={colors.primary} />
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
                    <path d="M9 12 Q9 10 16 10 Q23 10 23 12 L23 26 L9 26 Z" fill={colors.primary} />
                    {/* Back seam */}
                    <line x1="16" y1="10" x2="16" y2="26" stroke={colors.primaryDark} strokeWidth="0.5" />

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

                    {/* Hair from back */}
                    {isFemale ? (
                        <path d="M11 3 Q16 0 21 3 Q21 7 20 8 L12 8 Q11 7 11 3" fill={colors.hair} />
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
                        <path d="M11 3 Q16 -1 21 3 Q21 5 20 5 L12 5 Q11 5 11 3" fill={colors.secondary} />
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

        // East-facing (right profile)
        if (dir === 'E') {
            return (
                <svg viewBox="0 0 32 40" className="w-10 h-12 overflow-visible drop-shadow-md">
                    {/* Shadow */}
                    <ellipse cx="16" cy="38" rx="7" ry="2" fill="rgba(0,0,0,0.15)" />

                    {/* Legs */}
                    {isFemale && (style === 'BUSTLE_DRESS' || style === 'WALKING_DRESS') ? (
                        <path d="M12 24 Q10 32 12 36 L20 36 Q22 32 20 24 Z" fill={colors.primary} />
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

                    {/* Body - profile */}
                    <path d="M10 10 Q8 12 8 16 L8 26 L20 26 L20 16 Q20 12 18 10 Z" fill={colors.primary} />

                    {/* Front arm */}
                    <g transform={`rotate(${armSwing * 0.7} 18 14)`}>
                        <path d="M18 12 L24 22" stroke={colors.primary} strokeWidth="3" fill="none" />
                        <ellipse cx="24" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>

                    {/* Collar */}
                    <rect x="14" y="9" width="4" height="2" fill={colors.white} />

                    {/* Neck */}
                    <rect x="15" y="7" width="3" height="4" fill={colors.skin} />

                    {/* Head - profile */}
                    <ellipse cx="16" cy="5" rx="4" ry="4" fill={colors.skin} />

                    {/* Profile features */}
                    <path d="M20 4 L22 5 L20 6" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="0.3" />
                    <ellipse cx="18" cy="4" rx="0.8" ry="0.6" fill="white" />
                    <circle cx="18.2" cy="4" r="0.3" fill="#3d2314" />
                    <path d="M17 3.3 L19 3" stroke={colors.hair} strokeWidth="0.4" />

                    {/* Ear */}
                    <ellipse cx="13" cy="5" rx="0.8" ry="1.2" fill={colors.skin} />

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

                    {/* Hair profile */}
                    {isFemale ? (
                        <path d="M12 3 Q16 0 18 2 Q18 5 17 6 L13 6 Q12 5 12 3" fill={colors.hair} />
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
                        <path d="M11 2 Q15 -1 19 2 Q19 4 18 4 L12 4 Q11 4 11 2" fill={colors.secondary} />
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

        // West-facing (left profile)
        return (
            <svg viewBox="0 0 32 40" className="w-10 h-12 overflow-visible drop-shadow-md">
                {/* Shadow */}
                <ellipse cx="16" cy="38" rx="7" ry="2" fill="rgba(0,0,0,0.15)" />

                {/* Legs */}
                {isFemale && (style === 'BUSTLE_DRESS' || style === 'WALKING_DRESS') ? (
                    <path d="M12 24 Q10 32 12 36 L20 36 Q22 32 20 24 Z" fill={colors.primary} />
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

                {/* Body */}
                <path d="M22 10 Q24 12 24 16 L24 26 L12 26 L12 16 Q12 12 14 10 Z" fill={colors.primary} />

                {/* Front arm */}
                <g transform={`rotate(${-armSwing * 0.7} 14 14)`}>
                    <path d="M14 12 L8 22" stroke={colors.primary} strokeWidth="3" fill="none" />
                    <ellipse cx="8" cy="22.5" rx="1.5" ry="1" fill={colors.skin} />
                </g>

                {/* Collar */}
                <rect x="14" y="9" width="4" height="2" fill={colors.white} />

                {/* Neck */}
                <rect x="14" y="7" width="3" height="4" fill={colors.skin} />

                {/* Head - left profile */}
                <ellipse cx="16" cy="5" rx="4" ry="4" fill={colors.skin} />

                {/* Profile features - mirrored */}
                <path d="M12 4 L10 5 L12 6" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="0.3" />
                <ellipse cx="14" cy="4" rx="0.8" ry="0.6" fill="white" />
                <circle cx="13.8" cy="4" r="0.3" fill="#3d2314" />
                <path d="M15 3.3 L13 3" stroke={colors.hair} strokeWidth="0.4" />

                {/* Ear */}
                <ellipse cx="19" cy="5" rx="0.8" ry="1.2" fill={colors.skin} />

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

                {/* Hair - mirrored */}
                {isFemale ? (
                    <path d="M20 3 Q16 0 14 2 Q14 5 15 6 L19 6 Q20 5 20 3" fill={colors.hair} />
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
                    <path d="M21 2 Q17 -1 13 2 Q13 4 14 4 L20 4 Q21 4 21 2" fill={colors.secondary} />
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

export default NpcSprite;
