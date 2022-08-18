// Import application
const app = require('./app');

// Set port to be used for server
const PORT = process.env.PORT || 80;

// Connect to mongoDB database
const Database = require('./config/db');
const db = new Database();
db.connectDB();

// Listen for app
app.listen(PORT);

console.log(`MyReadingList running at http://localhost:${PORT}/`);
