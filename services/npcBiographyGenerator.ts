/**
 * NPC Biography Generator
 *
 * Generates historically grounded biographical details for NPCs at the 1889 Paris Exposition.
 * Takes into account name etymology, profession, age, gender, and appearance to create
 * coherent personal histories.
 */

import { NPC } from '../types';
import { AppearanceProfile, SkinTone } from '../data/historicalFigures';

// ============================================================================
// GEOGRAPHIC DATA
// ============================================================================

interface Location {
    city: string;
    region?: string;
    country: string;
    descriptor?: string; // "industrial", "provincial", "cosmopolitan"
}

// French cities by region with character
const FRENCH_LOCATIONS: Location[] = [
    { city: 'Paris', country: 'France', descriptor: 'cosmopolitan' },
    { city: 'Paris', region: 'Montmartre', country: 'France', descriptor: 'bohemian' },
    { city: 'Paris', region: 'Le Marais', country: 'France', descriptor: 'bourgeois' },
    { city: 'Paris', region: 'Faubourg Saint-Germain', country: 'France', descriptor: 'aristocratic' },
    { city: 'Lyon', country: 'France', descriptor: 'industrial' },
    { city: 'Marseille', country: 'France', descriptor: 'maritime' },
    { city: 'Bordeaux', country: 'France', descriptor: 'mercantile' },
    { city: 'Lille', country: 'France', descriptor: 'industrial' },
    { city: 'Toulouse', country: 'France', descriptor: 'provincial' },
    { city: 'Nantes', country: 'France', descriptor: 'maritime' },
    { city: 'Strasbourg', region: 'Alsace', country: 'France', descriptor: 'contested' },
    { city: 'Nice', country: 'France', descriptor: 'fashionable' },
    { city: 'Rouen', region: 'Normandy', country: 'France', descriptor: 'provincial' },
    { city: 'Reims', region: 'Champagne', country: 'France', descriptor: 'mercantile' },
    { city: 'Dijon', region: 'Burgundy', country: 'France', descriptor: 'provincial' },
    { city: 'Avignon', region: 'Provence', country: 'France', descriptor: 'provincial' },
];

// International locations based on skin tone / appearance
const BRITISH_LOCATIONS: Location[] = [
    { city: 'London', country: 'England', descriptor: 'cosmopolitan' },
    { city: 'London', region: 'Mayfair', country: 'England', descriptor: 'aristocratic' },
    { city: 'Manchester', country: 'England', descriptor: 'industrial' },
    { city: 'Edinburgh', country: 'Scotland', descriptor: 'intellectual' },
    { city: 'Dublin', country: 'Ireland', descriptor: 'literary' },
    { city: 'Liverpool', country: 'England', descriptor: 'maritime' },
    { city: 'Bath', country: 'England', descriptor: 'fashionable' },
    { city: 'Oxford', country: 'England', descriptor: 'academic' },
    { city: 'Cambridge', country: 'England', descriptor: 'academic' },
];

const AMERICAN_LOCATIONS: Location[] = [
    { city: 'New York', region: 'Fifth Avenue', country: 'United States', descriptor: 'cosmopolitan' },
    { city: 'Boston', country: 'United States', descriptor: 'intellectual' },
    { city: 'Philadelphia', country: 'United States', descriptor: 'mercantile' },
    { city: 'Chicago', country: 'United States', descriptor: 'industrial' },
    { city: 'New Orleans', country: 'United States', descriptor: 'cosmopolitan' },
    { city: 'San Francisco', country: 'United States', descriptor: 'frontier' },
    { city: 'Washington', country: 'United States', descriptor: 'governmental' },
    { city: 'Charleston', country: 'United States', descriptor: 'aristocratic' },
];

const GERMAN_LOCATIONS: Location[] = [
    { city: 'Berlin', country: 'Germany', descriptor: 'imperial' },
    { city: 'Munich', region: 'Bavaria', country: 'Germany', descriptor: 'artistic' },
    { city: 'Hamburg', country: 'Germany', descriptor: 'maritime' },
    { city: 'Frankfurt', country: 'Germany', descriptor: 'mercantile' },
    { city: 'Cologne', country: 'Germany', descriptor: 'industrial' },
    { city: 'Vienna', country: 'Austria', descriptor: 'imperial' },
];

const ITALIAN_LOCATIONS: Location[] = [
    { city: 'Rome', country: 'Italy', descriptor: 'cosmopolitan' },
    { city: 'Florence', region: 'Tuscany', country: 'Italy', descriptor: 'artistic' },
    { city: 'Milan', country: 'Italy', descriptor: 'industrial' },
    { city: 'Venice', country: 'Italy', descriptor: 'cosmopolitan' },
    { city: 'Naples', country: 'Italy', descriptor: 'provincial' },
    { city: 'Turin', country: 'Italy', descriptor: 'industrial' },
];

const SPANISH_LOCATIONS: Location[] = [
    { city: 'Madrid', country: 'Spain', descriptor: 'imperial' },
    { city: 'Barcelona', region: 'Catalonia', country: 'Spain', descriptor: 'industrial' },
    { city: 'Seville', region: 'Andalusia', country: 'Spain', descriptor: 'provincial' },
];

const RUSSIAN_LOCATIONS: Location[] = [
    { city: 'St. Petersburg', country: 'Russia', descriptor: 'imperial' },
    { city: 'Moscow', country: 'Russia', descriptor: 'mercantile' },
    { city: 'Odessa', country: 'Russia', descriptor: 'cosmopolitan' },
];

const EAST_ASIAN_LOCATIONS: Location[] = [
    { city: 'Tokyo', country: 'Japan', descriptor: 'imperial' },
    { city: 'Kyoto', country: 'Japan', descriptor: 'traditional' },
    { city: 'Yokohama', country: 'Japan', descriptor: 'cosmopolitan' },
    { city: 'Shanghai', country: 'China', descriptor: 'cosmopolitan' },
    { city: 'Canton', country: 'China', descriptor: 'mercantile' },
    { city: 'Peking', country: 'China', descriptor: 'imperial' },
];

const MIDDLE_EASTERN_LOCATIONS: Location[] = [
    { city: 'Constantinople', country: 'Ottoman Empire', descriptor: 'imperial' },
    { city: 'Cairo', country: 'Egypt', descriptor: 'cosmopolitan' },
    { city: 'Alexandria', country: 'Egypt', descriptor: 'cosmopolitan' },
    { city: 'Beirut', country: 'Ottoman Empire', descriptor: 'mercantile' },
    { city: 'Jerusalem', country: 'Ottoman Empire', descriptor: 'holy' },
    { city: 'Damascus', country: 'Ottoman Empire', descriptor: 'mercantile' },
    { city: 'Tehran', country: 'Persia', descriptor: 'imperial' },
];

const AFRICAN_LOCATIONS: Location[] = [
    { city: 'Algiers', country: 'French Algeria', descriptor: 'colonial' },
    { city: 'Tunis', country: 'Tunisia', descriptor: 'colonial' },
    { city: 'Dakar', country: 'French Senegal', descriptor: 'colonial' },
    { city: 'Saint-Louis', country: 'French Senegal', descriptor: 'colonial' },
    { city: 'Freetown', country: 'Sierra Leone', descriptor: 'colonial' },
    { city: 'Monrovia', country: 'Liberia', descriptor: 'independent' },
    { city: 'Cape Town', country: 'Cape Colony', descriptor: 'colonial' },
    { city: 'Port-au-Prince', country: 'Haiti', descriptor: 'independent' },
    { city: 'Havana', country: 'Cuba', descriptor: 'colonial' },
];

const SOUTH_AMERICAN_LOCATIONS: Location[] = [
    { city: 'Buenos Aires', country: 'Argentina', descriptor: 'cosmopolitan' },
    { city: 'Rio de Janeiro', country: 'Brazil', descriptor: 'cosmopolitan' },
    { city: 'Lima', country: 'Peru', descriptor: 'colonial' },
    { city: 'Caracas', country: 'Venezuela', descriptor: 'provincial' },
];

// ============================================================================
// NAME DATABASES BY NATIONALITY
// ============================================================================

interface NameSet {
    male: string[];
    female: string[];
    surnames: string[];
    nationality: string;
}

export const NAME_SETS: Record<string, NameSet> = {
    french: {
        male: ['Pierre', 'Jean', 'Louis', 'Charles', 'Henri', 'Jules', 'Émile', 'François', 'Gustave', 'Arthur',
               'Alphonse', 'Auguste', 'Édouard', 'Eugène', 'Fernand', 'Gaston', 'Hippolyte', 'Jacques', 'Léon', 'Marcel',
               'Maurice', 'Paul', 'Philippe', 'René', 'Théodore', 'Victor', 'Xavier', 'Yves', 'Antoine', 'Benoît'],
        female: ['Marie', 'Jeanne', 'Marguerite', 'Germaine', 'Louise', 'Suzanne', 'Marcelle', 'Yvonne', 'Madeleine', 'Alice',
                 'Amélie', 'Berthe', 'Camille', 'Claire', 'Élise', 'Émilie', 'Henriette', 'Joséphine', 'Laure', 'Léonie',
                 'Mathilde', 'Pauline', 'Rose', 'Sophie', 'Thérèse', 'Valentine', 'Virginie', 'Blanche', 'Cécile', 'Denise'],
        surnames: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau',
                   'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier',
                   'Morel', 'Girard', 'André', 'Lefèvre', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez'],
        nationality: 'French'
    },
    british: {
        male: ['William', 'John', 'James', 'George', 'Charles', 'Edward', 'Thomas', 'Henry', 'Arthur', 'Frederick',
               'Alfred', 'Albert', 'Richard', 'Robert', 'Herbert', 'Ernest', 'Harold', 'Walter', 'Francis', 'Percy'],
        female: ['Mary', 'Elizabeth', 'Sarah', 'Jane', 'Margaret', 'Charlotte', 'Emily', 'Alice', 'Florence', 'Edith',
                 'Agnes', 'Annie', 'Beatrice', 'Catherine', 'Dorothy', 'Eleanor', 'Frances', 'Grace', 'Helen', 'Louisa'],
        surnames: ['Smith', 'Jones', 'Williams', 'Brown', 'Taylor', 'Davies', 'Wilson', 'Evans', 'Thomas', 'Johnson',
                   'Roberts', 'Walker', 'Wright', 'Robinson', 'Thompson', 'White', 'Hughes', 'Edwards', 'Green', 'Hall'],
        nationality: 'British'
    },
    american: {
        male: ['William', 'John', 'James', 'George', 'Charles', 'Thomas', 'Henry', 'Robert', 'Joseph', 'Edward',
               'Samuel', 'Benjamin', 'Frank', 'Albert', 'Harry', 'Walter', 'Arthur', 'Fred', 'Clarence', 'Ralph'],
        female: ['Mary', 'Anna', 'Emma', 'Elizabeth', 'Margaret', 'Rose', 'Ethel', 'Florence', 'Bertha', 'Clara',
                 'Minnie', 'Bessie', 'Nellie', 'Lillian', 'Edna', 'Grace', 'Annie', 'Mabel', 'Pearl', 'Hazel'],
        surnames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
                   'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Robinson', 'Clark', 'Lewis'],
        nationality: 'American'
    },
    german: {
        male: ['Wilhelm', 'Friedrich', 'Karl', 'Johann', 'Heinrich', 'Ernst', 'Otto', 'Ludwig', 'Franz', 'Gustav',
               'Hermann', 'Adolf', 'Max', 'Paul', 'Hans', 'Walter', 'Rudolf', 'Kurt', 'Werner', 'Erich'],
        female: ['Anna', 'Maria', 'Elisabeth', 'Margarethe', 'Frieda', 'Emma', 'Martha', 'Helene', 'Gertrud', 'Rosa',
                 'Bertha', 'Elsa', 'Hedwig', 'Ida', 'Klara', 'Luise', 'Minna', 'Paula', 'Wilhelmine', 'Charlotte'],
        surnames: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
                   'Koch', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun', 'Krüger'],
        nationality: 'German'
    },
    italian: {
        male: ['Giovanni', 'Giuseppe', 'Antonio', 'Francesco', 'Luigi', 'Pietro', 'Carlo', 'Angelo', 'Vincenzo', 'Domenico',
               'Michele', 'Salvatore', 'Paolo', 'Mario', 'Raffaele', 'Pasquale', 'Enrico', 'Nicola', 'Emanuele', 'Roberto'],
        female: ['Maria', 'Rosa', 'Angela', 'Giuseppina', 'Teresa', 'Anna', 'Francesca', 'Lucia', 'Carmela', 'Caterina',
                 'Giovanna', 'Antonia', 'Concetta', 'Elena', 'Margherita', 'Carolina', 'Filomena', 'Rosaria', 'Luisa', 'Emma'],
        surnames: ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco',
                   'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti'],
        nationality: 'Italian'
    },
    spanish: {
        male: ['José', 'Antonio', 'Manuel', 'Francisco', 'Juan', 'Pedro', 'Luis', 'Miguel', 'Rafael', 'Ramón',
               'Carlos', 'Fernando', 'Enrique', 'Joaquín', 'Eduardo', 'Emilio', 'Pablo', 'Andrés', 'Ángel', 'Domingo'],
        female: ['María', 'Carmen', 'Josefa', 'Dolores', 'Francisca', 'Antonia', 'Teresa', 'Isabel', 'Rosa', 'Juana',
                 'Pilar', 'Manuela', 'Concepción', 'Mercedes', 'Encarnación', 'Rosario', 'Amparo', 'Soledad', 'Esperanza', 'Victoria'],
        surnames: ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Torres',
                   'Flores', 'Rivera', 'Gómez', 'Díaz', 'Ruiz', 'Moreno', 'Jiménez', 'Álvarez', 'Romero', 'Muñoz'],
        nationality: 'Spanish'
    },
    russian: {
        male: ['Ivan', 'Nikolai', 'Pyotr', 'Aleksandr', 'Mikhail', 'Sergei', 'Dmitri', 'Andrei', 'Vladimir', 'Pavel',
               'Konstantin', 'Boris', 'Grigori', 'Alexei', 'Viktor', 'Yuri', 'Vasili', 'Fyodor', 'Igor', 'Leonid'],
        female: ['Anna', 'Maria', 'Ekaterina', 'Olga', 'Natalia', 'Elena', 'Tatiana', 'Sofia', 'Alexandra', 'Vera',
                 'Irina', 'Lyudmila', 'Valentina', 'Nina', 'Galina', 'Larisa', 'Svetlana', 'Tamara', 'Nadezhda', 'Zinaida'],
        surnames: ['Ivanov', 'Smirnov', 'Kuznetsov', 'Popov', 'Sokolov', 'Lebedev', 'Kozlov', 'Novikov', 'Morozov', 'Petrov',
                   'Volkov', 'Soloviev', 'Vasiliev', 'Zaytsev', 'Pavlov', 'Semyonov', 'Golubev', 'Vinogradov', 'Bogdanov', 'Vorobiev'],
        nationality: 'Russian'
    },
    japanese: {
        male: ['Takeshi', 'Hiroshi', 'Kenji', 'Masao', 'Taro', 'Ichiro', 'Jiro', 'Saburo', 'Shiro', 'Goro',
               'Yoshio', 'Akira', 'Kazuo', 'Minoru', 'Isamu', 'Noboru', 'Susumu', 'Tadashi', 'Haruo', 'Kiyoshi'],
        female: ['Hanako', 'Hana', 'Yuki', 'Sakura', 'Akiko', 'Michiko', 'Yoshiko', 'Keiko', 'Kazuko', 'Shizuko',
                 'Fumiko', 'Tomoko', 'Kimiko', 'Noriko', 'Masako', 'Teruko', 'Sadako', 'Haruko', 'Chiyoko', 'Ayako'],
        surnames: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato',
                   'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Matsumoto', 'Inoue', 'Kimura', 'Hayashi', 'Shimizu', 'Yamazaki'],
        nationality: 'Japanese'
    },
    chinese: {
        male: ['Wei', 'Jian', 'Ming', 'Li', 'Yong', 'Qiang', 'Jun', 'Hua', 'Tao', 'Gang',
               'Ping', 'Feng', 'Lei', 'Hong', 'Cheng', 'Kai', 'Dong', 'Bo', 'Lin', 'Xin'],
        female: ['Mei', 'Lan', 'Ying', 'Fang', 'Xiu', 'Hong', 'Yu', 'Hua', 'Yan', 'Li',
                 'Qing', 'Jing', 'Xia', 'Juan', 'Rong', 'Min', 'Fen', 'Ping', 'Yun', 'Zhen'],
        surnames: ['Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou',
                   'Xu', 'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'Lin', 'He', 'Gao', 'Luo'],
        nationality: 'Chinese'
    },
    arabic: {
        male: ['Ahmed', 'Mohamed', 'Ali', 'Hassan', 'Hussein', 'Ibrahim', 'Omar', 'Youssef', 'Khalid', 'Mahmoud',
               'Mustafa', 'Said', 'Karim', 'Nabil', 'Faisal', 'Tariq', 'Rashid', 'Samir', 'Walid', 'Hamid'],
        female: ['Fatima', 'Aisha', 'Amina', 'Layla', 'Zahra', 'Maryam', 'Khadija', 'Salma', 'Nadia', 'Samira',
                 'Huda', 'Jamila', 'Leila', 'Naima', 'Soraya', 'Yasmin', 'Zainab', 'Farida', 'Karima', 'Malika'],
        surnames: ['Al-Rashid', 'Al-Hassan', 'Al-Mahmoud', 'Ben Ali', 'El-Sayed', 'Bey', 'Pasha', 'Effendi', 'Al-Farsi', 'Ibn Khaldun',
                   'Al-Masri', 'El-Amin', 'Al-Najjar', 'Al-Hakim', 'Ben Youssef', 'El-Shamy', 'Al-Qadi', 'Ibn Sina', 'Al-Zahir', 'El-Baz'],
        nationality: 'Ottoman'
    },
    // African Americans (visitors from the United States)
    african_american: {
        male: ['Frederick', 'William', 'James', 'Henry', 'Charles', 'George', 'Thomas', 'John', 'Robert', 'Joseph',
               'Samuel', 'Edward', 'David', 'Daniel', 'Isaac', 'Abraham', 'Solomon', 'Moses', 'Benjamin', 'Nathaniel'],
        female: ['Mary', 'Sarah', 'Elizabeth', 'Ann', 'Martha', 'Rebecca', 'Rachel', 'Hannah', 'Harriet', 'Ida',
                 'Phillis', 'Frances', 'Caroline', 'Charlotte', 'Josephine', 'Catherine', 'Margaret', 'Alice', 'Louise', 'Rosa'],
        surnames: ['Douglass', 'Washington', 'Johnson', 'Brown', 'Williams', 'Davis', 'Jackson', 'Robinson', 'Harris', 'Martin',
                   'Thompson', 'White', 'Lewis', 'Walker', 'Green', 'King', 'Scott', 'Young', 'Allen', 'Wright'],
        nationality: 'American'
    },
    // French colonial subjects from Senegal, Martinique, Guadeloupe, etc.
    // These would have French names due to colonial influence
    french_colonial: {
        male: ['Blaise', 'Amadou', 'Moussa', 'Ibrahima', 'Ousmane', 'Mamadou', 'Abdoulaye', 'Seydou', 'Boubacar', 'Demba',
               'Jean-Baptiste', 'Pierre', 'Louis', 'François', 'Léopold', 'Félix', 'Aimé', 'Gaston', 'Léon', 'Victor'],
        female: ['Fatou', 'Aminata', 'Mariama', 'Awa', 'Khady', 'Ndèye', 'Coumba', 'Astou', 'Diary', 'Sokhna',
                 'Marie-Thérèse', 'Jeanne', 'Eugénie', 'Suzanne', 'Paulette', 'Germaine', 'Lucienne', 'Simone', 'Cécile', 'Marguerite'],
        surnames: ['Diop', 'Diallo', 'Ndiaye', 'Fall', 'Sow', 'Ba', 'Sy', 'Sarr', 'Gueye', 'Mbaye',
                   'Césaire', 'Fanon', 'Lumumba', 'Senghor', 'Damas', 'Éboué', 'Gratien', 'Maran', 'Lacascade', 'Bissette'],
        nationality: 'French Colonial'
    },
    // Haitian visitors (independent Black republic)
    haitian: {
        male: ['Jean-Jacques', 'Toussaint', 'Henri', 'Alexandre', 'Dessalines', 'Pétion', 'François', 'Louis', 'Anténor', 'Benito'],
        female: ['Marie', 'Rose', 'Cécile', 'Sanité', 'Défilée', 'Claire', 'Joséphine', 'Suzanne', 'Marguerite', 'Louise'],
        surnames: ['Louverture', 'Christophe', 'Pétion', 'Dessalines', 'Boyer', 'Geffrard', 'Salomon', 'Hyppolite', 'Firmin', 'Price'],
        nationality: 'Haitian'
    }
};

// ============================================================================
// PROFESSION DATA
// ============================================================================

interface ProfessionData {
    description: string;
    dialogueStyles: string[];
    goals: string[];
    educationRequired: boolean;
    socialClass: 'working' | 'middle' | 'upper' | 'bohemian' | 'professional';
    typicalAge: { min: number; max: number };
    maleOnly?: boolean;
    femaleOnly?: boolean;
    biographyTemplates: string[];
}

const PROFESSION_DATA: Record<string, ProfessionData> = {
    'Flâneur': {
        description: 'A gentleman of leisure who makes an art of urban observation',
        dialogueStyles: [
            'Speaks in languid, carefully considered phrases, as if each word were chosen from a particularly fine vintage.',
            'Converses with the detached irony of one who has seen everything and found it all faintly amusing.',
            'Delivers observations with theatrical pauses, treating conversation as a minor performance art.',
            'Affects a world-weary sophistication, punctuated by occasional flashes of genuine insight.'
        ],
        goals: [
            'Observe the passing crowds with philosophical detachment',
            'Find the perfect vantage point from which to sketch the human comedy',
            'Avoid the vulgarity of appearing to have any particular destination',
            'Compose mental essays on the physiognomy of the modern crowd'
        ],
        educationRequired: true,
        socialClass: 'bohemian',
        typicalAge: { min: 25, max: 55 },
        biographyTemplates: [
            'Born into {class} circumstances in {birthplace}, {name} cultivated an early distaste for useful employment. After studies at {university}, {pronoun} discovered that the boulevards of Paris offered a more congenial education than any lecture hall.',
            'The {familyBusiness} that sustained {possessive} family in {birthplace} held no attraction for {name}. Since arriving in Paris in {arrivalYear}, {pronoun} has perfected the art of doing nothing with great elegance.',
            '{name} claims descent from a distinguished {birthplace} family, though the distinction seems largely to consist of a talent for genteel idleness. {pronoun_cap} now resides in the Latin Quarter, supported by an allowance of mysterious origin.'
        ]
    },
    'Journalist': {
        description: 'A writer for newspapers or periodicals, chronicling events for the public',
        dialogueStyles: [
            'Speaks in rapid bursts, always seeming to be taking mental notes for a future article.',
            'Asks pointed questions with the practiced casualness of a professional interrogator.',
            'Drops names and inside knowledge with the confidence of someone who knows everyone worth knowing.',
            'Converses with a knowing cynicism that suggests no scandal could possibly surprise.'
        ],
        goals: [
            'Secure an exclusive interview with a prominent figure',
            'Investigate rumors of financial impropriety in the Exhibition committee',
            'File a dispatch before the evening deadline',
            'Cultivate a source in the American delegation'
        ],
        educationRequired: true,
        socialClass: 'professional',
        typicalAge: { min: 22, max: 60 },
        biographyTemplates: [
            'After an education at {university} in {birthplace}, {name} discovered that the pen offered more excitement than the professions {possessive} family had intended. {pronoun_cap} now writes for {publication}, covering the Exposition with characteristic {adjective}.',
            '{name} began in the provincial press of {birthplace} before ambition drew {object} to Paris. Years of covering everything from murder trials to municipal corruption have left {object} with few illusions but many useful contacts.',
            'The son/daughter of a {parentOccupation} from {birthplace}, {name} arrived in Paris with little more than a facility for languages and an inexhaustible curiosity. {pronoun_cap} has since made {possessive} name at {publication}.'
        ]
    },
    'Engineer': {
        description: 'A technical professional involved in design, construction, or machinery',
        dialogueStyles: [
            'Explains complex matters with the patient precision of someone accustomed to being the only person in the room who understands.',
            'Peppers conversation with technical terminology, then apologizes for the habit.',
            'Speaks with the quiet confidence of one who builds things that actually work.',
            'Discusses everything from politics to art in terms of efficiency and structural integrity.'
        ],
        goals: [
            'Examine the revolutionary construction techniques of the Tower',
            'Consult with colleagues about hydraulic lift mechanisms',
            'Secure contracts for infrastructure projects in the colonies',
            'Debate the merits of steel versus iron with fellow professionals'
        ],
        educationRequired: true,
        socialClass: 'professional',
        typicalAge: { min: 25, max: 65 },
        maleOnly: true,
        biographyTemplates: [
            'A graduate of the École Polytechnique, {name} has built bridges across three continents. Born in {birthplace}, {pronoun} now oversees projects that would have seemed impossible a generation ago.',
            '{name} learned engineering not in any classroom but in the foundries of {birthplace}. {pronoun_cap} rose from apprentice to chief engineer through a combination of native brilliance and stubborn refusal to accept that anything was impossible.',
            'The {adjective} son of a {parentOccupation} from {birthplace}, {name} found in mathematics and mechanics an escape from provincial obscurity. {pronoun_cap} now numbers among the technical minds reshaping the modern world.'
        ]
    },
    'Artist': {
        description: 'A painter, sculptor, or other practitioner of the visual arts',
        dialogueStyles: [
            'Speaks passionately about color, light, and form, gesturing as if painting the air.',
            'Alternates between grandiose pronouncements about Art and self-deprecating jokes about poverty.',
            'Views everything through an aesthetic lens, finding beauty or ugliness in unexpected places.',
            'Discusses the academic establishment with the contempt of a true revolutionary—or a rejected Salon applicant.'
        ],
        goals: [
            'Sketch the crowds for a planned series of modern life paintings',
            'Find a patron willing to commission a portrait',
            'Argue about Impressionism with anyone who will listen',
            'Secure studio space before the rent comes due'
        ],
        educationRequired: false,
        socialClass: 'bohemian',
        typicalAge: { min: 20, max: 70 },
        biographyTemplates: [
            '{name} arrived in Paris from {birthplace} with nothing but a portfolio and an unshakeable conviction of {possessive} own genius. {pronoun_cap} has since exhibited at {venue}, to reviews ranging from the ecstatic to the outraged.',
            'Born to a {parentOccupation} in {birthplace}, {name} scandalized {possessive} family by abandoning a respectable future for the uncertain life of an artist. {pronoun_cap} now haunts the cafés of Montmartre, awaiting recognition.',
            'The {birthplace} art world proved too provincial for {name}\'s ambitions. Since settling in Paris, {pronoun} has developed a distinctive style that critics describe as {artStyle}.'
        ]
    },
    'Aristocrat': {
        description: 'A member of the hereditary nobility',
        dialogueStyles: [
            'Speaks with the casual assurance of someone who has never doubted their place in the world.',
            'Uses the royal "we" occasionally, and always sounds as if addressing servants even when not.',
            'Drops references to family estates, ancestral honors, and titled relatives with studied nonchalance.',
            'Displays exquisite manners that somehow manage to make everyone else feel inadequate.'
        ],
        goals: [
            'Inspect the industrial exhibits with appropriate aristocratic disdain',
            'Encounter acquaintances of suitable rank for conversation',
            'Avoid being photographed by the popular press',
            'Assess potential marriage prospects of acceptable lineage'
        ],
        educationRequired: true,
        socialClass: 'upper',
        typicalAge: { min: 18, max: 80 },
        biographyTemplates: [
            'The {title} {name} traces {possessive} lineage to the Crusades, or so the family maintains. Educated privately and at {university}, {pronoun} divides time between the ancestral estates near {birthplace} and a hôtel particulier in the Faubourg Saint-Germain.',
            '{name} inherited both title and fortune at a tragically young age. Since then, {pronoun} has dedicated {reflexive} to the serious business of doing nothing in particular while maintaining the dignity of an ancient house.',
            'Though the Revolution stripped {possessive} family of lands near {birthplace}, {name} retains both title and pretensions. {pronoun_cap} survives on a combination of investments, advantageous marriage, and sheer aristocratic nerve.'
        ]
    },
    'Worker': {
        description: 'A laborer, craftsman, or factory worker',
        dialogueStyles: [
            'Speaks directly and without pretension, calling things by their proper names.',
            'Uses colorful working-class slang mixed with technical jargon from the trade.',
            'Shows deference to social superiors while maintaining a quiet dignity.',
            'Expresses opinions bluntly when asked, but rarely volunteers them to strangers.'
        ],
        goals: [
            'See the mechanical wonders during a rare day off',
            'Find a spot that serves an honest meal at an honest price',
            'Avoid the foremen checking that workers aren\'t skiving',
            'Show family the marvels that will change their children\'s world'
        ],
        educationRequired: false,
        socialClass: 'working',
        typicalAge: { min: 16, max: 65 },
        biographyTemplates: [
            '{name} has worked in the {industry} trade since the age of {startAge}. Born in {birthplace}, {pronoun} knows the value of honest labor and harbors no illusions about the world\'s fairness.',
            'Three generations of {possessive} family have worked the {industry} in {birthplace}. {name} continues the tradition, though {pronoun} dreams of something better for {possessive} children.',
            '{name} came to Paris from {birthplace} seeking work in the new factories. The hours are long, the pay is short, but {pronoun} takes pride in building the modern world with {possessive} own hands.'
        ]
    },
    'Tour Guide': {
        description: 'A professional guide showing visitors around the Exposition',
        dialogueStyles: [
            'Recites memorized facts with theatrical enthusiasm, adapting the performance to the audience.',
            'Speaks multiple languages with varying degrees of accuracy and identical confidence.',
            'Intersperses historical information with personal anecdotes of dubious authenticity.',
            'Uses a projecting voice developed for leading groups through noisy halls.'
        ],
        goals: [
            'Shepherd the tour group through the Hall of Machines without losing anyone',
            'Collect generous tips through charm and selective information',
            'Avoid the official guides who resent freelance competition',
            'Find time to eat between the morning and afternoon groups'
        ],
        educationRequired: false,
        socialClass: 'middle',
        typicalAge: { min: 20, max: 50 },
        biographyTemplates: [
            'Before the Exposition, {name} scraped by as a {previousJob} in {birthplace}. Now {pronoun} commands the attention of visitors from around the world—and their francs.',
            '{name} knows every corner of the Exposition grounds, having walked them a thousand times since May. Born in {birthplace}, {pronoun} has reinvented {reflexive} as an authority on all things modern.',
            'A {birthplace} native, {name} parlayed a facility for languages and a gift for performance into an unexpectedly lucrative career. {pronoun_cap} tells {possessive} groups that {pronoun} has met Eiffel personally—a claim of uncertain veracity.'
        ]
    },
    'Inventor': {
        description: 'A creator of new devices and mechanical innovations',
        dialogueStyles: [
            'Explains current projects with infectious enthusiasm, producing sketches on any available surface.',
            'Speaks in half-finished sentences, distracted by ideas occurring faster than words.',
            'Alternates between visionary confidence and anxious calculation of remaining funds.',
            'Discusses technical matters with anyone who will listen, regardless of their comprehension.'
        ],
        goals: [
            'Patent a new device before competitors steal the concept',
            'Find investors willing to fund the next revolutionary invention',
            'Study Edison\'s exhibit for ideas that might be improved upon',
            'Convince skeptics that the future will prove {pronoun} right'
        ],
        educationRequired: false,
        socialClass: 'middle',
        typicalAge: { min: 25, max: 60 },
        maleOnly: true,
        biographyTemplates: [
            '{name} has filed {patentCount} patents, of which approximately {successCount} have made any money. Born in {birthplace}, {pronoun} remains convinced that the next invention will change everything.',
            'A {parentOccupation}\'s son from {birthplace}, {name} showed mechanical aptitude early. {pronoun_cap} has since devoted {possessive} life—and several investors\' fortunes—to the pursuit of revolutionary innovation.',
            '{name} claims to have anticipated several of Edison\'s breakthroughs, though documentation is regrettably lacking. {pronoun_cap} continues to tinker in a workshop near {currentNeighborhood}, supported by family patience.'
        ]
    },
    'Critic': {
        description: 'A professional reviewer of art, literature, or culture',
        dialogueStyles: [
            'Delivers opinions as if pronouncing sentences, with the authority of absolute conviction.',
            'Peppers speech with French, German, and classical references to signal erudition.',
            'Praises and condemns with equal facility, depending on current allegiances.',
            'Speaks of artistic matters with the passion others reserve for politics or religion.'
        ],
        goals: [
            'Formulate devastating opinions about the Exposition\'s aesthetic failures',
            'Encounter fellow critics to exchange intelligence and grievances',
            'Discover some overlooked exhibit to champion before rivals notice it',
            'Compose the perfect phrase to destroy a reputation'
        ],
        educationRequired: true,
        socialClass: 'professional',
        typicalAge: { min: 30, max: 70 },
        biographyTemplates: [
            '{name}\'s reviews in {publication} have made and broken careers. Educated at {university} in {birthplace}, {pronoun} applies the same rigorous standards to art that Torquemada applied to heresy.',
            'Born in {birthplace}, {name} developed strong opinions early and has never found reason to revise them. {possessive_cap} column in {publication} is read with dread by artists across Europe.',
            '{name} began as a {previousJob} in {birthplace} before discovering that criticizing art paid better than making it. {pronoun_cap} now holds court at the Café de la Paix, dispensing judgments like a hanging judge.'
        ]
    },
    'Poet': {
        description: 'A writer of verse, often of the Symbolist or Decadent schools',
        dialogueStyles: [
            'Speaks in metaphors and images, treating ordinary conversation as raw material for verse.',
            'Affects a melancholy air, as if burdened by visions denied to ordinary mortals.',
            'Quotes Baudelaire, Verlaine, and Rimbaud as if they were personal acquaintances—which they may be.',
            'Pauses dramatically before speaking, as if awaiting inspiration from the muse.'
        ],
        goals: [
            'Find inspiration in the mechanical sublime of the modern age',
            'Avoid creditors while maintaining an appearance of bohemian elegance',
            'Compose verses on the napkins of the café where credit has not yet expired',
            'Encounter a beautiful stranger who might become immortal in verse'
        ],
        educationRequired: true,
        socialClass: 'bohemian',
        typicalAge: { min: 18, max: 45 },
        biographyTemplates: [
            '{name} published a slim volume of verses at {possessive} own expense in {publicationYear}. Reviews were mixed, by which we mean there were none. {pronoun_cap} continues to write, sustained by absinthe and conviction.',
            'Born in {birthplace} to a family of {parentOccupation}s, {name} rebelled through the medium of poetry. {pronoun_cap} has since become a fixture of Montmartre literary circles, admired for {possessive} {poeticQuality}.',
            '{name} claims to have renounced the bourgeois comforts of {possessive} {birthplace} upbringing for the purity of art. The allowance from {possessive} family suggests the renunciation is incomplete.'
        ]
    },
    'Diplomat': {
        description: 'A representative of a foreign government',
        dialogueStyles: [
            'Speaks with careful ambiguity, saying much while committing to nothing.',
            'Employs perfect manners as both shield and weapon.',
            'References international affairs with the casual familiarity of an insider.',
            'Flatters with professional skill while revealing nothing of personal opinion.'
        ],
        goals: [
            'Assess the military implications of the new technologies on display',
            'Cultivate contacts among the delegations of rival powers',
            'Report on public sentiment toward {country}',
            'Attend the reception at the {venue} without creating an incident'
        ],
        educationRequired: true,
        socialClass: 'upper',
        typicalAge: { min: 30, max: 70 },
        maleOnly: true,
        biographyTemplates: [
            '{name} has represented {country} in capitals across Europe. Born to a {parentOccupation} in {birthplace}, {pronoun} entered the diplomatic service after {university} and has since risen through a combination of ability and advantageous connections.',
            'A career diplomat of the old school, {name} served in {previousPosting} before the current assignment. {pronoun_cap} speaks five languages fluently and lies equally well in all of them.',
            '{name} comes from one of {birthplace}\'s most distinguished families. The diplomatic service was a natural choice for someone raised to navigate the treacherous waters of high society.'
        ]
    },
    'Dancer': {
        description: 'A performer in ballet, cabaret, or theatrical productions',
        dialogueStyles: [
            'Speaks with theatrical expressiveness, every gesture choreographed.',
            'Uses theatrical slang and backstage gossip with casual familiarity.',
            'Displays the false modesty of someone accustomed to applause.',
            'Laughs easily but watches carefully, assessing everyone as a potential patron or rival.'
        ],
        goals: [
            'Be noticed by an influential impresario or wealthy admirer',
            'Rest aching feet while maintaining an appearance of effortless grace',
            'Avoid former lovers while cultivating potential new ones',
            'Find an affordable meal before tonight\'s performance'
        ],
        educationRequired: false,
        socialClass: 'bohemian',
        typicalAge: { min: 16, max: 35 },
        femaleOnly: true,
        biographyTemplates: [
            '{name} dances at the {venue}, having arrived in Paris from {birthplace} with nothing but talent and ambition. The stage name conceals a history {pronoun} prefers not to discuss.',
            'Born to a {parentOccupation} in {birthplace}, {name} escaped provincial obscurity through the only avenue open to a girl of her circumstances. {pronoun_cap} has since become a featured performer at {venue}.',
            '{name}\'s beauty and grace have earned {object} admirers in high places. Whether this represents triumph or tragedy depends on one\'s perspective—and {possessive} has grown philosophical on the subject.'
        ]
    },
    'Governess': {
        description: 'A woman employed to educate children in a private household',
        dialogueStyles: [
            'Speaks with careful propriety, ever conscious of her ambiguous social position.',
            'Uses precise grammar and elevated vocabulary, evidence of genuine education.',
            'Deflects personal questions with practiced skill.',
            'Observes everything while appearing to notice nothing.'
        ],
        goals: [
            'Accompany charges through the Exhibition while maintaining decorum',
            'Find moments of personal freedom amid constant supervision',
            'Avoid encountering former employers or their gossip',
            'Dream quietly of a different life'
        ],
        educationRequired: true,
        socialClass: 'middle',
        typicalAge: { min: 20, max: 45 },
        femaleOnly: true,
        biographyTemplates: [
            '{name}\'s father was a {parentOccupation} in {birthplace}; his death left the family in circumstances requiring {object} to earn her living. {pronoun_cap} now educates the children of families wealthier and less cultured than her own.',
            'Educated at {school} in {birthplace}, {name} possessed every qualification for marriage except a dowry. The governess trade offers independence of a sort—and proximity to a world {pronoun} can observe but never enter.',
            '{name} has served in three households since leaving {birthplace}. {pronoun_cap} speaks French, German, and English fluently, plays piano adequately, and keeps her opinions to herself—the essential qualifications.'
        ]
    },
    'Merchant': {
        description: 'A trader or shopkeeper dealing in goods',
        dialogueStyles: [
            'Speaks with the easy confidence of someone who knows the price of everything.',
            'Assesses everything and everyone in terms of value and potential profit.',
            'Uses the expansive bonhomie of a natural salesman.',
            'Shifts between obsequious and overbearing depending on the customer.'
        ],
        goals: [
            'Identify new products to import from the colonial exhibits',
            'Network with potential business partners from abroad',
            'Assess competitor displays for ideas worth stealing',
            'Calculate the commercial potential of electrical lighting'
        ],
        educationRequired: false,
        socialClass: 'middle',
        typicalAge: { min: 25, max: 70 },
        biographyTemplates: [
            '{name} built a successful {tradeType} business in {birthplace} before expanding to Paris. {pronoun_cap} sees the Exposition as an opportunity—everything is, to {object}, an opportunity.',
            'Starting with a single cart in {birthplace}, {name} now operates premises in three cities. {pronoun_cap} attributes success to hard work, sharp practice, and knowing when to extend credit.',
            '{name}\'s family has traded in {tradeType} for generations in {birthplace}. {pronoun_cap} represents the firm at the Exposition, seeking both goods and contacts.'
        ]
    },
    'Physician': {
        description: 'A doctor of medicine',
        dialogueStyles: [
            'Speaks with clinical precision, habitually diagnosing everyone met.',
            'Uses medical terminology freely, then condescends to explain.',
            'Displays the calm authority of someone accustomed to life-and-death decisions.',
            'Listens carefully—a professional habit that unnerves those expecting small talk.'
        ],
        goals: [
            'Attend the International Congress of Hygiene',
            'Examine new medical instruments in the scientific exhibits',
            'Consult with foreign colleagues on recent advances',
            'Escape, briefly, the endless demands of patients'
        ],
        educationRequired: true,
        socialClass: 'professional',
        typicalAge: { min: 28, max: 70 },
        maleOnly: true,
        biographyTemplates: [
            'Dr. {name} trained at the Faculty of Medicine in {medicalSchool} before establishing a practice in {currentCity}. {pronoun_cap} specializes in {specialty}, treating patients from {patientClass}.',
            'Born in {birthplace}, {name} pursued medicine against family wishes. {possessive_cap} reputation for {medicalQuality} has since silenced all objections.',
            '{name} served as a military surgeon in {conflict} before returning to civilian practice. The experience left {object} with both valuable skills and memories {pronoun} prefers not to discuss.'
        ]
    },
    'Student': {
        description: 'A young person pursuing higher education',
        dialogueStyles: [
            'Speaks with the passionate certainty of someone who has recently discovered ideas.',
            'Quotes professors and philosophers with the enthusiasm of recent conversion.',
            'Argues energetically about everything, convinced that debate solves problems.',
            'Affects a sophisticated cynicism that imperfectly masks genuine idealism.'
        ],
        goals: [
            'Explore the Exposition before funds run out entirely',
            'Avoid professors who might expect academic progress',
            'Meet interesting people outside the usual university circles',
            'Find cheap food and cheaper entertainment'
        ],
        educationRequired: true,
        socialClass: 'middle',
        typicalAge: { min: 17, max: 27 },
        biographyTemplates: [
            '{name} studies {subject} at {university}, supported by a family in {birthplace} who expect great things—or at least a degree. The Exposition provides welcome distraction from both.',
            'The {ordinal} child of a {parentOccupation} from {birthplace}, {name} is the first in the family to attend university. {pronoun_cap} takes {possessive} studies seriously—most of the time.',
            '{name} came to Paris from {birthplace} ostensibly to study {subject}. The education {pronoun} has received in café philosophy and Latin Quarter life was not in the prospectus.'
        ]
    },
    'Servant': {
        description: 'A domestic employee in service to a household',
        dialogueStyles: [
            'Speaks with careful deference, revealing nothing of personal opinion.',
            'Uses formal address habitually, even when not required.',
            'Observes keenly while appearing invisible—a professional requirement.',
            'Relaxes into natural speech only among social equals.'
        ],
        goals: [
            'Accompany employers through the Exposition without incident',
            'Seize rare moments of personal time amid constant duty',
            'Observe marvels that will make stories for below-stairs',
            'Avoid the embarrassment of encountering acquaintances in livery'
        ],
        educationRequired: false,
        socialClass: 'working',
        typicalAge: { min: 15, max: 60 },
        biographyTemplates: [
            '{name} has served in the {employerFamily} household for {yearsService} years. Born in {birthplace}, {pronoun} entered service at {startAge} and has risen to the position of {position}.',
            'Circumstances in {birthplace} left few options for {name}. Service in a respectable household offers security, if not freedom—and {pronoun} has learned to value security.',
            '{name} came to Paris from {birthplace} seeking opportunity. {pronoun_cap} found it in the servant\'s entrance of a {employerClass} household, where {pronoun} has made {reflexive} indispensable.'
        ]
    },
    'Actress': {
        description: 'A performer in theatrical productions',
        dialogueStyles: [
            'Speaks with theatrical projection and dramatic emphasis.',
            'Treats every conversation as a potential scene to be played.',
            'Uses laughter and tears with the facility of professional training.',
            'Drops mentions of famous admirers and important roles with practiced casualness.'
        ],
        goals: [
            'Be recognized by admirers while appearing modestly surprised',
            'Assess rivals\' jewels and costumes for comparison',
            'Encounter influential theatrical producers',
            'Rest before tonight\'s performance without ruining makeup'
        ],
        educationRequired: false,
        socialClass: 'bohemian',
        typicalAge: { min: 18, max: 50 },
        femaleOnly: true,
        biographyTemplates: [
            '{name}—her stage name, naturally—has performed at {venue} to considerable acclaim. Her origins in {birthplace} have been variously embroidered to suit different audiences.',
            'Born to a theatrical family in {birthplace}, {name} made her debut at {debutAge}. {pronoun_cap} has since become known for {theatricalQuality} that critics either praise or deplore.',
            '{name} escaped a {parentOccupation}\'s life in {birthplace} via the stage. Whether the exchange was advantageous remains a subject of her private reflections.'
        ]
    },
    // ============================================================================
    // NEW PROFESSIONS (added for historical accuracy)
    // ============================================================================
    'Novelist': {
        description: 'A writer of prose fiction',
        dialogueStyles: [
            'Speaks in carefully constructed sentences, as if drafting prose in real-time.',
            'Observes minutely, cataloguing details that might appear in future work.',
            'Discusses literature with the competitive edge of a professional.',
            'Alternates between self-deprecation and barely concealed pride in craft.'
        ],
        goals: [
            'Observe characters for potential use in fiction',
            'Find a quiet corner to make notes',
            'Avoid fellow writers who might talk about sales figures',
            'Experience something worth writing about'
        ],
        educationRequired: true,
        socialClass: 'professional',
        typicalAge: { min: 25, max: 70 },
        biographyTemplates: [
            '{name} published {possessive} first novel in {publicationYear} to {adjective} reviews. Born in {birthplace}, {pronoun} now divides time between writing and the exhausting business of being a public figure.',
            'After an education in {birthplace}, {name} turned to fiction as a means of making sense of the modern world. {possessive_cap} latest work explores themes of {literaryTheme}.',
            '{name}\'s novels have earned both critical acclaim and commercial success—or so {pronoun} claims. The reality is somewhat more modest, but {pronoun} perseveres.'
        ]
    },
    'Dramatist': {
        description: 'A writer of theatrical plays',
        dialogueStyles: [
            'Speaks with theatrical flair, treating conversation as performance.',
            'Structures sentences for maximum dramatic effect.',
            'Discusses the theatre world with intimate knowledge of its rivalries.',
            'Gestures expansively while speaking, as if directing invisible actors.'
        ],
        goals: [
            'Secure a producer for the new play',
            'Observe human nature for dialogue inspiration',
            'Avoid actors demanding rewrites',
            'Witness a scene worth dramatizing'
        ],
        educationRequired: true,
        socialClass: 'bohemian',
        typicalAge: { min: 25, max: 65 },
        biographyTemplates: [
            '{name}\'s plays have been performed at {venue}, though success has been as fickle as any leading lady. Born in {birthplace}, {pronoun} writes for the stage with {adjective} determination.',
            'The theatre claimed {name} early; born in {birthplace}, {pronoun} abandoned more respectable pursuits to write for the boards. The Comédie-Française remains the ultimate goal.',
            '{name} has written {patentCount} plays, of which perhaps {successCount} merit revival. {pronoun_cap} continues writing, convinced the next will be the masterpiece.'
        ]
    },
    'Composer': {
        description: 'A creator of musical compositions',
        dialogueStyles: [
            'Speaks with the intensity of one who hears music in everything.',
            'Hums or taps rhythms unconsciously while conversing.',
            'Discusses music with the authority of professional expertise.',
            'Grows animated when discussing composition, distracted when the topic turns elsewhere.'
        ],
        goals: [
            'Hear the Russian concerts at the Trocadéro',
            'Find inspiration in the exotic music of the colonial exhibits',
            'Secure a commission for a new work',
            'Avoid rival composers and their poisonous gossip'
        ],
        educationRequired: true,
        socialClass: 'bohemian',
        typicalAge: { min: 22, max: 70 },
        biographyTemplates: [
            '{name} studied at the Conservatoire before establishing a reputation for {musicalStyle}. Born in {birthplace}, {pronoun} now composes works that critics find {adjective}.',
            'From {birthplace}, {name} came to Paris seeking musical fortune. {possessive_cap} compositions blend tradition with innovation in ways that divide opinion.',
            '{name}\'s opera premiered at {venue} in {publicationYear}. The reviews were mixed, but {pronoun} remains convinced of {possessive} genius.'
        ]
    },
    'Musician': {
        description: 'A performer of music',
        dialogueStyles: [
            'Speaks with the precise diction of professional performance.',
            'Makes unconscious gestures as if playing an invisible instrument.',
            'Discusses musical matters with technical authority.',
            'Shows the careful attention to physical wellbeing of one who depends on fingers or voice.'
        ],
        goals: [
            'Rest before tonight\'s concert',
            'Avoid strain on voice or hands',
            'Network with influential patrons',
            'Experience the exotic musical traditions on display'
        ],
        educationRequired: true,
        socialClass: 'bohemian',
        typicalAge: { min: 18, max: 60 },
        biographyTemplates: [
            '{name} performs {instrument} with {musicalEnsemble}. Training in {birthplace} laid the foundation for a career that now takes {object} across Europe.',
            'Born to a musical family in {birthplace}, {name} showed talent early. {pronoun_cap} now performs at {venue}, earning both applause and a precarious living.',
            '{name}\'s virtuosity on the {instrument} has earned recognition, if not fortune. {pronoun_cap} dreams of solo billing but accepts ensemble work philosophically.'
        ]
    },
    'Architect': {
        description: 'A designer of buildings and structures',
        dialogueStyles: [
            'Speaks of space and proportion with passionate precision.',
            'Evaluates every building with a professional eye.',
            'Uses architectural vocabulary freely, gesturing to indicate dimensions.',
            'Discusses Eiffel\'s tower with complex feelings of admiration and rivalry.'
        ],
        goals: [
            'Study the structural innovations of the Exposition buildings',
            'Secure commissions from impressed visitors',
            'Debate the aesthetics of iron construction',
            'Document designs that might inspire future work'
        ],
        educationRequired: true,
        socialClass: 'professional',
        typicalAge: { min: 28, max: 70 },
        maleOnly: true,
        biographyTemplates: [
            '{name} trained at the École des Beaux-Arts before establishing a practice in {currentCity}. Born in {birthplace}, {pronoun} has designed {buildingType} that demonstrate {adjective} principles.',
            'The son of a {parentOccupation} from {birthplace}, {name} discovered architecture early. {possessive_cap} buildings now stand in three countries.',
            '{name}\'s designs blend classical principles with modern materials. The Exposition offers both inspiration and humbling comparison to peers.'
        ]
    },
    'Lawyer': {
        description: 'A practitioner of law',
        dialogueStyles: [
            'Speaks with precise, argumentative clarity.',
            'Qualifies statements carefully, anticipating objections.',
            'Uses legal terminology with professional ease.',
            'Listens with the attention of one trained to find weaknesses in arguments.'
        ],
        goals: [
            'Represent clients with interests at the Exposition',
            'Network with international colleagues',
            'Escape the courtroom for cultural pursuits',
            'Assess the legal implications of new technologies'
        ],
        educationRequired: true,
        socialClass: 'professional',
        typicalAge: { min: 28, max: 70 },
        biographyTemplates: [
            '{name} practices law in {currentCity}, specializing in {legalSpecialty}. Education at {university} in {birthplace} prepared {object} for a career of forensic combat.',
            'Born to a family of lawyers in {birthplace}, {name} continued the tradition. {possessive_cap} reputation for {adjective} advocacy precedes {object}.',
            '{name} left a {parentOccupation}\'s life in {birthplace} for the bar. Success came through a combination of ability and relentless ambition.'
        ]
    },
    'Scientist': {
        description: 'A researcher in natural philosophy or the sciences',
        dialogueStyles: [
            'Speaks with methodical precision, qualifying claims with evidence.',
            'Shows enthusiasm when discussing research, reserve on other topics.',
            'Uses specialized vocabulary, then apologizes for jargon.',
            'Approaches all questions with empirical curiosity.'
        ],
        goals: [
            'Attend the International Congress in {possessive} specialty',
            'Examine scientific instruments on display',
            'Exchange ideas with foreign colleagues',
            'Escape the laboratory for inspiration'
        ],
        educationRequired: true,
        socialClass: 'professional',
        typicalAge: { min: 25, max: 75 },
        biographyTemplates: [
            '{name} researches {scientificField} at {university}. Born in {birthplace}, {pronoun} has published extensively on {scientificTopic}.',
            'A graduate of {university}, {name} has devoted {possessive} career to understanding {scientificField}. The work is obscure but, {pronoun} insists, important.',
            '{name}\'s contributions to {scientificField} have earned recognition in select circles. The broader public remains, perhaps blessedly, unaware.'
        ]
    },
    'Photographer': {
        description: 'A practitioner of the new art of photography',
        dialogueStyles: [
            'Speaks with the technical precision of a craftsman.',
            'Evaluates light and composition constantly.',
            'Discusses the artistic possibilities of the medium with enthusiasm.',
            'Uses photography jargon freely—exposure, development, silver salts.'
        ],
        goals: [
            'Capture images of the Exposition for posterity',
            'Secure portrait commissions from visitors',
            'Examine the latest camera equipment on display',
            'Find the perfect light for an historic shot'
        ],
        educationRequired: false,
        socialClass: 'middle',
        typicalAge: { min: 22, max: 55 },
        biographyTemplates: [
            '{name} operates a photographic studio in {currentCity}. Born in {birthplace}, {pronoun} discovered the camera\'s potential early and has never looked back.',
            'The chemical mysteries of photography first captivated {name} in {birthplace}. Now based in Paris, {pronoun} documents the modern age with silver and light.',
            '{name}\'s photographs have appeared in {publication}. {pronoun_cap} considers photography an art form—a position not all artists accept.'
        ]
    },
    'Banker': {
        description: 'A financier or money manager',
        dialogueStyles: [
            'Speaks with the quiet confidence of someone who understands money.',
            'Assesses everything in terms of value and return.',
            'Uses financial terminology casually, assuming comprehension.',
            'Displays discretion about specific matters while projecting general expertise.'
        ],
        goals: [
            'Evaluate investment opportunities in new technologies',
            'Entertain important clients at the Exposition',
            'Assess the financial health of various national exhibits',
            'Escape the office for a rare day of leisure'
        ],
        educationRequired: true,
        socialClass: 'upper',
        typicalAge: { min: 30, max: 70 },
        maleOnly: true,
        biographyTemplates: [
            '{name} is a partner at {bankName}. Born to a {parentOccupation} in {birthplace}, {pronoun} rose through ability and advantageous connections.',
            'The {name} family has been in banking for generations. {pronoun_cap} continues the tradition from offices in {currentCity}, managing fortunes both modest and vast.',
            '{name} came to finance from {previousJob}. {possessive_cap} talent for numbers and nerve for risk proved more valuable than pedigree.'
        ]
    },
    'Industrialist': {
        description: 'An owner or manager of industrial enterprises',
        dialogueStyles: [
            'Speaks with the authority of someone who employs thousands.',
            'Discusses production and efficiency with genuine enthusiasm.',
            'Shows impatience with impractical ideas and theoretical concerns.',
            'Uses business vocabulary—capital, output, labor costs—naturally.'
        ],
        goals: [
            'Study competitors\' machinery displays',
            'Network with potential partners and suppliers',
            'Assess new technologies for adoption',
            'Display company products to international visitors'
        ],
        educationRequired: false,
        socialClass: 'upper',
        typicalAge: { min: 35, max: 75 },
        maleOnly: true,
        biographyTemplates: [
            '{name} built the {companyName} manufactory from nothing. Born in {birthplace}, {pronoun} now employs hundreds in the {industry} trade.',
            'The {name} family {industry} works have operated in {birthplace} for three generations. {pronoun_cap} represents the modern face of industrial capitalism.',
            '{name}\'s factories produce {product}. {possessive_cap} rise from {parentOccupation}\'s son to industrial titan is the stuff of bourgeois legend.'
        ]
    },
    'Military Officer': {
        description: 'A commissioned officer in the armed forces',
        dialogueStyles: [
            'Speaks with clipped military precision.',
            'Uses military vocabulary and references to campaigns naturally.',
            'Shows the trained posture and bearing of professional soldiers.',
            'Assesses situations tactically, even in civilian contexts.'
        ],
        goals: [
            'Examine military technologies on display',
            'Represent the regiment with appropriate dignity',
            'Assess foreign military capabilities',
            'Enjoy leave while maintaining proper bearing'
        ],
        educationRequired: true,
        socialClass: 'upper',
        typicalAge: { min: 22, max: 65 },
        maleOnly: true,
        biographyTemplates: [
            'Captain {name} of the {regiment} served in {campaign}. Born to a military family in {birthplace}, {pronoun} has followed the colors since Saint-Cyr.',
            '{name} rose through the ranks from {birthplace} obscurity to commissioned officer. {possessive_cap} {militaryQuality} has earned both medals and the respect of subordinates.',
            'The uniform of the {regiment} fits {name} well. {pronoun_cap} has served France in {campaign} and carries the memories, visible and invisible.'
        ]
    },
    'Naval Officer': {
        description: 'A commissioned officer in the navy',
        dialogueStyles: [
            'Speaks with the salt-tinged vocabulary of the sea.',
            'References ports and voyages casually.',
            'Shows the weathered confidence of one who has commanded at sea.',
            'Uses nautical terms naturally, sometimes forgetting landlubbers may not understand.'
        ],
        goals: [
            'Examine naval technologies and ship models',
            'Represent the service with dignity on land',
            'Network with foreign naval colleagues',
            'Enjoy solid ground while leave permits'
        ],
        educationRequired: true,
        socialClass: 'upper',
        typicalAge: { min: 25, max: 60 },
        maleOnly: true,
        biographyTemplates: [
            'Lieutenant {name} has sailed to {destination} aboard {shipName}. Born in {birthplace}, the sea claimed {object} young and has not released its grip.',
            '{name}\'s family has produced naval officers for generations in {birthplace}. {pronoun_cap} continues the tradition, currently assigned to {shipName}.',
            'From the naval academy to deck command, {name} has risen through merit and {adjective} seamanship. The Exposition\'s maritime exhibits draw {possessive} professional eye.'
        ]
    },
    'Artisan': {
        description: 'A skilled craftsperson in a traditional trade',
        dialogueStyles: [
            'Speaks with the practical directness of a craftsman.',
            'Uses technical vocabulary of the trade naturally.',
            'Shows pride in workmanship and tradition.',
            'Evaluates quality with professional expertise.'
        ],
        goals: [
            'Study techniques in the craft exhibits',
            'Represent the guild with appropriate skill',
            'Find inspiration for new designs',
            'Assess whether machines threaten the trade'
        ],
        educationRequired: false,
        socialClass: 'working',
        typicalAge: { min: 20, max: 65 },
        biographyTemplates: [
            '{name} is a master {trade} in {currentCity}. Apprenticed at {startAge} in {birthplace}, {pronoun} has spent a lifetime perfecting the craft.',
            'Three generations of {possessive} family have worked as {trade}s in {birthplace}. {name} continues the tradition while adapting to modern demands.',
            '{name} learned the {trade} trade in {birthplace}. {possessive_cap} work now commands respect from those who know quality.'
        ]
    },
    'Seamstress': {
        description: 'A woman who sews for a living',
        dialogueStyles: [
            'Speaks quietly and practically, economy of words reflecting economy of means.',
            'Uses dressmaking vocabulary naturally.',
            'Shows keen awareness of fashion and fabric.',
            'Maintains dignity despite humble circumstances.'
        ],
        goals: [
            'Study the fashions on display for inspiration',
            'Enjoy a rare day away from the needle',
            'Find fabric bargains in the textile exhibits',
            'Dream of opening a proper atelier'
        ],
        educationRequired: false,
        socialClass: 'working',
        typicalAge: { min: 16, max: 55 },
        femaleOnly: true,
        biographyTemplates: [
            '{name} sews for a dressmaker in {currentCity}. Born in {birthplace}, {pronoun} came to Paris seeking work and found it—twelve hours a day, six days a week.',
            'The needle has been {name}\'s companion since childhood in {birthplace}. {pronoun_cap} now creates garments for women far wealthier than {pronoun} will ever be.',
            '{name}\'s tiny stitches are invisible; so, often, is {pronoun}. {pronoun_cap} works in the back rooms of fashion, dreaming of the front.'
        ]
    },
    'Exhibition Commissioner': {
        description: 'An official representative of a national or colonial exhibit',
        dialogueStyles: [
            'Speaks with official authority and promotional enthusiasm.',
            'Uses diplomatic language when discussing sensitive matters.',
            'Displays encyclopedic knowledge of their country\'s exhibit.',
            'Balances national pride with international courtesy.'
        ],
        goals: [
            'Promote the national exhibit to visitors',
            'Network with other commissioners',
            'Ensure the exhibit reflects well on the nation',
            'Secure favorable coverage from journalists'
        ],
        educationRequired: true,
        socialClass: 'professional',
        typicalAge: { min: 35, max: 65 },
        biographyTemplates: [
            '{name} represents {country} at the Exposition. A career in {previousPosting} prepared {object} for this most visible of diplomatic assignments.',
            'Born in {birthplace}, {name} has served {country} in various capacities. The Exposition commission represents both honor and exhausting responsibility.',
            '{name}\'s task is to present {country} in the best possible light. Given international competition, this requires diplomatic skill and considerable stamina.'
        ]
    },
    'Colonial Administrator': {
        description: 'A government official serving in colonial territories',
        dialogueStyles: [
            'Speaks with the authority of one who has governed distant peoples.',
            'Uses colonial vocabulary—natives, territories, civilizing mission—casually.',
            'Shows the weather-beaten confidence of tropical service.',
            'Discusses colonial matters with expertise and problematic assumptions.'
        ],
        goals: [
            'Examine the colonial exhibits with professional interest',
            'Represent the colonial service with appropriate dignity',
            'Escape the tropical heat—or miss it, depending on temperament',
            'Network with colleagues from other colonial powers'
        ],
        educationRequired: true,
        socialClass: 'professional',
        typicalAge: { min: 30, max: 60 },
        maleOnly: true,
        biographyTemplates: [
            '{name} has served in {colony} for {yearsService} years. Born in {birthplace}, {pronoun} found in colonial service an escape from provincial limits.',
            'The colonial administration claimed {name} after {university}. {pronoun_cap} has since governed in {colony}, learning lessons not taught in France.',
            '{name}\'s career has taken {object} from {birthplace} to {colony}. The Exposition\'s colonial section represents both {possessive} life\'s work and its contradictions.'
        ]
    },
    'Courtesan': {
        description: 'A woman of expensive tastes supported by wealthy admirers',
        dialogueStyles: [
            'Speaks with cultivated charm and strategic warmth.',
            'Uses conversation as a professional tool.',
            'Displays impeccable taste and social knowledge.',
            'Maintains elegant mystery about personal circumstances.'
        ],
        goals: [
            'Be seen at the most fashionable displays',
            'Encounter potential new admirers',
            'Assess rivals\' jewels and arrangements',
            'Maintain the appearance of leisured elegance'
        ],
        educationRequired: false,
        socialClass: 'bohemian',
        typicalAge: { min: 18, max: 40 },
        femaleOnly: true,
        biographyTemplates: [
            '{name}—the name under which {pronoun} is known—maintains an establishment in {fashionableNeighborhood}. {possessive_cap} origins in {birthplace} are never discussed.',
            'From humble beginnings in {birthplace}, {name} has risen to a position of expensive precariousness. {possessive_cap} jewels are real; {possessive} security is not.',
            '{name}\'s beauty and wit have attracted admirers from {admirerClass}. {pronoun_cap} navigates this world with the skill of a diplomat and the pragmatism of a merchant.'
        ]
    },
    'Opera Singer': {
        description: 'A professional vocalist in operatic productions',
        dialogueStyles: [
            'Speaks with trained vocal projection.',
            'Treats conversation as extended vocal exercise.',
            'Discusses music with passionate expertise.',
            'Shows the diva temperament in conversation.'
        ],
        goals: [
            'Rest the voice before tonight\'s performance',
            'Be recognized by admirers',
            'Assess the competition at the Russian concerts',
            'Maintain the throat in the dusty Exposition air'
        ],
        educationRequired: true,
        socialClass: 'bohemian',
        typicalAge: { min: 20, max: 55 },
        biographyTemplates: [
            '{name} sings at the Opéra, having trained in {birthplace} and perfected the art in Italy. {possessive_cap} {voiceType} has earned critical acclaim.',
            'Born to a musical family in {birthplace}, {name} showed vocal talent early. The stage of the Opéra was always the destination.',
            '{name}\'s voice—a {voiceType} of remarkable power—has conquered audiences from {venue} to La Scala. {pronoun_cap} lives for the stage.'
        ]
    },
    'Priest': {
        description: 'A Catholic clergyman',
        dialogueStyles: [
            'Speaks with pastoral concern and theological reference.',
            'Uses religious vocabulary naturally.',
            'Shows patience and listening skills honed in confession.',
            'Balances Church authority with human understanding.'
        ],
        goals: [
            'Observe the crowds with pastoral concern',
            'Assess the moral implications of modern spectacle',
            'Minister to souls amid secular distraction',
            'Find the religious exhibits among the mechanical'
        ],
        educationRequired: true,
        socialClass: 'professional',
        typicalAge: { min: 25, max: 75 },
        maleOnly: true,
        biographyTemplates: [
            'Father {name} serves the parish of {parish} in {currentCity}. Seminary in {birthplace} prepared {object} for pastoral work, though nothing prepares one entirely.',
            'Born to a pious family in {birthplace}, {name} heard the call early. {pronoun_cap} now tends souls in {currentCity}, finding grace even amid modernity.',
            '{name}\'s cassock draws glances in the secular crowd. {pronoun_cap} serves the Church in {currentCity}, bringing traditional faith to modern circumstances.'
        ]
    },
    'Missionary': {
        description: 'A religious emissary to foreign lands',
        dialogueStyles: [
            'Speaks with the fervor of religious conviction.',
            'References distant lands and peoples with intimate familiarity.',
            'Uses missionary vocabulary—souls, conversion, heathen darkness.',
            'Shows the determination of one who has faced hardship for faith.'
        ],
        goals: [
            'Raise support for the mission',
            'Examine the colonial exhibits with evangelical interest',
            'Share tales of the mission field',
            'Gather supplies before returning abroad'
        ],
        educationRequired: true,
        socialClass: 'professional',
        typicalAge: { min: 25, max: 65 },
        biographyTemplates: [
            'Father {name} has spent {yearsService} years in {missionField}. Born in {birthplace}, {pronoun} answered the call to bring light to distant darkness.',
            '{name}\'s mission in {missionField} has occupied {possessive} adult life. The Exposition\'s colonial section represents, to {object}, souls not yet saved.',
            'From {birthplace} to {missionField}: {name}\'s journey has been geographical and spiritual. {pronoun_cap} returns to France briefly, already missing the mission.'
        ]
    },
    'Anarchist': {
        description: 'A radical opposed to all forms of government authority',
        dialogueStyles: [
            'Speaks with revolutionary fervor barely concealed.',
            'Uses political vocabulary—bourgeoisie, exploitation, liberation.',
            'Shows contempt for wealth and authority.',
            'Alternates between paranoid caution and passionate declaration.'
        ],
        goals: [
            'Observe the capitalist spectacle with critical eye',
            'Make contact with international comrades',
            'Distribute literature when police aren\'t watching',
            'Document the exploitation behind the progress'
        ],
        educationRequired: false,
        socialClass: 'working',
        typicalAge: { min: 18, max: 45 },
        biographyTemplates: [
            '{name}—not the name on official documents—works in {industry} by day. By night, {pronoun} labors for revolution from a garret in Belleville.',
            'Born to a {parentOccupation} in {birthplace}, {name} discovered Proudhon early and Kropotkin later. The Exposition represents everything {pronoun} opposes.',
            '{name}\'s politics were forged in {birthplace}\'s factories. {pronoun_cap} sees the Exposition not as progress but as monument to exploitation.'
        ]
    },
    'Socialist Organizer': {
        description: 'A political activist for workers\' rights and social reform',
        dialogueStyles: [
            'Speaks with rhetorical skill honed in meetings and debates.',
            'Uses socialist vocabulary—solidarity, class struggle, workers\' rights.',
            'Shows genuine concern for working conditions.',
            'Balances revolutionary ideals with practical organizing.'
        ],
        goals: [
            'Recruit workers from the Exposition construction sites',
            'Document working conditions for political purposes',
            'Coordinate with international socialist contacts',
            'Spread the message of workers\' solidarity'
        ],
        educationRequired: false,
        socialClass: 'working',
        typicalAge: { min: 22, max: 55 },
        biographyTemplates: [
            '{name} organizes for the Parti Ouvrier. Born in {birthplace}, {pronoun} learned politics in the factory and perfected them in the union hall.',
            'The son/daughter of a {parentOccupation}, {name} has dedicated {reflexive} to the workers\' cause. The Exposition\'s wonders are built on labor {pronoun} means to organize.',
            '{name}\'s speeches move workers to action. Born in {birthplace}, {pronoun} now works the factories and meetings of {currentCity}.'
        ]
    },
    'Republican Deputy': {
        description: 'An elected member of the French parliament',
        dialogueStyles: [
            'Speaks with practiced political rhetoric.',
            'Uses the language of the Republic—liberty, equality, progress.',
            'Shows the bonhomie of someone who needs votes.',
            'Balances conviction with political calculation.'
        ],
        goals: [
            'Be seen at the Exposition supporting the Republic',
            'Cultivate constituents and donors',
            'Assess political implications of the centennial',
            'Network with political allies and opponents'
        ],
        educationRequired: true,
        socialClass: 'upper',
        typicalAge: { min: 35, max: 70 },
        maleOnly: true,
        biographyTemplates: [
            'Député {name} represents {constituency} in the Chamber. A lawyer from {birthplace}, {pronoun} entered politics after {previousJob}.',
            '{name} has served the Republic in parliament for {yearsService} years. Born in {birthplace}, {pronoun} rose through local politics to national prominence.',
            'The Third Republic has no more loyal servant than {name}. {pronoun_cap} worked for the Exposition\'s success and now enjoys its reflected glory.'
        ]
    },
    'Foreign Dignitary': {
        description: 'A visiting notable from abroad',
        dialogueStyles: [
            'Speaks with the formal courtesy of diplomatic training.',
            'Uses French with varying degrees of fluency.',
            'Shows curiosity about French ways while representing home.',
            'Maintains dignified reserve appropriate to station.'
        ],
        goals: [
            'Represent the home country with appropriate dignity',
            'Study French innovations for possible adoption',
            'Attend official receptions and ceremonies',
            'Experience Paris while official duties permit'
        ],
        educationRequired: true,
        socialClass: 'upper',
        typicalAge: { min: 30, max: 70 },
        biographyTemplates: [
            '{title} {name} visits Paris as representative of {country}. Born to a distinguished family in {birthplace}, {pronoun} combines diplomatic duty with personal curiosity.',
            '{name} leads the {country} delegation to the Exposition. {possessive_cap} mission is to observe, evaluate, and report on French progress.',
            'The {country} government sent {name} to assess the Exposition. {pronoun_cap} approaches the task with the thoroughness expected of one of {birthplace}\'s finest.'
        ]
    },
    'Explorer': {
        description: 'A traveler to remote and unknown regions',
        dialogueStyles: [
            'Speaks with tales of distant lands and hardships overcome.',
            'Uses geographical vocabulary and references to maps.',
            'Shows restlessness in civilized surroundings.',
            'Recounts adventures with practiced storytelling skill.'
        ],
        goals: [
            'Examine geographical exhibits for accuracy',
            'Recruit support for the next expedition',
            'Share tales with appreciative audiences',
            'Find sponsors willing to fund adventure'
        ],
        educationRequired: false,
        socialClass: 'professional',
        typicalAge: { min: 25, max: 60 },
        biographyTemplates: [
            '{name} has traveled to {exoticDestination} and returned to tell the tale. Born in {birthplace}, {pronoun} found civilization confining from an early age.',
            'The Geographical Society has honored {name}\'s expeditions to {exoticDestination}. {pronoun_cap} came to the Exposition seeking funding for the next journey.',
            '{name}\'s maps of {exoticDestination} hang in the Geographical Society. {possessive_cap} restless spirit already plans the next departure.'
        ]
    },
    'Collector': {
        description: 'A gatherer of art, antiquities, or curiosities',
        dialogueStyles: [
            'Speaks with connoisseurial authority about objects.',
            'Uses specialized vocabulary of art and antiquity.',
            'Evaluates everything as potential acquisition.',
            'Shows competitive awareness of rival collectors.'
        ],
        goals: [
            'Discover overlooked treasures in the exhibits',
            'Network with dealers and fellow collectors',
            'Assess the colonial exhibits for acquisitions',
            'Protect reputation as a discerning eye'
        ],
        educationRequired: true,
        socialClass: 'upper',
        typicalAge: { min: 35, max: 75 },
        biographyTemplates: [
            '{name}\'s collection of {collectibleType} is renowned in connoisseur circles. Born in {birthplace}, {pronoun} has spent {possessive} fortune assembling treasures.',
            'The {name} collection represents a lifetime of acquisition. {pronoun_cap} haunts the Exposition seeking additions worthy of the hoard.',
            '{name} came to collecting through {previousJob}. Now {pronoun} hunts for {collectibleType} with the passion others reserve for love or politics.'
        ]
    }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const pickWeighted = <T>(items: { item: T; weight: number }[]): T => {
    const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
    let random = Math.random() * totalWeight;
    for (const { item, weight } of items) {
        random -= weight;
        if (random <= 0) return item;
    }
    return items[items.length - 1].item;
};

/**
 * Determine likely nationality based on surname patterns
 */
const inferNationalityFromName = (firstName: string, surname: string): string => {
    // Check surname patterns
    if (surname.match(/^(Mc|Mac|O')/i)) return 'british';
    if (surname.match(/^(von|van)/i)) return 'german';
    if (surname.match(/^(de|du|la|le)/i)) return 'french';
    if (surname.match(/^(Al-|El-|Ben|Ibn)/i)) return 'arabic';
    if (surname.match(/(ov|ev|ski|sky)$/i)) return 'russian';
    if (surname.match(/(ez|az)$/i)) return 'spanish';
    if (surname.match(/(ini|etti|elli|ucci|acci)$/i)) return 'italian';
    if (surname.match(/(moto|yama|awa|ura)$/i)) return 'japanese';

    // Check if name exists in our databases
    for (const [nat, names] of Object.entries(NAME_SETS)) {
        if (names.male.includes(firstName) || names.female.includes(firstName)) {
            return nat;
        }
        if (names.surnames.includes(surname)) {
            return nat;
        }
    }

    return 'french'; // Default for Paris setting
};

/**
 * Get appropriate locations based on nationality and skin tone
 */
const getLocationsForBackground = (nationality: string, skinTone?: SkinTone): Location[] => {
    switch (nationality) {
        case 'british': return BRITISH_LOCATIONS;
        case 'american':
            if (skinTone === 'dark' || skinTone === 'deep' || skinTone === 'warm_brown') {
                return [...AMERICAN_LOCATIONS, ...AFRICAN_LOCATIONS];
            }
            return AMERICAN_LOCATIONS;
        case 'german': return GERMAN_LOCATIONS;
        case 'italian': return ITALIAN_LOCATIONS;
        case 'spanish': return SPANISH_LOCATIONS;
        case 'russian': return RUSSIAN_LOCATIONS;
        case 'japanese': return EAST_ASIAN_LOCATIONS.filter(l => l.country === 'Japan');
        case 'chinese': return EAST_ASIAN_LOCATIONS.filter(l => l.country === 'China');
        case 'arabic': return MIDDLE_EASTERN_LOCATIONS;
        case 'african_diaspora': return AFRICAN_LOCATIONS;
        default:
            // For French, consider skin tone
            if (skinTone === 'olive' || skinTone === 'tan') {
                return [...FRENCH_LOCATIONS, ...ITALIAN_LOCATIONS, ...SPANISH_LOCATIONS];
            }
            if (skinTone === 'dark' || skinTone === 'deep' || skinTone === 'warm_brown') {
                return [...AFRICAN_LOCATIONS, ...MIDDLE_EASTERN_LOCATIONS];
            }
            if (skinTone === 'golden') {
                return EAST_ASIAN_LOCATIONS;
            }
            return FRENCH_LOCATIONS;
    }
};

/**
 * Generate a complete NPC biography
 */
export interface NPCBiography {
    birthplace: Location;
    currentResidence: Location;
    nationality: string;
    biography: string;
    dialogueStyle: string;
    goal: string;
    socialClass: string;
}

export const generateNPCBiography = (
    firstName: string,
    surname: string,
    gender: 'male' | 'female' | 'non-binary',
    profession: string,
    age: number,
    appearance?: AppearanceProfile
): NPCBiography => {
    const fullName = `${firstName} ${surname}`;
    const nationality = inferNationalityFromName(firstName, surname);
    const profData = PROFESSION_DATA[profession] || PROFESSION_DATA['Flâneur'];

    // Get appropriate locations
    const possibleLocations = getLocationsForBackground(nationality, appearance?.skinTone);
    const birthplace = pick(possibleLocations);

    // Current residence - usually Paris for people at the Exposition, but not always
    const residenceRoll = Math.random();
    let currentResidence: Location;
    if (residenceRoll < 0.6) {
        // Lives in Paris
        currentResidence = pick(FRENCH_LOCATIONS.filter(l => l.city === 'Paris'));
    } else if (residenceRoll < 0.85) {
        // Lives in France but not Paris
        currentResidence = pick(FRENCH_LOCATIONS.filter(l => l.city !== 'Paris'));
    } else {
        // Lives in birthplace or nearby
        currentResidence = birthplace;
    }

    // Generate pronouns
    const pronouns = {
        pronoun: gender === 'female' ? 'she' : gender === 'male' ? 'he' : 'they',
        pronoun_cap: gender === 'female' ? 'She' : gender === 'male' ? 'He' : 'They',
        possessive: gender === 'female' ? 'her' : gender === 'male' ? 'his' : 'their',
        possessive_cap: gender === 'female' ? 'Her' : gender === 'male' ? 'His' : 'Their',
        object: gender === 'female' ? 'her' : gender === 'male' ? 'him' : 'them',
        reflexive: gender === 'female' ? 'herself' : gender === 'male' ? 'himself' : 'themselves'
    };

    // Pick and fill biography template
    const template = pick(profData.biographyTemplates);

    // Generate contextual values for template
    const templateValues: Record<string, string> = {
        name: firstName,
        fullName: fullName,
        birthplace: birthplace.region ? `${birthplace.region}, ${birthplace.city}` : birthplace.city,
        ...pronouns,
        class: pick(['comfortable', 'modest', 'prosperous', 'reduced', 'genteel']),
        university: pick(['the Sorbonne', 'the École Normale', 'Oxford', 'Cambridge', 'Heidelberg', 'a provincial lycée']),
        publication: pick(['Le Figaro', 'Le Temps', 'Gil Blas', 'L\'Illustration', 'the Revue des Deux Mondes']),
        venue: pick(['the Salon', 'the Opéra', 'the Folies Bergère', 'the Comédie-Française', 'a modest gallery in Montmartre']),
        arrivalYear: String(1889 - Math.floor(Math.random() * 20)),
        parentOccupation: pick(['notary', 'merchant', 'physician', 'schoolmaster', 'clerk', 'farmer', 'army officer', 'shopkeeper']),
        adjective: pick(['ambitious', 'restless', 'brilliant', 'troubled', 'resourceful', 'determined']),
        familyBusiness: pick(['textile manufactory', 'shipping concern', 'wine trade', 'banking house', 'legal practice']),
        industry: pick(['metalwork', 'textile', 'printing', 'construction', 'transport', 'machinery']),
        startAge: String(Math.floor(10 + Math.random() * 6)),
        previousJob: pick(['clerk', 'shop assistant', 'waiter', 'tutor', 'copyist', 'actor']),
        currentNeighborhood: pick(['Belleville', 'the Marais', 'Montmartre', 'the Latin Quarter', 'Passy']),
        patentCount: String(Math.floor(5 + Math.random() * 20)),
        successCount: String(Math.floor(1 + Math.random() * 3)),
        title: pick(['Comte', 'Vicomte', 'Baron', 'Marquis']),
        artStyle: pick(['daringly modern', 'aggressively traditional', 'mysteriously symbolist', 'provocatively naturalist']),
        publicationYear: String(1880 + Math.floor(Math.random() * 9)),
        poeticQuality: pick(['obscurity', 'passion', 'technical virtuosity', 'scandalous imagery']),
        tradeType: pick(['textiles', 'antiquities', 'wines', 'machinery', 'colonial goods']),
        medicalSchool: pick(['Paris', 'Lyon', 'Montpellier', 'Vienna', 'Edinburgh']),
        currentCity: currentResidence.city,
        specialty: pick(['nervous disorders', 'surgery', 'obstetrics', 'tropical diseases', 'general practice']),
        patientClass: pick(['the poor of the public hospitals', 'the bourgeoisie', 'fashionable society', 'fellow artists']),
        medicalQuality: pick(['diagnostic brilliance', 'surgical skill', 'bedside manner', 'unorthodox methods']),
        conflict: pick(['the Crimea', 'the Franco-Prussian War', 'the colonial campaigns', 'the Commune']),
        subject: pick(['law', 'medicine', 'literature', 'philosophy', 'natural sciences', 'engineering']),
        ordinal: pick(['eldest', 'second', 'youngest', 'only']),
        yearsService: String(Math.floor(5 + Math.random() * 30)),
        position: pick(['butler', 'housekeeper', 'lady\'s maid', 'valet', 'footman', 'cook']),
        employerFamily: pick(['Rothschild', 'Dubois', 'Martin', 'a distinguished diplomatic', 'an aristocratic']),
        employerClass: pick(['banking', 'aristocratic', 'diplomatic', 'nouveaux riches']),
        debutAge: String(Math.floor(14 + Math.random() * 6)),
        theatricalQuality: pick(['passionate intensity', 'comic timing', 'physical grace', 'vocal power']),
        school: pick(['a convent school', 'a finishing school', 'the local lycée']),
        country: nationality === 'french' ? 'France' : NAME_SETS[nationality]?.nationality || 'France',
        previousPosting: pick(['Vienna', 'London', 'St. Petersburg', 'Berlin', 'Constantinople', 'Rome']),
        // New template values for expanded professions
        literaryTheme: pick(['displacement and belonging', 'the clash of old and new', 'the American in Europe', 'social ambition', 'artistic integrity']),
        musicalStyle: pick(['lyrical romanticism', 'modern dissonance', 'programmatic drama', 'chamber intimacy']),
        instrument: pick(['violin', 'piano', 'cello', 'flute', 'clarinet']),
        musicalEnsemble: pick(['the Conservatoire orchestra', 'the Opéra orchestra', 'a chamber ensemble', 'the Colonne concerts']),
        buildingType: pick(['municipal buildings', 'private residences', 'commercial premises', 'churches']),
        legalSpecialty: pick(['commercial law', 'criminal defense', 'property disputes', 'international trade']),
        scientificField: pick(['chemistry', 'physics', 'natural history', 'astronomy', 'medicine']),
        scientificTopic: pick(['molecular structures', 'electromagnetic phenomena', 'evolutionary theory', 'bacterial pathology']),
        bankName: pick(['Crédit Lyonnais', 'Banque de Paris', 'Rothschild Frères', 'a private banking house']),
        companyName: pick(['Creusot', 'Schneider', 'Wendel', 'a family']),
        product: pick(['steel', 'textiles', 'machinery', 'chemicals', 'glass']),
        regiment: pick(['the 5th Infantry', 'the Chasseurs', 'the Cuirassiers', 'the Zouaves', 'the Foreign Legion']),
        campaign: pick(['the Franco-Prussian War', 'the Tonkin expedition', 'the pacification of Algeria', 'the Italian campaign']),
        militaryQuality: pick(['tactical acumen', 'personal courage', 'strict discipline', 'care for the men']),
        destination: pick(['Indochina', 'Madagascar', 'the South Seas', 'Africa', 'South America']),
        shipName: pick(['the Dévastation', 'the Richelieu', 'the Brennus', 'a colonial gunboat']),
        trade: pick(['cabinet-maker', 'goldsmith', 'watchmaker', 'leather-worker', 'bookbinder']),
        colony: pick(['Indochina', 'Algeria', 'Senegal', 'Madagascar', 'Tunisia']),
        fashionableNeighborhood: pick(['the Champs-Élysées', 'the Opéra district', 'Passy', 'the Faubourg Saint-Honoré']),
        admirerClass: pick(['the aristocracy', 'the financial world', 'foreign diplomats', 'the arts']),
        voiceType: pick(['soprano', 'mezzo-soprano', 'contralto', 'coloratura']),
        parish: pick(['Saint-Sulpice', 'Saint-Roch', 'Notre-Dame', 'a working-class parish in Belleville']),
        missionField: pick(['China', 'Indochina', 'Africa', 'the South Seas', 'Madagascar']),
        constituency: pick(['Lyon', 'Marseille', 'a rural department', 'the working-class districts of Paris']),
        exoticDestination: pick(['the Congo', 'Tibet', 'the Amazon', 'the Sahara', 'Central Asia']),
        collectibleType: pick(['Japanese prints', 'medieval manuscripts', 'Egyptian antiquities', 'Impressionist paintings', 'Oriental porcelain'])
    };

    // Fill in template
    let biography = template;
    for (const [key, value] of Object.entries(templateValues)) {
        biography = biography.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }

    // Generate dialogue style
    const dialogueStyle = pick(profData.dialogueStyles);

    // Generate goal
    const goal = pick(profData.goals);

    return {
        birthplace,
        currentResidence,
        nationality: NAME_SETS[nationality]?.nationality || 'French',
        biography,
        dialogueStyle,
        goal,
        socialClass: profData.socialClass
    };
};

/**
 * Generate a first impression description based on appearance
 */
export const generateFirstImpression = (
    gender: 'male' | 'female' | 'non-binary',
    age: number,
    profession: string,
    appearance?: AppearanceProfile
): string => {
    const genderTerm = gender === 'female' ? 'woman' : gender === 'male' ? 'man' : 'person';
    const ageTerm = age < 25 ? 'young' : age < 40 ? '' : age < 55 ? 'middle-aged' : 'elderly';

    const physicalDescriptors: string[] = [];

    // Skin tone description
    if (appearance?.skinTone) {
        const skinDescriptions: Record<SkinTone, string[]> = {
            fair: ['fair-complexioned', 'pale-skinned', 'with a complexion that speaks of northern climes'],
            pale: ['pallid', 'with the wan complexion of one who works indoors', 'noticeably pale'],
            tan: ['sun-touched', 'with a healthy tan', 'with the weathered complexion of one who knows the outdoors'],
            olive: ['olive-skinned', 'with a Mediterranean complexion', 'with the warm coloring of the south'],
            golden: ['with a golden complexion', 'with features suggesting Eastern origin', 'with the distinctive coloring of the Orient'],
            warm_brown: ['with warm brown skin', 'with a rich complexion', 'with skin the color of polished mahogany'],
            dark: ['dark-skinned', 'with deep brown skin', 'with skin dark as coffee'],
            deep: ['with very dark skin', 'ebony-skinned', 'with skin of deepest brown']
        };
        physicalDescriptors.push(pick(skinDescriptions[appearance.skinTone]));
    }

    // Age-related descriptions
    if (age > 60) {
        physicalDescriptors.push(pick([
            'bearing the marks of years with dignity',
            'with silver at the temples',
            'showing the wisdom of experience in every line'
        ]));
    } else if (age < 25) {
        physicalDescriptors.push(pick([
            'with the fresh countenance of youth',
            'still carrying traces of adolescence',
            'with the unlined face of the young'
        ]));
    }

    // Profession-related bearing
    const profData = PROFESSION_DATA[profession];
    const bearingDescriptions: Record<string, string[]> = {
        working: ['with calloused hands', 'with the sturdy frame of a laborer', 'showing the wear of honest work'],
        middle: ['of respectable appearance', 'dressed with careful propriety', 'maintaining bourgeois standards'],
        upper: ['with aristocratic bearing', 'carrying an air of privilege', 'with the easy confidence of wealth'],
        bohemian: ['with an artistically disheveled appearance', 'affecting studied carelessness', 'with a romantic disregard for convention'],
        professional: ['with the assured manner of the educated classes', 'carrying an air of competence', 'with professional gravitas']
    };

    if (profData) {
        physicalDescriptors.push(pick(bearingDescriptions[profData.socialClass] || bearingDescriptions.middle));
    }

    const descriptor = physicalDescriptors.length > 0
        ? physicalDescriptors.slice(0, 2).join(', ')
        : 'of unremarkable appearance';

    const templates = [
        `A ${ageTerm} ${genderTerm} ${descriptor}, whose bearing suggests a life as ${profession.toLowerCase().startsWith('a') ? 'an' : 'a'} ${profession.toLowerCase()}.`,
        `${ageTerm.charAt(0).toUpperCase() + ageTerm.slice(1)} ${descriptor}, this ${genderTerm} carries the unmistakable air of the ${profession.toLowerCase()}.`,
        `One observes a ${ageTerm} ${genderTerm} ${descriptor}. The profession of ${profession.toLowerCase()} seems written in every gesture.`,
        `Here stands a ${ageTerm} ${genderTerm} ${descriptor}, marked by occupation as ${profession.toLowerCase().startsWith('a') ? 'an' : 'a'} ${profession.toLowerCase()}.`
    ];

    return pick(templates).replace(/\s+/g, ' ').replace(/^a elderly/i, 'an elderly').trim();
};
