import React from "react";
import { Icon } from "../brand/Icon.jsx";

export function QuantityStepper({ value = 1, min = 1, max = 99, onChange, unit, className = "", ...rest }) {
  const set = (n) => onChange && onChange(Math.min(max, Math.max(min, n)));
  return (
    <div className={`oj-stepper ${className}`} {...rest}>
      <button type="button" className="oj-stepper__btn" disabled={value <= min} onClick={() => set(value - 1)} aria-label="Decrease">
        <Icon name="minus" size={14} />
      </button>
      <span className="oj-stepper__val">{value}{unit ? ` ${unit}` : ""}</span>
      <button type="button" className="oj-stepper__btn" disabled={value >= max} onClick={() => set(value + 1)} aria-label="Increase">
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}
