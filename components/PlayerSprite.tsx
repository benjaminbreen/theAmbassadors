
import React, { useEffect, useState, useCallback, useRef } from 'react';

interface PlayerSpriteProps {
    direction: 'N' | 'S' | 'E' | 'W';
    x?: number; // Player x position - used to detect movement
    y?: number; // Player y position - used to detect movement
    className?: string;
    onClick?: () => void;
    isSitting?: boolean;
    isSwinging?: boolean;
    swingPower?: number; // 0-100, affects swing intensity
    isCharging?: boolean; // true when holding shift to charge
    pinceNez?: boolean; // Shows pince-nez glasses when equipped
    nearbyObjectCount?: number; // Number of objects within swing range (0-5+)
    isOnFire?: boolean; // Shows flame animation overlay when on fire
    // Phase 2: Clothing options (currently unused but laid out for future)
    clothing?: {
        hat?: 'top_hat' | 'bowler' | 'none';
        coat?: 'morning_coat' | 'frock_coat' | 'none';
        vest?: 'standard' | 'fancy' | 'none';
        accessories?: ('watch_chain' | 'cane' | 'gloves')[];
    };
}

// Henry James - 1889 Paris Exposition
// Historically accurate: Age 46, trimmed beard/goatee, formal morning coat, top hat
// Known for his meticulous appearance, portly figure, and distinguished bearing

const PlayerSprite: React.FC<PlayerSpriteProps> = ({
    direction,
    x = 0,
    y = 0,
    className,
    onClick,
    isSitting = false,
    isSwinging = false,
    swingPower = 50,
    isCharging = false,
    pinceNez = false,
    nearbyObjectCount = 0,
    isOnFire = false,
    clothing = {
        hat: 'top_hat',
        coat: 'morning_coat',
        vest: 'standard',
        accessories: ['watch_chain', 'cane', 'gloves']
    }
}) => {
    const [walkCycle, setWalkCycle] = useState(0); // Continuous walk cycle 0-1
    const [isMoving, setIsMoving] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);
    const [showThoughtBubble, setShowThoughtBubble] = useState(false);
    const [thoughtBubblePhase, setThoughtBubblePhase] = useState(0);
    const [sittingDotPhase, setSittingDotPhase] = useState(0);
    const [swingPhase, setSwingPhase] = useState(0);
    const [swingParticles, setSwingParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number, life: number, size: number, color: string}>>([]);
    const particleIdRef = React.useRef(0);
    const walkAnimRef = useRef<number | null>(null);
    const lastPosRef = useRef({ x, y });
    const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Detect movement by position change and animate continuously while moving
    useEffect(() => {
        const posChanged = x !== lastPosRef.current.x || y !== lastPosRef.current.y;

        if (posChanged) {
            lastPosRef.current = { x, y };
            setIsMoving(true);

            // Clear any existing stop timeout
            if (moveTimeoutRef.current) {
                clearTimeout(moveTimeoutRef.current);
            }

            // Set timeout to stop animation if no movement for 120ms (slightly longer than movement throttle)
            moveTimeoutRef.current = setTimeout(() => {
                setIsMoving(false);
            }, 120);
        }

        return () => {
            if (moveTimeoutRef.current) {
                clearTimeout(moveTimeoutRef.current);
            }
        };
    }, [x, y]);

    // Continuous walk cycle animation while moving
    useEffect(() => {
        if (isMoving && !isSitting) {
            const startTime = performance.now();
            const cycleSpeed = 150; // ms per half-cycle (one step) - matches movement rhythm

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                // Create continuous cycle that loops
                const cycle = (elapsed % (cycleSpeed * 2)) / (cycleSpeed * 2);
                setWalkCycle(cycle);

                if (isMoving) {
                    walkAnimRef.current = requestAnimationFrame(animate);
                }
            };

            walkAnimRef.current = requestAnimationFrame(animate);

            return () => {
                if (walkAnimRef.current) {
                    cancelAnimationFrame(walkAnimRef.current);
                }
            };
        } else {
            setWalkCycle(0);
        }
    }, [isMoving, isSitting]);

    // Random blinking every 2-5 seconds
    useEffect(() => {
        const scheduleBlink = () => {
            const delay = 2000 + Math.random() * 3000;
            return setTimeout(() => {
                setIsBlinking(true);
                setTimeout(() => setIsBlinking(false), 150);
                scheduleBlink();
            }, delay);
        };
        const timer = scheduleBlink();
        return () => clearTimeout(timer);
    }, []);

    // Handle click - trigger blink and show thought bubble
    const handleClick = useCallback(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
        setShowThoughtBubble(true);
        setThoughtBubblePhase(0);
        onClick?.();
    }, [onClick]);

    // Animate thought bubble
    useEffect(() => {
        if (showThoughtBubble) {
            const animInterval = setInterval(() => {
                setThoughtBubblePhase(p => {
                    if (p >= 20) {
                        setShowThoughtBubble(false);
                        return 0;
                    }
                    return p + 1;
                });
            }, 50);
            return () => clearInterval(animInterval);
        }
    }, [showThoughtBubble]);

    // Animate sitting "..." thought bubble
    useEffect(() => {
        if (isSitting) {
            const dotInterval = setInterval(() => {
                setSittingDotPhase(p => (p + 1) % 60);
            }, 50);
            return () => clearInterval(dotInterval);
        } else {
            setSittingDotPhase(0);
        }
    }, [isSitting]);

    // Determine swing type based on power level
    // Type 1 (tap): 0-15 power - quick flick, no particles, just motion blur
    // Type 2 (medium): 16-84 power - proper swing with subtle physics-based particles
    // Type 3 (full): 85-100 power - powerful swing with Zelda-style arc and sparkles
    const getSwingType = (power: number): 'tap' | 'medium' | 'full' => {
        if (power <= 15) return 'tap';
        if (power >= 85) return 'full';
        return 'medium';
    };

    // Swing animation - completely redesigned with 3 modes and procedural particles
    useEffect(() => {
        if (isSwinging) {
            setSwingPhase(0);
            const startTime = Date.now();
            const swingType = getSwingType(swingPower);

            // Duration varies by swing type
            const duration = swingType === 'tap' ? 160 : swingType === 'medium' ? 280 : 380;

            // Environmental factor affects particle generation
            const environmentFactor = Math.min(1, nearbyObjectCount / 3); // 0-1 based on nearby objects

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Different easing per swing type
                let eased: number;
                if (swingType === 'tap') {
                    // Quick snap - fast in, fast out
                    eased = progress < 0.3
                        ? 4 * progress * progress
                        : 1 - Math.pow(2 - 2 * progress, 2) / 2;
                } else if (swingType === 'medium') {
                    // Wind-up then release - slow start, fast middle, decelerate at end
                    eased = progress < 0.25
                        ? 2 * progress * progress  // Wind-up (slow)
                        : progress < 0.6
                            ? 0.125 + (progress - 0.25) * 2.5  // Release (fast)
                            : 1 - Math.pow(-2 * progress + 2, 3) / 8;  // Follow through
                } else {
                    // Full power - dramatic wind-up, explosive release
                    eased = progress < 0.35
                        ? 1.5 * progress * progress  // Longer wind-up
                        : progress < 0.55
                            ? 0.18 + (progress - 0.35) * 4.1  // Explosive release
                            : 1 - Math.pow(-2 * progress + 2, 4) / 16;  // Extended follow through
                }

                setSwingPhase(eased);

                // Dynamic procedural particle generation for ALL swing types
                const particleWindow = swingType === 'tap'
                    ? { start: 0.35, end: 0.65 }
                    : swingType === 'medium'
                        ? { start: 0.3, end: 0.75 }
                        : { start: 0.25, end: 0.8 };

                if (progress > particleWindow.start && progress < particleWindow.end) {
                    // Spawn probability varies by swing type and environment
                    const spawnChance = swingType === 'tap'
                        ? 0.18 + (environmentFactor * 0.25)  // Tap: subtle particles, more near objects
                        : swingType === 'medium'
                            ? 0.3 + (environmentFactor * 0.3)  // Medium: moderate particles
                            : 0.55 + (environmentFactor * 0.25);  // Full: lots of particles

                    if (Math.random() < spawnChance) {
                        // Beautiful variegated color palettes - mixed hues for visual interest
                        const particleColors = swingType === 'full'
                            // Whitish-blue electric sizzle palette with accent colors
                            ? [
                                '#FFFFFF', '#F0F8FF', '#E6F3FF', '#CCE5FF', // Pure white to light blue
                                '#B8D4F0', '#A8D0F0', '#98C8E8', '#88C0E0', // Sky blues
                                '#D0E8FF', '#C0E0FF', '#B0D8FF', // Pale electric blue
                                '#E8F4FC', '#D8ECFA', '#C8E4F8', // Ice blue
                                '#F8F8FF', '#F0F0FF', '#E8E8FF', // Ghost white with blue tint
                                '#FFFAFA', '#FFF5F5', // Hint of warm white for variety
                                '#E0F0FF', '#D0E8FF', '#C0E0FF', // Bright cyan-white
                              ]
                            : swingType === 'medium'
                                // Warm amber/bronze with rose gold and cream accents
                                ? [
                                    '#F5E6D3', '#EDD9C4', '#E5CCB5', '#DCBFA6', // Warm cream
                                    '#D4B896', '#CCB088', '#C4A87A', '#BCA06C', // Bronze
                                    '#F0E0D0', '#E8D8C8', '#E0D0C0', // Light tan
                                    '#E8C8B0', '#E0C0A8', '#D8B8A0', // Peachy bronze
                                    '#F8EEE4', '#F0E6DC', '#E8DED4', // Off-white cream
                                    '#DCC8B4', '#D4C0AC', '#CCB8A4', // Dusty rose gold
                                  ]
                                // Cool silver/lavender with touches of pale blue
                                : [
                                    '#F0F0F5', '#E8E8F0', '#E0E0EB', '#D8D8E6', // Silver lavender
                                    '#F5F5FA', '#EDEDED', '#E5E5E5', '#DDDDDD', // Pure silver
                                    '#E8ECF0', '#E0E4E8', '#D8DCE0', // Cool gray
                                    '#F0F4F8', '#E8ECF0', '#E0E4E8', // Steel blue tint
                                    '#FFFFFF', '#FAFAFA', '#F5F5F5', // Bright white
                                    '#EEF2F6', '#E6EAF0', '#DEE2E8', // Pale blue-gray
                                  ];

                        // Number of particles per spawn - more for full power
                        const particlesToAdd = swingType === 'full'
                            ? 2 + Math.floor(Math.random() * 3)
                            : swingType === 'medium'
                                ? (Math.random() < 0.4 + environmentFactor * 0.35 ? 1 : 0)
                                : (Math.random() < 0.25 + environmentFactor * 0.45 ? 1 : 0);

                        const newParticles: typeof swingParticles = [];

                        for (let i = 0; i < particlesToAdd; i++) {
                            // Physics-based velocity - particles fly tangent to swing arc
                            const tangentAngle = (Math.random() - 0.5) * 1.4 + Math.PI * 0.35;
                            const speedMult = swingType === 'full' ? 3.0 : swingType === 'medium' ? 2.0 : 1.4;
                            const speed = (0.9 + Math.random() * 1.8) * speedMult;

                            // Particle spawn position varies along the arc
                            const arcOffset = (Math.random() - 0.3) * 10;
                            const perpOffset = (Math.random() - 0.5) * 5;

                            newParticles.push({
                                id: particleIdRef.current++,
                                x: arcOffset,
                                y: perpOffset,
                                vx: Math.cos(tangentAngle) * speed * (Math.random() > 0.5 ? 1 : -1),
                                vy: Math.sin(tangentAngle) * speed - 0.4 - Math.random() * 0.6, // Upward bias
                                life: swingType === 'full'
                                    ? 22 + Math.random() * 18
                                    : swingType === 'medium'
                                        ? 15 + Math.random() * 12
                                        : 9 + Math.random() * 7,
                                size: swingType === 'full'
                                    ? 1.2 + Math.random() * 1.8
                                    : swingType === 'medium'
                                        ? 0.7 + Math.random() * 1.0
                                        : 0.5 + Math.random() * 0.6,
                                color: particleColors[Math.floor(Math.random() * particleColors.length)]
                            });
                        }

                        if (newParticles.length > 0) {
                            setSwingParticles(prev => [...prev, ...newParticles]);
                        }
                    }
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setTimeout(() => setSwingPhase(0), swingType === 'full' ? 180 : swingType === 'medium' ? 100 : 60);
                }
            };

            requestAnimationFrame(animate);
        }
    }, [isSwinging, swingPower, nearbyObjectCount]);

    // Update particles
    const hasParticlesRef = useRef(false);

    useEffect(() => {
        hasParticlesRef.current = swingParticles.length > 0;
    }, [swingParticles.length]);

    useEffect(() => {
        if (swingParticles.length === 0) return;

        const interval = setInterval(() => {
            setSwingParticles(prev => {
                const updated = prev
                    .map(p => ({
                        ...p,
                        x: p.x + p.vx,
                        y: p.y + p.vy,
                        vy: p.vy + 0.3,
                        life: p.life - 1
                    }))
                    .filter(p => p.life > 0);
                return updated;
            });
        }, 16);

        return () => clearInterval(interval);
    }, [swingParticles.length]);

    // Animation values - continuous walking cycle
    // walkCycle goes 0 -> 1 continuously while moving, creating a looping animation
    const stepCycle = walkCycle * Math.PI * 2; // Full cycle for smooth looping

    // Vertical bounce - two bounces per full cycle (one per step)
    const bounce = isMoving ? Math.abs(Math.sin(stepCycle)) * 2 : 0;

    // Leg swing - alternates forward/back for walking motion
    const legSwing = isMoving ? Math.sin(stepCycle) * 10 : 0;

    // Arm swing - opposite to legs for natural counterbalance
    const armSwing = isMoving ? Math.sin(stepCycle + Math.PI) * 7 : 0;

    // Coat tail sway - slight lag behind body movement
    const coatSway = isMoving ? Math.sin(stepCycle - Math.PI / 4) * 2 : 0;

    // Subtle shoulder rotation for weight shift
    const shoulderTilt = isMoving ? Math.sin(stepCycle) * 1 : 0;

    // Head bob - subtle vertical motion
    const headBob = isMoving ? Math.abs(Math.sin(stepCycle)) * 0.3 : 0;

    // Body lean slightly forward when walking
    const bodyLean = isMoving ? 0.5 : 0;

    // Thought bubble animation values
    const bubbleY = showThoughtBubble ? Math.max(-12, -thoughtBubblePhase * 0.8) : 0;
    const bubbleOpacity = showThoughtBubble ? Math.min(1, thoughtBubblePhase * 0.2) * (thoughtBubblePhase < 15 ? 1 : (20 - thoughtBubblePhase) / 5) : 0;
    const bubbleScale = showThoughtBubble ? Math.min(1, thoughtBubblePhase * 0.15) : 0;

    // Colors - Henry James's typical 1889 attire
    // Modular for future clothing system
    const colors = {
        // Skin tones
        skin: '#f5deb3',
        skinShadow: '#d4b896',
        skinHighlight: '#ffecd2',
        // Hair/beard
        hair: '#4a3728',
        beard: '#5d4a3a',
        // Morning coat (charcoal grey)
        coat: '#1a1a2e',
        coatMid: '#252538',
        coatHighlight: '#353548',
        coatShadow: '#12121f',
        // Waistcoat (dove grey/tan)
        vest: '#8b7355',
        vestDark: '#6d5a44',
        vestLight: '#a08565',
        // Shirt & collar
        shirt: '#f5f5f0',
        collar: '#ffffff',
        // Cravat (burgundy)
        tie: '#722f37',
        tieDark: '#5a252c',
        // Trousers (grey stripe)
        pants: '#2d2d2d',
        pantsShadow: '#1f1f1f',
        pantsStripe: '#3a3a3a',
        // Shoes (black leather)
        shoes: '#1a1a1a',
        shoesHighlight: '#2a2a2a',
        // Top hat (silk plush)
        hat: '#1a1a1a',
        hatHighlight: '#2a2a2a',
        hatBand: '#8b7355',
        hatSheen: '#3a3a4a',
        // Accessories
        cane: '#8b4513',
        caneHighlight: '#a05a1a',
        caneHandle: '#d4af37',
        watchChain: '#d4af37',
        watchChainShadow: '#b8960f',
    };

    // Render thought bubble (FF6 style)
    const renderThoughtBubble = () => {
        if (!showThoughtBubble) return null;
        return (
            <g transform={`translate(16, ${bubbleY})`} opacity={bubbleOpacity}>
                <circle cx="3" cy="-2" r="0.8" fill="white" />
                <circle cx="5" cy="-5" r="1.2" fill="white" />
                <ellipse cx="8" cy="-10" rx={4 * bubbleScale} ry={3.5 * bubbleScale} fill="white" stroke="#333" strokeWidth="0.3" />
                <text x="8" y={-8.5} textAnchor="middle" fontSize={5 * bubbleScale} fontWeight="bold" fill="#c41e3a" fontFamily="serif">!</text>
            </g>
        );
    };

    // Render sitting "..." contemplation bubble
    const renderSittingBubble = () => {
        if (!isSitting || showThoughtBubble) return null;

        const floatY = Math.sin(sittingDotPhase * 0.1) * 1;
        const dot1Opacity = 0.6 + 0.4 * Math.sin(sittingDotPhase * 0.15);
        const dot2Opacity = 0.6 + 0.4 * Math.sin(sittingDotPhase * 0.15 - 0.8);
        const dot3Opacity = 0.6 + 0.4 * Math.sin(sittingDotPhase * 0.15 - 1.6);

        return (
            <g transform={`translate(16, ${-12 + floatY})`}>
                <circle cx="2" cy="0" r="0.6" fill="white" opacity="0.7" />
                <circle cx="4" cy="-3" r="0.9" fill="white" opacity="0.8" />
                <ellipse cx="8" cy="-8" rx="5" ry="3.5" fill="white" stroke="#555" strokeWidth="0.3" />
                <circle cx="5" cy="-8" r="0.9" fill="#5a4a3a" opacity={dot1Opacity} />
                <circle cx="8" cy="-8" r="0.9" fill="#5a4a3a" opacity={dot2Opacity} />
                <circle cx="11" cy="-8" r="0.9" fill="#5a4a3a" opacity={dot3Opacity} />
            </g>
        );
    };

    // Render fire effect when player is on fire
    const renderFireEffect = () => {
        if (!isOnFire) return null;

        return (
            <g className="fire-overlay">
                {/* Fire glow base */}
                <defs>
                    <radialGradient id="fireGlow" cx="50%" cy="80%" r="70%">
                        <stop offset="0%" stopColor="#ff6600" stopOpacity="0.7">
                            <animate attributeName="stop-opacity" values="0.5;0.8;0.5" dur="0.3s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="50%" stopColor="#ff3300" stopOpacity="0.4">
                            <animate attributeName="stop-opacity" values="0.3;0.5;0.3" dur="0.25s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Ambient glow around player */}
                <ellipse cx="16" cy="20" rx="18" ry="12" fill="url(#fireGlow)" />

                {/* Main flame tongues */}
                <g transform="translate(16, 24)">
                    {/* Central flame */}
                    <path d="M0 0 Q-4 -15 0 -28 Q4 -15 0 0" fill="#ff6600" opacity="0.9">
                        <animate attributeName="d"
                            values="M0 0 Q-4 -15 0 -28 Q4 -15 0 0;
                                    M0 0 Q-5 -18 -1 -30 Q5 -14 0 0;
                                    M0 0 Q-3 -14 1 -26 Q3 -16 0 0;
                                    M0 0 Q-4 -15 0 -28 Q4 -15 0 0"
                            dur="0.4s" repeatCount="indefinite" />
                    </path>
                    <path d="M0 -5 Q-2 -16 0 -24 Q2 -16 0 -5" fill="#ffcc00" opacity="0.95">
                        <animate attributeName="d"
                            values="M0 -5 Q-2 -16 0 -24 Q2 -16 0 -5;
                                    M0 -5 Q-3 -18 -1 -26 Q3 -15 0 -5;
                                    M0 -5 Q-1 -14 1 -22 Q1 -17 0 -5;
                                    M0 -5 Q-2 -16 0 -24 Q2 -16 0 -5"
                            dur="0.35s" repeatCount="indefinite" />
                    </path>
                    <path d="M0 -10 Q-1 -18 0 -20 Q1 -18 0 -10" fill="#ffffff" opacity="0.8">
                        <animate attributeName="d"
                            values="M0 -10 Q-1 -18 0 -20 Q1 -18 0 -10;
                                    M0 -10 Q-2 -19 -1 -22 Q2 -17 0 -10;
                                    M0 -10 Q0 -16 1 -19 Q0 -17 0 -10;
                                    M0 -10 Q-1 -18 0 -20 Q1 -18 0 -10"
                            dur="0.3s" repeatCount="indefinite" />
                    </path>

                    {/* Left flame */}
                    <path d="M-6 0 Q-9 -10 -5 -20 Q-3 -8 -6 0" fill="#ff4400" opacity="0.85">
                        <animate attributeName="d"
                            values="M-6 0 Q-9 -10 -5 -20 Q-3 -8 -6 0;
                                    M-6 0 Q-10 -12 -7 -22 Q-2 -9 -6 0;
                                    M-6 0 Q-8 -9 -4 -18 Q-4 -7 -6 0;
                                    M-6 0 Q-9 -10 -5 -20 Q-3 -8 -6 0"
                            dur="0.45s" repeatCount="indefinite" />
                    </path>
                    <path d="M-5 -5 Q-7 -12 -5 -16 Q-3 -11 -5 -5" fill="#ffaa00" opacity="0.9">
                        <animate attributeName="d"
                            values="M-5 -5 Q-7 -12 -5 -16 Q-3 -11 -5 -5;
                                    M-5 -5 Q-8 -14 -6 -18 Q-2 -10 -5 -5;
                                    M-5 -5 Q-6 -10 -4 -14 Q-4 -9 -5 -5;
                                    M-5 -5 Q-7 -12 -5 -16 Q-3 -11 -5 -5"
                            dur="0.38s" repeatCount="indefinite" />
                    </path>

                    {/* Right flame */}
                    <path d="M6 0 Q9 -10 5 -20 Q3 -8 6 0" fill="#ff4400" opacity="0.85">
                        <animate attributeName="d"
                            values="M6 0 Q9 -10 5 -20 Q3 -8 6 0;
                                    M6 0 Q8 -12 7 -22 Q2 -9 6 0;
                                    M6 0 Q10 -9 4 -18 Q4 -7 6 0;
                                    M6 0 Q9 -10 5 -20 Q3 -8 6 0"
                            dur="0.42s" repeatCount="indefinite" />
                    </path>
                    <path d="M5 -5 Q7 -12 5 -16 Q3 -11 5 -5" fill="#ffaa00" opacity="0.9">
                        <animate attributeName="d"
                            values="M5 -5 Q7 -12 5 -16 Q3 -11 5 -5;
                                    M5 -5 Q8 -14 6 -18 Q2 -10 5 -5;
                                    M5 -5 Q6 -10 4 -14 Q4 -9 5 -5;
                                    M5 -5 Q7 -12 5 -16 Q3 -11 5 -5"
                            dur="0.36s" repeatCount="indefinite" />
                    </path>

                    {/* Outer left small flame */}
                    <path d="M-10 2 Q-12 -5 -9 -12 Q-7 -4 -10 2" fill="#ff6600" opacity="0.7">
                        <animate attributeName="d"
                            values="M-10 2 Q-12 -5 -9 -12 Q-7 -4 -10 2;
                                    M-10 2 Q-13 -6 -10 -14 Q-6 -5 -10 2;
                                    M-10 2 Q-11 -4 -8 -10 Q-8 -3 -10 2;
                                    M-10 2 Q-12 -5 -9 -12 Q-7 -4 -10 2"
                            dur="0.5s" repeatCount="indefinite" />
                    </path>

                    {/* Outer right small flame */}
                    <path d="M10 2 Q12 -5 9 -12 Q7 -4 10 2" fill="#ff6600" opacity="0.7">
                        <animate attributeName="d"
                            values="M10 2 Q12 -5 9 -12 Q7 -4 10 2;
                                    M10 2 Q11 -6 10 -14 Q6 -5 10 2;
                                    M10 2 Q13 -4 8 -10 Q8 -3 10 2;
                                    M10 2 Q12 -5 9 -12 Q7 -4 10 2"
                            dur="0.48s" repeatCount="indefinite" />
                    </path>
                </g>

                {/* Smoke wisps rising */}
                <g opacity="0.4">
                    <ellipse cx="14" cy="-8" rx="2" ry="1.5" fill="#444">
                        <animate attributeName="cy" values="-8;-20;-8" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0;0.4" dur="1.5s" repeatCount="indefinite" />
                    </ellipse>
                    <ellipse cx="18" cy="-6" rx="1.5" ry="1" fill="#555">
                        <animate attributeName="cy" values="-6;-18;-6" dur="1.2s" repeatCount="indefinite" begin="0.3s" />
                        <animate attributeName="opacity" values="0.3;0;0.3" dur="1.2s" repeatCount="indefinite" begin="0.3s" />
                    </ellipse>
                </g>

                {/* Sparks */}
                <g>
                    <circle cx="12" cy="5" r="0.5" fill="#ffff00">
                        <animate attributeName="cy" values="5;-15;5" dur="0.8s" repeatCount="indefinite" />
                        <animate attributeName="cx" values="12;8;12" dur="0.8s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="20" cy="8" r="0.4" fill="#ffcc00">
                        <animate attributeName="cy" values="8;-12;8" dur="0.7s" repeatCount="indefinite" begin="0.2s" />
                        <animate attributeName="cx" values="20;24;20" dur="0.7s" repeatCount="indefinite" begin="0.2s" />
                        <animate attributeName="opacity" values="1;0;1" dur="0.7s" repeatCount="indefinite" begin="0.2s" />
                    </circle>
                    <circle cx="16" cy="3" r="0.6" fill="#ff8800">
                        <animate attributeName="cy" values="3;-18;3" dur="0.9s" repeatCount="indefinite" begin="0.4s" />
                        <animate attributeName="cx" values="16;14;16" dur="0.9s" repeatCount="indefinite" begin="0.4s" />
                        <animate attributeName="opacity" values="1;0;1" dur="0.9s" repeatCount="indefinite" begin="0.4s" />
                    </circle>
                </g>
            </g>
        );
    };

    // Render swing arc trail and particles - dynamic Zelda-style effects for all swing types
    const renderSwingEffects = (pivotX: number, pivotY: number, baseAngle: number, flipX: boolean = false) => {
        if (swingPhase === 0 && swingParticles.length === 0) return null;

        const swingType = getSwingType(swingPower);
        const swingArc = swingPhase * swingArcDegrees - swingArcDegrees / 2;
        const currentAngle = baseAngle + swingArc;
        const arcLength = 14 + (swingType === 'full' ? 5 : swingType === 'medium' ? 3 : 1);

        // Dynamic intensity based on swing phase (peaks at 0.5)
        const intensity = 1 - Math.abs(swingPhase - 0.5) * 2;
        const peakIntensity = Math.max(0, 1 - Math.abs(swingPhase - 0.55) * 2.5);

        return (
            <g transform={`translate(${pivotX}, ${pivotY})${flipX ? ' scale(-1, 1)' : ''}`}>
                {/* Gradient and filter definitions */}
                <defs>
                    {/* Tap swing gradient - silver/white */}
                    <linearGradient id="tapArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(200, 200, 220, 0)" />
                        <stop offset="40%" stopColor="rgba(220, 220, 240, 0.5)" />
                        <stop offset="100%" stopColor="rgba(255, 255, 255, 0.8)" />
                    </linearGradient>

                    {/* Medium swing gradient - warm bronze */}
                    <linearGradient id="mediumArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(205, 180, 140, 0)" />
                        <stop offset="30%" stopColor="rgba(218, 190, 150, 0.6)" />
                        <stop offset="70%" stopColor="rgba(240, 220, 180, 0.8)" />
                        <stop offset="100%" stopColor="rgba(255, 250, 230, 0.95)" />
                    </linearGradient>

                    {/* Full power gradient - whitish-blue electric glow */}
                    <linearGradient id="fullArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(180, 210, 255, 0)" />
                        <stop offset="15%" stopColor="rgba(200, 225, 255, 0.4)" />
                        <stop offset="35%" stopColor="rgba(220, 240, 255, 0.7)" />
                        <stop offset="55%" stopColor="rgba(240, 250, 255, 0.85)" />
                        <stop offset="75%" stopColor="rgba(250, 253, 255, 0.95)" />
                        <stop offset="100%" stopColor="rgba(255, 255, 255, 1)" />
                    </linearGradient>

                    {/* Radial glow for impact */}
                    <radialGradient id="impactGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
                        <stop offset="50%" stopColor="rgba(255, 250, 200, 0.5)" />
                        <stop offset="100%" stopColor="rgba(255, 240, 150, 0)" />
                    </radialGradient>

                    {/* Sparkle filter */}
                    <filter id="sparkleGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* ========== TAP SWING - Quick elegant slash ========== */}
                {swingType === 'tap' && swingPhase > 0.1 && swingPhase < 0.9 && (
                    <g>
                        {/* Main crescent arc - thin and elegant */}
                        <path
                            d={(() => {
                                const arcSpan = 40 * swingPhase;
                                const startAngle = (currentAngle - arcSpan) * Math.PI / 180;
                                const endAngle = currentAngle * Math.PI / 180;
                                const midAngle = (startAngle + endAngle) / 2;
                                const innerR = arcLength * 0.4;
                                const outerR = arcLength * 1.05;

                                return `M ${Math.cos(startAngle) * innerR} ${Math.sin(startAngle) * innerR}
                                        Q ${Math.cos(midAngle) * outerR} ${Math.sin(midAngle) * outerR}
                                          ${Math.cos(endAngle) * arcLength} ${Math.sin(endAngle) * arcLength}
                                        L ${Math.cos(endAngle) * (arcLength - 1.5)} ${Math.sin(endAngle) * (arcLength - 1.5)}
                                        Q ${Math.cos(midAngle) * (outerR - 2)} ${Math.sin(midAngle) * (outerR - 2)}
                                          ${Math.cos(startAngle) * (innerR + 0.5)} ${Math.sin(startAngle) * (innerR + 0.5)}
                                        Z`;
                            })()}
                            fill="url(#tapArcGradient)"
                            opacity={0.7 * intensity}
                        />

                        {/* Sharp white edge */}
                        <path
                            d={(() => {
                                const arcSpan = 35 * swingPhase;
                                const startAngle = (currentAngle - arcSpan) * Math.PI / 180;
                                const endAngle = currentAngle * Math.PI / 180;
                                const midAngle = (startAngle + endAngle) / 2;
                                const r = arcLength * 1.0;
                                return `M ${Math.cos(startAngle) * r * 0.7} ${Math.sin(startAngle) * r * 0.7}
                                        Q ${Math.cos(midAngle) * (r + 1)} ${Math.sin(midAngle) * (r + 1)}
                                          ${Math.cos(endAngle) * r} ${Math.sin(endAngle) * r}`;
                            })()}
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.9)"
                            strokeWidth="1.2"
                            opacity={intensity * 0.8}
                            strokeLinecap="round"
                        />

                        {/* Speed lines - 2 quick ones */}
                        {[0, 1].map(i => {
                            const lineAngle = currentAngle - 8 - i * 12;
                            const lineRad = lineAngle * Math.PI / 180;
                            return (
                                <line
                                    key={i}
                                    x1={Math.cos(lineRad) * (arcLength * 0.5)}
                                    y1={Math.sin(lineRad) * (arcLength * 0.5)}
                                    x2={Math.cos(lineRad) * (arcLength * 0.9)}
                                    y2={Math.sin(lineRad) * (arcLength * 0.9)}
                                    stroke="rgba(255, 255, 255, 0.6)"
                                    strokeWidth={1 - i * 0.3}
                                    opacity={intensity * 0.5}
                                    strokeLinecap="round"
                                />
                            );
                        })}

                        {/* Small tip sparkle */}
                        {swingPhase > 0.3 && swingPhase < 0.7 && (
                            <circle
                                cx={Math.cos(currentAngle * Math.PI / 180) * arcLength}
                                cy={Math.sin(currentAngle * Math.PI / 180) * arcLength}
                                r={2 + peakIntensity * 1.5}
                                fill="white"
                                opacity={peakIntensity * 0.7}
                            />
                        )}
                    </g>
                )}

                {/* ========== MEDIUM SWING - Substantial arc with trails ========== */}
                {swingType === 'medium' && swingPhase > 0.15 && swingPhase < 0.9 && (
                    <g>
                        {/* Main crescent arc - thicker, warmer */}
                        <path
                            d={(() => {
                                const arcSpan = 55 * swingPhase;
                                const startAngle = (currentAngle - arcSpan) * Math.PI / 180;
                                const endAngle = currentAngle * Math.PI / 180;
                                const midAngle = (startAngle + endAngle) / 2;
                                const innerR = arcLength * 0.35;
                                const outerR = arcLength * 1.12;

                                return `M ${Math.cos(startAngle) * innerR} ${Math.sin(startAngle) * innerR}
                                        Q ${Math.cos(midAngle) * outerR} ${Math.sin(midAngle) * outerR}
                                          ${Math.cos(endAngle) * arcLength} ${Math.sin(endAngle) * arcLength}
                                        L ${Math.cos(endAngle) * (arcLength - 2.5)} ${Math.sin(endAngle) * (arcLength - 2.5)}
                                        Q ${Math.cos(midAngle) * (outerR - 3.5)} ${Math.sin(midAngle) * (outerR - 3.5)}
                                          ${Math.cos(startAngle) * (innerR + 1)} ${Math.sin(startAngle) * (innerR + 1)}
                                        Z`;
                            })()}
                            fill="url(#mediumArcGradient)"
                            opacity={0.85 * intensity}
                        />

                        {/* Secondary inner glow */}
                        <path
                            d={(() => {
                                const arcSpan = 45 * swingPhase;
                                const startAngle = (currentAngle - arcSpan) * Math.PI / 180;
                                const endAngle = currentAngle * Math.PI / 180;
                                const midAngle = (startAngle + endAngle) / 2;
                                const r = arcLength * 0.85;
                                return `M ${Math.cos(startAngle) * r * 0.5} ${Math.sin(startAngle) * r * 0.5}
                                        Q ${Math.cos(midAngle) * r} ${Math.sin(midAngle) * r}
                                          ${Math.cos(endAngle) * r} ${Math.sin(endAngle) * r}`;
                            })()}
                            fill="none"
                            stroke="rgba(255, 240, 200, 0.6)"
                            strokeWidth="2"
                            opacity={intensity * 0.5}
                            strokeLinecap="round"
                        />

                        {/* Bright white edge */}
                        <path
                            d={(() => {
                                const arcSpan = 50 * swingPhase;
                                const startAngle = (currentAngle - arcSpan * 0.9) * Math.PI / 180;
                                const endAngle = currentAngle * Math.PI / 180;
                                const midAngle = (startAngle + endAngle) / 2;
                                const r = arcLength * 1.08;
                                return `M ${Math.cos(startAngle) * r * 0.6} ${Math.sin(startAngle) * r * 0.6}
                                        Q ${Math.cos(midAngle) * (r + 1.5)} ${Math.sin(midAngle) * (r + 1.5)}
                                          ${Math.cos(endAngle) * r} ${Math.sin(endAngle) * r}`;
                            })()}
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.95)"
                            strokeWidth="1.8"
                            opacity={intensity * 0.85}
                            strokeLinecap="round"
                        />

                        {/* Speed lines - 3 trailing */}
                        {[0, 1, 2].map(i => {
                            const lineAngle = currentAngle - 12 - i * 15;
                            const lineRad = lineAngle * Math.PI / 180;
                            const lineLen = arcLength * (0.3 + i * 0.1);
                            return (
                                <line
                                    key={i}
                                    x1={Math.cos(lineRad) * (arcLength * 0.55)}
                                    y1={Math.sin(lineRad) * (arcLength * 0.55)}
                                    x2={Math.cos(lineRad) * (arcLength * 0.55 + lineLen)}
                                    y2={Math.sin(lineRad) * (arcLength * 0.55 + lineLen)}
                                    stroke={i === 0 ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 240, 200, 0.5)"}
                                    strokeWidth={1.5 - i * 0.3}
                                    opacity={intensity * (0.7 - i * 0.15)}
                                    strokeLinecap="round"
                                />
                            );
                        })}

                        {/* Tip sparkle - medium size */}
                        {swingPhase > 0.35 && swingPhase < 0.75 && (
                            <g transform={`translate(${Math.cos(currentAngle * Math.PI / 180) * arcLength}, ${Math.sin(currentAngle * Math.PI / 180) * arcLength})`}>
                                <circle
                                    cx="0" cy="0"
                                    r={3 + peakIntensity * 2}
                                    fill="url(#impactGlow)"
                                    opacity={peakIntensity * 0.8}
                                />
                                {/* 4-point sparkle */}
                                <path
                                    d="M 0 -3 L 0.5 -0.5 L 3 0 L 0.5 0.5 L 0 3 L -0.5 0.5 L -3 0 L -0.5 -0.5 Z"
                                    fill="white"
                                    opacity={peakIntensity * 0.9}
                                    transform={`scale(${0.8 + peakIntensity * 0.6})`}
                                />
                            </g>
                        )}
                    </g>
                )}

                {/* ========== FULL POWER SWING - SNES Zelda-style epic slash ========== */}
                {swingType === 'full' && swingPhase > 0.15 && swingPhase < 0.95 && (
                    <g>
                        {/* SNES-style triple trail effect - ghosting behind the main arc */}
                        {[0.12, 0.08, 0.04].map((delay, i) => {
                            const trailPhase = Math.max(0, swingPhase - delay);
                            const trailArc = trailPhase * 120;
                            const trailAngle = currentAngle - (swingPhase - trailPhase) * 120;
                            const trailRad = trailAngle * Math.PI / 180;
                            const startRad = (trailAngle - trailArc * 0.7) * Math.PI / 180;
                            const midRad = (trailAngle - trailArc * 0.35) * Math.PI / 180;
                            const trailR = arcLength * (1.1 - i * 0.08);
                            const trailOpacity = (0.4 - i * 0.12) * intensity;

                            return (
                                <path
                                    key={`trail-${i}`}
                                    d={`M ${Math.cos(startRad) * trailR * 0.3} ${Math.sin(startRad) * trailR * 0.3}
                                        Q ${Math.cos(midRad) * trailR} ${Math.sin(midRad) * trailR}
                                          ${Math.cos(trailRad) * trailR} ${Math.sin(trailRad) * trailR}`}
                                    fill="none"
                                    stroke={`rgba(${200 + i * 20}, ${230 + i * 10}, 255, ${trailOpacity})`}
                                    strokeWidth={5 - i * 1.2}
                                    strokeLinecap="round"
                                    style={{ filter: 'blur(2px)' }}
                                />
                            );
                        })}

                        {/* Outer electric glow aura - pale blue, wider for SNES effect */}
                        <path
                            d={(() => {
                                const arcSpan = 110 * swingPhase;
                                const startAngle = (currentAngle - arcSpan) * Math.PI / 180;
                                const endAngle = currentAngle * Math.PI / 180;
                                const midAngle = (startAngle + endAngle) / 2;
                                const innerR = arcLength * 0.1;
                                const outerR = arcLength * 1.5;

                                return `M ${Math.cos(startAngle) * innerR} ${Math.sin(startAngle) * innerR}
                                        Q ${Math.cos(midAngle) * outerR} ${Math.sin(midAngle) * outerR}
                                          ${Math.cos(endAngle) * (arcLength + 4)} ${Math.sin(endAngle) * (arcLength + 4)}
                                        L ${Math.cos(endAngle) * arcLength} ${Math.sin(endAngle) * arcLength}
                                        Q ${Math.cos(midAngle) * (outerR - 6)} ${Math.sin(midAngle) * (outerR - 6)}
                                          ${Math.cos(startAngle) * (innerR + 2)} ${Math.sin(startAngle) * (innerR + 2)}
                                        Z`;
                            })()}
                            fill="rgba(180, 210, 255, 0.25)"
                            opacity={intensity * 0.8}
                            style={{ filter: 'blur(4px)' }}
                        />

                        {/* Secondary outer glow - electric blue edge */}
                        <path
                            d={(() => {
                                const arcSpan = 105 * swingPhase;
                                const startAngle = (currentAngle - arcSpan) * Math.PI / 180;
                                const endAngle = currentAngle * Math.PI / 180;
                                const midAngle = (startAngle + endAngle) / 2;
                                const r = arcLength * 1.35;
                                return `M ${Math.cos(startAngle) * r * 0.25} ${Math.sin(startAngle) * r * 0.25}
                                        Q ${Math.cos(midAngle) * (r + 3)} ${Math.sin(midAngle) * (r + 3)}
                                          ${Math.cos(endAngle) * r} ${Math.sin(endAngle) * r}`;
                            })()}
                            fill="none"
                            stroke="rgba(160, 200, 255, 0.5)"
                            strokeWidth="6"
                            opacity={intensity * 0.6}
                            strokeLinecap="round"
                            style={{ filter: 'blur(3px)' }}
                        />

                        {/* Main crescent arc - SNES Zelda blade shape */}
                        <path
                            d={(() => {
                                const arcSpan = 100 * swingPhase;
                                const startAngle = (currentAngle - arcSpan) * Math.PI / 180;
                                const endAngle = currentAngle * Math.PI / 180;
                                const midAngle = (startAngle + endAngle) / 2;
                                const innerR = arcLength * 0.15;
                                const outerR = arcLength * 1.3;

                                return `M ${Math.cos(startAngle) * innerR} ${Math.sin(startAngle) * innerR}
                                        Q ${Math.cos(midAngle) * outerR} ${Math.sin(midAngle) * outerR}
                                          ${Math.cos(endAngle) * (arcLength + 2)} ${Math.sin(endAngle) * (arcLength + 2)}
                                        L ${Math.cos(endAngle) * (arcLength - 4)} ${Math.sin(endAngle) * (arcLength - 4)}
                                        Q ${Math.cos(midAngle) * (outerR - 5)} ${Math.sin(midAngle) * (outerR - 5)}
                                          ${Math.cos(startAngle) * (innerR + 2)} ${Math.sin(startAngle) * (innerR + 2)}
                                        Z`;
                            })()}
                            fill="url(#fullArcGradient)"
                            opacity={0.98 * intensity}
                        />

                        {/* Inner electric core - bright white */}
                        <path
                            d={(() => {
                                const arcSpan = 85 * swingPhase;
                                const startAngle = (currentAngle - arcSpan) * Math.PI / 180;
                                const endAngle = currentAngle * Math.PI / 180;
                                const midAngle = (startAngle + endAngle) / 2;
                                const r = arcLength * 1.0;
                                return `M ${Math.cos(startAngle) * r * 0.3} ${Math.sin(startAngle) * r * 0.3}
                                        Q ${Math.cos(midAngle) * r} ${Math.sin(midAngle) * r}
                                          ${Math.cos(endAngle) * r} ${Math.sin(endAngle) * r}`;
                            })()}
                            fill="none"
                            stroke="rgba(240, 250, 255, 0.95)"
                            strokeWidth="4"
                            opacity={intensity * 0.9}
                            strokeLinecap="round"
                        />

                        {/* Crisp white cutting edge - the blade's edge */}
                        <path
                            d={(() => {
                                const arcSpan = 95 * swingPhase;
                                const startAngle = (currentAngle - arcSpan * 0.9) * Math.PI / 180;
                                const endAngle = currentAngle * Math.PI / 180;
                                const midAngle = (startAngle + endAngle) / 2;
                                const r = arcLength * 1.25;
                                return `M ${Math.cos(startAngle) * r * 0.4} ${Math.sin(startAngle) * r * 0.4}
                                        Q ${Math.cos(midAngle) * (r + 3)} ${Math.sin(midAngle) * (r + 3)}
                                          ${Math.cos(endAngle) * r} ${Math.sin(endAngle) * r}`;
                            })()}
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            opacity={intensity}
                            strokeLinecap="round"
                        />

                        {/* Sizzling electric sparks along the arc */}
                        {swingPhase > 0.3 && swingPhase < 0.85 && [0, 1, 2, 3, 4].map(i => {
                            const sparkProgress = (swingPhase - 0.3) / 0.55;
                            const sparkAngle = currentAngle - (i * 12 + Math.sin(Date.now() * 0.01 + i) * 5);
                            const sparkRad = sparkAngle * Math.PI / 180;
                            const sparkDist = arcLength * (0.7 + i * 0.08);
                            const sparkSize = 1.5 + Math.sin(Date.now() * 0.02 + i * 2) * 0.8;
                            const sparkOpacity = intensity * (0.9 - i * 0.12) * (Math.sin(Date.now() * 0.03 + i) * 0.3 + 0.7);

                            return (
                                <g key={`spark-${i}`}>
                                    {/* Electric spark point */}
                                    <circle
                                        cx={Math.cos(sparkRad) * sparkDist}
                                        cy={Math.sin(sparkRad) * sparkDist}
                                        r={sparkSize}
                                        fill="white"
                                        opacity={sparkOpacity}
                                    />
                                    {/* Spark glow */}
                                    <circle
                                        cx={Math.cos(sparkRad) * sparkDist}
                                        cy={Math.sin(sparkRad) * sparkDist}
                                        r={sparkSize * 2}
                                        fill="rgba(200, 230, 255, 0.4)"
                                        opacity={sparkOpacity * 0.6}
                                        style={{ filter: 'blur(1px)' }}
                                    />
                                </g>
                            );
                        })}

                        {/* Speed lines - electric blue trailing */}
                        {[0, 1, 2, 3, 4].map(i => {
                            const lineAngle = currentAngle - 8 - i * 10;
                            const lineRad = lineAngle * Math.PI / 180;
                            const lineLen = arcLength * (0.45 + i * 0.06);
                            const lineColor = i < 2 ? "white" : i < 4 ? "rgba(220, 240, 255, 0.8)" : "rgba(180, 210, 255, 0.6)";
                            return (
                                <line
                                    key={i}
                                    x1={Math.cos(lineRad) * (arcLength * 0.45)}
                                    y1={Math.sin(lineRad) * (arcLength * 0.45)}
                                    x2={Math.cos(lineRad) * (arcLength * 0.45 + lineLen)}
                                    y2={Math.sin(lineRad) * (arcLength * 0.45 + lineLen)}
                                    stroke={lineColor}
                                    strokeWidth={2.2 - i * 0.3}
                                    opacity={intensity * (0.95 - i * 0.12)}
                                    strokeLinecap="round"
                                />
                            );
                        })}

                        {/* Epic tip sparkle with electric sizzle effect */}
                        {swingPhase > 0.28 && swingPhase < 0.82 && (
                            <g
                                transform={`translate(${Math.cos(currentAngle * Math.PI / 180) * arcLength}, ${Math.sin(currentAngle * Math.PI / 180) * arcLength})`}
                                filter="url(#sparkleGlow)"
                            >
                                {/* Outer electric halo */}
                                <circle
                                    cx="0" cy="0"
                                    r={6 + peakIntensity * 4}
                                    fill="rgba(200, 230, 255, 0.3)"
                                    opacity={peakIntensity * 0.7}
                                    style={{ filter: 'blur(2px)' }}
                                />
                                {/* Central bright glow */}
                                <circle
                                    cx="0" cy="0"
                                    r={4 + peakIntensity * 3}
                                    fill="url(#impactGlow)"
                                    opacity={peakIntensity * 0.95}
                                />
                                {/* 8-point star sparkle - rotating */}
                                <path
                                    d="M 0 -6 L 0.8 -0.8 L 6 0 L 0.8 0.8 L 0 6 L -0.8 0.8 L -6 0 L -0.8 -0.8 Z"
                                    fill="white"
                                    opacity={peakIntensity}
                                    transform={`scale(${0.7 + peakIntensity * 0.9}) rotate(${swingPhase * 60})`}
                                />
                                {/* Secondary blue-tinted star */}
                                <path
                                    d="M 0 -4 L 0.5 -0.5 L 4 0 L 0.5 0.5 L 0 4 L -0.5 0.5 L -4 0 L -0.5 -0.5 Z"
                                    fill="rgba(220, 240, 255, 0.95)"
                                    opacity={peakIntensity * 0.85}
                                    transform={`scale(${0.9 + peakIntensity * 0.6}) rotate(${-swingPhase * 40 + 22.5})`}
                                />
                                {/* Radiating electric rays */}
                                {[0, 30, 60, 90, 120, 150].map(angle => (
                                    <line
                                        key={angle}
                                        x1={0} y1={0}
                                        x2={Math.cos(angle * Math.PI / 180) * (5 + peakIntensity * 5)}
                                        y2={Math.sin(angle * Math.PI / 180) * (5 + peakIntensity * 5)}
                                        stroke={angle % 60 === 0 ? "white" : "rgba(200, 230, 255, 0.8)"}
                                        strokeWidth={angle % 60 === 0 ? 1.2 : 0.8}
                                        opacity={peakIntensity * (0.8 - (angle % 60 === 0 ? 0 : 0.2))}
                                        strokeLinecap="round"
                                    />
                                ))}
                                {/* Mini sparkle bursts */}
                                {[0, 1, 2].map(i => {
                                    const burstAngle = (i * 120 + swingPhase * 200) % 360;
                                    const burstDist = 3 + peakIntensity * 3;
                                    return (
                                        <circle
                                            key={`burst-${i}`}
                                            cx={Math.cos(burstAngle * Math.PI / 180) * burstDist}
                                            cy={Math.sin(burstAngle * Math.PI / 180) * burstDist}
                                            r={1 + Math.sin(Date.now() * 0.02 + i) * 0.5}
                                            fill="white"
                                            opacity={peakIntensity * 0.8}
                                        />
                                    );
                                })}
                            </g>
                        )}
                    </g>
                )}

                {/* ========== PARTICLES - Dynamic procedural effects ========== */}
                {swingParticles.map(p => {
                    // Particle style varies by swing type
                    const particleStyle = swingType === 'full' ? 'sparkle' : swingType === 'medium' ? 'dust' : 'glint';
                    const lifeRatio = p.life / 25;

                    return (
                        <g key={p.id} transform={`translate(${p.x + Math.cos(currentAngle * Math.PI / 180) * 8}, ${p.y + Math.sin(currentAngle * Math.PI / 180) * 8})`}>
                            {particleStyle === 'sparkle' && (
                                <>
                                    {/* Glowing sparkle particle */}
                                    <circle
                                        cx="0" cy="0"
                                        r={p.size * 1.5}
                                        fill={p.color}
                                        opacity={lifeRatio * 0.4}
                                        style={{ filter: 'blur(1px)' }}
                                    />
                                    <path
                                        d={`M 0 ${-p.size} L ${p.size * 0.3} 0 L 0 ${p.size} L ${-p.size * 0.3} 0 Z`}
                                        fill="white"
                                        opacity={lifeRatio * 0.9}
                                        transform={`rotate(${p.id * 45})`}
                                    />
                                </>
                            )}
                            {particleStyle === 'dust' && (
                                <>
                                    {/* Soft dust mote with trail */}
                                    <ellipse
                                        cx="0" cy="0"
                                        rx={p.size * 1.2}
                                        ry={p.size * 0.6}
                                        fill={p.color}
                                        opacity={lifeRatio * 0.7}
                                        transform={`rotate(${Math.atan2(p.vy, p.vx) * 180 / Math.PI})`}
                                    />
                                </>
                            )}
                            {particleStyle === 'glint' && (
                                <>
                                    {/* Tiny glinting point */}
                                    <circle
                                        cx="0" cy="0"
                                        r={p.size * 0.8}
                                        fill="white"
                                        opacity={lifeRatio * 0.8}
                                    />
                                </>
                            )}
                        </g>
                    );
                })}
            </g>
        );
    };

    // Calculate cane swing rotation - varies by swing type
    const swingType = getSwingType(swingPower);
    // Full power gets a much wider arc for dramatic Zelda-style sweep
    const swingArcDegrees = swingType === 'tap' ? 50 : swingType === 'medium' ? 75 : 130;

    // Arm wind-up: during charging, arm pulls back dramatically; during swing, explosive follow-through
    // Zelda-style animation with pronounced anticipation and release
    const armWindUp = isCharging
        // While charging: arm pulls back progressively with slight tremor at high power
        ? (() => {
            const baseWindUp = -18 - (swingPower * 0.35); // Pull back more (-18 to -53 degrees)
            // Add subtle tremor/tension at high charge levels
            const tremor = swingPower > 70 ? Math.sin(Date.now() * 0.02) * 2 : 0;
            return baseWindUp + tremor;
        })()
        : swingPhase > 0
            ? (() => {
                // During swing: dramatic release with overshoot and settle
                if (swingType === 'tap') {
                    // Quick flick with slight bounce-back
                    if (swingPhase < 0.25) {
                        return -12 * (1 - swingPhase * 4); // Quick release from wind-up
                    } else if (swingPhase < 0.6) {
                        return (swingPhase - 0.25) * 45; // Fast follow-through
                    } else {
                        // Slight settle/bounce back
                        return 15 - (swingPhase - 0.6) * 10;
                    }
                } else if (swingType === 'medium') {
                    // Medium: hold wind-up, then smooth powerful release
                    if (swingPhase < 0.2) {
                        return -30 * (1 - swingPhase * 2); // Hold tension briefly
                    } else if (swingPhase < 0.5) {
                        // Explosive release with acceleration
                        const releaseProgress = (swingPhase - 0.2) / 0.3;
                        return -30 * (1 - releaseProgress) + releaseProgress * 55;
                    } else if (swingPhase < 0.75) {
                        // Peak extension
                        return 55 + (swingPhase - 0.5) * 20;
                    } else {
                        // Follow-through and settle
                        return 60 - (swingPhase - 0.75) * 40;
                    }
                } else {
                    // Full power: dramatic Zelda-style wind-up hold, explosive release, dramatic follow-through
                    if (swingPhase < 0.25) {
                        // Hold the tension at maximum wind-up with slight vibration
                        const holdTremor = Math.sin(swingPhase * 80) * 3;
                        return -50 * (1 - swingPhase * 1.5) + holdTremor;
                    } else if (swingPhase < 0.45) {
                        // EXPLOSIVE release - fastest part of the swing
                        const releaseProgress = (swingPhase - 0.25) / 0.2;
                        const easeOut = 1 - Math.pow(1 - releaseProgress, 3);
                        return -50 * (1 - easeOut) + easeOut * 70;
                    } else if (swingPhase < 0.7) {
                        // Extended follow-through with overshoot
                        const overProgress = (swingPhase - 0.45) / 0.25;
                        return 70 + Math.sin(overProgress * Math.PI) * 15;
                    } else {
                        // Settle back with slight bounce
                        const settleProgress = (swingPhase - 0.7) / 0.3;
                        return 85 - settleProgress * 55 + Math.sin(settleProgress * Math.PI * 2) * 5;
                    }
                }
            })()
            : 0;

    const caneSwingRotation = swingPhase > 0 ? (swingPhase * swingArcDegrees - swingArcDegrees / 2) : (isCharging ? -swingPower * 0.15 : 0);

    // Render watch chain (gold albert chain across vest)
    const renderWatchChain = (isProfile: boolean = false, flipX: boolean = false) => {
        if (!clothing.accessories?.includes('watch_chain')) return null;

        if (isProfile) {
            // Side view - single arc visible
            const xOffset = flipX ? -2 : 2;
            return (
                <g>
                    <path
                        d={`M${16 + xOffset} 17 Q${16 + xOffset * 1.5} 19 ${16 + xOffset} 21`}
                        fill="none"
                        stroke={colors.watchChain}
                        strokeWidth="0.6"
                    />
                    {/* Small fob */}
                    <circle cx={16 + xOffset} cy={21} r="0.8" fill={colors.watchChain} />
                </g>
            );
        }

        // Front view - double albert chain
        return (
            <g>
                {/* Left chain arc */}
                <path
                    d="M14 16 Q13 18 14 20 Q15 21 16 21"
                    fill="none"
                    stroke={colors.watchChain}
                    strokeWidth="0.5"
                />
                {/* Right chain arc */}
                <path
                    d="M18 16 Q19 18 18 20 Q17 21 16 21"
                    fill="none"
                    stroke={colors.watchChain}
                    strokeWidth="0.5"
                />
                {/* Center connector through buttonhole */}
                <circle cx="16" cy="19" r="0.6" fill={colors.watchChain} stroke={colors.watchChainShadow} strokeWidth="0.2" />
                {/* Fob seal on right */}
                <ellipse cx="18.5" cy="20" rx="0.8" ry="1" fill={colors.watchChain} />
            </g>
        );
    };

    // Render bald head when hat is removed
    const renderBaldHead = (isProfile: boolean = false, flipX: boolean = false) => {
        // Henry James was famously bald on top by 1889
        if (isProfile) {
            const xBase = flipX ? 17 : 15;
            return (
                <g>
                    {/* Bald dome - skin tone on top */}
                    <ellipse cx={xBase} cy="1" rx="4" ry="2.5" fill={colors.skin} />
                    {/* Subtle shine on bald head */}
                    <ellipse cx={xBase - 1} cy="0.5" rx="1.5" ry="0.8" fill={colors.skinHighlight} opacity="0.4" />
                    {/* Hair on sides and back - thinning but present */}
                    <path
                        d={flipX
                            ? `M21 3 Q22 4 22 6 Q21 7 20 6`
                            : `M11 3 Q10 4 10 6 Q11 7 12 6`
                        }
                        fill={colors.hair}
                    />
                </g>
            );
        }

        // Front/back view - show bald crown with hair on sides
        return (
            <g>
                {/* Bald dome */}
                <ellipse cx="16" cy="2" rx="4.5" ry="2.5" fill={colors.skin} />
                {/* Subtle shine */}
                <ellipse cx="14.5" cy="1" rx="2" ry="1" fill={colors.skinHighlight} opacity="0.35" />
                {/* Hair fringe on sides */}
                <path d="M11 4 Q11 7 12 8" fill="none" stroke={colors.hair} strokeWidth="2" />
                <path d="M21 4 Q21 7 20 8" fill="none" stroke={colors.hair} strokeWidth="2" />
            </g>
        );
    };

    // Render top hat with better detail
    const renderTopHat = (isProfile: boolean = false, flipX: boolean = false) => {
        if (clothing.hat !== 'top_hat') return renderBaldHead(isProfile, flipX);

        if (isProfile) {
            const xBase = flipX ? 16 : 16;
            return (
                <g>
                    {/* Hat brim */}
                    <ellipse cx={xBase} cy="2" rx="5.5" ry="1.3" fill={colors.hat} />
                    {/* Crown */}
                    <rect x={xBase - 4} y="-4.5" width="8" height="6.5" fill={colors.hat} />
                    {/* Silk sheen highlight */}
                    <path
                        d={`M${xBase - 3} -4.5 L${xBase - 3} 2 L${xBase - 2} 2 L${xBase - 2} -3.5`}
                        fill={colors.hatSheen}
                        opacity="0.25"
                    />
                    {/* Top crown */}
                    <ellipse cx={xBase} cy="-4.5" rx="4" ry="1" fill={colors.hatHighlight} />
                    {/* Band */}
                    <rect x={xBase - 5} y="0.8" width="10" height="1" fill={colors.hatBand} />
                    {/* Band buckle detail */}
                    <rect x={xBase + 2} y="0.9" width="1.5" height="0.8" fill={colors.watchChain} opacity="0.7" />
                </g>
            );
        }

        // Front/back view
        return (
            <g>
                {/* Brim - slightly curved */}
                <ellipse cx="16" cy="2.5" rx="6" ry="1.5" fill={colors.hat} />
                {/* Crown */}
                <rect x="12" y="-4.5" width="8" height="7" fill={colors.hat} />
                {/* Silk sheen */}
                <path d="M12 -4.5 L12 2.5 L13.5 2.5 L13.5 -3.5" fill={colors.hatSheen} opacity="0.2" />
                {/* Top */}
                <ellipse cx="16" cy="-4.5" rx="4" ry="1" fill={colors.hatHighlight} />
                {/* Grosgrain band */}
                <rect x="12" y="1.3" width="8" height="1.2" fill={colors.hatBand} />
                {/* Small bow detail on band */}
                <ellipse cx="20" cy="1.9" rx="0.8" ry="0.4" fill={colors.hatBand} opacity="0.8" />
            </g>
        );
    };

    // Render pince-nez glasses
    const renderPinceNez = (isProfile: boolean = false, flipX: boolean = false) => {
        if (!pinceNez) return null;

        const goldColor = '#d4af37';
        const goldDark = '#b8960f';

        if (isProfile) {
            // Side view - single lens visible
            const baseX = flipX ? 14 : 18;
            return (
                <g>
                    {/* Single lens visible from side - small oval */}
                    <ellipse cx={baseX} cy="5.2" rx="1" ry="1.1" fill="rgba(255,255,255,0.1)" stroke={goldColor} strokeWidth="0.3" />
                    {/* Bridge on nose */}
                    <path d={flipX ? `M${baseX + 0.8} 5.2 Q${baseX + 1.2} 5 ${baseX + 1.5} 5.5` : `M${baseX - 0.8} 5.2 Q${baseX - 1.2} 5 ${baseX - 1.5} 5.5`}
                          fill="none" stroke={goldColor} strokeWidth="0.25" />
                    {/* Lens glint */}
                    <ellipse cx={baseX - (flipX ? -0.3 : 0.3)} cy="4.7" rx="0.3" ry="0.2" fill="white" opacity="0.5" />
                    {/* Chain going down */}
                    <path d={`M${baseX + (flipX ? -0.8 : 0.8)} 6.2 Q${baseX + (flipX ? -1 : 1)} 8 ${baseX + (flipX ? -0.5 : 0.5)} 10`}
                          fill="none" stroke={goldColor} strokeWidth="0.15" strokeDasharray="0.3,0.3" />
                </g>
            );
        }

        // Front view - both lenses (smaller)
        return (
            <g>
                {/* Left lens */}
                <ellipse cx="14" cy="6.5" rx="1.1" ry="1.2" fill="rgba(255,255,255,0.1)" stroke={goldColor} strokeWidth="0.3" />
                {/* Right lens */}
                <ellipse cx="18" cy="6.5" rx="1.1" ry="1.2" fill="rgba(255,255,255,0.1)" stroke={goldColor} strokeWidth="0.3" />
                {/* Bridge - spring clip on nose */}
                <path d="M15.1 6.5 Q16 6 16.9 6.5" fill="none" stroke={goldColor} strokeWidth="0.3" />
                {/* Lens glints */}
                <ellipse cx="13.6" cy="6" rx="0.3" ry="0.2" fill="white" opacity="0.5" />
                <ellipse cx="17.6" cy="6" rx="0.3" ry="0.2" fill="white" opacity="0.5" />
                {/* Chain attachment and chain going to lapel */}
                <circle cx="19" cy="7" r="0.2" fill={goldColor} />
                <path d="M19 7.2 Q19.5 8.5 19.2 10" fill="none" stroke={goldColor} strokeWidth="0.12" strokeDasharray="0.3,0.3" />
            </g>
        );
    };

    // South-facing (front view)
    if (direction === 'S') {
        return (
            <div className={`relative w-full h-full flex items-center justify-center cursor-pointer ${className}`}
                 style={{ transform: `translateY(${-bounce}px)` }}
                 onClick={handleClick}>
                <svg viewBox="0 0 32 40" className="w-10 h-12 overflow-visible drop-shadow-lg">
                    <defs>
                        <linearGradient id="coatGradS" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={colors.coatHighlight} />
                            <stop offset="30%" stopColor={colors.coat} />
                            <stop offset="70%" stopColor={colors.coat} />
                            <stop offset="100%" stopColor={colors.coatHighlight} />
                        </linearGradient>
                        <linearGradient id="vestGradS" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={colors.vestDark} />
                            <stop offset="50%" stopColor={colors.vest} />
                            <stop offset="100%" stopColor={colors.vestDark} />
                        </linearGradient>
                        <linearGradient id="pantsGradS" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={colors.pants} />
                            <stop offset="100%" stopColor={colors.pantsShadow} />
                        </linearGradient>
                    </defs>

                    {/* Shadow on ground */}
                    <ellipse cx={16 + coatSway * 0.3} cy="39" rx={8 + bounce * 0.3} ry={2 - bounce * 0.1} fill="rgba(0,0,0,0.25)" />

                    {/* Legs with walking animation - improved with knee bend */}
                    <g>
                        {/* Left leg - bends at knee when lifting */}
                        {(() => {
                            const leftLegForward = legSwing < 0; // Left leg forward when legSwing negative
                            const leftKneeBend = leftLegForward ? Math.abs(legSwing) * 0.15 : 0;
                            const leftFootY = 36 - (leftLegForward ? Math.abs(legSwing) * 0.1 : 0);
                            const leftFootX = 12.5 - legSwing * 0.2;
                            const leftKneeX = 12 - legSwing * 0.1;
                            return (
                                <>
                                    <path d={`M11 28
                                              Q${leftKneeX - 1} ${31 - leftKneeBend} ${leftFootX - 2} ${leftFootY - 1}
                                              L${leftFootX + 2} ${leftFootY - 1}
                                              Q${leftKneeX + 3} ${31 - leftKneeBend} 15 28`}
                                          fill="url(#pantsGradS)" />
                                    <line x1={leftKneeX} y1={30 - leftKneeBend * 0.5}
                                          x2={leftFootX} y2={leftFootY - 2}
                                          stroke={colors.pantsShadow} strokeWidth="0.3" />
                                    <ellipse cx={leftFootX} cy={leftFootY} rx="2.8" ry="1.5" fill={colors.shoes} />
                                    <ellipse cx={leftFootX} cy={leftFootY - 0.5} rx="2" ry="0.8" fill={colors.shoesHighlight} />
                                </>
                            );
                        })()}

                        {/* Right leg - bends at knee when lifting */}
                        {(() => {
                            const rightLegForward = legSwing > 0; // Right leg forward when legSwing positive
                            const rightKneeBend = rightLegForward ? Math.abs(legSwing) * 0.15 : 0;
                            const rightFootY = 36 - (rightLegForward ? Math.abs(legSwing) * 0.1 : 0);
                            const rightFootX = 19.5 + legSwing * 0.2;
                            const rightKneeX = 20 + legSwing * 0.1;
                            return (
                                <>
                                    <path d={`M17 28
                                              Q${rightKneeX - 3} ${31 - rightKneeBend} ${rightFootX - 2} ${rightFootY - 1}
                                              L${rightFootX + 2} ${rightFootY - 1}
                                              Q${rightKneeX + 1} ${31 - rightKneeBend} 21 28`}
                                          fill="url(#pantsGradS)" />
                                    <line x1={rightKneeX} y1={30 - rightKneeBend * 0.5}
                                          x2={rightFootX} y2={rightFootY - 2}
                                          stroke={colors.pantsShadow} strokeWidth="0.3" />
                                    <ellipse cx={rightFootX} cy={rightFootY} rx="2.8" ry="1.5" fill={colors.shoes} />
                                    <ellipse cx={rightFootX} cy={rightFootY - 0.5} rx="2" ry="0.8" fill={colors.shoesHighlight} />
                                </>
                            );
                        })()}
                    </g>

                    {/* Morning Coat tails */}
                    <path d={`M9 27 Q7 31 ${7 + coatSway} 36 L${11 + coatSway} 36 Q10 31 11 27`}
                          fill={colors.coatShadow} />
                    <path d={`M21 27 Q22 31 ${25 - coatSway} 36 L${21 - coatSway} 36 Q22 31 21 27`}
                          fill={colors.coatShadow} />

                    {/* Body/Coat */}
                    <g transform={`rotate(${shoulderTilt} 16 20)`}>
                        <path d="M7 14 Q7 12 12 11.5 L20 11.5 Q25 12 25 14 L25 28 L7 28 Z"
                              fill="url(#coatGradS)" />

                        {/* Coat front edges - cutaway */}
                        <path d="M7 14 L7 28 L9 28 L12 20 L12 14 Q9 13 7 14" fill={colors.coatShadow} />
                        <path d="M25 14 L25 28 L23 28 L20 20 L20 14 Q23 13 25 14" fill={colors.coatShadow} />

                        {/* Lapels */}
                        <path d="M12 11.5 L12 14 L14 19 L13 19 L11 14 L11 12 Z" fill={colors.coatHighlight} />
                        <path d="M20 11.5 L20 14 L18 19 L19 19 L21 14 L21 12 Z" fill={colors.coatHighlight} />

                        {/* Lapel notches */}
                        <path d="M11.5 12 L10 11 L11 13" fill={colors.coat} stroke={colors.coatShadow} strokeWidth="0.2" />
                        <path d="M20.5 12 L22 11 L21 13" fill={colors.coat} stroke={colors.coatShadow} strokeWidth="0.2" />

                        {/* Vest */}
                        <path d="M13 14 L13 27 L19 27 L19 14 Q16 13 13 14" fill="url(#vestGradS)" />
                        <line x1="16" y1="14" x2="16" y2="27" stroke={colors.vestDark} strokeWidth="0.3" />

                        {/* Vest buttons */}
                        <circle cx="16" cy="16" r="0.5" fill={colors.caneHandle} />
                        <circle cx="16" cy="19" r="0.5" fill={colors.caneHandle} />
                        <circle cx="16" cy="22" r="0.5" fill={colors.caneHandle} />
                        <circle cx="16" cy="25" r="0.5" fill={colors.caneHandle} />

                        {/* Watch chain */}
                        {renderWatchChain(false)}

                        {/* Shirt front */}
                        <path d="M14.5 12 L14.5 14 L17.5 14 L17.5 12 Q16 11.5 14.5 12" fill={colors.shirt} />

                        {/* High collar points */}
                        <path d="M13 11 L14.5 13 L14.5 11.5" fill={colors.collar} />
                        <path d="M19 11 L17.5 13 L17.5 11.5" fill={colors.collar} />

                        {/* Cravat */}
                        <path d="M14.5 12.5 Q16 14 17.5 12.5 L17 15.5 L16 14.5 L15 15.5 Z" fill={colors.tie} />
                        <ellipse cx="16" cy="13" rx="1.2" ry="0.6" fill={colors.tie} />
                        <circle cx="16" cy="13" r="0.4" fill={colors.caneHandle} opacity="0.7" />
                    </g>

                    {/* Arms */}
                    <g transform={`rotate(${armSwing} 9 15)`}>
                        <path d="M7 14 L3 25 L5.5 25 L9 16" fill={colors.coat} />
                        <line x1="6" y1="18" x2="4.5" y2="24" stroke={colors.coatShadow} strokeWidth="0.3" />
                        <ellipse cx="4.2" cy="25.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>
                    <g transform={`rotate(${-armSwing + armWindUp + (swingPhase > 0 ? caneSwingRotation * 0.3 : 0)} 23 15)`}>
                        <path d="M25 14 L29 25 L26.5 25 L23 16" fill={colors.coat} />
                        <line x1="26" y1="18" x2="27.5" y2="24" stroke={colors.coatShadow} strokeWidth="0.3" />
                        <ellipse cx="27.8" cy="25.5" rx="1.5" ry="1" fill={colors.skin} />
                        {/* Cane */}
                        <g transform={`rotate(${caneSwingRotation} 27.5 25)`}>
                            <line x1="27.5" y1="25" x2="28" y2="38" stroke={colors.cane} strokeWidth="1.8" />
                            <line x1="27.7" y1="25" x2="28.2" y2="38" stroke={colors.caneHighlight} strokeWidth="0.4" />
                            <ellipse cx="27.5" cy="24" rx="1.8" ry="1" fill={colors.caneHandle} />
                            {/* Ferrule */}
                            <ellipse cx="28" cy="38" rx="0.6" ry="0.3" fill="#888" />
                        </g>
                    </g>

                    {renderSwingEffects(27.5, 25, 90)}

                    {/* Neck */}
                    <rect x="14" y="9" width="4" height="3" fill={colors.skin} />

                    {/* Head */}
                    <g transform={`translate(0, ${headBob})`}>
                        <ellipse cx="16" cy="7" rx="5" ry="4.5" fill={colors.skin} />

                        {/* Hair on sides */}
                        <path d="M11 5 Q11 8 12 9" fill="none" stroke={colors.hair} strokeWidth="1.5" />
                        <path d="M21 5 Q21 8 20 9" fill="none" stroke={colors.hair} strokeWidth="1.5" />

                        {/* Eyes */}
                        {isBlinking ? (
                            <>
                                <path d="M13 6.5 L15 6.5" stroke={colors.hair} strokeWidth="0.6" fill="none" />
                                <path d="M17 6.5 L19 6.5" stroke={colors.hair} strokeWidth="0.6" fill="none" />
                            </>
                        ) : (
                            <>
                                <ellipse cx="14" cy="6.5" rx="1.1" ry="0.9" fill="white" />
                                <ellipse cx="18" cy="6.5" rx="1.1" ry="0.9" fill="white" />
                                <circle cx="14.2" cy="6.5" r="0.6" fill="#5a4a3a" />
                                <circle cx="18.2" cy="6.5" r="0.6" fill="#5a4a3a" />
                                <circle cx="14.2" cy="6.5" r="0.3" fill="#2a1a0a" />
                                <circle cx="18.2" cy="6.5" r="0.3" fill="#2a1a0a" />
                                <circle cx="13.9" cy="6.2" r="0.2" fill="white" opacity="0.8" />
                                <circle cx="17.9" cy="6.2" r="0.2" fill="white" opacity="0.8" />
                            </>
                        )}

                        {/* Eyebrows */}
                        <path d="M12.5 5.3 Q14 5 15.2 5.4" stroke={colors.hair} strokeWidth="0.6" fill="none" />
                        <path d="M16.8 5.4 Q18 5 19.5 5.3" stroke={colors.hair} strokeWidth="0.6" fill="none" />

                        {/* Nose */}
                        <path d="M16 6.5 L16.2 8.2 Q16 8.8 15.3 9" fill="none" stroke={colors.skinShadow} strokeWidth="0.4" />
                        <ellipse cx="15.8" cy="8.5" rx="0.8" ry="0.4" fill={colors.skinShadow} opacity="0.3" />

                        {/* Cheeks */}
                        <ellipse cx="12.5" cy="8" rx="1" ry="0.8" fill={colors.skinShadow} opacity="0.15" />
                        <ellipse cx="19.5" cy="8" rx="1" ry="0.8" fill={colors.skinShadow} opacity="0.15" />

                        {/* Mouth */}
                        <path d="M14.5 9.5 Q16 10 17.5 9.5" fill="none" stroke={colors.skinShadow} strokeWidth="0.3" />

                        {/* Beard */}
                        <path d="M13.5 10 Q13 11 14 11.8 Q16 12.3 18 11.8 Q19 11 18.5 10" fill={colors.beard} />

                        {/* Mustache */}
                        <path d="M13.2 9.2 Q14.5 9.8 16 9.5 Q17.5 9.8 18.8 9.2" fill={colors.beard} />
                        <ellipse cx="16" cy="9.6" rx="2.2" ry="0.6" fill={colors.beard} />

                        {/* Pince-nez */}
                        {renderPinceNez(false)}

                        {/* Ears */}
                        <ellipse cx="11" cy="7" rx="0.8" ry="1.2" fill={colors.skin} />
                        <ellipse cx="11" cy="7" rx="0.4" ry="0.8" fill={colors.skinShadow} opacity="0.3" />
                        <ellipse cx="21" cy="7" rx="0.8" ry="1.2" fill={colors.skin} />
                        <ellipse cx="21" cy="7" rx="0.4" ry="0.8" fill={colors.skinShadow} opacity="0.3" />

                        {/* Top Hat */}
                        {renderTopHat(false)}

                        {renderThoughtBubble()}
                        {renderSittingBubble()}
                        {renderFireEffect()}
                    </g>
                </svg>
            </div>
        );
    }

    // North-facing (back view)
    if (direction === 'N') {
        return (
            <div className={`relative w-full h-full flex items-center justify-center cursor-pointer ${className}`}
                 style={{ transform: `translateY(${-bounce}px)` }}
                 onClick={handleClick}>
                <svg viewBox="0 0 32 40" className="w-10 h-12 overflow-visible drop-shadow-lg">
                    <defs>
                        <linearGradient id="coatGradN" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={colors.coatHighlight} />
                            <stop offset="50%" stopColor={colors.coat} />
                            <stop offset="100%" stopColor={colors.coatHighlight} />
                        </linearGradient>
                        <linearGradient id="pantsGradN" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={colors.pants} />
                            <stop offset="100%" stopColor={colors.pantsShadow} />
                        </linearGradient>
                    </defs>

                    {/* Shadow */}
                    <ellipse cx={16 - coatSway * 0.3} cy="39" rx={8 + bounce * 0.3} ry={2 - bounce * 0.1} fill="rgba(0,0,0,0.25)" />

                    {/* Legs */}
                    <path d={`M11 28 L${10.5 + legSwing * 0.25} 35 L${14.5 + legSwing * 0.25} 35 L15 28`}
                          fill="url(#pantsGradN)" />
                    <ellipse cx={12.5 + legSwing * 0.25} cy="36" rx="2.8" ry="1.5" fill={colors.shoes} />

                    <path d={`M17 28 L${17.5 - legSwing * 0.25} 35 L${21.5 - legSwing * 0.25} 35 L21 28`}
                          fill="url(#pantsGradN)" />
                    <ellipse cx={19.5 - legSwing * 0.25} cy="36" rx="2.8" ry="1.5" fill={colors.shoes} />

                    {/* Morning coat tails - prominent from back */}
                    <path d={`M8 25
                              Q6 30 ${6 + coatSway} 37
                              L${13 + coatSway} 37
                              Q12 32 13 25`}
                          fill={colors.coat} />
                    <path d={`M24 25
                              Q26 30 ${26 - coatSway} 37
                              L${19 - coatSway} 37
                              Q20 32 19 25`}
                          fill={colors.coat} />

                    {/* Tail center vent */}
                    <path d={`M13 25 L${13 + coatSway * 0.5} 37 L${19 - coatSway * 0.5} 37 L19 25`}
                          fill={colors.coatShadow} />
                    <line x1="16" y1="25" x2={16} y2="37" stroke={colors.coatHighlight} strokeWidth="0.5" />

                    {/* Body/Coat back */}
                    <g transform={`rotate(${-shoulderTilt} 16 20)`}>
                        <path d="M7 13 Q7 11 16 10.5 Q25 11 25 13 L25 28 L7 28 Z" fill="url(#coatGradN)" />
                        <line x1="16" y1="11" x2="16" y2="28" stroke={colors.coatShadow} strokeWidth="0.5" />
                        <path d="M7 13 Q10 12 12 14" fill="none" stroke={colors.coatShadow} strokeWidth="0.3" />
                        <path d="M25 13 Q22 12 20 14" fill="none" stroke={colors.coatShadow} strokeWidth="0.3" />
                        <path d="M8 22 Q16 21 24 22" fill="none" stroke={colors.coatShadow} strokeWidth="0.4" />
                    </g>

                    {/* Arms */}
                    <g transform={`rotate(${-armSwing} 9 15)`}>
                        <path d="M7 14 L3 25 L5.5 25 L9 16" fill={colors.coat} />
                        <ellipse cx="4.2" cy="25.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>
                    <g transform={`rotate(${armSwing + armWindUp + (swingPhase > 0 ? caneSwingRotation * 0.3 : 0)} 23 15)`}>
                        <path d="M25 14 L29 25 L26.5 25 L23 16" fill={colors.coat} />
                        <ellipse cx="27.8" cy="25.5" rx="1.5" ry="1" fill={colors.skin} />
                        <g transform={`rotate(${caneSwingRotation} 27.5 25)`}>
                            <line x1="27.5" y1="25" x2="28" y2="38" stroke={colors.cane} strokeWidth="1.8" />
                            <ellipse cx="27.5" cy="24" rx="1.8" ry="1" fill={colors.caneHandle} />
                        </g>
                    </g>

                    {renderSwingEffects(27.5, 25, 90)}

                    {/* Collar from back */}
                    <path d="M12 10.5 Q16 9.5 20 10.5 L20 12 Q16 11 12 12 Z" fill={colors.collar} />

                    {/* Neck */}
                    <rect x="14" y="9" width="4" height="2" fill={colors.skin} />

                    {/* Head from back */}
                    <g transform={`translate(0, ${headBob})`}>
                        <ellipse cx="16" cy="7" rx="5" ry="4.5" fill={colors.skin} />

                        {/* Hair - visible from back */}
                        <path d="M11 4 Q16 2 21 4 Q21 8 20 9 L12 9 Q11 8 11 4" fill={colors.hair} />

                        {/* Ears */}
                        <ellipse cx="11" cy="7" rx="0.8" ry="1.2" fill={colors.skin} />
                        <ellipse cx="21" cy="7" rx="0.8" ry="1.2" fill={colors.skin} />

                        {/* Top Hat */}
                        {renderTopHat(false)}

                        {renderThoughtBubble()}
                        {renderSittingBubble()}
                        {renderFireEffect()}
                    </g>
                </svg>
            </div>
        );
    }

    // East-facing (right profile) - FIXED: head position corrected
    if (direction === 'E') {
        return (
            <div className={`relative w-full h-full flex items-center justify-center cursor-pointer ${className}`}
                 style={{ transform: `translateY(${-bounce}px)` }}
                 onClick={handleClick}>
                <svg viewBox="0 0 32 40" className="w-10 h-12 overflow-visible drop-shadow-lg">
                    <defs>
                        <linearGradient id="coatGradE" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={colors.coatShadow} />
                            <stop offset="40%" stopColor={colors.coat} />
                            <stop offset="100%" stopColor={colors.coatHighlight} />
                        </linearGradient>
                        <linearGradient id="vestGradE" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={colors.vestDark} />
                            <stop offset="100%" stopColor={colors.vest} />
                        </linearGradient>
                    </defs>

                    {/* Shadow */}
                    <ellipse cx={16 + coatSway * 0.5} cy="39" rx={8 + bounce * 0.3} ry={2 - bounce * 0.1} fill="rgba(0,0,0,0.25)" />

                    {/* Legs - side view walking animation */}
                    {/* Back leg swings opposite to front leg */}
                    {(() => {
                        // legSwing goes -10 to +10
                        // For East-facing: positive legSwing = stepping forward (right), negative = stepping back
                        const frontLegX = 18 + legSwing * 0.4; // Front leg swings forward/back
                        const backLegX = 12 - legSwing * 0.4;  // Back leg swings opposite
                        const frontFootY = 36 - (legSwing > 0 ? legSwing * 0.15 : 0); // Lift when stepping forward
                        const backFootY = 36 - (legSwing < 0 ? Math.abs(legSwing) * 0.15 : 0); // Lift when swinging forward

                        // Determine which leg is in front for layering
                        const frontLegForward = legSwing > 0;

                        const renderBackLeg = () => (
                            <g key="back">
                                <path d={`M13 28 Q${backLegX - 1} 32 ${backLegX - 1} ${backFootY - 1} L${backLegX + 2} ${backFootY - 1} Q${backLegX + 2} 32 15 28`}
                                      fill={colors.pantsShadow} />
                                <ellipse cx={backLegX} cy={backFootY} rx="2.5" ry="1.5" fill={colors.shoes} />
                            </g>
                        );

                        const renderFrontLeg = () => (
                            <g key="front">
                                <path d={`M15 28 Q${frontLegX - 2} 32 ${frontLegX - 2} ${frontFootY - 1} L${frontLegX + 2} ${frontFootY - 1} Q${frontLegX + 2} 32 19 28`}
                                      fill={colors.pants} />
                                <ellipse cx={frontLegX} cy={frontFootY} rx="2.8" ry="1.5" fill={colors.shoes} />
                                <ellipse cx={frontLegX} cy={frontFootY - 0.5} rx="2" ry="0.8" fill={colors.shoesHighlight} />
                            </g>
                        );

                        // Render back leg first when front leg is forward
                        return frontLegForward
                            ? <>{renderBackLeg()}{renderFrontLeg()}</>
                            : <>{renderFrontLeg()}{renderBackLeg()}</>;
                    })()}

                    {/* Coat tail */}
                    <path d={`M7 25 Q4 30 ${5 + coatSway} 36 L${10 + coatSway} 36 Q9 31 10 25`}
                          fill={colors.coat} />

                    {/* Back arm */}
                    <g transform={`rotate(${-armSwing * 0.8} 10 15)`}>
                        <path d="M8 14 L4 25 L6 25 L10 16" fill={colors.coatShadow} />
                        <ellipse cx="5" cy="25.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>

                    {/* Body - morning coat profile */}
                    <path d="M8 12 L8 28 L22 28 L22 12 Q19 11 15 11 Q11 11 8 12 Z" fill="url(#coatGradE)" />

                    {/* Coat back edge */}
                    <path d="M8 12 L8 28 L11 28 L11 14 Q9 13 8 12" fill={colors.coatShadow} />

                    {/* Coat front cutaway */}
                    <path d="M18 14 L20 28 L22 28 L22 12 Q20 12 18 14" fill={colors.coatHighlight} />

                    {/* Lapel from side */}
                    <path d="M18 12 L18 16 L20 16 L21 13 L20 11 Z" fill={colors.coatHighlight} />
                    <path d="M20 11 L21.5 10.5 L21 12" fill={colors.coat} />

                    {/* Vest showing */}
                    <path d="M12 13 L12 27 L19 27 L19 13 Q15.5 12.5 12 13" fill="url(#vestGradE)" />
                    <circle cx="16" cy="16" r="0.4" fill={colors.caneHandle} />
                    <circle cx="16" cy="19" r="0.4" fill={colors.caneHandle} />
                    <circle cx="16" cy="22" r="0.4" fill={colors.caneHandle} />
                    <circle cx="16" cy="25" r="0.4" fill={colors.caneHandle} />

                    {/* Watch chain - side view */}
                    {renderWatchChain(true, false)}

                    {/* Front arm with cane */}
                    <g transform={`rotate(${armSwing * 0.8 + armWindUp + (swingPhase > 0 ? caneSwingRotation * 0.4 : 0)} 20 15)`}>
                        <path d="M20 14 L25 25 L23 25 L19 16" fill={colors.coat} />
                        <line x1="22" y1="18" x2="24" y2="24" stroke={colors.coatHighlight} strokeWidth="0.3" />
                        <ellipse cx="24" cy="25.5" rx="1.5" ry="1" fill={colors.skin} />
                        {/* Cane */}
                        <g transform={`rotate(${caneSwingRotation} 24 25)`}>
                            <line x1="24" y1="25" x2="26" y2="38" stroke={colors.cane} strokeWidth="2" />
                            <line x1="24.2" y1="25" x2="26.2" y2="38" stroke={colors.caneHighlight} strokeWidth="0.5" />
                            <ellipse cx="24" cy="24" rx="1.8" ry="1" fill={colors.caneHandle} />
                            <ellipse cx="26" cy="38" rx="0.6" ry="0.3" fill="#888" />
                        </g>
                    </g>

                    {renderSwingEffects(24, 25, 45)}

                    {/* High collar from side */}
                    <path d="M16 10 L16 13 L20 13 L20 10 Q18 9.5 16 10" fill={colors.collar} />
                    {/* Cravat from side */}
                    <ellipse cx="19" cy="12" rx="1" ry="0.7" fill={colors.tie} />

                    {/* Neck - FIXED: moved back to align with body */}
                    <rect x="14" y="8" width="4" height="4" fill={colors.skin} />

                    {/* Head - FIXED: centered over body, not forward */}
                    <g transform={`translate(0, ${headBob})`}>
                        {/* Head shape - moved back to x=15 from x=17 */}
                        <ellipse cx="15" cy="6" rx="4.5" ry="5" fill={colors.skin} />

                        {/* Nose - proportionally placed */}
                        <path d="M19 5 L21 6.5 L19 7.5" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="0.3" />

                        {/* Eye - FIXED position */}
                        {isBlinking ? (
                            <path d="M16 5 L18 5" stroke={colors.hair} strokeWidth="0.6" fill="none" />
                        ) : (
                            <>
                                <ellipse cx="17" cy="5" rx="1" ry="0.8" fill="white" />
                                <circle cx="17.3" cy="5" r="0.5" fill="#4a3728" />
                                <circle cx="17.3" cy="5" r="0.25" fill="#2a1a0a" />
                                <circle cx="17" cy="4.7" r="0.15" fill="white" opacity="0.8" />
                            </>
                        )}

                        {/* Eyebrow */}
                        <path d="M15.5 4 Q17.5 3.6 19 4" stroke={colors.hair} strokeWidth="0.6" fill="none" />

                        {/* Ear - on back of head */}
                        <ellipse cx="11" cy="6" rx="1" ry="1.5" fill={colors.skin} />
                        <ellipse cx="11" cy="6" rx="0.5" ry="1" fill={colors.skinShadow} opacity="0.3" />

                        {/* Beard profile */}
                        <path d="M17 8 Q20 9 20 10.5 Q19 11.5 17 11.5 Q16 10.5 16 9.5" fill={colors.beard} />

                        {/* Mustache profile */}
                        <ellipse cx="19" cy="7.5" rx="1.2" ry="0.5" fill={colors.beard} />

                        {/* Pince-nez - profile view */}
                        {renderPinceNez(true, false)}

                        {/* Hair from side - adjusted position */}
                        <path d="M10 4 Q12 2 14 2.5 Q14 4 13 5 L11 5 Q10 4.5 10 4" fill={colors.hair} />

                        {/* Top Hat */}
                        {renderTopHat(true, false)}

                        {renderThoughtBubble()}
                        {renderSittingBubble()}
                        {renderFireEffect()}
                    </g>
                </svg>
            </div>
        );
    }

    // West-facing (left profile) - FIXED: head position corrected (mirrored from East)
    return (
        <div className={`relative w-full h-full flex items-center justify-center ${className}`}
             style={{ transform: `translateY(${-bounce}px)` }}>
            <svg viewBox="0 0 32 40" className="w-10 h-12 overflow-visible drop-shadow-lg">
                <defs>
                    <linearGradient id="coatGradW" x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor={colors.coatShadow} />
                        <stop offset="40%" stopColor={colors.coat} />
                        <stop offset="100%" stopColor={colors.coatHighlight} />
                    </linearGradient>
                    <linearGradient id="vestGradW" x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor={colors.vestDark} />
                        <stop offset="100%" stopColor={colors.vest} />
                    </linearGradient>
                </defs>

                {/* Shadow */}
                <ellipse cx={16 - coatSway * 0.5} cy="39" rx={8 + bounce * 0.3} ry={2 - bounce * 0.1} fill="rgba(0,0,0,0.25)" />

                {/* Legs - side view walking animation (mirrored from East) */}
                {(() => {
                    // For West-facing: negative legSwing = stepping forward (left), positive = stepping back
                    const frontLegX = 14 - legSwing * 0.4; // Front leg swings forward/back
                    const backLegX = 20 + legSwing * 0.4;  // Back leg swings opposite
                    const frontFootY = 36 - (legSwing < 0 ? Math.abs(legSwing) * 0.15 : 0); // Lift when stepping forward
                    const backFootY = 36 - (legSwing > 0 ? legSwing * 0.15 : 0); // Lift when swinging forward

                    // Determine which leg is in front for layering
                    const frontLegForward = legSwing < 0;

                    const renderBackLeg = () => (
                        <g key="back">
                            <path d={`M19 28 Q${backLegX + 1} 32 ${backLegX + 1} ${backFootY - 1} L${backLegX - 2} ${backFootY - 1} Q${backLegX - 2} 32 17 28`}
                                  fill={colors.pantsShadow} />
                            <ellipse cx={backLegX} cy={backFootY} rx="2.5" ry="1.5" fill={colors.shoes} />
                        </g>
                    );

                    const renderFrontLeg = () => (
                        <g key="front">
                            <path d={`M17 28 Q${frontLegX + 2} 32 ${frontLegX + 2} ${frontFootY - 1} L${frontLegX - 2} ${frontFootY - 1} Q${frontLegX - 2} 32 13 28`}
                                  fill={colors.pants} />
                            <ellipse cx={frontLegX} cy={frontFootY} rx="2.8" ry="1.5" fill={colors.shoes} />
                            <ellipse cx={frontLegX} cy={frontFootY - 0.5} rx="2" ry="0.8" fill={colors.shoesHighlight} />
                        </g>
                    );

                    // Render back leg first when front leg is forward
                    return frontLegForward
                        ? <>{renderBackLeg()}{renderFrontLeg()}</>
                        : <>{renderFrontLeg()}{renderBackLeg()}</>;
                })()}

                {/* Coat tail */}
                <path d={`M25 25 Q28 30 ${27 - coatSway} 36 L${22 - coatSway} 36 Q23 31 22 25`}
                      fill={colors.coat} />

                {/* Back arm */}
                <g transform={`rotate(${armSwing * 0.8} 22 15)`}>
                    <path d="M24 14 L28 25 L26 25 L22 16" fill={colors.coatShadow} />
                    <ellipse cx="27" cy="25.5" rx="1.5" ry="1" fill={colors.skin} />
                </g>

                {/* Body - morning coat profile */}
                <path d="M24 12 L24 28 L10 28 L10 12 Q13 11 17 11 Q21 11 24 12 Z" fill="url(#coatGradW)" />

                {/* Coat back edge */}
                <path d="M24 12 L24 28 L21 28 L21 14 Q23 13 24 12" fill={colors.coatShadow} />

                {/* Coat front cutaway */}
                <path d="M14 14 L12 28 L10 28 L10 12 Q12 12 14 14" fill={colors.coatHighlight} />

                {/* Lapel from side */}
                <path d="M14 12 L14 16 L12 16 L11 13 L12 11 Z" fill={colors.coatHighlight} />
                <path d="M12 11 L10.5 10.5 L11 12" fill={colors.coat} />

                {/* Vest showing */}
                <path d="M20 13 L20 27 L13 27 L13 13 Q16.5 12.5 20 13" fill="url(#vestGradW)" />
                <circle cx="16" cy="16" r="0.4" fill={colors.caneHandle} />
                <circle cx="16" cy="19" r="0.4" fill={colors.caneHandle} />
                <circle cx="16" cy="22" r="0.4" fill={colors.caneHandle} />
                <circle cx="16" cy="25" r="0.4" fill={colors.caneHandle} />

                {/* Watch chain - side view */}
                {renderWatchChain(true, true)}

                {/* Front arm with cane */}
                <g transform={`rotate(${-armSwing * 0.8 - armWindUp - (swingPhase > 0 ? caneSwingRotation * 0.4 : 0)} 12 15)`}>
                    <path d="M12 14 L7 25 L9 25 L13 16" fill={colors.coat} />
                    <line x1="10" y1="18" x2="8" y2="24" stroke={colors.coatHighlight} strokeWidth="0.3" />
                    <ellipse cx="8" cy="25.5" rx="1.5" ry="1" fill={colors.skin} />
                    {/* Cane */}
                    <g transform={`rotate(${-caneSwingRotation} 8 25)`}>
                        <line x1="8" y1="25" x2="6" y2="38" stroke={colors.cane} strokeWidth="2" />
                        <line x1="7.8" y1="25" x2="5.8" y2="38" stroke={colors.caneHighlight} strokeWidth="0.5" />
                        <ellipse cx="8" cy="24" rx="1.8" ry="1" fill={colors.caneHandle} />
                        <ellipse cx="6" cy="38" rx="0.6" ry="0.3" fill="#888" />
                    </g>
                </g>

                {renderSwingEffects(8, 25, 135, true)}

                {/* High collar from side */}
                <path d="M16 10 L16 13 L12 13 L12 10 Q14 9.5 16 10" fill={colors.collar} />
                {/* Cravat from side */}
                <ellipse cx="13" cy="12" rx="1" ry="0.7" fill={colors.tie} />

                {/* Neck - FIXED position */}
                <rect x="14" y="8" width="4" height="4" fill={colors.skin} />

                {/* Head - FIXED: centered over body */}
                <g transform={`translate(0, ${headBob})`}>
                    {/* Head shape - moved back to x=17 from x=15 */}
                    <ellipse cx="17" cy="6" rx="4.5" ry="5" fill={colors.skin} />

                    {/* Nose */}
                    <path d="M13 5 L11 6.5 L13 7.5" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="0.3" />

                    {/* Eye */}
                    {isBlinking ? (
                        <path d="M14 5 L16 5" stroke={colors.hair} strokeWidth="0.6" fill="none" />
                    ) : (
                        <>
                            <ellipse cx="15" cy="5" rx="1" ry="0.8" fill="white" />
                            <circle cx="14.7" cy="5" r="0.5" fill="#4a3728" />
                            <circle cx="14.7" cy="5" r="0.25" fill="#2a1a0a" />
                            <circle cx="15" cy="4.7" r="0.15" fill="white" opacity="0.8" />
                        </>
                    )}

                    {/* Eyebrow */}
                    <path d="M16.5 4 Q14.5 3.6 13 4" stroke={colors.hair} strokeWidth="0.6" fill="none" />

                    {/* Ear */}
                    <ellipse cx="21" cy="6" rx="1" ry="1.5" fill={colors.skin} />
                    <ellipse cx="21" cy="6" rx="0.5" ry="1" fill={colors.skinShadow} opacity="0.3" />

                    {/* Beard profile */}
                    <path d="M15 8 Q12 9 12 10.5 Q13 11.5 15 11.5 Q16 10.5 16 9.5" fill={colors.beard} />

                    {/* Mustache profile */}
                    <ellipse cx="13" cy="7.5" rx="1.2" ry="0.5" fill={colors.beard} />

                    {/* Pince-nez - profile view (flipped) */}
                    {renderPinceNez(true, true)}

                    {/* Hair from side */}
                    <path d="M22 4 Q20 2 18 2.5 Q18 4 19 5 L21 5 Q22 4.5 22 4" fill={colors.hair} />

                    {/* Top Hat */}
                    {renderTopHat(true, true)}

                    {renderThoughtBubble()}
                    {renderSittingBubble()}
                    {renderFireEffect()}
                </g>
            </svg>
        </div>
    );
};

// Memoize to prevent re-renders when props haven't changed
// Note: x and y changes should trigger re-render for walk animation
export default React.memo(PlayerSprite, (prev, next) => {
    return (
        prev.direction === next.direction &&
        prev.x === next.x &&
        prev.y === next.y &&
        prev.isSitting === next.isSitting &&
        prev.isSwinging === next.isSwinging &&
        prev.swingPower === next.swingPower &&
        prev.isCharging === next.isCharging &&
        prev.pinceNez === next.pinceNez &&
        prev.nearbyObjectCount === next.nearbyObjectCount &&
        prev.isOnFire === next.isOnFire &&
        prev.className === next.className &&
        prev.clothing?.hat === next.clothing?.hat &&
        prev.clothing?.coat === next.clothing?.coat &&
        prev.clothing?.vest === next.clothing?.vest
    );
});
