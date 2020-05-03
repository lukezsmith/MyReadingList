const express = require('express');
const router = express.Router();
const config = require('config');
const googleBooksApiKey = config.get('googleBooksApiKey');

const axios = require('axios');

const Book = require('../../Book');

const googleBooksUrl = 'https://www.googleapis.com/books/v1/volumes?q=';

function allFieldsPresent(book) {
	if (
		!book.hasOwnProperty('title') ||
		!book.hasOwnProperty('authors') ||
		!book.hasOwnProperty('publisher') ||
		!book.hasOwnProperty('publishedDate') ||
		!book.hasOwnProperty('imageLinks')
	) {
		return false;
	}
	if (!book.subtitle) {
		book.subtitle = '';
	}
	return true;
}

function isDuplicateBook(newBook, bookArray, threshold, flag) {
	// console.log('CHECKING FOR DUPLICATE');
	var duplicateCount = 0;

	bookArray.forEach((existingBook) => {
		var existingBookPublishedDate = new Date(
			Date.parse(existingBook.publishedDate)
		);
		var bookPublishedDate = new Date(Date.parse(newBook.publishedDate));

		if (existingBook.title == newBook.title) {
			// console.log('title duplicate!!!!!!');
			// console.log('old book: ', existingBook.title);
			// console.log('newbook: ', newBook.title);
			duplicateCount += 1;
		}

		if (flag === 'results') {
			//iterate over authors and check that there are no duplicates
			newBook.authors.forEach((author) => {
				if (existingBook.authors.includes(author)) {
					duplicateCount += 0.5;
					// console.log('author duplicate!!!!!!');
					// console.log('old book: ', existingBook.title);
					// console.log('newbook: ', newBook.title);
				}
			});
		} else {
			if (existingBook.authors === newBook.authors) {
				// console.log('author duplicate!!!!!!');
				// console.log('old book: ', existingBook.authors);
				// console.log('newbook: ', newBook.authors);
				duplicateCount += 1;
			}
		}
		if (existingBook.publisherName == newBook.publisherName) {
			// console.log('publisher duplicate!!!!!!');
			// console.log('old book: ', existingBook.publisherName);
			// console.log(existingBook);
			// console.log('newbook: ', newBook.publisherName);
			// console.log(newBook);
			duplicateCount += 1;
		}

		if (
			existingBookPublishedDate == bookPublishedDate ||
			(existingBookPublishedDate.getMonth() == bookPublishedDate.getMonth() &&
				existingBookPublishedDate.getFullYear() ==
					bookPublishedDate.getFullYear())
		) {
			// console.log('date duplicate!!!!!!');
			// console.log('old book: ', existingBookPublishedDate);
			// console.log('newbook: ', bookPublishedDate);
			duplicateCount += 1;
		}
	});
	if (duplicateCount > threshold) {
		console.log('DUPLICATE');
		return true;
	} else {
		return false;
	}
}

// @route   POST book query to get books from Google Books Api
// @desc    Gets a list of books from Google Books API that the user can add to a reading list
// @access  Private
router.post('/:query', async (req, res) => {
	var isLoading = false;
	var bookResLimit = 5;
	var results = [];
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
				// res.json(response);\
				// if no books found for this query
				if (googleRes.data.totalItems == 0) {
					// console.log('No books found that match search criteria');
					isLoading = false;
					results = [];
					// this.setState({
					// 	isLoading: false,
					// 	results: [],
					// });
				} else {
					// create book object for each result (maybe we need to limit this to say 50 books or so)
					const bookData = googleRes.data.items;

					//TODO: iterate from 0 to the lowest betweejn bookresLimit and amount of results for query

					// for (let i = 0; i < Math.min(this.state.bookResLimit, 40); i++) {
					for (let i = 0; i < Math.min(bookResLimit, 40); i++) {
						const book = bookData[i];

						//check if all fields exist or this book is a duplicate of one we already have added, if not we skip the book
						if (
							!allFieldsPresent(book.volumeInfo) ||
							isDuplicateBook(book.volumeInfo, bookArray, 2, 'results')
						) {
							// this.setState({ bookResLimit: (this.state.bookResLimit += 1) });
							bookResLimit += 1;
							// console.log('duplicate found');
						} else {
							if (bookArray.length != bookResLimit) {
								// if (bookArray.length != this.state.bookResLimit) {
								// console.log(value);
								// console.log(book.title);
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
								// console.log(bookArray.length);
							}
						}
					}
					// console.log(bookArray);
					isLoading = false;
					results = bookArray;
				}
				// console.log(bookArray);
				res.json(bookArray);
			});
	} catch (err) {
		console.error(err.message);
	}
});
module.exports = router;
