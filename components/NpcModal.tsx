
import React from 'react';
import { NPC } from '../types';
import { useGame } from '../context/GameContext';
import { LucideX, LucideUser, LucideMessageSquare, LucideBookOpen, LucideStar, LucideSparkles, LucideHome, LucideGlobe } from 'lucide-react';
import NpcPortrait from './NpcPortrait';
import { getFlagEmoji } from '../utils/nationalityFlags';

interface NpcModalProps {
    npc: NPC;
    onClose: () => void;
    onTalk?: () => void;
}

const NpcModal: React.FC<NpcModalProps> = ({ npc, onClose, onTalk }) => {
    const { state } = useGame();

    // Calculate distance to check if conversation is possible
    const player = state.player;
    const dx = Math.abs(npc.location.x - player.x);
    const dy = Math.abs(npc.location.y - player.y);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const canTalk = distance <= 2;

    // Format location for display
    const formatLocation = (loc?: { city: string; region?: string; country: string }) => {
        if (!loc) return null;
        if (loc.region) {
            return `${loc.region}, ${loc.city}`;
        }
        return `${loc.city}, ${loc.country}`;
    };

    const birthplaceStr = formatLocation(npc.birthplace);
    const residenceStr = formatLocation(npc.currentResidence);

    return (
        <div
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-paper-100 dark:bg-gray-900 w-full max-w-2xl rounded-lg border-4 border-gold-600 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-ink-900 via-ink-800 to-ink-900 px-6 py-4 flex items-center justify-between border-b-2 border-gold-600">
                    <div className="flex items-center gap-4">
                        <LucideUser className="text-gold-500" size={24} />
                        <div>
                            <h1 className="font-display text-2xl font-bold text-gold-500 tracking-wide uppercase">
                                {npc.name}
                                {npc.isHistoricalFigure && (
                                    <LucideStar className="inline-block ml-2 text-yellow-400" size={16} />
                                )}
                            </h1>
                            <p className="text-paper-300 text-base tracking-widest uppercase flex items-center gap-2">
                                <span>{npc.profession}</span>
                                <span className="text-paper-500">•</span>
                                <span className="text-amber-400 font-bold">
                                    {getFlagEmoji(npc.nationality)} {npc.nationality || 'French'}
                                </span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-paper-300 hover:text-white p-2 rounded-full hover:bg-ink-700 transition-all"
                    >
                        <LucideX size={20} />
                    </button>
                </div>

                <div className="flex">
                    {/* Left Column: Portrait & Quick Info */}
                    <div className="w-56 bg-ink-900/5 dark:bg-ink-900/50 border-r border-gold-600/30 p-5 flex flex-col items-center">
                        <div className="mb-4">
                            <NpcPortrait
                                npc={npc}
                                size="md"
                                mood="NEUTRAL"
                                showBorder={true}
                            />
                        </div>

                        {/* Vital Statistics */}
                        <div className="w-full space-y-3 text-xs">
                            {/* Age and Gender */}
                            <div className="bg-paper-200 dark:bg-ink-800 rounded p-2">
                                <p className="text-ink-500 dark:text-paper-500 uppercase font-bold text-sm mb-1">Age</p>
                                <p className="text-ink-700 text-base  dark:text-paper-300">
                                    {npc.age} years old
                                    <span className="text-ink-500 text-sm dark:text-paper-500 ml-1">
                                        ({npc.gender === 'female' ? '♀' : npc.gender === 'male' ? '♂' : '⚥'})
                                    </span>
                                </p>
                            </div>

                            {/* Birthplace */}
                            {birthplaceStr && (
                                <div className="bg-paper-200 dark:bg-ink-800 rounded p-2">
                                    <p className="text-ink-500 dark:text-paper-500 uppercase font-bold text-sm  mb-1 flex items-center gap-1">
                                        <LucideGlobe size={10} />
                                        Birthplace
                                    </p>
                                    <p className="text-ink-700 text-base  dark:text-paper-300">{birthplaceStr}</p>
                                </div>
                            )}

                            {/* Residence */}
                            {residenceStr && (
                                <div className="bg-paper-200 dark:bg-ink-800 rounded p-2">
                                    <p className="text-ink-500 dark:text-paper-500 uppercase font-bold text-sm  mb-1 flex items-center gap-1">
                                        <LucideHome size={10} />
                                        Residence
                                    </p>
                                    <p className="text-ink-700 text-base  dark:text-paper-300">{residenceStr}</p>
                                </div>
                            )}

                            {/* Nationality */}
                            <div className="bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 rounded p-2 border border-amber-300/50 dark:border-amber-600/30">
                                <p className="text-amber-700 dark:text-amber-400 uppercase font-bold text-sm  mb-1">
                                    Nationality
                                </p>
                                <p className="text-amber-900 text-base  dark:text-amber-300 font-semibold flex items-center gap-1.5">
                                    <span className="text-base">{getFlagEmoji(npc.nationality)}</span>
                                    <span>{npc.nationality || 'French'}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
                        {/* Historical Figure Banner */}
                        {npc.isHistoricalFigure && (
                            <div className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 dark:from-yellow-900/40 dark:to-amber-900/40 border border-yellow-500/30 rounded-lg p-3 mb-4">
                                <div className="flex items-start gap-2">
                                    <LucideSparkles className="text-yellow-500 flex-shrink-0 mt-0.5" size={16} />
                                    <div>
                                        <p className="text-yellow-800 dark:text-yellow-200 text-sm font-bold">
                                            Historical Figure
                                        </p>
                                        <p className="text-yellow-700 dark:text-yellow-300 text-xs">
                                            This person is based on a real historical figure who attended or may have attended the 1889 Exposition.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* First Impression */}
                        <div className="mb-5">
                            <h3 className="text-ink-900 dark:text-paper-400 text-sm uppercase font-bold tracking-wider mb-2">
                                First Impression
                            </h3>
                            <p className="text-ink-700 dark:text-paper-300 text-base leading-relaxed">
                                {npc.description}
                            </p>
                        </div>

                        {/* Biography / Historical Note */}
                        {npc.historicalNote && (
                            <div className="mb-4">
                                <h3 className="text-ink-900 dark:text-paper-400 text-sm uppercase font-bold tracking-wider mb-2">
                                    <LucideBookOpen className="inline mr-1 " size={12} />
                                    {npc.isHistoricalFigure ? 'Historical Background' : 'Biography'}
                                </h3>
                                <div className="bg-ink-900/5 dark:bg-ink-800/50 border-l-4 border-gold-600 p-3 rounded-r">
                                    <p className="text-ink-900 dark:text-paper-400 text-sm leading-relaxed">
                                        {npc.historicalNote}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Current Pursuit */}
                        <div className="mb-5">
                            <h3 className="text-ink-900 dark:text-paper-400 text-sm uppercase font-bold tracking-wider mb-2">
                                Current Pursuit
                            </h3>
                            <p className="text-ink-700 dark:text-paper-300 text-base leading-relaxed">
                                {npc.goal}
                            </p>
                        </div>

                        {/* Manner of Speech */}
                        <div className="mb-5">
                            <h3 className="text-ink-900 dark:text-paper-400 text-sm uppercase font-bold tracking-wider mb-2">
                                <LucideMessageSquare className="inline mr-1" size={12} />
                                Manner of Speech
                            </h3>
                            <p className="text-ink-600 dark:text-paper-400 text-base leading-relaxed italic">
                                {npc.dialogueStyle}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer with Actions */}
                <div className="bg-ink-900/5 dark:bg-ink-800 border-t border-gold-600/30 px-6 py-4 flex items-center justify-between">
                    <p className="text-ink-500 dark:text-paper-500 text-xs italic">
                        {canTalk
                            ? "Within speaking distance"
                            : `${Math.round(distance)} tiles away`
                        }
                    </p>
                    <div className="flex gap-3">
                        {canTalk && onTalk && (
                            <button
                                onClick={() => {
                                    onClose();
                                    onTalk();
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-gold-600 hover:bg-gold-500 text-white rounded font-bold text-sm transition-all"
                            >
                                <LucideMessageSquare size={16} />
                                Converse
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-ink-200 dark:bg-ink-700 hover:bg-ink-300 dark:hover:bg-ink-600 text-ink-700 dark:text-paper-300 rounded font-bold text-sm transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NpcModal;
