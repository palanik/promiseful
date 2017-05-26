import collector from './collector';
import utils from '../../utils/index';

export default function applyMap(fns, ...args) {
  const funcs = utils.collection.arrayize(fns)
    .map(f => f.bind(null, ...args));

  const coll = new collector.Functions(funcs);
  return coll.attachKernel();
}
