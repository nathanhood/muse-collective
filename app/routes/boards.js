'use strict';

var traceur = require('traceur');
var Project = traceur.require(__dirname + '/../../app/models/project.js');
var Board = traceur.require(__dirname + '/../../app/models/board.js');


exports.show = (req, res)=>{
  res.render('boards/show', {title:'Board'});
};

exports.create = (req, res)=>{
  Project.findById(req.body._id, (err, project)=>{
    Board.create(project, board=>{
      res.send(board);
    });
  });
};

exports.update = (req, res)=>{
  // res.redirect(`/projects/${project._id}`);
};

exports.destroy = (req, res)=>{
  // res.redirect(`/projects/${project._id}`);
};
