
import React, { useEffect, useState } from 'react';

interface PlayerSpriteProps {
    direction: 'N' | 'S' | 'E' | 'W';
    className?: string;
}

// Henry James - 1889 Paris Exposition
// Historically accurate: Age 46, trimmed beard/goatee, formal morning coat, top hat
// Known for his meticulous appearance, portly figure, and distinguished bearing

const PlayerSprite: React.FC<PlayerSpriteProps> = ({ direction, className }) => {
    const [tick, setTick] = useState(0);
    const [isMoving, setIsMoving] = useState(false);

    useEffect(() => {
        setIsMoving(true);
        const timer = setTimeout(() => setIsMoving(false), 300);
        return () => clearTimeout(timer);
    }, [direction]);

    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 100);
        return () => clearInterval(interval);
    }, []);

    // Improved animation values - smoother, more natural walking cycle
    const walkPhase = tick * 0.4;
    const bounce = isMoving ? Math.abs(Math.sin(walkPhase)) * 2 : 0;
    const legSwing = isMoving ? Math.sin(walkPhase) * 15 : 0;
    const armSwing = isMoving ? Math.sin(walkPhase) * 10 : 0;
    const coatSway = isMoving ? Math.sin(walkPhase * 0.8) * 3 : 0;
    const shoulderTilt = isMoving ? Math.sin(walkPhase) * 1.5 : 0;
    const headBob = isMoving ? Math.sin(walkPhase * 2) * 0.5 : 0;

    // Colors - Henry James's typical 1889 attire
    const colors = {
        skin: '#f5deb3',
        skinShadow: '#d4b896',
        hair: '#4a3728',
        beard: '#5d4a3a',
        coat: '#1a1a2e',
        coatMid: '#252538',
        coatHighlight: '#353548',
        coatShadow: '#12121f',
        vest: '#8b7355',
        vestDark: '#6d5a44',
        vestLight: '#a08565',
        shirt: '#f5f5f0',
        collar: '#ffffff',
        tie: '#722f37',
        tieDark: '#5a252c',
        pants: '#2d2d2d',
        pantsShadow: '#1f1f1f',
        shoes: '#1a1a1a',
        shoesHighlight: '#2a2a2a',
        hat: '#1a1a1a',
        hatHighlight: '#2a2a2a',
        hatBand: '#8b7355',
        cane: '#8b4513',
        caneHighlight: '#a05a1a',
        caneHandle: '#d4af37',
    };

    // South-facing (front view)
    if (direction === 'S') {
        return (
            <div className={`relative w-full h-full flex items-center justify-center ${className}`}
                 style={{ transform: `translateY(${-bounce}px)` }}>
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

                    {/* Shadow on ground - moves with walking */}
                    <ellipse cx={16 + coatSway * 0.3} cy="39" rx={8 + bounce * 0.3} ry={2 - bounce * 0.1} fill="rgba(0,0,0,0.25)" />

                    {/* Legs with proper walking animation */}
                    <g>
                        {/* Left leg */}
                        <path d={`M11 28
                                  L${10.5 - legSwing * 0.25} 35
                                  L${14.5 - legSwing * 0.25} 35
                                  L15 28`}
                              fill="url(#pantsGradS)" />
                        {/* Left leg crease */}
                        <line x1={12.5 - legSwing * 0.25} y1="29"
                              x2={12.5 - legSwing * 0.25} y2="34"
                              stroke={colors.pantsShadow} strokeWidth="0.3" />
                        {/* Left shoe */}
                        <ellipse cx={12.5 - legSwing * 0.25} cy="36" rx="2.8" ry="1.5" fill={colors.shoes} />
                        <ellipse cx={12.5 - legSwing * 0.25} cy="35.5" rx="2" ry="0.8" fill={colors.shoesHighlight} />

                        {/* Right leg */}
                        <path d={`M17 28
                                  L${17.5 + legSwing * 0.25} 35
                                  L${21.5 + legSwing * 0.25} 35
                                  L21 28`}
                              fill="url(#pantsGradS)" />
                        {/* Right leg crease */}
                        <line x1={19.5 + legSwing * 0.25} y1="29"
                              x2={19.5 + legSwing * 0.25} y2="34"
                              stroke={colors.pantsShadow} strokeWidth="0.3" />
                        {/* Right shoe */}
                        <ellipse cx={19.5 + legSwing * 0.25} cy="36" rx="2.8" ry="1.5" fill={colors.shoes} />
                        <ellipse cx={19.5 + legSwing * 0.25} cy="35.5" rx="2" ry="0.8" fill={colors.shoesHighlight} />
                    </g>

                    {/* Morning Coat tails - sway with movement */}
                    <path d={`M9 27 Q7 31 ${7 + coatSway} 36 L${11 + coatSway} 36 Q10 31 11 27`}
                          fill={colors.coatShadow} />
                    <path d={`M21 27 Q22 31 ${25 - coatSway} 36 L${21 - coatSway} 36 Q22 31 21 27`}
                          fill={colors.coatShadow} />

                    {/* Body/Coat - proper morning coat cut */}
                    <g transform={`rotate(${shoulderTilt} 16 20)`}>
                        {/* Main coat body */}
                        <path d="M7 14 Q7 12 12 11.5 L20 11.5 Q25 12 25 14 L25 28 L7 28 Z"
                              fill="url(#coatGradS)" />

                        {/* Coat front edges - cutaway style */}
                        <path d="M7 14 L7 28 L9 28 L12 20 L12 14 Q9 13 7 14" fill={colors.coatShadow} />
                        <path d="M25 14 L25 28 L23 28 L20 20 L20 14 Q23 13 25 14" fill={colors.coatShadow} />

                        {/* Lapels - peaked lapels typical of morning coat */}
                        <path d="M12 11.5 L12 14 L14 19 L13 19 L11 14 L11 12 Z" fill={colors.coatHighlight} />
                        <path d="M20 11.5 L20 14 L18 19 L19 19 L21 14 L21 12 Z" fill={colors.coatHighlight} />

                        {/* Lapel notches */}
                        <path d="M11.5 12 L10 11 L11 13" fill={colors.coat} stroke={colors.coatShadow} strokeWidth="0.2" />
                        <path d="M20.5 12 L22 11 L21 13" fill={colors.coat} stroke={colors.coatShadow} strokeWidth="0.2" />

                        {/* Vest visible under coat */}
                        <path d="M13 14 L13 27 L19 27 L19 14 Q16 13 13 14" fill="url(#vestGradS)" />

                        {/* Vest details */}
                        <line x1="16" y1="14" x2="16" y2="27" stroke={colors.vestDark} strokeWidth="0.3" />

                        {/* Vest buttons */}
                        <circle cx="16" cy="16" r="0.5" fill={colors.caneHandle} />
                        <circle cx="16" cy="19" r="0.5" fill={colors.caneHandle} />
                        <circle cx="16" cy="22" r="0.5" fill={colors.caneHandle} />
                        <circle cx="16" cy="25" r="0.5" fill={colors.caneHandle} />

                        {/* Shirt front visible */}
                        <path d="M14.5 12 L14.5 14 L17.5 14 L17.5 12 Q16 11.5 14.5 12" fill={colors.shirt} />

                        {/* High starched collar points */}
                        <path d="M13 11 L14.5 13 L14.5 11.5" fill={colors.collar} />
                        <path d="M19 11 L17.5 13 L17.5 11.5" fill={colors.collar} />

                        {/* Cravat/Ascot */}
                        <path d="M14.5 12.5 Q16 14 17.5 12.5 L17 15.5 L16 14.5 L15 15.5 Z" fill={colors.tie} />
                        <ellipse cx="16" cy="13" rx="1.2" ry="0.6" fill={colors.tie} />
                        <circle cx="16" cy="13" r="0.4" fill={colors.caneHandle} opacity="0.7" />
                    </g>

                    {/* Arms with natural swing */}
                    <g transform={`rotate(${armSwing} 9 15)`}>
                        <path d="M7 14 L3 25 L5.5 25 L9 16" fill={colors.coat} />
                        <line x1="6" y1="18" x2="4.5" y2="24" stroke={colors.coatShadow} strokeWidth="0.3" />
                        <ellipse cx="4.2" cy="25.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>
                    <g transform={`rotate(${-armSwing} 23 15)`}>
                        <path d="M25 14 L29 25 L26.5 25 L23 16" fill={colors.coat} />
                        <line x1="26" y1="18" x2="27.5" y2="24" stroke={colors.coatShadow} strokeWidth="0.3" />
                        <ellipse cx="27.8" cy="25.5" rx="1.5" ry="1" fill={colors.skin} />
                        {/* Cane */}
                        <line x1="27.5" y1="25" x2="28" y2="38" stroke={colors.cane} strokeWidth="1.8" />
                        <line x1="27.7" y1="25" x2="28.2" y2="38" stroke={colors.caneHighlight} strokeWidth="0.4" />
                        <ellipse cx="27.5" cy="24" rx="1.8" ry="1" fill={colors.caneHandle} />
                    </g>

                    {/* Neck */}
                    <rect x="14" y="9" width="4" height="3" fill={colors.skin} />

                    {/* Head with subtle bob */}
                    <g transform={`translate(0, ${headBob})`}>
                        <ellipse cx="16" cy="7" rx="5" ry="4.5" fill={colors.skin} />

                        {/* Hair on sides */}
                        <path d="M11 5 Q11 8 12 9" fill="none" stroke={colors.hair} strokeWidth="1.5" />
                        <path d="M21 5 Q21 8 20 9" fill="none" stroke={colors.hair} strokeWidth="1.5" />

                        {/* Eyes */}
                        <ellipse cx="14" cy="6.5" rx="1" ry="0.8" fill="white" />
                        <ellipse cx="18" cy="6.5" rx="1" ry="0.8" fill="white" />
                        <circle cx="14" cy="6.5" r="0.5" fill="#4a3728" />
                        <circle cx="18" cy="6.5" r="0.5" fill="#4a3728" />

                        {/* Eyebrows */}
                        <path d="M13 5.5 L15 5.3" stroke={colors.hair} strokeWidth="0.5" fill="none" />
                        <path d="M17 5.3 L19 5.5" stroke={colors.hair} strokeWidth="0.5" fill="none" />

                        {/* Nose */}
                        <path d="M16 6.5 L16 8.5 L15.5 9" fill="none" stroke={colors.skinShadow} strokeWidth="0.5" />

                        {/* Mouth */}
                        <path d="M14.5 9.5 Q16 10 17.5 9.5" fill="none" stroke={colors.skinShadow} strokeWidth="0.3" />

                        {/* Neat trimmed beard */}
                        <path d="M13.5 10 Q13 11 14 11.8 Q16 12.3 18 11.8 Q19 11 18.5 10" fill={colors.beard} />

                        {/* Mustache */}
                        <path d="M13.5 9.2 Q16 10 18.5 9.2" fill={colors.beard} />
                        <ellipse cx="16" cy="9.5" rx="2" ry="0.5" fill={colors.beard} />

                        {/* Ears */}
                        <ellipse cx="11" cy="7" rx="0.8" ry="1.2" fill={colors.skin} />
                        <ellipse cx="21" cy="7" rx="0.8" ry="1.2" fill={colors.skin} />

                        {/* Top Hat */}
                        <ellipse cx="16" cy="2.5" rx="6" ry="1.5" fill={colors.hat} />
                        <rect x="12" y="-4" width="8" height="7" fill={colors.hat} />
                        <path d="M12 -4 L12 3 L13 3 L13 -3" fill={colors.hatHighlight} opacity="0.3" />
                        <ellipse cx="16" cy="-4" rx="4" ry="1" fill={colors.hatHighlight} />
                        <rect x="12" y="1.5" width="8" height="1" fill={colors.hatBand} />
                    </g>
                </svg>
            </div>
        );
    }

    // North-facing (back view)
    if (direction === 'N') {
        return (
            <div className={`relative w-full h-full flex items-center justify-center ${className}`}
                 style={{ transform: `translateY(${-bounce}px)` }}>
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

                    {/* Morning coat tails - prominent from back, proper cutaway shape */}
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

                        {/* Back seam */}
                        <line x1="16" y1="11" x2="16" y2="28" stroke={colors.coatShadow} strokeWidth="0.5" />

                        {/* Shoulder seams */}
                        <path d="M7 13 Q10 12 12 14" fill="none" stroke={colors.coatShadow} strokeWidth="0.3" />
                        <path d="M25 13 Q22 12 20 14" fill="none" stroke={colors.coatShadow} strokeWidth="0.3" />

                        {/* Back waist seam */}
                        <path d="M8 22 Q16 21 24 22" fill="none" stroke={colors.coatShadow} strokeWidth="0.4" />
                    </g>

                    {/* Arms */}
                    <g transform={`rotate(${-armSwing} 9 15)`}>
                        <path d="M7 14 L3 25 L5.5 25 L9 16" fill={colors.coat} />
                        <ellipse cx="4.2" cy="25.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>
                    <g transform={`rotate(${armSwing} 23 15)`}>
                        <path d="M25 14 L29 25 L26.5 25 L23 16" fill={colors.coat} />
                        <ellipse cx="27.8" cy="25.5" rx="1.5" ry="1" fill={colors.skin} />
                        <line x1="27.5" y1="25" x2="28" y2="38" stroke={colors.cane} strokeWidth="1.8" />
                        <ellipse cx="27.5" cy="24" rx="1.8" ry="1" fill={colors.caneHandle} />
                    </g>

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
                        <ellipse cx="16" cy="2.5" rx="6" ry="1.5" fill={colors.hat} />
                        <rect x="12" y="-4" width="8" height="7" fill={colors.hat} />
                        <ellipse cx="16" cy="-4" rx="4" ry="1" fill={colors.hatHighlight} />
                        <rect x="12" y="1.5" width="8" height="1" fill={colors.hatBand} />
                    </g>
                </svg>
            </div>
        );
    }

    // East-facing (right profile)
    if (direction === 'E') {
        return (
            <div className={`relative w-full h-full flex items-center justify-center ${className}`}
                 style={{ transform: `translateY(${-bounce}px)` }}>
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

                    {/* Back leg */}
                    <path d={`M11 28 L${10 - legSwing * 0.3} 35 L${14 - legSwing * 0.3} 35 L15 28`}
                          fill={colors.pantsShadow} />
                    <ellipse cx={12 - legSwing * 0.3} cy="36" rx="2.5" ry="1.5" fill={colors.shoes} />

                    {/* Front leg */}
                    <path d={`M15 28 L${16 + legSwing * 0.3} 35 L${20 + legSwing * 0.3} 35 L19 28`}
                          fill={colors.pants} />
                    <ellipse cx={18 + legSwing * 0.3} cy="36" rx="2.8" ry="1.5" fill={colors.shoes} />
                    <ellipse cx={18 + legSwing * 0.3} cy="35.5" rx="2" ry="0.8" fill={colors.shoesHighlight} />

                    {/* Coat tail */}
                    <path d={`M7 25 Q4 30 ${5 + coatSway} 36 L${10 + coatSway} 36 Q9 31 10 25`}
                          fill={colors.coat} />

                    {/* Back arm */}
                    <g transform={`rotate(${-armSwing * 0.8} 10 15)`}>
                        <path d="M8 14 L4 25 L6 25 L10 16" fill={colors.coatShadow} />
                        <ellipse cx="5" cy="25.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>

                    {/* Body - side profile morning coat */}
                    <path d="M7 12 L7 28 L23 28 L23 12 Q20 11 15 11 Q10 11 7 12 Z" fill="url(#coatGradE)" />

                    {/* Coat back edge */}
                    <path d="M7 12 L7 28 L10 28 L10 14 Q8 13 7 12" fill={colors.coatShadow} />

                    {/* Coat front cutaway edge */}
                    <path d="M19 14 L21 28 L23 28 L23 12 Q21 12 19 14" fill={colors.coatHighlight} />

                    {/* Lapel from side */}
                    <path d="M19 12 L19 16 L21 16 L22 13 L21 11 Z" fill={colors.coatHighlight} />
                    <path d="M21 11 L22.5 10.5 L22 12" fill={colors.coat} />

                    {/* Vest showing */}
                    <path d="M12 13 L12 27 L20 27 L20 13 Q16 12.5 12 13" fill="url(#vestGradE)" />
                    <circle cx="17" cy="16" r="0.4" fill={colors.caneHandle} />
                    <circle cx="17" cy="19" r="0.4" fill={colors.caneHandle} />
                    <circle cx="17" cy="22" r="0.4" fill={colors.caneHandle} />
                    <circle cx="17" cy="25" r="0.4" fill={colors.caneHandle} />

                    {/* Front arm with cane */}
                    <g transform={`rotate(${armSwing * 0.8} 21 15)`}>
                        <path d="M21 14 L26 25 L24 25 L20 16" fill={colors.coat} />
                        <line x1="23" y1="18" x2="25" y2="24" stroke={colors.coatHighlight} strokeWidth="0.3" />
                        <ellipse cx="25" cy="25.5" rx="1.5" ry="1" fill={colors.skin} />
                        {/* Cane */}
                        <line x1="25" y1="25" x2="27" y2="38" stroke={colors.cane} strokeWidth="2" />
                        <line x1="25.2" y1="25" x2="27.2" y2="38" stroke={colors.caneHighlight} strokeWidth="0.5" />
                        <ellipse cx="25" cy="24" rx="1.8" ry="1" fill={colors.caneHandle} />
                    </g>

                    {/* High collar from side */}
                    <path d="M17 10 L17 13 L21 13 L21 10 Q19 9.5 17 10" fill={colors.collar} />
                    {/* Cravat from side */}
                    <ellipse cx="20" cy="12" rx="1" ry="0.7" fill={colors.tie} />

                    {/* Neck */}
                    <rect x="15" y="8" width="4" height="4" fill={colors.skin} />

                    {/* Head - profile */}
                    <g transform={`translate(0, ${headBob})`}>
                        <ellipse cx="17" cy="6" rx="4.5" ry="5" fill={colors.skin} />

                        {/* Nose */}
                        <path d="M21 5 L23 6.5 L21 7.5" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="0.3" />

                        {/* Eye */}
                        <ellipse cx="19" cy="5" rx="1" ry="0.8" fill="white" />
                        <circle cx="19.3" cy="5" r="0.5" fill="#4a3728" />

                        {/* Eyebrow */}
                        <path d="M18 4 L20.5 3.8" stroke={colors.hair} strokeWidth="0.6" fill="none" />

                        {/* Ear */}
                        <ellipse cx="13" cy="6" rx="1" ry="1.5" fill={colors.skin} />
                        <ellipse cx="13" cy="6" rx="0.5" ry="1" fill={colors.skinShadow} />

                        {/* Beard profile */}
                        <path d="M19 8 Q22 9 22 10.5 Q21 11.5 19 11.5 Q18 10.5 18 9.5" fill={colors.beard} />

                        {/* Mustache profile */}
                        <ellipse cx="21" cy="7.5" rx="1.2" ry="0.5" fill={colors.beard} />

                        {/* Hair from side */}
                        <path d="M12 4 Q14 2 16 2.5 Q16 4 15 5 L13 5 Q12 4.5 12 4" fill={colors.hair} />

                        {/* Top Hat profile */}
                        <ellipse cx="16" cy="2" rx="5.5" ry="1.3" fill={colors.hat} />
                        <rect x="12" y="-4" width="8" height="6" fill={colors.hat} />
                        <path d="M12 -4 L12 2 L13 2 L13 -3" fill={colors.hatHighlight} opacity="0.3" />
                        <ellipse cx="16" cy="-4" rx="4" ry="1" fill={colors.hatHighlight} />
                        <rect x="11" y="1" width="10" height="0.8" fill={colors.hatBand} />
                    </g>
                </svg>
            </div>
        );
    }

    // West-facing (left profile)
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

                {/* Back leg */}
                <path d={`M21 28 L${22 + legSwing * 0.3} 35 L${18 + legSwing * 0.3} 35 L17 28`}
                      fill={colors.pantsShadow} />
                <ellipse cx={20 + legSwing * 0.3} cy="36" rx="2.5" ry="1.5" fill={colors.shoes} />

                {/* Front leg */}
                <path d={`M17 28 L${16 - legSwing * 0.3} 35 L${12 - legSwing * 0.3} 35 L13 28`}
                      fill={colors.pants} />
                <ellipse cx={14 - legSwing * 0.3} cy="36" rx="2.8" ry="1.5" fill={colors.shoes} />
                <ellipse cx={14 - legSwing * 0.3} cy="35.5" rx="2" ry="0.8" fill={colors.shoesHighlight} />

                {/* Coat tail */}
                <path d={`M25 25 Q28 30 ${27 - coatSway} 36 L${22 - coatSway} 36 Q23 31 22 25`}
                      fill={colors.coat} />

                {/* Back arm */}
                <g transform={`rotate(${armSwing * 0.8} 22 15)`}>
                    <path d="M24 14 L28 25 L26 25 L22 16" fill={colors.coatShadow} />
                    <ellipse cx="27" cy="25.5" rx="1.5" ry="1" fill={colors.skin} />
                </g>

                {/* Body - side profile morning coat */}
                <path d="M25 12 L25 28 L9 28 L9 12 Q12 11 17 11 Q22 11 25 12 Z" fill="url(#coatGradW)" />

                {/* Coat back edge */}
                <path d="M25 12 L25 28 L22 28 L22 14 Q24 13 25 12" fill={colors.coatShadow} />

                {/* Coat front cutaway edge */}
                <path d="M13 14 L11 28 L9 28 L9 12 Q11 12 13 14" fill={colors.coatHighlight} />

                {/* Lapel from side */}
                <path d="M13 12 L13 16 L11 16 L10 13 L11 11 Z" fill={colors.coatHighlight} />
                <path d="M11 11 L9.5 10.5 L10 12" fill={colors.coat} />

                {/* Vest showing */}
                <path d="M20 13 L20 27 L12 27 L12 13 Q16 12.5 20 13" fill="url(#vestGradW)" />
                <circle cx="15" cy="16" r="0.4" fill={colors.caneHandle} />
                <circle cx="15" cy="19" r="0.4" fill={colors.caneHandle} />
                <circle cx="15" cy="22" r="0.4" fill={colors.caneHandle} />
                <circle cx="15" cy="25" r="0.4" fill={colors.caneHandle} />

                {/* Front arm with cane */}
                <g transform={`rotate(${-armSwing * 0.8} 11 15)`}>
                    <path d="M11 14 L6 25 L8 25 L12 16" fill={colors.coat} />
                    <line x1="9" y1="18" x2="7" y2="24" stroke={colors.coatHighlight} strokeWidth="0.3" />
                    <ellipse cx="7" cy="25.5" rx="1.5" ry="1" fill={colors.skin} />
                    {/* Cane */}
                    <line x1="7" y1="25" x2="5" y2="38" stroke={colors.cane} strokeWidth="2" />
                    <line x1="6.8" y1="25" x2="4.8" y2="38" stroke={colors.caneHighlight} strokeWidth="0.5" />
                    <ellipse cx="7" cy="24" rx="1.8" ry="1" fill={colors.caneHandle} />
                </g>

                {/* High collar from side */}
                <path d="M15 10 L15 13 L11 13 L11 10 Q13 9.5 15 10" fill={colors.collar} />
                {/* Cravat from side */}
                <ellipse cx="12" cy="12" rx="1" ry="0.7" fill={colors.tie} />

                {/* Neck */}
                <rect x="13" y="8" width="4" height="4" fill={colors.skin} />

                {/* Head - profile facing left */}
                <g transform={`translate(0, ${headBob})`}>
                    <ellipse cx="15" cy="6" rx="4.5" ry="5" fill={colors.skin} />

                    {/* Nose */}
                    <path d="M11 5 L9 6.5 L11 7.5" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="0.3" />

                    {/* Eye */}
                    <ellipse cx="13" cy="5" rx="1" ry="0.8" fill="white" />
                    <circle cx="12.7" cy="5" r="0.5" fill="#4a3728" />

                    {/* Eyebrow */}
                    <path d="M14 4 L11.5 3.8" stroke={colors.hair} strokeWidth="0.6" fill="none" />

                    {/* Ear */}
                    <ellipse cx="19" cy="6" rx="1" ry="1.5" fill={colors.skin} />
                    <ellipse cx="19" cy="6" rx="0.5" ry="1" fill={colors.skinShadow} />

                    {/* Beard profile */}
                    <path d="M13 8 Q10 9 10 10.5 Q11 11.5 13 11.5 Q14 10.5 14 9.5" fill={colors.beard} />

                    {/* Mustache profile */}
                    <ellipse cx="11" cy="7.5" rx="1.2" ry="0.5" fill={colors.beard} />

                    {/* Hair from side */}
                    <path d="M20 4 Q18 2 16 2.5 Q16 4 17 5 L19 5 Q20 4.5 20 4" fill={colors.hair} />

                    {/* Top Hat profile */}
                    <ellipse cx="16" cy="2" rx="5.5" ry="1.3" fill={colors.hat} />
                    <rect x="12" y="-4" width="8" height="6" fill={colors.hat} />
                    <path d="M19 -4 L19 2 L20 2 L20 -3" fill={colors.hatHighlight} opacity="0.3" />
                    <ellipse cx="16" cy="-4" rx="4" ry="1" fill={colors.hatHighlight} />
                    <rect x="11" y="1" width="10" height="0.8" fill={colors.hatBand} />
                </g>
            </svg>
        </div>
    );
};

export default PlayerSprite;
