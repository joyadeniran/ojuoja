import type { ReactNode } from "react";

/** Immediate-effect toggle: notifications, save card, vendor availability. */
export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}
export function Switch(props: SwitchProps): JSX.Element;
