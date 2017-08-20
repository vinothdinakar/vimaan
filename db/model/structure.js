'use strict';

var mongoose = require('mongoose');                     // mongoose for mongodb
var Schema = mongoose.Schema;

var dbStructure = function(){

    // Model Details
    this.metricsLogsSchema = ({
        logJson: {
            type: JSON,
            default: {},
            required: 'LogJson cannot be blank'
        }
    });
    this.metricsLogsModel = mongoose.model('MetricsLogs',this.metricsLogsSchema);

    this.sampleSchema = ({
        assetId: {
            type: Number,
            default: '',
            required: 'Asset Id cannot be empty'
        },
        assetName: {
            type: String,
            default: '',
            required: 'Please add Asset Name'
        },
        assetDescription: {
            type: String,
            default: ''
        },
        assetPrice: {
            type: Number,
            default: '',
            required: 'Please add Asset Price'
        },
        assetRating: {
            type: String,
            default: ''
        }
    });
    this.sampleModel = mongoose.model('Sample',this.sampleSchema);

    this.parentUserSchema = ({
        phoneNumber: {
            type: Number,
            default: '',
            required: 'Please enter phone number'
        },
        password: {
            type: String,
            default: ''
        },
        parentProfileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ParentProfile'
        },
        phoneNumberVerified: {
            type: Number,
            default: ''
        },
        verificationCode: {
            type: String,
            default: ''
        }
    });
    this.parentUserModel = mongoose.model('ParentUser', this.parentUserSchema);

    this.parentProfileSchema = new Schema({
        parentUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ParentUser'
        },
        name: {
            firstName: {
                type: String,
                default: ''
            },
            lastName: {
                type: String,
                default: ''
            }
        },
        email: {
            type: String,
            default: ''
        },
        gender: {
            type: Number,
            default: ''
        },
        dateOfBirth: {
            type: Date,
            default: ''
        },
        userType: {
            type: String,
            default: ''
        },
        lastLogin: {
            type: String,
            default: ''
        },
        userStatus: {
            type: String,
            default: ''
        },
        children: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ChildProfile'
        }],
        spouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ParentProfile'
        },
        spouseDetail: {
            inviteState: {
                type: Number,
                default: 0
            },
            emailId: {
                type: String,
                default: ''
            },
            phoneNumber: {
                type: Number,
                default: ''
            }
        }
    });
    this.parentProfileSchema.virtual('name.fullName').get(function () {
        var parentFullName = this.name.firstName;
        if(!(this.name.lastName == undefined || this.name.lastName == "undefined")){
            parentFullName = parentFullName + ' ' + this.name.lastName
        }
        parentFullName = parentFullName.trim();
        return parentFullName;
    });
    this.parentProfileSchema.set('toObject',{virtuals:true});
    this.parentProfileSchema.set('toJSON',{virtuals:true});
    this.parentProfileModel = mongoose.model('ParentProfile', this.parentProfileSchema);

    this.childProfileSchema = new Schema({
        name: {
            firstName: {
                type: String,
                default: ''
            },
            lastName: {
                type: String,
                default: ''
            }
        },
        dob: {
            type: Date,
            default: ''
        },
        gender: {
            type: Number,
            default: ''
        },
        schoolType: {
            type: Number,
            default: ''
        },
        classRoomLevel: {
            type: Number,
            default: ''
        }
    });
    this.childProfileSchema.virtual('name.fullName').get(function () {
        var childFullName = this.name.firstName;
        if(!(this.name.lastName == undefined || this.name.lastName == "undefined")){
            childFullName = childFullName + ' ' + this.name.lastName
        }
        childFullName = childFullName.trim();
        return childFullName;
    });
    this.childProfileSchema.set('toObject',{virtuals:true});
    this.childProfileSchema.set('toJSON',{virtuals:true});
    this.childProfileModel = mongoose.model('ChildProfile', this.childProfileSchema);

    return {
        'MetricsLogs': this.metricsLogsModel,
        'Sample': this.sampleModel,
        'ParentProfile': this.parentProfileModel,
        'ParentUser': this.parentUserModel,
        'ChildProfile': this.childProfileModel
    };
};



module.exports = new dbStructure();
