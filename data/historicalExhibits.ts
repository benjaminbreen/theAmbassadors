// Historical Exhibits Data for the 1889 Paris Exposition Universelle
// Based on historical research from primary sources and museum archives
// Sources: Library of Congress, Gallica BnF, World Fair archives

// Types for exhibit content
export interface ExhibitItem {
    name: string;
    description: string;
    type: 'statue' | 'display' | 'machinery' | 'artifact' | 'diorama' | 'artwork' | 'specimen';
}

export interface LocationExhibits {
    statues: string[];           // Names for statue tiles
    displays: string[];          // Names for display case tiles
    artifacts: string[];         // Specific artifacts that can be found
    atmosphere: string;          // Description for the narrator
    historicalNote: string;      // Educational context
}

// ============================================
// LOCATION-SPECIFIC EXHIBIT DATA
// ============================================

export const LOCATION_EXHIBITS: Record<string, LocationExhibits> = {
    // === ETHNOGRAPHIC & ANTHROPOLOGICAL ===
    "Musée d'Ethnographie": {
        statues: [
            "Plaster Cast of Cro-Magnon Man",
            "Model of Neanderthal Hunter",
            "Bronze of African Chieftain",
            "Figure of Patagonian Native",
            "Reconstruction of Prehistoric Woman",
            "Model of Fuegian in Traditional Dress"
        ],
        displays: [
            "Prehistoric Flint Tools from Dordogne",
            "Polynesian War Clubs and Paddles",
            "Collection of African Masks",
            "Inuit Harpoons and Kayak Model",
            "Aboriginal Boomerangs and Shields",
            "Amazonian Blowguns and Darts",
            "Human Skulls: Comparative Anatomy",
            "Prehistoric Cave Bear Bones"
        ],
        artifacts: [
            "Authenticated Cro-Magnon skull",
            "Maori carved jade pendant",
            "Congolese ivory horn"
        ],
        atmosphere: "The musty smell of preserved specimens mingles with the leather of display cases. Gaslight flickers across dioramas of 'primitive' peoples.",
        historicalNote: "Director Ernest-Théodore Hamy arranged skulls in hierarchies of 'racial development'—a pseudoscientific framework that would later be cited to justify colonial violence. Many specimens were taken without consent from indigenous communities worldwide; some remain contested to this day."
    },

    "History of Habitation": {
        statues: [
            "Figure of Stone Age Hunter",
            "Egyptian Peasant at Work",
            "Greek Potter at Wheel",
            "Roman Legionnaire",
            "Medieval Peasant",
            "Renaissance Craftsman"
        ],
        displays: [
            "Prehistoric Cave Dwelling Model",
            "Egyptian Mudbrick House Interior",
            "Greek Atrium Reconstruction",
            "Roman Villa Mosaic Fragment",
            "Medieval Half-Timber Section",
            "Renaissance Italian Palazzo Model"
        ],
        artifacts: [
            "Authenticated neolithic pottery shard",
            "Roman oil lamp replica",
            "Medieval iron key"
        ],
        atmosphere: "Charles Garnier's remarkable exhibition walks visitors through the ages of human dwelling, from prehistoric caves to Renaissance palaces.",
        historicalNote: "Charles Garnier, architect of the Paris Opéra, spent four years constructing forty-four full-scale dwellings spanning from Paleolithic caves to Renaissance palazzos. The exhibit cost 800,000 francs and employed archaeologists, ethnographers, and over 200 craftsmen—yet its narrative of 'progress' pointedly excluded non-European civilizations from the timeline of advancement."
    },

    // === NATIONAL PAVILIONS ===
    "Japanese Pavilion": {
        statues: [
            "Bronze Buddha (Kamakura Style)",
            "Carved Nio Guardian Figure",
            "Porcelain Kannon Statue",
            "Lacquered Wood Samurai Figure"
        ],
        displays: [
            "Arita Porcelain Collection",
            "Cloisonné Enamel Vases",
            "Lacquerware Writing Box (Suzuribako)",
            "Silk Kimono with Gold Thread",
            "Ukiyo-e Prints by Hiroshige",
            "Netsuke Ivory Carvings",
            "Satsuma Ware Tea Service",
            "Japanese Bronze Mirror"
        ],
        artifacts: [
            "Meiji-era cloisonné vase",
            "Hand-painted silk fan",
            "Bonsai cultivation manual"
        ],
        atmosphere: "The scent of incense drifts from hidden censers. Visitors speak in hushed tones before the delicate screens and lacquerwork.",
        historicalNote: "Japan sent 1,700 crates of exhibits and constructed an elaborate pavilion designed by architect Kigo Kiyoyoshi. The Meiji government deliberately selected objects to project modernity alongside tradition—a calculated diplomatic effort. Van Gogh, Monet, and Toulouse-Lautrec were already deep in Japonisme; Siegfried Bing's gallery nearby would soon launch Art Nouveau."
    },

    "Chinese Pavilion": {
        statues: [
            "Porcelain Guanyin Figure",
            "Bronze Imperial Lion (Foo Dog)",
            "Jade Carved Immortal",
            "Terracotta Mandarin Figure"
        ],
        displays: [
            "Qing Dynasty Porcelain Vases",
            "Imperial Yellow Silk Robe",
            "Carved Jade Bi Disc",
            "Cloisonné Incense Burner",
            "Cantonese Export Lacquerware",
            "Chinese Tea Ceremony Set",
            "Carved Cinnabar Box",
            "Handscroll Landscape Painting"
        ],
        artifacts: [
            "Qing dynasty snuff bottle",
            "Authentic mandarin's button",
            "Pressed tea brick from Yunnan"
        ],
        atmosphere: "A mandarin in traditional dress explains the tea ceremony to curious visitors. The air carries the fragrance of jasmine.",
        historicalNote: "The Qing Dynasty's modest participation reflected its waning power; just fifty years earlier, the Opium Wars had humiliated Chinese sovereignty. The exhibit emphasized timeless craft traditions rather than modernization—unlike Japan's aggressive self-presentation—foreshadowing the dynasty's collapse in 1911."
    },

    "Egyptian Pavilion": {
        statues: [
            "Painted Mummy Case (Standing)",
            "Reproduction Sphinx Head",
            "Osiris Figure in Bronze",
            "Carved Basalt Pharaoh Bust"
        ],
        displays: [
            "Authentic Mummy Wrappings",
            "Canopic Jars (Set of Four)",
            "Scarab Beetle Amulets",
            "Hieroglyphic Papyrus Fragment",
            "Ushabti Funeral Figurines",
            "Ancient Egyptian Jewelry",
            "Scale Model of Pyramid Interior",
            "Khedive's Diplomatic Gifts"
        ],
        artifacts: [
            "Genuine scarab amulet",
            "Fragment of ancient papyrus",
            "Faience bead necklace"
        ],
        atmosphere: "Gaslight casts long shadows across painted sarcophagi. The weight of millennia presses down from hieroglyph-covered walls.",
        historicalNote: "Khedive Tewfik sent these treasures while British troops occupied his country following the 1882 bombardment of Alexandria. The French, who had deciphered hieroglyphics and built the Suez Canal, considered Egypt spiritually theirs—a claim reinforced by displaying pharaonic artifacts that would later be contested as looted cultural patrimony."
    },

    "Mexican Pavilion": {
        statues: [
            "Reproduction Aztec Sun Stone",
            "Feathered Serpent (Quetzalcoatl)",
            "Obsidian Aztec Warrior",
            "Mayan Chac Mool Figure"
        ],
        displays: [
            "Aztec Obsidian Sacrificial Knife",
            "Mayan Jade Death Mask",
            "Pre-Columbian Gold Ornaments",
            "Featherwork Shield Replica",
            "Codex Reproduction Pages",
            "Mexican Silver Filigree",
            "Pulque Vessel (Traditional)",
            "Oaxacan Black Pottery"
        ],
        artifacts: [
            "Authentic obsidian arrowhead",
            "Mexican silver peso (1889)",
            "Vanilla bean sample"
        ],
        atmosphere: "The pavilion combines archaeological grandeur with the silver filigree of modern Mexico. Pulque is offered to the adventurous.",
        historicalNote: "President Porfirio Díaz spent lavishly on the 'Aztec Palace' designed by Antonio Peñafiel, hoping to attract European investment. The regime simultaneously suppressed indigenous peoples while glorifying their ancestors—a contradiction not lost on critics. Within two decades, the Mexican Revolution would violently challenge Díaz's vision of 'progress.'"
    },

    "Persian Pavilion": {
        statues: [
            "Bronze Lion of Persepolis",
            "Marble Polo Player",
            "Carved Stone Lamassu Replica"
        ],
        displays: [
            "Isfahan Silk Carpet (12x8 feet)",
            "Qajar Dynasty Tilework Panel",
            "Persian Miniature Paintings",
            "Silver-Inlaid Brass Ewer",
            "Illuminated Shahnameh Page",
            "Rose Water Distillation Set",
            "Carved Wooden Screen (Mashrabiya)",
            "Persian Calligraphy Specimens"
        ],
        artifacts: [
            "Persian carpet fragment",
            "Rose attar in crystal vial",
            "Illuminated poetry page"
        ],
        atmosphere: "Intricate geometry covers every surface. A fountain plays in the center, its sound mingling with the murmur of visitors.",
        historicalNote: "Naser al-Din Shah, who visited Paris personally during the Exposition, used this pavilion to project Qajar sophistication against European condescension. He would be assassinated in 1896. The displayed Isfahan carpets, woven by women whose names were never recorded, would soon become prized by European collectors who rarely questioned their provenance."
    },

    "Pavilion of Argentina": {
        statues: [
            "Bronze Gaucho on Horseback",
            "Marble Allegory of the Pampas",
            "Figure of Cattle Rancher"
        ],
        displays: [
            "Gaucho Silver Belt Ornaments",
            "Argentine Leather Samples",
            "Preserved Beef (Charqui)",
            "Ostrich Feather Collection",
            "Mate Gourds and Bombillas",
            "Estancia Ranch Model",
            "Argentine Wine Bottles",
            "Wool and Hide Samples"
        ],
        artifacts: [
            "Silver mate gourd",
            "Gaucho boleadoras",
            "Patagonian fossil"
        ],
        atmosphere: "The scent of leather pervades. Gauchos pose stiffly for photographs beside displays of beef and hides from the pampas.",
        historicalNote: "Argentina's lavish pavilion celebrated the 'Conquest of the Desert'—the recent military campaign that killed or displaced thousands of Mapuche and Tehuelche peoples to open the pampas for cattle ranching. The beef and leather on display came from lands seized within living memory, marketed to European investors as virgin territory."
    },

    // === RUE DU CAIRE ===
    "Rue du Caire": {
        statues: [
            "Seated Scribe Figure",
            "Donkey Driver (Life-Size)",
            "Belly Dancer Bronze"
        ],
        displays: [
            "Brass Coffee Service",
            "Moroccan Leather Goods",
            "Hand-Woven Kilim Rugs",
            "Damascene Metalwork",
            "Egyptian Cotton Samples",
            "Hookah (Shisha) Collection",
            "Spice Display: Cumin, Saffron, Cardamom",
            "Mashrabiya Screen Panel"
        ],
        artifacts: [
            "Authentic tarboosh (fez)",
            "Brass coffee pot",
            "Sample of Egyptian cotton"
        ],
        atmosphere: "Donkeys bray. The smell of coffee and spices fills the winding street. Real Egyptians in costume hawk wares from cramped stalls.",
        historicalNote: "Baron Alphonse Delort de Gléon shipped 25 donkeys and their drivers from Cairo, along with architectural fragments from demolished medieval buildings. The 'authentic' belly dancers performed sanitized routines for bourgeois audiences; the Egyptian workers were housed in on-site dormitories and forbidden to leave the exhibition grounds unescorted."
    },

    // === INDUSTRIAL & SCIENTIFIC ===
    "Galerie des Machines": {
        statues: [
            "Bronze Allegory of Industry",
            "Iron Worker (Life-Size)",
            "Steam Engine Operator Figure"
        ],
        displays: [
            "Edison's Improved Phonograph",
            "Incandescent Light Bulb Array",
            "Otis Hydraulic Elevator Model",
            "Corliss Steam Engine Cutaway",
            "Telegraph Equipment Display",
            "Photographic Cameras (Latest)",
            "Electric Dynamo Demonstration",
            "Precision Scientific Instruments"
        ],
        artifacts: [
            "Edison phonograph cylinder",
            "Early incandescent bulb",
            "Telegraph key"
        ],
        atmosphere: "The racket is tremendous. Steam billows from a dozen engines. The future announces itself in iron and electricity.",
        historicalNote: "Ferdinand Dutert's iron-and-glass hall—at 420 meters the longest building in the world—housed machinery that would displace millions of workers. Visitors marveled at progress while anarchists plotted; Ravachol's bombs were only three years away. The same industrial might on display would produce the artillery of 1914."
    },

    "Edison's Electrical Exhibit": {
        statues: [
            "Bust of Thomas Edison",
            "Allegorical Figure of Electricity",
            "Bronze Prometheus with Lightning"
        ],
        displays: [
            "20,000-Bulb Pear Display",
            "Phonograph Listening Station",
            "Kinetoscope Prototype",
            "Electric Motor Collection",
            "Incandescent Lamp Evolution",
            "Volta Prize Medal (Replica)",
            "Electrical Circuit Diagrams",
            "Carbon Filament Manufacturing"
        ],
        artifacts: [
            "Signed Edison photograph",
            "Wax phonograph cylinder",
            "Carbon filament sample"
        ],
        atmosphere: "Incandescent bulbs by the thousand create an artificial day. A phonograph plays ghostly music while visitors peer in wonder.",
        historicalNote: "Edison arrived in Paris on August 10, 1889, and was fêted as a living deity. His 20,000-bulb display consumed enough electricity to light a small city. The 'Wizard of Menlo Park' was already embroiled in the War of Currents with Westinghouse; within a year, he would secretly electrocute animals to discredit alternating current—and lose."
    },

    "Telephone Pavilion": {
        statues: [
            "Bust of Alexander Graham Bell",
            "Telegraph Operator Figure"
        ],
        displays: [
            "Bell Telephone Apparatus",
            "Long-Distance Line Equipment",
            "Switchboard Demonstration",
            "Underwater Cable Cross-Section",
            "Ader's Theatrophone System",
            "Speaking Tube Collection",
            "Telephonic Patent Drawings",
            "Voice Transmission Diagrams"
        ],
        artifacts: [
            "Early telephone receiver",
            "Telegraph key and sounder",
            "Insulated wire sample"
        ],
        atmosphere: "Visitors speak to strangers across the hall, marveling at the novelty. Wires crisscross overhead like a mechanical spider web.",
        historicalNote: "Clément Ader's Théâtrophone—two earpieces for stereo sound—transmitted live performances from the Opéra Garnier and Comédie-Française. It was the world's first stereo broadcast. Marcel Proust later recalled the 'supernatural voices' as a formative childhood experience that shaped his understanding of memory and presence."
    },

    // === FINE ARTS ===
    "Sculpture Pavilion": {
        statues: [
            "Rodin's 'The Thinker' (Bronze)",
            "Dalou's 'Triumph of the Republic'",
            "Carpeaux's 'La Danse' Cast",
            "Falguière's 'Diana' Marble",
            "Mercié's 'Gloria Victis'",
            "Bartholomé's 'Monument aux Morts'"
        ],
        displays: [
            "Sculptor's Tools and Armature",
            "Bronze Casting Process Model",
            "Marble Quarry Samples",
            "Plaster Study Maquettes",
            "Medal and Cameo Collection",
            "Anatomical Drawing Studies"
        ],
        artifacts: [
            "Sculptor's clay sketch",
            "Bronze patina samples",
            "Marble fragment from Carrara"
        ],
        atmosphere: "Marble figures in heroic poses catch the light from above. Rodin's controversial works draw crowds and whispered commentary.",
        historicalNote: "Rodin exhibited 36 works in a joint show with Claude Monet at the Galerie Georges Petit, deliberately bypassing the official Salon. His scandalously sensual figures drew accusations of casting from life. Camille Claudel, his student, assistant, and lover, received no credit for her contributions to several pieces displayed here."
    },

    "Fine Arts Palace": {
        statues: [
            "Academic Nude (Classical)",
            "Allegory of France",
            "Historical Figure of Joan of Arc",
            "Romantic Hero in Bronze"
        ],
        displays: [
            "Oil Paintings (Salon Selection)",
            "Impressionist Works (Controversial)",
            "Academic Historical Scenes",
            "Portrait Miniatures",
            "Watercolor Landscapes",
            "Decorative Arts Panels",
            "Tapestry Cartoons",
            "Engraving and Lithograph Prints"
        ],
        artifacts: [
            "Exhibition catalog (1889)",
            "Artist's palette",
            "Canvas stretcher sample"
        ],
        atmosphere: "Row upon row of paintings in gilded frames. Critics argue the merits of academic tradition versus the shocking new Impressionists.",
        historicalNote: "The Centennial exhibition traced French painting from 1789 to 1889—but excluded the Impressionists as too radical. Gauguin organized a rival show at the Café Volpini on the fairgrounds, exhibiting alongside Émile Bernard and others. Van Gogh declined to participate; he was in an asylum at Saint-Rémy, having severed his ear eight months earlier."
    },

    // === COLONIAL EXHIBITS ===
    "Senegalese Village": {
        statues: [
            "Bronze of Senegalese Warrior",
            "Figure of Village Chief",
            "Carved Wooden Ancestor Figure"
        ],
        displays: [
            "Traditional Weapons Display",
            "Woven Textiles and Baskets",
            "Ceremonial Masks",
            "Musical Instruments (Djembe, Kora)",
            "Jewelry and Adornments",
            "Agricultural Tool Collection",
            "Pottery and Gourd Vessels",
            "Trade Goods: Gum Arabic, Peanuts"
        ],
        artifacts: [
            "Authentic ceremonial mask",
            "Cowrie shell currency",
            "Sample of gum arabic"
        ],
        atmosphere: "Thatched huts and exhibited peoples. The ethics are questionable, the crowds enormous. The smell of cooking fires drifts over.",
        historicalNote: "Over 400 Africans were brought to Paris and displayed as living exhibits in recreated villages. They were paid, but confined; some died from cold and disease. Prince Akihito of Japan, visiting the Exposition, reportedly expressed unease at the spectacle. This 'human zoo' model would persist at international fairs until the 1930s."
    },

    "Algerian Village": {
        statues: [
            "Berber Craftsman Figure",
            "Tuareg Warrior Bronze",
            "Kabyle Woman at Loom"
        ],
        displays: [
            "Berber Silver Jewelry",
            "Hand-Knotted Carpets",
            "Copper Tea Service",
            "Leather Moroccan Goods",
            "Ceramic Tagine Pots",
            "Woven Burnous Cloaks",
            "Couscous Preparation Display",
            "Olive Oil and Dates"
        ],
        artifacts: [
            "Berber silver bracelet",
            "Pressed Algerian dates",
            "Olive wood carving"
        ],
        atmosphere: "A mock kasbah with Berber craftsmen at work. The smell of mint tea and leather. Narrow passages between whitewashed walls.",
        historicalNote: "Algeria had been a French colony since 1830, achieved through wars that killed perhaps one-third of the indigenous population. The 'pacified' artisans displayed here worked under a regime of dispossession; their lands were being redistributed to European settlers while visitors admired their 'timeless' crafts."
    },

    "Tunisian Souk": {
        statues: [
            "Bronze Merchant Figure",
            "Craftsman at Anvil"
        ],
        displays: [
            "Brass Hammered Trays",
            "Esparto Grass Weavings",
            "Embroidered Chechias (Caps)",
            "Traditional Perfume Bottles",
            "Olive Wood Carvings",
            "Ceramic Tiles (Zellige)",
            "Silver Filigree Work",
            "Jasmine and Orange Blossom"
        ],
        artifacts: [
            "Tunisian silver pendant",
            "Chechia (red cap)",
            "Orange blossom water"
        ],
        atmosphere: "Narrow passages hung with carpets. Brass merchants hammer, spice sellers call out. The scent of mint tea and incense pervades.",
        historicalNote: "France had imposed 'protectorate' status on Tunisia just eight years earlier, provoking resistance that was violently suppressed. The Bey of Tunis nominally ruled, but French administrators controlled finances and foreign policy. These craftsmen represented a sanitized colonialism—exotic enough to charm, 'civilized' enough to reassure."
    },

    "Javanese Kampong": {
        statues: [
            "Bronze Wayang Figure",
            "Carved Garuda Bird",
            "Javanese Dancer Statue"
        ],
        displays: [
            "Batik Textile Collection",
            "Gamelan Musical Instruments",
            "Shadow Puppet (Wayang) Set",
            "Krises (Ceremonial Daggers)",
            "Rice Cultivation Tools",
            "Spice Samples: Nutmeg, Clove",
            "Carved Wooden Screens",
            "Traditional Jewelry"
        ],
        artifacts: [
            "Batik fabric sample",
            "Nutmeg and clove specimens",
            "Miniature gamelan gong"
        ],
        atmosphere: "Bamboo huts and gamelan music. Dancers perform at noon and six. The humid air carries the scent of cloves and tropical flowers.",
        historicalNote: "The Dutch transported Javanese performers to demonstrate 'native' dances that Claude Debussy heard and never forgot—the gamelan's pentatonic scales would transform Western music. The dancers, however, were subjects of a brutal colonial system: the 'Culture System' of forced labor had caused famines killing hundreds of thousands."
    },

    // === GENERAL EXHIBITION HALLS ===
    "Hall of Machinery": {
        statues: [
            "Iron Worker Allegory",
            "Progress Triumphant"
        ],
        displays: [
            "Fives-Lille Steam Engine",
            "Cail Locomotive Model",
            "Hydraulic Press Demonstration",
            "Fire Engine (Latest Model)",
            "Textile Loom (Jacquard)",
            "Printing Press Operation",
            "Mining Equipment Display",
            "Agricultural Machinery"
        ],
        artifacts: [
            "Steel sample ingot",
            "Machine oil specimen",
            "Gear wheel cutaway"
        ],
        atmosphere: "The ground trembles with each stroke of the massive steam hammer. Oil and metal and the roar of progress.",
        historicalNote: "The 14,000-horsepower steam engine at the hall's center could power an entire factory district. French manufacturers dominated, but German industrial exhibits were notably excluded—eighteen years after the Franco-Prussian War, resentment still simmered. The revanchist nationalism on display would flower into the trenches of Verdun."
    },

    "Hall of Textiles": {
        statues: [
            "Spinner at Wheel",
            "Weaver at Loom",
            "Allegory of Commerce"
        ],
        displays: [
            "Lyon Silk Samples",
            "Jacquard Loom Demonstration",
            "Cotton from Various Nations",
            "Wool Processing Display",
            "Lace-Making Exhibition",
            "Dyeing Process Samples",
            "Embroidery Techniques",
            "Fashion Plate Collection"
        ],
        artifacts: [
            "Lyon silk ribbon",
            "Jacquard punch cards",
            "Natural dye samples"
        ],
        atmosphere: "The click-clack of looms fills the air. Bolts of silk and cotton in every color imaginable line the walls.",
        historicalNote: "Lyon's silk weavers, the canuts, had staged revolutionary uprisings in 1831 and 1834, suppressed with artillery. The Jacquard looms displayed here used punch-card programming that would eventually inspire computing—but also displaced skilled workers. The industry's luxury depended on colonial raw materials and underpaid labor, both invisible in this celebration of French elegance."
    }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get exhibits for a specific location, with fallback to generic content
 */
export const getLocationExhibits = (locationName: string): LocationExhibits => {
    // Direct match
    if (LOCATION_EXHIBITS[locationName]) {
        return LOCATION_EXHIBITS[locationName];
    }

    // Partial match (e.g., "Pavilion of Japan" matches "Japanese Pavilion")
    const normalizedName = locationName.toLowerCase();
    for (const [key, value] of Object.entries(LOCATION_EXHIBITS)) {
        if (normalizedName.includes(key.toLowerCase()) ||
            key.toLowerCase().includes(normalizedName.split(' ').pop() || '')) {
            return value;
        }
    }

    // Check for keywords
    if (normalizedName.includes('japan')) return LOCATION_EXHIBITS["Japanese Pavilion"];
    if (normalizedName.includes('china') || normalizedName.includes('chinese')) return LOCATION_EXHIBITS["Chinese Pavilion"];
    if (normalizedName.includes('egypt')) return LOCATION_EXHIBITS["Egyptian Pavilion"];
    if (normalizedName.includes('mexic') || normalizedName.includes('aztec')) return LOCATION_EXHIBITS["Mexican Pavilion"];
    if (normalizedName.includes('persia') || normalizedName.includes('iran')) return LOCATION_EXHIBITS["Persian Pavilion"];
    if (normalizedName.includes('argentin')) return LOCATION_EXHIBITS["Pavilion of Argentina"];
    if (normalizedName.includes('caire') || normalizedName.includes('cairo')) return LOCATION_EXHIBITS["Rue du Caire"];
    if (normalizedName.includes('machine') || normalizedName.includes('industr')) return LOCATION_EXHIBITS["Hall of Machinery"];
    if (normalizedName.includes('edison') || normalizedName.includes('electric')) return LOCATION_EXHIBITS["Edison's Electrical Exhibit"];
    if (normalizedName.includes('telephone') || normalizedName.includes('telegraph')) return LOCATION_EXHIBITS["Telephone Pavilion"];
    if (normalizedName.includes('sculpt')) return LOCATION_EXHIBITS["Sculpture Pavilion"];
    if (normalizedName.includes('fine art') || normalizedName.includes('painting')) return LOCATION_EXHIBITS["Fine Arts Palace"];
    if (normalizedName.includes('senegal')) return LOCATION_EXHIBITS["Senegalese Village"];
    if (normalizedName.includes('algeri')) return LOCATION_EXHIBITS["Algerian Village"];
    if (normalizedName.includes('tunis')) return LOCATION_EXHIBITS["Tunisian Souk"];
    if (normalizedName.includes('java')) return LOCATION_EXHIBITS["Javanese Kampong"];
    if (normalizedName.includes('textile') || normalizedName.includes('fabric')) return LOCATION_EXHIBITS["Hall of Textiles"];
    if (normalizedName.includes('ethnograph') || normalizedName.includes('anthropolog')) return LOCATION_EXHIBITS["Musée d'Ethnographie"];
    if (normalizedName.includes('habitation') || normalizedName.includes('dwelling')) return LOCATION_EXHIBITS["History of Habitation"];

    // Default generic exhibits
    return {
        statues: [
            "Allegorical Figure",
            "Classical Bust",
            "Bronze Statuette"
        ],
        displays: [
            "Exhibition Artifacts",
            "Industrial Samples",
            "Decorative Objects",
            "Historical Documents",
            "Cultural Specimens"
        ],
        artifacts: [
            "Exhibition souvenir",
            "Printed catalog",
            "Commemorative medal"
        ],
        atmosphere: "Visitors mill about, examining the displays with varying degrees of interest and comprehension.",
        historicalNote: "The 1889 Exposition drew 32 million visitors and cost 43 million francs—half covered by admission tickets at 1 franc each. It celebrated the centennial of the French Revolution, though most European monarchies boycotted it for that reason. The Eiffel Tower, intended as temporary, became the world's tallest structure and Paris's defining symbol."
    };
};

/**
 * Get a random statue name for a location
 */
export const getRandomStatue = (locationName: string, seed: number): string => {
    const exhibits = getLocationExhibits(locationName);
    const index = Math.floor((seed * 12345) % exhibits.statues.length);
    return exhibits.statues[index];
};

/**
 * Get a random display name for a location
 */
export const getRandomDisplay = (locationName: string, seed: number): string => {
    const exhibits = getLocationExhibits(locationName);
    const index = Math.floor((seed * 54321) % exhibits.displays.length);
    return exhibits.displays[index];
};
