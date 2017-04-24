import utils from '../utils/index';

class Promiseful {

  constructor(promise) {
    this.Promise = promise;
  }

  fulfil(val) {
    if (typeof val === 'function') {
      return val;
    }

    // Is this a Promise?
    if (typeof val === 'object'
      && val.then
      && typeof val.then === 'function') {
      return () => val;
    }

    // Anything else, wrap the value into a promise nd wrap into a function
    return () => this.Promise.resolve(val);
  }

  promise(...promise) {
    if (promise.length > 0) {
      this.Promise = promise[0];
    }

    return this.Promise;
  }

  promisify(fn) {
    const self = this;

    return (...args) => (
      new self.Promise((resolve, reject) => {
        args.push((err, ...result) => {
          if (err) {
            reject(err);
          } else if (result.length <= 1) {
            resolve(...result);
          } else {
            resolve(result);
          }
        });

        fn(...args);
      })
    );
  }

  all(funcs) {
    return this.Promise.all(
      utils.collection.arrayize(funcs)
        .map(a => this.fulfil(a))
        .map(a => a()),
    );
  }

  race(fns) {
    const funcs = utils.collection.arrayize(fns);
    if (funcs.length < 1) {
      return this.Promise.resolve(null);
    }

    return this.Promise.race(funcs.map(a => this.fulfil(a)).map(a => a()));
  }

  reduce(fns, reducer, inital) {
    const funcs = utils.collection.arrayize(fns);
    const self = this;

    return new this.Promise((resolve, reject) => {
      function next(idx, acc) {
        if (idx >= funcs.length) {
          resolve(acc);
          return;
        }

        const p = self.fulfil(funcs[idx]);
        reducer(acc, p, idx)
        .then(next.bind(this, idx + 1))
        .catch(reject);
      }

      next(0, inital);
    });
  }
}

const instance = new Promiseful((typeof Promise !== 'undefined') ? Promise : null);
export default instance;
