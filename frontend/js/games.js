const gamesContainer = document.getElementById("games");
const searchInput = document.getElementById("search");
const orderbySelect = document.getElementById("orderby");

const platformIcons = {
  PlayStation: '<i class="fab fa-playstation"></i>',
  Xbox: '<i class="fab fa-xbox"></i>',
  PC: '<i class="fab fa-windows"></i>',
  "Apple Machintosh": '<i class="fab fa-apple"></i>',
  iOS: '<i class="fab fa-apple"></i>',
  Android: '<i class="fab fa-android"></i>',
  Linux: '<i class="fab fa-linux"></i>',
  Nintendo: '<i class="fas fa-n"></i>',
};

function getPlatformIcons(platforms) {
  return platforms
    .split(",")
    .map((platform) => platformIcons[platform] || "")
    .join(" ");
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function showLoader() {
  gamesContainer.innerHTML = "";
  document.getElementById("loader-div").classList.remove("hidden");
}

function hideLoader() {
  document.getElementById("loader-div").classList.add("hidden");
}

async function fetchGames(search = "", orderby = "") {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (orderby && orderby !== "relevance") params.append("orderby", orderby);
  params.append("limit", 20);

  showLoader();
  const response = await fetch(
    `https://taller-2-webmovil.onrender.com/api/games?${params.toString()}`
  );
  const data = await response.json();
  hideLoader();
  displayGames(data.games);
}

function displayGames(games) {
  games.forEach((game) => {
    const gameCard = document.createElement("div");
    gameCard.classList.add(
      "bg-zinc-800",
      "rounded-lg",
      "shadow-md",
      "overflow-hidden",
      "transform",
      "transition",
      "hover:scale-105",
      "text-white"
    );
    let metacriticColor = "";
    if (game.metacritic >= 75) {
      metacriticColor = "text-lime-500";
    } else if (game.metacritic >= 50) {
      metacriticColor = "text-yellow-500";
    } else if (game.metacritic < 50) {
      metacriticColor = "text-red-500";
    }

    const platforms = getPlatformIcons(game.platforms || []);

    const metacriticDiv = game.metacritic
      ? `<div class="font-bold ${metacriticColor} border py-0.5 flex items-center px-1.5 rounded text-sm">${game.metacritic}</div>`
      : "";

    gameCard.innerHTML = `
      <img src="${game.image}" alt="${game.name}" class="w-full object-cover">
      <div class="p-4">
        <div class="flex justify-between items-center mb-2">
          <span class="flex gap-1.5">${platforms}</span>
          ${metacriticDiv}
        </div>
        <h3 class="text-lg font-bold mb-2">${game.name}</h3>
        <div class="flex justify-between">
          <p class="text-xs text-neutral-500">Release date:</p>
          <p class="text-xs ml-1">${formatDate(game.released)}</p>
        </div>
        <hr class="my-4 text-neutral-700" />
        <div class="flex justify-between">
          <p class="text-xs text-neutral-500">Genres:</p>
          <p class="w-1/2 flex justify-end-safe text-xs ml-1">${game.genres
            .split(",")
            .join(", ")}</p>
        </div>
      </div>
    `;

    gamesContainer.appendChild(gameCard);
  });
}

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedFetchGames = debounce(() => {
  fetchGames(searchInput.value, orderbySelect.value);
}, 500);

searchInput.addEventListener("input", debouncedFetchGames);

orderbySelect.addEventListener("change", () => {
  fetchGames(searchInput.value, orderbySelect.value);
});

fetchGames();
