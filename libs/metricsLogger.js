'use strict';

// include dependency modules
var path = require('path');
var dbModel = require(path.resolve('./db/model/structure'));
var config = require(path.resolve('./config/config'));
var logger = require(path.resolve('./libs/logger'));



var metricsLogger = function() {
    var metricsLogger = dbModel.MetricsLogs;

    this.addMetrics = function(fid, featurePropsJson){
        var metricsJson = {};
        metricsJson['date'] = new Date();
        metricsJson['fid'] = fid;
        for(var eachProp in featurePropsJson){
            if(featurePropsJson.hasOwnProperty(eachProp)){
                metricsJson[eachProp] = featurePropsJson[eachProp];
            }
        }
        if(config.sendMetricsTo.mongo){
            pushToMetricsDb(metricsJson);
        }
    };

    var pushToMetricsDb = function(metricsJson){
        metricsLogger.create({
            logJson: metricsJson
        }, function(err, metricsJson){
            if(err){
                logger.error('Unable to push to Mongo '+ err);
            }else{
                logger.info('Metrics added to DB successfully');
            }
        });
    };
};

module.exports = new metricsLogger();