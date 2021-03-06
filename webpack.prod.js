const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: [
		"./src/main.ts",
	],
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, 'docs', 'web'),
		publicPath: "web"
	},
	plugins: [
		// new HtmlWebpackPlugin({
		// 	template: 'src/index.html'
		// }),
	],
	devtool: "source-map",
	module: {
		rules: [
			// All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
			{
				test: /\.tsx?$/,
				loader: "awesome-typescript-loader"
			},

			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{
				enforce: "pre",
				test:
					/\.js$/,
				loader: "source-map-loader"
			},
			{
				test: /\.css$/,
				use: ['css-loader']
			}
		]
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json"],
		alias: {
			handlebars: 'handlebars/dist/handlebars.min.js'
		},
	},
	externals: {
		// "filereader.js": "FileReaderJS"
	},
};
