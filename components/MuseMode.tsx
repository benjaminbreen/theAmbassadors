import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { TILE_REGISTRY, TileDefinition } from './MapTile/TileRegistry';
import { Item, MetNPC } from '../types';
import { LucideX, LucideTrash2, LucidePenTool } from 'lucide-react';

// Particle types
type ParticleType = 'tile' | 'item' | 'npc';

// Explosion particle for firework effect
interface ExplosionParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: [number, number, number];
  size: number;
  gravity: number;
  friction: number;
}

// Unified particle interface
interface MuseParticle {
  id: number;
  type: ParticleType;
  char?: string;
  tile?: TileDefinition;
  item?: Item;
  itemEmoji?: string;
  npc?: MetNPC;
  npcInitials?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVy: number; // Store original velocity for hover slowdown
  rotation: number;
  rotationSpeed: number;
  scale: number;
  baseScale: number; // Store original scale for hover effect
  opacity: number;
  glowIntensity: number;
  glowPhase: number;
  displayName: string;
  category: string;
  locationFound?: string;
  color: [number, number, number];
  fragments: string[];
  dead?: boolean;
  isFast?: boolean; // Fast falling particle with trail
  trail?: Array<{ x: number; y: number; opacity: number }>; // Phosphor trail
  hoverGlow: number; // 0-1 for hover glow effect
}

interface MuseModeProps {
  onClose: () => void;
  onWrite?: (words: string[]) => void;
}

// Item type to emoji mapping
const ITEM_EMOJIS: Record<string, string> = {
  'BOOK': '📖',
  'CURIOSITY': '🔮',
  'CONSUMABLE': '🍷',
  'DOCUMENT': '📜',
  'TOOL': '🔧',
  'PERSONAL': '💼',
  'ART': '🎨',
};

// Word fragments for different categories - abstract, evocative, Jamesian
const CATEGORY_FRAGMENTS: Record<string, string[][]> = {
  terrain: [
    ["beneath", "worn smooth", "passage", "trace"],
    ["foundation", "dust", "weight", "step"],
    ["ground", "solid", "pathway", "worn"],
  ],
  wall: [
    ["boundary", "silence", "within", "beyond"],
    ["division", "shelter", "secret", "stone"],
    ["barrier", "enclosure", "shadow", "limit"],
  ],
  door: [
    ["threshold", "between", "possibility", "hinge"],
    ["opening", "passage", "invitation", "warning"],
    ["entrance", "departure", "liminal", "choice"],
  ],
  flora: [
    ["green", "reaching", "rooted", "alive"],
    ["growth", "season", "branch", "leaf"],
    ["nature", "persist", "bloom", "shade"],
  ],
  furniture: [
    ["rest", "waiting", "presence", "absence"],
    ["placed", "purpose", "comfort", "form"],
    ["seat", "witness", "arrangement", "repose"],
  ],
  lighting: [
    ["glow", "darkness", "warmth", "flicker"],
    ["illumination", "shadow", "flame", "bright"],
    ["radiance", "against", "night", "burning"],
  ],
  machine: [
    ["mechanism", "turning", "progress", "iron"],
    ["engine", "power", "steam", "motion"],
    ["industry", "rhythm", "modern", "force"],
  ],
  statue: [
    ["frozen", "gesture", "eternal", "stone"],
    ["figure", "stillness", "watching", "form"],
    ["monument", "memory", "marble", "silence"],
  ],
  fountain: [
    ["water", "falling", "surface", "depth"],
    ["flow", "reflection", "spray", "basin"],
    ["liquid", "ceaseless", "ripple", "pour"],
  ],
  village: [
    ["distant", "other", "dwelling", "strange"],
    ["foreign", "familiar", "exhibition", "culture"],
    ["elsewhere", "brought", "display", "world"],
  ],
  tower: [
    ["ascent", "iron", "height", "sky"],
    ["rising", "lattice", "view", "ambition"],
    ["structure", "vertical", "daring", "modern"],
  ],
  special: [
    ["singular", "exception", "remarkable", "rare"],
    ["unique", "attention", "curious", "apart"],
  ],
  object: [
    ["thing", "artifact", "meaning", "held"],
    ["possession", "history", "purpose", "kept"],
  ],
  item_book: [
    ["pages", "words", "binding", "ink"],
    ["chapter", "story", "knowledge", "read"],
    ["volume", "printed", "thought", "spine"],
  ],
  item_curiosity: [
    ["mystery", "wonder", "peculiar", "kept"],
    ["strange", "collected", "precious", "odd"],
  ],
  item_consumable: [
    ["taste", "fleeting", "pleasure", "savor"],
    ["indulgence", "moment", "ephemeral", "sweet"],
  ],
  item_document: [
    ["written", "record", "paper", "signed"],
    ["official", "ink", "dated", "proof"],
  ],
  item_tool: [
    ["implement", "function", "hand", "craft"],
    ["useful", "purpose", "make", "work"],
  ],
  item_personal: [
    ["carried", "intimate", "belonging", "self"],
    ["pocket", "familiar", "worn", "mine"],
  ],
  item_art: [
    ["beauty", "created", "vision", "frame"],
    ["expression", "canvas", "color", "soul"],
  ],
  npc: [
    ["face", "voice", "encounter", "stranger"],
    ["meeting", "impression", "conversation", "brief"],
    ["person", "moment", "exchange", "remembered"],
    ["eyes", "words", "gesture", "presence"],
  ],
};

// Colors for different categories
const CATEGORY_COLORS: Record<string, [number, number, number]> = {
  terrain: [180, 160, 140],
  wall: [120, 100, 80],
  door: [200, 180, 120],
  flora: [100, 180, 100],
  furniture: [180, 140, 100],
  lighting: [255, 220, 150],
  machine: [150, 180, 200],
  statue: [200, 200, 220],
  fountain: [100, 150, 200],
  village: [180, 120, 80],
  tower: [100, 120, 160],
  special: [200, 150, 200],
  object: [160, 160, 160],
  item_book: [180, 140, 100],
  item_curiosity: [180, 100, 200],
  item_consumable: [200, 120, 120],
  item_document: [200, 190, 150],
  item_tool: [150, 150, 170],
  item_personal: [170, 140, 120],
  item_art: [220, 180, 140],
  npc: [255, 200, 160],
};

const MuseMode: React.FC<MuseModeProps> = ({ onClose, onWrite }) => {
  const { state } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<MuseParticle[]>([]);
  const explosionsRef = useRef<ExplosionParticle[]>([]);
  const animationRef = useRef<number | null>(null);
  const [selectedParticle, setSelectedParticle] = useState<MuseParticle | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [collectedWords, setCollectedWords] = useState<Array<{ word: string; color: [number, number, number]; id: number }>>([]);
  const [newWordAnimation, setNewWordAnimation] = useState<number | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const wordIdRef = useRef(0);

  // Get all unique ASCII characters that appear in zones the player has visited
  const visitedTiles = useMemo(() => {
    const tiles = new Map<string, { tile: TileDefinition; locations: string[] }>();

    Object.values(state.zones).forEach(zone => {
      if (!zone.visited || !zone.mapData) return;

      zone.mapData.forEach(row => {
        for (const char of row) {
          const tileDef = Object.values(TILE_REGISTRY).find(t => t.char === char);
          if (tileDef && char !== ' ' && char !== '.') {
            if (!tiles.has(char)) {
              tiles.set(char, { tile: tileDef, locations: [] });
            }
            const entry = tiles.get(char)!;
            if (!entry.locations.includes(zone.name)) {
              entry.locations.push(zone.name);
            }
          }
        }
      });
    });

    return tiles;
  }, [state.zones]);

  // Get random fragments for a category
  const getFragments = (category: string): string[] => {
    const fragmentSets = CATEGORY_FRAGMENTS[category] || CATEGORY_FRAGMENTS.object;
    const set = fragmentSets[Math.floor(Math.random() * fragmentSets.length)];
    return [...set];
  };

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particles: MuseParticle[] = [];
    let id = 0;

    const createParticleBase = (forceFast?: boolean) => {
      // Very rare fast particles - only ~1% chance (about 1 per 30-60 seconds in practice)
      const isFast = forceFast || Math.random() < 0.01;
      const baseVy = isFast ? 1.5 + Math.random() * 2.5 : 0.15 + Math.random() * 0.4;
      const baseScale = 0.7 + Math.random() * 0.5;

      return {
        x: Math.random() * canvas.width,
        y: -50 - Math.random() * canvas.height * 1.5,
        vx: (Math.random() - 0.5) * (isFast ? 0.2 : 0.4),
        vy: baseVy,
        baseVy,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        scale: baseScale,
        baseScale,
        opacity: isFast ? 0.7 + Math.random() * 0.3 : 0.5 + Math.random() * 0.4,
        glowIntensity: isFast ? 0.8 + Math.random() * 0.2 : 0.6 + Math.random() * 0.4,
        glowPhase: Math.random() * Math.PI * 2,
        isFast,
        trail: isFast ? [] : undefined,
        hoverGlow: 0,
      };
    };

    // Add tile particles
    const tileEntries = Array.from(visitedTiles.entries());
    for (let i = 0; i < Math.min(tileEntries.length * 2, 50); i++) {
      const [char, { tile, locations }] = tileEntries[i % tileEntries.length];
      const color = CATEGORY_COLORS[tile.category] || [160, 160, 160];

      particles.push({
        id: id++,
        type: 'tile',
        char,
        tile,
        displayName: tile.name,
        category: tile.category,
        locationFound: locations[Math.floor(Math.random() * locations.length)],
        color,
        fragments: getFragments(tile.category),
        ...createParticleBase(),
      });
    }

    // Add inventory item particles
    state.player.inventory.forEach(item => {
      const emoji = ITEM_EMOJIS[item.type] || '📦';
      const categoryKey = `item_${item.type.toLowerCase()}`;
      const color = CATEGORY_COLORS[categoryKey] || [180, 180, 180];

      for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
        particles.push({
          id: id++,
          type: 'item',
          item,
          itemEmoji: emoji,
          displayName: item.name,
          category: categoryKey,
          color,
          fragments: getFragments(categoryKey),
          ...createParticleBase(),
          scale: 0.9 + Math.random() * 0.4,
        });
      }
    });

    // Add met NPC particles
    state.metNpcs.forEach(npc => {
      const initials = npc.name.split(' ').map(n => n[0]).join('').slice(0, 2);
      const color = CATEGORY_COLORS.npc;

      for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
        particles.push({
          id: id++,
          type: 'npc',
          npc,
          npcInitials: initials,
          displayName: npc.name,
          category: 'npc',
          locationFound: npc.metAt.zoneName,
          color,
          fragments: getFragments('npc'),
          ...createParticleBase(),
          scale: 1.0 + Math.random() * 0.3,
        });
      }
    });

    // Shuffle
    for (let i = particles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [particles[i], particles[j]] = [particles[j], particles[i]];
    }

    particlesRef.current = particles;
  }, [visitedTiles, state.player.inventory, state.metNpcs]);

  // Create explosion effect
  const createExplosion = useCallback((x: number, y: number, color: [number, number, number]) => {
    const newExplosions: ExplosionParticle[] = [];
    const particleCount = 40 + Math.floor(Math.random() * 20);

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 6;
      const life = 60 + Math.random() * 40;

      newExplosions.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Slight upward bias
        life,
        maxLife: life,
        color: [
          Math.min(255, color[0] + Math.random() * 50),
          Math.min(255, color[1] + Math.random() * 50),
          Math.min(255, color[2] + Math.random() * 50),
        ] as [number, number, number],
        size: 2 + Math.random() * 4,
        gravity: 0.08 + Math.random() * 0.04,
        friction: 0.97 + Math.random() * 0.02,
      });
    }

    // Add some sparkle particles
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;

      newExplosions.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30 + Math.random() * 20,
        maxLife: 50,
        color: [255, 255, 255],
        size: 1 + Math.random() * 2,
        gravity: 0.02,
        friction: 0.99,
      });
    }

    explosionsRef.current = [...explosionsRef.current, ...newExplosions];
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 16.67, 3);
      lastTime = currentTime;

      // Clear with slight trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw explosion particles
      explosionsRef.current = explosionsRef.current.filter(p => {
        p.life -= deltaTime;
        if (p.life <= 0) return false;

        p.vy += p.gravity * deltaTime;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.x += p.vx * deltaTime;
        p.y += p.vy * deltaTime;

        const alpha = (p.life / p.maxLife) * 0.9;
        const size = p.size * (0.5 + (p.life / p.maxLife) * 0.5);

        // Draw with glow
        ctx.save();
        ctx.shadowColor = `rgb(${p.color[0]}, ${p.color[1]}, ${p.color[2]})`;
        ctx.shadowBlur = 10 * alpha;
        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      // Update and draw main particles
      const particles = particlesRef.current;

      particles.forEach(particle => {
        if (particle.dead) return;

        // Calculate distance to mouse for hover effect
        const dx = mousePos.current.x - particle.x;
        const dy = mousePos.current.y - particle.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        const hoverRadius = 80;
        const isHovered = distToMouse < hoverRadius;

        // Smooth hover glow transition
        const targetHoverGlow = isHovered ? 1 - (distToMouse / hoverRadius) : 0;
        particle.hoverGlow += (targetHoverGlow - particle.hoverGlow) * 0.15 * deltaTime;

        // Update trail ONLY for fast particles
        if (particle.isFast && particle.trail && particle.trail !== undefined && !isPaused) {
          // Add current position to trail
          particle.trail.unshift({ x: particle.x, y: particle.y, opacity: 1 });
          // Limit trail length and fade
          particle.trail = particle.trail.slice(0, 12).map((p, i) => ({
            ...p,
            opacity: p.opacity * (0.85 - i * 0.02)
          })).filter(p => p.opacity > 0.05);
        }

        if (!isPaused) {
          // Slow down when hovered
          const hoverSlowdown = 1 - particle.hoverGlow * 0.85;

          particle.x += particle.vx * deltaTime * hoverSlowdown;
          particle.y += particle.vy * deltaTime * hoverSlowdown;
          particle.rotation += particle.rotationSpeed * deltaTime * hoverSlowdown;
          particle.glowPhase += 0.02 * deltaTime;

          // Gentle attraction toward mouse (reduced when hovered)
          if (distToMouse < 250 && distToMouse > 30 && !isHovered) {
            particle.vx += (dx / distToMouse) * 0.002 * deltaTime;
            particle.vy += (dy / distToMouse) * 0.002 * deltaTime;
          }

          // Return to base velocity over time
          particle.vy += (particle.baseVy - particle.vy) * 0.01 * deltaTime;
          particle.vx *= 0.997;

          if (particle.y > canvas.height + 80) {
            particle.y = -80;
            particle.x = Math.random() * canvas.width;
            if (particle.trail) particle.trail = [];
          }
          if (particle.x < -80) particle.x = canvas.width + 80;
          if (particle.x > canvas.width + 80) particle.x = -80;
        }

        // Scale up on hover
        const hoverScale = 1 + particle.hoverGlow * 0.4;
        const currentScale = particle.baseScale * hoverScale;
        particle.scale = particle.scale + (currentScale - particle.scale) * 0.2 * deltaTime;

        const glowPulse = 0.7 + Math.sin(particle.glowPhase) * 0.15; // Reduced pulse range
        const hoverGlowBoost = 1 + particle.hoverGlow * 0.8; // Reduced hover boost
        const baseGlowRadius = particle.type === 'npc' ? 12 : particle.type === 'item' ? 10 : 8; // Smaller glow
        const glowRadius = baseGlowRadius * particle.scale * particle.glowIntensity * glowPulse * hoverGlowBoost;

        const [r, g, b] = particle.color;

        // Draw phosphor trail for fast particles (subtle, faint)
        if (particle.isFast && particle.trail && particle.trail.length > 0) {
          particle.trail.forEach((point, i) => {
            const trailOpacity = point.opacity * particle.opacity * 0.25; // Much fainter
            const trailSize = (particle.scale * 4) * (1 - i / particle.trail!.length) * 0.5; // Smaller

            const trailGradient = ctx.createRadialGradient(
              point.x, point.y, 0,
              point.x, point.y, trailSize * 1.5
            );
            trailGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${trailOpacity})`);
            trailGradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${trailOpacity * 0.2})`);
            trailGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = trailGradient;
            ctx.beginPath();
            ctx.arc(point.x, point.y, trailSize * 1.5, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // Draw subtle glow (enhanced on hover)
        const hoverOpacityBoost = 1 + particle.hoverGlow * 0.3;
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowRadius
        );

        // Subtle center, more transparent
        const centerOpacity = (0.25 + particle.hoverGlow * 0.2) * particle.opacity * glowPulse * hoverOpacityBoost;
        const midOpacity = (0.1 + particle.hoverGlow * 0.1) * particle.opacity * glowPulse * hoverOpacityBoost;

        gradient.addColorStop(0, `rgba(${Math.min(255, r + particle.hoverGlow * 30)}, ${Math.min(255, g + particle.hoverGlow * 30)}, ${Math.min(255, b + particle.hoverGlow * 30)}, ${centerOpacity})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${midOpacity})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(particle.x, particle.y);

        // Subtle shadow blur on hover
        const hoverShadowBoost = 1 + particle.hoverGlow * 0.8;
        const hoverBrightenedR = Math.min(255, r + particle.hoverGlow * 40);
        const hoverBrightenedG = Math.min(255, g + particle.hoverGlow * 40);
        const hoverBrightenedB = Math.min(255, b + particle.hoverGlow * 40);

        if (particle.type === 'tile') {
          ctx.rotate(particle.rotation);
          ctx.font = `${38 * particle.scale}px "Courier New", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          ctx.shadowColor = `rgb(${hoverBrightenedR}, ${hoverBrightenedG}, ${hoverBrightenedB})`;
          ctx.shadowBlur = 8 * glowPulse * hoverShadowBoost; // Reduced from 25
          ctx.fillStyle = `rgba(${hoverBrightenedR}, ${hoverBrightenedG}, ${hoverBrightenedB}, ${particle.opacity * hoverOpacityBoost * 0.9})`;
          ctx.fillText(particle.char!, 0, 0);

          ctx.shadowBlur = 3 * hoverShadowBoost; // Reduced from 8
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.7 * hoverOpacityBoost})`;
          ctx.fillText(particle.char!, 0, 0);

        } else if (particle.type === 'item') {
          ctx.rotate(particle.rotation * 0.3);
          ctx.font = `${42 * particle.scale}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          ctx.shadowColor = `rgb(${hoverBrightenedR}, ${hoverBrightenedG}, ${hoverBrightenedB})`;
          ctx.shadowBlur = 6 * glowPulse * hoverShadowBoost; // Reduced from 20
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * hoverOpacityBoost * 0.9})`;
          ctx.fillText(particle.itemEmoji!, 0, 0);

        } else if (particle.type === 'npc') {
          const radius = 22 * particle.scale;

          ctx.shadowColor = `rgb(${hoverBrightenedR}, ${hoverBrightenedG}, ${hoverBrightenedB})`;
          ctx.shadowBlur = 20 * glowPulse * hoverShadowBoost;

          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r * 0.3}, ${g * 0.3}, ${b * 0.3}, ${particle.opacity * 0.8 * hoverOpacityBoost})`;
          ctx.fill();

          ctx.strokeStyle = `rgba(${hoverBrightenedR}, ${hoverBrightenedG}, ${hoverBrightenedB}, ${particle.opacity * hoverOpacityBoost})`;
          ctx.lineWidth = 2 + particle.hoverGlow;
          ctx.stroke();

          ctx.shadowBlur = 10 * hoverShadowBoost;
          ctx.font = `bold ${16 * particle.scale}px "Cinzel", serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * hoverOpacityBoost})`;
          ctx.fillText(particle.npcInitials!, 0, 1);
        }

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    setTimeout(() => setFadeIn(false), 100);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (selectedParticle) return; // Don't select new particle if one is already selected

    const particles = particlesRef.current;
    const clickX = e.clientX;
    const clickY = e.clientY;

    let closest: MuseParticle | null = null;
    let closestDist = 60;

    particles.forEach(particle => {
      if (particle.dead) return;
      const dx = clickX - particle.x;
      const dy = clickY - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < closestDist) {
        closestDist = dist;
        closest = particle;
      }
    });

    if (closest) {
      setIsPaused(true);
      setSelectedParticle(closest);
    }
  }, [selectedParticle]);

  // Handle clicking a word fragment
  const handleFragmentClick = useCallback((word: string) => {
    if (!selectedParticle) return;

    // Add word to collected words
    const newWord = {
      word,
      color: selectedParticle.color,
      id: wordIdRef.current++,
    };
    setCollectedWords(prev => [...prev, newWord]);
    setNewWordAnimation(newWord.id);
    setTimeout(() => setNewWordAnimation(null), 1000);

    // Create explosion at particle position
    createExplosion(selectedParticle.x, selectedParticle.y, selectedParticle.color);

    // Mark particle as dead
    selectedParticle.dead = true;

    // Close panel and resume
    setSelectedParticle(null);
    setIsPaused(false);
  }, [selectedParticle, createExplosion]);

  const handleClosePanel = useCallback(() => {
    setSelectedParticle(null);
    setIsPaused(false);
  }, []);

  const clearWords = useCallback(() => {
    setCollectedWords([]);
  }, []);

  const handleWrite = useCallback(() => {
    if (collectedWords.length === 0 || !onWrite) return;
    const words = collectedWords.map(w => w.word);
    onWrite(words);
    onClose();
  }, [collectedWords, onWrite, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[70] transition-opacity duration-1000 ${fadeIn ? 'opacity-0' : 'opacity-100'}`}
      style={{ background: '#000' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-20 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
      >
        <LucideX size={24} className="text-white/60 group-hover:text-white/90" />
      </button>

      {/* Title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
        <h1 className="text-2xl font-display text-white/30 tracking-[0.3em] uppercase">
          Muse
        </h1>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-2" />
      </div>

      {/* Instructions */}
      <div className={`absolute top-24 left-1/2 -translate-x-1/2 text-center transition-opacity duration-500 ${selectedParticle || collectedWords.length > 0 ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-white/30 text-sm font-serif italic tracking-wide">
          Click a falling memory to capture its essence
        </p>
      </div>

      {/* Selected particle panel */}
      {selectedParticle && (
        <div
          className="absolute z-30 animate-fade-in"
          style={{
            left: Math.min(Math.max(selectedParticle.x + 40, 20), window.innerWidth - 400),
            top: Math.min(Math.max(selectedParticle.y - 100, 20), window.innerHeight - 360),
          }}
        >
          <div
            className="w-[360px] bg-black border border-white/20 rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with icon */}
            <div className="p-5 border-b border-white/10 flex items-center gap-4">
              <div
                className="w-14 h-14 flex items-center justify-center rounded-lg shrink-0"
                style={{
                  background: `radial-gradient(circle, rgba(${selectedParticle.color.join(',')}, 0.3) 0%, transparent 70%)`,
                  textShadow: `0 0 15px rgb(${selectedParticle.color.join(',')})`,
                  color: `rgb(${selectedParticle.color.join(',')})`,
                  fontSize: selectedParticle.type === 'tile' ? '28px' : selectedParticle.type === 'item' ? '32px' : '14px',
                  fontFamily: selectedParticle.type === 'tile' ? 'monospace' : 'inherit',
                }}
              >
                {selectedParticle.type === 'tile' && selectedParticle.char}
                {selectedParticle.type === 'item' && selectedParticle.itemEmoji}
                {selectedParticle.type === 'npc' && (
                  <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-display font-bold text-base"
                    style={{ borderColor: `rgb(${selectedParticle.color.join(',')})` }}>
                    {selectedParticle.npcInitials}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-display text-white/90">{selectedParticle.displayName}</h3>
                <p className="text-xs text-white/50 mt-0.5 capitalize">
                  {selectedParticle.type === 'tile' ? selectedParticle.tile?.category :
                   selectedParticle.type === 'item' ? selectedParticle.item?.type.toLowerCase() :
                   selectedParticle.npc?.profession}
                </p>
              </div>
              <button
                onClick={handleClosePanel}
                className="p-1.5 hover:bg-white/10 rounded transition-colors shrink-0"
              >
                <LucideX size={18} className="text-white/40 hover:text-white/70" />
              </button>
            </div>

            {/* Context description */}
            <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <p className="text-white/50 font-serif italic text-sm leading-relaxed">
                {selectedParticle.type === 'npc' ? (
                  <>Something you recall from meeting <span className="text-white/70">{selectedParticle.displayName}</span> at the <span className="text-white/70">{selectedParticle.locationFound || 'Exposition'}</span>.</>
                ) : selectedParticle.type === 'item' ? (
                  <>An object you acquired—<span className="text-white/70">{selectedParticle.item?.description?.slice(0, 60) || selectedParticle.displayName}</span>{selectedParticle.item?.description && selectedParticle.item.description.length > 60 ? '...' : ''}.</>
                ) : (
                  <>Something you recall seeing at the <span className="text-white/70">{selectedParticle.locationFound || 'Exposition'}</span>.</>
                )}
              </p>
            </div>

            {/* Word fragments */}
            <div className="p-5">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">Select a word to capture this memory</p>
              <div className="flex flex-wrap gap-2">
                {selectedParticle.fragments.map((word, i) => (
                  <button
                    key={i}
                    onClick={() => handleFragmentClick(word)}
                    className="px-4 py-2 rounded border transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      borderColor: `rgba(${selectedParticle.color.join(',')}, 0.4)`,
                      background: `rgba(${selectedParticle.color.join(',')}, 0.1)`,
                      color: `rgb(${selectedParticle.color.join(',')})`,
                      textShadow: `0 0 10px rgba(${selectedParticle.color.join(',')}, 0.5)`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `rgba(${selectedParticle.color.join(',')}, 0.8)`;
                      e.currentTarget.style.background = `rgba(${selectedParticle.color.join(',')}, 0.25)`;
                      e.currentTarget.style.boxShadow = `0 0 20px rgba(${selectedParticle.color.join(',')}, 0.3)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `rgba(${selectedParticle.color.join(',')}, 0.4)`;
                      e.currentTarget.style.background = `rgba(${selectedParticle.color.join(',')}, 0.1)`;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span className="font-serif italic text-sm">{word}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collected words at bottom */}
      {collectedWords.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
          <div className="max-w-4xl mx-auto">
            {/* Action buttons */}
            <div className="flex justify-between mb-3 pointer-events-auto">
              <button
                onClick={clearWords}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                title="Clear words"
              >
                <LucideTrash2 size={14} className="text-white/30 group-hover:text-white/60" />
              </button>

              {/* Write button */}
              {onWrite && collectedWords.length >= 2 && (
                <button
                  onClick={handleWrite}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/30 hover:border-purple-400/50 transition-all group"
                  title="Write with these words"
                >
                  <LucidePenTool size={14} className="text-purple-300/70 group-hover:text-purple-200 transition-colors" />
                  <span className="text-purple-200/80 group-hover:text-purple-100 text-sm font-serif italic transition-colors">Write</span>
                </button>
              )}
            </div>

            {/* Words */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 items-baseline">
              {collectedWords.map((item, index) => (
                <span
                  key={item.id}
                  className={`font-serif italic text-2xl md:text-3xl transition-all duration-1000 ${
                    newWordAnimation === item.id ? 'animate-word-appear' : ''
                  }`}
                  style={{
                    color: `rgb(${item.color.join(',')})`,
                    textShadow: `0 0 30px rgba(${item.color.join(',')}, 0.6), 0 0 60px rgba(${item.color.join(',')}, 0.3)`,
                    opacity: newWordAnimation === item.id ? 1 : 0.85,
                  }}
                >
                  {item.word}
                  {index < collectedWords.length - 1 && (
                    <span className="text-white/20 ml-4">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ambient stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.1 + Math.random() * 0.2,
              animation: `twinkle ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.4; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes word-appear {
          0% {
            opacity: 0;
            transform: scale(1.5) translateY(20px);
            filter: blur(10px);
          }
          50% {
            opacity: 1;
            transform: scale(1.1) translateY(-5px);
            filter: blur(0);
          }
          100% {
            opacity: 0.85;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }
        .animate-word-appear {
          animation: word-appear 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MuseMode;
