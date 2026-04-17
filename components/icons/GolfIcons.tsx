/**
 * Custom golf icons — drawn in the Lucide house style (24x24 viewBox,
 * 1.75 stroke by default, round caps/joins, currentColor).
 *
 * Why custom instead of a library: Lucide has no golf-specific marks.
 * Font Awesome has a thin selection, but the stroke weights and joins
 * don't match our UI icons. Drawing them in-house keeps a single visual
 * language across all iconography.
 *
 * Conventions:
 *   - All paths use stroke="currentColor", fill="none" unless a solid
 *     mark is needed (e.g. the ball core).
 *   - strokeWidth default 1.75, override via prop.
 *   - size maps to both width + height (keep square).
 */

import type { SVGProps } from "react";

type GolfIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  strokeWidth?: number;
};

function baseProps({ size = 24, strokeWidth = 1.75, ...rest }: GolfIconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...rest,
  };
}

/** Pin flag planted on a green — stock, triangular flag, ground line. */
export function GolfFlag(props: GolfIconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M7 21h10" />
      <path d="M8 21V4" />
      <path d="M8 4h8l-3 3 3 3H8" />
    </svg>
  );
}

/** Golf ball — circle with five dimples. */
export function GolfBall(props: GolfIconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="9" cy="9.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="8.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="12.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="12.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="15" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Golf tee with ball sitting on top. */
export function GolfTee(props: GolfIconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="6" r="2.5" />
      <path d="M9 10.5h6" />
      <path d="M10 10.5l2 10" />
      <path d="M14 10.5l-2 10" />
    </svg>
  );
}

/** Putter-style golf club — shaft plus angled head. */
export function GolfClub(props: GolfIconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M7 3l11 11" />
      <path d="M5 17l3-3 3 3-3 3z" />
    </svg>
  );
}

/** Scorecard — paper with score lines. */
export function GolfScorecard(props: GolfIconProps) {
  return (
    <svg {...baseProps(props)}>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  );
}

/** Golf hole with pin flag rising from it (top-down-ish perspective). */
export function GolfHole(props: GolfIconProps) {
  return (
    <svg {...baseProps(props)}>
      <ellipse cx="12" cy="18" rx="7" ry="2" />
      <path d="M12 18V5" />
      <path d="M12 5h6l-2 2.5L18 10h-6" />
    </svg>
  );
}

/** Fairway / rolling green silhouette — course landscape abstraction. */
export function GolfFairway(props: GolfIconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M3 18c3-4 6-4 9 0s6 4 9 0" />
      <path d="M3 13c3-4 6-4 9 0s6 4 9 0" />
      <circle cx="18" cy="7" r="1.2" />
    </svg>
  );
}

/** Handicap — stylized H with downward arrow (handicap improves = number down). */
export function GolfHandicap(props: GolfIconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M6 5v14" />
      <path d="M14 5v14" />
      <path d="M6 12h8" />
      <path d="M18 14v5" />
      <path d="M16 17l2 2 2-2" />
    </svg>
  );
}
