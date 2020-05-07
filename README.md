# MyReadingList

## Table of Contents
### 1 - Installation & Setup:
* 1.1 - Downloading MyReadingList
* 1.2 - Installation
* 1.3 - Running MyReadingList

### 2 - MyReadingList API:
* 2.1 - Endpoints
* 2.2 - JSON Response Example

### 3 - Google Books External API:
* 3.1 - Endpoints
* 3.2 - JSON Response Example

### 4 - Hosted Example

## Installation & Setup
### 1.1 - Downloading MyReadingList:

Clone the repository by running `git clone https://github.com/lukezsmith/MyReadingList.git` in terminal or [https://github.com/lukezsmith/MyReadingList/archive/master.zip](download the zip)

### 1.2 - Installation:
Install dependencies by running `npm install` in terminal

### 1.3 - Running MyReadingList:
Run MyReadingList by running `npm start` in terminal

## MyReadingList API
### 2.1 - Endpoints

[Full Postman Documentation](https://documenter.getpostman.com/view/8280766/SzmcZdy7?version=latest)

* **Get Ten Most-recent Reading Lists**: `GET /lists`
    * `Success: HTTP 200 (OK)` - Returns JSON Object
    * `Failure: HTTP 400 (Bad Request)` - Returns Text: "Bad Request"
    * This endpoint handles a GET request for requesting a list of reading lists. 

    * It returns list of the ten most-recently created reading lists.


* **Get Specific Reading List**: `GET /lists/:id`
    * `Success: HTTP 200 (OK)` - Returns JSON Object
    * `Failure: HTTP 400 (Bad Request)` - Returns Text: "Bad Request"
    * `Failure: HTTP 404 (Not Found)` - Returns Text: "Not Found"

    * This endpoint handles a GET request for requesting a specific reading list by its id. 

    * It returns the details of a specified reading list.


* **Create New Reading List**: `POST /lists/`
    * `Success: HTTP 200 (OK)` - Returns JSON Object
    * `Failure: HTTP 400 (Bad Request)` - Returns Text: "Bad Request"

    * This endpoint handles a POST request for creating a new reading list. 

    * Adds a reading list to list of all reading lists. 

    * Request must include the following: `name`, `description`, `list`, `date` and `comments`


* **Add New Comment to Existing Reading List**: `PATCH /lists/:id`
    * `Success: HTTP 200 (OK)` - Returns JSON Object
    * `Failure: HTTP 400 (Bad Request)` - Returns Text: "Bad Request"

    * This endpoint handles a PATCH request for adding a new comment to an existing reading list. 

    * Adds a new comment to the comments of an existing reading list. 

    * Request must include the following: `comment`

### 2.2 - JSON Response Example
Request: `GET http://localhost:5000/lists/5eaf6b599a236024347a6df5` 

Response: 

    "name": "Microsoft vs Apple Reading List:",
    "date": "2020-05-04T01:08:06.239Z",
    "comments": [
        "RIP Steve Jobs"
    ],
    "_id": "5eaf6b599a236024347a6df5",
    "desc": "A list on the famous rivalry",
    "list": [
        {
            "_id": "5eaf6b599a236024347a6df6",
            "id": "1qvfPaJFKFUC",
            "title": "The Story of Microsoft",
            "authors": "Nell Musolf",
            "publishedDate": "2008-01-01T00:00:00.000Z",
            "imageUrl": "http://books.google.com/books/content?id=1qvfPaJFKFUC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api"
        },
        {
            "_id": "5eaf6b599a236024347a6df7",
            "id": "klV_BAAAQBAJ",
            "title": "Bill Gates: A Biography",
            "authors": "Michael B. Becraft",
            "publishedDate": "2014-08-26T00:00:00.000Z",
            "imageUrl": "http://books.google.com/books/content?id=klV_BAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api"
        },
        {
            "_id": "5eaf6b599a236024347a6df8",
            "id": "6e4cDvhrKhgC",
            "title": "Steve Jobs",
            "authors": "Walter Isaacson, and STEVE JOBS",
            "publishedDate": "2011-10-24T00:00:00.000Z",
            "imageUrl": "http://books.google.com/books/content?id=6e4cDvhrKhgC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api"
        },
        {
            "_id": "5eaf6b599a236024347a6df9",
            "id": "BJkBs5ICbpMC",
            "title": "Apple Vs. Microsoft: The Innovation, the Power, the Epic Nerd Catfight!",
            "authors": "GadChick",
            "publishedDate": "2012-07-30T00:00:00.000Z",
            "imageUrl": "http://books.google.com/books/content?id=BJkBs5ICbpMC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api"
        },
        {
            "_id": "5eaf6b599a236024347a6dfa",
            "id": "FHuQv_2TMIQC",
            "title": "Running Windows on Your Mac",
            "authors": "Dwight Silverman",
            "publishedDate": "2010-04-07T00:00:00.000Z",
            "imageUrl": "http://books.google.com/books/content?id=FHuQv_2TMIQC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api"
        }
    ],
    "__v": 1

## Google Books External API:
### 3.1 - Endpoints
MyReadingList utilises Google's Books API to find books to add to each reading list. A wrapper was created for querying Google Books API. This wrapper can be found in `/routes/search.js`.


The Google Books API endpoint used in MyReadingList is:
`https://www.googleapis.com/books/v1/volumes?q=`
as well as using the `maxResults=40` and `printType=books` parameters to filter the results in a more relevant way. 
An API key is also used in the query which can be found/changed in `/config/default.json`.

* **Search Google Books API with query**: `POST /search/:query`
    * `Success: HTTP 200 (OK)` - Returns JSON Object
    * `Failure: HTTP 400 (Bad Request)` - Returns Text: "Bad Request"

    * This endpoint handles a POST request for querying the Google Books API.

    * Forms the endpoint URL for a GET request to the Google Books API. Returns 40 most relevant books with regards to the supplied query parameter.  

    * Request must include the following: `query`

### 3.2 - JSON Response Example
Request: `POST http://localhost:5000/search/mathematics` 

Response: 
```json
[
    {
        "id": "_kYBqLc5QoQC",
        "title": "What is Mathematics?: An Elementary Approach to Ideas and Methods",
        "authors": "Courant Institute of Mathematical Sciences Richard Courant, Richard Courant, Herbert Robbins, Professor of Mathematics Herbert Robbins and Ian Stewart",
        "publisherName": "Oxford University Press, USA",
        "publishedDate": "1996",
        "imageUrl": "http://books.google.com/books/content?id=_kYBqLc5QoQC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api"
    },
    {
        "id": "R-qgdx2A5b0C",
        "title": "What is Mathematics, Really?",
        "authors": "Reuben Hersh",
        "publisherName": "Oxford University Press, USA",
        "publishedDate": "1999",
        "imageUrl": "http://books.google.com/books/content?id=R-qgdx2A5b0C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api"
    },
    {
        "id": "kC25qnVj4doC",
        "title": "Mathematics",
        "authors": "Timothy Gowers",
        "publisherName": "Sterling Publishing Company, Inc.",
        "publishedDate": "2010-01",
        "imageUrl": "http://books.google.com/books/content?id=kC25qnVj4doC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api"
    },
    {
        "id": "ZOfUsvemJDMC",
        "title": "The Princeton Companion to Mathematics",
        "authors": "Timothy Gowers, June Barrow-Green and Imre Leader",
        "publisherName": "Princeton University Press",
        "publishedDate": "2010-07-18",
        "imageUrl": "http://books.google.com/books/content?id=ZOfUsvemJDMC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api"
    },
    {
        "id": "JjQrpYswtYEC",
        "title": "Philosophy of Mathematics: Selected Readings",
        "authors": "Paul Benacerraf, and Hilary Putnam",
        "publisherName": "Cambridge University Press",
        "publishedDate": "1983",
        "imageUrl": "http://books.google.com/books/content?id=JjQrpYswtYEC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api"
    }
]
```

## Hosted Example
A hosted example of MyReadingList can be found at [https://morning-tundra-74810.herokuapp.com/](https://morning-tundra-74810.herokuapp.com/)