import React from 'react';
import { PortraitArchetype, PortraitEmotion } from '../types';

interface Props {
  archetype: PortraitArchetype;
  emotion?: PortraitEmotion;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  hatOff?: boolean; // For Henry James - shows bald head when hat is removed
  pinceNez?: boolean; // For Henry James - shows pince-nez glasses when equipped
  speakingFrame?: number; // 0, 1, or 2 for animated mouth during speaking
  // Color overrides - when provided, these override the archetype defaults
  skinTone?: 'fair' | 'pale' | 'tan' | 'olive' | 'golden' | 'warm_brown' | 'dark' | 'deep';
  hairColor?: string; // Hex color for hair
  clothingColor?: string; // Hex color for primary clothing
  secondaryColor?: string; // Hex color for secondary elements (hat, accessories)
}

// --- Configuration Types ---
type Gender = 'm' | 'f';
type SkinTone = 'pale' | 'fair' | 'tan' | 'olive' | 'golden' | 'warm_brown' | 'dark' | 'deep';
type Age = 'young' | 'middle' | 'elderly';
type Clothes = 'suit' | 'dress' | 'uniform' | 'shirt' | 'trench' | 'vest' | 'robe' | 'military' | 'kimono';
type Hat = 'fedora' | 'cloche' | 'cop' | 'newsboy' | 'headband' | 'bowler' | 'top_hat' | 'turban' | 'fez' | 'none';
type Accessory = 'cigar' | 'glasses' | 'pince_nez' | 'monocle' | 'pearls' | 'scarf' | 'earrings' | 'fan' | 'none';
type HairStyle = 'short' | 'bob' | 'bald' | 'slick' | 'wavy' | 'finger_waves' | 'curly' | 'coily' | 'updo' | 'gray_slick' | 'gray_short';
type FacialHair = 'none' | 'mustache' | 'goatee' | 'stubble' | 'henry_goatee' | 'full_beard' | 'mutton_chops' | 'imperial';

interface PortraitConfig {
  gender: Gender;
  skin: SkinTone;
  hairColor: string;
  eyeColor: string;
  clothes: Clothes;
  clothingColor: string; // Main clothing color
  hat: Hat;
  accessory: Accessory;
  hairStyle: HairStyle;
  facialHair?: FacialHair;
  age?: Age;
}

const CONFIGS: Record<PortraitArchetype, PortraitConfig> = {
  // Original archetypes
  mobster_m: { gender: 'm', skin: 'olive', hairColor: '#0a0a0a', eyeColor: '#1a1515', clothes: 'suit', clothingColor: '#1a1a1a', hat: 'fedora', accessory: 'cigar', hairStyle: 'slick' },
  mobster_f: { gender: 'f', skin: 'tan', hairColor: '#2c1810', eyeColor: '#1f4d1f', clothes: 'dress', clothingColor: '#6b1f1f', hat: 'cloche', accessory: 'earrings', hairStyle: 'bob' },
  flapper:   { gender: 'f', skin: 'pale', hairColor: '#e6c35c', eyeColor: '#5b9bd5', clothes: 'dress', clothingColor: '#d4af37', hat: 'headband', accessory: 'pearls', hairStyle: 'finger_waves' },
  cop:       { gender: 'm', skin: 'tan', hairColor: '#4a3222', eyeColor: '#2d4a2d', clothes: 'uniform', clothingColor: '#1e3a5f', hat: 'cop', accessory: 'none', hairStyle: 'short', facialHair: 'mustache' },
  worker:    { gender: 'm', skin: 'dark', hairColor: '#1a1410', eyeColor: '#3d2817', clothes: 'vest', clothingColor: '#4a3428', hat: 'newsboy', accessory: 'none', hairStyle: 'short', facialHair: 'stubble' },
  gentleman: { gender: 'm', skin: 'pale', hairColor: '#9e9e9e', eyeColor: '#6b7c4f', clothes: 'suit', clothingColor: '#2d2d2d', hat: 'none', accessory: 'glasses', hairStyle: 'slick' },
  sailor:    { gender: 'm', skin: 'tan', hairColor: '#a0603a', eyeColor: '#3a7bc8', clothes: 'shirt', clothingColor: '#f5f5dc', hat: 'none', accessory: 'none', hairStyle: 'short' },
  pharmacist:{ gender: 'm', skin: 'pale', hairColor: '#b8b8b8', eyeColor: '#829099', clothes: 'suit', clothingColor: '#3a3a3a', hat: 'none', accessory: 'glasses', hairStyle: 'bald', facialHair: 'mustache' },
  henry_james: { gender: 'm', skin: 'pale', hairColor: '#4a3728', eyeColor: '#4a3428', clothes: 'suit', clothingColor: '#1a1a2e', hat: 'top_hat', accessory: 'none', hairStyle: 'bald', facialHair: 'henry_goatee' },

  // New archetypes for variety
  william_james: { gender: 'm', skin: 'pale', hairColor: '#4a3a2a', eyeColor: '#5a6a70', clothes: 'suit', clothingColor: '#2a2a2a', hat: 'none', accessory: 'none', hairStyle: 'short', facialHair: 'full_beard' },
  artist: { gender: 'm', skin: 'pale', hairColor: '#2a1a0a', eyeColor: '#3a5a3a', clothes: 'vest', clothingColor: '#4a3040', hat: 'none', accessory: 'none', hairStyle: 'wavy', facialHair: 'goatee' },
  aristocrat: { gender: 'm', skin: 'pale', hairColor: '#8a8a8a', eyeColor: '#5a4a4a', clothes: 'suit', clothingColor: '#1a1a2a', hat: 'none', accessory: 'none', hairStyle: 'slick', facialHair: 'mustache' },
  engineer: { gender: 'm', skin: 'tan', hairColor: '#3a2a1a', eyeColor: '#4a3a2a', clothes: 'vest', clothingColor: '#3a3a3a', hat: 'newsboy', accessory: 'glasses', hairStyle: 'short', facialHair: 'mustache' },
  bohemian: { gender: 'm', skin: 'olive', hairColor: '#1a1a1a', eyeColor: '#2a2a2a', clothes: 'shirt', clothingColor: '#6a4a3a', hat: 'none', accessory: 'cigar', hairStyle: 'wavy', facialHair: 'stubble' },
  journalist: { gender: 'm', skin: 'pale', hairColor: '#4a3a2a', eyeColor: '#5a5a5a', clothes: 'suit', clothingColor: '#3a3a3a', hat: 'fedora', accessory: 'none', hairStyle: 'short' },
  diplomat: { gender: 'm', skin: 'pale', hairColor: '#6a6a6a', eyeColor: '#4a5a6a', clothes: 'suit', clothingColor: '#0a0a1a', hat: 'none', accessory: 'none', hairStyle: 'slick', facialHair: 'mustache' },
  young_man: { gender: 'm', skin: 'tan', hairColor: '#3a2a1a', eyeColor: '#5a7a5a', clothes: 'suit', clothingColor: '#4a4a4a', hat: 'none', accessory: 'none', hairStyle: 'short' },
  professor: { gender: 'm', skin: 'pale', hairColor: '#7a7a7a', eyeColor: '#4a4a3a', clothes: 'suit', clothingColor: '#2a2a2a', hat: 'none', accessory: 'glasses', hairStyle: 'bald', facialHair: 'goatee' },

  // Female archetypes
  lady_elegant: { gender: 'f', skin: 'pale', hairColor: '#4a3a2a', eyeColor: '#5a6a5a', clothes: 'dress', clothingColor: '#3a2a4a', hat: 'cloche', accessory: 'pearls', hairStyle: 'bob' },
  lady_bohemian: { gender: 'f', skin: 'olive', hairColor: '#1a1a0a', eyeColor: '#3a3a2a', clothes: 'dress', clothingColor: '#6a3a2a', hat: 'none', accessory: 'earrings', hairStyle: 'wavy' },

  // New diverse archetypes for 1889 Paris Exposition
  // African/diaspora characters
  african_diplomat: { gender: 'm', skin: 'deep', hairColor: '#0a0a0a', eyeColor: '#2a1a0a', clothes: 'suit', clothingColor: '#1a1a2a', hat: 'none', accessory: 'none', hairStyle: 'short', age: 'middle' },
  haitian_scholar: { gender: 'm', skin: 'warm_brown', hairColor: '#1a1a1a', eyeColor: '#3a2a1a', clothes: 'suit', clothingColor: '#2a2a3a', hat: 'none', accessory: 'glasses', hairStyle: 'short', facialHair: 'goatee', age: 'middle' },
  senegalese_trader: { gender: 'm', skin: 'dark', hairColor: '#0a0a0a', eyeColor: '#2a2a1a', clothes: 'robe', clothingColor: '#4a6a8a', hat: 'none', accessory: 'none', hairStyle: 'short', age: 'middle' },
  caribbean_sailor: { gender: 'm', skin: 'warm_brown', hairColor: '#1a1a0a', eyeColor: '#3a3a2a', clothes: 'shirt', clothingColor: '#f5f5dc', hat: 'none', accessory: 'none', hairStyle: 'curly', age: 'young' },

  // Asian characters
  japanese_delegate: { gender: 'm', skin: 'golden', hairColor: '#0a0a0a', eyeColor: '#1a1a0a', clothes: 'suit', clothingColor: '#1a1a1a', hat: 'none', accessory: 'none', hairStyle: 'slick', age: 'middle' },
  chinese_merchant: { gender: 'm', skin: 'golden', hairColor: '#0a0a0a', eyeColor: '#2a1a0a', clothes: 'robe', clothingColor: '#8a2a2a', hat: 'none', accessory: 'none', hairStyle: 'slick', age: 'elderly', facialHair: 'goatee' },
  indian_prince: { gender: 'm', skin: 'warm_brown', hairColor: '#0a0a0a', eyeColor: '#2a1a0a', clothes: 'military', clothingColor: '#1a3a5a', hat: 'turban', accessory: 'none', hairStyle: 'short', facialHair: 'mustache', age: 'middle' },
  persian_merchant: { gender: 'm', skin: 'olive', hairColor: '#1a1a0a', eyeColor: '#3a2a1a', clothes: 'robe', clothingColor: '#5a3a6a', hat: 'fez', accessory: 'none', hairStyle: 'short', facialHair: 'full_beard', age: 'middle' },

  // Middle Eastern/North African
  ottoman_official: { gender: 'm', skin: 'tan', hairColor: '#1a1a0a', eyeColor: '#3a2a1a', clothes: 'military', clothingColor: '#2a2a3a', hat: 'fez', accessory: 'none', hairStyle: 'short', facialHair: 'mustache', age: 'middle' },
  egyptian_scholar: { gender: 'm', skin: 'tan', hairColor: '#1a1a0a', eyeColor: '#3a3a2a', clothes: 'suit', clothingColor: '#3a3a3a', hat: 'none', accessory: 'glasses', hairStyle: 'short', age: 'elderly' },

  // Elderly characters
  elderly_matron: { gender: 'f', skin: 'pale', hairColor: '#9a9a9a', eyeColor: '#5a5a5a', clothes: 'dress', clothingColor: '#2a2a3a', hat: 'cloche', accessory: 'pearls', hairStyle: 'updo', age: 'elderly' },
  elderly_gentleman: { gender: 'm', skin: 'fair', hairColor: '#c0c0c0', eyeColor: '#5a6a5a', clothes: 'suit', clothingColor: '#2a2a2a', hat: 'none', accessory: 'monocle', hairStyle: 'gray_slick', facialHair: 'mutton_chops', age: 'elderly' },
  retired_general: { gender: 'm', skin: 'tan', hairColor: '#b0b0b0', eyeColor: '#4a5a4a', clothes: 'military', clothingColor: '#1a2a3a', hat: 'none', accessory: 'none', hairStyle: 'gray_short', facialHair: 'imperial', age: 'elderly' },

  // Young characters
  debutante: { gender: 'f', skin: 'fair', hairColor: '#e6c35c', eyeColor: '#5b9bd5', clothes: 'dress', clothingColor: '#d4af37', hat: 'headband', accessory: 'fan', hairStyle: 'updo', age: 'young' },
  student: { gender: 'm', skin: 'pale', hairColor: '#4a3a2a', eyeColor: '#5a5a5a', clothes: 'suit', clothingColor: '#3a3a4a', hat: 'none', accessory: 'none', hairStyle: 'wavy', age: 'young' },

  // More female archetypes
  african_lady: { gender: 'f', skin: 'dark', hairColor: '#0a0a0a', eyeColor: '#3a2a1a', clothes: 'dress', clothingColor: '#5a2a4a', hat: 'none', accessory: 'earrings', hairStyle: 'updo', age: 'middle' },
  asian_lady: { gender: 'f', skin: 'golden', hairColor: '#0a0a0a', eyeColor: '#2a1a0a', clothes: 'kimono', clothingColor: '#c41e3a', hat: 'none', accessory: 'fan', hairStyle: 'updo', age: 'middle' },
  indian_lady: { gender: 'f', skin: 'warm_brown', hairColor: '#0a0a0a', eyeColor: '#3a2a1a', clothes: 'dress', clothingColor: '#8a2a6a', hat: 'none', accessory: 'earrings', hairStyle: 'updo', age: 'middle' },
  creole_lady: { gender: 'f', skin: 'tan', hairColor: '#2a1a0a', eyeColor: '#3a3a2a', clothes: 'dress', clothingColor: '#6a3a5a', hat: 'cloche', accessory: 'pearls', hairStyle: 'curly', age: 'middle' },

  // Working class diversity
  dock_worker: { gender: 'm', skin: 'dark', hairColor: '#1a1a1a', eyeColor: '#3d2817', clothes: 'vest', clothingColor: '#4a3428', hat: 'newsboy', accessory: 'none', hairStyle: 'coily', facialHair: 'stubble', age: 'young' },
  chef: { gender: 'm', skin: 'olive', hairColor: '#2a2a2a', eyeColor: '#4a3a2a', clothes: 'uniform', clothingColor: '#f5f5f5', hat: 'none', accessory: 'none', hairStyle: 'short', facialHair: 'mustache', age: 'middle' },
  nurse: { gender: 'f', skin: 'warm_brown', hairColor: '#1a1a0a', eyeColor: '#3a3a2a', clothes: 'uniform', clothingColor: '#f5f5f5', hat: 'none', accessory: 'none', hairStyle: 'updo', age: 'young' }
};

const SKIN_COLORS: Record<SkinTone, { base: string; shadow: string; highlight: string; blush: string }> = {
  // Very light, Northern European
  fair:  { base: '#fff5ee', shadow: '#e8d0c0', highlight: '#ffffff', blush: '#ffb0b0' },
  // Light with warm undertones
  pale:  { base: '#fcece3', shadow: '#e0c0a8', highlight: '#fff9f5', blush: '#f0a0a0' },
  // Mediterranean/Southern European/Latin
  tan:   { base: '#e6b996', shadow: '#bd8e6c', highlight: '#f5d5bc', blush: '#d69076' },
  // Mediterranean/Middle Eastern
  olive: { base: '#dccba0', shadow: '#ae9b72', highlight: '#efe6ce', blush: '#c4aa82' },
  // South Asian/Southeast Asian
  golden: { base: '#d4a574', shadow: '#b08050', highlight: '#e8c090', blush: '#c89070' },
  // Medium brown - African/South Asian/Caribbean
  warm_brown: { base: '#a67c52', shadow: '#7d5a3a', highlight: '#c49a70', blush: '#9a6a45' },
  // Dark brown - African/African diaspora
  dark:  { base: '#8d5524', shadow: '#5e3615', highlight: '#af7441', blush: '#a36330' },
  // Deep dark - West African/Central African
  deep:  { base: '#5c3d2e', shadow: '#3d281e', highlight: '#7a5040', blush: '#6a4535' }
};

const Portrait: React.FC<Props> = ({
  archetype,
  emotion = 'neutral',
  className = "",
  size = 'md',
  onClick,
  hatOff = false,
  pinceNez = false,
  speakingFrame = 0,
  skinTone: skinToneOverride,
  hairColor: hairColorOverride,
  clothingColor: clothingColorOverride,
  secondaryColor: secondaryColorOverride
}) => {
  // Fallback to gentleman if archetype not found
  const config = CONFIGS[archetype] || CONFIGS['gentleman'];

  // Use overrides if provided, otherwise fall back to archetype defaults
  const effectiveSkinTone = skinToneOverride || config.skin;
  const effectiveHairColor = hairColorOverride || config.hairColor;
  const effectiveClothingColor = clothingColorOverride || config.clothingColor;
  const effectiveSecondaryColor = secondaryColorOverride || config.clothingColor;

  const skin = SKIN_COLORS[effectiveSkinTone];
  const age = config.age || 'middle';

  // Create a modified config with overridden colors for use in rendering
  const effectiveConfig = {
    ...config,
    skin: effectiveSkinTone,
    hairColor: effectiveHairColor,
    clothingColor: effectiveClothingColor
  };

  // Determine if hat should be shown
  const showHat = !hatOff && config.hat !== 'none';

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-28 h-28',
    lg: 'w-64 h-64'
  };

  // --- Animation CSS ---
  const styles = `
    @keyframes blink {
      0%, 96%, 100% { transform: scaleY(1); }
      97% { transform: scaleY(0.1); }
    }
    @keyframes breathe {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-0.5px) scale(1.005); }
    }
    @keyframes smokeFlow {
      0% { opacity: 0; transform: translate(0,0) scale(0.5); }
      30% { opacity: 0.6; }
      100% { opacity: 0; transform: translate(-8px,-25px) scale(2.5); }
    }
    @keyframes ember {
      0%, 100% { fill: #ff4500; fill-opacity: 0.6; }
      50% { fill: #ff8c00; fill-opacity: 1; }
    }
    @keyframes eyeShift {
      0%, 85%, 100% { transform: translateX(0); }
      88% { transform: translateX(-1.5px); }
      92% { transform: translateX(-1.5px); }
      95% { transform: translateX(1px); }
      98% { transform: translateX(1px); }
    }
    .eye-lids { animation: blink 5s infinite; transform-origin: center; }
    .eye-pupils { animation: eyeShift 8s ease-in-out infinite; }
    .torso-anim { animation: breathe 6s ease-in-out infinite; transform-origin: bottom center; }
    .smoke-particle { animation: smokeFlow 4s ease-out infinite; }
    .ember-glow { animation: ember 2s ease-in-out infinite; }
  `;

  // --- Emotion Transforms ---
  const getBrowPath = (side: 'L' | 'R') => {
    // Base Brow shapes
    const y = 38;
    const xStart = side === 'L' ? 28 : 58;
    const xEnd = side === 'L' ? 44 : 74;
    const cp1x = side === 'L' ? 36 : 66;
    let cp1y = 36; // Neutral arch

    // Adjust Control Point Y based on emotion
    if (emotion === 'angry') cp1y = 42; // Furrowed
    if (emotion === 'suspicious' && side === 'L') cp1y = 40; // Raised one
    if (emotion === 'suspicious' && side === 'R') cp1y = 35;
    if (emotion === 'afraid') cp1y = 30; // Raised high
    if (emotion === 'happy' || emotion === 'speaking') cp1y = 35; // Relaxed
    if (emotion === 'injured') cp1y = 40; // Pained
    if (emotion === 'panicked') cp1y = 28; // Very raised - distress
    if (emotion === 'worried') cp1y = 32; // Slightly raised - concern

    return `M${xStart},${y} Q${cp1x},${cp1y} ${xEnd},${y}`;
  };

  const getMouthPath = () => {
    // Mouth paths - narrower for better proportions (was x=38-62, now x=42-58)
    switch (emotion) {
      case 'happy': return "M42,78 Q50,84 58,78";
      case 'angry': return "M42,82 Q50,77 58,82";
      case 'afraid': return "M44,80 Q50,85 56,80 Q50,75 44,80";
      case 'suspicious': return "M42,80 L58,79";
      case 'dead': return "M42,80 L58,80";
      case 'injured': return "M42,82 Q50,78 58,83";
      case 'panicked': return "M43,78 Q50,86 57,78 Q50,73 43,78"; // Open mouth - gasping
      case 'worried': return "M43,81 Q50,78 57,81"; // Slight frown
      case 'speaking': return null; // Handled by SpeakingMouth component
      default: return "M42,80 Q50,82 58,80"; // Neutral
    }
  };

  // Speaking mouth component with teeth and animated open/close
  const SpeakingMouth = () => {
    // Three frames: closed, half-open, wide open with teeth
    const frame = speakingFrame % 3;

    if (frame === 0) {
      // Closed/nearly closed - just lips
      return (
        <g>
          <path d="M44,80 Q50,82 56,80" fill="none" stroke="#8a5a44" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    } else if (frame === 1) {
      // Half open - slight opening with hint of teeth
      return (
        <g>
          {/* Mouth opening - dark interior */}
          <ellipse cx="50" cy="81" rx="5" ry="3" fill="#2d1810" />
          {/* Upper teeth - white row */}
          <path d="M46,79 L54,79 L54,80.5 L46,80.5 Z" fill="#f5f5f0" />
          {/* Upper lip */}
          <path d="M44,78 Q50,76 56,78" fill="none" stroke="#c4877a" strokeWidth="1.5" strokeLinecap="round" />
          {/* Lower lip */}
          <path d="M45,84 Q50,85 55,84" fill="none" stroke="#b0706a" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    } else {
      // Wide open - full mouth with teeth showing
      return (
        <g>
          {/* Mouth opening - dark interior */}
          <ellipse cx="50" cy="82" rx="7" ry="5" fill="#1a0f0a" />
          {/* Tongue hint */}
          <ellipse cx="50" cy="85" rx="4" ry="2" fill="#c45c5c" />
          {/* Upper teeth - white row with individual tooth lines */}
          <path d="M44,78 L56,78 L56,81 L44,81 Z" fill="#f8f8f5" />
          <path d="M46,78 L46,81 M48,78 L48,81 M50,78 L50,81 M52,78 L52,81 M54,78 L54,81" stroke="#e0e0d8" strokeWidth="0.3" />
          {/* Lower teeth - smaller */}
          <path d="M46,84 L54,84 L54,86 L46,86 Z" fill="#f0f0eb" />
          {/* Upper lip */}
          <path d="M43,77 Q50,74 57,77" fill="none" stroke="#c4877a" strokeWidth="2" strokeLinecap="round" />
          {/* Lower lip */}
          <path d="M44,87 Q50,90 56,87" fill="none" stroke="#b0706a" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    }
  };

  // --- Sub-Components ---

  const Defs = () => (
    <defs>
      <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="20%" stopColor={skin.base} />
        <stop offset="100%" stopColor={skin.shadow} />
      </linearGradient>
      <linearGradient id="noseHighlight" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={skin.highlight} stopOpacity="0.8" />
        <stop offset="100%" stopColor={skin.base} stopOpacity="0" />
      </linearGradient>
      <radialGradient id="pearlGrad" cx="0.3" cy="0.3" r="0.7">
        <stop offset="0%" stopColor="#fff" />
        <stop offset="100%" stopColor="#ccc" />
      </radialGradient>
      <radialGradient id="hairShine" cx="0.5" cy="0.2" r="0.5">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
        <stop offset="100%" stopColor={effectiveConfig.hairColor} stopOpacity="0" />
      </radialGradient>
      <filter id="fabricTexture">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.1 0" in="noise" result="coloredNoise"/>
        <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite"/>
        <feBlend mode="multiply" in="composite" in2="SourceGraphic"/>
      </filter>
      <filter id="sequins">
        <feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="2" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
        </feComponentTransfer>
        <feSpecularLighting surfaceScale="2" specularConstant="1" specularExponent="20" lightingColor="#D4AF37">
             <fePointLight x="50" y="-50" z="100" />
        </feSpecularLighting>
        <feComposite in2="SourceAlpha" operator="in" />
        <feComposite in2="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
      </filter>
    </defs>
  );

  const Hair = ({ back = false }) => {
    const fill = effectiveConfig.hairColor;
    // Gray hair variants use gray color
    const isGrayHair = config.hairStyle === 'gray_slick' || config.hairStyle === 'gray_short';
    const actualFill = isGrayHair ? '#9a9a9a' : fill;

    if (back) {
      if (config.hairStyle === 'bob') return <path d="M20,30 C20,0 80,0 80,30 L85,70 L72,70 L72,50 L28,50 L28,70 L15,70 Z" fill={actualFill} />;
      if (config.hairStyle === 'finger_waves') return <path d="M15,40 C15,10 85,10 85,40 C88,60 80,75 70,75 C65,75 65,60 65,50 L35,50 C35,60 35,75 30,75 C20,75 12,60 15,40 Z" fill={actualFill} />;
      if (config.hairStyle === 'wavy') return <path d="M15,40 C15,0 85,0 85,40 L90,85 L75,85 L70,50 L30,50 L25,85 L10,85 Z" fill={actualFill} />;
      if (config.hairStyle === 'curly' || config.hairStyle === 'coily') return <path d="M15,35 C15,5 85,5 85,35 L88,75 L75,75 L72,50 L28,50 L25,75 L12,75 Z" fill={actualFill} />;
      if (config.hairStyle === 'updo') return <path d="M25,25 C25,5 75,5 75,25 L78,40 L22,40 Z" fill={actualFill} />;
      return null;
    }
    // Front Hair
    return (
      <g>
        {config.hairStyle === 'slick' && <path d="M25,45 C22,20 78,20 75,45 C75,25 60,12 40,12 C25,12 25,30 25,45 Z" fill={actualFill} />}
        {config.hairStyle === 'gray_slick' && <path d="M25,45 C22,20 78,20 75,45 C75,25 60,12 40,12 C25,12 25,30 25,45 Z" fill={actualFill} />}
        {config.hairStyle === 'short' && <path d="M25,45 C25,15 75,15 75,45 C75,25 60,10 40,10 C20,10 25,30 25,45 Z" fill={actualFill} />}
        {config.hairStyle === 'gray_short' && <path d="M25,45 C25,15 75,15 75,45 C75,25 60,10 40,10 C20,10 25,30 25,45 Z" fill={actualFill} />}
        {config.hairStyle === 'finger_waves' && (
           <g>
             <path d="M20,45 C20,20 80,20 80,45 C80,25 60,12 50,12 C30,12 20,25 20,45" fill={actualFill} />
             <path d="M20,45 Q15,55 22,60 Q28,55 22,45" fill={actualFill} /> {/* Left Wave */}
             <path d="M80,45 Q85,55 78,60 Q72,55 78,45" fill={actualFill} /> {/* Right Wave */}
             <ellipse cx="50" cy="25" rx="20" ry="10" fill="url(#hairShine)" />
           </g>
        )}
         {config.hairStyle === 'bob' && (
           <g>
             <path d="M22,40 C22,20 78,20 78,40 C78,25 50,15 50,15 C50,15 22,25 22,40" fill={actualFill} />
             <path d="M22,40 L22,60 C25,55 28,55 28,50" fill={actualFill} />
             <path d="M78,40 L78,60 C75,55 72,55 72,50" fill={actualFill} />
           </g>
        )}
        {/* Curly hair - textured with many small curls */}
        {config.hairStyle === 'curly' && (
           <g>
             <path d="M22,40 C22,15 78,15 78,40 L78,55 L22,55 Z" fill={actualFill} />
             {/* Curl texture */}
             <circle cx="30" cy="25" r="6" fill={actualFill} />
             <circle cx="42" cy="20" r="7" fill={actualFill} />
             <circle cx="55" cy="18" r="8" fill={actualFill} />
             <circle cx="68" cy="22" r="6" fill={actualFill} />
             <circle cx="25" cy="35" r="5" fill={actualFill} />
             <circle cx="75" cy="35" r="5" fill={actualFill} />
             <circle cx="35" cy="30" r="4" fill={actualFill} />
             <circle cx="65" cy="28" r="5" fill={actualFill} />
           </g>
        )}
        {/* Coily/Afro-textured hair */}
        {config.hairStyle === 'coily' && (
           <g>
             <path d="M18,40 C18,10 82,10 82,40 L82,50 L18,50 Z" fill={actualFill} />
             {/* Dense coil texture */}
             <circle cx="25" cy="20" r="8" fill={actualFill} />
             <circle cx="40" cy="15" r="9" fill={actualFill} />
             <circle cx="55" cy="12" r="10" fill={actualFill} />
             <circle cx="72" cy="16" r="8" fill={actualFill} />
             <circle cx="20" cy="32" r="7" fill={actualFill} />
             <circle cx="80" cy="32" r="7" fill={actualFill} />
             <circle cx="33" cy="25" r="6" fill={actualFill} />
             <circle cx="67" cy="23" r="7" fill={actualFill} />
             <circle cx="50" cy="8" r="8" fill={actualFill} />
             {/* Subtle highlights */}
             <ellipse cx="45" cy="18" rx="8" ry="5" fill={skin.highlight} opacity="0.15" />
           </g>
        )}
        {/* Victorian updo for women */}
        {config.hairStyle === 'updo' && (
           <g>
             {/* Base hair framing face */}
             <path d="M25,40 C25,25 35,20 50,20 C65,20 75,25 75,40" fill={actualFill} />
             {/* Swept up sides */}
             <path d="M25,40 Q20,30 25,20 Q35,15 50,15 Q65,15 75,20 Q80,30 75,40" fill={actualFill} />
             {/* Bun on top */}
             <ellipse cx="50" cy="8" rx="18" ry="12" fill={actualFill} />
             {/* Bun detail */}
             <ellipse cx="50" cy="6" rx="12" ry="8" fill={actualFill} stroke={skin.shadow} strokeWidth="0.5" opacity="0.8" />
             {/* Hair shine */}
             <ellipse cx="45" cy="4" rx="6" ry="4" fill="url(#hairShine)" />
           </g>
        )}
         {config.hairStyle === 'bald' && (
           <g>
             {/* Bald dome - skin showing through on top */}
             <ellipse cx="50" cy="18" rx="22" ry="12" fill={skin.base} />
             {/* Subtle shine on bald head */}
             <ellipse cx="45" cy="14" rx="10" ry="6" fill={skin.highlight} opacity="0.4" />
             {/* Hair fringe on sides - male pattern baldness, hair extends up higher */}
             {/* Left side - hair goes up temple area */}
             <path d="M20,30 Q16,35 18,50 Q20,55 24,58 Q26,50 24,40 Q22,35 20,30" fill={effectiveConfig.hairColor} />
             <path d="M24,28 Q22,32 23,42" stroke={effectiveConfig.hairColor} strokeWidth="3" fill="none" opacity="0.7" />
             {/* Right side - hair goes up temple area */}
             <path d="M80,30 Q84,35 82,50 Q80,55 76,58 Q74,50 76,40 Q78,35 80,30" fill={effectiveConfig.hairColor} />
             <path d="M76,28 Q78,32 77,42" stroke={effectiveConfig.hairColor} strokeWidth="3" fill="none" opacity="0.7" />
             {/* Hair at back of head (visible above ears) - thicker */}
             <path d="M26,32 Q22,38 23,52" stroke={effectiveConfig.hairColor} strokeWidth="5" fill="none" />
             <path d="M74,32 Q78,38 77,52" stroke={effectiveConfig.hairColor} strokeWidth="5" fill="none" />
           </g>
         )}
      </g>
    );
  };

  const Clothing = () => {
    return (
      <g className="torso-anim">
        {/* Base Shape */}
        <path d="M10,100 Q50,90 90,100 L90,130 L10,130 Z" fill={effectiveConfig.clothingColor} stroke="#000" strokeWidth="0.5" />

        {config.clothes === 'dress' && (
          <g>
             <rect x="10" y="100" width="80" height="30" fill="url(#sequins)" opacity="0.5" style={{mixBlendMode: 'overlay'}} />
             {/* Neckline */}
             <path d="M30,95 Q50,115 70,95" fill="none" stroke={config.skin === 'pale' ? '#e0e0e0' : '#d4af37'} strokeWidth="0.5" />
          </g>
        )}

        {config.clothes === 'suit' && archetype !== 'henry_james' && (
          <g>
            <path d="M38,95 L50,110 L62,95 L50,90 Z" fill="#fff" /> {/* Shirt */}
            {/* Tie color varies by archetype */}
            <path d="M47,95 L53,95 L51,110 L49,110 Z" fill={archetype === 'gentleman' ? '#4a5f4a' : archetype === 'pharmacist' ? '#1a3a5f' : '#600'} />
            {/* Lapels - slightly lighter than main clothing */}
            <path d="M30,95 L50,125 L35,130 Z" fill={effectiveConfig.clothingColor} stroke="#000" strokeWidth="0.5" opacity="0.9" />
            <path d="M70,95 L50,125 L65,130 Z" fill={effectiveConfig.clothingColor} stroke="#000" strokeWidth="0.5" opacity="0.9" />
          </g>
        )}
        {/* Edwardian suit for Henry James - high collar, cravat, morning coat style */}
        {config.clothes === 'suit' && archetype === 'henry_james' && (
          <g>
            {/* High starched collar - Edwardian style */}
            <path d="M35,95 L40,98 L50,95 L60,98 L65,95 L62,88 L50,90 L38,88 Z" fill="#f5f5f0" stroke="#ddd" strokeWidth="0.5" />
            {/* Wing collar points */}
            <path d="M38,90 L42,95" stroke="#ccc" strokeWidth="0.5" />
            <path d="M62,90 L58,95" stroke="#ccc" strokeWidth="0.5" />
            {/* Cravat/Ascot tie - dark burgundy */}
            <path d="M44,95 L50,105 L56,95 L53,95 L50,100 L47,95 Z" fill="#3d1a1a" />
            {/* Cravat knot */}
            <ellipse cx="50" cy="96" rx="4" ry="2" fill="#2d1515" />
            {/* Cravat pin */}
            <circle cx="50" cy="99" r="1.5" fill="#d4af37" />
            {/* Morning coat lapels - peaked, formal */}
            <path d="M25,95 L48,120 L35,130 L10,130 L10,100 Z" fill={effectiveConfig.clothingColor} stroke="#000" strokeWidth="0.5" />
            <path d="M75,95 L52,120 L65,130 L90,130 L90,100 Z" fill={effectiveConfig.clothingColor} stroke="#000" strokeWidth="0.5" />
            {/* Lapel facing - silk sheen */}
            <path d="M28,97 L45,115" stroke="#333" strokeWidth="0.5" opacity="0.3" />
            <path d="M72,97 L55,115" stroke="#333" strokeWidth="0.5" opacity="0.3" />
            {/* Waistcoat visible beneath */}
            <path d="M42,105 L50,125 L58,105" fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="0.5" />
            {/* Waistcoat buttons */}
            <circle cx="50" cy="110" r="1" fill="#d4af37" />
            <circle cx="50" cy="116" r="1" fill="#d4af37" />
            <circle cx="50" cy="122" r="1" fill="#d4af37" />
          </g>
        )}

        {config.clothes === 'uniform' && (
          <g>
            <path d="M40,95 L60,95 L60,110 L40,110 Z" fill="#1e293b" />
            <path d="M50,95 L50,130" stroke="#ffd700" strokeWidth="0.5" />
            <circle cx="44" cy="105" r="2" fill="#ffd700" />
            <circle cx="56" cy="105" r="2" fill="#ffd700" />
          </g>
        )}

         {config.clothes === 'vest' && (
           <g>
             <path d="M40,95 L60,95 L60,105 L40,105" fill="#fff" />
             <path d="M30,95 L50,130 L20,130" fill={effectiveConfig.clothingColor} />
             <path d="M70,95 L50,130 L80,130" fill={effectiveConfig.clothingColor} />
             {/* Vest buttons */}
             <circle cx="48" cy="100" r="1.5" fill="#8B7355" />
             <circle cx="52" cy="100" r="1.5" fill="#8B7355" />
             <circle cx="50" cy="110" r="1.5" fill="#8B7355" />
           </g>
         )}
         {config.clothes === 'shirt' && (
           <g>
             {/* Sailor collar */}
             <path d="M30,95 L50,110 L70,95" fill="#fff" stroke={effectiveConfig.clothingColor} strokeWidth="2" />
             <path d="M25,100 L50,120 L75,100" fill="none" stroke="#3a7bc8" strokeWidth="3" />
             {/* Horizontal stripes */}
             <line x1="15" y1="110" x2="85" y2="110" stroke="#3a7bc8" strokeWidth="2" opacity="0.6" />
             <line x1="15" y1="118" x2="85" y2="118" stroke="#3a7bc8" strokeWidth="2" opacity="0.6" />
           </g>
         )}
         {/* Robe/Kaftan - flowing traditional garment */}
         {config.clothes === 'robe' && (
           <g>
             {/* Base robe shape - looser, flowing */}
             <path d="M5,95 Q50,88 95,95 L95,130 L5,130 Z" fill={effectiveConfig.clothingColor} stroke="#000" strokeWidth="0.5" />
             {/* V-neck opening */}
             <path d="M40,95 L50,115 L60,95" fill="none" stroke={skin.base} strokeWidth="3" />
             {/* Decorative trim/embroidery on neckline */}
             <path d="M38,95 L50,118 L62,95" fill="none" stroke="#d4af37" strokeWidth="1" />
             {/* Central embroidery line */}
             <path d="M50,115 L50,130" stroke="#d4af37" strokeWidth="0.8" strokeDasharray="2,2" />
             {/* Fabric folds */}
             <path d="M25,100 Q30,115 25,130" stroke={effectiveConfig.clothingColor} strokeWidth="0.5" fill="none" opacity="0.5" />
             <path d="M75,100 Q70,115 75,130" stroke={effectiveConfig.clothingColor} strokeWidth="0.5" fill="none" opacity="0.5" />
           </g>
         )}
         {/* Military uniform - formal with medals and epaulettes */}
         {config.clothes === 'military' && (
           <g>
             {/* Base jacket */}
             <path d="M10,100 Q50,90 90,100 L90,130 L10,130 Z" fill={effectiveConfig.clothingColor} stroke="#000" strokeWidth="0.5" />
             {/* High collar */}
             <path d="M35,95 L50,98 L65,95 L62,90 L50,93 L38,90 Z" fill={effectiveConfig.clothingColor} stroke="#d4af37" strokeWidth="0.5" />
             {/* Collar trim */}
             <path d="M38,92 L50,95 L62,92" fill="none" stroke="#d4af37" strokeWidth="1" />
             {/* Double-breasted buttons */}
             <circle cx="40" cy="105" r="1.5" fill="#d4af37" />
             <circle cx="60" cy="105" r="1.5" fill="#d4af37" />
             <circle cx="40" cy="112" r="1.5" fill="#d4af37" />
             <circle cx="60" cy="112" r="1.5" fill="#d4af37" />
             <circle cx="40" cy="119" r="1.5" fill="#d4af37" />
             <circle cx="60" cy="119" r="1.5" fill="#d4af37" />
             {/* Epaulettes */}
             <ellipse cx="18" cy="100" rx="6" ry="3" fill="#d4af37" stroke="#b8860b" strokeWidth="0.5" />
             <ellipse cx="82" cy="100" rx="6" ry="3" fill="#d4af37" stroke="#b8860b" strokeWidth="0.5" />
             {/* Medal ribbons */}
             <rect x="22" cy="105" width="4" height="6" fill="#c41e3a" />
             <rect x="27" cy="105" width="4" height="6" fill="#1e3a5f" />
             <rect x="32" cy="105" width="4" height="6" fill="#2a5a2a" />
           </g>
         )}
         {/* Kimono - Japanese traditional garment */}
         {config.clothes === 'kimono' && (
           <g>
             {/* Base kimono - wrapped style */}
             <path d="M5,95 Q50,88 95,95 L95,130 L5,130 Z" fill={effectiveConfig.clothingColor} stroke="#000" strokeWidth="0.5" />
             {/* Left-over-right wrap (correct for living persons) */}
             <path d="M35,95 L50,130" fill="none" stroke={skin.base} strokeWidth="2" />
             <path d="M65,95 L45,130" fill="none" stroke="#000" strokeWidth="0.5" />
             {/* Obi (sash) */}
             <rect x="20" y="115" width="60" height="10" fill="#d4af37" />
             <rect x="45" y="113" width="10" height="14" fill="#b8860b" /> {/* Obi knot */}
             {/* Decorative pattern */}
             <circle cx="25" cy="105" r="3" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.5" />
             <circle cx="75" cy="105" r="3" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.5" />
             {/* Collar showing */}
             <path d="M40,95 L50,110 L60,95" fill="#f5f5f5" stroke="#ddd" strokeWidth="0.5" />
           </g>
         )}
      </g>
    );
  };

  const Accessories = () => (
    <g className="torso-anim">
       {config.accessory === 'pearls' && (
         <g>
           {/* Strand 1 */}
           <circle cx="38" cy="98" r="2.5" fill="url(#pearlGrad)" />
           <circle cx="43" cy="102" r="2.5" fill="url(#pearlGrad)" />
           <circle cx="48" cy="104" r="2.5" fill="url(#pearlGrad)" />
           <circle cx="53" cy="104" r="2.5" fill="url(#pearlGrad)" />
           <circle cx="58" cy="102" r="2.5" fill="url(#pearlGrad)" />
           <circle cx="63" cy="98" r="2.5" fill="url(#pearlGrad)" />

           {/* Strand 2 (Lower) */}
           <circle cx="40" cy="108" r="2.5" fill="url(#pearlGrad)" />
           <circle cx="46" cy="112" r="2.5" fill="url(#pearlGrad)" />
           <circle cx="50" cy="113" r="2.5" fill="url(#pearlGrad)" />
           <circle cx="55" cy="112" r="2.5" fill="url(#pearlGrad)" />
           <circle cx="61" cy="108" r="2.5" fill="url(#pearlGrad)" />
         </g>
       )}
       {config.accessory === 'scarf' && (
         <path d="M35,90 Q50,110 65,90 C75,90 80,100 75,120 C70,100 65,100 60,95" fill="none" stroke="#800020" strokeWidth="8" strokeLinecap="round" />
       )}
       {config.accessory === 'earrings' && (
         <g>
           {/* Left earring */}
           <circle cx="24" cy="55" r="2.5" fill="#D4AF37" stroke="#B8860B" strokeWidth="0.5" />
           <circle cx="24" cy="55" r="1" fill="#FFF" opacity="0.6" />
           {/* Right earring */}
           <circle cx="76" cy="55" r="2.5" fill="#D4AF37" stroke="#B8860B" strokeWidth="0.5" />
           <circle cx="76" cy="55" r="1" fill="#FFF" opacity="0.6" />
         </g>
       )}
    </g>
  );

  const Face = () => {
    // Special wider face shape for Henry James - he had a notably broad, substantial face
    const isHenryJames = archetype === 'henry_james';

    const getHeadPath = () => {
      if (isHenryJames) {
        // Wider, more substantial face - Henry James was known for his broad, imposing features
        return "M24,35 C24,8 76,8 76,35 L76,58 C76,82 62,95 50,95 C38,95 24,82 24,58 Z";
      }
      // Male face - wide oval shape
      // Female face - slightly softer, rounder but NOT too narrow (was converging to point)
      return config.gender === 'm'
        ? "M28,35 C28,10 72,10 72,35 L72,55 C72,78 60,92 50,92 C40,92 28,78 28,55 Z"
        : "M28,35 C28,12 72,12 72,35 L72,55 C72,78 60,90 50,90 C40,90 28,78 28,55 Z";
    };

    return (
    <g>
       {/* Neck - connects face to clothing */}
       <rect x="40" y="85" width="20" height="18" fill={skin.base} />
       {/* Neck shadow for depth */}
       <path d="M40,90 L40,100 L60,100 L60,90" fill={skin.shadow} opacity="0.3" />

       {/* Head Shape */}
       <path d={getHeadPath()} fill="url(#skinGrad)" />

       {/* Ears - positioned wider for Henry James */}
       <path d={isHenryJames ? "M24,50 Q18,50 18,57 Q18,64 24,62" : "M28,48 Q22,48 22,55 Q22,62 28,60"} fill={skin.shadow} />
       <path d={isHenryJames ? "M76,50 Q82,50 82,57 Q82,64 76,62" : "M72,48 Q78,48 78,55 Q78,62 72,60"} fill={skin.shadow} />

       {/* Stubble */}
       {config.facialHair === 'stubble' && (
          <path d="M30,65 C30,85 40,92 50,92 C60,92 70,85 70,65 L70,55 L72,55 L72,60 C72,85 60,95 50,95 C40,95 28,85 28,60 L28,55 L30,55 Z" fill="#000" opacity="0.07" />
       )}

       {/* Blush */}
       <ellipse cx="36" cy="65" rx="6" ry="4" fill={skin.blush} opacity="0.4" filter="blur(2px)" />
       <ellipse cx="64" cy="65" rx="6" ry="4" fill={skin.blush} opacity="0.4" filter="blur(2px)" />

       {/* Nose */}
       <g transform="translate(0,2)">
         {/* Shadow Side */}
         <path d="M48,45 Q46,60 44,70 L50,74 L56,70 Q54,60 52,45" fill={skin.shadow} opacity="0.5" />
         {/* Highlight Side */}
         <path d="M49,48 Q48,60 48,68" stroke="url(#noseHighlight)" strokeWidth="2" fill="none" />
         {/* Nostrils */}
         <path d="M46,70 Q50,75 54,70" fill="none" stroke={skin.shadow} strokeWidth="1.5" strokeLinecap="round" />
       </g>

       {/* Mouth - hidden for full_beard, positioned higher and smaller for henry_goatee */}
       {config.facialHair === 'full_beard' ? null : config.facialHair === 'henry_goatee' ? (
         <g transform="translate(0, -2)">
            {/* Smaller, more refined mouth for Henry James */}
            {emotion === 'speaking' ? (
              <SpeakingMouth />
            ) : (
              <>
                <path d="M44,80 Q50,80 56,80" fill="none" stroke="#8a5a44" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M44,78 Q50,80 58,78" fill="none" stroke="#d7ccc8" strokeWidth="0.5" strokeLinecap="round" />
              </>
            )}
         </g>
       ) : (
         <g transform="translate(0, 2)">
            {/* Mouth - reduced size, proportional for both genders */}
            {emotion === 'speaking' ? (
              <SpeakingMouth />
            ) : (
              <>
                <path d={getMouthPath() || ''} fill="none" stroke="#8a5a44" strokeWidth={config.gender === 'f' ? 2.5 : 2} strokeLinecap="round" />
                <path d={getMouthPath() || ''} fill="none" stroke={config.gender === 'f' ? "#b71c1c" : "#d7ccc8"} strokeWidth={config.gender === 'f' ? 1.2 : 0.5} strokeLinecap="round" />
              </>
            )}
         </g>
       )}

       {/* Facial Hair */}
       {config.facialHair === 'mustache' && (
          <path d="M38,76 Q50,70 62,76 Q60,80 50,78 Q40,80 38,76" fill={effectiveConfig.hairColor} />
       )}
       {config.facialHair === 'goatee' && (
          <g>
            {/* Mustache part */}
            <path d="M38,76 Q50,70 62,76 Q60,79 50,77 Q40,79 38,76" fill={effectiveConfig.hairColor} />
            {/* Goatee part - small pointed beard on chin */}
            <path d="M45,82 Q50,88 55,82 L52,85 Q50,87 48,85 Z" fill={effectiveConfig.hairColor} />
            <path d="M47,83 Q50,85 53,83" stroke={effectiveConfig.hairColor} strokeWidth="1" fill="none" />
          </g>
       )}
       {config.facialHair === 'henry_goatee' && (
          <g>
            {/* Neat mustache - Edwardian style, refined */}
            <path d="M36,74 Q42,70 50,73 Q58,70 64,74 Q61,78 50,76 Q39,78 36,74" fill={effectiveConfig.hairColor} />
            {/* Mustache texture */}
            <path d="M38,75 Q44,71 50,73" stroke={effectiveConfig.hairColor} strokeWidth="1.5" fill="none" />
            <path d="M62,75 Q56,71 50,73" stroke={effectiveConfig.hairColor} strokeWidth="1.5" fill="none" />
            {/* Wider goatee - covering chin area */}
            <path d="M38,80 Q50,100 62,80 Q60,98 50,98 Q40,98 38,84" fill={effectiveConfig.hairColor} />
            {/* Goatee texture lines */}
            <path d="M42,85 Q50,94 58,85" stroke={effectiveConfig.hairColor} strokeWidth="1" fill="none" opacity="0.7" />
            <path d="M44,88 Q50,95 56,88" stroke={effectiveConfig.hairColor} strokeWidth="0.8" fill="none" opacity="0.7" />
            {/* Soul patch connecting mustache to beard */}
            <path d="M48,82 L48,90 M50,82 L50,90 M52,82 L52,90" stroke={effectiveConfig.hairColor} strokeWidth="1.8" opacity="0.6" />
          </g>
       )}
       {config.facialHair === 'full_beard' && (
          <g>
            {/* Full bushy mustache - covers mouth entirely */}
            <path d="M32,72 Q42,65 50,70 Q58,65 68,72 Q65,82 50,80 Q35,82 32,72" fill={effectiveConfig.hairColor} />
            {/* Mustache texture */}
            <path d="M35,74 Q43,69 50,71" stroke={effectiveConfig.hairColor} strokeWidth="1.5" fill="none" />
            <path d="M65,74 Q57,69 50,71" stroke={effectiveConfig.hairColor} strokeWidth="1.5" fill="none" />
            {/* Full beard covering jaw and chin - William James style */}
            <path d="M30,70 Q28,80 32,90 Q40,98 50,100 Q60,98 68,90 Q72,80 70,70 L65,78 Q60,88 50,90 Q40,88 35,78 Z" fill={effectiveConfig.hairColor} />
            {/* Beard connects to sideburns */}
            <path d="M28,55 L30,70" stroke={effectiveConfig.hairColor} strokeWidth="4" strokeLinecap="round" />
            <path d="M72,55 L70,70" stroke={effectiveConfig.hairColor} strokeWidth="4" strokeLinecap="round" />
            {/* Beard texture lines */}
            <path d="M35,82 Q40,90 45,84" stroke={effectiveConfig.hairColor} strokeWidth="0.8" fill="none" opacity="0.5" />
            <path d="M65,82 Q60,90 55,84" stroke={effectiveConfig.hairColor} strokeWidth="0.8" fill="none" opacity="0.5" />
            <path d="M45,87 Q50,97 55,87" stroke={effectiveConfig.hairColor} strokeWidth="0.8" fill="none" opacity="0.5" />
            <path d="M48,90 Q50,98 52,90" stroke={effectiveConfig.hairColor} strokeWidth="0.6" fill="none" opacity="0.4" />
          </g>
       )}
       {/* Mutton chops - Victorian sideburns without chin connection */}
       {config.facialHair === 'mutton_chops' && (
          <g>
            {/* Left mutton chop - thick sideburn extending down jaw */}
            <path d="M24,50 Q20,55 22,70 Q24,80 30,85 Q35,82 32,70 Q30,60 28,50" fill={effectiveConfig.hairColor} />
            <path d="M26,55 Q24,65 28,75" stroke={effectiveConfig.hairColor} strokeWidth="1" fill="none" opacity="0.5" />
            {/* Right mutton chop */}
            <path d="M76,50 Q80,55 78,70 Q76,80 70,85 Q65,82 68,70 Q70,60 72,50" fill={effectiveConfig.hairColor} />
            <path d="M74,55 Q76,65 72,75" stroke={effectiveConfig.hairColor} strokeWidth="1" fill="none" opacity="0.5" />
            {/* Small mustache */}
            <path d="M42,76 Q50,73 58,76 Q56,78 50,77 Q44,78 42,76" fill={effectiveConfig.hairColor} />
          </g>
       )}
       {/* Imperial mustache - long, waxed, upturned ends */}
       {config.facialHair === 'imperial' && (
          <g>
            {/* Main mustache body */}
            <path d="M35,75 Q42,70 50,74 Q58,70 65,75 Q62,78 50,76 Q38,78 35,75" fill={effectiveConfig.hairColor} />
            {/* Waxed upturned ends - characteristic of imperial style */}
            <path d="M35,75 Q30,72 28,68" stroke={effectiveConfig.hairColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M65,75 Q70,72 72,68" stroke={effectiveConfig.hairColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Pointed tips */}
            <circle cx="28" cy="68" r="1.5" fill={effectiveConfig.hairColor} />
            <circle cx="72" cy="68" r="1.5" fill={effectiveConfig.hairColor} />
            {/* Small pointed goatee - soul patch style */}
            <path d="M48,82 L50,90 L52,82" fill={effectiveConfig.hairColor} />
          </g>
       )}

       {/* Eyes */}
       <g transform="translate(0, 2)">
          {/* Whites */}
          <path d="M30,48 Q36,42 42,48 Q36,54 30,48 Z" fill="#fff" />
          <path d="M58,48 Q64,42 70,48 Q64,54 58,48 Z" fill="#fff" />

          {/* Iris/Pupil - with shifting animation */}
          <g className="eye-pupils">
             <circle cx="36" cy="48" r="3" fill={config.eyeColor} />
             <circle cx="36" cy="48" r="1.5" fill="#000" />
             <circle cx="37" cy="47" r="0.8" fill="#fff" opacity="0.8" />

             <circle cx="64" cy="48" r="3" fill={config.eyeColor} />
             <circle cx="64" cy="48" r="1.5" fill="#000" />
             <circle cx="65" cy="47" r="0.8" fill="#fff" opacity="0.8" />
          </g>

          {/* Lash Line */}
          <path d="M29,48 Q36,41 43,49" fill="none" stroke="#222" strokeWidth={config.gender === 'f' ? 2 : 1} />
          <path d="M57,48 Q64,41 71,49" fill="none" stroke="#222" strokeWidth={config.gender === 'f' ? 2 : 1} />

          {/* Eyelids (Animation) */}
          {emotion !== 'dead' && (
            <g className="eye-lids">
               <path d="M28,46 Q36,40 44,46 L44,40 L28,40 Z" fill={skin.shadow} />
               <path d="M56,46 Q64,40 72,46 L72,40 L56,40 Z" fill={skin.shadow} />
            </g>
          )}
       </g>

       {/* Brows */}
       <g transform="translate(0, 3)">
          <path d={getBrowPath('L')} fill="none" stroke={effectiveConfig.hairColor} strokeWidth={config.gender === 'm' ? 2.5 : 1.5} strokeLinecap="round" />
          <path d={getBrowPath('R')} fill="none" stroke={effectiveConfig.hairColor} strokeWidth={config.gender === 'm' ? 2.5 : 1.5} strokeLinecap="round" />
       </g>

       {/* Age-related features */}
       {age === 'elderly' && (
         <g opacity="0.5">
           {/* Crow's feet wrinkles */}
           <path d="M26,48 L22,46 M26,50 L22,50 M26,52 L22,54" stroke={skin.shadow} strokeWidth="0.5" fill="none" />
           <path d="M74,48 L78,46 M74,50 L78,50 M74,52 L78,54" stroke={skin.shadow} strokeWidth="0.5" fill="none" />
           {/* Forehead wrinkles */}
           <path d="M35,32 Q50,30 65,32" stroke={skin.shadow} strokeWidth="0.5" fill="none" />
           <path d="M38,35 Q50,33 62,35" stroke={skin.shadow} strokeWidth="0.5" fill="none" />
           {/* Nasolabial folds */}
           <path d="M40,65 Q38,75 42,82" stroke={skin.shadow} strokeWidth="0.7" fill="none" />
           <path d="M60,65 Q62,75 58,82" stroke={skin.shadow} strokeWidth="0.7" fill="none" />
           {/* Under-eye shadows */}
           <ellipse cx="36" cy="55" rx="5" ry="2" fill={skin.shadow} opacity="0.3" />
           <ellipse cx="64" cy="55" rx="5" ry="2" fill={skin.shadow} opacity="0.3" />
         </g>
       )}
       {age === 'middle' && (
         <g opacity="0.3">
           {/* Subtle crow's feet */}
           <path d="M26,50 L23,50" stroke={skin.shadow} strokeWidth="0.4" fill="none" />
           <path d="M74,50 L77,50" stroke={skin.shadow} strokeWidth="0.4" fill="none" />
           {/* Light nasolabial fold suggestion */}
           <path d="M42,68 Q40,75 43,80" stroke={skin.shadow} strokeWidth="0.4" fill="none" />
           <path d="M58,68 Q60,75 57,80" stroke={skin.shadow} strokeWidth="0.4" fill="none" />
         </g>
       )}

       {/* Face Accessories */}
       {config.accessory === 'glasses' && (
         <g opacity="0.8">
           <circle cx="36" cy="50" r="9" fill="rgba(255,255,255,0.1)" stroke="#D4AF37" strokeWidth="1"/>
           <circle cx="64" cy="50" r="9" fill="rgba(255,255,255,0.1)" stroke="#D4AF37" strokeWidth="1"/>
           <line x1="45" y1="50" x2="55" y2="50" stroke="#D4AF37" strokeWidth="1" />
           <path d="M30,46 L40,44" stroke="rgba(255,255,255,0.4)" strokeWidth="1" /> {/* Glare */}
         </g>
       )}
       {/* Pince-nez - clips onto nose, no earpieces */}
       {(config.accessory === 'pince_nez' || (archetype === 'henry_james' && pinceNez)) && (
         <g opacity="0.9">
           {/* Left lens - small oval */}
           <ellipse cx="38" cy="50" rx="5" ry="5.5" fill="rgba(255,255,255,0.08)" stroke="#D4AF37" strokeWidth="0.8" transform="rotate(-3 38 50)" />
           {/* Right lens */}
           <ellipse cx="62" cy="50" rx="5" ry="5.5" fill="rgba(255,255,255,0.08)" stroke="#D4AF37" strokeWidth="0.8" transform="rotate(3 62 50)" />
           {/* Bridge - spring clip that grips nose */}
           <path d="M43,50 Q50,47 57,50" fill="none" stroke="#D4AF37" strokeWidth="1" />
           {/* Lens glare */}
           <path d="M35,47 Q37,46 39,47" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" fill="none" />
           <path d="M59,47 Q61,46 63,47" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" fill="none" />
           {/* Chain attachment point */}
           <circle cx="68" cy="54" r="0.8" fill="#D4AF37" />
           <path d="M68,55 Q72,62 70,72" stroke="#D4AF37" strokeWidth="0.4" fill="none" strokeDasharray="1,1" />
         </g>
       )}
       {/* Monocle - single lens with chain */}
       {config.accessory === 'monocle' && (
         <g opacity="0.9">
           <circle cx="64" cy="50" r="10" fill="rgba(255,255,255,0.1)" stroke="#D4AF37" strokeWidth="1.5" />
           {/* Frame detail */}
           <circle cx="64" cy="50" r="8" fill="none" stroke="#B8860B" strokeWidth="0.5" />
           {/* Glare */}
           <path d="M58,46 Q62,44 66,46" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" />
           {/* Chain */}
           <path d="M74,50 Q82,60 78,90" stroke="#D4AF37" strokeWidth="0.8" fill="none" />
           {/* Chain attachment */}
           <circle cx="74" cy="50" r="1.5" fill="#D4AF37" />
         </g>
       )}
       {config.accessory === 'cigar' && (
         <g transform="translate(0, 5)">
           <line x1="55" y1="82" x2="75" y2="75" stroke="#5d4037" strokeWidth="4" />
           <circle cx="75" cy="75" r="2" className="ember-glow" />
           <g className="smoke-particle" transform="translate(75, 75)">
              <circle cx="0" cy="0" r="3" fill="#ddd" opacity="0.4" />
              <circle cx="5" cy="-5" r="4" fill="#eee" opacity="0.3" />
           </g>
         </g>
       )}
       {/* Fan accessory for ladies */}
       {config.accessory === 'fan' && (
         <g transform="translate(60, 85)">
           {/* Folded fan shape */}
           <path d="M0,0 L-15,-20 Q0,-25 15,-20 L0,0" fill="#d4af37" stroke="#b8860b" strokeWidth="0.5" />
           {/* Fan ribs */}
           <path d="M0,0 L-10,-18" stroke="#8b7355" strokeWidth="0.3" />
           <path d="M0,0 L-5,-19" stroke="#8b7355" strokeWidth="0.3" />
           <path d="M0,0 L0,-20" stroke="#8b7355" strokeWidth="0.3" />
           <path d="M0,0 L5,-19" stroke="#8b7355" strokeWidth="0.3" />
           <path d="M0,0 L10,-18" stroke="#8b7355" strokeWidth="0.3" />
           {/* Handle */}
           <rect x="-2" y="0" width="4" height="8" fill="#5d4037" rx="1" />
         </g>
       )}
    </g>
    );
  };

  const HatLayer = () => {
    // Don't render hat if hatOff is true
    if (!showHat) return null;

    return (
     <g filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.4))">
        {config.hat === 'top_hat' && (
           <g transform="translate(0, -12)">
             {/* Top hat - silk plush, tall crown */}
             {/* Brim - wider, slightly curved */}
             <ellipse cx="50" cy="38" rx="34" ry="7" fill="#1a1a1a" />
             <ellipse cx="50" cy="36" rx="30" ry="5" fill="#0a0a0a" />
             {/* Crown - tall cylinder */}
             <rect x="25" y="5" width="50" height="31" fill="#1a1a1a" />
             {/* Crown top */}
             <ellipse cx="50" cy="5" rx="25" ry="5" fill="#2a2a2a" />
             {/* Silk sheen highlight */}
             <path d="M28 5 L28 36 L35 36 L35 8" fill="#3a3a4a" opacity="0.25" />
             {/* Grosgrain ribbon band */}
             <rect x="24" y="30" width="52" height="5" fill="#5a4a3a" />
             {/* Band buckle detail */}
             <rect x="65" y="31" width="6" height="3" fill="#d4af37" opacity="0.8" />
           </g>
        )}
        {config.hat === 'fedora' && (
           <g transform="translate(0, -10)">
             <path d="M10,35 Q50,40 90,35 L92,45 L8,45 Z" fill="#1a1a1a" /> {/* Brim */}
             <path d="M25,15 L75,15 L80,35 L20,35 Z" fill="#262626" /> {/* Crown */}
             <rect x="22" y="30" width="56" height="6" fill="#000" /> {/* Band */}
           </g>
        )}
        {config.hat === 'headband' && (
           <g transform="translate(0, -2)">
             <path d="M26,35 Q50,45 74,35" fill="none" stroke="#D4AF37" strokeWidth="3" />
             {/* Feather */}
             <path d="M70,35 Q80,20 75,5 Q70,20 70,35" fill="#fff" stroke="#ddd" strokeWidth="0.5" />
             {/* Gem */}
             <circle cx="70" cy="35" r="3" fill="#00bfff" stroke="#fff" strokeWidth="0.5" />
           </g>
        )}
        {config.hat === 'cloche' && (
           <g transform="translate(0, -5)">
             <path d="M20,20 C20,0 80,0 80,20 L82,45 C82,50 18,50 18,45 Z" fill="#4a3b2a" />
             <path d="M18,40 Q50,45 82,40" fill="none" stroke="#3e2723" strokeWidth="4" />
             <circle cx="75" cy="38" r="6" fill="#D4AF37" />
           </g>
        )}
        {config.hat === 'cop' && (
           <g transform="translate(0, -8)">
              <path d="M15,30 L85,30 L88,40 L12,40 Z" fill="#0f172a" />
              <path d="M20,30 C20,10 80,10 80,30 Z" fill="#1e293b" />
              <path d="M45,15 L55,15 L55,25 L45,25 Z" fill="#ffd700" /> {/* Badge */}
           </g>
        )}
        {config.hat === 'newsboy' && (
           <g transform="translate(0, -5)">
             <path d="M15,25 C15,5 85,5 85,25 L90,32 L10,32 Z" fill="#3e2723" />
             <path d="M10,32 Q50,38 90,32" fill="none" stroke="#2d1e1a" strokeWidth="2" />
           </g>
        )}
        {config.hat === 'bowler' && (
           <g transform="translate(0, -8)">
             {/* Crown - rounded dome */}
             <path d="M22,25 C22,10 30,5 50,5 C70,5 78,10 78,25 L78,32 L22,32 Z" fill="#1a1a1a" />
             {/* Brim - curved */}
             <ellipse cx="50" cy="32" rx="32" ry="6" fill="#0f0f0f" />
             {/* Highlight on crown for roundness */}
             <ellipse cx="50" cy="15" rx="15" ry="8" fill="#333" opacity="0.3" />
             {/* Band */}
             <rect x="20" y="28" width="60" height="3" fill="#000" opacity="0.5" />
           </g>
        )}
        {/* Turban - wrapped cloth headwear */}
        {config.hat === 'turban' && (
           <g transform="translate(0, -8)">
             {/* Main turban body - layered wraps */}
             <ellipse cx="50" cy="20" rx="30" ry="20" fill="#f5f5dc" />
             {/* Wrap texture lines */}
             <path d="M25,15 Q50,5 75,15" fill="none" stroke="#e0d8c0" strokeWidth="2" />
             <path d="M22,22 Q50,10 78,22" fill="none" stroke="#e0d8c0" strokeWidth="2" />
             <path d="M24,28 Q50,18 76,28" fill="none" stroke="#e0d8c0" strokeWidth="2" />
             {/* Center jewel/brooch */}
             <circle cx="50" cy="18" r="4" fill="#c41e3a" stroke="#d4af37" strokeWidth="1" />
             <circle cx="50" cy="18" r="2" fill="#ff6b6b" opacity="0.5" />
             {/* Fabric drape on side */}
             <path d="M75,25 Q82,35 78,50" fill="#f5f5dc" stroke="#d4c9a0" strokeWidth="0.5" />
           </g>
        )}
        {/* Fez - Ottoman/North African style */}
        {config.hat === 'fez' && (
           <g transform="translate(0, -5)">
             {/* Main fez body - truncated cone */}
             <path d="M30,35 L35,8 L65,8 L70,35 Z" fill="#8b0000" />
             {/* Flat top */}
             <ellipse cx="50" cy="8" rx="15" ry="4" fill="#a00000" />
             {/* Bottom rim */}
             <ellipse cx="50" cy="35" rx="20" ry="5" fill="#700000" />
             {/* Tassel */}
             <circle cx="50" cy="6" r="2" fill="#1a1a1a" />
             <path d="M50,8 Q55,15 52,25" stroke="#1a1a1a" strokeWidth="2" fill="none" />
             {/* Tassel end - fringe */}
             <path d="M51,23 L50,30 M52,24 L53,30 M53,23 L55,29" stroke="#1a1a1a" strokeWidth="1" />
           </g>
        )}
     </g>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden border-2 border-gold-600 bg-[#e5e5e5] ${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer hover:ring-2 hover:ring-gold-400 transition-all' : ''} shadow-lg`}
    >
      <style>{styles}</style>
      {/* Background texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

      <svg viewBox="0 0 100 130" className="w-full h-full relative z-10" preserveAspectRatio="xMidYMid slice">
        <Defs />
        <Hair back={true} />
        <Clothing />
        <Accessories />
        <Face />
        <Hair back={false} />
        <HatLayer />

        {/* Overlays */}
        {emotion === 'dead' && <rect width="100" height="130" fill="#000" opacity="0.5" />}
        {emotion === 'injured' && <circle cx="30" cy="40" r="8" fill="#500" opacity="0.3" filter="blur(2px)" />}

        {/* Sweat droplets for panicked/worried states */}
        {(emotion === 'panicked' || emotion === 'worried' || emotion === 'afraid') && (
          <g>
            {/* Forehead sweat */}
            <ellipse cx="30" cy="35" rx="2" ry="3" fill="#a8d8ea" opacity="0.7">
              <animate attributeName="cy" values="35;45;35" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite" />
            </ellipse>
            {emotion === 'panicked' && (
              <>
                <ellipse cx="70" cy="33" rx="2" ry="3" fill="#a8d8ea" opacity="0.6">
                  <animate attributeName="cy" values="33;43;33" dur="2.3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2.3s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="25" cy="40" rx="1.5" ry="2.5" fill="#a8d8ea" opacity="0.5">
                  <animate attributeName="cy" values="40;52;40" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="1.8s" repeatCount="indefinite" />
                </ellipse>
              </>
            )}
          </g>
        )}

        {/* Flushed cheeks for worried/panicked */}
        {(emotion === 'panicked' || emotion === 'worried') && (
          <g>
            <ellipse cx="36" cy="62" rx="8" ry="5" fill="#e57373" opacity={emotion === 'panicked' ? 0.4 : 0.25} />
            <ellipse cx="64" cy="62" rx="8" ry="5" fill="#e57373" opacity={emotion === 'panicked' ? 0.4 : 0.25} />
          </g>
        )}

      </svg>
    </div>
  );
};

export default Portrait;
