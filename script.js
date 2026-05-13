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

const CART_COUNT_KEY = "cartCount";

const getStoredCartCount = () => {
    try {
        const rawValue = window.localStorage.getItem(CART_COUNT_KEY);
        const parsedValue = Number.parseInt(rawValue || "0", 10);
        return Number.isNaN(parsedValue) || parsedValue < 0 ? 0 : parsedValue;
    } catch (error) {
        return 0;
    }
};

const setStoredCartCount = (count) => {
    const safeCount = Math.max(0, count);

    try {
        window.localStorage.setItem(CART_COUNT_KEY, String(safeCount));
    } catch (error) {
        // Ignore storage errors and still update the current page UI.
    }

    return safeCount;
};

const ensureCartBadges = () => {
    const cartButtons = document.querySelectorAll('button[aria-label="Open cart"]');

    cartButtons.forEach((button) => {
        button.classList.add("cart-btn");

        if (!button.querySelector(".cart-count")) {
            const badge = document.createElement("span");
            badge.className = "cart-count";
            badge.setAttribute("aria-hidden", "true");
            badge.textContent = "0";
            button.appendChild(badge);
        }
    });
};

const renderCartCount = (count) => {
    document.querySelectorAll(".cart-count").forEach((badge) => {
        badge.textContent = String(count);
    });
};

const initializeSharedCart = () => {
    ensureCartBadges();
    renderCartCount(getStoredCartCount());
};

const initializeProductGalleryControls = () => {
    const dots = Array.from(document.querySelectorAll("[data-gallery-dot]"));
    const arrowButtons = document.querySelectorAll("[data-gallery-arrow]");

    if (dots.length === 0) {
        return;
    }

    let activeIndex = Math.max(
        0,
        dots.findIndex((dot) => dot.classList.contains("is-active"))
    );

    const updateActiveDot = (nextIndex) => {
        activeIndex = (nextIndex + dots.length) % dots.length;

        dots.forEach((dot, index) => {
            dot.classList.toggle("is-active", index === activeIndex);
        });
    };

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => updateActiveDot(index));
    });

    arrowButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const direction = button.dataset.galleryArrow === "next" ? 1 : -1;
            updateActiveDot(activeIndex + direction);
        });
    });
};

const initializeProductPage = () => {
    const productPage = document.querySelector("[data-product-page]");
    const quantityValue = document.querySelector("[data-quantity-value]");
    const quantityButtons = document.querySelectorAll("[data-quantity-action]");
    const addToCartButton = document.querySelector("[data-add-to-cart]");
    const sizeSelect = document.querySelector("[data-size-select]");
    const popup = document.querySelector("[data-cart-popup]");
    const popupSize = document.querySelector("[data-popup-size]");
    const popupTitle = document.querySelector("[data-popup-title]");
    const popupImage = document.querySelector("[data-popup-image]");
    const popupCloseButtons = document.querySelectorAll("[data-popup-close]");

    if (
        !productPage ||
        !(quantityValue instanceof HTMLElement) ||
        !(addToCartButton instanceof HTMLButtonElement) ||
        !(sizeSelect instanceof HTMLSelectElement) ||
        !(popup instanceof HTMLElement)
    ) {
        return;
    }

    let quantity = Number.parseInt(quantityValue.textContent || "1", 10);

    if (Number.isNaN(quantity) || quantity < 1) {
        quantity = 1;
        quantityValue.textContent = "1";
    }

    const setQuantity = (nextQuantity) => {
        quantity = Math.max(1, nextQuantity);
        quantityValue.textContent = String(quantity);
    };

    quantityButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const action = button.getAttribute("data-quantity-action");
            setQuantity(quantity + (action === "increase" ? 1 : -1));
        });
    });

    const closePopup = () => {
        popup.hidden = true;
    };

    popupCloseButtons.forEach((button) => {
        button.addEventListener("click", closePopup);
    });

    addToCartButton.addEventListener("click", () => {
        const updatedCount = setStoredCartCount(getStoredCartCount() + quantity);
        renderCartCount(updatedCount);

        if (popupTitle) {
            popupTitle.textContent = addToCartButton.dataset.productName || "Product";
        }

        if (popupSize) {
            popupSize.textContent = sizeSelect.value;
        }

        if (popupImage instanceof HTMLImageElement && addToCartButton.dataset.productImage) {
            popupImage.src = addToCartButton.dataset.productImage;
        }

        popup.hidden = false;
    });

    initializeProductGalleryControls();
};

initializeSharedCart();
initializeProductPage();