import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Item } from '../types';
import { LucidePackage, LucideBookOpen, LucideWrench, LucideSparkles, LucideInfo, LucideX, LucideScroll, LucideGem, LucideFlower2 } from 'lucide-react';
import { getItemGraphic } from './ItemGraphics';

// Convert item ID to image filename (fortune_card -> fortune-card.png)
const getImageSlug = (id: string): string => {
  return id.replace(/_/g, '-');
};

// Hook to check if an image exists
const useImageExists = (path: string | null): boolean => {
  const [exists, setExists] = useState(false);

  useEffect(() => {
    if (!path) {
      setExists(false);
      return;
    }

    const img = new Image();
    img.onload = () => setExists(true);
    img.onerror = () => setExists(false);
    img.src = path;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [path]);

  return exists;
};

// Get emoji fallback for items
const getItemEmoji = (item: Item): string => {
  const name = item.name.toLowerCase();
  const type = item.type;

  if (name.includes('book') || name.includes('guide') || name.includes('novel')) return '📖';
  if (name.includes('letter')) return '✉️';
  if (name.includes('playbill') || name.includes('ticket')) return '🎭';
  if (name.includes('map')) return '🗺️';
  if (name.includes('watch') || name.includes('clock')) return '⏱️';
  if (name.includes('glasses') || name.includes('opera')) return '🔎';
  if (name.includes('rose') || name.includes('flower')) return '🌹';
  if (name.includes('wine') || name.includes('champagne')) return '🍷';
  if (name.includes('cigar') || name.includes('tobacco')) return '🚬';
  if (name.includes('card') || name.includes('carte')) return '🃏';
  if (name.includes('key')) return '🔑';
  if (name.includes('coin') || name.includes('franc')) return '🪙';
  if (name.includes('photograph') || name.includes('photo')) return '📷';
  if (name.includes('thermometer')) return '🌡️';
  if (name.includes('magnif')) return '🔍';
  if (name.includes('pen') || name.includes('quill')) return '✒️';
  if (name.includes('ink')) return '🖋️';
  if (name.includes('absinthe')) return '🧪';

  switch (type) {
    case 'BOOK': return '📚';
    case 'DOCUMENT': return '📜';
    case 'TOOL': return '🔧';
    case 'CURIOSITY': return '✨';
    case 'ART': return '🎨';
    case 'CONSUMABLE': return '🍽️';
    case 'PERSONAL': return '💼';
    default: return '📦';
  }
};

// Large item icon component with beautiful styling - no container, just icon with glow
const LargeItemIcon: React.FC<{ item: Item; isHovered: boolean }> = ({ item, isHovered }) => {
  const imagePath = `/items/${getImageSlug(item.id)}.png`;
  const imageExists = useImageExists(imagePath);
  const svgGraphic = getItemGraphic(item.name);

  // Strong glow effect that intensifies on hover
  const glowStyle = {
    filter: isHovered
      ? 'drop-shadow(0 0 12px rgba(212, 175, 55, 0.7)) drop-shadow(0 0 20px rgba(212, 175, 55, 0.4)) drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
      : 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.5)) drop-shadow(0 0 16px rgba(212, 175, 55, 0.25)) drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
    transition: 'filter 0.3s ease, transform 0.3s ease',
    transform: isHovered ? 'scale(1.08)' : 'scale(1)',
  };

  if (imageExists) {
    return (
      <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
        <img
          src={imagePath}
          alt={item.name}
          className="w-18 h-18 object-contain"
          style={glowStyle}
        />
      </div>
    );
  }

  if (svgGraphic) {
    return (
      <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          style={glowStyle}
        >
          {svgGraphic}
        </svg>
      </div>
    );
  }

  // Emoji fallback
  return (
    <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
      <span
        className="text-5xl"
        style={{
          ...glowStyle,
          textShadow: isHovered
            ? '0 0 20px rgba(212, 175, 55, 0.7), 0 0 40px rgba(212, 175, 55, 0.4)'
            : '0 0 12px rgba(212, 175, 55, 0.5), 0 0 24px rgba(212, 175, 55, 0.25)',
        }}
      >
        {getItemEmoji(item)}
      </span>
    </div>
  );
};

// Extra large item icon for modal (bigger, clickable) - hover effects only
const ExtraLargeItemIcon: React.FC<{ item: Item; isHovered?: boolean; onClick?: () => void }> = ({ item, isHovered = false, onClick }) => {
  const imagePath = `/items/${getImageSlug(item.id)}.png`;
  const imageExists = useImageExists(imagePath);
  const svgGraphic = getItemGraphic(item.name);

  const containerClasses = `
    relative w-40 h-40 flex items-center justify-center rounded-xl
    bg-gradient-to-br from-ink-800/80 via-ink-900/90 to-black/95
    border-2 border-gold-500/60 shadow-xl shadow-gold-500/30
    transition-all duration-300 ease-out cursor-pointer
    ${isHovered ? 'scale-105 border-gold-400 shadow-2xl shadow-gold-500/40' : ''}
  `;

  // Glow effect - only on hover
  const glowEffect = isHovered && (
    <div className="absolute -inset-2 bg-gradient-to-r from-gold-500/20 via-gold-400/30 to-gold-500/20 rounded-2xl blur-lg -z-10" />
  );

  // Shimmer effect - only on hover
  const shimmerOverlay = isHovered && (
    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/15 to-transparent"
        style={{ animation: 'shimmer 1.5s ease-in-out infinite' }}
      />
    </div>
  );

  // Click hint
  const clickHint = (
    <div className={`absolute -bottom-1 font-mono left-0 right-0 text-center text-[10px] text-gray-500 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
      Click to enlarge
    </div>
  );

  if (imageExists) {
    return (
      <div className={containerClasses} onClick={onClick}>
        {glowEffect}
        <img
          src={imagePath}
          alt={item.name}
          className={`w-32 h-32 object-contain drop-shadow-xl transition-all duration-300 ${isHovered ? 'scale-105 brightness-110' : ''}`}
        />
        {shimmerOverlay}
        {clickHint}
      </div>
    );
  }

  if (svgGraphic) {
    return (
      <div className={containerClasses} onClick={onClick}>
        {glowEffect}
        <svg
          width="100"
          height="100"
          viewBox="0 0 24 24"
          className={`drop-shadow-xl transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}
        >
          {svgGraphic}
        </svg>
        {shimmerOverlay}
        {clickHint}
      </div>
    );
  }

  // Emoji fallback
  return (
    <div className={containerClasses} onClick={onClick}>
      {glowEffect}
      <span
        className={`text-7xl filter drop-shadow-xl transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}
        style={{ textShadow: isHovered ? '0 0 30px rgba(212, 175, 55, 0.5)' : 'none' }}
      >
        {getItemEmoji(item)}
      </span>
      {shimmerOverlay}
      {clickHint}
    </div>
  );
};

// Fullscreen icon preview modal
const IconPreviewModal: React.FC<{ item: Item; onClose: () => void }> = ({ item, onClose }) => {
  const imagePath = `/items/${getImageSlug(item.id)}.png`;
  const imageExists = useImageExists(imagePath);
  const svgGraphic = getItemGraphic(item.name);

  // Handle ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 animate-fade-in"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10"
        aria-label="Close"
      >
        <LucideX size={28} />
      </button>

      {/* Large icon display */}
      <div
        className="relative w-80 h-80 flex items-center justify-center rounded-2xl bg-gradient-to-br from-ink-800 via-ink-900 to-black border-2 border-gold-500/50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {imageExists ? (
          <img
            src={imagePath}
            alt={item.name}
            className="w-64 h-64 object-contain drop-shadow-2xl"
          />
        ) : svgGraphic ? (
          <svg width="200" height="200" viewBox="0 0 24 24" className="drop-shadow-2xl">
            {svgGraphic}
          </svg>
        ) : (
          <span className="text-9xl filter drop-shadow-2xl">{getItemEmoji(item)}</span>
        )}

        {/* Item name below */}
        <div className="absolute -bottom-16 left-0 right-0 text-center">
          <h4 className="font-display font-bold text-xl text-gold-400">{item.name}</h4>
        </div>
      </div>
    </div>
  );
};

// Component for item detail image
const ItemDetailImage: React.FC<{ item: Item }> = ({ item }) => {
  const imagePath = `/details/${getImageSlug(item.id)}.png`;
  const imageExists = useImageExists(imagePath);

  if (!imageExists) return null;

  return (
    <div className="mb-6 relative group">
      <div className="border-2 border-gold-600 rounded-lg overflow-hidden shadow-lg">
        <img
          src={imagePath}
          alt={item.name}
          className="w-full object-cover"
          style={{ maxHeight: '300px' }}
        />
        {/* Vignette overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)'
        }} />
      </div>
      {/* Tooltip */}
      <div className="absolute bottom-2 left-2 right-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="bg-black/70 text-paper-100 text-[10px] px-2 py-1 rounded italic">
          Image generated by Google Imagen 3 in the style of John Singer Sargent
        </span>
      </div>
    </div>
  );
};

interface InventoryPanelProps {
  inventory: Item[];
  onItemClick?: (item: Item) => void;
  onUseForRelief?: (itemId: string) => void;
  compact?: boolean;
  playerMalaise?: number;
  // External control for showing item modal (e.g., after pickup)
  externalSelectedItem?: Item | null;
  onExternalItemClose?: () => void;
}

const NEW_ITEM_HIGHLIGHT_DURATION = 10000; // 10 seconds

// Helper to check if item can provide malaise relief
const canProvideRelief = (item: Item): boolean => {
  const nameLower = item.name.toLowerCase();
  const descLower = item.description.toLowerCase();

  return nameLower.includes('wine') || nameLower.includes('champagne') || nameLower.includes('cognac') ||
         nameLower.includes('tobacco') || nameLower.includes('cigar') || nameLower.includes('cigarette') ||
         nameLower.includes('book') || descLower.includes('novel') || descLower.includes('poetry') ||
         item.type === 'ART' || item.type === 'CURIOSITY' ||
         descLower.includes('calm') || descLower.includes('sooth') || descLower.includes('relax');
};

const InventoryPanel: React.FC<InventoryPanelProps> = ({ inventory, onItemClick, onUseForRelief, compact = false, playerMalaise = 0, externalSelectedItem, onExternalItemClose }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [showIconPreview, setShowIconPreview] = useState(false);
  const [isIconHovered, setIsIconHovered] = useState(false);

  // Sync with external selected item (from pickup action)
  useEffect(() => {
    if (externalSelectedItem) {
      setSelectedItem(externalSelectedItem);
    }
  }, [externalSelectedItem]);

  // Handle closing the modal - notify parent if it was externally opened
  const handleCloseModal = () => {
    setSelectedItem(null);
    setShowIconPreview(false);
    if (externalSelectedItem && onExternalItemClose) {
      onExternalItemClose();
    }
  };

  // Check if item was recently acquired (within highlight duration)
  const isNewItem = (item: Item) => {
    if (!item.acquiredAt) return false;
    return Date.now() - item.acquiredAt < NEW_ITEM_HIGHLIGHT_DURATION;
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'COMMON': return 'text-gray-400';
      case 'UNCOMMON': return 'text-emerald-400';
      case 'RARE': return 'text-blue-400';
      case 'LEGENDARY': return 'text-gold-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityGlow = (rarity?: string) => {
    switch (rarity) {
      case 'UNCOMMON': return 'shadow-emerald-500/20';
      case 'RARE': return 'shadow-blue-500/30';
      case 'LEGENDARY': return 'shadow-gold-500/40';
      default: return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT':
        return <LucideScroll size={12} />;
      case 'BOOK':
        return <LucideBookOpen size={12} />;
      case 'TOOL':
        return <LucideWrench size={12} />;
      case 'CURIOSITY':
        return <LucideGem size={12} />;
      case 'ART':
        return <LucideFlower2 size={12} />;
      default:
        return <LucidePackage size={12} />;
    }
  };

  const filteredInventory = filter === 'ALL'
    ? inventory
    : inventory.filter(item => item.type === filter);

  const types = ['ALL', ...Array.from(new Set(inventory.map(i => i.type)))];

  if (compact) {
    return (
      <div className="max-h-64 overflow-y-auto space-y-1">
        {inventory.length === 0 ? (
          <p className="text-xs italic text-gray-500 text-center py-4">Empty pockets</p>
        ) : (
          inventory.map(item => (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className="w-full text-left p-2 hover:bg-gold-100 dark:hover:bg-gray-700 rounded text-xs font-serif border-b border-dashed border-gray-200 dark:border-gray-600 last:border-0 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{getItemEmoji(item)}</span>
                <span className="flex-1">{item.name}</span>
                {item.rarity && (
                  <span className={`text-[9px] font-bold uppercase ${getRarityColor(item.rarity)}`}>
                    {item.rarity}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Custom shimmer animation style */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Filter Tabs - Clean Inter font design */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 text-[11px] font-ui font-medium tracking-wide rounded-md transition-all duration-200 whitespace-nowrap relative
              ${filter === type
                ? 'bg-ink-700 dark:bg-gold-600 text-white dark:text-ink-900 shadow-sm'
                : 'bg-paper-100 dark:bg-ink-800/60 text-ink-500 dark:text-gray-400 hover:bg-paper-200 dark:hover:bg-ink-700 hover:text-ink-700 dark:hover:text-gold-400 border border-paper-300 dark:border-ink-700/50'
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
        {filteredInventory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-ink-400 dark:text-gray-500 italic text-xs">
            <LucidePackage size={32} className="mb-2 opacity-20" />
            <p className="text-ink-400 dark:text-gray-600">No {filter.toLowerCase()} items</p>
          </div>
        ) : (
          filteredInventory.map((item, index) => {
            const isHovered = hoveredItemId === item.id;
            const isNew = isNewItem(item);

            return (
              <div
                key={item.id}
                className="relative"
                style={{
                  animation: isNew ? 'float 2s ease-in-out infinite' : undefined,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <button
                  onClick={() => setSelectedItem(item)}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  className={`
                    w-full text-left rounded-xl border transition-all duration-300
                    transform relative overflow-hidden
                    ${isHovered ? 'scale-[1.01] -translate-y-0.5' : ''}
                    ${selectedItem?.id === item.id
                      ? 'border-gold-500 dark:border-gold-500 bg-gradient-to-br from-paper-50 to-paper-100 dark:from-gold-900/40 dark:to-ink-900 shadow-lg shadow-gold-500/15 dark:shadow-gold-500/20'
                      : isNew
                        ? 'border-gold-400 dark:border-gold-400/60 bg-gradient-to-br from-paper-50 to-white dark:from-gold-900/30 dark:to-ink-900 ring-2 ring-gold-300/50 dark:ring-gold-400/30'
                        : 'border-paper-300 dark:border-ink-700/50 bg-gradient-to-br from-white to-paper-50 dark:from-ink-800/80 dark:to-ink-900 hover:border-paper-400 dark:hover:border-gold-600/50 hover:shadow-md'
                    }
                    ${getRarityGlow(item.rarity)}
                  `}
                >
                  {/* New badge */}
                  {isNew && (
                    <div className="absolute -top-1 -right-1 z-10">
                      <span className="relative flex h-5 w-12">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-50"></span>
                        <span className="relative inline-flex items-center justify-center h-5 w-12 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-[8px] font-ui font-semibold text-white uppercase tracking-wider shadow-lg">
                          New!
                        </span>
                      </span>
                    </div>
                  )}

                  {/* Card content - horizontal layout with large icon */}
                  <div className="flex items-center p-3 gap-3">
                    {/* Large Icon - no container, just glow */}
                    <LargeItemIcon item={item} isHovered={isHovered} />

                    {/* Text content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      {/* Title row with type icon */}
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-gold-600 dark:text-gold-500/70 transition-colors duration-300 ${isHovered ? 'text-gold-500 dark:text-gold-400' : ''}`}>
                          {getTypeIcon(item.type)}
                        </span>
                        <h3 className={`font-display font-bold text-[15px] text-ink-800 dark:text-paper-100 leading-tight truncate transition-colors duration-300 ${isHovered ? 'text-ink-900 dark:text-gold-300' : ''}`}>
                          {item.name}
                        </h3>
                      </div>

                      {/* Description - larger, more legible text in ink color */}
                      <p className="text-[14px] text-ink-600 dark:text-gray-300 font-serif italic leading-snug line-clamp-2 mb-1.5">
                        {item.description}
                      </p>

                      {/* Rarity indicator */}
                      {item.rarity && item.rarity !== 'COMMON' && (
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            item.rarity === 'LEGENDARY' ? 'bg-gold-400 animate-pulse' :
                            item.rarity === 'RARE' ? 'bg-blue-400' :
                            'bg-emerald-400'
                          }`} />
                          <span className={`text-[10px] font-ui font-medium uppercase tracking-wide ${getRarityColor(item.rarity)}`}>
                            {item.rarity}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subtle hover shine effect */}
                  {isHovered && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/5 to-transparent"
                        style={{
                          animation: 'shimmer 1s ease-out forwards',
                        }}
                      />
                    </div>
                  )}

                  {/* Bottom accent line on hover */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 dark:via-gold-500 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-60' : 'opacity-0'}`} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Item Detail Modal - Rendered via Portal */}
      {selectedItem && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-fade-in backdrop-blur-sm" onClick={handleCloseModal}>
          <div
            className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 border-2 border-gold-600 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Faint background overlay with item icon in bottom right */}
            <div className="absolute -bottom-0 right-0 w-80 h-80 pointer-events-none opacity-[0.06]">
              {(() => {
                const imagePath = `/items/${getImageSlug(selectedItem.id)}.png`;
                return (
                  <img
                    src={imagePath}
                    alt=""
                    className="w-full h-full object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                );
              })()}
            </div>

            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-gold-500 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-gold-500 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-gold-500 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-gold-500 rounded-br-2xl" />

            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gold-400 transition-colors p-2 rounded-full hover:bg-ink-700/50"
              aria-label="Close"
            >
              <LucideX size={24} />
            </button>

            {/* Two-column layout */}
            <div className="flex flex-col md:flex-row relative z-10">
              {/* Left column - Icon and Title */}
              <div className="md:w-2/5 p-8 flex flex-col items-center justify-center bg-gradient-to-b from-ink-800/50 to-transparent border-b md:border-b-0 md:border-r border-gold-600/30">
                {/* Extra Large Icon - clickable */}
                <div
                  className="mb-4"
                  onMouseEnter={() => setIsIconHovered(true)}
                  onMouseLeave={() => setIsIconHovered(false)}
                >
                  <ExtraLargeItemIcon
                    item={selectedItem}
                    isHovered={isIconHovered}
                    onClick={() => setShowIconPreview(true)}
                  />
                </div>

                {/* Item name and type - smaller */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gold-500">
                    {getTypeIcon(selectedItem.type)}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-gray-500">{selectedItem.type}</span>
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-gold-400 leading-tight text-center mb-2">
                  {selectedItem.name}
                </h3>
                {selectedItem.rarity && (
                  <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider ${getRarityColor(selectedItem.rarity)} bg-ink-800/50 border border-current/20`}>
                    {selectedItem.rarity}
                  </div>
                )}

                {/* Detail Image (if exists) - shown below title on left */}
                <div className="mt-6 w-full">
                  <ItemDetailImage item={selectedItem} />
                </div>
              </div>

              {/* Right column - Description and details */}
              <div className="md:w-3/5 p-8">
                {/* Description */}
                <div className="mb-6 p-5 bg-black/30 rounded-xl border border-ink-700/50">
                  <p className="font-serif italic text-lg leading-relaxed text-gray-300">
                    "{selectedItem.description}"
                  </p>
                </div>

                {/* Content (for books/documents) */}
                {selectedItem.content && (
                  <div className="mb-6 p-5 bg-paper-100/5 rounded-xl border border-paper-100/10">
                    <div className="flex items-center gap-2 mb-3">
                      <LucideBookOpen size={16} className="text-gold-500" />
                      <span className="text-sm font-bold uppercase text-gold-500 tracking-wider">Contents</span>
                    </div>
                    <p className="text-base text-gray-300 leading-relaxed whitespace-pre-wrap font-serif">
                      {selectedItem.content}
                    </p>
                  </div>
                )}

                {/* Historical Note */}
                {selectedItem.historicalNote && (
                  <div className="mb-6 p-5 bg-blue-900/20 rounded-xl border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <LucideInfo size={16} className="text-blue-400" />
                      <span className="text-sm font-bold uppercase text-blue-400 tracking-wider">Historical Context</span>
                    </div>
                    <p className="text-base text-blue-200 leading-relaxed">
                      {selectedItem.historicalNote}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 mt-8">
                  {/* Use for Malaise Relief */}
                  {onUseForRelief && playerMalaise > 0 && canProvideRelief(selectedItem) && (
                    <button
                      onClick={() => {
                        onUseForRelief(selectedItem.id);
                        handleCloseModal();
                      }}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-display font-bold py-4 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 text-lg"
                    >
                      <span>🧘</span> Find Solace (Reduce Malaise)
                    </button>
                  )}

                  {onItemClick && (
                    <button
                      onClick={() => {
                        onItemClick(selectedItem);
                        handleCloseModal();
                      }}
                      className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white font-display font-bold py-4 px-6 rounded-xl shadow-lg shadow-gold-500/20 transition-all duration-300 hover:scale-[1.02] text-lg"
                    >
                      Use/Offer Item
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Icon Preview Modal */}
            {showIconPreview && (
              <IconPreviewModal
                item={selectedItem}
                onClose={() => setShowIconPreview(false)}
              />
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default InventoryPanel;
