const fs = require('fs');
let movies = JSON.parse(fs.readFileSync('./data/movies.json'));

exports.checkID = (req,res, next, value) => {
  const movie = movies.find((movie) => movie.id === +value);
  if (!movie) {
    return res.status(404).json({
      status: 'failed',
      message: 'Movie not found',
    });
  }

  next();
}

exports.validBodyParams = (req, res, next) => {
  if(!req.body.Title || !req.body.Year || !req.body.Runtime ){
    return res.status(400).json({
      status: 'failed',
      message: 'Invalid request body',
    })
  }
  next();
}

exports.getMovies = (req, res) => {
  res.status(200).json({
    status: 'success',
    updatedAt: req.updatedAt,
    data: {
      movies: movies,
    },
  });
};

exports.getMovie = (req, res) => {
  const id = +req.params.id;
  const movie = movies.find((movie) => movie.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      movie: movie,
    },
  });
};

exports.createMovie = (req, res) => {
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

exports.updateMovie = (req, res) => {
  const id = +req.params.id;

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

exports.deleteMovie = (req, res) => {
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