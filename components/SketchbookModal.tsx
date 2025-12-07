import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { LucideX, LucidePenTool, LucideCamera, LucideUsers, LucideImage, LucideMapPin, LucideFeather, LucideSparkles } from 'lucide-react';
import { GalleryImage, MetNPC, Item } from '../types';
import { getItemGraphic } from './ItemGraphics';
import { playSound } from '../services/audioService';

type SketchbookTab = 'scenes' | 'people' | 'objects';

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

// Curiosity item icon with scrapbook styling
const CuriosityIcon: React.FC<{ item: Item }> = ({ item }) => {
    const imagePath = `/items/${getImageSlug(item.id)}.png`;
    const imageExists = useImageExists(imagePath);
    const svgGraphic = getItemGraphic(item.name);

    const glowStyle = {
        filter: 'drop-shadow(0 0 6px rgba(180, 140, 60, 0.4)) drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
    };

    if (imageExists) {
        return (
            <div className="w-16 h-16 flex items-center justify-center">
                <img
                    src={imagePath}
                    alt={item.name}
                    className="w-14 h-14 object-contain"
                    style={glowStyle}
                />
            </div>
        );
    }

    if (svgGraphic) {
        return (
            <div className="w-16 h-16 flex items-center justify-center">
                <svg
                    width="48"
                    height="48"
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
        <div className="w-16 h-16 flex items-center justify-center">
            <span
                className="text-4xl"
                style={{
                    textShadow: '0 0 8px rgba(180, 140, 60, 0.4), 0 2px 4px rgba(0,0,0,0.15)',
                }}
            >
                {getItemEmoji(item)}
            </span>
        </div>
    );
};

// Rarity color helper
const getRarityColor = (rarity?: string): string => {
    switch (rarity) {
        case 'legendary': return 'text-amber-500';
        case 'rare': return 'text-purple-600';
        case 'uncommon': return 'text-blue-600';
        default: return 'text-amber-700/60';
    }
};

const getRarityBorder = (rarity?: string): string => {
    switch (rarity) {
        case 'legendary': return 'border-amber-400 shadow-amber-200/50';
        case 'rare': return 'border-purple-400 shadow-purple-200/50';
        case 'uncommon': return 'border-blue-400 shadow-blue-200/50';
        default: return 'border-ink-200';
    }
};

const SketchbookModal: React.FC = () => {
    const { state, dispatch } = useGame();
    const [activeTab, setActiveTab] = useState<SketchbookTab>('scenes');
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    // Play page turn sound on mount
    useEffect(() => {
        if (state.showSketchbook && !state.audio.muted) {
            playSound('PAGE_TURN');
        }
    }, [state.showSketchbook]);

    if (!state.showSketchbook) return null;

    const { gallery, metNpcs } = state;

    // Format timestamp to a Victorian-style date
    const formatVictorianDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    // Format to relative time for recent items
    const formatRelativeTime = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'moments ago';
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} past`;
        const hours = Math.floor(minutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} past`;
    };

    // Render a scene/image entry with scrapbook styling
    const renderSceneEntry = (image: GalleryImage, index: number) => {
        // Alternate slight rotations for organic scrapbook feel
        const rotations = ['-1deg', '0.5deg', '-0.5deg', '1deg', '0deg'];
        const rotation = rotations[index % rotations.length];

        return (
            <div
                key={image.id}
                className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
                style={{ transform: `rotate(${rotation})` }}
                onClick={() => setSelectedImage(image)}
            >
                {/* Photo frame effect */}
                <div className="bg-paper-100 p-3 pb-12 shadow-xl border border-ink-300/50 rounded-sm relative">
                    {/* The image itself */}
                    <div className="aspect-[4/3] overflow-hidden border border-ink-200">
                        <img
                            src={image.base64.startsWith('data:') ? image.base64 : `data:image/png;base64,${image.base64}`}
                            alt={image.location}
                            className="w-full h-full object-cover sepia-[0.15] group-hover:sepia-0 transition-all duration-500"
                        />
                    </div>
                    {/* Handwritten caption */}
                    <div className="absolute bottom-2 left-0 right-0 text-center px-2">
                        <p className="font-cursive text-ink-700 text-sm italic truncate" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                            {image.location}
                        </p>
                        <p className="text-ink-400 text-[10px] mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>
                            {formatRelativeTime(image.timestamp)}
                        </p>
                    </div>
                    {/* Corner tape effects */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 bg-amber-100/80 rotate-45 transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-100/80 rotate-45 transform translate-x-1/2 -translate-y-1/2"></div>
                </div>
            </div>
        );
    };

    // Render a person/NPC entry with calling card style
    const renderPersonEntry = (npc: MetNPC, index: number) => {
        const rotations = ['0.5deg', '-0.5deg', '0deg', '1deg', '-1deg'];
        const rotation = rotations[index % rotations.length];

        return (
            <div
                key={npc.id}
                className="bg-paper-50 border border-ink-200 p-4 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ transform: `rotate(${rotation})` }}
            >
                {/* Calling card style header */}
                <div className="border-b border-ink-200 pb-3 mb-3">
                    <h4 className="text-ink-900 text-lg text-center" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                        {npc.name}
                    </h4>
                    <p className="text-ink-500 text-xs text-center uppercase tracking-widest mt-1">
                        {npc.profession}
                    </p>
                </div>
                <p className="text-ink-600 text-sm font-serif italic leading-relaxed line-clamp-3">
                    "{npc.description}"
                </p>
                <div className="flex items-center gap-1 mt-3 text-ink-400 text-[10px] justify-center" style={{ fontFamily: 'Georgia, serif' }}>
                    <LucideMapPin size={10} />
                    <span>Encountered at {npc.metAt.zoneName}</span>
                </div>
            </div>
        );
    };

    // Render objects/curiosities tab
    const renderObjectsTab = () => {
        const observedItems = state.player.inventory;

        if (observedItems.length === 0) {
            return (
                <div className="text-center py-12">
                    <LucideSparkles className="mx-auto text-amber-800/30 mb-4" size={48} />
                    <p className="text-amber-800/70 font-serif italic text-lg">
                        No curiosities collected yet...
                    </p>
                    <p className="text-amber-700/50 text-sm mt-2">
                        Acquire items and souvenirs to add them here.
                    </p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {observedItems.map((item, index) => {
                    const rotations = ['-0.5deg', '0.5deg', '0deg', '0.8deg', '-0.8deg'];
                    const rotation = rotations[index % rotations.length];

                    return (
                        <div
                            key={item.id}
                            className={`bg-paper-50 border-2 ${getRarityBorder(item.rarity)} p-4 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl group cursor-pointer relative overflow-hidden`}
                            style={{
                                transform: `rotate(${rotation})`,
                                animation: 'fadeSlideIn 0.4s ease-out forwards',
                                animationDelay: `${index * 60}ms`,
                                opacity: 0
                            }}
                        >
                            {/* Rarity indicator */}
                            {item.rarity && item.rarity !== 'common' && (
                                <div className={`absolute top-1 right-1 text-[9px] font-bold uppercase tracking-wider ${getRarityColor(item.rarity)}`}>
                                    {item.rarity === 'legendary' && '★★★'}
                                    {item.rarity === 'rare' && '★★'}
                                    {item.rarity === 'uncommon' && '★'}
                                </div>
                            )}

                            {/* Item icon */}
                            <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                                <CuriosityIcon item={item} />
                            </div>

                            {/* Item name */}
                            <h4 className="text-amber-900 text-sm text-center font-semibold leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                                {item.name}
                            </h4>

                            {/* Type badge */}
                            <div className="flex justify-center mt-1.5">
                                <span className="text-amber-700/60 text-[9px] uppercase tracking-widest bg-amber-100/50 px-2 py-0.5 rounded-full">
                                    {item.type}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-amber-800/70 text-xs mt-2 line-clamp-2 font-serif italic text-center leading-relaxed">
                                {item.description}
                            </p>

                            {/* Decorative corner */}
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-tl from-amber-200/40 to-transparent pointer-events-none" />
                        </div>
                    );
                })}
            </div>
        );
    };

    const hasContent = gallery.length > 0 || metNpcs.length > 0 || state.player.inventory.length > 0;

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={() => dispatch({ type: 'CLOSE_SKETCHBOOK' })}
            >
                <div
                    className="bg-[#f4ead5] rounded-lg border-4 border-double border-amber-800/60 shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative animate-modal-in"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Decorative corner flourishes */}
                    <div className="absolute top-2 left-2 text-amber-800/30 text-2xl">❦</div>
                    <div className="absolute top-2 right-2 text-amber-800/30 text-2xl">❦</div>

                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b-2 border-amber-800/30">
                        <div className="flex items-center gap-4">
                            <LucideFeather className="text-amber-800" size={28} />
                            <div>
                                <h2 className="text-2xl text-amber-900" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                                    The Sketchbook
                                </h2>
                                <p className="text-xs text-amber-700/70 tracking-wide">
                                    Impressions & Recollections from the Exposition
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => dispatch({ type: 'CLOSE_SKETCHBOOK' })}
                            className="p-2 hover:bg-amber-800/10 rounded-full transition-colors text-amber-800"
                        >
                            <LucideX size={24} />
                        </button>
                    </div>

                    {/* Tabs - styled like index tabs on a scrapbook */}
                    <div className="flex border-b border-amber-800/20 bg-[#efe5d0]">
                        <button
                            onClick={() => setActiveTab('scenes')}
                            className={`flex items-center gap-2 px-6 py-3 text-sm transition-all relative ${
                                activeTab === 'scenes'
                                    ? 'text-amber-900 bg-[#f4ead5] border-t-2 border-x border-amber-800/30 -mb-px rounded-t'
                                    : 'text-amber-700/70 hover:text-amber-800'
                            }`}
                            style={{ fontFamily: 'Georgia, serif' }}
                        >
                            <LucideCamera size={16} />
                            Captured Scenes
                            <span className="text-amber-600/60 text-xs ml-1">({gallery.length})</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('people')}
                            className={`flex items-center gap-2 px-6 py-3 text-sm transition-all relative ${
                                activeTab === 'people'
                                    ? 'text-amber-900 bg-[#f4ead5] border-t-2 border-x border-amber-800/30 -mb-px rounded-t'
                                    : 'text-amber-700/70 hover:text-amber-800'
                            }`}
                            style={{ fontFamily: 'Georgia, serif' }}
                        >
                            <LucideUsers size={16} />
                            Acquaintances
                            <span className="text-amber-600/60 text-xs ml-1">({metNpcs.length})</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('objects')}
                            className={`flex items-center gap-2 px-6 py-3 text-sm transition-all relative ${
                                activeTab === 'objects'
                                    ? 'text-amber-900 bg-[#f4ead5] border-t-2 border-x border-amber-800/30 -mb-px rounded-t'
                                    : 'text-amber-700/70 hover:text-amber-800'
                            }`}
                            style={{ fontFamily: 'Georgia, serif' }}
                        >
                            <LucideImage size={16} />
                            Curiosities
                            <span className="text-amber-600/60 text-xs ml-1">({state.player.inventory.length})</span>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-8">
                        {activeTab === 'scenes' && (
                            <>
                                {gallery.length === 0 ? (
                                    <div className="text-center py-16">
                                        <LucideCamera className="mx-auto text-amber-800/30 mb-4" size={64} />
                                        <p className="text-amber-800/70 text-xl mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                                            No scenes captured yet...
                                        </p>
                                        <p className="text-amber-700/50 text-sm">
                                            Use the "Observe" panel to capture impressions of your surroundings.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Title flourish */}
                                        <div className="text-center mb-8">
                                            <p className="text-amber-800/60 text-lg" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                                                — Scenes from the Universal Exposition —
                                            </p>
                                            <div className="w-24 h-px bg-amber-800/30 mx-auto mt-2"></div>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                            {gallery.map((img, i) => renderSceneEntry(img, i))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {activeTab === 'people' && (
                            <>
                                {metNpcs.length === 0 ? (
                                    <div className="text-center py-16">
                                        <LucideUsers className="mx-auto text-amber-800/30 mb-4" size={64} />
                                        <p className="text-amber-800/70 text-xl mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                                            No acquaintances yet...
                                        </p>
                                        <p className="text-amber-700/50 text-sm">
                                            Converse with visitors at the Exposition to collect their cards.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Title flourish */}
                                        <div className="text-center mb-8">
                                            <p className="text-amber-800/60 text-lg" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                                                — Calling Cards & Acquaintances —
                                            </p>
                                            <div className="w-24 h-px bg-amber-800/30 mx-auto mt-2"></div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                            {metNpcs.map((npc, i) => renderPersonEntry(npc, i))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {activeTab === 'objects' && (
                            <>
                                {/* Title flourish */}
                                {state.player.inventory.length > 0 && (
                                    <div className="text-center mb-8">
                                        <p className="text-amber-800/60 text-lg" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                                            — Souvenirs & Curiosities —
                                        </p>
                                        <div className="w-24 h-px bg-amber-800/30 mx-auto mt-2"></div>
                                    </div>
                                )}
                                {renderObjectsTab()}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    {hasContent && (
                        <div className="border-t border-amber-800/20 p-3 bg-[#efe5d0] flex items-center justify-center gap-8 text-xs text-amber-700/60" style={{ fontFamily: 'Georgia, serif' }}>
                            <span>{gallery.length} scene{gallery.length !== 1 ? 's' : ''} captured</span>
                            <span>•</span>
                            <span>{metNpcs.length} acquaintance{metNpcs.length !== 1 ? 's' : ''}</span>
                            <span>•</span>
                            <span>{state.player.inventory.length} curiosit{state.player.inventory.length !== 1 ? 'ies' : 'y'}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="max-w-4xl max-h-[90vh] relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 p-2 text-paper-300 hover:text-white transition-colors"
                        >
                            <LucideX size={28} />
                        </button>
                        {/* Scrapbook-style frame */}
                        <div className="bg-paper-100 p-4 pb-16 shadow-2xl">
                            <img
                                src={selectedImage.base64.startsWith('data:') ? selectedImage.base64 : `data:image/png;base64,${selectedImage.base64}`}
                                alt={selectedImage.location}
                                className="max-w-full max-h-[70vh] object-contain border border-ink-200"
                            />
                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                <h3 className="text-ink-800 text-xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                                    {selectedImage.location}
                                </h3>
                                <p className="text-ink-500 text-sm mt-1" style={{ fontFamily: 'Georgia, serif' }}>
                                    {formatVictorianDate(selectedImage.timestamp)}
                                </p>
                            </div>
                        </div>
                        {/* Caption below */}
                        <p className="text-paper-300 text-sm font-serif italic mt-4 text-center max-w-lg mx-auto">
                            "{selectedImage.prompt}"
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default SketchbookModal;
