document.getElementById('searchButton').addEventListener('click', async () => {
    const query = document.getElementById('search').value;
    if (query) {
        try {
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

    const ul = document.createElement('ul');
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        console.log(movie);
        ul.appendChild(li);
    });
    moviesDiv.appendChild(ul);
}