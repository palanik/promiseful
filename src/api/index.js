import core from './core';
import series from './series';
import parallelLimit from './parallelLimit';
import waterfall from './waterfall';

import applyEach from './functions/applyEach';

import each from './collections/each';
import eachOf from './collections/eachOf';
import map from './collections/map';
import mapOf from './collections/mapOf';

const Promiseful = {

  // core
  promisify: core.promisify.bind(core),
  all: core.all.bind(core),
  race: core.race.bind(core),
  reduce: core.reduce.bind(core),

  // other
  series,
  parallel: core.all.bind(core),
  parallelLimit,
  waterfall,

  // aliases
  every: core.all.bind(core),
  inject: core.reduce.bind(core),
  fold: core.reduce.bind(core),

  // Collections
  each,
  eachOf,
  map,
  mapOf,

  // Functions
  applyEach,
};

Promiseful.promise = (P) => {
  if (P) {
    core.promise(P);
    return Promiseful;
  }

  return core.promise();
};

export default Promiseful;

// export {
//     core.promise as promise,
//     core.all as all,
//     core.race as race,
//     core.reduce as reduce,
//     core.parallelLimit as parallelLimit,
//
//     series as series,
//     parallel as parallel,
//     waterfall as waterfall,
//
//     all as every,
//     reduce as inject,
//     reduce as foldl
// };
