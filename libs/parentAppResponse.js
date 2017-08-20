


var parentAppResponse = function () {
    var response = {};

    this.getStatusCode = function () {
        return response.statusCode;
    };

    this.setStatusCode = function (statusCode) {
        response['statusCode'] = statusCode;
    };

    this.getStatusMessage = function () {
        return response.statusMessage;
    };

    this.setStatusMessage = function () {
        response['statusMessage'] = statusMessage;
    };

    this.getErrorCode = function () {
        return response.errorCode;
    };

    this.setErrorCode = function () {
        response['errorCode'] = errorCode;
    };

    this.getAuthToken = function () {
        return response.authToken;
    };

    this.setAuthToken = function (authToken) {
        response['authToken'] = authToken;
    };

    this.setAsSuccess = function (successMessage, data) {
        response['statusCode'] = 1;
        response['statusMessage'] = successMessage;
        if(data) {
            response['data'] = data;
        }
    };

    this.isSuccess = function (successMessage) {
        return response['statusCode'] === 1;
    };

    this.setAsFailure = function (failureMessage) {
        response['statusCode'] = 2;
        response['statusMessage'] = failureMessage;
    };

    this.setAsError = function (errorMessage) {
        response['statusCode'] = 0;
        response['statusMessage'] = errorMessage;
    };

    this.getResponse = function () {
        return response;
    };

    this.getData = function (dataStr) {
        var dataObj = response['data'][dataStr];
        if(dataObj) {
            return dataObj;
        }
        else {
            return false;
        }
    };


};


module.exports = parentAppResponse;

