'use client';

import React from 'react';

export interface LondonMotifProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * Elizabeth Tower / Big Ben Icon (Minimalist Line Art)
 */
export const BigBen: React.FC<LondonMotifProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`london-motif london-motif-bigben ${className}`.trim()}
    aria-hidden="true"
    {...props}
  >
    {/* Spire */}
    <path d="M12 2L10 6h4L12 2z" />
    <line x1="12" y1="2" x2="12" y2="1" />
    {/* Belfry & Clock Tower Section */}
    <rect x="9" y="6" width="6" height="5" rx="1" />
    {/* Clock Face */}
    <circle cx="12" cy="8.5" r="1.5" />
    {/* Tower Shaft */}
    <path d="M8.5 11h7v11h-7z" />
    {/* Vertical Architectural Slits */}
    <line x1="10.5" y1="13" x2="10.5" y2="19" />
    <line x1="13.5" y1="13" x2="13.5" y2="19" />
    {/* Base Plinth */}
    <line x1="7" y1="22" x2="17" y2="22" />
  </svg>
);

/**
 * Iconic London Double-Decker Bus (AEC Routemaster Silhouette)
 */
export const LondonBus: React.FC<LondonMotifProps> = ({
  size = 24,
  color = '#C93C45',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`london-motif london-motif-bus ${className}`.trim()}
    aria-hidden="true"
    {...props}
  >
    {/* Bus Body */}
    <path d="M3 18V7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v11H3z" />
    {/* Upper Windows */}
    <rect x="5.5" y="6" width="3.5" height="3" rx="0.5" />
    <rect x="10.25" y="6" width="3.5" height="3" rx="0.5" />
    <rect x="15" y="6" width="3.5" height="3" rx="0.5" />
    {/* Floor Divider */}
    <line x1="3" y1="11" x2="21" y2="11" />
    {/* Lower Windows & Windshield */}
    <rect x="5.5" y="13" width="3.5" height="3" rx="0.5" />
    <rect x="10.25" y="13" width="3.5" height="3" rx="0.5" />
    <path d="M15 13h3.5v3H15z" />
    {/* Wheels */}
    <circle cx="7" cy="18.5" r="2" />
    <circle cx="17" cy="18.5" r="2" />
    <line x1="9" y1="18.5" x2="15" y2="18.5" />
  </svg>
);

/**
 * Victorian London Cast-Iron Street Lamp
 */
export const StreetLamp: React.FC<LondonMotifProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`london-motif london-motif-lamp ${className}`.trim()}
    aria-hidden="true"
    {...props}
  >
    {/* Lantern Top Cap */}
    <path d="M12 2l-3 3h6l-3-3z" />
    {/* Glass Lantern Body */}
    <polygon points="9 5 8 10 16 10 15 5" />
    {/* Warm Light Core */}
    <circle cx="12" cy="7.5" r="1" fill="var(--pastel-yellow, #FFF0B8)" />
    {/* Lantern Base Bracket */}
    <path d="M10 10l2 2 2-2" />
    {/* Lamp Post */}
    <line x1="12" y1="12" x2="12" y2="21" />
    {/* Decorative Post Base */}
    <path d="M9 22h6" />
    <path d="M10 21h4" />
  </svg>
);

/**
 * London Underground Roundel Badge
 */
export const UndergroundRoundel: React.FC<LondonMotifProps> = ({
  size = 24,
  color = '#243047',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`london-motif london-motif-roundel ${className}`.trim()}
    aria-hidden="true"
    {...props}
  >
    {/* Outer Circular Ring (Navy / Accent) */}
    <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="2.5" />
    {/* Horizontal Bar (London Red) */}
    <rect x="2" y="10" width="20" height="4" rx="1.5" fill="#C93C45" />
  </svg>
);

/**
 * London Skyline Silhouette (Big Ben, London Eye, Tower Bridge)
 */
export const LondonSkyline: React.FC<LondonMotifProps> = ({
  size = 32,
  color = 'currentColor',
  className = '',
  ...props
}) => (
  <svg
    width={size * 3}
    height={size}
    viewBox="0 0 96 32"
    fill="none"
    stroke={color}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`london-motif london-motif-skyline ${className}`.trim()}
    aria-hidden="true"
    {...props}
  >
    {/* Ground Baseline / River Thames edge */}
    <line x1="2" y1="30" x2="94" y2="30" />

    {/* Big Ben / Westminster (Left) */}
    <line x1="12" y1="30" x2="12" y2="12" />
    <line x1="18" y1="30" x2="18" y2="12" />
    <rect x="11" y="8" width="8" height="4" rx="0.5" />
    <path d="M15 4L11 8h8L15 4z" />
    <line x1="15" y1="4" x2="15" y2="2" />
    <circle cx="15" cy="10" r="1" />

    {/* Westminster Abbey spires */}
    <polyline points="22 30 22 16 25 12 28 16 28 30" />

    {/* London Eye Wheel (Center) */}
    <circle cx="48" cy="18" r="9" strokeDasharray="3 2" />
    <line x1="48" y1="18" x2="48" y2="30" />
    <line x1="44" y1="30" x2="48" y2="18" />
    <line x1="52" y1="30" x2="48" y2="18" />

    {/* The Shard (Mid-Right) */}
    <polygon points="64 30 68 6 72 30" />

    {/* Tower Bridge Towers & Cables (Right) */}
    <path d="M78 30V15h4v15" />
    <path d="M86 30V15h4v15" />
    <line x1="76" y1="22" x2="92" y2="22" />
    <path d="M78 15q4 6 8 0" />
  </svg>
);

/**
 * Afternoon Tea Cup (Pastel London Cozy Study Vibe)
 */
export const AfternoonTea: React.FC<LondonMotifProps> = ({
  size = 24,
  color = 'currentColor',
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`london-motif london-motif-tea ${className}`.trim()}
    aria-hidden="true"
    {...props}
  >
    {/* Saucer */}
    <path d="M4 19h16" />
    {/* Teacup Body */}
    <path d="M6 10v4a5 5 0 0 0 5 5h2a5 5 0 0 0 5-5v-4H6z" />
    {/* Teacup Handle */}
    <path d="M18 11h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2" />
    {/* Gentle Steam */}
    <path d="M10 4q1 2 0 3" />
    <path d="M14 4q1 2 0 3" />
  </svg>
);

