'use strict';

// var traceur = require('traceur');
// var User = traceur.require(__dirname + '/../../app/models/user.js');


exports.index = (req, res)=>{
  res.render('projects/index', {title:'Project'});
};

exports.edit = (req, res)=>{
  res.render('projects/draft', {title:'Working Draft'});
};

exports.update = (req, res)=>{
  // res.redirect(`/projects/${project._id}`);
};

exports.create = (req, res)=>{
  // res.redirect(`/projects/${project._id}`);
};

exports.destroy = (req, res)=>{
  res.redirect('/home');
};
