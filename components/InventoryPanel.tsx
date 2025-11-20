import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Item } from '../types';
import { LucidePackage, LucideBookOpen, LucideWrench, LucideSparkles, LucideInfo, LucideX } from 'lucide-react';

interface InventoryPanelProps {
  inventory: Item[];
  onItemClick?: (item: Item) => void;
  compact?: boolean;
}

const InventoryPanel: React.FC<InventoryPanelProps> = ({ inventory, onItemClick, compact = false }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'COMMON': return 'text-gray-600 dark:text-gray-400';
      case 'UNCOMMON': return 'text-green-600 dark:text-green-400';
      case 'RARE': return 'text-blue-600 dark:text-blue-400';
      case 'LEGENDARY': return 'text-gold-500';
      default: return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT':
      case 'BOOK':
        return <LucideBookOpen size={14} />;
      case 'TOOL':
        return <LucideWrench size={14} />;
      case 'CURIOSITY':
      case 'ART':
        return <LucideSparkles size={14} />;
      default:
        return <LucidePackage size={14} />;
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
                {getTypeIcon(item.type)}
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
      {/* Filter Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-2 border-b border-gold-600/20">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded transition-colors whitespace-nowrap
              ${filter === type
                ? 'bg-gold-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gold-400'
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="flex-1 overflow-y-auto">
        {filteredInventory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 italic">
            <LucidePackage size={48} className="mb-2 opacity-30" />
            <p>No {filter.toLowerCase()} items</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredInventory.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`text-left p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg
                  ${selectedItem?.id === item.id
                    ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gold-400'
                  }`}
              >
                {/* Item Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="text-gold-600 dark:text-gold-400">
                      {getTypeIcon(item.type)}
                    </div>
                    <span className="font-display font-bold text-sm text-ink-900 dark:text-paper-100 leading-tight">
                      {item.name}
                    </span>
                  </div>
                  {item.rarity && (
                    <span className={`text-[9px] font-bold uppercase ml-2 ${getRarityColor(item.rarity)}`}>
                      {item.rarity}
                    </span>
                  )}
                </div>

                {/* Item Description */}
                <p className="text-xs text-gray-600 dark:text-gray-400 font-serif italic line-clamp-2">
                  {item.description}
                </p>

                {/* Item Type Badge */}
                <div className="mt-2">
                  <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-[9px] font-mono uppercase text-gray-600 dark:text-gray-400 rounded">
                    {item.type}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Item Detail Modal - Rendered via Portal */}
      {selectedItem && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in" onClick={() => setSelectedItem(null)}>
          <div className="bg-paper-100 dark:bg-gray-800 border-4 border-gold-600 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-ink-600 dark:text-gray-400 hover:text-gold-600 transition-colors"
              aria-label="Close"
            >
              <LucideX size={24} />
            </button>

            {/* Item Name */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-gold-600 dark:text-gold-400">
                  {getTypeIcon(selectedItem.type)}
                </div>
                <h3 className="font-display font-bold text-2xl md:text-3xl text-ink-900 dark:text-gold-500">
                  {selectedItem.name}
                </h3>
              </div>
              {selectedItem.rarity && (
                <div className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase ${getRarityColor(selectedItem.rarity)}`}>
                  {selectedItem.rarity}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6 p-4 md:p-6 bg-white dark:bg-black/30 rounded border border-gray-200 dark:border-gray-700">
              <p className="font-serif italic text-base md:text-lg leading-relaxed text-ink-800 dark:text-gray-300">
                "{selectedItem.description}"
              </p>
            </div>

            {/* Content (for books/documents) */}
            {selectedItem.content && (
              <div className="mb-6 p-4 md:p-6 bg-paper-50 dark:bg-gray-900 rounded border border-ink-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <LucideBookOpen size={16} className="text-ink-600 dark:text-gray-400" />
                  <span className="text-sm font-bold uppercase text-ink-700 dark:text-gray-400">Content</span>
                </div>
                <p className="text-sm text-ink-800 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedItem.content}
                </p>
              </div>
            )}

            {/* Historical Note */}
            {selectedItem.historicalNote && (
              <div className="mb-6 p-4 md:p-6 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-3">
                  <LucideInfo size={16} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-bold uppercase text-blue-700 dark:text-blue-400">Historical Context</span>
                </div>
                <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                  {selectedItem.historicalNote}
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex justify-between border-b border-dashed border-gray-300 dark:border-gray-600 pb-2">
                <span className="font-bold">Type:</span>
                <span className="font-mono">{selectedItem.type}</span>
              </div>
              {selectedItem.category && (
                <div className="flex justify-between border-b border-dashed border-gray-300 dark:border-gray-600 pb-2">
                  <span className="font-bold">Category:</span>
                  <span className="font-mono">{selectedItem.category}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-bold">Item ID:</span>
                <span className="font-mono text-xs">{selectedItem.id.substring(0, 16)}...</span>
              </div>
            </div>

            {/* Action Button */}
            {onItemClick && (
              <button
                onClick={() => {
                  onItemClick(selectedItem);
                  setSelectedItem(null);
                }}
                className="w-full bg-gold-600 hover:bg-gold-700 text-white font-display font-bold py-3 px-6 rounded-lg shadow-lg transition-colors text-base md:text-lg"
              >
                Use/Offer Item
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default InventoryPanel;
