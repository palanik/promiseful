import path from 'path';
import babel from 'rollup-plugin-babel';
import license from 'rollup-plugin-license';
import uglify from 'rollup-plugin-uglify';

const version = require('./package.json').version;

const straight = {
  entry: 'src/promiseful.js',
  format: 'umd',
  moduleName: 'promiseful',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    license({
      banner: {
        file: path.join(__dirname, 'LICENSE'),
        encoding: 'utf-8',
      }
    })
  ],
  dest: `dist/${version}/promiseful.js`
};

const minify = {
  entry: 'src/promiseful.js',
  format: 'umd',
  moduleName: 'promiseful',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ],
  dest: `dist/${version}/promiseful.min.js`,
  sourceMap: 'true'
};

export default (process.env.minify === 'true') ? minify : straight;
