'use strict';

// include dependency
var express = require('express');
var router = express.Router();
var path = require('path');

// include controllers as per the current api
var loginController = require('../controllers/login.controller');


/**
 * @api {post} /login/parentLogin Parent Login
 * @apiName parentLogin
 * @apiGroup login
 *
 * @apiParam {Number} phoneNumber Phone Number of parent
 * @apiParam {Number} password Password for login
 *
 * @apiSuccess {Number} status Status of the request success-1 failure-0
 * @apiSuccess {String} message PHONE_NUMBER_VERIFICATION_NEEDED, SIGN_IN_SUCCESS
 * @apiSuccess {Json} parentProfile Parent Profile
 *
 * @apiError {Json} Error PARENT_SIGNIN_ERROR, INVALID_PHONE_PWD
 */
router.post('/parentLogin', function(req,res,next){
    var phoneNumber = req.body.phoneNumber;
    var password = req.body.password;
    loginController.parentLogin(phoneNumber, password, function(returnObj){
        res.json(returnObj);
    });
});

/**
 * @api {post} /login/forgetPassword Forget Password
 * @apiName forgetPassword
 * @apiGroup login
 *
 * @apiParam {Number} phoneNumber Phone Number of parent user
 *
 * @apiSuccess {Number} status Status of the request success-1 error-0 failure-2
 * @apiSuccess {String} message INCORRECT_PHONE_NUMBER, RESET_CODE_SENT
 *
 * @apiError {Json} Error FORGET_PASSWORD_ERROR
 */
router.post('/forgetPassword', function(req, res, next){
    var phoneNumber = req.body.phoneNumber;
    loginController.parentForgetPassword(phoneNumber, function(returnObj){
        res.json(returnObj);
    });
});

/**
 * @api {post} /login/VerifyResetCode Verify Reset Code
 * @apiName VerifyResetCode
 * @apiGroup login
 *
 * @apiParam {Number} phoneNumber Phone number of the user
 * @apiParam {Number} resetCode Reset code received as in SMS
 *
 * @apiSuccess {Number} status Status of the request success-1 error-0 failure-2
 * @apiSuccess {String} message CODE_VERIFIED, INCORRECT_RESET_CODE
 *
 * @apiError {Json} Error VERIFY_RESET_CODE_ERROR
 */
router.post('/VerifyResetCode', function(req, res, next){
    var phoneNumber = req.body.phoneNumber;
    var resetCode = req.body.resetCode;
    loginController.verifyResetCode(phoneNumber, resetCode, function(returnObj){
        res.json(returnObj);
    });
});

/**
 * @api {post} /login/resetPassword Reset Password
 * @apiName resetPassword
 * @apiGroup login
 *
 * @apiParam {Number} phoneNumber Phone Number of parent
 * @apiParam {Number} newPassword New password of parent user
 *
 * @apiSuccess {Number} status Status of the request success-1 error-0 failure-2
 * @apiSuccess {String} message PWD_UPDATE_SUCCESS
 *
 * @apiError {Json} Error ERROR_UPDATING_PASSWORD, RESET_PASSWORD_ERROR, INCORRECT_PHONE_NUMBER
 */
router.post('/resetPassword', function(req, res, next){
    var phoneNumber = req.body.phoneNumber;
    var newPassword = req.body.newPassword;
    loginController.parentResetPassword(phoneNumber, newPassword, function(returnObj){
        res.json(returnObj);
    });
});



module.exports = router;