const express = require('express');
const app = express();
const fs = require('fs');

let movies = JSON.parse(fs.readFileSync('./data/movies.json'));

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/api/v1/movies', (req, res) => {
    res.status(200).json({
        status: "success",
        data : {
            movies: movies
        }
    })
})