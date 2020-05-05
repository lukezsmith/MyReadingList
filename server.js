var reload = require('reload');
var http = require('http');

// Import application
const app = require('./app');

// Set port to be used for server
const PORT = process.env.PORT || 5000;

// Listen for app
app.listen(PORT);

// Reload code here
// var server = http.createServer(app);
// reload(app)
//   .then(function (reloadReturned) {
//     // reloadReturned is documented in the returns API in the README

//     // Reload started, start web server
//     server.listen(app.get('port'), function () {
//       console.log('Web server listening on port ' + PORT);
//     });
//   })
//   .catch(function (err) {
//     console.error(
//       'Reload could not start, could not start server/sample app',
//       err
//     );
//   });
