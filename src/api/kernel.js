import core from './core';
import series from './series';
import parallelLimit from './parallelLimit';

const Kernel = {

  // core
  all: core.all.bind(core),
  race: core.race.bind(core),

  // other
  series,
  parallel: core.all.bind(core),
  parallelLimit,
};

export default Kernel;
