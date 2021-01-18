var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const router = express.Router();
const Applicants = require('../models/applicants');
const { verifyApplicant } = require('../authenticate');

router.use(bodyParser.json());

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

module.exports = router;