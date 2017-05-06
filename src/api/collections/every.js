import collector from '../functions/collector';
import utils from '../../utils/index';

export default function every(data, fn) {
  const arrData = utils.collection.arrayize(data);
  const funcs = arrData.map(d => fn.bind(null, d));

  const coll = new collector.Functions(funcs);
  return coll.attachKernel(vals => vals.every(e => e));
}
