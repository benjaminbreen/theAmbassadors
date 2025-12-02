import React from 'react';

// Statue variants by cultural style

export const STATUE_GRAPHICS: Record<string, JSX.Element> = {
    // Default Western/Classical statue (u)
    'u': (
        <g>
            <ellipse cx="13" cy="22" rx="7" ry="2" fill="#000" opacity="0.2"/>
            <rect x="2" y="18" width="20" height="6" fill="#78716C"/>
            <rect x="4" y="14" width="16" height="5" fill="#A8A29E"/>
            <rect x="3" y="13" width="18" height="2" fill="#B8B5B1"/>
            <rect x="6" y="20" width="12" height="3" fill="#8B8178"/>
            <ellipse cx="12" cy="6" rx="5" ry="8" fill="#E7E5E4"/>
            <ellipse cx="12" cy="4" rx="4.5" ry="7" fill="#D6D3D1"/>
            <circle cx="12" cy="-6" r="4" fill="#E7E5E4"/>
            <circle cx="12" cy="-7" r="3.5" fill="#D6D3D1"/>
            <rect x="10" y="-2" width="4" height="4" fill="#E7E5E4"/>
            <path d="M7 4 Q2 0 4 -6" stroke="#E7E5E4" strokeWidth="3" fill="none"/>
            <path d="M17 4 Q22 0 20 -6" stroke="#E7E5E4" strokeWidth="3" fill="none"/>
            <circle cx="4" cy="-6" r="1.5" fill="#D6D3D1"/>
            <circle cx="20" cy="-6" r="1.5" fill="#D6D3D1"/>
            <path d="M7 10 Q12 8 17 10 L16 14 Q12 12 8 14 Z" fill="#C4C1BD"/>
            <ellipse cx="11" cy="-8" rx="0.5" ry="0.3" fill="#A8A29E"/>
            <ellipse cx="13" cy="-8" rx="0.5" ry="0.3" fill="#A8A29E"/>
            <path d="M8 -10 Q12 -14 16 -10" fill="#C4C1BD"/>
        </g>
    ),

    // Asian Buddha/deity (Ü) - TALL
    'Ü': (
        <g>
            <ellipse cx="12" cy="22" rx="8" ry="2" fill="#000" opacity="0.2"/>
            <ellipse cx="12" cy="20" rx="10" ry="4" fill="#B8860B"/>
            <ellipse cx="12" cy="18" rx="9" ry="3" fill="#DAA520"/>
            <path d="M2 18 Q6 14 12 18 Q18 14 22 18" fill="#FFD700" stroke="#B8860B" strokeWidth="0.5"/>
            <ellipse cx="12" cy="10" rx="8" ry="8" fill="#B8860B"/>
            <ellipse cx="12" cy="8" rx="7" ry="7" fill="#DAA520"/>
            <path d="M5 14 Q12 10 19 14" fill="#CD7F32"/>
            <ellipse cx="12" cy="12" rx="4" ry="2" fill="#DAA520"/>
            <circle cx="12" cy="-4" r="5" fill="#DAA520"/>
            <path d="M10 -5 Q12 -4 14 -5" stroke="#8B7355" strokeWidth="0.5" fill="none"/>
            <ellipse cx="10" cy="-6" rx="0.8" ry="0.3" fill="#8B7355"/>
            <ellipse cx="14" cy="-6" rx="0.8" ry="0.3" fill="#8B7355"/>
            <ellipse cx="12" cy="-10" rx="2" ry="3" fill="#DAA520"/>
            <circle cx="12" cy="-4" r="8" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.5"/>
            <ellipse cx="7" cy="-2" rx="1" ry="2" fill="#DAA520"/>
            <ellipse cx="17" cy="-2" rx="1" ry="2" fill="#DAA520"/>
        </g>
    ),

    // Asian small figure (ü)
    'ü': (
        <g>
            <ellipse cx="12" cy="22" rx="5" ry="1.5" fill="#000" opacity="0.15"/>
            <rect x="6" y="18" width="12" height="6" fill="#8B7355"/>
            <ellipse cx="12" cy="18" rx="6" ry="2" fill="#A08464"/>
            <ellipse cx="12" cy="12" rx="5" ry="6" fill="#DAA520"/>
            <circle cx="12" cy="6" r="3" fill="#DAA520"/>
            <path d="M11 7 Q12 7.5 13 7" stroke="#8B7355" strokeWidth="0.3" fill="none"/>
            <ellipse cx="12" cy="3" rx="1" ry="1.5" fill="#B8860B"/>
            <ellipse cx="12" cy="14" rx="2" ry="1" fill="#B8860B"/>
        </g>
    ),

    // Egyptian Pharaoh (Ö) - TALL
    'Ö': (
        <g>
            <ellipse cx="12" cy="22" rx="6" ry="2" fill="#000" opacity="0.2"/>
            <rect x="4" y="18" width="16" height="6" fill="#C4A574"/>
            <rect x="5" y="17" width="14" height="2" fill="#D4B584"/>
            <rect x="6" y="19" width="3" height="3" fill="#8B7355"/>
            <rect x="10" y="19" width="4" height="3" fill="#8B7355"/>
            <rect x="15" y="19" width="3" height="3" fill="#8B7355"/>
            <rect x="8" y="4" width="8" height="14" fill="#D4B584"/>
            <rect x="5" y="6" width="3" height="10" fill="#D4B584"/>
            <rect x="16" y="6" width="3" height="10" fill="#D4B584"/>
            <path d="M6 -2 L12 -12 L18 -2 Z" fill="#1E3A8A"/>
            <path d="M7 -1 L12 -10 L17 -1 Z" fill="#3B82F6"/>
            <line x1="9" y1="-6" x2="9" y2="-1" stroke="#FFD700" strokeWidth="0.5"/>
            <line x1="12" y1="-10" x2="12" y2="-1" stroke="#FFD700" strokeWidth="0.5"/>
            <line x1="15" y1="-6" x2="15" y2="-1" stroke="#FFD700" strokeWidth="0.5"/>
            <rect x="9" y="-2" width="6" height="6" fill="#D4B584"/>
            <ellipse cx="10" cy="0" rx="1" ry="0.5" fill="#1A202C"/>
            <ellipse cx="14" cy="0" rx="1" ry="0.5" fill="#1A202C"/>
            <path d="M12 -4 Q11 -6 12 -8 Q13 -6 12 -4" fill="#FFD700"/>
            <path d="M10 8 L8 2" stroke="#FFD700" strokeWidth="1"/>
            <path d="M14 8 L16 2" stroke="#FFD700" strokeWidth="1"/>
        </g>
    ),

    // Egyptian bust (ö)
    'ö': (
        <g>
            <ellipse cx="12" cy="22" rx="5" ry="1.5" fill="#000" opacity="0.15"/>
            <rect x="6" y="18" width="12" height="6" fill="#4A3728"/>
            <rect x="5" y="17" width="14" height="2" fill="#5D4037"/>
            <ellipse cx="12" cy="14" rx="5" ry="3" fill="#D4B584"/>
            <path d="M6 10 L12 4 L18 10 Z" fill="#1E3A8A"/>
            <line x1="9" y1="8" x2="9" y2="10" stroke="#FFD700" strokeWidth="0.3"/>
            <line x1="12" y1="4" x2="12" y2="10" stroke="#FFD700" strokeWidth="0.3"/>
            <line x1="15" y1="8" x2="15" y2="10" stroke="#FFD700" strokeWidth="0.3"/>
            <rect x="9" y="8" width="6" height="6" fill="#D4B584"/>
            <ellipse cx="10" cy="10" rx="0.8" ry="0.4" fill="#1A202C"/>
            <ellipse cx="14" cy="10" rx="0.8" ry="0.4" fill="#1A202C"/>
            <circle cx="12" cy="6" r="1" fill="#FFD700"/>
        </g>
    ),

    // African carved figure (Ä) - TALL
    'Ä': (
        <g>
            <ellipse cx="12" cy="22" rx="5" ry="2" fill="#000" opacity="0.2"/>
            <ellipse cx="12" cy="20" rx="6" ry="3" fill="#3D2817"/>
            <rect x="9" y="6" width="6" height="14" fill="#5D3A1A"/>
            <rect x="10" y="6" width="4" height="14" fill="#6B4423"/>
            <line x1="10" y1="10" x2="14" y2="10" stroke="#3D2817" strokeWidth="0.5"/>
            <line x1="10" y1="14" x2="14" y2="14" stroke="#3D2817" strokeWidth="0.5"/>
            <rect x="6" y="8" width="3" height="6" fill="#5D3A1A"/>
            <rect x="15" y="8" width="3" height="6" fill="#5D3A1A"/>
            <ellipse cx="12" cy="-2" rx="4" ry="6" fill="#5D3A1A"/>
            <ellipse cx="12" cy="-3" rx="3.5" ry="5" fill="#6B4423"/>
            <ellipse cx="10" cy="-4" rx="1.5" ry="2" fill="#F5DEB3"/>
            <ellipse cx="14" cy="-4" rx="1.5" ry="2" fill="#F5DEB3"/>
            <circle cx="10" cy="-4" r="0.8" fill="#1A202C"/>
            <circle cx="14" cy="-4" r="0.8" fill="#1A202C"/>
            <path d="M8 -8 L12 -16 L16 -8" fill="#5D3A1A"/>
            <circle cx="12" cy="-12" r="2" fill="#CD7F32"/>
            <line x1="9" y1="0" x2="9" y2="2" stroke="#3D2817" strokeWidth="0.5"/>
            <line x1="15" y1="0" x2="15" y2="2" stroke="#3D2817" strokeWidth="0.5"/>
        </g>
    ),

    // African mask (ä)
    'ä': (
        <g>
            <ellipse cx="12" cy="22" rx="4" ry="1" fill="#000" opacity="0.15"/>
            <rect x="8" y="16" width="8" height="8" fill="#3D2817"/>
            <rect x="10" y="14" width="4" height="3" fill="#4A3728"/>
            <ellipse cx="12" cy="8" rx="5" ry="7" fill="#5D3A1A"/>
            <ellipse cx="12" cy="7" rx="4" ry="6" fill="#6B4423"/>
            <ellipse cx="9" cy="6" rx="2" ry="1.5" fill="#F5DEB3"/>
            <ellipse cx="15" cy="6" rx="2" ry="1.5" fill="#F5DEB3"/>
            <ellipse cx="9" cy="6" rx="1" ry="0.8" fill="#1A202C"/>
            <ellipse cx="15" cy="6" rx="1" ry="0.8" fill="#1A202C"/>
            <path d="M12 4 L12 10 M10 10 L14 10" stroke="#3D2817" strokeWidth="1" fill="none"/>
            <ellipse cx="12" cy="12" rx="2" ry="1" fill="#8B0000"/>
            <line x1="6" y1="6" x2="7" y2="8" stroke="#3D2817" strokeWidth="0.5"/>
            <line x1="18" y1="6" x2="17" y2="8" stroke="#3D2817" strokeWidth="0.5"/>
        </g>
    ),

    // Mesoamerican (ß) - TALL
    'ß': (
        <g>
            <ellipse cx="12" cy="22" rx="7" ry="2" fill="#000" opacity="0.2"/>
            <rect x="2" y="18" width="20" height="6" fill="#6B7280"/>
            <rect x="4" y="16" width="16" height="3" fill="#78716C"/>
            <rect x="6" y="14" width="12" height="3" fill="#9CA3AF"/>
            <rect x="8" y="4" width="8" height="10" fill="#6B7280"/>
            <path d="M4 4 L12 -12 L20 4 Z" fill="#16A34A"/>
            <path d="M6 2 L12 -8 L18 2 Z" fill="#22C55E"/>
            <path d="M8 0 Q6 -4 4 -8" stroke="#16A34A" strokeWidth="2" fill="none"/>
            <path d="M16 0 Q18 -4 20 -8" stroke="#16A34A" strokeWidth="2" fill="none"/>
            <path d="M10 -2 Q8 -8 6 -14" stroke="#22C55E" strokeWidth="1.5" fill="none"/>
            <path d="M14 -2 Q16 -8 18 -14" stroke="#22C55E" strokeWidth="1.5" fill="none"/>
            <rect x="9" y="0" width="6" height="5" fill="#4ADE80"/>
            <circle cx="10.5" cy="2" r="1" fill="#166534"/>
            <circle cx="13.5" cy="2" r="1" fill="#166534"/>
            <rect x="10" y="4" width="4" height="2" fill="#DC2626"/>
            <circle cx="6" cy="6" r="1.5" fill="#FFD700"/>
            <circle cx="18" cy="6" r="1.5" fill="#FFD700"/>
            <path d="M8 10 Q6 12 8 14 M16 10 Q18 12 16 14" stroke="#059669" strokeWidth="1" fill="none"/>
        </g>
    ),

    // Classical bust (æ)
    'æ': (
        <g>
            <ellipse cx="12" cy="22" rx="5" ry="1.5" fill="#000" opacity="0.15"/>
            <rect x="6" y="16" width="12" height="8" fill="#78716C"/>
            <rect x="5" y="14" width="14" height="3" fill="#A8A29E"/>
            <rect x="4" y="13" width="16" height="2" fill="#D6D3D1"/>
            <path d="M6 13 Q6 8 12 6 Q18 8 18 13 Z" fill="#E7E5E4"/>
            <circle cx="12" cy="4" r="4" fill="#E7E5E4"/>
            <circle cx="12" cy="3.5" r="3.5" fill="#D6D3D1"/>
            <ellipse cx="10.5" cy="3" rx="0.5" ry="0.3" fill="#A8A29E"/>
            <ellipse cx="13.5" cy="3" rx="0.5" ry="0.3" fill="#A8A29E"/>
            <path d="M12 2 L12 5" stroke="#A8A29E" strokeWidth="0.5"/>
            <path d="M10 6 Q12 7 14 6" stroke="#A8A29E" strokeWidth="0.5" fill="none"/>
            <path d="M8 2 Q7 0 8 -1 Q10 0 12 -1 Q14 0 16 -1 Q17 0 16 2" fill="#C4C1BD"/>
        </g>
    ),

    // Bronze allegorical figure (œ) - 2 tiles tall
    'œ': (
        <g>
            <ellipse cx="12" cy="22" rx="8" ry="2.5" fill="#000" opacity="0.2"/>
            <rect x="2" y="16" width="20" height="8" fill="#4A5568"/>
            <rect x="0" y="14" width="24" height="3" fill="#64748B"/>
            <ellipse cx="12" cy="6" rx="6" ry="10" fill="#6B5344"/>
            <ellipse cx="12" cy="4" rx="5" ry="8" fill="#7A6A4A"/>
            <circle cx="12" cy="-8" r="4" fill="#6B5344"/>
            <circle cx="12" cy="-9" r="3.5" fill="#7A6A4A"/>
            <ellipse cx="12" cy="-12" rx="4" ry="2" fill="#166534"/>
            <path d="M8 -12 Q10 -14 12 -12 Q14 -14 16 -12" fill="#22C55E"/>
            <path d="M17 2 Q22 -4 20 -12" stroke="#6B5344" strokeWidth="3" fill="none"/>
            <ellipse cx="20" cy="-14" rx="2" ry="3" fill="#F59E0B"/>
            <path d="M7 4 Q2 2 4 8" stroke="#6B5344" strokeWidth="3" fill="none"/>
            <rect x="2" y="6" width="4" height="6" fill="#4A5568"/>
            <path d="M6 10 Q12 8 18 10 L16 16 Q12 14 8 16 Z" fill="#5D4A3A"/>
            <ellipse cx="10" cy="2" rx="2" ry="3" fill="#7D8B6A" opacity="0.3"/>
        </g>
    ),

    // Monumental statue (Œ) - Very tall, 3 tiles
    'Œ': (
        <g>
            <ellipse cx="12" cy="22" rx="10" ry="3" fill="#000" opacity="0.25"/>
            <rect x="0" y="14" width="24" height="10" fill="#4A5568"/>
            <rect x="2" y="12" width="20" height="3" fill="#64748B"/>
            <rect x="4" y="10" width="16" height="3" fill="#78716C"/>
            <ellipse cx="12" cy="4" rx="7" ry="8" fill="#6B5344"/>
            <path d="M5 8 Q12 4 19 8 L18 14 Q12 12 6 14 Z" fill="#5D4A3A"/>
            <ellipse cx="12" cy="-8" rx="6" ry="10" fill="#7A6A4A"/>
            <path d="M6 -6 Q0 -12 2 -20" stroke="#6B5344" strokeWidth="4" fill="none"/>
            <path d="M18 -6 Q24 -12 22 -20" stroke="#6B5344" strokeWidth="4" fill="none"/>
            <circle cx="2" cy="-20" r="2" fill="#7A6A4A"/>
            <circle cx="22" cy="-20" r="2" fill="#7A6A4A"/>
            <circle cx="12" cy="-24" r="5" fill="#6B5344"/>
            <circle cx="12" cy="-25" r="4.5" fill="#7A6A4A"/>
            <path d="M7 -28 L12 -36 L17 -28" fill="#4A5568"/>
            <circle cx="12" cy="-32" r="2" fill="#FFD700"/>
            <ellipse cx="10" cy="-26" rx="0.8" ry="0.4" fill="#5D4A3A"/>
            <ellipse cx="14" cy="-26" rx="0.8" ry="0.4" fill="#5D4A3A"/>
            <path d="M10 -23 Q12 -22 14 -23" stroke="#5D4A3A" strokeWidth="0.5" fill="none"/>
        </g>
    ),

    // Equestrian statue (Æ) - Horse and rider, 2 tiles tall
    'Æ': (
        <g>
            <ellipse cx="12" cy="22" rx="10" ry="3" fill="#000" opacity="0.2"/>
            <rect x="0" y="16" width="24" height="8" fill="#4A5568"/>
            <rect x="2" y="14" width="20" height="3" fill="#64748B"/>
            <ellipse cx="12" cy="8" rx="9" ry="6" fill="#6B5344"/>
            <rect x="4" y="10" width="2" height="6" fill="#5D4A3A"/>
            <rect x="8" y="12" width="2" height="4" fill="#5D4A3A"/>
            <rect x="14" y="12" width="2" height="4" fill="#5D4A3A"/>
            <rect x="18" y="10" width="2" height="6" fill="#5D4A3A"/>
            <path d="M18 4 Q20 -4 18 -10" stroke="#6B5344" strokeWidth="6" fill="none"/>
            <ellipse cx="17" cy="-12" rx="3" ry="4" fill="#6B5344"/>
            <ellipse cx="15" cy="-14" rx="2" ry="2" fill="#7A6A4A"/>
            <circle cx="16" cy="-13" r="0.8" fill="#1A202C"/>
            <path d="M18 -8 Q20 -6 18 -4 Q16 -6 18 -8" fill="#5D4A3A"/>
            <ellipse cx="12" cy="-2" rx="4" ry="6" fill="#4A5568"/>
            <circle cx="12" cy="-10" r="3" fill="#7A6A4A"/>
            <path d="M9 -12 L12 -16 L15 -12" fill="#4A5568"/>
            <path d="M14 -4 Q18 -8 16 -14" stroke="#7A6A4A" strokeWidth="2" fill="none"/>
            <rect x="15" y="-20" width="1" height="8" fill="#94A3B8"/>
        </g>
    ),

    // Small decorative figurine (µ)
    'µ': (
        <g>
            <ellipse cx="12" cy="22" rx="4" ry="1" fill="#000" opacity="0.1"/>
            <rect x="8" y="18" width="8" height="6" fill="#4A3728"/>
            <rect x="7" y="16" width="10" height="3" fill="#5D4037"/>
            <ellipse cx="12" cy="12" rx="3" ry="5" fill="#F5F5DC"/>
            <circle cx="12" cy="6" r="2.5" fill="#F5F5DC"/>
            <circle cx="11" cy="5.5" r="0.4" fill="#1A202C"/>
            <circle cx="13" cy="5.5" r="0.4" fill="#1A202C"/>
            <path d="M11 7 Q12 7.5 13 7" stroke="#D4A574" strokeWidth="0.3" fill="none"/>
            <path d="M14 10 Q16 8 15 6" stroke="#F5F5DC" strokeWidth="1.5" fill="none"/>
            <ellipse cx="12" cy="16" rx="3" ry="1" fill="#E7E5E4"/>
        </g>
    ),
};
