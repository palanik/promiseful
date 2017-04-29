import { expect } from 'chai';
import assert from 'assert';
import promiseful from '../../src/';

describe('eachOf', () => {

  describe('parallel', () => {

    describe('resolve', () => {

      it('Sum', (done) => {
        const obj = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8};
        let sum = 0;
        const ret = promiseful.eachOf(
          {a:'aaa',b:'bbb',c:'ccc',d:'ddd',e:'eee',f:'fff',g:'ggg',h:'hhh'},
          (val, key) => new Promise((resolve, reject) => {
              setTimeout(() => { sum += obj[key]; resolve(val) }, 50);
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
      it('reject by key', (done) => {
        const ret = promiseful.eachOf(
          {a:'aaa',b:'bbb',c:'ccc',d:'ddd',e:'eee',f:'fff',g:'ggg',h:'hhh'},
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
          expect(err).to.eql('eee');
          done();
        });
      });

    });

  });

  describe('parallelLimit', () => {

    describe('resolve', () => {

      it('Sum', (done) => {
        const obj = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8};
        let sum = 0;
        const ret = promiseful.eachOf(
          {a:'aaa',b:'bbb',c:'ccc',d:'ddd',e:'eee',f:'fff',g:'ggg',h:'hhh'},
          (val, key) => new Promise((resolve, reject) => {
              setTimeout(() => { sum += obj[key]; resolve(val) }, 50);
            }
          )
        ).parallelLimit(4);

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


  describe('series', () => {

    describe('resolve', () => {

      it('Sum', (done) => {
        const obj = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8};
        let sum = 0;
        const ret = promiseful.eachOf(
          {a:'aaa',b:'bbb',c:'ccc',d:'ddd',e:'eee',f:'fff',g:'ggg',h:'hhh'},
          (val, key) => new Promise((resolve, reject) => {
              setTimeout(() => { sum += obj[key]; resolve(val) }, 50);
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
        const obj = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8};
        let sum = 0;
        const ret = promiseful.eachOf(
          {a:'aaa',b:'bbb',c:'ccc',d:'ddd',e:'eee',f:'fff',g:'ggg',h:'hhh'},
          (val, key) => new Promise((resolve, reject) => {
              setTimeout(() => { sum += obj[key]; resolve(obj[key] * 4) }, (10 - obj[key]) * 50);
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
