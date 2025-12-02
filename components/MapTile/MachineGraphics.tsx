import React from 'react';

// 1889 World's Fair Industrial Machine Graphics - Animated

export const MACHINE_GRAPHICS: Record<string, JSX.Element> = {
    // Steam Engine (M) - Portable/smaller industrial steam engine
    MACHINERY: (
        <g>
            {/* Heavy iron base platform */}
            <rect x="0" y="20" width="24" height="4" fill="#1A1A1A"/>
            <rect x="1" y="20" width="22" height="3" fill="#2D3748"/>

            {/* Main boiler - horizontal cylinder */}
            <ellipse cx="12" cy="14" rx="10" ry="5" fill="#37474F"/>
            <ellipse cx="12" cy="14" rx="9" ry="4.5" fill="url(#steelGrad)"/>
            {/* Boiler rivets */}
            <circle cx="4" cy="14" r="0.5" fill="#1A1A1A"/>
            <circle cx="8" cy="12" r="0.5" fill="#1A1A1A"/>
            <circle cx="12" cy="11" r="0.5" fill="#1A1A1A"/>
            <circle cx="16" cy="12" r="0.5" fill="#1A1A1A"/>
            <circle cx="20" cy="14" r="0.5" fill="#1A1A1A"/>

            {/* Furnace door with glow */}
            <rect x="3" y="13" width="4" height="5" fill="#1A1A1A" rx="0.5"/>
            <rect x="3.5" y="13.5" width="3" height="4" fill="url(#furnaceGlow)">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="0.5s" repeatCount="indefinite"/>
            </rect>
            {/* Fire glow underneath */}
            <ellipse cx="5" cy="19" rx="3" ry="1" fill="#FF6B35" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.6;0.4" dur="0.3s" repeatCount="indefinite"/>
            </ellipse>

            {/* Massive flywheel - the heart of the engine */}
            <circle cx="19" cy="11" r="7" fill="#1A202C" stroke="#37474F" strokeWidth="1.5"/>
            <circle cx="19" cy="11" r="5.5" fill="#2D3748"/>
            <circle cx="19" cy="11" r="4" fill="#37474F"/>
            <circle cx="19" cy="11" r="1.5" fill="#4A5568"/>
            {/* Flywheel spokes - animated rotation */}
            <g>
                <animateTransform attributeName="transform" type="rotate" from="0 19 11" to="360 19 11" dur="1.5s" repeatCount="indefinite"/>
                <line x1="19" y1="4" x2="19" y2="18" stroke="#4A5568" strokeWidth="1.5"/>
                <line x1="12" y1="11" x2="26" y2="11" stroke="#4A5568" strokeWidth="1.5"/>
                <line x1="14" y1="6" x2="24" y2="16" stroke="#4A5568" strokeWidth="1"/>
                <line x1="14" y1="16" x2="24" y2="6" stroke="#4A5568" strokeWidth="1"/>
            </g>

            {/* Piston connecting rod - animated */}
            <rect x="8" y="9" width="6" height="2" fill="url(#brassGrad)" rx="0.5">
                <animate attributeName="x" values="8;10;8" dur="0.75s" repeatCount="indefinite"/>
            </rect>
            {/* Piston cylinder */}
            <rect x="2" y="7" width="7" height="5" fill="#4A5568" rx="1"/>
            <rect x="3" y="8" width="5" height="3" fill="#37474F"/>

            {/* Steam exhaust - dramatic puffs */}
            <ellipse cx="5" cy="3" rx="4" ry="3" fill="white" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0.2;0;0.6" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="cy" values="3;-2;-6;3" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="rx" values="4;6;8;4" dur="1.5s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="7" cy="5" rx="3" ry="2" fill="white" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.2;0;0.4" dur="1.5s" repeatCount="indefinite" begin="0.5s"/>
                <animate attributeName="cy" values="5;1;-3;5" dur="1.5s" repeatCount="indefinite" begin="0.5s"/>
                <animate attributeName="rx" values="3;5;6;3" dur="1.5s" repeatCount="indefinite" begin="0.5s"/>
            </ellipse>

            {/* Pressure gauge */}
            <circle cx="10" cy="17" r="1.5" fill="#1A1A1A" stroke="#B8860B" strokeWidth="0.5"/>
            <circle cx="10" cy="17" r="1" fill="#E8E8E8"/>
            <line x1="10" y1="17" x2="10.8" y2="16.3" stroke="#B22222" strokeWidth="0.5">
                <animate attributeName="x2" values="10.8;11;10.8" dur="2s" repeatCount="indefinite"/>
            </line>

            {/* Smokestack */}
            <rect x="4" y="0" width="3" height="7" fill="#2D3748"/>
            <rect x="3.5" y="0" width="4" height="1.5" fill="#37474F"/>
        </g>
    ),

    // Corliss Steam Engine (C) - The massive 1400hp exhibition centerpiece
    CORLISS: (
        <g>
            {/* Massive foundation platform */}
            <rect x="-2" y="20" width="28" height="6" fill="#1A1A1A"/>
            <rect x="0" y="21" width="24" height="4" fill="#2D3748"/>

            {/* Main cylinder block - the heart of the Corliss */}
            <rect x="1" y="8" width="10" height="12" fill="#37474F" rx="1"/>
            <rect x="2" y="9" width="8" height="10" fill="url(#steelGrad)"/>
            {/* Cylinder bore */}
            <ellipse cx="6" cy="14" rx="3" ry="4" fill="#1A1A1A"/>
            <ellipse cx="6" cy="14" rx="2.5" ry="3.5" fill="#2D3748"/>

            {/* Piston rod - long horizontal stroke */}
            <rect x="9" y="13" width="8" height="2" fill="url(#brassGrad)" rx="0.5">
                <animate attributeName="width" values="8;12;8" dur="2s" repeatCount="indefinite"/>
            </rect>
            {/* Crosshead guide */}
            <rect x="11" y="11" width="3" height="6" fill="#4A5568">
                <animate attributeName="x" values="11;15;11" dur="2s" repeatCount="indefinite"/>
            </rect>

            {/* GIANT FLYWHEEL - the iconic feature */}
            <circle cx="20" cy="10" r="12" fill="#1A202C" stroke="#37474F" strokeWidth="2"/>
            <circle cx="20" cy="10" r="10" fill="#2D3748"/>
            <circle cx="20" cy="10" r="8" fill="#37474F"/>
            <circle cx="20" cy="10" r="3" fill="#4A5568"/>
            <circle cx="20" cy="10" r="1.5" fill="url(#brassGrad)"/>
            {/* Flywheel spokes - animated */}
            <g>
                <animateTransform attributeName="transform" type="rotate" from="0 20 10" to="360 20 10" dur="3s" repeatCount="indefinite"/>
                <line x1="20" y1="-2" x2="20" y2="22" stroke="#4A5568" strokeWidth="2"/>
                <line x1="8" y1="10" x2="32" y2="10" stroke="#4A5568" strokeWidth="2"/>
                <line x1="11" y1="1" x2="29" y2="19" stroke="#4A5568" strokeWidth="1.5"/>
                <line x1="11" y1="19" x2="29" y2="1" stroke="#4A5568" strokeWidth="1.5"/>
                <line x1="20" y1="10" x2="28" y2="3" stroke="#4A5568" strokeWidth="1"/>
                <line x1="20" y1="10" x2="28" y2="17" stroke="#4A5568" strokeWidth="1"/>
                <line x1="20" y1="10" x2="12" y2="3" stroke="#4A5568" strokeWidth="1"/>
                <line x1="20" y1="10" x2="12" y2="17" stroke="#4A5568" strokeWidth="1"/>
            </g>

            {/* Connecting rod from crosshead to flywheel */}
            <line x1="13" y1="14" x2="20" y2="10" stroke="url(#brassGrad)" strokeWidth="2">
                <animate attributeName="x1" values="13;17;13" dur="2s" repeatCount="indefinite"/>
            </line>

            {/* Valve gear - Corliss rotary valves */}
            <circle cx="3" cy="10" r="1.5" fill="#B8860B">
                <animateTransform attributeName="transform" type="rotate" from="0 3 10" to="360 3 10" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="3" cy="18" r="1.5" fill="#B8860B">
                <animateTransform attributeName="transform" type="rotate" from="0 3 18" to="-360 3 18" dur="2s" repeatCount="indefinite"/>
            </circle>
            {/* Valve linkage */}
            <line x1="3" y1="10" x2="3" y2="18" stroke="#8B6914" strokeWidth="0.5"/>

            {/* Steam inlet pipe */}
            <rect x="-1" y="6" width="4" height="3" fill="#4A5568"/>
            <ellipse cx="1" cy="7.5" rx="1.5" ry="1" fill="#37474F"/>

            {/* STEAM EXHAUST - Dramatic periodic bursts */}
            <g>
                {/* Main steam cloud */}
                <ellipse cx="4" cy="2" rx="5" ry="4" fill="white" opacity="0.7">
                    <animate attributeName="opacity" values="0.7;0.4;0.1;0;0;0.7" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="cy" values="2;-4;-10;-14;-14;2" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="rx" values="5;8;12;14;14;5" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="ry" values="4;6;8;10;10;4" dur="2s" repeatCount="indefinite"/>
                </ellipse>
                {/* Secondary steam wisps */}
                <ellipse cx="6" cy="4" rx="3" ry="2" fill="white" opacity="0.5">
                    <animate attributeName="opacity" values="0.5;0.3;0;0;0;0.5" dur="2s" repeatCount="indefinite" begin="0.3s"/>
                    <animate attributeName="cy" values="4;-2;-8;-12;-12;4" dur="2s" repeatCount="indefinite" begin="0.3s"/>
                    <animate attributeName="rx" values="3;5;7;8;8;3" dur="2s" repeatCount="indefinite" begin="0.3s"/>
                </ellipse>
                <ellipse cx="2" cy="3" rx="2" ry="1.5" fill="white" opacity="0.4">
                    <animate attributeName="opacity" values="0.4;0.2;0;0;0;0.4" dur="2s" repeatCount="indefinite" begin="0.6s"/>
                    <animate attributeName="cy" values="3;-3;-9;-12;-12;3" dur="2s" repeatCount="indefinite" begin="0.6s"/>
                </ellipse>
            </g>

            {/* Pressure gauges */}
            <circle cx="8" cy="6" r="1.2" fill="#1A1A1A" stroke="#B8860B" strokeWidth="0.3"/>
            <circle cx="8" cy="6" r="0.8" fill="#E8E8E8"/>
            <line x1="8" y1="6" x2="8.6" y2="5.5" stroke="#B22222" strokeWidth="0.3">
                <animate attributeName="x2" values="8.6;8.8;8.6" dur="3s" repeatCount="indefinite"/>
            </line>

            {/* Governor mechanism */}
            <rect x="0" y="2" width="2" height="4" fill="#4A5568"/>
            <circle cx="1" cy="1" r="1" fill="#B8860B">
                <animate attributeName="r" values="1;1.2;1" dur="1s" repeatCount="indefinite"/>
            </circle>
        </g>
    ),

    // Dynamo/Generator (Ð) - Edison-style with copper coils and sparks
    DYNAMO: (
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
    PRINTING_PRESS: (
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
    ARC_LAMP: (
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
    LOOM: (
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
    HYDRAULIC_PRESS: (
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
    PHONOGRAPH: (
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
    TELEGRAPH: (
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
    AUTOMOBILE_ENGINE: (
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
    CENTRIFUGE: (
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

    // ========================================================
    // 2x2 GRAND CORLISS ENGINE - The centerpiece of the 1889 Exposition
    // Four tiles that together form one massive engine
    // ========================================================

    // Top-left quadrant: Giant flywheel (left half) + steam pipes
    CORLISS_GRAND_NW: (
        <g>
            {/* Iron floor plate */}
            <rect x="0" y="0" width="24" height="24" fill="#3D4147"/>
            <rect x="0" y="22" width="24" height="2" fill="#2D3436"/>

            {/* GIANT FLYWHEEL - left half (extends into NE tile) */}
            <circle cx="24" cy="12" r="20" fill="#1A202C" stroke="#37474F" strokeWidth="3"/>
            <circle cx="24" cy="12" r="17" fill="#2D3748"/>
            <circle cx="24" cy="12" r="14" fill="#37474F"/>
            {/* Flywheel rim details */}
            <circle cx="24" cy="12" r="18.5" fill="none" stroke="#4A5568" strokeWidth="1.5"/>

            {/* Animated spokes (left half visible) */}
            <g>
                <animateTransform attributeName="transform" type="rotate" from="0 24 12" to="360 24 12" dur="4s" repeatCount="indefinite"/>
                <line x1="24" y1="-8" x2="24" y2="32" stroke="#4A5568" strokeWidth="3"/>
                <line x1="4" y1="12" x2="44" y2="12" stroke="#4A5568" strokeWidth="3"/>
                <line x1="10" y1="-2" x2="38" y2="26" stroke="#4A5568" strokeWidth="2"/>
                <line x1="10" y1="26" x2="38" y2="-2" stroke="#4A5568" strokeWidth="2"/>
            </g>

            {/* Steam inlet pipes */}
            <rect x="0" y="6" width="8" height="4" fill="#4A5568"/>
            <ellipse cx="0" cy="8" rx="2" ry="3" fill="#37474F"/>
            <rect x="0" y="14" width="8" height="4" fill="#4A5568"/>
            <ellipse cx="0" cy="16" rx="2" ry="3" fill="#37474F"/>

            {/* Steam exhaust - dramatic bursts */}
            <ellipse cx="4" cy="2" rx="6" ry="4" fill="white" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0.3;0;0.6" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="cy" values="2;-4;-10;2" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="rx" values="6;10;14;6" dur="3s" repeatCount="indefinite"/>
            </ellipse>

            {/* Foundation bolts */}
            <circle cx="4" cy="21" r="1.5" fill="#1A1A1A"/>
            <circle cx="12" cy="21" r="1.5" fill="#1A1A1A"/>
            <circle cx="20" cy="21" r="1.5" fill="#1A1A1A"/>
        </g>
    ),

    // Top-right quadrant: Giant flywheel (right half) + cylinder block
    CORLISS_GRAND_NE: (
        <g>
            {/* Iron floor plate */}
            <rect x="0" y="0" width="24" height="24" fill="#3D4147"/>
            <rect x="0" y="22" width="24" height="2" fill="#2D3436"/>

            {/* GIANT FLYWHEEL - right half */}
            <circle cx="0" cy="12" r="20" fill="#1A202C" stroke="#37474F" strokeWidth="3"/>
            <circle cx="0" cy="12" r="17" fill="#2D3748"/>
            <circle cx="0" cy="12" r="14" fill="#37474F"/>
            <circle cx="0" cy="12" r="18.5" fill="none" stroke="#4A5568" strokeWidth="1.5"/>

            {/* Animated spokes (right half) */}
            <g>
                <animateTransform attributeName="transform" type="rotate" from="0 0 12" to="360 0 12" dur="4s" repeatCount="indefinite"/>
                <line x1="0" y1="-8" x2="0" y2="32" stroke="#4A5568" strokeWidth="3"/>
                <line x1="-20" y1="12" x2="20" y2="12" stroke="#4A5568" strokeWidth="3"/>
                <line x1="-14" y1="-2" x2="14" y2="26" stroke="#4A5568" strokeWidth="2"/>
                <line x1="-14" y1="26" x2="14" y2="-2" stroke="#4A5568" strokeWidth="2"/>
            </g>

            {/* Hub center (brass) */}
            <circle cx="0" cy="12" r="4" fill="url(#brassGrad)"/>
            <circle cx="0" cy="12" r="2" fill="#D4AF37"/>

            {/* Main cylinder block */}
            <rect x="10" y="4" width="14" height="16" fill="#37474F" rx="1"/>
            <rect x="11" y="5" width="12" height="14" fill="url(#steelGrad)"/>

            {/* Cylinder bore */}
            <ellipse cx="17" cy="12" rx="4" ry="6" fill="#1A1A1A"/>
            <ellipse cx="17" cy="12" rx="3" ry="5" fill="#2D3748"/>

            {/* Piston rod - animated */}
            <rect x="4" y="10" width="8" height="4" fill="url(#brassGrad)" rx="1">
                <animate attributeName="width" values="8;12;8" dur="2s" repeatCount="indefinite"/>
            </rect>

            {/* Valve gear */}
            <circle cx="22" cy="6" r="2" fill="#B8860B">
                <animateTransform attributeName="transform" type="rotate" from="0 22 6" to="360 22 6" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="22" cy="18" r="2" fill="#B8860B">
                <animateTransform attributeName="transform" type="rotate" from="0 22 18" to="-360 22 18" dur="2s" repeatCount="indefinite"/>
            </circle>

            {/* Foundation bolts */}
            <circle cx="4" cy="21" r="1.5" fill="#1A1A1A"/>
            <circle cx="12" cy="21" r="1.5" fill="#1A1A1A"/>
            <circle cx="20" cy="21" r="1.5" fill="#1A1A1A"/>
        </g>
    ),

    // Bottom-left quadrant: Governor + base platform
    CORLISS_GRAND_SW: (
        <g>
            {/* Heavy foundation platform */}
            <rect x="0" y="0" width="24" height="24" fill="#2D3436"/>
            <rect x="2" y="2" width="20" height="20" fill="#3D4147"/>

            {/* Massive iron base frame */}
            <rect x="0" y="0" width="24" height="6" fill="#1A202C"/>
            <rect x="1" y="1" width="22" height="4" fill="#2D3748"/>

            {/* Governor mechanism (centrifugal regulator) */}
            <rect x="8" y="6" width="4" height="12" fill="#4A5568"/>
            <circle cx="10" cy="8" r="3" fill="#B8860B">
                <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="10" cy="8" r="1.5" fill="#D4AF37"/>
            {/* Governor arms */}
            <line x1="10" y1="8" x2="6" y2="12" stroke="#8B6914" strokeWidth="1.5">
                <animate attributeName="x2" values="6;4;6" dur="1.5s" repeatCount="indefinite"/>
            </line>
            <line x1="10" y1="8" x2="14" y2="12" stroke="#8B6914" strokeWidth="1.5">
                <animate attributeName="x2" values="14;16;14" dur="1.5s" repeatCount="indefinite"/>
            </line>
            {/* Governor balls */}
            <circle cx="6" cy="12" r="2" fill="#B8860B">
                <animate attributeName="cx" values="6;4;6" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="14" cy="12" r="2" fill="#B8860B">
                <animate attributeName="cx" values="14;16;14" dur="1.5s" repeatCount="indefinite"/>
            </circle>

            {/* Control panel */}
            <rect x="16" y="8" width="6" height="10" fill="#1A202C"/>
            <rect x="17" y="9" width="4" height="8" fill="#2D3748"/>
            {/* Gauges */}
            <circle cx="19" cy="11" r="1.5" fill="#E8E8E8" stroke="#B8860B" strokeWidth="0.5"/>
            <circle cx="19" cy="15" r="1.5" fill="#E8E8E8" stroke="#B8860B" strokeWidth="0.5"/>
            <line x1="19" y1="11" x2="20" y2="10" stroke="#B22222" strokeWidth="0.3">
                <animate attributeName="x2" values="20;20.5;20" dur="3s" repeatCount="indefinite"/>
            </line>

            {/* Oil drip pan */}
            <ellipse cx="10" cy="20" rx="6" ry="2" fill="#1A1A1A" opacity="0.6"/>

            {/* Foundation bolts */}
            <circle cx="4" cy="22" r="1.5" fill="#1A1A1A"/>
            <circle cx="20" cy="22" r="1.5" fill="#1A1A1A"/>
        </g>
    ),

    // Bottom-right quadrant: Condenser + exhaust
    CORLISS_GRAND_SE: (
        <g>
            {/* Heavy foundation platform */}
            <rect x="0" y="0" width="24" height="24" fill="#2D3436"/>
            <rect x="2" y="2" width="20" height="20" fill="#3D4147"/>

            {/* Massive iron base frame */}
            <rect x="0" y="0" width="24" height="6" fill="#1A202C"/>
            <rect x="1" y="1" width="22" height="4" fill="#2D3748"/>

            {/* Condenser unit */}
            <rect x="2" y="6" width="10" height="12" fill="#37474F"/>
            <rect x="3" y="7" width="8" height="10" fill="url(#steelGrad)"/>
            {/* Cooling pipes */}
            <line x1="4" y1="8" x2="10" y2="8" stroke="#4A5568" strokeWidth="1"/>
            <line x1="4" y1="10" x2="10" y2="10" stroke="#4A5568" strokeWidth="1"/>
            <line x1="4" y1="12" x2="10" y2="12" stroke="#4A5568" strokeWidth="1"/>
            <line x1="4" y1="14" x2="10" y2="14" stroke="#4A5568" strokeWidth="1"/>

            {/* Water inlet/outlet */}
            <rect x="12" y="10" width="4" height="3" fill="#4A5568"/>
            <ellipse cx="16" cy="11.5" rx="1.5" ry="2" fill="#2D3748"/>

            {/* Exhaust manifold */}
            <rect x="14" y="6" width="8" height="6" fill="#4A5568"/>
            <ellipse cx="22" cy="9" rx="2" ry="4" fill="#37474F"/>

            {/* Steam exhaust wisps */}
            <ellipse cx="22" cy="4" rx="3" ry="2" fill="white" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.2;0;0.4" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="cy" values="4;0;-4;4" dur="2s" repeatCount="indefinite"/>
            </ellipse>

            {/* Brass nameplate */}
            <rect x="14" y="14" width="8" height="3" fill="#B8860B"/>
            <rect x="15" y="14.5" width="6" height="2" fill="#D4AF37"/>

            {/* Belt drive wheel */}
            <circle cx="19" cy="20" r="3" fill="#2D3748" stroke="#4A5568" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" from="0 19 20" to="360 19 20" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="19" cy="20" r="1" fill="#4A5568"/>

            {/* Foundation bolts */}
            <circle cx="4" cy="22" r="1.5" fill="#1A1A1A"/>
            <circle cx="20" cy="22" r="1.5" fill="#1A1A1A"/>
        </g>
    ),

    // ==========================================
    // EIFFEL TOWER PYLONS - 2x2 Perspective Views
    // Each corner pylon angles toward center, rising upward
    // ==========================================

    // NW PYLON (top-left corner of map) - angles toward SE, rising right
    PYLON_NW_NW: (
        <g>
            {/* Sky/atmosphere background */}
            <rect width="24" height="24" fill="#87CEEB"/>
            <rect width="24" height="24" fill="url(#skyGrad)" opacity="0.3"/>

            {/* Main iron leg structure - angled toward center */}
            <polygon
                points="2,24 8,24 18,0 10,0"
                fill="#3D4852"
            />
            {/* Highlight edge */}
            <line x1="10" y1="0" x2="2" y2="24" stroke="#5D6D7E" strokeWidth="1.5"/>

            {/* Lattice crossbeams */}
            <line x1="3" y1="20" x2="16" y2="4" stroke="#2C3E50" strokeWidth="1"/>
            <line x1="4" y1="16" x2="14" y2="4" stroke="#2C3E50" strokeWidth="0.8"/>
            <line x1="5" y1="12" x2="12" y2="4" stroke="#2C3E50" strokeWidth="0.6"/>

            {/* Diagonal bracing */}
            <line x1="6" y1="22" x2="14" y2="2" stroke="#566573" strokeWidth="0.8"/>
            <line x1="4" y1="18" x2="16" y2="2" stroke="#566573" strokeWidth="0.6"/>

            {/* Rivets along edges */}
            <circle cx="4" cy="22" r="1" fill="#1A1A1A"/>
            <circle cx="6" cy="18" r="0.8" fill="#1A1A1A"/>
            <circle cx="8" cy="14" r="0.8" fill="#1A1A1A"/>
            <circle cx="10" cy="10" r="0.7" fill="#1A1A1A"/>
            <circle cx="12" cy="6" r="0.6" fill="#1A1A1A"/>
            <circle cx="14" cy="2" r="0.5" fill="#1A1A1A"/>
        </g>
    ),

    PYLON_NW_NE: (
        <g>
            {/* Sky background */}
            <rect width="24" height="24" fill="#87CEEB"/>
            <rect width="24" height="24" fill="url(#skyGrad)" opacity="0.3"/>

            {/* Continuation of iron leg - narrowing as it rises */}
            <polygon
                points="0,24 6,24 24,0 20,0"
                fill="#3D4852"
            />
            <line x1="20" y1="0" x2="0" y2="24" stroke="#5D6D7E" strokeWidth="1.5"/>

            {/* Horizontal platform beam connecting pylons */}
            <rect x="0" y="20" width="24" height="3" fill="#4A5568"/>
            <line x1="0" y1="20" x2="24" y2="20" stroke="#6B7280" strokeWidth="1"/>

            {/* Lattice work */}
            <line x1="2" y1="18" x2="22" y2="2" stroke="#2C3E50" strokeWidth="0.8"/>
            <line x1="4" y1="14" x2="20" y2="2" stroke="#2C3E50" strokeWidth="0.6"/>

            {/* Diagonal bracing */}
            <line x1="3" y1="22" x2="22" y2="4" stroke="#566573" strokeWidth="0.8"/>

            {/* Rivets */}
            <circle cx="2" cy="22" r="0.8" fill="#1A1A1A"/>
            <circle cx="8" cy="16" r="0.7" fill="#1A1A1A"/>
            <circle cx="14" cy="10" r="0.6" fill="#1A1A1A"/>
            <circle cx="20" cy="4" r="0.5" fill="#1A1A1A"/>
        </g>
    ),

    PYLON_NW_SW: (
        <g>
            {/* Ground/foundation */}
            <rect width="24" height="24" fill="#8B7355"/>
            <rect width="24" height="6" fill="#6B5344"/>

            {/* Massive foundation block */}
            <rect x="0" y="0" width="24" height="24" fill="#4A4A4A"/>
            <rect x="2" y="2" width="20" height="20" fill="#5A5A5A"/>

            {/* Iron leg base - wide at ground */}
            <polygon
                points="4,0 20,0 16,24 8,24"
                fill="#3D4852"
            />
            <line x1="4" y1="0" x2="8" y2="24" stroke="#5D6D7E" strokeWidth="2"/>
            <line x1="20" y1="0" x2="16" y2="24" stroke="#2C3E50" strokeWidth="1"/>

            {/* Foundation anchor bolts */}
            <circle cx="6" cy="20" r="2" fill="#1A1A1A"/>
            <circle cx="18" cy="20" r="2" fill="#1A1A1A"/>
            <circle cx="6" cy="20" r="1" fill="#333"/>
            <circle cx="18" cy="20" r="1" fill="#333"/>

            {/* Cross bracing at base */}
            <line x1="6" y1="4" x2="18" y2="4" stroke="#566573" strokeWidth="2"/>
            <line x1="8" y1="12" x2="16" y2="12" stroke="#566573" strokeWidth="1.5"/>

            {/* Decorative arch element */}
            <path d="M8 4 Q12 -2 16 4" stroke="#6B7280" fill="none" strokeWidth="1.5"/>
        </g>
    ),

    PYLON_NW_SE: (
        <g>
            {/* Ground */}
            <rect width="24" height="24" fill="#8B7355"/>

            {/* Foundation continuation */}
            <rect x="0" y="0" width="24" height="24" fill="#4A4A4A"/>
            <rect x="2" y="2" width="20" height="20" fill="#5A5A5A"/>

            {/* Iron leg base meeting ground */}
            <polygon
                points="0,0 8,0 4,24 0,24"
                fill="#3D4852"
            />
            <line x1="8" y1="0" x2="4" y2="24" stroke="#2C3E50" strokeWidth="1"/>

            {/* Cobblestone ground detail */}
            <ellipse cx="16" cy="18" rx="4" ry="2" fill="#7A6955"/>
            <ellipse cx="20" cy="12" rx="3" ry="1.5" fill="#7A6955"/>

            {/* Foundation bolt */}
            <circle cx="2" cy="20" r="2" fill="#1A1A1A"/>
            <circle cx="2" cy="20" r="1" fill="#333"/>

            {/* Horizontal bracing */}
            <line x1="0" y1="4" x2="8" y2="4" stroke="#566573" strokeWidth="2"/>
            <line x1="0" y1="12" x2="6" y2="12" stroke="#566573" strokeWidth="1.5"/>
        </g>
    ),

    // NE PYLON (top-right corner) - angles toward SW, rising left
    PYLON_NE_NW: (
        <g>
            {/* Sky */}
            <rect width="24" height="24" fill="#87CEEB"/>
            <rect width="24" height="24" fill="url(#skyGrad)" opacity="0.3"/>

            {/* Iron leg angled left */}
            <polygon
                points="0,0 4,0 24,24 18,24"
                fill="#3D4852"
            />
            <line x1="4" y1="0" x2="24" y2="24" stroke="#5D6D7E" strokeWidth="1.5"/>

            {/* Horizontal platform beam */}
            <rect x="0" y="20" width="24" height="3" fill="#4A5568"/>

            {/* Lattice */}
            <line x1="2" y1="2" x2="22" y2="18" stroke="#2C3E50" strokeWidth="0.8"/>
            <line x1="4" y1="2" x2="20" y2="14" stroke="#2C3E50" strokeWidth="0.6"/>

            {/* Rivets */}
            <circle cx="4" cy="4" r="0.5" fill="#1A1A1A"/>
            <circle cx="10" cy="10" r="0.6" fill="#1A1A1A"/>
            <circle cx="16" cy="16" r="0.7" fill="#1A1A1A"/>
            <circle cx="22" cy="22" r="0.8" fill="#1A1A1A"/>
        </g>
    ),

    PYLON_NE_NE: (
        <g>
            {/* Sky */}
            <rect width="24" height="24" fill="#87CEEB"/>
            <rect width="24" height="24" fill="url(#skyGrad)" opacity="0.3"/>

            {/* Iron leg rising to left */}
            <polygon
                points="6,0 14,0 22,24 16,24"
                fill="#3D4852"
            />
            <line x1="14" y1="0" x2="22" y2="24" stroke="#2C3E50" strokeWidth="1"/>
            <line x1="6" y1="0" x2="16" y2="24" stroke="#5D6D7E" strokeWidth="1.5"/>

            {/* Lattice crossbeams */}
            <line x1="8" y1="4" x2="20" y2="20" stroke="#2C3E50" strokeWidth="1"/>
            <line x1="10" y1="4" x2="20" y2="16" stroke="#2C3E50" strokeWidth="0.8"/>
            <line x1="12" y1="4" x2="18" y2="12" stroke="#2C3E50" strokeWidth="0.6"/>

            {/* Diagonal bracing */}
            <line x1="10" y1="2" x2="18" y2="22" stroke="#566573" strokeWidth="0.8"/>

            {/* Rivets */}
            <circle cx="10" cy="2" r="0.5" fill="#1A1A1A"/>
            <circle cx="12" cy="6" r="0.6" fill="#1A1A1A"/>
            <circle cx="14" cy="10" r="0.7" fill="#1A1A1A"/>
            <circle cx="16" cy="14" r="0.8" fill="#1A1A1A"/>
            <circle cx="18" cy="18" r="0.9" fill="#1A1A1A"/>
            <circle cx="20" cy="22" r="1" fill="#1A1A1A"/>
        </g>
    ),

    PYLON_NE_SW: (
        <g>
            {/* Ground */}
            <rect width="24" height="24" fill="#4A4A4A"/>
            <rect x="2" y="2" width="20" height="20" fill="#5A5A5A"/>

            {/* Iron leg meeting foundation */}
            <polygon
                points="16,0 24,0 24,24 20,24"
                fill="#3D4852"
            />
            <line x1="16" y1="0" x2="20" y2="24" stroke="#5D6D7E" strokeWidth="1.5"/>

            {/* Cobblestone */}
            <ellipse cx="8" cy="18" rx="4" ry="2" fill="#7A6955"/>
            <ellipse cx="4" cy="12" rx="3" ry="1.5" fill="#7A6955"/>

            {/* Foundation bolt */}
            <circle cx="22" cy="20" r="2" fill="#1A1A1A"/>
            <circle cx="22" cy="20" r="1" fill="#333"/>

            {/* Horizontal bracing */}
            <line x1="16" y1="4" x2="24" y2="4" stroke="#566573" strokeWidth="2"/>
            <line x1="18" y1="12" x2="24" y2="12" stroke="#566573" strokeWidth="1.5"/>
        </g>
    ),

    PYLON_NE_SE: (
        <g>
            {/* Ground/foundation */}
            <rect width="24" height="24" fill="#4A4A4A"/>
            <rect x="2" y="2" width="20" height="20" fill="#5A5A5A"/>

            {/* Massive foundation with iron leg */}
            <polygon
                points="4,0 20,0 16,24 8,24"
                fill="#3D4852"
            />
            <line x1="20" y1="0" x2="16" y2="24" stroke="#5D6D7E" strokeWidth="2"/>
            <line x1="4" y1="0" x2="8" y2="24" stroke="#2C3E50" strokeWidth="1"/>

            {/* Foundation bolts */}
            <circle cx="10" cy="20" r="2" fill="#1A1A1A"/>
            <circle cx="14" cy="20" r="2" fill="#1A1A1A"/>
            <circle cx="10" cy="20" r="1" fill="#333"/>
            <circle cx="14" cy="20" r="1" fill="#333"/>

            {/* Cross bracing */}
            <line x1="6" y1="4" x2="18" y2="4" stroke="#566573" strokeWidth="2"/>
            <line x1="8" y1="12" x2="16" y2="12" stroke="#566573" strokeWidth="1.5"/>

            {/* Decorative arch */}
            <path d="M8 4 Q12 -2 16 4" stroke="#6B7280" fill="none" strokeWidth="1.5"/>
        </g>
    ),

    // SW PYLON (bottom-left corner) - angles toward NE, rising right
    PYLON_SW_NW: (
        <g>
            {/* Ground/foundation */}
            <rect width="24" height="24" fill="#4A4A4A"/>
            <rect x="2" y="2" width="20" height="20" fill="#5A5A5A"/>

            {/* Iron leg base */}
            <polygon
                points="4,0 20,0 16,24 8,24"
                fill="#3D4852"
            />
            <line x1="4" y1="0" x2="8" y2="24" stroke="#5D6D7E" strokeWidth="2"/>
            <line x1="20" y1="0" x2="16" y2="24" stroke="#2C3E50" strokeWidth="1"/>

            {/* Foundation bolts */}
            <circle cx="10" cy="20" r="2" fill="#1A1A1A"/>
            <circle cx="14" cy="20" r="2" fill="#1A1A1A"/>
            <circle cx="10" cy="20" r="1" fill="#333"/>
            <circle cx="14" cy="20" r="1" fill="#333"/>

            {/* Cross bracing */}
            <line x1="6" y1="4" x2="18" y2="4" stroke="#566573" strokeWidth="2"/>
            <line x1="8" y1="12" x2="16" y2="12" stroke="#566573" strokeWidth="1.5"/>

            {/* Decorative arch */}
            <path d="M8 4 Q12 -2 16 4" stroke="#6B7280" fill="none" strokeWidth="1.5"/>
        </g>
    ),

    PYLON_SW_NE: (
        <g>
            {/* Ground */}
            <rect width="24" height="24" fill="#4A4A4A"/>
            <rect x="2" y="2" width="20" height="20" fill="#5A5A5A"/>

            {/* Iron leg meeting foundation */}
            <polygon
                points="0,0 8,0 4,24 0,24"
                fill="#3D4852"
            />
            <line x1="8" y1="0" x2="4" y2="24" stroke="#5D6D7E" strokeWidth="1.5"/>

            {/* Cobblestone ground */}
            <ellipse cx="16" cy="18" rx="4" ry="2" fill="#7A6955"/>
            <ellipse cx="20" cy="12" rx="3" ry="1.5" fill="#7A6955"/>

            {/* Foundation bolt */}
            <circle cx="2" cy="20" r="2" fill="#1A1A1A"/>
            <circle cx="2" cy="20" r="1" fill="#333"/>

            {/* Horizontal bracing */}
            <line x1="0" y1="4" x2="8" y2="4" stroke="#566573" strokeWidth="2"/>
        </g>
    ),

    PYLON_SW_SW: (
        <g>
            {/* Sky - looking up */}
            <rect width="24" height="24" fill="#87CEEB"/>
            <rect width="24" height="24" fill="url(#skyGrad)" opacity="0.3"/>

            {/* Iron leg rising */}
            <polygon
                points="2,0 8,0 18,24 10,24"
                fill="#3D4852"
            />
            <line x1="2" y1="0" x2="10" y2="24" stroke="#5D6D7E" strokeWidth="1.5"/>

            {/* Lattice */}
            <line x1="4" y1="4" x2="16" y2="20" stroke="#2C3E50" strokeWidth="1"/>
            <line x1="6" y1="4" x2="14" y2="16" stroke="#2C3E50" strokeWidth="0.8"/>

            {/* Diagonal bracing */}
            <line x1="4" y1="2" x2="14" y2="22" stroke="#566573" strokeWidth="0.8"/>

            {/* Rivets */}
            <circle cx="4" cy="2" r="0.5" fill="#1A1A1A"/>
            <circle cx="6" cy="6" r="0.6" fill="#1A1A1A"/>
            <circle cx="8" cy="10" r="0.7" fill="#1A1A1A"/>
            <circle cx="10" cy="14" r="0.8" fill="#1A1A1A"/>
            <circle cx="12" cy="18" r="0.9" fill="#1A1A1A"/>
            <circle cx="14" cy="22" r="1" fill="#1A1A1A"/>
        </g>
    ),

    PYLON_SW_SE: (
        <g>
            {/* Sky */}
            <rect width="24" height="24" fill="#87CEEB"/>
            <rect width="24" height="24" fill="url(#skyGrad)" opacity="0.3"/>

            {/* Iron leg continuation */}
            <polygon
                points="0,0 6,0 24,24 18,24"
                fill="#3D4852"
            />
            <line x1="0" y1="0" x2="18" y2="24" stroke="#5D6D7E" strokeWidth="1.5"/>

            {/* Horizontal beam */}
            <rect x="0" y="0" width="24" height="3" fill="#4A5568"/>

            {/* Lattice */}
            <line x1="2" y1="4" x2="22" y2="22" stroke="#2C3E50" strokeWidth="0.8"/>

            {/* Rivets */}
            <circle cx="2" cy="2" r="0.5" fill="#1A1A1A"/>
            <circle cx="8" cy="8" r="0.6" fill="#1A1A1A"/>
            <circle cx="14" cy="14" r="0.7" fill="#1A1A1A"/>
            <circle cx="20" cy="20" r="0.8" fill="#1A1A1A"/>
        </g>
    ),

    // SE PYLON (bottom-right corner) - angles toward NW, rising left
    PYLON_SE_NW: (
        <g>
            {/* Ground */}
            <rect width="24" height="24" fill="#4A4A4A"/>
            <rect x="2" y="2" width="20" height="20" fill="#5A5A5A"/>

            {/* Iron leg */}
            <polygon
                points="16,0 24,0 24,24 20,24"
                fill="#3D4852"
            />
            <line x1="16" y1="0" x2="20" y2="24" stroke="#5D6D7E" strokeWidth="1.5"/>

            {/* Cobblestone */}
            <ellipse cx="8" cy="18" rx="4" ry="2" fill="#7A6955"/>
            <ellipse cx="4" cy="10" rx="3" ry="1.5" fill="#7A6955"/>

            {/* Foundation bolt */}
            <circle cx="22" cy="20" r="2" fill="#1A1A1A"/>
            <circle cx="22" cy="20" r="1" fill="#333"/>

            {/* Bracing */}
            <line x1="16" y1="4" x2="24" y2="4" stroke="#566573" strokeWidth="2"/>
        </g>
    ),

    PYLON_SE_NE: (
        <g>
            {/* Ground/foundation */}
            <rect width="24" height="24" fill="#4A4A4A"/>
            <rect x="2" y="2" width="20" height="20" fill="#5A5A5A"/>

            {/* Iron leg base */}
            <polygon
                points="4,0 20,0 16,24 8,24"
                fill="#3D4852"
            />
            <line x1="20" y1="0" x2="16" y2="24" stroke="#5D6D7E" strokeWidth="2"/>
            <line x1="4" y1="0" x2="8" y2="24" stroke="#2C3E50" strokeWidth="1"/>

            {/* Foundation bolts */}
            <circle cx="10" cy="20" r="2" fill="#1A1A1A"/>
            <circle cx="14" cy="20" r="2" fill="#1A1A1A"/>
            <circle cx="10" cy="20" r="1" fill="#333"/>
            <circle cx="14" cy="20" r="1" fill="#333"/>

            {/* Cross bracing */}
            <line x1="6" y1="4" x2="18" y2="4" stroke="#566573" strokeWidth="2"/>
            <line x1="8" y1="12" x2="16" y2="12" stroke="#566573" strokeWidth="1.5"/>

            {/* Decorative arch */}
            <path d="M8 4 Q12 -2 16 4" stroke="#6B7280" fill="none" strokeWidth="1.5"/>
        </g>
    ),

    PYLON_SE_SW: (
        <g>
            {/* Sky */}
            <rect width="24" height="24" fill="#87CEEB"/>
            <rect width="24" height="24" fill="url(#skyGrad)" opacity="0.3"/>

            {/* Iron leg */}
            <polygon
                points="0,24 6,24 24,0 18,0"
                fill="#3D4852"
            />
            <line x1="18" y1="0" x2="0" y2="24" stroke="#5D6D7E" strokeWidth="1.5"/>

            {/* Horizontal beam */}
            <rect x="0" y="0" width="24" height="3" fill="#4A5568"/>

            {/* Lattice */}
            <line x1="20" y1="4" x2="4" y2="22" stroke="#2C3E50" strokeWidth="0.8"/>

            {/* Rivets */}
            <circle cx="20" cy="2" r="0.5" fill="#1A1A1A"/>
            <circle cx="14" cy="8" r="0.6" fill="#1A1A1A"/>
            <circle cx="8" cy="14" r="0.7" fill="#1A1A1A"/>
            <circle cx="2" cy="20" r="0.8" fill="#1A1A1A"/>
        </g>
    ),

    PYLON_SE_SE: (
        <g>
            {/* Sky */}
            <rect width="24" height="24" fill="#87CEEB"/>
            <rect width="24" height="24" fill="url(#skyGrad)" opacity="0.3"/>

            {/* Iron leg rising left */}
            <polygon
                points="16,24 22,24 14,0 6,0"
                fill="#3D4852"
            />
            <line x1="6" y1="0" x2="16" y2="24" stroke="#5D6D7E" strokeWidth="1.5"/>

            {/* Lattice crossbeams */}
            <line x1="8" y1="4" x2="20" y2="20" stroke="#2C3E50" strokeWidth="1"/>
            <line x1="10" y1="4" x2="18" y2="16" stroke="#2C3E50" strokeWidth="0.8"/>
            <line x1="12" y1="4" x2="16" y2="12" stroke="#2C3E50" strokeWidth="0.6"/>

            {/* Diagonal bracing */}
            <line x1="8" y1="2" x2="20" y2="22" stroke="#566573" strokeWidth="0.8"/>

            {/* Rivets */}
            <circle cx="8" cy="2" r="0.5" fill="#1A1A1A"/>
            <circle cx="10" cy="6" r="0.6" fill="#1A1A1A"/>
            <circle cx="12" cy="10" r="0.7" fill="#1A1A1A"/>
            <circle cx="14" cy="14" r="0.8" fill="#1A1A1A"/>
            <circle cx="16" cy="18" r="0.9" fill="#1A1A1A"/>
            <circle cx="18" cy="22" r="1" fill="#1A1A1A"/>
        </g>
    ),

    // Industrial Metal Door - Heavy riveted iron door for tower/machinery areas
    METAL_DOOR: (
        <g>
            {/* Dark passage behind door */}
            <rect x="2" y="0" width="20" height="24" fill="#0A0A0A"/>

            {/* Heavy iron door frame */}
            <rect x="0" y="0" width="4" height="24" fill="#2D3748"/>
            <rect x="20" y="0" width="4" height="24" fill="#2D3748"/>
            <rect x="0" y="0" width="24" height="3" fill="#2D3748"/>
            <rect x="0" y="22" width="24" height="2" fill="#1A202C"/>

            {/* Frame highlights */}
            <rect x="0" y="0" width="1" height="24" fill="#4A5568"/>
            <rect x="23" y="0" width="1" height="24" fill="#1A202C"/>

            {/* Door panels - riveted steel plates */}
            <rect x="4" y="3" width="16" height="19" fill="#37474F"/>
            <rect x="5" y="4" width="14" height="8" fill="#455A64"/>
            <rect x="5" y="13" width="14" height="8" fill="#455A64"/>

            {/* Rivets on door */}
            <circle cx="6" cy="5" r="0.8" fill="#1A202C"/>
            <circle cx="18" cy="5" r="0.8" fill="#1A202C"/>
            <circle cx="6" cy="11" r="0.8" fill="#1A202C"/>
            <circle cx="18" cy="11" r="0.8" fill="#1A202C"/>
            <circle cx="6" cy="14" r="0.8" fill="#1A202C"/>
            <circle cx="18" cy="14" r="0.8" fill="#1A202C"/>
            <circle cx="6" cy="20" r="0.8" fill="#1A202C"/>
            <circle cx="18" cy="20" r="0.8" fill="#1A202C"/>

            {/* Frame rivets */}
            <circle cx="2" cy="4" r="0.6" fill="#1A202C"/>
            <circle cx="2" cy="12" r="0.6" fill="#1A202C"/>
            <circle cx="2" cy="20" r="0.6" fill="#1A202C"/>
            <circle cx="22" cy="4" r="0.6" fill="#1A202C"/>
            <circle cx="22" cy="12" r="0.6" fill="#1A202C"/>
            <circle cx="22" cy="20" r="0.6" fill="#1A202C"/>

            {/* Heavy industrial handle */}
            <rect x="15" y="10" width="3" height="5" fill="#2D3748" rx="0.5"/>
            <rect x="15.5" y="10.5" width="2" height="4" fill="#4A5568" rx="0.3"/>
            <circle cx="16.5" cy="12.5" r="1" fill="#1A202C"/>

            {/* Ventilation grate at top */}
            <rect x="8" y="5" width="8" height="4" fill="#1A202C"/>
            <line x1="9" y1="5" x2="9" y2="9" stroke="#37474F" strokeWidth="0.5"/>
            <line x1="11" y1="5" x2="11" y2="9" stroke="#37474F" strokeWidth="0.5"/>
            <line x1="13" y1="5" x2="13" y2="9" stroke="#37474F" strokeWidth="0.5"/>
            <line x1="15" y1="5" x2="15" y2="9" stroke="#37474F" strokeWidth="0.5"/>

            {/* Warning stripe at bottom */}
            <rect x="4" y="20" width="4" height="1" fill="#F59E0B"/>
            <rect x="12" y="20" width="4" height="1" fill="#F59E0B"/>
        </g>
    ),

    // Elevator with "ASCENSEUR" sign - Ornate 1889 Otis hydraulic elevator
    ELEVATOR_ASCENSEUR: (
        <g>
            {/* Elevator shaft background */}
            <rect x="0" y="0" width="24" height="24" fill="#1A1A1A"/>

            {/* "ASCENSEUR" sign above elevator */}
            <rect x="2" y="-8" width="20" height="6" fill="#1A202C" rx="1"/>
            <rect x="3" y="-7" width="18" height="4" fill="#2D3748" rx="0.5"/>
            <text x="12" y="-4" textAnchor="middle" fontSize="3" fill="#DAA520" fontFamily="serif" fontWeight="bold">ASCENSEUR</text>

            {/* Ornate brass cage frame */}
            <rect x="1" y="1" width="22" height="22" fill="none" stroke="#B8860B" strokeWidth="2"/>
            <rect x="2" y="2" width="20" height="20" fill="none" stroke="#DAA520" strokeWidth="1"/>

            {/* Decorative corner rosettes */}
            <circle cx="3" cy="3" r="2" fill="#B8860B"/>
            <circle cx="3" cy="3" r="1" fill="#FFD700"/>
            <circle cx="21" cy="3" r="2" fill="#B8860B"/>
            <circle cx="21" cy="3" r="1" fill="#FFD700"/>
            <circle cx="3" cy="21" r="2" fill="#B8860B"/>
            <circle cx="3" cy="21" r="1" fill="#FFD700"/>
            <circle cx="21" cy="21" r="2" fill="#B8860B"/>
            <circle cx="21" cy="21" r="1" fill="#FFD700"/>

            {/* Ornate diamond lattice grille */}
            <path d="M6 2 L12 8 L18 2 M6 22 L12 16 L18 22" stroke="#C9A227" strokeWidth="0.8" fill="none"/>
            <path d="M2 6 L8 12 L2 18 M22 6 L16 12 L22 18" stroke="#C9A227" strokeWidth="0.8" fill="none"/>
            <path d="M6 8 L12 14 L18 8 M6 16 L12 10 L18 16" stroke="#8B7500" strokeWidth="0.5" fill="none"/>

            {/* Central decorative medallion with floor indicator */}
            <circle cx="12" cy="12" r="4" fill="#2D2A26"/>
            <circle cx="12" cy="12" r="3.5" fill="none" stroke="#DAA520" strokeWidth="0.8"/>
            <circle cx="12" cy="12" r="2.5" fill="#B8860B"/>
            {/* Up arrow indicator - animated */}
            <path d="M12 9 L14 12 L12 10.5 L10 12 Z" fill="#FFD700">
                <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
            </path>
            <rect x="11" y="11" width="2" height="3" fill="#FFD700"/>

            {/* Brass handrails */}
            <rect x="4" y="11" width="4" height="1" fill="#DAA520" rx="0.5"/>
            <rect x="16" y="11" width="4" height="1" fill="#DAA520" rx="0.5"/>

            {/* Floor threshold */}
            <rect x="0" y="22" width="24" height="2" fill="#8B7355"/>
            <rect x="2" y="22" width="20" height="1" fill="#A08060"/>
        </g>
    ),
};
