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
};

// Helper to get item graphic by item name (fuzzy matching)
export const getItemGraphic = (itemName: string): React.ReactNode | null => {
  const name = itemName.toLowerCase();

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
