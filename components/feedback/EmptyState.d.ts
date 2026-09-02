import type { ReactNode } from "react";

/**
 * Empty basket, no search results, no orders yet. Sits on the pale lime surface.
 */
export interface EmptyStateProps {
  icon?: string;
  title?: string;
  message?: string;
  action?: ReactNode;
  className?: string;
}
export function EmptyState(props: EmptyStateProps): JSX.Element;
