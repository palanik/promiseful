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
    key: "chunk",
    value: function chunk(array, n) {
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

var internal = function () {
  function internal() {
    classCallCheck(this, internal);
  }

  createClass(internal, null, [{
    key: 'fulfil',
    value: function fulfil(val) {
      if (typeof val === 'function') {
        return val;
      }

      // Is this a Promise?
      if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val.then && typeof val.then === 'function') {
        return function () {
          return val;
        };
      }

      // Anything else, wrap into a promise into a function
      return function () {
        return Promise.resolve(val);
      };
    }
  }]);
  return internal;
}();

var utils = {
  collection: Collection,
  internal: internal
};

var Promiseful = function () {
  function Promiseful() {
    classCallCheck(this, Promiseful);
  }

  createClass(Promiseful, null, [{
    key: 'parallel',
    value: function parallel(funcs) {
      return Promiseful.all(funcs);
    }
  }, {
    key: 'parallelLimit',
    value: function parallelLimit(funcs, limit) {
      if (limit <= funcs.length) {
        return Promiseful.parallel(funcs);
      }

      var funcsList = utils.collection.chunk(funcs, limit).map(function (c) {
        return function () {
          return Promiseful.parallel(c);
        };
      });

      return Promiseful.series(funcsList).then(utils.collection.flatten);
    }
  }, {
    key: 'all',
    value: function all(funcs) {
      return Promise.all(funcs.map(function (a) {
        return utils.internal.fulfil(a);
      }).map(function (a) {
        return a();
      }));
    }
  }, {
    key: 'race',
    value: function race(funcs) {
      if (funcs.length < 1) {
        return Promise.resolve(null);
      }

      return Promise.race(funcs.map(function (a) {
        return utils.internal.fulfil(a);
      }).map(function (a) {
        return a();
      }));
    }
  }, {
    key: 'series',
    value: function series(funcs) {
      return new Promise(function (resolve, reject) {
        function next(idx, acc) {
          if (idx >= funcs.length) {
            resolve(acc);
            return;
          }

          var p = utils.internal.fulfil(funcs[idx])();
          p.then(function (val) {
            acc.push(val);
            next(idx + 1, acc);
          } // eslint-disable-line comma-dangle
          ).catch(reject);
        }

        next(0, []);
      });
    }
  }]);
  return Promiseful;
}();

return Promiseful;

})));
