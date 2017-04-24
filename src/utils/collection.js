export default class Collection {
  static arrayize(coll) {
    return Array.isArray(coll) ? coll : Array.from(coll);
  }

  static chunk(coll, n) {
    const array = Collection.arrayize(coll);
    if (n <= 0 || n >= array.length) {
      return [array];
    }

    const ret = [];
    for (let i = 0; i < array.length; i += n) {
      ret.push(array.slice(i, i + n));
    }

    return ret;
  }

  static flatten(arrays) {
    return [].concat(...arrays);
  }
}
