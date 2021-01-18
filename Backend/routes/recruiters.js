var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const router = express.Router();
const Recruiters = require('../models/recruiters');
const { verifyRecruiter } = require('../authenticate');

router.use(bodyParser.json());

router.route('/')
.get(verifyRecruiter, (req,res,next) => {
    Recruiters.findById(req.user._id)
    .then((applicants) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(applicants);
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put(verifyRecruiter, (req, res, next) => {
    Recruiters.findByIdAndUpdate(req.user._id, {$set: req.body}, {$new:true})
    .then((recruiter) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(recruiter);
    }, (err) => next(err))
    .catch((err) => next(err));
})
module.exports = router;