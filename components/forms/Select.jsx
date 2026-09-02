import React from "react";
import { Icon } from "../brand/Icon.jsx";

export function Select({ label, options = [], value, onChange, className = "", ...rest }) {
  return (
    <div className={`oj-field ${className}`}>
      {label && <label className="oj-field__label">{label}</label>}
      <div className="oj-select">
        <select className="oj-select__el" value={value} onChange={onChange} {...rest}>
          {options.map((o) => (
            <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value}>
              {typeof o === "string" ? o : o.label}
            </option>
          ))}
        </select>
        <span className="oj-select__chev"><Icon name="chevron-down" size={16} /></span>
      </div>
    </div>
  );
}
