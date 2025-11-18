
import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { askNarrator } from '../services/geminiService';
import { LucideMic, LucideSend, LucideEye } from 'lucide-react';

const NarratorPanel: React.FC = () => {
    const { state, dispatch } = useGame();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [state.narratorLog]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput('');
        setLoading(true);

        // Add User Msg
        dispatch({ type: 'ADD_NARRATOR_MSG', payload: { id: Date.now().toString(), sender: 'PLAYER', text: userMsg } });

        // Call AI
        const context = `Zone: ${state.player.currentZoneId}. Stats: Wit ${state.player.stats.wit}, Malaise ${state.player.stats.malaise}. Nearby NPCs: ${state.npcs.filter(n => n.location.zoneId === state.player.currentZoneId).map(n => n.name).join(', ')}`;
        
        const response = await askNarrator(userMsg, context);
        
        dispatch({ type: 'ADD_NARRATOR_MSG', payload: { id: Date.now().toString() + 'dm', sender: 'DM', text: response } });
        setLoading(false);
    };

    return (
        <div className="w-full h-full bg-paper-800 dark:bg-gray-900 text-paper-100 flex flex-col shadow-inner border-l border-gold-600/30">
            <div className="p-2 bg-paper-900/50 border-b border-gold-600/20 flex items-center gap-2">
                <LucideEye size={14} className="text-gold-500"/>
                <span className="text-xs font-display tracking-widest text-gold-500">THE NARRATOR</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-serif text-base scrollbar-thin scrollbar-thumb-gold-600 scrollbar-track-transparent">
                {state.narratorLog.length === 0 && (
                    <p className="text-paper-100/30 italic text-center text-sm mt-4">Ask me to describe the scene...</p>
                )}
                {state.narratorLog.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'PLAYER' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[90%] rounded px-3 py-2 ${msg.sender === 'PLAYER' ? 'bg-gold-600/20 text-gold-100' : 'text-paper-100 italic'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && <div className="text-sm text-gold-500/50 animate-pulse ml-2">Observing...</div>}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-3 border-t border-gold-600/20 flex gap-2 bg-paper-900/30">
                <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="What do I smell?"
                    className="flex-1 bg-paper-900/50 border border-gold-600/30 rounded px-3 py-2 text-sm text-paper-100 focus:outline-none focus:border-gold-500 placeholder-paper-100/20"
                />
                <button type="submit" disabled={loading} className="text-gold-500 hover:text-gold-300 disabled:opacity-50 p-1">
                    <LucideSend size={18} />
                </button>
            </form>
        </div>
    );
};

export default NarratorPanel;
