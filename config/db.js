const mongoose = require('mongoose');
const config = require('config');
require('dotenv').config()
const db = process.env.mongoURI

class Database {
  // Connects to the MongoDB database
  async connectDB () {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });

    mongoose.connection.db.listCollections().toArray(function (err, names) {
      console.log(names); // [{ name: 'dbname.myCollection' }]
      // module.exports.Collection = names;
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
