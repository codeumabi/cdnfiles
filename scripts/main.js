<!-- main.js — fully reliable sequential loader -->

document.addEventListener("DOMContentLoaded", function () {
  const scripts = [
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/scripts/font-loader.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/scripts/presets.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/scripts/utils.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/scripts/state.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/scripts/canvas.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/scripts/export.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/scripts/gallery.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/scripts/app.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/scripts/page.js"
  ];

  async function loadScriptsSequentially() {
    for (let i = 0; i < scripts.length; i++) {
      await new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = scripts[i];
        s.onload = resolve;
        s.onerror = () => reject(new Error(`Failed to load ${scripts[i]}`));
        document.body.appendChild(s);
      });
    }
  }

  loadScriptsSequentially().catch(err => console.error(err));
});
