import assert from 'assert';
import { expect } from 'chai';
import promiseful from '../src/';

describe('ArrayLike', () => {

  describe('Set', () => {

    it('Parallel', (done) => {
      const s = new Set();
      s.add(() => new Promise((resolve, reject) =>
        setTimeout(() => resolve('one'), 50)
      ));
      s.add(() => new Promise((resolve, reject) =>
        setTimeout(() => resolve('two'), 80)
      ));
      s.add(() => new Promise((resolve, reject) =>
        setTimeout(() => resolve('three'), 30)
      ));

      const ret = promiseful.parallel(s);

      assert(ret !== null, 'Return is NOT null');
      ret.then((res) => {
        expect(res).to.eql(['one', 'two', 'three']);
        done();
      })
      .catch(done);
    });

    it('ParallelLimit', (done) => {
      const s = new Set();
      s.add(() => new Promise((resolve, reject) =>
        setTimeout(() => resolve('one'), 50)
      ));
      s.add(() => new Promise((resolve, reject) =>
        setTimeout(() => resolve('two'), 80)
      ));
      s.add(() => new Promise((resolve, reject) =>
        setTimeout(() => resolve('three'), 30)
      ));

      const ret = promiseful.parallelLimit(s, 2);

      assert(ret !== null, 'Return is NOT null');
      ret.then((res) => {
        expect(res).to.eql(['one', 'two', 'three']);
        done();
      })
      .catch(done);
    });

    it('Series', (done) => {
      const s = new Set();
      s.add(() => new Promise((resolve, reject) =>
        setTimeout(() => resolve('one'), 50)
      ));
      s.add(() => new Promise((resolve, reject) =>
        setTimeout(() => resolve('two'), 80)
      ));
      s.add(() => new Promise((resolve, reject) =>
        setTimeout(() => resolve('three'), 30)
      ));

      const ret = promiseful.series(s);

      assert(ret !== null, 'Return is NOT null');
      ret.then((res) => {
        expect(res).to.eql(['one', 'two', 'three']);
        done();
      })
      .catch(done);
    });

    it('Race', (done) => {
      const s = new Set();
      s.add(() => new Promise((resolve, reject) =>
        setTimeout(() => resolve('one'), 50)
      ));
      s.add(() => new Promise((resolve, reject) =>
        setTimeout(() => resolve('two'), 80)
      ));
      s.add(() => new Promise((resolve, reject) =>
        setTimeout(() => resolve('three'), 30)
      ));

      const ret = promiseful.race(s);

      assert(ret !== null, 'Return is NOT null');
      ret.then((res) => {
        expect(res).to.eql('three');
        done();
      })
      .catch(done);
    });

  });

});
