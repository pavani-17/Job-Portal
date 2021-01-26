const express = require('express');
const router = express.Router();
const passport = require('passport');
var bodyParser = require('body-parser');

const Applicants = require('../models/applicants');
const Recruiters = require('../models/recruiters');

router.use(bodyParser.json());

router.post('/applicant', (req, res, next) => {
  var password = req.body.password;
  delete req.body.password;
  Applicants.register(new Applicants(req.body),password, (err, applicant) => {
    if(err) {
      console.log(err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Registration Successful!'});
    }
  });
});
router.post('/recruiter', (req, res, next) => {
  var password = req.body.password;
  delete req.body.password;
  Recruiters.register(new Recruiters(req.body),password, (err, recruiter) => {
    if(err) {
      console.log(err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Registration Successful!'});
    }
  });
});

module.exports = router
