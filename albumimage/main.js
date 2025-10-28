// main.js — central loader for album image scripts

(function () {
  const baseScripts = "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/scripts/";
  const baseAlbum = "https://cdn.jsdelivr.net/gh/codeumabi/cdnfiles@main/albumimage/";

  const scriptsToLoad = [
    { src: baseScripts + "font-loader.js" },
    { src: baseAlbum + "state.js" },
    { src: baseAlbum + "utils.js" },
    { src: baseAlbum + "canvas.js" },
    { src: baseAlbum + "export.js" },
    { src: baseAlbum + "gallery.js" },
    { src: baseAlbum + "app.js" },
    { src: baseScripts + "page.js" }
  ];

  scriptsToLoad.forEach(script => {
    const s = document.createElement("script");
    s.src = script.src;
    s.async = false; // load in order
    document.head.appendChild(s);
  });
})();
