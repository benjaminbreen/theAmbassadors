import { GameEvent, StatType, EventCategory } from '../types';

// ==========================================
// RANDOM/LOCATION-TRIGGERED EVENTS (10)
// "Moments of Note" - internal psychological moments
// ==========================================

export const RANDOM_EVENTS: GameEvent[] = [
  {
    id: 'the_unfinished_sentence',
    title: 'The Unfinished Sentence',
    description: 'You overhear two gentlemen discussing your novel "The Portrait of a Lady." One begins to say something about the ending, but stops mid-sentence, noticing you nearby. The silence stretches. What was he about to say? The not-knowing becomes a small splinter in your thoughts.',
    category: 'introspective',
    triggerType: 'RANDOM_ZONE',
    triggerConditions: {
      biomes: ['GRAND_HALL', 'SALON', 'GALERIE'],
      probability: 0.02,
      cooldownMinutes: 10,
    },
    choices: [
      {
        id: 'approach_politely',
        text: 'Approach and introduce yourself with gracious curiosity',
        outcomes: [{
          description: 'The gentleman flushes crimson. "Mr. James! I was merely saying—that is—the ending was most... most affecting." His companion nods too vigorously. You will never know what he truly meant to say, but their awkwardness suggests something genuine, at least.',
          statChanges: [
            { stat: StatType.REPUTATION, change: 5 },
            { stat: StatType.MALAISE, change: 5 }
          ],
          addNarration: 'Confronted readers discussing your work; their discomfort revealed more than words could.'
        }]
      },
      {
        id: 'walk_away',
        text: 'Turn away and let the mystery remain',
        outcomes: [{
          description: 'You walk on, carrying the unfinished sentence like a small stone in your pocket. Perhaps not knowing is its own form of knowledge. The imagination, after all, is often more vivid than reality.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 3 },
            { stat: StatType.COMPOSURE, change: 5 }
          ],
          addNarration: 'Chose mystery over certainty; found creative sustenance in the unknown.'
        }]
      },
      {
        id: 'linger_unnoticed',
        text: 'Linger nearby, pretending to examine a display',
        requiredStat: { stat: StatType.OBSERVATION, minValue: 14 },
        outcomes: [{
          description: '"—derivative of the French, of course," the man finishes. "Flaubert did it better." The words sting, but you have learned something valuable: the shape of your critics\' objections. Knowledge, even painful knowledge, is material.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 5 },
            { stat: StatType.HEALTH, change: -5 },
            { stat: StatType.MALAISE, change: 8 }
          ],
          addNarration: 'Eavesdropped on criticism of your work; painful but instructive.'
        }]
      }
    ],
    historicalNote: 'James was famously sensitive to criticism and often wondered what people truly thought of his work. His elaborate prose style divided contemporary readers.',
    repeatable: false,
    priority: 5
  },

  {
    id: 'william_debate',
    title: 'A Brotherly Disagreement',
    description: 'William catches up to you near a mechanical exhibit, his eyes bright with that particular intensity that precedes philosophical combat. "Harry, consider this: if consciousness is merely a stream, as I propose, then your precious characters are nothing but eddies in the current. Where is the self?"',
    category: 'intellectual',
    triggerType: 'RANDOM_ZONE',
    triggerConditions: {
      biomes: ['GRAND_HALL', 'GALERIE', 'TOWER_LEVEL'],
      probability: 0.04,
      cooldownMinutes: 15,
    },
    choices: [
      {
        id: 'philosophical_parry',
        text: 'Meet his philosophy with aesthetic argument',
        requiredStat: { stat: StatType.WIT, minValue: 12 },
        outcomes: [{
          description: '"The self," you reply carefully, "is precisely in the eddying. Your stream needs banks, William, or it is merely... wet." He laughs—genuinely laughs—and for a moment you are boys again, jousting with ideas in the garden.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 8 },
            { stat: StatType.COMPOSURE, change: 10 },
            { stat: StatType.MALAISE, change: -5 }
          ],
          addNarration: 'Engaged William in philosophical debate; found unexpected common ground.'
        }]
      },
      {
        id: 'concede_ground',
        text: 'Acknowledge his point thoughtfully',
        outcomes: [{
          description: 'You nod slowly. "Perhaps you are right. Perhaps the self is an illusion we construct moment to moment." William\'s expression softens. "Not an illusion, Harry. A construction. There is a difference." He squeezes your shoulder—a rare physical gesture from him.',
          statChanges: [
            { stat: StatType.REPUTATION, change: -3 },
            { stat: StatType.COMPOSURE, change: 15 },
            { stat: StatType.MALAISE, change: -10 }
          ],
          addNarration: 'Yielded to William\'s argument; brotherly warmth followed.'
        }]
      },
      {
        id: 'deflect_humor',
        text: 'Deflect with dry humor',
        outcomes: [{
          description: '"William, I am merely a novelist. You cannot expect me to understand actual thinking." He snorts. "False modesty is still a form of pride, Harry." But he lets the matter drop, and you walk together in companionable silence.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 5 },
            { stat: StatType.MALAISE, change: 3 }
          ],
          addNarration: 'Avoided philosophical depth with William; maintained equilibrium.'
        }]
      }
    ],
    historicalNote: 'Henry and William James had a complex intellectual relationship. William\'s pragmatic philosophy often clashed with Henry\'s aesthetic concerns, yet they maintained deep mutual respect.',
    repeatable: true,
    priority: 7
  },

  {
    id: 'the_stammering_american',
    title: 'The Stammering American',
    description: 'At a café table nearby, a young American man struggles desperately with French, mangling his order so badly that the waiter\'s mustache seems to bristle with offense. "Je... je voo-dray... un... coffay?" The waiter\'s silence is devastating.',
    category: 'social',
    triggerType: 'RANDOM_ZONE',
    triggerConditions: {
      biomes: ['SALON', 'GALERIE', 'GARDEN'],
      probability: 0.04,
      cooldownMinutes: 30,
    },
    choices: [
      {
        id: 'intervene_kindly',
        text: 'Step in and translate with tactful grace',
        requiredStat: { stat: StatType.DECORUM, minValue: 14 },
        outcomes: [{
          description: 'You approach smoothly, addressing the waiter in flawless French while making it seem you are merely ordering for yourself. The young man\'s relief is palpable. "Thank you, sir. I\'m from Ohio." Of course he is.',
          statChanges: [
            { stat: StatType.REPUTATION, change: 5 },
            { stat: StatType.COMPOSURE, change: -5 },
            { stat: StatType.INSPIRATION, change: 2 }
          ],
          addNarration: 'Rescued a fellow American from linguistic humiliation; felt the weight of countrymen abroad.'
        }]
      },
      {
        id: 'observe_suffering',
        text: 'Watch the scene unfold without intervening',
        outcomes: [{
          description: 'You observe as the young man\'s face cycles through embarrassment, frustration, and finally a kind of desperate comedy. He points at another table\'s coffee and holds up one finger. The waiter relents. Material, you think. This is all material.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 5 },
            { stat: StatType.MALAISE, change: 3 }
          ],
          addNarration: 'Watched an American struggle with French; observed rather than helped.'
        }]
      },
      {
        id: 'correct_coldly',
        text: 'Correct his pronunciation audibly from your table',
        outcomes: [{
          description: '"It is \'café,\' young man. Cah-FAY." He turns, mortified to find another American witnessing his shame. The waiter smirks. You have taught him something, but at what cost to his dignity—and yours?',
          statChanges: [
            { stat: StatType.REPUTATION, change: -5 },
            { stat: StatType.MALAISE, change: 5 }
          ],
          addNarration: 'Corrected a countryman\'s French publicly; a small cruelty.'
        }]
      }
    ],
    historicalNote: 'James was fluent in French from childhood and often wrote about the cultural gaps between Americans and Europeans, particularly the challenges faced by Americans abroad.',
    repeatable: true,
    priority: 4
  },

  {
    id: 'the_machinery_meditation',
    title: 'The Machinery of Progress',
    description: 'Before an enormous steam engine—all brass and iron, pistons moving with hypnotic precision—you find yourself transfixed. The machine seems almost alive, breathing smoke and purpose. Around you, visitors chatter about progress and the future, but you hear only the rhythm of the beast.',
    category: 'aesthetic',
    triggerType: 'SPECIFIC_ZONE',
    triggerConditions: {
      biomes: ['GRAND_HALL', 'GALERIE'],
      probability: 0.15,
    },
    choices: [
      {
        id: 'aesthetic_resistance',
        text: 'Resist its seduction—this is not your world',
        outcomes: [{
          description: 'You turn away deliberately. Let others worship at the altar of efficiency. Your concern is with the human heart, which no machine can replicate or replace. The gesture feels both noble and slightly foolish.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 10 },
            { stat: StatType.INSPIRATION, change: 3 },
            { stat: StatType.REPUTATION, change: -2 }
          ],
          addNarration: 'Rejected the machine aesthetic; affirmed commitment to human interiority.'
        }]
      },
      {
        id: 'find_poetry',
        text: 'Search for the poetry in the pistons',
        requiredStat: { stat: StatType.OBSERVATION, minValue: 15 },
        outcomes: [{
          description: 'You look closer, past the obvious power, and see: the oil catching light like amber, the rhythm that is almost heartbeat, the maker\'s initials stamped small on a brass plate. Even here, the human persists. Even here, story.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 8 },
            { stat: StatType.MALAISE, change: -3 }
          ],
          addNarration: 'Found unexpected beauty in industrial machinery; expanded aesthetic boundaries.'
        }]
      },
      {
        id: 'feel_dread',
        text: 'Allow yourself to feel the dread it inspires',
        outcomes: [{
          description: 'The machine will outlast you. It will outlast your books. It neither knows nor cares about consciousness or craft. For a long moment, the future feels like a door closing. Then you breathe, and walk on.',
          statChanges: [
            { stat: StatType.MALAISE, change: 10 },
            { stat: StatType.INSPIRATION, change: 4 }
          ],
          addNarration: 'Confronted existential dread before the machinery of progress.'
        }]
      }
    ],
    historicalNote: 'The 1889 Exposition celebrated industrial progress, but many artists and intellectuals had ambivalent feelings about mechanization and its effects on culture.',
    repeatable: false,
    priority: 5
  },

  {
    id: 'the_portrait_recognition',
    title: 'A Face in the Crowd',
    description: 'Moving through the crowd, you catch a face that stops you cold—a woman whose profile, for one impossible moment, recalls someone from your past. But she turns, and she is a stranger. Of course she is. And yet.',
    category: 'mysterious',
    triggerType: 'RANDOM_ZONE',
    triggerConditions: {
      biomes: ['GRAND_HALL', 'GARDEN', 'ESPLANADE', 'TROCADERO'],
      probability: 0.08,
      cooldownMinutes: 20,
    },
    choices: [
      {
        id: 'follow_briefly',
        text: 'Follow her for a moment, just to be certain',
        outcomes: [{
          description: 'You trail her a few paces before she vanishes into the crowd. A stranger. Of course. But the ghost of resemblance lingers—or perhaps you have merely invented it, as novelists do.',
          statChanges: [
            { stat: StatType.MALAISE, change: 8 },
            { stat: StatType.INSPIRATION, change: 5 }
          ],
          addNarration: 'Chased a phantom resemblance through the crowd; memory and imagination intertwined.'
        }]
      },
      {
        id: 'let_go',
        text: 'Let the moment pass without pursuit',
        outcomes: [{
          description: 'You watch her disappear without following. Some ghosts are better left unconfirmed. The uncertainty itself becomes a kind of gift—a story without an ending, which is sometimes the best kind.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 8 },
            { stat: StatType.INSPIRATION, change: 3 }
          ],
          addNarration: 'Let a phantom go; chose the comfort of uncertainty.'
        }]
      },
      {
        id: 'examine_feeling',
        text: 'Stop and examine what the resemblance stirred',
        requiredStat: { stat: StatType.OBSERVATION, minValue: 16 },
        outcomes: [{
          description: 'You stand still amid the flowing crowd and let the feeling expand. Not grief, exactly. Not regret. Something more like... recognition of time\'s passage, made visible in a stranger\'s cheekbone. This is what you write about. This exact feeling.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 10 },
            { stat: StatType.MALAISE, change: 5 }
          ],
          addNarration: 'Examined the ache of false recognition; found literary truth in private feeling.'
        }]
      }
    ],
    historicalNote: 'James never married and maintained intensely private emotional attachments. His fiction often explores longing, missed connections, and the ghosts of possibility.',
    repeatable: true,
    priority: 6
  },

  {
    id: 'the_child_question',
    title: 'The Child\'s Question',
    description: 'A small girl, perhaps six years old and clearly separated from her party, tugs at your coat. "Monsieur, are you lost too?" Her French is perfect, her eyes enormous. Behind you, you hear a woman calling, searching.',
    category: 'social',
    triggerType: 'RANDOM_ZONE',
    triggerConditions: {
      biomes: ['GARDEN', 'ESPLANADE', 'GRAND_HALL'],
      probability: 0.02,
      cooldownMinutes: 15,
    },
    choices: [
      {
        id: 'help_child',
        text: 'Take her hand and help find her mother',
        outcomes: [{
          description: 'You guide her toward the calling voice. The mother\'s relief is profound. "Thank you, monsieur. Thank you." The child waves goodbye. For a moment, the exposition feels less like a machine and more like a village.',
          statChanges: [
            { stat: StatType.REPUTATION, change: 8 },
            { stat: StatType.COMPOSURE, change: 10 },
            { stat: StatType.MALAISE, change: -5 }
          ],
          addNarration: 'Reunited a lost child with her mother; felt briefly part of the human community.'
        }]
      },
      {
        id: 'answer_question',
        text: '"Perhaps we are all lost here, mademoiselle"',
        outcomes: [{
          description: 'She considers this with devastating seriousness. "But then who will find us?" Before you can answer, her mother arrives, scooping her up with apologies. The question echoes.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 6 },
            { stat: StatType.MALAISE, change: 3 }
          ],
          addNarration: 'Offered a child philosophical truth; received unexpected wisdom in return.'
        }]
      },
      {
        id: 'wait_silently',
        text: 'Simply point toward the calling voice',
        outcomes: [{
          description: 'You gesture toward the sound, and she runs off without another word. Efficient. Appropriate. And yet some small part of you wished she had lingered.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 5 },
            { stat: StatType.MALAISE, change: 5 }
          ],
          addNarration: 'Directed a lost child home; maintained proper distance.'
        }]
      }
    ],
    historicalNote: 'James wrote some of his most celebrated fiction about children, including "What Maisie Knew" and "The Turn of the Screw." His portrayal of childhood consciousness was revolutionary.',
    repeatable: false,
    priority: 4
  },

  {
    id: 'the_eiffel_vertigo',
    title: 'The Vertigo of Iron',
    description: 'Ascending the Tower, you pause at a platform where the latticed iron frames the city below. The height produces not fear but a strange, floating sensation—as if you might simply step through the geometry and dissolve into the pattern of Paris itself.',
    category: 'aesthetic',
    triggerType: 'SPECIFIC_ZONE',
    triggerConditions: {
      biomes: ['TOWER_LEVEL', 'TOWER_PLATFORM', 'TOWER_FIRST_FLOOR'],
      probability: 0.2,
    },
    choices: [
      {
        id: 'embrace_sensation',
        text: 'Lean into the feeling of dissolution',
        outcomes: [{
          description: 'You grip the railing and let the sensation wash through you. For one vertiginous moment, you are not Henry James but merely a point of consciousness suspended in geometry. Then it passes, and you are yourself again—but somehow lighter.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 10 },
            { stat: StatType.HEALTH, change: -5 },
            { stat: StatType.MALAISE, change: -8 }
          ],
          addNarration: 'Surrendered to tower vertigo; experienced ego dissolution.'
        }]
      },
      {
        id: 'step_back',
        text: 'Step back to solid ground',
        outcomes: [{
          description: 'You retreat from the edge, heart racing. Some experiences are best observed from a safe distance. The view is still remarkable, even from here.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 10 },
            { stat: StatType.MALAISE, change: 3 }
          ],
          addNarration: 'Retreated from the tower\'s edge; chose safety over transcendence.'
        }]
      },
      {
        id: 'observe_others',
        text: 'Watch how others react to the height',
        requiredStat: { stat: StatType.OBSERVATION, minValue: 13 },
        outcomes: [{
          description: 'You turn your attention outward. A young couple clutches each other. An engineer sketches calculations. A priest crosses himself. Each face a novel, each reaction a story. The height is merely a stage.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 7 },
            { stat: StatType.COMPOSURE, change: 5 }
          ],
          addNarration: 'Studied others\' reactions to height; found human drama in the vertiginous.'
        }]
      }
    ],
    historicalNote: 'The Eiffel Tower was deeply controversial in 1889. Many artists signed a petition against "this metal asparagus." Others found it sublime.',
    repeatable: false,
    priority: 8
  },

  {
    id: 'the_fatigue_wave',
    title: 'The Weight of Seeing',
    description: 'Exhaustion arrives without warning—a sudden heaviness in your limbs, a graying at the edges of attention. You have seen too much. The exposition\'s abundance, which delighted you hours ago, now feels like assault.',
    category: 'physical',
    triggerType: 'STAT_THRESHOLD',
    triggerConditions: {
      statType: StatType.MALAISE,
      statThreshold: 60,
      probability: 0.02,
      cooldownMinutes: 30,
    },
    choices: [
      {
        id: 'find_bench',
        text: 'Find a quiet bench and rest',
        outcomes: [{
          description: 'You locate a bench half-hidden by palms and sit heavily. The world continues to parade past, but you are, for a moment, outside it. The rest helps more than you expected.',
          statChanges: [
            { stat: StatType.MALAISE, change: -20 },
            { stat: StatType.COMPOSURE, change: 15 },
            { stat: StatType.HEALTH, change: 10 }
          ],
          addNarration: 'Surrendered to fatigue; found restoration in stillness.'
        }]
      },
      {
        id: 'push_through',
        text: 'Push through—there is still so much to see',
        outcomes: [{
          description: 'You force yourself onward. The exhaustion becomes a kind of filter, making everything slightly unreal. Perhaps there is value in this too—seeing through the veil of tiredness.',
          statChanges: [
            { stat: StatType.MALAISE, change: 10 },
            { stat: StatType.INSPIRATION, change: 4 },
            { stat: StatType.HEALTH, change: -10 }
          ],
          addNarration: 'Pushed through exhaustion; found surreal clarity in fatigue.'
        }]
      },
      {
        id: 'seek_cafe',
        text: 'Seek out a café for coffee and observation',
        outcomes: [{
          description: 'Coffee and a chair facing the passing crowds. The stimulant and the rest combine to produce a pleasant equilibrium. You watch rather than participate, and this feels correct.',
          statChanges: [
            { stat: StatType.MALAISE, change: -10 },
            { stat: StatType.COMPOSURE, change: 10 },
            { stat: StatType.INSPIRATION, change: 3 }
          ],
          addNarration: 'Retreated to café observation; balanced engagement with rest.'
        }]
      }
    ],
    historicalNote: 'James suffered from various ailments throughout his life and wrote frequently about the experience of exhaustion and the limits of the observing consciousness.',
    repeatable: false,
    priority: 9
  },

  {
    id: 'the_accent_slip',
    title: 'The Accent Question',
    description: 'A French journalist, interviewing visitors for a gazette, approaches you. After a few questions, he pauses. "Pardon, monsieur, but your French is... curious. You speak like one of us, yet there is something else. Where are you from, truly?"',
    category: 'social',
    triggerType: 'RANDOM_ZONE',
    triggerConditions: {
      biomes: ['GRAND_HALL', 'SALON', 'GALERIE'],
      probability: 0.02,
      cooldownMinutes: 25,
    },
    choices: [
      {
        id: 'claim_europe',
        text: '"I am from everywhere and nowhere, monsieur"',
        outcomes: [{
          description: 'The journalist laughs appreciatively. "Ah, un cosmopolite!" He writes something in his notebook. You have evaded and flattered simultaneously—a small diplomatic triumph.',
          statChanges: [
            { stat: StatType.REPUTATION, change: 5 },
            { stat: StatType.COMPOSURE, change: 5 }
          ],
          addNarration: 'Claimed cosmopolitan identity; pleased a French journalist.'
        }]
      },
      {
        id: 'admit_american',
        text: '"I am American, though I have lived long in Europe"',
        outcomes: [{
          description: 'His eyebrows rise slightly. "American! But you speak French so well." There is surprise in his voice, and perhaps a recalibration. You are a curiosity now—the American who does not act like one.',
          statChanges: [
            { stat: StatType.REPUTATION, change: 3 },
            { stat: StatType.INSPIRATION, change: 3 },
            { stat: StatType.MALAISE, change: 5 }
          ],
          addNarration: 'Admitted American origins; felt the weight of national identity.'
        }]
      },
      {
        id: 'deflect_question',
        text: 'Redirect to discussing the exposition',
        requiredStat: { stat: StatType.DECORUM, minValue: 15 },
        outcomes: [{
          description: 'You pivot gracefully to describing a mechanical exhibit, and the journalist, recognizing the deflection for what it is, accepts it with professional courtesy. Some questions are better left unanswered.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 10 },
            { stat: StatType.REPUTATION, change: 2 }
          ],
          addNarration: 'Deflected identity question with diplomatic skill.'
        }]
      }
    ],
    historicalNote: 'James spent most of his adult life in Europe and eventually became a British citizen in 1915. His national identity was a source of lifelong complexity.',
    repeatable: false,
    priority: 5
  },

  // ==========================================
  // AQUARIUM EVENTS
  // ==========================================
  {
    id: 'the_aquarium_depths',
    title: 'The Glass Depths',
    description: 'In the Exposition\'s aquarium, enormous tanks hold creatures from distant seas. You stand before one now—a giant octopus pressed against the glass, its eye meeting yours with unsettling intelligence. Around you, visitors chatter, but between you and this alien mind, a strange communion forms.',
    category: 'mysterious',
    triggerType: 'SPECIFIC_ZONE',
    triggerConditions: {
      biomes: ['AQUARIUM'],
      probability: 0.25,
    },
    choices: [
      {
        id: 'meet_gaze',
        text: 'Hold the creature\'s gaze without flinching',
        requiredStat: { stat: StatType.COMPOSURE, minValue: 14 },
        outcomes: [{
          description: 'You stare into that golden eye, that horizontal pupil. Minutes pass. The octopus shifts its color subtly—from brown to rust to something approaching purple. A kind of communication? When you finally look away, you feel you have been read, catalogued, and found... acceptable.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 12 },
            { stat: StatType.COMPOSURE, change: -5 },
            { stat: StatType.MALAISE, change: 5 }
          ],
          addNarration: 'Held communion with an octopus; felt the weight of inhuman intelligence.'
        }]
      },
      {
        id: 'observe_scientifically',
        text: 'Study the creature with detached curiosity',
        outcomes: [{
          description: 'You observe the octopus as a naturalist might—the pulsing of its mantle, the suckers\' grip on glass, the remarkable color changes. Yet even in scientific observation, you cannot shake the sense of a mind behind those eyes, observing you in return.',
          statChanges: [
            { stat: StatType.OBSERVATION, change: 2 },
            { stat: StatType.INSPIRATION, change: 6 }
          ],
          addNarration: 'Studied the octopus scientifically; failed to dispel sense of mutual observation.'
        }]
      },
      {
        id: 'feel_kinship',
        text: 'Feel an unexpected kinship with this solitary observer',
        outcomes: [{
          description: 'You and the octopus are alike, you realize—observers behind glass, watching a world that does not understand you. The creature shifts, reaches toward you with one tentacle pressed flat against the barrier. A greeting between strangers.',
          statChanges: [
            { stat: StatType.MALAISE, change: -8 },
            { stat: StatType.INSPIRATION, change: 8 },
            { stat: StatType.COMPOSURE, change: 5 }
          ],
          addNarration: 'Found kinship with the caged observer; loneliness recognized across species.'
        }]
      }
    ],
    historicalNote: 'The 1889 Exposition featured an impressive aquarium displaying marine life from French colonies and distant seas. It was one of the fair\'s most popular attractions.',
    repeatable: false,
    priority: 7
  },

  {
    id: 'the_aquarium_meditation',
    title: 'The Submarine World',
    description: 'The aquarium\'s dim blue light creates an otherworldly atmosphere. Fish drift past in silent choreography—silver, gold, striped, spotted. The chaos of the Exposition seems to belong to another reality entirely. Here, beneath the simulated ocean, time moves differently.',
    category: 'aesthetic',
    triggerType: 'SPECIFIC_ZONE',
    triggerConditions: {
      biomes: ['AQUARIUM'],
      probability: 0.2,
    },
    choices: [
      {
        id: 'surrender_to_peace',
        text: 'Surrender to the tranquility completely',
        outcomes: [{
          description: 'You find a bench in a shadowed alcove and let the blue light wash over you. Fish drift past like thoughts—arriving unbidden, departing without effort. When you finally rise, twenty minutes have passed, though it felt like an hour. You are restored.',
          statChanges: [
            { stat: StatType.MALAISE, change: -20 },
            { stat: StatType.COMPOSURE, change: 15 },
            { stat: StatType.HEALTH, change: 5 }
          ],
          addNarration: 'Found deep restoration in aquarium\'s submarine peace; time suspended.'
        }]
      },
      {
        id: 'contemplate_metaphor',
        text: 'Consider the fish as metaphor',
        requiredStat: { stat: StatType.WIT, minValue: 14 },
        outcomes: [{
          description: 'We are all fish in tanks, you think—our world bounded by invisible glass, our movements watched by giants we cannot comprehend. The exhibition-goers peer in; the fish peer out. Who exhibits whom? The thought arrives with the force of revelation.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 15 },
            { stat: StatType.MALAISE, change: 5 }
          ],
          addNarration: 'Found metaphor in aquarium glass; questioned who observes whom.'
        }]
      },
      {
        id: 'sketch_movement',
        text: 'Try to capture the movement in words',
        outcomes: [{
          description: 'You pull out your notebook and attempt the impossible—to render in static prose the liquid movement of fins, the silver flash of turning, the drift and dart and pause. The words come slowly, inadequate but necessary.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 8 },
            { stat: StatType.COMPOSURE, change: -5 }
          ],
          addNarration: 'Attempted to capture fish movement in prose; struggled with the inadequacy of words.'
        }]
      }
    ],
    historicalNote: 'James was fascinated by the challenge of capturing motion and consciousness in static prose—the "stream of consciousness" technique he helped pioneer.',
    repeatable: true,
    priority: 5
  },

  // ==========================================
  // SOUK/BAZAAR EVENTS
  // ==========================================
  {
    id: 'the_souk_labyrinth',
    title: 'The Labyrinth of Commerce',
    description: 'You have wandered deep into the reconstructed Oriental bazaar, and now the narrow lanes twist and turn without apparent logic. Brass lamps glint overhead, carpets cascade from stalls, and the air is thick with incense and spice. Each turning reveals another merchant beckoning, another treasure displayed.',
    category: 'aesthetic',
    triggerType: 'SPECIFIC_ZONE',
    triggerConditions: {
      biomes: ['SOUK'],
      probability: 0.2,
    },
    choices: [
      {
        id: 'embrace_disorientation',
        text: 'Embrace the disorientation as adventure',
        outcomes: [{
          description: 'You abandon all attempt at navigation and simply drift, letting each turning choose itself. A merchant presses tea upon you; another demonstrates mechanical birds that sing. When you finally emerge, you are changed—looser, somehow. Less relentlessly Western.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 10 },
            { stat: StatType.MALAISE, change: -5 },
            { stat: StatType.COMPOSURE, change: -3 }
          ],
          addNarration: 'Lost yourself willingly in the souk; found freedom in disorientation.'
        }]
      },
      {
        id: 'observe_transactions',
        text: 'Stop and observe the art of negotiation',
        requiredStat: { stat: StatType.OBSERVATION, minValue: 14 },
        outcomes: [{
          description: 'You watch a merchant and customer perform the ancient dance of haggling—offer and counter-offer, theatrical outrage and calculated concession. It is commerce as theatre, each party playing their role with consummate skill. There is a novel here, somewhere.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 12 },
            { stat: StatType.OBSERVATION, change: 1 }
          ],
          addNarration: 'Studied bazaar negotiation; found theatrical truth in commercial exchange.'
        }]
      },
      {
        id: 'seek_exit',
        text: 'Ask for directions back to the main thoroughfare',
        outcomes: [{
          description: '"Certainement, monsieur," the merchant says with a knowing smile, and points. His directions lead you in a circle, back to his stall. You purchase a small brass compass out of something like admiration for his persistence.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: -3 },
            { stat: StatType.INSPIRATION, change: 4 }
          ],
          itemGain: 'brass_compass',
          addNarration: 'Outwitted by a merchant; purchased a compass to mark the defeat.'
        }]
      }
    ],
    historicalNote: 'The 1889 Exposition featured elaborate reconstructions of "exotic" markets and villages, reflecting the era\'s colonial fascination with the Orient.',
    repeatable: false,
    priority: 6
  },

  {
    id: 'the_carpet_meditation',
    title: 'The Woven Garden',
    description: 'A Persian carpet merchant has spread his wares on the ground, creating a garden of silk and wool. One carpet in particular arrests you—its pattern seems to shift as you look, revealing new depths, new harmonies. "This one speaks to you," the merchant observes.',
    category: 'aesthetic',
    triggerType: 'SPECIFIC_ZONE',
    triggerConditions: {
      biomes: ['SOUK'],
      probability: 0.15,
    },
    choices: [
      {
        id: 'study_pattern',
        text: 'Study the pattern with artistic attention',
        requiredStat: { stat: StatType.OBSERVATION, minValue: 15 },
        outcomes: [{
          description: 'The carpet\'s design unfolds like a story—the central medallion containing gardens within gardens, each border a narrative in geometric form. You see now: this is a novel in thread, complete in itself. The merchant watches with satisfaction as understanding dawns.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 14 },
            { stat: StatType.OBSERVATION, change: 1 }
          ],
          addNarration: 'Read the carpet as narrative; found story woven in silk and wool.'
        }]
      },
      {
        id: 'inquire_price',
        text: 'Inquire about the price',
        outcomes: [{
          description: 'The merchant names a sum that makes you cough. Then the negotiation begins—tea is served, stories are told, and by the end you are haggling as if born to it. You do not buy the carpet, but you leave with something more valuable: an education in the poetry of commerce.',
          statChanges: [
            { stat: StatType.WIT, change: 1 },
            { stat: StatType.COMPOSURE, change: 5 },
            { stat: StatType.INSPIRATION, change: 5 }
          ],
          addNarration: 'Haggled for a carpet; learned the poetry of commercial exchange.'
        }]
      },
      {
        id: 'politely_decline',
        text: 'Acknowledge the beauty but move on',
        outcomes: [{
          description: '"Perhaps another time, monsieur," you say. The merchant shrugs philosophically—he knows beauty cannot be forced, only recognized. The carpet\'s pattern stays with you, recurring in dreams, demanding eventually to be written.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 8 },
            { stat: StatType.INSPIRATION, change: 6 }
          ],
          addNarration: 'Resisted the carpet\'s call; carried its pattern away in memory.'
        }]
      }
    ],
    historicalNote: 'Persian carpets were prized collectibles among wealthy Westerners in the 1880s. Their intricate patterns were seen as windows into Eastern philosophy.',
    repeatable: false,
    priority: 5
  },

  {
    id: 'the_spice_memory',
    title: 'The Scent of Distance',
    description: 'Passing a spice merchant\'s stall, a particular fragrance stops you—cardamom and cinnamon, perhaps, layered with something darker, more elusive. The scent unlocks a door in your memory, though the room beyond remains shadowed.',
    category: 'introspective',
    triggerType: 'SPECIFIC_ZONE',
    triggerConditions: {
      biomes: ['SOUK'],
      probability: 0.15,
    },
    choices: [
      {
        id: 'pursue_memory',
        text: 'Close your eyes and pursue the memory',
        outcomes: [{
          description: 'Constantinople, 1869. A hotel kitchen. A conversation with your father that you had forgotten entirely until now. The words remain elusive, but the feeling returns—a rare moment of understanding between you. The spice merchant watches you with knowing patience.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 10 },
            { stat: StatType.MALAISE, change: 8 }
          ],
          addNarration: 'Pursued scent-triggered memory; recovered forgotten conversation with father.'
        }]
      },
      {
        id: 'buy_spice',
        text: 'Purchase a packet to capture the scent',
        outcomes: [{
          description: 'You buy a small packet of the spice blend, pressing coins into the merchant\'s hand. Later, in your hotel room, you will open it and try to summon the memory again. But scent, like time, cannot be truly bottled.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 5 },
            { stat: StatType.MALAISE, change: -3 }
          ],
          itemGain: 'exotic_spices',
          addNarration: 'Bought spices to preserve a memory; accepted the impossibility of the task.'
        }]
      },
      {
        id: 'let_pass',
        text: 'Let the half-memory dissolve',
        outcomes: [{
          description: 'Some memories surface only to sink again. You walk on, carrying only the ghost of the scent, the shadow of the feeling. Perhaps it is enough to know that the memory exists, somewhere in your depths.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 8 }
          ],
          addNarration: 'Released a half-surfaced memory; accepted the limits of recovery.'
        }]
      }
    ],
    historicalNote: 'James traveled extensively in his youth, including visits to Constantinople and the Near East. These early experiences profoundly influenced his sense of cultural complexity.',
    repeatable: false,
    priority: 6
  },

  // ==========================================
  // ADDITIONAL LOCATION EVENTS
  // ==========================================
  {
    id: 'the_notebook_moment',
    title: 'The Arrested Phrase',
    description: 'A phrase arrives unbidden—perfect, complete, necessary. You reach for your notebook, but your hands are full of brochures and the crowd presses close. The phrase begins to dissolve even as you grasp at it.',
    category: 'introspective',
    triggerType: 'RANDOM_ZONE',
    triggerConditions: {
      biomes: ['GRAND_HALL', 'GARDEN', 'GALERIE', 'ESPLANADE'],
      probability: 0.03,
      cooldownMinutes: 12,
    },
    choices: [
      {
        id: 'drop_everything',
        text: 'Drop everything and write immediately',
        outcomes: [{
          description: 'Brochures scatter as you fumble for your notebook. A woman glares. But the phrase is captured—"the silvered absence of"—and you know it will lead somewhere important.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 12 },
            { stat: StatType.REPUTATION, change: -3 },
            { stat: StatType.COMPOSURE, change: -5 }
          ],
          itemGain: 'notebook_fragment',
          addNarration: 'Sacrificed dignity to capture a phrase; art before manners.'
        }]
      },
      {
        id: 'repeat_mentally',
        text: 'Repeat it silently until you can write',
        requiredStat: { stat: StatType.OBSERVATION, minValue: 14 },
        outcomes: [{
          description: 'You loop the phrase through your mind—"the silvered absence of, the silvered absence of"—until you find a quiet corner. It survives, mostly. A few words have shifted, but the essence remains.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 8 },
            { stat: StatType.MALAISE, change: 5 }
          ],
          addNarration: 'Preserved a phrase through mental repetition; technique over chaos.'
        }]
      },
      {
        id: 'let_dissolve',
        text: 'Let it go—if it was meant to be, it will return',
        outcomes: [{
          description: 'You release the phrase deliberately, like a caught bird. Gone. Perhaps forever. But there will be other phrases, other moments. The muse is not so easily exhausted.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 8 },
            { stat: StatType.MALAISE, change: -3 },
            { stat: StatType.INSPIRATION, change: 2 }
          ],
          addNarration: 'Released a perfect phrase; trusted in artistic abundance.'
        }]
      }
    ],
    historicalNote: 'James was famous for his notebooks, which he filled with story ideas, observations, and character sketches. Many of his major works began as notebook entries.',
    repeatable: true,
    priority: 6
  },
];

// ==========================================
// OBJECT/LOCATION-TRIGGERED EVENTS (10)
// Triggered by examining specific objects
// ==========================================

export const OBJECT_EVENTS: GameEvent[] = [
  {
    id: 'velvet_reprieve',
    title: 'The Velvet Reprieve',
    description: 'In a private salon, your fingers brush against velvet curtains the color of old wine. The texture arrests you—so unlike the industrial displays outside. Here is something that remembers the old world, the world of nuance and shadow.',
    category: 'aesthetic',
    triggerType: 'OBJECT_EXAMINE',
    triggerConditions: {
      objectId: 'curtain',
      biomes: ['SALON'],
      probability: 0.8,
    },
    choices: [
      {
        id: 'linger_texture',
        text: 'Close your eyes and simply feel',
        outcomes: [{
          description: 'The velvet against your fingertips becomes a small universe. You think of salons in Rome, in Florence, in London. The exposition fades. For this moment, you are nowhere and everywhere you have ever been.',
          statChanges: [
            { stat: StatType.MALAISE, change: -15 },
            { stat: StatType.INSPIRATION, change: 6 },
            { stat: StatType.COMPOSURE, change: 10 }
          ],
          addNarration: 'Found peace in velvet texture; sensory retreat from the modern.'
        }]
      },
      {
        id: 'observe_room',
        text: 'Use this sanctuary to observe the room\'s occupants',
        requiredStat: { stat: StatType.OBSERVATION, minValue: 15 },
        outcomes: [{
          description: 'Half-hidden by the curtain, you watch a conversation unfold—a young woman and an older man, their exchange full of unspoken tensions. A story taking shape. You file it away.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 10 },
            { stat: StatType.COMPOSURE, change: 5 }
          ],
          addNarration: 'Used velvet curtain as observation blind; witnessed private drama.'
        }]
      },
      {
        id: 'move_on',
        text: 'Acknowledge the moment and move on',
        outcomes: [{
          description: 'You release the curtain with a small, private smile. Beauty noted, catalogued, released. The exposition awaits with all its clamoring demands.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 5 }
          ],
          addNarration: 'Noted velvet beauty; maintained forward momentum.'
        }]
      }
    ],
    historicalNote: 'James\'s prose often dwelt on textures and materials, using them to evoke psychological states and class distinctions.',
    repeatable: false,
    priority: 4
  },

  {
    id: 'the_fountain_meditation',
    title: 'The Fountain\'s Question',
    description: 'Before an ornate fountain, water cascading over nymphs and dolphins in endless repetition, you find yourself transfixed. The sound drowns the crowd. The water asks nothing, promises nothing, yet somehow suggests everything.',
    category: 'aesthetic',
    triggerType: 'OBJECT_EXAMINE',
    triggerConditions: {
      objectId: 'fountain',
      biomes: ['GARDEN', 'ESPLANADE', 'TROCADERO'],
      probability: 0.7,
    },
    choices: [
      {
        id: 'coin_wish',
        text: 'Toss a coin and make a wish',
        outcomes: [{
          description: 'The coin catches light as it falls—a tiny sun diving into darkness. What did you wish for? Even now, you cannot quite say. The fountain accepts the offering without comment.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 5 },
            { stat: StatType.MALAISE, change: -5 }
          ],
          addNarration: 'Made a wish at the fountain; participated in universal ritual.'
        }]
      },
      {
        id: 'analyze_sculpture',
        text: 'Study the sculptural details critically',
        requiredStat: { stat: StatType.OBSERVATION, minValue: 14 },
        outcomes: [{
          description: 'Second-rate Bernini, you decide. The nymphs lack genuine abandon; the dolphins are merely decorative. Yet the water redeems it all, lending movement to frozen forms. Perhaps that is the lesson.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 7 },
            { stat: StatType.REPUTATION, change: 2 }
          ],
          addNarration: 'Critiqued fountain sculpture; found redemption in water\'s motion.'
        }]
      },
      {
        id: 'listen_only',
        text: 'Simply listen to the water',
        outcomes: [{
          description: 'You close your eyes. The water speaks in a language older than French, older than English—the language of becoming and returning. When you open your eyes, several minutes have passed.',
          statChanges: [
            { stat: StatType.MALAISE, change: -12 },
            { stat: StatType.COMPOSURE, change: 10 }
          ],
          addNarration: 'Lost time listening to fountain; found wordless restoration.'
        }]
      }
    ],
    historicalNote: 'The 1889 Exposition featured elaborate fountains, including illuminated water displays that were technological marvels of the era.',
    repeatable: true,
    priority: 4
  },

  {
    id: 'the_photograph_display',
    title: 'The Mechanical Eye',
    description: 'A display of photographs arrests your attention—portraits of workers, of street scenes, of faces captured with brutal clarity. No painter\'s interpretation mediates between subject and viewer. Is this truth, or a new kind of lie?',
    category: 'intellectual',
    triggerType: 'OBJECT_EXAMINE',
    triggerConditions: {
      objectId: 'photograph',
      biomes: ['GALERIE', 'GRAND_HALL'],
      probability: 0.75,
    },
    choices: [
      {
        id: 'admire_technology',
        text: 'Admire the technology\'s possibilities',
        outcomes: [{
          description: 'The detail is astonishing—every wrinkle, every thread, every shadow preserved. Here is democracy of vision, you think. The camera does not flatter or condemn. It simply sees.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 5 },
            { stat: StatType.COMPOSURE, change: 5 }
          ],
          addNarration: 'Appreciated photographic technology; saw democratic potential in mechanical vision.'
        }]
      },
      {
        id: 'question_art',
        text: 'Wonder what this means for art',
        requiredStat: { stat: StatType.OBSERVATION, minValue: 16 },
        outcomes: [{
          description: 'If a machine can capture appearances so perfectly, what remains for the artist? The interior, you decide. The camera cannot photograph consciousness. That territory remains yours.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 10 },
            { stat: StatType.MALAISE, change: 5 }
          ],
          addNarration: 'Confronted photography\'s challenge to art; claimed consciousness as artistic domain.'
        }]
      },
      {
        id: 'feel_unease',
        text: 'Feel vaguely disturbed and move on',
        outcomes: [{
          description: 'Something about the photographs unsettles you—perhaps their indiscriminate honesty, their refusal of selection. You turn away, carrying a small unease you cannot name.',
          statChanges: [
            { stat: StatType.MALAISE, change: 8 },
            { stat: StatType.INSPIRATION, change: 3 }
          ],
          addNarration: 'Felt unease before photographs; sensed technology\'s threat to mystery.'
        }]
      }
    ],
    historicalNote: 'Photography was still a relatively new medium in 1889, and its relationship to traditional arts was hotly debated among intellectuals.',
    repeatable: false,
    priority: 5
  },

  {
    id: 'the_colonial_artifact',
    title: 'The Colonial Display',
    description: 'In the colonial pavilion, an African mask stares from behind glass. Around it, explanatory cards describe "primitive art" and "native customs." The mask\'s expression seems to regard all this with ancient irony.',
    category: 'intellectual',
    triggerType: 'OBJECT_EXAMINE',
    triggerConditions: {
      objectId: 'artifact',
      biomes: ['GALERIE', 'VILLAGE'],
      probability: 0.7,
    },
    choices: [
      {
        id: 'appreciate_aesthetics',
        text: 'Appreciate its formal qualities',
        requiredStat: { stat: StatType.OBSERVATION, minValue: 15 },
        outcomes: [{
          description: 'The proportions are deliberate, the abstraction purposeful. This is not "primitive"—it is sophisticated in ways the exhibition\'s organizers cannot perceive. You feel complicit, somehow, in the misunderstanding.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 8 },
            { stat: StatType.MALAISE, change: 10 }
          ],
          addNarration: 'Recognized sophistication in "primitive" art; felt complicit in colonial framing.'
        }]
      },
      {
        id: 'feel_discomfort',
        text: 'Acknowledge your discomfort with the display',
        outcomes: [{
          description: 'There is something wrong here—the mask behind glass, the explanatory cards, the whole apparatus of exhibition. You are implicated simply by looking. The mask seems to agree.',
          statChanges: [
            { stat: StatType.MALAISE, change: 8 },
            { stat: StatType.COMPOSURE, change: -5 },
            { stat: StatType.INSPIRATION, change: 4 }
          ],
          addNarration: 'Felt discomfort at colonial display; recognized complicity in looking.'
        }]
      },
      {
        id: 'pass_quickly',
        text: 'Pass by without lingering',
        outcomes: [{
          description: 'You move through quickly, eyes averted. Some exhibitions are best not examined too closely. The mask\'s gaze follows you, or so it seems.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 5 },
            { stat: StatType.MALAISE, change: 3 }
          ],
          addNarration: 'Avoided colonial display; discomfort over engagement.'
        }]
      }
    ],
    historicalNote: 'The 1889 Exposition included extensive colonial displays, reflecting the era\'s imperialist ideology. The "village indigène" was a particularly problematic attraction.',
    repeatable: false,
    priority: 6
  },

  {
    id: 'the_music_box',
    title: 'The Mechanical Song',
    description: 'A music box plays a Chopin nocturne, the notes emerging from brass cylinders with eerie precision. Each note perfect, each phrase identical to the last iteration. Is this music, or its ghost?',
    category: 'aesthetic',
    triggerType: 'OBJECT_EXAMINE',
    triggerConditions: {
      objectId: 'music_box',
      biomes: ['SALON', 'GALERIE'],
      probability: 0.8,
    },
    choices: [
      {
        id: 'appreciate_craft',
        text: 'Marvel at the craftsmanship',
        outcomes: [{
          description: 'The engineering is exquisite—each pin placed with mathematical precision, each note a small triumph of human ingenuity. Chopin himself might have been amused, you think.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 5 },
            { stat: StatType.COMPOSURE, change: 8 }
          ],
          addNarration: 'Admired music box craftsmanship; found beauty in mechanical precision.'
        }]
      },
      {
        id: 'miss_humanity',
        text: 'Miss the human imperfection of live performance',
        outcomes: [{
          description: 'Something essential is missing—the breath of the performer, the possibility of error, the unique unrepeatable moment. This is memory without life. Perfect and therefore dead.',
          statChanges: [
            { stat: StatType.MALAISE, change: 8 },
            { stat: StatType.INSPIRATION, change: 6 }
          ],
          addNarration: 'Found music box soulless; mourned absence of human imperfection.'
        }]
      },
      {
        id: 'listen_transcend',
        text: 'Let the music transcend its mechanism',
        requiredStat: { stat: StatType.OBSERVATION, minValue: 14 },
        outcomes: [{
          description: 'You close your eyes and hear only the music—not its source. Chopin speaks from beyond the grave, through brass and wire. Perhaps all art is a kind of mechanical reproduction of the spirit.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 10 },
            { stat: StatType.MALAISE, change: -5 }
          ],
          addNarration: 'Transcended mechanism to hear music; art survives reproduction.'
        }]
      }
    ],
    historicalNote: 'Music boxes and mechanical instruments fascinated 19th-century audiences, raising questions about art, reproduction, and the nature of performance.',
    repeatable: false,
    priority: 4
  },

  {
    id: 'the_mirror_gallery',
    title: 'The Infinite Regression',
    description: 'In a hall of mirrors, your reflection multiplies into infinity—Henry James repeated endlessly, each iteration slightly different, slightly more distant. You have written about consciousness observing itself. Here it is made literal.',
    triggerType: 'OBJECT_EXAMINE',
    triggerConditions: {
      objectId: 'mirror',
      biomes: ['GALERIE', 'SALON'],
      probability: 0.75,
    },
    choices: [
      {
        id: 'study_reflections',
        text: 'Study the infinite versions of yourself',
        requiredStat: { stat: StatType.OBSERVATION, minValue: 16 },
        outcomes: [{
          description: 'Each reflection shows a slightly different angle—this one more stern, that one more weary. Which is the true James? Perhaps the observer who stands outside all reflections, asking the question.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 12 },
            { stat: StatType.MALAISE, change: 8 }
          ],
          addNarration: 'Studied infinite reflections; confronted multiplicity of self.'
        }]
      },
      {
        id: 'look_away',
        text: 'Look away—too much self-consciousness is dangerous',
        outcomes: [{
          description: 'You avert your gaze. There is such a thing as too much introspection. The risk of paralysis, of disappearing into one\'s own depths. Better to look outward, at the world that needs describing.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 10 },
            { stat: StatType.MALAISE, change: -5 }
          ],
          addNarration: 'Avoided mirror depths; chose external observation over introspection.'
        }]
      },
      {
        id: 'bow_ironically',
        text: 'Bow ironically to your reflections',
        outcomes: [{
          description: 'You execute a small, formal bow. The infinite Jameses bow back in perfect unison. A private joke. Even existential anxiety can be greeted with manners.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 8 },
            { stat: StatType.INSPIRATION, change: 4 }
          ],
          addNarration: 'Greeted mirror selves with ironic bow; maintained humor before vertigo.'
        }]
      }
    ],
    historicalNote: 'James\'s late style was famous for its self-reflexive complexity, with sentences that seemed to observe themselves thinking.',
    repeatable: false,
    priority: 5
  },

  {
    id: 'the_telegraph_office',
    title: 'The Electric Word',
    description: 'The telegraph office buzzes with activity—messages flying across continents in moments, collapsing distance into electrical impulse. A clerk offers to send a message anywhere in the world. "Where shall it go, monsieur?"',
    triggerType: 'OBJECT_EXAMINE',
    triggerConditions: {
      objectId: 'telegraph',
      biomes: ['GRAND_HALL', 'GALERIE'],
      probability: 0.8,
    },
    choices: [
      {
        id: 'send_message',
        text: 'Send a brief message to London',
        outcomes: [{
          description: '"Arrived safely. Paris magnificent. More soon." The clerk taps out the words. In minutes, your presence will be known across the Channel. The world shrinks, and something is lost in the shrinking.',
          statChanges: [
            { stat: StatType.REPUTATION, change: 3 },
            { stat: StatType.COMPOSURE, change: 5 },
            { stat: StatType.MALAISE, change: 3 }
          ],
          addNarration: 'Sent telegraph message; participated in communication revolution.'
        }]
      },
      {
        id: 'decline_politely',
        text: 'Decline—some distances should not be collapsed',
        outcomes: [{
          description: '"No thank you," you say. There is value in the letter\'s slow arrival, in the gap between writing and reading. The telegraph is too immediate, too urgent. Some thoughts need time to travel.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 8 },
            { stat: StatType.INSPIRATION, change: 3 }
          ],
          addNarration: 'Refused telegraph; defended temporal distance in communication.'
        }]
      },
      {
        id: 'watch_operators',
        text: 'Watch the operators work',
        requiredStat: { stat: StatType.OBSERVATION, minValue: 13 },
        outcomes: [{
          description: 'The operators\' fingers dance on the keys—a new language of dots and dashes, urgent and staccato. Their faces are blank with concentration. They are mediums, you realize, channeling voices they never hear.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 8 },
            { stat: StatType.COMPOSURE, change: 5 }
          ],
          addNarration: 'Observed telegraph operators; saw them as mediums of disembodied voice.'
        }]
      }
    ],
    historicalNote: 'James frequently used telegrams in his fiction, often to create moments of dramatic revelation or miscommunication.',
    repeatable: false,
    priority: 5
  },

  {
    id: 'the_painting_encounter',
    title: 'The Arrested Gaze',
    description: 'In a gallery corner, a painting stops you cold: a woman at a window, her face half-turned, her expression unreadable. The brushwork is remarkable, but it is her ambiguity that holds you—what is she thinking?',
    triggerType: 'OBJECT_EXAMINE',
    triggerConditions: {
      objectId: 'painting',
      biomes: ['GALERIE', 'SALON'],
      probability: 0.75,
    },
    choices: [
      {
        id: 'invent_story',
        text: 'Invent her story',
        requiredStat: { stat: StatType.WIT, minValue: 14 },
        outcomes: [{
          description: 'She is waiting for someone who will not come. No—she is deciding whether to leave. No—she has already decided, and this is the last moment before everything changes. You could write her.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 12 },
            { stat: StatType.COMPOSURE, change: -3 }
          ],
          addNarration: 'Invented story for painted woman; fiction emerged from ambiguous image.'
        }]
      },
      {
        id: 'study_technique',
        text: 'Study the technical execution',
        outcomes: [{
          description: 'The handling of light through the window, the loose brushwork of the curtain contrasting with the precise detail of her hands—masterful. Yet technique alone does not explain the painting\'s hold on you.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 6 },
            { stat: StatType.COMPOSURE, change: 5 }
          ],
          addNarration: 'Analyzed painting technique; appreciated craft without explaining mystery.'
        }]
      },
      {
        id: 'preserve_mystery',
        text: 'Preserve the mystery—do not explain her',
        outcomes: [{
          description: 'You step back without interpretation. Some images should remain ambiguous, their power residing precisely in what cannot be said. You carry her with you, unexplained.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 8 },
            { stat: StatType.INSPIRATION, change: 5 }
          ],
          addNarration: 'Preserved painting\'s mystery; resisted interpretation.'
        }]
      }
    ],
    historicalNote: 'James was deeply engaged with visual art and wrote art criticism throughout his career. His fiction often features characters contemplating paintings.',
    repeatable: true,
    priority: 4
  },

  {
    id: 'the_empty_chair',
    title: 'The Empty Chair',
    description: 'In a quiet corner of a café, an empty chair faces you—its cushion still indented from a recent occupant, a half-finished coffee on the table. The person has gone, but their absence remains present, almost palpable.',
    triggerType: 'OBJECT_EXAMINE',
    triggerConditions: {
      objectId: 'chair',
      biomes: ['SALON', 'GARDEN'],
      probability: 0.7,
    },
    choices: [
      {
        id: 'sit_there',
        text: 'Take the empty seat',
        outcomes: [{
          description: 'You sit where they sat, inheriting their view. The coffee grows cold before you. Who were they? Where did they go? You are living in their aftermath, briefly inhabiting their space.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 6 },
            { stat: StatType.MALAISE, change: 5 }
          ],
          addNarration: 'Occupied a stranger\'s absence; inherited anonymous perspective.'
        }]
      },
      {
        id: 'imagine_occupant',
        text: 'Imagine who sat there',
        requiredStat: { stat: StatType.OBSERVATION, minValue: 15 },
        outcomes: [{
          description: 'From the coffee choice—strong, black—and the newspaper folded to the financial pages, you construct them: a businessman, worried about markets, meeting someone who never arrived. Pure invention, but it feels true.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 10 }
          ],
          addNarration: 'Constructed absent person from clues; fiction from emptiness.'
        }]
      },
      {
        id: 'leave_undisturbed',
        text: 'Leave the tableau undisturbed',
        outcomes: [{
          description: 'You pass by without touching anything. The empty chair remains a small mystery in the exposition\'s vastness—someone else\'s story, complete in itself.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 5 }
          ],
          addNarration: 'Left empty chair undisturbed; respected another\'s absence.'
        }]
      }
    ],
    historicalNote: 'James was fascinated by absence and presence, often structuring stories around what is not shown or who is missing from a scene.',
    repeatable: true,
    priority: 3
  },

  {
    id: 'the_book_stall',
    title: 'The Found Volume',
    description: 'At a book stall, your fingers find a slim volume—your own "Daisy Miller," in French translation. You open it to a random page. The words are yours and not yours, transformed by translation into something strange.',
    triggerType: 'OBJECT_EXAMINE',
    triggerConditions: {
      objectId: 'book',
      biomes: ['GALERIE', 'GARDEN'],
      probability: 0.65,
    },
    choices: [
      {
        id: 'read_translation',
        text: 'Read the translation critically',
        requiredStat: { stat: StatType.WIT, minValue: 14 },
        outcomes: [{
          description: 'The translator has captured your meaning, mostly, but something is lost—the particular rhythm of your sentences, the Anglo-Saxon simplicity against Latinate complexity. You are both pleased and bereft.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 6 },
            { stat: StatType.MALAISE, change: 5 }
          ],
          addNarration: 'Read own work in translation; experienced loss and gain of linguistic transformation.'
        }]
      },
      {
        id: 'buy_copy',
        text: 'Purchase a copy as a souvenir',
        outcomes: [{
          description: 'You buy the book from the bemused vendor, who does not recognize you. A private joke, owning yourself in another language. You slip it into your pocket like a secret.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 8 },
            { stat: StatType.INSPIRATION, change: 3 }
          ],
          itemGain: 'daisy_miller_french',
          addNarration: 'Purchased own book anonymously; possessed yourself in translation.'
        }]
      },
      {
        id: 'replace_quietly',
        text: 'Replace the book quietly',
        outcomes: [{
          description: 'You set the book back among its fellows. Perhaps someone will buy it, read it, think thoughts you cannot predict. The book will have a life beyond you, as all books must.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: 10 },
            { stat: StatType.MALAISE, change: -3 }
          ],
          addNarration: 'Released own book to anonymous fate; art beyond author.'
        }]
      }
    ],
    historicalNote: '"Daisy Miller" (1878) was James\'s first major commercial success and made him famous on both sides of the Atlantic.',
    repeatable: false,
    priority: 6
  },
];

// ==========================================
// PHRASE DISCOVERY EVENTS
// Events where a Jamesian phrase comes unbidden
// ==========================================

export const PHRASE_EVENTS: GameEvent[] = [
  {
    id: 'phrase_moment_garden',
    title: 'A Thought Unbidden',
    description: 'Walking through the gardens, you find your mind suddenly arrested by a phrase—complete, unbidden, rising from some depth of consciousness you cannot name. You must write it down before it dissolves.',
    triggerType: 'RANDOM_ZONE',
    triggerConditions: {
      biomes: ['GARDEN', 'TROCADERO'],
      probability: 0.1,
      cooldownMinutes: 30,
    },
    choices: [
      {
        id: 'write_immediately',
        text: 'Stop and write immediately',
        outcomes: [{
          description: 'You pause beneath a chestnut tree and capture the phrase in your notebook. The words feel both familiar and strange—as if you had always known them but never before articulated them.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 8 },
            { stat: StatType.COMPOSURE, change: -3 }
          ],
          addNarration: 'Captured a phrase that arrived unbidden in the gardens.'
        }]
      },
      {
        id: 'hold_in_mind',
        text: 'Hold it in mind and continue walking',
        outcomes: [{
          description: 'You carry the phrase with you, turning it over as you walk. By the time you find a bench, it has shifted slightly—perhaps improved, perhaps diminished. No matter. The core remains.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 5 },
            { stat: StatType.COMPOSURE, change: 5 }
          ],
          addNarration: 'Meditated on a phrase while walking; it settled into something new.'
        }]
      }
    ],
    historicalNote: 'James often spoke of phrases and sentences arriving "unbidden," as if from outside himself.',
    repeatable: true,
    priority: 4
  },
  {
    id: 'phrase_moment_crowd',
    title: 'The Unbidden Phrase',
    description: 'In the midst of the crowd, something someone says—you cannot even identify who—triggers an avalanche of words. A phrase forms, crystalline and complete, demanding to be recorded.',
    triggerType: 'RANDOM_ZONE',
    triggerConditions: {
      biomes: ['GRAND_HALL', 'ESPLANADE', 'GALERIE'],
      probability: 0.03,
      cooldownMinutes: 25,
    },
    choices: [
      {
        id: 'excuse_self',
        text: 'Excuse yourself and find a quiet corner',
        outcomes: [{
          description: 'You slip away from the crowd, notebook already in hand. The phrase waits, patient, until you can give it form on paper. There. Captured. Safe.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 10 },
            { stat: StatType.REPUTATION, change: -2 }
          ],
          addNarration: 'Fled the crowd to capture a phrase; art before society.'
        }]
      },
      {
        id: 'whisper_repeat',
        text: 'Whisper it to yourself until you can write',
        requiredStat: { stat: StatType.OBSERVATION, minValue: 14 },
        outcomes: [{
          description: 'You murmur the words under your breath, a private incantation amid the public spectacle. A woman nearby gives you an odd look. Let her. The phrase survives.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 7 },
            { stat: StatType.MALAISE, change: 3 }
          ],
          addNarration: 'Preserved a phrase through whispered repetition in the crowd.'
        }]
      }
    ],
    historicalNote: 'James was known to stop mid-conversation when inspiration struck, often to the consternation of his companions.',
    repeatable: true,
    priority: 5
  },
  {
    id: 'phrase_memory_minny',
    title: 'The Return of Memory',
    description: 'Something—the angle of light, a woman\'s laugh, the particular shade of a dress—recalls Minny Temple with such force that words follow: words about her, about loss, about the persistence of the dead in the living mind.',
    triggerType: 'RANDOM_ZONE',
    triggerConditions: {
      biomes: ['GARDEN', 'SALON', 'GALERIE'],
      probability: 0.03,
      cooldownMinutes: 90,
    },
    choices: [
      {
        id: 'embrace_memory',
        text: 'Let the memory and the words wash over you',
        outcomes: [{
          description: 'You stand very still, allowing Minny\'s ghost to speak through you. The words that come are hers and yours both—a collaboration across the boundary of death.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 12 },
            { stat: StatType.MALAISE, change: 8 }
          ],
          addNarration: 'Minny Temple\'s memory produced unexpected words; grief transformed to art.'
        }]
      },
      {
        id: 'note_quickly',
        text: 'Note the words quickly and move on',
        outcomes: [{
          description: 'You capture the phrase with clinical efficiency, refusing to dwell. There will be time for feeling later. For now, the work is what matters.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 6 },
            { stat: StatType.COMPOSURE, change: 5 }
          ],
          addNarration: 'Recorded a memory-phrase without surrendering to its undertow.'
        }]
      }
    ],
    historicalNote: 'Minny Temple died of tuberculosis in 1870 at age 24. James wrote that her death "was the end of youth" for him.',
    repeatable: true,
    priority: 6
  },
  {
    id: 'phrase_observation_acute',
    title: 'Acute Observation',
    description: 'Watching two strangers interact, you suddenly understand something about human nature that demands expression. The words come fast, tumbling over themselves in their eagerness to be written.',
    triggerType: 'RANDOM_ZONE',
    triggerConditions: {
      biomes: ['SALON', 'GRAND_HALL', 'GARDEN'],
      probability: 0.01,
      cooldownMinutes: 20,
    },
    choices: [
      {
        id: 'develop_fully',
        text: 'Develop the thought fully before writing',
        requiredStat: { stat: StatType.WIT, minValue: 13 },
        outcomes: [{
          description: 'You let the observation expand, watching it grow branches and roots before committing it to paper. When you finally write, the phrase contains multitudes.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 10 },
            { stat: StatType.COMPOSURE, change: -5 }
          ],
          addNarration: 'Observed strangers; expanded insight into fully-formed phrase.'
        }]
      },
      {
        id: 'sketch_quickly',
        text: 'Sketch the essence quickly',
        outcomes: [{
          description: 'You jot the core insight—a few words, a gesture toward meaning. It will need refinement, but the seed is preserved.',
          statChanges: [
            { stat: StatType.INSPIRATION, change: 5 },
            { stat: StatType.COMPOSURE, change: 3 }
          ],
          addNarration: 'Sketched a quick observation; the seed of something larger.'
        }]
      }
    ],
    historicalNote: 'James\'s notebooks are filled with brief observations that later bloomed into major works.',
    repeatable: true,
    priority: 4
  }
];

// ==========================================
// BREAKAGE EVENTS - triggered by accidentally breaking objects
// A moral dilemma: confess or flee?
// ==========================================

export const BREAKAGE_EVENTS: Record<string, GameEvent> = {
  'breakage_statue': {
    id: 'breakage_statue',
    title: 'The Shattered Marble',
    description: 'You stand frozen in horror. At your feet, fragments of what was moments ago a graceful marble figure lie scattered like accusations. The echoing crash has turned several heads. A guard is already looking this way. Your heart pounds as you consider your options.',
    triggerType: 'IMMEDIATE',
    triggerConditions: {},
    choices: [
      {
        id: 'confess_immediately',
        text: 'Find a guard and confess honestly',
        outcomes: [{
          description: 'The guard listens with barely concealed exasperation. "Accidents happen, monsieur. You will need to provide your name and address for the damages." The sum mentioned is considerable, but your conscience is clear. William would approve of the pragmatic morality.',
          statChanges: [
            { stat: StatType.REPUTATION, change: -15 },
            { stat: StatType.COMPOSURE, change: 10 },
            { stat: StatType.MALAISE, change: -5 }
          ],
          addNarration: 'Confessed to breaking a sculpture; maintained moral integrity at cost to reputation and purse.'
        }]
      },
      {
        id: 'slip_away_quietly',
        text: 'Quietly blend into the crowd and walk away',
        requiredStat: { stat: StatType.COMPOSURE, minValue: 10 },
        outcomes: [{
          description: 'You drift away with studied nonchalance, your pulse hammering. No cry of "Stop!" pursues you. You are free, but the knowledge of what you\'ve done settles in your chest like a cold stone. The fragment of marble in your pocket—you don\'t even remember picking it up—will haunt your dreams.',
          statChanges: [
            { stat: StatType.COMPOSURE, change: -8 },
            { stat: StatType.MALAISE, change: 15 },
            { stat: StatType.INSPIRATION, change: 5 }
          ],
          addNarration: 'Fled the scene of accidental destruction; guilt became creative material.'
        }]
      },
      {
        id: 'blame_crowd',
        text: 'Look around accusingly as if someone else did it',
        requiredStat: { stat: StatType.WIT, minValue: 14 },
        outcomes: [{
          description: '"Did you see that?" you say loudly to no one in particular. "Some ruffian simply crashed into it and ran off!" A few visitors nod sympathetically. The guard who approaches thanks you for your observation. The lie sits in your throat like ash, but you are safe.',
          statChanges: [
            { stat: StatType.WIT, change: 2 },
            { stat: StatType.COMPOSURE, change: -5 },
            { stat: StatType.MALAISE, change: 20 }
          ],
          addNarration: 'Deflected blame for the accident with a lie; the moral compromise weighs heavily.'
        }]
      }
    ],
    historicalNote: 'James was acutely conscious of social propriety and the weight of moral decisions. His fiction often explores the consequences of small moral compromises.',
    repeatable: true,
    priority: 8
  },

  'breakage_display': {
    id: 'breakage_display',
    title: 'A Crash of Glass and Conscience',
    description: 'The display case gives way with a spectacular shattering of glass. Precious artifacts spill across the marble floor—ancient ceramics, delicate clockwork, irreplaceable curiosities from distant lands. You can hear footsteps approaching rapidly. The damage is done; what remains is how you face it.',
    triggerType: 'IMMEDIATE',
    triggerConditions: {},
    choices: [
      {
        id: 'take_responsibility',
        text: 'Stay and accept full responsibility',
        outcomes: [{
          description: 'The curator who arrives is surprisingly philosophical. "These things happen in crowds," he sighs, surveying the damage. "But I appreciate your honesty, monsieur. Most would have fled." He takes your details for the insurance claim. The financial sting is sharp, but you leave with your integrity intact.',
          statChanges: [
            { stat: StatType.REPUTATION, change: -10 },
            { stat: StatType.COMPOSURE, change: 15 },
            { stat: StatType.OBSERVATION, change: 2 }
          ],
          addNarration: 'Took responsibility for breaking a display case; found unexpected grace in honesty.'
        }]
      },
      {
        id: 'help_then_leave',
        text: 'Help gather the artifacts, then slip away in the confusion',
        requiredStat: { stat: StatType.OBSERVATION, minValue: 12 },
        outcomes: [{
          description: 'You kneel and begin carefully collecting the scattered items, playing the helpful bystander. In the chaos of arriving officials and gasping tourists, you eventually drift away. Your good deed partially salves your conscience, but not entirely. A small jade figure accidentally finds its way into your pocket.',
          statChanges: [
            { stat: StatType.MALAISE, change: 8 },
            { stat: StatType.INSPIRATION, change: 8 }
          ],
          itemGain: 'jade_memento',
          addNarration: 'Helped clean up, then fled; kept a small memento of moral ambiguity.'
        }]
      },
      {
        id: 'feign_medical_emergency',
        text: 'Pretend to faint from the shock',
        requiredStat: { stat: StatType.WIT, minValue: 16 },
        outcomes: [{
          description: 'You clutch your chest and sink artfully to the floor. "My heart!" you gasp. The attention shifts entirely to your "condition." A crowd gathers, someone fetches water, and by the time you\'ve "recovered," the question of blame has been lost in the general concern for your wellbeing.',
          statChanges: [
            { stat: StatType.WIT, change: 3 },
            { stat: StatType.COMPOSURE, change: -10 },
            { stat: StatType.MALAISE, change: 15 },
            { stat: StatType.REPUTATION, change: 5 }
          ],
          addNarration: 'Escaped responsibility through theatrical deception; the performance haunts you.'
        }]
      }
    ],
    historicalNote: 'The 1889 Exposition featured countless priceless artifacts from around the world, many on public display for the first time. Security was minimal by modern standards.',
    repeatable: true,
    priority: 8
  }
};

// Get breakage event by object type
export const getBreakageEvent = (objectType: 'statue' | 'display'): GameEvent => {
  return objectType === 'statue' ? BREAKAGE_EVENTS['breakage_statue'] : BREAKAGE_EVENTS['breakage_display'];
};

// Combined export for easy access
export const ALL_EVENTS: GameEvent[] = [...RANDOM_EVENTS, ...OBJECT_EVENTS, ...PHRASE_EVENTS, ...Object.values(BREAKAGE_EVENTS)];

// Helper function to get events by trigger type
export const getEventsByTrigger = (triggerType: GameEvent['triggerType']): GameEvent[] => {
  return ALL_EVENTS.filter(e => e.triggerType === triggerType);
};

// Helper function to get events for a specific biome
export const getEventsForBiome = (biome: string): GameEvent[] => {
  return ALL_EVENTS.filter(e =>
    !e.triggerConditions.biomes ||
    e.triggerConditions.biomes.includes(biome as any)
  );
};
