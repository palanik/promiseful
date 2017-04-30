import { expect } from 'chai';
import assert from 'assert';
import promiseful from '../src/';

describe('whilst', () => {

  it('10 times', (done) => {
    const a = [];
    const ret = promiseful.whilst(
      (v) => v < 10,
      () => new Promise((resolve, reject) => {
          a.push(a.length);
          setTimeout(() => resolve(a.length), 50);
        }
      ),
      0
    );

    assert(ret !== null, 'Return is NOT null');
    expect(ret).to.be.a('Promise');
    ret.then((val) => {
      expect(val).to.eql(10);
      expect(a.length).to.eql(10);
      done();
    })
    .catch(done);
  });

  it('reject', (done) => {
    const a = [];
    const ret = promiseful.whilst(
      (v) => v < 10,
      () => new Promise((resolve, reject) => {
          a.push(a.length);
          if (a.length === 5) {
            reject(a.length);
          }
          setTimeout(() => resolve(a.length), 50);
        }
      ),
      0
    );

    assert(ret !== null, 'Return is NOT null');
    expect(ret).to.be.a('Promise');
    ret.then(done)
    .catch((val) => {
      expect(val).to.eql(5);
      expect(a.length).to.eql(5);
      done();
    });
  });

});
