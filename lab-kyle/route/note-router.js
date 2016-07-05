'use strict';

// npm modules
const debug = require('debug')('authKyle:note-router');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const httpErrors = require('http-Errors');

// app modules
const parseBearerAuth = require('../lib/parse-bearer-auth');
const noteController = require('../controller/note-controller');

// module constants
const noteRouter = module.exports = new Router();

noteRouter.post('/note', parseBearerAuth, jsonParser, function(req, res, next){
  debug('POST /api/note');
  req.body.userId = req.userId;
  noteController.createNote(req.body)
  .then( note => res.json(note))
  .catch(next);
});

// noteRouter.get('/note/all/:id', parseBearerAuth, (req, res, next) => {
//   debug('GET /api/note/all/:id');
//   noteController.fetchAllNotes(req.params.id)
//   .then((notes) => {
//     res.json(notes);
//   })
//   .catch(next);
// });

noteRouter.get('/note/all', parseBearerAuth, (req, res, next) => {
  debug('GET /api/note/all/');
  noteController.fetchAllNotes()
  .then((notes) => {
    res.json(notes);
  })
  .catch(next);
});

noteRouter.get('/note/:id', parseBearerAuth, function(req, res, next){
  debug('Get: /api/entry/:id');
  noteController.fetchNote(req.params.id)
  .then(note => {
    if (!note) return next(httpErrors(404, 'origin not found'));
    res.json(note);
  })
  .catch(next);
});

noteRouter.put('/note/:id', parseBearerAuth, jsonParser, function(req, res, next){
  debug('PUT: /api/entry/username', req.params.id);
  noteController.updateNote(req.params.id, req.body)
  .then(note => {
    if(!note) return next(httpErrors(404, 'origin not found'));
    res.json(note);
  })
  .catch(next);
});

noteRouter.delete('/note/:id', parseBearerAuth, function(req, res, next){
  debug('DELETE: /api/note/:id', req.params.id);
  noteController.removeOneNote(req.params.id)
  .then(() => res.status(204).send())
  .catch(next);
});
