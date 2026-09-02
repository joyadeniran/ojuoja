/** Category trail on listing and product pages. */
export interface BreadcrumbProps {
  items?: Array<{ label: string; href?: string }>;
  className?: string;
}
export function Breadcrumb(props: BreadcrumbProps): JSX.Element;
