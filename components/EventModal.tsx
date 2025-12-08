import React, { useState, useEffect, useCallback } from 'react';
import { GameEvent, EventChoice, EventOutcome, StatType, DiscoveredPhrase, EventCategory } from '../types';
import { useGame } from '../context/GameContext';
import { getUndiscoveredPhrase } from '../data/jamesianPhrases';
import { LucideX, LucideBookOpen, LucideStar, LucideHeart, LucideSparkles, LucideBrain, LucideAlertTriangle, LucideMessageCircle, LucideEye, LucideShield, LucideZap } from 'lucide-react';
import InspirationModal from './InspirationModal';
import { playSound } from '../services/audioService';

// Category-based color schemes for header - refined with metallic/enamel feel
const getCategoryColors = (category?: EventCategory) => {
  switch (category) {
    case 'introspective':
      return {
        gradient: 'from-violet-800 via-violet-600 to-violet-800',
        innerGlow: 'rgba(167,139,250,0.3)',
        border: 'border-violet-400/60',
        text: 'text-violet-100',
        textShadow: '0 1px 2px rgba(0,0,0,0.4), 0 0 8px rgba(167,139,250,0.3)',
        icon: 'text-violet-200/50',
        shadow: 'shadow-violet-600/20',
        accent: '#a78bfa'
      };
    case 'social':
      return {
        gradient: 'from-amber-700 via-gold-500 to-amber-700',
        innerGlow: 'rgba(251,191,36,0.4)',
        border: 'border-amber-300/70',
        text: 'text-amber-950',
        textShadow: '0 1px 0 rgba(255,255,255,0.4), 0 -1px 0 rgba(0,0,0,0.1)',
        icon: 'text-amber-900/40',
        shadow: 'shadow-amber-600/30',
        accent: '#f59e0b'
      };
    case 'physical':
      return {
        gradient: 'from-rose-800 via-rose-600 to-rose-800',
        innerGlow: 'rgba(251,113,133,0.3)',
        border: 'border-rose-400/60',
        text: 'text-rose-100',
        textShadow: '0 1px 2px rgba(0,0,0,0.4), 0 0 8px rgba(251,113,133,0.3)',
        icon: 'text-rose-200/50',
        shadow: 'shadow-rose-600/20',
        accent: '#fb7185'
      };
    case 'intellectual':
      return {
        gradient: 'from-teal-800 via-teal-600 to-teal-800',
        innerGlow: 'rgba(45,212,191,0.3)',
        border: 'border-teal-400/60',
        text: 'text-teal-100',
        textShadow: '0 1px 2px rgba(0,0,0,0.4), 0 0 8px rgba(45,212,191,0.3)',
        icon: 'text-teal-200/50',
        shadow: 'shadow-teal-600/20',
        accent: '#2dd4bf'
      };
    case 'aesthetic':
      return {
        gradient: 'from-emerald-800 via-emerald-600 to-emerald-800',
        innerGlow: 'rgba(52,211,153,0.3)',
        border: 'border-emerald-400/60',
        text: 'text-emerald-100',
        textShadow: '0 1px 2px rgba(0,0,0,0.4), 0 0 8px rgba(52,211,153,0.3)',
        icon: 'text-emerald-200/50',
        shadow: 'shadow-emerald-600/20',
        accent: '#34d399'
      };
    case 'mysterious':
      return {
        gradient: 'from-purple-900 via-purple-700 to-purple-900',
        innerGlow: 'rgba(192,132,252,0.3)',
        border: 'border-purple-400/60',
        text: 'text-purple-100',
        textShadow: '0 1px 2px rgba(0,0,0,0.5), 0 0 10px rgba(192,132,252,0.4)',
        icon: 'text-purple-200/50',
        shadow: 'shadow-purple-600/20',
        accent: '#c084fc'
      };
    default:
      // Default gold for unspecified
      return {
        gradient: 'from-amber-700 via-gold-500 to-amber-700',
        innerGlow: 'rgba(251,191,36,0.4)',
        border: 'border-amber-300/70',
        text: 'text-amber-950',
        textShadow: '0 1px 0 rgba(255,255,255,0.4), 0 -1px 0 rgba(0,0,0,0.1)',
        icon: 'text-amber-900/40',
        shadow: 'shadow-amber-600/30',
        accent: '#f59e0b'
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

  // Play event popup sound on mount
  useEffect(() => {
    if (!state.audio.muted) {
      playSound('EVENT_POPUP');
    }
  }, []);

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

  // Get colors for current category
  const categoryColors = getCategoryColors(event.category);

  return (
    <div
      className={`fixed inset-0 bg-ink-900/90 flex items-center justify-center z-50 p-2 md:p-4
        ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
    >
      {/* Victorian card-style CSS */}
      <style>{`
        .event-modal-frame {
          position: relative;
          background: linear-gradient(145deg, #FAF7F2 0%, #F5F0E8 100%);
          border: 3px solid #8B6508;
          box-shadow:
            inset 0 0 0 1px rgba(212,168,75,0.5),
            inset 0 0 0 4px #FAF7F2,
            inset 0 0 0 5px rgba(139,101,8,0.3),
            0 10px 40px rgba(0,0,0,0.4),
            0 2px 10px rgba(0,0,0,0.2);
        }
        .dark .event-modal-frame {
          background: linear-gradient(145deg, #1e1e24 0%, #16161a 100%);
          border-color: #8B6508;
          box-shadow:
            inset 0 0 0 1px rgba(212,168,75,0.3),
            inset 0 0 0 4px #1e1e24,
            inset 0 0 0 5px rgba(139,101,8,0.2),
            0 10px 40px rgba(0,0,0,0.6),
            0 2px 10px rgba(0,0,0,0.3);
        }
        /* Corner ornaments */
        .event-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          pointer-events: none;
          z-index: 5;
        }
        .event-corner::before,
        .event-corner::after {
          content: '';
          position: absolute;
          background: linear-gradient(135deg, #D4A84B 0%, #8B6508 100%);
        }
        .event-corner-tl { top: 6px; left: 6px; }
        .event-corner-tl::before { width: 12px; height: 2px; top: 0; left: 0; }
        .event-corner-tl::after { width: 2px; height: 12px; top: 0; left: 0; }
        .event-corner-tr { top: 6px; right: 6px; }
        .event-corner-tr::before { width: 12px; height: 2px; top: 0; right: 0; }
        .event-corner-tr::after { width: 2px; height: 12px; top: 0; right: 0; }
        .event-corner-bl { bottom: 6px; left: 6px; }
        .event-corner-bl::before { width: 12px; height: 2px; bottom: 0; left: 0; }
        .event-corner-bl::after { width: 2px; height: 12px; bottom: 0; left: 0; }
        .event-corner-br { bottom: 6px; right: 6px; }
        .event-corner-br::before { width: 12px; height: 2px; bottom: 0; right: 0; }
        .event-corner-br::after { width: 2px; height: 12px; bottom: 0; right: 0; }
        /* Header enamel effect */
        .event-header {
          position: relative;
          overflow: hidden;
        }
        .event-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%);
          pointer-events: none;
        }
        .event-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 100%);
          pointer-events: none;
        }
        /* Brass continue button */
        .brass-continue-btn {
          background:
            repeating-radial-gradient(circle at center, transparent 0px, transparent 1px, rgba(139,105,20,0.03) 1px, rgba(139,105,20,0.03) 2px),
            linear-gradient(145deg, #D4A84B 0%, #C9963C 20%, #B8860B 45%, #A67C00 70%, #8B6508 100%);
          border: 1px solid #654321;
          box-shadow:
            0 3px 8px rgba(0,0,0,0.3),
            0 1px 2px rgba(0,0,0,0.2),
            inset 0 2px 3px rgba(255,223,128,0.5),
            inset 0 -2px 3px rgba(101,67,33,0.4);
          color: #2D1F0D;
          text-shadow: 0 1px 0 rgba(255,220,150,0.5);
          transition: all 0.15s ease;
        }
        .brass-continue-btn:hover {
          background:
            repeating-radial-gradient(circle at center, transparent 0px, transparent 1px, rgba(139,105,20,0.02) 1px, rgba(139,105,20,0.02) 2px),
            linear-gradient(145deg, #E8C86C 0%, #DDB85C 20%, #D4A84B 45%, #C9963C 70%, #B8860B 100%);
          box-shadow:
            0 4px 12px rgba(0,0,0,0.35),
            0 2px 4px rgba(0,0,0,0.2),
            inset 0 2px 4px rgba(255,235,180,0.6),
            inset 0 -2px 3px rgba(101,67,33,0.3),
            0 0 15px rgba(212,168,75,0.3);
        }
        .brass-continue-btn:active {
          background:
            linear-gradient(145deg, #9A7209 0%, #8B6508 20%, #7A5A07 45%, #6B4E06 70%, #5C4305 100%);
          box-shadow:
            0 1px 2px rgba(0,0,0,0.3),
            inset 0 2px 5px rgba(40,30,10,0.5);
          transform: translateY(2px);
          transition: all 0.08s ease-out;
        }
        @keyframes brass-continue-spring {
          0% { transform: translateY(2px) scale(0.98); }
          50% { transform: translateY(-1px) scale(1.01); }
          100% { transform: translateY(0) scale(1); }
        }
        .brass-continue-btn:not(:active) {
          animation: brass-continue-spring 0.25s ease-out;
        }
      `}</style>

      <div className={`event-modal-frame rounded-lg
        ${hasImage ? 'max-w-4xl' : 'max-w-xl'} w-full max-h-[85dvh] md:max-h-[90vh] overflow-hidden flex flex-col
        ${isAnimating ? 'scale-95' : 'scale-100'} transition-transform duration-300`}
      >
        {/* Corner ornaments */}
        <div className="event-corner event-corner-tl"></div>
        <div className="event-corner event-corner-tr"></div>
        <div className="event-corner event-corner-bl"></div>
        <div className="event-corner event-corner-br"></div>

        {/* Header - subtle color-coded bar */}
        <div
          className={`px-5 py-2.5 flex items-center justify-between border-b`}
          style={{
            background: `linear-gradient(180deg, ${categoryColors.accent}18 0%, ${categoryColors.accent}08 100%)`,
            borderColor: `${categoryColors.accent}40`
          }}
        >
          <span className="text-gold-400/60 text-sm">―</span>

          <h2
            className="font-display text-lg font-bold tracking-wide text-center flex-1 mx-3 text-ink-800 dark:text-paper-100"
          >
            {phase === 'outcome' ? 'The Consequence' : event.title}
          </h2>

          <button
            onClick={handleDismiss}
            className="text-ink-400 dark:text-paper-400 opacity-60 hover:opacity-100 transition-all p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded"
            title="Dismiss (ESC)"
          >
            <LucideX size={18} />
          </button>
        </div>

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

        {/* Content - Two column layout if image exists (stacks on mobile) */}
        <div className={`${hasImage ? 'flex flex-col md:flex-row' : ''} flex-1 overflow-hidden`}>
          {/* Image Column (only rendered if image loaded successfully) */}
          {hasImage && (
            <div className="w-full h-32 md:h-auto md:w-80 shrink-0 p-1 bg-ink-900/30 flex">
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
          <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-5 flex-1 overflow-y-auto">
          {/* INITIAL PHASE - Show event and choices */}
          {phase === 'initial' && (
            <>
              {/* Description */}
              <div className="prose prose-base md:prose-lg dark:prose-invert">
                <p className="text-ink-800 dark:text-paper-200 leading-relaxed font-serif italic text-base md:text-lg">
                  {event.description}
                </p>
              </div>

              {/* Choices */}
              <div className="space-y-3 pt-3">
                <div className="flex items-center gap-3 pb-2 border-b border-paper-300 dark:border-ink-600">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent"></div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gold-700 dark:text-gold-500 font-display font-semibold">
                    What do you do?
                  </p>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent"></div>
                </div>
                {event.choices.map((choice, index) => {
                  const canSelect = meetsRequirements(choice);
                  const choiceType = inferChoiceType(choice);
                  const colors = getChoiceColors(choiceType, canSelect);
                  return (
                    <button
                      key={choice.id}
                      onClick={() => handleChoiceSelect(choice)}
                      disabled={!canSelect}
                      className={`w-full text-left p-3 md:p-4 rounded-lg border-2 transition-all group relative overflow-hidden
                        ${colors.bg} ${colors.border} ${colors.hoverBg} ${colors.hoverBorder}
                        ${canSelect ? 'cursor-pointer hover:shadow-lg active:scale-[0.98]' : 'cursor-not-allowed opacity-50'}`}
                    >
                      {/* Hover glow effect */}
                      {canSelect && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${colors.glow} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      )}
                      {/* Number hotkey indicator in top right - hidden on mobile */}
                      <span className={`absolute top-2 right-3 text-xs font-mono px-1.5 py-0.5 rounded hidden md:inline ${canSelect ? 'bg-black/10 dark:bg-white/10' : 'opacity-30'} ${colors.text}`}>
                        {index + 1}
                      </span>
                      {/* Main content: icon + text */}
                      <div className="flex items-start gap-2 md:gap-3 relative">
                        {/* Icon on the left */}
                        <div className={`shrink-0 mt-0.5 ${!canSelect ? 'opacity-40' : ''}`}>
                          {colors.iconColor && getChoiceIcon(choiceType, colors.iconColor)}
                        </div>
                        {/* Text content */}
                        <div className="flex-1">
                          <span className={`text-base md:text-lg leading-relaxed ${colors.text} ${canSelect ? 'group-hover:brightness-110' : ''}`}>
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

              {/* Continue button - polished brass style */}
              <button
                onClick={handleOutcomeContinue}
                className="w-full py-3 font-display font-bold rounded-lg text-lg tracking-wide brass-continue-btn"
              >
                Continue
              </button>
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
