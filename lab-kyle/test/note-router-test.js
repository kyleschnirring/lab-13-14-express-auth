'use strict';

// set env vars
process.env.APP_SECRET = process.env.APP_SECRET || 'kings are klever';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

// require npm modules
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('authkyle:note-router-test');

// require app modules
const noteController = require('../controller/note-controller');
const authController = require('../controller/auth-controller');
const userController = require('../controller/user-controller');

// setup module constants
const port = process.env.PORT || 3000;
const baseURL = `localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('testing module note-router', function(){
  before((done) => {
    debug('before module note-router');
    if (! server.isRunning) {
      server.listen(port, () => {
        server.isRunning = true;
        debug(`server up ::: ${port}`);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    debug('after module note-router');
    if (server.isRunning) {
      server.close(() => {
        server.isRunning = false;
        debug('server down');
        done();
      });
      return;
    }
    done();
  });

  describe('testing module note router', function(){
    beforeEach((done) => {
      authController.signup({username: 'KyleSchnirring', password:'pass123'})
      .then( token => this.tempToken = token)
      .then( () => done())
      .catch(done);
    });

    afterEach((done) => {
      Promise.all([
        userController.removeAllUsers()
        , noteController.removeAllNotes()
      ])
      .then( () => done())
      .catch(done);
    });

    describe('testing post /api/note', () => {
      it('should return a note', (done) => {
        request.post(`${baseURL}/note`)
        .send({
          name: 'do this'
          , content: 'do this'
        })
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then( res => {
          console.log(res.body);
          expect(res.status).to.equal(200);
          done();
        }).catch(done);
      });
    });


  });

});
