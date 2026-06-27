const button = document.getElementById("clickme");
const counter = document.getElementById("counter");

let clicks = 0;

button.addEventListener("click", () => {
  clicks++;
  counter.textContent =
    clicks === 1 ? "You clicked 1 time!" : `You clicked ${clicks} times!`;
});
