One-line: interrupts to confirm something destructive or to collect one short answer.

```jsx
<Dialog title="Remove this item?" footer={<><Button variant="ghost">Keep it</Button><Button variant="danger">Remove</Button></>} onClose={close}>
  Ijebu garri will be removed from your basket.
</Dialog>
```

The scrim's parent must be `position: relative` (it is absolutely positioned, so it can be demoed inside a frame). Primary action sits on the right.
