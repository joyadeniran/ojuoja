import type { CSSProperties, ReactNode, ElementType } from "react";

/**
 * Full-bleed striped brand field used behind hero, promo and section content.
 */
export interface PatternPanelProps {
  /** lime = pale chartreuse hero field; green = deep green band; market = full-colour bar run. */
  variant?: "lime" | "green" | "market";
  as?: ElementType;
  /** Applies the standard 64/48 section padding. Turn off to lay out yourself. */
  padded?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}
export function PatternPanel(props: PatternPanelProps): JSX.Element;
