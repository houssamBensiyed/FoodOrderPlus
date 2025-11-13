// Quantity interactions
const input = document.getElementById("qtyInput");

if (input) {
  document.getElementById("minus").addEventListener("click", () => {
    const v = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
    input.value = v;
  });

  document.getElementById("plus").addEventListener("click", () => {
    const v = Math.min(99, (parseInt(input.value, 10) || 1) + 1);
    input.value = v;
  });
}

(function () {
  const DATA_URL = "https://younesbahmoun.github.io/food-order-data/data.json";
  const DATA_BASE = new URL(".", DATA_URL);
  const PLACEHOLDER = "https://placehold.co/800x600?text=Image";
  const id = new URLSearchParams(location.search).get("id");

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (v) => "€" + Number(v ?? 0).toFixed(2);

  const resolveImage = (p) => {
    if (!p) return PLACEHOLDER;
    if (/^https?:\/\//i.test(p)) return p;
    return new URL(p.replace(/^\.\//, ""), DATA_BASE).href;
  };

  const setImg = (img, src, alt) => {
    if (!img) return;

    // 1. START LOADING: Add skeleton class & hide the actual image content
    img.classList.add("skeleton");
    img.style.opacity = "0"; // Hide image so we only see the shimmer
    img.alt = alt || "";

    // 2. SUCCESS: When image finishes downloading
    img.onload = () => {
      img.classList.remove("skeleton"); // Stop shimmering
      img.style.opacity = "1"; // Fade the real image in
    };

    // 3. ERROR: If image fails
    img.onerror = () => {
      img.classList.remove("skeleton");
      img.style.opacity = "1";
      img.onerror = null;
      img.src = PLACEHOLDER;
    };

    // 4. TRIGGER: Set the source to start the browser download
    // We add a timestamp (?v=...) to bypass cache for testing
    img.src = src + (src.includes("?") ? "&" : "?") + "v=" + Date.now();
  };

  const sample = (arr, n, excludeId) => {
    const copy = excludeId
      ? arr.filter((x) => x.id !== excludeId)
      : arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
  };

  const renderSizes = (list) => {
    const wrap = $(".sizes");
    if (!wrap) return;
    wrap.innerHTML = "";
    (list || []).forEach((label) => {
      const b = document.createElement("button");
      b.className = "size";
      b.type = "button";
      b.textContent = label;
      b.setAttribute("aria-label", `Size ${label}`);
      b.addEventListener("click", () => {
        $$(".sizes .size").forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
      });
      wrap.appendChild(b);
    });
  };

  async function init() {
    let data = [];
    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      data = await res.json();
    } catch (e) {
      console.error("Fetch error:", e);
      $(".title").textContent = "Erreur de chargement des données";
      return;
    }

    if (!Array.isArray(data) || data.length === 0) {
      $(".title").textContent = "Aucune donnée";
      return;
    }

    const product = id
      ? data.find((p) => String(p.id) === String(id))
      : data[0];

    if (product) {
      document.title = `${product.name} – FoodOrder+ Product`;
      $(".title").textContent = product.name || "Produit";
      $(".badge").textContent = product.category || "category";
      $(".price").textContent = money(product.price);
      $(".desc").textContent = product.description || "";
      renderSizes(product.size);

      const main = $(".gallery .main-img");
      setImg(main, resolveImage(product.image), product.name);

      // --- Thumbnails Logic ---
      const strip = $(".thumb-strip");
      if (strip) {
        strip.innerHTML = "";
        const pool = data.filter(
          (x) => x.category === product.category && x.id !== product.id
        );
        const thumbs = sample(pool.length ? pool : data, 4, product.id);
        thumbs.forEach((t) => {
          const ti = document.createElement("img");
          ti.className = "thumb";
          // Add cursor pointer so user knows it's clickable
          ti.style.cursor = "pointer";

          const src = resolveImage(t.image);
          setImg(ti, src, t.name);

          // CHANGE: Instead of setImg(main...), we reload page with new ID
          ti.addEventListener("click", () => {
            window.location.href = `?id=${t.id}`;
          });

          strip.appendChild(ti);
        });
      }

      // --- Add to Cart Logic ---
      const addToCartBtn = $(".cta");
      if (addToCartBtn) {
        addToCartBtn.replaceWith(addToCartBtn.cloneNode(true)); // Prevent duplicate listeners
        const newBtn = $(".cta");

        newBtn.addEventListener("click", () => {
          const qtyVal = parseInt($("#qtyInput").value, 10) || 1;
          const newItem = {
            id: Date.now(),
            image_card: resolveImage(product.image),
            title_card: product.name,
            description_card: product.description || "",
            price_card: money(product.price),
            quantity: qtyVal,
          };

          let cart = JSON.parse(localStorage.getItem("data_card")) || [];
          const existingIndex = cart.findIndex(
            (item) => item.title_card === newItem.title_card
          );

          if (existingIndex !== -1) {
            cart[existingIndex].quantity += newItem.quantity;
          } else {
            cart.push(newItem);
          }

          localStorage.setItem("data_card", JSON.stringify(cart));

          if (
            typeof cartItems !== "undefined" &&
            typeof displayCartItems === "function"
          ) {
            cartItems = cart;
            displayCartItems();
            const panier = document.querySelector(".panier_container");
            if (panier) panier.classList.add("show");
          } else {
            alert("Added to cart!");
          }
        });
      }
    } else {
      $(".title").textContent = `Produit introuvable (id=${id})`;
    }

    // --- Bottom Grid Logic ---
    const picks = sample(data, 7, product?.id);
    const gridImgs = $$(".grid-container .grid-item img");

    gridImgs.forEach((img, i) => {
      const p = picks[i] || data[i % data.length];
      setImg(img, resolveImage(p.image), p.name);

      // Make grid items clickable too
      img.style.cursor = "pointer";
      img.parentElement.addEventListener("click", () => {
        window.location.href = `?id=${p.id}`;
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
