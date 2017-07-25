var mongoose       = require('mongoose');
var passport       = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User           = require('../models/User.js');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOne({'googleId': profile.id}, function(err, user){
      console.log(user);
      if(err) return cb(err);
      if(user){
        console.log("found user");
        return cb(null, user);
      } else {
        console.log("creating user")
        console.log(profile)
        var newUser = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id
        });
        newUser.save(function(err){
          if(err) return cb(err);
          return cb(null, newUser);
        })
      }
    })
  }
));

passport.serializeUser(function(user, done){
  done(null, user.id)
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user)
  });
});
