// Pre-written tile interaction narratives
// These appear in the Narrator panel when pressing SPACE on/near interactable tiles

export type TileInteraction = {
    tileId: string;
    onTile: boolean;          // true = must be standing ON tile, false = adjacent works
    narratives: string[];     // Pool of possible responses (random pick)
    contextual?: boolean;     // If true, can reference zone cultural theme
    inspirationChance: number; // Chance to gain 1 inspiration (0-1)
    action: string;           // Short label for the action, e.g., "Sit", "Examine"
};

// Helper to get cultural theme description for contextual interactions
export const CULTURAL_DESCRIPTIONS: Record<string, string> = {
    'japanese': 'the refined arts of Japan—lacquerwork, screens, and ceramics of exquisite delicacy',
    'chinese': 'the ancient productions of the Celestial Empire—porcelain, silk, and jade',
    'persian': 'the geometric splendors of Persia—carpets, tilework, and calligraphic manuscripts',
    'egyptian': 'the antiquities of the Nile—mummies, scarabs, and fragments of dynasties',
    'moorish': 'the ornamental genius of the Moors—arabesques, zellige, and carved plaster',
    'african': 'the carved masks and figures of the Dark Continent, arranged with ethnographic precision',
    'mesoamerican': 'the artifacts of vanished American empires—obsidian, gold, and feathered serpents',
    'italian': 'the classical inheritance of Italy—marble, bronze, and Renaissance swagger',
    'default': 'the cultural productions of distant lands, arranged for the edification of the curious'
};

export const TILE_INTERACTIONS: TileInteraction[] = [
    // ==================
    // SEATING / RESTING (Standing ON tile)
    // ==================
    {
        tileId: 'CUSHION',
        onTile: true,
        action: 'Sit',
        inspirationChance: 0.4,
        narratives: [
            "You lower yourself onto the cushion with the cautious deliberation of a man uncertain whether comfort is quite the thing one ought to seek at an international exposition.",
            "The cushion receives your weight with oriental submission. For a moment, the crowds recede to a bearable distance.",
            "You settle onto the cushion and find yourself, unexpectedly, at rest. The posture feels foreign, somehow—too horizontal for the vertical ambitions of the age."
        ]
    },
    {
        tileId: 'BENCH',
        onTile: true,
        action: 'Sit',
        inspirationChance: 0.3,
        narratives: [
            "You take a seat on the bench, the iron cold through your trousers, and watch the human parade with the detachment of a man who has paid admission to his own life.",
            "The bench offers the democracy of public seating—your neighbors a nursemaid, a provincial in his Sunday best, a gentleman whose hat has seen better days.",
            "You sit. The bench, bolted to the earth with municipal permanence, makes no comment on your presence or your purposes."
        ]
    },
    {
        tileId: 'WIDE_BENCH',
        onTile: true,
        action: 'Sit',
        inspirationChance: 0.3,
        narratives: [
            "The bench accommodates your presence with the democratic indifference of public furniture, leaving ample room for fellow seekers of respite.",
            "You claim a portion of the bench, that universal territory where strangers briefly share the condition of fatigue.",
            "The wide bench stretches in either direction, populated by the weary and the contemplative. You join their silent fraternity."
        ]
    },
    {
        tileId: 'SEAT',
        onTile: true,
        action: 'Sit',
        inspirationChance: 0.35,
        narratives: [
            "The velvet seat receives you with the promise of imminent spectacle. The fabric holds the warmth of previous occupants.",
            "You sink into the theater seat, becoming part of that expectant congregation who have paid for the privilege of collective attention.",
            "The seat's plush embrace suggests that what follows will justify the discomfort of anticipation."
        ]
    },
    {
        tileId: 'CHAIR_N',
        onTile: true,
        action: 'Sit',
        inspirationChance: 0.3,
        narratives: [
            "You take the chair with the deliberate care of a man who has learned that public seating is never quite private. The wood creaks its acceptance.",
            "The chair receives your weight with continental politeness, its bentwood curves offering the promise of temporary rest.",
            "You settle into the chair, assuming the posture of one who observes rather than participates—the natural attitude of the American abroad."
        ]
    },
    {
        tileId: 'CHAIR_S',
        onTile: true,
        action: 'Sit',
        inspirationChance: 0.3,
        narratives: [
            "You take the chair with the deliberate care of a man who has learned that public seating is never quite private. The wood creaks its acceptance.",
            "The chair receives your weight with continental politeness, its bentwood curves offering the promise of temporary rest.",
            "You settle into the chair, assuming the posture of one who observes rather than participates—the natural attitude of the American abroad."
        ]
    },
    {
        tileId: 'CHAIR_E',
        onTile: true,
        action: 'Sit',
        inspirationChance: 0.3,
        narratives: [
            "You take the chair with the deliberate care of a man who has learned that public seating is never quite private. The wood creaks its acceptance.",
            "The chair receives your weight with continental politeness, its bentwood curves offering the promise of temporary rest.",
            "You settle into the chair, assuming the posture of one who observes rather than participates—the natural attitude of the American abroad."
        ]
    },
    {
        tileId: 'CHAIR_W',
        onTile: true,
        action: 'Sit',
        inspirationChance: 0.3,
        narratives: [
            "You take the chair with the deliberate care of a man who has learned that public seating is never quite private. The wood creaks its acceptance.",
            "The chair receives your weight with continental politeness, its bentwood curves offering the promise of temporary rest.",
            "You settle into the chair, assuming the posture of one who observes rather than participates—the natural attitude of the American abroad."
        ]
    },

    // ==================
    // FLORA (Adjacent or ON)
    // ==================
    {
        tileId: 'FLOWERBED',
        onTile: true,
        action: 'Smell the flowers',
        inspirationChance: 0.5,
        narratives: [
            "You bend toward the blossoms, inhaling a sweetness that speaks of hothouse cultivation and considerable municipal expense.",
            "The flowers offer their fragrance with vegetable generosity—dahlias, asters, something tropical whose name escapes you.",
            "You pause to smell the flowers, that gesture of refined sensibility, and find yourself genuinely pleased by the result."
        ]
    },
    {
        tileId: 'TREE',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.25,
        narratives: [
            "The chestnut spreads its canopy with the confidence of a tree that has witnessed several revolutions and expects to witness more.",
            "You regard the tree—a horse chestnut, you believe—with the appreciation of a man who has spent too long among the mechanical marvels.",
            "The tree offers shade and the rustle of leaves, those ancient consolations that no steam engine has yet improved upon."
        ]
    },
    {
        tileId: 'HEDGE',
        onTile: false,
        action: 'Touch',
        inspirationChance: 0.15,
        narratives: [
            "The boxwood hedge submits to your touch, its leaves dense with the geometry of French cultivation, nature disciplined into architecture.",
            "You brush the hedge with your fingertips, feeling the glossy leaves and the shears' invisible geometry.",
            "The hedge stands with vegetable dignity, trimmed to a precision that suggests strong opinions about the proper relationship between man and nature."
        ]
    },
    {
        tileId: 'PALM',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.3,
        narratives: [
            "The palm rises incongruously from Parisian soil, a vegetable ambassador from warmer latitudes, its fronds stirring in a breeze it must find disappointingly temperate.",
            "You contemplate the palm tree, that emblem of the exotic transplanted to the banks of the Seine at what must have been considerable expense.",
            "The palm suggests climates where winter is merely a rumor—an arboreal promise of elsewhere that the exposition has seen fit to import."
        ]
    },
    {
        tileId: 'PLANT',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.2,
        narratives: [
            "The potted specimen offers a domesticated tropicality, nature rendered portable and polite for the purposes of interior decoration.",
            "You examine the plant, whose leaves suggest origins more interesting than its current pot-bound circumstances.",
            "The potted plant endures its ornamental captivity with the patience of all things green, awaiting water and whatever light the exposition provides."
        ]
    },

    // ==================
    // DISPLAY OBJECTS (Adjacent, Contextual)
    // ==================
    {
        tileId: 'DISPLAY',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.45,
        contextual: true,
        narratives: [
            "You peer into the case at [CULTURAL] Objects whose journey to this vitrine was doubtless more interesting than their current repose.",
            "The display case presents [CULTURAL] The glass both reveals and distances, turning artifacts into specimens.",
            "Behind the glass, [CULTURAL] Each object wears a small card explaining what it is, if not quite what it means."
        ]
    },
    {
        tileId: 'STATUE',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.35,
        narratives: [
            "The statue regards you with the fixed expression of bronze immortality, its pose struck for an audience that will never tire of looking.",
            "You study the figure's frozen gesture, wondering what the sculptor intended and what the centuries have since decided.",
            "The statue offers that peculiar silence of art objects—a refusal to explain itself that borders on the aristocratic."
        ]
    },
    {
        tileId: 'STATUE_ASIAN_TALL',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.4,
        narratives: [
            "The tall figure gazes with Asiatic serenity upon the passing crowds, its gilded surface catching the light with patient luminosity.",
            "You regard the statue, whose proportions speak of aesthetic traditions older than Notre-Dame, and find yourself momentarily elsewhere.",
            "The figure rises with the calm of carved stone, its expression suggesting millennia of contemplation that your brief attention cannot disturb."
        ]
    },
    {
        tileId: 'STATUE_ASIAN_SMALL',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.35,
        narratives: [
            "The small figure offers the concentrated presence of devotional art, its features worn smooth by generations of reverent touch.",
            "You examine the figurine's delicate features, each line carved with a patience that the modern age has largely forgotten.",
            "The figure sits in miniature enlightenment, undisturbed by its relocation from temple to exposition."
        ]
    },
    {
        tileId: 'STATUE_EGYPTIAN_TALL',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.45,
        narratives: [
            "The pharaonic figure stands with the rigid dignity of three thousand years, its stone gaze having already seen everything the exposition might offer.",
            "You look up at the Egyptian colossus, feeling briefly the weight of dynasties pressing down through the granite.",
            "The statue's pose—one foot forward, arms at sides—has persisted unchanged since before Rome was a village. You find this both comforting and faintly terrifying."
        ]
    },
    {
        tileId: 'STATUE_EGYPTIAN_BUST',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.35,
        narratives: [
            "The ancient face regards you with kohl-rimmed eyes that have outlasted their original owner by uncomfortable millennia.",
            "You study the carved features, wondering about the life that once animated this stone likeness—the meals taken, the plots hatched, the death eventually met.",
            "The bust's serene expression suggests secrets that neither time nor archaeology has managed to extract."
        ]
    },
    {
        tileId: 'STATUE_AFRICAN_TALL',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.4,
        narratives: [
            "The carved figure rises with an authority that needs no pedestal to announce itself, its stylized features speaking a visual language the exposition's labels do not quite translate.",
            "You regard the statue, whose proportions follow rules other than the classical, and feel the limitation of your own aesthetic vocabulary.",
            "The tall figure commands its corner of the gallery with the presence of the sacred, however far from its original shrine."
        ]
    },
    {
        tileId: 'STATUE_AFRICAN_MASK',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.45,
        narratives: [
            "The mask stares from its mounting with an intensity that suggests it was made for purposes more serious than exhibition.",
            "You meet the mask's carved gaze and experience a flicker of something—recognition, perhaps, or its opposite.",
            "The mask's expression hovers between the human and something else, its crafted features suggesting ceremonies you cannot imagine."
        ]
    },
    {
        tileId: 'STATUE_MESOAMERICAN',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.45,
        narratives: [
            "The stone figure squats with New World gravity, its features carved by hands that never knew iron, from a civilization the Spaniards found inconvenient.",
            "You contemplate the statue, whose blocky permanence has outlasted the empire that created it and may yet outlast the one that collected it.",
            "The Aztec or Mayan—the label is unclear—figure regards you with the patience of stone, its meaning as opaque as its material is hard."
        ]
    },
    {
        tileId: 'STATUE_BUST',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.3,
        narratives: [
            "The classical bust presents its marble features with the confidence of Greco-Roman tradition, the nose perhaps a restoration.",
            "You study the sculpted face, finding there the template upon which European portraiture has been drawing interest for centuries.",
            "The bust's blank eyes gaze past you toward some ideal realm where philosophers still walk in togas and the light is perpetually Athenian."
        ]
    },
    {
        tileId: 'STATUE_ALLEGORICAL',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.35,
        narratives: [
            "The allegorical figure strikes its symbolic pose with the earnestness of the nineteenth century, representing something—Progress? Liberty? Commerce?—with flowing drapery and upraised arm.",
            "You contemplate the statue, which personifies an abstraction with the confidence of an age that believed such things could be carved in stone.",
            "The figure represents, according to its plaque, a concept that requires considerable bronze to embody and even more credulity to credit."
        ]
    },
    {
        tileId: 'STATUE_MONUMENTAL',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.4,
        narratives: [
            "The monumental figure dominates its surroundings with the assurance of subsidized art, its scale suggesting that importance can be measured in cubic meters.",
            "You crane your neck at the statue, feeling appropriately diminished, which was doubtless the sculptor's intention.",
            "The colossus rises with civic grandeur, commemorating something or someone whose significance the exposition assumes you already appreciate."
        ]
    },
    {
        tileId: 'COLUMN',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.15,
        narratives: [
            "The column rises with classical pretensions, bearing nothing heavier than the weight of aesthetic expectation and perhaps a minor cornice.",
            "You regard the column, that architectural quotation from antiquity, and wonder whether it supports anything or merely suggests that it might.",
            "The column stands with Doric—or is it Ionic?—dignity, its fluting catching the light in ways that Greek builders first calculated millennia ago."
        ]
    },

    // ==================
    // MACHINES / TECHNOLOGY (Adjacent)
    // ==================
    {
        tileId: 'PHONOGRAPH',
        onTile: false,
        action: 'Listen',
        inspirationChance: 0.5,
        narratives: [
            "The machine's brass horn emits a spectral voice, the dead speaking to the living through Edison's necromancy. You lean closer, disturbed and fascinated.",
            "A tinny melody emerges from the phonograph, music stripped of its presence and preserved like a botanical specimen in wax.",
            "You listen as the phonograph reproduces sounds captured elsewhere, elsewhen—a mechanical memory more reliable, perhaps, than your own."
        ]
    },
    {
        tileId: 'MACHINERY',
        onTile: false,
        action: 'Observe',
        inspirationChance: 0.35,
        narratives: [
            "The engine labors with mechanical devotion, its pistons rising and falling like the prayers of industry, each stroke a small conversion of fire into force.",
            "You watch the machinery's patient rhythm, steel and steam performing their marriage of elements with oily precision.",
            "The machine works. That is its nature and its justification, this relentless transformation of fuel into motion that the century has made its creed."
        ]
    },
    {
        tileId: 'DYNAMO',
        onTile: false,
        action: 'Observe',
        inspirationChance: 0.45,
        narratives: [
            "The dynamo hums with invisible force, electricity made audible, the future announcing itself in frequencies the ear can barely credit.",
            "You stand before the generator, feeling in your teeth a vibration that suggests powers older than mythology and newer than last week's newspaper.",
            "The dynamo spins, producing by some alchemy of copper and motion that fluid the century has decided to worship. You genuflect appropriately."
        ]
    },
    {
        tileId: 'ARC_LAMP',
        onTile: false,
        action: 'Observe',
        inspirationChance: 0.35,
        narratives: [
            "The arc lamp blazes with a light too harsh for shadows, too modern for romance—the future's glare made incandescent.",
            "You squint at the arc lamp's brilliance, that electrical noon which renders gaslight quaint and candlelight prehistoric.",
            "The lamp burns with voltaic intensity, its carbons slowly sacrificing themselves to a luminosity that newspapers call progress."
        ]
    },
    {
        tileId: 'TELEGRAPH',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.35,
        narratives: [
            "The telegraph key waits beneath your fingers, a portal to distant correspondents who might, at this very moment, be waiting for words you haven't yet composed.",
            "You regard the telegraph apparatus, that device which has made distance merely administrative and separated presence from communication.",
            "The machine sits silent, but you imagine the messages pulsing through its wires—commerce, diplomacy, love, and grief reduced to dots and dashes."
        ]
    },
    {
        tileId: 'PRINTING_PRESS',
        onTile: false,
        action: 'Observe',
        inspirationChance: 0.4,
        narratives: [
            "The press stamps its inky impressions with mechanical regularity, each sheet emerging with the day's news still damp and smelling of solvents.",
            "You watch the press at work, that machine which has made opinion portable and revolution possible, churning out its paper progeny.",
            "The printing press clatters with the sound of information becoming permanent, each impression a small act of mechanical memory."
        ]
    },
    {
        tileId: 'LOOM',
        onTile: false,
        action: 'Observe',
        inspirationChance: 0.4,
        narratives: [
            "The Jacquard loom weaves its programmed patterns, those punched cards instructing the threads in a language older than algebra.",
            "You watch the loom's patient shuttle, following logic encoded in cardboard, producing cloth that is also, somehow, computation.",
            "The mechanical loom works its automated craft, each thread placed according to instructions that were ancient when Babbage was young."
        ]
    },
    {
        tileId: 'HYDRAULIC_PRESS',
        onTile: false,
        action: 'Observe',
        inspirationChance: 0.3,
        narratives: [
            "The hydraulic press descends with inexorable patience, water pressure translated into force sufficient to reshape metal—and, one imagines, anything else.",
            "You observe the press's slow power, that mechanical patience which can, given time, flatten or form whatever is placed beneath its attention.",
            "The machine applies pressure with hydraulic calm, demonstrating that sufficient force, properly directed, can persuade any material to comply."
        ]
    },

    // ==================
    // STREET OBJECTS (Adjacent or ON)
    // ==================
    {
        tileId: 'NEWSPAPER',
        onTile: true,
        action: 'Read',
        inspirationChance: 0.35,
        narratives: [
            "*Le Figaro* reports on ministerial scandal, anarchist threats, and a society wedding. Plus ça change, plus c'est la même chose.",
            "The headlines shout of colonial victories and Boulangist intrigues. You skim the columns, finding the usual mixture of alarm and advertisement.",
            "You glance at the discarded paper—yesterday's news, already obsolete, its urgencies fading into the general sediment of history."
        ]
    },
    {
        tileId: 'KIOSK',
        onTile: false,
        action: 'Browse',
        inspirationChance: 0.3,
        narratives: [
            "The Morris column advertises tonight's entertainments with typographic enthusiasm—operettas, panoramas, and exhibitions of the merely peculiar.",
            "You scan the kiosk's posters: the Moulin Rouge promises dancers, the Hippodrome offers equestrian spectacle, and someone is selling a cure for everything.",
            "The cylindrical kiosk wears its advertisements like a paper costume, each poster competing for your attention with claims of unprecedented wonder."
        ]
    },
    {
        tileId: 'LAMP',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.2,
        narratives: [
            "The gas lamp stands sentinel, awaiting dusk and its moment of modest illumination, that nightly ritual the electric light threatens to make obsolete.",
            "You regard the lamp post, that iron shepherd of the urban night, its glass housing dark now but promising the reliability of gas.",
            "The lamp offers a preview of evening, when its small flame will join thousands of others in holding back the dark that cities have decided to refuse."
        ]
    },
    {
        tileId: 'FOUNTAIN_CENTER',
        onTile: false,
        action: 'Observe',
        inspirationChance: 0.45,
        narratives: [
            "Water rises and falls with hydraulic choreography, a display of civic wealth made liquid and luminous in the afternoon light.",
            "You watch the fountain's perpetual performance, that marriage of engineering and aesthetics which the French have elevated to municipal religion.",
            "The fountain plays its liquid music, each jet calculated by engineers and enjoyed by thousands who neither know nor care about the mathematics."
        ]
    },
    {
        tileId: 'FOUNTAIN_EDGE',
        onTile: false,
        action: 'Observe',
        inspirationChance: 0.35,
        narratives: [
            "The fountain's edge offers a seat for the weary and a view of the water's rise and fall, that ancient entertainment requiring no admission.",
            "You linger at the basin's rim, watching light shatter on the water's surface into a thousand temporary diamonds.",
            "The stone lip of the fountain is worn smooth by the countless others who have paused here, proving that some pleasures never tire."
        ]
    },
    {
        tileId: 'CARRIAGE',
        onTile: false,
        action: 'Observe',
        inspirationChance: 0.25,
        narratives: [
            "The carriage waits with equine patience, its horse contemplating matters beyond human ken while its driver dozes on the box.",
            "You observe the fiacre, that four-wheeled convenience which makes Paris navigable for those with the fare and the destination.",
            "The carriage stands ready, promising transport from here to elsewhere at speeds the horse considers reasonable and the century finds quaint."
        ]
    },

    // ==================
    // MISCELLANEOUS / AMBIANCE
    // ==================
    {
        tileId: 'CARPET',
        onTile: true,
        action: 'Feel',
        inspirationChance: 0.3,
        narratives: [
            "The carpet's pile speaks of Persian looms and the labor of distant hands, each knot a small testimony to patience that borders on the devotional.",
            "You note the carpet beneath your feet—its patterns geometric, its colors vegetable, its presence a small portable elsewhere.",
            "The carpet softens your footfall with oriental courtesy, its woven geometry older than the building that now contains it."
        ]
    },
    {
        tileId: 'BRAZIER',
        onTile: false,
        action: 'Warm your hands',
        inspirationChance: 0.25,
        narratives: [
            "The brazier's heat offers comfort against the August evening's surprising chill, its coals glowing with patient combustion.",
            "You extend your hands toward the brazier, accepting the warmth that fire has been offering since before history found its voice.",
            "The brazier burns with the simple charity of carbon meeting oxygen, asking nothing in return but the occasional additional fuel."
        ]
    },
    {
        tileId: 'RAILING',
        onTile: false,
        action: 'Lean',
        inspirationChance: 0.2,
        narratives: [
            "You rest your weight against the railing, assuming the posture of the contemplative observer, that figure the exposition has inadvertently created.",
            "The iron railing accepts your lean with the sturdiness of municipal specification, having been designed for precisely this purpose.",
            "You grip the railing, feeling the day's accumulated warmth in the metal, and allow yourself a moment of supported contemplation."
        ]
    },
    {
        tileId: 'STEAM',
        onTile: true,
        action: 'Feel',
        inspirationChance: 0.2,
        narratives: [
            "The steam envelops you briefly, warm and damp, smelling of industry and progress and things being transformed into other things.",
            "You pass through the steam, emerging slightly damp and somehow more modern, baptized by the exhalations of machinery.",
            "The vapor embraces you with industrial intimacy, that warm breath of engines which the century has made its preferred atmosphere."
        ]
    },
    {
        tileId: 'LANTERN',
        onTile: false,
        action: 'Observe',
        inspirationChance: 0.2,
        narratives: [
            "The lantern sways gently, its flame a small domestic sun that has not yet received word of its electrical replacement.",
            "You watch the lantern's modest glow, that portable illumination which has served travelers since before the roads were paved.",
            "The hanging lantern offers its light with the generosity of fire, asking only oil in return for keeping the dark at bay."
        ]
    },
    {
        tileId: 'BANNER',
        onTile: false,
        action: 'Read',
        inspirationChance: 0.15,
        narratives: [
            "The banner announces its message in letters large enough for the distracted, its fabric stirring with whatever breeze the exhibition provides.",
            "You glance at the banner, which proclaims something about progress or unity or the sponsoring nation's considerable virtues.",
            "The flag hangs with the patient heraldry of cloth, its colors chosen by committee and its message approved by ministries."
        ]
    },
    {
        tileId: 'FLAGPOLE',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.2,
        narratives: [
            "The flagpole rises with patriotic verticality, its tricolor snapping in the breeze with the confidence of a nation hosting the world.",
            "You regard the flagpole, that symbol of sovereignty planted here as surely as any explorer's flag on foreign soil.",
            "The mast stands tall, its halyard lines taut, the flag above proclaiming French dominion over at least this portion of the Champ de Mars."
        ]
    },

    // ==================
    // AQUARIUM & SPECIAL EXHIBITS
    // ==================
    {
        tileId: 'AQUARIUM',
        onTile: false,
        action: 'Observe',
        inspirationChance: 0.45,
        narratives: [
            "The glass reveals an underwater world in miniature—fish from Mediterranean shores and tropical seas drifting past with the indifference of creatures who do not know they are being exhibited.",
            "You press close to the aquarium glass, your breath fogging the view. A grouper regards you with an expression that might be curiosity or might be the vacant default of its species.",
            "The aquarium glows with phosphorescent life, its inhabitants swimming through artificial currents in a simulation of freedom. You wonder if they know the difference."
        ]
    },
    {
        tileId: 'CULTURAL_ARTIFACT',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.5,
        contextual: true,
        narratives: [
            "The artifact speaks of [CULTURAL] Its journey to this vitrine involved, one suspects, both scholarship and empire.",
            "You examine the piece, feeling the weight of centuries in its craftsmanship. The museum card explains what it is; what it means remains more elusive.",
            "The artifact sits in its case with the patience of something that has outlasted the culture that created it and may yet outlast the one displaying it."
        ]
    },
    {
        tileId: 'SCIENTIFIC_INSTRUMENT',
        onTile: false,
        action: 'Examine',
        inspirationChance: 0.4,
        narratives: [
            "The instrument bristles with calibrated precision—dials, lenses, and mechanisms whose purposes you can only partially divine. Science has its own aesthetics.",
            "You study the apparatus, admiring the craftsmanship if not entirely grasping the function. The brass and glass suggest measurements of things invisible to the naked eye.",
            "The scientific instrument gleams with the confidence of empiricism, promising to quantify what was previously mere impression."
        ]
    },

    // ==================
    // VENDORS / KIOSKS
    // ==================
    {
        tileId: 'KIOSK',
        onTile: false,
        action: 'Browse',
        inspirationChance: 0.1,
        narratives: [
            "You approach the kiosk, that ubiquitous feature of the modern fair—a small temple to commerce, its wares displayed with democratic accessibility.",
            "The vendor regards you with the patient calculation of one who has learned to read purchasing intent in a stranger's gaze.",
            "The kiosk's offerings are arranged with provincial optimism, each item promising to transport a fragment of Paris back to wherever you came from."
        ]
    }
];

// Helper function to get interaction for a tile
export const getInteractionForTile = (tileId: string): TileInteraction | undefined => {
    return TILE_INTERACTIONS.find(i => i.tileId === tileId);
};

// Helper to get a random narrative with optional context substitution
export const getInteractionNarrative = (
    interaction: TileInteraction,
    culturalTheme?: string
): string => {
    const narrative = interaction.narratives[Math.floor(Math.random() * interaction.narratives.length)];

    if (interaction.contextual && narrative.includes('[CULTURAL]')) {
        const themeDesc = CULTURAL_DESCRIPTIONS[culturalTheme || 'default'] || CULTURAL_DESCRIPTIONS['default'];
        return narrative.replace('[CULTURAL]', themeDesc);
    }

    return narrative;
};

// ==========================================
// TILE EVENTS - Special interactions that trigger mini-events
// ==========================================

export type TileEventChoice = {
    id: string;
    text: string;
    outcome: TileEventOutcome;
};

export type TileEventOutcome = {
    description: string;
    reputationChange?: number;
    composureChange?: number;
    inspirationChange?: number;
    healthChange?: number;
    malaiseChange?: number;
    isFatal?: boolean;  // For arc lamp electrocution
    isBreak?: boolean;  // Triggers embarrassment modal
};

export type TileEvent = {
    tileId: string;
    eventChance: number;      // 0-1, chance this event triggers on interaction
    breakChance?: number;     // 0-1, chance of breaking the object (separate from event)
    title: string;
    description: string;
    choices: TileEventChoice[];
    breakDescriptions?: string[];  // Pool of descriptions for when object breaks
};

// Breakable objects with their break chances and embarrassment descriptions
export const BREAKABLE_TILES: Record<string, { breakChance: number; descriptions: string[] }> = {
    'CULTURAL_ARTIFACT': {
        breakChance: 0.08,
        descriptions: [
            "Your elbow catches the artifact—a Tang dynasty vase, the card informs you—and time seems to slow as it topples, shatters, and scatters across the floor in a thousand porcelain accusations. The silence that follows is worse than any sound.",
            "You lean in for a closer look and somehow, impossibly, knock the artifact from its pedestal. The crash draws every eye in the gallery. A guard begins walking toward you with terrible purpose.",
            "The artifact slips from your grip—you hadn't meant to touch it, but there it was, and there it goes, fragmenting against the marble floor into pieces that can never be made whole. Your reputation follows suit."
        ]
    },
    'SCIENTIFIC_INSTRUMENT': {
        breakChance: 0.06,
        descriptions: [
            "The delicate mechanism yields to your investigative touch with a snap that echoes through the hall. Gears and springs scatter like startled birds. The inventor's expression suggests you have murdered his child.",
            "Something gives way beneath your fingers—a calibrated something, a precisely machined something—and the instrument collapses into expensive components. Onlookers pretend not to have noticed, which somehow makes it worse.",
            "Your curiosity proves excessive. The instrument, designed for careful hands and controlled environments, surrenders to your enthusiasm with a series of clicks, pops, and one final, definitive crack."
        ]
    },
    'MACHINERY': {
        breakChance: 0.04,
        descriptions: [
            "You pull the wrong lever—any lever, really, was the wrong lever—and the machine groans, shudders, and expires with a theatrical hiss of steam. The engineer's curses require no translation.",
            "Something jams. Something else overheats. The machine, which had been demonstrating the triumph of industry, demonstrates instead the consequences of unqualified interference. Your name, you suspect, will appear in the incident report.",
            "The beautiful machinery seizes up with a sound like mechanical agony. Workers rush to intervene, but the damage is done—to the machine, to the demonstration, to your standing among those who witnessed it."
        ]
    },
    'DYNAMO': {
        breakChance: 0.05,
        descriptions: [
            "The dynamo's hum rises to a shriek, sparks cascade from the brushes, and then—silence. The electrical demonstration has concluded prematurely, and everyone knows whose fault it is.",
            "You touch something conductive. The dynamo disagrees with this decision violently, showering the gallery with sparks before falling into sullen darkness. Edison himself could not have created a more spectacular failure.",
            "The generator's rhythm falters, stumbles, and stops. Lights throughout the pavilion flicker and die. In the sudden dimness, you feel the weight of a hundred accusing stares."
        ]
    },
    'DISPLAY': {
        breakChance: 0.03,
        descriptions: [
            "The display case proves less sturdy than it appeared. Glass shatters with musical finality, artifacts scatter, and you stand amid the wreckage like a monument to carelessness.",
            "Your gesture—merely illustrative, surely innocent—connects with the case at an unfortunate angle. The sound of breaking glass draws a crowd you would prefer not to address.",
            "The case tips. The contents slide. You grab for something, anything, and succeed only in making the disaster more comprehensive. The museum guard's whistle cuts through the chaos."
        ]
    },
    'PHONOGRAPH': {
        breakChance: 0.04,
        descriptions: [
            "The needle skips, scratches, and with a sound like mechanical despair, gouges a permanent groove across Mr. Edison's wax cylinder. The recorded voice, silenced forever, joins the list of things you have inadvertently ended.",
            "You adjust the horn and something snaps. The phonograph, that miracle of preserved sound, becomes instead a monument to your mechanical incompetence. The demonstrator's expression needs no phonograph to communicate.",
            "The mechanism jams at your touch, the cylinder cracks, and the ghost in the machine falls silent. You have broken the future, or at least this particular demonstration of it."
        ]
    }
};

// Arc lamp special danger
export const ARC_LAMP_DANGER = {
    fatalChance: 0.02,  // 2% chance of fatal electrocution
    shockChance: 0.08,  // 8% chance of non-fatal shock
    shockDescriptions: [
        "The arc lamp's electrical current finds a path through your arm—a searing, convulsive instant that leaves you shaking but alive. Your hand tingles for hours afterward, a reminder of forces best left to professionals.",
        "You touch something you shouldn't. The shock travels through your body with intimate violence, dropping you to your knees. Helpful hands assist you upright, but your dignity remains on the floor.",
        "Electricity arcs through you briefly but memorably. The experience leaves you with a new respect for the invisible fluid that powers the modern age, and a profound disinterest in further experimentation."
    ],
    fatalDescriptions: [
        "The current takes you before you can scream. In that final instant, you see the Exposition spread below—all its wonders, all its promises of the future—and then you see nothing at all. They will write that you died in the service of progress, which is almost true.",
        "Your hand closes on the wrong wire. The voltage, sufficient to light a city block, courses through your body with lethal efficiency. The last thing you hear is someone shouting for a doctor, but it is far too late for medicine."
    ]
};

// Special tile events (mini-events with choices)
export const TILE_EVENTS: TileEvent[] = [
    // AQUARIUM - Fish feeding event
    {
        tileId: 'AQUARIUM',
        eventChance: 0.4,
        title: 'A Hungry Visitor',
        description: 'A large, iridescent fish swims to the glass and regards you with an eye that seems almost intelligent. Its mouth opens and closes with what can only be described as expectation. A small sign nearby reads "Please Do Not Feed the Fish" in three languages.',
        choices: [
            {
                id: 'feed_fish',
                text: 'Discreetly offer it a bit of bread from your pocket',
                outcome: {
                    description: 'The fish accepts your offering with an enthusiasm that borders on the undignified. Its satisfaction is evident. Unfortunately, so is the guard\'s disapproval, expressed in rapid French and meaningful gestures toward the exit.',
                    reputationChange: -5,
                    malaiseChange: 5,
                    inspirationChange: 3
                }
            },
            {
                id: 'refuse_fish',
                text: 'Firmly resist those pleading aquatic eyes',
                outcome: {
                    description: 'You maintain your composure in the face of piscine manipulation. The fish, after a moment of what appears to be disappointment, swims away to try its luck with other visitors. You feel you have passed some obscure test of character.',
                    composureChange: 2,
                    inspirationChange: 1
                }
            }
        ]
    },

    // TELESCOPE - What you see
    {
        tileId: 'TELESCOPE',
        eventChance: 0.35,
        title: 'A Glimpse of Paris',
        description: 'The telescope\'s brass eyepiece is cool against your face. Paris sprawls below in miniature—and there, in a window across the river, you catch a glimpse of something... intimate. A couple in what they surely believed to be privacy.',
        choices: [
            {
                id: 'look_away',
                text: 'Redirect the telescope toward more appropriate subjects',
                outcome: {
                    description: 'You swing the telescope toward the noble profile of Notre-Dame, allowing the anonymous Parisians their moment. The cathedral\'s ancient stones offer a safer, if less scandalous, vista.',
                    composureChange: 3,
                    inspirationChange: 2
                }
            },
            {
                id: 'keep_watching',
                text: 'Maintain your observation in the interest of... anthropology',
                outcome: {
                    description: 'You observe longer than strictly necessary, telling yourself it is research into the human condition. The guilt that follows suggests your conscience disagrees with this rationalization.',
                    malaiseChange: 8,
                    inspirationChange: 5
                }
            }
        ]
    },

    // STAGE - Performance opportunity
    {
        tileId: 'STAGE',
        eventChance: 0.25,
        title: 'An Unexpected Invitation',
        description: 'The performer spots you in the crowd and beckons you onto the stage. The audience turns to look. Escape seems impossible without causing a greater scene than participation would.',
        choices: [
            {
                id: 'participate',
                text: 'Ascend the stage with what dignity you can muster',
                outcome: {
                    description: 'You find yourself holding a prop, speaking lines you do not know, in a comedy whose humor escapes you entirely. The audience laughs, though whether with you or at you remains ambiguous. You survive.',
                    reputationChange: 5,
                    composureChange: -5,
                    inspirationChange: 8
                }
            },
            {
                id: 'decline',
                text: 'Shake your head and retreat into the crowd',
                outcome: {
                    description: 'You melt backward into the audience, leaving the performer to find another victim. The relief is immediate, though a small voice wonders what you might have experienced.',
                    composureChange: 2,
                    malaiseChange: 3
                }
            }
        ]
    },

    // DRUM - Ceremonial invitation
    {
        tileId: 'DRUM',
        eventChance: 0.3,
        title: 'The Rhythm Calls',
        description: 'The drummers pause and gesture toward you, offering their instrument. The rhythm they were playing still echoes in your chest. The watching crowd seems to expect something.',
        choices: [
            {
                id: 'try_drum',
                text: 'Accept the drumstick and attempt to play',
                outcome: {
                    description: 'Your rhythm is... uncertain. The drummers are kind, guiding your hands toward something approaching music. When they take over again, you have learned that some languages require no translation.',
                    reputationChange: 3,
                    inspirationChange: 10,
                    composureChange: -3
                }
            },
            {
                id: 'decline_drum',
                text: 'Bow respectfully and decline',
                outcome: {
                    description: 'You gesture your appreciation but step back, content to observe. The drummers nod—they have seen tourists before—and resume their performance with undiminished energy.',
                    composureChange: 2
                }
            }
        ]
    },

    // DONKEY - Unexpected companion
    {
        tileId: 'DONKEY',
        eventChance: 0.35,
        title: 'A Persistent Acquaintance',
        description: 'The donkey has decided you are interesting. It follows you with patient determination, occasionally nudging your pocket where, as it happens, you have stored a somewhat stale croissant.',
        choices: [
            {
                id: 'feed_donkey',
                text: 'Surrender the croissant to your new friend',
                outcome: {
                    description: 'The croissant disappears with surprising speed. The donkey regards you with what might be affection, or might be calculation about future pastries. Either way, you have made a friend today.',
                    inspirationChange: 5,
                    malaiseChange: -3
                }
            },
            {
                id: 'keep_croissant',
                text: 'Protect your provisions from this four-legged mendicant',
                outcome: {
                    description: 'You fend off the donkey\'s advances with increasing desperation. Its persistence outlasts your dignity. By the time you escape, the croissant tastes of victory but also of guilt.',
                    composureChange: -2,
                    malaiseChange: 2
                }
            }
        ]
    },

    // FIRE_PIT - Warming moment
    {
        tileId: 'FIRE_PIT',
        eventChance: 0.25,
        title: 'Warmth and Memory',
        description: 'The fire\'s warmth draws you closer. Across the flames, an elderly man meets your eyes and gestures to the seat beside him. He seems to want to tell you something.',
        choices: [
            {
                id: 'sit_listen',
                text: 'Accept the invitation and listen',
                outcome: {
                    description: 'His French is accented with something older, something from far away. The story he tells makes no literal sense, but somehow you understand it perfectly. When he finishes, the fire seems warmer.',
                    inspirationChange: 12,
                    malaiseChange: -5,
                    composureChange: 3
                }
            },
            {
                id: 'polite_decline',
                text: 'Smile politely and move on',
                outcome: {
                    description: 'You nod and continue walking, leaving the old man to his fire and his stories. The warmth fades quickly from your back. You wonder, briefly, what he might have said.',
                    malaiseChange: 2
                }
            }
        ]
    },

    // MARKET_STALL - Haggling encounter
    {
        tileId: 'MARKET_STALL',
        eventChance: 0.3,
        title: 'The Art of Commerce',
        description: 'The merchant has fixed upon you as his next customer, producing an object of dubious antiquity and certain enthusiasm. His price, announced with theatrical confidence, is almost certainly negotiable.',
        choices: [
            {
                id: 'haggle',
                text: 'Enter into negotiations with appropriate skepticism',
                outcome: {
                    description: 'The dance of commerce begins. He offers, you counter, he clutches his heart in mock distress. Twenty minutes later, you own something you didn\'t need at a price you both consider a victory. This is how civilization works.',
                    reputationChange: 2,
                    inspirationChange: 4,
                    composureChange: -2
                }
            },
            {
                id: 'refuse',
                text: 'Decline firmly and extract yourself',
                outcome: {
                    description: 'You deploy your most impenetrable American reserve. The merchant, recognizing a lost cause, releases you with surprising grace. There will be other tourists.',
                    composureChange: 2
                }
            }
        ]
    },

    // WATERFALL - Meditative moment
    {
        tileId: 'WATERFALL',
        eventChance: 0.2,
        title: 'The Sound of Falling Water',
        description: 'The artificial cascade fills the air with white noise that seems to wash away the exposition\'s clamor. For a moment, you could be anywhere—or nowhere. The temptation to close your eyes is considerable.',
        choices: [
            {
                id: 'meditate',
                text: 'Close your eyes and let the sound wash over you',
                outcome: {
                    description: 'Time becomes unclear. The water sounds. Your thoughts, usually so insistent, quiet themselves. When you open your eyes, the exposition seems somehow more bearable.',
                    malaiseChange: -10,
                    composureChange: 5,
                    inspirationChange: 8
                }
            },
            {
                id: 'move_on',
                text: 'Appreciate the effect briefly and continue',
                outcome: {
                    description: 'You allow yourself a moment of appreciation before the schedule reasserts itself. The waterfall will be here tomorrow; your appointments will not wait.',
                    inspirationChange: 2
                }
            }
        ]
    },

    // TOTEM - Spiritual encounter
    {
        tileId: 'TOTEM',
        eventChance: 0.2,
        title: 'Eyes That Watch',
        description: 'The carved faces seem to follow you. This is, of course, a trick of the artist\'s skill, but knowing this does not diminish the effect. The lowest face appears to be smiling. Or grimacing. The distinction seems important.',
        choices: [
            {
                id: 'contemplate',
                text: 'Stand before the totem and return its gaze',
                outcome: {
                    description: 'You meet the carved eyes without flinching. The moment stretches. When it ends, you feel you have been assessed and, perhaps, found acceptable. The experience resists rational explanation.',
                    inspirationChange: 15,
                    composureChange: -2,
                    malaiseChange: 3
                }
            },
            {
                id: 'respect_distance',
                text: 'Observe from a respectful distance',
                outcome: {
                    description: 'Some things are not meant for tourists. You admire the craftsmanship from afar, leaving the mysteries to those who might understand them.',
                    inspirationChange: 3
                }
            }
        ]
    }
];

// Helper to get a tile event
export const getTileEvent = (tileId: string): TileEvent | undefined => {
    return TILE_EVENTS.find(e => e.tileId === tileId);
};

// Check if a breakable object breaks (returns description if broken, undefined if not)
export const checkBreakable = (tileId: string): string | undefined => {
    const breakable = BREAKABLE_TILES[tileId];
    if (!breakable) return undefined;

    if (Math.random() < breakable.breakChance) {
        return breakable.descriptions[Math.floor(Math.random() * breakable.descriptions.length)];
    }
    return undefined;
};

// ==========================================
// CONFIRMATION ACTIONS - Special interactions requiring yes/no confirmation
// ==========================================

export type ConfirmationActionDef = {
    tileId: string;
    title: string;
    description: string;
    warning?: string;
    yesText?: string;
    noText?: string;
    // Outcomes
    successNarratives: string[];
    cancelNarrative: string;
    // Stat changes on success
    reputationChange?: number;
    composureChange?: number;
    inspirationChange?: number;
    malaiseChange?: number;
    // Special flags
    hasAnimation?: boolean;  // If true, parent should play animation
    animationType?: 'flag_lower' | 'fountain_splash' | 'other';
};

export const CONFIRMATION_ACTIONS: ConfirmationActionDef[] = [
    {
        tileId: 'FLAGPOLE',
        title: 'Lower the Flag?',
        description: 'The halyard rope dangles within reach, its brass cleat worn smooth by official hands. You could, with minimal effort, lower whatever banner currently proclaims national pride from this pole.',
        warning: 'This will almost certainly attract unwanted attention.',
        yesText: 'Lower the flag',
        noText: 'Step away',
        successNarratives: [
            "You release the cleat and ease the halyard through your hands. The flag descends with surprising speed, its fabric rippling in defeat. By the time it pools at the base of the pole, you can already hear shouts of alarm. The feeling is half panic, half exhilaration—the liberation of the genuinely transgressive act.",
            "The rope moves through your fingers as the flag surrenders to gravity. Down it comes, the colors that meant something to someone now meaning something else entirely—a gesture of defiance, or perhaps mere mischief. Guards are converging from multiple directions.",
            "With deliberate slowness, you lower the flag, watching it descend like a theatrical curtain on the pretensions of empire. The act feels historic, or possibly criminal. The distinction, at this moment, seems unimportant."
        ],
        cancelNarrative: "You release the rope, leaving the flag to its authorized elevation. Some rebellions are best imagined rather than enacted.",
        reputationChange: -20,
        composureChange: -5,
        inspirationChange: 15,
        malaiseChange: 10,
        hasAnimation: true,
        animationType: 'flag_lower'
    },
    {
        tileId: 'FOUNTAIN_CENTER',
        title: 'Wade Into the Fountain?',
        description: 'The fountain\'s basin beckons with its cool promise. The water is clear, perhaps knee-deep, and on this warm August afternoon the temptation to step in—just for a moment—is considerable.',
        warning: 'Your clothing will be soaked. Your dignity will be questioned.',
        yesText: 'Step into the water',
        noText: 'Resist temptation',
        successNarratives: [
            "The water is shockingly cold against your calves, then your thighs, then—as you lose your footing on the slippery basin floor—everywhere at once. You emerge gasping, triumphant, and thoroughly saturated. Children point and laugh. Their nannies look scandalized. You feel, absurdly, more alive than you have all week.",
            "You step over the basin's edge and immediately your shoes fill with water, your trousers cling like a second skin, and the fountain's spray becomes intimate rather than ornamental. A great splash accompanies your stumble. The crowd's reaction ranges from horror to delight.",
            "The fountain accepts your intrusion with liquid indifference. Water soaks through to your skin as you stand amid the jets, momentarily transformed from observer to spectacle. When you emerge, dripping, you leave a trail of wet footprints and astonished faces."
        ],
        cancelNarrative: "You step back from the edge, allowing the fountain to continue its performance without your participation. The water remains untouched, your dignity intact.",
        reputationChange: -15,
        composureChange: -10,
        inspirationChange: 20,
        malaiseChange: -15,  // Actually refreshing!
        hasAnimation: true,
        animationType: 'fountain_splash'
    },
    {
        tileId: 'FOUNTAIN_EDGE',
        title: 'Splash in the Fountain?',
        description: 'The fountain spray mists your face invitingly. You could easily swing your legs over the basin edge and dangle your feet in the cool water—or even wade in entirely.',
        warning: 'This is not the behavior expected of a gentleman.',
        yesText: 'Give in to temptation',
        noText: 'Maintain composure',
        successNarratives: [
            "You sit on the basin's edge and swing your legs into the water. The relief is immediate—cool liquid embracing your overheated feet, spray freckling your face. A guard shouts something, but you're too busy feeling gloriously, childishly happy to care.",
            "The water welcomes you with a splash that soaks your trousers to the knee. You've become part of the fountain now, a human ornament to this hydraulic display. The looks you receive are worth every soggy step that will follow.",
            "You kick off your shoes and step in. The cold is delicious, the impropriety intoxicating. For one perfect moment, you are not an observer but a participant in something joyful and ridiculous."
        ],
        cancelNarrative: "You draw back, allowing the fountain to maintain its dignity and you yours. Some pleasures must remain theoretical.",
        reputationChange: -10,
        composureChange: -8,
        inspirationChange: 15,
        malaiseChange: -20,
        hasAnimation: true,
        animationType: 'fountain_splash'
    }
];

// Helper to get confirmation action for a tile
export const getConfirmationAction = (tileId: string): ConfirmationActionDef | undefined => {
    return CONFIRMATION_ACTIONS.find(a => a.tileId === tileId);
};

// Check arc lamp danger (returns { type: 'fatal' | 'shock' | 'safe', description?: string })
export const checkArcLampDanger = (): { type: 'fatal' | 'shock' | 'safe', description?: string } => {
    const roll = Math.random();

    if (roll < ARC_LAMP_DANGER.fatalChance) {
        return {
            type: 'fatal',
            description: ARC_LAMP_DANGER.fatalDescriptions[Math.floor(Math.random() * ARC_LAMP_DANGER.fatalDescriptions.length)]
        };
    }

    if (roll < ARC_LAMP_DANGER.fatalChance + ARC_LAMP_DANGER.shockChance) {
        return {
            type: 'shock',
            description: ARC_LAMP_DANGER.shockDescriptions[Math.floor(Math.random() * ARC_LAMP_DANGER.shockDescriptions.length)]
        };
    }

    return { type: 'safe' };
};
