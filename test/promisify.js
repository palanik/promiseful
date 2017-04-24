import assert from 'assert';
import { expect } from 'chai';
import promiseful from '../src/';

describe('promisify', () => {

  describe('resolve', () => {

    it('one result', (done) => {
      const pfunc = promiseful.promisify(
        (val, cb) => setTimeout(() => cb(null, val * 3))
      );

      assert(pfunc !== null, 'Return is NOT null');
      const ret = pfunc(7);
      expect(ret).to.be.a('Promise');
      ret.then((res) => {
        expect(res).to.eql(21);
        done();
      })
      .catch(done);
    });

    it('multi results', (done) => {
      const pfunc = promiseful.promisify(
        (val, cb) => setTimeout(() => cb(null, val * 2, val * 3, val * 4))
      );

      assert(pfunc !== null, 'Return is NOT null');
      const ret = pfunc(7);
      expect(ret).to.be.a('Promise');
      ret.then((res) => {
        expect(res).to.eql([14, 21, 28]);
        done();
      })
      .catch(done);
    });

    it('zero results', (done) => {
      const pfunc = promiseful.promisify(
        (val, cb) => setTimeout(() => cb())
      );

      assert(pfunc !== null, 'Return is NOT null');
      const ret = pfunc(7);
      expect(ret).to.be.a('Promise');
      ret.then((res) => {
        expect(res).to.eql(undefined);
        done();
      })
      .catch(done);
    });

  });

  describe('reject', () => {
    it('error', (done) => {
      const pfunc = promiseful.promisify(
        (val, cb) => setTimeout(() => cb('erroring', val * 3))
      );

      assert(pfunc !== null, 'Return is NOT null');
      const ret = pfunc(7);
      expect(ret).to.be.a('Promise');
      ret
      .catch((err) => {
        expect(err).to.eql('erroring');
        done();
      });
    });

  });

});
