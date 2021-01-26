var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
const path = require('path');

const router = express.Router();
const Applicants = require('../models/applicants');
const { verifyApplicant, verifyRecruiter } = require('../authenticate');
const Applications = require('../models/applications');


router.route('/')
.get(verifyApplicant, (req,res,next) => {
    Applicants.findById(req.user._id)
    .then((applicants) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(applicants);
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put(verifyApplicant, (req, res, next) => {
    Applicants.findByIdAndUpdate(req.user._id, {$set: req.body}, {new: true})
    .then((applicant)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(applicant);
    }, (err) => next(err))
    .catch((err) => next(err));
})
router.route('/rateApplicant')
.post(verifyRecruiter, (req, res, next) => {
    Applications.findById(req.body.application_id)
    .then((app) => {
        if(app.rated_user === true)
        {
            err = new Error('You have already rated this applicant');
            err.status = 403;
            return next(err);
        }
        Applicants.findById(app.user_id)
        .then((response) => {
            response.num_rating = response.num_rating + 1;
            response.sum_rating = response.sum_rating + parseInt(req.body.rating);
            response.rating = response.sum_rating/ response.num_rating;
            Applicants.findByIdAndUpdate(app.user_id, {$set: response}, {new: true})
            .then((user) => {
                Applications.findByIdAndUpdate(app._id, {rated_user:true})
                .then(() => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(user);
                },(err) => next(err))
                .catch((err) => next(err))
            }, (err) => next(err) )
            .catch((err) => next(err))
        }, (err) => next(err))
        .catch((err) => next(err))
    }, (err) => next(err))
    .catch((err) => next(err))    
});


module.exports = router;