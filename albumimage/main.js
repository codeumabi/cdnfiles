(async function () {
  const scripts = [
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/albumimage/state.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/albumimage/utils.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/albumimage/canvas.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/albumimage/export.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/albumimage/gallery.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/albumimage/app.js"
  ];

  for (const src of scripts) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(s);
    });
  }
})();
