import { expect } from 'chai';
import assert from 'assert';
import promiseful from '../../src/';

describe('times', () => {

  describe('parallel', () => {

    describe('resolve', () => {

      it('Multiplication Table', (done) => {
        const ret = promiseful.times(
          10,
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve(val * 4), 50);
            }
          )
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql([0, 4, 8, 12, 16, 20, 24, 28, 32, 36]);
          done();
        })
        .catch(done);
      });

    });

    describe('reject', () => {
      it('first of three', (done) => {
        const ret = promiseful.times(
          10,
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => {
                if (val === 5) {
                  reject(val);
                  return;
                }
                resolve(val * 4);
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

      it('Multiplication Table', (done) => {
        const ret = promiseful.times(
          10,
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve(val * 4), 50);
            }
          )
        ).parallelLimit(4);

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql([0, 4, 8, 12, 16, 20, 24, 28, 32, 36]);
          done();
        })
        .catch(done);
      });

    });

  });


  describe('series', () => {

    describe('resolve', () => {

      it('Multiplication Table', (done) => {
        const ret = promiseful.times(
          10,
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve(val * 4), 50);
            }
          )
        ).series();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql([0, 4, 8, 12, 16, 20, 24, 28, 32, 36]);
          done();
        })
        .catch(done);
      });

    });

  });

  describe('race', () => {

    describe('resolve', () => {

      it('Multiplication Table', (done) => {
        const ret = promiseful.times(
          10,
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve(val * 4), (10 - val) * 50);
            }
          )
        ).race();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(36);
          done();
        })
        .catch(done);
      });

    });

  });

});
