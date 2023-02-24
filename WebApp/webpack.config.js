"use strict"
{
    // Required to form a complete output path
    let path = require('path');

    module.exports = {
        mode: 'development',

        // Application entry point
        entry: "./wwwroot/Scripts/acsclient.js",

        // Output file
        output: {
            filename: 'acsclient_bundle.js',
            path: path.resolve(__dirname, './wwwroot/Scripts/')
        }
    };
}