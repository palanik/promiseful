/**
 * MIT License
 *
 * Copyright (c) 2017 palanik - https://github.com/palanik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.promiseful = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Collection = function () {
  function Collection() {
    classCallCheck(this, Collection);
  }

  createClass(Collection, null, [{
    key: "arrayize",
    value: function arrayize(coll) {
      return Array.isArray(coll) ? coll : Array.from(coll);
    }
  }, {
    key: "chunk",
    value: function chunk(coll, n) {
      var array = Collection.arrayize(coll);
      if (n <= 0 || n >= array.length) {
        return [array];
      }

      var ret = [];
      for (var i = 0; i < array.length; i += n) {
        ret.push(array.slice(i, i + n));
      }

      return ret;
    }
  }, {
    key: "flatten",
    value: function flatten(arrays) {
      var _ref;

      return (_ref = []).concat.apply(_ref, toConsumableArray(arrays));
    }
  }]);
  return Collection;
}();

var utils = {
  collection: Collection
};

var Promiseful$1 = function () {
  function Promiseful(promise) {
    classCallCheck(this, Promiseful);

    this.Promise = promise;
  }

  createClass(Promiseful, [{
    key: 'fulfil',
    value: function fulfil(val) {
      var _this = this;

      if (typeof val === 'function') {
        return val;
      }

      // Is this a Promise?
      if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val.then && typeof val.then === 'function') {
        return function () {
          return val;
        };
      }

      // Anything else, wrap the value into a promise nd wrap into a function
      return function () {
        return _this.Promise.resolve(val);
      };
    }
  }, {
    key: 'promise',
    value: function promise() {
      if (arguments.length > 0) {
        this.Promise = arguments.length <= 0 ? undefined : arguments[0];
      }

      return this.Promise;
    }
  }, {
    key: 'promisify',
    value: function promisify(fn) {
      var self = this;

      return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return new self.Promise(function (resolve, reject) {
          args.push(function (err) {
            for (var _len2 = arguments.length, result = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              result[_key2 - 1] = arguments[_key2];
            }

            if (err) {
              reject(err);
            } else if (result.length <= 1) {
              resolve.apply(undefined, result);
            } else {
              resolve(result);
            }
          });

          fn.apply(undefined, args);
        });
      };
    }
  }, {
    key: 'all',
    value: function all(funcs) {
      var _this2 = this;

      return this.Promise.all(utils.collection.arrayize(funcs).map(function (a) {
        return _this2.fulfil(a);
      }).map(function (a) {
        return a();
      }));
    }
  }, {
    key: 'race',
    value: function race(fns) {
      var _this3 = this;

      var funcs = utils.collection.arrayize(fns);
      if (funcs.length < 1) {
        return this.Promise.resolve(null);
      }

      return this.Promise.race(funcs.map(function (a) {
        return _this3.fulfil(a);
      }).map(function (a) {
        return a();
      }));
    }
  }, {
    key: 'reduce',
    value: function reduce(fns, reducer, inital) {
      var funcs = utils.collection.arrayize(fns);
      var self = this;

      return new this.Promise(function (resolve, reject) {
        function next(idx, acc) {
          if (idx >= funcs.length) {
            resolve(acc);
            return;
          }

          var p = self.fulfil(funcs[idx]);
          reducer(acc, p, idx).then(next.bind(this, idx + 1)).catch(reject);
        }

        next(0, inital);
      });
    }
  }, {
    key: 'reduceRejects',
    value: function reduceRejects(fns, reducer, inital) {
      var funcs = utils.collection.arrayize(fns);
      var self = this;

      return new this.Promise(function (resolve, reject) {
        function next(idx, acc) {
          if (idx >= funcs.length) {
            reject(acc);
            return;
          }

          var p = self.fulfil(funcs[idx]);
          reducer(acc, p, idx).then(resolve).catch(next.bind(this, idx + 1));
        }

        next(0, inital);
      });
    }
  }, {
    key: 'loop',
    value: function loop(fn, breaker) {
      for (var _len3 = arguments.length, initValue = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        initValue[_key3 - 2] = arguments[_key3];
      }

      var func = this.fulfil(fn);

      return new this.Promise(function (resolve, reject) {
        function next() {
          func().then(function (v) {
            if (breaker(v)) {
              resolve(v);
            } else {
              next();
            }
          }).catch(reject);
        }

        if (initValue.length > 0 && breaker.apply(undefined, initValue)) {
          resolve.apply(undefined, initValue);
          return;
        }

        next();
      });
    }
  }]);
  return Promiseful;
}();

var instance = new Promiseful$1(typeof Promise !== 'undefined' ? Promise : null);

function series(fns) {
  function reducer(acc, fn) {
    return new instance.Promise(function (resolve, reject) {
      fn().then(function (val) {
        acc.push(val);
        resolve(acc);
      }).catch(reject);
    });
  }

  return instance.reduce(fns, reducer, []);
}

function parallelLimit(fns) {
  var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var funcs = utils.collection.arrayize(fns);
  if (limit <= 0 || limit >= funcs.length) {
    return instance.all(funcs);
  }

  var funcsList = utils.collection.chunk(funcs, limit).map(function (c) {
    return function () {
      return instance.all(c);
    };
  });

  return series(funcsList).then(utils.collection.flatten);
}

function waterfall(fns, initVal) {
  function reducer(acc, fn) {
    return new instance.Promise(function (resolve, reject) {
      fn(acc).then(resolve).catch(reject);
    });
  }

  return instance.reduce(fns, reducer, initVal);
}

function forver(fn) {
  return instance.loop(fn, function () {
    return false;
  });
}

function until(test, fn) {
  for (var _len = arguments.length, initValue = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    initValue[_key - 2] = arguments[_key];
  }

  return instance.loop.apply(instance, [fn, function (v) {
    return test(v);
  }].concat(initValue));
}

function whilst(test, fn) {
  for (var _len = arguments.length, initValue = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    initValue[_key - 2] = arguments[_key];
  }

  return instance.loop.apply(instance, [fn, function (v) {
    return !test(v);
  }].concat(initValue));
}

function relay(fns) {
  function reducer(acc, fn) {
    return new instance.Promise(function (resolve, reject) {
      fn().then(resolve).catch(function (reason) {
        acc.push(reason);
        reject(acc);
      });
    });
  }

  return instance.reduceRejects(fns, reducer, []);
}

var Kernel = {

  // core
  all: instance.all.bind(instance),
  race: instance.race.bind(instance),

  // other
  series: series,
  parallel: instance.all.bind(instance),
  parallelLimit: parallelLimit,
  relay: relay
};

var Functions = function () {
  function Functions(coll) {
    classCallCheck(this, Functions);

    this.coll = coll;
  }

  createClass(Functions, [{
    key: 'attachMethod',
    value: function attachMethod(name, fn) {
      for (var _len = arguments.length, thens = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        thens[_key - 2] = arguments[_key];
      }

      var _this = this;

      // this[name] = fn.bind(null, this.coll);
      this[name] = function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var m = fn.apply(undefined, [_this.coll].concat(args));
        return thens.reduce(function (acc, t) {
          return acc.then(t);
        }, m);
      };

      return this;
    }
  }, {
    key: 'attachKernel',
    value: function attachKernel() {
      var _this2 = this;

      for (var _len3 = arguments.length, thens = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        thens[_key3] = arguments[_key3];
      }

      Object.keys(Kernel).forEach(function (f) {
        return _this2.attachMethod.apply(_this2, [f, Kernel[f]].concat(thens));
      });
      return this;
    }
  }]);
  return Functions;
}();

if (typeof Symbol !== 'undefined') {
  Functions.prototype[Symbol.iterator] = function SymbolIterator() {
    var idx = 0;
    var coll = this.coll;
    return {
      next: function next() {
        if (idx >= coll.length) {
          return {
            done: true
          };
        }
        var value = coll[idx];
        idx += 1;

        return {
          done: idx > coll.length,
          value: value
        };
      }
    };
  };
}

var collector = {
  Functions: Functions
};

function applyMap(fns) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var funcs = utils.collection.arrayize(fns).map(function (f) {
    return f.bind.apply(f, [null].concat(args));
  });

  var coll = new collector.Functions(funcs);
  return coll.attachKernel(function () {
    return undefined;
  });
}

function applyEachOf(data) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var keys = Object.keys(data);
  var funcs = keys.map(function (d) {
    var _data$d;

    return (_data$d = data[d]).bind.apply(_data$d, [null].concat(args));
  });

  var coll = new collector.Functions(funcs);
  return coll.attachKernel(function () {
    return undefined;
  });
}

function applyMap$1(fns) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var funcs = utils.collection.arrayize(fns).map(function (f) {
    return f.bind.apply(f, [null].concat(args));
  });

  var coll = new collector.Functions(funcs);
  return coll.attachKernel();
}

function applyMapOf(data) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var keys = Object.keys(data);
  var funcs = keys.map(function (d) {
    var _data$d;

    return (_data$d = data[d]).bind.apply(_data$d, [null].concat(args));
  });

  var coll = new collector.Functions(funcs);
  return coll.attachKernel(function (vals) {
    return keys.reduce(function (acc, key, idx) {
      acc[key] = vals[idx];
      return acc;
    }, {});
  });
}

function times(n, fn) {
  var funcs = [];
  for (var i = 0; i < n; i += 1) {
    funcs.push(fn.bind(null, i));
  }

  var coll = new collector.Functions(funcs);
  return coll.attachKernel();
}

function each(data, fn) {
  var funcs = utils.collection.arrayize(data).map(function (d) {
    return fn.bind(null, d);
  });

  var coll = new collector.Functions(funcs);
  return coll.attachKernel(function () {
    return undefined;
  });
}

function eachOf(data, fn) {
  var funcs = Object.keys(data).map(function (d) {
    return fn.bind(null, data[d], d);
  });

  var coll = new collector.Functions(funcs);
  return coll.attachKernel(function () {
    return undefined;
  });
}

function map(data, fn) {
  var funcs = utils.collection.arrayize(data).map(function (d) {
    return fn.bind(null, d);
  });

  var coll = new collector.Functions(funcs);
  return coll.attachKernel();
}

function mapOf(data, fn) {
  var keys = Object.keys(data);
  var funcs = keys.map(function (d) {
    return fn.bind(null, data[d], d);
  });

  var coll = new collector.Functions(funcs);
  return coll.attachKernel(function (vals) {
    return keys.reduce(function (acc, key, idx) {
      acc[key] = vals[idx];
      return acc;
    }, {});
  });
}

function filter(data, fn) {
  var arrData = utils.collection.arrayize(data);
  var funcs = arrData.map(function (d) {
    return fn.bind(null, d);
  });

  var coll = new collector.Functions(funcs);
  return coll.attachKernel(function (vals) {
    return vals.reduce(function (acc, val, idx) {
      if (val) {
        acc.push(arrData[idx]);
      }
      return acc;
    }, []);
  });
}

function groupBy(data, fn) {
  var arrData = utils.collection.arrayize(data);
  var funcs = arrData.map(function (d) {
    return fn.bind(null, d);
  });

  var coll = new collector.Functions(funcs);
  return coll.attachKernel(function (vals) {
    return vals.reduce(function (acc, val, idx) {
      if (!(val in acc)) {
        acc[val] = [];
      }
      acc[val].push(arrData[idx]);
      return acc;
    }, {});
  });
}

function every(data, fn) {
  var arrData = utils.collection.arrayize(data);
  var funcs = arrData.map(function (d) {
    return fn.bind(null, d);
  });

  var coll = new collector.Functions(funcs);
  return coll.attachKernel(function (vals) {
    return vals.every(function (e) {
      return e;
    });
  });
}

function conditionalRace(fns, test) {
  var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var funcs = utils.collection.arrayize(fns);

  return new instance.Promise(function (resolve, reject) {
    var len = funcs.length;
    var passed = 0;
    var done = false;

    function fulfilled(val) {
      len -= 1;
      if (done) {
        return; // Resolved/Rejected already
      }

      if (test(val)) {
        passed += 1;
        if (passed === min) {
          done = true;
          resolve(val);
          return;
        }
      }

      if (len === 0) {
        // < min passed
        done = true;
        resolve(false);
      }
    }

    function rejected(reason) {
      len -= 1;
      if (done) {
        return; // Resolved/Rejected already
      }

      done = true;
      reject(reason);
    }

    // Call all functions individually and simultaneously
    funcs.forEach(function (fn) {
      return fn().then(fulfilled, rejected);
    });
  });
}

function some(data, fn) {
  var arrData = utils.collection.arrayize(data);
  var funcs = arrData.map(function (d) {
    return fn.bind(null, d);
  });

  var coll = new collector.Functions(funcs);
  return coll.attachKernel(function (vals) {
    return vals.some(function (e) {
      return e;
    });
  }).attachMethod('race', function (fns) {
    return conditionalRace(fns, function (b) {
      return b;
    });
  });
}

var Promiseful = {

  // core
  promisify: instance.promisify.bind(instance),
  all: instance.all.bind(instance),
  race: instance.race.bind(instance),
  reduce: instance.reduce.bind(instance),

  // other
  series: series,
  parallel: instance.all.bind(instance),
  parallelLimit: parallelLimit,
  relay: relay,
  waterfall: waterfall,

  // aliases
  inject: instance.reduce.bind(instance),
  fold: instance.reduce.bind(instance),
  tryEach: relay,

  // Collections
  each: each,
  eachOf: eachOf,
  map: map,
  mapOf: mapOf,
  filter: filter,
  groupBy: groupBy,
  every: every,
  some: some,

  // Collection - aliases
  mapValues: mapOf,

  // Functions
  applyEach: applyMap,
  applyEachOf: applyEachOf,
  applyMap: applyMap$1,
  applyMapOf: applyMapOf,
  times: times,

  // Loops
  forever: forver,
  until: until,
  whilst: whilst
};

Promiseful.promise = function (P) {
  if (P) {
    instance.promise(P);
    return Promiseful;
  }

  return instance.promise();
};



// export {
//     core.promise as promise,
//     core.all as all,
//     core.race as race,
//     core.reduce as reduce,
//     core.parallelLimit as parallelLimit,
//
//     series as series,
//     parallel as parallel,
//     waterfall as waterfall,
//
//     all as every,
//     reduce as inject,
//     reduce as foldl
// };

return Promiseful;

})));
