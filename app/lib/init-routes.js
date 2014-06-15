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



  app.all('*', users.bounce);
  app.get('/profile', dbg, users.profile);
  app.post('/logout', dbg, users.logout);

  console.log('Routes Loaded');
  fn();
}
