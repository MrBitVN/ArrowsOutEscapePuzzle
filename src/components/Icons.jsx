import React from 'react';

// Common 3D & stylized SVG icons matching screenshot aesthetics

export const BackIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const GearIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
  </svg>
);

export const CrownIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
    <path d="M5 19h14a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1zm-1-7l3.5-2L12 14l4.5-4L20 12l-2-7-6 4-6-4-2 7z" />
  </svg>
);

export const WingBadgeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 14.1l-4.8 2.5.9-5.3-3.8-3.7 5.3-.8L12 2z"/>
    <path d="M2 13c1.5 2 4 3 7 2.5L7 20C3 18 2 15 2 13z" opacity="0.8"/>
    <path d="M22 13c-1.5 2-4 3-7 2.5l2 4.5c4-2 5-5 5-7z" opacity="0.8"/>
  </svg>
);

export const HeartIcon = ({ filled = true }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? '#EF4444' : '#D1D5DB'} stroke={filled ? '#DC2626' : '#9CA3AF'} strokeWidth="1.5">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

// Flag SVGs for Language Screen
export const FlagIcon = ({ type }) => {
  switch (type) {
    case 'gb': // UK
      return (
        <svg viewBox="0 0 60 60" className="flag-svg">
          <circle cx="30" cy="30" r="30" fill="#012169" />
          <path d="M0 0 L60 60 M60 0 L0 60" stroke="#fff" strokeWidth="12" />
          <path d="M0 0 L60 60 M60 0 L0 60" stroke="#C8102E" strokeWidth="6" />
          <path d="M30 0 v60 M0 30 h60" stroke="#fff" strokeWidth="18" />
          <path d="M30 0 v60 M0 30 h60" stroke="#C8102E" strokeWidth="10" />
        </svg>
      );
    case 'vn': // Vietnam
      return (
        <svg viewBox="0 0 60 60" className="flag-svg">
          <circle cx="30" cy="30" r="30" fill="#DA251D" />
          <polygon points="30,12 34,24 47,24 36,32 40,44 30,36 20,44 24,32 13,24 26,24" fill="#FFFF00" />
        </svg>
      );
    case 'fr': // France
      return (
        <svg viewBox="0 0 60 60" className="flag-svg">
          <clipPath id="circle-clip-fr"><circle cx="30" cy="30" r="30"/></clipPath>
          <g clipPath="url(#circle-clip-fr)">
            <rect x="0" y="0" width="20" height="60" fill="#002395" />
            <rect x="20" y="0" width="20" height="60" fill="#FFFFFF" />
            <rect x="40" y="0" width="20" height="60" fill="#ED2939" />
          </g>
        </svg>
      );
    case 'es': // Spain
      return (
        <svg viewBox="0 0 60 60" className="flag-svg">
          <clipPath id="circle-clip-es"><circle cx="30" cy="30" r="30"/></clipPath>
          <g clipPath="url(#circle-clip-es)">
            <rect x="0" y="0" width="60" height="15" fill="#AA151B" />
            <rect x="0" y="15" width="60" height="30" fill="#F1BF00" />
            <rect x="0" y="45" width="60" height="15" fill="#AA151B" />
          </g>
        </svg>
      );
    case 'de': // Germany
      return (
        <svg viewBox="0 0 60 60" className="flag-svg">
          <clipPath id="circle-clip-de"><circle cx="30" cy="30" r="30"/></clipPath>
          <g clipPath="url(#circle-clip-de)">
            <rect x="0" y="0" width="60" height="20" fill="#000000" />
            <rect x="0" y="20" width="60" height="20" fill="#DD0000" />
            <rect x="0" y="40" width="60" height="20" fill="#FFCE00" />
          </g>
        </svg>
      );
    case 'kr': // Korea
      return (
        <svg viewBox="0 0 60 60" className="flag-svg">
          <circle cx="30" cy="30" r="30" fill="#FFFFFF" stroke="#e2e8f0" strokeWidth="1" />
          <path d="M 16,30 A 14,14 0 0,0 44,30 A 7,7 0 0,0 30,30 A 7,7 0 0,1 16,30" fill="#CD2E3A" />
          <path d="M 16,30 A 14,14 0 0,1 44,30 A 7,7 0 0,1 30,30 A 7,7 0 0,0 16,30" fill="#0047A0" />
        </svg>
      );
    case 'it': // Italy
      return (
        <svg viewBox="0 0 60 60" className="flag-svg">
          <clipPath id="circle-clip-it"><circle cx="30" cy="30" r="30"/></clipPath>
          <g clipPath="url(#circle-clip-it)">
            <rect x="0" y="0" width="20" height="60" fill="#009246" />
            <rect x="20" y="0" width="20" height="60" fill="#FFFFFF" />
            <rect x="40" y="0" width="20" height="60" fill="#CE2B37" />
          </g>
        </svg>
      );
    case 'id': // Indonesia
      return (
        <svg viewBox="0 0 60 60" className="flag-svg">
          <clipPath id="circle-clip-id"><circle cx="30" cy="30" r="30"/></clipPath>
          <g clipPath="url(#circle-clip-id)">
            <rect x="0" y="0" width="60" height="30" fill="#FF0000" />
            <rect x="0" y="30" width="60" height="30" fill="#FFFFFF" />
          </g>
        </svg>
      );
    case 'in': // India
      return (
        <svg viewBox="0 0 60 60" className="flag-svg">
          <clipPath id="circle-clip-in"><circle cx="30" cy="30" r="30"/></clipPath>
          <g clipPath="url(#circle-clip-in)">
            <rect x="0" y="0" width="60" height="20" fill="#FF9933" />
            <rect x="0" y="20" width="60" height="20" fill="#FFFFFF" />
            <rect x="0" y="40" width="60" height="20" fill="#138808" />
            <circle cx="30" cy="30" r="6" fill="none" stroke="#000080" strokeWidth="1.5" />
          </g>
        </svg>
      );
    case 'jp': // Japan
      return (
        <svg viewBox="0 0 60 60" className="flag-svg">
          <circle cx="30" cy="30" r="30" fill="#FFFFFF" stroke="#e2e8f0" strokeWidth="1" />
          <circle cx="30" cy="30" r="13" fill="#BC002D" />
        </svg>
      );
    default:
      return null;
  }
};

// 3D Joystick Illustration for "Game" Button (Screenshot 2)
export const Joystick3DIcon = () => (
  <svg viewBox="0 0 140 120" className="menu-card-3d-art">
    <defs>
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFA6B0" />
        <stop offset="100%" stopColor="#E57385" />
      </linearGradient>
      <linearGradient id="sideGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#963548" />
        <stop offset="100%" stopColor="#6E1C2C" />
      </linearGradient>
      <linearGradient id="ballGrad" x1="20%" y1="20%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D5F3FE" />
        <stop offset="50%" stopColor="#6BCBEE" />
        <stop offset="100%" stopColor="#2588AC" />
      </linearGradient>
    </defs>
    {/* Cable */}
    <path d="M 65 35 Q 75 10 100 18 Q 120 25 130 15" fill="none" stroke="#482531" strokeWidth="5" strokeLinecap="round" />
    
    {/* Console base 3D shadow */}
    <rect x="20" y="52" width="75" height="42" rx="14" fill="url(#sideGrad)" />
    
    {/* Console base top plate */}
    <rect x="20" y="42" width="75" height="38" rx="14" fill="url(#bodyGrad)" stroke="#FFAAB2" strokeWidth="1.5" />

    {/* Buttons */}
    <ellipse cx="68" cy="62" rx="7" ry="5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
    <ellipse cx="82" cy="54" rx="6" ry="4" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />

    {/* Joystick stick */}
    <path d="M 40 50 L 33 28 L 38 27 L 45 49 Z" fill="#4B5563" />
    <ellipse cx="42" cy="51" rx="8" ry="4" fill="#374151" />

    {/* Joystick ball top */}
    <circle cx="34" cy="24" r="11" fill="url(#ballGrad)" />
    <ellipse cx="31" cy="20" rx="3.5" ry="2" fill="#FFFFFF" opacity="0.8" />
  </svg>
);

// 3D Trophy Illustration for "Challenge" Button (Screenshot 2)
export const Trophy3DIcon = () => (
  <svg viewBox="0 0 140 120" className="menu-card-3d-art">
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF280" />
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="goldDark" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
    </defs>
    {/* Trophy Handles */}
    <path d="M 48 42 C 34 42 34 68 48 70" fill="none" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
    <path d="M 88 42 C 102 42 102 68 88 70" fill="none" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />

    {/* Trophy Base */}
    <path d="M 52 82 L 84 82 L 88 94 L 48 94 Z" fill="url(#goldDark)" />
    <rect x="44" y="94" width="48" height="10" rx="3" fill="#B45309" />

    {/* Trophy Cup */}
    <path d="M 46 36 L 90 36 C 90 62 82 78 68 82 C 54 78 46 62 46 36 Z" fill="url(#goldGrad)" stroke="#FDE68A" strokeWidth="1.5" />

    {/* Star on Cup */}
    <polygon points="68,48 71,55 78,55 72,59 74,67 68,62 62,67 64,59 58,55 65,55" fill="#FFFFFF" />

    {/* Lightning Sparkle */}
    <path d="M 108 45 L 122 55 L 115 58 L 126 72 L 108 58 L 115 56 Z" fill="#FACC15" stroke="#EAB308" strokeWidth="1" />
  </svg>
);

// 3D Calendar Illustration for "Daily" Button (Screenshot 2)
export const Calendar3DIcon = () => (
  <svg viewBox="0 0 140 120" className="menu-card-3d-art">
    <defs>
      <linearGradient id="calGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#DDE1FE" />
      </linearGradient>
      <linearGradient id="purpGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#9CA3FF" />
        <stop offset="100%" stopColor="#6C72E8" />
      </linearGradient>
    </defs>
    {/* Bell */}
    <path d="M 38 25 C 38 18 46 16 50 20 C 54 24 55 35 34 38 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
    <circle cx="34" cy="38" r="4" fill="#F59E0B" />

    {/* Back Page Shadow */}
    <rect x="46" y="32" width="62" height="66" rx="14" fill="#4338CA" opacity="0.4" />

    {/* Calendar Page */}
    <rect x="42" y="26" width="62" height="66" rx="14" fill="url(#calGrad)" stroke="#B0B9FF" strokeWidth="2" />
    
    {/* Spiral Rings */}
    <circle cx="54" cy="24" r="3.5" fill="#F43F5E" />
    <circle cx="73" cy="24" r="3.5" fill="#F43F5E" />
    <circle cx="92" cy="24" r="3.5" fill="#F43F5E" />

    {/* "25" Text */}
    <text x="73" y="68" fill="#5F669B" fontSize="28" fontWeight="800" textAnchor="middle" fontFamily="Outfit, Fredoka, sans-serif">25</text>

    {/* Checkmark bubble */}
    <circle cx="98" cy="74" r="10" fill="#6366F1" />
    <path d="M 94 74 L 97 77 L 102 71" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 4 Power-Up Booster Tool Icons matching Screenshot 5
export const LightbulbIcon = () => (
  <svg viewBox="0 0 50 50" className="booster-svg">
    <defs>
      <radialGradient id="bulbGlow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="40%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#EAB308" />
      </radialGradient>
      <linearGradient id="baseMetal" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#D1D5DB" />
        <stop offset="50%" stopColor="#F3F4F6" />
        <stop offset="100%" stopColor="#9CA3AF" />
      </linearGradient>
    </defs>
    {/* Glow bulb */}
    <circle cx="25" cy="22" r="14" fill="url(#bulbGlow)" />
    <path d="M 18 27 L 19 33 L 31 33 L 32 27 Z" fill="#EAB308" />
    {/* Screw base */}
    <rect x="20" y="33" width="10" height="3" rx="1.5" fill="url(#baseMetal)" />
    <rect x="21" y="37" width="8" height="3" rx="1.5" fill="url(#baseMetal)" />
    <ellipse cx="25" cy="41" rx="3" ry="1.5" fill="#4B5563" />
    {/* Highlight shine */}
    <ellipse cx="21" cy="17" rx="4" ry="2.5" fill="#FFFFFF" opacity="0.8" transform="rotate(-30 21 17)" />
  </svg>
);

export const EraserIcon = () => (
  <svg viewBox="0 0 50 50" className="booster-svg">
    {/* 3D Eraser block tilted */}
    <g transform="rotate(25 25 25)">
      {/* Blue rubber half */}
      <rect x="15" y="14" width="20" height="12" rx="2" fill="#2563EB" />
      <rect x="15" y="14" width="20" height="3" fill="#60A5FA" />
      {/* White/grey eraser base */}
      <rect x="15" y="26" width="20" height="14" rx="2" fill="#E5E7EB" />
      <rect x="15" y="26" width="20" height="2" fill="#93C5FD" />
      <rect x="15" y="37" width="20" height="3" rx="1" fill="#D1D5DB" />
    </g>
  </svg>
);

export const MagicWandIcon = () => (
  <svg viewBox="0 0 50 50" className="booster-svg">
    {/* Wand stick */}
    <line x1="12" y1="38" x2="30" y2="20" stroke="#1F2937" strokeWidth="4.5" strokeLinecap="round" />
    <line x1="12" y1="38" x2="18" y2="32" stroke="#E5E7EB" strokeWidth="4.5" strokeLinecap="round" />
    
    {/* Magic Star tip */}
    <polygon points="34,8 36,15 43,16 38,20 40,27 34,23 28,27 30,20 25,16 32,15" fill="#FACC15" stroke="#EAB308" strokeWidth="1" />
    <circle cx="34" cy="18" r="2.5" fill="#FFFFFF" />

    {/* Sparkle sparkles */}
    <circle cx="44" cy="12" r="1.5" fill="#FBBF24" />
    <circle cx="27" cy="9" r="1.5" fill="#FBBF24" />
    <circle cx="39" cy="29" r="1.5" fill="#FBBF24" />
  </svg>
);

export const RulerIcon = () => (
  <svg viewBox="0 0 50 50" className="booster-svg">
    {/* Angled wooden ruler */}
    <g transform="rotate(45 25 25)">
      <rect x="10" y="20" width="30" height="10" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
      {/* Measurement ticks */}
      <line x1="14" y1="20" x2="14" y2="24" stroke="#78350F" strokeWidth="1.2" />
      <line x1="18" y1="20" x2="18" y2="26" stroke="#78350F" strokeWidth="1.2" />
      <line x1="22" y1="20" x2="22" y2="24" stroke="#78350F" strokeWidth="1.2" />
      <line x1="26" y1="20" x2="26" y2="26" stroke="#78350F" strokeWidth="1.2" />
      <line x1="30" y1="20" x2="30" y2="24" stroke="#78350F" strokeWidth="1.2" />
      <line x1="34" y1="20" x2="34" y2="26" stroke="#78350F" strokeWidth="1.2" />
    </g>
  </svg>
);
