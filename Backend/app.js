var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');

var applicantRouter = require('./routes/applicants');
var signupRouter = require('./routes/signup');
var loginRouter = require('./routes/login');

// Connect to the database
const url = 'mongodb://localhost:27017/jobPortal';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Connected to database successfully!\n");
}, (err) => {
  console.log(err);
})

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/applicants', applicantRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });

});

module.exports = app;