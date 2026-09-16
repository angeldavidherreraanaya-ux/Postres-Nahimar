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
  document.querySelectorAll(".product-card, .contact-card, .featured-card").forEach((el, i) => {
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

          gsap.from(".hero-title", { y: 46, opacity: 0, duration: 1.1, ease: "power3.out" });
          gsap.from(".hero-badge, .hero-tagline, .hero-ctas", {
            y: 26,
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power2.out",
            delay: 0.15,
          });
      });
    });

    const canvas = document.getElementById("crumbs-fx");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const crumbs = Array.from({ length: 9 }, () => spawn(true));
      let running = true;

      function rand(a, b) { return a + Math.random() * (b - a); }

      function spawn(any) {
        return {
          x: rand(0, canvas.width),
          y: any ? rand(0, canvas.height) : rand(canvas.height, canvas.height + 40),
          r: rand(2, 4.5),
          vy: rand(-0.25, -0.6),
          vx: rand(-0.15, 0.15),
          a: rand(0.08, 0.28),
          hue: Math.random() < 0.32 ? 40 : 340,
        };
      }

      function resize() {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
      }

      function tick() {
        if (!running) return;
        resize();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const c of crumbs) {
          c.y += c.vy;
          c.x += c.vx + Math.sin(c.y * 0.01) * 0.02;
          if (c.y < -10) Object.assign(c, spawn(false));
          ctx.fillStyle = c.hue === 40 ? `rgba(180,130,60,${c.a})` : `rgba(224,49,95,${c.a})`;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
          ctx.fill();
        }
        requestAnimationFrame(tick);
      }

      document.addEventListener("visibilitychange", () => {
        running = !document.hidden;
        if (running) requestAnimationFrame(tick);
      });

      tick();
    }
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