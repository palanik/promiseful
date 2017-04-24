import core from './core';

export default function waterfall(fns, initVal) {
  function reducer(acc, fn) {
    return new core.Promise((resolve, reject) => {
      fn(acc)
      .then(resolve)
      .catch(reject);
    });
  }

  return core.reduce(fns, reducer, initVal);
}
