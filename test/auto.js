import { expect } from 'chai';
import assert from 'assert';
import promiseful from '../src/';

// process.on('unhandledRejection', r => console.log(r));

describe('auto', () => {

  describe('resolve', () => {

    it('simple', (done) => {
      const order = [];
      const ret = promiseful.auto({
        task1: ['task2', (results) => new Promise((resolve, reject) => {
          order.push(1);
          setTimeout(() => resolve(1), 50);
        })],
        task2: (results) => new Promise((resolve, reject) => {
          order.push(2);
          setTimeout(() => resolve(2), 35);
        }),
        task3: ['task2', (results) => new Promise((resolve, reject) => {
          order.push(3);
          setTimeout(() => resolve(3), 25);
        })],
        task4: ['task1', 'task2', (results) => new Promise((resolve, reject) => {
          order.push(4);
          setTimeout(() => resolve(4), 30);
        })],
        task5: ['task2', (results) => new Promise((resolve, reject) => {
          order.push(5);
          setTimeout(() => resolve(5), 45);
        })],
        task6: ['task2', (results) => new Promise((resolve, reject) => {
          order.push(6);
          setTimeout(() => resolve(6), 40);
        })]
      });

      assert(ret !== null, 'Return is NOT null');
      expect(ret).to.be.a('Promise');
      ret.then((res) => {
        expect(res).to.eql({
          task1: 1,
          task2: 2,
          task3: 3,
          task4: 4,
          task5: 5,
          task6: 6
        });
        expect(order).to.eql([2, 1, 3, 5, 6, 4]);
        done();
      })
      .catch(done);
    });

    it('one', (done) => {
      const ret = promiseful.auto(
        {
          task1: () => new Promise((resolve, reject) =>
            setTimeout(() => resolve('one'), 50)
          )
        }
      );

      assert(ret !== null, 'Return is NOT null');
      expect(ret).to.be.a('Promise');
      ret.then((res) => {
        expect(res).to.eql({task1: 'one'});
        done();
      })
      .catch(done);
    });

    it('zero', (done) => {
      const ret = promiseful.auto({});

      assert(ret !== null, 'Return is NOT null');
      ret.then((res) => {
        expect(res).to.eql({});
        done();
      })
      .catch(done);
    });

    it('check intermediate results', (done) => {
      const order = [];
      const ret = promiseful.auto({
        task1: ['task2', (results) => new Promise((resolve, reject) => {
          order.push(1);
          expect(results.task2).to.eql(2);
          setTimeout(() => resolve(1), 50);
        })],
        task2: (results) => new Promise((resolve, reject) => {
          order.push(2);
          setTimeout(() => resolve(2), 35);
        }),
        task3: ['task2', (results) => new Promise((resolve, reject) => {
          order.push(3);
          expect(results.task2).to.eql(2);
          setTimeout(() => resolve(3), 25);
        })],
        task4: ['task1', 'task2', (results) => new Promise((resolve, reject) => {
          order.push(4);
          expect(results.task1).to.eql(1);
          expect(results.task2).to.eql(2);
          setTimeout(() => resolve(4), 30);
        })],
        task5: ['task2', (results) => new Promise((resolve, reject) => {
          order.push(5);
          expect(results.task2).to.eql(2);
          setTimeout(() => resolve(5), 45);
        })],
        task6: ['task2', (results) => new Promise((resolve, reject) => {
          order.push(6);
          expect(results.task2).to.eql(2);
          setTimeout(() => resolve(6), 40);
        })]
      });

      assert(ret !== null, 'Return is NOT null');
      expect(ret).to.be.a('Promise');
      ret.then((res) => {
        expect(res).to.eql({
          task1: 1,
          task2: 2,
          task3: 3,
          task4: 4,
          task5: 5,
          task6: 6
        });
        expect(order).to.eql([2, 1, 3, 5, 6, 4]);
        done();
      })
      .catch(done);
    });

    it('change intermediate results', (done) => {
      const order = [];
      const ret = promiseful.auto({
        task1: ['task2', (results) => new Promise((resolve, reject) => {
          order.push(1);
          results.task2 += 1;
          setTimeout(() => resolve(1), 50);
        })],
        task2: (results) => new Promise((resolve, reject) => {
          order.push(2);
          setTimeout(() => resolve(2), 35);
        }),
        task3: ['task2', (results) => new Promise((resolve, reject) => {
          order.push(3);
          results.task2 += 3;
          setTimeout(() => resolve(3), 25);
        })],
        task4: ['task1', 'task2', (results) => new Promise((resolve, reject) => {
          order.push(4);
          results.task1 += 4;
          results.task2 += 4;
          setTimeout(() => resolve(4), 30);
        })],
        task5: ['task2', (results) => new Promise((resolve, reject) => {
          order.push(5);
          results.task2 += 5;
          setTimeout(() => resolve(5), 45);
        })],
        task6: ['task2', (results) => new Promise((resolve, reject) => {
          order.push(6);
          results.task2 += 6;
          setTimeout(() => resolve(6), 40);
        })]
      });

      assert(ret !== null, 'Return is NOT null');
      expect(ret).to.be.a('Promise');
      ret.then((res) => {
        expect(res).to.eql({
          task1: 5,
          task2: 21,
          task3: 3,
          task4: 4,
          task5: 5,
          task6: 6
        });
        expect(order).to.eql([2, 1, 3, 5, 6, 4]);
        done();
      })
      .catch(done);
    });
  });

  describe('errors', () => {

    it('missing dependent', (done) => {
      const ret = promiseful.auto({
        task1: ['task2', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(1), 50);
        })],
        task2: (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(2), 35);
        }),
        task4: ['task1', 'task2', 'task3', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(4), 30);
        })],
        task5: ['task2', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(5), 45);
        })],
        task6: ['task2', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(6), 40);
        })]
      });

      ret
      .then(done)
      .catch((err) => {
        expect(err.message).to.equal("promiseful.auto dependent task 'task3' not found for task 'task4'");
        done();
      });
    });

    it('self dependent', (done) => {
      const ret = promiseful.auto({
        task1: ['task2', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(1), 50);
        })],
        task2: (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(2), 35);
        }),
        task4: ['task1', 'task2', 'task4', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(4), 30);
        })],
        task5: ['task2', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(5), 45);
        })],
        task6: ['task2', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(6), 40);
        })]
      });

      ret
      .then(done)
      .catch((err) => {
        expect(err.message).to.equal("promiseful.auto self dependent task 'task4'");
        done();
      });
    });

    it('cyclic dependent', (done) => {
      const ret = promiseful.auto({
        task1: ['task2', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(1), 50);
        })],
        task2: (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(2), 35);
        }),
        task4: ['task1', 'task2', 'task5', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(4), 30);
        })],
        task5: ['task4', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(5), 45);
        })],
        task6: ['task2', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(6), 40);
        })]
      });

      ret
      .then(done)
      .catch((err) => {
        expect(err.message).to.equal("promiseful.auto cyclic dependency detected.");
        done();
      });
    });

  });

  describe('reject', () => {
    it('first of five', (done) => {
      const ret = promiseful.auto({
        task1: ['task2', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(1), 50);
        })],
        task2: (results) => new Promise((resolve, reject) => {
          setTimeout(() => reject(2), 35);
        }),
        task3: ['task1', 'task2', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resovle(4), 30);
        })],
        task4: ['task3', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(5), 45);
        })],
        task5: ['task2', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(6), 40);
        })]
      });

      assert(ret !== null, 'Return is NOT null');
      expect(ret).to.be.a('promise');

      ret
      .then(done)
      .catch((err) => {
        expect(err).to.equal(2);
        done();
      });
    });

    it('one of five', (done) => {
      const ret = promiseful.auto({
        task1: ['task2', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(1), 50);
        })],
        task2: (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(2), 35);
        }),
        task3: ['task1', 'task2', (results) => new Promise((resolve, reject) => {
          setTimeout(() => reject(4), 30);
        })],
        task4: ['task3', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(5), 45);
        })],
        task5: ['task2', (results) => new Promise((resolve, reject) => {
          setTimeout(() => resolve(6), 40);
        })]
      });

      assert(ret !== null, 'Return is NOT null');
      expect(ret).to.be.a('promise');

      ret
      .then(done)
      .catch((err) => {
        expect(err).to.equal(4);
        done();
      });
    });

    it('all of five', (done) => {
      const ret = promiseful.auto({
        task1: ['task2', (results) => new Promise((resolve, reject) => {
          setTimeout(() => reject(1), 50);
        })],
        task2: (results) => new Promise((resolve, reject) => {
          setTimeout(() => reject(2), 35);
        }),
        task3: ['task1', 'task2', (results) => new Promise((resolve, reject) => {
          setTimeout(() => reject(4), 30);
        })],
        task4: ['task3', (results) => new Promise((resolve, reject) => {
          setTimeout(() => reject(5), 45);
        })],
        task5: ['task2', (results) => new Promise((resolve, reject) => {
          setTimeout(() => reject(6), 40);
        })]
      }, 2);

      assert(ret !== null, 'Return is NOT null');
      expect(ret).to.be.a('promise');

      ret
      .then(done)
      .catch((err) => {
        expect(err).to.equal(2);
        done();
      });
    });

  });

});
