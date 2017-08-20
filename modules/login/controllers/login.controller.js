'use strict';

// include dependency modules
var path = require('path');
var Q = require('q');
var dbModel = require(path.resolve('./db/model/structure'));
var config = require(path.resolve('./config/config'));
var logger = require(path.resolve('./libs/logger'));
var parentAppResponse = require(path.resolve('./libs/parentAppResponse'));
var jwt = require('jsonwebtoken');



var login = function() {

    var ParentUser = dbModel.ParentUser;
    var ParentProfile = dbModel.ParentProfile;

    this.parentLogin = function (phoneNumber, password, callbackFn) {

        var _linkedProfileId;
        var loginResponse = new parentAppResponse();

        var checkParentSignIn = function(phoneNumber, password){
            var deferred = Q.defer();
            ParentUser.find({phoneNumber: phoneNumber, password: password},function(err, parentUser){
                if (err) {
                    loginResponse.setAsError('PARENT_SIGNIN_ERROR');
                    deferred.reject(loginResponse);
                }else if(parentUser.length == 0) {
                    loginResponse.setAsFailure('INVALID_PHONE_PWD');
                    deferred.resolve(loginResponse);
                }else {
                    if(parentUser[0].phoneNumberVerified == 1){
                        _linkedProfileId = parentUser[0].parentProfileId;
                        loginResponse.setAsSuccess('SIGN_IN_SUCCESS');
                        deferred.resolve(loginResponse);
                    }else{
                        loginResponse.setAsFailure('PHONE_NUMBER_VERIFICATION_NEEDED');
                        deferred.resolve(loginResponse);
                    }
                }
            });
            return deferred.promise;
        };

        var generateAuthToken = function(){
            if(loginResponse.isSuccess()){
                var parent = {
                    phoneNumber: phoneNumber
                };
                // create a token
                var token = jwt.sign(parent, config.secret, {
                    expiresIn: 1440 // expires in 24 hours
                });
                loginResponse.setAuthToken(token);
                return true;
            }else{
                return false;
            }
        };

        checkParentSignIn(phoneNumber, password)
            .then(generateAuthToken)
            .then(function(response){
                callbackFn(loginResponse.getResponse());
            })
            .catch(function (respJson) {
                console.log(respJson);
                callbackFn(respJson);
            })
            .done();
    };

    this.parentForgetPassword = function (phoneNumber, callbackFn){

        var forgetPwdResponse = new parentAppResponse();
        ParentUser.find({phoneNumber: phoneNumber},function(err, parentUser){
            if (err) {
                forgetPwdResponse.setAsError('FORGET_PASSWORD_ERROR');
            }else if(parentUser.length == 0) {
                forgetPwdResponse.setAsFailure('INCORRECT_PHONE_NUMBER');
            }else{
                // Phone Number Exist
                // TODO: Send temperory reset code via SMS to phone Number
                forgetPwdResponse.setAsSuccess('RESET_CODE_SENT');
            }
            callbackFn(forgetPwdResponse.getResponse());
        });
    };

    this.verifyResetCode = function (phoneNumber, resetCode, callbackFn){
        var verifyResetCodeResponse = new parentAppResponse();

        ParentUser.find({phoneNumber: phoneNumber},function(err, parentUser){
            if (err) {
                verifyResetCodeResponse.setAsError('VERIFY_RESET_CODE_ERROR');
                callbackFn(verifyResetCodeResponse.getResponse());
            }else if(parentUser.length == 0) {
                verifyResetCodeResponse.setAsFailure('INCORRECT_PHONE_NUMBER');
                callbackFn(verifyResetCodeResponse.getResponse());
            }else{
                if(parentUser.verificationCode === resetCode){
                    verifyResetCodeResponse.setAsSuccess('CODE_VERIFIED');
                    callbackFn(verifyResetCodeResponse.getResponse());
                }else{
                    verifyResetCodeResponse.setAsError('INCORRECT_RESET_CODE');
                    callbackFn(verifyResetCodeResponse.getResponse());
                }
            }
        });
    };


    this.parentResetPassword = function (phoneNumber, newPassword, callbackFn){
        var parentResetPwdResponse = new parentAppResponse();

        ParentUser.find({phoneNumber: phoneNumber},function(err, parentUser){
            if (err) {
                parentResetPwdResponse.setAsError('RESET_PASSWORD_ERROR');
                callbackFn(parentResetPwdResponse.getResponse());
            }else if(parentUser.length == 0) {
                parentResetPwdResponse.setAsFailure('INCORRECT_PHONE_NUMBER');
                callbackFn(parentResetPwdResponse.getResponse());
            }else{
                // TODO: Encrypt Password
                var newPasswordObj = {password: newPassword};
                ParentUser.findByIdAndUpdate(parentUser[0]._id, newPasswordObj, function(err, updatedParentUser){
                    if(err){
                        parentResetPwdResponse.setAsError('ERROR_UPDATING_PASSWORD');
                        callbackFn(parentResetPwdResponse.getResponse());
                    }else if(updatedParentUser){
                        parentResetPwdResponse.setAsError('PWD_UPDATE_SUCCESS');
                        callbackFn(parentResetPwdResponse.getResponse());
                    }
                    // TODO: Add a dummy return to avoid getting hanged
                });
            }
        });
    };



};

module.exports = new login();