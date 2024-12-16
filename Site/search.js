$(document).ready( async () => {
    const playlists = await fetch();

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
                        headers: {'Content-Type': 'application/json'},
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
                        headers: {'Content-Type': 'application/json'},
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
                        headers: {'Content-Type': 'application/json'},
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
    const $faveButton = $('<button>').text('Add to Favorites');
    const $addToPlaylistButton = $('<button>').text('Add to Playlist');

    const $buttons = $('<div>', { class: 'buttons' }).append($faveButton, $addToPlaylistButton);
    const $details = $('<div>', { class: 'details' }).append($summary, $buttons);
    $block.append($title, $image, $details);

    try {
        const data = {
            movieID: movie.id,
            username: window.sessionStorage.getItem("user")
        };

        //DEBUG TESTING
        data.username = 'admin';

        const response = await fetch('http://localhost:3000/isFavorite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const isFavorite = await response.json();
            if (isFavorite.isFavorite) {
                $faveButton.addClass('favorite').text('Remove from Favorites');
            } else {
                $faveButton.removeClass('favorite').text('Add to Favorites');
            }
        } else {
            console.log("Error:", await response.json());
            $faveButton.removeClass('favorite').text('Add to Favorites');
        }
    } catch (e) {
        console.log(e);
    }

    // Handle Favorite button click
    $faveButton.on('click', async (event) => {
        const data = {
            movieID: movie.id,
            username: window.sessionStorage.getItem("user")
        };

        //DEBUG TESTING
        data.username = 'admin';

        try {
            if ($faveButton.hasClass('favorite')) {
                const response = await fetch('http://localhost:3000/removeFromFavorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    $faveButton.removeClass('favorite').text('Add to Favorites');
                } else {
                    console.log("Error removing from favorites:", await response.json());
                }
            } else {
                const response = await fetch('http://localhost:3000/addToFavorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    // Immediately update button state without waiting for page reload
                    $faveButton.addClass('favorite').text('Remove from Favorites');
                } else {
                    console.log("Error adding to favorites:", await response.json());
                }
            }
        } catch (error) {
            console.log("Error during favorite button action:", error);
        }
    });

    // Handle Add to Playlist button click
    $addToPlaylistButton.on('click', async (event) => {
        const data = {
            movieID: movie.id,
            username: window.sessionStorage.getItem("user"),
            playlistName: 'newList'
        };

        //DEBUG TESTING
        data.username = 'admin';

        try {
            const response = await fetch('http://localhost:3000/addToPlaylist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log("Movie added to playlist.");
            } else {
                console.log("Error adding to playlist:", await response.json());
            }
        } catch (error) {
            console.log("Error during add to playlist:", error);
        }
    });

    return $block;
}
