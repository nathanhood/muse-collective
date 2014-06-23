/* jshint unused:false */

'use strict';

var traceur = require('traceur');
var Project = traceur.require(__dirname + '/../../app/models/project.js');
var Board = traceur.require(__dirname + '/../../app/models/board.js');
var User = traceur.require(__dirname + '/../../app/models/user.js');
var _ = require('lodash');
var moment = require('moment');


exports.index = (req, res)=>{
  res.render('projects/index', {title:'View Projects'});
};

exports.show = (req, res)=>{
  Project.findById(req.params.projId, (err, project)=>{
    Board.findAllByProjectId(project._id, boards=>{
      boards = boards.map(board=>{
        board.dateCreated = moment(board.dateCreated).format('MMMM Do YYYY');
        return board;
      });
      res.render('projects/show', {boards:boards, project:project, title:`MC: ${project.title}`});
    });
  });
};

exports.draft = (req, res)=>{
  Project.findById(req.params.projId, (err, project)=>{
    res.render('projects/draft', {project:project, title:'MC: Working Draft'});
  });
};

exports.updateDraftText = (req, res)=>{
  Project.findById(req.params.projId, (err, project)=>{
    project.updateDraftText(req.body, ()=>{
      project.save(()=>{
        res.render('projects/save-confirmation', {project:project});
      });
    });
  });
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
          var boardObj = project;
          boardObj.projId = boardObj._id;
          boardObj = _.omit(boardObj, '_id').valueOf();
          Board.create(boardObj, board=>{
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

exports.getDefinition = (req, res)=>{
  res.render('projects/dictionary', {definitions:req.body.data});
};

exports.getRelatedWords = (req, res)=>{
  res.render('projects/related-words', {data:req.body.data});
};
