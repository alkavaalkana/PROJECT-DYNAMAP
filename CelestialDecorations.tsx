import React from 'react';

/**
 * Ambient Moonlit Celestial Twilight SVG backdrop & filigree accents.
 * Strictly pointer-events-none decorative backdrop matching the user's twilight illustrations.
 */
export const CelestialBackdrop: React.FC = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* Top-right moonlit astrolabe halo & concentric rings */}
      <svg
        viewBox="0 0 640 640"
        className="absolute -top-24 -right-24 w-[520px] h-[520px] opacity-[0.42] text-[#7086DE]"
        fill="none"
      >
        <defs>
          <radialGradient id="moonHaloGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E6C77E" stopOpacity="0.22" />
            <stop offset="48%" stopColor="#9BAEED" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#9BAEED" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="340" cy="290" r="250" fill="url(#moonHaloGrad)" />
        <circle cx="340" cy="290" r="220" stroke="#7086DE" strokeOpacity="0.16" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="340" cy="290" r="176" stroke="#C9A65B" strokeOpacity="0.28" strokeWidth="1" />
        <circle cx="340" cy="290" r="132" stroke="#7086DE" strokeOpacity="0.14" strokeWidth="0.9" />
        {/* Crescent moon silhouette */}
        <path
          d="M362 214a68 68 0 1 0 62 96 54 54 0 0 1-62-96Z"
          fill="#DFBE74"
          fillOpacity="0.16"
          stroke="#C9A65B"
          strokeOpacity="0.35"
          strokeWidth="1.1"
        />
        {/* 4-point celestial star sparkles */}
        <path d="M210 175l3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9Z" fill="#C9A65B" fillOpacity="0.45" />
        <path d="M474 205l2.5 7 7 2.5-7 2.5-2.5 7-2.5-7-7-2.5 7-2.5 2.5-7Z" fill="#7086DE" fillOpacity="0.42" />
        <path d="M250 410l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" fill="#C9A65B" fillOpacity="0.38" />
        <circle cx="176" cy="264" r="2.2" fill="#C9A65B" fillOpacity="0.4" />
        <circle cx="430" cy="395" r="2.5" fill="#7086DE" fillOpacity="0.35" />
      </svg>

      {/* Bottom-left soft drifting clouds & constellation arcs */}
      <svg
        viewBox="0 0 720 340"
        className="hidden sm:block absolute bottom-0 left-48 w-[560px] h-[260px] opacity-[0.38]"
        fill="none"
      >
        <path
          d="M0 310c48-44 102-52 152-24 28-38 86-46 130-16 42-22 96-10 128 24 38-18 82-12 114 16H0Z"
          fill="#FFFFFF"
          fillOpacity="0.55"
        />
        <path
          d="M44 265c85-48 215-64 330-28 90 28 175 18 248-18"
          stroke="#8FA2E6"
          strokeOpacity="0.24"
          strokeWidth="1"
          strokeDasharray="3 5"
        />
        <path d="M128 192l2.5 7 7 2.5-7 2.5-2.5 7-2.5-7-7-2.5 7-2.5 2.5-7Z" fill="#C9A65B" fillOpacity="0.42" />
        <path d="M398 168l2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2 2-5.5Z" fill="#7086DE" fillOpacity="0.38" />
      </svg>
    </div>
  );
};

export const CelestialCornerFiligree: React.FC<{
  position?: 'top-right' | 'bottom-left';
  tone?: 'light' | 'dark';
  className?: string;
}> = ({ position = 'top-right', tone = 'light', className }) => {
  const strokeMain = tone === 'dark' ? '#DFBE74' : '#C9A65B';
  const strokeSub = tone === 'dark' ? '#9BAEED' : '#7086DE';
  const posClass =
    position === 'bottom-left' ? 'bottom-0 left-0 rotate-180' : 'top-0 right-0';

  return (
    <svg
      viewBox="0 0 120 120"
      className={`pointer-events-none absolute ${posClass} w-24 h-24 opacity-45 select-none ${className || ''}`}
      fill="none"
      aria-hidden="true"
    >
      <path d="M120 16H64c-12 0-20 8-20 20v4" stroke={strokeMain} strokeOpacity="0.55" strokeWidth="1" />
      <circle cx="88" cy="34" r="18" stroke={strokeSub} strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 3" />
      <path d="M96 22l2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2 2-5.5Z" fill={strokeMain} fillOpacity="0.65" />
      <circle cx="64" cy="48" r="1.8" fill={strokeSub} fillOpacity="0.55" />
    </svg>
  );
};
