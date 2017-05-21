import core from './core';
import utils from '../utils/index';

export default function conditionalRace(fns, test, min = 1) {
  const funcs = utils.collection.arrayize(fns);

  return new core.Promise((resolve, reject) => {
    let len = funcs.length;
    let passed = 0;
    let done = false;

    function fulfilled(val) {
      len -= 1;
      if (done) {
        return;   // Resolved/Rejected already
      }

      if (test(val)) {
        passed += 1;
        if (passed === min) {
          done = true;
          resolve(val);
          return;
        }
      }

      if (len === 0) {
        // < min passed
        done = true;
        resolve(false);
      }
    }

    function rejected(reason) {
      len -= 1;
      if (done) {
        return;   // Resolved/Rejected already
      }

      done = true;
      reject(reason);
    }

    // Call all functions individually and simultaneously
    funcs.forEach(fn => fn().then(fulfilled, rejected));
  });
}
