'use strict';

// include dependency
var express = require('express');
var router = express.Router();
var path = require('path');

// include controllers as per the current api
var sampleController = require('../controllers/sample.controllers');

/**
 * @api {method} path [title]
 * @apiName name
 * @apiGroup name
 *
 * @apiParam [(group)] [{type}] [field=defaultValue] [description]
 *
 * @apiSuccess [(group)] [{type}] field [description]
 *
 * @apiError [(group)] [{type}] field [description]
 */

router.post('/route', function(req,res,next){
    var assetId = req.body.assetId;
    var assetName = req.body.assetName;
    var assetDescription = req.body.assetDescription;
    var assetPrice = req.body.assetPrice;
    var assetRating = req.body.assetRating;

    var assetDetails = {
        assetId: assetId,
        assetName: assetName,
        assetDescription: assetDescription,
        assetPrice: assetPrice,
        assetRating: assetRating
    };

    sampleController.addAsset(assetDetails, function(returnObj){
        res.json(returnObj);
    });
});



module.exports = router;