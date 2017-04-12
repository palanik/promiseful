export default class Promiseful {
  static parallel(funcs) {
    return Promiseful.all(funcs);
  }

  static all(funcs) {
    return Promise.all(funcs.map(a => a()));
  }

  static race(funcs) {
    if (funcs.length < 1) {
      return Promise.resolve(null);
    }
    return Promise.race(funcs.map(a => a()));
  }

  static series(funcs) {
    return new Promise((resolve, reject) => {
      function next(idx, acc) {
        if (idx >= funcs.length) {
          return resolve(acc);
        }

        const p = funcs[idx]();
        return p.then(
          (val) => {
            acc.push(val);
            next(idx + 1, acc);
          },
          reject,
        );
      }

      next(0, []);
    });
  }
}

/*
console.log(
  Object.getOwnPropertyNames(Promiseful)
  .filter(prop => typeof Promiseful[prop] === "function")
);
*/
