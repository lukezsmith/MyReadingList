var listDiv = document.getElementById('landing-list-div');
fetch('http://localhost:5000/api/lists')
	.then(function (res) {
		return res.json();
	})
	.then(function (lists) {
		console.log(lists);
		var listHtml = lists
			.map(function (list) {
				var segment = document.createElement('div');
				segment.className = 'ui segment';

				var gridDiv = document.createElement('div');
				gridDiv.className = 'ui five column grid';

				var gridRow1 = document.createElement('div');
				gridRow1.className = 'ui row';

				var gridRow2 = document.createElement('div');
				gridRow2.className = 'ui row';

				var gridCol1 = document.createElement('div');
				gridCol1.className = 'column';
				var gridCol2 = document.createElement('div');
				gridCol2.className = 'column';
				var gridCol3 = document.createElement('div');
				gridCol3.className = 'column';
				var gridCol4 = document.createElement('div');
				gridCol4.className = 'column';
				var gridCol5 = document.createElement('div');
				gridCol5.className = 'column';

				var bookImage1 = document.createElement('img');
				bookImage1.className = 'ui tiny image';
				bookImage1.src = `${list.list[0].imageUrl}`;
				bookImage1.alt = '';

				var bookImage2 = document.createElement('img');
				bookImage2.className = 'ui tiny image';
				bookImage2.src = `${list.list[1].imageUrl}`;
				bookImage2.alt = '';

				var bookImage3 = document.createElement('img');
				bookImage3.className = 'ui tiny image';
				bookImage3.src = `${list.list[2].imageUrl}`;
				bookImage3.alt = '';

				var bookImage4 = document.createElement('img');
				bookImage4.className = 'ui tiny image';
				bookImage4.src = `${list.list[3].imageUrl}`;
				bookImage4.alt = '';

				var bookImage5 = document.createElement('img');
				bookImage5.className = 'ui tiny image';
				bookImage5.src = `${list.list[4].imageUrl}`;
				bookImage5.alt = '';

				var listName = document.createElement('a');
				listName.href = `/list/${list._id}`;
				listName.class = 'list-title';
				listName.innerHTML = `${list.name}`;

				gridCol1.appendChild(bookImage1);
				gridCol2.appendChild(bookImage2);
				gridCol3.appendChild(bookImage3);
				gridCol4.appendChild(bookImage4);
				gridCol5.appendChild(bookImage5);
				gridRow1.appendChild(listName);
				gridRow2.appendChild(gridCol1);
				gridRow2.appendChild(gridCol2);
				gridRow2.appendChild(gridCol3);
				gridRow2.appendChild(gridCol4);
				gridRow2.appendChild(gridCol5);
				gridDiv.appendChild(gridRow1);
				gridDiv.appendChild(gridRow2);
				segment.appendChild(gridDiv);
				listDiv.appendChild(segment);

				return '';
				// '<div class="ui segment">' +
				// '<div class="ui five column grid">' +
				// '<div class="ui row">' +
				// list.name +
				// '</div>' +
				// '<div class="ui row">' +
				// '<div class="column">' +
				// '<img class="ui mini image" src= ' +
				// list.list[0].imageUrl +
				// '></img>' +
				// '</div>' +
				// '<div class="column">' +
				// '<img class="ui mini image" src= ' +
				// list.list[1].imageUrl +
				// '></img>' +
				// '</div>' +
				// '<div class="column">' +
				// '<img class="ui mini image" src= ' +
				// list.list[2].imageUrl +
				// '></img>' +
				// '</div>' +
				// '<div class="column">' +
				// '<img class="ui mini image" src= ' +
				// list.list[3].imageUrl +
				// '></img>' +
				// '</div>' +
				// '<div class="column">' +
				// '<img class="ui mini image" src= ' +
				// list.list[4].imageUrl +
				// '></img>' +
				// '</div>' +
				// '</div>' +
				// '</div>' +
				// '</div>'
			})
			.join('');

		// listDiv.innerHTML = listHtml;
		// listDiv.appendChild(listHtml);
	});
