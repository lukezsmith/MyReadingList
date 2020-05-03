const express = require('express');
const router = express.Router();
const config = require('config');
const googleBooksApiKey = config.get('googleBooksApiKey');

const axios = require('axios');

const Book = require('../../Book');

// Google Books API endpoint for getting list of volumes
const googleBooksUrl = 'https://www.googleapis.com/books/v1/volumes?q=';

// Helper functions for validating books
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

// Endpoints

// @route   POST book query to get books from Google Books Api
// @desc    Gets a list of books from Google Books API that the user can add to a reading list
// @access  Private
router.post('/:query', async (req, res) => {
  var bookResLimit = 5;
  var bookArray = [];

  // console.log(req.params.query);

  try {
    await axios
      .get(
        googleBooksUrl +
          req.params.query +
          '&maxResults=40&printType=books' +
          `&key=${googleBooksApiKey}`
      )
      .then((googleRes) => {
        // if no books found for this query
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
        res.json(bookArray);
      });
  } catch (err) {
    console.error(err.message);
  }
});
module.exports = router;
