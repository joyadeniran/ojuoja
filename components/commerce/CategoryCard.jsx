import React from "react";
import { Button } from "../core/Button.jsx";

/* The homepage category tile: display-face title, one line of copy, a
   photo bleeding off the bottom edge, CTA overlaid on the photo. */
export function CategoryCard({ title, description, image, cta = "Explore Category", tone = "flat", onClick, className = "", ...rest }) {
  return (
    <article className={`oj-catcard ${className}`} onClick={onClick}
      style={tone === "lime" ? { background: "var(--surface-lime)" } : undefined} {...rest}>
      <div>
        <h3 className="oj-catcard__title">{title}</h3>
        {description && <p className="oj-catcard__sub">{description}</p>}
      </div>
      {image && <div className="oj-catcard__media"><img src={image} alt="" /></div>}
      <div className="oj-catcard__cta">
        <Button variant="onbrand" size="sm" badgeIcon="shopping-basket">{cta}</Button>
      </div>
    </article>
  );
}
