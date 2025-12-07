import React, { useState } from 'react';
import { NPC, Mood, PortraitArchetype } from '../types';
import Portrait from './Portrait';
import { moodToEmotion } from '../services/portraitMapper';

interface NpcPortraitProps {
    npc: NPC;
    mood?: Mood;
    speaking?: boolean;
    speakingFrame?: number;
    size?: 'sm' | 'md' | 'lg' | 'full';
    className?: string;
    showBorder?: boolean;
}

/**
 * NpcPortrait - Renders either a historical photo or ASCII portrait for an NPC
 *
 * For historical figures (npc.isHistoricalFigure === true), attempts to load
 * a photo from /portraits/historical/{historicalFigureId}.jpg
 * Falls back to ASCII portrait if image fails to load or doesn't exist.
 */
const NpcPortrait: React.FC<NpcPortraitProps> = ({
    npc,
    mood = 'NEUTRAL',
    speaking = false,
    speakingFrame = 0,
    size = 'md',
    className = '',
    showBorder = true
}) => {
    const [imageError, setImageError] = useState(false);

    // Size mappings for the container
    const sizeClasses: Record<string, string> = {
        sm: 'w-16 h-20',
        md: 'w-32 h-40',
        lg: 'w-48 h-60',
        full: 'w-full h-full'
    };

    // Check if we should try to show a historical photo
    const shouldShowPhoto = npc.isHistoricalFigure && npc.historicalFigureId && !imageError;
    const photoPath = `/portraits/historical/${npc.historicalFigureId}.jpg`;

    const emotion = moodToEmotion(mood, speaking);

    // Border styling
    const borderClass = showBorder ? 'border-2 border-gold-600 shadow-lg' : '';

    if (shouldShowPhoto) {
        return (
            <div className={`${sizeClasses[size]} ${className} overflow-hidden bg-ink-900 relative group`}>
                {/* Outer ornate frame */}
                <div className="absolute inset-0 border-2 border-gold-600 dark:border-gold-700/80 shadow-lg rounded-sm pointer-events-none z-10" />
                {/* Inner bevel frame */}
                <div className="absolute inset-0 border border-gold-400/30 dark:border-gold-500/20 pointer-events-none z-10" style={{ margin: '3px' }} />
                {/* Corner ornaments */}
                <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-gold-500/50 pointer-events-none z-10" />
                <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-gold-500/50 pointer-events-none z-10" />
                <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-gold-500/50 pointer-events-none z-10" />
                <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-gold-500/50 pointer-events-none z-10" />

                <img
                    src={photoPath}
                    alt={npc.name}
                    className="w-full h-full object-cover sepia-[0.3] contrast-[1.1] animate-portrait-breathe transition-transform duration-300 group-hover:scale-[1.02]"
                    onError={() => setImageError(true)}
                />
                {/* Victorian vignette overlay */}
                <div className="absolute inset-0 pointer-events-none z-10" style={{
                    background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.4) 100%)'
                }} />
                {/* Bottom gradient for depth */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/30 z-10" />
                {/* Inner shadow for recessed frame feel */}
                <div className="absolute inset-0 shadow-[inset_0_0_12px_rgba(0,0,0,0.4)] pointer-events-none z-10" />
                {/* Historical figure indicator - ornate badge */}
                <div className="absolute top-1.5 right-1.5 bg-gradient-to-b from-gold-500 to-gold-700 text-ink-900 text-[8px] px-1.5 py-0.5 rounded-sm font-bold shadow-md border border-gold-400/50 z-20">
                    ★
                </div>
            </div>
        );
    }

    // Fall back to ASCII portrait with Victorian frame
    return (
        <div className={`${sizeClasses[size]} ${className} overflow-hidden bg-ink-900 relative group`}>
            {/* Outer ornate frame */}
            <div className="absolute inset-0 border-2 border-gold-600/70 dark:border-gold-700/60 shadow-lg rounded-sm pointer-events-none z-10" />
            {/* Inner bevel frame */}
            <div className="absolute inset-0 border border-gold-400/20 dark:border-gold-500/15 pointer-events-none z-10" style={{ margin: '2px' }} />

            <div className="w-full h-full flex items-center justify-center">
                <Portrait
                    archetype={npc.portraitArchetype || 'gentleman'}
                    size={size}
                    emotion={emotion}
                    skinTone={npc.appearance?.skinTone}
                    hairColor={npc.colors?.hair}
                    clothingColor={npc.colors?.primary}
                    secondaryColor={npc.colors?.secondary}
                    facialHair={npc.appearance?.facialHair as any}
                    speakingFrame={speaking ? speakingFrame : undefined}
                />
            </div>
            {/* Inner shadow for depth */}
            <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] pointer-events-none z-10" />
        </div>
    );
};

export default NpcPortrait;
