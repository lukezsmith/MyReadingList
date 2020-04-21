// Imports relevant dependencies
var express = require('express');
var cors = require('cors');
var http = require('http');
var path = require('path');
var reload = require('reload');

// Creates instance of an express server
var app = express();

// Connect to database
const connectDB = require('./config/db');
connectDB();

app.use(
	cors({
		origin: 'http://localhost:3000',
	})
);

// Initialise middleware
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5000;

// Endpoints

// Routes

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

// Route for reading list-related routes
app.use('/api/lists', require('./routes/api/lists'));

// Route for Google Books Api requests
app.use('/search', require('./routes/api/search'));
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

var server = http.createServer(app);
// Reload code here
reload(app)
	.then(function (reloadReturned) {
		// reloadReturned is documented in the returns API in the README

		// Reload started, start web server
		server.listen(app.get('port'), function () {
			console.log('Web server listening on port ' + app.get('port'));
		});
	})
	.catch(function (err) {
		console.error(
			'Reload could not start, could not start server/sample app',
			err
		);
	});
