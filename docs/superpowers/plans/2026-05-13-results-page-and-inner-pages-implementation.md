# Results Page And Inner Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a screenshot-matching `results.html` page and apply shared `#F7EFD4` inner-page styling, clickable product links, and add-to-cart buttons across the current non-home pages.

**Architecture:** Keep the existing static multi-page HTML structure and shared `style.css`/`script.js` setup. Add one shared body class for non-home pages so `style.css` can provide the common beige background and top strip, then build the results-page layout directly in `results.html` with static product cards that link to their product pages. Reuse the existing search panel button styling for the new add-to-cart actions instead of inventing a second button pattern.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, browser manual verification

---

## File Structure

- Modify: `results.html`
  - Add the page body class, shared header cart markup if needed, and the full results-page content under the fixed navbar.
- Modify: `shoppingcart.html`
  - Add the shared inner-page body class so it gets the beige background and decorative top strip.
- Modify: `checkout.html`
  - Add the shared inner-page body class so it gets the beige background and decorative top strip.
- Modify: `product-matcha.html`
  - Add the shared inner-page body class and preserve any existing product-page content.
- Modify: `product-pandan.html`
  - If the file is still effectively empty, create a minimal inner-page shell; otherwise add the shared inner-page body class and preserve any existing content.
- Modify: `style.css`
  - Add shared inner-page styling plus results-page-specific layout, typography, grid, link, and button styles.

### Task 1: Add Shared Inner-Page Hooks

**Files:**
- Modify: `results.html`
- Modify: `shoppingcart.html`
- Modify: `checkout.html`
- Modify: `product-matcha.html`
- Modify: `product-pandan.html`

- [ ] **Step 1: Add the shared body class to `results.html`**

```html
<body class="inner-page">
```

- [ ] **Step 2: Add the same shared body class to `shoppingcart.html`**

```html
<body class="inner-page">
```

- [ ] **Step 3: Add the same shared body class to `checkout.html`**

```html
<body class="inner-page">
```

- [ ] **Step 4: Add the same shared body class to `product-matcha.html`**

```html
<body class="inner-page">
```

- [ ] **Step 5: Add the same shared body class to `product-pandan.html`**

```html
<body class="inner-page">
```

- [ ] **Step 6: If `product-pandan.html` is still empty, create a minimal shell before adding the shared class**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coconut Pandan Basque Cheesecake</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="inner-page">
    <main class="inner-page__content">
        <h1>Coconut Pandan Basque Cheesecake</h1>
    </main>
</body>
</html>
```

- [ ] **Step 7: Save the edited HTML files and refresh each page**

Run:
1. Open `results.html`
2. Open `shoppingcart.html`
3. Open `checkout.html`
4. Open `product-matcha.html`
5. Open `product-pandan.html`

Expected: All five pages still render without broken markup before the shared CSS is added, and `product-pandan.html` is no longer blank

### Task 2: Add Shared Inner-Page Styling

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Add the shared beige page surface for non-home pages**

```css
.inner-page {
    margin: 0;
    min-height: 100vh;
    background: #F7EFD4;
}
```

- [ ] **Step 2: Add the decorative top strip for non-home pages**

```css
.inner-page::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 90px;
    background: linear-gradient(
        to bottom,
        #989279 0 82px,
        #f3e7a1 82px 86px,
        #0a5201 86px 90px
    );
    z-index: 1;
}

.inner-page .navbar {
    position: fixed;
}
```

- [ ] **Step 3: Add a reusable wrapper for content below the fixed navbar**

```css
.inner-page__content {
    position: relative;
    z-index: 0;
    padding: 140px 42px 48px;
    box-sizing: border-box;
}
```

- [ ] **Step 4: Refresh one non-home page and verify the shared background treatment**

Run: refresh `results.html`
Expected: The page background is `#F7EFD4`, the top strip matches the homepage colors, and the navbar stays visible above the content area

### Task 3: Build The Results Page Structure

**Files:**
- Modify: `results.html`

- [ ] **Step 1: Add a main wrapper, title, search row, toolbar, and product grid below the header**

```html
<main class="inner-page__content results-page">
    <h1 class="results-page__title">Search Result</h1>

    <div class="results-page__search">
        <label class="results-page__search-label" for="results-search-input">Search</label>
        <div class="results-page__search-box">
            <input id="results-search-input" class="results-page__search-input" type="text" value="Cheese">
            <button class="results-page__clear-btn" type="button" aria-label="Clear search">
                <img src="icon/icon--close.svg" alt="">
            </button>
            <button class="results-page__submit-btn" type="button" aria-label="Search results">
                <img src="icon/symbol--search.svg" alt="">
            </button>
        </div>
    </div>

    <div class="results-page__toolbar">
        <button class="results-page__filter-btn" type="button">Filter</button>
        <p class="results-page__count">5 results</p>
    </div>

    <section class="results-grid" aria-label="Search results products">
        <article class="results-card">
            <a class="results-card__image-link" href="product-pandan.html">
                <img src="img/pandan cc.webp" alt="Coconut Pandan Basque Cheesecake">
            </a>
            <a class="results-card__name-link" href="product-pandan.html">Coconut Pandan Basque Cheesecake</a>
            <p class="results-card__price">A$14.90 - A$119.90</p>
            <button class="results-card__cart-btn" type="button">Add to cart</button>
        </article>

        <article class="results-card">
            <a class="results-card__image-link" href="product-matcha.html">
                <img src="img/straw matcha cc.webp" alt="Premium Matcha Raspberry Basque Cheesecake">
            </a>
            <a class="results-card__name-link" href="product-matcha.html">Premium Matcha Raspberry Basque Cheesecake</a>
            <p class="results-card__price">A$16.90 - A$149.90</p>
            <button class="results-card__cart-btn" type="button">Add to cart</button>
        </article>

        <article class="results-card">
            <a class="results-card__image-link" href="results.html">
                <img src="img/bg.webp" alt="Thai Milk Tea Basque Cheesecake">
            </a>
            <a class="results-card__name-link" href="results.html">Thai Milk Tea Basque Cheesecake</a>
            <p class="results-card__price">A$14.90 - A$119.90</p>
            <button class="results-card__cart-btn" type="button">Add to cart</button>
        </article>
    </section>
</main>
```

- [ ] **Step 2: Keep the existing shared search panel markup above the new main content**

```html
<header class="navbar">
    <!-- existing logo, search icon, search panel, cart icon, and menu button -->
</header>

<main class="inner-page__content results-page">
    <!-- new results content -->
</main>
```

- [ ] **Step 3: Save `results.html` and refresh the page**

Run: refresh `results.html`
Expected: The page now shows the title, search box, toolbar, and three product cards below the fixed header

### Task 4: Style The Results Page To Match The Approved Layout

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Add results page title and centered search area styles**

```css
.results-page {
    max-width: 1280px;
    margin: 0 auto;
}

.results-page__title {
    margin: 0 0 18px;
    text-align: center;
    font-size: 52px;
    font-family: Noto serif, serif;
    color: #2a1f14;
}

.results-page__search {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-bottom: 42px;
}
```

- [ ] **Step 2: Add the results search box and toolbar styles**

```css
.results-page__search-label {
    width: min(100%, 360px);
    color: #2a1f14;
    font-size: 24px;
    font-family: Suranna, serif;
}

.results-page__search-box {
    display: flex;
    align-items: center;
    width: min(100%, 360px);
    border: 1px solid #6f664f;
    border-radius: 12px;
    overflow: hidden;
    background: transparent;
}

.results-page__search-input {
    flex: 1;
    min-width: 0;
    border: none;
    padding: 14px 16px;
    background: transparent;
    font-size: 22px;
    color: #9d3722;
    font-family: Noto serif, serif;
}

.results-page__search-input:focus {
    outline: none;
}

.results-page__clear-btn,
.results-page__submit-btn,
.results-page__filter-btn {
    background: none;
    border: none;
    cursor: pointer;
}

.results-page__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
}
```

- [ ] **Step 3: Add product grid, links, prices, and add-to-cart button styles**

```css
.results-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 40px;
}

.results-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.results-card__image-link,
.results-card__name-link {
    color: inherit;
    text-decoration: none;
}

.results-card__image-link img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border: 1px solid #b9ac7b;
}

.results-card__name-link {
    margin-top: 12px;
    font-size: 26px;
    line-height: 1.3;
    font-family: Noto serif, serif;
    color: #2a1f14;
}

.results-card__price {
    margin: 8px 0 12px;
    color: #9d3722;
    font-family: Suranna, serif;
    font-size: 32px;
    line-height: 1;
}

.results-card__cart-btn {
    padding: 4px 12px;
    border: 2px solid #0a5201;
    border-radius: 8px;
    background: #fff6cc;
    color: #0a5201;
    font-family: Suranna, serif;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
}
```

- [ ] **Step 4: Add responsive behavior so the layout wraps cleanly on smaller screens**

```css
@media screen and (max-width: 900px) {
    .results-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media screen and (max-width: 600px) {
    .inner-page__content {
        padding: 130px 20px 36px;
    }

    .results-page__title {
        font-size: 40px;
    }

    .results-grid {
        grid-template-columns: 1fr;
        gap: 28px;
    }

    .results-page__toolbar {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }
}
```

- [ ] **Step 5: Refresh `results.html` and visually compare it with the approved screenshot**

Run: refresh `results.html`
Expected: The page background, top strip, centered title, search control, filter row, and product grid are close to the approved reference and do not overlap the fixed navbar

### Task 5: Final Verification

**Files:**
- Modify: `results.html`
- Modify: `shoppingcart.html`
- Modify: `checkout.html`
- Modify: `product-matcha.html`
- Modify: `product-pandan.html`
- Modify: `style.css`

- [ ] **Step 1: Manually verify the shared inner-page background on all current non-home pages**

Run:
1. Open `results.html`
2. Open `shoppingcart.html`
3. Open `checkout.html`
4. Open `product-matcha.html`
5. Open `product-pandan.html`

Expected: Each page uses `#F7EFD4` and the same decorative top strip colors as the homepage

- [ ] **Step 2: Manually verify the clickable results-page controls**

Run:
1. Open `results.html`
2. Click the `Filter` control
3. Click the pandan image
4. Click the pandan name
5. Click the matcha image
6. Click the matcha name

Expected:
- The Filter control looks clickable and does not break the page
- Pandan links open `product-pandan.html`
- Matcha links open `product-matcha.html`

- [ ] **Step 3: Confirm the results cards show add-to-cart buttons**

Run: open `results.html` and inspect all visible cards
Expected: Each visible result card shows an `Add to cart` button styled like the search panel product card button

- [ ] **Step 4: Check editor diagnostics on the edited files**

Run: inspect diagnostics for `results.html`, `shoppingcart.html`, `checkout.html`, `product-matcha.html`, `product-pandan.html`, and `style.css`
Expected: No new syntax or lint errors are reported
