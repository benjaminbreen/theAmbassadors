
import React from 'react';
import { useGame } from '../context/GameContext';
import { LucideHeart, LucideX } from 'lucide-react';

const SupportModal: React.FC = () => {
  const { state, dispatch } = useGame();

  if (!state.showSupportModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 md:p-4 animate-fade-in">
      <div className="bg-paper-100 dark:bg-gray-800 border-4 border-gold-600 rounded-lg shadow-2xl max-w-lg w-full p-4 md:p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={() => dispatch({ type: 'CLOSE_SUPPORT_MODAL' })}
          className="absolute top-4 right-4 text-ink-600 dark:text-gray-400 hover:text-gold-600 transition-colors"
          aria-label="Close"
        >
          <LucideX size={24} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900 rounded-full flex items-center justify-center">
            <LucideHeart className="text-gold-600" size={32} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h2 className="font-display text-xl md:text-2xl font-bold text-ink-900 dark:text-paper-100">
            You've Made 100 Literary Observations
          </h2>

          <p className="text-sm md:text-base text-ink-700 dark:text-gray-300 leading-relaxed">
            This experimental literary game uses AI to generate unique narratives and images.
            Each API call costs real money to run.
          </p>

          <p className="text-sm md:text-base text-ink-700 dark:text-gray-300 leading-relaxed">
            If you're enjoying <em>The Ambassadors: 1889</em>, please consider supporting
            the project by subscribing to <strong>Res Obscura</strong>, a newsletter about
            history, literature, and digital humanities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 mt-6">
            <a
              href="https://resobscura.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gold-600 hover:bg-gold-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
            >
              Subscribe to Res Obscura
            </a>

            <button
              onClick={() => dispatch({ type: 'CLOSE_SUPPORT_MODAL' })}
              className="text-ink-600 dark:text-gray-400 hover:text-ink-900 dark:hover:text-gray-200 font-medium py-2 transition-colors"
            >
              Continue Playing
            </button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-ink-500 dark:text-gray-500 mt-4 italic">
            You can continue playing indefinitely. This is just a friendly reminder about hosting costs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
