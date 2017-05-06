import { expect } from 'chai';
import assert from 'assert';
import promiseful from '../../src/';

describe('filter', () => {

  describe('parallel', () => {

    describe('resolve', () => {

      it('Evens', (done) => {
        const ret = promiseful.filter(
          [1,2,3,4,5,6,7,8,9,10],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve((val & 1) === 0), 50);
            }
          )
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql([2,4,6,8,10]);
          done();
        })
        .catch(done);
      });

    });

    describe('reject', () => {
      it('odds', (done) => {
        const ret = promiseful.filter(
          [1,2,3,4,5,6,7,8,9,10],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => {
                if (val === 5) {
                  reject(val);
                  return;
                }
                resolve((val & 1) === 0);
              }, 50);
            }
          )
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('promise');
        ret
        .then(done)
        .catch((err) => {
          expect(err).to.eql(5);
          done();
        });
      });

    });

  });

  describe('parallelLimit', () => {

    describe('resolve', () => {

      it('Evens', (done) => {
        const ret = promiseful.filter(
          [1,2,3,4,5,6,7,8,9,10],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve((val & 1) === 0), 50);
            }
          )
        ).parallelLimit(4);

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql([2,4,6,8,10]);
          done();
        })
        .catch(done);
      });

    });

  });


  describe('series', () => {

    describe('resolve', () => {

      it('Evens', (done) => {
        const ret = promiseful.filter(
          [1,2,3,4,5,6,7,8,9,10],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve((val & 1) === 0), 50);
            }
          )
        ).series();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql([2,4,6,8,10]);
          done();
        })
        .catch(done);
      });

    });

  });

});
