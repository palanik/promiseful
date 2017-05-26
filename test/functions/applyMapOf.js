import { expect } from 'chai';
import assert from 'assert';
import promiseful from '../../src/';

describe('applyMapOf', () => {

  describe('parallel', () => {

    describe('resolve', () => {

      it('Multiplication Table', (done) => {
        const ret = promiseful.applyMapOf(
          {
            a: (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 1), 50);
              }
            ),
            b: (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 2), 80);
              }
            ),
            c: (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 3), 30);
              }
            )
          },
          7
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql({a:7, b:14, c:21});
          done();
        })
        .catch(done);
      });

      it('one', (done) => {
        const ret = promiseful.applyMapOf(
          {
            a: (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(`Hello ${val}`), 50);
              }
            )
          },
          'World'
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql({a:'Hello World'});
          done();
        })
        .catch(done);
      });

      it('zero', (done) => {
        const ret = promiseful.applyMapOf({}, 'Universe').parallel();

        assert(ret !== null, 'Return is NOT null');
        ret.then((res) => {
          expect(res).to.eql({});
          done();
        })
        .catch(done);
      });

      it('Multiple params', (done) => {
        const ret = promiseful.applyMapOf(
          {
            a: (val1, val2, val3) => new Promise((resolve, reject) => {
                setTimeout(() => resolve((val1 + val2 + val3) * 1), 50);
              }
            ),
            b: (val1, val2, val3) => new Promise((resolve, reject) => {
                setTimeout(() => resolve((val1 + val2 + val3) * 2), 80);
              }
            ),
            c: (val1, val2, val3) => new Promise((resolve, reject) => {
                setTimeout(() => resolve((val1 + val2 + val3) * 3), 30);
              }
            )
          },
          2, 3, 5
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql({a:10, b:20, c:30});
          done();
        })
        .catch(done);
      });

    });

    describe('reject', () => {
      it('first of three', (done) => {
        const ret = promiseful.applyMapOf(
          {
            a: (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 1), 50)
            ),
            b: (val) => new Promise((resolve, reject) =>
              setTimeout(() => resolve(val * 2), 80)
            ),
            c: (val) => new Promise((resolve, reject) =>
              setTimeout(() => resolve(val * 3), 30)
            )
          },
          5
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

      it('all three', (done) => {
        const ret = promiseful.applyMapOf(
          {
            a: (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 1), 150)
            ),
            b: (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 2), 80)
            ),
            c: (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 3), 30)
            )
          },
          15
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret
        .then(done)
        .catch((err) => {
          expect(err).to.eql(45);
          done();
        });
      });

    });

  });

  describe('parallelLimit', () => {

    describe('resolve', () => {

      it('Multiplication Table', (done) => {
        const ret = promiseful.applyMapOf(
          {
            a: (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 1), 50);
              }
            ),
            b: (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 2), 80);
              }
            ),
            c: (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 3), 30);
              }
            ),
            d: (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 4), 70);
              }
            ),
            e: (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 5), 20);
              }
            ),
            f: (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 6), 55);
              }
            ),
            g: (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 7), 75);
              }
            ),
            h: (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 8), 65);
              }
            ),
            i: (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 9), 15);
              }
            )
          },
          2
        ).parallelLimit(5);

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql({a:2, b:4, c:6, d:8, e:10, f:12, g:14, h:16, i:18});
          done();
        })
        .catch(done);
      });

    });

    describe('reject', () => {
      it('third of three', (done) => {
        const ret = promiseful.applyMapOf(
          {
            a: (val) => new Promise((resolve, reject) =>
              setTimeout(() => resolve(val * 1), 50)
            ),
            b: (val) => new Promise((resolve, reject) =>
              setTimeout(() => resolve(val * 2), 80)
            ),
            c: (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 3), 30)
            )
          },
          5
        ).parallelLimit(2);

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('promise');
        ret
        .then(done)
        .catch((err) => {
          expect(err).to.eql(15);
          done();
        });
      });

      it('all three', (done) => {
        const ret = promiseful.applyMapOf(
          {
            a: (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 1), 250)
            ),
            b: (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 2), 180)
            ),
            c: (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 3), 30)
            )
          },
          15
        ).parallelLimit(2);

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret
        .then(done)
        .catch((err) => {
          done();
          expect(err).to.eql(30);
        });
      });

    });

  });


  describe('series', () => {

    describe('resolve', () => {

      it('Multiplication Table', (done) => {
        const ret = promiseful.applyMapOf(
          {
            a: (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 1), 50);
              }
            ),
            b: (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 2), 80);
              }
            ),
            c: (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 3), 30);
              }
            )
          },
          7
        ).series();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql({a:7, b:14, c:21});
          done();
        })
        .catch(done);
      });

      it('one', (done) => {
        const ret = promiseful.applyMapOf(
          {
            a:(val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(`Hello ${val}`), 50);
              }
            )
          },
          'World'
        ).series();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql({a:'Hello World'});
          done();
        })
        .catch(done);
      });

      it('zero', (done) => {
        const ret = promiseful.applyMapOf({}, 'Universe').series();

        assert(ret !== null, 'Return is NOT null');
        ret.then((res) => {
          expect(res).to.eql({});
          done();
        })
        .catch(done);
      });

    });

    describe('reject', () => {
      it('first of three', (done) => {
        const ret = promiseful.applyMapOf(
          {
            a: (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 1), 50)
            ),
            b: (val) => new Promise((resolve, reject) =>
              setTimeout(() => resolve(val * 2), 80)
            ),
            c: (val) => new Promise((resolve, reject) =>
              setTimeout(() => resolve(val * 3), 30)
            )
          },
          5
        ).series();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('promise');
        ret
        .then(done)
        .catch((err) => {
          expect(err).to.eql(5);
          done();
        });
      });

      it('all three', (done) => {
        const ret = promiseful.applyMapOf(
          {
            a: (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 1), 150)
            ),
            b: (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 2), 80)
            ),
            c: (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 3), 30)
            )
          },
          15
        ).series();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret
        .then(done)
        .catch((err) => {
          expect(err).to.eql(15);
          done();
        });
      });

    });

  });

});
