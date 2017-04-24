import assert from 'assert';
import { expect } from 'chai';
import promiseful from '../src/';

describe('promise', () => {

  it('default', (done) => {
    const P = promiseful.promise();
    expect(P).to.eql(Promise);
    done();
  });

  it('set', (done) => {
    promiseful.promise(Promise);
    const P = promiseful.promise();
    expect(P).to.eql(Promise);
    done();
  });

});
