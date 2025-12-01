
import React, { useEffect, useRef, useState } from 'react';
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
import { GameState, Mood, NPC } from '../types';
import { INTRO_TEXT, INTRO_DIALOGUE } from '../constants';
import { generateObservationPrompt, generateImpressionistImage } from '../services/geminiService';
import { LucideScroll, LucideHelpCircle, LucideVolume2, LucideVolumeX, LucideImage, LucideMoon, LucideSun, LucideUser, LucideMap, LucideFeather, LucideBackpack, LucideRadar, LucideFileText, LucideArrowRight, LucideX, LucideEye, LucideCamera, LucideTarget, LucideHeart, LucideSettings, LucideBookOpen, LucidePenTool } from 'lucide-react';

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
  const [showDateModal, setShowDateModal] = useState(false);
  const [textSizeMultiplier, setTextSizeMultiplier] = useState(1.0);

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
              // Close dialogue/combat by returning to exploring
              if (state.gameState === GameState.DIALOGUE) {
                  dispatch({ type: 'LEAVE_DIALOGUE' });
              }
          }
      };

      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
  }, [state.showPlayerModal, state.showSupportModal, state.gameState, dispatch]);

  const isSpeaking = state.gameState === GameState.DIALOGUE || state.gameState === GameState.COMBAT;
  const activeNPC = state.gameState === GameState.COMBAT ? state.combat?.opponent : state.gameState === GameState.DIALOGUE ? state.dialogue?.npc : null;

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
      <div className="h-screen w-screen flex items-center justify-center bg-paper-100 dark:bg-gray-900 p-4 md:p-8 text-center transition-colors duration-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50"></div>
        <div className="vignette"></div>
        <div className="max-w-2xl space-y-6 md:space-y-8 border-4 md:border-8 border-double border-gold-600 p-6 md:p-12 rounded-lg shadow-2xl bg-paper-50 dark:bg-gray-800 relative z-10 animate-fade-in">
          <h1 className="text-4xl md:text-7xl font-display text-ink-900 dark:text-gold-500 mb-4 tracking-tight text-glow">The Ambassadors: 1889</h1>
          <div className="w-32 h-1 bg-gold-500 mx-auto mb-8"></div>
          <div className="text-xl font-serif leading-relaxed whitespace-pre-line text-ink-400 dark:text-gray-400">
            {INTRO_TEXT}
          </div>
          <button 
            onClick={() => dispatch({ type: 'START_GAME' })}
            className="px-12 py-4 bg-ink-900 text-gold-500 font-display text-xl hover:bg-gold-600 hover:text-ink-900 transition-all shadow-lg mt-8 border-2 border-gold-500 hover:scale-105"
          >
            Begin Observation
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
      switch (activeTab) {
          case 'PROFILE':
              return (
                  <div className="animate-fade-in space-y-4">
                        {/* Procedural State Description */}
                        <div>
                            <h3 className="font-display text-ink-900 dark:text-paper-100 border-b-2 border-gold-600 mb-3 text-sm font-bold pb-1">
                                Current State of Mind
                            </h3>
                            <p className="text-sm font-serif italic text-ink-700 dark:text-paper-300 leading-relaxed bg-paper-50 dark:bg-gray-900 p-3 rounded border border-ink-200 dark:border-gray-700">
                                {getJamesStateDescription()}
                            </p>
                        </div>

                        {/* Attributes */}
                        <div>
                            <h3 className="font-display text-ink-900 dark:text-paper-100 border-b-2 border-gold-600 mb-3 text-sm font-bold pb-1">Attributes</h3>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-paper-200 dark:bg-gray-700 p-2 rounded-lg text-center border border-ink-900/10 shadow-sm">
                                    <div className="text-[10px] uppercase text-ink-500 dark:text-gray-400 mb-0.5 font-display tracking-wide">Wit</div>
                                    <div className="text-xl font-bold text-ink-900 dark:text-gold-500">{state.player.stats.wit}</div>
                                </div>
                                <div className="bg-paper-200 dark:bg-gray-700 p-2 rounded-lg text-center border border-ink-900/10 shadow-sm">
                                    <div className="text-[10px] uppercase text-ink-500 dark:text-gray-400 mb-0.5 font-display tracking-wide">Observation</div>
                                    <div className="text-xl font-bold text-ink-900 dark:text-gold-500">{state.player.stats.observation}</div>
                                </div>
                                <div className="bg-paper-200 dark:bg-gray-700 p-2 rounded-lg text-center border border-ink-900/10 shadow-sm">
                                    <div className="text-[10px] uppercase text-ink-500 dark:text-gray-400 mb-0.5 font-display tracking-wide">Decorum</div>
                                    <div className="text-xl font-bold text-ink-900 dark:text-gold-500">{state.player.stats.decorum}</div>
                                </div>
                            </div>
                        </div>

                        {/* Francs */}
                        <div className="flex items-center justify-between bg-gold-100 dark:bg-gold-900/20 p-2 rounded border border-gold-300 dark:border-gold-700">
                            <span className="text-sm font-display text-gold-800 dark:text-gold-400">Francs</span>
                            <span className="text-lg font-bold text-gold-700 dark:text-gold-300">{state.player.stats.money} ₣</span>
                        </div>
                  </div>
              );
          case 'INVENTORY':
              return (
                  <div className="h-full animate-fade-in">
                      <InventoryPanel
                          inventory={state.player.inventory}
                          playerMalaise={state.player.stats.malaise}
                          onUseForRelief={(itemId) => dispatch({ type: 'USE_ITEM_FOR_RELIEF', payload: itemId })}
                      />
                  </div>
              );
          case 'AMBIENCE':
              const localNpcs = state.npcs.filter(n => n.location.zoneId === state.player.currentZoneId);
              const currentZone = state.zones[state.player.currentZoneId];
              return (
                  <div className="space-y-4 animate-fade-in">
                      <div>
                          <h4 className="font-display text-sm font-bold text-gold-600 mb-2 border-b border-gold-600/30 pb-1">Notable Figures</h4>
                          {localNpcs.length === 0 ? <div className="text-sm italic text-gray-500">The area appears empty.</div> : (
                              <div className="space-y-1.5">
                                  {localNpcs.map(npc => (
                                      <div key={npc.id} className="bg-paper-50 dark:bg-gray-700 border-l-4 border-blue-500 p-2 rounded-r cursor-pointer hover:bg-paper-200 dark:hover:bg-gray-600 transition-colors" onClick={() => dispatch({ type: 'HIGHLIGHT_ENTITY', payload: npc.id })}>
                                          <span className="font-bold text-sm text-ink-900 dark:text-paper-100 block">{npc.name}</span>
                                          <span className="block text-xs text-ink-600 dark:text-gray-400">{npc.dialogueStyle.split(',')[0]}.</span>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                      <div>
                          <h4 className="font-display text-sm font-bold text-gold-600 mb-2 border-b border-gold-600/30 pb-1">Environment</h4>
                          <div className="text-sm text-ink-900 dark:text-paper-200 space-y-1">
                             <div>Crowd Density: <span className="font-bold">{state.crowd.filter(c => c.zoneId === state.player.currentZoneId).length * 10}%</span></div>
                             <div>Exits: <span className="font-bold">{currentZone.exits.map(e => e.direction).join(', ')}</span></div>
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
      const scale = 20;
      const width = (maxX - minX + 1) * scale;
      const height = (maxY - minY + 1) * scale;

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
                    {gridKeys.map(key => {
                        const [x, y] = key.split(',').map(Number);
                        const zId = state.zoneGrid[key];
                        const z = state.zones[zId];
                        let color = '#475569';
                        if (z.biome === 'GARDEN') color = '#4ade80'; 
                        if (z.biome === 'STREET') color = '#d97706'; 
                        if (z.biome === 'SALON') color = '#b91c1c'; 
                        if (z.biome === 'TOWER_LEVEL') color = '#2563eb'; 

                        const isCurrent = z.id === state.player.currentZoneId;
                        return (
                            <g key={key}>
                                <rect 
                                    x={x * scale + 2} 
                                    y={y * scale + 2} 
                                    width={scale - 4} 
                                    height={scale - 4} 
                                    fill={color} 
                                    opacity={isCurrent ? 1 : 0.5}
                                    rx="2"
                                    stroke={isCurrent ? 'gold' : 'none'}
                                    strokeWidth={isCurrent ? 1 : 0}
                                />
                                {isCurrent && (
                                    <circle cx={x*scale + scale/2} cy={y*scale + scale/2} r={2} fill="white" className="animate-pulse" opacity="0.8"/>
                                )}
                            </g>
                        );
                    })}
               </svg>
               <div className="absolute bottom-2 right-2 text-[10px] bg-paper-100/80 dark:bg-gray-900/80 p-1 rounded border border-ink-900/20 font-mono text-ink-900 dark:text-paper-100 z-20">
                   POS: {currentZone.coordinates.x}, {currentZone.coordinates.y}
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
      className={`h-screen w-screen flex flex-col bg-paper-800 dark:bg-gray-950 overflow-hidden ${state.shake ? 'animate-shake' : ''} relative transition-all duration-1000 scanlines`}
    >
      <div className="vignette z-40 pointer-events-none"></div>
      <div className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-500 ${flash ? 'opacity-80' : 'opacity-0'}`}></div>

      {/* Desktop Header Bar */}
      <header className="hidden md:flex bg-ink-900 text-paper-100 px-4 py-2 items-center justify-between border-b-2 border-gold-600 z-20 shrink-0">
          <div className="flex items-center gap-3">
              <h1
                  onClick={() => setShowAbout(true)}
                  className="font-display text-gold-500 text-xl font-bold tracking-wide cursor-pointer transition-all duration-300 hover:text-gold-300 hover:tracking-wider"
              >
                  The Ambassadors
              </h1>
              {/* Elegant Separator */}
              <span className="text-gold-600/40 text-lg font-light">|</span>
              {/* Date/Time Display */}
              <button
                  onClick={() => setShowDateModal(true)}
                  className="group flex items-center gap-2 text-paper-400 hover:text-paper-100 transition-all duration-300"
              >
                  <span className="font-sans font-light text-[11px] tracking-[0.15em] uppercase group-hover:tracking-[0.2em] transition-all duration-300">
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
          <div className="flex items-center gap-2">
              <button
                  onClick={() => dispatch({type: 'OPEN_SKETCHBOOK'})}
                  className="group flex items-center gap-2 px-3 py-1.5 bg-ink-800 hover:bg-gold-600 text-gold-400 hover:text-ink-900 rounded text-sm font-display transition-all duration-200 hover:shadow-lg hover:shadow-gold-600/20"
              >
                  <LucidePenTool size={14} className="transition-transform duration-200 group-hover:rotate-[-15deg]" /> Sketchbook
                  {(state.gallery.length > 0 || state.metNpcs.length > 0) && (
                      <span className="ml-1 px-1.5 py-0.5 bg-gold-600 group-hover:bg-ink-900 text-ink-900 group-hover:text-gold-500 text-[10px] rounded-full font-bold transition-colors duration-200">
                          {state.gallery.length + state.metNpcs.length}
                      </span>
                  )}
              </button>
              <button
                  onClick={() => dispatch({ type: 'OPEN_JOURNAL' })}
                  className="group flex items-center gap-2 px-3 py-1.5 bg-ink-800 hover:bg-purple-600 text-gold-400 hover:text-white rounded text-sm font-display transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/20"
              >
                  <LucideBookOpen size={14} className="transition-transform duration-200 group-hover:scale-110" /> Journal
                  {state.eventState.discoveredPhrases.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-purple-600 group-hover:bg-white text-white group-hover:text-purple-600 text-[10px] rounded-full transition-colors duration-200">
                          {state.eventState.discoveredPhrases.length}
                      </span>
                  )}
              </button>
              <div className="w-px h-6 bg-ink-700 mx-2"></div>
              <a
                  href="https://resobscura.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-3 py-1.5 bg-red-900 hover:bg-red-600 text-paper-100 rounded text-sm font-display transition-all duration-200 hover:shadow-lg hover:shadow-red-600/30"
              >
                  <LucideHeart size={14} className="transition-transform duration-200 group-hover:scale-125" /> Donate
              </a>
              <button
                  onClick={() => setShowAbout(true)}
                  className="group flex items-center gap-2 px-3 py-1.5 bg-ink-800 hover:bg-ink-700 text-paper-100 hover:text-gold-400 rounded text-sm font-display transition-all duration-200"
              >
                  <LucideHelpCircle size={14} className="transition-transform duration-200 group-hover:rotate-12" /> About
              </button>
              <button
                  onClick={() => dispatch({ type: 'TOGGLE_MUTE' })}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded text-sm font-display transition-all duration-200 ${
                      state.audio.muted
                          ? 'bg-red-900 hover:bg-red-700 text-paper-100'
                          : 'bg-ink-800 hover:bg-ink-700 text-gold-400 hover:text-gold-300'
                  }`}
                  title={state.audio.muted ? 'Sound Off' : 'Sound On'}
              >
                  {state.audio.muted ? <LucideVolumeX size={14} className="transition-transform duration-200 group-hover:scale-110" /> : <LucideVolume2 size={14} className="transition-transform duration-200 group-hover:scale-110" />}
              </button>
              <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="group flex items-center gap-2 px-3 py-1.5 bg-ink-800 hover:bg-ink-700 text-paper-100 hover:text-gold-400 rounded text-sm font-display transition-all duration-200"
              >
                  <LucideSettings size={14} className="transition-transform duration-300 group-hover:rotate-90" />
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

      <main className="flex-1 grid grid-cols-1 md:grid-cols-[400px_1fr_400px] gap-2 md:gap-3 p-2 md:p-3 max-w-[1900px] mx-auto w-full h-full z-10 overflow-hidden">
          {/* LEFT COLUMN - Hidden on mobile, scrollable */}
          <div className="hidden md:flex flex-col gap-3 h-full overflow-y-auto overflow-x-hidden">
              {/* Portrait Card - Clean Design */}
              <div
                className="bg-paper-100 dark:bg-gray-800 border border-ink-200 dark:border-gray-700 rounded-lg shadow-md p-3 flex gap-3 shrink-0 cursor-pointer hover:shadow-xl hover:border-gold-500/50 transition-all duration-300 group"
                onClick={() => dispatch({ type: 'OPEN_PLAYER_MODAL' })}
              >
                  {/* Portrait - smaller */}
                  <div className="w-28 h-32 bg-paper-50 dark:bg-gray-900 border-2 border-ink-200 dark:border-gray-700 flex items-center justify-center overflow-hidden relative shadow-inner shrink-0 group-hover:border-gold-500 group-hover:shadow-lg transition-all duration-300 rounded">
                      <AsciiPortrait mood={getMood()} speaking={isSpeaking} className="scale-[1.1] transition-transform duration-300 group-hover:scale-[1.15]" />
                      <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] pointer-events-none group-hover:shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300"></div>
                  </div>
                  {/* Info & Meters */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                          <span className="block font-bold text-gold-600 text-[10px] tracking-widest">THE AUTHOR</span>
                          <span className="block font-display text-ink-900 dark:text-paper-100 text-base font-bold leading-tight">HENRY JAMES</span>
                      </div>
                      {/* Dual Meters */}
                      <div className="space-y-1.5">
                          {/* Social Anxiety (from composure) */}
                          <div>
                              <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-mono text-ink-500 dark:text-gray-400 uppercase">Composure</span>
                                  <span className="text-[10px] font-bold text-ink-700 dark:text-gray-300">{100 - socialAnxiety}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                      className="h-full transition-all duration-500 rounded-full"
                                      style={{
                                          width: `${100 - socialAnxiety}%`,
                                          background: socialAnxiety < 30 ? '#4ade80' : socialAnxiety < 60 ? '#facc15' : '#ef4444'
                                      }}
                                  />
                              </div>
                          </div>
                          {/* Malaise */}
                          <div>
                              <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-mono text-ink-500 dark:text-gray-400 uppercase">Malaise</span>
                                  <span className="text-[10px] font-bold text-ink-700 dark:text-gray-300">{malaise}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                      className="h-full transition-all duration-500 rounded-full"
                                      style={{
                                          width: `${malaise}%`,
                                          background: malaise < 40 ? '#4ade80' : malaise < 70 ? '#facc15' : '#ef4444'
                                      }}
                                  />
                              </div>
                          </div>
                      </div>
                      <span className="text-[8px] text-ink-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">Click to inspect</span>
                  </div>
              </div>

              {/* Tabbed Panel - Clean Minimal Design */}
              <div className="bg-paper-100 dark:bg-gray-800 border border-ink-200 dark:border-gray-700 rounded-lg shadow-md flex flex-col flex-1 overflow-hidden min-h-0">
                  <div className="flex border-b border-ink-200 dark:border-gray-700 shrink-0">
                      {(['PROFILE', 'INVENTORY', 'AMBIENCE'] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 px-1 flex items-center justify-center gap-1.5 transition-all duration-200 text-[13px] font-sans uppercase tracking-wide relative group
                                ${activeTab === tab
                                    ? 'text-ink-900 dark:text-gold-500 font-semibold'
                                    : 'text-ink-400 dark:text-gray-500 hover:text-ink-700 dark:hover:text-gray-200 font-medium hover:bg-paper-200/50 dark:hover:bg-gray-700/50'
                                }`}
                          >
                              <span className={`transition-transform duration-200 ${activeTab !== tab ? 'group-hover:scale-110' : ''}`}>
                                  {tab === 'PROFILE' && <LucideUser size={13} />}
                                  {tab === 'INVENTORY' && <LucideBackpack size={13} />}
                                  {tab === 'AMBIENCE' && <LucideRadar size={13} />}
                              </span>
                              <span className="transition-all duration-200">{tab}</span>
                              {activeTab === tab ? (
                                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-red-800 dark:bg-gold-600 rounded-full transition-all duration-300" />
                              ) : (
                                  <div className="absolute bottom-0 left-1/2 right-1/2 h-0.5 bg-ink-300 dark:bg-gray-500 rounded-full opacity-0 group-hover:opacity-60 group-hover:left-4 group-hover:right-4 transition-all duration-300" />
                              )}
                          </button>
                      ))}
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 min-h-0">
                      {renderTabContent()}
                  </div>
              </div>
          </div>

          {/* CENTER COLUMN - Full width on mobile, spans 2 columns during combat */}
          <div className={`flex flex-col relative gap-2 h-full ${state.gameState === GameState.COMBAT ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}>
               <div className="bg-ink-900 text-gold-500 px-4 py-2 rounded-sm text-sm font-display font-bold shadow-lg border-b-4 border-gold-600 flex items-center gap-3 tracking-wide shrink-0">
                   <span className="shrink-0">{state.zones[state.player.currentZoneId].name.toUpperCase()}</span>
                   <span className="text-xs font-serif text-paper-100 italic font-normal truncate flex-1">{state.zones[state.player.currentZoneId].description}</span>
                   <span className="text-[10px] font-mono text-paper-300 shrink-0">{state.zones[state.player.currentZoneId].biome}</span>
               </div>
               <div className="flex-1 bg-paper-200 dark:bg-black border-[8px] border-double border-gold-600 shadow-2xl rounded-sm overflow-hidden relative min-h-0">
                   <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] z-10"></div>
                   <div className={`absolute inset-0 z-0 ${state.gameState === GameState.DIALOGUE ? 'flex flex-col' : 'flex items-center justify-center p-4 pb-40 md:pb-4'}`}>
                        {state.introDialogueOpen ? (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in pb-40 md:pb-0">
                                <div className="bg-paper-100 dark:bg-gray-800 border-4 border-gold-600 p-8 max-w-md w-full shadow-2xl rounded-lg relative max-h-[80vh] overflow-y-auto">
                                    <button onClick={() => dispatch({ type: 'CLOSE_INTRO' })} className="absolute top-4 right-4 text-ink-400 hover:text-red-500"><LucideX size={20} /></button>
                                    <div className="flex items-start gap-6 mb-6">
                                         <div className="shrink-0">
                                             <Portrait archetype="william_james" size="md" emotion="neutral" />
                                         </div>
                                         <div>
                                             <h2 className="font-display text-2xl text-ink-900 dark:text-gold-500 mb-1">{INTRO_DIALOGUE.speaker}</h2>
                                             <div className="h-0.5 w-12 bg-gold-600 mb-3"></div>
                                             <p className="font-serif text-lg italic text-ink-700 dark:text-paper-200">"{INTRO_DIALOGUE.lines[dialogueStep]}"</p>
                                         </div>
                                    </div>
                                    <div className="flex justify-end">
                                        {dialogueStep < INTRO_DIALOGUE.lines.length - 1 ? (
                                            <button onClick={() => setDialogueStep(s => s + 1)} className="flex items-center gap-2 px-4 py-2 bg-ink-900 text-gold-500 font-display text-sm rounded hover:bg-gold-600">CONTINUE <LucideArrowRight size={16}/></button>
                                        ) : (
                                            <button onClick={() => dispatch({ type: 'CLOSE_INTRO' })} className="flex items-center gap-2 px-4 py-2 bg-gold-600 text-ink-900 font-display text-sm rounded hover:bg-white font-bold shadow-lg">ENTER THE FAIR</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        {state.gameState === GameState.COMBAT ? <CombatView /> : state.gameState === GameState.DIALOGUE ? <DialogueView /> : state.gameState === GameState.MINIGAME_TELEGRAPH ? <MinigameTelegraph /> : state.gameState === GameState.MINIGAME_CURATOR ? <MinigameCurator /> : state.gameState === GameState.MINIGAME_FLANEUR ? <MinigameFlaneur /> : <OverworldMap />}
                   </div>
               </div>
               <BottomStatBar onInventoryClick={() => dispatch({ type: 'OPEN_PLAYER_MODAL' })} inline={true} />
          </div>

          {/* RIGHT COLUMN - Hidden on mobile and during combat */}
          <div className={`hidden ${state.gameState === GameState.COMBAT ? '' : 'md:flex'} flex-col gap-4 relative overflow-hidden h-full`}>
              {/* NPC Panel - Covers full sidebar during dialogue/combat */}
              <div className={`absolute inset-0 bg-paper-100 dark:bg-gray-800 border-l-4 border-gold-600 shadow-2xl transition-transform duration-500 z-30 p-4 flex flex-col gap-4 ${isSpeaking && activeNPC ? 'translate-x-0' : 'translate-x-[110%]'}`}>
                   {activeNPC && (
                       <>
                           <div className="w-full aspect-square bg-ink-900 border-4 border-double border-gold-600 flex items-center justify-center shadow-inner"><AsciiPortrait config={activeNPC.portrait} archetype={activeNPC.portraitArchetype} mood="NEUTRAL" speaking={isSpeaking} className="scale-[1.0]" /></div>
                           <div className="text-center bg-paper-200 dark:bg-gray-700 p-3 rounded border border-ink-900/20">
                               <h2 className="font-display text-lg font-bold text-ink-900 dark:text-gold-500">{activeNPC.name}</h2>
                               <div className="w-16 h-0.5 bg-ink-900 mx-auto my-2 opacity-20"></div>
                               <p className="font-serif italic text-xs text-ink-600 dark:text-paper-200">{activeNPC.historicalNote}</p>
                           </div>
                       </>
                   )}
              </div>
              <div className="h-[35%] bg-paper-50 dark:bg-gray-900 border border-ink-200 dark:border-gray-700 rounded-lg shadow-md flex flex-col overflow-hidden relative min-h-0">
                   <div className="flex border-b border-ink-200 dark:border-gray-700 bg-paper-100 dark:bg-gray-800 shrink-0">
                       {['CHRONICLE', 'MAP', 'OBSERVE'].map((tab) => (
                           <button
                               key={tab}
                               onClick={() => setActiveRightTab(tab as any)}
                               className={`flex-1 py-2 flex justify-center items-center gap-1.5 transition-all duration-200 text-[13px] font-sans uppercase tracking-wide relative group
                                   ${activeRightTab === tab
                                       ? 'text-ink-900 dark:text-gold-500 font-semibold'
                                       : 'text-ink-400 dark:text-gray-500 hover:text-ink-700 dark:hover:text-gray-200 font-medium hover:bg-paper-200/50 dark:hover:bg-gray-700/50'}`}
                           >
                                <span className={`transition-transform duration-200 ${activeRightTab !== tab ? 'group-hover:scale-110' : ''}`}>
                                    {tab === 'CHRONICLE' && <LucideFeather size={13}/>}
                                    {tab === 'MAP' && <LucideMap size={13}/>}
                                    {tab === 'OBSERVE' && <LucideCamera size={13}/>}
                                </span>
                                <span className="transition-all duration-200">{tab}</span>
                                {activeRightTab === tab ? (
                                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-red-800 dark:bg-gold-600 rounded-full transition-all duration-300" />
                                ) : (
                                    <div className="absolute bottom-0 left-1/2 right-1/2 h-0.5 bg-ink-300 dark:bg-gray-500 rounded-full opacity-0 group-hover:opacity-60 group-hover:left-4 group-hover:right-4 transition-all duration-300" />
                                )}
                           </button>
                       ))}
                   </div>
                   <div className="flex-1 overflow-hidden relative bg-paper-50/50 dark:bg-gray-900/50">
                        {activeRightTab === 'CHRONICLE' && (
                            <div ref={logRef} className="h-full overflow-y-auto p-3 space-y-3 text-sm leading-relaxed scrollbar-thin">
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
                                        <button onClick={handleObserve} disabled={observing} className="px-6 py-3 bg-gold-600 text-ink-900 font-display font-bold rounded shadow-lg hover:bg-gold-500 disabled:opacity-50 disabled:bg-gold-400 flex items-center gap-2 mx-auto transition-all">
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

      {/* Zone Transition Overlay */}
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

          {/* Transition animations */}
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes expandWidth {
              from { width: 0; }
              to { width: 8rem; }
            }
            @keyframes zoneReveal {
              0% { opacity: 0; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default GameLayout;
