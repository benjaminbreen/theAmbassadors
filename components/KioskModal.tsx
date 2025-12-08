import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { getKioskItems, KioskType } from '../data/consumables';
import { Item, StatEffect } from '../types';
import { LucideX, LucideCoins, LucideAlertTriangle, LucideSparkles, LucideShoppingBag } from 'lucide-react';
import { playSound } from '../services/audioService';

interface KioskModalProps {
    onClose: () => void;
}

const KIOSK_TITLES: Record<KioskType, { title: string; subtitle: string }> = {
    REFRESHMENTS: { title: 'Le Kiosque', subtitle: 'Refreshments & Sundries' },
    SOUVENIRS: { title: 'Souvenirs', subtitle: 'Mementos of the Exposition' },
    BOOKS: { title: 'Librairie', subtitle: 'Books & Publications' },
    PHOTOS: { title: 'Photographie', subtitle: 'Images & Stereoscopes' }
};

const KioskModal: React.FC<KioskModalProps> = ({ onClose }) => {
    const { state, dispatch } = useGame();
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
    const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Play greeting sound on mount
    useEffect(() => {
        if (!state.audio.muted) {
            playSound('NPC_GREET');
        }
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current);
            }
        };
    }, []);

    // Helper to set message with auto-clear
    const showMessage = useCallback((msg: string) => {
        if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
        }
        setPurchaseMessage(msg);
        messageTimeoutRef.current = setTimeout(() => setPurchaseMessage(null), 2000);
    }, []);

    const kioskType = state.kioskType;
    const kioskItems = getKioskItems(kioskType);
    const playerMoney = state.player.stats.money;
    const isRefreshments = kioskType === 'REFRESHMENTS';

    // Check if player already has an active effect from this item
    const hasActiveEffect = (itemId: string) => {
        return state.player.activeEffects.some(e => e.sourceItemId === itemId);
    };

    // Get stack count for an item
    const getStackCount = (itemId: string) => {
        const effect = state.player.activeEffects.find(e => e.sourceItemId === itemId);
        return effect?.stackCount || 0;
    };

    const handlePurchase = (item: Item) => {
        if (playerMoney < (item.price || 0)) {
            showMessage("You haven't sufficient funds for this indulgence.");
            return;
        }

        // PURCHASE_CONSUMABLE works for all items - adds to inventory and subtracts money
        dispatch({ type: 'PURCHASE_CONSUMABLE', payload: item } as any);
        showMessage(`You acquire ${item.name}.`);
    };

    const handleConsume = (item: Item) => {
        dispatch({ type: 'CONSUME_ITEM', payload: item } as any);

        const stackCount = getStackCount(item.id) + 1;
        const threshold = item.consumable?.stackPenalty?.threshold || 999;

        if (stackCount >= threshold) {
            showMessage(`You consume another ${item.name}... perhaps unwisely.`);
        } else {
            showMessage(`You partake of the ${item.name}.`);
        }
    };

    const formatEffects = (effects: StatEffect[]) => {
        return effects.map((e, i) => (
            <span key={i} className={`${e.delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {e.stat} {e.delta > 0 ? '+' : ''}{e.delta}
                {i < effects.length - 1 ? ', ' : ''}
            </span>
        ));
    };

    // Group items by category
    const beverages = kioskItems.filter(i =>
        ['absinthe', 'champagne', 'cognac', 'vin_rouge', 'cafe_noir', 'the_chinois', 'chocolat_chaud', 'turkish_coffee'].includes(i.id)
    );
    const food = kioskItems.filter(i =>
        ['croissant', 'oysters', 'pate', 'fromage', 'macaron'].includes(i.id)
    );
    const special = kioskItems.filter(i =>
        ['laudanum', 'smelling_salts'].includes(i.id)
    );

    // Items in inventory that are consumable
    const inventoryConsumables = state.player.inventory.filter(i => i.consumable);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 md:p-4 animate-fade-in">
            <div className="bg-gradient-to-b from-ink-800 to-ink-900 rounded-lg border-2 border-gold-600 max-w-2xl w-full max-h-[85dvh] md:max-h-[80vh] overflow-hidden flex flex-col animate-scale-bounce-in">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gold-600/50 bg-ink-900/50">
                    <div>
                        <h2 className="font-display text-xl text-gold-400">{KIOSK_TITLES[kioskType].title}</h2>
                        <p className="text-xs text-paper-300">{KIOSK_TITLES[kioskType].subtitle}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gold-400">
                            <LucideCoins size={16} />
                            <span className="font-bold">{playerMoney}₣</span>
                        </div>
                        <button onClick={onClose} className="text-paper-300 hover:text-paper-100">
                            <LucideX size={20} />
                        </button>
                    </div>
                </div>

                {/* Purchase message */}
                {purchaseMessage && (
                    <div className="px-4 py-2 bg-gold-600/20 border-b border-gold-600/30 text-center animate-fade-slide-down">
                        <span className="font-serif italic text-paper-100">{purchaseMessage}</span>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 space-y-4">
                    {isRefreshments ? (
                        <>
                            {/* Consumables in inventory */}
                            {inventoryConsumables.length > 0 && (
                                <div>
                                    <h3 className="font-display text-sm text-paper-100 uppercase tracking-wide mb-2 flex items-center gap-2">
                                        <span className="w-3 h-px bg-paper-300" />
                                        In Your Possession
                                        <span className="flex-1 h-px bg-paper-300" />
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {inventoryConsumables.map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleConsume(item)}
                                                className="bg-emerald-900/30 border border-emerald-500/50 rounded p-2 text-left hover:bg-emerald-900/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">{item.emoji || '🍽️'}</span>
                                                    <span className="font-bold text-paper-100 text-sm">{item.name}</span>
                                                </div>
                                                <div className="text-xs text-emerald-400">Tap to consume</div>
                                                {hasActiveEffect(item.id) && (
                                                    <div className="text-xs text-yellow-400 mt-1 flex items-center gap-1">
                                                        <LucideAlertTriangle size={10} />
                                                        Already active ({getStackCount(item.id)}x)
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Beverages */}
                            <div>
                                <h3 className="font-display text-sm text-paper-100 uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <span className="w-3 h-px bg-paper-300" />
                                    Beverages
                                    <span className="flex-1 h-px bg-paper-300" />
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {beverages.map(item => (
                                        <ItemCard
                                            key={item.id}
                                            item={item}
                                            canAfford={playerMoney >= (item.price || 0)}
                                            hasActive={hasActiveEffect(item.id)}
                                            stackCount={getStackCount(item.id)}
                                            onPurchase={() => handlePurchase(item)}
                                            onSelect={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                                            isSelected={selectedItem?.id === item.id}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Food */}
                            <div>
                                <h3 className="font-display text-sm text-paper-100 uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <span className="w-3 h-px bg-paper-300" />
                                    Provisions
                                    <span className="flex-1 h-px bg-paper-300" />
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {food.map(item => (
                                        <ItemCard
                                            key={item.id}
                                            item={item}
                                            canAfford={playerMoney >= (item.price || 0)}
                                            hasActive={hasActiveEffect(item.id)}
                                            stackCount={getStackCount(item.id)}
                                            onPurchase={() => handlePurchase(item)}
                                            onSelect={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                                            isSelected={selectedItem?.id === item.id}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Special */}
                            <div>
                                <h3 className="font-display text-sm text-paper-100 uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <span className="w-3 h-px bg-paper-300" />
                                    Medicaments
                                    <span className="flex-1 h-px bg-paper-300" />
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {special.map(item => (
                                        <ItemCard
                                            key={item.id}
                                            item={item}
                                            canAfford={playerMoney >= (item.price || 0)}
                                            hasActive={hasActiveEffect(item.id)}
                                            stackCount={getStackCount(item.id)}
                                            onPurchase={() => handlePurchase(item)}
                                            onSelect={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                                            isSelected={selectedItem?.id === item.id}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Souvenirs / Books / Photos - non-consumable items */
                        <div>
                            <h3 className="font-display text-sm text-paper-100 uppercase tracking-wide mb-2 flex items-center gap-2">
                                <span className="w-3 h-px bg-paper-300" />
                                Available Items
                                <span className="flex-1 h-px bg-paper-300" />
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {kioskItems.map(item => (
                                    <SouvenirCard
                                        key={item.id}
                                        item={item}
                                        canAfford={playerMoney >= (item.price || 0)}
                                        alreadyOwned={state.player.inventory.some(i => i.id === item.id)}
                                        onPurchase={() => handlePurchase(item)}
                                        onSelect={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                                        isSelected={selectedItem?.id === item.id}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Selected item detail */}
                {selectedItem && (
                    <div className="border-t border-gold-600/50 p-4 bg-ink-900/50">
                        <div className="flex items-start gap-3">
                            <span className="text-3xl">{selectedItem.emoji || '🍽️'}</span>
                            <div className="flex-1">
                                <h4 className="font-display font-bold text-gold-400">{selectedItem.name}</h4>
                                <p className="text-sm text-paper-200 mb-2">{selectedItem.description}</p>

                                {/* Effects breakdown - only for consumables */}
                                {selectedItem.consumable && (
                                    <div className="space-y-1 text-xs">
                                        <div className="flex items-center gap-2">
                                            <LucideSparkles size={12} className="text-emerald-400" />
                                            <span className="text-paper-300">Immediate:</span>
                                            {formatEffects(selectedItem.consumable.immediate)}
                                        </div>

                                        {selectedItem.consumable.delayed && (
                                            <div className="flex items-center gap-2">
                                                <LucideAlertTriangle size={12} className="text-yellow-400" />
                                                <span className="text-paper-300">After {selectedItem.consumable.delayed.delayMinutes}min:</span>
                                                {formatEffects(selectedItem.consumable.delayed.effects)}
                                            </div>
                                        )}

                                        {selectedItem.consumable.duration && (
                                            <div className="text-paper-400">
                                                Duration: {selectedItem.consumable.duration} minutes
                                            </div>
                                        )}

                                        {selectedItem.consumable.stackPenalty && (
                                            <div className="text-red-400 flex items-center gap-1">
                                                <LucideAlertTriangle size={12} />
                                                Warning: {selectedItem.consumable.stackPenalty.threshold}+ doses cause negative effects
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Type and rarity for non-consumables */}
                                {!selectedItem.consumable && (
                                    <div className="flex items-center gap-2 text-xs text-paper-400 mb-1">
                                        <span className="px-2 py-0.5 bg-ink-700 rounded">{selectedItem.type}</span>
                                        {selectedItem.rarity && (
                                            <span className={`px-2 py-0.5 rounded ${
                                                selectedItem.rarity === 'RARE' ? 'bg-purple-900/50 text-purple-300' :
                                                selectedItem.rarity === 'UNCOMMON' ? 'bg-blue-900/50 text-blue-300' :
                                                'bg-ink-700 text-paper-400'
                                            }`}>{selectedItem.rarity}</span>
                                        )}
                                    </div>
                                )}

                                {selectedItem.historicalNote && (
                                    <p className="text-xs text-paper-400 italic mt-2 border-t border-ink-600 pt-2">
                                        {selectedItem.historicalNote}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Item card component
interface ItemCardProps {
    item: Item;
    canAfford: boolean;
    hasActive: boolean;
    stackCount: number;
    onPurchase: () => void;
    onSelect: () => void;
    isSelected: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({
    item, canAfford, hasActive, stackCount, onPurchase, onSelect, isSelected
}) => {
    return (
        <div
            className={`relative rounded border p-2 transition-all cursor-pointer ${
                isSelected
                    ? 'bg-gold-900/30 border-gold-500'
                    : canAfford
                        ? 'bg-ink-800/50 border-ink-600 hover:border-gold-500/50'
                        : 'bg-ink-800/30 border-ink-700 opacity-60'
            }`}
            onClick={onSelect}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{item.emoji || '🍽️'}</span>
                    <div>
                        <div className="font-bold text-paper-100 text-sm">{item.name}</div>
                        <div className="text-xs text-paper-300 line-clamp-1">{item.description}</div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`font-bold ${canAfford ? 'text-gold-400' : 'text-red-400'}`}>
                        {item.price}₣
                    </span>
                    <button
                        onClick={(e) => { e.stopPropagation(); onPurchase(); }}
                        disabled={!canAfford}
                        className={`text-xs px-3 py-2 min-h-[36px] rounded font-display ${
                            canAfford
                                ? 'bg-gold-600 hover:bg-gold-500 text-ink-900 active:scale-95'
                                : 'bg-ink-600 text-paper-400 cursor-not-allowed'
                        }`}
                    >
                        Buy
                    </button>
                </div>
            </div>

            {hasActive && (
                <div className="absolute top-1 right-1 bg-yellow-500 text-ink-900 text-[10px] px-1 rounded font-bold">
                    {stackCount}x
                </div>
            )}
        </div>
    );
};

// Souvenir card component (for non-consumables)
interface SouvenirCardProps {
    item: Item;
    canAfford: boolean;
    alreadyOwned: boolean;
    onPurchase: () => void;
    onSelect: () => void;
    isSelected: boolean;
}

const SouvenirCard: React.FC<SouvenirCardProps> = ({
    item, canAfford, alreadyOwned, onPurchase, onSelect, isSelected
}) => {
    return (
        <div
            className={`relative rounded border p-2 transition-all cursor-pointer ${
                isSelected
                    ? 'bg-gold-900/30 border-gold-500'
                    : alreadyOwned
                        ? 'bg-emerald-900/20 border-emerald-600/50'
                        : canAfford
                            ? 'bg-ink-800/50 border-ink-600 hover:border-gold-500/50'
                            : 'bg-ink-800/30 border-ink-700 opacity-60'
            }`}
            onClick={onSelect}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{item.emoji || '🎁'}</span>
                    <div>
                        <div className="font-bold text-paper-100 text-sm">{item.name}</div>
                        <div className="text-xs text-paper-300 line-clamp-1">{item.description}</div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`font-bold ${canAfford ? 'text-gold-400' : 'text-red-400'}`}>
                        {item.price}₣
                    </span>
                    {alreadyOwned ? (
                        <span className="text-xs px-2 py-1 rounded bg-emerald-800/50 text-emerald-300 font-display">
                            Owned
                        </span>
                    ) : (
                        <button
                            onClick={(e) => { e.stopPropagation(); onPurchase(); }}
                            disabled={!canAfford}
                            className={`text-xs px-2 py-1 rounded font-display ${
                                canAfford
                                    ? 'bg-gold-600 hover:bg-gold-500 text-ink-900'
                                    : 'bg-ink-600 text-paper-400 cursor-not-allowed'
                            }`}
                        >
                            Buy
                        </button>
                    )}
                </div>
            </div>

            {/* Rarity indicator */}
            {item.rarity && item.rarity !== 'COMMON' && (
                <div className={`absolute top-1 right-1 text-[10px] px-1 rounded font-bold ${
                    item.rarity === 'RARE' ? 'bg-purple-500 text-white' :
                    item.rarity === 'UNCOMMON' ? 'bg-blue-500 text-white' :
                    'bg-gray-500 text-white'
                }`}>
                    {item.rarity === 'RARE' ? '★' : '◆'}
                </div>
            )}
        </div>
    );
};

export default KioskModal;
