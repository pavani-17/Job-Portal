var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const router = express.Router();
const Jobs = require('../models/jobs');
const Recruiters = require('../models/recruiters');
const authenticate = require('../authenticate');
const Applications = require('../models/applications');
const Applicants = require('../models/applicants');

router.get('/',authenticate.verifyApplicant, (req, res, next) => {
    Jobs.find({}).populate('user_id')
    .then((jobs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(jobs);
    },(err) => next(err))
    .catch((err) => next(err));
});

router.post('/', authenticate.verifyRecruiter, (req,res,next) => {
    req.body.user_id = req.user._id;
    req.body.rem_applications = req.body.max_applications;
    req.body.rem_positions = req.body.max_positions;
    Jobs.create(req.body)
    .then((job) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(job);
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.delete('/:jobId',authenticate.verifyRecruiter, (req, res, next) => {
    Jobs.findById(req.params.jobId)
    .then((job) => {
        if(job!= null && job.user_id.toString() != req.user._id.toString())
        {
            err = new Error('You are not authorized to delete this job');
            err.status = 403;
            return next(err);
        }
        Applications.find({job_id : req.params.jobId, status:"Selected"}).populate('user_id')
        .then((applications) => {
            console.log(applications);
            var col_id = applications.map((appl) => {
                return appl.user_id._id;
            })
            Applicants.updateMany({"_id" : {"$in" : col_id}}, {"selected": false})
            .then(() => {
                status_ar = ["Applied", "Shortlisted"];
                Applications.find({job_id: req.params.jobId, status: {"$in": status_ar }}).populate('user_id')
                .then((applications) => {
                    var col_id = applications.map((appl) => {
                        return appl.user_id._id;
                    })
                    Applicants.updateMany({"_id" : {"$in" : col_id}}, {$inc: {"num_applications" : -1}})
                    .then(() => {
                        Applications.deleteMany({job_id : req.params.jobId})
                        .then(() => {
                            Jobs.findByIdAndRemove(req.params.jobId)
                            .then((job) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type','application/json');
                                res.json(job);
                            }, (err) => next(err))
                            .catch((err) => next(err));
                        },(err) => next(err))
                        .catch((err) => next(err));
                    }, err => next(err))
                    .catch((err) => next(err))
                }, (err) => next(err))
                .catch((err) => next(err))
            }, (err) => next(err))
            .catch(err => next(err))
        }, (err) => next(err))
        .catch((err) => next(err))
    }, (err) => next(err))
    .catch((err) => next(err));
    
});

router.put('/:jobId', authenticate.verifyRecruiter, (req, res, next) => {
    Jobs.findById(req.params.jobId)
    .then((job) => {
        if(job!= null && job.user_id.toString() != req.user._id.toString())
        {
            err = new Error('You are not authorized to edit this job');
            err.status = 403;
            return next(err);
        }
        if((job.max_applications-job.rem_applications > req.body.max_applications) || (job.max_positions - job.rem_positions >= req.body.max_positions))
        {
            err = new Error('Positions/Applications are less than the people already accepted/applied');
            err.status = 500;
            return next(err);
        }
        req.body.rem_applications = req.body.max_applications - job.max_applications + job.rem_applications;
        req.body.rem_positions = req.body.max_positions - job.max_positions + job.rem_positions;
        Jobs.findByIdAndUpdate(req.params.jobId, { $set: req.body}, {new: true})
        .then((job) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(job);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
    
});

router.post('/rateJob/:jobId', authenticate.verifyApplicant, (req, res, next) => {
    Applications.findById(req.body.application_id)
    .then((application)=> {
        console.log(application);
        if(application.rated === true)
        {
            err = new Error('You have already rated this job');
            err.status = 403;
            return next(err);
        }
        Jobs.findById(req.params.jobId)
        .then((response) => {
            response.num_rating = response.num_rating + 1;
            response.sum_rating = response.sum_rating + parseInt(req.body.rating);
            response.rating = response.sum_rating/ response.num_rating;
            Jobs.findByIdAndUpdate(req.params.jobId, {$set: response}, {new: true})
            .then((response) => {
                Applications.findByIdAndUpdate(application._id, {rated:true})
                .then(() =>
                {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                },(err) => next(err))
                .catch((err) => next(err))
            }, (err) => next(err) )
            .catch((err) => next(err))
        }, (err) => next(err))
        .catch((err) => next(err))
    }, (err) => next(err))
    .catch((err) => next(err))    
})

router.get('/recruiter',authenticate.verifyRecruiter, (req,res, next) => {
    Jobs.find({user_id:req.user._id})
    .then((jobs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(jobs);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;