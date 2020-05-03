// Class for creating custom book objects that will populate each reading list
class Book {
  constructor (
    id,
    title,
    subtitle,
    authors,
    publisherName,
    publishedDate,
    imageUrl
  ) {
    this.id = id;

    // Create title composite with subtitle for display purposes
    if (subtitle !== '') {
      this.title = title + ': ' + subtitle;
    } else {
      this.title = title;
    }

    this.authors = this.setAuthors(authors);
    this.publisherName = publisherName;
    this.publishedDate = publishedDate;
    this.imageUrl = imageUrl;
  }

  // Get book ID
  getId () {
    return this.id;
  }

  // Get book title
  getTitle () {
    return this.title;
  }

  // Get book subtitle
  getSubtitle () {
    return this.title;
  }

  // Get Title: Subtitle composite
  getTitleSubtitleComposite () {
    return this.title + ': ' + this.subtitle;
  }

  // Get book authors
  getAuthors () {
    return this.authors;
  }

  // Converts array of authors to a composite string
  setAuthors (authors) {
    var authorString = '';
    if (authors.length === 1) {
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
      }
    }
    return authorString;
  }

  // Get book publisher name
  getPublisher () {
    return this.publisherName;
  }

  // Get book publish date
  getPublishedDate () {
    return this.publishedDate;
  }

  // Get Google Books Api thumbnail image string
  getImageUrl () {
    return this.imageUrl;
  }
}
module.exports = Book;
