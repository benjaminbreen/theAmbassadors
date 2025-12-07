import React from 'react';

// ============================================================================
// STATUE GRAPHICS - 1889 World's Fair Sculpture Collection
// ============================================================================
// Highly detailed SVG sculptures representing the diverse artistic traditions
// displayed at the Exposition Universelle. Each piece features:
// - Multi-layer gradients for realistic bronze/marble/stone effects
// - Period-accurate cultural styling
// - Position-based variety via generator functions
// - Procedurally generated names and descriptions from historical data
// ============================================================================

// Helper: Generate position-based seed for variety
const hash = (x: number, y: number): number => {
    const h = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123);
    return h - Math.floor(h);
};

// Secondary hash for independent variation
const hash2 = (x: number, y: number): number => {
    const h = Math.abs(Math.sin(x * 43.2331 + y * 12.9898) * 78233.1234567);
    return h - Math.floor(h);
};

// ============================================================================
// STATUE METADATA - Procedural naming and description data
// ============================================================================

export interface StatueMetadata {
    name: string;
    artist?: string;
    date?: string;
    material: string;
    origin: string;
    description: string;
}

// CLASSICAL EUROPEAN STATUES
const CLASSICAL_STATUES: StatueMetadata[] = [
    // Famous ancient works (replicas common at 1889 fair)
    { name: 'Laocoön and His Sons', artist: 'Agesander, Athenodoros, and Polydorus', date: 'c. 40-30 BC', material: 'Carrara marble replica', origin: 'Vatican collection cast', description: 'The Trojan priest writhes in the serpents\' coils, his agony rendered in exquisite anatomical detail. A masterwork of Hellenistic pathos.' },
    { name: 'Apollo Belvedere', artist: 'Leochares (attrib.)', date: 'c. 350-325 BC', material: 'Pentelic marble replica', origin: 'Vatican collection cast', description: 'The god strides forward with divine nonchalance, having just loosed the arrow that slew Python. The very ideal of masculine beauty.' },
    { name: 'Venus de Milo', artist: 'Alexandros of Antioch', date: 'c. 130-100 BC', material: 'Parian marble replica', origin: 'Louvre collection cast', description: 'The armless goddess emerges from drapery that pools about her hips. Her missing limbs only heighten the mystery of her pose.' },
    { name: 'Discobolus', artist: 'Myron', date: 'c. 460-450 BC', material: 'Bronze replica', origin: 'Roman copy after Greek original', description: 'The athlete frozen at the apex of his throw, muscles coiled with potential energy. The embodiment of classical athletic ideals.' },
    { name: 'Dying Gaul', artist: 'Epigonus (attrib.)', date: 'c. 230-220 BC', material: 'Marble replica', origin: 'Capitoline Museums cast', description: 'The wounded barbarian sinks upon his shield, nobility in defeat. Even Rome honored the courage of her enemies.' },
    { name: 'Winged Victory of Samothrace', artist: 'Unknown', date: 'c. 190 BC', material: 'Parian marble replica', origin: 'Louvre collection cast', description: 'Nike alights upon the prow, wings spread against the sea wind. Though headless, she proclaims triumph eternal.' },
    { name: 'Farnese Hercules', artist: 'Glycon of Athens', date: 'c. 216 AD', material: 'Marble replica', origin: 'Naples Museum cast', description: 'The exhausted hero leans upon his club, the apples of the Hesperides hidden behind his back. Even demigods grow weary.' },
    { name: 'Doryphoros', artist: 'Polykleitos', date: 'c. 440 BC', material: 'Marble replica', origin: 'Naples Museum cast', description: 'The Spear-Bearer exemplifies the canon of perfect proportions. Every museum student has measured these limbs.' },
    // Renaissance masters
    { name: 'David', artist: 'Michelangelo Buonarroti', date: '1501-1504', material: 'Carrara marble replica', origin: 'Florentine Academy cast', description: 'The shepherd boy contemplates Goliath with terrible calm. In his tensed right hand, the stone that will fell a giant.' },
    { name: 'Pietà', artist: 'Michelangelo Buonarroti', date: '1498-1499', material: 'Marble replica', origin: 'St. Peter\'s Basilica cast', description: 'The Virgin cradles her dead son, grief sublimated into marble serenity. She appears younger than he who lies across her lap.' },
    { name: 'Perseus with the Head of Medusa', artist: 'Benvenuto Cellini', date: '1545-1554', material: 'Bronze replica', origin: 'Loggia dei Lanzi cast', description: 'The hero holds aloft his gorgon trophy, blood still dripping from the severed neck. A triumph of Renaissance bronze-casting.' },
    { name: 'Rape of the Sabine Women', artist: 'Giambologna', date: '1574-1582', material: 'Marble replica', origin: 'Loggia dei Lanzi cast', description: 'Three figures spiral upward in a single serpentine composition. The eye travels ceaselessly around the marble helix.' },
    // Neoclassical and 19th century
    { name: 'Cupid and Psyche', artist: 'Antonio Canova', date: '1787-1793', material: 'Carrara marble replica', origin: 'Louvre collection cast', description: 'The god of love revives his mortal beloved with a kiss. Their lips almost touch—eternally almost.' },
    { name: 'The Three Graces', artist: 'Antonio Canova', date: '1814-1817', material: 'Marble replica', origin: 'Hermitage cast', description: 'Aglaea, Euphrosyne, and Thalia embrace in endless dance, their flesh so delicate one fears to breathe upon it.' },
    { name: 'The Thinker', artist: 'Auguste Rodin', date: '1880', material: 'Bronze', origin: 'Original from the artist', description: 'Dante broods at the gates of Hell, chin upon fist. Or is it Everyman, confronting the abyss of consciousness?' },
    { name: 'The Kiss', artist: 'Auguste Rodin', date: '1882', material: 'Marble', origin: 'Original from the artist', description: 'Paolo and Francesca, damned for their love, share the kiss that sealed their fate. The book lies forgotten at their feet.' },
    { name: 'The Age of Bronze', artist: 'Auguste Rodin', date: '1875-1876', material: 'Bronze', origin: 'Original from the artist', description: 'A young man awakens to consciousness, arm raised as if shaking off the torpor of prehistory. Humanity stirs.' },
    { name: 'Gloria Victis', artist: 'Antonin Mercié', date: '1874', material: 'Bronze', origin: 'French state commission', description: 'Fame bears aloft a dying warrior, sword still clutched. A memorial to those fallen in the Franco-Prussian War.' },
    // Allegorical figures common at world fairs
    { name: 'La France Éclairant le Monde', artist: 'Frédéric Auguste Bartholdi', date: '1889', material: 'Bronze', origin: 'Exposition commission', description: 'Liberty lifts her torch, smaller sister to the colossus gifted to America. France illuminates the darkness of tyranny.' },
    { name: 'Le Génie des Arts', artist: 'Aimé Millet', date: '1879', material: 'Gilded bronze', origin: 'Opéra Garnier', description: 'The spirit of Art spreads gilded wings atop the new opera house. Apollo himself might envy such radiance.' },
    { name: 'Agriculture and Industry', artist: 'Jean-Baptiste Carpeaux', date: '1866', material: 'Bronze group', origin: 'Tuileries Gardens', description: 'Robust allegories of France\'s twin sources of wealth clasp hands in eternal partnership.' },
];

// ASIAN STATUES - Buddhist, Hindu, and East Asian traditions
const ASIAN_STATUES: StatueMetadata[] = [
    // Japanese
    { name: 'Amida Nyorai', artist: 'Jōchō school', date: 'Heian period style', material: 'Gilded bronze', origin: 'Byōdō-in Temple replica', description: 'The Buddha of Infinite Light sits in perfect meditation, promising rebirth in the Western Paradise to all who call his name.' },
    { name: 'Kannon Bosatsu', artist: 'Unknown', date: 'Kamakura period style', material: 'Gilded wood with lacquer', origin: 'Temple collection', description: 'The Bodhisattva of Compassion gazes down with infinite mercy, ready to descend and rescue suffering souls.' },
    { name: 'Eleven-Headed Kannon', artist: 'Nara workshop', date: 'Nara period style', material: 'Gilded bronze', origin: 'Hōryū-ji replica', description: 'Eleven faces crown the Bodhisattva\'s head—wrathful, serene, and laughing—to perceive suffering in all directions.' },
    { name: 'Shaka Nyorai', artist: 'Unknown', date: 'Asuka period style', material: 'Gilded bronze', origin: 'Hōryū-ji replica', description: 'The historical Buddha raises one hand in blessing, the gesture of fearlessness. His other hand grants wishes.' },
    { name: 'Miroku Bosatsu', artist: 'Korean influence', date: 'Asuka period style', material: 'Gilded bronze', origin: 'Kōryū-ji replica', description: 'The Future Buddha sits in pensive pose, one leg crossed, contemplating his eventual descent to save humanity.' },
    // Chinese
    { name: 'Guanyin', artist: 'Song dynasty style', date: 'c. 12th century style', material: 'Painted wood', origin: 'Temple collection', description: 'The Bodhisattva reclines in the pose of royal ease, one knee raised, serenity personified in flowing robes.' },
    { name: 'Laughing Buddha (Budai)', artist: 'Ming workshop', date: 'Ming dynasty style', material: 'Porcelain', origin: 'Imperial collection', description: 'The rotund monk laughs eternally, his bag of treasures beside him. In his joy, enlightenment becomes approachable.' },
    { name: 'Weituo', artist: 'Ming workshop', date: 'Ming dynasty style', material: 'Painted wood', origin: 'Temple guardian', description: 'The fierce protector of Buddhist monasteries stands ready, his vajra staff poised to smite demons.' },
    { name: 'Lohan (Arhat)', artist: 'Tang style', date: 'Tang dynasty style', material: 'Glazed ceramic', origin: 'Cave temple replica', description: 'An enlightened disciple of Buddha, gaunt from austerities, his foreign features marking him as one of the original sixteen.' },
    // Southeast Asian
    { name: 'Walking Buddha', artist: 'Sukhothai school', date: '14th century style', material: 'Bronze', origin: 'Siamese royal collection', description: 'The Buddha strides forward with unearthly grace, fingers extended in the gesture of teaching. A uniquely Thai innovation.' },
    { name: 'Crowned Buddha', artist: 'Khmer style', date: 'Angkor period style', material: 'Bronze with gold', origin: 'Cambodian royal gift', description: 'The Buddha wears a royal crown and jewels—the king as enlightened one, or enlightenment as kingship.' },
    { name: 'Mucalinda Buddha', artist: 'Khmer style', date: 'Bayon period style', material: 'Sandstone', origin: 'Angkor replica', description: 'The seven-headed naga Mucalinda shelters the meditating Buddha from a storm. Even serpents serve awakening.' },
    // Tibetan/Himalayan
    { name: 'Green Tara', artist: 'Tibetan workshop', date: '18th century style', material: 'Gilded bronze', origin: 'Monastery collection', description: 'The female Bodhisattva extends one foot, ready to spring into action. She rescues the faithful from all eight great fears.' },
    { name: 'Vajrapani', artist: 'Nepalese-Tibetan style', date: '17th century style', material: 'Bronze with turquoise', origin: 'Temple collection', description: 'The wrathful protector brandishes his thunderbolt, flames streaming from his body. Demons flee before his terrible gaze.' },
    // Indian
    { name: 'Shiva Nataraja', artist: 'Chola bronze', date: '11th century style', material: 'Bronze', origin: 'Tamil Nadu replica', description: 'The Lord of Dance whirls within a ring of fire, one foot crushing the demon of ignorance. Creation and destruction in endless cycle.' },
    { name: 'Ganesha', artist: 'Pallava style', date: '8th century style', material: 'Granite', origin: 'South Indian temple', description: 'The elephant-headed god of beginnings holds his broken tusk and a bowl of sweets. Remover of obstacles, patron of learning.' },
    { name: 'Buddha at Sarnath', artist: 'Gupta workshop', date: '5th century style', material: 'Sandstone', origin: 'Archaeological Survey cast', description: 'The Buddha preaches his first sermon, hands forming the wheel-turning gesture. At Sarnath, the Dharma wheel began to turn.' },
];

// EGYPTIAN STATUES
const EGYPTIAN_STATUES: StatueMetadata[] = [
    { name: 'Ramesses II Colossus', artist: 'Royal workshop', date: 'Dynasty XIX', material: 'Red granite replica', origin: 'Memphis excavation cast', description: 'The great pharaoh sits in eternal majesty, hands flat upon his knees. Builder of Abu Simbel, scourge of the Hittites.' },
    { name: 'Khafre Enthroned', artist: 'Royal workshop', date: 'Dynasty IV', material: 'Diorite replica', origin: 'Cairo Museum cast', description: 'The pyramid builder sits protected by Horus, the falcon\'s wings embracing his nemes. Divine kingship made stone.' },
    { name: 'Bust of Nefertiti', artist: 'Thutmose workshop', date: 'Dynasty XVIII', material: 'Painted limestone replica', origin: 'Berlin Museum cast', description: 'The queen\'s beauty transcends millennia, her slender neck supporting the tall blue crown. She who is beautiful has come.' },
    { name: 'Seated Scribe', artist: 'Unknown', date: 'Dynasty V', material: 'Painted limestone replica', origin: 'Louvre cast', description: 'The bureaucrat sits cross-legged, papyrus unrolled across his lap. His inlaid eyes still seem to await dictation.' },
    { name: 'Osiris', artist: 'Temple workshop', date: 'Ptolemaic period', material: 'Bronze with gold', origin: 'Temple collection', description: 'The lord of the dead stands wrapped in mummy bandages, crook and flail crossed upon his chest. Judge of souls.' },
    { name: 'Isis Nursing Horus', artist: 'Late Period workshop', date: 'Dynasty XXVI', material: 'Bronze', origin: 'Temple collection', description: 'The goddess suckles the divine child upon her lap. This image would echo through millennia in another mother and son.' },
    { name: 'Anubis', artist: 'Temple workshop', date: 'New Kingdom style', material: 'Painted wood', origin: 'Funerary collection', description: 'The jackal-headed god reclines in his shrine, guardian of the necropolis. He weighs hearts against the feather of Maat.' },
    { name: 'The Sphinx', artist: 'Royal workshop', date: 'Dynasty IV', material: 'Limestone replica', origin: 'Giza miniature', description: 'The lion-bodied, human-headed guardian crouches eternally before the pyramids. What riddle does he pose to those who approach?' },
    { name: 'Thutmose III', artist: 'Royal workshop', date: 'Dynasty XVIII', material: 'Greywacke replica', origin: 'Cairo Museum cast', description: 'The Napoleon of ancient Egypt strides forward, the conqueror of Syria and Nubia. His military genius forged an empire.' },
    { name: 'Hatshepsut as Osiris', artist: 'Royal workshop', date: 'Dynasty XVIII', material: 'Painted limestone replica', origin: 'Deir el-Bahri cast', description: 'The female pharaoh wears the false beard of kingship, mummiform as Osiris. She who became king against all precedent.' },
    { name: 'Akhenaten', artist: 'Amarna workshop', date: 'Dynasty XVIII', material: 'Sandstone replica', origin: 'Cairo Museum cast', description: 'The heretic king\'s distorted features proclaim a new aesthetic. His god was the sun disk itself, all other gods abolished.' },
    { name: 'Tutankhamun\'s Mask', artist: 'Royal workshop', date: 'Dynasty XVIII', material: 'Gold-plated replica', origin: 'Recent excavation display', description: 'The boy king\'s death mask gleams with eternal youth. His tomb, only recently discovered, holds treasures beyond counting.' },
];

// AFRICAN STATUES
const AFRICAN_STATUES: StatueMetadata[] = [
    // West African
    { name: 'Nkisi Nkondi', artist: 'Kongo master', date: '19th century', material: 'Wood, iron, mixed media', origin: 'Belgian Congo collection', description: 'The power figure bristles with iron blades, each nail a sealed oath or activated curse. It stares with mirror eyes into the spirit world.' },
    { name: 'Bieri Reliquary Guardian', artist: 'Fang master', date: '19th century', material: 'Polished wood', origin: 'Gabon collection', description: 'The ancestor figure guards the bones of the lineage, its meditative calm belying fierce protective power.' },
    { name: 'Dogon Primordial Couple', artist: 'Dogon master', date: 'Traditional', material: 'Wood with patina', origin: 'Mali collection', description: 'The first man and woman sit in hieratic stillness, their elongated forms encoding cosmological secrets.' },
    { name: 'Benin Bronze Head', artist: 'Benin court guild', date: '16th century style', material: 'Cast bronze', origin: 'Benin royal collection', description: 'The commemorative head honors a queen mother, her coral-beaded crown proclaiming royal status. A masterwork of lost-wax casting.' },
    { name: 'Senufo Rhythm Pounder', artist: 'Senufo master', date: '19th century', material: 'Wood', origin: 'Ivory Coast collection', description: 'The female figure once kept time at funerary ceremonies, pounded against the earth to summon ancestors.' },
    { name: 'Baule Spirit Spouse', artist: 'Baule master', date: '19th century', material: 'Wood with beads', origin: 'Ivory Coast collection', description: 'The idealized figure represents a spirit husband or wife, carved to placate a jealous otherworld spouse.' },
    { name: 'Dan Passport Mask', artist: 'Dan master', date: '19th century', material: 'Wood', origin: 'Liberian collection', description: 'The refined feminine face served as a miniature identification mask, proof of initiation and community standing.' },
    { name: 'Yoruba Twin Figure (Ibeji)', artist: 'Yoruba carver', date: '19th century', material: 'Wood with indigo', origin: 'Nigerian collection', description: 'The memorial figure honors a deceased twin, kept and cared for to maintain the spiritual balance between living and dead siblings.' },
    // Central African
    { name: 'Luba Memory Board', artist: 'Luba master', date: '19th century', material: 'Wood with beads', origin: 'Congo collection', description: 'The female caryatid supports a board once used by court historians. She embodies the principle that women hold up the kingdom.' },
    { name: 'Kuba King Figure', artist: 'Kuba royal workshop', date: '19th century', material: 'Wood', origin: 'Kasai region', description: 'The portrait figure represents a past king, identified by the object before him. Each ruler had his signature emblem.' },
    { name: 'Chokwe Chief\'s Chair', artist: 'Chokwe master', date: '19th century', material: 'Wood and leather', origin: 'Angolan collection', description: 'The throne\'s carved figures narrate royal history, each scene a chapter in the dynasty\'s founding myths.' },
    // East African
    { name: 'Ethiopian Processional Cross', artist: 'Lalibela workshop', date: '18th century style', material: 'Brass', origin: 'Coptic Church collection', description: 'The intricate lattice cross carries its own geometry of faith, each pattern encoding theological mysteries.' },
    { name: 'Makonde Body Mask', artist: 'Makonde master', date: '19th century', material: 'Wood with wax', origin: 'Mozambique collection', description: 'The helmet mask transforms the wearer into a female ancestor during initiation ceremonies.' },
];

// MESOAMERICAN STATUES
const MESOAMERICAN_STATUES: StatueMetadata[] = [
    // Aztec
    { name: 'Coatlicue', artist: 'Aztec imperial workshop', date: 'c. 1500', material: 'Basalt', origin: 'Mexican National Museum cast', description: 'The earth mother wears a skirt of serpents and a necklace of human hearts. She who gives life demands life in return.' },
    { name: 'Xochipilli', artist: 'Aztec workshop', date: 'c. 1450', material: 'Volcanic stone', origin: 'Mexican collection', description: 'The Prince of Flowers sits in ecstatic trance, his body covered with sacred blossoms. Patron of art, games, and hallucinogenic plants.' },
    { name: 'Eagle Warrior', artist: 'Aztec imperial workshop', date: 'c. 1500', material: 'Ceramic', origin: 'Templo Mayor excavation', description: 'The elite soldier emerges from an eagle\'s beak, ready for the flower wars that fed the sun with captive hearts.' },
    { name: 'Aztec Calendar Stone', artist: 'Aztec imperial workshop', date: '1479', material: 'Basalt replica', origin: 'Mexican National Museum cast', description: 'The sun stone encodes cosmic history in concentric rings. Four ages have ended in cataclysm; we live in the fifth and final sun.' },
    { name: 'Coyolxauhqui', artist: 'Aztec workshop', date: 'c. 1500', material: 'Stone relief', origin: 'Templo Mayor cast', description: 'The moon goddess lies dismembered at the pyramid\'s base, slain by her brother the sun. Each dawn reenacts her defeat.' },
    // Maya
    { name: 'Pakal\'s Sarcophagus Lid', artist: 'Palenque royal workshop', date: '683 AD', material: 'Limestone cast', origin: 'Chiapas collection', description: 'The king descends into the maw of the earth, to be reborn as the maize god. His jade mask awaited him in the tomb.' },
    { name: 'Yaxchilan Lintel', artist: 'Maya royal workshop', date: '8th century', material: 'Limestone relief', origin: 'British Museum cast', description: 'Lady Xoc draws a thorn-studded rope through her tongue, summoning an ancestor from the blood-smoke. Vision serpent rises.' },
    { name: 'Chac Mool', artist: 'Toltec-Maya workshop', date: 'c. 1000', material: 'Stone', origin: 'Chichen Itza replica', description: 'The reclining figure holds a dish upon his belly—perhaps for offerings, perhaps for hearts. His gaze turns sideways, toward what?' },
    { name: 'Copan Hieroglyphic Stairway', artist: 'Copan royal workshop', date: '8th century', material: 'Stone fragment', origin: 'Honduran collection', description: 'Each step once recorded dynastic history in carved glyphs. The longest Maya text slowly surrenders its secrets to scholars.' },
    // Olmec
    { name: 'Colossal Head', artist: 'Olmec workshop', date: 'c. 900 BC', material: 'Basalt replica', origin: 'La Venta cast', description: 'The massive helmeted head may represent a ruler or ballplayer. The Olmec carved these portraits from boulders dragged across impossible distances.' },
    { name: 'Were-Jaguar Baby', artist: 'Olmec workshop', date: 'c. 900 BC', material: 'Jade', origin: 'Mexican collection', description: 'The infant shows the snarling mouth of a jaguar, human and feline merged. Rain and fertility deities perhaps took this form.' },
    // Toltec/Other
    { name: 'Atlantean Column', artist: 'Toltec workshop', date: 'c. 1000', material: 'Basalt', origin: 'Tula replica', description: 'The warrior columns once supported Quetzalcoatl\'s temple roof. Each holds an atlatl, ready for wars that ended centuries ago.' },
    { name: 'Tlaloc', artist: 'Central Mexican workshop', date: 'Classic period style', material: 'Stone', origin: 'Teotihuacan collection', description: 'The rain god wears his goggle eyes and fanged mouth. He sends the storms that bring life—or the floods that end it.' },
];

// ALLEGORICAL AND MONUMENTAL (European 19th century)
const ALLEGORICAL_STATUES: StatueMetadata[] = [
    { name: 'La République', artist: 'Jean-François Soitoux', date: '1848', material: 'Bronze', origin: 'French state commission', description: 'Liberty wears her Phrygian cap, the symbol of freed slaves. The republic she embodies has been proclaimed, overturned, and proclaimed again.' },
    { name: 'Marianne', artist: 'Various interpretations', date: '19th century', material: 'Bronze', origin: 'Civic monument', description: 'The feminine embodiment of France gazes toward the future. In every mairie she stands watch over the democratic ideal.' },
    { name: 'Triumph of the Republic', artist: 'Jules Dalou', date: '1889', material: 'Bronze', origin: 'Place de la Nation commission', description: 'The Republic rides a lion-drawn chariot, accompanied by allegories of Liberty, Labor, Justice, and Peace. A sermon in bronze.' },
    { name: 'The Four Continents', artist: 'Jean-Baptiste Carpeaux', date: '1872', material: 'Bronze', origin: 'Observatory fountain', description: 'Four women—Europe, Asia, Africa, Americas—support the celestial sphere. The world united in sculptural harmony.' },
    { name: 'Industry and Commerce', artist: 'Exposition commission', date: '1889', material: 'Gilded bronze', origin: 'Exhibition grounds', description: 'Heroic figures celebrate the twin engines of progress. Hammer meets scales in allegorical handshake.' },
    { name: 'Science Revealing Nature', artist: 'Louis-Ernest Barrias', date: '1899', material: 'Marble', origin: 'French state collection', description: 'A veiled woman yields to the probing gaze of inquiry. Nature surrenders her mysteries to the scientific method.' },
    { name: 'Electricity', artist: 'Exposition commission', date: '1889', material: 'Bronze', origin: 'Palace of Electricity', description: 'A dynamic figure grasps lightning bolts, the new power harnessed for human service. Edison would approve.' },
    { name: 'Steam Power', artist: 'Exposition commission', date: '1889', material: 'Bronze', origin: 'Gallery of Machines', description: 'A muscular figure dominates the forces of industry, wheels and gears conquered by human ingenuity.' },
];

// FOUNTAIN STATUES - Water features and decorative sculptures
const FOUNTAIN_STATUES: StatueMetadata[] = [
    { name: 'Triton', artist: 'After Bernini', date: '17th century style', material: 'Bronze', origin: 'Roman fountain tradition', description: 'The sea-god blows his conch horn, water cascading from the shell. His fish tail coils below the waves he commands.' },
    { name: 'Neptune and His Chariot', artist: 'Jean-Baptiste Tuby', date: '1687 style', material: 'Gilded lead', origin: 'Versailles tradition', description: 'The god of the seas rises from his chariot, trident raised, sea-horses rearing in frozen spray.' },
    { name: 'River God', artist: 'Classical style', date: 'Hellenistic design', material: 'Bronze', origin: 'Roman fountain tradition', description: 'A reclining bearded figure represents the Seine, water pouring from his tilted urn. Father of rivers.' },
    { name: 'Naiad', artist: 'French Academy', date: '19th century', material: 'Bronze', origin: 'Public fountain commission', description: 'A water nymph reclines at the basin edge, fingers trailing in the pool. She has dwelt in springs since before memory.' },
    { name: 'Nereid on Dolphin', artist: 'Classical style', date: 'Hellenistic design', material: 'Bronze', origin: 'Mediterranean tradition', description: 'A sea-nymph rides her dolphin mount through eternal spray, drapery billowing in an undersea wind.' },
    { name: 'Four Rivers Fountain', artist: 'After Bernini', date: '1651 style', material: 'Travertine replica', origin: 'Piazza Navona cast', description: 'The Ganges, Nile, Danube, and Plate sit around their obelisk, each personifying a continent known to Rome.' },
    { name: 'Latona and Her Children', artist: 'After Marsy', date: '1668 style', material: 'Gilded lead', origin: 'Versailles tradition', description: 'The goddess protects Apollo and Diana while Lycian peasants transform to frogs around her—punishment for their mockery.' },
    { name: 'Fontaine des Innocents', artist: 'After Jean Goujon', date: '1547 style', material: 'Marble replica', origin: 'Paris landmark', description: 'Graceful nymphs pour water from amphorae, the finest work of French Renaissance sculpture.' },
    { name: 'Medici Fountain Acis', artist: 'After Auguste Ottin', date: '1866 style', material: 'Bronze', origin: 'Luxembourg Gardens', description: 'Acis and Galatea embrace in their grotto while the jealous Cyclops looms above with his boulder.' },
    { name: 'Oceanus', artist: 'Giambologna style', date: '16th century design', material: 'Bronze', origin: 'Boboli Gardens tradition', description: 'The primordial sea-titan rises from his basin, lord of all waters before Zeus divided the world.' },
];

// EQUESTRIAN STATUES - Heroic mounted figures
const EQUESTRIAN_STATUES: StatueMetadata[] = [
    { name: 'Marcus Aurelius', artist: 'Roman Imperial', date: '175 AD style', material: 'Gilded bronze replica', origin: 'Capitoline cast', description: 'The philosopher-emperor raises his hand in clemency, the only ancient equestrian bronze to survive the melting pots.' },
    { name: 'Charlemagne', artist: 'Louis Rochet', date: '1878', material: 'Bronze', origin: 'Parvis Notre-Dame', description: 'The first Holy Roman Emperor rides before the cathedral, flanked by his paladins Roland and Oliver.' },
    { name: 'Henri IV', artist: 'After Giambologna', date: '1614 style', material: 'Bronze', origin: 'Pont Neuf tradition', description: 'The Vert-Galant surveys his city from horseback, the beloved king who wished every peasant a chicken for Sunday.' },
    { name: 'Louis XIV', artist: 'After Girardon', date: '1699 style', material: 'Bronze', origin: 'Place Vendôme tradition', description: 'The Sun King rides in Roman costume, absolute monarch of all he surveys. Versailles radiates from his will.' },
    { name: 'Joan of Arc', artist: 'Emmanuel Frémiet', date: '1889', material: 'Gilded bronze', origin: 'Place des Pyramides', description: 'The Maid of Orleans sits her warhorse in gilded splendor, banner raised. France remembers her savior.' },
    { name: 'Napoleon I', artist: 'Antoine-Louis Barye', date: '1865', material: 'Bronze', origin: 'French state collection', description: 'The Emperor rides in his famous grey coat, the conqueror of Europe who remade the world.' },
    { name: 'Frederick the Great', artist: 'Christian Daniel Rauch', date: '1851 style', material: 'Bronze replica', origin: 'Prussian royal collection', description: 'Old Fritz surveys his domains, the enlightened despot who made Prussia a great power.' },
    { name: 'Vercingetorix', artist: 'Aimé Millet', date: '1865', material: 'Bronze', origin: 'Alise-Sainte-Reine', description: 'The Gallic chieftain throws down his arms before Caesar. France honors even her ancient defeats.' },
    { name: 'El Cid', artist: 'Spanish school', date: '19th century', material: 'Bronze replica', origin: 'Burgos tradition', description: 'The Castilian hero rides to battle against the Moors, his sword Tizona gleaming.' },
    { name: 'Colleoni', artist: 'After Verrocchio', date: '1488 style', material: 'Bronze replica', origin: 'Venice cast', description: 'The condottiere Colleoni scowls from his warhorse with fierce determination, a masterwork of Renaissance sculpture.' },
];

// PORCELAIN AND SMALL FIGURINES - Decorative arts
const PORCELAIN_FIGURINES: StatueMetadata[] = [
    { name: 'Meissen Shepherdess', artist: 'Johann Joachim Kändler', date: '1740 style', material: 'Hard-paste porcelain', origin: 'Meissen manufactory', description: 'A pastoral maiden tends her sheep in delicate Rococo reverie, flowers in her apron and ribbons in her hair.' },
    { name: 'Sèvres Biscuit Venus', artist: 'Falconet', date: '1757 style', material: 'Unglazed biscuit porcelain', origin: 'Sèvres Royal Manufactory', description: 'The goddess emerges from her bath in matte white porcelain, the specialty of Sèvres since Pompadour.' },
    { name: 'Chinese Export Figure', artist: 'Jingdezhen workshop', date: 'Qing Dynasty', material: 'Famille rose porcelain', origin: 'Canton export', description: 'A court lady in flowing robes demonstrates the delicacy of Chinese porcelain painting for European collectors.' },
    { name: 'Commedia Harlequin', artist: 'Franz Anton Bustelli', date: '1760 style', material: 'Nymphenburg porcelain', origin: 'Bavarian manufactory', description: 'The eternal trickster strikes a theatrical pose, his diamond-patterned costume rendered in vibrant overglaze.' },
    { name: 'Japanese Geisha', artist: 'Arita workshop', date: 'Meiji period', material: 'Imari porcelain', origin: 'Japanese Imperial gift', description: 'A maiko in elaborate kimono poses with fan and parasol, the essence of floating-world elegance.' },
    { name: 'Capodimonte Putti', artist: 'Italian workshop', date: '18th century style', material: 'Soft-paste porcelain', origin: 'Naples tradition', description: 'Chubby cherubs frolic among clouds and flowers, the Rococo spirit made ceramic flesh.' },
    { name: 'Copenhagen Mermaid', artist: 'Royal Copenhagen', date: '1880s', material: 'Underglaze porcelain', origin: 'Danish Royal collection', description: 'Hans Christian Andersen little mermaid gazes wistfully shoreward, longing for her lost love.' },
    { name: 'Worcester Chinoiserie', artist: 'English workshop', date: '1770 style', material: 'Soft-paste porcelain', origin: 'Worcester manufactory', description: 'A fanciful Mandarin figure represents English dreams of the mysterious Orient, more fantasy than fact.' },
    { name: 'Vienna Empress', artist: 'Vienna Porcelain', date: '1780 style', material: 'Hard-paste porcelain', origin: 'Imperial manufactory', description: 'Maria Theresa in miniature surveys her domains, the Habsburg empress who mothered an empire.' },
    { name: 'Blanc de Chine Guanyin', artist: 'Dehua workshop', date: 'Qing Dynasty', material: 'Dehua porcelain', origin: 'Fujian Province', description: 'The Bodhisattva of Mercy sits in pure white porcelain, the luminous specialty of Dehua kilns.' },
    { name: 'Dresden Lace Figure', artist: 'Dresden workshop', date: '19th century', material: 'Porcelain with lace', origin: 'Saxon tradition', description: 'A court lady in an impossibly delicate lace dress—real fabric dipped in porcelain slip and fired.' },
    { name: 'Staffordshire Spaniel', artist: 'English pottery', date: 'Victorian', material: 'Earthenware', origin: 'Staffordshire Potteries', description: 'A pair of King Charles spaniels guard the parlor mantel, the quintessential Victorian ornament.' },
];

// BRONZE STATUES - Heroic and decorative bronzes
const BRONZE_STATUES: StatueMetadata[] = [
    { name: 'Le Penseur', artist: 'Auguste Rodin', date: '1880', material: 'Bronze', origin: 'Original from the artist', description: 'The Thinker broods at the gates of Hell, fist pressed to chin. The icon of contemplation itself.' },
    { name: 'Saint Michel', artist: 'Emmanuel Frémiet', date: '1879', material: 'Gilded bronze', origin: 'Mont Saint-Michel replica', description: 'The archangel Michael drives his spear into Satan, triumphant on the spire above Normandy.' },
    { name: 'Le Génie de la Liberté', artist: 'Augustin Dumont', date: '1836', material: 'Gilded bronze', origin: 'Bastille Column', description: 'The Spirit of Liberty takes flight from the July Column, torch in hand, chains broken at his feet.' },
    { name: 'Mercury', artist: 'After Giambologna', date: '1580 style', material: 'Bronze', origin: 'Florentine tradition', description: 'The messenger god balances on one toe atop a breath of wind, caduceus raised. Defying gravity in bronze.' },
    { name: 'Perseus Triumphant', artist: 'Antonio Canova', date: '1800 style', material: 'Bronze', origin: 'Vatican collection cast', description: 'The hero holds aloft the Gorgon head, its snaky locks still writhing. Who dares meet its gaze?' },
    { name: 'The Burghers of Calais', artist: 'Auguste Rodin', date: '1889', material: 'Bronze', origin: 'City of Calais commission', description: 'Six men walk to their execution to save their city, ropes around their necks. Rodin captures sacrifice itself.' },
    { name: 'Lion of Belfort', artist: 'Frédéric Auguste Bartholdi', date: '1880', material: 'Hammered copper replica', origin: 'Belfort memorial', description: 'The wounded lion symbolizes the defense of Belfort during the Prussian siege. France remembers.' },
    { name: 'La Danse', artist: 'Jean-Baptiste Carpeaux', date: '1869', material: 'Bronze', origin: 'Opéra Garnier', description: 'The spirit of Dance leads a bacchanalian whirl, figures spiraling in bronze ecstasy. The scandal of its unveiling is forgotten.' },
    { name: 'Ugolin et ses enfants', artist: 'Jean-Baptiste Carpeaux', date: '1862', material: 'Bronze', origin: 'Tuileries Gardens', description: 'Count Ugolino gnaws his fingers in the tower where he and his sons starve. Dante made him immortal.' },
    { name: 'Combat Centaure et Lapithe', artist: 'Antoine-Louis Barye', date: '1850', material: 'Bronze', origin: 'French state collection', description: 'A Lapith wrestles a centaur to the ground, human reason subduing bestial passion. The eternal struggle.' },
];

// Get statue metadata based on type and position
export const getStatueMetadata = (type: string, x: number, y: number): StatueMetadata => {
    const seed = hash(x, y);
    const seed2 = hash2(x, y);

    let statueList: StatueMetadata[];

    switch (type) {
        case 'classical':
        case 'STATUE':
        case 'STATUE_BUST':
            statueList = CLASSICAL_STATUES;
            break;
        case 'asian':
        case 'STATUE_ASIAN_TALL':
        case 'STATUE_ASIAN_SMALL':
            statueList = ASIAN_STATUES;
            break;
        case 'egyptian':
        case 'STATUE_EGYPTIAN_TALL':
        case 'STATUE_EGYPTIAN_BUST':
            statueList = EGYPTIAN_STATUES;
            break;
        case 'african':
        case 'STATUE_AFRICAN_TALL':
        case 'STATUE_AFRICAN_MASK':
            statueList = AFRICAN_STATUES;
            break;
        case 'mesoamerican':
        case 'STATUE_MESOAMERICAN':
            statueList = MESOAMERICAN_STATUES;
            break;
        case 'allegorical':
        case 'STATUE_ALLEGORICAL':
        case 'STATUE_MONUMENTAL':
            statueList = ALLEGORICAL_STATUES;
            break;
        case 'fountain':
        case 'FOUNTAIN_STATUE':
            statueList = FOUNTAIN_STATUES;
            break;
        case 'equestrian':
        case 'EQUESTRIAN_STATUE':
            statueList = EQUESTRIAN_STATUES;
            break;
        case 'porcelain':
        case 'PORCELAIN_FIGURINE':
            statueList = PORCELAIN_FIGURINES;
            break;
        case 'bronze':
        case 'BRONZE_STATUE':
            statueList = BRONZE_STATUES;
            break;
        default:
            statueList = CLASSICAL_STATUES;
    }

    const index = Math.floor(seed * statueList.length);
    return statueList[index];
};

// Generate a full description with name for tooltip display
export const getStatueDescription = (type: string, x: number, y: number): { name: string; description: string } => {
    const metadata = getStatueMetadata(type, x, y);

    let fullName = metadata.name;
    if (metadata.artist) {
        fullName += ` (${metadata.artist})`;
    }

    let description = metadata.description;
    if (metadata.date) {
        description += ` [${metadata.date}]`;
    }
    if (metadata.material) {
        description = `${metadata.material}. ${description}`;
    }

    return { name: fullName, description };
};

// ============================================================================
// GENERATOR FUNCTIONS - Position-based variety for repeated statue types
// ============================================================================

// Classical marble statue generator - multiple variations
export const generateClassicalStatue = (x: number, y: number): JSX.Element => {
    const seed = hash(x, y);
    const variant = Math.floor(seed * 5); // 5 different classical poses
    const gradId = `classical-${x}-${y}`;

    // Marble color variations - Carrara, Pentelic, Luna, etc.
    const marbleColors = [
        { base: '#F5F0E8', mid: '#E8E2D8', shadow: '#D4CCC0', highlight: '#FFFEFA', vein: '#C8C0B4' },
        { base: '#F0EBE3', mid: '#E2DBD0', shadow: '#C8C0B4', highlight: '#FAF8F5', vein: '#B8B0A4' },
        { base: '#EDE8E0', mid: '#DCD5C8', shadow: '#C0B8AC', highlight: '#F8F5F0', vein: '#A8A098' },
        { base: '#F8F4EC', mid: '#EAE4DA', shadow: '#D0C8BC', highlight: '#FFFFFF', vein: '#C0B8AC' },
        { base: '#F2EDE5', mid: '#E0D9CC', shadow: '#C4BCB0', highlight: '#FDFBF8', vein: '#B4ACA0' },
    ];
    const c = marbleColors[variant];

    // Pedestal variations
    const pedestalColors = [
        { dark: '#5C554D', mid: '#6B6159', light: '#7A7068', top: '#8B8178' },
        { dark: '#4A4540', mid: '#5A554E', light: '#6A655C', top: '#7A756A' },
        { dark: '#524A42', mid: '#625A50', light: '#726A5E', top: '#827A6C' },
    ];
    const p = pedestalColors[variant % 3];

    // Different classical poses
    const poses = [
        // Contrapposto standing figure
        () => (
            <g>
                {/* Torso with contrapposto twist */}
                <path d="M8 16 Q7 11 9 6 L15 6 Q17 11 16 16 Z" fill={`url(#${gradId}-marble)`}/>
                <path d="M9 14 Q11 12 9 8" stroke={c.shadow} strokeWidth="0.6" fill="none"/>
                <path d="M15 14 Q13 12 15 8" stroke={c.shadow} strokeWidth="0.6" fill="none"/>
                {/* Toga draping - classical folds */}
                <path d="M8 10 Q10 11 12 10 Q14 11 16 10" stroke={c.vein} strokeWidth="0.5" fill="none"/>
                <path d="M8 13 Q11 14 16 13" stroke={c.vein} strokeWidth="0.4" fill="none"/>
            </g>
        ),
        // Toga-draped orator
        () => (
            <g>
                <path d="M7 16 Q6 10 9 5 L15 5 Q18 10 17 16 Z" fill={`url(#${gradId}-marble)`}/>
                {/* Raised arm for oratory */}
                <path d="M15 6 Q18 4 19 1" stroke={c.base} strokeWidth="2.5" fill="none"/>
                <circle cx="19" cy="0" r="1.2" fill={c.mid}/>
                {/* Complex toga folds */}
                <path d="M7 8 Q9 10 8 12 Q10 11 12 12 Q14 11 16 12" stroke={c.shadow} strokeWidth="0.5" fill="none"/>
                <path d="M9 6 Q12 8 15 6" stroke={c.vein} strokeWidth="0.4" fill="none"/>
            </g>
        ),
        // Venus/female figure
        () => (
            <g>
                <path d="M9 16 Q8 11 10 6 L14 6 Q16 11 15 16 Z" fill={`url(#${gradId}-marble)`}/>
                {/* Graceful S-curve pose */}
                <path d="M10 14 Q11 10 10 7" stroke={c.shadow} strokeWidth="0.5" fill="none"/>
                {/* Draped fabric on lower body */}
                <path d="M8 14 Q12 13 16 14" stroke={c.vein} strokeWidth="0.6" fill="none"/>
                <path d="M9 16 Q12 15 15 16" stroke={c.vein} strokeWidth="0.4" fill="none"/>
            </g>
        ),
        // Seated philosopher
        () => (
            <g>
                <ellipse cx="12" cy="14" rx="5" ry="3" fill={`url(#${gradId}-marble)`}/>
                <path d="M9 14 Q8 9 10 5 L14 5 Q16 9 15 14 Z" fill={c.base}/>
                {/* Bent posture, thoughtful */}
                <path d="M10 8 Q12 10 14 8" stroke={c.shadow} strokeWidth="0.5" fill="none"/>
            </g>
        ),
        // Athletic discus thrower pose
        () => (
            <g>
                <path d="M8 16 Q6 10 10 5 L14 5 Q18 10 16 16 Z" fill={`url(#${gradId}-marble)`}/>
                {/* Dynamic twisted pose */}
                <path d="M16 6 Q20 4 22 2" stroke={c.base} strokeWidth="2" fill="none"/>
                <ellipse cx="22" cy="1" rx="2" ry="0.8" fill={c.shadow}/>
                <path d="M8 12 Q12 10 16 12" stroke={c.shadow} strokeWidth="0.6" fill="none"/>
            </g>
        ),
    ];

    // Head variations for each pose
    const headStyles = [
        // Classical Roman with curled hair
        () => (
            <g>
                <ellipse cx="12" cy="2" rx="3.5" ry="4" fill={`url(#${gradId}-marble)`}/>
                <path d="M8.5 0 Q8 -2 10 -2.5 Q12 -1.5 14 -2.5 Q16 -2 15.5 0" fill={c.shadow}/>
                <path d="M9 -1 Q9 -2 10.5 -2" stroke={c.vein} strokeWidth="0.3" fill="none"/>
                <path d="M13.5 -1 Q14 -2 15 -2" stroke={c.vein} strokeWidth="0.3" fill="none"/>
                {/* Classical features */}
                <ellipse cx="10.5" cy="1.5" rx="0.8" ry="0.4" fill={c.shadow} opacity="0.5"/>
                <ellipse cx="13.5" cy="1.5" rx="0.8" ry="0.4" fill={c.shadow} opacity="0.5"/>
                <path d="M12 1 L12 3.5" stroke={c.shadow} strokeWidth="0.4"/>
                <path d="M11 4 Q12 4.5 13 4" stroke={c.vein} strokeWidth="0.3" fill="none"/>
            </g>
        ),
        // Bearded philosopher
        () => (
            <g>
                <ellipse cx="12" cy="2" rx="3.5" ry="4" fill={`url(#${gradId}-marble)`}/>
                <path d="M9 0 Q8 -1.5 10 -2 Q12 -1 14 -2 Q16 -1.5 15 0" fill={c.shadow}/>
                {/* Beard */}
                <path d="M9 4 Q10 6 12 7 Q14 6 15 4" fill={c.shadow} opacity="0.7"/>
                <path d="M9.5 5 Q12 6.5 14.5 5" stroke={c.vein} strokeWidth="0.3" fill="none"/>
                <ellipse cx="10.5" cy="1.5" rx="0.6" ry="0.3" fill={c.shadow} opacity="0.4"/>
                <ellipse cx="13.5" cy="1.5" rx="0.6" ry="0.3" fill={c.shadow} opacity="0.4"/>
                <path d="M12 1 L12 3" stroke={c.shadow} strokeWidth="0.4"/>
            </g>
        ),
        // Female with elaborate updo
        () => (
            <g>
                <ellipse cx="12" cy="2" rx="3" ry="3.5" fill={`url(#${gradId}-marble)`}/>
                {/* Elaborate hairstyle */}
                <ellipse cx="12" cy="-1" rx="3.5" ry="2.5" fill={c.shadow}/>
                <path d="M9 -2 Q10 -3.5 12 -3.5 Q14 -3.5 15 -2" stroke={c.vein} strokeWidth="0.4" fill="none"/>
                <circle cx="12" cy="-3" r="1" fill={c.vein}/>
                {/* Delicate features */}
                <path d="M10 2 Q10.5 2.2 11 2" stroke={c.shadow} strokeWidth="0.25" fill="none"/>
                <path d="M13 2 Q13.5 2.2 14 2" stroke={c.shadow} strokeWidth="0.25" fill="none"/>
                <path d="M12 1.5 L12 3" stroke={c.shadow} strokeWidth="0.3"/>
                <path d="M11 3.8 Q12 4.2 13 3.8" stroke={c.vein} strokeWidth="0.25" fill="none"/>
            </g>
        ),
    ];

    const PoseComponent = poses[variant];
    const HeadComponent = headStyles[variant % headStyles.length];

    return (
        <g>
            <defs>
                <radialGradient id={`${gradId}-marble`} cx="40%" cy="30%">
                    <stop offset="0%" stopColor={c.highlight}/>
                    <stop offset="40%" stopColor={c.base}/>
                    <stop offset="70%" stopColor={c.mid}/>
                    <stop offset="100%" stopColor={c.shadow}/>
                </radialGradient>
                <linearGradient id={`${gradId}-pedestal`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={p.top}/>
                    <stop offset="30%" stopColor={p.light}/>
                    <stop offset="70%" stopColor={p.mid}/>
                    <stop offset="100%" stopColor={p.dark}/>
                </linearGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="7" ry="2" fill="#000" opacity="0.2"/>

            {/* Ornate pedestal with classical molding */}
            <rect x="4" y="17" width="16" height="7" fill={`url(#${gradId}-pedestal)`}/>
            <rect x="5" y="16" width="14" height="2" fill={p.light}/>
            <path d="M5 18 L19 18" stroke={p.dark} strokeWidth="0.5"/>
            <path d="M4 20 Q12 19 20 20" stroke={p.light} strokeWidth="0.4"/>
            {/* Decorative corner rosettes */}
            <circle cx="6" cy="20" r="0.8" fill={p.light}/>
            <circle cx="18" cy="20" r="0.8" fill={p.light}/>

            {/* Neck */}
            <rect x="10" y="5" width="4" height="3" fill={c.base}/>

            {/* Body based on variant */}
            <PoseComponent/>

            {/* Head based on variant */}
            <HeadComponent/>

            {/* Subtle marble veining overlay */}
            <path d="M9 10 Q11 8 10 5" stroke={c.vein} strokeWidth="0.15" opacity="0.3" fill="none"/>
            <path d="M14 12 Q15 9 14 6" stroke={c.vein} strokeWidth="0.15" opacity="0.3" fill="none"/>
        </g>
    );
};

// Bronze sculpture generator - patinated bronze variations
export const generateBronzeStatue = (x: number, y: number): JSX.Element => {
    const seed = hash(x, y);
    const variant = Math.floor(seed * 4);
    const gradId = `bronze-${x}-${y}`;

    // Bronze patina variations - from dark to verdigris
    const bronzeColors = [
        { dark: '#3D2B1F', base: '#5D4037', mid: '#6D4C41', highlight: '#8D6E63', patina: '#4A6741' },
        { dark: '#2D1F14', base: '#4E3524', mid: '#5D4230', highlight: '#7D5A3C', patina: '#3D5535' },
        { dark: '#45332B', base: '#6B4423', mid: '#7B5433', highlight: '#9B7453', patina: '#557549' },
        { dark: '#352518', base: '#553D28', mid: '#655038', highlight: '#856A48', patina: '#496341' },
    ];
    const c = bronzeColors[variant];

    // Patina intensity varies by position
    const patinaOpacity = 0.15 + (seed * 0.25);

    return (
        <g>
            <defs>
                <radialGradient id={`${gradId}-bronze`} cx="35%" cy="25%">
                    <stop offset="0%" stopColor={c.highlight}/>
                    <stop offset="35%" stopColor={c.mid}/>
                    <stop offset="70%" stopColor={c.base}/>
                    <stop offset="100%" stopColor={c.dark}/>
                </radialGradient>
                <radialGradient id={`${gradId}-patina`} cx="60%" cy="70%">
                    <stop offset="0%" stopColor={c.patina} stopOpacity="0"/>
                    <stop offset="60%" stopColor={c.patina} stopOpacity={patinaOpacity}/>
                    <stop offset="100%" stopColor={c.patina} stopOpacity={patinaOpacity * 1.5}/>
                </radialGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="8" ry="2.5" fill="#000" opacity="0.25"/>

            {/* Stone pedestal */}
            <rect x="2" y="16" width="20" height="8" fill="#4A5568"/>
            <rect x="3" y="15" width="18" height="2" fill="#5A6578"/>
            <rect x="4" y="14" width="16" height="2" fill="#6A7588"/>
            <path d="M3 18 L21 18" stroke="#3A4558" strokeWidth="0.5"/>
            <path d="M4 20 L20 20" stroke="#5A6578" strokeWidth="0.3"/>

            {/* Standing bronze figure */}
            <path d="M8 14 Q6 8 9 2 L15 2 Q18 8 16 14 Z" fill={`url(#${gradId}-bronze)`}/>

            {/* Muscular definition */}
            <path d="M9 10 Q11 8 9 5" stroke={c.dark} strokeWidth="0.5" fill="none"/>
            <path d="M15 10 Q13 8 15 5" stroke={c.dark} strokeWidth="0.5" fill="none"/>
            <path d="M10 7 Q12 8 14 7" stroke={c.dark} strokeWidth="0.4" fill="none"/>

            {/* Arms - heroic pose */}
            <path d="M8 4 Q4 2 3 -2" stroke={c.base} strokeWidth="2.5" fill="none"/>
            <path d="M16 4 Q20 2 21 -2" stroke={c.base} strokeWidth="2.5" fill="none"/>
            <circle cx="3" cy="-3" r="1.5" fill={c.mid}/>
            <circle cx="21" cy="-3" r="1.5" fill={c.mid}/>

            {/* Head */}
            <circle cx="12" cy="-2" r="3.5" fill={`url(#${gradId}-bronze)`}/>
            {/* Heroic hairstyle */}
            <path d="M8.5 -4 Q10 -7 12 -7 Q14 -7 15.5 -4" fill={c.dark}/>
            <path d="M9 -5 Q10 -6 11 -5.5" stroke={c.base} strokeWidth="0.4" fill="none"/>
            <path d="M13 -5.5 Q14 -6 15 -5" stroke={c.base} strokeWidth="0.4" fill="none"/>

            {/* Facial features */}
            <ellipse cx="10.5" cy="-2.5" rx="0.7" ry="0.4" fill={c.dark} opacity="0.6"/>
            <ellipse cx="13.5" cy="-2.5" rx="0.7" ry="0.4" fill={c.dark} opacity="0.6"/>
            <path d="M12 -3 L12 -1" stroke={c.dark} strokeWidth="0.4"/>
            <path d="M10.5 -0.5 Q12 0 13.5 -0.5" stroke={c.dark} strokeWidth="0.35" fill="none"/>

            {/* Verdigris patina overlay */}
            <ellipse cx="12" cy="6" rx="6" ry="10" fill={`url(#${gradId}-patina)`}/>

            {/* Highlight reflections */}
            <path d="M10 3 Q11 2 10 1" stroke={c.highlight} strokeWidth="0.3" opacity="0.4" fill="none"/>
        </g>
    );
};

// Asian Buddha/deity generator - gilded bronze with cultural variations
export const generateAsianStatue = (x: number, y: number): JSX.Element => {
    const seed = hash(x, y);
    const variant = Math.floor(seed * 5); // Buddha, Bodhisattva, Kannon, Shiva, Guardian
    const gradId = `asian-${x}-${y}`;

    // Gilded bronze variations
    const goldColors = [
        { dark: '#8B6914', base: '#C9A227', mid: '#DAA520', light: '#E6C84B', bright: '#FFD700' },
        { dark: '#7A5A10', base: '#B8921F', mid: '#C99518', light: '#D5B53A', bright: '#F0C820' },
        { dark: '#6B4B08', base: '#A88318', mid: '#B98710', light: '#C4A530', bright: '#E0B818' },
        { dark: '#9C7A1C', base: '#D4AA2E', mid: '#E5BB30', light: '#F0D050', bright: '#FFE040' },
        { dark: '#785512', base: '#B08520', mid: '#C09520', light: '#D0B540', bright: '#E8C830' },
    ];
    const c = goldColors[variant];

    // Lotus throne color variations
    const lotusColors = [
        { petal: '#E8B8C8', inner: '#F0C8D8', shadow: '#C89098' },
        { petal: '#B8D8E8', inner: '#C8E8F0', shadow: '#98B8C8' },
        { petal: '#D8E8B8', inner: '#E8F0C8', shadow: '#B8C898' },
    ];
    const lotus = lotusColors[variant % 3];

    const isSeated = variant < 3;

    return (
        <g>
            <defs>
                <radialGradient id={`${gradId}-gold`} cx="40%" cy="25%">
                    <stop offset="0%" stopColor={c.bright}/>
                    <stop offset="30%" stopColor={c.light}/>
                    <stop offset="60%" stopColor={c.mid}/>
                    <stop offset="85%" stopColor={c.base}/>
                    <stop offset="100%" stopColor={c.dark}/>
                </radialGradient>
                <radialGradient id={`${gradId}-halo`} cx="50%" cy="50%">
                    <stop offset="0%" stopColor={c.bright} stopOpacity="0.3"/>
                    <stop offset="70%" stopColor={c.mid} stopOpacity="0.1"/>
                    <stop offset="100%" stopColor={c.dark} stopOpacity="0"/>
                </radialGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="9" ry="2.5" fill="#000" opacity="0.2"/>

            {/* Ornate lotus throne base */}
            <ellipse cx="12" cy="20" rx="10" ry="3.5" fill={c.base}/>
            <ellipse cx="12" cy="19" rx="9" ry="3" fill={c.mid}/>
            {/* Lotus petals - detailed layering */}
            <path d="M2 19 Q4 16 6 18 Q8 15 10 18 Q12 14 14 18 Q16 15 18 18 Q20 16 22 19"
                  fill={lotus.petal} stroke={lotus.shadow} strokeWidth="0.3"/>
            <path d="M4 18 Q6 15 8 17 Q10 14 12 17 Q14 14 16 17 Q18 15 20 18"
                  fill={lotus.inner} stroke={lotus.shadow} strokeWidth="0.2"/>
            {/* Throne rim detail */}
            <ellipse cx="12" cy="17" rx="7" ry="2" fill={c.light} opacity="0.5"/>

            {isSeated ? (
                // Seated meditation pose
                <g>
                    {/* Seated body */}
                    <ellipse cx="12" cy="12" rx="7" ry="5" fill={`url(#${gradId}-gold)`}/>
                    <ellipse cx="12" cy="11" rx="6" ry="4" fill={c.light}/>
                    {/* Crossed legs */}
                    <path d="M5 14 Q12 17 19 14" stroke={c.dark} strokeWidth="0.5" fill="none"/>
                    {/* Robe draping */}
                    <path d="M6 10 Q8 12 12 11 Q16 12 18 10" stroke={c.base} strokeWidth="0.5" fill="none"/>
                    <path d="M7 8 Q12 10 17 8" stroke={c.base} strokeWidth="0.4" fill="none"/>
                    {/* Hands in dhyana mudra */}
                    <ellipse cx="12" cy="13" rx="3.5" ry="1.8" fill={c.mid}/>
                    <ellipse cx="12" cy="13" rx="2.5" ry="1.2" fill={c.light}/>
                </g>
            ) : (
                // Standing graceful pose
                <g>
                    <path d="M9 17 Q8 10 10 4 L14 4 Q16 10 15 17 Z" fill={`url(#${gradId}-gold)`}/>
                    {/* Flowing robes */}
                    <path d="M9 10 Q12 12 15 10" stroke={c.dark} strokeWidth="0.4" fill="none"/>
                    <path d="M10 14 Q12 15 14 14" stroke={c.dark} strokeWidth="0.3" fill="none"/>
                    {/* Graceful arm */}
                    <path d="M14 5 Q16 3 17 1" stroke={c.mid} strokeWidth="1.5" fill="none"/>
                    <circle cx="17" cy="0" r="1" fill={c.light}/>
                </g>
            )}

            {/* Serene face */}
            <circle cx="12" cy="2" r="4" fill={`url(#${gradId}-gold)`}/>
            <circle cx="12" cy="1.5" r="3.5" fill={c.light}/>

            {/* Ushnisha (wisdom protuberance) */}
            <ellipse cx="12" cy="-2.5" rx="2" ry="2.5" fill={c.mid}/>
            <circle cx="12" cy="-4.5" r="1.2" fill={c.base}/>

            {/* Downcast meditative eyes */}
            <path d="M9.5 1.5 Q10.5 2 11.5 1.5" stroke={c.dark} strokeWidth="0.4" fill="none"/>
            <path d="M12.5 1.5 Q13.5 2 14.5 1.5" stroke={c.dark} strokeWidth="0.4" fill="none"/>

            {/* Serene expression */}
            <path d="M12 0.5 L12 3" stroke={c.base} strokeWidth="0.35"/>
            <path d="M10.5 4 Q12 4.8 13.5 4" stroke={c.base} strokeWidth="0.35" fill="none"/>

            {/* Elongated earlobes - sign of enlightenment */}
            <path d="M8 2 Q7 4 8 5.5" stroke={c.mid} strokeWidth="1.2" fill="none"/>
            <path d="M16 2 Q17 4 16 5.5" stroke={c.mid} strokeWidth="1.2" fill="none"/>

            {/* Subtle halo/aureole */}
            <circle cx="12" cy="0" r="8" fill={`url(#${gradId}-halo)`}/>

            {/* Flame-like nimbus (optional based on variant) */}
            {variant === 2 && (
                <path d="M6 -4 Q8 -8 12 -10 Q16 -8 18 -4"
                      stroke={c.bright} strokeWidth="0.5" fill="none" opacity="0.4"/>
            )}
        </g>
    );
};

// Egyptian statue generator - pharaonic monuments
export const generateEgyptianStatue = (x: number, y: number): JSX.Element => {
    const seed = hash(x, y);
    const variant = Math.floor(seed * 4); // Pharaoh, Osiris, Sphinx-style, Isis
    const gradId = `egypt-${x}-${y}`;

    // Stone/gilded variations
    const stoneColors = [
        { dark: '#8B7355', base: '#C4A574', mid: '#D4B584', light: '#E4C594', gold: '#FFD700' },
        { dark: '#7A6245', base: '#B39464', mid: '#C3A474', light: '#D3B484', gold: '#E8C84B' },
        { dark: '#6B5335', base: '#A48454', mid: '#B49464', light: '#C4A474', gold: '#D8B83B' },
        { dark: '#9C8465', base: '#D4B594', mid: '#E4C5A4', light: '#F4D5B4', gold: '#FFE050' },
    ];
    const c = stoneColors[variant];

    // Nemes headdress colors
    const nemesColors = [
        { stripe1: '#1E3A8A', stripe2: '#3B82F6', gold: '#FFD700' },
        { stripe1: '#1E3A6A', stripe2: '#2B72E6', gold: '#E8C040' },
    ];
    const nemes = nemesColors[variant % 2];

    return (
        <g>
            <defs>
                <linearGradient id={`${gradId}-stone`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={c.light}/>
                    <stop offset="50%" stopColor={c.mid}/>
                    <stop offset="100%" stopColor={c.base}/>
                </linearGradient>
                <linearGradient id={`${gradId}-nemes`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={nemes.stripe1}/>
                    <stop offset="25%" stopColor={nemes.stripe1}/>
                    <stop offset="25%" stopColor={nemes.stripe2}/>
                    <stop offset="50%" stopColor={nemes.stripe2}/>
                    <stop offset="50%" stopColor={nemes.stripe1}/>
                    <stop offset="75%" stopColor={nemes.stripe1}/>
                    <stop offset="75%" stopColor={nemes.stripe2}/>
                    <stop offset="100%" stopColor={nemes.stripe2}/>
                </linearGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="7" ry="2" fill="#000" opacity="0.2"/>

            {/* Hieroglyphic base */}
            <rect x="3" y="17" width="18" height="7" fill={c.base}/>
            <rect x="4" y="16" width="16" height="2" fill={c.mid}/>
            {/* Hieroglyphic cartouche detail */}
            <rect x="6" y="18" width="3" height="4" fill={c.dark} opacity="0.3"/>
            <rect x="10" y="18" width="4" height="4" fill={c.dark} opacity="0.3"/>
            <rect x="15" y="18" width="3" height="4" fill={c.dark} opacity="0.3"/>
            {/* Ankh symbols */}
            <path d="M7.5 19 L7.5 21 M6.5 20 L8.5 20" stroke={nemes.gold} strokeWidth="0.4"/>
            <circle cx="7.5" cy="18.5" r="0.8" fill="none" stroke={nemes.gold} strokeWidth="0.3"/>

            {/* Rigid frontal body - Egyptian convention */}
            <rect x="7" y="4" width="10" height="13" fill={`url(#${gradId}-stone)`}/>
            {/* Crossed arms holding crook and flail */}
            <rect x="5" y="6" width="3" height="9" fill={c.mid}/>
            <rect x="16" y="6" width="3" height="9" fill={c.mid}/>
            {/* Crook */}
            <path d="M6.5 6 Q5 4 6 2 Q8 1 8 3" stroke={nemes.gold} strokeWidth="0.8" fill="none"/>
            {/* Flail */}
            <line x1="17.5" y1="6" x2="17.5" y2="3" stroke={nemes.gold} strokeWidth="0.6"/>
            <line x1="16.5" y1="3" x2="18.5" y2="3" stroke={nemes.gold} strokeWidth="0.4"/>
            <line x1="16.5" y1="2" x2="18.5" y2="2" stroke={nemes.gold} strokeWidth="0.4"/>

            {/* Nemes headdress */}
            <path d="M5 -2 L12 -10 L19 -2 L19 4 L5 4 Z" fill={`url(#${gradId}-nemes)`}/>
            {/* Gold stripes on nemes */}
            <line x1="9" y1="-6" x2="9" y2="4" stroke={nemes.gold} strokeWidth="0.4"/>
            <line x1="12" y1="-10" x2="12" y2="4" stroke={nemes.gold} strokeWidth="0.4"/>
            <line x1="15" y1="-6" x2="15" y2="4" stroke={nemes.gold} strokeWidth="0.4"/>

            {/* Face */}
            <rect x="8" y="-2" width="8" height="6" fill={c.mid}/>

            {/* Kohl-lined eyes */}
            <ellipse cx="10" cy="0" rx="1.2" ry="0.6" fill="#1A202C"/>
            <ellipse cx="14" cy="0" rx="1.2" ry="0.6" fill="#1A202C"/>
            <path d="M8.5 0 L11.5 0" stroke="#1A202C" strokeWidth="0.3"/>
            <path d="M12.5 0 L15.5 0" stroke="#1A202C" strokeWidth="0.3"/>

            {/* Uraeus (cobra) on forehead */}
            <path d="M12 -4 Q11 -6 12 -7 Q13 -6 12 -4" fill={nemes.gold}/>
            <circle cx="12" cy="-7.5" r="0.6" fill={nemes.gold}/>

            {/* False beard */}
            <rect x="11" y="3" width="2" height="4" fill={c.dark}/>
            <path d="M11 7 Q12 8 13 7" fill={c.dark}/>
        </g>
    );
};

// African sculptural traditions generator
export const generateAfricanStatue = (x: number, y: number): JSX.Element => {
    const seed = hash(x, y);
    const variant = Math.floor(seed * 5); // Ancestor figure, Power figure, Mask, Reliquary, Fertility
    const gradId = `african-${x}-${y}`;

    // Wood types and finishes
    const woodColors = [
        { dark: '#2A1A0F', base: '#3D2817', mid: '#4E3524', light: '#5D4230', polish: '#6B4F3A' },
        { dark: '#1F150A', base: '#2D1F14', mid: '#3D2F1E', light: '#4D3F28', polish: '#5D4F32' },
        { dark: '#352518', base: '#453528', mid: '#554538', light: '#655548', polish: '#756558' },
        { dark: '#251810', base: '#352820', mid: '#453830', light: '#554840', polish: '#655850' },
        { dark: '#301E12', base: '#402E22', mid: '#503E32', light: '#604E42', polish: '#705E52' },
    ];
    const c = woodColors[variant];

    // Patina from ritual use
    const patinaColors = ['#8B0000', '#CD7F32', '#B87333', '#8B4513', '#A0522D'];
    const patina = patinaColors[variant];

    return (
        <g>
            <defs>
                <linearGradient id={`${gradId}-wood`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={c.dark}/>
                    <stop offset="30%" stopColor={c.base}/>
                    <stop offset="50%" stopColor={c.mid}/>
                    <stop offset="70%" stopColor={c.light}/>
                    <stop offset="100%" stopColor={c.polish}/>
                </linearGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="6" ry="2" fill="#000" opacity="0.2"/>

            {/* Carved circular base with geometric patterns */}
            <ellipse cx="12" cy="20" rx="7" ry="2.5" fill={c.base}/>
            <ellipse cx="12" cy="19" rx="6" ry="2" fill={c.mid}/>
            {/* Carved geometric border */}
            <path d="M6 20 L8 19 L10 20 L12 19 L14 20 L16 19 L18 20" stroke={c.dark} strokeWidth="0.4" fill="none"/>

            {/* Elongated standing figure - stylized proportions */}
            <path d="M9 19 Q8 12 10 4 L14 4 Q16 12 15 19 Z" fill={`url(#${gradId}-wood)`}/>

            {/* Ritual scarification patterns */}
            <path d="M10 8 L14 8" stroke={c.dark} strokeWidth="0.35"/>
            <path d="M10 11 L14 11" stroke={c.dark} strokeWidth="0.35"/>
            <path d="M10 14 L14 14" stroke={c.dark} strokeWidth="0.35"/>
            <path d="M11 6 L11 16" stroke={c.dark} strokeWidth="0.25"/>
            <path d="M13 6 L13 16" stroke={c.dark} strokeWidth="0.25"/>

            {/* Arms at sides */}
            <rect x="6" y="8" width="3" height="8" fill={c.mid}/>
            <rect x="15" y="8" width="3" height="8" fill={c.mid}/>
            {/* Hands holding ritual objects */}
            <ellipse cx="7" cy="16" rx="1.2" ry="1.8" fill={c.light}/>
            <ellipse cx="17" cy="16" rx="1.2" ry="1.8" fill={c.light}/>

            {/* Elongated neck with brass rings */}
            <rect x="10" y="0" width="4" height="4" fill={c.mid}/>
            <path d="M10 1 L14 1" stroke="#CD7F32" strokeWidth="0.5"/>
            <path d="M10 2.5 L14 2.5" stroke="#CD7F32" strokeWidth="0.5"/>

            {/* Stylized head - elongated form */}
            <ellipse cx="12" cy="-4" rx="4" ry="5" fill={`url(#${gradId}-wood)`}/>

            {/* Inlaid cowrie shell or bone eyes */}
            <ellipse cx="10" cy="-5" rx="1.5" ry="0.8" fill="#F5DEB3"/>
            <ellipse cx="14" cy="-5" rx="1.5" ry="0.8" fill="#F5DEB3"/>
            <circle cx="10" cy="-5" r="0.5" fill="#1A0A00"/>
            <circle cx="14" cy="-5" r="0.5" fill="#1A0A00"/>

            {/* Prominent stylized nose */}
            <path d="M12 -6 L12 -2" stroke={c.dark} strokeWidth="0.8"/>
            <ellipse cx="12" cy="-2" rx="1.2" ry="0.6" fill={c.base}/>

            {/* Stylized mouth */}
            <ellipse cx="12" cy="0" rx="2" ry="0.8" fill={patina} opacity="0.5"/>

            {/* Elaborate coiffure/headdress */}
            <path d="M8 -8 Q10 -12 12 -12 Q14 -12 16 -8" fill={c.dark}/>
            <ellipse cx="12" cy="-10" rx="2.5" ry="2" fill={c.base}/>
            {/* Decorative crest */}
            <path d="M10 -11 L12 -15 L14 -11" fill={c.mid}/>
            <circle cx="12" cy="-13" r="1" fill="#CD7F32"/>

            {/* Patina from ritual libations */}
            <ellipse cx="12" cy="10" rx="3" ry="6" fill={patina} opacity="0.15"/>
        </g>
    );
};

// Mesoamerican sculpture generator
export const generateMesoamericanStatue = (x: number, y: number): JSX.Element => {
    const seed = hash(x, y);
    const variant = Math.floor(seed * 4); // Aztec, Maya, Olmec, Toltec
    const gradId = `meso-${x}-${y}`;

    // Stone colors by culture
    const stoneColors = [
        { dark: '#4A5568', base: '#6B7280', mid: '#78716C', light: '#9CA3AF', jade: '#16A34A' }, // Basalt
        { dark: '#5C534A', base: '#7C736A', mid: '#8C837A', light: '#ACA39A', jade: '#22C55E' }, // Limestone
        { dark: '#3A4540', base: '#5A6560', mid: '#6A7570', light: '#8A9590', jade: '#4ADE80' }, // Greenstone
        { dark: '#4A4540', base: '#6A6560', mid: '#7A7570', light: '#9A9590', jade: '#10B981' }, // Volcanic
    ];
    const c = stoneColors[variant];

    return (
        <g>
            <defs>
                <linearGradient id={`${gradId}-stone`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={c.light}/>
                    <stop offset="50%" stopColor={c.mid}/>
                    <stop offset="100%" stopColor={c.base}/>
                </linearGradient>
                <radialGradient id={`${gradId}-jade`} cx="50%" cy="30%">
                    <stop offset="0%" stopColor="#4ADE80"/>
                    <stop offset="60%" stopColor={c.jade}/>
                    <stop offset="100%" stopColor="#166534"/>
                </radialGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="8" ry="2.5" fill="#000" opacity="0.2"/>

            {/* Stepped pyramid base */}
            <rect x="1" y="18" width="22" height="6" fill={c.base}/>
            <rect x="3" y="16" width="18" height="3" fill={c.mid}/>
            <rect x="5" y="14" width="14" height="3" fill={c.light}/>
            {/* Carved glyphs */}
            <rect x="6" y="19" width="3" height="3" fill={c.dark} opacity="0.3"/>
            <rect x="10" y="19" width="4" height="3" fill={c.dark} opacity="0.3"/>
            <rect x="15" y="19" width="3" height="3" fill={c.dark} opacity="0.3"/>

            {/* Blocky body - Mesoamerican convention */}
            <rect x="7" y="4" width="10" height="10" fill={`url(#${gradId}-stone)`}/>

            {/* Elaborate feathered headdress */}
            <path d="M4 2 L12 -10 L20 2 Z" fill={`url(#${gradId}-jade)`}/>
            <path d="M6 0 L12 -7 L18 0 Z" fill={c.jade}/>
            {/* Quetzal feathers */}
            <path d="M8 -2 Q6 -6 4 -10" stroke={c.jade} strokeWidth="2" fill="none"/>
            <path d="M16 -2 Q18 -6 20 -10" stroke={c.jade} strokeWidth="2" fill="none"/>
            <path d="M10 -4 Q8 -10 6 -16" stroke="#22C55E" strokeWidth="1.5" fill="none"/>
            <path d="M14 -4 Q16 -10 18 -16" stroke="#22C55E" strokeWidth="1.5" fill="none"/>

            {/* Face with jade inlay */}
            <rect x="8" y="-1" width="8" height="5" fill={c.mid}/>

            {/* Large stylized eyes */}
            <circle cx="10" cy="1" r="1.5" fill="#F5F0E6"/>
            <circle cx="14" cy="1" r="1.5" fill="#F5F0E6"/>
            <circle cx="10" cy="1" r="0.8" fill="#166534"/>
            <circle cx="14" cy="1" r="0.8" fill="#166534"/>

            {/* Jade nose ornament */}
            <path d="M11 2 L12 4 L13 2" fill={`url(#${gradId}-jade)`}/>

            {/* Mouth with fangs (deity aspect) */}
            <rect x="9.5" y="3.5" width="5" height="2" fill="#DC2626"/>
            <path d="M10 4 L10.5 5.5 M14 4 L13.5 5.5" stroke="#F5F0E6" strokeWidth="0.5"/>

            {/* Gold ear spools */}
            <circle cx="5" cy="2" r="2" fill="#FFD700"/>
            <circle cx="5" cy="2" r="1" fill="#B8860B"/>
            <circle cx="19" cy="2" r="2" fill="#FFD700"/>
            <circle cx="19" cy="2" r="1" fill="#B8860B"/>

            {/* Ritual objects in hands */}
            <path d="M6 8 Q4 10 6 12" stroke={c.mid} strokeWidth="2.5" fill="none"/>
            <path d="M18 8 Q20 10 18 12" stroke={c.mid} strokeWidth="2.5" fill="none"/>
            {/* Obsidian blade */}
            <path d="M4 10 L2 8 L4 6" fill="#1A202C"/>
            {/* Incense bag */}
            <ellipse cx="20" cy="10" rx="1.5" ry="2" fill="#8B4513"/>
        </g>
    );
};

// Renaissance sculpture generator - Rodin-influenced 1889 style
export const generateRenaissanceStatue = (x: number, y: number): JSX.Element => {
    const seed = hash(x, y);
    const variant = Math.floor(seed * 4);
    const gradId = `renaissance-${x}-${y}`;

    // Marble variations
    const marbleColors = [
        { dark: '#C8C0B4', base: '#DCD6CE', mid: '#E8E4DE', light: '#F5F0E8', bright: '#FFFEFA' },
        { dark: '#B8B0A4', base: '#CCC6BE', mid: '#E0DAD2', light: '#F0EBE3', bright: '#FAF8F5' },
        { dark: '#A8A098', base: '#C0B8AC', mid: '#D4CCC0', light: '#EDE8E0', bright: '#F8F5F0' },
    ];
    const c = marbleColors[variant % 3];

    return (
        <g>
            <defs>
                <radialGradient id={`${gradId}-marble`} cx="35%" cy="25%">
                    <stop offset="0%" stopColor={c.bright}/>
                    <stop offset="30%" stopColor={c.light}/>
                    <stop offset="60%" stopColor={c.mid}/>
                    <stop offset="85%" stopColor={c.base}/>
                    <stop offset="100%" stopColor={c.dark}/>
                </radialGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="7" ry="2" fill="#000" opacity="0.2"/>

            {/* Elegant neoclassical pedestal */}
            <rect x="5" y="17" width="14" height="7" fill="#6B6159"/>
            <rect x="4" y="16" width="16" height="2" fill="#7A7068"/>
            <rect x="3" y="15" width="18" height="2" fill="#8B8178"/>
            {/* Fluted decoration */}
            <path d="M6 17 L6 23" stroke="#5C554D" strokeWidth="0.4"/>
            <path d="M9 17 L9 23" stroke="#5C554D" strokeWidth="0.4"/>
            <path d="M12 17 L12 23" stroke="#5C554D" strokeWidth="0.4"/>
            <path d="M15 17 L15 23" stroke="#5C554D" strokeWidth="0.4"/>
            <path d="M18 17 L18 23" stroke="#5C554D" strokeWidth="0.4"/>

            {/* Dynamic contrapposto figure */}
            <path d="M8 15 Q6 9 10 3 L14 3 Q18 9 16 15 Z" fill={`url(#${gradId}-marble)`}/>

            {/* Muscular definition - Michelangelo influence */}
            <path d="M9 12 Q11 10 9 6" stroke={c.dark} strokeWidth="0.5" fill="none"/>
            <path d="M15 12 Q13 10 15 6" stroke={c.dark} strokeWidth="0.5" fill="none"/>
            <path d="M10 8 Q12 9 14 8" stroke={c.dark} strokeWidth="0.4" fill="none"/>

            {/* Extended arm - dramatic gesture */}
            <path d="M15 4 Q19 2 21 -1" stroke={c.mid} strokeWidth="2.5" fill="none"/>
            <circle cx="21" cy="-2" r="1.3" fill={c.light}/>

            {/* Draped fabric element */}
            <path d="M7 12 Q6 14 8 15 Q10 14 12 15 Q14 14 16 15" fill={c.base} opacity="0.7"/>
            <path d="M7 13 Q9 12 11 13 Q13 12 15 13" stroke={c.dark} strokeWidth="0.3" fill="none"/>

            {/* Idealized head */}
            <circle cx="12" cy="-1" r="3.5" fill={`url(#${gradId}-marble)`}/>

            {/* Classical curled hair */}
            <path d="M8.5 -3 Q9 -5 11 -5 Q12 -4 13 -5 Q15 -5 15.5 -3" fill={c.dark}/>
            <path d="M9 -4 Q10 -4.5 11 -4" stroke={c.base} strokeWidth="0.3" fill="none"/>
            <path d="M13 -4 Q14 -4.5 15 -4" stroke={c.base} strokeWidth="0.3" fill="none"/>

            {/* Deep-set eyes */}
            <ellipse cx="10.5" cy="-1.5" rx="0.9" ry="0.5" fill={c.dark} opacity="0.5"/>
            <ellipse cx="13.5" cy="-1.5" rx="0.9" ry="0.5" fill={c.dark} opacity="0.5"/>

            {/* Refined nose and lips */}
            <path d="M12 -2 L12 0.5" stroke={c.dark} strokeWidth="0.4"/>
            <path d="M11 1 Q12 1.5 13 1" stroke={c.base} strokeWidth="0.35" fill="none"/>

            {/* Subtle veining */}
            <path d="M10 8 Q9 5 10 2" stroke={c.dark} strokeWidth="0.1" opacity="0.2" fill="none"/>
        </g>
    );
};

// ============================================================================
// STATIC STATUE GRAPHICS - Pre-defined sculptures
// ============================================================================

export const STATUE_GRAPHICS: Record<string, JSX.Element> = {
    // Default Western/Classical marble statue
    STATUE: (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="7" ry="2" fill="#000" opacity="0.2"/>

            <defs>
                <radialGradient id="marble-default" cx="40%" cy="30%">
                    <stop offset="0%" stopColor="#FFFEFA"/>
                    <stop offset="40%" stopColor="#F5F0E8"/>
                    <stop offset="70%" stopColor="#E8E4DE"/>
                    <stop offset="100%" stopColor="#D4CCC0"/>
                </radialGradient>
                <linearGradient id="pedestal-default" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8B8178"/>
                    <stop offset="50%" stopColor="#6B6159"/>
                    <stop offset="100%" stopColor="#5C554D"/>
                </linearGradient>
            </defs>

            {/* Ornate pedestal with classical molding */}
            <rect x="4" y="17" width="16" height="7" fill="url(#pedestal-default)"/>
            <rect x="5" y="16" width="14" height="2" fill="#7A7068"/>
            <path d="M5 18 L19 18" stroke="#5C554D" strokeWidth="0.5"/>
            <path d="M4 20 Q12 19 20 20" stroke="#7A7068" strokeWidth="0.4"/>
            {/* Corner rosettes */}
            <circle cx="6" cy="20" r="0.8" fill="#7A7068"/>
            <circle cx="18" cy="20" r="0.8" fill="#7A7068"/>

            {/* Classical draped torso */}
            <path d="M7 16 Q6 10 9 5 L15 5 Q18 10 17 16 Z" fill="url(#marble-default)"/>
            {/* Toga draping detail */}
            <path d="M8 14 Q11 12 8 8" stroke="#C8C2BA" strokeWidth="0.6" fill="none"/>
            <path d="M16 14 Q13 12 16 8" stroke="#C8C2BA" strokeWidth="0.6" fill="none"/>
            <path d="M9 10 Q12 11 15 10" stroke="#D0CAC2" strokeWidth="0.5" fill="none"/>
            <path d="M8 13 Q12 12 16 13" stroke="#D0CAC2" strokeWidth="0.4" fill="none"/>

            {/* Neck */}
            <rect x="10" y="3" width="4" height="3" fill="#E8E4DE"/>

            {/* Classical head shape */}
            <ellipse cx="12" cy="0" rx="4" ry="4.5" fill="url(#marble-default)"/>

            {/* Classical hairstyle - curled Roman style */}
            <path d="M8 -2 Q7 -4 9 -5 Q11 -4 12 -5 Q13 -4 15 -5 Q17 -4 16 -2" fill="#C8C2BA"/>
            <path d="M8.5 -3 Q8 -4.5 9.5 -4.5" stroke="#B8B2AA" strokeWidth="0.3" fill="none"/>
            <path d="M11 -4 Q11 -5 12 -5" stroke="#B8B2AA" strokeWidth="0.3" fill="none"/>
            <path d="M14 -4 Q14 -5 15 -4.5" stroke="#B8B2AA" strokeWidth="0.3" fill="none"/>

            {/* Deep-set classical eyes */}
            <ellipse cx="10" cy="-1" rx="1.2" ry="0.6" fill="#D0CAC2"/>
            <ellipse cx="14" cy="-1" rx="1.2" ry="0.6" fill="#D0CAC2"/>
            <ellipse cx="10" cy="-1" rx="0.5" ry="0.3" fill="#9A938A"/>
            <ellipse cx="14" cy="-1" rx="0.5" ry="0.3" fill="#9A938A"/>

            {/* Defined nose - straight classical */}
            <path d="M12 -2 L12 1" stroke="#C8C2BA" strokeWidth="0.5"/>
            <path d="M11 1.5 Q12 2 13 1.5" stroke="#C8C2BA" strokeWidth="0.4" fill="none"/>

            {/* Lips */}
            <path d="M10.5 3 Q12 3.5 13.5 3" stroke="#C0BAB2" strokeWidth="0.4" fill="none"/>

            {/* Subtle marble veining */}
            <path d="M9 8 Q10 5 9 2" stroke="#C8C2BA" strokeWidth="0.1" opacity="0.3" fill="none"/>
        </g>
    ),

    // Asian Buddha/deity - gilded bronze
    STATUE_ASIAN_TALL: (
        <g>
            <defs>
                <radialGradient id="gold-buddha" cx="40%" cy="25%">
                    <stop offset="0%" stopColor="#FFD700"/>
                    <stop offset="30%" stopColor="#E6C84B"/>
                    <stop offset="60%" stopColor="#DAA520"/>
                    <stop offset="85%" stopColor="#C9A227"/>
                    <stop offset="100%" stopColor="#8B6914"/>
                </radialGradient>
                <radialGradient id="halo-buddha" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4"/>
                    <stop offset="70%" stopColor="#DAA520" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#8B6914" stopOpacity="0"/>
                </radialGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="9" ry="2.5" fill="#000" opacity="0.2"/>

            {/* Ornate lotus throne base */}
            <ellipse cx="12" cy="20" rx="10" ry="3.5" fill="#C9A227"/>
            <ellipse cx="12" cy="19" rx="9" ry="3" fill="#DAA520"/>
            {/* Lotus petals - layered */}
            <path d="M2 19 Q4 16 6 18 Q8 15 10 18 Q12 14 14 18 Q16 15 18 18 Q20 16 22 19"
                  fill="#E8B8C8" stroke="#C89098" strokeWidth="0.3"/>
            <path d="M4 18 Q6 15 8 17 Q10 14 12 17 Q14 14 16 17 Q18 15 20 18"
                  fill="#F0C8D8" stroke="#C89098" strokeWidth="0.2"/>
            <ellipse cx="12" cy="17" rx="7" ry="2" fill="#E6C84B" opacity="0.5"/>

            {/* Seated meditation body */}
            <ellipse cx="12" cy="12" rx="7" ry="5" fill="url(#gold-buddha)"/>
            <ellipse cx="12" cy="11" rx="6" ry="4" fill="#E6C84B"/>
            {/* Crossed legs */}
            <path d="M5 14 Q12 17 19 14" stroke="#8B6914" strokeWidth="0.5" fill="none"/>
            {/* Robe draping */}
            <path d="M6 10 Q8 12 12 11 Q16 12 18 10" stroke="#B8860B" strokeWidth="0.5" fill="none"/>
            <path d="M7 8 Q12 10 17 8" stroke="#B8860B" strokeWidth="0.4" fill="none"/>

            {/* Hands in dhyana mudra */}
            <ellipse cx="12" cy="13" rx="3.5" ry="1.8" fill="#DAA520"/>
            <ellipse cx="12" cy="13" rx="2.5" ry="1.2" fill="#E6C84B"/>

            {/* Serene face */}
            <circle cx="12" cy="2" r="4.5" fill="url(#gold-buddha)"/>
            <circle cx="12" cy="1.5" r="4" fill="#E6C84B"/>

            {/* Ushnisha */}
            <ellipse cx="12" cy="-3" rx="2.2" ry="2.8" fill="#DAA520"/>
            <circle cx="12" cy="-5.5" r="1.3" fill="#C9A227"/>

            {/* Downcast eyes - meditation */}
            <path d="M9.5 1 Q10.5 1.8 11.5 1" stroke="#8B6914" strokeWidth="0.5" fill="none"/>
            <path d="M12.5 1 Q13.5 1.8 14.5 1" stroke="#8B6914" strokeWidth="0.5" fill="none"/>

            {/* Subtle nose and serene smile */}
            <path d="M12 0 L12 2.5" stroke="#B8860B" strokeWidth="0.4"/>
            <path d="M10 3.5 Q12 4.5 14 3.5" stroke="#B8860B" strokeWidth="0.4" fill="none"/>

            {/* Elongated earlobes */}
            <path d="M7.5 2 Q7 4.5 8 6" stroke="#DAA520" strokeWidth="1.2" fill="none"/>
            <path d="M16.5 2 Q17 4.5 16 6" stroke="#DAA520" strokeWidth="1.2" fill="none"/>

            {/* Subtle halo */}
            <circle cx="12" cy="0" r="8" fill="url(#halo-buddha)"/>
        </g>
    ),

    // Asian small figure - Bodhisattva
    STATUE_ASIAN_SMALL: (
        <g>
            <defs>
                <radialGradient id="gold-small" cx="40%" cy="25%">
                    <stop offset="0%" stopColor="#FFD700"/>
                    <stop offset="50%" stopColor="#DAA520"/>
                    <stop offset="100%" stopColor="#8B6914"/>
                </radialGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="5" ry="1.5" fill="#000" opacity="0.15"/>

            {/* Wooden pedestal */}
            <rect x="6" y="18" width="12" height="6" fill="#5D4037"/>
            <rect x="7" y="17" width="10" height="2" fill="#6D4C41"/>
            <path d="M7 20 L17 20" stroke="#4E342E" strokeWidth="0.3"/>

            {/* Standing figure - elegant pose */}
            <path d="M9 17 Q8 11 10 5 L14 5 Q16 11 15 17 Z" fill="url(#gold-small)"/>
            {/* Robe details */}
            <path d="M9 11 Q12 13 15 11" stroke="#8B6914" strokeWidth="0.4" fill="none"/>
            <path d="M10 14 Q12 15 14 14" stroke="#8B6914" strokeWidth="0.3" fill="none"/>

            {/* Graceful neck */}
            <rect x="11" y="3" width="2" height="3" fill="#DAA520"/>

            {/* Refined face */}
            <ellipse cx="12" cy="0" rx="3" ry="3.5" fill="url(#gold-small)"/>
            <ellipse cx="12" cy="-0.5" rx="2.5" ry="3" fill="#E6C84B"/>

            {/* Downcast meditative eyes */}
            <path d="M10 -0.5 Q10.5 0 11 -0.5" stroke="#8B6914" strokeWidth="0.3" fill="none"/>
            <path d="M13 -0.5 Q13.5 0 14 -0.5" stroke="#8B6914" strokeWidth="0.3" fill="none"/>

            {/* Subtle features */}
            <path d="M12 -1 L12 1" stroke="#B8860B" strokeWidth="0.3"/>
            <path d="M11 2 Q12 2.5 13 2" stroke="#B8860B" strokeWidth="0.25" fill="none"/>

            {/* Elaborate headdress */}
            <ellipse cx="12" cy="-3.5" rx="2.5" ry="1.5" fill="#C9A227"/>
            <circle cx="12" cy="-4.5" r="0.8" fill="#FFD700"/>
        </g>
    ),

    // Egyptian Pharaoh - tall
    STATUE_EGYPTIAN_TALL: (
        <g>
            <defs>
                <linearGradient id="stone-egypt" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E4C594"/>
                    <stop offset="50%" stopColor="#D4B584"/>
                    <stop offset="100%" stopColor="#C4A574"/>
                </linearGradient>
                <linearGradient id="nemes-stripe" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1E3A8A"/>
                    <stop offset="25%" stopColor="#1E3A8A"/>
                    <stop offset="25%" stopColor="#3B82F6"/>
                    <stop offset="50%" stopColor="#3B82F6"/>
                    <stop offset="50%" stopColor="#1E3A8A"/>
                    <stop offset="75%" stopColor="#1E3A8A"/>
                    <stop offset="75%" stopColor="#3B82F6"/>
                    <stop offset="100%" stopColor="#3B82F6"/>
                </linearGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="7" ry="2" fill="#000" opacity="0.2"/>

            {/* Hieroglyphic base */}
            <rect x="3" y="17" width="18" height="7" fill="#C4A574"/>
            <rect x="4" y="16" width="16" height="2" fill="#D4B584"/>
            {/* Cartouche details */}
            <rect x="6" y="18" width="3" height="4" fill="#8B7355" opacity="0.3"/>
            <rect x="10" y="18" width="4" height="4" fill="#8B7355" opacity="0.3"/>
            <rect x="15" y="18" width="3" height="4" fill="#8B7355" opacity="0.3"/>
            {/* Ankh */}
            <path d="M7.5 19 L7.5 21 M6.5 20 L8.5 20" stroke="#FFD700" strokeWidth="0.4"/>
            <circle cx="7.5" cy="18.5" r="0.8" fill="none" stroke="#FFD700" strokeWidth="0.3"/>

            {/* Rigid frontal body */}
            <rect x="7" y="4" width="10" height="13" fill="url(#stone-egypt)"/>
            {/* Crossed arms */}
            <rect x="5" y="6" width="3" height="9" fill="#D4B584"/>
            <rect x="16" y="6" width="3" height="9" fill="#D4B584"/>
            {/* Crook */}
            <path d="M6.5 6 Q5 4 6 2 Q8 1 8 3" stroke="#FFD700" strokeWidth="0.8" fill="none"/>
            {/* Flail */}
            <line x1="17.5" y1="6" x2="17.5" y2="3" stroke="#FFD700" strokeWidth="0.6"/>
            <line x1="16.5" y1="3" x2="18.5" y2="3" stroke="#FFD700" strokeWidth="0.4"/>
            <line x1="16.5" y1="2" x2="18.5" y2="2" stroke="#FFD700" strokeWidth="0.4"/>

            {/* Nemes headdress */}
            <path d="M5 -2 L12 -10 L19 -2 L19 4 L5 4 Z" fill="url(#nemes-stripe)"/>
            <line x1="9" y1="-6" x2="9" y2="4" stroke="#FFD700" strokeWidth="0.4"/>
            <line x1="12" y1="-10" x2="12" y2="4" stroke="#FFD700" strokeWidth="0.4"/>
            <line x1="15" y1="-6" x2="15" y2="4" stroke="#FFD700" strokeWidth="0.4"/>

            {/* Face */}
            <rect x="8" y="-2" width="8" height="6" fill="#D4B584"/>

            {/* Kohl-lined eyes */}
            <ellipse cx="10" cy="0" rx="1.2" ry="0.6" fill="#1A202C"/>
            <ellipse cx="14" cy="0" rx="1.2" ry="0.6" fill="#1A202C"/>
            <path d="M8.5 0 L11.5 0" stroke="#1A202C" strokeWidth="0.3"/>
            <path d="M12.5 0 L15.5 0" stroke="#1A202C" strokeWidth="0.3"/>

            {/* Uraeus */}
            <path d="M12 -4 Q11 -6 12 -7 Q13 -6 12 -4" fill="#FFD700"/>
            <circle cx="12" cy="-7.5" r="0.6" fill="#FFD700"/>

            {/* False beard */}
            <rect x="11" y="3" width="2" height="4" fill="#8B7355"/>
            <path d="M11 7 Q12 8 13 7" fill="#8B7355"/>
        </g>
    ),

    // Egyptian bust
    STATUE_EGYPTIAN_BUST: (
        <g>
            <defs>
                <linearGradient id="stone-egypt-bust" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E4C594"/>
                    <stop offset="100%" stopColor="#C4A574"/>
                </linearGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="5" ry="1.5" fill="#000" opacity="0.15"/>

            {/* Pedestal */}
            <rect x="6" y="18" width="12" height="6" fill="#4A3728"/>
            <rect x="5" y="17" width="14" height="2" fill="#5D4037"/>

            {/* Shoulders */}
            <ellipse cx="12" cy="14" rx="5" ry="3" fill="url(#stone-egypt-bust)"/>

            {/* Nemes headdress */}
            <path d="M6 8 L12 2 L18 8 L18 12 L6 12 Z" fill="#1E3A8A"/>
            <path d="M7 8 L12 3 L17 8" fill="#3B82F6"/>
            <line x1="9" y1="6" x2="9" y2="12" stroke="#FFD700" strokeWidth="0.3"/>
            <line x1="12" y1="2" x2="12" y2="12" stroke="#FFD700" strokeWidth="0.3"/>
            <line x1="15" y1="6" x2="15" y2="12" stroke="#FFD700" strokeWidth="0.3"/>

            {/* Face */}
            <rect x="9" y="6" width="6" height="6" fill="#D4B584"/>

            {/* Kohl-lined eyes */}
            <ellipse cx="10.5" cy="8" rx="0.8" ry="0.4" fill="#1A202C"/>
            <ellipse cx="13.5" cy="8" rx="0.8" ry="0.4" fill="#1A202C"/>

            {/* Uraeus */}
            <circle cx="12" cy="4" r="1" fill="#FFD700"/>
        </g>
    ),

    // African carved figure - tall ancestor figure
    STATUE_AFRICAN_TALL: (
        <g>
            <defs>
                <linearGradient id="wood-african" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2A1A0F"/>
                    <stop offset="30%" stopColor="#3D2817"/>
                    <stop offset="50%" stopColor="#4E3524"/>
                    <stop offset="70%" stopColor="#5D4230"/>
                    <stop offset="100%" stopColor="#6B4F3A"/>
                </linearGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="6" ry="2" fill="#000" opacity="0.2"/>

            {/* Carved circular base */}
            <ellipse cx="12" cy="20" rx="7" ry="2.5" fill="#3D2817"/>
            <ellipse cx="12" cy="19" rx="6" ry="2" fill="#4E3524"/>
            <path d="M6 20 L8 19 L10 20 L12 19 L14 20 L16 19 L18 20" stroke="#2A1A0F" strokeWidth="0.4" fill="none"/>

            {/* Elongated standing figure */}
            <path d="M9 19 Q8 12 10 4 L14 4 Q16 12 15 19 Z" fill="url(#wood-african)"/>

            {/* Ritual scarification */}
            <path d="M10 8 L14 8" stroke="#2A1A0F" strokeWidth="0.35"/>
            <path d="M10 11 L14 11" stroke="#2A1A0F" strokeWidth="0.35"/>
            <path d="M10 14 L14 14" stroke="#2A1A0F" strokeWidth="0.35"/>
            <path d="M11 6 L11 16" stroke="#2A1A0F" strokeWidth="0.25"/>
            <path d="M13 6 L13 16" stroke="#2A1A0F" strokeWidth="0.25"/>

            {/* Arms */}
            <rect x="6" y="8" width="3" height="8" fill="#4E3524"/>
            <rect x="15" y="8" width="3" height="8" fill="#4E3524"/>
            <ellipse cx="7" cy="16" rx="1.2" ry="1.8" fill="#5D4230"/>
            <ellipse cx="17" cy="16" rx="1.2" ry="1.8" fill="#5D4230"/>

            {/* Neck with brass rings */}
            <rect x="10" y="0" width="4" height="4" fill="#4E3524"/>
            <path d="M10 1 L14 1" stroke="#CD7F32" strokeWidth="0.5"/>
            <path d="M10 2.5 L14 2.5" stroke="#CD7F32" strokeWidth="0.5"/>

            {/* Stylized head */}
            <ellipse cx="12" cy="-4" rx="4" ry="5" fill="url(#wood-african)"/>

            {/* Cowrie shell eyes */}
            <ellipse cx="10" cy="-5" rx="1.5" ry="0.8" fill="#F5DEB3"/>
            <ellipse cx="14" cy="-5" rx="1.5" ry="0.8" fill="#F5DEB3"/>
            <circle cx="10" cy="-5" r="0.5" fill="#1A0A00"/>
            <circle cx="14" cy="-5" r="0.5" fill="#1A0A00"/>

            {/* Prominent nose */}
            <path d="M12 -6 L12 -2" stroke="#2A1A0F" strokeWidth="0.8"/>
            <ellipse cx="12" cy="-2" rx="1.2" ry="0.6" fill="#3D2817"/>

            {/* Stylized mouth */}
            <ellipse cx="12" cy="0" rx="2" ry="0.8" fill="#8B0000" opacity="0.5"/>

            {/* Elaborate headdress */}
            <path d="M8 -8 Q10 -12 12 -12 Q14 -12 16 -8" fill="#2A1A0F"/>
            <ellipse cx="12" cy="-10" rx="2.5" ry="2" fill="#3D2817"/>
            <path d="M10 -11 L12 -15 L14 -11" fill="#4E3524"/>
            <circle cx="12" cy="-13" r="1" fill="#CD7F32"/>
        </g>
    ),

    // African mask on display stand
    STATUE_AFRICAN_MASK: (
        <g>
            <defs>
                <linearGradient id="wood-mask" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2A1A0F"/>
                    <stop offset="50%" stopColor="#4E3524"/>
                    <stop offset="100%" stopColor="#6B4423"/>
                </linearGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="4" ry="1" fill="#000" opacity="0.15"/>

            {/* Museum display stand */}
            <rect x="8" y="17" width="8" height="7" fill="#2A1A0F"/>
            <rect x="9" y="16" width="6" height="2" fill="#3D2817"/>
            <rect x="11" y="12" width="2" height="5" fill="#4A3728"/>

            {/* Mask form */}
            <ellipse cx="12" cy="6" rx="5" ry="7" fill="url(#wood-mask)"/>
            <ellipse cx="12" cy="5.5" rx="4.5" ry="6.5" fill="#5D4230"/>

            {/* Stylized eye sockets */}
            <ellipse cx="9.5" cy="4" rx="1.8" ry="1.2" fill="#3D2817"/>
            <ellipse cx="14.5" cy="4" rx="1.8" ry="1.2" fill="#3D2817"/>
            {/* Cowrie shell inlay */}
            <ellipse cx="9.5" cy="4" rx="1" ry="0.7" fill="#F5DEB3"/>
            <ellipse cx="14.5" cy="4" rx="1" ry="0.7" fill="#F5DEB3"/>
            <circle cx="9.5" cy="4" r="0.3" fill="#1A202C"/>
            <circle cx="14.5" cy="4" r="0.3" fill="#1A202C"/>

            {/* Nose ridge */}
            <path d="M12 2 L12 8" stroke="#4E3524" strokeWidth="1.2"/>
            <path d="M10.5 7.5 Q12 8.5 13.5 7.5" stroke="#4E3524" strokeWidth="0.5" fill="none"/>

            {/* Mouth */}
            <ellipse cx="12" cy="10" rx="2.5" ry="1.2" fill="#2A1A0F"/>
            <path d="M10 10 L14 10" stroke="#F5DEB3" strokeWidth="0.3"/>

            {/* Scarification */}
            <path d="M7 4 L8 6" stroke="#3D2817" strokeWidth="0.4"/>
            <path d="M17 4 L16 6" stroke="#3D2817" strokeWidth="0.4"/>

            {/* Forehead decoration */}
            <path d="M9 0 L12 -2 L15 0" stroke="#CD7F32" strokeWidth="0.5" fill="none"/>
            <circle cx="12" cy="-1" r="0.6" fill="#CD7F32"/>
        </g>
    ),

    // Mesoamerican statue
    STATUE_MESOAMERICAN: (
        <g>
            <defs>
                <linearGradient id="stone-meso" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#9CA3AF"/>
                    <stop offset="50%" stopColor="#78716C"/>
                    <stop offset="100%" stopColor="#6B7280"/>
                </linearGradient>
                <radialGradient id="jade-meso" cx="50%" cy="30%">
                    <stop offset="0%" stopColor="#4ADE80"/>
                    <stop offset="60%" stopColor="#16A34A"/>
                    <stop offset="100%" stopColor="#166534"/>
                </radialGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="8" ry="2.5" fill="#000" opacity="0.2"/>

            {/* Stepped pyramid base */}
            <rect x="1" y="18" width="22" height="6" fill="#6B7280"/>
            <rect x="3" y="16" width="18" height="3" fill="#78716C"/>
            <rect x="5" y="14" width="14" height="3" fill="#9CA3AF"/>
            <rect x="6" y="19" width="3" height="3" fill="#4A5568" opacity="0.3"/>
            <rect x="10" y="19" width="4" height="3" fill="#4A5568" opacity="0.3"/>
            <rect x="15" y="19" width="3" height="3" fill="#4A5568" opacity="0.3"/>

            {/* Blocky body */}
            <rect x="7" y="4" width="10" height="10" fill="url(#stone-meso)"/>

            {/* Feathered headdress */}
            <path d="M4 2 L12 -10 L20 2 Z" fill="url(#jade-meso)"/>
            <path d="M6 0 L12 -7 L18 0 Z" fill="#22C55E"/>
            {/* Quetzal feathers */}
            <path d="M8 -2 Q6 -6 4 -10" stroke="#16A34A" strokeWidth="2" fill="none"/>
            <path d="M16 -2 Q18 -6 20 -10" stroke="#16A34A" strokeWidth="2" fill="none"/>
            <path d="M10 -4 Q8 -10 6 -16" stroke="#22C55E" strokeWidth="1.5" fill="none"/>
            <path d="M14 -4 Q16 -10 18 -16" stroke="#22C55E" strokeWidth="1.5" fill="none"/>

            {/* Face with jade inlay */}
            <rect x="8" y="-1" width="8" height="5" fill="#78716C"/>

            {/* Large stylized eyes */}
            <circle cx="10" cy="1" r="1.5" fill="#F5F0E6"/>
            <circle cx="14" cy="1" r="1.5" fill="#F5F0E6"/>
            <circle cx="10" cy="1" r="0.8" fill="#166534"/>
            <circle cx="14" cy="1" r="0.8" fill="#166534"/>

            {/* Jade nose ornament */}
            <path d="M11 2 L12 4 L13 2" fill="url(#jade-meso)"/>

            {/* Mouth with fangs */}
            <rect x="9.5" y="3.5" width="5" height="2" fill="#DC2626"/>
            <path d="M10 4 L10.5 5.5 M14 4 L13.5 5.5" stroke="#F5F0E6" strokeWidth="0.5"/>

            {/* Gold ear spools */}
            <circle cx="5" cy="2" r="2" fill="#FFD700"/>
            <circle cx="5" cy="2" r="1" fill="#B8860B"/>
            <circle cx="19" cy="2" r="2" fill="#FFD700"/>
            <circle cx="19" cy="2" r="1" fill="#B8860B"/>

            {/* Arms with ritual objects */}
            <path d="M6 8 Q4 10 6 12" stroke="#78716C" strokeWidth="2.5" fill="none"/>
            <path d="M18 8 Q20 10 18 12" stroke="#78716C" strokeWidth="2.5" fill="none"/>
            <path d="M4 10 L2 8 L4 6" fill="#1A202C"/>
            <ellipse cx="20" cy="10" rx="1.5" ry="2" fill="#8B4513"/>
        </g>
    ),

    // Classical bust - Greek/Roman
    STATUE_BUST: (
        <g>
            <defs>
                <radialGradient id="marble-bust" cx="40%" cy="30%">
                    <stop offset="0%" stopColor="#FFFEFA"/>
                    <stop offset="40%" stopColor="#F5F0E8"/>
                    <stop offset="70%" stopColor="#E8E4DE"/>
                    <stop offset="100%" stopColor="#D4CCC0"/>
                </radialGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="5" ry="1.5" fill="#000" opacity="0.15"/>

            {/* Elegant socle */}
            <rect x="6" y="18" width="12" height="6" fill="#5C554D"/>
            <rect x="7" y="17" width="10" height="2" fill="#6B6159"/>
            <rect x="5" y="16" width="14" height="2" fill="#7A7068"/>
            <path d="M6 19 L18 19" stroke="#4A453F" strokeWidth="0.4"/>

            {/* Draped bust shoulders */}
            <path d="M6 16 Q6 12 9 10 L15 10 Q18 12 18 16 Z" fill="url(#marble-bust)"/>
            <path d="M7 16 Q7 13 10 11" stroke="#D0CAC2" strokeWidth="0.6" fill="none"/>
            <path d="M17 16 Q17 13 14 11" stroke="#D0CAC2" strokeWidth="0.6" fill="none"/>

            {/* Neck */}
            <rect x="10" y="7" width="4" height="4" fill="#E8E4DE"/>

            {/* Classical head */}
            <ellipse cx="12" cy="4" rx="4" ry="4.5" fill="url(#marble-bust)"/>
            <ellipse cx="12" cy="3.5" rx="3.5" ry="4" fill="#DCD6CE"/>

            {/* Realistic eyes */}
            <ellipse cx="10" cy="3" rx="1" ry="0.5" fill="#C8C2BA"/>
            <ellipse cx="14" cy="3" rx="1" ry="0.5" fill="#C8C2BA"/>
            <circle cx="10" cy="3" r="0.3" fill="#8B8178"/>
            <circle cx="14" cy="3" r="0.3" fill="#8B8178"/>

            {/* Brow */}
            <path d="M8.5 2 L11.5 2" stroke="#C8C2BA" strokeWidth="0.5"/>
            <path d="M12.5 2 L15.5 2" stroke="#C8C2BA" strokeWidth="0.5"/>

            {/* Classical nose */}
            <path d="M12 2 L12 5" stroke="#C8C2BA" strokeWidth="0.5"/>
            <path d="M11 5.5 Q12 6 13 5.5" stroke="#C8C2BA" strokeWidth="0.4" fill="none"/>

            {/* Mouth */}
            <path d="M10.5 6.5 Q12 7 13.5 6.5" stroke="#C0BAB2" strokeWidth="0.4" fill="none"/>

            {/* Curled Roman hair */}
            <path d="M8 1 Q7 -1 9 -1.5 Q10 -0.5 11 -1.5 Q12 -0.5 13 -1.5 Q14 -0.5 15 -1.5 Q17 -1 16 1" fill="#B8B2AA"/>
            <path d="M8.5 0 Q8 -0.8 9.5 -1" stroke="#A8A29E" strokeWidth="0.3" fill="none"/>
        </g>
    ),

    // Bronze allegorical figure
    STATUE_ALLEGORICAL: (
        <g>
            <defs>
                <radialGradient id="bronze-alleg" cx="35%" cy="25%">
                    <stop offset="0%" stopColor="#8D6E63"/>
                    <stop offset="50%" stopColor="#6D4C41"/>
                    <stop offset="100%" stopColor="#4E342E"/>
                </radialGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="8" ry="2.5" fill="#000" opacity="0.25"/>

            {/* Stone pedestal */}
            <rect x="2" y="16" width="20" height="8" fill="#4A5568"/>
            <rect x="0" y="14" width="24" height="3" fill="#64748B"/>

            {/* Dynamic bronze figure */}
            <ellipse cx="12" cy="6" rx="6" ry="10" fill="url(#bronze-alleg)"/>
            <ellipse cx="12" cy="4" rx="5" ry="8" fill="#7A5A4A"/>

            {/* Head with laurel wreath */}
            <circle cx="12" cy="-8" r="4" fill="url(#bronze-alleg)"/>
            <circle cx="12" cy="-9" r="3.5" fill="#7A5A4A"/>
            <ellipse cx="12" cy="-12" rx="4" ry="2" fill="#166534"/>
            <path d="M8 -12 Q10 -14 12 -12 Q14 -14 16 -12" fill="#22C55E"/>

            {/* Raised arm with torch */}
            <path d="M17 2 Q22 -4 20 -12" stroke="#5D4A3A" strokeWidth="3" fill="none"/>
            <ellipse cx="20" cy="-14" rx="2" ry="3" fill="#F59E0B"/>
            <path d="M19 -16 Q20 -18 21 -16" fill="#FCD34D"/>

            {/* Other arm with shield */}
            <path d="M7 4 Q2 2 4 8" stroke="#5D4A3A" strokeWidth="3" fill="none"/>
            <rect x="2" y="6" width="4" height="6" fill="#4A5568"/>

            {/* Draped robe */}
            <path d="M6 10 Q12 8 18 10 L16 16 Q12 14 8 16 Z" fill="#5D4A3A"/>

            {/* Patina highlights */}
            <ellipse cx="10" cy="2" rx="2" ry="3" fill="#4A6741" opacity="0.2"/>
        </g>
    ),

    // Monumental statue - very tall
    STATUE_MONUMENTAL: (
        <g>
            <defs>
                <radialGradient id="bronze-mon" cx="35%" cy="25%">
                    <stop offset="0%" stopColor="#8D6E63"/>
                    <stop offset="50%" stopColor="#6D4C41"/>
                    <stop offset="100%" stopColor="#4E342E"/>
                </radialGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="10" ry="3" fill="#000" opacity="0.25"/>

            {/* Massive stepped pedestal */}
            <rect x="0" y="14" width="24" height="10" fill="#4A5568"/>
            <rect x="2" y="12" width="20" height="3" fill="#64748B"/>
            <rect x="4" y="10" width="16" height="3" fill="#78716C"/>

            {/* Heroic torso */}
            <ellipse cx="12" cy="4" rx="7" ry="8" fill="url(#bronze-mon)"/>
            <path d="M5 8 Q12 4 19 8 L18 14 Q12 12 6 14 Z" fill="#5D4A3A"/>

            {/* Upper body reaching up */}
            <ellipse cx="12" cy="-8" rx="6" ry="10" fill="#7A6A4A"/>

            {/* Outstretched arms */}
            <path d="M6 -6 Q0 -12 2 -20" stroke="#6B5344" strokeWidth="4" fill="none"/>
            <path d="M18 -6 Q24 -12 22 -20" stroke="#6B5344" strokeWidth="4" fill="none"/>
            <circle cx="2" cy="-20" r="2" fill="#7A6A4A"/>
            <circle cx="22" cy="-20" r="2" fill="#7A6A4A"/>

            {/* Heroic head */}
            <circle cx="12" cy="-24" r="5" fill="url(#bronze-mon)"/>
            <circle cx="12" cy="-25" r="4.5" fill="#7A6A4A"/>

            {/* Crown/helmet */}
            <path d="M7 -28 L12 -36 L17 -28" fill="#4A5568"/>
            <circle cx="12" cy="-32" r="2" fill="#FFD700"/>

            {/* Facial features */}
            <ellipse cx="10" cy="-26" rx="0.8" ry="0.4" fill="#5D4A3A"/>
            <ellipse cx="14" cy="-26" rx="0.8" ry="0.4" fill="#5D4A3A"/>
            <path d="M10 -23 Q12 -22 14 -23" stroke="#5D4A3A" strokeWidth="0.5" fill="none"/>
        </g>
    ),
};

// Export generator functions for use in MapTile
export const STATUE_GENERATORS: Record<string, (x: number, y: number) => JSX.Element> = {
    generateClassicalStatue,
    generateBronzeStatue,
    generateAsianStatue,
    generateEgyptianStatue,
    generateAfricanStatue,
    generateMesoamericanStatue,
    generateRenaissanceStatue,
};
