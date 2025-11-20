# Portrait System Upgrade

## Overview
The portrait system has been upgraded from primitive ASCII art to beautiful, animated SVG portraits with multiple archetypes and emotions.

## New Features

### Portrait Archetypes
8 unique character archetypes with distinct visual styles:
- **mobster_m** - Male gangster with fedora and cigar
- **mobster_f** - Female gangster with cloche hat and scarf
- **flapper** - 1920s flapper with headband, pearls, and finger waves
- **cop** - Police officer with uniform and cap
- **worker** - Working class with newsboy cap and vest
- **gentleman** - Distinguished gentleman with glasses and suit
- **sailor** - Sailor with simple shirt
- **pharmacist** - Elderly pharmacist with glasses and balding

### Portrait Emotions
7 different emotional states that affect facial expressions:
- **neutral** - Default calm expression
- **happy** - Smiling, raised eyebrows
- **angry** - Furrowed brows, frowning
- **suspicious** - One raised eyebrow, slight frown
- **afraid** - Wide eyes, raised eyebrows
- **dead** - Dark overlay
- **injured** - Bruising, pained expression

### Animations
- **Blinking** - Eyes blink naturally every ~5 seconds
- **Breathing** - Subtle chest movement
- **Smoke particles** - For cigar accessory
- **Ember glow** - Pulsing cigar tip

## Technical Changes

### New Files
1. **components/Portrait.tsx** - Main SVG portrait component with all visual layers
2. **services/portraitMapper.ts** - Utility functions for converting between old and new systems

### Updated Files
1. **types.ts** - Added PortraitArchetype and PortraitEmotion types, added portraitArchetype field to NPC interface
2. **components/AsciiPortrait.tsx** - Now a wrapper that converts old API to new Portrait component
3. **services/npcGenerator.ts** - Now assigns random archetype based on profession, age, and gender
4. **constants.ts** - Updated Oscar Wilde NPC with archetype

### Backwards Compatibility
The old `AsciiPortrait` component still works with the same API:
```tsx
<AsciiPortrait
  config={npc.portrait}  // Old PortraitConfig
  mood="NEUTRAL"          // Old Mood type
  speaking={false}
/>
```

It now automatically converts to the new system:
- `PortraitConfig` → `PortraitArchetype` (via configToArchetype)
- `Mood` → `PortraitEmotion` (via moodToEmotion)

### Direct Usage
You can also use the new Portrait component directly:
```tsx
import Portrait from './components/Portrait';

<Portrait
  archetype="gentleman"
  emotion="happy"
  size="lg"
/>
```

## Smart Archetype Assignment

NPCs are automatically assigned archetypes based on:
1. **Profession** - Police officers get 'cop', workers get 'worker', etc.
2. **Age** - Older NPCs (60+) are more likely to be pharmacists or gentlemen
3. **Gender** - Female NPCs get flapper or mobster_f archetypes

## Visual Features

### Layered SVG Construction
Each portrait is composed of multiple layers:
1. Background hair (for longer hairstyles)
2. Clothing/torso
3. Accessories (pearls, scarves)
4. Face (with procedural skin tones and shading)
5. Front hair
6. Hats/headwear

### Skin Tones
4 realistic skin tone palettes with base, shadow, highlight, and blush colors:
- Pale
- Tan
- Olive
- Dark

### Clothing Styles
- Suits (with shirt, tie, and lapels)
- Dresses (with sequin effects and elegant necklines)
- Uniforms (with badges and gold trim)
- Vests (working class)

### Accessories
- Pearls (double strand necklace)
- Scarf (burgundy, flowing)
- Glasses (gold-rimmed)
- Cigar (with smoke and ember)

## Build Status
✅ Build successful
✅ Dev server runs without errors
✅ All existing portrait usages automatically upgraded

## Examples in Game
- **Player Modal** - Henry James appears as a 'gentleman' archetype
- **NPC Dialogue** - All NPCs now have beautifully rendered portraits
- **Combat View** - Opponent portraits with emotion based on context
- **Overworld** - NPC sprites still use simple representations, but detailed portraits appear in dialogues
