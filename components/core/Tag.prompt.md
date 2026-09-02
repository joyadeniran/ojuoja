One-line: a clickable filter chip; selected state fills solid green.

```jsx
<Tag icon="flame" selected>Trending</Tag>
<Tag onRemove={() => {}}>Under ₦2,000</Tag>
```

Lay chip rows out with flex + `gap: var(--space-4)`. Chips wrap; they never scroll horizontally on desktop.
