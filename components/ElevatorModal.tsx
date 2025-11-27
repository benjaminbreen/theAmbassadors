import React, { useState, useEffect } from 'react';

interface ElevatorModalProps {
    isOpen: boolean;
    direction: 'up' | 'down';
    onConfirm: () => void;
    onCancel: () => void;
}

const ElevatorModal: React.FC<ElevatorModalProps> = ({ isOpen, direction, onConfirm, onCancel }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationProgress, setAnimationProgress] = useState(0);

    useEffect(() => {
        if (!isAnimating) return;

        const startTime = Date.now();
        const duration = 6000; // 6 seconds

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setAnimationProgress(progress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete
                setTimeout(() => {
                    setIsAnimating(false);
                    setAnimationProgress(0);
                    onConfirm();
                }, 500);
            }
        };

        requestAnimationFrame(animate);
    }, [isAnimating, onConfirm]);

    const handleConfirm = () => {
        setIsAnimating(true);
    };

    if (!isOpen) return null;

    // Animation phase
    if (isAnimating) {
        const elevatorY = direction === 'up'
            ? 200 - (animationProgress * 180)
            : 20 + (animationProgress * 180);

        const parisScale = direction === 'up'
            ? 1 - (animationProgress * 0.6)
            : 0.4 + (animationProgress * 0.6);

        const parisY = direction === 'up'
            ? 280 + (animationProgress * 100)
            : 380 - (animationProgress * 100);

        const latticeOffset = direction === 'up'
            ? animationProgress * 2000
            : -animationProgress * 2000;

        const cloudOffset1 = direction === 'up' ? animationProgress * 300 : -animationProgress * 300;
        const cloudOffset2 = direction === 'up' ? animationProgress * 200 : -animationProgress * 200;

        // Easing function for smooth acceleration/deceleration
        const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const easedProgress = easeInOut(animationProgress);

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                <div className="relative w-full max-w-2xl h-[500px] overflow-hidden rounded-lg border-4 border-amber-900">
                    <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                        {/* Sky gradient background */}
                        <defs>
                            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#87CEEB" />
                                <stop offset="50%" stopColor="#B0E0E6" />
                                <stop offset="100%" stopColor="#E0E8F0" />
                            </linearGradient>
                            <pattern id="latticePattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M0 0 L40 40 M40 0 L0 40" stroke="#4a5568" strokeWidth="3" fill="none"/>
                                <circle cx="20" cy="20" r="3" fill="#4a5568"/>
                            </pattern>
                        </defs>

                        {/* Sky background */}
                        <rect x="0" y="0" width="400" height="400" fill="url(#skyGradient)" />

                        {/* Clouds (slow parallax) */}
                        <g style={{ transform: `translateY(${cloudOffset1}px)` }}>
                            <ellipse cx="80" cy={50} rx="60" ry="25" fill="white" opacity="0.7"/>
                            <ellipse cx="120" cy={45} rx="40" ry="20" fill="white" opacity="0.8"/>
                            <ellipse cx="320" cy={80} rx="50" ry="20" fill="white" opacity="0.6"/>
                        </g>
                        <g style={{ transform: `translateY(${cloudOffset2}px)` }}>
                            <ellipse cx="200" cy={120} rx="70" ry="25" fill="white" opacity="0.5"/>
                            <ellipse cx="350" cy={150} rx="45" ry="18" fill="white" opacity="0.6"/>
                        </g>

                        {/* Paris cityscape (shrinks as we rise) */}
                        <g style={{
                            transform: `translate(200px, ${parisY}px) scale(${parisScale})`,
                            transformOrigin: 'center'
                        }}>
                            {/* Seine River */}
                            <path d="M-200 20 Q-100 25 0 20 Q100 15 200 20" stroke="#6B8CAE" strokeWidth="8" fill="none"/>

                            {/* Buildings silhouette */}
                            <g fill="#2D3748" opacity="0.8">
                                {/* Notre Dame */}
                                <rect x="-180" y="-40" width="30" height="50"/>
                                <polygon points="-180,-40 -165,-60 -150,-40"/>
                                <polygon points="-165,-40 -158,-55 -150,-40"/>

                                {/* Rooftops */}
                                <rect x="-130" y="-20" width="25" height="30"/>
                                <rect x="-90" y="-35" width="35" height="45"/>
                                <rect x="-40" y="-25" width="30" height="35"/>
                                <rect x="10" y="-30" width="40" height="40"/>
                                <rect x="70" y="-20" width="25" height="30"/>
                                <rect x="110" y="-40" width="35" height="50"/>
                                <rect x="160" y="-25" width="30" height="35"/>

                                {/* Dome (Invalides?) */}
                                <ellipse cx="30" cy="-30" rx="20" ry="10"/>
                            </g>

                            {/* Tiny people as dots */}
                            {parisScale > 0.5 && (
                                <g fill="#4A5568">
                                    <circle cx="-50" cy="0" r="2"/>
                                    <circle cx="-30" cy="2" r="2"/>
                                    <circle cx="20" cy="0" r="2"/>
                                    <circle cx="60" cy="1" r="2"/>
                                </g>
                            )}
                        </g>

                        {/* Tower lattice (scrolling rapidly) */}
                        <g style={{ transform: `translateY(${latticeOffset % 80}px)` }}>
                            {Array.from({ length: 15 }).map((_, i) => (
                                <g key={i}>
                                    <line x1="0" y1={i * 40} x2="50" y2={i * 40 + 40} stroke="#4a5568" strokeWidth="4"/>
                                    <line x1="50" y1={i * 40} x2="0" y2={i * 40 + 40} stroke="#4a5568" strokeWidth="4"/>
                                    <line x1="350" y1={i * 40} x2="400" y2={i * 40 + 40} stroke="#4a5568" strokeWidth="4"/>
                                    <line x1="400" y1={i * 40} x2="350" y2={i * 40 + 40} stroke="#4a5568" strokeWidth="4"/>
                                </g>
                            ))}
                        </g>

                        {/* Elevator cage (center) */}
                        <g style={{ transform: `translateY(${elevatorY - 100}px)` }}>
                            {/* Cage frame */}
                            <rect x="100" y="100" width="200" height="180" fill="#F5E6D3" stroke="#B8860B" strokeWidth="4"/>

                            {/* Ornate top arch */}
                            <path d="M100 100 Q200 60 300 100" fill="none" stroke="#B8860B" strokeWidth="4"/>
                            <circle cx="200" cy="80" r="10" fill="#B8860B"/>

                            {/* Decorative ironwork */}
                            <path d="M110 110 L290 110" stroke="#B8860B" strokeWidth="2"/>
                            <path d="M110 270 L290 270" stroke="#B8860B" strokeWidth="2"/>
                            <path d="M110 110 L110 270" stroke="#B8860B" strokeWidth="2"/>
                            <path d="M290 110 L290 270" stroke="#B8860B" strokeWidth="2"/>

                            {/* Cross-hatch gate pattern */}
                            <g stroke="#DAA520" strokeWidth="1.5" opacity="0.6">
                                <line x1="120" y1="120" x2="280" y2="260"/>
                                <line x1="280" y1="120" x2="120" y2="260"/>
                                <line x1="150" y1="120" x2="150" y2="260"/>
                                <line x1="200" y1="120" x2="200" y2="260"/>
                                <line x1="250" y1="120" x2="250" y2="260"/>
                                <line x1="120" y1="160" x2="280" y2="160"/>
                                <line x1="120" y1="200" x2="280" y2="200"/>
                                <line x1="120" y1="240" x2="280" y2="240"/>
                            </g>

                            {/* Henry James silhouette */}
                            <g transform="translate(180, 170)">
                                {/* Body */}
                                <ellipse cx="20" cy="60" rx="25" ry="35" fill="#1a1a2e"/>
                                {/* Head */}
                                <circle cx="20" cy="15" r="18" fill="#1a1a2e"/>
                                {/* Top hat */}
                                <rect x="5" y="-15" width="30" height="25" fill="#1a1a2e"/>
                                <rect x="0" y="8" width="40" height="5" fill="#1a1a2e"/>
                            </g>

                            {/* Elevator cables */}
                            <line x1="200" y1="0" x2="200" y2="80" stroke="#4a5568" strokeWidth="3"/>
                            <line x1="190" y1="0" x2="190" y2="85" stroke="#4a5568" strokeWidth="2"/>
                            <line x1="210" y1="0" x2="210" y2="85" stroke="#4a5568" strokeWidth="2"/>
                        </g>

                        {/* Vignette overlay */}
                        <rect x="0" y="0" width="400" height="400" fill="url(#vignetteGradient)" opacity="0.3"/>
                        <defs>
                            <radialGradient id="vignetteGradient">
                                <stop offset="50%" stopColor="transparent"/>
                                <stop offset="100%" stopColor="black"/>
                            </radialGradient>
                        </defs>
                    </svg>

                    {/* Progress indicator */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gold-500 transition-all duration-100"
                                style={{ width: `${animationProgress * 100}%` }}
                            />
                        </div>
                        <p className="text-center text-amber-200 mt-2 font-serif italic">
                            {direction === 'up'
                                ? 'Ascending to the first platform...'
                                : 'Descending to the base...'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Confirmation phase
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in">
            <div className="bg-paper-100 border-4 border-amber-900 rounded-lg p-8 max-w-md mx-4 shadow-2xl">
                {/* Ornate header */}
                <div className="text-center mb-6">
                    <div className="text-4xl mb-2">
                        {direction === 'up' ? '🗼' : '⬇️'}
                    </div>
                    <h2 className="font-serif text-2xl text-ink-900 font-bold">
                        {direction === 'up'
                            ? 'The Otis Elevator'
                            : 'Return to Ground Level'}
                    </h2>
                    <div className="w-32 h-1 bg-gold-500 mx-auto mt-2"/>
                </div>

                {/* Description */}
                <p className="text-ink-800 font-serif text-center mb-6 leading-relaxed">
                    {direction === 'up'
                        ? 'The hydraulic elevator awaits, its ornate cage promising a view of Paris that few have witnessed. The attendant gestures invitingly.'
                        : 'The elevator cage stands ready to return you to the base of the great iron tower.'}
                </p>

                {/* Period-style buttons */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={handleConfirm}
                        className="px-6 py-3 bg-gold-600 hover:bg-gold-500 text-white font-serif font-bold rounded border-2 border-gold-800 shadow-lg transition-all hover:scale-105"
                    >
                        {direction === 'up' ? 'Ascend' : 'Descend'}
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-serif rounded border-2 border-slate-800 shadow-lg transition-all hover:scale-105"
                    >
                        Remain
                    </button>
                </div>

                {/* Historical note */}
                <p className="text-xs text-ink-600 text-center mt-6 italic">
                    The Otis elevators at the Eiffel Tower could carry 100 passengers at once.
                </p>
            </div>
        </div>
    );
};

export default ElevatorModal;
