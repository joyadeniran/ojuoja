import type { ReactNode } from "react";

/**
 * Modal sheet for confirmations and short flows. Scrim is tinted deep green.
 */
export interface DialogProps {
  open?: boolean;
  title?: string;
  /** lime tints the header band, for celebratory moments. */
  tone?: "plain" | "lime";
  children?: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  className?: string;
}
export function Dialog(props: DialogProps): JSX.Element;
