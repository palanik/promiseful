import collector from '../functions/collector';
import utils from '../../utils/index';

export default function map(data, fn) {
  const keys = Object.keys(data);
  const funcs = keys.map(d => fn.bind(null, data[d], d));

  const coll = new collector.Functions(funcs);
  return coll.attachKernel((vals) =>
    keys.reduce((acc, key, idx) => {
      acc[key] = vals[idx];
      return acc;
    },
    {})
  );
}
