// Imports relevant dependencies
var express = require('express');
var cors = require('cors');
var http = require('http');
var path = require('path');
var reload = require('reload');

// Creates instance of an express server
var app = express();

// Connect to mongoDB database
var connectDB = require('./config/db');
connectDB();

// Initialise middleware
app.use(
	cors({
		origin: 'http://localhost:3000',
	})
);
app.use(express.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'client')));

// Set port to host server
const PORT = process.env.PORT || 5000;

// Endpoints

// File-serving routes

// Route for serving landing page (index.html)

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/client/index.html'));
});

// Route  for serving specific reading list
app.get('/list/:id', function (req, res) {
	res.sendFile(path.join(__dirname + '/client/list.html'));
});

// Route  for creating new reading list
app.get('/create', function (req, res) {
	res.sendFile(path.join(__dirname + '/client/create.html'));
});

// Api Routes

// Route for reading list-related routes
app.use('/api/lists', require('./routes/api/lists'));

// Route for Google Books Api requests
app.use('/search', require('./routes/api/search'));
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Reload code here

var server = http.createServer(app);
reload(app)
	.then(function (reloadReturned) {
		// reloadReturned is documented in the returns API in the README

		// Reload started, start web server
		server.listen(app.get('port'), function () {
			console.log('Web server listening on port ' + PORT);
		});
	})
	.catch(function (err) {
		console.error(
			'Reload could not start, could not start server/sample app',
			err
		);
	});
