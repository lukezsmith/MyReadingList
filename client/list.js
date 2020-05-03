/* global fetch */
/* global location */

var listId = window.location.pathname.split('/')[2];
var listDiv = document.getElementById('list-list-div');
var listName = document.getElementById('list-title');
var listDesc = document.getElementById('list-desc');

var commentSubmitBtn = document.getElementById('comment-submit-btn');

commentSubmitBtn.addEventListener('mousedown', function () {
  var commentValue = document.getElementById('comment-input').value;
  handleCommentSubmit(commentValue);
});

function handleCommentSubmit (commentValue) {
  // check comment value is not empty
  if (commentValue && commentValue.trim().length > 0) {
    console.log('valid comment');
    console.log(commentValue);
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
        location.reload();
        window.scrollTo(0, 0);
      })
      .catch(function (err) {
        console.error(err);
      });
  }
}
fetch(`http://localhost:5000/api/lists/${listId}`)
  .then(function (res) {
    return res.json();
  })
  .then(function (list) {
    console.log(list);

    // update list title
    listName.innerText = list.name;

    // update list description
    listDesc.innerText = list.desc;

    // map each list to a list item
    list.list
      .map(function (book, index) {
        // move all of these definitions outside of map loop????? we are redefining them each time
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
        indexCol.className = 'one wide column';
        indexCol.id = 'index-col';
        var indexText = document.createElement('h2');

        var imageCol = document.createElement('div');
        imageCol.className = 'two wide column';
        var detailsCol = document.createElement('div');
        detailsCol.className = 'twelve wide column details-col';

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
        listDiv.appendChild(segment);
      })
      .join('');

    var commentsDiv = document.getElementById('comments-div');
    // if comments
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
  });
