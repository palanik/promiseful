import assert from 'assert';
import { expect } from 'chai';
import collector from '../../src/api/functions/collector';

describe('chunk', () => {

    it('Even split', (done) => {
      const funcs = [];
      for (let i = 0; i < 20; i++) {
        const res = Math.random().toString(36).substring(2, 9);
        funcs.push(
          () => new Promise(
            (resolve, reject) => setTimeout(
              () => resolve(res),
              Math.round(1 + Math.random() * 50)
            )
          )
        );
      }

      const coll = new collector.Functions(funcs);

      const arr = Array.from(coll);

      if (typeof Symbol !== 'undefined') {
        expect(arr).to.have.lengthOf(20);
      }
      else {
        expect(arr).to.have.lengthOf(0);
      }
      done();
    });

});
