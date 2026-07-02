function activateTab(tabName) {
  const tab = document.querySelector(`.tab[data-tab="${tabName}"]`);
  const panel = document.getElementById("tab-" + tabName);
  if (!tab || !panel) return;

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  tab.classList.add("active");
  panel.classList.add("active");
}

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    const tabName = tab.dataset.tab;
    activateTab(tabName);
    history.pushState({ tab: tabName }, "", "#" + tabName);
  });
});

window.addEventListener("popstate", e => {
  const tabName = e.state?.tab ?? "about";
  activateTab(tabName);
});

const initial = location.hash.slice(1);
if (initial && document.querySelector(`.tab[data-tab="${initial}"]`)) {
  activateTab(initial);
  history.replaceState({ tab: initial }, "", "#" + initial);
} else {
  history.replaceState({ tab: "about" }, "", location.href);
}
