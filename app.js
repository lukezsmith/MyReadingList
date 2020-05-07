// Imports relevant dependencies
var express = require('express');
var path = require('path');
const mongoose = require('mongoose');
const config = require('config');
const axios = require('axios');

// Reading list db mongoose schema model
const ReadingList = require('./models/ReadingList');

// Book object class for each book returned from Google Books Query
const Book = require('./Book');

// Google Books API key
const googleBooksApiKey = config.get('googleBooksApiKey');

// Google Books API endpoint for getting list of volumes
const googleBooksUrl = 'https://www.googleapis.com/books/v1/volumes?q=';

// Creates instance of an express server
var app = express();

// Initialise middleware
app.use(express.json({ extended: false }));
app.use(express.static(path.join(__dirname, '/client')));

// Helper function for validating each book returned by Google Books API GET request
function allFieldsPresent (book) {
  if (
    !Object.prototype.hasOwnProperty.call(book, 'title') ||
    !Object.prototype.hasOwnProperty.call(book, 'authors') ||
    !Object.prototype.hasOwnProperty.call(book, 'publisher') ||
    !Object.prototype.hasOwnProperty.call(book, 'publishedDate') ||
    !Object.prototype.hasOwnProperty.call(book, 'imageLinks')
  ) {
    return false;
  }
  if (!book.subtitle) {
    book.subtitle = '';
  }
  return true;
}

// Helper function for filtering out duplicate books in search results
function isDuplicateBook (newBook, bookArray, threshold, flag) {
  var duplicateCount = 0;

  bookArray.forEach((existingBook) => {
    var existingBookPublishedDate = new Date(
      Date.parse(existingBook.publishedDate)
    );
    var bookPublishedDate = new Date(Date.parse(newBook.publishedDate));

    if (existingBook.title === newBook.title) {
      duplicateCount += 1;
    }

    if (flag === 'results') {
      // iterate over authors and check that there are no duplicates
      newBook.authors.forEach((author) => {
        if (existingBook.authors.includes(author)) {
          duplicateCount += 0.5;
        }
      });
    } else {
      if (existingBook.authors === newBook.authors) {
        duplicateCount += 1;
      }
    }
    if (existingBook.publisherName === newBook.publisherName) {
      duplicateCount += 1;
    }

    if (
      existingBookPublishedDate === bookPublishedDate ||
      (existingBookPublishedDate.getMonth() === bookPublishedDate.getMonth() &&
        existingBookPublishedDate.getFullYear() ===
          bookPublishedDate.getFullYear())
    ) {
      duplicateCount += 1;
    }
  });
  if (duplicateCount > threshold) {
    return true;
  } else {
    return false;
  }
}

// Frontend Routes
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

// /lists/

// @route   GET /lists/id
// @desc    Gets a reading list by id
// @access  Public
app.get('/lists/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).send('Bad Request');
  } else {
  try {
    var readingList = await ReadingList.findById(req.params.id);
    if (!readingList) {
      return res.status(404).send('Not Found');
      // return res.status(209).json();
    }
    res.status(200).json(readingList);
  } catch (err) {
    console.error(err);
      res.status(400).json('Bad Request');
    }
  }
});

// @route   POST /lists
// @desc    Creates a new reading list
// @access  Public
app.post('/lists', async (req, res) => {
  try {
    const { name, desc, list, comments } = req.body;

    if (list.length < 1) {
      res.status(400).send('Bad Request');
    } else {
    var newList = new ReadingList({
      name,
      desc,
      list,
      comments
    });

    await newList.save();
    res.status(200).send(newList);
  }
  } catch (err) {
    res.status(400).send('Bad Request');
  }
});

// @route   PATCH /lists/id
// @desc    Adds new comment to list
// @access  Public
app.patch('/lists/:id', async (req, res) => {
  try {
    const { comment } = req.body;
      const listId = req.params.id;
      var readingList = await ReadingList.findById(listId);
      readingList.comments.push(comment);
      await readingList.save();
      res.status(200).send(readingList);
  } catch (err) {
    res.status(400).send('Bad request');
  }
});

// @route   GET /lists
// @desc    Gets ten most-recent lists
// @access  Public
app.get('/lists', async (req, res) => {
  try {
    var readingList = await ReadingList.find().limit(10).sort('-date');
    res.status(200).json(readingList);
  } catch (err) {
    console.error(err);
    res.status(400).send('Bad request');
  }
});

// /search/

// @route   POST /search/:id
// @desc    Gets a list of books from Google Books API that the user can add to a reading list
// @access  Public
app.post('/search/:query', async (req, res) => {
  var bookResLimit = 5;
  var bookArray = [];

  try {
    await axios
      .get(
        googleBooksUrl +
          req.params.query +
          '&maxResults=40&printType=books' +
          `&key=${googleBooksApiKey}`
      )
      .then((googleRes) => {
        // if books found for this query
        if (googleRes.data.totalItems !== 0) {
          // create book object for each result (maybe we need to limit this to say 50 books or so)
          const bookData = googleRes.data.items;

          for (let i = 0; i < Math.min(bookResLimit, 40); i++) {
            const book = bookData[i];

            // check if all fields exist or this book is a duplicate of one we already have added, if not we skip the book
            if (
              !allFieldsPresent(book.volumeInfo) ||
              isDuplicateBook(book.volumeInfo, bookArray, 2, 'results')
            ) {
              bookResLimit += 1;
            } else {
              // Push book to results array
              if (bookArray.length !== bookResLimit) {
                bookArray.push(
                  new Book(
                    book.id,
                    book.volumeInfo.title,
                    book.volumeInfo.subtitle,
                    book.volumeInfo.authors,
                    book.volumeInfo.publisher,
                    book.volumeInfo.publishedDate,
                    book.volumeInfo.imageLinks.smallThumbnail
                  )
                );
              }
            }
          }
        }
        // Send search results
        res.status(200).json(bookArray);
      });
  } catch (err) {
    console.error(err.message);
    res.status(400).json('Bad Request');
  }
});

// Route for all other erroneous routes
app.get('*', function (req, res) {
  res.status(404).sendFile(path.join(__dirname, '/client/notfound.html'));
});

module.exports = app;
