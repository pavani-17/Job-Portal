const express = require('express');
const router = express.Router();
const passport = require('passport');
var bodyParser = require('body-parser');

const Applicants = require('../models/applicants');

router.use(bodyParser.json());

router.post('/applicant', (req, res, next) => {
  password = req.body.password;
  delete req.body.password;
  Applicants.register(new Applicants(req.body),password, (err, applicant) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
    }
  });
});

module.exports = router
