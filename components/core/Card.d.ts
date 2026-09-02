import type { ElementType, ReactNode } from "react";

/**
 * Generic surface container: hairline border, 16px radius, green-tinted shadow.
 */
export interface CardProps {
  /** default white+hairline · flat grey · lime · brand green. */
  tone?: "default" | "flat" | "lime" | "brand";
  raised?: boolean;
  interactive?: boolean;
  padded?: boolean;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}
export function Card(props: CardProps): JSX.Element;
