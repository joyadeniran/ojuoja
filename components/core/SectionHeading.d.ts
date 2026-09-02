import type { ReactNode } from "react";

/**
 * Display-type section title. Titles are set in the display face, in green.
 */
export interface SectionHeadingProps {
  title: ReactNode;
  /** Uppercase tracked label above the title. Use sparingly. */
  eyebrow?: string;
  subtitle?: string;
  align?: "left" | "center";
  /** brand green · ink deep green · onbrand white (for green fields). */
  tone?: "brand" | "ink" | "onbrand";
  level?: 1 | 2 | 3;
  action?: ReactNode;
  className?: string;
}
export function SectionHeading(props: SectionHeadingProps): JSX.Element;
