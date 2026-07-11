const BASE_URL = "https://listen-api-test.listennotes.com/api/v2";

const podcastsList = document.querySelector(".podcasts-list");
let podcasts = [];
const searchInput = document.querySelector(".search-input");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  if (query === "") {
    renderPodcastList(podcasts);
    return;
  }

  const filtered = podcasts.filter((podcast) =>
    podcast.title.toLowerCase().includes(query),
  );
  renderPodcastList(filtered);
});

function createPodcastCard(podcast) {
  return `
    <figure class="podcast-card">
        <img src="${podcast.image}" alt="podcast image">
        <figcaption>
            <h3>${podcast.title}</h3>        
            <p>${podcast.publisher}</p>
        </figcaption>
    </figure>
  `;
}

function renderPodcastList(list) {
  podcastsList.innerHTML = "";

  list.forEach((podcast) => {
    podcastsList.insertAdjacentHTML("beforeend", createPodcastCard(podcast));
  });
}

async function getPodcasts(page = 1) {
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

    renderPodcastList(podcasts);
  } catch (error) {
    console.log("error: ", error);
  }
}

getPodcasts();
