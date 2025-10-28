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

    function loadScript(index) {
        if (index >= scripts.length) return;
        const s = document.createElement("script");
        s.src = base + scripts[index];
        s.onload = () => loadScript(index + 1); // load next only after current
        document.head.appendChild(s);
    }

    loadScript(0);
})();
