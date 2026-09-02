import React from "react";
import { Icon } from "../brand/Icon.jsx";

export function Dialog({ open = true, title, children, footer, tone = "plain", onClose, className = "", ...rest }) {
  if (!open) return null;
  return (
    <div className="oj-dialog__scrim" onClick={onClose}>
      <div role="dialog" aria-modal="true" className={`oj-dialog ${tone === "lime" ? "oj-dialog--lime" : ""} ${className}`} onClick={(e) => e.stopPropagation()} {...rest}>
        <div className="oj-dialog__head">
          <h2 className="oj-dialog__title">{title}</h2>
          {onClose && <button type="button" className="oj-toast__close" onClick={onClose} aria-label="Close"><Icon name="x" size={16} /></button>}
        </div>
        <div className="oj-dialog__body">{children}</div>
        {footer && <div className="oj-dialog__foot">{footer}</div>}
      </div>
    </div>
  );
}
