'use strict';

/* load all strategies we need */
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

/* load the user model */
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var _ = require('lodash');

/* load the authorization variables (Facebook, Twitter, Google, etc) */
var configAuth = require('./oauth');


module.exports = function(passport){

  // required for persistent login sessions
  // passport needs ability to serialize and unserialize user in and out of session
  // user information stored in req.user. Available in Jade as user
  passport.serializeUser(function(user, done) {
    done(null, user._id, user.email);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
      done(null, user);
    });
  });


  /* FACEBOOK */

  passport.use(new FacebookStrategy({

		// pull in our app id and secret from our auth.js file
    clientID : configAuth.facebookAuth.clientID,
    clientSecret : configAuth.facebookAuth.clientSecret,
    callbackURL : configAuth.facebookAuth.callbackURL
  },
  // facebook will send back the token and profile
    function(token, refreshToken, profile, done){

      // asynchronous
      process.nextTick(function(){
        // find the user in the database based on their facebook id
        User.findByFacebookId(profile.id, function(err, user){
          console.log('==============USER==============');
          console.log(user);
          // if there is an error (connecting to database), stop everything and return error
          if(err){
            return done(err);
          }

          if(user){
            return done(null, user);
          } else {
            var newUser = new User();
            newUser.facebook.id = profile.id; // set the users facebook id
            newUser.facebook.token = token; // token that facebook provides user
            newUser.facebook.firstName = profile.name.givenName;
            newUser.facebook.lastName = profile.name.familyName;
            newUser.facebook.email = profile.emails[0].value; // facebook may return multiple emails

            newUser.save(function(err){
              if(err){
                throw err;
              }
              return done(null, newUser);
            });
          }
        });
      });
    }
  ));


  /* Local Registration */

  // Using named strategies since we have login & register
    // by default, if there was no name, it would just be called 'local'
  passport.use('local-register', new LocalStrategy({
    // by default, local strategy uses username and password. Overriding with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },

  function(req, email, password, done){

    req.flash('registerMessage', '');
    //asynchronous
    //User.findOne won't fire unless data is sent back
    process.nextTick(function(){
      User.findByEmail(email, function(err, user){

        if(err){
          return done(err);
        }

        if(user){
          return done(null, false, req.flash('registerMessage', 'That email is already taken.'));
        } else {
          var newUser = new User();

          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);

          newUser.save(function(err){
            if(err){
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));


  /* Local Login */

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done){

    User.findByEmail(email, function(err, user){

      if(user){
        user = _.create(User.prototype, user);
      }

      if(err){
        return done(err);
      }

      if(!user){
        return done(null, false, req.flash('loginMessage', 'No user found.')); // setting flash data
      }

      if(!user.validPassword(password)){
        return done(null, false, req.flash('loginMessage', 'Incorrect password.'));
      }

      // if all is well, return successful user
      return done(null, user);
    });
  }));

};
