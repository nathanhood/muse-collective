/* jshint unused:false */

'use strict';

var traceur = require('traceur');
var Project = traceur.require(__dirname + '/../../app/models/project.js');
var Board = traceur.require(__dirname + '/../../app/models/board.js');
var User = traceur.require(__dirname + '/../../app/models/user.js');
var _ = require('lodash');


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
  User.findById(req.user._id, (err, user)=>{
    Project.create(obj, project=>{
      user.addProject(project._id, ()=>{
        if(project.status === 'brainstorming'){
          var obj = project;
          obj.projId = obj._id;
          obj = _.omit(obj, '_id').valueOf();
          Board.create(obj, board=>{
            project.addBoardId(board._id, ()=>{
              user.save(()=>{
                project.save(()=>{
                  res.redirect(`/boards/${board._id}`);
                });
              });
            });
          });
        } else {
            res.redirect(`/projects/${project._id}`);
        }
      });
    });
  });
};

exports.destroy = (req, res)=>{
  res.redirect('/home');
};
