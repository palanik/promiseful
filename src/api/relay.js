import core from './core';

export default function relay(fns) {
  function reducer(acc, fn) {
    return new core.Promise((resolve, reject) => {
      fn()
      .then(resolve)
      .catch((reason) => {
        acc.push(reason);
        reject(acc);
      });
    });
  }

  return core.reduceRejects(fns, reducer, []);
}
