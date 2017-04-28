import { expect } from 'chai';
import assert from 'assert';
import promiseful from '../src/';

// process.on('unhandledRejection', r => console.log(r));

describe('waterfall', () => {

  describe('resolve', () => {

    it('three', (done) => {
      const order = [];
      const ret = promiseful.waterfall(
        [
          (val) => new Promise((resolve, reject) => {
              order.push(1);
              setTimeout(() => resolve(val * 2), 50);
            }
          ),
          (val) => new Promise((resolve, reject) => {
              order.push(2);
              setTimeout(() => resolve(val * 3), 80);
            }
          ),
          (val) => new Promise((resolve, reject) => {
              order.push(3);
              setTimeout(() => resolve(val * 4), 30);
            }
          )
        ],
        1
      );

      assert(ret !== null, 'Return is NOT null');
      expect(ret).to.be.a('Promise');
      ret.then((res) => {
        expect(res).to.eql(24);
        expect(order).to.eql([1, 2, 3]);
        done();
      })
      .catch(done);
    });

    it('one', (done) => {
      const ret = promiseful.waterfall(
        [
          () => new Promise((resolve, reject) =>
            setTimeout(() => resolve('one'), 50)
          )
        ]
      );

      assert(ret !== null, 'Return is NOT null');
      expect(ret).to.be.a('Promise');
      ret.then((res) => {
        expect(res).to.eql('one');
        done();
      })
      .catch(done);
    });

    it('zero', (done) => {
      const ret = promiseful.waterfall([], 23);

      assert(ret !== null, 'Return is NOT null');
      ret.then((res) => {
        expect(res).to.eql(23);
        done();
      })
      .catch(done);
    });

    it('function, promise, value', (done) => {
      const ret = promiseful.waterfall(
        [
          (val) => new Promise((resolve, reject) =>
            setTimeout(() => resolve(val * 2), 80)
          ),
          new Promise((resolve, reject) => {
            setTimeout(() => resolve('two'), 50);
          }),
          'three'
        ],
        2
      );

      assert(ret !== null, 'Return is NOT null');
      ret.then((res) => {
        expect(res).to.eql('three');
        done();
      })
      .catch(done);
    });

  });

  describe('reject', () => {
    it('first of three', (done) => {
      const ret = promiseful.waterfall(
        [
          (val) => new Promise((resolve, reject) =>
            setTimeout(() => reject(val * val), 50)
          ),
          () => new Promise((resolve, reject) =>
            setTimeout(() => resolve('two'), 80)
          ),
          () => new Promise((resolve, reject) =>
            setTimeout(() => resolve('three'), 30)
          )
        ],
        2
      );

      assert(ret !== null, 'Return is NOT null');
      expect(ret).to.be.a('promise');
      ret
      .then(done)
      .catch((err) => {
        expect(err).to.eql(4);
        done();
      });
    });

    it('all three', (done) => {
      const ret = promiseful.waterfall(
        [
          (val) => new Promise((resolve, reject) =>
            setTimeout(() => reject(val * 2), 50)
          ),
          () => new Promise((resolve, reject) =>
            setTimeout(() => reject(val * 3), 80)
          ),
          () => new Promise((resolve, reject) =>
            setTimeout(() => reject(val * 4), 30)
          )
        ],
        1
      );

      assert(ret !== null, 'Return is NOT null');
      expect(ret).to.be.a('Promise');
      ret
      .then(done)
      .catch((err) => {
        expect(err).to.eql(2);
        done();
      });
    });

    it('function, promise, value', (done) => {
      const ret = promiseful.waterfall(
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
      ret
      .then(done)
      .catch((err) => {
        expect(err).to.eql('one');
        done();
      });
    });

  });

});
