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
            <div className={`${sizeClasses[size]} ${borderClass} ${className} overflow-hidden bg-ink-900 relative`}>
                <img
                    src={photoPath}
                    alt={npc.name}
                    className="w-full h-full object-cover sepia-[0.3] contrast-[1.1]"
                    onError={() => setImageError(true)}
                />
                {/* Subtle vignette overlay for period feel */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/30" />
                {/* Historical figure indicator */}
                <div className="absolute top-1 right-1 bg-gold-600 text-ink-900 text-[8px] px-1 rounded font-bold">
                    ★
                </div>
            </div>
        );
    }

    // Fall back to ASCII portrait
    return (
        <div className={`${borderClass} ${className}`}>
            <Portrait
                archetype={npc.portraitArchetype || 'gentleman'}
                size={size}
                emotion={emotion}
                skinTone={npc.appearance?.skinTone}
                hairColor={npc.colors?.hair}
                clothingColor={npc.colors?.primary}
                secondaryColor={npc.colors?.secondary}
                speakingFrame={speaking ? speakingFrame : undefined}
            />
        </div>
    );
};

export default NpcPortrait;
