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
                    await displayMovies(movies);
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
    const $moviesDiv = $('#movies');
    $moviesDiv.empty();

    if (movies.length === 0) {
        $moviesDiv.text('No movies found.');
        return;
    }

    for (const movie of movies) {
        console.log(movie);
        const $block = await movieBlock(movie);
        $moviesDiv.append($block);
    }
}

async function movieBlock(movie) {
    const $block = $('<div>', { class: 'movieBlock' });
    const $title = $('<span>').text(movie.title);
    const poster_path = movie.poster_path;
    const $image = $('<img>', { src: `https://image.tmdb.org/t/p/w185/${poster_path}` });
    const $summary = $('<div>').html(movie.overview);
    const $faveButton = $('<button>').text('Fav');
    const $addToPlaylistButton = $('<button>').text('Add');

    const $buttons = $('<div>', { class: 'buttons' }).append($faveButton, $addToPlaylistButton);
    const $details = $('<div>', { class: 'details' }).append($summary, $buttons);
    $block.append($title, $image, $details);

    $faveButton.on('click', async (event) => {
        const data = {
            movieID: movie.id,
            username: window.sessionStorage.getItem("user")
        };

        console.log(data);

        //if (!data.user) return;
        //DEBUG TESTING
        data.username = 'admin';

        try {
            const response = await fetch('http://localhost:3000/addToFavorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.log(error);
        }

    });

    $addToPlaylistButton.on('click', async (event) => {
        const data = {
            movieID: movie.id,
            username: window.sessionStorage.getItem("user"),
            playlistName: 'newList'
        };

        //if (!data.user) return;
        //DEBUG TESTING
        data.username = 'admin';

        try {
            const response = await fetch('http://localhost:3000/addToPlaylist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.log(error);
        }
    });

    return $block;
}
