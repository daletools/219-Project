document.getElementById('searchButton').addEventListener('click', async () => {
    const query = document.getElementById('search').value;
    if (query) {
        try {
            //encodeURI stops special characters from breaking the request
            const response = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`);
            const movies = await response.json();
            displayMovies(movies);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    }
});

function displayMovies(movies) {
    const moviesDiv = document.getElementById('movies');
    moviesDiv.innerHTML = '';

    if (movies.length === 0) {
        moviesDiv.textContent = 'No movies found.';
        return;
    }

    movies.forEach(movie => {
        movieBlock(movie, moviesDiv);
    });
}

async function movieBlock(movie, container) {
    const block = document.createElement('div');
    block.className = "movieBlock";
    let title = document.createElement('span');
    title.innerText = movie.title;

    let poster_path = movie.poster_path;
    let image = document.createElement('img');
    image.src = `https://image.tmdb.org/t/p/w185/${poster_path}`;
    try {
        console.log("Requesting image for movie id" + movie.id);
        const response = await fetch(`http://localhost:3000/getImages?q=${encodeURIComponent(movie.id)}`);
        console.log(response);
    } catch (error) {
        console.log("error fetching poster")
    }

    let overview = movie.overview;
    let summary = document.createElement('div');
    summary.innerHTML = overview;

    block.append(title, image, summary);

    container.appendChild(block);
}