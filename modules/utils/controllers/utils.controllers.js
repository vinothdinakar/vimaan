'use strict';

// include dependency modules
var jwt    = require('jsonwebtoken');
var config = require('../../../config/config');



var utilities = function() {

    this.getAppInfo = function(callbackFn){
        var respJson = {
            'title': config.app.title
        };
        callbackFn(respJson);
    };

    this.getAuthenticateToken = function(callbackFn){

        var stb = {
            unitAddress: 1213123123123123
        };
        // create a token
        var token = jwt.sign(stb, config.secret, {
            expiresIn: 1440 // expires in 24 hours
        });

        var respJson = {
            success: true,
            message: 'New Token Available',
            token: token
        };
        callbackFn(respJson);
    };

};

module.exports = new utilities();
