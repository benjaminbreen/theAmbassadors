
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { generateCombatLoot } from '../services/itemGenerator';
import { playSound, startBattleMusic, stopBattleMusic } from '../services/audioService';
import { evaluateCombatRemark } from '../services/geminiService';
import { CombatCard, NPC } from '../types';
import { LucideSword, LucideShield, LucideEye, LucideX, LucideSend, LucideTimer, LucideHelpCircle, LucideCheck } from 'lucide-react';
import AsciiPortrait from './AsciiPortrait';
import { CARDS } from '../constants';

// Combat card definitions with composure costs and requirements
// Higher damage cards require more composure and cost more to play
const FULL_CARD_DECK: CombatCard[] = [
    // DEFENSE cards - low cost, help maintain composure
    { id: 'silence', name: 'Eloquent Silence', type: 'DEFENSE', description: 'Sometimes the most devastating response is none at all.', damage: 6, cost: 5, composureRequired: 10 },
    { id: 'boredom', name: 'Theatrical Ennui', type: 'DEFENSE', description: 'Examine your pocket watch with pointed disinterest.', damage: 5, cost: 5, composureRequired: 10 },
    { id: 'sympathy', name: 'Feigned Sympathy', type: 'DEFENSE', description: '"How difficult it must be for you..."', damage: 8, cost: 8, composureRequired: 15 },
    { id: 'nuance', name: 'Appeal to Nuance', type: 'DEFENSE', description: 'Suggest their view lacks necessary complexity.', damage: 7, cost: 10, composureRequired: 20 },

    // OBSERVATION cards - moderate cost, solid damage
    { id: 'provincial', name: 'Provincial Observation', type: 'OBSERVATION', description: 'Note their unfamiliarity with continental customs.', damage: 12, cost: 12, composureRequired: 25 },
    { id: 'aesthetic', name: 'Aesthetic Critique', type: 'OBSERVATION', description: 'Comment on their questionable taste in art or dress.', damage: 14, cost: 15, composureRequired: 30 },
    { id: 'american', name: 'The American Question', type: 'OBSERVATION', description: 'Turn their assumptions about Americans against them.', damage: 15, cost: 18, composureRequired: 35 },

    // INSULT cards - high cost, high damage, requires high composure
    { id: 'allusion', name: 'Literary Allusion', type: 'INSULT', description: 'Reference an obscure work they clearly have not read.', damage: 16, cost: 20, composureRequired: 40 },
    { id: 'class', name: 'Class Consciousness', type: 'INSULT', description: 'A subtle reminder of social standing.', damage: 18, cost: 22, composureRequired: 50 },
    { id: 'gaze', name: 'The Withering Gaze', type: 'INSULT', description: 'A look that speaks volumes of disappointment.', damage: 20, cost: 25, composureRequired: 60 },
];

// Helper to check if a card can be played given current composure
const canPlayCard = (card: CombatCard, composure: number): boolean => {
    const required = card.composureRequired || 0;
    return composure >= required && composure >= card.cost;
};

// Hardcoded NPC barbed remarks pool
const NPC_REMARKS = {
    condescending: [
        "I see you fancy yourself an observer of society. How quaint.",
        "One might expect more... finesse from a man of letters.",
        "Your reputation precedes you, though I confess the reality disappoints.",
        "How charming that Americans believe travel confers sophistication.",
    ],
    dismissive: [
        "Was that meant to be clever?",
        "I'm afraid that remark fell rather flat.",
        "Perhaps you should confine yourself to fiction.",
        "How very... American of you to say so.",
    ],
    intellectual: [
        "Your syllogism contains a rather glaring flaw, I'm afraid.",
        "A curious interpretation, though historically indefensible.",
        "That perspective betrays a certain... parochialism of thought.",
        "Your argument suffers from excessive ornamentation.",
    ],
    cutting: [
        "Ah, the expatriate speaks! Do continue your performance.",
        "I'm told your books sell tolerably well. To whom, I wonder?",
        "One notices you observe much but comprehend little.",
        "I see why you prefer to write rather than speak.",
    ],
};

const getRandomNpcRemark = (npc: NPC): { text: string; category: string } => {
    const categories = Object.keys(NPC_REMARKS) as (keyof typeof NPC_REMARKS)[];
    const wit = npc.combatStats?.wit || 10;
    const composure = npc.combatStats?.composure || 10;

    let selectedCategory: keyof typeof NPC_REMARKS;
    if (wit >= 14) {
        selectedCategory = Math.random() > 0.5 ? 'intellectual' : 'cutting';
    } else if (composure >= 14) {
        selectedCategory = Math.random() > 0.5 ? 'condescending' : 'dismissive';
    } else {
        selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    }

    const remarks = NPC_REMARKS[selectedCategory];
    const text = remarks[Math.floor(Math.random() * remarks.length)];
    return { text, category: selectedCategory };
};

const calculateNpcDamage = (npc: NPC): number => {
    const wit = npc.combatStats?.wit || 10;
    const baseDamage = 5 + Math.floor(Math.random() * 4);
    const witBonus = Math.floor((wit - 10) / 2);
    return Math.max(3, Math.min(18, baseDamage + witBonus));
};

const getMalaisePenalty = (malaise: number): { damageMultiplier: number; description: string } => {
    if (malaise >= 80) return { damageMultiplier: 0.6, description: 'Severe (-40%)' };
    if (malaise >= 60) return { damageMultiplier: 0.75, description: 'High (-25%)' };
    if (malaise >= 40) return { damageMultiplier: 0.85, description: 'Moderate (-15%)' };
    if (malaise >= 20) return { damageMultiplier: 0.95, description: 'Mild (-5%)' };
    return { damageMultiplier: 1.0, description: 'None' };
};

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
        playerText, cardType, npc.name, npc.profession, npc.age,
        npc.combatStats?.wit || 10, npc.combatStats?.observation || 10, npc.combatStats?.composure || 10,
        battleContext
    );
};

const CombatView: React.FC = () => {
    const { state, dispatch } = useGame();
    const { combat } = state;

    // Core states
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

    // NPC attack state
    const [npcAttackTimer, setNpcAttackTimer] = useState(30);
    const [npcAttackCount, setNpcAttackCount] = useState(0);
    const [lastQuality, setLastQuality] = useState<string | null>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Deck selection state
    const [showDeckSelection, setShowDeckSelection] = useState(true);
    const [selectedDeckCards, setSelectedDeckCards] = useState<CombatCard[]>([]);

    // Help state
    const [showHelp, setShowHelp] = useState(false);

    const MAX_TURNS = 8;
    const MAX_NPC_ATTACKS = 5;

    // Start battle music
    useEffect(() => {
        if (!state.audio.muted) startBattleMusic();
        return () => stopBattleMusic();
    }, []);

    useEffect(() => {
        if (state.audio.muted) stopBattleMusic();
        else startBattleMusic();
    }, [state.audio.muted]);

    // NPC attack execution
    const executeNpcAttack = useCallback(() => {
        if (!combat || showResolution || isThinking || showInputModal || showDeckSelection) return;

        const { text, category } = getRandomNpcRemark(combat.opponent);
        const damage = calculateNpcDamage(combat.opponent);

        if (!state.audio.muted) playSound('DAMAGE');
        dispatch({ type: 'TRIGGER_SHAKE' });

        setOpponentCard({ text, damage, category });
        setFlyingText({ text: `-${damage} Composure!`, type: 'npc' });

        const newPlayerHp = Math.max(0, combat.playerHp - damage);
        const newAttackCount = npcAttackCount + 1;
        setNpcAttackCount(newAttackCount);

        dispatch({ type: 'ADD_LOG', payload: {
            id: `npc-attack-${Date.now()}-${Math.random()}`,
            type: 'COMBAT',
            text: `${combat.opponent.name}: "${text}" (-${damage} Composure)`,
            timestamp: Date.now(),
            speaker: combat.opponent.name
        }});

        dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: -Math.floor(damage / 2) } });
        setTotalDamageReceived(prev => prev + damage);

        dispatch({ type: 'UPDATE_COMBAT', payload: {
            playerHp: newPlayerHp,
            opponentHp: combat.opponentHp,
            log: [...combat.log, `${combat.opponent.name}: "${text}" (-${damage})`]
        }});

        // Check for defeat or max attacks
        if (newPlayerHp <= 0) {
            generateResolution('defeat');
        } else if (newAttackCount >= MAX_NPC_ATTACKS) {
            generateResolution('defeat');
        }

        // Reset timer
        setNpcAttackTimer(30);
    }, [combat, showResolution, isThinking, showInputModal, showDeckSelection, state.audio.muted, dispatch, npcAttackCount]);

    // Timer countdown - triggers attack when reaching 0
    useEffect(() => {
        if (!combat || showResolution || showDeckSelection) return;

        timerIntervalRef.current = setInterval(() => {
            setNpcAttackTimer(prev => {
                const newVal = prev - 1;
                if (newVal <= 0) {
                    // Trigger attack on next tick
                    setTimeout(() => executeNpcAttack(), 0);
                    return 30; // Reset timer
                }
                return newVal;
            });
        }, 1000);

        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, [combat, showResolution, showDeckSelection, executeNpcAttack]);

    // Flying text cleanup
    useEffect(() => {
        if (flyingText) {
            const timer = setTimeout(() => setFlyingText(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [flyingText]);

    if (!combat || !combat.opponent) return null;

    // Handle deck card selection
    const handleDeckCardToggle = (card: CombatCard) => {
        if (selectedDeckCards.find(c => c.id === card.id)) {
            setSelectedDeckCards(selectedDeckCards.filter(c => c.id !== card.id));
        } else if (selectedDeckCards.length < 3) {
            setSelectedDeckCards([...selectedDeckCards, card]);
        }
    };

    const handleStartCombat = () => {
        if (selectedDeckCards.length !== 3) return;
        setShowDeckSelection(false);
        // Update combat hand with selected cards
        dispatch({ type: 'UPDATE_COMBAT', payload: {
            hand: selectedDeckCards,
            deck: FULL_CARD_DECK.filter(c => !selectedDeckCards.find(s => s.id === c.id))
        }});
    };

    const handleCardClick = (card: CombatCard) => {
        if (isThinking) return;
        // Check if player has enough composure to play this card
        const playerComposure = state.player.stats.composure;
        if (!canPlayCard(card, playerComposure)) {
            if (!state.audio.muted) playSound('ERROR');
            dispatch({ type: 'ADD_LOG', payload: {
                id: `composure-fail-${Date.now()}`,
                type: 'SYSTEM',
                text: `Not enough composure to play "${card.name}" (requires ${card.composureRequired || 0}, have ${playerComposure})`,
                timestamp: Date.now()
            }});
            return;
        }
        setSelectedCard(card);
        setShowInputModal(true);
        setPlayerInput('');
    };

    const handleSubmitInput = async () => {
        if (!selectedCard || !playerInput.trim()) return;

        const card = selectedCard;
        const customText = playerInput.trim();

        // Deduct composure cost for playing the card
        const cardCost = card.cost || 0;
        dispatch({ type: 'ADJUST_COMPOSURE', payload: -cardCost });

        setShowInputModal(false);
        setIsThinking(true);
        setLastQuality(null);

        try {
            const evaluation = await evaluatePlayerRemark(customText, card.type, combat.opponent, combat.log);
            setLastQuality(evaluation.quality);

            const baseDamage = card.damage || 10;
            const malaisePenalty = getMalaisePenalty(state.player.stats.malaise);
            const actualDamage = Math.round(baseDamage * evaluation.damageMultiplier * malaisePenalty.damageMultiplier);

            if (evaluation.quality === 'backfire') {
                if (!state.audio.muted) playSound('ERROR');
                setFlyingText({ text: 'BACKFIRE!', type: 'backfire' });

                const backfireDamage = evaluation.npcDamage + 5;
                const newPlayerHp = Math.max(0, combat.playerHp - backfireDamage);

                dispatch({ type: 'ADD_LOG', payload: {
                    id: `player-${Date.now()}-${Math.random()}`,
                    type: 'COMBAT',
                    text: `You: "${customText}" — BACKFIRE!`,
                    timestamp: Date.now()
                }});

                setOpponentCard({ text: evaluation.npcResponse, damage: backfireDamage });

                dispatch({ type: 'ADD_LOG', payload: {
                    id: `npc-response-${Date.now()}-${Math.random()}`,
                    type: 'COMBAT',
                    text: `${combat.opponent.name}: "${evaluation.npcResponse}" (-${backfireDamage})`,
                    timestamp: Date.now(),
                    speaker: combat.opponent.name
                }});

                setTotalDamageReceived(prev => prev + backfireDamage);
                dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: -10 } });

                dispatch({ type: 'UPDATE_COMBAT', payload: {
                    playerHp: newPlayerHp,
                    opponentHp: combat.opponentHp,
                    log: [...combat.log, `You: "${customText}" (BACKFIRE!)`, `${combat.opponent.name}: "${evaluation.npcResponse}" (-${backfireDamage})`]
                }});

                if (newPlayerHp <= 0) await generateResolution('defeat');
            } else {
                if (!state.audio.muted) playSound('ATTACK');

                const qualityText = evaluation.quality === 'excellent' ? '★ EXCELLENT!' : evaluation.quality === 'weak' ? '(weak)' : '';
                setFlyingText({ text: `-${actualDamage} ${qualityText}`, type: 'player' });

                const newOpponentHp = Math.max(0, combat.opponentHp - actualDamage);
                const newPlayerHp = Math.max(0, combat.playerHp - evaluation.npcDamage);

                dispatch({ type: 'ADD_LOG', payload: {
                    id: `player-${Date.now()}-${Math.random()}`,
                    type: 'COMBAT',
                    text: `You: "${customText}" ${qualityText} (-${actualDamage} to opponent)`,
                    timestamp: Date.now()
                }});

                setTotalDamageDealt(prev => prev + actualDamage);

                setTimeout(() => {
                    if (!state.audio.muted) playSound('DAMAGE');
                    dispatch({ type: 'TRIGGER_SHAKE' });
                    setOpponentCard({ text: evaluation.npcResponse, damage: evaluation.npcDamage });
                }, 800);

                dispatch({ type: 'ADD_LOG', payload: {
                    id: `npc-response-${Date.now()}-${Math.random()}`,
                    type: 'COMBAT',
                    text: `${combat.opponent.name}: "${evaluation.npcResponse}" (-${evaluation.npcDamage})`,
                    timestamp: Date.now(),
                    speaker: combat.opponent.name
                }});

                setTotalDamageReceived(prev => prev + evaluation.npcDamage);

                const reputationDelta = evaluation.quality === 'excellent' ? 5 : evaluation.quality === 'good' ? 0 : -5;
                dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: reputationDelta - Math.floor(evaluation.npcDamage / 3) } });

                dispatch({ type: 'UPDATE_COMBAT', payload: {
                    playerHp: newPlayerHp,
                    opponentHp: newOpponentHp,
                    log: [...combat.log, `You: "${customText}" (-${actualDamage})`, `${combat.opponent.name}: "${evaluation.npcResponse}" (-${evaluation.npcDamage})`]
                }});

                if (newPlayerHp <= 0) {
                    await generateResolution('defeat');
                } else if (newOpponentHp <= 0) {
                    await generateResolution('victory');
                } else {
                    setRoundCount(prev => prev + 1);
                    if (roundCount >= MAX_TURNS) {
                        if (newPlayerHp > newOpponentHp) await generateResolution('victory');
                        else if (newOpponentHp > newPlayerHp) await generateResolution('defeat');
                        else await generateResolution('draw');
                    }
                }
            }

            setNpcAttackTimer(30);
        } catch (error) {
            console.error('Combat error:', error);
            dispatch({ type: 'ADD_LOG', payload: {
                id: `error-${Date.now()}`,
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
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

        let summaryText = '';
        if (outcome === 'victory') {
            if (!state.audio.muted) playSound('SUCCESS');
            summaryText = `Through masterful wit, Henry James emerged victorious from this verbal sparring match with ${combat.opponent.name}. The ${combat.opponent.profession} was left momentarily speechless.`;
            const item = await generateCombatLoot(combat.opponent.name, combat.opponent.profession);
            if (item) {
                dispatch({ type: 'ADD_ITEM', payload: item });
                dispatch({ type: 'ADD_LOG', payload: { id: `loot-${Date.now()}`, type: 'SYSTEM', text: `${combat.opponent.name} offers you: ${item.name}`, timestamp: Date.now() }});
            }
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: 15 } });
        } else if (outcome === 'defeat') {
            summaryText = npcAttackCount >= MAX_NPC_ATTACKS
                ? `Henry James stood paralyzed, unable to muster a response as ${combat.opponent.name}'s barbs landed unopposed. The humiliation was total.`
                : `Alas, ${combat.opponent.name}'s relentless barbs proved too much. Henry James finds himself at a loss for words.`;
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: -20 } });
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'malaise', delta: 15 } });
        } else {
            summaryText = `The exchange concluded in an uneasy stalemate. Neither party emerged victorious.`;
        }

        setResolutionText(summaryText);
        setShowResolution(true);
        setIsThinking(false);
    };

    const handleEndCombat = () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        dispatch({ type: 'END_COMBAT' });
    };

    const getCardColor = (type: string) => {
        switch(type) {
            case 'INSULT': return 'from-red-800 to-red-950 border-red-600';
            case 'DEFENSE': return 'from-amber-700 to-amber-950 border-amber-500';
            case 'OBSERVATION': return 'from-blue-800 to-blue-950 border-blue-600';
            default: return 'from-gray-700 to-gray-900 border-gray-500';
        }
    };

    const getCardTextColor = (type: string) => {
        switch(type) { case 'INSULT': return 'text-red-200'; case 'DEFENSE': return 'text-amber-200'; case 'OBSERVATION': return 'text-blue-200'; default: return 'text-gray-200'; }
    };

    // Card background images - will use if files exist in /public/cards/
    const getCardImage = (cardId: string): string | null => {
        const cardImages: Record<string, string> = {
            'provincial': '/cards/provincial.png',
            'silence': '/cards/silence.png',
            'aesthetic': '/cards/aesthetic.png',
            'allusion': '/cards/allusion.png',
            'sympathy': '/cards/sympathy.png',
            'nuance': '/cards/nuance.png',
            'american': '/cards/american.png',
            'class': '/cards/class.png',
            'boredom': '/cards/boredom.png',
            'gaze': '/cards/gaze.png',
        };
        return cardImages[cardId] || null;
    };

    const getDifficultyRating = () => {
        const wit = combat.opponent.combatStats?.wit || 10;
        const composure = combat.opponent.combatStats?.composure || 10;
        const observation = combat.opponent.combatStats?.observation || 10;
        const avgStat = (wit + composure + observation) / 3;
        if (avgStat >= 16) return { stars: 5, label: 'Formidable', color: 'text-red-400' };
        if (avgStat >= 14) return { stars: 4, label: 'Challenging', color: 'text-orange-400' };
        if (avgStat >= 12) return { stars: 3, label: 'Moderate', color: 'text-yellow-400' };
        if (avgStat >= 10) return { stars: 2, label: 'Fair', color: 'text-green-400' };
        return { stars: 1, label: 'Easy', color: 'text-blue-400' };
    };

    const difficulty = getDifficultyRating();

    // ===== DECK SELECTION SCREEN =====
    if (showDeckSelection) {
        return (
            <div className="flex flex-col h-full w-full bg-gradient-to-b from-ink-900 via-ink-800 to-ink-900 p-4 overflow-auto">
                <div className="text-center mb-4">
                    <h2 className="font-display text-2xl text-gold-400 mb-2">Battle of Wits</h2>
                    <p className="text-paper-300 text-sm font-serif">You engage {combat.opponent.name}, {combat.opponent.profession}</p>
                </div>

                {/* Instructions */}
                <div className="bg-ink-800/80 border border-gold-600/50 rounded-lg p-4 mb-4 max-w-2xl mx-auto">
                    <h3 className="text-gold-400 font-bold text-sm mb-2">HOW TO PLAY</h3>
                    <ul className="text-paper-300 text-xs space-y-1 font-serif">
                        <li>• Select <span className="text-gold-400 font-bold">3 cards</span> to form your hand</li>
                        <li>• Click a card to write a <span className="text-gold-400">period-appropriate witty remark</span></li>
                        <li>• Your writing quality determines damage: <span className="text-green-400">Excellent</span> (1.5x), <span className="text-blue-400">Good</span> (1x), <span className="text-yellow-400">Weak</span> (0.5x), <span className="text-red-400">Backfire</span> (0 + take damage!)</li>
                        <li>• Your opponent attacks every <span className="text-red-400">30 seconds</span> automatically</li>
                        <li>• <span className="text-red-400">5 unanswered attacks</span> means defeat - act quickly!</li>
                    </ul>
                </div>

                {/* Card Selection Grid */}
                <div className="flex-1 flex flex-col items-center">
                    <p className="text-paper-400 text-sm mb-3">Select 3 cards ({selectedDeckCards.length}/3)</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl">
                        {FULL_CARD_DECK.map(card => {
                            const isSelected = selectedDeckCards.find(c => c.id === card.id);
                            return (
                                <button
                                    key={card.id}
                                    onClick={() => handleDeckCardToggle(card)}
                                    disabled={!isSelected && selectedDeckCards.length >= 3}
                                    className={`relative rounded-lg border-2 p-3 transition-all overflow-hidden ${
                                        isSelected
                                            ? 'border-gold-400 ring-2 ring-gold-400/50 scale-105'
                                            : selectedDeckCards.length >= 3
                                                ? 'border-gray-700 opacity-40 cursor-not-allowed'
                                                : 'border-gray-600 hover:border-gray-400'
                                    } bg-gradient-to-b ${getCardColor(card.type)}`}
                                    style={getCardImage(card.id) ? { backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.85)), url(${getCardImage(card.id)})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                                >
                                    {isSelected && (
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center z-10">
                                            <LucideCheck size={14} className="text-ink-900" />
                                        </div>
                                    )}
                                    <div className="relative z-[1]">
                                        <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 text-paper-300 mb-1">{card.type}</div>
                                        <div className="my-2 flex justify-center">
                                            {card.type === 'INSULT' && <LucideSword size={24} className="text-red-400" />}
                                            {card.type === 'DEFENSE' && <LucideShield size={24} className="text-amber-400" />}
                                            {card.type === 'OBSERVATION' && <LucideEye size={24} className="text-blue-400" />}
                                        </div>
                                        <div className={`font-display font-bold text-xs leading-tight mb-1 ${getCardTextColor(card.type)}`}>{card.name}</div>
                                        <div className="text-[10px] text-paper-400 mb-2 leading-tight">{card.description}</div>
                                        <div className="flex justify-between text-xs font-mono font-bold">
                                            <span className="text-paper-200">DMG: {card.damage}</span>
                                            <span className="text-blue-300">Cost: {card.cost}</span>
                                        </div>
                                        <div className="text-[9px] text-paper-500 mt-1">Req: {card.composureRequired || 0}+ composure</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Start Button */}
                <div className="mt-4 flex justify-center gap-4">
                    <button
                        onClick={handleEndCombat}
                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-paper-300 rounded font-display"
                    >
                        Flee
                    </button>
                    <button
                        onClick={handleStartCombat}
                        disabled={selectedDeckCards.length !== 3}
                        className="px-8 py-3 bg-gold-600 hover:bg-gold-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-ink-900 font-display font-bold rounded shadow-lg transition-all"
                    >
                        Begin Duel ({selectedDeckCards.length}/3)
                    </button>
                </div>
            </div>
        );
    }

    // ===== RESOLUTION SCREEN =====
    if (showResolution) {
        return (
            <div className="flex items-center justify-center h-full w-full p-4 bg-gradient-to-br from-ink-900 to-ink-800">
                <div className="max-w-lg bg-paper-100 border-4 border-gold-600 rounded-lg shadow-2xl p-6 animate-fade-in">
                    <h2 className="font-display text-2xl font-bold text-center text-ink-900 mb-4">Conversation Concluded</h2>
                    <div className="bg-gold-50 border-l-4 border-gold-600 p-4 mb-4">
                        <p className="font-serif text-base leading-relaxed text-ink-800 italic">{resolutionText}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4 text-center font-mono text-sm">
                        <div><div className="text-xs uppercase text-ink-500">Rounds</div><div className="text-xl font-bold text-ink-900">{roundCount}</div></div>
                        <div><div className="text-xs uppercase text-ink-500">Dealt</div><div className="text-xl font-bold text-green-600">{totalDamageDealt}</div></div>
                        <div><div className="text-xs uppercase text-ink-500">Taken</div><div className="text-xl font-bold text-red-600">{totalDamageReceived}</div></div>
                    </div>
                    <button onClick={handleEndCombat} className="w-full bg-ink-900 hover:bg-ink-800 text-gold-400 font-display font-bold py-3 px-6 rounded">
                        Return to Exploration
                    </button>
                </div>
            </div>
        );
    }

    // ===== INPUT MODAL =====
    if (showInputModal && selectedCard) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in">
                <div className="bg-paper-100 border-4 border-gold-600 rounded-lg shadow-2xl max-w-xl w-full p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-xl font-bold text-ink-900">{selectedCard.name}</h3>
                        <button onClick={() => { setShowInputModal(false); setSelectedCard(null); }} className="text-ink-600 hover:text-red-600"><LucideX size={24} /></button>
                    </div>
                    <div className="bg-amber-50 border border-amber-300 rounded p-3 mb-4 text-sm">
                        <p className="text-amber-800 font-medium"><strong>Tip:</strong> Period-appropriate wit deals more damage. Anachronisms may backfire!</p>
                    </div>
                    <p className="text-base text-ink-600 mb-4">
                        {selectedCard.type === 'INSULT' ? 'Craft your cutting remark:' : selectedCard.type === 'DEFENSE' ? 'Write your elegant deflection:' : 'Share your keen insight:'}
                    </p>
                    <textarea
                        value={playerInput}
                        onChange={(e) => setPlayerInput(e.target.value)}
                        placeholder="Write your 1889-appropriate remark..."
                        className="w-full h-28 p-4 border-2 border-ink-300 rounded font-serif text-lg resize-none focus:outline-none focus:border-gold-600 text-ink-900"
                        autoFocus
                    />
                    <div className="flex gap-3 mt-4">
                        <button onClick={() => { setShowInputModal(false); setSelectedCard(null); }} className="flex-1 bg-gray-300 hover:bg-gray-400 text-ink-900 font-display font-bold py-2 px-4 rounded">Cancel</button>
                        <button onClick={handleSubmitInput} disabled={!playerInput.trim()} className="flex-1 bg-gold-600 hover:bg-gold-700 disabled:bg-gray-400 text-white font-display font-bold py-2 px-4 rounded flex items-center justify-center gap-2">
                            <LucideSend size={18} />Deploy
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ===== MAIN COMBAT VIEW =====
    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden bg-gradient-to-b from-ink-900 via-ink-800 to-ink-900">
            <style>{`@keyframes floatUp { 0% { opacity: 1; transform: translateY(0) scale(1); } 50% { opacity: 1; transform: translateY(-20px) scale(1.1); } 100% { opacity: 0; transform: translateY(-60px) scale(0.8); } }`}</style>

            {/* Flying Damage Text */}
            {flyingText && (
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
                    <div className={`text-4xl font-display font-bold animate-[floatUp_1.5s_ease-out_forwards] drop-shadow-lg ${flyingText.type === 'backfire' ? 'text-red-500' : flyingText.type === 'player' ? 'text-emerald-400' : 'text-red-600'}`} style={{ textShadow: '0 0 20px currentColor' }}>
                        {flyingText.text}
                    </div>
                </div>
            )}

            {/* Help Button */}
            <button onClick={() => setShowHelp(!showHelp)} className="absolute top-2 right-2 z-40 w-7 h-7 rounded-full bg-gold-600/80 hover:bg-gold-500 text-ink-900 flex items-center justify-center">
                <LucideHelpCircle size={16} />
            </button>
            {showHelp && (
                <div className="absolute top-11 right-2 z-50 w-56 bg-ink-900 border border-gold-600 rounded-lg p-3 shadow-2xl text-paper-100 text-xs">
                    <div className="font-bold text-gold-400 mb-1">QUALITY RATINGS</div>
                    <div className="space-y-0.5 text-[10px]">
                        <div><span className="text-green-400">★ EXCELLENT:</span> 1.5x damage</div>
                        <div><span className="text-blue-400">GOOD:</span> Normal damage</div>
                        <div><span className="text-yellow-400">WEAK:</span> 0.5x damage</div>
                        <div><span className="text-red-400">BACKFIRE:</span> Take extra!</div>
                    </div>
                </div>
            )}

            {/* COMPACT FACE-OFF HEADER */}
            <div className="flex items-center justify-between gap-2 px-3 py-2 bg-ink-950/50 border-b border-gold-600/30">
                {/* Opponent */}
                <div className="flex items-center gap-2 flex-1">
                    <div className="w-14 h-14 border-2 border-red-600 rounded-full bg-ink-900 overflow-hidden flex items-center justify-center">
                        <AsciiPortrait config={combat.opponent.portrait} archetype={combat.opponent.portraitArchetype} mood="NEUTRAL" speaking={false} className="scale-[0.85] translate-y-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-display font-bold text-paper-100 truncate">{combat.opponent.name}</div>
                        <div className="flex items-center gap-1">
                            <span className={`text-[10px] ${difficulty.color}`}>{difficulty.label}</span>
                            <span className="text-[10px] text-yellow-400">{'★'.repeat(difficulty.stars)}</span>
                        </div>
                        <div className="h-2 bg-ink-900 rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-red-600 transition-all" style={{ width: `${combat.opponentHp}%` }} />
                        </div>
                    </div>
                </div>

                {/* Timer */}
                <div className="flex flex-col items-center px-3">
                    <LucideTimer size={14} className={npcAttackTimer <= 10 ? 'text-red-400 animate-pulse' : 'text-paper-400'} />
                    <span className={`text-lg font-mono font-bold ${npcAttackTimer <= 10 ? 'text-red-400' : 'text-paper-300'}`}>{npcAttackTimer}</span>
                    <span className="text-[9px] text-paper-500">ATTACK</span>
                </div>

                {/* Player */}
                <div className="flex items-center gap-2 flex-1 justify-end">
                    <div className="flex-1 min-w-0 text-right">
                        <div className="text-sm font-display font-bold text-paper-100">Henry James</div>
                        {state.player.stats.malaise >= 20 && <div className="text-[10px] text-yellow-400">Malaise: {getMalaisePenalty(state.player.stats.malaise).description}</div>}
                        <div className="h-2 bg-ink-900 rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-blue-600 transition-all" style={{ width: `${combat.playerHp}%` }} />
                        </div>
                    </div>
                    <div className="w-14 h-14 border-2 border-blue-600 rounded-full bg-ink-900 overflow-hidden flex items-center justify-center">
                        <AsciiPortrait config={{ hairStyle: 'BALD', hairColor: '#4A4A4A', skinColor: '#E8D4C4', clothesColor: '#2C3E50', facialHair: 'BEARD' }} archetype="henry_james" mood="NEUTRAL" speaking={false} className="scale-[0.85] translate-y-0.5" />
                    </div>
                </div>
            </div>

            {/* BATTLE LOG - Takes up most space */}
            <div className="flex-1 mx-2 my-2 overflow-hidden">
                <div className="h-full bg-paper-100/95 border border-gold-600/50 rounded-lg shadow-inner overflow-y-auto">
                    {lastQuality && (
                        <div className={`sticky top-0 text-center py-1 text-xs font-display font-bold z-10 ${lastQuality === 'excellent' ? 'bg-green-500 text-white' : lastQuality === 'good' ? 'bg-blue-500 text-white' : lastQuality === 'weak' ? 'bg-yellow-500 text-ink-900' : 'bg-red-600 text-white'}`}>
                            {lastQuality === 'excellent' ? '★ EXCELLENT!' : lastQuality === 'good' ? 'Solid exchange' : lastQuality === 'weak' ? 'Weak...' : 'BACKFIRE!'}
                        </div>
                    )}
                    <div className="p-3 space-y-2">
                        {combat.log.length === 0 ? (
                            <p className="italic text-ink-500 text-center font-serif text-sm">{combat.opponent.name} regards you with contempt. The duel begins...</p>
                        ) : (
                            combat.log.map((line, i) => (
                                <div key={`log-${i}-${line.substring(0,20)}`} className={`text-sm font-serif leading-relaxed p-2 rounded ${line.startsWith('You') ? 'bg-blue-50 text-blue-900 ml-6 border-l-2 border-blue-500' : 'bg-red-50 text-red-900 mr-6 border-l-2 border-red-500'}`}>
                                    {line}
                                </div>
                            ))
                        )}
                        {isThinking && (
                            <div className="text-center py-2">
                                <div className="inline-flex items-center gap-1 text-gold-600 font-serif italic text-sm">
                                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    <span className="ml-1">Evaluating...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* COMPACT CARD AREA */}
            <div className="bg-ink-900/95 border-t border-gold-600/30 px-3 py-2">
                <div className="flex items-center justify-between mb-2 text-[10px] font-mono text-paper-400">
                    <span>RND {roundCount}/{MAX_TURNS}</span>
                    <span className="text-blue-400">COMPOSURE: {state.player.stats.composure}/{state.player.stats.maxComposure}</span>
                    <span>NPC ATTACKS: {npcAttackCount}/{MAX_NPC_ATTACKS}</span>
                    <button onClick={handleEndCombat} className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1"><LucideX size={12} />FLEE</button>
                </div>
                <div className="flex justify-center gap-2">
                    {(combat.hand || []).map((card, idx) => {
                        const cardPlayable = canPlayCard(card, state.player.stats.composure);
                        return (
                            <button
                                key={`hand-${card.id}-${idx}`}
                                onClick={() => handleCardClick(card)}
                                disabled={isThinking || !cardPlayable}
                                className={`w-24 rounded border-2 p-2 transition-all overflow-hidden bg-gradient-to-b ${getCardColor(card.type)} ${
                                    cardPlayable
                                        ? 'hover:-translate-y-1 hover:scale-105'
                                        : 'opacity-40 cursor-not-allowed grayscale'
                                } ${isThinking ? 'opacity-50' : ''}`}
                                style={getCardImage(card.id) ? { backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.85)), url(${getCardImage(card.id)})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                                title={!cardPlayable ? `Requires ${card.composureRequired || 0} composure` : ''}
                            >
                                <div className="relative z-[1]">
                                    <div className="text-[8px] font-bold uppercase text-paper-400 mb-1">{card.type}</div>
                                    <div className="flex justify-center mb-1">
                                        {card.type === 'INSULT' && <LucideSword size={20} className={cardPlayable ? "text-red-400" : "text-gray-500"} />}
                                        {card.type === 'DEFENSE' && <LucideShield size={20} className={cardPlayable ? "text-amber-400" : "text-gray-500"} />}
                                        {card.type === 'OBSERVATION' && <LucideEye size={20} className={cardPlayable ? "text-blue-400" : "text-gray-500"} />}
                                    </div>
                                    <div className={`font-display font-bold text-[10px] leading-tight ${cardPlayable ? getCardTextColor(card.type) : 'text-gray-500'}`}>{card.name}</div>
                                    <div className="flex justify-between text-[9px] font-mono mt-1">
                                        <span className="text-paper-300">DMG: {card.damage}</span>
                                        <span className={cardPlayable ? "text-blue-300" : "text-red-400"}>-{card.cost}</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CombatView;
