/**
 * Circular icon-only control: cart, favourite, close, quantity, header actions.
 */
export interface IconButtonProps {
  /** Icon stem from assets/icons. */
  icon: string;
  variant?: "plain" | "solid" | "outline" | "accent";
  size?: "sm" | "md" | "lg";
  /** Optional numeric bubble, e.g. cart item count. */
  count?: number;
  /** Required for accessibility — becomes aria-label. */
  label: string;
  onClick?: () => void;
  className?: string;
}
export function IconButton(props: IconButtonProps): JSX.Element;
