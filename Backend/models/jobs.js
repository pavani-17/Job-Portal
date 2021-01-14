const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter'
    },
    skills: [String],
    max_applications: {
        type: Number,
        integer: true
    },
    max_positions:{
        type: Number,
        integer: true
    },
    date_posted:{
        type: Date,
        default: Date.now,
    },
    deadline:{
        type: Date
    },
    job_type: {
        type: String
    },
    job_title: {
        type: String
    },
    duration : {
        type: Number,
        integer:true,
        min: 0,
        max:6
    },
    salary: {
        type:Number,
        integer: true
    },
    rating: {
        type: Number,
        default: 0
    }
    },
    {
        timestamps: true
    }
);

var Jobs = mongoose.model('Job',jobSchema);
module.exports = Jobs;