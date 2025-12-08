
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { GameProvider, useGame } from '../context/GameContext';
import ErrorBoundary from './ErrorBoundary';
import OverworldMap from './OverworldMap';
import CombatView from './CombatView';
import DialogueView from './DialogueView';
import FactChecker from './FactChecker';
import GalleryModal from './GalleryModal';
import MinigameTelegraph from './MinigameTelegraph';
import MinigameCurator from './MinigameCurator';
import MinigameFlaneur from './MinigameFlaneur';
import NarratorPanel from './NarratorPanel';
import AsciiPortrait from './AsciiPortrait';
import Portrait from './Portrait';
import NpcPortrait from './NpcPortrait';
import PlayerModal from './PlayerModal';
import InventoryPanel from './InventoryPanel';
import SupportModal from './SupportModal';
import AboutModal from './AboutModal';
import MobileControls from './MobileControls';
import MobileHeader from './MobileHeader';
import ElevatorModal from './ElevatorModal';
import GameOverScreen from './GameOverScreen';
import BottomStatBar from './BottomStatBar';
import EventModal from './EventModal';
import JournalModal from './JournalModal';
import SketchbookModal from './SketchbookModal';
import WorksModal from './WorksModal';
import TitleScreen from './TitleScreen';
import ResponsiveTestPanel from './ResponsiveTestPanel';
import TutorialOverlay, { hasSeenTutorial, markTutorialSeen } from './TutorialOverlay';
import WriteMode from './WriteMode';
import KioskModal from './KioskModal';
import ExhibitCloseupModal from './ExhibitCloseupModal';
import LocationModal from './LocationModal';
import ActiveEffectsDisplay from './ActiveEffectsDisplay';
import FloatingStatIndicator from './FloatingStatIndicator';
import { GameState, Mood, NPC, PortraitArchetype } from '../types';
import { INTRO_TEXT, INTRO_DIALOGUE, OpeningScenario } from '../constants';
import { generateObservationPrompt, generateImpressionistImage } from '../services/geminiService';
import { LucideScroll, LucideHelpCircle, LucideVolume2, LucideVolumeX, LucideImage, LucideMoon, LucideSun, LucideUser, LucideMap, LucideFeather, LucideBackpack, LucideRadar, LucideFileText, LucideArrowRight, LucideX, LucideEye, LucideCamera, LucideTarget, LucideHeart, LucideSettings, LucideBookOpen, LucidePenTool, LucideChevronDown, LucideChevronUp, LucideCompass } from 'lucide-react';
import NpcSprite from './NpcSprite';
import { getInterpolatedTimeColors } from '../utils/timeOfDay';
import { playSound } from '../services/audioService';
import ParisSkyline from './ParisSkyline';

// Card/Repartee Unlock Toast with auto-dismiss
const CardUnlockToast: React.FC<{
  cardName: string;
  description: string;
  onDismiss: () => void;
}> = ({ cardName, description, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300); // Allow fade-out animation
    }, 3000);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount - onDismiss intentionally excluded to prevent timer reset

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[90] cursor-pointer transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
      style={{ animation: isVisible ? 'slideDown 0.5s ease-out' : undefined }}
      onClick={() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300);
      }}
    >
      <div className="bg-gradient-to-r from-ink-900 via-ink-800 to-ink-900 border-2 border-gold-500 rounded-xl px-6 py-4 shadow-2xl shadow-gold-500/30 min-w-[320px] max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gold-600/20 border border-gold-500/50 flex items-center justify-center">
            <span className="text-xl">✒️</span>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gold-400 font-mono">New form of repartee unlocked!</div>
            <div className="text-lg font-display font-bold text-gold-300">{cardName}</div>
          </div>
        </div>
        {/* Description */}
        <p className="text-sm text-paper-200 font-serif italic pl-13">
          {description}
        </p>
      </div>
    </div>
  );
};

// Rich Text Helper
const RichText: React.FC<{ text: string, npcs: NPC[], onNpcClick: (id: string) => void }> = ({ text, npcs, onNpcClick }) => {
    let processed = text;
    const foundNpcs: {id: string, name: string, token: string}[] = [];
    
    npcs.forEach((npc, idx) => {
        if (processed.includes(npc.name)) {
            const token = `__NPC_${idx}__`;
            foundNpcs.push({ id: npc.id, name: npc.name, token });
            processed = processed.split(npc.name).join(token);
        }
    });

    const parts = processed.split(/(__NPC_\d+__|(?:\*\*.*?\*\*)|(?:\*.*?\*))/g);

    return (
        <span className="leading-relaxed">
            {parts.map((part, i) => {
                const npcMatch = foundNpcs.find(n => n.token === part);
                if (npcMatch) {
                    return (
                        <span
                            key={i}
                            onClick={() => onNpcClick(npcMatch.id)}
                            className="font-semibold text-blue-700 dark:text-blue-300 cursor-pointer hover:underline hover:text-blue-500 transition-colors not-italic"
                            title="Click to Locate"
                        >
                            {npcMatch.name}
                        </span>
                    );
                }
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-semibold text-ink-900 dark:text-white not-italic">{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={i} className="italic text-ink-700 dark:text-gray-300">{part.slice(1, -1)}</em>;
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
};

const GameLayout: React.FC = () => {
  const { state, dispatch } = useGame();
  const logRef = useRef<HTMLDivElement>(null);
  const [flash, setFlash] = useState(false);
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'INVENTORY' | 'AMBIENCE'>('PROFILE');
  const [activeRightTab, setActiveRightTab] = useState<'CHRONICLE' | 'MAP' | 'OBSERVE'>('CHRONICLE');
  const [dialogueStep, setDialogueStep] = useState(0);
  const [observing, setObserving] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showResponsiveTest, setShowResponsiveTest] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [textSizeMultiplier, setTextSizeMultiplier] = useState(1.0);
  const [hoveredZone, setHoveredZone] = useState<{ name: string; coords: string; biome: string; mapData?: string[]; x: number; y: number } | null>(null);
  const [panelsHidden, setPanelsHidden] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [portraitHovered, setPortraitHovered] = useState(false);
  const tutorialShownRef = useRef(false);

  // Show tutorial after intro dialogue closes and zoom completes (for first-time players)
  useEffect(() => {
    if (!state.introDialogueOpen && !tutorialShownRef.current && !hasSeenTutorial()) {
      tutorialShownRef.current = true;
      // Wait for zoom animation to complete (2.5s) plus a small buffer
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.introDialogueOpen]);

  // Scroll to top on mount to prevent iOS Safari scroll offset issue
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  // Time-aware sky gradient for the overall game background
  const timeColors = useMemo(() =>
    getInterpolatedTimeColors(state.gameTime.hour, state.gameTime.minute),
    [state.gameTime.hour, state.gameTime.minute]
  );

  // Determine if current zone is outdoors (for showing sky vs interior background)
  const currentZone = state.zones[state.player.currentZoneId];
  const OUTDOOR_BIOMES = new Set([
    'GARDEN', 'STREET', 'ESPLANADE', 'BRIDGE', 'GATE', 'VILLAGE',
    'TROCADERO', 'WATERFALL', 'SOUK', 'CAFE', 'TOWER_BASE',
    'TOWER_PLATFORM', 'TOWER_FIRST_FLOOR', 'TOWER_LEVEL'
  ]);
  const isOutdoors = currentZone ? OUTDOOR_BIOMES.has(currentZone.biome) : true;

  const getMood = (): Mood => {
      const malaise = state.player.stats.malaise;
      const reputation = state.player.stats.reputation || 50;
      const composure = state.player.stats.composure || 10;

      // Combat always shows angry/determined
      if (state.gameState === GameState.COMBAT) return 'ANGRY';

      // Critical malaise = panicked/distressed
      if (malaise >= 80) return 'PANICKED';

      // High malaise = sweating/anxious
      if (malaise >= 60) return 'SWEATING';

      // Moderate malaise = worried
      if (malaise >= 40) return 'WORRIED';

      // Low reputation = embarrassed/sad
      if (reputation < 30) return 'SAD';

      // Low composure in social situations = nervous
      if (composure < 8 && state.gameState === GameState.DIALOGUE) return 'SWEATING';

      // Dialogue = engaged/speaking
      if (state.gameState === GameState.DIALOGUE) return 'SPEAKING';

      // Default = neutral/content
      return 'NEUTRAL';
  };

  // Global ESC key handler to close all modals
  useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
              // Close local state modals
              setShowAbout(false);
              setShowSettings(false);

              // Close global state modals
              if (state.showPlayerModal) {
                  dispatch({ type: 'CLOSE_PLAYER_MODAL' });
              }
              if (state.showSupportModal) {
                  dispatch({ type: 'CLOSE_SUPPORT_MODAL' });
              }
              if (state.gameState === GameState.GALLERY_VIEW) {
                  dispatch({ type: 'CLOSE_GALLERY' });
              }
              if (state.showKioskModal) {
                  dispatch({ type: 'HIDE_KIOSK_MODAL' });
              }
              if (state.showExhibitModal) {
                  dispatch({ type: 'HIDE_EXHIBIT_MODAL' });
              }
              // Close dialogue/combat by returning to exploring
              if (state.gameState === GameState.DIALOGUE) {
                  dispatch({ type: 'LEAVE_DIALOGUE' });
              }
          }
      };

      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
  }, [state.showPlayerModal, state.showSupportModal, state.showKioskModal, state.showExhibitModal, state.gameState, dispatch]);

  const isSpeaking = state.gameState === GameState.DIALOGUE || state.gameState === GameState.COMBAT;
  const activeNPC = state.gameState === GameState.COMBAT ? state.combat?.opponent : state.gameState === GameState.DIALOGUE ? state.dialogue?.npc : null;
  const isNpcTyping = state.dialogue?.isTyping ?? false;

  // Track inventory length to detect new item pickups
  const prevInventoryLengthRef = useRef(state.player.inventory.length);
  const inventoryPanelRef = useRef<HTMLDivElement>(null);

  // Auto-open inventory and scroll to new item when an item is picked up
  useEffect(() => {
    const currentLength = state.player.inventory.length;
    if (currentLength > prevInventoryLengthRef.current) {
      // New item was added - switch to inventory tab
      setActiveTab('INVENTORY');

      // Scroll to bottom of inventory after a short delay to let it render
      setTimeout(() => {
        if (inventoryPanelRef.current) {
          const scrollContainer = inventoryPanelRef.current.querySelector('.overflow-y-auto');
          if (scrollContainer) {
            scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
          }
        }
      }, 100);
    }
    prevInventoryLengthRef.current = currentLength;
  }, [state.player.inventory.length]);

  // Speaking animation frame for right sidebar portrait
  const [speakingFrame, setSpeakingFrame] = useState(0);
  const [npcInfoExpanded, setNpcInfoExpanded] = useState(false);
  const voiceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Voice sounds and speaking animation for right sidebar portrait
  // Limited to 1-3 seconds of animation (randomized) for less jarring effect
  useEffect(() => {
      if (isNpcTyping && !state.audio.muted) {
          // Random duration between 1 and 3 seconds
          const speakingDuration = 1000 + Math.random() * 2000;

          // Animate speaking frames
          const animInterval = setInterval(() => {
              setSpeakingFrame(prev => (prev + 1) % 3);
          }, 180); // Slightly slower frame rate for subtlety

          // Play voice mumble sounds at random intervals
          const playVoice = () => {
              if (isNpcTyping) {
                  playSound('VOICE_MUMBLE');
              }
          };

          // Initial delay then start voice
          const initialDelay = setTimeout(() => {
              playVoice();
              voiceIntervalRef.current = setInterval(() => {
                  if (Math.random() > 0.4) { // 60% chance each interval (reduced)
                      playVoice();
                  }
              }, 150 + Math.random() * 100);
          }, 200);

          // Stop speaking animation after random duration (but keep typing indicator)
          speakingTimeoutRef.current = setTimeout(() => {
              clearInterval(animInterval);
              if (voiceIntervalRef.current) {
                  clearInterval(voiceIntervalRef.current);
                  voiceIntervalRef.current = null;
              }
              setSpeakingFrame(0);
          }, speakingDuration);

          return () => {
              clearInterval(animInterval);
              clearTimeout(initialDelay);
              if (voiceIntervalRef.current) {
                  clearInterval(voiceIntervalRef.current);
                  voiceIntervalRef.current = null;
              }
              if (speakingTimeoutRef.current) {
                  clearTimeout(speakingTimeoutRef.current);
                  speakingTimeoutRef.current = null;
              }
              setSpeakingFrame(0);
          };
      }
  }, [isNpcTyping, state.audio.muted]);

  useEffect(() => {
      setActiveRightTab('MAP');
  }, [state.player.currentZoneId]);

  useEffect(() => {
      if (state.log.length === 0) return;
      const last = state.log[state.log.length - 1];
      if (last.type !== 'NARRATIVE' || !last.text.startsWith('You enter')) {
          setActiveRightTab('CHRONICLE');
      }
  }, [state.log.length]);

  useEffect(() => {
      if (state.settings.darkMode) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
  }, [state.settings.darkMode]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    const lastEntry = state.log[state.log.length - 1];
    if (lastEntry && lastEntry.type === 'VISION') {
        setFlash(true);
        setTimeout(() => setFlash(false), 500);
    }
  }, [state.log]);

  // Auto-dismiss zone transition after delay
  useEffect(() => {
    if (state.zoneTransition?.active) {
      const timer = setTimeout(() => {
        dispatch({ type: 'END_ZONE_TRANSITION' });
      }, 1800); // Show transition for 1.8 seconds
      return () => clearTimeout(timer);
    }
  }, [state.zoneTransition?.active, dispatch]);

  const handleObserve = async () => {
      if (observing) return;
      const zone = state.zones[state.player.currentZoneId];
      if (zone.observedImage) return;

      setObserving(true);
      const localNpcs = state.npcs.filter(n => n.location.zoneId === zone.id);
      const prompt = generateObservationPrompt(zone.name, zone.biome, zone.description, localNpcs);

      const imgUrl = await generateImpressionistImage(prompt);
      if (imgUrl) {
          // Cache on the zone for display in Observe tab
          dispatch({ type: 'CACHE_OBSERVATION', payload: { zoneId: zone.id, image: imgUrl } });
          // Also add to gallery/sketchbook for permanent collection
          dispatch({
              type: 'ADD_GALLERY_IMAGE',
              payload: {
                  id: `obs-${Date.now()}`,
                  base64: imgUrl,
                  prompt: prompt,
                  location: zone.name,
                  timestamp: Date.now()
              }
          });
      }
      setObserving(false);
  };

  if (state.gameState === GameState.INTRO) {
    return (
      <TitleScreen
        onStart={() => dispatch({ type: 'START_GAME' })}
        introText={state.openingScenario.titleScreenText}
      />
    );
  }

  const renderTabContent = () => {
      switch (activeTab) {
          case 'PROFILE':
              return (
                  <div className="space-y-4">
                        {/* Procedural State Description */}
                        <div
                            className="opacity-0"
                            style={{ animation: 'fadeSlideIn 0.4s ease-out forwards', animationDelay: '0ms' }}
                        >
                            <h3 className="font-display text-ink-900 dark:text-paper-100 border-b-2 border-gold-600 mb-3 text-sm font-bold pb-1">
                                Current State of Mind
                            </h3>
                            <p className="text-sm font-serif italic text-ink-700 dark:text-paper-300 leading-relaxed bg-paper-50 dark:bg-gray-900 p-3 rounded border border-ink-200 dark:border-gray-700">
                                {getJamesStateDescription()}
                            </p>
                        </div>

                        {/* Attributes */}
                        <div
                            className="opacity-0"
                            style={{ animation: 'fadeSlideIn 0.4s ease-out forwards', animationDelay: '80ms' }}
                        >
                            <h3 className="font-display text-ink-900 dark:text-paper-100 border-b-2 border-gold-600 mb-3 text-sm font-bold pb-1">Attributes</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: 'Wit', value: state.player.stats.wit },
                                    { label: 'Observation', value: state.player.stats.observation },
                                    { label: 'Decorum', value: state.player.stats.decorum }
                                ].map((attr, i) => (
                                    <div
                                        key={attr.label}
                                        className="bg-paper-200 dark:bg-gray-700 p-2 rounded-lg text-center border border-ink-900/10 shadow-sm opacity-0"
                                        style={{ animation: 'scaleIn 0.3s ease-out forwards', animationDelay: `${150 + i * 60}ms` }}
                                    >
                                        <div className="text-[10px] uppercase text-ink-500 dark:text-gray-400 mb-0.5 font-display tracking-wide">{attr.label}</div>
                                        <div className="text-xl font-bold text-ink-900 dark:text-gold-500">{attr.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Francs */}
                        <div
                            className="flex items-center justify-between bg-gold-100 dark:bg-gold-900/20 p-2 rounded border border-gold-300 dark:border-gold-700 opacity-0"
                            style={{ animation: 'fadeSlideIn 0.4s ease-out forwards', animationDelay: '350ms' }}
                        >
                            <span className="text-sm font-display text-gold-800 dark:text-gold-400">Francs</span>
                            <span className="text-lg font-bold text-gold-700 dark:text-gold-300">{state.player.stats.money} ₣</span>
                        </div>

                        {/* Active Effects from consumables */}
                        <div
                            className="opacity-0"
                            style={{ animation: 'fadeSlideIn 0.4s ease-out forwards', animationDelay: '420ms' }}
                        >
                            <ActiveEffectsDisplay />
                        </div>
                  </div>
              );
          case 'INVENTORY':
              return (
                  <div ref={inventoryPanelRef} className="h-full animate-fade-in">
                      <InventoryPanel
                          inventory={state.player.inventory}
                          playerMalaise={state.player.stats.malaise}
                          onUseForRelief={(itemId) => dispatch({ type: 'USE_ITEM_FOR_RELIEF', payload: itemId })}
                          onConsumeItem={(item) => {
                              dispatch({ type: 'CONSUME_ITEM', payload: item });
                              dispatch({ type: 'ADD_LOG', payload: {
                                  id: Date.now().toString(),
                                  type: 'SYSTEM',
                                  text: `You partake of the ${item.name}.`,
                                  timestamp: Date.now()
                              }});
                          }}
                          externalSelectedItem={state.itemModalItem}
                          onExternalItemClose={() => dispatch({ type: 'HIDE_ITEM_MODAL' })}
                      />
                  </div>
              );
          case 'AMBIENCE':
              const localNpcs = state.npcs.filter(n => n.location.zoneId === state.player.currentZoneId);
              const currentZone = state.zones[state.player.currentZoneId];
              // Deduplicate exit directions
              const uniqueExits = [...new Set(currentZone.exits.map(e => e.direction))];
              const exitLabels: Record<string, string> = { 'N': 'North', 'S': 'South', 'E': 'East', 'W': 'West' };
              // Crowd density descriptions based on NPC count (max 5 NPCs per zone)
              const npcCount = localNpcs.length;
              const getCrowdDescription = (count: number): string => {
                  // Use zone id as seed for consistent random selection
                  const seed = currentZone.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
                  const pick = (arr: string[]) => arr[seed % arr.length];
                  if (count === 0) return pick([
                      'Eerily deserted',
                      'Utterly empty',
                      'Conspicuously vacant',
                      'A profound solitude'
                  ]);
                  if (count === 1) return pick([
                      'Nearly empty',
                      'A lone figure',
                      'Sparse attendance',
                      'Quiet, almost intimate'
                  ]);
                  if (count === 2) return pick([
                      'Sparsely populated',
                      'A few souls',
                      'Modest traffic',
                      'Comfortable occupancy'
                  ]);
                  if (count === 3) return pick([
                      'Moderately busy',
                      'A respectable crowd',
                      'Steady foot traffic',
                      'Pleasantly occupied'
                  ]);
                  if (count === 4) return pick([
                      'Quite crowded',
                      'Bustling activity',
                      'A pressing throng',
                      'Considerable congestion'
                  ]);
                  // 5 NPCs - maximum density
                  return pick([
                      'Upsettingly chaotic',
                      'Overwhelmingly packed',
                      'A suffocating mass',
                      'Teeming humanity'
                  ]);
              };
              return (
                  <div className="space-y-4">
                      <div
                          className="opacity-0"
                          style={{ animation: 'fadeSlideIn 0.4s ease-out forwards', animationDelay: '0ms' }}
                      >
                          <h4 className="font-display text-sm font-bold text-gold-600 mb-2 border-b border-gold-600/30 pb-1">Notable Figures</h4>
                          {localNpcs.length === 0 ? (
                              <div className="text-sm italic text-gray-500">The area appears empty.</div>
                          ) : (
                              <div className="space-y-1.5">
                                  {localNpcs.map((npc, index) => (
                                      <div
                                          key={npc.id}
                                          className={`p-2 rounded-r cursor-pointer transition-all opacity-0 ${
                                              npc.isHistoricalFigure
                                                  ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/20 border-l-4 border-yellow-500 hover:from-amber-100 hover:to-yellow-100 dark:hover:from-amber-900/50 dark:hover:to-yellow-900/40 shadow-sm'
                                                  : 'bg-paper-50 dark:bg-gray-700 border-l-4 border-blue-400 hover:bg-paper-200 dark:hover:bg-gray-600'
                                          }`}
                                          style={{ animation: 'slideInRight 0.35s ease-out forwards', animationDelay: `${80 + index * 70}ms` }}
                                          onClick={() => dispatch({ type: 'HIGHLIGHT_ENTITY', payload: npc.id })}
                                      >
                                          <div className="flex items-center gap-1.5">
                                              {npc.isHistoricalFigure && (
                                                  <span className="text-yellow-500 text-xs">★</span>
                                              )}
                                              <span className={`font-bold text-sm block ${npc.isHistoricalFigure ? 'text-amber-900 dark:text-yellow-300' : 'text-ink-900 dark:text-paper-100'}`}>
                                                  {npc.name}
                                              </span>
                                          </div>
                                          <span className={`block text-xs mt-0.5 ${npc.isHistoricalFigure ? 'text-amber-700 dark:text-yellow-400/80' : 'text-ink-600 dark:text-gray-400'}`}>
                                              {npc.profession}{npc.nationality && npc.nationality !== 'French' ? ` · ${npc.nationality}` : ''}
                                          </span>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                      <div
                          className="opacity-0"
                          style={{ animation: 'fadeSlideIn 0.4s ease-out forwards', animationDelay: `${150 + localNpcs.length * 70}ms` }}
                      >
                          <h4 className="font-display text-sm font-bold text-gold-600 mb-2 border-b border-gold-600/30 pb-1">Environment</h4>
                          <div className="text-sm text-ink-900 dark:text-paper-200 space-y-1">
                             <div>Crowd Density: <span className="font-bold">{getCrowdDescription(npcCount)}</span></div>
                             <div>Exits: <span className="font-bold">{uniqueExits.map(d => exitLabels[d]).join(', ')}</span></div>
                          </div>
                      </div>
                  </div>
              )
      }
  }

  const renderOverworldMap = () => {
      const gridKeys = Object.keys(state.zoneGrid);
      if (gridKeys.length === 0) return null;

      let minX = 0, maxX = 0, minY = 0, maxY = 0;
      gridKeys.forEach(k => {
          const [x, y] = k.split(',').map(Number);
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
      });

      minX -= 1; maxX += 1; minY -= 1; maxY += 1;

      const currentZone = state.zones[state.player.currentZoneId];
      const scale = 24;
      const width = (maxX - minX + 1) * scale;
      const height = (maxY - minY + 1) * scale;

      // Biome color mapping for better visual distinction
      const getBiomeColor = (biome: string): string => {
          const colors: Record<string, string> = {
              'GRAND_HALL': '#64748b',
              'GARDEN': '#22c55e',
              'STREET': '#d97706',
              'SALON': '#dc2626',
              'TOWER_LEVEL': '#3b82f6',
              'TOWER_BASE': '#475569',
              'TOWER_PLATFORM': '#0ea5e9',
              'TOWER_FIRST_FLOOR': '#f59e0b',
              'ESPLANADE': '#10b981',
              'CONCERT_HALL': '#7c3aed',
              'SOUK': '#ea580c',
              'GALERIE': '#71717a',
              'BRIDGE': '#2563eb',
              'GATE': '#854d0e',
              'VILLAGE': '#a16207',
              'TROCADERO': '#0891b2',
              'WATERFALL': '#06b6d4',
              'AQUARIUM': '#0284c7',
              'CAFE': '#b45309',
              'CONGRESS': '#6366f1'
          };
          return colors[biome] || '#475569';
      };

      // Find adjacent zones that exist but player hasn't visited yet
      const currentX = currentZone.coordinates.x;
      const currentY = currentZone.coordinates.y;
      const adjacentCoords = [
          { x: currentX, y: currentY - 1, dir: 'N' },
          { x: currentX, y: currentY + 1, dir: 'S' },
          { x: currentX - 1, y: currentY, dir: 'W' },
          { x: currentX + 1, y: currentY, dir: 'E' }
      ];
      const availableExits = currentZone.exits.map(e => e.direction);

      // Render a mini map preview inside each tile
      const renderMiniMap = (mapData: string[], tileX: number, tileY: number, tileSize: number) => {
          if (!mapData || mapData.length === 0) return null;
          const rows = mapData.length;
          const cols = mapData[0]?.length || 20;
          const cellW = (tileSize - 4) / cols;
          const cellH = (tileSize - 4) / rows;

          const elements: JSX.Element[] = [];
          for (let row = 0; row < rows; row++) {
              for (let col = 0; col < cols; col++) {
                  const char = mapData[row]?.[col] || '.';
                  let fill = 'transparent';
                  // Simplified color mapping for mini view
                  if (char === '#' || char === 'W') fill = '#374151'; // walls
                  else if (char === '~' || char === 'F' || char === 'f') fill = '#3b82f6'; // water/fountain
                  else if (char === 'T' || char === 'H' || char === 'q') fill = '#22c55e'; // trees/hedges
                  else if (char === 'g' || char === 'w') fill = '#4ade80'; // grass/flowers
                  else if (char === ':' || char === 'v' || char === '.') fill = '#d4c4a8'; // paths/floor
                  else if (char === 'L' || char === 'l') fill = '#fbbf24'; // lamps
                  else if (char === 'M' || char === 'Ð' || char === 'Þ') fill = '#78716c'; // machines
                  else if (char === 'D' || char === 'u' || char === 'E') fill = '#a855f7'; // displays/exhibits
                  else if (char === 'P' || char === 'A') fill = '#1e3a8a'; // tower elements

                  if (fill !== 'transparent') {
                      elements.push(
                          <rect
                              key={`${row}-${col}`}
                              x={tileX + 2 + col * cellW}
                              y={tileY + 2 + row * cellH}
                              width={cellW}
                              height={cellH}
                              fill={fill}
                              opacity={0.8}
                          />
                      );
                  }
              }
          }
          return elements;
      };

      return (
          <div className="w-full h-full flex items-center justify-center bg-paper-200 dark:bg-gray-800 overflow-hidden rounded p-2 relative shadow-inner">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]"></div>
               <svg viewBox={`${minX * scale} ${minY * scale} ${width} ${height}`} className="w-full h-full z-10" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <pattern id="smallGrid" width={scale} height={scale} patternUnits="userSpaceOnUse">
                            <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="gray" strokeOpacity="0.1" strokeWidth="0.5"/>
                        </pattern>
                    </defs>
                    <rect x={minX*scale} y={minY*scale} width={width} height={height} fill="url(#smallGrid)" />

                    {/* Render adjacent zones that are available but not yet visited as grayed out hints */}
                    {adjacentCoords.map(adj => {
                        const adjKey = `${adj.x},${adj.y}`;
                        const isAvailable = availableExits.includes(adj.dir as any);
                        const alreadyExists = state.zoneGrid[adjKey];

                        // Only show hint if exit is available but zone not generated yet
                        if (isAvailable && !alreadyExists) {
                            return (
                                <g key={`hint-${adjKey}`}>
                                    <rect
                                        x={adj.x * scale + 2}
                                        y={adj.y * scale + 2}
                                        width={scale - 4}
                                        height={scale - 4}
                                        fill="#9ca3af"
                                        opacity={0.25}
                                        rx="2"
                                        strokeDasharray="2,2"
                                        stroke="#6b7280"
                                        strokeWidth={0.5}
                                    />
                                    <text
                                        x={adj.x * scale + scale/2}
                                        y={adj.y * scale + scale/2 + 1}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="#6b7280"
                                        fontSize="6"
                                        fontFamily="sans-serif"
                                    >
                                        ?
                                    </text>
                                </g>
                            );
                        }
                        return null;
                    })}

                    {/* Render visited zones with mini-maps */}
                    {gridKeys.map(key => {
                        const [x, y] = key.split(',').map(Number);
                        const zId = state.zoneGrid[key];
                        const z = state.zones[zId];
                        const color = getBiomeColor(z.biome);
                        const isCurrent = z.id === state.player.currentZoneId;
                        const isHovered = hoveredZone && hoveredZone.x === x && hoveredZone.y === y;

                        return (
                            <g key={key} style={{ cursor: 'pointer' }}>
                                {/* Background color */}
                                <rect
                                    x={x * scale + 1}
                                    y={y * scale + 1}
                                    width={scale - 2}
                                    height={scale - 2}
                                    fill={color}
                                    opacity={isCurrent ? 0.3 : 0.15}
                                    rx="2"
                                />

                                {/* Mini map rendering */}
                                {z.mapData && renderMiniMap(z.mapData, x * scale, y * scale, scale)}

                                {/* Border and interaction layer */}
                                <rect
                                    x={x * scale + 1}
                                    y={y * scale + 1}
                                    width={scale - 2}
                                    height={scale - 2}
                                    fill="transparent"
                                    rx="2"
                                    stroke={isCurrent ? '#fbbf24' : isHovered ? color : 'rgba(0,0,0,0.2)'}
                                    strokeWidth={isCurrent ? 1.5 : isHovered ? 1 : 0.5}
                                    onMouseEnter={() => setHoveredZone({
                                        name: z.name,
                                        coords: `(${x}, ${y})`,
                                        biome: z.biome,
                                        mapData: z.mapData,
                                        x, y
                                    })}
                                    onMouseLeave={() => setHoveredZone(null)}
                                />

                                {/* Biome color overlay on hover */}
                                {isHovered && (
                                    <rect
                                        x={x * scale + 1}
                                        y={y * scale + 1}
                                        width={scale - 2}
                                        height={scale - 2}
                                        fill={color}
                                        opacity={0.4}
                                        rx="2"
                                        className="pointer-events-none"
                                    />
                                )}

                                {/* Current position indicator */}
                                {isCurrent && (
                                    <circle cx={x*scale + scale/2} cy={y*scale + scale/2} r={3} fill="#fbbf24" className="animate-pulse" opacity="0.9"/>
                                )}
                            </g>
                        );
                    })}
               </svg>

               {/* Enhanced hover tooltip */}
               {hoveredZone && (
                   <div className="absolute top-2 left-2 right-2 bg-gray-900/95 p-2.5 rounded-lg border border-amber-500/60 shadow-lg z-30 pointer-events-none backdrop-blur-sm">
                       <div className="flex items-center gap-2 mb-1">
                           <div
                               className="w-3 h-3 rounded-sm border border-white/30 shrink-0"
                               style={{ backgroundColor: getBiomeColor(hoveredZone.biome) }}
                           />
                           <div className="font-display font-bold text-amber-300 text-sm leading-tight">{hoveredZone.name}</div>
                       </div>
                       <div className="flex items-center gap-2 text-xs">
                           <span className="bg-gray-700/80 text-gray-200 px-1.5 py-0.5 rounded font-mono text-[10px]">{hoveredZone.coords}</span>
                           <span className="text-gray-400">·</span>
                           <span className="capitalize text-gray-300">{hoveredZone.biome.toLowerCase().replace(/_/g, ' ')}</span>
                       </div>
                   </div>
               )}

               <div className="absolute bottom-2 right-2 text-[10px] bg-paper-100/90 dark:bg-gray-900/90 px-1.5 py-1 rounded border border-ink-900/20 font-mono text-ink-900 dark:text-paper-100 z-20 shadow-sm">
                   <span className="text-ink-500 dark:text-paper-400">POS:</span> {currentZone.coordinates.x}, {currentZone.coordinates.y}
               </div>
          </div>
      );
  };

  // Calculate social anxiety from composure (inverse, 0-100)
  const socialAnxiety = Math.min(100, Math.max(0, 100 - (state.player.stats.composure || 100)));
  // Ensure malaise is a valid number
  const malaise = typeof state.player.stats.malaise === 'number' && !isNaN(state.player.stats.malaise)
    ? state.player.stats.malaise
    : 0;

  // Generate procedural description of James's current state
  const getJamesStateDescription = () => {
    const descriptions: string[] = [];

    // Malaise-based descriptions
    if (malaise >= 80) {
      descriptions.push("Your nerves are utterly frayed, each sound an assault upon your senses.");
    } else if (malaise >= 60) {
      descriptions.push("A persistent weariness settles behind your eyes; the crowds press too close.");
    } else if (malaise >= 40) {
      descriptions.push("A mild fatigue tinges the afternoon, though your faculties remain sharp.");
    } else if (malaise >= 20) {
      descriptions.push("You feel reasonably composed, alert to the pageant unfolding before you.");
    } else {
      descriptions.push("A rare equanimity possesses you; the world seems full of possibility.");
    }

    // Composure/Social anxiety descriptions
    if (socialAnxiety >= 70) {
      descriptions.push("Social encounters feel treacherous—each word a potential misstep.");
    } else if (socialAnxiety >= 40) {
      descriptions.push("You maintain your usual reserve, though conversation requires effort.");
    } else if (socialAnxiety < 20) {
      descriptions.push("An unusual confidence attends your movements through the throng.");
    }

    // Reputation-based
    const rep = state.player.stats.reputation || 50;
    if (rep >= 80) {
      descriptions.push("You sense admiring glances; your reputation precedes you.");
    } else if (rep <= 30) {
      descriptions.push("Certain circles seem to whisper as you pass.");
    }

    // Inspiration-based
    const insp = state.player.stats.inspiration || 0;
    if (insp >= 30) {
      descriptions.push("Your notebook brims with observations—material for the work to come.");
    } else if (insp >= 15) {
      descriptions.push("Impressions accumulate; the writer's eye never rests.");
    }

    return descriptions.join(" ");
  };

  return (
    <div
      className={`w-screen flex opacity-100 z-10 flex-col overflow-hidden ${state.shake ? 'animate-shake' : ''} relative `}
      style={{
        height: '100dvh',
        minHeight: '-webkit-fill-available',
        // Outdoor: Time-aware sky gradient / Indoor: Warm brown interior
        background: isOutdoors
          ? `linear-gradient(180deg,
              ${timeColors.skyTop} 0%,
              ${timeColors.skyMid} 25%,
              ${timeColors.skyBottom} 50%,
              #2a2620 75%,
              #1a1814 100%)`
          : `linear-gradient(180deg,
              #5a4a3a 0%,
              #4a3a2a 30%,
              #3a2a1a 60%,
              #2a1a0a 100%)`,
        transition: 'background 0.8s ease-in-out',
      }}
    >
      {/* Paris 1889 Skyline - only show outdoors */}
      {isOutdoors && <ParisSkyline timeColors={timeColors} hour={state.gameTime.hour} minute={state.gameTime.minute} />}
      <div className="vignette z-40 pointer-events-none"></div>
      <div className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-500 ${flash ? 'opacity-80' : 'opacity-0'}`}></div>

      {/* Desktop Header Bar - click empty area to toggle panels */}
      <header
        className="hidden md:flex bg-slate-800 text-paper-100 px-4 py-2 items-center justify-between border-b-2 border-gold-600 z-20 shrink-0 cursor-pointer"
        onClick={(e) => {
          // Only toggle if clicking on the header itself, not buttons
          if (e.target === e.currentTarget) {
            setPanelsHidden(!panelsHidden);
          }
        }}
      >
          <div className="group flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <h1
                  onClick={() => setShowAbout(true)}
                  className="font-display brass-text text-xl font-bold tracking-wide cursor-pointer"
              >
                  Henry James Simulator: 1889
              </h1>
              {/* Elegant Brass Separator */}
              <span className="brass-divider"></span>
              {/* Date/Time Display */}
              <button
                  onClick={() => setShowDateModal(true)}
                  className="flex items-center gap-2 text-gold-300 hover:text-gold-100 transition-all duration-300"
              >
                  <span className="font-sans text-[14px] tracking-[0.12em] uppercase hover:tracking-[0.08em] transition-all duration-300">
                      {(() => {
                          const { day, month, year, hour, minute } = state.gameTime;
                          const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                          const ampm = hour >= 12 ? 'pm' : 'am';
                          const hour12 = hour % 12 || 12;
                          const minuteStr = minute.toString().padStart(2, '0');
                          return `${monthNames[month]} ${day}, ${year} · ${hour12}:${minuteStr}${ampm}`;
                      })()}
                  </span>
              </button>
          </div>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                  onClick={() => dispatch({type: 'OPEN_SKETCHBOOK'})}
                  className="group relative flex items-center gap-1.5 px-2.5 py-1.5 text-paper-400 hover:text-gold-400 text-[13px] font-sans font-medium tracking-wide transition-all duration-300 overflow-hidden"
              >
                  <span className="absolute inset-0 bg-gradient-to-r from-gold-600/0 via-gold-600/10 to-gold-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  <LucideImage size={14} className="transition-all duration-300 group-hover:scale-110 group-hover:text-gold-400" />
                  <span className="relative">Sketchbook</span>
                  {(state.gallery.length > 0 || state.metNpcs.length > 0) && (
                      <span className="ml-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-gold-600/20 text-gold-400 text-[10px] rounded-full font-medium border border-gold-600/30 group-hover:bg-gold-600/40 transition-colors duration-300">
                          {state.gallery.length + state.metNpcs.length}
                      </span>
                  )}
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
              <button
                  onClick={() => dispatch({ type: 'OPEN_JOURNAL' })}
                  className="group relative flex items-center gap-1.5 px-2.5 py-1.5 text-paper-400 hover:text-purple-300 text-[13px] font-sans font-medium tracking-wide transition-all duration-300 overflow-hidden"
              >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  <LucideBookOpen size={14} className="transition-all duration-300 group-hover:scale-110 group-hover:text-purple-400" />
                  <span className="relative">Journal</span>
                  {state.eventState.discoveredPhrases.length > 0 && (
                      <span className="ml-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-purple-600/20 text-purple-300 text-[10px] rounded-full font-medium border border-purple-500/30 group-hover:bg-purple-600/40 transition-colors duration-300">
                          {state.eventState.discoveredPhrases.length}
                      </span>
                  )}
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
              <button
                  onClick={() => dispatch({ type: 'OPEN_MUSING_MODE' })}
                  className="group relative flex items-center gap-1.5 px-2.5 py-1.5 text-paper-400 hover:text-indigo-300 text-[13px] font-sans font-medium tracking-wide transition-all duration-300 overflow-hidden"
              >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/15 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  <LucidePenTool size={14} className="transition-all duration-300 group-hover:rotate-[-12deg] group-hover:scale-110 group-hover:text-indigo-400" />
                  <span className="relative">Write</span>
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
              <div className="w-px h-4 bg-paper-700/40 mx-1.5"></div>
              <a
                  href="https://resobscura.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-1.5 px-2.5 py-1.5 text-paper-400 hover:text-rose-300 text-[13px] font-sans font-medium tracking-wide transition-all duration-300 overflow-hidden"
              >
                  <span className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/15 to-rose-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  <LucideHeart size={14} className="transition-all duration-300 group-hover:scale-125 group-hover:text-rose-400" />
                  <span className="relative">Donate</span>
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
              <button
                  onClick={() => setShowAbout(true)}
                  className="group relative flex items-center gap-1.5 px-2.5 py-1.5 text-paper-400 hover:text-paper-200 text-[13px] font-sans font-medium tracking-wide transition-all duration-300 overflow-hidden"
              >
                  <span className="absolute inset-0 bg-gradient-to-r from-paper-500/0 via-paper-500/10 to-paper-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  <LucideHelpCircle size={14} className="transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  <span className="relative">About</span>
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-paper-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
              <button
                  onClick={() => dispatch({ type: 'TOGGLE_MUTE' })}
                  className={`group relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                      state.audio.muted
                          ? 'text-rose-400/70 hover:text-rose-300'
                          : 'text-paper-400 hover:text-gold-400'
                  }`}
                  title={state.audio.muted ? 'Sound Off' : 'Sound On'}
              >
                  <span className={`absolute inset-0 rounded-full transition-all duration-300 ${
                      state.audio.muted
                          ? 'bg-rose-500/0 group-hover:bg-rose-500/20'
                          : 'bg-gold-500/0 group-hover:bg-gold-500/10'
                  }`}></span>
                  {state.audio.muted
                      ? <LucideVolumeX size={16} className="relative transition-transform duration-200 group-hover:scale-110" />
                      : <LucideVolume2 size={16} className="relative transition-transform duration-200 group-hover:scale-110" />
                  }
              </button>
              <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="group relative flex items-center justify-center w-8 h-8 rounded-full text-paper-400 hover:text-paper-200 transition-all duration-300"
              >
                  <span className="absolute inset-0 rounded-full bg-paper-500/0 group-hover:bg-paper-500/10 transition-all duration-300"></span>
                  <LucideSettings size={16} className="relative transition-transform duration-500 group-hover:rotate-90" />
              </button>
          </div>
      </header>

      {/* Settings Dropdown */}
      {showSettings && (
          <div className="hidden md:block absolute top-14 right-4 bg-paper-100 dark:bg-gray-800 border-2 border-gold-600 rounded-lg shadow-2xl p-4 z-50 w-72 animate-fade-in">
              <h3 className="font-display text-lg text-ink-900 dark:text-paper-100 mb-4 border-b border-gold-600/30 pb-2">Settings</h3>
              <div className="space-y-4">
                  <div>
                      <label className="block text-sm font-bold text-ink-700 dark:text-gray-300 mb-2">Text Size</label>
                      <input
                          type="range"
                          min="0.8"
                          max="1.4"
                          step="0.1"
                          value={textSizeMultiplier}
                          onChange={(e) => setTextSizeMultiplier(parseFloat(e.target.value))}
                          className="w-full accent-gold-600"
                      />
                      <div className="flex justify-between text-xs text-ink-500 mt-1">
                          <span>Smaller</span>
                          <span>{Math.round(textSizeMultiplier * 100)}%</span>
                          <span>Larger</span>
                      </div>
                  </div>
                  <div className="flex items-center justify-between">
                      <span className="text-sm text-ink-700 dark:text-gray-300">Dark Mode</span>
                      <button
                          onClick={() => dispatch({type: 'TOGGLE_THEME'})}
                          className={`w-12 h-6 rounded-full transition-colors ${state.settings.darkMode ? 'bg-gold-600' : 'bg-gray-300'} relative`}
                      >
                          <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform ${state.settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                      </button>
                  </div>
                  <div className="flex items-center justify-between">
                      <span className="text-sm text-ink-700 dark:text-gray-300">Audio</span>
                      <button
                          onClick={() => dispatch({type: 'TOGGLE_MUTE'})}
                          className={`w-12 h-6 rounded-full transition-colors ${!state.audio.muted ? 'bg-gold-600' : 'bg-gray-300'} relative`}
                      >
                          <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform ${!state.audio.muted ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                      </button>
                  </div>
                  {/* Dev Tools Section */}
                  <div className="pt-3 mt-3 border-t border-gold-600/30">
                      <span className="text-[10px] text-ink-500 dark:text-gray-500 uppercase tracking-wider">Developer</span>
                      <button
                          onClick={() => { setShowResponsiveTest(true); setShowSettings(false); }}
                          className="mt-2 w-full flex items-center gap-2 px-3 py-2 bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 text-ink-700 dark:text-paper-300 rounded text-sm transition-colors"
                      >
                          <span>📱</span>
                          Responsive Test Panel
                      </button>
                  </div>
              </div>
              <button
                  onClick={() => setShowSettings(false)}
                  className="mt-4 w-full py-2 bg-ink-900 text-gold-500 rounded font-display text-sm hover:bg-gold-600 hover:text-white transition-colors"
              >
                  Close
              </button>
          </div>
      )}

      {/* Mobile header bar */}
      <MobileHeader onShowAbout={() => setShowAbout(true)} />

      <main
        className={`flex-1 grid grid-cols-1 md:grid-cols-[minmax(280px,360px)_1fr_minmax(280px,360px)] lg:grid-cols-[minmax(320px,400px)_1fr_minmax(320px,400px)] gap-2 md:gap-3 p-2 md:p-3 max-w-[1900px] mx-auto w-full z-10 overflow-hidden transition-transform duration-500 ease-in-out ${panelsHidden ? 'translate-y-[calc(100%-60px)]' : 'translate-y-0'}`}
      >
          {/* LEFT COLUMN - Hidden on mobile, scrollable */}
          <div className="hidden md:flex flex-col gap-3 h-full overflow-y-auto overflow-x-hidden">
              {/* Portrait Card - Victorian Design */}
              <div
                className="bg-gradient-to-br from-paper-100 via-paper-50 to-paper-100 dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 border-2 border-gold-500/60 dark:border-gray-600 rounded-lg shadow-md p-3 flex gap-3 shrink-0 cursor-pointer hover:shadow-xl hover:border-gold-500 transition-all duration-300 group relative overflow-hidden"
                onClick={() => dispatch({ type: 'OPEN_PLAYER_MODAL' })}
              >
                  {/* Corner decorations */}
                  <svg className="absolute top-0 left-0 w-6 h-6 text-gold-500/40 dark:text-gold-600/30" viewBox="0 0 24 24" fill="none">
                      <path d="M0 8 L0 0 L8 0" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      <path d="M0 4 L4 0" stroke="currentColor" strokeWidth="1" fill="none"/>
                  </svg>
                  <svg className="absolute top-0 right-0 w-6 h-6 text-gold-500/40 dark:text-gold-600/30" viewBox="0 0 24 24" fill="none">
                      <path d="M24 8 L24 0 L16 0" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      <path d="M24 4 L20 0" stroke="currentColor" strokeWidth="1" fill="none"/>
                  </svg>
                  <svg className="absolute bottom-0 left-0 w-6 h-6 text-gold-500/40 dark:text-gold-600/30" viewBox="0 0 24 24" fill="none">
                      <path d="M0 16 L0 24 L8 24" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      <path d="M0 20 L4 24" stroke="currentColor" strokeWidth="1" fill="none"/>
                  </svg>
                  <svg className="absolute bottom-0 right-0 w-6 h-6 text-gold-500/40 dark:text-gold-600/30" viewBox="0 0 24 24" fill="none">
                      <path d="M24 16 L24 24 L16 24" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      <path d="M24 20 L20 24" stroke="currentColor" strokeWidth="1" fill="none"/>
                  </svg>
                  {/* Portrait with Victorian frame effect */}
                  <div
                      className="w-28 h-32 bg-ink-900 dark:bg-black border-2 border-gold-500 dark:border-gold-500 flex items-center justify-center overflow-hidden relative shrink-0 group-hover:border-gold-400 transition-all duration-400 ease-out rounded-sm"
                      style={{
                        boxShadow: '0 0 12px rgba(212,168,75,0.4), 0 0 4px rgba(232,200,108,0.3), 0 4px 12px rgba(0,0,0,0.4)',
                      }}
                      onMouseEnter={() => setPortraitHovered(true)}
                      onMouseLeave={() => setPortraitHovered(false)}
                  >
                      {/* Outer frame bevel */}
                      <div className="absolute inset-0 border border-gold-400/20 dark:border-gold-500/15 pointer-events-none transition-all duration-400 group-hover:border-gold-400/40" style={{ margin: '2px' }}></div>
                      <AsciiPortrait mood={getMood()} speaking={isSpeaking} hatOff={!state.player.equippedClothing.hat} pinceNez={state.player.equippedClothing.pinceNez} blinkNow={portraitHovered} className="scale-[1.1] transition-transform duration-400 ease-out group-hover:scale-[1.12]" />
                      {/* Victorian vignette effect - subtle */}
                      <div className="absolute inset-0 pointer-events-none transition-opacity duration-400 group-hover:opacity-70" style={{
                          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0.4) 100%)'
                      }}></div>
                      {/* Inner shadow for depth */}
                      <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] pointer-events-none group-hover:shadow-[inset_0_0_12px_rgba(0,0,0,0.35)] transition-all duration-400"></div>
                      {/* Subtle warm tint overlay */}
                      <div className="absolute inset-0 bg-amber-800/5 pointer-events-none mix-blend-multiply"></div>
                  </div>
                  {/* Info & Meters */}
                  <div className="flex-1 flex flex-col justify-between py-0">
                      <div>
                          <span className="block text-gold-600/80 dark:text-gold-500/70 text-[9px] tracking-[0.2em] uppercase mb-0.5" style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 500 }}>The Author</span>
                          <span className="block font-display text-ink-900 dark:text-paper-100 text-xl font-bold tracking-wide leading-tight">Henry James</span>
                          <div className="w-10 h-px bg-gradient-to-r from-gold-500/50 to-transparent mt-1 mb-1.5"></div>
                          {/* Status effect tags */}
                          <div className="flex flex-wrap gap-1">
                              {state.player.isSitting && (
                                  <span className="inline-block px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-[10px] font-mono uppercase tracking-wider rounded border border-amber-300 dark:border-amber-700 animate-pulse">
                                      Seated
                                  </span>
                              )}
                              {state.player.activeEffects.map(effect => {
                                  // Determine label and color based on consumable type
                                  const name = effect.sourceName.toLowerCase();
                                  let label = 'Affected';
                                  let colorClasses = 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';

                                  if (name.includes('coffee') || name.includes('café') || name.includes('tea') || name.includes('chocolat')) {
                                      label = 'Caffeinated';
                                      colorClasses = 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border-amber-400 dark:border-amber-600';
                                  } else if (name.includes('absinthe')) {
                                      label = 'Green Fairy';
                                      colorClasses = 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border-emerald-400 dark:border-emerald-600';
                                  } else if (name.includes('champagne')) {
                                      label = 'Effervescent';
                                      colorClasses = 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 border-yellow-400 dark:border-yellow-600';
                                  } else if (name.includes('cognac') || name.includes('brandy')) {
                                      label = 'Warmed';
                                      colorClasses = 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 border-orange-400 dark:border-orange-600';
                                  } else if (name.includes('wine') || name.includes('bordeaux')) {
                                      label = 'Tipsy';
                                      colorClasses = 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 border-rose-400 dark:border-rose-600';
                                  } else if (name.includes('laudanum')) {
                                      label = 'Dulled';
                                      colorClasses = 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 border-purple-400 dark:border-purple-600';
                                  } else if (name.includes('salt')) {
                                      label = 'Invigorated';
                                      colorClasses = 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300 border-cyan-400 dark:border-cyan-600';
                                  } else if (name.includes('croissant') || name.includes('oyster') || name.includes('pâté') || name.includes('cheese') || name.includes('macaron')) {
                                      label = 'Sated';
                                      colorClasses = 'bg-lime-100 dark:bg-lime-900/50 text-lime-800 dark:text-lime-300 border-lime-400 dark:border-lime-600';
                                  }

                                  return (
                                      <span
                                          key={effect.id}
                                          className={`inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded border ${colorClasses}`}
                                          title={`${effect.sourceName}${effect.stackCount > 1 ? ` (x${effect.stackCount})` : ''}`}
                                      >
                                          {label}{effect.stackCount > 1 ? ` x${effect.stackCount}` : ''}
                                      </span>
                                  );
                              })}
                          </div>
                      </div>
                      {/* Triple Meters - Health, Composure, Malaise */}
                      <div className="space-y-1">
                          {/* Health */}
                          <div className="group/health relative">
                              <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-mono text-ink-500 dark:text-gray-400 uppercase tracking-wide">Health</span>
                                  <span className="text-[11px] font-mono text-ink-700 dark:text-gray-300">{state.player.stats.health}/{state.player.stats.maxHealth}</span>
                              </div>
                              <div className="relative w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                      className={`h-full rounded-full transition-all duration-300 group-hover/health:brightness-110 ${state.player.isOnFire ? 'animate-pulse' : ''}`}
                                      style={{
                                          width: `${(state.player.stats.health / state.player.stats.maxHealth) * 100}%`,
                                          background: state.player.stats.health > 60 ? '#ef4444' : state.player.stats.health > 30 ? '#f97316' : '#7f1d1d',
                                          boxShadow: state.player.stats.health > 60
                                              ? '0 0 4px rgba(239, 68, 68, 0.5), 0 0 8px rgba(239, 68, 68, 0.25)'
                                              : state.player.stats.health > 30
                                              ? '0 0 4px rgba(249, 115, 22, 0.5), 0 0 8px rgba(249, 115, 22, 0.25)'
                                              : '0 0 4px rgba(127, 29, 29, 0.5), 0 0 8px rgba(127, 29, 29, 0.25)',
                                          animation: state.player.isOnFire ? 'none' : 'meter-glow-pulse 2.5s ease-in-out infinite'
                                      }}
                                  />
                                  {/* Fire overlay when burning */}
                                  {state.player.isOnFire && (
                                      <div
                                          className="absolute inset-0 rounded-full animate-pulse"
                                          style={{
                                              background: 'linear-gradient(90deg, #ff4500 0%, #ff6b35 25%, #ff4500 50%, #ff6b35 75%, #ff4500 100%)',
                                              backgroundSize: '200% 100%',
                                              animation: 'fire-flicker 0.3s ease-in-out infinite'
                                          }}
                                      />
                                  )}
                                  {/* Subtle traveling highlight */}
                                  <div
                                      className="absolute inset-0 pointer-events-none rounded-full"
                                      style={{
                                          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                                          backgroundSize: '200% 100%',
                                          animation: 'meter-shimmer 4s ease-in-out infinite'
                                      }}
                                  />
                              </div>
                              {/* Tooltip */}
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover/health:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                                  <div className="bg-gray-900 text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      {state.player.isOnFire ? '🔥 ON FIRE! Find water!' : 'Physical wellbeing - death at 0'}
                                  </div>
                              </div>
                          </div>
                          {/* Composure */}
                          <div className="group/composure relative">
                              <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-mono text-ink-500 dark:text-gray-400 uppercase tracking-wide">Composure</span>
                                  <span className="text-[11px] font-mono text-ink-700 dark:text-gray-300">{100 - socialAnxiety}%</span>
                              </div>
                              <div className="relative w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                      className="h-full rounded-full transition-all duration-300 group-hover/composure:brightness-110"
                                      style={{
                                          width: `${100 - socialAnxiety}%`,
                                          background: socialAnxiety < 30 ? '#4ade80' : socialAnxiety < 60 ? '#facc15' : '#ef4444',
                                          boxShadow: socialAnxiety < 30
                                              ? '0 0 4px rgba(74, 222, 128, 0.5), 0 0 8px rgba(74, 222, 128, 0.25)'
                                              : socialAnxiety < 60
                                              ? '0 0 4px rgba(250, 204, 21, 0.5), 0 0 8px rgba(250, 204, 21, 0.25)'
                                              : '0 0 4px rgba(239, 68, 68, 0.5), 0 0 8px rgba(239, 68, 68, 0.25)',
                                          animation: 'meter-glow-pulse 3s ease-in-out infinite'
                                      }}
                                  />
                                  {/* Subtle traveling highlight */}
                                  <div
                                      className="absolute inset-0 pointer-events-none rounded-full"
                                      style={{
                                          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                                          backgroundSize: '200% 100%',
                                          animation: 'meter-shimmer 5s ease-in-out infinite'
                                      }}
                                  />
                                  {/* Subtle highlight on hover */}
                                  <div
                                      className="absolute inset-0 rounded-full opacity-0 group-hover/composure:opacity-100 transition-opacity duration-300 pointer-events-none"
                                      style={{
                                          width: `${100 - socialAnxiety}%`,
                                          background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 60%)',
                                          animation: 'meter-hover-pulse 1.5s ease-in-out infinite'
                                      }}
                                  />
                              </div>
                              {/* Tooltip */}
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover/composure:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                                  <div className="bg-gray-900 text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      Poise in social situations
                                  </div>
                              </div>
                          </div>
                          {/* Malaise */}
                          <div className="group/malaise relative">
                              <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-mono text-ink-500 dark:text-gray-400 uppercase tracking-wide">Malaise</span>
                                  <span className="text-[11px] font-mono text-ink-700 dark:text-gray-300">{malaise}%</span>
                              </div>
                              <div className="relative w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                      className="h-full rounded-full transition-all duration-300 group-hover/malaise:brightness-110"
                                      style={{
                                          width: `${malaise}%`,
                                          background: malaise < 40 ? '#4ade80' : malaise < 70 ? '#facc15' : '#ef4444',
                                          boxShadow: malaise < 40
                                              ? '0 0 4px rgba(74, 222, 128, 0.5), 0 0 8px rgba(74, 222, 128, 0.25)'
                                              : malaise < 70
                                              ? '0 0 4px rgba(250, 204, 21, 0.5), 0 0 8px rgba(250, 204, 21, 0.25)'
                                              : '0 0 4px rgba(239, 68, 68, 0.5), 0 0 8px rgba(239, 68, 68, 0.25)',
                                          animation: 'meter-glow-pulse 3.5s ease-in-out infinite',
                                          animationDelay: '0.5s'
                                      }}
                                  />
                                  {/* Subtle traveling highlight */}
                                  <div
                                      className="absolute inset-0 pointer-events-none rounded-full"
                                      style={{
                                          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                                          backgroundSize: '200% 100%',
                                          animation: 'meter-shimmer 6s ease-in-out infinite',
                                          animationDelay: '1.5s'
                                      }}
                                  />
                                  {/* Subtle highlight on hover */}
                                  <div
                                      className="absolute inset-0 rounded-full opacity-0 group-hover/malaise:opacity-100 transition-opacity duration-300 pointer-events-none"
                                      style={{
                                          width: `${malaise}%`,
                                          background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 60%)',
                                          animation: 'meter-hover-pulse 1.5s ease-in-out infinite',
                                          animationDelay: '0.2s'
                                      }}
                                  />
                              </div>
                              {/* Tooltip */}
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover/malaise:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                                  <div className="bg-gray-900 text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                      Mental fatigue and overstimulation
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Tabbed Panel */}
              <div className="bg-gradient-to-br from-paper-100 via-paper-50 to-paper-100 dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 border-2 border-gold-500/40 dark:border-gray-600 rounded-lg shadow-md flex flex-col flex-1 overflow-hidden min-h-0 relative">
                  {/* Corner decorations */}
                  <svg className="absolute top-0 left-0 w-5 h-5 text-gold-500/30 dark:text-gold-600/20 z-10" viewBox="0 0 24 24" fill="none">
                      <path d="M0 8 L0 0 L8 0" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                  <svg className="absolute top-0 right-0 w-5 h-5 text-gold-500/30 dark:text-gold-600/20 z-10" viewBox="0 0 24 24" fill="none">
                      <path d="M24 8 L24 0 L16 0" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                  <svg className="absolute bottom-0 left-0 w-5 h-5 text-gold-500/30 dark:text-gold-600/20 z-10" viewBox="0 0 24 24" fill="none">
                      <path d="M0 16 L0 24 L8 24" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                  <svg className="absolute bottom-0 right-0 w-5 h-5 text-gold-500/30 dark:text-gold-600/20 z-10" viewBox="0 0 24 24" fill="none">
                      <path d="M24 16 L24 24 L16 24" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                  <div className="flex border-b border-gold-600/25 dark:border-gray-700 shrink-0 bg-gradient-to-b from-paper-50 to-paper-100 dark:from-gray-800 dark:to-gray-850">
                      {(['PROFILE', 'INVENTORY', 'AMBIENCE'] as const).map((tab, index) => {
                          const isActive = activeTab === tab;
                          return (
                              <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`panel-tab flex-1 py-2 px-2 flex justify-center items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] relative group
                                    ${isActive
                                        ? 'text-ink-800 dark:text-gold-400 font-semibold bg-paper-50/50 dark:bg-gray-700/30'
                                        : 'text-ink-400 dark:text-gray-500 font-medium hover:text-ink-600 dark:hover:text-gray-300 hover:bg-gradient-to-b hover:from-paper-200/60 hover:to-paper-100/30 dark:hover:from-gray-700/40 dark:hover:to-gray-800/20'
                                    }
                                    ${index < 2 ? 'border-r border-gold-600/20 dark:border-gray-700/40' : ''}`}
                                style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}
                              >
                                  <span className={`${isActive ? 'text-gold-600 dark:text-gold-400' : 'text-ink-300 dark:text-gray-600'}`}>
                                      {tab === 'PROFILE' && <LucideUser size={13} />}
                                      {tab === 'INVENTORY' && <LucideBackpack size={13} />}
                                      {tab === 'AMBIENCE' && <LucideSettings size={13} />}
                                  </span>
                                  <span>{tab}</span>
                                  {isActive ? (
                                      <div className="tab-active-underline absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-gold-500/60 via-gold-600 to-gold-500/60 dark:from-gold-600/60 dark:via-gold-500 dark:to-gold-600/60 rounded-full" />
                                  ) : (
                                      <div className="absolute bottom-0 left-1/2 right-1/2 h-[2px] bg-gold-400/50 rounded-full opacity-0 group-hover:opacity-60 group-hover:left-6 group-hover:right-6 transition-all duration-300 ease-out" />
                                  )}
                              </button>
                          );
                      })}
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 min-h-0">
                      {renderTabContent()}
                  </div>
              </div>
          </div>

          {/* CENTER COLUMN - Full width on mobile, spans 2 columns during combat */}
          <div className={`flex flex-col relative gap-2 h-full min-w-0 ${state.gameState === GameState.COMBAT ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}>
               {/* Zone header - hidden on mobile for more space */}
               <div
                   onClick={() => setShowLocationModal(true)}
                   className="hidden md:flex brass-header-bar text-gold-500 px-4 py-1.5 text-sm font-display font-bold items-center gap-4 tracking-wide shrink-0 transition-all duration-300 cursor-pointer"
               >
                   <span className="brass-text shrink-0">{state.zones[state.player.currentZoneId].name.toUpperCase()}</span>
                   <span className="text-sm font-serif text-gold-300/70 italic font-normal truncate flex-1">{state.zones[state.player.currentZoneId].description}</span>
                   <span className="text-[11px] font-mono text-gold-400/60 shrink-0 tracking-widest">{state.zones[state.player.currentZoneId].biome}</span>
               </div>
               <div className="flex-1  bg-paper-200 dark:bg-black border-[8px] border-double border-gold-600 shadow-2xl rounded-sm overflow-hidden relative min-h-0">
                   <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] z-10"></div>
                   <div className={`absolute inset-0 z-0 ${state.gameState === GameState.DIALOGUE ? 'flex flex-col' : 'flex items-center justify-center p-2 md:p-4'}`}>
                        {state.introDialogueOpen ? (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                                <div className="bg-paper-100 dark:bg-gray-800 border-4 border-gold-600 p-8 max-w-lg w-full shadow-2xl rounded-lg relative max-h-[80vh] overflow-y-auto">
                                    <button onClick={() => dispatch({ type: 'CLOSE_INTRO' })} className="absolute top-4 right-4 text-ink-400 hover:text-red-500 active:scale-90 transition-transform z-10"><LucideX size={20} /></button>

                                    {/* Scenario Title */}
                                    <h3 className="text-center text-xs uppercase tracking-[0.3em] text-gold-600 mb-4 font-display">{state.openingScenario.title}</h3>

                                    {/* DIALOGUE TYPE - with portrait and speaker */}
                                    {state.openingScenario.type === 'dialogue' && state.openingScenario.lines && (
                                        <>
                                            <div className="flex items-start gap-6 mb-6">
                                                <div className="shrink-0 w-32 h-40 border-2 border-gold-600 shadow-lg overflow-hidden bg-ink-900 relative">
                                                    {state.openingScenario.historicalFigureId ? (
                                                        <>
                                                            <img
                                                                src={`/portraits/historical/${state.openingScenario.historicalFigureId}.jpg`}
                                                                alt={state.openingScenario.speaker || ''}
                                                                className="w-full h-full object-cover sepia-[0.3] contrast-[1.1]"
                                                            />
                                                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/30" />
                                                            <div className="absolute top-1 right-1 bg-gold-600 text-ink-900 text-[8px] px-1 rounded font-bold">★</div>
                                                        </>
                                                    ) : (
                                                        <Portrait archetype={(state.openingScenario.speakerArchetype || 'gentleman') as PortraitArchetype} size="md" emotion="neutral" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h2 className="font-display text-2xl text-ink-900 dark:text-gold-500 mb-1">{state.openingScenario.speaker}</h2>
                                                    <div className="h-0.5 w-12 bg-gold-600 mb-3"></div>
                                                    <p className="font-serif text-lg italic text-ink-700 dark:text-paper-200">"{state.openingScenario.lines[dialogueStep]}"</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                {dialogueStep < state.openingScenario.lines.length - 1 ? (
                                                    <button onClick={() => setDialogueStep(s => s + 1)} className="flex items-center gap-2 px-4 py-2 bg-ink-900 text-gold-500 font-display text-sm rounded hover:bg-ink-800 active:scale-95 transition-all">CONTINUE <LucideArrowRight size={16}/></button>
                                                ) : (
                                                    <button onClick={() => dispatch({ type: 'CLOSE_INTRO' })} className="px-6 py-2 bg-ink-900 hover:bg-gold-500 active:bg-gold-600 text-gold-500 hover:text-ink-900 border border-gold-600 rounded font-display text-sm tracking-wider transition-all duration-150 shadow-md flex items-center gap-2">{state.openingScenario.exitButtonText}</button>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* INTERNAL TYPE - prose passages, slower reveal */}
                                    {state.openingScenario.type === 'internal' && state.openingScenario.passages && (
                                        <>
                                            <div className="space-y-4 mb-6">
                                                {state.openingScenario.passages.slice(0, dialogueStep + 1).map((passage, idx) => (
                                                    <p
                                                        key={idx}
                                                        className={`font-serif text-base leading-relaxed animate-fade-in ${
                                                            passage.style === 'italic' ? 'italic text-ink-500 dark:text-paper-400' :
                                                            passage.style === 'fragment' ? 'text-ink-400 dark:text-paper-500 text-sm' :
                                                            passage.style === 'memory' ? 'italic text-amber-700 dark:text-amber-400 border-l-2 border-amber-500 pl-3' :
                                                            'text-ink-700 dark:text-paper-200'
                                                        }`}
                                                    >
                                                        {passage.text}
                                                    </p>
                                                ))}
                                            </div>
                                            <div className="flex justify-end">
                                                {dialogueStep < state.openingScenario.passages.length - 1 ? (
                                                    <button onClick={() => setDialogueStep(s => s + 1)} className="flex items-center gap-2 px-4 py-2 bg-ink-900 text-gold-500 font-display text-sm rounded hover:bg-ink-800 active:scale-95 transition-all">CONTINUE <LucideArrowRight size={16}/></button>
                                                ) : (
                                                    <button onClick={() => dispatch({ type: 'CLOSE_INTRO' })} className="px-6 py-2 bg-ink-900 hover:bg-gold-500 active:bg-gold-600 text-gold-500 hover:text-ink-900 border border-gold-600 rounded font-display text-sm tracking-wider transition-all duration-150 shadow-md flex items-center gap-2">{state.openingScenario.exitButtonText}</button>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* MONTAGE TYPE - rapid fragments with dramatic pacing and page breaks */}
                                    {state.openingScenario.type === 'montage' && state.openingScenario.passages && (() => {
                                        // Find the page break index
                                        const pageBreakIdx = state.openingScenario.passages!.findIndex(p => p.style === 'pageBreak');
                                        const hasPageBreak = pageBreakIdx !== -1;
                                        const isOnSecondPage = hasPageBreak && dialogueStep > pageBreakIdx;

                                        // Filter passages for current page (exclude pageBreak markers)
                                        const visiblePassages = state.openingScenario.passages!
                                            .slice(0, dialogueStep + 1)
                                            .filter(p => p.style !== 'pageBreak');

                                        // If we're past the page break, only show passages after it
                                        const currentPagePassages = isOnSecondPage
                                            ? state.openingScenario.passages!
                                                .slice(pageBreakIdx + 1, dialogueStep + 1)
                                                .filter(p => p.style !== 'pageBreak')
                                            : visiblePassages;

                                        return (
                                            <>
                                                <div className="space-y-3 mb-6 min-h-[120px]">
                                                    {currentPagePassages.map((passage, idx) => (
                                                        <p
                                                            key={`${isOnSecondPage ? 'p2' : 'p1'}-${idx}`}
                                                            className={`font-serif leading-relaxed animate-fade-in ${
                                                                passage.style === 'italic' ? 'italic text-ink-600 dark:text-paper-300 text-base' :
                                                                passage.style === 'fragment' ? 'text-ink-400 dark:text-paper-500 text-sm font-light tracking-wide' :
                                                                'text-ink-700 dark:text-paper-200 text-base'
                                                            }`}
                                                        >
                                                            {passage.text}
                                                        </p>
                                                    ))}
                                                </div>
                                                <div className="flex justify-end">
                                                    {dialogueStep < state.openingScenario.passages!.length - 1 ? (
                                                        <button onClick={() => setDialogueStep(s => s + 1)} className="flex items-center gap-2 px-4 py-2 bg-ink-900 text-gold-500 font-display text-sm rounded hover:bg-ink-800 active:scale-95 transition-all">CONTINUE <LucideArrowRight size={16}/></button>
                                                    ) : (
                                                        <button onClick={() => dispatch({ type: 'CLOSE_INTRO' })} className="px-6 py-2 bg-ink-900 hover:bg-gold-500 active:bg-gold-600 text-gold-500 hover:text-ink-900 border border-gold-600 rounded font-display text-sm tracking-wider transition-all duration-150 shadow-md flex items-center gap-2">{state.openingScenario.exitButtonText}</button>
                                                    )}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        ) : null}
                        {state.gameState === GameState.COMBAT ? <CombatView /> : state.gameState === GameState.DIALOGUE ? <DialogueView /> : state.gameState === GameState.MINIGAME_TELEGRAPH ? <MinigameTelegraph /> : state.gameState === GameState.MINIGAME_CURATOR ? <MinigameCurator /> : state.gameState === GameState.MINIGAME_FLANEUR ? <MinigameFlaneur /> : (
                          <div className="relative w-full h-full">
                            <OverworldMap />
                            {showTutorial && (
                              <TutorialOverlay onDismiss={() => setShowTutorial(false)} />
                            )}
                          </div>
                        )}
                   </div>
               </div>
               <BottomStatBar onInventoryClick={() => dispatch({ type: 'OPEN_PLAYER_MODAL' })} inline={true} />
          </div>

          {/* RIGHT COLUMN - Hidden on mobile and during combat */}
          <div className={`hidden ${state.gameState === GameState.COMBAT ? '' : 'md:flex'} flex-col gap-4 relative overflow-hidden h-full`}>
              {/* NPC Panel - Covers full sidebar during dialogue/combat */}
              <div className={`absolute inset-0 bg-paper-100 dark:bg-gray-800 border-l-4 border-gold-600 shadow-2xl transition-transform duration-500 z-30 p-4 flex flex-col gap-3 overflow-y-auto ${isSpeaking && activeNPC ? 'translate-x-0' : 'translate-x-[110%]'}`}>
                   {activeNPC && (
                       <>
                           {/* Large Portrait - consistent with NpcModal */}
                           <div className="w-full aspect-[4/5] bg-ink-900 border-4 border-double border-gold-600 flex items-center justify-center shadow-inner overflow-hidden">
                               <NpcPortrait
                                   npc={activeNPC}
                                   mood={isNpcTyping ? "SPEAKING" : isSpeaking ? "SPEAKING" : "NEUTRAL"}
                                   speaking={isSpeaking}
                                   speakingFrame={speakingFrame}
                                   size="full"
                                   showBorder={false}
                               />
                           </div>

                           {/* Collapsed Info Header - always visible */}
                           <div className="bg-paper-200 dark:bg-gray-700 rounded border border-ink-900/20">
                               <div className="p-3 text-center">
                                   <h2 className="font-display text-xl font-bold text-ink-900 dark:text-gold-500">{activeNPC.name}</h2>
                                   <p className="text-base text-ink-500 dark:text-gray-400 italic">{activeNPC.profession}</p>
                               </div>

                               {/* Expand/Collapse Button */}
                               <button
                                   onClick={() => setNpcInfoExpanded(!npcInfoExpanded)}
                                   className="w-full py-2 px-3 border-t border-ink-200 dark:border-gray-600 flex items-center justify-center gap-2 text-sm text-ink-500 dark:text-gray-400 hover:bg-paper-300 dark:hover:bg-gray-600 transition-colors"
                               >
                                   {npcInfoExpanded ? <LucideChevronUp size={16} /> : <LucideChevronDown size={16} />}
                                   <span>{npcInfoExpanded ? 'Less info' : 'More info'}</span>
                               </button>

                               {/* Expanded Content */}
                               {npcInfoExpanded && (
                                   <div className="p-4 pt-2 border-t border-ink-200 dark:border-gray-600 animate-fade-in">
                                       {/* NPC Sprite */}
                                       <div className="w-20 h-28 mx-auto mb-3 bg-gradient-to-br from-paper-300 to-paper-400 dark:from-gray-600 dark:to-gray-700 rounded border border-ink-200 dark:border-gray-500 flex items-center justify-center overflow-hidden">
                                           <div className="transform scale-[2.2]">
                                               <NpcSprite npc={activeNPC} direction="S" />
                                           </div>
                                       </div>

                                       {activeNPC.nationality && (
                                           <p className="text-center text-sm text-ink-400 dark:text-gray-500 mb-2">{activeNPC.nationality}</p>
                                       )}

                                       {activeNPC.historicalNote && (
                                           <>
                                               <div className="w-16 h-0.5 bg-gold-500 mx-auto my-2 opacity-40"></div>
                                               <p className="font-serif italic text-sm text-ink-600 dark:text-paper-200 text-center mb-3">{activeNPC.historicalNote}</p>
                                           </>
                                       )}

                                       <div className="text-sm text-ink-600 dark:text-gray-300 space-y-1.5">
                                           {activeNPC.birthplace && (
                                               <p><span className="font-semibold text-ink-700 dark:text-gray-200">Born:</span> {activeNPC.birthplace.city}{activeNPC.birthplace.region ? `, ${activeNPC.birthplace.region}` : ''}{activeNPC.birthplace.country !== 'France' ? `, ${activeNPC.birthplace.country}` : ''}</p>
                                           )}
                                           {activeNPC.currentResidence && (
                                               <p><span className="font-semibold text-ink-700 dark:text-gray-200">Resides:</span> {activeNPC.currentResidence.city}{activeNPC.currentResidence.country !== 'France' ? `, ${activeNPC.currentResidence.country}` : ''}</p>
                                           )}
                                           {activeNPC.age && (
                                               <p><span className="font-semibold text-ink-700 dark:text-gray-200">Age:</span> {activeNPC.age} years</p>
                                           )}
                                           {activeNPC.goal && (
                                               <p className="mt-2 pt-2 border-t border-ink-200 dark:border-gray-600"><span className="font-semibold text-ink-700 dark:text-gray-200">Current interest:</span> <span className="italic">{activeNPC.goal}</span></p>
                                           )}
                                       </div>
                                       {activeNPC.description && (
                                           <p className="mt-3 pt-3 border-t border-ink-200 dark:border-gray-600 text-sm text-ink-500 dark:text-gray-400 font-serif leading-relaxed">{activeNPC.description}</p>
                                       )}
                                   </div>
                               )}
                           </div>
                       </>
                   )}
              </div>
              <style>{`
                  @keyframes tab-underline-in {
                      from { transform: scaleX(0); opacity: 0; }
                      to { transform: scaleX(1); opacity: 1; }
                  }
                  .tab-active-underline {
                      animation: tab-underline-in 0.25s ease-out forwards;
                      transform-origin: center;
                  }
                  .panel-tab {
                      transition: all 0.15s ease;
                  }
                  .panel-tab:active {
                      transform: scale(0.98);
                  }
              `}</style>
              <div className="h-[28%] bg-paper-50 dark:bg-gray-900 border border-ink-200 dark:border-gray-700 rounded-lg shadow-md flex flex-col overflow-hidden relative min-h-0">
                   <div className="flex border-b border-gold-600/30 dark:border-gray-700 shrink-0 bg-gradient-to-b from-paper-100 to-paper-50 dark:from-gray-800 dark:to-gray-850">
                       {['CHRONICLE', 'MAP', 'OBSERVE'].map((tab, index) => {
                           const isActive = activeRightTab === tab;
                           return (
                               <button
                                   key={tab}
                                   onClick={() => setActiveRightTab(tab as any)}
                                   className={`panel-tab flex-1 py-2 px-2 flex justify-center items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] relative group
                                       ${isActive
                                           ? 'text-ink-800 dark:text-gold-400 font-semibold bg-paper-50/50 dark:bg-gray-700/30'
                                           : 'text-ink-400 dark:text-gray-500 font-medium hover:text-ink-600 dark:hover:text-gray-300 hover:bg-gradient-to-b hover:from-paper-200/60 hover:to-paper-100/30 dark:hover:from-gray-700/40 dark:hover:to-gray-800/20'}
                                       ${index < 2 ? 'border-r border-gold-600/20 dark:border-gray-700/40' : ''}`}
                                   style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}
                               >
                                    <span className={`${isActive ? 'text-gold-600 dark:text-gold-400' : 'text-ink-300 dark:text-gray-600'}`}>
                                        {tab === 'CHRONICLE' && <LucideBookOpen size={13}/>}
                                        {tab === 'MAP' && <LucideCompass size={13}/>}
                                        {tab === 'OBSERVE' && <LucideEye size={13}/>}
                                    </span>
                                    <span>{tab}</span>
                                    {isActive ? (
                                        <div className="tab-active-underline absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-gold-500/60 via-gold-600 to-gold-500/60 dark:from-gold-600/60 dark:via-gold-500 dark:to-gold-600/60 rounded-full" />
                                    ) : (
                                        <div className="absolute bottom-0 left-1/2 right-1/2 h-[2px] bg-gold-400/50 rounded-full opacity-0 group-hover:opacity-60 group-hover:left-6 group-hover:right-6 transition-all duration-300 ease-out" />
                                    )}
                               </button>
                           );
                       })}
                   </div>
                   <div className="flex-1 overflow-hidden relative bg-paper-100 dark:bg-gray-900/50">
                        {activeRightTab === 'CHRONICLE' && (
                            <div className="h-full p-2">
                                <div ref={logRef} className="h-full overflow-y-auto p-3 space-y-3 text-sm leading-relaxed scrollbar-thin bg-white dark:bg-gray-800 shadow-md relative rounded-sm border border-ink-200/50 dark:border-gray-700">
                                    {/* Subtle parchment texture */}
                                    <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none rounded-sm"></div>
                                {state.log.map((entry) => {
                                    const isSystemMessage = entry.type === 'SYSTEM' || entry.type === 'VISION' || entry.type === 'COMBAT';
                                    return (
                                        <div key={entry.id} className={`animate-fade-in relative pl-3 ${entry.type === 'COMBAT' ? 'text-red-800 dark:text-red-400' : isSystemMessage ? 'text-gold-700 dark:text-gold-400' : 'text-ink-800 dark:text-paper-300'}`}>
                                            <div className={`absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full ${entry.type === 'COMBAT' ? 'bg-red-500' : entry.type === 'VISION' ? 'bg-purple-500' : isSystemMessage ? 'bg-gold-500' : 'bg-gold-400'}`}></div>
                                            <p className={isSystemMessage ? 'font-sans text-xs' : 'font-serif italic'}>
                                                <RichText text={entry.text} npcs={state.npcs} onNpcClick={(id) => dispatch({ type: 'HIGHLIGHT_ENTITY', payload: id })} />
                                                {entry.type === 'NARRATIVE' && Math.random() > 0.7 && <button onClick={() => dispatch({ type: 'SET_FACT_CHECK', payload: entry.text })} className="ml-1 text-gold-600 hover:text-gold-800 align-middle opacity-50 hover:opacity-100"><LucideHelpCircle size={10} /></button>}
                                            </p>
                                        </div>
                                    );
                                })}
                                </div>
                            </div>
                        )}
                        {activeRightTab === 'MAP' && renderOverworldMap()}
                        {activeRightTab === 'OBSERVE' && (
                            <div className="h-full flex flex-col p-4 items-center justify-center bg-paper-100 dark:bg-gray-800">
                                {state.zones[state.player.currentZoneId].observedImage ? (
                                    <div className="w-full h-full flex flex-col">
                                        <div className="flex-1 border-4 border-double border-ink-900 shadow-inner overflow-hidden bg-black relative">
                                            <img src={state.zones[state.player.currentZoneId].observedImage} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" alt="Observation"/>
                                        </div>
                                        <p className="text-center text-xs italic text-ink-500 mt-2 font-serif">Captured in memory.</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="mb-4 text-sm text-ink-600 font-serif italic max-w-xs">"One must attempt to catch the color of the air..."</p>
                                        <button onClick={handleObserve} disabled={observing} className="brass-btn-base brass-btn-md font-display flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed">
                                            {observing ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-ink-900 border-t-transparent rounded-full animate-spin"></div>
                                                    <span>OBSERVING...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <LucideEye />
                                                    <span>CAPTURE SCENE</span>
                                                </>
                                            )}
                                        </button>
                                        {observing && <p className="text-xs text-gray-500 mt-2 italic text-center">Rendering impressionist vision...</p>}
                                    </div>
                                )}
                            </div>
                        )}
                   </div>
              </div>
              <div className="flex-1 border border-ink-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md shrink-0 min-h-0">
                  <NarratorPanel />
              </div>
          </div>
      </main>

      {/* Mobile controls - only shown on small screens */}
      <MobileControls />

      {/* Modals */}
      <FactChecker />
      <GalleryModal />
      <PlayerModal />
      <SupportModal />
      <AboutModal show={showAbout} onClose={() => setShowAbout(false)} />
      <JournalModal />
      <SketchbookModal />
      <WorksModal />
      <WriteMode />

      {/* Kiosk Modal - for purchasing consumables */}
      {state.showKioskModal && (
        <KioskModal onClose={() => dispatch({ type: 'HIDE_KIOSK_MODAL' })} />
      )}

      {/* Exhibit Closeup Modal - for examining display cases */}
      {state.showExhibitModal && state.exhibitModalData && (
        <ExhibitCloseupModal onClose={() => {
          dispatch({ type: 'HIDE_EXHIBIT_MODAL' });
          // Apply effects after viewing exhibit
          if (Math.random() < 0.45) {
            dispatch({ type: 'GAIN_INSPIRATION', payload: { amount: 1, source: 'Examining exhibits' } });
          }
          dispatch({ type: 'ADVANCE_TIME', payload: 10 });
        }} />
      )}

      {/* Historical Date Info Modal */}
      {showDateModal && (
          <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in"
              onClick={() => setShowDateModal(false)}
          >
              <div
                  className="bg-paper-100 dark:bg-gray-800 border-4 border-gold-600 rounded-lg shadow-2xl max-w-lg w-full p-6 relative"
                  onClick={(e) => e.stopPropagation()}
              >
                  <button
                      onClick={() => setShowDateModal(false)}
                      className="absolute top-4 right-4 text-ink-400 hover:text-ink-900 dark:hover:text-paper-100 transition-colors"
                  >
                      <LucideX size={20} />
                  </button>

                  {/* Date Header */}
                  <div className="text-center mb-6">
                      <div className="text-gold-600 font-sans font-light text-xs tracking-[0.2em] uppercase mb-2">
                          {(() => {
                              const { day, month, year } = state.gameTime;
                              const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                              const baseDate = new Date(1889, 4, 6);
                              const currentDate = new Date(year, month - 1, day);
                              const diffDays = Math.floor((currentDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
                              return dayNames[(1 + diffDays) % 7];
                          })()}
                      </div>
                      <h2 className="font-display text-3xl text-ink-900 dark:text-paper-100 font-bold">
                          {(() => {
                              const { day, month, year } = state.gameTime;
                              const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                              return `${monthNames[month]} ${day}, ${year}`;
                          })()}
                      </h2>
                      <div className="w-24 h-0.5 bg-gold-500 mx-auto mt-3"></div>
                  </div>

                  {/* Historical Context */}
                  <div className="space-y-4 text-sm">
                      <div className="bg-paper-200 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-gold-500">
                          <h3 className="font-display font-bold text-ink-900 dark:text-paper-100 mb-2">The Exposition Universelle</h3>
                          <p className="font-serif italic text-ink-700 dark:text-paper-300 leading-relaxed">
                              {(() => {
                                  const { day, month } = state.gameTime;
                                  if (month === 5 && day === 6) {
                                      return "Opening day! President Sadi Carnot inaugurates the fair before 500,000 visitors. The Eiffel Tower—tallest structure ever built—opens its first two levels to the public.";
                                  } else if (month === 5 && day <= 15) {
                                      return "The early days of the Exposition. Crowds marvel at Edison's phonograph, the Gallery of Machines, and Buffalo Bill's Wild West show on the fairgrounds.";
                                  } else if (month === 5) {
                                      return "Late May at the fair. The novelty has not worn off—over 100,000 visitors daily climb the Eiffel Tower. The cafés and restaurants do brisk business.";
                                  } else if (month === 6) {
                                      return "Summer arrives at the Exposition. The Colonial Exhibition draws controversy and fascination. Evening illuminations transform the grounds into a wonderland of electric light.";
                                  } else if (month === 7) {
                                      return "High summer. The heat drives visitors to seek shade in the galleries. The centennial of the Revolution approaches, bringing renewed patriotic fervor.";
                                  } else if (month === 8 && day >= 5 && day <= 10) {
                                      return "The International Congress of Physiological Psychology convenes at the Sorbonne. William James is among the honored guests, alongside Charcot, Ribot, and the leading minds of the new science of the mind.";
                                  } else if (month === 8) {
                                      return "August heat blankets Paris. The Congress of Psychology has drawn scholars from across Europe and America. The fair continues its spectacle of modern progress.";
                                  } else if (month === 9) {
                                      return "Autumn approaches. The crowds thin slightly as summer visitors depart, but the most discerning observers find this the ideal time to contemplate the exhibits.";
                                  } else if (month === 10) {
                                      return "October—the final weeks. Soon the temporary pavilions will be dismantled, but the Eiffel Tower will remain as Paris's new landmark.";
                                  }
                                  return "The Exposition Universelle continues, celebrating the centennial of the French Revolution and the achievements of modern industry.";
                              })()}
                          </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                              <div className="text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold mb-1">Time of Day</div>
                              <div className="font-serif text-ink-800 dark:text-paper-200">
                                  {(() => {
                                      const { hour } = state.gameTime;
                                      if (hour < 6) return "Deep night—the fair sleeps";
                                      if (hour < 9) return "Early morning—workers prepare";
                                      if (hour < 12) return "Morning—crowds gather";
                                      if (hour < 14) return "Midday—the fair bustles";
                                      if (hour < 17) return "Afternoon—peak attendance";
                                      if (hour < 20) return "Evening—electric lights ignite";
                                      return "Night—the fair glimmers";
                                  })()}
                              </div>
                          </div>
                          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded border border-amber-200 dark:border-amber-800">
                              <div className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold mb-1">Days at Fair</div>
                              <div className="font-serif text-ink-800 dark:text-paper-200">
                                  {(() => {
                                      const { day, month, year } = state.gameTime;
                                      // Base date is now August 5, 1889 (Congress of Psychology begins)
                                      const baseDate = new Date(1889, 7, 5);
                                      const currentDate = new Date(year, month - 1, day);
                                      const diffDays = Math.floor((currentDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
                                      return `Day ${diffDays + 1} of your visit`;
                                  })()}
                              </div>
                          </div>
                      </div>
                  </div>

                  <button
                      onClick={() => setShowDateModal(false)}
                      className="mt-6 w-full py-2 bg-ink-900 text-gold-500 rounded font-display text-sm hover:bg-gold-600 hover:text-ink-900 transition-colors"
                  >
                      Continue
                  </button>
              </div>
          </div>
      )}

      {/* Location Info Modal */}
      {showLocationModal && state.zones[state.player.currentZoneId] && (
        <LocationModal
          zone={state.zones[state.player.currentZoneId]}
          onClose={() => setShowLocationModal(false)}
        />
      )}

      {/* Elevator Modal */}
      <ElevatorModal
        isOpen={state.showElevatorModal}
        direction={state.elevatorDirection}
        fromLevel={state.elevatorFromLevel}
        onConfirm={(chosenDirection) => {
          // If user chose a direction (from first floor), update state first
          if (chosenDirection && state.elevatorDirection === 'both') {
            dispatch({ type: 'SHOW_ELEVATOR_MODAL', payload: { direction: chosenDirection, fromLevel: state.elevatorFromLevel } });
          }
          dispatch({ type: 'ELEVATOR_ARRIVE' });
        }}
        onCancel={() => dispatch({ type: 'HIDE_ELEVATOR_MODAL' })}
      />

      {/* Game Over Screen */}
      {state.gameState === GameState.GAME_OVER && (
        <GameOverScreen
          cause={state.gameOverCause || 'fall'}
          stats={{
            zonesVisited: Object.keys(state.zones).filter(id => state.zones[id].visited).length,
            npcsMet: state.npcs.length,
            itemsCollected: state.player.inventory.length
          }}
          onReturnToTitle={() => dispatch({ type: 'RESET_GAME' })}
        />
      )}

      {/* Event Choice Modal */}
      {state.gameState === GameState.EVENT_CHOICE && state.eventState.currentEvent && (
        <EventModal
          event={state.eventState.currentEvent}
          onClose={() => dispatch({ type: 'CLOSE_EVENT' })}
        />
      )}

      {/* Repartee Unlock Toast */}
      {state.cardUnlockToast && (
        <CardUnlockToast
          cardName={state.cardUnlockToast.cardName}
          description={state.cardUnlockToast.description}
          onDismiss={() => dispatch({ type: 'DISMISS_CARD_UNLOCK_TOAST' })}
        />
      )}

      {/* Floating Stat Change Indicators */}
      {state.recentStatChanges.length > 0 && (
        <FloatingStatIndicator
          changes={state.recentStatChanges}
          onRemove={(id) => dispatch({ type: 'REMOVE_STAT_CHANGE', payload: id })}
        />
      )}

      {/* Responsive Test Panel (Developer Tool) */}
      <ResponsiveTestPanel show={showResponsiveTest} onClose={() => setShowResponsiveTest(false)} />

      {state.zoneTransition?.active && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900 animate-[fadeIn_0.3s_ease-out]">
          <div className="text-center animate-[zoneReveal_1.5s_ease-out]">
            {/* Decorative line */}
            <div className="w-32 h-0.5 bg-gold-600 mx-auto mb-6 animate-[expandWidth_0.8s_ease-out]"></div>

            {/* Zone name */}
            <h1 className="font-display text-4xl md:text-6xl text-gold-500 mb-4 animate-[slideUp_0.6s_ease-out]">
              {state.zoneTransition.zoneName}
            </h1>

            {/* Zone description */}
            <p className="font-serif text-lg md:text-xl text-paper-200 max-w-xl mx-auto px-4 italic animate-[fadeIn_1s_ease-out_0.3s_both]">
              {state.zoneTransition.zoneDesc}
            </p>

            {/* Decorative line */}
            <div className="w-32 h-0.5 bg-gold-600 mx-auto mt-6 animate-[expandWidth_0.8s_ease-out_0.2s_both]"></div>

            {/* Loading dots */}
            <div className="mt-8 flex justify-center gap-2">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gold-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Animations now defined in tailwind.config.js */}
        </div>
      )}
    </div>
  );
};

export default GameLayout;
