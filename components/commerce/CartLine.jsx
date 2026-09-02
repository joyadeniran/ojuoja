import React from "react";
import { Icon } from "../brand/Icon.jsx";
import { QuantityStepper } from "../forms/QuantityStepper.jsx";

const naira = (n) => "₦" + Number(n).toLocaleString("en-NG");

export function CartLine({ name, vendor, image, price, qty = 1, unit, onQty, onRemove, className = "", ...rest }) {
  return (
    <div className={`oj-cartline ${className}`} {...rest}>
      <span className="oj-cartline__thumb">{image && <img src={image} alt="" />}</span>
      <div className="oj-cartline__main">
        <div className="oj-cartline__name">{name}</div>
        {vendor && <div className="oj-cartline__vendor">{vendor}</div>}
      </div>
      <QuantityStepper value={qty} unit={unit} onChange={onQty} />
      <span className="oj-cartline__price">{naira(price * qty)}</span>
      <button type="button" className="oj-cartline__remove" aria-label={`Remove ${name}`} onClick={onRemove}>
        <Icon name="trash-2" size={16} />
      </button>
    </div>
  );
}
