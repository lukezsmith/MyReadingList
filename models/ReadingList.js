const mongoose = require('mongoose');

// const bookSchema = require('./Book');

const bookSchema = new mongoose.Schema({
	id: { type: String },
	title: {
		type: String,
	},
	authors: { type: String },
	publisher: { type: String },
	publishedDate: { type: Date },
	imageUrl: { type: String },
});

const ReadingListSchema = new mongoose.Schema({
	name: {
		type: String,
		default: 'Your Reading List',
	},
	desc: {
		type: String,
	},
	list: [bookSchema],
	date: { type: Date, default: Date.now() },
	comments: [String],
});

module.exports = ReadingList = mongoose.model('readinglist', ReadingListSchema);
