import collector from '../functions/collector';
import utils from '../../utils/index';
import conditionalRace from '../conditionalRace';

export default function some(data, fn) {
  const arrData = utils.collection.arrayize(data);
  const funcs = arrData.map(d => fn.bind(null, d));

  const coll = new collector.Functions(funcs);
  return coll.attachKernel(vals => vals.some(e => e))
    .attachMethod('race', (fns => conditionalRace(fns, b => b)));
}
