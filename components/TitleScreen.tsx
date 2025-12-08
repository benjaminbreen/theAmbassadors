import React, { useState, useEffect, useMemo } from 'react';
import { getInterpolatedTimeColors } from '../utils/timeOfDay';
import ParisSkyline from './ParisSkyline';

interface TitleScreenProps {
  onStart: () => void;
  introText: string;
}

/**
 * Animated title screen with time-lapse Paris skyline
 * Day cycles through in 60 seconds (1 game day = 1 minute real time)
 */
const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, introText }) => {
  // Fast-cycling time: full day (24 hours) in 60 seconds
  // So 1 real second = 24 game minutes
  const [simulatedTime, setSimulatedTime] = useState({ hour: 6, minute: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedTime(prev => {
        // Advance 24 minutes per second (24 * 60 = 1440 minutes = 24 hours in 60 seconds)
        let newMinute = prev.minute + 24;
        let newHour = prev.hour;

        while (newMinute >= 60) {
          newMinute -= 60;
          newHour += 1;
        }

        if (newHour >= 24) {
          newHour = newHour % 24;
        }

        return { hour: newHour, minute: newMinute };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeColors = useMemo(() =>
    getInterpolatedTimeColors(simulatedTime.hour, simulatedTime.minute),
    [simulatedTime.hour, simulatedTime.minute]
  );

  return (
    <div
      className="w-screen flex items-center justify-center text-center relative overflow-auto"
      style={{
        height: '100dvh', // Use dynamic viewport height for iOS Safari
        minHeight: '-webkit-fill-available', // Fallback for older iOS
        // Safe area padding for notched devices
        paddingTop: 'max(1rem, env(safe-area-inset-top, 16px))',
        paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 24px))',
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 16px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 16px))',
        background: `linear-gradient(180deg,
          ${timeColors.skyTop} 0%,
          ${timeColors.skyMid} 25%,
          ${timeColors.skyBottom} 50%,
          #2a2620 75%,
          #1a1814 100%)`,
        transition: 'background 1s ease-in-out',
      }}
    >
      {/* Paris Skyline with fast time cycle but normal cloud speed */}
      <ParisSkyline
        timeColors={timeColors}
        hour={simulatedTime.hour}
        minute={simulatedTime.minute}
      />

      {/* Vignette overlay */}
      <div className="vignette absolute inset-0 pointer-events-none z-10"></div>

      {/* Title card - scrollable container for small screens */}
      <div className="max-w-2xl space-y-4 md:space-y-8 border-4 md:border-8 border-double border-gold-600 p-4 md:p-12 rounded-lg shadow-2xl bg-paper-50/95 dark:bg-gray-800/95 relative z-20 animate-fade-in backdrop-blur-sm my-auto max-h-full overflow-y-auto">
        <h1 className="text-3xl md:text-7xl font-display text-ink-900 dark:text-gold-500 mb-2 md:mb-4 tracking-tight text-glow">
          The Ambassadors: 1889
        </h1>
        <div className="w-24 md:w-32 h-1 bg-gold-500 mx-auto mb-4 md:mb-8"></div>
        <div className="text-base md:text-xl font-serif leading-relaxed whitespace-pre-line text-ink-400 dark:text-gray-400">
          {introText}
        </div>
        <button
          onClick={onStart}
          className="px-8 md:px-12 py-3 md:py-4 bg-ink-900 hover:bg-gold-500 active:bg-gold-600 text-gold-500 hover:text-ink-900 border-2 border-gold-600 rounded font-display text-lg md:text-xl tracking-widest transition-all duration-150 shadow-lg hover:shadow-xl mt-4 md:mt-8"
        >
          Begin Observation
        </button>
      </div>
    </div>
  );
};

export default TitleScreen;
