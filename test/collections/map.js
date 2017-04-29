import { expect } from 'chai';
import assert from 'assert';
import promiseful from '../../src/';

describe('map', () => {

  describe('parallel', () => {

    describe('resolve', () => {

      it('Multiplication Table', (done) => {
        const ret = promiseful.map(
          [1,2,3,4,5,6,7,8],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve(val * 4), 50);
            }
          )
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql([4, 8, 12, 16, 20, 24, 28, 32]);
          done();
        })
        .catch(done);
      });

    });

    describe('reject', () => {
      it('first of three', (done) => {
        const ret = promiseful.map(
          [1,2,3,4,5,6,7,8],
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
        const ret = promiseful.map(
          [1,2,3,4,5,6,7,8],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve(val * 4), 50);
            }
          )
        ).parallelLimit(4);

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql([4, 8, 12, 16, 20, 24, 28, 32]);
          done();
        })
        .catch(done);
      });

    });

  });


  describe('series', () => {

    describe('resolve', () => {

      it('Multiplication Table', (done) => {
        const ret = promiseful.map(
          [1,2,3,4,5,6,7,8],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve(val * 4), 50);
            }
          )
        ).series();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql([4, 8, 12, 16, 20, 24, 28, 32]);
          done();
        })
        .catch(done);
      });

    });

  });

  describe('race', () => {

    describe('resolve', () => {

      it('Multiplication Table', (done) => {
        const ret = promiseful.map(
          [1,2,3,4,5,6,7,8],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve(val * 4), (10 - val) * 50);
            }
          )
        ).race();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(32);
          done();
        })
        .catch(done);
      });

    });

  });

});
