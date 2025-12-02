
import { NPC, PortraitConfig, BiomeType } from '../types';
import { NPC_PROFESSIONS } from '../constants';
import { generateRandomArchetype, generateAppearanceBasedArchetype } from './portraitMapper';
import {
    SkinTone, HairColorType, AppearanceProfile,
    SKIN_TONE_HEX, HAIR_COLOR_HEX,
    HISTORICAL_FIGURES, HistoricalFigure, getAppearanceColors
} from '../data/historicalFigures';
import {
    generateNPCBiography, generateFirstImpression, NAME_SETS
} from './npcBiographyGenerator';

// Helper: Random Item from Array
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Weighted random selection
const weightedPick = <T>(items: T[], weights: number[]): T => {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < items.length; i++) {
        random -= weights[i];
        if (random <= 0) return items[i];
    }
    return items[items.length - 1];
};

/**
 * Historically accurate skin tone distribution for 1889 Paris Exposition
 *
 * Demographics breakdown:
 * - ~90% French and Western European (fair, pale, tan, olive)
 * - ~5% Eastern European / Russian (mostly pale, fair)
 * - ~3% American (mostly pale/fair, ~5% of Americans were African American)
 * - ~2% Colonial subjects, delegates from Africa, Asia, Middle East
 *
 * This gives roughly:
 * - 60% fair/pale (Northern European)
 * - 25% tan/olive (Southern European, Mediterranean)
 * - 8% golden (East Asian, some mixed heritage)
 * - 5% warm_brown/dark (African, Caribbean, South Asian)
 * - 2% deep (Central/West African)
 */
const SKIN_TONE_WEIGHTS: { tone: SkinTone; weight: number }[] = [
    { tone: 'fair', weight: 35 },
    { tone: 'pale', weight: 30 },
    { tone: 'tan', weight: 15 },
    { tone: 'olive', weight: 12 },
    { tone: 'golden', weight: 4 },
    { tone: 'warm_brown', weight: 2.5 },
    { tone: 'dark', weight: 1 },
    { tone: 'deep', weight: 0.5 }
];

/**
 * Hair color distribution (varies by skin tone)
 */
const HAIR_COLOR_BY_SKIN: Record<SkinTone, { color: HairColorType; weight: number }[]> = {
    fair: [
        { color: 'blonde', weight: 25 },
        { color: 'light_brown', weight: 25 },
        { color: 'brown', weight: 20 },
        { color: 'auburn', weight: 10 },
        { color: 'red', weight: 8 },
        { color: 'dark_brown', weight: 8 },
        { color: 'gray', weight: 3 },
        { color: 'white', weight: 1 }
    ],
    pale: [
        { color: 'brown', weight: 30 },
        { color: 'dark_brown', weight: 25 },
        { color: 'light_brown', weight: 15 },
        { color: 'blonde', weight: 10 },
        { color: 'auburn', weight: 8 },
        { color: 'black', weight: 5 },
        { color: 'gray', weight: 5 },
        { color: 'red', weight: 2 }
    ],
    tan: [
        { color: 'dark_brown', weight: 35 },
        { color: 'brown', weight: 30 },
        { color: 'black', weight: 20 },
        { color: 'auburn', weight: 5 },
        { color: 'gray', weight: 8 },
        { color: 'white', weight: 2 }
    ],
    olive: [
        { color: 'black', weight: 40 },
        { color: 'dark_brown', weight: 35 },
        { color: 'brown', weight: 15 },
        { color: 'gray', weight: 8 },
        { color: 'white', weight: 2 }
    ],
    golden: [
        { color: 'black', weight: 70 },
        { color: 'dark_brown', weight: 20 },
        { color: 'gray', weight: 8 },
        { color: 'white', weight: 2 }
    ],
    warm_brown: [
        { color: 'black', weight: 60 },
        { color: 'dark_brown', weight: 25 },
        { color: 'gray', weight: 10 },
        { color: 'white', weight: 5 }
    ],
    dark: [
        { color: 'black', weight: 75 },
        { color: 'dark_brown', weight: 15 },
        { color: 'gray', weight: 8 },
        { color: 'white', weight: 2 }
    ],
    deep: [
        { color: 'black', weight: 80 },
        { color: 'dark_brown', weight: 10 },
        { color: 'gray', weight: 7 },
        { color: 'white', weight: 3 }
    ]
};

// Clothing colors based on social class/profession
const FORMAL_CLOTHES_COLORS = ['#1a1a2e', '#1a237e', '#263238', '#3e2723', '#4a148c'];
const WORKING_CLOTHES_COLORS = ['#4a3428', '#5d4037', '#424242', '#37474f', '#4e342e'];
const BOHEMIAN_CLOTHES_COLORS = ['#4a148c', '#880e4f', '#004d40', '#b71c1c', '#1a237e'];
const HAT_COLORS = ['#000000', '#3e2723', '#5d4037', '#424242', '#1a1a2e'];

/**
 * Generate a weighted skin tone based on historical demographics
 */
const generateSkinTone = (): SkinTone => {
    const tones = SKIN_TONE_WEIGHTS.map(s => s.tone);
    const weights = SKIN_TONE_WEIGHTS.map(s => s.weight);
    return weightedPick(tones, weights);
};

/**
 * Generate hair color appropriate for the skin tone
 */
const generateHairColor = (skinTone: SkinTone, age: number): HairColorType => {
    const hairOptions = HAIR_COLOR_BY_SKIN[skinTone];
    const colors = hairOptions.map(h => h.color);
    let weights = hairOptions.map(h => h.weight);

    // Age-based hair graying
    if (age >= 40) {
        const grayChance = Math.min(80, (age - 40) * 2); // 0% at 40, 80% at 80
        // Redistribute weights to favor gray/white
        weights = weights.map((w, i) => {
            if (colors[i] === 'gray' || colors[i] === 'white') {
                return w + (grayChance / 2);
            }
            return w * (1 - grayChance / 100);
        });
    }

    return weightedPick(colors, weights);
};

/**
 * Generate a complete appearance profile for an NPC
 */
const generateAppearanceProfile = (
    gender: 'male' | 'female' | 'non-binary',
    profession: string,
    age: number
): AppearanceProfile => {
    const skinTone = generateSkinTone();
    const hairColor = generateHairColor(skinTone, age);

    // Determine clothing style based on profession
    const prof = profession.toLowerCase();
    let clothingStyle: AppearanceProfile['clothingStyle'] = 'formal_suit';
    let hatStyle: AppearanceProfile['hat'] = 'bowler';

    if (gender === 'female') {
        if (prof.includes('servant') || prof.includes('maid') || prof.includes('worker')) {
            clothingStyle = 'servant_dress';
            hatStyle = 'bonnet';
        } else if (prof.includes('artist') || prof.includes('bohemian') || prof.includes('actress') || prof.includes('dancer')) {
            clothingStyle = 'exotic_female';
            hatStyle = Math.random() > 0.5 ? 'wide_brim' : 'none';
        } else {
            clothingStyle = Math.random() > 0.3 ? 'bustle_dress' : 'walking_dress';
            hatStyle = Math.random() > 0.5 ? 'wide_brim' : 'bonnet';
        }
    } else {
        if (prof.includes('military') || prof.includes('soldier') || prof.includes('officer')) {
            clothingStyle = 'military';
            hatStyle = 'kepi';
        } else if (prof.includes('worker') || prof.includes('laborer') || prof.includes('mechanic')) {
            clothingStyle = 'working_class';
            hatStyle = 'flat_cap';
        } else if (prof.includes('artist') || prof.includes('painter') || prof.includes('poet') || prof.includes('bohemian')) {
            clothingStyle = 'bohemian';
            hatStyle = 'beret';
        } else if (prof.includes('diplomat') || prof.includes('ambassador') || prof.includes('aristocrat')) {
            clothingStyle = 'morning_coat';
            hatStyle = 'top_hat';
        } else if (prof.includes('merchant') && (skinTone === 'olive' || skinTone === 'tan')) {
            clothingStyle = 'exotic_male';
            hatStyle = 'fez';
        } else {
            clothingStyle = Math.random() > 0.5 ? 'formal_suit' : 'morning_coat';
            hatStyle = Math.random() > 0.5 ? 'bowler' : 'top_hat';
        }
    }

    // Determine facial hair for men
    let facialHair: AppearanceProfile['facialHair'] = 'none';
    if (gender === 'male') {
        const facialHairRoll = Math.random();
        if (facialHairRoll > 0.7) {
            facialHair = 'full_beard';
        } else if (facialHairRoll > 0.4) {
            facialHair = 'mustache';
        } else if (facialHairRoll > 0.25) {
            facialHair = 'goatee';
        } else if (facialHairRoll > 0.15) {
            facialHair = 'mutton_chops';
        } else if (facialHairRoll > 0.1) {
            facialHair = 'imperial';
        }
    }

    // Select clothing colors based on style
    let primaryColor: string;
    let secondaryColor: string;

    if (clothingStyle === 'working_class' || clothingStyle === 'servant_dress') {
        primaryColor = pick(WORKING_CLOTHES_COLORS);
        secondaryColor = pick(WORKING_CLOTHES_COLORS);
    } else if (clothingStyle === 'bohemian' || clothingStyle === 'exotic_male' || clothingStyle === 'exotic_female') {
        primaryColor = pick(BOHEMIAN_CLOTHES_COLORS);
        secondaryColor = pick(HAT_COLORS);
    } else {
        primaryColor = pick(FORMAL_CLOTHES_COLORS);
        secondaryColor = pick(HAT_COLORS);
    }

    return {
        skinTone,
        hairColor,
        eyeColor: skinTone === 'fair' || skinTone === 'pale'
            ? pick(['#5a7a8a', '#5a6a5a', '#6a5a4a', '#4a5a6a'])
            : '#3a3a2a',
        facialHair,
        clothingStyle,
        hat: hatStyle,
        skinHex: SKIN_TONE_HEX[skinTone],
        hairHex: HAIR_COLOR_HEX[hairColor],
        primaryClothingHex: primaryColor,
        secondaryClothingHex: secondaryColor
    };
};

// Track spawned historical figures to prevent duplicates
const spawnedHistoricalFigures = new Set<string>();

/**
 * Try to spawn a historical figure based on biome and chance
 * Returns the figure if spawned, null otherwise
 */
export const trySpawnHistoricalFigure = (biome: BiomeType): HistoricalFigure | null => {
    // Base 5% chance to even attempt spawning a historical figure
    if (Math.random() > 0.05) return null;

    // Filter out already-spawned figures
    const availableFigures = HISTORICAL_FIGURES.filter(f => !spawnedHistoricalFigures.has(f.id));
    if (availableFigures.length === 0) return null;

    // Calculate weighted chances for each figure based on biome
    const weights = availableFigures.map(figure => {
        const baseWeight = figure.spawnWeight;
        const biomeMultiplier = figure.preferredBiomes.includes(biome) ? figure.biomeMultiplier : 1;
        return baseWeight * biomeMultiplier;
    });

    // Roll to see if we spawn anyone
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const spawnThreshold = totalWeight * 0.1; // Only spawn 10% of the time even when checking

    if (Math.random() * totalWeight > spawnThreshold) return null;

    // Pick a figure based on weights
    const figure = weightedPick(availableFigures, weights);

    // Mark as spawned
    spawnedHistoricalFigures.add(figure.id);

    return figure;
};

/**
 * Reset the spawned historical figures tracker (e.g., when changing zones)
 */
export const resetHistoricalFigureSpawns = () => {
    spawnedHistoricalFigures.clear();
};

/**
 * Select nationality based on skin tone and weighted probabilities
 * Most visitors to the 1889 Exposition were French and European
 */
const selectNationality = (skinTone: SkinTone): string => {
    // Different nationality pools based on skin tone
    if (skinTone === 'golden') {
        return weightedPick(
            ['japanese', 'chinese', 'french'],
            [40, 40, 20]
        );
    }
    if (skinTone === 'warm_brown' || skinTone === 'dark' || skinTone === 'deep') {
        return weightedPick(
            ['african_diaspora', 'arabic', 'french', 'american'],
            [30, 30, 20, 20]
        );
    }
    if (skinTone === 'olive' || skinTone === 'tan') {
        return weightedPick(
            ['french', 'italian', 'spanish', 'arabic'],
            [40, 25, 20, 15]
        );
    }
    // Fair and pale - mostly French, some other Europeans and Americans
    return weightedPick(
        ['french', 'british', 'american', 'german', 'russian', 'italian'],
        [55, 12, 10, 10, 8, 5]
    );
};

export const generateNPC = (zoneId: string, x: number, y: number, biome?: BiomeType): NPC => {
    // First, check if we should spawn a historical figure
    if (biome) {
        const historicalFigure = trySpawnHistoricalFigure(biome);
        if (historicalFigure) {
            return generateNPCFromHistoricalFigure(historicalFigure, zoneId, x, y);
        }
    }

    const genderRoll = Math.random();
    const gender: 'male' | 'female' | 'non-binary' =
        genderRoll > 0.95 ? 'non-binary' :
        genderRoll > 0.5 ? 'female' : 'male';

    const profession = pick(NPC_PROFESSIONS);

    // Generate age (18-80, weighted toward middle ages)
    const age = Math.floor(18 + Math.random() * 30 + Math.random() * 32);

    // Generate appearance profile with historically accurate demographics
    const appearance = generateAppearanceProfile(gender, profession, age);

    // Select nationality based on skin tone
    const nationality = selectNationality(appearance.skinTone);
    const nameSet = NAME_SETS[nationality] || NAME_SETS.french;

    // Pick appropriate names from nationality
    const isFemale = gender === 'female';
    const firstName = isFemale ? pick(nameSet.female) : pick(nameSet.male);
    const surname = pick(nameSet.surnames);

    // Generate biography with rich procedural text
    const biography = generateNPCBiography(firstName, surname, gender, profession, age, appearance);

    // Generate first impression description
    const description = generateFirstImpression(gender, age, profession, appearance);

    // Generate combat stats (1-20) - influenced by age and profession
    const baseWit = Math.floor(5 + Math.random() * 10);
    const baseObs = Math.floor(5 + Math.random() * 10);
    const baseComp = Math.floor(5 + Math.random() * 10);

    // Age modifiers: older = wiser but slower
    const ageModifier = age > 60 ? 3 : age > 40 ? 1 : age < 25 ? -1 : 0;

    // Profession modifiers
    let profMod = { wit: 0, obs: 0, comp: 0 };
    const prof = profession.toLowerCase();
    if (prof.includes('critic') || prof.includes('journalist') || prof.includes('poet')) {
        profMod = { wit: 3, obs: 2, comp: -1 };
    } else if (prof.includes('diplomat') || prof.includes('aristocrat')) {
        profMod = { wit: 2, obs: 1, comp: 3 };
    } else if (prof.includes('engineer') || prof.includes('inventor')) {
        profMod = { wit: 1, obs: 3, comp: 1 };
    } else if (prof.includes('artist') || prof.includes('flâneur')) {
        profMod = { wit: 2, obs: 3, comp: 0 };
    } else if (prof.includes('worker') || prof.includes('servant')) {
        profMod = { wit: -1, obs: 0, comp: 2 };
    }

    const combatStats = {
        wit: Math.min(20, Math.max(1, baseWit + ageModifier + profMod.wit)),
        observation: Math.min(20, Math.max(1, baseObs + ageModifier + profMod.obs)),
        composure: Math.min(20, Math.max(1, baseComp + ageModifier + profMod.comp))
    };

    // Use appearance profile for colors
    const colors = {
        skin: appearance.skinHex || SKIN_TONE_HEX[appearance.skinTone],
        hair: appearance.hairHex || HAIR_COLOR_HEX[appearance.hairColor],
        primary: appearance.primaryClothingHex || '#1a1a2e',
        secondary: appearance.secondaryClothingHex || '#3e2723'
    };

    const portrait: PortraitConfig = {
        hairStyle: Math.random() > 0.7 ? 'WILD' : 'GENTLEMAN',
        hairColor: 'text-gray-800',
        skinColor: 'text-amber-100',
        clothesColor: 'text-gray-600',
        facialHair: appearance.facialHair === 'full_beard' ? 'BEARD' :
                    appearance.facialHair === 'mustache' ? 'MOUSTACHE' : 'NONE',
        accessory: Math.random() > 0.8 ? 'MONOCLE' : 'NONE'
    };

    // Generate portrait archetype based on appearance
    const portraitArchetype = generateAppearanceBasedArchetype(gender, profession, age, appearance);

    return {
        id: `npc_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,
        name: `${firstName} ${surname}`,
        profession,
        description,
        goal: biography.goal,
        dialogueStyle: biography.dialogueStyle,
        historicalNote: biography.biography,
        age,
        gender,
        combatStats,
        location: {
            x,
            y,
            zoneId,
            direction: pick(['N', 'S', 'E', 'W'])
        },
        history: [`Born in ${biography.birthplace.city}`, `Currently residing in ${biography.currentResidence.city}`],
        colors,
        portrait,
        portraitArchetype,
        avatarChar: firstName[0],
        appearance,
        birthplace: biography.birthplace,
        currentResidence: biography.currentResidence,
        nationality: biography.nationality
    };
};

/**
 * Generate an NPC from a historical figure
 */
export const generateNPCFromHistoricalFigure = (
    figure: HistoricalFigure,
    zoneId: string,
    x: number,
    y: number
): NPC => {
    const appearanceColors = getAppearanceColors(figure.appearance);

    return {
        id: `historical_${figure.id}_${Date.now()}`,
        name: figure.name,
        profession: figure.profession,
        description: figure.description,
        goal: `${figure.knownFor[0]}`,
        dialogueStyle: figure.dialogueStyle,
        historicalNote: figure.historicalNote,
        age: figure.age,
        gender: figure.gender,
        combatStats: figure.combatStats,
        location: {
            x,
            y,
            zoneId,
            direction: pick(['N', 'S', 'E', 'W'])
        },
        history: [`${figure.name} arrived at the Exposition`, `Known for: ${figure.knownFor.join(', ')}`],
        colors: {
            skin: appearanceColors.skinHex,
            hair: appearanceColors.hairHex,
            primary: appearanceColors.primaryClothingHex,
            secondary: appearanceColors.secondaryClothingHex
        },
        portrait: {
            hairStyle: figure.appearance.hairColor === 'bald' ? 'BALD' :
                       figure.appearance.clothingStyle === 'bohemian' ? 'WILD' : 'GENTLEMAN',
            hairColor: 'text-gray-800',
            skinColor: 'text-amber-100',
            clothesColor: 'text-gray-600',
            facialHair: figure.appearance.facialHair === 'full_beard' ? 'BEARD' :
                        figure.appearance.facialHair === 'mustache' ? 'MOUSTACHE' : 'NONE',
            accessory: 'NONE'
        },
        portraitArchetype: figure.portraitArchetype,
        avatarChar: figure.firstName[0],
        appearance: figure.appearance,
        isHistoricalFigure: true,
        historicalFigureId: figure.id
    };
};
