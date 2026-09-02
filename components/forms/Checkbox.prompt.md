One-line: multi-select control for filters and consent; `radio` for mutually exclusive choices.

```jsx
<Checkbox checked={a} onChange={setA}>Verified vendors only</Checkbox>
<Checkbox radio checked={pay === "cash"} onChange={() => setPay("cash")}>Cash on delivery</Checkbox>
```

Stack with `gap: var(--space-5)`. Labels are sentence case, never title case.
