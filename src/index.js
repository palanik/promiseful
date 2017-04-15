function chunk(array, n) {
  if (n <= array.length) {
    return [array];
  }

  const ret = [];
  for (let i = 0; i < array.length; i += n) {
    ret.push(array.slice(i, i + n));
  }

  return ret;
}

function flatten(arrays) {
  return [].concat(...arrays);
}

class Promiseful {
  static fulfil(val) {
    if (typeof val === 'function') {
      return val;
    }

    // Is this a Promise?
    if (typeof val === 'object'
      && val.then
      && typeof val.then === 'function') {
      return () => val;
    }

    // Anything else, wrap into a promise into a function
    return () => Promise.resolve(val);
  }

  static parallel(funcs) {
    return Promiseful.all(funcs);
  }

  static parallelLimit(funcs, limit) {
    if (limit <= funcs.length) {
      return Promiseful.parallel(funcs);
    }

    const funcsList = chunk(funcs, limit)
      .map(c => (() => Promiseful.parallel(c)));

    return Promiseful.series(funcsList)
      .then(flatten);
  }

  static all(funcs) {
    return Promise.all(funcs.map(a => Promiseful.fulfil(a)).map(a => a()));
  }

  static race(funcs) {
    if (funcs.length < 1) {
      return Promise.resolve(null);
    }
    
    return Promise.race(funcs.map(a => Promiseful.fulfil(a)).map(a => a()));
  }

  static series(funcs) {
    return new Promise((resolve, reject) => {
      function next(idx, acc) {
        if (idx >= funcs.length) {
          resolve(acc);
          return;
        }

        const p = Promiseful.fulfil(funcs[idx])();
        p.then(
          (val) => {
            acc.push(val);
            next(idx + 1, acc);
          }                     // eslint-disable-line comma-dangle
        )
        .catch(reject);
      }

      next(0, []);
    });
  }
}

export default Promiseful;
module.exports = Promiseful;

/*
console.log(
  Object.getOwnPropertyNames(Promiseful)
  .filter(prop => typeof Promiseful[prop] === "function")
);
*/
