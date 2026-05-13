# Search Panel Interaction Design

## Goal

Make the homepage search icon open a search panel that matches the intended layout, reveal a results box below the search input only after the user types at least one character, and route search actions to a future `results.html` page.

## Current State

- `index.html` already contains a search button, a search panel container, an input, and a close button.
- `style.css` already includes a sliding panel style and `.show` state.
- `script.js` currently only opens and closes the panel and toggles the placeholder results box based on whether the input is empty.
- There is no real autocomplete matching or result-page navigation yet.

## Desired Behavior

1. Clicking the search icon opens the search panel.
2. The search input is visible immediately when the panel opens.
3. The yellow results box stays hidden while the input is empty.
4. Typing at least one character shows the yellow results box.
5. The suggestions list updates to show only search keywords that include the typed text, such as matching both `cheese` and `cheesecake`.
6. Pressing Enter in the search input navigates to `results.html?q=<query>`.
7. Clicking the search icon inside the panel navigates to `results.html?q=<query>` when the input is not empty.
8. Clicking a suggestion navigates to `results.html?q=<suggestion>`.
9. Clearing the input hides the yellow results box again.
10. Clicking the close button hides the panel and resets the search UI to its empty state.

## UI Structure

The search panel should contain:

- a top row with the input and close button
- a results section directly below the input
- a suggestion list that can be updated by JavaScript
- placeholder product content that visually matches the provided screenshot

The results section should be part of the existing panel rather than a separate floating component so the layout remains simple and easy to control.

## Navigation Rules

- The outer search icon in the navbar only opens the panel.
- The inner search icon inside the search panel submits the current query to `results.html`.
- Suggestion items submit their own text to `results.html`.
- Empty input does not navigate anywhere and leaves the panel in its current state.
- The results page itself is out of scope for this change and may be created later.

## Implementation Plan

### HTML

Expand the search panel markup in `index.html` to include:

- an identifiable search input
- an identifiable search button inside the panel
- a results container under the input
- suggestion items that JavaScript can replace or filter
- placeholder content for products

### CSS

Update `style.css` to:

- keep the panel hidden off-canvas by default
- slide the panel into view when `.show` is applied
- hide the yellow results box by default
- keep suggestion items styled as clickable text or buttons
- style the panel contents to resemble the target reference

### JavaScript

Update `script.js` to:

- open the panel on search icon click
- close and reset the panel on close button click
- listen for input events on the search field
- filter a small built-in keyword list based on `input.value.trim().toLowerCase()`
- render only matching suggestion items
- show the results box when `input.value.trim()` is non-empty
- hide the results box when the input is empty
- navigate to `results.html?q=<query>` when the user presses Enter
- navigate to `results.html?q=<query>` when the user clicks the inner search button
- navigate to `results.html?q=<suggestion>` when the user clicks a suggestion

## Error Handling

- If any search UI element is missing, the script should fail safely instead of throwing errors.
- Resetting on close avoids stale results remaining visible when the panel is reopened.
- Submitting an empty or whitespace-only query should do nothing.
- If no suggestions match, the Suggestions section should remain visible but show no clickable suggestion items, or show a small empty-state message.

## Verification

Manual verification should confirm:

1. The panel opens after clicking the search icon.
2. The panel closes after clicking the close button.
3. The results box is hidden when the panel first opens.
4. Typing one or more characters shows the results box.
5. Typing `cheese` shows `cheesecake` as a suggestion.
6. Typing `matcha` shows at least one matcha-related suggestion.
7. Pressing Enter with `matcha` in the input navigates to `results.html?q=matcha`.
8. Clicking the inner search icon with a non-empty query navigates to `results.html` with that query.
9. Clicking a suggestion navigates to `results.html` with the clicked suggestion.
10. Deleting all text hides the results box again.

## Scope

This change covers front-end autocomplete suggestions and query-based navigation only. It does not implement the actual `results.html` page or any backend search system.
