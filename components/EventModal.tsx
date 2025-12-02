import React, { useState, useEffect, useCallback } from 'react';
import { GameEvent, EventChoice, EventOutcome, StatType, DiscoveredPhrase } from '../types';
import { useGame } from '../context/GameContext';
import { getUndiscoveredPhrase } from '../data/jamesianPhrases';
import { LucideX, LucideBookOpen, LucideStar, LucideHeart, LucideSparkles, LucideBrain, LucideAlertTriangle } from 'lucide-react';
import InspirationModal from './InspirationModal';

interface EventModalProps {
  event: GameEvent;
  onClose: () => void;
}

type ModalPhase = 'initial' | 'outcome' | 'inspiration';

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const { state, dispatch } = useGame();
  const [phase, setPhase] = useState<ModalPhase>('initial');
  const [selectedChoice, setSelectedChoice] = useState<EventChoice | null>(null);
  const [outcome, setOutcome] = useState<EventOutcome | null>(null);
  const [showHistoricalNote, setShowHistoricalNote] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [discoveredPhrase, setDiscoveredPhrase] = useState<DiscoveredPhrase | null>(null);
  const [shouldShowInspiration, setShouldShowInspiration] = useState(false);

  // Handle dismissing event (X button or ESC) - mark as dismissed so it won't reappear
  const handleDismiss = useCallback(() => {
    // Only dismiss if in initial phase (user hasn't made a choice yet)
    if (phase === 'initial') {
      dispatch({ type: 'DISMISS_EVENT', payload: { eventId: event.id } });
    }
    onClose();
  }, [phase, dispatch, event.id, onClose]);

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDismiss]);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Reset animation when phase changes
  useEffect(() => {
    if (phase !== 'initial') {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 250);
      return () => clearTimeout(timer);
    }
  }, [phase]);

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

    // Check if this outcome grants inspiration - if so, maybe discover a phrase
    const inspirationChange = selectedOutcome.statChanges?.find(c => c.stat === StatType.INSPIRATION && c.change > 0);
    if (inspirationChange) {
      // 50% chance to discover a phrase when gaining inspiration
      if (Math.random() < 0.5) {
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
          setShouldShowInspiration(true);
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

    // Transition to outcome phase
    setPhase('outcome');
  }, [dispatch, event, meetsRequirements, selectOutcome, state.zones, state.player.currentZoneId, state.eventState.discoveredPhrases]);

  // Handle continuing from outcome phase
  const handleOutcomeContinue = useCallback(() => {
    if (shouldShowInspiration && discoveredPhrase) {
      setPhase('inspiration');
    } else {
      onClose();
    }
  }, [shouldShowInspiration, discoveredPhrase, onClose]);

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

  // Show inspiration modal if in that phase
  if (phase === 'inspiration' && discoveredPhrase) {
    return (
      <InspirationModal
        phrase={discoveredPhrase}
        onClose={onClose}
      />
    );
  }

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
            {phase === 'outcome' ? 'The Consequence' : event.title}
          </h2>
          <button
            onClick={handleDismiss}
            className="text-ink-900 hover:text-ink-700 transition-colors"
            title="Dismiss (ESC)"
          >
            <LucideX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* INITIAL PHASE - Show event and choices */}
          {phase === 'initial' && (
            <>
              {/* Description */}
              <div className="prose prose-lg dark:prose-invert">
                <p className="text-ink-800 dark:text-paper-200 leading-relaxed font-serif italic text-lg">
                  {event.description}
                </p>
              </div>

              {/* Choices */}
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
            </>
          )}

          {/* OUTCOME PHASE - Show what happened */}
          {phase === 'outcome' && outcome && (
            <>
              {/* Brief reminder of the choice */}
              <div className="text-xs text-ink-500 dark:text-paper-400 uppercase tracking-wider font-mono mb-2">
                You chose: <span className="italic normal-case text-ink-600 dark:text-paper-300">{selectedChoice?.text}</span>
              </div>

              {/* Outcome text - the main focus */}
              <div className="prose prose-lg dark:prose-invert">
                <p className="text-ink-800 dark:text-paper-200 leading-relaxed font-serif text-lg">
                  {outcome.description}
                </p>
              </div>

              {/* Stat changes */}
              {outcome.statChanges && outcome.statChanges.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
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
                onClick={handleOutcomeContinue}
                className="w-full py-3 bg-gold-600 hover:bg-gold-500 text-ink-900 font-display font-bold rounded transition-colors text-lg tracking-wide"
              >
                Continue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
