import collector from '../functions/collector';

export default function eachOf(data, fn) {
  const funcs = Object.keys(data)
    .map(d => fn.bind(null, data[d], d));

  const coll = new collector.Functions(funcs);
  return coll.attachKernel(() => undefined);
}
