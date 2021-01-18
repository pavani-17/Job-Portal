var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const router = express.Router();
const Applicants = require('../models/applicants');
const Jobs = require('../models/jobs');
const Applications = require('../models/applications');
const { verifyRecruiter, verifyApplicant } = require('../authenticate');

router.use(bodyParser.json());


router.get('/job/:jobId', verifyRecruiter, (req,res,next) => {
    Jobs.findById(req.params.jobId)
    .then((job) => {
        if(job==null)
        {
            err = new Error('Error in Job');
            err.status = 403;
            return next(err);
        }
        if(job.user_id != req.user._id)
        {
            err = new Error('You are not authorized to delete this job');
            err.status = 403;
            return next(err);
        }
        Applications.find({job_id: req.params.jobId}).populate('user_id')
        .then((applicants) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(applicants);
        }, (err) => next(err))
        .catch((err) => next(err))
    })
});

router.post('/',verifyApplicant, (req, res, next) => {
    req.body.user_id = req.user._id;
    Applications.create(req.body)
    .then((application) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(application);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.get('/applicant/', verifyApplicant, (req, res, next) => {
    Applications.find({user_id: req.user._id}).populate('job_id')
    .then((jobs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(jobs);
    }, (err) => next(err))
    .catch((err) => next(err));
})



module.exports = router;