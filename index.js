import { initSearch } from "./src/search.js";
import { initRouter } from "./src/router.js";

const BASE_URL = "https://listen-api-test.listennotes.com/api/v2";
// const podcastsList = document.querySelector(".podcasts-list");
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

  // renderPodcastPage(id);
}

function renderPodcastPage(id) {
  const podcast = podcasts.find((item) => item.id === id);

  if (!podcast) return;

  app.innerHTML = `
      <button class="back-btn">← Back</button>

      <img src="${podcast.image}" alt="${podcast.title}">

      <h2>${podcast.title}</h2>

      <p>${podcast.publisher}</p>
  `;

  document.querySelector(".back-btn").addEventListener("click", () => {
    history.back();
  });
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
    // console.log(podcasts);

    // renderPodcastList(podcasts);
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
