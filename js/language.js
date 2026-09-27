const translations = {
  ru: {
    games: "Игры",
    platforms: "Платформы",
    favorites: "Избранное",

    gameCatalog: "GAME CATALOG",

    heroTitle: "Мир видеоигр<br>в одном месте",

    heroDescription:
      "Находи любимые игры, изучай платформы и добавляй игры в избранное.",

    catalogTitle: "Каталог игр",

    catalogDescription:
      "Найди игру по своему вкусу",

    searchPlaceholder: "Поиск игры...",

    searchLabel: "Поиск",

    platform: "Платформа",

    all: "Все",

    pc: "PC",

    playstation: "PlayStation 4",

    xbox: "Xbox One",

    switch: "Nintendo Switch",

    sorting: "Сортировка",

    rating: "По рейтингу",

    released: "По дате выхода",

    popularity: "По популярности",

    name: "По названию",

    gamesPerRow: "Игр в ряд",

    previous: "← Назад",

    next: "Вперёд →",

    loading: "Загрузка игр...",

    error: "Не удалось загрузить игры.",

    noGames: "Игры не найдены",

    footerPowered: "Powered by RAWG",

    scrollTop: "Наверх",

    sortDirection:
      "Изменить направление сортировки"
  },

  en: {
    games: "Games",

    platforms: "Platforms",

    favorites: "Favorites",

    gameCatalog: "GAME CATALOG",

    heroTitle:
      "The world of video games<br>in one place",

    heroDescription:
      "Find your favorite games, explore platforms and add games to your favorites.",

    catalogTitle: "Game Catalog",

    catalogDescription:
      "Find a game to your taste",

    searchPlaceholder: "Search games...",

    searchLabel: "Search",

    platform: "Platform",

    all: "All",

    pc: "PC",

    playstation: "PlayStation 4",

    xbox: "Xbox One",

    switch: "Nintendo Switch",

    sorting: "Sorting",

    rating: "By rating",

    released: "By release date",

    popularity: "By popularity",

    name: "By name",

    gamesPerRow: "Games per row",

    previous: "← Previous",

    next: "Next →",

    loading: "Loading games...",

    error: "Failed to load games.",

    noGames: "No games found",

    footerPowered: "Powered by RAWG",

    scrollTop: "Back to top",

    sortDirection:
      "Change sorting direction"
  }
};

let currentLanguage =
  localStorage.getItem("language") || "ru";

function applyLanguage(language) {
  if (!translations[language]) {
    language = "ru";
  }

  currentLanguage = language;

  localStorage.setItem(
    "language",
    currentLanguage
  );

  document.documentElement.lang =
    currentLanguage;

  document
    .querySelectorAll("[data-i18n]")
    .forEach((element) => {
      const key =
        element.dataset.i18n;

      const translation =
        translations[currentLanguage][key];

      if (translation) {
        element.innerHTML = translation;
      }
    });

  document
    .querySelectorAll("[data-i18n-placeholder]")
    .forEach((element) => {
      const key =
        element.dataset.i18nPlaceholder;

      const translation =
        translations[currentLanguage][key];

      if (translation) {
        element.placeholder =
          translation;
      }
    });

  document
    .querySelectorAll("[data-i18n-title]")
    .forEach((element) => {
      const key =
        element.dataset.i18nTitle;

      const translation =
        translations[currentLanguage][key];

      if (translation) {
        element.title = translation;
      }
    });

  document
    .querySelectorAll("[data-i18n-aria-label]")
    .forEach((element) => {
      const key =
        element.dataset.i18nAriaLabel;

      const translation =
        translations[currentLanguage][key];

      if (translation) {
        element.setAttribute(
          "aria-label",
          translation
        );
      }
    });

  document
    .querySelectorAll("[data-language]")
    .forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.language ===
          currentLanguage
      );
    });
}

function translate(key) {
  return (
    translations[currentLanguage]?.[key] ||
    translations.ru[key] ||
    key
  );
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    document
      .querySelectorAll("[data-language]")
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            applyLanguage(
              button.dataset.language
            );
          }
        );
      });

    applyLanguage(currentLanguage);
  }
);