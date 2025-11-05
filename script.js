const apiKey = "YOUR_API_KEY"; 
const movieContainer = document.getElementById("movieContainer");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("movieModal");
const modalBody = document.getElementById("modalBody");

// 🍿 Fun popcorn rating based on IMDb score
function getPopcornMeter(rating) {
  if (rating >= 8) return "🍿🍿🍿🍿🍿";
  if (rating >= 6.5) return "🍿🍿🍿🍿";
  if (rating >= 5) return "🍿🍿🍿";
  if (rating > 0) return "🍿🍿";
  return "🍿";
}

// Fetch multiple pages of movies (for more results)
async function loadCategory(category) {
  movieContainer.innerHTML = `<p>Loading ${category} movies...</p>`;
  let allMovies = [];

  for (let page = 1; page <= 10; page++) { // 10 pages × 10 results = 100 movies
    const url = `https://www.omdbapi.com/?s=${category}&page=${page}&apikey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.Search) allMovies = allMovies.concat(data.Search);
  }

  displayMovies(allMovies, category);
}

// Display fetched movies
function displayMovies(movies, title = "") {
  movieContainer.innerHTML = "";
  if (!movies.length) {
    movieContainer.innerHTML = `<p>No results found for "${title}".</p>`;
    return;
  }

  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("movie");
    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>(${movie.Year})</p>
    `;
    card.addEventListener("click", () => openModal(movie.imdbID));
    movieContainer.appendChild(card);
  });
}

// Open modal with movie details
async function openModal(imdbID) {
  const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  modalBody.innerHTML = `
    <img src="${data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/150"}" alt="${data.Title}">
    <h2>${data.Title} (${data.Year})</h2>
    <p><b>Cast:</b> ${data.Actors}</p>
    <p><b>Released:</b> ${data.Released}</p>
    <p><b>Genre:</b> ${data.Genre}</p>
    <p><b>Plot:</b> ${data.Plot}</p>
    <p class="rating"><b>IMDb:</b> ⭐ ${data.imdbRating}</p>
    <p><b>Critics:</b> ${data.Metascore !== "N/A" ? data.Metascore + "/100 Metascore" : "No critic reviews available."}</p>
    <div class="popcorn"><b>Popcorn-O-Meter:</b> ${getPopcornMeter(parseFloat(data.imdbRating))}</div>
  `;

  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

window.onclick = (event) => {
  if (event.target == modal) modal.style.display = "none";
};

// Search by title
searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (query === "") return;
  const url = `https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  displayMovies(data.Search || [], query);
});

// Default load
loadCategory("action");