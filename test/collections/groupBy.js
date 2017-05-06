import { expect } from 'chai';
import assert from 'assert';
import promiseful from '../../src/';

describe('groupby', () => {

  describe('parallel', () => {

    describe('resolve', () => {

      it('Evens', (done) => {
        const ret = promiseful.groupBy(
          [1,2,3,4,5,6,7,8,9,10],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve((val & 1) === 0 ? 'even' : 'odd'), 50);
            }
          )
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql({
            odd: [1,3,5,7,9],
            even: [2,4,6,8,10]
          });
          done();
        })
        .catch(done);
      });

      it('String', (done) => {
        const alpha = /^[a-z]$/i;
        const num = /^[0-9]$/i;
        const ret = promiseful.groupBy(
          '@20m:$3fu1🤞',
          (val) => new Promise((resolve, reject) => {
              const grp = alpha.test(val) ? 'alpha' : ( num.test(val) ? 'num' : 'other');
              setTimeout(() => resolve(grp), 50);
            }
          )
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql({
            alpha: ['m','f','u'],
            num: ['2','0','3','1'],
            other: ['@',':','$','🤞']
          });
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
                resolve((val & 1) === 0 ? 'even' : 'odd');
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
        const ret = promiseful.groupBy(
          [1,2,3,4,5,6,7,8,9,10],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve((val & 1) === 0 ? 'even' : 'odd'), 50);
            }
          )
        ).parallelLimit(4);

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql({
            odd: [1,3,5,7,9],
            even: [2,4,6,8,10]
          });
          done();
        })
        .catch(done);
      });

    });

  });


  describe('series', () => {

    describe('resolve', () => {

      it('Evens', (done) => {
        const ret = promiseful.groupBy(
          [1,2,3,4,5,6,7,8,9,10],
          (val) => new Promise((resolve, reject) => {
              setTimeout(() => resolve((val & 1) === 0 ? 'even' : 'odd'), 50);
            }
          )
        ).series();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql({
            odd: [1,3,5,7,9],
            even: [2,4,6,8,10]
          });
          done();
        })
        .catch(done);
      });

    });

  });

});
