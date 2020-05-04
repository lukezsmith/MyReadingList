// Imports relevant dependencies
var express = require('express');
var cors = require('cors');
var path = require('path');

// Creates instance of an express server
var app = express();

// Connect to mongoDB database
var connectDB = require('./config/db');
connectDB();

// Initialise middleware
app.use(
  cors({
    origin: 'http://localhost:3000'
  })
);
app.use(express.json({ extended: false }));
app.use(express.static(path.join(__dirname, '/client')));

// File-serving routes

// Route for serving landing page (index.html)
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/client/index.html'));
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
app.use('/api/lists', require('./routes/api/lists'));

// Route for Google Books Api requests
app.use('/search', require('./routes/api/search'));

// Route for all other erroneous routes
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '/client/404.html'));
});

module.exports = app;
