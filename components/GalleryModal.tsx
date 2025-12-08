
import React from 'react';
import { useGame } from '../context/GameContext';
import { GameState } from '../types';
import { LucideX, LucideImage } from 'lucide-react';

const GalleryModal: React.FC = () => {
    const { state, dispatch } = useGame();

    if (state.gameState !== GameState.GALLERY_VIEW) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-2 md:p-8 animate-fade-in">
            <div className="bg-paper-100 w-full max-w-4xl max-h-[85dvh] md:max-h-[90vh] rounded-lg flex flex-col overflow-hidden border-4 border-gold-600 shadow-2xl">
                <div className="bg-ink-900 p-3 md:p-4 flex justify-between items-center border-b border-gold-600">
                    <h2 className="text-gold-500 font-display text-lg md:text-2xl flex items-center gap-2">
                        <LucideImage size={20} /> The Sketchbook of Memory
                    </h2>
                    <button onClick={() => dispatch({ type: 'CLOSE_GALLERY' })} className="text-paper-100 hover:text-red-400 p-1">
                        <LucideX size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 bg-paper-200">
                    {state.gallery.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center h-64 text-ink-400 italic font-serif">
                            <p>No visions recorded yet.</p>
                            <p className="text-sm mt-2">Scrutinize landmarks deeply (Gold Zone) to capture them.</p>
                        </div>
                    ) : (
                        state.gallery.map(img => (
                            <div key={img.id} className="bg-white p-4 shadow-lg rotate-1 hover:rotate-0 transition-transform duration-300">
                                <div className="aspect-[4/3] overflow-hidden border border-gray-200 mb-4 bg-gray-100">
                                    <img src={img.base64} alt={img.prompt} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-display font-bold text-lg text-ink-900">{img.prompt}</h3>
                                <div className="flex justify-between text-xs font-mono text-gray-500 mt-2 border-t border-gray-200 pt-2">
                                    <span>{img.location.toUpperCase()}</span>
                                    <span>{new Date(img.timestamp).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default GalleryModal;
