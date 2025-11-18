
import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { GameState } from '../types';
import { LucideGavel, LucideArrowLeft, LucideArrowRight } from 'lucide-react';

const MinigameCurator: React.FC = () => {
    const { state, dispatch } = useGame();
    const { minigame } = state;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (state.gameState !== GameState.MINIGAME_CURATOR) return;
            if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
            
            if (e.key === 'ArrowLeft') {
                dispatch({ type: 'CURATOR_INPUT', payload: 'LEFT' });
            } else if (e.key === 'ArrowRight') {
                dispatch({ type: 'CURATOR_INPUT', payload: 'RIGHT' });
            } else if (e.key === 'Escape') {
                dispatch({ type: 'END_MINIGAME' });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state.gameState, dispatch]);

    if (!minigame || !minigame.curator || !minigame.curator.currentItem) return null;
    const { currentItem, streak, feedback } = minigame.curator;

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-paper-100 dark:bg-gray-800 text-ink-900 dark:text-paper-100 p-8 relative overflow-hidden border-8 border-double border-gold-600">
             <div className="absolute top-4 right-4 text-xs opacity-50">PRESS ESC TO EXIT</div>
             
             <div className="text-center mb-8 z-10">
                 <h2 className="text-3xl font-display text-gold-600 mb-2 flex items-center justify-center gap-2">
                    <LucideGavel /> THE CURATOR
                 </h2>
                 <p className="text-sm italic text-ink-400">Judge the Exhibits. Separated the Wheat from the Chaff.</p>
             </div>

             {/* CONVEYOR BELT */}
             <div className="flex items-center justify-center mb-12 perspective-1000 w-full">
                 <div className="w-64 h-64 bg-white dark:bg-gray-700 shadow-2xl border-4 border-ink-900 rounded-lg flex flex-col items-center justify-center p-6 text-center transform transition-all duration-300 animate-fade-in">
                     <h3 className="font-display font-bold text-xl mb-4">{currentItem.name}</h3>
                     <p className="font-serif italic text-sm opacity-80">{currentItem.description}</p>
                 </div>
             </div>

             {/* FEEDBACK OVERLAY */}
             {feedback && (
                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-black transform -rotate-12 z-50 animate-bounce ${feedback === 'CORRECT' ? 'text-green-600' : 'text-red-600'}`}>
                     {feedback}
                 </div>
             )}

             {/* CONTROLS */}
             <div className="flex gap-32 text-center z-10">
                 <div className="flex flex-col items-center gap-2 group">
                     <div className="w-20 h-20 border-4 border-red-800 rounded-full flex items-center justify-center text-3xl bg-paper-200 shadow-lg group-hover:scale-110 transition-transform">
                         <LucideArrowLeft className="text-red-800" />
                     </div>
                     <span className="text-red-800 font-bold font-display tracking-widest">VULGAR</span>
                 </div>
                 
                 <div className="flex flex-col items-center gap-2 group">
                     <div className="w-20 h-20 border-4 border-blue-800 rounded-full flex items-center justify-center text-3xl bg-paper-200 shadow-lg group-hover:scale-110 transition-transform">
                         <LucideArrowRight className="text-blue-800" />
                     </div>
                     <span className="text-blue-800 font-bold font-display tracking-widest">SUBLIME</span>
                 </div>
             </div>

             <div className="absolute bottom-4 left-4 font-mono text-gold-600">
                 STREAK: {streak}
             </div>
        </div>
    );
};

export default MinigameCurator;
