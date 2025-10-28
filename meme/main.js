// main.js — central loader for meme scripts

(function () {
  const baseScripts = "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/scripts/";
  const baseMeme = "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/meme/";

  const scriptsToLoad = [
    { src: baseScripts + "font-loader.js" },
    { src: baseMeme + "state.js" },
    { src: baseMeme + "utils.js" },
    { src: baseMeme + "canvas.js" },
    { src: baseMeme + "export.js" },
    { src: baseMeme + "gallery.js" },
    { src: baseMeme + "app.js" },
    { src: baseScripts + "page.js" }
  ];

  scriptsToLoad.forEach(script => {
    const s = document.createElement("script");
    s.src = script.src;
    s.async = false; // load in order
    document.head.appendChild(s);
  });
})();
