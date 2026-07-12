import { initSearch } from "./src/search.js";
import { initRouter } from "./src/router.js";

const BASE_URL = "https://listen-api-test.listennotes.com/api/v2";
const app = document.querySelector("#app");
const searchInput = document.querySelector(".search-input");
const searchLoading = document.querySelector(".search-indicator");
let podcasts = [];

initSearch(searchInput, () => podcasts, renderPodcastList);
initRouter(() => renderPodcastList(podcasts), renderPodcastPage);

function createPodcastCard(podcast) {
  return `
    <figure class="podcast-card" data-id="${podcast.id}">
        <img src="${podcast.image}" alt="podcast image">
        <figcaption>
            <h3>${podcast.title}</h3>        
            <p>${podcast.publisher}</p>
        </figcaption>
    </figure>
  `;
}

function openPodcast(id) {
  location.hash = `podcast/${id}`;
}

async function renderPodcastPage(id) {
  try {
    const podcast = await getPodcastDetails(id);

    app.innerHTML = `
        <div class="details-box">
          <button class="back-btn">← Back</button>

          <div class="details-card">
            <img src="${podcast.image}" alt="${podcast.title}">

            <div class="details-info">
              <h2>${podcast.title}</h2>

              <p>${podcast.publisher}</p>
            </div>
          </div>

          <div class="episodes"></div>
        </div>
      `;

    const episodes = document.querySelector(".episodes");

    podcast.episodes.forEach((episode) => {
      episodes.insertAdjacentHTML("beforeend", createEpisodeCard(episode));
    });

    document.querySelector(".back-btn").addEventListener("click", () => {
      history.back();
    });
  } catch (error) {
    console.error(error);
  }
}

function renderPodcastList(list) {
  app.innerHTML = `
  <div class="podcasts-list"></div>
  `;

  const podcastsList = app.querySelector(".podcasts-list");

  list.forEach((podcast) => {
    podcastsList.insertAdjacentHTML("beforeend", createPodcastCard(podcast));
  });

  document.querySelectorAll(".podcast-card").forEach((card) => {
    card.addEventListener("click", () => {
      openPodcast(card.dataset.id);
    });
  });
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (h > 0) {
    return `${h}h ${m}m`;
  }

  return `${m}m`;
}

function createEpisodeCard(episode) {
  return `
  <article class="episode-card">
    <h3>${episode.title}</h3>

    <p>
      ${new Date(episode.pub_date_ms).toLocaleDateString()}
    </p>

    <p>
      ${formatDuration(episode.audio_length_sec)}
    </p>
  </article>`;
}

async function getPodcastDetails(id) {
  const response = await fetch(`${BASE_URL}/podcasts/${id}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.status);
  }

  return response.json();
}

async function getPodcasts(page = 1) {
  searchLoading.classList.remove("hidden");
  try {
    const response = await fetch(
      `${BASE_URL}/best_podcasts?sort=recent_published_first&page=${page}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`error HTTP: ${response.status}`);
    }

    const data = await response.json();
    podcasts = data.podcasts;

    console.log("podcasts: ", podcasts);
    if (!location.hash) {
      renderPodcastList(podcasts);
    } else {
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  } catch (error) {
    console.log("error: ", error);
  } finally {
    searchLoading.classList.add("hidden");
  }
}

getPodcasts();
