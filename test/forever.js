import { expect } from 'chai';
import assert from 'assert';
import promiseful from '../src/';

describe('forever', () => {

  it('10 times', (done) => {
    const a = [];
    const ret = promiseful.forever(
      () => new Promise((resolve, reject) => {
          if (a.length >= 10) {
            reject();
            return;
          }
          a.push(a.length);
          setTimeout(() => resolve(), 50);
        }
      )
    );

    assert(ret !== null, 'Return is NOT null');
    expect(ret).to.be.a('Promise');
    ret.then(done)
    .catch(() => {
      expect(a.length).to.eql(10);
      done();
    });
  });

});
