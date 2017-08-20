'use strict';

// include dependency
var express = require('express');
var router = express.Router();
var path = require('path');

// include controllers as per the current api
var signupController = require('../controllers/signup.controller');

/**
 * @api {post} /signUp/signup Parent Signup
 * @apiName signup
 * @apiGroup SignUp
 *
 * @apiParam {Number} phoneNumber Phone Number of parent
 * @apiParam {Number} password password for login
 * @apiParam {Number} reqSource Mobile-1 Web-2
 *
 * @apiSuccess {Number} status Status of the request success-1 failure-0
 * @apiSuccess {String} message PHONE_VERIFICATION_NEEDED, PHONE_NUMBER_EXIST
 * @apiError {Json} Error
 */

router.post('/signup', function(req,res,next){
    var phoneNumber = req.body.phoneNumber;
    var password = req.body.password;

    var signupDetails = {
        phoneNumber: phoneNumber,
        password: password
    };

    signupController.parentSignUp(signupDetails, function(returnObj){
        res.json(returnObj);
    });
});

/**
 * @api {post} /signUp/verifyPhoneCode Verify Phone Code
 * @apiName verifyPhoneCode
 * @apiGroup SignUp
 *
 * @apiParam {Number} phoneNumber Phone Number of parent
 * @apiParam {Number} phoneCode Code which will be received in SMS
 * @apiParam {Number} reqSource Mobile-1 Web-2
 *
 * @apiSuccess {Number} status Status of the request success-1 failure-0
 * @apiSuccess {String} message VERIFICATION_SUCCESS, INCORRECT_VERIFICATION_CODE
 * @apiSuccess {String} parentUserId User Id of corresponding parent (if success)
 *
 * @apiError {Json} Error
 */
router.post('/verifyPhoneCode', function(req,res,next){
    var phoneNumber = req.body.phoneNumber;
    var phoneCode = req.body.phoneCode;
    var source = req.body.reqSource;

    signupController.verifyPhoneCode(phoneNumber, phoneCode, function(returnObj){
        res.json(returnObj);
    });
});


/**
 * @api {post} /signUp/sendVerificationCodeAgain Request Verification Code
 * @apiName sendVerificationCodeAgain
 * @apiGroup SignUp
 *
 * @apiParam {Number} phoneNumber Phone Number of parent
 *
 *
 * @apiSuccess {Number} status Status of the request success-1 failure-0
 * @apiSuccess {String} message VERIFICATION_CODE_SENT
 * @apiError {Json} Error
 */
router.post('/sendVerificationCodeAgain', function(req,res,next){
    var phoneNumber = req.body.phoneNumber;
    var reqSource = req.body.reqSource;
    signupController.sendVerificationCodeAgain(phoneNumber, function(returnObj){
        res.json(returnObj);
    });
});




module.exports = router;