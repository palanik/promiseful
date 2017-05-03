import core from './core';

export default function whilst(test, fn, ...initValue) {
  return core.loop(fn, (v) => !test(v), ...initValue);
}
