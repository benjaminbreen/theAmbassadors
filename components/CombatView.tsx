
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { generateCombatMove } from '../services/geminiService';
import { generateCombatLoot } from '../services/itemGenerator';
import { playSound } from '../services/audioService';
import { CombatCard } from '../types';
import { LucideSword, LucideShield, LucideEye, LucideX } from 'lucide-react';

const CombatView: React.FC = () => {
  const { state, dispatch } = useGame();
  const { combat } = state;
  const [isThinking, setIsThinking] = useState(false);
  const [flyingText, setFlyingText] = useState<{text: string, start: boolean} | null>(null);
  const [opponentCard, setOpponentCard] = useState<{text: string, damage: number} | null>(null);
  const [roundCount, setRoundCount] = useState(1);
  const [totalDamageDealt, setTotalDamageDealt] = useState(0);
  const [totalDamageReceived, setTotalDamageReceived] = useState(0);

  useEffect(() => {
      if (flyingText) {
          const timer = setTimeout(() => setFlyingText(null), 1000);
          return () => clearTimeout(timer);
      }
  }, [flyingText]);

  if (!combat || !combat.opponent) return null;

  const handleCardPlay = async (card: CombatCard) => {
    if (isThinking || combat.turn === 'OPPONENT') return;

    if (!state.audio.muted) playSound('ATTACK');
    setFlyingText({ text: `${card.name} (-${card.damage})`, start: true });
    setOpponentCard(null); // Clear previous opponent card
    dispatch({ type: 'PLAYER_PLAY_CARD', payload: card });

    // Condensed combat log
    dispatch({ type: 'ADD_LOG', payload: {
        id: Date.now().toString(),
        type: 'COMBAT',
        text: `You landed ${card.name}! -${card.damage} damage.`,
        timestamp: Date.now()
    }});

    setTotalDamageDealt(prev => prev + card.damage);
    setIsThinking(true);

    try {
      const response = await generateCombatMove(combat.opponent, card, combat.log);

      // Calculate damage to both sides
      const damageToOpponent = card.damage || 0;
      const newOpponentHp = Math.max(0, combat.opponentHp - damageToOpponent);
      const newPlayerHp = Math.max(0, combat.playerHp - (response.damage || 0));

      if (!state.audio.muted) playSound('DAMAGE');
      dispatch({ type: 'TRIGGER_SHAKE' });

      const responseText = response.text || "They scoff at you.";
      const responseDamage = response.damage || 5;

      // Show opponent's card
      setOpponentCard({ text: responseText, damage: responseDamage });

      // Condensed log message
      dispatch({ type: 'ADD_LOG', payload: {
          id: Date.now().toString(),
          type: 'COMBAT',
          text: `${combat.opponent.name} countered with powerful retort! -${responseDamage} Composure.`,
          timestamp: Date.now(),
          speaker: combat.opponent.name
      }});

      setTotalDamageReceived(prev => prev + responseDamage);

      dispatch({ type: 'UPDATE_COMBAT', payload: {
          playerHp: newPlayerHp,
          opponentHp: newOpponentHp,
          log: [...combat.log, `You: ${card.name} (-${damageToOpponent})`, `${combat.opponent.name}: ${responseText} (-${responseDamage})`]
      }});

      // Check victory/defeat
      if (newPlayerHp <= 0) {
           dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'SYSTEM', text: "You have lost your composure. You retreat in shame.", timestamp: Date.now() } });
           dispatch({ type: 'END_COMBAT' });
      } else if (newOpponentHp <= 0) {
           if (!state.audio.muted) playSound('SUCCESS');
           dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'SYSTEM', text: `${combat.opponent.name} concedes defeat. Victory is yours!`, timestamp: Date.now() } });

           // Generate victory loot
           generateCombatLoot(combat.opponent.name, combat.opponent.profession).then(item => {
             if (item) {
               dispatch({ type: 'ADD_ITEM', payload: item });
               dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'SYSTEM', text: `${combat.opponent.name} offers you: ${item.name}`, timestamp: Date.now() } });
             }
           });

           dispatch({ type: 'END_COMBAT' });
      } else {
          setRoundCount(prev => prev + 1);
          dispatch({ type: 'COMBAT_TURN_END' });
      }

      setIsThinking(false);
    } catch (error) {
      console.error('Combat error:', error);
      dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'SYSTEM', text: 'The duel falters... your opponent seems confused.', timestamp: Date.now() } });
      setIsThinking(false);
    }
  };

  const getCardColor = (type: string) => {
      switch(type) {
          case 'INSULT': return 'bg-red-100 border-red-800 text-red-900';
          case 'DEFENSE': return 'bg-gold-100 border-gold-800 text-ink-900';
          case 'OBSERVATION': return 'bg-blue-100 border-blue-800 text-blue-900';
          default: return 'bg-paper-200';
      }
  };

  return (
    <div className="flex h-full w-full p-4 gap-4 relative overflow-hidden">

        {flyingText && (
            <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 text-3xl font-display font-bold text-ink-900 animate-[ping_1s_ease-out_forwards] z-50 opacity-0 pointer-events-none">
                {flyingText.text}
            </div>
        )}

        {/* LEFT COLUMN: NPC Portrait & Helper Panel */}
        <div className="w-80 flex flex-col gap-4 shrink-0">
            {/* Opponent's Played Card - Above Portrait */}
            {opponentCard && (
                <div className="animate-fade-in">
                    <div className="bg-red-50 border-2 border-red-800 rounded shadow-2xl p-4 text-center">
                        <div className="text-xs font-bold uppercase tracking-wider mb-2 text-red-600">RETORT</div>
                        <div className="font-serif italic text-base leading-snug mb-3 text-ink-900 min-h-[70px] flex items-center justify-center">
                            "{opponentCard.text}"
                        </div>
                        <div className="text-sm font-mono font-bold bg-red-800 text-white px-3 py-1.5 rounded inline-block">
                            DMG: {opponentCard.damage}
                        </div>
                    </div>
                </div>
            )}

            {/* NPC Portrait - Left Aligned */}
            <div className="bg-paper-100 border-2 border-gold-600 rounded-lg p-4 shadow-xl">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-24 h-24 border-4 border-double border-gold-500 rounded-full flex items-center justify-center bg-ink-900 text-paper-50 text-4xl font-display shadow-xl shrink-0">
                        {combat.opponent.avatarChar}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-display font-bold text-ink-900 mb-1">{combat.opponent.name}</h2>
                        <div className="text-sm font-mono text-ink-600 mb-1">{combat.opponent.profession}</div>
                        <div className="text-xs text-ink-500 italic">{combat.opponent.historicalNote}</div>
                    </div>
                </div>

                {/* Opponent HP */}
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-4 bg-gray-300 rounded-full overflow-hidden border border-gray-400 shadow-inner">
                        <div className="h-full bg-red-800 transition-all duration-500 ease-out" style={{ width: `${combat.opponentHp}%` }}></div>
                    </div>
                    <span className="text-sm font-mono text-ink-600 font-bold w-12 text-right">{Math.round(combat.opponentHp)}%</span>
                </div>
            </div>

            {/* Helper Panel: Instructions & Battle State */}
            <div className="bg-ink-900 border-2 border-gold-600 rounded-lg p-4 shadow-xl text-paper-100 flex-1">
                <h3 className="font-display text-base font-bold text-gold-500 mb-3 uppercase tracking-wide">Battle Guide</h3>

                <div className="space-y-3 text-sm">
                    <div>
                        <div className="text-xs uppercase text-gold-600 font-bold mb-1">How to Play:</div>
                        <div className="text-xs leading-relaxed text-paper-200">
                            Click a card to play it. Each card deals damage to your opponent. They will counter with their own retort.
                            First to 0% Composure loses!
                        </div>
                    </div>

                    <div className="border-t border-gold-600/30 pt-3">
                        <div className="text-xs uppercase text-gold-600 font-bold mb-2">Battle Statistics:</div>
                        <div className="space-y-1 text-xs font-mono">
                            <div className="flex justify-between">
                                <span className="text-paper-300">Round:</span>
                                <span className="text-white font-bold">{roundCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-paper-300">Damage Dealt:</span>
                                <span className="text-green-400 font-bold">{totalDamageDealt}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-paper-300">Damage Taken:</span>
                                <span className="text-red-400 font-bold">{totalDamageReceived}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gold-600/30 pt-3">
                        <div className="text-xs uppercase text-gold-600 font-bold mb-2">Win Condition:</div>
                        <div className="text-xs leading-relaxed text-paper-200">
                            Reduce opponent's Composure to 0% before yours runs out.
                        </div>
                    </div>
                </div>

                {/* Prominent Flee Button */}
                <button
                    onClick={() => dispatch({ type: 'END_COMBAT' })}
                    className="w-full mt-4 bg-red-900 hover:bg-red-800 text-white font-display font-bold py-2.5 px-4 rounded transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                    <LucideX size={18} />
                    FLEE BATTLE
                </button>
            </div>
        </div>

        {/* RIGHT COLUMN: Combat Log & Player Hand */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* Dialogue/Combat Log */}
            <div className="flex-1 overflow-y-auto bg-paper-50 border-2 border-ink-400/20 p-4 rounded-lg shadow-inner font-serif text-base min-h-0">
                 {combat.log.length === 0 ? (
                     <p className="italic text-gray-500 text-center text-lg">The duel begins...</p>
                 ) : (
                     combat.log.map((line, i) => (
                         <div key={i} className={`mb-3 ${line.startsWith('You') ? 'text-right text-blue-900 font-semibold' : 'text-left text-red-900'}`}>
                             {line}
                         </div>
                     ))
                 )}
                 {isThinking && <div className="text-center animate-pulse text-gold-600 font-bold mt-2 italic text-base">Thinking...</div>}
            </div>

            {/* Player Hand */}
            <div className="shrink-0">
                {/* Player HP Bar */}
                <div className="mb-4 flex items-center justify-center gap-3">
                    <span className="text-base font-display font-bold text-ink-900">Henry James</span>
                    <div className="w-64 h-4 bg-gray-300 rounded-full overflow-hidden border border-gray-400 shadow-inner">
                        <div className="h-full bg-blue-600 transition-all duration-500 ease-out" style={{ width: `${combat.playerHp}%` }}></div>
                    </div>
                    <span className="text-sm font-mono text-ink-600 font-bold w-12">{Math.round(combat.playerHp)}%</span>
                </div>

                <div className="flex justify-between mb-3 text-sm font-mono uppercase tracking-widest text-ink-600">
                    <span>Deck: {combat.deck.length}</span>
                    <span>Discard: {combat.discard.length}</span>
                </div>

                <div className="flex justify-center gap-4 items-end h-40 perspective-1000">
                    {combat.hand.map((card, idx) => (
                        <button
                            key={`${card.id}-${idx}`}
                            onClick={() => handleCardPlay(card)}
                            disabled={isThinking || combat.turn === 'OPPONENT'}
                            className={`
                                relative w-28 h-36 rounded-lg border-2 shadow-lg p-3 flex flex-col items-center text-center transition-all duration-200 transform hover:-translate-y-6 hover:rotate-0 hover:scale-110 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
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
    </div>
  );
};

export default CombatView;
