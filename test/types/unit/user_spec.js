/* global describe, before, beforeEach, it */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'write-aid-test';

var expect = require('chai').expect;
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var Mongo = require('mongodb');

var User;
var Project;


describe('projects', function(){

  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      Project = traceur.require(__dirname + '/../../../app/models/project.js');
      done();
    });
  });


  beforeEach(function(done){
    global.nss.db.collection('projects').drop(function(){
      factory('project', function(projects){
        done();
      });
    });
  });

  describe('#updateLocation', function(){
    it('should update the location for a user', function(done){
      User.findById('53a0c3c135451bfc446534e8', function(err, user){
        var body = {'location': '37210'};
        user.updateLocation(body, function(u){
          expect(u.location).to.equal('37210');
          expect(u).to.be.instanceof(User);
          done();
        });
      });
    });
  });

  describe('#addFriend', function(){
    it('should add a userId to friends array for a user', function(done){
      User.findById('53a0c3c135451bfc446534e8', function(err, user){
        // will be in objectID format after finding user object by Id
        var userId = Mongo.ObjectID('53a0c3c135451bfc446534e9');
        user.addFriend(userId, function(u){
          expect(u.friends[0]).to.deep.equal(Mongo.ObjectID('53a0c3c135451bfc446534e9'));
          expect(u).to.be.instanceof(User);
          done();
        });
      });
    });
  });

  describe('#addProject', function(){
    it('should add a projectId to projects array after project has been created', function(done){
      User.findById('53a0c3c135451bfc446534e8', function(err, user){
        Project.findById('53a0f350140b1f584c054ed6', function(err, project){
          user.addProject(project._id, function(u){
            expect(u.projects[0]).to.deep.equal(Mongo.ObjectID('53a0f350140b1f584c054ed6'));
            expect(u).to.be.instanceof(User);
            done();
          });
        });
      });
    });
  });

  describe('#addInfluence', function(){
    it('should normalize and add influence to influences array for a user', function(done){
      User.findById('53a0c3c135451bfc446534e8', function(err, user){
        // add one influence at a time via AJAX
        var body = {'influence': '  bob dylan'};
        user.addInfluence(body, function(u){
          expect(u.influences[0]).to.equal('bob dylan');
          expect(u).to.be.instanceof(User);
          done();
        });
      });
    });
  });

  describe('#addGenre', function(){
    it('should normalize and add influence to influences array for a user', function(done){
      User.findById('53a0c3c135451bfc446534e8', function(err, user){
        // add one influence at a time via AJAX. selecting from dropdown
        var body = {'genre': 'gothic poetry'};
        user.addGenre(body, function(u){
          expect(u.genres[0]).to.equal('gothic poetry');
          expect(u).to.be.instanceof(User);
          done();
        });
      });
    });
  });

  describe('#updateBio', function(){
    it('should update bio for a user', function(done){
      User.findById('53a0c3c135451bfc446534e8', function(err, user){
        // add one influence at a time via AJAX. selecting from dropdown
        var body = {'bio': 'this is an example biography that someone is writing for their account.'};
        user.updateBio(body, function(u){
          expect(u.bio).to.equal('this is an example biography that someone is writing for their account.');
          expect(u).to.be.instanceof(User);
          done();
        });
      });
    });
  });

});
