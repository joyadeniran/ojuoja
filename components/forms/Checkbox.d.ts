import type { ReactNode } from "react";

/**
 * Checkbox, or a radio when radio is set. 20px box, 6px radius, green fill.
 */
export interface CheckboxProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  /** Renders as a radio: circular box, green dot instead of a tick. */
  radio?: boolean;
  children?: ReactNode;
  className?: string;
}
export function Checkbox(props: CheckboxProps): JSX.Element;
