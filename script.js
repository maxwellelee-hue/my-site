const button = document.getElementById("clickme");
const counter = document.getElementById("counter");

let clicks = 0;

button.addEventListener("click", () => {
  clicks++;
  counter.textContent =
    clicks === 1 ? "You clicked 1 time!" : `You clicked ${clicks} times!`;
});

const settingsBtn = document.getElementById("settings-btn");
const settingsPanel = document.getElementById("settings-panel");

settingsBtn.addEventListener("click", () => {
  settingsPanel.classList.toggle("open");
});

document.querySelectorAll(".swatch").forEach(swatch => {
  swatch.addEventListener("click", () => {
    const theme = swatch.dataset.theme;
    document.body.className = theme === "ocean" ? "" : theme;
    localStorage.setItem("theme", theme);
    settingsPanel.classList.remove("open");
  });
});

const saved = localStorage.getItem("theme");
if (saved && saved !== "ocean") document.body.className = saved;
