const audio = document.querySelector("#audio-player");
const player = document.querySelector(".player");
const playerTitle = document.querySelector(".player__title");

let currentEpisodeId = null;
let currentButton = null;

export function playEpisode(episode, button) {
  player.classList.remove("hidden");

  if (currentEpisodeId !== episode.id) {
    audio.src = episode.audio;
    playerTitle.textContent = episode.title;

    audio.play();

    if (currentButton) {
      currentButton.textContent = "▶";
    }

    button.textContent = "⏸";

    currentEpisodeId = episode.id;
    currentButton = button;

    return;
  }

  if (audio.paused) {
    audio.play();
    button.textContent = "⏸";
  } else {
    audio.pause();
    button.textContent = "▶";
  }
}

audio.addEventListener("ended", () => {
  if (currentButton) {
    currentButton.textContent = "▶";
  }

  currentEpisodeId = null;
  currentButton = null;
});
