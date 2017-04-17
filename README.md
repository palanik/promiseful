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

## API

A **promiseful function** is a function that returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

e.g.
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

* [`promiseful.parallel`](#promisefulparallelfns-or-promisefulallfns)
* [`promiseful.all`](#promisefulparallelfns-or-promisefulallfns)
* [`promiseful.parallelLimit`](#promisefulparallellimitfns-limit)
* [`promiseful.series`](#promisefulseriesfns)
* [`promiseful.race`](#promisefulracefns)


### `promiseful.parallel(fns)` or `promiseful.all(fns)`
> Returns a single Promise that resolves when all of the promises in the functions have resolved, or rejects with the reason of the first function that rejects.

#### Parameters
* `fns`
    > An array of **promiseful functions**

#### Example
```JS
const pf = promiseful.parallel(
  [
    () => new Promise((resolve, reject) =>
      setTimeout(() => resolve('one'), 50)
    ),
    () => new Promise((resolve, reject) =>
      setTimeout(() => resolve('two'), 80)
    ),
    () => new Promise((resolve, reject) =>
      setTimeout(() => resolve('three'), 30)
    )
  ]
);

pf.then((results) => {
  // The results array will be ['one', 'two', 'three']
});
```

#### See also:
* [`promiseful.parallelLimit`](#promisefulparallellimitfns-limit)
* [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
* [`promiseful.series`](#promisefulseriesfns)


### `promiseful.parallelLimit(fns, limit)`

> Same as `promiseful.parallel`, but invokes a maximum of `limit` functions at a time.

#### Parameters
* `fns`
    > An array of **promiseful functions**

* `limit`
    > Maximum number of **promiseful functions** to invoke at a time

#### Example
```JS
const pf = promiseful.parallelLimit(
  [
    () => new Promise((resolve, reject) =>
      setTimeout(() => resolve('one'), 50)
    ),
    () => new Promise((resolve, reject) =>
      setTimeout(() => resolve('two'), 80)
    ),
    () => new Promise((resolve, reject) =>
      setTimeout(() => resolve('three'), 30)
    ),
    () => new Promise((resolve, reject) =>
      setTimeout(() => resolve('four'), 70)
    ),
    () => new Promise((resolve, reject) =>
      setTimeout(() => resolve('five'), 40)
    )
  ],
  2
);

pf.then((results) => {
  // The results array will be ['one', 'two', 'three', 'four', 'five']
});
```

#### See also:
* [`promiseful.parallel`](#promisefulparallelfns-or-promisefulallfns)
* [`promiseful.series`](#promisefulseriesfns)


### `promiseful.series(fns)`

> Runs each of the **promiseful functions**,  running once the previous function has completed.

> Returns a single Promise that resolves when all of the promises in the functions have resolved, or rejects with the reason of the first function that rejects.

#### Parameters
* `fns`
    > An array of **promiseful functions**

#### Example
```JS
const pf = promiseful.series(
  [
    () => new Promise((resolve, reject) =>
      setTimeout(() => resolve('one'), 50)
    ),
    () => new Promise((resolve, reject) =>
      setTimeout(() => resolve('two'), 80)
    ),
    () => new Promise((resolve, reject) =>
      setTimeout(() => resolve('three'), 30)
    )
  ],
  2
);

pf.then((results) => {
  // The results array will be ['one', 'two', 'three']
});
```

#### See also:
* [`promiseful.parallel`](#promisefulparallelfns-or-promisefulallfns)


### `promiseful.race(fns)`

> Runs the functions in parallel. Returns immediately once any of the function resolves or rejects. It's equivalent to Promise.race().

#### Parameters
* `fns`
    > An array of **promiseful functions**

#### Example
```JS
const pf = promiseful.race(
  [
    () => new Promise((resolve, reject) =>
      setTimeout(() => resolve('one'), 50)
    ),
    () => new Promise((resolve, reject) =>
      setTimeout(() => resolve('two'), 80)
    ),
    () => new Promise((resolve, reject) =>
      setTimeout(() => resolve('three'), 30)
    )
  ],
  2
);

pf.then((result) => {
  // The value of result will be 'three'
});
```

#### See also:
* [`promiseful.parallel`](#promisefulparallelfns-or-promisefulallfns)
* [Promise.race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)

## Examples

### Node.js
1. [server-time](examples/node.js/server-time.js)

### Browser
1. [fetch-image-dimension](examples/browser/fetch-image-dimension.html)

## License

  [MIT](LICENSE)
