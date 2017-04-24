# promiseful
Useful patterns with Promise functions

[![NPM version](https://img.shields.io/npm/v/promiseful.svg?style=flat)](https://www.npmjs.org/package/promiseful)
[![Build Status](https://img.shields.io/travis/palanik/promiseful.svg?style=flat)](https://travis-ci.org/palanik/promiseful)
[![Known Vulnerabilities](https://snyk.io/test/github/palanik/promiseful/badge.svg)](https://snyk.io/test/github/palanik/promiseful)

## Installation

```sh
$ npm install promiseful --save
```

To use in the browser, download the library from [dist](dist) folder.

## Usage

### node.js
promiseful uses native ES2015 [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

To use non-native, 3rd-party `Promise` libraries, like [bluebird](http://bluebirdjs.com/) or [Promise polyfill](https://github.com/jakearchibald/es6-promise/), call `promiseful.promise()` with the `Promise` object, before using the API.

e.g.:
```JS
var Promise = require('bluebird');
// var Promise = require('es6-promise');
// var Promise = require('pinkie-promise');

var promiseful = require('promiseful');

promiseful.promise(Promise);
```

See [example](examples/node.js/es5/server-time.js)

### Browser
promiseful uses native ES2015 [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

To use non-native, 3rd-party `Promise` libraries, like [bluebird](http://bluebirdjs.com/) or [Promise polyfill](https://github.com/jakearchibald/es6-promise/), include the library, before including promiseful.

e.g.:
```HTML
<script src="https://cdn.jsdelivr.net/bluebird/latest/bluebird.min.js"></script>
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/es6-promise/4.1.0/es6-promise.min.js"></script> -->
<script src="promiseful.js"></script>
```

See [example](examples/browsers/bluebird.html)


## API

A **promiseful function** is a function that returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

e.g.:
```JS
function readPasswd() {
  return new Promise((resolve, reject) => {
    fs.readFile('/etc/passwd', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
```

The API works with **promiseful functions**. Do not pass **Promise** objects.

Methods follow pattern, similar to the excellent [caolan/async](https://github.com/caolan/async) library.

### API Documentation

  [API](API.md)

## Examples

### Node.js
1. [server-time](examples/node.js/server-time.js)
2. [es5](examples/node.js/es5/server-time.js)

### Browser
1. [fetch-image-dimension](examples/browser/fetch-image-dimension.html)
2. [bluebird](examples/browser/bluebird.html)

## License

  [MIT](LICENSE)
