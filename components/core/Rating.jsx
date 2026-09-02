import React from "react";
import { Icon } from "../brand/Icon.jsx";

export function Rating({ value = 0, count, size = 14, className = "", ...rest }) {
  const filled = Math.round(value);
  return (
    <span className={`oj-rating ${className}`} {...rest}>
      <span className="oj-rating__stars">
        {[0, 1, 2, 3, 4].map((i) => (
          <Icon key={i} name="star" size={size} style={{ opacity: i < filled ? 1 : 0.28 }} />
        ))}
      </span>
      <strong style={{ fontWeight: "var(--weight-semibold)" }}>{value.toFixed(1)}</strong>
      {count != null && <span className="oj-rating__count">({count})</span>}
    </span>
  );
}
