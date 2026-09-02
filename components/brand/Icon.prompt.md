One-line: renders a vendored Lucide glyph as a mask so it inherits `currentColor` — use it for every icon in Ojuoja UI.

```jsx
<Icon name="shopping-basket" size={18} />
```

Set `window.OJUOJA_ICON_BASE = "../../assets/icons"` once per page so the mask URLs resolve from wherever the page lives. Available stems are the files in `assets/icons/`; nothing else is licensed for use. Never inline hand-drawn SVG paths instead.
