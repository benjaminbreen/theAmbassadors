import { BiomeType } from '../../types';
import { CulturalStyle, MaterialPalette } from './types';

// Simple hash function - computed once per tile for deterministic randomness
export const hash = (x: number, y: number): number => {
    const h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
    return h - Math.floor(h);
};

// Get culturally-appropriate wall style based on zone name
export const getCulturalWallStyle = (zoneName: string): CulturalStyle | null => {
    const nameLower = zoneName.toLowerCase();

    // Japanese locations
    if (nameLower.includes('japan') || nameLower.includes('nippon')) {
        return 'JAPANESE';
    }
    // Chinese locations
    if (nameLower.includes('china') || nameLower.includes('chinese') || nameLower.includes('celestial')) {
        return 'CHINESE';
    }
    // Rue du Caire / Souk areas - sandy stucco with dark archways
    if (nameLower.includes('cairo') || nameLower.includes('caire') || nameLower.includes('souk') ||
        nameLower.includes('bazaar') || nameLower.includes('rue du')) {
        return 'SOUK';
    }
    // Persian/Middle Eastern formal spaces
    if (nameLower.includes('persia') || nameLower.includes('iran') || nameLower.includes('ottoman')) {
        return 'PERSIAN';
    }
    // Egyptian pavilion - sandstone with hieroglyphics
    if (nameLower.includes('egypt') || nameLower.includes('pharaoh') || nameLower.includes('nile')) {
        return 'EGYPTIAN';
    }
    // Mexican/Aztec pavilion
    if (nameLower.includes('mexico') || nameLower.includes('aztec') || nameLower.includes('maya')) {
        return 'MESOAMERICAN';
    }
    // Moorish/Islamic - zellige tiles
    if (nameLower.includes('tunis') || nameLower.includes('morocco') || nameLower.includes('algeria') ||
        nameLower.includes('arab') || nameLower.includes('mosque') || nameLower.includes('alhambra')) {
        return 'MOORISH';
    }
    // Italian
    if (nameLower.includes('italy') || nameLower.includes('italian') || nameLower.includes('roma') ||
        nameLower.includes('florence') || nameLower.includes('venice')) {
        return 'ITALIAN';
    }
    // Portuguese - Manueline blue and white tiles (azulejos)
    if (nameLower.includes('portugal') || nameLower.includes('lisbon') || nameLower.includes('portuguese')) {
        return 'PORTUGUESE';
    }
    // Spanish - warm terracotta and ochre
    if (nameLower.includes('spain') || nameLower.includes('spanish') || nameLower.includes('madrid') || nameLower.includes('barcelona')) {
        return 'SPANISH';
    }
    // Russian - rich greens and golds
    if (nameLower.includes('russia') || nameLower.includes('russian') || nameLower.includes('moscow') || nameLower.includes('petersburg')) {
        return 'RUSSIAN';
    }
    // Indian - vibrant colors, ornate patterns
    if (nameLower.includes('india') || nameLower.includes('indian') || nameLower.includes('bengal') || nameLower.includes('delhi')) {
        return 'INDIAN';
    }
    // Greek - white marble and blue accents
    if (nameLower.includes('greece') || nameLower.includes('greek') || nameLower.includes('athens') || nameLower.includes('hellenic')) {
        return 'GREEK';
    }
    // Brazilian / South American
    if (nameLower.includes('brazil') || nameLower.includes('argentina') || nameLower.includes('chile') || nameLower.includes('venezuela')) {
        return 'SOUTH_AMERICAN';
    }
    // African pavilions
    if (nameLower.includes('africa') || nameLower.includes('congo') || nameLower.includes('senegal')) {
        return 'AFRICAN';
    }
    // Javanese / Southeast Asian
    if (nameLower.includes('java') || nameLower.includes('siam') || nameLower.includes('cambodia') || nameLower.includes('annam')) {
        return 'SOUTHEAST_ASIAN';
    }
    // Beaux-Arts / French grand style
    if (nameLower.includes('beaux') || nameLower.includes('palais') || nameLower.includes('arts libéraux')) {
        return 'BEAUX_ARTS';
    }
    // Trocadéro
    if (nameLower.includes('trocad')) {
        return 'TROCADERO';
    }
    // Galerie des Machines / Industrial
    if (nameLower.includes('galerie') || nameLower.includes('machine') || nameLower.includes('edison') || nameLower.includes('electric')) {
        return 'GALERIE';
    }

    return null; // Use biome default
};

// Get pattern ID for floor tiles based on biome and optionally zone name
// Cultural patterns are now used ONLY for carpet tiles, not base floors
export const getFloorPattern = (biome: BiomeType, zoneName?: string): string => {
    switch (biome) {
        case 'SALON': return 'url(#pattern-salon)';
        case 'STREET': return 'url(#pattern-street)';
        case 'GARDEN': return 'url(#pattern-grass)';
        case 'GRAND_HALL': return 'url(#pattern-grandhall)';
        case 'TOWER_LEVEL': return 'url(#pattern-towerlevel)';
        case 'TOWER_BASE': return 'url(#pattern-towerbase)';
        case 'TOWER_PLATFORM': return 'url(#pattern-towerplatform)';
        case 'TOWER_FIRST_FLOOR': return 'url(#pattern-towerfirstfloor)';
        case 'ESPLANADE': return 'url(#pattern-esplanade)';
        case 'CONCERT_HALL': return 'url(#pattern-salon)';
        case 'SOUK': return 'url(#pattern-souk)';
        case 'GALERIE': return 'url(#pattern-galerie)';
        case 'BRIDGE': return 'url(#pattern-bridge)';
        case 'GATE': return 'url(#pattern-gate)';
        case 'VILLAGE': return 'url(#pattern-street)';
        case 'TROCADERO': return 'url(#pattern-polished)';
        case 'WATERFALL': return 'url(#pattern-grass)';
        case 'ROTUNDA': return 'url(#pattern-rotunda)';
        default: return 'url(#pattern-street)';
    }
};

// Get culturally-appropriate carpet pattern based on zone name
// This is used for carpet tiles ('r') only, not base floors
export const getCarpetPattern = (zoneName: string): string => {
    const nameLower = zoneName.toLowerCase();

    // Concert halls and theaters get Victorian runner carpet (burgundy/gold)
    if (nameLower.includes('concert') || nameLower.includes('opera')) {
        return 'url(#pattern-victorian)';
    }
    // Theaters and auditoriums get damask
    if (nameLower.includes('theater') || nameLower.includes('theatre') ||
        nameLower.includes('trocadéro') || nameLower.includes('trocadero')) {
        return 'url(#pattern-damask)';
    }
    // Galerie des Machines and industrial halls get industrial carpet
    if (nameLower.includes('galerie') || nameLower.includes('machine') || nameLower.includes('industry') ||
        nameLower.includes('electricity') || nameLower.includes('engine')) {
        return 'url(#pattern-industrial)';
    }
    // Grand halls and French pavilions get green/gold
    if (nameLower.includes('grand') || nameLower.includes('palace') || nameLower.includes('beaux')) {
        return 'url(#pattern-greengold)';
    }
    // Royal/official spaces get royal blue
    if (nameLower.includes('royal') || nameLower.includes('official') || nameLower.includes('president') ||
        nameLower.includes('ministry') || nameLower.includes('government')) {
        return 'url(#pattern-royalblue)';
    }
    // Cultural pavilions
    if (nameLower.includes('japan') || nameLower.includes('nippon')) {
        return 'url(#pattern-tatami)';
    }
    if (nameLower.includes('persia') || nameLower.includes('iran')) {
        return 'url(#pattern-persian)';
    }
    if (nameLower.includes('china') || nameLower.includes('chinese')) {
        return 'url(#pattern-chinese)';
    }
    if (nameLower.includes('tunis') || nameLower.includes('morocco') || nameLower.includes('algeria') ||
        nameLower.includes('ottoman') || nameLower.includes('arab')) {
        return 'url(#pattern-moorish)';
    }
    if (nameLower.includes('egypt')) {
        return 'url(#pattern-egyptian)';
    }
    if (nameLower.includes('italy') || nameLower.includes('italian')) {
        return 'url(#pattern-marble)';
    }
    if (nameLower.includes('france') || nameLower.includes('french')) {
        return 'url(#pattern-parquet)';
    }
    // Salons and exhibition spaces get damask
    if (nameLower.includes('salon') || nameLower.includes('exhibition') || nameLower.includes('display')) {
        return 'url(#pattern-damask)';
    }
    // Default ornate carpet for European pavilions - rotate between variants
    const variants = ['url(#pattern-victorian)', 'url(#pattern-damask)', 'url(#pattern-greengold)'];
    const hash = nameLower.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return variants[hash % variants.length];
};

// Get cultural context for display case contents based on zone name
export const getCulturalContext = (zoneName: string): string => {
    const nameLower = zoneName.toLowerCase();

    if (nameLower.includes('japan') || nameLower.includes('nippon')) return 'japanese';
    if (nameLower.includes('china') || nameLower.includes('chinese') || nameLower.includes('celestial')) return 'chinese';
    if (nameLower.includes('persia') || nameLower.includes('iran')) return 'persian';
    if (nameLower.includes('egypt') || nameLower.includes('cairo')) return 'egyptian';
    if (nameLower.includes('tunis') || nameLower.includes('morocco') || nameLower.includes('algeria') ||
        nameLower.includes('ottoman') || nameLower.includes('arab')) return 'moorish';
    if (nameLower.includes('italy') || nameLower.includes('italian')) return 'italian';
    if (nameLower.includes('africa') || nameLower.includes('congo') || nameLower.includes('senegal')) return 'african';
    if (nameLower.includes('india') || nameLower.includes('indian') || nameLower.includes('raj')) return 'indian';
    if (nameLower.includes('machine') || nameLower.includes('industry') || nameLower.includes('galerie')) return 'industrial';
    if (nameLower.includes('art') || nameLower.includes('beaux') || nameLower.includes('painting')) return 'art';

    return 'french'; // Default
};

// Get statue type based on zone cultural context
export const getStatueType = (zoneName: string): string => {
    const nameLower = zoneName.toLowerCase();

    if (nameLower.includes('japan') || nameLower.includes('nippon') ||
        nameLower.includes('china') || nameLower.includes('chinese') ||
        nameLower.includes('asia') || nameLower.includes('orient')) return 'asian';
    if (nameLower.includes('egypt') || nameLower.includes('cairo') || nameLower.includes('pharaoh')) return 'egyptian';
    if (nameLower.includes('africa') || nameLower.includes('congo') || nameLower.includes('senegal') ||
        nameLower.includes('dahomey') || nameLower.includes('tribal')) return 'african';
    if (nameLower.includes('persia') || nameLower.includes('iran') || nameLower.includes('ottoman') ||
        nameLower.includes('arab') || nameLower.includes('tunis') || nameLower.includes('morocco')) return 'persian';
    if (nameLower.includes('allegory') || nameLower.includes('republic') || nameLower.includes('liberty') ||
        nameLower.includes('france') || nameLower.includes('marianne')) return 'allegorical';

    return 'classical'; // Default Western/Greek style
};

// Material palettes for various surfaces
export const MATERIAL_PALETTES: Record<string, MaterialPalette> = {
    marble: {
        primary: '#E7E5E4',
        secondary: '#D6D3D1',
        highlight: '#F5F5F4',
        shadow: '#A8A29E'
    },
    bronze: {
        primary: '#8B7355',
        secondary: '#9C8566',
        highlight: '#A08464',
        shadow: '#6B5344'
    },
    gold: {
        primary: '#DAA520',
        secondary: '#B8860B',
        highlight: '#FFD700',
        shadow: '#8B7355'
    },
    iron: {
        primary: '#4A5568',
        secondary: '#64748B',
        highlight: '#94A3B8',
        shadow: '#1E293B'
    },
    wood: {
        primary: '#5D4037',
        secondary: '#6D4C41',
        highlight: '#8D6E63',
        shadow: '#3E2723'
    },
    sandstone: {
        primary: '#D4B584',
        secondary: '#C4A574',
        highlight: '#E4C594',
        shadow: '#B4956A'
    }
};

// Get material palette for statue based on seed
export const getStatueMaterial = (seed: number): MaterialPalette => {
    const materials = ['marble', 'bronze', 'sandstone'];
    const idx = Math.floor(seed * materials.length);
    return MATERIAL_PALETTES[materials[idx]] || MATERIAL_PALETTES.marble;
};
