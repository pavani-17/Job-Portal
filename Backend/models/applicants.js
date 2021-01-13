const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

require('mongoose-type-email');

const educationSchema = new Schema(
    {
    instName: {
        type: String,
        required: true
    },
    startYear: {
        type: Number,
        integer: true,
        min: 0
    },
    endYear: {
        type: Number,
        integer:  true,
        min: 0
    }
    },
    {
        timestamps: true
    }
);

const ratingSchema = new Schema(
    {
        rating: {
            type: Number,
            min:0,
            max:5
        },
        recruiterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recruiter'
        }
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
    email : {
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: true,
        correctTld : true
    },
    education: [educationSchema],
    skills: [String],
    ratingCollection: [ratingSchema],
    rating: {
        type: Number,
        default: 0
    }
    },
    {
        timestamps: true
    }
);
applicantSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
var Applicants = mongoose.model('Applicant',applicantSchema);
 module.exports = Applicants;