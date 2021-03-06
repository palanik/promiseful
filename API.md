promiseful API
==============

A **promiseful function** is a function that returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

e.g. :
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

### Core

* [`promiseful.parallel`](#promisefulparallelfns-or-promisefulallfns) aka  [`promiseful.all`](#promisefulparallelfns-or-promisefulallfns)
* [`promiseful.parallelLimit`](#promisefulparallellimitfns-limit)
* [`promiseful.series`](#promisefulseriesfns)
* [`promiseful.race`](#promisefulracefns)
* [`promiseful.relay`](#promisefulrelayfns)

_________________________________________________

### Collections
A set of functions for manipulating collections.

Invoking a collection function is a two step process. First apply promiseful to the collection, which returns an object. Then you can call any of the core functions on the returned object, depending on whether you want to run it in parallel, in series or race.

e.g. :
```JS
const p = promiseful.each(
  [1,2,3,4,5,6,7,8],
  (val) => new Promise((resolve, reject) => {
      setTimeout(() => resolve(val * 4), 50);
    }
  )
);

p.parallel()
.then((results) => {
  // The results array will be [4, 8, 12, 16, 20, 24, 28, 32]
});

// Or simply

promiseful.each(array, promisefulFunction)
  .parallelLimit(5)
  .then((res) => {
    // ...
  });
```

#### Data collections

* [`promiseful.each`](#promisefuleachcoll-fn)
* [`promiseful.eachOf`](#promisefuleachofobj-fn)
* [`promiseful.map`](#promisefulmapcoll-fn)
* [`promiseful.mapOf`](#promisefulmapofobj-fn)
* [`promiseful.filter`](#promisefulfiltercoll-fn)
* [`promiseful.groupBy`](#promisefulgroupbycoll-fn)
* [`promiseful.every`](#promisefuleverycoll-fn)
* [`promiseful.some`](#promisefulsomecoll-fn)

#### Function collections

* [`promiseful.applyEach`](#promisefulapplyeachfns-args)
* [`promiseful.applyEachOf`](#promisefulapplyeachofobj-args)
* [`promiseful.applyMap`](#promisefulapplymapfns-args)
* [`promiseful.applyMapOf`](#promisefulapplymapofobj-args)
* [`promiseful.times`](#promisefultimesn-fn)

_________________________________________________

### Loops

* [`promiseful.forever`](#promisefulforeverfn)
* [`promiseful.until`](#promisefuluntiltest-fn)
* [`promiseful.whilst`](#promisefulwhilsttest-fn)

_________________________________________________

### Other

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
  ]
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
  ]
);

pf.then((result) => {
  // The value of result will be 'three'
});
```

#### See also:
* [`promiseful.relay`](#promisefulrelayfns)
* [`promiseful.parallel`](#promisefulparallelfns-or-promisefulallfns)
* [Promise.race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)

_________________________________________________

### `promiseful.relay(fns)`

> Runs the functions in series, but stops after the first function resolves. Returns the result of the first function succeeds or an array of rejected reasons if all the functions reject.

#### Parameters
* `fns`
    > An array of **promiseful functions**

#### Example
```JS
const pf = promiseful.relay(
  [
    findSomethingInAFile,
    findSomethingElseInAFile,
    findAnotherOneInAFile
  ]
);

pf.then((result) => {
  // result will be the value of first function succeeds
})
.catch((errors) => {
  // Errors is an array of rejects
});
```

#### See also:
* [`promiseful.race`](#promisefulracefns)

_________________________________________________

### `promiseful.each(coll, fn)`
> Applies the function `fn` to each item in `coll`. Running mode depends on the associate function.

#### Parameters
* `coll`
    > A collection to iterate over.

* `fn`
    > A **promiseful function** to apply to each item in `coll`.

#### Example
```JS
// Delete file asyncronously
const promiseUnlink = (fname) => new Promise((resolve, reject) =>
  fs.unlink(fname, (err) =>
    (err) ? reject(err) : resolve('Ok')
  )
);

// Files to be deleted
promiseful.each(
  ['file1.txt', 'file2.txt', 'file3.txt'],
  promiseUnlink
)
.parallel() // Run parallel
.then(() => {
  // All files deleted
})
.catch((err) => {
  console.error("Error deleting files", err);
});
```

#### See also:
* [`promiseful.eachOf`](#promisefuleachofobj-fn)
* [`promiseful.map`](#promisefulmapcoll-fn)

_________________________________________________

### `promiseful.eachOf(obj, fn)`
> Similar to each, but works with objects. Applies the function `fn` to each value in `obj` passing the key as the second argument.

> Running mode depends on the associate function.

#### Parameters
* `obj`
    > An object to iterate over.

* `fn`
    > A **promiseful function** to apply to each value in `obj`.

#### Example
```JS
// Delete file asyncronously
const promiseUnlink = (fname, folder) => new Promise((resolve, reject) =>
  fs.unlink(folder + '/' + fname, (err) =>
    (err) ? reject(err) : resolve('Ok')
  )
);

// Files to be deleted
promiseful.eachOf(
  { dir1: 'file1.txt', dir2: 'file2.txt', dir3: 'file3.txt'},
  promiseUnlink
)
.series() // Run series
.then(() => {
  // All files deleted
})
.catch((err) => {
  console.error("Error deleting files", err);
});
```

#### See also:
* [`promiseful.each`](#promisefuleachcoll-fn)
* [`promiseful.mapOf`](#promisefulmapofobj-fn)

_________________________________________________

### `promiseful.map(coll, fn)`
> Produces a new collection of values by mapping each value in `coll` through the function `fn`.

> Running mode depends on the associate function.

#### Parameters
* `coll`
    > A collection to iterate over.

* `fn`
    > A **promiseful function** to map each item in `coll`.

#### Example
```JS
// fetch file stat asyncronously
const promiseStat = (fname) => new Promise((resolve, reject) =>
  fs.stat(fname, (err, stats) =>
    (err) ? reject(err) : resolve(stats)
  )
);

// Files to be processed
promiseful.map(
  ['file1.txt', 'file2.txt', 'file3.txt'],
  promiseStat
)
.parallel() // Run parallel
.then((stats) => {
  // Array of stats
})
.catch((err) => {
  console.error("Error getting stats", err);
});
```

#### See also:
* [`promiseful.each`](#promisefuleachcoll-fn)
* [`promiseful.mapOf`](#promisefulmapofobj-fn)

_________________________________________________

### `promiseful.mapOf(obj, fn)`
> Produces a new Object by mapping each value in `obj` through the function `fn`.

> Running mode depends on the associate function.

#### Parameters
* `obj`
    > An object to iterate over.

* `fn`
    > A **promiseful function** to map each value in `obj`.

#### Example
```JS
// fetch stat asyncronously
const promiseStat = (fname, folder) => new Promise((resolve, reject) =>
  fs.stat(folder + '/' + fname, (err, stats) =>
    (err) ? reject(err) : resolve(stats)
  )
);

// Files to be processed
promiseful.mapOf(
  {a:'file1.txt', b:'file2.txt', c:'file3.txt'},
  promiseStat
)
.series() // Run series
.then((stats) => {
  // Object with stats
})
.catch((err) => {
  console.error("Error getting stats", err);
});
```

#### See also:
* [`promiseful.map`](#promisefulmapcoll-fn)
* [`promiseful.eachOf`](#promisefuleachofobj-fn)

_________________________________________________

### `promiseful.filter(coll, fn)`
> Returns a new collection of values in `coll` which pass an promiseful truth test.

> Note: This method can be invoked as `parallel`, `parallelLimit` or `series` only.

#### Parameters
* `coll`
    > A collection to iterate over.

* `fn`
    > A truth test to apply to each item in `coll`. The **promiseful function** should resolve a boolean value.

#### Example
```JS
promiseful.filter(
  [1,2,3,4,5,6,7,8,9,10],
  (val) => new Promise((resolve, reject) => {
      setTimeout(() => resolve((val & 1) === 0), 50);
    }
  )
)
.parallel()
.then((evens) => {
  // evens is an array of even numbers - [2,4,6,8,10]
})
.catch((err) => {
  console.error("Error while filtering:", err);
});
```

#### See also:
* [`promiseful.groupBy`](#promisefulgroupbycoll-fn)

_________________________________________________

### `promiseful.groupBy(coll, fn)`
> Returns a new object of keys from the resolved value of `fn` with values corresponds to an array of items, from `coll`.

> Note: This method can be invoked as `parallel`, `parallelLimit` or `series` only.

#### Parameters
* `coll`
    > A collection to iterate over.

* `fn`
    > A **promiseful function** to apply to each item in `coll`. The **promiseful function** should resolve the key for the final object.

#### Example
```JS
const alpha = /^[a-z]$/i;
const num = /^[0-9]$/i;

promiseful.groupBy(
  ['P','2','0','m',':','$','3','f','u','1','🤞'],
  (val) => new Promise((resolve, reject) => {
      const grp = alpha.test(val) ? 'alpha' : ( num.test(val) ? 'num' : 'other');
      setTimeout(() => resolve((grp), 50);
    }
  )
)
.parallel()
.then((result) => {
  /*
   result should be:
    {
      alpha: ['P','m',f','u'],
      num: ['2','0','3','1'],
      other: [':','$','🤞']
    }
    */
})
.catch((err) => {
  console.error("Error while grouping:", err);
});
```

#### See also:
* [`promiseful.filter`](#promisefulfiltercoll-fn)

_________________________________________________

### `promiseful.every(coll, fn)`
> Returns true if every item in the `coll` satisfies the truth test.

> Note: This method can be invoked as `parallel`, `parallelLimit` or `series` only.

#### Parameters
* `coll`
    > A collection to iterate over.

* `fn`
    > A truth test to apply to each item in `coll`. The **promiseful function** should resolve a boolean value.

#### Example
```JS
// All even numbers?
promiseful.every(
  [2,4,6,8,10,12,14,16],
  (val) => new Promise((resolve, reject) => {
      setTimeout(() => resolve((val & 1) === 0), 50);
    }
  )
)
.parallel()
.then((allEven) => {
  // allEven is true
})
.catch((err) => {
  console.error("Error with every:", err);
});
```

#### See also:
* [`promiseful.some`](#promisefulsomecoll-fn)

_________________________________________________

### `promiseful.some(coll, fn)`
> Returns true if at least one item in the `coll` satisfies the truth test.

#### Parameters
* `coll`
    > A collection to iterate over.

* `fn`
    > A truth test to apply to the items in `coll`. The **promiseful function** should resolve a boolean value.

#### Example
```JS
// Some even numbers?
promiseful.some(
  [1,2,3,4,5,6,7,8],
  (val) => new Promise((resolve, reject) => {
      setTimeout(() => resolve((val & 1) === 0), 50);
    }
  )
)
.race()
.then((someEven) => {
  // someEven is true
})
.catch((err) => {
  console.error("Error with some:", err);
});
```

#### See also:
* [`promiseful.every`](#promisefuleverycoll-fn)

_________________________________________________

### `promiseful.applyEach(fns, ...args)`
> Applies the `args` to each function in the array.
> The functions are invoked in the manner as defined by the associated function.

#### Parameters
* `fns`
    > A collection of **promiseful functions**.

* `args`
    > zero or more arguments to pass to the **promiseful functions**.

#### Example
```JS

promiseful.applyEach(
  [addContent, renameFile, updateSchema],
  'plume'
)
.series() // Run series
.then(() => {
  // Finished operation
})
.catch((err) => {
  console.error("Error running series:", err);
});
```

#### See also:
* [`promiseful.each`](#promisefuleachcoll-fn)

_________________________________________________

### `promiseful.applyMap(fns, ...args)`
> Produces a new collection of values by applying the `args` to each function in the array.
> The functions are invoked in the manner as defined by the associated function.

#### Parameters
* `fns`
    > A collection of **promiseful functions**.

* `args`
    > zero or more arguments to pass to the **promiseful functions**.

#### Example
```JS

promiseful.applyMap(
  [searchSiteA, searchSiteB, SearchSiteC],
  'Robert Frost'
)
.parallel() // Run parallel
.then((results) => {
  // Array of search results
})
.catch((err) => {
  console.error("Error searching sites:", err);
});
```

#### See also:
* [`promiseful.map`](#promisefulmapobj-fn)

_________________________________________________

### `promiseful.applyEachOf(obj, ...args)`
> Similar to `applyEach`, but works with objects. Applies the `args` to each function in the object.
> The functions are invoked in the manner as defined by the associated function.

> Note: The order of the values is not guaranteed.

#### Parameters
* `obj`
    > An object where the values are **promiseful functions**.

* `args`
    > zero or more arguments to pass to the **promiseful functions**.

#### Example
```JS

promiseful.applyEachOf(
  {
    taskA: addContent,
    taskB: renameFile,
    taskC: updateSchema
  },
  'plume'
)
.parallel() // Run parallel
.then(() => {
  // Finished operation
})
.catch((err) => {
  console.error("Error running parallel:", err);
});
```

#### See also:
* [`promiseful.eachOf`](#promisefuleachofobj-fn)

_________________________________________________

### `promiseful.applyMapOf(obj, ...args)`
> Similar to `applyEachOf`, but works with objects. Produces a new Object of values by applying the `args` to each function.
> The functions are invoked in the manner as defined by the associated function.

> Note: The order of the values is not guaranteed.

#### Parameters
* `obj`
    > An object where the values are **promiseful functions**.

* `args`
    > zero or more arguments to pass to the **promiseful functions**.

#### Example
```JS

promiseful.applyMapOf(
  {
    google: searchGoogle,
    bing: searchBing,
    yahoo: SearchYahoo,
  }
  'Robert Frost poem'
)
.parallel() // Run parallel
.then((results) => {
  // search results as an object
  /*
   {
    google: [ google results ],
    bing: [ bing results ],
    yahoo: [ yahoo results ],
   }
   */
})
.catch((err) => {
  console.error("Error searching sites:", err);
});
```

#### See also:
* [`promiseful.map`](#promisefulmapobj-fn)

_________________________________________________

### `promiseful.times(n, fn)`
> Involes the function `fn`, `n` times.
> The function is invoked in the manner as defined by the associated function.

#### Parameters
* `n`
    > Count of times to run the function.

* `fn`
    > A **promiseful function**.

#### Example
```JS

// Ping 5 times
promiseful.times(5, pingFunction)
.race() // Race
.then((result) => {
  // ping result
})
.catch((err) => {
  console.error("Error pinging: ", err);
});
```
_________________________________________________

### `promiseful.forever(fn)`
> The **promiseful function** `fn` is called repeatedly until it rejects.

> Note: This method never resolves.

#### Parameters
* `fn`
    > A **promiseful function**.

#### Example
```JS
promiseful.forever(pingInstances)
.catch((err) => {
  console.error("Error while pinging:", err);
});
```

#### See also:
* [`promiseful.until`](#promisefuluntiltest-fn)
* [`promiseful.whilst`](#promisefulwhilsttest-fn)

_________________________________________________

### `promiseful.until(test, fn)`
> Repeatedly calls the function `fn` one or more times until the synchronous function `test` returns `true` or `fn` rejects.

#### Parameters
* `test`
    > A synchronous function that tests the truth value of the resolved value of the last execution of `fn`.

* `fn`
    > A **promiseful function**.

#### Example
```JS
// Get current location
const getCurrentLocation = () => new Promise((resolve, reject) =>
  gps.getLocation((err, location) =>
    (err) ? reject(err) : resolve(location)
  )
);


// Are we there, yet?
function checkLocation(location) {
  return (google.maps.geometry.spherical.computeDistanceBetween(location, myLocation) <= acceptableDistance);
}

promiseful.until(checkLocation, getCurrentLocation)
.then((location) => {
  // We are at location now.
})
.catch((err) => {
  console.error("Error getting location: ", err);
});
```
#### See also:
* [`promiseful.forever`](#promisefulforeverfn)
* [`promiseful.whilst`](#promisefulwhilsttest-fn)

_________________________________________________

### `promiseful.whilst(test, fn)`
> Repeatedly calls the function `fn` one or more times until the synchronous function `test` returns `false` or `fn` rejects.
> promiseful equivalent of JS [`do ... while`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/do...while) loop.

#### Parameters
* `test`
    > A synchronous function that tests the truth value of the resolved value of the last execution of `fn`.

* `fn`
    > A **promiseful function**.

#### Example
```JS
// Get current location
const getCurrentLocation = () => new Promise((resolve, reject) =>
  gps.getLocation((err, location) =>
    (err) ? reject(err) : resolve(location)
  )
);


// Am I far away from danger zone
function checkLocation(location) {
  return (google.maps.geometry.spherical.computeDistanceBetween(location, blastLocation) >= acceptableDistance);
}

promiseful.whilst(checkLocation, getCurrentLocation)
.then((location) => {
  // We are at location now.
})
.catch((err) => {
  console.error("Error getting location: ", err);
});
```
#### See also:
* [`promiseful.forever`](#promisefulforeverfn)
* [`promiseful.until`](#promisefuluntiltest-fn)

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
promiseful.waterfall(
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
