fetch("../components/header.html")
  .then(r => r.text())
  .then(html => document.getElementById("header").innerHTML = html);

fetch("../components/footer.html")
  .then(r => r.text())
  .then(html => document.getElementById("footer").innerHTML = html);


const slides = [
  {
    img: "./assets/home/carousel-1.jpg",
    title: "Flavor Feast Experience",
    desc: "A Perfect Mix of Freshness, Crunch, and Bold Taste.",
  },
  {
    img: "./assets/home/carousel-2.jpg",
    title: "Authentic Indian Feast",
    desc: "Rich Flavors, Fresh Herbs, and Traditional Spices.",
  },
  {
    img: "./assets/home/carousel-3.jpg",
    title: "Gourmet Dining Experience",
    desc: "Where Sophisticated Flavors Meet Elegant Presentation.",
  },
];

let index = 0;

const carousel = document.getElementById("carousel");
const title = document.getElementById("title");
const description = document.getElementById("description");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

function updateSlide() {
  carousel.src = slides[index].img;
  title.textContent = slides[index].title;
  description.textContent = slides[index].desc;
}

nextBtn.addEventListener("click", () => {
  index = (index + 1) % slides.length;
  updateSlide();
});

prevBtn.addEventListener("click", () => {
  index = (index - 1 + slides.length) % slides.length;
  updateSlide();
});
