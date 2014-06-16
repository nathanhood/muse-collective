'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;


module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  /* Bringing in middleware to pass into route file */
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');

  /* Passport Configuration */
  var passport = require('passport');
  require('../config/passport')(passport); // how does communication between passport.js and init routes work?


  app.get('/', dbg, home.index);


  app.get('/register', dbg, users.registration);
  app.post('/register', dbg, passport.authenticate('local-register', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/register', // redirect back to the register page if there is an error
    failureFlash : true // allow flash messages
  }));
  app.post('/login', dbg, passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the home page if there is an error
    failureFlash : true // allow flash messages
  }));
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
  })); // facebook does not provide email by default. Must add scope.
  app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));
  app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect : '/profile',
			failureRedirect : '/'
	}));


  // =============================================================================
  // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
  // =============================================================================

	// locally --------------------------------
	app.get('/connect/local', function(req, res) {
		res.render('users/connect-local', { message: req.flash('registerMessage') });
	});
	app.post('/connect/local', passport.authenticate('local-register', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/connect/local', // redirect back to the register page if there is an error
		failureFlash : true // allow flash messages
	}));

	// facebook -------------------------------
	// send to facebook to do the authentication
	app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));
	// handle the callback after facebook has authorized the user
	app.get('/connect/facebook/callback',
		passport.authorize('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
	}));

	// twitter --------------------------------
	// send to twitter to do the authentication
	app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));
	// handle the callback after twitter has authorized the user
	app.get('/connect/twitter/callback',
		passport.authorize('twitter', {
			successRedirect : '/profile',
			failureRedirect : '/'
	}));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', function(req, res) {
      var user            = req.user;
      user.local.email    = undefined;
      user.local.password = undefined;
      user.save(function(err) {
          res.redirect('/profile');
      });
  });

  // facebook -------------------------------
  app.get('/unlink/facebook', function(req, res) {
      var user            = req.user;
      user.facebook.token = undefined;
      user.save(function(err) {
          res.redirect('/profile');
      });
  });

  // twitter --------------------------------
  app.get('/unlink/twitter', function(req, res) {
      var user           = req.user;
      user.twitter.token = undefined;
      user.save(function(err) {
         res.redirect('/profile');
      });
  });



  app.all('*', users.bounce);
  app.get('/profile', dbg, users.profile);
  app.post('/logout', dbg, users.logout);
  app.get('/users/password', dbg, users.password);
  app.post('/users/password', dbg, users.updatePassword);

  console.log('Routes Loaded');
  fn();
}
