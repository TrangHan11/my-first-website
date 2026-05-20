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
const CART_ITEMS_KEY = "cartItems";

const normalizeStoredCartItem = (item) => {
    if (!item || typeof item !== "object") {
        return null;
    }

    const safeId = typeof item.id === "string" ? item.id.trim() : "";

    if (!safeId) {
        return null;
    }

    const safeName = typeof item.name === "string" && item.name.trim()
        ? item.name.trim()
        : "Product";
    const safeImage = typeof item.image === "string" ? item.image : "";
    const safePrice = Number(item.price);
    const safeSize = typeof item.size === "string" && item.size.trim()
        ? item.size.trim()
        : "Slice";

    return {
        id: safeId,
        name: safeName,
        image: safeImage,
        price: Number.isFinite(safePrice) ? safePrice : 0,
        size: safeSize,
    };
};

const getStoredCartItems = () => {
    try {
        const rawValue = window.localStorage.getItem(CART_ITEMS_KEY);
        const parsedValue = JSON.parse(rawValue || "[]");

        if (!Array.isArray(parsedValue)) {
            return [];
        }

        return parsedValue
            .map(normalizeStoredCartItem)
            .filter((item) => item !== null);
    } catch (error) {
        return [];
    }
};

const setStoredCartItems = (items) => {
    const safeItems = Array.isArray(items) ? items : [];

    try {
        window.localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(safeItems));
        window.localStorage.setItem(CART_COUNT_KEY, String(safeItems.length));
    } catch (error) {
        // Ignore storage errors and still update the current page UI.
    }

    renderCartCount(safeItems.length);
    return safeItems;
};

const ensureCartBadges = () => {
    const cartButtons = document.querySelectorAll('button[aria-label="Open cart"]');

    cartButtons.forEach((button) => {
        button.classList.add("cart-btn");

        if (button.dataset.cartLinkBound !== "true") {
            button.addEventListener("click", () => {
                window.location.href = "shoppingcart.html";
            });
            button.dataset.cartLinkBound = "true";
        }

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
    renderCartCount(getStoredCartItems().length);
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
        const nextItem = {
            id: addToCartButton.dataset.productId || "",
            name: addToCartButton.dataset.productName || "Product",
            image: addToCartButton.dataset.productImage || "",
            price: Number.parseFloat(addToCartButton.dataset.productPrice || "0"),
            size: sizeSelect.value,
        };

        const currentItems = getStoredCartItems();
        const alreadyExists = currentItems.some((item) => item.id === nextItem.id);

        if (!alreadyExists && nextItem.id) {
            setStoredCartItems([...currentItems, nextItem]);
        } else {
            renderCartCount(currentItems.length);
        }

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

const formatCurrency = (value) => `A$${value.toFixed(2)}`;

const buildCompleteMobileMessage = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        return "Our pastry chefs are carefully packaging your treats.";
    }

    const firstItemName = items[0]?.name || "treats";

    if (items.length === 1) {
        return `Our pastry chefs are carefully packaging your ${firstItemName}.`;
    }

    if (items.length === 2) {
        const secondItemName = items[1]?.name || "treat";
        return `Our pastry chefs are carefully packaging your ${firstItemName} and ${secondItemName}.`;
    }

    return `Our pastry chefs are carefully packaging your ${firstItemName} and ${items.length - 1} more items.`;
};

const initializeShoppingCartPage = () => {
    const cartPage = document.querySelector("[data-cart-page]");
    const filledSection = document.querySelector("[data-cart-filled]");
    const emptySection = document.querySelector("[data-cart-empty]");
    const itemsContainer = document.querySelector("[data-cart-items]");
    const itemTemplate = document.getElementById("cart-item-template");
    const totalValue = document.querySelector("[data-cart-total]");

    if (
        !(cartPage instanceof HTMLElement) ||
        !(filledSection instanceof HTMLElement) ||
        !(emptySection instanceof HTMLElement) ||
        !(itemsContainer instanceof HTMLElement) ||
        !(itemTemplate instanceof HTMLTemplateElement) ||
        !(totalValue instanceof HTMLElement)
    ) {
        return;
    }

    const removeStoredCartItem = (itemId) => {
        const nextItems = getStoredCartItems().filter((item) => item.id !== itemId);
        setStoredCartItems(nextItems);
        renderPage();
    };

    const renderPage = () => {
        const items = getStoredCartItems();
        const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);

        renderCartCount(items.length);
        itemsContainer.innerHTML = "";

        if (items.length === 0) {
            filledSection.hidden = true;
            emptySection.hidden = false;
            totalValue.textContent = formatCurrency(0);
            return;
        }

        filledSection.hidden = false;
        emptySection.hidden = true;

        items.forEach((item) => {
            const itemFragment = itemTemplate.content.cloneNode(true);
            const itemElement = itemFragment.querySelector("[data-cart-item]");
            const image = itemFragment.querySelector("[data-cart-item-image]");
            const name = itemFragment.querySelector("[data-cart-item-name]");
            const price = itemFragment.querySelector("[data-cart-item-price]");
            const size = itemFragment.querySelector("[data-cart-item-size]");
            const subtotal = itemFragment.querySelector("[data-cart-item-subtotal]");
            const deleteButton = itemFragment.querySelector("[data-cart-delete]");

            if (image instanceof HTMLImageElement) {
                image.src = item.image || "";
                image.alt = item.name || "Cart product";
            }

            if (name instanceof HTMLElement) {
                name.textContent = item.name || "Product";
            }

            if (price instanceof HTMLElement) {
                price.textContent = formatCurrency(Number(item.price || 0));
            }

            if (size instanceof HTMLElement) {
                size.textContent = `Size: ${item.size || "Slice"}`;
            }

            if (subtotal instanceof HTMLElement) {
                subtotal.textContent = formatCurrency(Number(item.price || 0));
            }

            if (deleteButton instanceof HTMLButtonElement) {
                deleteButton.addEventListener("click", () => removeStoredCartItem(item.id));
            }

            if (itemElement instanceof HTMLElement) {
                itemsContainer.appendChild(itemElement);
            }
        });

        totalValue.textContent = formatCurrency(total);
    };

    renderPage();
};

const initializeCheckoutPage = () => {
    const checkoutPage = document.querySelector("[data-checkout-page]");
    const checkoutForm = document.querySelector(".checkout-page__form");
    const itemsContainer = document.querySelector("[data-checkout-items]");
    const itemTemplate = document.getElementById("checkout-item-template");
    const summaryToggle = document.querySelector("[data-checkout-summary-toggle]");
    const summaryPanel = document.querySelector("[data-checkout-summary-panel]");
    const toggleTotal = document.querySelector("[data-checkout-toggle-total]");
    const subtotalValue = document.querySelector("[data-checkout-subtotal]");
    const totalValue = document.querySelector("[data-checkout-total]");

    if (
        !(checkoutPage instanceof HTMLElement) ||
        !(checkoutForm instanceof HTMLFormElement) ||
        !(itemsContainer instanceof HTMLElement) ||
        !(itemTemplate instanceof HTMLTemplateElement) ||
        !(summaryPanel instanceof HTMLElement) ||
        !(subtotalValue instanceof HTMLElement) ||
        !(totalValue instanceof HTMLElement)
    ) {
        return;
    }

    const items = getStoredCartItems();

    if (items.length === 0) {
        window.location.href = "shoppingcart.html";
        return;
    }

    checkoutForm.addEventListener("submit", (event) => {
        event.preventDefault();
        window.location.href = "complete.html";
    });

    const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0), 0);

    itemsContainer.innerHTML = "";

    items.forEach((item) => {
        const itemFragment = itemTemplate.content.cloneNode(true);
        const itemElement = itemFragment.querySelector("[data-checkout-item]");
        const image = itemFragment.querySelector("[data-checkout-item-image]");
        const name = itemFragment.querySelector("[data-checkout-item-name]");
        const size = itemFragment.querySelector("[data-checkout-item-size]");
        const price = itemFragment.querySelector("[data-checkout-item-price]");
        const quantity = itemFragment.querySelector("[data-checkout-item-quantity]");

        if (image instanceof HTMLImageElement) {
            image.src = item.image || "";
            image.alt = item.name || "Checkout product";
        }

        if (name instanceof HTMLElement) {
            name.textContent = item.name || "Product";
        }

        if (size instanceof HTMLElement) {
            size.textContent = `Size: ${item.size || "Slice"}`;
        }

        if (price instanceof HTMLElement) {
            price.textContent = formatCurrency(Number(item.price || 0));
        }

        if (quantity instanceof HTMLElement) {
            quantity.textContent = "1";
        }

        if (itemElement instanceof HTMLElement) {
            itemsContainer.appendChild(itemElement);
        }
    });

    subtotalValue.textContent = formatCurrency(subtotal);
    totalValue.textContent = formatCurrency(subtotal);

    if (toggleTotal instanceof HTMLElement) {
        toggleTotal.textContent = formatCurrency(subtotal);
    }

    if (summaryToggle instanceof HTMLButtonElement) {
        summaryToggle.addEventListener("click", () => {
            const isOpen = summaryPanel.classList.toggle("is-open");
            summaryToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }
};

const initializeCompletePage = () => {
    const completePage = document.querySelector("[data-complete-page]");
    const itemsContainer = document.querySelector("[data-complete-items]");
    const itemTemplate = document.getElementById("complete-item-template");
    const mobileMessage = document.querySelector("[data-complete-mobile-message]");
    const subtotalValue = document.querySelector("[data-complete-subtotal]");
    const totalValue = document.querySelector("[data-complete-total]");

    if (
        !(completePage instanceof HTMLElement) ||
        !(itemsContainer instanceof HTMLElement) ||
        !(itemTemplate instanceof HTMLTemplateElement) ||
        !(mobileMessage instanceof HTMLElement) ||
        !(subtotalValue instanceof HTMLElement) ||
        !(totalValue instanceof HTMLElement)
    ) {
        return;
    }

    const items = getStoredCartItems();

    if (items.length === 0) {
        window.location.href = "shoppingcart.html";
        return;
    }

    const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0), 0);

    itemsContainer.innerHTML = "";
    mobileMessage.textContent = buildCompleteMobileMessage(items);

    items.forEach((item) => {
        const itemFragment = itemTemplate.content.cloneNode(true);
        const itemElement = itemFragment.querySelector("[data-complete-item]");
        const image = itemFragment.querySelector("[data-complete-item-image]");
        const name = itemFragment.querySelector("[data-complete-item-name]");
        const size = itemFragment.querySelector("[data-complete-item-size]");
        const price = itemFragment.querySelector("[data-complete-item-price]");
        const quantity = itemFragment.querySelector("[data-complete-item-quantity]");

        if (image instanceof HTMLImageElement) {
            image.src = item.image || "";
            image.alt = item.name || "Completed order product";
        }

        if (name instanceof HTMLElement) {
            name.textContent = item.name || "Product";
        }

        if (size instanceof HTMLElement) {
            size.textContent = `Size: ${item.size || "Slice"}`;
        }

        if (price instanceof HTMLElement) {
            price.textContent = formatCurrency(Number(item.price || 0));
        }

        if (quantity instanceof HTMLElement) {
            quantity.textContent = "1";
        }

        if (itemElement instanceof HTMLElement) {
            itemsContainer.appendChild(itemElement);
        }
    });

    subtotalValue.textContent = formatCurrency(subtotal);
    totalValue.textContent = formatCurrency(subtotal);
};

initializeSharedCart();
initializeProductPage();
initializeShoppingCartPage();
initializeCheckoutPage();
initializeCompletePage();