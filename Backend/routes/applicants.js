var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const router = express.Router();
const Applicants = require('../models/applicants');

router.use(bodyParser.json());

router.route('/')
.get((req,res,next) => {
    Applicants.find({})
    .then((applicants) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(applicants);
    }, (err) => next(err))
    .catch((err) => next(err))
});

module.exports = router;