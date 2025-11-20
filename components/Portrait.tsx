import React from 'react';
import { PortraitArchetype, PortraitEmotion } from '../types';

interface Props {
  archetype: PortraitArchetype;
  emotion?: PortraitEmotion;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

// --- Configuration Types ---
type Gender = 'm' | 'f';
type SkinTone = 'pale' | 'tan' | 'dark' | 'olive';
type Clothes = 'suit' | 'dress' | 'uniform' | 'shirt' | 'trench' | 'vest';
type Hat = 'fedora' | 'cloche' | 'cop' | 'newsboy' | 'headband' | 'bowler' | 'none';
type Accessory = 'cigar' | 'glasses' | 'pearls' | 'scarf' | 'earrings' | 'none';
type HairStyle = 'short' | 'bob' | 'bald' | 'slick' | 'wavy' | 'finger_waves';
type FacialHair = 'none' | 'mustache' | 'goatee' | 'stubble';

interface PortraitConfig {
  gender: Gender;
  skin: SkinTone;
  hairColor: string;
  eyeColor: string;
  clothes: Clothes;
  hat: Hat;
  accessory: Accessory;
  hairStyle: HairStyle;
  facialHair?: FacialHair;
}

const CONFIGS: Record<PortraitArchetype, PortraitConfig> = {
  mobster_m: { gender: 'm', skin: 'olive', hairColor: '#1a1a1a', eyeColor: '#3e2723', clothes: 'suit', hat: 'fedora', accessory: 'cigar', hairStyle: 'slick' },
  mobster_f: { gender: 'f', skin: 'pale', hairColor: '#0f0f0f', eyeColor: '#2e7d32', clothes: 'dress', hat: 'cloche', accessory: 'scarf', hairStyle: 'bob' },
  flapper:   { gender: 'f', skin: 'pale', hairColor: '#d4a017', eyeColor: '#4682b4', clothes: 'dress', hat: 'headband', accessory: 'pearls', hairStyle: 'finger_waves' },
  cop:       { gender: 'm', skin: 'tan', hairColor: '#3d2b1f', eyeColor: '#3e2723', clothes: 'uniform', hat: 'cop', accessory: 'none', hairStyle: 'short', facialHair: 'mustache' },
  worker:    { gender: 'm', skin: 'dark', hairColor: '#0a0a0a', eyeColor: '#000000', clothes: 'vest', hat: 'newsboy', accessory: 'none', hairStyle: 'short', facialHair: 'stubble' },
  gentleman: { gender: 'm', skin: 'pale', hairColor: '#808080', eyeColor: '#556b2f', clothes: 'suit', hat: 'none', accessory: 'glasses', hairStyle: 'slick' },
  sailor:    { gender: 'm', skin: 'tan', hairColor: '#8b4513', eyeColor: '#1e90ff', clothes: 'shirt', hat: 'none', accessory: 'none', hairStyle: 'short' },
  pharmacist:{ gender: 'm', skin: 'pale', hairColor: '#a9a9a9', eyeColor: '#708090', clothes: 'suit', hat: 'none', accessory: 'glasses', hairStyle: 'bald', facialHair: 'mustache' },
  henry_james: { gender: 'm', skin: 'pale', hairColor: '#4a3f35', eyeColor: '#3e2723', clothes: 'suit', hat: 'bowler', accessory: 'none', hairStyle: 'slick', facialHair: 'goatee' }
};

const SKIN_COLORS: Record<SkinTone, { base: string; shadow: string; highlight: string; blush: string }> = {
  pale:  { base: '#fcece3', shadow: '#e0c0a8', highlight: '#fff9f5', blush: '#f0a0a0' },
  tan:   { base: '#e6b996', shadow: '#bd8e6c', highlight: '#f5d5bc', blush: '#d69076' },
  olive: { base: '#dccba0', shadow: '#ae9b72', highlight: '#efe6ce', blush: '#c4aa82' },
  dark:  { base: '#8d5524', shadow: '#5e3615', highlight: '#af7441', blush: '#a36330' }
};

const Portrait: React.FC<Props> = ({ archetype, emotion = 'neutral', className = "", size = 'md', onClick }) => {
  const config = CONFIGS[archetype];
  const skin = SKIN_COLORS[config.skin];

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
    .eye-lids { animation: blink 5s infinite; transform-origin: center; }
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
    if (emotion === 'happy') cp1y = 35; // Relaxed
    if (emotion === 'injured') cp1y = 40; // Pained

    return `M${xStart},${y} Q${cp1x},${cp1y} ${xEnd},${y}`;
  };

  const getMouthPath = () => {
    switch (emotion) {
      case 'happy': return "M38,78 Q50,85 62,78";
      case 'angry': return "M38,82 Q50,76 62,82";
      case 'afraid': return "M42,80 Q50,86 58,80 Q50,74 42,80";
      case 'suspicious': return "M38,80 L62,79";
      case 'dead': return "M38,80 L62,80";
      case 'injured': return "M38,82 Q50,78 62,84";
      default: return "M38,80 Q50,82 62,80"; // Neutral
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
        <stop offset="100%" stopColor={config.hairColor} stopOpacity="0" />
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
    const fill = config.hairColor;
    if (back) {
      if (config.hairStyle === 'bob') return <path d="M20,30 C20,0 80,0 80,30 L85,70 L72,70 L72,50 L28,50 L28,70 L15,70 Z" fill={fill} />;
      if (config.hairStyle === 'finger_waves') return <path d="M15,40 C15,10 85,10 85,40 C88,60 80,75 70,75 C65,75 65,60 65,50 L35,50 C35,60 35,75 30,75 C20,75 12,60 15,40 Z" fill={fill} />;
      if (config.hairStyle === 'wavy') return <path d="M15,40 C15,0 85,0 85,40 L90,85 L75,85 L70,50 L30,50 L25,85 L10,85 Z" fill={fill} />;
      return null;
    }
    // Front Hair
    return (
      <g>
        {config.hairStyle === 'slick' && <path d="M25,45 C22,20 78,20 75,45 C75,25 60,12 40,12 C25,12 25,30 25,45 Z" fill={fill} />}
        {config.hairStyle === 'short' && <path d="M25,45 C25,15 75,15 75,45 C75,25 60,10 40,10 C20,10 25,30 25,45 Z" fill={fill} />}
        {config.hairStyle === 'finger_waves' && (
           <g>
             <path d="M20,45 C20,20 80,20 80,45 C80,25 60,12 50,12 C30,12 20,25 20,45" fill={fill} />
             <path d="M20,45 Q15,55 22,60 Q28,55 22,45" fill={fill} /> {/* Left Wave */}
             <path d="M80,45 Q85,55 78,60 Q72,55 78,45" fill={fill} /> {/* Right Wave */}
             <ellipse cx="50" cy="25" rx="20" ry="10" fill="url(#hairShine)" />
           </g>
        )}
         {config.hairStyle === 'bob' && (
           <g>
             <path d="M22,40 C22,20 78,20 78,40 C78,25 50,15 50,15 C50,15 22,25 22,40" fill={fill} />
             <path d="M22,40 L22,60 C25,55 28,55 28,50" fill={fill} />
             <path d="M78,40 L78,60 C75,55 72,55 72,50" fill={fill} />
           </g>
        )}
         {config.hairStyle === 'bald' && <path d="M22,55 C22,40 24,35 25,35 L28,35 L28,55 Z" fill="#999" opacity="0.4" />}
      </g>
    );
  };

  const Clothing = () => {
    return (
      <g className="torso-anim">
        {/* Base Shape */}
        <path d="M10,100 Q50,90 90,100 L90,130 L10,130 Z" fill={config.clothes === 'suit' ? '#1c1c1c' : config.clothes === 'dress' ? '#4a0404' : '#2d3748'} stroke="#000" strokeWidth="0.5" />

        {config.clothes === 'dress' && (
          <g>
             <rect x="10" y="100" width="80" height="30" fill="url(#sequins)" opacity="0.5" style={{mixBlendMode: 'overlay'}} />
             {/* Neckline */}
             <path d="M30,95 Q50,115 70,95" fill="none" stroke={config.skin === 'pale' ? '#e0e0e0' : '#d4af37'} strokeWidth="0.5" />
          </g>
        )}

        {config.clothes === 'suit' && (
          <g>
            <path d="M38,95 L50,110 L62,95 L50,90 Z" fill="#fff" /> {/* Shirt */}
            <path d="M47,95 L53,95 L51,110 L49,110 Z" fill="#600" /> {/* Tie */}
            <path d="M30,95 L50,125 L35,130 Z" fill="#222" stroke="#111" strokeWidth="0.5" /> {/* Lapel L */}
            <path d="M70,95 L50,125 L65,130 Z" fill="#222" stroke="#111" strokeWidth="0.5" /> {/* Lapel R */}
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
             <path d="M30,95 L50,130 L20,130" fill="#3e2723" />
             <path d="M70,95 L50,130 L80,130" fill="#3e2723" />
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
    </g>
  );

  const Face = () => (
    <g>
       {/* Head Shape */}
       <path d={config.gender === 'm'
         ? "M28,35 C28,10 72,10 72,35 L72,55 C72,78 60,92 50,92 C40,92 28,78 28,55 Z"
         : "M28,38 C28,15 72,15 72,38 L72,58 C72,78 50,90 50,90 C50,90 28,78 28,58 Z"}
         fill="url(#skinGrad)"
        />

       {/* Ears */}
       <path d="M28,48 Q22,48 22,55 Q22,62 28,60" fill={skin.shadow} />
       <path d="M72,48 Q78,48 78,55 Q78,62 72,60" fill={skin.shadow} />

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

       {/* Mouth */}
       <g transform="translate(0, 2)">
          <path d={getMouthPath()} fill="none" stroke="#8a5a44" strokeWidth={config.gender === 'f' ? 4 : 2} strokeLinecap="round" />
          <path d={getMouthPath()} fill="none" stroke={config.gender === 'f' ? "#b71c1c" : "#d7ccc8"} strokeWidth={config.gender === 'f' ? 2 : 0.5} strokeLinecap="round" />
       </g>

       {/* Facial Hair */}
       {config.facialHair === 'mustache' && (
          <path d="M38,76 Q50,70 62,76 Q60,80 50,78 Q40,80 38,76" fill={config.hairColor} />
       )}
       {config.facialHair === 'goatee' && (
          <g>
            {/* Mustache part */}
            <path d="M38,76 Q50,70 62,76 Q60,79 50,77 Q40,79 38,76" fill={config.hairColor} />
            {/* Goatee part - small pointed beard on chin */}
            <path d="M45,82 Q50,88 55,82 L52,85 Q50,87 48,85 Z" fill={config.hairColor} />
            <path d="M47,83 Q50,85 53,83" stroke={config.hairColor} strokeWidth="1" fill="none" />
          </g>
       )}

       {/* Eyes */}
       <g transform="translate(0, 2)">
          {/* Whites */}
          <path d="M30,48 Q36,42 42,48 Q36,54 30,48 Z" fill="#fff" />
          <path d="M58,48 Q64,42 70,48 Q64,54 58,48 Z" fill="#fff" />

          {/* Iris/Pupil */}
          <g>
             <circle cx="36" cy="48" r="3" fill={config.eyeColor} />
             <circle cx="36" cy="48" r="1.5" fill="#000" />
             <circle cx="37" cy="47" r="0.8" fill="#fff" opacity="0.8" />

             <circle cx="64" cy="48" r="3" fill={config.eyeColor} />
             <circle cx="64" cy="48" r="1.5" fill="#000" />
             <circle cx="65" cy="47" r="0.8" fill="#fff" opacity="0.8" />
          </g>

          {/* Lash Line */}
          <path d="M29,48 Q36,41 43,48" fill="none" stroke="#222" strokeWidth={config.gender === 'f' ? 2 : 1} />
          <path d="M57,48 Q64,41 71,48" fill="none" stroke="#222" strokeWidth={config.gender === 'f' ? 2 : 1} />

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
          <path d={getBrowPath('L')} fill="none" stroke={config.hairColor} strokeWidth={config.gender === 'm' ? 2.5 : 1.5} strokeLinecap="round" />
          <path d={getBrowPath('R')} fill="none" stroke={config.hairColor} strokeWidth={config.gender === 'm' ? 2.5 : 1.5} strokeLinecap="round" />
       </g>

       {/* Face Accessories */}
       {config.accessory === 'glasses' && (
         <g opacity="0.8">
           <circle cx="36" cy="50" r="9" fill="rgba(255,255,255,0.1)" stroke="#D4AF37" strokeWidth="1"/>
           <circle cx="64" cy="50" r="9" fill="rgba(255,255,255,0.1)" stroke="#D4AF37" strokeWidth="1"/>
           <line x1="45" y1="50" x2="55" y2="50" stroke="#D4AF37" strokeWidth="1" />
           <path d="M30,46 L40,44" stroke="rgba(255,255,255,0.4)" strokeWidth="1" /> {/* Glare */}
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
    </g>
  );

  const HatLayer = () => (
     <g filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.4))">
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
     </g>
  );

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

        {/* Rim Light */}
        <path d="M10,130 C5,50 20,10 50,10 C80,10 95,50 90,130" fill="none" stroke="#fff" strokeWidth="1" opacity="0.15" />
      </svg>
    </div>
  );
};

export default Portrait;
