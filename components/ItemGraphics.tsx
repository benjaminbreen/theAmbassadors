import React from 'react';

// SVG item icons for inventory items - 24x24 viewBox
// Used when emojis don't capture the 1889 aesthetic properly

export const ITEM_GRAPHICS: Record<string, React.ReactNode> = {
  // Edison Phonograph Cylinder - wax cylinder with grooves
  PHONOGRAPH_CYLINDER: (
    <g>
      {/* Cylinder body */}
      <ellipse cx="12" cy="6" rx="7" ry="2.5" fill="#8B7355"/>
      <rect x="5" y="6" width="14" height="12" fill="#A08060"/>
      <ellipse cx="12" cy="18" rx="7" ry="2.5" fill="#6B5344"/>
      {/* Wax grooves */}
      {[0, 2, 4, 6, 8, 10].map(i => (
        <line key={i} x1="5" y1={7 + i} x2="19" y2={7 + i} stroke="#5D4E3A" strokeWidth="0.3" opacity="0.6"/>
      ))}
      {/* Shine highlight */}
      <ellipse cx="9" cy="12" rx="1.5" ry="5" fill="#C4A77D" opacity="0.3"/>
      {/* Label band */}
      <rect x="5" y="10" width="14" height="3" fill="#2D1F12" opacity="0.4"/>
    </g>
  ),

  // Malacca Walking Stick with lion head
  WALKING_STICK: (
    <g>
      {/* Handle - lion head in silver */}
      <ellipse cx="8" cy="5" rx="4" ry="3" fill="#C0C0C0"/>
      <circle cx="7" cy="4" r="0.6" fill="#1A1A1A"/> {/* Eye */}
      <path d="M5 6 Q8 8 11 6" fill="none" stroke="#A0A0A0" strokeWidth="0.5"/> {/* Mane hint */}
      {/* Ferrule connection */}
      <rect x="9" y="6" width="2" height="2" fill="#B8860B"/>
      {/* Malacca shaft - mottled brown */}
      <rect x="10" y="8" width="3" height="14" fill="#8B4513" rx="1"/>
      <rect x="10.5" y="9" width="0.5" height="12" fill="#A0522D" opacity="0.5"/>
      <rect x="11.5" y="10" width="0.8" height="10" fill="#6B3A0F" opacity="0.4"/>
      {/* Ferrule tip */}
      <rect x="10" y="21" width="3" height="2" fill="#C0C0C0" rx="0.5"/>
    </g>
  ),

  // Pressed Rose - dried flower
  PRESSED_ROSE: (
    <g>
      {/* Stem */}
      <path d="M12 22 Q11 16 12 10" fill="none" stroke="#2D5016" strokeWidth="1"/>
      {/* Leaves */}
      <ellipse cx="10" cy="16" rx="2" ry="1" fill="#3D6B22" transform="rotate(-30 10 16)"/>
      <ellipse cx="14" cy="14" rx="2" ry="1" fill="#3D6B22" transform="rotate(30 14 14)"/>
      {/* Rose petals - faded burgundy */}
      <ellipse cx="12" cy="7" rx="4" ry="3" fill="#8B2252" opacity="0.8"/>
      <ellipse cx="10" cy="6" rx="2.5" ry="2" fill="#9B3262" opacity="0.7"/>
      <ellipse cx="14" cy="6" rx="2.5" ry="2" fill="#7B1242" opacity="0.7"/>
      <ellipse cx="12" cy="5" rx="2" ry="1.5" fill="#AB4272" opacity="0.6"/>
      {/* Dried texture */}
      <circle cx="11" cy="7" r="0.3" fill="#5B1232" opacity="0.5"/>
      <circle cx="13" cy="6" r="0.3" fill="#5B1232" opacity="0.5"/>
    </g>
  ),

  // Opera Glasses - brass binoculars
  OPERA_GLASSES: (
    <g>
      {/* Left barrel */}
      <rect x="3" y="8" width="6" height="10" fill="#B8860B" rx="1"/>
      <ellipse cx="6" cy="8" rx="3" ry="1.5" fill="#DAA520"/>
      <ellipse cx="6" cy="18" rx="3" ry="1.5" fill="#8B6914"/>
      <circle cx="6" cy="8" r="2" fill="#1A1A1A"/> {/* Lens */}
      <circle cx="6" cy="8" r="1.5" fill="#2A3A4A" opacity="0.7"/> {/* Glass */}
      {/* Right barrel */}
      <rect x="15" y="8" width="6" height="10" fill="#B8860B" rx="1"/>
      <ellipse cx="18" cy="8" rx="3" ry="1.5" fill="#DAA520"/>
      <ellipse cx="18" cy="18" rx="3" ry="1.5" fill="#8B6914"/>
      <circle cx="18" cy="8" r="2" fill="#1A1A1A"/>
      <circle cx="18" cy="8" r="1.5" fill="#2A3A4A" opacity="0.7"/>
      {/* Bridge */}
      <rect x="9" y="11" width="6" height="3" fill="#DAA520" rx="0.5"/>
      {/* Mother of pearl inlay */}
      <ellipse cx="6" cy="13" rx="1.5" ry="0.8" fill="#F5F5DC" opacity="0.4"/>
      <ellipse cx="18" cy="13" rx="1.5" ry="0.8" fill="#F5F5DC" opacity="0.4"/>
    </g>
  ),

  // Gold Pocket Watch
  POCKET_WATCH: (
    <g>
      {/* Chain */}
      <path d="M4 4 Q8 6 12 4 Q16 2 20 4" fill="none" stroke="#DAA520" strokeWidth="1"/>
      {/* Watch case */}
      <circle cx="12" cy="14" r="8" fill="#DAA520"/>
      <circle cx="12" cy="14" r="7" fill="#B8860B"/>
      <circle cx="12" cy="14" r="6" fill="#FFFEF0"/> {/* Face */}
      {/* Roman numerals hint */}
      <text x="12" y="10" fontSize="2" fill="#1A1A1A" textAnchor="middle">XII</text>
      <text x="12" y="20" fontSize="2" fill="#1A1A1A" textAnchor="middle">VI</text>
      {/* Hands */}
      <line x1="12" y1="14" x2="12" y2="10" stroke="#1A1A1A" strokeWidth="0.5"/>
      <line x1="12" y1="14" x2="15" y2="14" stroke="#1A1A1A" strokeWidth="0.3"/>
      {/* Crown */}
      <rect x="11" y="5" width="2" height="2" fill="#DAA520" rx="0.5"/>
    </g>
  ),

  // Kodak Box Camera
  KODAK_CAMERA: (
    <g>
      {/* Main body */}
      <rect x="4" y="6" width="16" height="14" fill="#1A1A1A" rx="1"/>
      {/* Leather texture */}
      <rect x="5" y="7" width="14" height="12" fill="#2D2D2D"/>
      {/* Lens */}
      <circle cx="12" cy="12" r="4" fill="#3A3A3A"/>
      <circle cx="12" cy="12" r="3" fill="#1A1A1A"/>
      <circle cx="12" cy="12" r="2" fill="#2A3A4A"/>
      <circle cx="11" cy="11" r="0.5" fill="#5A6A7A"/> {/* Reflection */}
      {/* Viewfinder */}
      <rect x="16" y="8" width="3" height="2" fill="#4A4A4A" rx="0.5"/>
      {/* "Kodak" label hint */}
      <rect x="6" y="17" width="8" height="1.5" fill="#8B0000" rx="0.3"/>
    </g>
  ),

  // Miniature Eiffel Tower souvenir
  TOWER_MINIATURE: (
    <g>
      {/* Base */}
      <rect x="8" y="20" width="8" height="2" fill="#4A3728" rx="0.5"/>
      {/* Tower legs */}
      <path d="M10 20 L8 12 L10 12 L11 20" fill="#B8860B"/>
      <path d="M14 20 L16 12 L14 12 L13 20" fill="#B8860B"/>
      {/* First platform */}
      <rect x="7" y="11" width="10" height="1.5" fill="#DAA520"/>
      {/* Middle section */}
      <path d="M9 11 L10 6 L14 6 L15 11" fill="#B8860B"/>
      {/* Second platform */}
      <rect x="9" y="5.5" width="6" height="1" fill="#DAA520"/>
      {/* Top section */}
      <path d="M11 5.5 L12 2 L13 5.5" fill="#B8860B"/>
      {/* Antenna */}
      <line x1="12" y1="2" x2="12" y2="0" stroke="#DAA520" strokeWidth="0.5"/>
      {/* Lattice hint */}
      <line x1="9" y1="15" x2="15" y2="15" stroke="#8B6914" strokeWidth="0.3"/>
      <line x1="10" y1="8" x2="14" y2="8" stroke="#8B6914" strokeWidth="0.3"/>
    </g>
  ),

  // Egyptian Scarab Amulet
  SCARAB: (
    <g>
      {/* Body */}
      <ellipse cx="12" cy="14" rx="6" ry="5" fill="#1E90FF"/>
      <ellipse cx="12" cy="14" rx="5" ry="4" fill="#4169E1"/>
      {/* Wing cases */}
      <path d="M7 12 Q12 10 17 12 L17 16 Q12 18 7 16 Z" fill="#0000CD" opacity="0.7"/>
      <line x1="12" y1="11" x2="12" y2="17" stroke="#000080" strokeWidth="0.5"/>
      {/* Head */}
      <ellipse cx="12" cy="9" rx="3" ry="2" fill="#4169E1"/>
      {/* Legs */}
      <line x1="7" y1="13" x2="4" y2="11" stroke="#1E90FF" strokeWidth="1"/>
      <line x1="17" y1="13" x2="20" y2="11" stroke="#1E90FF" strokeWidth="1"/>
      <line x1="6" y1="15" x2="3" y2="16" stroke="#1E90FF" strokeWidth="1"/>
      <line x1="18" y1="15" x2="21" y2="16" stroke="#1E90FF" strokeWidth="1"/>
      {/* Gold mounting */}
      <ellipse cx="12" cy="14" rx="7" ry="6" fill="none" stroke="#DAA520" strokeWidth="0.5"/>
    </g>
  ),

  // Silver Cigarette Case - Art Nouveau
  CIGARETTE_CASE: (
    <g>
      {/* Case body */}
      <rect x="4" y="6" width="16" height="12" fill="#C0C0C0" rx="1"/>
      <rect x="5" y="7" width="14" height="10" fill="#D3D3D3"/>
      {/* Art Nouveau flourish */}
      <path d="M7 10 Q12 8 17 10 Q12 12 7 10" fill="none" stroke="#A0A0A0" strokeWidth="0.5"/>
      <path d="M7 14 Q12 12 17 14 Q12 16 7 14" fill="none" stroke="#A0A0A0" strokeWidth="0.5"/>
      {/* Clasp */}
      <rect x="11" y="5" width="2" height="2" fill="#E8E8E8" rx="0.5"/>
      {/* Monogram area */}
      <ellipse cx="12" cy="12" rx="3" ry="2" fill="#E8E8E8" opacity="0.5"/>
    </g>
  ),

  // Absinthe Bottle
  ABSINTHE: (
    <g>
      {/* Bottle body */}
      <rect x="8" y="8" width="8" height="12" fill="#228B22" rx="1"/>
      <rect x="9" y="9" width="6" height="10" fill="#32CD32" opacity="0.6"/>
      {/* Neck */}
      <rect x="10" y="4" width="4" height="4" fill="#228B22"/>
      {/* Cork */}
      <rect x="10.5" y="2" width="3" height="2.5" fill="#8B4513" rx="0.5"/>
      {/* Label */}
      <rect x="9" y="12" width="6" height="4" fill="#FFFEF0"/>
      <text x="12" y="15" fontSize="2" fill="#228B22" textAnchor="middle">Fée</text>
      {/* Liquid shimmer */}
      <ellipse cx="11" cy="16" rx="1" ry="2" fill="#90EE90" opacity="0.3"/>
    </g>
  ),

  // Javanese Shadow Puppet
  JAVANESE_PUPPET: (
    <g>
      {/* Control rod */}
      <line x1="12" y1="22" x2="12" y2="14" stroke="#8B4513" strokeWidth="1.5"/>
      {/* Body - intricate cutwork leather */}
      <ellipse cx="12" cy="10" rx="5" ry="6" fill="#8B4513"/>
      {/* Cutwork patterns */}
      <circle cx="12" cy="8" r="1" fill="#1A1A1A"/>
      <circle cx="10" cy="10" r="0.5" fill="#1A1A1A"/>
      <circle cx="14" cy="10" r="0.5" fill="#1A1A1A"/>
      <ellipse cx="12" cy="12" rx="2" ry="1" fill="#1A1A1A"/>
      {/* Head ornament */}
      <path d="M12 4 L10 6 L12 5 L14 6 Z" fill="#DAA520"/>
      {/* Arms */}
      <line x1="7" y1="8" x2="5" y2="12" stroke="#8B4513" strokeWidth="1"/>
      <line x1="17" y1="8" x2="19" y2="12" stroke="#8B4513" strokeWidth="1"/>
      {/* Arm rods */}
      <line x1="5" y1="12" x2="4" y2="20" stroke="#6B4423" strokeWidth="0.5"/>
      <line x1="19" y1="12" x2="20" y2="20" stroke="#6B4423" strokeWidth="0.5"/>
    </g>
  ),

  // Monocle with gold chain
  MONOCLE: (
    <g>
      {/* Chain */}
      <path d="M18 4 Q20 8 18 12 Q16 16 12 16" fill="none" stroke="#DAA520" strokeWidth="0.5"/>
      {/* Frame */}
      <circle cx="10" cy="12" r="6" fill="none" stroke="#DAA520" strokeWidth="1.5"/>
      {/* Lens */}
      <circle cx="10" cy="12" r="5" fill="#E8F4F8" opacity="0.4"/>
      {/* Reflection */}
      <ellipse cx="8" cy="10" rx="2" ry="1" fill="#FFFFFF" opacity="0.5"/>
      {/* Chain attachment */}
      <circle cx="16" cy="12" r="1" fill="#DAA520"/>
    </g>
  ),

  // Fountain Pen - Waterman style
  FOUNTAIN_PEN: (
    <g>
      {/* Barrel */}
      <rect x="4" y="10" width="14" height="4" fill="#1A1A1A" rx="1"/>
      {/* Cap band */}
      <rect x="4" y="10" width="2" height="4" fill="#DAA520"/>
      {/* Nib */}
      <path d="M18 12 L22 12 L20 10 L22 12 L20 14 Z" fill="#DAA520"/>
      {/* Ink visible in barrel */}
      <rect x="7" y="11" width="8" height="2" fill="#000080" opacity="0.3" rx="0.5"/>
      {/* Clip */}
      <rect x="5" y="8" width="1" height="6" fill="#DAA520" rx="0.3"/>
    </g>
  ),

  // Letter/Correspondence
  LETTER: (
    <g>
      {/* Envelope */}
      <rect x="3" y="8" width="18" height="12" fill="#FFFEF0"/>
      <path d="M3 8 L12 14 L21 8" fill="none" stroke="#D4C4A8" strokeWidth="0.5"/>
      {/* Wax seal */}
      <circle cx="12" cy="16" r="2.5" fill="#8B0000"/>
      <text x="12" y="17" fontSize="3" fill="#DAA520" textAnchor="middle">J</text>
      {/* Paper edge showing */}
      <rect x="5" y="6" width="14" height="3" fill="#F5F5DC"/>
      <line x1="6" y1="7" x2="18" y2="7" stroke="#C4B4A4" strokeWidth="0.3"/>
    </g>
  ),

  // Blue Notebook
  NOTEBOOK: (
    <g>
      {/* Cover */}
      <rect x="5" y="4" width="14" height="18" fill="#1E3A5F" rx="0.5"/>
      {/* Pages */}
      <rect x="6" y="5" width="12" height="16" fill="#FFFEF0"/>
      {/* Binding */}
      <rect x="5" y="4" width="1.5" height="18" fill="#0F1F2F"/>
      {/* Page lines */}
      {[0, 2, 4, 6, 8, 10, 12].map(i => (
        <line key={i} x1="8" y1={7 + i} x2="17" y2={7 + i} stroke="#C4C4C4" strokeWidth="0.3"/>
      ))}
      {/* Some writing hint */}
      <path d="M9 9 Q11 8 13 9" fill="none" stroke="#1A1A1A" strokeWidth="0.3"/>
      <path d="M9 11 Q12 10 15 11" fill="none" stroke="#1A1A1A" strokeWidth="0.3"/>
    </g>
  ),

  // Menier Chocolate Bar
  CHOCOLATE: (
    <g>
      {/* Wrapper */}
      <rect x="4" y="8" width="16" height="10" fill="#FFD700"/>
      <rect x="5" y="9" width="14" height="8" fill="#8B4513"/>
      {/* Chocolate squares */}
      {[0, 1, 2].map(row => (
        [0, 1, 2, 3].map(col => (
          <rect key={`${row}-${col}`} x={6 + col * 3} y={10 + row * 2.5} width="2.5" height="2" fill="#5D3A1A" rx="0.2"/>
        ))
      ))}
      {/* "Menier" text area */}
      <rect x="6" y="6" width="12" height="2.5" fill="#FFD700"/>
    </g>
  ),

  // Exposition Medal
  EXPO_MEDAL: (
    <g>
      {/* Ribbon */}
      <rect x="9" y="2" width="6" height="6" fill="#000080"/>
      <rect x="10" y="2" width="1" height="6" fill="#FFD700"/>
      <rect x="13" y="2" width="1" height="6" fill="#FFD700"/>
      {/* Medal */}
      <circle cx="12" cy="14" r="7" fill="#CD7F32"/>
      <circle cx="12" cy="14" r="6" fill="#B87333"/>
      {/* Relief design - tower */}
      <path d="M12 9 L10 13 L14 13 Z" fill="#8B6914" opacity="0.6"/>
      <rect x="11" y="13" width="2" height="4" fill="#8B6914" opacity="0.6"/>
      {/* Text around edge */}
      <circle cx="12" cy="14" r="5.5" fill="none" stroke="#8B6914" strokeWidth="0.3"/>
    </g>
  ),

  // Kid Leather Gloves
  GLOVES: (
    <g>
      {/* Left glove */}
      <path d="M4 20 L4 10 L6 8 L6 6 L8 6 L8 8 L10 8 L10 6 L12 6 L12 20 Z" fill="#D2B48C"/>
      {/* Stitching */}
      <line x1="5" y1="12" x2="5" y2="18" stroke="#8B7355" strokeWidth="0.3" strokeDasharray="1"/>
      <line x1="8" y1="10" x2="8" y2="18" stroke="#8B7355" strokeWidth="0.3" strokeDasharray="1"/>
      {/* Right glove (slightly behind) */}
      <path d="M12 20 L12 11 L14 9 L14 7 L16 7 L16 9 L18 9 L18 7 L20 7 L20 20 Z" fill="#C4A882" opacity="0.8"/>
      {/* Button */}
      <circle cx="6" cy="15" r="0.8" fill="#FFFEF0"/>
    </g>
  ),

  // =========== SOUK BIOME ITEMS ===========

  // Bag of Spices - small linen pouch with colorful spices
  SPICE_BAG: (
    <g>
      {/* Pouch body */}
      <path d="M6 8 Q4 12 6 18 L18 18 Q20 12 18 8 Z" fill="#D2B48C"/>
      {/* Gathered top */}
      <path d="M6 8 Q12 6 18 8" fill="none" stroke="#8B7355" strokeWidth="1"/>
      {/* Tie string */}
      <path d="M11 6 L11 4 Q12 2 13 4 L13 6" fill="none" stroke="#6B4423" strokeWidth="0.8"/>
      {/* Spice colors showing through/on top */}
      <circle cx="9" cy="12" r="2" fill="#FFD700" opacity="0.8"/> {/* Saffron */}
      <circle cx="15" cy="12" r="2" fill="#8B0000" opacity="0.8"/> {/* Red powder */}
      <circle cx="12" cy="14" r="1.5" fill="#D2691E" opacity="0.8"/> {/* Cumin */}
      {/* Texture lines on pouch */}
      <line x1="8" y1="16" x2="16" y2="16" stroke="#A0896A" strokeWidth="0.3"/>
    </g>
  ),

  // Small Brass Lamp - Cairene oil lamp with geometric piercings
  BRASS_LAMP: (
    <g>
      {/* Lamp body */}
      <ellipse cx="12" cy="14" rx="6" ry="4" fill="#B8860B"/>
      <ellipse cx="12" cy="10" rx="5" ry="3" fill="#DAA520"/>
      {/* Pierced patterns - stars */}
      <circle cx="10" cy="12" r="0.8" fill="#FFE4B5"/>
      <circle cx="14" cy="12" r="0.8" fill="#FFE4B5"/>
      <circle cx="12" cy="14" r="0.8" fill="#FFE4B5"/>
      {/* Handle */}
      <path d="M17 10 Q20 8 18 5" fill="none" stroke="#B8860B" strokeWidth="1.5"/>
      {/* Spout */}
      <path d="M7 12 L3 10 L4 9" fill="#DAA520"/>
      {/* Flame */}
      <ellipse cx="3" cy="8" rx="1" ry="2" fill="#FF6600" opacity="0.8"/>
      <ellipse cx="3" cy="7" rx="0.5" ry="1" fill="#FFFF00" opacity="0.9"/>
    </g>
  ),

  // Turkish Coffee packet
  TURKISH_COFFEE: (
    <g>
      {/* Paper packet */}
      <rect x="5" y="6" width="14" height="14" fill="#F5DEB3" rx="1"/>
      <rect x="6" y="7" width="12" height="12" fill="#FFFEF0"/>
      {/* Coffee grounds showing */}
      <ellipse cx="12" cy="15" rx="4" ry="2" fill="#3D2314"/>
      {/* Decorative border */}
      <rect x="6" y="7" width="12" height="3" fill="#8B0000"/>
      {/* Crescent moon symbol */}
      <path d="M12 8.5 Q14 8 14 10 Q12 9.5 12 8.5" fill="#FFD700"/>
      {/* Arabic-style text hint */}
      <path d="M8 13 Q10 12 11 13" fill="none" stroke="#1A1A1A" strokeWidth="0.5"/>
    </g>
  ),

  // Kilim Rug Fragment
  KILIM_FRAGMENT: (
    <g>
      {/* Fabric base */}
      <rect x="3" y="6" width="18" height="14" fill="#8B0000"/>
      {/* Geometric pattern - triangles and diamonds */}
      <path d="M6 10 L9 6 L12 10 L9 14 Z" fill="#FFD700"/>
      <path d="M12 10 L15 6 L18 10 L15 14 Z" fill="#FFD700"/>
      <path d="M3 12 L6 9 L6 15 Z" fill="#1E90FF"/>
      <path d="M18 9 L21 12 L18 15 Z" fill="#1E90FF"/>
      {/* Central diamonds */}
      <rect x="8" y="9" width="2" height="2" fill="#FFFEF0" transform="rotate(45 9 10)"/>
      <rect x="14" y="9" width="2" height="2" fill="#FFFEF0" transform="rotate(45 15 10)"/>
      {/* Fringe edges */}
      <line x1="3" y1="20" x2="5" y2="22" stroke="#8B0000" strokeWidth="0.5"/>
      <line x1="6" y1="20" x2="8" y2="22" stroke="#8B0000" strokeWidth="0.5"/>
      <line x1="9" y1="20" x2="11" y2="22" stroke="#8B0000" strokeWidth="0.5"/>
    </g>
  ),

  // Evil Eye Amulet - blue glass nazar
  EVIL_EYE: (
    <g>
      {/* Outer circle */}
      <circle cx="12" cy="12" r="8" fill="#1E90FF"/>
      {/* White ring */}
      <circle cx="12" cy="12" r="6" fill="#FFFFFF"/>
      {/* Light blue ring */}
      <circle cx="12" cy="12" r="4.5" fill="#87CEEB"/>
      {/* Dark blue center */}
      <circle cx="12" cy="12" r="3" fill="#000080"/>
      {/* Pupil */}
      <circle cx="12" cy="12" r="1.5" fill="#1A1A1A"/>
      {/* Reflection */}
      <circle cx="10.5" cy="10.5" r="1" fill="#FFFFFF" opacity="0.7"/>
      {/* String hole */}
      <circle cx="12" cy="3" r="1" fill="#1E90FF"/>
      <circle cx="12" cy="3" r="0.5" fill="#87CEEB"/>
    </g>
  ),

  // Ivory Hookah Mouthpiece
  HOOKAH_MOUTHPIECE: (
    <g>
      {/* Mouthpiece body */}
      <rect x="8" y="4" width="8" height="4" fill="#FFFEF0" rx="2"/>
      {/* Stem */}
      <rect x="10" y="8" width="4" height="12" fill="#F5F5DC"/>
      {/* Arabesque carvings */}
      <path d="M10 10 Q12 9 14 10" fill="none" stroke="#D2B48C" strokeWidth="0.5"/>
      <path d="M10 13 Q12 12 14 13" fill="none" stroke="#D2B48C" strokeWidth="0.5"/>
      <path d="M10 16 Q12 15 14 16" fill="none" stroke="#D2B48C" strokeWidth="0.5"/>
      {/* Gold band */}
      <rect x="9" y="7" width="6" height="1.5" fill="#DAA520"/>
      {/* End tip */}
      <ellipse cx="12" cy="20" rx="2.5" ry="1" fill="#DAA520"/>
    </g>
  ),

  // Henna Powder
  HENNA_POWDER: (
    <g>
      {/* Small bowl/container */}
      <ellipse cx="12" cy="16" rx="7" ry="3" fill="#8B4513"/>
      <ellipse cx="12" cy="14" rx="6" ry="2.5" fill="#A0522D"/>
      {/* Henna powder mound */}
      <ellipse cx="12" cy="12" rx="5" ry="3" fill="#228B22"/>
      <ellipse cx="12" cy="11" rx="4" ry="2" fill="#2E8B2E"/>
      {/* Powder texture */}
      <circle cx="10" cy="11" r="0.5" fill="#1C6B1C"/>
      <circle cx="14" cy="12" r="0.5" fill="#1C6B1C"/>
      <circle cx="12" cy="10" r="0.4" fill="#3CB371"/>
      {/* Decorative painted hand hint */}
      <path d="M3 8 L5 6 M5 6 L6 8 M5 6 L5 4" fill="none" stroke="#228B22" strokeWidth="0.5" opacity="0.6"/>
    </g>
  ),

  // Engraved Copper Tray
  COPPER_TRAY: (
    <g>
      {/* Tray base - viewed at angle */}
      <ellipse cx="12" cy="14" rx="9" ry="4" fill="#B87333"/>
      <ellipse cx="12" cy="13" rx="8" ry="3.5" fill="#CD7F32"/>
      {/* Raised rim */}
      <ellipse cx="12" cy="12" rx="7" ry="3" fill="#DEB887" opacity="0.3"/>
      {/* Geometric engravings */}
      <ellipse cx="12" cy="13" rx="5" ry="2" fill="none" stroke="#8B4513" strokeWidth="0.5"/>
      <ellipse cx="12" cy="13" rx="3" ry="1.2" fill="none" stroke="#8B4513" strokeWidth="0.5"/>
      {/* Star pattern in center */}
      <path d="M12 11 L13 13 L12 12.5 L11 13 Z" fill="#8B4513"/>
      <path d="M10 12.5 L12 13 L11 13.5 L12 14 L14 12.5" fill="none" stroke="#8B4513" strokeWidth="0.3"/>
    </g>
  ),

  // Arabic Manuscript Page
  ARABIC_MANUSCRIPT: (
    <g>
      {/* Aged parchment */}
      <rect x="4" y="4" width="16" height="18" fill="#F5DEB3"/>
      <rect x="5" y="5" width="14" height="16" fill="#FFFEF0"/>
      {/* Decorative border */}
      <rect x="5" y="5" width="14" height="16" fill="none" stroke="#DAA520" strokeWidth="0.5"/>
      {/* Arabic calligraphy lines - right to left flow */}
      <path d="M17 8 Q14 7 11 8 Q9 9 7 8" fill="none" stroke="#1A1A1A" strokeWidth="0.6"/>
      <path d="M17 10 Q15 9 12 10 Q10 11 7 10" fill="none" stroke="#1A1A1A" strokeWidth="0.6"/>
      <path d="M17 12 Q13 11 10 12 Q8 13 7 12" fill="none" stroke="#1A1A1A" strokeWidth="0.6"/>
      <path d="M17 14 Q14 13 11 14 Q9 15 7 14" fill="none" stroke="#1A1A1A" strokeWidth="0.6"/>
      {/* Illumination detail */}
      <circle cx="17" cy="6" r="1.5" fill="#DAA520"/>
      <circle cx="17" cy="6" r="1" fill="#8B0000"/>
      {/* Age spots */}
      <circle cx="8" cy="18" r="1" fill="#D2B48C" opacity="0.5"/>
    </g>
  ),

  // Finger Cymbals (Zills)
  FINGER_CYMBALS: (
    <g>
      {/* Left cymbal */}
      <ellipse cx="8" cy="12" rx="5" ry="5" fill="#B8860B"/>
      <ellipse cx="8" cy="12" rx="4" ry="4" fill="#DAA520"/>
      <circle cx="8" cy="12" r="1" fill="#1A1A1A"/> {/* Center hole */}
      {/* Concentric rings */}
      <circle cx="8" cy="12" r="2.5" fill="none" stroke="#CD853F" strokeWidth="0.3"/>
      {/* Right cymbal */}
      <ellipse cx="16" cy="12" rx="5" ry="5" fill="#B8860B"/>
      <ellipse cx="16" cy="12" rx="4" ry="4" fill="#DAA520"/>
      <circle cx="16" cy="12" r="1" fill="#1A1A1A"/>
      <circle cx="16" cy="12" r="2.5" fill="none" stroke="#CD853F" strokeWidth="0.3"/>
      {/* Elastic loops */}
      <ellipse cx="8" cy="12" rx="1.5" ry="3" fill="none" stroke="#8B4513" strokeWidth="0.8"/>
      <ellipse cx="16" cy="12" rx="1.5" ry="3" fill="none" stroke="#8B4513" strokeWidth="0.8"/>
      {/* Shine */}
      <ellipse cx="6" cy="10" rx="1" ry="0.5" fill="#FFFEF0" opacity="0.5"/>
      <ellipse cx="14" cy="10" rx="1" ry="0.5" fill="#FFFEF0" opacity="0.5"/>
    </g>
  ),

  // =========== CAFE BIOME ITEMS ===========

  // Abandoned Love Letter
  LOVE_LETTER: (
    <g>
      {/* Unfolded paper */}
      <rect x="3" y="5" width="18" height="16" fill="#FFFEF0"/>
      <rect x="4" y="6" width="16" height="14" fill="#FFF8DC"/>
      {/* Feminine handwriting - flowing script */}
      <path d="M6 9 Q9 7 12 9 Q14 10 16 9" fill="none" stroke="#4A0080" strokeWidth="0.4"/>
      <path d="M6 11 Q8 10 11 11 Q13 12 18 11" fill="none" stroke="#4A0080" strokeWidth="0.4"/>
      <path d="M6 13 Q10 12 14 13 Q16 14 18 13" fill="none" stroke="#4A0080" strokeWidth="0.4"/>
      <path d="M6 15 Q9 14 12 15" fill="none" stroke="#4A0080" strokeWidth="0.4"/>
      {/* Lipstick kiss mark */}
      <ellipse cx="16" cy="16" rx="2" ry="1.5" fill="#DC143C" opacity="0.6"/>
      {/* Tear stain */}
      <circle cx="8" cy="17" r="1.5" fill="#87CEEB" opacity="0.3"/>
      {/* Perfume hint - small flower */}
      <circle cx="18" cy="7" r="1" fill="#FFB6C1" opacity="0.5"/>
    </g>
  ),

  // Café Receipt
  CAFE_RECEIPT: (
    <g>
      {/* Receipt paper */}
      <rect x="7" y="3" width="10" height="18" fill="#FFFEF0"/>
      {/* Printed header */}
      <rect x="8" y="4" width="8" height="2" fill="#1A1A1A" opacity="0.8"/>
      {/* Printed lines */}
      <line x1="8" y1="8" x2="16" y2="8" stroke="#1A1A1A" strokeWidth="0.4"/>
      <line x1="8" y1="10" x2="14" y2="10" stroke="#1A1A1A" strokeWidth="0.4"/>
      <line x1="8" y1="12" x2="16" y2="12" stroke="#1A1A1A" strokeWidth="0.4"/>
      {/* Numbers */}
      <text x="15" y="9" fontSize="2" fill="#1A1A1A">2</text>
      <text x="15" y="11" fontSize="2" fill="#1A1A1A">1</text>
      {/* Total line */}
      <line x1="8" y1="15" x2="16" y2="15" stroke="#1A1A1A" strokeWidth="0.6"/>
      <text x="14" y="17" fontSize="2.5" fill="#1A1A1A">5F</text>
      {/* Coffee stain */}
      <ellipse cx="10" cy="18" rx="2" ry="1.5" fill="#6F4E37" opacity="0.3"/>
    </g>
  ),

  // Discarded Poem
  DISCARDED_POEM: (
    <g>
      {/* Crumpled paper - irregular edges */}
      <path d="M5 4 L18 5 L19 18 L6 19 Z" fill="#FFFEF0"/>
      <path d="M6 5 L17 6 L18 17 L7 18 Z" fill="#F5F5DC"/>
      {/* Verse lines */}
      <path d="M8 8 Q11 7 14 8" fill="none" stroke="#1A1A1A" strokeWidth="0.4"/>
      <path d="M8 10 Q10 9 12 10" fill="none" stroke="#1A1A1A" strokeWidth="0.4"/>
      <path d="M8 12 Q12 11 16 12" fill="none" stroke="#1A1A1A" strokeWidth="0.4"/>
      <path d="M8 14 Q11 13 13 14" fill="none" stroke="#1A1A1A" strokeWidth="0.4"/>
      {/* Crossed out words */}
      <line x1="10" y1="10" x2="12" y2="10" stroke="#1A1A1A" strokeWidth="0.6"/>
      <line x1="13" y1="12" x2="16" y2="12" stroke="#1A1A1A" strokeWidth="0.6"/>
      {/* Crumple creases */}
      <line x1="5" y1="10" x2="12" y2="12" stroke="#D3D3D3" strokeWidth="0.3"/>
      <line x1="15" y1="6" x2="10" y2="16" stroke="#D3D3D3" strokeWidth="0.3"/>
    </g>
  ),

  // Sugar Cube
  SUGAR_CUBE: (
    <g>
      {/* Cube shape - 3D perspective */}
      <rect x="8" y="10" width="8" height="8" fill="#FFFEF0"/>
      <path d="M8 10 L10 8 L18 8 L16 10 Z" fill="#FFFFFF"/>
      <path d="M16 10 L18 8 L18 16 L16 18 Z" fill="#F5F5DC"/>
      {/* Sugar texture - tiny dots */}
      <circle cx="10" cy="12" r="0.3" fill="#F0F0F0"/>
      <circle cx="12" cy="14" r="0.3" fill="#F0F0F0"/>
      <circle cx="14" cy="12" r="0.3" fill="#F0F0F0"/>
      <circle cx="11" cy="16" r="0.3" fill="#F0F0F0"/>
      <circle cx="13" cy="15" r="0.3" fill="#F0F0F0"/>
      {/* Slight sparkle */}
      <circle cx="11" cy="9" r="0.5" fill="#FFFFFF"/>
    </g>
  ),

  // Café Matchbook
  MATCHBOOK: (
    <g>
      {/* Cover */}
      <rect x="6" y="6" width="12" height="14" fill="#8B0000" rx="1"/>
      {/* Striking strip */}
      <rect x="6" y="18" width="12" height="2" fill="#2F2F2F"/>
      {/* Café name area */}
      <rect x="7" y="8" width="10" height="6" fill="#DAA520"/>
      {/* Text hint */}
      <text x="12" y="12" fontSize="2" fill="#8B0000" textAnchor="middle">Paix</text>
      {/* Match heads visible */}
      <rect x="8" y="14" width="1" height="3" fill="#DEB887"/>
      <circle cx="8.5" cy="14" r="0.8" fill="#FF4500"/>
      <rect x="11" y="14" width="1" height="3" fill="#DEB887"/>
      <circle cx="11.5" cy="14" r="0.8" fill="#FF4500"/>
      <rect x="14" y="14" width="1" height="3" fill="#DEB887"/>
      <circle cx="14.5" cy="14" r="0.8" fill="#FF4500"/>
    </g>
  ),

  // Stranger's Calling Card
  CALLING_CARD: (
    <g>
      {/* Card */}
      <rect x="3" y="8" width="18" height="10" fill="#FFFEF0" rx="0.5"/>
      <rect x="4" y="9" width="16" height="8" fill="#FFF8DC"/>
      {/* Embossed border */}
      <rect x="5" y="10" width="14" height="6" fill="none" stroke="#D4C4A8" strokeWidth="0.3"/>
      {/* Name text */}
      <text x="12" y="13" fontSize="2" fill="#1A1A1A" textAnchor="middle" fontStyle="italic">Baron K—</text>
      <text x="12" y="15.5" fontSize="1.5" fill="#4A4A4A" textAnchor="middle">Praha</text>
      {/* Coat of arms hint */}
      <circle cx="17" cy="11" r="1.5" fill="#DAA520" opacity="0.5"/>
    </g>
  ),

  // Stained Handkerchief
  STAINED_HANDKERCHIEF: (
    <g>
      {/* Folded fabric */}
      <path d="M4 8 L12 4 L20 8 L12 12 Z" fill="#FFF8DC"/>
      <path d="M4 8 L12 12 L12 20 L4 16 Z" fill="#F5F5DC"/>
      <path d="M12 12 L20 8 L20 16 L12 20 Z" fill="#FFFEF0"/>
      {/* Lace edge hint */}
      <path d="M4 8 Q6 7 8 8 Q10 9 12 8" fill="none" stroke="#FFFFFF" strokeWidth="0.3"/>
      {/* Lipstick mark */}
      <ellipse cx="8" cy="12" rx="2.5" ry="1.5" fill="#DC143C" opacity="0.7"/>
      <ellipse cx="8.5" cy="11.5" rx="2" ry="1" fill="#FF69B4" opacity="0.5"/>
      {/* Perfume stain */}
      <circle cx="15" cy="14" r="2" fill="#DDA0DD" opacity="0.3"/>
      {/* Monogram */}
      <text x="17" y="12" fontSize="2" fill="#C0C0C0" opacity="0.6">M</text>
    </g>
  ),

  // Racing Form
  RACING_FORM: (
    <g>
      {/* Newspaper */}
      <rect x="3" y="4" width="18" height="18" fill="#F5DEB3"/>
      {/* Header */}
      <rect x="4" y="5" width="16" height="3" fill="#1A1A1A"/>
      <text x="12" y="7.5" fontSize="2" fill="#FFFEF0" textAnchor="middle">LONGCHAMP</text>
      {/* Columns */}
      <line x1="12" y1="9" x2="12" y2="20" stroke="#1A1A1A" strokeWidth="0.3"/>
      {/* Race entries - text lines */}
      <line x1="5" y1="10" x2="10" y2="10" stroke="#1A1A1A" strokeWidth="0.3"/>
      <line x1="5" y1="12" x2="10" y2="12" stroke="#1A1A1A" strokeWidth="0.3"/>
      <line x1="5" y1="14" x2="10" y2="14" stroke="#1A1A1A" strokeWidth="0.3"/>
      <line x1="14" y1="10" x2="19" y2="10" stroke="#1A1A1A" strokeWidth="0.3"/>
      {/* Circled horse */}
      <circle cx="7" cy="14" r="2" fill="none" stroke="#FF0000" strokeWidth="0.5"/>
      {/* Crossed out - loser */}
      <line x1="5" y1="13" x2="9" y2="15" stroke="#FF0000" strokeWidth="0.5"/>
    </g>
  ),

  // =========== ESPLANADE BIOME ITEMS ===========

  // Dropped Letter
  DROPPED_LETTER: (
    <g>
      {/* Envelope */}
      <rect x="3" y="8" width="18" height="12" fill="#FFFEF0"/>
      <path d="M3 8 L12 14 L21 8" fill="none" stroke="#D4C4A8" strokeWidth="0.5"/>
      {/* Broken seal */}
      <circle cx="12" cy="16" r="2" fill="#8B0000" opacity="0.7"/>
      <path d="M10 16 L14 16" stroke="#5C0000" strokeWidth="0.5"/>
      {/* Address lines */}
      <line x1="5" y1="11" x2="10" y2="11" stroke="#1A1A1A" strokeWidth="0.3"/>
      <line x1="5" y1="13" x2="9" y2="13" stroke="#1A1A1A" strokeWidth="0.3"/>
      {/* Stamp */}
      <rect x="16" y="9" width="3" height="3" fill="#1E90FF"/>
      {/* Dirt smudge */}
      <ellipse cx="6" cy="18" rx="2" ry="1" fill="#8B7355" opacity="0.4"/>
    </g>
  ),

  // Monogrammed Napkin
  PICNIC_NAPKIN: (
    <g>
      {/* Folded linen */}
      <rect x="4" y="6" width="16" height="14" fill="#FFFEF0"/>
      <path d="M4 6 L10 6 L10 12 L4 12 Z" fill="#F5F5DC"/>
      <path d="M10 6 L20 6 L20 12 L10 12 Z" fill="#FFF8DC"/>
      {/* Embroidered border */}
      <rect x="5" y="7" width="14" height="12" fill="none" stroke="#87CEEB" strokeWidth="0.3" strokeDasharray="1"/>
      {/* Monogram */}
      <text x="12" y="15" fontSize="5" fill="#87CEEB" textAnchor="middle" opacity="0.7">B</text>
      {/* Fold creases */}
      <line x1="10" y1="6" x2="10" y2="20" stroke="#E8E8E8" strokeWidth="0.3"/>
      <line x1="4" y1="12" x2="20" y2="12" stroke="#E8E8E8" strokeWidth="0.3"/>
      {/* Small stain */}
      <circle cx="16" cy="16" r="1" fill="#FFD700" opacity="0.3"/>
    </g>
  ),

  // Child's Hoop
  CHILDS_HOOP: (
    <g>
      {/* Wooden hoop */}
      <circle cx="12" cy="12" r="9" fill="none" stroke="#8B4513" strokeWidth="2"/>
      <circle cx="12" cy="12" r="8" fill="none" stroke="#A0522D" strokeWidth="1"/>
      {/* Wood grain */}
      <path d="M4 10 Q8 9 12 10" fill="none" stroke="#6B4423" strokeWidth="0.3" opacity="0.5"/>
      <path d="M12 14 Q16 13 20 14" fill="none" stroke="#6B4423" strokeWidth="0.3" opacity="0.5"/>
      {/* Worn spot */}
      <ellipse cx="12" cy="3" rx="2" ry="1" fill="#D2B48C" opacity="0.5"/>
    </g>
  ),

  // Lost Kid Glove (single)
  LOST_GLOVE: (
    <g>
      {/* Single glove - laid flat */}
      <path d="M6 20 L6 10 L8 8 L8 6 L10 6 L10 8 L12 8 L12 5 L14 5 L14 8 L16 8 L16 7 L18 7 L18 20 Z" fill="#F5DEB3"/>
      {/* Stitching */}
      <line x1="8" y1="10" x2="8" y2="18" stroke="#D2B48C" strokeWidth="0.3" strokeDasharray="1"/>
      <line x1="12" y1="10" x2="12" y2="18" stroke="#D2B48C" strokeWidth="0.3" strokeDasharray="1"/>
      <line x1="16" y1="10" x2="16" y2="18" stroke="#D2B48C" strokeWidth="0.3" strokeDasharray="1"/>
      {/* Button */}
      <circle cx="10" cy="14" r="0.8" fill="#FFFEF0"/>
      {/* Dirt mark */}
      <ellipse cx="14" cy="18" rx="2" ry="1" fill="#8B7355" opacity="0.3"/>
    </g>
  ),

  // Balloon String
  BALLOON_STRING: (
    <g>
      {/* Curly string */}
      <path d="M12 2 Q8 6 12 10 Q16 14 12 18 Q10 20 12 22" fill="none" stroke="#DC143C" strokeWidth="1"/>
      {/* Frayed end at top */}
      <line x1="12" y1="2" x2="10" y2="1" stroke="#DC143C" strokeWidth="0.5"/>
      <line x1="12" y1="2" x2="14" y2="1" stroke="#DC143C" strokeWidth="0.5"/>
      {/* Knot */}
      <circle cx="12" cy="22" r="1.5" fill="#DC143C"/>
      {/* String texture */}
      <path d="M11 8 Q12 7 13 8" fill="none" stroke="#B22222" strokeWidth="0.3"/>
      <path d="M11 14 Q12 13 13 14" fill="none" stroke="#B22222" strokeWidth="0.3"/>
    </g>
  ),

  // Newspaper Scrap
  NEWSPAPER_SCRAP: (
    <g>
      {/* Torn paper */}
      <path d="M4 4 L18 5 Q20 8 19 12 L17 18 Q14 20 10 19 L5 17 Q3 14 4 10 Z" fill="#F5DEB3"/>
      {/* Text columns */}
      <line x1="6" y1="7" x2="14" y2="7" stroke="#1A1A1A" strokeWidth="0.4"/>
      <line x1="6" y1="9" x2="16" y2="9" stroke="#1A1A1A" strokeWidth="0.4"/>
      <line x1="6" y1="11" x2="12" y2="11" stroke="#1A1A1A" strokeWidth="0.4"/>
      <line x1="6" y1="13" x2="15" y2="13" stroke="#1A1A1A" strokeWidth="0.4"/>
      {/* Bold headline fragment */}
      <text x="8" y="16" fontSize="2" fill="#1A1A1A" fontWeight="bold">ANARCH</text>
      {/* Torn edge effect */}
      <path d="M4 4 Q5 5 4 6 Q5 7 4 8" fill="none" stroke="#D2B48C" strokeWidth="0.5"/>
    </g>
  ),

  // Flower from Bouquet
  FALLEN_FLOWER: (
    <g>
      {/* Stem */}
      <path d="M12 22 Q11 18 12 14" fill="none" stroke="#228B22" strokeWidth="1"/>
      {/* Thorns */}
      <path d="M11.5 18 L10 17.5" fill="none" stroke="#228B22" strokeWidth="0.5"/>
      <path d="M12.5 16 L14 15.5" fill="none" stroke="#228B22" strokeWidth="0.5"/>
      {/* Rose petals */}
      <ellipse cx="12" cy="10" rx="5" ry="4" fill="#DC143C"/>
      <ellipse cx="10" cy="9" rx="3" ry="2.5" fill="#FF6B6B" opacity="0.8"/>
      <ellipse cx="14" cy="9" rx="3" ry="2.5" fill="#B22222" opacity="0.8"/>
      <ellipse cx="12" cy="8" rx="2.5" ry="2" fill="#FF4040"/>
      <ellipse cx="12" cy="7" rx="1.5" ry="1" fill="#FF6B6B"/>
      {/* Dew drop */}
      <circle cx="14" cy="11" r="0.8" fill="#87CEEB" opacity="0.7"/>
      {/* Leaf */}
      <ellipse cx="8" cy="16" rx="2" ry="1" fill="#228B22" transform="rotate(-30 8 16)"/>
    </g>
  ),

  // Torn Photograph
  TORN_PHOTO: (
    <g>
      {/* Photo with torn edge */}
      <rect x="4" y="5" width="12" height="15" fill="#F5F5DC"/>
      {/* Torn right edge */}
      <path d="M16 5 Q18 8 16 11 Q17 14 16 17 Q17 19 16 20" fill="#F5F5DC" stroke="#D2B48C" strokeWidth="0.5"/>
      {/* Sepia image hint - half a face */}
      <ellipse cx="10" cy="10" rx="4" ry="5" fill="#D2B48C" opacity="0.5"/>
      <circle cx="8" cy="9" r="1" fill="#4A4A4A" opacity="0.6"/> {/* Eye */}
      <path d="M6 12 Q8 13 10 12" fill="none" stroke="#4A4A4A" strokeWidth="0.5" opacity="0.6"/> {/* Partial mouth */}
      {/* Collar hint */}
      <path d="M6 15 Q8 14 10 16" fill="none" stroke="#4A4A4A" strokeWidth="0.5"/>
      {/* Photo border */}
      <rect x="5" y="6" width="10" height="13" fill="none" stroke="#8B7355" strokeWidth="0.5"/>
    </g>
  ),

  // =========== VILLAGE BIOME ITEMS ===========

  // Woven Bracelet
  WOVEN_BRACELET: (
    <g>
      {/* Circular bracelet */}
      <ellipse cx="12" cy="12" rx="7" ry="8" fill="none" stroke="#8B4513" strokeWidth="3"/>
      {/* Weave pattern */}
      <ellipse cx="12" cy="12" rx="7" ry="8" fill="none" stroke="#D2691E" strokeWidth="1" strokeDasharray="2"/>
      <ellipse cx="12" cy="12" rx="6" ry="7" fill="none" stroke="#FFD700" strokeWidth="0.5" strokeDasharray="3"/>
      {/* Color accents */}
      <circle cx="6" cy="10" r="1" fill="#FF6347"/>
      <circle cx="18" cy="10" r="1" fill="#FF6347"/>
      <circle cx="6" cy="14" r="1" fill="#4169E1"/>
      <circle cx="18" cy="14" r="1" fill="#4169E1"/>
      {/* Tied ends */}
      <path d="M10 4 Q9 2 8 3 M14 4 Q15 2 16 3" fill="none" stroke="#8B4513" strokeWidth="0.8"/>
    </g>
  ),

  // Kola Nut
  KOLA_NUT: (
    <g>
      {/* Nut halves */}
      <ellipse cx="9" cy="12" rx="5" ry="6" fill="#8B4513"/>
      <ellipse cx="15" cy="12" rx="5" ry="6" fill="#A0522D"/>
      {/* Split line */}
      <line x1="12" y1="6" x2="12" y2="18" stroke="#5D3A1A" strokeWidth="0.5"/>
      {/* Texture/ridges */}
      <path d="M5 10 Q7 9 9 10" fill="none" stroke="#6B4423" strokeWidth="0.3"/>
      <path d="M5 14 Q7 13 9 14" fill="none" stroke="#6B4423" strokeWidth="0.3"/>
      <path d="M15 10 Q17 9 19 10" fill="none" stroke="#6B4423" strokeWidth="0.3"/>
      <path d="M15 14 Q17 13 19 14" fill="none" stroke="#6B4423" strokeWidth="0.3"/>
      {/* Slight sheen */}
      <ellipse cx="7" cy="10" rx="1.5" ry="1" fill="#CD853F" opacity="0.4"/>
    </g>
  ),

  // Small Carved Figure
  CARVED_FIGURE: (
    <g>
      {/* Body */}
      <ellipse cx="12" cy="14" rx="4" ry="6" fill="#8B4513"/>
      {/* Head */}
      <circle cx="12" cy="7" r="4" fill="#A0522D"/>
      {/* Face features - stylized */}
      <ellipse cx="10" cy="6" rx="0.8" ry="1" fill="#1A1A1A"/>
      <ellipse cx="14" cy="6" rx="0.8" ry="1" fill="#1A1A1A"/>
      <ellipse cx="12" cy="9" rx="1.5" ry="0.5" fill="#6B4423"/>
      {/* Carved patterns */}
      <path d="M8 12 Q12 11 16 12" fill="none" stroke="#5D3A1A" strokeWidth="0.5"/>
      <path d="M9 15 Q12 14 15 15" fill="none" stroke="#5D3A1A" strokeWidth="0.5"/>
      {/* Base */}
      <ellipse cx="12" cy="20" rx="4" ry="1.5" fill="#6B4423"/>
    </g>
  ),

  // Palm Leaf Fan
  PALM_FAN: (
    <g>
      {/* Fan leaves - spread */}
      <path d="M12 18 L4 4 Q8 3 12 6 Q16 3 20 4 L12 18 Z" fill="#228B22"/>
      {/* Leaf ribs */}
      <line x1="12" y1="18" x2="6" y2="5" stroke="#006400" strokeWidth="0.5"/>
      <line x1="12" y1="18" x2="9" y2="4" stroke="#006400" strokeWidth="0.5"/>
      <line x1="12" y1="18" x2="12" y2="4" stroke="#006400" strokeWidth="0.5"/>
      <line x1="12" y1="18" x2="15" y2="4" stroke="#006400" strokeWidth="0.5"/>
      <line x1="12" y1="18" x2="18" y2="5" stroke="#006400" strokeWidth="0.5"/>
      {/* Handle */}
      <rect x="11" y="17" width="2" height="5" fill="#8B4513"/>
      {/* Binding */}
      <rect x="10" y="17" width="4" height="1" fill="#D2691E"/>
    </g>
  ),

  // Batik Cloth Sample
  BATIK_CLOTH: (
    <g>
      {/* Cloth base */}
      <rect x="3" y="5" width="18" height="16" fill="#1E3A5F"/>
      {/* Wax-resist patterns */}
      <circle cx="7" cy="9" r="2.5" fill="none" stroke="#F5DEB3" strokeWidth="0.8"/>
      <circle cx="17" cy="9" r="2.5" fill="none" stroke="#F5DEB3" strokeWidth="0.8"/>
      <circle cx="12" cy="13" r="2.5" fill="none" stroke="#F5DEB3" strokeWidth="0.8"/>
      <circle cx="7" cy="17" r="2.5" fill="none" stroke="#F5DEB3" strokeWidth="0.8"/>
      <circle cx="17" cy="17" r="2.5" fill="none" stroke="#F5DEB3" strokeWidth="0.8"/>
      {/* Inner patterns */}
      <circle cx="7" cy="9" r="1" fill="#8B0000"/>
      <circle cx="17" cy="9" r="1" fill="#8B0000"/>
      <circle cx="12" cy="13" r="1" fill="#8B0000"/>
      {/* Dots connecting */}
      <circle cx="10" cy="11" r="0.5" fill="#F5DEB3"/>
      <circle cx="14" cy="11" r="0.5" fill="#F5DEB3"/>
    </g>
  ),

  // Broken Gamelan Key
  GAMELAN_KEY: (
    <g>
      {/* Bronze bar */}
      <rect x="3" y="10" width="18" height="6" fill="#CD7F32" rx="1"/>
      <rect x="4" y="11" width="16" height="4" fill="#B8860B"/>
      {/* Break/crack */}
      <path d="M14 10 L15 13 L14 16" fill="none" stroke="#8B6914" strokeWidth="1"/>
      {/* Mounting holes */}
      <circle cx="6" cy="13" r="1" fill="#1A1A1A"/>
      <circle cx="18" cy="13" r="1" fill="#1A1A1A"/>
      {/* Aged patina */}
      <ellipse cx="10" cy="12" rx="3" ry="1.5" fill="#228B22" opacity="0.2"/>
      {/* Shine */}
      <rect x="5" y="11" width="8" height="1" fill="#DAA520" opacity="0.3"/>
    </g>
  ),

  // Betel Leaves
  BETEL_LEAVES: (
    <g>
      {/* Leaf 1 */}
      <path d="M8 18 Q4 12 8 6 Q12 4 14 8 Q10 12 8 18 Z" fill="#228B22"/>
      <path d="M8 18 Q6 12 8 8" fill="none" stroke="#006400" strokeWidth="0.5"/>
      {/* Leaf 2 - overlapping */}
      <path d="M16 20 Q12 14 16 8 Q20 6 22 10 Q18 14 16 20 Z" fill="#2E8B2E" opacity="0.9"/>
      <path d="M16 20 Q14 14 16 10" fill="none" stroke="#006400" strokeWidth="0.5"/>
      {/* Vein patterns */}
      <path d="M7 10 L9 10" fill="none" stroke="#006400" strokeWidth="0.3"/>
      <path d="M7 14 L9 14" fill="none" stroke="#006400" strokeWidth="0.3"/>
      <path d="M15 12 L17 12" fill="none" stroke="#006400" strokeWidth="0.3"/>
    </g>
  ),

  // =========== GALERIE BIOME ITEMS ===========

  // Large Iron Bolt
  IRON_BOLT: (
    <g>
      {/* Bolt head - hexagonal */}
      <polygon points="12,4 17,7 17,13 12,16 7,13 7,7" fill="#4A4A4A"/>
      <polygon points="12,5 16,7.5 16,12.5 12,15 8,12.5 8,7.5" fill="#696969"/>
      {/* Threaded shaft */}
      <rect x="10" y="15" width="4" height="7" fill="#4A4A4A"/>
      {/* Thread lines */}
      <line x1="10" y1="16" x2="14" y2="16" stroke="#2F2F2F" strokeWidth="0.5"/>
      <line x1="10" y1="18" x2="14" y2="18" stroke="#2F2F2F" strokeWidth="0.5"/>
      <line x1="10" y1="20" x2="14" y2="20" stroke="#2F2F2F" strokeWidth="0.5"/>
      {/* Rust spots */}
      <circle cx="9" cy="10" r="1" fill="#8B4513" opacity="0.4"/>
      <circle cx="14" cy="8" r="0.5" fill="#8B4513" opacity="0.4"/>
    </g>
  ),

  // Broken Gear Tooth
  GEAR_FRAGMENT: (
    <g>
      {/* Gear fragment */}
      <path d="M6 8 L10 6 L14 8 L16 12 L14 16 L10 18 L6 16 L4 12 Z" fill="#B8860B"/>
      {/* Tooth */}
      <path d="M14 8 L18 6 L20 10 L16 12 Z" fill="#DAA520"/>
      {/* Broken edge */}
      <path d="M6 8 L4 4 Q5 5 6 4" fill="#B8860B"/>
      {/* Center hole partial */}
      <path d="M8 10 Q10 8 12 10 Q14 12 12 14 Q10 16 8 14" fill="#1A1A1A" opacity="0.6"/>
      {/* Machine marks */}
      <line x1="8" y1="11" x2="10" y2="11" stroke="#8B6914" strokeWidth="0.3"/>
      <line x1="11" y1="13" x2="13" y2="13" stroke="#8B6914" strokeWidth="0.3"/>
    </g>
  ),

  // Machine Oil Rag
  OIL_RAG: (
    <g>
      {/* Crumpled cloth */}
      <path d="M4 6 Q8 4 12 6 Q16 4 20 6 L19 18 Q15 20 12 18 Q8 20 5 18 Z" fill="#D2B48C"/>
      {/* Oil stains */}
      <ellipse cx="8" cy="10" rx="3" ry="2" fill="#2F2F2F" opacity="0.7"/>
      <ellipse cx="14" cy="14" rx="4" ry="2.5" fill="#2F2F2F" opacity="0.6"/>
      <ellipse cx="10" cy="16" rx="2" ry="1.5" fill="#1A1A1A" opacity="0.5"/>
      {/* Fabric texture */}
      <line x1="5" y1="8" x2="18" y2="8" stroke="#C4A882" strokeWidth="0.3"/>
      <line x1="6" y1="12" x2="17" y2="12" stroke="#C4A882" strokeWidth="0.3"/>
      {/* Frayed edge */}
      <path d="M19 18 L20 19 M17 18 L18 20 M15 18 L15 20" fill="none" stroke="#D2B48C" strokeWidth="0.5"/>
    </g>
  ),

  // Technical Drawing
  TECHNICAL_DRAWING: (
    <g>
      {/* Paper */}
      <rect x="3" y="4" width="18" height="18" fill="#FFFEF0"/>
      {/* Blueprint blue tint */}
      <rect x="4" y="5" width="16" height="16" fill="#E6F2FF"/>
      {/* Valve diagram */}
      <circle cx="12" cy="12" r="5" fill="none" stroke="#1E3A5F" strokeWidth="0.5"/>
      <rect x="9" y="9" width="6" height="6" fill="none" stroke="#1E3A5F" strokeWidth="0.5"/>
      {/* Cross-section lines */}
      <line x1="12" y1="7" x2="12" y2="17" stroke="#1E3A5F" strokeWidth="0.3"/>
      <line x1="7" y1="12" x2="17" y2="12" stroke="#1E3A5F" strokeWidth="0.3"/>
      {/* Dimension lines */}
      <line x1="5" y1="18" x2="19" y2="18" stroke="#1A1A1A" strokeWidth="0.3"/>
      <line x1="5" y1="17" x2="5" y2="19" stroke="#1A1A1A" strokeWidth="0.3"/>
      <line x1="19" y1="17" x2="19" y2="19" stroke="#1A1A1A" strokeWidth="0.3"/>
      {/* Measurement text */}
      <text x="12" y="20" fontSize="1.5" fill="#1A1A1A" textAnchor="middle">150mm</text>
    </g>
  ),

  // Copper Wire Sample
  WIRE_SAMPLE: (
    <g>
      {/* Coiled wire */}
      <ellipse cx="12" cy="8" rx="6" ry="2" fill="none" stroke="#B87333" strokeWidth="1.5"/>
      <ellipse cx="12" cy="10" rx="6" ry="2" fill="none" stroke="#B87333" strokeWidth="1.5"/>
      <ellipse cx="12" cy="12" rx="6" ry="2" fill="none" stroke="#B87333" strokeWidth="1.5"/>
      <ellipse cx="12" cy="14" rx="6" ry="2" fill="none" stroke="#B87333" strokeWidth="1.5"/>
      <ellipse cx="12" cy="16" rx="6" ry="2" fill="none" stroke="#B87333" strokeWidth="1.5"/>
      {/* Wire ends */}
      <path d="M6 8 L4 6" fill="none" stroke="#B87333" strokeWidth="1.5"/>
      <path d="M18 16 L20 18" fill="none" stroke="#B87333" strokeWidth="1.5"/>
      {/* Copper shine */}
      <ellipse cx="10" cy="10" rx="1" ry="0.5" fill="#DAA520" opacity="0.5"/>
      <ellipse cx="14" cy="14" rx="1" ry="0.5" fill="#DAA520" opacity="0.5"/>
    </g>
  ),

  // Exhibitor's Badge
  EXHIBITOR_BADGE: (
    <g>
      {/* Badge shape */}
      <rect x="5" y="6" width="14" height="14" fill="#DAA520" rx="1"/>
      <rect x="6" y="7" width="12" height="12" fill="#FFFEF0"/>
      {/* Eagle emblem (German) */}
      <path d="M12 9 L10 11 L12 10 L14 11 Z" fill="#1A1A1A"/>
      <ellipse cx="12" cy="11" rx="2" ry="1.5" fill="#1A1A1A"/>
      {/* Text */}
      <text x="12" y="15" fontSize="1.5" fill="#1A1A1A" textAnchor="middle">AUSSTELLER</text>
      <text x="12" y="17" fontSize="1.2" fill="#4A4A4A" textAnchor="middle">№ 847</text>
      {/* Pin */}
      <rect x="11" y="4" width="2" height="3" fill="#C0C0C0"/>
      <circle cx="12" cy="4" r="1.5" fill="#C0C0C0"/>
    </g>
  ),

  // =========== GARDEN BIOME ITEMS ===========

  // Horse Chestnut
  HORSE_CHESTNUT: (
    <g>
      {/* Spiky case - partially open */}
      <path d="M6 10 Q4 14 6 18 Q10 20 14 18 Q16 14 14 10 Q10 8 6 10 Z" fill="#228B22"/>
      {/* Spikes */}
      <line x1="5" y1="12" x2="3" y2="11" stroke="#228B22" strokeWidth="0.8"/>
      <line x1="5" y1="14" x2="2" y2="14" stroke="#228B22" strokeWidth="0.8"/>
      <line x1="5" y1="16" x2="3" y2="17" stroke="#228B22" strokeWidth="0.8"/>
      <line x1="15" y1="12" x2="17" y2="11" stroke="#228B22" strokeWidth="0.8"/>
      {/* Chestnut showing */}
      <ellipse cx="12" cy="14" rx="5" ry="4" fill="#8B4513"/>
      <ellipse cx="12" cy="14" rx="4" ry="3" fill="#A0522D"/>
      {/* Shiny spot */}
      <ellipse cx="10" cy="13" rx="1.5" ry="1" fill="#CD853F" opacity="0.6"/>
      {/* Hilum (pale spot) */}
      <ellipse cx="14" cy="15" rx="1.5" ry="1" fill="#F5DEB3" opacity="0.7"/>
    </g>
  ),

  // Peacock Feather
  PEACOCK_FEATHER: (
    <g>
      {/* Shaft */}
      <line x1="12" y1="22" x2="12" y2="4" stroke="#8B7355" strokeWidth="1"/>
      {/* Feather barbs - iridescent */}
      <path d="M12 4 Q6 8 6 12 Q6 16 12 16 Q18 16 18 12 Q18 8 12 4 Z" fill="#006400"/>
      {/* Eye pattern */}
      <ellipse cx="12" cy="11" rx="4" ry="5" fill="#1E90FF"/>
      <ellipse cx="12" cy="11" rx="3" ry="4" fill="#000080"/>
      <ellipse cx="12" cy="11" rx="2" ry="2.5" fill="#8B4513"/>
      <ellipse cx="12" cy="10" rx="1" ry="1.5" fill="#1A1A1A"/>
      {/* Iridescent shimmer */}
      <ellipse cx="8" cy="10" rx="1" ry="2" fill="#00CED1" opacity="0.5"/>
      <ellipse cx="16" cy="10" rx="1" ry="2" fill="#9400D3" opacity="0.5"/>
      {/* Gold highlights */}
      <ellipse cx="12" cy="6" rx="2" ry="1" fill="#FFD700" opacity="0.4"/>
    </g>
  ),

  // Pressed Plane Tree Leaf
  PRESSED_LEAF: (
    <g>
      {/* Maple-like leaf shape */}
      <path d="M12 20 L12 14 L8 10 L6 12 L4 8 L8 8 L6 4 L12 8 L18 4 L16 8 L20 8 L18 12 L16 10 L12 14 Z" fill="#D2691E"/>
      {/* Veins */}
      <line x1="12" y1="14" x2="12" y2="8" stroke="#8B4513" strokeWidth="0.5"/>
      <line x1="12" y1="10" x2="8" y2="6" stroke="#8B4513" strokeWidth="0.3"/>
      <line x1="12" y1="10" x2="16" y2="6" stroke="#8B4513" strokeWidth="0.3"/>
      {/* Autumn colors */}
      <path d="M8 8 L6 4 L12 8" fill="#FFD700" opacity="0.5"/>
      <path d="M16 8 L18 4 L12 8" fill="#FF8C00" opacity="0.5"/>
      {/* Dried texture */}
      <circle cx="10" cy="10" r="0.5" fill="#8B4513" opacity="0.5"/>
      <circle cx="14" cy="9" r="0.5" fill="#8B4513" opacity="0.5"/>
    </g>
  ),

  // Empty Snail Shell
  SNAIL_SHELL: (
    <g>
      {/* Spiral shell */}
      <circle cx="12" cy="12" r="8" fill="#D2B48C"/>
      <circle cx="12" cy="12" r="6" fill="#C4A882"/>
      <circle cx="12" cy="12" r="4" fill="#B8956E"/>
      <circle cx="12" cy="12" r="2" fill="#A0805A"/>
      {/* Spiral line */}
      <path d="M12 4 Q18 6 18 12 Q18 18 12 18 Q6 18 6 12 Q6 8 10 6 Q14 4 16 8 Q18 12 14 14 Q10 16 10 12 Q10 10 12 10" fill="none" stroke="#8B7355" strokeWidth="0.5"/>
      {/* Shell bands */}
      <ellipse cx="14" cy="8" rx="2" ry="1" fill="#6B5344" opacity="0.4"/>
      <ellipse cx="16" cy="12" rx="1" ry="2" fill="#6B5344" opacity="0.4"/>
      {/* Opening */}
      <ellipse cx="8" cy="14" rx="2" ry="3" fill="#4A3728"/>
    </g>
  ),

  // Rose Hip
  ROSE_HIP: (
    <g>
      {/* Berry body */}
      <ellipse cx="12" cy="14" rx="5" ry="6" fill="#DC143C"/>
      <ellipse cx="12" cy="14" rx="4" ry="5" fill="#FF4040"/>
      {/* Calyx (top) */}
      <path d="M10 8 L9 6 L10 7 L11 5 L12 7 L13 5 L14 7 L15 6 L14 8" fill="#228B22"/>
      {/* Stem */}
      <rect x="11" y="4" width="2" height="2" fill="#228B22"/>
      {/* Shine */}
      <ellipse cx="10" cy="12" rx="1" ry="1.5" fill="#FF6B6B" opacity="0.5"/>
      {/* Texture dots */}
      <circle cx="14" cy="13" r="0.3" fill="#B22222"/>
      <circle cx="11" cy="16" r="0.3" fill="#B22222"/>
      <circle cx="13" cy="15" r="0.3" fill="#B22222"/>
    </g>
  ),

  // =========== SALON BIOME ITEMS ===========

  // Exhibition Catalog Page
  CATALOG_PAGE: (
    <g>
      {/* Torn page */}
      <path d="M4 4 L18 4 Q20 6 19 10 L19 20 L5 20 L5 6 Q4 5 4 4 Z" fill="#FFFEF0"/>
      {/* Decorative header */}
      <rect x="6" y="5" width="12" height="2" fill="#8B0000" opacity="0.7"/>
      {/* Text lines */}
      <line x1="6" y1="9" x2="18" y2="9" stroke="#1A1A1A" strokeWidth="0.3"/>
      <line x1="6" y1="11" x2="16" y2="11" stroke="#1A1A1A" strokeWidth="0.3"/>
      <line x1="6" y1="13" x2="18" y2="13" stroke="#1A1A1A" strokeWidth="0.3"/>
      <line x1="6" y1="15" x2="14" y2="15" stroke="#1A1A1A" strokeWidth="0.3"/>
      {/* Small illustration box */}
      <rect x="12" y="16" width="5" height="3" fill="#D3D3D3"/>
      {/* Page number */}
      <text x="12" y="19" fontSize="1.5" fill="#4A4A4A" textAnchor="middle">47</text>
    </g>
  ),

  // Chip of Gilt
  GILT_CHIP: (
    <g>
      {/* Irregular gold chip */}
      <path d="M8 8 L14 6 L18 10 L16 16 L10 18 L6 14 Z" fill="#DAA520"/>
      <path d="M9 9 L13 7 L16 10 L15 15 L11 16 L8 13 Z" fill="#FFD700"/>
      {/* Gold leaf texture */}
      <path d="M10 10 Q12 9 14 10" fill="none" stroke="#B8860B" strokeWidth="0.3"/>
      <path d="M9 13 Q12 12 15 13" fill="none" stroke="#B8860B" strokeWidth="0.3"/>
      {/* Bright highlight */}
      <ellipse cx="12" cy="11" rx="2" ry="1" fill="#FFFF00" opacity="0.4"/>
      {/* Gesso backing visible */}
      <path d="M6 14 L8 8" fill="none" stroke="#F5F5DC" strokeWidth="1"/>
    </g>
  ),

  // Velvet Rope Tassel
  VELVET_TASSEL: (
    <g>
      {/* Tassel head */}
      <ellipse cx="12" cy="8" rx="4" ry="3" fill="#8B0000"/>
      <ellipse cx="12" cy="7" rx="3.5" ry="2.5" fill="#DC143C"/>
      {/* Fringe */}
      <line x1="8" y1="10" x2="8" y2="20" stroke="#8B0000" strokeWidth="1"/>
      <line x1="10" y1="10" x2="10" y2="21" stroke="#8B0000" strokeWidth="1"/>
      <line x1="12" y1="10" x2="12" y2="22" stroke="#8B0000" strokeWidth="1"/>
      <line x1="14" y1="10" x2="14" y2="21" stroke="#8B0000" strokeWidth="1"/>
      <line x1="16" y1="10" x2="16" y2="20" stroke="#8B0000" strokeWidth="1"/>
      {/* Gold band */}
      <rect x="8" y="9" width="8" height="2" fill="#DAA520"/>
      {/* Attachment cord */}
      <path d="M12 5 Q10 3 12 2 Q14 3 12 5" fill="none" stroke="#DAA520" strokeWidth="1"/>
      {/* Dust */}
      <circle cx="10" cy="18" r="0.5" fill="#D3D3D3" opacity="0.5"/>
    </g>
  ),

  // Loose Lorgnette Lens
  LORGNETTE_LENS: (
    <g>
      {/* Oval lens */}
      <ellipse cx="12" cy="12" rx="7" ry="8" fill="#E8F4F8" opacity="0.4"/>
      <ellipse cx="12" cy="12" rx="7" ry="8" fill="none" stroke="#DAA520" strokeWidth="1"/>
      {/* Gold frame edge */}
      <ellipse cx="12" cy="12" rx="6" ry="7" fill="none" stroke="#B8860B" strokeWidth="0.5"/>
      {/* Reflection */}
      <ellipse cx="9" cy="9" rx="2" ry="2.5" fill="#FFFFFF" opacity="0.5"/>
      {/* Broken mount point */}
      <path d="M19 12 L21 11 L21 13 Z" fill="#DAA520"/>
      {/* Slight crack */}
      <path d="M15 8 L17 10" fill="none" stroke="#C0C0C0" strokeWidth="0.3" opacity="0.5"/>
    </g>
  ),

  // Wax Seal Fragment
  WAX_SEAL: (
    <g>
      {/* Broken seal */}
      <path d="M6 8 Q4 12 6 16 Q10 18 14 16 Q16 12 14 8 Q10 6 6 8 Z" fill="#8B0000"/>
      <path d="M7 9 Q5 12 7 15 Q10 17 13 15 Q15 12 13 9 Q10 7 7 9 Z" fill="#DC143C"/>
      {/* Partial crest impression */}
      <path d="M10 10 L10 14 L8 14 L10 10 L12 10 L12 14" fill="none" stroke="#5C0000" strokeWidth="0.8"/>
      {/* Broken edge */}
      <path d="M14 8 L16 6 Q17 8 16 10" fill="#8B0000"/>
      {/* Wax drip texture */}
      <ellipse cx="8" cy="13" rx="1" ry="0.5" fill="#B22222" opacity="0.6"/>
    </g>
  ),

  // =========== TOWER BIOME ITEMS ===========

  // Eiffel Tower Rivet
  TOWER_RIVET: (
    <g>
      {/* Rivet head - domed */}
      <ellipse cx="12" cy="10" rx="6" ry="3" fill="#4A4A4A"/>
      <ellipse cx="12" cy="9" rx="5" ry="2.5" fill="#696969"/>
      {/* Shaft */}
      <rect x="9" y="12" width="6" height="8" fill="#4A4A4A"/>
      {/* Hammer marks on head */}
      <ellipse cx="10" cy="9" rx="1" ry="0.5" fill="#5A5A5A"/>
      <ellipse cx="14" cy="9" rx="1" ry="0.5" fill="#5A5A5A"/>
      {/* Rust patina */}
      <ellipse cx="11" cy="8" rx="2" ry="1" fill="#8B4513" opacity="0.3"/>
      {/* Iron sheen */}
      <ellipse cx="13" cy="8" rx="1" ry="0.5" fill="#A0A0A0" opacity="0.4"/>
    </g>
  ),

  // Iron Filings
  IRON_FILINGS: (
    <g>
      {/* Pile of filings */}
      <ellipse cx="12" cy="16" rx="8" ry="4" fill="#2F2F2F"/>
      <ellipse cx="12" cy="15" rx="7" ry="3" fill="#4A4A4A"/>
      {/* Individual filing particles */}
      <line x1="8" y1="14" x2="9" y2="15" stroke="#696969" strokeWidth="0.8"/>
      <line x1="10" y1="13" x2="11" y2="14" stroke="#696969" strokeWidth="0.8"/>
      <line x1="12" y1="14" x2="13" y2="13" stroke="#5A5A5A" strokeWidth="0.8"/>
      <line x1="14" y1="14" x2="15" y2="15" stroke="#696969" strokeWidth="0.8"/>
      <line x1="16" y1="15" x2="17" y2="14" stroke="#5A5A5A" strokeWidth="0.8"/>
      {/* Scattered bits */}
      <circle cx="6" cy="18" r="0.5" fill="#4A4A4A"/>
      <circle cx="18" cy="17" r="0.5" fill="#4A4A4A"/>
      <circle cx="10" cy="19" r="0.3" fill="#4A4A4A"/>
    </g>
  ),

  // Used Elevator Ticket
  ELEVATOR_TICKET: (
    <g>
      {/* Ticket */}
      <rect x="4" y="6" width="16" height="12" fill="#F5DEB3"/>
      <rect x="5" y="7" width="14" height="10" fill="#FFFEF0"/>
      {/* Decorative border */}
      <rect x="5" y="7" width="14" height="10" fill="none" stroke="#1E3A5F" strokeWidth="0.3"/>
      {/* Tower illustration */}
      <path d="M12 9 L10 15 L14 15 Z" fill="#1E3A5F" opacity="0.6"/>
      <line x1="12" y1="9" x2="12" y2="7" stroke="#1E3A5F" strokeWidth="0.3"/>
      {/* Text */}
      <text x="12" y="16" fontSize="1.5" fill="#1A1A1A" textAnchor="middle">ASCENSEUR</text>
      {/* Punch hole */}
      <circle cx="17" cy="12" r="1.5" fill="#FFFEF0" stroke="#4A4A4A" strokeWidth="0.3"/>
      {/* Crease */}
      <line x1="4" y1="12" x2="20" y2="12" stroke="#D3D3D3" strokeWidth="0.3"/>
    </g>
  ),

  // Worker's Cap
  WORKER_CAP: (
    <g>
      {/* Cap body */}
      <path d="M4 14 Q4 10 12 8 Q20 10 20 14 L18 16 L6 16 Z" fill="#2F2F2F"/>
      <path d="M5 14 Q5 11 12 9 Q19 11 19 14" fill="#4A4A4A"/>
      {/* Brim */}
      <ellipse cx="12" cy="16" rx="8" ry="2" fill="#2F2F2F"/>
      <ellipse cx="12" cy="15.5" rx="7" ry="1.5" fill="#3D3D3D"/>
      {/* Sweat stain */}
      <path d="M6 12 Q12 11 18 12" fill="none" stroke="#5D4E3A" strokeWidth="0.8" opacity="0.5"/>
      {/* Worn spot */}
      <ellipse cx="14" cy="12" rx="2" ry="1" fill="#4A4A4A"/>
    </g>
  ),

  // Windblown Poem
  WIND_POEM: (
    <g>
      {/* Fluttering paper - curved */}
      <path d="M4 6 Q8 4 12 6 Q16 8 20 6 L19 18 Q15 20 12 18 Q8 20 5 18 Z" fill="#FFFEF0"/>
      {/* Verse lines - shaky from wind */}
      <path d="M6 9 Q10 8 14 9 Q16 10 18 9" fill="none" stroke="#4A0080" strokeWidth="0.4"/>
      <path d="M6 11 Q9 10 12 11 Q15 12 17 11" fill="none" stroke="#4A0080" strokeWidth="0.4"/>
      <path d="M7 13 Q11 12 15 13" fill="none" stroke="#4A0080" strokeWidth="0.4"/>
      <path d="M8 15 Q12 14 16 15" fill="none" stroke="#4A0080" strokeWidth="0.4"/>
      {/* Wind motion lines */}
      <path d="M2 8 Q4 7 6 8" fill="none" stroke="#87CEEB" strokeWidth="0.3" opacity="0.5"/>
      <path d="M18 10 Q20 9 22 10" fill="none" stroke="#87CEEB" strokeWidth="0.3" opacity="0.5"/>
      {/* Creased corner */}
      <path d="M4 6 L6 8 L4 10" fill="#F5F5DC"/>
    </g>
  ),

  // Telescope Cap (lens cover)
  TELESCOPE_CAP: (
    <g>
      {/* Cap - cylindrical */}
      <ellipse cx="12" cy="8" rx="7" ry="3" fill="#2F2F2F"/>
      <rect x="5" y="8" width="14" height="8" fill="#3D3D3D"/>
      <ellipse cx="12" cy="16" rx="7" ry="3" fill="#2F2F2F"/>
      {/* Inner rim */}
      <ellipse cx="12" cy="8" rx="5" ry="2" fill="#1A1A1A"/>
      {/* Brass fitting */}
      <ellipse cx="12" cy="16" rx="6" ry="2.5" fill="none" stroke="#B8860B" strokeWidth="0.8"/>
      {/* Chain attachment hole */}
      <circle cx="18" cy="12" r="1" fill="#1A1A1A"/>
      <circle cx="18" cy="12" r="1.5" fill="none" stroke="#4A4A4A" strokeWidth="0.5"/>
    </g>
  ),

  // Scribbled Note (vertigo)
  VERTIGO_NOTE: (
    <g>
      {/* Small torn paper */}
      <path d="M5 5 L18 6 Q19 8 18 12 L17 18 L6 17 Q5 14 6 10 Z" fill="#FFFEF0"/>
      {/* Shaky handwriting */}
      <path d="M7 8 Q10 7 13 9" fill="none" stroke="#1A1A1A" strokeWidth="0.5"/>
      <path d="M7 10 Q9 9 11 10 Q13 11 15 10" fill="none" stroke="#1A1A1A" strokeWidth="0.5"/>
      <path d="M8 12 Q11 11 14 13" fill="none" stroke="#1A1A1A" strokeWidth="0.5"/>
      {/* "down" underlined */}
      <path d="M9 14 Q11 13 13 14" fill="none" stroke="#1A1A1A" strokeWidth="0.6"/>
      <line x1="9" y1="15" x2="13" y2="15" stroke="#1A1A1A" strokeWidth="0.3"/>
      {/* Teardrop stain */}
      <circle cx="15" cy="15" r="1.5" fill="#87CEEB" opacity="0.3"/>
      {/* Crumple */}
      <line x1="5" y1="12" x2="10" y2="14" stroke="#D3D3D3" strokeWidth="0.3"/>
    </g>
  ),
};

// Helper to get item graphic by item name (fuzzy matching)
export const getItemGraphic = (itemName: string): React.ReactNode | null => {
  const name = itemName.toLowerCase();

  // Original items
  if (name.includes('phonograph') || name.includes('cylinder')) return ITEM_GRAPHICS.PHONOGRAPH_CYLINDER;
  if (name.includes('walking stick') || name.includes('malacca') || name.includes('cane')) return ITEM_GRAPHICS.WALKING_STICK;
  if (name.includes('pressed rose') || name.includes('dried rose')) return ITEM_GRAPHICS.PRESSED_ROSE;
  if (name.includes('opera glass')) return ITEM_GRAPHICS.OPERA_GLASSES;
  if (name.includes('pocket watch') || name.includes('gold watch')) return ITEM_GRAPHICS.POCKET_WATCH;
  if (name.includes('kodak') || name.includes('camera')) return ITEM_GRAPHICS.KODAK_CAMERA;
  if (name.includes('miniature') && name.includes('tower')) return ITEM_GRAPHICS.TOWER_MINIATURE;
  if (name.includes('scarab')) return ITEM_GRAPHICS.SCARAB;
  if (name.includes('cigarette case')) return ITEM_GRAPHICS.CIGARETTE_CASE;
  if (name.includes('absinthe')) return ITEM_GRAPHICS.ABSINTHE;
  if (name.includes('javanese') || name.includes('puppet')) return ITEM_GRAPHICS.JAVANESE_PUPPET;
  if (name.includes('monocle')) return ITEM_GRAPHICS.MONOCLE;
  if (name.includes('fountain pen') || name.includes('waterman')) return ITEM_GRAPHICS.FOUNTAIN_PEN;
  if (name.includes('letter from')) return ITEM_GRAPHICS.LETTER;
  if (name.includes('notebook') || name.includes('blue notebook')) return ITEM_GRAPHICS.NOTEBOOK;
  if (name.includes('chocolate') || name.includes('menier')) return ITEM_GRAPHICS.CHOCOLATE;
  if (name.includes('medal') || name.includes('exposition medal')) return ITEM_GRAPHICS.EXPO_MEDAL;

  // SOUK biome items
  if (name.includes('spice') && name.includes('bag')) return ITEM_GRAPHICS.SPICE_BAG;
  if (name.includes('brass lamp') || (name.includes('small') && name.includes('lamp'))) return ITEM_GRAPHICS.BRASS_LAMP;
  if (name.includes('turkish coffee') || (name.includes('packet') && name.includes('coffee'))) return ITEM_GRAPHICS.TURKISH_COFFEE;
  if (name.includes('kilim') || name.includes('rug fragment')) return ITEM_GRAPHICS.KILIM_FRAGMENT;
  if (name.includes('evil eye') || name.includes('nazar')) return ITEM_GRAPHICS.EVIL_EYE;
  if (name.includes('hookah') || name.includes('mouthpiece')) return ITEM_GRAPHICS.HOOKAH_MOUTHPIECE;
  if (name.includes('henna')) return ITEM_GRAPHICS.HENNA_POWDER;
  if (name.includes('copper tray') || (name.includes('engraved') && name.includes('tray'))) return ITEM_GRAPHICS.COPPER_TRAY;
  if (name.includes('arabic') && name.includes('manuscript')) return ITEM_GRAPHICS.ARABIC_MANUSCRIPT;
  if (name.includes('finger cymbal') || name.includes('zill')) return ITEM_GRAPHICS.FINGER_CYMBALS;

  // CAFE biome items
  if (name.includes('love letter') || (name.includes('abandoned') && name.includes('letter'))) return ITEM_GRAPHICS.LOVE_LETTER;
  if (name.includes('café receipt') || name.includes('cafe receipt')) return ITEM_GRAPHICS.CAFE_RECEIPT;
  if (name.includes('discarded poem')) return ITEM_GRAPHICS.DISCARDED_POEM;
  if (name.includes('sugar cube')) return ITEM_GRAPHICS.SUGAR_CUBE;
  if (name.includes('matchbook')) return ITEM_GRAPHICS.MATCHBOOK;
  if (name.includes('calling card') || (name.includes('stranger') && name.includes('card'))) return ITEM_GRAPHICS.CALLING_CARD;
  if (name.includes('stained handkerchief') || (name.includes('lipstick') && name.includes('handkerchief'))) return ITEM_GRAPHICS.STAINED_HANDKERCHIEF;
  if (name.includes('racing form') || name.includes('longchamp')) return ITEM_GRAPHICS.RACING_FORM;

  // ESPLANADE biome items
  if (name.includes('dropped letter')) return ITEM_GRAPHICS.DROPPED_LETTER;
  if (name.includes('napkin') && (name.includes('monogram') || name.includes('picnic'))) return ITEM_GRAPHICS.PICNIC_NAPKIN;
  if (name.includes('child') && name.includes('hoop')) return ITEM_GRAPHICS.CHILDS_HOOP;
  if (name.includes('lost') && name.includes('glove')) return ITEM_GRAPHICS.LOST_GLOVE;
  if (name.includes('balloon') && name.includes('string')) return ITEM_GRAPHICS.BALLOON_STRING;
  if (name.includes('newspaper') && name.includes('scrap')) return ITEM_GRAPHICS.NEWSPAPER_SCRAP;
  if (name.includes('fallen flower') || (name.includes('flower') && name.includes('bouquet'))) return ITEM_GRAPHICS.FALLEN_FLOWER;
  if (name.includes('torn photograph') || name.includes('torn photo')) return ITEM_GRAPHICS.TORN_PHOTO;

  // VILLAGE biome items
  if (name.includes('woven bracelet')) return ITEM_GRAPHICS.WOVEN_BRACELET;
  if (name.includes('kola nut') || name.includes('kola')) return ITEM_GRAPHICS.KOLA_NUT;
  if (name.includes('carved figure')) return ITEM_GRAPHICS.CARVED_FIGURE;
  if (name.includes('palm') && name.includes('fan')) return ITEM_GRAPHICS.PALM_FAN;
  if (name.includes('batik')) return ITEM_GRAPHICS.BATIK_CLOTH;
  if (name.includes('gamelan')) return ITEM_GRAPHICS.GAMELAN_KEY;
  if (name.includes('betel')) return ITEM_GRAPHICS.BETEL_LEAVES;

  // GALERIE biome items
  if (name.includes('iron bolt') || (name.includes('large') && name.includes('bolt'))) return ITEM_GRAPHICS.IRON_BOLT;
  if (name.includes('gear') && (name.includes('fragment') || name.includes('tooth') || name.includes('broken'))) return ITEM_GRAPHICS.GEAR_FRAGMENT;
  if (name.includes('oil rag')) return ITEM_GRAPHICS.OIL_RAG;
  if (name.includes('technical drawing')) return ITEM_GRAPHICS.TECHNICAL_DRAWING;
  if (name.includes('copper wire') || name.includes('wire sample')) return ITEM_GRAPHICS.WIRE_SAMPLE;
  if (name.includes('exhibitor') && name.includes('badge')) return ITEM_GRAPHICS.EXHIBITOR_BADGE;

  // GARDEN biome items
  if (name.includes('horse chestnut') || name.includes('chestnut')) return ITEM_GRAPHICS.HORSE_CHESTNUT;
  if (name.includes('peacock') && name.includes('feather')) return ITEM_GRAPHICS.PEACOCK_FEATHER;
  if ((name.includes('pressed') && name.includes('leaf')) || name.includes('plane tree')) return ITEM_GRAPHICS.PRESSED_LEAF;
  if (name.includes('snail') && name.includes('shell')) return ITEM_GRAPHICS.SNAIL_SHELL;
  if (name.includes('rose hip') || name.includes('rosehip')) return ITEM_GRAPHICS.ROSE_HIP;

  // SALON biome items
  if ((name.includes('catalog') && name.includes('page')) || name.includes('exhibition catalog')) return ITEM_GRAPHICS.CATALOG_PAGE;
  if (name.includes('gilt') || name.includes('chip of gilt')) return ITEM_GRAPHICS.GILT_CHIP;
  if (name.includes('tassel') || (name.includes('velvet') && name.includes('rope'))) return ITEM_GRAPHICS.VELVET_TASSEL;
  if (name.includes('lorgnette') && name.includes('lens')) return ITEM_GRAPHICS.LORGNETTE_LENS;
  if (name.includes('wax seal') || name.includes('seal fragment')) return ITEM_GRAPHICS.WAX_SEAL;

  // TOWER biome items
  if (name.includes('rivet') && (name.includes('tower') || name.includes('eiffel'))) return ITEM_GRAPHICS.TOWER_RIVET;
  if (name.includes('iron filing')) return ITEM_GRAPHICS.IRON_FILINGS;
  if (name.includes('elevator ticket') || name.includes('ascenseur')) return ITEM_GRAPHICS.ELEVATOR_TICKET;
  if (name.includes('worker') && name.includes('cap')) return ITEM_GRAPHICS.WORKER_CAP;
  if ((name.includes('windblown') && name.includes('poem')) || (name.includes('wind') && name.includes('poem'))) return ITEM_GRAPHICS.WIND_POEM;
  if (name.includes('telescope cap') || name.includes('binocular cap') || name.includes('lens cover')) return ITEM_GRAPHICS.TELESCOPE_CAP;
  if (name.includes('vertigo') || name.includes('scribbled note')) return ITEM_GRAPHICS.VERTIGO_NOTE;

  // Original items with broader matching (moved after biome items to avoid conflicts)
  if (name.includes('glove') || name.includes('kid leather')) return ITEM_GRAPHICS.GLOVES;

  return null;
};

// Component wrapper for rendering item graphics
interface ItemIconProps {
  itemName: string;
  size?: number;
  className?: string;
}

export const ItemIcon: React.FC<ItemIconProps> = ({ itemName, size = 24, className = '' }) => {
  const graphic = getItemGraphic(itemName);

  if (!graphic) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ display: 'inline-block' }}
    >
      {graphic}
    </svg>
  );
};

export default ItemIcon;
