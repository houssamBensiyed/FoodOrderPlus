const menuIcon = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuIcon.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  menuIcon.classList.toggle("fa-bars");
  menuIcon.classList.toggle("fa-xmark");
});

// Cart functionality
const panier_container = document.querySelector(".panier_container");
const card = document.querySelector(".cart");
const close_btn = document.querySelector(".close_btn");
const card_container = document.querySelector(".card_container");

// Initialize cart from localStorage
let cartItems = JSON.parse(localStorage.getItem("data_card")) || [];

// Display cart items on load
displayCartItems();

card.addEventListener("click", () => {
  panier_container.classList.add("show");
});

close_btn.addEventListener("click", () => {
  panier_container.classList.remove("show");
});

const add_btn = document.getElementById("add");

add_btn.addEventListener("click", (e) => {
  let children = e.target.parentElement.children;
  let [image, title, description, price] = children;

  let newItem = {
    id: Date.now(),
    image_card: image.src,
    title_card: title.textContent,
    description_card: description.textContent,
    price_card: price.textContent,
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

  // Save to localStorage
  localStorage.setItem("data_card", JSON.stringify(cartItems));
  displayCartItems();
});

// Display cart items
function displayCartItems() {
  card_container.innerHTML = "";

  if (cartItems.length === 0) {
    card_container.innerHTML = "<p>Your cart is empty</p>";
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

// Update quantity and totals
function updateTotals() {
  let subtotal = 0;

  // Calculate the subtotal based on items
  cartItems.forEach((item) => {
    const priceValue = parseFloat(
      item.price_card.replace("€", "").replace(",", ".")
    );
    subtotal += priceValue * item.quantity;
  });

  // --- CHANGE START: Removed Tax Logic ---
  // The total is now simply equal to the subtotal
  const total = subtotal;
  // --- CHANGE END ---

  // Update DOM elements
  const sousTotalElement = document.getElementById("sous_total");
  const totalTtcElement = document.getElementById("total_ttc");

  if (sousTotalElement) {
    sousTotalElement.textContent = `€${subtotal.toFixed(2)}`;
  }

  if (totalTtcElement) {
    totalTtcElement.textContent = `€${total.toFixed(2)}`;
  }
}

// Events
card_container.addEventListener("click", (e) => {
  const index = parseInt(e.target.getAttribute("data-index"));

  if (e.target.classList.contains("decrement_counter")) {
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity -= 1;
    } else {
      // Remove item if quantity zero
      cartItems.splice(index, 1);
    }
    localStorage.setItem("data_card", JSON.stringify(cartItems));
    displayCartItems();
  } else if (e.target.classList.contains("increment_counter")) {
    cartItems[index].quantity += 1;
    localStorage.setItem("data_card", JSON.stringify(cartItems));
    displayCartItems();
  } else if (
    e.target.classList.contains("delete_order") ||
    e.target.closest(".delete_order")
  ) {
    const deleteIndex = parseInt(
      e.target.closest(".delete_order").getAttribute("data-index")
    );
    cartItems.splice(deleteIndex, 1);
    localStorage.setItem("data_card", JSON.stringify(cartItems));
    displayCartItems();
  }
});

// Command button function
const command_btn = document.getElementById("command_btn");
if (command_btn) {
  command_btn.addEventListener("click", () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    alert("Order placed successfully!");

    // Clear cart after successful order
    cartItems = [];
    localStorage.removeItem("data_card");
    displayCartItems();
    panier_container.classList.remove("show");
  });
}
