
import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { GameState } from '../types';
import { LucideRadioTower } from 'lucide-react';

const MinigameTelegraph: React.FC = () => {
    const { state, dispatch } = useGame();
    const { minigame } = state;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (state.gameState !== GameState.MINIGAME_TELEGRAPH) return;
            if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
            
            if (e.key.toLowerCase() === 'j') {
                dispatch({ type: 'TELEGRAPH_INPUT', payload: '.' });
            } else if (e.key.toLowerCase() === 'k') {
                dispatch({ type: 'TELEGRAPH_INPUT', payload: '-' });
            } else if (e.key === 'Escape') {
                dispatch({ type: 'END_MINIGAME' });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state.gameState, dispatch]);

    if (!minigame || !minigame.telegraph) return null;
    const { telegraph } = minigame;

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-ink-900 text-paper-200 font-mono p-8 relative overflow-hidden">
             <div className="absolute top-4 right-4 text-xs opacity-50">PRESS ESC TO EXIT</div>
             
             <LucideRadioTower className="w-16 h-16 mb-8 text-gold-500 animate-pulse" />
             
             <div className="text-center mb-8">
                 <h2 className="text-2xl font-display text-gold-500 mb-2">TRANSATLANTIC CABLE</h2>
                 <p className="text-sm italic text-paper-200/70">Transmit the message to New York.</p>
             </div>

             {/* PAPER TAPE */}
             <div className="flex items-center justify-center gap-4 text-4xl font-bold mb-12 tracking-widest relative h-20">
                 {telegraph.history.map((item, i) => (
                     <span 
                        key={i}
                        className={`
                            transition-all duration-300 transform
                            ${i === telegraph.currentIndex ? 'scale-150 text-paper-100' : 'opacity-30 scale-90'}
                            ${item.status === 'CORRECT' ? 'text-green-500' : ''}
                        `}
                     >
                         {item.char}
                     </span>
                 ))}
             </div>

             {/* MORSE VISUALIZER */}
             <div className="h-12 flex items-center gap-2 mb-8">
                 {/* Target */}
                 <div className="flex gap-1">
                     {telegraph.targetMorse.split('').map((m, i) => (
                         <div 
                            key={`target-${i}`} 
                            className={`
                                ${m === '.' ? 'w-3 h-3 rounded-full' : 'w-8 h-3 rounded-sm'}
                                ${i < telegraph.currentInput.length ? 'bg-green-500' : 'bg-gold-500/30'}
                            `}
                         />
                     ))}
                 </div>
             </div>

             {/* CONTROLS */}
             <div className="flex gap-16 text-center">
                 <div className="flex flex-col items-center gap-2">
                     <div className="w-16 h-16 border-2 border-paper-200 rounded-lg flex items-center justify-center text-3xl font-bold bg-ink-800 shadow-[0_4px_0_rgb(229,231,235)] active:shadow-none active:translate-y-[4px] transition-all">
                         J
                     </div>
                     <span className="text-gold-500 font-bold">DOT (.)</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                     <div className="w-16 h-16 border-2 border-paper-200 rounded-lg flex items-center justify-center text-3xl font-bold bg-ink-800 shadow-[0_4px_0_rgb(229,231,235)] active:shadow-none active:translate-y-[4px] transition-all">
                         K
                     </div>
                     <span className="text-gold-500 font-bold">DASH (-)</span>
                 </div>
             </div>
        </div>
    );
};

export default MinigameTelegraph;
