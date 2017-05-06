import core from './core';
import series from './series';
import parallelLimit from './parallelLimit';
import waterfall from './waterfall';
import forever from './forever';
import until from './until';
import whilst from './whilst';
import relay from './relay';

import applyEach from './functions/applyEach';
import times from './functions/times';

import each from './collections/each';
import eachOf from './collections/eachOf';
import map from './collections/map';
import mapOf from './collections/mapOf';
import filter from './collections/filter';
import groupBy from './collections/groupBy';

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
  relay,
  waterfall,

  // aliases
  every: core.all.bind(core),
  inject: core.reduce.bind(core),
  fold: core.reduce.bind(core),
  tryEach: relay,

  // Collections
  each,
  eachOf,
  map,
  mapOf,
  filter,
  groupBy,

  // Functions
  applyEach,
  times,
  forever,
  until,
  whilst,
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
