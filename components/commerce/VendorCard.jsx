import React from "react";
import { Icon } from "../brand/Icon.jsx";
import { Rating } from "../core/Rating.jsx";

export function VendorCard({ name, area, image, verified = false, rating, deliveryMins, className = "", ...rest }) {
  return (
    <article className={`oj-vendor ${className}`} {...rest}>
      <span className="oj-vendor__avatar">
        {image ? <img src={image} alt="" /> : name.slice(0, 1)}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span className="oj-vendor__name">
          {name}
          {verified && <span className="oj-vendor__verified"><Icon name="badge-check" size={14} /></span>}
        </span>
        <span className="oj-vendor__meta">
          {area && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="map-pin" size={12} />{area}</span>}
          {deliveryMins && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="bike" size={12} />{deliveryMins} mins</span>}
        </span>
      </div>
      {rating != null && <Rating value={rating} size={12} />}
    </article>
  );
}
