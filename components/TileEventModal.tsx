import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { TileEvent, TileEventChoice, TileEventOutcome } from '../data/tileInteractions';
import { LucideSparkles, LucideStar, LucideHeart, LucideBrain, LucideAlertTriangle } from 'lucide-react';
import ModalBase from './ModalBase';

interface TileEventModalProps {
  event: TileEvent;
  onClose: () => void;
}

type ModalPhase = 'initial' | 'outcome';

const TileEventModal: React.FC<TileEventModalProps> = ({ event, onClose }) => {
  const { dispatch } = useGame();
  const [phase, setPhase] = useState<ModalPhase>('initial');
  const [selectedOutcome, setSelectedOutcome] = useState<TileEventOutcome | null>(null);

  // Handle choice selection
  const handleChoiceSelect = useCallback((choice: TileEventChoice) => {
    const outcome = choice.outcome;
    setSelectedOutcome(outcome);

    // Apply stat changes
    if (outcome.reputationChange) {
      dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', amount: outcome.reputationChange } });
    }
    if (outcome.composureChange) {
      dispatch({ type: 'ADJUST_COMPOSURE', payload: outcome.composureChange });
    }
    if (outcome.inspirationChange) {
      dispatch({ type: 'GAIN_INSPIRATION', payload: { amount: outcome.inspirationChange, source: event.title } });
    }
    if (outcome.healthChange) {
      dispatch({ type: 'ADJUST_HEALTH', payload: outcome.healthChange });
    }
    if (outcome.malaiseChange) {
      dispatch({ type: 'ADJUST_STAT', payload: { stat: 'malaise', amount: outcome.malaiseChange } });
    }

    // Transition to outcome phase
    setPhase('outcome');
  }, [dispatch, event.title]);

  // Render stat change indicator
  const renderStatChange = (value: number | undefined, icon: React.ReactNode, label: string) => {
    if (!value) return null;
    const isPositive = value > 0;
    return (
      <div className={`flex items-center gap-1 text-xs font-mono ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
        {icon}
        <span>{isPositive ? '+' : ''}{value} {label}</span>
      </div>
    );
  };

  return (
    <ModalBase
      variant="gold"
      title={phase === 'outcome' ? 'The Outcome' : event.title}
      onClose={onClose}
      closeOnEscape={true}
      closeOnBackdrop={false}
      maxWidth="lg"
      animationDuration={300}
    >
      <div className="space-y-4">
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
              {event.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoiceSelect(choice)}
                  className="w-full text-left p-3 rounded border transition-all
                    bg-paper-200 dark:bg-ink-700 border-gold-500 hover:border-gold-400
                    hover:bg-paper-300 dark:hover:bg-ink-600 cursor-pointer"
                >
                  <span className="text-sm text-ink-800 dark:text-paper-200">
                    {choice.text}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* OUTCOME PHASE - Show result */}
        {phase === 'outcome' && selectedOutcome && (
          <>
            {/* Outcome Description */}
            <div className="prose prose-lg dark:prose-invert">
              <p className="text-ink-800 dark:text-paper-200 leading-relaxed font-serif text-base">
                {selectedOutcome.description}
              </p>
            </div>

            {/* Stat Changes */}
            <div className="bg-paper-200 dark:bg-ink-700 rounded p-3 space-y-1">
              {renderStatChange(selectedOutcome.reputationChange, <LucideStar size={12} className="text-gold-400" />, 'Reputation')}
              {renderStatChange(selectedOutcome.inspirationChange, <LucideSparkles size={12} className="text-purple-400" />, 'Inspiration')}
              {renderStatChange(selectedOutcome.composureChange, <LucideBrain size={12} className="text-blue-400" />, 'Composure')}
              {renderStatChange(selectedOutcome.healthChange, <LucideHeart size={12} className="text-red-400" />, 'Health')}
              {selectedOutcome.malaiseChange && renderStatChange(
                selectedOutcome.malaiseChange,
                <LucideAlertTriangle size={12} className="text-orange-400" />,
                'Malaise'
              )}
            </div>

            {/* Continue Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gold-600 hover:bg-gold-500 text-ink-900
                  font-display font-medium rounded transition-colors"
              >
                Continue
              </button>
            </div>
          </>
        )}
      </div>
    </ModalBase>
  );
};

export default TileEventModal;
