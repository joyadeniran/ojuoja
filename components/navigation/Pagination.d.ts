/** Page control for catalogue and order-history lists. */
export interface PaginationProps {
  page?: number;
  pages?: number;
  onChange?: (next: number) => void;
  className?: string;
}
export function Pagination(props: PaginationProps): JSX.Element;
