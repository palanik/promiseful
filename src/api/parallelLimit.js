import utils from '../utils/index';
import core from './core';
import series from './series';

export default function parallelLimit(fns, limit = 0) {
  const funcs = utils.collection.arrayize(fns);
  if (limit <= 0 || limit >= funcs.length) {
    return core.all(funcs);
  }

  const funcsList = utils.collection.chunk(funcs, limit)
    .map(c => (() => core.all(c)));

  return series(funcsList)
    .then(utils.collection.flatten);
}
