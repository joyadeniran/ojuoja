import React from "react";

export function Card({ tone = "default", raised = false, interactive = false, padded = true, children, className = "", as: Tag = "div", ...rest }) {
  const cls = ["oj-card", tone !== "default" && `oj-card--${tone}`, raised && "oj-card--raised", interactive && "oj-card--interactive", className].filter(Boolean).join(" ");
  return (
    <Tag className={cls} {...rest}>
      {padded ? <div className="oj-card__body">{children}</div> : children}
    </Tag>
  );
}
