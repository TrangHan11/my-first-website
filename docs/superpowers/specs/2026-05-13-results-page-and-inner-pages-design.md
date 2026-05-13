# Results Page And Inner Pages Design

## Goal

Make `results.html` visually match the approved reference screenshot, and apply a shared inner-page background style to all current non-home pages so they use `#F7EFD4` and the same top border treatment as the homepage.

## Current State

- `index.html` already has the homepage hero image and the colored top strip created with `.homepage::before`.
- `results.html` currently reuses the shared header and search panel markup but has no main content under the header.
- `shoppingcart.html`, `checkout.html`, and the product pages use similar header markup but do not yet have a shared inner-page surface design.
- `style.css` already contains shared header, icon, search panel, product card, and homepage hero styles.

## Desired Behavior

1. `index.html` keeps its current homepage-specific image background and overlay treatment.
2. All current non-home pages use a plain `#F7EFD4` page background.
3. All current non-home pages show the same top border color treatment as the homepage.
4. `results.html` displays a centered `Search Result` heading below the fixed header.
5. `results.html` shows a centered search box block under the title.
6. `results.html` shows a clickable `Filter` control aligned on the left and a results count aligned on the right.
7. `results.html` shows a three-column product grid similar to the approved screenshot.
8. The Coconut Pandan Basque Cheesecake image and name link to `product-pandan.html`.
9. The Premium Matcha Raspberry Basque Cheesecake image and name link to `product-matcha.html`.
10. Each visible results card shows an `Add to cart` button below the price.
11. The `Add to cart` button style on `results.html` matches the existing button style used in the search panel product cards.

## UI Structure

### Shared Inner Pages

All current non-home pages should share:

- a fixed header using the existing navbar structure
- a plain `#F7EFD4` page background
- a thin decorative top strip matching the homepage color sequence
- content that begins below the fixed header so it does not overlap the navbar

### Results Page

`results.html` should contain:

- the existing shared header and search panel
- a main content wrapper under the header
- a centered page title
- a centered visual search control row matching the screenshot
- a results toolbar row with a clickable `Filter` control on the left and the result count on the right
- a three-column product results grid

The results grid should initially be static placeholder content that matches the visual layout in the screenshot. The Filter control only needs to be visibly clickable for now unless additional filter behavior is requested later.

## Implementation Plan

### HTML

Update `results.html` to add:

- a page wrapper for non-home content
- a centered heading
- a visual search form area
- a results toolbar row with a clickable filter control
- a three-column product grid with product cards
- links on the pandan and matcha product images and names
- an `Add to cart` button under each visible result item

Update the other current inner pages as needed to add a shared wrapper class if the CSS needs a page-level hook.

### CSS

Update `style.css` to:

- introduce shared non-home page background styling
- reuse the homepage top border treatment for non-home pages
- add spacing for content under the fixed header
- style the results page title, search bar, toolbar, filter control, grid, cards, names, prices, and add-to-cart buttons
- keep homepage-specific background image behavior limited to `index.html`

### JavaScript

No new JavaScript is required for this design unless the existing shared search panel behavior needs to keep working on `results.html`, or unless a temporary click handler is needed for the Filter control.

## Error Handling

- Shared inner-page styles should not affect the homepage hero layout.
- The fixed header must not overlap the results content.
- The results page layout should degrade cleanly on narrower screens by wrapping or stacking rather than overflowing horizontally.
- Product links should be visually clear without breaking the screenshot-inspired layout.
- If the Filter control is implemented as a placeholder link or button, it should not navigate to a broken destination.

## Verification

Manual verification should confirm:

1. `index.html` still shows the existing homepage image background and overlay.
2. `results.html` uses a `#F7EFD4` background.
3. `shoppingcart.html`, `checkout.html`, and the current product pages use a `#F7EFD4` background.
4. The top decorative strip on non-home pages matches the homepage color treatment.
5. The `results.html` heading, search bar, results count, and grid visually resemble the approved screenshot.
6. The `Filter` control appears clickable.
7. Clicking the pandan image or name opens `product-pandan.html`.
8. Clicking the matcha image or name opens `product-matcha.html`.
9. Each visible results item shows an `Add to cart` button styled like the search panel button.
10. The navbar remains aligned and usable on `results.html`.
11. The search panel still opens from the header on `results.html`.

## Scope

This change covers visual layout and shared styling for the current inner pages plus the static structure of `results.html`, including clickable product links and visible add-to-cart actions. It does not add real results filtering, product sorting, cart logic, or backend-driven search.
