// Jamesian Phrases - Fragments of consciousness that come to Henry James unbidden
// Observational, specific, grounded in sensory detail and lived experience
// The internal voice of a man watching, remembering, noticing

export interface JamesianPhrase {
  id: string;
  text: string;
  theme: 'memory' | 'observation' | 'mortality' | 'art' | 'love' | 'society' | 'consciousness' | 'america' | 'europe';
  references?: string[]; // Real people referenced
}

export const JAMESIAN_PHRASES: JamesianPhrase[] = [
  // SPECIFIC OBSERVATIONS - grounded, sensory
  {
    id: 'phrase_obs_1',
    text: 'The way she held her parasol—tilted just so against the light—reminded me unbearably of Aunt Kate on the Newport piazza, summer of sixty-two.',
    theme: 'observation',
    references: ['Catherine Walsh']
  },
  {
    id: 'phrase_obs_2',
    text: 'His waistcoat buttons strain against the fabric. One feels the whole weight of provincial prosperity in that straining.',
    theme: 'observation'
  },
  {
    id: 'phrase_obs_3',
    text: 'The particular angle at which a Frenchwoman adjusts her hat—there is a whole philosophy of self-regard contained in that gesture.',
    theme: 'observation'
  },
  {
    id: 'phrase_obs_4',
    text: 'Dust motes suspended in the shaft of light from the gallery window. One could watch them for hours and learn nothing—or everything.',
    theme: 'observation'
  },
  {
    id: 'phrase_obs_5',
    text: 'The child tugging at her mother\'s skirt has the same impatient grip I remember in myself, wanting always to be elsewhere.',
    theme: 'observation'
  },
  {
    id: 'phrase_obs_6',
    text: 'Such quantities of iron and glass! Such wholesale accumulation! A direct negation of everything I hold pleasant or possible in life.',
    theme: 'europe'
  },
  {
    id: 'phrase_obs_7',
    text: 'The smell of roasting chestnuts mingles with coal smoke and something else—river water, perhaps, or simply Paris being Paris.',
    theme: 'europe'
  },

  // MEMORY - specific, personal, tied to real people
  {
    id: 'phrase_minny_1',
    text: 'Minny\'s laugh—I heard something like it from across the pavilion and my heart seized. But no. Never again that particular music.',
    theme: 'memory',
    references: ['Minny Temple']
  },
  {
    id: 'phrase_minny_2',
    text: 'She would have adored this—the crowds, the spectacle, the sheer improbability of it all. Minny always did love improbability.',
    theme: 'memory',
    references: ['Minny Temple']
  },
  {
    id: 'phrase_minny_3',
    text: 'That young woman\'s profile against the fountain—the same determined chin. But Minny\'s chin pointed toward a future that never came.',
    theme: 'memory',
    references: ['Minny Temple']
  },
  {
    id: 'phrase_father_1',
    text: 'Father would have had opinions about this Tower. Loud ones. One can almost hear him now, denouncing it as spiritual vulgarity.',
    theme: 'memory',
    references: ['Henry James Sr.']
  },
  {
    id: 'phrase_father_2',
    text: 'The way that gentleman gestures while arguing—both hands conducting invisible orchestras—Father did precisely that at dinner.',
    theme: 'memory',
    references: ['Henry James Sr.']
  },
  {
    id: 'phrase_william_1',
    text: 'William would be scribbling notes about the crowd\'s collective psychology. He sees systems where I see only faces.',
    theme: 'observation',
    references: ['William James']
  },
  {
    id: 'phrase_william_2',
    text: 'My brother insists consciousness flows like a stream. But here, in this crush of humanity, it feels more like a whirlpool.',
    theme: 'consciousness',
    references: ['William James']
  },
  {
    id: 'phrase_alice_1',
    text: 'Alice would find this exhausting beyond measure—and yet she would insist on hearing every detail, twice over, in my letters.',
    theme: 'memory',
    references: ['Alice James']
  },
  {
    id: 'phrase_alice_2',
    text: 'My sister, confined to her room in London, sees more clearly than most who walk freely. What would she make of this spectacle?',
    theme: 'consciousness',
    references: ['Alice James']
  },
  {
    id: 'phrase_mother_1',
    text: 'Mother\'s way of folding her hands in her lap—I saw it just now in an old woman on the bench. The gesture of patient waiting.',
    theme: 'memory',
    references: ['Mary Walsh James']
  },

  // SOCIETY - specific social observations
  {
    id: 'phrase_society_1',
    text: 'The American woman in the mauve dress speaks too loudly. Her husband winces almost imperceptibly. One knows their entire history from that wince.',
    theme: 'society'
  },
  {
    id: 'phrase_society_2',
    text: 'Two gentlemen greeting each other with elaborate courtesy—beneath which runs a current of pure mutual detestation. Delicious.',
    theme: 'society'
  },
  {
    id: 'phrase_society_3',
    text: 'She pretends not to notice his attention. He pretends not to notice her pretending. The dance is ancient and perfectly choreographed.',
    theme: 'society'
  },
  {
    id: 'phrase_society_4',
    text: 'The English party moves through the gallery like a small armada, supremely confident of its right to occupy all available space.',
    theme: 'society'
  },
  {
    id: 'phrase_society_5',
    text: 'That pause before she answered—one felt the calculation behind her eyes, the weighing of advantage and risk.',
    theme: 'society'
  },
  {
    id: 'phrase_society_6',
    text: 'His accent places him precisely: good family, reduced circumstances, and the particular bitterness that combination breeds.',
    theme: 'society'
  },

  // EUROPE/PARIS - specific to the exposition and setting
  {
    id: 'phrase_europe_1',
    text: 'The Tower looms over everything like an iron reproach. And yet—in certain light—there is something almost noble in its absurdity.',
    theme: 'europe'
  },
  {
    id: 'phrase_europe_2',
    text: 'Fifteen thousand people pass through these gates each hour. Fifteen thousand separate dramas, each invisible to the others.',
    theme: 'europe'
  },
  {
    id: 'phrase_europe_3',
    text: 'The Galerie des Machines hums with a sound like the future breathing. One is not certain whether to feel exhilarated or terrified.',
    theme: 'europe'
  },
  {
    id: 'phrase_europe_4',
    text: 'Paris in May has a particular quality of light—golden, forgiving, making even the mundane seem touched by significance.',
    theme: 'europe'
  },
  {
    id: 'phrase_europe_5',
    text: 'The café waiter moves between tables with the precision of a dancer. In America we have efficiency. Here they have grace.',
    theme: 'europe'
  },
  {
    id: 'phrase_europe_6',
    text: 'Colonial exhibits arranged like specimens in a cabinet. The empire on display, unconscious of what it reveals about itself.',
    theme: 'europe'
  },

  // AMERICA - the outsider's perspective
  {
    id: 'phrase_america_1',
    text: 'My compatriots cluster together, speaking too loudly, as if volume could bridge the Atlantic they have crossed.',
    theme: 'america'
  },
  {
    id: 'phrase_america_2',
    text: 'The young American woman asks questions with a directness that makes Frenchmen blink. She does not know what she does not know.',
    theme: 'america'
  },
  {
    id: 'phrase_america_3',
    text: 'Boston seems very far away. And yet I carry it with me like a stone in my pocket—its weight familiar, almost comforting.',
    theme: 'america'
  },
  {
    id: 'phrase_america_4',
    text: 'The American businessman calculates the Tower\'s cost per rivet. He misses everything and understands everything, simultaneously.',
    theme: 'america'
  },

  // CONSCIOUSNESS - but grounded in specific moments
  {
    id: 'phrase_consc_1',
    text: 'For a moment, watching the fountain, I forgot myself entirely. Then remembered, and the remembering was like waking from a dream.',
    theme: 'consciousness'
  },
  {
    id: 'phrase_consc_2',
    text: 'The mind wanders where it will. I came to see the paintings and find myself cataloguing the shoes of the other visitors.',
    theme: 'consciousness'
  },
  {
    id: 'phrase_consc_3',
    text: 'Between one thought and the next—what lives there? Something that is neither thought nor silence but partakes of both.',
    theme: 'consciousness'
  },
  {
    id: 'phrase_consc_4',
    text: 'I watch myself watching them. The observer observed, observing. It is turtles all the way down, as Father used to say.',
    theme: 'consciousness',
    references: ['Henry James Sr.']
  },

  // MORTALITY - but specific, observed
  {
    id: 'phrase_mort_1',
    text: 'The old gentleman on the bench breathes with difficulty. Each breath a small victory. Each breath possibly the last.',
    theme: 'mortality'
  },
  {
    id: 'phrase_mort_2',
    text: 'Photographs of the recently dead line the memorial hall. They stare out at us with the particular intensity of those who did not expect to leave.',
    theme: 'mortality'
  },
  {
    id: 'phrase_mort_3',
    text: 'This exposition will be dismantled. These crowds will disperse. In fifty years, who will remember having stood here?',
    theme: 'mortality'
  },

  // LOVE/INTIMACY - observed, not abstract
  {
    id: 'phrase_love_1',
    text: 'The way he touches the small of her back to guide her through the crowd—the gesture is tender and possessive in equal measure.',
    theme: 'love'
  },
  {
    id: 'phrase_love_2',
    text: 'An elderly couple sharing a bench, not speaking, not needing to. Forty years of conversation have left them with comfortable silence.',
    theme: 'love'
  },
  {
    id: 'phrase_love_3',
    text: 'She looked at him with such open longing that I had to turn away. Some things are too naked to witness.',
    theme: 'love'
  },
  {
    id: 'phrase_constance_1',
    text: 'Constance would appreciate the absurdity of this crowd—and then write something piercing about it. I miss her eye.',
    theme: 'love',
    references: ['Constance Fenimore Woolson']
  },

  // ART - but grounded in specific works and observations
  {
    id: 'phrase_art_1',
    text: 'The Monet glows with a light that seems to come from within the canvas itself. How does he trap sunshine in pigment?',
    theme: 'art',
    references: ['Claude Monet']
  },
  {
    id: 'phrase_art_2',
    text: 'Sargent captures something in his portraits that photographs miss—not the face but the face\'s opinion of itself.',
    theme: 'art',
    references: ['John Singer Sargent']
  },
  {
    id: 'phrase_art_3',
    text: 'The sculpture\'s marble hand is more lifelike than my own. The paradox of art: dead stone animated, living flesh made still.',
    theme: 'art'
  },
  {
    id: 'phrase_art_4',
    text: 'A young woman sketching in the gallery, her pencil moving with fierce concentration. She does not see me watching. Good.',
    theme: 'art'
  },

  // SENSORY FRAGMENTS - pure observation
  {
    id: 'phrase_sense_1',
    text: 'The particular creak of a new leather shoe. Someone has spent money they perhaps should not have spent.',
    theme: 'observation'
  },
  {
    id: 'phrase_sense_2',
    text: 'Laughter from behind a closed door. It is, somehow, French laughter. How does nationality express itself in a laugh?',
    theme: 'observation'
  },
  {
    id: 'phrase_sense_3',
    text: 'The weight of afternoon heat. Even the pigeons seem to droop. Only the fountains maintain their composure.',
    theme: 'observation'
  },
  {
    id: 'phrase_sense_4',
    text: 'Her perfume arrived before she did—roses and something sharper beneath, like a secret wrapped in flowers.',
    theme: 'observation'
  },
  {
    id: 'phrase_sense_5',
    text: 'The conductor\'s baton catches the light. For a moment it is a wand, transforming noise into something else entirely.',
    theme: 'observation'
  }
];

// Helper to get a random phrase
export const getRandomPhrase = (): JamesianPhrase => {
  return JAMESIAN_PHRASES[Math.floor(Math.random() * JAMESIAN_PHRASES.length)];
};

// Helper to get phrases by theme
export const getPhrasesByTheme = (theme: JamesianPhrase['theme']): JamesianPhrase[] => {
  return JAMESIAN_PHRASES.filter(p => p.theme === theme);
};

// Helper to get phrases referencing a specific person
export const getPhrasesByReference = (person: string): JamesianPhrase[] => {
  return JAMESIAN_PHRASES.filter(p => p.references?.includes(person));
};

// Get a phrase that hasn't been discovered yet
export const getUndiscoveredPhrase = (discoveredIds: string[]): JamesianPhrase | null => {
  const undiscovered = JAMESIAN_PHRASES.filter(p => !discoveredIds.includes(p.id));
  if (undiscovered.length === 0) return null;
  return undiscovered[Math.floor(Math.random() * undiscovered.length)];
};
