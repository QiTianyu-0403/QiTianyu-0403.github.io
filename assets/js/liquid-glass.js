(function () {
  "use strict";

  function groupSections(content) {
    var nodes = Array.prototype.slice.call(content.children);
    var introNodes = [];
    var currentSection = null;

    nodes.forEach(function (node) {
      if (node.tagName === "H1") {
        currentSection = document.createElement("section");
        currentSection.className = "glass-section reveal-on-scroll";
        currentSection.setAttribute("aria-labelledby", node.id);
        content.appendChild(currentSection);

        if (introNodes.length) {
          introNodes.forEach(function (introNode) {
            currentSection.appendChild(introNode);
          });
          introNodes = [];
        }
        currentSection.appendChild(node);
      } else if (currentSection) {
        currentSection.appendChild(node);
      } else {
        introNodes.push(node);
      }
    });
  }

  function setupReveal() {
    var elements = document.querySelectorAll(".reveal-on-scroll");
    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (element) { element.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

    elements.forEach(function (element, index) {
      element.style.setProperty("--reveal-delay", Math.min(index * 55, 280) + "ms");
      observer.observe(element);
    });
  }

  function setupSpotlight() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var cards = document.querySelectorAll(".glass-section, .profile_box, .paper-box");
    cards.forEach(function (card) {
      var raf = 0;
      card.addEventListener("pointermove", function (event) {
        if (raf) return;
        raf = window.requestAnimationFrame(function () {
          var rect = card.getBoundingClientRect();
          card.style.setProperty("--pointer-x", (event.clientX - rect.left) + "px");
          card.style.setProperty("--pointer-y", (event.clientY - rect.top) + "px");
          raf = 0;
        });
      }, { passive: true });
    });
  }

  function setupNavigation() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".visible-links a[href*='#']"));
    links.forEach(function (link) { link.setAttribute("target", "_self"); });

    if (!("IntersectionObserver" in window)) return;
    var headings = document.querySelectorAll(".glass-section > h1[id]");
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          var hash = link.getAttribute("href").split("#")[1];
          link.classList.toggle("is-active", hash === entry.target.id);
        });
      });
    }, { rootMargin: "-18% 0px -68%", threshold: 0 });
    headings.forEach(function (heading) { observer.observe(heading); });
  }

  function setupAmbientMotion() {
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        document.documentElement.style.setProperty("--page-scroll", window.scrollY + "px");
        ticking = false;
      });
    }, { passive: true });
  }

  function restoreHashPosition(initialHash) {
    if (!initialHash) return;
    var target = document.getElementById(initialHash.slice(1));
    if (!target) return;
    window.addEventListener("load", function () {
      window.setTimeout(function () {
        document.documentElement.style.scrollBehavior = "auto";
        var top = target.getBoundingClientRect().top + window.pageYOffset - 104;
        window.scrollTo(0, Math.max(0, top));
        history.replaceState(null, "", window.location.pathname + window.location.search + initialHash);
        target.closest(".glass-section").classList.add("is-visible");
        window.requestAnimationFrame(function () {
          document.documentElement.style.scrollBehavior = "";
        });
      }, 120);
    }, { once: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var initialHash = window.location.hash;
    if (initialHash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      window.scrollTo(0, 0);
    }
    document.body.classList.add("liquid-glass-theme");
    var content = document.querySelector(".page__content");
    if (content) groupSections(content);
    var profile = document.querySelector(".profile_box");
    if (profile) profile.classList.add("reveal-on-scroll");
    setupReveal();
    setupSpotlight();
    setupNavigation();
    restoreHashPosition(initialHash);
  });
})();
