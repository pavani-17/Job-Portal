const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Applicants = require('./models/applicants');
const Recruiters = require('./models/recruiters');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); 

secretKey = '16578-43790-38450-63720';

passport.use('applicant', new LocalStrategy({usernameField: 'email'},Applicants.authenticate()));
passport.use('recruiter',new LocalStrategy({usernameField: 'email'},Recruiters.authenticate()));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
if(user!=null)
    done(null,user);
});

exports.getToken = function(val) {
    return jwt.sign(val, secretKey,
        {expiresIn: "12h"});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;

passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        Applicants.findOne({_id: jwt_payload._id}, (err, applicant) => {
            if (applicant) {
                return done(err, false);
            }
            else if (applicant) {
                return done(null, applicant);
            }
            else {
                return done(null, false);
            }
        });
    })
);

exports.verifyApplicant = passport.authenticate('jwt', {session: false});