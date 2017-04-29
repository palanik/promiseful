import { expect } from 'chai';
import assert from 'assert';
import promiseful from '../../src/';

describe('mapOf', () => {

  describe('parallel', () => {

    describe('resolve', () => {

      it('Multiplication Table', (done) => {
        const ret = promiseful.mapOf(
          {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8},
          (val, key) => new Promise((resolve, reject) => {
              setTimeout(() => resolve(val * 4), 50);
            }
          )
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql({a:4,b:8,c:12,d:16,e:20,f:24,g:28,h:32});
          done();
        })
        .catch(done);
      });

    });

    describe('reject', () => {
      it('reject e', (done) => {
        const ret = promiseful.mapOf(
          {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8},
          (val, key) => new Promise((resolve, reject) => {
              setTimeout(() => {
                if (key === 'e') {
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
        const ret = promiseful.mapOf(
          {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8},
          (val, key) => new Promise((resolve, reject) => {
              setTimeout(() => resolve(val * 4), 50);
            }
          )
        ).parallelLimit(3);

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql({a:4,b:8,c:12,d:16,e:20,f:24,g:28,h:32});
          done();
        })
        .catch(done);
      });

    });

  });


  describe('series', () => {

    describe('resolve', () => {

      it('Multiplication Table', (done) => {
        const ret = promiseful.mapOf(
          {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8},
          (val, key) => new Promise((resolve, reject) => {
              setTimeout(() => resolve(val * 4), 50);
            }
          )
        ).series();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql({a:4,b:8,c:12,d:16,e:20,f:24,g:28,h:32});
          done();
        })
        .catch(done);
      });

    });

  });

});
