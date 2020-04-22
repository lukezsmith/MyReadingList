getBooks = _.debounce(getBooks, 500);

var searchValue = document.getElementById('search-input');
var searchIcon = document.getElementById('search-icon');

//check if input is being updated
searchValue.addEventListener('input', handleValueChange);
//check for if input is focused or not
searchValue.addEventListener('focusin', handleInputFocus);
searchValue.addEventListener('focusout', handleInputUnfocus);

var resultsDiv = document.getElementById('results-div');

function handleValueChange() {
	searchIcon.className = 'circle notch loading icon';
	getBooks(this.value);
}

function handleInputFocus() {
	//hide results div on unfocus
	resultsDiv.style.visibility = 'visible';
}
function handleInputUnfocus() {
	//make results div visible again
	resultsDiv.style.visibility = 'hidden';
}

function getBooks(value) {
	if (value && value.trim().length > 0) {
		fetch(`http://localhost:5000/search/${value}`, {
			method: 'POST',
		})
			.then((res) => {
				searchIcon.className = 'search icon';
				return res.json();
			})
			.then((books) => {
				//clear results div
				resultsDiv.innerHTML = '';
				//populate results div
				books.map(function (book, index) {
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
					resultsDiv.appendChild(segment);
				});
			})
			.catch((err) => {
				console.error(err.message);
			});
	} else {
		searchIcon.className = 'search icon';
	}
}

// console.log(searchValue);
// fetch(`http://localhost:5000/search/${value}`, {
// 	method: 'POST',
// })
// 	.then((res) => {
// 		return res.json();
// 	})
// 	.then((data) => {
// 		this.setState({ results: data, isLoading: false });
// 	})
// 	.catch((err) => {
// 		console.error(err.message);
// 	});

// fetch('http://localhost:5000/api/lists')
// 	.then(function (res) {
// 		return res.json();
// 	})
// 	.then(function (lists) {
// 		console.log(lists);
// 		var listHtml = lists
// 			.map(function (list) {
// 				var segment = document.createElement('div');
// 				segment.className = 'ui segment';

// 				var gridDiv = document.createElement('div');
// 				gridDiv.className = 'ui five column grid';

// 				var gridRow1 = document.createElement('div');
// 				gridRow1.className = 'ui row';

// 				var gridRow2 = document.createElement('div');
// 				gridRow2.className = 'ui row';

// 				var gridCol1 = document.createElement('div');
// 				gridCol1.className = 'column';
// 				var gridCol2 = document.createElement('div');
// 				gridCol2.className = 'column';
// 				var gridCol3 = document.createElement('div');
// 				gridCol3.className = 'column';
// 				var gridCol4 = document.createElement('div');
// 				gridCol4.className = 'column';
// 				var gridCol5 = document.createElement('div');
// 				gridCol5.className = 'column';

// 				var bookImage1 = document.createElement('img');
// 				bookImage1.className = 'ui tiny image';
// 				bookImage1.src = `${list.list[0].imageUrl}`;
// 				bookImage1.alt = '';

// 				var bookImage2 = document.createElement('img');
// 				bookImage2.className = 'ui tiny image';
// 				bookImage2.src = `${list.list[1].imageUrl}`;
// 				bookImage2.alt = '';

// 				var bookImage3 = document.createElement('img');
// 				bookImage3.className = 'ui tiny image';
// 				bookImage3.src = `${list.list[2].imageUrl}`;
// 				bookImage3.alt = '';

// 				var bookImage4 = document.createElement('img');
// 				bookImage4.className = 'ui tiny image';
// 				bookImage4.src = `${list.list[3].imageUrl}`;
// 				bookImage4.alt = '';

// 				var bookImage5 = document.createElement('img');
// 				bookImage5.className = 'ui tiny image';
// 				bookImage5.src = `${list.list[4].imageUrl}`;
// 				bookImage5.alt = '';

// 				var listName = document.createElement('a');
// 				listName.href = `/list/${list._id}`;
// 				listName.class = 'list-title';
// 				listName.innerHTML = `${list.name}`;

// 				gridCol1.appendChild(bookImage1);
// 				gridCol2.appendChild(bookImage2);
// 				gridCol3.appendChild(bookImage3);
// 				gridCol4.appendChild(bookImage4);
// 				gridCol5.appendChild(bookImage5);
// 				gridRow1.appendChild(listName);
// 				gridRow2.appendChild(gridCol1);
// 				gridRow2.appendChild(gridCol2);
// 				gridRow2.appendChild(gridCol3);
// 				gridRow2.appendChild(gridCol4);
// 				gridRow2.appendChild(gridCol5);
// 				gridDiv.appendChild(gridRow1);
// 				gridDiv.appendChild(gridRow2);
// 				segment.appendChild(gridDiv);
// 				listDiv.appendChild(segment);

// 				return '';
// 			})
// 			.join('');
// 	});
