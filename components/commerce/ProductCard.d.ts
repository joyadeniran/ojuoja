/**
 * A single marketplace listing: square photo, vendor line, naira price, add button.
 */
export interface ProductCardProps {
  name: string;
  /** Amount in naira; formatted with ₦ and thousands separators for you. */
  price: number;
  /** Struck-through original price. */
  was?: number;
  image?: string;
  vendor?: string;
  /** Shows the green tick beside the vendor name. */
  verified?: boolean;
  rating?: number;
  /** Corner flag, e.g. { label: "-20%", tone: "danger" }. */
  flag?: { label: string; tone?: "danger" | "accent" | "brand" | "lime" };
  favourite?: boolean;
  onFavourite?: () => void;
  onAdd?: () => void;
  className?: string;
}
export function ProductCard(props: ProductCardProps): JSX.Element;
