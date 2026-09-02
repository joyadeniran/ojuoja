/**
 * A vendor row: avatar, name with verification tick, area, delivery time, rating.
 */
export interface VendorCardProps {
  name: string;
  /** Neighbourhood inside Ikorodu, e.g. "Ita Elewa". */
  area?: string;
  image?: string;
  verified?: boolean;
  rating?: number;
  /** Typical delivery time in minutes. */
  deliveryMins?: number;
  className?: string;
}
export function VendorCard(props: VendorCardProps): JSX.Element;
