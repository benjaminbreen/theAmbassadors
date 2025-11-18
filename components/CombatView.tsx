
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { generateCombatMove } from '../services/geminiService';
import { playSound } from '../services/audioService';
import { CombatCard } from '../types';
import { LucideSword, LucideShield, LucideEye } from 'lucide-react';

const CombatView: React.FC = () => {
  const { state, dispatch } = useGame();
  const { combat } = state;
  const [isThinking, setIsThinking] = useState(false);
  const [flyingText, setFlyingText] = useState<{text: string, start: boolean} | null>(null);

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
    setFlyingText({ text: card.name, start: true });
    dispatch({ type: 'PLAYER_PLAY_CARD', payload: card });
    dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'COMBAT', text: `James uses "${card.name}": ${card.description}`, timestamp: Date.now() } });

    setIsThinking(true);

    const response = await generateCombatMove(combat.opponent, card, combat.log);
    
    if (!state.audio.muted) playSound('DAMAGE');
    dispatch({ type: 'TRIGGER_SHAKE' });

    const newHp = Math.max(0, combat.playerHp - response.damage);
    
    dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'COMBAT', text: `${combat.opponent.name}: ${response.text} (-${response.damage} Composure)`, timestamp: Date.now(), speaker: combat.opponent.name } });
    
    dispatch({ type: 'UPDATE_COMBAT', payload: {
        playerHp: newHp,
        log: [...combat.log, `You used ${card.name}`, `${combat.opponent.name}: ${response.text}`]
    }});

    if (newHp <= 0) {
         dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'SYSTEM', text: "You have lost your composure. You retreat in shame.", timestamp: Date.now() } });
         dispatch({ type: 'END_COMBAT' });
    } else {
        dispatch({ type: 'COMBAT_TURN_END' });
    }
    
    setIsThinking(false);
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
        <div className="flex justify-center items-center mb-2 relative min-h-[140px] shrink-0">
            <div className="text-center animate-fade-in">
                <div className="w-20 h-20 border-4 border-double border-gold-500 rounded-full flex items-center justify-center bg-ink-900 text-paper-50 text-3xl font-display shadow-xl mb-2 mx-auto transition-transform hover:scale-105">
                    {combat.opponent.avatarChar}
                </div>
                <h2 className="text-xl font-display font-bold text-ink-900">{combat.opponent.name}</h2>
                <div className="w-40 h-2 bg-gray-300 rounded-full mt-2 mx-auto overflow-hidden border border-gray-400 shadow-inner">
                    <div className="h-full bg-red-800 transition-all duration-500 ease-out" style={{ width: `${combat.opponentHp}%` }}></div>
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
                            relative w-24 h-32 rounded border shadow-lg p-2 flex flex-col items-center text-center transition-all duration-200 transform hover:-translate-y-4 hover:rotate-0 cursor-pointer disabled:opacity-50
                            ${getCardColor(card.type)}
                            ${idx === 0 ? '-rotate-3' : idx === 1 ? 'rotate-0' : 'rotate-3'}
                        `}
                    >
                        <div className="text-[9px] font-bold uppercase tracking-wider mb-2 opacity-60">{card.type}</div>
                        <div className="flex-1 flex items-center justify-center">
                            {card.type === 'INSULT' && <LucideSword size={20} />}
                            {card.type === 'DEFENSE' && <LucideShield size={20} />}
                            {card.type === 'OBSERVATION' && <LucideEye size={20} />}
                        </div>
                        <div className="font-display font-bold text-xs leading-tight mb-1">{card.name}</div>
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
