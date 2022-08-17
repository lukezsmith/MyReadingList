const mongoose = require('mongoose');

// MongoDB schema model for each book in a reading list
const bookSchema = new mongoose.Schema({
  id: { type: String },
  title: {
    type: String
  },
  authors: { type: String },
  publisher: { type: String },
  publishedDate: { type: Date },
  imageUrl: { type: String }
});

// MongoDB schema model for each Reading list
const ReadingListSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Your Reading List'
  },
  desc: {
    type: String
  },
  list: [bookSchema],
  date: { type: Date, default: Date.now() },
  comments: [String]
});

const ReadingList = mongoose.model('reading lists', ReadingListSchema);

module.exports = ReadingList;
