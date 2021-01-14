var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const router = express.Router();
const Jobs = require('../models/jobs');
const authenticate = require('../authenticate');
secretKey = '16578-43790-38450-63720';

router.get('/',(req, res, next) => {
    Jobs.find({})
    .then((jobs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(jobs);
    },(err) => next(err))
    .catch((err) => next(err));
});

router.post('/', authenticate.verifyRecruiter, (req,res,next) => {
    req.body.user_id = req.user._id;
    Jobs.create(req.body)
    .then((job) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(job);
    }, (err) => next(err))
    .catch((err) => next(err));
})

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