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

function parallelLimit(fns, limit) {
  var funcs = utils.collection.arrayize(fns);
  if (limit <= funcs.length) {
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
  waterfall: waterfall,

  // aliases
  every: instance.all.bind(instance),
  inject: instance.reduce.bind(instance),
  fold: instance.reduce.bind(instance)
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
