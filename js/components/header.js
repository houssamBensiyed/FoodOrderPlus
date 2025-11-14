// header.js (Modified & Safe Version)

const menuIcon = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuIcon) {
  menuIcon.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuIcon.classList.toggle("fa-bars");
    menuIcon.classList.toggle("fa-xmark");
  });
}

const panier_container = document.querySelector(".panier_container");
const card = document.querySelector(".cart");
const close_btn = document.querySelector(".close_btn");
const card_container = document.querySelector(".card_container");
const command_btn = document.getElementById("command_btn");

let cartItems = JSON.parse(localStorage.getItem("data_card")) || [];

if (panier_container && card_container && close_btn && card && command_btn) {
  displayCartItems();

  card.addEventListener("click", () => {
    cartItems = JSON.parse(localStorage.getItem("data_card")) || [];
    displayCartItems();
    panier_container.classList.add("show");
  });

  close_btn.addEventListener("click", () => {
    panier_container.classList.remove("show");
  });

  function displayCartItems() {
    if (!card_container) return;
    card_container.innerHTML = "";

    if (cartItems.length === 0) {
      card_container.innerHTML =
        '<p class="empty-msg" style="text-align:center; padding:20px;">Your cart is empty</p>';
      updateTotals();
      return;
    }

    cartItems.forEach((item, index) => {
      const itemElement = document.createElement("div");
      itemElement.className = "panier_element";
      itemElement.innerHTML = `
        <div class="image">
          <img src="${item.image_card}" alt="${item.title_card}" />
        </div>
        <div class="center">
          <h5 class="order_title">${item.title_card}</h5>
          <p class="order_panier_description">${item.description_card}</p>
          <div class="price_order_control">
            <strong>${item.price_card}</strong>
            <div class="btn_control">
              <button class="decrement_counter" data-index="${index}">-</button>
              <span class="counter">${item.quantity}</span>
              <button class="increment_counter" data-index="${index}">+</button>
            </div>
          </div>
        </div>
        <div class="remove">
          <span class="delete_order" data-index="${index}">
            <em class="fas fa-trash-can"></em>
          </span>
        </div>
      `;
      card_container.appendChild(itemElement);
    });

    updateTotals();
  }

  function updateTotals() {
    let subtotal = 0;

    cartItems.forEach((item) => {
      const priceValue =
        parseFloat(item.price_card.replace("€", "").replace(",", ".")) || 0;
      subtotal += priceValue * item.quantity;
    });

    const total = subtotal;
    const sousTotalElement = document.getElementById("sous_total");
    const totalTtcElement = document.getElementById("total_ttc");

    if (sousTotalElement) {
      sousTotalElement.textContent = `€${subtotal.toFixed(2)}`;
    }
    if (totalTtcElement) {
      totalTtcElement.textContent = `€${total.toFixed(2)}`;
    }
  }

  // Events (for modal)
  card_container.addEventListener("click", (e) => {
    const targetBtn =
      e.target.closest("button") || e.target.closest(".delete_order");
    if (!targetBtn) return;

    const index = parseInt(targetBtn.getAttribute("data-index"));
    if (isNaN(index) || index < 0 || index >= cartItems.length) return; // Safety check

    if (targetBtn.classList.contains("decrement_counter")) {
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
      } else {
        cartItems.splice(index, 1);
      }
      localStorage.setItem("data_card", JSON.stringify(cartItems));
      displayCartItems();
    } else if (targetBtn.classList.contains("increment_counter")) {
      cartItems[index].quantity += 1;
      localStorage.setItem("data_card", JSON.stringify(cartItems));
      displayCartItems();
    } else if (targetBtn.classList.contains("delete_order")) {
      cartItems.splice(index, 1);
      localStorage.setItem("data_card", JSON.stringify(cartItems));
      displayCartItems();
    }
  });

  // Command button function (for modal)
  command_btn.addEventListener("click", () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    window.location.href = "../pages/payment.html"; // Assuming this is the path
  });
} else if (card) {
  // Fallback for pages *without* a cart modal (like payment.html)
  // When cart icon is clicked, just go to the home page.
  card.addEventListener("click", () => {
    window.location.href = "../index.html"; // Safer behavior
  });
}
// --- END: Modal-Only Logic ---

// --- "Add" button logic (For index/home page cards) ---
// This is separate from the modal and is safe
const add_btn = document.getElementById("add");
if (add_btn) {
  add_btn.addEventListener("click", (e) => {
    let parent = e.target.parentElement;

    let imageSrc = parent.querySelector("img").src;
    let titleText = parent.querySelector("h3").textContent;
    let descText = parent.querySelector("p")
      ? parent.querySelector("p").textContent
      : "";
    let priceText = parent.querySelector(".price")
      ? parent.querySelector(".price").textContent
      : "€0.00";

    let newItem = {
      id: Date.now(),
      image_card: imageSrc,
      title_card: titleText,
      description_card: descText,
      price_card: priceText,
      quantity: 1,
    };

    const existingItemIndex = cartItems.findIndex(
      (item) =>
        item.title_card === newItem.title_card &&
        item.price_card === newItem.price_card
    );

    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push(newItem);
    }

    localStorage.setItem("data_card", JSON.stringify(cartItems));

    // Try to update modal if it exists
    if (typeof displayCartItems === "function") {
      displayCartItems();
    }
  });
}
