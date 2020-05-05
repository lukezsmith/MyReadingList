const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ReadingList = require('../../models/ReadingList');

// Endpoints

// @route   GET api/lists/id
// @desc    Gets a reading list by id
// @access  Public
router.get('/:id', async (req, res) => {
  console.log('yes');
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).send('Bad Request');
  } else {
  try {
    const list = await ReadingList.findById(req.params.id);
    if (!list) {
      return res.status(404).send('List not found');
    }
    res.status(200).json(list);
  } catch (err) {
    console.log(err);
      res.status(500).json('Server error');
    }
  }
});

// @route   POST api/lists
// @desc    Creates a new reading list
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, desc, list, comments } = req.body;
    var readingList = new ReadingList({
      name,
      desc,
      list,
      comments
    });

    await readingList.save();
    res.status(200).send(readingList);
  } catch (err) {
    res.status(400).send('Bad request');
  }
});

// @route   PATCH api/lists/id
// @desc    Adds new comment to list
// @access  Public
router.patch('/:id', async (req, res) => {
  try {
    const { comment } = req.body;
    const listId = req.params.id;
    const readingList = await ReadingList.findById(listId);
    readingList.comments.push(comment);
    await readingList.save();
    res.status(200).send('Comment successully added to list');
  } catch (err) {
    res.status(400).send('Bad request');
  }
});

// @route   GET api/lists
// @desc    Gets ten most-recent lists
// @access  Public
router.get('/', async (req, res) => {
  try {
    const lists = await ReadingList.find().limit(10).sort('-date');
    res.status(200).json(lists);
  } catch (err) {
    console.error(err);
    res.status(400).send('Bad request');
  }
});

module.exports = router;
