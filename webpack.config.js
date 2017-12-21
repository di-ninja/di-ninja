module.exports = {
	entry:{
		'browser':['./src/browser.js'],
	},
	output: {
		filename: '[name].js',
		library: "di-ninja",
		libraryTarget: "umd"
	},
    module: {
		rules : [
			{
				test: /\.(js)?$/,
				exclude: /node_modules/,
				loader: "babel-loader",
			},
		],
    },
    devtool: 'source-map',
};
