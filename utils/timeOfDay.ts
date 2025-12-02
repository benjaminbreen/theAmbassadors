/**
 * Time-of-day utilities for dynamic sky gradients and water colors
 * Based on 1889 Paris setting - creates atmospheric lighting effects
 */

export interface TimeColors {
  // Sky gradient colors (for border/background) - top to bottom
  skyTop: string;
  skyMid: string;
  skyBottom: string;
  // Water colors
  waterBase: string;
  waterHighlight: string;
  waterDepth: string;
  // Ambient overlay color for vignette
  vignetteColor: string;
  vignetteOpacity: number;
  // Whether it's considered "day" for gameplay purposes
  isDay: boolean;
  // Period name for debugging/display
  period: string;
}

export type TimePeriod =
  | 'night_late'      // 0-4
  | 'dawn'            // 5-6
  | 'early_morning'   // 6-8
  | 'morning'         // 8-10
  | 'late_morning'    // 10-12
  | 'noon'            // 12-14
  | 'early_afternoon' // 14-16
  | 'late_afternoon'  // 16-18
  | 'sunset'          // 18-20
  | 'evening'         // 20-22
  | 'night_early';    // 22-24

/**
 * Get the time period based on hour (0-23)
 */
export function getTimePeriod(hour: number): TimePeriod {
  if (hour >= 0 && hour < 5) return 'night_late';
  if (hour >= 5 && hour < 6) return 'dawn';
  if (hour >= 6 && hour < 8) return 'early_morning';
  if (hour >= 8 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 12) return 'late_morning';
  if (hour >= 12 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 16) return 'early_afternoon';
  if (hour >= 16 && hour < 18) return 'late_afternoon';
  if (hour >= 18 && hour < 20) return 'sunset';
  if (hour >= 20 && hour < 22) return 'evening';
  return 'night_early'; // 22-24
}

/**
 * Color palettes for each time period
 * Inspired by Impressionist paintings of Paris and the Seine
 */
const TIME_PALETTES: Record<TimePeriod, TimeColors> = {
  // Deep night (0-4): Dark blue-black, stars might be visible
  night_late: {
    skyTop: '#0a0c14',      // Near black with blue tint
    skyMid: '#121828',      // Deep navy
    skyBottom: '#1a2235',   // Slightly lighter navy
    waterBase: '#1a4a6a',   // Dark electric blue
    waterHighlight: '#3a7a9a',
    waterDepth: '#0a2a3a',
    vignetteColor: 'rgba(5, 8, 15, 0.9)',
    vignetteOpacity: 0.85,
    isDay: false,
    period: 'Late Night'
  },

  // Dawn (5-6): The sky begins to lighten, purple and rose hues
  dawn: {
    skyTop: '#1a1a2e',      // Deep purple
    skyMid: '#4a3f55',      // Dusty violet
    skyBottom: '#8b6b7b',   // Rose-mauve
    waterBase: '#3a6a8a',   // Light slate blue
    waterHighlight: '#5a9aba',
    waterDepth: '#2a4a6a',
    vignetteColor: 'rgba(30, 25, 40, 0.7)',
    vignetteOpacity: 0.6,
    isDay: false,
    period: 'Dawn'
  },

  // Early morning (6-8): Golden hour begins, warm peachy light
  early_morning: {
    skyTop: '#4a5568',      // Cool gray-blue
    skyMid: '#9b8b7a',      // Warm taupe
    skyBottom: '#d4a574',   // Soft peach-gold
    waterBase: '#4a8ab0',   // Light morning blue
    waterHighlight: '#7ac0e0',
    waterDepth: '#3a6a8a',
    vignetteColor: 'rgba(40, 35, 30, 0.5)',
    vignetteOpacity: 0.4,
    isDay: true,
    period: 'Early Morning'
  },

  // Morning (8-10): Clear bright morning, fresh blue sky
  morning: {
    skyTop: '#5a7a9a',      // Medium blue
    skyMid: '#7a9ab8',      // Soft sky blue
    skyBottom: '#a8c4d8',   // Pale blue with warmth
    waterBase: '#50a0c8',   // Bright electric blue
    waterHighlight: '#80d0f0',
    waterDepth: '#3a80a8',
    vignetteColor: 'rgba(30, 35, 40, 0.35)',
    vignetteOpacity: 0.3,
    isDay: true,
    period: 'Morning'
  },

  // Late morning (10-12): Bright clear sky, this is what we see at 10:30
  late_morning: {
    skyTop: '#5588aa',      // Clear blue
    skyMid: '#78a8c8',      // Bright sky blue
    skyBottom: '#98c8e0',   // Light blue
    waterBase: '#55b0d8',   // Bright electric cyan-blue
    waterHighlight: '#88e0ff',
    waterDepth: '#4090b8',
    vignetteColor: 'rgba(25, 30, 35, 0.3)',
    vignetteOpacity: 0.25,
    isDay: true,
    period: 'Late Morning'
  },

  // Noon (12-14): Brightest, slightly washed out
  noon: {
    skyTop: '#6090b0',      // Bright blue
    skyMid: '#88b8d4',      // Light sky blue
    skyBottom: '#a8d0e8',   // Very light blue, slight haze
    waterBase: '#60b8e0',   // Bright light electric blue
    waterHighlight: '#90e8ff',
    waterDepth: '#4898c0',
    vignetteColor: 'rgba(30, 35, 40, 0.25)',
    vignetteOpacity: 0.2,
    isDay: true,
    period: 'Noon'
  },

  // Early afternoon (14-16): Still bright, warming slightly
  early_afternoon: {
    skyTop: '#5a88a8',      // Clear blue
    skyMid: '#80a8c0',      // Soft blue
    skyBottom: '#a8c8d8',   // Warm pale blue
    waterBase: '#58b0d0',   // Pleasant electric blue
    waterHighlight: '#88e0f8',
    waterDepth: '#4090b0',
    vignetteColor: 'rgba(35, 35, 35, 0.3)',
    vignetteOpacity: 0.25,
    isDay: true,
    period: 'Early Afternoon'
  },

  // Late afternoon (16-18): Golden hour approaching, warm tones
  late_afternoon: {
    skyTop: '#5a7890',      // Muted blue
    skyMid: '#8a9890',      // Warm gray-blue
    skyBottom: '#c8a878',   // Golden haze
    waterBase: '#50a0c0',   // Warmer electric blue
    waterHighlight: '#80d0e8',
    waterDepth: '#3880a0',
    vignetteColor: 'rgba(45, 40, 35, 0.4)',
    vignetteOpacity: 0.35,
    isDay: true,
    period: 'Late Afternoon'
  },

  // Sunset (18-20): Dramatic orange and purple, Monet's Seine
  sunset: {
    skyTop: '#4a4a68',      // Purple-blue
    skyMid: '#8a6a5a',      // Warm mauve
    skyBottom: '#d88850',   // Orange-gold
    waterBase: '#4888a8',   // Reflected blue with warmth
    waterHighlight: '#70b8d0',
    waterDepth: '#306888',
    vignetteColor: 'rgba(50, 35, 30, 0.5)',
    vignetteOpacity: 0.45,
    isDay: false,
    period: 'Sunset'
  },

  // Evening (20-22): Deepening twilight, blue hour
  evening: {
    skyTop: '#1a2030',      // Deep blue
    skyMid: '#3a4058',      // Twilight blue
    skyBottom: '#5a5068',   // Purple-gray
    waterBase: '#3070a0',   // Twilight electric blue
    waterHighlight: '#50a0c8',
    waterDepth: '#205080',
    vignetteColor: 'rgba(20, 20, 35, 0.7)',
    vignetteOpacity: 0.65,
    isDay: false,
    period: 'Evening'
  },

  // Early night (22-24): Full darkness setting in
  night_early: {
    skyTop: '#0c1018',      // Near black
    skyMid: '#141c28',      // Deep navy
    skyBottom: '#1c2838',   // Dark blue
    waterBase: '#1a4868',   // Dark electric blue
    waterHighlight: '#3a7898',
    waterDepth: '#0a2848',
    vignetteColor: 'rgba(8, 10, 18, 0.85)',
    vignetteOpacity: 0.8,
    isDay: false,
    period: 'Night'
  }
};

/**
 * Get colors for the current game time
 */
export function getTimeColors(hour: number): TimeColors {
  const period = getTimePeriod(hour);
  return TIME_PALETTES[period];
}

/**
 * Interpolate between two colors for smoother transitions
 * Returns a color that's partway between color1 and color2
 */
function interpolateColor(color1: string, color2: string, factor: number): string {
  // Parse hex colors
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  // Interpolate
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Get smoothly interpolated colors based on exact time (hour + minute)
 * This creates gradual transitions between time periods
 */
export function getInterpolatedTimeColors(hour: number, minute: number = 0): TimeColors {
  const currentPeriod = getTimePeriod(hour);
  const currentColors = TIME_PALETTES[currentPeriod];

  // Calculate progress within the current period and get next period
  let nextPeriod: TimePeriod;
  let periodProgress: number;

  // Determine period boundaries and calculate interpolation factor
  if (hour >= 0 && hour < 5) {
    // Night late: 0-5 (5 hours)
    periodProgress = ((hour * 60 + minute) / (5 * 60));
    nextPeriod = 'dawn';
  } else if (hour >= 5 && hour < 6) {
    // Dawn: 5-6 (1 hour)
    periodProgress = minute / 60;
    nextPeriod = 'early_morning';
  } else if (hour >= 6 && hour < 8) {
    // Early morning: 6-8 (2 hours)
    periodProgress = ((hour - 6) * 60 + minute) / (2 * 60);
    nextPeriod = 'morning';
  } else if (hour >= 8 && hour < 10) {
    // Morning: 8-10 (2 hours)
    periodProgress = ((hour - 8) * 60 + minute) / (2 * 60);
    nextPeriod = 'late_morning';
  } else if (hour >= 10 && hour < 12) {
    // Late morning: 10-12 (2 hours)
    periodProgress = ((hour - 10) * 60 + minute) / (2 * 60);
    nextPeriod = 'noon';
  } else if (hour >= 12 && hour < 14) {
    // Noon: 12-14 (2 hours)
    periodProgress = ((hour - 12) * 60 + minute) / (2 * 60);
    nextPeriod = 'early_afternoon';
  } else if (hour >= 14 && hour < 16) {
    // Early afternoon: 14-16 (2 hours)
    periodProgress = ((hour - 14) * 60 + minute) / (2 * 60);
    nextPeriod = 'late_afternoon';
  } else if (hour >= 16 && hour < 18) {
    // Late afternoon: 16-18 (2 hours)
    periodProgress = ((hour - 16) * 60 + minute) / (2 * 60);
    nextPeriod = 'sunset';
  } else if (hour >= 18 && hour < 20) {
    // Sunset: 18-20 (2 hours)
    periodProgress = ((hour - 18) * 60 + minute) / (2 * 60);
    nextPeriod = 'evening';
  } else if (hour >= 20 && hour < 22) {
    // Evening: 20-22 (2 hours)
    periodProgress = ((hour - 20) * 60 + minute) / (2 * 60);
    nextPeriod = 'night_early';
  } else {
    // Night early: 22-24 (2 hours)
    periodProgress = ((hour - 22) * 60 + minute) / (2 * 60);
    nextPeriod = 'night_late';
  }

  const nextColors = TIME_PALETTES[nextPeriod];

  // Only interpolate if we're past 50% of the period (smoother feel)
  const interpolationFactor = periodProgress > 0.5 ? (periodProgress - 0.5) * 2 : 0;

  if (interpolationFactor === 0) {
    return currentColors;
  }

  // Interpolate all color values
  return {
    skyTop: interpolateColor(currentColors.skyTop, nextColors.skyTop, interpolationFactor),
    skyMid: interpolateColor(currentColors.skyMid, nextColors.skyMid, interpolationFactor),
    skyBottom: interpolateColor(currentColors.skyBottom, nextColors.skyBottom, interpolationFactor),
    waterBase: interpolateColor(currentColors.waterBase, nextColors.waterBase, interpolationFactor),
    waterHighlight: interpolateColor(currentColors.waterHighlight, nextColors.waterHighlight, interpolationFactor),
    waterDepth: interpolateColor(currentColors.waterDepth, nextColors.waterDepth, interpolationFactor),
    vignetteColor: currentColors.vignetteColor, // Don't interpolate rgba
    vignetteOpacity: currentColors.vignetteOpacity + (nextColors.vignetteOpacity - currentColors.vignetteOpacity) * interpolationFactor,
    isDay: currentColors.isDay,
    period: currentColors.period
  };
}

/**
 * Generate CSS custom properties string for use in style attribute
 */
export function getTimeCSSProperties(hour: number, minute: number = 0): Record<string, string> {
  const colors = getInterpolatedTimeColors(hour, minute);
  return {
    '--sky-top': colors.skyTop,
    '--sky-mid': colors.skyMid,
    '--sky-bottom': colors.skyBottom,
    '--water-base': colors.waterBase,
    '--water-highlight': colors.waterHighlight,
    '--water-depth': colors.waterDepth,
    '--vignette-opacity': colors.vignetteOpacity.toString(),
  };
}
