const themeToggle = document.getElementById("themeToggle");

const savedTheme =
  localStorage.getItem("theme") || "light";

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");

    if (themeToggle) {
      themeToggle.checked = true;
    }
  } else {
    document.body.classList.remove("dark");

    if (themeToggle) {
      themeToggle.checked = false;
    }
  }
}

applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("change", () => {
    const newTheme =
      themeToggle.checked ? "dark" : "light";

    localStorage.setItem("theme", newTheme);

    applyTheme(newTheme);
  });
}

const scrollTopButton = document.createElement("button");

scrollTopButton.type = "button";
scrollTopButton.className = "scroll-top";
scrollTopButton.setAttribute(
  "aria-label",
  "Вернуться наверх"
);
scrollTopButton.setAttribute(
  "title",
  "Вернуться наверх"
);

scrollTopButton.innerHTML = `
  <img
    src="./assets/svg/arrow-up-btn.svg"
    alt=""
  >
`;

document.body.appendChild(scrollTopButton);

function updateScrollTopButton() {
  if (window.scrollY > 400) {
    scrollTopButton.classList.add("visible");
  } else {
    scrollTopButton.classList.remove("visible");
  }
}

window.addEventListener(
  "scroll",
  updateScrollTopButton,
  { passive: true }
);

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

updateScrollTopButton();