const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

require('mongoose-type-email');

const educationSchema = new Schema(
    {
    education_name: {
        type: String,
        required: true
    },
    education_start: {
        type: Number,
        integer: true,
        min: 0
    },
    education_end: {
        type: Number,
        integer:  true,
        min: 0
    }
    },
    {
        timestamps: true
    }
);

const applicantSchema = new Schema(
    {
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true
    },
    num_applications:{
        type: Number,
        default: 0
    },
    email : {
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: true,
        correctTld : true
    },
    education: [educationSchema],
    skills: [String],
    rating: {
        type: Number,
        default: 0
    },
    num_rating: {
        type: Number,
        default: 0
    },
    sum_rating: {
        type: Number,
        default: 0
    },
    selected: {
        type: Boolean,
        default: false
    },
    resume: {
        type: Boolean,
        default: false
    },
    profilePic: {
        type: Boolean,
        default: true
    }
    },
    {
        timestamps: true
    },
);
applicantSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
var Applicants = mongoose.model('Applicant',applicantSchema);
module.exports = Applicants;