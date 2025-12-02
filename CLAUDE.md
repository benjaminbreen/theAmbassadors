# The Ambassadors: 1889 - Project Documentation

A literary RPG game set at the 1889 Paris World's Fair, featuring Henry James as the protagonist. Built with React, TypeScript, Vite, and Gemini AI.

## Current State (December 2024)

### Recently Completed
- **Tile Registry System**: Complete migration to semantic IDs
  - 130+ tile definitions with metadata (walkable, transparent, generator, etc.)
  - All tile categories covered: terrain, walls, doors, flora, furniture, lighting, machines, statues, fountains, village, tower, special
  - Helper functions: `resolveTile()`, `isWalkable()`, `isObjectTile()`, `hasGenerator()`, `getTileId()`, `getCharFromId()`
  - All graphics files now use semantic IDs as keys (e.g., `TREE`, `LAMP`, `FOUNTAIN_BASIN_N`)
  - MapTile routing uses `getTileId(char)` to look up graphics by semantic ID
  - mapGenerator imports `TILES_FROM_REGISTRY` - single source of truth for tile definitions
  - Legacy aliases maintained for backward compatibility (LANDMARK_TOWER, EXHIBIT, etc.)

- **Event System Improvements**:
  - Reduced frequency of repetitive events (Minny Temple, American ordering coffee)
  - Dismissed events (X button or ESC) are tracked and won't reappear
  - ESC key closes event modal

- **Graphics Improvements**:
  - Haussmann-style Parisian building facades for STREET biome walls
  - Beaux-Arts wall sconces with correct orientation and warm glow
  - Floor cushions with 5 variants and 7 color palettes
  - Improved trees, hedges, lamps with position-based variety

### Architecture Overview

#### Map System
- **Grid Storage**: `Zone.mapData: string[]` - array of character strings
- **Rendering Flow**: `mapGenerator.ts` → `Zone` → `OverworldMap.tsx` → `MapTile`
- **Tile Registry**: `components/MapTile/TileRegistry.ts` - semantic tile definitions
- **Graphics Files**:
  - `ObjectGraphics.tsx` - furniture, objects, doors, chairs
  - `TerrainGraphics.tsx` - water, paths, special terrain
  - `WallGraphics.tsx` - wall styles, Haussmann facades
  - `SpecialGraphics.tsx` - generators (tree, hedge, lamp, cushion, kiosk, sconce)
  - `StatueGraphics.tsx` - cultural statue variants
  - `MachineGraphics.tsx` - industrial machinery

#### Key Files
- `services/mapGenerator.ts` - Procedural zone generation
- `components/MapTile/index.tsx` - Tile routing and rendering
- `components/MapTile/TileRegistry.ts` - Tile definitions and metadata
- `context/GameContext.tsx` - Game state and reducer
- `types.ts` - TypeScript interfaces
- `data/events.ts` - Random and triggered events
- `data/jamesianPhrases.ts` - Henry James internal monologue fragments

#### Event System
- Events defined in `data/events.ts` with trigger conditions
- `EventState` tracks: currentEvent, eventHistory, triggeredEvents, cooldowns, dismissedEvents
- `EventModal.tsx` handles display with phase system (initial → outcome → inspiration)

### Biome Types
STREET, SALON, GARDEN, GRAND_HALL, GALERIE, TOWER_BASE, TOWER_LEVEL, VILLAGE, TROCADERO

### Cultural Themes
Japanese, Chinese, Persian, Egyptian, Moorish, Italian - affect wall styles, statue types, display content

## Development Notes

### Adding New Tiles
1. Add definition to `TILE_REGISTRY` in `TileRegistry.ts` (this is the single source of truth)
2. If using generator, add function to `SpecialGraphics.tsx` and `GENERATORS` map in `index.tsx`
3. If static graphic, add to appropriate graphics file using the semantic ID as key (e.g., `MY_NEW_TILE: (...)`)
4. The tile automatically becomes available in mapGenerator via `TILES_FROM_REGISTRY`

### Tile Categories
terrain, wall, object, furniture, flora, lighting, machine, statue, door, fountain, village, tower, special

### Generator Functions
Position-based seeded randomness for variety:
- `generateTree(x, y)` - 5 tree types
- `generateHedge(x, y)` - French formal garden style
- `generateLamp(x, y)` - Ornate Parisian gas lamp
- `generateCushion(x, y)` - 5 styles, 7 color palettes
- `generateWallSconce(direction)` - Beaux-Arts wall-mounted lamps
- `generateKiosk(x, y)` - Morris column style vendor booth
- `generateFlowerbed(x, y)` - Randomized flower arrangements
- `generateHaussmannFacade(x, y)` - Parisian building facades
