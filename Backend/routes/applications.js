var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const router = express.Router();
const Applicants = require('../models/applicants');
const Jobs = require('../models/jobs');
const Applications = require('../models/applications');
const { verifyRecruiter, verifyApplicant } = require('../authenticate');
const { application } = require('express');

router.use(bodyParser.json());


router.get('/job/:jobId', verifyRecruiter, (req,res,next) => {
    Jobs.findById(req.params.jobId).populate('user_id')
    .then((job) => {
        if(job==null)
        {
            err = new Error('Error in Job');
            err.status = 403;
            return next(err);
        }
        if(job.user_id._id.toString() !== req.user._id.toString())
        {
            err = new Error('You are not authorized to get these details');
            err.status = 400;
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
    Jobs.findById(req.body.job_id)
    .then(response => {
        console.log(response);
        if(response.rem_applications == 0)
        {
            err = new Error('Already reached maximum number of applications');
            err.status = 403;
            return next(err);
        }
        Applicants.findById(req.user._id)
        .then((result) => {
            console.log(result.num_applications);
            if(result.num_applications >= 10)
            {
                console.log("Here I am");
                err = new Error('Already have 10 pending applications');
                err.status = 403;
                return next(err);
            }
            if(result.selected === true)
            {
                err = new Error('Already have a job');
                err.status = 403;
                return next(err);
            }
            Applicants.findByIdAndUpdate(req.user._id, {$inc : {"num_applications" : 1}}, {new: true})
            .then((appl) => 
            {
                Jobs.findByIdAndUpdate(req.body.job_id, {$inc: {"rem_applications" : -1}}, {new: true})
                .then((job) => {
                    Applications.create(req.body)
                    .then((application) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(application);
                    }, (err) => next(err))
                    .catch((err) => next(err));
                }, (err) => next(err))
                .catch((err) => next(err))
            }, (err) => next(err))
            .catch((err) => next)

        }, (err) => next(err))
        .catch((err) => next(err))
    },(err) => next(err))
    .catch((err) => next)
});

router.get('/applicant/', verifyApplicant, (req, res, next) => {
    Applications.find({user_id: req.user._id}).populate({path :'job_id', populate:{path: 'user_id'}})
    .then((jobs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(jobs);
    }, (err) => next(err))
    .catch((err) => next(err));
})

// router.put('/:appId', verifyRecruiter, (req, res, next) => {
//     if(req.body.status.toString() === "Rejected" || req.body.status.toString() === "Selected")
//     {
//         console.log("came here");
//         Applications.findById(req.params.appId).populate('user_id')
//         .then((application) => {
//             Applicants.findByIdAndUpdate(application.user_id._id, {$inc : {"num_applications" : -1}});
//         })
//         .catch((err) => console.log(err));
//     }
//     if(req.body.status.toString() === "Selected")
//     {
//         console.log("came here")
//         Applications.findById(req.params.appId)
//         .then((application) => {
//             Jobs.findByIdAndUpdate(application.job_id, {$inc: {"rem_positions": -1}});
//         })
//     }
//     Applications.findByIdAndUpdate(req.params.appId,{status: req.body.status}, {new: true})
//     .then((application) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(application);
//     }, (err) => next(err))
//     .catch((err) => next(err))
// })

router.put('/:appId', verifyRecruiter, (req, res, next) => {
    if(req.body.status.toString() === "Selected")
    {
        Applications.findById(req.params.appId).populate('user_id')
        .then((application) => {
            Applicants.findByIdAndUpdate(application.user_id._id, {num_applications : 0, selected: true})
            .then(() => {
                Applications.findById(req.params.appId)
                .then((application) => {
                    Jobs.findByIdAndUpdate(application.job_id, {$inc: {"rem_positions": -1}})
                    .then(() => {
                        var cur_date = Date.now();
                        Applications.updateMany({user_id: application.user_id}, {status: "Rejected"})
                        .then(() => {
                            Applications.findByIdAndUpdate(req.params.appId,{$set: {"status": req.body.status, "joining_date": cur_date}}, {new: true})
                            .then((application) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(application);
                            }, (err) => next(err))
                            .catch((err) => next(err))
                        }, (err) => next(err))
                        .catch((err) => next(err))
                    },(err) => next(err))
                    .catch((err) => next(err))
                },(err) => next(err))
                .catch((err) => next(err))
            },(err) => next(err))
            .catch((err) => next(err))
        },(err) => next(err))
        .catch((err) => next(err));
    }
    else if(req.body.status.toString() === "Rejected")
    {
        console.log("came here");
        Applications.findById(req.params.appId).populate('user_id')
        .then((application) => {
            Applicants.findByIdAndUpdate(application.user_id._id, {$inc : {"num_applications" : -1}})
            .then(() => {
                    Applications.findByIdAndUpdate(req.params.appId,{status: req.body.status}, {new: true})
                    .then((application) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(application);
                    }, (err) => next(err))
                    .catch((err) => next(err))
            },(err) => next(err))
            .catch((err) => next(err))
        },(err) => next(err))
        .catch((err) => next(err))
    }
    else
    {
        Applications.findByIdAndUpdate(req.params.appId,{status: req.body.status}, {new: true})
        .then((application) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(application);
        }, (err) => next(err))
        .catch((err) => next(err))
    }
})

module.exports = router;