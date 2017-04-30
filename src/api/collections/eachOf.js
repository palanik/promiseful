import collector from '../functions/collector';
import utils from '../../utils/index';

export default function eachOf(data, fn) {
  const funcs = Object.keys(data)
    .map(d => fn.bind(null, data[d], d));

  const coll = new collector.Functions(funcs);
  return coll.attachKernel((v) => undefined);
}
