/**
 * Custom SVG marks for security tools that have no official Simple Icons entry.
 * Each is a simplified, original glyph in the site palette — not a copy.
 */

type MarkProps = { size?: number; color?: string };

export function NmapMark({ size = 24, color = "#00d294" }: MarkProps) {
  // radar / sweep glyph
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1.3" opacity="0.35" />
      <circle cx="12" cy="12" r="6.5" fill="none" stroke={color} strokeWidth="1.3" opacity="0.55" />
      <circle cx="12" cy="12" r="2" fill={color} />
      <line x1="12" y1="12" x2="20" y2="6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="8.5" r="1.2" fill={color} />
    </svg>
  );
}

export function ZapMark({ size = 24, color = "#00a5ef" }: MarkProps) {
  // OWASP ZAP — proxy/interception glyph (Z-bolt)
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M4 4 H20 L13 12 H20 L4 20 L11 12 H4 Z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 9 H15" stroke={color} strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

export function NiktoMark({ size = 24, color = "#ffb020" }: MarkProps) {
  // scanner / target glyph
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1.4" />
      <circle cx="12" cy="12" r="4" fill="none" stroke={color} strokeWidth="1.4" />
      <line x1="12" y1="3" x2="12" y2="21" stroke={color} strokeWidth="1.1" opacity="0.5" />
      <line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="1.1" opacity="0.5" />
      <circle cx="12" cy="12" r="1.4" fill={color} />
    </svg>
  );
}

export function NessusMark({ size = 24, color = "#00d294" }: MarkProps) {
  // vulnerability scanner — shield with scan line
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 2 L21 6 V12 C21 17 16.5 21 12 22 C7.5 21 3 17 3 12 V6 Z" fill="none" stroke={color} strokeWidth="1.4" />
      <line x1="6" y1="11" x2="18" y2="11" stroke={color} strokeWidth="1.3" />
      <line x1="7.5" y1="14.5" x2="16.5" y2="14.5" stroke={color} strokeWidth="1.1" opacity="0.6" />
      <line x1="9" y1="7.5" x2="15" y2="7.5" stroke={color} strokeWidth="1.1" opacity="0.6" />
    </svg>
  );
}

export function OpenvasMark({ size = 24, color = "#00a5ef" }: MarkProps) {
  // open scanner — eye / aperture glyph
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M2 12 C5 6.5 9 4.5 12 4.5 C15 4.5 19 6.5 22 12 C19 17.5 15 19.5 12 19.5 C9 19.5 5 17.5 2 12 Z" fill="none" stroke={color} strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3.6" fill="none" stroke={color} strokeWidth="1.4" />
      <circle cx="12" cy="12" r="1.4" fill={color} />
    </svg>
  );
}

export function JavaMark({ size = 24, color = "#ff667f" }: MarkProps) {
  // steaming cup glyph
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M6 10 H17 V15 C17 18 14.5 20 11.5 20 C8.5 20 6 18 6 15 Z" fill="none" stroke={color} strokeWidth="1.4" />
      <path d="M17 11.5 C19 11.5 20 12.5 20 14 C20 15.5 19 16.5 17 16.5" fill="none" stroke={color} strokeWidth="1.4" />
      <path d="M9 7 C9 5.5 11 5.5 11 3.8" fill="none" stroke={color} strokeWidth="1.2" opacity="0.7" strokeLinecap="round" />
      <path d="M12.5 7.5 C12.5 6 14.5 6 14.5 4.3" fill="none" stroke={color} strokeWidth="1.2" opacity="0.7" strokeLinecap="round" />
    </svg>
  );
}
