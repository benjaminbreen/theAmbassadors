import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { LucideX, LucideBookOpen, LucideFeather, LucideHistory, LucideQuote, LucideSparkles } from 'lucide-react';
import { DiscoveredPhrase } from '../types';
import { playSound } from '../services/audioService';

type JournalTab = 'phrases' | 'events' | 'all';

const JournalModal: React.FC = () => {
    const { state, dispatch } = useGame();
    const [activeTab, setActiveTab] = useState<JournalTab>('all');

    // Play page turn sound on mount
    useEffect(() => {
        if (state.showJournal && !state.audio.muted) {
            playSound('PAGE_TURN');
        }
    }, [state.showJournal]);

    if (!state.showJournal) return null;

    const { discoveredPhrases, eventHistory } = state.eventState;

    // Format time of day nicely
    const formatTimeOfDay = (time: string) => {
        const timeMap: Record<string, string> = {
            'morning': 'the morning light',
            'afternoon': 'the afternoon sun',
            'evening': 'the evening glow',
            'night': 'the gaslit night'
        };
        return timeMap[time] || time;
    };

    // Format timestamp to relative time
    const formatRelativeTime = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    };

    // Get theme color for phrase
    const getThemeColor = (theme: string) => {
        const colors: Record<string, string> = {
            'memory': 'text-blue-300',
            'observation': 'text-green-300',
            'mortality': 'text-purple-300',
            'art': 'text-gold-300',
            'love': 'text-pink-300',
            'society': 'text-amber-300',
            'consciousness': 'text-cyan-300',
            'america': 'text-red-300',
            'europe': 'text-indigo-300'
        };
        return colors[theme] || 'text-paper-200';
    };

    // Render a single phrase entry
    const renderPhraseEntry = (phrase: DiscoveredPhrase, index: number) => (
        <div
            key={phrase.phraseId}
            className="mb-6 pb-6 border-b border-ink-700/50 last:border-0"
        >
            <div className="flex items-start gap-3 mb-2">
                <LucideQuote className="text-gold-400 shrink-0 mt-1" size={16} />
                <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-widest text-paper-300 mb-1 font-display">
                        A thought that came to me at {phrase.discoveredAt.zoneName} during {formatTimeOfDay(phrase.discoveredAt.timeOfDay)}
                    </div>
                    <p className="text-paper-100 font-serif text-md leading-relaxed ">
                        "{phrase.text}"
                    </p>
                    {phrase.references && phrase.references.length > 0 && (
                        <div className="mt-2 text-xs text-paper-200">
                            <span className="text-paper-300">Concerning: </span>
                            {phrase.references.join(', ')}
                        </div>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                        <span className={`text-xs font-mono font-semibold uppercase tracking-wider ${getThemeColor(phrase.theme)}`}>
                            {phrase.theme}
                        </span>
                        <span className="text-paper-400 text-[10px]">
                            {formatRelativeTime(phrase.discoveredAt.timestamp)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    // Render a single event entry
    const renderEventEntry = (event: typeof eventHistory[0], index: number) => {
        // Transform the outcome description into first-person narrative style
        const narrativeText = event.outcomeDescription;

        return (
            <div
                key={`${event.eventId}-${event.timestamp}`}
                className="mb-5 pb-5 border-b border-ink-700/50 last:border-0"
            >
                <div className="flex items-start gap-3">
                    <LucideFeather className="text-purple-400 shrink-0 mt-1" size={16} />
                    <div className="flex-1">
                        {event.zoneName && (
                            <div className="text-[10px] uppercase tracking-widest text-paper-300 mb-1 font-display">
                                At {event.zoneName}
                            </div>
                        )}
                        <p className="text-paper-100 text-[20px] italic leading-relaxed font-serif">
                            {narrativeText}
                        </p>
                        <div className="mt-0 text-paper-400 text-[10px]">
                            {formatRelativeTime(event.timestamp)}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Combine and sort all entries by timestamp for "all" view
    const getAllEntries = () => {
        const entries: Array<{
            type: 'phrase' | 'event';
            timestamp: number;
            data: DiscoveredPhrase | typeof eventHistory[0];
        }> = [];

        discoveredPhrases.forEach(phrase => {
            entries.push({
                type: 'phrase',
                timestamp: phrase.discoveredAt.timestamp,
                data: phrase
            });
        });

        eventHistory.forEach(event => {
            entries.push({
                type: 'event',
                timestamp: event.timestamp,
                data: event
            });
        });

        return entries.sort((a, b) => b.timestamp - a.timestamp);
    };

    const allEntries = getAllEntries();
    const hasContent = discoveredPhrases.length > 0 || eventHistory.length > 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => dispatch({ type: 'CLOSE_JOURNAL' })}
        >
            <div
                className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 rounded-lg border-2 border-gold-600 shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-modal-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gold-600/50 bg-ink-900/80">
                    <div className="flex items-center gap-3">
                        <LucideBookOpen className="text-gold-400" size={24} />
                        <div>
                            <h2 className="text-xl font-bold uppercase text-gold-400 tracking-wider">
                                The Notebook of Mr. Henry James
                            </h2>
                            <p className="text-sm text-paper-200 font-serif italic">
                                Eddies from the stream of consciousness...
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => dispatch({ type: 'CLOSE_JOURNAL' })}
                        className="p-2 hover:bg-ink-700 rounded-full transition-colors"
                    >
                        <LucideX className="text-paper-200" size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-ink-700 bg-ink-800/50">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-display transition-colors ${
                            activeTab === 'all'
                                ? 'text-gold-400 font-bold  border-b-2 border-gold-400 bg-ink-800'
                                : 'text-paper-200 hover:text-paper-100'
                        }`}
                    >
                        <LucideHistory size={14} />
                        All Entries
                        <span className="text-xs text-paper-300">({allEntries.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('phrases')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-display transition-colors ${
                            activeTab === 'phrases'
                                ? 'text-gold-400 font-bold  border-b-2 border-gold-400 bg-ink-800'
                                : 'text-paper-200 hover:text-paper-100'
                        }`}
                    >
                        <LucideSparkles size={14} />
                        Phrases
                        <span className="text-xs text-paper-300">({discoveredPhrases.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-display transition-colors ${
                            activeTab === 'events'
                                ? 'text-gold-400 font-bold  border-b-2 border-gold-400 bg-ink-800'
                                : 'text-paper-200 hover:text-paper-100'
                        }`}
                    >
                        <LucideFeather size={14} />
                        Moments
                        <span className="text-xs text-paper-300">({eventHistory.length})</span>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(80vh-160px)] p-6 custom-scrollbar">
                    {!hasContent ? (
                        <div className="text-center py-12">
                            <LucideBookOpen className="mx-auto text-paper-400 mb-4" size={48} />
                            <p className="text-paper-200 font-serif italic text-lg mb-2">
                                The pages remain blank...
                            </p>
                            <p className="text-paper-300 text-sm">
                                As you explore the Exposition, thoughts and moments will accumulate here.
                            </p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'all' && (
                                <div>
                                    {allEntries.map((entry, index) =>
                                        entry.type === 'phrase'
                                            ? renderPhraseEntry(entry.data as DiscoveredPhrase, index)
                                            : renderEventEntry(entry.data as typeof eventHistory[0], index)
                                    )}
                                </div>
                            )}
                            {activeTab === 'phrases' && (
                                <div>
                                    {discoveredPhrases.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-paper-300 font-serif italic">
                                                No phrases have come to you yet...
                                            </p>
                                        </div>
                                    ) : (
                                        discoveredPhrases.map((phrase, index) =>
                                            renderPhraseEntry(phrase, index)
                                        )
                                    )}
                                </div>
                            )}
                            {activeTab === 'events' && (
                                <div>
                                    {eventHistory.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-paper-300 font-serif italic">
                                                No moments of note have been recorded...
                                            </p>
                                        </div>
                                    ) : (
                                        eventHistory.map((event, index) =>
                                            renderEventEntry(event, index)
                                        )
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer stats */}
                {hasContent && (
                    <div className="border-t border-ink-700 p-3 bg-ink-900/80 flex items-center justify-between text-xs text-paper-300">
                        <span>
                            {discoveredPhrases.length} phrase{discoveredPhrases.length !== 1 ? 's' : ''} discovered
                        </span>
                        <span>
                            {eventHistory.length} moment{eventHistory.length !== 1 ? 's' : ''} recorded
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalModal;
