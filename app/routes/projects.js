/* jshint unused:false */

'use strict';

var traceur = require('traceur');
var Project = traceur.require(__dirname + '/../../app/models/project.js');
var Board = traceur.require(__dirname + '/../../app/models/board.js');


exports.index = (req, res)=>{
  res.render('projects/index', {title:'View Projects'});
};

exports.show = (req, res)=>{
  res.render('projects/show', {title:'Project'});
};

exports.edit = (req, res)=>{
  res.render('projects/draft', {title:'Working Draft'});
};

exports.update = (req, res)=>{
  // res.redirect(`/projects/${project._id}`);
};

exports.create = (req, res)=>{
  var obj = req.body;
  obj.userId = req.user._id;
  if(obj.title === ''){
    obj.title = 'Untitled';
  }
  Project.create(obj, project=>{
    if(project.status === 'brainstorming'){
      Board.create(project, board=>{
        res.redirect(`/boards/${board._id}`);
      });
    } else {
      res.redirect(`/projects/${project._id}`);
    }
  });
};

exports.destroy = (req, res)=>{
  res.redirect('/home');
};
