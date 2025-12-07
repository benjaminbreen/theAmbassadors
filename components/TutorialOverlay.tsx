import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TutorialOverlayProps {
  onDismiss: () => void;
}

const TUTORIAL_STORAGE_KEY = 'ambassadors_tutorial_seen';

export const hasSeenTutorial = (): boolean => {
  try {
    return localStorage.getItem(TUTORIAL_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const markTutorialSeen = (): void => {
  try {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
  } catch {
    // localStorage not available
  }
};

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onDismiss }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isNarrowScreen = window.innerWidth < 768;
      setIsMobile(hasTouchScreen && isNarrowScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Fade in after a brief delay
    const timer = setTimeout(() => setIsVisible(true), 100);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    markTutorialSeen();
    setTimeout(onDismiss, 300);
  };

  // Handle ESC or any key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ maxWidth: 'calc(100% - 2rem)' }}
    >
      <div
        className="bg-ink-900/90 backdrop-blur-sm border border-gold-600/80 rounded-lg px-4 py-2.5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-5 h-5 bg-ink-800 border border-gold-600/60 rounded-full flex items-center justify-center text-gold-500 hover:bg-gold-600 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={12} />
        </button>

        {/* Header */}
        <div className="text-center mb-2">
          <span className="font-display text-xs text-gold-500 tracking-wider uppercase">How to Play</span>
        </div>

        {/* Controls row */}
        {!isMobile ? (
          <div className="flex items-center justify-center gap-5 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                <kbd className="px-1.5 py-0.5 bg-paper-200/20 rounded text-paper-300 font-mono text-[10px]">↑↓←→</kbd>
              </div>
              <span className="text-paper-400">Move</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-paper-200/20 rounded text-paper-300 font-mono text-[10px]">WASD</kbd>
              <span className="text-paper-400">Turn</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-paper-200/20 rounded text-paper-300 font-mono text-[10px]">SPACE</kbd>
              <span className="text-paper-400">Interact</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-paper-200/20 rounded text-paper-300 font-mono text-[10px]">SHIFT</kbd>
              <span className="text-paper-400">Cane</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-gold-400">D-pad</span>
              <span className="text-paper-400">Move</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gold-400">👆</span>
              <span className="text-paper-400">Interact</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gold-400">⚔️</span>
              <span className="text-paper-400">Cane</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gold-400">←→</span>
              <span className="text-paper-400">Swipe to turn</span>
            </div>
          </div>
        )}

        {/* Dismiss hint */}
        <div className="text-center mt-2">
          <span className="text-[10px] text-paper-500">
            {isMobile ? 'Tap to dismiss' : 'Press any key to dismiss'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;
