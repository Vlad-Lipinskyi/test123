const API_KEY =
  "c22b2ee8886243a9b4ca77fa7f3f589b";

const API_URL =
  "https://api.rawg.io/api";

async function fetchGames(options = {}) {
  const params =
    new URLSearchParams();

  params.append(
    "key",
    API_KEY
  );

  params.append(
    "page",
    options.page || 1
  );

  params.append(
    "page_size",
    options.pageSize || 20
  );

  if (options.search) {
    params.append(
      "search",
      options.search
    );
  }

  if (options.platforms) {
    params.append(
      "platforms",
      options.platforms
    );
  }

  if (options.ordering) {
    params.append(
      "ordering",
      options.ordering
    );
  }

  const url =
    `${API_URL}/games?${params.toString()}`;

  const response =
    await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Ошибка API: ${response.status}`
    );
  }

  return await response.json();
}

async function fetchPlatforms() {
  const params =
    new URLSearchParams();

  params.append(
    "key",
    API_KEY
  );

  params.append(
    "page_size",
    "100"
  );

  const url =
    `${API_URL}/platforms?${params.toString()}`;

  const response =
    await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Ошибка API: ${response.status}`
    );
  }

  return await response.json();
}