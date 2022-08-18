/* global fetch */
/* global _ */
const PORT = 44329;

var searchValue = document.getElementById('search-input');
// check if input is being updated
searchValue.addEventListener('input', handleValueChange);
// check for if input is focused or not
searchValue.addEventListener('focusin', handleInputFocus);
searchValue.addEventListener('focusout', handleInputUnfocus);

// add event handler to update the list name
var listTitleInput = document.getElementById('list-title-input');
listTitleInput.addEventListener('input', handleListNameChange);

// add event handler to update the description of the list
var listDescInput = document.getElementById('list-desc-input');
listDescInput.addEventListener('input', handleListDescriptionChange);

// Elements used across all functions
var resultsDiv = document.getElementById('results-div');
var listDiv = document.getElementById('list-div');
var listTitle = document.getElementById('list-title');
var listDesc = document.getElementById('list-desc');
var searchIcon = document.getElementById('search-icon');

// Adds event handler to submit button when clicked
var submitButton = document.getElementById('list-submit-btn');
submitButton.addEventListener('mousedown', handleListSubmit);

// Debounced version of getBooks
var debouncedGetBooks = _.debounce(getBooks, 500);

// Array to store reading list
var readingList = [];

// Handles when book search query is updated
function handleValueChange () {
  searchIcon.className = 'circle notch loading icon';
  debouncedGetBooks(this.value);
}

// Shows results div when search input is focused
function handleInputFocus () {
  resultsDiv.style.visibility = 'visible';
}

// Hides results div when search input is unfocused
function handleInputUnfocus () {
  resultsDiv.style.visibility = 'hidden';
}

// Handles updating the list name when listname input is updated
function handleListNameChange () {
  listTitle.innerText = this.value + ' Reading List:';
}

// Handles updating the list description when description input is updated
function handleListDescriptionChange () {
  listDesc.innerText = this.value;
}

// Handles when user removes book from list
function handleBookDeletion (book) {
  // Checks length of book to decide if submit button should be visible
  if (readingList.length === 1) {
    submitButton.style.visibility = 'hidden';
  }

  // Remove book from reading list array
  var index = readingList.indexOf(book);
  readingList.splice(index, 1);
  var deletedBookSegment = document.getElementsByClassName(
    'create-list-segment'
  )[index];
  listDiv.removeChild(deletedBookSegment);

  // update indices for reading list

  // iterate through each book in list and check if their segment index matches their index in the reading list
  var segmentIndices = document.querySelectorAll('.index-text');
  readingList.forEach(function (book, index) {
    if (index + 1 !== segmentIndices[index].innerText) {
      // update  with correct (array+1) index
      segmentIndices[index].innerText = index + 1;
    }
  });
}

// Handles submitting the list to database when user submits list
function handleListSubmit () {
  fetch(`http://localhost:${PORT}/lists`, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: listTitle.innerText,
      desc: listDesc.innerText,
      list: readingList
    })
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (res) {
      // Redirect to newly-generated list's dedicated page
      window.location.href = `list/${res._id}`;
    })
    .catch(function (err) {
      console.error(err.message);
      window.alert('HTTP 400 Bad Request - There was an error when submitting your request, please try again later.');
    });
}

// Handles updating the list when a book is selected to be added to the list
function handleResultSelect (book) {
  // Checks that list doesn't already contain selected book
  if (readingList.includes(book) || isDuplicateBook(book, readingList)) {
    window.alert('The reading list already contains this book!');
  } else if (readingList.length < 10) {
    // Generates HTML for the newly added book in the list
    readingList.push(book);
    var segment = document.createElement('div');
    segment.className = 'ui segment create-list-segment';

    var gridDiv = document.createElement('div');
    gridDiv.className = 'ui grid';

    var titleRow = document.createElement('div');
    titleRow.className = 'ui row';
    var titleText = document.createElement('h3');
    titleText.className = 'book-title';

    var authorRow = document.createElement('div');
    authorRow.className = 'ui row';

    var indexCol = document.createElement('div');
    indexCol.className = 'one wide column index-col';
    var indexText = document.createElement('h2');
    indexText.className = 'index-text';

    var imageCol = document.createElement('div');
    imageCol.className = 'four wide column image-col';
    var detailsCol = document.createElement('div');
    detailsCol.className = 'nine wide column details-col';

    var deleteCol = document.createElement('div');
    deleteCol.className = 'two wide column delete-col';

    var deleteIcon = document.createElement('i');
    deleteIcon.className = 'x icon icon delete-icon';

    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'circular negative ui icon button delete-icon';

    // Adds event listener for book in case user wants to remove it from the list
    deleteBtn.addEventListener('mousedown', function () {
      handleBookDeletion(book);
    });

    var bookImage = document.createElement('img');
    bookImage.className = 'ui image list-image';
    bookImage.src = `${book.imageUrl}`;
    bookImage.alt = '';

    indexText.innerText = readingList.indexOf(book) + 1;
    indexCol.appendChild(indexText);
    gridDiv.appendChild(indexCol);
    imageCol.appendChild(bookImage);
    gridDiv.appendChild(imageCol);

    titleText.innerText = book.title;
    titleRow.appendChild(titleText);
    detailsCol.appendChild(titleRow);
    authorRow.innerText = `By ${book.authors}`;
    detailsCol.appendChild(authorRow);
    gridDiv.appendChild(detailsCol);

    deleteBtn.appendChild(deleteIcon);
    deleteCol.appendChild(deleteBtn);
    gridDiv.appendChild(deleteCol);

    segment.appendChild(gridDiv);
    listDiv.appendChild(segment);

    // Allow user to submit list now there is at least one book
    if (readingList.length > 0) {
      submitButton.style.visibility = 'visible';
    }
  } else {
    window.alert(
      'You have already added ten books to your list, remove one to add this book!'
    );
  }
}

// Makes a GET request to Google Books via server-defined GET request
function getBooks (value) {
  // Sanitise input
  if (value && value.trim().length > 0) {
    fetch(`http://localhost:${PORT}/search/${value}`, {
      method: 'POST'
    })
      .then((res) => {
        // Update search icon prompt
        searchIcon.className = 'search icon';
        return res.json();
      })
      .then((books) => {
        // Reset results div
        resultsDiv.innerHTML = '';
        // Populate results div with HTML for each result
        books.map(function (book, index) {
          var bookLink = document.createElement('a');
          bookLink.className = 'book-link';
          bookLink.href = '';
          bookLink.addEventListener('mousedown', function () {
            handleResultSelect(book);
          });

          var segment = document.createElement('div');
          segment.className = 'ui segment results-segment';

          var gridDiv = document.createElement('div');
          gridDiv.className = 'ui  grid';

          var imageCol = document.createElement('div');
          imageCol.className = 'six wide column ';
          var bookImage = document.createElement('img');
          bookImage.className = 'ui image results-image';
          bookImage.src = `${book.imageUrl}`;
          bookImage.alt = '';

          var detailsCol = document.createElement('div');
          detailsCol.className = 'ten wide column ';
          var titleRow = document.createElement('div');
          titleRow.className = 'ui row';
          var titleText = document.createElement('h4');
          titleText.innerText = `${book.title}`;

          var authorRow = document.createElement('div');
          authorRow.className = 'ui row';
          var authorText = document.createElement('p');
          authorText.innerText = `By ${book.authors}`;

          imageCol.appendChild(bookImage);
          gridDiv.appendChild(imageCol);

          titleRow.appendChild(titleText);
          detailsCol.appendChild(titleRow);
          authorRow.appendChild(authorText);
          detailsCol.appendChild(authorRow);
          gridDiv.appendChild(detailsCol);
          segment.appendChild(gridDiv);
          bookLink.appendChild(segment);
          resultsDiv.appendChild(bookLink);
        });
      })
      .catch((err) => {
        console.error(err.message);
        window.alert('HTTP 400 Bad Request - There was an error processing your book query, please try again later.');
      });
  } else {
    // Reset search icon prompt
    searchIcon.className = 'search icon';
  }
}

// Helper function to stop same book being added to the list twice by metadata comparison
function isDuplicateBook (book, readingList) {
  var duplicateCount = 0;
  var threshold = 3;

  readingList.forEach((existingBook) => {
    var existingBookPublishedDate = new Date(
      Date.parse(existingBook.publishedDate)
    );
    var bookPublishedDate = new Date(Date.parse(book.publishedDate));

    if (existingBook.title === book.title) {
      duplicateCount += 1;
    }

    if (existingBook.authors === book.authors) {
      duplicateCount += 1;
    }

    if (existingBook.publisherName === book.publisherName) {
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
