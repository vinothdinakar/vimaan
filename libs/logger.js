'use strict';

var _ = require('lodash'),
    fs = require('fs'),
    config = require('../config/config'),
    winston = require('winston'),
    winstonRotateFile = require('winston-daily-rotate-file');
var chalk = require('chalk');


// Instantiating the default winston application logger with the Console
// transport
// Winston logging level { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            colorize: true,
            showLevel: true,
            handleExceptions: true,
            humanReadableUnhandledException: true
        })
    ],
    exitOnError: false
});

/**
 * Instantiate a winston's File transport for disk file logging
 *
 * @param logger a valid winston logger object
 */
logger.setupFileLogger = function setupFileLogger(options) {

    var fileLoggerTransport = this.getLogOptions();
    if (!fileLoggerTransport) {
        return false;
    }

    try {
        // Check first if the configured path is writable and only then
        // instantiate the file logging transport
        if (fs.openSync(fileLoggerTransport.filename, 'a+')) {
            logger.add(winston.transports.File, fileLoggerTransport);
        }

        return true;
    } catch (err) {
        console.log('An error has occured during the creation of the File transport logger.');
        console.log(err);

        return false;
    }

};

/**
 * The options to use with winston logger
 *
 * Returns a Winston object for logging with the File transport
 */
logger.getLogOptions = function getLogOptions() {

    var configFileLogger = config.log.fileLogger;

    if (!_.has(config, 'log.fileLogger.directoryPath') || !_.has(config, 'log.fileLogger.fileName')) {
        console.log('unable to find logging file configuration');
        return false;
    }

    var logPath = configFileLogger.directoryPath + '/' + configFileLogger.fileName;

    return {
        level: 'debug',
        colorize: false,
        filename: logPath,
        timestamp: true,
        maxsize: configFileLogger.maxsize ? configFileLogger.maxsize : 10485760,
        maxFiles: configFileLogger.maxFiles ? configFileLogger.maxFiles : 2,
        json: (_.has(configFileLogger, 'json')) ? configFileLogger.json : false,
        eol: '\n',
        tailable: true,
        showLevel: true,
        handleExceptions: true,
        humanReadableUnhandledException: true
    };

};

//logger.setupFileLogger();

/**
 * The options to use with winston logger
 *
 * Setup the File transport for daily rotate
 */

logger.setupDailyFileRotater = function(){
    var fileLoggerTransport = this.getLogOptions();
    if (!fileLoggerTransport) {
        return false;
    }

    try {
        // Check first if the configured path is writable and only then
        // instantiate the file logging transport
        if (fs.openSync(fileLoggerTransport.filename, 'a+')) {
            logger.add(winston.transports.DailyRotateFile, fileLoggerTransport);
        }

        return true;
    } catch (err) {
        console.log('An error has occured during the creation of the File transport logger.');
        console.log(chalk.red('Logger ERROR: Seems like log file is missing. Please create it under '+ fileLoggerTransport.filename));
        console.log(err);

        return false;
    }
};

logger.setupDailyFileRotater();

module.exports = logger;
