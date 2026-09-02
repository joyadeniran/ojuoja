/**
 * Segmented tabs. Pill group for content switches, underline for page sections.
 */
export interface TabsProps {
  items?: Array<string | { value: string; label: string }>;
  value?: string;
  onChange?: (next: string) => void;
  variant?: "pill" | "underline";
  className?: string;
}
export function Tabs(props: TabsProps): JSX.Element;
