require("dotenv").config();

const express = require('express');
const path = require('path');
const app = express()
const bodyParser = require("body-parser");
var request = require('request');
const port = process.env.PORT || 3080

app.use(bodyParser.json());
app.use(express.static((path.join(__dirname, './dist/shopify-challenge'))));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/api/searchMovies', function (req, res) {
  const searchTerm = req.body.searchTerm;
  request(`http://www.omdbapi.com/?apikey=${process.env.API_KEY}&s=${searchTerm}`, (error, response, body) => {
    res.json(body);
  });
});

app.get('/', (req, res) => {
  res.sendFile('index.html', {root: 'dist/shopify-challenge/'});
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});
