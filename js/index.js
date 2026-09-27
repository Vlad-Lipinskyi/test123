const gamesContainer =
  document.getElementById("gamesContainer");

const searchInput =
  document.getElementById("searchInput");

const searchButton =
  document.getElementById("searchButton");

const filterButtons =
  document.querySelectorAll(".filter-button");

const sortSelect =
  document.getElementById("sortSelect");

const sortDirection =
  document.getElementById("sortDirection");

const sortDirectionIcon =
  document.getElementById("sortDirectionIcon");

const viewButtons =
  document.querySelectorAll(".view-button");

const prevButton =
  document.getElementById("prevButton");

const nextButton =
  document.getElementById("nextButton");

const pageNumber =
  document.getElementById("pageNumber");

const pagination =
  document.querySelector(".pagination");

let currentPage =
  Number(localStorage.getItem("gamePage")) || 1;

let currentPlatform =
  localStorage.getItem("gamePlatform") || "";

let currentSearch =
  localStorage.getItem("gameSearch") || "";

let currentOrdering =
  localStorage.getItem("gameOrdering") || "rating";

let currentDirection =
  localStorage.getItem("gameDirection") || "desc";

let currentColumns =
  localStorage.getItem("gameColumns") || "4";

let totalPages = 1;

const pageSize = 20;

searchInput.value = currentSearch;
sortSelect.value = currentOrdering;

function updateSortDirectionIcon() {
  if (!sortDirectionIcon) {
    return;
  }

  sortDirectionIcon.src =
    currentDirection === "desc"
      ? "./assets/svg/arrow-up.svg"
      : "./assets/svg/arrow-down.svg";
}

function updateActivePlatform() {
  filterButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.platform === currentPlatform
    );
  });
}

function updateActiveView() {
  viewButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.columns === currentColumns
    );
  });

  gamesContainer.style.setProperty(
    "--columns",
    currentColumns
  );
}

function getFavorites() {
  return JSON.parse(
    localStorage.getItem("favorites") || "[]"
  );
}

function saveFavorites(favorites) {
  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );
}

function isFavorite(id) {
  return getFavorites().some(
    (game) => Number(game.id) === Number(id)
  );
}

function toggleFavorite(game) {
  const favorites = getFavorites();

  const index = favorites.findIndex(
    (item) => Number(item.id) === Number(game.id)
  );

  if (index !== -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push({
      id: game.id,
      name: game.name,
      background_image: game.background_image,
      rating: game.rating,
      released: game.released
    });
  }

  saveFavorites(favorites);
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderGames(games) {
  if (!games || games.length === 0) {
    gamesContainer.innerHTML = `
      <div class="loader">
        Игры не найдены
      </div>
    `;

    return;
  }

  gamesContainer.innerHTML = games
    .map((game, index) => {
      const favorite =
        isFavorite(game.id);

      const image =
        game.background_image ||
        "https://via.placeholder.com/600x400?text=No+Image";

      const rating =
        game.rating
          ? game.rating.toFixed(1)
          : "—";

      const released =
        game.released || "Дата неизвестна";

      return `
        <article
          class="game-card"
          style="animation-delay: ${index * 0.05}s"
        >
          <div class="game-card__image">
            <img
              src="${image}"
              alt="${escapeHTML(game.name)}"
              loading="lazy"
            />

            <div class="game-card__overlay"></div>

            <button
              class="favorite-button ${favorite ? "active" : ""}"
              data-id="${game.id}"
              aria-label="Добавить в избранное"
              title="Добавить в избранное"
            >
              ${favorite ? "♥" : "♡"}
            </button>
          </div>

          <div class="game-card__content">
            <h3 class="game-card__title">
              ${escapeHTML(game.name)}
            </h3>

            <div class="game-card__meta">
              <span class="game-card__rating">
                ★ ${rating}
              </span>

              <span>
                Релиз: ${escapeHTML(released)}
              </span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  document
    .querySelectorAll(".favorite-button")
    .forEach((button) => {
      button.addEventListener(
        "click",
        (event) => {
          event.stopPropagation();

          const id =
            Number(button.dataset.id);

          const game =
            games.find(
              (item) =>
                Number(item.id) === id
            );

          if (!game) {
            return;
          }

          toggleFavorite(game);

          const active =
            button.classList.toggle(
              "active"
            );

          button.textContent =
            active ? "♥" : "♡";
        }
      );
    });
}

function createPageButton(page) {
  const button =
    document.createElement("button");

  button.type = "button";
  button.className =
    "pagination__page";

  button.textContent = page;

  if (page === currentPage) {
    button.classList.add("active");
  }

  button.addEventListener(
    "click",
    () => {
      if (page === currentPage) {
        return;
      }

      currentPage = page;

      localStorage.setItem(
        "gamePage",
        currentPage
      );

      loadGames();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  );

  return button;
}

function createDots() {
  const span =
    document.createElement("span");

  span.className =
    "pagination__dots";

  span.textContent = "...";

  return span;
}

function renderPagination() {
  if (!pagination) {
    return;
  }

  pagination
    .querySelectorAll(
      ".pagination__page, .pagination__dots"
    )
    .forEach((element) => {
      element.remove();
    });

  const pages = [];

  if (totalPages <= 6) {
    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {
      pages.push(page);
    }
  } else if (currentPage <= 4) {
    pages.push(1, 2, 3, 4, 5);
    pages.push("dots");
    pages.push(totalPages);
  } else if (
    currentPage >= totalPages - 3
  ) {
    pages.push(1);
    pages.push("dots");

    for (
      let page = totalPages - 4;
      page <= totalPages;
      page++
    ) {
      pages.push(page);
    }
  } else {
    pages.push(1);
    pages.push("dots");
    pages.push(
      currentPage - 1,
      currentPage,
      currentPage + 1
    );
    pages.push("dots");
    pages.push(totalPages);
  }

  pages.forEach((page) => {
    if (page === "dots") {
      pagination.insertBefore(
        createDots(),
        nextButton
      );
    } else {
      pagination.insertBefore(
        createPageButton(page),
        nextButton
      );
    }
  });

  prevButton.disabled =
    currentPage <= 1;

  nextButton.disabled =
    currentPage >= totalPages;

  pageNumber.style.display = "none";
}

async function loadGames() {
  gamesContainer.innerHTML = `
    <div class="loader">
      Загрузка игр...
    </div>
  `;

  try {
    const ordering =
      currentDirection === "desc"
        ? `-${currentOrdering}`
        : currentOrdering;

    const data =
      await fetchGames({
        page: currentPage,
        pageSize,
        search: currentSearch,
        platforms: currentPlatform,
        ordering
      });

    totalPages =
      Math.max(
        1,
        Math.ceil(
          data.count / pageSize
        )
      );

    if (
      currentPage > totalPages
    ) {
      currentPage = totalPages;

      localStorage.setItem(
        "gamePage",
        currentPage
      );

      return loadGames();
    }

    renderGames(data.results);
    renderPagination();
  } catch (error) {
    console.error(error);

    gamesContainer.innerHTML = `
      <div class="loader">
        Не удалось загрузить игры
      </div>
    `;

    totalPages = 1;

    renderPagination();
  }
}

searchButton.addEventListener(
  "click",
  () => {
    currentSearch =
      searchInput.value.trim();

    localStorage.setItem(
      "gameSearch",
      currentSearch
    );

    currentPage = 1;

    localStorage.setItem(
      "gamePage",
      currentPage
    );

    loadGames();
  }
);

searchInput.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Enter") {
      searchButton.click();
    }
  }
);

filterButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        currentPlatform =
          button.dataset.platform;

        localStorage.setItem(
          "gamePlatform",
          currentPlatform
        );

        currentPage = 1;

        localStorage.setItem(
          "gamePage",
          currentPage
        );

        updateActivePlatform();

        loadGames();
      }
    );
  }
);

sortSelect.addEventListener(
  "change",
  () => {
    currentOrdering =
      sortSelect.value;

    localStorage.setItem(
      "gameOrdering",
      currentOrdering
    );

    currentPage = 1;

    localStorage.setItem(
      "gamePage",
      currentPage
    );

    loadGames();
  }
);

sortDirection.addEventListener(
  "click",
  () => {
    currentDirection =
      currentDirection === "desc"
        ? "asc"
        : "desc";

    localStorage.setItem(
      "gameDirection",
      currentDirection
    );

    updateSortDirectionIcon();

    currentPage = 1;

    localStorage.setItem(
      "gamePage",
      currentPage
    );

    loadGames();
  }
);

viewButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        currentColumns =
          button.dataset.columns;

        localStorage.setItem(
          "gameColumns",
          currentColumns
        );

        updateActiveView();
      }
    );
  }
);

prevButton.addEventListener(
  "click",
  () => {
    if (currentPage <= 1) {
      return;
    }

    currentPage--;

    localStorage.setItem(
      "gamePage",
      currentPage
    );

    loadGames();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
);

nextButton.addEventListener(
  "click",
  () => {
    if (currentPage >= totalPages) {
      return;
    }

    currentPage++;

    localStorage.setItem(
      "gamePage",
      currentPage
    );

    loadGames();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
);

sortSelect.value =
  currentOrdering;

updateSortDirectionIcon();
updateActivePlatform();
updateActiveView();

loadGames();