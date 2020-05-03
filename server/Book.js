class Book {
	constructor(
		id,
		title,
		subtitle,
		authors,
		publisherName,
		publishedDate,
		imageUrl
	) {
		this.id = id;

		//create title composite with subtitle for display purposes
		if (subtitle != '') {
			this.title = title + ': ' + subtitle;
		} else {
			this.title = title;
		}

		this.authors = this.setAuthors(authors);
		this.publisherName = publisherName;
		this.publishedDate = publishedDate;
		this.imageUrl = imageUrl;
	}

	getId() {
		return this.id;
	}

	getTitle() {
		return this.title;
	}
	getSubtitle() {
		return this.title;
	}

	getTitleSubtitleComposite() {
		return this.title + ': ' + this.subtitle;
	}

	getAuthors() {
		//create formatting for receiving authors
		return this.title;
	}

	setAuthors(authors) {
		var authorString = '';
		if (authors.length == 1) {
			authorString = authors[0];
		} else {
			for (var i = 0; i < authors.length; i++) {
				switch (i) {
					case 0:
						authorString += `${authors[i]}, `;
						break;
					case authors.length - 1:
						authorString += `and ${authors[i]}`;
						break;
					case authors.length - 2:
						authorString += `${authors[i]} `;
						break;
					default:
						authorString += `${authors[i]}, `;
						break;
				}
				// if (i == 0 || i == authors.length - 1) {
				// 	authorString += authors[i];
				// } else {
				// 	authorString += `${authors[i]} & `;
				// }
			}
		}
		return authorString;
	}

	getPublisher() {
		return this.publisherName;
	}

	getPublishedDate() {
		return this.publishedDate;
	}

	// getIsbn() {
	// 	return this.isbn;
	// }

	getImageUrl() {
		return this.imageUrl;
	}
}
module.exports = Book;
