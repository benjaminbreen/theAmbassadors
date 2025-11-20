
import React from 'react';
import { Mood, PortraitConfig } from '../types';
import Portrait from './Portrait';
import { configToArchetype, moodToEmotion } from '../services/portraitMapper';

interface AsciiPortraitProps {
    config?: PortraitConfig; // If null, use Henry James default
    mood: Mood;
    speaking: boolean;
    className?: string;
}

const HENRY_JAMES_CONFIG: PortraitConfig = {
    hairStyle: 'GENTLEMAN',
    hairColor: 'text-zinc-400 dark:text-zinc-500',
    skinColor: 'text-amber-600/90 dark:text-amber-200',
    clothesColor: 'text-slate-500 dark:text-slate-500',
    facialHair: 'BEARD',
    accessory: 'MONOCLE'
};

const AsciiPortrait: React.FC<AsciiPortraitProps> = ({ config, mood, speaking, className }) => {
    const activeConfig = config || HENRY_JAMES_CONFIG;

    // Convert old config to new archetype system
    const archetype = configToArchetype(activeConfig);
    const emotion = moodToEmotion(mood, speaking);

    return (
        <Portrait
            archetype={archetype}
            emotion={emotion}
            className={className}
            size="md"
        />
    );
};

export default AsciiPortrait;
