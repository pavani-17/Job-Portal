const { application } = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var applicationScheme = new Schema({
    job_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Job'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Applicant'
    },
    sop: {
        type : String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    rated: {
        type: Boolean,
        default: false
    },
    joining_date: {
        type: Date,
        default: null
    }
});

applicationScheme.index({job_id:1, user_id:1, sop:0, status:0});
var Applications = mongoose.model('Application',applicationScheme);
module.exports = Applications;