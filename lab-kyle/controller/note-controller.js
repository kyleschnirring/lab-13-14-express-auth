'use strict';

const debug = require('debug')('authKyle:note-controller');
const Note = require('../model/note');
const httpErrors = require('http-errors');

exports.createNote = function(noteData){
  debug('createNote');
  return new Promise((resolve, reject) => {
    new Note(noteData).save()
    .then( note => resolve(note))
    .catch( err => reject(httpErrors(400, err.message)));
  });
};

exports.fetchNote = function(id){
  return new Promise((resolve, reject) => {
    debug('fetchNote');
    Note.findOne({_id: id})
    .then(user => resolve(user))
    .catch(err => reject(httpErrors(400,err.message)));
  });
};

exports.updateNote = function(id, data){
  return new Promise((resolve, reject) => {
    if(!id){
      var err = httpErrors(400,'bad request');
      return reject(err);
    }
    if(!data){
      err = httpErrors(400,'bad request');
      return reject(err);
    }
    if(!data.email){
      err = httpErrors(400,'bad request');
      return reject(err);
    }

    Note.findOneAsync({_id: id})
   .then(() => {
     Note.updateAsync({_id: id}, data)
     .then(() => {
       Note.findOneAsync({_id: id})
       .then(resolve)
       .catch(reject);
     })
    .catch( err => reject(httpErrors(400, err.mesage)));
   })
  .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeOneNote = function(id){
  return new Promise ((resolve, reject) => {
    debug('delete one note');
    Note.findOne({_id: id})
    .then(() => {
      Note.remove({_id: id})
      .then(resolve)
      .catch(err => reject(httpErrors(500, err.message)));
    })
    .catch(err => reject(httpErrors(404, err.message)));
  });
};


exports.removeAllNotes = function(){
  return Note.remove({});
};
