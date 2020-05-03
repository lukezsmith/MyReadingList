/* global fetch */
/* global _ */

var searchValue = document.getElementById('search-input');
var listTitleInput = document.getElementById('list-title-input');
var listDescInput = document.getElementById('list-desc-input');

var resultsDiv = document.getElementById('results-div');
var listDiv = document.getElementById('list-div');

var listTitle = document.getElementById('list-title');
var listDesc = document.getElementById('list-desc');
var searchIcon = document.getElementById('search-icon');
var submitButton = document.getElementById('list-submit-btn');

// check if input is being updated
searchValue.addEventListener('input', handleValueChange);
// check for if input is focused or not
searchValue.addEventListener('focusin', handleInputFocus);
searchValue.addEventListener('focusout', handleInputUnfocus);

// add event handler to update the list name
listTitleInput.addEventListener('input', handleListNameChange);

// add event handler to update the description of the list
listDescInput.addEventListener('input', handleListDescriptionChange);

// add event handler to submit button
submitButton.addEventListener('mousedown', handleListSubmit);

// debounced version of getBooks
var debouncedGetBooks = _.debounce(getBooks, 500);

// array to store reading list
var readingList = [];

function handleValueChange () {
  searchIcon.className = 'circle notch loading icon';
  debouncedGetBooks(this.value);
}

function handleInputFocus () {
  // hide results div on unfocus
  resultsDiv.style.visibility = 'visible';
}
function handleInputUnfocus () {
  // make results div visible again
  resultsDiv.style.visibility = 'hidden';
}

function handleListNameChange () {
  listTitle.innerText = this.value + ' Reading List:';
}

function handleListDescriptionChange () {
  listDesc.innerText = this.value;
}
function handleBookDeletion (book) {
  if (readingList.length === 1) {
    submitButton.style.visibility = 'hidden';
  }
  var index = readingList.indexOf(book);
  readingList.splice(index, 1);
  var deletedBookSegment = document.getElementsByClassName(
    'create-list-segment'
  )[index];
  listDiv.removeChild(deletedBookSegment);

  // update indices for reading list

  // iterate through each book in list and check if their segment index matches their index in the reading list
  var segmentIndices = document.querySelectorAll('#index-text');
  readingList.forEach(function (book, index) {
    if (index + 1 !== segmentIndices[index].innerText) {
      // update  with correct (array+1) index
      segmentIndices[index].innerText = index + 1;
    }
  });
}

function handleListSubmit () {
  fetch('http://localhost:5000/api/lists', {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: listTitle.innerText,
      desc: listDesc.innerText,
      list: readingList
      // comments: listComments,
    })
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (res) {
      console.log(res);
      window.location.href = `list/${res._id}`;
    })
    .catch(function (err) {
      console.error(err.message);
    });
}
function handleResultSelect (book) {
  // add book to reading list
  if (readingList.includes(book) || isDuplicateBook(book, readingList)) {
    window.alert('The reading list already contains this book!');
  } else if (readingList.length < 10) {
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
    indexCol.className = 'one wide column';
    indexCol.id = 'index-col';
    var indexText = document.createElement('h2');
    indexText.id = 'index-text';

    var imageCol = document.createElement('div');
    imageCol.className = 'four wide column';
    var detailsCol = document.createElement('div');
    detailsCol.className = 'ten wide column details-col';

    var deleteCol = document.createElement('div');
    deleteCol.className = 'one wide column';
    deleteCol.id = 'delete-col';

    var deleteIcon = document.createElement('i');
    deleteIcon.className = 'x icon icon';

    var deleteBtn = document.createElement('button');
    deleteBtn.id = 'delete-btn';
    deleteBtn.className = 'circular negative ui icon button';
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

    if (readingList.length > 0) {
      submitButton.style.visibility = 'visible';
    }
  } else {
    window.alert(
      'You have already added ten books to your list, remove one to add this book!'
    );
  }
}

function getBooks (value) {
  if (value && value.trim().length > 0) {
    fetch(`http://localhost:5000/search/${value}`, {
      method: 'POST'
    })
      .then((res) => {
        searchIcon.className = 'search icon';
        return res.json();
      })
      .then((books) => {
        // clear results div
        resultsDiv.innerHTML = '';
        // populate results div
        books.map(function (book, index) {
          var bookLink = document.createElement('a');
          bookLink.id = 'book-link';
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
      });
  } else {
    searchIcon.className = 'search icon';
  }
}

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
