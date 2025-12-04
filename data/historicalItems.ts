import { Item } from '../types';

// Historically accurate items from 1889 Paris World's Fair era
// All items researched for accuracy to the period

export const HISTORICAL_ITEMS: Record<string, Item[]> = {
  // Documents & Literary Items
  DOCUMENTS: [
    { id: 'letter_brother', name: "Letter from William James", description: "Your brother writes about 'Stream of Consciousness'. It gives you a headache.", type: 'DOCUMENT', rarity: 'COMMON', historicalNote: "William James pioneered psychology and philosophy in the 1880s." },
    { id: 'letter_alice', name: "Letter from Alice James", description: "News from home. She is unwell, as usual.", type: 'DOCUMENT', rarity: 'COMMON', historicalNote: "Henry's sister Alice suffered from nervous ailments throughout her life." },
    
    { id: 'expo_guide', name: "Exposition Universelle Guide", description: "A map of the grounds. Pages are already dog-eared and crumbling.", type: 'DOCUMENT', rarity: 'COMMON', historicalNote: "Official guidebooks were essential at the massive 1889 fair." },
    { id: 'figaro', name: "Le Figaro (May 6, 1889)", description: "The Tower opening coverage. Maupassant's protests are quoted.", type: 'DOCUMENT', rarity: 'UNCOMMON', historicalNote: "Guy de Maupassant famously ate lunch in the Eiffel Tower daily to avoid seeing it." },
    { id: 'revue_deux', name: "Revue des Deux Mondes", description: "Contains your own serialized story. The prose seems labored in retrospect.", type: 'DOCUMENT', rarity: 'RARE', historicalNote: "Henry James published extensively in this prestigious French journal." },
    { id: 'ticket_panorama', name: "Panorama Ticket Stub", description: "Entry to the Battle of Rezonville circular painting.", type: 'DOCUMENT', rarity: 'COMMON', historicalNote: "Panoramas were immensely popular at the fair, depicting historical battles." },
    { id: 'carte_visite', name: "Carte de Visite", description: "Your visiting card. The engraving is elegant but the name feels heavy.", type: 'DOCUMENT', rarity: 'COMMON', historicalNote: "Calling cards were essential social currency in 19th century society." },
    
    { id: 'telegraph_message', name: "Telegraph from Publisher", description: "Macmillan inquires about your deadline. Aggressive in tone.", type: 'DOCUMENT', rarity: 'UNCOMMON', historicalNote: "The telegraph revolutionized international publishing in the 1880s." }
  ],

  // Tools & Instruments
  TOOLS: [
    { id: 'opera_glasses', name: "Opera Glasses", description: "For observing people from a safe distance. Brass fittings, mother-of-pearl inlay.", type: 'TOOL', rarity: 'UNCOMMON', historicalNote: "Essential for theater-going and discreet social observation." },
    { id: 'fountain_pen', name: "Waterman Fountain Pen", description: "Ink stains on the barrel. Reliable. American-made.", type: 'TOOL', rarity: 'COMMON', historicalNote: "Lewis Waterman's fountain pen (1884) revolutionized writing." },
    { id: 'pocket_watch', name: "Gold Pocket Watch", description: "Swiss movement. Runs slightly fast. Engraved with initials 'H.J.'", type: 'TOOL', rarity: 'RARE', historicalNote: "Pocket watches were status symbols and essential timekeeping." },
  

    { id: 'compass', name: "Brass Compass", description: "Maritime grade. Points resolutely north despite the iron tower's interference.", type: 'TOOL', rarity: 'UNCOMMON' },
    { id: 'magnifying_glass', name: "Magnifying Glass", description: "For scrutinizing details. The glass is slightly scratched.", type: 'TOOL', rarity: 'COMMON' },
    
  ],

  // Personal Effects & Fashion
  PERSONAL: [
    { id: 'dried_rose', name: "Pressed Rose", description: "Kept in a pocket. Sentimental value unclear even to yourself.", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'lozenge_tin', name: "Smith Brothers Lozenge Tin", description: "For the throat. The tin is decorated with the brothers' bearded faces.", type: 'CONSUMABLE', rarity: 'COMMON', historicalNote: "Smith Brothers cough drops were invented in 1847 and widely available." },
    { id: 'handkerchief', name: "Irish Linen Handkerchief", description: "Monogrammed. Slightly damp from the humidity.", type: 'PERSONAL', rarity: 'COMMON' },
    { id: 'gloves_kid', name: "Kid Leather Gloves", description: "Parisian-made. Butter-soft. Too fine for ordinary use.", type: 'PERSONAL', rarity: 'UNCOMMON', historicalNote: "Gloves were essential accessories; quality indicated social status." },
    { id: 'walking_stick', name: "Malacca Walking Stick", description: "Ivory handle carved as a lion's head. Good balance.", type: 'PERSONAL', rarity: 'UNCOMMON', historicalNote: "Walking sticks were both functional and fashionable for gentlemen." },
    { id: 'cigarette_case', name: "Silver Cigarette Case", description: "Engraved with Art Nouveau designs. Contains Turkish cigarettes.", type: 'PERSONAL', rarity: 'RARE', historicalNote: "Art Nouveau emerged in the 1880s; cigarette cases were status symbols." },
    
    { id: 'cufflinks', name: "Gold Cufflinks", description: "Each bears a tiny cameo. Fiddly to fasten.", type: 'PERSONAL', rarity: 'UNCOMMON' }
  ],

  // Exposition Souvenirs & Curiosities
  SOUVENIRS: [
    { id: 'tower_miniature', name: "Miniature Eiffel Tower", description: "Brass, 6 inches tall. Mass-produced. Still somehow charming.", type: 'CURIOSITY', rarity: 'COMMON', historicalNote: "Eiffel Tower souvenirs sold in the millions at the fair." },
    { id: 'expo_medal', name: "Exposition Medal (Bronze)", description: "Commemorative. Depicts the Galerie des Machines.", type: 'CURIOSITY', rarity: 'UNCOMMON', historicalNote: "Official medals were struck for exhibitors and visitors." },
    { id: 'buffalo_bill_poster', name: "Buffalo Bill Wild West Show Poster", description: "Lurid colors. Cowboys and Indians. Performed adjacent to the fair.", type: 'CURIOSITY', rarity: 'UNCOMMON', historicalNote: "Buffalo Bill's show ran near the fairgrounds, hugely popular with Parisians." },
    { id: 'phonograph_cylinder', name: "Edison Phonograph Cylinder", description: "A recording of a Parisian street vendor. The sound is tinny but miraculous.", type: 'CURIOSITY', rarity: 'RARE', historicalNote: "Edison's phonograph was a major attraction at the 1889 fair." },
    { id: 'egyptian_scarab', name: "Egyptian Scarab Amulet", description: "From the Cairo Street exhibit. Obviously fake, but appealing.", type: 'CURIOSITY', rarity: 'UNCOMMON', historicalNote: "The Rue du Caire was a popular attraction featuring recreated Egyptian architecture." },
    { id: 'javanese_puppet', name: "Javanese Shadow Puppet", description: "Intricate leather cutwork. From the Dutch East Indies pavilion.", type: 'CURIOSITY', rarity: 'RARE', historicalNote: "Colonial exhibitions showcased cultures from European empires." },
    { id: 'postcard_tower', name: "Hand-Tinted Postcard", description: "The Tower at sunset. Colors applied with delicate brushwork.", type: 'CURIOSITY', rarity: 'COMMON', historicalNote: "Postcards became hugely popular in the 1880s." }
  ],

  // Food & Drink
  CONSUMABLES: [
    { id: 'absinthe_miniature', name: "Miniature Absinthe Bottle", description: "La Fée Verte. The green fairy. Probably unwise.", type: 'CONSUMABLE', rarity: 'UNCOMMON', historicalNote: "Absinthe was the drink of choice for Parisian artists and writers." },
    { id: 'chocolate_menier', name: "Menier Chocolate Bar", description: "From the chocolate pavilion. Already melting in your pocket.", type: 'CONSUMABLE', rarity: 'COMMON', historicalNote: "Menier had a major exhibition building shaped like a chocolate bar." },
    { id: 'cognac_flask', name: "Flask of Cognac", description: "Hennessy. For medicinal purposes, you tell yourself.", type: 'CONSUMABLE', rarity: 'UNCOMMON', historicalNote: "French cognac was world-renowned; hip flasks were common." },
    
    
  ],

  // Technology & Scientific Items
  TECHNOLOGY: [
    { id: 'electric_light_bulb', name: "Edison Light Bulb", description: "Unused. Fragile glass. Represents the future, supposedly.", type: 'CURIOSITY', rarity: 'RARE', historicalNote: "Edison's electric lights illuminated the fair, marking a technological revolution." },
    { id: 'telephone_earpiece', name: "Bell Telephone Earpiece", description: "Detached from a display model. Fascinating and slightly forbidden.", type: 'CURIOSITY', rarity: 'RARE', historicalNote: "The telephone was demonstrated at the fair as a modern marvel." },
    { id: 'stereoscope_card', name: "Stereoscope Card", description: "3D image of the Tower construction. Almost dizzying to view.", type: 'CURIOSITY', rarity: 'UNCOMMON', historicalNote: "Stereoscopes were popular home entertainment in the 1880s." },
   
    { id: 'dynamo_diagram', name: "Electrical Dynamo Diagram", description: "From the Gallery of Machines. You barely understand it.", type: 'DOCUMENT', rarity: 'UNCOMMON', historicalNote: "Steam-powered dynamos at the fair generated electricity for exhibits." }
  ],

  // Art & Culture
  ART: [
   
    { id: 'art_nouveau_brooch', name: "Art Nouveau Brooch", description: "Silver with enamel. Depicts a dragonfly. Alphonse Mucha's influence.", type: 'ART', rarity: 'RARE', historicalNote: "Art Nouveau was emerging as the dominant decorative style." },
    { id: 'playbill_comedie', name: "Comédie-Française Playbill", description: "Tonight's performance: Molière. You might attend.", type: 'DOCUMENT', rarity: 'COMMON', historicalNote: "The Comédie-Française was and remains France's premier theater." },
    { id: 'rodin_postcard', name: "Rodin Sculpture Postcard", description: "The Burghers of Calais. Dark and powerful.", type: 'CURIOSITY', rarity: 'UNCOMMON', historicalNote: "Rodin completed this sculpture in 1889." },
    { id: 'sheet_music', name: "Sheet Music - Valse", description: "A popular waltz. The edges are torn from use.", type: 'DOCUMENT', rarity: 'COMMON', historicalNote: "The waltz was the most fashionable dance of the era." }
  ],

  // Strange & Mysterious
  MYSTERIOUS: [
    { id: 'fortune_card', name: "Fortune Teller's Card", description: "The Tower. Drawn at a carnival booth. The symbolism is unclear.", type: 'CURIOSITY', rarity: 'UNCOMMON' },
    { id: 'skeleton_key', name: "Skeleton Key", description: "Brass. Fits no lock you've tried. Where did this come from?", type: 'CURIOSITY', rarity: 'RARE' },
   
    { id: 'masquerade_mask', name: "Venetian Carnival Mask", description: "Half-face. White porcelain with gold trim. Slightly unsettling.", type: 'CURIOSITY', rarity: 'RARE' },
    
  ]
};

// Biome-specific item pools
// Items more likely to be found in specific biomes
export const BIOME_ITEMS: Record<string, Item[]> = {
  // SOUK - Middle Eastern bazaar items
  SOUK: [
    { id: 'spice_bag', name: "Bag of Spices", description: "A small linen pouch filled with saffron, cumin, and mysterious red powder. The scent is intoxicating.", type: 'CONSUMABLE', rarity: 'COMMON', historicalNote: "The Rue du Caire's spice merchants brought authentic goods from Egypt." },
    { id: 'brass_lamp', name: "Small Brass Lamp", description: "A Cairene oil lamp with pierced geometric patterns. When lit, it casts star-shaped shadows.", type: 'CURIOSITY', rarity: 'UNCOMMON', historicalNote: "Brass lamps were among the most popular souvenirs from the Rue du Caire." },
    { id: 'turkish_coffee', name: "Packet of Turkish Coffee", description: "Finely ground, dark as night. The vendor insisted on its medicinal properties.", type: 'CONSUMABLE', rarity: 'COMMON' },
    { id: 'kilim_fragment', name: "Kilim Rug Fragment", description: "A sample cutting from a larger carpet. The geometric patterns are hypnotic.", type: 'CURIOSITY', rarity: 'COMMON', historicalNote: "Carpet sellers would give samples to entice purchases." },
    { id: 'evil_eye', name: "Evil Eye Amulet", description: "A blue glass bead meant to ward off misfortune. You don't believe in such things. Probably.", type: 'CURIOSITY', rarity: 'COMMON', historicalNote: "The nazar or evil eye is a protective talisman throughout the Middle East." },
    { id: 'hookah_mouthpiece', name: "Ivory Hookah Mouthpiece", description: "Carved with arabesques. Smells faintly of apple tobacco.", type: 'CURIOSITY', rarity: 'UNCOMMON' },
    { id: 'henna_powder', name: "Henna Powder", description: "For decorating hands in the Moorish fashion. The ladies at the fair find it scandalous.", type: 'CONSUMABLE', rarity: 'COMMON' },
    { id: 'copper_tray', name: "Engraved Copper Tray", description: "Hammered by a craftsman before your eyes. The geometric patterns are flawless.", type: 'CURIOSITY', rarity: 'UNCOMMON', historicalNote: "Coppersmith demonstrations were a major attraction at the Rue du Caire." },
    { id: 'arabic_manuscript', name: "Arabic Manuscript Page", description: "Calligraphy so elegant it seems to dance. You cannot read a word.", type: 'DOCUMENT', rarity: 'RARE' },
    { id: 'belly_dance_zills', name: "Finger Cymbals", description: "Brass zills from a dancer's costume. They chime with surprising clarity.", type: 'CURIOSITY', rarity: 'UNCOMMON', historicalNote: "The 'danse du ventre' scandalized and fascinated Parisian audiences." }
  ],

  // CAFE & ESPLANADE - Letters, newspapers, social items
  CAFE: [
    { id: 'abandoned_letter', name: "Abandoned Love Letter", description: "Left on a café table. The handwriting is feminine, the sentiments... indiscreet.", type: 'DOCUMENT', rarity: 'UNCOMMON' },
    { id: 'cafe_receipt', name: "Café Receipt", description: "Two absinthes, one café crème. Someone had a long afternoon.", type: 'DOCUMENT', rarity: 'COMMON' },
    { id: 'discarded_poem', name: "Discarded Poem", description: "Crumpled verses about the Tower. The imagery is overwrought.", type: 'DOCUMENT', rarity: 'COMMON' },
    { id: 'sugar_cube', name: "Sugar Cube", description: "Pilfered from the café. For your pocket, for later.", type: 'CONSUMABLE', rarity: 'COMMON' },
    { id: 'matchbook', name: "Café Matchbook", description: "From Café de la Paix. The matches are damp.", type: 'CONSUMABLE', rarity: 'COMMON' },
    { id: 'calling_card_stranger', name: "Stranger's Calling Card", description: "Left behind by mistake. A baron from Prague, apparently.", type: 'DOCUMENT', rarity: 'UNCOMMON' },
    { id: 'lipstick_handkerchief', name: "Stained Handkerchief", description: "Lipstick marks and a faint perfume. A story you'll never know.", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'racing_form', name: "Racing Form", description: "Longchamp results. Someone lost badly on the third race.", type: 'DOCUMENT', rarity: 'COMMON', historicalNote: "Horse racing at Longchamp was enormously popular in 1889 Paris." }
  ],

  ESPLANADE: [
    { id: 'dropped_letter', name: "Dropped Letter", description: "Addressed to Monsieur R—. The seal is broken; the contents are mundane.", type: 'DOCUMENT', rarity: 'COMMON' },
    { id: 'picnic_napkin', name: "Monogrammed Napkin", description: "Left from a bourgeois picnic. Fine linen, embroidered initials.", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'childs_hoop', name: "Child's Hoop", description: "Abandoned by its young owner. Good for rolling, if you had a stick.", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'lost_glove', name: "Lost Kid Glove", description: "Size suggests a lady's hand. Very fine quality. The other is somewhere.", type: 'PERSONAL', rarity: 'COMMON' },
    { id: 'balloon_string', name: "Balloon String", description: "The balloon itself is long gone, escaped to the clouds.", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'newspaper_scrap', name: "Newspaper Scrap", description: "Part of an article about anarchist threats. The rest is missing.", type: 'DOCUMENT', rarity: 'UNCOMMON', historicalNote: "Anarchist activity was a genuine concern in 1889 Paris." },
    { id: 'flower_from_bouquet', name: "Fallen Flower", description: "A red rose, dropped from someone's bouquet. Still fresh.", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'torn_photograph', name: "Torn Photograph", description: "Half a face, half a mystery. The other half is lost forever.", type: 'CURIOSITY', rarity: 'UNCOMMON' }
  ],

  // VILLAGE - Colonial exhibition items (Senegalese, Javanese, etc.)
  VILLAGE: [
    { id: 'woven_bracelet', name: "Woven Bracelet", description: "Made by Senegalese craftspeople. Simple but beautiful.", type: 'CURIOSITY', rarity: 'COMMON', historicalNote: "Colonial villages displayed living craftspeople at work." },
    { id: 'kola_nut', name: "Kola Nut", description: "A gift from a villager. Bitter but stimulating when chewed.", type: 'CONSUMABLE', rarity: 'COMMON', historicalNote: "Kola nuts were used as a stimulant throughout West Africa." },
    { id: 'carved_figure', name: "Small Carved Figure", description: "Wooden, vaguely humanoid. Its meaning is opaque to you.", type: 'CURIOSITY', rarity: 'UNCOMMON' },
    { id: 'palm_leaf_fan', name: "Palm Leaf Fan", description: "Woven with skill. Surprisingly effective against the heat.", type: 'TOOL', rarity: 'COMMON' },
    { id: 'batik_cloth', name: "Batik Cloth Sample", description: "From the Javanese village. The wax-resist patterns are intricate.", type: 'CURIOSITY', rarity: 'UNCOMMON', historicalNote: "Javanese batik fascinated European visitors." },
    { id: 'gamelan_fragment', name: "Broken Gamelan Key", description: "Bronze, from the Indonesian orchestra. The tone when struck is haunting.", type: 'CURIOSITY', rarity: 'RARE' },
    { id: 'betel_leaves', name: "Betel Leaves", description: "For chewing with areca nut. You've seen the villagers use them.", type: 'CONSUMABLE', rarity: 'COMMON' }
  ],

  // GALERIE - Machinery and technology items
  GALERIE: [
    { id: 'bolt_nut', name: "Large Iron Bolt", description: "Fallen from one of the great machines. Surprisingly heavy.", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'gear_fragment', name: "Broken Gear Tooth", description: "Brass, precision-machined. A tiny piece of the industrial age.", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'oil_rag', name: "Machine Oil Rag", description: "Stained with grease. The smell of industry.", type: 'CONSUMABLE', rarity: 'COMMON' },
    { id: 'technical_drawing', name: "Technical Drawing", description: "Specifications for a steam valve. Beautifully precise.", type: 'DOCUMENT', rarity: 'UNCOMMON' },
    { id: 'wire_sample', name: "Copper Wire Sample", description: "From the electrical exhibits. The future in a coil.", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'exhibitor_badge', name: "Exhibitor's Badge", description: "Lost by a German engineer. It might get you into restricted areas.", type: 'DOCUMENT', rarity: 'RARE' }
  ],

  // GARDEN - Natural items
  GARDEN: [
    { id: 'fallen_chestnut', name: "Horse Chestnut", description: "Glossy and brown, still in its spiky case. Good luck, supposedly.", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'feather', name: "Peacock Feather", description: "From the ornamental gardens. The eye pattern watches you.", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'pressed_leaf', name: "Pressed Plane Tree Leaf", description: "Fallen from the trees lining the promenade. Paris in autumn.", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'snail_shell', name: "Empty Snail Shell", description: "Spiral perfection. The previous tenant has moved on.", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'rose_hip', name: "Rose Hip", description: "From the formal gardens. Makes a passable tea, they say.", type: 'CONSUMABLE', rarity: 'COMMON' }
  ],

  // SALON - Art and cultural items
  SALON: [
    { id: 'exhibition_catalog', name: "Exhibition Catalog Page", description: "Torn from the official guide. Lists paintings you haven't seen.", type: 'DOCUMENT', rarity: 'COMMON' },
    { id: 'paint_chip', name: "Chip of Gilt", description: "Flaked from an ornate frame. Real gold, or brass?", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'velvet_tassel', name: "Velvet Rope Tassel", description: "Detached from a barrier. Plush and slightly dusty.", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'lorgnette_lens', name: "Loose Lorgnette Lens", description: "Fallen from a lady's opera glasses. One side of clarity.", type: 'TOOL', rarity: 'UNCOMMON' },
    { id: 'diplomatic_seal', name: "Wax Seal Fragment", description: "From an embassy. The crest is partially visible.", type: 'CURIOSITY', rarity: 'RARE' }
  ],

  // TOWER - Eiffel Tower specific items
  TOWER_BASE: [
    { id: 'rivet', name: "Eiffel Tower Rivet", description: "One of 2.5 million. Somehow this one ended up in your pocket.", type: 'CURIOSITY', rarity: 'COMMON', historicalNote: "The tower used 2,500,000 rivets in its construction." },
    { id: 'iron_filing', name: "Iron Filings", description: "Scraped from the tower's leg. The taste of industry.", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'elevator_ticket', name: "Used Elevator Ticket", description: "Good for one ascent. Already punched.", type: 'DOCUMENT', rarity: 'COMMON' },
    { id: 'worker_cap', name: "Worker's Cap", description: "Left behind by a rigger. Sweat-stained but sturdy.", type: 'PERSONAL', rarity: 'UNCOMMON' }
  ],

  TOWER_LEVEL: [
    { id: 'wind_poem', name: "Windblown Poem", description: "Verses about vertigo, snatched from someone's hand by the wind.", type: 'DOCUMENT', rarity: 'UNCOMMON' },
    { id: 'binocular_cap', name: "Telescope Cap", description: "Lens cover from the observation telescopes. Someone will miss this.", type: 'CURIOSITY', rarity: 'COMMON' },
    { id: 'vertigo_note', name: "Scribbled Note", description: "'I cannot look down.' Written in a shaking hand.", type: 'DOCUMENT', rarity: 'COMMON' }
  ]
};

// Flatten all items into a single array for easy access
export const ALL_HISTORICAL_ITEMS: Item[] = Object.values(HISTORICAL_ITEMS).flat();
export const ALL_BIOME_ITEMS: Item[] = Object.values(BIOME_ITEMS).flat();

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

// Helper to get random items by biome
// 70% chance of biome-specific item, 30% chance of general item
export const getRandomItemsByBiome = (biome: string, count: number = 1): Item[] => {
  const results: Item[] = [];

  // Get biome-specific items if they exist
  const biomeItems = BIOME_ITEMS[biome] || [];

  // Also check for related biomes (e.g., TOWER_PLATFORM should also use TOWER_LEVEL items)
  let relatedBiomeItems: Item[] = [];
  if (biome.startsWith('TOWER_')) {
    relatedBiomeItems = [...(BIOME_ITEMS['TOWER_BASE'] || []), ...(BIOME_ITEMS['TOWER_LEVEL'] || [])];
  }

  const allBiomeItems = [...biomeItems, ...relatedBiomeItems];

  for (let i = 0; i < count; i++) {
    // 70% chance of biome-specific item if available
    if (allBiomeItems.length > 0 && Math.random() < 0.7) {
      const shuffled = [...allBiomeItems].sort(() => Math.random() - 0.5);
      const item = shuffled[0];
      // Avoid duplicates
      if (!results.find(r => r.id === item.id)) {
        results.push(item);
      } else {
        // Fallback to general items
        const generalShuffled = [...ALL_HISTORICAL_ITEMS].sort(() => Math.random() - 0.5);
        const generalItem = generalShuffled.find(gi => !results.find(r => r.id === gi.id));
        if (generalItem) results.push(generalItem);
      }
    } else {
      // 30% chance of general item
      const shuffled = [...ALL_HISTORICAL_ITEMS].sort(() => Math.random() - 0.5);
      const item = shuffled.find(i => !results.find(r => r.id === i.id));
      if (item) results.push(item);
    }
  }

  return results;
};

// Henry James starting inventory - curated items appropriate for the character
// Always includes: fountain_pen, revue_deux
// Plus 3 random items from the allowed pool
export const getHenryJamesStartingInventory = (): Item[] => {
  // Items Henry James always starts with
  const alwaysHaveIds = ['fountain_pen', 'revue_deux'];

  // Pool of items to randomly select 3 from
  const optionalPoolIds = [
    'letter_brother',
    'letter_alice',
    'expo_guide',
    'carte_visite',
    'pocket_watch',
    'lozenge_tin',
    'playbill_comedie'
  ];

  const inventory: Item[] = [];

  // Add the items Henry always has
  for (const id of alwaysHaveIds) {
    const item = ALL_HISTORICAL_ITEMS.find(i => i.id === id);
    if (item) inventory.push(item);
  }

  // Shuffle and pick 3 random items from the optional pool
  const shuffledPool = [...optionalPoolIds].sort(() => Math.random() - 0.5);
  const selectedOptionalIds = shuffledPool.slice(0, 3);

  for (const id of selectedOptionalIds) {
    const item = ALL_HISTORICAL_ITEMS.find(i => i.id === id);
    if (item) inventory.push(item);
  }

  return inventory;
};
