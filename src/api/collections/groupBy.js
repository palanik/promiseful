import collector from '../functions/collector';
import utils from '../../utils/index';

export default function groupBy(data, fn) {
  const arrData = utils.collection.arrayize(data);
  const funcs = arrData.map(d => fn.bind(null, d));

  const coll = new collector.Functions(funcs);
  return coll.attachKernel(vals =>
    vals.reduce((acc, val, idx) => {
      if (!(val in acc)) {
        acc[val] = [];
      }
      acc[val].push(arrData[idx]);
      return acc;
    },
    {}),
  );
}
