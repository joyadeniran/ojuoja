import React from "react";

/* The brand pattern: flat vertical bars of uneven width. "lime" and "green"
   are the tonal stripe fields used behind hero and promo content; "market"
   is the full-colour bar run from the guide. */
export function PatternPanel({ variant = "lime", as: Tag = "div", padded = true, children, className = "", style, ...rest }) {
  return (
    <Tag className={`oj-pattern oj-pattern--${variant} ${className}`} style={style} {...rest}>
      <div className="oj-pattern__inner" style={padded ? { padding: "var(--space-12) var(--space-11)" } : undefined}>
        {children}
      </div>
    </Tag>
  );
}
