'use strict';

var glob = require('glob'),
    path = require('path'),
    _ = require('lodash');


/**
 * Get files by glob patterns
 */
var getGlobbedPaths = function (globPatterns, excludes) {
    // URL paths regex
    var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    var output = [];

    // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function (globPattern) {
            output = _.union(output, getGlobbedPaths(globPattern, excludes));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            var files = glob.sync(globPatterns);
            if (excludes) {
                files = files.map(function (file) {
                    if (_.isArray(excludes)) {
                        for (var i in excludes) {
                            if (excludes.hasOwnProperty(i)) {
                                file = file.replace(excludes[i], '');
                            }
                        }
                    } else {
                        file = file.replace(excludes, '');
                    }
                    return file;
                });
            }
            output = _.union(output, files);
        }
    }

    return output;
};


/**
 * Validate NODE_ENV existence
 */
var validateEnvironmentVariable = function () {
    var environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');
    console.log();
    if (!environmentFiles.length) {
        if (process.env.NODE_ENV) {
            console.error('+ Error: No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead');
        } else {
            console.error('+ Error: NODE_ENV is not defined! Using default development environment');
        }
        process.env.NODE_ENV = 'development';
    }
};

/**
 * Initialize global files
 */
var initGlobalFiles = function (config, assets) {
    // Appending files
    config.files = {
        server: {},
        client: {}
    };

    // Setting Globbed route files
    config.files.server.routes = getGlobbedPaths(assets.server.routes);

    // Setting Globbed test files
    //config.files.server.tests = getGlobbedPaths(assets.client.tests);
};



/**
 * Initialize global configuration
 */
var initGlobalConfig = function () {
    // Validate NODE_ENV existence
    validateEnvironmentVariable();

    // Get the default assets
    var defaultAssets = require(path.join(process.cwd(), 'config/assets/default'));

    // Get the current assets
    //var environmentAssets = require(path.join(process.cwd(), 'config/assets/', process.env.NODE_ENV)) || {};

    // Merge assets
    //var assets = _.merge(defaultAssets, environmentAssets);
    var assets = defaultAssets;

    // Get the default config
    var defaultConfig = require(path.join(process.cwd(), 'config/env/default'));

    // Get the current config
    var environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {};

    // Merge config files
    var config = _.merge(defaultConfig, environmentConfig);

    // Initialize Global files
    initGlobalFiles(config, assets);

    // read package.json for MEAN.JS project information
    var pkg = require(path.resolve('./package.json'));
    config.meanjs = pkg;

    return config;
};


/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
