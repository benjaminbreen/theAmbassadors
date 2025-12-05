
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { GAME_CONSTANTS, LANDMARKS } from '../constants';
import { generatePondering, generateScrutiny, generateImpressionistImage, generateTelegram } from '../services/geminiService';
import { generateLocalScrutiny, hasLocalTemplate } from '../data/scrutinyTemplates';
import { GameState, BiomeType } from '../types';
import PlayerSprite from './PlayerSprite';
import NpcSprite from './NpcSprite';
import MapTile from './MapTile';
import MapDefs from './MapDefs';
import { LucideZoomIn, LucideZoomOut, LucideCrosshair, LucideX, LucideFeather, LucideEye, LucideTowerControl, LucideCog, LucideBrain } from 'lucide-react';
import { getLocationExhibits } from '../data/historicalExhibits';
import { playSound } from '../services/audioService';
import { getTileId } from './MapTile/TileRegistry';
import { getInteractionForTile, getInteractionNarrative, TileInteraction, getTileEvent, checkBreakable, checkArcLampDanger, TileEvent, getConfirmationAction, ConfirmationActionDef } from '../data/tileInteractions';
import TileEventModal from './TileEventModal';
import EmbarrassmentModal, { NPCReaction } from './EmbarrassmentModal';
import ConfirmActionModal, { ConfirmAction } from './ConfirmActionModal';
import NpcModal from './NpcModal';
import { Item, NPC } from '../types';
import { getItemGraphic } from './ItemGraphics';
import { getInterpolatedTimeColors, TimeColors } from '../utils/timeOfDay';

// ===========================================
// CONSTANTS - Module level for performance
// ===========================================
const TILE_SIZE_PX = 32; // Fixed pixel size for clean scaling

// Characters that need overflow visible AND proper z-index for depth sorting
const MULTI_TILE_CHARS = new Set([
    // Grand doors
    '⊓', '⊔', '⊐', '⊏',
    // Flora
    'T', '%', '¶',
    // Furniture
    '≡',
    // Lighting
    'L', 'l', '§', 'Ł',
    // Walls
    '⌃', '▲', '┌', '┐',
    // Statues
    'Ü', 'Ö', 'Ä', 'ß', 'œ', 'Œ', '♠', '♣', '♦', '♥', 'Ψ',
    // Objects & Pedestals
    'D', 'c', 'K', '©', 'Ç', '┼',
    // Tower pylons
    '⌜', '⌝', '⌞', '⌟', '⎡', '⎤', '⎣', '⎦', '⎧', '⎫', '⎩', '⎭', '⟦', '⟧', '⟨', '⟩',
    // Corliss grand
    '╔', '╗', '╚', '╝',
    // Village
    '@', ')',
    // Grand Huts (2x2)
    '╒', '╕', '╘', '╛',
    // Special
    'J', 'N', 'Q', 'y',
    // Trocadero
    '†', '‡',
    // Aquarium
    'Ŋ',
    // Fountain
    '⌂',
    // Napoleon's Tomb (Rotunda)
    '⟬', '⟭', '⟮', '⟯', '⦃', '⦄',
    // Fountain sculptures
    '↑', '♀', '♆', '♁',
]);

// Get specific emoji for an item based on its name and type (fallback when no SVG available)
const getItemEmoji = (item: Item): string => {
  const name = item.name.toLowerCase();
  const desc = item.description.toLowerCase();

  // Check name patterns for specific items (most specific first)

  // Walking sticks, canes
  if (name.includes('walking stick') || name.includes('cane') || name.includes('malacca')) return '🦯';

  // Flowers and plants
  if (name.includes('rose') || name.includes('flower')) return '🌹';
  if (name.includes('pressed flower') || name.includes('exotic')) return '🌺';

  // Hats and headwear
  if (name.includes('top hat') || name.includes('silk hat')) return '🎩';
  if (name.includes('bonnet') || name.includes('cap')) return '🧢';

  // Writing implements
  if (name.includes('pen') || name.includes('fountain pen')) return '🖋️';
  if (name.includes('notebook') || name.includes('journal')) return '📓';
  if (name.includes('manuscript') || name.includes('page')) return '📃';

  // Letters and correspondence
  if (name.includes('letter')) return '✉️';
  if (name.includes('telegram') || name.includes('telegraph')) return '📨';
  if (name.includes('carte') || name.includes('card') || name.includes('postcard')) return '🪪';

  // Newspapers and periodicals
  if (name.includes('figaro') || name.includes('newspaper')) return '📰';
  if (name.includes('revue') || name.includes('magazine') || name.includes('journal')) return '📖';
  if (name.includes('playbill') || name.includes('program')) return '🎭';

  // Optical instruments
  if (name.includes('opera glasses') || name.includes('binocular')) return '🔭';
  if (name.includes('monocle')) return '🧐';
  if (name.includes('magnifying')) return '🔍';
  if (name.includes('stereoscope')) return '📷';

  // Timepieces
  if (name.includes('watch') || name.includes('pocket watch')) return '⌚';
  if (name.includes('clock')) return '🕰️';

  // Photography
  if (name.includes('camera') || name.includes('kodak')) return '📸';

  // Jewelry and accessories
  if (name.includes('cufflink')) return '💎';
  if (name.includes('brooch') || name.includes('pin')) return '📍';
  if (name.includes('ring')) return '💍';
  if (name.includes('necklace') || name.includes('pendant')) return '📿';

  // Gloves
  if (name.includes('glove')) return '🧤';

  // Handkerchiefs
  if (name.includes('handkerchief')) return '🤧';

  // Smoking items
  if (name.includes('cigarette') || name.includes('cigarette case')) return '🚬';
  if (name.includes('cigar')) return '🚬';
  if (name.includes('snuff')) return '🫙';

  // Drinks
  if (name.includes('absinthe')) return '🍸';
  if (name.includes('champagne')) return '🍾';
  if (name.includes('wine')) return '🍷';
  if (name.includes('cognac') || name.includes('brandy') || name.includes('flask')) return '🥃';
  if (name.includes('coffee') || name.includes('café')) return '☕';

  // Food
  if (name.includes('chocolate')) return '🍫';
  if (name.includes('pastry') || name.includes('croissant')) return '🥐';
  if (name.includes('bread')) return '🥖';
  if (name.includes('cheese')) return '🧀';
  if (name.includes('lozenge') || name.includes('candy')) return '🍬';
  if (name.includes('cork')) return '🍾';

  // Money and tokens
  if (name.includes('coin') || name.includes('franc')) return '🪙';
  if (name.includes('token')) return '🎟️';
  if (name.includes('ticket')) return '🎫';

  // Keys
  if (name.includes('key')) return '🗝️';

  // Souvenirs and miniatures
  if (name.includes('tower') && (name.includes('miniature') || name.includes('model'))) return '🗼';
  if (name.includes('medal') || name.includes('medallion')) return '🏅';
  if (name.includes('poster') || name.includes('buffalo bill')) return '🖼️';

  // Music and sound
  if (name.includes('phonograph') || name.includes('cylinder')) return '📀';
  if (name.includes('sheet music') || name.includes('score')) return '🎼';
  if (name.includes('telephone')) return '📞';

  // Egyptian and Middle Eastern
  if (name.includes('scarab')) return '🪲';
  if (name.includes('papyrus')) return '📜';

  // Asian items
  if (name.includes('puppet') || name.includes('javanese')) return '🎎';
  if (name.includes('fan')) return '🪭';
  if (name.includes('silk') && !name.includes('hat')) return '🧣';

  // Scientific instruments
  if (name.includes('compass')) return '🧭';
  if (name.includes('thermometer')) return '🌡️';
  if (name.includes('light bulb') || name.includes('bulb') || name.includes('edison')) return '💡';
  if (name.includes('dynamo') || name.includes('electrical')) return '⚡';
  if (name.includes('blueprint') || name.includes('diagram')) return '📐';

  // Fortune telling and mysterious
  if (name.includes('fortune') || name.includes('tarot')) return '🃏';
  if (name.includes('mask')) return '🎭';

  // Art
  if (name.includes('monet') || name.includes('print') || name.includes('painting')) return '🖼️';
  if (name.includes('rodin') || name.includes('sculpture')) return '🗿';

  // Guides and maps
  if (name.includes('guide') || name.includes('map')) return '🗺️';
  if (name.includes('expo') && name.includes('guide')) return '📋';

  // Fallback to type-based emojis (improved defaults)
  switch (item.type) {
    case 'BOOK': return '📚';
    case 'DOCUMENT': return '📜';
    case 'TOOL': return '🔧';
    case 'PERSONAL': return '👜';  // Better generic for personal items
    case 'ART': return '🎨';
    case 'CONSUMABLE': return '🍽️';
    case 'CURIOSITY': return '✨';  // Sparkles - better than crystal ball for curiosities
    default: return '📦';
  }
};

// Get detailed terrain description based on tile character AND location
const getTerrainDescription = (char: string, x: number, y: number, zoneName: string): { name: string; type: string; description: string } => {
  // Use coordinates to generate deterministic "random" selection
  const hash = Math.abs(x * 17 + y * 31);

  // Get location-specific exhibit data
  const exhibits = getLocationExhibits(zoneName);

  switch (char) {
    case '#': {
      // Rue du Caire specific walls
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        const wallDescriptions = [
          'Sun-baked mud brick walls with sandy stucco, pierced by a mashrabiya window—the intricate wooden lattice that allows women to observe the street unseen.',
          'A plastered wall in the Cairene style, its surface cracked and weathered to suggest the authentic antiquity of Egypt\'s medieval quarters.',
          'Ochre-tinted stucco over mud brick, decorated with faded geometric patterns. A narrow arched window reveals only darkness within.',
          'A traditional Egyptian building facade, its horseshoe arch and wooden shutters transplanted from the Khan el-Khalili bazaar to the Champ de Mars.',
        ];
        return { name: 'Cairene Wall', type: 'STRUCTURE', description: wallDescriptions[hash % wallDescriptions.length] };
      }
      return { name: 'Stone Wall', type: 'STRUCTURE', description: 'A solid wall of dressed limestone.' };
    }
    case '.': {
      // Rue du Caire specific floors
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        const floorDescriptions = [
          'Dusty packed earth, scattered with straw and the occasional dropped coin. The ground bears the imprints of countless sandaled feet.',
          'Worn limestone paving stones, their surfaces polished smooth by centuries of foot traffic in actual Cairene streets—or so the organizers claim.',
          'Sandy cobblestones arranged in geometric patterns, meant to evoke the ancient streets of Islamic Cairo.',
        ];
        return { name: 'Bazaar Floor', type: 'TERRAIN', description: floorDescriptions[hash % floorDescriptions.length] };
      }
      return { name: 'Floor', type: 'TERRAIN', description: 'Polished floor tiles.' };
    }
    case ':': return { name: 'Path', type: 'TERRAIN', description: 'A well-worn path.' };
    case '+': {
      // Rue du Caire specific doorways
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        const doorDescriptions = [
          'A narrow arched passage leads deeper into the labyrinthine souk. The walls press close, and the light dims beyond.',
          'An ancient wooden door, studded with brass nails, opens onto another winding alley of the reconstructed bazaar.',
          'A horseshoe arch frames a passage draped with colorful textiles, beckoning visitors to explore further.',
          'A low doorway beneath a carved stone lintel. One must duck to pass through, as in the real streets of old Cairo.',
        ];
        return { name: 'Souk Passage', type: 'EXIT', description: doorDescriptions[hash % doorDescriptions.length] };
      }
      return { name: 'Doorway', type: 'EXIT', description: 'A passage to another area.' };
    }
    case 'T': return { name: 'Chestnut Tree', type: 'FLORA', description: 'A mature chestnut, its leaves rustling in the breeze.' };
    case '~': return { name: 'Water', type: 'TERRAIN', description: 'Clear water reflecting the sky.' };
    case 'F': return { name: 'Fountain', type: 'LANDMARK', description: 'An ornate fountain with cascading water.' };
    case 'f': return { name: 'Fountain Edge', type: 'LANDMARK', description: 'The marble rim of the fountain.' };
    case 'A': return { name: 'Eiffel Tower', type: 'LANDMARK', description: 'The immense iron tower dominates the skyline.' };
    case 'P': return { name: 'Tower Pylon', type: 'STRUCTURE', description: 'A massive iron leg of the Eiffel Tower.' };
    case 'E': return { name: 'Exhibition', type: 'EXHIBIT', description: 'A display of industrial marvels.' };
    case 'C': return { name: 'Carriage', type: 'VEHICLE', description: 'A horse-drawn carriage awaits passengers.' };
    case 'L': return { name: 'Gas Lamp', type: 'FIXTURE', description: 'A cast-iron lamp post with flickering flame.' };
    case 'b': {
      // Rue du Caire specific benches
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        const benchDescriptions = [
          'A low wooden bench worn smooth by countless merchants and shoppers. Elderly men sit here sipping thick Turkish coffee and watching the crowd.',
          'A stone mastaba bench built into the wall, where Cairene traders rest between haggling sessions. The seat is cool despite the heat.',
          'A simple cedar bench where exhausted European visitors collapse, overwhelmed by the sensory assault of the bazaar.',
        ];
        return { name: 'Bazaar Bench', type: 'FURNITURE', description: benchDescriptions[hash % benchDescriptions.length] };
      }
      return { name: 'Iron Bench', type: 'FURNITURE', description: 'A decorative park bench for weary visitors.' };
    }
    case '≡': return { name: 'Grand Park Bench', type: 'FURNITURE', description: 'An elegant two-seat bench with ornate ironwork armrests, a favorite spot for Parisian couples.' };
    case 'n': return { name: 'Newspaper', type: 'ITEM', description: 'A discarded copy of Le Figaro.' };
    case 's': return { name: 'Steam Vent', type: 'FIXTURE', description: 'Wisps of steam rise from the machinery below.' };
    case 'K': return { name: 'Kiosque', type: 'STRUCTURE', description: 'An ornate green vendor kiosk with a pagoda-style roof, selling newspapers, refreshments, and souvenirs.' };
    case 'V': return { name: 'Open Air', type: 'DANGER', description: 'Nothing but sky and a fatal drop to Paris below.' };
    case 'R': return { name: 'Iron Railing', type: 'STRUCTURE', description: 'Decorative ironwork railing.' };
    case 'e': return { name: 'Elevator', type: 'TRANSPORT', description: 'The hydraulic elevator to ascend or descend the tower.' };
    case 'O': return { name: 'Telescope', type: 'FIXTURE', description: 'A coin-operated telescope for observing Paris.' };
    case 'S': {
      // Rue du Caire specific stall partitions
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        const stallDescriptions = [
          'Rough wooden boards nailed together to form a merchant\'s stall, draped with colorful fabrics and hung with brass lamps.',
          'A canvas awning stretched over bamboo poles, creating a shaded alcove for displaying silks and jewelry.',
          'Woven palm-frond screens divide the narrow alley into merchant territories, each jealously guarded.',
        ];
        return { name: 'Market Partition', type: 'STRUCTURE', description: stallDescriptions[hash % stallDescriptions.length] };
      }
      return { name: 'Stall Partition', type: 'STRUCTURE', description: 'A wooden partition dividing exhibition stalls.' };
    }
    // Display cases - use location-specific content (now 2 tiles wide with elaborate design)
    case 'D': {
      const displayName = exhibits.displays[hash % exhibits.displays.length];
      return { name: displayName, type: 'EXHIBIT', description: `An ornate brass-framed display cabinet on carved mahogany legs, showcasing: ${displayName}. The glass gleams under gaslight.` };
    }
    // Aquarium tank - Trocadéro special exhibit
    case 'Ŋ': return { name: 'Aquarium Display', type: 'EXHIBIT', description: 'A magnificent glass aquarium tank from the Trocadéro Palace. Exotic fish from the Mediterranean and tropical seas swim lazily past swaying aquatic plants.' };
    case 'c': {
      // Rue du Caire specific columns
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        const columnDescriptions = [
          'A slender marble column with a lotus capital, salvaged from an ancient Egyptian temple—or more likely, crafted in Paris to look the part.',
          'A painted wooden pillar carved with Islamic arabesques, supporting the awning of a merchant\'s stall.',
          'A stone column worn smooth by centuries of hands brushing past in the narrow alley. At least, that\'s the illusion intended.',
        ];
        return { name: 'Bazaar Column', type: 'STRUCTURE', description: columnDescriptions[hash % columnDescriptions.length] };
      }
      return { name: 'Marble Column', type: 'STRUCTURE', description: 'A fluted column supporting the gallery roof.' };
    }
    case 'r': {
      // Rue du Caire specific carpets
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        const carpetDescriptions = [
          'A handwoven Egyptian kilim displaying geometric patterns in deep crimson and gold. The merchant claims it is from Assiut.',
          'A prayer rug from the Cairo bazaar, its mihrab design pointing worshippers toward Mecca. Here it serves as exotic decoration.',
          'A thick Mamluk-style carpet, its intricate medallion pattern a testament to centuries of Egyptian weaving tradition.',
          'A vibrant Bedouin rug with bold stripes, spread on the ground to display brass wares and pottery.',
        ];
        return { name: 'Egyptian Carpet', type: 'DECOR', description: carpetDescriptions[hash % carpetDescriptions.length] };
      }
      return { name: 'Persian Carpet', type: 'DECOR', description: 'An intricately woven carpet from the Orient.' };
    }
    case 'B': return { name: 'Banner', type: 'DECOR', description: 'A decorative banner bearing national colors.' };
    // Statues - use location-specific content
    case 'u': {
      const statueName = exhibits.statues[hash % exhibits.statues.length];
      return { name: statueName, type: 'ARTWORK', description: `${statueName}. Visitors pause to admire the craftsmanship.` };
    }
    case 'l': {
      // Rue du Caire specific lanterns
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        const lanternDescriptions = [
          'A pierced brass lantern from Egypt, casting intricate star patterns on the surrounding walls. The candle within flickers mysteriously.',
          'A Mamluk-style mosque lamp of enameled glass, suspended on delicate chains. Its arabesque patterns glow amber in the flame light.',
          'A traditional Egyptian fanous, its colored glass panels painting the narrow alley in hues of ruby and emerald.',
          'A copper lantern beaten by Cairene craftsmen, its geometric cutouts projecting Islamic star patterns across the dusty street.',
        ];
        return { name: 'Cairene Lantern', type: 'FIXTURE', description: lanternDescriptions[hash % lanternDescriptions.length] };
      }
      return { name: 'Hanging Lantern', type: 'FIXTURE', description: 'An ornate lantern casting warm light.' };
    }
    case 'q': {
      // Rue du Caire specific potted plants
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        const palmDescriptions = [
          'A date palm in a large clay pot, its fronds providing welcome shade in the dusty souk. Such trees line the Nile in Egypt.',
          'A potted fan palm beside a merchant\'s doorway, its leaves yellowing in the Parisian climate despite careful tending.',
          'An ornamental palm meant to evoke the oases of Egypt, struggling somewhat in its exile from the desert sun.',
        ];
        return { name: 'Egyptian Palm', type: 'FLORA', description: palmDescriptions[hash % palmDescriptions.length] };
      }
      return { name: 'Potted Palm', type: 'FLORA', description: 'An exotic palm in a decorative planter.' };
    }
    case 'g': return { name: 'Lawn', type: 'TERRAIN', description: 'Manicured grass, soft underfoot.' };
    case 'W': return { name: 'Brick Wall', type: 'STRUCTURE', description: 'A low brick balustrade.' };
    case 'v': return { name: 'Gravel Path', type: 'TERRAIN', description: 'Crushed gravel crunches beneath your feet.' };
    case 'H': return { name: 'Trimmed Hedge', type: 'FLORA', description: 'A neatly clipped boxwood hedge.' };
    case 'w': return { name: 'Flowerbed', type: 'FLORA', description: 'Colorful blooms in neat rows.' };
    // ============================================
    // MACHINERY TILES - Varied and specific
    // ============================================

    // Steam Engine (M) - Generic steam engine with varied labels
    case 'M': {
      const steamEngineTypes = [
        { name: 'Corliss Steam Engine', desc: 'A massive Corliss engine, its flywheel turning with hypnotic precision. Steam hisses from the valves.' },
        { name: 'Compound Steam Engine', desc: 'A double-expansion compound engine, marvel of thermodynamic efficiency. The pistons rise and fall in perfect rhythm.' },
        { name: 'Horizontal Steam Engine', desc: 'A horizontal mill engine, its brass fittings gleaming. The governor balls spin, regulating the power.' },
        { name: 'Portable Steam Engine', desc: 'A Fowler portable engine, ready to power agricultural machinery across the French countryside.' },
        { name: 'Marine Steam Engine', desc: 'A ship\'s triple-expansion engine, demonstrating the power that drives ocean liners across the Atlantic.' }
      ];
      const selected = steamEngineTypes[hash % steamEngineTypes.length];
      return { name: selected.name, type: 'MACHINERY', description: selected.desc };
    }

    // Dynamo/Generator (Ð) - Electric generators
    case 'Ð': {
      const dynamoTypes = [
        { name: 'Edison Dynamo', desc: 'An Edison "Jumbo" dynamo, copper armature spinning within powerful electromagnets. Blue sparks dance at the brushes.' },
        { name: 'Siemens Generator', desc: 'A Siemens alternator, generating the alternating current that Tesla champions. The coils hum with electrical potential.' },
        { name: 'Gramme Dynamo', desc: 'A Gramme ring dynamo, the Belgian invention that revolutionized electrical power. Copper windings gleam in the gaslight.' },
        { name: 'Thomson-Houston Generator', desc: 'An arc light generator by Thomson-Houston, powering the brilliant illuminations of the Exposition.' },
        { name: 'Brush Electric Dynamo', desc: 'A Brush electric generator, its commutator clicking as it produces direct current for the exhibition halls.' }
      ];
      const selected = dynamoTypes[hash % dynamoTypes.length];
      return { name: selected.name, type: 'MACHINERY', description: selected.desc };
    }

    // Printing Press (Þ)
    case 'Þ': {
      const pressTypes = [
        { name: 'Rotary Printing Press', desc: 'A Marinoni rotary press, capable of printing 20,000 newspapers per hour. Paper feeds through in an endless ribbon.' },
        { name: 'Linotype Machine', desc: 'Mergenthaler\'s miraculous Linotype, setting type by keyboard. Molten lead flows into brass matrices.' },
        { name: 'Lithographic Press', desc: 'A chromolithographic press, producing the vivid color prints that adorn every Parisian kiosk.' },
        { name: 'Cylinder Press', desc: 'A Koenig cylinder press, the same design that printed The Times. The cylinder rolls with metronomic regularity.' }
      ];
      const selected = pressTypes[hash % pressTypes.length];
      return { name: selected.name, type: 'MACHINERY', description: selected.desc };
    }

    // Arc Lamp (Ł)
    case 'Ł': {
      const lampTypes = [
        { name: 'Jablochkoff Candle', desc: 'A Jablochkoff "electric candle," its carbon rods consuming slowly as the arc blazes between them.' },
        { name: 'Brush Arc Lamp', desc: 'A Brush arc lamp, casting harsh white light that makes the gas lamps seem dim by comparison.' },
        { name: 'Siemens Differential Lamp', desc: 'A Siemens differential arc lamp, its automatic feed mechanism maintaining perfect brilliance.' },
        { name: 'Serrin Arc Lamp', desc: 'A Serrin regulator lamp, the clockwork mechanism advancing the carbons as they burn away.' }
      ];
      const selected = lampTypes[hash % lampTypes.length];
      return { name: selected.name, type: 'ELECTRICAL', description: selected.desc };
    }

    // Loom/Textile Machine (Ŧ)
    case 'Ŧ': {
      const loomTypes = [
        { name: 'Jacquard Loom', desc: 'A Jacquard loom, its punch cards directing the heddles to weave intricate brocade patterns automatically.' },
        { name: 'Power Loom', desc: 'A Northrop automatic loom, the shuttle flying back and forth with mechanical precision.' },
        { name: 'Silk Throwing Machine', desc: 'A Lyon silk-throwing machine, twisting delicate filaments into lustrous thread.' },
        { name: 'Cotton Spinning Frame', desc: 'An Arkwright spinning frame, drawing and twisting raw cotton into fine yarn.' }
      ];
      const selected = loomTypes[hash % loomTypes.length];
      return { name: selected.name, type: 'MACHINERY', description: selected.desc };
    }

    // Hydraulic Press (Ħ)
    case 'Ħ': {
      const pressTypes = [
        { name: 'Bramah Hydraulic Press', desc: 'A Bramah hydraulic press, capable of exerting thousands of tons of pressure. The gauge needle climbs steadily.' },
        { name: 'Forging Press', desc: 'A hydraulic forging press from Le Creusot, shaping red-hot steel into ship\'s plates and artillery barrels.' },
        { name: 'Baling Press', desc: 'A hydraulic baling press, compacting cotton into dense cubes for ocean transport.' },
        { name: 'Hydraulic Accumulator', desc: 'Armstrong\'s hydraulic accumulator, storing pressure for the cranes and lifts of the exhibition.' }
      ];
      const selected = pressTypes[hash % pressTypes.length];
      return { name: selected.name, type: 'MACHINERY', description: selected.desc };
    }

    // Phonograph (Ø)
    case 'Ø': {
      const phonoTypes = [
        { name: 'Edison Phonograph', desc: 'Edison\'s "talking machine," a brass horn amplifying the ghostly voice etched into a wax cylinder.' },
        { name: 'Graphophone', desc: 'Bell and Tainter\'s improved Graphophone, recording sound with unprecedented fidelity.' },
        { name: 'Parlor Phonograph', desc: 'A luxurious parlor phonograph in a mahogany cabinet, playing waltzes for amazed visitors.' },
        { name: 'Recording Phonograph', desc: 'A demonstration phonograph, visitors may record their own voices and hear them played back.' }
      ];
      const selected = phonoTypes[hash % phonoTypes.length];
      return { name: selected.name, type: 'ELECTRICAL', description: selected.desc };
    }

    // Telegraph Machine (ŧ)
    case 'ŧ': {
      const telegraphTypes = [
        { name: 'Morse Telegraph', desc: 'A Morse telegraph key and sounder, the dots and dashes clicking out messages across continents.' },
        { name: 'Hughes Printing Telegraph', desc: 'A Hughes type-printing telegraph, transcribing messages directly onto paper tape.' },
        { name: 'Quadruplex Telegraph', desc: 'Edison\'s quadruplex telegraph, sending four messages simultaneously on a single wire.' },
        { name: 'Baudot Multiplex', desc: 'Baudot\'s multiplex telegraph, five operators sharing one line through ingenious time-division.' }
      ];
      const selected = telegraphTypes[hash % telegraphTypes.length];
      return { name: selected.name, type: 'ELECTRICAL', description: selected.desc };
    }

    // Automobile Engine (đ)
    case 'đ': {
      const autoTypes = [
        { name: 'Benz Patent-Motorwagen', desc: 'Benz\'s Patent-Motorwagen engine, the first true automobile powerplant. Visitors marvel at horseless locomotion.' },
        { name: 'Daimler Petroleum Engine', desc: 'Daimler\'s high-speed petroleum engine, compact enough to power carriages, boats, even balloons.' },
        { name: 'Panhard-Levassor Engine', desc: 'A Panhard-Levassor motor, the French answer to German ingenuity. Exhaust smoke drifts upward.' },
        { name: 'Otto Gas Engine', desc: 'An Otto four-stroke gas engine, the design that spawned the automotive age.' }
      ];
      const selected = autoTypes[hash % autoTypes.length];
      return { name: selected.name, type: 'MACHINERY', description: selected.desc };
    }

    // Centrifuge (ð)
    case 'ð': {
      const centrifugeTypes = [
        { name: 'Laboratory Centrifuge', desc: 'A scientific centrifuge, separating blood samples and chemical solutions at dizzying speed.' },
        { name: 'Sugar Centrifuge', desc: 'An industrial centrifuge for sugar refining, spinning molasses from crystallized sugar.' },
        { name: 'Cream Separator', desc: 'De Laval\'s cream separator, the Swedish invention revolutionizing dairy farming across Europe.' },
        { name: 'Analytical Centrifuge', desc: 'A precision centrifuge for medical analysis, glass tubes spinning in a blur.' }
      ];
      const selected = centrifugeTypes[hash % centrifugeTypes.length];
      return { name: selected.name, type: 'SCIENTIFIC', description: selected.desc };
    }
    // Gate tiles
    case 'J': return { name: 'Iron Gate Pillar', type: 'STRUCTURE', description: 'A monumental wrought iron pillar in the Eiffel style.' };
    case 'I': return { name: 'Turnstile', type: 'FIXTURE', description: 'A rotating entrance barrier. Insert your ticket.' };
    case 'N': return { name: 'Guichet des Billets', type: 'STRUCTURE', description: 'An elegant ticket booth with ornate pitched roof and gilded trim. ENTRÉE: 1 FRANC.' };
    case 'Q': return { name: 'Poste de Garde', type: 'STRUCTURE', description: 'A smart blue guard station where a uniformed Sergent de Ville keeps vigilant watch over the exposition grounds.' };
    case 'y': return { name: 'Grand Mât de Drapeau', type: 'FIXTURE', description: 'A majestic three-story flagpole topped with a golden spear finial, the French tricolore rippling grandly in the breeze.' };
    // Floor variants
    case '`': return { name: 'Polished Floor', type: 'TERRAIN', description: 'Gleaming marble tiles, meticulously polished.' };
    case ',': return { name: 'Worn Floor', type: 'TERRAIN', description: 'Well-trodden floor tiles, worn smooth by countless visitors.' };
    case 'o': return { name: 'Wooden Floor', type: 'TERRAIN', description: 'Honey-colored oak planks, warm underfoot.' };
    // Chairs
    case '1': return { name: 'Chair', type: 'FURNITURE', description: 'A bentwood café chair facing north.' };
    case '2': return { name: 'Chair', type: 'FURNITURE', description: 'A bentwood café chair facing south.' };
    case '3': return { name: 'Chair', type: 'FURNITURE', description: 'A bentwood café chair facing east.' };
    case '4': return { name: 'Chair', type: 'FURNITURE', description: 'A bentwood café chair facing west.' };
    // Tables and furniture
    case 't': {
      // Rue du Caire specific tables
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        const tableDescriptions = [
          'A low octagonal table inlaid with mother-of-pearl, where merchants display their finest wares or serve sweet mint tea.',
          'A brass tray table on folding legs, covered with tiny cups of thick Turkish coffee and plates of sticky baklava.',
          'A carved wooden table where a fortune teller spreads her cards, offering to read the fates for curious Europeans.',
        ];
        return { name: 'Cairene Table', type: 'FURNITURE', description: tableDescriptions[hash % tableDescriptions.length] };
      }
      return { name: 'Café Table', type: 'FURNITURE', description: 'A small round table with a marble top.' };
    }
    case 'a': {
      // Rue du Caire specific cushions
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        const cushionDescriptions = [
          'A thick floor cushion covered in embroidered silk, where customers recline while examining merchandise and sipping coffee.',
          'A tasseled ottoman stuffed with wool, placed outside a café where men smoke water pipes and play backgammon.',
          'A worn leather pouf, its surface cracked and faded from years of use in the sun-drenched streets of the original souk.',
          'A brocade cushion with golden thread depicting geometric patterns. The merchant assures you it is genuine Cairene work.',
        ];
        return { name: 'Souk Cushion', type: 'FURNITURE', description: cushionDescriptions[hash % cushionDescriptions.length] };
      }
      return { name: 'Floor Cushion', type: 'FURNITURE', description: 'An embroidered silk cushion for seated guests.' };
    }
    case 'Z': {
      // Rue du Caire specific braziers
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        const brazierDescriptions = [
          'A copper mangal filled with glowing charcoal, over which a vendor roasts chestnuts and corn. The smoke carries the scent of cumin.',
          'A brass brazier where frankincense smolders, filling the narrow alley with sacred smoke meant to bless the merchants\' wares.',
          'A clay kanun holding embers for brewing coffee. The bitter aroma mingles with the sweetness of shisha tobacco from a nearby café.',
          'An iron fire basket where kebabs sizzle and drip fat onto the coals. The smell draws hungry visitors from across the souk.',
        ];
        return { name: 'Cairene Brazier', type: 'FIXTURE', description: brazierDescriptions[hash % brazierDescriptions.length] };
      }
      return { name: 'Brazier', type: 'FIXTURE', description: 'A bronze brazier with glowing coals.' };
    }
    case 'z': return { name: 'Theater Seat', type: 'FURNITURE', description: 'A velvet-upholstered seat for performances.' };
    case 'X': {
      // Rue du Caire specific stage
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        const stageDescriptions = [
          'A low wooden platform where Egyptian musicians perform on oud and darbuka, their quarter-tone melodies bewildering but enchanting European ears.',
          'A performance stage for the belly dancers of the Rue du Caire—the scandalous "danse du ventre" that has Paris simultaneously outraged and enthralled.',
          'A storyteller\'s platform where a hakawati narrates tales of Scheherazade in Arabic, his gestures dramatic even without translation.',
          'A demonstration stage where Cairene craftsmen display their traditional arts: brass-working, leathercraft, and the intricate art of mashrabiya woodwork.',
        ];
        return { name: 'Performance Stage', type: 'STRUCTURE', description: stageDescriptions[hash % stageDescriptions.length] };
      }
      return { name: 'Stage', type: 'STRUCTURE', description: 'A raised wooden platform for performances.' };
    }
    case 'k': {
      // Rue du Caire specific market stalls
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        const stallDescriptions = [
          'A spice merchant\'s stall overflowing with pyramids of saffron, cumin, and cinnamon. The aroma is intoxicating, utterly foreign to Parisian nostrils.',
          'A brass-worker\'s booth displaying ornate coffeepots, trays, and lamps. The merchant demonstrates his engraving technique to fascinated visitors.',
          'A carpet seller\'s stall, kilims and prayer rugs draped over every surface. The merchant offers mint tea and hard bargaining.',
          'A perfumer\'s kiosk with rows of delicate glass bottles containing essences of rose, jasmine, and mysterious musks from the Orient.',
          'A leather goods stall selling embossed bags, slippers, and poufs in vivid colors. The tanning smell mingles with incense.',
          'A jewelry merchant displaying silver filigree, turquoise amulets, and the blue glass beads said to ward off the evil eye.',
        ];
        return { name: 'Bazaar Stall', type: 'STRUCTURE', description: stallDescriptions[hash % stallDescriptions.length] };
      }
      return { name: 'Market Stall', type: 'STRUCTURE', description: 'A merchant\'s stall laden with exotic wares.' };
    }
    case 'd': return { name: 'Donkey', type: 'CREATURE', description: 'A patient donkey, part of the Rue du Caire attraction.' };
    case 'G': return { name: 'Glass Floor', type: 'TERRAIN', description: 'Reinforced glass revealing the dizzying drop below.' };
    // Village and special biome tiles - Senegalese Village reconstruction
    case 'h': {
      const hutDescriptions = [
        'A Wolof-style dwelling with conical thatched roof of millet stalks. The mud-brick walls are decorated with geometric patterns in ochre and white.',
        'A traditional Serer roundhouse, its palm-frond roof casting cool shadows within. Visitors peer curiously at the woven sleeping mats inside.',
        'A reconstructed Senegalese hut, part of the "living exhibit" meant to display African daily life to Parisian visitors. The authenticity is debatable.',
        'A thatched dwelling where Senegalese craftspeople demonstrate traditional weaving techniques to crowds of curious Exposition visitors.',
      ];
      return { name: 'Senegalese Hut', type: 'STRUCTURE', description: hutDescriptions[hash % hutDescriptions.length] };
    }
    case 'U': {
      const firePitDescriptions = [
        'A communal fire pit around which Senegalese villagers prepare traditional meals. The smoke carries unfamiliar but enticing aromas.',
        'Glowing embers in a central hearth, tended by village residents brought from Dakar. Their expressions suggest complex feelings about their role here.',
        'A cooking fire where millet porridge simmers in clay pots. European visitors watch with a mixture of fascination and incomprehension.',
      ];
      return { name: 'Village Fire Pit', type: 'FIXTURE', description: firePitDescriptions[hash % firePitDescriptions.length] };
    }
    case '!': {
      const drumDescriptions = [
        'A djembe drum carved from a single piece of lenke wood, its goatskin head stretched taut. The rhythms it produces draw crowds from across the Exposition.',
        'A sabar drum from the Wolof tradition, played with one hand and a thin stick. The complex polyrhythms are unlike anything in European music.',
        'A tama "talking drum" whose pitch can be modulated by squeezing the leather cords. Musicians use it to mimic the tonal patterns of Wolof speech.',
        'A ceremonial drum decorated with carved symbols. Its deep resonance seems to carry the weight of traditions older than Paris itself.',
      ];
      return { name: 'African Drum', type: 'ARTIFACT', description: drumDescriptions[hash % drumDescriptions.length] };
    }
    case '@': {
      const totemDescriptions = [
        'A carved wooden figure representing ancestral spirits, its stylized features polished smooth by generations of reverent touch.',
        'A Serer ancestor post, its geometric patterns encoding genealogies and spiritual knowledge incomprehensible to European visitors.',
        'A protective figure placed at the village entrance. Its stern expression seems to question the propriety of this entire exhibition.',
        'A carved totem combining human and animal forms—a visual language of myth that predates written history on this continent.',
      ];
      return { name: 'Carved Figure', type: 'ARTWORK', description: totemDescriptions[hash % totemDescriptions.length] };
    }
    case '%': {
      const palmDescriptions = [
        'A transplanted palm tree, struggling somewhat in the Parisian climate. Its presence completes the illusion of tropical Africa.',
        'An oil palm, its fronds rustling in the breeze. In Senegal, such trees provide food, wine, and oil—here, merely atmosphere.',
        'A date palm imported at considerable expense to furnish the village with appropriate flora. The gardeners water it obsessively.',
      ];
      return { name: 'Palm Tree', type: 'FLORA', description: palmDescriptions[hash % palmDescriptions.length] };
    }
    // Grand Huts (2x2) - Larger Senegalese compound structures
    case '╒':
    case '╕':
    case '╘':
    case '╛': {
      const grandHutDescriptions = [
        'A substantial compound house belonging to a village elder or chief. The conical roof rises high above the mud-brick walls, which are decorated with traditional Wolof geometric patterns in ochre and white pigments.',
        'The dwelling of an important family, larger than the common huts. A shaded veranda wraps around the structure, where craftspeople demonstrate basket-weaving and cloth-dyeing to Exposition visitors.',
        'A reconstruction of a Serer chief\'s residence, its size and decorations indicating high social status. The beaded curtain in the doorway sways gently, offering glimpses of the shadowy interior.',
        'An imposing structure meant to represent a prosperous Senegalese household. Clay pots and woven mats surround the entrance, arranged to suggest daily domestic life—though the residents are in fact performers.',
      ];
      return { name: 'Grand Compound House', type: 'STRUCTURE', description: grandHutDescriptions[hash % grandHutDescriptions.length] };
    }
    // Trocadéro and waterfall tiles
    case '|': return { name: 'Waterfall', type: 'LANDMARK', description: 'Cascading water thunders down the rocks.' };
    case '^': return { name: 'Cascade Rocks', type: 'TERRAIN', description: 'Moss-covered boulders arranged artfully.' };
    case '(': return { name: 'Moorish Arch', type: 'STRUCTURE', description: 'An ornate horseshoe arch in the Islamic style.' };
    case ')': return { name: 'Minaret', type: 'STRUCTURE', description: 'A slender tower topped with a gilded dome.' };
    // Beaux-Arts fountain components
    case '«': return { name: 'Fountain Basin', type: 'LANDMARK', description: 'The carved stone rim of an ornate fountain.' };
    case '»': return { name: 'Fountain Basin', type: 'LANDMARK', description: 'The carved stone rim of an ornate fountain.' };
    case '≥': return { name: 'Fountain Basin', type: 'LANDMARK', description: 'The carved stone rim of an ornate fountain.' };
    case '≤': return { name: 'Fountain Basin', type: 'LANDMARK', description: 'The carved stone rim of an ornate fountain.' };
    case '╔': return { name: 'Fountain Corner', type: 'LANDMARK', description: 'A decorative corner of the fountain basin.' };
    case '╗': return { name: 'Fountain Corner', type: 'LANDMARK', description: 'A decorative corner of the fountain basin.' };
    case '╚': return { name: 'Fountain Corner', type: 'LANDMARK', description: 'A decorative corner of the fountain basin.' };
    case '╝': return { name: 'Fountain Corner', type: 'LANDMARK', description: 'A decorative corner of the fountain basin.' };
    case '≈': return { name: 'Fountain Water', type: 'LANDMARK', description: 'Crystal clear water ripples in the basin.' };
    case '⌂': return { name: 'Water Jet', type: 'LANDMARK', description: 'A powerful jet of water shoots skyward.' };
    case '♦': return { name: 'Fountain Statue', type: 'ARTWORK', description: 'A bronze figure adorns the fountain center.' };
    // Directional walls
    case '▲': {
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        const wallDescs = [
          'Sun-baked mud brick rises above, its stucco surface painted with faded geometric patterns in ochre and blue.',
          'The upper story of a Cairene building looms overhead, its mashrabiya balcony projecting into the narrow alley.',
          'Ancient-looking plasterwork (applied last year in a Parisian workshop) creates the illusion of medieval Cairo.',
        ];
        return { name: 'Souk Wall', type: 'STRUCTURE', description: wallDescs[hash % wallDescs.length] };
      }
      return { name: 'North Wall', type: 'STRUCTURE', description: 'A solid stone wall.' };
    }
    case '▼': {
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        return { name: 'Shadowed Alcove', type: 'STRUCTURE', description: 'Deep shadows pool beneath the overhanging upper floors. In the real Cairo, such recesses shelter beggars and secrets.' };
      }
      return { name: 'South Wall', type: 'STRUCTURE', description: 'A solid stone wall.' };
    }
    case '►': {
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        const wallDescs = [
          'A plastered wall bearing a faded painted sign in Arabic script, advertising wares that Parisians cannot read.',
          'The eastern wall of the passage, hung with copper pots and brass trays that catch the afternoon light.',
        ];
        return { name: 'Eastern Wall', type: 'STRUCTURE', description: wallDescs[hash % wallDescs.length] };
      }
      return { name: 'East Wall', type: 'STRUCTURE', description: 'A solid stone wall.' };
    }
    case '◄': {
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        const wallDescs = [
          'The western wall disappears into shadow, hung with dusty carpets and leather goods.',
          'Crumbling stucco reveals the mud brick beneath—either authentic decay or theatrical artifice.',
        ];
        return { name: 'Western Wall', type: 'STRUCTURE', description: wallDescs[hash % wallDescs.length] };
      }
      return { name: 'West Wall', type: 'STRUCTURE', description: 'A solid stone wall.' };
    }
    case '┐': {
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        return { name: 'Souk Corner', type: 'STRUCTURE', description: 'Two alley walls meet at a sharp angle, their plaster cracked where donkeys have scraped past for decades—or so it appears.' };
      }
      return { name: 'Wall Corner', type: 'STRUCTURE', description: 'A corner where two walls meet.' };
    }
    case '┌': {
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        return { name: 'Souk Corner', type: 'STRUCTURE', description: 'The corner of a building juts into the passage, its edges worn smooth by passing traffic.' };
      }
      return { name: 'Wall Corner', type: 'STRUCTURE', description: 'A corner where two walls meet.' };
    }
    case '┘': {
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        return { name: 'Shaded Corner', type: 'STRUCTURE', description: 'A corner wrapped in shadow where the alley bends. A cat watches from the darkness.' };
      }
      return { name: 'Wall Corner', type: 'STRUCTURE', description: 'A corner where two walls meet.' };
    }
    case '└': {
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        return { name: 'Dusty Corner', type: 'STRUCTURE', description: 'The corner where two passages meet. Sand gathers in the crevices, blown in from... somewhere.' };
      }
      return { name: 'Wall Corner', type: 'STRUCTURE', description: 'A corner where two walls meet.' };
    }
    case '░': {
      if (zoneName.toLowerCase().includes('cairo') || zoneName.toLowerCase().includes('souk')) {
        return { name: 'Shaded Alley', type: 'TERRAIN', description: 'Cool shadow falls here where canvas awnings block the sun. A welcome respite from the dusty heat of the bazaar.' };
      }
      return { name: 'Shaded Ground', type: 'TERRAIN', description: 'The ground here lies in cool shadow.' };
    }
    // Road and street tiles
    case '═': return { name: 'Cobblestone Road', type: 'TERRAIN', description: 'Worn granite cobblestones, polished smooth by countless carriage wheels and horses\' hooves.' };
    // Directional doors
    case '⋀': return { name: 'North Door', type: 'EXIT', description: 'An ornate wooden door set into the north wall, leading to another exhibition hall.' };
    case '⋁': return { name: 'South Door', type: 'EXIT', description: 'An elegant doorway opening southward, framed in carved wood and brass.' };
    case '⋗': return { name: 'East Door', type: 'EXIT', description: 'A polished door facing east, with decorative panels and a brass handle.' };
    case '⋖': return { name: 'West Door', type: 'EXIT', description: 'A stately western entrance with beveled glass panels catching the light.' };
    // Grand doors (two tiles wide)
    case '⊓': return { name: 'Grand Entrance', type: 'EXIT', description: 'Magnificent double doors of polished mahogany, flanked by gilded pilasters. The main entrance to this pavilion.' };
    case '⊔': return { name: 'Grand Exit', type: 'EXIT', description: 'Imposing double doors leading south, their brass fixtures gleaming under gaslight.' };
    case '⊐': return { name: 'Grand East Portal', type: 'EXIT', description: 'A ceremonial eastern entrance with carved tympanum depicting allegorical figures.' };
    case '⊏': return { name: 'Grand West Portal', type: 'EXIT', description: 'A monumental western doorway, its architrave inscribed with the pavilion\'s dedication.' };
    // Back wall with sconce
    case '⌃': return { name: 'Wall Sconce', type: 'FIXTURE', description: 'A gas-lit wall sconce with etched glass shade, casting warm light across the exhibition.' };
    // TWO-TILE TALL OBJECTS - Top portions
    case '¶': return { name: 'Tall Tree Canopy', type: 'FLORA', description: 'A magnificent chestnut tree, its spreading canopy provides welcome shade.' };
    case '§': return { name: 'Gas Lamp', type: 'FIXTURE', description: 'An ornate Victorian gas lamp, its flame flickering warmly behind glass panes.' };
    case '†': return { name: 'Minaret Dome', type: 'STRUCTURE', description: 'A gilded dome topped with a crescent moon finial, gleaming in the sunlight.' };
    case '‡': return { name: 'Column Capital', type: 'STRUCTURE', description: 'An elaborate Corinthian capital with acanthus leaves and scrolling volutes.' };
    case '∫': return { name: 'Palm Fronds', type: 'FLORA', description: 'Exotic palm fronds fan outward, swaying gently in the breeze.' };
    case '∂': return { name: 'Bronze Statue', type: 'ARTWORK', description: 'A classical bronze figure, arms outstretched in heroic pose.' };
    // TWO-TILE TALL OBJECTS - Bottom portions
    case '¤': return { name: 'Tree Trunk', type: 'FLORA', description: 'A sturdy trunk with rough bark, roots spreading into the earth.' };
    case '¥': return { name: 'Lamp Post', type: 'FIXTURE', description: 'A cast-iron lamp post with decorative rings and a heavy base.' };
    case '£': return { name: 'Minaret Base', type: 'STRUCTURE', description: 'The sandstone tower of a minaret, decorated with geometric bands.' };
    case '©': return { name: 'Column Base', type: 'STRUCTURE', description: 'A fluted marble column rising from an Attic-style base.' };
    case '®': return { name: 'Palm Trunk', type: 'FLORA', description: 'A curved palm trunk with distinctive ring-shaped bark patterns.' };
    case '™': return { name: 'Statue Pedestal', type: 'ARTWORK', description: 'A stone pedestal bearing an inscription plate.' };
    // STATUE CULTURAL VARIANTS
    case 'Ü': return { name: 'Buddha Statue', type: 'ARTWORK', description: 'A serene gilded Buddha in meditation pose, seated on a lotus throne.' };
    case 'ü': return { name: 'Small Buddhist Figure', type: 'ARTWORK', description: 'A delicate figure of Kannon or Bodhisattva on a wooden pedestal.' };
    case 'Ö': return { name: 'Egyptian Statue', type: 'ARTWORK', description: 'A pharaonic figure with nemes headdress and crossed crook and flail.' };
    case 'ö': return { name: 'Egyptian Bust', type: 'ARTWORK', description: 'A reproduction pharaoh bust with golden uraeus and kohl-lined eyes.' };
    case 'Ä': return { name: 'African Carving', type: 'ARTWORK', description: 'A tall ancestor figure with elaborate headdress and ritual scarification.' };
    case 'ä': return { name: 'African Mask', type: 'ARTWORK', description: 'A ceremonial mask with cowrie-shell eyes mounted on a display stand.' };
    case 'ß': return { name: 'Aztec Statue', type: 'ARTWORK', description: 'A Mesoamerican deity with jade mask and towering quetzal feather headdress.' };
    case 'æ': return { name: 'Classical Bust', type: 'ARTWORK', description: 'A marble bust in the Greek style with idealized features and curled hair.' };
    case 'œ': return { name: 'Allegorical Figure', type: 'ARTWORK', description: 'A bronze allegory of the Republic, holding torch aloft with patinated surface.' };
    case 'Œ': return { name: 'Monumental Statue', type: 'ARTWORK', description: 'A colossal bronze figure towering overhead, arms raised in heroic gesture.' };
    case 'Æ': return { name: 'Equestrian Statue', type: 'ARTWORK', description: 'A bronze horse and rider, the general\'s sword raised in eternal triumph.' };
    case 'µ': return { name: 'Porcelain Figurine', type: 'ARTWORK', description: 'A delicate ivory or porcelain figurine in graceful pose.' };
    default: return { name: 'Ground', type: 'TERRAIN', description: `Walking surface in ${zoneName}.` };
  }
};

// ===========================================
// FALLING OBJECT ANIMATION COMPONENT
// Renders a tile falling over with rotation, bounce, and dust particles
// ===========================================
interface FallingObjectAnimationProps {
  x: number;
  y: number;
  tileChar: string;
  startTime: number;
  direction: 'left' | 'right';
  themeColor?: string;
  biome?: string;
  zoneName?: string;
  onComplete: () => void;
}

const FallingObjectAnimation: React.FC<FallingObjectAnimationProps> = ({
  x, y, tileChar, startTime, direction, themeColor, biome, zoneName, onComplete
}) => {
  const [phase, setPhase] = useState(0); // 0-1 animation progress
  const [dustParticles, setDustParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
  }>>([]);
  const particleIdRef = useRef(0);
  const hasSpawnedDust = useRef(false);

  // Animation timing
  const FALL_DURATION = 600; // ms for main fall
  const BOUNCE_DURATION = 200; // ms for bounce
  const DUST_DURATION = 800; // ms for dust to fade
  const TOTAL_DURATION = FALL_DURATION + BOUNCE_DURATION + DUST_DURATION;

  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / TOTAL_DURATION, 1);
      setPhase(progress);

      // Spawn dust particles at impact moment (around 60% through animation)
      if (elapsed >= FALL_DURATION * 0.9 && !hasSpawnedDust.current) {
        hasSpawnedDust.current = true;
        const dustColors = ['#d4c4a8', '#c9b896', '#bfae84', '#a89672', '#978560'];
        const newParticles = [];
        for (let i = 0; i < 12; i++) {
          const angle = (Math.random() * Math.PI) - Math.PI / 2; // Upward arc
          const speed = 1.5 + Math.random() * 3;
          newParticles.push({
            id: particleIdRef.current++,
            x: (direction === 'left' ? -8 : 8) + (Math.random() - 0.5) * 16,
            y: 24 + Math.random() * 8,
            vx: Math.cos(angle) * speed * (direction === 'left' ? -1 : 1),
            vy: Math.sin(angle) * speed - 2,
            size: 2 + Math.random() * 4,
            opacity: 0.7 + Math.random() * 0.3,
            color: dustColors[Math.floor(Math.random() * dustColors.length)]
          });
        }
        setDustParticles(newParticles);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    requestAnimationFrame(animate);
  }, [startTime, direction, onComplete]);

  // Update dust particles
  useEffect(() => {
    if (dustParticles.length === 0) return;

    const interval = setInterval(() => {
      setDustParticles(prev => prev
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.15, // Gravity
          opacity: p.opacity - 0.02,
          size: p.size * 0.98
        }))
        .filter(p => p.opacity > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [dustParticles.length]);

  // Calculate animation values
  const fallProgress = Math.min(phase / (FALL_DURATION / TOTAL_DURATION), 1);
  const bounceProgress = phase > FALL_DURATION / TOTAL_DURATION
    ? Math.min((phase - FALL_DURATION / TOTAL_DURATION) / (BOUNCE_DURATION / TOTAL_DURATION), 1)
    : 0;

  // Easing functions
  const easeOutQuad = (t: number) => t * (2 - t);
  const easeOutBounce = (t: number) => {
    if (t < 0.5) return 2 * t * t;
    return 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  // Rotation: starts at 0, ends at 90 (fallen over), with slight overshoot and bounce back
  const baseRotation = easeOutQuad(fallProgress) * 90;
  const bounceRotation = bounceProgress > 0
    ? Math.sin(bounceProgress * Math.PI) * 8 // Slight wobble back
    : 0;
  const rotation = (direction === 'left' ? -1 : 1) * (baseRotation - bounceRotation);

  // Translate: object slides in fall direction as it rotates
  const slideX = easeOutQuad(fallProgress) * 12 * (direction === 'left' ? -1 : 1);
  const slideY = easeOutQuad(fallProgress) * 6; // Slight drop

  // Scale: slight squash on impact
  const squash = bounceProgress > 0 && bounceProgress < 0.5
    ? 1 - Math.sin(bounceProgress * Math.PI * 2) * 0.1
    : 1;

  // Opacity: fade out in final phase
  const fadeProgress = phase > 0.7 ? (phase - 0.7) / 0.3 : 0;
  const opacity = 1 - fadeProgress * 0.3;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX,
        zIndex: 1000 + y, // Above everything
        transformOrigin: direction === 'left' ? 'bottom left' : 'bottom right',
        transform: `translate(${slideX}px, ${slideY}px) rotate(${rotation}deg) scaleY(${squash})`,
        opacity,
        filter: fadeProgress > 0 ? `blur(${fadeProgress * 2}px)` : undefined,
      }}
    >
      <MapTile
        char={tileChar}
        x={x}
        y={y}
        themeColor={themeColor}
        biome={biome as BiomeType}
        zoneName={zoneName || ''}
        animate={false}
      />

      {/* Dust particles */}
      <svg
        className="absolute inset-0 overflow-visible pointer-events-none"
        style={{ width: TILE_SIZE_PX, height: TILE_SIZE_PX }}
      >
        {dustParticles.map(p => (
          <g key={p.id}>
            {/* Main dust puff */}
            <circle
              cx={16 + p.x}
              cy={p.y}
              r={p.size}
              fill={p.color}
              opacity={p.opacity * 0.6}
            />
            {/* Dust cloud effect */}
            <circle
              cx={16 + p.x}
              cy={p.y}
              r={p.size * 1.5}
              fill={p.color}
              opacity={p.opacity * 0.3}
              style={{ filter: 'blur(2px)' }}
            />
          </g>
        ))}

        {/* Impact flash at moment of contact */}
        {bounceProgress > 0 && bounceProgress < 0.3 && (
          <ellipse
            cx={direction === 'left' ? 8 : 24}
            cy={30}
            rx={12 + bounceProgress * 20}
            ry={4 + bounceProgress * 8}
            fill="#fff8dc"
            opacity={0.5 * (1 - bounceProgress / 0.3)}
            style={{ filter: 'blur(3px)' }}
          />
        )}
      </svg>
    </div>
  );
};

const OverworldMap: React.FC = () => {
  const { state, dispatch } = useGame();
  const { player, npcs, interaction, zones, highlightedEntityId, gameTime, introDialogueOpen } = state;
  const zone = zones[player.currentZoneId];

  // Determine if we should use per-tile fog (nighttime or dark indoor spaces)
  const hour = gameTime?.hour ?? 12;
  const minute = gameTime?.minute ?? 0;
  const isNighttime = hour >= 18 || hour < 6;

  // Get time-based colors for sky gradients and water
  const timeColors = useMemo(() => getInterpolatedTimeColors(hour, minute), [hour, minute]);
  const isDarkIndoorSpace = zone.biome === 'TOWER_BASE' || zone.biome === 'GRAND_HALL' ||
                            zone.name.toLowerCase().includes('machine') ||
                            zone.name.toLowerCase().includes('galerie');
  const usePerTileFog = isNighttime || isDarkIndoorSpace;
  const [nearbyLabel, setNearbyLabel] = useState<string | null>(null);
  const [hoverTerrain, setHoverTerrain] = useState<{ name: string; type: string; description: string } | null>(null);
  const [collectibleOnTile, setCollectibleOnTile] = useState<Item | null>(null);
  const [nearbySeating, setNearbySeating] = useState<string | null>(null); // Name of nearby chair/bench/stool

  // Memoized filters for performance - avoid recalculating on every render
  const zoneNpcs = useMemo(() =>
    npcs.filter(n => n.location.zoneId === zone.id),
    [npcs, zone.id]
  );

  const zoneItems = useMemo(() =>
    state.worldItems.filter(item => item.location.zoneId === zone.id),
    [state.worldItems, zone.id]
  );

  // Memoize NPC proximity calculations - only recalculate when player or NPCs move
  const npcProximityMap = useMemo(() => {
    const map = new Map<string, { isNearby: boolean; isAdjacent: boolean }>();
    zoneNpcs.forEach(npc => {
      const dx = Math.abs(npc.location.x - player.x);
      const dy = Math.abs(npc.location.y - player.y);
      const distance = Math.sqrt(dx * dx + dy * dy);
      map.set(npc.id, {
        isNearby: distance <= 2.5,
        isAdjacent: distance <= 1.5
      });
    });
    return map;
  }, [zoneNpcs, player.x, player.y]);

  // Pre-compute light sources for fog calculations - only changes when zone changes
  const lightSources = useMemo(() => {
    if (!usePerTileFog) return [];
    const sources: { x: number; y: number; radius: number }[] = [];
    zone.mapData.forEach((r, ly) => {
      for (let lx = 0; lx < r.length; lx++) {
        const c = r[lx];
        if (c === 'l') sources.push({ x: lx, y: ly, radius: 4 });
        else if (c === 'L') sources.push({ x: lx, y: ly, radius: 5 });
        else if ('‹›¬⌃'.includes(c)) sources.push({ x: lx, y: ly, radius: 3.5 });
        else if (c === 'Z') sources.push({ x: lx, y: ly, radius: 4 });
      }
    });
    return sources;
  }, [zone.mapData, usePerTileFog]);

  // Pre-split map data to avoid repeated string splitting
  const splitMapData = useMemo(() =>
    zone.mapData.map(row => row.split('')),
    [zone.mapData]
  );

  // Memoized tile grid - only recalculates when zone data or theme changes
  // Player position, fog, and animations are handled separately for performance
  const tileGrid = useMemo(() => {
    return splitMapData.flatMap((chars, y) =>
      chars.map((char, x) => {
        const isMultiTile = MULTI_TILE_CHARS.has(char);
        // Z-index scheme for proper depth sorting:
        // - Regular tiles: y (low, underneath everything)
        // - Multi-tile objects: y * 10 + 200 (scaled to allow player/NPC to slot between rows)
        // - Player/NPC at Y: y * 10 + 201 (in front of objects at same Y, behind objects at Y+1)
        return (
          <div
            key={`${x}-${y}`}
            data-x={x}
            data-y={y}
            className="relative"
            style={{
              // Match grid cell size exactly to prevent subpixel gaps
              width: TILE_SIZE_PX,
              height: TILE_SIZE_PX,
              overflow: 'visible',
              zIndex: isMultiTile ? y * 10 + 200 : y,
            }}
          >
            <MapTile
              char={char}
              x={x}
              y={y}
              themeColor={zone.themeColor}
              biome={zone.biome}
              zoneName={zone.name}
              animate={true}
              flagState={char === 'y' ? 'raised' : undefined}
            />
          </div>
        );
      })
    );
  }, [splitMapData, zone.themeColor, zone.biome, zone.name]);

  // Compute fog opacities only when player moves or lighting changes
  const fogOpacities = useMemo(() => {
    if (!usePerTileFog) return null;
    const opacities = new Map<string, number>();
    const maxVisibility = isNighttime ? 6 : 8;
    const fogStart = isNighttime ? 3 : 5;

    for (let y = 0; y < splitMapData.length; y++) {
      for (let x = 0; x < splitMapData[y].length; x++) {
        const dx = Math.abs(x - player.x);
        const dy = Math.abs(y - player.y);
        const distance = Math.sqrt(dx * dx + dy * dy);

        let opacity = distance <= fogStart ? 0 :
          Math.min(0.85, (distance - fogStart) / (maxVisibility - fogStart) * 0.85);

        // Reduce fog near light sources
        for (const light of lightSources) {
          const ldx = Math.abs(x - light.x);
          const ldy = Math.abs(y - light.y);
          const lightDist = Math.sqrt(ldx * ldx + ldy * ldy);
          if (lightDist <= light.radius) {
            const lightFactor = 1 - (lightDist / light.radius);
            opacity = Math.max(0, opacity - lightFactor * 0.6);
          }
        }

        if (opacity > 0) {
          opacities.set(`${x}-${y}`, opacity);
        }
      }
    }
    return opacities;
  }, [splitMapData, player.x, player.y, usePerTileFog, isNighttime, lightSources]);

  // Set initial zoom based on screen size - mobile starts more zoomed out, desktop more zoomed in
  // During intro dialogue, start more zoomed in for dramatic effect
  const getInitialZoom = () => {
    if (typeof window !== 'undefined') {
      // Start zoomed in during intro for cinematic effect
      return window.innerWidth < 768 ? 1.2 : 2.2;
    }
    return 2.2;
  };
  const getNormalZoom = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 0.85 : 1.5;
    }
    return 1.5;
  };
  const [zoom, setZoom] = useState(getInitialZoom());
  const [preSitZoom, setPreSitZoom] = useState<number | null>(null);
  const introZoomCompleteRef = useRef(false);

  // Cinematic zoom-out effect when intro dialogue closes
  const introZoomAnimRef = useRef<number | null>(null);
  const introZoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only run once when intro dialogue closes
    if (!introDialogueOpen && !introZoomCompleteRef.current) {
      introZoomCompleteRef.current = true;
      const targetZoom = getNormalZoom();
      const startZoom = zoom;
      const duration = 2500; // 2.5 seconds for smooth pan out
      const startTime = Date.now();
      let cancelled = false;

      const animateZoom = () => {
        if (cancelled) return;

        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const newZoom = startZoom + (targetZoom - startZoom) * eased;

        setZoom(newZoom);

        if (progress < 1 && !cancelled) {
          introZoomAnimRef.current = requestAnimationFrame(animateZoom);
        }
      };

      // Small delay before starting zoom out
      introZoomTimeoutRef.current = setTimeout(() => {
        if (!cancelled) {
          introZoomAnimRef.current = requestAnimationFrame(animateZoom);
        }
      }, 300);

      return () => {
        cancelled = true;
        if (introZoomTimeoutRef.current) {
          clearTimeout(introZoomTimeoutRef.current);
        }
        if (introZoomAnimRef.current) {
          cancelAnimationFrame(introZoomAnimRef.current);
        }
      };
    }
  }, [introDialogueOpen]);

  // Smart camera position - independent of player, only moves when needed
  // We use a target position and animate toward it for smooth camera movement
  const [cameraPos, setCameraPos] = useState(() => ({
    x: zone.width / 2,
    y: zone.height / 2
  }));
  const [cameraTarget, setCameraTarget] = useState(() => ({
    x: zone.width / 2,
    y: zone.height / 2
  }));
  const cameraAnimRef = useRef<number | null>(null);

  // Smooth camera animation - lerp toward target
  // Runs continuously to ensure smooth following
  useEffect(() => {
    const animateCamera = () => {
      setCameraPos(current => {
        const dx = cameraTarget.x - current.x;
        const dy = cameraTarget.y - current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If close enough, snap to target
        if (distance < 0.05) {
          return cameraTarget;
        }

        // Smooth lerp with easing (0.12 = smooth but responsive)
        const lerpFactor = 0.12;
        return {
          x: current.x + dx * lerpFactor,
          y: current.y + dy * lerpFactor
        };
      });
      cameraAnimRef.current = requestAnimationFrame(animateCamera);
    };

    cameraAnimRef.current = requestAnimationFrame(animateCamera);
    return () => {
      if (cameraAnimRef.current) {
        cancelAnimationFrame(cameraAnimRef.current);
      }
    };
  }, [cameraTarget]);

  // Slow zoom effect when sitting
  useEffect(() => {
    if (player.isSitting) {
      // Save current zoom level to restore when standing
      if (preSitZoom === null) {
        setPreSitZoom(zoom);
      }
      // Slowly zoom in to 1.8 (or current + 0.5, whichever is higher)
      const targetZoom = Math.max(zoom + 0.5, 1.8);
      const zoomStep = 0.02;
      const interval = setInterval(() => {
        setZoom(z => {
          if (z >= targetZoom) {
            clearInterval(interval);
            return targetZoom;
          }
          return Math.min(z + zoomStep, targetZoom);
        });
      }, 30); // 30ms per step = smooth animation over ~750ms
      return () => clearInterval(interval);
    } else if (preSitZoom !== null) {
      // Standing up - slowly zoom back to previous level
      const targetZoom = preSitZoom;
      const currentZoom = zoom;
      const zoomStep = 0.03;
      const interval = setInterval(() => {
        setZoom(z => {
          if (z <= targetZoom) {
            clearInterval(interval);
            setPreSitZoom(null);
            return targetZoom;
          }
          return Math.max(z - zoomStep, targetZoom);
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [player.isSitting]);

  // Drag state for map panning
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });  // Accumulated offset
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });    // Mouse position at drag start
  const [dragStartOffset, setDragStartOffset] = useState({ x: 0, y: 0 }); // Offset at drag start
  const dragContainerRef = useRef<HTMLDivElement>(null);

  // Note: dragOffset reset on zone change is handled in the camera logic section below

  // Zone entry: calculate optimal camera position that shows map well while keeping player visible
  const prevZoneIdRef = useRef(zone.id);
  useEffect(() => {
    if (prevZoneIdRef.current !== zone.id) {
      prevZoneIdRef.current = zone.id;

      // Calculate camera position that:
      // 1. Tries to center on the map
      // 2. But ensures player is visible with buffer from edge
      const mapCenterX = zone.width / 2;
      const mapCenterY = zone.height / 2;

      // Start with map center as ideal camera position
      let newCamX = mapCenterX;
      let newCamY = mapCenterY;

      // Calculate visible area in tiles - use conservative estimate for map container
      const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 600;
      const mapContainerWidth = windowWidth * 0.4;
      const mapContainerHeight = windowHeight * 0.7;
      const visibleTilesX = mapContainerWidth / 32 / zoom / 2;
      const visibleTilesY = mapContainerHeight / 32 / zoom / 2;
      const buffer = 4; // Keep player this many tiles from viewport edge

      // Check if player would be visible with map centered
      // If not, adjust camera to bring player into view with buffer
      const playerDistFromCamX = player.x - newCamX;
      const playerDistFromCamY = player.y - newCamY;

      if (playerDistFromCamX < -(visibleTilesX - buffer)) {
        newCamX = player.x + (visibleTilesX - buffer);
      } else if (playerDistFromCamX > (visibleTilesX - buffer)) {
        newCamX = player.x - (visibleTilesX - buffer);
      }

      if (playerDistFromCamY < -(visibleTilesY - buffer)) {
        newCamY = player.y + (visibleTilesY - buffer);
      } else if (playerDistFromCamY > (visibleTilesY - buffer)) {
        newCamY = player.y - (visibleTilesY - buffer);
      }

      // On zone change, snap camera immediately (no animation)
      setCameraPos({ x: newCamX, y: newCamY });
      setCameraTarget({ x: newCamX, y: newCamY });
      setDragOffset({ x: 0, y: 0 });
    }
  }, [zone.id, zone.width, zone.height, player.x, player.y, zoom]);

  // Player movement: check if camera needs to follow (dead zone logic)
  useEffect(() => {
    // Calculate visible area - use conservative estimate for map container
    // Map is roughly 40% of window width (center column between two sidebars)
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 600;
    const mapContainerWidth = windowWidth * 0.4; // Conservative: sidebars take ~60%
    const mapContainerHeight = windowHeight * 0.7; // Header/footer take some space

    const visibleTilesX = mapContainerWidth / 32 / zoom / 2;
    const visibleTilesY = mapContainerHeight / 32 / zoom / 2;
    const buffer = 4; // Dead zone buffer - camera won't move if player is this far from edge

    // Calculate player distance from current camera TARGET (not current pos, to prevent jitter)
    const dx = player.x - cameraTarget.x;
    const dy = player.y - cameraTarget.y;

    // Check if player is approaching viewport edge
    let newCamX = cameraTarget.x;
    let newCamY = cameraTarget.y;
    let needsUpdate = false;

    // Only move camera if player would be within `buffer` tiles of viewport edge
    if (dx < -(visibleTilesX - buffer)) {
      newCamX = player.x + (visibleTilesX - buffer);
      needsUpdate = true;
    } else if (dx > (visibleTilesX - buffer)) {
      newCamX = player.x - (visibleTilesX - buffer);
      needsUpdate = true;
    }

    if (dy < -(visibleTilesY - buffer)) {
      newCamY = player.y + (visibleTilesY - buffer);
      needsUpdate = true;
    } else if (dy > (visibleTilesY - buffer)) {
      newCamY = player.y - (visibleTilesY - buffer);
      needsUpdate = true;
    }

    if (needsUpdate) {
      // Set target - the animation loop will smoothly move camera there
      setCameraTarget({ x: newCamX, y: newCamY });
    }
  }, [player.x, player.y, zoom, cameraTarget.x, cameraTarget.y]);

  // Interaction Helper - Scans 3x3 grid around player
  const getInteractionTarget = (px: number, py: number) => {
      // 1. Check for items at exact position (highest priority)
      const itemHere = state.worldItems?.find(item =>
          item.location?.x === px &&
          item.location?.y === py &&
          item.location?.zoneId === player.currentZoneId
      );
      if (itemHere) return { type: 'PICKUP_ITEM', target: itemHere };

      // 2. Check NPC (High Priority)
      const npc = npcs.find(n => Math.abs(n.location.x - px) <= 1.5 && Math.abs(n.location.y - py) <= 1.5 && n.location.zoneId === player.currentZoneId);
      if (npc) return { type: 'EAVESDROP', target: npc };

      // 3. Check Neighbors for Landmarks
      for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
              const tx = px + dx;
              const ty = py + dy;
              const char = zone.mapData[ty]?.[tx];

              if (char === 'A') return { type: 'SCRUTINIZE', target: { name: "Eiffel Tower Pylon", id: 'TOWER' } };

              // Stage - mount/dismount interaction
              if (char === 'X') {
                  return {
                      type: isOnStage ? 'DISMOUNT_STAGE' : 'MOUNT_STAGE',
                      target: { name: "Stage", id: 'STAGE', x: tx, y: ty }
                  };
              }

              // Exits - only doors on the actual edges
              if (char === '+') {
                  const isEdge = ty === 0 || ty === zone.height - 1 || tx === 0 || tx === zone.width - 1;
                  if (isEdge) {
                      return { type: 'ENTER', target: { name: "Next Area", id: 'EXIT' } };
                  }
              }

              // Legacy/String checks
              const row = zone.mapData[ty];
              if (row && row.substring(tx, tx + 6) === '[LOOM]') return { type: 'USE_DEVICE', target: { name: "Textile Exhibit", id: 'LOOM' } };

              // Char checks
              if (char === 'C') return { type: 'USE_DEVICE', target: { name: "Telegraph Cable", id: 'CABLE' } };
              if (char === 'E') return { type: 'USE_DEVICE', target: { name: "Exhibit", id: 'EXHIBIT' } };
              if (char === 'e') return { type: 'USE_DEVICE', target: { name: "Elevator", id: 'ELEVATOR' } };
              if (char === 'G') return { type: 'USE_DEVICE', target: { name: "Gala Entrance", id: 'GALA' } };
              // Special landmark scrutiny (these require hold bar for detailed inspection + possible image generation)
              if (char === 'O') return { type: 'SCRUTINIZE', target: { name: "Observation Telescope", id: 'TELESCOPE' } };
              if (char === 'P') return { type: 'SCRUTINIZE', target: { name: "Tower Pylon", id: 'PYLON' } };
              if (char === 'F') return { type: 'SCRUTINIZE', target: { name: "The Luminous Fountain", id: 'FOUNTAIN' } };
              // Note: LAMP, TREE, NEWSPAPER, BENCH etc. are now handled by tile interactions below
          }
      }

      // 4. Check for tile interactions (from tileInteractions.ts)
      // First check tile player is standing on
      const playerChar = zone.mapData[py]?.[px];
      if (playerChar) {
          const playerTileId = getTileId(playerChar);
          if (playerTileId) {
              const interaction = getInteractionForTile(playerTileId);
              if (interaction && interaction.onTile) {
                  return { type: 'TILE_INTERACT', target: { interaction, tileId: playerTileId, char: playerChar } };
              }
          }
      }

      // Then check adjacent tiles for interactions that work when adjacent
      for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue; // Skip player's tile (already checked)
              const tx = px + dx;
              const ty = py + dy;
              const char = zone.mapData[ty]?.[tx];
              if (char) {
                  const tileId = getTileId(char);
                  if (tileId) {
                      const interaction = getInteractionForTile(tileId);
                      if (interaction && !interaction.onTile) {
                          return { type: 'TILE_INTERACT', target: { interaction, tileId, char } };
                      }
                  }
              }
          }
      }

      // 5. Default - Nothing specific found
      return { type: 'NONE', target: null };
  };

  // Track timeout IDs for cleanup
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // Use refs to track interaction state for event handlers (avoids stale closure issues)
  const interactionRef = useRef(interaction);
  useEffect(() => {
    interactionRef.current = interaction;
  }, [interaction]);

  // State for insight modal
  const [insightModal, setInsightModal] = useState<{ text: string; type: string } | null>(null);

  // State for tile event modal (mini-events from objects)
  const [tileEventModal, setTileEventModal] = useState<TileEvent | null>(null);

  // State for embarrassment modal (breaking objects or NPC reactions)
  const [embarrassmentModal, setEmbarrassmentModal] = useState<{ objectName: string; description: string; isFatal?: boolean; npcReaction?: NPCReaction } | null>(null);

  // Ref to track pending breakage event (to trigger moral dilemma after embarrassment modal)
  const pendingBreakageRef = useRef<{ objectType: 'statue' | 'display' } | null>(null);

  // State for confirmation action modal (yes/no prompts)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  // Track lowered flagpoles and splashed fountains by position (zone:x:y format)
  const [loweredFlagpoles, setLoweredFlagpoles] = useState<Set<string>>(new Set());

  // State for animating flag (shows progress during lowering)
  const [animatingFlag, setAnimatingFlag] = useState<{ x: number; y: number; progress: number } | null>(null);

  // Walking stick swing state
  const [isSwingingCane, setIsSwingingCane] = useState(false);
  const [isChargingSwing, setIsChargingSwing] = useState(false);
  const [swingPower, setSwingPower] = useState(0);
  const swingChargeRef = useRef<NodeJS.Timeout | null>(null);

  // Track shaking objects (by position key)
  const [shakingObjects, setShakingObjects] = useState<Set<string>>(new Set());

  // Track falling/breaking objects with full animation state
  interface FallingObject {
    x: number;
    y: number;
    tileChar: string;
    startTime: number;
    direction: 'left' | 'right'; // Which way it topples
  }
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);

  // Track sliding items (collectibles hit by cane)
  interface SlidingItem {
    itemId: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    startTime: number;
    duration: number; // ms
  }
  const [slidingItems, setSlidingItems] = useState<SlidingItem[]>([]);

  // Force re-render during sliding animations for smooth motion
  const [, setAnimationTick] = useState(0);
  useEffect(() => {
    if (slidingItems.length === 0) return;

    const animationFrame = requestAnimationFrame(function animate() {
      setAnimationTick(t => t + 1);
      if (slidingItems.length > 0) {
        requestAnimationFrame(animate);
      }
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [slidingItems.length]);

  // Track if player is on stage (elevated position)
  const [isOnStage, setIsOnStage] = useState(false);

  // Reset stage state when changing zones
  useEffect(() => {
      setIsOnStage(false);
  }, [player.currentZoneId]);

  // Throttle ref for movement - prevents input pile-up when holding arrow keys
  const lastMoveTimeRef = useRef(0);
  const MOVE_THROTTLE_MS = 75; // 75ms = ~13 moves/sec, smooth dignified walking pace

  // Track held arrow keys for diagonal movement
  const heldKeysRef = useRef<Set<string>>(new Set());

  // Keyboard movement & Interaction - SPACEBAR is sole interaction key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.gameState !== GameState.EXPLORING) return;
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

      // Track arrow keys being held
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        heldKeysRef.current.add(e.key);
      }

      // Use ref to get current interaction state (avoids stale closure)
      const currentInteraction = interactionRef.current;

      // SHIFT - Walking stick swing (hold to charge, release to swing)
      if (e.key === 'Shift' && !isSwingingCane && !isChargingSwing) {
          e.preventDefault();
          setIsChargingSwing(true);
          setSwingPower(0);

          // Start charging
          const chargeStart = Date.now();
          const chargeInterval = setInterval(() => {
              const elapsed = Date.now() - chargeStart;
              const progress = Math.min(100, elapsed / 10); // Full charge in 1 second
              setSwingPower(progress);

              if (progress >= 100) {
                  clearInterval(chargeInterval);
              }
          }, 16);

          swingChargeRef.current = chargeInterval;
          return;
      }

      // SPACE BAR - Universal interaction key
      if (e.key === ' ') {
          e.preventDefault(); // Prevent scrolling

          // If sitting, SPACE always stands up (regardless of current tile)
          if (player.isSitting) {
              dispatch({ type: 'STAND_UP' });
              dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
                  id: Date.now().toString(),
                  sender: 'DM',
                  text: 'You rise, resuming the perambulations that constitute the endless duty of the observer.'
              }});
              return;
          }

          // If already in an interaction, don't start a new one
          if (currentInteraction.active || currentInteraction.isResolving) return;

          const targetData = getInteractionTarget(player.x, player.y);

          // INSTANT ACTIONS - These happen immediately on press

          // 1. Pick up items (on same tile)
          if (targetData.type === 'PICKUP_ITEM') {
              const item = targetData.target as any;
              dispatch({ type: 'PICKUP_ITEM', payload: item.id });
              dispatch({ type: 'ADD_LOG', payload: {
                  id: Date.now().toString(),
                  type: 'SYSTEM',
                  text: `Picked up: ${item.name}`,
                  timestamp: Date.now()
              }});
              // Grant small inspiration for finding items
              dispatch({ type: 'GAIN_INSPIRATION', payload: { amount: 2, source: `Found ${item.name}` } });
              // Picking up and examining an item takes time
              dispatch({ type: 'ADVANCE_TIME', payload: 5 });
              // Auto-open item modal disabled - player can view item in inventory if desired
              // setTimeout(() => {
              //     dispatch({ type: 'SHOW_ITEM_MODAL', payload: { ...item, acquiredAt: Date.now() } });
              // }, 1000);
              return;
          }

          // 2. Talk to NPCs (adjacent)
          if (targetData.type === 'EAVESDROP') {
              const npc = targetData.target as NPC;
              dispatch({ type: 'START_DIALOGUE', payload: npc });
              return;
          }

          // 3. Enter doors/passages
          if (targetData.type === 'ENTER') {
               const midX = zone.width / 2;
               const midY = zone.height / 2;
               let dir: 'N'|'S'|'E'|'W' = 'N';
               if (player.y < midY) dir = 'N';
               else if (player.y > midY) dir = 'S';
               else if (player.x > midX) dir = 'E';
               else dir = 'W';

               dispatch({ type: 'CHANGE_ZONE', payload: { targetId: null, direction: dir } });
               return;
          }

          // 3b. Mount stage - show confirmation dialog
          if (targetData.type === 'MOUNT_STAGE') {
              const stageTarget = targetData.target as { x: number; y: number };
              setConfirmAction({
                  id: 'mount_stage',
                  title: 'Ascend to the Stage?',
                  description: 'A raised wooden platform beckons. To mount it would be to place oneself before the assembled multitude—an act requiring either considerable nerve or considerable vanity.',
                  warning: 'You will be visible to all in attendance.',
                  yesText: 'Yes, ascend',
                  noText: 'No, remain below',
                  onConfirm: () => {
                      // Move player onto the stage tile
                      dispatch({ type: 'MOVE_PLAYER', payload: { x: stageTarget.x, y: stageTarget.y } });
                      setIsOnStage(true);

                      const mountNarratives = [
                          "With a certain theatrical deliberation, you step up onto the stage. The boards creak beneath your feet as the ambient murmur of the crowd seems to shift, taking note of your presence.",
                          "You ascend to the stage with the measured gravity of one who has long observed the curious rituals of public exhibition. How strange, now, to be the observed rather than the observer.",
                          "The stage receives you with an almost expectant air. From this modest elevation, the sea of faces below takes on an altogether different aspect—more landscape than congregation.",
                          "Mounting the platform, you are suddenly conscious of an exposure previously unknown to you. The vantage, however, offers compensations: a commanding view of the proceedings below."
                      ];
                      dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
                          id: Date.now().toString(),
                          sender: 'DM',
                          text: mountNarratives[Math.floor(Math.random() * mountNarratives.length)]
                      }});

                      // Slight composure cost for the public exposure
                      dispatch({ type: 'ADJUST_COMPOSURE', payload: -3 });
                      dispatch({ type: 'ADVANCE_TIME', payload: 5 });
                      setConfirmAction(null);
                  },
                  onCancel: () => {
                      dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
                          id: Date.now().toString(),
                          sender: 'DM',
                          text: 'Prudence, or perhaps a becoming modesty, restrains you. The stage shall await another aspirant to its boards.'
                      }});
                      setConfirmAction(null);
                  }
              });
              return;
          }

          // 3c. Dismount stage - show confirmation dialog
          if (targetData.type === 'DISMOUNT_STAGE') {
              setConfirmAction({
                  id: 'dismount_stage',
                  title: 'Descend from the Stage?',
                  description: 'Your moment upon the boards draws to its natural conclusion. The ground below offers the anonymity of the crowd once more.',
                  yesText: 'Yes, descend',
                  noText: 'No, remain on stage',
                  onConfirm: () => {
                      // Find an adjacent walkable tile to move to
                      const directions = [
                          { dx: 0, dy: 1 },  // South
                          { dx: 0, dy: -1 }, // North
                          { dx: 1, dy: 0 },  // East
                          { dx: -1, dy: 0 }, // West
                      ];

                      for (const dir of directions) {
                          const newX = player.x + dir.dx;
                          const newY = player.y + dir.dy;
                          const targetChar = zone.mapData[newY]?.[newX];

                          // Check if walkable and not another stage
                          if (targetChar && targetChar !== 'X') {
                              const walkableChars = '.≈~░▓═_';
                              if (walkableChars.includes(targetChar) || targetChar === ' ') {
                                  dispatch({ type: 'MOVE_PLAYER', payload: { x: newX, y: newY } });
                                  break;
                              }
                          }
                      }

                      setIsOnStage(false);

                      const dismountNarratives = [
                          "You step down from the stage, returning to the comfortable anonymity of the crowd. The boards release you without ceremony.",
                          "Descending from your brief elevation, you feel the solid ground receive you once more. The sensation of being observed fades like morning mist.",
                          "With a final glance at the now-empty platform behind you, you rejoin the great mass of humanity that constitutes the Fair's true spectacle.",
                          "You quit the stage with something approaching relief. The peculiar vulnerability of exhibition gives way to the shelter of the common throng."
                      ];
                      dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
                          id: Date.now().toString(),
                          sender: 'DM',
                          text: dismountNarratives[Math.floor(Math.random() * dismountNarratives.length)]
                      }});

                      dispatch({ type: 'ADVANCE_TIME', payload: 2 });
                      setConfirmAction(null);
                  },
                  onCancel: () => {
                      dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
                          id: Date.now().toString(),
                          sender: 'DM',
                          text: 'You remain upon the stage, savoring—or enduring—your moment of visibility.'
                      }});
                      setConfirmAction(null);
                  }
              });
              return;
          }

          // HOLD ACTIONS - These require holding spacebar until gold zone

          // 4. Scrutinize objects (furniture, landmarks, displays)
          if (targetData.type === 'SCRUTINIZE') {
              dispatch({ type: 'INTERACTION_START', payload: 'SCRUTINIZE' });
              return;
          }

          // 5. Use devices (telegraph, loom, etc)
          if (targetData.type === 'USE_DEVICE') {
              dispatch({ type: 'INTERACTION_START', payload: 'USE_DEVICE' });
              return;
          }

          // 6. Tile interactions (instant narrative from pre-written pool)
          if (targetData.type === 'TILE_INTERACT') {
              const { interaction, tileId } = targetData.target as { interaction: TileInteraction, tileId: string, char: string };

              // Handle sitting interactions specially
              if (interaction.action === 'Sit') {
                  // If already sitting, stand up instead
                  if (player.isSitting) {
                      dispatch({ type: 'STAND_UP' });
                      dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
                          id: Date.now().toString(),
                          sender: 'DM',
                          text: 'You rise, resuming the perambulations that constitute the endless duty of the observer.'
                      }});
                      return;
                  }

                  // Get a readable name for the sittable object
                  const sittableNames: Record<string, string> = {
                      'CUSHION': 'cushion',
                      'BENCH': 'bench',
                      'WIDE_BENCH': 'bench',
                      'SEAT': 'seat',
                      'CHAIR_N': 'chair',
                      'CHAIR_S': 'chair',
                      'CHAIR_E': 'chair',
                      'CHAIR_W': 'chair'
                  };
                  const sittableName = sittableNames[tileId] || 'seat';

                  // Detect cultural theme from zone name for contextual interactions
                  const zoneLower = zone.name.toLowerCase();
                  let culturalTheme = 'default';
                  if (zoneLower.includes('japan')) culturalTheme = 'japanese';
                  else if (zoneLower.includes('chin')) culturalTheme = 'chinese';
                  else if (zoneLower.includes('persi') || zoneLower.includes('iran')) culturalTheme = 'persian';
                  else if (zoneLower.includes('egypt')) culturalTheme = 'egyptian';
                  else if (zoneLower.includes('moor') || zoneLower.includes('tunis') || zoneLower.includes('alger')) culturalTheme = 'moorish';

                  // Get random narrative from the pool
                  const narrative = getInteractionNarrative(interaction, culturalTheme);

                  // Add to narrator log
                  dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
                      id: Date.now().toString(),
                      sender: 'DM',
                      text: narrative
                  }});

                  // Dispatch sit down action
                  dispatch({ type: 'SIT_DOWN', payload: sittableName });

                  // Chance for inspiration while contemplating
                  if (Math.random() < interaction.inspirationChance) {
                      dispatch({ type: 'GAIN_INSPIRATION', payload: { amount: 1, source: `Contemplating from ${sittableName}` } });
                  }

                  // Sitting and contemplating takes time (10 minutes)
                  dispatch({ type: 'ADVANCE_TIME', payload: 10 });

                  return;
              }

              // === CHECK FOR CONFIRMATION ACTIONS (flagpole, fountain, etc.) ===
              const confirmActionDef = getConfirmationAction(tileId);
              if (confirmActionDef) {
                  // Find the actual tile position (for adjacent tiles)
                  let targetX = player.x;
                  let targetY = player.y;
                  for (let dy = -1; dy <= 1; dy++) {
                      for (let dx = -1; dx <= 1; dx++) {
                          const tx = player.x + dx;
                          const ty = player.y + dy;
                          const tileChar = zone.mapData[ty]?.[tx];
                          if (tileChar && getTileId(tileChar) === tileId) {
                              targetX = tx;
                              targetY = ty;
                              break;
                          }
                      }
                  }
                  const tileKey = `${zone.id}:${targetX}:${targetY}`;

                  // Check if already lowered (for flagpole)
                  if (tileId === 'FLAGPOLE' && loweredFlagpoles.has(tileKey)) {
                      dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
                          id: Date.now().toString(),
                          sender: 'DM',
                          text: 'The flag already hangs limply at the base of the pole, a testament to your earlier transgression.'
                      }});
                      return;
                  }

                  // Show confirmation modal instead of immediate action
                  setConfirmAction({
                      id: tileId,
                      title: confirmActionDef.title,
                      description: confirmActionDef.description,
                      warning: confirmActionDef.warning,
                      yesText: confirmActionDef.yesText,
                      noText: confirmActionDef.noText,
                      onConfirm: () => {
                          // For flagpole, start the animation
                          if (confirmActionDef.animationType === 'flag_lower') {
                              // Start animating the flag lowering
                              setAnimatingFlag({ x: targetX, y: targetY, progress: 0 });

                              // Animate over 2 seconds
                              const startTime = Date.now();
                              const duration = 2000;
                              const animate = () => {
                                  const elapsed = Date.now() - startTime;
                                  const p = Math.min(elapsed / duration, 1);
                                  setAnimatingFlag({ x: targetX, y: targetY, progress: p });

                                  if (p < 1) {
                                      requestAnimationFrame(animate);
                                  } else {
                                      // Animation complete - mark as lowered permanently
                                      setLoweredFlagpoles(prev => new Set([...prev, tileKey]));
                                      setAnimatingFlag(null);
                                  }
                              };
                              requestAnimationFrame(animate);
                          }

                          // Get random success narrative
                          const narrative = confirmActionDef.successNarratives[
                              Math.floor(Math.random() * confirmActionDef.successNarratives.length)
                          ];

                          // Add narrative to log
                          dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
                              id: Date.now().toString(),
                              sender: 'DM',
                              text: narrative
                          }});

                          // Apply stat changes
                          if (confirmActionDef.reputationChange) {
                              dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: confirmActionDef.reputationChange } });
                          }
                          if (confirmActionDef.composureChange) {
                              dispatch({ type: 'ADJUST_COMPOSURE', payload: confirmActionDef.composureChange });
                          }
                          if (confirmActionDef.inspirationChange) {
                              dispatch({ type: 'GAIN_INSPIRATION', payload: { amount: confirmActionDef.inspirationChange, source: confirmActionDef.title } });
                          }
                          if (confirmActionDef.malaiseChange) {
                              dispatch({ type: 'ADJUST_STAT', payload: { stat: 'malaise', delta: confirmActionDef.malaiseChange } });
                          }

                          // Special actions take time (10 minutes)
                          dispatch({ type: 'ADVANCE_TIME', payload: 10 });

                          setConfirmAction(null);
                      },
                      onCancel: () => {
                          // Show cancel narrative
                          dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
                              id: Date.now().toString(),
                              sender: 'DM',
                              text: confirmActionDef.cancelNarrative
                          }});
                          setConfirmAction(null);
                      }
                  });
                  return;
              }

              // Non-sitting interactions - check for special events, breakables, and dangers

              // === KIOSK SPECIAL INTERACTION ===
              // Opens the kiosk modal for purchasing consumables
              if (tileId === 'KIOSK') {
                  dispatch({ type: 'SHOW_KIOSK_MODAL' });
                  return;
              }

              // === ARC LAMP SPECIAL DANGER ===
              if (tileId === 'ARC_LAMP') {
                  const danger = checkArcLampDanger();
                  if (danger.type === 'fatal') {
                      // Fatal electrocution - game over
                      setEmbarrassmentModal({
                          objectName: 'Arc Lamp',
                          description: danger.description!,
                          isFatal: true
                      });
                      return;
                  } else if (danger.type === 'shock') {
                      // Non-fatal shock
                      dispatch({ type: 'ADJUST_HEALTH', payload: -15 });
                      dispatch({ type: 'ADJUST_COMPOSURE', payload: -5 });
                      dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
                          id: Date.now().toString(),
                          sender: 'DM',
                          text: danger.description!
                      }});
                      dispatch({ type: 'TRIGGER_SHAKE' });
                      return;
                  }
                  // If safe, continue with normal interaction
              }

              // === CHECK FOR BREAKABLE OBJECTS ===
              const breakDescription = checkBreakable(tileId);
              if (breakDescription) {
                  // Object broke! Social catastrophe!
                  const objectNames: Record<string, string> = {
                      'CULTURAL_ARTIFACT': 'A Priceless Artifact',
                      'SCIENTIFIC_INSTRUMENT': 'A Delicate Instrument',
                      'MACHINERY': 'Industrial Machinery',
                      'DYNAMO': 'An Electrical Generator',
                      'DISPLAY': 'A Display Case',
                      'PHONOGRAPH': 'Edison\'s Phonograph'
                  };
                  setEmbarrassmentModal({
                      objectName: objectNames[tileId] || 'Something Fragile',
                      description: breakDescription
                  });
                  // Apply heavy reputation and composure penalties
                  dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: -15 } });
                  dispatch({ type: 'ADJUST_COMPOSURE', payload: -10 });
                  dispatch({ type: 'ADJUST_STAT', payload: { stat: 'malaise', delta: 15 } });
                  return;
              }

              // === CHECK FOR SPECIAL TILE EVENTS (mini-events with choices) ===
              const tileEvent = getTileEvent(tileId);
              if (tileEvent && Math.random() < tileEvent.eventChance) {
                  // Trigger the tile event modal
                  setTileEventModal(tileEvent);
                  return;
              }

              // === NORMAL INTERACTION (no event, no break) ===
              // Detect cultural theme from zone name for contextual interactions
              const zoneLower = zone.name.toLowerCase();
              let culturalTheme = 'default';
              if (zoneLower.includes('japan')) culturalTheme = 'japanese';
              else if (zoneLower.includes('chin')) culturalTheme = 'chinese';
              else if (zoneLower.includes('persi') || zoneLower.includes('iran')) culturalTheme = 'persian';
              else if (zoneLower.includes('egypt')) culturalTheme = 'egyptian';
              else if (zoneLower.includes('moor') || zoneLower.includes('tunis') || zoneLower.includes('alger')) culturalTheme = 'moorish';
              else if (zoneLower.includes('africa') || zoneLower.includes('senegal') || zoneLower.includes('congo')) culturalTheme = 'african';
              else if (zoneLower.includes('mexic') || zoneLower.includes('aztec')) culturalTheme = 'mesoamerican';
              else if (zoneLower.includes('ital') || zoneLower.includes('rome')) culturalTheme = 'italian';

              // Get random narrative from the pool
              const narrative = getInteractionNarrative(interaction, culturalTheme);

              // Add to narrator log
              dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
                  id: Date.now().toString(),
                  sender: 'DM',
                  text: narrative
              }});

              // Chance for inspiration
              if (Math.random() < interaction.inspirationChance) {
                  dispatch({ type: 'GAIN_INSPIRATION', payload: { amount: 1, source: `${interaction.action}: ${tileId}` } });
              }

              // Interactions take time (10 minutes)
              dispatch({ type: 'ADVANCE_TIME', payload: 10 });

              return;
          }

          // 7. Default: Observe surroundings (replaces PONDER)
          // This is a quick look around - no hold required for basic observation
          const tileChar = zone.mapData[player.y]?.[player.x] || '?';
          const tileDesc = tileChar === '.' ? 'cobblestone pavement' :
                           tileChar === ':' ? 'gravel path' :
                           tileChar === ' ' ? 'open ground' :
                           tileChar === 'p' ? 'paved plaza' :
                           tileChar === 's' ? 'stone walkway' :
                           tileChar === 'f' ? 'flagstone' :
                           tileChar === 'g' ? 'grass' :
                           tileChar === 'v' ? 'vegetation' :
                           `terrain`;

          dispatch({ type: 'ADD_LOG', payload: {
              id: Date.now().toString(),
              type: 'NARRATIVE',
              text: `You pause in ${zone.name}, taking in the ${tileDesc} beneath your feet.`,
              timestamp: Date.now()
          }});

          // Small inspiration gain for observing
          if (Math.random() < 0.3) {
              dispatch({ type: 'GAIN_INSPIRATION', payload: { amount: 1, source: 'A moment of quiet observation' } });
          }
          // Pausing to observe takes a few minutes
          dispatch({ type: 'ADVANCE_TIME', payload: 5 });
          return;
      }

      // WASD = Turn to face direction (no movement)
      if (e.key === 'w') {
          dispatch({ type: 'SET_DIRECTION', payload: 'N' });
          return;
      }
      if (e.key === 's') {
          dispatch({ type: 'SET_DIRECTION', payload: 'S' });
          return;
      }
      if (e.key === 'a') {
          dispatch({ type: 'SET_DIRECTION', payload: 'W' });
          return;
      }
      if (e.key === 'd') {
          dispatch({ type: 'SET_DIRECTION', payload: 'E' });
          return;
      }

      // Arrow keys = Movement (with throttle to prevent input pile-up)
      // Uses held keys for diagonal movement support
      const isArrowKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key);
      if (isArrowKey) {
        const now = Date.now();
        if (now - lastMoveTimeRef.current < MOVE_THROTTLE_MS) {
          return; // Skip this move, too soon after last one
        }
        lastMoveTimeRef.current = now;
      }

      let newX = player.x;
      let newY = player.y;

      // Check all held keys to support diagonal movement
      const held = heldKeysRef.current;
      if (held.has('ArrowUp')) newY--;
      if (held.has('ArrowDown')) newY++;
      if (held.has('ArrowLeft')) newX--;
      if (held.has('ArrowRight')) newX++;

      // Block movement while sitting
      if (player.isSitting && (newX !== player.x || newY !== player.y)) {
          const sittingResponses = [
              `You'll need to stand before you can move from this ${player.sittingOn || 'seat'}. Press SPACE or type 'stand' to get up.`,
              `The pleasant inertia of sitting holds you in place. Stand first—SPACE or type 'stand'.`,
              `You shift slightly, but remain seated. To move, you must first stand. Press SPACE or type 'stand'.`,
              `Your current posture forbids locomotion. Rise first—SPACE key or 'stand' command.`
          ];
          dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
              id: Date.now().toString(),
              sender: 'DM',
              text: sittingResponses[Math.floor(Math.random() * sittingResponses.length)]
          }});
          dispatch({ type: 'TRIGGER_SHAKE' });
          return;
      }

      // Check Bounds (but allow edge tiles for exits)
      if (newY < 0 || newY >= zone.height || newX < 0 || newX >= zone.width) {
          dispatch({ type: 'TRIGGER_SHAKE' });
          return;
      }

      const char = zone.mapData[newY][newX];

      // Define open-air biomes where you can exit on any unblocked border tile
      const openAirBiomes = ['STREET', 'GARDEN', 'ESPLANADE', 'BRIDGE', 'GATE', 'SOUK', 'VILLAGE', 'TROCADERO', 'WATERFALL', 'TOWER_BASE'];
      const isOpenAir = openAirBiomes.includes(zone.biome);

      // Check if at edge
      const isNorthEdge = newY === 0;
      const isSouthEdge = newY === zone.height - 1;
      const isEastEdge = newX === zone.width - 1;
      const isWestEdge = newX === 0;
      const isOnEdge = isNorthEdge || isSouthEdge || isEastEdge || isWestEdge;

      // For open-air biomes: allow exit on ANY walkable edge tile (not just doors)
      // For interior biomes: require door tiles for exits
      if (isOnEdge) {
          const walkableTiles = [' ', '.', ':', '+', 'g', 'v', 'r', 'C', '`', ',', 'o', '═'];
          const isWalkableEdge = walkableTiles.includes(char);
          // All door characters that trigger zone changes (including directional and grand doors)
          const doorChars = ['+', '⋀', '⋁', '⋗', '⋖', '⊓', '⊔', '⊐', '⊏'];
          const isDoor = doorChars.includes(char);

          if (isDoor || (isOpenAir && isWalkableEdge)) {
              let dir: 'N'|'S'|'E'|'W' = 'N';

              if (isNorthEdge) dir = 'N';
              else if (isSouthEdge) dir = 'S';
              else if (isEastEdge) dir = 'E';
              else if (isWestEdge) dir = 'W';

              dispatch({ type: 'CHANGE_ZONE', payload: { targetId: null, direction: dir } });
              return;
          }
      }
      // Check for void tile (V) - danger zone on tower platform
      if (char === 'V') {
          if (zone.biome === 'TOWER_PLATFORM') {
              if (!state.edgeWarningShown) {
                  // First attempt - show warning
                  dispatch({ type: 'TRIGGER_SHAKE' });
                  dispatch({ type: 'SHOW_EDGE_WARNING' });
                  dispatch({ type: 'ADD_LOG', payload: {
                      id: Date.now().toString(),
                      type: 'NARRATIVE',
                      text: 'The edge looms perilously. The wind tugs at your coat. One more step would be fatal.',
                      timestamp: Date.now()
                  }});
                  return;
              } else {
                  // Second attempt - death by falling
                  dispatch({ type: 'PLAYER_FALL' });
                  return;
              }
          }
          // Outside tower platform, void is just impassable
          dispatch({ type: 'TRIGGER_SHAKE' });
          return;
      }

      // Collision handling with material-specific sounds, HP damage, and breakage events
      // R=Railing(brass), P=Pylon(iron), S=Stall(wood), c=Column(marble), D=Display(glass),
      // u=Statue(marble), Y=Brick(stone), M=Machinery(iron), k=Market stall(wood), X=Stage(wood)
      // H=Hedge is now walkable!

      // Map tiles to their material for collision sounds
      const collisionMaterials: Record<string, 'COLLISION_MARBLE' | 'COLLISION_BRASS' | 'COLLISION_WOOD' | 'COLLISION_GLASS' | 'COLLISION_IRON'> = {
          'R': 'COLLISION_BRASS',   // Railing
          'P': 'COLLISION_IRON',    // Pylon
          'S': 'COLLISION_WOOD',    // Stall walls
          'c': 'COLLISION_MARBLE',  // Columns
          'D': 'COLLISION_GLASS',   // Display cases
          'u': 'COLLISION_MARBLE',  // Statues
          'Y': 'COLLISION_MARBLE',  // Brick/Stone walls
          'M': 'COLLISION_IRON',    // Machinery
          'k': 'COLLISION_WOOD',    // Market stalls
          'X': 'COLLISION_WOOD',    // Stage
      };

      // Breakable objects (10% chance to break on collision) - includes machinery
      const breakableObjects = new Set(['D', 'u', 'M']); // Display cases, statues, and machinery

      if (['R', 'P', 'S', 'c', 'D', 'u', 'Y', 'M', 'k', 'X'].includes(char)) {
          dispatch({ type: 'TRIGGER_SHAKE' });

          // Play material-specific collision sound
          const collisionSound = collisionMaterials[char];
          if (collisionSound && !state.audio.muted) {
              playSound(collisionSound);
          }

          // 15% chance to lose 1 HP on collision (Henry James is clumsy)
          if (Math.random() < 0.15) {
              dispatch({ type: 'ADJUST_HEALTH', payload: -1 });
              dispatch({ type: 'ADD_LOG', payload: {
                  id: Date.now().toString(),
                  type: 'NARRATIVE',
                  text: 'You stumble awkwardly, bruising yourself on the obstacle.',
                  timestamp: Date.now()
              }});
          }

          // 10% chance to break sculpture, display case, or machinery - triggers moral dilemma
          if (breakableObjects.has(char) && Math.random() < 0.10) {
              if (!state.audio.muted) playSound('BREAKAGE');

              // Trigger falling animation - object falls away from player
              const fallDirection = (player.direction === 'E' || player.direction === 'S') ? 'right' : 'left';
              setFallingObjects(prev => [...prev, {
                  x: newX,
                  y: newY,
                  tileChar: char,
                  startTime: Date.now(),
                  direction: fallDirection
              }]);

              const isStatue = char === 'u';
              const isMachinery = char === 'M';

              // Dramatic breakage descriptions for the red embarrassment modal
              const breakageDescriptions: Record<string, string[]> = {
                  statue: [
                      "Time crystallizes into a single, terrible instant. Your shoulder grazes the marble figure—surely not hard enough to—and yet the statue tilts, wobbles, and then surrenders to gravity with a crash that seems to silence the entire pavilion. Fragments of what was once a Greek youth scatter across the floor like accusations.",
                      "The statue falls with the slow inevitability of nightmare. Your outstretched hands grasp nothing but air as the marble figure completes its arc and shatters against the floor. The sound echoes off the vaulted ceiling, turning a hundred heads in your direction.",
                      "You feel rather than see the impact—your elbow connecting with cool marble, the sickening wobble, the crescendo of destruction. When you open your eyes, the statue lies in pieces at your feet, its serene expression now distributed across several square meters of exhibition floor."
                  ],
                  display: [
                      "Glass shatters with a sound like winter ice breaking. The display case surrenders its treasures to gravity—porcelain, jade, and gold tumbling in a cascade of catastrophe. You stand frozen amid the glittering wreckage, aware that every eye in the gallery has found you.",
                      "The case tips with almost comic slowness, allowing you ample time to contemplate the disaster before it completes itself. Glass fragments scatter like crystal tears, and the objects within—each one irreplaceable, each one now irreparably harmed—lie amid the debris.",
                      "Your hand catches the edge of the case at precisely the wrong angle. The sound of breaking glass is followed by the softer, more terrible sounds of delicate objects meeting an unforgiving floor. The silence that follows is worse than any outcry."
                  ],
                  machinery: [
                      "Gears grind, something snaps with a sound like a mechanical scream, and the machine convulses before falling into ominous silence. Steam hisses from a ruptured pipe. The engineer's face passes through several colors before settling on a shade of purple that suggests imminent apoplexy.",
                      "The lever yields to your curious touch—and keeps yielding, separating entirely from its housing with a metallic shriek. The machine's rhythm stutters, coughs, and dies, leaving only the smell of hot metal and your own mortification.",
                      "You didn't mean to touch anything vital. You didn't mean to touch anything at all. And yet here you stand as the great engine shudders to a halt, surrounded by workers whose expressions suggest you have committed something worse than murder."
                  ]
              };

              const objectType = isStatue ? 'statue' : (isMachinery ? 'machinery' : 'display');
              const descriptions = breakageDescriptions[objectType];
              const description = descriptions[Math.floor(Math.random() * descriptions.length)];
              const objectName = isStatue ? 'A Classical Sculpture' : (isMachinery ? 'Industrial Machinery' : 'A Museum Display');

              // Show the red embarrassment modal first
              setEmbarrassmentModal({
                  objectName,
                  description,
                  isFatal: false
              });

              // Store the breakage type to trigger the moral dilemma after modal closes
              // We'll use a ref to track this
              pendingBreakageRef.current = { objectType: isStatue ? 'statue' : 'display' };
          }

          return;
      }

      // Hedges are walkable but slow and make rustling sounds
      if (char === 'H') {
          // Play rustling sound when walking through hedge
          if (!state.audio.muted) {
              playSound('HEDGE_RUSTLE');
          }

          // Only log occasionally to avoid spam
          if (Math.random() < 0.3) {
              dispatch({ type: 'ADD_LOG', payload: {
                  id: Date.now().toString(),
                  type: 'NARRATIVE',
                  text: 'You push through the dense hedge, leaves rustling against your coat.',
                  timestamp: Date.now()
              }});
          }

          // Small chance of minor scratch damage from thorns
          if (Math.random() < 0.05) {
              dispatch({ type: 'ADJUST_HEALTH', payload: -1 });
              dispatch({ type: 'ADD_LOG', payload: {
                  id: Date.now().toString(),
                  type: 'NARRATIVE',
                  text: 'A thorn scratches your hand.',
                  timestamp: Date.now()
              }});
          }

          // Allow movement through the hedge
          dispatch({ type: 'MOVE_PLAYER', payload: { x: newX, y: newY } });
          return;
      }

      // Walkable chars - floor tiles, decorative objects you can walk past/through
      // Includes: floor variants (space, dot, colon, backtick, comma, o), path, doors, carriages,
      // exhibits, glass floor, telescope, bench, newspaper, puddle, steam, fountain edge, elevator,
      // carpet, banner, lantern, grass, gravel, flowerbed, plants, tables, donkey, seats, brazier,
      // windows, cushions, water pools, fire pits, drums, shadows, chairs (1=N, 2=S, 3=E, 4=W)
      if ([' ', '.', ':', '`', ',', 'o', '+', 'C', 'E', 'G', '[', ']', 'O', 'b', 'n', 'p', 's', 'f', 'e', 'r', 'B', 'l', 'g', 'v', 'w', 'q', 't', 'd', 'z', 'Z', 'W', 'a', 'U', '!', '░', '═', '1', '2', '3', '4'].includes(char)) {

          // Handle elevator tile - Tower has 3 levels: Base (ground) -> First Floor (57m) -> Platform (115m)
          if (char === 'e') {
              if (zone.biome === 'TOWER_BASE') {
                  // Ground level - can only go up to First Floor
                  dispatch({ type: 'SHOW_ELEVATOR_MODAL', payload: { direction: 'up', fromLevel: 'base' } });
                  return;
              } else if (zone.biome === 'TOWER_FIRST_FLOOR') {
                  // First Floor - can go up to Platform or down to Base
                  dispatch({ type: 'SHOW_ELEVATOR_MODAL', payload: { direction: 'both', fromLevel: 'first' } });
                  return;
              } else if (zone.biome === 'TOWER_PLATFORM') {
                  // Top Platform - can only go down to First Floor
                  dispatch({ type: 'SHOW_ELEVATOR_MODAL', payload: { direction: 'down', fromLevel: 'platform' } });
                  return;
              }
          }

          // Legacy elevator handling
          if (char === 'E' && zone.biome === 'TOWER_LEVEL') {
              dispatch({ type: 'TRIGGER_ELEVATOR' });
              return;
          }

          const npcHere = npcs.find(n => n.location.x === newX && n.location.y === newY && n.location.zoneId === player.currentZoneId);
          if (npcHere) {
              dispatch({ type: 'START_DIALOGUE', payload: npcHere });
              return;
          }

          dispatch({ type: 'MOVE_PLAYER', payload: { x: newX, y: newY } });
          if (currentInteraction.resultText) dispatch({ type: 'INTERACTION_RESET' });
      }
    };

    const handleKeyUp = async (e: KeyboardEvent) => {
        if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

        // Release arrow keys from held set (for diagonal movement)
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          heldKeysRef.current.delete(e.key);
        }

        // Handle Shift release for walking stick swing
        if (e.key === 'Shift' && isChargingSwing) {
            // Stop charging
            if (swingChargeRef.current) {
                clearInterval(swingChargeRef.current);
                swingChargeRef.current = null;
            }

            const power = swingPower;
            setIsChargingSwing(false);

            // Only swing if charged enough
            if (power > 5) {
                setIsSwingingCane(true);

                // Find shakeable objects within 1 tile in the direction facing
                const shakeableChars = new Set(['T', 'H', 'q', 'w', 'B', 'y', 'l', 'L', 'K', '%']); // Trees, hedges, plants, banners, flagpoles, lamps, kiosks
                const dx = player.direction === 'E' ? 1 : player.direction === 'W' ? -1 : 0;
                const dy = player.direction === 'S' ? 1 : player.direction === 'N' ? -1 : 0;

                const newShaking = new Set<string>();

                // Check tiles in a cone in front of the player
                for (let offsetY = -1; offsetY <= 1; offsetY++) {
                    for (let offsetX = -1; offsetX <= 1; offsetX++) {
                        const checkX = player.x + dx + offsetX;
                        const checkY = player.y + dy + offsetY;
                        const tileChar = zone.mapData[checkY]?.[checkX];

                        if (tileChar && shakeableChars.has(tileChar)) {
                            // Only shake if power is high enough or object is close
                            const distance = Math.abs(offsetX) + Math.abs(offsetY);
                            if (power > 30 || distance === 0) {
                                newShaking.add(`${checkX},${checkY}`);
                            }
                        }
                    }
                }

                // Also check the tile directly adjacent
                const directX = player.x + dx;
                const directY = player.y + dy;
                const directChar = zone.mapData[directY]?.[directX];
                if (directChar && shakeableChars.has(directChar)) {
                    newShaking.add(`${directX},${directY}`);
                }

                if (newShaking.size > 0) {
                    setShakingObjects(newShaking);
                    // Clear shaking after animation
                    setTimeout(() => setShakingObjects(new Set()), 500);
                }

                // Check for collectible items within swing range and slide them
                const itemsInRange = state.worldItems.filter(item => {
                    if (item.location.zoneId !== player.currentZoneId) return false;
                    const itemDx = item.location.x - player.x;
                    const itemDy = item.location.y - player.y;
                    // Item must be within 1 tile in the swing direction
                    const inSwingDirection = (dx !== 0 && Math.sign(itemDx) === Math.sign(dx) && Math.abs(itemDx) <= 2 && Math.abs(itemDy) <= 1) ||
                                            (dy !== 0 && Math.sign(itemDy) === Math.sign(dy) && Math.abs(itemDy) <= 2 && Math.abs(itemDx) <= 1);
                    const isAdjacent = Math.abs(itemDx) <= 1 && Math.abs(itemDy) <= 1 && (itemDx !== 0 || itemDy !== 0);
                    return inSwingDirection || isAdjacent;
                });

                // Slide each item in range
                itemsInRange.forEach(item => {
                    // Calculate slide distance based on power (1-10 tiles)
                    // power ranges 0-100: low power = 1-2 tiles, max power = 8-10 tiles
                    const baseDist = 1 + Math.floor(power / 12); // 1-9 based on power
                    const randomBonus = Math.random() > 0.5 ? 1 : 0;
                    const slideDistance = Math.min(10, baseDist + randomBonus);

                    // Slide in the swing direction with slight randomness
                    let slideX = item.location.x + dx * slideDistance;
                    let slideY = item.location.y + dy * slideDistance;

                    // Add slight lateral variance for realism
                    if (dx !== 0 && Math.random() > 0.7) slideY += Math.random() > 0.5 ? 1 : -1;
                    if (dy !== 0 && Math.random() > 0.7) slideX += Math.random() > 0.5 ? 1 : -1;

                    // Check for obstacles along the path and stop at first one
                    const walkableChars = new Set([' ', '.', ':', '`', ',', 'o', 'g', 'v', '═', '░']);
                    let finalX = item.location.x;
                    let finalY = item.location.y;

                    for (let step = 1; step <= slideDistance; step++) {
                        const testX = item.location.x + dx * step + (step === slideDistance && slideX !== item.location.x + dx * slideDistance ? Math.sign(slideX - (item.location.x + dx * step)) : 0);
                        const testY = item.location.y + dy * step + (step === slideDistance && slideY !== item.location.y + dy * slideDistance ? Math.sign(slideY - (item.location.y + dy * step)) : 0);

                        // Simpler path check - just follow swing direction
                        const checkX = item.location.x + dx * step;
                        const checkY = item.location.y + dy * step;

                        if (checkX < 0 || checkX >= zone.width || checkY < 0 || checkY >= zone.height) break;

                        const tileChar = zone.mapData[checkY]?.[checkX];
                        if (!tileChar || !walkableChars.has(tileChar)) break;

                        // Check for NPCs blocking
                        const npcBlocking = npcs.some(n =>
                            n.location.x === checkX && n.location.y === checkY && n.location.zoneId === player.currentZoneId
                        );
                        if (npcBlocking) break;

                        finalX = checkX;
                        finalY = checkY;
                    }

                    // Only slide if we can move at least 1 tile
                    if (finalX !== item.location.x || finalY !== item.location.y) {
                        // Calculate duration based on distance (physics: longer distance = longer time, but decelerating)
                        const actualDist = Math.sqrt(Math.pow(finalX - item.location.x, 2) + Math.pow(finalY - item.location.y, 2));
                        const duration = 200 + actualDist * 120; // Base 200ms + 120ms per tile

                        // Add to sliding items for animation
                        setSlidingItems(prev => [...prev, {
                            itemId: item.id,
                            startX: item.location.x,
                            startY: item.location.y,
                            endX: finalX,
                            endY: finalY,
                            startTime: Date.now(),
                            duration
                        }]);

                        // Update the actual item position after animation completes
                        setTimeout(() => {
                            dispatch({ type: 'SLIDE_ITEM', payload: { itemId: item.id, newX: finalX, newY: finalY } });
                            setSlidingItems(prev => prev.filter(s => s.itemId !== item.id));
                        }, duration);

                        // Play a sliding sound
                        if (!state.audio.muted) playSound('BLIP');
                    }
                });

                // Check for breakable objects within 1 tile (display cases, machines, sculptures)
                // 50% chance to knock them over if hit
                const breakableChars: { [key: string]: string } = {
                    'D': 'Display Case',
                    '┬': 'Small Display Case',
                    'u': 'Statue',
                    'Ü': 'Asian Statue',
                    'ü': 'Asian Figure',
                    'Ö': 'Egyptian Statue',
                    'ö': 'Egyptian Bust',
                    'Ä': 'African Statue',
                    'ä': 'African Mask',
                    'ß': 'Mesoamerican Statue',
                    'æ': 'Classical Bust',
                    'œ': 'Allegorical Statue',
                    'Œ': 'Monumental Statue',
                    'M': 'Steam Engine',
                    'ð': 'Centrifuge',
                    '♦': 'Fountain Sculpture',
                };

                // Check tiles in front of player for breakables
                let brokeObject = false;
                breakableLoop:
                for (let offsetY = -1; offsetY <= 1; offsetY++) {
                    for (let offsetX = -1; offsetX <= 1; offsetX++) {
                        const checkX = player.x + dx + offsetX;
                        const checkY = player.y + dy + offsetY;
                        const tileChar = zone.mapData[checkY]?.[checkX];

                        if (tileChar && breakableChars[tileChar]) {
                            // Distance affects chance - closer = higher chance
                            const distance = Math.abs(offsetX) + Math.abs(offsetY);
                            // Base 50% chance, modified by power and distance
                            const breakChance = (0.3 + (power / 200)) * (distance === 0 ? 1 : 0.5);

                            if (Math.random() < breakChance) {
                                const objectName = breakableChars[tileChar];
                                const isStatue = ['u', 'Ü', 'ü', 'Ö', 'ö', 'Ä', 'ä', 'ß', 'æ', 'œ', 'Œ', '♦'].includes(tileChar);
                                const isMachine = ['M', 'ð'].includes(tileChar);

                                // Trigger falling animation - object falls in swing direction
                                const swingFallDir = (player.direction === 'E' || player.direction === 'S') ? 'right' : 'left';
                                setFallingObjects(prev => [...prev, {
                                    x: checkX,
                                    y: checkY,
                                    tileChar: tileChar,
                                    startTime: Date.now(),
                                    direction: swingFallDir
                                }]);

                                // Play breakage sound
                                if (!state.audio.muted) playSound('BREAKAGE');

                                const descriptions = isStatue ? [
                                    `Your walking stick connects with the ${objectName} in a moment of horrifying clarity. Time seems to slow as the priceless artifact wobbles, teeters, and then—with awful inevitability—crashes to the marble floor, shattering into a thousand irreplaceable fragments.`,
                                    `The ${objectName}, survivor of centuries and continents, meets its ignominious end at the tip of your carelessly wielded cane. The sound of its destruction echoes through the gallery like an accusation.`,
                                    `With a sickening crack, the ${objectName} topples from its pedestal. You watch, frozen in horror, as artwork that has endured millennia is reduced to rubble in an instant of American clumsiness.`
                                ] : isMachine ? [
                                    `Your cane catches the ${objectName}'s delicate mechanism. Gears grind, steam hisses, and something vital within the machine gives way with a catastrophic clang. The exposition's prized industrial marvel shudders and falls silent.`,
                                    `The ${objectName}, marvel of modern engineering, proves no match for your errant walking stick. A cascade of sparks, a grinding of metal, and the proud machine lists dramatically to one side, clearly beyond repair.`
                                ] : [
                                    `Glass explodes outward as your walking stick crashes through the ${objectName}. The precious artifacts within scatter across the floor in a chaos of destruction that draws gasps from nearby visitors.`,
                                    `The ${objectName} shatters spectacularly under the force of your swing. Shards of glass and displaced treasures create a scene of devastation that will surely be remembered—and attributed to you.`
                                ];

                                // Trigger the disaster/embarrassment modal
                                setEmbarrassmentModal({
                                    objectName,
                                    description: descriptions[Math.floor(Math.random() * descriptions.length)],
                                    isFatal: false
                                });

                                // Severe reputation and composure hit
                                dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: -15 } });
                                dispatch({ type: 'ADJUST_COMPOSURE', payload: -20 });
                                dispatch({ type: 'ADJUST_STAT', payload: { stat: 'malaise', delta: 10 } });

                                brokeObject = true;
                                // Only break one thing per swing
                                break breakableLoop;
                            }
                        }
                    }
                }

                // Check for NPCs within 1 tile - they might get upset!
                if (!brokeObject) {
                    const nearbyNPCs = npcs.filter(npc => {
                        if (npc.location.zoneId !== player.currentZoneId) return false;
                        const npcDx = npc.location.x - player.x;
                        const npcDy = npc.location.y - player.y;
                        // Check if NPC is within 1 tile in the swing direction
                        const inSwingRange = Math.abs(npcDx) <= 1 && Math.abs(npcDy) <= 1;
                        // Favor NPCs in the direction we're facing
                        const inFacingDirection = (dx !== 0 && Math.sign(npcDx) === Math.sign(dx)) ||
                                                 (dy !== 0 && Math.sign(npcDy) === Math.sign(dy));
                        return inSwingRange && (inFacingDirection || (Math.abs(npcDx) + Math.abs(npcDy) === 1));
                    });

                    if (nearbyNPCs.length > 0) {
                        // Pick the closest NPC
                        const targetNPC = nearbyNPCs[0];

                        // Reaction type based on NPC personality and randomness
                        const reactionTypes: Array<'angry' | 'frightened' | 'indignant' | 'shocked'> = ['angry', 'frightened', 'indignant', 'shocked'];
                        const reactionType = reactionTypes[Math.floor(Math.random() * reactionTypes.length)];

                        // Generate procedural dialogue based on reaction type and NPC
                        const angryDialogues = [
                            [`Monsieur! What is the meaning of this outrage?`, `I shall summon the guards if you do not desist immediately!`],
                            [`How DARE you brandish that stick in my direction!`, `I have half a mind to report you to the authorities!`],
                            [`Imbécile! You nearly struck me!`, `Is this how Americans conduct themselves in civilized society?`],
                            [`Unhand that cane this instant, you ruffian!`, `I shall not be menaced by some... some literary tourist!`],
                            [`This is an outrage! An absolute outrage!`, `The Exposition Committee shall hear of this!`],
                        ];

                        const frightenedDialogues = [
                            [`Oh! Oh my word!`, `Please, sir, I beg you—I am merely a visitor!`],
                            [`*stumbles backward* Mon Dieu!`, `What have I done to warrant such violence?`],
                            [`*gasps and clutches pearls* Heavens!`, `Is nowhere safe in this modern age?`],
                            [`*covers face* Please, no! I have children!`, `I meant no offense, truly!`],
                            [`*trips over own feet retreating*`, `Stay back! Help! Someone help!`],
                        ];

                        const indignantDialogues = [
                            [`Well! I have never been so affronted in all my days.`, `One expects better from visitors to the Exposition.`],
                            [`*sniffs haughtily* How perfectly vulgar.`, `I shall inform my acquaintances of your barbarous conduct.`],
                            [`*raises eyebrow* Is that quite necessary, sir?`, `Some of us are attempting to enjoy the marvels of modern civilization.`],
                            [`I see the rumors about American manners are not exaggerated.`, `Kindly take your... enthusiasm... elsewhere.`],
                            [`*adjusts pince-nez disapprovingly*`, `One does not simply wave weaponry about in polite company.`],
                        ];

                        const shockedDialogues = [
                            [`*frozen in place, eyes wide*`, `I... I cannot believe what I am witnessing.`],
                            [`*drops fan in astonishment*`, `Did... did that man just attempt to strike me?`],
                            [`*mouth agape*`, `In all my years at the Exposition... nothing like this...`],
                            [`*clutches companion's arm*`, `Quick, fetch a gendarme! There's a madman loose!`],
                            [`*blinks repeatedly*`, `Surely I must be hallucinating from the heat...`],
                        ];

                        const dialoguePool = reactionType === 'angry' ? angryDialogues :
                                            reactionType === 'frightened' ? frightenedDialogues :
                                            reactionType === 'indignant' ? indignantDialogues : shockedDialogues;

                        const selectedDialogue = dialoguePool[Math.floor(Math.random() * dialoguePool.length)];

                        // Description varies by reaction
                        const descriptions = {
                            angry: [
                                `Your walking stick whistles perilously close to ${targetNPC.name}, who recoils with a mixture of fury and disbelief.`,
                                `The arc of your cane nearly grazes ${targetNPC.name}, provoking an immediate and vociferous response.`,
                                `${targetNPC.name} narrowly avoids your swinging stick and turns on you with righteous indignation.`
                            ],
                            frightened: [
                                `${targetNPC.name} lets out a startled cry as your walking stick sweeps past, stumbling backward in alarm.`,
                                `Your unexpected gesture sends ${targetNPC.name} into a paroxysm of fright, their face draining of color.`,
                                `The sudden motion of your cane causes ${targetNPC.name} to recoil in genuine terror.`
                            ],
                            indignant: [
                                `${targetNPC.name} observes your display with the cold disapproval of one who has seen quite enough barbarism for one afternoon.`,
                                `Your flourish earns a withering look from ${targetNPC.name}, whose contempt needs no verbal expression.`,
                                `${targetNPC.name} draws back with aristocratic disdain, clearly marking you as beneath further attention.`
                            ],
                            shocked: [
                                `${targetNPC.name} freezes mid-step, apparently unable to process the scene unfolding before them.`,
                                `Your walking stick's trajectory leaves ${targetNPC.name} in a state of speechless astonishment.`,
                                `The color rises in ${targetNPC.name}'s cheeks as the shock of your behavior renders them temporarily mute.`
                            ]
                        };

                        const description = descriptions[reactionType][Math.floor(Math.random() * descriptions[reactionType].length)];

                        // Trigger the embarrassment modal with NPC reaction
                        setEmbarrassmentModal({
                            objectName: `Incident with ${targetNPC.name}`,
                            description,
                            isFatal: false,
                            npcReaction: {
                                name: targetNPC.name,
                                archetype: targetNPC.portraitArchetype,
                                dialogueLines: selectedDialogue,
                                reactionType
                            }
                        });

                        // Reputation hit (varies by reaction type)
                        const reputationHit = reactionType === 'angry' ? -12 :
                                             reactionType === 'frightened' ? -8 :
                                             reactionType === 'indignant' ? -10 : -6;
                        dispatch({ type: 'ADJUST_STAT', payload: { stat: 'reputation', delta: reputationHit } });
                        dispatch({ type: 'ADJUST_COMPOSURE', payload: -10 });
                        dispatch({ type: 'ADJUST_STAT', payload: { stat: 'malaise', delta: 5 } });
                    }
                }

                // Add narrative based on power level
                const narratives = power > 66
                    ? [
                        "With considerable vigor, you sweep your walking stick through the air in a mighty arc!",
                        "The cane whistles through the air with surprising force!",
                        "You execute a full swing worthy of a seasoned duelist!"
                      ]
                    : power > 33
                    ? [
                        "You brandish your walking stick in a respectable arc.",
                        "A measured swing of the cane cuts through the air.",
                        "Your stick describes a warning arc through the Parisian air."
                      ]
                    : [
                        "You give your walking stick a quick flick.",
                        "A swift flourish of the cane.",
                        "You swing your stick with casual grace."
                      ];

                dispatch({ type: 'ADD_NARRATOR_MSG', payload: {
                    id: Date.now().toString(),
                    sender: 'DM',
                    text: narratives[Math.floor(Math.random() * narratives.length)]
                }});

                // Reset swing state after animation
                setTimeout(() => {
                    setIsSwingingCane(false);
                    setSwingPower(0);
                }, 350);
            } else {
                setSwingPower(0);
            }

            return;
        }

        // Use ref to get current interaction state (avoids stale closure)
        const currentInteraction = interactionRef.current;

        if (!currentInteraction.active) return;

        // Only spacebar releases interactions now
        if (e.key !== ' ') return;

        const p = currentInteraction.progress;
        let text = "";

        if (p > GAME_CONSTANTS.GOLD_ZONE_MIN && p < GAME_CONSTANTS.GOLD_ZONE_MAX) {
             const targetData = getInteractionTarget(player.x, player.y);

             if (currentInteraction.type === 'USE_DEVICE') {
                 const t = targetData.target as any;
                 if (t?.id === 'CABLE') {
                    const msg = await generateTelegram();
                    dispatch({ type: 'INTERACTION_RESOLVE', payload: "Connecting..." });
                    const timeout = setTimeout(() => {
                        dispatch({ type: 'START_MINIGAME', payload: { type: GameState.MINIGAME_TELEGRAPH, message: msg } });
                    }, 500);
                    timeoutRefs.current.push(timeout);
                 } else if (t?.id === 'LOOM') {
                     dispatch({ type: 'INTERACTION_RESOLVE', payload: "Inspecting Exhibits..." });
                     const timeout = setTimeout(() => {
                        dispatch({ type: 'START_MINIGAME', payload: { type: GameState.MINIGAME_CURATOR } });
                     }, 500);
                     timeoutRefs.current.push(timeout);
                 } else if (t?.id === 'GALA') {
                     dispatch({ type: 'INTERACTION_RESOLVE', payload: "Entering the gala..." });
                     const timeout = setTimeout(() => {
                        dispatch({ type: 'START_MINIGAME', payload: { type: GameState.MINIGAME_FLANEUR } });
                     }, 500);
                     timeoutRefs.current.push(timeout);
                 }
                 return;
             } else if (currentInteraction.type === 'SCRUTINIZE') {
                 const target = targetData.target as any;
                 const objectId = target?.id || '';
                 const objectName = target?.name || 'the object';
                 const biome = zone?.biome as BiomeType | undefined;
                 const malaise = state.player.stats.malaise || 0;

                 // Use local templates for common objects, LLM for special/unknown ones
                 if (hasLocalTemplate(objectId)) {
                     text = generateLocalScrutiny(objectId, objectName, biome, malaise);
                 } else {
                     // Fall back to LLM for unknown objects
                     text = await generateScrutiny(objectName);
                 }

                 dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'NARRATIVE', text: `Scrutiny: "${text}"`, timestamp: Date.now() } });
                 setInsightModal({ text, type: `Scrutiny: ${objectName}` });

                 // Grant inspiration for successful scrutiny
                 dispatch({ type: 'GAIN_INSPIRATION', payload: { amount: 5, source: `Examined ${objectName}` } });

                 if (target && LANDMARKS[target.id]) {
                     const land = LANDMARKS[target.id];
                     dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), type: 'VISION', text: `A vision of ${land.name} forms in your mind...`, timestamp: Date.now() } });
                     const imgUrl = await generateImpressionistImage(land.prompt);
                     if (imgUrl) {
                         dispatch({ type: 'ADD_GALLERY_IMAGE', payload: { id: Date.now().toString(), base64: imgUrl, prompt: land.name, location: zone.name, timestamp: Date.now() } });
                         // Extra inspiration for capturing an image
                         dispatch({ type: 'GAIN_INSPIRATION', payload: { amount: 10, source: `Captured vision of ${land.name}` } });
                     }
                 }
             }
        } else {
             text = "You fail to focus.";
             dispatch({ type: 'TRIGGER_SHAKE' });
        }

        dispatch({ type: 'INTERACTION_RESOLVE', payload: text });
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        // Clear all pending timeouts
        timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
        timeoutRefs.current = [];
    };
  // Note: We use refs for interaction state to avoid stale closures, so we don't need interaction in deps
  }, [player.x, player.y, player.currentZoneId, state.gameState, state.edgeWarningShown, player.isSitting, isSwingingCane, isChargingSwing, swingPower]);

  // Update label based on proximity
  useEffect(() => {
      const target = getInteractionTarget(player.x, player.y);
      if (target.type === 'PICKUP_ITEM') {
          setNearbyLabel(`Press SPACE to pick up ${(target.target as any).name}`);
      } else if (target.type === 'EAVESDROP') {
          setNearbyLabel(`Press SPACE to talk to ${(target.target as any).name} | Hold 'T' to eavesdrop`);
      } else if (target.type === 'SCRUTINIZE') {
          setNearbyLabel(`Press SPACE to observe | Hold 'T' to scrutinize ${(target.target as any).name}`);
      } else if (target.type === 'USE_DEVICE') {
          setNearbyLabel(`Press SPACE to observe | Hold 'T' to use ${(target.target as any).name}`);
      } else if (target.type === 'ENTER') {
          setNearbyLabel(`Press SPACE to Enter ${(target.target as any).name}`);
      } else if (target.type === 'MOUNT_STAGE') {
          setNearbyLabel(`Press SPACE to ascend to the Stage`);
      } else if (target.type === 'DISMOUNT_STAGE') {
          setNearbyLabel(`(On Stage) Press SPACE to descend`);
      } else if (target.type === 'TILE_INTERACT') {
          const { interaction, tileId } = target.target as { interaction: TileInteraction, tileId: string };
          // Show different label when sitting vs standing
          if (interaction.action === 'Sit' && player.isSitting) {
              setNearbyLabel(`(Seated) Press SPACE or type 'stand' to get up`);
          } else if (tileId === 'KIOSK') {
              setNearbyLabel(`Press SPACE to browse the kiosk`);
          } else {
              setNearbyLabel(`Press SPACE to ${interaction.action}`);
          }
      } else {
          setNearbyLabel("Press SPACE to observe | Hold 'T' to Ponder");
      }
  }, [player.x, player.y, player.isSitting, isOnStage]);

  // Check if player is standing on a collectible item
  useEffect(() => {
    const itemHere = state.worldItems?.find(item =>
      item.location?.x === player.x &&
      item.location?.y === player.y &&
      item.location?.zoneId === player.currentZoneId
    );
    setCollectibleOnTile(itemHere || null);
  }, [player.x, player.y, player.currentZoneId, state.worldItems]);

  // Check if player is on or adjacent to seating (chair, bench, stool)
  useEffect(() => {
    if (player.isSitting) {
      setNearbySeating(null);
      return;
    }

    // Seating tile characters and their names
    const seatingTiles: Record<string, string> = {
      '1': 'chair',
      '2': 'chair',
      '3': 'chair',
      '4': 'chair',
      'b': 'iron bench',
      '≡': 'park bench',
      'Z': 'cushion',
    };

    // Check player's tile and adjacent tiles
    const tilesToCheck = [
      { x: player.x, y: player.y },
      { x: player.x - 1, y: player.y },
      { x: player.x + 1, y: player.y },
      { x: player.x, y: player.y - 1 },
      { x: player.x, y: player.y + 1 },
    ];

    for (const pos of tilesToCheck) {
      const char = zone.mapData[pos.y]?.[pos.x];
      if (char && seatingTiles[char]) {
        setNearbySeating(seatingTiles[char]);
        return;
      }
    }

    setNearbySeating(null);
  }, [player.x, player.y, player.isSitting, zone.mapData]);

  const getEntityAt = (x: number, y: number) => {
      const npc = npcs.find(n => n.location.x === x && n.location.y === y && n.location.zoneId === zone.id);
      return npc;
  };

  // Drag handlers for map panning
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start drag with left mouse button
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragStartOffset({ x: dragOffset.x, y: dragOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    // Add delta to the starting offset to accumulate panning
    setDragOffset({
      x: dragStartOffset.x + deltaX,
      y: dragStartOffset.y + deltaY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setDragStartOffset({ x: dragOffset.x, y: dragOffset.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;
    setDragOffset({
      x: dragStartOffset.x + deltaX,
      y: dragStartOffset.y + deltaY
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Global mouseup listener to handle drag ending outside container
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(false);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchend', handleGlobalMouseUp);
      return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp);
        window.removeEventListener('touchend', handleGlobalMouseUp);
      };
    }
  }, [isDragging]);

  // CAMERA LOGIC - Smart camera with dead zone
  // Camera follows cameraPos state, not player directly
  // Player can move freely within dead zone without camera moving
  // dragOffset allows manual panning, zoom scales the whole thing

  const containerRef = useRef<HTMLDivElement>(null);

  // Camera target: highlighted NPC overrides, otherwise use smart camera position
  const targetEntity = highlightedEntityId
      ? npcs.find(n => n.id === highlightedEntityId)
      : null;
  const cameraX = targetEntity ? targetEntity.location.x : cameraPos.x;
  const cameraY = targetEntity ? targetEntity.location.y : cameraPos.y;

  // Calculate where to position the map so the camera target is centered
  // Use fixed pixel units for clean scaling
  const cameraPxX = (cameraX + 0.5) * TILE_SIZE_PX;
  const cameraPxY = (cameraY + 0.5) * TILE_SIZE_PX;

  // SMOOTH ZOOM: The key is to separate position from zoom.
  // We translate in unscaled coordinates, then scale from the camera position.
  // This way, zoom changes don't cause position jumps.
  //
  // The translate puts camera target at origin (0,0), then scale happens from origin.
  // Drag offset is converted from screen to map coordinates by dividing by zoom.
  const translateX = -cameraPxX + dragOffset.x / zoom;
  const translateY = -cameraPxY + dragOffset.y / zoom;

  // Handle mouse wheel zoom - smooth smaller increments
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.06 : 0.06;
    setZoom(z => Math.max(0.7, Math.min(3.5, z + delta)));
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute inset-0 flex flex-col items-center justify-center relative rounded overflow-hidden"
      onWheel={handleWheel}
      style={{
        // Elegant dark slate background with subtle pattern
        backgroundColor: '#1e2228',
        backgroundImage: `
          radial-gradient(ellipse at center, rgba(45,50,60,0.4) 0%, transparent 70%),
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 8px,
            rgba(30,35,42,0.3) 8px,
            rgba(30,35,42,0.3) 9px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 8px,
            rgba(25,30,38,0.2) 8px,
            rgba(25,30,38,0.2) 9px
          )
        `,
        // Force GPU layer to prevent Safari flickering during map animations
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Terrain Info Panel - Bottom Left (compact) */}
      {hoverTerrain && (
        <div className="absolute bottom-5 left-4 z-30 bg-ink-900/85 border-l-2 border-gold-500 px-3 py-1 rounded-r shadow-xl max-w-[220px] animate-fade-in pointer-events-none">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xs text-gold-400 font-bold uppercase">{hoverTerrain.name}</span>
            <span className="text-[10px] font-mono text-gold-600/70 uppercase">{hoverTerrain.type}</span>
          </div>
          <p className="text-[14px] text-paper-200/80 font-serif leading-snug line-clamp-2">{hoverTerrain.description}</p>
        </div>
      )}

      {/* CAMERA CONTROLS - Left side */}
      <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
          <button onClick={() => setZoom(z => Math.min(z + 0.12, 3.5))} className="p-1 bg-paper-100 border border-gold-500 rounded shadow hover:bg-gold-200" title="Zoom in"><LucideZoomIn size={16} className="text-ink-900"/></button>
          <button onClick={() => setZoom(z => Math.max(z - 0.12, 0.9))} className="p-1 bg-paper-100 border border-gold-500 rounded shadow hover:bg-gold-200" title="Zoom out"><LucideZoomOut size={16} className="text-ink-900"/></button>
          <button onClick={() => { setDragOffset({ x: 0, y: 0 }); setCameraPos({ x: player.x, y: player.y }); dispatch({ type: 'HIGHLIGHT_ENTITY', payload: null }); }} className="p-1 bg-paper-100 border border-gold-500 rounded shadow hover:bg-gold-200" title="Re-center on player"><LucideCrosshair size={16} className={dragOffset.x !== 0 || dragOffset.y !== 0 || Math.abs(cameraPos.x - player.x) > 2 || Math.abs(cameraPos.y - player.y) > 2 ? "text-red-500" : "text-ink-900"}/></button>
      </div>

      {/* NAVIGATION BUTTONS - Upper right - Fast travel to key locations */}
      <div className="absolute top-2 right-2 z-20 flex gap-1">
          <button
            onClick={() => dispatch({ type: 'TELEPORT_TO_COORDS', payload: { x: 0, y: 3 } })}
            onMouseEnter={() => setHoverTerrain({
              name: 'Galerie des Machines',
              type: 'FAST TRAVEL',
              description: 'The vast iron-and-glass hall housing the marvels of modern industry—steam engines, dynamos, and the wonders of the mechanical age.'
            })}
            onMouseLeave={() => setHoverTerrain(null)}
            className="flex items-center gap-1 px-2 py-1 bg-gradient-to-b from-amber-900/70 to-amber-950/95 hover:from-amber-800/95 hover:to-amber-900/95 text-amber-200 rounded text-[16px] font-medium transition-all duration-200 border border-amber-600/60 hover:border-amber-500/80 shadow-lg hover:shadow-amber-900/30 hover:scale-105"
          >
            <LucideCog size={14} className="text-amber-400" />
            <span>Galerie</span>
          </button>
          <button
            onClick={() => dispatch({ type: 'TELEPORT_TO_COORDS', payload: { x: -1, y: 5 } })}
            onMouseEnter={() => setHoverTerrain({
              name: 'Psychology Congress',
              type: 'FAST TRAVEL',
              description: 'The International Congress of Physiological Psychology—where Charcot, Janet, and James debate the mysteries of the human mind.'
            })}
            onMouseLeave={() => setHoverTerrain(null)}
            className="flex items-center gap-1 px-2 py-1 bg-gradient-to-b from-violet-900/90 to-violet-950/95 hover:from-violet-800/95 hover:to-violet-900/95 text-violet-200 rounded text-[16px] font-medium transition-all duration-200 border border-violet-600/60 hover:border-violet-500/80 shadow-lg hover:shadow-violet-900/30 hover:scale-105"
          >
            <LucideBrain size={12} className="text-violet-400" />
            <span>Congress</span>
          </button>
          <button
            onClick={() => dispatch({ type: 'TELEPORT_TO_COORDS', payload: { x: 0, y: 0 } })}
            onMouseEnter={() => setHoverTerrain({
              name: 'Eiffel Tower',
              type: 'FAST TRAVEL',
              description: 'Gustave Eiffel\'s iron colossus—324 meters of latticed steel rising above the Champ de Mars, the very symbol of the Exposition.'
            })}
            onMouseLeave={() => setHoverTerrain(null)}
            className="flex items-center gap-1 px-2 py-1 bg-gradient-to-b from-sky-900/90 to-sky-950/95 hover:from-sky-800/95 hover:to-sky-900/95 text-sky-200 rounded text-[16px] font-medium transition-all duration-200 border border-sky-600/60 hover:border-sky-500/80 shadow-lg hover:shadow-sky-900/30 hover:scale-105"
          >
            <LucideTowerControl size={12} className="text-sky-400" />
            <span>Tower</span>
          </button>
      </div>
      
      {/* Shared SVG Definitions for all map tiles - water colors adapt to time of day */}
      <svg className="absolute w-0 h-0">
          <MapDefs
            waterBase={timeColors.waterBase}
            waterHighlight={timeColors.waterHighlight}
            waterDepth={timeColors.waterDepth}
          />
      </svg>

      {/* MOVABLE MAP CONTAINER - drag to pan */}
      <div
        ref={dragContainerRef}
        className="absolute inset-0 overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none', touchAction: 'none' }}
      >
          {/* Map container - positioned so player is always at viewport center */}
          <div
            className="absolute"
            style={{
              // Position at viewport center (50%, 50%), then apply transform
              left: '50%',
              top: '50%',
              // Scale first, then translate (in scaled space)
              // This keeps the player centered during zoom changes
              // Use translate3d to force GPU compositing and prevent subpixel rendering gaps
              transform: `scale(${zoom}) translate3d(${translateX}px, ${translateY}px, 0)`,
              // Origin at top-left so our translate math works correctly
              transformOrigin: '0 0',
              // Remove transition to prevent compositor flicker during rapid updates
              // The 0.04s transition was causing Chrome to create intermediate paint frames
              width: `${zone.width * TILE_SIZE_PX}px`,
              height: `${zone.height * TILE_SIZE_PX}px`,
              overflow: 'visible',
              // Keep on GPU layer
              willChange: 'transform',
              // Note: removed 'paint' from contain as it clips tall walls extending outside grid
              contain: 'layout style',
            }}
          >
            {/* Neutral background behind tiles - prevents dark lines from showing through gaps */}
            <div style={{
                position: 'absolute',
                inset: '-1px', // Slightly larger to cover any edge gaps
                backgroundColor: '#4a5256', // Muted color that blends with most tiles
                borderRadius: '2px',
                // GPU layer to prevent Safari flicker when parent transforms
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
            }} />
            {/* CSS Grid layout for tiles - memoized for performance */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${zone.width}, ${TILE_SIZE_PX}px)`,
                    gridTemplateRows: `repeat(${zone.height}, ${TILE_SIZE_PX}px)`,
                    gap: 0,
                    overflow: 'visible',
                    // COMMENTED OUT: These properties create a stacking context which breaks
                    // z-index interaction between tiles and player/NPC sprites rendered outside this grid.
                    // The parent container already has transform and willChange for GPU compositing.
                    // If Safari flickering occurs, we may need an alternative solution.
                    // ---
                    // backfaceVisibility: 'hidden',
                    // transform: 'translate3d(0, 0, 0)',
                    // WebkitTransformStyle: 'preserve-3d',
                    // perspective: 1000,
                }}
                onMouseMove={(e) => {
                    // Event delegation: calculate tile position from mouse coordinates
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE_PX);
                    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE_PX);
                    if (x >= 0 && x < zone.width && y >= 0 && y < zone.height) {
                        const char = zone.mapData[y]?.[x];
                        if (char) {
                            const entity = getEntityAt(x, y);
                            if (entity) {
                                setHoverTerrain({ name: entity.name, type: 'NPC', description: entity.profession || 'A visitor to the Fair.' });
                            } else {
                                setHoverTerrain(getTerrainDescription(char, x, y, zone.name));
                            }
                        }
                    }
                }}
                onMouseLeave={() => setHoverTerrain(null)}
            >
                {/* Memoized tile grid - only re-renders when zone changes */}
                {tileGrid}
            </div>

            {/* Mask layer to hide original tiles that are currently falling */}
            {fallingObjects.map((obj) => (
                <div
                    key={`mask-${obj.x}-${obj.y}-${obj.startTime}`}
                    className="absolute pointer-events-none"
                    style={{
                        left: `${obj.x * TILE_SIZE_PX}px`,
                        top: `${obj.y * TILE_SIZE_PX}px`,
                        width: TILE_SIZE_PX,
                        height: TILE_SIZE_PX,
                        backgroundColor: '#4a5256', // Match the neutral background
                        zIndex: obj.y + 100, // Above tiles but below falling animation
                    }}
                />
            ))}

            {/* Falling objects layer - animated breakage effects */}
            {fallingObjects.map((obj, idx) => (
                <div
                    key={`falling-${obj.x}-${obj.y}-${obj.startTime}`}
                    className="absolute pointer-events-none"
                    style={{
                        left: `${obj.x * TILE_SIZE_PX}px`,
                        top: `${obj.y * TILE_SIZE_PX}px`,
                        width: TILE_SIZE_PX,
                        height: TILE_SIZE_PX,
                    }}
                >
                    <FallingObjectAnimation
                        x={obj.x}
                        y={obj.y}
                        tileChar={obj.tileChar}
                        startTime={obj.startTime}
                        direction={obj.direction}
                        themeColor={zone.themeColor}
                        biome={zone.biome}
                        zoneName={zone.name}
                        onComplete={() => {
                            setFallingObjects(prev => prev.filter((_, i) => i !== idx));
                        }}
                    />
                </div>
            ))}

            {/* Fog overlay layer - renders on top of tiles, updates with player position */}
            {fogOpacities && fogOpacities.size > 0 && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${zone.width}, ${TILE_SIZE_PX}px)`,
                        gridTemplateRows: `repeat(${zone.height}, ${TILE_SIZE_PX}px)`,
                        gap: 0,
                    }}
                >
                    {splitMapData.flatMap((chars, y) =>
                        chars.map((char, x) => {
                            const opacity = fogOpacities.get(`${x}-${y}`);
                            const isMultiTile = MULTI_TILE_CHARS.has(char);
                            if (!opacity || isMultiTile) {
                                return <div key={`fog-${x}-${y}`} />;
                            }
                            return (
                                <div
                                    key={`fog-${x}-${y}`}
                                    style={{
                                        backgroundColor: isNighttime ? 'rgba(8, 12, 20, 0.95)' : 'rgba(15, 18, 25, 0.9)',
                                        opacity,
                                    }}
                                />
                            );
                        })
                    )}
                </div>
            )}

                {/* World Items Layer - Smaller icons with hover info and sliding animation */}
                {zoneItems.map(item => {
                    const svgGraphic = getItemGraphic(item.name);
                    const slidingData = slidingItems.find(s => s.itemId === item.id);

                    // Calculate animated position if sliding
                    let displayX = item.location.x;
                    let displayY = item.location.y;
                    let rotation = 0;
                    let scale = 1;

                    if (slidingData) {
                        const elapsed = Date.now() - slidingData.startTime;
                        const progress = Math.min(elapsed / slidingData.duration, 1);

                        // Easing function: ease-out cubic for deceleration (like friction)
                        const easeOutCubic = 1 - Math.pow(1 - progress, 3);

                        // Interpolate position
                        displayX = slidingData.startX + (slidingData.endX - slidingData.startX) * easeOutCubic;
                        displayY = slidingData.startY + (slidingData.endY - slidingData.startY) * easeOutCubic;

                        // Add slight rotation during slide (tumbling effect)
                        const tumbleAmount = Math.sin(progress * Math.PI * 3) * (1 - progress) * 15;
                        rotation = tumbleAmount;

                        // Slight bounce/squash at end
                        if (progress > 0.8) {
                            const bounceProgress = (progress - 0.8) / 0.2;
                            scale = 1 + Math.sin(bounceProgress * Math.PI) * 0.1;
                        }
                    }

                    return (
                        <div
                            key={item.id}
                            className="absolute z-4 flex items-center justify-center cursor-pointer"
                            style={{
                                left: `${displayX * TILE_SIZE_PX}px`,
                                top: `${displayY * TILE_SIZE_PX}px`,
                                width: `${TILE_SIZE_PX}px`,
                                height: `${TILE_SIZE_PX}px`,
                                transform: `rotate(${rotation}deg) scale(${scale})`,
                                transition: slidingData ? 'none' : 'transform 0.1s ease-out',
                            }}
                            onMouseEnter={() => setHoverTerrain({
                                name: item.name,
                                type: item.type,
                                description: item.description || 'A collectible item.'
                            })}
                            onMouseLeave={() => setHoverTerrain(null)}
                        >
                            {svgGraphic ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" className="drop-shadow-md">
                                    {svgGraphic}
                                </svg>
                            ) : (
                                <div className="text-sm drop-shadow-md">
                                    {getItemEmoji(item)}
                                </div>
                            )}
                            {/* Sliding dust trail effect */}
                            {slidingData && (
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background: `radial-gradient(ellipse at center, rgba(180, 160, 140, ${0.3 * (1 - (Date.now() - slidingData.startTime) / slidingData.duration)}) 0%, transparent 70%)`,
                                        transform: 'scale(1.5)',
                                    }}
                                />
                            )}
                        </div>
                    );
                })}

                {/* Entity Layer */}
                {zoneNpcs.map(npc => {
                    // Use memoized proximity calculations
                    const proximity = npcProximityMap.get(npc.id) || { isNearby: false, isAdjacent: false };
                    const { isNearby, isAdjacent } = proximity;

                    return (
                        <div
                            key={npc.id}
                            className={`absolute transition-all duration-1000 ease-linear cursor-pointer hover:brightness-110 flex items-end justify-center ${highlightedEntityId === npc.id ? 'animate-bounce' : ''}`}
                            style={{
                                left: `${npc.location.x * TILE_SIZE_PX}px`,
                                top: `${(npc.location.y - 0.5) * TILE_SIZE_PX}px`,
                                width: `${TILE_SIZE_PX}px`,
                                height: `${TILE_SIZE_PX * 1.5}px`,
                                // Y-based z-index: y*10+201 so NPCs render in front of multi-tile objects at same Y
                                // Multi-tile objects use y*10+200, so NPC at Y=5 (z=251) is in front of object at Y=5 (z=250)
                                // but behind object at Y=6 (z=260)
                                zIndex: highlightedEntityId === npc.id ? 1000 : npc.location.y * 10 + 201,
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                dispatch({ type: 'SHOW_NPC_MODAL', payload: npc });
                            }}
                        >
                            {/* Proximity glow ring */}
                            {isNearby && !highlightedEntityId && (
                                <div className={`absolute bottom-0 left-[-4px] right-[-4px] h-[${TILE_SIZE_PX}px] rounded-full ${
                                    isAdjacent
                                        ? 'bg-gold-400/40 animate-pulse ring-2 ring-gold-500/60'
                                        : 'bg-gold-300/20 ring-1 ring-gold-400/30'
                                }`} style={{ height: `${TILE_SIZE_PX}px` }} />
                            )}
                            <NpcSprite
                                npc={npc}
                                isMoving={npc.lastMoveTime ? (Date.now() - npc.lastMoveTime < 800) : false}
                            />
                            {highlightedEntityId === npc.id && <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-red-500 font-bold text-[10px]">▼</div>}
                            {/* Historical figure indicator - golden star with tooltip */}
                            {npc.isHistoricalFigure && !isAdjacent && !highlightedEntityId && (
                                <div className="absolute -top-1 -right-1 group cursor-help z-10">
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 drop-shadow-lg animate-pulse" style={{ animationDuration: '3s' }}>
                                            <defs>
                                                <linearGradient id={`star-grad-${npc.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#ffd700" />
                                                    <stop offset="50%" stopColor="#ffec8b" />
                                                    <stop offset="100%" stopColor="#daa520" />
                                                </linearGradient>
                                            </defs>
                                            <path
                                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                                fill={`url(#star-grad-${npc.id})`}
                                                stroke="#8b6914"
                                                strokeWidth="0.5"
                                            />
                                        </svg>
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full right-0 mb-1 hidden group-hover:block pointer-events-none z-50">
                                        <div className="bg-ink-900/95 border border-gold-600/60 rounded px-2 py-1 shadow-lg whitespace-nowrap">
                                            <div className="text-gold-400 text-[9px] font-semibold tracking-wide uppercase">Historical Figure</div>
                                            <div className="text-parchment-100 text-[8px] mt-0.5">{npc.name}</div>
                                        </div>
                                        <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-ink-900/95" />
                                    </div>
                                </div>
                            )}
                            {/* "Talk" indicator when adjacent */}
                            {isAdjacent && !highlightedEntityId && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-ink-900/90 text-gold-400 text-[8px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap animate-bounce">
                                    SPACE
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Player Layer */}
                <div
                    className="absolute flex items-end justify-center"
                    style={{
                        left: `${player.x * TILE_SIZE_PX}px`,
                        top: `${(player.y - 0.5) * TILE_SIZE_PX}px`,
                        width: `${TILE_SIZE_PX}px`,
                        height: `${TILE_SIZE_PX * 1.5}px`,
                        // Y-based z-index: y*10+201 so player renders in front of multi-tile objects at same Y
                        // Multi-tile objects use y*10+200, so player at Y=5 (z=251) is in front of object at Y=5 (z=250)
                        // but behind object at Y=6 (z=260)
                        zIndex: player.y * 10 + 201,
                        // Smooth movement - transition slightly longer than throttle to overlap and eliminate gaps
                        transition: 'left 85ms ease-out, top 85ms ease-out',
                    }}
                >
                    <PlayerSprite
                        direction={player.direction}
                        x={player.x}
                        y={player.y}
                        isSitting={player.isSitting}
                        isSwinging={isSwingingCane}
                        swingPower={swingPower}
                        isCharging={isChargingSwing}
                        pinceNez={player.equippedClothing.pinceNez}
                        clothing={{
                            hat: player.equippedClothing.hat ? 'top_hat' : 'none',
                            coat: player.equippedClothing.coat ? 'morning_coat' : 'none',
                            vest: player.equippedClothing.vest ? 'standard' : 'none',
                            accessories: [
                                ...(player.equippedClothing.watch ? ['watch_chain' as const] : []),
                                ...(player.equippedClothing.cane ? ['cane' as const] : []),
                            ]
                        }}
                    />
                </div>

                {/* Charge meter when holding Shift */}
                {isChargingSwing && (
                    <div
                        className="absolute z-20 flex flex-col items-center pointer-events-none"
                        style={{
                            left: `${player.x * TILE_SIZE_PX}px`,
                            top: `${(player.y - 1.5) * TILE_SIZE_PX}px`,
                            width: `${TILE_SIZE_PX}px`
                        }}
                    >
                        <div
                            className="text-xs font-bold uppercase tracking-wider mb-0.5"
                            style={{
                                color: swingPower > 66 ? '#FFD700' : swingPower > 33 ? '#FFA500' : '#87CEEB',
                                textShadow: '0 0 4px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1)'
                            }}
                        >
                            {swingPower > 66 ? 'MAX!' : swingPower > 33 ? 'READY' : ''}
                        </div>
                        <div className="w-8 h-1.5 bg-ink-900/80 rounded-full overflow-hidden border border-gold-600/50">
                            <div
                                className="h-full transition-all duration-75"
                                style={{
                                    width: `${swingPower}%`,
                                    background: swingPower > 66
                                        ? 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)'
                                        : swingPower > 33
                                            ? 'linear-gradient(90deg, #FFA500, #FF8C00)'
                                            : 'linear-gradient(90deg, #87CEEB, #4682B4)',
                                    boxShadow: swingPower > 66 ? '0 0 6px #FFD700' : undefined
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Fog of War - smooth radial gradient centered on player (daytime outdoor only) */}
                {!usePerTileFog && (
                    <div
                        className="absolute pointer-events-none z-[2]"
                        style={{
                            left: `${(player.x + 0.5) * TILE_SIZE_PX}px`,
                            top: `${(player.y + 0.5) * TILE_SIZE_PX}px`,
                            width: '2000px',
                            height: '2000px',
                            transform: 'translate(-50%, -50%)',
                            background: `
                                radial-gradient(
                                    ellipse 50% 50% at 50% 50%,
                                    transparent 0%,
                                    transparent 20%,
                                    rgba(18, 22, 28, 0.04) 35%,
                                    rgba(16, 20, 26, 0.12) 50%,
                                    rgba(14, 18, 24, 0.25) 65%,
                                    rgba(12, 16, 22, 0.4) 80%,
                                    rgba(10, 14, 20, 0.6) 100%
                                )
                            `,
                            transition: 'left 0.15s ease-out, top 0.15s ease-out',
                        }}
                    />
                )}

          </div>
      </div>

      {/* Vignette Overlay - creates darkened edges */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background: `radial-gradient(ellipse 75% 75% at 50% 50%, transparent 35%, rgba(20,22,28,0.35) 65%, rgba(12,14,18,0.65) 85%, rgba(8,10,14,0.8) 100%)`,
        // Force GPU layer to prevent Safari flickering
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }} />

      {/* Art Nouveau Frame - decorative border around the map */}
      <div className="absolute inset-0 pointer-events-none z-11">
        {/* Top border with floral motifs */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-ink-900 via-ink-800 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-4 flex items-center justify-center">
          <svg viewBox="0 0 192 16" className="w-full h-full" preserveAspectRatio="none">
            {/* Central medallion */}
            <circle cx="96" cy="8" r="6" fill="none" stroke="#B8860B" strokeWidth="1"/>
            <circle cx="96" cy="8" r="4" fill="#1A1A2E"/>
            {/* Flowing curves left */}
            <path d="M90 8 Q70 4, 50 8 Q30 12, 10 8" fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.7"/>
            <path d="M90 8 Q70 12, 50 8 Q30 4, 10 8" fill="none" stroke="#B8860B" strokeWidth="0.5" opacity="0.5"/>
            {/* Flowing curves right */}
            <path d="M102 8 Q122 4, 142 8 Q162 12, 182 8" fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.7"/>
            <path d="M102 8 Q122 12, 142 8 Q162 4, 182 8" fill="none" stroke="#B8860B" strokeWidth="0.5" opacity="0.5"/>
            {/* Small decorative dots */}
            <circle cx="50" cy="8" r="2" fill="#B8860B" opacity="0.6"/>
            <circle cx="142" cy="8" r="2" fill="#B8860B" opacity="0.6"/>
          </svg>
        </div>

        {/* Bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-ink-900 via-ink-800 to-transparent" />

        {/* Left border with vertical flourish */}
        <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-ink-900 via-ink-800 to-transparent" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-32">
          <svg viewBox="0 0 12 128" className="w-full h-full" preserveAspectRatio="none">
            <path d="M6 0 Q2 32, 6 64 Q10 96, 6 128" fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.6"/>
            <circle cx="6" cy="64" r="3" fill="none" stroke="#B8860B" strokeWidth="0.5"/>
          </svg>
        </div>

        {/* Right border with vertical flourish */}
        <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-l from-ink-900 via-ink-800 to-transparent" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-32">
          <svg viewBox="0 0 12 128" className="w-full h-full" preserveAspectRatio="none">
            <path d="M6 0 Q10 32, 6 64 Q2 96, 6 128" fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.6"/>
            <circle cx="6" cy="64" r="3" fill="none" stroke="#B8860B" strokeWidth="0.5"/>
          </svg>
        </div>

        {/* Corner ornaments */}
        {/* Top-left corner */}
        <svg viewBox="0 0 24 24" className="absolute top-0 left-0 w-6 h-6">
          <path d="M0 12 Q0 0, 12 0" fill="none" stroke="#B8860B" strokeWidth="2"/>
          <circle cx="8" cy="8" r="2" fill="#B8860B" opacity="0.5"/>
        </svg>
        {/* Top-right corner */}
        <svg viewBox="0 0 24 24" className="absolute top-0 right-0 w-6 h-6">
          <path d="M24 12 Q24 0, 12 0" fill="none" stroke="#B8860B" strokeWidth="2"/>
          <circle cx="16" cy="8" r="2" fill="#B8860B" opacity="0.5"/>
        </svg>
        {/* Bottom-left corner */}
        <svg viewBox="0 0 24 24" className="absolute bottom-0 left-0 w-6 h-6">
          <path d="M0 12 Q0 24, 12 24" fill="none" stroke="#B8860B" strokeWidth="2"/>
          <circle cx="8" cy="16" r="2" fill="#B8860B" opacity="0.5"/>
        </svg>
        {/* Bottom-right corner */}
        <svg viewBox="0 0 24 24" className="absolute bottom-0 right-0 w-6 h-6">
          <path d="M24 12 Q24 24, 12 24" fill="none" stroke="#B8860B" strokeWidth="2"/>
          <circle cx="16" cy="16" r="2" fill="#B8860B" opacity="0.5"/>
        </svg>
      </div>

      {/* Interaction UI - Positioned within game container, not inside transformed map */}
      {interaction.active && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-72 bg-paper-100 border-2 border-gold-600 rounded-lg p-4 shadow-2xl z-[60] flex flex-col items-center gap-2 animate-fade-in">
          <span className="text-base font-display uppercase font-bold tracking-wider text-ink-900">
            {interaction.type === 'PONDER' ? '🧠 Pondering...' : interaction.type}
          </span>
          <p className="text-sm text-ink-600 text-center">Hold T, release in the gold zone!</p>
          <div className="w-full h-6 bg-gray-300 rounded-full overflow-hidden relative border-2 border-ink-400">
            {/* Gold zone indicator (60-90%) */}
            <div className="absolute left-[60%] w-[30%] h-full bg-gold-400/60 z-0 border-x-2 border-gold-600"></div>
            {/* Progress bar */}
            <div
              className={`h-full transition-all duration-75 ease-linear relative z-10 ${
                interaction.progress > 90 ? 'bg-red-500' :
                interaction.progress > 60 ? 'bg-green-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${interaction.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between w-full text-xs font-mono text-ink-500">
            <span>0%</span>
            <span className="text-gold-600 font-bold">GOLD ZONE</span>
            <span>100%</span>
          </div>
        </div>
      )}
      {interaction.resultText && !interaction.active && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-ink-900 text-gold-400 text-base px-6 py-3 rounded-lg shadow-2xl z-[60] animate-fade-in max-w-md text-center">
          {interaction.resultText}
        </div>
      )}


      {/* Insight Modal */}
      {insightModal && (
        <div className="fixed inset-0 bg-ink-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setInsightModal(null)}>
          <div
            className="bg-paper-100 dark:bg-gray-900 border-2 border-gold-600 rounded-lg shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gold-600/20 border-b border-gold-600/30 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-600/30 flex items-center justify-center">
                  {insightModal.type === 'Reflection' ? (
                    <LucideFeather className="text-gold-700" size={20} />
                  ) : (
                    <LucideEye className="text-gold-700" size={20} />
                  )}
                </div>
                <div>
                  <h3 className="font-display text-xl text-ink-900 dark:text-paper-100">{insightModal.type}</h3>
                  <p className="text-sm text-ink-500 dark:text-gray-400 font-serif italic">{zone.name}</p>
                </div>
              </div>
              <button
                onClick={() => setInsightModal(null)}
                className="p-2 hover:bg-ink-900/10 rounded-full transition-colors"
              >
                <LucideX size={20} className="text-ink-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="relative">
                <span className="absolute -top-2 -left-2 text-6xl text-gold-400/30 font-serif">"</span>
                <p className="font-serif text-lg text-ink-800 dark:text-paper-100 leading-relaxed pl-6 pr-4 italic">
                  {insightModal.text}
                </p>
                <span className="absolute -bottom-4 right-0 text-6xl text-gold-400/30 font-serif">"</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gold-600/20 flex justify-end">
              <button
                onClick={() => setInsightModal(null)}
                className="px-6 py-2 bg-gold-600 hover:bg-gold-700 text-white rounded font-display text-sm transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tile Event Modal (mini-events from objects) */}
      {tileEventModal && (
        <TileEventModal
          event={tileEventModal}
          onClose={() => setTileEventModal(null)}
        />
      )}

      {/* Embarrassment Modal (breaking objects / fatal events) */}
      {embarrassmentModal && (
        <EmbarrassmentModal
          objectName={embarrassmentModal.objectName}
          description={embarrassmentModal.description}
          isFatal={embarrassmentModal.isFatal}
          npcReaction={embarrassmentModal.npcReaction}
          onClose={() => {
            if (embarrassmentModal.isFatal) {
              // Trigger game over from electrocution
              dispatch({ type: 'PLAYER_ELECTROCUTED' });
            } else if (pendingBreakageRef.current) {
              // Trigger the moral dilemma event after the embarrassment screen
              dispatch({ type: 'TRIGGER_BREAKAGE_EVENT', payload: pendingBreakageRef.current });
              pendingBreakageRef.current = null;
            }
            setEmbarrassmentModal(null);
          }}
        />
      )}

      {/* Confirmation Action Modal (yes/no prompts for flagpole, fountain, etc.) */}
      {confirmAction && (
        <ConfirmActionModal action={confirmAction} />
      )}

      {/* NPC Modal (clicking on NPCs) */}
      {state.showNpcModal && state.selectedNpc && (
        <NpcModal
          npc={state.selectedNpc}
          onClose={() => dispatch({ type: 'CLOSE_NPC_MODAL' })}
          onTalk={() => {
            dispatch({ type: 'CLOSE_NPC_MODAL' });
            dispatch({ type: 'START_DIALOGUE', payload: state.selectedNpc! });
          }}
        />
      )}

      {/* Collectible Item Toast - appears when standing on an item */}
      {collectibleOnTile && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 animate-toast-enter pointer-events-none">
          <div className="relative bg-gradient-to-r from-ink-900/95 via-ink-800/95 to-ink-900/95 border border-gold-500/60 rounded-lg px-5 py-3 shadow-2xl animate-toast-pulse backdrop-blur-sm">
            {/* Decorative corner flourishes */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-gold-400 rounded-tl" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-gold-400 rounded-tr" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-gold-400 rounded-bl" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-gold-400 rounded-br" />

            <div className="flex items-center gap-3">
              {/* Item icon with glow */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gold-400/30 rounded-full blur-md" />
                <span className="relative text-2xl filter drop-shadow-lg">
                  {getItemEmoji(collectibleOnTile)}
                </span>
              </div>

              {/* Text content */}
              <div className="flex flex-col">
                <span className="text-paper-200 text-sm font-serif italic">
                  You notice <span className="text-gold-300 font-semibold not-italic">{collectibleOnTile.name}</span> here.
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-paper-400 text-xs">Press</span>
                  <span className="inline-flex items-center justify-center px-2 py-0.5 bg-gold-600/30 border border-gold-500/50 rounded text-gold-200 text-xs font-mono font-bold tracking-wider animate-key-bounce">
                    SPACE
                  </span>
                  <span className="text-paper-400 text-xs">to collect</span>
                </div>
              </div>
            </div>

            {/* Subtle shine effect */}
            <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/10 to-transparent -translate-x-full animate-shine" style={{ animationDuration: '3s' }} />
            </div>
          </div>
        </div>
      )}

      {/* Seating Toast - appears when near a chair, bench, or stool */}
      {nearbySeating && !collectibleOnTile && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 animate-toast-enter pointer-events-none">
          <div className="relative bg-gradient-to-r from-ink-900/95 via-ink-800/95 to-ink-900/95 border border-amber-600/60 rounded-lg px-5 py-3 shadow-2xl animate-toast-pulse backdrop-blur-sm">
            {/* Decorative corner flourishes */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-amber-500 rounded-tl" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-amber-500 rounded-tr" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-amber-500 rounded-bl" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-amber-500 rounded-br" />

            <div className="flex items-center gap-3">
              {/* Chair icon with glow */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-md" />
                <span className="relative text-2xl filter drop-shadow-lg">🪑</span>
              </div>

              {/* Text content */}
              <div className="flex flex-col">
                <span className="text-paper-200 text-sm font-serif italic">
                  You could sit on this <span className="text-amber-300 font-semibold not-italic">{nearbySeating}</span> if you'd like.
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-paper-400 text-xs">Press</span>
                  <span className="inline-flex items-center justify-center px-2 py-0.5 bg-amber-600/30 border border-amber-500/50 rounded text-amber-200 text-xs font-mono font-bold tracking-wider animate-key-bounce">
                    SPACE
                  </span>
                  <span className="text-paper-400 text-xs">to sit</span>
                </div>
              </div>
            </div>

            {/* Subtle shine effect */}
            <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent -translate-x-full animate-shine" style={{ animationDuration: '3s' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverworldMap;
