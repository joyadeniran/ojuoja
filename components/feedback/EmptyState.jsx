import React from "react";
import { Icon } from "../brand/Icon.jsx";

export function EmptyState({ icon = "shopping-basket", title, message, action, className = "", ...rest }) {
  return (
    <div className={`oj-empty ${className}`} {...rest}>
      <span className="oj-empty__mark"><Icon name={icon} size={26} /></span>
      {title && <h3 className="oj-empty__title">{title}</h3>}
      {message && <p className="oj-empty__msg">{message}</p>}
      {action}
    </div>
  );
}
