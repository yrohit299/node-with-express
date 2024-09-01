const express = require('express');
const moviesController = require('../Controllers/moviesController');

let router = express.Router();

// This middleware will called only if id is there in URL
router.param('id', moviesController.checkID)

router.route('/')
    .get(moviesController.getMovies)
    .post(moviesController.validBodyParams, moviesController.createMovie);

router.route('/:id')
    .get(moviesController.getMovie)
    .patch(moviesController.updateMovie)
    .delete(moviesController.deleteMovie);

module.exports = router;
