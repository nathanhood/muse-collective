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
  var projects = traceur.require(__dirname + '/../routes/projects.js');
  var boards = traceur.require(__dirname + '/../routes/boards.js');

  /* Passport Configuration */
  var passport = require('passport');
  require('../config/passport')(passport); // how does communication between passport.js and init routes work?


  app.get('/', dbg, home.index);


  app.get('/register', dbg, users.registration);
  app.post('/register', dbg, passport.authenticate('local-register', {
    successRedirect : '/dashboard', // redirect to the secure profile section
    failureRedirect : '/register', // redirect back to the register page if there is an error
    failureFlash : true // allow flash messages
  }));
  app.post('/login', dbg, passport.authenticate('local-login', {
    successRedirect : '/dashboard', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the home page if there is an error
    failureFlash : true // allow flash messages
  }));
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
  })); // facebook does not provide email by default. Must add scope.
  app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
  }));
  app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect : '/dashboard',
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
  app.get('/logout', dbg, users.logout);
  app.get('/dashboard', dbg, users.dashboard);
  app.get('/users/password', dbg, users.password);
  app.post('/users/password', dbg, users.updatePassword);
  app.post('/users/updatePhoto', dbg, users.updatePhoto);

  app.get('/projects', dbg, projects.index);
  app.get('/projects/:projId', dbg, projects.show);
  app.post('/projects/create', dbg, projects.create);
  app.get('/projects/:projId/draft', dbg, projects.draft);
  app.post('/projects/:projId/draft', dbg, projects.updateDraftText);
  app.post('/projects/:projId/draftAudio', dbg, projects.updateDraftAudio);
  app.post('/projects/:projId/updateTitle', dbg, projects.updateTitle);
  app.post('/projects/:projId/destroy', dbg, projects.destroy);
  app.post('/projects/:projId/getDefinition', dbg, projects.getDefinition);
  app.post('/projects/:projId/getRelatedWords', dbg, projects.getRelatedWords);


  app.get('/boards/:boardId', dbg, boards.show);
  app.post('/boards/removeDirFile', dbg, boards.removeFileFromDirectory);
  app.post('/boards/:boardId', dbg, boards.update);
  app.post('/boards/:projId/create', dbg, boards.create);
  app.post('/boards/:boardId/destroy', dbg, boards.destroy);
  app.post('/boards/:boardId/audioContainer', dbg, boards.audioContainer);
  app.post('/boards/:boardId/photoContainer', dbg, boards.photoContainer);
  app.post('/boards/:boardId/processPhoto', dbg, boards.processPhoto);
  app.post('/boards/:boardId/processAudio', dbg, boards.processAudio);
  app.post('/boards/:boardId/retrieveDraft', dbg, boards.retrieveDraft);
  app.post('/boards/:boardId/updateTitle', dbg, boards.updateTitle);

  console.log('Routes Loaded');
  fn();
}
