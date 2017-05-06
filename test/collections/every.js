import { expect } from 'chai';
import assert from 'assert';
import promiseful from '../../src/';

describe('every', () => {

  describe('parallel', () => {

    describe('resolve', () => {

      it('true', (done) => {
        const ret = promiseful.every(
          [1,2,3,4,5,6,7,8,9,10],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve(true), 50);
            }
          )
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(true);
          done();
        })
        .catch(done);
      });

      it('false', (done) => {
        const ret = promiseful.every(
          [1,2,3,4,5,6,7,8,9,10],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve(false), 50);
            }
          )
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(false);
          done();
        })
        .catch(done);
      });

      it('some', (done) => {
        const ret = promiseful.every(
          [1,2,3,4,5,6,7,8,9,10],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve((val & 1) === 0), 50);
            }
          )
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(false);
          done();
        })
        .catch(done);
      });

    });

    describe('reject', () => {
      it('true', (done) => {
        const ret = promiseful.every(
          [1,2,3,4,5,6,7,8,9,10],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => {
                if (val === 5) {
                  reject(val);
                  return;
                }
                resolve(true);
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

      it('true', (done) => {
        const ret = promiseful.every(
          [1,2,3,4,5,6,7,8,9,10],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve(true), 50);
            }
          )
        ).parallelLimit(4);

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(true);
          done();
        })
        .catch(done);
      });

    });

  });


  describe('series', () => {

    describe('resolve', () => {

      it('true', (done) => {
        const ret = promiseful.every(
          [1,2,3,4,5,6,7,8,9,10],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve(true), 50);
            }
          )
        ).series();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(true);
          done();
        })
        .catch(done);
      });

    });

  });

});
