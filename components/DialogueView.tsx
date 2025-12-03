
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import InventoryPanel from './InventoryPanel';
import { NPC } from '../types';
import { LucideMessageSquare, LucideLogOut, LucideSword, LucideGift, LucideX } from 'lucide-react';
import { getFlagEmoji } from '../utils/nationalityFlags';

const MAX_INPUT_LENGTH = 500;

// Simple markdown renderer for dialogue text
const renderMarkdown = (text: string): React.ReactNode => {
    // Split by markdown patterns while keeping delimiters
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            // Bold text
            return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            // Italic text
            return <em key={i} className="italic">{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
    });
};

// Generate a prose description of NPC based on their stats
const generateNpcDescription = (npc: NPC): string => {
    const { age, gender, combatStats, profession, id } = npc;

    // Age descriptor
    const ageDesc = age < 25 ? 'young' :
                    age < 35 ? '' :
                    age < 50 ? 'middle-aged' :
                    age < 65 ? 'mature' : 'elderly';

    // Gender descriptor
    const genderDesc = gender === 'male' ? 'man' :
                       gender === 'female' ? 'woman' : 'person';

    // Wit description (intelligence/cleverness)
    const witDesc = combatStats.wit >= 16 ? 'with a razor-sharp wit' :
                    combatStats.wit >= 13 ? 'of evident intelligence' :
                    combatStats.wit >= 10 ? 'of reasonable cleverness' :
                    combatStats.wit >= 7 ? 'of modest intellectual bearing' :
                    'of simple demeanor';

    // Observation description (perceptiveness)
    const obsDesc = combatStats.observation >= 16 ? 'whose keen eyes miss nothing' :
                    combatStats.observation >= 13 ? 'with a perceptive gaze' :
                    combatStats.observation >= 10 ? 'with attentive eyes' :
                    combatStats.observation >= 7 ? 'of somewhat distracted air' :
                    'who seems lost in thought';

    // Composure description (social confidence)
    const compDesc = combatStats.composure >= 16 ? 'exuding an unshakeable confidence' :
                     combatStats.composure >= 13 ? 'carrying themselves with poise' :
                     combatStats.composure >= 10 ? 'of steady bearing' :
                     combatStats.composure >= 7 ? 'with a somewhat nervous manner' :
                     'who appears rather anxious';

    // Mannerisms based on stats - use NPC id for deterministic selection
    const idHash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const nervousMannerisms = [
        'They chew a fingernail intermittently throughout your conversation.',
        'They keep clearing their throat nervously.',
        'Their eyes dart around the room as they speak.',
        'They fidget with a button on their coat.',
        'They shift their weight from foot to foot.',
        'They twist a ring on their finger repeatedly.'
    ];

    const confidentMannerisms = [
        'They maintain steady eye contact as they speak.',
        'They gesture expansively while making their points.',
        'They speak with measured, deliberate pauses.',
        'They stand with perfect posture throughout.',
        'They have a habit of stroking their chin thoughtfully.',
        'They punctuate their words with knowing nods.'
    ];

    const observantMannerisms = [
        'Their gaze lingers on every detail of your attire.',
        'They seem to catalogue each person passing by.',
        'They notice and comment on the smallest changes around them.',
        'Their eyes flick to the door whenever it opens.',
        'They appear to be mentally cataloguing everything.',
        'They lean in slightly, as if to catch every nuance.'
    ];

    const wittyMannerisms = [
        'A sardonic smile plays at the corner of their lips.',
        'They raise an eyebrow with evident amusement.',
        'They pepper their speech with ironic asides.',
        'A glint of mischief appears in their eyes.',
        'They seem perpetually on the verge of a witticism.',
        'They chuckle softly at their own observations.'
    ];

    // Select mannerism based on dominant trait
    let mannerism = '';
    if (combatStats.composure < 8) {
        mannerism = nervousMannerisms[idHash % nervousMannerisms.length];
    } else if (combatStats.composure >= 14) {
        mannerism = confidentMannerisms[idHash % confidentMannerisms.length];
    } else if (combatStats.observation >= 14) {
        mannerism = observantMannerisms[idHash % observantMannerisms.length];
    } else if (combatStats.wit >= 14) {
        mannerism = wittyMannerisms[idHash % wittyMannerisms.length];
    } else {
        // Default mannerisms for average stats
        const defaultMannerisms = [
            'They speak in a measured, thoughtful manner.',
            'They listen attentively before responding.',
            'They occasionally glance at passers-by.',
            'They maintain a pleasant, neutral expression.',
            'They nod politely as they consider your words.'
        ];
        mannerism = defaultMannerisms[idHash % defaultMannerisms.length];
    }

    // Build the description
    const ageGender = ageDesc ? `A ${ageDesc} ${genderDesc}` : `A ${genderDesc}`;

    return `${ageGender} of ${age} years, ${witDesc}, ${obsDesc}, ${compDesc}. ${mannerism}`;
};

const DialogueView: React.FC = () => {
    const { state, dispatch } = useGame();
    const { dialogue } = state;
    const [input, setInput] = useState('');
    const [showInventory, setShowInventory] = useState(false);
    const [speakingFrame, setSpeakingFrame] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat history
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [dialogue?.history]);

    // Speaking animation (voice sounds handled in App.tsx right sidebar)
    useEffect(() => {
        if (dialogue?.isTyping) {
            const animInterval = setInterval(() => {
                setSpeakingFrame(prev => (prev + 1) % 3);
            }, 150);

            return () => {
                clearInterval(animInterval);
                setSpeakingFrame(0);
            };
        }
    }, [dialogue?.isTyping]);

    if (!dialogue) return null;

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || dialogue.isTyping) return;
        dispatch({ type: 'SEND_CHAT_MESSAGE', payload: input });
        setInput('');
    };

    // Handle leaving dialogue with malaise effects
    const handleLeaveDialogue = () => {
        const exchangeCount = dialogue.history.filter(m => m.sender === 'PLAYER').length;
        // Good conversation (3+ exchanges) reduces malaise
        if (exchangeCount >= 3) {
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'malaise', delta: -5 } });
        }
        dispatch({ type: 'LEAVE_DIALOGUE' });
    };

    // Handle switching to combat - increases malaise due to confrontation
    const handleSwitchToCombat = () => {
        dispatch({ type: 'ADJUST_STAT', payload: { stat: 'malaise', delta: 8 } });
        dispatch({ type: 'SWITCH_TO_COMBAT' });
    };

    return (
        <div className="flex flex-col flex-1 w-full bg-paper-100 dark:bg-ink-900 overflow-hidden min-h-0">
             {/* Header - cleaner without sprite */}
             <div className="flex items-start justify-between border-b-2 border-gold-500/30 pb-3 px-5 pt-3 shrink-0">
                 {/* NPC Info */}
                 <div className="flex-1">
                     <h2 className="font-display text-2xl text-ink-900 dark:text-gold-500 font-bold">{dialogue.npc.name}</h2>
                     <div className="flex items-center gap-3 mt-1">
                         <span className="text-base font-serif italic text-ink-600 dark:text-gray-400">{dialogue.npc.profession}</span>
                         <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded text-xs font-semibold border border-amber-300/50 dark:border-amber-600/30">
                             {getFlagEmoji(dialogue.npc.nationality)} {dialogue.npc.nationality || 'French'}
                         </span>
                     </div>
                 </div>

                 {/* Action Buttons - positioned at top right */}
                 <div className="flex gap-1.5 -mt-1 -mr-1">
                     <button
                        onClick={() => setShowInventory(!showInventory)}
                        className="p-2 rounded bg-paper-200 hover:bg-gold-100 text-ink-900 shadow-sm border border-ink-900/10 transition-colors"
                        title="Offer Item"
                     >
                         <LucideGift size={16} />
                     </button>
                     <button
                        onClick={handleSwitchToCombat}
                        className="p-2 rounded bg-red-100 hover:bg-red-200 text-red-900 shadow-sm border border-red-900/10 transition-colors"
                        title="Duel of Wits (+8 Malaise)"
                     >
                         <LucideSword size={16} />
                     </button>
                     <button
                        onClick={handleLeaveDialogue}
                        className="p-2 rounded bg-gray-200 hover:bg-gray-300 text-ink-900 shadow-sm border border-ink-900/10 transition-colors"
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
             <div className="flex-1 overflow-y-auto space-y-4 px-5 py-4 min-h-0" ref={scrollRef}>
                 {dialogue.history.length === 0 && dialogue.isTyping && (
                     <div className="text-center italic text-ink-400 dark:text-gray-500 text-lg mt-10">
                         {dialogue.npc.name} clears their throat...
                     </div>
                 )}

                 {dialogue.history.map((msg, i) => (
                     <div key={i} className={`flex flex-col ${msg.sender === 'PLAYER' ? 'items-end' : 'items-start'}`}>
                         <div
                            className={`
                                max-w-[85%] rounded-lg px-5 py-4 shadow-sm relative text-lg leading-relaxed
                                ${msg.sender === 'PLAYER'
                                    ? 'bg-slate-800 text-white rounded-br-none border border-slate-700'
                                    : 'bg-paper-50 dark:bg-gray-800 text-ink-900 dark:text-paper-100 border border-ink-200 dark:border-gray-600 rounded-bl-none'}
                                ${msg.isAction ? 'italic !bg-transparent !border-none !shadow-none !text-ink-500 dark:!text-gray-400' : ''}
                            `}
                        >
                            {!msg.isAction && renderMarkdown(msg.text)}
                            {msg.isAction && <span className="flex items-center gap-2"><LucideGift size={16}/> {msg.text}</span>}
                        </div>
                        <span className="text-sm text-ink-400 dark:text-gray-500 mt-1 px-1">
                            {msg.sender === 'PLAYER' ? 'Henry James' : dialogue.npc.name.split(' ')[0]}
                        </span>
                     </div>
                 ))}

                 {dialogue.isTyping && (
                     <div className="flex flex-col items-start">
                         <div className="bg-paper-50 dark:bg-gray-800 border border-ink-200 dark:border-gray-600 rounded-lg rounded-bl-none px-5 py-4 shadow-sm">
                             <span className="flex gap-1.5">
                                 <span className="w-2.5 h-2.5 bg-ink-400 dark:bg-gray-500 rounded-full animate-bounce"></span>
                                 <span className="w-2.5 h-2.5 bg-ink-400 dark:bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                 <span className="w-2.5 h-2.5 bg-ink-400 dark:bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                             </span>
                         </div>
                         <span className="text-sm text-ink-400 dark:text-gray-500 mt-1 px-1">{dialogue.npc.name.split(' ')[0]} is typing...</span>
                     </div>
                 )}
             </div>

             {/* Input Area */}
             <form onSubmit={handleSend} className="relative px-5 py-4 shrink-0 border-t border-gold-500/20">
                 <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
                    placeholder="Type your response..."
                    className="w-full bg-white dark:bg-gray-800 text-ink-900 dark:text-paper-100 border-2 border-ink-300 dark:border-gray-600 rounded-lg px-5 py-4 pr-28 focus:outline-none focus:border-gold-500 transition-colors font-serif text-lg shadow-inner"
                    autoFocus
                    maxLength={MAX_INPUT_LENGTH}
                 />
                 <div className="absolute right-24 top-1/2 -translate-y-1/2 text-sm text-ink-400 dark:text-gray-500">
                    {input.length}/{MAX_INPUT_LENGTH}
                 </div>
                 <button
                    type="submit"
                    disabled={!input.trim() || dialogue.isTyping}
                    className="absolute right-7 top-1/2 -translate-y-1/2 px-4 py-2 bg-gold-600 text-white rounded font-display text-base hover:bg-gold-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                     Speak
                 </button>
             </form>
        </div>
    );
};

export default DialogueView;
