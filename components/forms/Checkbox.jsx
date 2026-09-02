import React from "react";
import { Icon } from "../brand/Icon.jsx";

export function Checkbox({ checked = false, onChange, disabled = false, radio = false, children, className = "", ...rest }) {
  const cls = ["oj-check", radio && "oj-check--radio", checked && "oj-check--checked", disabled && "oj-check--disabled", className].filter(Boolean).join(" ");
  return (
    <label className={cls} {...rest}>
      <span className="oj-check__box" role={radio ? "radio" : "checkbox"} aria-checked={checked} aria-disabled={disabled}
        onClick={() => !disabled && onChange && onChange(!checked)}>
        {radio ? (checked && <span className="oj-check__dot" />) : <Icon name="check" size={13} />}
      </span>
      <span>{children}</span>
    </label>
  );
}
