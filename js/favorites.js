const favoritesContainer = document.getElementById("favoritesContainer");

const API_KEY = "c22b2ee8886243a9b4ca77fa7f3f589b";

const API_URL = "https://api.rawg.io/api";

async function getGameById(id) {
  const response = await fetch(`${API_URL}/games/${id}?key=${API_KEY}`);

  if (!response.ok) {
    throw new Error("Не удалось получить игру");
  }

  return await response.json();
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

async function loadFavorites() {
  const favorites = getFavorites();

  if (favorites.length === 0) {
    showEmpty();

    return;
  }

  favoritesContainer.innerHTML = `
        <div class="loader">
            Загрузка избранного...
        </div>
    `;

  try {
    const games = await Promise.all(
      favorites.map((favorite) => getGameById(favorite.id)),
    );

    renderFavorites(games);
  } catch (error) {
    console.error(error);

    favoritesContainer.innerHTML = `
            <div class="loader">
                Не удалось загрузить избранные игры.
            </div>
        `;
  }
}

function renderFavorites(games) {
  favoritesContainer.innerHTML = games
    .map((game) => createGameCard(game))
    .join("");

  document.querySelectorAll(".favorite-button").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);

      removeFavorite(id);

      button.closest(".game-card").remove();

      if (document.querySelectorAll(".game-card").length === 0) {
        showEmpty();
      }
    });
  });
}

function createGameCard(game) {
  const image =
    game.background_image ||
    "https://via.placeholder.com/600x400?text=No+Image";

  const rating = game.rating ? game.rating.toFixed(1) : "—";

  const released = game.released || "Дата неизвестна";

  return `
        <article class="game-card">

            <img
                class="game-card__image"
                src="${image}"
                alt="${escapeHTML(game.name)}"
                loading="lazy"
            >


            <button
                class="favorite-button active"
                data-id="${game.id}"
                aria-label="Удалить из избранного"
            >
                ♥
            </button>


            <div class="game-card__content">

                <h3 class="game-card__title">
                    ${escapeHTML(game.name)}
                </h3>


                <div class="game-card__rating">
                    ★ ${rating}
                </div>


                <div class="game-card__meta">
                    Релиз: ${released}
                </div>

            </div>

        </article>
    `;
}

function removeFavorite(id) {
  let favorites = getFavorites();

  favorites = favorites.filter((game) => game.id !== id);

  saveFavorites(favorites);
}

function showEmpty() {
  favoritesContainer.innerHTML = `
        <div class="empty-favorites">

            <h2>
                Избранное пока пустое
            </h2>

            <p>
                Добавляй игры в избранное
                на странице каталога.
            </p>

        </div>
    `;
}

function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text || "";

  return div.innerHTML;
}

loadFavorites();
