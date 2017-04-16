import utils from './utils/index';

export default class Promiseful {

  static parallel(funcs) {
    return Promiseful.all(funcs);
  }

  static parallelLimit(funcs, limit) {
    if (limit <= funcs.length) {
      return Promiseful.parallel(funcs);
    }

    const funcsList = utils.collection.chunk(funcs, limit)
      .map(c => (() => Promiseful.parallel(c)));

    return Promiseful.series(funcsList)
      .then(utils.collection.flatten);
  }

  static all(funcs) {
    return Promise.all(funcs.map(a => utils.internal.fulfil(a)).map(a => a()));
  }

  static race(funcs) {
    if (funcs.length < 1) {
      return Promise.resolve(null);
    }

    return Promise.race(funcs.map(a => utils.internal.fulfil(a)).map(a => a()));
  }

  static series(funcs) {
    return new Promise((resolve, reject) => {
      function next(idx, acc) {
        if (idx >= funcs.length) {
          resolve(acc);
          return;
        }

        const p = utils.internal.fulfil(funcs[idx])();
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
