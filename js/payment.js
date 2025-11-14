// payment.js

// --- SELECTORS ---
const fullName = document.getElementById("name");
const address = document.getElementById("address");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const submitBtn = document.getElementById("submit-btn");

const fullNameError = document.getElementById("name-error");
const addressError = document.getElementById("address-error");
const emailError = document.getElementById("email-error");
const phoneError = document.getElementById("phone-error");

const itemListContainer = document.getElementById("payment-item-list");
const totalElDesktop = document.getElementById("payment-total-desktop");
const totalElMobile = document.getElementById("payment-total-mobile");

// --- HELPER FUNCTIONS ---

// Helper to parse price string (e.g., "€4,50" or "€4.50")
function parsePrice(priceStr) {
  return parseFloat(priceStr.replace("€", "").replace(",", ".")) || 0;
}

function showError(element, message) {
  element.textContent = message;
  element.style.display = "block";
}

function hideError(element) {
  element.textContent = "";
  element.style.display = "none";
}

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// --- CART LOADING ---

function loadPaymentDetails() {
  const cart = JSON.parse(localStorage.getItem("data_card")) || [];

  if (!itemListContainer || !totalElDesktop || !totalElMobile) {
    console.error("Payment page elements not found.");
    return;
  }

  itemListContainer.innerHTML = ""; // Clear "Loading..."
  let subtotal = 0;

  if (cart.length === 0) {
    itemListContainer.innerHTML = `<p class="text-white text-center text-lg">Your cart is empty. Please add items to proceed.</p>`;
    totalElDesktop.textContent = "€0.00";
    totalElMobile.textContent = "€0.00";
    // Disable form if cart is empty
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.5";
    submitBtn.textContent = "Cart is Empty";
    return;
  }

  cart.forEach((item) => {
    const itemPrice = parsePrice(item.price_card);
    const lineTotal = itemPrice * item.quantity;
    subtotal += lineTotal;

    const itemHtml = `
      <div class="bg-[#2F2828] p-5 rounded-lg text-white flex gap-6 items-center">
        <div class="w-20 h-20 bg-white rounded-lg bg-cover bg-center flex-shrink-0" 
             style="background-image: url('${item.image_card}')">
        </div>
        <div class="flex-grow">
          <h1 class="text-xl font-semibold">${item.title_card}</h1>
          <p class="text-gray-300">Unit Price: ${item.price_card}</p>
        </div>
        <div class="text-right flex-shrink-0">
           <p class="text-lg">Qty: ${item.quantity}</p>
           <p class="text-lg font-bold">€${lineTotal.toFixed(2)}</p>
        </div>
      </div>
    `;
    itemListContainer.insertAdjacentHTML("beforeend", itemHtml);
  });

  const totalString = `€${subtotal.toFixed(2)}`;
  totalElDesktop.textContent = totalString;
  totalElMobile.textContent = totalString;
}

// --- PDF GENERATION ---

function generateInvoicePDF(cart, user, total) {
  // Get jsPDF from the global window object (loaded from the CDN)
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 70; // Vertical position tracker

  // --- Header ---
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Order Invoice - FOODORDER+", 105, 20, { align: "center" });

  // --- Customer Info ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Customer Details:", 10, 40);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${user.name}`, 14, 48);
  doc.text(`Address: ${user.address}`, 14, 54);
  doc.text(`Email: ${user.email}`, 14, 60);
  doc.text(`Phone: ${user.phone}`, 14, 66);

  // --- Order Info ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Order Summary:", 10, 80);

  doc.setLineWidth(0.5);
  doc.line(10, 83, 200, 83); // Header line
  doc.text("Item", 12, 88);
  doc.text("Qty", 150, 88, { align: "right" });
  doc.text("Unit Price", 170, 88, { align: "right" });
  doc.text("Total", 198, 88, { align: "right" });
  doc.line(10, 91, 200, 91); // Footer line

  y = 98;
  doc.setFont("helvetica", "normal");

  cart.forEach((item) => {
    const itemPrice = parsePrice(item.price_card);
    const lineTotal = itemPrice * item.quantity;

    // doc.splitTextToSize handles basic text wrapping
    const titleLines = doc.splitTextToSize(item.title_card, 130);
    doc.text(titleLines, 12, y);

    doc.text(String(item.quantity), 150, y, { align: "right" });
    doc.text(`€${itemPrice.toFixed(2)}`, 170, y, { align: "right" });
    doc.text(`€${lineTotal.toFixed(2)}`, 198, y, { align: "right" });

    // Move y position down based on how many lines the title was
    y += titleLines.length * 5 + 4;
  });

  // --- Total ---
  doc.setLineWidth(0.5);
  doc.line(130, y, 200, y);
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Total TTC:", 130, y);
  doc.text(total, 198, y, { align: "right" });

  // --- Save PDF ---
  doc.save(`foodorder-invoice-${user.name.replace(/ /g, "_")}.pdf`);
}

// --- FORM VALIDATION ---
const validate = (e) => {
  e.preventDefault();
  let isValide = true;

  if (fullName.value.trim() == "") {
    showError(fullNameError, "Name cannot be empty.");
    isValide = false;
  } else if (fullName.value.length < 8) {
    showError(fullNameError, "Full name must be at least 8 characters long.");
    isValide = false;
  } else {
    hideError(fullNameError);
  }

  if (address.value.trim() == "") {
    showError(addressError, "Address cannot be empty.");
    isValide = false;
  } else {
    hideError(addressError);
  }

  if (email.value.trim() == "") {
    showError(emailError, "Email cannot be empty.");
    isValide = false;
  } else if (!validateEmail(email.value)) {
    showError(emailError, "Enter a valid email");
    isValide = false;
  } else {
    hideError(emailError);
  }

  if (phone.value.trim() == "") {
    showError(phoneError, "Phone number cannot be empty.");
    isValide = false;
  } else if (!/^[+]?[0-9\s-]{6,15}$/.test(phone.value)) {
    showError(phoneError, "Enter a valid number");
    isValide = false;
  } else {
    hideError(phoneError);
  }

  if (isValide) {
    // --- ** SUCCESS! ** ---
    const cart = JSON.parse(localStorage.getItem("data_card")) || [];
    const user = {
      name: fullName.value,
      address: address.value,
      phone: phone.value,
      email: email.value,
    };
    const total = totalElDesktop.textContent; // Get the calculated total

    // 1. Generate the PDF
    generateInvoicePDF(cart, user, total);

    // 2. Show success and clear cart
    alert("Order Successful! Your invoice is downloading.");
    localStorage.removeItem("data_card");

    // 3. Disable button and redirect to home page
    submitBtn.disabled = true;
    submitBtn.textContent = "Order Placed!";
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);
  }
};

// --- INITIALIZE PAGE ---

// 1. Add listener to the submit button
submitBtn.addEventListener("click", validate);

// 2. Load the cart items as soon as the DOM is ready
document.addEventListener("DOMContentLoaded", loadPaymentDetails);
