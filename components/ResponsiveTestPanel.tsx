import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    LucideX, LucideSmartphone, LucideTablet, LucideMonitor,
    LucideMaximize2, LucideMove, LucideEye, LucideRuler,
    LucideGrid3X3, LucideMousePointer2, LucideAlertTriangle,
    LucideGripVertical, LucideMinimize2, LucideRotateCcw,
    LucideUser, LucideBook, LucidePalette, LucideLibrary,
    LucidePackage, LucideShoppingBag, LucideChevronDown, LucideChevronUp
} from 'lucide-react';
import { useGame } from '../context/GameContext';

interface ResponsiveTestPanelProps {
    show: boolean;
    onClose: () => void;
}

// Common device presets
const DEVICE_PRESETS = [
    { name: 'iPhone SE', width: 375, height: 667, icon: LucideSmartphone, category: 'phone' },
    { name: 'iPhone 14', width: 390, height: 844, icon: LucideSmartphone, category: 'phone' },
    { name: 'iPhone 14 Pro Max', width: 430, height: 932, icon: LucideSmartphone, category: 'phone' },
    { name: 'Android Small', width: 360, height: 640, icon: LucideSmartphone, category: 'phone' },
    { name: 'Pixel 7', width: 412, height: 915, icon: LucideSmartphone, category: 'phone' },
    { name: 'iPad Mini', width: 768, height: 1024, icon: LucideTablet, category: 'tablet' },
    { name: 'iPad Pro 11"', width: 834, height: 1194, icon: LucideTablet, category: 'tablet' },
    { name: 'iPad Pro 12.9"', width: 1024, height: 1366, icon: LucideTablet, category: 'tablet' },
    { name: 'Desktop HD', width: 1366, height: 768, icon: LucideMonitor, category: 'desktop' },
    { name: 'Desktop FHD', width: 1920, height: 1080, icon: LucideMonitor, category: 'desktop' },
];

// Tailwind breakpoints
const BREAKPOINTS = [
    { name: 'sm', min: 640, color: 'bg-blue-500', desc: 'Small phones landscape' },
    { name: 'md', min: 768, color: 'bg-green-500', desc: 'Tablets portrait' },
    { name: 'lg', min: 1024, color: 'bg-yellow-500', desc: 'Tablets landscape / small desktop' },
    { name: 'xl', min: 1280, color: 'bg-orange-500', desc: 'Desktop' },
    { name: '2xl', min: 1536, color: 'bg-red-500', desc: 'Large desktop' },
];

// Game-specific modal tests
const MODAL_TESTS = [
    { name: 'Player', icon: LucideUser, action: 'OPEN_PLAYER_MODAL', key: 'P' },
    { name: 'Journal', icon: LucideBook, action: 'OPEN_JOURNAL', key: 'J' },
    { name: 'Sketchbook', icon: LucidePalette, action: 'OPEN_SKETCHBOOK', key: 'S' },
    { name: 'Works', icon: LucideLibrary, action: 'OPEN_WORKS_MODAL', key: 'W' },
    { name: 'Inventory', icon: LucidePackage, action: 'TOGGLE_INVENTORY_MODAL', key: 'I' },
];

const ResponsiveTestPanel: React.FC<ResponsiveTestPanelProps> = ({ show, onClose }) => {
    const { dispatch } = useGame();
    const [viewportSize, setViewportSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [showOverlay, setShowOverlay] = useState(false);
    const [showTouchTargets, setShowTouchTargets] = useState(false);
    const [showGridOverlay, setShowGridOverlay] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [issueCount, setIssueCount] = useState(0);
    const [expandedSection, setExpandedSection] = useState<string | null>('viewport');

    // Dragging state
    const [position, setPosition] = useState({ x: window.innerWidth - 340, y: 80 });
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const panelRef = useRef<HTMLDivElement>(null);

    // Track real viewport size
    useEffect(() => {
        const handleResize = () => {
            setViewportSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Scan for touch target issues
    const scanForIssues = useCallback(() => {
        let issues = 0;
        const clickables = document.querySelectorAll('button, a, [role="button"], input, select, textarea');
        clickables.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                if (rect.width < 44 || rect.height < 44) {
                    issues++;
                }
            }
        });
        setIssueCount(issues);
        return issues;
    }, []);

    // Scan on mount and viewport changes
    useEffect(() => {
        if (show) {
            const timer = setTimeout(scanForIssues, 500);
            return () => clearTimeout(timer);
        }
    }, [show, viewportSize, scanForIssues]);

    // Touch target highlighter
    useEffect(() => {
        if (!showTouchTargets) return;

        const highlights: HTMLDivElement[] = [];
        const clickables = document.querySelectorAll('button, a, [role="button"], input, select, textarea');

        clickables.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                const highlight = document.createElement('div');
                highlight.className = 'touch-target-highlight';
                highlight.style.cssText = `
                    position: fixed;
                    left: ${rect.left}px;
                    top: ${rect.top}px;
                    width: ${rect.width}px;
                    height: ${rect.height}px;
                    pointer-events: none;
                    z-index: 9999;
                    border: 2px solid ${rect.width < 44 || rect.height < 44 ? '#ef4444' : '#22c55e'};
                    background: ${rect.width < 44 || rect.height < 44 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)'};
                    border-radius: 4px;
                `;
                document.body.appendChild(highlight);
                highlights.push(highlight);
            }
        });

        return () => {
            highlights.forEach(h => h.remove());
        };
    }, [showTouchTargets, viewportSize]);

    // Dragging handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.drag-handle')) {
            setIsDragging(true);
            dragOffset.current = {
                x: e.clientX - position.x,
                y: e.clientY - position.y
            };
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragOffset.current.x)),
                    y: Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.current.y))
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // Get current breakpoint
    const getCurrentBreakpoint = (width: number) => {
        for (let i = BREAKPOINTS.length - 1; i >= 0; i--) {
            if (width >= BREAKPOINTS[i].min) {
                return BREAKPOINTS[i];
            }
        }
        return { name: 'xs', min: 0, color: 'bg-purple-500', desc: 'Mobile portrait' };
    };

    const currentBreakpoint = getCurrentBreakpoint(viewportSize.width);

    const toggleOrientation = () => {
        setOrientation(o => o === 'portrait' ? 'landscape' : 'portrait');
    };

    const resetPosition = () => {
        setPosition({ x: window.innerWidth - 340, y: 80 });
    };

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    // Open modal helper
    const openModal = (action: string) => {
        dispatch({ type: action as any });
    };

    if (!show) return null;

    // Minimized view
    if (isMinimized) {
        return (
            <div
                ref={panelRef}
                style={{ left: position.x, top: position.y }}
                className="fixed z-[200] bg-ink-900 border-2 border-gold-500 rounded-lg shadow-2xl animate-fade-in cursor-move"
                onMouseDown={handleMouseDown}
            >
                <div className="drag-handle flex items-center gap-2 px-3 py-2">
                    <LucideGripVertical size={14} className="text-gold-500" />
                    <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${currentBreakpoint.color}`}>
                        {currentBreakpoint.name}
                    </span>
                    <span className="text-gold-400 text-xs font-mono">{viewportSize.width}×{viewportSize.height}</span>
                    {issueCount > 0 && (
                        <span className="flex items-center gap-1 text-red-400 text-xs">
                            <LucideAlertTriangle size={12} />
                            {issueCount}
                        </span>
                    )}
                    <button onClick={() => setIsMinimized(false)} className="text-paper-400 hover:text-white ml-2">
                        <LucideMaximize2 size={14} />
                    </button>
                    <button onClick={onClose} className="text-paper-400 hover:text-red-400">
                        <LucideX size={14} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Floating panel */}
            <div
                ref={panelRef}
                style={{ left: position.x, top: position.y }}
                className="fixed z-[200] bg-ink-900 border-2 border-gold-500 rounded-lg shadow-2xl w-80 max-h-[85vh] overflow-hidden animate-fade-in"
                onMouseDown={handleMouseDown}
            >
                {/* Header - Draggable */}
                <div className="drag-handle bg-gradient-to-r from-gold-600 to-gold-500 px-3 py-2 flex items-center justify-between cursor-move">
                    <div className="flex items-center gap-2">
                        <LucideGripVertical size={14} className="text-ink-900" />
                        <LucideRuler size={16} className="text-ink-900" />
                        <h2 className="font-display font-bold text-ink-900 text-sm">Responsive Test</h2>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={resetPosition} className="text-ink-900 hover:text-ink-700 p-1" title="Reset position">
                            <LucideRotateCcw size={14} />
                        </button>
                        <button onClick={() => setIsMinimized(true)} className="text-ink-900 hover:text-ink-700 p-1" title="Minimize">
                            <LucideMinimize2 size={14} />
                        </button>
                        <button onClick={onClose} className="text-ink-900 hover:text-ink-700 p-1">
                            <LucideX size={16} />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[calc(85vh-44px)]">
                    {/* Viewport Section */}
                    <div className="border-b border-ink-700">
                        <button
                            onClick={() => toggleSection('viewport')}
                            className="w-full flex items-center justify-between p-3 hover:bg-ink-800/50"
                        >
                            <span className="text-paper-300 text-xs uppercase tracking-wide flex items-center gap-2">
                                <LucideMonitor size={14} />
                                Viewport
                            </span>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${currentBreakpoint.color}`}>
                                    {currentBreakpoint.name}
                                </span>
                                {expandedSection === 'viewport' ? <LucideChevronUp size={14} className="text-paper-500" /> : <LucideChevronDown size={14} className="text-paper-500" />}
                            </div>
                        </button>
                        {expandedSection === 'viewport' && (
                            <div className="px-3 pb-3 space-y-3">
                                <div className="flex items-center justify-center gap-4 bg-ink-800 rounded-lg p-3">
                                    <div className="text-center">
                                        <div className="text-2xl font-mono text-gold-400">{viewportSize.width}</div>
                                        <div className="text-[10px] text-paper-500">width</div>
                                    </div>
                                    <div className="text-paper-500 text-xl">×</div>
                                    <div className="text-center">
                                        <div className="text-2xl font-mono text-gold-400">{viewportSize.height}</div>
                                        <div className="text-[10px] text-paper-500">height</div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-paper-500 text-center">{currentBreakpoint.desc}</p>

                                {/* Breakpoint bar */}
                                <div className="flex gap-0.5 rounded overflow-hidden">
                                    {[{ name: 'xs', min: 0, color: 'bg-purple-500' }, ...BREAKPOINTS].map((bp) => (
                                        <div
                                            key={bp.name}
                                            className={`flex-1 text-center py-1.5 text-[9px] font-bold transition-all ${
                                                currentBreakpoint.name === bp.name
                                                    ? `${bp.color} text-white`
                                                    : 'bg-ink-700 text-paper-600'
                                            }`}
                                        >
                                            {bp.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Device Presets Section */}
                    <div className="border-b border-ink-700">
                        <button
                            onClick={() => toggleSection('devices')}
                            className="w-full flex items-center justify-between p-3 hover:bg-ink-800/50"
                        >
                            <span className="text-paper-300 text-xs uppercase tracking-wide flex items-center gap-2">
                                <LucideSmartphone size={14} />
                                Device Presets
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleOrientation(); }}
                                    className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-ink-700 text-paper-400 hover:bg-ink-600"
                                >
                                    <LucideMove size={10} />
                                    {orientation}
                                </button>
                                {expandedSection === 'devices' ? <LucideChevronUp size={14} className="text-paper-500" /> : <LucideChevronDown size={14} className="text-paper-500" />}
                            </div>
                        </button>
                        {expandedSection === 'devices' && (
                            <div className="px-3 pb-3">
                                <div className="grid grid-cols-2 gap-1.5">
                                    {DEVICE_PRESETS.map((preset) => {
                                        const Icon = preset.icon;
                                        const presetWidth = orientation === 'portrait' ? preset.width : preset.height;
                                        const presetHeight = orientation === 'portrait' ? preset.height : preset.width;
                                        const matchesViewport = Math.abs(viewportSize.width - presetWidth) < 20;
                                        return (
                                            <div
                                                key={preset.name}
                                                className={`p-2 rounded text-center transition-all ${
                                                    matchesViewport
                                                        ? 'bg-gold-600/20 border border-gold-500'
                                                        : 'bg-ink-800 border border-transparent'
                                                }`}
                                            >
                                                <Icon size={14} className={`mx-auto mb-0.5 ${matchesViewport ? 'text-gold-400' : 'text-paper-500'}`} />
                                                <div className={`text-[9px] leading-tight truncate ${matchesViewport ? 'text-gold-400' : 'text-paper-400'}`}>{preset.name}</div>
                                                <div className="text-[8px] text-paper-600">
                                                    {presetWidth}×{presetHeight}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-[10px] text-paper-600 text-center mt-2">
                                    Resize browser to match device dimensions
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Quick Modal Tests Section */}
                    <div className="border-b border-ink-700">
                        <button
                            onClick={() => toggleSection('modals')}
                            className="w-full flex items-center justify-between p-3 hover:bg-ink-800/50"
                        >
                            <span className="text-paper-300 text-xs uppercase tracking-wide flex items-center gap-2">
                                <LucideMaximize2 size={14} />
                                Test Modals
                            </span>
                            {expandedSection === 'modals' ? <LucideChevronUp size={14} className="text-paper-500" /> : <LucideChevronDown size={14} className="text-paper-500" />}
                        </button>
                        {expandedSection === 'modals' && (
                            <div className="px-3 pb-3">
                                <div className="grid grid-cols-3 gap-1.5">
                                    {MODAL_TESTS.map((modal) => {
                                        const Icon = modal.icon;
                                        return (
                                            <button
                                                key={modal.name}
                                                onClick={() => openModal(modal.action)}
                                                className="flex flex-col items-center gap-1 p-2 rounded bg-ink-800 hover:bg-ink-700 transition-colors"
                                            >
                                                <Icon size={16} className="text-gold-500" />
                                                <span className="text-[9px] text-paper-400">{modal.name}</span>
                                                <span className="text-[8px] text-paper-600 bg-ink-700 px-1 rounded">{modal.key}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Debug Overlays Section */}
                    <div className="border-b border-ink-700">
                        <button
                            onClick={() => toggleSection('overlays')}
                            className="w-full flex items-center justify-between p-3 hover:bg-ink-800/50"
                        >
                            <span className="text-paper-300 text-xs uppercase tracking-wide flex items-center gap-2">
                                <LucideEye size={14} />
                                Debug Overlays
                            </span>
                            <div className="flex items-center gap-2">
                                {issueCount > 0 && (
                                    <span className="flex items-center gap-1 text-red-400 text-[10px]">
                                        <LucideAlertTriangle size={10} />
                                        {issueCount} issues
                                    </span>
                                )}
                                {expandedSection === 'overlays' ? <LucideChevronUp size={14} className="text-paper-500" /> : <LucideChevronDown size={14} className="text-paper-500" />}
                            </div>
                        </button>
                        {expandedSection === 'overlays' && (
                            <div className="px-3 pb-3 space-y-2">
                                <button
                                    onClick={() => setShowTouchTargets(!showTouchTargets)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm ${
                                        showTouchTargets ? 'bg-gold-600 text-ink-900' : 'bg-ink-800 text-paper-400 hover:bg-ink-700'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <LucideMousePointer2 size={14} />
                                        Touch Targets (44px min)
                                    </span>
                                    {showTouchTargets && <span className="text-xs">ON</span>}
                                </button>
                                <button
                                    onClick={() => setShowOverlay(!showOverlay)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm ${
                                        showOverlay ? 'bg-gold-600 text-ink-900' : 'bg-ink-800 text-paper-400 hover:bg-ink-700'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <LucideEye size={14} />
                                        Safe Areas
                                    </span>
                                    {showOverlay && <span className="text-xs">ON</span>}
                                </button>
                                <button
                                    onClick={() => setShowGridOverlay(!showGridOverlay)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm ${
                                        showGridOverlay ? 'bg-gold-600 text-ink-900' : 'bg-ink-800 text-paper-400 hover:bg-ink-700'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <LucideGrid3X3 size={14} />
                                        Grid Lines
                                    </span>
                                    {showGridOverlay && <span className="text-xs">ON</span>}
                                </button>
                                <button
                                    onClick={() => {
                                        const count = scanForIssues();
                                        alert(`Found ${count} elements smaller than 44×44px touch target minimum.\n\n${count > 0 ? 'Enable "Touch Targets" overlay to see them highlighted in red.' : 'All touch targets are correctly sized!'}`);
                                    }}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded text-sm bg-ink-800 text-paper-400 hover:bg-ink-700"
                                >
                                    <span className="flex items-center gap-2">
                                        <LucideAlertTriangle size={14} />
                                        Scan for Issues
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Tips */}
                    <div className="p-3">
                        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-2">
                            <p className="text-blue-300 text-[10px] leading-relaxed">
                                <strong>Tips:</strong> Use Chrome DevTools (F12 → Toggle device toolbar) for full device simulation. This panel helps identify responsive issues.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Safe area overlay */}
            {showOverlay && (
                <div className="fixed inset-0 pointer-events-none z-[150]">
                    {/* Top safe area */}
                    <div className="absolute top-0 left-0 right-0 h-[env(safe-area-inset-top,44px)] bg-red-500/20 border-b-2 border-dashed border-red-500">
                        <span className="absolute left-2 top-1 text-[10px] text-red-400 font-mono">safe-area-top (notch/status bar)</span>
                    </div>
                    {/* Bottom safe area */}
                    <div className="absolute bottom-0 left-0 right-0 h-[max(env(safe-area-inset-bottom,0px),34px)] bg-red-500/20 border-t-2 border-dashed border-red-500">
                        <span className="absolute left-2 bottom-1 text-[10px] text-red-400 font-mono">safe-area-bottom (home indicator)</span>
                    </div>
                    {/* Touch target reference */}
                    <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-2">
                        <div className="w-11 h-11 border-2 border-dashed border-green-500 rounded flex items-center justify-center bg-green-500/10">
                            <span className="text-[8px] text-green-400 font-mono">44px</span>
                        </div>
                        <span className="text-[9px] text-green-400">min touch</span>
                    </div>
                    {/* Breakpoint indicator bar */}
                    <div className={`absolute bottom-20 left-0 right-0 h-1 ${currentBreakpoint.color}`}>
                        <span className="absolute left-2 -top-5 text-xs text-white bg-black/70 px-2 py-0.5 rounded font-mono">
                            {currentBreakpoint.name}: {viewportSize.width}px
                        </span>
                    </div>
                </div>
            )}

            {/* Grid overlay */}
            {showGridOverlay && (
                <div className="fixed inset-0 pointer-events-none z-[149]">
                    {/* Vertical lines every 100px */}
                    {Array.from({ length: Math.ceil(viewportSize.width / 100) }).map((_, i) => (
                        <div
                            key={`v-${i}`}
                            className="absolute top-0 bottom-0 border-l border-cyan-500/30"
                            style={{ left: i * 100 }}
                        >
                            <span className="absolute top-1 left-1 text-[8px] text-cyan-400/50 font-mono">{i * 100}</span>
                        </div>
                    ))}
                    {/* Horizontal lines every 100px */}
                    {Array.from({ length: Math.ceil(viewportSize.height / 100) }).map((_, i) => (
                        <div
                            key={`h-${i}`}
                            className="absolute left-0 right-0 border-t border-cyan-500/30"
                            style={{ top: i * 100 }}
                        >
                            <span className="absolute top-1 left-1 text-[8px] text-cyan-400/50 font-mono">{i * 100}</span>
                        </div>
                    ))}
                    {/* Breakpoint markers */}
                    {BREAKPOINTS.map((bp) => (
                        <div
                            key={bp.name}
                            className={`absolute top-0 bottom-0 border-l-2 border-dashed ${bp.color.replace('bg-', 'border-')}/50`}
                            style={{ left: bp.min }}
                        >
                            <span className={`absolute top-8 -translate-x-1/2 text-[10px] ${bp.color.replace('bg-', 'text-')} font-bold bg-black/50 px-1 rounded`}>
                                {bp.name}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default ResponsiveTestPanel;
