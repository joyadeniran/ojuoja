import type { InputHTMLAttributes } from "react";

/**
 * Labelled text field. Pill by default — Ojuoja inputs echo the button shape.
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  /** Presence of error switches the border red and replaces the hint. */
  error?: string;
  leadingIcon?: string;
  trailingIcon?: string;
  /** pill for search/marketing forms, boxy (12px) for long checkout forms. */
  shape?: "pill" | "boxy";
  tone?: "outline" | "filled";
  size?: "md" | "lg";
}
export function Input(props: InputProps): JSX.Element;
