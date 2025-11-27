
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { generateCombatLoot } from '../services/itemGenerator';
import { playSound, startBattleMusic, stopBattleMusic } from '../services/audioService';
import { evaluateCombatRemark } from '../services/geminiService';
import { CombatCard, NPC } from '../types';
import { LucideSword, LucideShield, LucideEye, LucideX, LucideSend, LucideTimer } from 'lucide-react';
import AsciiPortrait from './AsciiPortrait';

// Hardcoded NPC barbed remarks pool - organized by profession type and tone
const NPC_REMARKS = {
    condescending: [
        "I see you fancy yourself an observer of society. How quaint.",
        "One might expect more... finesse from a man of letters.",
        "Your reputation precedes you, though I confess the reality disappoints.",
        "How charming that Americans believe travel confers sophistication.",
        "I had heard you were clever. Evidently, rumor exaggerates.",
        "Your observation would be insightful, had it any basis in reality.",
        "Do they not teach rhetoric in the New World?",
        "I see the transatlantic crossing has not improved your wit.",
    ],
    dismissive: [
        "*adjusts monocle* Was that meant to be clever?",
        "I'm afraid that remark fell rather flat, Mr. James.",
        "Perhaps you should confine yourself to fiction.",
        "Your words, like your novels, meander without purpose.",
        "I've heard sharper observations from my valet.",
        "How very... American of you to say so.",
        "*yawns delicately* You were saying?",
        "One struggles to find the substance in your remark.",
    ],
    intellectual: [
        "Your syllogism contains a rather glaring flaw, I'm afraid.",
        "A curious interpretation, though historically indefensible.",
        "I see you've adopted the continental fashion for shallow paradox.",
        "Your premise, while superficially clever, collapses upon examination.",
        "That perspective betrays a certain... parochialism of thought.",
        "Even Emerson would blush at such transcendental nonsense.",
        "Your argument, like your prose, suffers from excessive ornamentation.",
        "I detect the influence of second-rate philosophy poorly digested.",
    ],
    cutting: [
        "Ah, the expatriate speaks! Do continue your performance.",
        "Your accent betrays you as surely as your argument.",
        "I'm told your books sell tolerably well. To whom, I wonder?",
        "One notices you observe much but comprehend little.",
        "That insight might impress the ladies of Newport.",
        "Your reputation for subtlety appears somewhat overstated.",
        "How bold of you to venture an opinion on matters beyond your ken.",
        "I see why you prefer to write rather than speak.",
    ],
    aristocratic: [
        "The bourgeois perspective, while amusing, lacks refinement.",
        "One forgets Americans have no proper sense of station.",
        "Your democratic sensibilities are showing, Mr. James.",
        "In civilized society, we couch such observations more delicately.",
        "Perhaps in Boston such directness passes for wit.",
        "The nouveau riche always confuse candor with intelligence.",
        "Breeding, Mr. James, tells in the smallest exchanges.",
        "One sees the merchant class in your every syllable.",
    ],
    artistic: [
        "Your aesthetic sense appears as crude as your politics.",
        "I had hoped for something more... impressionistic.",
        "Even the Salon des Refusés would reject such banality.",
        "Art requires vision; you offer only myopia.",
        "The Philistine speaks, and culture weeps.",
        "Your taste, like your tie, belongs to a previous decade.",
        "I see you approach conversation as you do literature—with plodding earnestness.",
        "Beauty escapes those who pursue it so clumsily.",
    ]
};

// Get a random remark based on NPC stats
const getRandomNpcRemark = (npc: NPC): { text: string; category: string } => {
    const categories = Object.keys(NPC_REMARKS) as (keyof typeof NPC_REMARKS)[];

    // Weight category selection based on NPC stats
    let selectedCategory: keyof typeof NPC_REMARKS;
    const wit = npc.combatStats?.wit || 10;
    const composure = npc.combatStats?.composure || 10;
    const observation = npc.combatStats?.observation || 10;

    if (wit >= 14) {
        selectedCategory = Math.random() > 0.5 ? 'intellectual' : 'cutting';
    } else if (composure >= 14) {
        selectedCategory = Math.random() > 0.5 ? 'aristocratic' : 'condescending';
    } else if (observation >= 14) {
        selectedCategory = Math.random() > 0.5 ? 'dismissive' : 'artistic';
    } else {
        selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    }

    const remarks = NPC_REMARKS[selectedCategory];
    const text = remarks[Math.floor(Math.random() * remarks.length)];

    return { text, category: selectedCategory };
};

// Calculate damage based on NPC stats
const calculateNpcDamage = (npc: NPC): number => {
    const wit = npc.combatStats?.wit || 10;
    const composure = npc.combatStats?.composure || 10;

    // Base damage 5-8, modified by stats
    const baseDamage = 5 + Math.floor(Math.random() * 4);
    const witBonus = Math.floor((wit - 10) / 2);
    const composureBonus = Math.floor((composure - 10) / 3);

    return Math.max(3, Math.min(18, baseDamage + witBonus + composureBonus));
};

// Evaluate player remark quality using LLM
// Uses the centralized geminiService for LLM calls
const evaluatePlayerRemark = async (
    playerText: string,
    cardType: string,
    npc: NPC,
    battleContext: string[]
): Promise<{
    quality: 'excellent' | 'good' | 'weak' | 'backfire';
    damageMultiplier: number;
    npcResponse: string;
    npcDamage: number;
    analysis: string;
}> => {
    return evaluateCombatRemark(
        playerText,
        cardType,
        npc.name,
        npc.profession,
        npc.age,
        npc.combatStats?.wit || 10,
        npc.combatStats?.observation || 10,
        npc.combatStats?.composure || 10,
        battleContext
    );
};

const CombatView: React.FC = () => {
    const { state, dispatch } = useGame();
    const { combat } = state;
    const [isThinking, setIsThinking] = useState(false);
    const [flyingText, setFlyingText] = useState<{text: string, type: 'player' | 'npc' | 'backfire'} | null>(null);
    const [opponentCard, setOpponentCard] = useState<{text: string, damage: number, category?: string} | null>(null);
    const [roundCount, setRoundCount] = useState(1);
    const [totalDamageDealt, setTotalDamageDealt] = useState(0);
    const [totalDamageReceived, setTotalDamageReceived] = useState(0);

    // Player input state
    const [selectedCard, setSelectedCard] = useState<CombatCard | null>(null);
    const [playerInput, setPlayerInput] = useState('');
    const [showInputModal, setShowInputModal] = useState(false);

    // Resolution state
    const [showResolution, setShowResolution] = useState(false);
    const [resolutionText, setResolutionText] = useState('');

    // NPC auto-attack state
    const [npcAttackTimer, setNpcAttackTimer] = useState(25); // Seconds until NPC attacks
    const [lastQuality, setLastQuality] = useState<string | null>(null);
    const npcAttackIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const MAX_TURNS = 8; // Increased since NPC attacks autonomously

    // Start battle music when combat begins
    useEffect(() => {
        if (!state.audio.muted) {
            startBattleMusic();
        }
        return () => {
            stopBattleMusic();
        };
    }, []);

    // Handle mute toggle
    useEffect(() => {
        if (state.audio.muted) {
            stopBattleMusic();
        } else {
            startBattleMusic();
        }
    }, [state.audio.muted]);

    // NPC autonomous attack system
    const executeNpcAttack = useCallback(() => {
        if (!combat || showResolution || isThinking || showInputModal) return;

        const { text, category } = getRandomNpcRemark(combat.opponent);
        const damage = calculateNpcDamage(combat.opponent);

        if (!state.audio.muted) playSound('DAMAGE');
        dispatch({ type: 'TRIGGER_SHAKE' });

        setOpponentCard({ text, damage, category });
        setFlyingText({ text: `-${damage} Composure!`, type: 'npc' });

        const newPlayerHp = Math.max(0, combat.playerHp - damage);

        dispatch({ type: 'ADD_LOG', payload: {
            id: Date.now().toString(),
            type: 'COMBAT',
            text: `${combat.opponent.name}: "${text}" (-${damage} Composure)`,
            timestamp: Date.now(),
            speaker: combat.opponent.name
        }});

        // Update social anxiety (reputation)
        dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: -Math.floor(damage / 2) } });

        setTotalDamageReceived(prev => prev + damage);

        dispatch({ type: 'UPDATE_COMBAT', payload: {
            playerHp: newPlayerHp,
            opponentHp: combat.opponentHp,
            log: [...combat.log, `${combat.opponent.name}: ${text} (-${damage})`]
        }});

        // Check for defeat
        if (newPlayerHp <= 0) {
            generateResolution('defeat');
        }

        // Reset timer for next attack (random 20-30 seconds)
        setNpcAttackTimer(20 + Math.floor(Math.random() * 11));
    }, [combat, showResolution, isThinking, showInputModal, state.audio.muted, dispatch]);

    // Timer countdown and auto-attack
    useEffect(() => {
        if (!combat || showResolution) return;

        // Countdown timer
        timerIntervalRef.current = setInterval(() => {
            setNpcAttackTimer(prev => {
                if (prev <= 1) {
                    return 25; // Reset will happen in attack
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, [combat, showResolution]);

    // Execute attack when timer hits 0
    useEffect(() => {
        if (npcAttackTimer <= 0 && !showResolution && !isThinking) {
            executeNpcAttack();
        }
    }, [npcAttackTimer, showResolution, isThinking, executeNpcAttack]);

    // Flying text cleanup
    useEffect(() => {
        if (flyingText) {
            const timer = setTimeout(() => setFlyingText(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [flyingText]);

    if (!combat || !combat.opponent) return null;

    const handleCardClick = (card: CombatCard) => {
        if (isThinking) return;
        setSelectedCard(card);
        setShowInputModal(true);
        setPlayerInput('');
    };

    const handleSubmitInput = async () => {
        if (!selectedCard || !playerInput.trim()) return;

        const card = selectedCard;
        const customText = playerInput.trim();

        setShowInputModal(false);
        setIsThinking(true);
        setLastQuality(null);

        try {
            // Evaluate the player's remark
            const evaluation = await evaluatePlayerRemark(
                customText,
                card.type,
                combat.opponent,
                combat.log
            );

            setLastQuality(evaluation.quality);

            // Calculate actual damage dealt
            const baseDamage = card.damage || 10;
            const actualDamage = Math.round(baseDamage * evaluation.damageMultiplier);

            // Handle backfire
            if (evaluation.quality === 'backfire') {
                if (!state.audio.muted) playSound('ERROR');
                setFlyingText({ text: 'BACKFIRE!', type: 'backfire' });

                // Player takes extra damage, deals none
                const backfireDamage = evaluation.npcDamage + 5;
                const newPlayerHp = Math.max(0, combat.playerHp - backfireDamage);

                dispatch({ type: 'ADD_LOG', payload: {
                    id: Date.now().toString(),
                    type: 'COMBAT',
                    text: `You: "${customText}" — BACKFIRE! Your remark falls flat.`,
                    timestamp: Date.now()
                }});

                setOpponentCard({ text: evaluation.npcResponse, damage: backfireDamage });

                dispatch({ type: 'ADD_LOG', payload: {
                    id: Date.now().toString(),
                    type: 'COMBAT',
                    text: `${combat.opponent.name}: "${evaluation.npcResponse}" (-${backfireDamage} Composure)`,
                    timestamp: Date.now(),
                    speaker: combat.opponent.name
                }});

                setTotalDamageReceived(prev => prev + backfireDamage);
                dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: -10 } });

                dispatch({ type: 'UPDATE_COMBAT', payload: {
                    playerHp: newPlayerHp,
                    opponentHp: combat.opponentHp,
                    log: [...combat.log, `You: ${customText} (BACKFIRE!)`, `${combat.opponent.name}: ${evaluation.npcResponse} (-${backfireDamage})`]
                }});

                if (newPlayerHp <= 0) {
                    await generateResolution('defeat');
                }
            } else {
                // Normal exchange
                if (!state.audio.muted) playSound('ATTACK');

                const qualityText = evaluation.quality === 'excellent' ? '★ EXCELLENT!' :
                                   evaluation.quality === 'weak' ? '(weak)' : '';

                setFlyingText({ text: `-${actualDamage} ${qualityText}`, type: 'player' });

                const newOpponentHp = Math.max(0, combat.opponentHp - actualDamage);
                const newPlayerHp = Math.max(0, combat.playerHp - evaluation.npcDamage);

                dispatch({ type: 'ADD_LOG', payload: {
                    id: Date.now().toString(),
                    type: 'COMBAT',
                    text: `You: "${customText}" ${qualityText} (-${actualDamage} to opponent)`,
                    timestamp: Date.now()
                }});

                setTotalDamageDealt(prev => prev + actualDamage);

                // NPC Response
                setTimeout(() => {
                    if (!state.audio.muted) playSound('DAMAGE');
                    dispatch({ type: 'TRIGGER_SHAKE' });
                    setOpponentCard({ text: evaluation.npcResponse, damage: evaluation.npcDamage });
                }, 800);

                dispatch({ type: 'ADD_LOG', payload: {
                    id: Date.now().toString(),
                    type: 'COMBAT',
                    text: `${combat.opponent.name}: "${evaluation.npcResponse}" (-${evaluation.npcDamage} Composure)`,
                    timestamp: Date.now(),
                    speaker: combat.opponent.name
                }});

                setTotalDamageReceived(prev => prev + evaluation.npcDamage);

                // Adjust social anxiety based on exchange
                const reputationDelta = evaluation.quality === 'excellent' ? 5 :
                                       evaluation.quality === 'good' ? 0 : -5;
                dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: reputationDelta - Math.floor(evaluation.npcDamage / 3) } });

                dispatch({ type: 'UPDATE_COMBAT', payload: {
                    playerHp: newPlayerHp,
                    opponentHp: newOpponentHp,
                    log: [...combat.log, `You: ${customText} (-${actualDamage})`, `${combat.opponent.name}: ${evaluation.npcResponse} (-${evaluation.npcDamage})`]
                }});

                // Check resolution
                if (newPlayerHp <= 0) {
                    await generateResolution('defeat');
                } else if (newOpponentHp <= 0) {
                    await generateResolution('victory');
                } else {
                    setRoundCount(prev => prev + 1);
                    if (roundCount >= MAX_TURNS) {
                        if (newPlayerHp > newOpponentHp) {
                            await generateResolution('victory');
                        } else if (newOpponentHp > newPlayerHp) {
                            await generateResolution('defeat');
                        } else {
                            await generateResolution('draw');
                        }
                    }
                }
            }

            // Reset NPC attack timer after player acts
            setNpcAttackTimer(20 + Math.floor(Math.random() * 11));

        } catch (error) {
            console.error('Combat error:', error);
            dispatch({ type: 'ADD_LOG', payload: {
                id: Date.now().toString(),
                type: 'SYSTEM',
                text: 'The conversation falters momentarily...',
                timestamp: Date.now()
            }});
        }

        setIsThinking(false);
        setSelectedCard(null);
    };

    const generateResolution = async (outcome: 'victory' | 'defeat' | 'draw') => {
        setIsThinking(true);

        // Clear timers
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (npcAttackIntervalRef.current) clearInterval(npcAttackIntervalRef.current);

        let summaryText = '';

        if (outcome === 'victory') {
            if (!state.audio.muted) playSound('SUCCESS');
            summaryText = `Through masterful deployment of wit and rhetorical finesse, Henry James emerged victorious from this verbal sparring match with ${combat.opponent.name}. The ${combat.opponent.profession} was left momentarily speechless, their composure thoroughly undermined.`;

            // Award loot
            const item = await generateCombatLoot(combat.opponent.name, combat.opponent.profession);
            if (item) {
                dispatch({ type: 'ADD_ITEM', payload: item });
                dispatch({ type: 'ADD_LOG', payload: {
                    id: Date.now().toString(),
                    type: 'SYSTEM',
                    text: `${combat.opponent.name} offers you: ${item.name}`,
                    timestamp: Date.now()
                }});
            }

            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: 15 } });
        } else if (outcome === 'defeat') {
            summaryText = `Alas, ${combat.opponent.name}'s relentless barbs proved too much for Henry James's delicate sensibilities. His composure thoroughly rattled, he finds himself at a loss for words—a rare and humiliating predicament for the celebrated author.`;
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: -20 } });
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'malaise', delta: 15 } });
        } else {
            summaryText = `The exchange between Henry James and ${combat.opponent.name} concluded in an uneasy stalemate. Neither party emerged victorious, though both bore the marks of a vigorous intellectual contest.`;
        }

        setResolutionText(summaryText);
        setShowResolution(true);
        setIsThinking(false);
    };

    const handleEndCombat = () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (npcAttackIntervalRef.current) clearInterval(npcAttackIntervalRef.current);
        dispatch({ type: 'END_COMBAT' });
    };

    const getCardColor = (type: string) => {
        switch(type) {
            case 'INSULT': return 'bg-red-100 border-red-800 text-red-900';
            case 'DEFENSE': return 'bg-gold-100 border-gold-800 text-ink-900';
            case 'OBSERVATION': return 'bg-blue-100 border-blue-800 text-blue-900';
            default: return 'bg-paper-200';
        }
    };

    const getCardPrompt = (type: string) => {
        switch(type) {
            case 'INSULT': return 'Craft your cutting remark (be witty and period-appropriate!):';
            case 'DEFENSE': return 'Write your elegant deflection or parry:';
            case 'OBSERVATION': return 'Share your keen psychological insight:';
            default: return 'Write your remark:';
        }
    };

    // Resolution Modal
    if (showResolution) {
        return (
            <div className="flex items-center justify-center h-full w-full p-8 bg-gradient-to-br from-ink-900 to-ink-800">
                <div className="max-w-2xl bg-paper-100 border-4 border-gold-600 rounded-lg shadow-2xl p-8 animate-fade-in">
                    <h2 className="font-display text-3xl font-bold text-center text-ink-900 mb-6">
                        Conversation Concluded
                    </h2>

                    <div className="bg-gold-50 border-l-4 border-gold-600 p-6 mb-6">
                        <p className="font-serif text-lg leading-relaxed text-ink-800 italic">
                            {resolutionText}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6 text-center font-mono text-sm">
                        <div>
                            <div className="text-xs uppercase text-ink-500 mb-1">Rounds</div>
                            <div className="text-2xl font-bold text-ink-900">{roundCount}</div>
                        </div>
                        <div>
                            <div className="text-xs uppercase text-ink-500 mb-1">Damage Dealt</div>
                            <div className="text-2xl font-bold text-green-600">{totalDamageDealt}</div>
                        </div>
                        <div>
                            <div className="text-xs uppercase text-ink-500 mb-1">Damage Taken</div>
                            <div className="text-2xl font-bold text-red-600">{totalDamageReceived}</div>
                        </div>
                    </div>

                    <button
                        onClick={handleEndCombat}
                        className="w-full bg-ink-900 hover:bg-ink-800 text-gold-400 font-display font-bold text-lg py-3 px-6 rounded transition-colors shadow-lg"
                    >
                        Return to Exploration
                    </button>
                </div>
            </div>
        );
    }

    // Player Input Modal
    if (showInputModal && selectedCard) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in">
                <div className="bg-paper-100 border-4 border-gold-600 rounded-lg shadow-2xl max-w-xl w-full p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-xl font-bold text-ink-900">
                            {selectedCard.name}
                        </h3>
                        <button
                            onClick={() => { setShowInputModal(false); setSelectedCard(null); }}
                            className="text-ink-600 hover:text-red-600"
                        >
                            <LucideX size={24} />
                        </button>
                    </div>

                    <div className="bg-amber-50 border border-amber-300 rounded p-3 mb-4 text-sm">
                        <p className="text-amber-800 font-medium">
                            <strong>Tip:</strong> Your remark will be evaluated! Period-appropriate wit deals more damage.
                            Anachronisms or nonsense may backfire!
                        </p>
                    </div>

                    <p className="text-base text-ink-600 mb-4">
                        {getCardPrompt(selectedCard.type)}
                    </p>

                    <textarea
                        value={playerInput}
                        onChange={(e) => setPlayerInput(e.target.value)}
                        placeholder={selectedCard.type === 'INSULT'
                            ? `e.g., "One might forgive a provincial for confusing notoriety with distinction..."`
                            : selectedCard.type === 'DEFENSE'
                            ? `e.g., "I see you've mistaken my reticence for lack of riposte..."`
                            : `e.g., "I observe you fidget whenever the topic turns to your origins..."`}
                        className="w-full h-32 p-4 border-2 border-ink-300 rounded font-serif text-lg resize-none focus:outline-none focus:border-gold-600 text-ink-900"
                        autoFocus
                    />

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={() => { setShowInputModal(false); setSelectedCard(null); }}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-ink-900 font-display font-bold py-2 px-4 rounded transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmitInput}
                            disabled={!playerInput.trim()}
                            className="flex-1 bg-gold-600 hover:bg-gold-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-display font-bold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
                        >
                            <LucideSend size={18} />
                            Deploy Remark
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-full w-full p-4 gap-4 relative overflow-auto">

            {/* Flying Text */}
            {flyingText && (
                <div className={`absolute top-1/3 left-1/2 transform -translate-x-1/2 text-3xl font-display font-bold z-50 pointer-events-none animate-bounce
                    ${flyingText.type === 'backfire' ? 'text-red-600' : flyingText.type === 'player' ? 'text-blue-600' : 'text-red-800'}`}>
                    {flyingText.text}
                </div>
            )}

            {/* LEFT COLUMN: NPC Portrait */}
            <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
                <div className="bg-paper-100 border-2 border-gold-600 rounded-lg p-4 shadow-xl">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-24 h-24 border-4 border-double border-gold-500 rounded-full flex items-center justify-center bg-ink-900 shadow-xl shrink-0 overflow-hidden">
                            <AsciiPortrait
                                config={combat.opponent.portrait}
                                archetype={combat.opponent.portraitArchetype}
                                mood="NEUTRAL"
                                speaking={false}
                                className="scale-[0.55]"
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-display font-bold text-ink-900 mb-1">{combat.opponent.name}</h2>
                            <div className="text-sm font-mono text-ink-600 mb-1">{combat.opponent.profession}</div>
                        </div>
                    </div>

                    {/* NPC Attack Timer */}
                    <div className="bg-red-50 border border-red-300 rounded p-2 mb-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-red-700 font-bold">
                                <LucideTimer size={16} />
                                Next Attack:
                            </span>
                            <span className={`font-mono font-bold ${npcAttackTimer <= 5 ? 'text-red-600 animate-pulse' : 'text-red-800'}`}>
                                {npcAttackTimer}s
                            </span>
                        </div>
                        <div className="w-full h-2 bg-red-200 rounded mt-1 overflow-hidden">
                            <div
                                className="h-full bg-red-600 transition-all duration-1000"
                                style={{ width: `${(npcAttackTimer / 30) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Opponent HP */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-ink-500 w-20">Composure</span>
                        <div className="flex-1 h-4 bg-gray-300 rounded-full overflow-hidden border border-gray-400 shadow-inner">
                            <div className="h-full bg-red-800 transition-all duration-500 ease-out" style={{ width: `${combat.opponentHp}%` }}></div>
                        </div>
                        <span className="text-sm font-mono text-ink-600 font-bold w-12 text-right">{Math.round(combat.opponentHp)}%</span>
                    </div>
                </div>

                {/* Opponent's Last Remark */}
                {opponentCard && (
                    <div className="animate-fade-in">
                        <div className="bg-red-50 border-2 border-red-800 rounded shadow-2xl p-4 text-center">
                            <div className="text-xs font-bold uppercase tracking-wider mb-2 text-red-600">
                                {opponentCard.category ? opponentCard.category.toUpperCase() : 'RETORT'}
                            </div>
                            <div className="font-serif italic text-base leading-snug mb-3 text-ink-900 min-h-[70px] flex items-center justify-center">
                                "{opponentCard.text}"
                            </div>
                            <div className="text-sm font-mono font-bold bg-red-800 text-white px-3 py-1.5 rounded inline-block">
                                DMG: {opponentCard.damage}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* CENTER COLUMN: Combat Log & Cards */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
                {/* Quality feedback */}
                {lastQuality && (
                    <div className={`text-center py-2 rounded font-display font-bold text-sm
                        ${lastQuality === 'excellent' ? 'bg-green-100 text-green-800' :
                          lastQuality === 'good' ? 'bg-blue-100 text-blue-800' :
                          lastQuality === 'weak' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                        {lastQuality === 'excellent' ? '★ EXCELLENT RIPOSTE! Bonus damage!' :
                         lastQuality === 'good' ? 'A solid exchange.' :
                         lastQuality === 'weak' ? 'A weak attempt... reduced damage.' :
                         'BACKFIRE! Your remark falls flat!'}
                    </div>
                )}

                {/* Combat Log */}
                <div className="flex-1 overflow-y-auto bg-paper-50 border-2 border-ink-400/20 p-4 rounded-lg shadow-inner font-serif text-lg min-h-0">
                    {combat.log.length === 0 ? (
                        <p className="italic text-gray-500 text-center text-xl">The conversation begins... {combat.opponent.name} eyes you with thinly veiled contempt.</p>
                    ) : (
                        combat.log.map((line, i) => (
                            <div key={i} className={`mb-3 text-lg leading-relaxed ${line.startsWith('You') ? 'text-right text-blue-900 font-semibold' : 'text-left text-red-900'}`}>
                                {line}
                            </div>
                        ))
                    )}
                    {isThinking && <div className="text-center animate-pulse text-gold-600 font-bold mt-2 italic text-lg">Evaluating your wit...</div>}
                </div>

                {/* Player Status & Hand */}
                <div className="shrink-0">
                    <div className="mb-4 flex items-center justify-center gap-3">
                        <span className="text-base font-display font-bold text-ink-900">Henry James</span>
                        <div className="w-64 h-4 bg-gray-300 rounded-full overflow-hidden border border-gray-400 shadow-inner">
                            <div className="h-full bg-blue-600 transition-all duration-500 ease-out" style={{ width: `${combat.playerHp}%` }}></div>
                        </div>
                        <span className="text-sm font-mono text-ink-600 font-bold w-12">{Math.round(combat.playerHp)}%</span>
                    </div>

                    <div className="flex justify-between mb-3 text-sm font-mono uppercase tracking-widest text-ink-600">
                        <span>Round: {roundCount}/{MAX_TURNS}</span>
                        <span>Deck: {combat.deck.length} | Discard: {combat.discard.length}</span>
                    </div>

                    {/* Card Hand */}
                    <div className="flex justify-center gap-2 md:gap-4 items-end h-32 md:h-40 perspective-1000 flex-wrap">
                        {combat.hand.map((card, idx) => (
                            <button
                                key={`${card.id}-${idx}`}
                                onClick={() => handleCardClick(card)}
                                disabled={isThinking}
                                className={`
                                    relative w-24 h-30 md:w-28 md:h-36 rounded-lg border-2 shadow-lg p-2 md:p-3 flex flex-col items-center text-center transition-all duration-200 transform hover:-translate-y-6 hover:rotate-0 hover:scale-110 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                                    ${getCardColor(card.type)}
                                    ${idx === 0 ? '-rotate-3' : idx === 1 ? 'rotate-0' : 'rotate-3'}
                                `}
                            >
                                <div className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-60">{card.type}</div>
                                <div className="flex-1 flex items-center justify-center mb-2">
                                    {card.type === 'INSULT' && <LucideSword size={28} className="text-red-700" />}
                                    {card.type === 'DEFENSE' && <LucideShield size={28} className="text-gold-700" />}
                                    {card.type === 'OBSERVATION' && <LucideEye size={28} className="text-blue-700" />}
                                </div>
                                <div className="font-display font-bold text-sm leading-tight mb-2">{card.name}</div>
                                <div className="text-xs font-mono font-bold bg-black/10 px-2 py-1 rounded">
                                    DMG: {card.damage}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Battle Guide */}
            <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
                <div className="bg-ink-900 border-2 border-gold-600 rounded-lg p-4 shadow-xl text-paper-100 flex-1">
                    <h3 className="font-display text-base font-bold text-gold-500 mb-3 uppercase tracking-wide">Battle of Wits</h3>

                    <div className="space-y-3 text-sm">
                        <div className="bg-red-900/50 border border-red-500/50 rounded p-2">
                            <div className="text-xs uppercase text-red-400 font-bold mb-1">⚠ NPC Attacks Autonomously!</div>
                            <div className="text-xs leading-relaxed text-paper-200">
                                Your opponent will attack every 20-30 seconds. Act quickly or be worn down!
                            </div>
                        </div>

                        <div>
                            <div className="text-xs uppercase text-gold-600 font-bold mb-1">How to Play:</div>
                            <div className="text-xs leading-relaxed text-paper-200">
                                Select a card and write your own witty remark. The quality of your writing determines damage dealt!
                            </div>
                        </div>

                        <div className="border-t border-gold-600/30 pt-3">
                            <div className="text-xs uppercase text-gold-600 font-bold mb-2">Quality Ratings:</div>
                            <div className="text-xs leading-relaxed text-paper-200 space-y-1">
                                <div><span className="text-green-400">★ EXCELLENT:</span> 1.5x damage</div>
                                <div><span className="text-blue-400">GOOD:</span> Normal damage</div>
                                <div><span className="text-yellow-400">WEAK:</span> 0.5x damage</div>
                                <div><span className="text-red-400">BACKFIRE:</span> 0 damage + take extra!</div>
                            </div>
                        </div>

                        <div className="border-t border-gold-600/30 pt-3">
                            <div className="text-xs uppercase text-gold-600 font-bold mb-2">Tips for Success:</div>
                            <div className="text-xs leading-relaxed text-paper-200">
                                • Use period-appropriate language (1889)<br/>
                                • Match your remark to the card type<br/>
                                • Be subtle and cutting, not crude<br/>
                                • Avoid modern slang or references
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleEndCombat}
                        className="w-full mt-4 bg-red-900 hover:bg-red-800 text-white font-display font-bold py-2.5 px-4 rounded transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                        <LucideX size={18} />
                        FLEE (Lose Reputation)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CombatView;
