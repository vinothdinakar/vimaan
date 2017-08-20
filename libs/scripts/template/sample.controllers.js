'use strict';

// include dependency modules
var path = require('path');
var config = require(path.resolve('./config/config'));
var logger = require(path.resolve('./libs/logger'));



var samples = function() {

    this.addAsset = function(assetDetails, callbackFn){
        var respJson = {};
        callbackFn(respJson);
    };

};

module.exports = new samples();