export default class Collection {
  static chunk(array, n) {
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
