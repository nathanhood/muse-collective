'use strict';

var passport = require('passport');
require('../config/passport')(passport);


exports.registration = (req, res)=>{
  if(!req.user){
    res.render('users/register', {title: 'Registration', message: req.flash('registerMessage')});
  } else {
    res.redirect('/');
  }
};

exports.logout = (req, res)=>{
  req.logout();
  res.redirect('/');
};

exports.bounce = (req, res, next)=>{
  if(req.isAuthenticated()){ //
    return next();
  }
  res.redirect('/');
};

exports.profile = (req, res)=>{
  res.render('users/profile', {user: req.user, title: 'Profile'});
};
