const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
// const WebpackObfuscator = require('webpack-obfuscator');
const dotenv = require('dotenv');
// call dotenv and it will return an Object with a parsed key
const env = dotenv.config({path: `./.env.${process.env.NODE_ENV}`}).parsed;

module.exports = merge(common(env), {
    mode: 'production',
    // plugins: [
    //     new WebpackObfuscator ({
    //         rotateStringArray: true,
    //         compact: true,
    //         debugProtection: true,
    //         disableConsoleOutput:true,
    //         domainLock: ['.sabuytech.com']
    //     })
    // ]
});
