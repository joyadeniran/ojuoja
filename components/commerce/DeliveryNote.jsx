import React from "react";
import { Icon } from "../brand/Icon.jsx";

export function DeliveryNote({ icon = "bike", children, className = "", ...rest }) {
  return (
    <div className={`oj-delivery ${className}`} {...rest}>
      <span className="oj-delivery__icon"><Icon name={icon} size={18} /></span>
      <span>{children}</span>
    </div>
  );
}
