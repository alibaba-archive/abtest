/*!
 * abtest - test/abtest.test.js
 */

'use strict';

/**
 * Module dependencies.
 */

var request = require('supertest');
var ABTest = require('..');
var koa = require('koa');

describe('ABTest', function () {
  describe('with koa', function () {
    it('should have bucket', function (done) {
      var app = App({
        buckets: {
          a: 5,
          b: 5
        }
      });

      request(app)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        var cookie = res.headers['set-cookie'];
        var body = res.text.toString();
        cookie[0].should.match(new RegExp('abtest=' + body));
        done(err);
      });
    });

    it('should get bucket from cookie', function (done) {
      var app = App({
        buckets: {
          a: 0,
          b: 10
        }
      });

      request(app)
      .get('/')
      .set('cookie', 'abtest=a')
      .expect(200)
      .expect('a', done);
    });

    it('should get bucket from query', function (done) {
      var app = App({
        buckets: {
          a: 0,
          b: 10
        }
      });

      request(app)
      .get('/path?abtest=a')
      .set('cookie', 'abtest=b')
      .expect(200)
      .expect('a', done);
    });

    it('should get bucket from method when cookie and query invalid', function (done) {
      var app = App({
        buckets: {
          a: 0,
          b: 10
        }
      });

      request(app)
      .get('/path?abtest=c')
      .set('cookie', 'abtest=c')
      .expect(200)
      .expect('b', done);
    });

    it('should get bucket undefined when configure without bucket', function (done) {
      var app = App();
      request(app)
      .get('/')
      .expect(204, done);
    });

    it('should ignore query when enableQuery = false', function (done) {
      var app = App({
        buckets: {
          a: 0,
          b: 10
        },
        enableQuery: false
      });
      request(app)
      .get('/path?abtest=a')
      .expect('b', done);
    });

    it('should ignore cookie when enableCookie = false', function (done) {
      var app = App({
        buckets: {
          a: 0,
          b: 10
        },
        enableCookie: false
      });
      request(app)
      .get('/')
      .set('cookie', 'abtest=a')
      .expect('b', function (err, res) {
        (res.headers['set-cookie'] === undefined).should.be.ok;
        done(err);
      });
    });
  });
});

function App(config) {
  var app = koa();
  app.use(function* () {
    this.abtest = ABTest({
      query: this.query,
      getCookie: this.cookies.get.bind(this.cookies),
      setCookie: this.cookies.set.bind(this.cookies)
    });
    this.abtest.configure(config);
    this.body = this.abtest.bucket;
    this.body = this.abtest.bucket;
  });
  return app.listen();
}
