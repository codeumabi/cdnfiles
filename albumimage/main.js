// albumimage/main.js — fully reliable sequential loader

(async function () {
  const scripts = [
    // include presets.js first — often required for default settings or styles
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/albumimage/presets.js",
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
      s.defer = false; // ensure sequential execution
      s.onload = resolve;
      s.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(s);
    });
  }

  console.log("✅ All albumimage scripts loaded successfully");
})();
