import core from './core';

export default function until(test, fn, ...initValue) {
  return core.loop(fn, (v) => test(v), ...initValue);
}
