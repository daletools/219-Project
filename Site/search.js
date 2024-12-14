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