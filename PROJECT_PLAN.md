
# Project Plan: The Ambassadors: 1889
## A Masterpiece of Interactive History

### Executive Summary
The project has evolved from a text-only prototype into a **Graphic/ASCII Hybrid Roguelike**. We have successfully implemented the core "Juice" engine, the complete interaction model (Smart Spacebar), procedural world generation with historical accuracy, and a sophisticated UI dashboard. The current build represents a "Golden Master" candidate for the core gameplay loop.

---

### Phase 1: The "Juice" Engine (Sensory Foundation) [COMPLETED]
*   **Audio:** Web Audio API implementation with procedural brown noise (Ambience) and varied oscillators (UI/Combat).
*   **Visuals:** Screen shake, CSS-based text particle effects for combat.
*   **Movement:** Smooth CSS transitions for grid-based movement.

### Phase 2: The "Smart Spacebar" & Interaction V2 [COMPLETED]
*   **Contextual Action:** "Action Bubble" UI implemented. Ponder, Eavesdrop, and Scrutinize fully functional.
*   **Mechanic:** "Gold Zone" charge meter implemented for risk/reward interactions.

### Phase 3: World Generation & The "Vision" Module [COMPLETED]
*   **Procedural Maps:** `mapGenerator.ts` implements Cellular Automata (Gardens), BSP Trees (Halls), and Linear algorithms (Streets).
*   **Historical Geography:** Coordinate system maps to real 1889 locations (Eiffel Tower, Galerie des Machines).
*   **Imagen Integration:** "Vision" system generates Impressionist paintings of landmarks. Gallery Modal implemented.

### Phase 4: Social Combat V2 (The "Duel of Wits") [COMPLETED]
*   **Card System:** Deck-building mechanic implemented (`CombatCard` types).
*   **UI:** Visual card hand with hover effects and drag-and-drop feel.
*   **LLM:** `geminiService` generates context-aware retorts based on card played.

### Phase 5: Minigame 1 — "The Telegrapher" [COMPLETED]
*   **Engine:** Rhythm/Typing game implemented.
*   **Audio:** Morse code oscillators (Dot/Dash).
*   **Reward:** Economic system (Francs) tied to success.

### Phase 6: Minigame 2 — "The Curator" [COMPLETED]
*   **Engine:** Fast-paced sorting game (Left/Right) implemented.
*   **Content:** Procedural item generation with "Vulgar/Sublime" tags.

### Phase 7: Minigame 3 — "The Flâneur" [COMPLETED]
*   **Engine:** Grid-based stealth implemented.
*   **AI:** Enemy "Bores" with vision cones and patrol routes.

### Phase 7.5: The Graphical Overhaul (New Direction) [COMPLETED]
*   **UI:** "AAA Roguelike" Dashboard layout (3-column).
*   **Portraits:** Advanced Layered ASCII engine (`portraitService.ts`) with dynamic expressions.
*   **Sprites:** Animated SVG sprites for Player and NPCs (`PlayerSprite`, `NpcSprite`).
*   **Map:** Procedural SVG Tile engine (`MapTile`) replacing pure ASCII grid.
*   **Dialogue:** Dedicated `DialogueView` (Chat UI) distinct from Combat.
*   **Narrator:** DM-style Chat panel for open-ended queries.

### Phase 8: The Living Narrative (Advanced AI) [IN PROGRESS]
*   **Fact Check:** Implemented (`FactChecker.tsx`).
*   **Gossip/Memory:** Partially implemented via LLM Context Injection (NPCs know where they are and what they are doing).
*   *Pending:* Global event propagation (e.g., winning a duel affects reputation in other zones).

### Phase 9: Metagame & The "Biographer" [PENDING]
*   **Assessment:** Logic exists (`geminiService.generateAssessment`), needs "Game Over" trigger flow integration.
*   **Save/Load:** Not yet implemented.
*   **Settings:** Dark Mode and Mute implemented.

### Phase 10: Masterpiece Polish [ONGOING]
*   **Visual Filters:** CRT Scanlines, Vignette, and Text Glow implemented.
*   **Animations:** Typewriter text, fade-ins, and slide-outs implemented.

---

## Current Assessment
The application is fully playable. The transition from pure text to a graphical hybrid has significantly increased immersion. The core loops (Explore -> Interact -> Minigame/Combat) are functional. The next steps should focus on long-term persistence (Save Game) and deeper emergent narrative connections between zones.
