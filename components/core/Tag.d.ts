import type { ReactNode } from "react";

/** Selectable filter chip used in category and search filter rows. */
export interface TagProps {
  selected?: boolean;
  onRemove?: () => void;
  icon?: string;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}
export function Tag(props: TagProps): JSX.Element;
