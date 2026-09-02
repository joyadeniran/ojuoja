# Ojuoja Design System

Ojuoja is an online marketplace in **Ikorodu, Lagos State, Nigeria** — food, snacks, groceries and drinks from local vendors, verified by the platform and delivered to the buyer. The proposition, in the brand's own words: *"From hidden local gems to your daily essentials, discover the best of Ikorodu's vendors, delivered straight to you."* The site is `www.ojuoja.shop`.

"Ojuoja" is Yoruba — *ojú ọjà*, the face of the market. The mark keeps the Yoruba dot under the ọ and paints it brand yellow; that dot is the brand's smallest signature.

This design system was built for the redesign of ojuoja.shop.

## Sources used

Everything here derives from two supplied files. There was **no codebase and no Figma file**, so component inventory and all screens beyond the homepage are extrapolated from the brand vocabulary rather than recreated from source.

| Source | What it gave us | Kept at |
| --- | --- | --- |
| `Ojuoja Brand guide and Assets.zip` — 10-page mini-guide PDF + SVG/PNG logo, icon and pattern artwork | Logo lockups, brand mark, brand pattern, the four-colour palette with exact CMYK/RGB/HEX, the two typefaces (Avigea display, Gilroy body), one layout page | `assets/`, `assets/reference/Ojuoja mini-guide.pdf` |
| `Ojuoja Homepage - Landing page.png` | The homepage design: hero, category row, deals band, FAQ, promo block, footer; working greens, lime hero field, radii, control shapes, photography treatment | `assets/reference/homepage-landing-page.png` |

Product photography in `assets/photography/` was cropped out of that homepage design — it is the brand's own imagery, not stock we introduced.

---

## Content fundamentals

**Voice.** Warm, plain, local, and specific. Ojuoja talks like a neighbour who knows the market, not like a logistics company. Headlines are short and conversational: *"Your Next Craving is Just Around the Corner."*, *"Closer Than You Think"*, *"Skip the Distance, Find the Flavor"*. Note the pattern — a promise about **distance and proximity**, phrased as an everyday sentence, punctuated with a full stop.

**Person.** Second person for the buyer ("*your* basket", "delivered straight to *you*"), never "we" as a subject unless describing platform work ("every shop is checked by hand"). Never first-person singular.

**Casing.** Headlines are Title Case, and they are the only place Title Case appears. Buttons are sentence case with an exclamation on the house CTA — the live site says **"Shop Now!"**, and that exclamation mark is part of the brand, not an accident. Labels, form fields, checkbox text, FAQ questions: sentence case. Overlines are the single exception — uppercase, tracked +0.09em, 11px.

**Specificity is the rule.** Wherever a generic word would do, Ojuoja names the thing: not "search products" but *"Search for akara, suli kuli or corn"*; not "fast delivery" but *"35–60 mins"*; not "Lagos" but *"Ita Elewa"*, *"Agric"*, *"Sabo"*, *"Igbogbo"*. Prices are always naira, always with ₦, always with thousands separators, never with decimals: **₦1,800**.

**Length.** Headlines two to four words per line, broken manually across two or three short lines. Supporting paragraphs one or two sentences, under 30 words. FAQ answers under 40 words. Button labels one to three words.

**Emoji: never.** Not in UI, not in marketing copy. The icon set and the brand yellow do that job. Unicode is used only for ₦ and the standard ellipsis in truncation.

**Words we use / avoid.** Use: vendor, basket, rider, verified, area, market, fresh. Avoid: cart (it is a *basket*), merchant, SKU, seamless, revolutionise, "your one-stop shop", any phrase promising more than an actual delivery window.

---

## Visual foundations

**Colour.** Four inks come from the guide: green `#00B737`, yellow `#FFAB00`, brown `#AD7A4A`, red `#FF0000`. In product the working green is the slightly deeper `#009245` (`--oj-green-700`) used for buttons, section headings and the footer, with `#084525` (`--oj-green-900`) as headline ink on light fields. The signature surface is not white but **lime/chartreuse** — `#F3FFC3` with `#FAFFE5` stripes — carried behind the hero and any promo panel. Yellow is an accent only: the logo dot, ratings, offer badges. Brown is market warmth in promo blocks. Red is reserved for price cuts and errors; it is never a UI colour. Neutrals are cool greys with `#F6F7F7` as the default card surface. **Maximum two background colours per page** beyond white: green and lime.

**Type.** Two faces, no third. **Avigea** (display serif) sets every headline — heavy, warm, tight, `-0.015em` tracking, `1.02–1.12` leading, always in green. **Gilroy** (geometric sans) sets everything else — UI, body, labels, prices. Body sizes 17/15/13/12; display 80/64/52/40/32. Avigea is now self-hosted from the supplied `assets/fonts/avigea.ttf` (one weight; heavier headline weights are synthesised, so set display type at 400 and let size carry the emphasis). Gilroy has not been supplied and falls back to **Poppins**.

**Backgrounds.** Three treatments and no others: white, a flat green field, or the striped lime field. The stripe is the brand pattern reduced to a tonal texture — flat vertical bars of uneven width, no gradients anywhere. The full-colour bar run (red/green/yellow/brown) appears only as a decorative promo backdrop with a solid green block laid over it. There are **no gradients** in this system, and no drop-shadowed hero art.

**Photography.** Cut-out produce and prepared food, warm and highly saturated, shot on white and dropped onto the lime or green field so the produce reads as the only texture on the page. Never black-and-white, never grainy, never cool-toned, never people's faces — hands and product only, as in the hero.

**Corner radii.** Anything you click is a pill (999px): buttons, chips, inputs, search, pagination. Anything holding content is 12–16px. Sheets and modals 24–32px. Full-bleed image bands are square. Icon-only buttons are always circles.

**Cards.** A card gets a hairline `#E4E6E5` border **or** a shadow, never both — `raised` drops the border. 16px radius, white or `#F6F7F7`. No coloured left borders, ever. Category tiles are the one exception to tidy containment: the photo bleeds off the bottom edge and the CTA sits over it.

**Shadows.** Tinted with the deep brand green, never neutral black: `0 8px 20px rgba(8,69,37,.08)` at the card level, `0 20px 44px rgba(8,69,37,.10)` for overlays. Shadows are for elevation only, never for decoration. Inner shadows are not used; a hairline border does that job.

**Transparency and blur.** Sparingly, and only for two jobs: the modal scrim (deep green at 48% with a 2px blur) and the white-at-92% favourite button that sits over product photography. Text over photography uses a bottom scrim (`--scrim-bottom`), not a blur panel. Frosted-glass panels are not part of this brand.

**Animation.** Short and flat. 140ms for control state changes, 200ms for card hovers, 320ms for accordion panels, 460ms for page-level entrances, all on `cubic-bezier(.2,.8,.3,1)`. Cards lift `-2px` on hover; product photos scale to 1.04. **Nothing bounces, nothing springs, nothing loops.** No parallax, no scroll-jacking, no entrance animations on marketing sections.

**Hover / press / focus / disabled.** Hover darkens the fill one step (green-700 → green-800) or tints the ghost with green-50; it never lightens and never changes opacity. Press shrinks to `scale(0.97)`. Focus is a 3px green ring at 28% (`--focus-ring`), never a browser outline. Disabled is `opacity: .42` with the press transform removed.

**Layout.** A 1140px content column inside a 1440 frame, 32px page padding, 24px grid gap, 96px between sections. The header is sticky, 76px tall, white with a hairline bottom border; nothing else is fixed. Product grids are four across on desktop, three in a filtered listing, three for category tiles. Section headings sit left; only the closing FAQ and deals blocks centre.

**Iconography** — see below.

---

## Iconography

The supplied assets contain **no icon set** — only the logo, the brand mark and the pattern. The homepage design uses thin, rounded-cap line icons (search, grid, chevron, basket).

**Substitution flagged:** the system vendors **[Lucide](https://lucide.dev)** (1.5px stroke, round caps, 24px grid) into `assets/icons/` as the closest match to that drawing style — 36 glyphs covering the marketplace's needs. This is our choice, not the brand's; if Ojuoja owns an icon library, replace the files in `assets/icons/` and nothing else changes.

Icons are painted as CSS masks by the `Icon` component so they inherit `currentColor` — that is the only sanctioned way to render one. Rules:

- Sizes 16 (dense), 18 (default), 22–26 (headers, empty states). Never below 14.
- Icons take the text colour of their context; the only "coloured" icon is a star in `Rating` (brand yellow) and the basket inside a button badge (green on white).
- The trailing white circle on a primary button holds `shopping-basket` — that lockup is the brand's CTA tell.
- No PNG icons, no icon fonts, no emoji, no Unicode glyphs standing in for icons, and never a hand-drawn SVG path written inline.

Set `window.OJUOJA_ICON_BASE` (and `OJUOJA_ASSET_BASE` for logos) once per page to the relative path of `assets/`.

---

## Index

| Path | What it is |
| --- | --- |
| `styles.css` | The single entry point. Nothing but `@import` lines — link this one file. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `patterns.css`, `base.css` |
| `components/` | React primitives, grouped; `components.css` carries their styling |
| `guidelines/` | 24 foundation specimen cards (Colors, Type, Spacing, Effects, Brand) |
| `ui_kits/shop/` | Click-through recreation of the ojuoja.shop storefront — see its own README |
| `assets/` | `logo*.svg`, `icon*.svg`, `pattern-*.svg`, 4× PNGs, `icons/` (36 Lucide glyphs), `photography/`, `reference/` |
| `thumbnail.html` | The system's tile |
| `SKILL.md` | Agent-skill front matter for use outside this project |

### Components

**Brand** — `Logo`, `Icon`, `PatternPanel`
**Core** — `Button`, `IconButton`, `Badge`, `Tag`, `Card`, `SectionHeading`, `Rating`
**Forms** — `Input`, `SearchField`, `Select`, `Checkbox`, `Switch`, `QuantityStepper`
**Navigation** — `Tabs`, `Accordion`, `Breadcrumb`, `Pagination`
**Feedback** — `Toast`, `Dialog`, `EmptyState`
**Commerce** — `ProductCard`, `CategoryCard`, `VendorCard`, `CartLine`, `DeliveryNote`

Each component directory holds `<Name>.jsx`, `<Name>.d.ts` (props contract), `<Name>.prompt.md` (when to use it) and one `@dsCard` HTML showing its states.

### Intentional additions

No source defined a component inventory, so the set above is a standard marketplace kit rather than a copy of an existing library. Three entries deserve naming as deliberate additions:

- **`Icon`** — a wrapper for the vendored Lucide set, so glyph rendering has one sanctioned path.
- **`PatternPanel`** — the brand pattern is artwork in the guide, not a component; making it one keeps the stripe fields consistent.
- **`SectionHeading`** — encodes the manually-broken short-line headline rule, which is the easiest part of this brand to get wrong.

`Checkbox` covers radios via a `radio` prop rather than shipping a separate `Radio`. There is no `Tooltip`: nothing in the supplied material uses one.

---

## Caveats

**Avigea is wired; Gilroy is still substituted.** Avigea is self-hosted from `assets/fonts/avigea.ttf`, supplied as a single weight — the `@font-face` claims 400–900 so headings still work, but bold display type is browser-synthesised rather than a real bold cut. Send the other Avigea weights if they exist. Gilroy is a licensed retail font and was not supplied; `--font-body` names it first and falls back to **Poppins**, which is rounder and wider. Drop a `Gilroy` `.woff2` in `assets/fonts/`, add its `@font-face` to `tokens/fonts.css`, and every card, component and screen switches over with no other change.

**Icons are substituted** — Lucide, as described above.

**Avigea ships as a `.ttf`, not `.woff2`.** It works everywhere, but a `.woff2` would be roughly half the transfer size.

**One screen was designed, four are shown.** Only the homepage came from a real design. The listing, product and basket screens follow the same rules but are our proposals.
