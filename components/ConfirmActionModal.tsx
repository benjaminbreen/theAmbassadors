import React, { useEffect } from 'react';
import { LucideAlertCircle } from 'lucide-react';
import ModalBase from './ModalBase';

export type ConfirmAction = {
  id: string;
  title: string;
  description: string;
  warning?: string;
  yesText?: string;
  noText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

interface ConfirmActionModalProps {
  action: ConfirmAction;
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({ action }) => {
  // Y/N key handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'y' || e.key === 'Y') {
        action.onConfirm();
      } else if (e.key === 'n' || e.key === 'N') {
        action.onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [action]);

  return (
    <ModalBase
      variant="default"
      title={action.title}
      titleIcon={<LucideAlertCircle size={20} className="text-gold-600" />}
      onClose={action.onCancel}
      closeOnBackdrop={true}
      closeOnEscape={true}
      maxWidth="md"
    >
      <div className="space-y-4">
        <p className="text-ink-700 dark:text-paper-200 font-serif text-base leading-relaxed">
          {action.description}
        </p>

        {action.warning && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded p-3">
            <p className="text-amber-800 dark:text-amber-300 text-sm font-mono">
              {action.warning}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={action.onConfirm}
            className="flex-1 px-4 py-2.5 bg-gold-600 hover:bg-gold-500 text-ink-900
              font-display font-medium rounded transition-colors text-sm"
          >
            {action.yesText || 'Yes, proceed'}
          </button>
          <button
            onClick={action.onCancel}
            className="flex-1 px-4 py-2.5 bg-paper-300 dark:bg-ink-700 hover:bg-paper-400 dark:hover:bg-ink-600
              text-ink-700 dark:text-paper-200 font-display font-medium rounded transition-colors text-sm
              border border-ink-200 dark:border-ink-600"
          >
            {action.noText || 'No, nevermind'}
          </button>
        </div>

        <p className="text-center text-xs text-ink-400 dark:text-ink-500 font-mono">
          Press Y to confirm, N or ESC to cancel
        </p>
      </div>
    </ModalBase>
  );
};

export default ConfirmActionModal;
