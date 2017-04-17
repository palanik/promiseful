import Promiseful from '../promiseful';

export default class internal {
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
    return () => Promiseful.Promise.resolve(val);
  }
}
