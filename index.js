import { getPodcasts } from "./src/api.js";
import { initSearch } from "./src/search.js";
import { initRouter } from "./src/router.js";
import { renderPodcastPage } from "./src/createEpisodeCard.js";

const app = document.querySelector("#app");
const header = document.querySelector("header");
const searchInput = document.querySelector(".search-input");
const searchLoading = document.querySelector(".search-indicator");
let podcasts = [];

initSearch(searchInput, () => podcasts, renderPodcastList);
initRouter(() => renderPodcastList(podcasts), renderPodcastPage);

function createPodcastCard(podcast) {
  return `
    <figure class="podcast-card" data-id="${podcast.id}">
        <img src="${podcast.image}" alt="podcast image">
        <figcaption class="podcast-card__description">
            <h3>${podcast.title}</h3>        
            <p>${podcast.publisher}</p>
        </figcaption>
    </figure>
  `;
}

function openPodcast(id) {
  location.hash = `podcast/${id}`;
}

function renderPodcastList(list) {
  document.querySelector("header").classList.remove("hidden");
  app.innerHTML = `
  <div class="podcasts-list"></div>
  `;

  const podcastsList = app.querySelector(".podcasts-list");

  list.forEach((podcast) => {
    podcastsList.insertAdjacentHTML("beforeend", createPodcastCard(podcast));
  });

  app.querySelectorAll(".podcast-card").forEach((card) => {
    card.addEventListener("click", () => {
      openPodcast(card.dataset.id);
    });
  });
}

async function loadPodcasts() {
  searchLoading.classList.remove("hidden");

  try {
    const data = await getPodcasts();

    podcasts = data.podcasts;

    if (!location.hash) {
      renderPodcastList(podcasts);
    } else {
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  } catch (error) {
    console.error(error);
  } finally {
    searchLoading.classList.add("hidden");
  }
}

console.log("app: ", app);
loadPodcasts();
