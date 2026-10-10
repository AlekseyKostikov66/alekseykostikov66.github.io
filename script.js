/* ============================================================
   Ошейник или рассвет — интерактив
   - Плейсхолдеры для отсутствующих картинок
   - Мобильное меню-гамбургер
   - Полоса прогресса чтения
   - Кнопка "наверх"
   - Активная ссылка в левом меню (ПК) и в мобильном
   - Плавный скролл по якорям
   ============================================================ */

(function () {
  "use strict";

  /* -------- Плейсхолдеры для картинок -------- */
  document.querySelectorAll(".chapter-image img").forEach(function (img) {
    img.addEventListener("error", function () {
      img.parentElement.classList.add("image-missing");
    });
  });

  /* -------- Мобильное меню -------- */
  var menuToggle = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("open");
      menuToggle.classList.toggle("open", isOpen);
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* -------- Полоса прогресса -------- */
  var progressBar = document.getElementById("progressBar");

  function updateProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = percent + "%";
  }

  /* -------- Кнопка наверх -------- */
  var toTop = document.getElementById("toTop");

  function toggleToTop() {
    if (!toTop) return;
    if (window.scrollY > 500) toTop.classList.add("show");
    else toTop.classList.remove("show");
  }

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* -------- Активная ссылка в меню -------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll(".chapter"));
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".toc-nav a, .mobile-nav a")
  );

  function setActiveLink() {
    var fromTop = window.scrollY + 140;
    var current = null;

    sections.forEach(function (section) {
      if (section.offsetTop <= fromTop) current = section.id;
    });

    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) return;
      var id = href.replace("#", "");
      link.classList.toggle("active", id === current);
    });
  }

  /* -------- Единый обработчик скролла (rAF) -------- */
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateProgress();
      toggleToTop();
      setActiveLink();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* -------- Плавный скролл по якорям с поправкой на шапку -------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var href = a.getAttribute("href");
      if (!href || href === "#" || href === "#top") {
        if (href === "#top") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }
      var id = href.slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      var isMobile = window.matchMedia("(max-width: 1100px)").matches;
      var offset = isMobile ? 76 : 40;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: top, behavior: "smooth" });
      history.replaceState(null, "", "#" + id);
    });
  });

  /* -------- Первый прогон -------- */
  updateProgress();
  toggleToTop();
  setActiveLink();
})();
