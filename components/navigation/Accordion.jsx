import React from "react";
import { Icon } from "../brand/Icon.jsx";

/* FAQ pattern from ojuoja.shop: numbered questions on hairline rules,
   chevron rotates on open. */
export function Accordion({ items = [], numbered = true, defaultOpen = null, className = "", ...rest }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className={`oj-accordion ${className}`} {...rest}>
      {items.map((item, i) => (
        <div key={i} className={`oj-accordion__item ${open === i ? "oj-accordion__item--open" : ""}`}>
          <button type="button" className="oj-accordion__head" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            <span>
              {numbered && <span className="oj-accordion__num">{i + 1}.</span>}
              {item.q}
            </span>
            <span className="oj-accordion__chev"><Icon name="chevron-down" size={18} /></span>
          </button>
          <div className="oj-accordion__panel">
            <div className="oj-accordion__body">{item.a}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
