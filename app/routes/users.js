'use strict';

// var passport = require('passport');
// require('../config/passport')(passport);
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../../app/models/user.js');


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

exports.password = (req, res)=>{
  res.render('users/password', {message: req.flash('passwordMessage'), title: 'Change Password'});
};

exports.updatePassword = (req, res)=>{
  User.findById(req.user._id, (err, user)=>{
    user.changePassword(req.body, (err)=>{
      if(err){
        req.flash('passwordMessage', 'Current password is incorrect. Please try again.');
        res.redirect('/users/password');
      }else{
        user.save(()=>{res.redirect('/profile');});
      }
    });
  });
};
