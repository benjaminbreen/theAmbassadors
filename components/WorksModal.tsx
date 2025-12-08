
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { LucideX, LucideScrollText, LucideBookOpen, LucideFeather, LucideTheater, LucideChevronRight, LucideQuote, LucideCalendar, LucideUsers, LucideMapPin } from 'lucide-react';

// Detailed information about each work in progress
const WORKS_DATA: Record<string, {
    fullTitle: string;
    subtitle?: string;
    genre: string;
    begun: string;
    serialization?: string;
    themes: string[];
    characters: { name: string; description: string }[];
    synopsis: string;
    currentState: string;
    historicalNote: string;
    excerpt?: string;
    relevantLocations?: string[];
}> = {
    "The Tragic Muse": {
        fullTitle: "The Tragic Muse",
        subtitle: "A Novel in Three Volumes",
        genre: "Novel",
        begun: "1888",
        serialization: "Atlantic Monthly (January 1889 – May 1890)",
        themes: ["Art vs. Society", "The Theater", "Political Ambition", "Aesthetic Devotion", "English Life"],
        characters: [
            { name: "Nick Dormer", description: "A young Englishman torn between a political career and his passion for portrait painting" },
            { name: "Miriam Rooth", description: "A young actress of mixed heritage, fiercely devoted to her art—the 'tragic muse' herself" },
            { name: "Peter Sherringham", description: "A diplomat who falls in love with Miriam but cannot reconcile her profession with his ambitions" },
            { name: "Julia Dallow", description: "A wealthy widow who offers Nick political advancement and marriage" },
            { name: "Gabriel Nash", description: "An aesthete and conversationalist who espouses art for art's sake" }
        ],
        synopsis: `The novel traces the intersecting fates of two young artists: Nick Dormer, who abandons a promising political career to become a painter, and Miriam Rooth, a struggling actress who rises to theatrical triumph. Around them orbit Peter Sherringham, whose love for Miriam conflicts with his diplomatic ambitions, and Julia Dallow, whose wealth and political connections represent everything Nick must sacrifice for his art.

At its heart, the book asks whether art can be reconciled with the demands of English society—and whether those who choose the aesthetic life must pay for it with isolation and incomprehension.`,
        currentState: "The serial publication proceeds monthly in the Atlantic. Henry finds himself approximately halfway through, but the novel's length troubles him. It may be his longest work yet, and he fears readers will lose patience. The theatrical scenes come easily; the political machinery requires more effort.",
        historicalNote: "The Tragic Muse would be published in book form in 1890. It marked the end of James's 'middle period' and was his last novel for six years, as he turned his attention to writing for the theater—an ambition that would end in public humiliation at the premiere of Guy Domville in 1895.",
        excerpt: `"The salon was of a quality essentially Parisian—the salon that, in a manner peculiar to Paris, lives and breathes and even, in favorable instances, dreams... Miriam was there, but everything else was there too."`,
        relevantLocations: ["Théâtre Français", "London Drawing Rooms", "Paris Ateliers"]
    },
    "The Solution": {
        fullTitle: "The Solution",
        genre: "Short Story",
        begun: "1888",
        themes: ["Diplomatic Intrigue", "Social Comedy", "American Innocence", "Roman Society"],
        characters: [
            { name: "The Narrator", description: "An American diplomat stationed in Rome" },
            { name: "Henry Dodd", description: "A young American attaché who becomes entangled in a Roman comedy of manners" },
            { name: "Mrs. Rushbrook", description: "An American widow navigating European society" }
        ],
        synopsis: `A comedy of diplomatic life in Rome, concerning the efforts of various parties to extricate a young American from an imprudent engagement. The story turns on questions of honor, national character, and the particular vulnerabilities of Americans abroad.`,
        currentState: "Nearly complete. Henry anticipates publication in a periodical within the year. The Roman setting came easily—he knows that world intimately—and the comedy writes itself.",
        historicalNote: "The Solution was published in The New Review in December 1889. It exemplifies James's lighter mode—social comedy rather than psychological depth.",
        relevantLocations: ["Rome", "American Embassy", "Roman Salons"]
    },
    "The Pupil": {
        fullTitle: "The Pupil",
        genre: "Short Story (Novella)",
        begun: "1889",
        themes: ["Childhood", "Corruption", "Moral Education", "Bohemian Life", "Death"],
        characters: [
            { name: "Pemberton", description: "A young Oxford-educated tutor, struggling financially, who becomes devoted to his charge" },
            { name: "Morgan Moreen", description: "A precocious, sickly boy of eleven, trapped in his family's nomadic, debt-ridden existence" },
            { name: "The Moreen Family", description: "American adventurers who drift through European hotels, always one step ahead of their creditors" }
        ],
        synopsis: `A young tutor accepts a position with a peculiar American family wandering through Europe. He discovers that his pupil, Morgan, is the only honest member of a clan of genteel swindlers. As tutor and pupil form an intense bond, both must confront the question of escape—and its terrible cost.`,
        currentState: "Still in notes and fragments. The central situation is clear, but Henry hesitates over the ending. He knows it must be tragic, but the precise nature of the tragedy eludes him. The boy's heart condition suggests a possibility...",
        historicalNote: "The Pupil was completed and published in 1891. It became one of James's most admired shorter works, praised for its emotional intensity and its unflinching portrait of a child's moral awakening.",
        excerpt: `"Morgan had a general thing, a mystic sense of knowledge, a consciousness of having, somewhere in the dim past, been initiated."`,
        relevantLocations: ["Nice", "Venice", "Paris Hotels", "Florence"]
    },
    "A London Life": {
        fullTitle: "A London Life",
        genre: "Short Story (Novella)",
        begun: "1887",
        themes: ["Marital Scandal", "American Morality", "English Hypocrisy", "Social Disgrace"],
        characters: [
            { name: "Laura Wing", description: "A young American woman living with her married sister in London" },
            { name: "Selina Berrington", description: "Laura's sister, whose flagrant affair threatens to destroy the family" },
            { name: "Lionel Berrington", description: "Selina's wronged husband, too English to make a scene" },
            { name: "Lady Davenant", description: "An elderly friend who offers Laura perspective and refuge" }
        ],
        synopsis: `Laura Wing, a young American, finds herself trapped in her sister's London household as Selina's affair with another man becomes increasingly public. Laura's American sense of right and wrong clashes with English tolerance for discrete scandal, and she must decide whether to intervene—and at what cost.`,
        currentState: "Essentially complete—only final revisions remain. Henry is pleased with the story's architecture but troubled by its darkness. The ending offers no comfort.",
        historicalNote: "A London Life was published in Scribner's Magazine in 1888 and collected in book form that same year. Critics noted its unflinching treatment of marital unhappiness.",
        relevantLocations: ["London Town Houses", "English Country Estates", "Hyde Park"]
    },
    "Untitled Play": {
        fullTitle: "The American (Dramatization)",
        subtitle: "A Play in Four Acts",
        genre: "Play",
        begun: "1889",
        themes: ["American vs. European Values", "Revenge", "Renunciation", "Theatrical Adaptation"],
        characters: [
            { name: "Christopher Newman", description: "A wealthy American businessman seeking a European wife" },
            { name: "Claire de Cintré", description: "A French noblewoman bound by family obligation" },
            { name: "The Bellegardes", description: "An aristocratic French family harboring a dark secret" }
        ],
        synopsis: `An adaptation of Henry's 1877 novel for the stage. Christopher Newman, a self-made American millionaire, falls in love with a French noblewoman whose family considers him unworthy. When he discovers their guilty secret, he must choose between revenge and renunciation.`,
        currentState: "Barely begun—a few scenes sketched, some dialogue attempted. The theatrical form remains mysterious to Henry. How to compress his novel's psychological subtleties into the crude machinery of the stage? The very thought produces anxiety, yet the dream persists.",
        historicalNote: "James would eventually complete his dramatization of The American, which premiered in 1891 to modest success. It was his first produced play, encouraging him to pursue theatrical ambitions that would culminate in the disastrous premiere of Guy Domville in 1895.",
        excerpt: `"NEWMAN: I don't understand your ideas, but I understand this—that you're the most proud, pretentious people I ever saw."`,
        relevantLocations: ["Comédie-Française", "London Theaters", "Paris Salons"]
    }
};

const WorksModal: React.FC = () => {
    const { state, dispatch } = useGame();
    const { player, selectedWorkIndex } = state;
    const [activeSection, setActiveSection] = useState<'overview' | 'characters' | 'context'>('overview');

    if (!state.showWorksModal || selectedWorkIndex === null) return null;

    const project = player.projects[selectedWorkIndex];
    const workData = WORKS_DATA[project.title] || null;

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'NOVEL': return LucideBookOpen;
            case 'PLAY': return LucideTheater;
            default: return LucideFeather;
        }
    };

    const TypeIcon = getTypeIcon(project.type);

    return (
        <div
            className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-2 md:p-4 animate-fade-in"
            onClick={() => dispatch({ type: 'CLOSE_WORKS_MODAL' })}
        >
            <div
                className="bg-paper-100 dark:bg-gray-900 w-full max-w-5xl max-h-[85dvh] md:max-h-[90vh] rounded-lg border-4 border-gold-600 shadow-2xl overflow-hidden flex flex-col animate-modal-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-ink-900 via-ink-800 to-ink-900 px-3 md:px-6 py-3 md:py-4 flex items-center justify-between border-b-2 border-gold-600 flex-shrink-0">
                    <div className="flex items-center gap-2 md:gap-4 min-w-0">
                        <TypeIcon className="text-gold-500 flex-shrink-0" size={20} />
                        <div className="min-w-0">
                            <h1 className="font-display text-base md:text-xl text-gold-500 tracking-wide truncate">{workData?.fullTitle || project.title}</h1>
                            <p className="text-paper-300 text-[10px] md:text-xs tracking-widest uppercase">
                                {project.type} • {project.progress}% Complete
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => dispatch({ type: 'CLOSE_WORKS_MODAL' })}
                        className="text-paper-300 hover:text-white p-2 rounded-full hover:bg-ink-700 transition-all flex-shrink-0"
                    >
                        <LucideX size={20} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                    {/* Left Sidebar: Navigation - hidden on mobile, shown in footer instead */}
                    <div className="hidden md:flex w-56 bg-ink-900/5 dark:bg-ink-900/50 border-r border-gold-600/30 flex-col flex-shrink-0">
                        {/* Work list */}
                        <div className="p-3 border-b border-gold-600/20">
                            <p className="text-ink-500 dark:text-paper-500 text-[10px] uppercase font-bold tracking-wider mb-2">All Works</p>
                            <div className="space-y-1">
                                {player.projects.map((p, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            dispatch({ type: 'SELECT_WORK', payload: index });
                                            setActiveSection('overview');
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded text-sm transition-all flex items-center gap-2 ${
                                            index === selectedWorkIndex
                                                ? 'bg-gold-600/20 text-gold-600 dark:text-gold-500 font-medium'
                                                : 'text-ink-600 dark:text-paper-400 hover:bg-ink-100 dark:hover:bg-ink-800'
                                        }`}
                                    >
                                        <LucideChevronRight size={12} className={index === selectedWorkIndex ? 'opacity-100' : 'opacity-0'} />
                                        <span className="truncate">{p.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Section navigation */}
                        {workData && (
                            <div className="p-3 flex-1">
                                <p className="text-ink-500 dark:text-paper-500 text-[10px] uppercase font-bold tracking-wider mb-2">Sections</p>
                                <div className="space-y-1">
                                    {[
                                        { id: 'overview', label: 'Overview', icon: LucideScrollText },
                                        { id: 'characters', label: 'Characters', icon: LucideUsers },
                                        { id: 'context', label: 'Context', icon: LucideCalendar },
                                    ].map(section => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id as any)}
                                            className={`w-full text-left px-3 py-2 rounded text-sm transition-all flex items-center gap-2 ${
                                                activeSection === section.id
                                                    ? 'bg-gold-600/20 text-gold-600 dark:text-gold-500 font-medium'
                                                    : 'text-ink-600 dark:text-paper-400 hover:bg-ink-100 dark:hover:bg-ink-800'
                                            }`}
                                        >
                                            <section.icon size={14} />
                                            {section.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Progress indicator */}
                        <div className="p-4 border-t border-gold-600/20">
                            <p className="text-ink-500 dark:text-paper-500 text-[10px] uppercase font-bold tracking-wider mb-2">Progress</p>
                            <div className="w-full h-3 bg-ink-200 dark:bg-ink-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-gold-600 to-gold-500 transition-all"
                                    style={{ width: `${project.progress}%` }}
                                />
                            </div>
                            <p className="text-ink-600 dark:text-paper-400 text-xs mt-2">{project.progress}% complete</p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {workData ? (
                            <>
                                {activeSection === 'overview' && (
                                    <div className="space-y-6">
                                        {/* Meta info */}
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            {workData.begun && (
                                                <div className="flex items-center gap-2 text-ink-600 dark:text-paper-400">
                                                    <LucideCalendar size={14} className="text-gold-600" />
                                                    <span>Begun {workData.begun}</span>
                                                </div>
                                            )}
                                            {workData.serialization && (
                                                <div className="flex items-center gap-2 text-ink-600 dark:text-paper-400">
                                                    <LucideBookOpen size={14} className="text-gold-600" />
                                                    <span>{workData.serialization}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Themes */}
                                        <div>
                                            <p className="text-ink-500 dark:text-paper-500 text-xs uppercase font-bold tracking-wider mb-2">Themes</p>
                                            <div className="flex flex-wrap gap-2">
                                                {workData.themes.map((theme, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 bg-gold-600/10 text-gold-700 dark:text-gold-400 text-sm rounded-full border border-gold-600/20"
                                                    >
                                                        {theme}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Synopsis */}
                                        <div>
                                            <p className="text-ink-500 dark:text-paper-500 text-xs uppercase font-bold tracking-wider mb-2">Synopsis</p>
                                            <p className="text-ink-700 dark:text-paper-300 text-base leading-relaxed whitespace-pre-line">
                                                {workData.synopsis}
                                            </p>
                                        </div>

                                        {/* Current State */}
                                        <div className="bg-ink-900/5 dark:bg-ink-800/50 border-l-4 border-gold-600 p-4 rounded-r">
                                            <p className="text-ink-500 dark:text-paper-500 text-xs uppercase font-bold tracking-wider mb-2">Current State (August 1889)</p>
                                            <p className="text-ink-700 dark:text-paper-300 text-base leading-relaxed">
                                                {workData.currentState}
                                            </p>
                                        </div>

                                        {/* Excerpt if available */}
                                        {workData.excerpt && (
                                            <div className="bg-paper-200 dark:bg-ink-800 p-4 rounded border border-gold-600/20">
                                                <div className="flex items-start gap-2">
                                                    <LucideQuote className="text-gold-600 flex-shrink-0 mt-1" size={16} />
                                                    <p className="text-ink-700 dark:text-paper-300 italic text-base leading-relaxed">
                                                        {workData.excerpt}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeSection === 'characters' && (
                                    <div className="space-y-4">
                                        <p className="text-ink-500 dark:text-paper-500 text-xs uppercase font-bold tracking-wider mb-4">Principal Characters</p>
                                        {workData.characters.map((char, i) => (
                                            <div
                                                key={i}
                                                className="bg-paper-200 dark:bg-ink-800 p-4 rounded border border-gold-600/20"
                                            >
                                                <h4 className="font-bold text-ink-900 dark:text-gold-500 text-base mb-1">{char.name}</h4>
                                                <p className="text-ink-600 dark:text-paper-400 text-base leading-relaxed">{char.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeSection === 'context' && (
                                    <div className="space-y-6">
                                        {/* Historical Note */}
                                        <div>
                                            <p className="text-ink-500 dark:text-paper-500 text-xs uppercase font-bold tracking-wider mb-2">Historical Note</p>
                                            <p className="text-ink-700 dark:text-paper-300 text-base leading-relaxed">
                                                {workData.historicalNote}
                                            </p>
                                        </div>

                                        {/* Relevant Locations */}
                                        {workData.relevantLocations && (
                                            <div>
                                                <p className="text-ink-500 dark:text-paper-500 text-xs uppercase font-bold tracking-wider mb-2">Settings</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {workData.relevantLocations.map((loc, i) => (
                                                        <span
                                                            key={i}
                                                            className="flex items-center gap-1 px-3 py-1 bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-paper-400 text-sm rounded border border-ink-200 dark:border-ink-700"
                                                        >
                                                            <LucideMapPin size={12} />
                                                            {loc}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* General Note */}
                                        <div className="bg-gradient-to-r from-purple-900/10 to-indigo-900/10 dark:from-purple-900/30 dark:to-indigo-900/30 border border-purple-500/20 rounded-lg p-4">
                                            <p className="text-purple-800 dark:text-purple-300 text-sm leading-relaxed">
                                                <strong>Note:</strong> All information about the work's future—publication, reception, historical
                                                significance—represents what actually occurred in history. In the world of this game, these
                                                futures remain unwritten.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <LucideScrollText className="mx-auto text-ink-300 dark:text-ink-600 mb-4" size={48} />
                                <p className="text-ink-500 dark:text-paper-500 text-base">
                                    Detailed information for this work is not yet available.
                                </p>
                                <p className="text-ink-400 dark:text-paper-600 text-sm mt-2">
                                    {project.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-ink-900/5 dark:bg-ink-800 border-t border-gold-600/30 px-4 md:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3 flex-shrink-0">
                    {/* Mobile work selector */}
                    <div className="flex md:hidden gap-2 flex-wrap justify-center">
                        {player.projects.map((p, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    dispatch({ type: 'SELECT_WORK', payload: index });
                                    setActiveSection('overview');
                                }}
                                className={`px-2 py-1 text-xs rounded transition-all ${
                                    index === selectedWorkIndex
                                        ? 'bg-gold-600 text-ink-900 font-bold'
                                        : 'bg-ink-200 dark:bg-ink-700 text-ink-600 dark:text-paper-400'
                                }`}
                            >
                                {p.title.length > 15 ? p.title.substring(0, 12) + '...' : p.title}
                            </button>
                        ))}
                    </div>
                    <p className="text-ink-500 dark:text-paper-500 text-xs md:text-sm italic text-center hidden md:block">
                        "The artist is present in every page of every book from which he sought so assiduously to eliminate himself."
                    </p>
                    <button
                        onClick={() => dispatch({ type: 'CLOSE_WORKS_MODAL' })}
                        className="px-4 py-2 bg-gold-600 hover:bg-gold-500 text-ink-900 text-sm font-bold rounded transition-all w-full md:w-auto"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorksModal;
