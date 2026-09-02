import React from "react";

/* Ojuoja has no proprietary icon font. The set is Lucide (1.5px stroke,
   round caps), vendored to assets/icons. Icons are painted with a CSS mask
   so they inherit currentColor. */
const iconBase = () => (typeof window !== "undefined" && window.OJUOJA_ICON_BASE) || "assets/icons";

export function Icon({ name, size = 18, strokeAware = true, className = "", style, ...rest }) {
  const url = `url("${iconBase()}/${name}.svg")`;
  return (
    <span
      aria-hidden="true"
      className={`oj-icon ${className}`}
      style={{ width: size, height: size, WebkitMaskImage: url, maskImage: url, ...style }}
      {...rest}
    />
  );
}
