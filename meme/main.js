// main.js — fully reliable sequential loader
document.addEventListener("DOMContentLoaded", function () {
  const scripts = [
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/scripts/font-loader.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/meme/state.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/meme/utils.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/meme/canvas.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/meme/export.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/gallery/canvas.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/meme/app.js",
    "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/scripts/page.js"
  ];

  async function loadScriptsSequentially() {
    for (let i = 0; i < scripts.length; i++) {
      await new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = scripts[i];
        s.async = false; // ✅ ensures strict sequential execution
        s.onload = resolve;
        s.onerror = () => reject(new Error(`Failed to load ${scripts[i]}`));
        document.body.appendChild(s);
      });
    }
  }

  loadScriptsSequentially().catch(err => console.error(err));
});
