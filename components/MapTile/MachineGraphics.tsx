import React from 'react';

// 1889 World's Fair Industrial Machine Graphics - Animated

export const MACHINE_GRAPHICS: Record<string, JSX.Element> = {
    // Steam Engine (M) - Corliss-type with animated pistons and steam
    'M': (
        <g>
            {/* Base platform */}
            <rect x="0" y="20" width="24" height="4" fill="#2D3748"/>
            {/* Main boiler body */}
            <ellipse cx="12" cy="14" rx="10" ry="6" fill="url(#steelGrad)"/>
            <ellipse cx="12" cy="14" rx="9" ry="5" fill="#4A5568"/>
            {/* Furnace glow */}
            <ellipse cx="6" cy="16" rx="3" ry="2" fill="url(#furnaceGlow)"/>
            {/* Flywheel with animation */}
            <circle cx="18" cy="10" r="6" fill="#1A202C" stroke="#4A5568" strokeWidth="1"/>
            <circle cx="18" cy="10" r="4" fill="#2D3748"/>
            <circle cx="18" cy="10" r="1" fill="#718096"/>
            <line x1="18" y1="4" x2="18" y2="16" stroke="#4A5568" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" from="0 18 10" to="360 18 10" dur="2s" repeatCount="indefinite"/>
            </line>
            <line x1="12" y1="10" x2="24" y2="10" stroke="#4A5568" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" from="0 18 10" to="360 18 10" dur="2s" repeatCount="indefinite"/>
            </line>
            {/* Piston rod */}
            <rect x="2" y="8" width="8" height="3" fill="url(#brassGrad)">
                <animate attributeName="x" values="2;4;2" dur="1s" repeatCount="indefinite"/>
            </rect>
            {/* Steam vents */}
            <ellipse cx="4" cy="4" rx="3" ry="2" fill="url(#steamGlow)" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="cy" values="4;1;4" dur="1.5s" repeatCount="indefinite"/>
            </ellipse>
            {/* Pressure gauge */}
            <circle cx="12" cy="8" r="2" fill="url(#gaugeGlass)" stroke="#B8860B" strokeWidth="0.5"/>
            <line x1="12" y1="8" x2="13" y2="7" stroke="#B22222" strokeWidth="0.5">
                <animateTransform attributeName="transform" type="rotate" from="0 12 8" to="45 12 8" dur="3s" repeatCount="indefinite" direction="alternate"/>
            </line>
        </g>
    ),

    // Dynamo/Generator (Ð) - Edison-style with copper coils and sparks
    'Ð': (
        <g>
            {/* Base */}
            <rect x="2" y="18" width="20" height="6" fill="#1A202C"/>
            {/* Main housing */}
            <rect x="4" y="8" width="16" height="12" fill="url(#steelGrad)" rx="2"/>
            {/* Copper armature - animated rotation */}
            <circle cx="12" cy="14" r="5" fill="#B87333" stroke="#8B4513" strokeWidth="1"/>
            <ellipse cx="12" cy="14" rx="4" ry="2" fill="#CD7F32">
                <animateTransform attributeName="transform" type="rotate" from="0 12 14" to="360 12 14" dur="0.5s" repeatCount="indefinite"/>
            </ellipse>
            {/* Coil windings */}
            <path d="M8 12 Q12 8 16 12 Q12 16 8 12" fill="none" stroke="#B87333" strokeWidth="1.5">
                <animateTransform attributeName="transform" type="rotate" from="0 12 14" to="360 12 14" dur="0.5s" repeatCount="indefinite"/>
            </path>
            {/* Copper glow effect */}
            <circle cx="12" cy="14" r="6" fill="url(#copperGlow)" opacity="0.5"/>
            {/* Commutator brushes */}
            <rect x="2" y="12" width="3" height="4" fill="#2D3748"/>
            <rect x="19" y="12" width="3" height="4" fill="#2D3748"/>
            {/* Electric sparks */}
            <circle cx="4" cy="14" r="1" fill="#00BFFF" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="0.2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="20" cy="14" r="1" fill="#00BFFF" opacity="0.8">
                <animate attributeName="opacity" values="0.2;0.8;0.2" dur="0.2s" repeatCount="indefinite"/>
            </circle>
            {/* Output terminals */}
            <circle cx="6" cy="6" r="1.5" fill="#FFD700"/>
            <circle cx="18" cy="6" r="1.5" fill="#FFD700"/>
            {/* Voltage indicator */}
            <rect x="10" y="4" width="4" height="2" fill="#1A1A1A"/>
            <rect x="11" y="4.5" width="2" height="1" fill="#00FF00">
                <animate attributeName="width" values="0.5;2;0.5" dur="1s" repeatCount="indefinite"/>
            </rect>
        </g>
    ),

    // Printing Press (Þ) - Rotary press with animated cylinders
    'Þ': (
        <g>
            {/* Base frame */}
            <rect x="0" y="18" width="24" height="6" fill="#2D3748"/>
            <rect x="2" y="16" width="20" height="3" fill="#1A202C"/>
            {/* Main frame */}
            <rect x="1" y="4" width="22" height="14" fill="#3D4852" rx="1"/>
            {/* Rotating cylinders */}
            <ellipse cx="8" cy="10" rx="4" ry="3" fill="#4A5568" stroke="#2D3748" strokeWidth="0.5">
                <animateTransform attributeName="transform" type="rotate" from="0 8 10" to="360 8 10" dur="1s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="16" cy="10" rx="4" ry="3" fill="#4A5568" stroke="#2D3748" strokeWidth="0.5">
                <animateTransform attributeName="transform" type="rotate" from="0 16 10" to="-360 16 10" dur="1s" repeatCount="indefinite"/>
            </ellipse>
            {/* Ink rollers */}
            <ellipse cx="8" cy="6" rx="2" ry="1" fill="#1A1A1A"/>
            <ellipse cx="16" cy="6" rx="2" ry="1" fill="#1A1A1A"/>
            {/* Paper feed - animated */}
            <rect x="10" y="8" width="4" height="8" fill="#F5F5DC">
                <animate attributeName="y" values="8;14;8" dur="1s" repeatCount="indefinite"/>
            </rect>
            {/* Output tray */}
            <rect x="8" y="16" width="8" height="2" fill="#8B4513"/>
            {/* Crank handle */}
            <circle cx="22" cy="10" r="2" fill="#B8860B"/>
            <line x1="22" y1="8" x2="22" y2="12" stroke="#8B6914" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" from="0 22 10" to="360 22 10" dur="1s" repeatCount="indefinite"/>
            </line>
        </g>
    ),

    // Arc Lamp (Ł) - Yablochkov candle style with flickering arc
    'Ł': (
        <g>
            {/* Pole */}
            <rect x="10" y="10" width="4" height="14" fill="#37474F"/>
            <rect x="11" y="10" width="2" height="14" fill="#455A64"/>
            {/* Lamp housing */}
            <rect x="4" y="0" width="16" height="12" fill="#263238"/>
            <rect x="5" y="1" width="14" height="10" fill="#1A202C"/>
            {/* Carbon electrodes */}
            <rect x="8" y="4" width="2" height="6" fill="#333333"/>
            <rect x="14" y="4" width="2" height="6" fill="#333333"/>
            {/* Electric arc - animated */}
            <path d="M10 6 Q12 4 14 6" stroke="#00BFFF" strokeWidth="2" fill="none">
                <animate attributeName="d" values="M10 6 Q12 3 14 6;M10 6 Q12 5 14 6;M10 6 Q12 3 14 6" dur="0.1s" repeatCount="indefinite"/>
            </path>
            {/* Arc glow */}
            <circle cx="12" cy="5" r="4" fill="#00BFFF" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.7;0.4" dur="0.15s" repeatCount="indefinite"/>
                <animate attributeName="r" values="4;5;4" dur="0.15s" repeatCount="indefinite"/>
            </circle>
            {/* Bright core */}
            <circle cx="12" cy="5" r="2" fill="#FFFFFF" opacity="0.9">
                <animate attributeName="opacity" values="0.9;1;0.9" dur="0.1s" repeatCount="indefinite"/>
            </circle>
            {/* Glass globe hint */}
            <ellipse cx="12" cy="6" rx="6" ry="4" fill="none" stroke="#4A5568" strokeWidth="0.5" opacity="0.5"/>
        </g>
    ),

    // Loom (Ŧ) - Jacquard loom with animated shuttle
    'Ŧ': (
        <g>
            {/* Frame */}
            <rect x="0" y="0" width="24" height="24" fill="#5D4037"/>
            <rect x="2" y="2" width="20" height="20" fill="#6D4C41"/>
            {/* Warp threads */}
            <g stroke="#F5F5DC" strokeWidth="0.3">
                <line x1="4" y1="4" x2="4" y2="20"/>
                <line x1="6" y1="4" x2="6" y2="20"/>
                <line x1="8" y1="4" x2="8" y2="20"/>
                <line x1="10" y1="4" x2="10" y2="20"/>
                <line x1="12" y1="4" x2="12" y2="20"/>
                <line x1="14" y1="4" x2="14" y2="20"/>
                <line x1="16" y1="4" x2="16" y2="20"/>
                <line x1="18" y1="4" x2="18" y2="20"/>
                <line x1="20" y1="4" x2="20" y2="20"/>
            </g>
            {/* Shuttle - animated */}
            <rect x="3" y="10" width="6" height="3" fill="#8B4513" rx="1">
                <animate attributeName="x" values="3;15;3" dur="1.5s" repeatCount="indefinite"/>
            </rect>
            {/* Weft thread being woven */}
            <line x1="4" y1="11.5" x2="20" y2="11.5" stroke="#DAA520" strokeWidth="0.5">
                <animate attributeName="y1" values="11.5;13;11.5" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="y2" values="11.5;13;11.5" dur="3s" repeatCount="indefinite"/>
            </line>
            {/* Heddles */}
            <rect x="2" y="6" width="20" height="1" fill="#4A3728"/>
            <rect x="2" y="16" width="20" height="1" fill="#4A3728"/>
            {/* Jacquard cards */}
            <rect x="0" y="0" width="24" height="3" fill="#F5DEB3"/>
            <circle cx="4" cy="1.5" r="0.5" fill="#333"/>
            <circle cx="8" cy="1.5" r="0.5" fill="#333"/>
            <circle cx="14" cy="1.5" r="0.5" fill="#333"/>
            <circle cx="20" cy="1.5" r="0.5" fill="#333"/>
        </g>
    ),

    // Hydraulic Press (Ħ) - With animated piston
    'Ħ': (
        <g>
            {/* Base */}
            <rect x="2" y="18" width="20" height="6" fill="#2D3748"/>
            {/* Main cylinder */}
            <rect x="6" y="6" width="12" height="14" fill="url(#steelGrad)"/>
            <rect x="7" y="7" width="10" height="12" fill="#4A5568"/>
            {/* Piston - animated */}
            <rect x="8" y="8" width="8" height="4" fill="#718096">
                <animate attributeName="y" values="8;14;8" dur="2s" repeatCount="indefinite"/>
            </rect>
            {/* Piston rod */}
            <rect x="10" y="2" width="4" height="8" fill="#B8860B">
                <animate attributeName="height" values="8;14;8" dur="2s" repeatCount="indefinite"/>
            </rect>
            {/* Pressure gauge */}
            <circle cx="4" cy="12" r="2.5" fill="url(#gaugeGlass)" stroke="#B8860B" strokeWidth="0.5"/>
            <line x1="4" y1="12" x2="5" y2="10" stroke="#B22222" strokeWidth="0.5">
                <animate attributeName="x2" values="5;6;5" dur="2s" repeatCount="indefinite"/>
            </line>
            {/* Hydraulic lines */}
            <path d="M4 15 Q2 18 4 20" stroke="#4A5568" strokeWidth="1.5" fill="none"/>
            <path d="M20 15 Q22 18 20 20" stroke="#4A5568" strokeWidth="1.5" fill="none"/>
            {/* Top frame */}
            <rect x="4" y="0" width="16" height="3" fill="#1A202C"/>
            <rect x="2" y="2" width="2" height="18" fill="#2D3748"/>
            <rect x="20" y="2" width="2" height="18" fill="#2D3748"/>
        </g>
    ),

    // Phonograph (Ø) - Edison cylinder with animated horn
    'Ø': (
        <g>
            {/* Base cabinet */}
            <rect x="2" y="14" width="20" height="10" fill="#5D4037"/>
            <rect x="3" y="15" width="18" height="8" fill="#6D4C41"/>
            {/* Decorative panel */}
            <rect x="4" y="16" width="16" height="6" fill="#8D6E63"/>
            <rect x="5" y="17" width="14" height="4" fill="#A1887F"/>
            {/* Cylinder mechanism */}
            <ellipse cx="8" cy="12" rx="4" ry="2" fill="#B87333">
                <animateTransform attributeName="transform" type="rotate" from="0 8 12" to="360 8 12" dur="3s" repeatCount="indefinite"/>
            </ellipse>
            <rect x="4" y="10" width="8" height="4" fill="#CD853F" opacity="0.5"/>
            {/* Horn - animated slight vibration */}
            <path d="M14 10 Q16 8 20 4 Q22 2 24 2 L24 8 Q22 8 20 10 Q18 12 14 12 Z" fill="#B8860B">
                <animate attributeName="d" values="M14 10 Q16 8 20 4 Q22 2 24 2 L24 8 Q22 8 20 10 Q18 12 14 12 Z;M14 10 Q16 8 20 5 Q22 3 24 3 L24 9 Q22 9 20 11 Q18 13 14 13 Z;M14 10 Q16 8 20 4 Q22 2 24 2 L24 8 Q22 8 20 10 Q18 12 14 12 Z" dur="0.5s" repeatCount="indefinite"/>
            </path>
            {/* Sound waves */}
            <path d="M22 5 Q24 5 26 3" stroke="#FFD700" strokeWidth="0.5" fill="none" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0;0.5" dur="1s" repeatCount="indefinite"/>
            </path>
            <path d="M22 7 Q25 7 28 5" stroke="#FFD700" strokeWidth="0.3" fill="none" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0;0.3" dur="1s" repeatCount="indefinite" begin="0.2s"/>
            </path>
            {/* Crank */}
            <circle cx="18" cy="18" r="1.5" fill="#B8860B"/>
        </g>
    ),

    // Telegraph (ŧ) - Morse key with clicking animation
    'ŧ': (
        <g>
            {/* Wooden base */}
            <rect x="2" y="16" width="20" height="8" fill="#5D4037"/>
            <rect x="3" y="17" width="18" height="6" fill="#6D4C41"/>
            {/* Telegraph mechanism base */}
            <rect x="4" y="12" width="16" height="5" fill="#1A202C"/>
            {/* Morse key lever - animated */}
            <rect x="6" y="10" width="12" height="2" fill="#B8860B" rx="0.5">
                <animate attributeName="y" values="10;11;10" dur="0.3s" repeatCount="indefinite"/>
            </rect>
            {/* Key knob */}
            <ellipse cx="16" cy="9" rx="2" ry="1.5" fill="#8B6914">
                <animate attributeName="cy" values="9;10;9" dur="0.3s" repeatCount="indefinite"/>
            </ellipse>
            {/* Contact points */}
            <circle cx="8" cy="12" r="1" fill="#FFD700"/>
            <circle cx="8" cy="14" r="1" fill="#FFD700"/>
            {/* Spark on contact */}
            <circle cx="8" cy="13" r="0.5" fill="#00BFFF" opacity="0">
                <animate attributeName="opacity" values="0;1;0" dur="0.3s" repeatCount="indefinite"/>
            </circle>
            {/* Sounder mechanism */}
            <rect x="2" y="4" width="6" height="8" fill="#2D3748"/>
            <rect x="3" y="5" width="4" height="6" fill="#4A5568"/>
            {/* Sounder arm */}
            <rect x="5" y="3" width="6" height="1" fill="#B87333">
                <animate attributeName="transform" values="rotate(0 5 8);rotate(-5 5 8);rotate(0 5 8)" dur="0.3s" repeatCount="indefinite"/>
            </rect>
            {/* Wire connections */}
            <path d="M8 6 Q12 2 20 4" stroke="#B87333" strokeWidth="0.5" fill="none"/>
            <path d="M8 8 Q14 4 22 6" stroke="#B87333" strokeWidth="0.5" fill="none"/>
        </g>
    ),

    // Automobile Engine (đ) - Early internal combustion
    'đ': (
        <g>
            {/* Engine block */}
            <rect x="4" y="8" width="16" height="12" fill="#2D3748"/>
            <rect x="5" y="9" width="14" height="10" fill="#4A5568"/>
            {/* Cylinder heads */}
            <rect x="6" y="6" width="4" height="4" fill="#1A202C"/>
            <rect x="14" y="6" width="4" height="4" fill="#1A202C"/>
            {/* Pistons - animated alternating */}
            <rect x="7" y="8" width="2" height="3" fill="#718096">
                <animate attributeName="y" values="8;6;8" dur="0.5s" repeatCount="indefinite"/>
            </rect>
            <rect x="15" y="6" width="2" height="3" fill="#718096">
                <animate attributeName="y" values="6;8;6" dur="0.5s" repeatCount="indefinite"/>
            </rect>
            {/* Crankshaft */}
            <ellipse cx="12" cy="16" rx="6" ry="2" fill="#333333" stroke="#4A5568" strokeWidth="0.5">
                <animateTransform attributeName="transform" type="rotate" from="0 12 16" to="360 12 16" dur="0.5s" repeatCount="indefinite"/>
            </ellipse>
            {/* Flywheel */}
            <circle cx="20" cy="14" r="3" fill="#1A202C" stroke="#4A5568" strokeWidth="0.5">
                <animateTransform attributeName="transform" type="rotate" from="0 20 14" to="360 20 14" dur="0.5s" repeatCount="indefinite"/>
            </circle>
            {/* Exhaust */}
            <ellipse cx="2" cy="4" rx="2" ry="1.5" fill="#666" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.2;0.5" dur="0.5s" repeatCount="indefinite"/>
                <animate attributeName="cy" values="4;2;4" dur="0.5s" repeatCount="indefinite"/>
            </ellipse>
            {/* Spark plug wires */}
            <path d="M8 6 Q8 2 12 2" stroke="#B22222" strokeWidth="0.5" fill="none"/>
            <path d="M16 6 Q16 2 12 2" stroke="#B22222" strokeWidth="0.5" fill="none"/>
            {/* Base */}
            <rect x="2" y="20" width="20" height="4" fill="#1A202C"/>
        </g>
    ),

    // Centrifuge (ð) - Laboratory centrifuge with spinning rotor
    'ð': (
        <g>
            {/* Base stand */}
            <rect x="6" y="18" width="12" height="6" fill="#2D3748"/>
            <ellipse cx="12" cy="18" rx="8" ry="2" fill="#1A202C"/>
            {/* Housing */}
            <circle cx="12" cy="10" r="8" fill="#4A5568"/>
            <circle cx="12" cy="10" r="7" fill="#64748B"/>
            {/* Glass viewing window */}
            <circle cx="12" cy="10" r="5" fill="#1A1A1A" opacity="0.8"/>
            {/* Rotor - animated fast spin */}
            <g>
                <animateTransform attributeName="transform" type="rotate" from="0 12 10" to="360 12 10" dur="0.3s" repeatCount="indefinite"/>
                <line x1="7" y1="10" x2="17" y2="10" stroke="#B8860B" strokeWidth="1"/>
                <line x1="12" y1="5" x2="12" y2="15" stroke="#B8860B" strokeWidth="1"/>
                {/* Test tube holders */}
                <rect x="6" y="9" width="2" height="2" fill="#CD853F"/>
                <rect x="16" y="9" width="2" height="2" fill="#CD853F"/>
                <rect x="11" y="4" width="2" height="2" fill="#CD853F"/>
                <rect x="11" y="14" width="2" height="2" fill="#CD853F"/>
            </g>
            {/* Speed indicator */}
            <rect x="18" y="4" width="4" height="2" fill="#1A1A1A"/>
            <rect x="19" y="4.5" width="2" height="1" fill="#00FF00">
                <animate attributeName="width" values="0.5;2;0.5" dur="2s" repeatCount="indefinite"/>
            </rect>
            {/* Control knob */}
            <circle cx="4" cy="14" r="2" fill="#333333" stroke="#4A5568" strokeWidth="0.5"/>
            <line x1="4" y1="12" x2="4" y2="14" stroke="#B8860B" strokeWidth="0.5"/>
        </g>
    ),
};
