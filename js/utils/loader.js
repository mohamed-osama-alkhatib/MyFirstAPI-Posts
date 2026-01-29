function toggleLoader(show = true) {
  const loader = document.getElementById("loader");
  if (!loader) return;
  loader.style.visibility = show ? "visible" : "hidden";
}
