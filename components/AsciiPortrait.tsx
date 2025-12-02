
import React from 'react';
import { Mood, PortraitConfig, PortraitArchetype } from '../types';
import Portrait from './Portrait';
import { configToArchetype, moodToEmotion } from '../services/portraitMapper';

interface AsciiPortraitProps {
    config?: PortraitConfig; // If null, use Henry James default
    archetype?: PortraitArchetype; // Direct archetype override (for NPCs)
    mood: Mood;
    speaking: boolean;
    speakingFrame?: number; // 0, 1, or 2 for animated mouth
    className?: string;
    hatOff?: boolean; // For Henry James - shows bald head when hat is removed
    pinceNez?: boolean; // For Henry James - shows pince-nez glasses when equipped
}

const HENRY_JAMES_CONFIG: PortraitConfig = {
    hairStyle: 'GENTLEMAN',
    hairColor: 'text-zinc-400 dark:text-zinc-500',
    skinColor: 'text-amber-600/90 dark:text-amber-200',
    clothesColor: 'text-slate-500 dark:text-slate-500',
    facialHair: 'BEARD',
    accessory: 'MONOCLE'
};

const AsciiPortrait: React.FC<AsciiPortraitProps> = ({ config, archetype, mood, speaking, speakingFrame = 0, className, hatOff = false, pinceNez = false }) => {
    // Priority: direct archetype > config conversion > Henry James default
    let finalArchetype: PortraitArchetype;

    if (archetype) {
        // Use provided archetype directly (for NPCs with portraitArchetype field)
        finalArchetype = archetype;
    } else if (!config) {
        // No config provided - use Henry James archetype
        finalArchetype = 'henry_james';
    } else {
        // Convert old config to archetype
        finalArchetype = configToArchetype(config);
    }

    const emotion = moodToEmotion(mood, speaking);

    return (
        <Portrait
            archetype={finalArchetype}
            emotion={emotion}
            className={className}
            size="md"
            hatOff={hatOff}
            pinceNez={pinceNez}
            speakingFrame={speakingFrame}
        />
    );
};

export default AsciiPortrait;
