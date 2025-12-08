import React, { useState, useEffect } from 'react';
import Portrait from './Portrait';

interface GameOverScreenProps {
    cause: 'fall' | 'combat' | 'malaise' | 'electrocution' | 'fire' | 'health';
    stats?: {
        zonesVisited?: number;
        npcsMet?: number;
        itemsCollected?: number;
    };
    onReturnToTitle: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ cause, stats, onReturnToTitle }) => {
    const [phase, setPhase] = useState<'falling' | 'impact' | 'epitaph'>('falling');
    const [fallProgress, setFallProgress] = useState(0);

    useEffect(() => {
        if (cause !== 'fall') {
            setPhase('epitaph');
            return;
        }

        // Falling animation
        const startTime = Date.now();
        const fallDuration = 2000;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / fallDuration, 1);
            setFallProgress(progress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setPhase('impact');
                setTimeout(() => setPhase('epitaph'), 800);
            }
        };

        requestAnimationFrame(animate);
    }, [cause]);

    // Death descriptions in Jamesian prose
    const getDeathDescription = () => {
        switch (cause) {
            case 'fall':
                return `The vertiginous prospect proved, in the end, too much for the delicate constitution of the observer. One moment of carelessness, one step beyond the iron railing, and the great pageant of the Exposition receded with terrible swiftness—the crowds becoming specks, the pavilions toy-like, the Seine a silver thread—until, at last, the Champ de Mars rose to meet him with an embrace both final and absolute.`;
            case 'combat':
                return `The verbal duel had taken its toll beyond all measure. The accumulated weight of wit, observation, and social exhaustion pressed upon the spirit until it could bear no more. The last riposte hung unspoken in the air as consciousness retreated into merciful darkness.`;
            case 'malaise':
                return `The overwhelming spectacle of modernity—its noise, its crowds, its relentless assault upon the senses—had proved too much. The famous sensibility, so finely tuned to the nuances of human intercourse, simply... withdrew. Paris continued without him.`;
            case 'electrocution':
                return `The invisible fluid that promised to illuminate the future instead extinguished one curious flame. The arc lamp's voltage found its path through the author's body with lethal efficiency—a single convulsion, a smell of ozone and singed wool, and Henry James joined the list of progress's martyrs. The exposition would record it as an accident, that word which covers so multitude of causes.`;
            case 'fire':
                return `The flames, having first caressed and then embraced, completed their terrible work with an intimacy that left little for the authorities to identify. The brazier's warmth had seemed so inviting in the cool evening air—and yet what began as comfort became conflagration. Paris would mourn the loss of her distinguished American visitor, though the manner of his departure lent itself to a discretion for which the obituaries would be grateful.`;
            case 'health':
                return `The body, that instrument through which all perception flows, had at last refused its cooperation. Whether from the accumulated insults of the modern world or some deeper constitutional weakness, the vital force simply... departed. He slipped away as quietly as one leaves an overly crowded salon, with neither fuss nor announcement, leaving behind only the impression of absence where once there had been presence.`;
            default:
                return `And so the great experiment came to its conclusion.`;
        }
    };

    // Falling phase
    if (phase === 'falling' && cause === 'fall') {
        return (
            <div className="fixed inset-0 z-50 bg-sky-300 overflow-hidden">
                <svg viewBox="0 0 400 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                    {/* Sky rushing past */}
                    <rect x="0" y="0" width="400" height="600" fill="#87CEEB"/>

                    {/* Clouds zooming past */}
                    <g style={{ transform: `translateY(${fallProgress * 1000}px)` }}>
                        <ellipse cx="100" cy="100" rx="80" ry="30" fill="white" opacity="0.8"/>
                        <ellipse cx="300" cy="200" rx="60" ry="25" fill="white" opacity="0.7"/>
                        <ellipse cx="150" cy="350" rx="100" ry="40" fill="white" opacity="0.6"/>
                        <ellipse cx="350" cy="500" rx="70" ry="30" fill="white" opacity="0.7"/>
                    </g>

                    {/* Tower lattice rushing past */}
                    <g style={{ transform: `translateY(${fallProgress * 2000}px)` }} opacity="0.4">
                        {Array.from({ length: 30 }).map((_, i) => (
                            <g key={i}>
                                <line x1="0" y1={i * 50} x2="60" y2={i * 50 + 50} stroke="#4a5568" strokeWidth="6"/>
                                <line x1="60" y1={i * 50} x2="0" y2={i * 50 + 50} stroke="#4a5568" strokeWidth="6"/>
                                <line x1="340" y1={i * 50} x2="400" y2={i * 50 + 50} stroke="#4a5568" strokeWidth="6"/>
                                <line x1="400" y1={i * 50} x2="340" y2={i * 50 + 50} stroke="#4a5568" strokeWidth="6"/>
                            </g>
                        ))}
                    </g>

                    {/* Ground approaching */}
                    <rect
                        x="0"
                        y={600 - (fallProgress * 500)}
                        width="400"
                        height="200"
                        fill="#5D4E37"
                    />

                    {/* Falling figure silhouette */}
                    <g
                        style={{
                            transform: `translate(200px, ${150 + fallProgress * 100}px) rotate(${fallProgress * 180}deg)`,
                            transformOrigin: 'center'
                        }}
                    >
                        <ellipse cx="0" cy="30" rx="15" ry="25" fill="#1a1a2e"/>
                        <circle cx="0" cy="0" r="12" fill="#1a1a2e"/>
                        <rect x="-15" y="-20" width="30" height="15" fill="#1a1a2e"/>
                        {/* Flailing arms */}
                        <line x1="-15" y1="15" x2={-35 + Math.sin(fallProgress * 20) * 10} y2={-5 + Math.cos(fallProgress * 15) * 10} stroke="#1a1a2e" strokeWidth="4"/>
                        <line x1="15" y1="15" x2={35 + Math.cos(fallProgress * 18) * 10} y2={5 + Math.sin(fallProgress * 12) * 10} stroke="#1a1a2e" strokeWidth="4"/>
                    </g>
                </svg>

                {/* Screen shake as we approach ground */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        animation: fallProgress > 0.7 ? 'shake 0.1s infinite' : 'none'
                    }}
                />

                {/* Shake animation defined in tailwind.config.js */}
            </div>
        );
    }

    // Impact flash
    if (phase === 'impact') {
        return (
            <div className="fixed inset-0 z-50 bg-white animate-pulse"/>
        );
    }

    // Epitaph phase
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-slate-900 to-black animate-fade-in">
            {/* Sepia vignette overlay */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60 pointer-events-none"/>

            <div className="relative max-w-2xl mx-4 p-8 text-center">
                {/* Portrait with dead emotion */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <Portrait archetype="henry_james" size="lg" emotion="dead"/>
                        {/* Memorial wreath effect */}
                        <div className="absolute inset-0 border-4 border-slate-600 rounded-full opacity-50"/>
                    </div>
                </div>

                {/* Death title */}
                <h1 className="font-serif text-3xl md:text-4xl text-slate-300 mb-2 tracking-wide">
                    FINIS
                </h1>
                <div className="w-48 h-0.5 bg-slate-600 mx-auto mb-8"/>

                {/* Jamesian death description */}
                <p className="font-serif text-lg text-slate-400 leading-relaxed italic mb-8">
                    "{getDeathDescription()}"
                </p>

                {/* Memorial dates */}
                <p className="font-serif text-slate-500 mb-4">
                    Henry James
                </p>
                <p className="font-serif text-sm text-slate-600 mb-8">
                    1843 - 1889
                </p>

                {/* Session statistics */}
                {stats && (
                    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 text-slate-500 text-xs md:text-sm">
                        <div>
                            <div className="text-2xl text-slate-400">{stats.zonesVisited || 0}</div>
                            <div>Zones Explored</div>
                        </div>
                        <div>
                            <div className="text-2xl text-slate-400">{stats.npcsMet || 0}</div>
                            <div>Souls Encountered</div>
                        </div>
                        <div>
                            <div className="text-2xl text-slate-400">{stats.itemsCollected || 0}</div>
                            <div>Curiosities Gathered</div>
                        </div>
                    </div>
                )}

                {/* Return button */}
                <button
                    onClick={onReturnToTitle}
                    className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-serif text-lg rounded border-2 border-slate-600 shadow-lg transition-all hover:scale-105"
                >
                    Return to Title
                </button>

                {/* Philosophical footer */}
                <p className="text-xs text-slate-700 mt-8 italic">
                    "We work in the dark—we do what we can—we give what we have."
                </p>
            </div>
        </div>
    );
};

export default GameOverScreen;
