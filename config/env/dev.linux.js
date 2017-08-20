'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
    app: {
        title: defaultEnvConfig.app.title + ' - Development Environment',
    },
    port: process.env.PORT || 3000,
    appLogFilePath: '/Applications/appLogs/',
    log: {
        // logging with Morgan - https://github.com/expressjs/morgan
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: 'dev',
        level: 'info',
        fileLogger: {
            directoryPath: '/Applications/appLogs',
            fileName: 'app.log',
            maxsize: 10485760,
            maxFiles: 2,
            json: false
        }
    },
    db: [{
        name: 'db1',
        uri: 'mongodb://' + (process.env.MONGODB_IP || 'localhost') + ':27017' + '/db1',
        options: {
            user: '',
            pass: ''
        },
        // Enable mongoose debug mode
        debug: process.env.MONGODB_DEBUG || false
    },{
        name: 'db2',
        uri: 'mongodb://' + (process.env.MONGODB_IP || 'localhost') + ':27017' + '/db2',
        options: {
            user: '',
            pass: ''
        },
        // Enable mongoose debug mode
        debug: process.env.MONGODB_DEBUG || false
    }],
    sendMetricsTo: {
        mongo: 1
    }
};