import React from "react";
import { Icon } from "../brand/Icon.jsx";
import { Badge } from "../core/Badge.jsx";
import { IconButton } from "../core/IconButton.jsx";
import { Rating } from "../core/Rating.jsx";

const naira = (n) => "₦" + Number(n).toLocaleString("en-NG");

export function ProductCard({ name, price, was, image, vendor, verified = false, rating, flag, favourite = false, onFavourite, onAdd, className = "", ...rest }) {
  return (
    <article className={`oj-product ${className}`} {...rest}>
      <div className="oj-product__media">
        {image && <img src={image} alt={name} />}
        {flag && <div className="oj-product__flags"><Badge tone={flag.tone || "danger"}>{flag.label}</Badge></div>}
        <button type="button" aria-label="Save" onClick={onFavourite}
          className={`oj-product__fav ${favourite ? "oj-product__fav--on" : ""}`}>
          <Icon name="heart" size={16} />
        </button>
      </div>
      <div className="oj-product__body">
        {vendor && (
          <span className="oj-product__vendor">
            {vendor}
            {verified && <span className="oj-vendor__verified"><Icon name="badge-check" size={12} /></span>}
          </span>
        )}
        <span className="oj-product__name">{name}</span>
        {rating != null && <Rating value={rating} size={12} />}
        <div className="oj-product__row">
          <span>
            <span className="oj-product__price">{naira(price)}</span>
            {was && <span className="oj-product__was">{naira(was)}</span>}
          </span>
          <IconButton icon="plus" variant="solid" size="sm" label={`Add ${name} to basket`} onClick={onAdd} />
        </div>
      </div>
    </article>
  );
}
