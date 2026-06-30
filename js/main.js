/* ============================================================
   Febry — site interactions
   ============================================================ */
(function () {
  "use strict";

  /* ----- Current year in footer ----- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- Sticky header state on scroll ----- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ----- Mobile navigation ----- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  var backdrop = document.getElementById("nav-backdrop");
  var navClose = document.getElementById("nav-close");

  function setMenu(open) {
    menu.classList.toggle("open", open);
    toggle.classList.toggle("open", open);
    if (backdrop) {
      backdrop.classList.toggle("open", open);
      backdrop.hidden = false; // managed via CSS opacity/pointer-events
    }
    toggle.setAttribute("aria-expanded", String(open));
    // Lock background scroll while the menu is open (mobile only).
    document.body.style.overflow = open ? "hidden" : "";
  }
  function closeMenu() { setMenu(false); }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(!menu.classList.contains("open"));
    });
    if (navClose) navClose.addEventListener("click", closeMenu);
    if (backdrop) backdrop.addEventListener("click", closeMenu);
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
    // If the viewport grows back to desktop, make sure state is reset.
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860 && menu.classList.contains("open")) closeMenu();
    });
  }

  /* ----- Reveal on scroll ----- */
  var revealEls = document.querySelectorAll(
    ".section-head, .exp-content, .tile, .step, .split-media, .split-body, .g-item"
  );
  revealEls.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ----- Lightbox gallery ----- */
  var gallery = document.getElementById("gallery");
  var lightbox = document.getElementById("lightbox");
  if (gallery && lightbox) {
    var images = Array.prototype.slice.call(gallery.querySelectorAll("img"));
    var lbImg = document.getElementById("lb-img");
    var current = 0;

    function show(i) {
      current = (i + images.length) % images.length;
      lbImg.src = images[current].src;
      lbImg.alt = images[current].alt;
    }
    function openLb(i) {
      show(i);
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function closeLb() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    images.forEach(function (img, i) {
      img.addEventListener("click", function () { openLb(i); });
    });
    lightbox.querySelector(".lb-close").addEventListener("click", closeLb);
    lightbox.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
    lightbox.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") show(current + 1);
      if (e.key === "ArrowLeft") show(current - 1);
    });
  }

  /* ----- Contact form -----
     Posts via fetch to Formspree if a real form ID is set.
     Otherwise falls back to opening the user's email client. */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (form) {
    var FALLBACK_EMAIL = "hello@febry.com"; // TODO: keep in sync with the address in index.html

    form.addEventListener("submit", function (e) {
      var action = form.getAttribute("action") || "";
      var notConfigured = action.indexOf("YOUR_FORM_ID") !== -1 || action === "";

      if (notConfigured) {
        // Graceful fallback: build a mailto so enquiries still reach Febry.
        e.preventDefault();
        var data = new FormData(form);
        var subject = encodeURIComponent("Bali enquiry — " + (data.get("experience") || ""));
        var body = encodeURIComponent(
          "Name: " + (data.get("name") || "") + "\n" +
          "Email: " + (data.get("email") || "") + "\n" +
          "Experience: " + (data.get("experience") || "") + "\n\n" +
          (data.get("message") || "")
        );
        window.location.href = "mailto:" + FALLBACK_EMAIL + "?subject=" + subject + "&body=" + body;
        setStatus("Opening your email app… or message me on WhatsApp above.", "ok");
        return;
      }

      // Real submission via Formspree (AJAX, no page redirect).
      e.preventDefault();
      setStatus("Sending…", "");
      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            setStatus("Thank you! I'll be in touch within 48 hours.", "ok");
          } else {
            setStatus("Something went wrong — please WhatsApp me instead.", "err");
          }
        })
        .catch(function () {
          setStatus("Network error — please WhatsApp me instead.", "err");
        });
    });

    function setStatus(msg, cls) {
      status.textContent = msg;
      status.className = "form-status" + (cls ? " " + cls : "");
    }
  }
})();
