/* jshint unused:false */

'use strict';

var traceur = require('traceur');
var Project = traceur.require(__dirname + '/../../app/models/project.js');
var Board = traceur.require(__dirname + '/../../app/models/board.js');
var User = traceur.require(__dirname + '/../../app/models/user.js');
var _ = require('lodash');
var moment = require('moment');
var multiparty = require('multiparty');


exports.index = (req, res)=>{
  Project.findAllByUserId(req.user._id, (projects)=>{
    console.log(projects);
    if(projects.length > 0){
      projects = projects.map(project=>{
        project.dateCreated = moment(project.dateCreated).format('MMMM Do YYYY');
        return project;
      });
      res.render('projects/index', {projects:projects, title:'View Projects'});
    }else{
      res.redirect('/dashboard');
    }
  });
};

exports.show = (req, res)=>{
  Project.findById(req.params.projId, (err, project)=>{
    User.findById(project.userId, (err, creator)=>{
      User.findAllById(project.collaborators, (collaborators)=>{
        Board.findAllByProjectId(project._id, boards=>{
          boards = boards.map(board=>{
            board.dateCreated = moment(board.dateCreated).format('MMMM Do YYYY');
            return board;
          });
          res.render('projects/show', {boards:boards, project:project, user:req.user, creator:creator,
            collaborators:collaborators, title:`MC: ${project.title}`, inviteConfirm:req.flash('invitationConfirmation')});
        });
      });
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

exports.updateDraftAudio = (req, res)=>{
  var form = new multiparty.Form();
  form.parse(req, (err, fields, files)=>{
    Project.findById(req.params.projId, (err, project)=>{
      project.updateDraftAudio(files.audio[0], ()=>{
        project.save(()=>{
          res.redirect(`/projects/${project._id}`);
        });
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
            res.redirect(`/projects/${project._id}/draft`);
        }
      });
    });
  });
};

exports.destroy = (req, res)=>{
  Project.findById(req.params.projId, (err, project)=>{
    project.destroy(()=>{
      res.send({});
    });
  });
};

exports.getDefinition = (req, res)=>{
  res.render('projects/dictionary', {definitions:req.body.data});
};

exports.getRelatedWords = (req, res)=>{
  res.render('projects/related-words', {data:req.body.data});
};

exports.updateTitle = (req, res)=>{
  Project.findById(req.params.projId, (err, project)=>{
    project.updateTitle(req.body, ()=>{
      project.save(()=>{
        res.send();
      });
    });
  });
};

exports.inviteCollaborator = (req, res)=>{
  var projId = req.params.projId;
  Project.inviteCollaborator(projId, req.body, ()=>{
    req.flash('invitationConfirmation', 'Your invitation was sent successfully!');
    res.redirect(`/projects/${projId}`);
  });
};

exports.confirmInvite = (req, res)=>{
  res.render('users/invite-login', {projId:req.params.projId, title:'MC: Confirm Invitation'});
};

exports.inviteConfirmRedirect = (req, res)=>{
  var userId = req.user._id;
  var projId = req.session.projId;
  Project.findById(projId, (err, project)=>{
    project.addCollaborator(userId, ()=>{
      project.save(()=>{
        req.session.projId = null;
        res.redirect(`/projects/${projId}`);
      });
    });
  });
};

exports.inviteError = (req, res)=>{
  res.render('projects/invitationError', {title:'MC: Error', registerMessage: req.flash('registerMessage'), loginMssage: req.flash('loginMessage'),
  credentialsMessage:req.flash('error')});
};

exports.removeCollaborator = (req, res)=>{
  console.log('========== INSIDE ROUTES ==========');
  Project.findById(req.params.projId, (err, project)=>{
    project.removeCollaborator(req.body.collaboratorId, ()=>{
      project.save(()=>{
        console.log('========== POST SAVE ==========');
        res.send();
      });
    });
  });
};
