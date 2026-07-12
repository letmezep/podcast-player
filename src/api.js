import { BASE_URL } from "./config/api.config.js";

export async function getPodcasts(page = 1) {
  const response = await fetch(
    `${BASE_URL}/best_podcasts?sort=recent_published_first&page=${page}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(response.status);
  }

  return response.json();
}

export async function getPodcastDetails(id) {
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
