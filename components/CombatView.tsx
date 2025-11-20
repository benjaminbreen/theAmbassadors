
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { generateCombatMove } from '../services/geminiService';
import { generateCombatLoot } from '../services/itemGenerator';
import { playSound } from '../services/audioService';
import { CombatCard } from '../types';
import { LucideSword, LucideShield, LucideEye, LucideX, LucideSend } from 'lucide-react';

const CombatView: React.FC = () => {
  const { state, dispatch } = useGame();
  const { combat } = state;
  const [isThinking, setIsThinking] = useState(false);
  const [flyingText, setFlyingText] = useState<{text: string, start: boolean} | null>(null);
  const [opponentCard, setOpponentCard] = useState<{text: string, damage: number} | null>(null);
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

  const MAX_TURNS = 6; // Combat resolves after 6 rounds

  useEffect(() => {
      if (flyingText) {
          const timer = setTimeout(() => setFlyingText(null), 1000);
          return () => clearTimeout(timer);
      }
  }, [flyingText]);

  if (!combat || !combat.opponent) return null;

  const handleCardClick = (card: CombatCard) => {
    if (isThinking || combat.turn === 'OPPONENT') return;

    setSelectedCard(card);
    setShowInputModal(true);
    setPlayerInput('');
  };

  const handleSubmitInput = async () => {
    if (!selectedCard || !playerInput.trim()) return;

    const card = selectedCard;
    const customText = playerInput.trim();

    setShowInputModal(false);

    if (!state.audio.muted) playSound('ATTACK');
    setFlyingText({ text: `${card.name} (-${card.damage})`, start: true });
    setOpponentCard(null);
    dispatch({ type: 'PLAYER_PLAY_CARD', payload: card });

    // Log with player's custom text
    dispatch({ type: 'ADD_LOG', payload: {
        id: Date.now().toString(),
        type: 'COMBAT',
        text: `You: "${customText}" (-${card.damage} damage)`,
        timestamp: Date.now()
    }});

    setTotalDamageDealt(prev => prev + card.damage);
    setIsThinking(true);

    try {
      // Pass player's custom text to AI for more contextual response
      const response = await generateCombatMove(combat.opponent, card, [...combat.log, customText]);

      const damageToOpponent = card.damage || 0;
      const newOpponentHp = Math.max(0, combat.opponentHp - damageToOpponent);
      const newPlayerHp = Math.max(0, combat.playerHp - (response.damage || 0));

      if (!state.audio.muted) playSound('DAMAGE');
      dispatch({ type: 'TRIGGER_SHAKE' });

      const responseText = response.text || "They scoff at you.";
      const responseDamage = response.damage || 5;

      setOpponentCard({ text: responseText, damage: responseDamage });

      dispatch({ type: 'ADD_LOG', payload: {
          id: Date.now().toString(),
          type: 'COMBAT',
          text: `${combat.opponent.name}: "${responseText}" (-${responseDamage} Composure)`,
          timestamp: Date.now(),
          speaker: combat.opponent.name
      }});

      setTotalDamageReceived(prev => prev + responseDamage);

      dispatch({ type: 'UPDATE_COMBAT', payload: {
          playerHp: newPlayerHp,
          opponentHp: newOpponentHp,
          log: [...combat.log, `You: ${customText} (-${damageToOpponent})`, `${combat.opponent.name}: ${responseText} (-${responseDamage})`]
      }});

      // Check for resolution conditions
      if (newPlayerHp <= 0) {
           await generateResolution('defeat');
      } else if (newOpponentHp <= 0) {
           await generateResolution('victory');
      } else if (roundCount >= MAX_TURNS) {
           // Max turns reached - generate resolution based on HP comparison
           if (newPlayerHp > newOpponentHp) {
               await generateResolution('victory');
           } else if (newOpponentHp > newPlayerHp) {
               await generateResolution('defeat');
           } else {
               await generateResolution('draw');
           }
      } else {
          setRoundCount(prev => prev + 1);
          dispatch({ type: 'COMBAT_TURN_END' });
      }

      setIsThinking(false);
    } catch (error) {
      console.error('Combat error:', error);
      dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'SYSTEM', text: 'The conversation falters...', timestamp: Date.now() } });
      setIsThinking(false);
    }

    setSelectedCard(null);
  };

  const generateResolution = async (outcome: 'victory' | 'defeat' | 'draw') => {
    setIsThinking(true);

    let summaryPrompt = '';

    if (outcome === 'victory') {
        if (!state.audio.muted) playSound('SUCCESS');
        summaryPrompt = `Write a brief, elegant 2-3 sentence summary of how Henry James successfully navigated this social encounter with ${combat.opponent.name}, a ${combat.opponent.profession}. Based on the conversation: ${combat.log.join(' ')}. The tone should be literary and reflect James's psychological acuity.`;
    } else if (outcome === 'defeat') {
        summaryPrompt = `Write a brief, elegant 2-3 sentence summary of how Henry James lost composure in this social encounter with ${combat.opponent.name}, a ${combat.opponent.profession}. Based on: ${combat.log.join(' ')}. The tone should reflect James's embarrassment but maintain literary dignity.`;
    } else {
        summaryPrompt = `Write a brief, elegant 2-3 sentence summary of this inconclusive social encounter between Henry James and ${combat.opponent.name}, a ${combat.opponent.profession}. Based on: ${combat.log.join(' ')}. The tone should be wryly ambiguous.`;
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: summaryPrompt,
                temperature: 0.8
            })
        });

        const data = await response.json();
        const summary = data.text || "The conversation ends, leaving both parties to ponder what was said.";

        setResolutionText(summary);
        setShowResolution(true);

        // Award loot on victory
        if (outcome === 'victory') {
            generateCombatLoot(combat.opponent.name, combat.opponent.profession).then(item => {
                if (item) {
                    dispatch({ type: 'ADD_ITEM', payload: item });
                    dispatch({ type: 'ADD_LOG', payload: {
                        id: Date.now().toString(),
                        type: 'SYSTEM',
                        text: `${combat.opponent.name} offers you: ${item.name}`,
                        timestamp: Date.now()
                    }});
                }
            });
        }

    } catch (error) {
        console.error('Resolution generation error:', error);
        setResolutionText("The conversation concludes, and you part ways.");
        setShowResolution(true);
    }

    setIsThinking(false);
  };

  const handleEndCombat = () => {
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
          case 'INSULT': return 'Write your snide remark or cutting observation:';
          case 'DEFENSE': return 'Write your defensive or deflecting response:';
          case 'OBSERVATION': return 'Write your keen observation or insight:';
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

                  <p className="text-sm text-ink-600 mb-4">
                      {getCardPrompt(selectedCard.type)}
                  </p>

                  <textarea
                      value={playerInput}
                      onChange={(e) => setPlayerInput(e.target.value)}
                      placeholder={`e.g., "One might forgive a commoner for misidentifying a thoroughbred..."`}
                      className="w-full h-32 p-3 border-2 border-ink-300 rounded font-serif text-base resize-none focus:outline-none focus:border-gold-600"
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
                          Submit ({selectedCard.damage} DMG)
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="flex h-full w-full p-4 gap-4 relative overflow-hidden">

        {flyingText && (
            <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 text-3xl font-display font-bold text-ink-900 animate-[ping_1s_ease-out_forwards] z-50 opacity-0 pointer-events-none">
                {flyingText.text}
            </div>
        )}

        {/* LEFT COLUMN: NPC Portrait Only */}
        <div className="w-80 flex flex-col gap-4 shrink-0">
            {/* NPC Portrait - Facing LEFT */}
            <div className="bg-paper-100 border-2 border-gold-600 rounded-lg p-4 shadow-xl">
                <div className="flex items-center gap-4 mb-3">
                    {/* Avatar on LEFT, facing LEFT (using scale transform) */}
                    <div className="w-24 h-24 border-4 border-double border-gold-500 rounded-full flex items-center justify-center bg-ink-900 text-paper-50 text-4xl font-display shadow-xl shrink-0 transform scale-x-[-1]">
                        {combat.opponent.avatarChar}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-display font-bold text-ink-900 mb-1">{combat.opponent.name}</h2>
                        <div className="text-sm font-mono text-ink-600 mb-1">{combat.opponent.profession}</div>
                    </div>
                </div>

                {/* NPC Stats */}
                <div className="bg-gold-50 border border-gold-300 rounded p-3 mb-3">
                    <div className="text-xs text-ink-500 italic mb-2">{combat.opponent.historicalNote}</div>
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

            {/* Opponent's Played Card */}
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
        </div>

        {/* CENTER COLUMN: Combat Log */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="flex-1 overflow-y-auto bg-paper-50 border-2 border-ink-400/20 p-4 rounded-lg shadow-inner font-serif text-base min-h-0">
                 {combat.log.length === 0 ? (
                     <p className="italic text-gray-500 text-center text-lg">The conversation begins...</p>
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

                <div className="flex justify-center gap-4 items-end h-40 perspective-1000">
                    {combat.hand.map((card, idx) => (
                        <button
                            key={`${card.id}-${idx}`}
                            onClick={() => handleCardClick(card)}
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

        {/* RIGHT COLUMN: Battle Guide & Controls */}
        <div className="w-80 flex flex-col gap-4 shrink-0">
            <div className="bg-ink-900 border-2 border-gold-600 rounded-lg p-4 shadow-xl text-paper-100 flex-1">
                <h3 className="font-display text-base font-bold text-gold-500 mb-3 uppercase tracking-wide">Conversation Guide</h3>

                <div className="space-y-3 text-sm">
                    <div>
                        <div className="text-xs uppercase text-gold-600 font-bold mb-1">How to Play:</div>
                        <div className="text-xs leading-relaxed text-paper-200">
                            Click a card, then write your own remark! Your custom dialogue shapes the conversation.
                            Each exchange deals damage based on wit and rhetoric. First to 0% Composure loses!
                        </div>
                    </div>

                    <div className="border-t border-gold-600/30 pt-3">
                        <div className="text-xs uppercase text-gold-600 font-bold mb-2">Battle Statistics:</div>
                        <div className="space-y-1 text-xs font-mono">
                            <div className="flex justify-between">
                                <span className="text-paper-300">Round:</span>
                                <span className="text-white font-bold">{roundCount} / {MAX_TURNS}</span>
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
                            Reduce opponent's Composure to 0% before yours runs out, or have higher Composure after {MAX_TURNS} rounds.
                        </div>
                    </div>

                    <div className="border-t border-gold-600/30 pt-3">
                        <div className="text-xs uppercase text-gold-600 font-bold mb-2">Card Types:</div>
                        <div className="text-xs leading-relaxed text-paper-200 space-y-1">
                            <div><span className="text-red-400">⚔ INSULT:</span> Cutting remarks</div>
                            <div><span className="text-gold-400">🛡 DEFENSE:</span> Deflecting responses</div>
                            <div><span className="text-blue-400">👁 OBSERVATION:</span> Keen insights</div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleEndCombat}
                    className="w-full mt-4 bg-red-900 hover:bg-red-800 text-white font-display font-bold py-2.5 px-4 rounded transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                    <LucideX size={18} />
                    FLEE CONVERSATION
                </button>
            </div>
        </div>
    </div>
  );
};

export default CombatView;
