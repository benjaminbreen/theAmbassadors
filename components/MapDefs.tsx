import React from 'react';

// Shared SVG definitions for map tiles - rendered once at map level
const MapDefs: React.FC = () => (
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

        <pattern id="pattern-gravel" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#FDE68A"/>
            <g opacity="0.5">
                <circle cx="5" cy="6" r="1.5" fill="#A8A29E"/>
                <circle cx="14" cy="9" r="1.2" fill="#78716C"/>
                <circle cx="19" cy="5" r="1" fill="#A8A29E"/>
                <circle cx="7" cy="17" r="1.3" fill="#78716C"/>
                <circle cx="17" cy="17" r="1.1" fill="#A8A29E"/>
                <circle cx="11" cy="13" r="0.9" fill="#78716C"/>
                <circle cx="17" cy="15" r="1.4" fill="#A8A29E"/>
                <circle cx="6" cy="20" r="1" fill="#78716C"/>
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

        {/* Animated water pattern for the Seine */}
        <pattern id="pattern-water" patternUnits="userSpaceOnUse" width="48" height="24">
            <rect width="48" height="24" fill="#1E3A5F"/>
            <g opacity="0.6">
                <path d="M0 8 Q6 4 12 8 T24 8 T36 8 T48 8" stroke="#2563EB" fill="none" strokeWidth="1.5">
                    <animate attributeName="d"
                        values="M0 8 Q6 4 12 8 T24 8 T36 8 T48 8;M0 10 Q6 6 12 10 T24 10 T36 10 T48 10;M0 8 Q6 4 12 8 T24 8 T36 8 T48 8"
                        dur="3s" repeatCount="indefinite"/>
                </path>
                <path d="M0 16 Q6 12 12 16 T24 16 T36 16 T48 16" stroke="#3B82F6" fill="none" strokeWidth="1">
                    <animate attributeName="d"
                        values="M0 16 Q6 12 12 16 T24 16 T36 16 T48 16;M0 14 Q6 10 12 14 T24 14 T36 14 T48 14;M0 16 Q6 12 12 16 T24 16 T36 16 T48 16"
                        dur="2.5s" repeatCount="indefinite"/>
                </path>
                <path d="M0 20 Q6 18 12 20 T24 20 T36 20 T48 20" stroke="#60A5FA" fill="none" strokeWidth="0.8">
                    <animate attributeName="d"
                        values="M0 20 Q6 18 12 20 T24 20 T36 20 T48 20;M0 22 Q6 20 12 22 T24 22 T36 22 T48 22;M0 20 Q6 18 12 20 T24 20 T36 20 T48 20"
                        dur="2s" repeatCount="indefinite"/>
                </path>
            </g>
            {/* Subtle shimmer/reflection */}
            <ellipse cx="8" cy="6" rx="3" ry="1" fill="#93C5FD" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.5;0.3" dur="4s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="30" cy="18" rx="4" ry="1.5" fill="#93C5FD" opacity="0.2">
                <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3.5s" repeatCount="indefinite"/>
            </ellipse>
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

        {/* Polished Floor - Near important features */}
        <pattern id="pattern-polished" patternUnits="userSpaceOnUse" width="24" height="24">
            <rect width="24" height="24" fill="#8B7355"/>
            {/* Polished wood parquet */}
            <g fill="#9A8265" opacity="0.8">
                <rect x="0" y="0" width="6" height="6"/>
                <rect x="6" y="6" width="6" height="6"/>
                <rect x="12" y="0" width="6" height="6"/>
                <rect x="18" y="6" width="6" height="6"/>
                <rect x="0" y="12" width="6" height="6"/>
                <rect x="6" y="18" width="6" height="6"/>
                <rect x="12" y="12" width="6" height="6"/>
                <rect x="18" y="18" width="6" height="6"/>
            </g>
            {/* Reflective sheen */}
            <g opacity="0.15">
                <ellipse cx="8" cy="8" rx="6" ry="4" fill="#FFFFFF"/>
                <ellipse cx="20" cy="18" rx="4" ry="3" fill="#FFFFFF"/>
            </g>
            {/* Fine wood grain */}
            <g stroke="#7A6345" strokeWidth="0.2" opacity="0.4">
                <line x1="1" y1="1" x2="5" y2="5"/>
                <line x1="13" y1="1" x2="17" y2="5"/>
                <line x1="7" y1="7" x2="11" y2="11"/>
                <line x1="19" y1="7" x2="23" y2="11"/>
            </g>
        </pattern>

    </defs>
);

export default React.memo(MapDefs);
