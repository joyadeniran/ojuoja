import React from "react";
import { Icon } from "../brand/Icon.jsx";

export function Input({ label, hint, error, leadingIcon, trailingIcon, shape = "pill", tone = "outline", size = "md", id, className = "", ...rest }) {
  const fid = id || `oj-in-${Math.random().toString(36).slice(2, 8)}`;
  const cls = ["oj-input", tone === "filled" && "oj-input--filled", shape === "boxy" && "oj-input--boxy", size === "lg" && "oj-input--lg", error && "oj-input--invalid"].filter(Boolean).join(" ");
  return (
    <div className={`oj-field ${className}`}>
      {label && <label className="oj-field__label" htmlFor={fid}>{label}</label>}
      <div className={cls}>
        {leadingIcon && <span className="oj-input__adorn"><Icon name={leadingIcon} size={16} /></span>}
        <input id={fid} className="oj-input__el" {...rest} />
        {trailingIcon && <span className="oj-input__adorn"><Icon name={trailingIcon} size={16} /></span>}
      </div>
      {error ? <span className="oj-field__error">{error}</span> : hint ? <span className="oj-field__hint">{hint}</span> : null}
    </div>
  );
}
