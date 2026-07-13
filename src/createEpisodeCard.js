import { getPodcastDetails } from "./api.js";
import { playEpisode } from "./player.js";

const app = document.querySelector("#app");

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}h ${m}min ${s}sec`;
  }

  return `${m}min ${s}sec`;
}

export function createEpisodeCard(episode) {
  return `
  <article class="episode-card">
    <h3>${episode.title}</h3>

    <button class="play-btn" data-id="${episode.id}">
      ▶
    </button>

    <p>
      ${new Date(episode.pub_date_ms).toLocaleDateString()}
    </p>

    <p>
      ${formatDuration(episode.audio_length_sec)}
    </p>
  </article>`;
}

export async function renderPodcastPage(id) {
  const header = document.querySelector("header");

  try {
    const details = await getPodcastDetails(id);

    app.innerHTML = `
        <div class="details-box">
          <button class="back-btn">← Back</button>

          <div class="details-card">
            <img src="${details.image}" alt="${details.title}">

            <div class="details-info">
              <h2>${details.title}</h2>

              <p>${details.publisher}</p>
            </div>
          </div>

          <div class="episode-box"></div>
        </div>
      `;

    const episodes = app.querySelector(".episode-box");

    details.episodes.forEach((episode) => {
      episodes.insertAdjacentHTML("beforeend", createEpisodeCard(episode));
    });

    const buttons = app.querySelectorAll(".play-btn");

    buttons.forEach((button, index) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();

        playEpisode(details.episodes[index], button);
      });
    });

    app.querySelector(".back-btn").addEventListener("click", () => {
      history.back();
    });
  } catch (error) {
    console.error(error);
  }
}
