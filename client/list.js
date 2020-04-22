var listId = window.location.pathname.split('/')[2];
var listDiv = document.getElementById('list-list-div');
var listName = document.getElementById('list-title');

fetch(`http://localhost:5000/api/lists/${listId}`)
	.then(function (res) {
		return res.json();
	})
	.then(function (list) {
		console.log(list);

		// update list title
		listName.innerText = list.name;

		// map each list to a list item

		var listHtml = list.list
			.map(function (book, index) {
				//move all of these definitions outside of map loop????? we are redefining them each time
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
	});
