import type { ChangeEvent } from "react";

/**
 * The marketplace search pill used in the site header.
 */
export interface SearchFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (value?: string) => void;
  /** Show the green circular submit button. */
  submit?: boolean;
  className?: string;
}
export function SearchField(props: SearchFieldProps): JSX.Element;
