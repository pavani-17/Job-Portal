var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
const path = require('path');

const router = express.Router();
const Applicants = require('../models/applicants');
const { verifyApplicant, verifyRecruiter } = require('../authenticate');

const textFileFiler = (req, file, cb) => {
    if(!file.originalname.match(/\.(pdf|docx|txt)$/)) {
        return cb(new Error('You can upload only text files!'), false);
    }
    cb(null, true);
};

const storage = multer.diskStorage({
    destination: function(req, res, cb) {
        cb(null,__dirname + '/resume');
    },
    filename: function(req, file, cb){
        cb(null, req.user._id + path.extname(file.originalname));
    }
})

const upload = multer({storage: storage, fileFilter: textFileFiler });

router.route('/')
.post(verifyApplicant, upload.single('textFile'), (req, res) => {
    Applicants.findByIdAndUpdate(req.user._id, {resume: true})
    .then(() => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
    }, (err) => next(err))
    .catch((err) => next(err));
    
})

module.exports = router