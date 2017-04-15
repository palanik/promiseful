import assert from 'assert';
import { expect } from 'chai';
import promiseful from '../src/';

describe('parallelLimit', () => {

  describe('resolve', () => {

    it('Even split', (done) => {
      const results = [];
      const funcs = [];
      for (let i = 0; i < 20; i++) {
        const res = Math.random().toString(36).substring(2, 9);
        results.push(res);
        funcs.push(
          () => new Promise(
            (resolve, reject) => setTimeout(
              () => resolve(res),
              Math.round(1 + Math.random() * 50)
            )
          )
        );
      }

      const ret = promiseful.parallelLimit(funcs, 5);

      assert(ret !== null, 'Return is NOT null');
      ret.then((res) => {
        expect(res).to.eql(results);
        done();
      })
      .catch(done);
    });

    it('Odd split', (done) => {
      const results = [];
      const funcs = [];
      for (let i = 0; i < 20; i++) {
        const res = Math.random().toString(36).substring(2, 9);
        results.push(res);
        funcs.push(
          () => new Promise(
            (resolve, reject) => setTimeout(
              () => resolve(res),
              Math.round(1 + Math.random() * 50)
            )
          )
        );
      }

      const ret = promiseful.parallelLimit(funcs, 7);

      assert(ret !== null, 'Return is NOT null');
      ret.then((res) => {
        expect(res).to.eql(results);
        done();
      })
      .catch(done);
    });

    it('one', (done) => {
      const ret = promiseful.parallelLimit(
        [
          () => new Promise((resolve, reject) =>
            setTimeout(() => resolve('one'), 50)
          )
        ],
        3
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
      const ret = promiseful.parallelLimit([], 3);

      assert(ret !== null, 'Return is NOT null');
      ret.then((res) => {
        expect(res).to.eql([]);
        done();
      })
      .catch(done);
    });

    it('function, promise, value', (done) => {
      const ret = promiseful.parallelLimit(
        [
          () => new Promise((resolve, reject) =>
            setTimeout(() => resolve('one'), 50)
          ),
          new Promise((resolve, reject) =>
            setTimeout(() => resolve('two'), 80)
          ),
          'three'
        ],
        2
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
    it('Even split', (done) => {
      const results = [];
      const funcs = [];
      for (let i = 0; i < 20; i++) {
        const res = Math.random().toString(36).substring(2, 9);
        results.push(res);
        funcs.push(
          () => new Promise(
            (resolve, reject) => setTimeout(
              () => {
                if (Math.random() > 0.5) {
                  resolve(res);
                } else {
                  reject('23');
                }
              },
              Math.round(1 + Math.random() * 50)
            )
          )
        );
      }

      const ret = promiseful.parallelLimit(funcs, 5);

      assert(ret !== null, 'Return is NOT null');
      ret.then(done)
      .catch((err) => {
        expect(err).to.eql('23');
        done();
      });
    });

    it('Even split', (done) => {
      const results = [];
      const funcs = [];
      for (let i = 1; i <= 20; i++) {
        const res = Math.random().toString(36).substring(2, 9);
        results.push(res);
        funcs.push(
          () => new Promise(
            (resolve, reject) => setTimeout(
              () => {
                if (Math.random() > 0.5) {
                  resolve(res);
                } else {
                  reject('15');
                }
              },
              Math.round(1 + Math.random() * 50)
            )
          )
        );
      }

      const ret = promiseful.parallelLimit(funcs, 3);

      assert(ret !== null, 'Return is NOT null');
      ret.then(done)
      .catch((err) => {
        expect(err).to.eql('15');
        done();
      });
    });

    it('one', (done) => {
      const ret = promiseful.parallelLimit(
        [
          () => new Promise((resolve, reject) =>
            setTimeout(() => reject('one'), 50)
          )
        ],
        5
      );

      assert(ret !== null, 'Return is NOT null');
      expect(ret).to.be.a('Promise');
      ret.then(done)
      .catch((err) => {
        expect(err).to.eql('one');
        done();
      });
    });


  });

});
