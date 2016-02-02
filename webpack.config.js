const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack/webpack-isomorphic-tools'));

require('node-noop');

module.exports = {
	cache: true,
  devtool: 'inline-source-map',
  progress: true,
	entry: [
    'webpack-dev-server/client?http://localhost:9000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // 'only' prevents reload on syntax errors
		path.resolve(__dirname, 'javascript') + '/client/app.js'
	],
	output: {
		path: path.join(__dirname, 'build/'),
    publicPath: 'http://localhost:9000/',
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
		// filename: 'bundle.js'
	},
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true
    }),
    webpackIsomorphicToolsPlugin.development()
  ],
	postcss: [
    autoprefixer({
      browsers: ['last 3 versions']
    })
  ],
	module: {
		loaders: [
      {
				test: /\.jsx?$/,
				loaders: ['react-hot', 'jsx-loader?harmony'],
				include: path.join(__dirname, 'javascript')
			},
      {
        test: /\.scss$/,
        loader: 'style!css?modules&importLoaders=1&sourceMap&localIdentName=[local]___[hash:base64:5]!sass?outputStyle=expanded&sourceMap',
				// include: path.join(__dirname, 'sass')
      },
			{ test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
		]
	}
};
