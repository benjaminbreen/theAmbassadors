
import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { askNarrator } from '../services/geminiService';
import { LucideMic, LucideSend, LucideEye } from 'lucide-react';

// Simple markdown renderer for narrator text with drop cap support
const renderMarkdown = (text: string, isFirstMessage: boolean = false): React.ReactNode => {
    // Split by markdown patterns while keeping delimiters
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            // Bold text
            return <strong key={i} className="font-bold text-gold-700 dark:text-gold-400">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            // Italic text
            return <em key={i} className="italic text-ink-600 dark:text-paper-100/80">{part.slice(1, -1)}</em>;
        }
        // Apply drop cap to first character of first part in narrator messages
        if (i === 0 && isFirstMessage && part.length > 0) {
            const firstChar = part[0].toUpperCase();
            const rest = part.slice(1);
            return (
                <span key={i}>
                    <span className="float-left text-3xl font-display font-bold leading-none mr-1 mt-0.5 text-red-800 dark:text-gold-500">{firstChar}</span>
                    {rest}
                </span>
            );
        }
        return <span key={i}>{part}</span>;
    });
};

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
        <div className="w-full h-full bg-paper-100 dark:bg-gray-900 text-ink-900 dark:text-paper-100 flex flex-col shadow-inner">
            <div className="px-3 py-2 border-b border-ink-200 dark:border-gray-700 flex items-center gap-2 bg-paper-50 dark:bg-gray-800">
                <LucideEye size={12} className="text-gold-600"/>
                <span className="text-xs font-semibold tracking-widest text-gold-800 dark:text-gold-500">THE NARRATOR</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 font-serif text-base scrollbar-thin scrollbar-thumb-gold-600/30 scrollbar-track-transparent">
                {state.narratorLog.length === 0 && (
                    <p className="text-ink-400 dark:text-paper-100/30 italic text-center text-sm mt-3">Ask me to describe the scene...</p>
                )}
                {state.narratorLog.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'PLAYER' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[95%] rounded px-3 py-2 leading-relaxed ${msg.sender === 'PLAYER' ? 'bg-paper-200 dark:bg-gold-600/20 text-ink-700 dark:text-gold-100 text-sm italic border-l-2 border-ink-300 dark:border-gold-600' : 'text-ink-800 dark:text-paper-200'}`}>
                            {msg.sender === 'PLAYER' ? msg.text : renderMarkdown(msg.text, true)}
                        </div>
                    </div>
                ))}
                {loading && <div className="text-sm text-gold-600/60 dark:text-gold-500/50 animate-pulse ml-2">Observing...</div>}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-2 border-t border-ink-200 dark:border-gray-700 flex gap-2 bg-paper-50 dark:bg-gray-800">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="What do I smell?"
                    className="flex-1 bg-white dark:bg-gray-900 border border-ink-200 dark:border-gray-600 rounded px-3 py-1.5 text-sm text-ink-900 dark:text-paper-100 focus:outline-none focus:border-gold-500 placeholder-ink-300 dark:placeholder-paper-100/20"
                />
                <button type="submit" disabled={loading} className="text-gold-600 hover:text-gold-500 disabled:opacity-50 p-1">
                    <LucideSend size={16} />
                </button>
            </form>
        </div>
    );
};

export default NarratorPanel;
