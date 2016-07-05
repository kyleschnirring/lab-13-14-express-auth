'use strict';

// npm modules
const Router = require('express').Router;
const debug = require('debug')('authdemo:auth-routuer');
const jsonParser = require('body-parser').json();
const parseBasicAuth = require('../lib/parse-basic-auth');

// app modules
const authController = require('../controller/auth-controller');

// module constants
const authRouter = module.exports = new Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  debug('posting signup', req.body);
  authController.signup(req.body)
  .then(token => res.send(token))
  .catch(next);
});

authRouter.get('/signin', jsonParser, parseBasicAuth, (req, res, next) => {
  debug('signing in');
  authController.signin(req.auth)
  .then(token => res.send(token))
  .catch(next);
});
