/**
 * Homepage category tile with photo bleeding off the bottom edge.
 */
export interface CategoryCardProps {
  title: string;
  description?: string;
  image?: string;
  /** Defaults to the site's own wording, "Explore Category". */
  cta?: string;
  tone?: "flat" | "lime";
  onClick?: () => void;
  className?: string;
}
export function CategoryCard(props: CategoryCardProps): JSX.Element;
