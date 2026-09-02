/** Five-star rating readout in brand yellow. */
export interface RatingProps {
  /** 0–5, one decimal. */
  value?: number;
  /** Review count shown in brackets. */
  count?: number;
  size?: number;
  className?: string;
}
export function Rating(props: RatingProps): JSX.Element;
