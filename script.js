/* ------------------------------------------------------------------
   CSI205TC Question 2 - personal webpage behaviour
   * remembers the reader's colour-theme choice in localStorage
   * reveals each section as it scrolls into view
   * keeps the footer year correct without server-side code
   ------------------------------------------------------------------ */

(function () {
  "use strict";

  var STORAGE_KEY = "csi205tc-theme";
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");

  /* ---------------------------------------------------------- theme */

  function preferredTheme() {
    var saved = null;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      saved = null; /* private mode: fall back to the OS preference */
    }
    if (saved === "dark" || saved === "light") {
      return saved;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (toggle) {
      toggle.textContent = theme === "dark" ? "\u263C" : "\u263E";
      toggle.setAttribute("aria-pressed", String(theme === "dark"));
    }
  }

  applyTheme(preferredTheme());

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch (error) {
        /* storage unavailable: the page still switches, it just forgets */
      }
    });
  }

  /* --------------------------------------------------------- reveal */

  var sections = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (!("IntersectionObserver" in window)) {
    sections.forEach(function (section) {
      section.classList.add("visible");
    });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ----------------------------------------------------------- year */

  var year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
}());
