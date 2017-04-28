import collector from '../functions/collector';
import utils from '../../utils/index';

export default function each(data, fn) {
  const funcs = utils.collection.arrayize(data)
    .map(d => fn.bind(null, d));

  const coll = new collector.Functions(funcs);
  return coll.attachKernel();
}
