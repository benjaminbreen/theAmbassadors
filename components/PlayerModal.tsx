
import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { LucideX, LucideBrain, LucideUser, LucideBookOpen, LucideQuote, LucideSparkles, LucideScroll, LucideShirt } from 'lucide-react';
import StatBar from './StatBar';
import Portrait from './Portrait';

type PlayerTab = 'overview' | 'biography' | 'psychology' | 'clothing';

// Generate dynamic mental state based on game conditions
const generateMentalState = (malaise: number, composure: number, zonesVisited: number, npcsMetCount: number, timeHour: number) => {
    const states: string[] = [];

    // Base state from malaise
    if (malaise > 80) {
        states.push(
            "The cacophony has become unbearable. Every sound—the clatter of heels on iron, the polyglot babble of the crowds, the infernal machinery—strikes like a physical blow. The novelist's famous composure has cracked; what remains is raw nerve, exposed and quivering.",
            "A profound weariness settles over the spirit, heavier than mere fatigue. It is the exhaustion of one who has seen too much, absorbed too many impressions, catalogued too many human specimens. The mind rebels against further intake."
        );
    } else if (malaise > 60) {
        states.push(
            "The weight of sustained observation presses down. Too many faces demanding to be read, too many conversations half-heard and analyzed, too many implications to be traced to their sources. The social machinery grinds on, and one begins to feel oneself merely another cog.",
            "A familiar tightness constricts the chest—the prelude to one of those 'nervous' episodes that have plagued him since youth. The crowds, the noise, the relentless spectacle of human folly: it accumulates."
        );
    } else if (malaise > 40) {
        states.push(
            "The novelist's equilibrium holds, though not without effort. Each interaction costs something; each observation demands its price in nervous energy. The professional detachment serves as armor, but armor grows heavy over time.",
            "Watchful, guarded, but fundamentally intact. The Exposition provides endless material—one need only look, listen, take note. The transformation of raw experience into art remains, as ever, the saving discipline."
        );
    } else if (malaise > 20) {
        states.push(
            "A curious lightness pervades the spirits. Perhaps it is the Parisian air, perhaps the sheer absurdity of the spectacle—but the usual anxieties seem, momentarily, to have loosened their grip.",
            "The observing consciousness functions with unusual clarity. Impressions arrive in orderly sequence; the chaos of the Exposition resolves into discernible patterns. Material accumulates for future use."
        );
    } else {
        states.push(
            "An unexpected contentment suffuses the afternoon. The novelist finds himself, against all expectation, enjoying the spectacle—not despite its vulgarity but almost because of it. There is something liberating in such comprehensive tastelessness.",
            "The mind moves with unusual freedom, unburdened by its customary hesitations. Conversations flow easily; observations arrange themselves into pleasing shapes. One begins to understand why William insisted on coming."
        );
    }

    // Modify based on time of day
    if (timeHour >= 20 || timeHour < 6) {
        states.push(
            "The evening brings its own species of fatigue—that particular exhaustion known only to those who have spent the day in perpetual social performance. The mask grows heavy after dark."
        );
    } else if (timeHour < 10) {
        states.push(
            "The morning hours offer respite. Before the crowds thicken, before the machinery of exhibition achieves its full clamor, there is space to think, to breathe, to remember why one writes."
        );
    }

    // Modify based on social exposure
    if (npcsMetCount > 10) {
        states.push(
            "The parade of new acquaintances has begun to blur together—a kaleidoscope of faces, each demanding acknowledgment, each requiring the expenditure of social capital one can ill afford to lose."
        );
    }

    return states[Math.floor(Math.random() * states.length)];
};

// Generate dynamic obsession based on game state
const generateObsession = (zonesVisited: string[], currentZoneBiome: string, gameDay: number) => {
    const obsessions = [
        {
            title: "The Eiffel Tower",
            description: "That monstrous iron assertion of modernity. Vulgar beyond measure, yet somehow compelling. He cannot stop looking at it—cannot stop imagining what it means, what it portends for the century to come."
        },
        {
            title: "The Gallery of Machines",
            description: "The vast hall where humanity's mechanical ambitions are displayed in all their thundering glory. The noise is intolerable, yet he returns again and again, drawn by some fascination he cannot quite name."
        },
        {
            title: "The Colonial Exhibitions",
            description: "Those troubling tableaux of empire—the 'native villages,' the artifacts torn from distant lands. The moral implications weigh upon him, even as the aesthetic possibilities suggest themselves."
        },
        {
            title: "The American Presence",
            description: "His countrymen abroad, with their confident voices and their democratic assumptions. Does he envy them their certainty, or pity them their innocence? The question admits no easy answer."
        },
        {
            title: "William's Theories",
            description: "His brother's ideas about consciousness, about the 'stream' of mental life—they haunt him. Perhaps the novelist and the psychologist are engaged in the same fundamental project, approached from different angles."
        }
    ];

    // Weight selection based on context
    const weights = obsessions.map((_, i) => {
        if (i === 0) return 3; // Tower is always prominent
        if (i === 4 && gameDay < 10) return 2; // William more prominent early
        return 1;
    });

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < obsessions.length; i++) {
        random -= weights[i];
        if (random <= 0) return obsessions[i];
    }
    return obsessions[0];
};

// Generate dynamic preoccupation
const generatePreoccupation = (player: any) => {
    const preoccupations = [
        {
            title: "The Theater",
            description: "Dreams of dramatic success haunt him. The stage—that most immediate of arts—promises what the novel cannot: applause, presence, the electricity of living performance. He knows the odds; he dreams nonetheless."
        },
        {
            title: "The Tragic Muse",
            description: "His novel-in-progress weighs upon him. It grows longer than intended, more unwieldy. Can he sustain the parallel narratives? Will readers follow? The monthly installments loom like deadlines for the scaffold."
        },
        {
            title: "Alice's Health",
            description: "Word from London brings little comfort. His sister's nervous condition persists, perhaps worsens. The guilt of absence mingles with the relief of distance—a familiar, shameful compound."
        },
        {
            title: "Financial Anxieties",
            description: "The ledger books tell an uncomfortable story. He lives well—perhaps too well—on income that fluctuates with the public's taste. A theatrical success would change everything. A theatrical failure..."
        },
        {
            title: "The Question of Marriage",
            description: "Society's perpetual inquiry, asked in a thousand indirect ways. At forty-six, the question has become rhetorical—and yet. And yet. The loneliness of hotel rooms, of rented chambers, presses in at odd moments."
        },
        {
            title: "Constance",
            description: "Miss Woolson's letters arrive with troubling regularity. Her devotion flatters; her expectations terrify. The friendship—if friendship it remains—has become a maze from which no honorable exit presents itself."
        }
    ];

    return preoccupations[Math.floor(Math.random() * preoccupations.length)];
};

const PlayerModal: React.FC = () => {
    const { state, dispatch } = useGame();
    const { player } = state;
    const [activeTab, setActiveTab] = useState<PlayerTab>('overview');

    // Generate dynamic content once per modal open
    const dynamicPsychology = useMemo(() => {
        const currentZone = state.zones[state.player.currentZoneId] || null;

        return {
            mentalState: generateMentalState(
                player.stats.malaise,
                player.hp,
                Object.keys(state.zones).length,
                state.metNpcs?.length || 0,
                state.gameTime?.hour || 12
            ),
            obsession: generateObsession(
                Object.keys(state.zones),
                currentZone?.biome || 'STREET',
                state.gameTime?.day || 5
            ),
            preoccupation: generatePreoccupation(player)
        };
    }, [state.showPlayerModal]); // Regenerate when modal opens

    if (!state.showPlayerModal) return null;

    const openWorkDetail = (projectIndex: number) => {
        dispatch({ type: 'CLOSE_PLAYER_MODAL' });
        dispatch({ type: 'SHOW_WORKS_MODAL', payload: projectIndex });
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-fade-in"
            onClick={() => dispatch({ type: 'CLOSE_PLAYER_MODAL' })}
        >
            <div
                className="bg-paper-100 dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-lg border-4 border-gold-600 shadow-2xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-ink-900 via-ink-800 to-ink-900 px-6 py-4 flex items-center justify-between border-b-2 border-gold-600 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <LucideUser className="text-gold-500" size={24} />
                        <div>
                            <h1 className="font-display text-xl text-gold-500 tracking-wide">HENRY JAMES</h1>
                            <p className="text-paper-300 text-xs tracking-widest uppercase">Man of Letters • Age 46</p>
                        </div>
                    </div>
                    <button
                        onClick={() => dispatch({ type: 'CLOSE_PLAYER_MODAL' })}
                        className="text-paper-300 hover:text-white p-2 rounded-full hover:bg-ink-700 transition-all"
                    >
                        <LucideX size={20} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Column: Portrait & Stats */}
                    <div className="w-64 bg-ink-900/5 dark:bg-ink-900/50 border-r border-gold-600/30 p-5 flex flex-col items-center flex-shrink-0">
                        <div className="mb-4 border-2 border-gold-600 shadow-lg">
                            <Portrait
                                archetype="henry_james"
                                size="lg"
                                emotion="neutral"
                                hatOff={!state.player.equippedClothing.hat}
                                pinceNez={state.player.equippedClothing.pinceNez}
                            />
                        </div>

                        <div className="w-full space-y-3 mb-4">
                            <StatBar label="Composure" value={player.hp} max={player.maxHp} color="bg-blue-700" />
                            <StatBar label="Malaise" value={player.stats.malaise} max={100} color="bg-red-800" />
                        </div>

                        <div className="grid grid-cols-3 gap-2 w-full text-center">
                            <div className="bg-paper-200 dark:bg-ink-800 p-2 rounded border border-gold-600/20">
                                <div className="text-[9px] text-ink-500 dark:text-paper-400 uppercase font-bold">Level</div>
                                <div className="font-bold text-lg text-ink-900 dark:text-gold-500">{player.level}</div>
                            </div>
                            <div className="bg-paper-200 dark:bg-ink-800 p-2 rounded border border-gold-600/20">
                                <div className="text-[9px] text-ink-500 dark:text-paper-400 uppercase font-bold">Wit</div>
                                <div className="font-bold text-lg text-ink-900 dark:text-gold-500">{player.stats.wit}</div>
                            </div>
                            <div className="bg-paper-200 dark:bg-ink-800 p-2 rounded border border-gold-600/20">
                                <div className="text-[9px] text-ink-500 dark:text-paper-400 uppercase font-bold">Rep</div>
                                <div className="font-bold text-lg text-ink-900 dark:text-gold-500">{player.stats.reputation || 50}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Tabs */}
                    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                        {/* Tab bar */}
                        <div className="flex border-b border-gold-600/30 bg-paper-200 dark:bg-ink-800 flex-shrink-0">
                            {[
                                { id: 'overview', label: 'Overview', icon: LucideUser },
                                { id: 'biography', label: 'Biography', icon: LucideScroll },
                                { id: 'psychology', label: 'Psychology', icon: LucideBrain },
                                { id: 'clothing', label: 'Clothing', icon: LucideShirt },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as PlayerTab)}
                                    className={`flex-1 py-3 px-3 text-[19px] font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-paper-100 dark:bg-gray-900 text-black border-b-2 border-gold-600 -mb-px'
                                            : 'text-ink-400 dark:text-paper-400 hover:text-ink-700 hover:bg-gold-400 dark:hover:bg-gray-900 dark:hover:text-paper-200'
                                    }`}
                                >
                                    <tab.icon size={13} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            {activeTab === 'overview' && (
                                <div className="space-y-5">
                                    {/* Fictional premise callout */}
                                    <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 dark:from-purple-900/40 dark:to-indigo-900/40 border border-purple-500/30 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <LucideSparkles className="text-purple-400 flex-shrink-0 mt-0.5" size={18} />
                                            <div>
                                                <p className="text-purple-900 font-sans dark:text-purple-200 text-sm font-bold mb-1">
                                                    A Fictional Reimagining
                                                </p>
                                                <p className="text-purple-800 font-sans dark:text-purple-300 text-sm leading-normal">
                                                    In reality, Henry James stayed away from Paris until the Exposition closed, writing to a friend that, “such inventions… are a direct negation of everything I hold pleasant or, for myself, possible in life.”
                                                    This game imagines what might have happened had William—attending the International
                                                    Congress of Physiological Psychology—persuaded his reluctant brother to accompany him.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Brief bio */}
                                    <div>
                                        <h3 className="text-black text-sm dark:text-paper-400 text-xs uppercase font-black tracking-wider mb-2">Biographical Sketch</h3>
                                        <p className="text-ink-700 dark:text-paper-300 text-base leading-relaxed">
                                            Born April 15, 1843, New York City. Son of the theologian Henry James Sr. and Mary Robertson Walsh.
                                            Resides at 34 De Vere Gardens, Kensington, London since 1876. A cosmopolitan upbringing across
                                            America and Europe shaped his singular literary vision. Author of <em>The Portrait of a Lady</em>,
                                            <em> The Bostonians</em>, and <em>The Princess Casamassima</em>.
                                        </p>
                                    </div>

                                    {/* Works in Progress */}
                                    <div>
                                        <h3 className="text-ink-500 dark:text-paper-400 text-xs uppercase font-bold tracking-wider mb-3">Works in Progress</h3>
                                        <div className="space-y-2">
                                            {player.projects.map((project, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => openWorkDetail(index)}
                                                    className="w-full flex items-center gap-3 p-3 bg-paper-200 dark:bg-ink-800 rounded border border-gold-600/20 hover:border-gold-600/50 hover:bg-paper-300 dark:hover:bg-ink-700 transition-all text-left group"
                                                >
                                                    <LucideBookOpen className="text-gold-600 flex-shrink-0" size={16} />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-ink-900 dark:text-gold-500 text-sm">{project.title}</span>
                                                            <span className="text-[10px] uppercase font-bold tracking-wider text-ink-500 dark:text-paper-500 bg-ink-100 dark:bg-ink-700 px-1.5 py-0.5 rounded">
                                                                {project.type}
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-ink-200 dark:bg-ink-700 rounded-full mt-1.5 overflow-hidden">
                                                            <div
                                                                className="h-full bg-gold-600 transition-all"
                                                                style={{ width: `${project.progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-bold text-ink-600 dark:text-paper-400 group-hover:text-gold-600 transition-colors">
                                                        {project.progress}%
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Current Attire Summary */}
                                    <div>
                                        <h3 className="text-ink-500 dark:text-paper-400 text-xs uppercase font-bold tracking-wider mb-3">Present Attire</h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="bg-paper-200 dark:bg-ink-800 p-3 rounded border border-gold-600/20">
                                                <p className="text-[10px] text-ink-500 dark:text-paper-500 uppercase font-bold mb-1">Head</p>
                                                <p className="text-ink-700 dark:text-paper-300 text-sm">
                                                    {player.clothing.head || "Silk top hat"}
                                                </p>
                                            </div>
                                            <div className="bg-paper-200 dark:bg-ink-800 p-3 rounded border border-gold-600/20">
                                                <p className="text-[10px] text-ink-500 dark:text-paper-500 uppercase font-bold mb-1">Body</p>
                                                <p className="text-ink-700 dark:text-paper-300 text-sm">
                                                    {player.clothing.body || "Morning coat"}
                                                </p>
                                            </div>
                                            <div className="bg-paper-200 dark:bg-ink-800 p-3 rounded border border-gold-600/20">
                                                <p className="text-[10px] text-ink-500 dark:text-paper-500 uppercase font-bold mb-1">Accessories</p>
                                                <p className="text-ink-700 dark:text-paper-300 text-sm">
                                                    {player.clothing.acc || "Walking stick"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'biography' && (
                                <div className="space-y-6 text-base leading-relaxed">
                                    <div>
                                        <h3 className="text-gold-600 font-display text-lg mb-3">Early Life & Family</h3>
                                        <p className="text-ink-700 dark:text-paper-300 mb-4">
                                            Henry James was born on April 15, 1843, at 21 Washington Place in New York City, into one of
                                            America's most intellectually distinguished families. His father, Henry James Sr., was a
                                            Swedenborgian theologian of independent means whose inheritance from his father William (an
                                            Irish immigrant who became one of the wealthiest men in New York) freed him from any need
                                            of regular employment. His mother, Mary Robertson Walsh, provided the emotional center of
                                            a household that prized conversation, debate, and the life of the mind above all else.
                                        </p>
                                        <p className="text-ink-700 dark:text-paper-300 mb-4">
                                            Henry was the second of five children. His elder brother William, born in 1842, would become
                                            the father of American psychology and pragmatist philosophy. The younger siblings—Garth
                                            Wilkinson (Wilky), Robertson (Bob), and Alice—each struggled in various ways to find their
                                            footing in the shadow of their brilliant elder brothers. Alice, in particular, suffered from
                                            nervous ailments throughout her life and remains a figure of deep concern for Henry.
                                        </p>
                                        <p className="text-ink-700 dark:text-paper-300">
                                            The James children received an extraordinary, if unconventional, education. Their father,
                                            distrustful of institutions, moved the family restlessly between America and Europe—New York,
                                            Albany, Geneva, London, Paris, Boulogne-sur-Mer, Newport, Boston, and back again. This peripatetic
                                            childhood gave him fluency in French and an intimate knowledge of European culture, but also a
                                            sense of rootlessness that would inform his fiction's perennial theme of Americans adrift in the Old World.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-gold-600 font-display text-lg mb-3">The Civil War Years & Early Career</h3>
                                        <p className="text-ink-700 dark:text-paper-300 mb-4">
                                            When the Civil War erupted in 1861, both Wilky and Bob enlisted in the Union Army. Wilky
                                            served as adjutant in the 54th Massachusetts, the famous Black regiment, and was grievously
                                            wounded at Fort Wagner. Henry and William, however, did not serve—a fact that would haunt
                                            Henry for the rest of his life. He suffered what he called an "obscure hurt" while helping
                                            to fight a fire in Newport in 1861, an injury whose exact nature remains mysterious but
                                            which he invoked to explain his non-participation in the war.
                                        </p>
                                        <p className="text-ink-700 dark:text-paper-300 mb-4">
                                            Henry briefly attended Harvard Law School in 1862-1863, but his heart was never in the law.
                                            He had begun writing reviews and short stories, and by the mid-1860s was contributing regularly
                                            to the <em>Atlantic Monthly</em>, the <em>Nation</em>, and other prestigious periodicals. His
                                            first novel, <em>Watch and Ward</em>, was serialized in 1871, though he would later disown it.
                                        </p>
                                        <p className="text-ink-700 dark:text-paper-300">
                                            In 1869-1870, he made his first adult journey to Europe alone, a voyage that crystallized his
                                            sense of vocation. He knew then that his subject would be the encounter between American
                                            innocence and European experience, between New World energy and Old World complexity.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-gold-600 font-display text-lg mb-3">Expatriation & Literary Achievement</h3>
                                        <p className="text-ink-700 dark:text-paper-300 mb-4">
                                            After several years of restless movement between America and Europe, Henry settled permanently
                                            in England in 1876, taking rooms in Bolton Street, Piccadilly, before moving to his current
                                            residence at 34 De Vere Gardens, Kensington. He became a fixture of London literary society,
                                            dining out with astonishing frequency—up to 140 dinners in a single winter season—and cultivating
                                            friendships with the leading writers, artists, and intellectuals of the age.
                                        </p>
                                        <p className="text-ink-700 dark:text-paper-300 mb-4">
                                            The 1870s and early 1880s brought a remarkable succession of novels: <em>Roderick Hudson</em> (1875),
                                            <em>The American</em> (1877), <em>The Europeans</em> (1878), <em>Daisy Miller</em> (1878)—which
                                            made him famous on both sides of the Atlantic—<em>Washington Square</em> (1880), and his
                                            acknowledged masterpiece of this period, <em>The Portrait of a Lady</em> (1881). In Isabel
                                            Archer, the American heiress who claims her freedom only to find herself trapped by her own
                                            choices, Henry created one of the great characters of nineteenth-century fiction.
                                        </p>
                                        <p className="text-ink-700 dark:text-paper-300">
                                            The mid-1880s brought a shift in subject matter. <em>The Bostonians</em> (1886), his novel of
                                            the American women's movement, was poorly received and remains controversial. <em>The Princess
                                            Casamassima</em> (1886) explored the anarchist underworld of London. Neither achieved the
                                            success of his earlier work, and Henry has found himself, at forty-six, questioning whether
                                            his best years as a novelist might be behind him.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-gold-600 font-display text-lg mb-3">The Present Moment: Summer 1889</h3>
                                        <p className="text-ink-700 dark:text-paper-300 mb-4">
                                            Henry finds himself at a crossroads. He is at work on <em>The Tragic Muse</em>, a long novel
                                            about art, theater, and the competing claims of public and private life, but the book proceeds
                                            slowly and without the confidence of his earlier work. He has begun to dream of conquering the
                                            stage—of writing plays that will bring him both popular success and a new form of artistic
                                            expression. The theater, that most vulgar and most vital of arts, beckons.
                                        </p>

                                        <div className="bg-ink-900/5 dark:bg-ink-800/50 border-l-4 border-gold-600 p-4 my-6">
                                            <div className="flex items-start gap-2">
                                                <LucideQuote className="text-gold-600 flex-shrink-0 mt-1" size={18} />
                                                <div>
                                                    <p className="text-ink-700 dark:text-paper-300 italic leading-relaxed">
                                                        "Such inventions and such monstrous wholesale quantity and number are a direct negation
                                                        of everything I hold pleasant or, for myself, possible in life."
                                                    </p>
                                                    <p className="text-ink-500 dark:text-paper-500 text-sm mt-2">
                                                        — to Henrietta Reubell, March 23, 1889, on the Universal Exposition
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-ink-700 dark:text-paper-300 mb-4">
                                            His circle of intimates includes Robert Louis Stevenson, with whom he maintains a warm
                                            correspondence despite Stevenson's exile in the South Seas; John Singer Sargent, who painted
                                            his portrait; Constance Fenimore Woolson, the American novelist whose devotion to him is
                                            perhaps more than merely literary; and Edmund Gosse, his closest English friend. He dines
                                            regularly at the Reform Club and moves easily through the great houses of London society.
                                        </p>
                                        <p className="text-ink-700 dark:text-paper-300">
                                            He has never married and shows no inclination to do so. The exact nature of his emotional
                                            life remains, as perhaps it should, a matter of exquisite privacy. He is a watcher, an
                                            observer, a connoisseur of human folly and aspiration—and, increasingly, a man haunted by
                                            the sense that life may be passing him by while he sits taking notes.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'psychology' && (
                                <div className="space-y-5">
                                    {/* Large current mental state */}
                                    <div className="bg-gradient-to-br from-ink-900/10 to-ink-800/5 dark:from-ink-800/60 dark:to-ink-900/40 p-5 rounded-lg border border-gold-600/30">
                                        <p className="text-ink-500 dark:text-paper-400 text-xs uppercase font-bold tracking-wider mb-3">Current State of Mind</p>
                                        <p className="text-ink-800 dark:text-paper-200 text-lg leading-relaxed italic">
                                            {dynamicPsychology.mentalState}
                                        </p>
                                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gold-600/20">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    player.stats.malaise > 70 ? 'bg-red-500' :
                                                    player.stats.malaise > 40 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`} />
                                                <span className="text-ink-600 dark:text-paper-400 text-sm">
                                                    Malaise: {player.stats.malaise}%
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    player.hp < player.maxHp * 0.3 ? 'bg-red-500' :
                                                    player.hp < player.maxHp * 0.6 ? 'bg-yellow-500' : 'bg-blue-500'
                                                }`} />
                                                <span className="text-ink-600 dark:text-paper-400 text-sm">
                                                    Composure: {player.hp}/{player.maxHp}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-paper-200 dark:bg-ink-800 p-4 rounded border border-gold-600/20">
                                            <p className="text-ink-500 dark:text-paper-400 text-xs uppercase font-bold mb-2">Current Obsession</p>
                                            <p className="text-gold-700 dark:text-gold-400 font-bold text-base mb-2">{dynamicPsychology.obsession.title}</p>
                                            <p className="text-ink-600 dark:text-paper-400 text-sm leading-relaxed">
                                                {dynamicPsychology.obsession.description}
                                            </p>
                                        </div>
                                        <div className="bg-paper-200 dark:bg-ink-800 p-4 rounded border border-gold-600/20">
                                            <p className="text-ink-500 dark:text-paper-400 text-xs uppercase font-bold mb-2">Secret Preoccupation</p>
                                            <p className="text-gold-700 dark:text-gold-400 font-bold text-base mb-2">{dynamicPsychology.preoccupation.title}</p>
                                            <p className="text-ink-600 dark:text-paper-400 text-sm leading-relaxed">
                                                {dynamicPsychology.preoccupation.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-ink-500 dark:text-paper-400 text-xs uppercase font-bold tracking-wider mb-3">Characteristic Tendencies</p>
                                        <ul className="space-y-3 text-ink-700 dark:text-paper-300 text-base">
                                            <li className="flex items-start gap-3">
                                                <span className="text-gold-600 mt-1">•</span>
                                                <span>An acute, almost painful sensitivity to social nuance—the unspoken word, the averted glance, the meaning beneath the meaning</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-gold-600 mt-1">•</span>
                                                <span>A preference for observation over participation; the novelist's professional detachment becomes, at times, a prison</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-gold-600 mt-1">•</span>
                                                <span>Profound ambivalence toward modern progress: its vulgarity offends his sensibilities, yet its vitality compels his attention</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-gold-600 mt-1">•</span>
                                                <span>A deep, if sometimes frustrated, attachment to his brother William—admiration mixed with rivalry, love with exasperation</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="border-t border-gold-600/20 pt-4">
                                        <p className="text-ink-500 dark:text-paper-500 text-sm italic text-center">
                                            "A mind so fine that no idea could violate it." — T.S. Eliot
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'clothing' && (
                                <div className="space-y-5">
                                    <p className="text-ink-600 dark:text-paper-400 text-sm italic mb-4">
                                        "The well-dressed man is he whose clothes you never notice." Mr. James's attire reflects this principle:
                                        impeccable without ostentation, the uniform of a cosmopolitan who moves easily between London clubs and Parisian salons.
                                    </p>

                                    {/* Head */}
                                    <div className={`p-4 rounded border transition-all ${state.player.equippedClothing.hat ? 'bg-paper-200 dark:bg-ink-800 border-gold-600/20' : 'bg-paper-300/50 dark:bg-ink-900/50 border-dashed border-ink-400/30'}`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${state.player.equippedClothing.hat ? 'bg-ink-900' : 'bg-ink-400/30'}`}>
                                                <span className={`text-lg ${state.player.equippedClothing.hat ? 'text-gold-500' : 'text-ink-400 opacity-50'}`}>🎩</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className={`font-bold text-base ${state.player.equippedClothing.hat ? 'text-ink-900 dark:text-gold-500' : 'text-ink-500 dark:text-paper-600'}`}>
                                                        Silk Top Hat
                                                        {!state.player.equippedClothing.hat && <span className="text-xs ml-2 font-normal italic">(removed)</span>}
                                                    </h4>
                                                    <button
                                                        onClick={() => dispatch({ type: 'TOGGLE_CLOTHING', payload: 'hat' })}
                                                        className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                                                            state.player.equippedClothing.hat
                                                                ? 'bg-ink-200 dark:bg-ink-700 text-ink-600 dark:text-paper-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400'
                                                                : 'bg-gold-600 text-white hover:bg-gold-500'
                                                        }`}
                                                    >
                                                        {state.player.equippedClothing.hat ? 'Remove' : 'Put On'}
                                                    </button>
                                                </div>
                                                <p className="text-ink-500 dark:text-paper-500 text-xs uppercase tracking-wider mb-2">Lock & Co., St. James's Street, London</p>
                                                <p className={`text-sm leading-relaxed ${state.player.equippedClothing.hat ? 'text-ink-700 dark:text-paper-300' : 'text-ink-500 dark:text-paper-500 italic'}`}>
                                                    {state.player.equippedClothing.hat
                                                        ? "A black silk plush top hat of the \"Wellington\" style, featuring a slightly curved brim and a crown of six inches. The silk nap catches the light with a distinctive sheen. Fitted with a grosgrain ribbon band and lined in white satin with the hatter's mark stamped in gold. Lock & Co., hatters to gentlemen since 1676, remains the only acceptable establishment for a man of discernment."
                                                        : "The hat rests in your hand, its absence revealing the distinguished baldness that the Master has learned to regard with philosophical acceptance."
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Coat */}
                                    <div className="bg-paper-200 dark:bg-ink-800 p-4 rounded border border-gold-600/20">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-ink-800 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-gold-500 text-lg">🧥</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-ink-900 dark:text-gold-500 font-bold text-base mb-1">Morning Coat</h4>
                                                <p className="text-ink-500 dark:text-paper-500 text-xs uppercase tracking-wider mb-2">Henry Poole & Co., Savile Row</p>
                                                <p className="text-ink-700 dark:text-paper-300 text-sm leading-relaxed">
                                                    A single-breasted morning coat in charcoal grey worsted wool, cut away at the front
                                                    to reveal the waistcoat. Features peak lapels faced in silk, a single vent at the back,
                                                    and three horn buttons. The cut follows the natural shoulder line favored by English
                                                    tailors—neither the exaggerated padding of Continental fashion nor the slovenly drape
                                                    of American ready-made. Henry Poole has dressed Mr. James since his arrival in London;
                                                    the relationship, like all proper arrangements between gentleman and tradesman, requires no discussion.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Waistcoat */}
                                    <div className="bg-paper-200 dark:bg-ink-800 p-4 rounded border border-gold-600/20">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-ink-700 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-gold-500 text-lg">👔</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-ink-900 dark:text-gold-500 font-bold text-base mb-1">Waistcoat</h4>
                                                <p className="text-ink-500 dark:text-paper-500 text-xs uppercase tracking-wider mb-2">Matching Set from Henry Poole</p>
                                                <p className="text-ink-700 dark:text-paper-300 text-sm leading-relaxed">
                                                    A double-breasted waistcoat in dove grey cashmere, cut with a shawl collar and six
                                                    mother-of-pearl buttons. The back is of black silk with an adjustable buckle strap.
                                                    Worn with the bottom button undone, as is correct—a convention said to originate with
                                                    Edward VII, though Mr. James suspects the true reason is simply comfort after luncheon.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Trousers */}
                                    <div className="bg-paper-200 dark:bg-ink-800 p-4 rounded border border-gold-600/20">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-ink-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-gold-500 text-lg">👖</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-ink-900 dark:text-gold-500 font-bold text-base mb-1">Trousers</h4>
                                                <p className="text-ink-500 dark:text-paper-500 text-xs uppercase tracking-wider mb-2">Henry Poole & Co.</p>
                                                <p className="text-ink-700 dark:text-paper-300 text-sm leading-relaxed">
                                                    Narrow-cut trousers in grey striped worsted, featuring a high waist secured by
                                                    braces (never a belt—the mark of the tradesman), a front fall rather than a fly,
                                                    and a sharp crease down each leg. The stripe is subtle: black on grey,
                                                    approximately one-quarter inch apart.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Accessories */}
                                    <div className="bg-paper-200 dark:bg-ink-800 p-4 rounded border border-gold-600/20">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-gold-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-ink-900 text-lg">⌚</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-ink-900 dark:text-gold-500 font-bold text-base mb-1">Pocket Watch & Chain</h4>
                                                <p className="text-ink-500 dark:text-paper-500 text-xs uppercase tracking-wider mb-2">Patek Philippe, Geneva</p>
                                                <p className="text-ink-700 dark:text-paper-300 text-sm leading-relaxed">
                                                    An 18-carat gold hunter-case pocket watch with white enamel dial and Roman numerals,
                                                    worn on a double albert chain of yellow gold. The chain passes through the center
                                                    buttonhole of the waistcoat, with the watch in the left pocket and a small gold fob
                                                    seal in the right. The watch runs approximately three minutes fast—a habit Mr. James
                                                    finds useful for maintaining punctuality at dinners.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Walking Stick */}
                                    <div className="bg-paper-200 dark:bg-ink-800 p-4 rounded border border-gold-600/20">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-gold-300 text-lg">🦯</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-ink-900 dark:text-gold-500 font-bold text-base mb-1">Walking Stick</h4>
                                                <p className="text-ink-500 dark:text-paper-500 text-xs uppercase tracking-wider mb-2">Swaine Adeney Brigg, London</p>
                                                <p className="text-ink-700 dark:text-paper-300 text-sm leading-relaxed">
                                                    A gentleman's walking cane in Malacca wood—the mottled brown palm imported from the
                                                    Malay Peninsula—with a curved handle of sterling silver. The ferrule is of German
                                                    silver, slightly worn from years of use on London pavements. The stick is neither
                                                    an affectation nor a medical necessity but something in between: a prop for the
                                                    performance of gentleman-hood, useful for gesturing, for emphasis, for maintaining
                                                    a certain distance from the world.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Gloves */}
                                    <div className="bg-paper-200 dark:bg-ink-800 p-4 rounded border border-gold-600/20">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-amber-700 text-lg">🧤</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-ink-900 dark:text-gold-500 font-bold text-base mb-1">Gloves</h4>
                                                <p className="text-ink-500 dark:text-paper-500 text-xs uppercase tracking-wider mb-2">Dent's, St. James's</p>
                                                <p className="text-ink-700 dark:text-paper-300 text-sm leading-relaxed">
                                                    Pale grey suede gloves of French kid leather, butter-soft and close-fitting.
                                                    A gentleman never appears in public without gloves; to shake hands ungloved
                                                    is a mark of particular intimacy or, alternatively, of social ignorance.
                                                    Mr. James owns seven pairs in rotation, each lasting approximately one season
                                                    before the fingertips show unacceptable wear.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pince-nez */}
                                    <div className={`p-4 rounded border transition-all ${state.player.equippedClothing.pinceNez ? 'bg-paper-200 dark:bg-ink-800 border-gold-600/20' : 'bg-paper-300/50 dark:bg-ink-900/50 border-dashed border-ink-400/30'}`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${state.player.equippedClothing.pinceNez ? 'bg-gold-600' : 'bg-ink-400/30'}`}>
                                                <span className={`text-lg ${state.player.equippedClothing.pinceNez ? 'text-white' : 'text-ink-400 opacity-50'}`}>👓</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className={`font-bold text-base ${state.player.equippedClothing.pinceNez ? 'text-ink-900 dark:text-gold-500' : 'text-ink-500 dark:text-paper-600'}`}>
                                                        Pince-nez
                                                        {!state.player.equippedClothing.pinceNez && <span className="text-xs ml-2 font-normal italic">(in pocket)</span>}
                                                    </h4>
                                                    <button
                                                        onClick={() => dispatch({ type: 'TOGGLE_CLOTHING', payload: 'pinceNez' })}
                                                        className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                                                            state.player.equippedClothing.pinceNez
                                                                ? 'bg-ink-200 dark:bg-ink-700 text-ink-600 dark:text-paper-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400'
                                                                : 'bg-gold-600 text-white hover:bg-gold-500'
                                                        }`}
                                                    >
                                                        {state.player.equippedClothing.pinceNez ? 'Remove' : 'Put On'}
                                                    </button>
                                                </div>
                                                <p className="text-ink-500 dark:text-paper-500 text-xs uppercase tracking-wider mb-2">C.W. Dixey & Son, London</p>
                                                <p className={`text-sm leading-relaxed ${state.player.equippedClothing.pinceNez ? 'text-ink-700 dark:text-paper-300' : 'text-ink-500 dark:text-paper-500 italic'}`}>
                                                    {state.player.equippedClothing.pinceNez
                                                        ? "A pair of gold-rimmed pince-nez with oval lenses, secured by a delicate spring bridge that grips the nose. A fine gold chain attaches to a buttonhole in the lapel, preventing loss. The lenses correct a slight farsightedness that Mr. James has noticed developing of late—the occupational hazard of a life spent reading proofs and manuscripts by gaslight."
                                                        : "The pince-nez rest in their leather case, tucked into the waistcoat pocket. The Master prefers to rely on natural vision when not engaged in close reading."
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Note */}
                                    <div className="bg-ink-900/5 dark:bg-ink-800/50 border-l-4 border-gold-600 p-4 rounded-r mt-6">
                                        <p className="text-ink-600 dark:text-paper-400 text-sm leading-relaxed">
                                            <strong>A note on expense:</strong> The complete ensemble represents an investment of
                                            approximately £75-100—roughly six months' wages for a skilled London tradesman.
                                            Mr. James's annual expenditure on clothing, including shirts, boots, and incidentals,
                                            approaches £200. He considers this neither extravagance nor necessity but simply the
                                            cost of maintaining the position his work requires.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-ink-900/5 dark:bg-ink-800 border-t border-gold-600/30 px-6 py-3 flex items-center justify-between flex-shrink-0">
                    <p className="text-ink-500 dark:text-paper-500 text-sm italic">
                        "We work in the dark—we do what we can—we give what we have."
                    </p>
                    <p className="text-ink-400 dark:text-paper-600 text-sm">
                        August 1889 • Paris
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PlayerModal;
