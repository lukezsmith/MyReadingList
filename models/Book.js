const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
	title: {
		type: String,
	},
	authors: { type: String },
	publisher: { type: String },
	publishedDate: { type: Date },
	imageUrl: { type: String },
});

module.exports = Book = mongoose.model('book', BookSchema);
