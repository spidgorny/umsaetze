let path = require('path');

module.exports = {
	entry: "./src/main.ts",
	output: {
		filename: "docs/web/bundle.js"
	},
	devtool: "source-map",
	devServer: {
		contentBase: path.join(__dirname, "docs/web"),
		publicPath: "/",
	},
	module: {
		rules: [
			// All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
			{test: /\.tsx?$/, loader: "awesome-typescript-loader"},

			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{enforce: "pre", test: /\.js$/, loader: "source-map-loader"},

			{
				test: /\.css$/,
				use: [ 'css-loader' ]
			}
		]
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json"],
		alias: {
			handlebars: 'handlebars/dist/handlebars.min.js'
		}
	},
	externals: {
		"filereader.js": "FileReaderJS"
	}
};
