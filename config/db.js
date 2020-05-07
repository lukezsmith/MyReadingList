const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

class Database {
  // Connects to the MongoDB database
  async connectDB () {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });

    return true;
  } catch (err) {
    console.error('Unable to connect to database, please try again later.');
    console.error(err.message);
    return false;
  }
  };

  disconnectDB () {
    mongoose.connection.close();
  };
}

module.exports = Database;
