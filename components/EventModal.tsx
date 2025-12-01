import React, { useState, useEffect, useCallback } from 'react';
import { GameEvent, EventChoice, EventOutcome, StatType, DiscoveredPhrase } from '../types';
import { useGame } from '../context/GameContext';
import { getUndiscoveredPhrase } from '../data/jamesianPhrases';
import { LucideX, LucideBookOpen, LucideStar, LucideHeart, LucideSparkles, LucideBrain, LucideAlertTriangle, LucideFeather } from 'lucide-react';

interface EventModalProps {
  event: GameEvent;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const { state, dispatch } = useGame();
  const [selectedChoice, setSelectedChoice] = useState<EventChoice | null>(null);
  const [outcome, setOutcome] = useState<EventOutcome | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [showHistoricalNote, setShowHistoricalNote] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [discoveredPhrase, setDiscoveredPhrase] = useState<DiscoveredPhrase | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Check if player meets stat requirements for a choice
  const meetsRequirements = useCallback((choice: EventChoice): boolean => {
    if (!choice.requiredStat) return true;
    const { stat, minValue } = choice.requiredStat;
    const playerStats = state.player.stats;

    switch (stat) {
      case StatType.WIT:
        return playerStats.wit >= minValue;
      case StatType.DECORUM:
        return playerStats.decorum >= minValue;
      case StatType.OBSERVATION:
        return playerStats.observation >= minValue;
      case StatType.COMPOSURE:
        return playerStats.composure >= minValue;
      default:
        return true;
    }
  }, [state.player.stats]);

  // Select a weighted random outcome
  const selectOutcome = useCallback((outcomes: EventOutcome[]): EventOutcome => {
    if (outcomes.length === 1) return outcomes[0];

    const totalWeight = outcomes.reduce((sum, o) => sum + (o.weight || 1), 0);
    let random = Math.random() * totalWeight;

    for (const outcome of outcomes) {
      random -= outcome.weight || 1;
      if (random <= 0) return outcome;
    }

    return outcomes[0];
  }, []);

  // Handle choice selection
  const handleChoiceSelect = useCallback((choice: EventChoice) => {
    if (!meetsRequirements(choice)) return;

    setSelectedChoice(choice);
    const selectedOutcome = selectOutcome(choice.outcomes);
    setOutcome(selectedOutcome);

    // Check if this outcome grants inspiration - if so, discover a phrase
    const inspirationChange = selectedOutcome.statChanges?.find(c => c.stat === StatType.INSPIRATION && c.change > 0);
    if (inspirationChange) {
      // High chance (80%) to discover a phrase when gaining inspiration from events
      if (Math.random() < 0.8) {
        const discoveredIds = state.eventState.discoveredPhrases.map(p => p.phraseId);
        const newPhrase = getUndiscoveredPhrase(discoveredIds);

        if (newPhrase) {
          const hour = new Date().getHours();
          const timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' =
            hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night';

          const currentZoneForPhrase = state.zones[state.player.currentZoneId];

          const discovered: DiscoveredPhrase = {
            phraseId: newPhrase.id,
            text: newPhrase.text,
            theme: newPhrase.theme,
            references: newPhrase.references,
            discoveredAt: {
              zoneName: currentZoneForPhrase?.name || 'Unknown',
              timestamp: Date.now(),
              timeOfDay
            }
          };

          setDiscoveredPhrase(discovered);
          dispatch({ type: 'DISCOVER_PHRASE', payload: discovered });
        }
      }
    }

    // Apply stat changes
    if (selectedOutcome.statChanges) {
      for (const change of selectedOutcome.statChanges) {
        switch (change.stat) {
          case StatType.REPUTATION:
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', amount: change.change } });
            break;
          case StatType.INSPIRATION:
            dispatch({ type: 'GAIN_INSPIRATION', payload: { amount: change.change, source: event.title } });
            break;
          case StatType.COMPOSURE:
            dispatch({ type: 'ADJUST_COMPOSURE', payload: change.change });
            break;
          case StatType.HEALTH:
            dispatch({ type: 'ADJUST_HEALTH', payload: change.change });
            break;
          case StatType.MALAISE:
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'malaise', amount: change.change } });
            break;
          case StatType.WIT:
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'wit', amount: change.change } });
            break;
          case StatType.DECORUM:
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'decorum', amount: change.change } });
            break;
          case StatType.OBSERVATION:
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'observation', amount: change.change } });
            break;
        }
      }
    }

    // Add to narration history if specified
    if (selectedOutcome.addNarration) {
      dispatch({ type: 'ADD_NARRATION', payload: selectedOutcome.addNarration });
    }

    // Record event in history with zone name
    const currentZone = state.zones[state.player.currentZoneId];
    dispatch({
      type: 'RECORD_EVENT',
      payload: {
        eventId: event.id,
        choiceId: choice.id,
        outcomeDescription: selectedOutcome.description,
        zoneName: currentZone?.name || 'Unknown'
      }
    });

    // Show outcome after a brief delay
    setTimeout(() => setShowOutcome(true), 100);
  }, [dispatch, event, meetsRequirements, selectOutcome, state.zones, state.player.currentZoneId, state.eventState.discoveredPhrases]);

  // Get stat name for display
  const getStatName = (stat: StatType): string => {
    switch (stat) {
      case StatType.WIT: return 'Wit';
      case StatType.DECORUM: return 'Decorum';
      case StatType.OBSERVATION: return 'Observation';
      case StatType.COMPOSURE: return 'Composure';
      default: return stat;
    }
  };

  // Get stat icon
  const getStatIcon = (stat: StatType) => {
    switch (stat) {
      case StatType.REPUTATION:
        return <LucideStar size={12} className="text-gold-400" />;
      case StatType.INSPIRATION:
        return <LucideSparkles size={12} className="text-purple-400" />;
      case StatType.HEALTH:
        return <LucideHeart size={12} className="text-red-400" />;
      case StatType.COMPOSURE:
        return <LucideBrain size={12} className="text-blue-400" />;
      case StatType.MALAISE:
        return <LucideAlertTriangle size={12} className="text-orange-400" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-ink-900/90 flex items-center justify-center z-50 p-4
        ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
    >
      <div className={`bg-paper-100 dark:bg-ink-800 border-2 border-gold-600 rounded-lg shadow-2xl
        max-w-lg w-full max-h-[85vh] overflow-y-auto
        ${isAnimating ? 'scale-95' : 'scale-100'} transition-transform duration-300`}
      >
        {/* Header */}
        <div className="bg-gold-600 px-4 py-3 flex items-center justify-between">
          <h2 className="font-display text-ink-900 text-lg font-bold">
            {event.title}
          </h2>
          <button
            onClick={onClose}
            className="text-ink-900 hover:text-ink-700 transition-colors"
          >
            <LucideX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Description */}
          <div className="prose prose-lg dark:prose-invert">
            <p className="text-ink-800 dark:text-paper-200 leading-relaxed font-serif italic text-lg">
              {event.description}
            </p>
          </div>

          {/* Choices or Outcome */}
          {!showOutcome ? (
            <div className="space-y-2 pt-2">
              <p className="text-xs uppercase tracking-wider text-paper-600 dark:text-paper-400 font-mono">
                What do you do?
              </p>
              {event.choices.map((choice) => {
                const canSelect = meetsRequirements(choice);
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceSelect(choice)}
                    disabled={!canSelect}
                    className={`w-full text-left p-3 rounded border transition-all
                      ${canSelect
                        ? 'bg-paper-200 dark:bg-ink-700 border-gold-500 hover:border-gold-400 hover:bg-paper-300 dark:hover:bg-ink-600 cursor-pointer'
                        : 'bg-paper-300 dark:bg-ink-900 border-paper-400 dark:border-ink-700 cursor-not-allowed opacity-60'
                      }`}
                  >
                    <span className={`text-sm ${canSelect ? 'text-ink-800 dark:text-paper-200' : 'text-paper-500'}`}>
                      {choice.text}
                    </span>
                    {choice.requiredStat && (
                      <div className={`mt-1 text-xs font-mono ${canSelect ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                        [Requires {getStatName(choice.requiredStat.stat)} {choice.requiredStat.minValue}+]
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {/* Selected choice reminder */}
              <div className="bg-paper-200 dark:bg-ink-700 p-3 rounded border-l-4 border-ink-400 dark:border-ink-500">
                <p className="text-[10px] text-ink-500 dark:text-paper-400 uppercase tracking-wider font-sans font-semibold mb-1">Your choice:</p>
                <p className="text-base text-ink-700 dark:text-paper-300 italic font-serif">{selectedChoice?.text}</p>
              </div>

              {/* Outcome text */}
              <div className="bg-paper-50 dark:bg-ink-900/50 p-4 rounded border-l-4 border-gold-500">
                <p className="text-ink-800 dark:text-paper-200 leading-relaxed text-base font-serif">
                  {outcome?.description}
                </p>
              </div>

              {/* Stat changes */}
              {outcome?.statChanges && outcome.statChanges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {outcome.statChanges.map((change, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-medium border
                        ${change.change > 0
                          ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                          : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        }`}
                    >
                      {getStatIcon(change.stat)}
                      <span>{change.stat}:</span>
                      <span className="font-bold">{change.change > 0 ? '+' : ''}{change.change}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Discovered Phrase - Featured prominently */}
              {discoveredPhrase && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <LucideFeather size={14} className="text-purple-600 dark:text-purple-400" />
                    <span className="text-[10px] uppercase tracking-wider font-sans font-bold text-purple-700 dark:text-purple-400">
                      A phrase crystallizes...
                    </span>
                  </div>
                  <blockquote className="font-serif italic text-base text-purple-900 dark:text-purple-200 leading-relaxed border-l-2 border-purple-400 pl-3">
                    "{discoveredPhrase.text}"
                  </blockquote>
                  {discoveredPhrase.references && discoveredPhrase.references.length > 0 && (
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-sans">
                      Concerning: {discoveredPhrase.references.join(', ')}
                    </p>
                  )}
                  <p className="text-[10px] text-purple-500 dark:text-purple-500 font-sans italic">
                    Added to your Journal
                  </p>
                </div>
              )}

              {/* Historical note toggle */}
              {event.historicalNote && (
                <div className="border-t border-paper-300 dark:border-ink-600 pt-3">
                  <button
                    onClick={() => setShowHistoricalNote(!showHistoricalNote)}
                    className="flex items-center gap-2 text-xs text-ink-500 dark:text-paper-400 hover:text-gold-600 transition-colors font-sans"
                  >
                    <LucideBookOpen size={14} />
                    {showHistoricalNote ? 'Hide' : 'Show'} Historical Context
                  </button>
                  {showHistoricalNote && (
                    <p className="mt-2 text-sm text-ink-600 dark:text-paper-400 italic leading-relaxed font-serif">
                      {event.historicalNote}
                    </p>
                  )}
                </div>
              )}

              {/* Continue button */}
              <button
                onClick={onClose}
                className="w-full py-3 bg-gold-600 hover:bg-gold-500 text-ink-900 font-display font-bold rounded transition-colors text-lg tracking-wide"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
