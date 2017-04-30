import core from './core';

export default function forver(fn) {
  return core.loop(fn, () => false);
}
