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
const baseUrl = `localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('testing note-routes', function() {
  before((done) => {
    debug('before note-routes');
    if(!server.isRunning) {
      server.listen(port, () => {
        server.isRunning = true;
        debug('server is up ::', `${port}`);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if(server.isRunning) {
      server.close(() => {
        server.isRunning = false;
        debug('server is down');
        done();
      });
      return;
    }
    done();
  });

  describe('testing module note-router', function() {
    beforeEach(() => {
      authController.signup({username: 'kyle', password:'4321'})
      .then(token => {
        this.tempToken = token;
        return this.tempToken;
      })
      .then((token) => {
        return request.post(`${baseUrl}/note`)
        .send({
          name: 'newNote'
          , content: 'content New Note'
          , userId: token
        })
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then(res => {
          this.tempNote = res.body._id;
        });
      });
    });
    afterEach((done) => {
      Promise.all([
        userController.removeAllUsers()
      , noteController.removeAllNotes()
      ])
    .then(() => done())
    .catch(done);
    });

    //POST 200
    describe('testing POST on /api/note', () => {
      it('should return a note', (done) => {
        request.post(`${baseUrl}/note`)
      .send({
        name: 'what what'
        , content: 'no whAT what'
        , userId: this.tempToken
      })
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(res => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch(done);
      });
    });

    describe('testing POST on /api/note with bad data', () => {
      it('should return a 400 bad request', (done) => {
        request.post(`${baseUrl}/note`)
      .send({
        name: 'kyle'
        , cntent: 'content'
        , usefdsrId: 'fd'
      })
      .set({Authorization: `Bearer ${this.tempToken}`})
      .then(done)
      .catch((err) => {
        try {
          var res = err.response;
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('BadRequestError');
          done();
        } catch (err) {
          done(err);
        }
      });
      });
    });

  //POST 401 Unauthorized
    describe('testing POST on /api/note for 401', () => {
      it('should return 401 unauthorized', (done) => {
        request
      .post(`${baseUrl}/note`)
      .send({
        name: 'kyle'
        , content: 'stuff'
        , userId: this.tempId
      })
      .then(done)
      .catch((err) => {
        try {
          var res = err.response;
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('UnauthorizedError');
          done();
        } catch (err) {
          done(err);
        }
      });
      });
    });

    describe('GET /api/note', () => {
      it('should return a note', (done) => {
        request.get(`${baseUrl}/note/${this.tempNote}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('kyle');
        done();
      })
      .catch(done);
      });

      it('should return a 404 if no note is found', (done) => {
        request.get(`${baseUrl}/note/fakes`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .catch((err) => {
        expect(err.response.status).to.equal(404);
        done();
      });
      });

      it('should return a 401 if no token is sent', (done) => {
        request.get(`${baseUrl}/note/${this.tempNote}`)
      .catch((err) => {
        expect(err.response.status).to.equal(401);
        done();
      });
      });
    });

//Get all
    describe('GET /api/note/all', () => {
      before((done) => {
        Promise.all([
          noteController.createNote({
            name: 'name'
            , content: 'no content'
            , userId: this.tempId
          }),
          noteController.createNote({
            name: 'kyle'
            , content: 'content'
            , userId: this.tempId
          })
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return an array of notes', (done) => {
        request.get(`${baseUrl}/note/all/`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(3);
          done();
        })
        .catch(done);
      });
    });

    describe('testing PUT /api/note/:id', () => {
      it('should return a new note', (done) => {
        request.put(`${baseUrl}/note/${this.tempNote}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send({
          name: 'mike'
          ,content: 'hunt'
          ,userId: this.tempToken
        })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('mike');
          done();
        })
        .catch(done);
      });


      it('should return the modified note', (done) => {
        request.put(`${baseUrl}/note/${this.tempNote}`)
      .send({
        name: 'amy'
        , content: 'more Stuff'
        , userId: this.tempToken
      })
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.content).to.equal('more Stuff');
        done();
      }).catch(done);
      });

      it('should return 401 if no note is provided', (done) => {
        request.put(`${baseUrl}/note/${this.tempNote}`)
      .send({
        name: 'kyle'
        , content: 'stuff'
        , userId: this.tempToken
      })
      .catch((err) => {
        expect(err.response.status).to.equal(401);
        done();
      });
      });

      it('should return 400 if no note is sent', (done) => {
        request.put(`${baseUrl}/note/${this.username}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .catch((err) => {
        expect(err.response.status).to.equal(400);
        done();
      });
      });

      it('should return 404 if no note is found', (done) => {
        request.put(`${baseUrl}/note/fakeNote`)
      .send({
        name: 'alerej'
        , content: 'fakestuff'
        , userId: this.tempId
      })
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .catch((err) => {
        expect(err.response.status).to.equal(404);
        done();
      });
      });
    });

    describe('DELETE /api/note/:id', () => {
      before((done) => {
        noteController.createNote({
          name: 'kyle'
          , content: 'this has content'
          , userId: this.tempId
        })
      .then((note) => {
        this.testNote = note;
        done();
      });
      });

      it('should return a 204 status', (done) => {
        request.del(`${baseUrl}/note/${this.tempNote}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .then((res) => {
        expect(res.status).to.equal(204);
        done();
      })
      .catch(done);
      });

      it('should return a 404 if no note is found', (done) => {
        request.del(`${baseUrl}/note/fakeEntry`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .catch((err) => {
        expect(err.response.status).to.equal(404);
        done();
      });
      });

      it('should return a 401 if no token is sent', (done) => {
        request.del(`${baseUrl}/note/${this.tempNote}`)
      .catch((err) => {
        expect(err.response.status).to.equal(401);
        done();
      });
      });
    });


  });
});
