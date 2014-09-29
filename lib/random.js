/*!
 * abtest - lib/random.js
 */

'use strict';

/**
 * Module dependencies.
 */

var debug = require('debug')('abtest:random');

/**
 * simple random
 * @param {Obejct} buckets
 *   {
 *     [name1]: [radio1],
 *     [name2]: [radio2]
 *   }
 * @return {String} name
 */
module.exports = function(buckets) {
  var total = 0;
  var sections = [];
  for (var key in buckets) {
    total += buckets[key];
    sections.push([total, key]);
  }
  debug('get sections %j for buckets %j', sections, buckets);

  var num = Math.random() * total;
  // force num never equal 0
  if (num === 0) num = 0.000001;
  debug('get random number %d', num);

  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];
    if (num <= section[0]) {
      debug('get bucket %s', section[1]);
      return section[1];
    }
  }
}
