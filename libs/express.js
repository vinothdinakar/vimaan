'use strict';

/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('../config/config');
var fs = require('fs');

var index = require('../routes/index');

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
    // Showing stack errors
    app.set('showStackError', true);

    app.use(logger('dev'));

    // Request body parsing middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app) {
    // Setting the app router and static folder
    app.use('/', express.static(path.resolve('./public')));
    app.use('/api', express.static(path.resolve('./docs/apidocs')));
};

/**
 * Configure the modules static routes
 */
module.exports.initCORSSettings = function (app) {
    // Global Properties for CORS settings
    app.use(function(req, res, next){
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });
};

/**
 * Configure the modules server routes.
 * The files need to be read synchronously because the server declaration
 * happens synchronously in app.js init().
 *
 * The routes will be used as /moduleName/endpoint.
 * Where moduleName is the module directory name.
 */
module.exports.initModulesServerRoutes = function (app) {
    var modulesPath = path.resolve('./modules');
    try {
        var list = fs.readdirSync(modulesPath);

        console.log('Modules list: ' + list.join(', '));
        list.forEach(function(moduleName) {
            try {
                var routeFiles = fs.readdirSync(modulesPath + '/' + moduleName + '/routes');

                if (routeFiles) {
                    routeFiles.forEach(function (routeFile) {
                        var routeFilePath = modulesPath + '/' + moduleName + '/routes/' + routeFile;
                        var routePath = '/api/v1/' + moduleName;
                        console.log('Adding routes to: ' + routePath + ' : ' + routeFilePath);
                        var routes = require(routeFilePath);
                        app.use(routePath, routes);
                    });
                }
            }
            catch(e) {
                console.error('Error while reading routes files: ' + modulesPath + '/' + moduleName + '/routes. ' + e);
            }
        });
    }
    catch(e) {
        console.error('Error while reading modules directory. ' + e);
    }
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function (app) {
    // Set jade as the template engine
    // view engine setup
    app.set('views', path.resolve('./views'));
    app.set('view engine', 'jade');
};


/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
};



/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
    // Initialize express app
    logger("Initialize express app");
    var app = express();

    // Initialize Express middleware
    this.initMiddleware(app);

    // Initialize Express view engine
    this.initViewEngine(app);

    // Initialize the CORS settings
    this.initCORSSettings(app);

    // Initialize modules static client routes, before session!
    this.initModulesClientRoutes(app);

    // Initialize modules server routes
    this.initModulesServerRoutes(app);

    // Initialize error routes
    this.initErrorRoutes(app);

    return app;
};

