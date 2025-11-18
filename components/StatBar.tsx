
import React from 'react';

interface StatBarProps {
    label: string;
    value: number;
    max: number;
    color: string;
    icon?: React.ReactNode;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, max, color, icon }) => {
    const percent = Math.min(100, Math.max(0, (value / max) * 100));
    
    return (
        <div className="mb-2">
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1">
                <span className="flex items-center gap-1">{icon} {label}</span>
                <span>{value}/{max}</span>
            </div>
            <div className="h-3 w-full bg-ink-900/20 rounded-sm overflow-hidden shadow-inner relative border border-ink-900/10">
                {/* Background Stripe Pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #000 5px, #000 10px)'
                }}></div>
                
                {/* Fill */}
                <div 
                    className={`h-full transition-all duration-500 ease-out relative ${color}`} 
                    style={{ width: `${percent}%` }}
                >
                    <div className="absolute inset-0 bg-white/20"></div>
                </div>
            </div>
        </div>
    );
};

export default StatBar;
