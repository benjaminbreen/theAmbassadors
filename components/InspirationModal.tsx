import React, { useState, useEffect } from 'react';
import { DiscoveredPhrase } from '../types';
import { LucideFeather, LucideSparkles } from 'lucide-react';

interface InspirationModalProps {
  phrase: DiscoveredPhrase;
  onClose: () => void;
}

const InspirationModal: React.FC<InspirationModalProps> = ({ phrase, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [textRevealed, setTextRevealed] = useState(false);

  useEffect(() => {
    // Initial fade in
    const fadeTimer = setTimeout(() => setIsAnimating(false), 400);
    // Text reveal after modal appears
    const textTimer = setTimeout(() => setTextRevealed(true), 800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(textTimer);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4
        ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
      style={{
        background: 'radial-gradient(ellipse at center, rgba(88, 28, 135, 0.95) 0%, rgba(30, 27, 75, 0.98) 50%, rgba(15, 10, 40, 1) 100%)'
      }}
    >
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-300 rounded-full opacity-40"
            style={{
              left: `${10 + (i * 7) % 80}%`,
              top: `${15 + (i * 11) % 70}%`,
              animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>

      <div
        className={`relative max-w-md w-full transition-all duration-700
          ${isAnimating ? 'scale-90 translate-y-4' : 'scale-100 translate-y-0'}`}
      >
        {/* Decorative top flourish */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
            <LucideFeather
              size={24}
              className="text-purple-300 animate-pulse"
              style={{ animationDuration: '2s' }}
            />
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-purple-300 text-xs uppercase tracking-[0.3em] font-sans mb-2 flex items-center justify-center gap-2">
            <LucideSparkles size={10} className="opacity-60" />
            A phrase crystallizes
            <LucideSparkles size={10} className="opacity-60" />
          </p>
        </div>

        {/* Main phrase container */}
        <div
          className={`bg-gradient-to-b from-purple-900/40 to-indigo-900/30
            border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm
            shadow-[0_0_60px_rgba(139,92,246,0.15)]
            transition-all duration-1000 delay-300
            ${textRevealed ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* The phrase itself */}
          <blockquote className="font-serif text-xl leading-relaxed text-purple-100 text-center">
            <span className="text-purple-400 text-2xl">"</span>
            <span
              className="italic"
              style={{
                textShadow: '0 0 20px rgba(192, 132, 252, 0.3)'
              }}
            >
              {phrase.text}
            </span>
            <span className="text-purple-400 text-2xl">"</span>
          </blockquote>

          {/* References if any */}
          {phrase.references && phrase.references.length > 0 && (
            <p className="mt-4 text-center text-xs text-purple-400/70 font-sans tracking-wide">
              — concerning {phrase.references.join(', ')}
            </p>
          )}
        </div>

        {/* Journal note */}
        <div
          className={`text-center mt-4 transition-opacity duration-500 delay-700
            ${textRevealed ? 'opacity-100' : 'opacity-0'}`}
        >
          <p className="text-purple-400/60 text-xs font-sans italic">
            Recorded in your Journal
          </p>
        </div>

        {/* Continue button */}
        <div
          className={`flex justify-center mt-6 transition-opacity duration-500 delay-1000
            ${textRevealed ? 'opacity-100' : 'opacity-0'}`}
        >
          <button
            onClick={onClose}
            className="px-8 py-3 bg-purple-600/80 hover:bg-purple-500/80
              text-purple-100 font-display font-medium rounded-lg
              transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]
              border border-purple-400/30"
          >
            Continue
          </button>
        </div>

        {/* Decorative bottom flourish */}
        <div className="flex justify-center mt-6">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        </div>
      </div>

      {/* Animations defined in tailwind.config.js */}
    </div>
  );
};

export default InspirationModal;
