import type { CSSProperties } from "react";

/**
 * The Ojuoja wordmark or standalone brand mark, from the supplied SVG artwork.
 */
export interface LogoProps {
  /** full-color on light surfaces, white on green/photo, black for 1-colour print. */
  variant?: "full-color" | "white" | "black";
  /** true renders the "ọ" mark alone (favicon, app icon, avatar). */
  mark?: boolean;
  /** Rendered height in px. Minimum 20px for the wordmark, 16px for the mark. */
  height?: number;
  className?: string;
  style?: CSSProperties;
}
export function Logo(props: LogoProps): JSX.Element;
