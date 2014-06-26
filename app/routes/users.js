/* jshint unused:false */

'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../../app/models/user.js');
var Project = traceur.require(__dirname + '/../../app/models/project.js');
var moment = require('moment');
var multiparty = require('multiparty');

exports.dashboard = (req, res)=>{
  var user = req.user;
  Project.findAllByUserId(user._id, p=>{
    // if(projects.length > 0){
      // Project.sortProjectsByDate(projects, p=>{
        p = p.map(proj=>{
          proj.dateCreated = moment(proj.dateCreated).format('MMMM Do YYYY');
          return proj;
        });
        Project.findCollaborationsByUserId(user._id, (collabs)=>{
          collabs = collabs.map(c=>{
            c.dateCreated = moment(c.dateCreated).format('MMMM Do YYYY');
            return c;
          });
          res.render('users/dashboard', {projects:p, user:user, collaborations:collabs, title:'MC: Dashboard'});
        });
      // });
    // }else{
    //   res.render('users/dashboard', {user:user, title:'MC: Dashboard'});
    // }
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

// exports.inviteRegistration = (req, res)=>{
//   console.log('======== INVITE REGISTRATION ==========');
//   var projId = req.params.projId;
//   if(!req.user){
//     User.findByEmail(req.body.email, (err, user)=>{
//       if(user){
//         req.flash('registerMessage', 'That email is already taken');
//         res.render('users/invite-login', {title:'MC: Confirm Invitation', message:req.flash('registerMessage')});
//       }else{
//         var newUser = new User();
//         newUser.local.email = req.body.email;
//         newUser.local.password = newUser.generateHash(req.body.password);
//         newUser.save(()=>{
//           req.user = newUser;
//           console.log('================REQ.USER===========');
//           console.log(req.user);
//           res.redirect('/projects/${projId}');
//         });
//       }
//     });
//   }
// };
