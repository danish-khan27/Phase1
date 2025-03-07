// Get the container for movie cards
const pictures = document.getElementById('pictures');

// Fetch and display movies from db.json
function displayMovies() {
    fetch('http://localhost:3000/movies')
        .then(response => response.json())
        .then(movies => {
            pictures.innerHTML = ''; 
            movies.forEach(movie => {
                let movieDiv = document.createElement('div');
                movieDiv.classList.add('gallery');

                movieDiv.innerHTML = `
                    <img src="${movie.image}" alt="${movie.title}" class="movie-poster">
                    <h2>${movie.title} (${movie.year})</h2>
                    <p>${movie.description}</p>
                    <div class="buttons">
                        <button onclick="likeMovie('${movie.id}')">👍 Like</button>
                        <button onclick="dislikeMovie('${movie.id}')">👎 Dislike</button>
                        <button onclick="deleteMovie('${movie.id}')">🗑️ Delete</button>
                    </div>
                    <p id="likes-${movie.id}">Likes: ${movie.likes}</p>
                    <p id="dislikes-${movie.id}">Dislikes: ${movie.dislikes}</p>
                `;

                pictures.appendChild(movieDiv);
            });
        })
        .catch(error => console.error('Error fetching movies:', error));
}

// Like a movie (PATCH request to increment likes)
function likeMovie(movieId) {
    fetch(`http://localhost:3000/movies/${movieId}`)
        .then(response => response.json())
        .then(movie => {
            const updatedLikes = movie.likes + 1;

            return fetch(`http://localhost:3000/movies/${movieId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ likes: updatedLikes })
            });
        })
        .then(() => displayMovies())
        .catch(error => console.error('Error updating likes:', error));
}

// Dislike a movie (PATCH request to increment dislikes)
function dislikeMovie(movieId) {
    fetch(`http://localhost:3000/movies/${movieId}`)
        .then(response => response.json())
        .then(movie => {
            const updatedDislikes = movie.dislikes + 1;

            return fetch(`http://localhost:3000/movies/${movieId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dislikes: updatedDislikes })
            });
        })
        .then(() => displayMovies())
        .catch(error => console.error('Error updating dislikes:', error));
}

// Delete a movie (DELETE request)
function deleteMovie(movieId) {
    fetch(`http://localhost:3000/movies/${movieId}`, {
        method: 'DELETE'
    })
    .then(() => displayMovies())  
    .catch(error => console.error('Error deleting movie:', error));
}

// Handle adding a new movie via form submission
document.getElementById('reviewForm').onsubmit = function(event) {
    event.preventDefault();

    const newMovie = {
        id: crypto.randomUUID(), 
        title: document.getElementById('movieTitle').value,
        description: document.getElementById('movieDescription').value,
        year: parseInt(document.getElementById('movieYear').value, 10),
        image: document.getElementById('movieImage').value || 'https://via.placeholder.com/400x300', 
        likes: 0,
        dislikes: 0
    };

    fetch('http://localhost:3000/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie)
    })
    .then(() => {
        displayMovies();  
        document.getElementById('reviewForm').reset();  
    })
    .catch(error => console.error('Error adding movie:', error));
};

// Initial load when page opens
window.onload = displayMovies;
