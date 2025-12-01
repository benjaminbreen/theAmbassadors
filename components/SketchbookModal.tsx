import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { LucideX, LucidePenTool, LucideCamera, LucideUsers, LucideImage, LucideMapPin } from 'lucide-react';
import { GalleryImage, MetNPC } from '../types';

type SketchbookTab = 'scenes' | 'people' | 'objects';

const SketchbookModal: React.FC = () => {
    const { state, dispatch } = useGame();
    const [activeTab, setActiveTab] = useState<SketchbookTab>('scenes');
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    if (!state.showSketchbook) return null;

    const { gallery, metNpcs } = state;

    // Format timestamp to relative time
    const formatRelativeTime = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    };

    // Render a scene/image entry
    const renderSceneEntry = (image: GalleryImage) => (
        <div
            key={image.id}
            className="group relative cursor-pointer"
            onClick={() => setSelectedImage(image)}
        >
            <div className="aspect-[4/3] rounded-lg overflow-hidden border-2 border-ink-700 hover:border-gold-500 transition-all shadow-lg">
                <img
                    src={`data:image/png;base64,${image.base64}`}
                    alt={image.location}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-900 to-transparent p-2 rounded-b-lg">
                <p className="text-paper-100 text-xs font-display truncate">{image.location}</p>
                <p className="text-paper-400 text-[10px]">{formatRelativeTime(image.timestamp)}</p>
            </div>
        </div>
    );

    // Render a person/NPC entry
    const renderPersonEntry = (npc: MetNPC) => (
        <div
            key={npc.id}
            className="bg-ink-800/50 rounded-lg border border-ink-700 p-4 hover:border-gold-600/50 transition-colors"
        >
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-600 to-gold-800 flex items-center justify-center shrink-0">
                    <span className="text-ink-900 font-display font-bold text-lg">
                        {npc.name.charAt(0)}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-paper-100 font-display font-bold truncate">
                        {npc.name}
                    </h4>
                    <p className="text-gold-400 text-xs uppercase tracking-wider">
                        {npc.profession}
                    </p>
                    <p className="text-paper-400 text-xs mt-1">
                        {npc.nationality}
                    </p>
                </div>
            </div>
            <p className="text-paper-300 text-sm mt-3 font-serif italic line-clamp-2">
                "{npc.description}"
            </p>
            <div className="flex items-center gap-1 mt-2 text-paper-500 text-[10px]">
                <LucideMapPin size={10} />
                <span>Met at {npc.metAt.zoneName}</span>
                <span className="mx-1">•</span>
                <span>{formatRelativeTime(npc.metAt.timestamp)}</span>
            </div>
        </div>
    );

    // Placeholder for objects - could be items examined, landmarks viewed, etc.
    const renderObjectsTab = () => {
        // For now, show items in inventory as "observed objects"
        const observedItems = state.player.inventory;

        if (observedItems.length === 0) {
            return (
                <div className="text-center py-12">
                    <LucideImage className="mx-auto text-ink-600 mb-4" size={48} />
                    <p className="text-paper-400 font-serif italic">
                        No objects have been scrutinized yet...
                    </p>
                    <p className="text-paper-500 text-sm mt-2">
                        Examine items and curiosities to add them here.
                    </p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {observedItems.map((item) => (
                    <div
                        key={item.id}
                        className="bg-ink-800/50 rounded-lg border border-ink-700 p-3 hover:border-gold-600/50 transition-colors"
                    >
                        <div className="text-2xl mb-2">{item.emoji || '?'}</div>
                        <h4 className="text-paper-100 font-display text-sm font-bold truncate">
                            {item.name}
                        </h4>
                        <p className="text-gold-400 text-[10px] uppercase tracking-wider">
                            {item.type}
                        </p>
                        <p className="text-paper-400 text-xs mt-1 line-clamp-2 font-serif italic">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        );
    };

    const hasContent = gallery.length > 0 || metNpcs.length > 0 || state.player.inventory.length > 0;

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                onClick={() => dispatch({ type: 'CLOSE_SKETCHBOOK' })}
            >
                <div
                    className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 rounded-lg border-2 border-gold-600 shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gold-600/50 bg-ink-900/80">
                        <div className="flex items-center gap-3">
                            <LucidePenTool className="text-gold-400" size={24} />
                            <div>
                                <h2 className="text-xl font-display text-gold-400 tracking-wider">
                                    The Sketchbook
                                </h2>
                                <p className="text-xs text-paper-400 font-serif italic">
                                    Impressions, acquaintances, and curiosities
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => dispatch({ type: 'CLOSE_SKETCHBOOK' })}
                            className="p-2 hover:bg-ink-700 rounded-full transition-colors"
                        >
                            <LucideX className="text-paper-400" size={20} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-ink-700 bg-ink-800/50">
                        <button
                            onClick={() => setActiveTab('scenes')}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-display transition-colors ${
                                activeTab === 'scenes'
                                    ? 'text-gold-400 border-b-2 border-gold-400 bg-ink-800'
                                    : 'text-paper-400 hover:text-paper-200'
                            }`}
                        >
                            <LucideCamera size={16} />
                            Captured Scenes
                            <span className="text-xs text-paper-500">({gallery.length})</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('people')}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-display transition-colors ${
                                activeTab === 'people'
                                    ? 'text-gold-400 border-b-2 border-gold-400 bg-ink-800'
                                    : 'text-paper-400 hover:text-paper-200'
                            }`}
                        >
                            <LucideUsers size={16} />
                            Acquaintances
                            <span className="text-xs text-paper-500">({metNpcs.length})</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('objects')}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-display transition-colors ${
                                activeTab === 'objects'
                                    ? 'text-gold-400 border-b-2 border-gold-400 bg-ink-800'
                                    : 'text-paper-400 hover:text-paper-200'
                            }`}
                        >
                            <LucideImage size={16} />
                            Curiosities
                            <span className="text-xs text-paper-500">({state.player.inventory.length})</span>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-[calc(85vh-160px)] p-6 custom-scrollbar">
                        {activeTab === 'scenes' && (
                            <>
                                {gallery.length === 0 ? (
                                    <div className="text-center py-12">
                                        <LucideCamera className="mx-auto text-ink-600 mb-4" size={48} />
                                        <p className="text-paper-400 font-serif italic text-lg mb-2">
                                            No scenes captured yet...
                                        </p>
                                        <p className="text-paper-500 text-sm">
                                            Use "Capture Scene" in the Observe panel to record impressions.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {gallery.map(renderSceneEntry)}
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'people' && (
                            <>
                                {metNpcs.length === 0 ? (
                                    <div className="text-center py-12">
                                        <LucideUsers className="mx-auto text-ink-600 mb-4" size={48} />
                                        <p className="text-paper-400 font-serif italic text-lg mb-2">
                                            No acquaintances yet...
                                        </p>
                                        <p className="text-paper-500 text-sm">
                                            Converse with people at the Exposition to add them here.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {metNpcs.map(renderPersonEntry)}
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'objects' && renderObjectsTab()}
                    </div>

                    {/* Footer stats */}
                    {hasContent && (
                        <div className="border-t border-ink-700 p-3 bg-ink-900/80 flex items-center justify-between text-xs text-paper-500">
                            <span>
                                {gallery.length} scene{gallery.length !== 1 ? 's' : ''} captured
                            </span>
                            <span>
                                {metNpcs.length} acquaintance{metNpcs.length !== 1 ? 's' : ''} made
                            </span>
                            <span>
                                {state.player.inventory.length} curiosit{state.player.inventory.length !== 1 ? 'ies' : 'y'} collected
                            </span>
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
                            className="absolute -top-10 right-0 p-2 text-paper-300 hover:text-white transition-colors"
                        >
                            <LucideX size={24} />
                        </button>
                        <img
                            src={`data:image/png;base64,${selectedImage.base64}`}
                            alt={selectedImage.location}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg border-2 border-gold-600 shadow-2xl"
                        />
                        <div className="mt-4 text-center">
                            <h3 className="text-gold-400 font-display text-lg">{selectedImage.location}</h3>
                            <p className="text-paper-400 text-sm font-serif italic mt-1">
                                {selectedImage.prompt}
                            </p>
                            <p className="text-paper-500 text-xs mt-2">
                                {formatRelativeTime(selectedImage.timestamp)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SketchbookModal;
