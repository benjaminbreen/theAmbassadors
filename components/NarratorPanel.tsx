
import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { askNarrator } from '../services/geminiService';
import { LucideSend, LucideEye } from 'lucide-react';
import { playSound } from '../services/audioService';

// Rotating placeholder prompts that change every 1-2 minutes
const NARRATOR_PROMPTS = [
    "What do I smell?",
    "What am I thinking?",
    "Who else is here?",
    "Describe my surroundings",
    "What sounds do I hear?",
    "What catches my eye?",
    "How do I feel?",
    "What's happening nearby?",
    "What time does it seem?",
    "What's in the shadows?",
    "Who is watching me?",
    "What memories surface?",
    "What would William say?",
    "Describe the light",
    "What's the mood here?",
    "What am I missing?",
    "Who just passed by?",
    "What draws my attention?",
    "What's peculiar here?",
    "What does this remind me of?",
    "What conversation do I overhear?",
    "What would Constance notice?",
    "Is someone following me?",
    "What's that sound?",
];

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
    const [placeholder, setPlaceholder] = useState(() =>
        NARRATOR_PROMPTS[Math.floor(Math.random() * NARRATOR_PROMPTS.length)]
    );

    // Rotate placeholder every 60-120 seconds
    useEffect(() => {
        const rotateInterval = setInterval(() => {
            setPlaceholder(prev => {
                let next = NARRATOR_PROMPTS[Math.floor(Math.random() * NARRATOR_PROMPTS.length)];
                // Avoid repeating the same prompt
                while (next === prev && NARRATOR_PROMPTS.length > 1) {
                    next = NARRATOR_PROMPTS[Math.floor(Math.random() * NARRATOR_PROMPTS.length)];
                }
                return next;
            });
        }, 60000 + Math.random() * 60000); // 60-120 seconds

        return () => clearInterval(rotateInterval);
    }, []);

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

        // Handle 'stand' command when sitting
        const lowerMsg = userMsg.toLowerCase().trim();
        if (lowerMsg === 'stand' || lowerMsg === 'stand up' || lowerMsg === 'get up' || lowerMsg === 'rise') {
            if (state.player.isSitting) {
                dispatch({ type: 'STAND_UP' });
                dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
                    id: Date.now().toString(),
                    sender: 'PLAYER',
                    text: userMsg
                }});
                const standResponses = [
                    'You rise from the cushion, your contemplation interrupted by the demands of locomotion.',
                    'With deliberate motion, you return to the vertical state that civilization requires of its participants.',
                    'You stand, the world reasserting its claim on your attention.',
                    'The interlude of rest concludes. You rise to continue your survey of this remarkable display of human ambition.'
                ];
                dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
                    id: Date.now().toString() + 'dm',
                    sender: 'DM',
                    text: standResponses[Math.floor(Math.random() * standResponses.length)]
                }});
                return;
            } else {
                // Not sitting - interpret as regular query
                dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
                    id: Date.now().toString(),
                    sender: 'PLAYER',
                    text: userMsg
                }});
                dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
                    id: Date.now().toString() + 'dm',
                    sender: 'DM',
                    text: 'You are already standing, though the observation carries a certain metaphysical weight.'
                }});
                return;
            }
        }

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
            {/* Compact header matching game UI style */}
            <div className="px-3 py-1.5 border-b border-ink-200 dark:border-gray-700 flex items-center justify-center gap-2 bg-paper-50 dark:bg-gray-800">
                <span className="text-gold-500/70 text-xs">―</span>
                <LucideEye size={12} className="text-gold-600"/>
                <span className="text-xs font-display font-semibold tracking-[0.15em] uppercase text-gold-700 dark:text-gold-500">
                    The Narrator
                </span>
                <span className="text-gold-500/70 text-xs">―</span>
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

            <form onSubmit={(e) => { playSound('UI_CLICK'); handleSubmit(e); }} className="p-2 border-t border-ink-200 dark:border-gray-700 flex gap-2 items-center bg-paper-100 dark:bg-gray-800">
                <style>{`
                    .narrator-input {
                        flex: 1;
                        background: #FFFFFF;
                        border: 1px solid #D4C4A8;
                        border-radius: 4px;
                        padding: 8px 14px;
                        font-size: 18px;
                        color: #1a1a1a;
                        transition: all 0.25s ease;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                    }
                    .narrator-input::placeholder {
                        color: #999;
                    }
                    .narrator-input:focus {
                        outline: none;
                        border-color: #C9963C;
                        background: #FFFFFE;
                        box-shadow:
                            0 0 0 1px rgba(201,150,60,0.3),
                            0 0 20px rgba(255,255,255,0.8),
                            0 0 30px rgba(255,252,245,0.6),
                            0 2px 8px rgba(0,0,0,0.06);
                    }
                    .dark .narrator-input {
                        background: #1a1f2e;
                        border-color: #4a5568;
                        color: #e2e8f0;
                    }
                    .dark .narrator-input::placeholder {
                        color: #64748b;
                    }
                    .dark .narrator-input:focus {
                        border-color: #B8860B;
                        background: #1f2535;
                        box-shadow:
                            0 0 0 1px rgba(184,134,11,0.3),
                            0 0 15px rgba(184,134,11,0.15),
                            0 2px 8px rgba(0,0,0,0.15);
                    }
                    .send-btn-circle {
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        background: #FFFFFF;
                        border: 1px solid #ddd;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        cursor: pointer;
                        transition: all 0.15s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        flex-shrink: 0;
                    }
                    .send-btn-circle svg {
                        color: #C9963C;
                        transition: all 0.15s ease;
                    }
                    .send-btn-circle:hover:not(:disabled) {
                        border-color: #D4A84B;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.12), 0 0 0 2px rgba(212,168,75,0.15);
                    }
                    .send-btn-circle:hover:not(:disabled) svg {
                        color: #B8860B;
                        filter: drop-shadow(0 0 3px rgba(212,168,75,0.4));
                    }
                    .send-btn-circle.has-text {
                        background: #FFFFFF;
                        border: 1.5px solid #C9963C;
                        box-shadow:
                            0 3px 6px rgba(0,0,0,0.15),
                            0 1px 2px rgba(0,0,0,0.1),
                            inset 0 -2px 0 rgba(0,0,0,0.03);
                        transform: translateY(-1px);
                    }
                    .send-btn-circle.has-text svg {
                        color: #B8860B;
                    }
                    .send-btn-circle.has-text:hover {
                        background: linear-gradient(180deg, #FFFFFF 0%, #FFF9F0 100%);
                        border-color: #B8860B;
                        box-shadow:
                            0 4px 8px rgba(0,0,0,0.18),
                            0 2px 4px rgba(0,0,0,0.1),
                            0 0 12px rgba(212,168,75,0.2),
                            inset 0 -2px 0 rgba(0,0,0,0.02);
                        transform: translateY(-2px);
                    }
                    .send-btn-circle.has-text:hover svg {
                        color: #8B6508;
                        filter: drop-shadow(0 1px 0 rgba(255,220,150,0.6)) drop-shadow(0 0 4px rgba(212,168,75,0.5));
                        transform: scale(1.05);
                    }
                    @keyframes btn-press {
                        0% { transform: translateY(-1px) scale(1); }
                        30% { transform: translateY(2px) scale(0.95); }
                        50% { transform: translateY(2px) scale(0.95); }
                        100% { transform: translateY(-1px) scale(1); }
                    }
                    .send-btn-circle.has-text:active {
                        animation: btn-press 0.25s ease-out;
                        background: linear-gradient(180deg, #FFF8E8 0%, #F5E8D0 100%);
                        border-color: #8B6508;
                        box-shadow:
                            0 1px 2px rgba(0,0,0,0.2),
                            inset 0 2px 4px rgba(139,101,8,0.15);
                    }
                    .send-btn-circle.has-text:active svg {
                        color: #654321;
                        filter: drop-shadow(0 1px 0 rgba(255,220,150,0.4));
                        transform: scale(0.95);
                    }
                    .send-btn-circle:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                `}</style>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={placeholder}
                    className="narrator-input"
                />
                <button type="submit" disabled={loading} className={`send-btn-circle ${input.trim() ? 'has-text' : ''}`}>
                    <LucideSend size={16} />
                </button>
            </form>
        </div>
    );
};

export default NarratorPanel;
