// Imports relevant dependencies
var express = require('express');
var cors = require('cors');
var path = require('path');

// Creates instance of an express server
var app = express();

// Connect to mongoDB database
var connectDB = require('./config/db');

// Initialise middleware
app.use(
  cors({
    origin: 'http://localhost:3000'
  })
);
app.use(express.json({ extended: false }));
app.use(express.static(path.join(__dirname, '/client')));

async function routes () {
// File-serving routes

// If database is connected

if (await connectDB()) {
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/client/lists.html'));
  });

  // Route  for serving specific reading list
  app.get('/list/:id', function (req, res) {
    res.sendFile(path.join(__dirname, '/client/list.html'));
  });

  // Route  for creating new reading list
  app.get('/create', function (req, res) {
    res.sendFile(path.join(__dirname, '/client/create.html'));
  });

  // API Routes

  // Route for reading list-related routes
  app.use('/lists', require('./routes/lists'));

  // Route for Google Books Api requests
  app.use('/search', require('./routes/search'));

  // Route for all other erroneous routes
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/client/notfound.html'));
  });
} else {
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/client/maintenance.html'));
  });
}
}

routes();
module.exports = app;
