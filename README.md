abtest
---------------

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![Gittip][gittip-image]][gittip-url]

[npm-image]: https://img.shields.io/npm/v/abtest.svg?style=flat-square
[npm-url]: https://npmjs.org/package/abtest
[travis-image]: https://img.shields.io/travis/node-modules/abtest.svg?style=flat-square
[travis-url]: https://travis-ci.org/node-modules/abtest
[coveralls-image]: https://img.shields.io/coveralls/node-modules/abtest.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/node-modules/abtest?branch=master
[david-image]: https://img.shields.io/david/node-modules/abtest.svg?style=flat-square
[david-url]: https://david-dm.org/node-modules/abtest
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[gittip-image]: https://img.shields.io/gittip/dead-horse.svg?style=flat-square
[gittip-url]: https://www.gittip.com/dead-horse/

an A/B test client for node web

## Installation

```bash
$ npm install abtest
```

## Usage

use with koa:

```js
var ABTest = ABTest();
var app = koa();

app.use(function* (next) {
  this.abtest = ABTest({
    getCookie: function () {},  // custom your getCookie method
    setCookie: function () {},  // custom your setCookie method
    query: this.query
  });
});

app.use(function* (next) {
  this.abtest.configure({
    bucket: {
      a: 9,
      b: 1
    },
    enableQuery: true,
    enableCookie: true
  });
});

app.use(function* (next) {
  this.body = this.abtest.bucket; // 10% a, 90% b
});
```

### License

MIT
