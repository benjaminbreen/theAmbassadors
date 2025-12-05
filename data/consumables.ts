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

// Get all consumables available at kiosks
export const getKioskItems = (): Item[] => {
    return CONSUMABLES.filter(item => item.price !== undefined);
};

// Get consumable by ID
export const getConsumableById = (id: string): Item | undefined => {
    return CONSUMABLES.find(item => item.id === id);
};
