import type { ReactNode } from "react";

/**
 * Small non-interactive status pill: verified vendor, discount, delivery window.
 */
export interface BadgeProps {
  tone?: "brand" | "soft" | "lime" | "accent" | "warm" | "danger" | "neutral";
  /** Icon stem from assets/icons. */
  icon?: string;
  children?: ReactNode;
  className?: string;
}
export function Badge(props: BadgeProps): JSX.Element;
