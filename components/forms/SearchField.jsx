import React from "react";
import { Icon } from "../brand/Icon.jsx";
import { IconButton } from "../core/IconButton.jsx";

/* Header search from ojuoja.shop: grey pill, magnifier on the left,
   a green circular submit on the right. */
export function SearchField({ placeholder = "Search for akara, suli kuli or corn", value, onChange, onSubmit, submit = true, className = "", ...rest }) {
  return (
    <form className={`oj-search ${className}`} onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(value); }} {...rest}>
      <span className="oj-input__adorn"><Icon name="search" size={16} /></span>
      <input className="oj-search__el" placeholder={placeholder} value={value} onChange={onChange} />
      {submit && <IconButton icon="arrow-right" variant="solid" size="sm" label="Search" type="submit" />}
    </form>
  );
}
