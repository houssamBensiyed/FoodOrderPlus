document.addEventListener("DOMContentLoaded", () => {
  // --- CONSTANTS ---
  const DATA_URL = "https://younesbahmoun.github.io/food-order-data/data.json";
  const BASE_URL = "https://younesbahmoun.github.io/food-order-data/";
  const PLACEHOLDER_IMAGE =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop&q=80";
  const ITEMS_PER_PAGE = 8;

  // --- STATE ---
  let allProducts = []; // Holds all products from JSON
  let filteredProducts = []; // Holds products after search/filter
  let currentPage = 1;
  let currentCategory = "plat"; // Default category from your design
  let currentSearch = "";

  // --- DOM SELECTORS ---
  const grid = document.getElementById("menu-grid");
  const searchInput = document.getElementById("search-input");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const pageInfo = document.getElementById("page-info");
  const prevButton = document.getElementById("prev-page");
  const nextButton = document.getElementById("next-page");

  // --- 1. SKELETON FUNCTIONS ---

  function createSkeletonCard() {
    return `
                    <div class="animate-pulse">
                        <div class="w-full h-56 bg-gray-800 rounded-lg flex items-center justify-center">
                            <div class="spinner"></div>
                        </div>
                        <div class="py-4">
                            <div class="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
                            <div class="h-4 bg-gray-700 rounded w-full mb-1"></div>
                            <div class="h-4 bg-gray-700 rounded w-5/6 mb-4"></div>
                            <div class="flex justify-between items-center">
                                <div class="h-4 bg-gray-700 rounded w-1/3"></div>
                                <div class="h-6 bg-gray-700 rounded w-1/4"></div>
                            </div>
                        </div>
                    </div>
                `;
  }

  function showLoadingSkeletons() {
    let skeletonHTML = "";
    for (let i = 0; i < ITEMS_PER_PAGE; i++) {
      skeletonHTML += createSkeletonCard();
    }
    grid.innerHTML = skeletonHTML;
  }

  // --- 2. DATA RENDERING FUNCTIONS ---

  function createDataCard(item) {
    // *** IMAGE FIX ***
    // Create absolute URL from the relative path in the JSON
    const imageUrl = item.image
      ? new URL(item.image, BASE_URL).href
      : PLACEHOLDER_IMAGE;

    // Correct path to pageDetails.html (in the same /pages/ directory)
    const detailUrl = `pageDetails.html?id=${item.id}`;

    return `
                    <div>
                        <img 
                            src="${imageUrl}" 
                            alt="${item.name || "Menu item"}" 
                            class="w-full h-56 object-cover rounded-lg"
                            onerror="this.src='${PLACEHOLDER_IMAGE}'"
                        >
                        <div class="py-4">
                            <h2 class="text-xl font-serif font-bold text-gold-400 uppercase mb-2">${
                              item.name || "Nom du plat"
                            }</h2>
                            <p class="text-sm text-gray-400 mb-4 h-10 overflow-hidden">${
                              item.description || "Description non disponible."
                            }</p>
                            <div class="flex justify-between items-center">
                                <a href="${detailUrl}" class="text-xs font-semibold text-gold-600 uppercase tracking-wider hover:text-gold-400 transition-colors duration-300">
                                    Voir les détails
                                </a>
                                <span class="text-lg font-bold text-gold-400">${
                                  item.price || "0"
                                } MAD</span>
                            </div>
                        </div>
                    </div>
                `;
  }

  /**
   * Main function to apply filters, paginate, and render the grid
   */
  function updatePage() {
    // 1. Apply filters
    let tempProducts = [...allProducts];

    // Filter by Category
    if (currentCategory) {
      tempProducts = tempProducts.filter((p) => p.category === currentCategory);
    }

    // Filter by Search
    if (currentSearch) {
      tempProducts = tempProducts.filter((p) =>
        p.name.toLowerCase().includes(currentSearch)
      );
    }
    filteredProducts = tempProducts;

    // 2. Apply pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
    // Ensure currentPage is not out of bounds
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageItems = filteredProducts.slice(startIndex, endIndex);

    // 3. Render
    grid.innerHTML = pageItems.map(createDataCard).join("");
    if (pageItems.length === 0) {
      grid.innerHTML = `<p class="text-gray-400 col-span-full text-center">Aucun plat ne correspond à vos critères.</p>`;
    }

    // 4. Update Pagination UI
    pageInfo.textContent = `PAGE ${currentPage} SUR ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
  }

  // --- 3. EVENT HANDLERS ---

  function handleSearch(e) {
    currentSearch = e.target.value.toLowerCase();
    currentPage = 1; // Reset to first page on new search
    updatePage();
  }

  function handleFilter(e) {
    const clickedButton = e.currentTarget;
    const category = clickedButton.dataset.category;

    // If clicking the *already active* button, remove filter
    if (clickedButton.classList.contains("active-filter")) {
      currentCategory = null;
      clickedButton.classList.remove("active-filter");
      // Re-apply original styles
      clickedButton.classList.add("text-gold-500", "border-gold-700");
      clickedButton.classList.remove(
        "text-black",
        "bg-gold-500",
        "border-gold-500"
      );
    } else {
      // Otherwise, set new filter
      currentCategory = category;
      // Remove active from all buttons
      filterButtons.forEach((btn) => {
        btn.classList.remove(
          "active-filter",
          "text-black",
          "bg-gold-500",
          "border-gold-500"
        );
        btn.classList.add("text-gold-500", "border-gold-700");
      });
      // Add active to clicked button
      clickedButton.classList.add(
        "active-filter",
        "text-black",
        "bg-gold-500",
        "border-gold-500"
      );
      clickedButton.classList.remove("text-gold-500", "border-gold-700");
    }

    currentPage = 1; // Reset to first page on filter change
    updatePage();
  }

  function handlePrevPage() {
    if (currentPage > 1) {
      currentPage--;
      updatePage();
    }
  }

  // *** THIS IS THE FIX ***
  // The bad HTML block was removed from between these two functions.

  function handleNextPage() {
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) {
      currentPage++;
      updatePage();
    }
  }

  function setupEventListeners() {
    searchInput.addEventListener("input", handleSearch);
    filterButtons.forEach((btn) => btn.addEventListener("click", handleFilter));
    prevButton.addEventListener("click", handlePrevPage);
    nextButton.addEventListener("click", handleNextPage);
  }

  // --- 4. INITIAL LOAD ---

  async function loadMenuData() {
    showLoadingSkeletons();
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      allProducts = await response.json();

      // Initial render (with default 'plat' filter)
      updatePage();
      // Setup interactivity
      setupEventListeners();
    } catch (error) {
      console.error("Failed to load menu data:", error);
      grid.innerHTML = `<p class="text-red-500 col-span-full text-center">Erreur de chargement du menu. Veuillez réessayer plus tard.</p>`;
    }
  }

  loadMenuData();
});
