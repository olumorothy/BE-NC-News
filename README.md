# NewsApp

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Background

A RESTful API built using node.js, express.js and postgresSQL. Gives access to databases containing articles, comments, topics and users.
This backend server is hosted on heroku at https://earlynews.herokuapp.com/api

\*\* Note: To run the project locally you must have node and psql installed

## How to Clone

The information below will allow you to get this application on your local machine.

Clone this repository on to your local machine using the command

```
git clone https://github.com/olumorothy/BE-NC-News.git
```

## Installation Guides

To install the necessary dependencies, run the following command;

```
npm install
```

## Connecting to the database

You will need to create two .env files to setup this project on your local repo:
.env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment. Double check that these .env files are .gitignored.

## Seed Local Database

Run the command below to remove any existing data from a database, recreate the tables and repopulate it dynamically.

```
npm run setup-dbs
npm run seed
```

## To run test

```
npm t
```

## Minimum Requirements

- Node: v16.16.0
- NPM: v8.11.0
- Postgres v8.8.0

# API ENDPOINTS

The API contains several endpoints such as:

```

- GET /api/topics --> Returns an array of topic objects.

- GET /api/articles/:article_id --> Returns an article object with the comment count.

- GET /api/users --> Returns user object.

- PATCH /api/articles/:article_id --> Pass an object such as { inc_votes: 10 } and returns the article with the number of votes updated on key article_id.

- GET /api/articles/:article_id --> Returns an article object with the specified id.

- GET /api/articles --> Returns an array of article objects.
 Accepted queries:
    - sort_by, which sorts the articles by any valid column (defaults to date)
    - order, which can be set to asc or desc for ascending or descending (defaults to descending)
    - author, which filters the articles by the username value specified in the query
    - topic, which filters the articles by the topic value specified in the query

- GET /api/articles/:article_id/comments --> Returns an array of comments for the given article_id with the most recent comments first.

- POST /api/articles/:article_id/comments --> Pass an object with username and body and returns the posted comment.

  request body: { "username": "coolDJ", "body": "This is a TEST post" }

- DELETE /api/comments/:comment_id --> deletes the given comment by "comment_id"

- GET /api --> JSON describing all the available endpoints on your API
```
