// rollup.config.js
import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import nodeBuiltins from 'rollup-plugin-node-builtins';

const pkg = require('./package');

export default {
	input: 'src/main.ts',
	moduleId: pkg.name,
	name: 'BrowserTest',
	//   entry: 'dist/es/index.js',
	output: {
		file: 'docs/web/bundle.js',
		format: 'iife'
	},
	treeshake: false,
	globals: {
		jquery: '$'
	},
	sourcemap: true,
	plugins: [
		typescript({
			typescript: require('typescript') // use local version
		}),
		nodeResolve({
			module: true,
			jsnext: true,
			browser: true,
			extensions: ['.js', '.json'],
			preferBuiltins: false
		}),
		commonjs({
			sourceMap: true,
			namedExports: {
				'./node_modules/backbone/backbone.js': ['View', 'history', 'Collection', 'Model', 'Router'],
				'./node_modules/jquery/dist/jquery.js': ['jquery'],
				'./node_modules/jquery/dist/jquery.min.js': ['jquery']
			}
		}),
		nodeBuiltins({

		})
	]
}
