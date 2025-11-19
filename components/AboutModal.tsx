
import React from 'react';
import { LucideX, LucideHeart, LucideSparkles, LucideBook } from 'lucide-react';

interface AboutModalProps {
  show: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 md:p-4 animate-fade-in">
      <div className="bg-paper-100 dark:bg-gray-800 border-4 border-gold-600 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 md:p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-600 dark:text-gray-400 hover:text-gold-600 transition-colors"
          aria-label="Close"
        >
          <LucideX size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-6 border-b-2 border-gold-600 pb-4">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink-900 dark:text-paper-100 mb-2">
            The Ambassadors: 1889
          </h1>
          <p className="text-gold-600 dark:text-gold-500 font-display text-sm tracking-widest">
            AN EXPERIMENTAL LITERARY RPG
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-ink-700 dark:text-gray-300">
          {/* About Section */}
          <section>
            <h2 className="font-display text-xl font-bold text-ink-900 dark:text-paper-100 mb-3 flex items-center gap-2">
              <LucideBook size={20} className="text-gold-600" />
              About This Project
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                <em>The Ambassadors: 1889</em> is an experimental literary RPG that reimagines
                Henry James at the 1889 Paris World's Fair. This game was created as a test
                of <strong>Google Gemini Pro 3.0</strong>'s coding and creative
                abilities.
              </p>
              <p>
                Developed by <strong>Benjamin Breen</strong>, a history professor at UC Santa Cruz,
                this project explores the intersection of AI, literature, and interactive fiction.
                Every narrative description, NPC dialogue, and generated image is powered by
                Gemini Pro 3.0's language and vision models.
              </p>
            </div>
          </section>

          {/* Technology Section */}
          <section className="border-t border-ink-200 dark:border-gray-700 pt-4">
            <h2 className="font-display text-xl font-bold text-ink-900 dark:text-paper-100 mb-3 flex items-center gap-2">
              <LucideSparkles size={20} className="text-gold-600" />
              Technology
            </h2>
            <div className="text-sm leading-relaxed space-y-2">
              <p><strong>AI Models:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Gemini Pro 3.0 (text generation)</li>
                <li>Imagen 3 (image generation)</li>
              </ul>
              <p className="mt-3"><strong>Built with:</strong> React, TypeScript, Vite, Tailwind CSS</p>
              <p><strong>Development:</strong> Claude Code by Anthropic</p>
            </div>
          </section>

          {/* Support Section */}
          <section className="border-t border-ink-200 dark:border-gray-700 pt-4 bg-gold-50 dark:bg-gray-900 -mx-8 px-8 py-4">
            <h2 className="font-display text-xl font-bold text-ink-900 dark:text-paper-100 mb-3 flex items-center gap-2">
              <LucideHeart size={20} className="text-red-600" />
              Support This Project
            </h2>
            <div className="text-sm leading-relaxed space-y-3">
              <p>
                This game uses real AI API calls for every interaction—each narrative description,
                dialogue exchange, and generated image costs money to produce. The project also
                requires hosting and infrastructure costs.
              </p>
              <p>
                If you're enjoying <em>The Ambassadors: 1889</em> and want to support continued
                development and API costs, please consider subscribing to <strong>Res Obscura</strong>,
                a newsletter about history, literature, and digital humanities.
              </p>

              <div className="flex gap-3 mt-4">
                <a
                  href="https://resobscura.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gold-600 hover:bg-gold-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md text-center"
                >
                  Subscribe to Res Obscura
                </a>
              </div>

              <p className="text-xs text-ink-500 dark:text-gray-500 italic mt-3">
                A paid subscription helps cover hosting costs and supports more experimental
                projects at the intersection of history, literature, and AI.
              </p>
            </div>
          </section>

          {/* Credits */}
          <section className="border-t border-ink-200 dark:border-gray-700 pt-4">
            <div className="text-xs text-ink-500 dark:text-gray-500 space-y-1">
              <p><strong>Created by:</strong> Benjamin Breen</p>
              <p><strong>Institution:</strong> University of California, Santa Cruz</p>
              <p><strong>Project Type:</strong> Experimental Digital Humanities</p>
              <p><strong>Version:</strong> 1.0 (December 2024)</p>
            </div>
          </section>
        </div>

        {/* Close button at bottom */}
        <div className="mt-6 pt-4 border-t border-ink-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-ink-900 hover:bg-ink-800 text-gold-400 font-display py-2 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
