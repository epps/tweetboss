const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {
	entry: './src/client/index.js',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				options: { presets: ['env'] }
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}
		]
	},
	resolve: { extensions: ['*', '.js', '.jsx'] },
	output: {
		path: path.resolve(__dirname, outputDirectory),
		filename: 'bundle.js'
	},
	devServer: {
		port: 3000,
		open: true,
		proxy: {
			'/api': 'http://localhost:8080'
		}
	},
	plugins: [
		new CleanWebpackPlugin([outputDirectory]),
		new HtmlWebpackPlugin({
			template: './public/index.html'
		})
	]
};
