const express = require('express');
const router = express.Router();
const passport = require('passport');
var bodyParser = require('body-parser');
const authenticate = require('../authenticate');

router.use(bodyParser.json());

router.post('/applicant',passport.authenticate('applicant'), (req,res) => {
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.post('/recruiter',passport.authenticate('recruiter'), (req,res) => {
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

module.exports = router;