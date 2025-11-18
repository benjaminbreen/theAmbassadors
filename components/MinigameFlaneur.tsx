
import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { GameState } from '../types';
import { LucideEye, LucideFootprints, LucideWine } from 'lucide-react';

const MinigameFlaneur: React.FC = () => {
    const { state, dispatch } = useGame();
    const { minigame } = state;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (state.gameState !== GameState.MINIGAME_FLANEUR) return;
            if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

            if (e.key === 'ArrowUp' || e.key === 'w') dispatch({ type: 'FLANEUR_MOVE', payload: {x: 0, y: -1} });
            if (e.key === 'ArrowDown' || e.key === 's') dispatch({ type: 'FLANEUR_MOVE', payload: {x: 0, y: 1} });
            if (e.key === 'ArrowLeft' || e.key === 'a') dispatch({ type: 'FLANEUR_MOVE', payload: {x: -1, y: 0} });
            if (e.key === 'ArrowRight' || e.key === 'd') dispatch({ type: 'FLANEUR_MOVE', payload: {x: 1, y: 0} });
            
            if (e.key === 'Escape') {
                dispatch({ type: 'END_MINIGAME' });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state.gameState, dispatch]);

    if (!minigame || !minigame.flaneur) return null;
    const { flaneur } = minigame;

    // Helper to check vision cones
    const isVisible = (x: number, y: number) => {
        for (const e of flaneur.enemies) {
            for (let d = 1; d <= 3; d++) {
                let tx = e.x;
                let ty = e.y;
                if (e.dir === 'N') ty -= d;
                if (e.dir === 'S') ty += d;
                if (e.dir === 'E') tx += d;
                if (e.dir === 'W') tx -= d;
                
                if (flaneur.grid[ty]?.[tx] === '#') break; // Blocked by wall
                
                if (tx === x && ty === y) return true;
            }
        }
        return false;
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-ink-900 text-paper-200 font-mono p-8 relative overflow-hidden">
             <div className="absolute top-4 right-4 text-xs opacity-50">PRESS ESC TO EXIT</div>
             
             <div className="text-center mb-4">
                 <h2 className="text-2xl font-display text-gold-500 mb-1">THE FLÂNEUR</h2>
                 <p className="text-xs italic text-paper-200/70">Avoid the Bores. Reach the Champagne.</p>
                 <p className="text-xs text-gold-600">LEVEL {flaneur.levelIndex + 1}</p>
             </div>

             {flaneur.status === 'CAUGHT' && (
                 <div className="absolute inset-0 z-50 bg-red-900/80 flex items-center justify-center flex-col animate-fade-in">
                     <h1 className="text-6xl font-display text-white mb-4">CORNERED!</h1>
                     <p className="text-xl text-paper-200 mb-8">"Have I told you about my gout?"</p>
                     <button 
                        onClick={() => dispatch({ type: 'START_MINIGAME', payload: { type: GameState.MINIGAME_FLANEUR } })}
                        className="px-6 py-2 bg-white text-red-900 font-bold rounded hover:scale-105 transition-transform"
                     >
                         TRY AGAIN
                     </button>
                 </div>
             )}

             <div className="bg-paper-900 p-4 border-4 border-gold-600/30 rounded shadow-2xl">
                 {flaneur.grid.map((row, y) => (
                     <div key={y} className="flex">
                         {row.split('').map((tile, x) => {
                             let char = tile;
                             let color = 'text-gray-600';
                             
                             // Render Entities
                             if (x === flaneur.playerX && y === flaneur.playerY) {
                                 char = '@';
                                 color = 'text-green-400 animate-pulse font-bold';
                             } else if (tile === 'E') {
                                 char = 'Y'; // Champagne glass shape-ish
                                 color = 'text-gold-400 animate-bounce';
                             } else {
                                 // Check Enemies
                                 const enemy = flaneur.enemies.find(e => e.x === x && e.y === y);
                                 if (enemy) {
                                     if (enemy.dir === 'N') char = '▲';
                                     if (enemy.dir === 'S') char = '▼';
                                     if (enemy.dir === 'E') char = '▶';
                                     if (enemy.dir === 'W') char = '◀';
                                     color = 'text-red-500';
                                 }
                             }

                             // Vision Cone Highlight
                             const inSight = isVisible(x, y);
                             const bgClass = inSight ? 'bg-red-900/40' : '';

                             return (
                                 <div key={x} className={`w-8 h-8 flex items-center justify-center ${color} ${bgClass} border border-white/5`}>
                                     {tile === '#' ? (
                                         <span className="opacity-30">#</span>
                                     ) : tile === 'E' ? (
                                         <LucideWine size={16} className="text-gold-500" />
                                     ) : char === '@' ? (
                                         <LucideFootprints size={16} />
                                     ) : (
                                         char
                                     )}
                                 </div>
                             )
                         })}
                     </div>
                 ))}
             </div>
             
             <div className="mt-4 text-xs text-gray-500 flex gap-4">
                 <span className="flex items-center gap-1"><LucideFootprints size={12}/> YOU</span>
                 <span className="flex items-center gap-1"><LucideEye size={12}/> BORE</span>
                 <span className="flex items-center gap-1"><LucideWine size={12}/> EXIT</span>
             </div>
        </div>
    );
};

export default MinigameFlaneur;
