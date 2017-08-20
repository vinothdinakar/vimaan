'use strict';
/* eslint no-console: 0 */

/**
 * Module dependencies.
 */
var config = require('../config/config'),
    logger = require('../libs/logger'),
    mongoose = require('mongoose');


// Load the mongoose models
module.exports.loadModels = function (callback) {
    // Globbing model files
    //require('../../modules/models/QipLogs.model');

    if (callback) callback();
};

/**
 * Initialize Mongoose.
 * It will create a connection for each database information in the configs.
 * Each connection will be exposed as module.exports[config.db.name] to be used
 * by the modules.
 */
module.exports.connect = function (cb) {

    logger.info('connecting to dbs: ' + config.db.length);

    // We keep track of how many connections have been attempted to know when
    // to call the callback.
    var connectedDBs = 0;

    config.db.forEach(function(dbInfo) {
        logger.info('Connecting to db: ' + dbInfo.uri);
        var db = mongoose.createConnection(dbInfo.uri, dbInfo.options, function (err) {
            if (err) {
                logger.error('Could not connect to MongoDB: ' + dbInfo.name);
                logger.error(err);
            }
            else {

                logger.info(dbInfo);

                logger.info('Connected to MongoDB: ' + dbInfo.name);
                // Enabling mongoose debug mode if required
                mongoose.set('debug', dbInfo.debug);

                module.exports[dbInfo.name] = db;
            }

            // Call callback when all connections are done regardless of
            // success or failure connections.
            connectedDBs++;
            logger.info('Connected DBs: ' + connectedDBs + ', number of DBs: ' + config.db.length);
            if (connectedDBs === config.db.length && cb) {
                cb();
            }
        });
    });
};


module.exports.getConnString = function(dbName) {
    var mongoConnectionString = config.db[dbName].uri;
    return mongoConnectionString;
};


module.exports.disconnect = function (cb) {
    mongoose.disconnect(function (err) {
        logger.info('Disconnected from MongoDB.');
        cb(err);
    });
};
