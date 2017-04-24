import assert from 'assert';
import { expect } from 'chai';
import promiseful from '../src/';

describe('parallel', () => {

  describe('resolve', () => {

    it('three', (done) => {
      const ret = promiseful.parallel(
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

      assert(ret !== null, 'Return is NOT null');
      ret.then((res) => {
        expect(res).to.eql(['one', 'two', 'three']);
        done();
      })
      .catch(done);
    });

    it('one', (done) => {
      const ret = promiseful.all(
        [
          () => new Promise((resolve, reject) =>
            setTimeout(() => resolve('one'), 50)
          )
        ]
      );

      assert(ret !== null, 'Return is NOT null');
      expect(ret).to.be.a('Promise');
      ret.then((res) => {
        expect(res).to.eql(['one']);
        done();
      })
      .catch(done);
    });

    it('zero', (done) => {
      const ret = promiseful.parallel([]);

      assert(ret !== null, 'Return is NOT null');
      ret.then((res) => {
        expect(res).to.eql([]);
        done();
      })
      .catch(done);
    });

    it('function, promise, value', (done) => {
      const ret = promiseful.every(
        [
          () => new Promise((resolve, reject) =>
            setTimeout(() => resolve('one'), 50)
          ),
          new Promise((resolve, reject) =>
            setTimeout(() => resolve('two'), 80)
          ),
          'three'
        ]
      );

      assert(ret !== null, 'Return is NOT null');
      ret.then((res) => {
        expect(res).to.eql(['one', 'two', 'three']);
        done();
      })
      .catch(done);
    });

  });

  describe('reject', () => {
    it('first of three', (done) => {
      const ret = promiseful.parallel(
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

      assert(ret !== null, 'Return is NOT null');
      ret
      .catch((err) => {
        expect(err).to.eql('one');
        done();
      });
    });

    it('all three', (done) => {
      const ret = promiseful.parallel(
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

      assert(ret !== null, 'Return is NOT null');
      ret
      .catch((err) => {
        expect(err).to.eql('three');
        done();
      });
    });

    it('function, promise, value', (done) => {
      const ret = promiseful.parallel(
        [
          () => new Promise((resolve, reject) =>
            setTimeout(() => reject('one'), 50)
          ),
          new Promise((resolve, reject) =>
            setTimeout(() => reject('two'), 80)
          ),
          'three'
        ]
      );

      assert(ret !== null, 'Return is NOT null');
      ret.catch((err) => {
        expect(err).to.eql('one');
        done();
      });
    });

  });

});
