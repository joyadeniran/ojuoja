import type { ReactNode } from "react";

/**
 * The site FAQ list: numbered rows, hairline rules, rotating chevron.
 */
export interface AccordionProps {
  items?: Array<{ q: string; a: ReactNode }>;
  /** Prefix each question with its index, as on the live FAQ. */
  numbered?: boolean;
  /** Index open on first paint, or null for all closed. */
  defaultOpen?: number | null;
  className?: string;
}
export function Accordion(props: AccordionProps): JSX.Element;
