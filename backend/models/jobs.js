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
        integer: true,
        required: true
    },
    max_positions:{
        type: Number,
        integer: true,
        required: true
    },
    rem_positions:{
        type: Number,
        integer:true,
        required: true
    },
    rem_applications: {
        type: Number,
        integer: true,
        required: true
    },
    date_posted:{
        type: Date,
        default: Date.now,
    },
    deadline:{
        type: Date,
        required: true
    },
    job_type: {
        type: String,
        required: true
    },
    job_title: {
        type: String,
        required: true
    },
    duration : {
        type: Number,
        integer:true,
        min: 0,
        max:6,
        required: true
    },
    salary: {
        type:Number,
        integer: true
    },
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
    }
    },
    {
        timestamps: true
    }
);

var Jobs = mongoose.model('Job',jobSchema);
module.exports = Jobs;