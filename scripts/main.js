// main.js — central loader for all scripts

(function () {
  const base = "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/scripts/";

  const scripts = [
    "font-loader.js",
    "presets.js",
    "utils.js",
    "state.js",
    "canvas.js",
    "export.js",
    "gallery.js",
    "app.js",
    "page.js"
  ];

  scripts.forEach(file => {
    const s = document.createElement("script");
    s.src = base + file;
    s.async = false; // load in order
    document.head.appendChild(s);
  });
})();
