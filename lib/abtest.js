/*!
 * abtest - lib/abtest.js
 */

'use strict';

/**
 * Module dependencies.
 */

var debug = require('debug')('abtest');
var assert = require('assert');

/**
 * Module exports
 */

module.exports = ABTest;

/**
 * AB test
 * @param {Object} ctx
 *   {Function} getCookie(key)
 *   {Function} setCookie(key, value)
 *   {Object} query
 */
function ABTest(ctx) {
  ctx = ctx || {};
  if (!(this instanceof ABTest)) return new ABTest(ctx);

  this.ctx = ctx;
  this.cookie = 'abtest';
  this.query = 'abtest';
  this.method = require('./random');
  this.buckets = {};
  this.enableCookie = true;
  this.enableQuery = true;
  this.defaultBucket = null;
  this._bucket = null;
}

var KEYS = [
  'cookie',
  'method',
  'buckets',
  'enableCookie',
  'enableQuery',
  'defaultBucket'
];

/**
 * configure the ab test instance
 * @param {Object} config
 *   - {Object} Bucket
 *   - {String} [cookie] cookie name, default to 'abtest'
 *   - {Function} [method] method, default to 'random'
 *   - {String} [defaultBucket] default bucket name
 *   - {Boolean} [enable] enable abtest, default to true
 *   - {Boolean} [enableCookie] enable set cookie, default to true
 *   - {Boolean} [enableQuery] enable get from query, default to true
 * @return {ABTest}
 */
ABTest.prototype.configure = function (config) {
  if (!config) {
    return;
  }

  for (var i = 0; i < KEYS.length; i++) {
    var key = KEYS[i];
    if (config.hasOwnProperty(key)) {
      this[key] = config[key];
    }
  }

  return this;
};

ABTest.prototype.fromQuery = function () {
  if (!this.enableQuery) return null;
  if (!this.ctx.query) return null;
  var query = this.ctx.query;
  var bucket = query[this.query];
  // not valid
  if (!this.buckets.hasOwnProperty(bucket)) return null;
  debug('get bucket `%s` from query', bucket);
  return bucket;
};

ABTest.prototype.fromCookie = function () {
  if (!this.enableCookie) return null;
  if (!this.ctx.getCookie) return null;
  var bucket = this.ctx.getCookie(this.cookie);

  // not valid
  if (!this.buckets.hasOwnProperty(bucket)) return null;
  debug('get bucket `%s` from cookie', bucket);
  return bucket;
};

ABTest.prototype.fromMethod = function () {
  var bucket = this.method(this.buckets);
  debug('get bucket `%s` from method', bucket);
  return bucket;
};

Object.defineProperty(ABTest.prototype, 'bucket', {
  get: function () {
    if (this._bucket) {
      debug('already got bucket: %s', this._bucket);
      return this._bucket;
    }
    this._bucket = this.fromQuery() || this.fromCookie();

    if (!this._bucket) {
      this._bucket = this.fromMethod() || this.defaultBucket;
      if (this.enableCookie && this.ctx.setCookie) {
        debug('set cookie %s=%s', this.cookie, this._bucket);
        this.ctx.setCookie(this.cookie, this._bucket);
      }
    }
    debug('get the final bucket: `%s`', this._bucket);
    return this._bucket;
  }
});
