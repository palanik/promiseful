import { expect } from 'chai';
import assert from 'assert';
import promiseful from '../../src/';

describe('applyEachOf', () => {

  describe('parallel', () => {

    describe('resolve', () => {

      it('Small Multiples', (done) => {
        let results = 0;
        const ret = promiseful.applyEachOf(
          {
            a: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  const res = val * 1;
                  results += res;
                  resolve(res);
                }, 50);
              }
            ),
            b: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  const res = val * 2;
                  results += res;
                  resolve(res);
                }, 80);
              }
            ),
            c: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  const res = val * 3;
                  results += res;
                  resolve(res);
                }, 30);
              }
            )
          },
          7
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(undefined);
          expect(results).to.eql(42);
          done();
        })
        .catch(done);
      });

      it('one', (done) => {
        let results = null;
        const ret = promiseful.applyEachOf(
          {
            a: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  results = `Hello ${val}`;
                  resolve(results)
                }, 50);
              }
            )
          },
          'World'
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(undefined);
          expect(results).to.eql('Hello World');
          done();
        })
        .catch(done);
      });

      it('zero', (done) => {
        const ret = promiseful.applyEachOf({}, 'Universe').parallel();

        assert(ret !== null, 'Return is NOT null');
        ret.then((res) => {
          expect(res).to.eql(undefined);
          done();
        })
        .catch(done);
      });

      it('Multiple params', (done) => {
        let results = 0;
        const ret = promiseful.applyEachOf(
          {
            a: (val1, val2, val3) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  results += (val1 + val2 + val3) * 1;
                  resolve(results);
                }, 50);
              }
            ),
            b: (val1, val2, val3) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  results += (val1 + val2 + val3) * 2;
                  resolve(results);
                }, 50);
              }
            ),
            c: (val1, val2, val3) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  results += (val1 + val2 + val3) * 3;
                  resolve(results);
                }, 50);
              }
            )
          },
          2, 3, 5
        ).parallel();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(undefined);
          expect(results).to.eql(60);
          done();
        })
        .catch(done);
      });

    });

    describe('reject', () => {
      it('first of three', (done) => {
        const ret = promiseful.applyEachOf(
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
        const ret = promiseful.applyEachOf(
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

      it('Large Mulitples', (done) => {
        let results = 0;
        const ret = promiseful.applyEachOf(
          {
            a: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  const res = val * 1;
                  results += res;
                  resolve(res)
                }, 50);
              }
            ),
            b: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  const res = val * 2;
                  results += res;
                  resolve(res)
                }, 80);
              }
            ),
            c: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  const res = val * 3;
                  results += res;
                  resolve(res)
                }, 30);
              }
            ),
            d: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  const res = val * 4;
                  results += res;
                  resolve(res)
                }, 70);
              }
            ),
            e: (val) => new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const res = val * 5;
                    results += res;
                    resolve(res)
                  }, 20);
              }
            ),
            f: (val) => new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const res = val * 6;
                    results += res;
                    resolve(res)
                  }, 55);
              }
            ),
            g: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  const res = val * 7;
                  results += res;
                  resolve(res)
                }, 75);
              }
            ),
            h: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  const res = val * 8;
                  results += res;
                  resolve(res)
                }, 65);
              }
            ),
            i: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  const res = val * 9;
                  results += res;
                  resolve(res)
                }, 15);
              }
            )
          },
          2
        ).parallelLimit(5);

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(undefined);
          expect(results).to.eql(90);
          done();
        })
        .catch(done);
      });

    });

    describe('reject', () => {
      it('third of three', (done) => {
        const ret = promiseful.applyEachOf(
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
        const ret = promiseful.applyEachOf(
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

      it('Triple Multiple', (done) => {
        let results = 0;
        const ret = promiseful.applyEachOf(
          {
            a: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  const res = val * 1;
                  results += res;
                  resolve(res)
                }, 50);
              }
            ),
            b: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  const res = val * 2;
                  results += res;
                  resolve(res)
                }, 80);
              }
            ),
            c: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  const res = val * 3;
                  results += res;
                  resolve(res)
                }, 30);
              }
            ),
          },
          7
        ).series();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(undefined);
          expect(results).to.eql(42);
          done();
        })
        .catch(done);
      });

      it('one', (done) => {
        let results = null;
        const ret = promiseful.applyEachOf(
          {
            a: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  results = `Hello ${val}`;
                  resolve(results);
                }, 50);
              }
            )
          },
          'World'
        ).series();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(undefined);
          expect(results).to.eql('Hello World');
          done();
        })
        .catch(done);
      });

      it('zero', (done) => {
        const ret = promiseful.applyEachOf({}, 'Universe').series();

        assert(ret !== null, 'Return is NOT null');
        ret.then((res) => {
          expect(res).to.eql(undefined);
          done();
        })
        .catch(done);
      });

    });

    describe('reject', () => {
      it('first of three', (done) => {
        const ret = promiseful.applyEachOf(
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
        const ret = promiseful.applyEachOf(
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

  describe('race', () => {

    describe('resolve', () => {

      it('What Multiple?', (done) => {
        let results = 0;
        const ret = promiseful.applyEachOf(
          {
            a: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  const res = val * 1;
                  results += res;
                  resolve(res)
                }, 50);
              }
            ),
            b: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  const res = val * 2;
                  results += res;
                  resolve(res)
                }, 80);
              }
            ),
            c: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  const res = val * 3;
                  results += res;
                  resolve(res)
                }, 30);
              }
            )
          },
          7
        ).race();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(undefined);
          expect(results).to.eql(21);
          done();
        })
        .catch(done);
      });

      it('one', (done) => {
        let results = null;
        const ret = promiseful.applyEachOf(
          {
            a: (val) => new Promise((resolve, reject) => {
                setTimeout(() => {
                  results = `Hello ${val}`;
                  resolve(results)
                }, 50);
              }
            )
          },
          'World'
        ).race();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('Promise');
        ret.then((res) => {
          expect(res).to.eql(undefined);
          expect(results).to.eql('Hello World');
          done();
        })
        .catch(done);
      });

      it('zero', (done) => {
        const ret = promiseful.applyEachOf({}, 'Universe').race();

        assert(ret !== null, 'Return is NOT null');
        ret.then((res) => {
          expect(res).to.be.undefined;
          done();
        })
        .catch(done);
      });

    });

    describe('reject', () => {
      it('first of three', (done) => {
        const ret = promiseful.applyEachOf(
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
        ).race();

        assert(ret !== null, 'Return is NOT null');
        expect(ret).to.be.a('promise');
        ret
        .then((res) => {
          expect(res).to.eql(undefined);
          done();
        })
        .catch(done);
      });

      it('all three', (done) => {
        const ret = promiseful.applyEachOf(
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
