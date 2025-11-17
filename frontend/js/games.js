const gamesContainer = document.getElementById("games");
const searchInput = document.getElementById("search");
const orderbySelect = document.getElementById("orderby");

async function fetchGames(search = "", orderby = "") {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (orderby) params.append("orderby", orderby);
  params.append("limit", 20);

  const response = await fetch(
    `http://localhost:8000/api/games?${params.toString()}`
  );
  const data = await response.json();
  displayGames(data.games);
}

function displayGames(games) {
  gamesContainer.innerHTML = "";
  games.forEach((game) => {
    const gameCard = document.createElement("div");
    gameCard.classList.add(
      "bg-white",
      "rounded-lg",
      "shadow-md",
      "overflow-hidden",
      "transform",
      "transition",
      "hover:scale-105"
    );

    gameCard.innerHTML = `
      <img src="${game.image || "https://via.placeholder.com/250"}" alt="${
      game.name
    }" class="w-full h-40 object-cover">
      <div class="p-4">
        <h3 class="text-lg font-bold mb-2">${game.name}</h3>
        <p class="text-sm text-gray-600">Released: ${game.released || "N/A"}</p>
        <p class="text-sm text-gray-600">Metacritic: ${
          game.metacritic || "N/A"
        }</p>
      </div>
    `;

    gamesContainer.appendChild(gameCard);
  });
}

searchInput.addEventListener("input", () => {
  fetchGames(searchInput.value, orderbySelect.value);
});

orderbySelect.addEventListener("change", () => {
  fetchGames(searchInput.value, orderbySelect.value);
});

fetchGames();
