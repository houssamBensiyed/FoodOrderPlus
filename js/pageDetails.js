// Quantity interactions
const input = document.getElementById("qtyInput");

document.getElementById("minus").addEventListener("click", () => {
  const v = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
  input.value = v;
});

document.getElementById("plus").addEventListener("click", () => {
  const v = Math.min(99, (parseInt(input.value, 10) || 1) + 1);
  input.value = v;
});

(function () {
  const DATA_URL = "https://younesbahmoun.github.io/food-order-data/data.json";
  const DATA_BASE = new URL(".", DATA_URL);
  const PLACEHOLDER = "https://placehold.co/800x600?text=Image";
  const id = new URLSearchParams(location.search).get("id");

  const $ = (s, r = document) => r.querySelector();
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (v) => "$" + Number(v ?? 0).toFixed(2);

  const resolveImage = (p) => {
    if (!p) return PLACEHOLDER;
    if (/^https?:\/\//i.test(p)) return p;
    return new URL(p.replace(/^\.\//, ""), DATA_BASE).href;
  };

  const setImg = (img, src, alt) => {
    if (!img) return;
    img.alt = alt || "";
    img.onerror = () => {
      img.onerror = null;
      img.src = PLACEHOLDER;
    };
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
      $(".desc").textContent =
        "Vérifie l’URL " +
        DATA_URL +
        " et lance via un serveur local (ex: npx serve).";
      return;
    }

    if (!Array.isArray(data) || data.length === 0) {
      $(".title").textContent = "Aucune donnée";
      $(".desc").textContent = "Le JSON est vide ou invalide.";
      return;
    }

    const product = id
      ? data.find((p) => String(p.id) === String(id))
      : data[0];

    // Fill product section
    if (product) {
      document.title = `${product.name} – FoodOrder+ Product`;
      $(".title").textContent = product.name || "Produit";
      $(".badge").textContent = product.category || "category";
      $(".price").textContent = money(product.price);
      $(".desc").textContent = product.description || "";
      renderSizes(product.size);

      const main = $(".gallery .main-img");
      setImg(main, resolveImage(product.image), product.name);

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
          const src = resolveImage(t.image);
          setImg(ti, src, t.name);
          ti.addEventListener("click", () => setImg(main, src, t.name));
          strip.appendChild(ti);
        });
      }
    } else {
      $(".title").textContent = `Produit introuvable (id=${id})`;
      $(".desc").textContent = "Essaye ?id=1";
    }

    const picks = sample(data, 7, product?.id);
    const gridImgs = $$(".grid-container .grid-item img");
    gridImgs.forEach((img, i) => {
      const p = picks[i] || data[i % data.length];
      setImg(img, resolveImage(p.image), p.name);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
