import promiseful from '../src/index';
import assert from 'assert';
import { expect } from 'chai';

describe('race', () => {

  describe('resolve', () => {

    it('three', (done) => {
      const ret = promiseful.race(
        [
          () => new Promise((resolve, reject) =>
            setTimeout(() => resolve('one'), 50)
          ),
          () => new Promise((resolve, reject) =>
            setTimeout(() => resolve('two'), 80)
          ),
          () => new Promise((resolve, reject) =>
            setTimeout(() => resolve('three'), 30)
          )
        ]
      );

      assert(ret !== null, 'Return is NOT null')
      ret.then((res) => {
        expect(res).to.eql('three');
        done();
      });
    });

    it('one', (done) => {
      const ret = promiseful.race(
        [
          () => new Promise((resolve, reject) =>
            setTimeout(() => resolve('one'), 50)
          )
        ]
      );

      assert(ret !== null, 'Return is NOT null')
      expect(ret).to.be.a('Promise');
      ret.then((res) => {
        expect(res).to.eql('one');
        done();
      });
    });

    it('zero', (done) => {
      const ret = promiseful.race([]);

      assert(ret !== null, 'Return is NOT null');
      ret.then((res) => {
        expect(res).to.eql(null);
        done();
      });
    });


  });

  describe('reject', () => {
    it('first of three', (done) => {
      const ret = promiseful.race(
        [
          () => new Promise((resolve, reject) =>
            setTimeout(() => reject('one'), 50)
          ),
          () => new Promise((resolve, reject) =>
            setTimeout(() => resolve('two'), 80)
          ),
          () => new Promise((resolve, reject) =>
            setTimeout(() => resolve('three'), 30)
          )
        ]
      );

      assert(ret !== null, 'Return is NOT null')
      ret
      .then((val) => {
        expect(val).to.eql('three');
        done();
      });
    });

    it('all three', (done) => {
      const ret = promiseful.race(
        [
          () => new Promise((resolve, reject) =>
            setTimeout(() => reject('one'), 50)
          ),
          () => new Promise((resolve, reject) =>
            setTimeout(() => reject('two'), 80)
          ),
          () => new Promise((resolve, reject) =>
            setTimeout(() => reject('three'), 30)
          )
        ]
      );

      assert(ret !== null, 'Return is NOT null')
      ret
      .catch((err) => {
        expect(err).to.eql('three');
        done();
      });
    });

  });

});
