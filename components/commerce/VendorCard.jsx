import React from "react";
import { Icon } from "../brand/Icon.jsx";
import { Rating } from "../core/Rating.jsx";

export function VendorCard({ name, area, image, verified = false, rating, deliveryMins, className = "", style, ...rest }) {
  return (
    <article className={`oj-vendor ${className}`} style={style} {...rest}>
      <span className="oj-vendor__avatar">
        {image ? <img src={image} alt="" /> : name.slice(0, 1)}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, maxWidth: "100%", flexWrap: "wrap" }}>
          <span className="oj-vendor__name" style={{ margin: 0 }}>
            {name}
          </span>
          {verified && (
            <span className="oj-vendor__verified" title="Verified Ojuoja Vendor">
              <Icon name="badge-check" size={16} />
            </span>
          )}
        </div>
        <div className="oj-vendor__meta">
          {area && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="map-pin" size={12} />{area}</span>}
          {deliveryMins && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="bike" size={12} />{deliveryMins} mins</span>}
        </div>
      </div>
      {rating != null && <Rating value={rating} size={12} />}
    </article>
  );
}
