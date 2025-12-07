import { Item } from '../types';

// All purchasable consumables available at kiosks
export const CONSUMABLES: Item[] = [
    // === ALCOHOLIC BEVERAGES ===
    {
        id: 'absinthe',
        name: 'Glass of Absinthe',
        description: 'The notorious "green fairy." Artists swear by its creative properties.',
        type: 'CONSUMABLE',
        emoji: '🧪',
        price: 3,
        rarity: 'UNCOMMON',
        historicalNote: 'Absinthe was immensely popular among Parisian artists and writers in 1889, though concerns about its effects were growing.',
        consumable: {
            immediate: [
                { stat: 'wit', delta: 1 },
                { stat: 'composure', delta: -5 },
            ],
            delayed: {
                effects: [
                    { stat: 'malaise', delta: 10 },
                    { stat: 'wit', delta: -1 },
                ],
                delayMinutes: 30
            },
            duration: 30,
            stackPenalty: {
                threshold: 2,
                effects: [
                    { stat: 'wit', delta: -2 },
                    { stat: 'decorum', delta: -2 },
                    { stat: 'composure', delta: -20 },
                    { stat: 'malaise', delta: 15 },
                ]
            }
        }
    },
    {
        id: 'champagne',
        name: 'Coupe of Champagne',
        description: 'Effervescent and celebratory. The drink of the Exposition.',
        type: 'CONSUMABLE',
        emoji: '🥂',
        price: 5,
        rarity: 'COMMON',
        historicalNote: 'Champagne flowed freely at the 1889 Exposition, symbolizing French luxury and celebration.',
        consumable: {
            immediate: [
                { stat: 'composure', delta: 10 },
                { stat: 'decorum', delta: 1 },
            ],
            delayed: {
                effects: [
                    { stat: 'composure', delta: -5 },
                ],
                delayMinutes: 45
            },
            duration: 45,
            stackPenalty: {
                threshold: 3,
                effects: [
                    { stat: 'decorum', delta: -3 },
                    { stat: 'composure', delta: -15 },
                ]
            }
        }
    },
    {
        id: 'cognac',
        name: 'Snifter of Cognac',
        description: 'A warming brandy. Steadies the nerves admirably.',
        type: 'CONSUMABLE',
        emoji: '🥃',
        price: 4,
        rarity: 'COMMON',
        historicalNote: 'Fine cognac was considered essential for gentlemen of refinement.',
        consumable: {
            immediate: [
                { stat: 'composure', delta: 15 },
                { stat: 'malaise', delta: -5 },
            ],
            delayed: {
                effects: [
                    { stat: 'observation', delta: -1 },
                ],
                delayMinutes: 60
            },
            duration: 60,
            stackPenalty: {
                threshold: 2,
                effects: [
                    { stat: 'observation', delta: -2 },
                    { stat: 'composure', delta: -10 },
                ]
            }
        }
    },
    {
        id: 'vin_rouge',
        name: 'Glass of Bordeaux',
        description: 'A respectable claret. Suitable for contemplation.',
        type: 'CONSUMABLE',
        emoji: '🍷',
        price: 2,
        rarity: 'COMMON',
        historicalNote: 'French wine was integral to every meal and social occasion.',
        consumable: {
            immediate: [
                { stat: 'composure', delta: 8 },
                { stat: 'observation', delta: 1 },
            ],
            duration: 40,
            stackPenalty: {
                threshold: 3,
                effects: [
                    { stat: 'observation', delta: -2 },
                ]
            }
        }
    },

    // === COFFEE & TEA ===
    {
        id: 'cafe_noir',
        name: 'Café Noir',
        description: 'Strong black coffee. Sharpens the mind considerably.',
        type: 'CONSUMABLE',
        emoji: '☕',
        price: 1,
        rarity: 'COMMON',
        historicalNote: 'Parisian café culture was at its height, with coffee houses serving as intellectual meeting places.',
        consumable: {
            immediate: [
                { stat: 'observation', delta: 1 },
                { stat: 'wit', delta: 1 },
                { stat: 'composure', delta: -5 },
            ],
            duration: 45,
            stackPenalty: {
                threshold: 3,
                effects: [
                    { stat: 'composure', delta: -15 },
                    { stat: 'malaise', delta: 5 },
                ]
            }
        }
    },
    {
        id: 'the_chinois',
        name: 'Chinese Tea',
        description: 'Delicate and restorative. From the Chinese pavilion.',
        type: 'CONSUMABLE',
        emoji: '🍵',
        price: 2,
        rarity: 'UNCOMMON',
        historicalNote: 'The Chinese pavilion at the Exposition introduced many visitors to authentic Asian teas.',
        consumable: {
            immediate: [
                { stat: 'composure', delta: 10 },
                { stat: 'malaise', delta: -8 },
            ],
            duration: 30
        }
    },
    {
        id: 'chocolat_chaud',
        name: 'Chocolat Chaud',
        description: 'Rich hot chocolate. A comforting indulgence.',
        type: 'CONSUMABLE',
        emoji: '🍫',
        price: 2,
        rarity: 'COMMON',
        historicalNote: 'Hot chocolate remained a fashionable drink among the Parisian elite.',
        consumable: {
            immediate: [
                { stat: 'composure', delta: 12 },
                { stat: 'malaise', delta: -5 },
            ],
            duration: 30
        }
    },

    // === FOOD ===
    {
        id: 'croissant',
        name: 'Fresh Croissant',
        description: 'Flaky, buttery perfection. Still warm from the oven.',
        type: 'CONSUMABLE',
        emoji: '🥐',
        price: 1,
        rarity: 'COMMON',
        historicalNote: 'The croissant had become a Parisian breakfast staple by the late 19th century.',
        consumable: {
            immediate: [
                { stat: 'composure', delta: 5 },
                { stat: 'health', delta: 5 },
            ]
        }
    },
    {
        id: 'oysters',
        name: 'Dozen Oysters',
        description: 'Fresh from Brittany. A restorative delicacy.',
        type: 'CONSUMABLE',
        emoji: '🦪',
        price: 6,
        rarity: 'UNCOMMON',
        historicalNote: 'Oysters were consumed in vast quantities by all classes in 19th century Paris.',
        consumable: {
            immediate: [
                { stat: 'health', delta: 10 },
                { stat: 'composure', delta: 8 },
                { stat: 'reputation', delta: 2 },
            ]
        }
    },
    {
        id: 'pate',
        name: 'Pâté de Foie Gras',
        description: 'Rich goose liver pâté. The height of gastronomy.',
        type: 'CONSUMABLE',
        emoji: '🍖',
        price: 8,
        rarity: 'RARE',
        historicalNote: 'Foie gras from Strasbourg was considered the pinnacle of French cuisine.',
        consumable: {
            immediate: [
                { stat: 'health', delta: 8 },
                { stat: 'decorum', delta: 1 },
                { stat: 'reputation', delta: 3 },
            ]
        }
    },
    {
        id: 'fromage',
        name: 'Assorted Cheeses',
        description: 'A selection of fine French cheeses with bread.',
        type: 'CONSUMABLE',
        emoji: '🧀',
        price: 3,
        rarity: 'COMMON',
        historicalNote: 'France boasted hundreds of regional cheese varieties, a source of national pride.',
        consumable: {
            immediate: [
                { stat: 'health', delta: 8 },
                { stat: 'composure', delta: 5 },
            ]
        }
    },
    {
        id: 'macaron',
        name: 'Box of Macarons',
        description: 'Delicate almond confections in pastel hues.',
        type: 'CONSUMABLE',
        emoji: '🍬',
        price: 3,
        rarity: 'UNCOMMON',
        historicalNote: 'Parisian macarons were becoming increasingly refined and fashionable.',
        consumable: {
            immediate: [
                { stat: 'composure', delta: 8 },
                { stat: 'malaise', delta: -3 },
            ]
        }
    },

    // === EXOTIC / SPECIAL ===
    {
        id: 'turkish_coffee',
        name: 'Turkish Coffee',
        description: 'Thick, potent, served in a copper cezve. From the Ottoman pavilion.',
        type: 'CONSUMABLE',
        emoji: '☕',
        price: 2,
        rarity: 'UNCOMMON',
        historicalNote: 'The Ottoman pavilion offered authentic Turkish coffee, an exotic novelty for many visitors.',
        consumable: {
            immediate: [
                { stat: 'wit', delta: 2 },
                { stat: 'observation', delta: 1 },
                { stat: 'composure', delta: -10 },
            ],
            duration: 60,
            stackPenalty: {
                threshold: 2,
                effects: [
                    { stat: 'composure', delta: -20 },
                    { stat: 'malaise', delta: 10 },
                ]
            }
        }
    },
    {
        id: 'laudanum',
        name: 'Laudanum Tincture',
        description: 'A medicinal preparation. Calms the nerves... and much else.',
        type: 'CONSUMABLE',
        emoji: '💊',
        price: 5,
        rarity: 'RARE',
        historicalNote: 'Laudanum (opium dissolved in alcohol) was widely available and commonly used for various ailments.',
        consumable: {
            immediate: [
                { stat: 'malaise', delta: -25 },
                { stat: 'composure', delta: 20 },
                { stat: 'observation', delta: -2 },
            ],
            delayed: {
                effects: [
                    { stat: 'malaise', delta: 15 },
                    { stat: 'health', delta: -5 },
                ],
                delayMinutes: 45
            },
            duration: 45,
            stackPenalty: {
                threshold: 1,
                effects: [
                    { stat: 'health', delta: -15 },
                    { stat: 'malaise', delta: 20 },
                    { stat: 'wit', delta: -3 },
                    { stat: 'observation', delta: -3 },
                ]
            }
        }
    },
    {
        id: 'smelling_salts',
        name: 'Smelling Salts',
        description: 'Ammonium carbonate. Revives instantly.',
        type: 'CONSUMABLE',
        emoji: '💨',
        price: 2,
        rarity: 'COMMON',
        historicalNote: 'Smelling salts were carried by many as a remedy for faintness.',
        consumable: {
            immediate: [
                { stat: 'composure', delta: 25 },
                { stat: 'observation', delta: 1 },
                { stat: 'malaise', delta: -10 },
            ]
        }
    },
];

// === SOUVENIRS (Non-consumable items) ===
export const SOUVENIRS: Item[] = [
    {
        id: 'mini_eiffel_tower',
        name: 'Miniature Eiffel Tower',
        description: 'A small bronze replica of the great iron tower. A memento of modernity.',
        type: 'CURIOSITY',
        emoji: '🗼',
        price: 5,
        rarity: 'COMMON',
        historicalNote: 'Miniature Eiffel Towers were among the most popular souvenirs of the 1889 Exposition, produced in vast quantities.'
    },
    {
        id: 'postcard_exposition',
        name: 'Exposition Postcard',
        description: 'A chromolithograph view of the Champ de Mars. Suitable for correspondence.',
        type: 'DOCUMENT',
        emoji: '🖼️',
        price: 1,
        rarity: 'COMMON',
        historicalNote: 'Picture postcards were a relatively new innovation, and the Exposition generated thousands of designs.'
    },
    {
        id: 'exposition_medal',
        name: 'Commemorative Medal',
        description: 'A bronze medal struck for the centenary of the Revolution. Weighty with significance.',
        type: 'CURIOSITY',
        emoji: '🏅',
        price: 8,
        rarity: 'UNCOMMON',
        historicalNote: 'Official commemorative medals were popular collector\'s items, marking both the Exposition and the Revolution\'s centenary.'
    },
    {
        id: 'fan_painted',
        name: 'Painted Fan',
        description: 'A delicate folding fan depicting the Exposition grounds. Both useful and decorative.',
        type: 'PERSONAL',
        emoji: '🪭',
        price: 4,
        rarity: 'COMMON',
        historicalNote: 'Decorated fans were essential accessories for ladies and popular souvenirs featuring Exposition scenes.'
    },
    {
        id: 'stereoscope_card',
        name: 'Stereoscope Card',
        description: 'A 3D photograph of the Galerie des Machines. Requires a stereoscope viewer.',
        type: 'CURIOSITY',
        emoji: '📷',
        price: 2,
        rarity: 'COMMON',
        historicalNote: 'Stereoscopic photography was immensely popular, offering an illusion of three-dimensional depth.'
    },
    {
        id: 'guidebook_official',
        name: 'Official Guide',
        description: 'The comprehensive guidebook to the Exposition Universelle. 500 pages of instruction.',
        type: 'BOOK',
        emoji: '📕',
        price: 3,
        rarity: 'COMMON',
        historicalNote: 'Multiple guidebooks were published, ranging from official publications to independent guides.'
    },
    {
        id: 'photograph_tower',
        name: 'Tower Photograph',
        description: 'An albumen print showing the completed tower. A triumph of engineering, captured.',
        type: 'ART',
        emoji: '🖼️',
        price: 6,
        rarity: 'UNCOMMON',
        historicalNote: 'Professional photographs of the Tower were sold in various sizes and formats throughout the Exposition.'
    },
    {
        id: 'ribbon_souvenir',
        name: 'Souvenir Ribbon',
        description: 'A silk ribbon printed with "Exposition Universelle 1889" in gold letters.',
        type: 'PERSONAL',
        emoji: '🎀',
        price: 2,
        rarity: 'COMMON',
        historicalNote: 'Printed ribbons were inexpensive mementos available at numerous kiosks throughout the grounds.'
    },
];

// Kiosk type determines what items are available
export type KioskType = 'REFRESHMENTS' | 'SOUVENIRS' | 'BOOKS' | 'PHOTOS';

// Get all consumables available at refreshment kiosks
export const getKioskItems = (kioskType: KioskType = 'REFRESHMENTS'): Item[] => {
    switch (kioskType) {
        case 'SOUVENIRS':
            return SOUVENIRS;
        case 'BOOKS':
            return SOUVENIRS.filter(item =>
                ['guidebook_official', 'postcard_exposition'].includes(item.id)
            );
        case 'PHOTOS':
            return SOUVENIRS.filter(item =>
                ['photograph_tower', 'stereoscope_card', 'postcard_exposition'].includes(item.id)
            );
        case 'REFRESHMENTS':
        default:
            return CONSUMABLES.filter(item => item.price !== undefined);
    }
};

// Map kiosk label to type
export const getKioskTypeFromLabel = (label: string): KioskType => {
    switch (label) {
        case 'SOUVENIRS':
        case 'CARTES':
            return 'SOUVENIRS';
        case 'LIVRES':
        case 'GUIDES':
            return 'BOOKS';
        case 'PHOTOS':
            return 'PHOTOS';
        case 'JOURNAUX':
        default:
            return 'REFRESHMENTS';
    }
};

// Get consumable by ID
export const getConsumableById = (id: string): Item | undefined => {
    return CONSUMABLES.find(item => item.id === id);
};

// Get souvenir by ID
export const getSouvenirById = (id: string): Item | undefined => {
    return SOUVENIRS.find(item => item.id === id);
};
