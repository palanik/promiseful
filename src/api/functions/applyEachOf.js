import collector from './collector';

export default function applyEachOf(data, ...args) {
  const keys = Object.keys(data);
  const funcs = keys.map(d => data[d].bind(null, ...args));

  const coll = new collector.Functions(funcs);
  return coll.attachKernel(() => undefined);
}
