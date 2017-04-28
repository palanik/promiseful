import kernel from '../kernel';

class Functions {
  constructor(coll) {
    this.coll = coll;
  }


  attachMethod(name, fn) {
    this[name] = fn.bind(null, this.coll);
    return this;
  }

  attachKernel() {
    Object.keys(kernel)
      .forEach(f => this.attachMethod(f, kernel[f]));
    return this;
  }
}

if (typeof Symbol !== 'undefined') {
  Functions.prototype[Symbol.iterator] = function SymbolIterator() {
    let idx = 0;
    const coll = this.coll;
    return {
      next() {
        if (idx >= coll.length) {
          return {
            done: true,
          };
        }
        const value = coll[idx];
        idx += 1;

        return {
          done: idx > coll.length,
          value,
        };
      },
    };
  };
}

const collector = {
  Functions,
};


export default collector;
