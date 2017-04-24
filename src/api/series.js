import core from './core';

export default function series(fns) {
  function reducer(acc, fn) {
    return new core.Promise((resolve, reject) => {
      fn()
      .then((val) => {
        acc.push(val);
        resolve(acc);
      })
      .catch(reject);
    });
  }

  return core.reduce(fns, reducer, []);
}
