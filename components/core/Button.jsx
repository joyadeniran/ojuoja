import React from "react";
import { Icon } from "../brand/Icon.jsx";

/* The signature Ojuoja button: a green pill whose trailing icon sits in a
   white circle, lifted straight from the "Shop Now!" CTA on ojuoja.shop. */
export function Button({
  variant = "primary",
  size = "md",
  badgeIcon,
  leadingIcon,
  block = false,
  as: Tag = "button",
  children,
  className = "",
  ...rest
}) {
  const cls = [
    "oj-btn",
    `oj-btn--${variant}`,
    size !== "md" && `oj-btn--${size}`,
    block && "oj-btn--block",
    badgeIcon && "oj-btn--hasbadge",
    className,
  ].filter(Boolean).join(" ");
  return (
    <Tag className={cls} {...rest}>
      {leadingIcon && <Icon name={leadingIcon} size={size === "lg" ? 18 : 16} />}
      <span>{children}</span>
      {badgeIcon && (
        <span className="oj-btn__badge">
          <Icon name={badgeIcon} size={size === "lg" ? 20 : 16} />
        </span>
      )}
    </Tag>
  );
}
