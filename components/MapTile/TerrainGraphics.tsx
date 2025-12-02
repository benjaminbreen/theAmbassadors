import React from 'react';
import { BiomeType } from '../../types';

// Pre-computed TERRAIN graphics (full tiles, no overlay)
export const TERRAIN_GRAPHICS: Record<string, (biome: BiomeType, seed: number) => JSX.Element> = {
    // Water (animated Seine for bridge biome)
    '~': (biome) => (
        <g>
            {biome === 'BRIDGE' ? (
                <rect width="24" height="24" fill="url(#pattern-water)"/>
            ) : (
                <>
                    <rect width="24" height="24" fill="#1565C0" opacity="0.8"/>
                    <path d="M0 8 Q6 4 12 8 T24 8" stroke="#42A5F5" fill="none" strokeWidth="2" opacity="0.6"/>
                    <path d="M0 14 Q6 10 12 14 T24 14" stroke="#64B5F6" fill="none" strokeWidth="1.5" opacity="0.5"/>
                    <path d="M0 20 Q6 16 12 20 T24 20" stroke="#90CAF9" fill="none" strokeWidth="1" opacity="0.4"/>
                </>
            )}
        </g>
    ),
    // Pylon
    'P': () => (
        <g>
            <rect width="24" height="24" fill="#1E293B"/>
            <circle cx="4" cy="4" r="1.5" fill="#64748B"/>
            <circle cx="20" cy="4" r="1.5" fill="#64748B"/>
            <circle cx="4" cy="20" r="1.5" fill="#64748B"/>
            <circle cx="20" cy="20" r="1.5" fill="#64748B"/>
            <circle cx="12" cy="12" r="2" fill="#64748B"/>
            <path d="M2 2 L22 22 M22 2 L2 22" stroke="#475569" strokeWidth="2"/>
        </g>
    ),
    // Void
    'V': (_, seed) => (
        <g>
            <rect width="24" height="24" fill="url(#voidGrad)"/>
            <ellipse cx={4 + seed * 16} cy={3 + seed * 2} rx="5" ry="1.5" fill="white" opacity="0.7"/>
            <g opacity="0.25">
                <rect x={1 + seed * 2} y={18 - seed * 2} width="1.5" height={6 + seed * 2} fill="#4a5568"/>
                <rect x={4 + seed * 3} y={20 - seed} width="2" height={4 + seed} fill="#5a6578"/>
                <rect x={14} y={18 - seed * 2} width="1.5" height={6 + seed * 2} fill="#4a5568"/>
                <rect x={20} y={19 - seed} width="1.5" height={5 + seed} fill="#4a5568"/>
            </g>
            <rect width="24" height="24" fill="url(#dangerGlow)" opacity="0.15"/>
        </g>
    ),
    // Stall Wall
    'S': () => (
        <g>
            <rect width="24" height="24" fill="#92400E"/>
            <rect x="2" y="2" width="20" height="20" fill="none" stroke="#B45309" strokeWidth="1"/>
            <path d="M6 6 L18 6 M6 12 L18 12 M6 18 L18 18" stroke="#78350F" strokeWidth="1"/>
            <rect x="0" y="0" width="24" height="2" fill="#EAB308"/>
            <rect x="0" y="22" width="24" height="2" fill="#EAB308"/>
        </g>
    ),
    // Entry door
    'E': () => (
        <g>
            <rect width="24" height="24" fill="#4A3728"/>
            <rect x="4" y="2" width="16" height="22" fill="#6D4C41"/>
            <rect x="5" y="3" width="14" height="20" fill="#8D6E63"/>
            <rect x="6" y="4" width="12" height="8" fill="#5D4037"/>
            <rect x="6" y="14" width="12" height="8" fill="#5D4037"/>
            <circle cx="16" cy="14" r="1.5" fill="#B8860B"/>
            <rect x="11" y="0" width="2" height="4" fill="#FFD700"/>
        </g>
    ),
    // Ajar door
    '[': () => (
        <g>
            <rect width="24" height="24" fill="#4A3728"/>
            <path d="M4 2 L16 6 L16 22 L4 22 Z" fill="#6D4C41"/>
            <path d="M5 3 L15 7 L15 21 L5 21 Z" fill="#A1887F"/>
            <rect x="16" y="2" width="4" height="20" fill="#1A1A1A" opacity="0.3"/>
            <ellipse cx="7" cy="14" rx="1" ry="1.5" fill="#B8860B"/>
        </g>
    ),
    // Open door
    ']': () => (
        <g>
            <rect width="24" height="24" fill="#1A1A1A" opacity="0.6"/>
            <rect x="0" y="2" width="6" height="20" fill="#6D4C41"/>
            <rect x="1" y="3" width="4" height="18" fill="#A1887F"/>
            <rect x="18" y="2" width="6" height="20" fill="#6D4C41"/>
            <rect x="19" y="3" width="4" height="18" fill="#A1887F"/>
            <rect x="6" y="0" width="12" height="24" fill="url(#doorwayGlow)" opacity="0.3"/>
        </g>
    ),
    // Door - Ornate 1889 Exposition entrance door
    '+': () => (
        <g>
            {/* Door frame - dark wood/metal */}
            <rect width="24" height="24" fill="#2D2A26"/>
            <rect x="1" y="0" width="22" height="24" fill="#3D3835"/>
            {/* Main door panels - rich mahogany */}
            <rect x="2" y="1" width="20" height="22" fill="#5D3A1A"/>
            <rect x="3" y="2" width="18" height="20" fill="#6B4423"/>
            {/* Upper panel with arched glass */}
            <rect x="4" y="3" width="16" height="8" fill="#4A3520"/>
            <path d="M5 10 L5 5 Q12 2 19 5 L19 10 Z" fill="#87CEEB" opacity="0.8"/>
            <path d="M5 10 L5 5 Q12 2 19 5 L19 10 Z" fill="none" stroke="#8B7355" strokeWidth="0.8"/>
            {/* Glass muntins */}
            <line x1="12" y1="3" x2="12" y2="10" stroke="#5D4037" strokeWidth="0.5"/>
            <line x1="8" y1="4" x2="8" y2="10" stroke="#5D4037" strokeWidth="0.3"/>
            <line x1="16" y1="4" x2="16" y2="10" stroke="#5D4037" strokeWidth="0.3"/>
            {/* Lower panels */}
            <rect x="4" y="12" width="7" height="9" fill="#4A3520"/>
            <rect x="5" y="13" width="5" height="7" fill="#5D3A1A"/>
            <rect x="13" y="12" width="7" height="9" fill="#4A3520"/>
            <rect x="14" y="13" width="5" height="7" fill="#5D3A1A"/>
            {/* Decorative brass hardware */}
            <circle cx="18" cy="14" r="1.2" fill="#B8860B"/>
            <circle cx="18" cy="14" r="0.6" fill="#DAA520"/>
            {/* Brass door handle */}
            <ellipse cx="18" cy="16" rx="0.8" ry="1.5" fill="#B8860B"/>
            {/* Threshold */}
            <rect x="0" y="22" width="24" height="2" fill="#8B7355"/>
            {/* Light reflection on glass */}
            <ellipse cx="9" cy="6" rx="2" ry="1.5" fill="#fff" opacity="0.25"/>
        </g>
    ),
    // Water pool (Trocadéro)
    'W': () => (
        <g>
            <rect width="24" height="24" fill="#1565C0"/>
            <rect x="1" y="1" width="22" height="22" fill="#2196F3" opacity="0.8"/>
            <ellipse cx="12" cy="12" rx="8" ry="4" fill="none" stroke="#64B5F6" strokeWidth="0.5" opacity="0.5">
                <animate attributeName="rx" values="8;10;8" dur="3s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="8" cy="8" rx="3" ry="1.5" fill="#fff" opacity="0.2"/>
        </g>
    ),
};

// Tiles that ARE terrain (render as full tile, no overlay needed)
export const TERRAIN_TILES = new Set([
    '.', ':', 'g', 'v', '#', '~', 'P', 'V', 'S', 'E', '[', ']', '+',
    ',', '`', 'o',
    '▲', '▼', '►', '◄', '┐', '┌', '┘', '└',
    '░',
    'W'
]);
