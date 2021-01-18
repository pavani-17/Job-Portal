var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const router = express.Router();
const Jobs = require('../models/jobs');
const Recruiters = require('../models/recruiters');
const authenticate = require('../authenticate');
const Applications = require('../models/applications');

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
        Jobs.findByIdAndRemove(req.params.jobId)
        .then((job) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(job);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
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

router.get('/:recId',authenticate.verifyRecruiter, (req,res, next) => {
    if(req.params.recId.toString() != req.user._id.toString())
    {
        err = new Error('You are not authorized for this operation');
        err.status = 403;
        return next(err);
    }
    Jobs.find({user_id:req.params.recId})
    .then((jobs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(jobs);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;