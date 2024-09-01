const express = require('express');
const morgan = require('morgan');
const moviesRouter = require('./Routes/moviesRoutes');

const app = express();

//Middleware
app.use(express.json());
app.use(express.static('./public'))
app.use(morgan('dev'));
app.use((req, res, next) => {
  console.log('middleware called');
  req.updatedAt = new Date().toISOString();
  next();
});
app.use('/api/v1/movies', moviesRouter);

module.exports = app;
