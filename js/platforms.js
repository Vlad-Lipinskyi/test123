const platformsContainer = document.getElementById("platformsContainer");

async function loadPlatforms() {
  platformsContainer.innerHTML = `
        <div class="loader">
            Загрузка платформ...
        </div>
    `;

  try {
    const data = await fetchPlatforms();

    renderPlatforms(data.results);
  } catch (error) {
    console.error(error);

    platformsContainer.innerHTML = `
            <div class="loader">
                Не удалось загрузить платформы.
            </div>
        `;
  }
}

function renderPlatforms(platforms) {
  if (!platforms || platforms.length === 0) {
    platformsContainer.innerHTML = `
            <div class="loader">
                Платформы не найдены.
            </div>
        `;

    return;
  }

  platformsContainer.innerHTML = platforms
    .map((platform) => createPlatformCard(platform))
    .join("");
}

function createPlatformCard(platform) {
  const image =
    platform.image_background ||
    platform.image ||
    "https://via.placeholder.com/600x400?text=Platform";

  const gamesCount = platform.games_count || 0;

  return `
        <article class="platform-card">

            <img
                class="platform-card__image"
                src="${image}"
                alt="${escapeHTML(platform.name)}"
                loading="lazy"
            >


            <div class="platform-card__overlay"></div>


            <div class="platform-card__content">

                <h2>
                    ${escapeHTML(platform.name)}
                </h2>


                <p>
                    ${gamesCount.toLocaleString("ru-RU")}
                    игр
                </p>

            </div>

        </article>
    `;
}

function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text || "";

  return div.innerHTML;
}

loadPlatforms();
