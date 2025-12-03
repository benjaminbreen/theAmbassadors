import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { LucideX, LucideFeather, LucideSparkles, LucideBookOpen, LucidePenTool, LucideGripVertical, LucideTrash2, LucideLoader2 } from 'lucide-react';
import ParisSkyline from './ParisSkyline';
import { getInterpolatedTimeColors } from '../utils/timeOfDay';
import MuseMode from './MuseMode';
import { startMuseMusic, stopMuseMusic, startZoneMusic } from '../services/audioService';
import { generateStreamOfConsciousness } from '../services/geminiService';

interface DraggedItem {
  type: 'phrase' | 'event';
  id: string;
  text: string;
}

interface PaperFragment {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
  source: 'phrase' | 'event' | 'written';
}

// Generate fixed star positions (seeded)
const generateStars = (count: number) => {
  const stars: Array<{ baseX: number; baseY: number; size: number; brightness: number; orbitRadius: number }> = [];
  // Use a deterministic "random" based on index
  for (let i = 0; i < count; i++) {
    const seed1 = Math.sin(i * 12.9898) * 43758.5453;
    const seed2 = Math.sin(i * 78.233) * 43758.5453;
    const seed3 = Math.sin(i * 45.164) * 43758.5453;

    stars.push({
      baseX: (seed1 - Math.floor(seed1)) * 100,
      baseY: (seed2 - Math.floor(seed2)) * 45, // Keep in upper portion of sky
      size: 0.5 + (seed3 - Math.floor(seed3)) * 1.5,
      brightness: 0.3 + (seed1 - Math.floor(seed1)) * 0.5,
      orbitRadius: 5 + (seed2 - Math.floor(seed2)) * 15, // How far stars move across sky
    });
  }
  return stars;
};

const FIXED_STARS = generateStars(60);

const WriteMode: React.FC = () => {
  const { state, dispatch } = useGame();
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [writtenText, setWrittenText] = useState('');
  const [fragments, setFragments] = useState<PaperFragment[]>([]);
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'phrases' | 'events'>('phrases');
  const [showMuseMode, setShowMuseMode] = useState(false);
  const [museButtonHovered, setMuseButtonHovered] = useState(false);
  const [nightProgress, setNightProgress] = useState(0); // 0-1 representing night progression
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [displayedText, setDisplayedText] = useState(''); // For typewriter effect
  const paperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef(Date.now());

  // Progress time: 1 real minute = 10 night minutes
  // Night goes from 22:00 to 04:00 (6 hours = 360 minutes)
  // So full cycle in real time = 36 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedMs = Date.now() - startTimeRef.current;
      const elapsedMinutes = elapsedMs / 60000;
      // 1 real minute = 10 night minutes, full night (360 min) = 36 real minutes
      const progress = (elapsedMinutes / 36) % 1;
      setNightProgress(progress);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate current night hour based on progress (22:00 -> 04:00)
  const currentNightTime = useMemo(() => {
    // Progress 0 = 22:00, Progress 1 = 04:00
    const totalMinutes = nightProgress * 360; // 6 hours = 360 minutes
    const hour = Math.floor((22 + totalMinutes / 60) % 24);
    const minute = Math.floor(totalMinutes % 60);
    return { hour, minute };
  }, [nightProgress]);

  // Get interpolated colors based on current time
  const nightColors = useMemo(() => {
    return getInterpolatedTimeColors(currentNightTime.hour, currentNightTime.minute);
  }, [currentNightTime]);

  // Entry animation
  useEffect(() => {
    const timer = setTimeout(() => setIsEntering(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Start mystical ambient music when WriteMode opens
  useEffect(() => {
    if (state.showMusingMode && !state.audio.muted) {
      startMuseMusic();
    }
    return () => {
      // Stop muse music and restore zone music when closing
      stopMuseMusic();
      const currentZone = state.zones[state.player.currentZoneId];
      if (currentZone && !state.audio.muted) {
        startZoneMusic(currentZone.name);
      }
    };
  }, [state.showMusingMode]);

  // Focus textarea on mount
  useEffect(() => {
    if (!isEntering && textareaRef.current && !showMuseMode) {
      textareaRef.current.focus();
    }
  }, [isEntering, showMuseMode]);

  // Typewriter effect for generated text
  useEffect(() => {
    if (!generatedText) return;

    setDisplayedText('');
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < generatedText.length) {
        setDisplayedText(generatedText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 18); // Fast typewriter effect

    return () => clearInterval(typeInterval);
  }, [generatedText]);

  // Handle words from Muse Mode
  const handleMuseWords = useCallback(async (words: string[]) => {
    setShowMuseMode(false);
    setIsGenerating(true);

    // Get context from current zone
    const currentZone = state.zones[state.player.currentZoneId];
    const context = currentZone ? `Recently visited: ${currentZone.name}` : undefined;

    try {
      const text = await generateStreamOfConsciousness(words, context);
      setGeneratedText(text);
    } catch (error) {
      console.error('Failed to generate text:', error);
      setGeneratedText(words.join(' · ') + '...');
    } finally {
      setIsGenerating(false);
    }
  }, [state.zones, state.player.currentZoneId]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      dispatch({ type: 'CLOSE_MUSING_MODE' });
    }, 600);
  };

  const handleDragStart = (item: DraggedItem) => {
    setDraggedItem(item);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem || !paperRef.current) return;

    const rect = paperRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newFragment: PaperFragment = {
      id: `frag-${Date.now()}`,
      text: draggedItem.text,
      x: Math.max(5, Math.min(75, x)),
      y: Math.max(5, Math.min(85, y)),
      rotation: (Math.random() - 0.5) * 6,
      source: draggedItem.type,
    };

    setFragments(prev => [...prev, newFragment]);
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFragment = (id: string) => {
    setFragments(prev => prev.filter(f => f.id !== id));
  };

  const { discoveredPhrases, eventHistory } = state.eventState;

  if (!state.showMusingMode) return null;

  if (showMuseMode) {
    return <MuseMode onClose={() => setShowMuseMode(false)} onWrite={handleMuseWords} />;
  }

  // Moon position based on night progress (arcs from east to west)
  const moonAngle = nightProgress * Math.PI; // 0 to PI (east to west arc)
  const moonX = 15 + Math.cos(moonAngle - Math.PI / 2) * 35 + 35; // Center around 50%, arc width 70%
  const moonY = 5 + Math.sin(moonAngle) * -25 + 30; // Arc up then down

  return (
    <>
      {/* Transition overlay */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-700 ${
          isEntering ? 'opacity-100' : isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(88, 28, 135, 0.98) 0%, rgba(30, 27, 75, 0.99) 50%, rgba(15, 10, 40, 1) 100%)'
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-purple-300 rounded-full"
              style={{
                left: `${10 + (i * 4.5) % 80}%`,
                top: `${15 + (i * 7) % 70}%`,
                opacity: 0.4 + (i % 3) * 0.15,
                animation: `float ${3 + (i % 4)}s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>

        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isEntering || isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <div className="text-center">
            <LucidePenTool size={48} className="mx-auto text-purple-300 mb-4 animate-pulse" />
            <h2 className="font-display text-3xl text-purple-200 tracking-wide">
              {isExiting ? 'Returning to the Fair...' : 'The Writing Desk Awaits...'}
            </h2>
            <p className="mt-2 text-purple-400 font-serif italic text-lg">
              "We work in the dark—we do what we can—we give what we have."
            </p>
          </div>
        </div>
      </div>

      {/* Main Write Mode interface */}
      <div
        className={`fixed inset-0 z-[55] flex transition-opacity duration-500 ${
          isEntering ? 'opacity-0' : isExiting ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Night Paris Skyline Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 transition-colors duration-1000"
            style={{
              background: `linear-gradient(180deg,
                ${nightColors.skyTop} 0%,
                ${nightColors.skyMid} 25%,
                ${nightColors.skyBottom} 50%,
                #1a1510 75%,
                #0f0d0a 100%)`,
            }}
          />
          <ParisSkyline timeColors={nightColors} hour={currentNightTime.hour} minute={currentNightTime.minute} />

          {/* Moon */}
          <div
            className="absolute w-12 h-12 rounded-full transition-all duration-1000"
            style={{
              left: `${moonX}%`,
              top: `${Math.max(5, moonY)}%`,
              background: 'radial-gradient(circle at 30% 30%, #fffef0 0%, #f5f0d0 50%, #e8e0b0 100%)',
              boxShadow: '0 0 40px rgba(255, 250, 200, 0.4), 0 0 80px rgba(255, 250, 200, 0.2)',
            }}
          />

          {/* Fixed stars that arc across the sky */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {FIXED_STARS.map((star, i) => {
              // Stars arc with the same motion as the moon
              const starArcOffset = star.orbitRadius * Math.sin(nightProgress * Math.PI);
              const starX = star.baseX + starArcOffset;
              const starY = star.baseY - Math.abs(starArcOffset) * 0.3; // Slight vertical arc

              return (
                <div
                  key={`star-${i}`}
                  className="absolute rounded-full bg-white transition-all duration-1000"
                  style={{
                    left: `${starX}%`,
                    top: `${starY}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    opacity: star.brightness * (0.8 + Math.sin(nightProgress * Math.PI * 2 + i) * 0.2),
                    boxShadow: star.size > 1 ? `0 0 ${star.size * 2}px rgba(255,255,255,0.3)` : 'none',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.7) 100%)'
        }} />

        {/* Main content area */}
        <div className="relative flex w-full h-full">
          {/* LEFT SIDEBAR */}
          <div className="w-72 bg-ink-900/90 border-r border-gold-600/30 flex flex-col backdrop-blur-sm">
            <div className="p-4 border-b border-gold-600/20 bg-ink-900/50">
              <h3 className="font-display text-gold-400 text-base flex items-center gap-2">
                <LucideBookOpen size={18} />
                Source Material
              </h3>
              <p className="text-xs text-paper-500 mt-1 font-serif italic">
                Drag fragments onto the page
              </p>
            </div>

            <div className="flex border-b border-ink-700">
              <button
                onClick={() => setSidebarTab('phrases')}
                className={`flex-1 py-2 px-3 text-sm font-display flex items-center justify-center gap-2 transition-colors ${
                  sidebarTab === 'phrases'
                    ? 'text-gold-400 bg-ink-800 border-b-2 border-gold-500'
                    : 'text-paper-400 hover:text-paper-200'
                }`}
              >
                <LucideSparkles size={14} />
                Phrases ({discoveredPhrases.length})
              </button>
              <button
                onClick={() => setSidebarTab('events')}
                className={`flex-1 py-2 px-3 text-sm font-display flex items-center justify-center gap-2 transition-colors ${
                  sidebarTab === 'events'
                    ? 'text-gold-400 bg-ink-800 border-b-2 border-gold-500'
                    : 'text-paper-400 hover:text-paper-200'
                }`}
              >
                <LucideFeather size={14} />
                Moments ({eventHistory.length})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {sidebarTab === 'phrases' && (
                discoveredPhrases.length === 0 ? (
                  <p className="text-paper-500 text-sm italic text-center py-8">
                    No phrases discovered yet...
                  </p>
                ) : (
                  discoveredPhrases.map((phrase) => (
                    <div
                      key={phrase.phraseId}
                      draggable
                      onDragStart={() => handleDragStart({ type: 'phrase', id: phrase.phraseId, text: phrase.text })}
                      className="bg-ink-800 border border-ink-700 rounded p-3 cursor-grab active:cursor-grabbing hover:border-gold-600/50 hover:bg-ink-700 transition-colors group"
                    >
                      <div className="flex items-start gap-2">
                        <LucideGripVertical size={14} className="text-ink-500 mt-1 group-hover:text-gold-500 shrink-0" />
                        <p className="text-paper-200 font-serif text-sm italic leading-relaxed">
                          "{phrase.text}"
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-purple-400 uppercase tracking-wider font-mono">
                          {phrase.theme}
                        </span>
                        <span className="text-[10px] text-paper-500">
                          {phrase.discoveredAt.zoneName}
                        </span>
                      </div>
                    </div>
                  ))
                )
              )}

              {sidebarTab === 'events' && (
                eventHistory.length === 0 ? (
                  <p className="text-paper-500 text-sm italic text-center py-8">
                    No moments recorded yet...
                  </p>
                ) : (
                  eventHistory.map((event, idx) => (
                    <div
                      key={`${event.eventId}-${idx}`}
                      draggable
                      onDragStart={() => handleDragStart({ type: 'event', id: `${event.eventId}-${idx}`, text: event.outcomeDescription })}
                      className="bg-ink-800 border border-ink-700 rounded p-3 cursor-grab active:cursor-grabbing hover:border-gold-600/50 hover:bg-ink-700 transition-colors group"
                    >
                      <div className="flex items-start gap-2">
                        <LucideGripVertical size={14} className="text-ink-500 mt-1 group-hover:text-gold-500 shrink-0" />
                        <p className="text-paper-200 font-serif text-sm italic leading-relaxed line-clamp-3">
                          {event.outcomeDescription}
                        </p>
                      </div>
                      {event.zoneName && (
                        <p className="mt-2 text-[10px] text-paper-500 text-right">
                          {event.zoneName}
                        </p>
                      )}
                    </div>
                  ))
                )
              )}
            </div>

            {/* Elegant Muse Mode button */}
            <div className="p-3 border-t border-ink-700/50">
              <button
                onClick={() => setShowMuseMode(true)}
                onMouseEnter={() => setMuseButtonHovered(true)}
                onMouseLeave={() => setMuseButtonHovered(false)}
                className="w-full py-2.5 px-4 bg-transparent hover:bg-white/5 text-paper-400 hover:text-paper-200 rounded font-serif italic text-sm flex items-center justify-center gap-2 transition-all duration-500 border border-transparent hover:border-white/10 relative overflow-hidden group"
              >
                {/* Shimmer effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: museButtonHovered
                      ? 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)'
                      : 'none',
                    animation: museButtonHovered ? 'shimmer 2s infinite' : 'none',
                  }}
                />
                <span className="relative z-10 transition-all duration-300 group-hover:tracking-wider">
                  enter muse mode
                </span>
                <span className="relative z-10 text-[9px] text-paper-500 group-hover:text-purple-400 transition-colors duration-300 ml-1">
                  ✧
                </span>
              </button>
            </div>
          </div>

          {/* CENTER - Writing paper (smaller with more padding) */}
          <div className="flex-1 flex items-center justify-center p-16 relative">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2.5 bg-ink-900/60 hover:bg-red-900/60 text-paper-400 hover:text-white rounded-full transition-all z-20 border border-white/10 hover:border-red-500/30"
            >
              <LucideX size={20} />
            </button>

            {/* Header */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-20">
              <h1 className="font-display text-xl text-gold-400/80 tracking-widest flex items-center gap-3">
                <LucidePenTool size={18} className="text-gold-500/70" />
                The Writing Desk
              </h1>
            </div>

            {/* Paper - smaller */}
            <div
              ref={paperRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="relative w-full max-w-lg aspect-[4/5] bg-paper-50 shadow-2xl"
              style={{
                background: 'linear-gradient(to bottom, #faf8f3 0%, #f5f0e6 100%)',
                boxShadow: `
                  0 4px 6px rgba(0,0,0,0.3),
                  0 20px 60px rgba(0,0,0,0.5),
                  inset 0 0 80px rgba(139, 90, 43, 0.06),
                  inset 0 0 20px rgba(0,0,0,0.02)
                `,
                borderRadius: '2px',
              }}
            >
              {/* Paper texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Margin line */}
              <div className="absolute left-14 top-0 bottom-0 w-px bg-rose-400/30" />

              {/* Horizontal ruled lines */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, rgba(180, 160, 140, 0.25) 39px, rgba(180, 160, 140, 0.25) 40px)',
                  backgroundPosition: '0 60px',
                }}
              />

              {/* Writing area */}
              <div className="absolute inset-0 p-6 pl-18 pt-16 pb-8" style={{ paddingLeft: '72px' }}>
                {/* Loading indicator */}
                {isGenerating && (
                  <div className="flex items-center gap-3 mb-4 text-ink-500">
                    <LucideLoader2 size={18} className="animate-spin" />
                    <span className="font-serif italic text-sm">The pen moves across the page...</span>
                  </div>
                )}

                {/* Generated text from Muse Mode */}
                {displayedText && !isGenerating && (
                  <div
                    className="mb-6 pb-4 border-b border-ink-200/30"
                    style={{
                      fontFamily: "'Tangerine', 'Dancing Script', cursive",
                      fontSize: '34px',
                      lineHeight: '46px',
                      color: '#2c1810',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {displayedText}
                    <span className="animate-pulse">|</span>
                  </div>
                )}

                {/* Manual writing textarea */}
                <textarea
                  ref={textareaRef}
                  value={writtenText}
                  onChange={(e) => setWrittenText(e.target.value)}
                  placeholder={displayedText ? "Continue writing..." : "My dear friend..."}
                  className="w-full h-full bg-transparent resize-none outline-none text-ink-800"
                  style={{
                    fontFamily: "'Tangerine', 'Dancing Script', cursive",
                    fontSize: '34px',
                    lineHeight: '46px',
                    caretColor: '#2c1810',
                    color: '#1a0f0a',
                    letterSpacing: '0.5px',
                  }}
                />
              </div>

              {/* Dropped fragments */}
              {fragments.map((fragment) => (
                <div
                  key={fragment.id}
                  className="absolute group"
                  style={{
                    left: `${fragment.x}%`,
                    top: `${fragment.y}%`,
                    transform: `rotate(${fragment.rotation}deg)`,
                    maxWidth: '160px',
                  }}
                >
                  <div className={`
                    relative p-2 rounded shadow-lg cursor-move
                    ${fragment.source === 'phrase'
                      ? 'bg-purple-100 border border-purple-300'
                      : fragment.source === 'event'
                      ? 'bg-amber-50 border border-amber-300'
                      : 'bg-blue-50 border border-blue-300'
                    }
                  `}>
                    <p className="text-[10px] font-serif italic text-ink-700 leading-relaxed">
                      "{fragment.text.slice(0, 80)}{fragment.text.length > 80 ? '...' : ''}"
                    </p>
                    <button
                      onClick={() => removeFragment(fragment.id)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <LucideTrash2 size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-5px); }
          75% { transform: translateY(-15px) translateX(3px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
};

export default WriteMode;
