import collector from './collector';
import utils from '../../utils/index';

export default function times(n, fn) {
  const funcs = [];
  for (let i = 0; i < n; i++) {
    funcs.push(fn.bind(null, i));
  }

  const coll = new collector.Functions(funcs);
  return coll.attachKernel();
}
