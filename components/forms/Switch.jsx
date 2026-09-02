import React from "react";

export function Switch({ checked = false, onChange, disabled = false, children, className = "", ...rest }) {
  const cls = ["oj-switch", checked && "oj-switch--on", disabled && "oj-switch--disabled", className].filter(Boolean).join(" ");
  return (
    <label className={cls} {...rest}>
      <span className="oj-switch__track" role="switch" aria-checked={checked} onClick={() => !disabled && onChange && onChange(!checked)}>
        <span className="oj-switch__knob" />
      </span>
      {children && <span>{children}</span>}
    </label>
  );
}
