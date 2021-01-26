var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const { verifyRecruiter } = require('../authenticate');

const router = express.Router();

router.get('/:appId', function(req, res){
    const file = `${__dirname}/resume/${req.params.appId}.pdf`;
    res.download(file);
});

module.exports = router