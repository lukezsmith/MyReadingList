/* global fetch */
/* global location */

// Gets the reading list and generates the html for it
function getList (listId) {
  var commentSubmitBtn = document.getElementById('comment-submit-btn');

  // Adds an event listener for when a new comment is submitted via the submit button
  commentSubmitBtn.addEventListener('mousedown', function () {
    var commentValue = document.getElementById('comment-input').value;
    handleCommentSubmit(window.location.pathname.split('/')[2], commentValue);
  });

  // Fetches list from api

fetch(`http://localhost:5000/api/lists/${listId}`)
  .then(function (res) {
    return res.json();
  })
  .then(function (list) {
    // update list title
    document.getElementById('list-title').innerText = list.name;

    // update list description
    document.getElementById('list-desc').innerText = list.desc;

    // map each list to a list item and generates the HTML for each one
    list.list
      .map(function (book, index) {
        var segment = document.createElement('div');
        segment.className = 'ui segment list-segment';

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
        var indexText = document.createElement('p');

        var imageCol = document.createElement('div');
        imageCol.className = 'four wide column image-col';
        var detailsCol = document.createElement('div');
        detailsCol.className = 'ten wide column details-col';

        var bookImage = document.createElement('img');
        bookImage.className = 'ui image list-image';
        bookImage.src = `${book.imageUrl}`;
        bookImage.alt = '';

        indexText.innerText = index + 1;
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

        segment.appendChild(gridDiv);
        document.getElementById('list-list-div').appendChild(segment);
      });

    var commentsDiv = document.getElementById('comments-div');
    // if comments exist, generate HTML to display them
    if (list.comments.length !== 0) {
       list.comments.map(function (comment, index) {
        var commentDiv = document.createElement('div');
        commentDiv.className = 'comment';

        var avatar = document.createElement('i');
        avatar.className = 'avatar user bordered grey icon ';

        var commentContent = document.createElement('div');
        commentContent.className = 'content';

        var commentAuthor = document.createElement('h4');
        commentAuthor.innerText = 'anonymous';

        var commentText = document.createElement('div');
        commentText.innerText = comment;

        commentDiv.appendChild(avatar);
        commentContent.appendChild(commentAuthor);
        commentContent.appendChild(commentText);
        commentDiv.appendChild(commentContent);

        commentsDiv.appendChild(commentDiv);
      });
    }
  })
  .catch(function (err) {
    console.error(err.message);
    window.alert('Unable to get list, please try again later.');
  });
}

getList(window.location.pathname.split('/')[2]);

// Handles a new comment being submitted
function handleCommentSubmit (listId, commentValue) {
  // check comment value is not empty
  if (commentValue && commentValue.trim().length > 0) {
    // update list with new comment
    fetch(`http://localhost:5000/api/lists/${listId}`, {
      method: 'PATCH',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comment: commentValue
      })
    })
      .then(function (res) {
        return res;
      })
      .then(function (res) {
        // reload page
        location.reload();
        window.scrollTo(0, 0);
      })
      .catch(function (err) {
        console.error(err);
        window.alert('Unable to post new comment, please try again later.');
      });
  }
}
