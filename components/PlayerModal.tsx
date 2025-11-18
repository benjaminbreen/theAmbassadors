
import React from 'react';
import { useGame } from '../context/GameContext';
import { LucideX, LucideBook, LucideShirt, LucideBrain } from 'lucide-react';
import StatBar from './StatBar';
import AsciiPortrait from './AsciiPortrait';

const PlayerModal: React.FC = () => {
    const { state, dispatch } = useGame();
    const { player } = state;

    if (!state.showPlayerModal) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-8 animate-fade-in">
            <div className="bg-paper-100 dark:bg-gray-900 w-full max-w-6xl h-[85vh] rounded-lg flex overflow-hidden border-4 border-gold-600 shadow-2xl relative">
                
                <button 
                    onClick={() => dispatch({ type: 'CLOSE_PLAYER_MODAL' })} 
                    className="absolute top-6 right-6 text-ink-900 dark:text-paper-100 hover:text-red-500 z-50 bg-paper-200 dark:bg-gray-800 p-3 rounded-full shadow-lg transition-transform hover:scale-110"
                >
                    <LucideX size={28} />
                </button>

                {/* LEFT COLUMN: ID CARD */}
                <div className="w-1/3 bg-paper-200 dark:bg-gray-800 border-r border-gold-600 p-10 flex flex-col items-center text-center shadow-[10px_0_20px_rgba(0,0,0,0.1)] z-10">
                    <div className="mb-8 transform scale-125">
                         <AsciiPortrait mood="NEUTRAL" speaking={false} />
                    </div>
                    <h1 className="font-display text-4xl font-bold text-ink-900 dark:text-gold-500 mb-2 tracking-tight">HENRY JAMES</h1>
                    <p className="font-mono text-sm text-ink-600 dark:text-gray-400 mb-10 uppercase tracking-[0.2em] border-t border-b border-ink-900/20 py-2 w-full">Man of Letters</p>

                    <div className="w-full space-y-6 text-left font-sans">
                        <div className="space-y-3">
                            <StatBar label="Composure" value={player.hp} max={player.maxHp} color="bg-blue-700" />
                            <StatBar label="Malaise" value={player.stats.malaise} max={100} color="bg-red-800" />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-6">
                             <div className="bg-paper-100 dark:bg-gray-700 p-3 text-center rounded border border-ink-900/10 shadow-sm">
                                 <div className="text-[10px] text-ink-500 uppercase font-bold tracking-wider mb-1">Age</div>
                                 <div className="font-bold text-2xl text-ink-900 dark:text-paper-100">46</div>
                             </div>
                             <div className="bg-paper-100 dark:bg-gray-700 p-3 text-center rounded border border-ink-900/10 shadow-sm">
                                 <div className="text-[10px] text-ink-500 uppercase font-bold tracking-wider mb-1">Lvl</div>
                                 <div className="font-bold text-2xl text-ink-900 dark:text-paper-100">{player.level}</div>
                             </div>
                             <div className="bg-paper-100 dark:bg-gray-700 p-3 text-center rounded border border-ink-900/10 shadow-sm">
                                 <div className="text-[10px] text-ink-500 uppercase font-bold tracking-wider mb-1">Wit</div>
                                 <div className="font-bold text-2xl text-ink-900 dark:text-paper-100">{player.stats.wit}</div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: DOSSIER */}
                <div className="flex-1 p-12 overflow-y-auto text-ink-900 dark:text-paper-200 bg-paper-50 dark:bg-gray-900 relative">
                    {/* Paper Texture */}
                    <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')]"></div>
                    
                    {/* SECTION: PSYCHOLOGY */}
                    <div className="mb-12 relative z-10">
                        <h2 className="flex items-center gap-3 font-display text-2xl text-gold-600 border-b-2 border-gold-600 pb-3 mb-6">
                            <LucideBrain size={28} /> PSYCHOLOGICAL PROFILE
                        </h2>
                        <p className="font-serif italic text-2xl leading-relaxed mb-6 text-ink-800 dark:text-gray-300 pl-6 border-l-4 border-gold-400">
                            "A mind so fine that no idea could violate it."
                        </p>
                        <div className="bg-white dark:bg-black/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm font-sans text-base leading-relaxed">
                            <p className="mb-3"><strong className="text-ink-900 dark:text-gold-500">Current Obsession:</strong> The vulgarity of the Eiffel Tower versus its undeniable modernity.</p>
                            <p><strong className="text-ink-900 dark:text-gold-500">Social Anxiety:</strong> {player.stats.malaise > 50 ? "Severe. Crowds are becoming intolerable." : "Manageable. The spectacle is distracting."}</p>
                        </div>
                    </div>

                    {/* SECTION: BIBLIOGRAPHY */}
                    <div className="mb-12 relative z-10">
                         <h2 className="flex items-center gap-3 font-display text-2xl text-gold-600 border-b-2 border-gold-600 pb-3 mb-6">
                            <LucideBook size={28} /> WORKS IN PROGRESS (1889)
                        </h2>
                        <div className="space-y-6">
                            {player.projects.map((proj, i) => (
                                <div key={i} className="relative pl-6 border-l-4 border-ink-200 group hover:border-gold-500 transition-colors">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <span className="font-bold text-xl font-display text-ink-900 dark:text-paper-100">{proj.title}</span>
                                        <span className="text-xs font-bold font-sans bg-ink-100 dark:bg-gray-700 text-ink-700 dark:text-gray-300 px-3 py-1 rounded-full tracking-wide">{proj.type}</span>
                                    </div>
                                    <p className="text-base font-sans text-ink-600 dark:text-gray-400 mb-3 leading-normal">{proj.description}</p>
                                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-gold-500" style={{ width: `${proj.progress}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION: ATTIRE */}
                    <div className="relative z-10">
                         <h2 className="flex items-center gap-3 font-display text-2xl text-gold-600 border-b-2 border-gold-600 pb-3 mb-6">
                            <LucideShirt size={28} /> ATTIRE
                        </h2>
                        <ul className="space-y-3 font-sans text-base text-ink-800 dark:text-gray-300">
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-gold-500 rounded-full"></span>
                                <span className="font-bold text-ink-900 dark:text-paper-100 w-24">Head:</span> 
                                {player.clothing.head}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-gold-500 rounded-full"></span>
                                <span className="font-bold text-ink-900 dark:text-paper-100 w-24">Body:</span> 
                                {player.clothing.body}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-gold-500 rounded-full"></span>
                                <span className="font-bold text-ink-900 dark:text-paper-100 w-24">Accessories:</span> 
                                {player.clothing.acc}
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PlayerModal;
