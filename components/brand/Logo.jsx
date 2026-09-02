import React from "react";

const assetBase = () => (typeof window !== "undefined" && window.OJUOJA_ASSET_BASE) || "assets";

const FILES = {
  "full-color": "logo.svg",
  white: "logo-white.svg",
  black: "logo-black.svg",
};
const MARK_FILES = {
  "full-color": "icon.svg",
  white: "icon-white.svg",
  black: "icon-black.svg",
};

export function Logo({ variant = "full-color", mark = false, height = 28, className = "", style, ...rest }) {
  const file = mark ? MARK_FILES[variant] : FILES[variant];
  return (
    <span className={`oj-logo ${className}`} style={{ height, ...style }} {...rest}>
      <img src={`${assetBase()}/${file}`} alt="Ojuoja" />
    </span>
  );
}
