// Jamesian Phrases - Fragments of consciousness that come to Henry James unbidden
// These are original phrases written in his late style, referencing real people and themes from his life

export interface JamesianPhrase {
  id: string;
  text: string;
  theme: 'memory' | 'observation' | 'mortality' | 'art' | 'love' | 'society' | 'consciousness' | 'america' | 'europe';
  references?: string[]; // Real people referenced
}

export const JAMESIAN_PHRASES: JamesianPhrase[] = [
  // MEMORY & LOSS
  {
    id: 'phrase_minny_1',
    text: 'The silvered absence of memory, which reminds one, irresolutely but inexorably, of the absence that is eternal—and of Minny, always of Minny, who embodied for me the very principle of living.',
    theme: 'memory',
    references: ['Minny Temple']
  },
  {
    id: 'phrase_minny_2',
    text: 'She had been, in those Newport days, the heroine of her own situation, and when consumption claimed her at twenty-four, it claimed also some essential part of my capacity for unguarded feeling.',
    theme: 'mortality',
    references: ['Minny Temple']
  },
  {
    id: 'phrase_minny_3',
    text: 'What Minny might have become had she lived—the question returns, as questions of the might-have-been always return, bearing with it the particular fragrance of impossibility.',
    theme: 'memory',
    references: ['Minny Temple']
  },
  {
    id: 'phrase_father_1',
    text: 'Father\'s faith in the unseen order was perhaps his greatest bequest to us—that, and the conviction that consciousness itself constitutes the highest form of action.',
    theme: 'consciousness',
    references: ['Henry James Sr.']
  },
  {
    id: 'phrase_father_2',
    text: 'The senior Henry had a way of making the invisible visible, of treating ideas as though they were guests at dinner—welcomed, fed, occasionally shown the door.',
    theme: 'memory',
    references: ['Henry James Sr.']
  },
  {
    id: 'phrase_william_1',
    text: 'My brother moves through this exposition as through his own psychology—finding everywhere the stream of consciousness he has named, failing to see how thoroughly that stream runs through channels dug by art.',
    theme: 'consciousness',
    references: ['William James']
  },
  {
    id: 'phrase_william_2',
    text: 'William insists that truth is what works; I counter, silently, that beauty is what remains—and that remaining is itself a form of working upon the world.',
    theme: 'art',
    references: ['William James']
  },
  {
    id: 'phrase_holmes_1',
    text: 'Wendell, who went to war and came back wounded in ways the eye could see and ways it could not—he understood, before any of us, that some knowledge costs everything to acquire.',
    theme: 'memory',
    references: ['Oliver Wendell Holmes Jr.']
  },
  {
    id: 'phrase_holmes_2',
    text: 'The law, as Holmes practices it, is a kind of fiction with consequences; my fictions aspire, perhaps vainly, to consequences of their own.',
    theme: 'art',
    references: ['Oliver Wendell Holmes Jr.']
  },

  // OBSERVATION & CONSCIOUSNESS
  {
    id: 'phrase_observation_1',
    text: 'To see—truly to see—is to acknowledge the unbridgeable distance between the observer and the observed, and to find in that very distance the space where meaning lives.',
    theme: 'observation'
  },
  {
    id: 'phrase_observation_2',
    text: 'The eye selects, excludes, arranges; and in this silent commerce with the visible world, creates something that was not there before—the picture, the impression, the phrase that holds.',
    theme: 'observation'
  },
  {
    id: 'phrase_observation_3',
    text: 'One watches, and in watching becomes complicit; the spectator is never innocent, for attention itself is a form of participation.',
    theme: 'observation'
  },
  {
    id: 'phrase_consciousness_1',
    text: 'Consciousness is not a stream but an ocean, with depths the swimmer dare not sound and surfaces that shift with every wind of circumstance.',
    theme: 'consciousness'
  },
  {
    id: 'phrase_consciousness_2',
    text: 'The mind moves inward as readily as outward, and the journey inward—the long pale corridor of introspection—reveals landscapes no map has ever charted.',
    theme: 'consciousness'
  },
  {
    id: 'phrase_consciousness_3',
    text: 'What we call the self is perhaps only the habit of attention, the accumulated residue of all the moments we have elected to notice.',
    theme: 'consciousness'
  },

  // ART & CREATION
  {
    id: 'phrase_art_1',
    text: 'The novel, that blessed and capacious vessel, asks only that we pour into it everything we have observed, imagined, and failed to understand—and then trust the form to do its work.',
    theme: 'art'
  },
  {
    id: 'phrase_art_2',
    text: 'Style is the writer\'s fingerprint upon the page, as distinctive and indelible as any mark the body leaves upon the world.',
    theme: 'art'
  },
  {
    id: 'phrase_art_3',
    text: 'The artist\'s task is not to reproduce life but to make life feel, for the first time, reproduced—to give to the reader the shock of recognition that precedes understanding.',
    theme: 'art'
  },
  {
    id: 'phrase_art_4',
    text: 'Every sentence is a small act of faith—faith that the words will carry the weight of meaning, faith that somewhere a reader waits who will feel what I have felt.',
    theme: 'art'
  },
  {
    id: 'phrase_turgenev_1',
    text: 'Turgenev taught me that the great subject is not love or death but the consciousness of love, the apprehension of death—the quality of feeling rather than the fact.',
    theme: 'art',
    references: ['Ivan Turgenev']
  },

  // AMERICA & EUROPE
  {
    id: 'phrase_america_1',
    text: 'America persists in me as a kind of absence, a continent-shaped hollow where experience might have accumulated had I stayed to gather it.',
    theme: 'america'
  },
  {
    id: 'phrase_america_2',
    text: 'My countrymen arrive in Europe with the appetite of those long deprived, hungry for history they cannot digest, beauty they cannot possess.',
    theme: 'america'
  },
  {
    id: 'phrase_america_3',
    text: 'To be American in Europe is to carry always the double vision—seeing what is, and what might have been had the past been different.',
    theme: 'america'
  },
  {
    id: 'phrase_europe_1',
    text: 'Europe offers the American the dangerous gift of complexity—dangerous because complexity, once tasted, makes simplicity forever impossible.',
    theme: 'europe'
  },
  {
    id: 'phrase_europe_2',
    text: 'Paris is not a city but a condition, a state of heightened perception in which everything appears both ancient and perpetually new.',
    theme: 'europe'
  },
  {
    id: 'phrase_europe_3',
    text: 'The old world and the new meet in me as in an uncomfortable drawing room, each regarding the other with a mixture of fascination and dismay.',
    theme: 'europe'
  },

  // SOCIETY & MANNERS
  {
    id: 'phrase_society_1',
    text: 'Manners are the visible form of invisible assumptions—the way a society shows what it believes without ever stating it plainly.',
    theme: 'society'
  },
  {
    id: 'phrase_society_2',
    text: 'In every social exchange there is what is said and what is meant, and the distance between them is where the novelist finds his material.',
    theme: 'society'
  },
  {
    id: 'phrase_society_3',
    text: 'The dinner table is a battlefield where reputations are made and unmade, where a well-placed word carries the force of cannon fire.',
    theme: 'society'
  },
  {
    id: 'phrase_society_4',
    text: 'Society demands that we perform ourselves, that we become actors in a play whose script we have not written and whose ending we cannot guess.',
    theme: 'society'
  },

  // LOVE & INTIMACY
  {
    id: 'phrase_love_1',
    text: 'Love is perhaps only attention sustained until it becomes habit, and habit refined until it becomes necessity.',
    theme: 'love'
  },
  {
    id: 'phrase_love_2',
    text: 'The great passions are not loud but quiet, not fierce but patient—they work upon us slowly, like water upon stone.',
    theme: 'love'
  },
  {
    id: 'phrase_love_3',
    text: 'To love is to become vulnerable to loss; to refuse love is to lose without the compensation of having possessed.',
    theme: 'love'
  },
  {
    id: 'phrase_constance_1',
    text: 'Constance understands, as few do, that friendship between a man and a woman may be the deepest intimacy of all—requiring nothing, offering everything.',
    theme: 'love',
    references: ['Constance Fenimore Woolson']
  },

  // MORTALITY & TIME
  {
    id: 'phrase_mortality_1',
    text: 'Time is the medium in which we swim, invisible and inescapable, carrying us toward shores we cannot see.',
    theme: 'mortality'
  },
  {
    id: 'phrase_mortality_2',
    text: 'The past is not behind us but beneath us, a foundation on which we stand and from which we cannot descend.',
    theme: 'mortality'
  },
  {
    id: 'phrase_mortality_3',
    text: 'Each year strips away another layer of illusion, until what remains is only the irreducible fact of consciousness contemplating its own extinction.',
    theme: 'mortality'
  },
  {
    id: 'phrase_mortality_4',
    text: 'We live always in the shadow of the ending, and it is this shadow that gives depth to every passing moment.',
    theme: 'mortality'
  },
  {
    id: 'phrase_mother_1',
    text: 'Mother\'s presence pervaded our household like weather—one adapted to it, was shaped by it, without ever quite describing it.',
    theme: 'memory',
    references: ['Mary Walsh James']
  },
  {
    id: 'phrase_alice_1',
    text: 'Alice, confined to her bed yet more alive in her confinement than most who walk freely—she proves that the spirit requires no permission from the body.',
    theme: 'consciousness',
    references: ['Alice James']
  },
  {
    id: 'phrase_alice_2',
    text: 'My sister suffers with a kind of genius, making of her suffering a work of art that only those closest to her may witness.',
    theme: 'mortality',
    references: ['Alice James']
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
