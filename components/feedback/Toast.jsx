import React from "react";
import { Icon } from "../brand/Icon.jsx";

const ICONS = { success: "check", warning: "bell", danger: "x", info: "truck" };

export function Toast({ tone = "success", title, message, onClose, icon, className = "", ...rest }) {
  return (
    <div role="status" className={`oj-toast oj-toast--${tone} ${className}`} {...rest}>
      <span className="oj-toast__icon"><Icon name={icon || ICONS[tone]} size={16} /></span>
      <div className="oj-toast__body">
        {title && <span className="oj-toast__title">{title}</span>}
        {message && <span className="oj-toast__msg">{message}</span>}
      </div>
      {onClose && <button type="button" className="oj-toast__close" onClick={onClose} aria-label="Dismiss"><Icon name="x" size={14} /></button>}
    </div>
  );
}
