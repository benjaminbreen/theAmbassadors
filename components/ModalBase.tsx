import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { LucideX } from 'lucide-react';

export type ModalVariant = 'default' | 'gold' | 'embarrassment' | 'fatal' | 'dark';

interface ModalBaseProps {
  children: ReactNode;
  onClose?: () => void;
  variant?: ModalVariant;
  title?: string;
  titleIcon?: ReactNode;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  animationDuration?: number;
  className?: string;
  contentClassName?: string;
  // For custom backgrounds (like embarrassment gradient)
  customBackground?: string;
}

const variantStyles: Record<ModalVariant, {
  backdrop: string;
  container: string;
  header: string;
  headerText: string;
  closeButton: string;
}> = {
  default: {
    backdrop: 'bg-ink-900/70 backdrop-blur-sm',
    container: 'bg-paper-100 dark:bg-ink-800 border-2 border-gold-500',
    header: 'bg-gold-500/20 border-b border-gold-500/30',
    headerText: 'text-ink-900 dark:text-paper-100',
    closeButton: 'text-ink-400 hover:text-ink-600 dark:hover:text-paper-200',
  },
  gold: {
    backdrop: 'bg-ink-900/90 backdrop-blur-sm',
    container: 'bg-paper-100 dark:bg-ink-800 border-2 border-gold-600',
    header: 'bg-gold-600',
    headerText: 'text-ink-900',
    closeButton: 'text-ink-900 hover:text-ink-700',
  },
  embarrassment: {
    backdrop: '', // Custom gradient handled separately
    container: 'bg-gradient-to-b from-red-900/40 to-rose-900/30 border border-red-500/30',
    header: 'bg-red-900/40 border-b border-red-500/30',
    headerText: 'text-red-200',
    closeButton: 'text-red-300 hover:text-red-100',
  },
  fatal: {
    backdrop: '', // Custom gradient handled separately
    container: 'bg-gradient-to-b from-orange-900/40 to-red-900/30 border border-orange-500/30',
    header: 'bg-orange-900/40 border-b border-orange-500/30',
    headerText: 'text-orange-200',
    closeButton: 'text-orange-300 hover:text-orange-100',
  },
  dark: {
    backdrop: 'bg-ink-900/90 backdrop-blur-sm',
    container: 'bg-ink-800 border-2 border-ink-600',
    header: 'bg-ink-700 border-b border-ink-600',
    headerText: 'text-paper-100',
    closeButton: 'text-ink-400 hover:text-paper-200',
  },
};

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const ModalBase: React.FC<ModalBaseProps> = ({
  children,
  onClose,
  variant = 'default',
  title,
  titleIcon,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  maxWidth = 'md',
  animationDuration = 200,
  className = '',
  contentClassName = '',
  customBackground,
}) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), animationDuration);
    return () => clearTimeout(timer);
  }, [animationDuration]);

  // ESC key handler
  useEffect(() => {
    if (!closeOnEscape || !onClose) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeOnEscape, onClose]);

  // Focus trap - focus first focusable element on mount
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, []);

  const styles = variantStyles[variant];
  const backdropStyle = customBackground
    ? { background: customBackground }
    : undefined;

  const handleBackdropClick = () => {
    if (closeOnBackdrop && onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4
        ${customBackground ? '' : styles.backdrop}
        ${isAnimating ? 'opacity-0' : 'opacity-100'}
        transition-opacity`}
      style={{
        ...backdropStyle,
        transitionDuration: `${animationDuration}ms`,
      }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={`${styles.container} rounded-lg shadow-2xl
          ${maxWidthClasses[maxWidth]} w-full overflow-hidden
          ${isAnimating ? 'scale-95 translate-y-2' : 'scale-100 translate-y-0'}
          transition-all ${className}`}
        style={{ transitionDuration: `${animationDuration}ms` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - only render if title or close button */}
        {(title || showCloseButton) && (
          <div className={`${styles.header} px-4 py-3 flex items-center justify-between`}>
            {title ? (
              <div className="flex items-center gap-2">
                {titleIcon}
                <h3
                  id="modal-title"
                  className={`font-display text-lg font-bold ${styles.headerText}`}
                >
                  {title}
                </h3>
              </div>
            ) : (
              <div />
            )}
            {showCloseButton && onClose && (
              <button
                onClick={onClose}
                className={`${styles.closeButton} transition-colors`}
                aria-label="Close modal"
              >
                <LucideX size={18} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`p-5 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalBase;
