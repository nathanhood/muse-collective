/* jshint unused:false */

'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../../app/models/user.js');
var Project = traceur.require(__dirname + '/../../app/models/project.js');
var moment = require('moment');
var multiparty = require('multiparty');

exports.dashboard = (req, res)=>{
  var user = req.user;
  Project.findAllByUserId(user._id, projects=>{
    Project.sortProjectsByDate(projects, sortedProjects=>{
      Project.formatProjectDates(sortedProjects, finalProjects=>{

        Project.findCollaborationsByUserId(user._id, collabs=>{
          Project.formatProjectDates(collabs, finalCollabs=>{

            Project.findManagedCollaborations(finalProjects, managedCollabs=>{
              res.render('users/dashboard', {projects:finalProjects, user:user,
                collaborations:finalCollabs, managedCollaborations:managedCollabs, title:'MC: Dashboard'});
            });
          });
        });
      });
    });
  });
};


exports.registration = (req, res)=>{
  if(!req.user){
    res.render('users/register', {title: 'MC: Registration', message: req.flash('registerMessage')});
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
  res.render('users/profile', {user: req.user, title: 'MC: Profile'});
};

exports.password = (req, res)=>{
  res.render('users/password', {message: req.flash('passwordMessage'), title: 'MC: Change Password'});
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

exports.updatePhoto = (req, res)=>{
  var form = new multiparty.Form();
  form.parse(req, (err, fields, files)=>{
    User.findById(req.user._id, (err, user)=>{
      user.updatePhoto(files.photo[0], ()=>{
        user.save(()=>{
          res.redirect('/profile');
        });
      });
    });
  });
};
