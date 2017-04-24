promiseful
==========

# API

A **promiseful function** is a function that returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

e.g.:
```JS
function readPasswds() {
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

## Methods

* [`promiseful.parallel`](#promisefulparallelfns-or-promisefulallfns)
* [`promiseful.all`](#promisefulparallelfns-or-promisefulallfns)
* [`promiseful.parallelLimit`](#promisefulparallellimitfns-limit)
* [`promiseful.series`](#promisefulseriesfns)
* [`promiseful.race`](#promisefulracefns)
* [`promiseful.waterfall`](#promisefulwaterfallfns-initialvalue)

_________________________________________________

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

_________________________________________________

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

_________________________________________________

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

_________________________________________________

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

_________________________________________________

### `promiseful.waterfall(fns, [initialValue])`
> Runs the array of functions in series, each passing their results to the next in the array, finally returning a Promise with resolved value of the last function. However, if any of the functions rejects, waterfall rejects with the reason of the function that rejects.

#### Parameters
* `fns`
    > An array of **promiseful functions**

* `intialValue` (*optional*)
    > The value to be passed to the first function

#### Example
```JS
const pf = promiseful.waterfall(
  [
    (val) => new Promise((resolve, reject) =>
      setTimeout(() => resolve(val * 2), 50)
    ),
    (val) => new Promise((resolve, reject) =>
      setTimeout(() => resolve(val + 3), 80)
    ),
    (val) => new Promise((resolve, reject) =>
      setTimeout(() => resolve(val * 10), 30)
    )
  ],
  7
);

pf.then((result) => {
  // (((7 * 2) + 3) * 10) = 170
  // Result will be 170
});
```

#### See also:
* [`promiseful.series`](#promisefulseriesfns)
