<!-- main.js — dynamic loader for all scripts -->
<script>
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

  // Load scripts sequentially (preserves dependency order)
  function loadSequentially(index = 0) {
    if (index >= scripts.length) return;
    const s = document.createElement("script");
    s.src = base + scripts[index];
    s.defer = true;
    s.onload = () => loadSequentially(index + 1);
    document.head.appendChild(s);
  }

  loadSequentially();
})();
</script>
