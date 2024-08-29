const express = require('express');
const app = express();
const fs = require('fs');

let movies = JSON.parse(fs.readFileSync('./data/movies.json'));

app.use(express.json()); //Middleware

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const getMovies = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      movies: movies,
    },
  });
};

const getMovie = (req, res) => {
  const id = +req.params.id;
  const movie = movies.find((movie) => movie.id === id);
  console.log(movie);

  if (!movie) {
    return res.status(404).json({
      status: 'failed',
      message: 'Movie not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      movie: movie,
    },
  });
};

const createMovie = (req, res) => {
  const newId = movies.length + 1;
  const newMovie = { id: newId, ...req.body };

  movies.push(newMovie);
  fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        movies: newMovie,
      },
    });
  });
};

const updateMovie = (req, res) => {
  const id = +req.params.id;
  const movie = movies.find((movie) => movie.id === id);
  if (!movie) {
    return res.status(404).json({
      status: 'failed',
      message: 'Movie not found',
    });
  }

  const movieIndex = movies.findIndex((movie) => movie.id === id);

  let updatedMovie = { ...movies[movieIndex], ...req.body };
  movies[movieIndex] = updatedMovie;

  fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
    if (err) {
      return res.status(400).json({
        status: 'failed',
        message: 'something went wrong',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        movie: updatedMovie,
      },
    });
  });
};

const deleteMovie = (req, res) => {
  // Getting id from the URL
  const id = +req.params.id;
  // Finding index to be deleted
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  // Remove the movie from the array
  movies.splice(movieIndex, 1); // Remove the movie from specified index

  // Writing the updated json to the file
  fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
    if (err) {
      return res.status(400).json({
        status: 'failed',
        message: 'something went wrong',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};

// // GET - api/v1/movies
// app.get('/api/v1/movies', getMovies);

// // GET - api/v1/movies/id
// app.get('/api/v1/movies/:id', getMovie);

// // POST - api/v1/movies
// app.post('/api/v1/movies', createMovie);

// // Patch - api/v1/movies/:id
// app.patch('/api/v1/movies/:id', updateMovie);

// // Delete - api/v1/movies/:id
// app.delete('/api/v1/movies/:id', deleteMovie);

app.route('/api/v1/movies').get(getMovies).post(createMovie);
app
  .route('/api/v1/movies/:id')
  .get(getMovie)
  .patch(updateMovie)
  .delete(deleteMovie);
