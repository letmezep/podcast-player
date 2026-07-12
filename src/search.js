function debounce(fn, delay = 400) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export function initSearch(searchInput, getPodcasts, renderPodcastList) {
  const handleSearch = debounce(() => {
    const query = searchInput.value.trim().toLowerCase();

    const podcasts = getPodcasts();

    if (!query) {
      renderPodcastList(podcasts);
      return;
    }

    const filtered = podcasts.filter((podcast) =>
      podcast.title.toLowerCase().includes(query),
    );

    renderPodcastList(filtered);
  }, 400);

  searchInput.addEventListener("input", handleSearch);
}
