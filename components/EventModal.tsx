import React, { useState, useEffect, useCallback } from 'react';
import { GameEvent, EventChoice, EventOutcome, StatType, DiscoveredPhrase, EventCategory } from '../types';
import { useGame } from '../context/GameContext';
import { getUndiscoveredPhrase } from '../data/jamesianPhrases';
import { LucideX, LucideBookOpen, LucideStar, LucideHeart, LucideSparkles, LucideBrain, LucideAlertTriangle, LucideMessageCircle, LucideEye, LucideShield, LucideZap } from 'lucide-react';
import InspirationModal from './InspirationModal';

// Category-based color schemes for header
const getCategoryColors = (category?: EventCategory) => {
  switch (category) {
    case 'introspective':
      return {
        gradient: 'from-violet-700 via-violet-600 to-violet-700',
        border: 'border-violet-500/50',
        text: 'text-violet-100',
        icon: 'text-violet-200/50',
        shadow: 'shadow-violet-600/20'
      };
    case 'social':
      return {
        gradient: 'from-gold-700 via-gold-600 to-gold-700',
        border: 'border-gold-500/50',
        text: 'text-ink-900',
        icon: 'text-gold-900/30',
        shadow: 'shadow-gold-600/20'
      };
    case 'physical':
      return {
        gradient: 'from-rose-700 via-rose-600 to-rose-700',
        border: 'border-rose-500/50',
        text: 'text-rose-100',
        icon: 'text-rose-200/50',
        shadow: 'shadow-rose-600/20'
      };
    case 'intellectual':
      return {
        gradient: 'from-teal-700 via-teal-600 to-teal-700',
        border: 'border-teal-500/50',
        text: 'text-teal-100',
        icon: 'text-teal-200/50',
        shadow: 'shadow-teal-600/20'
      };
    case 'aesthetic':
      return {
        gradient: 'from-sage-700 via-sage-600 to-sage-700',
        border: 'border-sage-500/50',
        text: 'text-sage-100',
        icon: 'text-sage-200/50',
        shadow: 'shadow-sage-600/20'
      };
    case 'mysterious':
      return {
        gradient: 'from-violet-800 via-purple-700 to-violet-800',
        border: 'border-purple-500/50',
        text: 'text-purple-100',
        icon: 'text-purple-200/50',
        shadow: 'shadow-purple-600/20'
      };
    default:
      // Default gold for unspecified
      return {
        gradient: 'from-gold-700 via-gold-600 to-gold-700',
        border: 'border-gold-500/50',
        text: 'text-ink-900',
        icon: 'text-gold-900/30',
        shadow: 'shadow-gold-600/20'
      };
  }
};

// Infer choice "type" based on text patterns and requirements
type ChoiceType = 'bold' | 'cautious' | 'clever' | 'observational';

const inferChoiceType = (choice: EventChoice): ChoiceType => {
  const text = choice.text.toLowerCase();

  // Clever choices often require high stats
  if (choice.requiredStat) {
    return 'clever';
  }

  // Observational choices
  if (text.includes('watch') || text.includes('observe') || text.includes('examine') ||
      text.includes('study') || text.includes('linger') || text.includes('listen')) {
    return 'observational';
  }

  // Bold/direct choices
  if (text.includes('approach') || text.includes('confront') || text.includes('step') ||
      text.includes('push') || text.includes('intervene') || text.includes('take') ||
      text.includes('embrace') || text.includes('lean into') || text.includes('follow')) {
    return 'bold';
  }

  // Cautious choices
  if (text.includes('walk away') || text.includes('let') || text.includes('retreat') ||
      text.includes('step back') || text.includes('simply') || text.includes('wait') ||
      text.includes('deflect') || text.includes('concede') || text.includes('rest')) {
    return 'cautious';
  }

  return 'bold'; // Default
};

// Get button colors based on choice type - light backgrounds with dark text for light mode
const getChoiceColors = (choiceType: ChoiceType, canSelect: boolean) => {
  if (!canSelect) {
    return {
      bg: 'bg-gray-100 dark:bg-ink-900/50',
      border: 'border-gray-300 dark:border-ink-700',
      hoverBg: '',
      hoverBorder: '',
      text: 'text-gray-400 dark:text-paper-600',
      glow: '',
      iconColor: 'text-gray-400'
    };
  }

  switch (choiceType) {
    case 'bold':
      return {
        bg: 'bg-amber-50 dark:bg-amber-900/40',
        border: 'border-amber-300 dark:border-amber-600/50',
        hoverBg: 'hover:bg-amber-100 dark:hover:bg-amber-800/50',
        hoverBorder: 'hover:border-amber-400 dark:hover:border-amber-500',
        text: 'text-amber-900 dark:text-amber-100',
        glow: 'from-amber-200/0 via-amber-200/30 to-amber-200/0 dark:from-amber-600/0 dark:via-amber-600/10 dark:to-amber-600/0',
        iconColor: 'text-amber-600 dark:text-amber-400/70'
      };
    case 'cautious':
      return {
        bg: 'bg-slate-100 dark:bg-slate-800/60',
        border: 'border-slate-300 dark:border-slate-500/40',
        hoverBg: 'hover:bg-slate-200 dark:hover:bg-slate-700/70',
        hoverBorder: 'hover:border-slate-400 dark:hover:border-slate-400',
        text: 'text-slate-800 dark:text-slate-200',
        glow: 'from-slate-200/0 via-slate-200/30 to-slate-200/0 dark:from-slate-500/0 dark:via-slate-500/10 dark:to-slate-500/0',
        iconColor: 'text-slate-500 dark:text-slate-400/70'
      };
    case 'clever':
      return {
        bg: 'bg-teal-50 dark:bg-teal-900/40',
        border: 'border-teal-300 dark:border-teal-500/50',
        hoverBg: 'hover:bg-teal-100 dark:hover:bg-teal-800/50',
        hoverBorder: 'hover:border-teal-400 dark:hover:border-teal-400',
        text: 'text-teal-900 dark:text-teal-100',
        glow: 'from-teal-200/0 via-teal-200/30 to-teal-200/0 dark:from-teal-500/0 dark:via-teal-500/10 dark:to-teal-500/0',
        iconColor: 'text-teal-600 dark:text-teal-400/70'
      };
    case 'observational':
      return {
        bg: 'bg-violet-50 dark:bg-violet-900/40',
        border: 'border-violet-300 dark:border-violet-500/50',
        hoverBg: 'hover:bg-violet-100 dark:hover:bg-violet-800/50',
        hoverBorder: 'hover:border-violet-400 dark:hover:border-violet-400',
        text: 'text-violet-900 dark:text-violet-100',
        glow: 'from-violet-200/0 via-violet-200/30 to-violet-200/0 dark:from-violet-500/0 dark:via-violet-500/10 dark:to-violet-500/0',
        iconColor: 'text-violet-600 dark:text-violet-400/70'
      };
  }
};

// Get icon for choice type - larger size for visibility
const getChoiceIcon = (choiceType: ChoiceType, iconColor: string) => {
  switch (choiceType) {
    case 'bold':
      return <LucideZap size={20} className={iconColor} />;
    case 'cautious':
      return <LucideShield size={20} className={iconColor} />;
    case 'clever':
      return <LucideMessageCircle size={20} className={iconColor} />;
    case 'observational':
      return <LucideEye size={20} className={iconColor} />;
  }
};

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Generate image path from event id if no explicit image provided
  const getImagePath = (): string | null => {
    if (event.image) {
      return `/events/${event.image}`;
    }
    // Auto-generate from id: "the_fatigue_wave" -> "the-fatigue-wave.png"
    // Convert underscores to hyphens for consistency
    const slug = event.id.replace(/_/g, '-');
    return `/events/${slug}.png`;
  };

  const imagePath = getImagePath();

  // Handle dismissing event (X button or ESC) - mark as dismissed so it won't reappear
  const handleDismiss = useCallback(() => {
    // Only dismiss if in initial phase (user hasn't made a choice yet)
    if (phase === 'initial') {
      dispatch({ type: 'DISMISS_EVENT', payload: { eventId: event.id } });
    }
    onClose();
  }, [phase, dispatch, event.id, onClose]);

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
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: change.change } });
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
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'malaise', delta: change.change } });
            break;
          case StatType.WIT:
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'wit', delta: change.change } });
            break;
          case StatType.DECORUM:
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'decorum', delta: change.change } });
            break;
          case StatType.OBSERVATION:
            dispatch({ type: 'ADJUST_STAT', payload: { stat: 'observation', delta: change.change } });
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

  // Keyboard handler for ESC and number keys (1-4 for choices)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
        return;
      }

      // Handle number keys for choice selection (only in initial phase)
      if (phase === 'initial' && !isAnimating) {
        const keyNum = parseInt(e.key);
        if (keyNum >= 1 && keyNum <= event.choices.length) {
          const choice = event.choices[keyNum - 1];
          if (meetsRequirements(choice)) {
            handleChoiceSelect(choice);
          }
        }
      }

      // Handle Enter/Space to continue in outcome phase
      if (phase === 'outcome' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleOutcomeContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDismiss, phase, isAnimating, event.choices, meetsRequirements, handleChoiceSelect, handleOutcomeContinue]);

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

  // Check if image exists
  const hasImage = imageLoaded && !imageError;

  return (
    <div
      className={`fixed inset-0 bg-ink-900/90 flex items-center justify-center z-50 p-4
        ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
    >
      <div className={`bg-paper-100 dark:bg-ink-800 border-4 border-double border-gold-600 rounded-lg shadow-2xl
        ${hasImage ? 'max-w-4xl' : 'max-w-xl'} w-full max-h-[90vh] overflow-hidden flex flex-col
        ${isAnimating ? 'scale-95' : 'scale-100'} transition-transform duration-300`}
      >
        {/* Header with decorative elements - color-coded by category */}
        {(() => {
          const colors = getCategoryColors(event.category);
          return (
            <div className={`bg-gradient-to-r ${colors.gradient} px-5 py-3 flex items-center justify-between relative`}>
              {/* Decorative corner flourishes */}
              <div className={`absolute left-2 top-1/2 -translate-y-1/2 ${colors.icon} text-lg`}>❧</div>
              <h2 className={`font-display ${colors.text} text-xl font-bold tracking-wide pl-4`}>
                {phase === 'outcome' ? 'The Consequence' : event.title}
              </h2>
              <button
                onClick={handleDismiss}
                className={`${colors.text} opacity-70 hover:opacity-100 transition-colors p-1 hover:bg-white/10 rounded`}
                title="Dismiss (ESC)"
              >
                <LucideX size={20} />
              </button>
              {/* Bottom shadow for depth */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-b from-black/10 to-transparent" />
            </div>
          );
        })()}

        {/* Hidden image loader to check if image exists */}
        {imagePath && !imageLoaded && !imageError && (
          <img
            src={imagePath}
            alt=""
            className="hidden"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Content - Two column layout if image exists */}
        <div className={`${hasImage ? 'flex' : ''} flex-1 overflow-hidden`}>
          {/* Image Column (only rendered if image loaded successfully) */}
          {hasImage && (
            <div className="w-80 shrink-0 p-1 bg-ink-900/30 flex">
              {/* Single border frame, semi-transparent - fills full height */}
              <div
                className="border-2 border-gold-600/50 rounded overflow-hidden relative shadow-lg group cursor-help flex-1"
                title="Image generated by Google Imagen 3 prompted to create an illustration in the style of John Singer Sargent"
              >
                {/* Main image - fills container, zooms in on outcome phase */}
                <img
                  src={imagePath!}
                  alt={event.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                    phase === 'outcome' ? 'scale-150' : 'scale-100'
                  }`}
                  style={{
                    transformOrigin: 'center 30%'
                  }}
                />
                {/* Gradient overlay - dark at bottom, clear at top */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(20, 18, 16, 0.5) 85%, rgba(20, 18, 16, 0.8) 100%)'
                  }}
                />
                {/* Subtle vignette effect */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 30px 5px rgba(0,0,0,0.2)'
                  }}
                />
                {/* Hover indicator for tooltip */}
                <div className="absolute bottom-2 right-2 text-gold-500/40 group-hover:text-gold-500/70 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <path d="M12 17h.01"/>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Text Content */}
          <div className="p-6 md:p-8 space-y-5 flex-1 overflow-y-auto">
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
              <div className="space-y-3 pt-3">
                <p className="text-xs uppercase tracking-widest text-paper-500 dark:text-paper-500 font-mono border-b border-paper-300 dark:border-ink-600 pb-2">
                  What do you do?
                </p>
                {event.choices.map((choice, index) => {
                  const canSelect = meetsRequirements(choice);
                  const choiceType = inferChoiceType(choice);
                  const colors = getChoiceColors(choiceType, canSelect);
                  return (
                    <button
                      key={choice.id}
                      onClick={() => handleChoiceSelect(choice)}
                      disabled={!canSelect}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all group relative overflow-hidden
                        ${colors.bg} ${colors.border} ${colors.hoverBg} ${colors.hoverBorder}
                        ${canSelect ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed opacity-50'}`}
                    >
                      {/* Hover glow effect */}
                      {canSelect && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${colors.glow} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      )}
                      {/* Number hotkey indicator in top right */}
                      <span className={`absolute top-2 right-3 text-xs font-mono px-1.5 py-0.5 rounded ${canSelect ? 'bg-black/10 dark:bg-white/10' : 'opacity-30'} ${colors.text}`}>
                        {index + 1}
                      </span>
                      {/* Main content: icon + text */}
                      <div className="flex items-start gap-3 relative">
                        {/* Icon on the left */}
                        <div className={`shrink-0 mt-0.5 ${!canSelect ? 'opacity-40' : ''}`}>
                          {colors.iconColor && getChoiceIcon(choiceType, colors.iconColor)}
                        </div>
                        {/* Text content */}
                        <div className="flex-1">
                          <span className={`text-lg leading-relaxed ${colors.text} ${canSelect ? 'group-hover:brightness-110' : ''}`}>
                            {choice.text}
                          </span>
                          {choice.requiredStat && (
                            <div className={`mt-1.5 text-xs font-mono flex items-center gap-1 ${canSelect ? 'text-teal-700 dark:text-teal-400' : 'text-red-600 dark:text-red-400'}`}>
                              <span className="opacity-70">[</span>
                              Requires {getStatName(choice.requiredStat.stat)} {choice.requiredStat.minValue}+
                              <span className="opacity-70">]</span>
                            </div>
                          )}
                        </div>
                      </div>
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
                <div className="flex font-mono flex-wrap gap-2 pt-2">
                  {outcome.statChanges.map((change, i) => (
                    <span
                      key={i}
                      className={`inline-flex   items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-medium border
                        ${change.change > 0
                          ? 'bg-green-50  dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                          : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        }`}
                    >
                      {getStatIcon(change.stat)}
                      <span>{change.stat}:</span>
                      <span className="font-bold font-mono">{change.change > 0 ? '+' : ''}{change.change}</span>
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

              {/* Continue button - matches category color */}
              {(() => {
                const colors = getCategoryColors(event.category);
                return (
                  <button
                    onClick={handleOutcomeContinue}
                    className={`w-full py-3 bg-gradient-to-r ${colors.gradient} hover:brightness-110 ${colors.text} font-display font-bold rounded-lg transition-all text-lg tracking-wide shadow-md hover:shadow-lg ${colors.shadow} ${colors.border} border`}
                  >
                    Continue
                  </button>
                );
              })()}
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
