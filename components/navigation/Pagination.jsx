import React from "react";
import { Icon } from "../brand/Icon.jsx";

export function Pagination({ page = 1, pages = 1, onChange, className = "", ...rest }) {
  const nums = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== "gap") nums.push("gap");
  }
  return (
    <div className={`oj-pager ${className}`} {...rest}>
      <button type="button" className="oj-pager__btn" disabled={page <= 1} onClick={() => onChange && onChange(page - 1)} aria-label="Previous page">
        <Icon name="chevron-left" size={16} />
      </button>
      {nums.map((n, i) => n === "gap"
        ? <span key={`g${i}`} className="oj-pager__gap">…</span>
        : <button key={n} type="button" className="oj-pager__btn" aria-current={n === page ? "page" : undefined} onClick={() => onChange && onChange(n)}>{n}</button>)}
      <button type="button" className="oj-pager__btn" disabled={page >= pages} onClick={() => onChange && onChange(page + 1)} aria-label="Next page">
        <Icon name="chevron-right" size={16} />
      </button>
    </div>
  );
}
