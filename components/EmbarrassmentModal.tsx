import React, { useState, useEffect } from 'react';
import { LucideAlertTriangle, LucideSkull } from 'lucide-react';
import Portrait from './Portrait';
import { PortraitArchetype } from '../types';

export interface NPCReaction {
  name: string;
  archetype?: PortraitArchetype;
  dialogueLines: string[];
  reactionType: 'angry' | 'frightened' | 'indignant' | 'shocked';
}

interface EmbarrassmentModalProps {
  objectName: string;
  description: string;
  isFatal?: boolean;
  npcReaction?: NPCReaction;
  onClose: () => void;
}

// Helper to render markdown-style *italics* in dialogue
const renderDialogueLine = (line: string): React.ReactNode => {
  // Split by asterisks and render alternating normal/italic
  const parts = line.split(/\*([^*]+)\*/g);
  return parts.map((part, i) => {
    // Odd indices are the italic parts (inside asterisks)
    if (i % 2 === 1) {
      return <em key={i} className="text-red-200/80 not-italic" style={{ fontStyle: 'italic' }}>{part}</em>;
    }
    return part;
  });
};

const EmbarrassmentModal: React.FC<EmbarrassmentModalProps> = ({
  objectName,
  description,
  isFatal = false,
  npcReaction,
  onClose
}) => {
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

  const fatalGradient = 'radial-gradient(ellipse at center, rgba(30, 10, 10, 0.98) 0%, rgba(60, 10, 10, 0.98) 30%, rgba(10, 5, 5, 1) 100%)';
  const embarrassmentGradient = 'radial-gradient(ellipse at center, rgba(135, 28, 28, 0.95) 0%, rgba(75, 20, 27, 0.98) 50%, rgba(40, 10, 15, 1) 100%)';

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4
        ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
      style={{
        background: isFatal ? fatalGradient : embarrassmentGradient
      }}
    >
      {/* Floating particles effect - red/orange for embarrassment */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full opacity-40 animate-float-embarrassment ${isFatal ? 'bg-orange-500' : 'bg-red-300'}`}
            style={{
              left: `${10 + (i * 7) % 80}%`,
              top: `${15 + (i * 11) % 70}%`,
              animationDuration: `${3 + (i % 3)}s`,
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
            <div className={`w-12 h-px bg-gradient-to-r from-transparent ${isFatal ? 'via-orange-500' : 'via-red-400'} to-transparent`} />
            {isFatal ? (
              <LucideSkull
                size={28}
                className="text-orange-400 animate-pulse"
                style={{ animationDuration: '1s' }}
              />
            ) : (
              <LucideAlertTriangle
                size={24}
                className="text-red-300 animate-pulse"
                style={{ animationDuration: '2s' }}
              />
            )}
            <div className={`w-12 h-px bg-gradient-to-r from-transparent ${isFatal ? 'via-orange-500' : 'via-red-400'} to-transparent`} />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <p className={`text-xs uppercase tracking-[0.3em] font-sans mb-2 flex items-center justify-center gap-2 ${isFatal ? 'text-orange-300' : 'text-red-300'}`}>
            {isFatal ? (
              <>
                <LucideSkull size={10} className="opacity-60" />
                A Fatal Miscalculation
                <LucideSkull size={10} className="opacity-60" />
              </>
            ) : (
              <>
                <LucideAlertTriangle size={10} className="opacity-60" />
                A Social Catastrophe
                <LucideAlertTriangle size={10} className="opacity-60" />
              </>
            )}
          </p>
          <h2 className={`font-display text-2xl font-bold ${isFatal ? 'text-orange-200' : 'text-red-200'}`}>
            {isFatal ? 'The End' : objectName}
          </h2>
        </div>

        {/* Main content container */}
        <div
          className={`bg-gradient-to-b ${isFatal ? 'from-orange-900/40 to-red-900/30 border-orange-500/30' : 'from-red-900/40 to-rose-900/30 border-red-500/30'}
            border rounded-lg p-6 backdrop-blur-sm
            ${isFatal ? 'shadow-[0_0_60px_rgba(249,115,22,0.15)]' : 'shadow-[0_0_60px_rgba(239,68,68,0.15)]'}
            transition-all duration-1000 delay-300
            ${textRevealed ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* The description */}
          <p className={`font-serif text-lg leading-relaxed text-center italic ${isFatal ? 'text-orange-100' : 'text-red-100'}`}
            style={{
              textShadow: isFatal ? '0 0 20px rgba(249, 115, 22, 0.3)' : '0 0 20px rgba(252, 132, 132, 0.3)'
            }}
          >
            {description}
          </p>

          {/* NPC Reaction Section */}
          {npcReaction && (
            <div className="mt-6 pt-4 border-t border-red-500/30">
              <div className="flex items-start gap-4">
                {/* Portrait Circle */}
                <div className="flex-shrink-0">
                  <div className={`w-24 h-24 rounded-full overflow-hidden border-3
                    ${npcReaction.reactionType === 'angry' ? 'border-red-400 shadow-[0_0_20px_rgba(248,113,113,0.6)]' :
                      npcReaction.reactionType === 'frightened' ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)]' :
                      npcReaction.reactionType === 'indignant' ? 'border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.6)]' :
                      'border-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.6)]'}
                    bg-gradient-to-b from-red-900/60 to-red-950/80 flex items-center justify-center`}
                    style={{ borderWidth: '3px' }}
                  >
                    {npcReaction.archetype ? (
                      <div className="transform scale-150">
                        <Portrait
                          archetype={npcReaction.archetype}
                          emotion={npcReaction.reactionType === 'angry' ? 'angry' :
                                  npcReaction.reactionType === 'frightened' ? 'surprised' :
                                  npcReaction.reactionType === 'indignant' ? 'skeptical' : 'surprised'}
                          size="md"
                        />
                      </div>
                    ) : (
                      <span className="text-4xl">👤</span>
                    )}
                  </div>
                  <p className="text-center text-xs text-red-300 mt-1.5 font-display uppercase tracking-wide">
                    {npcReaction.name}
                  </p>
                </div>

                {/* Dialogue Bubble */}
                <div className="flex-1 relative">
                  {/* Speech bubble pointer */}
                  <div className="absolute left-0 top-6 -ml-2 w-0 h-0
                    border-t-[8px] border-t-transparent
                    border-r-[10px] border-r-red-800/80
                    border-b-[8px] border-b-transparent" />

                  <div className="bg-red-800/80 rounded-lg p-4 border border-red-600/40">
                    {npcReaction.dialogueLines.map((line, i) => (
                      <p key={i} className={`font-serif text-red-100 text-base leading-relaxed ${i > 0 ? 'mt-2' : ''}`}>
                        "{renderDialogueLine(line)}"
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Consequences note */}
        <div
          className={`text-center mt-4 transition-opacity duration-500 delay-700
            ${textRevealed ? 'opacity-100' : 'opacity-0'}`}
        >
          <p className={`text-xs font-sans italic ${isFatal ? 'text-orange-400/60' : 'text-red-400/60'}`}>
            {isFatal
              ? 'Your story ends here, amid the marvels of the exposition...'
              : 'Your reputation suffers. Your composure wavers.'}
          </p>
        </div>

        {/* Continue button */}
        <div
          className={`flex justify-center mt-6 transition-opacity duration-500 delay-1000
            ${textRevealed ? 'opacity-100' : 'opacity-0'}`}
        >
          <button
            onClick={onClose}
            className={`px-8 py-3 font-display font-medium rounded-lg
              transition-all duration-300 border
              ${isFatal
                ? 'bg-orange-600/80 hover:bg-orange-500/80 text-orange-100 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] border-orange-400/30'
                : 'bg-red-600/80 hover:bg-red-500/80 text-red-100 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] border-red-400/30'
              }`}
          >
            {isFatal ? 'Accept Fate' : 'Compose Yourself'}
          </button>
        </div>

        {/* Decorative bottom flourish */}
        <div className="flex justify-center mt-6">
          <div className={`w-24 h-px bg-gradient-to-r from-transparent ${isFatal ? 'via-orange-500/50' : 'via-red-500/50'} to-transparent`} />
        </div>
      </div>

    </div>
  );
};

export default EmbarrassmentModal;
