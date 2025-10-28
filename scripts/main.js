// main.js — central loader for all scripts

(function () {
  const base = "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/scripts/";

  const scripts = [
    "app.js",
    "canvas.js",
    "export.js",
    "font-loader.js",
    "gallery.js",
    "page.js",
    "presets.js",
    "state.js",
    "utils.js"
  ];

  scripts.forEach(file => {
    const s = document.createElement("script");
    s.src = base + file;
    s.async = false; // load in order, change to true if order doesn't matter
    document.head.appendChild(s);
  });
})();
