import React from "react";

export function SectionHeading({ title, eyebrow, subtitle, align = "left", tone = "brand", level = 2, action, className = "", ...rest }) {
  const Tag = `h${level}`;
  const cls = ["oj-sechead", align === "center" && "oj-sechead--center", tone !== "brand" && `oj-sechead--${tone}`, className].filter(Boolean).join(" ");
  return (
    <div className={cls} {...rest}>
      {eyebrow && <span className="oj-sechead__eyebrow">{eyebrow}</span>}
      <Tag className="oj-sechead__title">{title}</Tag>
      {subtitle && <p className="oj-sechead__sub">{subtitle}</p>}
      {action}
    </div>
  );
}
