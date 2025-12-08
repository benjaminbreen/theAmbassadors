import React, { useEffect, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { getLocationExhibits } from '../data/historicalExhibits';
import { hash, getCulturalContext } from './MapTile/utils';
import { playSound } from '../services/audioService';
import { LucideX, LucideBookOpen, LucideGlasses, LucideSparkles } from 'lucide-react';

interface ExhibitCloseupModalProps {
    onClose: () => void;
}

// Seeded random helper for consistent item selection
const seededRandom = (seed: number, index: number): number => {
    const h = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453123;
    return h - Math.floor(h);
};

// Color palettes for different cultural themes
const CULTURE_PALETTES: Record<string, {
    wood: string;
    woodDark: string;
    woodHighlight: string;
    brass: string;
    brassHighlight: string;
    velvet: string;
    velvetHighlight: string;
    accent: string;
    accentSecondary: string;
    glass: string;
    glow: string;
    glowSecondary: string;
}> = {
    japanese: {
        wood: '#2D1810',
        woodDark: '#1A0F0A',
        woodHighlight: '#4A2C17',
        brass: '#8B7355',
        brassHighlight: '#A89070',
        velvet: '#1A2A4A',
        velvetHighlight: '#2A3A5A',
        accent: '#C41E3A',
        accentSecondary: '#E8B4B8',
        glass: '#E8F0F8',
        glow: '#FFE4E8',
        glowSecondary: '#C41E3A',
    },
    chinese: {
        wood: '#4A1A1A',
        woodDark: '#2D0F0F',
        woodHighlight: '#6B2A2A',
        brass: '#D4AF37',
        brassHighlight: '#E8C84A',
        velvet: '#8B0000',
        velvetHighlight: '#A52A2A',
        accent: '#FFD700',
        accentSecondary: '#FF4500',
        glass: '#FFF8E8',
        glow: '#FFFACD',
        glowSecondary: '#FFD700',
    },
    egyptian: {
        wood: '#3D2314',
        woodDark: '#251610',
        woodHighlight: '#5C3D2E',
        brass: '#D4AF37',
        brassHighlight: '#E8C84A',
        velvet: '#1E3A5F',
        velvetHighlight: '#2E4A6F',
        accent: '#FFD700',
        accentSecondary: '#1E90FF',
        glass: '#F8F4E8',
        glow: '#FFFACD',
        glowSecondary: '#D4AF37',
    },
    persian: {
        wood: '#4A2C17',
        woodDark: '#2D1810',
        woodHighlight: '#6B4423',
        brass: '#C5A028',
        brassHighlight: '#D8B83A',
        velvet: '#4A1A2C',
        velvetHighlight: '#5A2A3C',
        accent: '#1E90FF',
        accentSecondary: '#FF6347',
        glass: '#F0F8FF',
        glow: '#E0FFFF',
        glowSecondary: '#1E90FF',
    },
    moorish: {
        wood: '#2D1810',
        woodDark: '#1A0F0A',
        woodHighlight: '#4A2C17',
        brass: '#B8860B',
        brassHighlight: '#D4A020',
        velvet: '#0A4A4A',
        velvetHighlight: '#1A5A5A',
        accent: '#228B22',
        accentSecondary: '#4169E1',
        glass: '#E8FFF8',
        glow: '#98FB98',
        glowSecondary: '#228B22',
    },
    african: {
        wood: '#3D2314',
        woodDark: '#251610',
        woodHighlight: '#5C3D2E',
        brass: '#CD7F32',
        brassHighlight: '#D89040',
        velvet: '#4A3A2A',
        velvetHighlight: '#5A4A3A',
        accent: '#D2691E',
        accentSecondary: '#8B4513',
        glass: '#FFF8F0',
        glow: '#FFDAB9',
        glowSecondary: '#CD7F32',
    },
    industrial: {
        wood: '#2F2F2F',
        woodDark: '#1A1A1A',
        woodHighlight: '#4A4A4A',
        brass: '#B8860B',
        brassHighlight: '#D4A020',
        velvet: '#1A1A2A',
        velvetHighlight: '#2A2A3A',
        accent: '#FFD700',
        accentSecondary: '#87CEEB',
        glass: '#F0F8FF',
        glow: '#FFFACD',
        glowSecondary: '#B8860B',
    },
    french: {
        wood: '#3D2314',
        woodDark: '#251610',
        woodHighlight: '#5C3D2E',
        brass: '#D4AF37',
        brassHighlight: '#E8C84A',
        velvet: '#4A1A2C',
        velvetHighlight: '#5A2A3C',
        accent: '#4169E1',
        accentSecondary: '#DC143C',
        glass: '#F8F8FF',
        glow: '#E6E6FA',
        glowSecondary: '#4169E1',
    },
};

const ExhibitCloseupModal: React.FC<ExhibitCloseupModalProps> = ({ onClose }) => {
    const { state } = useGame();
    const exhibitData = state.exhibitModalData;

    // Play sound on mount
    useEffect(() => {
        if (!state.audio.muted) {
            playSound('EVENT_POPUP');
        }
    }, [state.audio.muted]);

    // Calculate all exhibit data using memoization
    const exhibitInfo = useMemo(() => {
        if (!exhibitData) return null;

        const seed = hash(exhibitData.x, exhibitData.y);
        const isWideCase = seed > 0.5;
        const culture = getCulturalContext(exhibitData.zoneName);
        const exhibits = getLocationExhibits(exhibitData.zoneName);

        // Select items based on seed for consistency
        let selectedItems: string[];
        if (isWideCase) {
            // Wide case shows 3-4 items
            const numItems = 3 + (seed > 0.75 ? 1 : 0);
            selectedItems = [];
            const usedIndices = new Set<number>();
            for (let i = 0; i < numItems; i++) {
                let idx = Math.floor(seededRandom(seed, i) * exhibits.displays.length);
                // Avoid duplicates
                while (usedIndices.has(idx) && usedIndices.size < exhibits.displays.length) {
                    idx = (idx + 1) % exhibits.displays.length;
                }
                usedIndices.add(idx);
                selectedItems.push(exhibits.displays[idx]);
            }
        } else {
            // Single case shows 1 featured item
            const idx = Math.floor(seed * exhibits.displays.length);
            selectedItems = [exhibits.displays[idx]];
        }

        // Get color palette
        const palette = CULTURE_PALETTES[culture] || CULTURE_PALETTES.french;

        return {
            seed,
            isWideCase,
            culture,
            exhibits,
            selectedItems,
            palette,
        };
    }, [exhibitData]);

    if (!exhibitData || !exhibitInfo) return null;

    const { isWideCase, culture, exhibits, selectedItems, palette, seed } = exhibitInfo;

    // Render artifact based on item name keywords
    const renderArtifactForItem = (itemName: string, x: number, y: number, scale: number = 1, index: number = 0) => {
        const nameLower = itemName.toLowerCase();
        const itemSeed = seededRandom(seed, index + 100);

        // Detect item type from name and render appropriate graphic
        if (nameLower.includes('vase') || nameLower.includes('porcelain') || nameLower.includes('ceramic')) {
            return renderVase(x, y, scale, itemSeed, palette);
        }
        if (nameLower.includes('mask')) {
            return renderMask(x, y, scale, itemSeed, palette);
        }
        if (nameLower.includes('skull') || nameLower.includes('bone')) {
            return renderSkull(x, y, scale, itemSeed);
        }
        if (nameLower.includes('weapon') || nameLower.includes('sword') || nameLower.includes('knife') || nameLower.includes('dagger') || nameLower.includes('club') || nameLower.includes('spear') || nameLower.includes('harpoon') || nameLower.includes('boomerang')) {
            return renderWeapon(x, y, scale, itemSeed, palette);
        }
        if (nameLower.includes('tool') || nameLower.includes('flint') || nameLower.includes('instrument')) {
            return renderTool(x, y, scale, itemSeed, palette);
        }
        if (nameLower.includes('jewelry') || nameLower.includes('necklace') || nameLower.includes('bracelet') || nameLower.includes('amulet') || nameLower.includes('scarab')) {
            return renderJewelry(x, y, scale, itemSeed, palette);
        }
        if (nameLower.includes('textile') || nameLower.includes('silk') || nameLower.includes('kimono') || nameLower.includes('robe') || nameLower.includes('carpet') || nameLower.includes('rug')) {
            return renderTextile(x, y, scale, itemSeed, palette);
        }
        if (nameLower.includes('scroll') || nameLower.includes('papyrus') || nameLower.includes('manuscript') || nameLower.includes('book') || nameLower.includes('codex')) {
            return renderScroll(x, y, scale, itemSeed, palette);
        }
        if (nameLower.includes('statue') || nameLower.includes('figure') || nameLower.includes('figurine') || nameLower.includes('bust')) {
            return renderStatuette(x, y, scale, itemSeed, palette);
        }
        if (nameLower.includes('jar') || nameLower.includes('canopic') || nameLower.includes('urn') || nameLower.includes('vessel')) {
            return renderJar(x, y, scale, itemSeed, palette);
        }
        if (nameLower.includes('box') || nameLower.includes('chest') || nameLower.includes('casket')) {
            return renderBox(x, y, scale, itemSeed, palette);
        }
        if (nameLower.includes('mirror') || nameLower.includes('bronze')) {
            return renderMirror(x, y, scale, itemSeed, palette);
        }
        if (nameLower.includes('carving') || nameLower.includes('netsuke') || nameLower.includes('jade') || nameLower.includes('ivory')) {
            return renderCarving(x, y, scale, itemSeed, palette);
        }
        if (nameLower.includes('painting') || nameLower.includes('print') || nameLower.includes('ukiyo')) {
            return renderPainting(x, y, scale, itemSeed, palette);
        }
        // Default: generic artifact
        return renderGenericArtifact(x, y, scale, itemSeed, palette);
    };

    // Individual artifact render functions
    const renderVase = (x: number, y: number, scale: number, itemSeed: number, p: typeof palette) => (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            {/* Glow effect */}
            <ellipse cx="0" cy="5" rx="28" ry="35" fill={`url(#artifactGlow-${Math.round(itemSeed * 100)})`} opacity="0.6" />
            {/* Vase body */}
            <ellipse cx="0" cy="5" rx="18" ry="25" fill={`url(#vaseGradient-${Math.round(itemSeed * 100)})`} />
            <ellipse cx="0" cy="-18" rx="10" ry="6" fill={`url(#vaseGradient-${Math.round(itemSeed * 100)})`} />
            {/* Neck */}
            <rect x="-8" y="-20" width="16" height="8" fill={`url(#vaseGradient-${Math.round(itemSeed * 100)})`} />
            {/* Decorative bands */}
            <ellipse cx="0" cy="-5" rx="17" ry="3" fill="none" stroke={p.accent} strokeWidth="2" opacity="0.8" />
            <ellipse cx="0" cy="10" rx="16" ry="3" fill="none" stroke={p.brass} strokeWidth="1.5" opacity="0.6" />
            {/* Pattern details */}
            <path d={`M-12 0 Q-6 -8 0 0 Q6 8 12 0`} stroke={p.accent} strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d={`M-10 15 Q0 10 10 15`} stroke={p.accent} strokeWidth="1" fill="none" opacity="0.5" />
            {/* Highlight */}
            <ellipse cx="-8" cy="-5" rx="4" ry="12" fill="#FFFFFF" opacity="0.25" />
            <defs>
                <linearGradient id={`vaseGradient-${Math.round(itemSeed * 100)}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={itemSeed > 0.5 ? "#F5F5F0" : "#E8DCC8"} />
                    <stop offset="50%" stopColor={itemSeed > 0.5 ? "#E8E4D8" : "#D4C4A8"} />
                    <stop offset="100%" stopColor={itemSeed > 0.5 ? "#D8D4C8" : "#C4B498"} />
                </linearGradient>
                <radialGradient id={`artifactGlow-${Math.round(itemSeed * 100)}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={p.glow} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={p.glow} stopOpacity="0" />
                </radialGradient>
            </defs>
        </g>
    );

    const renderMask = (x: number, y: number, scale: number, itemSeed: number, p: typeof palette) => {
        const maskColor = itemSeed > 0.6 ? '#3D2314' : itemSeed > 0.3 ? '#5C3D2E' : '#2D1810';
        return (
            <g transform={`translate(${x}, ${y}) scale(${scale})`}>
                {/* Glow effect */}
                <ellipse cx="0" cy="0" rx="35" ry="45" fill={`url(#maskGlow-${Math.round(itemSeed * 100)})`} opacity="0.5" />
                {/* Mask face shape */}
                <path d="M0 -30 Q-20 -25 -22 0 Q-20 20 0 30 Q20 20 22 0 Q20 -25 0 -30"
                    fill={maskColor} />
                {/* Forehead decoration */}
                <path d="M-12 -25 Q0 -30 12 -25" stroke={p.accent} strokeWidth="2" fill="none" />
                {/* Eye holes */}
                <ellipse cx="-8" cy="-5" rx="6" ry="4" fill="#0A0A0A" />
                <ellipse cx="8" cy="-5" rx="6" ry="4" fill="#0A0A0A" />
                {/* Eye decoration */}
                <path d="M-14 -5 Q-8 -10 -2 -5" stroke={p.brass} strokeWidth="1.5" fill="none" />
                <path d="M2 -5 Q8 -10 14 -5" stroke={p.brass} strokeWidth="1.5" fill="none" />
                {/* Nose */}
                <path d="M0 -2 L-3 8 L0 10 L3 8 L0 -2" fill={maskColor} stroke="#1A0A0A" strokeWidth="0.5" />
                {/* Mouth */}
                <ellipse cx="0" cy="18" rx="8" ry="4" fill="#1A0A0A" />
                <path d="M-6 18 Q0 22 6 18" stroke={p.accent} strokeWidth="1" fill="none" />
                {/* Scarification/decoration marks */}
                <path d="M-18 5 L-15 10 L-18 15" stroke={p.brass} strokeWidth="1.5" fill="none" />
                <path d="M18 5 L15 10 L18 15" stroke={p.brass} strokeWidth="1.5" fill="none" />
                {/* Highlight */}
                <ellipse cx="-10" cy="-10" rx="5" ry="10" fill="#FFFFFF" opacity="0.15" />
                <defs>
                    <radialGradient id={`maskGlow-${Math.round(itemSeed * 100)}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={p.glow} stopOpacity="0.7" />
                        <stop offset="100%" stopColor={p.glow} stopOpacity="0" />
                    </radialGradient>
                </defs>
            </g>
        );
    };

    const renderSkull = (x: number, y: number, scale: number, itemSeed: number) => (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            {/* Glow effect */}
            <ellipse cx="0" cy="0" rx="35" ry="40" fill="url(#skullGlow)" opacity="0.4" />
            {/* Cranium */}
            <ellipse cx="0" cy="-10" rx="20" ry="22" fill="#F5F0E8" />
            <ellipse cx="0" cy="-10" rx="18" ry="20" fill="#E8E0D4" />
            {/* Face/jaw area */}
            <path d="M-15 5 Q-18 15 -10 25 Q0 28 10 25 Q18 15 15 5" fill="#F0E8DC" />
            {/* Eye sockets */}
            <ellipse cx="-7" cy="-5" rx="6" ry="7" fill="#2A2420" />
            <ellipse cx="7" cy="-5" rx="6" ry="7" fill="#2A2420" />
            {/* Nasal cavity */}
            <path d="M0 5 L-4 12 Q0 14 4 12 L0 5" fill="#3A3430" />
            {/* Teeth */}
            <rect x="-10" y="18" width="20" height="6" fill="#E8E0D4" stroke="#C4B8A8" strokeWidth="0.5" />
            <path d="M-8 18 L-8 24 M-4 18 L-4 24 M0 18 L0 24 M4 18 L4 24 M8 18 L8 24"
                stroke="#B8A898" strokeWidth="0.5" />
            {/* Sutures */}
            <path d="M-15 -15 Q0 -20 15 -15" stroke="#C4B8A8" strokeWidth="0.5" fill="none" />
            <path d="M0 -30 L0 -20" stroke="#C4B8A8" strokeWidth="0.5" />
            {/* Shading */}
            <ellipse cx="-12" cy="-8" rx="4" ry="8" fill="#FFFFFF" opacity="0.2" />
            <defs>
                <radialGradient id="skullGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFF0" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#FFFFF0" stopOpacity="0" />
                </radialGradient>
            </defs>
        </g>
    );

    const renderWeapon = (x: number, y: number, scale: number, itemSeed: number, p: typeof palette) => {
        if (itemSeed > 0.5) {
            // Boomerang/club style
            return (
                <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${-15 + itemSeed * 30})`}>
                    {/* Glow */}
                    <ellipse cx="0" cy="0" rx="45" ry="25" fill={`url(#weaponGlow-${Math.round(itemSeed * 100)})`} opacity="0.4" />
                    <path d="M-30 0 Q-15 -20 0 -15 Q15 -10 30 5 Q15 8 0 5 Q-15 2 -30 0"
                        fill="#5C3D2E" stroke="#3D2314" strokeWidth="1" />
                    {/* Wood grain */}
                    <path d="M-25 -2 Q-10 -12 5 -8" stroke="#3D2314" strokeWidth="0.5" fill="none" opacity="0.5" />
                    <path d="M-20 2 Q0 -5 20 2" stroke="#3D2314" strokeWidth="0.5" fill="none" opacity="0.5" />
                    {/* Decorative bands */}
                    <rect x="-5" y="-12" width="10" height="4" fill={p.accent} opacity="0.8" />
                    {/* Carved patterns */}
                    <circle cx="-15" cy="-5" r="3" fill="none" stroke={p.brass} strokeWidth="1" />
                    <circle cx="15" cy="0" r="3" fill="none" stroke={p.brass} strokeWidth="1" />
                    {/* Highlight */}
                    <path d="M-25 -5 Q-10 -15 5 -10" stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.2" />
                    <defs>
                        <radialGradient id={`weaponGlow-${Math.round(itemSeed * 100)}`} cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={p.glow} stopOpacity="0.6" />
                            <stop offset="100%" stopColor={p.glow} stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </g>
            );
        } else {
            // Spear/dagger style
            return (
                <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(-30)`}>
                    {/* Glow */}
                    <ellipse cx="0" cy="0" rx="20" ry="50" fill={`url(#weaponGlow2-${Math.round(itemSeed * 100)})`} opacity="0.4" />
                    {/* Blade */}
                    <path d="M0 -35 L-6 -10 L-4 25 L0 28 L4 25 L6 -10 Z"
                        fill="#6A6A6A" stroke="#3A3A3A" strokeWidth="0.5" />
                    {/* Blade edge highlight */}
                    <path d="M0 -35 L-5 -10 L-3 25" stroke="#AAAAAA" strokeWidth="1" fill="none" />
                    <path d="M-2 -30 L-2 -5" stroke="#FFFFFF" strokeWidth="0.5" fill="none" opacity="0.4" />
                    {/* Handle */}
                    <rect x="-5" y="25" width="10" height="20" fill="#3D2314" />
                    <rect x="-4" y="27" width="8" height="16" fill="#5C3D2E" />
                    {/* Handle binding */}
                    <path d="M-5 30 L5 30 M-5 35 L5 35 M-5 40 L5 40" stroke={p.brass} strokeWidth="1.5" />
                    <defs>
                        <radialGradient id={`weaponGlow2-${Math.round(itemSeed * 100)}`} cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#E0E8F0" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#E0E8F0" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </g>
            );
        }
    };

    const renderTool = (x: number, y: number, scale: number, itemSeed: number, p: typeof palette) => (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            {/* Glow */}
            <ellipse cx="0" cy="0" rx="30" ry="30" fill={`url(#toolGlow)`} opacity="0.4" />
            {/* Flint/stone tool head */}
            <path d="M-15 -20 Q-20 -10 -15 5 Q-5 15 10 10 Q20 0 15 -15 Q5 -25 -15 -20"
                fill="#6B6B5B" stroke="#4A4A3A" strokeWidth="1" />
            {/* Flaking marks */}
            <path d="M-10 -15 Q-5 -10 -8 -5" stroke="#4A4A3A" strokeWidth="0.5" fill="none" />
            <path d="M5 -10 Q10 -5 8 5" stroke="#4A4A3A" strokeWidth="0.5" fill="none" />
            <path d="M-5 0 Q0 5 5 2" stroke="#4A4A3A" strokeWidth="0.5" fill="none" />
            {/* Sharp edge highlight */}
            <path d="M-15 5 Q-5 15 10 10" stroke="#9B9B8B" strokeWidth="1.5" fill="none" />
            {/* Texture */}
            <circle cx="-5" cy="-8" r="2" fill="#5B5B4B" />
            <circle cx="5" cy="-5" r="1.5" fill="#5B5B4B" />
            {/* Highlight */}
            <ellipse cx="-8" cy="-12" rx="4" ry="6" fill="#FFFFFF" opacity="0.15" />
            <defs>
                <radialGradient id="toolGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#D0D0C0" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#D0D0C0" stopOpacity="0" />
                </radialGradient>
            </defs>
        </g>
    );

    const renderJewelry = (x: number, y: number, scale: number, itemSeed: number, p: typeof palette) => (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            {/* Glow effect - stronger for jewelry */}
            <ellipse cx="0" cy="0" rx="40" ry="35" fill={`url(#jewelryGlow-${Math.round(itemSeed * 100)})`} opacity="0.6" />
            {/* Necklace/amulet chain */}
            <path d="M-25 -15 Q-20 -25 0 -28 Q20 -25 25 -15"
                stroke={p.brass} strokeWidth="2.5" fill="none" />
            {/* Chain links */}
            {[-20, -10, 0, 10, 20].map((cx, i) => (
                <circle key={i} cx={cx} cy={-20 - Math.abs(cx) * 0.15} r="2" fill={p.brassHighlight} />
            ))}
            {/* Pendant/amulet */}
            <ellipse cx="0" cy="0" rx="18" ry="15" fill={p.velvet} stroke={p.brass} strokeWidth="2.5" />
            {/* Center gem/scarab */}
            <ellipse cx="0" cy="0" rx="10" ry="8" fill={p.accent} />
            <ellipse cx="0" cy="-2" rx="8" ry="5" fill={p.accent} opacity="0.8" />
            {/* Gem sparkle */}
            <path d="M-6 0 Q0 -5 6 0 Q0 5 -6 0" fill="#FFFFFF" opacity="0.4" />
            <circle cx="-3" cy="-3" r="2" fill="#FFFFFF" opacity="0.6" />
            {/* Gold frame details */}
            <circle cx="-12" cy="0" r="3" fill={p.brass} />
            <circle cx="12" cy="0" r="3" fill={p.brass} />
            <circle cx="0" cy="10" r="3" fill={p.brass} />
            {/* Hanging beads */}
            <circle cx="-8" cy="18" r="2.5" fill={p.accent} />
            <circle cx="0" cy="20" r="3" fill={p.brass} />
            <circle cx="8" cy="18" r="2.5" fill={p.accent} />
            <path d="M-8 13 L-8 15.5 M0 15 L0 17 M8 13 L8 15.5" stroke={p.brass} strokeWidth="1.5" />
            <defs>
                <radialGradient id={`jewelryGlow-${Math.round(itemSeed * 100)}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={p.glow} stopOpacity="0.9" />
                    <stop offset="60%" stopColor={p.glowSecondary} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={p.glow} stopOpacity="0" />
                </radialGradient>
            </defs>
        </g>
    );

    const renderTextile = (x: number, y: number, scale: number, itemSeed: number, p: typeof palette) => (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            {/* Glow */}
            <ellipse cx="0" cy="0" rx="40" ry="30" fill={`url(#textileGlow)`} opacity="0.4" />
            {/* Folded fabric base */}
            <path d="M-25 -15 Q-30 0 -25 15 Q0 20 25 15 Q30 0 25 -15 Q0 -20 -25 -15"
                fill={p.velvet} />
            {/* Fabric folds */}
            <path d="M-20 -10 Q-15 0 -20 10" stroke={p.velvetHighlight} strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M0 -15 Q5 0 0 15" stroke={p.velvetHighlight} strokeWidth="1.5" fill="none" opacity="0.4" />
            <path d="M20 -10 Q15 0 20 10" stroke={p.velvetHighlight} strokeWidth="2" fill="none" opacity="0.5" />
            {/* Embroidered pattern */}
            <path d="M-15 -5 L-10 0 L-15 5 L-10 10" stroke={p.brass} strokeWidth="1.5" fill="none" />
            <path d="M15 -5 L10 0 L15 5 L10 10" stroke={p.brass} strokeWidth="1.5" fill="none" />
            {/* Central motif */}
            <circle cx="0" cy="0" r="8" fill="none" stroke={p.accent} strokeWidth="2" />
            <circle cx="0" cy="0" r="4" fill={p.accent} opacity="0.6" />
            {/* Gold thread details */}
            <path d="M-8 0 L8 0 M0 -8 L0 8" stroke={p.brass} strokeWidth="1" opacity="0.7" />
            {/* Silk sheen highlight */}
            <ellipse cx="-10" cy="-8" rx="8" ry="5" fill="#FFFFFF" opacity="0.15" />
            <defs>
                <radialGradient id="textileGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={p.glow} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={p.glow} stopOpacity="0" />
                </radialGradient>
            </defs>
        </g>
    );

    const renderScroll = (x: number, y: number, scale: number, itemSeed: number, p: typeof palette) => (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            {/* Glow */}
            <ellipse cx="0" cy="0" rx="35" ry="40" fill="url(#scrollGlow)" opacity="0.4" />
            {/* Scroll body - unrolled portion */}
            <rect x="-20" y="-25" width="40" height="50" fill="#F5E6C8" />
            <rect x="-18" y="-23" width="36" height="46" fill="#E8D4B0" />
            {/* Rolled ends */}
            <ellipse cx="-20" cy="0" rx="4" ry="28" fill="#D4C4A0" />
            <ellipse cx="-20" cy="0" rx="3" ry="26" fill="#C4B490" />
            <ellipse cx="20" cy="0" rx="4" ry="28" fill="#D4C4A0" />
            <ellipse cx="20" cy="0" rx="3" ry="26" fill="#C4B490" />
            {/* Text lines */}
            <g opacity="0.6">
                <rect x="-14" y="-18" width="28" height="2" fill="#3A3020" />
                <rect x="-14" y="-12" width="24" height="2" fill="#3A3020" />
                <rect x="-14" y="-6" width="26" height="2" fill="#3A3020" />
                <rect x="-14" y="0" width="20" height="2" fill="#3A3020" />
                <rect x="-14" y="6" width="28" height="2" fill="#3A3020" />
                <rect x="-14" y="12" width="22" height="2" fill="#3A3020" />
            </g>
            {/* Decorative seal/stamp */}
            <circle cx="8" cy="16" r="5" fill={p.accent} opacity="0.8" />
            {/* Parchment highlight */}
            <rect x="-16" y="-21" width="10" height="20" fill="#FFFFFF" opacity="0.1" />
            <defs>
                <radialGradient id="scrollGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFACD" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#FFFACD" stopOpacity="0" />
                </radialGradient>
            </defs>
        </g>
    );

    const renderStatuette = (x: number, y: number, scale: number, itemSeed: number, p: typeof palette) => {
        const material = itemSeed > 0.5 ? '#CD7F32' : '#F5F5F0'; // Bronze or marble
        const materialHighlight = itemSeed > 0.5 ? '#E8A040' : '#FFFFFF';
        return (
            <g transform={`translate(${x}, ${y}) scale(${scale})`}>
                {/* Glow */}
                <ellipse cx="0" cy="5" rx="30" ry="45" fill={`url(#statuetteGlow-${Math.round(itemSeed * 100)})`} opacity="0.5" />
                {/* Base/pedestal */}
                <rect x="-15" y="20" width="30" height="10" fill={p.woodDark} />
                <rect x="-12" y="22" width="24" height="6" fill={p.wood} />
                {/* Body */}
                <ellipse cx="0" cy="10" rx="12" ry="15" fill={material} />
                {/* Head */}
                <circle cx="0" cy="-12" r="10" fill={material} />
                {/* Arms suggestion */}
                <path d="M-12 5 Q-18 0 -15 -8" stroke={material} strokeWidth="5" fill="none" />
                <path d="M12 5 Q18 0 15 -8" stroke={material} strokeWidth="5" fill="none" />
                {/* Face details */}
                <circle cx="-3" cy="-14" r="1.5" fill={itemSeed > 0.5 ? '#8B6914' : '#A9A9A9'} />
                <circle cx="3" cy="-14" r="1.5" fill={itemSeed > 0.5 ? '#8B6914' : '#A9A9A9'} />
                <path d="M-2 -8 Q0 -6 2 -8" stroke={itemSeed > 0.5 ? '#8B6914' : '#A9A9A9'} strokeWidth="1" fill="none" />
                {/* Highlight */}
                <ellipse cx="-5" cy="-5" rx="3" ry="8" fill={materialHighlight} opacity="0.25" />
                <ellipse cx="-3" cy="-15" rx="2" ry="4" fill={materialHighlight} opacity="0.2" />
                <defs>
                    <radialGradient id={`statuetteGlow-${Math.round(itemSeed * 100)}`} cx="50%" cy="40%" r="50%">
                        <stop offset="0%" stopColor={itemSeed > 0.5 ? '#FFD700' : '#FFFFFF'} stopOpacity="0.6" />
                        <stop offset="100%" stopColor={itemSeed > 0.5 ? '#FFD700' : '#FFFFFF'} stopOpacity="0" />
                    </radialGradient>
                </defs>
            </g>
        );
    };

    const renderJar = (x: number, y: number, scale: number, itemSeed: number, p: typeof palette) => (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            {/* Glow */}
            <ellipse cx="0" cy="0" rx="30" ry="40" fill={`url(#jarGlow)`} opacity="0.4" />
            {/* Jar body */}
            <ellipse cx="0" cy="5" rx="16" ry="22" fill="#D4B896" />
            <ellipse cx="0" cy="5" rx="14" ry="20" fill="#E8D4B8" />
            {/* Neck */}
            <rect x="-8" y="-20" width="16" height="8" fill="#D4B896" />
            {/* Lid (canopic style) */}
            <ellipse cx="0" cy="-20" rx="10" ry="4" fill="#C4A878" />
            <ellipse cx="0" cy="-24" rx="8" ry="10" fill="#D4B896" />
            {/* Face on lid */}
            <circle cx="-3" cy="-26" r="1.5" fill="#2A2A2A" />
            <circle cx="3" cy="-26" r="1.5" fill="#2A2A2A" />
            <path d="M-2 -22 Q0 -20 2 -22" stroke="#2A2A2A" strokeWidth="1" fill="none" />
            {/* Hieroglyphic bands */}
            <rect x="-14" y="-5" width="28" height="6" fill={p.accent} opacity="0.3" />
            <rect x="-12" y="10" width="24" height="5" fill={p.accent} opacity="0.3" />
            {/* Decorative symbols */}
            <path d="M-8 -2 L-4 2 L-8 2 Z" fill={p.brass} />
            <circle cx="0" cy="0" r="2" fill={p.brass} />
            <path d="M4 -2 L8 -2 L6 2 Z" fill={p.brass} />
            {/* Highlight */}
            <ellipse cx="-8" cy="0" rx="3" ry="10" fill="#FFFFFF" opacity="0.15" />
            <defs>
                <radialGradient id="jarGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFACD" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#FFFACD" stopOpacity="0" />
                </radialGradient>
            </defs>
        </g>
    );

    const renderBox = (x: number, y: number, scale: number, itemSeed: number, p: typeof palette) => (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            {/* Glow */}
            <ellipse cx="0" cy="0" rx="40" ry="30" fill={`url(#boxGlow)`} opacity="0.4" />
            {/* Box body - 3D perspective */}
            <path d="M-22 -10 L-22 15 L22 15 L22 -10 Z" fill={p.wood} />
            <path d="M-22 -10 L-18 -18 L26 -18 L22 -10 Z" fill={p.woodHighlight} />
            <path d="M22 -10 L26 -18 L26 7 L22 15 Z" fill={p.woodDark} />
            {/* Lid line */}
            <path d="M-22 -5 L22 -5" stroke={p.woodDark} strokeWidth="1" />
            {/* Decorative inlay */}
            <rect x="-16" y="0" width="32" height="10" fill={p.velvet} opacity="0.3" />
            {/* Metal corners */}
            <rect x="-22" y="-10" width="6" height="6" fill={p.brass} />
            <rect x="16" y="-10" width="6" height="6" fill={p.brass} />
            <rect x="-22" y="9" width="6" height="6" fill={p.brass} />
            <rect x="16" y="9" width="6" height="6" fill={p.brass} />
            {/* Lock plate */}
            <ellipse cx="0" cy="5" rx="4" ry="3" fill={p.brass} />
            <circle cx="0" cy="5" r="1.5" fill={p.woodDark} />
            {/* Decorative pattern on lid */}
            <path d="M-12 -14 Q0 -16 12 -14" stroke={p.brass} strokeWidth="1" fill="none" />
            {/* Highlight */}
            <rect x="-18" y="-16" width="10" height="6" fill="#FFFFFF" opacity="0.1" />
            <defs>
                <radialGradient id="boxGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={p.glow} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={p.glow} stopOpacity="0" />
                </radialGradient>
            </defs>
        </g>
    );

    const renderMirror = (x: number, y: number, scale: number, itemSeed: number, p: typeof palette) => (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            {/* Glow - strong reflection effect */}
            <ellipse cx="0" cy="-5" rx="35" ry="35" fill="url(#mirrorGlow)" opacity="0.5" />
            {/* Mirror disc */}
            <circle cx="0" cy="-5" r="22" fill="#CD7F32" />
            <circle cx="0" cy="-5" r="20" fill="#B87333" />
            <circle cx="0" cy="-5" r="18" fill="url(#mirrorShine)" />
            {/* Decorative border */}
            <circle cx="0" cy="-5" r="20" fill="none" stroke="#8B6914" strokeWidth="2" />
            {/* Reflection highlight */}
            <ellipse cx="-6" cy="-12" rx="8" ry="10" fill="#FFFFFF" opacity="0.3" />
            <ellipse cx="-4" cy="-10" rx="4" ry="5" fill="#FFFFFF" opacity="0.2" />
            {/* Patina/age marks */}
            <circle cx="-8" cy="-10" r="3" fill="#6B5314" opacity="0.2" />
            <circle cx="10" cy="0" r="4" fill="#6B5314" opacity="0.15" />
            {/* Handle */}
            <rect x="-4" y="15" width="8" height="18" fill="#CD7F32" />
            <rect x="-3" y="17" width="6" height="14" fill="#B87333" />
            {/* Handle decoration */}
            <circle cx="0" cy="20" r="2" fill="#8B6914" />
            <circle cx="0" cy="28" r="3" fill="#CD7F32" />
            <defs>
                <radialGradient id="mirrorShine" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#F8E8C8" />
                    <stop offset="50%" stopColor="#D4B888" />
                    <stop offset="100%" stopColor="#B09068" />
                </radialGradient>
                <radialGradient id="mirrorGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFE4B5" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#FFE4B5" stopOpacity="0" />
                </radialGradient>
            </defs>
        </g>
    );

    const renderCarving = (x: number, y: number, scale: number, itemSeed: number, p: typeof palette) => {
        const material = itemSeed > 0.5 ? '#90EE90' : '#F5F5DC'; // Jade or ivory
        const materialDark = itemSeed > 0.5 ? '#228B22' : '#D4C4A0';
        const glowColor = itemSeed > 0.5 ? '#98FB98' : '#FFFFF0';
        return (
            <g transform={`translate(${x}, ${y}) scale(${scale})`}>
                {/* Glow */}
                <ellipse cx="0" cy="0" rx="25" ry="30" fill={`url(#carvingGlow-${Math.round(itemSeed * 100)})`} opacity="0.5" />
                {/* Small carved figure */}
                <ellipse cx="0" cy="0" rx="15" ry="18" fill={material} />
                <ellipse cx="0" cy="0" rx="13" ry="16" fill={material} opacity="0.8" />
                {/* Carved details */}
                <circle cx="-4" cy="-5" r="3" fill={materialDark} opacity="0.5" />
                <circle cx="4" cy="-5" r="3" fill={materialDark} opacity="0.5" />
                <path d="M-5 5 Q0 10 5 5" stroke={materialDark} strokeWidth="1.5" fill="none" opacity="0.6" />
                {/* Surface texture */}
                <path d="M-10 -8 Q-5 -12 0 -8" stroke={materialDark} strokeWidth="0.5" fill="none" opacity="0.4" />
                <path d="M0 10 Q5 8 10 10" stroke={materialDark} strokeWidth="0.5" fill="none" opacity="0.4" />
                {/* Highlight - jade translucency effect */}
                <ellipse cx="-6" cy="-8" rx="4" ry="6" fill="#FFFFFF" opacity="0.3" />
                <ellipse cx="2" cy="3" rx="3" ry="4" fill="#FFFFFF" opacity="0.15" />
                <defs>
                    <radialGradient id={`carvingGlow-${Math.round(itemSeed * 100)}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={glowColor} stopOpacity="0.7" />
                        <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
                    </radialGradient>
                </defs>
            </g>
        );
    };

    const renderPainting = (x: number, y: number, scale: number, itemSeed: number, p: typeof palette) => (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            {/* Glow */}
            <rect x="-35" y="-28" width="70" height="56" fill="url(#paintingGlow)" opacity="0.3" rx="3" />
            {/* Frame */}
            <rect x="-28" y="-22" width="56" height="44" fill={p.brass} rx="1" />
            <rect x="-26" y="-20" width="52" height="40" fill={p.wood} />
            <rect x="-24" y="-18" width="48" height="36" fill="#F5F0E8" />
            {/* Image content - abstract landscape/scene */}
            <rect x="-22" y="-16" width="44" height="32" fill="#E8F0F8" />
            {/* Sky */}
            <rect x="-22" y="-16" width="44" height="16" fill="#B8D4E8" />
            {/* Sunset/atmosphere effect */}
            <rect x="-22" y="-8" width="44" height="8" fill="#E8C4B8" opacity="0.5" />
            {/* Mountains/landscape */}
            <path d="M-22 5 Q-10 -8 0 0 Q10 -5 22 5 L22 16 L-22 16 Z" fill="#4A6B4A" />
            <path d="M-22 8 Q-5 0 10 8 Q18 5 22 10 L22 16 L-22 16 Z" fill="#6B8B6B" />
            {/* Figure suggestion */}
            <ellipse cx="0" cy="8" rx="4" ry="6" fill="#C41E3A" opacity="0.8" />
            <circle cx="0" cy="2" r="2" fill="#F5DEB3" />
            {/* Frame corner ornaments */}
            <circle cx="-24" cy="-18" r="3" fill={p.brassHighlight} />
            <circle cx="24" cy="-18" r="3" fill={p.brassHighlight} />
            <circle cx="-24" cy="18" r="3" fill={p.brassHighlight} />
            <circle cx="24" cy="18" r="3" fill={p.brassHighlight} />
            {/* Frame highlight */}
            <rect x="-26" y="-20" width="8" height="3" fill="#FFFFFF" opacity="0.15" />
            <defs>
                <linearGradient id="paintingGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={p.glow} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={p.glow} stopOpacity="0" />
                </linearGradient>
            </defs>
        </g>
    );

    const renderGenericArtifact = (x: number, y: number, scale: number, itemSeed: number, p: typeof palette) => (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            {/* Glow */}
            <ellipse cx="0" cy="0" rx="30" ry="35" fill={`url(#genericGlow)`} opacity="0.5" />
            {/* Generic rounded artifact shape */}
            <ellipse cx="0" cy="0" rx="16" ry="20" fill={p.brass} />
            <ellipse cx="0" cy="0" rx="14" ry="18" fill={p.brassHighlight} opacity="0.6" />
            {/* Decorative elements */}
            <circle cx="0" cy="-8" r="5" fill={p.accent} />
            <ellipse cx="0" cy="8" rx="8" ry="4" fill={p.velvet} opacity="0.5" />
            {/* Pattern */}
            <path d="M-10 0 Q0 -5 10 0 Q0 5 -10 0" stroke={p.accent} strokeWidth="1" fill="none" opacity="0.6" />
            {/* Highlight */}
            <ellipse cx="-5" cy="-5" rx="4" ry="8" fill="#FFFFFF" opacity="0.25" />
            <defs>
                <radialGradient id="genericGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={p.glow} stopOpacity="0.6" />
                    <stop offset="100%" stopColor={p.glow} stopOpacity="0" />
                </radialGradient>
            </defs>
        </g>
    );

    // Render wide display case with dramatic lighting
    const renderWideCase = () => (
        <svg viewBox="0 0 600 380" className="w-full h-auto">
            <defs>
                {/* Museum spotlight gradient */}
                <radialGradient id="spotlightLeft" cx="30%" cy="20%" r="60%">
                    <stop offset="0%" stopColor="#FFFEF0" stopOpacity="0.4" />
                    <stop offset="40%" stopColor="#FFF8E0" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="spotlightRight" cx="70%" cy="20%" r="60%">
                    <stop offset="0%" stopColor="#FFFEF0" stopOpacity="0.4" />
                    <stop offset="40%" stopColor="#FFF8E0" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
                {/* Deep vignette */}
                <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stopColor="#000000" stopOpacity="0" />
                    <stop offset="60%" stopColor="#000000" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.7" />
                </radialGradient>
                {/* Wood grain pattern */}
                <pattern id="woodGrain" patternUnits="userSpaceOnUse" width="30" height="30">
                    <rect width="30" height="30" fill={palette.wood} />
                    <path d="M0 8 Q15 5 30 8 M0 20 Q15 23 30 20" stroke={palette.woodHighlight} strokeWidth="0.8" opacity="0.4" />
                </pattern>
                {/* Glass gradient */}
                <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
                    <stop offset="30%" stopColor={palette.glass} stopOpacity="0.1" />
                    <stop offset="70%" stopColor={palette.glass} stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.15" />
                </linearGradient>
                {/* Velvet gradient */}
                <linearGradient id="velvetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={palette.velvetHighlight} />
                    <stop offset="50%" stopColor={palette.velvet} />
                    <stop offset="100%" stopColor={palette.velvet} />
                </linearGradient>
                {/* Ambient room lighting */}
                <linearGradient id="ambientLight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2A2520" />
                    <stop offset="100%" stopColor="#1A1510" />
                </linearGradient>
            </defs>

            {/* Dark museum background */}
            <rect x="0" y="0" width="600" height="380" fill="url(#ambientLight)" />

            {/* Spotlight effects from above */}
            <ellipse cx="165" cy="0" rx="180" ry="280" fill="url(#spotlightLeft)" />
            <ellipse cx="435" cy="0" rx="180" ry="280" fill="url(#spotlightRight)" />

            {/* Floor shadow/reflection */}
            <ellipse cx="300" cy="365" rx="260" ry="15" fill="#000" opacity="0.5" />

            {/* === CABINET BASE === */}
            <rect x="40" y="305" width="520" height="55" fill="url(#woodGrain)" rx="3" />
            <rect x="45" y="310" width="510" height="45" fill={palette.woodHighlight} rx="2" />

            {/* Carved feet with shadows */}
            {[70, 200, 400, 530].map((fx, i) => (
                <g key={i}>
                    <ellipse cx={fx} cy="355" rx="24" ry="14" fill="#000" opacity="0.3" />
                    <ellipse cx={fx} cy="352" rx="22" ry="12" fill={palette.woodDark} />
                    <ellipse cx={fx} cy="349" rx="18" ry="9" fill={palette.wood} />
                    <ellipse cx={fx} cy="346" rx="10" ry="5" fill={palette.woodHighlight} opacity="0.5" />
                </g>
            ))}

            {/* === CABINET BODY === */}
            <rect x="40" y="50" width="520" height="255" fill="url(#woodGrain)" rx="2" />
            <rect x="50" y="60" width="500" height="235" fill={palette.woodHighlight} rx="1" />

            {/* === CROWN MOLDING === */}
            <rect x="30" y="30" width="540" height="25" fill={palette.woodDark} rx="2" />
            <rect x="35" y="35" width="530" height="15" fill={palette.brass} />
            <rect x="40" y="40" width="520" height="8" fill={palette.brassHighlight} opacity="0.6" />

            {/* Brass finials with glints */}
            {[60, 300, 540].map((fx, i) => (
                <g key={i}>
                    <ellipse cx={fx} cy="30" rx="12" ry="6" fill={palette.brass} />
                    <circle cx={fx} cy="20" r="10" fill={palette.brass} />
                    <circle cx={fx} cy="20" r="6" fill={palette.brassHighlight} opacity="0.4" />
                    <circle cx={fx} cy="10" r="5" fill={palette.brass} />
                    <circle cx={fx - 2} cy="17" r="2" fill="#FFFFFF" opacity="0.4" />
                </g>
            ))}

            {/* === LEFT DISPLAY AREA === */}
            {/* Dark interior */}
            <rect x="60" y="70" width="210" height="215" fill="#0A0A10" rx="1" />

            {/* Velvet base with depth */}
            <rect x="65" y="245" width="200" height="35" fill="url(#velvetGradient)" rx="2" />
            <rect x="70" y="248" width="190" height="6" fill={palette.velvetHighlight} opacity="0.3" />

            {/* Left artifacts with dramatic lighting */}
            <g>
                {renderArtifactForItem(selectedItems[0] || 'artifact', 165, 190, 1.4, 0)}
                {selectedItems.length > 2 && renderArtifactForItem(selectedItems[2], 110, 150, 1.0, 2)}
            </g>

            {/* Glass panel overlay */}
            <rect x="60" y="70" width="210" height="215" fill="url(#glassGradient)" rx="1" />
            {/* Glass reflections */}
            <path d="M70 80 L100 150 L85 200 L55 130 Z" fill="#FFFFFF" opacity="0.15" />
            <path d="M240 85 L260 125 L250 165 L230 125 Z" fill="#FFFFFF" opacity="0.08" />

            {/* === RIGHT DISPLAY AREA === */}
            {/* Dark interior */}
            <rect x="330" y="70" width="210" height="215" fill="#0A0A10" rx="1" />

            {/* Velvet base */}
            <rect x="335" y="245" width="200" height="35" fill="url(#velvetGradient)" rx="2" />
            <rect x="340" y="248" width="190" height="6" fill={palette.velvetHighlight} opacity="0.3" />

            {/* Right artifacts */}
            <g>
                {selectedItems.length > 1 && renderArtifactForItem(selectedItems[1], 435, 190, 1.4, 1)}
                {selectedItems.length > 3 && renderArtifactForItem(selectedItems[3], 490, 150, 1.0, 3)}
            </g>

            {/* Glass panel overlay */}
            <rect x="330" y="70" width="210" height="215" fill="url(#glassGradient)" rx="1" />
            {/* Glass reflections */}
            <path d="M340 80 L370 150 L355 200 L325 130 Z" fill="#FFFFFF" opacity="0.15" />
            <path d="M510 85 L530 125 L520 165 L500 125 Z" fill="#FFFFFF" opacity="0.08" />

            {/* === BRASS FRAMES === */}
            {/* Left frame */}
            <rect x="57" y="67" width="216" height="5" fill={palette.brass} />
            <rect x="57" y="283" width="216" height="5" fill={palette.brass} />
            <rect x="57" y="67" width="5" height="221" fill={palette.brass} />
            <rect x="268" y="67" width="5" height="221" fill={palette.brass} />

            {/* Right frame */}
            <rect x="327" y="67" width="216" height="5" fill={palette.brass} />
            <rect x="327" y="283" width="216" height="5" fill={palette.brass} />
            <rect x="327" y="67" width="5" height="221" fill={palette.brass} />
            <rect x="538" y="67" width="5" height="221" fill={palette.brass} />

            {/* === CENTER DIVIDER === */}
            <rect x="273" y="50" width="54" height="255" fill={palette.woodDark} />
            <rect x="280" y="55" width="40" height="245" fill={palette.wood} />

            {/* Keyhole with brass plate */}
            <ellipse cx="300" cy="240" rx="10" ry="14" fill={palette.brass} />
            <rect x="296" y="245" width="8" height="20" fill={palette.brass} />
            <circle cx="300" cy="238" r="4" fill={palette.woodDark} />
            <circle cx="298" cy="236" r="1" fill={palette.brassHighlight} opacity="0.5" />

            {/* === BRASS LABEL PLATES === */}
            <rect x="110" y="318" width="120" height="24" fill={palette.brass} rx="2" />
            <rect x="114" y="322" width="112" height="16" fill={palette.woodDark} opacity="0.2" rx="1" />
            <rect x="370" y="318" width="120" height="24" fill={palette.brass} rx="2" />
            <rect x="374" y="322" width="112" height="16" fill={palette.woodDark} opacity="0.2" rx="1" />

            {/* Vignette overlay */}
            <rect x="0" y="0" width="600" height="380" fill="url(#vignette)" />
        </svg>
    );

    // Render single display case (glass cloche) with dramatic lighting
    const renderSingleCase = () => (
        <svg viewBox="0 0 360 420" className="w-full h-auto">
            <defs>
                {/* Central spotlight */}
                <radialGradient id="centralSpotlight" cx="50%" cy="25%" r="60%">
                    <stop offset="0%" stopColor="#FFFEF0" stopOpacity="0.5" />
                    <stop offset="30%" stopColor="#FFF8E0" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
                {/* Deep vignette */}
                <radialGradient id="vignetteSingle" cx="50%" cy="45%" r="65%">
                    <stop offset="0%" stopColor="#000000" stopOpacity="0" />
                    <stop offset="50%" stopColor="#000000" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.75" />
                </radialGradient>
                {/* Glass dome gradient */}
                <radialGradient id="domeGlass" cx="25%" cy="25%" r="75%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                    <stop offset="40%" stopColor={palette.glass} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={palette.glass} stopOpacity="0.05" />
                </radialGradient>
                {/* Velvet gradient */}
                <linearGradient id="velvetBase" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={palette.velvetHighlight} />
                    <stop offset="100%" stopColor={palette.velvet} />
                </linearGradient>
                {/* Artifact glow */}
                <radialGradient id="artifactSpotlight" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={palette.glow} stopOpacity="0.6" />
                    <stop offset="60%" stopColor={palette.glowSecondary} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={palette.glow} stopOpacity="0" />
                </radialGradient>
                {/* Ambient room lighting */}
                <linearGradient id="ambientLightSingle" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2A2520" />
                    <stop offset="100%" stopColor="#1A1510" />
                </linearGradient>
            </defs>

            {/* Dark museum background */}
            <rect x="0" y="0" width="360" height="420" fill="url(#ambientLightSingle)" />

            {/* Spotlight from above */}
            <ellipse cx="180" cy="0" rx="200" ry="320" fill="url(#centralSpotlight)" />

            {/* Floor shadow */}
            <ellipse cx="180" cy="405" rx="100" ry="12" fill="#000" opacity="0.5" />

            {/* === PEDESTAL === */}
            <rect x="80" y="335" width="200" height="65" fill={palette.wood} rx="4" />
            <rect x="85" y="340" width="190" height="55" fill={palette.woodHighlight} rx="3" />

            {/* Pedestal molding */}
            <rect x="70" y="320" width="220" height="20" fill={palette.woodDark} rx="2" />
            <rect x="75" y="325" width="210" height="12" fill={palette.brass} />
            <rect x="80" y="328" width="200" height="6" fill={palette.brassHighlight} opacity="0.5" />

            {/* Pedestal feet with shadows */}
            <ellipse cx="105" cy="398" rx="22" ry="14" fill="#000" opacity="0.3" />
            <ellipse cx="105" cy="395" rx="20" ry="12" fill={palette.woodDark} />
            <ellipse cx="105" cy="392" rx="16" ry="8" fill={palette.wood} />
            <ellipse cx="255" cy="398" rx="22" ry="14" fill="#000" opacity="0.3" />
            <ellipse cx="255" cy="395" rx="20" ry="12" fill={palette.woodDark} />
            <ellipse cx="255" cy="392" rx="16" ry="8" fill={palette.wood} />

            {/* === VELVET CUSHION === */}
            <ellipse cx="180" cy="295" rx="70" ry="24" fill="url(#velvetBase)" />
            <ellipse cx="180" cy="290" rx="62" ry="18" fill={palette.velvetHighlight} opacity="0.4" />
            <ellipse cx="180" cy="285" rx="40" ry="10" fill="#FFFFFF" opacity="0.05" />

            {/* === ARTIFACT SPOTLIGHT GLOW === */}
            <ellipse cx="180" cy="180" rx="90" ry="120" fill="url(#artifactSpotlight)" />

            {/* === FEATURED ARTIFACT === */}
            <g transform="translate(180, 190)">
                {renderArtifactForItem(selectedItems[0] || 'artifact', 0, 0, 2.0, 0)}
            </g>

            {/* === GLASS DOME === */}
            <ellipse cx="180" cy="160" rx="90" ry="145" fill="url(#domeGlass)" />

            {/* Dome outline - subtle */}
            <ellipse cx="180" cy="160" rx="88" ry="143" fill="none" stroke={palette.glass} strokeWidth="2" opacity="0.4" />

            {/* Dome rim - brass */}
            <ellipse cx="180" cy="295" rx="93" ry="16" fill="none" stroke={palette.brass} strokeWidth="6" />
            <ellipse cx="180" cy="295" rx="90" ry="14" fill="none" stroke={palette.brassHighlight} strokeWidth="2" opacity="0.5" />

            {/* Glass reflections - more pronounced */}
            <path d="M105 70 Q92 140 100 220 Q105 260 95 280" stroke="#FFFFFF" strokeWidth="5" fill="none" opacity="0.3" />
            <path d="M118 60 Q108 110 112 160" stroke="#FFFFFF" strokeWidth="3" fill="none" opacity="0.2" />
            <path d="M250 90 Q262 150 258 210" stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.12" />

            {/* === BRASS FINIAL === */}
            <circle cx="180" cy="20" r="16" fill={palette.brass} />
            <circle cx="180" cy="20" r="11" fill={palette.brassHighlight} opacity="0.4" />
            <ellipse cx="180" cy="36" rx="12" ry="6" fill={palette.brass} />
            <rect x="174" y="36" width="12" height="12" fill={palette.brass} />
            <circle cx="180" cy="8" r="7" fill={palette.brass} />
            {/* Finial highlight */}
            <circle cx="176" cy="16" r="3" fill="#FFFFFF" opacity="0.35" />

            {/* === BRASS NAMEPLATE === */}
            <rect x="120" y="355" width="120" height="28" fill={palette.brass} rx="3" />
            <rect x="125" y="360" width="110" height="18" fill={palette.woodDark} opacity="0.2" rx="2" />

            {/* Vignette overlay */}
            <rect x="0" y="0" width="360" height="420" fill="url(#vignetteSingle)" />
        </svg>
    );

    // Get cultural theme label
    const getCultureLabel = (c: string): string => {
        const labels: Record<string, string> = {
            'japanese': 'Japanese Collection',
            'chinese': 'Chinese Collection',
            'egyptian': 'Egyptian Antiquities',
            'persian': 'Persian Collection',
            'moorish': 'Moorish Arts',
            'african': 'African Collection',
            'mesoamerican': 'Pre-Columbian Art',
            'italian': 'Italian Collection',
            'industrial': 'Industrial Marvels',
            'art': 'Fine Arts',
            'french': 'French Collection',
        };
        return labels[c] || 'Exhibition Display';
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-paper-100 dark:bg-ink-900 rounded-lg border-2 border-gold-600 shadow-2xl
                    max-w-5xl w-full max-h-[90dvh] overflow-hidden flex flex-col animate-scale-bounce-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gold-500/50 bg-gold-600">
                    <div className="flex items-center gap-3">
                        <LucideSparkles size={18} className="text-ink-900" />
                        <h2 className="font-display text-lg font-bold text-ink-900">
                            {isWideCase ? "Museum Display Cabinet" : "Exhibition Vitrine"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-ink-900 hover:text-ink-700 transition-colors p-1"
                        aria-label="Close"
                    >
                        <LucideX size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-5 space-y-5">
                    {/* Location and cultural context */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-ink-600 dark:text-paper-300 text-sm font-serif">{exhibitData.zoneName}</span>
                        <span className="px-3 py-1 bg-gold-100 dark:bg-gold-900/40 rounded-full text-gold-800 dark:text-gold-300 font-display text-xs tracking-wide border border-gold-300 dark:border-gold-600/50">
                            {getCultureLabel(culture)}
                        </span>
                    </div>

                    {/* SVG Display Case */}
                    <div className="rounded-lg overflow-hidden shadow-inner">
                        {isWideCase ? renderWideCase() : renderSingleCase()}
                    </div>

                    {/* Item names */}
                    <div className="space-y-3">
                        <h4 className="font-display text-sm text-ink-700 dark:text-gold-400 flex items-center gap-2 uppercase tracking-wider">
                            <LucideGlasses size={16} className="text-gold-600 dark:text-gold-500" />
                            On Display
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {selectedItems.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 text-sm bg-paper-200 dark:bg-ink-800/80 px-4 py-3 rounded-lg border border-paper-300 dark:border-ink-600/50"
                                >
                                    <span className="text-gold-600 dark:text-gold-500 mt-0.5">◆</span>
                                    <span className="text-ink-800 dark:text-paper-100 font-serif leading-snug">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Atmosphere description */}
                    <div className="bg-gold-50 dark:bg-ink-800/50 rounded-lg p-4 border-l-4 border-gold-500 dark:border-gold-600/60">
                        <p className="text-ink-700 dark:text-paper-200 italic font-serif leading-relaxed text-base">
                            "{exhibits.atmosphere}"
                        </p>
                    </div>

                    {/* Historical note */}
                    <div className="bg-paper-200 dark:bg-ink-800/30 rounded-lg p-4 border border-paper-300 dark:border-ink-700/50">
                        <div className="flex items-start gap-3">
                            <LucideBookOpen size={18} className="text-gold-600 dark:text-gold-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <h5 className="text-xs uppercase tracking-wider text-gold-700 dark:text-gold-500 mb-1.5 font-display font-semibold">Historical Note</h5>
                                <p className="text-sm text-ink-600 dark:text-paper-300 leading-relaxed font-serif">
                                    {exhibits.historicalNote}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExhibitCloseupModal;
