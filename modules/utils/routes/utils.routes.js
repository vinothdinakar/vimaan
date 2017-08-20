'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var utilController = require('../controllers/utils.controllers');
var metricsLogger = require(path.resolve('./libs/metricsLogger'));
var tokenAuthentication = require(path.resolve('./libs/tokenAuthentication'));

/// api for Util activities

/**
 * @api {get} /appInfo/ App Information
 * @apiName AppInfo
 * @apiGroup Utils
 *
 *
 * @apiSuccess {String} title Title of the App.
 * @apiSuccess {String} version  Version of the App.
 */

router.get('/appInfo', tokenAuthentication, function(req,res,next){
    utilController.getAppInfo(function(returnObj){
        res.json(returnObj);
    });
    metricsLogger.addMetrics('util');
});


/**
 * @api {get} /authenticate/ App Information
 * @apiName Authenticate
 * @apiGroup Utils
 *
 *
 * @apiSuccess {String} success Status of the api call (1 or 0).
 * @apiSuccess {String} message Response message of the api call.
 * @apiSuccess {String} token Algorithamically generated token.
 */

router.post('/authenticate', function(req,res,next){
    utilController.getAuthenticateToken(function(returnObj){
        res.json(returnObj);
    });
    metricsLogger.addMetrics('util', {source: 'authentication'});
});

module.exports = router;
