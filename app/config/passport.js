'use strict';

/* load all strategies we need */
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;

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


  /* Twitter */

  passport.use(new TwitterStrategy({

    consumerKey : configAuth.twitterAuth.consumerKey,
    consumerSecret : configAuth.twitterAuth.consumerSecret,
    callbackURL : configAuth.twitterAuth.callbackURL,
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },
    // twitter will send back the token and profile
    function(req, token, refreshToken, profile, done) {

      if (!req.user) {
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Twitter
      	process.nextTick(function() {
          User.findByTwitterId(profile.id, function(err, user) {
            // if there is an error (connecting to database), stop everything and return error
            if(err){
              return done(err);
            }

    			  // if the user is found then log them in
            if(user){
              return done(null, user); // user found, return that user
            } else {
              var newUser = new User();

    				  // set all of the user data that we need
              newUser.twitter.id = profile.id;
              newUser.twitter.token = token;
              newUser.twitter.username = profile.username;
              newUser.twitter.displayName = profile.displayName;

    				  // save our user into the database
              newUser.save(function(err) {
                if(err){
                  throw err;
                }
                return done(null, newUser);
              });
            }
          });
        });
      } else {
        process.nextTick(function() {
          // user already exists and is logged in, we have to link accounts
          var user = req.user; // pull the user out of the session

          // update the current users facebook credentials
          user.twitter.id = profile.id;
          user.twitter.token = token;
          user.twitter.username = profile.username;
          user.twitter.displayName = profile.displayName;

          // save the user
          user.save(function(err) {
            if(err){
              throw err;
            }
            return done(null, user);
          });
        });
      }
    }
  ));



  /* FACEBOOK */

  passport.use(new FacebookStrategy({

		// pull in our app id and secret from our auth.js file
    clientID : configAuth.facebookAuth.clientID,
    clientSecret : configAuth.facebookAuth.clientSecret,
    callbackURL : configAuth.facebookAuth.callbackURL,
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },
    // facebook will send back the token and profile
    function(req, token, refreshToken, profile, done) {

      // check if the user is already logged in
      if (!req.user) {
        // asynchronous
        process.nextTick(function(){
          // find the user in the database based on their facebook id
          User.findByFacebookId(profile.id, function(err, user){
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
              newUser.facebook.displayName = profile.name.givenName + ' ' + profile.name.familyName;
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
      } else {
        process.nextTick(function(){
          // user already exists and is logged in, we have to link accounts
  	      var user = req.user; // pull the user out of the session

  				// update the current users facebook credentials
          user.facebook.id = profile.id;
          user.facebook.token = token;
          user.facebook.displayName = profile.name.givenName + ' ' + profile.name.familyName;
          user.facebook.email = profile.emails[0].value;

  				// save the user
          user.save(function(err) {
            if(err){
              throw err;
            }
            return done(null, user);
          });
        });
      }
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

    if (!req.user) {
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
    } else {
      process.nextTick(function(){
        User.findByEmail(email, function(err, user){

          if(err){
            return done(err);
          }

          if(user){
            return done(null, false, req.flash('registerMessage', 'That email is already taken.'));
          } else {
            var existingUser = req.user; // pull the user out of the session

            existingUser.local.email = email;
            existingUser.local.password = existingUser.generateHash(password);

            existingUser.save(function(err){
              if(err){
                throw err;
              }
              return done(null, existingUser);
            });
          }
        });
      });
    }
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


  /* ================== INVITE CONFIRMATION LOCAL REGISTER & LOGIN ================ */

  /* Local Registration */

  // Using named strategies since we have login & register
    // by default, if there was no name, it would just be called 'local'
  passport.use('invite-local-register', new LocalStrategy({
    // by default, local strategy uses username and password. Overriding with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },

  function(req, email, password, done){
    // console.log('============ REQ =========== ');
    // console.log(req.params);
    // console.log(email);
    // console.log(password);
    req.flash('registerMessage', '');

    // if (!req.user) {
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

        /* =========== DUPLICATED REGISTER AND LOGIN FOR SESSION ========== */
              req.session.projId = req.params.projId;

            newUser.save(function(err){
              if(err){
                throw err;
              }
              return done(null, newUser);
            });
          }
        });
      });
    // } else {
    //   process.nextTick(function(){
    //     User.findByEmail(email, function(err, user){
    //
    //       if(err){
    //         return done(err);
    //       }
    //
    //       if(user){
    //         return done(null, false, req.flash('registerMessage', 'That email is already taken.'));
    //       } else {
    //         var existingUser = req.user; // pull the user out of the session
    //
    //         existingUser.local.email = email;
    //         existingUser.local.password = existingUser.generateHash(password);
    //
    //         existingUser.save(function(err){
    //           if(err){
    //             throw err;
    //           }
    //           return done(null, existingUser);
    //         });
    //       }
    //     });
    //   });
    // }
  }));


  /* Local Login */

  passport.use('invite-local-login', new LocalStrategy({
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

      req.session.projId = req.params.projId;
      
      return done(null, user);
    });
  }));


};
