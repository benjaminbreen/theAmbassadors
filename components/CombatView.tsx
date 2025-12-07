
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { generateCombatLoot } from '../services/itemGenerator';
import { playSound, startBattleMusic, stopBattleMusic } from '../services/audioService';
import { evaluateCombatExchange, generateNpcBarb } from '../services/geminiService';
import { CombatCard, NPC, CardType, CombatExchange } from '../types';
import { LucideSword, LucideShield, LucideEye, LucideX, LucideSend, LucideSparkles, LucideAlertTriangle } from 'lucide-react';
import AsciiPortrait from './AsciiPortrait';
import NpcPortrait from './NpcPortrait';
import { getUnlockedCards } from '../data/combatCards';

// Simple markdown renderer for combat dialogue
const renderCombatMarkdown = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i} className="italic">{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
    });
};

// Victory messages - shown when player wins
const VICTORY_MESSAGES = [
    (name: string) => `Your wit proved devastating. ${name} withdraws, visibly shaken.`,
    (name: string) => `${name} has no response. Your words have struck true.`,
    (name: string) => `A flush rises to ${name}'s cheeks. They turn away, defeated.`,
    (name: string) => `${name} falls silent, unable to match your verbal finesse.`,
    (name: string) => `Your riposte lands perfectly. ${name} concedes with a curt nod.`,
    (name: string) => `${name} raises a hand in surrender—your tongue is sharper than theirs.`,
    (name: string) => `The onlookers suppress smiles. ${name} has been thoroughly bested.`,
    (name: string) => `${name} clears their throat awkwardly. The victory is yours.`,
    (name: string) => `Your words hang in the air. ${name} has nothing to offer in reply.`,
    (name: string) => `${name} mutters something unintelligible and retreats.`,
];

// Defeat messages - shown when player loses
const DEFEAT_MESSAGES = [
    (name: string) => `A thin smile spreads across ${name}'s face. You've made an error.`,
    (name: string) => `${name} regards you with faint pity. Your words fell flat.`,
    (name: string) => `You find yourself without a suitable rejoinder. ${name} has won.`,
    (name: string) => `${name}'s wit proves sharper than your own. A stinging defeat.`,
    (name: string) => `The conversation concludes, and not in your favor.`,
    (name: string) => `${name} delivers the final word. You have been bested.`,
    (name: string) => `Your composure wavers. ${name} notes it with evident satisfaction.`,
    (name: string) => `${name} turns away dismissively. The exchange is over.`,
    (name: string) => `Your argument crumbles under ${name}'s scrutiny.`,
    (name: string) => `${name} arches an eyebrow. Your words have missed their mark entirely.`,
];

// Get a consistent message based on NPC id for deterministic selection
const getVictoryMessage = (npc: NPC): string => {
    const hash = npc.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const firstName = npc.name.split(' ')[0];
    return VICTORY_MESSAGES[hash % VICTORY_MESSAGES.length](firstName);
};

const getDefeatMessage = (npc: NPC): string => {
    const hash = npc.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const firstName = npc.name.split(' ')[0];
    return DEFEAT_MESSAGES[hash % DEFEAT_MESSAGES.length](firstName);
};

// Expanded fallback NPC barbs by profession category
const FALLBACK_BARBS: Record<string, Record<CardType, string[]>> = {
    default: {
        INSULT: [
            "I see you fancy yourself an observer of society. How quaint.",
            "Your reputation precedes you, though I confess the reality disappoints.",
            "How charming that Americans believe travel confers sophistication.",
            "I'm told your books sell tolerably well. To whom, I wonder?",
            "One notices you observe much but comprehend little.",
            "Ah, the expatriate speaks! Do continue your performance.",
            "Your presence here is... noted. If not precisely welcomed.",
            "I had expected more from a man of your... modest renown.",
        ],
        DEFENSE: [
            "I find myself quite unmoved by your presence here.",
            "You must forgive me if I seem distracted by more pressing matters.",
            "One develops certain immunities to provincial charm.",
            "I have weathered far more distinguished critics than yourself.",
            "Your words wash over me like rain on marble.",
            "I'm afraid I lack the energy to take offense.",
        ],
        OBSERVATION: [
            "Your syllogism contains a rather glaring flaw, I'm afraid.",
            "A curious interpretation, though historically indefensible.",
            "That perspective betrays a certain... parochialism of thought.",
            "I notice your cuffs are frayed. How telling.",
            "Your accent places you in Boston, perhaps? The provincial ear is unmistakable.",
            "One observes the strain of maintaining such pretensions.",
            "Your discomfort is visible, even to the casual observer.",
        ],
    },
    artist: {
        INSULT: [
            "Your prose lacks the qualities of true art—light, movement, feeling.",
            "I've seen more life in a still life than in your collected works.",
            "Perhaps stick to novels. Visual perception seems beyond you.",
        ],
        OBSERVATION: [
            "Your color sense appears rather... limited. Like your worldview.",
            "I notice you stand at the wrong distance from the canvas. Telling.",
        ],
        DEFENSE: [
            "Critics rarely create. I wonder why that is.",
            "The brush speaks truths the pen cannot capture.",
        ],
    },
    aristocrat: {
        INSULT: [
            "New money always betrays itself eventually. Yours just arrived.",
            "In my family, we've had opinions for centuries. Yours seem rather... fresh.",
            "Breeding shows, Mr. James. Or rather, its absence does.",
        ],
        OBSERVATION: [
            "Your attempt at continental manners is almost convincing. Almost.",
            "One recognizes the studied nature of your sophistication.",
        ],
        DEFENSE: [
            "I needn't defend my position to one who has none.",
            "Titles carry weight that talent cannot match.",
        ],
    },
    diplomat: {
        INSULT: [
            "America's foreign policy is as subtle as your prose—which is to say, not at all.",
            "I've negotiated with far more formidable minds. This is a respite.",
        ],
        OBSERVATION: [
            "Your tells are obvious to one trained in reading nations.",
            "I observe you Americans say 'perhaps' when you mean 'no'. How transparent.",
        ],
        DEFENSE: [
            "In diplomacy, we learn that silence is often the superior response.",
            "I'm afraid this conversation falls outside my brief.",
        ],
    },
    scientist: {
        INSULT: [
            "Your reasoning would not survive peer review.",
            "Literature—the refuge of those who cannot quantify.",
        ],
        OBSERVATION: [
            "I observe a marked correlation between confidence and ignorance in your remarks.",
            "Your hypothesis lacks supporting evidence. As usual.",
        ],
        DEFENSE: [
            "I deal in facts, not feelings. You seem fluent only in the latter.",
            "The scientific method has no patience for impressions.",
        ],
    },
    writer: {
        INSULT: [
            "Your sentences, like your thoughts, meander without purpose.",
            "I've read your work. One feels one has read it before—and better.",
            "Even your silences are derivative.",
        ],
        OBSERVATION: [
            "I notice you employ three words where one would suffice. Compensation?",
            "Your style is recognizable—in the way a cough is recognizable.",
        ],
        DEFENSE: [
            "The pen is a weapon. Yours appears to be blunted.",
            "I save my best material for the page, not the parlor.",
        ],
    },
};

// Get appropriate fallback barbs based on NPC profession
const getFallbackBarb = (profession: string, cardType: CardType): string => {
    const profLower = profession.toLowerCase();
    let category = 'default';

    if (profLower.includes('artist') || profLower.includes('painter') || profLower.includes('sculptor')) {
        category = 'artist';
    } else if (profLower.includes('aristocrat') || profLower.includes('count') || profLower.includes('baron') || profLower.includes('duchess')) {
        category = 'aristocrat';
    } else if (profLower.includes('diplomat') || profLower.includes('ambassador') || profLower.includes('attaché')) {
        category = 'diplomat';
    } else if (profLower.includes('scientist') || profLower.includes('engineer') || profLower.includes('inventor') || profLower.includes('professor')) {
        category = 'scientist';
    } else if (profLower.includes('writer') || profLower.includes('author') || profLower.includes('poet') || profLower.includes('journalist')) {
        category = 'writer';
    }

    const barbs = FALLBACK_BARBS[category]?.[cardType] || FALLBACK_BARBS.default[cardType];
    return barbs[Math.floor(Math.random() * barbs.length)];
};

// Determine NPC card type based on stats and situation
const selectNpcCardType = (npc: NPC, exchangeNumber: number, npcWins: number, playerWins: number): CardType => {
    const wit = npc.combatStats?.wit || 10;
    const composure = npc.combatStats?.composure || 10;

    // If NPC is losing, favor aggressive INSULT
    if (playerWins > npcWins) {
        return Math.random() > 0.3 ? 'INSULT' : 'OBSERVATION';
    }
    // If NPC is winning, can afford to be dismissive
    if (npcWins > playerWins) {
        return Math.random() > 0.5 ? 'DEFENSE' : 'OBSERVATION';
    }
    // Tied - use stats
    if (wit >= 14) {
        return Math.random() > 0.3 ? 'INSULT' : 'OBSERVATION';
    }
    if (composure >= 14) {
        return Math.random() > 0.4 ? 'DEFENSE' : 'OBSERVATION';
    }
    const types: CardType[] = ['INSULT', 'OBSERVATION', 'DEFENSE'];
    return types[Math.floor(Math.random() * types.length)];
};

// Card type matchups for LLM-free fallback
const CARD_MATCHUPS: Record<CardType, CardType> = {
    INSULT: 'DEFENSE',
    DEFENSE: 'OBSERVATION',
    OBSERVATION: 'INSULT',
};

// Determine winner based on card matchups (fallback mode)
const determineWinnerByMatchup = (
    playerCard: CardType,
    npcCard: CardType,
    playerStats: { wit: number; observation: number; composure: number },
    npcStats: { wit: number; observation: number; composure: number }
): 'PLAYER' | 'NPC' => {
    if (CARD_MATCHUPS[playerCard] === npcCard) {
        const statBonus = (playerStats.wit - npcStats.wit) * 0.02;
        return Math.random() < (0.7 + statBonus) ? 'PLAYER' : 'NPC';
    }
    if (CARD_MATCHUPS[npcCard] === playerCard) {
        const statBonus = (playerStats.wit - npcStats.wit) * 0.02;
        return Math.random() < (0.3 + statBonus) ? 'PLAYER' : 'NPC';
    }
    const playerTotal = playerStats.wit + playerStats.observation;
    const npcTotal = npcStats.wit + npcStats.observation;
    const playerChance = playerTotal / (playerTotal + npcTotal);
    return Math.random() < playerChance ? 'PLAYER' : 'NPC';
};

// Simple text quality heuristic for fallback mode
const evaluateTextQuality = (text: string): 'excellent' | 'good' | 'weak' | 'backfire' => {
    const lower = text.toLowerCase();

    const crudePatterns = [
        /\bsuck[s]?\b/, /\bidiot\b/, /\bstupid\b/, /\bloser\b/, /\bdumb\b/,
        /\bwhatever\b/, /\blame\b/, /\bpathetic\b/, /\bshut up\b/,
        /fuck|shit|damn|ass\b|crap|hell\b/
    ];
    if (crudePatterns.some(p => p.test(lower))) return 'backfire';

    const excellentPatterns = [
        /\bindeed\b/, /\bperhaps\b/, /\bone might\b/, /\bi confess\b/,
        /\bi observe\b/, /\bcurious\b/, /\brather\b/, /\bquite\b/,
        /\balas\b/, /\bpray tell\b/, /\bi daresay\b/, /\bforsooth\b/,
        /\bi fancy\b/, /\bpresume\b/, /\bdelicate\b/, /\bsubtlety\b/
    ];
    const excellentCount = excellentPatterns.filter(p => p.test(lower)).length;

    const wordCount = text.split(/\s+/).length;
    const avgWordLength = text.replace(/\s+/g, '').length / wordCount;

    if (excellentCount >= 2 && wordCount >= 8 && avgWordLength > 5) return 'excellent';
    if (excellentCount >= 1 || (wordCount >= 6 && avgWordLength > 4.5)) return 'good';
    if (wordCount < 4 || avgWordLength < 4) return 'weak';
    return 'good';
};

// Quality badge component
const QualityBadge: React.FC<{ quality: string }> = ({ quality }) => {
    const config = {
        excellent: { bg: 'bg-emerald-500', text: 'text-white', icon: <LucideSparkles size={14} />, label: 'EXCELLENT' },
        good: { bg: 'bg-blue-500', text: 'text-white', icon: null, label: 'GOOD' },
        weak: { bg: 'bg-yellow-500', text: 'text-ink-900', icon: null, label: 'WEAK' },
        backfire: { bg: 'bg-red-600', text: 'text-white', icon: <LucideAlertTriangle size={14} />, label: 'BACKFIRE' },
    }[quality] || { bg: 'bg-gray-500', text: 'text-white', icon: null, label: quality.toUpperCase() };

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${config.bg} ${config.text}`}>
            {config.icon}
            {config.label}
        </span>
    );
};

// Brief physical/emotional reactions for the result screen (not verbal responses)
const getNpcReaction = (
    npcName: string,
    winner: 'PLAYER' | 'NPC',
    quality: string,
    npcGender: 'male' | 'female' | 'unknown' = 'unknown'
): string => {
    const pronoun = npcGender === 'female' ? 'she' : npcGender === 'male' ? 'he' : 'they';
    const possessive = npcGender === 'female' ? 'her' : npcGender === 'male' ? 'his' : 'their';
    const firstName = npcName.split(' ')[0];

    if (winner === 'PLAYER') {
        if (quality === 'excellent') {
            const reactions = [
                `${firstName}'s composure falters visibly. A flush rises to ${possessive} cheeks.`,
                `You've struck a nerve. ${firstName} seems momentarily lost for words.`,
                `A flicker of surprise crosses ${firstName}'s face—${pronoun} hadn't expected that.`,
                `${firstName} blinks, caught off guard by the precision of your riposte.`,
                `The color drains slightly from ${firstName}'s face. A palpable hit.`,
            ];
            return reactions[Math.floor(Math.random() * reactions.length)];
        } else {
            const reactions = [
                `${firstName}'s expression tightens almost imperceptibly.`,
                `A slight pause. ${firstName} seems to be recalibrating.`,
                `${firstName} inclines ${possessive} head, acknowledging the point.`,
                `You notice ${firstName}'s jaw clench briefly.`,
            ];
            return reactions[Math.floor(Math.random() * reactions.length)];
        }
    } else {
        if (quality === 'backfire') {
            const reactions = [
                `${firstName}'s eyes gleam with satisfaction at your misstep.`,
                `A thin smile spreads across ${firstName}'s face. You've made an error.`,
                `${firstName} raises an eyebrow, clearly savoring your blunder.`,
                `You sense the onlookers' discomfort. That did not land well.`,
            ];
            return reactions[Math.floor(Math.random() * reactions.length)];
        } else {
            const reactions = [
                `${firstName} regards you with cool composure.`,
                `${firstName} seems unruffled by your attempt.`,
                `A faint smile plays at ${firstName}'s lips.`,
                `${firstName} appears unmoved, ${possessive} poise intact.`,
            ];
            return reactions[Math.floor(Math.random() * reactions.length)];
        }
    }
};

const CombatView: React.FC = () => {
    const { state, dispatch } = useGame();
    const { combat } = state;

    // UI state
    const [selectedCard, setSelectedCard] = useState<CombatCard | null>(null);
    const [playerInput, setPlayerInput] = useState('');
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [isGeneratingBarb, setIsGeneratingBarb] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [currentBarb, setCurrentBarb] = useState<{ text: string; cardType: CardType } | null>(null);
    const [exchangeResult, setExchangeResult] = useState<'PLAYER' | 'NPC' | null>(null);
    const [lastQuality, setLastQuality] = useState<string | null>(null);
    const [lastPlayerText, setLastPlayerText] = useState<string>('');
    const [npcResponse, setNpcResponse] = useState('');
    const [npcMood, setNpcMood] = useState<'NEUTRAL' | 'ANGRY' | 'SURPRISED' | 'SAD'>('NEUTRAL');
    const [npcReactionText, setNpcReactionText] = useState('');
    const [showIntro, setShowIntro] = useState(true);
    const [statChanges, setStatChanges] = useState<Array<{ stat: string; delta: number; newValue: number }>>([]);
    const [lootItem, setLootItem] = useState<any>(null);
    const [expandedExchange, setExpandedExchange] = useState<number | null>(null);

    // Stable card hand for the duration of combat (fix randomization bug)
    const playerHandRef = useRef<CombatCard[] | null>(null);
    const playerHand = useMemo(() => {
        if (playerHandRef.current) return playerHandRef.current;
        const unlocked = getUnlockedCards(state.player.unlockedCards);
        const shuffled = [...unlocked].sort(() => Math.random() - 0.5);
        playerHandRef.current = shuffled.slice(0, 3);
        return playerHandRef.current;
    }, []);

    // Start battle music
    useEffect(() => {
        if (!state.audio.muted) startBattleMusic();
        return () => stopBattleMusic();
    }, [state.audio.muted]);

    // Auto-dismiss intro after delay
    useEffect(() => {
        if (showIntro) {
            const timer = setTimeout(() => setShowIntro(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showIntro]);

    // Generate NPC's opening barb when combat starts or new exchange begins
    useEffect(() => {
        if (combat && combat.phase === 'NPC_SPEAKS' && !currentBarb && !isGeneratingBarb && !showIntro) {
            generateBarb();
        }
    }, [combat?.phase, combat?.currentExchange, showIntro]);

    const generateBarb = async () => {
        if (!combat || !combat.opponent) return;

        setIsGeneratingBarb(true);
        const cardType = selectNpcCardType(
            combat.opponent,
            combat.currentExchange,
            combat.npcWins,
            combat.playerWins
        );

        if (combat.useLLM) {
            try {
                const barb = await generateNpcBarb(
                    combat.opponent.name,
                    combat.opponent.profession,
                    combat.opponent.nationality,
                    combat.opponent.combatStats?.wit || 10,
                    combat.opponent.combatStats?.observation || 10,
                    combat.opponent.combatStats?.composure || 10,
                    combat.currentExchange,
                    combat.exchanges.map(ex => ({
                        npcBarb: ex.npcBarb,
                        playerResponse: ex.playerResponse,
                        winner: ex.winner
                    })),
                    state.player.stats.malaise,
                    state.player.stats.composure,
                    cardType,
                    combat.knowsJames ?? false
                );
                setCurrentBarb(barb);
            } catch (error) {
                console.error('Failed to generate NPC barb, using fallback:', error);
                setCurrentBarb({
                    text: getFallbackBarb(combat.opponent.profession, cardType),
                    cardType
                });
            }
        } else {
            setCurrentBarb({
                text: getFallbackBarb(combat.opponent.profession, cardType),
                cardType
            });
        }

        setIsGeneratingBarb(false);
        if (!state.audio.muted) playSound('VOICE_MUMBLE');
    };

    if (!combat || !combat.opponent) return null;

    const handleCardSelect = (card: CombatCard) => {
        if (isEvaluating || isGeneratingBarb) return;
        setSelectedCard(card);
        if (!state.audio.muted) playSound('BLIP');
    };

    const handleSubmitResponse = async () => {
        if (!selectedCard || !playerInput.trim() || !currentBarb) return;

        setIsEvaluating(true);
        setLastPlayerText(playerInput.trim());

        try {
            let winner: 'PLAYER' | 'NPC';
            let quality: 'excellent' | 'good' | 'weak' | 'backfire';
            let response: string;

            if (combat.useLLM) {
                try {
                    const result = await evaluateCombatExchange(
                        playerInput.trim(),
                        selectedCard.type,
                        currentBarb.text,
                        currentBarb.cardType,
                        combat.opponent!.name,
                        combat.opponent!.profession,
                        combat.opponent!.combatStats?.wit || 10,
                        combat.exchanges.map(ex => ({
                            npcBarb: ex.npcBarb,
                            playerResponse: ex.playerResponse,
                            winner: ex.winner,
                            quality: ex.quality
                        })),
                        state.player.stats.malaise,
                        combat.knowsJames ?? false
                    );
                    quality = result.quality;
                    response = result.npcResponse;

                    if (quality === 'excellent') {
                        winner = 'PLAYER';
                    } else if (quality === 'backfire') {
                        winner = 'NPC';
                    } else if (quality === 'good') {
                        const playerWit = state.player.stats.wit || 10;
                        const npcWit = combat.opponent!.combatStats?.wit || 10;
                        winner = Math.random() < (playerWit / (playerWit + npcWit)) ? 'PLAYER' : 'NPC';
                    } else {
                        winner = Math.random() < 0.3 ? 'PLAYER' : 'NPC';
                    }
                } catch (error) {
                    console.error('LLM evaluation failed, using fallback:', error);
                    quality = evaluateTextQuality(playerInput.trim());
                    winner = quality === 'backfire' ? 'NPC' :
                             quality === 'excellent' ? 'PLAYER' :
                             determineWinnerByMatchup(
                                 selectedCard.type,
                                 currentBarb.cardType,
                                 { wit: state.player.stats.wit, observation: state.player.stats.observation, composure: state.player.stats.composure },
                                 combat.opponent!.combatStats || { wit: 10, observation: 10, composure: 10 }
                             );
                    response = winner === 'PLAYER'
                        ? "I... find myself without an adequate response."
                        : "A feeble effort. I expected more from a man of letters.";
                }
            } else {
                quality = evaluateTextQuality(playerInput.trim());
                winner = quality === 'backfire' ? 'NPC' :
                         quality === 'excellent' ? 'PLAYER' :
                         determineWinnerByMatchup(
                             selectedCard.type,
                             currentBarb.cardType,
                             { wit: state.player.stats.wit, observation: state.player.stats.observation, composure: state.player.stats.composure },
                             combat.opponent!.combatStats || { wit: 10, observation: 10, composure: 10 }
                         );
                response = winner === 'PLAYER'
                    ? "I... find myself without an adequate response."
                    : "A feeble effort. I expected more from a man of letters.";
            }

            // Update NPC mood based on outcome
            if (winner === 'PLAYER') {
                setNpcMood(quality === 'excellent' ? 'SURPRISED' : 'SAD');
            } else {
                setNpcMood(quality === 'backfire' ? 'ANGRY' : 'NEUTRAL');
            }

            // Generate brief physical reaction (not verbal response)
            const npcGender = combat.opponent!.name.includes('Madame') || combat.opponent!.name.includes('Mrs') ? 'female' :
                             combat.opponent!.name.includes('Monsieur') || combat.opponent!.name.includes('Mr') ? 'male' : 'unknown';
            const reactionText = getNpcReaction(combat.opponent!.name, winner, quality, npcGender as 'male' | 'female' | 'unknown');
            setNpcReactionText(reactionText);

            // Play appropriate sound
            if (!state.audio.muted) {
                playSound(winner === 'PLAYER' ? 'SUCCESS' : 'DAMAGE');
                if (winner === 'NPC') dispatch({ type: 'TRIGGER_SHAKE' });
            }

            // Record exchange
            const newExchange: CombatExchange = {
                npcBarb: currentBarb.text,
                npcCardType: currentBarb.cardType,
                playerResponse: playerInput.trim(),
                playerCardType: selectedCard.type,
                winner,
                quality
            };

            const newPlayerWins = combat.playerWins + (winner === 'PLAYER' ? 1 : 0);
            const newNpcWins = combat.npcWins + (winner === 'NPC' ? 1 : 0);

            setExchangeResult(winner);
            setLastQuality(quality);
            setNpcResponse(response); // Keep for potential future use but won't display
            setShowResult(true);

            const matchOver = newPlayerWins >= 2 || newNpcWins >= 2;

            dispatch({
                type: 'UPDATE_COMBAT',
                payload: {
                    ...combat,
                    playerWins: newPlayerWins,
                    npcWins: newNpcWins,
                    currentExchange: combat.currentExchange + 1,
                    exchanges: [...combat.exchanges, newExchange],
                    phase: matchOver ? 'COMPLETE' : 'RESOLUTION',
                    log: [
                        ...combat.log,
                        `Exchange ${combat.currentExchange}: ${winner === 'PLAYER' ? 'You win!' : 'They win.'} (${quality})`
                    ]
                }
            });

            if (quality === 'backfire') {
                dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: -15 } });
                dispatch({ type: 'ADJUST_STAT', payload: { stat: 'malaise', delta: 10 } });
            }

        } catch (error) {
            console.error('Combat error:', error);
        }

        setIsEvaluating(false);
    };

    const handleContinue = () => {
        setShowResult(false);
        setSelectedCard(null);
        setPlayerInput('');
        setCurrentBarb(null);
        setExchangeResult(null);
        setLastQuality(null);
        setLastPlayerText('');
        setNpcResponse('');
        setNpcReactionText('');
        setNpcMood('NEUTRAL');

        if (combat.playerWins >= 2 || combat.npcWins >= 2) {
            // Show summary page instead of ending immediately
            prepareSummary();
        } else {
            dispatch({
                type: 'UPDATE_COMBAT',
                payload: {
                    ...combat,
                    phase: 'NPC_SPEAKS'
                }
            });
        }
    };

    const prepareSummary = async () => {
        const victory = combat.playerWins >= 2;
        const changes: Array<{ stat: string; delta: number; newValue: number }> = [];

        // Count excellent responses for potential wit increase
        const excellentCount = combat.exchanges.filter(ex => ex.quality === 'excellent').length;
        // Count backfires for potential observation decrease
        const backfireCount = combat.exchanges.filter(ex => ex.quality === 'backfire').length;

        if (victory) {
            if (!state.audio.muted) playSound('SUCCESS');

            // Reputation boost
            changes.push({
                stat: 'Reputation',
                delta: 15,
                newValue: Math.min(100, state.player.stats.reputation + 15)
            });
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: 15 } });

            // Malaise reduction
            changes.push({
                stat: 'Malaise',
                delta: -5,
                newValue: Math.max(0, state.player.stats.malaise - 5)
            });
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'malaise', delta: -5 } });

            // Wit increase if player got at least 1 excellent
            if (excellentCount >= 1 && state.player.stats.wit < 20) {
                const witBoost = excellentCount >= 2 ? 2 : 1;
                changes.push({
                    stat: 'Wit',
                    delta: witBoost,
                    newValue: Math.min(20, state.player.stats.wit + witBoost)
                });
                dispatch({ type: 'ADJUST_STAT', payload: { stat: 'wit', delta: witBoost } });
            }

            // Composure boost from winning
            if (state.player.stats.composure < 100) {
                changes.push({
                    stat: 'Composure',
                    delta: 10,
                    newValue: Math.min(100, state.player.stats.composure + 10)
                });
                dispatch({ type: 'ADJUST_STAT', payload: { stat: 'composure', delta: 10 } });
            }

            // Generate loot
            const item = await generateCombatLoot(combat.opponent!.name, combat.opponent!.profession);
            if (item) {
                setLootItem(item);
                dispatch({ type: 'ADD_ITEM', payload: item });
            }
        } else {
            // Loss penalties
            changes.push({
                stat: 'Reputation',
                delta: -20,
                newValue: Math.max(0, state.player.stats.reputation - 20)
            });
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: -20 } });

            changes.push({
                stat: 'Malaise',
                delta: 15,
                newValue: Math.min(100, state.player.stats.malaise + 15)
            });
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'malaise', delta: 15 } });

            // Composure loss from defeat
            changes.push({
                stat: 'Composure',
                delta: -15,
                newValue: Math.max(0, state.player.stats.composure - 15)
            });
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'composure', delta: -15 } });

            // Extra penalties for backfires
            if (backfireCount > 0) {
                const extraMalaise = backfireCount * 5;
                changes.push({
                    stat: 'Malaise (from social blunders)',
                    delta: extraMalaise,
                    newValue: Math.min(100, state.player.stats.malaise + 15 + extraMalaise)
                });
                dispatch({ type: 'ADJUST_STAT', payload: { stat: 'malaise', delta: extraMalaise } });
            }
        }

        // Observation can increase from any combat if player used OBSERVATION cards well
        const observationWins = combat.exchanges.filter(
            ex => ex.playerCardType === 'OBSERVATION' && ex.winner === 'PLAYER'
        ).length;
        if (observationWins >= 2 && state.player.stats.observation < 20) {
            changes.push({
                stat: 'Observation',
                delta: 1,
                newValue: Math.min(20, state.player.stats.observation + 1)
            });
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'observation', delta: 1 } });
        }

        setStatChanges(changes);
        setShowSummary(true);
    };

    const handleEndCombat = () => {
        dispatch({ type: 'END_COMBAT' });
    };

    const handleFlee = () => {
        dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: -10 } });
        dispatch({ type: 'END_COMBAT' });
    };

    const getCardColor = (type: CardType) => {
        switch(type) {
            case 'INSULT': return 'from-red-800 to-red-950 border-red-500';
            case 'DEFENSE': return 'from-amber-700 to-amber-900 border-amber-500';
            case 'OBSERVATION': return 'from-blue-800 to-blue-950 border-blue-500';
            default: return 'from-gray-700 to-gray-900 border-gray-500';
        }
    };

    const getCardIcon = (type: CardType, size = 20) => {
        switch(type) {
            case 'INSULT': return <LucideSword size={size} className="text-red-400" />;
            case 'DEFENSE': return <LucideShield size={size} className="text-amber-400" />;
            case 'OBSERVATION': return <LucideEye size={size} className="text-blue-400" />;
        }
    };

    // ===== INTRO SCREEN =====
    if (showIntro) {
        return (
            <div className="flex flex-col h-full w-full bg-gradient-to-b from-ink-900 via-ink-800 to-ink-900 items-center justify-center p-8 animate-fade-in">
                <div className="w-20 h-20 border-4 border-red-500 rounded-full bg-ink-900 overflow-hidden flex items-center justify-center mb-4">
                    <NpcPortrait
                        npc={combat.opponent}
                        mood="NEUTRAL"
                        speaking={false}
                        size="sm"
                        showBorder={false}
                        className="scale-[1.2]"
                    />
                </div>
                <h2 className="font-display text-2xl text-gold-400 mb-2 text-center">Battle of Wits</h2>
                <p className="text-paper-100 text-center font-serif">
                    You have engaged <span className="text-gold-400 font-bold">{combat.opponent.name}</span>
                </p>
                <p className="text-paper-300 text-sm text-center">{combat.opponent.profession}</p>
                <div className="mt-4 text-paper-400 text-xs animate-pulse">First to win 2 exchanges...</div>
            </div>
        );
    }

    // ===== RESULT SCREEN =====
    if (showResult) {
        // Use the already-updated combat state (no double counting)
        const matchOver = combat.playerWins >= 2 || combat.npcWins >= 2;

        return (
            <div className="flex flex-col h-full w-full bg-gradient-to-b from-ink-900 via-ink-800 to-ink-900 p-4 animate-fade-in">
                {/* Score */}
                <div className="flex justify-center gap-8 mb-4">
                    <div className="text-center">
                        <div className="text-xs text-paper-300 uppercase">You</div>
                        <div className={`text-3xl font-display font-bold ${exchangeResult === 'PLAYER' ? 'text-emerald-400 animate-pulse' : 'text-blue-400'}`}>
                            {combat.playerWins}
                        </div>
                    </div>
                    <div className="text-2xl text-paper-300 self-center">—</div>
                    <div className="text-center">
                        <div className="text-xs text-paper-300 uppercase">{combat.opponent?.name.split(' ')[0]}</div>
                        <div className={`text-3xl font-display font-bold ${exchangeResult === 'NPC' ? 'text-red-400 animate-pulse' : 'text-red-400/70'}`}>
                            {combat.npcWins}
                        </div>
                    </div>
                </div>

                {/* Exchange Result */}
                <div className={`flex-1 flex flex-col p-4 rounded-lg mb-4 overflow-auto ${
                    exchangeResult === 'PLAYER' ? 'bg-emerald-900/20 border border-emerald-500/50' : 'bg-red-900/20 border border-red-500/50'
                }`}>
                    {/* Result header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className={`text-lg font-display font-bold ${
                            exchangeResult === 'PLAYER' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                            {exchangeResult === 'PLAYER' ? '✓ Point to you' : '✗ Point to them'}
                        </div>
                        {lastQuality && <QualityBadge quality={lastQuality} />}
                    </div>

                    {/* What you said */}
                    <div className="bg-blue-900/30 border-l-4 border-blue-500 p-3 rounded mb-3">
                        <div className="text-xs text-blue-300 mb-1 font-bold">YOUR RESPONSE:</div>
                        <div className="font-serif text-paper-100 italic text-sm">"{lastPlayerText}"</div>
                    </div>

                    {/* NPC Physical Reaction (not verbal) with portrait */}
                    <div className="bg-ink-900/50 rounded-lg p-3 flex gap-3 items-center">
                        <div className="w-12 h-12 border-2 border-red-500/50 rounded-full bg-ink-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                            <NpcPortrait
                                npc={combat.opponent}
                                mood={npcMood}
                                speaking={false}
                                size="sm"
                                showBorder={false}
                                className="scale-[0.9]"
                            />
                        </div>
                        <div className="font-serif italic text-paper-200 text-sm">
                            {npcReactionText}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleContinue}
                    className="w-full py-3 bg-gold-600 hover:bg-gold-500 text-ink-900 font-display font-bold rounded-lg transition-colors"
                >
                    Continue
                </button>
            </div>
        );
    }

    // ===== SUMMARY SCREEN =====
    if (showSummary) {
        const victory = combat.playerWins >= 2;

        return (
            <div className="flex flex-col h-full w-full bg-gradient-to-b from-ink-900 via-ink-800 to-ink-900 p-4 animate-fade-in overflow-hidden">
                {/* Header */}
                <div className={`text-center mb-4 pb-3 border-b ${victory ? 'border-gold-500/50' : 'border-red-500/50'}`}>
                    <div className={`text-2xl font-display font-bold mb-1 ${victory ? 'text-gold-400' : 'text-red-500'}`}>
                        {victory ? '🏆 Victory' : '💀 Defeat'}
                    </div>
                    <div className="text-paper-300 text-sm">
                        vs. <span className="text-paper-100 font-bold">{combat.opponent?.name}</span>
                    </div>
                    <div className="mt-1 text-lg font-display">
                        <span className="text-blue-400">{combat.playerWins}</span>
                        <span className="text-paper-300 mx-2">—</span>
                        <span className="text-red-400">{combat.npcWins}</span>
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-auto space-y-3">
                    {/* Compact Repartee Visualization */}
                    <div className="bg-ink-800/50 rounded-lg p-3">
                        <h3 className="font-display font-bold text-paper-100 mb-2 text-xs uppercase tracking-wide">
                            The Repartee
                        </h3>
                        {/* Compact visualization - circles showing win/loss */}
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {combat.exchanges.map((exchange, i) => (
                                <button
                                    key={i}
                                    onClick={() => setExpandedExchange(expandedExchange === i ? null : i)}
                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${
                                        exchange.winner === 'PLAYER'
                                            ? 'border-emerald-500 bg-emerald-900/30 text-emerald-400'
                                            : 'border-red-500 bg-red-900/30 text-red-400'
                                    } ${expandedExchange === i ? 'ring-2 ring-gold-500' : ''}`}
                                    title={`Exchange ${i + 1}: ${exchange.winner === 'PLAYER' ? 'You won' : 'They won'}`}
                                >
                                    <span className="text-xs font-bold">{i + 1}</span>
                                </button>
                            ))}
                        </div>
                        <div className="text-center text-[10px] text-paper-400 mb-2">
                            Tap an exchange to view details
                        </div>

                        {/* Expanded exchange detail */}
                        {expandedExchange !== null && combat.exchanges[expandedExchange] && (
                            <div className={`p-3 rounded border-l-4 animate-fade-in ${
                                combat.exchanges[expandedExchange].winner === 'PLAYER'
                                    ? 'bg-emerald-900/20 border-emerald-500'
                                    : 'bg-red-900/20 border-red-500'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-paper-400">Exchange {expandedExchange + 1}</span>
                                    <QualityBadge quality={combat.exchanges[expandedExchange].quality || 'good'} />
                                </div>

                                {/* NPC's barb */}
                                <div className="mb-2">
                                    <span className="text-[10px] text-red-400 font-bold uppercase">{combat.opponent?.name.split(' ')[0]}:</span>
                                    <p className="font-serif text-paper-200 text-base mt-0.5">"{renderCombatMarkdown(combat.exchanges[expandedExchange].npcBarb)}"</p>
                                </div>

                                {/* Player's response */}
                                <div className="mb-2">
                                    <span className="text-[10px] text-blue-400 font-bold uppercase">You:</span>
                                    <p className="font-serif text-paper-200 text-base mt-0.5 italic">"{combat.exchanges[expandedExchange].playerResponse}"</p>
                                </div>

                                <div className={`text-xs font-bold ${
                                    combat.exchanges[expandedExchange].winner === 'PLAYER' ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                    {combat.exchanges[expandedExchange].winner === 'PLAYER' ? '→ Point to you' : '→ Point to them'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stat changes - more compact */}
                    <div className="bg-ink-800/50 rounded-lg p-3">
                        <h3 className="font-display font-bold text-paper-100 mb-2 text-xs uppercase tracking-wide">
                            Consequences
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {statChanges.map((change, i) => (
                                <div key={i} className="flex items-center justify-between bg-ink-900/50 px-2 py-1 rounded animate-stat-pop" style={{ animationDelay: `${i * 100}ms` }}>
                                    <span className="text-paper-300 text-xs">{change.stat}</span>
                                    <span className={`font-bold text-sm ${
                                        change.delta > 0 ? 'text-emerald-400' : 'text-red-400'
                                    }`}>
                                        {change.delta > 0 ? '+' : ''}{change.delta}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Narrative summary - shorter */}
                        <p className="font-serif text-paper-300 text-xs italic mt-3 leading-relaxed">
                            {victory ? (
                                getVictoryMessage(combat.opponent!)
                            ) : (
                                getDefeatMessage(combat.opponent!)
                            )}
                        </p>
                    </div>

                    {/* Loot - more compact */}
                    {lootItem && (
                        <div className="bg-gold-900/20 border border-gold-500/50 rounded-lg p-2 flex items-center gap-3">
                            <div className="w-8 h-8 bg-ink-800 rounded flex items-center justify-center text-xl">
                                {lootItem.emoji || '📦'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-paper-100 text-sm">{lootItem.name}</div>
                                <div className="text-[10px] text-paper-300 truncate">{lootItem.description}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* End button */}
                <button
                    onClick={handleEndCombat}
                    className="w-full py-3 mt-3 bg-gold-600 hover:bg-gold-500 text-ink-900 font-display font-bold rounded-lg transition-colors"
                >
                    Depart
                </button>
            </div>
        );
    }

    // ===== MAIN COMBAT VIEW =====
    return (
        <div className="flex flex-col h-full w-full bg-gradient-to-b from-ink-900 via-ink-800 to-ink-900">
            {/* Header with score */}
            <div className="flex items-center justify-between px-4 py-3 bg-ink-950/50 border-b border-gold-600/30">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 border-2 border-red-500 rounded-full bg-ink-900 overflow-hidden flex items-center justify-center">
                        <NpcPortrait
                            npc={combat.opponent}
                            mood={npcMood}
                            speaking={isGeneratingBarb}
                            size="sm"
                            showBorder={false}
                            className="scale-[0.9]"
                        />
                    </div>
                    <div>
                        <div className="font-display font-bold text-paper-100">{combat.opponent.name}</div>
                        <div className="text-xs text-paper-300">{combat.opponent.profession}</div>
                    </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-display font-bold text-blue-400">{combat.playerWins}</div>
                        <div className="text-[10px] text-paper-300">YOU</div>
                    </div>
                    <div className="text-paper-300 text-lg">vs</div>
                    <div className="text-center">
                        <div className="text-2xl font-display font-bold text-red-400">{combat.npcWins}</div>
                        <div className="text-[10px] text-paper-300">THEM</div>
                    </div>
                </div>

                <button
                    onClick={handleFlee}
                    className="text-paper-300 hover:text-red-400 text-xs flex items-center gap-1"
                >
                    <LucideX size={14} /> Flee
                </button>
            </div>

            {/* Exchange counter */}
            <div className="text-center py-2 text-sm text-paper-300 border-b border-ink-700">
                Exchange {combat.currentExchange} of 3 • First to 2 wins
            </div>

            {/* NPC's barb */}
            <div className="flex-1 flex flex-col px-4 py-3 overflow-hidden">
                {isGeneratingBarb ? (
                    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-4 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-red-400">
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                            <span className="font-serif italic">{combat.opponent.name} considers their words...</span>
                        </div>
                    </div>
                ) : currentBarb && (
                    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-4 animate-fade-in">
                        <div className="flex items-center gap-2 mb-2">
                            {getCardIcon(currentBarb.cardType, 16)}
                            <span className="text-xs text-red-400 uppercase font-bold">{currentBarb.cardType}</span>
                            <span className="text-xs text-paper-400">— {combat.opponent.name}</span>
                        </div>
                        <div className="text-xl font-serif text-paper-100 leading-relaxed">
                            "{renderCombatMarkdown(currentBarb.text)}"
                        </div>
                    </div>
                )}

                {/* Player's response input */}
                {selectedCard ? (
                    <div className="flex-1 flex flex-col bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 animate-fade-in">
                        <div className="flex items-center gap-2 mb-3">
                            {getCardIcon(selectedCard.type)}
                            <span className="font-display font-bold text-paper-100">{selectedCard.name}</span>
                            <span className="text-xs text-paper-300">({selectedCard.type})</span>
                        </div>

                        <div className="text-xs text-paper-400 mb-2 bg-ink-800/50 p-2 rounded">
                            💡 <strong>Tip:</strong> Write as Henry James would speak—subtle, allusive, devastatingly polite.
                            Reference their profession or words for bonus points.
                        </div>

                        <textarea
                            value={playerInput}
                            onChange={(e) => setPlayerInput(e.target.value)}
                            placeholder="Write your 1889-appropriate witty response..."
                            className="flex-1 w-full p-3 bg-ink-900/50 border border-ink-600 rounded font-serif text-paper-100 resize-none focus:outline-none focus:border-gold-500 placeholder-paper-400"
                            autoFocus
                            disabled={isEvaluating}
                        />

                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => { setSelectedCard(null); if (!state.audio.muted) playSound('BLIP'); }}
                                className="px-4 py-2 bg-ink-700 hover:bg-ink-600 text-paper-100 rounded font-display transition-colors"
                                disabled={isEvaluating}
                            >
                                ← Back
                            </button>
                            <button
                                onClick={handleSubmitResponse}
                                disabled={!playerInput.trim() || isEvaluating}
                                className="flex-1 px-4 py-2 bg-gold-600 hover:bg-gold-500 disabled:bg-ink-600 disabled:cursor-not-allowed text-ink-900 font-display font-bold rounded flex items-center justify-center gap-2 transition-colors"
                            >
                                {isEvaluating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-ink-900 border-t-transparent rounded-full animate-spin" />
                                        Evaluating...
                                    </>
                                ) : (
                                    <>
                                        <LucideSend size={16} /> Deliver Riposte
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col">
                        <div className="text-center text-paper-300 mb-3">Choose your response:</div>
                        <div className="flex-1 flex items-center justify-center gap-3">
                            {playerHand.map((card, index) => (
                                <button
                                    key={card.id}
                                    onClick={() => handleCardSelect(card)}
                                    disabled={isGeneratingBarb}
                                    className={`w-28 h-44 rounded-lg border-2 p-3 transition-all duration-300 hover:-translate-y-3 hover:scale-105 hover:shadow-xl hover:shadow-gold-500/30 bg-gradient-to-b ${getCardColor(card.type)} flex flex-col ${isGeneratingBarb ? 'opacity-50 cursor-not-allowed' : 'animate-card-fan-in'}`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="text-[9px] font-bold uppercase text-paper-200 mb-1">{card.type}</div>
                                    <div className="flex-1 flex items-center justify-center">
                                        {getCardIcon(card.type, 28)}
                                    </div>
                                    <div className="font-display font-bold text-xs text-paper-100 leading-tight">{card.name}</div>
                                    <div className="text-[8px] text-paper-300 mt-1 leading-tight line-clamp-2">{card.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Help text */}
            <div className="px-4 py-2 bg-ink-950/50 border-t border-gold-600/30">
                <div className="text-[10px] text-paper-400 text-center">
                    <span className="text-red-400">INSULT</span> beats <span className="text-amber-400">DEFENSE</span> •
                    <span className="text-amber-400"> DEFENSE</span> beats <span className="text-blue-400">OBSERVATION</span> •
                    <span className="text-blue-400"> OBSERVATION</span> beats <span className="text-red-400">INSULT</span>
                </div>
            </div>
        </div>
    );
};

export default CombatView;
