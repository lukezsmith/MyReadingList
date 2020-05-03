const express = require('express');
const router = express.Router();
const ReadingList = require('../../models/ReadingList');

// Endpoints

// @route   GET api/lists/id
// @desc    Get a reading list by id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // res.send('Reading List route');
    const list = await ReadingList.findById(req.params.id);
    if (!list) {
      return res.status(400).send('List not found');
    }
    res.json(list);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).send('List not found');
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/lists
// @desc    Create a new reading list
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
    res.send(readingList);
  } catch (err) {
    console.error(err.message);
  }
});

// @route   PATCH api/lists/id
// @desc    Add new comment to list
// @access  Public
router.patch('/:id', async (req, res) => {
  try {
    const { comment } = req.body;
    const listId = req.params.id;
    const readingList = await ReadingList.findById(listId);
    readingList.comments.push(comment);
    await readingList.save();
    res.send('comment added');
  } catch (err) {
    console.error(err.message);
  }
});

// @route   GET api/lists
// @desc    Get ten most-recent lists
// @access  Public
router.get('/', async (req, res) => {
  try {
    // const lists = await ReadingList.find().exec(function (err, listObjects) {
    // console.log(listObjects.list);
    // // listObjects = listObjects.map((listObject.list) => list.toObject());
    // res.json(lists);
    const lists = await ReadingList.find().limit(10).sort('-date');
    res.json(lists);

    // });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
