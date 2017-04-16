import assert from 'assert';
import { expect } from 'chai';
import collection from '../../src/utils/collection';

describe('chunk', () => {
  it('Even split', () => {
    const coll = [];
    for (let i = 0; i < 20; i++) {
      const res = Math.random().toString(36).substring(2, 9);
      coll.push(res);
    }

    const ret = collection.chunk(coll, 4);
    expect(ret).to.be.a('Array');
    expect(ret.length).to.eql(5);
    ret.forEach((c) => {
      expect(c).to.be.a('Array');
      expect(c.length).to.eql(4);
    })
  });

  it('Odd split', () => {
    const coll = [];
    for (let i = 0; i < 20; i++) {
      const res = Math.random().toString(36).substring(2, 9);
      coll.push(res);
    }

    const ret = collection.chunk(coll, 3);
    expect(ret).to.be.a('Array');
    expect(ret.length).to.eql(7);
    ret.forEach((c, i) => {
      expect(c).to.be.a('Array');
      if (i === (ret.length - 1)) {
        expect(c.length).to.eql(2);
      } else {
        expect(c.length).to.eql(3);
      }
    })
  });

  it('Zero', () => {
    const coll = [];
    const ret = collection.chunk(coll, 3);
    expect(ret).to.be.a('Array');
    expect(ret.length).to.eql(1);
    ret.forEach((c, i) => {
      expect(c).to.be.a('Array');
      expect(c.length).to.eql(0);
    })
  });

});
