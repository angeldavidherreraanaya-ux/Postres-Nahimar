const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open);
  });

  navMenu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let ticking = false;
function updateParallax() {
  const y = window.scrollY;
  document.querySelectorAll("[data-parallax]").forEach((el) => {
    const speed = parseFloat(el.dataset.parallax);
    el.style.transform = `translate3d(0, ${(-y * speed).toFixed(1)}px, 0)`;
  });
  ticking = false;
}

if (!reduceMotion && window.matchMedia("(min-width: 821px)").matches) {
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
}

const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

function revelar() {
  const cards = document.querySelectorAll(".product-card, .contact-card");
  cards.forEach((el, i) => {
    el.classList.add("reveal");
    const d = el.getAttribute("style") || "";
    el.setAttribute("style", `${d} transition-delay:${(i % 3) * 0.1}s`);
  });
}

if (!reduceMotion && window.matchMedia("(min-width: 821px)").matches) revelar();