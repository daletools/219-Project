$(document).ready(async function() {
    // const $favsCarousel = $('#favsCarousel');
    // await getFaves($favsCarousel, 'favorites');
    //
    // const $watchCarousel = $('#towatchCarousel');
    // await getFaves($watchCarousel, 'watchlist');

    $('#username').text(window.sessionStorage.getItem('user'));

    const $favoritesGallery = $('#favorites');
    const $watchlistGallery = $('#watchlist');

    await populateGallery($favoritesGallery, 'favorites');
    await populateGallery($watchlistGallery, 'watchlist');

})

async function populateGallery($gallery, listName) {
    const data = {
        username: window.sessionStorage.getItem('user'),
        playlistName: listName
    }

    //DEBUG TESTING
    data.username = 'admin';

    const response = await fetch('http://localhost:3000/getList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const movies = await response.json();

        try {
            for (const movieID of movies.movieIds) {
                const info = await fetch('http://localhost:3000/getMovieById', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ movie: movieID })
                });

                const movie = await info.json();

                // Add to gallery
                const $img = $('<img>', { src: `https://image.tmdb.org/t/p/w185/${movie.poster_path}`, alt: movie.title });
                $gallery.append($img);

            }
        } catch (e) {
            console.log($gallery);
        }
    } else {
        console.log(response);
    }
}

async function getFaves($carousel, listName) {
    const data = {
        username: window.sessionStorage.getItem('user'),
        playlistName: listName
    }

    //DEBUG TESTING
    data.username = 'admin';

    const response = await fetch('http://localhost:3000/getList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const movies = await response.json();
        const $carouselInner = $carousel.find('.carousel-inner');
        $carouselInner.empty(); // Clear existing slides

        let isFirst = true;
        try {
            for (const movieID of movies.movieIds) {
                const info = await fetch('http://localhost:3000/getMovieById', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ movie: movieID })
                });

                const movie = await info.json();

                // Add a new carousel item
                const $item = $(`
                <div class="carousel-item ${isFirst ? 'active' : ''}">
                    <img src="https://image.tmdb.org/t/p/w185/${movie.poster_path}" class="d-block w-100" alt="${movie.title}">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${movie.title}</h5>
                    </div>
                </div>
            `);

                $carouselInner.append($item);
                isFirst = false; // Only the first item should be marked active
            }
        } catch (e) {
            console.log($carousel);
        }

    } else {
        console.log(response);
    }
}