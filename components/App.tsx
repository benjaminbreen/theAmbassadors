
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
import StatBar from './StatBar';
import PlayerModal from './PlayerModal';
import InventoryPanel from './InventoryPanel';
import SupportModal from './SupportModal';
import AboutModal from './AboutModal';
import MobileControls from './MobileControls';
import MobileHeader from './MobileHeader';
import { GameState, Mood, NPC } from '../types';
import { INTRO_TEXT, INTRO_DIALOGUE } from '../constants';
import { generateObservationPrompt, generateImpressionistImage } from '../services/geminiService';
import { LucideScroll, LucideHelpCircle, LucideVolume2, LucideVolumeX, LucideImage, LucideMoon, LucideSun, LucideUser, LucideMap, LucideFeather, LucideBackpack, LucideRadar, LucideFileText, LucideArrowRight, LucideX, LucideEye, LucideCamera, LucideTarget, LucideHeart } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'PERSONA' | 'INVENTORY' | 'QUESTS' | 'JOURNAL' | 'AMBIENCE'>('PERSONA');
  const [activeRightTab, setActiveRightTab] = useState<'CHRONICLE' | 'MAP' | 'OBSERVE'>('CHRONICLE');
  const [dialogueStep, setDialogueStep] = useState(0);
  const [observing, setObserving] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const getMood = (): Mood => {
      if (state.gameState === GameState.COMBAT) return 'ANGRY';
      if (state.player.stats.malaise > 50) return 'SWEATING';
      if (state.player.hp < 30) return 'SAD';
      return 'NEUTRAL';
  };

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
          case 'PERSONA':
              return (
                  <div className="animate-fade-in">
                        <h3 className="font-display text-ink-900 dark:text-paper-100 border-b-2 border-gold-600 mb-5 text-base font-bold flex justify-between pb-2">
                            <span>CONSTITUTION</span>
                            <span className="text-gold-600">{state.player.level}</span>
                        </h3>
                        <StatBar label="Composure" value={state.player.hp} max={state.player.maxHp} color="bg-blue-700" />
                        <StatBar label="Malaise" value={state.player.stats.malaise} max={100} color="bg-red-800" />
                        <StatBar label="Experience" value={state.player.xp} max={100 * state.player.level} color="bg-gold-600" />

                        <h3 className="font-display text-ink-900 dark:text-paper-100 border-b-2 border-gold-600 mb-5 mt-8 text-base font-bold pb-2">ATTRIBUTES</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm font-mono text-ink-600 dark:text-paper-200">
                            <div className="bg-paper-200 dark:bg-gray-700 p-3 rounded text-center border border-ink-900/10">
                                <div className="text-xs uppercase text-ink-400 mb-1">Wit</div>
                                <div className="text-2xl font-bold text-ink-900 dark:text-gold-500">{state.player.stats.wit}</div>
                            </div>
                            <div className="bg-paper-200 dark:bg-gray-700 p-3 rounded text-center border border-ink-900/10">
                                <div className="text-xs uppercase text-ink-400 mb-1">Obs</div>
                                <div className="text-2xl font-bold text-ink-900 dark:text-gold-500">{state.player.stats.observation}</div>
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
          case 'QUESTS':
              return (
                  <div className="space-y-4 animate-fade-in">
                      <h3 className="font-display text-ink-900 dark:text-paper-100 border-b-2 border-gold-600 mb-5 text-base font-bold pb-2">LITERARY ENDEAVORS</h3>
                      {state.quests.map(quest => (
                          <div key={quest.id} className={`p-4 rounded-lg border-2 ${quest.completed ? 'bg-green-50 border-green-600 dark:bg-green-900/20' : 'bg-paper-200 dark:bg-gray-700 border-gold-600'}`}>
                              <div className="flex items-start justify-between gap-2 mb-3">
                                  <h4 className="font-display text-base font-bold text-ink-900 dark:text-paper-100 leading-tight">{quest.title}</h4>
                                  {quest.completed && <span className="text-sm font-bold text-green-600 dark:text-green-400">✓</span>}
                              </div>
                              <p className="text-sm text-ink-600 dark:text-gray-300 mb-3 leading-relaxed">{quest.description}</p>
                              <div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden mb-2">
                                  <div
                                      className={`h-full transition-all duration-500 ${quest.completed ? 'bg-green-600' : 'bg-gold-500'}`}
                                      style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                                  />
                              </div>
                              <div className="flex justify-between text-xs text-ink-500 dark:text-gray-400">
                                  <span className="font-mono">{quest.progress} / {quest.target}</span>
                                  {quest.reward && <span className="italic text-gold-600 font-medium">Reward: {quest.reward}</span>}
                              </div>
                          </div>
                      ))}
                  </div>
              );
          case 'JOURNAL':
               return (
                  <div className="space-y-3 animate-fade-in font-serif text-sm">
                      {state.journal.length === 0 ? (
                          <div className="text-center text-ink-400 italic mt-10 text-base">The pages are blank.</div>
                      ) : (
                          state.journal.map((entry, idx) => (
                              <div key={idx} className="p-3 bg-paper-50 dark:bg-gray-700 border-l-4 border-gold-600 rounded-r">
                                  <div className="font-bold text-base text-ink-900 dark:text-paper-100 mb-1">{entry.title}</div>
                                  <div className="text-xs text-ink-600 dark:text-gray-400 italic mb-2">{entry.date}</div>
                                  <div className="text-sm text-ink-800 dark:text-gray-300 leading-relaxed">{entry.content}</div>
                              </div>
                          ))
                      )}
                  </div>
              );
          case 'AMBIENCE':
              const localNpcs = state.npcs.filter(n => n.location.zoneId === state.player.currentZoneId);
              const currentZone = state.zones[state.player.currentZoneId];
              return (
                  <div className="space-y-4 animate-fade-in font-sans text-sm">
                      <div>
                          <h4 className="font-display text-xs font-bold text-gold-600 mb-1">NOTABLE FIGURES</h4>
                          {localNpcs.length === 0 ? <div className="text-xs italic text-gray-500">None</div> : (
                              localNpcs.map(npc => (
                                  <div key={npc.id} className="border-l-2 border-blue-500 pl-2 mb-2 cursor-pointer hover:bg-paper-200 dark:hover:bg-gray-700 transition-colors" onClick={() => dispatch({ type: 'HIGHLIGHT_ENTITY', payload: npc.id })}>
                                      <span className="font-bold text-ink-900 dark:text-paper-100 block">{npc.name}</span>
                                      <span className="block text-xs text-gray-500">{npc.dialogueStyle.split(',')[0]}</span>
                                  </div>
                              ))
                          )}
                      </div>
                      <div>
                          <h4 className="font-display text-xs font-bold text-gold-600 mb-1">ENVIRONMENT</h4>
                          <div className="text-ink-900 dark:text-paper-200">
                             Crowd Density: <span className="font-bold">{state.crowd.filter(c => c.zoneId === state.player.currentZoneId).length * 10}%</span>
                          </div>
                          <div className="text-ink-900 dark:text-paper-200 mt-1">
                             Exits: {currentZone.exits.map(e => e.direction).join(', ')}
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
                                    <circle cx={x*scale + scale/2} cy={y*scale + scale/2} r={2} fill="white" className="animate-ping"/>
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

  return (
    <div className={`h-screen w-screen flex flex-col bg-paper-800 dark:bg-gray-950 overflow-hidden ${state.shake ? 'animate-shake' : ''} relative transition-colors duration-500 scanlines`}>
      <div className="vignette z-40 pointer-events-none"></div>
      <div className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-500 ${flash ? 'opacity-80' : 'opacity-0'}`}></div>

      {/* Mobile header bar */}
      <MobileHeader onShowAbout={() => setShowAbout(true)} />

      <main className="flex-1 grid grid-cols-1 md:grid-cols-[380px_1fr_340px] gap-2 md:gap-4 p-2 md:p-4 max-w-[1900px] mx-auto w-full h-full z-10 overflow-hidden">
          {/* LEFT COLUMN - Hidden on mobile */}
          <div className="hidden md:flex flex-col gap-4 h-full">
              <div 
                className="bg-paper-100 dark:bg-gray-800 border-4 border-double border-gold-600 rounded shadow-xl p-4 flex flex-col items-center gap-2 shrink-0 cursor-pointer hover:scale-[1.02] transition-transform group"
                onClick={() => dispatch({ type: 'OPEN_PLAYER_MODAL' })}
              >
                  <div className="w-full h-40 bg-paper-50 dark:bg-gray-900 border-2 border-ink-200 dark:border-gray-700 flex items-center justify-center overflow-hidden relative shadow-inner shrink-0 group-hover:border-gold-500 transition-colors">
                      <AsciiPortrait mood={getMood()} speaking={isSpeaking} className="scale-[1.0]" />
                      <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none"></div>
                      <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-ink-900 text-paper-100 text-[10px] px-1 rounded">INSPECT</div>
                  </div>
                  <div className="text-center w-full">
                      <span className="block font-display text-gold-600 text-xs tracking-widest mb-1">THE AUTHOR</span>
                      <span className="block font-display text-ink-900 dark:text-paper-100 text-2xl font-bold">HENRY JAMES</span>
                  </div>
                  <div className="flex justify-center gap-4 w-full pt-2 border-t border-ink-900/10" onClick={e => e.stopPropagation()}>
                      <button onClick={() => dispatch({type: 'TOGGLE_THEME'})} className="p-1 hover:bg-paper-200 dark:hover:bg-gray-700 rounded transition-colors text-ink-600 dark:text-ink-400" title="Toggle Dark Mode"><LucideMoon size={16} /></button>
                      <button onClick={() => dispatch({type: 'TOGGLE_MUTE'})} className="p-1 hover:bg-paper-200 dark:hover:bg-gray-700 rounded transition-colors text-ink-600 dark:text-ink-400" title="Toggle Audio">{state.audio.muted ? <LucideVolumeX size={16} /> : <LucideVolume2 size={16} />}</button>
                      <a href="https://resobscura.substack.com/" target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-paper-200 dark:hover:bg-gray-700 rounded transition-colors text-red-600 dark:text-red-400" title="Support This Project">
                          <LucideHeart size={16} />
                      </a>
                  </div>
              </div>

              {/* Donate bar above tabs */}
              <div className="bg-gold-600 dark:bg-gold-700 px-3 py-2 rounded-t shadow-md flex justify-between items-center">
                  <span className="text-paper-100 text-xs font-display font-bold">SUPPORT THE PROJECT</span>
                  <div className="flex gap-2">
                      <a
                          href="https://resobscura.substack.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-paper-100 hover:bg-white text-gold-700 dark:text-gold-800 px-3 py-1 rounded text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
                      >
                          <LucideHeart size={12} />
                          DONATE
                      </a>
                      <button
                          onClick={() => setShowAbout(true)}
                          className="bg-ink-900 hover:bg-ink-800 text-gold-400 px-3 py-1 rounded text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
                      >
                          <LucideHelpCircle size={12} />
                          ABOUT
                      </button>
                  </div>
              </div>

              <div className="bg-paper-100 dark:bg-gray-800 border-2 border-ink-900 rounded-b shadow-lg flex flex-col flex-1 overflow-hidden relative">
                  <div className="flex border-b border-ink-900 bg-paper-200 dark:bg-gray-900">
                      {['PERSONA', 'INVENTORY', 'QUESTS', 'JOURNAL', 'AMBIENCE'].map((tab) => (
                          <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 py-2 flex justify-center items-center transition-colors ${activeTab === tab ? 'bg-paper-100 dark:bg-gray-800 text-gold-600 border-t-2 border-gold-500' : 'text-ink-400 hover:bg-paper-300 dark:hover:bg-gray-700'}`}
                          >
                              {tab === 'PERSONA' && <LucideUser size={16} />}
                              {tab === 'INVENTORY' && <LucideBackpack size={16} />}
                              {tab === 'QUESTS' && <LucideTarget size={16} />}
                              {tab === 'JOURNAL' && <LucideFileText size={16} />}
                              {tab === 'AMBIENCE' && <LucideRadar size={16} />}
                          </button>
                      ))}
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50"></div>
                      {renderTabContent()}
                  </div>
                  <div className="p-4 border-t border-ink-900/20">
                      <button onClick={() => dispatch({type: 'OPEN_GALLERY'})} className="w-full py-2 bg-ink-900 text-gold-500 font-display text-xs hover:bg-ink-800 hover:text-white transition-colors shadow-md flex items-center justify-center gap-2 border border-gold-600">
                          <LucideImage size={14}/> SKETCHBOOK
                      </button>
                  </div>
              </div>
          </div>

          {/* CENTER COLUMN - Full width on mobile */}
          <div className="flex flex-col relative gap-2 h-full col-span-1">
               <div className="bg-ink-900 text-gold-500 px-6 py-2 rounded-sm text-sm font-display font-bold shadow-lg border-b-4 border-gold-600 flex justify-between items-center tracking-wide shrink-0">
                   <span>{state.zones[state.player.currentZoneId].name.toUpperCase()}</span>
                   <span className="text-[10px] font-mono text-ink-400">{state.zones[state.player.currentZoneId].biome}</span>
               </div>
               <div className="flex-1 bg-paper-200 dark:bg-black border-[8px] border-double border-gold-600 shadow-2xl rounded-sm overflow-hidden relative min-h-0">
                   <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] z-10"></div>
                   <div className="w-full h-full flex items-center justify-center p-4 relative z-0">
                        {state.introDialogueOpen ? (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                                <div className="bg-paper-100 dark:bg-gray-800 border-4 border-gold-600 p-8 max-w-md w-full shadow-2xl rounded-lg relative">
                                    <button onClick={() => dispatch({ type: 'CLOSE_INTRO' })} className="absolute top-4 right-4 text-ink-400 hover:text-red-500"><LucideX size={20} /></button>
                                    <div className="flex items-start gap-6 mb-6">
                                         <div className="w-24 h-24 bg-ink-900 rounded-full border-2 border-gold-500 flex items-center justify-center text-4xl text-paper-100 font-display shrink-0">W</div>
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

          {/* RIGHT COLUMN - Hidden on mobile */}
          <div className="hidden md:flex flex-col gap-4 relative overflow-hidden h-full">
              <div className={`absolute top-0 right-0 w-full bg-paper-100 dark:bg-gray-800 border-l-4 border-gold-600 shadow-2xl transition-transform duration-500 z-30 p-4 flex flex-col gap-4 ${isSpeaking && activeNPC ? 'translate-x-0' : 'translate-x-[110%]'}`}>
                   {activeNPC && (
                       <>
                           <div className="w-full aspect-square bg-ink-900 border-4 border-double border-gold-600 flex items-center justify-center shadow-inner"><AsciiPortrait config={activeNPC.portrait} mood="NEUTRAL" speaking={isSpeaking} className="scale-[1.0]" /></div>
                           <div className="text-center bg-paper-200 dark:bg-gray-700 p-2 rounded border border-ink-900/20">
                               <h2 className="font-display text-xl font-bold text-ink-900 dark:text-gold-500">{activeNPC.name}</h2>
                               <div className="w-16 h-0.5 bg-ink-900 mx-auto my-2 opacity-20"></div>
                               <p className="font-serif italic text-sm text-ink-600 dark:text-paper-200">{activeNPC.historicalNote}</p>
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
    </div>
  );
};

export default GameLayout;
