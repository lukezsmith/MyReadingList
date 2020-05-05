# MyReadingList

## Table of Contents
###1 - Installation & Setup:
* 1.1 - Downloading MyReadingList
* 1.2 - Installation
* 1.3 - Running MyReadingList

###2 - MyReadingList API:
* 2.1 - Endpoints
* 2.2 - JSON Response Example

###3 - Google Books External API:
* 3.1 - Endpoints
* 3.2 - JSON Response Example

###3 - Hosted Example

##Installation & Setup
###1.1 - Downloading MyReadingList:

Clone the repository by running `git clone https://github.com/lukezsmith/MyReadingList.git` in terminal or [https://github.com/lukezsmith/MyReadingList/archive/master.zip](download the zip)

###1.2 - Installation:
Install dependencies by running `npm install` in terminal

###1.3 - Running MyReadingList:
Run MyReadingList by running `npm start` in terminal

##MyReadingList API
###2.1 - Endpoints

* **Get Ten Most-recent Reading Lists**: `GET /lists`
    * `Success: HTTP 200 (OK)`
    * `Failure: HTTP 400 (Bad Request)`
    * This endpoint handles a GET request for requesting a list of reading lists. 

    * It returns list of the ten most-recently created reading lists.


* **Get Specific Reading List**: `GET /lists/:id`
    * `Success: HTTP 200 (OK)`
    * `Failure: HTTP 400 (Bad Request)`
    * `Failure: HTTP 404 (Not Found)`

    * This endpoint handles a GET request for requesting a specific reading list by its id. 

    * It returns the details of a specified reading list.


* **Create New Reading List**: `POST /lists/`
    * `Success: HTTP 200 (OK)`
    * `Failure: HTTP 400 (Bad Request)`

    * This endpoint handles a POST request for creating a new reading list. 

    * Adds a reading list to list of all reading lists. 

    * Request must include the following: `name`, `description`, `list`, `date` and `comments`


* **Add New Comment to Existing Reading List**: `PATCH /lists/id`
    * `Success: HTTP 200 (OK)`
    * `Failure: HTTP 400 (Bad Request)`

    * This endpoint handles a PATCH request for adding a new comment to an existing reading list. 

    * Adds a new comment to the comments of an existing reading list. 

    * Request must include the following: `comment`

###2.2 - JSON Response Example`json

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

