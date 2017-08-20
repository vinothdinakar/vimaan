'use strict';

// include dependency modules
var Q = require('q');
var path = require('path');
var dbModel = require(path.resolve('./db/model/structure'));
var config = require(path.resolve('./config/config'));
var logger = require(path.resolve('./libs/logger'));
var parentAppResponse = require(path.resolve('./libs/parentAppResponse'));



var signup = function() {

    var ParentUser = dbModel.ParentUser;
    var ParentProfile = dbModel.ParentProfile;

    var createVerificationCode = function(){
        var d = new Date();
        var uniqId = d.getTime();
        var uniqIdStr = String(uniqId);
        var lastSix = uniqIdStr.substr(uniqIdStr.length-6);
        logger.debug(lastSix);
        return lastSix;
    };

    this.parentSignUp = function (signupDetails, callbackFn) {

        var signUpResponse = new parentAppResponse();
        var phoneNumber = signupDetails.phoneNumber;
        var password = signupDetails.password;
        var _newParentUserId;
        var _verificationCode;
        logger.silly('in fn parentSignUp');

        var checkIfPhoneNumberAlreadyExist = function(){
            var deferred = Q.defer();
            ParentUser.find({phoneNumber: phoneNumber},function(err, parentUser){
                if (err) {
                    signUpResponse.setAsError('PHONE_NUMBER_CHECK_ERROR');
                    deferred.reject(signUpResponse.getResponse());
                    //callbackFn({error: err, message: "Error while checking phoneNumber", status: "Failure", status_code:"1", api_status_code: "6101"});
                }else if(parentUser.length == 0) {
                    signUpResponse.setAsSuccess('NEW_PHONE_NUMBER');
                    deferred.resolve(signUpResponse.getResponse());
                }else{
                    signUpResponse.setAsFailure('PHONE_NUMBER_EXIST');
                    console.log(signUpResponse.getResponse());
                    deferred.resolve(signUpResponse.getResponse());
                    //callbackFn({status: "success", status_code:"0", message:"PhoneNumber already registered", api_status_code: "6104"});
                }
            });
            return deferred.promise;
        };

        var shouldCreateNewParentUser = function(phoneNumberStatus){
            var deferred = Q.defer();
            if(phoneNumberStatus.statusMessage == "NEW_PHONE_NUMBER"){
                _verificationCode = createVerificationCode();
                ParentUser.create({phoneNumber: phoneNumber, password: password, phoneNumberVerified: 0, verificationCode: _verificationCode}, function(err, newParent){
                    if(err){
                        logger.error(err);
                        signUpResponse.setAsError('PARENT_USER_CREATION_ERROR');
                        deferred.reject(signUpResponse.getResponse());
                    }else if(newParent){
                        _newParentUserId = newParent._id;
                        signUpResponse.setAsSuccess('PARENT_USER_CREATED');
                        deferred.resolve(signUpResponse.getResponse());
                    }
                });
            }else if(phoneNumberStatus.statusMessage == "PHONE_NUMBER_EXIST"){
                deferred.resolve(phoneNumberStatus);
            }
            return deferred.promise;
        };

        var initSMSForPhoneVerification = function(parentUserStatus){
            logger.debug("in fn sendMessageForPhoneVerification");
            logger.debug(parentUserStatus);
            var deferred = Q.defer();
            if(parentUserStatus.statusMessage == "PARENT_USER_CREATED"){
                var data = {
                    phoneNumber: phoneNumber,
                    verificationCode: _verificationCode
                };
                logger.debug('SMS Sent');
                signUpResponse.setAsSuccess('PHONE_VERIFICATION_NEEDED');
                deferred.resolve(signUpResponse.getResponse());
            }else{
                deferred.resolve(parentUserStatus);
            }
            return deferred.promise;
        };

        checkIfPhoneNumberAlreadyExist()
            .then(shouldCreateNewParentUser)
            .then(initSMSForPhoneVerification)
            .then(function(response){
                logger.silly("in final response");
                callbackFn(signUpResponse.getResponse());
            })
            .catch(function (respJson) {
                logger.debug(respJson);
                callbackFn(respJson);
            })
            .done();
    };

    this.verifyPhoneCode = function(phoneNumber, phoneCode, callbackFn){

        var phoneNumber = phoneNumber;
        var phoneCode = phoneCode;
        var _linkedParentUserId;
        var verifyPhoneCodeResponse = new parentAppResponse();


        var checkPhoneCode = function(){
            var deferred = Q.defer();
            ParentUser.find({phoneNumber: phoneNumber},function(err, parentUser){
                console.log(parentUser);
                if (err) {
                    verifyPhoneCodeResponse.setAsError('CHECK_PHONE_CODE_ERROR');
                    deferred.reject(verifyPhoneCodeResponse.getResponse());
                }else if(parentUser.length == 0) {
                    verifyPhoneCodeResponse.setAsFailure('NO_PHONE_NUMBER');
                    deferred.resolve(verifyPhoneCodeResponse.getResponse());
                }else{
                    console.log(parentUser[0].verificationCode);
                    if(parentUser[0].verificationCode == phoneCode){
                        _linkedParentUserId = parentUser[0]._id;
                        verifyPhoneCodeResponse.setAsSuccess('VERIFICATION_SUCCESS', {parentUserId: _linkedParentUserId});
                        deferred.resolve(verifyPhoneCodeResponse.getResponse());
                    }else{
                        verifyPhoneCodeResponse.setAsFailure('INCORRECT_VERIFICATION_CODE');
                        deferred.resolve(verifyPhoneCodeResponse.getResponse());
                    }
                }
            });
            return deferred.promise;
        };

        var updateAsVerified = function(verificationStatus){
            var deferred = Q.defer();
            if(verificationStatus.statusMessage == "VERIFICATION_SUCCESS"){
                ParentUser.find({phoneNumber: phoneNumber},function(err, parentUser){
                    if (err) {
                        deferred.reject("ERROR");
                        //callbackFn({error: err, message: "Error while checking phoneNumber", status: "Failure", status_code:"1", api_status_code: "6101"});
                    }else if(parentUser.length == 0) {
                        deferred.resolve("NO_PHONE_NUMBER");
                    }else{
                        parentUser[0].phoneNumberVerified = 1;
                        parentUser[0].save();
                        deferred.resolve(verificationStatus);
                    }
                });
            }else{
                deferred.reject(verificationStatus);
            }
            return deferred.promise;
        };

        checkPhoneCode()
            .then(updateAsVerified)
            .then(function(response){
                callbackFn(response);
            })
            .catch(function (respJson) {
                console.log(respJson);
                callbackFn(respJson);
            })
            .done();
    };


    this.sendVerificationCodeAgain = function(phoneNumber, callbackFn){
        var _verificationCode;

        var findParentUser = function(){
            console.log(phoneNumber);
            var deferred = Q.defer();
            ParentUser.find({phoneNumber: phoneNumber},function(err, parentUser){
                console.log(parentUser);
                if (err) {
                    deferred.reject("ERROR");
                }else if(parentUser.length == 0) {
                    deferred.resolve("NO_PHONE_NUMBER");
                }else{
                    deferred.resolve(parentUser[0]._id);
                }
            });
            return deferred.promise;
        };

        var updateVerificationCode = function(parentUserId){
            console.log(parentUserId)
            var deferred = Q.defer();
            _verificationCode = createVerificationCode();
            ParentUser.findByIdAndUpdate(parentUserId, {verificationCode:_verificationCode}, function(err, updatedParentUser){
                console.log(updatedParentUser);
                if(err){
                    deferred.reject("ERROR");
                    //callbackFn({status: "Failure", error: err, status_code:"1", message:"Unable to link Parent Profile with Parent User", api_status_code: "6803"});
                }else if(updatedParentUser){
                    //MysLogger.info("Successfully linked Parent Profile with Parent User");
                    deferred.resolve("VERIFICATION_CODE_UPDATED");
                }
            });
            return deferred.promise;
        };

        var smsUpdatedCode = function(updatedCodeStatus){
            var deferred = Q.defer();
            if(updatedCodeStatus == "VERIFICATION_CODE_UPDATED"){
                var data = {
                    phoneNumber: phoneNumber,
                    verificationCode: _verificationCode
                };
                logger.info('Send SMS Code');
                deferred.resolve("VERIFICATION_CODE_UPDATED_AND_MESSAGED");
            }
            return deferred.promise;
        };

        findParentUser()
            .then(updateVerificationCode)
            .then(smsUpdatedCode)
            .then(function(response){
                var sendVerificationCodeResponse;
                if(response == "VERIFICATION_CODE_UPDATED_AND_MESSAGED"){
                    sendVerificationCodeResponse = {status: 1, message: "VERIFICATION_CODE_SENT"};
                }else{
                    sendVerificationCodeResponse = {status: 0, message: response};
                }

                callbackFn(sendVerificationCodeResponse)
            })
            .catch(function (respJson) {
                console.log(respJson);
                callbackFn(respJson);
            })
            .done();


    };



};

module.exports = new signup();