// main.js — central loader for all scripts

(function () {
  const base = "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/albumimage/";

  const scripts = [
    "state.js",
    "utils.js",
    "canvas.js",
    "export.js",
    "gallery.js",
    "app.js",
  ];

  scripts.forEach(file => {
    const s = document.createElement("script");
    s.src = base + file;
    s.async = false; // load in order, change to true if order doesn't matter
    document.head.appendChild(s);
  });
})();
