import collector from './collector';

export default function times(n, fn) {
  const funcs = [];
  for (let i = 0; i < n; i += 1) {
    funcs.push(fn.bind(null, i));
  }

  const coll = new collector.Functions(funcs);
  return coll.attachKernel();
}
