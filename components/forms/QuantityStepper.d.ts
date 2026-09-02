/** Quantity control for cart lines and product pages. */
export interface QuantityStepperProps {
  value?: number;
  min?: number;
  max?: number;
  onChange?: (next: number) => void;
  /** Short unit suffix, e.g. "kg", "pcs". */
  unit?: string;
  className?: string;
}
export function QuantityStepper(props: QuantityStepperProps): JSX.Element;
