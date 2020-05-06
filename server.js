// Import application
const app = require('./app');

// Set port to be used for server
const PORT = process.env.PORT || 5000;

// Listen for app
app.listen(PORT);
