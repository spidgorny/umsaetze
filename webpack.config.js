const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Jarvis = require("webpack-jarvis");
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: [
		"./src/main.ts",
		// "webpack-dev-server/client?http://localhost:8081",
	],
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, 'docs', 'web'),
		publicPath: "web"
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		// new HtmlWebpackPlugin({
		// 	template: 'src/index.html'
		// })
		new Jarvis({
			port: 1337 // optional: set a port
		}),
		// new UglifyJSPlugin(),
	],
	devtool: "source-map",
	devServer: {
		contentBase: "docs",
		hot: true,
		compress: true,
		// publicPath: "/",
		watchContentBase: true,
		watchOptions: {
			poll: false
		},
		overlay: true,
		inline: true,
	},
	module: {
		rules: [
			// All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
			{test: /\.tsx?$/, loader: "awesome-typescript-loader"},

			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{
				enforce: "pre",
				test: /\.js$/,
				loader: "source-map-loader"
			},
			{
				test: /\.css$/,
				use: ['css-loader']
			},

			{test: /\.xslx$/, loader: 'raw'},
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
