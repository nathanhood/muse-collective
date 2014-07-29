/* global describe, before, beforeEach, it, afterEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'write-aid-test';

var expect = require('chai').expect;
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var Mongo = require('mongodb');
var cp = require('child_process');
var fs = require('fs');

var User;
var Project;
var Note;

describe('projects', function(){

  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      Project = traceur.require(__dirname + '/../../../app/models/project.js');
      Note = traceur.require(__dirname + '/../../../app/models/note.js');
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


  describe('.create', function(){
    it('should successfully create a project', function(done){
      Project.create({'userId': '53a0c3c135451bfc446534e8', 'title': 'story 1', 'type': 'short story', 'privacy': 'private', 'status': 'finished'}, function(project){
        expect(project).to.be.instanceof(Project);
        expect(project._id).to.be.instanceof(Mongo.ObjectID);
        expect(project.title).to.equal('story 1');
        expect(project.type).to.equal('short story');
        expect(project.boards).to.have.length(0);
        expect(project.collaborators).to.have.length(0);
        expect(project.critics).to.have.length(0);
        expect(project.privacy).to.equal('private');
        expect(project.status).to.equal('finished');
        expect(project.userId).to.deep.equal(Mongo.ObjectID('53a0c3c135451bfc446534e8'));
        done();
      });
    });
  });

  describe('.findAllByUserId', function(){
    it('should find projects by user id', function(done){
      Project.findAllByUserId('53a0c3c135451bfc446534e8', function(projects){
        expect(projects).to.have.length(2);
        expect(projects[0]).to.be.instanceof(Project);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a project by Object Id', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        expect(project).to.be.instanceof(Project);
        expect(project.title).to.equal('song idea 1');
        done();
      });
    });
  });

  describe('#updateDraftText', function(){
    it('should successfully replace existing draftText content', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        var body = {'draft':'This is a string that represents a short draft of someone\'s work.'};
        project.updateDraftText(body, function(p){
          expect(p.draftText).to.equal('This is a string that represents a short draft of someone\'s work.');
          expect(p).to.be.instanceof(Project);
          done();
        });
      });
    });
  });

  describe('#updateDraftAudio', function(){
    beforeEach(function(done){
      cp.execFile(__dirname + '/../../fixtures/audio-before.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
        done();
      });
    });

    //destroy method below is removing directories in place of exec file
    afterEach(function(done){
      cp.execFile(__dirname + '/../../fixtures/audio-after.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
        done();
      });
    });

    it('should successfully add draftAudio content', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        var files = {audio:[{originalFilename:'test1-DELETE.mp3', path:__dirname + '/../../fixtures/audio-copy/test1-DELETE.mp3', size:10}]};
        project.updateDraftAudio(files.audio[0], function(p){
          var imgExists = fs.existsSync(__dirname + '/../../../app/static/audio/53a0c3c135451bfc446534e8/53a0f350140b1f584c054ed6/'+p.draftAudio.fileName+'');
          expect(imgExists).to.be.true;
          expect(p.draftAudio).to.be.ok;
          expect(p.draftAudio.origFileName).to.deep.equal('test1-DELETE.mp3');
          expect(p).to.be.instanceof(Project);
          done();
        });
      });
    });

    it('should successfully replace existing draftAudio content', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        var files = {audio:[{originalFilename:'test1-DELETE.mp3', path:__dirname + '/../../fixtures/audio-copy/test1-DELETE.mp3', size:10}]};
        project.updateDraftAudio(files.audio[0], function(updatedProj){

          var files2 = {audio:[{originalFilename:'test2-DELETE.mp3', path:__dirname + '/../../fixtures/audio-copy/test2-DELETE.mp3', size:10}]};
          var imgNotExists = __dirname + '/../../../app/static/audio/53a0c3c135451bfc446534e8/53a0f350140b1f584c054ed6/'+updatedProj.draftAudio.fileName+'';

          updatedProj.updateDraftAudio(files2.audio[0], function(p){
            imgNotExists = fs.existsSync(imgNotExists);

            var imgExists = fs.existsSync(__dirname + '/../../../app/static/audio/53a0c3c135451bfc446534e8/53a0f350140b1f584c054ed6/'+p.draftAudio.fileName+'');
            expect(imgNotExists).to.be.false;
            expect(imgExists).to.be.true;
            expect(p.draftAudio).to.be.ok;
            expect(p.draftAudio.origFileName).to.deep.equal('test2-DELETE.mp3');
            expect(p).to.be.instanceof(Project);
            done();
          });
        });
      });
    });

  });


  describe('#destroy', function(){
    it('should successfully remove a project from the DB & directories from img and audio dir', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        project.destroy(function(writeResult){
          Project.findById('53a0f350140b1f584c054ed6', function(err, p){
            expect(p).to.equal(null);
            expect(writeResult).to.equal(1);
            done();
          });
        });
      });
    });
  });


  describe('#updateTitle', function(){
    it('should successfully update a project title', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        var body = {'title':'new title'};
        project.updateTitle(body, function(p){
          expect(p.title).to.equal('new title');
          expect(p).to.be.instanceof(Project);
          done();
        });
      });
    });
  });

  describe('#addCollaborator', function(){
    it('should successfully add a collaborator id to collaborators array', function(done){
      Project.create({'userId': '53a0c3c135451bfc446534e8', 'title': 'story 1', 'type': 'short story', 'privacy': 'private', 'status': 'finished'}, function(project){
        Project.findById('53a0f350140b1f584c054ed6', function(err, collaborator){
          project.addCollaborator(collaborator._id, function(p){
            expect(p.collaborators).to.have.length(1);
            expect(p.collaborators[0]).to.deep.equal(Mongo.ObjectID('53a0f350140b1f584c054ed6'));
            expect(p).to.be.instanceof(Project);
            done();
          });
        });
      });
    });
  });

  describe('#addCritics', function(){
    it('should successfully add a critic id to critics array', function(done){
      Project.create({'userId': '53a0c3c135451bfc446534e8', 'title': 'story 1', 'type': 'short story', 'privacy': 'private', 'status': 'finished'}, function(project){
        Project.findById('53a0f350140b1f584c054ed6', function(err, critic){
          project.addCritic(critic._id, function(p){
            expect(p.critics).to.have.length(1);
            expect(p.critics[0]).to.deep.equal(Mongo.ObjectID('53a0f350140b1f584c054ed6'));
            expect(p).to.be.instanceof(Project);
            done();
          });
        });
      });
    });
  });

  describe('#updatePrivacy', function(){
    it('should successfully switch privacy to public from private', function(done){
      Project.create({'userId': '53a0c3c135451bfc446534e8', 'title': 'story 1', 'type': 'short story', 'privacy': 'private', 'status': 'finished'}, function(project){
        var body = {'privacy':'public'};
        project.updatePrivacy(body, function(p){
          expect(p.privacy).to.equal('public');
          expect(p).to.be.instanceof(Project);
          done();
        });
      });
    });
  });

  describe('#updateStatus', function(){
    it('should successfully change project status', function(done){
      Project.findById('53a0f350140b1f584c054ed6', function(err, project){
        var body = {'status':'some status'};
        project.updateStatus(body, function(p){
          expect(p.status).to.equal('some status');
          expect(p).to.be.instanceof(Project);
          done();
        });
      });
    });
  });

});
