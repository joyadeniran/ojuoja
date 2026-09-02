import type { ReactNode } from "react";

/** Lime pill stating a delivery promise, cutoff or fee. */
export interface DeliveryNoteProps {
  icon?: string;
  children?: ReactNode;
  className?: string;
}
export function DeliveryNote(props: DeliveryNoteProps): JSX.Element;
