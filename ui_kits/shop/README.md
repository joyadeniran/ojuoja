# UI kit — ojuoja.shop (web storefront)

A click-through recreation of the Ojuoja marketplace website. Open `index.html`.

## Source

Recreated from `assets/reference/homepage-landing-page.png` (the supplied "Ojuoja Homepage - Landing page" design) and the layout page of `assets/reference/Ojuoja mini-guide.pdf`. No codebase or Figma file was supplied, so only the homepage is a true recreation — the listing, product and basket screens are extrapolated from the same vocabulary and are marked as such below.

## Screens

| File | Screen | Fidelity |
| --- | --- | --- |
| `HomeScreen.jsx` | Homepage: striped lime hero, "Closer Than You Think", category row, trending grid, deals band, FAQ, vendor row, "Skip the Distance" promo | Recreated from the supplied design |
| `CategoryScreen.jsx` | Category listing with filter rail, sort, product grid, pagination | Extrapolated |
| `ProductScreen.jsx` | Product detail: lime photo stage, price, stepper, tabs, reviews, related grid | Extrapolated |
| `BasketScreen.jsx` | Basket + checkout: lines, address, payment choice, order summary, remove dialog | Extrapolated |
| `Header.jsx` / `Footer.jsx` | Sticky header with Categories pill and search; green footer with the oversized wordmark bleed | Recreated from the supplied design |

## Interactions

Add to basket from any product card (toast confirms, header count updates) · category tile → listing → product → basket · quantity steppers recompute the total · remove asks for confirmation · Place Order fires the rider toast. Everything is fake state; there is no network.

## Known gaps

The supplied homepage used lorem ipsum in its body copy. Real copy has been written in the brand's voice; treat the wording as a proposal, not as approved marketing copy.
