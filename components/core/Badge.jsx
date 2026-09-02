import React from "react";
import { Icon } from "../brand/Icon.jsx";

export function Badge({ tone = "soft", icon, children, className = "", ...rest }) {
  return (
    <span className={`oj-badge oj-badge--${tone} ${className}`} {...rest}>
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  );
}
