const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

require('mongoose-type-email');

const recruiterSchema = new Schema({
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
    phone : {
        type: Number,
    },
    bio: {
        type: String,
    }
    },
    {
        timestamps: true
    }
);

recruiterSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
var Recruiters = mongoose.model('Recruiter',recruiterSchema);
module.exports = Recruiters;