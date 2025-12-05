
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

    // Swing animation
    useEffect(() => {
        if (isSwinging) {
            setSwingPhase(0);
            const startTime = Date.now();
            const duration = 300 - (swingPower * 0.8);
            const particleCount = Math.floor(1 + (swingPower / 25));

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeStrength = 2.5 + (swingPower / 50);
                const eased = progress < 0.4
                    ? easeStrength * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 8;

                setSwingPhase(eased);

                if (progress < 0.7 && progress > 0.1) {
                    const sparkColors = swingPower > 66
                        ? ['#FFD700', '#FFFFFF', '#FFA500', '#FF6347', '#FFE4B5', '#FFFF00']
                        : swingPower > 33
                            ? ['#FFD700', '#FFA500', '#FF6347', '#FFE4B5']
                            : ['#87CEEB', '#4682B4', '#B0C4DE'];
                    const newParticles: typeof swingParticles = [];

                    for (let i = 0; i < particleCount; i++) {
                        const angle = (Math.random() - 0.5) * Math.PI;
                        const speed = (2 + Math.random() * 4) * (0.5 + swingPower / 100);
                        newParticles.push({
                            id: particleIdRef.current++,
                            x: 0,
                            y: 0,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed - 2,
                            life: 15 + Math.random() * 10 + (swingPower / 10),
                            size: (1 + Math.random() * 2) * (0.7 + swingPower / 150),
                            color: sparkColors[Math.floor(Math.random() * sparkColors.length)]
                        });
                    }

                    setSwingParticles(prev => [...prev, ...newParticles]);
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setTimeout(() => setSwingPhase(0), 100);
                }
            };

            requestAnimationFrame(animate);
        }
    }, [isSwinging, swingPower]);

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

    // Render swing arc trail and particles
    const renderSwingEffects = (pivotX: number, pivotY: number, baseAngle: number, flipX: boolean = false) => {
        if (swingPhase === 0 && swingParticles.length === 0) return null;

        const swingArc = swingPhase * swingArcDegrees - swingArcDegrees / 2;
        const currentAngle = baseAngle + swingArc;
        const arcLength = 16 + (swingPower / 10);
        const trailColor = swingPower > 66 ? '#FFD700' : swingPower > 33 ? '#FFA500' : '#87CEEB';
        const trailOpacityMult = 0.4 + (swingPower / 150);

        return (
            <g transform={`translate(${pivotX}, ${pivotY})${flipX ? ' scale(-1, 1)' : ''}`}>
                {swingPhase > 0.1 && swingPhase < 0.9 && (
                    <>
                        {[0.2, 0.4, 0.6, 0.8].map((offset, i) => {
                            const trailAngle = currentAngle - offset * (30 + swingPower * 0.2) * swingPhase;
                            const trailRad = (trailAngle) * Math.PI / 180;
                            const opacity = (1 - offset) * trailOpacityMult * (1 - Math.abs(swingPhase - 0.5) * 2);

                            return (
                                <line
                                    key={i}
                                    x1={0}
                                    y1={0}
                                    x2={Math.cos(trailRad) * arcLength}
                                    y2={Math.sin(trailRad) * arcLength}
                                    stroke={trailColor}
                                    strokeWidth={(2 + swingPower / 40) - i * 0.5}
                                    opacity={opacity}
                                    strokeLinecap="round"
                                    style={{ filter: `blur(${i}px)` }}
                                />
                            );
                        })}

                        <line
                            x1={0}
                            y1={0}
                            x2={Math.cos((currentAngle - 10) * Math.PI / 180) * arcLength}
                            y2={Math.sin((currentAngle - 10) * Math.PI / 180) * arcLength}
                            stroke="#FFFFFF"
                            strokeWidth={1.5 + swingPower / 80}
                            opacity={(0.6 + swingPower / 200) * (1 - Math.abs(swingPhase - 0.5) * 2)}
                            strokeLinecap="round"
                        />
                    </>
                )}

                {swingPhase > 0.4 && swingPhase < 0.6 && (
                    <circle
                        cx={Math.cos(currentAngle * Math.PI / 180) * arcLength}
                        cy={Math.sin(currentAngle * Math.PI / 180) * arcLength}
                        r={(4 + swingPower / 15) + swingPhase * (3 + swingPower / 25)}
                        fill={swingPower > 66 ? '#FFD700' : '#FFFFFF'}
                        opacity={(0.6 + swingPower / 250) - Math.abs(swingPhase - 0.5) * 4}
                        style={{ filter: `blur(${1 + swingPower / 50}px)` }}
                    />
                )}

                {swingParticles.map(p => (
                    <g key={p.id} transform={`translate(${p.x + Math.cos(currentAngle * Math.PI / 180) * 12}, ${p.y + Math.sin(currentAngle * Math.PI / 180) * 12})`}>
                        <polygon
                            points={`0,${-p.size} ${p.size * 0.6},0 0,${p.size} ${-p.size * 0.6},0`}
                            fill={p.color}
                            opacity={p.life / 25}
                        />
                    </g>
                ))}

                {swingPhase > 0.2 && swingPhase < 0.7 && (
                    <>
                        {[0, 1, 2].map(i => {
                            const lineAngle = currentAngle - 20 - i * 12;
                            const lineRad = lineAngle * Math.PI / 180;
                            const lineStart = 8 + i * 3;
                            const lineEnd = 14 + i * 2;

                            return (
                                <line
                                    key={i}
                                    x1={Math.cos(lineRad) * lineStart}
                                    y1={Math.sin(lineRad) * lineStart}
                                    x2={Math.cos(lineRad) * lineEnd}
                                    y2={Math.sin(lineRad) * lineEnd}
                                    stroke="#FFD700"
                                    strokeWidth={2 - i * 0.4}
                                    opacity={0.7 - i * 0.2}
                                    strokeLinecap="round"
                                />
                            );
                        })}
                    </>
                )}
            </g>
        );
    };

    // Calculate cane swing rotation
    const swingArcDegrees = 80 + (swingPower * 0.6);
    const caneSwingRotation = swingPhase > 0 ? (swingPhase * swingArcDegrees - swingArcDegrees / 2) : 0;

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
                    <g transform={`rotate(${-armSwing + (swingPhase > 0 ? caneSwingRotation * 0.3 : 0)} 23 15)`}>
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
                    <g transform={`rotate(${armSwing + (swingPhase > 0 ? caneSwingRotation * 0.3 : 0)} 23 15)`}>
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
                    <g transform={`rotate(${armSwing * 0.8 + (swingPhase > 0 ? caneSwingRotation * 0.4 : 0)} 20 15)`}>
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
                <g transform={`rotate(${-armSwing * 0.8 - (swingPhase > 0 ? caneSwingRotation * 0.4 : 0)} 12 15)`}>
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
        prev.className === next.className &&
        prev.clothing?.hat === next.clothing?.hat &&
        prev.clothing?.coat === next.clothing?.coat &&
        prev.clothing?.vest === next.clothing?.vest
    );
});
