<!-- main.js — fully reliable sequential loader -->

document.addEventListener("DOMContentLoaded", function () {

  const scripts = [
    "https://cdn.jsdelivr.net/gh/jsdeliveries/cdnfiles@main/meme/state.js",
    "https://cdn.jsdelivr.net/gh/jsdeliveries/cdnfiles@main/meme/utils.js",
    "https://cdn.jsdelivr.net/gh/jsdeliveries/cdnfiles@main/meme/canvas.js",
    "https://cdn.jsdelivr.net/gh/jsdeliveries/cdnfiles@main/meme/export.js",
    "https://cdn.jsdelivr.net/gh/jsdeliveries/cdnfiles@main/meme/gallery.js",
    "https://cdn.jsdelivr.net/gh/jsdeliveries/cdnfiles@main/meme/app.js",
    "../scripts/page.js"
  ];

  async function loadScriptsSequentially() {
    for (let i = 0; i < scripts.length; i++) {
      await new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = scripts[i];
        s.defer = true;
        s.onload = resolve;
        s.onerror = () => reject(new Error(`Failed to load ${scripts[i]}`));
        document.body.appendChild(s);
      });
    }
  }

  loadScriptsSequentially().catch(err => console.error(err));
});
