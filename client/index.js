/* global tns */
/* global fetch */

// Fetches ten most-recently created lists and populates list div with them
function getLists () {
fetch('http://localhost:5000/api/lists')
  .then(function (res) {
    return res.json();
  })
  .then(function (lists) {
    if (lists.length === 0) {
      var brandCol = document.getElementById('brand-col');
      brandCol.className = 'sixteen wide column brand-col';
      brandCol.style.textAlign = 'center';
      brandCol.setAttribute('style', 'padding-left: 0 !important; text-align: center;');
      document.getElementById('list-col').remove();
    } else {
    // Maps each list to its own html segment
    lists
      .map(function (list) {
        var segment = document.createElement('div');
        segment.className = 'ui segment';

        var gridDiv = document.createElement('div');
        gridDiv.className = 'ui five column grid';

        var nameRow = document.createElement('div');
        nameRow.className = 'ui row';

        var descRow = document.createElement('div');
        descRow.className = 'ui row';

        var booksRow = document.createElement('div');
        booksRow.className = 'ui row';

        // Iterates through number of books in the list and creates html elements for each one
        list.list.forEach((book, index) => {
          var bookCol = document.createElement('div');
          bookCol.className = 'column';

          var bookImage = document.createElement('img');
          bookImage.className = 'ui tiny image landing-list-image';
          bookImage.src = `${book.imageUrl}`;
          bookImage.alt = '';

          bookCol.appendChild(bookImage);
          booksRow.appendChild(bookCol);
        });

        var listName = document.createElement('a');
        listName.href = `/list/${list._id}`;
        listName.className = 'landing-list-title';
        listName.innerHTML = `${list.name}`;

        var listDesc = document.createElement('p');
        if (list.desc !== undefined) {
          listDesc.innerText = list.desc;
        }

        nameRow.appendChild(listName);

        descRow.appendChild(listDesc);

        gridDiv.appendChild(nameRow);
        gridDiv.appendChild(descRow);
        gridDiv.appendChild(booksRow);
        segment.appendChild(gridDiv);
        document.getElementById('landing-list-div').appendChild(segment);

        return '';
      });

    // Initialises the carousel container for all list segments
    tns({
      container: '#landing-list-div',
      autoHeight: false,
      mouseDrag: true,
      speed: 400,
      controls: true,
      controlsPosition: 'bottom',
      navPosition: 'bottom',
      arrowKeys: true
    });
  }
})
  .catch(function (err) {
    console.error(err.message);
    window.alert('Unable to get lists, please try again later.');
  });
}

getLists();
