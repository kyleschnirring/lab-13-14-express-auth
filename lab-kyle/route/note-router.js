'use strict';

// npm modules
const debug = require('debug')('authKyle:note-router');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();

// app modules
const parseBearerAuth = require('../lib/parse-bearer-auth');
const noteController = require('../controller/snack-controller');

// module constants
const noteRouter = module.exports = new Router();

noteRouter.post('/note', parseBearerAuth, jsonParser, function(req, res, next){
  debug('POST /api/note');
  req.body.userId = req.userId;
  noteController.createNote(req.body)
  .then( note => res.json(note))
  .catch(next);
});
