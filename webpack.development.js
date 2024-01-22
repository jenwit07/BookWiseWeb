const { merge } = require('webpack-merge');
const path = require('path');
const dotenv = require('dotenv');
const common = require('./webpack.common.js');
// call dotenv and it will return an Object with a parsed key
const env = dotenv.config({path: `./.env.${process.env.NODE_ENV}`}).parsed;

module.exports = merge(common(env), {
    devServer: {
        stats: {
            children: false, // Hide children information
            maxModules: 0 // Set the maximum number of modules to be shown
        },
        writeToDisk: true,
        contentBase: path.join(__dirname, 'client'),
        clientLogLevel: 'debug',
        proxy: {
            "/": {
                target: env.SERVER_API,
                secure: false,
                bypass: function (req, res, proxyOptions) {
                    //console.log(req.headers);
                }
            },

        }
    },
    devtool: 'eval-source-map',
    watchOptions: {
        ignored: /node_modules/
    },
});
