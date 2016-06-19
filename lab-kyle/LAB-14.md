![cf](https://i.imgur.com/7v5ASc8.png) lab 14 authorization
======

[![](https://img.shields.io/badge/Issues%3F-Ask%20for%20Help!-55cbe0.svg)](https://github.com/codefellows/seattle-javascript-401n1/issues/new)
[![Build Status](https://travis-ci.org/codefellows-seattle-javascript-401n1/lab-09-10-11-express-api.svg?branch=master)](https://travis-ci.org/codefellows-seattle-javascript-401n1/lab-09-10-11-express-api)

# To Submit this Assignment
  * fork this repository
  * write all of your code in a directory named `lab-` + `<your name>` **e.g.** `lab-duncan`
  * push to your repository
  * submit a pull request to this repository
  * submit a link to your PR in canvas
  * write a question and observation on canvas

# Build Tool Instructions
* create a package.json that lists all dependencies and developer dependencies
* include an .eslintrc
* include a .gitignore
* create a gulpfile
 * have a lint task for running eslint
 * have a test task for running mocha
 * have a nodemon task that restarts your server any time a change has been bade to your **.js** files
 * have a default task for running the lint and mocha tasks

# Directions
* Using the same repository from lab 13
* Craeate a Bearer Auth middleware parsers
* Create an _simple resource_ that has at least three propertys
 * must have a property `userId` that references the `_id` of the user that created the _simple resource_
 * the `userId` property can only be set from an `_id` found using the _Bearer Auth Middleware_
* use the `body-parser` express middleware to on `POST` and `PUT` routes
* use the npm `debug` module to log the functions being executed in your app
* using the express `Router` create routes for doing **RESTFUL CRUD** operations on your _simple resource_
 * store all objects created on the in memory `storage` module we created in lecture

## Server Endpoints
### `/api/simple-resource-name`
* `POST` request
 * pass data as stringifed json in the body of a post request to create a resource

### `/api/simple-resource-name/:id`
* `GET` request 
 * pass the id of a resource though the url endpoint to `req.params` to fetch a simple-resource   
* `PUT` request
 * pass data as stringifed json in the body of a put request to update a resource
* `DELETE` request
 * pass the id of a resource though the url endpoint to `req.params` to delete a simple-resource   

## Tests 
* your tests should start your server when they begin and stop your server when they finish
* write a test to ensure that your api returns a status code of 404 for routes that have not been registered
* write tests to ensure your `/api/simple-resource-name` endpoint responds as described for each condition below:
 * `GET` - test 200, response body like `{<data>}` for a request made with a valid id 
 * `GET` - test 401, responds with 'unathorized' if no token was provided
 * `GET` - test 400, responds with 'bad request' if no id was provided in the request
 * `GET` - test 404, responds with 'not found' for valid request made with an id that was not found
 * `PUT` - test 200, response body like  `{<data>}` for a post request with a valid body
 * `PUT` - test 401, responds with 'unathorized' if no token was provided
 * `PUT` - test 400, responds with 'bad request' for if no `body provided` or `invalid body`
 * `PUT` - test 404, responds with 'not found' for valid request made with an id that was not found
 * `POST` - test 200, response body like  `{<data>}` for a post request with a valid body
 * `POST` - test 401, responds with 'unathorized' if no token was provided
 * `POST` - test 400, responds with 'bad request' for if no `body provided` or `invalid body`

## Bonus
* **1pts** a `GET` request to `/api/simple-resource-name/all` should retrun an array of all of the ids for that resource
* **1pt** write tests for the `DELETE` request

