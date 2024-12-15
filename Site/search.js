$(document).ready( () => {
    $('#searchButton').on('click', async (event) => {
        const data = {
            query: $('#search').val(),
            genres: $('#genres').val().filter(value => value !== ''),
            providers: $('#providers').val().filter(value => value !== '')
        };
        if (data.genres.length === 0 && data.providers.length === 0) {
            if (data.query) {
                //title search no filters
                try {
                    const response = await fetch('http://localhost:3000/search', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    const movies = await response.json();
                    await displayMovies(movies);
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            if (data.query) {
                //title search, then filter
                try {
                    console.log('filtered search');
                    const response = await fetch('http://localhost:3000/filteredSearch', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    const movies = await response.json();


                } catch (error) {
                    console.log(error);
                }
            } else {
                //just filters
                console.log('just filters');
                console.log(data);
                try {
                    const response = await fetch('http://localhost:3000/discover', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    const movies = await response.json();
                    await displayMovies(movies);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    })
});

async function displayMovies(movies) {
    const moviesDiv = document.getElementById('movies');
    moviesDiv.innerHTML = '';

    if (movies.length === 0) {
        moviesDiv.textContent = 'No movies found.';
        return;
    }

    for (const movie of movies) {
        console.log(movie);
        const block = await movieBlock(movie);
        moviesDiv.appendChild(block);
    }
}

async function movieBlock(movie) {
    const block = document.createElement('div');
    block.className = "movieBlock";
    let title = document.createElement('span');
    title.innerText = movie.title;

    let poster_path = movie.poster_path;
    let image = document.createElement('img');

    image.src = `https://image.tmdb.org/t/p/w185/${poster_path}`;

    let overview = movie.overview;
    let summary = document.createElement('div');
    summary.innerHTML = overview;

    block.append(title, image, summary);

    return block;
}