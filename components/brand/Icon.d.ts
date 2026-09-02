import type { CSSProperties } from "react";

/**
 * Lucide glyph painted as a CSS mask so it takes currentColor.
 */
export interface IconProps {
  /** File stem in assets/icons, e.g. "shopping-basket". */
  name: string;
  /** Square px size. 16 in dense UI, 18 default, 24 for headers. */
  size?: number;
  strokeAware?: boolean;
  className?: string;
  style?: CSSProperties;
}
export function Icon(props: IconProps): JSX.Element;
