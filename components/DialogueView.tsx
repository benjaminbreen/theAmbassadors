
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import InventoryPanel from './InventoryPanel';
import { LucideMessageSquare, LucideLogOut, LucideSword, LucideGift, LucideX } from 'lucide-react';

const DialogueView: React.FC = () => {
    const { state, dispatch } = useGame();
    const { dialogue } = state;
    const [input, setInput] = useState('');
    const [showInventory, setShowInventory] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [dialogue?.history]);

    if (!dialogue) return null;

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || dialogue.isTyping) return;
        dispatch({ type: 'SEND_CHAT_MESSAGE', payload: input });
        setInput('');
    };

    return (
        <div className="flex flex-col h-full w-full p-4 relative overflow-hidden">
             {/* Header */}
             <div className="flex items-center justify-between border-b-2 border-gold-500/30 pb-2 mb-4">
                 <div>
                     <h2 className="font-display text-2xl text-ink-900 dark:text-gold-500">{dialogue.npc.name}</h2>
                     <span className="text-xs font-serif italic text-ink-500 dark:text-gray-400">{dialogue.npc.profession}</span>
                 </div>
                 <div className="flex gap-2">
                     <button 
                        onClick={() => setShowInventory(!showInventory)} 
                        className="p-2 rounded bg-paper-200 hover:bg-gold-100 text-ink-900 text-xs flex items-center gap-1 shadow border border-ink-900/10 transition-colors"
                        title="Offer Item"
                     >
                         <LucideGift size={16} />
                     </button>
                     <button 
                        onClick={() => dispatch({ type: 'SWITCH_TO_COMBAT' })}
                        className="p-2 rounded bg-red-100 hover:bg-red-200 text-red-900 text-xs flex items-center gap-1 shadow border border-red-900/10 transition-colors"
                        title="Duel of Wits"
                     >
                         <LucideSword size={16} />
                     </button>
                     <button 
                        onClick={() => dispatch({ type: 'LEAVE_DIALOGUE' })}
                        className="p-2 rounded bg-gray-200 hover:bg-gray-300 text-ink-900 text-xs flex items-center gap-1 shadow border border-ink-900/10 transition-colors"
                        title="Excuse Yourself"
                     >
                         <LucideLogOut size={16} />
                     </button>
                 </div>
             </div>

             {/* Inventory Overlay */}
             {showInventory && (
                 <div className="absolute top-16 right-4 w-96 h-96 bg-paper-50 dark:bg-gray-800 border-2 border-gold-500 shadow-2xl rounded-lg z-20 animate-fade-in overflow-hidden flex flex-col">
                     <div className="p-3 border-b border-gold-500/20 flex justify-between items-center bg-gold-500/10">
                         <span className="text-sm font-bold font-display text-gold-700 dark:text-gold-400">OFFER ITEM TO {dialogue.npc.name.toUpperCase()}</span>
                         <button onClick={() => setShowInventory(false)} className="hover:text-red-500"><LucideX size={16}/></button>
                     </div>
                     <div className="flex-1 overflow-hidden p-2">
                         <InventoryPanel
                             inventory={state.player.inventory}
                             compact
                             onItemClick={(item) => {
                                 dispatch({ type: 'OFFER_ITEM', payload: item });
                                 setShowInventory(false);
                             }}
                         />
                     </div>
                 </div>
             )}

             {/* Chat History */}
             <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4" ref={scrollRef}>
                 {dialogue.history.length === 0 && dialogue.isTyping && (
                     <div className="text-center italic text-gray-400 text-sm mt-10">
                         {dialogue.npc.name} clears their throat...
                     </div>
                 )}
                 
                 {dialogue.history.map((msg, i) => (
                     <div key={i} className={`flex flex-col ${msg.sender === 'PLAYER' ? 'items-end' : 'items-start'}`}>
                         <div 
                            className={`
                                max-w-[80%] rounded-lg px-4 py-3 shadow-sm relative
                                ${msg.sender === 'PLAYER' ? 'bg-ink-800 text-paper-100 rounded-br-none' : 'bg-paper-50 text-ink-900 border border-ink-100 rounded-bl-none'}
                                ${msg.isAction ? 'italic bg-transparent border-none shadow-none text-gray-500' : ''}
                            `}
                        >
                            {!msg.isAction && msg.text}
                            {msg.isAction && <span className="flex items-center gap-2"><LucideGift size={12}/> {msg.text}</span>}
                        </div>
                     </div>
                 ))}
                 
                 {dialogue.isTyping && (
                     <div className="flex items-start">
                         <div className="bg-paper-50 border border-ink-100 rounded-lg rounded-bl-none px-4 py-3 shadow-sm">
                             <span className="flex gap-1">
                                 <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                 <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                 <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                             </span>
                         </div>
                     </div>
                 )}
             </div>

             {/* Input Area */}
             <form onSubmit={handleSend} className="relative">
                 <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your response..."
                    className="w-full bg-paper-50 dark:bg-gray-800 border-2 border-ink-200 dark:border-gray-600 rounded-full px-4 py-3 pr-12 focus:outline-none focus:border-gold-500 transition-colors font-serif"
                    autoFocus
                 />
                 <button 
                    type="submit" 
                    disabled={!input.trim() || dialogue.isTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-ink-900 text-gold-500 rounded-full hover:bg-gold-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                     <LucideMessageSquare size={18} />
                 </button>
             </form>
        </div>
    );
};

export default DialogueView;
