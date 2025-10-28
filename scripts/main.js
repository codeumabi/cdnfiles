<!-- main.js — dynamic loader with absolute CDN paths -->
<script>
(function () {
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

  // Load scripts in sequence (ensures dependencies work correctly)
  function loadSequentially(index = 0) {
    if (index >= scripts.length) return;
    const script = document.createElement("script");
    script.src = scripts[index];
    script.defer = true;
    script.onload = () => loadSequentially(index + 1);
    document.head.appendChild(script);
  }

  loadSequentially();
})();
</script>
