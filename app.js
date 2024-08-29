const express = require('express');
const app = express();
const fs = require('fs');

let movies = JSON.parse(fs.readFileSync('./data/movies.json'));

app.use(express.json()); //Middleware

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// GET - api/v1/movies
app.get('/api/v1/movies', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      movies: movies,
    },
  });
});

// GET - api/v1/movies/id
app.get('/api/v1/movies/:id', (req, res) => {
  const id = +req.params.id;
  
  const movie = movies.find((movie) => movie.id === id);
  console.log(movie);
  
  if (!movie) {
    return res.status(404).json({
      status: 'failed',
      message: 'Movie not found'
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      movie: movie
    }
  })

})

// POST - api/v1/movies
app.post('/api/v1/movies', (req, res) => {
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
});

// Patch - api/v1/movies/:id
app.patch('/api/v1/movies/:id', (req, res) => {
  const id = +req.params.id;
  const movie = movies.find((movie) => movie.id === id);
  if (!movie) {
    return res.status(404).json({
      status: 'failed',
      message: 'Movie not found'
    })
  }

  const movieIndex = movies.findIndex((movie) => movie.id === id);

  let updatedMovie = {...movies[movieIndex], ...req.body}
  movies[movieIndex] = updatedMovie;

  fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
    if(err){
      return res.status(400).json({
        status: 'failed',
        message: 'something went wrong'
      })
    }
    res.status(200).json({
      status: 'success',
      data: {
        movie: updatedMovie
      }
    })
  })

})
