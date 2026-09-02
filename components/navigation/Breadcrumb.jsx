import React from "react";
import { Icon } from "../brand/Icon.jsx";

export function Breadcrumb({ items = [], className = "", ...rest }) {
  return (
    <nav className={`oj-crumbs ${className}`} {...rest}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="oj-crumbs__sep"><Icon name="chevron-right" size={13} /></span>}
          {i === items.length - 1
            ? <span className="oj-crumbs__current">{it.label}</span>
            : <a href={it.href || "#"}>{it.label}</a>}
        </React.Fragment>
      ))}
    </nav>
  );
}
