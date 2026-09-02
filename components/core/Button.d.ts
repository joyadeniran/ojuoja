import type { ButtonHTMLAttributes, ElementType, ReactNode } from "react";

/**
 * Pill button. Primary + badgeIcon="shopping-basket" is the house CTA.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary green pill · secondary outlined · ghost text · accent yellow · dark deep-green · danger · onbrand (white, for use on green). */
  variant?: "primary" | "secondary" | "ghost" | "accent" | "dark" | "danger" | "onbrand";
  /** sm 34px · md 44px · lg 54px */
  size?: "sm" | "md" | "lg";
  /** Icon stem shown in the trailing white circle — the brand's CTA tell. */
  badgeIcon?: string;
  leadingIcon?: string;
  block?: boolean;
  as?: ElementType;
  children?: ReactNode;
}
export function Button(props: ButtonProps): JSX.Element;
