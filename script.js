const searchBtn = document.getElementById("search-icon");
const searchPanel = document.getElementById("search-panel");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const suggestionsList = document.getElementById("suggestions-list");
const searchSubmit = document.getElementById("search-submit");
const closeBtn = document.getElementById("close-search");

const suggestionKeywords = [
    "cheesecake",
    "coconut pandan basque cheesecake",
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
    const buildResultsUrl = (query) => `results.html?q=${encodeURIComponent(query)}`;

    const getMatchingSuggestions = (query) => {
        const normalizedQuery = query.trim().toLowerCase();

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
            const suggestionButton = document.createElement("button");
            suggestionButton.type = "button";
            suggestionButton.className = "search-results__suggestion";
            suggestionButton.dataset.query = match;
            suggestionButton.textContent = match;
            suggestionsList.appendChild(suggestionButton);
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
        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            return;
        }

        window.location.href = buildResultsUrl(trimmedQuery);
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