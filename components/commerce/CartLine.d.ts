/**
 * One basket row: thumbnail, name, vendor, stepper, line total, remove.
 */
export interface CartLineProps {
  name: string;
  vendor?: string;
  image?: string;
  /** Unit price in naira. The line total is price × qty. */
  price: number;
  qty?: number;
  unit?: string;
  onQty?: (next: number) => void;
  onRemove?: () => void;
  className?: string;
}
export function CartLine(props: CartLineProps): JSX.Element;
