(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");

  // Sombra en el header al hacer scroll.
  function onScroll() {
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menú móvil.
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
      });
    });
  }

  // Animaciones "reveal on scroll".
  // Cada tarjeta dentro de un grupo [data-reveal-stagger] se observa por
  // separado: si se observara el contenedor completo, en pantallas angostas
  // (una sola columna con muchas tarjetas apiladas) su altura total supera
  // varias veces la del viewport y nunca llega a cubrir el 15% requerido,
  // así que la animación no se dispara y el contenido queda con opacity:0.
  var staggerGroups = document.querySelectorAll("[data-reveal-stagger]");
  var staggerChildren = [];
  staggerGroups.forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child) {
      staggerChildren.push(child);
    });
  });

  var revealTargets = Array.prototype.slice
    .call(document.querySelectorAll("[data-reveal]"))
    .concat(staggerChildren);

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Año dinámico en el footer.
  var yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
