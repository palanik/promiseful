import promiseful from '../src/index.js';
import { expect } from 'chai';
import assert from 'assert';

describe('series', () => {

  describe('resolve', () => {

    it('three', (done) => {
      const order = [];
      const ret = promiseful.series(
        [
          () => new Promise((resolve, reject) => {
              order.push(1);
              setTimeout(() => resolve('one'), 50);
            }
          ),
          () => new Promise((resolve, reject) => {
              order.push(2);
              setTimeout(() => resolve('two'), 80);
            }
          ),
          () => new Promise((resolve, reject) => {
              order.push(3);
              setTimeout(() => resolve('three'), 30);
            }
          )
        ]
      );

      assert(ret !== null, 'Return is NOT null');
      expect(ret).to.be.a('Promise');
      ret.then((res) => {
        expect(res).to.eql(['one', 'two', 'three']);
        expect(order).to.eql([1,2,3]);
        done();
      });
    });

    it('one', (done) => {
      const ret = promiseful.series(
        [
          () => new Promise((resolve, reject) =>
            setTimeout(() => resolve('one'), 50)
          )
        ]
      );

      assert(ret !== null, 'Return is NOT null')
      expect(ret).to.be.a('Promise');
      ret.then((res) => {
        expect(res).to.eql(['one']);
        done();
      });
    });

    it('zero', (done) => {
      const ret = promiseful.series([]);

      assert(ret !== null, 'Return is NOT null')
      ret.then((res) => {
        expect(res).to.eql([]);
        done();
      });
    });


  });

  describe('reject', () => {
    it('first of three', (done) => {
      const ret = promiseful.series(
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
      expect(ret).to.be.a('promise');
      ret
      .catch((err) => {
        expect(err).to.eql('one');
        done();
      });
    });

    it('all three', (done) => {
      const ret = promiseful.series(
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
      expect(ret).to.be.a('Promise');
      ret
      .catch((err) => {
        expect(err).to.eql('one');
        done();
      });
    });

  });

});
