import { expect } from 'chai';
import assert from 'assert';
import promiseful from '../../src/';

describe('each', () => {

  describe('parallel', () => {

    describe('resolve', () => {

      it('Sum', (done) => {
        let sum = 0;
        const ret = promiseful.each(
          [1,2,3,4,5,6,7,8],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => { sum += val; resolve(val) }, 50);
            }
          )
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(undefined);
          expect(sum).to.eql(36);
          done();
        })
        .catch(done);
      });

    });

    describe('reject', () => {
      it('first of three', (done) => {
        const ret = promiseful.each(
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

      it('Sum', (done) => {
        let sum = 0;
        const ret = promiseful.each(
          [1,2,3,4,5,6,7,8,9,10],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => { sum += val; resolve(val) }, 50);
            }
          )
        ).parallelLimit(4);

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(undefined);
          expect(sum).to.eql(55);
          done();
        })
        .catch(done);
      });

    });

  });


  describe('series', () => {

    describe('resolve', () => {

      it('Sum', (done) => {
        let sum = 0;
        const ret = promiseful.each(
          [1,2,3,4,5,6,7,8],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => { sum += val; resolve(val) }, 50);
            }
          )
        ).series();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(undefined);
          expect(sum).to.eql(36);
          done();
        })
        .catch(done);
      });

    });

  });

  describe('race', () => {

    describe('resolve', () => {

      it('Sum among equals', (done) => {
        let sum = 0;
        const ret = promiseful.each(
          [1,2,3,4,5,6,7,8],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => { sum += val; resolve(val * 4) }, (10 - val) * 50);
            }
          )
        ).race();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(undefined);
          expect(sum).to.eql(8);
          done();
        })
        .catch(done);
      });

    });

  });

});
