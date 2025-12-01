
import React, { useEffect, useState } from 'react';

interface PlayerSpriteProps {
    direction: 'N' | 'S' | 'E' | 'W';
    className?: string;
}

// Henry James - 1889 Paris Exposition
// Historically accurate: Age 46, beard/goatee, formal morning dress, bowler hat
// Known for his meticulous appearance and slightly portly figure

const PlayerSprite: React.FC<PlayerSpriteProps> = ({ direction, className }) => {
    const [tick, setTick] = useState(0);
    const [isMoving, setIsMoving] = useState(false);

    useEffect(() => {
        setIsMoving(true);
        const timer = setTimeout(() => setIsMoving(false), 300);
        return () => clearTimeout(timer);
    }, [direction]);

    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 120);
        return () => clearInterval(interval);
    }, []);

    // Animation values
    const walkCycle = isMoving ? Math.sin(tick * 0.5) : 0;
    const bounce = isMoving ? Math.abs(Math.sin(tick * 0.5)) * 1.5 : 0;
    const legSwing = isMoving ? Math.sin(tick * 0.5) * 12 : 0;
    const armSwing = isMoving ? Math.sin(tick * 0.5) * 8 : 0;
    const coatSway = isMoving ? Math.sin(tick * 0.3) * 2 : 0;

    // Colors - Henry James's typical attire
    const colors = {
        skin: '#f5deb3',
        skinShadow: '#d4b896',
        hair: '#4a3728',
        beard: '#5d4a3a',
        coat: '#1a1a2e', // Dark navy/black morning coat
        coatHighlight: '#2d2d44',
        vest: '#8b7355', // Brown/tan vest
        vestPattern: '#7a6548',
        shirt: '#f5f5f0',
        collar: '#ffffff',
        tie: '#722f37', // Burgundy cravat
        pants: '#2d2d2d',
        shoes: '#1a1a1a',
        hat: '#1a1a1a',
        hatBand: '#8b7355',
        cane: '#8b4513',
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
                            <stop offset="50%" stopColor={colors.coat} />
                            <stop offset="100%" stopColor={colors.coatHighlight} />
                        </linearGradient>
                        <linearGradient id="vestGradS" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={colors.vest} />
                            <stop offset="100%" stopColor={colors.vestPattern} />
                        </linearGradient>
                    </defs>

                    {/* Shadow on ground */}
                    <ellipse cx="16" cy="39" rx="8" ry="2" fill="rgba(0,0,0,0.2)" />

                    {/* Legs */}
                    <g>
                        {/* Left leg */}
                        <path d={`M12 28 L${12 - legSwing * 0.3} 36 L${13 - legSwing * 0.3} 36 L14 28`}
                              fill={colors.pants} />
                        {/* Left shoe */}
                        <ellipse cx={12.5 - legSwing * 0.3} cy="36.5" rx="2" ry="1" fill={colors.shoes} />

                        {/* Right leg */}
                        <path d={`M18 28 L${18 + legSwing * 0.3} 36 L${19 + legSwing * 0.3} 36 L20 28`}
                              fill={colors.pants} />
                        {/* Right shoe */}
                        <ellipse cx={18.5 + legSwing * 0.3} cy="36.5" rx="2" ry="1" fill={colors.shoes} />
                    </g>

                    {/* Morning Coat - Back tails */}
                    <path d={`M10 28 Q8 32 ${9 + coatSway} 35 L${11 + coatSway} 35 L12 28`}
                          fill={colors.coat} opacity="0.8" />
                    <path d={`M20 28 Q24 32 ${23 - coatSway} 35 L${21 - coatSway} 35 L20 28`}
                          fill={colors.coat} opacity="0.8" />

                    {/* Body/Coat */}
                    <path d="M8 14 Q8 12 12 12 L20 12 Q24 12 24 14 L24 28 L8 28 Z"
                          fill="url(#coatGradS)" />

                    {/* Coat lapels */}
                    <path d="M12 12 L14 18 L12 18 Z" fill={colors.coatHighlight} />
                    <path d="M20 12 L18 18 L20 18 Z" fill={colors.coatHighlight} />

                    {/* Vest visible under coat */}
                    <path d="M13 14 L13 26 L19 26 L19 14 Q16 13 13 14" fill="url(#vestGradS)" />

                    {/* Vest buttons */}
                    <circle cx="16" cy="17" r="0.6" fill={colors.caneHandle} />
                    <circle cx="16" cy="20" r="0.6" fill={colors.caneHandle} />
                    <circle cx="16" cy="23" r="0.6" fill={colors.caneHandle} />

                    {/* Shirt collar visible */}
                    <path d="M13 12 L16 14 L19 12" fill="none" stroke={colors.collar} strokeWidth="1.5" />

                    {/* Cravat/Tie */}
                    <path d="M14 12 Q16 13 18 12 L17 15 L16 14 L15 15 Z" fill={colors.tie} />

                    {/* Arms */}
                    <g transform={`rotate(${armSwing} 10 16)`}>
                        <path d="M8 14 L4 24 L6 24 L10 16" fill={colors.coat} />
                        {/* Hand */}
                        <ellipse cx="5" cy="24.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>
                    <g transform={`rotate(${-armSwing} 22 16)`}>
                        <path d="M24 14 L28 24 L26 24 L22 16" fill={colors.coat} />
                        {/* Hand with cane */}
                        <ellipse cx="27" cy="24.5" rx="1.5" ry="1" fill={colors.skin} />
                        {/* Cane */}
                        <line x1="27" y1="24" x2="27" y2="38" stroke={colors.cane} strokeWidth="1.5" />
                        <ellipse cx="27" cy="23" rx="1.5" ry="1" fill={colors.caneHandle} />
                    </g>

                    {/* Neck */}
                    <rect x="14" y="9" width="4" height="3" fill={colors.skin} />

                    {/* Head */}
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
                    <path d="M16 6 L16 8 L15.5 8.5" fill="none" stroke={colors.skinShadow} strokeWidth="0.5" />

                    {/* Beard/Goatee - Henry James's signature look */}
                    <path d="M13 8.5 Q16 12 19 8.5" fill={colors.beard} />
                    <path d="M14 9 Q16 11 18 9" fill={colors.beard} />

                    {/* Mustache */}
                    <path d="M13.5 8 Q16 9 18.5 8" fill={colors.beard} />

                    {/* Ears */}
                    <ellipse cx="11" cy="7" rx="0.8" ry="1.2" fill={colors.skin} />
                    <ellipse cx="21" cy="7" rx="0.8" ry="1.2" fill={colors.skin} />

                    {/* Bowler Hat */}
                    <ellipse cx="16" cy="3.5" rx="6" ry="1.5" fill={colors.hat} />
                    <path d="M11 3.5 Q11 0 16 0 Q21 0 21 3.5" fill={colors.hat} />
                    <rect x="11" y="2.5" width="10" height="1" fill={colors.hatBand} />
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
                    {/* Shadow */}
                    <ellipse cx="16" cy="39" rx="8" ry="2" fill="rgba(0,0,0,0.2)" />

                    {/* Legs */}
                    <path d={`M12 28 L${12 + legSwing * 0.3} 36 L${13 + legSwing * 0.3} 36 L14 28`}
                          fill={colors.pants} />
                    <ellipse cx={12.5 + legSwing * 0.3} cy="36.5" rx="2" ry="1" fill={colors.shoes} />

                    <path d={`M18 28 L${18 - legSwing * 0.3} 36 L${19 - legSwing * 0.3} 36 L20 28`}
                          fill={colors.pants} />
                    <ellipse cx={18.5 - legSwing * 0.3} cy="36.5" rx="2" ry="1" fill={colors.shoes} />

                    {/* Coat tails - more prominent from back */}
                    <path d={`M9 26 Q7 32 ${8 + coatSway} 36 L${12 + coatSway} 36 L13 26`}
                          fill={colors.coat} />
                    <path d={`M19 26 Q25 32 ${24 - coatSway} 36 L${20 - coatSway} 36 L19 26`}
                          fill={colors.coat} />
                    {/* Tail split line */}
                    <line x1="16" y1="26" x2="16" y2="36" stroke={colors.coatHighlight} strokeWidth="0.5" />

                    {/* Body/Coat back */}
                    <path d="M8 14 Q8 12 16 11 Q24 12 24 14 L24 28 L8 28 Z" fill={colors.coat} />

                    {/* Back seam */}
                    <line x1="16" y1="12" x2="16" y2="28" stroke={colors.coatHighlight} strokeWidth="0.5" />

                    {/* Arms */}
                    <g transform={`rotate(${-armSwing} 10 16)`}>
                        <path d="M8 14 L4 24 L6 24 L10 16" fill={colors.coat} />
                        <ellipse cx="5" cy="24.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>
                    <g transform={`rotate(${armSwing} 22 16)`}>
                        <path d="M24 14 L28 24 L26 24 L22 16" fill={colors.coat} />
                        <ellipse cx="27" cy="24.5" rx="1.5" ry="1" fill={colors.skin} />
                        <line x1="27" y1="24" x2="27" y2="38" stroke={colors.cane} strokeWidth="1.5" />
                        <ellipse cx="27" cy="23" rx="1.5" ry="1" fill={colors.caneHandle} />
                    </g>

                    {/* Collar from back */}
                    <path d="M12 11 Q16 10 20 11" fill={colors.collar} />

                    {/* Neck */}
                    <rect x="14" y="9" width="4" height="2" fill={colors.skin} />

                    {/* Head from back */}
                    <ellipse cx="16" cy="7" rx="5" ry="4.5" fill={colors.skin} />

                    {/* Hair - visible from back */}
                    <path d="M11 4 Q16 2 21 4 Q21 8 20 9 L12 9 Q11 8 11 4" fill={colors.hair} />

                    {/* Ears */}
                    <ellipse cx="11" cy="7" rx="0.8" ry="1.2" fill={colors.skin} />
                    <ellipse cx="21" cy="7" rx="0.8" ry="1.2" fill={colors.skin} />

                    {/* Bowler Hat */}
                    <ellipse cx="16" cy="3.5" rx="6" ry="1.5" fill={colors.hat} />
                    <path d="M11 3.5 Q11 0 16 0 Q21 0 21 3.5" fill={colors.hat} />
                    <rect x="11" y="2.5" width="10" height="1" fill={colors.hatBand} />
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
                    {/* Shadow */}
                    <ellipse cx="16" cy="39" rx="8" ry="2" fill="rgba(0,0,0,0.2)" />

                    {/* Back leg */}
                    <path d={`M14 28 L${13 - legSwing * 0.4} 36`}
                          stroke={colors.pants} strokeWidth="3" fill="none" />
                    <ellipse cx={13 - legSwing * 0.4} cy="36.5" rx="2.5" ry="1" fill={colors.shoes} />

                    {/* Front leg */}
                    <path d={`M17 28 L${18 + legSwing * 0.4} 36`}
                          stroke={colors.pants} strokeWidth="3" fill="none" />
                    <ellipse cx={18 + legSwing * 0.4} cy="36.5" rx="2.5" ry="1" fill={colors.shoes} />

                    {/* Coat tail */}
                    <path d={`M10 26 Q6 32 ${7 + coatSway} 35 L${10 + coatSway} 35 L12 26`}
                          fill={colors.coat} />

                    {/* Back arm */}
                    <g transform={`rotate(${-armSwing * 0.7} 12 16)`}>
                        <path d="M10 14 L6 24" stroke={colors.coat} strokeWidth="3" fill="none" />
                        <ellipse cx="6" cy="24.5" rx="1.5" ry="1" fill={colors.skin} />
                    </g>

                    {/* Body - side profile */}
                    <path d="M10 12 Q8 14 8 18 L8 28 L20 28 L20 18 Q20 14 18 12 Z" fill={colors.coat} />

                    {/* Vest showing */}
                    <path d="M12 14 L12 26 L18 26 L18 14 Q15 13 12 14" fill={colors.vest} />

                    {/* Front arm with cane */}
                    <g transform={`rotate(${armSwing * 0.7} 18 16)`}>
                        <path d="M18 14 L24 24" stroke={colors.coat} strokeWidth="3" fill="none" />
                        <ellipse cx="24" cy="24.5" rx="1.5" ry="1" fill={colors.skin} />
                        {/* Cane */}
                        <line x1="24" y1="24" x2="26" y2="38" stroke={colors.cane} strokeWidth="2" />
                        <circle cx="24" cy="23" r="1.5" fill={colors.caneHandle} />
                    </g>

                    {/* Collar/Cravat from side */}
                    <rect x="14" y="10" width="4" height="2" fill={colors.collar} />
                    <polygon points="16,11 18,13 16,14 14,13" fill={colors.tie} />

                    {/* Neck */}
                    <rect x="15" y="8" width="3" height="4" fill={colors.skin} />

                    {/* Head - profile */}
                    <ellipse cx="16" cy="6" rx="4" ry="4.5" fill={colors.skin} />

                    {/* Profile face features */}
                    {/* Nose */}
                    <path d="M20 5 L22 6 L20 7" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="0.3" />

                    {/* Eye */}
                    <ellipse cx="18" cy="5" rx="1" ry="0.8" fill="white" />
                    <circle cx="18.3" cy="5" r="0.5" fill="#4a3728" />

                    {/* Eyebrow */}
                    <path d="M17 4 L19 3.8" stroke={colors.hair} strokeWidth="0.6" fill="none" />

                    {/* Ear */}
                    <ellipse cx="13" cy="6" rx="1" ry="1.5" fill={colors.skin} />
                    <ellipse cx="13" cy="6" rx="0.5" ry="1" fill={colors.skinShadow} />

                    {/* Beard profile */}
                    <path d="M18 7 Q21 8 20 10 Q18 11 16 9 Q15 8 16 7" fill={colors.beard} />

                    {/* Mustache */}
                    <path d="M19 7 Q21 7.5 20 8" fill={colors.beard} />

                    {/* Hair from side */}
                    <path d="M12 3 Q16 1 18 3 Q18 5 17 6 L13 6 Q12 5 12 3" fill={colors.hair} />

                    {/* Bowler Hat */}
                    <ellipse cx="15" cy="2" rx="5" ry="1.2" fill={colors.hat} />
                    <path d="M11 2 Q11 -1 15 -1 Q19 -1 19 2" fill={colors.hat} />
                    <rect x="11" y="1" width="8" height="0.8" fill={colors.hatBand} />
                </svg>
            </div>
        );
    }

    // West-facing (left profile)
    return (
        <div className={`relative w-full h-full flex items-center justify-center ${className}`}
             style={{ transform: `translateY(${-bounce}px)` }}>
            <svg viewBox="0 0 32 40" className="w-10 h-12 overflow-visible drop-shadow-lg">
                {/* Shadow */}
                <ellipse cx="16" cy="39" rx="8" ry="2" fill="rgba(0,0,0,0.2)" />

                {/* Back leg */}
                <path d={`M18 28 L${19 + legSwing * 0.4} 36`}
                      stroke={colors.pants} strokeWidth="3" fill="none" />
                <ellipse cx={19 + legSwing * 0.4} cy="36.5" rx="2.5" ry="1" fill={colors.shoes} />

                {/* Front leg */}
                <path d={`M15 28 L${14 - legSwing * 0.4} 36`}
                      stroke={colors.pants} strokeWidth="3" fill="none" />
                <ellipse cx={14 - legSwing * 0.4} cy="36.5" rx="2.5" ry="1" fill={colors.shoes} />

                {/* Coat tail */}
                <path d={`M22 26 Q26 32 ${25 - coatSway} 35 L${22 - coatSway} 35 L20 26`}
                      fill={colors.coat} />

                {/* Back arm */}
                <g transform={`rotate(${armSwing * 0.7} 20 16)`}>
                    <path d="M22 14 L26 24" stroke={colors.coat} strokeWidth="3" fill="none" />
                    <ellipse cx="26" cy="24.5" rx="1.5" ry="1" fill={colors.skin} />
                </g>

                {/* Body */}
                <path d="M22 12 Q24 14 24 18 L24 28 L12 28 L12 18 Q12 14 14 12 Z" fill={colors.coat} />

                {/* Vest */}
                <path d="M20 14 L20 26 L14 26 L14 14 Q17 13 20 14" fill={colors.vest} />

                {/* Front arm with cane */}
                <g transform={`rotate(${-armSwing * 0.7} 14 16)`}>
                    <path d="M14 14 L8 24" stroke={colors.coat} strokeWidth="3" fill="none" />
                    <ellipse cx="8" cy="24.5" rx="1.5" ry="1" fill={colors.skin} />
                    {/* Cane */}
                    <line x1="8" y1="24" x2="6" y2="38" stroke={colors.cane} strokeWidth="2" />
                    <circle cx="8" cy="23" r="1.5" fill={colors.caneHandle} />
                </g>

                {/* Collar/Cravat */}
                <rect x="14" y="10" width="4" height="2" fill={colors.collar} />
                <polygon points="16,11 14,13 16,14 18,13" fill={colors.tie} />

                {/* Neck */}
                <rect x="14" y="8" width="3" height="4" fill={colors.skin} />

                {/* Head - profile facing left */}
                <ellipse cx="16" cy="6" rx="4" ry="4.5" fill={colors.skin} />

                {/* Nose */}
                <path d="M12 5 L10 6 L12 7" fill={colors.skin} stroke={colors.skinShadow} strokeWidth="0.3" />

                {/* Eye */}
                <ellipse cx="14" cy="5" rx="1" ry="0.8" fill="white" />
                <circle cx="13.7" cy="5" r="0.5" fill="#4a3728" />

                {/* Eyebrow */}
                <path d="M15 4 L13 3.8" stroke={colors.hair} strokeWidth="0.6" fill="none" />

                {/* Ear */}
                <ellipse cx="19" cy="6" rx="1" ry="1.5" fill={colors.skin} />
                <ellipse cx="19" cy="6" rx="0.5" ry="1" fill={colors.skinShadow} />

                {/* Beard profile - mirrored */}
                <path d="M14 7 Q11 8 12 10 Q14 11 16 9 Q17 8 16 7" fill={colors.beard} />

                {/* Mustache */}
                <path d="M13 7 Q11 7.5 12 8" fill={colors.beard} />

                {/* Hair */}
                <path d="M20 3 Q16 1 14 3 Q14 5 15 6 L19 6 Q20 5 20 3" fill={colors.hair} />

                {/* Bowler Hat */}
                <ellipse cx="17" cy="2" rx="5" ry="1.2" fill={colors.hat} />
                <path d="M21 2 Q21 -1 17 -1 Q13 -1 13 2" fill={colors.hat} />
                <rect x="13" y="1" width="8" height="0.8" fill={colors.hatBand} />
            </svg>
        </div>
    );
};

export default PlayerSprite;
