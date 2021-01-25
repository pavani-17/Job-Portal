var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
const path = require('path');

const router = express.Router();
const { verifyApplicant, verifyRecruiter } = require('../authenticate');
const Applicants = require('../models/applicants');

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const storage = multer.diskStorage({
    destination: function(req, res, cb) {
        cb(null,__dirname + '/profilePic');
    },
    filename: function(req, file, cb){
        cb(null, req.user._id + path.extname(file.originalname));
    }
})

const upload = multer({storage: storage });

router.route('/')
.post(verifyApplicant, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})

module.exports = router