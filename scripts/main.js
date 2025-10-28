<!-- main.js — fully reliable loader with absolute CDN paths -->
<script>
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

  function loadScript(i) {
    if (i >= scripts.length) return;
    const s = document.createElement("script");
    s.src = scripts[i];
    s.onload = () => loadScript(i + 1);
    document.body.appendChild(s);
  }

  loadScript(0);
});
</script>
