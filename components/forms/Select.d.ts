import type { ChangeEvent } from "react";

/** Native select in brand pill clothing, with the standard chevron. */
export interface SelectProps {
  label?: string;
  options?: Array<string | { value: string; label: string }>;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}
export function Select(props: SelectProps): JSX.Element;
