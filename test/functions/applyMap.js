import { expect } from 'chai';
import assert from 'assert';
import promiseful from '../../src/';

describe('applyMap', () => {

  describe('parallel', () => {

    describe('resolve', () => {

      it('Multiplication Table', (done) => {
        const ret = promiseful.applyMap(
          [
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 1), 50);
              }
            ),
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 2), 80);
              }
            ),
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 3), 30);
              }
            )
          ],
          7
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql([7, 14, 21]);
          done();
        })
        .catch(done);
      });

      it('one', (done) => {
        const ret = promiseful.applyMap(
          [
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(`Hello ${val}`), 50);
              }
            )
          ],
          'World'
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(['Hello World']);
          done();
        })
        .catch(done);
      });

      it('zero', (done) => {
        const ret = promiseful.applyMap([], 'Universe').parallel();

        assert(ret !== null, 'Return is NOT null');
        ret.then((res) => {
          expect(res).to.eql([]);
          done();
        })
        .catch(done);
      });

      it('Multiple params', (done) => {
        const ret = promiseful.applyMap(
          [
            (val1, val2, val3) => new Promise((resolve, reject) => {
                setTimeout(() => resolve((val1 + val2 + val3) * 1), 50);
              }
            ),
            (val1, val2, val3) => new Promise((resolve, reject) => {
                setTimeout(() => resolve((val1 + val2 + val3) * 2), 80);
              }
            ),
            (val1, val2, val3) => new Promise((resolve, reject) => {
                setTimeout(() => resolve((val1 + val2 + val3) * 3), 30);
              }
            )
          ],
          2, 3, 5
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql([10, 20, 30]);
          done();
        })
        .catch(done);
      });

    });

    describe('reject', () => {
      it('first of three', (done) => {
        const ret = promiseful.applyMap(
          [
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 1), 50)
            ),
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => resolve(val * 2), 80)
            ),
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => resolve(val * 3), 30)
            )
          ],
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
        const ret = promiseful.applyMap(
          [
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 1), 150)
            ),
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 2), 80)
            ),
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 3), 30)
            )
          ],
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
        const ret = promiseful.applyMap(
          [
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 1), 50);
              }
            ),
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 2), 80);
              }
            ),
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 3), 30);
              }
            ),
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 4), 70);
              }
            ),
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 5), 20);
              }
            ),
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 6), 55);
              }
            ),
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 7), 75);
              }
            ),
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 8), 65);
              }
            ),
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 9), 15);
              }
            )
          ],
          2
        ).parallelLimit(5);

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql([2, 4, 6, 8, 10, 12, 14, 16, 18]);
          done();
        })
        .catch(done);
      });

    });

    describe('reject', () => {
      it('third of three', (done) => {
        const ret = promiseful.applyMap(
          [
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => resolve(val * 1), 50)
            ),
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => resolve(val * 2), 80)
            ),
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 3), 30)
            )
          ],
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
        const ret = promiseful.applyMap(
          [
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 1), 250)
            ),
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 2), 180)
            ),
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 3), 30)
            )
          ],
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
        const ret = promiseful.applyMap(
          [
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 1), 50);
              }
            ),
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 2), 80);
              }
            ),
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 3), 30);
              }
            )
          ],
          7
        ).series();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql([7, 14, 21]);
          done();
        })
        .catch(done);
      });

      it('one', (done) => {
        const ret = promiseful.applyMap(
          [
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(`Hello ${val}`), 50);
              }
            )
          ],
          'World'
        ).series();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(['Hello World']);
          done();
        })
        .catch(done);
      });

      it('zero', (done) => {
        const ret = promiseful.applyMap([], 'Universe').series();

        assert(ret !== null, 'Return is NOT null');
        ret.then((res) => {
          expect(res).to.eql([]);
          done();
        })
        .catch(done);
      });

    });

    describe('reject', () => {
      it('first of three', (done) => {
        const ret = promiseful.applyMap(
          [
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 1), 50)
            ),
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => resolve(val * 2), 80)
            ),
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => resolve(val * 3), 30)
            )
          ],
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
        const ret = promiseful.applyMap(
          [
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 1), 150)
            ),
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 2), 80)
            ),
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 3), 30)
            )
          ],
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

  describe('race', () => {

    describe('resolve', () => {

      it('Multiplication Table', (done) => {
        const ret = promiseful.applyMap(
          [
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 1), 50);
              }
            ),
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 2), 80);
              }
            ),
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(val * 3), 30);
              }
            )
          ],
          7
        ).race();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(21);
          done();
        })
        .catch(done);
      });

      it('one', (done) => {
        const ret = promiseful.applyMap(
          [
            (val) => new Promise((resolve, reject) => {
                setTimeout(() => resolve(`Hello ${val}`), 50);
              }
            )
          ],
          'World'
        ).race();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql('Hello World');
          done();
        })
        .catch(done);
      });

      it('zero', (done) => {
        const ret = promiseful.applyMap([], 'Universe').race();

        assert(ret !== null, 'Return is NOT null');
        ret.then((res) => {
          expect(res).to.be.null;
          done();
        })
        .catch(done);
      });

    });

    describe('reject', () => {
      it('first of three', (done) => {
        const ret = promiseful.applyMap(
          [
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 1), 50)
            ),
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => resolve(val * 2), 80)
            ),
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => resolve(val * 3), 30)
            )
          ],
          5
        ).race();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('promise');
        ret
        .then((res) => {
          expect(res).to.eql(15);
          done();
        })
        .catch(done);
      });

      it('all three', (done) => {
        const ret = promiseful.applyMap(
          [
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 1), 150)
            ),
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 2), 80)
            ),
            (val) => new Promise((resolve, reject) =>
              setTimeout(() => reject(val * 3), 30)
            )
          ],
          15
        ).race();

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

});
