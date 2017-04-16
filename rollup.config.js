const version = require('./package.json').version;

export default {
  entry: 'src/promiseful.js',
  format: 'umd',
  moduleName: 'promiseful',
  dest: `dist/${version}/promiseful.js`
};
