import { Item } from '../types';

// Historically accurate items from 1889 Paris World's Fair era
// All items researched for accuracy to the period

export const HISTORICAL_ITEMS: Record<string, Item[]> = {
  // Documents & Literary Items
  DOCUMENTS: [
    { id: 'letter_brother', name: "Letter from William James", description: "Your brother writes about 'Stream of Consciousness'. It gives you a headache.", type: 'DOCUMENT', rarity: 'COMMON', historicalNote: "William James pioneered psychology and philosophy in the 1880s." },
    { id: 'letter_alice', name: "Letter from Alice James", description: "News from home. She is unwell, as usual.", type: 'DOCUMENT', rarity: 'COMMON', historicalNote: "Henry's sister Alice suffered from nervous ailments throughout her life." },
    { id: 'notebook_blue', name: "Blue Notebook", description: "Filled with observations about the 'vulgarity' of the tower.", type: 'DOCUMENT', rarity: 'COMMON' },
    { id: 'expo_guide', name: "Exposition Universelle Guide", description: "A map of the grounds. Pages are already dog-eared and crumbling.", type: 'DOCUMENT', rarity: 'COMMON', historicalNote: "Official guidebooks were essential at the massive 1889 fair." },
    { id: 'figaro', name: "Le Figaro (May 6, 1889)", description: "The Tower opening coverage. Maupassant's protests are quoted.", type: 'DOCUMENT', rarity: 'UNCOMMON', historicalNote: "Guy de Maupassant famously ate lunch in the Eiffel Tower daily to avoid seeing it." },
    { id: 'revue_deux', name: "Revue des Deux Mondes", description: "Contains your own serialized story. The prose seems labored in retrospect.", type: 'DOCUMENT', rarity: 'RARE', historicalNote: "Henry James published extensively in this prestigious French journal." },
    { id: 'ticket_panorama', name: "Panorama Ticket Stub", description: "Entry to the Battle of Rezonville circular painting.", type: 'DOCUMENT', rarity: 'COMMON', historicalNote: "Panoramas were immensely popular at the fair, depicting historical battles." },
    { id: 'carte_visite', name: "Carte de Visite", description: "Your visiting card. The engraving is elegant but the name feels heavy.", type: 'DOCUMENT', rarity: 'COMMON', historicalNote: "Calling cards were essential social currency in 19th century society." },
    { id: 'manuscript_page', name: "Manuscript Page", description: "A discarded passage from 'The Tragic Muse'. Perhaps better forgotten.", type: 'DOCUMENT', rarity: 'UNCOMMON', historicalNote: "James was completing The Tragic Muse during this period." },
    { id: 'telegraph_message', name: "Telegraph from Publisher", description: "Macmillan inquires about your deadline. Aggressive in tone.", type: 'DOCUMENT', rarity: 'UNCOMMON', historicalNote: "The telegraph revolutionized international publishing in the 1880s." }
  ],

  // Tools & Instruments
  TOOLS: [
    { id: 'opera_glasses', name: "Opera Glasses", description: "For observing people from a safe distance. Brass fittings, mother-of-pearl inlay.", type: 'TOOL', rarity: 'UNCOMMON', historicalNote: "Essential for theater-going and discreet social observation." },
    { id: 'fountain_pen', name: "Waterman Fountain Pen", description: "Ink stains on the barrel. Reliable. American-made.", type: 'TOOL', rarity: 'COMMON', historicalNote: "Lewis Waterman's fountain pen (1884) revolutionized writing." },
    { id: 'pocket_watch', name: "Gold Pocket Watch", description: "Swiss movement. Runs slightly fast. Engraved with initials 'H.J.'", type: 'TOOL', rarity: 'RARE', historicalNote: "Pocket watches were status symbols and essential timekeeping." },
    { id: 'monocle', name: "Monocle with Gold Chain", description: "For reading fine print. Makes you look distinguished, or absurd.", type: 'TOOL', rarity: 'UNCOMMON' },
    { id: 'kodak_camera', name: "Kodak Box Camera", description: "You press the button, we do the rest.' Loaded with film.", type: 'TOOL', rarity: 'RARE', historicalNote: "Kodak's first camera launched in 1888 with the slogan 'You press the button, we do the rest.'" },
    { id: 'compass', name: "Brass Compass", description: "Maritime grade. Points resolutely north despite the iron tower's interference.", type: 'TOOL', rarity: 'UNCOMMON' },
    { id: 'magnifying_glass', name: "Magnifying Glass", description: "For scrutinizing details. The glass is slightly scratched.", type: 'TOOL', rarity: 'COMMON' },
    { id: 'thermometer', name: "Mercury Thermometer", description: "Indicates the temperature is unseasonably warm.", type: 'TOOL', rarity: 'COMMON', historicalNote: "Mercury thermometers were standard scientific instruments." }
  ],

  // Personal Effects & Fashion
  PERSONAL: [
    { id: 'dried_rose', name: "Pressed Rose", description: "Kept in a pocket. Sentimental value unclear even to yourself.", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'lozenge_tin', name: "Smith Brothers Lozenge Tin", description: "For the throat. The tin is decorated with the brothers' bearded faces.", type: 'CONSUMABLE', rarity: 'COMMON', historicalNote: "Smith Brothers cough drops were invented in 1847 and widely available." },
    { id: 'handkerchief', name: "Irish Linen Handkerchief", description: "Monogrammed. Slightly damp from the humidity.", type: 'PERSONAL', rarity: 'COMMON' },
    { id: 'gloves_kid', name: "Kid Leather Gloves", description: "Parisian-made. Butter-soft. Too fine for ordinary use.", type: 'PERSONAL', rarity: 'UNCOMMON', historicalNote: "Gloves were essential accessories; quality indicated social status." },
    { id: 'walking_stick', name: "Malacca Walking Stick", description: "Ivory handle carved as a lion's head. Good balance.", type: 'PERSONAL', rarity: 'UNCOMMON', historicalNote: "Walking sticks were both functional and fashionable for gentlemen." },
    { id: 'cigarette_case', name: "Silver Cigarette Case", description: "Engraved with Art Nouveau designs. Contains Turkish cigarettes.", type: 'PERSONAL', rarity: 'RARE', historicalNote: "Art Nouveau emerged in the 1880s; cigarette cases were status symbols." },
    { id: 'snuff_box', name: "Tortoiseshell Snuff Box", description: "Though you don't take snuff. A gift from an Italian count.", type: 'CURIOSITY', rarity: 'RARE' },
    { id: 'cufflinks', name: "Gold Cufflinks", description: "Each bears a tiny cameo. Fiddly to fasten.", type: 'PERSONAL', rarity: 'UNCOMMON' }
  ],

  // Exposition Souvenirs & Curiosities
  SOUVENIRS: [
    { id: 'tower_miniature', name: "Miniature Eiffel Tower", description: "Brass, 6 inches tall. Mass-produced. Still somehow charming.", type: 'CURIOSITY', rarity: 'COMMON', historicalNote: "Eiffel Tower souvenirs sold in the millions at the fair." },
    { id: 'expo_medal', name: "Exposition Medal (Bronze)", description: "Commemorative. Depicts the Galerie des Machines.", type: 'CURIOSITY', rarity: 'UNCOMMON', historicalNote: "Official medals were struck for exhibitors and visitors." },
    { id: 'buffalo_bill_poster', name: "Buffalo Bill Wild West Show Poster", description: "Lurid colors. Cowboys and Indians. Performed adjacent to the fair.", type: 'CURIOSITY', rarity: 'UNCOMMON', historicalNote: "Buffalo Bill's show ran near the fairgrounds, hugely popular with Parisians." },
    { id: 'phonograph_cylinder', name: "Edison Phonograph Cylinder", description: "A recording of a Parisian street vendor. The sound is tinny but miraculous.", type: 'CURIOSITY', rarity: 'RARE', historicalNote: "Edison's phonograph was a major attraction at the 1889 fair." },
    { id: 'egyptian_scarab', name: "Egyptian Scarab Amulet", description: "From the Cairo Street exhibit. Likely fake, but appealing.", type: 'CURIOSITY', rarity: 'UNCOMMON', historicalNote: "The Rue du Caire was a popular attraction featuring recreated Egyptian architecture." },
    { id: 'javanese_puppet', name: "Javanese Shadow Puppet", description: "Intricate leather cutwork. From the Dutch East Indies pavilion.", type: 'CURIOSITY', rarity: 'RARE', historicalNote: "Colonial exhibitions showcased cultures from European empires." },
    { id: 'postcard_tower', name: "Hand-Tinted Postcard", description: "The Tower at sunset. Colors applied with delicate brushwork.", type: 'CURIOSITY', rarity: 'COMMON', historicalNote: "Postcards became hugely popular in the 1880s." }
  ],

  // Food & Drink
  CONSUMABLES: [
    { id: 'absinthe_miniature', name: "Miniature Absinthe Bottle", description: "La Fée Verte. The green fairy. Probably unwise.", type: 'CONSUMABLE', rarity: 'UNCOMMON', historicalNote: "Absinthe was the drink of choice for Parisian artists and writers." },
    { id: 'chocolate_menier', name: "Menier Chocolate Bar", description: "From the chocolate pavilion. Already melting in your pocket.", type: 'CONSUMABLE', rarity: 'COMMON', historicalNote: "Menier had a major exhibition building shaped like a chocolate bar." },
    { id: 'cognac_flask', name: "Flask of Cognac", description: "Hennessy. For medicinal purposes, you tell yourself.", type: 'CONSUMABLE', rarity: 'UNCOMMON', historicalNote: "French cognac was world-renowned; hip flasks were common." },
    { id: 'cafe_token', name: "Café Token", description: "Good for one coffee at the Galerie des Machines café.", type: 'CONSUMABLE', rarity: 'COMMON' },
    { id: 'champagne_cork', name: "Champagne Cork", description: "From a celebratory bottle of Moët. The mark is still visible.", type: 'CURIOSITY', rarity: 'COMMON', historicalNote: "Moët & Chandon champagne was served throughout the fair." }
  ],

  // Technology & Scientific Items
  TECHNOLOGY: [
    { id: 'electric_light_bulb', name: "Edison Light Bulb", description: "Unused. Fragile glass. Represents the future, supposedly.", type: 'CURIOSITY', rarity: 'RARE', historicalNote: "Edison's electric lights illuminated the fair, marking a technological revolution." },
    { id: 'telephone_earpiece', name: "Bell Telephone Earpiece", description: "Detached from a display model. Fascinating and slightly forbidden.", type: 'CURIOSITY', rarity: 'RARE', historicalNote: "The telephone was demonstrated at the fair as a modern marvel." },
    { id: 'stereoscope_card', name: "Stereoscope Card", description: "3D image of the Tower construction. Almost dizzying to view.", type: 'CURIOSITY', rarity: 'UNCOMMON', historicalNote: "Stereoscopes were popular home entertainment in the 1880s." },
    { id: 'blueprint_fragment', name: "Eiffel Tower Blueprint Fragment", description: "Architectural detail. How did you acquire this?", type: 'DOCUMENT', rarity: 'RARE', historicalNote: "Eiffel's engineering drawings were marvels of precision." },
    { id: 'dynamo_diagram', name: "Electrical Dynamo Diagram", description: "From the Gallery of Machines. You barely understand it.", type: 'DOCUMENT', rarity: 'UNCOMMON', historicalNote: "Steam-powered dynamos at the fair generated electricity for exhibits." }
  ],

  // Art & Culture
  ART: [
    { id: 'monet_print', name: "Monet Print (Reproduction)", description: "A haystack at sunset. The colors seem to shimmer.", type: 'ART', rarity: 'RARE', historicalNote: "Claude Monet was developing his haystack series in 1889." },
    { id: 'art_nouveau_brooch', name: "Art Nouveau Brooch", description: "Silver with enamel. Depicts a dragonfly. Alphonse Mucha's influence.", type: 'ART', rarity: 'RARE', historicalNote: "Art Nouveau was emerging as the dominant decorative style." },
    { id: 'playbill_comedie', name: "Comédie-Française Playbill", description: "Tonight's performance: Molière. You might attend.", type: 'DOCUMENT', rarity: 'COMMON', historicalNote: "The Comédie-Française was and remains France's premier theater." },
    { id: 'rodin_postcard', name: "Rodin Sculpture Postcard", description: "The Burghers of Calais. Dark and powerful.", type: 'CURIOSITY', rarity: 'UNCOMMON', historicalNote: "Rodin completed this sculpture in 1889." },
    { id: 'sheet_music', name: "Sheet Music - Valse", description: "A popular waltz. The edges are torn from use.", type: 'DOCUMENT', rarity: 'COMMON', historicalNote: "The waltz was the most fashionable dance of the era." }
  ],

  // Strange & Mysterious
  MYSTERIOUS: [
    { id: 'fortune_card', name: "Fortune Teller's Card", description: "The Tower. Drawn at a carnival booth. The symbolism is unclear.", type: 'CURIOSITY', rarity: 'UNCOMMON' },
    { id: 'skeleton_key', name: "Skeleton Key", description: "Brass. Fits no lock you've tried. Where did this come from?", type: 'CURIOSITY', rarity: 'RARE' },
    { id: 'pressed_flower', name: "Exotic Pressed Flower", description: "From the Colonial Gardens. Species unknown. Faintly fragrant.", type: 'CURIOSITY', rarity: 'UNCOMMON' },
    { id: 'masquerade_mask', name: "Venetian Carnival Mask", description: "Half-face. White porcelain with gold trim. Slightly unsettling.", type: 'CURIOSITY', rarity: 'RARE' },
    { id: 'ancient_coin', name: "Roman Coin (Authentic?)", description: "Sold by a questionable antiquarian. Feels ancient.", type: 'CURIOSITY', rarity: 'RARE', historicalNote: "Paris had many antiquarians; authenticity was always questionable." }
  ]
};

// Flatten all items into a single array for easy access
export const ALL_HISTORICAL_ITEMS: Item[] = Object.values(HISTORICAL_ITEMS).flat();

// Helper to get random items by category
export const getRandomItemsByCategory = (category: keyof typeof HISTORICAL_ITEMS, count: number = 1): Item[] => {
  const items = HISTORICAL_ITEMS[category] || [];
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Helper to get random items by rarity
export const getRandomItemsByRarity = (rarity: 'COMMON' | 'UNCOMMON' | 'RARE', count: number = 1): Item[] => {
  const items = ALL_HISTORICAL_ITEMS.filter(item => item.rarity === rarity);
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Helper to get completely random items
export const getRandomItems = (count: number = 1): Item[] => {
  const shuffled = [...ALL_HISTORICAL_ITEMS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
