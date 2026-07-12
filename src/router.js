export function initRouter(renderList, renderPodcast) {
  function router() {
    const hash = location.hash;

    if (!hash || hash === "#") {
      renderList();
      return;
    }

    if (hash.startsWith("#podcast/")) {
      const id = hash.substring("#podcast/".length);
      renderPodcast(id);
    }
  }

  window.addEventListener("hashchange", router);

  router();
}
