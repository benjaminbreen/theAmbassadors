import React from 'react';

// Props for dynamic water colors based on time of day
interface MapDefsProps {
    waterBase?: string;      // Base water color (default: dark Seine blue for night)
    waterHighlight?: string; // Highlight/caustic color
    waterDepth?: string;     // Depth gradient color
}

// Shared SVG definitions for map tiles - rendered once at map level
const MapDefs: React.FC<MapDefsProps> = ({
    waterBase = '#1A3847',      // Default: murky Seine night
    waterHighlight = '#2A4A5A', // Default: night highlight
    waterDepth = '#1A3040'      // Default: night depth
}) => (
    <defs>
        {/* Gradients */}
        <linearGradient id="voidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.9"/>
            <stop offset="40%" stopColor="#B0C4DE" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#D3D3D3" stopOpacity="0.5"/>
        </linearGradient>

        <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFEB3B" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#FFEB3B" stopOpacity="0"/>
        </radialGradient>

        <radialGradient id="dangerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="transparent"/>
            <stop offset="100%" stopColor="#FF0000" stopOpacity="0.3"/>
        </radialGradient>

        {/* Wall shadow gradients - for floor tiles adjacent to walls */}
        <linearGradient id="wall-shadow-n" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000000" stopOpacity="1"/>
            <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="wall-shadow-w" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000000" stopOpacity="1"/>
            <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="wall-shadow-e" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#000000" stopOpacity="1"/>
            <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
        </linearGradient>

        {/* Floor Patterns */}

        {/* Plain Exposition Floor - polished concrete/stone for national pavilions */}
        <pattern id="pattern-salon" patternUnits="userSpaceOnUse" width="24" height="24">
            {/* Neutral grey-beige polished concrete */}
            <rect width="24" height="24" fill="#B8B0A0"/>
            {/* Subtle large flagstone pattern */}
            <g opacity="0.15">
                <line x1="0" y1="12" x2="24" y2="12" stroke="#8A8070" strokeWidth="1"/>
                <line x1="12" y1="0" x2="12" y2="24" stroke="#8A8070" strokeWidth="1"/>
            </g>
            {/* Very subtle variation/wear */}
            <g opacity="0.08">
                <rect x="1" y="1" width="10" height="10" fill="#9A9080"/>
                <rect x="13" y="13" width="10" height="10" fill="#9A9080"/>
            </g>
            {/* Occasional dust motes */}
            <g opacity="0.1">
                <circle cx="5" cy="7" r="0.5" fill="#706050"/>
                <circle cx="18" cy="19" r="0.4" fill="#706050"/>
            </g>
        </pattern>

        {/* Ornate Parquet - for carpet tiles only */}
        <pattern id="pattern-ornate-parquet" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#8B7355"/>
            <g opacity="0.3">
                <path d="M0 0 L6 6 L0 12 M6 6 L12 0 L18 6 L12 12 L6 6 M12 12 L18 6 L24 12 M12 12 L18 18 L12 24 M18 18 L24 12 L24 24"
                      stroke="#5D4E37" strokeWidth="1" fill="none"/>
                <path d="M0 12 L6 18 L0 24 M6 18 L12 12 M6 18 L12 24" stroke="#5D4E37" strokeWidth="1" fill="none"/>
            </g>
        </pattern>

        <pattern id="pattern-street" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#706050"/>
            <g opacity="0.5">
                <rect x="1" y="1" width="5" height="4" rx="1" fill="#605040"/>
                <rect x="7" y="0" width="6" height="5" rx="1" fill="#585048"/>
                <rect x="14" y="1" width="5" height="4" rx="1" fill="#686058"/>
                <rect x="20" y="0" width="4" height="5" rx="1" fill="#605040"/>
                <rect x="0" y="6" width="4" height="5" rx="1" fill="#585048"/>
                <rect x="5" y="5" width="6" height="6" rx="1" fill="#686058"/>
                <rect x="12" y="6" width="5" height="5" rx="1" fill="#605040"/>
                <rect x="18" y="5" width="6" height="6" rx="1" fill="#585048"/>
                <rect x="1" y="12" width="5" height="5" rx="1" fill="#686058"/>
                <rect x="7" y="11" width="6" height="6" rx="1" fill="#605040"/>
                <rect x="14" y="12" width="5" height="5" rx="1" fill="#585048"/>
                <rect x="20" y="11" width="4" height="6" rx="1" fill="#686058"/>
                <rect x="0" y="18" width="4" height="6" rx="1" fill="#605040"/>
                <rect x="5" y="17" width="6" height="7" rx="1" fill="#585048"/>
                <rect x="12" y="18" width="5" height="6" rx="1" fill="#686058"/>
                <rect x="18" y="17" width="6" height="7" rx="1" fill="#605040"/>
            </g>
        </pattern>

        <pattern id="pattern-garden" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#90A060"/>
            <g opacity="0.4">
                <path d="M5 22 Q6 16 7 22" stroke="#507030" strokeWidth="1" fill="none"/>
                <path d="M11 24 Q12 18 13 24" stroke="#608040" strokeWidth="1" fill="none"/>
                <path d="M17 22 Q18 16 19 22" stroke="#507030" strokeWidth="1" fill="none"/>
                <path d="M21 24 Q22 19 23 24" stroke="#608040" strokeWidth="1" fill="none"/>
            </g>
        </pattern>

        {/* Grand Hall - Industrial iron plate flooring for machinery halls */}
        <pattern id="pattern-grandhall" patternUnits="userSpaceOnUse" width="24" height="24">
            {/* Dark industrial iron/steel plate */}
            <rect width="24" height="24" fill="#4A4A4A"/>
            {/* Iron plate grid lines */}
            <g stroke="#3A3A3A" strokeWidth="1" opacity="0.6">
                <line x1="0" y1="12" x2="24" y2="12"/>
                <line x1="12" y1="0" x2="12" y2="24"/>
            </g>
            {/* Rivets at intersections */}
            <circle cx="12" cy="12" r="1.5" fill="#5A5A5A"/>
            <circle cx="12" cy="12" r="0.8" fill="#3A3A3A"/>
            {/* Corner rivets */}
            <circle cx="3" cy="3" r="1" fill="#5A5A5A"/>
            <circle cx="21" cy="3" r="1" fill="#5A5A5A"/>
            <circle cx="3" cy="21" r="1" fill="#5A5A5A"/>
            <circle cx="21" cy="21" r="1" fill="#5A5A5A"/>
            {/* Subtle worn marks */}
            <g opacity="0.15">
                <ellipse cx="7" cy="6" rx="3" ry="1.5" fill="#2A2A2A"/>
                <ellipse cx="18" cy="18" rx="2" ry="1" fill="#2A2A2A"/>
            </g>
        </pattern>

        <pattern id="pattern-towerlevel" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#3D4852"/>
            <g opacity="0.5">
                <path d="M0 6 H24 M0 12 H24 M0 18 H24" stroke="#2D3842" strokeWidth="2"/>
                <path d="M6 0 V24 M12 0 V24 M18 0 V24" stroke="#2D3842" strokeWidth="2"/>
            </g>
            <circle cx="6" cy="6" r="1.5" fill="#5D6872"/>
            <circle cx="18" cy="6" r="1.5" fill="#5D6872"/>
            <circle cx="6" cy="18" r="1.5" fill="#5D6872"/>
            <circle cx="18" cy="18" r="1.5" fill="#5D6872"/>
        </pattern>

        <pattern id="pattern-towerbase" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#3A4550"/>
            <g opacity="0.6">
                <path d="M0 0 L24 24" stroke="#2A3540" strokeWidth="3"/>
                <path d="M24 0 L0 24" stroke="#2A3540" strokeWidth="3"/>
            </g>
            <circle cx="12" cy="12" r="4" fill="#2A3540"/>
            <circle cx="12" cy="12" r="2.5" fill="#4A5560"/>
            <circle cx="2" cy="2" r="1.5" fill="#5A6570"/>
            <circle cx="22" cy="2" r="1.5" fill="#5A6570"/>
            <circle cx="2" cy="22" r="1.5" fill="#5A6570"/>
            <circle cx="22" cy="22" r="1.5" fill="#5A6570"/>
        </pattern>

        <pattern id="pattern-towerplatform" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#87CEEB" opacity="0.3"/>
            <rect width="24" height="24" fill="#4A5568" opacity="0.7"/>
            <rect x="2" y="2" width="8" height="8" fill="#87CEEB" opacity="0.4"/>
            <rect x="14" y="2" width="8" height="8" fill="#87CEEB" opacity="0.4"/>
            <rect x="2" y="14" width="8" height="8" fill="#87CEEB" opacity="0.4"/>
            <rect x="14" y="14" width="8" height="8" fill="#87CEEB" opacity="0.4"/>
            <path d="M0 12 H24 M12 0 V24" stroke="#3A4558" strokeWidth="3"/>
            <path d="M0 0 H24 M0 24 H24 M0 0 V24 M24 0 V24" stroke="#3A4558" strokeWidth="2"/>
        </pattern>

        <pattern id="pattern-esplanade" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#C4B090"/>
            <g opacity="0.3">
                <circle cx="5" cy="5" r="1" fill="#A09070"/>
                <circle cx="12" cy="8" r="0.8" fill="#B0A080"/>
                <circle cx="20" cy="4" r="1.2" fill="#A09070"/>
                <circle cx="6" cy="15" r="0.9" fill="#B0A080"/>
                <circle cx="16" cy="16" r="1.1" fill="#A09070"/>
                <circle cx="21" cy="20" r="0.8" fill="#B0A080"/>
                <circle cx="10" cy="21" r="1" fill="#A09070"/>
                <circle cx="17" cy="23" r="0.9" fill="#B0A080"/>
            </g>
        </pattern>

        <pattern id="pattern-grass" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#22C55E"/>
            <g opacity="0.3">
                <path d="M5 24 Q6 18 7 24" stroke="#15803D" strokeWidth="0.5" fill="none"/>
                <path d="M12 24 Q13 16 14 24" stroke="#15803D" strokeWidth="0.5" fill="none"/>
                <path d="M19 24 Q20 19 21 24" stroke="#15803D" strokeWidth="0.5" fill="none"/>
                <path d="M8 24 Q9 20 10 24" stroke="#16A34A" strokeWidth="0.5" fill="none"/>
                <path d="M16 24 Q17 17 18 24" stroke="#16A34A" strokeWidth="0.5" fill="none"/>
            </g>
        </pattern>

        {/* Gravel Path - Simple sandy base, detail added per-tile via randomized pebbles */}
        <pattern id="pattern-gravel" patternUnits="userSpaceOnUse" width="24" height="24">
            {/* Warm sandy base - classic Parisian gravel color */}
            <rect width="24" height="24" fill="#D4C4A8"/>
            {/* Subtle texture noise */}
            <g opacity="0.25">
                <circle cx="4" cy="6" r="0.4" fill="#B8A88A"/>
                <circle cx="12" cy="4" r="0.3" fill="#A89878"/>
                <circle cx="20" cy="8" r="0.4" fill="#B8A88A"/>
                <circle cx="8" cy="14" r="0.3" fill="#A89878"/>
                <circle cx="16" cy="18" r="0.4" fill="#B8A88A"/>
                <circle cx="6" cy="20" r="0.3" fill="#A89878"/>
                <circle cx="18" cy="12" r="0.3" fill="#B8A88A"/>
                <circle cx="2" cy="16" r="0.3" fill="#A89878"/>
            </g>
            {/* Very subtle shadow for minimal depth */}
            <g opacity="0.08">
                <ellipse cx="12" cy="12" rx="4" ry="2" fill="#4A3A2A"/>
            </g>
        </pattern>

        <pattern id="pattern-sidewalk" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#A1887F"/>
            <g stroke="#8D6E63" strokeWidth="0.5" fill="none">
                <rect x="1" y="1" width="10" height="10"/>
                <rect x="13" y="1" width="10" height="10"/>
                <rect x="1" y="13" width="10" height="10"/>
                <rect x="13" y="13" width="10" height="10"/>
            </g>
        </pattern>

        {/* Tower First Floor - Elegant iron and glass */}
        <pattern id="pattern-towerfirstfloor" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#5D6D7E"/>
            <g opacity="0.4">
                <path d="M0 8 H24 M0 16 H24" stroke="#34495E" strokeWidth="2"/>
                <path d="M8 0 V24 M16 0 V24" stroke="#34495E" strokeWidth="2"/>
            </g>
            <rect x="2" y="2" width="4" height="4" fill="#85C1E9" opacity="0.3"/>
            <rect x="10" y="2" width="4" height="4" fill="#85C1E9" opacity="0.3"/>
            <rect x="18" y="2" width="4" height="4" fill="#85C1E9" opacity="0.3"/>
            <rect x="2" y="10" width="4" height="4" fill="#85C1E9" opacity="0.3"/>
            <rect x="10" y="10" width="4" height="4" fill="#85C1E9" opacity="0.3"/>
            <rect x="18" y="10" width="4" height="4" fill="#85C1E9" opacity="0.3"/>
            <rect x="2" y="18" width="4" height="4" fill="#85C1E9" opacity="0.3"/>
            <rect x="10" y="18" width="4" height="4" fill="#85C1E9" opacity="0.3"/>
            <rect x="18" y="18" width="4" height="4" fill="#85C1E9" opacity="0.3"/>
            <circle cx="8" cy="8" r="1" fill="#2C3E50"/>
            <circle cx="16" cy="8" r="1" fill="#2C3E50"/>
            <circle cx="8" cy="16" r="1" fill="#2C3E50"/>
            <circle cx="16" cy="16" r="1" fill="#2C3E50"/>
        </pattern>

        {/* Concert Hall - Moorish geometric pattern */}
        <pattern id="pattern-concerthall" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#4A1C40"/>
            <g opacity="0.5">
                <path d="M12 0 L24 12 L12 24 L0 12 Z" fill="none" stroke="#7D3C98" strokeWidth="1"/>
                <path d="M6 0 L12 6 L6 12 L0 6 Z" fill="#5B2C6F" opacity="0.5"/>
                <path d="M18 0 L24 6 L18 12 L12 6 Z" fill="#5B2C6F" opacity="0.5"/>
                <path d="M6 12 L12 18 L6 24 L0 18 Z" fill="#5B2C6F" opacity="0.5"/>
                <path d="M18 12 L24 18 L18 24 L12 18 Z" fill="#5B2C6F" opacity="0.5"/>
            </g>
            <circle cx="12" cy="12" r="3" fill="#D4AC0D" opacity="0.6"/>
            <circle cx="12" cy="12" r="1.5" fill="#F4D03F" opacity="0.8"/>
            <circle cx="0" cy="0" r="2" fill="#D4AC0D" opacity="0.4"/>
            <circle cx="24" cy="0" r="2" fill="#D4AC0D" opacity="0.4"/>
            <circle cx="0" cy="24" r="2" fill="#D4AC0D" opacity="0.4"/>
            <circle cx="24" cy="24" r="2" fill="#D4AC0D" opacity="0.4"/>
        </pattern>

        {/* Souk - Dusty terracotta and sand */}
        <pattern id="pattern-souk" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#C4A77D"/>
            <g opacity="0.4">
                <circle cx="4" cy="4" r="1.5" fill="#8B7355"/>
                <circle cx="12" cy="6" r="1" fill="#A08060"/>
                <circle cx="20" cy="3" r="1.2" fill="#8B7355"/>
                <circle cx="6" cy="12" r="0.8" fill="#A08060"/>
                <circle cx="16" cy="14" r="1.4" fill="#8B7355"/>
                <circle cx="8" cy="20" r="1.1" fill="#A08060"/>
                <circle cx="18" cy="18" r="0.9" fill="#8B7355"/>
                <circle cx="2" cy="16" r="1" fill="#A08060"/>
            </g>
            <g opacity="0.2">
                <path d="M0 12 Q6 10 12 12 Q18 14 24 12" stroke="#6D5D4D" strokeWidth="0.5" fill="none"/>
                <path d="M0 18 Q8 16 16 18 Q20 19 24 18" stroke="#6D5D4D" strokeWidth="0.5" fill="none"/>
            </g>
        </pattern>

        {/* Fire/brazier glow gradient */}
        <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF5722" stopOpacity="0.6"/>
            <stop offset="50%" stopColor="#FF9800" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#FFEB3B" stopOpacity="0"/>
        </radialGradient>

        {/* Galerie des Machines - Industrial iron and glass */}
        <pattern id="pattern-galerie" patternUnits="userSpaceOnUse" width="24" height="24">
            {/* Dark industrial floor */}
            <rect width="24" height="24" fill="#3D4147"/>
            {/* Iron plate grid pattern */}
            <g opacity="0.6">
                <line x1="0" y1="0" x2="24" y2="0" stroke="#5C6370" strokeWidth="0.5"/>
                <line x1="0" y1="8" x2="24" y2="8" stroke="#5C6370" strokeWidth="0.5"/>
                <line x1="0" y1="16" x2="24" y2="16" stroke="#5C6370" strokeWidth="0.5"/>
                <line x1="0" y1="0" x2="0" y2="24" stroke="#5C6370" strokeWidth="0.5"/>
                <line x1="8" y1="0" x2="8" y2="24" stroke="#5C6370" strokeWidth="0.5"/>
                <line x1="16" y1="0" x2="16" y2="24" stroke="#5C6370" strokeWidth="0.5"/>
            </g>
            {/* Rivet details */}
            <circle cx="4" cy="4" r="1" fill="#6B7280"/>
            <circle cx="12" cy="4" r="1" fill="#6B7280"/>
            <circle cx="20" cy="4" r="1" fill="#6B7280"/>
            <circle cx="4" cy="12" r="1" fill="#6B7280"/>
            <circle cx="12" cy="12" r="1" fill="#6B7280"/>
            <circle cx="20" cy="12" r="1" fill="#6B7280"/>
            <circle cx="4" cy="20" r="1" fill="#6B7280"/>
            <circle cx="12" cy="20" r="1" fill="#6B7280"/>
            <circle cx="20" cy="20" r="1" fill="#6B7280"/>
            {/* Oil stain effect */}
            <ellipse cx="8" cy="18" rx="3" ry="2" fill="#2C2F33" opacity="0.4"/>
        </pattern>

        {/* Steam effect gradient */}
        <radialGradient id="steamGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7"/>
            <stop offset="50%" stopColor="#E8E8E8" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#D0D0D0" stopOpacity="0"/>
        </radialGradient>

        {/* ============================================ */}
        {/* MACHINE ANIMATION GRADIENTS & EFFECTS */}
        {/* ============================================ */}

        {/* Electric arc glow */}
        <radialGradient id="electricGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00BFFF" stopOpacity="0.9">
                <animate attributeName="stopOpacity" values="0.9;0.5;0.9" dur="0.3s" repeatCount="indefinite"/>
            </stop>
            <stop offset="40%" stopColor="#4169E1" stopOpacity="0.6">
                <animate attributeName="stopOpacity" values="0.6;0.3;0.6" dur="0.3s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="#00008B" stopOpacity="0"/>
        </radialGradient>

        {/* Furnace glow for steam engines */}
        <radialGradient id="furnaceGlow" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#FF4500" stopOpacity="0.9">
                <animate attributeName="stopColor" values="#FF4500;#FF6347;#FF4500" dur="1.5s" repeatCount="indefinite"/>
            </stop>
            <stop offset="50%" stopColor="#FF8C00" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#8B0000" stopOpacity="0"/>
        </radialGradient>

        {/* Dynamo copper glow */}
        <radialGradient id="copperGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B87333" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#CD7F32" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#8B4513" stopOpacity="0"/>
        </radialGradient>

        {/* Piston steam burst */}
        <linearGradient id="steamBurst" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#E0E0E0" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#C0C0C0" stopOpacity="0"/>
        </linearGradient>

        {/* Gauge glass reflection */}
        <linearGradient id="gaugeGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6"/>
            <stop offset="50%" stopColor="#87CEEB" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#4682B4" stopOpacity="0.1"/>
        </linearGradient>

        {/* Brass metal gradient */}
        <linearGradient id="brassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37"/>
            <stop offset="50%" stopColor="#B8860B"/>
            <stop offset="100%" stopColor="#8B7355"/>
        </linearGradient>

        {/* Steel gradient */}
        <linearGradient id="steelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#708090"/>
            <stop offset="50%" stopColor="#4A5568"/>
            <stop offset="100%" stopColor="#2D3748"/>
        </linearGradient>

        {/* Oil sheen effect */}
        <linearGradient id="oilSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.8"/>
            <stop offset="30%" stopColor="#16213e" stopOpacity="0.6"/>
            <stop offset="50%" stopColor="#0f3460" stopOpacity="0.4">
                <animate attributeName="stopOpacity" values="0.4;0.6;0.4" dur="3s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.8"/>
        </linearGradient>

        {/* Bridge - Stone pavement */}
        <pattern id="pattern-bridge" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#9CA3AF"/>
            <g opacity="0.4">
                <rect x="1" y="1" width="10" height="10" fill="#A8A29E" rx="0.5"/>
                <rect x="13" y="1" width="10" height="10" fill="#78716C" rx="0.5"/>
                <rect x="1" y="13" width="10" height="10" fill="#78716C" rx="0.5"/>
                <rect x="13" y="13" width="10" height="10" fill="#A8A29E" rx="0.5"/>
            </g>
            <g stroke="#6B7280" strokeWidth="0.5" fill="none">
                <line x1="12" y1="0" x2="12" y2="24"/>
                <line x1="0" y1="12" x2="24" y2="12"/>
            </g>
        </pattern>

        {/* Gate entrance - cobblestone plaza with ornate border */}
        <pattern id="pattern-gate" patternUnits="userSpaceOnUse" width="24" height="24">
            {/* Base cobblestone - slightly different coloring for entrance area */}
            <rect width="24" height="24" fill="#BCAAA4"/>
            {/* Cobblestone pattern */}
            <g opacity="0.5">
                <rect x="1" y="1" width="5" height="4" fill="#A1887F" rx="0.5"/>
                <rect x="7" y="1" width="4" height="4" fill="#8D6E63" rx="0.5"/>
                <rect x="12" y="1" width="5" height="4" fill="#A1887F" rx="0.5"/>
                <rect x="18" y="1" width="5" height="4" fill="#8D6E63" rx="0.5"/>
                <rect x="0" y="6" width="4" height="5" fill="#8D6E63" rx="0.5"/>
                <rect x="5" y="6" width="6" height="5" fill="#A1887F" rx="0.5"/>
                <rect x="12" y="6" width="4" height="5" fill="#8D6E63" rx="0.5"/>
                <rect x="17" y="6" width="7" height="5" fill="#A1887F" rx="0.5"/>
                <rect x="1" y="12" width="5" height="5" fill="#A1887F" rx="0.5"/>
                <rect x="7" y="12" width="5" height="5" fill="#8D6E63" rx="0.5"/>
                <rect x="13" y="12" width="4" height="5" fill="#A1887F" rx="0.5"/>
                <rect x="18" y="12" width="5" height="5" fill="#8D6E63" rx="0.5"/>
                <rect x="0" y="18" width="4" height="5" fill="#8D6E63" rx="0.5"/>
                <rect x="5" y="18" width="6" height="5" fill="#A1887F" rx="0.5"/>
                <rect x="12" y="18" width="5" height="5" fill="#8D6E63" rx="0.5"/>
                <rect x="18" y="18" width="6" height="5" fill="#A1887F" rx="0.5"/>
            </g>
            {/* Subtle mortar lines */}
            <g stroke="#9E8B7D" strokeWidth="0.3" opacity="0.4">
                <line x1="0" y1="5" x2="24" y2="5"/>
                <line x1="0" y1="11" x2="24" y2="11"/>
                <line x1="0" y1="17" x2="24" y2="17"/>
                <line x1="6" y1="0" x2="6" y2="24"/>
                <line x1="12" y1="0" x2="12" y2="24"/>
                <line x1="18" y1="0" x2="18" y2="24"/>
            </g>
        </pattern>

        {/* Seine river water pattern - visible animations, optimized count */}
        <pattern id="pattern-water" patternUnits="userSpaceOnUse" width="24" height="24">
            {/* Deep water base */}
            <rect width="24" height="24" fill={waterBase}/>

            {/* Depth gradient overlay */}
            <rect width="24" height="24" fill="url(#waterDepthGrad)" opacity="0.5"/>

            {/* Animated flowing current streaks - visible horizontal movement */}
            <rect x="0" y="4" width="32" height="2.5" fill="#5A9AB8" opacity="0.5">
                <animate attributeName="x" values="0;-24" dur="3s" repeatCount="indefinite"/>
            </rect>
            <rect x="12" y="12" width="32" height="2" fill="#4A8AA8" opacity="0.45">
                <animate attributeName="x" values="12;-12" dur="2.5s" repeatCount="indefinite"/>
            </rect>
            <rect x="-6" y="20" width="32" height="2.5" fill="#5A9AB8" opacity="0.5">
                <animate attributeName="x" values="-6;-30" dur="3.5s" repeatCount="indefinite"/>
            </rect>

            {/* Animated ripple waves - two offset for more movement */}
            <path d="M0 8 Q6 6 12 8 Q18 10 24 8" fill="none" stroke="#7CBAD0" strokeWidth="1.2" opacity="0.6">
                <animate attributeName="d"
                    values="M0 8 Q6 6 12 8 Q18 10 24 8;M0 8 Q6 10 12 8 Q18 6 24 8;M0 8 Q6 6 12 8 Q18 10 24 8"
                    dur="2.5s" repeatCount="indefinite"/>
            </path>
            <path d="M0 17 Q6 19 12 17 Q18 15 24 17" fill="none" stroke="#6AAAC0" strokeWidth="1" opacity="0.5">
                <animate attributeName="d"
                    values="M0 17 Q6 19 12 17 Q18 15 24 17;M0 17 Q6 15 12 17 Q18 19 24 17;M0 17 Q6 19 12 17 Q18 15 24 17"
                    dur="3s" repeatCount="indefinite"/>
            </path>

            {/* Sky reflections - static */}
            <ellipse cx="8" cy="6" rx="4" ry="2" fill="#9DD" opacity="0.2"/>
            <ellipse cx="18" cy="18" rx="3" ry="1.5" fill="#8CC" opacity="0.15"/>

            {/* Animated sparkles - sun glints on water */}
            <circle cx="6" cy="10" r="1.2" fill="#FFF">
                <animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="18" cy="5" r="1" fill="#FFF">
                <animate attributeName="opacity" values="0;0.7;0" dur="2.5s" repeatCount="indefinite" begin="0.8s"/>
            </circle>
            <circle cx="12" cy="20" r="0.8" fill="#FFF">
                <animate attributeName="opacity" values="0;0.6;0" dur="3s" repeatCount="indefinite" begin="1.5s"/>
            </circle>
        </pattern>

        {/* Water depth gradient for realism - uses dynamic depth color */}
        <linearGradient id="waterDepthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={waterDepth} stopOpacity="0.3"/>
            <stop offset="50%" stopColor={waterHighlight} stopOpacity="0"/>
            <stop offset="100%" stopColor={waterDepth} stopOpacity="0.4"/>
        </linearGradient>

        {/* Animated waterfall gradient */}
        <linearGradient id="waterfallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BFDBFE"/>
            <stop offset="30%" stopColor="#60A5FA"/>
            <stop offset="70%" stopColor="#3B82F6"/>
            <stop offset="100%" stopColor="#2563EB"/>
        </linearGradient>

        {/* Waterfall foam gradient */}
        <radialGradient id="waterfallFoam" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9"/>
            <stop offset="50%" stopColor="#E0F2FE" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0"/>
        </radialGradient>

        {/* Animated pool water pattern */}
        <pattern id="pattern-pool" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#1E40AF" opacity="0.8"/>
            {/* Concentric ripples */}
            <circle cx="12" cy="12" r="4" fill="none" stroke="#60A5FA" strokeWidth="0.5" opacity="0.6">
                <animate attributeName="r" values="4;12;4" dur="4s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.8;0;0.8" dur="4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="12" cy="12" r="8" fill="none" stroke="#93C5FD" strokeWidth="0.3" opacity="0.4">
                <animate attributeName="r" values="8;16;8" dur="4s" repeatCount="indefinite" begin="1s"/>
                <animate attributeName="opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite" begin="1s"/>
            </circle>
            {/* Light reflections */}
            <ellipse cx="6" cy="8" rx="3" ry="1.5" fill="#FFFFFF" opacity="0.2">
                <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="18" cy="18" rx="2" ry="1" fill="#FFFFFF" opacity="0.15"/>
        </pattern>

        {/* ============================================ */}
        {/* CULTURAL FLOOR PATTERNS */}
        {/* ============================================ */}

        {/* Persian Carpet - Rich red with intricate medallion pattern */}
        <pattern id="pattern-persian" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#8B0000"/>
            {/* Outer border */}
            <rect x="1" y="1" width="22" height="22" fill="none" stroke="#DAA520" strokeWidth="1"/>
            <rect x="3" y="3" width="18" height="18" fill="none" stroke="#1E3A5F" strokeWidth="0.5"/>
            {/* Central medallion */}
            <circle cx="12" cy="12" r="6" fill="none" stroke="#DAA520" strokeWidth="1"/>
            <circle cx="12" cy="12" r="4" fill="#1E3A5F"/>
            <circle cx="12" cy="12" r="2" fill="#DAA520"/>
            {/* Corner flourishes */}
            <path d="M3 3 Q6 6 3 9 M21 3 Q18 6 21 9 M3 21 Q6 18 3 15 M21 21 Q18 18 21 15"
                  stroke="#DAA520" strokeWidth="0.5" fill="none"/>
            {/* Geometric accents */}
            <rect x="5" y="5" width="2" height="2" fill="#DAA520" opacity="0.6"/>
            <rect x="17" y="5" width="2" height="2" fill="#DAA520" opacity="0.6"/>
            <rect x="5" y="17" width="2" height="2" fill="#DAA520" opacity="0.6"/>
            <rect x="17" y="17" width="2" height="2" fill="#DAA520" opacity="0.6"/>
        </pattern>

        {/* Tatami - Japanese woven reed floor */}
        <pattern id="pattern-tatami" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#C4A961"/>
            {/* Woven texture - horizontal lines */}
            <g stroke="#A08840" strokeWidth="0.5" opacity="0.6">
                <line x1="0" y1="3" x2="24" y2="3"/>
                <line x1="0" y1="6" x2="24" y2="6"/>
                <line x1="0" y1="9" x2="24" y2="9"/>
                <line x1="0" y1="12" x2="24" y2="12"/>
                <line x1="0" y1="15" x2="24" y2="15"/>
                <line x1="0" y1="18" x2="24" y2="18"/>
                <line x1="0" y1="21" x2="24" y2="21"/>
            </g>
            {/* Cross-weave pattern */}
            <g stroke="#B09850" strokeWidth="0.3" opacity="0.4">
                <line x1="4" y1="0" x2="4" y2="24"/>
                <line x1="8" y1="0" x2="8" y2="24"/>
                <line x1="12" y1="0" x2="12" y2="24"/>
                <line x1="16" y1="0" x2="16" y2="24"/>
                <line x1="20" y1="0" x2="20" y2="24"/>
            </g>
            {/* Border edge (black binding) */}
            <rect x="0" y="0" width="24" height="1" fill="#2D4A22"/>
            <rect x="0" y="23" width="24" height="1" fill="#2D4A22"/>
        </pattern>

        {/* Parquet Herringbone - French wood flooring */}
        <pattern id="pattern-parquet" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#8B6914"/>
            {/* Herringbone wood planks */}
            <g fill="#A67B3D">
                <polygon points="0,0 6,0 12,6 12,12 6,12 0,6"/>
                <polygon points="12,0 18,0 24,6 24,12 18,12 12,6"/>
                <polygon points="0,12 6,12 12,18 12,24 6,24 0,18"/>
                <polygon points="12,12 18,12 24,18 24,24 18,24 12,18"/>
            </g>
            <g fill="#7A5A10">
                <polygon points="6,0 12,0 12,6"/>
                <polygon points="18,0 24,0 24,6"/>
                <polygon points="6,12 12,12 12,18"/>
                <polygon points="18,12 24,12 24,18"/>
            </g>
            {/* Wood grain lines */}
            <g stroke="#6B4A08" strokeWidth="0.3" opacity="0.5">
                <line x1="2" y1="2" x2="8" y2="8"/>
                <line x1="4" y1="1" x2="10" y2="7"/>
                <line x1="14" y1="2" x2="20" y2="8"/>
                <line x1="16" y1="1" x2="22" y2="7"/>
            </g>
        </pattern>

        {/* Wood Plank - Simple horizontal boards */}
        <pattern id="pattern-woodplank" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#8B5A2B"/>
            {/* Plank divisions */}
            <line x1="0" y1="6" x2="24" y2="6" stroke="#6B4423" strokeWidth="1"/>
            <line x1="0" y1="12" x2="24" y2="12" stroke="#6B4423" strokeWidth="1"/>
            <line x1="0" y1="18" x2="24" y2="18" stroke="#6B4423" strokeWidth="1"/>
            {/* Staggered vertical joins */}
            <line x1="8" y1="0" x2="8" y2="6" stroke="#6B4423" strokeWidth="0.5"/>
            <line x1="16" y1="6" x2="16" y2="12" stroke="#6B4423" strokeWidth="0.5"/>
            <line x1="6" y1="12" x2="6" y2="18" stroke="#6B4423" strokeWidth="0.5"/>
            <line x1="18" y1="18" x2="18" y2="24" stroke="#6B4423" strokeWidth="0.5"/>
            {/* Wood grain */}
            <g stroke="#7B4A33" strokeWidth="0.3" opacity="0.4">
                <path d="M2 2 Q4 3 6 2"/>
                <path d="M14 3 Q16 4 18 3"/>
                <path d="M3 8 Q5 9 7 8"/>
                <path d="M12 9 Q14 10 16 9"/>
                <path d="M1 14 Q3 15 5 14"/>
                <path d="M18 15 Q20 16 22 15"/>
            </g>
            {/* Knots */}
            <circle cx="20" cy="3" r="1" fill="#5A3A1B"/>
            <circle cx="4" cy="15" r="0.8" fill="#5A3A1B"/>
        </pattern>

        {/* Moorish Tile - Geometric Islamic pattern */}
        <pattern id="pattern-moorish" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#1E3A5F"/>
            {/* Eight-pointed star pattern */}
            <polygon points="12,2 14,8 20,8 16,12 18,18 12,14 6,18 8,12 4,8 10,8"
                     fill="#FFFFFF" opacity="0.9"/>
            <polygon points="12,5 13,8 16,9 13,12 14,15 12,13 10,15 11,12 8,9 11,8"
                     fill="#DAA520"/>
            {/* Corner tiles */}
            <rect x="0" y="0" width="4" height="4" fill="#FFFFFF" opacity="0.3"/>
            <rect x="20" y="0" width="4" height="4" fill="#FFFFFF" opacity="0.3"/>
            <rect x="0" y="20" width="4" height="4" fill="#FFFFFF" opacity="0.3"/>
            <rect x="20" y="20" width="4" height="4" fill="#FFFFFF" opacity="0.3"/>
            {/* Border accent */}
            <rect x="0" y="0" width="24" height="1" fill="#DAA520" opacity="0.5"/>
            <rect x="0" y="23" width="24" height="1" fill="#DAA520" opacity="0.5"/>
        </pattern>

        {/* Victorian Runner - Burgundy/purple with gold accents (for theaters/concert halls) */}
        <pattern id="pattern-victorian" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#4A1C4A"/>
            {/* Central floral medallion */}
            <circle cx="12" cy="12" r="5" fill="#5C2855"/>
            <circle cx="12" cy="12" r="3.5" fill="none" stroke="#DAA520" strokeWidth="0.8"/>
            <circle cx="12" cy="12" r="2" fill="#DAA520" opacity="0.7"/>
            {/* Corner flourishes */}
            <path d="M2 2 Q6 4 4 8 Q8 6 10 10" stroke="#B8860B" strokeWidth="0.5" fill="none"/>
            <path d="M22 2 Q18 4 20 8 Q16 6 14 10" stroke="#B8860B" strokeWidth="0.5" fill="none"/>
            <path d="M2 22 Q6 20 4 16 Q8 18 10 14" stroke="#B8860B" strokeWidth="0.5" fill="none"/>
            <path d="M22 22 Q18 20 20 16 Q16 18 14 14" stroke="#B8860B" strokeWidth="0.5" fill="none"/>
            {/* Gold border stripes */}
            <rect x="0" y="0" width="24" height="2" fill="#8B7500" opacity="0.6"/>
            <rect x="0" y="22" width="24" height="2" fill="#8B7500" opacity="0.6"/>
            <rect x="0" y="2" width="1" height="20" fill="#DAA520" opacity="0.4"/>
            <rect x="23" y="2" width="1" height="20" fill="#DAA520" opacity="0.4"/>
            {/* Acanthus leaf accents */}
            <ellipse cx="6" cy="6" rx="1.5" ry="2" fill="#663366" opacity="0.6"/>
            <ellipse cx="18" cy="6" rx="1.5" ry="2" fill="#663366" opacity="0.6"/>
            <ellipse cx="6" cy="18" rx="1.5" ry="2" fill="#663366" opacity="0.6"/>
            <ellipse cx="18" cy="18" rx="1.5" ry="2" fill="#663366" opacity="0.6"/>
            {/* Small gold dots */}
            <circle cx="3" cy="12" r="0.8" fill="#DAA520" opacity="0.5"/>
            <circle cx="21" cy="12" r="0.8" fill="#DAA520" opacity="0.5"/>
            <circle cx="12" cy="3" r="0.8" fill="#DAA520" opacity="0.5"/>
            <circle cx="12" cy="21" r="0.8" fill="#DAA520" opacity="0.5"/>
        </pattern>

        {/* Victorian Damask - Red/maroon with damask scroll pattern */}
        <pattern id="pattern-damask" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#7B1818"/>
            {/* Damask scroll background */}
            <g fill="#8B2828" opacity="0.6">
                <path d="M0 12 Q6 8 12 12 Q18 16 24 12 L24 24 L0 24 Z"/>
                <path d="M0 0 L24 0 L24 12 Q18 8 12 12 Q6 16 0 12 Z"/>
            </g>
            {/* Central medallion */}
            <ellipse cx="12" cy="12" rx="4" ry="5" fill="none" stroke="#C4A05A" strokeWidth="0.8"/>
            <ellipse cx="12" cy="12" rx="2" ry="3" fill="#C4A05A" opacity="0.5"/>
            {/* Scroll flourishes */}
            <path d="M4 4 Q8 2 6 8 Q10 6 8 10" stroke="#C4A05A" strokeWidth="0.5" fill="none" opacity="0.6"/>
            <path d="M20 4 Q16 2 18 8 Q14 6 16 10" stroke="#C4A05A" strokeWidth="0.5" fill="none" opacity="0.6"/>
            <path d="M4 20 Q8 22 6 16 Q10 18 8 14" stroke="#C4A05A" strokeWidth="0.5" fill="none" opacity="0.6"/>
            <path d="M20 20 Q16 22 18 16 Q14 18 16 14" stroke="#C4A05A" strokeWidth="0.5" fill="none" opacity="0.6"/>
            {/* Border */}
            <rect x="0" y="0" width="24" height="1.5" fill="#5D1010"/>
            <rect x="0" y="22.5" width="24" height="1.5" fill="#5D1010"/>
        </pattern>

        {/* Victorian Green Gold - Hunter green with gold trim */}
        <pattern id="pattern-greengold" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#1B4D3E"/>
            {/* Diagonal stripe pattern */}
            <g stroke="#DAA520" strokeWidth="0.8" opacity="0.4">
                <line x1="0" y1="6" x2="6" y2="0"/>
                <line x1="0" y1="12" x2="12" y2="0"/>
                <line x1="0" y1="18" x2="18" y2="0"/>
                <line x1="0" y1="24" x2="24" y2="0"/>
                <line x1="6" y1="24" x2="24" y2="6"/>
                <line x1="12" y1="24" x2="24" y2="12"/>
                <line x1="18" y1="24" x2="24" y2="18"/>
            </g>
            {/* Central ornament */}
            <circle cx="12" cy="12" r="4" fill="#0D3528"/>
            <circle cx="12" cy="12" r="3" fill="none" stroke="#DAA520" strokeWidth="1"/>
            <circle cx="12" cy="12" r="1.5" fill="#DAA520" opacity="0.7"/>
            {/* Corner medallions */}
            <circle cx="0" cy="0" r="3" fill="#0D3528"/>
            <circle cx="24" cy="0" r="3" fill="#0D3528"/>
            <circle cx="0" cy="24" r="3" fill="#0D3528"/>
            <circle cx="24" cy="24" r="3" fill="#0D3528"/>
            {/* Gold corner accents */}
            <path d="M0 3 Q3 3 3 0" stroke="#DAA520" strokeWidth="0.5" fill="none"/>
            <path d="M24 3 Q21 3 21 0" stroke="#DAA520" strokeWidth="0.5" fill="none"/>
            <path d="M0 21 Q3 21 3 24" stroke="#DAA520" strokeWidth="0.5" fill="none"/>
            <path d="M24 21 Q21 21 21 24" stroke="#DAA520" strokeWidth="0.5" fill="none"/>
        </pattern>

        {/* Victorian Blue - Royal blue with silver/white accents */}
        <pattern id="pattern-royalblue" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#1E3A5F"/>
            {/* Fleur-de-lis inspired pattern */}
            <path d="M12 2 Q10 6 12 8 Q14 6 12 2" fill="#C0C0C0" opacity="0.5"/>
            <path d="M12 22 Q10 18 12 16 Q14 18 12 22" fill="#C0C0C0" opacity="0.5"/>
            <path d="M2 12 Q6 10 8 12 Q6 14 2 12" fill="#C0C0C0" opacity="0.5"/>
            <path d="M22 12 Q18 10 16 12 Q18 14 22 12" fill="#C0C0C0" opacity="0.5"/>
            {/* Central star */}
            <polygon points="12,6 14,10 18,10 15,13 16,18 12,15 8,18 9,13 6,10 10,10"
                     fill="#C0C0C0" opacity="0.4"/>
            {/* Silver border */}
            <rect x="0" y="0" width="24" height="1" fill="#A0A0A0" opacity="0.5"/>
            <rect x="0" y="23" width="24" height="1" fill="#A0A0A0" opacity="0.5"/>
            <rect x="0" y="0" width="1" height="24" fill="#A0A0A0" opacity="0.5"/>
            <rect x="23" y="0" width="1" height="24" fill="#A0A0A0" opacity="0.5"/>
        </pattern>

        {/* Industrial Runner - Dark grey/charcoal for machinery halls */}
        <pattern id="pattern-industrial" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#2D2D2D"/>
            {/* Geometric industrial pattern */}
            <g stroke="#4A4A4A" strokeWidth="1" fill="none">
                <rect x="2" y="2" width="8" height="8"/>
                <rect x="14" y="2" width="8" height="8"/>
                <rect x="2" y="14" width="8" height="8"/>
                <rect x="14" y="14" width="8" height="8"/>
            </g>
            {/* Rivet accents */}
            <circle cx="6" cy="6" r="1.5" fill="#5A5A5A"/>
            <circle cx="18" cy="6" r="1.5" fill="#5A5A5A"/>
            <circle cx="6" cy="18" r="1.5" fill="#5A5A5A"/>
            <circle cx="18" cy="18" r="1.5" fill="#5A5A5A"/>
            {/* Central plate */}
            <rect x="10" y="10" width="4" height="4" fill="#3A3A3A"/>
            {/* Oil stain effect */}
            <ellipse cx="16" cy="20" rx="2" ry="1" fill="#1A1A1A" opacity="0.4"/>
        </pattern>

        {/* Chinese Lacquer Floor - Red and gold */}
        <pattern id="pattern-chinese" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#8B0000"/>
            {/* Lattice pattern */}
            <g stroke="#FFD700" strokeWidth="0.5" opacity="0.7">
                <line x1="0" y1="0" x2="24" y2="24"/>
                <line x1="24" y1="0" x2="0" y2="24"/>
                <line x1="12" y1="0" x2="12" y2="24"/>
                <line x1="0" y1="12" x2="24" y2="12"/>
            </g>
            {/* Decorative nodes */}
            <circle cx="12" cy="12" r="2" fill="#FFD700"/>
            <circle cx="0" cy="0" r="1.5" fill="#FFD700"/>
            <circle cx="24" cy="0" r="1.5" fill="#FFD700"/>
            <circle cx="0" cy="24" r="1.5" fill="#FFD700"/>
            <circle cx="24" cy="24" r="1.5" fill="#FFD700"/>
            {/* Cloud motif accent */}
            <path d="M6 6 Q8 4 10 6 Q8 8 6 6" fill="#FFD700" opacity="0.4"/>
            <path d="M14 18 Q16 16 18 18 Q16 20 14 18" fill="#FFD700" opacity="0.4"/>
        </pattern>

        {/* Egyptian Sandstone - Desert temple floor */}
        <pattern id="pattern-egyptian" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#D4B896"/>
            {/* Large flagstones */}
            <rect x="1" y="1" width="10" height="10" fill="#C4A876" rx="0.5"/>
            <rect x="13" y="1" width="10" height="10" fill="#CAAE7E" rx="0.5"/>
            <rect x="1" y="13" width="10" height="10" fill="#CAAE7E" rx="0.5"/>
            <rect x="13" y="13" width="10" height="10" fill="#C4A876" rx="0.5"/>
            {/* Mortar lines */}
            <g stroke="#A08860" strokeWidth="1" opacity="0.5">
                <line x1="12" y1="0" x2="12" y2="24"/>
                <line x1="0" y1="12" x2="24" y2="12"/>
            </g>
            {/* Sand grains / wear marks */}
            <g opacity="0.3">
                <circle cx="5" cy="5" r="0.5" fill="#8B7355"/>
                <circle cx="18" cy="7" r="0.4" fill="#8B7355"/>
                <circle cx="8" cy="16" r="0.5" fill="#8B7355"/>
                <circle cx="20" cy="19" r="0.4" fill="#8B7355"/>
            </g>
        </pattern>

        {/* Marble Checkered - Italian style */}
        <pattern id="pattern-marble" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#F5F5F5"/>
            {/* Checkered pattern */}
            <rect x="0" y="0" width="12" height="12" fill="#2C3E50"/>
            <rect x="12" y="12" width="12" height="12" fill="#2C3E50"/>
            {/* Marble veining on white tiles */}
            <g stroke="#E0E0E0" strokeWidth="0.5" opacity="0.6">
                <path d="M14 2 Q16 4 18 2"/>
                <path d="M2 14 Q4 16 6 14"/>
            </g>
            {/* Marble veining on dark tiles */}
            <g stroke="#3D566E" strokeWidth="0.5" opacity="0.4">
                <path d="M2 2 Q4 4 6 2"/>
                <path d="M14 14 Q16 16 18 14"/>
            </g>
        </pattern>

        {/* Worn Floor - High traffic variant */}
        <pattern id="pattern-worn" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#706050"/>
            {/* Worn cobblestone look */}
            <g opacity="0.6">
                <rect x="1" y="1" width="5" height="4" rx="1" fill="#605040"/>
                <rect x="7" y="0" width="6" height="5" rx="1" fill="#585048"/>
                <rect x="14" y="1" width="5" height="4" rx="1" fill="#686058"/>
                <rect x="5" y="5" width="6" height="6" rx="1" fill="#555045"/>
                <rect x="12" y="6" width="5" height="5" rx="1" fill="#605040"/>
            </g>
            {/* Wear marks and dirt */}
            <g opacity="0.4">
                <ellipse cx="10" cy="10" rx="4" ry="3" fill="#4A4035"/>
                <ellipse cx="18" cy="16" rx="3" ry="2" fill="#4A4035"/>
            </g>
            {/* Scuff marks */}
            <g stroke="#3A3025" strokeWidth="0.5" opacity="0.3">
                <path d="M3 15 Q8 14 12 16"/>
                <path d="M15 8 Q18 7 22 9"/>
            </g>
        </pattern>

        {/* Polished Floor - Elegant marble/stone flooring for grand pavilions */}
        <pattern id="pattern-polished" patternUnits="userSpaceOnUse" width="24" height="24">
            {/* Base - warm cream marble */}
            <rect width="24" height="24" fill="#F5F0E6"/>
            {/* Large marble tiles with subtle color variation */}
            <rect x="0" y="0" width="12" height="12" fill="#EDE8DC"/>
            <rect x="12" y="12" width="12" height="12" fill="#EDE8DC"/>
            <rect x="12" y="0" width="12" height="12" fill="#F8F4EC"/>
            <rect x="0" y="12" width="12" height="12" fill="#F8F4EC"/>
            {/* Grout lines */}
            <line x1="12" y1="0" x2="12" y2="24" stroke="#D4CFC4" strokeWidth="0.8"/>
            <line x1="0" y1="12" x2="24" y2="12" stroke="#D4CFC4" strokeWidth="0.8"/>
            {/* Marble veining - subtle gray */}
            <g stroke="#C8C0B4" strokeWidth="0.4" fill="none" opacity="0.6">
                <path d="M2 3 Q5 5 3 8 Q6 10 4 11"/>
                <path d="M18 2 Q16 4 19 6 Q17 8 20 10"/>
                <path d="M8 14 Q6 16 9 18 Q7 20 10 22"/>
                <path d="M14 15 Q17 17 15 19 Q18 21 16 23"/>
            </g>
            {/* Darker veining accents */}
            <g stroke="#A8A098" strokeWidth="0.3" fill="none" opacity="0.4">
                <path d="M1 6 Q4 7 2 9"/>
                <path d="M21 4 Q19 6 22 8"/>
                <path d="M6 16 Q8 18 5 20"/>
                <path d="M17 17 Q15 19 18 21"/>
            </g>
            {/* Polished surface reflections */}
            <g opacity="0.2">
                <ellipse cx="6" cy="6" rx="4" ry="3" fill="#FFFFFF"/>
                <ellipse cx="18" cy="18" rx="4" ry="3" fill="#FFFFFF"/>
            </g>
            {/* Subtle warm highlight on alternating tiles */}
            <g opacity="0.08">
                <rect x="0" y="0" width="12" height="12" fill="#D4A574"/>
                <rect x="12" y="12" width="12" height="12" fill="#D4A574"/>
            </g>
            {/* Floor reflection shimmer */}
            <g opacity="0.1">
                <ellipse cx="3" cy="3" rx="2" ry="1" fill="#FFFFFF"/>
                <ellipse cx="20" cy="8" rx="1.5" ry="0.8" fill="#FFFFFF"/>
                <ellipse cx="8" cy="20" rx="1.5" ry="0.8" fill="#FFFFFF"/>
            </g>
        </pattern>

        {/* Rotunda pattern - circular marble floor for Napoleon's Tomb */}
        <pattern id="pattern-rotunda" patternUnits="userSpaceOnUse" width="24" height="24">
            {/* Base - pristine white Carrara marble */}
            <rect width="24" height="24" fill="#F8F6F0"/>
            {/* Radial pattern suggesting circular dome above */}
            <g opacity="0.08">
                <path d="M0 12 L24 12" stroke="#C4B8A8" strokeWidth="0.5"/>
                <path d="M12 0 L12 24" stroke="#C4B8A8" strokeWidth="0.5"/>
                <path d="M0 0 L24 24" stroke="#C4B8A8" strokeWidth="0.3"/>
                <path d="M24 0 L0 24" stroke="#C4B8A8" strokeWidth="0.3"/>
            </g>
            {/* Subtle marble veining */}
            <g stroke="#D8D0C4" strokeWidth="0.4" fill="none" opacity="0.5">
                <path d="M2 4 Q6 6 4 10 Q8 12 5 16"/>
                <path d="M18 3 Q14 7 17 11 Q13 15 16 19"/>
                <path d="M8 18 Q12 20 10 22"/>
            </g>
            {/* Golden light from dome - ambient glow effect */}
            <ellipse cx="12" cy="12" rx="10" ry="10" fill="#FFE4B5" opacity="0.06"/>
            <ellipse cx="12" cy="12" rx="6" ry="6" fill="#FFD700" opacity="0.04"/>
            {/* Polished reflection highlights */}
            <g opacity="0.15">
                <ellipse cx="6" cy="6" rx="3" ry="2" fill="#FFFFFF"/>
                <ellipse cx="18" cy="18" rx="2.5" ry="1.5" fill="#FFFFFF"/>
            </g>
            {/* Grout/joint lines - subtle circular pattern */}
            <circle cx="12" cy="12" r="10" fill="none" stroke="#E0D8CC" strokeWidth="0.5" opacity="0.3"/>
        </pattern>

    </defs>
);

export default React.memo(MapDefs);
