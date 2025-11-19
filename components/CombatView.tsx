
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { generateCombatMove } from '../services/geminiService';
import { generateCombatLoot } from '../services/itemGenerator';
import { playSound } from '../services/audioService';
import { CombatCard } from '../types';
import { LucideSword, LucideShield, LucideEye } from 'lucide-react';

const CombatView: React.FC = () => {
  const { state, dispatch } = useGame();
  const { combat } = state;
  const [isThinking, setIsThinking] = useState(false);
  const [flyingText, setFlyingText] = useState<{text: string, start: boolean} | null>(null);
  const [opponentCard, setOpponentCard] = useState<{text: string, damage: number} | null>(null);

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
    dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'COMBAT', text: `James uses "${card.name}": ${card.description} (-${card.damage} to opponent)`, timestamp: Date.now() } });

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

      dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'COMBAT', text: `${combat.opponent.name}: "${responseText}" (-${responseDamage} Composure)`, timestamp: Date.now(), speaker: combat.opponent.name } });

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
    <div className="flex flex-col h-full w-full p-2 relative overflow-hidden">
        
        {flyingText && (
            <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 text-2xl font-display font-bold text-ink-900 animate-[ping_1s_ease-out_forwards] z-50 opacity-0 pointer-events-none">
                {flyingText.text}
            </div>
        )}

        {/* Opponent Area */}
        <div className="flex flex-col justify-center items-center mb-2 relative min-h-[140px] shrink-0">
            {/* Opponent's Played Card */}
            {opponentCard && (
                <div className="mb-4 animate-fade-in">
                    <div className="w-64 bg-red-50 border-2 border-red-800 rounded shadow-2xl p-3 text-center">
                        <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-red-600">RETORT</div>
                        <div className="font-serif italic text-sm leading-snug mb-2 text-ink-900 min-h-[60px] flex items-center justify-center">
                            "{opponentCard.text}"
                        </div>
                        <div className="text-xs font-mono font-bold bg-red-800 text-white px-2 py-1 rounded inline-block">
                            DMG: {opponentCard.damage}
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center animate-fade-in">
                <div className="w-20 h-20 border-4 border-double border-gold-500 rounded-full flex items-center justify-center bg-ink-900 text-paper-50 text-3xl font-display shadow-xl mb-2 mx-auto transition-transform hover:scale-105">
                    {combat.opponent.avatarChar}
                </div>
                <h2 className="text-xl font-display font-bold text-ink-900">{combat.opponent.name}</h2>
                <div className="text-xs font-mono text-ink-500 mb-1">{combat.opponent.profession}</div>
                <div className="flex items-center justify-center gap-2">
                    <div className="w-48 h-3 bg-gray-300 rounded-full overflow-hidden border border-gray-400 shadow-inner">
                        <div className="h-full bg-red-800 transition-all duration-500 ease-out" style={{ width: `${combat.opponentHp}%` }}></div>
                    </div>
                    <span className="text-xs font-mono text-ink-600">{Math.round(combat.opponentHp)}%</span>
                </div>
            </div>
        </div>

        {/* Dialogue/Combat Log - Takes available space */}
        <div className="flex-1 overflow-y-auto mb-4 bg-paper-50 border border-ink-400/20 p-4 rounded shadow-inner font-serif text-sm min-h-0">
             {combat.log.length === 0 ? (
                 <p className="italic text-gray-500 text-center">The duel begins...</p>
             ) : (
                 combat.log.map((line, i) => (
                     <div key={i} className={`mb-2 ${line.startsWith('You') ? 'text-right text-blue-900' : 'text-left text-red-900 animate-shake'}`}>
                         {line}
                     </div>
                 ))
             )}
             {isThinking && <div className="text-center animate-pulse text-gold-600 font-bold mt-1 italic">Thinking...</div>}
        </div>

        {/* Player Hand - Fixed Height & Shrink Prevention */}
        <div className="z-10 shrink-0">
            {/* Player HP Bar */}
            <div className="mb-3 flex items-center justify-center gap-3">
                <span className="text-sm font-display font-bold text-ink-900">Henry James</span>
                <div className="w-48 h-3 bg-gray-300 rounded-full overflow-hidden border border-gray-400 shadow-inner">
                    <div className="h-full bg-blue-600 transition-all duration-500 ease-out" style={{ width: `${combat.playerHp}%` }}></div>
                </div>
                <span className="text-xs font-mono text-ink-600">{Math.round(combat.playerHp)}%</span>
            </div>

            <div className="flex justify-between mb-2 text-xs font-mono uppercase tracking-widest">
                <span>Deck: {combat.deck.length}</span>
                <span>Discard: {combat.discard.length}</span>
            </div>
            
            <div className="flex justify-center gap-3 items-end h-36 perspective-1000">
                {combat.hand.map((card, idx) => (
                    <button
                        key={`${card.id}-${idx}`}
                        onClick={() => handleCardPlay(card)}
                        disabled={isThinking || combat.turn === 'OPPONENT'}
                        className={`
                            relative w-24 h-32 rounded border-2 shadow-lg p-2 flex flex-col items-center text-center transition-all duration-200 transform hover:-translate-y-6 hover:rotate-0 hover:scale-110 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                            ${getCardColor(card.type)}
                            ${idx === 0 ? '-rotate-3' : idx === 1 ? 'rotate-0' : 'rotate-3'}
                        `}
                    >
                        <div className="text-[9px] font-bold uppercase tracking-wider mb-1 opacity-60">{card.type}</div>
                        <div className="flex-1 flex items-center justify-center mb-1">
                            {card.type === 'INSULT' && <LucideSword size={24} className="text-red-700" />}
                            {card.type === 'DEFENSE' && <LucideShield size={24} className="text-gold-700" />}
                            {card.type === 'OBSERVATION' && <LucideEye size={24} className="text-blue-700" />}
                        </div>
                        <div className="font-display font-bold text-[11px] leading-tight mb-1">{card.name}</div>
                        <div className="text-[10px] font-mono font-bold bg-black/10 px-1.5 py-0.5 rounded">
                            DMG: {card.damage}
                        </div>
                    </button>
                ))}
            </div>
            
            <div className="text-center mt-3">
                <button onClick={() => dispatch({ type: 'END_COMBAT' })} className="text-xs underline text-gray-500 hover:text-red-500">
                    Flee
                </button>
            </div>
        </div>
    </div>
  );
};

export default CombatView;
