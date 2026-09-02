import React from "react";

export function Tabs({ items = [], value, onChange, variant = "pill", className = "", ...rest }) {
  const norm = items.map((i) => (typeof i === "string" ? { value: i, label: i } : i));
  return (
    <div role="tablist" className={`oj-tabs ${variant === "underline" ? "oj-tabs--underline" : ""} ${className}`} {...rest}>
      {norm.map((i) => (
        <button key={i.value} role="tab" type="button" aria-selected={value === i.value}
          className="oj-tabs__tab" onClick={() => onChange && onChange(i.value)}>
          {i.label}
        </button>
      ))}
    </div>
  );
}
