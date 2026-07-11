const BASE_URL = "https://listen-api-test.listennotes.com/api/v2";

const podcastsList = document.querySelector(".podcasts-list");
let podcasts = [];

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

    createPodcastList();
  } catch (error) {
    console.log("error: ", error);
  }
}

getPodcasts();

function createPodcastCard(podcast) {
  return `
    <div class="podcast-card">
        <h3>${podcast.title}</h3>
        <img src="${podcast.image}">
        <p>${podcast.publisher}</p>
    </div>`;
}

function createPodcastList() {
  podcasts.forEach((podcast) => {
    podcastsList.insertAdjacentHTML("beforeend", createPodcastCard(podcast));
  });
}
