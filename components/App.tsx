
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
import StatBar from './StatBar';
import PlayerModal from './PlayerModal';
import InventoryPanel from './InventoryPanel';
import SupportModal from './SupportModal';
import AboutModal from './AboutModal';
import MobileControls from './MobileControls';
import MobileHeader from './MobileHeader';
import ElevatorModal from './ElevatorModal';
import GameOverScreen from './GameOverScreen';
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
        <span className="text-base leading-relaxed">
            {parts.map((part, i) => {
                const npcMatch = foundNpcs.find(n => n.token === part);
                if (npcMatch) {
                    return (
                        <span 
                            key={i} 
                            onClick={() => onNpcClick(npcMatch.id)}
                            className="font-bold text-blue-700 dark:text-blue-300 cursor-pointer hover:underline hover:text-blue-500 transition-colors"
                            title="Click to Locate"
                        >
                            {npcMatch.name}
                        </span>
                    );
                }
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-bold text-ink-900 dark:text-white">{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={i} className="italic text-ink-700 dark:text-gray-300">{part.slice(1, -1)}</em>;
                }
                return <span key={i} className="text-ink-900 dark:text-gray-200">{part}</span>;
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
  const [textSizeMultiplier, setTextSizeMultiplier] = useState(1.0);

  const getMood = (): Mood => {
      if (state.gameState === GameState.COMBAT) return 'ANGRY';
      if (state.player.stats.malaise > 50) return 'SWEATING';
      if (state.player.hp < 30) return 'SAD';
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

  const handleObserve = async () => {
      if (observing) return;
      const zone = state.zones[state.player.currentZoneId];
      if (zone.observedImage) return;

      setObserving(true);
      const localNpcs = state.npcs.filter(n => n.location.zoneId === zone.id);
      const prompt = generateObservationPrompt(zone.name, zone.biome, zone.description, localNpcs);
      
      const imgUrl = await generateImpressionistImage(prompt);
      if (imgUrl) {
          dispatch({ type: 'CACHE_OBSERVATION', payload: { zoneId: zone.id, image: imgUrl } });
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
                        <div>
                            <h3 className="font-display text-ink-900 dark:text-paper-100 border-b-2 border-gold-600 mb-3 text-sm font-bold flex justify-between pb-1">
                                <span>Constitution</span>
                                <span className="text-gold-600">Lvl {state.player.level}</span>
                            </h3>
                            <StatBar label="Composure" value={state.player.hp} max={state.player.maxHp} color="bg-blue-700" />
                            <StatBar label="Malaise" value={state.player.stats.malaise} max={100} color="bg-red-800" />
                            <StatBar label="Experience" value={state.player.xp} max={100 * state.player.level} color="bg-gold-600" />
                        </div>

                        <div>
                            <h3 className="font-display text-ink-900 dark:text-paper-100 border-b-2 border-gold-600 mb-3 text-sm font-bold pb-1">Attributes</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-paper-200 dark:bg-gray-700 p-3 rounded-lg text-center border border-ink-900/10 shadow-sm">
                                    <div className="text-xs uppercase text-ink-500 dark:text-gray-400 mb-1 font-display tracking-wide">Wit</div>
                                    <div className="text-2xl font-bold text-ink-900 dark:text-gold-500">{state.player.stats.wit}</div>
                                </div>
                                <div className="bg-paper-200 dark:bg-gray-700 p-3 rounded-lg text-center border border-ink-900/10 shadow-sm">
                                    <div className="text-xs uppercase text-ink-500 dark:text-gray-400 mb-1 font-display tracking-wide">Observation</div>
                                    <div className="text-2xl font-bold text-ink-900 dark:text-gold-500">{state.player.stats.observation}</div>
                                </div>
                            </div>
                        </div>
                  </div>
              );
          case 'INVENTORY':
              return (
                  <div className="h-full animate-fade-in">
                      <InventoryPanel inventory={state.player.inventory} />
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

  // Calculate social anxiety (inverse of reputation, 0-100)
  const socialAnxiety = Math.min(100, Math.max(0, 100 - (state.player.stats.reputation || 50)));

  return (
    <div className={`h-screen w-screen flex flex-col bg-paper-800 dark:bg-gray-950 overflow-hidden ${state.shake ? 'animate-shake' : ''} relative transition-colors duration-500 scanlines`}>
      <div className="vignette z-40 pointer-events-none"></div>
      <div className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-500 ${flash ? 'opacity-80' : 'opacity-0'}`}></div>

      {/* Desktop Header Bar */}
      <header className="hidden md:flex bg-ink-900 text-paper-100 px-4 py-2 items-center justify-between border-b-2 border-gold-600 z-20 shrink-0">
          <div className="flex items-center gap-4">
              <h1 className="font-display text-gold-500 text-xl font-bold tracking-wide">The Ambassadors</h1>
              <span className="text-ink-400 text-sm font-serif italic">Paris, 1889</span>
          </div>
          <div className="flex items-center gap-2">
              <button
                  onClick={() => dispatch({type: 'OPEN_GALLERY'})}
                  className="flex items-center gap-2 px-3 py-1.5 bg-ink-800 hover:bg-ink-700 text-gold-400 rounded text-sm font-display transition-colors"
              >
                  <LucidePenTool size={14} /> Sketchbook
              </button>
              <button
                  onClick={() => setActiveTab('PROFILE')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-ink-800 hover:bg-ink-700 text-gold-400 rounded text-sm font-display transition-colors"
              >
                  <LucideBookOpen size={14} /> Journal
              </button>
              <div className="w-px h-6 bg-ink-700 mx-2"></div>
              <a
                  href="https://resobscura.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-900 hover:bg-red-800 text-paper-100 rounded text-sm font-display transition-colors"
              >
                  <LucideHeart size={14} /> Donate
              </a>
              <button
                  onClick={() => setShowAbout(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-ink-800 hover:bg-ink-700 text-paper-100 rounded text-sm font-display transition-colors"
              >
                  <LucideHelpCircle size={14} /> About
              </button>
              <button
                  onClick={() => dispatch({ type: 'TOGGLE_MUTE' })}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-display transition-colors ${
                      state.audio.muted
                          ? 'bg-red-900 hover:bg-red-800 text-paper-100'
                          : 'bg-ink-800 hover:bg-ink-700 text-gold-400'
                  }`}
                  title={state.audio.muted ? 'Sound Off' : 'Sound On'}
              >
                  {state.audio.muted ? <LucideVolumeX size={14} /> : <LucideVolume2 size={14} />}
              </button>
              <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-ink-800 hover:bg-ink-700 text-paper-100 rounded text-sm font-display transition-colors"
              >
                  <LucideSettings size={14} />
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
              {/* Portrait Card */}
              <div
                className="bg-paper-100 dark:bg-gray-800 border-4 border-double border-gold-600 rounded-lg shadow-xl p-3 flex flex-col items-center gap-2 shrink-0 cursor-pointer hover:scale-[1.01] transition-transform group"
                onClick={() => dispatch({ type: 'OPEN_PLAYER_MODAL' })}
              >
                  <div className="w-full h-44 bg-paper-50 dark:bg-gray-900 border-2 border-ink-200 dark:border-gray-700 flex items-center justify-center overflow-hidden relative shadow-inner shrink-0 group-hover:border-gold-500 transition-colors rounded">
                      <AsciiPortrait mood={getMood()} speaking={isSpeaking} className="scale-[1.4]" />
                      <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none"></div>
                      <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-ink-900 text-paper-100 text-[10px] px-1.5 py-0.5 rounded">INSPECT</div>
                  </div>
                  <div className="text-center w-full">
                      <span className="block font-bold text-gold-600 text-[16px] tracking-widest mb-0.5">THE AUTHOR</span>
                      <span className="block font-display text-ink-900 dark:text-paper-100 text-xl font-bold">HENRY JAMES</span>
                      {/* Social Anxiety Meter */}
                      <div className="mt-2 w-full">
                          <div className="flex justify-between items-center mb-1">
                              <span className="text-[14px] font-mono text-ink-600 dark:text-gray-400 uppercase tracking-wide">Social Anxiety</span>
                              <span className="text-md font-bold text-ink-800 dark:text-gray-200">{socialAnxiety}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                              <div
                                  className="h-full transition-all duration-500 rounded-full"
                                  style={{
                                      width: `${socialAnxiety}%`,
                                      background: socialAnxiety < 30 ? '#4ade80' : socialAnxiety < 60 ? '#facc15' : '#ef4444'
                                  }}
                              />
                          </div>
                          <div className="flex justify-between mt-0.5">
                              <span className="text-[12px] text-green-600  font-mono dark:text-green-400 font-medium">Calm</span>
                              <span className="text-[12px] text-red-600 font-mono dark:text-red-400 font-medium">Overwhelmed</span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Tabbed Panel - Redesigned */}
              <div className="bg-paper-100 dark:bg-gray-800 border-2 border-gold-600 rounded-lg shadow-lg flex flex-col flex-1 overflow-hidden min-h-0">
                  <div className="flex border-b-2 border-gold-600 bg-paper-200 dark:bg-gray-900 shrink-0">
                      {(['PROFILE', 'INVENTORY', 'AMBIENCE'] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 px-1 flex items-center font-mono justify-center gap-1 transition-all font-display text-sm 
                                ${activeTab === tab
                                    ? 'bg-paper-100 dark:bg-gray-800 text-gold-600 border-b-2 border-gold-500 -mb-[2px]'
                                    : 'text-ink-500 dark:text-gray-400 hover:bg-paper-300 dark:hover:bg-gray-700 hover:text-ink-700'
                                }`}
                          >
                              {tab === 'PROFILE' && <LucideUser size={14} />}
                              {tab === 'INVENTORY' && <LucideBackpack size={14} />}
                              {tab === 'AMBIENCE' && <LucideRadar size={14} />}
                              <span>{tab.charAt(0) + tab.slice(1).toLowerCase()}</span>
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
                   <span className="text-[10px] font-serif text-paper-200/60 italic font-normal truncate flex-1">{state.zones[state.player.currentZoneId].description}</span>
                   <span className="text-[10px] font-mono text-ink-400 shrink-0">{state.zones[state.player.currentZoneId].biome}</span>
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
               <div className="h-10 bg-paper-100 dark:bg-gray-800 text-ink-900 dark:text-paper-200 text-[10px] font-mono flex items-center px-4 justify-between rounded shadow border-t border-gold-600 uppercase tracking-widest shrink-0">
                   <span className="flex items-center gap-2"><span className="w-4 h-4 bg-ink-900 text-white rounded flex items-center justify-center">W</span> MOVE</span>
                   <span className="flex items-center gap-2"><span className="w-12 h-4 bg-ink-900 text-white rounded flex items-center justify-center">SPACE</span> INTERACT</span>
                   <span className="flex items-center gap-2"><span className="w-4 h-4 bg-ink-900 text-white rounded flex items-center justify-center">T</span> PONDER</span>
                   <span className="text-gold-600 font-bold">Turn {state.player.xp}</span>
               </div>
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
              <div className="h-[35%] bg-paper-50 dark:bg-gray-900 border-2 border-ink-900 dark:border-gray-700 rounded shadow-lg flex flex-col overflow-hidden relative min-h-0">
                   <div className="bg-ink-900 flex text-xs font-bold border-b-2 border-gold-600 shrink-0">
                       {['CHRONICLE', 'MAP', 'OBSERVE'].map((tab) => (
                           <button key={tab} onClick={() => setActiveRightTab(tab as any)} className={`flex-1 py-2 flex justify-center items-center gap-2 transition-colors ${activeRightTab === tab ? 'bg-gold-600 text-ink-900' : 'text-gold-500 hover:bg-ink-800'}`}>
                                {tab === 'CHRONICLE' && <LucideFeather size={12}/>}
                                {tab === 'MAP' && <LucideMap size={12}/>}
                                {tab === 'OBSERVE' && <LucideCamera size={12}/>}
                                {tab}
                           </button>
                       ))}
                   </div>
                   <div className="flex-1 overflow-hidden relative bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')]">
                        {activeRightTab === 'CHRONICLE' && (
                            <div ref={logRef} className="h-full overflow-y-auto p-4 space-y-4 font-serif text-lg leading-relaxed scrollbar-thin">
                                {state.log.map((entry) => (
                                    <div key={entry.id} className={`animate-fade-in relative pl-4 ${entry.type === 'COMBAT' ? 'text-red-900 dark:text-red-400' : 'text-ink-900 dark:text-paper-200'}`}>
                                        <div className={`absolute left-0 top-2 w-1 h-1 rounded-full ${entry.type === 'COMBAT' ? 'bg-red-500' : 'bg-gold-500'}`}></div>
                                        <p>
                                            <RichText text={entry.text} npcs={state.npcs} onNpcClick={(id) => dispatch({ type: 'HIGHLIGHT_ENTITY', payload: id })} />
                                            {Math.random() > 0.7 && <button onClick={() => dispatch({ type: 'SET_FACT_CHECK', payload: entry.text })} className="ml-1 text-gold-600 hover:text-gold-800 align-middle opacity-50 hover:opacity-100"><LucideHelpCircle size={12} /></button>}
                                        </p>
                                    </div>
                                ))}
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
              <div className="flex-1 border-2 border-gold-600 rounded overflow-hidden shadow-lg shrink-0 min-h-0">
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

      {/* Elevator Modal */}
      <ElevatorModal
        isOpen={state.showElevatorModal}
        direction={state.elevatorDirection}
        onConfirm={() => dispatch({ type: 'ELEVATOR_ARRIVE' })}
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
    </div>
  );
};

export default GameLayout;
