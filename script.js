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

const sliderEls = document.querySelectorAll(".slider");
sliderEls.forEach((slider) => {
  const track = slider.querySelector(".slider-track");
  const imgs = Array.from(track.querySelectorAll("img"));
  const dotsWrap = slider.parentElement.querySelector(".slider-dots");
  let idx = 0;

  const show = (i) => {
    idx = (i + imgs.length) % imgs.length;
    imgs.forEach((img, n) => img.classList.toggle("active", n === idx));
    if (dotsWrap) dotsWrap.querySelectorAll("button").forEach((b, n) => b.classList.toggle("active", n === idx));
  };

  const prev = slider.querySelector(".prev");
  const next = slider.querySelector(".next");
  if (prev) prev.addEventListener("click", () => show(idx - 1));
  if (next) next.addEventListener("click", () => show(idx + 1));

  if (dotsWrap) {
    imgs.forEach((_, n) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", `Foto ${n + 1}`);
      b.addEventListener("click", () => show(n));
      dotsWrap.appendChild(b);
    });
  }

  show(0);
});

const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const stage = lightbox.querySelector(".lightbox-stage");
  const img = stage.querySelector("img");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const zo = lightbox.querySelector(".lightbox-zoom-in");
  const zc = lightbox.querySelector(".lightbox-zoom-out");
  let scale = 1, ox = 0, oy = 0, startX = 0, startY = 0, dragging = false, pinchDist = 0;

  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const apply = () => {
    img.style.transform = `translate(${ox}px, ${oy}px) scale(${scale})`;
  };
  const zoom = (d, cx, cy) => {
    const ns = clamp(scale * d, 1, 6);
    const k = ns / scale;
    ox = clamp(cx - (cx - ox) * k, -img.width * ns / 2, img.width * ns / 2);
    oy = clamp(cy - (cy - oy) * k, -img.height * ns / 2, img.height * ns / 2);
    scale = ns;
    apply();
  };

  const open = (src, alt) => {
    img.src = src;
    img.alt = alt || "";
    scale = 1; ox = 0; oy = 0;
    apply();
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-lightbox]").forEach((el) => {
    el.querySelectorAll("img").forEach((i) => {
      i.addEventListener("click", (e) => { e.stopPropagation(); open(i.currentSrc || i.src, i.alt); });
    });
    const zb = el.querySelector(".zoom-btn");
    if (zb) zb.addEventListener("click", (e) => {
      e.stopPropagation();
      const i = el.querySelector(".slider-track img.active") || el.querySelector("img");
      open(i.currentSrc || i.src, i.alt);
    });
  });

  closeBtn.addEventListener("click", close);
  zo.addEventListener("click", () => zoom(1.35, img.clientWidth / 2, img.clientHeight / 2));
  zc.addEventListener("click", () => zoom(1 / 1.35, img.clientWidth / 2, img.clientHeight / 2));
  stage.addEventListener("wheel", (e) => { e.preventDefault(); zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15, img.clientWidth / 2, img.clientHeight / 2); }, { passive: false });

  stage.addEventListener("pointerdown", (e) => {
    if (scale <= 1) return;
    dragging = true;
    startX = e.clientX - ox;
    startY = e.clientY - oy;
    img.classList.add("dragging");
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    ox = clamp(e.clientX - startX, -img.width * scale, img.width * scale);
    oy = clamp(e.clientY - startY, -img.height * scale, img.height * scale);
    apply();
  });
  stage.addEventListener("pointerup", () => { dragging = false; img.classList.remove("dragging"); });

  const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  stage.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const d = dist(e.touches);
      if (pinchDist) zoom(d / pinchDist, img.clientWidth / 2, img.clientHeight / 2);
      pinchDist = d;
    }
  }, { passive: false });
  stage.addEventListener("touchend", () => { pinchDist = 0; });

  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
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