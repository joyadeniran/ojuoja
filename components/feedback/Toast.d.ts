/**
 * Transient confirmation, anchored bottom-right, 380px wide.
 */
export interface ToastProps {
  tone?: "success" | "warning" | "danger" | "info";
  title?: string;
  message?: string;
  /** Override the tone's default icon stem. */
  icon?: string;
  onClose?: () => void;
  className?: string;
}
export function Toast(props: ToastProps): JSX.Element;
