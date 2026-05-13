# Search Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add autocomplete suggestions to the homepage search panel and send the user to `results.html?q=<query>` when they press Enter, click the inner search icon, or click a suggestion.

**Architecture:** Keep the site as a single static HTML page with no build tooling. Update the existing search panel markup in `index.html`, style the suggestion list in `style.css`, and extend `script.js` with a small in-memory keyword list plus DOM event handlers for suggestion rendering and query navigation.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript

---

## File Structure

- Modify: `index.html`
  - Give the inner search button a stable ID and convert the single suggestion placeholder into a container that JavaScript can replace with matching suggestions.
- Modify: `style.css`
  - Add styles for clickable suggestion buttons and an empty suggestion message while preserving the current panel layout.
- Modify: `script.js`
  - Keep the existing open/close behavior, add helper functions for query normalization and URL building, render matching suggestions from a hardcoded list, and navigate to `results.html`.

### Task 1: Update Search Panel Markup

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add a stable ID to the inner search button and replace the static suggestion text with a container**

```html
<div class="search-top">
    <input id="search-input" type="text" placeholder="Search" class="search-input" aria-label="Search">

    <button id="search-submit" class="panel-icon-btn" type="button" aria-label="Search products">
        <img src="icon/symbol--search.svg" alt="">
    </button>

    <button id="close-search" class="close-btn panel-icon-btn" type="button" aria-label="Close search">
        <img src="icon/icon--close.svg" alt="">
    </button>
</div>

<div id="search-results" class="search-results" hidden>
    <div class="search-results__section">
        <h2>Suggestions</h2>
        <div id="suggestions-list" class="suggestions-list"></div>
    </div>

    <div class="search-results__section">
        <h2>Products</h2>

        <article class="product-card">
            <img src="img/pandan cc.webp" alt="Coconut Pandan Basque Cheesecake">
            <div class="product-card__content">
                <h3>Coconut Pandan Basque Cheesecake</h3>
                <p>A$14.90 - A$119.90</p>
                <button type="button">Add to cart</button>
            </div>
        </article>

        <article class="product-card">
            <img src="img/straw matcha cc.webp" alt="Premium Matcha Raspberry Basque Cheesecake">
            <div class="product-card__content">
                <h3>Premium Matcha Raspberry Basque Cheesecake</h3>
                <p>A$16.90 - A$149.90</p>
                <button type="button">Add to cart</button>
            </div>
        </article>
    </div>
</div>
```

- [ ] **Step 2: Save `index.html` and refresh the page to verify the homepage still renders**

Run: open or refresh `index.html` in the browser
Expected: The homepage still loads, the navbar remains visible, and the search panel markup does not break the page before interaction

### Task 2: Add Suggestion Styles

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Add styles for the JavaScript-rendered suggestion list**

```css
.suggestions-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}

.search-results__suggestion {
    border: none;
    padding: 0;
    background: transparent;
    color: #9d3722;
    font-size: 18px;
    font-family: Suranna;
    text-align: left;
    cursor: pointer;
}

.search-results__suggestion:hover,
.search-results__suggestion:focus-visible {
    text-decoration: underline;
    outline: none;
}

.search-results__empty {
    margin: 0;
    color: #6f664f;
    font-size: 16px;
    font-family: Suranna;
}
```

- [ ] **Step 2: Refresh the page and confirm the panel still keeps its current layout**

Run: refresh the open browser tab
Expected: The page looks unchanged before opening the panel, and no existing panel styles are visually broken

### Task 3: Add Suggestion Rendering and Search Navigation

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Replace the current script with guarded DOM lookups plus helper functions for matching and navigation**

```js
const searchBtn = document.getElementById("search-icon");
const searchPanel = document.getElementById("search-panel");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const suggestionsList = document.getElementById("suggestions-list");
const searchSubmit = document.getElementById("search-submit");
const closeBtn = document.getElementById("close-search");

const suggestionKeywords = [
    "cheesecake",
    "coconut pandan cheesecake",
    "matcha",
    "premium matcha raspberry basque cheesecake",
    "raspberry cheesecake",
];

if (
    searchBtn &&
    searchPanel &&
    searchInput &&
    searchResults &&
    suggestionsList &&
    searchSubmit &&
    closeBtn
) {
    const normalizeQuery = (value) => value.trim().toLowerCase();

    const buildResultsUrl = (query) => `results.html?q=${encodeURIComponent(query)}`;

    const getMatchingSuggestions = (query) => {
        const normalizedQuery = normalizeQuery(query);

        if (!normalizedQuery) {
            return [];
        }

        return suggestionKeywords.filter((keyword) =>
            keyword.toLowerCase().includes(normalizedQuery)
        );
    };

    const renderSuggestions = (matches) => {
        suggestionsList.innerHTML = "";

        if (matches.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "search-results__empty";
            emptyMessage.textContent = "No suggestions found.";
            suggestionsList.appendChild(emptyMessage);
            return;
        }

        matches.forEach((match) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "search-results__suggestion";
            button.dataset.query = match;
            button.textContent = match;
            suggestionsList.appendChild(button);
        });
    };

    const updateSearchResults = () => {
        const query = searchInput.value.trim();
        const hasQuery = query.length > 0;

        searchResults.hidden = !hasQuery;

        if (!hasQuery) {
            suggestionsList.innerHTML = "";
            return;
        }

        renderSuggestions(getMatchingSuggestions(query));
    };

    const goToResultsPage = (query) => {
        const normalizedQuery = query.trim();

        if (!normalizedQuery) {
            return;
        }

        window.location.href = buildResultsUrl(normalizedQuery);
    };

    const resetSearchPanel = () => {
        searchInput.value = "";
        suggestionsList.innerHTML = "";
        searchResults.hidden = true;
        searchPanel.classList.remove("show");
        searchPanel.setAttribute("aria-hidden", "true");
    };

    searchBtn.addEventListener("click", () => {
        searchPanel.classList.add("show");
        searchPanel.setAttribute("aria-hidden", "false");
        searchInput.focus();
        updateSearchResults();
    });

    closeBtn.addEventListener("click", resetSearchPanel);
    searchInput.addEventListener("input", updateSearchResults);
    searchSubmit.addEventListener("click", () => goToResultsPage(searchInput.value));

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            goToResultsPage(searchInput.value);
        }
    });

    suggestionsList.addEventListener("click", (event) => {
        const target = event.target;

        if (!(target instanceof HTMLButtonElement)) {
            return;
        }

        goToResultsPage(target.dataset.query || "");
    });
}
```

- [ ] **Step 2: Refresh the page and verify the search box still opens and closes correctly**

Run:
1. Refresh the browser
2. Click the navbar search icon
3. Click the close icon

Expected: The panel slides in, closes cleanly, and reopens without stale input or stale suggestions

- [ ] **Step 3: Verify typed input shows matching suggestions**

Run:
1. Open the search panel
2. Type `cheese`
3. Delete that text and type `matcha`

Expected:
- The results box stays hidden until typing starts
- Typing `cheese` shows at least `cheesecake`
- Typing `matcha` shows at least one matcha-related suggestion

- [ ] **Step 4: Verify all three navigation paths**

Run:
1. Type `matcha` and press Enter
2. Reopen the page, type `cheese`, and click the inner search icon
3. Reopen the page, type `matcha`, and click a suggestion

Expected:
- Each action navigates to `results.html?q=<query>`
- Empty input does nothing when pressing Enter or clicking the inner search icon

### Task 4: Final Diagnostics Check

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `script.js`

- [ ] **Step 1: Check editor diagnostics for the edited files**

Run: inspect diagnostics for `index.html`, `style.css`, and `script.js`
Expected: No new syntax or lint errors are reported

- [ ] **Step 2: Do one final manual pass on the approved behavior**

Run:
1. Open the panel
2. Confirm empty input keeps the current blank state
3. Type a partial product word
4. Confirm suggestions appear
5. Clear the input
6. Confirm the results box hides again

Expected: The implemented behavior matches the approved spec and does not add any extra navigation when the input is empty
