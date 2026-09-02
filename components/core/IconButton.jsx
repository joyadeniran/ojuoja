import React from "react";
import { Icon } from "../brand/Icon.jsx";

export function IconButton({ icon, variant = "plain", size = "md", count, label, className = "", ...rest }) {
  const cls = ["oj-iconbtn", variant !== "plain" && `oj-iconbtn--${variant}`, size !== "md" && `oj-iconbtn--${size}`, className].filter(Boolean).join(" ");
  return (
    <button type="button" aria-label={label} className={cls} style={{ position: "relative" }} {...rest}>
      <Icon name={icon} size={size === "sm" ? 16 : size === "lg" ? 22 : 18} />
      {count > 0 && <span className="oj-iconbtn__count">{count}</span>}
    </button>
  );
}
