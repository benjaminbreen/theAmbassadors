/**
 * Maps nationalities to their flag emojis
 * Using flags appropriate for the 1889 period where possible
 */

export const NATIONALITY_FLAGS: Record<string, string> = {
    // European nations
    'French': '🇫🇷',
    'British': '🇬🇧',
    'German': '🇩🇪',
    'Italian': '🇮🇹',
    'Spanish': '🇪🇸',
    'Russian': '🇷🇺',
    'Austrian': '🇦🇹',
    'Dutch': '🇳🇱',
    'Belgian': '🇧🇪',
    'Swiss': '🇨🇭',
    'Portuguese': '🇵🇹',
    'Swedish': '🇸🇪',
    'Norwegian': '🇳🇴',
    'Danish': '🇩🇰',
    'Greek': '🇬🇷',
    'Polish': '🇵🇱',

    // Americas
    'American': '🇺🇸',
    'Brazilian': '🇧🇷',
    'Argentine': '🇦🇷',
    'Mexican': '🇲🇽',
    'Canadian': '🇨🇦',
    'Cuban': '🇨🇺',
    'Haitian': '🇭🇹',
    'Venezuelan': '🇻🇪',
    'Colombian': '🇨🇴',
    'Peruvian': '🇵🇪',
    'Chilean': '🇨🇱',

    // Asia
    'Japanese': '🇯🇵',
    'Chinese': '🇨🇳',
    'Indian': '🇮🇳',
    'Persian': '🇮🇷',
    'Siamese': '🇹🇭',
    'Korean': '🇰🇷',

    // Middle East & North Africa
    'Ottoman': '🇹🇷',
    'Turkish': '🇹🇷',
    'Egyptian': '🇪🇬',
    'Moroccan': '🇲🇦',
    'Tunisian': '🇹🇳',
    'Algerian': '🇩🇿',
    'Lebanese': '🇱🇧',
    'Syrian': '🇸🇾',

    // Sub-Saharan Africa
    'Senegalese': '🇸🇳',
    'Ethiopian': '🇪🇹',
    'Liberian': '🇱🇷',
    'South African': '🇿🇦',

    // Oceania
    'Australian': '🇦🇺',
    'New Zealander': '🇳🇿',
};

/**
 * Get flag emoji for a nationality
 * Returns a globe emoji 🌍 if nationality not found
 */
export const getFlagEmoji = (nationality?: string): string => {
    if (!nationality) return '🌍';
    return NATIONALITY_FLAGS[nationality] || '🌍';
};

/**
 * Get nationality with flag as a formatted string
 */
export const getNationalityWithFlag = (nationality?: string): string => {
    const flag = getFlagEmoji(nationality);
    return `${flag} ${nationality || 'Unknown'}`;
};
