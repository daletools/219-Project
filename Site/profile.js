$(document).ready(async function() {
    let $favorites = $('#favCarouselInner');
    let $watchlist = $('#watchCarouselInner');

    await getFaves($favorites);

})

async function getFaves(carousel) {
    const data = {
        username: window.sessionStorage.getItem('user'),
        list: 'favorites'
    }

    //DEBUG TESTING
    data.username = 'admin';

    const response = await fetch('http://localhost:3000/getList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    console.log(response);
    if (response.ok) {
        const movies = await response.json();
        for (const movie of movies.movieIds) {
            const info = await fetch('http://localhost:3000/getMovieById', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ movie })
            });

            console.log(movie);
            carousel.append(createCard(info));
        }
    } else {

    }

}

async function createCard(movieId) {
    const $card = $('<div>', { class: 'card' });



    return $card;
}