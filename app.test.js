/* eslint-disable no-undef */
'use strict';

const request = require('supertest');
const app = require('./app');

// Connect to mongoDB database
const Database = require('./config/db');
const db = new Database();
db.connectDB();

// DB schema for creating first test reading list to use for tests
const ReadingList = require('./models/ReadingList');

// array for keeping track of all newly-created readinglist IDs
var readingListIds = [];

describe('Test the MyReadingList API', () => {
    beforeAll(async () => {
        // await testReadingList.remove({});
        // add a reading list for GET/lists/:id test

        var testBook1 = {
            title: 'testBook1',
            authors: 'testAuthor1',
            publisher: 'testPublisher1',
            publishedDate: '01/01/2001',
            imageUrl: 'testImageUrl1'
        };

        var testBook2 = {
        title: 'testBook2',
            authors: 'testAuthor2',
            publisher: 'testPublisher2',
            publishedDate: '02/02/2002',
            imageUrl: 'testImageUrl2'
        };

        var testBook3 = {
            title: 'testBook3',
                authors: 'testAuthor3',
                publisher: 'testPublisher3',
                publishedDate: '03/03/2003',
                imageUrl: 'testImageUrl3'
            };

        var _id = '5eb2dd972cacba29124ee5e6';
        var name = 'Test List';
        var desc = 'Test Description';
        var list = [testBook1, testBook2, testBook3];
        var comments = ['testComment1', 'testComment2'];

        var newList = new ReadingList({
            _id,
            name,
            desc,
            list,
            comments
          });

          await newList.save();

          readingListIds.push(_id);
    });

    afterAll(async () => {
        // Delete database entries that are created in these tests
        for (const listId of readingListIds) {
            await ReadingList.deleteOne({ _id: listId });
        }

        // Disconnect from server
        db.disconnectDB();
    });

    test('GET /lists/ Success', (done) => {
      return request(app)
        .get('/lists')
        .expect(200)
        .end(done);
    });

    test('GET /lists/ returns JSON', (done) => {
        return request(app)
          .get('/lists')
          .expect('Content-Type', /json/)
          .end(done);
      });

    test('GET /lists/:id Success', (done) => {
    return request(app)
        .get('/lists/5eb2dd972cacba29124ee5e6')
        .expect(200)
        .end(done);
    });

    test('GET /lists/:id Success - returns JSON', (done) => {
        return request(app)
        .get('/lists/5eb2dd972cacba29124ee5e6')
        .expect('Content-Type', /json/)
        .end(done);
    });

    test('GET /lists/:id Failure (Invalid id parameter format)', (done) => {
        return request(app)
            .get('/lists/123')
            .expect(400)
            .end(done);
        });

    test('GET /lists/:id Failure (Invalid id parameter format) - returns Text', (done) => {
        return request(app)
            .get('/lists/123')
            .expect('Content-Type', /text/)
            .end(done);
        });
    test('GET /lists/:id Failure (Undefined parameter query)', (done) => {
        return request(app)
            .get('/lists/5eb2d0b1101ff023febf0846')
            .expect(404)
            .end(done);
        });

    test('GET /lists/:id Failure (Undefined parameter query) - returns Text', (done) => {
        return request(app)
            .get('/lists/5eb2d0b1101ff023febf0846')
            .expect('Content-Type', /text/)
            .end(done);
        });

    test('POST /lists/ Success', (done) => {
    const testList = {
        name: 'Test List',
        desc: 'Test description',
        list: [

            { name: 'First book', authors: 'First authors', publisher: 'First publisher', publishedDate: '01/01/2001', imageUrl: 'First image Url' },
            { name: 'Second book', authors: 'Second authors', publisher: 'Second publisher', publishedDate: '01/01/2001', imageUrl: 'Second image Url' },
            { name: 'Third book', authors: 'Third authors', publisher: 'Third publisher', publishedDate: '01/01/2001', imageUrl: 'Third image Url' },
            { name: 'Fourth book', authors: 'Fourth authors', publisher: 'Fourth publisher', publishedDate: '01/01/2001', imageUrl: 'Fourth image Url' },
            { name: 'Fifth book', authors: 'Fifth authors', publisher: 'Fifth publisher', publishedDate: '01/01/2001', imageUrl: 'Fifth image Url' }
        ],
        comments: ['Very cool list', 'Love this list, good job!']
    };

    return request(app)
        .post('/lists/')
        .send(testList)
        .expect(200)
        .end(function (err, res) {
            if (err) throw err;
            readingListIds.push(res.body._id);
            done();
        });
    });

    test('POST /lists/ Success - returns JSON', (done) => {
    const testList = {
        _id: '5eb2fd17c64c872f717b7040',
        name: 'Test List',
        desc: 'Test description',
        list: [
            { name: 'First book', authors: 'First authors', publisher: 'First publisher', publishedDate: '01/01/2001', imageUrl: 'First image Url' },
            { name: 'Second book', authors: 'Second authors', publisher: 'Second publisher', publishedDate: '01/01/2001', imageUrl: 'Second image Url' },
            { name: 'Third book', authors: 'Third authors', publisher: 'Third publisher', publishedDate: '01/01/2001', imageUrl: 'Third image Url' },
            { name: 'Fourth book', authors: 'Fourth authors', publisher: 'Fourth publisher', publishedDate: '01/01/2001', imageUrl: 'Fourth image Url' },
            { name: 'Fifth book', authors: 'Fifth authors', publisher: 'Fifth publisher', publishedDate: '01/01/2001', imageUrl: 'Fifth image Url' }
        ],
        comments: ['Very cool list', 'Love this list, good job!']
    };

    return request(app)
        .post('/lists/')
        .send(testList)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            if (err) throw err;
            readingListIds.push(res.body._id);
            done();
        });
    });

    test('POST /lists/ Failure (Bad Request -  empty reading list)', (done) => {
        const emptyList = {
            name: 'Empty List',
            desc: 'Empty list description',
            list: [

            ],
            comments: ['Very empty list', 'Love this empty list, good job!']
        };
        return request(app)
            .post('/lists/')
            .send(emptyList)
            .expect(400)
            .end(done);
        });

    test('POST /lists/ Failure (Bad Request -  empty reading list) - returns text', (done) => {
        const emptyList = {
            name: 'Empty List',
            desc: 'Empty list description',
            list: [

            ],
            comments: ['Very empty list', 'Love this empty list, good job!']
        };
        return request(app)
            .post('/lists/')
            .send(emptyList)
            .expect('Content-Type', /text/)
            .end(done);
        });

    // patch 200
    // test('PATCH /lists/:id Success', (done) => {
    //     const comment = 'Test comment';

    //     return request(app)
    //         .patch('/lists/5eb2dd972cacba29124ee5e6')
    //         .send(comment)
    //         .expect(200)
    //         .end(function (err, res) {
    //             if (err) throw err;
    //             readingListIds.push(res.body._id);
    //             done();
    //         });
    //     });

    // 200 returns json

    // patch 400

    // 400 returns text

    // patchj 404

    // 400 returns text

    // ALL /SEARCH tests
  });
