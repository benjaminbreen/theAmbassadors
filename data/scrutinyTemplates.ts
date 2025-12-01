// Pre-written scrutiny observations for common objects
// These use procedural elements based on time of day, biome, and location

import { BiomeType } from '../types';

export interface ScrutinyTemplate {
  id: string;
  name: string;
  // Array of observation variations - randomly selected
  observations: string[];
  // Time-based modifiers that get appended/inserted
  timeModifiers: {
    morning: string[];
    afternoon: string[];
    evening: string[];
    night: string[];
  };
  // Biome-specific observations (optional - if not present, uses default)
  biomeVariations?: Partial<Record<BiomeType, string[]>>;
  // Mood modifiers based on malaise level
  malaiseModifiers?: {
    low: string[];   // < 30
    medium: string[]; // 30-60
    high: string[];   // > 60
  };
}

// Helper to get current time of day
export const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

// Helper to pick random from array
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const SCRUTINY_TEMPLATES: Record<string, ScrutinyTemplate> = {
  BENCH: {
    id: 'BENCH',
    name: 'Bench',
    observations: [
      "The weighty cast iron, intricately scrolled, bespoke an era marrying industrial might with a craftsman's lingering grace, its polished oak slats reflecting a quiet, public dignity.",
      "A municipal seat of admirable solidity, the iron armrests worn smooth by countless visitors seeking respite from the fair's overwhelming spectacle.",
      "The bench, painted that peculiar green one finds only in French public gardens, offered the promise of contemplation amid the relentless forward march of progress.",
      "Its slats bore the impressions of a thousand sittings—strangers made momentarily intimate by proximity, each leaving some invisible residue of their wonder or fatigue.",
      "The ironwork suggested the hand of a designer who understood that even rest required ornamentation, that even pause demanded a certain aesthetic consideration."
    ],
    timeModifiers: {
      morning: [
        "Morning dew still clings to its surface.",
        "The early light catches its metalwork with particular clarity.",
        "At this hour, it remains blessedly unoccupied."
      ],
      afternoon: [
        "The afternoon crowds have polished its surfaces to a high sheen.",
        "It has absorbed the warmth of the sun.",
        "The shadows of passing visitors flicker across its slats."
      ],
      evening: [
        "The gaslight lends it a melancholy dignity.",
        "In the gloaming, it seems almost to invite confession.",
        "The evening's first chill makes its promise of rest more poignant."
      ],
      night: [
        "The lamplight transforms its mundane presence into something almost theatrical.",
        "At this hour, it belongs to the solitary and the sleepless.",
        "It waits, patient as furniture always waits, for morning's return."
      ]
    },
    biomeVariations: {
      GARDEN: [
        "Situated beneath a chestnut, it commands a view of carefully tended flowerbeds—nature disciplined into art.",
        "The garden bench, that quintessential prop of European leisure, invites the kind of extended sitting Americans find so difficult to justify."
      ],
      ESPLANADE: [
        "Positioned to survey the promenade, it offers a front-row seat to the great procession of modern life.",
        "From this vantage, one might observe the endless parade of humanity without being observed in turn."
      ]
    }
  },

  LAMP: {
    id: 'LAMP',
    name: 'Gas Lamp',
    observations: [
      "The lamp post, that sentinel of civilization, rises with cast-iron assurance—its glass globe containing the very essence of the modern age.",
      "Ornate beyond any practical necessity, the lamppost speaks to the French conviction that utility need not preclude beauty.",
      "A triumph of municipal engineering transformed, by sheer decorative will, into something approaching street sculpture.",
      "The gaslight fixture, with its elaborate scrollwork, suggests that even illumination must be aestheticized in this city of light.",
      "Rising some twelve feet, the lamp announces the victory of human ingenuity over the ancient tyranny of darkness."
    ],
    timeModifiers: {
      morning: [
        "Dormant now, awaiting its nocturnal vocation.",
        "The morning renders it almost superfluous.",
        "Unlit, it reveals the craftsmanship usually obscured by its own radiance."
      ],
      afternoon: [
        "The sun makes a mockery of its purpose.",
        "Standing proud but presently unnecessary.",
        "Its glass catches the afternoon light like captured fire."
      ],
      evening: [
        "Already the lamplighter has paid his visit, leaving this small sun in his wake.",
        "The gas hisses its evening song.",
        "It flickers to life with the reliability of ritual."
      ],
      night: [
        "Its light pools on the pavement like a benediction.",
        "The flame within dances against the glass, tireless and contained.",
        "It holds back the darkness with steady, manufactured courage."
      ]
    }
  },

  TREE: {
    id: 'TREE',
    name: 'Chestnut Tree',
    observations: [
      "The chestnut, that most Parisian of trees, spreads its canopy with the generosity of old wealth, offering shade without asking anything in return.",
      "Its trunk, thick as a column, has witnessed decades of exposition and revolution alike, indifferent to the human dramas unfolding in its shadow.",
      "The characteristic five-fingered leaves rustled with secrets accumulated over perhaps a century of silent observation.",
      "A marronier of considerable age, its presence predating the fair by generations, lending borrowed permanence to this temporary spectacle.",
      "The bark, deeply furrowed, suggests a patience that puts human ambition in proper perspective."
    ],
    timeModifiers: {
      morning: [
        "The morning light filters through its leaves in shifting patterns.",
        "Birdsong emanates from its upper branches.",
        "Dew still glistens on its broad leaves."
      ],
      afternoon: [
        "Its shade offers precious respite from the day's warmth.",
        "The leaves whisper their endless susurration.",
        "Beneath its canopy, the temperature drops by several blessed degrees."
      ],
      evening: [
        "The setting sun gilds its leaves to bronze.",
        "Its silhouette grows more dramatic against the fading sky.",
        "The evening breeze sets its branches to gentle motion."
      ],
      night: [
        "Its dark mass looms like a presence from a gothic tale.",
        "The gaslight illuminates only its lowest branches.",
        "It creaks and sighs with the patience of the ancient."
      ]
    }
  },

  PAPER: {
    id: 'PAPER',
    name: 'Discarded Newspaper',
    observations: [
      "Le Figaro, somewhat the worse for its abandonment, its headlines already becoming history with each passing moment.",
      "A copy of Le Petit Journal, its pages ruffled by passing feet, offering yesterday's certainties to today's indifference.",
      "The newsprint, already yellowing, speaks to the ephemeral nature of what we call current events.",
      "Someone's morning reading, now trampled into archaeological evidence of an ordinary day.",
      "The journal, cast aside perhaps mid-article, suggests an attention span defeated by spectacle."
    ],
    timeModifiers: {
      morning: [
        "Still relatively crisp, recently abandoned.",
        "This morning's edition, already obsolete.",
        "The ink remains fresh enough to smudge."
      ],
      afternoon: [
        "Footprints have decorated its front page.",
        "The afternoon wind threatens to carry it elsewhere.",
        "It has acquired the weariness of the day."
      ],
      evening: [
        "The gathering damp has begun its work.",
        "It will not survive the night.",
        "The evening light makes its headlines almost unreadable."
      ],
      night: [
        "A ghost of information, barely visible.",
        "The dew has rendered it pulpy and sad.",
        "It speaks of the morning's concerns, now forgotten."
      ]
    }
  },

  FOUNTAIN: {
    id: 'FOUNTAIN',
    name: 'The Luminous Fountain',
    observations: [
      "The fontaine lumineuse—that miracle of hydraulic engineering wed to electric ambition—sends its illuminated waters skyward in triumph over gravity itself.",
      "Water and light combine in a spectacle that seems to announce the century's faith in progress made visible, made liquid, made radiant.",
      "The fountain's electric lights transform its spray into something almost supernatural—nature improved upon, perfected, electrified.",
      "Here water performs its nightly miracle, dancing to the rhythm of invisible machinery, lit from within by the new fire of Edison.",
      "A cathedral of water and light, it represents everything this fair wishes to proclaim about human mastery over the elements."
    ],
    timeModifiers: {
      morning: [
        "Dormant now, waiting for darkness to reveal its true purpose.",
        "Without its lights, it seems merely a fountain—impressive, but mortal.",
        "The morning light reveals the bronze tritons in unforgiving detail."
      ],
      afternoon: [
        "The afternoon sun competes with its electric promise.",
        "Visitors photograph it, though it keeps its secrets for evening.",
        "The water plays on, rehearsing for tonight's illumination."
      ],
      evening: [
        "The lights begin their nightly miracle as darkness falls.",
        "Crowds gather for the spectacle, that daily rebirth of wonder.",
        "It awakens to its true purpose as the sun retreats."
      ],
      night: [
        "It blazes with impossible color, water transformed to liquid light.",
        "The crowd gasps with each chromatic shift.",
        "Here is the future, made manifest in spray and spectrum."
      ]
    }
  },

  TELESCOPE: {
    id: 'TELESCOPE',
    name: 'Observation Telescope',
    observations: [
      "The brass telescope, mounted on its swivel with German precision, promises to collapse distance itself into a coin-operated convenience.",
      "A mechanical eye for hire, it offers to extend one's vision beyond its natural limits—for a modest fee.",
      "The telescope's polished barrel suggests the era's faith that technology might grant us not merely utility but new modes of seeing.",
      "Oriented toward the city below, it transforms spectators into voyeurs of the urban spectacle.",
      "The viewing instrument, with its elaborate mounting, speaks to the democratization of a perspective once reserved for the elevated few."
    ],
    timeModifiers: {
      morning: [
        "The morning haze limits its revelations.",
        "Few visitors have yet discovered this mechanical eye.",
        "The early light offers its clearest visions."
      ],
      afternoon: [
        "The afternoon crowds queue for their moment of extended sight.",
        "Heat shimmer distorts the distant views.",
        "The brass has grown warm to the touch."
      ],
      evening: [
        "The city lights begin to offer new subjects for observation.",
        "The evening air grants unusual clarity.",
        "As darkness falls, new perspectives emerge."
      ],
      night: [
        "It reveals a city transformed by gaslight and electricity.",
        "The nocturnal Paris offers its secret self to the patient viewer.",
        "One might observe the illuminated boulevards from this altitude."
      ]
    }
  },

  PYLON: {
    id: 'PYLON',
    name: 'Tower Pylon',
    observations: [
      "The iron lattice rises with a confidence that approaches arrogance—Eiffel's answer to those who called his vision impossible.",
      "Up close, the pylon reveals its riveted reality: not one thing but thousands, joined in democratic collaboration.",
      "Each rivet speaks of a worker's hammer stroke, the tower's apparent effortlessness belied by this evidence of labor.",
      "The angle of the leg, calculated to resist winds that will never manage to topple it, expresses mathematics made visible.",
      "The iron here has achieved a kind of poetry—industrial verse written in metal against the sky."
    ],
    timeModifiers: {
      morning: [
        "The morning sun illuminates the intricate lacework of iron.",
        "At this hour, one can almost hear the metal expanding in the warmth.",
        "The structure seems to grow upward toward the light."
      ],
      afternoon: [
        "Shadows create geometric patterns on the ground below.",
        "The iron radiates the stored heat of the sun.",
        "From this angle, the engineering appears almost organic."
      ],
      evening: [
        "The setting sun turns the iron to gold.",
        "The tower's lights begin their nightly transformation.",
        "The structure seems to glow from within."
      ],
      night: [
        "The electric lights outline its skeleton against the dark.",
        "It becomes a constellation, a structure of light rather than iron.",
        "The night reveals it as beacon, not merely building."
      ]
    }
  },

  TOWER: {
    id: 'TOWER',
    name: 'Eiffel Tower Pylon',
    observations: [
      "The base of Monsieur Eiffel's controversial creation, where iron meets earth in a marriage of unprecedented ambition.",
      "Here the tower's mighty legs grip the Champ de Mars with the determination of a structure meant to outlast its critics.",
      "The arched entrance, grand as a cathedral's portal, suggests that engineering too may aspire to the sublime.",
      "Standing beneath the latticed iron, one feels the weight of the structure's improbability pressing down—yet it stands.",
      "The pylon embodies the century's great gamble: that science might achieve what art alone could not."
    ],
    timeModifiers: {
      morning: [
        "The morning light streams through the iron lattice.",
        "At this hour, the structure seems almost delicate.",
        "Early visitors queue already for the elevators."
      ],
      afternoon: [
        "Crowds swirl around the base in ceaseless motion.",
        "The iron casts intricate shadows on the pavement.",
        "The afternoon heat rises from the gravel below."
      ],
      evening: [
        "The gas lamps begin their work around the perimeter.",
        "The tower prepares for its nightly illumination.",
        "Evening crowds gather to witness the lighting."
      ],
      night: [
        "The tower blazes above, a torch of the new age.",
        "From here, the structure seems to pierce the stars themselves.",
        "The night belongs to Eiffel's impossible dream."
      ]
    }
  }
};

// Generate a complete scrutiny observation
export const generateLocalScrutiny = (
  objectId: string,
  objectName: string,
  biome?: BiomeType,
  malaise: number = 0
): string => {
  const template = SCRUTINY_TEMPLATES[objectId];

  if (!template) {
    // Return a generic observation for unknown objects
    return `You examine the ${objectName} closely, noting its construction and purpose within the greater spectacle of the Exposition.`;
  }

  const timeOfDay = getTimeOfDay();

  // Start with base observation
  let observation = '';

  // Check for biome-specific variation first
  if (template.biomeVariations && biome && template.biomeVariations[biome]) {
    observation = pick(template.biomeVariations[biome]!);
  } else {
    observation = pick(template.observations);
  }

  // Add time modifier
  const timeModifier = pick(template.timeModifiers[timeOfDay]);
  observation = `${observation} ${timeModifier}`;

  // Optionally add malaise modifier
  if (template.malaiseModifiers) {
    let malaiseLevel: 'low' | 'medium' | 'high' = 'low';
    if (malaise > 60) malaiseLevel = 'high';
    else if (malaise > 30) malaiseLevel = 'medium';

    const malaiseModifier = pick(template.malaiseModifiers[malaiseLevel]);
    if (malaiseModifier) {
      observation = `${observation} ${malaiseModifier}`;
    }
  }

  return observation;
};

// Check if we have a local template for this object
export const hasLocalTemplate = (objectId: string): boolean => {
  return objectId in SCRUTINY_TEMPLATES;
};
