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
const desktop = window.matchMedia("(min-width: 821px)").matches;

const load = (src, onload) => {
  const s = document.createElement("script");
  s.src = src;
  s.onload = onload;
  document.head.appendChild(s);
};

if (!reduceMotion) {
  document.querySelectorAll(".product-card, .contact-card").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 3) * 0.1}s`;
  });

  if (desktop) {
    const anchors = Array.from(document.querySelectorAll('a[href^="#"]'));
    load(
      "https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js",
      () => {
        window.lenis = new Lenis({ lerp: 0.09 });
        const raf = (t) => {
          window.lenis.raf(t);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
        anchors.forEach((a) =>
          a.addEventListener("click", (e) => {
            const id = a.getAttribute("href");
            if (id.length > 1) {
              e.preventDefault();
              window.lenis.scrollTo(id);
            }
          })
        );
      }
    );
    load("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js", () => {
      load("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js", () => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray("[data-parallax]").forEach((el) => {
          gsap.to(el, {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      });
    });
  }
}

if ("IntersectionObserver" in window) {
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
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
}