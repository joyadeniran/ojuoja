import React from "react";
import { Icon } from "../brand/Icon.jsx";

export function Tag({ selected = false, onRemove, icon, children, className = "", ...rest }) {
  return (
    <button type="button" aria-pressed={selected} className={`oj-tag ${className}`} {...rest}>
      {icon && <Icon name={icon} size={14} />}
      {children}
      {onRemove && (
        <span className="oj-tag__remove" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
          <Icon name="x" size={12} />
        </span>
      )}
    </button>
  );
}
