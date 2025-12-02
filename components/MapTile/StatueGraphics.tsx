import React from 'react';

// Statue variants by cultural style - realistic 1889 World's Fair aesthetics

export const STATUE_GRAPHICS: Record<string, JSX.Element> = {
    // Default Western/Classical marble bust on pedestal (u)
    STATUE: (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="7" ry="2" fill="#000" opacity="0.2"/>

            {/* Ornate pedestal base */}
            <rect x="3" y="18" width="18" height="6" fill="#6B6159"/>
            <rect x="4" y="17" width="16" height="2" fill="#7A7068"/>
            <rect x="5" y="16" width="14" height="2" fill="#8B8178"/>
            {/* Pedestal decorative molding */}
            <path d="M4 20 L20 20" stroke="#5C554D" strokeWidth="0.5"/>
            <path d="M5 18 Q12 17 19 18" stroke="#9A938A" strokeWidth="0.5"/>

            {/* Classical draped torso */}
            <path d="M7 16 Q6 12 8 8 L16 8 Q18 12 17 16 Z" fill="#E8E4DE"/>
            <path d="M8 16 Q7 12 9 8" stroke="#D0CAC2" strokeWidth="0.8" fill="none"/>
            <path d="M16 16 Q17 12 15 8" stroke="#D0CAC2" strokeWidth="0.8" fill="none"/>
            {/* Toga draping detail */}
            <path d="M9 10 Q12 12 15 10" stroke="#C8C2BA" strokeWidth="0.6" fill="none"/>
            <path d="M8 14 Q12 13 16 14" stroke="#C8C2BA" strokeWidth="0.6" fill="none"/>

            {/* Neck */}
            <rect x="10" y="5" width="4" height="4" fill="#E8E4DE"/>

            {/* Classical head shape */}
            <ellipse cx="12" cy="2" rx="4" ry="4.5" fill="#E8E4DE"/>
            <ellipse cx="12" cy="1.5" rx="3.5" ry="4" fill="#DCD6CE"/>

            {/* Classical hairstyle - curled Roman style */}
            <path d="M8 0 Q7 -2 9 -3 Q11 -2 12 -3 Q13 -2 15 -3 Q17 -2 16 0" fill="#C8C2BA"/>
            <path d="M8.5 -1 Q8 -2.5 9.5 -2.5" stroke="#B8B2AA" strokeWidth="0.4" fill="none"/>
            <path d="M11 -2 Q11 -3 12 -3" stroke="#B8B2AA" strokeWidth="0.4" fill="none"/>
            <path d="M14 -2 Q14 -3 15 -2.5" stroke="#B8B2AA" strokeWidth="0.4" fill="none"/>

            {/* Eyes - deep set classical style, not cartoon */}
            <ellipse cx="10" cy="1" rx="1.2" ry="0.6" fill="#D0CAC2"/>
            <ellipse cx="14" cy="1" rx="1.2" ry="0.6" fill="#D0CAC2"/>
            <ellipse cx="10" cy="1" rx="0.6" ry="0.3" fill="#9A938A"/>
            <ellipse cx="14" cy="1" rx="0.6" ry="0.3" fill="#9A938A"/>

            {/* Defined nose - straight classical */}
            <path d="M12 0 L12 3" stroke="#C8C2BA" strokeWidth="0.6"/>
            <path d="M11 3.5 Q12 4 13 3.5" stroke="#C8C2BA" strokeWidth="0.5" fill="none"/>

            {/* Lips - classical proportions */}
            <path d="M10.5 5 Q12 5.5 13.5 5" stroke="#C0BAB2" strokeWidth="0.5" fill="none"/>

            {/* Subtle cheekbone shading */}
            <ellipse cx="9" cy="2.5" rx="1" ry="0.6" fill="#D0CAC2" opacity="0.4"/>
            <ellipse cx="15" cy="2.5" rx="1" ry="0.6" fill="#D0CAC2" opacity="0.4"/>
        </g>
    ),

    // Asian Buddha/deity (Ü) - TALL, gilded bronze aesthetic
    STATUE_ASIAN_TALL: (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="8" ry="2" fill="#000" opacity="0.2"/>

            {/* Ornate lotus throne base */}
            <ellipse cx="12" cy="20" rx="10" ry="3.5" fill="#8B6914"/>
            <ellipse cx="12" cy="18" rx="9" ry="2.5" fill="#C9A227"/>
            {/* Lotus petals */}
            <path d="M3 18 Q4 15 7 17 Q9 14 12 17 Q15 14 17 17 Q20 15 21 18" fill="#DAA520" stroke="#8B6914" strokeWidth="0.3"/>

            {/* Seated body - meditation pose */}
            <ellipse cx="12" cy="12" rx="7" ry="6" fill="#C9A227"/>
            <ellipse cx="12" cy="11" rx="6" ry="5" fill="#DAA520"/>
            {/* Crossed legs suggestion */}
            <path d="M6 14 Q12 16 18 14" stroke="#8B6914" strokeWidth="0.5" fill="none"/>
            {/* Robe draping */}
            <path d="M6 10 Q8 13 12 12 Q16 13 18 10" stroke="#B8860B" strokeWidth="0.6" fill="none"/>
            <path d="M8 8 Q12 10 16 8" stroke="#B8860B" strokeWidth="0.4" fill="none"/>

            {/* Hands in meditation mudra */}
            <ellipse cx="12" cy="13" rx="3" ry="1.5" fill="#DAA520"/>
            <ellipse cx="12" cy="13" rx="2" ry="1" fill="#C9A227"/>

            {/* Serene face */}
            <circle cx="12" cy="2" r="4.5" fill="#DAA520"/>
            <circle cx="12" cy="1.5" r="4" fill="#E6C84B"/>

            {/* Downcast eyes - meditation */}
            <path d="M9.5 1 Q10 1.5 10.5 1" stroke="#8B6914" strokeWidth="0.5" fill="none"/>
            <path d="M13.5 1 Q14 1.5 14.5 1" stroke="#8B6914" strokeWidth="0.5" fill="none"/>

            {/* Subtle nose and serene smile */}
            <path d="M12 0.5 L12 2.5" stroke="#B8860B" strokeWidth="0.4"/>
            <path d="M10 3 Q12 4 14 3" stroke="#B8860B" strokeWidth="0.4" fill="none"/>

            {/* Ushnisha (wisdom bump) */}
            <ellipse cx="12" cy="-3" rx="2" ry="2.5" fill="#DAA520"/>
            <circle cx="12" cy="-5" r="1" fill="#C9A227"/>

            {/* Elongated earlobes */}
            <path d="M7.5 2 Q7 4 8 5" stroke="#DAA520" strokeWidth="1" fill="none"/>
            <path d="M16.5 2 Q17 4 16 5" stroke="#DAA520" strokeWidth="1" fill="none"/>

            {/* Halo/aureole */}
            <circle cx="12" cy="0" r="7" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.4"/>
        </g>
    ),

    // Asian small figure (ü) - Bodhisattva or Kannon figure
    STATUE_ASIAN_SMALL: (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="5" ry="1.5" fill="#000" opacity="0.15"/>

            {/* Wooden pedestal */}
            <rect x="6" y="18" width="12" height="6" fill="#5D4037"/>
            <rect x="7" y="17" width="10" height="2" fill="#6D4C41"/>
            <path d="M7 20 L17 20" stroke="#4E342E" strokeWidth="0.3"/>

            {/* Standing figure - elegant pose */}
            <path d="M9 17 Q8 12 9 8 L15 8 Q16 12 15 17 Z" fill="#C9A227"/>
            {/* Robe details */}
            <path d="M9 12 Q12 14 15 12" stroke="#8B6914" strokeWidth="0.4" fill="none"/>
            <path d="M10 15 Q12 16 14 15" stroke="#8B6914" strokeWidth="0.3" fill="none"/>

            {/* Graceful neck */}
            <rect x="11" y="6" width="2" height="3" fill="#DAA520"/>

            {/* Refined face */}
            <ellipse cx="12" cy="4" rx="3" ry="3.5" fill="#DAA520"/>
            <ellipse cx="12" cy="3.5" rx="2.5" ry="3" fill="#E6C84B"/>

            {/* Downcast meditative eyes */}
            <path d="M10 3 Q10.5 3.3 11 3" stroke="#8B6914" strokeWidth="0.3" fill="none"/>
            <path d="M13 3 Q13.5 3.3 14 3" stroke="#8B6914" strokeWidth="0.3" fill="none"/>

            {/* Subtle features */}
            <path d="M12 2.5 L12 4.5" stroke="#B8860B" strokeWidth="0.3"/>
            <path d="M11 5.5 Q12 6 13 5.5" stroke="#B8860B" strokeWidth="0.3" fill="none"/>

            {/* Elaborate headdress */}
            <ellipse cx="12" cy="0" rx="2.5" ry="1.5" fill="#C9A227"/>
            <circle cx="12" cy="-1" r="0.8" fill="#FFD700"/>
        </g>
    ),

    // Egyptian Pharaoh (Ö) - TALL
    STATUE_EGYPTIAN_TALL: (
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
    STATUE_EGYPTIAN_BUST: (
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

    // African carved figure (Ä) - TALL, ceremonial ancestor figure
    STATUE_AFRICAN_TALL: (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="5" ry="2" fill="#000" opacity="0.2"/>

            {/* Carved wooden base - circular with decorative pattern */}
            <ellipse cx="12" cy="20" rx="6" ry="2.5" fill="#3D2817"/>
            <ellipse cx="12" cy="19" rx="5" ry="2" fill="#4E3524"/>
            {/* Geometric carving pattern on base */}
            <path d="M7 20 L9 19 L11 20 L13 19 L15 20 L17 19" stroke="#2A1A0F" strokeWidth="0.4" fill="none"/>

            {/* Standing figure body - stylized proportions */}
            <path d="M9 19 Q8 14 9 8 L15 8 Q16 14 15 19 Z" fill="#5D3A1A"/>
            <path d="M10 19 Q9 14 10 8 L14 8 Q15 14 14 19 Z" fill="#6B4423"/>

            {/* Ritual scarification patterns */}
            <path d="M10.5 12 L13.5 12" stroke="#3D2817" strokeWidth="0.4"/>
            <path d="M10.5 15 L13.5 15" stroke="#3D2817" strokeWidth="0.4"/>
            <path d="M11 10 L11 17" stroke="#3D2817" strokeWidth="0.3"/>
            <path d="M13 10 L13 17" stroke="#3D2817" strokeWidth="0.3"/>

            {/* Arms at sides - holding ritual objects */}
            <rect x="6" y="10" width="3" height="7" fill="#5D3A1A"/>
            <rect x="15" y="10" width="3" height="7" fill="#5D3A1A"/>
            {/* Hands/ritual objects */}
            <ellipse cx="7" cy="17" rx="1" ry="1.5" fill="#4E3524"/>
            <ellipse cx="17" cy="17" rx="1" ry="1.5" fill="#4E3524"/>

            {/* Elongated neck with rings */}
            <rect x="10" y="4" width="4" height="4" fill="#6B4423"/>
            <path d="M10 5 L14 5" stroke="#CD7F32" strokeWidth="0.4"/>
            <path d="M10 6.5 L14 6.5" stroke="#CD7F32" strokeWidth="0.4"/>

            {/* Stylized head - elongated African carving style */}
            <ellipse cx="12" cy="0" rx="3.5" ry="4" fill="#5D3A1A"/>
            <ellipse cx="12" cy="-0.5" rx="3" ry="3.5" fill="#6B4423"/>

            {/* Stylized eyes - almond shaped, inlaid */}
            <ellipse cx="10.5" cy="-1" rx="1.2" ry="0.6" fill="#F5DEB3"/>
            <ellipse cx="13.5" cy="-1" rx="1.2" ry="0.6" fill="#F5DEB3"/>
            <ellipse cx="10.5" cy="-1" rx="0.5" ry="0.4" fill="#2A1A0F"/>
            <ellipse cx="13.5" cy="-1" rx="0.5" ry="0.4" fill="#2A1A0F"/>

            {/* Prominent nose */}
            <path d="M12 -1.5 L12 1" stroke="#4E3524" strokeWidth="0.6"/>
            <ellipse cx="12" cy="1" rx="1" ry="0.5" fill="#5D3A1A"/>

            {/* Stylized mouth */}
            <ellipse cx="12" cy="2.5" rx="1.5" ry="0.6" fill="#8B0000" opacity="0.6"/>

            {/* Elaborate headdress/coiffure */}
            <path d="M8 -4 Q9 -8 12 -8 Q15 -8 16 -4" fill="#3D2817"/>
            <ellipse cx="12" cy="-6" rx="2" ry="1.5" fill="#4E3524"/>
            {/* Decorative crest */}
            <path d="M10 -7 L12 -10 L14 -7" fill="#5D3A1A"/>
            <circle cx="12" cy="-8" r="1" fill="#CD7F32"/>
        </g>
    ),

    // African mask (ä) - Ceremonial mask on display stand
    STATUE_AFRICAN_MASK: (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="4" ry="1" fill="#000" opacity="0.15"/>

            {/* Display stand - museum style */}
            <rect x="8" y="17" width="8" height="7" fill="#2A1A0F"/>
            <rect x="9" y="16" width="6" height="2" fill="#3D2817"/>
            {/* Stand pole */}
            <rect x="11" y="12" width="2" height="5" fill="#4A3728"/>

            {/* Mask form - elongated oval */}
            <ellipse cx="12" cy="6" rx="5" ry="7" fill="#5D3A1A"/>
            <ellipse cx="12" cy="5.5" rx="4.5" ry="6.5" fill="#6B4423"/>

            {/* Stylized eye sockets - geometric */}
            <ellipse cx="9.5" cy="4" rx="1.8" ry="1.2" fill="#3D2817"/>
            <ellipse cx="14.5" cy="4" rx="1.8" ry="1.2" fill="#3D2817"/>
            {/* Inlaid cowrie shell eyes */}
            <ellipse cx="9.5" cy="4" rx="1" ry="0.7" fill="#F5DEB3"/>
            <ellipse cx="14.5" cy="4" rx="1" ry="0.7" fill="#F5DEB3"/>
            <circle cx="9.5" cy="4" r="0.3" fill="#1A202C"/>
            <circle cx="14.5" cy="4" r="0.3" fill="#1A202C"/>

            {/* Nose ridge - prominent geometric */}
            <path d="M12 2 L12 8" stroke="#4E3524" strokeWidth="1.2"/>
            <path d="M10.5 7.5 Q12 8.5 13.5 7.5" stroke="#4E3524" strokeWidth="0.5" fill="none"/>

            {/* Mouth area - carved opening */}
            <ellipse cx="12" cy="10" rx="2.5" ry="1.2" fill="#2A1A0F"/>
            {/* Teeth detail */}
            <path d="M10 10 L14 10" stroke="#F5DEB3" strokeWidth="0.3"/>

            {/* Scarification marks */}
            <path d="M7 4 L8 6" stroke="#3D2817" strokeWidth="0.4"/>
            <path d="M17 4 L16 6" stroke="#3D2817" strokeWidth="0.4"/>
            <path d="M8.5 8 L8 10" stroke="#3D2817" strokeWidth="0.3"/>
            <path d="M15.5 8 L16 10" stroke="#3D2817" strokeWidth="0.3"/>

            {/* Forehead decorations */}
            <path d="M9 0 L12 -2 L15 0" stroke="#CD7F32" strokeWidth="0.5" fill="none"/>
            <circle cx="12" cy="-1" r="0.6" fill="#CD7F32"/>
        </g>
    ),

    // Mesoamerican (ß) - TALL
    STATUE_MESOAMERICAN: (
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

    // Classical bust (æ) - Greek/Roman style marble bust
    STATUE_BUST: (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="5" ry="1.5" fill="#000" opacity="0.15"/>

            {/* Elegant socle (display stand) */}
            <rect x="6" y="18" width="12" height="6" fill="#5C554D"/>
            <rect x="7" y="17" width="10" height="2" fill="#6B6159"/>
            <rect x="5" y="16" width="14" height="2" fill="#7A7068"/>
            <path d="M6 19 L18 19" stroke="#4A453F" strokeWidth="0.4"/>

            {/* Draped bust shoulders */}
            <path d="M6 16 Q6 12 9 10 L15 10 Q18 12 18 16 Z" fill="#E8E4DE"/>
            <path d="M7 16 Q7 13 10 11" stroke="#D0CAC2" strokeWidth="0.6" fill="none"/>
            <path d="M17 16 Q17 13 14 11" stroke="#D0CAC2" strokeWidth="0.6" fill="none"/>

            {/* Neck */}
            <rect x="10" y="7" width="4" height="4" fill="#E8E4DE"/>

            {/* Classical head - idealized Roman portrait */}
            <ellipse cx="12" cy="4" rx="4" ry="4.5" fill="#E8E4DE"/>
            <ellipse cx="12" cy="3.5" rx="3.5" ry="4" fill="#DCD6CE"/>

            {/* Realistic eyes - deep set */}
            <ellipse cx="10" cy="3" rx="1" ry="0.5" fill="#C8C2BA"/>
            <ellipse cx="14" cy="3" rx="1" ry="0.5" fill="#C8C2BA"/>
            <circle cx="10" cy="3" r="0.3" fill="#8B8178"/>
            <circle cx="14" cy="3" r="0.3" fill="#8B8178"/>

            {/* Strong brow */}
            <path d="M8.5 2 L11.5 2" stroke="#C8C2BA" strokeWidth="0.6"/>
            <path d="M12.5 2 L15.5 2" stroke="#C8C2BA" strokeWidth="0.6"/>

            {/* Classical nose - straight, refined */}
            <path d="M12 2 L12 5" stroke="#C8C2BA" strokeWidth="0.5"/>
            <path d="M11 5.5 Q12 6 13 5.5" stroke="#C8C2BA" strokeWidth="0.4" fill="none"/>

            {/* Subtle mouth */}
            <path d="M10.5 6.5 Q12 7 13.5 6.5" stroke="#C0BAB2" strokeWidth="0.4" fill="none"/>

            {/* Curled Roman hairstyle */}
            <path d="M8 1 Q7 -1 9 -1.5 Q10 -0.5 11 -1.5 Q12 -0.5 13 -1.5 Q14 -0.5 15 -1.5 Q17 -1 16 1" fill="#B8B2AA"/>
            <path d="M8.5 0 Q8 -0.8 9.5 -1" stroke="#A8A29E" strokeWidth="0.3" fill="none"/>
            <path d="M12 -0.5 Q12 -1.2 13 -1" stroke="#A8A29E" strokeWidth="0.3" fill="none"/>
        </g>
    ),

    // Bronze allegorical figure (œ) - 2 tiles tall
    STATUE_ALLEGORICAL: (
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
    STATUE_MONUMENTAL: (
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
    CULTURAL_ARTIFACT: (
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

    // Small decorative figurine (µ) - Porcelain or ivory statuette
    SCIENTIFIC_INSTRUMENT: (
        <g>
            {/* Shadow */}
            <ellipse cx="12" cy="23" rx="4" ry="1" fill="#000" opacity="0.1"/>

            {/* Ornate display pedestal */}
            <rect x="8" y="18" width="8" height="6" fill="#3E2723"/>
            <rect x="7" y="17" width="10" height="2" fill="#4E342E"/>
            <rect x="9" y="16" width="6" height="2" fill="#5D4037"/>
            {/* Gilded trim */}
            <path d="M8 19 L16 19" stroke="#B8860B" strokeWidth="0.3"/>

            {/* Elegant female figure - classical pose */}
            <path d="M10 16 Q9 12 10 9 L14 9 Q15 12 14 16 Z" fill="#F5F0E6"/>
            {/* Draped gown details */}
            <path d="M10 11 Q12 12 14 11" stroke="#E8E0D4" strokeWidth="0.4" fill="none"/>
            <path d="M10.5 14 Q12 15 13.5 14" stroke="#E8E0D4" strokeWidth="0.3" fill="none"/>

            {/* Graceful neck */}
            <rect x="11" y="7" width="2" height="3" fill="#F5F0E6"/>

            {/* Refined porcelain face */}
            <ellipse cx="12" cy="5" rx="2.5" ry="3" fill="#F5F0E6"/>
            <ellipse cx="12" cy="4.5" rx="2" ry="2.5" fill="#FAF8F5"/>

            {/* Delicate eyes - not cartoon circles */}
            <path d="M10.5 4 Q11 4.3 11.5 4" stroke="#8B7355" strokeWidth="0.3" fill="none"/>
            <path d="M12.5 4 Q13 4.3 13.5 4" stroke="#8B7355" strokeWidth="0.3" fill="none"/>

            {/* Refined features */}
            <path d="M12 3.5 L12 5" stroke="#E0D6CA" strokeWidth="0.25"/>
            <path d="M11 5.8 Q12 6.2 13 5.8" stroke="#DBC8B8" strokeWidth="0.25" fill="none"/>

            {/* Elegant upswept hair */}
            <path d="M9.5 3 Q10 1 12 1 Q14 1 14.5 3" fill="#8B7355"/>
            <ellipse cx="12" cy="1" rx="1.5" ry="1" fill="#6B5344"/>

            {/* Graceful raised arm */}
            <path d="M14 9 Q15.5 7 15 5.5" stroke="#F5F0E6" strokeWidth="1" fill="none"/>
            <circle cx="15" cy="5" r="0.6" fill="#FAF8F5"/>
        </g>
    ),
};
